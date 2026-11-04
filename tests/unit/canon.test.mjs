import assert from "node:assert/strict";
import { test } from "node:test";

import { CANON, canonYears, findCanonViolations, readCanon, SCENE_RULES, sceneParts } from "../../scripts/check-canon.mjs";

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
  // Until 2026-11-04 (A044): the wound-up 해온파트너스 as the payee of 2026.
  ["advisory-fee-payee", "src/nodes/case26.js", 'echo: "위원회에 올리자 32억이 처음으로 안건 제목이 됩니다. 해온파트너스는 그날 오후 등기부의 주소를 옮깁니다."'],
  ["advisory-fee-payee", "src/caseCopy.js", 'hook: "평택 사업비에서 32억 자문료(조언값이라며 내보낸 돈)를 받아 간 해온파트너스의 돈길은 바다 건너로 이어집니다."'],
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
  // The same count in digits (#209 wrote counts of ten or more in digits).
  ["dissent-pages", "src/nodes/case31.js", 'title: "빠진 15쪽"'],
  ["dissent-pages", "src/nodes/case31.js", 'question: "사라진 15쪽을 한 번만 물었던 사람이 다시 묻습니다."'],
  ["dissent-pages", "src/nodes/case31.js", 'label: "15쪽을 쓴 사람으로서 그날을 털어놓는다"'],
  ["dissent-pages", "src/nodes/case31.js", 'voice: "그 15쪽을 쓴 사람으로서 그날의 이야기를 한다."'],
  ["dissent-pages", "src/gameCases.js", 'summary: "사라진 15쪽의 사연이 확인자 서명란 앞에 놓입니다."'],
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
  ["kd-owner-name", "src/nodes/case43.js", 'text: "최대주주 킹스턴 파트너스의 뉴욕 본사가 표를 정합니다."'],
  ["kd-owner-stake", "src/caseCopy.js", 'memo: ["킹스데일 파트너스 지분 49%"]'],
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
  ["agm-vote", "src/nodes/case24.js", 'memo: ["윤상혁 이사 선임 가결 -- 찬성 53.0%"]'],
  ["agm-vote", "src/nodes/case23.js", 'text: "가결 50.4%. 당신은 마지막 버스가 떠날 때까지 서 있었습니다."'],
  ["agm-against", "src/caseCopy.js", "text: \"액자 밑에는 '반대 47.0%, 우리도 들어 있음'이라고 적혀 있습니다.\""],
  ["agm-followers", "src/nodes/case23.js", 'text: "클리어보트 권고를 따른 외국인 기관이 27.2%, 국민연금이 8%입니다."'],
  ["agm-others", "src/nodes/case23.js", 'memo: ["반대 49.4%: 외국인 기관 22.7% · 국민연금 8% · 그 밖의 기관 13.7%"]'],
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
    // 한서윤 pressed a button (2026-11-03): the time is the same fact.
    ["src/gameData.js", 'text: "한서윤이 반려 버튼을 누른 시각은 오후 1시 32분."'],
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
    ["src/nodes/case26.js", 'memo: ["사업비 명세서: 사업 자문료 32억 -- 해온파트너스와 같은 주소의 새 법인"]'],
    // 사건 08's 해온파트너스 of 2025 is still 해온파트너스.
    ["src/nodes/case08.js", 'text: "해온파트너스의 청산은 결국 등기됐습니다."'],
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

test("one reading of a file gives what the run counts and what it reports", () => {
  // Four lines, two of them comments: a fact and a date that agree, and one of
  // each that does not. The run adds up the first two lists and prints the third.
  const file = "src\\nodes\\prologue02.js";
  const text = [
    "// 승인된 4월 12일, 4월 27일 금요일",
    'text: "2023-0412가 승인된 4월 27일 목요일, 본점 6층 기업금융전략팀."',
    " * 본점 9층 기업금융전략팀",
    'text: "승인된 4월 12일 (목), 대출번호 2023-0412."',
  ].join("\r\n");
  const read = readCanon(text, file);

  assert.deepEqual(
    read.statements.map(({ entry, agrees, line }) => [entry.id, agrees, line]),
    [
      ["loan-number", true, 2],
      ["loan-number", true, 4],
      ["approval-date", true, 2],
      ["approval-date", false, 4],
      ["team-floor", true, 2],
    ],
  );
  assert.deepEqual(
    read.dates.map(({ found, agrees, line }) => [found, agrees, line]),
    [
      ["4월 27일 목요일", true, 2],
      ["4월 12일 (목)", false, 4],
    ],
  );
  // A comment is in neither list, and the lines after it keep their numbers.
  assert.deepEqual(
    read.violations.map(({ id, file: where, line }) => [id, where, line]),
    [
      ["approval-date", "src/nodes/prologue02.js", 4],
      ["weekday", "src/nodes/prologue02.js", 4],
    ],
  );
  assert.deepEqual(findCanonViolations(text, file), read.violations);
});

// The audit of 2026-11-03: each line is one the season carried that day.
const AUDIT_1103 = [
  ["han-return-sign", "src/nodes/case08.js", 'memo: ["같은 해 한서윤이 2023-0412 검토란에 서명"]'],
  ["han-return-sign", "src/nodes/case23.js", "echo: \"'등급 하락은 반대 의견을 폐기한 결정에서 나옴.' 반려란에 있는 한서윤의 서명도 부록에 실립니다.\""],
  ["han-return-sign", "src/nodes/case10.js", 'echo: "한서윤은 자기 서명을 후회한다고 적어야 합니다."'],
  ["han-return-sign-pair", "src/nodes/case33.js", 'memo: ["대기발령 첫날 반납한 사원증", "서명한 사람과 신고한 사람"]'],
  ["han-rank-then", "src/nodes/case08.js", 'memo: ["수령인: 한서윤 (당시 차장)"]'],
  ["minseo-rooftop", "src/nodes/case16.js", 'place: "망원동 이민서의 옥탑방 · 옥상"'],
  ["kdcap-floor", "src/caseCopy.js", 'movement: "KD캐피탈 16층 → 회기동 헌책방 1층"'],
  ["kdcap-dept-floor", "src/nodes/case30.js", 'place: "KD캐피탈 16층 · 위험관리부"'],
  ["dept-arrival-gap", "src/nodes/case31.js", 'memo: ["승인 날짜: 당신이 부서에 오기 사흘 전"]'],
  ["notebook-line-0724", "src/nodes/case45.js", 'text: "자기 수첩의 2023-0412 쪽을 폅니다. 넷째 줄에 7월 24일, 그리고 당신의 이름."'],
  ["erased-consent-pen", "src/nodes/case49.js", "text: \"'뒷장에 동의라고 썼다가 지운 것도 그 펜이거든요.' 만년필 이야기입니다.\""],
  ["erased-consent-pen", "src/nodes/case49.js", "memo: [\"뒷장의 지운 '동의'도 같은 펜\"]"],
  ["nextmile-year", "src/nodes/case48.js", 'memo: ["2023년 넥스트마일 제안: 장부가의 42%"]'],
  ["gaeul-not-mullae", "src/nodes/prologue02.js", 'memo: ["문가을 -- 문래동 떡집, 간판 없음"]'],
  ["gaeul-not-mullae", "src/nodes/prologue02.js", 'role: "문래동 가온정밀 대표 · 문가을의 남편"'],
  ["trainee-after-1021", "src/nodes/prologue02.js", 'text: "초안 회람 확인란 여섯 줄의 마지막은 수습이던 당신의 사번입니다."'],
  ["second-standard-count", "src/nodes/case24.js", 'text: "일자리가 이어진 1,140명, 배상 기준에 들어간 212명."'],
];

test("the lines the audit of 2026-11-03 found go red", () => {
  for (const [id, file, line] of AUDIT_1103) {
    const found = findCanonViolations(line, file).map((item) => item.id);
    assert.ok(found.includes(id), `${id} was not caught in: ${line}`);
  }
  // 한서윤 saying it herself is read only in a scene she speaks.
  const said = (speaker) =>
    findCanonViolations(`      speaker: "${speaker}",\n      text: "'3년 전 당신 반대 의견을 반려한 사람, 저예요. 서명은 제가 했어요.'",`, "src/nodes/case11.js");
  assert.deepEqual(
    said("한서윤").map((item) => item.id),
    ["han-return-sign-voice"],
  );
  assert.deepEqual(said("백아린"), []);
  // 사건 37's one sentence is a 2026 paper she signed (11-03 re-judgement); only
  // the whole sentence is let through, not another that says the same words.
  const island = (text) => findCanonViolations(`      speaker: "한서윤",\n      text: "${text}",`, "src/nodes/case37.js").map((item) => item.id);
  assert.deepEqual(island("당신이 트리거랩에 내려온 첫 주입니다. '저 이 칸에 서명했어요. 첫 장만 읽고요. 당신 반대 의견을 반려할 때처럼요.'"), []);
  assert.deepEqual(island("'저 이 칸에 서명했어요. 당신 반대 의견을 반려할 때처럼요.'"), ["han-return-sign-voice"]);
});

test("the shapes the audit's answers settled on pass, and so do the signatures that are not the return", () => {
  const agreed = [
    ["src/nodes/case08.js", 'memo: ["수령인: 한서윤 (당시 과장)", "같은 해 한서윤이 2023-0412 반대 의견서를 반려"]'],
    ["src/nodes/case23.js", 'echo: "한서윤이 반려 버튼을 누른 기록도 부록에 함께 실립니다."'],
    // 한서윤 signs things as 실장 in 2025-26: no word of the return near them.
    ["src/nodes/case19.js", 'label: "한서윤의 서명을 믿고 오늘 밤은 B2에 둔다"'],
    ["src/nodes/case46.js", 'echo: "진술서는 두 장입니다. 한서윤이 서명란에 이름을 쓰다가 잠깐 멈춥니다."'],
    // Other people sign; only the pair of the two women is the canon's.
    ["src/nodes/case12.js", 'echo: "접수는 빨라집니다. 서명한 사람의 부제소 합의도 그만큼 빨라집니다."'],
    ["src/nodes/case16.js", 'place: "해방촌 이민서의 옥탑방 · 옥상"'],
    ["src/nodes/case25.js", 'text: "KD캐피탈 본사 1층 로비, 취임식 무대 뒤로 벚꽃이 집니다."'],
    ["src/nodes/case26.js", 'place: "KD캐피탈 19층 · 심사위원회 회의실"'],
    ["src/nodes/case30.js", 'place: "KD캐피탈 12층 · 위험관리부"'],
    ["src/nodes/case31.js", 'question: "당신이 오기 열흘 전에 당신 사번으로 예외 승인이 나 있습니다."'],
    ["src/nodes/case45.js", 'memo: ["반재욱 수첩 2023-0412 쪽 여섯째 줄: 7월 24일, 당신 이름"]'],
    // The 만년필 and the erased 'agree' sit in two items of one memo.
    ["src/nodes/case49.js", "memo: [\"임경수의 만년필 -- 지난 심사위원회에도 동행\", \"뒷장의 지운 '동의'는 할아버지의 연필 자국\"]"],
    ["src/nodes/case48.js", 'memo: ["2025년 넥스트마일 제안: 장부가의 42%"]'],
    ["src/nodes/prologue02.js", 'memo: ["인천 남동공단 가온정밀 -- 직원 7명, 선반 6대"]'],
    // Other trainees are trainees, and taking the 딱지 off is the canon's own line.
    ["src/nodes/prologue02.js", 'text: "한서윤, 오진우, 그리고 네 번째 줄부터는 수습 세 명입니다."'],
    ["src/nodes/prologue02.js", 'text: "KD은행 본점 6층, 수습 딱지를 뗀 지 다섯 달 만에 당신 앞으로 두 번째 서류가 옵니다."'],
    ["src/nodes/case47.js", 'text: "서류 없는 212명 가운데 두 번째 기준에 든 181명이 연휴 안에 받습니다."'],
  ];
  for (const [file, line] of agreed) assert.deepEqual(findCanonViolations(line, file), [], line);
  // In 프롤로그 01 the analyst still is a trainee.
  assert.deepEqual(findCanonViolations('text: "수습이던 당신의 마지막 과제입니다."', "src/nodes/prologue01.js"), []);
});

/** A case file's three places for one scene: its body, its opening line, its setting. */
const caseFile = ({ id = "c13_start_rush", text = "", opening = null, place = "본사 33층", clock = "", voice = null }) =>
  [
    "export default {",
    "  nodes: [",
    "    {",
    `      id: "${id}",`,
    `      text: "${text}",`,
    "      choices: [",
    "        {",
    `          id: "${id}_go",`,
    '          label: "다음으로",',
    ...(voice ? [`          voice: "${voice}",`] : []),
    "        },",
    "      ],",
    "    },",
    "  ],",
    "  openingCopy: {",
    ...(opening ? [`    ${id}: ["제목", "윤상혁", "${opening}", ["메모"]],`] : []),
    "  },",
    "  sceneContext: {",
    `    ${id}: {`,
    `      place: "${place}",`,
    `      clock: "${clock}",`,
    "    },",
    "  },",
    "};",
  ].join("\n");

test("a scene is read whole: its body, its opening line and its setting under one id", () => {
  const lines = caseFile({ text: "본문", opening: "오프닝", clock: "D-6", voice: "목소리" })
    .split("\n")
    .map((line, at) => ({ number: at + 1, line, speaker: "" }));
  const scenes = sceneParts(lines);
  assert.deepEqual(
    scenes.get("c13_start_rush").map((part) => part.kind),
    ["text", "label", "voice", "opening", "place", "clock"],
  );
  // A card's own id is not a scene: its label stays with the scene.
  assert.equal(scenes.has("c13_start_rush_go"), false);
  assert.deepEqual(
    SCENE_RULES.map((rule) => rule.id),
    ["dday-days", "floor-move", "first-day-clock"],
  );
});

test("a scene's clock and its own words count to the same day", () => {
  const ids = (options, file = "src/nodes/case13.js") => findCanonViolations(caseFile(options), file).map((item) => item.id);
  const opening = "'촬영은 내일, 생중계는 엿새 뒤예요.'";
  assert.deepEqual(ids({ opening, clock: "배상 입금일 밤 · 출범 생중계까지 D-7" }), ["dday-days"]);
  assert.deepEqual(ids({ opening, clock: "배상 입금일 밤 · 출범 생중계까지 D-6" }), []);
  // A count that does not name the clock's event is the story's past, not the countdown.
  assert.deepEqual(ids({ opening: "그 밤의 예고가, 나흘 뒤 월요일 아침 모니터마다 떴습니다.", clock: "1월 26일 · 에코 교체까지 D-5" }), []);
  // A card does not climb to the floor its scene is on.
  const card = (place) => ids({ id: "p1_ledger_reaction", place, clock: "19시", voice: "인사만 하고 6층으로 올라간다." }, "src/nodes/prologue01.js");
  assert.deepEqual(card("본점 6층 복도"), ["floor-move"]);
  assert.deepEqual(card("본점 1층 로비"), []);
  // The first day at KD캐피탈 is 4월 9일 (목); 4월 2일 is a Thursday too, and wrong.
  const firstDay = (clock) =>
    ids({ id: "c25_firstday", text: "목요일, KD캐피탈 위험관리부 첫 출근입니다.", place: "KD캐피탈 본사 12층 · 위험관리부 회의실", clock }, "src/nodes/case25.js");
  assert.deepEqual(firstDay("4월 9일 · 목요일 09시"), []);
  assert.deepEqual(firstDay("4월 2일 · 목요일 09시"), ["first-day-clock"]);
  // Scenes are read only in the case files.
  assert.deepEqual(findCanonViolations(caseFile({ opening, clock: "생중계까지 D-7" }), "src/caseCopy.js"), []);
});
