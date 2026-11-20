// G1~G7 (2026-11-19): the next table rules, on by default since bundle 11-20 (#628, RULES_MARK 5).
// With RULES_NEXT_DEFAULT false, ?rules=next would turn them on for a trial on this device.
export const RULES_NEXT_DEFAULT = true;
export function rulesNextOn(scope = globalThis) {
  if (RULES_NEXT_DEFAULT) return true;
  try { return new URLSearchParams(scope.location?.search ?? "").get("rules") === "next"; } catch { return false; }
}
