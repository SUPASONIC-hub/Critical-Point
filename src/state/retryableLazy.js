import { createElement, lazy } from "react";

import { mayWarm } from "../serviceWorker/register.js";
import { quietImport } from "./chunkReload.js";

/**
 * A lazy screen that can be asked for again.
 *
 * `React.lazy` keeps a failed import failed for as long as the page lives, so
 * the only way to try again was a reload -- and a reload with no connection is
 * the browser's offline page in place of the run. A screen made here keeps the
 * loader, and `retryFailedScreens` gives every screen whose import failed a
 * new `lazy` over it; the boundary that caught the failure (`LazyScreen`) then
 * draws its children again and the import is made once more.
 */

/**
 * The loader and what stands for the screen it loads (`wrap` is `React.lazy`
 * in the app; a test passes its own). `retry` makes a new one only when the
 * last load failed, and says whether it did.
 */
export function createRetryable(load, wrap) {
  let failed = false;
  const make = () =>
    wrap(() =>
      load().catch((error) => {
        failed = true;
        throw error;
      }),
    );
  let current = make();
  return {
    get current() {
      return current;
    },
    retry() {
      if (!failed) return false;
      failed = false;
      current = make();
      return true;
    },
  };
}

const screens = new Set();
// The loaders that can be asked for before their screen is drawn, by name.
const named = new Map();
// The names whose chunk has arrived or is on its way.
const prefetched = new Set();

export function retryableLazy(load, name) {
  const screen = createRetryable(load, lazy);
  screens.add(screen);
  if (name) named.set(name, load);
  return function RetryableScreen(props) {
    return createElement(screen.current, props);
  };
}

/** Gives every screen whose import failed a fresh one to load. Returns how many. */
export function retryFailedScreens() {
  let retried = 0;
  for (const screen of screens) retried += screen.retry() ? 1 : 0;
  return retried;
}

/**
 * Asks for a named screen's chunk before the screen is drawn, once. Resolves
 * to whether it arrived.
 *
 * The report's chunk used to be asked for when a case ended, and the player
 * looked at an empty page while it came. Asked for ahead, the import the screen
 * makes when it is drawn is answered by the module the browser already holds.
 *
 * A failure here is nobody's news: it goes through `quietImport`, so a tab
 * left open across a deploy is not reloaded under a table in play -- a reload
 * there settles a staked window as a bust. The screen asks again when it is
 * drawn, and that failure is answered the way it always was.
 */
export function prefetchScreen(name) {
  const load = named.get(name);
  if (!load) return Promise.resolve(false);
  if (prefetched.has(name)) return Promise.resolve(true);
  prefetched.add(name);
  return quietImport(load).then(
    () => true,
    () => {
      prefetched.delete(name);
      return false;
    },
  );
}

// After the page it is called from has been up this long: the first seconds
// of a table are the briefing being read and its plate being drawn.
export const PREFETCH_DELAY_MS = 4000;
// How long the browser may put the idle callback off.
export const PREFETCH_IDLE_TIMEOUT_MS = 3000;

/**
 * `prefetchScreen` once the caller has been up for `delayMs` and the browser
 * is idle, or after the delay alone where there is no `requestIdleCallback`
 * (Safari). Not without a connection, for a reader who asked the browser to
 * save data, or over a 2G link (`mayWarm`, the rule the worker's warm-up
 * follows): a browser that fails an import remembers it for the page's life.
 * Returns what cancels it.
 */
export function prefetchScreenWhenIdle(name, { scope = globalThis, delayMs = PREFETCH_DELAY_MS, idleTimeoutMs = PREFETCH_IDLE_TIMEOUT_MS } = {}) {
  if (!named.has(name) || prefetched.has(name)) return () => {};
  let idle = null;
  const run = () => {
    idle = null;
    const connection = scope.navigator?.connection;
    if (!mayWarm({ online: scope.navigator?.onLine, saveData: connection?.saveData, effectiveType: connection?.effectiveType })) return;
    prefetchScreen(name);
  };
  const timer = scope.setTimeout(() => {
    if (typeof scope.requestIdleCallback === "function") idle = scope.requestIdleCallback(run, { timeout: idleTimeoutMs });
    else run();
  }, delayMs);
  return () => {
    scope.clearTimeout(timer);
    if (idle !== null) scope.cancelIdleCallback?.(idle);
  };
}
