import { CASE_START_NODES } from "../gameCases.js";
import { getUnlockIntro, STAGED } from "./tableUnlocks.js";

/**
 * What the briefing asks of the unlock ladder (`tableUnlocks`). The stage asks
 * nothing here: it draws under the rules its forecast was dealt, which are the
 * ones the engine plays under.
 */

const NO_INTRO = Object.freeze([]);

/**
 * Whether a scene is one a case opens on. A case has its written first scene
 * and, after the first case, an opening for each way the case before it can
 * close (`caseOpeningRoutes`; the graph marks those `kind: "opening"`). A run
 * that is played, not jumped into, nearly always enters on one of the latter.
 */
function opensCase(node, nodeId) {
  return Boolean(node) && (CASE_START_NODES[node.caseId] === nodeId || node.kind === "opening");
}

/**
 * The lines a briefing carries about the rules its case turns on. Only the
 * scene the case opens on says them: the introduction belongs to the page
 * where something first unlocks, and a case's later tables have nothing new.
 */
export function getBriefingIntro(node, nodeId, run, staged = STAGED) {
  return opensCase(node, nodeId) ? getUnlockIntro(node.caseId, run, staged) : NO_INTRO;
}
