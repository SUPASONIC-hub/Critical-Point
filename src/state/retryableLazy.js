import { createElement, lazy } from "react";

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

export function retryableLazy(load) {
  const screen = createRetryable(load, lazy);
  screens.add(screen);
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
