import assert from "node:assert/strict";
import test from "node:test";
import { RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import {
  BEFORE_FIFTEEN_RULE, FIFTEEN_RULE, halveSkilledHarm, isMarkFifteenOn, quartersSkilledHarm, RULES_FIFTEEN_MARK, SKILL_HARM_MULTIPLIER, SKILL_HARM_QUARTER,
  wantsMarkFifteen, withMarkFifteen, withMarkFourteen, withNextRules,
} from "../../src/gauntlet/nextTableRules.js";
import { marksOnByDefault } from "../../src/gauntlet/rulesSwitch.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { applySceneEffect } from "../../src/sceneEffect.js";
import {
  getRiskHarmWeight, getRiskPressure, getRiskPressureDrivers, holdRiskStory, RISK_HARM_WEIGHT, RISK_HARM_WEIGHT_FIFTEEN, riskHarmWeightFor, withRiskHarmWeight,
} from "../../src/riskLogic.js";
import tableCopy from "../../src/copy/table.js";

const FIFTEEN = withMarkFifteen(ALL_RULES, true);
const BEFORE = withMarkFifteen(ALL_RULES, false);

test("RULES_MARK 15: on by default, off in a script with RULES_MARK15=0, and a row of 5 to 14 played without it", () => {
  assert.equal(RULES_FIFTEEN_MARK, 15);
  assert.equal(RULES_MARK, 15);
  assert.equal(wantsMarkFifteen({}), true);
  assert.equal(wantsMarkFifteen({ process: { env: { RULES_MARK15: "0" } } }), false);
  assert.equal(isMarkFifteenOn(ALL_RULES), true);
  assert.equal(isMarkFifteenOn(FIFTEEN), true);
  assert.equal(isMarkFifteenOn(BEFORE), false);
  assert.equal(BEFORE.has(BEFORE_FIFTEEN_RULE), true);
  assert.equal(isMarkFifteenOn(withMarkFourteen(ALL_RULES, false)), false, "a set without 14's rules has none of 15's");
  assert.equal(isMarkFifteenOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkFifteen(withMarkFourteen(ALL_RULES, false), true).has(FIFTEEN_RULE), false);
  for (const mark of [5, 11, 13, 14]) assert.equal(isMarkFifteenOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(getRowRules("case20", {}, 14).has(BEFORE_FIFTEEN_RULE), true, "a row of 14 is rechecked as before15");
  assert.equal(isMarkFifteenOn(getRowRules("case20", {}, 15)), true);
  assert.equal(withMarkFifteen(FIFTEEN, true), FIFTEEN);
  // riskLogic.js reads 15 from the switches alone (the start screen); the two agree.
  assert.equal(marksOnByDefault(15), isMarkFifteenOn());
});

/* ------------------------------------------------------------- G48 */

test("G48: ×64 or more takes a quarter of the 사람 피해 from 15, ×32 to ×63 half; a story season half only", () => {
  assert.equal(SKILL_HARM_QUARTER, 64);
  const effect = { humanCost: 10, capital: 4 };
  assert.deepEqual(halveSkilledHarm(effect, 64, true), { humanCost: 2, capital: 4 });
  assert.deepEqual(halveSkilledHarm(effect, 128, true), { humanCost: 2, capital: 4 });
  assert.deepEqual(halveSkilledHarm(effect, 63, true), { humanCost: 5, capital: 4 });
  assert.deepEqual(halveSkilledHarm(effect, SKILL_HARM_MULTIPLIER - 1, true), effect);
  assert.deepEqual(halveSkilledHarm(effect, 64), { humanCost: 5, capital: 4 }, "without the quarter: G47's half");
  assert.equal(halveSkilledHarm(effect, null, true), effect, "no table");
  assert.equal(quartersSkilledHarm(FIFTEEN), true);
  assert.equal(quartersSkilledHarm(FIFTEEN, true), false, "story mode keeps the half");
  assert.equal(quartersSkilledHarm(BEFORE), false);
  const start = { time: 72, capital: 60, trust: 60, legitimacy: 60, humanCost: 0, fatigue: 0 };
  assert.equal(applySceneEffect(start, { humanCost: 9 }, 64).effect.humanCost, 2);
  assert.equal(applySceneEffect(start, { humanCost: 9 }, 64, undefined, true).effect.humanCost, 4);
  assert.match(tableCopy.hand.quarterHarm, /\{quarter\}/);
});

/* ------------------------------------------------------------- G49 */

test("G49: 사람 피해 weighs 0.35 in the pressure from 15, 0.25 before and in a story season", () => {
  assert.equal(RISK_HARM_WEIGHT, 0.25);
  assert.equal(RISK_HARM_WEIGHT_FIFTEEN, 0.35);
  assert.equal(riskHarmWeightFor(true), 0.35);
  assert.equal(riskHarmWeightFor(true, true), 0.25);
  assert.equal(riskHarmWeightFor(false), 0.25);
  assert.equal(getRiskHarmWeight(), 0.35, "this page plays 15");
  const hurt = { time: 72, capital: 100, humanCost: 40, fatigue: 0 };
  assert.equal(getRiskPressure(hurt), 14);
  assert.equal(withRiskHarmWeight(RISK_HARM_WEIGHT, () => getRiskPressure(hurt)), 10);
  assert.equal(getRiskPressure(hurt), 14, "the weight held only inside");
  assert.equal(getRiskPressureDrivers(hurt).find((driver) => driver.id === "humanCost").pressure, 14);
  // The card the notes named: 돈 +6 and 사람 피해 +5 at 돈 70 no longer reads as lowering the risk.
  const at70 = { time: 72, capital: 70, humanCost: 0, fatigue: 0 };
  const after = { ...at70, capital: 76, humanCost: 5 };
  assert.ok(getRiskPressure(after) >= getRiskPressure(at70));
  holdRiskStory(true);
  try {
    assert.equal(getRiskPressure(hurt), 10, "a story run reads 0.25");
  } finally {
    holdRiskStory(false);
  }
  assert.equal(getRiskPressure(hurt), 14);
});
