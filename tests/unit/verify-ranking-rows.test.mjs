import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { BASE_SCHEMA, createWindow, normalizeSchema, RULES_MARK, SEAL_BREAK_GAUGE } from "../../src/gauntlet/gauntletEngine.js";
import { getSeasonScore } from "../../src/seasonScore.js";
import { isSealedCash, isTimeOffClock, readSeed, recheckCaseWindows, recheckRun, WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { openTraced, recordClosedWindow, reduceTraced } from "../../src/gauntlet/windowTrail.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { CHAIN_MARK } from "../../src/chainRecheck.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { fetchRunRows, formatChain, formatReport, groupByRun, marksSql, rankingRunsSql, readRows, readRunIds, runRowsSql, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/**
 * The fixed rows the checker is tested on: one season of the season player,
 * its final case written as the page will write it once the record ships --
 * each entry's threshold as useChoiceCommit logs it and its replay record --
 * and the ranking row the server copies from it. Built from a seed, so the
 * same every run, with no project to read from.
 */
function seasonRows(runId = "run-a") {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const { caseResults, final } = createSeasonBot({ seed: 11, reduce: recorder.reduce }).playSeason(0, "balanced", false, ({ verdict }) => verdicts.push(verdict));
  const count = final.log.length;
  const windows = recorder.closed.slice(-count);
  const settled = verdicts.slice(-count);
  const decisionLog = final.log.map((entry, index) => ({ ...entry, threshold: { ...entry.threshold, ...thresholdOfVerdict(settled[index]) }, [WINDOW_RECORD_KEY]: windows[index].record }));
  const dynamics = { tableRules: RULES_MARK };
  return [
    { run_id: runId, case_id: "final", summary: caseResults.final, decision_log: decisionLog, resources: final.resources, dynamics },
    { run_id: runId, case_id: "season-final", summary: { ...caseResults.final }, decision_log: [], resources: final.resources, dynamics },
  ];
}

const edit = (rows, change) => {
  const [finalRow, rankingRow] = structuredClone(rows);
  change(finalRow, rankingRow);
  return [finalRow, rankingRow];
};

test("an honest run is checked whole and earns no mark", () => {
  const rows = seasonRows();
  const result = recheckRun(rows);
  assert.equal(result.status, "checked");
  assert.deepEqual(result.marks, []);
  const [finalCase] = result.cases;
  assert.equal(finalCase.score.status, "match");
  assert.equal(finalCase.windows.counts.match, rows[0].decision_log.length);
  assert.equal(finalCase.windows.counts.unrecorded, 0);
});

test("a score edited on the case row or on the ranking row is marked score-off-log", () => {
  const rows = seasonRows();
  const raised = edit(rows, (finalRow) => {
    finalRow.summary.burstScore = (finalRow.summary.burstScore + 9) % 101;
  });
  assert.deepEqual(recheckRun(raised).marks, ["score-off-log"]);
  const copied = edit(rows, (finalRow, rankingRow) => {
    rankingRow.summary.rank = rankingRow.summary.rank === "S" ? "A" : "S";
  });
  const result = recheckRun(copied);
  assert.deepEqual(result.marks, ["score-off-log"]);
  assert.deepEqual(result.rankingDiffers, ["rank"]);
});

test("the ranking row's score is the mean of the run's case rows (C-2, Q25): the finale's own score where they differ is marked", () => {
  const [finalRow, rankingRow] = seasonRows("run-mean");
  const other = { ...structuredClone(finalRow), case_id: "case01", decision_log: [] };
  other.summary = { ...other.summary, burstScore: (finalRow.summary.burstScore + 40) % 101, momentumScore: (finalRow.summary.momentumScore + 40) % 101 };
  delete other.summary.cognitionMix;
  const caseRows = { case01: other.summary, final: finalRow.summary };
  const mean = getSeasonScore(caseRows);
  assert.notEqual(mean.burstScore, finalRow.summary.burstScore, "the fixture's mean is the finale's own score; it proves nothing");
  const honest = recheckRun([other, finalRow, { ...rankingRow, summary: { ...rankingRow.summary, ...mean } }]);
  assert.deepEqual(honest.rankingDiffers, []);
  const finaleOwn = recheckRun([other, finalRow, rankingRow]);
  assert.ok(finaleOwn.marks.includes("score-off-log"));
  assert.ok(finaleOwn.rankingDiffers.includes("burstScore"));
});

test("a window edited in the log, or its response time, is marked window-off-replay", () => {
  const rows = seasonRows();
  const pushed = edit(rows, (finalRow) => {
    finalRow.decision_log[0].threshold.pushes += 1;
  });
  const result = recheckRun(pushed);
  assert.deepEqual(result.marks, ["window-off-replay"]);
  assert.deepEqual(result.cases[0].windows.findings[0], { index: 0, status: "mismatch", differs: ["pushes"], problem: null });
  // A response time moved off the window clock (the rhythm score reads it) is caught on the window itself.
  const slowed = edit(rows, (finalRow) => {
    finalRow.decision_log[1].responseTimeSec += 9;
  });
  const slowedResult = recheckRun(slowed);
  assert.ok(slowedResult.marks.includes("window-off-replay"));
  assert.deepEqual(slowedResult.cases[0].windows.findings.map((finding) => finding.differs), [["responseTime"]]);
});

test("a run with a case under other table rules is not checked", () => {
  const rows = edit(seasonRows(), (finalRow) => {
    finalRow.dynamics.tableRules = RULES_MARK - 1;
  });
  assert.deepEqual(recheckRun(rows), { status: "unverified", marks: [], cases: [] });
});

test("a sealed card cashed below its seal is caught; at the seal, or played by the room, it is not", () => {
  // p1_start deals a hand whose richest card a sealed board locks.
  const schema = normalizeSchema({ ...BASE_SCHEMA, sealHighest: true });
  const window = { ...createWindow({ schema, seed: "seal" }), status: "cashed", gauge: schema.sealBreak - 1 };
  const entry = { nodeId: "p1_start", choiceId: "p1_start_draft", threshold: { forced: false } };
  assert.equal(isSealedCash(entry, window), true);
  assert.equal(isSealedCash(entry, { ...window, gauge: schema.sealBreak }), false);
  assert.equal(isSealedCash({ ...entry, threshold: { forced: true } }, window), false);
  assert.equal(isSealedCash({ ...entry, choiceId: "another" }, window), false);
  assert.equal(isSealedCash(entry, { ...window, schema: BASE_SCHEMA }), false);
  assert.equal(isSealedCash(entry, { ...window, status: "bust" }), false);
  assert.ok(schema.sealBreak <= SEAL_BREAK_GAUGE);
});

test("the response time is read against the record's end, a second either way", () => {
  assert.equal(isTimeOffClock({ responseTimeSec: 12 }, { end: 12.4 }), false);
  assert.equal(isTimeOffClock({ responseTimeSec: 13 }, { end: 12.5 }), false);
  assert.equal(isTimeOffClock({ responseTimeSec: 1 }, { end: 0.2 }), false);
  assert.equal(isTimeOffClock({ responseTimeSec: 20 }, { end: 12.4 }), true);
  // A window closed with its clock at 0 is timed by the wall clock.
  assert.equal(isTimeOffClock({ responseTimeSec: 30 }, { end: 0 }), false);
  assert.equal(isTimeOffClock({}, { end: 4 }), false);
});

test("the checker reads runs from exported rows and reports each ranked one", () => {
  const rows = [...seasonRows("run-a"), ...edit(seasonRows("run-b"), (finalRow) => {
    finalRow.summary.burstScore = (finalRow.summary.burstScore + 9) % 101;
  }), { run_id: "run-c", case_id: "final" }, { case_id: "final" }];
  assert.deepEqual([...groupByRun(rows).keys()], ["run-a", "run-b", "run-c"]);
  const results = verifyRows(rows);
  assert.deepEqual(results.map((result) => [result.runId, result.marks]), [["run-a", []], ["run-b", ["score-off-log"]]]);
  const report = formatReport(results).join("\n");
  assert.match(report, /run-a .* no marks/);
  assert.match(report, /run-b .* marks: score-off-log/);
  assert.match(report, /final: score mismatch \(burstScore\)/);
  assert.deepEqual(formatReport([]), ["No ranked run among the rows (none has a season-final row)."]);
  assert.deepEqual(readRows(JSON.stringify({ rows })), readRows(JSON.stringify(rows)));
  assert.throws(() => readRows("{}"), /no array of rows/);
});

test("the report names unchecked runs, window findings and rows written before the record", () => {
  const [finalRow, rankingRow] = edit(seasonRows(), (row, ranking) => {
    row.decision_log[0].threshold.wall += 1;
    delete row.decision_log[1][WINDOW_RECORD_KEY];
    ranking.summary.rank = "Z";
  });
  const lines = formatReport(verifyRows([finalRow, rankingRow]));
  assert.ok(lines.some((line) => /final #0: window mismatch wall/.test(line)));
  assert.ok(lines.some((line) => /1 windows carry no replay record/.test(line)));
  assert.ok(lines.some((line) => /ranking row differs from the case rows \(score: their mean; the rest: the final case row\): rank/.test(line)));
  const other = edit(seasonRows(), (row) => {
    row.dynamics.tableRules = 1;
  });
  assert.match(formatReport(verifyRows(other))[0], /not checked/);
});

test("the remote read is GET only, with the service key, and says when there is none", async () => {
  const calls = [];
  const rows = seasonRows();
  const fetchFn = async (url, init) => {
    calls.push({ url, init });
    const body = calls.length === 1 ? [{ run_id: "run-a" }, { run_id: "run-a" }, { run_id: null }] : rows;
    return { ok: true, status: 200, json: async () => body };
  };
  const read = await fetchRunRows({ url: "https://example.supabase.co/", key: "service", limit: 5, fetchFn });
  assert.equal(read, rows);
  assert.ok(calls.every(({ init }) => init.method === "GET" && init.headers.apikey === "service"));
  assert.match(calls[0].url, /\/rest\/v1\/playtest_sessions\?select=run_id&case_id=eq\.season-final&order=score\.desc\.nullslast&limit=5$/);
  assert.match(calls[1].url, /run_id=in\.\(%22run-a%22\)$/);
  await assert.rejects(fetchRunRows({ url: "https://example.supabase.co", key: "", fetchFn }), /service key only/);
  await assert.rejects(fetchRunRows({ url: "https://x", key: "k", fetchFn: async () => ({ ok: false, status: 401 }) }), /answered 401/);
  assert.deepEqual(await fetchRunRows({ url: "https://x", key: "k", fetchFn: async () => ({ ok: true, json: async () => [] }) }), []);
});


test("the CI read is split, each query one SELECT and nothing else, and the public log names runs by their tag", () => {
  const writes = /\b(insert|update|delete|truncate|alter|drop|create|grant|call|do)\b/i;
  // The run list: one statement (a single semicolon, at the end), run ids only.
  const list = rankingRunsSql({ limit: 7 });
  assert.equal(list.indexOf(";"), list.length - 1);
  assert.match(list, /^select run_id from public\.playtest_sessions\n/);
  assert.match(list, /order by score desc limit 7;$/);
  assert.doesNotMatch(list, writes);
  assert.match(rankingRunsSql({ limit: 1e9 }), /limit 500;$/);
  assert.match(rankingRunsSql({ limit: "x" }), /limit 20;$/);
  // With each hall of fame board's candidates beside the top `limit`: still one SELECT, run ids only.
  const boards = rankingRunsSql({ limit: 7, perBoard: 10 });
  assert.equal(boards.indexOf(";"), boards.length - 1);
  assert.match(boards, /^select run_id from \(\n/);
  assert.match(boards, /\n where overall <= 7 or \(candidate and on_board <= 10\)\n order by score desc;$/);
  assert.match(boards, /s\.suspicion <@ array\['score-off-log', 'window-off-replay', 'window-no-replay', 'chain-off-log'\]::text\[\]/);
  assert.match(boards, /h\.settled_at is not null/);
  assert.doesNotMatch(boards, writes);
  assert.equal(rankingRunsSql({ limit: 7, perBoard: 0 }), list);
  assert.match(rankingRunsSql({ perBoard: 1e9 }), /on_board <= 100\)/);
  // One run's rows: one statement, that run only, its id quoted.
  const one = runRowsSql("run-'x");
  assert.equal(one.indexOf(";"), one.length - 1);
  assert.match(one, /\n where run_id = 'run-''x'\n order by case_id;$/);
  assert.match(one, /^select run_id, run_tag, case_id, summary, decision_log, resources, dynamics, completed_at, suspicion\n/);
  assert.doesNotMatch(one, writes);
  assert.throws(() => runRowsSql(""), /non-empty/);
  assert.deepEqual(readRunIds(JSON.stringify({ rows: [{ run_id: "b" }, { run_id: "a" }, { run_id: "b" }, { run_id: null }] })), ["b", "a"]);
  const rows = seasonRows("secret-run-id");
  rows[1].run_tag = "CP-7Q2X";
  const results = [...verifyRows(rows), ...verifyRows(seasonRows("other-secret"))];
  const redacted = formatReport(results, { redact: true }).join("\n");
  assert.doesNotMatch(redacted, /secret/);
  assert.match(redacted, /^CP-7Q2X {2}score/m);
  assert.match(redacted, /^run 2 {2}score/m);
});

test("rows whose jsonb columns came out as text are read as the objects they are", () => {
  const rows = seasonRows("run-text");
  const asText = rows.map((row) => ({ ...row, summary: JSON.stringify(row.summary), decision_log: JSON.stringify(row.decision_log), dynamics: JSON.stringify(row.dynamics) }));
  const read = readRows(JSON.stringify({ rows: asText }));
  assert.deepEqual(read, rows);
  assert.deepEqual(verifyRows(read).map((result) => result.marks), [[]]);
});

test("the CI write states every checked run's marks in one statement, quoted, and leaves unchecked runs out", () => {
  const sql = marksSql([
    { status: "checked", runId: "run-a", marks: ["score-off-log", "window-off-replay"] },
    { status: "unrecorded", runId: "run-'b", marks: [] },
    { status: "unverified", runId: "run-c", marks: [] },
  ]);
  assert.equal(sql.indexOf(";"), sql.length - 1);
  assert.match(sql, /\('run-a', array\['score-off-log', 'window-off-replay'\]::text\[\], true\)/);
  assert.match(sql, /\('run-''b', array\[\]::text\[\], false\)/);
  assert.doesNotMatch(sql, /run-c/);
  assert.doesNotMatch(sql, /\b(insert|update|delete|truncate|alter|drop|create|grant)\b/i);
  assert.equal(marksSql([{ status: "unverified", runId: "run-c", marks: [] }]), null);
  // Built from a real report: the honest run is written with no marks.
  assert.match(marksSql(verifyRows(seasonRows("run-real"))), /\('run-real', array\[\]::text\[\], true\)/);
});

/**
 * A case row as the page writes it now: windows dealt from the seeds the page
 * deals (`run_id:windowIndex:nodeId`), each with its replay record, and the
 * run's window count after the case in `dynamics`.
 */
function dealtRow({ runId = "run-s", caseId = "prologue01", first = 10, seeds = null, nodeIds = ["p1_start", "p1_start", "p1_start"] } = {}) {
  const decisionLog = nodeIds.map((nodeId, place) => {
    const seed = seeds?.[place] ?? `${runId}:${first + place}:${nodeId}`;
    let window = reduceTraced(openTraced({ seed }), { type: "SELECT", id: "a" });
    for (let tick = 0; tick < 6; tick += 1) window = reduceTraced(window, { type: "TICK", delta: 0.21 });
    window = reduceTraced(reduceTraced(window, { type: "PUSH" }), { type: "CASH" });
    const threshold = { busted: false, cause: "cash", gauge: Math.round(window.gauge), wall: window.wall, pushes: window.pushes, forced: false };
    return { nodeId, choiceId: "unit-card", responseTimeSec: Math.max(1, Math.round(window.elapsed)), threshold, [WINDOW_RECORD_KEY]: recordClosedWindow(window) };
  });
  return { run_id: runId, case_id: caseId, summary: {}, decision_log: decisionLog, dynamics: { tableRules: RULES_MARK, windowIndex: first + nodeIds.length } };
}

test("a window's seed is the one the page deals at its place in the run, a re-deal tail aside", () => {
  assert.equal(readSeed("run-s:3:p1_start", { runId: "run-s", windowIndex: 3, nodeId: "p1_start" }), "base");
  assert.equal(readSeed("run-s:3:p1_start~2", { runId: "run-s", windowIndex: 3, nodeId: "p1_start" }), "tail");
  for (const seed of ["run-s:3:p1_start~0", "run-s:3:p1_start~50", "run-s:3:p1_startx", "run-s:4:p1_start", "other:3:p1_start", null]) {
    assert.equal(readSeed(seed, { runId: "run-s", windowIndex: 3, nodeId: "p1_start" }), "off", String(seed));
  }
  const honest = recheckCaseWindows(dealtRow());
  assert.deepEqual([honest.counts.match, honest.seedTails, honest.findings], [3, 0, []]);
  const redealt = recheckCaseWindows(dealtRow({ seeds: [null, "run-s:11:p1_start~1", null] }));
  assert.deepEqual([redealt.counts.match, redealt.seedTails], [3, 1]);
  // A seed picked for its wall replays to its threshold, and still does not pass.
  const picked = recheckCaseWindows(dealtRow({ seeds: [null, "run-s:11:p1_start-easy", null] }));
  assert.deepEqual(picked.findings, [{ index: 1, status: "mismatch", differs: ["seed"], problem: null }]);
  // The place is read from the case's window count: one off, and every seed is.
  const shifted = { ...dealtRow(), dynamics: { tableRules: RULES_MARK, windowIndex: 14 } };
  assert.equal(recheckCaseWindows(shifted).counts.mismatch, 3);
});

test("a run whose build writes records is marked for a window that has none; an older build's run is told apart", () => {
  const ranking = (runId) => ({ run_id: runId, case_id: "season-final", summary: {}, dynamics: { tableRules: RULES_MARK } });
  const strip = (row, places) => ({ ...row, decision_log: row.decision_log.map((entry, place) => (places.includes(place) ? { ...entry, [WINDOW_RECORD_KEY]: undefined } : entry)) });
  const first = dealtRow({ caseId: "prologue01", first: 0 });
  const second = dealtRow({ caseId: "prologue02", first: 3 });
  const marksOf = (rows) => recheckRun(rows).marks.filter((mark) => mark !== "score-off-log");
  assert.deepEqual(marksOf([first, second, ranking("run-s")]), []);
  // A record left out of the later case, or out of one window of the first.
  assert.deepEqual(marksOf([first, strip(second, [2]), ranking("run-s")]), ["window-no-replay"]);
  assert.deepEqual(marksOf([strip(first, [1]), second, ranking("run-s")]), ["window-no-replay"]);
  // Begun on an older build: its first case has no record at all, and is not marked.
  assert.deepEqual(marksOf([strip(first, [0, 1, 2]), second, ranking("run-s")]), []);
  // No record anywhere: not marked, and not checked either.
  const old = recheckRun([strip(first, [0, 1, 2]), strip(second, [0, 1, 2]), ranking("run-s")]);
  assert.equal(old.status, "unrecorded");
  assert.deepEqual(old.marks.filter((mark) => mark !== "score-off-log"), []);
  assert.match(formatReport([{ runId: "run-s", score: 1, caseRows: 2, ...old }]).join("\n"), /not replayed/);
  assert.match(marksSql([{ runId: "run-s", ...old }]), /'run-s', array\[.*\]::text\[\], false\)/);
});

/**
 * A whole season of the season player as the server stores it: one row per
 * closed case (its `dynamics` the run summary the close wrote, its log the
 * case's), and the ranking row. No replay record: the scores are worked out
 * again and the chain is read.
 */
function chainedRows(runId = "run-chain", seed = 20261021, { open = false } = {}) {
  const season = createSeasonBot({ seed, staged: STAGED }).playSeason(0, "balanced");
  // `open`: each row's dynamics as the page writes it since S3, the opening snapshot included.
  const rows = CASE_SEQUENCE.map((caseId) => ({ run_id: runId, case_id: caseId, summary: season.caseResults[caseId], decision_log: season.caseLogs[caseId], resources: null, dynamics: open ? season.caseDynamics[caseId] : season.caseResults[caseId].gauntlet }));
  rows.push({ run_id: runId, case_id: "season-final", summary: { ...season.caseResults.final, ...getSeasonScore(season.caseResults) }, decision_log: [], resources: null, dynamics: season.caseResults.final.gauntlet });
  return rows;
}

test("each run is chained too, and the chain's mark goes in the same call as phase 2's", () => {
  const honest = chainedRows();
  const [clean] = verifyRows(honest);
  assert.equal(clean.status, "unrecorded");
  assert.deepEqual(clean.marks, []);
  assert.equal(clean.chain.status, "linked");
  assert.equal(clean.chain.cases.length, CASE_SEQUENCE.length);
  // A vault taken down between two cases, and a score raised: both marks, one run, one tuple.
  const edited = structuredClone(honest);
  edited[20].dynamics.vault = edited[19].dynamics.vault - 1;
  const final = edited.find((row) => row.case_id === "final");
  final.summary.burstScore = (final.summary.burstScore + 9) % 101;
  const [marked] = verifyRows(edited);
  assert.deepEqual(marked.marks, ["score-off-log", CHAIN_MARK]);
  const sql = marksSql([clean, marked].map((result, place) => ({ ...result, runId: `run-${place}` })));
  assert.equal(sql.indexOf(";"), sql.length - 1);
  assert.match(sql, /\('run-0', array\[\]::text\[\], false\)/);
  assert.match(sql, /\('run-1', array\['score-off-log', 'chain-off-log'\]::text\[\], false\)/);
  assert.equal(sql.match(/run-1/g).length, 1);
  // A chain mark alone is written too: the phase 2 marks of that run are stated as none, not left out.
  const chainOnly = structuredClone(honest);
  chainOnly[30].dynamics.windowIndex = chainOnly[29].dynamics.windowIndex;
  assert.match(marksSql(verifyRows(chainOnly)), /\('run-chain', array\['chain-off-log'\]::text\[\], false\)/);
  // A run under other table rules is neither worked out nor chained.
  const other = structuredClone(honest);
  other[3].dynamics.tableRules = RULES_MARK - 1;
  const [skipped] = verifyRows(other);
  assert.equal(skipped.status, "unverified");
  assert.equal(skipped.chain, null);
});

test("the report says where the chain broke and what it did not check", () => {
  const rows = chainedRows();
  rows[20].dynamics.vault = rows[19].dynamics.vault - 1;
  rows.splice(40, 1);
  const report = formatReport(verifyRows(rows)).join("\n");
  assert.match(report, /chain: broken, 54 cases, 53 links read {2}marks: chain-off-log/);
  // Not replayed: the scores' line shows the scores' marks, the chain's line the chain's.
  assert.match(report, /\n {2}scores: {2}no marks\n/);
  assert.match(report, new RegExp(`chain break: ${rows[19].case_id} -> ${rows[20].case_id} vault \\(expected "\\+0 or more", found -1\\)`));
  assert.match(report, /chain not checked: 1 links \(a gap in the rows, or the counters missing\); the settlement of 54 cases; the opening state of 53 cases \(no opening snapshot\); the board and route 53 cases opened on$/m);
  assert.deepEqual(formatChain({ status: "unchecked", marks: [], breaks: [], cases: [], unchecked: { cases: 0, links: 0, fields: {} } }), ["  chain: not checked (no case row to chain)"]);
  const many = formatChain({ status: "broken", marks: [CHAIN_MARK], breaks: Array.from({ length: 12 }, () => ({ case: "case01", field: "case", found: "twice" })), cases: [], unchecked: { cases: 1, links: 0, fields: {} } });
  assert.equal(many[1], '  chain break: case01 case ("twice")');
  assert.ok(many.includes("  ... and 2 more chain breaks"));
  assert.ok(many.includes("  chain not checked: 1 cases with no readable log"));
});

test("the CLI lists runs, writes one run's read at a time, and reads the per-run files as one", () => {
  const script = fileURLToPath(new URL("../../scripts/verify-ranking-rows.mjs", import.meta.url));
  const dir = mkdtempSync(path.join(tmpdir(), "verify-ranking-"));
  try {
    const run = (...args) => execFileSync(process.execPath, [script, ...args], { encoding: "utf8" }).trim();
    writeFileSync(path.join(dir, "runs.json"), JSON.stringify([{ run_id: "secret-a" }, { run_id: "secret-b" }]));
    assert.equal(run("--runs-sql", "--limit=3"), rankingRunsSql({ limit: 3, perBoard: 10 }));
    assert.equal(run("--runs-sql", "--limit=3", "--per-board=0"), rankingRunsSql({ limit: 3 }));
    assert.equal(run("--hall-of-fame-counts-sql"), "select board, checked from public.hall_of_fame_counts() order by board;");
    assert.equal(run("--run-count", path.join(dir, "runs.json")), "2");
    assert.equal(run("--run-sql", path.join(dir, "runs.json"), "--at=2"), runRowsSql("secret-b"));
    assert.throws(() => execFileSync(process.execPath, [script, "--run-sql", path.join(dir, "runs.json"), "--at=3"], { stdio: "pipe" }), /from 1 to 2/);
    writeFileSync(path.join(dir, "1.json"), JSON.stringify(seasonRows("secret-a")));
    writeFileSync(path.join(dir, "2.json"), JSON.stringify({ rows: seasonRows("secret-b") }));
    const report = run(path.join(dir, "1.json"), path.join(dir, "2.json"), "--redact");
    assert.match(report, /^run 1 {2}score/m);
    assert.match(report, /^run 2 {2}score/m);
    assert.doesNotMatch(report, /secret/);
    assert.equal(run(path.join(dir, "1.json"), path.join(dir, "2.json"), "--marks-sql"), marksSql(verifyRows([...seasonRows("secret-a"), ...seasonRows("secret-b")])));
  } finally {
    for (const file of readdirSync(dir)) unlinkSync(path.join(dir, file));
    rmdirSync(dir);
  }
});

test("a whole season dealt the page's seeds is checked case by case with no mark, seeds and chain included", () => {
  // The bot deals `run_id:windowIndex:nodeId`, as GameRuntime's seedBase does, so
  // S1 reads every window's place back from each case's dynamics.windowIndex.
  const runId = "run-dealt";
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const bot = createSeasonBot({ seed: 1000, staged: STAGED, reduce: recorder.reduce, windowSeed: ({ windowIndex, nodeId }) => `${runId}:${windowIndex}:${nodeId}` });
  const season = bot.playSeason(0, "balanced", false, ({ verdict }) => verdicts.push(verdict));
  const total = CASE_SEQUENCE.reduce((sum, caseId) => sum + season.caseLogs[caseId].length, 0);
  let at = recorder.closed.length - total;
  let settled = verdicts.length - total;
  const rows = CASE_SEQUENCE.map((caseId) => ({
    run_id: runId,
    case_id: caseId,
    summary: season.caseResults[caseId],
    decision_log: season.caseLogs[caseId].map((entry) => ({ ...entry, threshold: { ...entry.threshold, ...thresholdOfVerdict(verdicts[settled++]) }, [WINDOW_RECORD_KEY]: recorder.closed[at++].record })),
    resources: null,
    // As the page writes it since S3: the run summary, the close, and the opening snapshot.
    dynamics: season.caseDynamics[caseId],
  }));
  rows.push({ run_id: runId, case_id: "season-final", summary: { ...season.caseResults.final, ...getSeasonScore(season.caseResults) }, decision_log: [], resources: null, dynamics: season.caseDynamics.final });
  const [result] = verifyRows(rows);
  assert.equal(result.status, "checked");
  assert.deepEqual(result.marks, []);
  assert.equal(result.cases.reduce((sum, entry) => sum + entry.windows.counts.match, 0), total);
  assert.equal(result.chain.status, "linked");
  // Every link read, its opening against the close before it (S3): nothing left as "no snapshot".
  assert.equal(result.chain.unchecked.links, 0);
  assert.equal(result.chain.unchecked.fields.open, undefined);
  assert.equal(result.chain.unchecked.fields.reopened, undefined);
  assert.doesNotMatch(formatChain(result.chain).join("\n"), /no opening snapshot/);
  // One case's opening edited (a vault carried in that the close before did not hold):
  // the chain marks it, and the mark goes in the run's one tuple with phase 2's none.
  const opened = structuredClone(rows);
  opened[12].dynamics.open.vault += 5;
  const [marked] = verifyRows(opened);
  assert.equal(marked.status, "checked");
  assert.deepEqual(marked.marks, [CHAIN_MARK]);
  assert.ok(marked.chain.breaks.some((found) => found.case === CASE_SEQUENCE[12] && found.field === "open.vault"));
  assert.match(marksSql([marked]), /\('run-dealt', array\['chain-off-log'\]::text\[\], true\)/);
  // A case's window count moved by one: its seeds are no longer the ones dealt at those places.
  const shifted = structuredClone(rows);
  shifted[10].dynamics.windowIndex += 1;
  shifted[11].dynamics.windowIndex += 1;
  assert.ok(verifyRows(shifted)[0].marks.includes("window-off-replay"));
});
