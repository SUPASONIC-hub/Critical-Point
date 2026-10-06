import { SEASON_ENTRY_CASE } from "../gameCases.js";
import { ensureAllCases, ensureCase, isCaseLoaded } from "../gameData.js";
import { isChunkLoadError, reloadForMissingChunk } from "./chunkReload.js";

/**
 * When the season's cases arrive (the per-case chunk split,
 * scripts/vite-season-data.mjs). In Node every case is already there and all
 * of this resolves at once.
 *
 * A first visit waits for the season's first case only and fetches the rest
 * behind the table. A device holding a run waits for all of them, as it
 * always has: repairing a save reads the scenes of every case it closed, and a
 * repair that could not find them would rewrite what it read.
 *
 * Which of the two a device is -- `hasSave` below -- is decided from what its
 * storage holds, by `storageNeedsEveryCase` (state/savedRunScope.js).
 *
 * `createCaseArrival` takes the store so the waiting can be tested against one
 * that is slow or fails; the app uses the one bound to gameData below.
 */
export function createCaseArrival(store, { reload = reloadForMissingChunk } = {}) {
  async function prepareGameRuntime({ hasSave }) {
    if (hasSave) {
      await store.ensureAllCases();
      return;
    }
    await store.ensureCase(SEASON_ENTRY_CASE);
    // Behind the first table. A case still missing when it is opened is
    // fetched then (whenCaseReady).
    store.ensureAllCases().catch(() => {});
  }

  /**
   * Runs `open` once `caseId` has arrived: now, when it already has (always,
   * in practice, a few seconds into a run), or when it lands. A case that
   * cannot be fetched because a deploy replaced its file is the missing-chunk
   * case, and reloads like any other. Returns the arrival, for a caller that
   * wants to know.
   *
   * A case that could not be fetched and did not reload the page -- there is
   * no connection, or the page reloaded for it a moment ago -- is handed to
   * `unavailable({ offline })` when the caller gives one. Without it that case
   * ended as a rejected promise nobody held: the button did nothing and said
   * nothing. A fault in `open` itself is not that, and is thrown as before.
   */
  function whenCaseReady(caseId, open, { unavailable = null } = {}) {
    if (store.isCaseLoaded(caseId)) {
      open();
      return Promise.resolve();
    }
    return store.ensureCase(caseId).then(open, (error) => {
      if (!isChunkLoadError(error)) throw error;
      if (reload()) return;
      if (!unavailable) throw error;
      console.warn(error);
      unavailable({ offline: globalThis.navigator?.onLine === false });
    });
  }

  /**
   * Runs `read` once every case has arrived and resolves to what it returns.
   * For a reader that looks scenes up anywhere in the season -- the repair of
   * a recovery slot, above all: read against a season still arriving, it found
   * no scene for the slot's log, dropped every entry, and the emptied save was
   * then written over the run. A season that cannot be fetched rejects, and
   * `read` is not run at all.
   */
  function withEveryCase(read) {
    return store.ensureAllCases().then(() => read());
  }

  return { prepareGameRuntime, whenCaseReady, withEveryCase };
}

export const { prepareGameRuntime, whenCaseReady, withEveryCase } = createCaseArrival({ ensureAllCases, ensureCase, isCaseLoaded });
