import { CASE_SEQUENCE } from "../gameData.js";
import { getCaseOutcome } from "../gameLogic.js";

/**
 * The one line that carries the story over from the scene before (improvement
 * notes D-7, 2026-10-22), printed above the briefing's first box and counted
 * on its reading clock: the echo of the case's last decision, or -- on a
 * case's first scene -- the title of the ending the case before it closed on.
 * Null when there is neither: the season's first scene, or a case reached
 * without its predecessor closed (a jump, a replay link).
 */
export function getSceneBridge({ log = [], caseResults = {}, currentCase = "" } = {}) {
  const echo = log.at(-1)?.echo;
  if (echo) return `지난 장면에서 — ${echo}`;
  if (log.length > 0) return null;
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(currentCase) - 1];
  const choiceId = previousCaseId ? caseResults[previousCaseId]?.outcomeChoiceId : null;
  return choiceId ? `지난 사건에서 — ${getCaseOutcome({ caseId: previousCaseId, choiceId }).title}` : null;
}
