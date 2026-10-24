/**
 * E-12: the device records a finished season leaves, carried by the online
 * save (cloudSave.js) so a second device keeps them -- the NEW GAME+ season
 * record with its 결말 도감 lists (seasonRecord.js, E-3), the cards the season
 * before picked (pastPicks.js, B-14) and the scenes the seasons before read
 * (seenScenes.js, E-1).
 *
 * They travel beside the run, under `save.deviceRecords`, because the server
 * takes a payload of `save` and `settledWindows` and no other key
 * (20260929030000). A restore takes them out before the save is written, so
 * they never reach the run's log, seed, cognition or a ranking row: they are
 * merged into this device's own keys, and the run is written as it was.
 *
 * How each merges with what this device already has:
 *
 * - The season record: the 도감 lists (`endingsSeen`, `verdictsSeen`) and the
 *   counted runs are a union; the season count is the larger copy's count plus
 *   the runs only the other copy counted, so two devices that each closed a
 *   different finale count two seasons and a copy restored from the other
 *   counts none twice. How the last season ended (`last`, `previous`) is the
 *   copy with more seasons -- the online one on a tie, since loading it is the
 *   player's own act -- and the book's lines are written again from the union.
 * - The past picks are one season, the one before, so they are not added up:
 *   they come from the copy whose `last` was kept, or from the other when that
 *   one has none.
 * - The read scenes add up, as they do on one device: the union of both, with
 *   the run that wrote them and what stood before it from the copy whose
 *   `last` was kept.
 *
 * A copy that carries none of them (one uploaded before E-12) leaves this
 * device's keys as they are. This module imports the scene graph, so
 * cloudSave.js loads it only when a copy is actually restored.
 */
import { NEW_GAME_PLUS_KEY, PAST_PICKS_KEY, readStoredValue, SEASON_RECORD_KEY, SEEN_SCENES_KEY, writeStoredValue } from "../appConfig.js";
import { nodeOrders } from "../gameData.js";
import { withEndingBook } from "./newGamePlusCarry.js";
import { normalizePastPicksRecord } from "./pastPicks.js";
import { isPlainObject, normalizeSeasonRecord } from "./seasonRecord.js";
import { decodeSeen, encodeSeen, normalizeSeenRecord } from "./seenScenes.js";

/** The keys `deviceRecords` names, and the device key each is stored under. */
export const DEVICE_RECORD_KEYS = Object.freeze({
  seasonRecord: SEASON_RECORD_KEY,
  pastPicks: PAST_PICKS_KEY,
  seenScenes: SEEN_SCENES_KEY,
});

const COUNTED_RUNS_KEPT = 8;

const only = (from, other) => from.filter((runId) => !other.includes(runId));

/**
 * The two season records as one, and which copy's `last` was kept ("local"
 * or "remote"). `record` is null when neither has counted a season.
 */
export function mergeSeasonRecords(localValue, remoteValue) {
  const local = normalizeSeasonRecord(localValue);
  const remote = normalizeSeasonRecord(remoteValue);
  const lead = remote.seasons >= local.seasons ? "remote" : "local";
  const [first, second] = lead === "remote" ? [remote, local] : [local, remote];
  const seasons = Math.max(
    local.seasons + only(remote.countedRuns, local.countedRuns).length,
    remote.seasons + only(local.countedRuns, remote.countedRuns).length,
  );
  if (seasons === 0) return { lead, record: null };
  const keepsLast = Boolean(first.last);
  return {
    lead: keepsLast || !second.last ? lead : lead === "remote" ? "local" : "remote",
    record: withEndingBook({
      seasons,
      countedRuns: [...only(second.countedRuns, first.countedRuns), ...first.countedRuns].slice(-COUNTED_RUNS_KEPT),
      last: keepsLast ? first.last : second.last,
      previous: keepsLast ? first.previous : second.previous,
      endingsSeen: [...first.endingsSeen, ...second.endingsSeen],
      verdictsSeen: [...first.verdictsSeen, ...second.verdictsSeen],
    }),
  };
}

const hasPicks = (record) => Object.keys(record.picks).length > 0 || Object.keys(record.before).length > 0;

/** The past picks to keep: the leading copy's, or the other's when it has none. Null when neither has any. */
export function mergePastPicks(localValue, remoteValue, lead = "remote") {
  const local = normalizePastPicksRecord(localValue);
  const remote = normalizePastPicksRecord(remoteValue);
  const [first, second] = lead === "remote" ? [remote, local] : [local, remote];
  if (hasPicks(first)) return first;
  return hasPicks(second) ? second : null;
}

const union = (...sets) => new Set(sets.flatMap((set) => [...set]));

/** The read scenes of both copies. Null when neither has read any. */
export function mergeSeenScenes(localValue, remoteValue, lead = "remote", orders = nodeOrders) {
  const local = normalizeSeenRecord(localValue);
  const remote = normalizeSeenRecord(remoteValue);
  const [first, second] = lead === "remote" ? [remote, local] : [local, remote];
  const scenes = union(decodeSeen(first.scenes, orders), decodeSeen(second.scenes, orders));
  if (scenes.size === 0) return null;
  // What stood before the leading copy's run: its own, and every season the
  // other copy read that is not that run.
  const secondBefore = second.runId !== null && second.runId === first.runId ? second.before : second.scenes;
  const before = union(decodeSeen(first.before, orders), decodeSeen(secondBefore, orders));
  return { v: 1, runId: first.runId ?? second.runId, scenes: encodeSeen(scenes, orders), before: encodeSeen(before, orders) };
}

function readKey(key) {
  try {
    return JSON.parse(readStoredValue(key, "null"));
  } catch {
    return null;
  }
}

function writeKey(key, value) {
  if (!value) return;
  const written = JSON.stringify(value);
  if (written !== readStoredValue(key, null)) writeStoredValue(key, written);
}

/**
 * Merges a restored copy's `deviceRecords` into this device's keys. A copy
 * with none, or a key it does not carry, leaves the device's own as it is.
 * Returns the keys written.
 */
export function applyDeviceRecords(deviceRecords) {
  if (!isPlainObject(deviceRecords)) return [];
  const carried = (name) => isPlainObject(deviceRecords[name]);
  const written = [];
  let lead = "remote";
  if (carried("seasonRecord")) {
    const merged = mergeSeasonRecords(readKey(SEASON_RECORD_KEY), deviceRecords.seasonRecord);
    lead = merged.lead;
    if (merged.record) {
      writeKey(SEASON_RECORD_KEY, merged.record);
      // A counted season opens NEW GAME+; the intro reads only this key.
      writeStoredValue(NEW_GAME_PLUS_KEY, "true");
      written.push("seasonRecord");
    }
  } else if (isPlainObject(readKey(SEASON_RECORD_KEY))) {
    lead = "local";
  }
  if (carried("pastPicks")) {
    const merged = mergePastPicks(readKey(PAST_PICKS_KEY), deviceRecords.pastPicks, lead);
    if (merged) {
      writeKey(PAST_PICKS_KEY, merged);
      written.push("pastPicks");
    }
  }
  if (carried("seenScenes")) {
    const merged = mergeSeenScenes(readKey(SEEN_SCENES_KEY), deviceRecords.seenScenes, lead);
    if (merged) {
      writeKey(SEEN_SCENES_KEY, merged);
      written.push("seenScenes");
    }
  }
  return written;
}
