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

/**
 * Every logged window of a case row, replayed, with the two checks above on
 * each one that replays. Returns the counts by status and the entries that
 * did not pass, by their place in the log.
 */
export function recheckCaseWindows(row, { recordKey = WINDOW_RECORD_KEY, rules = null } = {}) {
  const log = Array.isArray(row?.decision_log) ? row.decision_log : [];
  const caseRules = rules ?? getRowRules(row?.case_id, row?.summary);
  const counts = { match: 0, mismatch: 0, unreplayable: 0, abandoned: 0, unrecorded: 0 };
  const findings = [];
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
    const status = result.status === "match" && differs.length ? "mismatch" : result.status;
    counts[status] += 1;
    if (status === "mismatch" || status === "unreplayable") findings.push({ index, status, differs, problem: result.problem });
  });
  return { counts, findings };
}

/** Whether a row was played under this engine's table rules (`dynamics.tableRules`). */
export function isCurrentTable(row) {
  return Number(row?.dynamics?.[RULES_MARK_KEY]) === RULES_MARK;
}

/** The marks the checker adds to a ranking row (the 10-21 answer 6). */
export const RECHECK_MARKS = Object.freeze(["score-off-log", "window-off-replay"]);

/**
 * One run read together: its case rows (`case_id` a case) and its ranking row
 * (`season-final`, whose summary the server copied from the `final` case
 * row). Returns the marks for the ranking row and what led to them, case by
 * case. A run with a case row under other table rules is `unverified` whole.
 */
export function recheckRun(rows = []) {
  const ranking = rows.find((row) => row?.case_id === "season-final") ?? null;
  const cases = rows.filter((row) => row && row.case_id !== "season-final");
  if (cases.some((row) => !isCurrentTable(row))) return { status: "unverified", marks: [], cases: [] };
  const marks = new Set();
  const report = cases.map((row) => {
    const score = recheckCaseScore(row);
    const windows = recheckCaseWindows(row);
    if (score.status !== "match") marks.add("score-off-log");
    if (windows.counts.mismatch || windows.counts.unreplayable) marks.add("window-off-replay");
    return { caseId: row.case_id, score: { status: score.status, differs: score.differs }, windows };
  });
  // The ranking row's score is the final case's: it was copied, so it can only
  // differ if one of the two was written by something else than the page.
  const final = cases.find((row) => row.case_id === "final");
  const rankingDiffers = ranking && final ? SCORE_FIELDS.filter((field) => ranking.summary?.[field] !== final.summary?.[field]) : [];
  if (rankingDiffers.length) marks.add("score-off-log");
  return { status: "checked", marks: RECHECK_MARKS.filter((mark) => marks.has(mark)), rankingDiffers, cases: report };
}
