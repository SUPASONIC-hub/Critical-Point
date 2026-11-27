import assert from "node:assert/strict";
import test from "node:test";
import { createWindow, getHeartbeatBpm, MUTATIONS, normalizeRunState, resolveWindow, RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import { BEFORE_TWELVE_RULE, HOT_CASH_BPM, isHotCash, isMarkTwelveOn, readCashBpm, RULES_TWELVE_MARK, TWELVE_RULE, wantsMarkTwelve, withMarkEleven, withMarkTwelve, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES, getUnlockIntro } from "../../src/gauntlet/tableUnlocks.js";
import unlocks from "../../src/copy/unlocks.js";
import tableCopy from "../../src/copy/table.js";

const TWELVE = withMarkTwelve(ALL_RULES, true);
const BEFORE = withMarkTwelve(ALL_RULES, false);

test("RULES_MARK 12: on by default, off in a script with RULES_MARK12=0, and a row of 5 to 11 played without it", () => {
  assert.equal(RULES_TWELVE_MARK, 12);
  assert.equal(RULES_MARK, 12);
  assert.equal(wantsMarkTwelve({}), true);
  assert.equal(wantsMarkTwelve({ process: { env: { RULES_MARK12: "0" } } }), false);
  assert.equal(isMarkTwelveOn(ALL_RULES), true);
  assert.equal(isMarkTwelveOn(TWELVE), true);
  assert.equal(isMarkTwelveOn(BEFORE), false);
  assert.equal(BEFORE.has(BEFORE_TWELVE_RULE), true);
  assert.equal(isMarkTwelveOn(withMarkEleven(ALL_RULES, false)), false, "a set without 11's rules has none of 12's");
  assert.equal(isMarkTwelveOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkTwelve(withMarkEleven(ALL_RULES, false), true).has(TWELVE_RULE), false, "12 does not ride on a set without the marks before");
  for (const mark of [5, 6, 7, 8, 9, 10, 11]) assert.equal(isMarkTwelveOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkTwelveOn(getRowRules("case20", {}, 12)), true);
  assert.equal(withMarkTwelve(TWELVE, true), TWELVE, "the same set back when it already plays it");
});

/* ------------------------------------------------------------- G46 */

test("G46: the OVERCLOCK chain counts cashes at heartbeat 110 or over under 12, ×32 under 11", () => {
  assert.equal(HOT_CASH_BPM, 110);
  const card = { id: "a", label: "a", effect: { capital: 8, trust: 4 }, next: "x" };
  const cash = (gauge, wall, rules, streak = 1) => resolveWindow({ run: normalizeRunState({ streak }), window: { ...createWindow({ seed: "g46" }), status: "cashed", gauge, wall, tellOffset: 0, pushes: 3 }, card, rules });
  // Heat 45 under a wall at 60: the heart races (131) at ×17. Hot under 12, not under 11.
  assert.ok(getHeartbeatBpm(45, 60) >= 110);
  const near = (rules) => cash(45, 60, rules);
  assert.ok(near(TWELVE).verdict.multiplier < 32, `heat 45 pays ×${near(TWELVE).verdict.multiplier}`);
  assert.equal(near(TWELVE).nextRun.streak, 2);
  assert.ok(near(TWELVE).nextRun.schema.mutations.includes("overclock"));
  assert.equal(near(BEFORE).nextRun.streak, 0, "under 11 a ×17 cash breaks the chain");
  // Heat 60 under a wall at 90: ×44 with a calm heart (94). Hot under 11, not under 12.
  assert.ok(getHeartbeatBpm(60, 90) < 110);
  const far = (rules) => cash(60, 90, rules);
  assert.ok(far(TWELVE).verdict.multiplier >= 32);
  assert.equal(far(TWELVE).nextRun.streak, 0, "under 12 a far wall's ×44 breaks the chain");
  assert.equal(far(BEFORE).nextRun.streak, 2);
  assert.equal(getRowRules("case20", {}, 11).has(BEFORE_TWELVE_RULE), true);
  assert.equal(cash(60, 90, getRowRules("case20", {}, 11)).nextRun.streak, 2, "a row of 11 is rechecked on ×32");
  assert.equal(cash(45, 60, TWELVE, 0).nextRun.streak, 1, "one hot cash only lights the chain");
  // A bust never builds it.
  assert.equal(resolveWindow({ run: normalizeRunState({ streak: 1 }), window: { ...createWindow({ seed: "g46" }), status: "bust", gauge: 61, wall: 60, tellOffset: 0, pushes: 3 }, card, rules: TWELVE }).nextRun.streak, 0);
});

test("G46: the heartbeat is the wall's tell, its error in, without the clock's late rise", () => {
  const bpmOf = getHeartbeatBpm;
  const win = { wall: 60, tellOffset: 8, schema: { sedated: false } };
  assert.equal(readCashBpm(45, win, bpmOf), getHeartbeatBpm(45, 68));
  assert.equal(readCashBpm(45, { ...win, schema: { sedated: true } }, bpmOf), getHeartbeatBpm(45, 68, true));
  assert.equal(isHotCash({ multiplier: 17, gauge: 45, window: { wall: 60, tellOffset: 0 }, rules: TWELVE, bpmOf }), true);
  assert.equal(isHotCash({ multiplier: 17, gauge: 45, window: { wall: 60, tellOffset: 0 }, rules: BEFORE, bpmOf }), false);
});

test("G46: the table's words name the heartbeat", () => {
  assert.match(MUTATIONS.overclock.text, new RegExp(`심박 ${HOT_CASH_BPM} 이상`));
  assert.deepEqual(getUnlockIntro("case01"), unlocks.steps.case01.introTwelve);
  assert.match(unlocks.steps.case01.introTwelve[0], new RegExp(`^심박 ${HOT_CASH_BPM} 이상`));
  for (const id of ["live", "held", "dormant"]) assert.match(tableCopy.readout.overdriveBpm[id].text, /\{bpm\}/, id);
});
