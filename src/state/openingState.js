import { getOriginStartEffects } from "../advancedSystems.js";
import { initialResources } from "../gameConstants.js";

/**
 * The hand a season opens with: the standing resources plus what the analyst's
 * origin brings. Every way into the season's first case deals it from here.
 * The intro's primary button used to deal the bare resources while the roadmap
 * card dealt the origin's -- the same first scene, eight points of legitimacy
 * apart depending on which control was pressed -- and `check:endings` measured
 * the roadmap's.
 *
 * The pre-start shell deals from this file too, so it imports neither the scene
 * graph nor `riskLogic.js`: a module shared with the entry chunk lands in it
 * whole, and that one carries the suspense copy. The sum below is
 * `applyEffect` for the keys an origin moves, and `save-recovery.test.mjs`
 * holds the two to the same answer.
 */
export function createOpeningResources(operatorOrigin) {
  const opening = { ...initialResources };
  for (const [key, value] of Object.entries(getOriginStartEffects(operatorOrigin))) {
    opening[key] = Math.min(key === "time" ? 72 : 100, Math.max(0, (opening[key] ?? 0) + value));
  }
  return opening;
}

// The line under a season's first scene, before any choice has been answered.
// Here, not in runState.js, so the shell's first save can hold it without the
// table's engine coming into the entry chunk with it.
export const OPENING_ECHO = "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";
