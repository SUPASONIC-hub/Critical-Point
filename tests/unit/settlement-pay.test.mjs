import assert from "node:assert/strict";
import test from "node:test";
import { getEndingVariant, getSeasonStrain } from "../../src/gameLogic.js";
import { normalizeRunState, openCaseRun, payCaseHarm } from "../../src/gauntlet/gauntletEngine.js";
import { withMarkNine } from "../../src/gauntlet/nextTableRules.js";
import { countCovers, coverCase, normalizePaid, PAY_BASE, PAY_HARM_MOST, PAY_LADDER, PAY_MOST, PAY_RISE, payPriceAt, readPayOffer } from "../../src/gauntlet/settlementPay.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { caseHarm, COVER_LEGITIMACY, COVER_QUIET, COVER_SILENCE_TRUST, readCollapseTally } from "../../src/seasonStanding.js";
import { recheckCaseGap } from "../../src/chainRecheck.js";

// G34 보상금 (RULES_MARK 9).
test("the ladder: PAY_BASE rising PAY_RISE a cover, PAY_MOST of them, to the hundred", () => {
  assert.equal(PAY_LADDER.length, PAY_MOST);
  assert.equal(PAY_LADDER[0], PAY_BASE);
  PAY_LADDER.forEach((cost, n) => assert.equal(cost, Math.round((PAY_BASE * PAY_RISE ** n) / 100) * 100));
  assert.equal(payPriceAt(0), PAY_BASE);
  assert.equal(payPriceAt(PAY_MOST), null);
});

test("the offer: a closed case with harm, not paid, not the finale, story or a replay, under 9", () => {
  const caseResults = { case03: { finalHumanCost: 33.4 }, case04: { finalHumanCost: 0 } };
  assert.deepEqual(readPayOffer({ caseId: "case03", caseResults, vault: 20_000 }), { caseId: "case03", harm: 33, cost: PAY_BASE, covers: 0, afford: true });
  assert.equal(readPayOffer({ caseId: "case03", caseResults, vault: 100 }).afford, false);
  assert.equal(readPayOffer({ caseId: "case04", caseResults, vault: 20_000 }), null, "no harm");
  assert.equal(readPayOffer({ caseId: "case03", caseResults, vault: 20_000, story: true }), null);
  assert.equal(readPayOffer({ caseId: "case03", caseResults, vault: 20_000, practice: true }), null);
  assert.equal(readPayOffer({ caseId: "case03", caseResults, vault: 20_000, rules: withMarkNine(ALL_RULES, false) }), null);
  assert.equal(readPayOffer({ caseId: "final", caseResults: { final: { finalHumanCost: 9 } }, vault: 20_000 }), null);
  const paid = { ...caseResults, case03: coverCase(caseResults.case03, { cost: PAY_BASE, harm: 33 }) };
  assert.equal(readPayOffer({ caseId: "case03", caseResults: paid, vault: 20_000 }), null, "paid once");
  assert.equal(countCovers(paid), 1);
  assert.equal(readPayOffer({ caseId: "case05", caseResults: { ...paid, case05: { finalHumanCost: 4 } }, vault: 20_000 }).cost, PAY_LADDER[1], "the next cover costs more");
});

test("the vault pays it, and the next case's open snapshot carries it once", () => {
  const offer = readPayOffer({ caseId: "case03", caseResults: { case03: { finalHumanCost: 20 } }, vault: 50_000 });
  const run = payCaseHarm(normalizeRunState({ vault: 50_000, handVault: 49_000 }), offer);
  assert.equal(run.vault, 50_000 - PAY_BASE);
  assert.equal(run.handVault, 50_000 - PAY_BASE);
  assert.deepEqual(run.paid, { caseId: "case03", cost: PAY_BASE, harm: 20 });
  assert.equal(payCaseHarm(normalizeRunState({ vault: 100 }), offer).vault, 100, "a vault that cannot pay is left");
  const next = openCaseRun(run, { caseId: "case04" });
  assert.deepEqual(next.open.paid, run.paid);
  assert.equal(next.paid, undefined);
  assert.equal(openCaseRun(next, { caseId: "case05" }).open.paid, undefined);
  assert.equal(normalizePaid({ caseId: "case03", cost: PAY_BASE + 1, harm: 3 }), null);
  assert.equal(normalizePaid({ caseId: "case03", cost: PAY_BASE, harm: PAY_HARM_MOST + 1 }), null);
});

test("the season: the harm paid is off the tally, each cover takes 공정함 and leans to silence", () => {
  const summary = (harm, extra = {}) => ({ finalHumanCost: harm, finalResources: { trust: 30, legitimacy: 60, capital: 98, humanCost: harm }, ...extra });
  const open = { case01: summary(30), case02: summary(30) };
  const paid = { case01: coverCase(summary(30), { cost: PAY_BASE, harm: 30 }), case02: summary(30) };
  assert.equal(caseHarm(paid.case01), 0);
  assert.equal(readCollapseTally(Object.values(paid)).seasonHumanCost, 30);
  assert.equal(readCollapseTally(Object.values(paid)).seasonCovers, 1);
  assert.equal(getSeasonStrain(paid).seasonResources.legitimacy, getSeasonStrain(open).seasonResources.legitimacy - COVER_LEGITIMACY);
  // PROFITABLE SILENCE's trust bar rises a cover (a season at trust 46 is over it with none).
  const season = (covers) => getEndingVariant({ resources: {}, discoveredClues: [], log: [], casesPlayed: 10, seasonWindows: 100, sustainedPressure: 20, seasonResources: { trust: 46, legitimacy: 60, capital: 98 }, seasonCovers: covers });
  assert.notEqual(season(0).id, "profitable-silence");
  assert.equal(season(1).id, "profitable-silence");
  assert.ok(46 < 45 + COVER_SILENCE_TRUST);
  // QUIET COVER from COVER_QUIET covers on, where the season would have fallen through.
  const fall = (covers) => getEndingVariant({ resources: {}, discoveredClues: Array.from({ length: 10 }, (_, i) => `c${i}`), log: [], casesPlayed: 10, seasonWindows: 100, sustainedPressure: 20, seasonResources: { trust: 70, legitimacy: 70, capital: 60 }, seasonCovers: covers });
  assert.equal(fall(0).id, "open-question");
  assert.equal(fall(COVER_QUIET).id, "quiet-cover");
});

test("the chain recheck opens the next case on the vault less what was paid, for the case before only", () => {
  const close = { case_id: "case03", decision_log: [{}], summary: {}, dynamics: { vault: 50_000, handVault: 40_000, windowIndex: 30, practiceWindows: 0, relics: [], relicOffer: [], busts: 0, cashes: 0, stanceMastery: { strike: 0, steady: 0, expose: 0 }, linksOut: [], mutations: [] } };
  const open = (paid, vault) => ({ case_id: "case04", decision_log: [{}], summary: {}, dynamics: { vault, windowIndex: 30, open: { caseId: "case04", vault, handVault: Math.min(40_000, vault), windowIndex: 30, practiceWindows: 0, relics: [], stanceMastery: { strike: 0, steady: 0, expose: 0 }, linksIn: [], ...(paid ? { paid } : {}) } } });
  const fields = ([before, after]) => recheckCaseGap(before, after).breaks.map((entry) => entry.field);
  const pay = { caseId: "case03", cost: PAY_BASE, harm: 12 };
  assert.ok(!fields([close, open(pay, 50_000 - PAY_BASE)]).some((field) => /vault|paid/i.test(field)));
  assert.ok(fields([close, open(null, 50_000 - PAY_BASE)]).includes("open.vault"), "an unpaid gap breaks");
  assert.ok(fields([close, open({ ...pay, caseId: "case01" }, 50_000 - PAY_BASE)]).includes("open.paid"));
});
