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

/** Reloads for a missing chunk unless this tab just did. Returns whether it reloaded. */
export function reloadForMissingChunk({ now = Date.now(), reload = () => globalThis.location.reload() } = {}) {
  if (reloadedRecently(now)) return false;
  try {
    globalThis.sessionStorage.setItem(CHUNK_RELOAD_SESSION_KEY, String(now));
  } catch {
    return false;
  }
  reload();
  return true;
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
