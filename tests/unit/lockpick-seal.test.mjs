import assert from "node:assert/strict";
import test from "node:test";

import { lockpickOpensSeal } from "../../src/gauntlet/gauntletEngine.js";
import { GAUGE_MARKS, HEAT_DEBT_GAUGE, SEAL_BREAK_GAUGE } from "../../src/gauntlet/tableRules.js";

const schema = { sealBreak: 22 };

test("the lockpick opens a seal only on the push that crosses its lowered line and stops short of the usual one", () => {
  assert.equal(lockpickOpensSeal(["lockpick"], schema, 18, 25), true);
  assert.equal(lockpickOpensSeal([], schema, 18, 25), false);
  assert.equal(lockpickOpensSeal(["lockpick"], schema, 22, 28), false);
  assert.equal(lockpickOpensSeal(["lockpick"], schema, 18, 21), false);
  assert.equal(lockpickOpensSeal(["lockpick"], schema, 18, SEAL_BREAK_GAUGE), false);
});

test("the gauge marks the two heats the rules read", () => {
  assert.deepEqual(GAUGE_MARKS, [SEAL_BREAK_GAUGE, HEAT_DEBT_GAUGE]);
});
