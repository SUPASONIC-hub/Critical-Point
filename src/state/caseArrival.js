import { SEASON_ENTRY_CASE } from "../gameCases.js";
import { ensureAllCases, ensureCase, isCaseLoaded } from "../gameData.js";
import { isChunkLoadError, reloadForMissingChunk } from "./chunkReload.js";

/**
 * When the season's cases arrive (the per-case chunk split,
 * scripts/vite-season-data.mjs). In Node every case is already there and all
 * of this resolves at once.
 *
 * A first visit waits for the season's first case only and fetches the rest
 * behind the table. A device holding any save waits for all of them, as it
 * always has: repairing a save reads the scenes of every case it closed, and a
 * repair that could not find them would rewrite what it read.
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
   */
  function whenCaseReady(caseId, open) {
    if (store.isCaseLoaded(caseId)) {
      open();
      return Promise.resolve();
    }
    return store.ensureCase(caseId).then(open, (error) => {
      if (isChunkLoadError(error) && reload()) return;
      throw error;
    });
  }

  return { prepareGameRuntime, whenCaseReady };
}

export const { prepareGameRuntime, whenCaseReady } = createCaseArrival({ ensureAllCases, ensureCase, isCaseLoaded });
