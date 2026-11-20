// G4 (tools) and G5 (act twists) under the next rules (src/gauntlet/nextTableRules.js).
process.env.RULES_NEXT = "1";
const assert = (await import("node:assert/strict")).default;
const { test } = await import("node:test");
const engine = await import("../../src/gauntlet/gauntletEngine.js");
const { RELICS, RELIC_IDS } = await import("../../src/gauntlet/relics.js");
const { NEXT_REROLL_COST, readRelicBoost, RELIC_BOOSTS, LOW_CASH_HEAT, HOT_CASH_HEAT } = await import("../../src/gauntlet/relicsNext.js");
const { readDraftSpend } = await import("../../src/gauntlet/draftSpend.js");
const { caseRuleFor } = await import("../../src/gauntlet/caseRules.js");
const { ACT_TWIST_CASES, HEARING_CHIPS, MERGER_SHIFT, SCATTER_SPREAD } = await import("../../src/gauntlet/actTwists.js");
const { getCaseRule } = await import("../../src/gauntlet/weeklyRules.js");
const { rulesNextOn, RULES_NEXT_DEFAULT } = await import("../../src/gauntlet/rulesNext.js");
const { isNextOn, NEXT_RULE, RULES_NEXT_MARK, withNextRules } = await import("../../src/gauntlet/nextTableRules.js");
const { recheckRelicDraft, recheckRun } = await import("../../src/rankingRecheck.js");
const en = (await import("../../src/locales/en/screens/relics.js")).default;
const ja = (await import("../../src/locales/ja/screens/relics.js")).default;
const enWeek = (await import("../../src/locales/en/screens/weekRules.js")).default;
const jaWeek = (await import("../../src/locales/ja/screens/weekRules.js")).default;
const koWeek = (await import("../../src/copy/weekRules.js")).default;

const cash = (over = {}) => ({ gauge: 60, pushes: 3, move: "grow", streak: 1, afterBust: false, mutations: [], clockLeft: 0.2, focusMode: "steady", focusCharged: false, ...over });

test("the switch: a case's rules say it, \"old\" turns it off, and a set with neither follows the default", () => {
  assert.equal(rulesNextOn({ location: { search: "?rules=next" } }), true);
  assert.equal(rulesNextOn({ location: { search: "" } }), RULES_NEXT_DEFAULT);
  assert.equal(isNextOn(), true);
  assert.equal(isNextOn(new Set()), true);
  assert.equal(isNextOn(new Set([NEXT_RULE])), true);
  assert.equal(isNextOn(new Set(["old"])), false);
  // The old table by the case's rules: no boost, the old COLD BLOOD, the old price.
  const old = new Set(["old", "blackout", "aftershock"]);
  const board = engine.buildNextSchema({ outcome: "bust", cause: "push", gauge: 80, relics: ["coldBlood"], rules: old });
  assert.ok(board.startGauge > 0);
  assert.equal(engine.getRerollCost(old), 4000);
  assert.equal(engine.getRerollCost(withNextRules(new Set(), true)), NEXT_REROLL_COST);
});

test("every boost names a condition that a normal cash can meet, and none fires on a plain cash", () => {
  assert.deepEqual(readRelicBoost(RELIC_IDS, cash()), { fired: [], factor: 1 });
  assert.deepEqual(readRelicBoost(["auditContact"], cash({ gauge: LOW_CASH_HEAT - 1 })).fired, ["auditContact"]);
  assert.deepEqual(readRelicBoost(["auditContact"], cash({ gauge: LOW_CASH_HEAT - 1, pushes: 0 })).fired, []);
  assert.deepEqual(readRelicBoost(["heatSink"], cash({ gauge: HOT_CASH_HEAT })).fired, ["heatSink"]);
  assert.deepEqual(readRelicBoost(["coldBlood"], cash({ afterBust: true })).fired, ["coldBlood"]);
  assert.deepEqual(readRelicBoost(["metronome"], cash({ move: "switch" })).fired, ["metronome"]);
  assert.deepEqual(readRelicBoost(["fieldNote"], cash({ streak: 5 })).fired, ["fieldNote"]);
  assert.deepEqual(readRelicBoost(["fieldNote", "encore"], cash({ streak: 8 })).fired, ["fieldNote", "encore"]);
  assert.deepEqual(readRelicBoost(["carbonCopy", "stethoscope", "frontPage"], cash({ mutations: ["blackout", "silence", "overclock"] })).fired, ["carbonCopy", "stethoscope", "frontPage"]);
  assert.deepEqual(readRelicBoost(["testimony"], cash({ clockLeft: 0.6 })).fired, ["testimony"]);
  assert.deepEqual(readRelicBoost(["kineticGrip"], cash({ focusMode: "strike", focusCharged: true })).fired, ["kineticGrip"]);
  const both = readRelicBoost(["heatSink", "carbonCopy"], cash({ gauge: 80, mutations: ["blackout"] }));
  assert.equal(both.factor, RELIC_BOOSTS.heatSink.boost * RELIC_BOOSTS.carbonCopy.boost);
});

test("a boosted cash pays its pot times the boost and says so in the reveal", () => {
  const card = { id: "c", effect: { capital: 8 } };
  const run = engine.normalizeRunState({ relics: ["heatSink"] });
  const window = { status: "cashed", gauge: 75, pushes: 4, elapsed: 20, seed: "s", schema: run.schema };
  const { verdict } = engine.resolveWindow({ run, window, card });
  const bare = engine.resolveWindow({ run: engine.normalizeRunState({}), window, card }).verdict;
  assert.ok(verdict.pot > bare.pot);
  assert.ok(Math.abs(verdict.pot - bare.pot * RELIC_BOOSTS.heatSink.boost) <= 1);
  assert.ok(verdict.relicProcs.includes("heatSink"));
});

test("COLD BLOOD waives AFTERSHOCK on the board after a bust", () => {
  const board = engine.buildNextSchema({ outcome: "bust", cause: "push", gauge: 80, relics: ["coldBlood"] });
  assert.ok(board.mutations.includes("aftershock"));
  assert.equal(board.startGauge, engine.BASE_SCHEMA.startGauge);
});

test("every tool card says its condition in ko, en and ja", () => {
  for (const id of Object.keys(RELIC_BOOSTS)) {
    assert.match(RELICS[id].text, /\+\d+%/, id);
    const words = (table) => table.relics[id].next ?? table.relics[id].nextText;
    assert.ok(words(en) && words(ja), id);
  }
  assert.ok(en.draft.off.season && ja.draft.off.season && en.draft.spendHintNext && ja.draft.spendHintNext);
});

function draftRun(over = {}) {
  return engine.normalizeRunState({ vault: 50000, ...engine.openRelicDraft("seed-1", RELIC_IDS, []), ...over });
}

test("the reroll costs 1,500, and one more is once a season", () => {
  const rerolled = engine.rerollRelicOffer(draftRun());
  assert.equal(rerolled.vault, 50000 - NEXT_REROLL_COST);
  assert.equal(engine.getRelicDraftCost(rerolled.relicDraft), NEXT_REROLL_COST);
  assert.equal(readDraftSpend(draftRun()).reroll.cost, NEXT_REROLL_COST);
  const bought = engine.buyExtraRelic(draftRun());
  assert.equal(bought.extraBought, true);
  // The next draft of the same season: the button is off and the engine refuses.
  const later = draftRun({ extraBought: true });
  assert.equal(readDraftSpend(later).extra.open, false);
  assert.equal(readDraftSpend(later).extra.reason, "season");
  assert.deepEqual(engine.buyExtraRelic(later), engine.normalizeRunState(later));
  // A run that never bought one keeps no mark on its record.
  assert.equal("extraBought" in draftRun(), false);
});

test("the server check prices a 1,500 reroll and marks a second one more in a season", () => {
  const draft = engine.rerollRelicOffer(draftRun()).relicDraft;
  const row = { case_id: "case01", decision_log: [{ relicDraft: { ...draft, picked: [] } }], dynamics: { [engine.RULES_MARK_KEY]: RULES_NEXT_MARK } };
  assert.deepEqual(recheckRelicDraft(row).findings, []);
  const pricedOld = { ...row, decision_log: [{ relicDraft: { ...draft, cost: 4000, picked: [] } }] };
  assert.equal(recheckRelicDraft(pricedOld).findings[0].differs.includes("cost"), true);
  // A row from before RULES_MARK RULES_NEXT_MARK was priced at the old reroll.
  const marked = (mark, cost) => ({ ...row, decision_log: [{ relicDraft: { ...draft, cost, picked: [] } }], dynamics: { [engine.RULES_MARK_KEY]: mark } });
  assert.deepEqual(recheckRelicDraft(marked(RULES_NEXT_MARK, NEXT_REROLL_COST)).findings, []);
  assert.deepEqual(recheckRelicDraft(marked(RULES_NEXT_MARK - 1, 4000)).findings, []);
  if (engine.RULES_MARK >= RULES_NEXT_MARK) {
    const extra = (caseId) => ({ case_id: caseId, decision_log: [{ relicDraft: { extra: true } }], dynamics: { [engine.RULES_MARK_KEY]: engine.RULES_MARK }, summary: {} });
    assert.ok(recheckRun([extra("case01"), extra("case02")]).marks.includes("relic-draft"));
  }
});

test("acts 3, 5 and 7 each deal their twist, behind a case's own rule and never beside a week's", () => {
  assert.equal(caseRuleFor("case13", {}), "merger");
  assert.equal(caseRuleFor("case14", {}), "heavy-fracture", "N26's rule stands in front");
  assert.equal(caseRuleFor("case27", {}), "scattered");
  assert.equal(caseRuleFor("case41", {}), "hearing");
  assert.equal(caseRuleFor("case41", { weekRule: "short-clock" }), null);
  assert.equal(caseRuleFor("case41", { story: true }), null);
  assert.equal(caseRuleFor("case41", {}, true, false), null, "the old table");
  assert.equal(caseRuleFor("case12", {}), null);
  assert.equal(Object.keys(ACT_TWIST_CASES).length, 18);
  const plain = engine.getTableSchema({});
  const merger = engine.getTableSchema({ open: { caseId: "case15" } });
  assert.equal(merger.wallMin, plain.wallMin - MERGER_SHIFT);
  const scattered = engine.getTableSchema({ open: { caseId: "case26" } });
  assert.equal(scattered.wallMin, plain.wallMin - SCATTER_SPREAD);
  assert.equal(scattered.wallMax, Math.min(98, plain.wallMax + SCATTER_SPREAD));
  const hearing = engine.getTableSchema({ open: { caseId: "case38" } });
  assert.equal(hearing.seconds, Math.max(12, Math.round(plain.seconds * 0.7)));
  assert.equal(hearing.chipsScale, plain.chipsScale * HEARING_CHIPS);
});

test("each twist's panel line is in ko, en and ja, with its line in the story", () => {
  for (const id of ["merger", "scattered", "hearing"]) {
    for (const table of [koWeek, enWeek, jaWeek]) {
      const words = table.actTwists[id];
      assert.ok(words.title && words.text && words.world, id);
      assert.doesNotMatch(words.text, /undefined/);
    }
  }
  const rule = getCaseRule("case40", "hearing");
  assert.ok(rule.world && /30% 짧고/.test(rule.text) && !/\{/.test(rule.text));
});
