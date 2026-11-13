import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import { APP_PACKAGE_ID, appShell, isAppShell } from "../../src/platform/appShell.js";

function memoryStorage() {
  const rows = new Map();
  return {
    getItem: (key) => (rows.has(key) ? rows.get(key) : null),
    setItem: (key, value) => rows.set(key, String(value)),
    rows,
  };
}

// The store app shells (docs/app-shell.md): ads go in the app only, and this is
// how the page tells (the user's decision 3, 2026-10-25).
test("a plain browser is the web, and so is a page whose signs cannot be read", () => {
  assert.equal(appShell({ document: { referrer: "https://www.google.com/" }, sessionStorage: memoryStorage() }), "web");
  assert.equal(appShell({}), "web");
  assert.equal(appShell(null), "web");
  assert.equal(isAppShell({ document: { referrer: "" } }), false);
  const hostile = {
    get Capacitor() {
      throw new Error("blocked");
    },
  };
  assert.equal(appShell(hostile), "web");
  const noStorage = {
    document: { referrer: "" },
    get sessionStorage() {
      throw new Error("SecurityError");
    },
  };
  assert.equal(appShell(noStorage), "web");
});

test("the Capacitor shell is told by its native bridge, and a web Capacitor is not an app", () => {
  const ios = { Capacitor: { isNativePlatform: () => true, getPlatform: () => "ios" } };
  assert.equal(appShell(ios), "ios");
  assert.equal(isAppShell(ios), true);
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => true, getPlatform: () => "android" } }), "android");
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => false, getPlatform: () => "web" } }), "web");
  assert.equal(appShell({ Capacitor: { isNativePlatform: () => true, getPlatform: () => "electron" } }), "web");
});

test("the TWA is told by its launch referrer, kept for a reload in the same visit", () => {
  const storage = memoryStorage();
  const launch = { document: { referrer: `android-app://${APP_PACKAGE_ID}/` }, sessionStorage: storage };
  assert.equal(appShell(launch), "android");
  assert.equal(storage.rows.get("cp.appShell"), "android");
  assert.equal(appShell({ document: { referrer: "" }, sessionStorage: storage }), "android");
  assert.equal(appShell({ document: { referrer: `android-app://${APP_PACKAGE_ID}` }, sessionStorage: memoryStorage() }), "android");
  // Another app's launch, or a package whose name only starts with ours.
  assert.equal(appShell({ document: { referrer: "android-app://com.google.android.gm/" }, sessionStorage: memoryStorage() }), "web");
  assert.equal(appShell({ document: { referrer: `android-app://${APP_PACKAGE_ID}.beta/` }, sessionStorage: memoryStorage() }), "web");
  // A storage that refuses to write still answers for the launch page.
  const refusing = { getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } };
  assert.equal(appShell({ document: { referrer: `android-app://${APP_PACKAGE_ID}/` }, sessionStorage: refusing }), "android");
});

test("the TWA's manifest, assetlinks.json, the iOS config and appShell.js name one package", () => {
  const result = spawnSync(process.execPath, ["app/twa/check-twa.mjs"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});
