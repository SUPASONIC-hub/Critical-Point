import assert from "node:assert/strict";
import { test } from "node:test";

import { chunkPanelFor } from "../../src/state/chunkReload.js";
import {
  PREFETCH_DELAY_MS,
  PREFETCH_IDLE_TIMEOUT_MS,
  createRetryable,
  prefetchScreen,
  prefetchScreenWhenIdle,
  retryableLazy,
  retryFailedScreens,
} from "../../src/state/retryableLazy.js";

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

/**
 * A screen asked for before it is drawn (`prefetchScreen`): the report, while
 * a table is up, so a case does not end on an empty page.
 */
test("a named screen is asked for once, ahead of its first render", async () => {
  let loads = 0;
  retryableLazy(async () => {
    loads += 1;
    return { default: () => null };
  }, "test-ahead");
  assert.equal(await prefetchScreen("test-unnamed"), false, "a name nobody gave loads nothing");
  assert.equal(loads, 0, "naming a screen does not load it");
  assert.equal(await prefetchScreen("test-ahead"), true);
  assert.equal(await prefetchScreen("test-ahead"), true);
  assert.equal(loads, 1, "the second ask is answered by the first");
});

test("a chunk that did not come ahead of time is nobody's news, and is asked for again", async () => {
  let online = false;
  let loads = 0;
  retryableLazy(async () => {
    loads += 1;
    if (!online) throw new TypeError("Failed to fetch dynamically imported module: /assets/ResultScreen-abc.js");
    return { default: () => null };
  }, "test-flaky");
  assert.equal(await prefetchScreen("test-flaky"), false, "resolves, never rejects");
  online = true;
  assert.equal(await prefetchScreen("test-flaky"), true);
  assert.equal(loads, 2);
});

/** A page with a clock that is turned by hand. */
function fakeScope({ idle = true, onLine = true, connection = {} } = {}) {
  const scope = {
    timers: new Map(),
    idles: new Map(),
    next: 1,
    navigator: { onLine, connection },
    setTimeout(work, ms) {
      scope.timers.set(scope.next, { work, ms });
      return scope.next++;
    },
    clearTimeout: (handle) => scope.timers.delete(handle),
    cancelIdleCallback: (handle) => scope.idles.delete(handle),
    run(queue) {
      const [[handle, entry]] = scope[queue];
      scope[queue].delete(handle);
      entry.work();
    },
  };
  if (idle) {
    scope.requestIdleCallback = (work, options) => {
      scope.idles.set(scope.next, { work, options });
      return scope.next++;
    };
  }
  return scope;
}

// The import is made a turn after it is asked for (`quietImport`).
const settled = () => new Promise((resolve) => setImmediate(resolve));

const counted = (name) => {
  const seen = { loads: 0 };
  retryableLazy(async () => {
    seen.loads += 1;
    return { default: () => null };
  }, name);
  return seen;
};

test("the ask waits out the first seconds, then for the browser to be idle", async () => {
  const seen = counted("test-idle");
  const scope = fakeScope();
  prefetchScreenWhenIdle("test-idle", { scope });
  assert.deepEqual([...scope.timers.values()].map((timer) => timer.ms), [PREFETCH_DELAY_MS]);
  assert.equal(scope.idles.size, 0, "nothing is asked of the browser before the delay");
  scope.run("timers");
  assert.deepEqual([...scope.idles.values()].map((entry) => entry.options), [{ timeout: PREFETCH_IDLE_TIMEOUT_MS }]);
  assert.equal(seen.loads, 0);
  scope.run("idles");
  await settled();
  assert.equal(seen.loads, 1);
  // The next table finds it asked for already and sets no clock.
  const later = fakeScope();
  prefetchScreenWhenIdle("test-idle", { scope: later });
  assert.equal(later.timers.size, 0);
});

test("a browser with no idle callback asks when the delay is up", async () => {
  const seen = counted("test-no-idle");
  const scope = fakeScope({ idle: false });
  prefetchScreenWhenIdle("test-no-idle", { scope, delayMs: 10 });
  assert.equal(seen.loads, 0);
  scope.run("timers");
  await settled();
  assert.equal(seen.loads, 1);
});

test("nothing is asked for offline, for a reader saving data, or over 2G", async () => {
  const cases = [
    ["test-offline", { onLine: false }],
    ["test-save-data", { connection: { saveData: true } }],
    ["test-2g", { connection: { effectiveType: "2g" } }],
  ];
  for (const [name, page] of cases) {
    const seen = counted(name);
    const scope = fakeScope(page);
    prefetchScreenWhenIdle(name, { scope });
    scope.run("timers");
    scope.run("idles");
    await settled();
    assert.equal(seen.loads, 0, name);
  }
  // A browser that says nothing about its connection is asked.
  const seen = counted("test-unknown-link");
  const scope = fakeScope({ connection: undefined });
  prefetchScreenWhenIdle("test-unknown-link", { scope });
  scope.run("timers");
  scope.run("idles");
  await settled();
  assert.equal(seen.loads, 1);
});

test("a table that closes first takes its ask with it", async () => {
  const seen = counted("test-cancel");
  const early = fakeScope();
  prefetchScreenWhenIdle("test-cancel", { scope: early })();
  assert.equal(early.timers.size, 0, "before the delay: the timer goes");
  const late = fakeScope();
  const cancel = prefetchScreenWhenIdle("test-cancel", { scope: late });
  late.run("timers");
  cancel();
  assert.equal(late.idles.size, 0, "after it: the idle callback goes");
  await settled();
  assert.equal(seen.loads, 0);
  assert.equal(typeof prefetchScreenWhenIdle("test-nobody", { scope: fakeScope() }), "function", "an unknown name still hands back a cancel");
});
