import { applyEffect } from "./riskLogic.js";
import { applySoftEffect, halveSkilledHarm, isMarkThirteenOn, quartersSkilledHarm } from "./gauntlet/nextTableRules.js";

/**
 * A scene's effect as a decision commits it (useChoiceCommit, the season bot,
 * settlementRecheck): under RULES_MARK 13 (`on`, the page's rules unless the
 * caller says, as the recheck does for a row's mark) G47's half 사람 피해 for a
 * table cashed at ×32 or more (`multiplier`, 0 on a bust, null with no table)
 * and G44's softer gains near the top. Returns `{ effect, resources }`: the
 * effect as it was paid, and the resources after it. Kept out of riskLogic.js,
 * which the start screen loads: the MARK 13 rules stay in the game's chunks.
 * Under RULES_MARK 15 a table cashed at ×64 or more takes a quarter (G48), but
 * not in a story season (`story`).
 */
export function applySceneEffect(resources, effect = {}, multiplier = null, on = isMarkThirteenOn(), story = false) {
  if (!on) return { effect, resources: applyEffect(resources, effect) };
  const paid = halveSkilledHarm(effect, multiplier, quartersSkilledHarm(undefined, story));
  return { effect: paid, resources: applySoftEffect(resources, paid, applyEffect) };
}
