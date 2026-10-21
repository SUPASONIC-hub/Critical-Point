import assert from "node:assert/strict";
import test from "node:test";

import { BASE_SCHEMA, createWindow, normalizeRunState, reduceWindow, RUN_INITIAL_STATE, suspendWindow } from "../../src/gauntlet/gauntletEngine.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { recheckWindow } from "../../src/gauntlet/windowReplay.js";
import { MAX_TRAIL, openTraced, recordClosedWindow, reduceTraced, TRAIL_DIGITS } from "../../src/gauntlet/windowTrail.js";

/** What useGauntletWindow does with each event: the window, its trail carried on it. */
const press = (state, event) => reduceTraced(state, event, ALL_RULES);
const tick = (delta = 0.113) => ({ type: "TICK", delta });
const threshold = (window) => ({ busted: window.status !== "cashed", cause: window.cause, gauge: Math.round(window.gauge), wall: window.wall, pushes: window.pushes });

test("the page writes the clock to the thousandth", () => {
  assert.equal(TRAIL_DIGITS, 3);
  let state = openTraced({ seed: "trail:1" });
  assert.deepEqual(state.trail, []);
  for (const event of [{ type: "SELECT", id: "a" }, tick(), tick(), { type: "PUSH" }, tick(0.3333333), { type: "CASH" }]) state = press(state, event);
  assert.deepEqual(state.trail, [[0, "S", "a"], [0.226, "P"], [0.559, "C"]]);
  const record = recordClosedWindow(state);
  assert.equal(record.end, 0.56, "the end clock is rounded up");
  assert.equal(recheckWindow(record, threshold(state), ALL_RULES).status, "match");
});

test("a window put down and picked up again keeps its trail through the save, and replays whole", () => {
  let state = openTraced({ seed: "trail:resume" });
  for (const event of [{ type: "SELECT", id: "a" }, ...Array(8).fill(tick()), { type: "PUSH" }, ...Array(5).fill(tick())]) state = press(state, event);
  // What useWindowSuspension writes: the stage hands the window over with its trail.
  const run = normalizeRunState({ ...RUN_INITIAL_STATE, suspended: suspendWindow(state, 0) });
  assert.deepEqual(run.suspended.window.trail, state.trail);
  // A JSON round trip, as the save takes it, and the table dealt again from the seed.
  const saved = JSON.parse(JSON.stringify(run.suspended));
  let resumed = openTraced({ seed: saved.seed, resume: saved.window });
  for (const event of [...Array(4).fill(tick()), { type: "PUSH" }, tick(), { type: "CASH" }]) resumed = press(resumed, event);
  assert.equal(resumed.status, "cashed");
  assert.equal(resumed.trail.filter(([, code]) => code === "P").length, 2);
  const record = recordClosedWindow(resumed);
  assert.equal(recheckWindow(record, threshold(resumed), ALL_RULES).status, "match");
});

test("a save that kept no trail, or one longer than any window, resumes with none, and the window leaves no record", () => {
  const live = reduceWindow(createWindow({ seed: "trail:old" }), { type: "SELECT", id: "a" });
  for (const trail of [undefined, "not a trail", { 0: [0, "P"] }, Array.from({ length: MAX_TRAIL + 1 }, () => [0, "P"])]) {
    const run = normalizeRunState({ ...RUN_INITIAL_STATE, suspended: suspendWindow({ ...live, trail }, 0) });
    assert.equal(run.suspended.window.trail, undefined, JSON.stringify(trail)?.slice(0, 40));
  }
  // The table starts a resumed window's trail from what the save kept: nothing here.
  const state = press(openTraced({ seed: "trail:old", resume: { gauge: 10 } }), { type: "PUSH" });
  assert.equal(state.trail, null);
  assert.equal(recordClosedWindow(press(state, { type: "CASH" })), null);
});

test("no record for a window walked away from, none without a window, and a trail past any real window is let go", () => {
  const left = createWindow({ seed: "trail:left", abandoned: true });
  assert.equal(left.cause, "abandon");
  assert.equal(recordClosedWindow({ ...left, trail: [] }), null);
  assert.equal(recordClosedWindow(null), null);
  assert.equal(recordClosedWindow({ status: "cashed", trail: [] }), null);
  // A card picked and put back past the trail's length: the trail goes, not a cut one.
  let state = openTraced({ seed: "trail:long" });
  for (let pick = 0; pick <= MAX_TRAIL; pick += 1) state = press(state, { type: "SELECT", id: pick % 2 ? "a" : "b" });
  assert.equal(state.trail, null);
  // A re-deal before the window is touched starts the trail again.
  const redealt = press({ ...createWindow({ seed: "trail:redeal" }), trail: [[0, "S", "a"]] }, { type: "REDEAL", schema: { ...BASE_SCHEMA, wallMin: 60 } });
  assert.deepEqual(redealt.trail, []);
});
