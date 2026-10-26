import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { buildRuntimeData, loadSeasonTables } from "../../scripts/season-split.mjs";
import { caseSource, compareWords, flatten, hasHangul, readCopySource, readLanguageCopy, stillKorean, wordsOf } from "../../scripts/locale-words.mjs";
import { LANG, loadLocale, localizeCaseData, SOURCE_LOCALE, speakerName, SUPPORTED_LOCALES } from "../../src/locale.js";
import { addStyle, betweenFiles, caseRole, fillPreview, inPreview, localizeCase, localizeCaseData as overlayCaseData, localizeTables, markPreviewEnd, overlayModule, overlayWords, previewText, roleName as overlayRoleName, speakerName as overlaySpeakerName } from "../../src/locales/overlay.js";
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
  // A hidden language (a draft opened by its address) is named by its dictionary, below.
  for (const locale of SUPPORTED_LOCALES) assert.ok(locale.name || locale.hidden, `${locale.code} is named in its own language`);
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
  assert.equal(overlayRoleName("KD은행 기업금융전략팀장"), "KD은행 기업금융전략팀장");
  const tables = { chapterRules: { case01: { label: "현금과 사람" } } };
  localizeTables("caseCopy", tables);
  assert.equal(tables.chapterRules.case01.label, "현금과 사람");
  const data = structuredClone(shipped.cases.case01);
  assert.deepEqual(overlayCaseData("case01", data, structuredClone(shipped.index)), shipped.cases.case01);
});

test("the preview's last case is one constant: the cases after it stay Korean, its panel ends the preview, and its lines count from it", () => {
  assert.equal(inPreview("case10", "case10"), true);
  assert.equal(inPreview("prologue03", "case10"), true);
  assert.equal(inPreview("case11", "case10"), false);
  assert.equal(inPreview("final", "case20"), false);
  assert.equal(inPreview("case11", undefined), true);
  assert.equal(fillPreview("Cases 01–{last}; Case {next} soon", "case10"), "Cases 01–10; Case 11 soon");
  assert.equal(fillPreview("Cases 01–{last}; Case {next} soon", "case20"), "Cases 01–20; Case 21 soon");
  const preview = { endEyebrow: "End", endButtons: { korean: "Korean" }, endPremiseLead: "End of Case {last}; Case {next} is Korean." };
  const signals = { case10: { eyebrow: "Next", button: "Start Case 11", premise: "Premise." }, case20: { eyebrow: "Next", button: "Start Case 21", premise: "Later." } };
  markPreviewEnd(signals, preview, "case20");
  assert.deepEqual(signals.case10, { eyebrow: "Next", button: "Start Case 11", premise: "Premise." });
  assert.deepEqual(signals.case20, { eyebrow: "End", button: "Korean", premise: "End of Case 20; Case 21 is Korean. Later." });
  // The copy between cases for the cases after the preview waits: its file is fetched once the preview reaches its first case.
  const files = { "./en/between/case11-20.js": () => "11-20", "./en/between/case21-30.js": () => "21-30", "./ja/between/case11-20.js": () => "ja", "./en/between/notes.js": () => "x" };
  assert.deepEqual(betweenFiles(files, "en", "case10").map((get) => get()), []);
  assert.deepEqual(betweenFiles(files, "en", "case20").map((get) => get()), ["11-20"]);
  assert.deepEqual(betweenFiles(files, "en", "case21").map((get) => get()), ["11-20", "21-30"]);
  assert.deepEqual(betweenFiles(files, "en", undefined).map((get) => get()), ["11-20", "21-30"]);
  const parts = [null, { caseRoles: { case11: { 기자: "Reporter" } } }, { caseRoles: { case21: { 작가: "Writer" } } }];
  assert.equal(caseRole(parts, "기자", "case20"), "Reporter");
  assert.equal(caseRole(parts, "기자", "case10"), undefined);
  assert.equal(caseRole(parts, "작가", "case20"), undefined);
  assert.equal(caseRole(parts, "없음", "case49"), undefined);
  // And a case's words in a file are laid over only while that case is in the preview.
  const echoes = { case10: "에코: 열.", case11: "에코: 열하나.", other: "다른 줄." };
  overlayModule({ caseCopy: { caseIntroEchoes: { case10: "ECHO: Ten.", case11: "ECHO: Eleven.", other: "Another line." } } }, "caseCopy", { caseIntroEchoes: echoes }, "case10");
  assert.deepEqual(echoes, { case10: "ECHO: Ten.", case11: "에코: 열하나.", other: "Another line." });
  overlayModule({ caseCopy: { caseIntroEchoes: { case11: "ECHO: Eleven." } } }, "caseCopy", { caseIntroEchoes: echoes }, "case20");
  assert.equal(echoes.case11, "ECHO: Eleven.");
});

for (const lang of others) {
  const { cases, dictionary } = await languageFiles(lang);

  test(`${lang}: a preview names a case of the season as its last, and every speaker of a case the language has scenes for has a printed name`, () => {
    if (dictionary.previewThrough) assert.ok(gameCases.CASE_SEQUENCE.includes(dictionary.previewThrough), dictionary.previewThrough);
    const unnamed = new Set();
    for (const caseId of Object.keys(cases)) {
      for (const scene of Object.values(shipped.cases[caseId]?.nodes ?? {})) if (scene.speaker && !dictionary.speakers?.[scene.speaker]) unnamed.add(`${caseId} ${scene.speaker}`);
    }
    assert.deepEqual([...unnamed], []);
  });

  test(`${lang}: every case file names a case and says nothing the Korean no longer has`, () => {
    for (const [caseId, words] of Object.entries(cases)) {
      assert.ok(shipped.cases[caseId], `${caseId} is not a case`);
      const result = compareWords(caseSource(shipped, caseId), words, lang);
      assert.deepEqual(result.stale, [], `${caseId}: words for paths the Korean does not have`);
      for (const [path, text] of Object.entries(flatten(words))) assert.ok(!stillKorean(text), `${caseId} ${path} is still Korean`);
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

  test(`${lang}: the dictionary's screen copy answers paths the Korean has (every case's), and names speakers by their Korean names`, async () => {
    // Every case: the dictionary's copy and the copy between cases waiting in <lang>/between/.
    const root = new URL("../..", import.meta.url).href.replace(/\/$/, "");
    const result = compareWords(await readCopySource(root, gameCases.CASE_SEQUENCE), await readLanguageCopy(root, lang), lang);
    assert.deepEqual(result.stale, []);
    for (const name of Object.keys(dictionary.speakers ?? {})) assert.ok(hasHangul(name), `speakers key ${name}`);
    if (SUPPORTED_LOCALES.find((locale) => locale.code === lang).hidden) assert.ok(dictionary.preview?.languageName, `${lang} is hidden, so its dictionary names it (preview.languageName)`);
  });

  test(`${lang}: the dictionary carries no copy for a case after 사건 10, and each between/ file only the cases its name spans`, async () => {
    const order = gameCases.CASE_SEQUENCE;
    const caseKeys = (copy) => Object.values(copy ?? {}).flatMap((tables) => Object.values(tables ?? {}).flatMap((table) => Object.keys(table ?? {}))).filter((key) => order.includes(key));
    const late = caseKeys(dictionary.copy).filter((key) => order.indexOf(key) > order.indexOf("case10"));
    assert.deepEqual([...new Set(late)], [], "the copy between cases after 사건 10 belongs in between/<first>-<last>.js");
    const dir = new URL(`../../src/locales/${lang}/between/`, import.meta.url);
    for (const file of existsSync(dir) ? readdirSync(dir) : []) {
      const span = /^(case\d{2})-(\d{2})\.js$/.exec(file);
      assert.ok(span, `${file}: named <first case>-<last number>.js`);
      const [first, last] = [order.indexOf(span[1]), order.indexOf(`case${span[2]}`)];
      const part = await import(new URL(file, dir).href);
      for (const key of [...caseKeys(part.copy), ...Object.keys(part.caseRoles ?? {})]) {
        assert.ok(order.indexOf(key) >= first && order.indexOf(key) <= last, `${file}: ${key} is outside its span`);
      }
    }
  });
}

test("a dictionary's own CSS goes on its page as one style element, and nothing is added without a page or a style", async () => {
  addStyle("p{}"); // no document in this process: nothing happens
  const appended = [];
  globalThis.document = { head: { append: (element) => appended.push(element) }, createElement: (tag) => ({ tag }) };
  try {
    addStyle("");
    assert.equal(appended.length, 0);
    const { style } = await import("../../src/locales/ja/index.js");
    addStyle(style);
    assert.equal(appended.length, 1);
    assert.equal(appended[0].tag, "style");
    assert.match(appended[0].textContent, /^:root:lang\(ja\)\{--font-sans:"Hiragino Sans"/, "the Japanese page's face, on a Japanese page only");
    assert.match(appended[0].textContent, /word-break:normal;line-break:strict/);
  } finally {
    delete globalThis.document;
  }
});

// Last: it writes over the shared tables of this process.
test("a dictionary's screen copy is laid over the Korean tables in place, keys and ids kept", () => {
  overlayModule({ gameCases: { caseObjectives: { case01: "Close the last 72 hours." }, seasonCasesBase: { case01: { title: "72 Hours", id: "x" } } } }, "gameCases", gameCases);
  assert.equal(gameCases.caseObjectives.case01, "Close the last 72 hours.");
  const entry = gameCases.seasonCasesBase.find((item) => item.id === "case01");
  assert.equal(entry.title, "72 Hours");
  assert.equal(caseCopy.nextCaseSignals.case01.caseId, "case02");
});
