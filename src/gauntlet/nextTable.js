import { rulesNextOn } from "./rulesNext.js";

/**
 * G4·G5 (2026-11-19): whether the table plays the next rules (rulesNext.js).
 * The bots measure the old and the new side by side (scripts/sim/season-bot.mjs,
 * `RULES_NEXT=0|1`) and the unit tests hold both, so a run can be told which
 * with `globalThis.__cpRulesNext` (true or false); anything else asks rulesNext.js.
 */
export function nextTableOn() {
  const forced = globalThis.__cpRulesNext;
  return typeof forced === "boolean" ? forced : rulesNextOn();
}
