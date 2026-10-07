import assert from "node:assert/strict";
import { test } from "node:test";

import { chunkPanelFor } from "../../src/state/chunkReload.js";
import { createRetryable, retryableLazy, retryFailedScreens } from "../../src/state/retryableLazy.js";

/**
 * A lazy screen that can be asked for again (src/state/retryableLazy.js): what
 * `LazyScreen` leans on when a chunk did not arrive and the browser is offline,
 * where a reload would only reach the browser's own offline page.
 */
const standIn = (factory) => ({ factory });

test("a screen that loaded is never made again", async () => {
  let loads = 0;
  const screen = createRetryable(async () => ({ default: `screen ${(loads += 1)}` }), standIn);
  const first = screen.current;
  assert.deepEqual(await first.factory(), { default: "screen 1" });
  assert.equal(screen.retry(), false);
  assert.equal(screen.current, first, "the same screen, so nothing remounts");
});

test("a screen whose import failed gets a new one over the same loader", async () => {
  let online = false;
  let loads = 0;
  const load = async () => {
    loads += 1;
    if (!online) throw new TypeError("Failed to fetch dynamically imported module: /assets/ResultScreen-abc.js");
    return { default: "ResultScreen" };
  };
  const screen = createRetryable(load, standIn);
  const failed = screen.current;
  await assert.rejects(failed.factory(), /dynamically imported/, "the caller still sees the failure");
  assert.equal(screen.current, failed, "nothing changes until a retry is asked for");

  online = true;
  assert.equal(screen.retry(), true);
  assert.notEqual(screen.current, failed, "a new screen: the failed one stays failed for good");
  assert.deepEqual(await screen.current.factory(), { default: "ResultScreen" });
  assert.equal(loads, 2);
  assert.equal(screen.retry(), false, "one failure, one retry");
});

test("the panel offers what can work, in words that are true", () => {
  // Offline with the release the page came with: the file is still there.
  assert.equal(chunkPanelFor({ offline: true, replaced: false }), "retry");
  // Offline after a new release's worker deleted this page's files: asking
  // again cannot succeed, and a reload opens the page that worker keeps.
  assert.equal(chunkPanelFor({ offline: true, replaced: true }), "reload-offline");
  assert.equal(chunkPanelFor({ offline: true, replaced: true, retried: true }), "reload-offline");
  // Online: a deploy replaced the file.
  assert.equal(chunkPanelFor({ offline: false, replaced: false }), "reload");
  assert.equal(chunkPanelFor({ offline: false, replaced: true }), "reload");
  // Online after a retry: the browser refused the same import again, and the
  // panel that says the game changed version would be saying something false.
  assert.equal(chunkPanelFor({ offline: false, replaced: false, retried: true }), "reload-retried");
});

test("the app's screens are components, and a retry touches only the ones that failed", () => {
  const Screen = retryableLazy(async () => ({ default: () => null }));
  assert.equal(typeof Screen, "function");
  const element = Screen({ quiet: true });
  assert.deepEqual(element.props, { quiet: true }, "props go through to the screen");
  assert.equal(retryFailedScreens(), 0, "nothing has failed, so nothing is remade");
});
