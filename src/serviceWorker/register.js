import { noteWorkerReplaced } from "../state/chunkReload.js";
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

// What `navigator.connection.effectiveType` reads on a link too slow to carry
// the release behind a game being played. "3g" and up, and a browser that
// does not say, are asked: cellular as such is not a reason to hold back.
const TOO_SLOW_TO_WARM = ["slow-2g", "2g"];

/**
 * Whether to ask for the rest of the release now. Not without a connection,
 * not for a reader who has asked the browser to save data, and not over a
 * link the browser measures as 2G: this is five megabytes they did not ask
 * for, and there it would take the line the next scene needs.
 */
export function mayWarm({ online, saveData, effectiveType }) {
  return online !== false && saveData !== true && !TOO_SLOW_TO_WARM.includes(effectiveType);
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
  // The worker the warm-up was last asked of.
  let asked = null;
  let askAgain = () => {};
  const idle = (work) => (typeof scope.requestIdleCallback === "function" ? scope.requestIdleCallback(work) : scope.setTimeout(work, 2000));
  const root = () => scope.document?.documentElement;

  // A new release took the page over (`clients.claim`). The files this page
  // was built to ask for went with the old release's cache, and `LazyScreen`
  // needs to know that (state/chunkReload.js). The first worker a device
  // installs takes the page over too, and that is not a release changing
  // under it: only a page that already had a worker has had one replaced.
  let controlled = Boolean(container.controller);
  container.addEventListener("controllerchange", () => {
    if (controlled) noteWorkerReplaced();
    controlled = true;
    askAgain();
  });

  const start = () => {
    container
      .register("/sw.js")
      .then(() => container.ready)
      .then((registration) => {
        container.addEventListener("message", (event) => {
          if (event.data?.type !== "warmed" || !event.data.complete) return;
          // On the visit after a deploy the worker that is active when the
          // page asks is the last release's. It has everything, says so, and
          // is then replaced by one that has deleted its cache: an answer
          // counts only from the worker in charge when it arrives.
          if (event.source && event.source !== registration.active) return;
          warmed = true;
          // For whoever needs to know the release is all here: the offline spec.
          root()?.setAttribute(OFFLINE_READY_ATTRIBUTE, "ready");
        });
        const ask = () => {
          const worker = registration.active;
          const connection = scope.navigator.connection;
          if (!worker || warmed || !mayWarm({ online: scope.navigator.onLine, saveData: connection?.saveData, effectiveType: connection?.effectiveType })) return;
          asked = worker;
          worker.postMessage({ type: "warm" });
        };
        // What was asked of a worker that has since been replaced, and
        // anything it answered, was about a cache that is gone: the one in
        // charge now is asked. Nothing asked yet means nothing to repeat.
        askAgain = () => {
          if (!asked || asked === registration.active) return;
          warmed = false;
          root()?.removeAttribute?.(OFFLINE_READY_ATTRIBUTE);
          ask();
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
