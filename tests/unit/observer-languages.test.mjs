import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { buildRuntimeData, loadSeasonTables } from "../../scripts/season-split.mjs";
import { getObservationLedger, getObserverTag } from "../../src/gameLogic.js";
import { appliedLocale, LANG, SOURCE_LOCALE, SUPPORTED_LOCALES } from "../../src/locale.js";
import { overlayWords } from "../../src/locales/overlay.js";
import { toRowSummary } from "../../src/state/useChoiceCommit.js";

/**
 * The observer reads a card in Korean whatever the page's language (코드 리뷰
 * 10-26 낮음): the observer's tag and the observation ledger come out the same
 * for the same card on every page. Until 2026-10-28 they read the screen's
 * words, and 40 English and 10 Japanese cards were filed differently.
 */
const shipped = buildRuntimeData(await loadSeasonTables());
const localesDir = new URL("../../src/locales/", import.meta.url);
const others = SUPPORTED_LOCALES.map((locale) => locale.code).filter((code) => code !== SOURCE_LOCALE);
const calm = { responseTimeSec: 10, challenge: { riskDelta: 0 } };

function koreanCards() {
  const cards = new Map();
  for (const pack of Object.values(shipped.cases)) {
    for (const node of Object.values(pack.nodes ?? {})) {
      for (const choice of node?.choices ?? []) if (choice?.id) cards.set(choice.id, choice.label);
    }
  }
  return cards;
}

test("every translated card is filed as its Korean card is, by the Korean label it keeps", async () => {
  const korean = koreanCards();
  assert.ok(korean.size > 1000, "the season's cards were read");
  for (const lang of others) {
    const dir = new URL(`${lang}/nodes/`, localesDir);
    if (!existsSync(dir)) continue;
    let read = 0;
    for (const file of readdirSync(dir).filter((name) => name.endsWith(".js"))) {
      const words = (await import(new URL(file, dir).href)).default;
      for (const scene of Object.values(words.nodes ?? {})) {
        for (const [id, card] of Object.entries(scene?.choices ?? {})) {
          if (typeof card?.label !== "string" || !korean.has(id)) continue;
          const choice = { id, label: korean.get(id), next: "x" };
          overlayWords([choice], { [id]: card });
          assert.equal(choice.label, card.label);
          assert.equal(choice.sourceLabel, korean.get(id));
          const asKorean = { ...calm, choiceId: id, choice: korean.get(id) };
          const asShown = { ...calm, choiceId: id, choice: choice.label, sourceChoice: choice.sourceLabel };
          assert.equal(getObserverTag(asShown).id, getObserverTag(asKorean).id, `${lang} ${id}`);
          assert.equal(getObservationLedger([asShown]).opacity, getObservationLedger([asKorean]).opacity, `${lang} ${id}`);
          read += 1;
        }
      }
    }
    assert.ok(read > 0, `${lang} has cards`);
  }
});

test("a card is written over once: its Korean label is kept the first time and never replaced, and only cards keep one", () => {
  const choice = { id: "a", label: "공개를 미룬다", next: "b" };
  overlayWords([choice], { a: { label: "Hold the release" } });
  overlayWords([choice], { a: { label: "Again" } });
  assert.equal(choice.sourceLabel, "공개를 미룬다");
  assert.equal(getObserverTag({ ...calm, choiceId: "a", choice: choice.label, sourceChoice: choice.sourceLabel }).id, "opacity");
  const option = { id: "steady", label: "차분하게" };
  overlayWords([option], { steady: { label: "Steady" } });
  assert.deepEqual(option, { id: "steady", label: "Steady" }, "a table that is not a scene's cards gains nothing");
});

test("a row names the language the page was painted in: Korean until a dictionary has arrived", () => {
  assert.equal(LANG, SOURCE_LOCALE);
  assert.equal(appliedLocale(), SOURCE_LOCALE);
  assert.equal(toRowSummary({}).locale, SOURCE_LOCALE);
  assert.equal(toRowSummary({}, "en").locale, "en");
});
