import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { buildRuntimeData, loadSeasonTables } from "../../scripts/season-split.mjs";
import { compareWords, flatten, readCopySource, readLanguageCopy, sideSource } from "../../scripts/locale-words.mjs";
import { localizeSidePack, SOURCE_LOCALE, SUPPORTED_LOCALES } from "../../src/locale.js";
import { localizeSide, localizeSidePack as overlaySidePack, overlayWords } from "../../src/locales/overlay.js";
import { SIDE_CASES } from "../../src/nodes/sidePacks.js";
import { side01 } from "../../src/nodes/side01.js";
import { side02 } from "../../src/nodes/side02.js";
import { isSideCaseId } from "../../src/sideCases.js";
import { checkSidePack } from "../../src/state/sidePackCheck.js";

/**
 * E-11 번외 사건 in another language: a side pack's scenes and endings come
 * from src/locales/<lang>/nodes/sideNN.js, its label and title from the
 * dictionary's `copy.sidePacks` (src/locales/overlay.js, scripts/check-locale.mjs).
 */
const root = new URL("../..", import.meta.url).href.replace(/\/$/, "");
const languages = SUPPORTED_LOCALES.map((locale) => locale.code).filter((code) => code !== SOURCE_LOCALE);
// The same count as tests/unit/locales.test.mjs: a quote mark that is not an apostrophe inside a word.
const marks = (text) => [...text].filter((character, at) => character === "'" && !(/[A-Za-z]/.test(text[at - 1] ?? "") && /[A-Za-z]/.test(text[at + 1] ?? ""))).length;
const clone = (value) => JSON.parse(JSON.stringify(value));

const RELEASED = [side01, side02];

test("every language answers each released side case's scenes and endings: none missing, none stale, no number lost", async () => {
  for (const lang of languages) {
    const { speakers } = await import(`${root}/src/locales/${lang}/index.js`);
    for (const pack of RELEASED) {
      const words = (await import(`${root}/src/locales/${lang}/nodes/${pack.id}.js`)).default;
      const result = compareWords(sideSource(pack), words, lang);
      assert.ok(result.total > 100, `${lang}: ${pack.id} has its scenes' words`);
      assert.deepEqual(result.missing, [], `${lang}: ${pack.id} missing`);
      assert.deepEqual(result.stale, [], `${lang}: ${pack.id} stale`);
      assert.deepEqual(result.numbers, [], `${lang}: ${pack.id} numbers`);
      // Every speaker has a printed name, and a line keeps the Korean's speech marks (the briefing finds speech by them).
      assert.deepEqual([...new Set(Object.values(pack.nodes).map((scene) => scene.speaker))].filter((name) => !speakers[name]), [], `${lang} ${pack.id}`);
      const korean = flatten(sideSource(pack));
      for (const [path, text] of Object.entries(flatten(words))) assert.equal(marks(text), marks(korean[path]), `${lang} ${pack.id} ${path}`);
    }
  }
});

test("every language names the side list's label and title in its dictionary; the Korean label stays 「번외 N」", async () => {
  const source = flatten(await readCopySource(root));
  const sidePaths = Object.keys(source).filter((path) => path.startsWith("sidePacks."));
  assert.deepEqual(sidePaths.sort(), [
    "sidePacks.SIDE_CASES.side01.label", "sidePacks.SIDE_CASES.side01.title",
    "sidePacks.SIDE_CASES.side02.label", "sidePacks.SIDE_CASES.side02.title",
  ]);
  const labels = { en: (n) => `Side case ${n}`, ja: (n) => `番外${n}` };
  for (const lang of languages) {
    const copy = flatten(await readLanguageCopy(root, lang));
    for (const path of sidePaths) assert.equal(typeof copy[path], "string", `${lang}: ${path}`);
    for (const n of [1, 2]) assert.equal(copy[`sidePacks.SIDE_CASES.side0${n}.label`], labels[lang](n), `${lang}: the label in the case labels' form`);
  }
  assert.deepEqual(SIDE_CASES.map((entry) => entry.label), ["번외 1", "번외 2"]);
  for (const pack of RELEASED) assert.deepEqual(checkSidePack(pack), [], pack.id);
});

test("a side pack is never in the season's data, and a release lists no fixture", async () => {
  const shipped = buildRuntimeData(await loadSeasonTables());
  assert.deepEqual(Object.keys(shipped.cases).filter(isSideCaseId), []);
  assert.equal(shipped.index.packs.some((pack) => isSideCaseId(pack.id)), false);
  assert.equal(SIDE_CASES.some((entry) => entry.fixture), false);
  // A language's side file answers a side case the release lists, and nothing else (no side00).
  for (const lang of languages) {
    const dir = new URL(`src/locales/${lang}/nodes/`, `${root}/`);
    const sides = existsSync(dir) ? readdirSync(dir).map((file) => file.replace(/\.js$/, "")).filter(isSideCaseId) : [];
    assert.deepEqual(sides, SIDE_CASES.map((entry) => entry.id), lang);
  }
});

test("on a Korean page a side pack arrives as it is; the overlay lays a language over its scenes, endings and speakers", async () => {
  assert.equal(localizeSidePack(side01), side01);
  // Before a dictionary arrives the overlay hands a side pack back too, Korean and unnamed.
  const unloaded = clone(side01);
  assert.equal(overlaySidePack(unloaded), unloaded);
  assert.deepEqual(unloaded, clone(side01));
  const loaded = await SIDE_CASES[0].load();
  assert.equal(loaded.nodes.s1_start.text, side01.nodes.s1_start.text);
  assert.equal(await SIDE_CASES[1].load(), side02);

  const pack = clone(side01);
  const words = (await import(`${root}/src/locales/en/nodes/side01.js`)).default;
  localizeSide(pack, words, { 반재욱: "Ban Jaewook" });
  assert.equal(pack.nodes.s1_start.text, words.nodes.s1_start.text);
  assert.equal(pack.nodes.s1_start.speaker, "반재욱", "the speaker stays the portrait's key");
  assert.equal(pack.nodes.s1_start.speakerName, "Ban Jaewook");
  const card = pack.nodes.s1_start.choices[0];
  assert.equal(card.label, words.nodes.s1_start.choices[card.id].label);
  assert.equal(card.sourceLabel, side01.nodes.s1_start.choices[0].label, "the observer reads the Korean card");
  assert.equal(card.next, side01.nodes.s1_start.choices[0].next);
  const [endingId] = Object.keys(side01.outcomes);
  assert.equal(pack.outcomes[endingId].title, words.outcomes[endingId].title);
  // With no file the pack keeps its Korean.
  const korean = clone(side01);
  localizeSide(korean, null, {});
  assert.deepEqual(korean, clone(side01));
  // The list's label and title are written over by the dictionary's copy.
  const list = clone(SIDE_CASES.map(({ id, label, title }) => ({ id, label, title })));
  overlayWords(list, { side01: { label: "Side case 1", title: "The Seven Not Yet Visited" } });
  assert.deepEqual(list[0], { id: "side01", label: "Side case 1", title: "The Seven Not Yet Visited" });
});
