import { NEXT_RULE, wantsNextRules } from "./nextTableRules.js";

/**
 * G4·G5 (2026-11-19): whether a table plays the next rules, read off the case's
 * rule set the way the core rules read it (nextTableRules.js, which owns the
 * switch): a set that says `NEXT_RULE` plays them, one that says "old" does not
 * (the recheck marks a row played before RULES_MARK 5 so), and a set that says
 * neither -- the page's own case rules, or none at all -- follows the page's
 * default (`wantsNextRules`: rulesNext.js, and `RULES_NEXT=0|1` in a script).
 *
 * A thin alias, kept so the bundle can point it at the core's `isNextOn` once
 * that reads the same three ways.
 */
export function nextTableOn(rules) {
  if (rules?.has?.("old")) return false;
  if (rules?.has?.(NEXT_RULE)) return true;
  return wantsNextRules();
}
