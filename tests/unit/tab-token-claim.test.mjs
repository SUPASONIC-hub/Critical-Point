import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * A copied tab asks whether a live tab holds the token it inherited
 * (appConfig.claimTabToken). The answer is a round trip through the original,
 * which can be busy: in CI it came after the whole wait seven times between
 * 2026-10-21 and 25 (recovery.spec.js, "a tab opened from this one takes a
 * table token of its own"). An answer that comes late still makes the copy a
 * tab of its own, as long as no table has read the token yet.
 *
 * The claim is made once a page, so each case loads its own copy of the module.
 */
const session = createStorage();
globalThis.sessionStorage = session;
globalThis.localStorage = createStorage();

const INHERITED = "token-from-the-original";

// A bus of tabs. `deliver` holds the original's answer until the test lets it go.
function installBus() {
  const listeners = new Set();
  class FakeChannel {
    constructor() {
      this.onmessage = null;
      listeners.add(this);
    }
    postMessage(data) {
      for (const other of listeners) if (other !== this) queueMicrotask(() => other.onmessage?.({ data }));
    }
  }
  globalThis.BroadcastChannel = FakeChannel;
  const original = new FakeChannel();
  const claims = [];
  original.onmessage = ({ data }) => {
    if (data.type === "claim") claims.push(data.token);
  };
  const answer = () => original.postMessage({ type: "held", token: INHERITED });
  return { claims, answer };
}

async function freshClaim(name) {
  session.clear();
  session.setItem("critical-point-tab-token-v1", INHERITED);
  const bus = installBus();
  const appConfig = await import(`../../src/appConfig.js?${name}`);
  return { appConfig, ...bus };
}

const tick = () => new Promise((resolve) => setImmediate(resolve));

test("an answer in time: the copy takes a token of its own", async (t) => {
  t.after(() => delete globalThis.BroadcastChannel);
  const { appConfig, claims, answer } = await freshClaim("in-time");
  const claim = appConfig.claimTabToken();
  await tick();
  assert.deepEqual(claims, [INHERITED]);
  answer();
  assert.equal(await claim, true);
  assert.notEqual(appConfig.getTabToken(), INHERITED);
});

test("no answer: a reload keeps its token", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  t.after(() => delete globalThis.BroadcastChannel);
  const { appConfig } = await freshClaim("no-answer");
  const claim = appConfig.claimTabToken();
  t.mock.timers.tick(300);
  assert.equal(await claim, false);
  assert.equal(appConfig.getTabToken(), INHERITED);
  assert.equal(appConfig.takeTabToken(), INHERITED);
});

test("an answer after the wait, before any table: the copy still takes a token of its own", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  t.after(() => delete globalThis.BroadcastChannel);
  const { appConfig, answer } = await freshClaim("late");
  const claim = appConfig.claimTabToken();
  t.mock.timers.tick(300);
  assert.equal(await claim, false, "the claim gave up and the runtime may mount");
  assert.equal(appConfig.getTabToken(), INHERITED);
  answer();
  await tick();
  const own = appConfig.takeTabToken();
  assert.notEqual(own, INHERITED, "the late answer replaced the copied token");
  // A second late answer for the copied token changes nothing more.
  answer();
  await tick();
  assert.equal(appConfig.takeTabToken(), own);
});

test("an answer after a table has read the token: the token stays", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  t.after(() => delete globalThis.BroadcastChannel);
  const { appConfig, answer } = await freshClaim("after-table");
  const claim = appConfig.claimTabToken();
  t.mock.timers.tick(300);
  assert.equal(await claim, false);
  assert.equal(appConfig.takeTabToken(), INHERITED, "a table stamped or judged its window with this token");
  answer();
  await tick();
  assert.equal(appConfig.getTabToken(), INHERITED);
});
