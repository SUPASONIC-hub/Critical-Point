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
 * The page does not write replay records yet, so on today's rows the window
 * check reports every window as having none. Where the record sits on an
 * entry (`recordKey`) is the placeholder until that is decided.
 */
import { getGameplayStats, getRiskPressure } from "./gameLogic.js";
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

/** Placeholder: the decision log entry's key for its window's replay record. */
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
 * Every logged window of a case row, replayed. Returns the counts by status
 * and the entries that did not match, by their place in the log.
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
    counts[result.status] += 1;
    if (result.status === "mismatch" || result.status === "unreplayable") {
      findings.push({ index, status: result.status, differs: result.differs, problem: result.problem });
    }
  });
  return { counts, findings };
}
