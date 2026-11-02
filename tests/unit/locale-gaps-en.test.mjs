import assert from "node:assert/strict";
import { test } from "node:test";

import { assertFarCallbacksLand, assertNoHangul, collectLines, collectRunLines, layOver } from "./locale-gaps.shared.mjs";
import { JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { getAnalystTitle } from "../../src/analystTitle.js";
import { openingEcho, OPENING_ECHO } from "../../src/state/openingState.js";
import { buildSceneBeat, getEcho } from "../../src/gameLogic.js";
import { echoReplies as seasonEchoes } from "../../src/gameData.js";
import { getAnalystName } from "../../src/endingCopy.js";
import { fullStop, getSeasonCard } from "../../src/state/secondSeason.js";
import { createStartSave } from "../../src/state/shellStartSave.js";
import { speakers } from "../../src/locales/en/index.js";

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
  // The second pass: the scene beat, the default reply and name, the share tail.
  assert.equal(
    buildSceneBeat({ speaker: "한서윤" }, { label: "판을 다시 짠다" }, { trust: 3 }),
    [
      "짧게 묶은 머리, 접힌 셔츠 소매, 12년 전 심사 보고서가 열린 채 잠들지 않는 태블릿. 한서윤은 바로 대답하지 않고, 화면의 자금 흐름표를 한 칸 아래로 내린다.",
      "'그때 승인란에 서명한 건 나다. 이 사람이 안 하면, 그건 내 이야기가 된다.'",
      "당신은 준비된 대응안의 이름 대신, 결론만 남겨 이렇게 말한다. \"판을 다시 짜겠습니다.\"",
      "한서윤이 시선을 든다. 감정을 눌러둔 실무자의 말투로, 가능한 일과 감당할 손실만 남긴다.",
      "\"가능한 말인지부터 보겠습니다. 좋은 말은 그다음입니다.\"",
      "믿음이 열린다. 하지만 그 숫자가 공짜로 생긴 것은 아니다.",
    ].join("\n"),
  );
  assert.equal(getEcho("reframe"), seasonEchoes.default);
  // The default name is said once (user decision 11-02), and a typed name keeps its title.
  assert.equal(getAnalystName("분석관"), "분석관");
  assert.equal(getAnalystName(" 분석관 "), "분석관");
  assert.equal(getAnalystName("한서윤"), "한서윤 분석관");
  assert.equal(getAnalystName(""), "익명 분석관");
  assert.equal(createStartSave({ playerName: "" }).playerName, "분석관");
  assert.ok(getSeasonCard({ secondSeason: { round: 2 } }).share.endsWith("."));
  assert.equal(fullStop("ja"), "。");
  assert.equal(fullStop("en"), ".");
});

test("with the English dictionary laid over, nothing the swept modules print is Korean", async () => {
  const tables = await layOver("en");
  assertNoHangul(collectLines(tables), "en");
  assert.equal(JUDGEMENT_HABITS.find((habit) => habit.id === "stepping-stone").title, "Look-Before-You-Leap Type");
  // The card draws the name at 76px down to 48px on two lines; no English name is longer than the longest so far.
  for (const habit of JUDGEMENT_HABITS) assert.ok(habit.title.length <= 26, `${habit.id}: "${habit.title}" fits the card`);
  // The second pass: what the runtime writes as a run is played, and the far callbacks on the English scenes.
  assertNoHangul(collectRunLines(speakers), "en", 100);
  await assertFarCallbacksLand("en");
  // The default name is shown in English and kept in Korean.
  assert.equal(getAnalystName("분석관"), "Analyst");
  assert.equal(getAnalystName("Analyst"), "Analyst");
  assert.equal(getAnalystName("Han"), "Analyst Han");
  assert.equal(createStartSave({ playerName: "" }).playerName, "분석관");
});
