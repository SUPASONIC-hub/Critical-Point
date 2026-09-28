import { getOriginStartEffects } from "../advancedSystems.js";
import { initialResources } from "../gameConstants.js";
import { applyEffect } from "../riskLogic.js";

/**
 * The hand a season opens with: the standing resources plus what the analyst's
 * origin brings. Every way into the season's first case deals it from here.
 * The intro's primary button used to deal the bare resources while the roadmap
 * card dealt the origin's -- the same first scene, eight points of legitimacy
 * apart depending on which control was pressed -- and `check:endings` measured
 * the roadmap's.
 *
 * No scene graph behind this file: the pre-start shell deals from it too.
 */
export function createOpeningResources(operatorOrigin) {
  return applyEffect(initialResources, getOriginStartEffects(operatorOrigin));
}
