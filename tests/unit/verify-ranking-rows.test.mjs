import assert from "node:assert/strict";
import test from "node:test";

import { BASE_SCHEMA, createWindow, normalizeSchema, RULES_MARK, SEAL_BREAK_GAUGE } from "../../src/gauntlet/gauntletEngine.js";
import { isSealedCash, isTimeOffClock, recheckRun, WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { fetchRunRows, formatReport, groupByRun, rankingRowsSql, readRows, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
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
  assert.ok(lines.some((line) => /ranking row differs from the final case row: rank/.test(line)));
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


test("the CI read is one SELECT and nothing else, and the public log names runs by their tag", () => {
  const sql = rankingRowsSql({ limit: 7 });
  // One statement: a single semicolon, at the end.
  assert.equal(sql.indexOf(";"), sql.length - 1);
  assert.match(sql, /^with top_runs as \(/);
  assert.match(sql, /order by score desc limit 7\n/);
  assert.doesNotMatch(sql, /\b(insert|update|delete|truncate|alter|drop|create|grant|call|do)\b/i);
  assert.match(rankingRowsSql({ limit: 1e9 }), /limit 500\n/);
  assert.match(rankingRowsSql({ limit: "x" }), /limit 20\n/);
  const rows = seasonRows("secret-run-id");
  rows[1].run_tag = "CP-7Q2X";
  const results = [...verifyRows(rows), ...verifyRows(seasonRows("other-secret"))];
  const redacted = formatReport(results, { redact: true }).join("\n");
  assert.doesNotMatch(redacted, /secret/);
  assert.match(redacted, /^CP-7Q2X {2}score/m);
  assert.match(redacted, /^run 2 {2}score/m);
});
