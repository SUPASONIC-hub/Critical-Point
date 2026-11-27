import assert from "node:assert/strict";
import test from "node:test";
import { RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import {
  applySoftEffect, BEFORE_THIRTEEN_RULE, BURN_COVER_QUIET, capOpeningCapital, COLLAPSE_HARM_THIRTEEN, halveSkilledHarm, isMarkThirteenOn,
  OPEN_CAPITAL_MOST, readSoft, RULES_THIRTEEN_MARK, SKILL_HARM_MULTIPLIER, softGain, THIRTEEN_RULE, wantsMarkThirteen, withMarkThirteen, withMarkTwelve, withNextRules,
} from "../../src/gauntlet/nextTableRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { describeCaseOpening } from "../../src/state/caseRoutes.js";
import { applyEffect } from "../../src/riskLogic.js";
import { applySceneEffect } from "../../src/sceneEffect.js";
import { ENDING_GATES } from "../../src/gameConstants.js";
import { marksOnByDefault } from "../../src/gauntlet/rulesSwitch.js";
import { getEndingVariant, getDecisionLedger } from "../../src/gameLogic.js";
import { coversBurnedSilence, readPaidEffect, readSoftMeans } from "../../src/seasonStanding.js";
import { readSoftGains } from "../../src/gauntlet/tableReadout.js";
import { PAY_MOST } from "../../src/gauntlet/settlementPay.js";

const THIRTEEN = withMarkThirteen(ALL_RULES, true);
const BEFORE = withMarkThirteen(ALL_RULES, false);

test("RULES_MARK 13: on by default, off in a script with RULES_MARK13=0, and a row of 5 to 12 played without it", () => {
  assert.equal(RULES_THIRTEEN_MARK, 13);
  assert.equal(RULES_MARK, 13);
  assert.equal(wantsMarkThirteen({}), true);
  assert.equal(wantsMarkThirteen({ process: { env: { RULES_MARK13: "0" } } }), false);
  assert.equal(isMarkThirteenOn(ALL_RULES), true);
  assert.equal(isMarkThirteenOn(THIRTEEN), true);
  assert.equal(isMarkThirteenOn(BEFORE), false);
  assert.equal(BEFORE.has(BEFORE_THIRTEEN_RULE), true);
  assert.equal(isMarkThirteenOn(withMarkTwelve(ALL_RULES, false)), false, "a set without 12's rules has none of 13's");
  assert.equal(isMarkThirteenOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkThirteen(withMarkTwelve(ALL_RULES, false), true).has(THIRTEEN_RULE), false);
  for (const mark of [5, 7, 9, 10, 11, 12]) assert.equal(isMarkThirteenOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkThirteenOn(getRowRules("case20", {}, 13)), true);
  assert.equal(withMarkThirteen(THIRTEEN, true), THIRTEEN);
});

/* ------------------------------------------------------------- G44 */

test("G44 운영비: every case opens with 돈 at 70 or less, the season's first too, after the 유지비", () => {
  assert.equal(OPEN_CAPITAL_MOST, 70);
  assert.equal(capOpeningCapital(93), 70);
  assert.equal(capOpeningCapital(55), 55);
  const results = { prologue01: { outcomeChoiceId: "none", rank: "C" } };
  const on = describeCaseOpening("prologue02", { caseResults: results, operatorOrigin: null }, true, true);
  const off = describeCaseOpening("prologue02", { caseResults: results, operatorOrigin: null }, true, false);
  assert.equal(off.resources.capital, 93);
  assert.equal(on.resources.capital, 70);
  assert.deepEqual(on.openingLegacy.upkeep, [["capital", 100, 93]], "the 유지비 row stays");
  assert.deepEqual(on.openingLegacy.operating, ["capital", 93, 70]);
  assert.equal(off.openingLegacy.operating, undefined);
  const first = describeCaseOpening("prologue01", { caseResults: {}, operatorOrigin: null }, true, true);
  assert.ok(first.resources.capital <= 70, "the season's first case opens at 70 too");
});

test("G44 덜 오르기: half over 70, a third over 85, at least 1, cuts in full", () => {
  assert.equal(softGain(60, 8), 68);
  assert.equal(softGain(78, 8), 82, "믿음 78 with a card's +8 rises 4");
  assert.equal(softGain(66, 8), 72, "4 to 70, then half of 4");
  assert.equal(softGain(93, 8), 96);
  assert.equal(softGain(99, 1), 100, "a gain over 0 moves at least 1");
  assert.equal(softGain(100, 5), 100);
  const before = { time: 60, capital: 80, trust: 50, legitimacy: 90, humanCost: 4, fatigue: 20 };
  const after = applySoftEffect(before, { capital: 6, trust: 6, legitimacy: -10, humanCost: 2 }, applyEffect);
  assert.deepEqual(after, { ...before, capital: 83, trust: 56, legitimacy: 80, humanCost: 6 });
  // The ending reads the season's means back through the same curve.
  assert.equal(readSoft(70), 70);
  assert.equal(readSoft(78), 86);
  assert.equal(readSoft(90), 100);
  assert.deepEqual(readSoftMeans({ capital: 78, trust: 60, legitimacy: 85, time: 40 }), { capital: 86, trust: 60, legitimacy: 100, time: 40 });
});

test("G44: the staked card and the ledger say what lands, not the card's own number", () => {
  assert.deepEqual(readSoftGains({ trust: 8, capital: -3, humanCost: 2 }, { trust: 78, capital: 50 }), { trust: 4, capital: -3, humanCost: 2 });
  assert.deepEqual(readSoftGains({ trust: 8 }), { trust: 8 }, "without the resources, the card's numbers");
  const entry = { effect: { trust: 8, humanCost: 2 }, resourcesBefore: { trust: 78 }, resourcesAfter: { trust: 82 } };
  assert.deepEqual(readPaidEffect(entry), { trust: 4, humanCost: 2 });
  assert.equal(getDecisionLedger([entry], { trust: 82 }).strongestRecovery?.[1] ?? 4, 4);
});

/* ------------------------------------------------------------- G47 */

test("G47: a table cashed at ×32 or more takes half its scene's 사람 피해, and collapse is 13 a case", () => {
  assert.equal(SKILL_HARM_MULTIPLIER, 32);
  assert.equal(COLLAPSE_HARM_THIRTEEN, 13);
  assert.equal(ENDING_GATES.collapseHarmPerCase, 13);
  // gameConstants.js reads the switch without nextTableRules.js (first paint): the same answer.
  assert.equal(marksOnByDefault(13), isMarkThirteenOn());
  assert.equal(marksOnByDefault(13, {}), true);
  assert.equal(marksOnByDefault(13, { process: { env: { RULES_MARK13: "0" } } }), false);
  assert.equal(marksOnByDefault(13, { process: { env: { RULES_MARK7: "0" } } }), false, "13 rides on the marks before");
  assert.equal(marksOnByDefault(12, { process: { env: { RULES_MARK13: "0" } } }), true);
  assert.equal(marksOnByDefault(13, { process: { env: { RULES_NEXT: "0" } } }), false);
  assert.equal(marksOnByDefault(13, { process: { env: { RULES_NEXT: "1" } } }), true);
  assert.deepEqual(halveSkilledHarm({ humanCost: 5, trust: 2 }, 32), { humanCost: 2, trust: 2 });
  assert.deepEqual(halveSkilledHarm({ humanCost: 5 }, 31.9), { humanCost: 5 });
  assert.deepEqual(halveSkilledHarm({ humanCost: -3 }, 64), { humanCost: -3 }, "a fall in harm is paid in full");
  assert.deepEqual(halveSkilledHarm({ humanCost: 5 }, null), { humanCost: 5 }, "no table, no half");
  const resources = { time: 60, capital: 60, trust: 60, legitimacy: 60, humanCost: 0, fatigue: 0 };
  const paid = applySceneEffect(resources, { humanCost: 6, capital: 4 }, 40, true);
  assert.deepEqual(paid.effect, { humanCost: 3, capital: 4 });
  assert.equal(paid.resources.humanCost, 3);
  const plain = applySceneEffect(resources, { humanCost: 6, capital: 4 }, 40, false);
  assert.equal(plain.resources.humanCost, 6, "before 13 as it was");
});

/* ------------------------------------------------------------- G45 */

test("G45: a burned season of ten covers closes on QUIET COVER, nine on PROFITABLE SILENCE", () => {
  assert.equal(BURN_COVER_QUIET, PAY_MOST);
  assert.equal(coversBurnedSilence(10), true);
  assert.equal(coversBurnedSilence(9), false);
  const season = (seasonCovers) => ({
    resources: { trust: 40, legitimacy: 50, capital: 95, humanCost: 4, fatigue: 30, time: 40 },
    discoveredClues: [],
    log: [{ choiceId: "f_after_burn" }],
    casesPlayed: 55,
    seasonWindows: 490,
    sustainedPressure: 40,
    seasonReframeRoutes: 0,
    seasonResources: { capital: 90, trust: 40, legitimacy: 50, humanCost: 4, fatigue: 25, time: 50 },
    seasonHumanCost: 55 * 4,
    seasonBusts: 20,
    seasonCovers,
  });
  assert.equal(getEndingVariant(season(9)).id, "profitable-silence");
  assert.equal(getEndingVariant(season(10)).id, "quiet-cover");
});

test("the case file reads 유지비 and 운영비 off the opening legacy, tagged", async () => {
  const { withOpeningCosts } = await import("../../src/viewModels/sceneViewModels.js");
  const spine = { lines: ["x"] };
  assert.equal(withOpeningCosts(spine, null), spine);
  assert.equal(withOpeningCosts(spine, {}), spine);
  assert.deepEqual(withOpeningCosts(spine, { upkeep: [["trust", 100, 93]] }).upkeep, [["trust", 100, 93]]);
  assert.deepEqual(withOpeningCosts(spine, { operating: ["capital", 100, 70] }), { lines: ["x"], upkeep: [["capital", 100, 70, "operating"]] });
  assert.deepEqual(
    withOpeningCosts(spine, { upkeep: [["trust", 100, 93]], operating: ["capital", 90, 70] }).upkeep,
    [["trust", 100, 93], ["capital", 90, 70, "operating"]],
  );
});
