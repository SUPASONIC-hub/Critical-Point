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
const screens = new Set();

export function retryableLazy(load) {
  const screen = { failed: false, Inner: null };
  const make = () =>
    lazy(() =>
      load().catch((error) => {
        screen.failed = true;
        throw error;
      }),
    );
  screen.Inner = make();
  screen.retry = () => {
    if (!screen.failed) return;
    screen.failed = false;
    screen.Inner = make();
  };
  screens.add(screen);
  return function RetryableScreen(props) {
    return createElement(screen.Inner, props);
  };
}

export function retryFailedScreens() {
  for (const screen of screens) screen.retry();
}
