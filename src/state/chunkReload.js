import { CHUNK_RELOAD_SESSION_KEY } from "../appConfig.js";

/**
 * A screen's chunk that is no longer on the server.
 *
 * Every lazy screen is a file named by its hash. A deploy replaces those files,
 * so a tab left open across one asks for a name that answers 404 the first time
 * it reaches a screen it had not loaded yet -- the result page at the end of a
 * first case, usually. That is not a fault in the run, and it used to be
 * handled as one: the root boundary recorded it against the save, paused the
 * run, and counted it toward the retry limit.
 *
 * A reload fetches the new `index.html` and the names it lists, so this file
 * reloads once by itself and `LazyScreen` offers the same reload by hand when
 * that was not enough.
 */
const CHUNK_FAILURE = /dynamically imported module|module script failed|preload css|chunkloaderror|loading chunk/i;

// One automatic reload per this long. A server that is really down fails the
// reloaded page the same way, and that must end at a panel, not in a loop.
const RELOAD_GUARD_MS = 60_000;

export function isChunkLoadError(error) {
  if (!(error instanceof Error)) return false;
  return error.name === "ChunkLoadError" || CHUNK_FAILURE.test(error.message);
}

function reloadedRecently(now) {
  try {
    const last = Number(globalThis.sessionStorage?.getItem(CHUNK_RELOAD_SESSION_KEY));
    return Number.isFinite(last) && last > 0 && now - last < RELOAD_GUARD_MS;
  } catch {
    // Without a place to keep the marker there is nothing to stop a loop.
    return true;
  }
}

/**
 * What a dynamic import resolved to, or the missing-chunk error when it
 * resolved to nothing. When the preload handler below takes a failure (and
 * prevents its default), Vite's preload helper does not throw: the import
 * resolves to `undefined`, and the `({ Screen }) => ...` after it threw a
 * TypeError the root boundary recorded against the save -- while the page was
 * already reloading for the very chunk that was missing.
 */
export function loadedChunk(module) {
  if (module) return module;
  const error = new Error("Loading chunk failed: the import resolved to nothing.");
  error.name = "ChunkLoadError";
  throw error;
}

// Imports under way whose failure their own caller answers (`quietImport`).
let quietImports = 0;

/**
 * Runs an import whose failure is the caller's to handle, with no reload: a
 * panel that offers its own retry (the online-save fold). The reload took the
 * page away before that retry could be pressed.
 */
export function quietImport(load) {
  quietImports += 1;
  return Promise.resolve()
    .then(load)
    .finally(() => {
      quietImports -= 1;
    });
}

/**
 * Reloads for a missing chunk unless this tab just did. Returns whether it reloaded.
 *
 * Never while the browser says it is offline. A reload is for a file the
 * server no longer has, and with no connection the file is not missing at
 * all: on a device without the service worker the reload replaced a run in
 * progress with the browser's own offline page, and on one with it
 * (serviceWorker/worker.js) the reloaded page would ask for the same file the
 * worker has not kept. `LazyScreen` and `startCase` offer the retry instead.
 */
export function reloadForMissingChunk({
  now = Date.now(),
  reload = () => globalThis.location.reload(),
  online = globalThis.navigator?.onLine !== false,
} = {}) {
  if (!online || quietImports > 0) return false;
  if (reloadedRecently(now)) return false;
  try {
    globalThis.sessionStorage.setItem(CHUNK_RELOAD_SESSION_KEY, String(now));
  } catch {
    return false;
  }
  reload();
  return true;
}

// Whether a new release's service worker took this page over while it was
// open (serviceWorker/register.js says so).
let workerReplaced = false;

export function noteWorkerReplaced() {
  workerReplaced = true;
}

/**
 * Which panel a screen whose chunk did not arrive shows (`LazyScreen`):
 *
 *   "retry"            offline. The file is still on the server; ask again.
 *   "reload-offline"   offline, and a new release's worker has replaced the
 *                      one this page came with. It deleted the cache this
 *                      page's files were in, so asking again cannot succeed
 *                      however often it is pressed -- while a reload is
 *                      answered by that worker with the page it keeps, and
 *                      opens with no connection.
 *   "reload-retried"   online, after a retry. A browser that remembers a
 *                      module it failed to fetch (Chromium does, for as long
 *                      as the document lives) fails the same import again
 *                      with the connection back. Nothing changed version, so
 *                      the panel does not say so.
 *   "reload"           online: a deploy replaced the file.
 */
export function chunkPanelFor({ offline, retried = false, replaced = workerReplaced }) {
  if (offline) return replaced ? "reload-offline" : "retry";
  return retried ? "reload-retried" : "reload";
}

/**
 * Vite raises `vite:preloadError` on the window when a dynamic import or one of
 * its preloads fails. Preventing the default stops the error being thrown into
 * the render, which a reload is about to replace.
 */
export function installChunkReload() {
  if (typeof globalThis.addEventListener !== "function") return;
  globalThis.addEventListener("vite:preloadError", (event) => {
    if (reloadForMissingChunk()) event.preventDefault();
  });
}
