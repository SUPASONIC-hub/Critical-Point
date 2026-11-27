import { applyEffect } from "./riskLogic.js";
import { applySoftEffect, halveSkilledHarm, isMarkThirteenOn } from "./gauntlet/nextTableRules.js";

/**
 * A scene's effect as a decision commits it (useChoiceCommit, the season bot,
 * settlementRecheck): under RULES_MARK 13 (`on`, the page's rules unless the
 * caller says, as the recheck does for a row's mark) G47's half 사람 피해 for a
 * table cashed at ×32 or more (`multiplier`, 0 on a bust, null with no table)
 * and G44's softer gains near the top. Returns `{ effect, resources }`: the
 * effect as it was paid, and the resources after it. Kept out of riskLogic.js,
 * which the start screen loads: the MARK 13 rules stay in the game's chunks.
 */
export function applySceneEffect(resources, effect = {}, multiplier = null, on = isMarkThirteenOn()) {
  if (!on) return { effect, resources: applyEffect(resources, effect) };
  const paid = halveSkilledHarm(effect, multiplier);
  return { effect: paid, resources: applySoftEffect(resources, paid, applyEffect) };
}
