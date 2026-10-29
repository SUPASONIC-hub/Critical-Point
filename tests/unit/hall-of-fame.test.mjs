import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { CHAIN_MARK } from "../../src/chainRecheck.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { getSeasonScore } from "../../src/seasonScore.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import {
  boardOf,
  formatHallOfFameMarkdown,
  HALL_OF_FAME_CANDIDATES,
  HALL_OF_FAME_COUNTS_SQL,
  HALL_OF_FAME_MIN_SEASONS,
  HALL_OF_FAME_READ_SQL,
  hallOfFameRefusal,
  hallOfFameSql,
  hallOfFameTags,
  pickHallOfFame,
  readHallOfFame,
  readHallOfFameCounts,
  weekSettlesOn,
} from "../../src/hallOfFame.js";
import { hallOfFameBadges, hallOfFameBoardLabel } from "../../src/hallOfFameBadges.js";
import rankingWords from "../../src/copy/ranking.js";
import { WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { formatHallOfFamePick, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/**
 * D2, the hall of fame (D2-명예의전당-설계안-20261021.md, all (1), question
 * 9 (1)). One whole season dealt the page's seeds, as verify-ranking-rows
 * tests it, is what a clean checked season looks like; the boards are tested
 * on results of that shape, since a board needs ten of them.
 */
function dealtSeason(runId = "run-hall") {
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
    dynamics: season.caseDynamics[caseId],
  }));
  rows.push({
    run_id: runId,
    run_tag: "RUNHALL1",
    case_id: "season-final",
    summary: { ...season.caseResults.final, ...getSeasonScore(season.caseResults), seasonComplete: true },
    decision_log: [],
    resources: null,
    dynamics: season.caseDynamics.final,
    suspicion: [],
  });
  return rows;
}

test("a whole checked season with no mark may stand; every gap in what was checked keeps it out", () => {
  const rows = dealtSeason();
  const [result] = verifyRows(rows);
  assert.equal(hallOfFameRefusal(result, rows), null);

  const ranking = (copy) => copy.find((row) => row.case_id === "season-final");
  // The trigger's mark keeps it out; the checker's own old mark does not (today's replace it).
  const triggered = structuredClone(rows);
  ranking(triggered).suspicion = ["time-over-gap"];
  assert.match(hallOfFameRefusal(result, triggered), /trigger: time-over-gap/);
  const stale = structuredClone(rows);
  ranking(stale).suspicion = ["score-off-log", CHAIN_MARK];
  assert.equal(hallOfFameRefusal(result, stale), null);
  // A row the trigger never judged is not clean.
  const unjudged = structuredClone(rows);
  ranking(unjudged).suspicion = null;
  assert.match(hallOfFameRefusal(result, unjudged), /never judged/);
  // Today's marks keep it out.
  const opened = structuredClone(rows);
  opened[12].dynamics.open.vault += 5;
  const [marked] = verifyRows(opened);
  assert.match(hallOfFameRefusal(marked, opened), /marked: chain-off-log/);
  // A window with no record, in a case before the run's first recorded one, is
  // not marked by the checker (fact 3) -- and still keeps it out of here.
  const unrecorded = structuredClone(rows);
  const firstWindows = unrecorded[0].decision_log.filter((entry) => entry.threshold && entry.threshold.cause !== "abandon");
  for (const entry of firstWindows) delete entry[WINDOW_RECORD_KEY];
  const [quiet] = verifyRows(unrecorded);
  assert.equal(quiet.status, "checked");
  assert.deepEqual(quiet.marks, [], "the fixture's missing records are marked; it proves nothing about the hall of fame's own rule");
  assert.ok(firstWindows.length > 0);
  assert.match(hallOfFameRefusal(quiet, unrecorded), new RegExp(`^${firstWindows.length} windows without a record`));
  // A case row missing: the chain was not read over the whole season.
  const gap = rows.filter((row) => row.case_id !== CASE_SEQUENCE[20]);
  assert.match(hallOfFameRefusal(verifyRows(gap)[0], gap), /chain/);
  // A story case, an unfinished season, a run not checked.
  const story = structuredClone(rows);
  story[3].summary.assistStory = true;
  assert.equal(hallOfFameRefusal(result, story), "story mode");
  const unfinished = structuredClone(rows);
  ranking(unfinished).summary.seasonComplete = false;
  assert.match(hallOfFameRefusal(result, unfinished), /not a complete season/);
  assert.match(hallOfFameRefusal({ ...result, status: "unrecorded" }, rows), /not checked \(unrecorded\)/);
  assert.match(hallOfFameRefusal({ ...result, status: "unverified" }, rows), /not checked \(unverified\)/);
});

/** A result of verifyRows' shape for a clean run, and its two rows. */
function cleanRun(n, { score = 60 + n, week = null, rank = "A", final = {}, ranking = {}, completedAt = `2026-11-${String(10 + (n % 15)).padStart(2, "0")}T00:00:00Z` } = {}) {
  const runId = `run-${n}`;
  const runTag = `TAG${String(n).padStart(5, "0")}`;
  const result = {
    runId,
    status: "checked",
    marks: [],
    cases: [{ caseId: "final", windows: { counts: { match: 6, mismatch: 0, unreplayable: 0, abandoned: 0, unrecorded: 0 } } }],
    chain: { status: "linked", marks: [], breaks: [], cases: CASE_SEQUENCE.map((caseId) => ({ caseId })), unchecked: { cases: 0, links: 0, fields: {} } },
  };
  const rows = [
    { run_id: runId, case_id: "final", summary: { burstScore: score, ...final } },
    { run_id: runId, run_tag: runTag, case_id: "season-final", completed_at: completedAt, suspicion: [], summary: { burstScore: score, rank, seasonComplete: true, reflectionScore: 50, pressureAdaptScore: 40, ...(week ? { week } : {}), ...ranking } },
  ];
  return { result, rows };
}

const pick = (runs, counts = {}, rulesMark = 3) => pickHallOfFame({ results: runs.map((run) => run.result), rows: runs.flatMap((run) => run.rows), rulesMark, counts: new Map(Object.entries(counts)) });

test("each board keeps its first three once ten seasons on the whole board have no mark, and says so below that", () => {
  const nine = Array.from({ length: HALL_OF_FAME_MIN_SEASONS - 1 }, (_, n) => cleanRun(n));
  assert.deepEqual(pick(nine, { "table-3": 9 }).boards, [{ board: "table-3", checked: 9, places: [] }]);
  // No count read: every board counts 0.
  assert.deepEqual(pick(nine).boards, [{ board: "table-3", checked: 0, places: [] }]);

  const ten = [...nine, cleanRun(20, { score: 99, final: { newGamePlus: true, assistTime: 1.5 }, ranking: { endingVariant: "collapse" } })];
  const [table] = pick(ten, { "table-3": 10 }).boards;
  assert.equal(table.checked, 10);
  assert.deepEqual(table.places.map((place) => place.run_tag), ["TAG00020", "TAG00008", "TAG00007"]);
  assert.deepEqual(table.places[0], { run_tag: "TAG00020", score: 99, rank: "A", style: "FIELD DECIDER", tags: ["NEW GAME+", "테이블 시간 ×1.5", "붕괴한 시즌"] });

  // Assumption 4, resolved: the ten are the whole board's, not the rows the
  // day's check read. Three candidates read on a board of 14 take its places.
  const weekly = Array.from({ length: 3 }, (_, n) => cleanRun(100 + n, { week: "2026-W47", score: 50 + n }));
  const boards = pick(weekly, { "table-3": 2, "2026-W47": 14, "2026-W40": 30 }).boards;
  // A week's rule board stands apart from the table's, and the table board is always written;
  // a board no run was read for today (settled, or nothing to replay) is left as it is.
  assert.deepEqual(boards.map((board) => [board.board, board.checked, board.places.length]), [["table-3", 2, 0], ["2026-W47", 14, 3]]);
  assert.deepEqual(boards[1].places.map((place) => place.score), [52, 51, 50]);

  // On a tie the earlier season, then the ranking's own tie-breaks.
  const tied = [...nine.slice(0, 8), cleanRun(30, { score: 95, completedAt: "2026-11-20T00:00:00Z" }), cleanRun(31, { score: 95, completedAt: "2026-11-18T00:00:00Z" })];
  assert.deepEqual(pick(tied, { "table-3": 40 }).boards[0].places.slice(0, 2).map((place) => place.run_tag), ["TAG00031", "TAG00030"]);
  const graded = [...nine.slice(0, 8), cleanRun(32, { score: 95, rank: "B", completedAt: "2026-11-01T00:00:00Z" }), cleanRun(33, { score: 95, rank: "S" })];
  assert.deepEqual(pick(graded, { "table-3": 40 }).boards[0].places.slice(0, 2).map((place) => place.run_tag), ["TAG00033", "TAG00032"]);
});

test("a refused run takes no place, its board is still written with its count, and the log says why by run tag", () => {
  const runs = Array.from({ length: 10 }, (_, n) => cleanRun(n, { score: 90 - n }));
  runs[0].result.marks = ["window-off-replay"];
  runs[1].rows[1].suspicion = ["rank-off-score"];
  runs[2].result.status = "unrecorded";
  const refusedWeek = cleanRun(50, { week: "2026-W48" });
  refusedWeek.result.marks = ["chain-off-log"];
  const picked = pick([...runs, refusedWeek], { "table-3": 12, "2026-W48": 3 });
  assert.deepEqual(picked.boards.map((board) => [board.board, board.checked, board.places.map((place) => place.run_tag)]), [
    ["table-3", 12, ["TAG00003", "TAG00004", "TAG00005"]],
    ["2026-W48", 3, []],
  ]);
  assert.deepEqual(picked.left.map((entry) => entry.runTag), ["TAG00000", "TAG00001", "TAG00002", "TAG00050"]);
  const lines = formatHallOfFamePick(picked).join("\n");
  assert.match(lines, /^본 판 \(판 규칙 3\): 12 checked seasons; 1\. RUN TAG00003 87/m);
  assert.match(lines, /^2026-W48: 3 checked seasons; 표본 부족$/m);
  assert.match(lines, /left out RUN TAG00001: marked by the trigger: rank-off-score/);
  assert.doesNotMatch(lines, /run-\d/, "a full run id reached the log");
});

test("the count is read apart, over the whole board, and the replay reads each board's first candidates", () => {
  assert.equal(HALL_OF_FAME_COUNTS_SQL.indexOf(";"), HALL_OF_FAME_COUNTS_SQL.length - 1);
  assert.doesNotMatch(HALL_OF_FAME_COUNTS_SQL, /\b(insert|update|delete|truncate|alter|drop|create|grant|call|do)\b/i);
  assert.ok(HALL_OF_FAME_CANDIDATES >= HALL_OF_FAME_MIN_SEASONS, "a board of exactly ten clean seasons should be replayed whole");
  const counts = readHallOfFameCounts([{ board: "table-3", checked: 12 }, { board: "2026-W47", checked: "4" }, { board: "x", checked: -1 }, { board: 3, checked: 1 }, null]);
  assert.deepEqual([...counts], [["table-3", 12], ["2026-W47", 4]]);
  assert.equal(readHallOfFameCounts(null).size, 0);
  // A plain object serves as well as a Map.
  const [run] = [cleanRun(1)];
  assert.equal(pickHallOfFame({ results: [run.result], rows: run.rows, rulesMark: 3, counts: { "table-3": 11 } }).boards[0].checked, 11);
});

test("boards, tags and the settle statement", () => {
  assert.equal(boardOf({ summary: { week: "2026-W47" } }, 3), "2026-W47");
  assert.equal(boardOf({ summary: { week: null } }, 3), "table-3");
  assert.equal(boardOf({ summary: { week: "W47" } }, 4), "table-4");
  assert.deepEqual(hallOfFameTags([{ case_id: "final", summary: { assistTime: 2 } }, { case_id: "season-final", summary: { endingVariant: { id: "collapse" } } }]), ["테이블 시간 ×2", "붕괴한 시즌"]);
  assert.deepEqual(hallOfFameTags([{ case_id: "season-final", summary: { assistTime: 1, endingVariant: "seal" } }]), []);
  const sql = hallOfFameSql([{ board: "table-3", checked: 0, places: [{ run_tag: "O'NEIL", score: 1, rank: "C", style: "FIELD DECIDER", tags: [] }] }]);
  assert.equal(sql.indexOf(";"), sql.length - 1);
  assert.doesNotMatch(sql, /checked/, "the function counts each board itself");
  assert.match(sql, /^select public\.hall_of_fame_settle\('\[.*O''NEIL.*\]'::jsonb\) as settled;$/);
  assert.equal(HALL_OF_FAME_READ_SQL.indexOf(";"), HALL_OF_FAME_READ_SQL.length - 1);
  assert.doesNotMatch(HALL_OF_FAME_READ_SQL, /\b(insert|update|delete|truncate|alter|drop|create|grant|call|do)\b/i);
});

test("a week's board settles four weeks after its Monday (question 9 (1))", () => {
  assert.equal(weekSettlesOn("2026-W44"), "2026-11-23");
  assert.equal(weekSettlesOn("2026-W47"), "2026-12-14");
  assert.equal(weekSettlesOn("2027-W01"), "2027-02-01");
  assert.equal(weekSettlesOn("2026-W01", 0), "2025-12-29");
  assert.equal(weekSettlesOn("table-3"), null);
});

const viewRows = [
  { board: "2026-W46", kind: "week", checked_seasons: 4, settled_on: null, updated_on: "2026-11-30", place: null, run_tag: null, score: null, rank: null, style: null, tags: null },
  { board: "2026-W47", kind: "week", checked_seasons: 12, settled_on: "2026-12-14", updated_on: "2026-12-14", place: 2, run_tag: "BBBB2222", score: 81, rank: "A", style: "RISK CUTTER", tags: [] },
  { board: "2026-W47", kind: "week", checked_seasons: 12, settled_on: "2026-12-14", updated_on: "2026-12-14", place: 1, run_tag: "AAAA1111", score: 90, rank: "S", style: "BOARD BREAKER", tags: ["NEW GAME+"] },
  { board: "table-3", kind: "table", checked_seasons: 31, settled_on: null, updated_on: "2026-12-20", place: 1, run_tag: "AAAA1111", score: 92, rank: "S", style: "BOARD BREAKER", tags: [] },
];

test("the page for the hall-of-fame branch: one table a board, no name and no full run id", () => {
  const boards = readHallOfFame(viewRows);
  assert.deepEqual(boards.map((board) => board.board), ["table-3", "2026-W47", "2026-W46"]);
  const page = formatHallOfFameMarkdown(boards);
  assert.match(page, /^# 명예의 전당\n/);
  assert.match(page, /## 본 판 \(판 규칙 3\)\n\n잠정 · 랭킹을 비울 때 확정 · 표시 없는 완주 31건 · 갱신 2026-12-20\n/);
  assert.match(page, /## 2026-W47\n\n확정 2026-12-14 · 표시 없는 완주 12건/);
  assert.match(page, /\| 1 \| RUN AAAA1111 \| BOARD BREAKER \| 90 \| S \| NEW GAME\+ \|\n\| 2 \| RUN BBBB2222 \| RISK CUTTER \| 81 \| A \| — \|/);
  assert.match(page, /## 2026-W46\n\n잠정 · 2026-12-07 뒤 확정 · 표시 없는 완주 4건 · 갱신 2026-11-30\n\n표본 부족\n/);
  assert.match(page, /「조작할 수 없음」이 아니라 「검사를 통과한 기록」/);
  assert.doesNotMatch(page, /익명 분석관|run_id|session/);
  assert.match(formatHallOfFameMarkdown([]), /아직 기록된 판이 없습니다/);
});

test("the ranking screen's badges, by run tag", () => {
  const badges = hallOfFameBadges(viewRows, rankingWords);
  assert.deepEqual(badges.get("AAAA1111"), ["명예의 전당 · 2026-W47 1위", "명예의 전당 · 본 판 1위 (잠정)"]);
  assert.deepEqual(badges.get("BBBB2222"), ["명예의 전당 · 2026-W47 2위"]);
  assert.equal(badges.size, 2);
  assert.equal(hallOfFameBadges(null, rankingWords).size, 0);
  assert.equal(hallOfFameBadges([{ board: "table-3", place: 4, run_tag: "X" }, { board: {}, place: 1, run_tag: "Y" }, "junk"], rankingWords).size, 0);
  assert.equal(hallOfFameBoardLabel("table-3"), "본 판 (판 규칙 3)");
});

test("the CLI prints the read, the page and the settle statement", () => {
  const script = fileURLToPath(new URL("../../scripts/verify-ranking-rows.mjs", import.meta.url));
  const dir = mkdtempSync(path.join(tmpdir(), "hall-of-fame-"));
  try {
    const run = (...args) => execFileSync(process.execPath, [script, ...args], { encoding: "utf8" });
    assert.equal(run("--hall-of-fame-read-sql").trim(), HALL_OF_FAME_READ_SQL);
    writeFileSync(path.join(dir, "view.json"), JSON.stringify({ rows: viewRows }));
    assert.equal(run("--hall-of-fame-md", path.join(dir, "view.json")), formatHallOfFameMarkdown(readHallOfFame(viewRows)));
    const rows = dealtSeason("secret-run");
    writeFileSync(path.join(dir, "1.json"), JSON.stringify(rows));
    const sql = run(path.join(dir, "1.json"), "--hall-of-fame-sql").trim();
    assert.equal(sql, hallOfFameSql([{ board: "table-3", places: [] }]));
    assert.match(run(path.join(dir, "1.json"), "--hall-of-fame"), /^본 판 \(판 규칙 3\): 0 checked seasons; 표본 부족$/m);
    assert.doesNotMatch(sql, /secret/);
    // With the board's count read apart (counts.json), the one season read takes its place.
    writeFileSync(path.join(dir, "counts.json"), JSON.stringify({ rows: [{ board: "table-3", checked: 10 }] }));
    const counted = run(path.join(dir, "1.json"), "--hall-of-fame-sql", `--counts=${path.join(dir, "counts.json")}`).trim();
    assert.match(counted, /"places":\[\{"run_tag":"RUNHALL1",/);
    assert.match(run(path.join(dir, "1.json"), "--hall-of-fame", `--counts=${path.join(dir, "counts.json")}`), /^본 판 \(판 규칙 3\): 10 checked seasons; 1\. RUN RUNHALL1 /m);
    assert.equal(run("--hall-of-fame-counts-sql").trim(), HALL_OF_FAME_COUNTS_SQL);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
