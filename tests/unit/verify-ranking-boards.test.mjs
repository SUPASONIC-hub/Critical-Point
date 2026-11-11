import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildLeaderboard } from "../../src/ranking.js";
import { WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { getSeasonScore } from "../../src/seasonScore.js";
import { weekStartMs } from "../../src/gauntlet/weeklyRules.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { marksSql, rankingRunsSql, recheckWeeks, runRowsSql, runsSummary, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";
import rankingCopy from "../../src/copy/ranking.js";
import enRanking from "../../src/locales/en/screens/ranking.js";
import jaRanking from "../../src/locales/ja/screens/ranking.js";

/**
 * Verify Ranking over every board the page shows (보안 점검 M2, 11-03): the
 * ordinary board and this week's and last week's rule boards, each read down
 * to the top 100 the page shows, every run not read yet and the top 20 again,
 * and the page's 「확인 중」 on a row the checker has not read. The list query
 * itself runs on the schema in check:grants; here, its text, the CLI's two
 * halves over a run list as the database answers it, and a W47 run played by
 * the season player on the real engine (as verify-ranking-weekly.test.mjs
 * plays its runs) read through them.
 */
const W47 = weekStartMs("2026-W47");
const MINUTE = 60 * 1000;

function weekRows(runId, weekRule, seed = 1000) {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const bot = createSeasonBot({ seed, staged: STAGED, reduce: recorder.reduce, weekRule, windowSeed: ({ windowIndex, nodeId }) => `${runId}:${windowIndex}:${nodeId}` });
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
  rows.push({ run_id: runId, run_tag: "W47TAG01", case_id: "season-final", summary: { ...season.caseResults.final, ...getSeasonScore(season.caseResults), week: "2026-W47" }, decision_log: [], resources: null, dynamics: season.caseDynamics.final });
  return rows;
}

test("the boards read by default are this week's and last week's, in Korean time, so Monday's first run still reads the week that ended", () => {
  assert.deepEqual(recheckWeeks(W47 + 20 * MINUTE), ["2026-W47", "2026-W46"], "Monday 00:20 KST");
  assert.deepEqual(recheckWeeks(W47 - MINUTE), ["2026-W46", "2026-W45"], "Sunday 23:59 KST");
  assert.deepEqual(recheckWeeks(weekStartMs("2027-W01") + MINUTE), ["2027-W01", "2026-W53"], "across the year");
  assert.match(rankingRunsSql({ weeks: recheckWeeks(W47 + 20 * MINUTE) }), /summary->>'week' is null or summary->>'week' in \('2026-W47', '2026-W46'\)/);
});

test("the run list ranks each board as the page does and keeps the runs not read yet and the top 20, new first", () => {
  const list = rankingRunsSql({ weeks: ["2026-W47", "2026-W46"] });
  // Each board on its own: the ordinary one is `week` null, as fetchLeaderboard's week=is.null.
  assert.match(list, /row_number\(\) over \(partition by summary->>'week' order by score desc, completed_at asc\) as place/);
  assert.match(list, /coalesce\(summary->>'week', ''\) as board, recheck_seen_at is null as fresh/);
  assert.match(list, /and summary->>'seasonComplete' = 'true'\n/, "the rows the page shows: complete seasons");
  assert.match(list, /\n where place <= 100 and \(fresh or place <= 20\)\n order by fresh desc, place, board limit 150;$/);
  assert.match(rankingRunsSql({ weeks: [], all: true }), /\n where place <= 100\n/, "all: every run of the top, read before or not");
  assert.match(rankingRunsSql({ weeks: [], limit: 10, always: 50 }), /place <= 10 and \(fresh or place <= 10\)/, "always is never past limit");
  assert.match(rankingRunsSql({ weeks: [], cap: 5000 }), /limit 1000;$/);
  assert.match(rankingRunsSql({ weeks: [] }), /\n {5}and summary->>'week' is null\n/);
  assert.throws(() => rankingRunsSql({ weeks: ["2026-W47'; drop table x; --"] }), /A week is a key/);
  assert.throws(() => rankingRunsSql({ weeks: ["2026-W54"] }), /A week is a key/);
});

test("a W47 run on its board goes through the list, its read and its write, and the log names no run", () => {
  const rows = weekRows("secret-w47-run", "audit-cascade");
  // runs.json as `supabase db query` answers it: booleans and numbers, the ordinary board as ''.
  const runsJson = JSON.stringify({ rows: [
    { run_id: "secret-w47-run", board: "2026-W47", fresh: true, place: 1 },
    { run_id: "secret-plain", board: "", fresh: false, place: 3 },
    { run_id: "secret-plain-2", board: "", fresh: "t", place: 120 },
  ] });
  assert.equal(runsSummary(runsJson), "2026-W47 1 (1 new), ordinary 2 (1 new)");
  assert.doesNotMatch(runsSummary(runsJson), /secret/);
  assert.equal(runsSummary("[]"), "No run to read.");
  const dir = mkdtempSync(path.join(tmpdir(), "verify-boards-"));
  try {
    const script = fileURLToPath(new URL("../../scripts/verify-ranking-rows.mjs", import.meta.url));
    const run = (...args) => execFileSync(process.execPath, [script, ...args], { encoding: "utf8" }).trim();
    writeFileSync(path.join(dir, "runs.json"), runsJson);
    assert.equal(run("--runs-summary", path.join(dir, "runs.json")), "2026-W47 1 (1 new), ordinary 2 (1 new)");
    assert.equal(run("--run-count", path.join(dir, "runs.json")), "3");
    assert.equal(run("--run-sql", path.join(dir, "runs.json"), "--at=1"), runRowsSql("secret-w47-run"));
    writeFileSync(path.join(dir, "1.json"), JSON.stringify(rows));
    assert.match(run(path.join(dir, "1.json"), "--redact"), /^W47TAG01 {2}score .* {2}no marks$/m);
    assert.doesNotMatch(run(path.join(dir, "1.json"), "--redact"), /secret/);
    // The write states the run as replayed whole: ranking_set_recheck_marks sets its read time (the page's 「확인 중」 goes).
    assert.match(readFileSync(path.join(dir, "1.json"), "utf8"), /secret-w47-run/);
    assert.equal(run(path.join(dir, "1.json"), "--marks-sql"), marksSql(verifyRows(rows)));
    assert.match(marksSql(verifyRows(rows)), /\('secret-w47-run', array\[\]::text\[\], true\)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a remote row the checker has not read is 「확인 중」 on the page, a read one and this device's own are not", () => {
  const row = (run_tag, extra) => ({ run_tag, case_id: "season-final", completed_at: "2026-11-16T00:00:00Z", score: 80, summary: { rank: "A", burstScore: 80, seasonComplete: true }, ...extra });
  const board = buildLeaderboard([
    row("NEW00001", { rechecked: false }),
    row("READ0001", { rechecked: true }),
    // A server before the column, or a row it did not send: not said either way.
    row("OLD00001", {}),
    { local: true, run_id: "0f8e7d6c-1111-4222-8333-123a4e5f6a7c", case_id: "season-final", completed_at: "2026-11-16T00:00:00Z", rechecked: false, summary: { rank: "A", burstScore: 79, seasonComplete: true } },
  ]);
  const pending = Object.fromEntries(board.map((entry) => [entry.isLocal ? "local" : entry.runTag, entry.pendingCheck]));
  assert.deepEqual(pending, { NEW00001: true, READ0001: false, OLD00001: false, local: false });
});

test("「확인 중」 is said in each language, with no Korean left in the English or Japanese", () => {
  assert.equal(rankingCopy.pendingCheck, "확인 중");
  assert.match(rankingCopy.pendingCheckTitle, /하루에 한 번/);
  for (const [lang, table] of [["en", enRanking], ["ja", jaRanking]]) {
    for (const key of ["pendingCheck", "pendingCheckTitle"]) {
      assert.equal(typeof table[key], "string", `${lang} ${key}`);
      assert.doesNotMatch(table[key], /[가-힣]/, `${lang} ${key}`);
    }
  }
  assert.equal(enRanking.pendingCheck, "Being checked");
  assert.equal(jaRanking.pendingCheck, "確認中");
});

test("the workflow reads each board's top 100 every night and once more after Monday 00:00 KST", () => {
  const workflow = readFileSync(new URL("../../.github/workflows/verify-ranking.yml", import.meta.url), "utf8");
  assert.match(workflow, /- cron: "55 14 \* \* \*"/, "23:55 KST every night");
  assert.match(workflow, /- cron: "20 15 \* \* 0"/, "00:20 KST on Monday (15:20Z on Sunday)");
  assert.match(workflow, /RANKING_LIMIT: \$\{\{ inputs\.limit \|\| '100' \}\}/);
  assert.match(workflow, /RANKING_ALWAYS: \$\{\{ inputs\.always \|\| '20' \}\}/);
  assert.match(workflow, /RANKING_CAP: \$\{\{ inputs\.cap \|\| '150' \}\}/);
  assert.match(workflow, /--runs-sql --limit="\$RANKING_LIMIT" --always="\$RANKING_ALWAYS" --cap="\$RANKING_CAP" --per-board=10 \$all > runs\.sql/);
  assert.match(workflow, /--runs-summary runs\.json/);
  assert.match(workflow, /timeout-minutes: 30/, "150 runs at about 6 s a query");
  // The page reads 100 of a board (fetchLeaderboard), so the default reaches every row it shows.
  const telemetry = readFileSync(new URL("../../src/telemetry.js", import.meta.url), "utf8");
  assert.match(telemetry, /export async function fetchLeaderboard\(limit = 100, week = null\)/);
  assert.match(telemetry, /select: "run_tag,player_name,case_id,case_title,completed_at,summary,score,week,rechecked"/);
});
