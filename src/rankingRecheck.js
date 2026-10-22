/**
 * Server checks, phase 2 (F1, 서버검증-설계안.md): a stored case row read
 * again, off the page, the way a checker with the service key would read it.
 *
 * Two checks, each pure:
 *
 *   recheckCaseScore    the score the row's summary claims, worked out again
 *                       from its own decision log (gameLogic's
 *                       getGameplayStats, the function the page scored it
 *                       with). Phase 1 marks a score that disagrees with its
 *                       letter; this catches a score that disagrees with the
 *                       play it says it came from -- a summary edited on its
 *                       own (the design's 2nd way in). A log edited to match
 *                       passes: that is what the window replay is for.
 *   recheckCaseWindows  every logged window that carries a replay record
 *                       (gauntlet/windowReplay.js) played again under the
 *                       rules its case was played under.
 *
 * The rules a case was played under depend on the run (tableUnlocks'
 * getTableRules): a NEW GAME+ run plays the prologues under every rule, a
 * story run under fewer. The row says neither in `dynamics`; the case summary
 * will carry `newGamePlus` (NEWGAMEPLUS-이어받기-설계안.md, decision 9 (1)) and
 * already carries `assistStory`, so the rules are read from those.
 *
 * Beside the replay, two checks on a window the record makes possible (the
 * 10-21 answer 7): a sealed card cashed below its seal (the stage refuses that
 * CASH; the reducer never sees which card is sealed), and a response time that
 * is not the window clock the record closed on (the rhythm score reads it).
 *
 * `recheckRun` reads one run's rows together and names the marks the
 * checker would add to its ranking row (the 10-21 answer 6): `score-off-log`
 * and `window-off-replay`. A row played under other table rules than this
 * engine's (`dynamics.tableRules`) is not checked (answer 8).
 *
 * The page writes the record on every window from this build on
 * (gauntlet/windowTrail.js); a row from an older build, or a window resumed
 * from a save that kept no trail, reports its windows as unrecorded.
 */
import { nodes } from "./gameData.js";
import { CASE_SEQUENCE } from "./gameCases.js";
import { getGameplayStats, getRiskPressure } from "./gameLogic.js";
import { getSealedCardId, normalizeSchema, RULES_MARK, RULES_MARK_KEY } from "./gauntlet/gauntletEngine.js";
import { getTableRules } from "./gauntlet/tableUnlocks.js";
import { recheckWindow } from "./gauntlet/windowReplay.js";

/** What createCaseSummary copies from getGameplayStats, and so what is compared. */
export const SCORE_FIELDS = Object.freeze([
  "burstScore",
  "momentumScore",
  "momentumTier",
  "rank",
  "rhythmScore",
  "cognitionScore",
  "pressureAdaptScore",
  "reflectionScore",
  "consistencyScore",
  "exploitPenalty",
  "reframeCount",
  "challengeClearCount",
  "reducedRiskCount",
]);

/** The decision log entry's key for its window's replay record (the 10-21 answer 2). */
export const WINDOW_RECORD_KEY = "replay";

/**
 * The summary's score set beside the one its log earns. `row` is a case row
 * as stored: `summary`, `decision_log`, `resources` (the resources the case
 * closed on, which the score reads when the log holds no pressure of its own).
 */
export function recheckCaseScore(row) {
  const log = Array.isArray(row?.decision_log) ? row.decision_log : null;
  const summary = row?.summary;
  if (!log || !summary || typeof summary !== "object") return { status: "unreadable", differs: [] };
  const stats = getGameplayStats(log, getRiskPressure(row.resources ?? summary.finalResources ?? {}));
  const differs = SCORE_FIELDS.filter((field) => field in summary && summary[field] !== stats[field]);
  return { status: differs.length ? "mismatch" : "match", differs, expected: stats };
}

/** The rules a stored case was played under, from what its summary says of the run. */
export function getRowRules(caseId, summary) {
  return getTableRules(caseId, { veteran: summary?.newGamePlus === true, story: summary?.assistStory === true });
}

/**
 * Whether a logged decision staked the card its board sealed and cashed it
 * below the seal. The stage seals the richest card of the hand on a board
 * with `sealHighest` and refuses its CASH until the heat reaches `sealBreak`
 * (GauntletStage's `sealedLock`); a card the room played (`forced`) is not the
 * player's stake. The hand is read as the scene deals it (node.choices). The
 * page can add a card or two to it (a memory, an adaptive or a relationship
 * card, GameRuntime's `fixedChoices`); a richer one of those would have taken
 * the seal instead, which is why this is a mark someone reads, not a refusal.
 */
export function isSealedCash(entry, window) {
  const schema = normalizeSchema(window?.schema);
  if (!schema.sealHighest || entry?.threshold?.forced || window?.status !== "cashed") return false;
  const sealedId = getSealedCardId(nodes[entry?.nodeId]?.choices ?? [], schema);
  return Boolean(sealedId) && sealedId === entry.choiceId && window.gauge < schema.sealBreak;
}

/**
 * Whether a logged response time is not the window clock its record closed
 * on: useChoiceCommit logs `getWindowResponseTime`, the window's clock rounded
 * to a second (one at least). The record's end is rounded up to the
 * thousandth, so a second either way is the rounding. A window closed with its
 * clock at 0 is timed by the wall clock instead and is not read.
 */
export function isTimeOffClock(entry, record) {
  const end = Number(record?.end);
  const logged = Number(entry?.responseTimeSec);
  if (!(end > 0) || !Number.isFinite(logged)) return false;
  return Math.abs(logged - Math.max(1, Math.round(end))) > 1;
}

/** A seed the page deals again after a rolled-back save: `~1` to `~49` (useRunReadout's dealGauntletSeed). */
const SEED_TAIL = /^~([1-9]|[1-4][0-9])$/;

/**
 * Whether a window's seed is the one the page deals at that place (S1, the
 * 10-21 evening answer 1): `run_id:windowIndex:nodeId` (GameRuntime's
 * `seedBase`), with at most a re-deal tail. `windowIndex` counts every window
 * the run settled, one each, so a case row's windows are the last `n` before
 * its `dynamics.windowIndex`. A record whose seed is anything else picked the
 * wall it was played against -- the replay would pass, the seed does not.
 * Returns "base" for the dealt seed, "tail" for a re-deal, "off" otherwise.
 */
export function readSeed(seed, { runId, windowIndex, nodeId }) {
  const base = `${runId}:${windowIndex}:${nodeId}`;
  if (seed === base) return "base";
  return typeof seed === "string" && seed.startsWith(base) && SEED_TAIL.test(seed.slice(base.length)) ? "tail" : "off";
}

/**
 * Every logged window of a case row, replayed, with the checks above on each
 * one that replays, and its seed read against its place in the run. Returns
 * the counts by status, the re-dealt seeds (`seedTails`: a rolled-back save
 * does it, and so does a player shopping for a wall, so they are counted and
 * reported, not marked), and the entries that did not pass, by their place in
 * the log.
 */
export function recheckCaseWindows(row, { recordKey = WINDOW_RECORD_KEY, rules = null } = {}) {
  const log = Array.isArray(row?.decision_log) ? row.decision_log : [];
  const caseRules = rules ?? getRowRules(row?.case_id, row?.summary);
  const counts = { match: 0, mismatch: 0, unreplayable: 0, abandoned: 0, unrecorded: 0 };
  const findings = [];
  const windows = log.filter((entry) => entry?.threshold);
  const closedAt = Number(row?.dynamics?.windowIndex);
  const firstIndex = Number.isInteger(closedAt) && typeof row?.run_id === "string" ? closedAt - windows.length : null;
  let seedTails = 0;
  log.forEach((entry, index) => {
    const threshold = entry?.threshold;
    if (!threshold) return;
    const record = entry[recordKey];
    if (!record && threshold.cause !== "abandon") {
      counts.unrecorded += 1;
      return;
    }
    const result = recheckWindow(record, threshold, caseRules);
    const differs = [...result.differs];
    if (result.window && !result.problem) {
      if (isSealedCash(entry, result.window)) differs.push("sealed");
      if (isTimeOffClock(entry, record)) differs.push("responseTime");
    }
    if (record && firstIndex !== null) {
      const seed = readSeed(record.seed, { runId: row.run_id, windowIndex: firstIndex + windows.indexOf(entry), nodeId: entry.nodeId });
      if (seed === "off") differs.push("seed");
      if (seed === "tail") seedTails += 1;
    }
    const status = result.status === "abandoned" ? "abandoned" : result.status === "unreplayable" ? "unreplayable" : differs.length ? "mismatch" : "match";
    counts[status] += 1;
    if (status === "mismatch" || status === "unreplayable") findings.push({ index, status, differs, problem: result.problem });
  });
  return { counts, findings, seedTails };
}

/** Whether a row was played under this engine's table rules (`dynamics.tableRules`). */
export function isCurrentTable(row) {
  return Number(row?.dynamics?.[RULES_MARK_KEY]) === RULES_MARK;
}

/**
 * The marks the checker adds to a ranking row (the 10-21 answer 6, and the
 * evening's answer for a window that left no record).
 *
 *   score-off-log      a case summary off its own log, or the ranking row's
 *                      score off the final case row's.
 *   window-off-replay  a window that does not replay to its threshold, a
 *                      record that does not hold together, a sealed cash, a
 *                      response time off the clock, or a seed the page would
 *                      not have dealt there.
 *   window-no-replay   a window with no record in a run whose build writes
 *                      them (below).
 */
export const RECHECK_MARKS = Object.freeze(["score-off-log", "window-off-replay", "window-no-replay"]);

/*
 * The chain check's mark (F1 phase 3, S5), `chain-off-log`, is CHAIN_MARK in
 * src/chainRecheck.js (S4), its one home. ranking_set_recheck_marks allows it
 * beside RECHECK_MARKS.
 *
 * That function states the four checker marks of a run whole: a checker mark
 * left out of p_marks is taken off the row. So the chain's result must go in
 * the same call as this checker's (recheckRun's marks plus recheckChain's), in
 * the same run of verify-ranking-rows.mjs; a separate call would wipe the
 * other's marks. Wiring recheckChain into that run is S6, not done here.
 */

/**
 * One run read together: its case rows (`case_id` a case) and its ranking row
 * (`season-final`, whose summary the server copied from the `final` case
 * row). Returns the marks for the ranking row and what led to them, case by
 * case, and the run's status:
 *
 *   checked     played on a build that writes replay records, and read whole.
 *   unrecorded  no window of the run carries a record: a build from before
 *               the record (or one that left every record out). The scores are
 *               still worked out again, but the run is not "checked": the
 *               database keeps the two apart (`rechecked_at`).
 *   unverified  a case row under other table rules than this engine's; not read.
 *
 * Which rows must carry records. RULES_MARK does not say (it is 2 before and
 * after the record), and the case summary carries no build mark, so the run
 * says it itself: the first case row (in season order) with any recorded
 * window was played on a build that writes them, and from that case on every
 * window but a walked-away one must have a record. A missing one is marked
 * `window-no-replay`. Before it, a run begun on an older build and finished on
 * this one is not marked. A window resumed from a save an older build wrote,
 * and a trail past 200 presses, also leave none, which is why this is a mark.
 */
export function recheckRun(rows = []) {
  const ranking = rows.find((row) => row?.case_id === "season-final") ?? null;
  const order = (row) => {
    const at = CASE_SEQUENCE.indexOf(row.case_id);
    return at < 0 ? CASE_SEQUENCE.length : at;
  };
  const cases = rows.filter((row) => row && row.case_id !== "season-final").sort((a, b) => order(a) - order(b));
  if (cases.some((row) => !isCurrentTable(row))) return { status: "unverified", marks: [], cases: [] };
  const marks = new Set();
  let recorded = false;
  const report = cases.map((row) => {
    const score = recheckCaseScore(row);
    const windows = recheckCaseWindows(row);
    const { match, mismatch, unreplayable, unrecorded } = windows.counts;
    if (match + mismatch + unreplayable > 0) recorded = true;
    if (score.status !== "match") marks.add("score-off-log");
    if (mismatch || unreplayable) marks.add("window-off-replay");
    if (recorded && unrecorded) marks.add("window-no-replay");
    return { caseId: row.case_id, score: { status: score.status, differs: score.differs }, windows };
  });
  // The ranking row's score is the final case's: it was copied, so it can only
  // differ if one of the two was written by something else than the page.
  const final = cases.find((row) => row.case_id === "final");
  const rankingDiffers = ranking && final ? SCORE_FIELDS.filter((field) => ranking.summary?.[field] !== final.summary?.[field]) : [];
  if (rankingDiffers.length) marks.add("score-off-log");
  return { status: recorded ? "checked" : "unrecorded", marks: RECHECK_MARKS.filter((mark) => marks.has(mark)), rankingDiffers, cases: report };
}
