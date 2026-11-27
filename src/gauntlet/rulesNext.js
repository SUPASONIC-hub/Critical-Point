// G1~G7 (2026-11-19): the next table rules, on by default since bundle 11-20 (#628, RULES_MARK 5).
// With RULES_NEXT_DEFAULT false, ?rules=next would turn them on for a trial on this device.
export const RULES_NEXT_DEFAULT = true;
/**
 * The trial of what is still being decided (G24's 10 cells, G27's leaking charge): `RULES_TRIAL=1` in a script,
 * or `?rules=next` on a page served from this machine. Never on the public site, whose rows reach the ranking.
 */
export function rulesTrialOn(scope = globalThis) {
  const env = scope.process?.env?.RULES_TRIAL;
  if (env === "0") return false;
  if (env === "1") return true;
  try {
    if (!["localhost", "127.0.0.1"].includes(scope.location?.hostname)) return false;
    return new URLSearchParams(scope.location.search).get("rules") === "next";
  } catch { return false; }
}
export function rulesNextOn(scope = globalThis) {
  if (RULES_NEXT_DEFAULT) return true;
  try { return new URLSearchParams(scope.location?.search ?? "").get("rules") === "next"; } catch { return false; }
}
