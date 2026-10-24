import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const config = await import("../../src/appConfig.js");
const { applyDeviceRecords, DEVICE_RECORD_KEYS, mergePastPicks, mergeSeasonRecords, mergeSeenScenes } = await import("../../src/state/cloudDeviceRecords.js");
const { decodeSeen, encodeSeen, pastSeenScenes } = await import("../../src/state/seenScenes.js");
const pastPicksModule = await import("../../src/state/pastPicks.js");
const seenScenesModule = await import("../../src/state/seenScenes.js");

const { normalizeSeasonRecord } = await import("../../src/state/seasonRecord.js");

/**
 * E-12: the season record, the past picks and the read scenes, carried by the
 * online save and merged into the device a copy is restored on.
 */

const ORDERS = { a: ["a1", "a2", "a3", "a4", "a5", "a6"], b: ["b1", "b2"] };
const seen = (ids) => encodeSeen(new Set(ids), ORDERS);
const ids = (cases) => [...decodeSeen(cases, ORDERS)].sort();

const last = (runId, endingId, verdict = null) => ({ runId, endingId, endingLabel: endingId, verdict, tableRules: 2, line: `${endingId} line` });
const record = (seasons, countedRuns, lastSeason, extra = {}) => ({ seasons, countedRuns, last: lastSeason, previous: null, endingsSeen: [], verdictsSeen: [], ...extra });

test("the keys the online save carries are the three device keys", () => {
  assert.deepEqual(DEVICE_RECORD_KEYS, {
    seasonRecord: "critical-point-season-record-v1",
    pastPicks: "critical-point-past-picks-v1",
    seenScenes: "critical-point-seen-scenes-v1",
  });
  assert.equal(seenScenesModule.SEEN_SCENES_KEY, config.SEEN_SCENES_KEY, "the module hands on appConfig's key");
  assert.equal(pastPicksModule.PAST_PICKS_KEY, config.PAST_PICKS_KEY);
});

test("season records: the 도감 lists and counted runs are a union, and each device's own finale counts once", () => {
  const local = record(1, ["run-a"], last("run-a", "human-record", "ending_seal"), { endingsSeen: ["human-record"], verdictsSeen: ["ending_seal"] });
  const remote = record(1, ["run-b"], last("run-b", "quiet-cover", "ending_expose"), { endingsSeen: ["quiet-cover"], verdictsSeen: ["ending_expose"] });
  const { lead, record: merged } = mergeSeasonRecords(local, remote);
  assert.equal(lead, "remote", "on a tie the copy being loaded leads");
  assert.equal(merged.seasons, 2, "two devices that each closed a finale count two seasons");
  assert.deepEqual(merged.countedRuns, ["run-a", "run-b"]);
  assert.equal(merged.last.runId, "run-b");
  assert.deepEqual([...merged.endingsSeen].sort(), ["human-record", "quiet-cover"]);
  assert.deepEqual([...merged.verdictsSeen].sort(), ["ending_expose", "ending_seal"]);
  assert.ok(merged.endingBook?.head, "the book's lines are written again from the union");
  assert.deepEqual(normalizeSeasonRecord(merged), merged, "the merge is a record as the device keeps one");
});

test("season records: a copy restored from the other counts nothing twice, and more seasons lead", () => {
  const local = record(3, ["r1", "r2", "r3"], last("r3", "human-record"), { endingsSeen: ["human-record"] });
  const remote = record(2, ["r1", "r2"], last("r2", "quiet-cover"), { endingsSeen: ["quiet-cover"] });
  const { lead, record: merged } = mergeSeasonRecords(local, remote);
  assert.equal(lead, "local");
  assert.equal(merged.seasons, 3);
  assert.equal(merged.last.runId, "r3");
  assert.deepEqual(merged.countedRuns, ["r1", "r2", "r3"]);
  // The same copy both ways is itself.
  assert.equal(mergeSeasonRecords(local, local).record.seasons, 3);
});

test("season records: nothing counted on either side writes nothing, and a missing side is the other", () => {
  assert.equal(mergeSeasonRecords(null, null).record, null);
  assert.equal(mergeSeasonRecords("not json", {}).record, null);
  const only = record(1, ["r1"], last("r1", "human-record"));
  assert.equal(mergeSeasonRecords(null, only).record.last.runId, "r1");
  const kept = mergeSeasonRecords(only, null);
  assert.equal(kept.lead, "local");
  assert.equal(kept.record.last.runId, "r1");
});

test("past picks: one season, from the copy whose last season was kept, or the other when it has none", () => {
  const mine = { v: 1, runId: "run-a", picks: { a: "x:1" }, before: {} };
  const theirs = { v: 1, runId: "run-b", picks: { a: "y:2" }, before: { a: "z:1" } };
  assert.equal(mergePastPicks(mine, theirs, "remote").runId, "run-b");
  assert.equal(mergePastPicks(mine, theirs, "local").runId, "run-a");
  assert.equal(mergePastPicks(mine, { v: 1, runId: null, picks: {}, before: {} }, "remote").runId, "run-a");
  assert.equal(mergePastPicks(null, null), null);
  assert.equal(mergePastPicks({ v: 2, picks: { a: "x:1" } }, null), null, "a record of another version is none");
});

test("read scenes: a union of both copies, with the leading run's 'before' holding every other season", () => {
  const local = { v: 1, runId: "run-a", scenes: seen(["a1", "a2", "b1"]), before: seen(["a1"]) };
  const remote = { v: 1, runId: "run-b", scenes: seen(["a3", "a4"]), before: seen(["a3"]) };
  const merged = mergeSeenScenes(local, remote, "remote", ORDERS);
  assert.equal(merged.runId, "run-b");
  assert.deepEqual(ids(merged.scenes), ["a1", "a2", "a3", "a4", "b1"]);
  assert.deepEqual(ids(merged.before), ["a1", "a2", "a3", "b1"], "what device A read is a season before run-b");
  assert.deepEqual([...pastSeenScenes(merged, "run-b", ORDERS)].sort(), ["a1", "a2", "a3", "b1"]);
  // The same run on both: its 'before' is the two befores.
  const same = mergeSeenScenes({ ...local, runId: "run-b" }, remote, "remote", ORDERS);
  assert.deepEqual(ids(same.before), ["a1", "a3"]);
  assert.equal(mergeSeenScenes(null, { v: 1, scenes: {} }, "remote", ORDERS), null);
});

test("read scenes: a case whose scenes changed since reads as unread, not as somebody else's", () => {
  const stale = { v: 1, runId: "run-b", scenes: { a: "0000:1v" }, before: {} };
  const local = { v: 1, runId: "run-a", scenes: seen(["b2"]), before: {} };
  assert.deepEqual(ids(mergeSeenScenes(local, stale, "remote", ORDERS).scenes), ["b2"]);
});

test("applying a copy's records writes the merged keys and opens NEW GAME+; a copy without them leaves the device's", () => {
  globalThis.localStorage.clear();
  const own = record(1, ["run-a"], last("run-a", "human-record", "ending_seal"), { endingsSeen: ["human-record"], verdictsSeen: ["ending_seal"] });
  globalThis.localStorage.setItem(config.SEASON_RECORD_KEY, JSON.stringify(own));
  assert.deepEqual(applyDeviceRecords(null), []);
  assert.deepEqual(applyDeviceRecords({}), []);
  assert.deepEqual(JSON.parse(globalThis.localStorage.getItem(config.SEASON_RECORD_KEY)), own, "an old copy changes nothing");

  const picks = { v: 1, runId: "run-b", picks: { a: "p:1" }, before: {} };
  const written = applyDeviceRecords({
    seasonRecord: record(1, ["run-b"], last("run-b", "quiet-cover"), { endingsSeen: ["quiet-cover"] }),
    pastPicks: picks,
    seenScenes: "not a record",
  });
  assert.deepEqual(written, ["seasonRecord", "pastPicks"]);
  const stored = JSON.parse(globalThis.localStorage.getItem(config.SEASON_RECORD_KEY));
  assert.equal(stored.seasons, 2);
  assert.deepEqual([...stored.endingsSeen].sort(), ["human-record", "quiet-cover"]);
  assert.deepEqual(JSON.parse(globalThis.localStorage.getItem(config.PAST_PICKS_KEY)), picks);
  assert.equal(globalThis.localStorage.getItem(config.SEEN_SCENES_KEY), null);
  assert.equal(globalThis.localStorage.getItem(config.NEW_GAME_PLUS_KEY), "true");
});

test("a device with a record of its own leads when the copy carries none", () => {
  globalThis.localStorage.clear();
  globalThis.localStorage.setItem(config.SEASON_RECORD_KEY, JSON.stringify(record(1, ["run-a"], last("run-a", "human-record"))));
  const mine = { v: 1, runId: "run-a", picks: { a: "x:1" }, before: {} };
  globalThis.localStorage.setItem(config.PAST_PICKS_KEY, JSON.stringify(mine));
  applyDeviceRecords({ pastPicks: { v: 1, runId: "run-z", picks: { a: "y:2" }, before: {} } });
  assert.equal(JSON.parse(globalThis.localStorage.getItem(config.PAST_PICKS_KEY)).runId, "run-a");
});
