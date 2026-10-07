import assert from "node:assert/strict";
import { test } from "node:test";

import { CANON, findCanonViolations } from "../../scripts/check-canon.mjs";

const PROLOGUE = "src/nodes/prologue04.js";

// Each line is a sentence the season actually carried before 2026-09-28.
const CONTRADICTIONS = [
  ["approval-date", PROLOGUE, 'text: "2023-0412가 승인된 4월 12일 17시 40분, 본점 기업금융전략팀 계정이 만들었습니다."'],
  ["approval-date", "src/nodes/prologue05.js", 'text: "4월 12일 승인, 4월 28일 반려, 6월 9일 종결."'],
  ["sale-start", PROLOGUE, 'text: "판매 개시일은 4월 20일, 대출이 승인되고 여드레 뒤입니다."'],
  ["committee-date", "src/nodes/prologue02.js", "text: \"'심사위원회는 이달 26일이야.'\""],
  ["rejection-time", "src/gameData.js", 'memo: ["반려 서명 18:02 -- 한서윤"]'],
  ["rejection-time", "src/gameData.js", 'text: "한서윤의 반려 서명은 오후 6시 2분."'],
  ["transfer-draft", "src/nodes/prologue05.js", 'text: "작성 시각은 4월 28일 09시 12분 -- 반려 3시간 뒤"'],
  ["ratio-is-a-ratio", "src/nodes/case09.js", 'text: "매출채권(아직 받지 못한 판매 대금) 179.6억."'],
  ["dissent-team", "src/nodes/case01.js", 'text: "3년 전 KD은행 기업대출심사팀에서 그 건에 혼자 반대 의견을 쓴 사람이 당신입니다."'],
  ["team-floor", "src/nodes/prologue03.js", 'place: "KD은행 본점 4층 기업금융전략팀 심사실"'],
  ["borrower-staff", "src/nodes/case01.js", 'memo: ["직원 126명, 대금 못 받은 협력사 14곳"]'],
  ["father-branch", "src/nodes/prologue01.js", 'text: "2009년, 부천 원미지점 대출 담당 차장이던 그의 아버지 오상철은"'],
];

test("the canon check goes red on each contradiction the season used to carry", () => {
  for (const [id, file, line] of CONTRADICTIONS) {
    const found = findCanonViolations(line, file).map((item) => item.id);
    assert.ok(found.includes(id), `${id} was not caught in: ${line}`);
  }
});

// Sentences the first table let through: a shape it did not know, a file it
// did not read, or a fact it did not hold (audit of 2026-10-07, finding 3).
const OTHER_SHAPES = [
  ["rejection-time", "src/nodes/prologue03.js", 'text: "13시 40분, 반대 의견서가 반려됩니다."'],
  ["rejection-time", "src/nodes/case11.js", 'memo: ["반려 시각 13:40"]'],
  ["rejection-time", "src/nodes/case34.js", 'memo: ["반려는 한서윤 14:32"]'],
  ["disposal-time", "src/nodes/case34.js", "text: \"'폐기'로 바뀐 시각은 19:44입니다.\""],
  ["ratio-values", "src/nodes/case09.js", 'text: "부채비율은 178.9%로 보고됐습니다."'],
  ["loan-amount-named", "src/nodes/prologue02.js", 'text: "310억이 아니라 320억 대출입니다."'],
  ["loan-amount", "src/nodes/case09.js", 'text: "3년 전 KD은행이 301억을 빌려준 플로우온이 다시 올라옵니다."'],
  ["approval-date", "src/nodes/case11.js", 'text: "4월 26일에 승인된 대출입니다."'],
  ["loan-number", "src/nodes/case31.js", 'memo: ["2023-0421 대출 서류철"]'],
  ["team-floor", "src/nodes/case34.js", 'place: "본점 7층 기업금융전략팀"'],
  ["borrower-staff-named", "src/nodes/case11.js", 'text: "플로우온 직원 1,410명의 일터입니다."'],
  ["borrower-staff", "src/nodes/case09.js", 'memo: ["직원 1,410명 · 협력사 280곳"]'],
  ["father-branch-city", "src/nodes/case18.js", 'role: "오상철은 부천 매탄지점장이었습니다."'],
  ["plaintiffs", "src/nodes/case36.js", 'label: "피해자 1,470명 이야기부터 꺼낸다"'],
  ["dissent-pages", "src/nodes/case31.js", 'title: "빠진 열다섯 쪽"'],
  ["dissent-pages", "src/nodes/prologue03.js", "memo: [\"반대 의견서 -- 본문 아닌 '첨부 7', 15쪽\"]"],
  ["auditor-tenure", "src/nodes/case07.js", 'text: "감사팀 3년차 조사역 반재욱이 수첩을 폅니다."'],
  ["auditor-notebook", "src/nodes/case07.js", 'memo: ["수첩에 적힌 이름 43명, 마지막 줄은 연필"]'],
  ["auditor-notebook", "src/nodes/case44.js", 'text: "반재욱이 43명의 이름이 적힌 수첩의 맨 뒷장을 폅니다."'],
  ["reaction-participants", "src/nodes/case37.js", 'memo: ["38만 줄, 참가자 61명"]'],
  // 사건 46 said this until 2026-10-07: the 원본 of the record that leaked.
  ["reaction-participants", "src/nodes/case46.js", 'memo: ["폐기 목록 7번: TL 반응 기록 원본, 참가자 14명"]'],
  ["night-shift-2023", "src/nodes/prologue02.js", 'memo: ["야간조 360명 중 계약직 181명"]'],
  ["night-shift-later", "src/nodes/case23.js", 'memo: ["야간조 88명 · 1인 1주"]'],
  ["case19-days", "src/nodes/case19.js", 'clock: "1월 26일 · 눈발 · 05:20"'],
  ["case19-demolition", "src/nodes/case19.js", 'memo: ["철거 예정 1월 23일 06시 -- 원래 4월 14일"]'],
];

test("a canon fact fails in any sentence shape and any file that states it", () => {
  for (const [id, file, line] of OTHER_SHAPES) {
    const found = findCanonViolations(line, file).map((item) => item.id);
    assert.ok(found.includes(id), `${id} was not caught in: ${line}`);
  }
});

test("a time or a count beside the word is read; one that dates something else is not", () => {
  const agreed = [
    ["src/nodes/case34.js", 'text: "그날 13시 32분에 반대 의견을 반려한 계정은 한서윤입니다."'],
    ["src/nodes/case34.js", 'memo: ["변경 신청: 윤상혁 계정 18:44, 승인자 칸 빈칸 -- 반려는 한서윤 13:32"]'],
    // 16:32 is the transfer notice, dated by the rejection, not the rejection.
    ["src/nodes/prologue05.js", 'text: "작성 시각은 4월 27일 16시 32분, 반대 의견서가 반려된 지 세 시간 뒤이고"'],
    ["src/nodes/prologue05.js", 'memo: ["작성 시각 4월 27일 16시 32분 -- 반려 3시간 뒤"]'],
    // Other firms, other loans, other notebooks.
    ["src/gameCases.js", 'text: "도심 15분 배송 회사 루프나우의 290억 대출이 올라옵니다."'],
    ["src/nodes/case48.js", 'memo: ["루프나우: 다크스토어 18곳, 직원 214명, 계약 라이더 1,380명"]'],
    ["src/nodes/case26.js", 'text: "임금 14억은 못 줬는데 조언값 32억은 나갔습니다."'],
    ["src/nodes/prologue01.js", 'text: "부채비율이 178.4%에서 184.7%로 올라갑니다."'],
    ["src/nodes/prologue04.js", 'memo: ["수첩의 이름 47개 · 메모 31줄"]'],
    ["src/nodes/case13.js", 'echo: "원자료를 받으면 조사 참가자 120명 중 피해자는 0명이라는 게 보입니다."'],
    ["src/nodes/case17.js", 'label: "제출에 반대한 17명의 이름을 대며 자리에서 일어선다"'],
  ];
  for (const [file, line] of agreed) assert.deepEqual(findCanonViolations(line, file), [], line);
});

test("the canon check accepts the canon's own sentences", () => {
  const agreed = [
    [PROLOGUE, 'text: "2023-0412가 승인된 4월 27일 16시 5분, 본점 기업금융전략팀 계정이 만들었습니다."'],
    ["src/nodes/prologue05.js", 'text: "4월 12일 접수, 4월 27일 반려와 승인, 6월 9일 종결."'],
    ["src/gameData.js", 'text: "한서윤의 반려 서명은 오후 1시 32분."'],
    ["src/nodes/case47.js", 'text: "서류 없는 212명 중 181명은 연휴 안에 입금되고"'],
  ];
  for (const [file, line] of agreed) assert.deepEqual(findCanonViolations(line, file), []);
});

test("a fact is only looked for where the season talks about it, and never in a comment", () => {
  // KD캐피탈 has a committee of its own; its dates are not the loan's.
  assert.deepEqual(findCanonViolations('text: "심사위원회는 4월 26일"', "src/nodes/case26.js"), []);
  assert.deepEqual(findCanonViolations(" * approved: 승인된 4월 12일", PROLOGUE), []);
});

test("every canon fact has a pattern with a value to capture", () => {
  for (const entry of CANON) {
    assert.ok(entry.find.global, `${entry.id} must be a global pattern`);
    assert.ok(/\((?!\?)/.test(entry.find.source), `${entry.id} captures nothing`);
  }
});
