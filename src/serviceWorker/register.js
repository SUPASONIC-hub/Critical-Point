import { getLoadProgress, subscribeLoadProgress } from "../state/loadProgress.js";

/**
 * The page's half of the service worker (serviceWorker/worker.js): register
 * it, and ask it to fetch the rest of the release once there is a table up.
 *
 * `__CP_SERVICE_WORKER__` is a constant the bundler writes (vite.config.js):
 *
 *   "on"   a release. Registered on every visit.
 *   "ask"  the e2e build. Registered only for a page opened with `?sw=1`, so
 *          the suite plays the build without a worker between it and the
 *          routes it stubs, and the one spec that is about the worker turns
 *          it on (tests/offline.spec.js).
 *   "off"  the dev server, and a release built with `SERVICE_WORKER=off` --
 *          the kill switch, which also ships a worker that removes itself.
 *
 * Registered after `load`, so nothing here is on the way to the first paint
 * or the first scene.
 */
export const OFFLINE_READY_ATTRIBUTE = "data-offline";

export function serviceWorkerWanted(setting, search = "") {
  if (setting === "on") return true;
  if (setting === "ask") return /[?&]sw=1(?:&|$)/.test(search);
  return false;
}

/**
 * Whether to ask for the rest of the release now. Not without a connection,
 * and not for a reader who has asked the browser to save data: this is five
 * megabytes they did not ask for.
 */
export function mayWarm({ online, saveData }) {
  return online !== false && saveData !== true;
}

/** Runs `then` once the first case has arrived, which is when a table is about to be up. */
function whenFirstCaseArrived(then) {
  if (getLoadProgress().done >= 1) {
    then();
    return;
  }
  const unsubscribe = subscribeLoadProgress(() => {
    if (getLoadProgress().done < 1) return;
    unsubscribe();
    then();
  });
}

export function installServiceWorker({
  setting = typeof __CP_SERVICE_WORKER__ === "undefined" ? "off" : __CP_SERVICE_WORKER__,
  scope = globalThis,
} = {}) {
  const container = scope.navigator?.serviceWorker;
  if (!container || !serviceWorkerWanted(setting, scope.location?.search)) return false;

  let warmed = false;
  const idle = (work) => (typeof scope.requestIdleCallback === "function" ? scope.requestIdleCallback(work) : scope.setTimeout(work, 2000));

  const start = () => {
    container
      .register("/sw.js")
      .then(() => container.ready)
      .then((registration) => {
        container.addEventListener("message", (event) => {
          if (event.data?.type !== "warmed" || !event.data.complete) return;
          warmed = true;
          // For whoever needs to know the release is all here: the offline spec.
          scope.document?.documentElement?.setAttribute(OFFLINE_READY_ATTRIBUTE, "ready");
        });
        const ask = () => {
          if (warmed || !mayWarm({ online: scope.navigator.onLine, saveData: scope.navigator.connection?.saveData })) return;
          registration.active?.postMessage({ type: "warm" });
        };
        whenFirstCaseArrived(() => {
          idle(ask);
          // A warm-up the connection cut short is asked for again when it is back.
          scope.addEventListener("online", ask);
        });
      })
      .catch(() => {});
  };
  if (scope.document?.readyState === "complete") start();
  else scope.addEventListener("load", start, { once: true });
  return true;
}
