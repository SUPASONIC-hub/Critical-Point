// G1~G7 (2026-11-19): the next table rules, on by default since bundle 11-20 (#628, RULES_MARK 5).
// With RULES_NEXT_DEFAULT false, ?rules=next would turn them on for a trial on this device.
export const RULES_NEXT_DEFAULT = true;
/** Whether the next rules play on this page (`?rules=next` turns them on while RULES_NEXT_DEFAULT is false). */
export function rulesNextOn(scope = globalThis) {
  if (RULES_NEXT_DEFAULT) return true;
  try { return new URLSearchParams(scope.location?.search ?? "").get("rules") === "next"; } catch { return false; }
}

/**
 * What nextTableRules.js's `isMarkThirteenOn()` (and the marks under it) reads
 * with no rule set, from the switches alone: the next rules (`RULES_NEXT`) and
 * RULES_MARK 7 to `mark` (`RULES_MARKn=0` turns one off in a script). For
 * gameConstants.js's collapse gate, which the start screen loads without
 * nextTableRules.js (rules-mark13.test.mjs holds the two together).
 */
export function marksOnByDefault(mark, scope = globalThis) {
  const env = scope.process?.env ?? {};
  if (env.RULES_NEXT === "0" || (env.RULES_NEXT !== "1" && !rulesNextOn(scope))) return false;
  for (let n = 7; n <= mark; n += 1) if (env[`RULES_MARK${n}`] === "0") return false;
  return true;
}
