import assert from "node:assert/strict";
import { test } from "node:test";

import { assertFarCallbacksLand, assertNoHangul, collectLines, collectRunLines, layOver } from "./locale-gaps.shared.mjs";
import { JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { getAnalystName } from "../../src/endingCopy.js";
import { createStartSave } from "../../src/state/shellStartSave.js";
import { speakers } from "../../src/locales/ja/index.js";

/**
 * The Japanese page's side of tests/unit/locale-gaps-en.test.mjs: with the
 * Japanese dictionary laid over the screen copy, nothing the swept modules
 * print has Hangul. 「」 are Japanese quotes here, not a mark of Korean.
 */
test("with the Japanese dictionary laid over, nothing the swept modules print is Korean", async () => {
  const tables = await layOver("ja");
  assertNoHangul(collectLines(tables), "ja");
  assert.equal(JUDGEMENT_HABITS.find((habit) => habit.id === "stepping-stone").title, "石橋を叩く型");
  for (const habit of JUDGEMENT_HABITS) assert.ok([...habit.title].length <= 12, `${habit.id}: 「${habit.title}」 fits the card`);
  assertNoHangul(collectRunLines(speakers), "ja", 100);
  await assertFarCallbacksLand("ja");
  assert.equal(getAnalystName("분석관"), "分析官");
  assert.equal(createStartSave({ playerName: "" }).playerName, "분석관");
});
