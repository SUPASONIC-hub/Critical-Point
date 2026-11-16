import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * N31: the rows of docs/terminology.md marked **held**, held on the English
 * and Japanese screen copy (src/locales/<lang>/screens), where a term is the
 * game's own word every time it appears. Story text (nodes/) can mean a real
 * wall or a real vault and is read by people, not by this test.
 */

const screens = (lang) => {
  const dir = new URL(`../../src/locales/${lang}/screens/`, import.meta.url);
  return readdirSync(dir)
    .filter((name) => name.endsWith(".js"))
    .map((name) => ({ name, text: readFileSync(new URL(name, dir), "utf8") }));
};

// Only the quoted strings, not comments or keys like `pot:` and `{pot}` blanks.
const strings = (text) => [...text.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((match) => match[1].replace(/\{\w+\}/g, ""));

function offenders(lang, pattern) {
  return screens(lang).flatMap(({ name, text }) => strings(text).filter((line) => pattern.test(line)).map((line) => `${name}: ${line}`));
}

test("English screens: the Wall and the Vault are capitalised, the stake is not a pot or a bet", () => {
  assert.deepEqual(offenders("en", /\bthe (wall|vault)\b/), []);
  assert.deepEqual(offenders("en", /\b(pot|bet)s?\b/i), []);
});

test("English screens: Commit is never called locking in", () => {
  assert.deepEqual(offenders("en", /\block(s|ed)? in\b/i), []);
});

test("Japanese screens: 賭け金 and 名誉の殿堂, one word each", () => {
  assert.deepEqual(offenders("ja", /掛け金|ベット/), []);
  assert.deepEqual(offenders("ja", /(?<!名誉の)殿堂/), []);
});
