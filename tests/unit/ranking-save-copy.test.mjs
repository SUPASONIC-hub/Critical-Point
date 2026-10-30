import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { overlayWords } from "../../src/locales/overlay.js";
import noticesCopy, { offersStorageRetry } from "../../src/copy/notices.js";
import englishScreens from "../../src/locales/en/screens/index.js";
import japaneseScreens from "../../src/locales/ja/screens/index.js";

/**
 * The line when a closed case's (or the season's) row cannot be written to
 * this device's ranking (useChoiceCommit). Until 10-29 it was an English
 * sentence written into the hook, so the Korean and Japanese pages showed
 * English. It is read from copy/notices.js now, in the page's language, and
 * offers no storage-cleanup retry (that clears the ranking rows and the save).
 */
const keys = ["rankingFailed", "seasonRankingFailed"];
const korean = Object.fromEntries(keys.map((key) => [key, noticesCopy.save[key]]));
const hook = readFileSync(new URL("../../src/state/useChoiceCommit.js", import.meta.url), "utf8");

test("the hook reads both lines from the notices table, not a sentence of its own", () => {
  assert.match(hook, /setSaveStatus\(noticesCopy\.save\.rankingFailed\)/);
  assert.match(hook, /setSaveStatus\(noticesCopy\.save\.seasonRankingFailed\)/);
  assert.doesNotMatch(hook, /setSaveStatus\("[A-Za-z]/, "no English line goes to the screen straight from the hook");
});

test("Korean: the lines are Korean, with no English sentence, and offer no retry", () => {
  assert.equal(korean.rankingFailed, "로컬 랭킹을 저장하지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.");
  assert.equal(korean.seasonRankingFailed, "시즌 랭킹을 저장하지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.");
  for (const key of keys) {
    assert.doesNotMatch(korean[key], /[A-Za-z]/, key);
    assert.equal(offersStorageRetry(korean[key]), false, key);
  }
});

test("English: the lines are English, with no Hangul", () => {
  const english = englishScreens.notices.save;
  assert.equal(english.rankingFailed, "Local ranking save failed: browser storage is unavailable.");
  assert.equal(english.seasonRankingFailed, "Season ranking save failed: browser storage is unavailable.");
  for (const key of keys) assert.doesNotMatch(english[key], /[가-힣]/, key);
  // Laid over the English page they offer no retry either: locale-buttons.test.mjs
  // checks every save line there (an overlay only replaces Korean, so one per process).
});

test("Japanese: the lines are Japanese, with no Hangul or English, and offer no retry", () => {
  const japanese = japaneseScreens.notices.save;
  assert.equal(japanese.rankingFailed, "ローカルランキングを保存できませんでした。ブラウザのストレージを使えません。");
  assert.equal(japanese.seasonRankingFailed, "シーズンランキングを保存できませんでした。ブラウザのストレージを使えません。");
  for (const key of keys) {
    assert.doesNotMatch(japanese[key], /[가-힣A-Za-z]/, key);
    assert.match(japanese[key], /ストレージ/, `${key} uses the glossary's word, as the other save lines do`);
  }
  // Laid over in this process only (an overlay replaces Korean, so the Japanese page is this file's).
  overlayWords(noticesCopy, japaneseScreens.notices);
  for (const key of keys) {
    assert.equal(noticesCopy.save[key], japanese[key]);
    assert.equal(offersStorageRetry(noticesCopy.save[key]), false, key);
  }
  assert.equal(offersStorageRetry(noticesCopy.save.unavailable), true, "the other storage lines keep the button");
});
