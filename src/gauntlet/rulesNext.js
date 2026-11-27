// The switches the start screen reads too (gameConstants.js) live in rulesSwitch.js, out of this file's trial code.
import { RULES_NEXT_DEFAULT, rulesNextOn } from "./rulesSwitch.js";

export { RULES_NEXT_DEFAULT, rulesNextOn };

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
