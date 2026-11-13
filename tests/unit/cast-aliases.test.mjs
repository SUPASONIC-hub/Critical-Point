import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { CAST_ALIASES, castAliasLine, castNoticeAt, renameCast } from "../../src/castAliases.js";
import { getSpeakerPortrait } from "../../src/speakerPortraits.js";

/**
 * The 11-13 renames (castAliases.js): an old name a save kept reads as the new
 * one, with the Korean particle after it following the new name's last sound.
 */

// Named in a profile and the narration only, never a scene's speaker (사건 48).
const PROFILE_ONLY = new Set(["토머스 리드"]);

test("every new Korean name is a speaker with a portrait, and the three tables pair up", () => {
  for (const [, to] of CAST_ALIASES.ko.filter(([, name]) => !PROFILE_ONLY.has(name))) assert.match(getSpeakerPortrait(to) ?? "", /^\/portrait-[a-z0-9-]+\.webp$/, to);
  assert.equal(CAST_ALIASES.en.length, CAST_ALIASES.ko.length);
  assert.equal(CAST_ALIASES.ja.length, CAST_ALIASES.ko.length);
  for (const [, to] of CAST_ALIASES.en) assert.match(to, /^[\x20-\x7e]+$/, `${to}: en names stay ASCII`);
});

test("the en and ja tables name the new people the way the dictionaries do", () => {
  const en = readFileSync("src/locales/en/index.js", "utf8");
  const ja = readFileSync("src/locales/ja/index.js", "utf8");
  CAST_ALIASES.ko.forEach(([, to], index) => {
    if (PROFILE_ONLY.has(to)) return;
    assert.ok(en.includes(`"${to}": "${CAST_ALIASES.en[index][1]}"`), `en speakers: ${to}`);
    assert.ok(ja.includes(`"${to}": "${CAST_ALIASES.ja[index][1]}"`), `ja speakers: ${to}`);
  });
});

test("an old name turns into the new one, particle and all", () => {
  const [[oldVowel, newVowel]] = CAST_ALIASES.ko; // 류세아 -> 프리야 나이르: both end on a vowel
  assert.equal(renameCast(`${oldVowel}가 말합니다`), `${newVowel}가 말합니다`);
  const pair = CAST_ALIASES.ko.find(([, to]) => /[탄남강]$/.test(to)); // a vowel turned into a consonant
  const [from, to] = pair;
  assert.equal(renameCast(`${from}가 ${from}는 ${from}를 ${from}와 ${from}로 ${from}예요`), `${to}이 ${to}은 ${to}을 ${to}과 ${to}으로 ${to}이에요`);
  assert.equal(renameCast(`${from}의 모형`), `${to}의 모형`);
  assert.equal(renameCast(`Tell ${CAST_ALIASES.en[1][0]}`), `Tell ${CAST_ALIASES.en[1][1]}`);
  assert.equal(renameCast(`${CAST_ALIASES.ja[0][0]}が言う`), `${CAST_ALIASES.ja[0][1]}が言う`);
  assert.equal(renameCast("아무 이름 없는 줄"), "아무 이름 없는 줄");
  assert.equal(renameCast(""), "");
  assert.equal(renameCast(undefined), undefined);
});

test("the start screen lists the renames for a month from the change", () => {
  assert.equal(castNoticeAt(Date.parse("2026-11-12T23:59:00+09:00")), false);
  assert.equal(castNoticeAt(Date.parse("2026-11-13T09:00:00+09:00")), true);
  assert.equal(castNoticeAt(Date.parse("2026-12-13T23:59:00+09:00")), true);
  assert.equal(castNoticeAt(Date.parse("2026-12-14T00:00:00+09:00")), false);
  assert.equal(castNoticeAt("not a time"), false);
  assert.match(castAliasLine("en"), new RegExp(`^${CAST_ALIASES.en[0][0]} → ${CAST_ALIASES.en[0][1]}`));
  assert.equal(castAliasLine("xx"), castAliasLine("ko"));
});
