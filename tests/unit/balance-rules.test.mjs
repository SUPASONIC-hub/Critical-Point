import assert from "node:assert/strict";
import { test } from "node:test";

import { clockMismatch, onlyPutsOff } from "../../scripts/balance-rules.mjs";

/**
 * Rule 7 of the balance check, asked about cards written here: what a label
 * says about the clock against what the card does to it. Every card below is
 * made up for the test, so the rule is held whatever the season deals.
 */
const passes = (label, time) => assert.equal(clockMismatch(label, time), null, `"${label}" at time ${time} should agree with the clock`);
const fails = (label, time, why) => assert.match(clockMismatch(label, time) ?? "", why, `"${label}" at time ${time} should be refused`);

test("putting a thing off buys time today, so a label that does may gain time", () => {
  passes("책상부터 비우고 수첩 문제는 해체 뒤로 미룬다", 6);
  passes("보상안을 만들고 조사를 미룬다", 5);
  passes("자금 확보 전까지 공개를 미룬다", 4);
  passes("기록에 없는 정보는 보류한다", 4);
  passes("항목은 그대로 두고 회수 시기만 1년 늦춘다", 6);
  passes("사과는 뒤로 돌리고 청구 서류부터 받아 간다", 4);
  passes("통계는 덮어 두고 선고만 기다린다", 7);
  // Nothing gained, nothing lost: the label claims no more than that.
  passes("급여 지급 방안 확정 전까지 공개를 미룬다", 0);
});

test("a label that only puts a thing off may not lose time", () => {
  const why = /only puts a thing off and loses time \(-4\)/;
  fails("공개를 미룬다", -4, why);
  fails("기록에 없는 정보는 보류한다", -4, why);
  fails("회수 시기를 늦춘다", -4, why);
  fails("명단 이야기는 뒤로 돌린다", -4, why);
  fails("답을 기다린다", -4, why);
  // The same claim in the mouth of the card: 미루자고 한다, 미루라고 한다.
  fails("결정을 미루자고 한다", -4, why);
  fails("서명을 미루라고 한다", -4, why);
});

test("a label that puts a thing off and names what spends the time may lose it", () => {
  // A second act, before the wait word or after it.
  passes("서명은 미루고 소명 기간 동안 안에서 더 모은다", -6);
  passes("오늘은 사과만 전하고 설명은 다음 교실로 미룬다", -5);
  passes("먼저 묻고 오겠다며 답을 미룬다", -6);
  passes("답장도 사과도 미룬 채 차에 올라 첫 이름부터 찾아간다", -4);
  // A span that is waited through.
  passes("하루를 더 기다린다", -6);
  passes("결정을 며칠 미루자고 한다", -5);
  passes("확인할 때까지 모든 결론을 보류한다", -10);
  passes("윤서진이 스스로 말할 때까지 곁에서 기다린다", -5);
  // The wait word names a thing, and the card does something else with it.
  passes("징계 문서에 임시 보류 조건을 삽입한다", -7);
});

test("a label that acts at once may not lose time, and may gain it", () => {
  fails("서류를 즉시 넘긴다", -5, /acts at once and loses time \(-5\)/);
  fails("모래주머니를 싣고 곧장 망원시장으로 간다", -5, /acts at once and loses time/);
  fails("부록을 오늘 바로 보여 준다", -1, /acts at once and loses time/);
  passes("서류를 즉시 넘긴다", 0);
  passes("택시를 잡아 면접장으로 곧장 달린다", 7);
  // The same cards without the word take the time they cost.
  passes("모래주머니를 싣고 망원시장으로 나선다", -5);
});

test("a word the label refuses, or that means something else, is not read", () => {
  passes("결과를 기다리지 않고 서류를 넘긴다", -5);
  passes("미루지 말고 오늘 서명한다", -5);
  passes("보류하지 않고 원래대로 전달한다", -5);
  passes("틀린 날짜를 바로잡는다", -5);
  passes("바로 그 서류를 다시 읽는다", -5);
  // 우선순위 holds no wait word, and a label with neither word claims nothing.
  passes("우선순위를 다시 정한다", -9);
  passes("명단을 한 줄씩 대조한다", 9);
});

test("a label that says both is not read as either", () => {
  passes("법무팀이 기다리는 다음 싸움으로 곧장 간다", -5);
  passes("법무팀이 기다리는 다음 싸움으로 곧장 간다", 5);
});

test("only-puts-off is true of the bare claim and of nothing else", () => {
  assert.equal(onlyPutsOff("공개를 미룬다"), true);
  assert.equal(onlyPutsOff("결정을 미루자고 한다"), true);
  assert.equal(onlyPutsOff("공개를 미루고 자금부터 구한다"), false);
  assert.equal(onlyPutsOff("자금을 구할 때까지 공개를 미룬다"), false);
  assert.equal(onlyPutsOff("공개를 미루지 않는다"), false);
  assert.equal(onlyPutsOff("자금부터 구한다"), false);
});
