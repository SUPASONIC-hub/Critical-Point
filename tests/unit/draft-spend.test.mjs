import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { buyExtraRelic, equipRelic, normalizeRunState, openRelicDraft, rerollRelicOffer } from "../../src/gauntlet/gauntletEngine.js";
import { readDraftSpend } from "../../src/gauntlet/draftSpend.js";
import { DEFAULT_RELIC_POOL, RELIC_EXTRA_COST, RELIC_REROLL_COST } from "../../src/gauntlet/relics.js";

/**
 * C9 PR 2, the draft's two buys on screen (RelicDraft.jsx, draftSpend.js): a
 * button is open exactly when the engine would pay, and off with the reason
 * that holds; the stage tells a swap from the second pick a bought one more
 * leaves; R and B are the draft's keys; the words are in all three languages.
 */
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const atDraft = (extra = {}) => normalizeRunState({ vault: 30000, relics: [], ...openRelicDraft("seed:draft", DEFAULT_RELIC_POOL, []), schema: { mutations: ["reboot"] }, ...extra });
const pays = (run, kind) => (kind === "reroll" ? rerollRelicOffer(run) : buyExtraRelic(run)).vault !== run.vault;

test("each button is open exactly when the engine pays, and says why when it does not", () => {
  const cases = {
    open: atDraft(),
    practice: atDraft({ practice: { vault: 0, relics: [], relicOffer: [] } }),
    story: atDraft({ story: true }),
    record: atDraft({ relicDraft: null }),
    short: atDraft({ vault: RELIC_REROLL_COST - 1 }),
    extraShort: atDraft({ vault: RELIC_EXTRA_COST - 1 }),
    rerolled: rerollRelicOffer(atDraft()),
    bought: buyExtraRelic(atDraft()),
    few: atDraft({ ...openRelicDraft("seed:draft", ["insurance"], []) }),
  };
  for (const [name, run] of Object.entries(cases)) {
    const spend = readDraftSpend(run);
    for (const kind of ["reroll", "extra"]) assert.equal(spend[kind].open, pays(run, kind), `${name} ${kind}: ${spend[kind].reason}`);
  }
  assert.deepEqual([readDraftSpend(cases.open).reroll, readDraftSpend(cases.open).extra], [{ cost: RELIC_REROLL_COST, open: true, reason: null }, { cost: RELIC_EXTRA_COST, open: true, reason: null }]);
  assert.equal(readDraftSpend(cases.practice).reroll.reason, "practice");
  assert.equal(readDraftSpend(cases.story).extra.reason, "story");
  assert.equal(readDraftSpend(cases.record).reroll.reason, "record");
  assert.equal(readDraftSpend(cases.short).reroll.reason, "short");
  assert.deepEqual([readDraftSpend(cases.extraShort).reroll.open, readDraftSpend(cases.extraShort).extra.reason], [true, "short"]);
  assert.equal(readDraftSpend(cases.rerolled).reroll.reason, "used");
  assert.equal(readDraftSpend(cases.bought).extra.reason, "used");
  assert.equal(readDraftSpend(cases.few).extra.reason, "few");
  // After the first pick of a bought one more: the second pick, and nothing left to buy.
  const one = equipRelic(cases.bought, cases.bought.relicOffer[0]);
  const second = readDraftSpend(one);
  assert.equal(second.second, true);
  assert.deepEqual([second.reroll.reason, second.extra.reason], ["picked", "used"]);
  assert.equal(readDraftSpend(equipRelic(one, one.relicOffer[0])).second, false);
  assert.equal(readDraftSpend(null).reroll.reason, "record");
});

test("the stage tells a swap from a bought one more's second pick, and pays through the runtime", () => {
  const stage = read("src/gauntlet/GauntletStage.jsx");
  assert.match(stage, /if \(!next\.relics\.includes\(relicId\)\) \{\s*setSwapFor\(relicId\);/);
  assert.doesNotMatch(stage, /if \(next\.relicOffer\.length\) \{\s*setSwapFor/, "an offer left on the table is not a swap any more");
  assert.match(stage, /const draftSpend = readDraftSpend\(run\);/);
  assert.match(stage, /if \(!draftOpen \|\| swapFor \|\| !onSpendAtDraft \|\| !draftSpend\[kind\]\?\.open\) return;/);
  const runtime = read("src/GameRuntime.jsx");
  assert.match(runtime, /function spendAtDraft\(kind\) \{\s*if \(staleSave\) return;/);
  assert.match(runtime, /pickRelic, spendAtDraft,/);
  assert.match(read("src/screens/PlayScreen.jsx"), /onSpendAtDraft=\{spendAtDraft\}/);
  const keys = read("src/gauntlet/useTableKeys.js");
  assert.match(keys, /if \(letter === "r" && current\.rerollRelic\) return take\(\(\) => current\.rerollRelic\(\)\);/);
  assert.match(keys, /if \(letter === "b" && current\.buyRelic\) return take\(\(\) => current\.buyRelic\(\)\);/);
});

test("a buy that cannot pay keeps its place, is aria-disabled and says why", () => {
  const draft = read("src/gauntlet/RelicDraft.jsx");
  const buy = draft.slice(draft.indexOf("function DraftBuy"));
  assert.match(buy, /aria-disabled=\{state\.open \? undefined : "true"\}/);
  assert.match(buy, /aria-describedby=\{why \? `gx-draft-\$\{id\}-why` : undefined\}/);
  assert.match(buy, /onClick=\{state\.open \? onPress : undefined\}/);
  assert.doesNotMatch(buy, /\sdisabled=/, "not `disabled`: it stays reachable and read");
  assert.match(draft, /\{spend && !swapFor && !spend\.second && \(/);
  assert.match(draft, /<small className="gx-draft-note">\{say\.spendNote\}<\/small>/);
  const css = read("src/styles/app/relics.css");
  assert.match(css, /\.gauntlet-stage \.gx-draft-buy \{\s*min-height: 44px;/);
  assert.match(css, /\.gx-draft-spend \{\s*display: grid;\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
});

test("the draft's buys are worded in all three languages, with the price as a blank", async () => {
  const ko = (await import("../../src/copy/relics.js")).default.draft;
  const en = (await import("../../src/locales/en/screens/relics.js")).default.draft;
  const ja = (await import("../../src/locales/ja/screens/relics.js")).default.draft;
  const reasons = ["practice", "story", "record", "used", "picked", "few", "short"];
  for (const [lang, words] of Object.entries({ ko, en, ja })) {
    for (const key of ["reroll", "extra"]) assert.match(words[key], /\{cost\}/, `${lang} ${key}`);
    for (const key of ["spendNote", "secondTitle", "secondLede"]) assert.ok(words[key], `${lang} ${key}`);
    assert.deepEqual(Object.keys(words.off).sort(), [...reasons].sort(), lang);
  }
  assert.deepEqual([ko.reroll, en.reroll, ja.reroll], ["다시 뽑기 · {cost}", "Reroll · {cost}", "引き直し · {cost}"]);
  assert.deepEqual([ko.extra, en.extra, ja.extra], ["하나 더 · {cost}", "One more · {cost}", "もう一つ · {cost}"]);
  // The note names the account by the name check:canon holds.
  assert.match(ko.spendNote, /KD은행 계좌/);
  assert.match(en.spendNote, /KD Bank account/);
  assert.match(ja.spendNote, /KD銀行口座/);
});
