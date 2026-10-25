/**
 * Which store app, if any, the page is running inside (docs/app-shell.md).
 *
 *   "ios"      -- the Capacitor shell (app/ios). Its native bridge puts
 *                 `window.Capacitor` on the page before any of the page's own
 *                 code runs, so the web build needs no flag of its own.
 *   "android"  -- the Trusted Web Activity (app/twa). Chrome opens the site
 *                 itself, so the one sign is the launch: the first page's
 *                 `document.referrer` is `android-app://<package>/`. It is
 *                 kept in sessionStorage for a reload in the same visit.
 *   "web"      -- everything else, and the answer whenever a sign cannot be
 *                 read.
 *
 * The ads PR is what reads this (ads in the app only, never on the web: the
 * user's decision of 2026-10-25). Until something imports it, it is not in
 * any chunk. The TWA sign has to be read on the visit's first page: whatever
 * calls `appShell()` first should do so before the page navigates.
 */

export const APP_PACKAGE_ID = "com.taknroll.criticalpoint";
const TWA_REFERRER = `android-app://${APP_PACKAGE_ID}`;
const SESSION_KEY = "cp.appShell";

/** @typedef {"web" | "ios" | "android"} AppShell */

/**
 * @param {any} [scope] the window; a test passes its own.
 * @returns {AppShell}
 */
export function appShell(scope = globalThis) {
  try {
    const capacitor = scope?.Capacitor;
    if (capacitor?.isNativePlatform?.()) {
      const platform = capacitor.getPlatform?.();
      return platform === "ios" || platform === "android" ? platform : "web";
    }
    const storage = sessionStore(scope);
    const referrer = String(scope?.document?.referrer ?? "");
    if (referrer === TWA_REFERRER || referrer.startsWith(`${TWA_REFERRER}/`)) {
      try {
        storage?.setItem(SESSION_KEY, "android");
      } catch {
        // A private window may refuse; this visit's first page still knows.
      }
      return "android";
    }
    return storage?.getItem(SESSION_KEY) === "android" ? "android" : "web";
  } catch {
    return "web";
  }
}

/** True inside either store app, false on the web. */
export function isAppShell(scope = globalThis) {
  return appShell(scope) !== "web";
}

function sessionStore(scope) {
  try {
    return scope?.sessionStorage ?? null;
  } catch {
    return null;
  }
}
