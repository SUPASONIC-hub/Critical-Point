import assert from "node:assert/strict";
import test from "node:test";
import { RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import { BEFORE_NINE_RULE, isMarkNineOn, NINE_RULE, RULES_NINE_MARK, wantsMarkNine, withMarkEight, withMarkNine, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";

const NINE = withMarkNine(ALL_RULES, true);
const EIGHT = withMarkNine(ALL_RULES, false);

test("RULES_MARK 9: the engine's mark, on by default, and a row of 5 to 8 played without it", () => {
  assert.equal(RULES_MARK, 9);
  assert.equal(RULES_NINE_MARK, 9);
  assert.equal(wantsMarkNine({}), true);
  assert.equal(wantsMarkNine({ process: { env: { RULES_MARK9: "0" } } }), false);
  assert.equal(isMarkNineOn(ALL_RULES), true);
  assert.equal(isMarkNineOn(NINE), true);
  assert.equal(isMarkNineOn(EIGHT), false);
  assert.equal(EIGHT.has(BEFORE_NINE_RULE), true);
  assert.equal(isMarkNineOn(withMarkEight(ALL_RULES, false)), false, "a set without 8's rules has none of 9's");
  assert.equal(isMarkNineOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkNine(withMarkEight(ALL_RULES, false), true).has(NINE_RULE), false, "9 does not ride on a set without 8");
  for (const mark of [5, 6, 7, 8]) assert.equal(isMarkNineOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkNineOn(getRowRules("case20", {}, 9)), true);
  assert.equal(withMarkNine(NINE, true), NINE, "the same set back when it already plays them");
});
