import assert from "node:assert/strict";
import test from "node:test";
import { BEFORE_ELEVEN_RULE, CLUE_CASH_MULTIPLIER, cashOpensClue, ELEVEN_RULE, getUpkeep, isMarkElevenOn, RULES_ELEVEN_MARK, wantsMarkEleven, withMarkEleven, withMarkNine, withMarkTen, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { describeCaseOpening } from "../../src/state/caseRoutes.js";
import { ENDING_THRESHOLDS, getDiscoveryClue } from "../../src/gameLogic.js";
import { getQuietClueRate, getRecordCashBar, weighFinale, weighUpkeep } from "../../src/seasonStanding.js";

const ELEVEN = withMarkEleven(ALL_RULES, true);
const BEFORE = withMarkEleven(ALL_RULES, false);

test("RULES_MARK 11: on by default, off in a script with RULES_MARK11=0, and a row of 5 to 10 played without it", () => {
  assert.equal(RULES_ELEVEN_MARK, 11);
  assert.equal(RULES_MARK, 11);
  assert.equal(wantsMarkEleven({}), true);
  assert.equal(wantsMarkEleven({ process: { env: { RULES_MARK11: "0" } } }), false);
  assert.equal(isMarkElevenOn(ALL_RULES), true);
  assert.equal(isMarkElevenOn(ELEVEN), true);
  assert.equal(isMarkElevenOn(BEFORE), false);
  assert.equal(BEFORE.has(BEFORE_ELEVEN_RULE), true);
  assert.equal(isMarkElevenOn(withMarkNine(ALL_RULES, false)), false, "a set without the marks before has none of 11's");
  assert.equal(isMarkElevenOn(withMarkTen(ALL_RULES, false)), false, "a set without 10's rules has none of 11's");
  assert.equal(isMarkElevenOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkEleven(withMarkNine(ALL_RULES, false), true).has(ELEVEN_RULE), false, "11 does not ride on a set without the marks before");
  for (const mark of [5, 6, 7, 8, 9, 10]) assert.equal(isMarkElevenOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkElevenOn(getRowRules("case20", {}, 11)), true);
  assert.equal(withMarkEleven(ELEVEN, true), ELEVEN, "the same set back when it already plays them");
});

test("G38 유지비: a third of 믿음·공정함·돈 over 80 comes off as a case after the first opens", () => {
  assert.deepEqual(getUpkeep({ trust: 100, legitimacy: 80, capital: 95 }), { trust: -7, capital: -5 });
  assert.deepEqual(getUpkeep({ trust: 80, legitimacy: 50, capital: 81 }), {});
  const results = { prologue01: { outcomeChoiceId: "none", rank: "C" } };
  const on = describeCaseOpening("prologue02", { caseResults: results, operatorOrigin: null }, true);
  const off = describeCaseOpening("prologue02", { caseResults: results, operatorOrigin: null }, false);
  assert.equal(off.resources.capital, 100);
  assert.equal(on.resources.capital, 93);
  assert.deepEqual(on.openingLegacy.upkeep, [["capital", 100, 93]]);
  assert.equal(off.openingLegacy.upkeep, undefined);
  const first = describeCaseOpening("prologue01", { caseResults: {}, operatorOrigin: null }, true);
  assert.equal(first.openingLegacy, null, "the season's first case pays none");
});

test("G39: a scene's record opens only on a table cashed at ×32 or more, and HUMAN RECORD asks 0.85 of them", () => {
  assert.equal(CLUE_CASH_MULTIPLIER, 32);
  assert.equal(cashOpensClue(31.9), false);
  assert.equal(cashOpensClue(32), true);
  const ask = (cashMultiplier) => getDiscoveryClue({ currentCase: "case05", challengeMatch: true, riskDelta: 2, logLength: 1, cashMultiplier });
  assert.equal(ask(16), null);
  assert.ok(ask(32));
  assert.ok(ask(null), "a preview that reads no table finds the record as before");
  assert.equal(ENDING_THRESHOLDS.recordClueRate, 0.85);
  assert.equal(getRecordCashBar(), 32);
  assert.equal(getQuietClueRate(0.5), 0.2, "QUIET COVER's record door moves with them");
});

test("G38 유지비 on the ending: the season's means read a third less over 80, before the answer's weight, and three gates moved with them", () => {
  assert.deepEqual(weighUpkeep({ trust: 100, legitimacy: 80, capital: 97, time: 90 }), { trust: 93, legitimacy: 80, capital: 91, time: 90 });
  assert.deepEqual(weighFinale({ trust: 100, legitimacy: 70, capital: 50 }, "witness"), { trust: 98, legitimacy: 70, capital: 50 });
  assert.deepEqual(weighFinale({ trust: 100, legitimacy: 70, capital: 50 }, "burn"), { trust: 93, legitimacy: 70, capital: 50 });
  assert.equal(ENDING_THRESHOLDS.silenceCapital, 91);
  assert.equal(ENDING_THRESHOLDS.coldLegitimacy, 85);
  assert.equal(ENDING_THRESHOLDS.storyColdGap, 9);
  assert.equal(ENDING_THRESHOLDS.oversightLegitimacy, 82, "the gates not moved stay where they were");
});
