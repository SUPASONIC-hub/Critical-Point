import assert from "node:assert/strict";
import { test } from "node:test";

import { assertFarCallbacksLand, assertNoHangul, collectLines, collectRunLines, layOver } from "./locale-gaps.shared.mjs";
import { JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { getAnalystName } from "../../src/endingCopy.js";
import { ANALYST_TITLE_STEPS, getAnalystTitle } from "../../src/analystTitle.js";
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
  // The five record titles (C1), in step order; 首席 as the 11-03 review settled it.
  assert.deepEqual(ANALYST_TITLE_STEPS.map((step) => step.title), ["見習い分析官", "分析官", "上級分析官", "責任分析官", "首席分析官"]);
  assert.equal(getAnalystTitle({ finishedSeason: true }), "首席分析官");
  for (const habit of JUDGEMENT_HABITS) assert.ok([...habit.title].length <= 12, `${habit.id}: 「${habit.title}」 fits the card`);
  assertNoHangul(collectRunLines(speakers), "ja", 100);
  await assertFarCallbacksLand("ja");
  assert.equal(getAnalystName("분석관"), "分析官");
  assert.equal(getAnalystName("分析官"), "分析官");
  assert.equal(getAnalystName("ハン"), "ハン分析官");
  assert.equal(createStartSave({ playerName: "" }).playerName, "분석관");
});
