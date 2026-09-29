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
