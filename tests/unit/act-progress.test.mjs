import assert from "node:assert/strict";
import { test } from "node:test";

import { ACT_PROGRESS_CASES, LEAVE_LINE_CASES, MINI_TALLY_FOR, readActProgress, readLeaveLine, TALLY_AFTER_CASES } from "../../src/actProgress.js";
import { buildActTallyModel, MINI_TALLY_CASES } from "../../src/actTally.js";
import { CASE_SEQUENCE, TYPICAL_CASE_MINUTES } from "../../src/gameCases.js";
import { getNextCaseSignal } from "../../src/caseCopy.js";
import { ACT_CARDS } from "../../src/gauntlet/actCardCopy.js";
import { fill } from "../../src/locale.js";
import resultKo from "../../src/copy/result.js";
import resultEn from "../../src/locales/en/screens/result.js";
import resultJa from "../../src/locales/ja/screens/result.js";
import actTallyEn from "../../src/locales/en/screens/actTally.js";
import actTallyJa from "../../src/locales/ja/screens/actTally.js";

/**
 * N23 (2026-11-16): the report of 사건 01 to 17 says where it stands in its
 * act and how far the next 중간 결산 is; 사건 07's report carries a small one.
 */

test("사건 01 to 17 carry the line, and no other report does", () => {
  assert.equal(ACT_PROGRESS_CASES.length, 17);
  assert.equal(ACT_PROGRESS_CASES[0], "case01");
  assert.equal(ACT_PROGRESS_CASES.at(-1), "case17");
  for (const caseId of ["prologue01", "prologue05", "case18", "case19", "case49", "final", "side01", "nowhere"]) {
    assert.equal(readActProgress(caseId), null, caseId);
  }
});

test("the act and the place in it are the act cards' own, and the count runs to the next 중간 결산", () => {
  assert.deepEqual(readActProgress("case01"), { act: 1, pos: 1, size: 7, left: 6 });
  assert.deepEqual(readActProgress("case03"), { act: 1, pos: 3, size: 7, left: 4 });
  assert.deepEqual(readActProgress("case07"), { act: 1, pos: 7, size: 7, left: 0 });
  assert.deepEqual(readActProgress("case08"), { act: 2, pos: 1, size: 5, left: 10 });
  assert.deepEqual(readActProgress("case12"), { act: 2, pos: 5, size: 5, left: 6 });
  assert.deepEqual(readActProgress("case13"), { act: 3, pos: 1, size: 6, left: 5 });
  assert.deepEqual(readActProgress("case17"), { act: 3, pos: 5, size: 6, left: 1 });
  // Every act number is an act card's, and every count lands on a tally.
  for (const caseId of ACT_PROGRESS_CASES) {
    const { act, pos, size, left } = readActProgress(caseId);
    assert.ok(Object.values(ACT_CARDS).some((card) => card.act === act));
    assert.ok(pos >= 1 && pos <= size);
    assert.ok(TALLY_AFTER_CASES.includes(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) + left]));
  }
});

test("the small tally on 사건 07's report is the N1 card's model for the act that follows", () => {
  assert.deepEqual(MINI_TALLY_FOR, { case07: "case08" });
  assert.deepEqual(Object.values(MINI_TALLY_FOR), [...MINI_TALLY_CASES]);
  const caseResults = Object.fromEntries(CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf("case08")).map((caseId) => [caseId, { completedAt: "2026-11-16T00:00:00.000Z" }]));
  const model = buildActTallyModel("case08", { caseResults, log: [], discoveredClues: [], resources: {} });
  assert.equal(model.end, "1막 끝 · 사건 07");
  assert.equal(model.heading, "중간 결산 · 1막 끝 · 사건 07");
  assert.equal(actTallyEn.ends.case08, "End of Act 1 · Case 07");
  assert.equal(actTallyJa.ends.case08, "第1幕の終わり · 事件07");
});

test("the line is written in Korean, English and Japanese", () => {
  const values = { act: 1, pos: 3, size: 7, left: 4 };
  assert.equal(fill(resultKo.actProgress, values), "1막 · 3/7 · 중간 결산까지 4사건");
  assert.equal(fill(resultKo.actProgressHere, { ...values, pos: 7, left: 0 }), "1막 · 7/7 · 중간 결산은 아래에");
  assert.equal(fill(resultEn.actProgress, values), "Act 1 · 3/7 · mid-season tally in 4");
  assert.equal(fill(resultJa.actProgress, values), "第1幕 · 3/7 · 中間決算まであと4事件");
  for (const copy of [resultKo, resultEn, resultJa]) {
    for (const key of ["actProgress", "actProgressHere"]) assert.doesNotMatch(fill(copy[key], values), /[{}]/, key);
  }
});

test("N42: 프롤로그 05, 사건 03 and 사건 07 end on the leave line, and it names the next case", () => {
  assert.deepEqual([...LEAVE_LINE_CASES], ["prologue05", "case03", "case07"]);
  assert.deepEqual(readLeaveLine("prologue05", getNextCaseSignal("prologue05", []), TYPICAL_CASE_MINUTES), { next: "사건 01 - 72시간", minutes: 10 });
  for (const caseId of LEAVE_LINE_CASES) {
    const line = readLeaveLine(caseId, getNextCaseSignal(caseId, []), TYPICAL_CASE_MINUTES);
    assert.match(line.next, /^사건 \d\d - /, caseId);
  }
  for (const caseId of ["prologue04", "case01", "case04", "case08", "final"]) {
    assert.equal(readLeaveLine(caseId, getNextCaseSignal(caseId, []), TYPICAL_CASE_MINUTES), null, caseId);
  }
  assert.equal(readLeaveLine("case03", undefined, 10), null);
  assert.equal(readLeaveLine("case03", {}, 10), null);
});

test("N42: the leave line is written in Korean, English and Japanese", () => {
  const values = { next: "사건 04 - 치러야 할 값", minutes: 10 };
  assert.equal(fill(resultKo.leaveLine.text, values), "쉬어도 저장됩니다 · 다음: 사건 04 - 치러야 할 값 (약 10분)");
  for (const copy of [resultKo, resultEn, resultJa]) {
    assert.ok(copy.leaveLine.label);
    assert.doesNotMatch(fill(copy.leaveLine.text, values), /[{}]/);
  }
});