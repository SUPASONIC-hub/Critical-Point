import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { UI_VERSION_KEY } = await import("../../src/appConfig.js");
const { installUiVersion, readUiVersion } = await import("../../src/state/uiVersion.js");
const { buzz, easeOut, motionAllowed, rollValue } = await import("../../src/uiV2/motion.js");

test("?ui=v2 turns the redesign on and the device remembers it; ?ui=v1 turns it off", () => {
  localStorage.removeItem(UI_VERSION_KEY);
  assert.equal(readUiVersion(""), "v1");
  assert.equal(readUiVersion("?ui=v2"), "v2");
  assert.equal(localStorage.getItem(UI_VERSION_KEY), "v2");
  // The next visit, with no address: still v2.
  assert.equal(readUiVersion("?lang=en"), "v2");
  // Anything else in the address is not a version and changes nothing.
  assert.equal(readUiVersion("?ui=v3"), "v2");
  assert.equal(readUiVersion("?ui=v1"), "v1");
  assert.equal(readUiVersion(""), "v1");
});

test("v1 fetches nothing; a redesign chunk that cannot load leaves the page unmarked", async () => {
  const root = { dataset: {} };
  globalThis.document = { documentElement: root };
  try {
    assert.equal(installUiVersion("?ui=v1"), null);
    assert.equal(root.dataset.ui, undefined);
    // Under node the chunk's stylesheet cannot be imported: the failure path.
    const pending = installUiVersion("?ui=v2");
    assert.equal(root.dataset.ui, "v2");
    assert.equal(await pending, null);
    assert.equal(root.dataset.ui, undefined);
  } finally {
    delete globalThis.document;
    localStorage.removeItem(UI_VERSION_KEY);
  }
});

test("motion stops for reduced motion and for the calm-effects setting", () => {
  const calm = { hasAttribute: (name) => name === "data-calm-effects" };
  const plain = { hasAttribute: () => false };
  const reduced = () => ({ matches: true });
  const full = () => ({ matches: false });
  assert.equal(motionAllowed(calm, full), false);
  assert.equal(motionAllowed(plain, reduced), false);
  assert.equal(motionAllowed(plain, full), true);
  assert.equal(motionAllowed(plain, undefined), true);
  assert.equal(
    motionAllowed(plain, () => {
      throw new Error("no media queries");
    }),
    true,
  );
});

test("a buzz only where the device can and motion is allowed", () => {
  const calls = [];
  const nav = { vibrate: (ms) => calls.push(ms) > 0 };
  globalThis.document = { documentElement: { hasAttribute: () => false } };
  const media = globalThis.matchMedia;
  try {
    globalThis.matchMedia = () => ({ matches: false });
    assert.equal(buzz(12, nav), true);
    assert.deepEqual(calls, [12]);
    assert.equal(buzz(12, {}), false);
    assert.equal(
      buzz(12, {
        vibrate: () => {
          throw new Error("blocked");
        },
      }),
      false,
    );
    globalThis.matchMedia = () => ({ matches: true });
    assert.equal(buzz(12, nav), false);
    assert.deepEqual(calls, [12]);
  } finally {
    delete globalThis.document;
    if (media) globalThis.matchMedia = media;
    else delete globalThis.matchMedia;
  }
});

test("a rising number rolls from where it was and lands exactly on the new value", () => {
  assert.equal(easeOut(0), 0);
  assert.equal(easeOut(1), 1);
  assert.equal(easeOut(-1), 0);
  assert.equal(easeOut(2), 1);
  assert.ok(easeOut(0.5) > 0.5);
  assert.equal(rollValue(100, 340, 0), 100);
  assert.equal(rollValue(100, 340, 1), 340);
  const mid = rollValue(100, 340, 0.5);
  assert.ok(mid > 220 && mid < 340);
});
