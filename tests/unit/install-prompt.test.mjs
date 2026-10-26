import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { INSTALL_HINT_DISMISSED_KEY } = await import("../../src/appConfig.js");
const install = await import("../../src/state/installPrompt.js");

/** A window with listeners, a display mode and a navigator, enough for installInstallPrompt. */
function fakeWindow({ standalone = false, navigator = {} } = {}) {
  const handlers = new Map();
  return {
    navigator,
    matchMedia: (query) => ({ matches: standalone && query === "(display-mode: standalone)" }),
    addEventListener: (type, handler) => handlers.set(type, handler),
    fire: (type, event = {}) => handlers.get(type)?.(event),
  };
}

const IPHONE = { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1" };
const ANDROID = { userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36" };

test("the hint's mode: nothing once installed, opened from the home screen or closed", () => {
  const base = { standalone: false, installed: false, dismissed: false, deferred: null, ios: false };
  assert.equal(install.installHintMode(base), "none");
  assert.equal(install.installHintMode({ ...base, deferred: {} }), "prompt");
  assert.equal(install.installHintMode({ ...base, ios: true }), "ios");
  for (const done of ["standalone", "installed", "dismissed"]) {
    assert.equal(install.installHintMode({ ...base, deferred: {}, ios: true, [done]: true }), "none", done);
  }
});

test("an iPad that calls itself a Mac is an Apple touch device; a Mac with a mouse is not", () => {
  assert.equal(install.isAppleTouch(IPHONE), true);
  assert.equal(install.isAppleTouch({ userAgent: "Macintosh", platform: "MacIntel", maxTouchPoints: 5 }), true);
  assert.equal(install.isAppleTouch({ userAgent: "Macintosh", platform: "MacIntel", maxTouchPoints: 0 }), false);
  assert.equal(install.isAppleTouch(ANDROID), false);
  assert.equal(install.isAppleTouch(undefined), false);
  assert.equal(install.isStandalone(fakeWindow({ standalone: true })), true);
  assert.equal(install.isStandalone({ navigator: { standalone: true } }), true);
  assert.equal(install.isStandalone({ matchMedia: () => { throw new Error("old engine"); }, navigator: {} }), false);
});

test("Chrome's event shows the button, one press prompts once, and the hint goes", () => {
  const scope = fakeWindow({ navigator: ANDROID });
  install.installInstallPrompt(scope);
  assert.equal(install.getInstallHintMode(), "none", "no event yet: nothing to offer");

  let prompted = 0;
  let cancelled = false;
  scope.fire("beforeinstallprompt", { prompt: () => { prompted += 1; return Promise.resolve(); }, preventDefault: () => { cancelled = true; } });
  assert.equal(install.getInstallHintMode(), "prompt");
  assert.equal(cancelled, false, "the browser's own banner is left alone");

  install.promptInstall();
  install.promptInstall();
  assert.equal(prompted, 1, "an event is prompted once");
  assert.equal(install.getInstallHintMode(), "none");

  scope.fire("beforeinstallprompt", { prompt: () => { throw new Error("refused"); } });
  assert.equal(install.getInstallHintMode(), "prompt", "a new event brings the button back");
  assert.doesNotThrow(() => install.promptInstall());

  scope.fire("beforeinstallprompt", { prompt: () => Promise.resolve() });
  scope.fire("appinstalled");
  assert.equal(install.getInstallHintMode(), "none");
});

test("on an iPhone (a fresh page): the share-menu line, then closed for good on this device", async () => {
  const fresh = await import(`../../src/state/installPrompt.js?fresh=${Date.now()}`);
  fresh.installInstallPrompt(fakeWindow({ navigator: IPHONE }));
  assert.equal(fresh.getInstallHintMode(), "ios");
  fresh.installInstallPrompt(fakeWindow({ standalone: true, navigator: { ...IPHONE, standalone: true } }));
  assert.equal(fresh.getInstallHintMode(), "none", "opened from the home screen");
  fresh.installInstallPrompt(fakeWindow({ navigator: IPHONE }));
  assert.equal(fresh.getInstallHintMode(), "ios");

  fresh.dismissInstallHint();
  assert.equal(localStorage.getItem(INSTALL_HINT_DISMISSED_KEY), "1");
  assert.equal(fresh.getInstallHintMode(), "none");

  const again = await import(`../../src/state/installPrompt.js?again=${Date.now()}`);
  again.installInstallPrompt(fakeWindow({ navigator: IPHONE }));
  assert.equal(again.getInstallHintMode(), "none", "closed on this device stays closed");

  localStorage.unavailable = true;
  assert.doesNotThrow(() => again.dismissInstallHint(), "storage that throws does not break the button");
  localStorage.unavailable = false;
});
