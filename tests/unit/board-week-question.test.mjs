import assert from "node:assert/strict";
import { test } from "node:test";

import { WEEK_QUESTIONS, weekQuestionId, weekQuestionText } from "../../src/boardQuestions.js";
import { E2E_WEEKLY_RULE_CLOCK } from "../../src/state/weeklyClock.js";
import { weekStartMs } from "../../src/gauntlet/weeklyCalendar.js";
import boardCopy from "../../src/copy/board.js";
import enBoard from "../../src/locales/en/screens/board.js";
import jaBoard from "../../src/locales/ja/screens/board.js";

/**
 * N33 게시판 「이번 주 질문」 (src/boardQuestions.js): which week has which
 * question, that the week turns on Monday 00:00 KST with the week's rule, and
 * that every question has its words in all three languages.
 */

const kst = (iso) => Date.parse(`${iso}+09:00`);

test("the first four weeks are W47 to W50 of 2026, one question each, ids unique", () => {
  assert.deepEqual(
    WEEK_QUESTIONS.map((entry) => entry.week),
    ["2026-W47", "2026-W48", "2026-W49", "2026-W50"],
  );
  const ids = WEEK_QUESTIONS.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("the question turns on Monday 00:00 KST, as the week's rule does", () => {
  assert.equal(weekQuestionId(kst("2026-11-16T00:00:00")), "first-stake");
  assert.equal(weekQuestionId(kst("2026-11-22T23:59:59")), "first-stake");
  assert.equal(weekQuestionId(kst("2026-11-23T00:00:00")), "stopped-at-wall");
  assert.equal(weekQuestionId(weekStartMs("2026-W49")), "numbers-or-people");
  assert.equal(weekQuestionId(weekStartMs("2026-W50")), "short-clock");
});

test("a week with no entry, and a clock that is not a time, have no question", () => {
  assert.equal(weekQuestionId(kst("2026-11-15T23:59:59")), "");
  assert.equal(weekQuestionId(weekStartMs("2026-W51")), "");
  assert.equal(weekQuestionId(Number.NaN), "");
  assert.equal(weekQuestionId(kst("2026-11-17T12:00:00"), []), "");
});

test("the test builds' pinned week draws no question, so no baseline moves", () => {
  assert.equal(weekQuestionId(Date.parse(E2E_WEEKLY_RULE_CLOCK)), "");
});

test("every question has its words in Korean, English and Japanese, and nothing else is listed", () => {
  const ids = WEEK_QUESTIONS.map((entry) => entry.id).sort();
  for (const [language, table] of [["ko", boardCopy], ["en", enBoard], ["ja", jaBoard]]) {
    const words = table.weekQuestion;
    assert.deepEqual(Object.keys(words.questions).sort(), ids, language);
    for (const key of ["label", "from", "note"]) assert.ok(words[key]?.trim(), `${language} ${key}`);
    for (const id of ids) {
      const text = weekQuestionText(words.questions, id);
      assert.ok(text.length > 10 && text.length <= 160, `${language} ${id}: ${text.length}`);
    }
  }
});

test("the words are looked up by own key only", () => {
  const questions = boardCopy.weekQuestion.questions;
  assert.equal(weekQuestionText(questions, ""), "");
  assert.equal(weekQuestionText(questions, "toString"), "");
  assert.equal(weekQuestionText(null, "first-stake"), "");
  assert.equal(weekQuestionText({ odd: 3 }, "odd"), "");
});
