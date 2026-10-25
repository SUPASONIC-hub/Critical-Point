/**
 * Which store app, if any, the page is running inside (docs/app-shell.md).
 *
 *   "ios" / "android" -- the Capacitor shells (app/ios, app/android). Their
 *                 native bridge puts `window.Capacitor` on the page before
 *                 any of the page's own code runs, so the web build needs no
 *                 flag of its own.
 *   "web"      -- everything else, and the answer whenever the sign cannot be
 *                 read.
 *
 * Android was a Trusted Web Activity until 2026-10-25, told by its launch
 * referrer; it is Capacitor now, like iOS (the user's decision 4), so the
 * app's ads and purchase are native on both.
 *
 * src/platform/ads.js reads this before every call: ads are in the app only,
 * never on the web (the user's decision 3 of 2026-10-25).
 */

export const APP_PACKAGE_ID = "com.taknroll.criticalpoint";

/** @typedef {"web" | "ios" | "android"} AppShell */

/**
 * @param {any} [scope] the window; a test passes its own.
 * @returns {AppShell}
 */
export function appShell(scope = globalThis) {
  try {
    const capacitor = scope?.Capacitor;
    if (!capacitor?.isNativePlatform?.()) return "web";
    const platform = capacitor.getPlatform?.();
    return platform === "ios" || platform === "android" ? platform : "web";
  } catch {
    return "web";
  }
}

/** True inside either store app, false on the web. */
export function isAppShell(scope = globalThis) {
  return appShell(scope) !== "web";
}
