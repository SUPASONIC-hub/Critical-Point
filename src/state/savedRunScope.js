import { SEASON_ENTRY_CASE } from "../gameCases.js";

/**
 * How much of the season what storage holds can name: the first case only, or
 * scenes anywhere in it. The runtime waits for one case or for all of them on
 * the answer (state/caseArrival.js).
 *
 * It reads the run, not whether a save exists. The shell writes the new save
 * before it mounts the runtime, so "is there a save" was true for every first
 * start, and the first table waited for all fifty-five case files -- and could
 * not open at all when one of them failed.
 *
 * This file is imported by the intro shell, which is the entry chunk: keep it
 * free of the scene graph. `gameCases.js` is the season's list of ids and is
 * already there.
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
