import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BASE_SCHEMA, createWindow, decisionWindowSeconds, getWindowBand, openCaseRun, reduceWindow, RUN_INITIAL_STATE } from "../../src/gauntlet/gauntletEngine.js";
import { SCOUT_NARROW_TRUST, SCOUT_TRUST } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot, narrowDue, SCOUT_EXTRA_TIMINGS, SCOUT_TIMINGS, scoutDue } from "../../scripts/sim/season-bot.mjs";
import { bustByPush, clockTallyReducer, narrowPolicy, newClockTally } from "../../scripts/sim/scout-narrow-report.mjs";
import { rewriteScoutValues } from "../../scripts/sim/scout-values.mjs";

/**
 * N43 (2026-11-18): the measurement of B1's second look and B5's clock
 * warning (scripts/sim/scout-narrow-report.mjs). Its pieces are held here; the
 * numbers it prints are the owner's to read, not asserted.
 */
const look = (win) => reduceWindow(win, { type: "SCOUT" }, ALL_RULES);

test("narrowFirst looks and narrows before the first push, and the default runs never play it", () => {
  assert.equal(SCOUT_TIMINGS.includes("narrowFirst"), false, "check:endings and check:pressure play what they played");
  assert.ok(SCOUT_EXTRA_TIMINGS.includes("narrowFirst"));
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "n43:first" });
  assert.equal(scoutDue("narrowFirst", fresh), true);
  assert.equal(narrowDue("narrowFirst", fresh), false, "not before the first look");
  const once = look(fresh);
  assert.equal(narrowDue("narrowFirst", once), true, "at once after it, whatever the gauge");
  assert.equal(narrowDue("narrowFirst", look(once)), false, "and not twice");
  // The risky hand is as it was: only when the next push reaches the first band.
  const band = getWindowBand(once);
  assert.equal(narrowDue("narrow", { ...once, gauge: band.wallMin - BASE_SCHEMA.stepMax - 1 }, 0), false);
  assert.equal(narrowDue("narrow", { ...once, gauge: band.wallMin - BASE_SCHEMA.stepMax }, 0), true);
  assert.equal(narrowDue("always", { ...once, gauge: band.wallMin }, 0), false);
});

test("the season bot plays narrowFirst on every table it can pay for, and not without both looks' 믿음", () => {
  const hand = createSeasonBot({ seed: 20261118, staged: STAGED, archetypes: { hand: { values: { trust: 1 }, noise: 2, board: "listens", scout: "narrowFirst" } } });
  const policy = hand.makePolicy("hand");
  assert.equal(policy.scout, "narrowFirst");
  const run = openCaseRun({ ...RUN_INITIAL_STATE }, { rules: ALL_RULES });
  for (let index = 0; index < 20; index += 1) {
    const paid = hand.playWindow(policy, run, `n43:pay:${index}`, ALL_RULES, null, SCOUT_TRUST + SCOUT_NARROW_TRUST);
    assert.equal(paid.narrowed, paid.scouted, `${index}: every look is narrowed`);
    assert.equal(hand.playWindow(policy, run, `n43:pay:${index}`, ALL_RULES, null, SCOUT_TRUST + SCOUT_NARROW_TRUST - 1).narrowed, false);
  }
});

test("check:endings plays the timings ENDING_SCOUT_TIMINGS asks for, and checks them", () => {
  const source = readFileSync(new URL("../../scripts/check-endings.mjs", import.meta.url), "utf8");
  assert.match(source, /process\.env\.ENDING_SCOUT_TIMINGS/);
  assert.match(source, /is not one of/);
});

test("the case table's narrowing hand narrows by its own timing and pushes on the narrowed band", () => {
  const listening = () => true;
  const risky = narrowPolicy({ margin: 6, listening, edge: 0, inner: 3 });
  const first = narrowPolicy({ margin: 6, listening, edge: 0, inner: 3, first: true });
  const once = look(createWindow({ schema: BASE_SCHEMA, seed: "n43:policy" }));
  const band = getWindowBand(once);
  assert.equal(risky.scout(createWindow({ schema: BASE_SCHEMA, seed: "x" })), true);
  assert.equal(risky.narrow({ ...once, gauge: band.wallMin - BASE_SCHEMA.stepMax - 1 }), false);
  assert.equal(first.narrow({ ...once, gauge: 0 }), true);
  const narrowed = look(once);
  const near = getWindowBand(narrowed).wallMin;
  assert.equal(risky({ ...narrowed, gauge: near - BASE_SCHEMA.stepMax + 2 }), true);
  assert.equal(risky({ ...narrowed, gauge: near - BASE_SCHEMA.stepMax + 3 }), false);
});

test("the clock tally warns exactly when the next push can cross a tier, and no push cuts the clock unwarned", () => {
  const counts = newClockTally();
  const reduce = clockTallyReducer(() => counts);
  for (let index = 0; index < 200; index += 1) {
    let win = reduce(createWindow({ schema: BASE_SCHEMA, seed: `n43:clock:${index}` }), { type: "SELECT", id: "sim" }, ALL_RULES);
    for (let press = 0; press < 12 && win.status === "live"; press += 1) {
      win = reduce(win, { type: "PUSH" }, ALL_RULES);
      win = reduce(win, { type: "TICK", delta: 0.6 }, ALL_RULES);
    }
    if (win.status === "live") reduce(win, { type: "CASH" }, ALL_RULES);
  }
  assert.equal(counts.windows, 200, "every window closes once");
  assert.ok(counts.warned > 0 && counts.warned < counts.pushes);
  assert.ok(counts.warnedCut > 0 && counts.warnedCut <= counts.warned);
  assert.equal(counts.unwarnedCut, 0, "the clock is never shorter than the push said");
  assert.ok(counts.cutWindows <= counts.warnedWindows);
  // A push from 0 cannot reach the second tier (45): no warning.
  const quiet = newClockTally();
  reduceWithTally(quiet, createWindow({ schema: BASE_SCHEMA, seed: "n43:quiet" }));
  assert.equal(quiet.warned, 0);
  assert.equal(decisionWindowSeconds(0, BASE_SCHEMA) > decisionWindowSeconds(45, BASE_SCHEMA), true);
});

function reduceWithTally(counts, win) {
  return clockTallyReducer(() => counts)(win, { type: "PUSH" }, ALL_RULES);
}

test("bust by push reads each push's busts against the windows that reached it", () => {
  const rows = bustByPush({ pushed: { 1: 10, 2: 20, 3: 10 }, bustAt: { 2: 4, 3: 5 } }, 4);
  assert.deepEqual(rows.map(({ reached }) => reached), [40, 30, 10, 0]);
  assert.deepEqual(rows.map(({ rate }) => rate), [0, 4 / 30, 0.5, 0]);
});

test("scout-values rewrites the second look's numbers and refuses anything else", () => {
  const source = "export const SCOUT_NARROW_REACH = 7;\nexport const SCOUT_NARROW_TRUST = 2;\n";
  assert.equal(rewriteScoutValues(source, { SCOUT_NARROW_REACH: 6, SCOUT_NARROW_TRUST: 3 }), "export const SCOUT_NARROW_REACH = 6;\nexport const SCOUT_NARROW_TRUST = 3;\n");
  assert.throws(() => rewriteScoutValues(source, { SCOUT_REACH: 9 }), /not one of/);
  assert.throws(() => rewriteScoutValues(source, { SCOUT_NARROW_REACH: 6.5 }), /whole number/);
  assert.throws(() => rewriteScoutValues("export const SCOUT_NARROW_REACH = 2 * 3;", { SCOUT_NARROW_REACH: 6 }), /no longer a plain number/);
  // The game's file still has both as plain numbers.
  const rules = readFileSync(new URL("../../src/gauntlet/tableRules.js", import.meta.url), "utf8");
  assert.doesNotThrow(() => rewriteScoutValues(rules, { SCOUT_NARROW_REACH: 7, SCOUT_NARROW_TRUST: 2 }));
});
