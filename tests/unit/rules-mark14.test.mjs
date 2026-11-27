import assert from "node:assert/strict";
import test from "node:test";
import { createWindow, normalizeRunState, resolveWindow, RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import {
  BEFORE_FOURTEEN_RULE, FINALE_WEIGHT_FOURTEEN, FOURTEEN_RULE, FRONT_PAGE_BOOST_FOURTEEN, isMarkFourteenOn, RULES_FOURTEEN_MARK,
  wantsMarkFourteen, withMarkFourteen, withMarkThirteen, withNextRules,
} from "../../src/gauntlet/nextTableRules.js";
import { boostPercent, getRefinedBoost, getRelicBoost, readRelicBoost, RELIC_BOOSTS } from "../../src/gauntlet/relicsNext.js";
import { RELICS } from "../../src/gauntlet/relics.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { FINALE_WEIGHT, getFinaleWeight, weighFinale } from "../../src/seasonStanding.js";

const FOURTEEN = withMarkFourteen(ALL_RULES, true);
const BEFORE = withMarkFourteen(ALL_RULES, false);

test("RULES_MARK 14: on by default, off in a script with RULES_MARK14=0, and a row of 5 to 13 played without it", () => {
  assert.equal(RULES_FOURTEEN_MARK, 14);
  assert.ok(RULES_MARK >= 14, "RULES_MARK 15 keeps 14's rules");
  assert.equal(wantsMarkFourteen({}), true);
  assert.equal(wantsMarkFourteen({ process: { env: { RULES_MARK14: "0" } } }), false);
  assert.equal(isMarkFourteenOn(ALL_RULES), true);
  assert.equal(isMarkFourteenOn(FOURTEEN), true);
  assert.equal(isMarkFourteenOn(BEFORE), false);
  assert.equal(BEFORE.has(BEFORE_FOURTEEN_RULE), true);
  assert.equal(isMarkFourteenOn(withMarkThirteen(ALL_RULES, false)), false, "a set without 13's rules has none of 14's");
  assert.equal(isMarkFourteenOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkFourteen(withMarkThirteen(ALL_RULES, false), true).has(FOURTEEN_RULE), false);
  for (const mark of [5, 9, 11, 12, 13]) assert.equal(isMarkFourteenOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(getRowRules("case20", {}, 13).has(BEFORE_FOURTEEN_RULE), true, "a row of 13 is rechecked as before14");
  assert.equal(isMarkFourteenOn(getRowRules("case20", {}, 14)), true);
  assert.equal(withMarkFourteen(FOURTEEN, true), FOURTEEN);
});

/* ------------------------------------------------------------- G50 */

test("G50: the finale's answer weighs 6 from 14, 5 before", () => {
  assert.equal(FINALE_WEIGHT_FOURTEEN, 6);
  assert.equal(getFinaleWeight(FOURTEEN), 6);
  assert.equal(getFinaleWeight(BEFORE), FINALE_WEIGHT);
  assert.equal(getFinaleWeight(), 6, "this page plays 14");
  assert.deepEqual(weighFinale({ trust: 70, legitimacy: 60 }, "witness"), { trust: 76, legitimacy: 60 });
  assert.deepEqual(weighFinale({ trust: 70, legitimacy: 60 }, "control"), { trust: 70, legitimacy: 66 });
});

/* ------------------------------------------------------------- G51 */

test("G51: FRONT PAGE pays ×1.12 on an OVERCLOCK board from 14, ×1.2 before; the other tools stay", () => {
  assert.equal(FRONT_PAGE_BOOST_FOURTEEN, 1.12);
  assert.equal(RELIC_BOOSTS.frontPage.boost, 1.2, "the rules before keep their number");
  assert.equal(getRelicBoost("frontPage", FOURTEEN), 1.12);
  assert.equal(getRelicBoost("frontPage", BEFORE), 1.2);
  assert.equal(getRelicBoost("heatSink", FOURTEEN), RELIC_BOOSTS.heatSink.boost);
  const cash = { gauge: 40, pushes: 1, move: "keep", streak: 0, afterBust: false, mutations: ["overclock"], clockLeft: 0.2 };
  assert.equal(readRelicBoost(["frontPage"], cash, Infinity, [], FOURTEEN).factor, 1.12);
  assert.equal(readRelicBoost(["frontPage"], cash, Infinity, [], BEFORE).factor, 1.2);
  assert.equal(getRefinedBoost("frontPage", FOURTEEN), 1.18, "refined: half again of the bonus");
  assert.equal(getRefinedBoost("frontPage", BEFORE), 1.3);
  assert.equal(boostPercent("frontPage"), 12);
  assert.match(RELICS.frontPage.text, /\+12%/);
  // On the table: the same OVERCLOCK cash pays ×1.12 under 14 and ×1.2 under 13.
  const card = { id: "a", label: "a", effect: { capital: 8 }, next: "x" };
  const pot = (rules) => resolveWindow({ run: normalizeRunState({ relics: ["frontPage"], schema: { mutations: ["overclock"] } }), window: { ...createWindow({ seed: "g51" }), status: "cashed", gauge: 30, wall: 90, tellOffset: 0, pushes: 2 }, card, rules });
  const now = pot(FOURTEEN);
  const before = pot(BEFORE);
  assert.ok(now.verdict.pot > 0 && before.verdict.pot > 0);
  assert.ok(Math.abs(now.verdict.pot / before.verdict.pot - 1.12 / 1.2) < 0.01, `${now.verdict.pot} against ${before.verdict.pot}`);
});
