import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { buildRuntimeData, loadSeasonTables } from "../../scripts/season-split.mjs";
import { caseSource, compareWords, flatten, hasHangul, readCopySource, wordsOf } from "../../scripts/locale-words.mjs";
import { LANG, loadLocale, localizeCaseData, SOURCE_LOCALE, speakerName, SUPPORTED_LOCALES } from "../../src/locale.js";
import { localizeCase, localizeCaseData as overlayCaseData, localizeTables, overlayModule, overlayWords, previewText, speakerName as overlaySpeakerName } from "../../src/locales/overlay.js";
import * as gameCases from "../../src/gameCases.js";
import * as caseCopy from "../../src/caseCopy.js";

/**
 * The languages over the Korean (다국어 틀; 영어판 1단계): a Korean page is
 * handed back what it gave, and a page in another language gets words --
 * only words -- under the Korean's ids, with the Korean wherever the language
 * has none.
 */
const shipped = buildRuntimeData(await loadSeasonTables());
const localesDir = new URL("../../src/locales/", import.meta.url);
const codes = SUPPORTED_LOCALES.map((locale) => locale.code);
const others = codes.filter((code) => code !== SOURCE_LOCALE);

async function languageFiles(lang) {
  const dir = new URL(`${lang}/nodes/`, localesDir);
  const files = existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith(".js")) : [];
  const cases = Object.fromEntries(await Promise.all(files.map(async (file) => [file.replace(/\.js$/, ""), (await import(new URL(file, dir).href)).default])));
  const dictionary = await import(new URL(`${lang}/index.js`, localesDir).href);
  return { cases, dictionary };
}

const marks = (text) => [...text].filter((character, at) => character === "'" && !(/[A-Za-z]/.test(text[at - 1] ?? "") && /[A-Za-z]/.test(text[at + 1] ?? ""))).length;

test("a page without ?lang= is Korean, and the language module hands everything back as it was", () => {
  assert.equal(LANG, "ko");
  assert.equal(codes[0], SOURCE_LOCALE);
  for (const locale of SUPPORTED_LOCALES) assert.ok(locale.name, `${locale.code} is named in its own language`);
  assert.equal(loadLocale(), null);
  assert.equal(speakerName("한서윤"), "한서윤");
  const data = { nodes: { start: { text: "그대로" } } };
  assert.equal(localizeCaseData("case01", data, shipped.index), data);
});

test("every supported language but Korean has a dictionary under src/locales/<lang>, and no folder there is a language nobody lists", () => {
  for (const lang of others) assert.ok(existsSync(new URL(`${lang}/index.js`, localesDir)), `src/locales/${lang}/index.js`);
  const folders = readdirSync(localesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  assert.deepEqual(folders.filter((name) => !others.includes(name)), []);
});

test("the words of a value keep its shape: cards by id, lists by position, keys and ids left out", () => {
  const words = wordsOf({
    phase: "CASE BRIEFING",
    speaker: "한서윤",
    text: "본문",
    memo: ["하나", "2023-0412", "셋"],
    choices: [{ id: "a", label: "카드", next: "b", effect: { trust: 1 } }],
  });
  assert.deepEqual(words, { text: "본문", memo: ["하나", null, "셋"], choices: { a: { label: "카드" } } });
  assert.deepEqual(flatten(words), { text: "본문", "memo[0]": "하나", "memo[2]": "셋", "choices.a.label": "카드" });
});

test("only a Korean string is written over: ids, effects and next stay the Korean file's", () => {
  const scene = { text: "본문", memo: ["하나", "둘"], choices: [{ id: "a", label: "카드", next: "b", effect: { trust: 1 } }] };
  overlayWords(scene, { text: "Text", memo: [null, "Two"], choices: { a: { label: "Card", next: "x", effect: "none" }, gone: { label: "Lost" } }, extra: "ignored" });
  assert.deepEqual(scene, { text: "Text", memo: ["하나", "Two"], choices: [{ id: "a", label: "Card", next: "b", effect: { trust: 1 } }] });
});

test("a case's words cover its scenes and its pack's result copy, and a line left out stays Korean", () => {
  const data = structuredClone(shipped.cases.case01);
  const index = structuredClone(shipped.index);
  const [nodeId, scene] = Object.entries(data.nodes).find(([, entry]) => entry.speaker);
  const [cardId] = Object.keys(data.echoReplies);
  localizeCase("case01", data, index, { nodes: { [nodeId]: { text: "In English." } }, echoReplies: { [cardId]: "Reply." }, pack: { clue: { title: "Clue" } } }, { [scene.speaker]: "Name" });
  assert.equal(data.nodes[nodeId].text, "In English.");
  assert.equal(data.nodes[nodeId].title, scene.title);
  // The printed name beside the Korean key.
  assert.equal(data.nodes[nodeId].speaker, scene.speaker);
  assert.equal(data.nodes[nodeId].speakerName, "Name");
  assert.deepEqual(data.nodes[nodeId].choices.map((choice) => choice.next), scene.choices.map((choice) => choice.next));
  assert.equal(data.echoReplies[cardId], "Reply.");
  assert.equal(index.packs.find((pack) => pack.id === "case01").clue.title, "Clue");
});

test("before a dictionary arrives, the overlay changes nothing: no names, no preview line, cases and tables as they came", () => {
  assert.equal(overlaySpeakerName("한서윤"), "한서윤");
  assert.equal(previewText("previewNote"), "");
  const tables = { chapterRules: { case01: { label: "현금과 사람" } } };
  localizeTables("caseCopy", tables);
  assert.equal(tables.chapterRules.case01.label, "현금과 사람");
  const data = structuredClone(shipped.cases.case01);
  assert.deepEqual(overlayCaseData("case01", data, structuredClone(shipped.index)), shipped.cases.case01);
});

for (const lang of others) {
  const { cases, dictionary } = await languageFiles(lang);

  test(`${lang}: every case file names a case and says nothing the Korean no longer has`, () => {
    for (const [caseId, words] of Object.entries(cases)) {
      assert.ok(shipped.cases[caseId], `${caseId} is not a case`);
      const result = compareWords(caseSource(shipped, caseId), words);
      assert.deepEqual(result.stale, [], `${caseId}: words for paths the Korean does not have`);
      for (const [path, text] of Object.entries(flatten(words))) assert.ok(!hasHangul(text), `${caseId} ${path} is still Korean`);
    }
  });

  test(`${lang}: the speech marks of a line are the Korean's, since the briefing finds speech by them`, () => {
    for (const [caseId, words] of Object.entries(cases)) {
      const korean = flatten(caseSource(shipped, caseId));
      for (const [path, text] of Object.entries(flatten(words))) {
        if (korean[path] !== undefined) assert.equal(marks(text), marks(korean[path]), `${caseId} ${path}`);
      }
    }
  });

  test(`${lang}: the dictionary's screen copy answers paths the Korean has, and names speakers by their Korean names`, async () => {
    const result = compareWords(await readCopySource(new URL("../..", import.meta.url).href.replace(/\/$/, "")), dictionary.copy);
    assert.deepEqual(result.stale, []);
    for (const name of Object.keys(dictionary.speakers ?? {})) assert.ok(hasHangul(name), `speakers key ${name}`);
  });
}

// Last: it writes over the shared tables of this process.
test("a dictionary's screen copy is laid over the Korean tables in place, keys and ids kept", () => {
  overlayModule({ gameCases: { caseObjectives: { case01: "Close the last 72 hours." }, seasonCasesBase: { case01: { title: "72 Hours", id: "x" } } } }, "gameCases", gameCases);
  assert.equal(gameCases.caseObjectives.case01, "Close the last 72 hours.");
  const entry = gameCases.seasonCasesBase.find((item) => item.id === "case01");
  assert.equal(entry.title, "72 Hours");
  assert.equal(caseCopy.nextCaseSignals.case01.caseId, "case02");
});
