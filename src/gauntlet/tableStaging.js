import { debugToolsEnabled } from "../appConfig.js";
import { CASE_START_NODES } from "../gameCases.js";
import { getTableRules, getUnlockIntro, STAGED } from "./tableUnlocks.js";

/**
 * What the stage and the briefing ask of the unlock ladder (`tableUnlocks`).
 *
 * `PREVIEW` is the debug console's way to see the staged table while the
 * shipped switch is still off: a dev server visited with `?debug=1&staged=1`
 * draws each case under its own step. It sits behind `__CP_DEBUG_BUILD__`, as
 * every debug panel does, so a release folds it to `false` and ships neither
 * the query read nor a second path. It changes what the stage draws and which
 * keys it takes; the engine goes on playing under the shipped switch.
 */
const PREVIEW =
  (typeof __CP_DEBUG_BUILD__ === "undefined" ? false : __CP_DEBUG_BUILD__) &&
  debugToolsEnabled &&
  new URLSearchParams(globalThis.location?.search ?? "").get("staged") === "1";

const NO_INTRO = Object.freeze([]);

/**
 * The rules the stage draws under: the ones the forecast was dealt (`rules`),
 * or the case's own step when the staged table is being previewed.
 */
export function getStageRules(caseId, run, rules, preview = PREVIEW) {
  return preview ? getTableRules(caseId, run, true) : rules;
}

/**
 * The lines a briefing carries about the rules its case turns on. Only the
 * case's first scene says them: the introduction belongs to the page where
 * something first unlocks, and a case's later tables have nothing new.
 */
export function getBriefingIntro(caseId, nodeId, run, staged = PREVIEW || STAGED) {
  return CASE_START_NODES[caseId] === nodeId ? getUnlockIntro(caseId, run, staged) : NO_INTRO;
}
