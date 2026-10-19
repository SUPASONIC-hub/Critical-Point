import assert from "node:assert/strict";
import test from "node:test";

import { migrateSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { BASE_SCHEMA, createWindow, getWindowBand, reduceWindow, suspendWindow } from "../../src/gauntlet/gauntletEngine.js";
import { SCOUT_REACH, SCOUT_SECONDS } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, rulesFor } from "../../src/gauntlet/tableUnlocks.js";

/**
 * SCOUT (B1, 11일차): one look a window, paid in table clock, that narrows the
 * drawn band to `2 * SCOUT_REACH` around the wall -- never onto it.
 */
const seeds = Array.from({ length: 400 }, (_, index) => `scout:${index}`);

test("a look narrows the band to one that holds the wall, inside the board's band", () => {
  const middles = new Set();
  for (const seed of seeds) {
    const win = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed }), { type: "SCOUT" }, ALL_RULES);
    const band = getWindowBand(win);
    assert.equal(band.scouted, true);
    assert.ok(band.wallMin <= win.wall && win.wall <= band.wallMax, `${seed}: the wall is inside`);
    assert.ok(band.wallMin >= win.schema.wallMin && band.wallMax <= win.schema.wallMax, `${seed}: and the band inside the board's`);
    assert.ok(band.wallMax - band.wallMin <= SCOUT_REACH * 2);
    middles.add(win.wall - (band.wallMin + band.wallMax) / 2);
  }
  assert.ok(middles.size > 5, "the middle of the band is not the wall");
});

test("a look costs SCOUT_SECONDS of clock, once a window, and only where the case has it", () => {
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "scout:clock" });
  assert.deepEqual(getWindowBand(fresh), { wallMin: fresh.schema.wallMin, wallMax: fresh.schema.wallMax, scouted: false });
  const looked = reduceWindow(fresh, { type: "SCOUT" }, ALL_RULES);
  assert.equal(looked.elapsed, SCOUT_SECONDS);
  assert.equal(reduceWindow(looked, { type: "SCOUT" }, ALL_RULES), looked, "a second look is nothing");
  const before = rulesFor("prologue02", { staged: true });
  assert.equal(before.has("scout"), false);
  assert.equal(reduceWindow(fresh, { type: "SCOUT" }, before), fresh, "before the rule, the window is as it was");
  assert.equal(rulesFor("prologue03", { staged: true }).has("scout"), true);
});

test("a window put down after a look comes back with it, and the band is dealt again from the seed", () => {
  const looked = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed: "scout:resume" }), { type: "SCOUT" }, ALL_RULES);
  const suspended = suspendWindow(looked, 4);
  assert.equal(suspended.window.scouted, true);
  const resumed = createWindow({ schema: BASE_SCHEMA, seed: suspended.seed, resume: suspended.window });
  assert.deepEqual(getWindowBand(resumed), getWindowBand(looked));
});

test("a v2 save reaches v3 with its put-down window marked as not looked at", () => {
  assert.equal(SAVE_SCHEMA_VERSION, 3);
  const v2 = { saveSchemaVersion: 2, dynamics: { suspended: { seed: "s", windowIndex: 1, window: { gauge: 10 } } } };
  const v3 = migrateSavedState(v2);
  assert.equal(v3.saveSchemaVersion, 3);
  assert.equal(v3.dynamics.suspended.window.scouted, false);
  assert.equal(migrateSavedState({ saveSchemaVersion: 1 }).saveSchemaVersion, 3, "a v1 save steps through v2");
  assert.equal(migrateSavedState({ saveSchemaVersion: 4 }), null, "a save from a newer build is not read");
});
