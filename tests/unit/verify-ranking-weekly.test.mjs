import assert from "node:assert/strict";
import test from "node:test";

import { BASE_SCHEMA } from "../../src/gauntlet/gauntletEngine.js";
import { NEAR_WALL_SHIFT, pickSeasonWeekRule, weekRuleAt, weekStartMs } from "../../src/gauntlet/weeklyRules.js";
import { WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { getSeasonScore } from "../../src/seasonScore.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { marksSql, verifyRows } from "../../scripts/verify-ranking-rows.mjs";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/**
 * Verify Ranking (scripts/verify-ranking-rows.mjs) on runs stamped with a
 * week's rule (W47 readiness P10): W46's NEAR WALL moves the wall on every
 * board, W47's AUDIT & CASCADE switches on two devices. The checker reads no
 * calendar: each window replays from the board its record carries
 * (windowReplay.js), and the rule is in that board. These runs are played by
 * the season player on the real engine, as the last test of
 * verify-ranking-rows.test.mjs plays its run, with the week stamped as
 * `newGame` stamps it, and stored as the page and the server store them.
 */
const W46 = weekStartMs("2026-W46");
const W47 = weekStartMs("2026-W47");

/** One season played under `weekRule`, as the server stores its rows. */
function weekRows(runId, weekRule, { seed = 1000, completedAt = null } = {}) {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const boards = [];
  const bot = createSeasonBot({ seed, staged: STAGED, reduce: recorder.reduce, weekRule, windowSeed: ({ windowIndex, nodeId }) => `${runId}:${windowIndex}:${nodeId}` });
  const season = bot.playSeason(0, "balanced", false, ({ verdict, board }) => {
    verdicts.push(verdict);
    boards.push(board);
  });
  const total = CASE_SEQUENCE.reduce((sum, caseId) => sum + season.caseLogs[caseId].length, 0);
  let at = recorder.closed.length - total;
  let settled = verdicts.length - total;
  const stamp = completedAt === null ? {} : { completed_at: new Date(completedAt).toISOString() };
  const rows = CASE_SEQUENCE.map((caseId) => ({
    run_id: runId,
    case_id: caseId,
    summary: season.caseResults[caseId],
    decision_log: season.caseLogs[caseId].map((entry) => ({ ...entry, threshold: { ...entry.threshold, ...thresholdOfVerdict(verdicts[settled++]) }, [WINDOW_RECORD_KEY]: recorder.closed[at++].record })),
    resources: null,
    dynamics: season.caseDynamics[caseId],
    ...stamp,
  }));
  // The ranking row's score is the mean of the cases (C-2, getSeasonScore), as ranking_run_summary writes it.
  rows.push({ run_id: runId, case_id: "season-final", summary: { ...season.caseResults.final, ...getSeasonScore(season.caseResults) }, decision_log: [], resources: null, dynamics: season.caseDynamics.final, ...stamp });
  return { rows, total, verdicts: verdicts.slice(-total), boards: boards.slice(-total) };
}

const played = new Map();
/** Each week's run is played once for the file (a season is the slow part). */
function weekRun(weekRule) {
  if (!played.has(weekRule)) played.set(weekRule, weekRows(`run-${weekRule ?? "plain"}`, weekRule));
  return played.get(weekRule);
}

const recordsOf = (rows) => rows.flatMap((row) => row.decision_log.map((entry) => entry[WINDOW_RECORD_KEY]).filter(Boolean));

/** What the checker found on a run: replayed whole, every score and window as stored, no mark, nothing written but "none". */
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
  assert.equal(result.chain.status, "linked");
  assert.match(marksSql([result]), new RegExp(`\\('${rows[0].run_id}', array\\[\\]::text\\[\\], true\\)`));
  return result;
}

test("a run of a week without a rule is replayed as stored, its boards the table's own", () => {
  const { rows, total } = weekRun(null);
  assert.ok(rows.every((row) => row.dynamics.weekRule === null));
  assertAsStored(rows, total);
});

test("a NEAR WALL run (W46) is replayed as stored: the closer wall is in every record's board", () => {
  const { rows, total } = weekRun("near-wall");
  assert.ok(rows.every((row) => row.dynamics.weekRule === "near-wall"));
  // The rule reached the boards: the first one sits NEAR_WALL_SHIFT closer than the plain run's, same seed, same board.
  const [first] = recordsOf(rows);
  const [plainFirst] = recordsOf(weekRun(null).rows);
  assert.equal(first.schema.wallMin ?? BASE_SCHEMA.wallMin, (plainFirst.schema.wallMin ?? BASE_SCHEMA.wallMin) - NEAR_WALL_SHIFT);
  assert.equal(first.schema.wallMax ?? BASE_SCHEMA.wallMax, (plainFirst.schema.wallMax ?? BASE_SCHEMA.wallMax) - NEAR_WALL_SHIFT);
  assertAsStored(rows, total);
  // The checker reads the wall off the record and nowhere else: the rule taken
  // out of the records, the windows no longer replay to what the log says.
  const unshifted = structuredClone(rows);
  for (const record of recordsOf(unshifted)) {
    record.schema.wallMin = (record.schema.wallMin ?? BASE_SCHEMA.wallMin) + NEAR_WALL_SHIFT;
    record.schema.wallMax = (record.schema.wallMax ?? BASE_SCHEMA.wallMax) + NEAR_WALL_SHIFT;
  }
  assert.deepEqual(verifyRows(unshifted)[0].marks, ["window-off-replay"]);
});

test("an AUDIT & CASCADE run (W47) is replayed as stored, both devices played", () => {
  const { rows, total, verdicts, boards } = weekRun("audit-cascade");
  assert.ok(rows.every((row) => row.dynamics.weekRule === "audit-cascade"));
  // Both devices were on in this season: the audit counted, and links came back as CASCADE boards.
  assert.ok(verdicts.some((verdict) => verdict.audit), "the audit counted no cash");
  assert.ok(boards.some((board) => board.mutations.includes("cascade")), "no CASCADE board was dealt");
  assert.ok(rows.some((row) => row.dynamics.linksOut?.length), "no case carried a link out");
  assertAsStored(rows, total);
});

test("a run started just before Monday 00:00 KST takes the week before's rule, just after the new one's, and each is replayed as stored", () => {
  // The calendar: W45 has no rule, W46 is NEAR WALL, W47 AUDIT & CASCADE.
  assert.equal(new Date(W46).toISOString(), "2026-11-08T15:00:00.000Z");
  assert.equal(weekRuleAt(W46 - 1), null);
  assert.equal(weekRuleAt(W46).week, "2026-W46");
  const picks = [
    [W46 - 1, null],
    [W46, "near-wall"],
    [W47 - 1, "near-wall"],
    [W47, "audit-cascade"],
  ];
  for (const [startedAt, expected] of picks) {
    assert.equal(pickSeasonWeekRule(startedAt), expected, new Date(startedAt).toISOString());
  }
  // The W46 edge played: the two seasons a millisecond apart, finished days later.
  // The checker reads no clock, so the run's time does not move what it finds.
  for (const [startedAt, expected] of picks.slice(0, 2)) {
    const run = weekRows(`run-edge-${startedAt}`, pickSeasonWeekRule(startedAt), { seed: 1000, completedAt: startedAt + 3 * 86400000 });
    assert.ok(run.rows.every((row) => row.dynamics.weekRule === expected));
    assertAsStored(run.rows, run.total);
  }
});
