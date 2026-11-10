import assert from "node:assert/strict";
import test from "node:test";

import {
  BASE_SCHEMA,
  createWindow,
  decisionWindowSeconds,
  getReadingSeconds,
  getRemainingSeconds,
  getTableClockScale,
  getWindowSeconds,
  normalizeRunState,
  normalizeSchema,
  reduceWindow,
  stakeTier,
  suspendWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { SILENCE_SECONDS, STAKE_CLOCK_CUT, STAKE_CLOCK_FLOOR, STAKE_LAYER_GAUGES, WINDOW_SECONDS } from "../../src/gauntlet/tableRules.js";
import { STAKE_LAYER_GAUGES as SCORE_GAUGES, stakeLayerCount } from "../../src/components/musicScore.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { compactSchema, recheckWindow } from "../../src/gauntlet/windowReplay.js";
import { createCaseBot } from "../../scripts/sim/season-bot.mjs";
import { createWindowRecorder, thresholdOf } from "./helpers/windowRecorder.mjs";

/**
 * The stake clock (개선 포인트 B5, 2026-11-05, the user's answer 1): the
 * decision window's clock shortens with the stake, in the open -- 45 seconds
 * under the second stake layer, 40 from it, 35 from the third -- on the
 * same three layers the score plays (#388). A board from before has no
 * `stakeClock` and keeps the flat 45; the comfort settings still win.
 */

/** A board whose wall the creep cannot reach and whose clock does not creep, so only the stake moves the clock. */
const STILL = normalizeSchema({ ...BASE_SCHEMA, wallMin: 96, wallMax: 98, creep: 0 });
/** The same board as a save or a record from before 2026-11-05 carries it: nothing said of the stake clock. */
const { stakeClock: _flat, ...FLAT_SOURCE } = STILL;
const FLAT = normalizeSchema(FLAT_SOURCE);

/** The window at a stake and a clock of my choosing, on a board the creep cannot bust. */
const at = (gauge, elapsed, schema = STILL) => ({ ...createWindow({ schema, seed: `stake:${gauge}:${elapsed}` }), gauge, elapsed });

test("the clock reads the stake in the score's three tiers: 45, 40 and 35 seconds", () => {
  assert.equal(SCORE_GAUGES, STAKE_LAYER_GAUGES, "one list for the ear and the eye");
  assert.deepEqual(STAKE_LAYER_GAUGES, [25, 45, 65]);
  assert.equal(WINDOW_SECONDS, 45);
  assert.equal(STAKE_CLOCK_CUT, 5);
  const table = [
    [0, 45],
    [24, 45],
    [25, 45],
    [44, 45],
    [45, 40],
    [64, 40],
    [65, 35],
    [100, 35],
  ];
  for (const [gauge, seconds] of table) {
    assert.equal(decisionWindowSeconds(gauge), seconds, `gauge ${gauge}`);
    assert.equal(decisionWindowSeconds(gauge, BASE_SCHEMA), seconds, `gauge ${gauge} on the plain board`);
    assert.equal(stakeTier(gauge), Math.max(0, stakeLayerCount(gauge) - 1), `tier at ${gauge} is the layers in, less the first`);
  }
  assert.equal(decisionWindowSeconds(undefined), 45);
  assert.equal(decisionWindowSeconds(NaN), 45);
});

test("a board's own clock is cut the same way, never under the floor, and a flat board is not cut", () => {
  const silence = normalizeSchema({ ...BASE_SCHEMA, seconds: SILENCE_SECONDS });
  assert.deepEqual([0, 45, 65].map((gauge) => decisionWindowSeconds(gauge, silence)), [30, 25, 20]);
  const shortest = normalizeSchema({ ...BASE_SCHEMA, seconds: STAKE_CLOCK_FLOOR });
  assert.deepEqual([0, 45, 65].map((gauge) => decisionWindowSeconds(gauge, shortest)), [12, 12, 12]);
  assert.equal(normalizeSchema({ ...BASE_SCHEMA, seconds: 14 }).seconds, 14);
  assert.equal(decisionWindowSeconds(65, normalizeSchema({ ...BASE_SCHEMA, seconds: 14 })), STAKE_CLOCK_FLOOR);
  assert.equal(FLAT.stakeClock, false);
  assert.deepEqual([0, 45, 65].map((gauge) => decisionWindowSeconds(gauge, FLAT)), [45, 45, 45]);
});

test("a board says it has the stake clock; one that says nothing was dealt before it", () => {
  assert.equal(BASE_SCHEMA.stakeClock, true);
  assert.equal(normalizeSchema(BASE_SCHEMA).stakeClock, true);
  assert.equal(normalizeSchema({}).stakeClock, false, "a save from before 2026-11-05");
  assert.equal(normalizeSchema({ stakeClock: "true" }).stakeClock, false, "only a boolean says so");
  assert.equal(normalizeSchema({ stakeClock: null }).stakeClock, false);
  // The run: a save that holds a board without it keeps the flat clock on that board.
  assert.equal(normalizeRunState({ schema: { wallMin: 60 } }).schema.stakeClock, false);
  assert.equal(normalizeRunState({ schema: BASE_SCHEMA }).schema.stakeClock, true);
  assert.equal(normalizeRunState({}).schema.stakeClock, true, "a new run deals the plain board");
  // The record: a plain board of this build names it, one from before is `{}`.
  assert.deepEqual(compactSchema(BASE_SCHEMA), { stakeClock: true });
  assert.equal(normalizeSchema(compactSchema(FLAT)).stakeClock, false);
});

test("the HUD counts down the clock the stake leaves, and the window runs out on it", () => {
  let win = reduceWindow(createWindow({ schema: STILL, seed: "hud" }), { type: "SELECT", id: "a" }, ALL_RULES);
  assert.equal(getWindowSeconds(win), 45);
  for (let tick = 0; tick < 10; tick += 1) win = reduceWindow(win, { type: "TICK", delta: 1 }, ALL_RULES);
  assert.equal(getRemainingSeconds(win), 35);
  while (win.gauge < 45) win = reduceWindow(win, { type: "PUSH" }, ALL_RULES);
  assert.equal(win.status, "live");
  assert.equal(getWindowSeconds(win), win.gauge >= 65 ? 35 : 40, "a push into the second layer takes five seconds off the clock");
  assert.equal(getRemainingSeconds(win), getWindowSeconds(win) - 10);
  // It runs out on that clock, to the second, with the heat it stood at.
  let ticks = 0;
  while (win.status === "live") {
    win = reduceWindow(win, { type: "TICK", delta: 0.3 }, ALL_RULES);
    ticks += 1;
  }
  assert.equal(win.cause, "timeout");
  assert.equal(win.elapsed, getWindowSeconds(win));
  assert.equal(getRemainingSeconds(win), 0);
  assert.ok(Math.abs(ticks * 0.3 - (getWindowSeconds(win) - 10)) < 0.3 + 1e-9);
});

test("the flat board of an old run runs out at 45 whatever its heat", () => {
  let win = reduceWindow(createWindow({ schema: FLAT, seed: "flat" }), { type: "SELECT", id: "a" }, ALL_RULES);
  while (win.gauge < 65) win = reduceWindow(win, { type: "PUSH" }, ALL_RULES);
  assert.equal(getWindowSeconds(win), 45);
  for (let tick = 0; tick < 44; tick += 1) win = reduceWindow(win, { type: "TICK", delta: 1 }, ALL_RULES);
  assert.equal(win.status, "live");
  assert.equal(getRemainingSeconds(win), 1);
  win = reduceWindow(win, { type: "TICK", delta: 1 }, ALL_RULES);
  assert.deepEqual([win.status, win.cause, win.elapsed], ["bust", "timeout", 45]);
});

test("a push that lifts the stake past a clock already run is the window's last press", () => {
  // Heat 40 at 42 seconds: the clock stands at 45 with three to go. The push
  // lands in the second layer, whose clock is 40, and the window is out.
  const late = reduceWindow(at(40, 42), { type: "PUSH" }, ALL_RULES);
  assert.ok(late.gauge >= 45);
  assert.deepEqual([late.status, late.cause, late.elapsed, late.pushes], ["bust", "timeout", 42, 1]);
  // The same push ten seconds earlier leaves a clock to play.
  const early = reduceWindow(at(40, 32), { type: "PUSH" }, ALL_RULES);
  assert.equal(early.status, "live");
  assert.equal(getRemainingSeconds(early), early.gauge >= 65 ? 3 : 8);
  // The same window on a flat board plays on.
  const flat = reduceWindow(at(40, 42, FLAT), { type: "PUSH" }, ALL_RULES);
  assert.equal(flat.status, "live");
  assert.equal(getRemainingSeconds(flat), 3);
});

test("the creep's own climb into a tier runs the clock out at that moment, the same in any slice of time", () => {
  // Creep 2 a second from the fourth second: heat 40 at 38 seconds climbs to
  // 45 at 40.5 -- where the clock is already 40 -- whatever the tick is.
  const creeping = normalizeSchema({ ...STILL, creep: 2 });
  const expect = { elapsed: 40.5, gauge: 45 };
  for (const delta of [1, 0.25, 0.13, 0.07]) {
    let win = at(40, 38, creeping);
    while (win.status === "live") win = reduceWindow(win, { type: "TICK", delta }, ALL_RULES);
    assert.equal(win.cause, "timeout", `delta ${delta}`);
    assert.ok(Math.abs(win.elapsed - expect.elapsed) < 1e-9, `delta ${delta}: elapsed ${win.elapsed}`);
    assert.ok(Math.abs(win.gauge - expect.gauge) < 1e-9, `delta ${delta}: gauge ${win.gauge}`);
  }
  // Heat 20 at 30 seconds reaches 45 at 42.5 and 65 at 52.5: the bell of the
  // second tier, 40, is behind it when it gets there, so it busts at 42.5.
  let win = at(20, 30, creeping);
  while (win.status === "live") win = reduceWindow(win, { type: "TICK", delta: 0.4 }, ALL_RULES);
  assert.deepEqual([win.cause, Math.round(win.elapsed * 1000) / 1000, Math.round(win.gauge * 1000) / 1000], ["timeout", 42.5, 45]);
  // And a window the bell catches first stops on the bell with the heat of that moment, not the tick's end.
  let bell = at(10, 44.9, creeping);
  bell = reduceWindow(bell, { type: "TICK", delta: 1 }, ALL_RULES);
  assert.deepEqual([bell.cause, bell.elapsed, Math.round(bell.gauge * 1000) / 1000], ["timeout", 45, 10.2]);
  // The wall and the bell inside one tick: whichever the creep reaches first.
  // Heat 40 at 38 reaches 45 (the bell, 40.5) before a wall at 46 (41); a wall
  // at 44 is reached at 40, before any bell, whatever the tick.
  for (const delta of [1, 0.13]) {
    let timed = { ...at(40, 38, creeping), wall: 46 };
    while (timed.status === "live") timed = reduceWindow(timed, { type: "TICK", delta }, ALL_RULES);
    assert.deepEqual([timed.cause, Math.round(timed.elapsed * 1000) / 1000, Math.round(timed.gauge * 1000) / 1000], ["timeout", 40.5, 45], `delta ${delta}`);
    let walled = { ...at(40, 38, creeping), wall: 44 };
    while (walled.status === "live") walled = reduceWindow(walled, { type: "TICK", delta }, ALL_RULES);
    assert.deepEqual([walled.cause, walled.gauge], ["creep", 44], `delta ${delta}`);
    assert.ok(walled.elapsed >= 40 - 1e-9 && walled.elapsed < 40 + delta + 1e-9, `delta ${delta}: elapsed ${walled.elapsed}`);
  }
});

test("a window recorded on the stake clock replays on it, and one recorded before replays flat", () => {
  const recorder = createWindowRecorder();
  const play = (schema, seed, { pushAt, cashAt = null, delta = 0.13 }) => {
    let win = recorder.reduce(createWindow({ schema, seed }), { type: "SELECT", id: "a" }, ALL_RULES);
    const pushes = [...pushAt];
    for (let tick = 1; tick < 2000 && win.status === "live"; tick += 1) {
      win = recorder.reduce(win, { type: "TICK", delta }, ALL_RULES);
      while (pushes.length && win.status === "live" && win.elapsed >= pushes[0]) {
        pushes.shift();
        win = recorder.reduce(win, { type: "PUSH" }, ALL_RULES);
      }
      if (cashAt !== null && win.status === "live" && win.elapsed >= cashAt) win = recorder.reduce(win, { type: "CASH" }, ALL_RULES);
    }
    return win;
  };
  // Pushed into the third layer early, cashed with the clock at 35.
  const cashed = play(STILL, "replay:cash", { pushAt: [2, 4, 6, 8, 10, 12, 14], cashAt: 20 });
  assert.equal(cashed.status, "cashed");
  // Pushed into the second layer with the clock at 42: the push runs it out.
  const pushedOut = play(STILL, "replay:push-out", { pushAt: [41, 41.5, 42, 42.5, 43, 43.5, 44] });
  assert.deepEqual([pushedOut.status, pushedOut.cause], ["bust", "timeout"]);
  assert.ok(pushedOut.elapsed < 45, `ran out at ${pushedOut.elapsed} on a shortened clock`);
  // Crept into the second layer with the clock past 40.
  const crept = play(normalizeSchema({ ...STILL, creep: 1.5 }), "replay:creep", { pushAt: [30, 30.5, 31] });
  assert.deepEqual([crept.status, crept.cause], ["bust", "timeout"]);
  // The same presses on a flat board run the whole 45.
  const flat = play(FLAT, "replay:flat", { pushAt: [41, 41.5, 42, 42.5, 43, 43.5, 44] });
  assert.deepEqual([flat.status, flat.cause, flat.elapsed], ["bust", "timeout", 45]);
  assert.equal(recorder.closed.length, 4);
  for (const { record, window, rules } of recorder.closed) {
    const result = recheckWindow(record, thresholdOf(window), rules);
    assert.equal(result.status, "match", `${record.seed}: ${result.problem ?? result.differs.join(",")}`);
    assert.equal(result.window.cause, window.cause, record.seed);
  }
  // The records say which clock they were played on; the flat one says nothing of it.
  assert.equal(recorder.closed[0].record.schema.stakeClock, true);
  assert.equal("stakeClock" in recorder.closed[3].record.schema, false);
  // A record of this build read with its stake clock stripped -- as an old record would be -- replays flat and does not match.
  const { stakeClock: _named, ...stripped } = recorder.closed[1].record.schema;
  const stripResult = recheckWindow({ ...recorder.closed[1].record, schema: stripped }, thresholdOf(pushedOut), ALL_RULES);
  assert.notEqual(stripResult.status, "match", "the clock is part of the record");
});

test("a window put down keeps its board's clock when it is picked up", () => {
  // Heat 50 at 39 seconds on the stake clock: there is one second left, and a
  // save that claims more is clamped under the bell. The flat board allows 44.9.
  const suspended = suspendWindow({ ...at(50, 43), status: "live" }, 3);
  const resumed = createWindow({ schema: STILL, seed: suspended.seed, resume: suspended.window });
  assert.equal(resumed.status, "live");
  assert.ok(resumed.elapsed <= 39.9 + 1e-9, `elapsed ${resumed.elapsed}`);
  const flat = createWindow({ schema: FLAT, seed: suspended.seed, resume: suspended.window });
  assert.ok(Math.abs(flat.elapsed - 43) < 1e-9, "an old run's suspended window keeps the clock it stood at");
});

test("the comfort settings still win: the table-time scale slows the stake clock, and the reading clock is untouched", () => {
  // The scale rides on the seconds that reach the reducer, so a window at the
  // top tier under 테이블 시간 ×2 takes twice as many real seconds to run out.
  assert.equal(getTableClockScale({}, 2), 2);
  assert.equal(getTableClockScale({ story: true }, 1), 2, "a story run's clock is never faster than twice as slow");
  let win = at(70, 0);
  assert.equal(getWindowSeconds(win), 35);
  let real = 0;
  while (win.status === "live") {
    win = reduceWindow(win, { type: "TICK", delta: 0.5 / 2, scale: 2 }, ALL_RULES);
    real += 0.5;
  }
  assert.deepEqual([win.cause, win.elapsed, win.timeScale], ["timeout", 35, 2]);
  assert.ok(Math.abs(real - 70) < 1e-9, `${real} real seconds for 35 on the clock`);
  // The briefing page's reading clock (읽기 시계 자동 넘김 끄기 holds it) does not know the stake.
  const node = { lead: "가".repeat(100), text: "나".repeat(300) };
  assert.equal(getReadingSeconds(node), getReadingSeconds(node, []));
  assert.equal(getReadingSeconds(node), 46);
});

test("the bots play on the stake clock the engine deals", () => {
  // The case bot opens its windows with `createWindow` and plays them through
  // `reduceWindow`: every window it settles was dealt with the stake clock.
  const recorder = createWindowRecorder();
  const cases = createCaseBot({ windowsPerCase: 6, card: { id: "sim", label: "sim", effect: { capital: 12 } }, sceneFor: () => null, links: false, reduce: recorder.reduce });
  const decide = (window) => window.gauge < 50;
  for (let caseIndex = 0; caseIndex < 3; caseIndex += 1) cases.playCase(caseIndex, decide, undefined, [], null);
  assert.ok(recorder.closed.length >= 6, `${recorder.closed.length} windows`);
  let shortened = 0;
  for (const { record, window, rules } of recorder.closed) {
    assert.equal(record.schema.stakeClock, true, "every board the bot is dealt has the stake clock");
    assert.equal(recheckWindow(record, thresholdOf(window), rules).status, "match");
    if (getWindowSeconds(window) < window.schema.seconds) shortened += 1;
  }
  assert.ok(shortened > 0, "a bot that pushes to 50 plays windows whose clock the stake has cut");
});
