import assert from "node:assert/strict";
import test from "node:test";
import { createWindow, MUTATIONS, normalizeRunState, resolveWindow, RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import { BEFORE_TEN_RULE, getHotCashMultiplier, HOT_CASH_TEN, isMarkTenOn, RULES_TEN_MARK, TEN_RULE, wantsMarkTen, withMarkNine, withMarkTen, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { HOT_CASH_MULTIPLIER, OVERCLOCK_STREAK } from "../../src/gauntlet/tableRules.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES, getUnlockIntro } from "../../src/gauntlet/tableUnlocks.js";
import { getEndingVariant } from "../../src/gameLogic.js";
import { nearestEnding } from "../../src/nearestEnding.js";
import { COVER_QUIET, coversBeforeSilence, FINALE_WEIGHT, weighFinale, weighUpkeep } from "../../src/seasonStanding.js";
import unlocks from "../../src/copy/unlocks.js";

const TEN = withMarkTen(ALL_RULES, true);
const NINE = withMarkTen(ALL_RULES, false);

test("RULES_MARK 10: the engine's mark, on by default, and a row of 5 to 9 played without it", () => {
  assert.ok(RULES_MARK >= 10, "RULES_MARK 11 keeps 10's rules");
  assert.equal(RULES_TEN_MARK, 10);
  assert.equal(wantsMarkTen({}), true);
  assert.equal(wantsMarkTen({ process: { env: { RULES_MARK10: "0" } } }), false);
  assert.equal(isMarkTenOn(ALL_RULES), true);
  assert.equal(isMarkTenOn(TEN), true);
  assert.equal(isMarkTenOn(NINE), false);
  assert.equal(NINE.has(BEFORE_TEN_RULE), true);
  assert.equal(isMarkTenOn(withMarkNine(ALL_RULES, false)), false, "a set without 9's rules has none of 10's");
  assert.equal(isMarkTenOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkTen(withMarkNine(ALL_RULES, false), true).has(TEN_RULE), false, "10 does not ride on a set without 9");
  for (const mark of [5, 6, 7, 8, 9]) assert.equal(isMarkTenOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkTenOn(getRowRules("case20", {}, 10)), true);
  assert.equal(withMarkTen(TEN, true), TEN, "the same set back when it already plays them");
});

/* ------------------------------------------------------------- G42 */

test("G42: the OVERCLOCK chain asks for ×32 under 10 and ×4 under 9; two in a row still overclock", () => {
  assert.equal(HOT_CASH_TEN, 32);
  assert.equal(HOT_CASH_MULTIPLIER, 4);
  assert.equal(OVERCLOCK_STREAK, 2);
  assert.equal(getHotCashMultiplier(TEN), 32);
  assert.equal(getHotCashMultiplier(NINE), 4);
  assert.equal(getHotCashMultiplier(getRowRules("case20", {}, 9)), 4, "a row of 9 is rechecked on ×4");
  const card = { id: "a", label: "a", effect: { capital: 8, trust: 4 }, next: "x" };
  // Heat 40 pays about ×12: hot under 9, not under 10. Heat 60 pays about ×44: hot under both.
  const cash = (gauge, rules, streak = 1) => resolveWindow({ run: normalizeRunState({ streak }), window: { ...createWindow({ seed: "g42" }), status: "cashed", gauge, wall: 90, pushes: 3 }, card, rules });
  const warm = (rules) => cash(40, rules);
  assert.ok(warm(NINE).verdict.multiplier >= 4 && warm(NINE).verdict.multiplier < 32, `heat 40 pays ×${warm(NINE).verdict.multiplier}`);
  assert.equal(warm(NINE).nextRun.streak, 2);
  assert.ok(warm(NINE).nextRun.schema.mutations.includes("overclock"));
  assert.equal(warm(TEN).nextRun.streak, 0, "under 10 a ×12 cash breaks the chain");
  assert.ok(!warm(TEN).nextRun.schema.mutations.includes("overclock"));
  const hot = cash(60, TEN);
  assert.ok(hot.verdict.multiplier >= 32, `heat 60 pays ×${hot.verdict.multiplier}`);
  assert.equal(hot.nextRun.streak, 2);
  assert.ok(hot.nextRun.schema.mutations.includes("overclock"));
  assert.equal(cash(60, TEN, 0).nextRun.streak, 1, "one hot cash only lights the chain");
  assert.ok(!cash(60, TEN, 0).nextRun.schema.mutations.includes("overclock"));
  // The table's words name the page's number.
  assert.match(MUTATIONS.overclock.text, new RegExp(`×${HOT_CASH_TEN} 이상`));
  assert.deepEqual(getUnlockIntro("case01"), unlocks.steps.case01.introTen);
  assert.match(unlocks.steps.case01.introTen[0], new RegExp(`^×${HOT_CASH_TEN} 이상`));
  assert.match(unlocks.steps.case01.intro[0], new RegExp(`^×${HOT_CASH_MULTIPLIER} 이상`));
});

/* ------------------------------------------------------- G40 · G41 */

/** A standing season, read as the ruling reads it: 55 cases, the records open, the finale's answer last in the log. */
const season = (finale, seasonResources, extra = {}) => ({
  resources: { trust: 60, legitimacy: 60, capital: 60, humanCost: 2, fatigue: 30, time: 40 },
  discoveredClues: Array.from({ length: 55 }, (_, index) => ({ id: `c${index}` })),
  log: [{ choiceId: `f_after_${finale}` }],
  casesPlayed: 55,
  seasonWindows: 490,
  sustainedPressure: 40,
  seasonReframeRoutes: 4,
  seasonResources: { capital: 70, humanCost: 2, fatigue: 25, time: 50, ...seasonResources },
  seasonHumanCost: 55 * 2,
  seasonBusts: 20,
  ...extra,
});

test("G40: 증언 weighs FINALE_WEIGHT on the season's 믿음, 개혁 on its 공정함, 소각 on neither", () => {
  assert.equal(FINALE_WEIGHT, 5);
  const mean = { trust: 70, legitimacy: 97 };
  // G38 (RULES_MARK 11): the mean is read after 유지비 (97 reads as 91), the answer's weight on top.
  const kept = weighUpkeep(mean);
  assert.deepEqual(weighFinale(mean, "witness"), { trust: 75, legitimacy: kept.legitimacy });
  assert.deepEqual(weighFinale(mean, "control"), { trust: 70, legitimacy: Math.min(100, kept.legitimacy + 5) }, "never past 100");
  assert.deepEqual(weighFinale(mean, "burn"), kept);
  assert.deepEqual(weighFinale(mean, null), kept);
  assert.equal(weighFinale(null, "witness"), null, "a caller without the season's mean is read as it was");
  // 공정함 84 and 믿음 80: OPEN OVERSIGHT on 증언; 개혁 lifts 공정함 past REFORM's 86.
  const standing = { trust: 80, legitimacy: 84 };
  assert.equal(getEndingVariant(season("witness", standing)).id, "open-oversight");
  assert.equal(getEndingVariant(season("control", standing)).id, "evidence-reform", "the reform answer carries the reform ending");
  // 믿음 71: under HUMAN RECORD's 75 until 증언 puts it there.
  const record = { trust: 71, legitimacy: 70 };
  const reframed = { seasonReframeRoutes: 44 };
  assert.equal(getEndingVariant(season("witness", record, reframed)).id, "human-record");
  assert.notEqual(getEndingVariant(season("control", record, reframed)).id, "human-record");
  // The finale's line reads the same mean: 증언 at 믿음 71 lacks nothing of HUMAN RECORD's 믿음.
  const near = nearestEnding({ ...season("witness", { trust: 66, legitimacy: 70 }, reframed), endingId: "quiet-cover" });
  assert.equal(near.id, "human-record");
  assert.deepEqual(near.gaps, [{ key: "trust", value: 4 }]);
});

test("G41: COVER_QUIET covers and no burn close on QUIET COVER before PROFITABLE SILENCE", () => {
  assert.equal(COVER_QUIET, 6);
  assert.equal(coversBeforeSilence(COVER_QUIET), true);
  assert.equal(coversBeforeSilence(COVER_QUIET - 1), false);
  const rich = { trust: 40, legitimacy: 60, capital: 99 };
  for (const finale of ["witness", "control"]) {
    assert.equal(getEndingVariant(season(finale, rich, { seasonCovers: COVER_QUIET - 1, discoveredClues: [] })).id, "profitable-silence", `${finale}, 5 covers`);
    assert.equal(getEndingVariant(season(finale, rich, { seasonCovers: COVER_QUIET, discoveredClues: [] })).id, "quiet-cover", `${finale}, 6 covers`);
  }
  assert.equal(getEndingVariant(season("burn", rich, { seasonCovers: COVER_QUIET + 3 })).id, "profitable-silence", "a burned season bought its silence");
});
