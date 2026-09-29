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
 */
export async function prepareGameRuntime({ hasSave }) {
  if (hasSave) {
    await ensureAllCases();
    return;
  }
  await ensureCase(SEASON_ENTRY_CASE);
  // Behind the first table. A case still missing when it is opened is
  // fetched then (whenCaseReady).
  ensureAllCases().catch(() => {});
}

/**
 * Runs `open` once `caseId` has arrived: now, when it already has (always, in
 * practice, a few seconds into a run), or when it lands. A case that cannot be
 * fetched because a deploy replaced its file is the missing-chunk case, and
 * reloads like any other.
 */
export function whenCaseReady(caseId, open) {
  if (isCaseLoaded(caseId)) {
    open();
    return;
  }
  ensureCase(caseId).then(open, (error) => {
    if (isChunkLoadError(error) && reloadForMissingChunk()) return;
    throw error;
  });
}
