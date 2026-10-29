import assert from "node:assert/strict";
import { test } from "node:test";

import { getReadingSeconds, readingUnits } from "../../src/gauntlet/gauntletEngine.js";

/**
 * The reading clock in Korean characters whatever the page's language
 * (전체 공개 준비, 10-28): a Korean page is counted by its characters as it
 * always was, an English page by its words (two characters each), a Japanese
 * page by its characters at 0.89.
 */
test("a page with Hangul is counted by its characters, spaces left out, as before", () => {
  assert.equal(readingUnits("가나 다라 TL_full.zip 38만 줄"), "가나다라TL_full.zip38만줄".length);
  assert.equal(getReadingSeconds({ text: "가".repeat(200) }), 26);
});

test("an English page is counted by its words, two Korean characters a word", () => {
  assert.equal(readingUnits("The morning after, 380,000 lines and 63 people."), 8 * 2);
  assert.equal(getReadingSeconds({ text: "word ".repeat(100) }), getReadingSeconds({ text: "가".repeat(200) }));
});

test("a Japanese page is counted by its characters at 0.89", () => {
  const page = "あ".repeat(100);
  assert.equal(readingUnits(page), 89);
  assert.equal(readingUnits("ハン・ソユン課長 は 言う"), "ハン・ソユン課長は言う".length * 0.89);
});

test("an empty page still has the floor", () => {
  assert.equal(readingUnits(""), 0);
  assert.equal(getReadingSeconds({ text: "" }), getReadingSeconds({}));
});
