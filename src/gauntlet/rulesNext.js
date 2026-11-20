// G1~G7 (2026-11-19): the next table rules. Off by default; ?rules=next turns them on for a trial
// on this device (no ranking or telemetry rows are sent). 묶음 R (11-30) flips RULES_NEXT_DEFAULT.
export const RULES_NEXT_DEFAULT = true;
export function rulesNextOn(scope = globalThis) {
  if (RULES_NEXT_DEFAULT) return true;
  try { return new URLSearchParams(scope.location?.search ?? "").get("rules") === "next"; } catch { return false; }
}
