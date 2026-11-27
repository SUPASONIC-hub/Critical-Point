import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import { appShell, isAppShell } from "../../src/platform/appShell.js";

// The store app shells (docs/app-shell.md): ads go in the app only, and this is
// how the page tells (the user's decision 3, 2026-10-25). Both shells are
// Capacitor since the user's decision 4 the same day.
test("a plain browser is the web, and so is a page whose signs cannot be read", () => {
  assert.equal(appShell({ document: { referrer: "https://www.google.com/" } }), "web");
  assert.equal(appShell({}), "web");
  assert.equal(appShell(null), "web");
  assert.equal(isAppShell({ document: { referrer: "" } }), false);
  // The Trusted Web Activity's launch referrer no longer means an app.
  assert.equal(appShell({ document: { referrer: "android-app://com.taknroll.criticalpoint/" } }), "web");
  const hostile = {
    get Capacitor() {
      throw new Error("blocked");
    },
  };
  assert.equal(appShell(hostile), "web");
});

test("the Capacitor shells are told by their native bridge, and a web Capacitor is not an app", () => {
  const ios = { Capacitor: { isNativePlatform: () => true, getPlatform: () => "ios" } };
  assert.equal(appShell(ios), "ios");
  assert.equal(isAppShell(ios), true);
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => true, getPlatform: () => "android" } }), "android");
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => false, getPlatform: () => "web" } }), "web");
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => true, getPlatform: () => "electron" } }), "web");
  assert.equal(appShell({ Capacitor: {} }), "web");
});

test("both shells, appShell.js and the AdMob and store settings agree (check:app)", () => {
  const result = spawnSync(process.execPath, ["app/check-app.mjs"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});
