import assert from "node:assert/strict";
import test from "node:test";

import { WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { marksSql, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
import { jsonbBytes } from "../helpers/caseRows.js";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/**
 * Verify Ranking (scripts/verify-ranking-rows.mjs) on a run that reads every
 * briefing to the end and cashes the moment the table opens (2026-11-03, the
 * user's answer 1): every pick is a one-second one, and none is a snap,
 * because each decision carries its page's seconds and clock (`readSec`,
 * `readClock`). The server stores a decision log entry as the page sent it
 * (jsonb, 8,192 bytes an entry, 20261026000000), so the two numbers reach the
 * checker, which scores the row again with them. Played as
 * verify-ranking-weekly.test.mjs plays its runs: the season player on the
 * real engine, each window's replay record written, the page's seeds.
 */
const SERVER_ENTRY_BYTES = 8192;

function snapRows(runId, { reads }) {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const bot = createSeasonBot({ seed: 1000, staged: STAGED, reduce: recorder.reduce, weekRule: null, snap: true, reads, windowSeed: ({ windowIndex, nodeId }) => `${runId}:${windowIndex}:${nodeId}` });
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
  rows.push({ run_id: runId, case_id: "season-final", summary: { ...season.caseResults.final }, decision_log: [], resources: null, dynamics: season.caseDynamics.final });
  return { rows, total };
}

const read = snapRows("run-read-snap", { reads: true });
const skipped = snapRows("run-skip-snap", { reads: false });

function assertAsStored(rows, total) {
  const [result] = verifyRows(rows);
  assert.equal(result.status, "checked");
  assert.deepEqual(result.marks, []);
  assert.deepEqual(result.rankingDiffers, []);
  assert.equal(result.score, rows.at(-1).summary.burstScore);
  for (const entry of result.cases) {
    assert.equal(entry.score.status, "match", entry.caseId);
    assert.deepEqual(entry.windows.findings, [], entry.caseId);
  }
  assert.equal(result.cases.reduce((sum, entry) => sum + entry.windows.counts.match + entry.windows.counts.abandoned, 0), total);
  assert.match(marksSql([result]), new RegExp(`\\('${rows[0].run_id}', array\\[\\]::text\\[\\], true\\)`));
  return result;
}

test("read to the end, then a one-second pick on every table: no snap anywhere, and the run is replayed as stored", () => {
  const cases = read.rows.slice(0, -1);
  const entries = cases.flatMap((row) => row.decision_log);
  assert.ok(entries.every((entry) => entry.responseTimeSec === 1), "every pick is a one-second one");
  assert.ok(entries.every((entry) => entry.readClock > 0 && entry.readSec === entry.readClock), "every decision carries its page");
  // The two numbers are in the entry the server stores, and it stays under the server's cap.
  for (const entry of entries) assert.ok(jsonbBytes(entry) <= SERVER_ENTRY_BYTES, `${entry.nodeId} is ${jsonbBytes(entry)} bytes`);
  assert.ok(cases.every((row) => row.summary.exploitPenalty === 0), "no case scored a snap");
  assertAsStored(read.rows, read.total);
});

test("the same hand that opens every table at once is a snap, and is replayed as stored too", () => {
  const cases = skipped.rows.slice(0, -1);
  assert.ok(cases.flatMap((row) => row.decision_log).every((entry) => !("readSec" in entry) && !("readClock" in entry)));
  assert.ok(cases.some((row) => row.summary.exploitPenalty > 0));
  assertAsStored(skipped.rows, skipped.total);
});

test("the checker scores with the two numbers: taken off the stored log, the scores no longer match", () => {
  // What a server that dropped them would hand the checker -- or a row edited
  // to look unread: either way it is caught as a score off its log.
  const stripped = read.rows.map((row) => ({ ...row, decision_log: row.decision_log.map((entry) => Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "readSec" && key !== "readClock"))) }));
  assert.ok(verifyRows(stripped)[0].marks.includes("score-off-log"));
});
