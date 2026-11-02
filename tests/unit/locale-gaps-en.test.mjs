import assert from "node:assert/strict";
import { test } from "node:test";

import { assertNoHangul, collectLines, layOver } from "./locale-gaps.shared.mjs";
import { JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { getAnalystTitle } from "../../src/analystTitle.js";
import { openingEcho, OPENING_ECHO } from "../../src/state/openingState.js";

/**
 * 10-30 playtest: the result card's 판단 습관 (「돌다리 두들김형」) and the
 * other lines the runtime words were Korean on an English page. A Korean page
 * prints what it printed; with the English dictionary laid over the screen
 * copy, none of those lines has Hangul (tests/unit/locale-gaps.shared.mjs).
 * The Korean test runs first: the second lays English over the tables.
 */
test("a Korean page keeps its habits, titles and opening line", () => {
  assert.equal(JUDGEMENT_HABITS.find((habit) => habit.id === "stepping-stone").title, "돌다리 두들김형");
  assert.equal(getAnalystTitle({ currentCase: "case18" }), "선임 분석관");
  assert.equal(openingEcho(), OPENING_ECHO);
});

test("with the English dictionary laid over, nothing the swept modules print is Korean", async () => {
  const tables = await layOver("en");
  assertNoHangul(collectLines(tables), "en");
  assert.equal(JUDGEMENT_HABITS.find((habit) => habit.id === "stepping-stone").title, "Look-Before-You-Leap Type");
  // The card draws the name at 76px down to 48px on two lines; no English name is longer than the longest so far.
  for (const habit of JUDGEMENT_HABITS) assert.ok(habit.title.length <= 26, `${habit.id}: "${habit.title}" fits the card`);
});
