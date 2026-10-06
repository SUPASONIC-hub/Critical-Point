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
 * `storageNeedsEveryCase` is that question, asked of what storage holds. It
 * reads the run, not whether a save exists: the shell writes the new save
 * before it mounts the runtime, so "is there a save" was true for every first
 * start and the first table waited for all fifty-five cases.
 *
 * `createCaseArrival` takes the store so the waiting can be tested against one
 * that is slow or fails; the app uses the one bound to gameData below.
 */
/** Whether a save names a scene outside the season's first case. */
export function savedRunNamesOtherCases(saved) {
  if (!saved || typeof saved !== "object") return false;
  const filled = (value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value) && typeof value === "object" && Object.keys(value).length > 0;
  return (
    (typeof saved.currentCase === "string" && saved.currentCase !== SEASON_ENTRY_CASE) ||
    filled(saved.log) ||
    filled(saved.completedCases) ||
    filled(saved.caseResults)
  );
}

/**
 * Whether the runtime has to wait for every case before it mounts. A save that
 * will not read is taken to need them, since nothing can be told from it; so
 * is a device with recovery slots or a kept copy of a save, which the recovery
 * centre repairs against scenes anywhere in the season; so is a replay link.
 */
export function storageNeedsEveryCase({ saved = null, unreadable = false, hasSlots = false, hasBackup = false, replay = false } = {}) {
  return Boolean(replay || unreadable || hasSlots || hasBackup || savedRunNamesOtherCases(saved));
}

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
