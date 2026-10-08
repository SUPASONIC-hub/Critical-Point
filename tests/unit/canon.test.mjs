import assert from "node:assert/strict";
import { test } from "node:test";

import { CANON, canonYears, findCanonViolations } from "../../scripts/check-canon.mjs";

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

// Facts the canon's prose held and the table did not (the same finding): the
// rest of the afternoon of 27 April, the second standard, and the people.
const ADDED_FACTS = [
  ["committee-hour", "src/nodes/prologue03.js", 'text: "오후 3시 대출심사위원회 안건 목록이 새벽 다섯 시에 올라왔습니다."'],
  ["committee-hour", "src/nodes/prologue03.js", 'text: "오늘 오후 4시에 승인된 대출이 두 시간 만에 내려간 셈입니다."'],
  ["committee-countdown", "src/nodes/prologue03.js", 'memo: ["첨부 7 반려 처리: 13시 32분 -- 개회 38분 전"]'],
  ["committee-countdown", "src/nodes/prologue03.js", 'memo: ["위원회 개회까지 4시간 40분"]'],
  ["committee-countdown-summary", "src/gameCases.js", '"개회 18분 전, 한서윤 과장이 당신의 반대 의견서를 반려합니다."'],
  ["agenda-length", "src/nodes/prologue03.js", 'memo: ["안건 4번 소요 시간 -- 4분 21초"]'],
  ["call-before-rejection", "src/nodes/prologue03.js", 'memo: ["직전 통화: 13시 12분, 팀장실 내선 → 한서윤 자리, 11분"]'],
  ["call-length", "src/nodes/prologue03.js", 'memo: ["직전 통화: 13시 21분, 팀장실 내선 → 한서윤 자리, 12분"]'],
  ["call-length", "src/nodes/prologue03.js", 'question: "반려는 12분짜리 통화가 끝나자마자 눌렸습니다."'],
  ["script-written", "src/nodes/prologue04.js", "text: \"'스마트물류 3호 응대 요령' 파일의 작성 시각은 4월 27일 15시 5분입니다.\""],
  ["script-written", "src/nodes/prologue04.js", 'memo: ["대본 작성: 본점 기업금융전략팀 계정, 4월 27일 16시 50분"]'],
  ["script-after-approval", "src/gameCases.js", '"승인 세 시간 뒤, 그 대출은 창구의 상품이 됩니다."'],
  ["script-pages", "src/nodes/prologue04.js", 'memo: ["같은 밤 배포본 24쪽 → 4쪽"]'],
  ["second-standard", "src/nodes/case47.js", 'text: "서류 없는 212명 중 182명은 연휴 안에 입금되고"'],
  ["second-standard", "src/gameCases.js", 'case47: "118명이 추석 안에 받는 길과 31명을 끝까지 넣는 길 사이에서"'],
  ["yun-post-2023", "src/nodes/case11.js", 'text: "바꾼 계정은 당시 기업대출심사팀장 윤상혁입니다."'],
  ["yun-rank-2023", "src/nodes/prologue03.js", 'text: "윤상혁 상무가 서류철을 덮습니다."'],
  ["yun-rank", "src/nodes/case26.js", 'text: "윤상혁 전무가 서류철을 덮습니다."'],
  ["han-rank-2023", "src/nodes/prologue02.js", 'text: "한서윤 실장이 복도에 서 있습니다."'],
  ["han-rank", "src/nodes/case06.js", 'text: "한서윤 차장이 복도에 서 있습니다."'],
  ["oh-rank", "src/nodes/prologue02.js", 'text: "오진우 과장이 모니터를 돌립니다."'],
  ["baek-rank", "src/nodes/case13.js", 'text: "그룹전략실 과장 백아린이 계약서를 내밉니다."'],
  ["im-post", "src/nodes/prologue02.js", 'text: "8층 기업금융전략팀장 임경수가 복도에서 기다립니다."'],
  ["do-window", "src/nodes/case01.js", "text: \"'저 3년 전에 강서지점 3번 창구였습니다.'\""],
  ["do-tenure-2023", "src/nodes/prologue04.js", 'memo: ["4번 창구 도윤하 -- 입행 5년차"]'],
  ["minseo-code", "src/nodes/case30.js", 'memo: ["A-071 = 이민서 (입사 순서 번호)"]'],
  ["participant-codes", "src/nodes/case40.js", 'text: "A-001부터 A-036까지 번호만 남았습니다."'],
  ["yun-dismissal", "src/nodes/case43.js", 'question: "해임은 6대 2로 가결됐고 마지막 줄은 오늘 밤 공시됩니다."'],
  ["yun-sentence", "src/nodes/case44.js", 'memo: ["판결: 징역 3년, 집행유예 4년, 추징 25억 6천만 원"]'],
  ["baek-resignation", "src/nodes/case33.js", 'text: "3월 30일에 낸 사표는 끝내 수리되지 않았습니다."'],
  ["baek-report", "src/nodes/case33.js", 'memo: ["공익신고 접수 6월 18일 -- 자료 1,212쪽"]'],
  ["im-death", "src/nodes/case45.js", 'memo: ["임경수 별세: 9월 14일 새벽 4시 50분, 이음병원"]'],
  ["echo-replaced", "src/nodes/case20.js", 'memo: ["노아 전환 완료: 2월 2일 00:00"]'],
  ["father-year", "src/nodes/prologue01.js", 'memo: ["오상철 -- 2008년 수원 매탄지점장, 승인 하루 지연"]'],
  ["father-after", "src/nodes/prologue01.js", 'memo: ["석 달 뒤 관리 부서 발령 · 3년 뒤 명예퇴직"]'],
  ["father-after", "src/nodes/prologue01.js", 'memo: ["넉 달 뒤 관리 부서 발령 · 5년 뒤 명예퇴직"]'],
  ["han-borrowed-line", "src/nodes/prologue03.js", "text: \"'이건 당신을 위한 겁니다. 이 말, 나중에는 믿게 될 거예요.'\""],
];

test("the afternoon of 27 April, the second standard and the people are held too", () => {
  for (const [id, file, line] of ADDED_FACTS) {
    const found = findCanonViolations(line, file).map((item) => item.id);
    assert.ok(found.includes(id), `${id} was not caught in: ${line}`);
  }
});

test("한서윤 says 자네 once: the word in a 프롤로그 scene she speaks is only that line", () => {
  const scene = (speaker, text) => `      speaker: "${speaker}",\n      text: "${text}",\n      memo: ["그의 문장: '이건 자네를 위한 겁니다'"],`;
  const file = "src/nodes/prologue03.js";
  assert.deepEqual(findCanonViolations(scene("한서윤", "'이건 자네를 위한 겁니다. 이 말, 나중에는 믿게 될 거예요.'"), file), []);
  const second = findCanonViolations(scene("한서윤", "'자네가 쓴 건 읽었어요. 이건 자네를 위한 겁니다.'"), file);
  assert.deepEqual(second.map((item) => [item.id, item.line]), [["han-one-jane", 2]]);
  // 윤상혁 says it all day, and a later scene of his does not count against her.
  assert.deepEqual(findCanonViolations(`${scene("한서윤", "'읽었습니다.'")}\n${scene("윤상혁", "'자네 이름으로 내게. 자네를 위한 거라고 했지?'")}`, file), []);
  // The main season quotes other people inside her scenes (임경수's "자네 칸").
  assert.deepEqual(findCanonViolations(scene("한서윤", "'자네 칸, 나도 봤네.'"), "src/nodes/case45.js"), []);
});

test("a date written with a weekday has to fit its year", () => {
  const ids = (file, line) => findCanonViolations(line, file).map((item) => item.id);
  // 27 April 2023 was a Thursday; 프롤로그 02-05 are 2023.
  assert.deepEqual(ids("src/nodes/prologue03.js", 'clock: "4월 27일 목요일 · 14시"'), []);
  assert.deepEqual(ids("src/nodes/prologue03.js", 'clock: "4월 27일 금요일 · 14시"'), ["weekday"]);
  // The same date in the main season is another year's weekday.
  assert.deepEqual(ids("src/nodes/case31.js", 'text: "4월 27일 (월) 만기입니다."'), []);
  assert.deepEqual(ids("src/nodes/case31.js", 'text: "4월 27일 (목) 만기입니다."'), ["weekday"]);
  // A year that is written decides, wherever the sentence is.
  assert.deepEqual(ids("src/nodes/case31.js", 'text: "2023년 4월 27일 목요일의 서류입니다."'), []);
  assert.deepEqual(ids("src/nodes/case31.js", 'text: "2023년 4월 27일 월요일의 서류입니다."'), ["weekday"]);
  // 사건 01-18 are 2025, 사건 19 on is 2026, 프롤로그 01 is 2022.
  assert.deepEqual(ids("src/nodes/case17.js", 'clock: "12월 19일 금요일"'), []);
  assert.deepEqual(ids("src/nodes/case19.js", 'clock: "1월 19일 월요일"'), []);
  assert.deepEqual(ids("src/nodes/case19.js", 'clock: "1월 19일 일요일"'), ["weekday"]);
  assert.deepEqual(ids("src/nodes/prologue01.js", 'clock: "2022년 10월 17일 월요일"'), []);
  assert.deepEqual(ids("src/nodes/prologue01.js", 'clock: "10월 17일 화요일"'), ["weekday"]);
  // The summaries speak of every year, so a weekday there has to fit one of the four.
  assert.deepEqual(ids("src/caseCopy.js", 'hook: "4월 27일 목요일, 위원회가 열립니다."'), []);
  assert.deepEqual(ids("src/caseCopy.js", 'hook: "4월 27일 화요일, 위원회가 열립니다."'), ["weekday"]);
  assert.deepEqual(canonYears("src\\nodes\\finalCase.js"), [2026]);
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
    ["src/nodes/prologue03.js", 'text: "13시 21분, 6층 팀장실 내선에서 한서윤 자리 내선으로, 통화 시간 11분."'],
    ["src/nodes/prologue03.js", 'memo: ["안건 4번 소요 시간 -- 4분 12초", "오후 2시, 본점 8층 대출심사위원회 회의실"]'],
    [PROLOGUE, 'memo: ["대본 작성: 본점 기업금융전략팀 계정, 4월 27일 16시 05분", "같은 밤 배포본 22쪽 → 4쪽"]'],
    ["src/nodes/case44.js", 'text: "징역 3년에 집행유예(유죄지만 형을 당장 살게 하지 않고 미뤄 두는 것) 5년"'],
    // Another call, another firm's window, another person's rank.
    ["src/nodes/case11.js", 'echo: "통화는 12분 동안 이어집니다."'],
    ["src/nodes/case27.js", 'place: "군산 새봄신협 · 3번 창구"'],
    ["src/nodes/case23.js", 'memo: ["안건 제3호: 사내이사 윤상혁 선임 -- 경력란에 2023년 없음"]'],
    ["src/nodes/case02.js", 'text: "퇴직한 전 심사팀장 임경수가 끈으로 묶은 서류를 듭니다."'],
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
