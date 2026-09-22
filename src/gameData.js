export { byEffectWeight, cognitionLabels, costWhenRising, initialResources, isResourceGain, triggerLabels } from "./gameConstants.js";
export { characterProfiles, choiceVoiceLines } from "./gameDialogue.js";
export { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, caseObjectives, nodeOrders, seasonCasesBase } from "./gameCases.js";
import { case01Nodes } from "./nodes/case01.js";
import { case02Nodes } from "./nodes/case02.js";
import { case03Nodes } from "./nodes/case03.js";
import { case04Nodes } from "./nodes/case04.js";
import { case05Nodes } from "./nodes/case05.js";
import { case06Nodes } from "./nodes/case06.js";
import { case07Nodes } from "./nodes/case07.js";
import { case08Nodes } from "./nodes/case08.js";
import { case09Nodes } from "./nodes/case09.js";
import { case10Nodes } from "./nodes/case10.js";
import { case11Nodes } from "./nodes/case11.js";
import { finalCaseNodes } from "./nodes/finalCase.js";
import { applySceneContext } from "./nodes/sceneContext.js";
import { authoredEchoReplies, characterProfiles, choiceVoiceLines } from "./gameDialogue.js";
import { CASE_PACKS } from "./nodes/casePacks.js";
import { CASE_SEQUENCE, CASE_START_NODES, nodeOrders, RESULT_NODE_IDS } from "./gameCases.js";

export { CASE_PACKS };

// A case pack's lines and people join the authored tables before anything below
// copies or reads them.
for (const pack of CASE_PACKS) {
  Object.assign(choiceVoiceLines, pack.voiceLines);
  Object.assign(authoredEchoReplies, pack.echoReplies);
  Object.assign(characterProfiles, pack.characterProfiles);
}

/** Authored replies plus one for every scene the generators below add. */
export const echoReplies = { ...authoredEchoReplies };

/**
 * The authored scene graph, one file per case. Everything below this literal
 * grows the graph at load time -- aftermath, connective, reaction and branch
 * scenes are written into `nodes` -- so the composed object stays mutable.
 */
export const nodes = {
  ...case01Nodes,
  ...case02Nodes,
  ...case03Nodes,
  ...case04Nodes,
  ...case05Nodes,
  ...case06Nodes,
  ...case07Nodes,
  ...case08Nodes,
  ...case09Nodes,
  ...case10Nodes,
  ...case11Nodes,
  ...Object.assign({}, ...CASE_PACKS.map((pack) => pack.nodes)),
  ...finalCaseNodes,
};

const aftermathNodes = {
  c1_aftershock: {
    phase: "AFTERMATH",
    title: "다음 날의 급여명세서",
    speaker: "도윤하",
    text: "결정 다음 날, 숫자보다 먼저 사람들의 반응이 도착했습니다. 직원들은 누가 보호받았는지 묻고, 협력사 대표는 당신이 남긴 약속을 다시 읽습니다. 그리고 KD은행 기업금융전략팀에서 한 줄짜리 회신이 왔습니다. '해당 건은 정상 처리로 종결.'",
    memo: ["직원 공지에 서로 다른 해석이 퍼짐", "협력사 대표가 조건 재협상을 요청함", "은행 회신: 정상 처리로 종결, 담당자 서명 없음"],
    triggers: ["protection", "responsibility", "trust"],
    choices: [
      { id: "c1_after_people", label: "직원과 협력사 앞에서 먼저 약속을 설명한다", effect: { trust: 9, legitimacy: 5, fatigue: 5 }, next: "result", cognition: { persistence: 1 } },
      { id: "c1_after_numbers", label: "현금 흐름표를 공개하고 감당할 손실을 정한다", effect: { capital: -6, legitimacy: 9, fatigue: 4 }, next: "result", cognition: { inference: 1, risk: 1 } },
      { id: "c1_after_silence", label: "다음 자금이 들어올 때까지 공개를 늦춘다", effect: { capital: 9, trust: -10, legitimacy: -6, fatigue: 2 }, next: "result", cognition: { risk: 2 } },
    ],
  },
  c2_aftershock: {
    phase: "AFTERMATH",
    title: "누가 기록을 고쳤는가",
    speaker: "에코",
    text: "보고서가 올라간 뒤 원본 기록 한 줄이 사라졌습니다. 이민서를 지목한 기록과 당신이 고른 보고 방식이 같은 손에서 만들어졌을 가능성이 생겼습니다. 삭제 권한을 가진 세 계정 중 하나는 그룹전략실 소속입니다.",
    memo: ["원본과 복사본의 시각이 다름", "이민서 계정은 이미 잠김", "삭제 권한 계정 3개 중 1개는 그룹전략실"],
    triggers: ["trust", "curiosity", "injustice"],
    choices: [
      { id: "c2_after_audit", label: "원본 보관자부터 조사해 기록의 흐름을 복원한다", effect: { time: -7, legitimacy: 9, fatigue: 6 }, next: "case02_result", cognition: { inference: 2 } },
      { id: "c2_after_person", label: "이민서에게 직접 사라진 기록을 묻는다", effect: { trust: 9, legitimacy: -2, fatigue: 5 }, next: "case02_result", cognition: { persistence: 1, reframing: 1 } },
      { id: "c2_after_public", label: "기록 조작 가능성을 즉시 외부에 알린다", effect: { trust: -4, legitimacy: 15, capital: -8, fatigue: 8 }, next: "case02_result", cognition: { risk: 2 } },
    ],
  },
  c3_aftershock: {
    phase: "AFTERMATH",
    title: "승자의 빈 화면",
    speaker: "오진우",
    text: "발표가 끝났지만 점수는 공개되지 않았습니다. 오진우가 묻습니다. 이번 결과가 고객을 위한 것이었는지, 누군가 배점표까지 만들어 놓은 경주에서 이긴 것인지. '그 표, 새벽 두 시에 수정됐더군요. 저도 봤습니다.'",
    memo: ["고객사는 두 안 모두 보류함", "오진우의 원본 제출 시간이 조작됐을 가능성", "보안 결함을 숨긴 쪽이 높은 점수를 받음"],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      { id: "c3_after_share", label: "두 안의 장점을 합쳐 고객에게 다시 제안한다", effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 7 }, next: "case03_result", cognition: { reframing: 2 } },
      { id: "c3_after_proof", label: "점수보다 보안 결함의 증거를 먼저 공개한다", effect: { capital: -8, legitimacy: 15, fatigue: 6 }, next: "case03_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c3_after_win", label: "승리를 확정하고 경쟁자의 허점을 이용한다", effect: { capital: 13, trust: -10, legitimacy: -8, humanCost: 5, fatigue: 3 }, next: "case03_result", cognition: { risk: 2 } },
    ],
  },
  c4_aftershock: {
    phase: "AFTERMATH",
    title: "예외의 청구서",
    speaker: "반재욱",
    text: "지원금 심사 결과보다 먼저 감사 요청서가 도착했습니다. 작은 예외를 허용한 순간, 같은 예외를 기다리던 기관들이 줄을 섰습니다. 그중 여섯 곳의 주거래 은행이 같습니다.",
    memo: ["비슷한 사정의 기관 11곳이 연락함 (그중 6곳 주거래 KD)", "심사관은 해석 기준의 공개를 요구함", "현장 서비스는 당장 멈추지 않았음"],
    triggers: ["order", "responsibility", "reward"],
    choices: [
      { id: "c4_after_rule", label: "예외 조건을 모두 공개하고 새 기준을 만든다", effect: { legitimacy: 13, trust: 7, fatigue: 8 }, next: "case04_result", cognition: { reframing: 2, persistence: 1 } },
      { id: "c4_after_service", label: "서비스를 지키기 위해 같은 예외를 한 번 더 허용한다", effect: { capital: 11, legitimacy: -12, humanCost: -5, fatigue: 5 }, next: "case04_result", cognition: { risk: 2 } },
      { id: "c4_after_stop", label: "감사를 위해 예외 적용을 즉시 중단한다", effect: { capital: -12, legitimacy: 11, humanCost: 10, fatigue: 4 }, next: "case04_result", cognition: { inference: 1 } },
    ],
  },
  c5_aftershock: {
    phase: "AFTERMATH",
    title: "아무도 서명하지 않은 실패",
    speaker: "도윤하",
    text: "실패 원인을 찾는 회의가 열렸지만 누구도 단독 책임을 지지 않았습니다. 회의실 밖에는 조용히 떠난 사람의 자리가 하나 남아 있습니다. 명패에는 검토자 오진우라고 적혀 있습니다.",
    memo: ["각 팀의 결정은 당시 기준으로 합리적이었음", "피해를 먼저 알린 기록은 삭제됨", "책임을 나누면 개선 속도가 느려질 수 있음"],
    triggers: ["responsibility", "protection", "curiosity"],
    choices: [
      { id: "c5_after_owner", label: "내 결정부터 책임지고 개선 작업을 맡는다", effect: { trust: 11, legitimacy: 9, fatigue: 9 }, next: "case05_result", cognition: { persistence: 2 } },
      { id: "c5_after_system", label: "개인 탓 대신 반복을 막는 구조를 다시 설계한다", effect: { legitimacy: 11, trust: 7, capital: -5, fatigue: 8 }, next: "case05_result", cognition: { reframing: 3 } },
      { id: "c5_after_name", label: "가장 큰 실수를 한 사람을 공식 책임자로 세운다", effect: { trust: -12, legitimacy: 5, humanCost: 8, fatigue: 3 }, next: "case05_result", cognition: { risk: 2 } },
    ],
  },
  c6_aftershock: {
    phase: "AFTERMATH",
    title: "다음 날의 빈 의자",
    speaker: "반재욱",
    text: "위원회는 끝났습니다. 오진우의 자리는 치워지지 않았고, 화분은 여전히 물이 넘칩니다. 반재욱이 수첩을 덮고 말합니다. '나는 저 사람을 한 번도 좋아한 적이 없습니다. 그래서 이 결론이 더 불편합니다.'",
    memo: ["오진우의 사직서는 아직 수리되지 않음", "설정값 자료의 열람 요청이 세 건 들어옴", "당신의 프로필도 같은 폴더에 있음"],
    triggers: ["responsibility", "affection", "selfAwareness"],
    choices: [
      { id: "c6_after_stand", label: "그가 돌아올 자리를 남기고 곁에 선다", effect: { trust: 13, legitimacy: 4, capital: -7, fatigue: 7 }, next: "case06_result", cognition: { persistence: 2 } },
      { id: "c6_after_open", label: "두 사람의 설정값을 공개 기록으로 연다", effect: { legitimacy: 15, trust: 5, capital: -9, fatigue: 8 }, next: "case06_result", cognition: { inference: 2, reframing: 1 } },
      { id: "c6_after_name", label: "책임자 이름을 확정하고 사건을 닫는다", effect: { capital: 12, trust: -12, legitimacy: -5, humanCost: 9, fatigue: 3 }, next: "case06_result", cognition: { risk: 2 } },
    ],
  },
  c7_aftershock: {
    phase: "AFTERMATH",
    title: "적용 시각",
    speaker: "한서윤",
    text: "발령이 적용된 아침, 당신의 사원증은 아직 4층 문을 엽니다. 전산 반영이 하루 늦은 겁니다. 한서윤이 커피를 두 잔 들고 와 한 잔을 내려놓습니다. '오늘 하루는 아직 여기 사람입니다. 어디에 쓰시겠습니까.'",
    memo: ["권한 축소가 하루 지연됨", "외부 감사인 회신까지 미정", "도와준 사람들의 이름은 이미 문서에 있음"],
    triggers: ["responsibility", "affection", "choice"],
    choices: [
      { id: "c7_after_stand", label: "이름을 올린 사람들을 먼저 찾아간다", effect: { trust: 14, legitimacy: 4, capital: -6, fatigue: 7 }, next: "case07_result", cognition: { persistence: 2 } },
      { id: "c7_after_open", label: "남은 하루로 외부 감사인에게 원본을 마저 넘긴다", effect: { legitimacy: 15, trust: 4, humanCost: -4, fatigue: 8 }, next: "case07_result", cognition: { inference: 2, reframing: 1 } },
      { id: "c7_after_alone", label: "아무에게도 알리지 않고 조용히 짐을 싼다", effect: { capital: 12, trust: -13, legitimacy: -5, humanCost: 8, fatigue: 3 }, next: "case07_result", cognition: { risk: 2 } },
    ],
  },
  c8_aftershock: {
    phase: "AFTERMATH",
    title: "청산 등기 다음 날",
    speaker: "나준혁",
    text: "해온파트너스의 청산은 결국 등기됐습니다. 계좌는 닫혔고 흔적표는 당신 손에 남았습니다. 퇴근길, 나준혁 지점장이 오징어순대 한 접시를 시켜 놓고 말합니다. '나는 여기서 30년 동안 본점 사람들 욕만 했지, 뭘 해 본 적은 없어요. 그 반려된 세 건, 내가 도장 찍었던 거예요.' 그가 젓가락을 내려놓습니다. '이번엔 내 도장도 찍을게요.'",
    memo: ["해온파트너스 법인 청산 등기 완료", "지점장이 과거 반려 서명을 스스로 밝힘", "오진우는 서울에서 연락이 끊김", "흔적표 원본은 당신과 반재욱 두 사람만 가짐"],
    triggers: ["revenge", "responsibility", "affection"],
    choices: [
      { id: "c8_after_law", label: "지점장의 도장까지 받아 흔적표를 공식 기록으로 만든다", effect: { legitimacy: 14, trust: 5, capital: -7, fatigue: 7 }, next: "case08_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c8_after_friend", label: "연락이 끊긴 오진우부터 찾으러 서울로 올라간다", effect: { trust: 13, humanCost: -5, time: -8, fatigue: 8 }, next: "case08_result", cognition: { persistence: 2 } },
      { id: "c8_after_blade", label: "흔적표를 혼자 쥐고 쓸 때를 기다린다", effect: { capital: 11, time: 6, trust: -12, legitimacy: -6, humanCost: 6, fatigue: 3 }, next: "case08_result", cognition: { risk: 2 } },
    ],
  },
  c9_aftershock: {
    phase: "AFTERMATH",
    title: "야간조의 아침",
    speaker: "강태민",
    text: "결의가 끝난 다음 날 새벽 네 시, 플로우온 풀필먼트센터(물건을 보관하고 포장해 내보내는 물류 창고). 사건 01의 그날 밤 컵라면을 뜯어 주던 야간조 반장 강태민이 당신을 알아봅니다. '낮에 오라니까.' 그가 웃으며 컵라면 두 개에 물을 붓습니다. 회사 이름은 바뀔지 모르지만 오늘 새벽에도 상자는 옮겨집니다. 삼 분을 기다리는 동안 그가 묻습니다. '이제 어디로 가요.'",
    memo: ["채권단 결의 결과가 현장에 공지됨", "야간조 38명 전원 출근", "권도현이 출근 명단 사본을 요청함", "영동지점 복귀 명령은 아직 유효"],
    triggers: ["affection", "protection", "responsibility"],
    choices: [
      { id: "c9_after_stay", label: "고용 승계가 끝날 때까지 현장 합의 자리를 지킨다", effect: { trust: 14, humanCost: -6, capital: -6, fatigue: 8 }, next: "case09_result", cognition: { persistence: 2 } },
      { id: "c9_after_court", label: "법정과 검사반에서 끝까지 증언하러 간다", effect: { legitimacy: 15, trust: 4, time: -6, fatigue: 8 }, next: "case09_result", cognition: { inference: 2, reframing: 1 } },
      { id: "c9_after_return", label: "컵라면을 다 먹고 조용히 영동지점으로 돌아간다", effect: { capital: 11, time: 7, trust: -11, legitimacy: -5, humanCost: 7, fatigue: 2 }, next: "case09_result", cognition: { risk: 2 } },
    ],
  },
  c10_aftershock: {
    phase: "AFTERMATH",
    title: "여섯 개의 칸",
    speaker: "도윤하",
    text: "분담표가 붙은 첫 주말, 트리거랩 4층은 조용합니다. 도윤하가 자기 칸의 이름 하나에 오늘 처음으로 '해결'이라고 적고, 펜을 놓고, 한참 그 줄을 봅니다. '3년 동안 이걸 혼자 적었는데요. 오늘은 다섯 명이 같은 칸을 적었어요.' 창밖은 아직 밝습니다. 정시에 퇴근해 본 적이 언제인지 두 사람 다 기억하지 못합니다.",
    memo: ["첫 주 처리 34건 -- 혼자 하던 3년 평균의 여섯 배", "212명 명단은 아직 어느 제도에도 없음", "그룹전략실이 분담표 사본을 요청함", "본사 33층에서 당신을 호출함"],
    triggers: ["affection", "system", "selfAwareness"],
    choices: [
      { id: "c10_after_rest", label: "오늘은 정시에 불을 끄고 여섯 명 다 퇴근시킨다", effect: { trust: 13, humanCost: -7, capital: -3, fatigue: -9 }, next: "case10_result", cognition: { reframing: 2 } },
      { id: "c10_after_record", label: "분담표를 그룹 공식 제도안으로 제출한다", effect: { legitimacy: 16, trust: 3, time: -4, humanCost: 4, fatigue: 4 }, next: "case10_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c10_after_keep", label: "212명 명단만은 넘기지 않고 내 서랍에 남긴다", effect: { capital: 9, trust: 7, legitimacy: -10, humanCost: 6, fatigue: 3 }, next: "case10_result", cognition: { risk: 2 } },
    ],
  },
  c11_aftershock: {
    phase: "AFTERMATH",
    title: "여의도 포장마차",
    speaker: "강태민",
    text: "국정감사가 끝난 밤, 여의도 한강공원 앞 포장마차. 참고인 발언 영상은 저녁 뉴스 세 곳에 나갔고, 오진우 부자는 같은 테이블 끝에서 말없이 어묵 국물을 나눠 마십니다. 강태민이 처음으로 컵라면 대신 떡볶이를 삽니다. '오늘은 컵라면 말고 제대로 된 거 먹읍시다.' 나준혁이 단추 떨어진 정장 얘기를 세 번째로 꺼내고, 도윤하는 웃다가 울다가 다시 웃습니다. 그때 모두의 휴대폰이 동시에 울립니다. KD금융그룹 그룹전략실. 윤상혁 상무가 오늘 오후 귀국했고, 내일 아침 본사 33층에서 당신을 보자고 합니다.",
    memo: ["참고인 발언 영상 하루 조회수 380만", "오진우 부자, 3년 만에 같은 테이블", "윤상혁 상무 오늘 오후 귀국", "본사 33층 면담 요청: 내일 09:00"],
    triggers: ["affection", "trust", "choice"],
    choices: [
      { id: "c11_after_toast", label: "오늘 밤은 휴대폰을 엎어 두고 끝까지 같이 먹는다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -9 }, next: "case11_result", cognition: { reframing: 2 } },
      { id: "c11_after_record", label: "영상 대신 속기록 전문을 공개한다", effect: { legitimacy: 16, trust: 3, time: -4, capital: -3, fatigue: 5 }, next: "case11_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c11_after_summon", label: "지금 바로 33층 면담에 응하겠다고 답한다", effect: { capital: 9, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 6 }, next: "case11_result", cognition: { risk: 2 } },
    ],
  },
  f_aftershock: {
    phase: "LAST EVIDENCE",
    title: "당신의 선택이 사용되는 밤",
    speaker: "에코",
    text: "마지막 폴더가 열리자, 트리거랩이 당신의 선택을 다음 참가자의 선택지로 복사해 쓰고 있었다는 사실이 드러납니다. 서식 하단에는 수신처가 인쇄돼 있습니다. 그룹전략실 인사기획. 이제 결말은 실험을 끝내는 방식에 달렸습니다.",
    memo: ["당신의 선택 문장이 다음 테스트의 선택지로 복제됨", "단서가 많을수록 실험 설계자 이름에 가까워짐", "외부 공개와 내부 개혁 모두 누군가의 피해를 요구함"],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      { id: "f_after_witness", label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다", effect: { legitimacy: 13, trust: 5, humanCost: -4, fatigue: 8 }, next: "final_result", cognition: { inference: 2, persistence: 1 } },
      { id: "f_after_control", label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다", effect: { trust: 11, legitimacy: 9, fatigue: 10 }, next: "final_result", cognition: { reframing: 3 } },
      { id: "f_after_burn", label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다", effect: { legitimacy: 7, trust: -6, humanCost: 4, fatigue: 5 }, next: "final_result", cognition: { risk: 2 } },
    ],
  },
};

CASE_PACKS.forEach((pack) => Object.assign(aftermathNodes, pack.aftermath));
Object.assign(nodes, aftermathNodes);

const aftermathRoutes = {
  final: "c1_aftershock",
  c2_final: "c2_aftershock",
  c3_final: "c3_aftershock",
  c4_final: "c4_aftershock",
  c5_final: "c5_aftershock",
  c6_final: "c6_aftershock",
  c7_final: "c7_aftershock",
  c8_final: "c8_aftershock",
  c9_final: "c9_aftershock",
  c10_final: "c10_aftershock",
  c11_final: "c11_aftershock",
  f_choice: "f_aftershock",
};

CASE_PACKS.forEach(({ aftermathRoute: [finalId, aftershockId] }) => {
  aftermathRoutes[finalId] = aftershockId;
});

Object.entries(aftermathRoutes).forEach(([nodeId, nextNode]) => {
  nodes[nodeId].choices.forEach((choice) => {
    choice.next = nextNode;
  });
});

nodeOrders.case01.push("c1_aftershock");
nodeOrders.case02.push("c2_aftershock");
nodeOrders.case03.push("c3_aftershock");
nodeOrders.case04.push("c4_aftershock");
nodeOrders.case05.push("c5_aftershock");
nodeOrders.case06.push("c6_aftershock");
nodeOrders.case07.push("c7_aftershock");
nodeOrders.case08.push("c8_aftershock");
nodeOrders.case09.push("c9_aftershock");
nodeOrders.case10.push("c10_aftershock");
nodeOrders.case11.push("c11_aftershock");
CASE_PACKS.forEach((pack) => nodeOrders[pack.id].push(pack.aftermathRoute[1]));
nodeOrders.final.push("f_aftershock");

const connectiveScenes = [
  ["c1_witness", "accounting", "payday", "누가 179.6을 만들었나", "반재욱", "회계팀 막내가 회의실 문 앞에서 멈춰 섰습니다. 장부가 틀렸다고 말하지는 않습니다. 대신 그 숫자를 만들던 날 회의실에 은행 사람이 앉아 있었다고 말합니다. 명함은 못 받았습니다.", ["원본 파일은 세 번 저장됨", "막내 직원은 회의 초대를 받지 못함", "재무책임자의 지시는 구두로만 남음", "그날 회의 참석자 명단에 외부인 1명 누락"], ["직원을 보호하며 증언할 자리를 만든다", "원본 파일을 먼저 잠가 증거를 보존한다", "말이 퍼지기 전에 CFO와 비공개로 합의한다"]],
  ["c1_assembly", "payday", "competitor", "급여일 전의 약속", "도윤하", "급여일 아침을 버티려면 돈만 필요한 것이 아닙니다. 직원들은 회사가 무엇을 숨기고 있는지보다, 내일도 자신이 이곳에 있을지 알고 싶어 합니다.", ["야간조 대표가 공동 공지를 요구함", "협력사 세 곳이 같은 지급 기준을 요구함", "임원진은 개인 보수를 먼저 공개하길 꺼림"], ["직원 대표와 함께 공개 약속을 만든다", "지급 순서를 숫자로 고정한다", "임원진만 아는 임시 합의를 만든다", "임원 보수를 먼저 깎아 줄 돈을 마련한다"]],
  ["c1_bargain", "competitor", "board", "팔리지 않은 자리", "오진우", "넥스트마일의 협상안에는 빈칸이 하나 있습니다. 인수하지 않을 사업부, 남겨질 직원, 협력사 중 누가 그 빈칸을 채울지 아무도 쓰지 않았습니다.", ["인수 조건에 책임 주체가 없음", "협력사는 매각보다 지급 보장을 원함", "오진우는 승률을 높이는 문장만 골라냄"], ["빈칸을 채운 뒤에만 협상한다", "가장 약한 쪽의 조건부터 반영한다", "빈칸을 남겨 빠르게 사인한다"]],
  ["c1_verdict", "board", "final", "판결이 아닌 선택", "에코", "모든 자료가 테이블 위에 올라왔지만 결론은 더 멀어졌습니다. 이제 당신의 선택은 회사를 설명하는 문장이 아니라, 누가 내일의 비용을 들 것인지 정하는 문장입니다.", ["직원·협력사·투자자의 요구가 동시에 도착함", "한쪽을 살리면 다른 쪽의 신뢰가 줄어듦", "반응 패턴이 다음 사건으로 전송될 예정"], ["가장 약한 사람의 손실부터 줄인다", "살아남을 돈을 먼저 확보한다", "결정의 책임과 근거를 모두 공개한다"]],
  ["c2_trace", "c2_logs", "c2_meeting", "사라진 11초", "임경수", "퇴직한 전 심사팀장이 헌책방 2층에서 끈으로 묶은 서류를 풀어 놓습니다. 접속 기록에는 11초의 빈틈이 있고, 그 11초에 바뀐 페이지가 그의 종이 사본에는 그대로 남아 있습니다. '전산은 고치면 그만이지만 종이는 태워야 하거든. 태운 자리는 표가 나고.'", ["종이 사본에만 남은 3페이지 하단", "이민서 계정은 빈틈 직전에 사용됨", "보안팀은 빈틈을 단순 오류라고 주장함", "임경수는 이 사본을 4년째 보관 중"], ["11초를 기술적으로 재현한다", "이민서에게 그 시간의 행동을 묻는다", "오류로 처리하고 보고 시간을 지킨다"]],
  ["c2_witness", "c2_meeting", "c2_pressure", "이민서의 침묵", "도윤하", "이민서는 자신을 변호하지 않습니다. 대신 누가 그 파일을 받았는지보다, 왜 하필 서명란이 빈 3페이지만 정리하라는 지시가 내려왔는지부터 물어봅니다.", ["스캔 정리 지시는 구두로만 내려옴", "지시받은 범위는 3페이지 한 장뿐", "이민서는 그 페이지를 읽지 않고 처리함", "재계약 심사까지 2주"], ["이민서의 안전을 먼저 확보한다", "파일의 이동 경로만 추적한다", "침묵을 의심 신호로 기록한다", "이민서와 조건을 걸고 거래한다"]],
  ["c2_judgment", "c2_pressure", "c2_final", "보고서 밖의 사람", "한서윤", "보안팀은 결론을 요구하지만, 이민서의 동료들은 보고서에 없는 사실을 알고 있습니다. 공식 기록과 사람의 기억 중 하나만 고를 수는 없습니다.", ["동료 두 명이 익명 증언을 제출함", "1차 보고 마감까지 18분", "외부 기업은 유출 사실을 부인함"], ["익명 증언을 공식 부록으로 붙인다", "기록에 없는 정보는 보류한다", "외부 기업과 먼저 대면한다"]],
  ["c3_rival", "c3_split", "c3_score", "같은 자료, 다른 목적", "오진우", "오진우는 당신의 자료에 없는 숫자를 들고 왔습니다. 고객이 실제로 원하는 것은 비용 절감이 아니라 실패했을 때 책임질 사람이라는 사실입니다.", ["고객사는 책임 조항을 비공개로 요구함", "경쟁안은 책임을 하청사로 넘김", "보안팀은 발표에서 빠져 있음"], ["책임 조항을 앞에 세운다", "비용표부터 다시 계산한다", "오진우에게 없는 숫자의 출처를 묻는다"]],
  ["c3_signal", "c3_score", "c3_trap", "관객석의 신호", "에코", "발표장 뒤편의 불이 두 번 깜빡였습니다. 고객 신호인지 트리거랩의 시험인지 알 수 없지만, 오진우는 그 신호를 보고 답을 바꿉니다.", ["불빛은 보안 경고와 같은 주기임", "고객 대표는 신호를 부인함", "오진우의 응답 시간이 비정상적으로 짧아짐"], ["신호를 공개 질문으로 바꾼다", "발표를 멈추고 보안부터 확인한다", "상대보다 먼저 결론을 밀어붙인다", "오진우와 신호의 해석을 나눠 갖는다"]],
  ["c3_verdict", "c3_trap", "c3_final", "승부의 끝에서", "한서윤", "당신은 이제 오진우보다 빠르거나 느린 사람이 아닙니다. 어떤 기준으로 승부를 끝낼지 정하는 사람입니다.", ["고객사는 오늘 안에 결론을 원함", "보안 결함은 아직 완전 증명 전", "공동 발표를 하면 책임은 나뉨"], ["검증을 끝낸 뒤 발표한다", "공동 책임으로 발표한다", "불확실성을 숨기고 승리를 확정한다"]],
  ["c4_audit", "c4_offer", "c4_leak", "3%의 주인", "반재욱", "부족한 3%는 단순한 숫자가 아니었습니다. 그 숫자를 만든 결정과, 그 숫자 때문에 서비스를 잃는 사람의 이름이 서로 다른 서류에 적혀 있습니다. 한쪽 서류의 서명란은 비어 있습니다.", ["계산 공식에는 현장 업무가 빠져 있음", "심사 기준은 2년 전 자료에 고정됨", "상환 일정 변경 요청서의 서명란은 공란", "서비스 이용자 대표가 발언을 요청함"], ["이용자 대표의 기준을 반영한다", "산식 변경 이력을 남긴다", "3%를 조용히 보정한다"]],
  ["c4_public", "c4_leak", "c4_vote", "기자가 기다리는 문장", "도윤하", "기자는 아직 기사를 쓰지 않았습니다. 다만 당신이 어떤 표현을 선택하는지에 따라 내일의 제목이 정해질 것이라고 말합니다.", ["제보 메일은 내부에서 시작됨", "온새는 서비스 중단을 막고 싶어 함", "심사관은 공개 설명을 요구함"], ["사실과 모르는 것을 함께 공개한다", "서비스 이용자 피해를 먼저 알린다", "기사에 나갈 표현을 최소화한다", "기사 시점을 늦추는 대신 전량 공개를 약속한다"]],
  ["c4_verdict", "c4_vote", "c4_final", "선의의 증거", "에코", "좋은 의도는 증거가 되지 않습니다. 하지만 좋은 결과만을 위해 규칙을 늘리면, 다음 사람은 그 규칙을 이용할 수 있습니다.", ["이사회는 오늘 결정을 요구함", "감사 자료는 공개 가능함", "서비스 이용자 4,200명이 결과를 기다림"], ["예외를 공개된 조건으로 묶는다", "규칙을 지키고 서비스를 포기한다", "결과가 좋다면 기록은 나중에 설명한다"]],
  ["c5_pattern", "c5_map", "c5_blame", "실패가 움직인 경로", "반재욱", "지도 위의 화살표가 한 사람에게 모이지 않습니다. 모든 화살표가 서로의 합리적인 선택을 통과해 같은 곳에 도착했습니다.", ["각 팀은 다른 팀의 정보를 보지 못함", "가장 먼저 위험을 말한 기록이 누락됨", "책임표에는 승인자만 남아 있음"], ["정보가 막힌 지점을 먼저 고친다", "승인자에게 책임을 집중한다", "피해가 큰 부서부터 보상한다"]],
  ["c5_voice", "c5_blame", "c5_collapse", "이름 없는 증언", "도윤하", "누군가가 회의실 밖에서 말합니다. 자신은 결정권자가 아니었지만, 실패를 가장 먼저 보았다고 합니다.", ["증언자는 기록에서 빠져 있음", "말하면 팀 전체가 조사받을 수 있음", "피해자들은 책임자 이름보다 회복을 요구함"], ["증언자를 보호하고 기록을 복원한다", "공식 책임자 발표를 먼저 한다", "보상안을 만들고 조사를 미룬다", "증언자의 고용을 내 권한으로 보장한다"]],
  ["c5_verdict", "c5_collapse", "c5_final", "책임의 모양", "한서윤", "실패를 설명하는 방법은 세 가지입니다. 사람을 지목하거나, 구조를 고치거나, 피해를 먼저 되돌리는 것. 어느 것도 공짜는 아닙니다.", ["개선 예산은 한정됨", "책임 발표를 기다리는 언론", "피해 복구팀이 즉시 출범할 수 있음"], ["내 결정부터 공개한다", "반복을 막는 구조에 투자한다", "피해 복구를 가장 먼저 시작한다"]],
  ["c6_kitchen", "c6_desk", "c6_logs", "탕비실의 세 사람", "도윤하", "탕비실에서 반재욱이 오진우의 머그컵을 씻고 있습니다. '증거물 아닙니까' 하고 도윤하가 묻자 그는 '커피 자국은 증거가 아닙니다' 하고 답합니다. 셋 다 웃지 않지만, 아무도 먼저 나가지 않습니다.", ["그를 아는 사람이 생각보다 많음", "머그컵은 결국 씻겼음", "위원회 자료는 아직 한 줄도 쓰지 못함"], ["여기서 나눈 이야기를 자료에 넣는다", "이 자리는 기록 밖에 두고 자료는 따로 쓴다", "자리를 끝내고 각자 일로 돌아간다"]],
  ["c6_family", "c6_logs", "c6_panel", "누나의 전화", "한서윤", "오진우의 누나가 회사로 전화했습니다. 동생이 승진했다고 들었는데 축하 자리를 언제 하느냐고 묻습니다. 그 승진은 사건 03 직후의 일이고, 그때부터 그의 결정 창이 줄기 시작했습니다.", ["가족은 아무것도 모름", "승진 시점과 조건 변경 시점이 같음", "통화는 30초 만에 끝났음"], ["가족에게 사실대로 알린다", "회사 공식 창구로 안내한다", "지금은 아무 말도 하지 않는다"]],
  ["c6_ledger", "c6_panel", "c6_final", "두 장의 프로필", "에코", "위원회 직전, 에코가 두 장의 프로필을 나란히 띄웁니다. 왼쪽은 오진우, 오른쪽은 당신입니다. 축소된 창과 늘어난 창이 같은 그래프의 위아래로 그려집니다. 에코가 말합니다. '둘 중 하나는 대조군입니다.'", ["두 프로필의 실험 번호가 동일", "대조군이 누구인지는 표시되지 않음", "위원회 시작까지 10분"], ["두 장을 함께 위원회에 낸다", "내 것만 빼고 그의 것을 낸다", "둘 다 덮고 사실관계로만 간다"]],
  ["c7_receipt", "c7_ledger", "c7_counter", "영수증", "반재욱", "택시비를 반으로 나누자며 반재욱이 영수증을 찢어 반쪽을 내밉니다. 마흔한 명을 자른 사람이 4,300원을 두고 실랑이를 합니다. '기록에 남길 수 없는 건 안 받습니다.' 그는 농담을 한 적이 없고, 이번에도 농담이 아닙니다.", ["반쪽 영수증에 그의 서명이 있음", "그는 아직 수첩을 가방에서 꺼내지 않음", "감사팀 서고 출입 기록은 이미 남았음"], ["그의 방식대로 반씩 나눠 적는다", "영수증을 받아 내 경비로 처리한다", "그냥 넘기고 시간을 아낀다"]],
  ["c7_teller", "c7_counter", "c7_paper", "창구 4번", "도윤하", "지점을 나오는 길에 4번 창구의 노년 행원이 도윤하를 부릅니다. '도 대리, 아직 그 말버릇 있네.' 3년 전 함께 앉아 있던 사람입니다. 그는 묻지도 않고 서랍에서 그해 목표표 사본을 꺼내 놓습니다. 자기 이름이 적힌 쪽을 접어서 밀어 줍니다.", ["4번 창구 행원은 당시 같은 팀", "사본은 지점 자체 보관본", "그는 내년이 정년"], ["접힌 쪽을 펴서 그의 이름도 함께 쓴다", "접힌 그대로 받아 이름은 가린다", "사본은 두고 원본 절차만 밟는다"]],
  ["c7_ticket", "c7_paper", "c7_final", "기차표", "에코", "에코가 조용히 한 줄을 띄웁니다. 총무팀이 이미 발권한 편도 기차표. 출발 06:40, 강릉행. 승인자 칸에는 이번에도 아무도 없습니다. '시스템은 당신이 갈 것이라고 계산했습니다. 계산은 대개 맞습니다.'", ["편도 기차표가 발령 적용 전에 발권됨", "승인자 칸 공란", "표는 취소해도 기록은 남음"], ["표를 취소하고 그 기록을 증거로 남긴다", "표는 그대로 두고 자료를 먼저 보낸다", "표를 받아 두고 오늘은 아무 말도 안 한다"]],
  ["c8_sundae", "c8_trail", "c8_gallery", "오징어순대", "나준혁", "점심시간, 지점장이 시장 골목 오징어순대 집으로 당신을 데려갑니다. 그는 세 번 반려된 보고서 얘기는 한 마디도 하지 않고, 순대를 달걀물에 찍는 순서만 설명합니다. '서울 사람들은 이걸 그냥 먹어요. 그러니까 맛을 모르지.' 계산할 때 그가 영수증 뒷면에 전임자의 휴대폰 번호를 적어 줍니다.", ["전임자는 2년 전 명예퇴직", "지점장은 반려 사유를 기억한다고 말함", "영수증 뒷면에 적힌 번호 하나"], ["전임자에게 바로 전화를 걸어 사정을 듣는다", "번호는 받아 두고 반려 기록부터 확인한다", "오늘은 묻지 않고 순대 맛만 칭찬하고 넘어간다"]],
  ["c8_mother", "c8_gallery", "c8_bait", "반찬통", "도윤하", "도윤하에게서 전화가 옵니다. 오진우의 어머니가 트리거랩 로비에 반찬통을 들고 찾아왔다고 합니다. 아들이 회사를 그만둔 걸 모르고, 요즘 밤마다 옛 서류를 뒤진다며 걱정합니다. '그 애 아버지도 그만두기 전에 꼭 저랬어요.' 도윤하가 조용히 묻습니다. '뭐라고 말씀드릴까요.'", ["어머니는 아들의 퇴사를 모름", "오진우의 아버지도 퇴직 직전 같은 행동을 보임", "도윤하는 거짓말은 하지 않겠다고 함"], ["오진우에게 전화해 어머니께 직접 말하게 한다", "회사 규정대로 퇴사 사실만 확인해 드린다", "잘 지낸다고만 전하고 반찬통은 대신 받아 둔다"]],
  ["c8_clerks", "c8_bait", "c8_final", "도장 찍은 사람", "반재욱", "갤러리 온의 직원 둘이 퇴근길에 반재욱을 붙잡습니다. 그림값 송금 서류에 도장을 찍은 사람이 자기들이라고, 윗선이 무너지면 자기들 이름만 남는다고. 스물여섯, 스물아홉. 한 사람은 아직 수습 기간입니다. 반재욱이 수첩을 덮습니다. '내가 자른 마흔한 명이 대개 이 나이였습니다.'", ["송금 실무 도장은 직원 2명 명의", "한 명은 수습 3개월째", "두 사람은 협조 의사를 밝힘"], ["두 사람을 협조자로 보호할 방법부터 만든다", "진술서를 받고 절차대로 참고인으로 올린다", "실무자는 빼고 윗선의 흔적만 쓴다"]],
  ["c9_calc", "c9_ledger", "c9_family", "계산기 두 대", "권도현", "카페 문이 닫힐 무렵, 권도현이 계산기를 하나 더 꺼냅니다. '각자 자기 입장에서 계산해 봅시다. 숫자가 같게 나오면 그때부터 믿겠습니다.' 둘이 20분 동안 말없이 두드립니다. 결과는 3억 차이. 권도현이 처음으로 웃습니다. '그 차이가 선의입니까, 실수입니까.'", ["두 계산 결과의 차이 3억", "차이는 직원 퇴직금 산정 방식에서 발생", "권도현은 차이의 이유를 요구함"], ["차이 3억을 직원 퇴직금 쪽으로 맞춘다", "산정 기준표를 꺼내 한 줄씩 대조한다", "차이는 반올림 오차로 처리하고 넘어간다"]],
  ["c9_wedding", "c9_family", "c9_timing", "청첩장", "도윤하", "권도현의 휴대폰 잠금화면에 청첩장이 떠 있습니다. 다음 달, 혼주석 옆에 작은아버지 부부 자리가 이미 잡혀 있습니다. 도윤하가 그 화면을 보고 커피를 사러 나갔다가, 한참 뒤에 세 잔을 들고 들어옵니다. '제일 단 걸로 샀어요. 오늘은 그래도 되는 날 같아서요.'", ["권도현 결혼식 5주 뒤", "혼주석 배치에 권승우 부부 포함", "고발하면 결혼식 전에 기사가 날 수 있음"], ["결혼식 뒤로 고발 시점을 옮길 수 있는지 함께 따져 본다", "일정과 상관없이 고발 절차 시간표를 그대로 둔다", "그 얘기는 꺼내지 않고 오늘 일만 끝낸다"]],
  ["c9_night", "c9_timing", "c9_final", "새벽 두 시의 사무실", "한서윤", "새벽 두 시, 트리거랩 4층. 한서윤이 진술서를 인쇄하다가 프린터 앞에서 멈춥니다. 오진우는 소파에서 잠들었고, 반재욱은 그 위에 자기 재킷을 덮어 줍니다. 도윤하는 컵라면 물을 올립니다. 한서윤이 작게 말합니다. '이 방에서 다섯 사람이 같은 편으로 앉아 있는 걸, 저는 처음 봅니다.'", ["한서윤 진술서 인쇄 완료", "검사반 제보 마감까지 7시간", "다섯 사람이 같은 파일을 보고 있음"], ["잠든 사람은 깨우지 않고 남은 일을 나눠 맡는다", "제보 서류를 체크리스트대로 한 번 더 검토한다", "오늘은 여기까지 하고 각자 집으로 보낸다"]],
  ["c10_ward", "c10_locker", "c10_claim", "깨어난 십 분", "도윤하", "도윤하가 십 분 정도 깹니다. 자기 상태는 묻지 않습니다. '1,128명 파일요. 폐기되나요.' 그리고 처음으로 이유를 말합니다. '저 강서지점에서 실적 1위 두 번 했어요. 상 받고 사진도 찍었고요. 그 실적이 전부 저 명단이에요. 제가 판 겁니다. 제가 세야죠.' 말을 마치고 다시 잠듭니다.", ["초과근무 3년치 4,180시간", "그중 명단 관련 2,940시간", "실적 1위 표창 2회 -- 2023년, 2024년", "의료진 소견: 최소 4주 절대 안정"], ["폐기는 막았다고 먼저 안심시킨다", "지금은 아무 말도 하지 말라고 한다", "명단의 실제 상태를 사실대로 말한다"]],
  ["c10_pills", "c10_claim", "c10_relay", "열아홉 명", "한서윤", "한서윤이 인사 기록부를 엽니다. 최근 3년, 트리거랩과 강서지점에서 같은 사유로 병가를 낸 사람이 열아홉 명입니다. 사유란은 전부 '개인 사정'입니다. 그가 화면을 한 줄 더 내리다가 멈춥니다. 열아홉 명 중 한 명이 한서윤 본인입니다. 2년 전, 2주.", ["같은 사유 병가 19건 -- 전부 개인 사정으로 기록", "19명 중 현재 재직자는 11명", "한서윤 본인이 그중 한 명", "집단 심의로 묶으면 제도 결함이 쟁점이 됨"], ["열아홉 명을 한 건으로 묶어 집단 심의를 요구한다", "한서윤의 기록은 빼고 열여덟 명으로 간다", "개별 심의가 빠르다며 도윤하 건만 먼저 끝낸다"]],
  ["c10_ledger", "c10_relay", "c10_final", "여섯 장의 손익계산서", "권도현", "오진우가 권도현을 불렀습니다. 그가 분담표를 보더니 빈 종이에 세로줄을 긋습니다. '여섯 칸 다 채우십시오. 잃는 것 칸이 비면 이 표는 반년 안에 무너집니다. 선의로 시작한 표가 무너지는 걸 저는 집안에서 봤습니다.' 다섯 칸이 채워집니다. 강태민은 야간 수당, 이민서는 계약 갱신 평가, 나준혁은 정년퇴직까지 2년, 임경수는 조용함, 오진우는 승진 순번. 여섯 번째 칸이 비어 있습니다.", ["여섯 명 중 넷은 이 일로 얻는 것이 없음", "권도현: 잃는 것이 적힌 표만 오래 간다", "당신의 칸은 아직 공란", "표가 무너지면 1,128명이 다시 한 사람에게 돌아감"], ["내 칸에 승진과 복귀를 잃는다고 적는다", "잃을 것이 없다고 적고 표를 넘긴다", "여섯 칸을 모두 공개하고 서로 검토하게 한다"]],
  ["c11_press", "c11_script", "c11_rehearsal", "부재중 전화 스물세 통", "서하린", "밤 열 시, 리드라인 기자 서하린이 의원회관 앞 편의점으로 찾아옵니다. 당신 휴대폰에는 그의 부재중 전화가 스물세 통 쌓여 있습니다. 그가 컵라면 두 개에 물을 붓고 하나를 밀어 줍니다. '기사에 틀린 게 하나 있어요. 제보자가 그렇게 말해서 A씨를 여성이라고 썼거든요. 고칠까요, 그냥 둘까요? 그냥 두면 당신은 조금 더 숨을 수 있어요.' 편의점 직원이 두 사람을 번갈아 보다가, 텔레비전 볼륨을 슬쩍 줄입니다. 화면에는 그 기사가 나오고 있습니다.", ["기사 속 A씨의 성별이 틀리게 적힘", "그대로 두면 신원 추적이 며칠 늦어짐", "고치면 기사 신뢰도는 올라가고 당신은 드러남"], ["틀린 건 고쳐 달라고 하고 드러나는 쪽을 택한다", "국정감사 날까지만 그대로 두자고 부탁한다", "기사 내용은 기자 판단에 맡기고 선을 긋는다"]],
  ["c11_father", "c11_rehearsal", "c11_sign", "방청권 한 장", "오진우", "리허설이 끝나고 오진우가 계단참에서 휴대폰을 오래 봅니다. 국정감사 방청권(회의를 지켜볼 수 있는 입장권) 신청 명단에 '오상철'이라는 이름이 있습니다. 3년 전 승인을 하루 늦춰 지점에서 밀려난 그의 아버지입니다. 부자는 2년째 명절에도 통화하지 않았습니다. '아버지가 거길 왜 오시는지 모르겠어요. 제가 틀렸다는 걸 보러 오시는 건지, 자기가 옳았다는 걸 보러 오시는 건지.' 그가 웃으려다 그만둡니다.", ["방청 신청 명단에 오상철", "오진우 부자, 2년째 연락 없음", "오상철: 3년 전 승인을 하루 늦춘 지점장"], ["출석 전날 두 사람이 같이 밥을 먹게 자리를 만든다", "방청석 자리를 오진우 옆으로 바꿔 준다", "아버지 일은 오진우가 정하게 두고 묻지 않는다"]],
  ["c11_eve", "c11_sign", "c11_final", "여섯 시 사십 분", "도윤하", "출석 날 새벽 여섯 시 사십 분, 국회 앞 횡단보도. 도윤하가 보온병을 들고 먼저 와 있습니다. 강태민이 야간조를 마치고 형광 조끼 차림 그대로 합류하고, 나준혁은 단추를 새로 단 정장을 입고 와서 모두에게 보여 줍니다. 도윤하가 종이컵에 보리차를 따르다 손을 떱니다. '오늘 제 이름도 나올 거예요. 판 사람으로요. 괜찮아요. 3년 동안 그 말을 제일 많이 한 사람이 저니까.' 신호가 바뀌고, 아무도 먼저 건너지 않습니다.", ["참고인 출석 3시간 전", "도윤하: 판매 당사자로 언급될 가능성", "방청 신청 7명 전원 도착"], ["도윤하의 이름이 나오면 내가 먼저 받아서 답하겠다고 한다", "판 사람과 팔게 만든 구조를 나눠서 말하자고 정한다", "오늘은 도윤하가 방청석에 오지 않는 게 낫다고 말한다"]],
  ["f_witness", "f_archive", "f_confront", "첫 번째 참가자", "도윤하", "보관소 안에는 당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그 사람은 자신의 반응이 다른 사람의 선택지를 만드는 데 쓰였다는 사실을 몰랐습니다.", ["이전 참가자의 동의 기록이 없음", "선택 문장이 다음 사건의 대사로 복제됨", "실험 설계자는 책임을 분산시킴"], ["이전 참가자에게 먼저 알린다", "복제된 문장을 모두 증거로 수집한다", "실험을 멈추기 위해 서버를 닫는다"]],
  ["f_dilemma", "f_confront", "f_choice", "끝내는 방법", "에코", "문을 닫으면 기록도 사라집니다. 문을 열어두면 더 많은 사람이 같은 압박을 받습니다. 당신은 이제 답이 아니라 종료 조건을 설계해야 합니다.", ["서버 종료 권한은 당신에게 있음", "외부 공개 전 백업이 생성됨", "참가자 동의 절차는 아직 바꿀 수 있음"], ["모든 참가자에게 사실을 알린다", "동의와 감시 규칙을 먼저 만든다", "실험 데이터를 전부 폐기한다", "실험을 이어가되 나를 다음 참가자로 등록한다"]],
];

/**
 * Connective-scene effects, keyed by the authored scene each one follows.
 *
 * Every row is a real trade: the people-first option always pays in cash or
 * time, the procedure-first option always makes someone wait (`humanCost`),
 * and the profit-first option is the only one that gives `fatigue` back --
 * cutting the corner costs less of you and more of everyone else. Six scenes
 * carry a fourth option that exists only in that case.
 */
const authoredSceneChoiceEffects = {
  accounting: [
    { trust: 8, humanCost: -4, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 8, time: -6, humanCost: 2, fatigue: 4 },
    { capital: 7, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -3 },
  ],
  payday: [
    { trust: 9, humanCost: -4, capital: -7, fatigue: 6 },
    { legitimacy: 7, time: -5, humanCost: 3, fatigue: 3 },
    { capital: 8, trust: -8, legitimacy: -4, humanCost: 4, fatigue: -3 },
    { capital: -10, trust: 7, legitimacy: 7, humanCost: -3, fatigue: 7 },
  ],
  competitor: [
    { legitimacy: 7, time: -7, capital: -4, fatigue: 5 },
    { trust: 8, humanCost: -5, capital: -8, fatigue: 5 },
    { capital: 9, time: 4, trust: -7, humanCost: 5, fatigue: -3 },
  ],
  board: [
    { humanCost: -7, trust: 8, capital: -8, fatigue: 5 },
    { capital: 9, humanCost: 5, trust: -6, time: 3, fatigue: -3 },
    { legitimacy: 9, trust: 4, capital: -3, time: -6, fatigue: 6 },
  ],
  c2_logs: [
    { legitimacy: 8, time: -7, capital: -4, fatigue: 5 },
    { trust: 7, legitimacy: 3, humanCost: -3, time: -5, fatigue: 4 },
    { time: 6, capital: 4, legitimacy: -7, humanCost: 4, fatigue: -4 },
  ],
  c2_meeting: [
    { trust: 9, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 7, time: -7, humanCost: 2, fatigue: 5 },
    { time: 5, trust: -8, legitimacy: -2, humanCost: 5, fatigue: -3 },
    { capital: 7, trust: 5, legitimacy: -6, humanCost: 3, fatigue: 3 },
  ],
  c2_pressure: [
    { legitimacy: 8, trust: 6, humanCost: -3, time: -6, fatigue: 6 },
    { time: 4, legitimacy: -4, trust: -5, humanCost: 5, fatigue: -3 },
    { capital: 7, legitimacy: 3, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
  ],
  c3_split: [
    { legitimacy: 8, capital: -6, time: -5, fatigue: 5 },
    { capital: 8, trust: -4, humanCost: 3, time: -6, fatigue: 4 },
    { trust: 6, legitimacy: 5, humanCost: -3, capital: -3, time: -6, fatigue: 5 },
  ],
  c3_score: [
    { trust: 7, legitimacy: 6, capital: -5, time: -4, fatigue: 5 },
    { legitimacy: 8, time: -8, capital: -5, fatigue: 6 },
    { capital: 9, trust: -7, humanCost: 5, time: 4, fatigue: -4 },
    { capital: 6, trust: 4, legitimacy: -7, humanCost: 2, fatigue: 3 },
  ],
  c3_trap: [
    { legitimacy: 9, time: -8, capital: -5, fatigue: 6 },
    { trust: 8, legitimacy: 5, humanCost: -4, capital: -6, fatigue: 5 },
    { capital: 10, trust: -8, legitimacy: -5, humanCost: 6, time: 4, fatigue: -4 },
  ],
  c4_offer: [
    { trust: 8, humanCost: -6, capital: -7, time: -5, fatigue: 5 },
    { legitimacy: 8, time: -6, humanCost: 2, fatigue: 4 },
    { capital: 8, legitimacy: -8, humanCost: 4, time: 4, fatigue: -3 },
  ],
  c4_leak: [
    { legitimacy: 9, trust: 4, capital: -7, fatigue: 6 },
    { humanCost: -6, trust: 8, capital: -6, time: -4, fatigue: 5 },
    { time: 5, capital: 5, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 },
    { time: -7, legitimacy: 6, trust: 6, capital: -3, humanCost: 2, fatigue: 4 },
  ],
  c4_vote: [
    { legitimacy: 9, time: -6, capital: -4, fatigue: 5 },
    { legitimacy: 7, humanCost: 7, capital: -8, trust: -3, fatigue: 4 },
    { capital: 9, legitimacy: -7, trust: -5, humanCost: 4, time: 4, fatigue: -3 },
  ],
  c5_map: [
    { legitimacy: 8, capital: -7, time: -7, fatigue: 6 },
    { legitimacy: 5, trust: -6, humanCost: 5, time: -3, fatigue: 3 },
    { humanCost: -7, trust: 7, capital: -9, fatigue: 5 },
  ],
  c5_blame: [
    { trust: 9, humanCost: -5, capital: -5, time: -6, fatigue: 6 },
    { legitimacy: 8, trust: -4, humanCost: 4, time: -4, fatigue: 4 },
    { capital: -7, trust: 4, legitimacy: -6, humanCost: -4, time: 5, fatigue: -4 },
    { trust: 7, legitimacy: -4, capital: -8, humanCost: -6, fatigue: 7 },
  ],
  c5_collapse: [
    { legitimacy: 9, trust: 5, humanCost: 2, time: -4, fatigue: 7 },
    { capital: -9, legitimacy: 8, time: -6, fatigue: 5 },
    { humanCost: -8, trust: 8, capital: -8, fatigue: 5 },
  ],
  c6_desk: [{ trust: 8, legitimacy: 4, time: -6, fatigue: 4 }, { legitimacy: 7, time: -5, humanCost: 3, fatigue: 3 }, { time: 6, capital: 5, trust: -7, humanCost: 4, fatigue: -3 }],
  c6_logs: [{ trust: 9, legitimacy: 3, time: -7, capital: -4, fatigue: 5 }, { legitimacy: 6, time: -4, humanCost: 4, fatigue: 3 }, { time: 5, trust: -8, legitimacy: -3, humanCost: 5, fatigue: -3 }],
  c6_panel: [{ legitimacy: 9, trust: 4, time: -6, capital: -5, fatigue: 5 }, { trust: 7, legitimacy: -5, time: -4, humanCost: -4, fatigue: 4 }, { time: 6, legitimacy: 5, trust: -6, humanCost: 4, fatigue: -3 }],
  f_archive: [
    { trust: 9, legitimacy: 6, capital: -4, time: -6, fatigue: 6 },
    { legitimacy: 9, humanCost: 2, capital: -5, time: -8, fatigue: 6 },
    { humanCost: -6, legitimacy: -6, trust: -4, capital: -7, time: 5, fatigue: -4 },
  ],
  f_confront: [
    { trust: 9, legitimacy: 7, capital: -6, time: -5, fatigue: 6 },
    { legitimacy: 9, humanCost: 2, capital: -4, time: -8, fatigue: 5 },
    { humanCost: -7, legitimacy: -7, trust: -5, capital: -8, time: 5, fatigue: -4 },
    { trust: 6, legitimacy: 5, humanCost: -4, capital: -5, fatigue: 9 },
  ],
};

/**
 * Reaction-scene effects, keyed by the connective scene each one answers.
 *
 * Reaction scenes used to reuse the row above them, which made half the graph
 * the same decision twice. Their own question is who carries the decision
 * forward, so this is where `fatigue` comes back: handing the work on or
 * closing the file recovers you and charges someone else.
 */
const lateSeasonChoiceEffects = {
  // The connective scenes of case 07 trade in the same three shapes as the rest
  // of the season -- people first pays in cash or time, procedure first makes
  // someone wait, the shortcut gives fatigue back -- so the case reads as part
  // of the set even though its subject is the analyst's own posting.
  c7_ledger: [
    { trust: 8, legitimacy: 4, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 7, time: -5, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 },
  ],
  c7_counter: [
    { trust: 9, legitimacy: 5, capital: -5, time: -5, fatigue: 5 },
    { legitimacy: 6, time: -4, humanCost: 4, fatigue: 3 },
    { time: 5, capital: 7, trust: -6, humanCost: 5, fatigue: -3 },
  ],
  c7_paper: [
    { legitimacy: 9, trust: 4, capital: -7, time: -6, fatigue: 5 },
    { legitimacy: 5, trust: 6, time: -4, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 5, trust: -7, humanCost: 4, fatigue: -3 },
  ],
  c8_trail: [
    { trust: 8, legitimacy: 4, capital: -5, time: -5, fatigue: 5 },
    { legitimacy: 7, time: -4, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
  ],
  c8_gallery: [
    { trust: 9, humanCost: -3, capital: -4, time: -5, fatigue: 5 },
    { legitimacy: 6, time: -3, humanCost: 4, fatigue: 3 },
    { time: 5, capital: 4, trust: -7, humanCost: 4, fatigue: -3 },
  ],
  c8_bait: [
    { trust: 8, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 8, time: -5, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 6, trust: -6, humanCost: 5, fatigue: -3 },
  ],
  c9_ledger: [
    { trust: 9, humanCost: -4, capital: -7, time: -4, fatigue: 5 },
    { legitimacy: 7, time: -6, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 },
  ],
  c9_family: [
    { trust: 10, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
    { legitimacy: 8, time: -4, humanCost: 4, fatigue: 3 },
    { time: 5, capital: 5, trust: -6, humanCost: 3, fatigue: -3 },
  ],
  c9_timing: [
    { trust: 9, legitimacy: 4, capital: -6, time: -5, fatigue: 6 },
    { legitimacy: 8, time: -5, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 4, trust: -5, humanCost: 4, fatigue: -4 },
  ],
  c10_locker: [
    { trust: 11, humanCost: -5, capital: -8, time: -5, fatigue: 6 },
    { legitimacy: 6, time: -7, humanCost: 4, fatigue: 5 },
    { time: 7, capital: 7, trust: -8, humanCost: 5, fatigue: -4 },
  ],
  c10_claim: [
    { trust: 8, legitimacy: 9, capital: -9, time: -6, fatigue: 7 },
    { legitimacy: 5, time: -8, humanCost: 5, fatigue: 4 },
    { time: 8, capital: 5, trust: -7, humanCost: 6, fatigue: -5 },
  ],
  c10_relay: [
    { trust: 12, legitimacy: 6, capital: -10, time: -4, fatigue: 4 },
    { legitimacy: 9, time: -6, humanCost: 6, fatigue: 3 },
    { time: 4, capital: 8, trust: -9, humanCost: 4, fatigue: -6 },
  ],
  c11_script: [
    { legitimacy: 10, trust: 6, humanCost: 4, time: -5, fatigue: 5 },
    { time: 5, trust: 4, legitimacy: -6, humanCost: 3, fatigue: 2 },
    { capital: 5, time: 6, trust: -7, legitimacy: -3, fatigue: -3 },
  ],
  c11_rehearsal: [
    { trust: 12, humanCost: -6, time: -6, capital: -4, fatigue: 5 },
    { trust: 6, legitimacy: 3, time: -3, humanCost: 3, fatigue: 2 },
    { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -4 },
  ],
  c11_sign: [
    { trust: 12, humanCost: -6, legitimacy: -3, time: -4, fatigue: 5 },
    { legitimacy: 10, trust: 4, time: -6, humanCost: 3, fatigue: 4 },
    { time: 5, capital: 4, trust: -8, humanCost: 5, fatigue: -3 },
  ],
};

const lateSeasonReactionEffects = {
  c7_receipt: [
    { trust: 8, legitimacy: 3, capital: -4, time: -5, fatigue: 4 },
    { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
    { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
  ],
  c7_teller: [
    { trust: 9, legitimacy: 4, capital: -5, time: -4, fatigue: 5 },
    { legitimacy: 5, trust: 4, time: -3, humanCost: 4, fatigue: 3 },
    { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
  ],
  c7_ticket: [
    { legitimacy: 8, trust: 4, capital: -6, time: -5, fatigue: 5 },
    { legitimacy: 6, time: -4, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 6, trust: -6, humanCost: 4, fatigue: -3 },
  ],
  c8_sundae: [
    { trust: 8, legitimacy: 3, capital: -4, time: -5, fatigue: 4 },
    { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
    { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
  ],
  c8_mother: [
    { trust: 9, humanCost: -3, capital: -4, time: -6, fatigue: 5 },
    { legitimacy: 5, trust: 3, time: -3, humanCost: 4, fatigue: 3 },
    { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
  ],
  c8_clerks: [
    { trust: 8, legitimacy: 4, humanCost: -4, time: -5, fatigue: 5 },
    { legitimacy: 7, time: -4, humanCost: 3, fatigue: 4 },
    { time: 6, capital: 5, trust: -6, humanCost: 5, fatigue: -3 },
  ],
  c9_calc: [
    { trust: 9, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 6, time: -5, humanCost: 3, fatigue: 3 },
    { time: 5, capital: 6, trust: -6, humanCost: 4, fatigue: -3 },
  ],
  c9_wedding: [
    { trust: 10, legitimacy: 2, capital: -3, time: -6, fatigue: 6 },
    { legitimacy: 7, time: -3, humanCost: 3, fatigue: 3 },
    { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
  ],
  c9_night: [
    { trust: 8, legitimacy: 5, capital: -5, time: -5, fatigue: 5 },
    { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
    { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -4 },
  ],
  c10_ward: [
    { trust: 10, legitimacy: 5, humanCost: -6, time: -6, fatigue: 6 },
    { legitimacy: 8, time: -3, humanCost: 4, fatigue: 5 },
    { time: 7, capital: 6, trust: -7, humanCost: 6, fatigue: -4 },
  ],
  c10_pills: [
    { trust: 9, legitimacy: 7, capital: -7, time: -5, fatigue: 6 },
    { legitimacy: 5, time: -6, humanCost: 5, fatigue: 4 },
    { time: 6, capital: 7, trust: -8, humanCost: 5, fatigue: -5 },
  ],
  c10_ledger: [
    { trust: 11, humanCost: -7, capital: -6, time: -7, fatigue: 7 },
    { legitimacy: 9, time: -5, humanCost: 4, fatigue: 5 },
    { time: 5, capital: 9, trust: -6, humanCost: 5, fatigue: -3 },
  ],
  c11_press: [
    { trust: 11, humanCost: -6, time: -6, capital: -3, fatigue: 5 },
    { legitimacy: 8, time: -7, humanCost: 4, fatigue: 4 },
    { time: 6, capital: 5, trust: -7, humanCost: 5, fatigue: -4 },
  ],
  c11_father: [
    { trust: 10, humanCost: -5, time: -4, fatigue: 4 },
    { legitimacy: 5, trust: 2, time: -2, humanCost: 3, fatigue: 2 },
    { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
  ],
  c11_eve: [
    { legitimacy: 11, trust: 5, capital: -6, time: -3, fatigue: 5 },
    { legitimacy: 7, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
    { time: 5, capital: 5, trust: 4, legitimacy: -7, humanCost: 3, fatigue: -3 },
  ],
};

const authoredSceneReactionEffects = {
  c1_witness: [
    { trust: 8, legitimacy: 4, time: -5, fatigue: 7 },
    { time: 6, trust: -5, humanCost: 4, fatigue: -5 },
    { capital: 6, trust: -3, legitimacy: -4, humanCost: 3, fatigue: -3 },
  ],
  c1_assembly: [
    { legitimacy: 8, trust: 6, capital: -5, fatigue: 6 },
    { time: 5, trust: -4, humanCost: 4, fatigue: -6 },
    { trust: -7, legitimacy: 3, humanCost: 5, time: -4, fatigue: 3 },
  ],
  c1_bargain: [
    { trust: 9, humanCost: -5, capital: -7, time: -5, fatigue: 5 },
    { legitimacy: 7, humanCost: 2, time: -6, fatigue: 4 },
    { time: 6, trust: -4, humanCost: 3, fatigue: -5 },
  ],
  c1_verdict: [
    { trust: 8, humanCost: -6, capital: -6, fatigue: 6 },
    { capital: 6, legitimacy: 6, humanCost: 2, time: -5, fatigue: 3 },
    { time: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -4 },
  ],
  c2_trace: [
    { legitimacy: 8, capital: -4, time: -6, fatigue: 5 },
    { legitimacy: 5, trust: -3, humanCost: 2, time: -7, fatigue: 6 },
    { time: 7, capital: -3, legitimacy: -7, humanCost: 6, fatigue: -5 },
  ],
  c2_witness: [
    { trust: 8, legitimacy: 6, time: -6, fatigue: 7 },
    { trust: 4, humanCost: -3, legitimacy: -3, capital: -4, fatigue: 5 },
    { time: 6, trust: -7, humanCost: 6, fatigue: -6 },
  ],
  c2_judgment: [
    { legitimacy: 8, trust: 5, time: -5, fatigue: 6 },
    { legitimacy: 7, trust: -6, humanCost: 5, time: -6, fatigue: 4 },
    { time: 6, legitimacy: -5, trust: -4, humanCost: 4, fatigue: -5 },
  ],
  c3_rival: [
    { trust: 7, legitimacy: 6, capital: -6, time: -5, fatigue: 4 },
    { legitimacy: 8, capital: -4, time: -8, fatigue: 5 },
    { capital: 10, trust: -8, legitimacy: -4, time: 4, fatigue: -3 },
  ],
  c3_signal: [
    { legitimacy: 7, trust: 6, capital: -5, time: -4, fatigue: 5 },
    { legitimacy: 4, humanCost: 2, time: -3, fatigue: 6 },
    { capital: 9, trust: -7, humanCost: 5, time: 4, fatigue: -4 },
  ],
  c3_verdict: [
    { trust: 7, legitimacy: 7, time: -6, fatigue: 5 },
    { legitimacy: 8, trust: 5, humanCost: -4, capital: -6, fatigue: 8 },
    { time: 6, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -5 },
  ],
  c4_audit: [
    { humanCost: -7, trust: 7, capital: -8, time: -4, fatigue: 5 },
    { legitimacy: 6, humanCost: 3, time: -4, fatigue: 3 },
    { capital: 7, legitimacy: -4, trust: -5, humanCost: 5, fatigue: -4 },
  ],
  c4_public: [
    { legitimacy: 9, trust: 5, capital: -7, fatigue: 6 },
    { capital: 7, legitimacy: -5, humanCost: 4, time: 3, fatigue: 2 },
    { time: 5, trust: -6, legitimacy: -6, humanCost: 3, fatigue: -5 },
  ],
  c4_verdict: [
    { legitimacy: 9, capital: -8, time: -6, fatigue: 7 },
    { trust: 8, humanCost: -4, legitimacy: -3, capital: -4, fatigue: 5 },
    { time: 6, trust: -5, legitimacy: -4, humanCost: 5, fatigue: -5 },
  ],
  c5_pattern: [
    { legitimacy: 7, humanCost: -6, capital: -5, time: -8, fatigue: 6 },
    { legitimacy: 6, trust: -5, humanCost: 4, time: -4, fatigue: 3 },
    { time: 5, capital: 4, legitimacy: -4, humanCost: 4, fatigue: -5 },
  ],
  c5_voice: [
    { trust: 9, humanCost: -6, capital: -7, fatigue: 6 },
    { legitimacy: 8, capital: -6, time: -6, fatigue: 7 },
    { time: 6, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -4 },
  ],
  c5_verdict: [
    { humanCost: -7, trust: 7, capital: -8, fatigue: 5 },
    { legitimacy: 6, trust: 4, humanCost: 2, time: -4, fatigue: 4 },
    { time: 6, trust: -6, legitimacy: -3, humanCost: 5, fatigue: -5 },
  ],
  f_witness: [
    { trust: 9, legitimacy: 7, time: -7, fatigue: 6 },
    { legitimacy: 8, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
    { humanCost: -5, legitimacy: -8, trust: -4, time: 5, fatigue: -4 },
  ],
  c6_kitchen: [{ trust: 7, legitimacy: 4, time: -5, capital: -4, fatigue: 4 }, { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 }, { time: 5, capital: 4, trust: -6, humanCost: 4, fatigue: -3 }],
  c6_family: [{ trust: 8, legitimacy: 3, time: -6, capital: -3, fatigue: 4 }, { legitimacy: 7, time: -3, humanCost: 4, fatigue: 3 }, { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 }],
  c6_ledger: [{ legitimacy: 8, trust: 5, time: -6, capital: -4, fatigue: 5 }, { trust: 6, legitimacy: -4, humanCost: -3, time: -3, fatigue: 4 }, { time: 5, legitimacy: 4, trust: -6, humanCost: 4, fatigue: -3 }],
  f_dilemma: [
    { trust: 8, legitimacy: 8, time: -8, fatigue: 6 },
    { legitimacy: 6, humanCost: -5, trust: -4, capital: -5, fatigue: 8 },
    { time: 6, trust: -7, legitimacy: -6, humanCost: 6, fatigue: -5 },
  ],
};

/**
 * Connective-scene copy, keyed by the scene each connective scene grows out of.
 * The lines answer the buttons that scene actually shows: these tables were
 * written against an earlier set of labels and stayed behind when the labels
 * were rewritten, so a player who picked "살아남을 돈을 먼저 확보한다" heard
 * "근거와 책임자를 같은 문서에 공개하겠습니다" back. `check:text` compares the two
 * now, so the pair cannot drift apart again unnoticed.
 */
const authoredSceneChoiceCopy = {
  accounting: { voice: ["먼저 그가 안전하게 말할 자리를 만들겠습니다.", "원본 파일부터 잠가 지금 상태 그대로 남기겠습니다.", "말이 퍼지기 전에 CFO와 조용히 정리하겠습니다."], echo: ["자리를 먼저 만들면 증언은 늦어지고, 늦게 나온 증언은 혼자 무너지지 않습니다.", "잠근 원본은 사라지지 않지만, 잠그는 순간 팀 전체가 조사 대상이 됩니다.", "조용한 합의는 오늘을 사고, 그 값은 가장 늦게 안 사람의 이름으로 청구됩니다."] },
  payday: { voice: ["직원 대표와 함께 공개할 약속을 쓰겠습니다.", "지급 순서를 숫자로 고정해 그대로 지키겠습니다.", "임원진 선에서 임시 합의를 만들고 급여일을 넘기겠습니다.", "먼저 깎을 자리는 제 자리라고 적겠습니다."], echo: ["함께 쓴 약속은 지키기 어렵고, 어긴 날은 모두가 같은 문장을 읽습니다.", "고정된 순서는 다툼을 줄이지만, 맨 뒤에 놓인 사람은 이유를 듣지 못합니다.", "임시 합의는 하루를 벌고, 알려지는 날 그 하루의 값이 한 번에 붙습니다.", "위에서 먼저 깎으면 지급 순서는 설명이 필요 없어집니다."] },
  competitor: { voice: ["빈칸에 누가 남는지부터 적고 협상을 시작하겠습니다.", "가장 약한 쪽의 조건을 먼저 협상안에 넣겠습니다.", "빈칸은 그대로 두고 오늘 사인하겠습니다."], echo: ["빈칸을 채우면 협상은 느려지고, 남겨질 사람의 이름은 문서에 남습니다.", "약한 쪽을 먼저 넣으면 얻을 수 있는 조건은 좁아지고, 그 조건만은 끝까지 지켜집니다.", "비워둔 칸은 사라지지 않고, 다음 협상자가 그 값을 치릅니다."] },
  board: { voice: ["가장 약한 사람의 손실부터 줄이겠습니다.", "내일까지 회사를 남길 돈부터 확보하겠습니다.", "근거와 책임자를 같은 문서에 공개하겠습니다."], echo: ["약한 쪽의 손실을 줄여도 총액은 그대로이고, 그 몫은 다른 칸으로 옮겨갑니다.", "남은 돈은 시간을 사지만, 그 시간에서 누가 빠졌는지는 기록되지 않습니다.", "공개된 근거는 반박을 부르고, 그 반박이 이 결정의 유일한 검증입니다."] },
  c2_logs: { voice: ["그 11초에 무엇이 가능했는지 그대로 재현하겠습니다.", "그 시간에 무엇을 했는지 이민서에게 직접 묻겠습니다.", "단순 오류로 정리하고 보고 시간을 지키겠습니다."], echo: ["재현은 가능성을 보여주지만, 가능했다는 것과 했다는 것은 다릅니다.", "직접 물으면 답은 빨라지고, 묻는 순간 그는 이미 용의자가 됩니다.", "지킨 마감은 오늘 조용하고, 오류로 닫은 11초는 다음 사건에서 다시 열립니다."] },
  c2_meeting: { voice: ["결론보다 이민서의 안전을 먼저 확보하겠습니다.", "사람은 두고 파일이 지나간 경로만 따라가겠습니다.", "그의 침묵을 의심 신호로 기록에 남기겠습니다.", "지목된 사람과 조건을 걸고 거래하겠습니다."], echo: ["안전을 먼저 두면 조사는 느려지고, 그가 말할 수 있는 조건은 남습니다.", "경로만 보면 공정해 보이지만, 그 경로 끝에는 결국 사람이 서 있습니다.", "침묵을 신호로 적는 순간, 다음 사람은 말하지 않을 이유를 하나 더 얻습니다.", "거래는 답을 빨리 주지만 그 답의 값은 나중에 청구됩니다."] },
  c2_pressure: { voice: ["익명 증언을 공식 부록으로 보고서에 붙이겠습니다.", "기록에 없는 것은 이번 보고에서 보류하겠습니다.", "결론을 내기 전에 외부 기업과 먼저 마주 앉겠습니다."], echo: ["부록이 되면 증언은 기록이 되고, 익명은 그만큼 얇아집니다.", "보류한 문장은 지워지지 않고, 보고서 밖에서 계속 돌아다닙니다.", "먼저 마주 앉으면 사실은 빨리 좁혀지고, 마감은 그만큼 뒤로 밀립니다."] },
  c3_split: { voice: ["경쟁사의 책임 조항을 문장 단위로 확인해 앞에 세우겠습니다.", "고객의 목적과 비용 절감의 목적을 분리해 비용표부터 다시 계산하겠습니다.", "그 숫자가 어디서 왔는지 오진우에게 직접 묻겠습니다."], echo: ["책임 조항을 앞에 세우면 제안은 무거워지고, 실패한 날 그 문장만 작동합니다.", "다시 계산한 표는 정확해지고, 그 사이 고객은 상대의 숫자를 먼저 봅니다.", "출처를 물으면 상대는 준비할 시간을 얻고, 답하지 않는 것도 하나의 답이 됩니다."] },
  c3_score: { voice: ["발표를 멈추지 않고, 저 신호를 질문으로 바꿔 화면에 올리겠습니다.", "발표를 멈추고 보안부터 확인하겠습니다.", "신호가 무엇이든 상대보다 먼저 결론을 밀어붙이겠습니다.", "신호의 해석을 경쟁자와 나눠 갖겠습니다."], echo: ["질문으로 바꾸면 의심은 공개되고, 발표의 주도권은 관객석으로 넘어갑니다.", "멈춘 발표는 다시 시작하기 어렵고, 확인하지 못한 채 끝내는 것보다는 낫습니다.", "먼저 밀면 점수는 오늘 들어오고, 그 신호의 값은 다음 사람이 계산합니다.", "해석을 나누면 위험도 나뉘지만 기준도 함께 흐려집니다."] },
  c3_trap: { voice: ["검증을 끝낸 뒤에 발표하겠습니다.", "책임을 나눠 지는 조건으로 함께 발표하겠습니다.", "불확실한 부분은 덮고 승리부터 확정하겠습니다."], echo: ["검증을 마치면 문장은 단단해지고, 발표할 자리는 이미 상대가 차지합니다.", "나눠 진 책임은 오늘의 부담을 줄이고, 실패한 날 누구의 것도 아니게 됩니다.", "덮은 불확실성은 사라지지 않고, 확정된 승리 안에서 조용히 자랍니다."] },
  c4_offer: { voice: ["이용자 대표가 세운 기준을 산식에 반영하겠습니다.", "산식이 언제 어떻게 바뀌었는지 이력을 남기겠습니다.", "3%는 조용히 보정하고 서비스를 그대로 가겠습니다."], echo: ["이용자의 기준을 넣으면 심사는 길어지고, 그 기준은 다음 심사에도 남습니다.", "남은 이력은 오늘의 3%를 설명하지 못하고, 다음 3%는 설명하게 만듭니다.", "조용한 보정은 오늘 아무도 잃지 않고, 드러나는 날 전부를 잃습니다."] },
  c4_leak: { voice: ["공개 가능한 사실과 아직 모르는 사실을 나누겠습니다.", "기자의 문장보다 피해 복구의 순서를 먼저 확정하겠습니다.", "기사에 나갈 표현은 최소한으로 줄이겠습니다.", "기사 시점을 늦추는 대신 전량 공개를 약속하겠습니다."], echo: ["모르는 것을 함께 적는 것이 공개의 첫 조건입니다.", "기사의 속도보다 복구 순서가 피해자에게 직접 닿습니다.", "줄인 표현은 오늘의 제목을 낮추고, 빠진 문장은 내일 다른 기자가 씁니다.", "시간을 사면 공개의 범위는 넓어지지만 약속은 되돌릴 수 없습니다."] },
  c4_vote: { voice: ["그 예외를 공개된 조건으로 묶어 두겠습니다.", "규칙을 지키고 이 서비스는 포기하겠습니다.", "결과가 좋으니 기록은 나중에 설명하겠습니다."], echo: ["조건으로 묶인 예외는 반복돼도 규칙이 되지 않습니다.", "지킨 규칙은 다음 심사를 통과시키고, 오늘 그 서비스를 쓰던 사람은 남지 않습니다.", "나중으로 미룬 설명은 대개 열리지 않고, 예외는 그동안 규칙이 됩니다."] },
  c5_map: { voice: ["정보가 막혀 있던 지점부터 고치겠습니다.", "승인한 사람에게 책임을 모으겠습니다.", "피해가 가장 큰 부서부터 보상하겠습니다."], echo: ["막힌 곳을 열면 같은 실패는 줄고, 이미 일어난 실패의 책임은 그대로 남습니다.", "책임이 한 사람에게 모이면 결론은 빨라지고, 구조는 그 자리에 그대로 있습니다.", "큰 피해부터 갚으면 눈에 보이는 곳은 회복되고, 작게 흩어진 피해는 계산되지 않습니다."] },
  c5_blame: { voice: ["증언자를 보호하면서 지워진 기록부터 복원하겠습니다.", "공식 책임자를 먼저 발표하겠습니다.", "보상안을 먼저 만들고 조사는 뒤로 미루겠습니다.", "증언자의 자리를 제 권한으로 보장하겠습니다."], echo: ["복원된 기록은 증언을 대신하지 못하고, 증언 혼자 서 있게 두지도 않습니다.", "이름이 먼저 나오면 조직은 답을 얻고, 그 이름이 구조를 가립니다.", "먼저 도착한 보상은 피해를 덮고, 미룬 조사는 대개 다시 열리지 않습니다.", "개인이 보증한 자리는 그 개인이 사라지면 함께 사라집니다."] },
  c5_collapse: { voice: ["제가 무엇을 결정했는지부터 공개하겠습니다.", "다음 실패를 막는 장치를 지금 결정하겠습니다.", "사과문보다 피해 복구의 첫 행동을 먼저 시작하겠습니다."], echo: ["자기 결정을 먼저 여는 사람은 신뢰를 얻고, 그 문서는 되돌릴 수 없습니다.", "구조에 쓴 돈은 오늘의 피해자에게 닿지 않고, 다음 피해자를 지웁니다.", "복구가 먼저 움직이면 사과는 나중에 와도 늦지 않습니다."] },
  c6_desk: { voice: ["기록 밖에서 들은 말도 그 사람의 일부라며, 자료에 넣겠다고 한다.", "이 자리를 지키고 싶어서, 자료는 따로 쓰겠다고 한다.", "감상은 여기까지라며 컵을 내려놓고 먼저 일어선다."], echo: ["기록에 들어간 온기는 증거가 되고, 증거가 된 온기는 반대신문을 받습니다.", "따로 쓰면 이 자리는 남습니다. 남은 자리는 자료에 없으므로 위원회에서 존재하지 않습니다.", "먼저 일어서면 시간은 지켜집니다. 셋이 같은 방에 있던 사실은 아무 데도 기록되지 않습니다."] },
  c6_logs: { voice: ["가족이 뒤늦게 아는 편이 더 잔인하다며, 사실대로 알린다.", "내 입으로 말할 일이 아니라며, 공식 창구를 안내한다.", "지금 말하면 되돌릴 수 없다며, 축하 인사만 받고 끊는다."], echo: ["사실을 먼저 아는 가족은 준비할 수 있습니다. 그 준비는 당신이 아니라 그들이 감당합니다.", "공식 창구는 정확합니다. 정확한 창구는 대개 가장 늦게 열립니다.", "말하지 않은 30초는 오늘 아무도 다치게 하지 않고, 나중에 그 30초가 가장 길게 기억됩니다."] },
  c6_panel: { voice: ["대조군이 누구든 같은 실험이라며, 두 장을 함께 낸다.", "그를 먼저 살려야 한다며, 내 프로필은 빼고 그의 것만 낸다.", "프로필은 변수일 뿐이라며, 사실관계만 들고 들어간다."], echo: ["두 장을 함께 내면 실험은 처음으로 대칭이 됩니다. 대칭은 당신도 피험자라는 뜻입니다.", "그의 것만 내면 그는 피해자가 되고, 당신은 여전히 관찰자석에 남습니다.", "사실관계만으로도 위원회는 결론을 냅니다. 그 결론에 왜 그가 빨라졌는지는 들어가지 않습니다."] },
  f_archive: { voice: ["이전 참가자에게 그의 기록이 남아 있다는 사실부터 알리겠습니다.", "복제된 문장을 전부 증거로 모으겠습니다.", "지금 서버를 닫아 실험을 멈추겠습니다."], echo: ["먼저 알리면 실험은 흔들리고, 그는 처음으로 자기 기록을 가진 사람이 됩니다.", "모은 문장은 실험을 증명하고, 모으는 동안 실험은 계속 돌아갑니다.", "닫힌 서버는 실험을 끝내고, 그 안의 기록도 함께 잠급니다."] },
  f_confront: { voice: ["관찰된 선택을 숨기지 않고 당사자에게 돌려주겠습니다.", "종료 권한과 감시 규칙을 함께 공개하겠습니다.", "실험 데이터를 전부 폐기하겠습니다.", "실험을 이어가되 다음 참가자 자리에 제 이름을 넣겠습니다."], echo: ["관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.", "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.", "폐기된 데이터는 피해를 멈추고, 무엇이 있었는지 증명할 방법도 함께 지웁니다.", "자신을 넣는 선택은 실험을 멈추지 않고 관찰자만 한 명 줄입니다."] },
};

/**
 * Reaction-scene copy, keyed by the connective scene each one answers. These
 * used to fall back to the parent's lines, so 54 of the player's sentences
 * repeated verbatim one scene later.
 */
const authoredSceneReactionCopy = {
  c1_witness: { voice: ["보호의 기준을 팀 전체가 읽을 수 있게 적겠습니다.", "오늘은 여기까지 기록하고 판단은 문서에 맡기겠습니다.", "지목된 쪽에도 먼저 답할 자리를 주겠습니다."], echo: ["기준이 공개되면 보호는 특혜가 아니라 절차가 됩니다.", "회의를 닫는 일도 하나의 판단이고, 남은 질문은 사라지지 않습니다.", "먼저 답할 자리를 주면 반박은 빨라지고 검증은 느려집니다."] },
  c1_assembly: { voice: ["아는 것과 모르는 것을 같은 공지에 적겠습니다.", "숫자가 확정된 뒤에 한 번만 말하겠습니다.", "소문의 출처부터 확인하겠습니다."], echo: ["모르는 것을 적은 공지는 다음 질문의 범위를 좁힙니다.", "한 번에 말하면 정확하지만 그때까지의 불안은 계산되지 않습니다.", "출처를 쫓는 동안 사람들은 자신이 조사 대상이라고 느낍니다."] },
  c1_bargain: { voice: ["자리에 없는 사람을 협상 테이블로 부르겠습니다.", "조건표를 끝내고 나서 다시 마주 앉겠습니다.", "상대가 돌아올 때까지 아무것도 확정하지 않겠습니다."], echo: ["빈 의자를 채우면 협상은 느려지고 합의는 오래갑니다.", "완성된 조건표는 협상을 지키지만 빠진 사람도 함께 고정합니다.", "기다림은 중립처럼 보이지만 그 시간의 비용은 누군가 냅니다."] },
  c1_verdict: { voice: ["가장 크게 잃는 사람에게 먼저 설명하겠습니다.", "투자자에게 근거를 먼저 제출하겠습니다.", "회의록에는 결정한 사람만 남기겠습니다."], echo: ["먼저 듣는 사람이 누구인지가 결론의 성격을 정합니다.", "근거가 먼저 가면 돈은 남지만 설명의 순서는 뒤집힙니다.", "이름만 남은 회의록은 다음 사람에게 아무 조건도 남기지 않습니다."] },
  c2_trace: { voice: ["기록을 그대로 두고 접근만 잠그겠습니다.", "그 계정이 무엇을 했는지 끝까지 따라가겠습니다.", "시스템을 초기화하고 처음부터 다시 세우겠습니다."], echo: ["잠그는 일은 고치는 일이 아니지만 지울 수도 없게 만듭니다.", "계정을 따라가면 원인에 닿지만 사람에게도 닿습니다.", "초기화는 오류와 함께 증거도 지웁니다."] },
  c2_witness: { voice: ["당사자가 직접 말할 절차를 만들겠습니다.", "제가 대신 진술해 위험을 나누겠습니다.", "보호를 풀고 공식 조사에 맡기겠습니다."], echo: ["직접 말할 절차는 느리지만 그 진술은 대신 무너지지 않습니다.", "대신 말하면 안전해지지만 그 사람의 말은 기록에서 사라집니다.", "보호를 푸는 순간 의심과 기회가 동시에 돌아옵니다."] },
  c2_judgment: { voice: ["익명을 지키고 그 한계를 함께 쓰겠습니다.", "실명을 확인한 뒤에 보고하겠습니다.", "증언을 빼고 기록만 제출하겠습니다."], echo: ["한계를 적은 증언은 약해 보이지만 반박에도 견딥니다.", "실명은 보고서를 단단하게 하고 증언자를 얇게 만듭니다.", "빼기로 한 문장은 보고서 밖에서 계속 돌아다닙니다."] },
  c3_rival: { voice: ["공동 검증 조건을 먼저 제안하겠습니다.", "자료의 출처를 확인할 때까지 협상을 멈추겠습니다.", "상대의 안을 이용해 먼저 제출하겠습니다."], echo: ["공동 검증은 승부를 늦추고 기준을 남깁니다.", "멈추는 동안 상대는 계속 움직이지만 근거는 당신 쪽에 쌓입니다.", "먼저 제출하면 이기고, 그 안의 출처는 영원히 당신 것이 아닙니다."] },
  c3_signal: { voice: ["신호가 무엇인지 모두 앞에서 묻겠습니다.", "발표를 계속하면서 신호를 기록해 두겠습니다.", "신호는 두고 점수부터 확보하겠습니다."], echo: ["공개된 질문은 답이 없어도 기준을 만듭니다.", "기록하면서 계속하는 선택은 아무것도 결정하지 않는 방식이기도 합니다.", "점수를 먼저 챙기면 신호는 다음 사람의 문제가 됩니다."] },
  c3_verdict: { voice: ["책임표를 함께 작성하겠습니다.", "책임표 맨 위에 제 이름을 적겠습니다.", "성과를 확정한 뒤에 책임을 논의하겠습니다."], echo: ["함께 적은 표는 실패했을 때 실제로 작동합니다.", "맨 위의 이름은 방패가 되지만 그 사람 하나만 방패입니다.", "뒤로 미룬 책임 논의는 대개 열리지 않습니다."] },
  c4_audit: { voice: ["가장 약한 이용자를 기준으로 삼겠습니다.", "전체 평균을 기준으로 삼겠습니다.", "심사관의 기준을 그대로 따르겠습니다."], echo: ["가장 약한 쪽을 기준으로 잡으면 비용은 즉시, 이득은 나중에 옵니다.", "평균은 공정해 보이지만 평균 밖의 사람은 계속 밖에 있습니다.", "남의 기준을 따르면 빨라지고, 설명할 근거는 남지 않습니다."] },
  c4_public: { voice: ["모르는 부분까지 넣은 문장을 고르겠습니다.", "서비스가 유지된다는 사실을 앞세우겠습니다.", "논란이 될 표현은 모두 빼겠습니다."], echo: ["모르는 것을 적은 기사에는 다음 질문의 자리가 남습니다.", "유지된다는 문장은 안심을 주고 피해자는 문장 밖에 둡니다.", "다듬은 문장은 오늘 조용하고 내일 다시 열립니다."] },
  c4_verdict: { voice: ["자료를 공개하고 규칙을 다시 쓰겠습니다.", "제보자를 보호하고 내부에서 정리하겠습니다.", "문을 닫고 심사 결과를 기다리겠습니다."], echo: ["규칙을 다시 쓰면 이번 사건보다 다음 사건이 달라집니다.", "내부 정리는 사람을 지키지만 같은 예외를 다시 허용합니다.", "기다리는 동안 결정은 다른 사람의 책상에서 내려집니다."] },
  c5_pattern: { voice: ["분류를 폐기하고 처음부터 다시 듣겠습니다.", "가장 큰 승인자부터 조사하겠습니다.", "지도는 두고 빠진 부분만 채우겠습니다."], echo: ["분류를 버리면 느려지지만 빠졌던 목소리가 돌아옵니다.", "승인자를 겨누면 빠르고, 구조는 그대로 남습니다.", "보완만 하면 지도의 틀린 전제도 함께 유지됩니다."] },
  c5_voice: { voice: ["떠나지 않고도 말할 수 있게 보장하겠습니다.", "증언 직후에 조직을 바꾸겠습니다.", "조직을 지키기 위해 증언을 미루겠습니다."], echo: ["자리를 지키게 하는 보장은 비싸고, 다음 증언자를 만듭니다.", "증언 뒤의 개편은 빠르지만 그 사람은 개편의 이유가 됩니다.", "미룬 증언은 사라지지 않고 다른 사람의 입으로 나옵니다."] },
  c5_verdict: { voice: ["복구를 발표의 첫 문장으로 두겠습니다.", "책임자의 사과를 먼저 받겠습니다.", "개선 계획이 끝날 때까지 말하지 않겠습니다."], echo: ["복구가 첫 문장이면 사과는 설명이 아니라 약속이 됩니다.", "사과는 형식을 갖추지만 피해는 그 자리에 그대로입니다.", "침묵은 계획을 지키고 기다리는 사람을 잃습니다."] },
  f_witness: { voice: ["기록을 돌려주고 실험을 처음부터 다시 설명하겠습니다.", "기록은 증거로 두고 동의를 요청하겠습니다.", "기록을 지워 피해를 끝내겠습니다."], echo: ["돌려준 기록은 실험을 흔들고 참가자를 사람으로 되돌립니다.", "동의를 요청하는 순간 실험의 전제가 처음으로 공개됩니다.", "지운 기록은 피해를 멈추고 책임도 함께 지웁니다."] },
  c6_kitchen: { voice: ["돌아올 자리를 남기자며, 이름표를 그대로 둔다.", "표시를 남기되 규정대로 자리 정리 절차를 함께 연다.", "지금 치우는 게 서로에게 낫다며, 오늘 안에 자리를 비운다."], echo: ["남겨 둔 자리는 약속이 됩니다. 지켜지지 않은 약속은 그 자리에서 가장 오래 보입니다.", "절차와 함께 남기면 자리는 규정이 됩니다. 규정은 사람보다 먼저 만료됩니다.", "치운 자리는 깔끔합니다. 돌아온 사람이 앉을 곳은 그날부터 없습니다."] },
  c6_family: { voice: ["오늘은 답하지 않겠다고, 스스로에게 기한을 정한다.", "답할 사람을 정해 두고, 내가 아니라 회사가 말하게 한다.", "미루는 것도 거짓말이라며, 지금 사실대로 전한다."], echo: ["기한을 정한 침묵은 거짓말이 아닙니다. 기한이 지나면 같은 침묵이 거짓말이 됩니다.", "회사가 말하면 문장은 정확해지고, 목소리는 아무의 것도 아니게 됩니다.", "지금 전하면 가족은 오늘부터 압니다. 그가 직접 말할 기회는 사라집니다."] },
  c6_ledger: { voice: ["아는 쪽의 책임이 더 크다며, 내 프로필까지 함께 올린다.", "아는 것을 무기로 쓰지 않겠다며, 두 장 다 봉인한다.", "지금은 그를 살리는 게 먼저라며, 아는 것을 쓰지 않고 넘어간다."], echo: ["아는 쪽이 올리면 실험은 대칭이 됩니다. 대칭은 보호가 아니라 노출입니다.", "봉인한 앎은 아무도 해치지 않고, 아무도 구하지 않습니다.", "쓰지 않은 앎은 사라지지 않습니다. 다음 사건에서 같은 화면이 당신 이름으로 열립니다."] },
  f_dilemma: { voice: ["종료 조건을 참가자들과 함께 정하겠습니다.", "제가 혼자 버튼을 누르겠습니다.", "버튼을 숨기고 시스템을 지켜보겠습니다."], echo: ["함께 정한 종료 조건은 느리지만 다음 실험에도 남습니다.", "혼자 누르면 끝나고, 그 결정의 근거는 아무도 검토하지 않습니다.", "숨긴 버튼은 통제가 아니라 다음 관찰자의 권한이 됩니다."] },
};

const lateSeasonChoiceCopy = {
  c7_ledger: {
    voice: ["4,300원도 기록이라며, 그의 방식대로 반씩 적는다.", "영수증을 받아 들고, 오늘 경비는 내가 지겠다고 한다.", "이런 데 쓸 시간이 없다며 그냥 넘긴다."],
    echo: ["반씩 적힌 기록은 아무도 빚지지 않게 합니다. 빚이 없으면 부탁도 없습니다.", "당신이 낸 경비는 그를 편하게 하고, 그 편함은 나중에 수첩을 꺼내기 어렵게 만듭니다.", "아낀 2분은 오늘 쓸모가 있고, 그가 왜 4,300원을 세는 사람인지는 끝내 모릅니다."],
  },
  c7_counter: {
    voice: ["접힌 종이를 펴서, 그의 이름도 같은 줄에 쓴다.", "접힌 그대로 받아, 그의 이름은 가린 채 쓴다.", "사본은 사양하고, 정식 열람 절차만 밟겠다고 한다."],
    echo: ["펴서 쓰면 그는 증인이 됩니다. 정년 한 해를 앞둔 증인입니다.", "가린 이름은 오늘 그를 지키고, 문서의 힘은 그만큼 줄어듭니다.", "절차는 깨끗하고 느립니다. 48시간 안에 끝나는 절차는 아닙니다."],
  },
  c7_paper: {
    voice: ["표를 취소하고, 취소 기록까지 증거로 붙인다.", "표는 그대로 두고, 자료부터 밖으로 보낸다.", "표를 받아 두고, 오늘은 아무 말도 하지 않는다."],
    echo: ["취소 기록은 이 발령이 예정돼 있었다는 증거가 됩니다. 동시에 당신이 저항한다는 신고이기도 합니다.", "표를 두면 아무도 놀라지 않습니다. 자료는 그 틈으로 나갑니다.", "받아 둔 표는 오늘 조용합니다. 06:40에 그 조용함이 끝납니다."],
  },
  c8_trail: {
    voice: ["영수증 뒷면의 번호로, 전임자에게 바로 전화를 걸어 사정을 듣겠다고 한다.", "번호는 지갑에 넣어 두고, 반려 기록부터 확인하겠다고 한다.", "오늘은 묻지 않기로 하고, 순대 맛만 칭찬하고 넘어간다."],
    echo: ["바로 건 전화는 사람을 먼저 엽니다. 준비되지 않은 사람의 말은 정확하지 않을 수 있습니다.", "기록부터 보면 질문이 날카로워집니다. 그 사이 전임자는 전화를 받을 이유를 잃을 수도 있습니다.", "묻지 않은 점심은 편합니다. 지점장이 번호를 적어 준 이유는 하루 더 설명되지 않습니다."],
  },
  c8_gallery: {
    voice: ["오진우에게 전화해, 어머니께는 네가 직접 말하라고 한다.", "회사 규정대로, 퇴사 사실만 확인해 드리라고 한다.", "잘 지낸다고만 전하고, 반찬통은 우리가 대신 받아 두자고 한다."],
    echo: ["직접 말하게 하면 그는 오늘 밤 복수 말고 다른 일을 하나 하게 됩니다. 전화를 받을지는 모릅니다.", "규정대로 확인하면 거짓말은 없습니다. 어머니는 로비에서 그 사실을 혼자 듣게 됩니다.", "대신 받은 반찬통은 오늘을 조용하게 합니다. 그 조용함은 오진우가 모르는 채로 쌓입니다."],
  },
  c8_bait: {
    voice: ["도장을 찍은 두 사람을 협조자로 보호할 방법부터 만들겠다고 한다.", "진술서를 받고, 절차대로 참고인 명단에 올린다.", "실무자 이름은 빼고, 윗선의 흔적만 쓰겠다고 한다."],
    echo: ["보호 장치를 먼저 만들면 두 사람은 끝까지 말합니다. 그 장치를 만드는 동안 청산 시계는 멈추지 않습니다.", "참고인으로 올리면 진술은 단단해집니다. 두 사람의 이름도 같은 문서에서 단단해집니다.", "실무자를 빼면 빠릅니다. 도장 찍힌 서류는 그래도 그들의 이름으로 남아 있습니다."],
  },
  c9_ledger: {
    voice: ["차이 3억은 직원 퇴직금 쪽으로 맞추자고 한다.", "산정 기준표를 꺼내, 한 줄씩 대조해 보자고 한다.", "차이는 반올림 오차로 처리하고 넘어가자고 한다."],
    echo: ["퇴직금 쪽으로 맞추면 선의라는 답이 됩니다. 권도현은 그 선의가 누구 돈으로 계산됐는지 물을 겁니다.", "한 줄씩 대조하면 실수라는 답이 나올 수 있습니다. 실수를 찾는 데 새벽 한 시간이 들어갑니다.", "오차로 넘기면 둘 다 편합니다. 3억은 사라지지 않고 누군가의 퇴직금 칸에서 빠집니다."],
  },
  c9_family: {
    voice: ["결혼식 뒤로 고발 시점을 옮길 수 있는지, 권도현과 함께 따져 본다.", "일정과 상관없이, 고발 절차 시간표는 그대로 두자고 한다.", "청첩장 얘기는 꺼내지 않고, 오늘 일만 끝내자고 한다."],
    echo: ["시점을 따져 보면 그는 혼자가 아닙니다. 옮긴 5주 동안 장부를 고칠 시간도 함께 생깁니다.", "시간표를 지키면 고발은 흔들리지 않습니다. 기사는 결혼식보다 먼저 나갈 수 있습니다.", "꺼내지 않으면 오늘은 끝납니다. 청첩장은 내일도 잠금화면에 있습니다."],
  },
  c9_timing: {
    voice: ["잠든 사람은 깨우지 말자며, 남은 일을 나눠 맡는다.", "제보 서류를 체크리스트대로 한 번 더 검토하자고 한다.", "오늘은 여기까지라며, 각자 집으로 보낸다."],
    echo: ["나눠 맡은 밤은 길어집니다. 아침에 깬 사람은 자기 몫이 끝나 있는 걸 봅니다.", "한 번 더 본 서류는 검사반에서 되돌아오지 않습니다. 마감까지 남은 7시간 중 두 시간이 여기에 들어갑니다.", "집에 간 사람들은 잠을 잡니다. 제보 서류는 아침에 한 사람이 혼자 마감합니다."],
  },
  c10_locker: {
    voice: ["폐기는 막았다고 먼저 말해 안심시킨다.", "지금은 아무 말도 하지 말고 자라고 한다.", "명단의 실제 상태를 사실대로 말한다."],
    echo: ["안심시키면 그는 다시 잠듭니다. 폐기를 막은 방법까지는 아직 말하지 않았습니다.", "말을 막으면 십 분이 온전히 쉬는 시간이 됩니다. 그가 깨어 있는 다음 십 분은 언제일지 모릅니다.", "사실대로 말하면 그는 계산을 시작합니다. 절대 안정 4주 중 첫 십 분이 그 계산에 쓰입니다."],
  },
  c10_claim: {
    voice: ["열아홉 명을 한 건으로 묶어 집단 심의를 요구한다.", "한서윤의 기록은 빼고 열여덟 명으로 간다.", "개별 심의가 빠르다며 도윤하 건만 먼저 끝낸다."],
    echo: ["열아홉 건이 한 건이 되면 쟁점은 사람이 아니라 제도가 됩니다. 그 심의는 도윤하의 치료비보다 늦게 끝납니다.", "한 명을 빼면 표는 깨끗해집니다. 빠진 그 한 명은 이번에도 자기 2주를 개인 사정으로 남깁니다.", "한 건만 가면 이번 주에 끝납니다. 나머지 열여덟 명의 사유란은 그대로 개인 사정입니다."],
  },
  c10_relay: {
    voice: ["내 칸에 승진과 복귀를 잃는다고 적는다.", "잃을 것이 없다고 적고 표를 넘긴다.", "여섯 칸을 모두 공개하고 서로 검토하게 한다."],
    echo: ["당신 칸이 채워지면 표는 여섯 사람의 계약이 됩니다. 적은 것은 실제로 잃게 됩니다.", "잃을 것이 없다고 적으면 당신만 대가 없이 돕는 사람이 됩니다. 권도현은 그 칸을 믿지 않습니다.", "여섯 칸이 공개되면 누가 가장 많이 내는지 전부 압니다. 알고 나서도 그 자리에 남을지는 다른 문제입니다."],
  },
  c11_script: {
    voice: ["틀린 건 틀린 거라며, 고쳐 달라고 하고 드러나는 쪽을 택한다.", "국정감사 날까지만 그대로 두자고, 서하린에게 부탁한다.", "기사 내용은 기자의 일이라며, 판단을 맡기고 선을 긋는다."],
    echo: ["고친 기사는 더 단단해집니다. 오늘 밤부터 당신 집 앞에도 카메라가 옵니다.", "닷새는 숨을 수 있습니다. 출석하는 날 당신은 틀린 기사 속 사람으로 등장합니다.", "선을 그으면 기자는 자유롭게 씁니다. 다음 기사에서 무엇이 틀릴지는 당신이 고를 수 없습니다."],
  },
  c11_rehearsal: {
    voice: ["출석 전날, 두 사람이 같이 밥을 먹을 자리를 만든다.", "방청석 자리를 오진우 옆으로 바꿔 둔다.", "아버지 일은 오진우가 정할 일이라며, 묻지 않는다."],
    echo: ["같은 밥상은 어색합니다. 그래도 둘 중 누구도 먼저 일어나지 않습니다.", "옆자리는 말을 강요하지 않습니다. 대신 7분 동안 같은 방향을 보게 합니다.", "묻지 않으면 오진우는 혼자 정합니다. 그는 늘 그랬고, 그래서 늘 한 박자 늦었습니다."],
  },
  c11_sign: {
    voice: ["도윤하의 이름이 나오면, 내가 먼저 받아서 답하겠다고 한다.", "판 사람과 팔게 만든 구조를, 나눠서 말하자고 정한다.", "오늘은 방청석에 오지 않는 게 낫다고, 도윤하에게 말한다."],
    echo: ["먼저 받으면 도윤하는 그 질문을 직접 듣지 않습니다. 대신 당신 답변 40초가 거기에 쓰입니다.", "나눠서 말하면 문장이 길어집니다. 긴 문장은 방송에서 잘립니다.", "오지 않으면 그는 안전합니다. 3년을 센 사람이 그 방에 없었다는 것도 기록에 남습니다."],
  },
};

const lateSeasonReactionCopy = {
  c7_receipt: {
    voice: ["빚을 지지 않겠다는 그의 방식에 맞춰, 수첩도 정식 절차로 받겠다고 한다.", "사적인 기록이니 사적으로 받겠다고, 조용히 가져간다.", "수첩 없이도 된다며, 그의 증언만 받겠다고 한다."],
    echo: ["정식 절차로 받으면 수첩은 증거가 되고, 그는 위반자가 됩니다. 둘 다 기록에 남습니다.", "조용히 받으면 그는 안전하고, 그 수첩은 법정에서 존재한 적이 없게 됩니다.", "증언만 받으면 날짜는 남지 않습니다. 남는 것은 한 사람의 기억입니다."],
  },
  c7_teller: {
    voice: ["네 사람에게 각자 결정하게 하겠다며, 연락처를 받아 나온다.", "가장 위험이 적은 한 사람만 남기고 나머지는 지운다.", "이름은 전부 지우고 목표표의 숫자만 쓴다."],
    echo: ["각자 정하게 하면 시간이 갑니다. 정한 사람은 자기 이름을 자기가 올린 게 됩니다.", "한 사람만 남기면 그 한 사람이 전부를 감당합니다. 지점에서는 그 방식을 이미 봤습니다.", "숫자만으로도 목표표는 읽힙니다. 누가 그 목표를 받았는지는 읽히지 않습니다."],
  },
  c7_ticket: {
    voice: ["06:40에 실제로 역에 나가서, 가지 않는 장면을 기록으로 남긴다.", "표를 쓰고 내려가되, 자료 제출은 이미 끝내 둔다.", "표도 자료도 손대지 않고, 하루를 더 기다린다."],
    echo: ["가지 않는 장면은 강력합니다. 그 장면 이후 당신은 협상 대상이 아니라 사건이 됩니다.", "내려가면 소란은 없습니다. 자료는 이미 밖에 있고, 당신은 안에 없습니다.", "기다린 하루는 아무것도 바꾸지 않고, 권한 축소는 예정대로 적용됩니다."],
  },
  c8_sundae: {
    voice: ["전임자의 증언을 받아, 반려 경위서에 그대로 붙인다.", "증언은 받지 않고, 반려 승인 라인만 문서로 확인한다.", "과수원까지 끌어들이지 말자며, 고맙다고 하고 통화를 끝낸다."],
    echo: ["증언이 붙은 경위서는 반려가 실수가 아니었음을 말합니다. 그는 4년 만에 다시 그 일의 당사자가 됩니다.", "승인 라인은 누가 막았는지 보여줍니다. 왜 막았는지는 문서에 없습니다.", "끝낸 통화는 그를 과수원에 남겨 둡니다. 세 번의 반려는 여전히 이유 없는 반려입니다."],
  },
  c8_mother: {
    voice: ["반찬통을 들고, 오진우를 직접 찾아가겠다고 한다.", "반찬통은 택배로 보내고, 연락은 절차대로 하자고 한다.", "반찬통은 탕비실에 두고, 이 일에서 한발 물러서겠다고 한다."],
    echo: ["직접 찾아가면 그는 문을 열 수도, 안 열 수도 있습니다. 반찬통은 어느 쪽이든 전달됩니다.", "택배는 정확하게 도착합니다. 누가 보냈는지는 송장에 적힌 이름 하나로만 남습니다.", "한발 물러서면 복수는 그 혼자의 일이 됩니다. 탕비실의 계란말이는 내일이면 식습니다."],
  },
  c8_clerks: {
    voice: ["가장 적게 받은 두 사람의 이름이 가장 나중에 나오도록, 순서를 바꾼다.", "이름은 그대로 두고, 급여 대비 책임 비율을 옆에 붙인다.", "선명한 이름부터 써서, 수사를 빨리 열자고 한다."],
    echo: ["순서를 바꾸면 흔적표는 위에서부터 읽힙니다. 위쪽은 흐려서, 읽는 사람이 더 오래 봐야 합니다.", "비율을 붙이면 숫자가 두 사람을 변호합니다. 법정은 비율보다 도장을 먼저 봅니다.", "선명한 이름은 수사를 빠르게 엽니다. 가장 먼저 불려 가는 사람은 수습 3개월째입니다."],
  },
  c9_calc: {
    voice: ["열한 명의 퇴직금을, 고용 승계 조건에 못 박자고 한다.", "소멸 조항이 법적으로 맞는지, 근거부터 확인하자고 한다.", "퇴직금 3억은 승계 협상에서 쓸 양보 카드로 남겨 두자고 한다."],
    echo: ["못 박은 3억은 회생안의 비용이 됩니다. 채권단은 그 3억을 회수율에서 뺍니다.", "법적 근거를 확인하면 싸움은 정확해집니다. 열한 명은 그 사이 결과를 기다립니다.", "양보 카드는 협상을 부드럽게 합니다. 카드로 쓰인 퇴직금은 누군가의 22년입니다."],
  },
  c9_wedding: {
    voice: ["신부에게 직접 말할 수 있도록, 권도현 곁에 서겠다고 한다.", "결혼식과 무관하게, 법적 일정대로 가자고 한다.", "가족 일에는 끼어들지 않겠다고, 조용히 선을 긋는다."],
    echo: ["곁에 서면 그는 말할 수 있습니다. 당신은 남의 결혼식에서 가장 불편한 손님이 됩니다.", "법적 일정은 흔들리지 않습니다. 권도현은 흔들리는 마음을 혼자 감당합니다.", "선을 그으면 당신은 계산서 밖에 남습니다. 그가 원한 게 그것인지는 모릅니다."],
  },
  c9_night: {
    voice: ["반재욱이 찢어 준 한 장을, 결의 자료 맨 앞에 붙인다.", "수첩 한 장은 증거가 아니라며, 따로 보관해 둔다.", "감상은 나중에 하자며, 서류 마감부터 챙긴다."],
    echo: ["맨 앞에 붙은 한 장은 채권단이 가장 먼저 읽습니다. 숫자가 아닌 줄이 결의 자료에 들어간 건 처음입니다.", "따로 둔 한 장은 누구에게도 설명할 필요가 없습니다. 그래서 오래 남습니다.", "마감은 지켜집니다. 반재욱은 창가에 조금 더 서 있다가 재킷 없이 퇴근합니다."],
  },
  c10_ward: {
    voice: ["4,300만 원을 미지급 임금으로 정식 청구한다.", "숫자로 만들면 선의가 훼손된다며 그대로 둔다.", "그 계산은 제도 개선 근거 자료로만 쓴다."],
    echo: ["청구하면 그 시간은 처음으로 회계에 잡힙니다. 청구서를 받은 쪽은 그를 문제 직원으로 분류합니다.", "두면 선의는 선의로 남습니다. 회계에 잡히지 않는 비용은 다음 사람에게도 청구되지 않습니다.", "근거 자료로만 쓰면 제도는 바뀝니다. 도윤하 개인에게 돌아오는 돈은 없습니다."],
  },
  c10_pills: {
    voice: ["그 2주를 기록에 사실대로 다시 쓰게 한다.", "본인이 원하지 않으면 그 기록은 그대로 둔다.", "당사자 동의를 받아 열아홉 번째 사례로 넣는다."],
    echo: ["다시 쓰면 열아홉 건이 전부 같은 이름의 사유를 갖습니다. 한서윤은 자기 서명을 후회한다고 적어야 합니다.", "그대로 두면 그는 계속 압박하는 쪽에 설 수 있습니다. 열아홉 번째 칸은 영영 비어 있습니다.", "동의를 받으면 사례는 완전해집니다. 동의를 구하는 그 대화가 두 사람 사이를 바꿉니다."],
  },
  c10_ledger: {
    voice: ["지우고 다시 쓴 그 줄을 못 본 척하고 표를 넘긴다.", "288명은 너무 많다며 칸을 다시 나눈다.", "아버지를 한번 만나러 가자고 말한다."],
    echo: ["못 본 척하면 그는 288명을 끝까지 셉니다. 무엇을 증명하려는지는 아무도 묻지 않습니다.", "다시 나누면 그의 몫이 줄어듭니다. 그는 그것을 또 한 번 밀려나는 것으로 읽을 수 있습니다.", "만나러 가면 그 하루가 표에서 빠집니다. 아버지가 아들을 어떻게 볼지는 아무도 모릅니다."],
  },
  c11_press: {
    voice: ["도윤하가 먼저 알아야 한다며, 알리고 대응을 같이 정한다.", "표창 사진이 어디서 퍼졌는지, 그 계정부터 확인한다.", "댓글은 보지 말자고 하고, 출석 준비에만 집중한다."],
    echo: ["먼저 들은 소식은 덜 아픕니다. 도윤하는 그날 밤 휴대폰을 끄지 않고 댓글을 끝까지 읽습니다.", "계정을 따라가면 그룹 홍보 대행사의 이름이 나옵니다. 그걸 확인하는 데 하루가 듭니다.", "준비는 끝납니다. 도윤하는 그 댓글을 혼자 읽습니다."],
  },
  c11_father: {
    voice: ["휴대폰을 오진우 손에 다시 쥐여 준다.", "대신 인사를 드리고, 출석 날 뵙자고 한다.", "잠깐 자리를 비켜, 두 사람만 남긴다."],
    echo: ["손에 쥐여 주면 그는 말해야 합니다. 첫마디는 '밥은 드셨어요'입니다.", "대신 인사하면 통화는 부드럽게 끝납니다. 오진우가 하려던 말은 출석 날까지 미뤄집니다.", "자리를 비키면 계단참에는 오진우만 남습니다. 통화는 11분 동안 이어집니다."],
  },
  c11_eve: {
    voice: ["질의 첫 1분에, 취소 공지부터 꺼낸다.", "의원실에 먼저 넘겨서, 의원이 묻게 한다.", "사유서는 건드리지 않고, 내 이야기에만 집중한다."],
    echo: ["첫 1분에 꺼내면 방의 공기가 바뀝니다. 남은 6분은 전부 그 빈 의자를 위한 시간이 됩니다.", "의원이 물으면 무게가 실립니다. 그 질문이 누구의 공이 될지는 의원실이 정합니다.", "당신 이야기는 온전히 남습니다. 사라진 일정은 다음 날 기사 한 줄로만 나옵니다."],
  },
};

for (const pack of CASE_PACKS) {
  connectiveScenes.push(...pack.connectiveScenes);
  Object.assign(lateSeasonChoiceEffects, pack.choiceEffects);
  Object.assign(lateSeasonReactionEffects, pack.reactionEffects);
  Object.assign(lateSeasonChoiceCopy, pack.choiceCopy);
  Object.assign(lateSeasonReactionCopy, pack.reactionCopy);
}

function getAuthoredSceneEffects(sourceId, id) {
  const table = id.endsWith("_reaction")
    ? { ...authoredSceneReactionEffects, ...lateSeasonReactionEffects }
    : { ...authoredSceneChoiceEffects, ...lateSeasonChoiceEffects };
  const effects = table[sourceId];
  if (!effects) {
    throw new Error(`Missing authored choice effects for generated scene source: ${sourceId} (${id})`);
  }
  return effects;
}

function getAuthoredSceneCopy(sourceId, id) {
  const table = id.endsWith("_reaction")
    ? { ...authoredSceneReactionCopy, ...lateSeasonReactionCopy }
    : { ...authoredSceneChoiceCopy, ...lateSeasonChoiceCopy };
  const copy = table[sourceId];
  if (!copy) {
    throw new Error(`Missing authored choice copy for generated scene source: ${sourceId} (${id})`);
  }
  return copy;
}

// The fourth option each case adds is a reframe of the case itself, so it
// reads as its own cognitive move rather than another risk call.
const connectiveCognitions = [{ persistence: 1 }, { inference: 1 }, { risk: 1 }, { reframing: 2 }];

function addConnectiveScene([id, sourceId, nextId, title, speaker, text, memo, labels]) {
  const source = nodes[sourceId];
  if (!source) return;
  const effects = getAuthoredSceneEffects(sourceId, id);
  const copy = getAuthoredSceneCopy(sourceId, id);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    // A phase is printed on the scene chip and in the mission strip, so it is
    // player-facing copy, not a pipeline label. These scenes were shipping as
    // "CONNECTIVE SCENE" -- the name of the function that builds them -- for the
    // same reason the reaction, branch and route-final families read as build
    // steps. They are all the same story beat: the part that happens outside
    // the meeting that was scheduled.
    phase: "OFF THE RECORD",
    title,
    speaker,
    text,
    memo,
    triggers: source.triggers,
    choices: labels.map((label, index) => {
      const choice = {
        id: `${id}_choice_${index + 1}`,
        label,
        effect: effects[index],
        next: nextId,
        cognition: connectiveCognitions[index] ?? { reframing: 2 },
      };
      choiceVoiceLines[choice.id] = copy.voice[index];
      echoReplies[choice.id] = copy.echo[index];
      return choice;
    }),
  };
}

connectiveScenes.forEach(addConnectiveScene);

const connectiveOrders = {
  case01: [["accounting", "c1_witness"], ["payday", "c1_assembly"], ["competitor", "c1_bargain"], ["board", "c1_verdict"]],
  case02: [["c2_logs", "c2_trace"], ["c2_meeting", "c2_witness"], ["c2_pressure", "c2_judgment"]],
  case03: [["c3_split", "c3_rival"], ["c3_score", "c3_signal"], ["c3_trap", "c3_verdict"]],
  case04: [["c4_offer", "c4_audit"], ["c4_leak", "c4_public"], ["c4_vote", "c4_verdict"]],
  case05: [["c5_map", "c5_pattern"], ["c5_blame", "c5_voice"], ["c5_collapse", "c5_verdict"]],
  case06: [["c6_desk", "c6_kitchen"], ["c6_logs", "c6_family"], ["c6_panel", "c6_ledger"]],
  case07: [["c7_ledger", "c7_receipt"], ["c7_counter", "c7_teller"], ["c7_paper", "c7_ticket"]],
  case08: [["c8_trail", "c8_sundae"], ["c8_gallery", "c8_mother"], ["c8_bait", "c8_clerks"]],
  case09: [["c9_ledger", "c9_calc"], ["c9_family", "c9_wedding"], ["c9_timing", "c9_night"]],
  case10: [["c10_locker", "c10_ward"], ["c10_claim", "c10_pills"], ["c10_relay", "c10_ledger"]],
  case11: [["c11_script", "c11_press"], ["c11_rehearsal", "c11_father"], ["c11_sign", "c11_eve"]],
  final: [["f_archive", "f_witness"], ["f_confront", "f_dilemma"]],
};

CASE_PACKS.forEach((pack) => {
  connectiveOrders[pack.id] = pack.connectiveOrder;
});

Object.entries(connectiveOrders).forEach(([caseId, pairs]) => {
  pairs.forEach(([sourceId, bridgeId]) => {
    const order = nodeOrders[caseId];
    const index = order.indexOf(sourceId);
    if (index >= 0) order.splice(index + 1, 0, bridgeId);
  });
});

const reactionScenes = [
  ["c1_witness_reaction", "c1_witness", "payday", "증언 뒤의 침묵", "한서윤", "증언이 시작되자 회계팀 전체가 말을 멈췄습니다. 누구를 보호하느냐에 따라 내일의 보고서가 완전히 달라집니다.", ["증언자를 보호하고 팀 전체에 기준을 설명한다", "증언을 문서로만 남기고 회의를 끝낸다", "CFO에게 먼저 반응할 기회를 준다"]],
  ["c1_assembly_reaction", "c1_assembly", "competitor", "급여일의 첫 문자", "에코", "첫 급여가 입금되기 전, 직원 단체방에 서로 다른 소문이 올라왔습니다. 정정할수록 더 많은 질문이 생깁니다.", ["사실과 아직 모르는 것을 함께 알린다", "입금 확인 뒤에 한 번에 공지한다", "소문을 만든 사람을 먼저 찾는다"]],
  ["c1_bargain_reaction", "c1_bargain", "board", "협상장의 빈 의자", "도윤하", "협상 상대가 자리에 오지 않았습니다. 그 빈 의자는 인수에서 제외될 사람들의 자리처럼 보입니다.", ["빈 의자의 사람들을 협상에 부른다", "조건표를 먼저 완성해 협상을 이어간다", "상대가 돌아올 때까지 침묵한다"]],
  ["c1_verdict_reaction", "c1_verdict", "final", "결론 전 마지막 질문", "반재욱", "모두가 당신에게 결론을 요구하지만, 반재욱은 마지막으로 묻습니다. 이 결론을 가장 먼저 듣게 될 사람은 누구입니까.", ["가장 큰 피해를 받는 사람에게 먼저 설명한다", "투자자에게 근거부터 제출한다", "회의록에 책임자만 남긴다"]],
  ["c2_trace_reaction", "c2_trace", "c2_meeting", "11초 뒤의 접속", "에코", "빈틈을 재현하자 다른 계정이 깨어났습니다. 오류를 고치면 진실도 함께 사라질 수 있습니다.", ["기록을 보존한 채 접근을 막는다", "계정을 따라가 원인을 확인한다", "전체 시스템을 초기화한다"]],
  ["c2_witness_reaction", "c2_witness", "c2_pressure", "보호받은 사람의 말", "반재욱", "이민서는 처음으로 자신이 보호받는 것이 두렵다고 말합니다. 보호는 때로 의심받을 기회를 빼앗습니다.", ["이민서가 직접 말할 수 있는 절차를 만든다", "대신 진술해 위험을 줄인다", "보호를 해제하고 조사에 맡긴다"]],
  ["c2_judgment_reaction", "c2_judgment", "c2_final", "익명성의 가격", "도윤하", "익명 증언을 붙이면 진실은 커지지만, 누구도 그 책임을 지지 않습니다. 보고서의 문장 하나가 사람들의 이름을 바꿀 수 있습니다.", ["익명성을 지키며 증언의 한계를 쓴다", "실명을 확인한 뒤 보고한다", "증언을 빼고 기록만 제출한다"]],
  ["c3_rival_reaction", "c3_rival", "c3_score", "경쟁자의 제안", "오진우", "오진우는 자신의 안을 훔쳐도 좋다고 말합니다. 대신 당신이 그 안을 어떻게 바꾸는지 보고 싶다고 합니다.", ["공동 검증 조건을 제안한다", "자료 출처를 따져 협상을 멈춘다", "상대의 안을 이용해 먼저 제출한다"]],
  ["c3_signal_reaction", "c3_signal", "c3_trap", "두 번 깜빡인 불", "한서윤", "신호가 다시 깜빡였습니다. 이번에는 고객 대표도 보았습니다. 하지만 누구도 먼저 그 의미를 말하지 않습니다.", ["모두 앞에서 신호의 의미를 질문한다", "발표를 계속하며 신호를 기록한다", "신호를 무시하고 점수부터 확보한다"]],
  ["c3_verdict_reaction", "c3_verdict", "c3_final", "승부 뒤의 책임표", "에코", "누가 이겼는지는 이미 결정됐지만 책임표는 비어 있습니다. 성공한 뒤의 실패를 누가 설명할지 정해야 합니다.", ["책임표를 공동으로 작성한다", "내 이름을 가장 위에 적는다", "성과가 난 뒤에 책임을 논의한다"]],
  ["c4_audit_reaction", "c4_audit", "c4_leak", "3%를 본 사람들", "도윤하", "이용자 대표들이 각자의 3%를 말하기 시작했습니다. 숫자를 맞추는 일은 쉬웠지만, 누구의 3%를 먼저 볼지는 어려웠습니다.", ["가장 취약한 이용자부터 기준을 세운다", "전체 평균을 기준으로 삼는다", "심사관의 기준만 따른다"]],
  ["c4_public_reaction", "c4_public", "c4_vote", "기사의 제목", "반재욱", "기자는 세 문장 중 하나만 쓸 수 있다고 합니다. 어떤 문장을 고르느냐에 따라 선의는 개혁이 되거나 은폐가 됩니다.", ["모르는 부분까지 포함한 문장을 고른다", "서비스가 유지된다는 결과를 강조한다", "논란을 만들 표현을 모두 뺀다"]],
  ["c4_verdict_reaction", "c4_verdict", "c4_final", "감사실의 문", "에코", "감사실 문 앞에 서자 내부 자료를 넘긴 사람이 나타났습니다. 그는 규칙을 지킨 사람이 가장 큰 피해를 보았다고 말합니다.", ["자료를 공개하고 규칙을 다시 쓴다", "제보자를 보호한 뒤 내부에서 해결한다", "문을 닫고 심사 결과를 기다린다"]],
  ["c5_pattern_reaction", "c5_pattern", "c5_blame", "화살표를 거꾸로", "에코", "지도를 뒤집자 피해자에게 책임 화살표가 향했습니다. 누군가 만든 분류 방식이 실패를 더 오래 유지하고 있었습니다.", ["분류 방식을 폐기하고 다시 듣는다", "가장 큰 승인자만 조사한다", "기존 지도를 유지한 채 보완한다"]],
  ["c5_voice_reaction", "c5_voice", "c5_collapse", "말할 수 있는 조건", "한서윤", "증언자는 말할 준비가 됐지만, 팀을 떠나야만 안전합니다. 진실을 얻는 대신 조직을 잃을 수 있습니다.", ["떠나지 않아도 말할 수 있게 보호한다", "증언 뒤에 즉시 조직을 바꾼다", "조직을 지키기 위해 증언을 보류한다"]],
  ["c5_verdict_reaction", "c5_verdict", "c5_final", "책임의 다음 날", "도윤하", "책임을 발표한 다음 날에도 피해는 그대로였습니다. 누군가를 지목한 말보다, 무엇을 되돌릴지가 더 급해졌습니다.", ["피해 복구를 발표의 첫 문장으로 둔다", "책임자의 사과를 먼저 받는다", "개선 계획이 완성될 때까지 침묵한다"]],
  ["c6_kitchen_reaction", "c6_kitchen", "c6_logs", "씻어 둔 컵", "반재욱", "반재욱이 컵을 엎어 말려 둔 자리에 포스트잇을 붙입니다. '쓰지 마시오'가 아니라 '오진우'라고만 적혀 있습니다. 그는 그게 무슨 뜻이냐는 질문에 답하지 않습니다.", ["이름표를 그대로 둔다", "자리 정리 절차를 함께 연다", "오늘 안에 자리를 비운다"]],
  ["c6_family_reaction", "c6_family", "c6_panel", "축하 자리", "도윤하", "누나가 회식 날짜를 다시 물어왔습니다. 도윤하가 조용히 말합니다. '거짓말을 하라는 게 아니라, 오늘은 대답하지 말라는 겁니다.' 그 말이 맞는지는 아무도 모릅니다.", ["오늘은 답하지 않는다", "회사 공식 창구가 답하게 한다", "지금 사실대로 전한다"]],
  ["c6_ledger_reaction", "c6_ledger", "c6_final", "대조군", "에코", "에코는 어느 쪽이 대조군인지 끝내 말하지 않습니다. 대신 한 줄을 띄웁니다. '대조군은 실험을 모르는 쪽입니다.' 당신은 지금 알고 있습니다.", ["내 프로필까지 함께 올린다", "두 장 다 봉인한다", "아는 것을 쓰지 않고 넘어간다"]],
  ["c7_receipt_reaction", "c7_receipt", "c7_counter", "가방에서 나온 것", "반재욱", "영수증 문제가 끝나자 반재욱이 가방을 엽니다. 수첩은 비닐에 싸여 있습니다. 4년째 같은 비닐입니다. '이걸 어떻게 받을지는 당신이 정하십시오. 나는 어느 쪽이든 오늘 안에 사표를 씁니다.'", ["정식 절차로 접수한다", "사적으로 받아 그를 남긴다", "수첩 없이 증언만 받는다"]],
  ["c7_teller_reaction", "c7_teller", "c7_paper", "네 개의 이름", "도윤하", "목표표에는 그해 창구 담당 네 명의 이름이 있습니다. 도윤하가 그중 하나입니다. '제 이름은 제가 올릴게요. 나머지 세 사람은 저도 못 정합니다.'", ["네 사람에게 각자 정하게 한다", "한 사람만 남기고 지운다", "이름은 전부 지우고 숫자만 쓴다"]],
  ["c7_ticket_reaction", "c7_ticket", "c7_final", "06:40", "에코", "에코가 발권 기록 옆에 한 줄을 더 띄웁니다. '이 노선의 지난 3년 발권 기록 중 같은 패턴이 여섯 건 있습니다. 여섯 명 전원이 탑승했습니다.' 당신이 일곱 번째입니다.", ["역에 나가서 타지 않는다", "내려가되 자료는 먼저 보낸다", "하루를 더 기다린다"]],
  ["c8_sundae_reaction", "c8_sundae", "c8_gallery", "전임자의 목소리", "나준혁", "전임자는 춘천에서 과수원을 합니다. 전화기 너머로 경운기 소리가 들립니다. '세 번 올렸어요. 세 번째 반려 때 인사 면담을 했고, 네 번째는 안 올렸죠. 그 사람들은 올리는 사람보다 반려하는 사람을 먼저 봐요.' 옆에서 듣던 나준혁 지점장이 조용히 커피잔을 내려놓습니다.", ["그의 증언을 받아 반려 경위서에 붙인다", "반려 승인 라인만 문서로 확인한다", "과수원까지 끌어들이지 않고 통화를 끝낸다"]],
  ["c8_mother_reaction", "c8_mother", "c8_bait", "계란말이", "도윤하", "도윤하가 반찬통을 들고 4층으로 올라옵니다. 멸치볶음, 깻잎, 그리고 오진우가 어릴 때 좋아했다는 계란말이. 도윤하가 통을 열다 말고 웃습니다. '이거 우리가 먹으면 안 되겠죠.' 둘 다 한 조각씩 먹습니다. 그리고 도윤하가 말합니다. '복수를 하든 뭘 하든, 밥은 먹고 하게 해야죠.'", ["반찬통을 들고 오진우를 직접 찾아간다", "반찬통은 택배로 보내고 연락은 절차대로 한다", "반찬통은 탕비실에 두고 이 일에서 한발 물러선다"]],
  ["c8_clerks_reaction", "c8_clerks", "c8_final", "수습 3개월", "에코", "에코가 두 직원의 급여 이체 내역을 띄웁니다. 수습 직원의 월급은 그가 도장을 찍은 그림값의 0.2%입니다. '흔적은 위로 올라갈수록 흐려지고, 아래로 내려올수록 이름이 선명해집니다. 이 표에서 가장 선명한 이름은 가장 적게 받은 사람입니다.'", ["두 사람의 이름을 가장 나중에 쓰도록 순서를 바꾼다", "이름은 그대로 두고 급여 대비 책임 비율을 붙인다", "선명한 이름부터 써서 수사를 빨리 연다"]],
  ["c9_calc_reaction", "c9_calc", "c9_family", "3억의 이름", "에코", "에코가 3억의 내역을 띄웁니다. 차이는 22년 동안 일한 물류 직원 열한 명의 퇴직금 누적분입니다. 권도현의 계산에서는 회사를 넘기는 순간 사라지고, 당신의 계산에서는 그대로 지급됩니다. '같은 회사를 살리는 계산서 두 장이, 열한 명의 22년을 두고 갈라집니다.'", ["열한 명의 퇴직금을 승계 조건에 못 박는다", "소멸 조항의 법적 근거부터 확인한다", "승계 협상에서 쓸 양보 카드로 남겨 둔다"]],
  ["c9_wedding_reaction", "c9_wedding", "c9_timing", "혼주석", "권도현", "권도현이 휴대폰을 뒤집어 놓습니다. '작은아버지가 혼주석에 앉는 걸 막으면 신부가 이유를 묻겠죠. 저는 그 이유를 말할 자신이 없습니다.' 그가 단 커피를 한 모금 마시고 얼굴을 찡그립니다. '그렇다고 등록금 받은 값으로 1,140명을 계산할 수도 없고요.'", ["신부에게 직접 말할 수 있도록 그의 곁에 선다", "결혼식과 무관하게 법적 일정대로 간다", "가족 일에는 끼어들지 않겠다고 선을 긋는다"]],
  ["c9_night_reaction", "c9_night", "c9_final", "재킷", "반재욱", "반재욱이 재킷 없이 창가에 서서 말합니다. '나는 사람을 자르는 일을 20년 했습니다. 오늘 처음으로 사람을 남기는 서류를 씁니다.' 그가 수첩 마지막 장을 찢어 건넵니다. 마흔한 명의 이름 아래에 한 줄이 새로 적혀 있습니다. '1,140 -- 남김.'", ["그 한 장을 결의 자료 맨 앞에 붙인다", "수첩 한 장은 증거가 아니니 따로 보관한다", "감상은 나중에 하고 서류 마감부터 챙긴다"]],
  ["c10_ward_reaction", "c10_ward", "c10_claim", "회계에 잡히지 않는 것", "에코", "에코가 병실 밖 복도에서 계산을 띄웁니다. 도윤하의 3년치 초과근무 4,180시간 중 명단 관련이 2,940시간. 시급으로 환산하면 4,300만 원입니다. 청구된 적은 없습니다. '선의는 회계에 잡히지 않습니다. 잡히지 않는 비용은 줄어들지도 않습니다. 이 2,940시간은 이 조직의 장부 어디에도 지출로 기록된 적이 없습니다.'", ["4,300만 원을 미지급 임금으로 정식 청구한다", "숫자로 만들면 선의가 훼손된다며 그대로 둔다", "그 계산은 제도 개선 근거 자료로만 쓴다"]],
  ["c10_pills_reaction", "c10_pills", "c10_relay", "2년 전 2주", "한서윤", "한서윤이 자기 병가 기록을 엽니다. 사유란: 개인 사정. 실제 날짜는 3년 전 플로우온 승인란에 서명한 뒤 두 달째 되는 날입니다. '저는 그때 아무한테도 말 안 했습니다. 말하면 제가 그 서명을 후회한다는 뜻이 되니까요.' 그가 화면을 닫으려다 손을 멈춥니다. '그런데 열아홉 명 중 열여덟 명도 같은 이유로 말을 안 했겠죠.'", ["그 2주를 기록에 사실대로 다시 쓰게 한다", "본인이 원하지 않으면 그 기록은 그대로 둔다", "당사자 동의를 받아 열아홉 번째 사례로 넣는다"]],
  ["c10_ledger_reaction", "c10_ledger", "c10_final", "오진우의 칸", "오진우", "오진우의 칸에는 '승진 순번'이라고 적혀 있습니다. 그런데 종이를 기울이면 지우고 다시 쓴 자국 아래로 원래 문장이 비칩니다. '아버지에게 할 말.' 그가 288명을 가져간 이유입니다. 아버지는 승인을 하루 늦춰 지점에서 밀려났고, 아들은 그 하루가 옳았다는 걸 288번 증명하려 합니다.", ["지우고 다시 쓴 그 줄을 못 본 척하고 표를 넘긴다", "288명은 너무 많다며 칸을 다시 나눈다", "아버지를 한번 만나러 가자고 말한다"]],
  ["c11_press_reaction", "c11_press", "c11_rehearsal", "검색어 3위", "에코", "에코가 지난 48시간의 검색 기록을 띄웁니다. 'KD은행 A씨'가 검색어 3위이고, 연관 검색어에 도윤하의 이름이 있습니다. 강서지점 실적 1위 표창 사진이 퍼졌고, 댓글 1,200개 중 공감을 가장 많이 받은 문장은 '판 사람도 공범 아닌가요'입니다. '당신이 드러나지 않는 동안, 사람들은 드러난 얼굴을 대신 찾습니다.'", ["도윤하에게 먼저 알리고 대응을 같이 정한다", "표창 사진을 퍼뜨린 계정부터 확인한다", "댓글은 보지 말자고 하고 출석 준비에만 집중한다"]],
  ["c11_father_reaction", "c11_father", "c11_sign", "늦춘 하루", "오진우", "오상철이 먼저 전화를 걸어왔습니다. 오진우가 스피커를 켭니다. 쉰 목소리가 한참 망설이다 말합니다. '그날 하루 늦춘 거, 나는 아직도 잘했다고 생각한다. 그런데 그게 너한테 3년 동안 무슨 뜻이었는지는 한 번도 안 물어봤더라.' 오진우가 대답하지 못하고 휴대폰을 당신 쪽으로 밉니다. 통화 시간이 1분, 2분 넘어갑니다.", ["휴대폰을 오진우 손에 다시 쥐여 준다", "당신이 대신 인사하고 출석 날 뵙자고 한다", "잠깐 자리를 비켜 두 사람만 남긴다"]],
  ["c11_eve_reaction", "c11_eve", "c11_final", "불출석 사유서", "에코", "국회 게시판에 윤상혁의 불출석 사유서(증인이 나오지 못하는 이유를 적어 내는 문서)가 올라옵니다. 사유는 '싱가포르 투자 설명회 참석'. 에코가 한 줄을 겹쳐 띄웁니다. 그 설명회 주최 측의 공지입니다. '행사는 주최 측 사정으로 취소되었습니다.' 공지 날짜는 사흘 전입니다. '사유서는 이미 사라진 일정 위에 쓰였습니다. 이 사실을 언제 말하느냐가 7분의 모양을 정합니다.'", ["질의 첫 1분에 취소 공지부터 꺼낸다", "의원실에 먼저 넘겨 의원이 묻게 한다", "사유서는 건드리지 않고 내 이야기에만 집중한다"]],
  ["f_witness_reaction", "f_witness", "f_confront", "첫 참가자의 선택", "반재욱", "첫 참가자는 자신의 기록을 돌려달라고 요청합니다. 하지만 기록을 돌려주면 지금까지의 실험 전체가 흔들립니다.", ["기록을 돌려주고 실험을 다시 설명한다", "기록을 증거로 보관하고 동의를 요청한다", "기록을 삭제해 피해를 끝낸다"]],
  ["f_dilemma_reaction", "f_dilemma", "f_choice", "종료 버튼 앞에서", "에코", "종료 버튼 위에는 당신의 이름이 표시되어 있습니다. 누르는 순간 실험은 끝나지만, 책임도 당신에게 남습니다.", ["참가자들과 함께 종료 조건을 정한다", "내가 혼자 버튼을 누른다", "버튼을 숨기고 시스템을 지켜본다"]],
];

const authoredReactionMemos = {
  c1_witness_reaction: ["보호 약속이 실제 기록으로 남았는지", "다음 급여표에 반영될 책임"],
  c1_assembly_reaction: ["질문이 사라진 급여 공지", "익명 의견을 보호할 창구"],
  c1_bargain_reaction: ["협상장에 들어오지 못한 사람", "조건을 승인할 이름"],
  c1_verdict_reaction: ["결론보다 먼저 확인할 피해", "다음 의사록에 남길 질문"],
  c2_trace_reaction: ["복원된 11초의 앞뒤 기록", "접근 권한을 다시 열 조건"],
  c2_witness_reaction: ["보호와 침묵을 구분하는 절차", "당사자가 고를 수 있는 공개 범위"],
  c2_judgment_reaction: ["익명 증언의 검증 경로", "보고서 밖 목소리를 보존할 위치"],
  c3_rival_reaction: ["경쟁안이 숨긴 책임 조항", "공동 검증을 시작할 증거"],
  c3_signal_reaction: ["두 번 깜빡인 신호의 출처", "발표를 멈춘 비용의 책임"],
  c3_verdict_reaction: ["승리 후 비어 있는 책임표", "공동 발표가 남길 약속"],
  c4_audit_reaction: ["이용자마다 다른 3%의 의미", "기준을 바꿀 때 공개할 산식"],
  c4_public_reaction: ["기사 제목에서 빠질 사실", "서비스 유지와 피해 복구의 순서"],
  c4_verdict_reaction: ["규칙을 지킨 사람의 손실", "제보 자료를 다시 쓸 권한"],
  c5_pattern_reaction: ["책임 화살표가 향한 방향", "분류 밖에서 다시 들을 목소리"],
  c5_voice_reaction: ["증언을 가능하게 할 안전 조건", "조직을 떠나지 않고 말할 권리"],
  c5_verdict_reaction: ["발표 뒤에도 남은 피해", "복구 순서를 정할 사람"],
  c6_kitchen_reaction: ["돌아올 자리를 남기는 방식", "이름표를 뗄 권한"],
  c7_receipt_reaction: ["빚지지 않는 사람에게 부탁하는 법", "사표가 먼저 나가는 순서"],
  c7_teller_reaction: ["자기 이름을 자기가 올릴 권리", "정년 한 해 앞의 증인"],
  c7_ticket_reaction: ["여섯 명이 전부 탄 노선", "타지 않는 장면의 값"],
  c8_sundae_reaction: ["세 번 반려된 보고서의 네 번째", "올리는 사람보다 먼저 보이는 반려자"],
  c8_mother_reaction: ["복수보다 먼저 먹어야 할 밥", "모르는 채로 걱정하는 가족"],
  c8_clerks_reaction: ["가장 적게 받고 가장 선명한 이름", "흔적표를 읽는 순서"],
  c9_calc_reaction: ["열한 명의 22년", "승계 조건에 못 박을 숫자"],
  c9_wedding_reaction: ["혼주석에 앉을 사람", "말할 자신이 없는 이유"],
  c9_night_reaction: ["자르는 서류와 남기는 서류", "결의 자료 맨 앞의 한 줄"],
  c10_ward_reaction: ["장부에 없는 2,940시간", "청구되지 않은 4,300만 원"],
  c10_pills_reaction: ["사유란에 적히지 않은 이유", "열아홉 번째로 비어 있는 칸"],
  c10_ledger_reaction: ["지우고 다시 쓴 한 줄", "288이라는 숫자의 출처"],
  c11_press_reaction: ["연관 검색어에 오른 도윤하", "공감 1위 댓글: 판 사람도 공범"],
  c11_father_reaction: ["3년 만의 부자 통화", "잘했다는 말과 묻지 못한 말"],
  c11_eve_reaction: ["사라진 일정 위에 쓰인 사유서", "7분 중 언제 꺼낼지"],
  c6_family_reaction: ["오늘 답하지 않을 권한", "미룬 말에 붙는 이자"],
  c6_ledger_reaction: ["아는 쪽과 모르는 쪽", "위원회에 들어갈 문장"],
  f_witness_reaction: ["이전 참가자가 돌려받을 기록", "동의 없이 복제된 문장"],
  f_dilemma_reaction: ["종료 버튼을 누를 권한", "참가자들과 합의할 종료 조건"],
};

for (const pack of CASE_PACKS) {
  reactionScenes.push(...pack.reactionScenes);
  Object.assign(authoredReactionMemos, pack.reactionMemos);
}

function addReactionScene([id, sourceId, nextId, title, speaker, text, labels]) {
  const source = nodes[sourceId];
  if (!source) return;
  const effects = getAuthoredSceneEffects(sourceId, id);
  const copy = getAuthoredSceneCopy(sourceId, id);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    phase: "THE ROOM AFTER",
    title,
    speaker,
    text,
    memo: authoredReactionMemos[id] ?? ["다음 선택에 남은 비용", "다음 장면에서 다시 확인할 말"],
    triggers: source.triggers,
    choices: labels.map((label, index) => {
      const choice = {
        id: `${id}_choice_${index + 1}`,
        label,
        effect: effects[index],
        next: nextId,
        cognition: index === 0 ? { reframing: 1 } : index === 1 ? { inference: 1 } : { risk: 1 },
      };
      choiceVoiceLines[choice.id] = copy.voice[index];
      echoReplies[choice.id] = copy.echo[index];
      return choice;
    }),
  };
}

reactionScenes.forEach(addReactionScene);

reactionScenes.forEach(([id, sourceId]) => {
  Object.entries(nodeOrders).forEach(([, order]) => {
    const index = order.indexOf(sourceId);
    if (index >= 0) order.splice(index + 1, 0, id);
  });
});

// Each case has one authored detour. The second scene always rejoins the existing route.
const authoredBranchScenes = {
  c1_branch_people: {
    phase: "SIDE DOOR",
    title: "누가 빈칸을 채우는가",
    speaker: "도윤하",
    text: "협상서의 빈칸을 사람의 이름으로 채우려는 순간, 숫자로 미뤄 둔 책임이 모두 드러났습니다.",
    memo: ["협력사 지급 보장", "남겨질 직원의 고용 기간", "인수 이후 책임 주체"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c1_branch_people_a", label: "남겨질 사람부터 협상서에 적는다", effect: { trust: 8, humanCost: -4, capital: -9, fatigue: 4 }, next: "c1_branch_people_follow", cognition: { reframing: 2 } },
      { id: "c1_branch_people_b", label: "협력사 지급일을 먼저 고정한다", effect: { legitimacy: 6, time: -5, trust: 3, humanCost: 2 }, next: "c1_branch_people_follow", cognition: { inference: 1 } },
      { id: "c1_branch_people_c", label: "인수 조건만 남기고 서명한다", effect: { capital: 9, trust: -7, humanCost: 5, fatigue: -3 }, next: "c1_branch_people_follow", cognition: { risk: 2 } },
    ],
  },
  c1_branch_people_follow: {
    phase: "SIDE DOOR",
    title: "서명 뒤의 첫 전화",
    speaker: "에코",
    text: "서명은 끝났지만 첫 전화는 계약서에 없는 사람에게서 왔습니다. 이제 빈칸은 비용이 아니라 약속의 형태가 됩니다.",
    memo: ["계약서 밖의 이해관계자", "첫 지급 이후의 책임", "약속을 검증할 기록"],
    triggers: ["trust", "responsibility"],
    choices: [
      { id: "c1_branch_people_follow_a", label: "약속을 공개 기록으로 남긴다", effect: { legitimacy: 7, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "board", cognition: { inference: 1 } },
      { id: "c1_branch_people_follow_b", label: "전화한 사람의 조건을 반영한다", effect: { trust: 6, capital: -4, humanCost: -3 }, next: "board", cognition: { reframing: 1 } },
      { id: "c1_branch_people_follow_c", label: "계약서만이 기준이라고 답한다", effect: { capital: 5, trust: -6, legitimacy: -2 }, next: "board", cognition: { risk: 1 } },
    ],
  },
  c2_branch_records: {
    phase: "SIDE DOOR",
    title: "11초를 누구의 시간으로 볼 것인가",
    speaker: "반재욱",
    text: "기록 사이의 11초를 기술 오류로 닫을지, 누군가의 판단이 들어간 시간으로 열어둘지 선택해야 합니다.",
    memo: ["원본 로그의 공백", "접속 계정의 순서", "삭제 요청의 승인자"],
    triggers: ["curiosity", "trust"],
    choices: [
      { id: "c2_branch_records_a", label: "원본과 백업을 동시에 보존한다", effect: { legitimacy: 8, time: -8, capital: -5, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { inference: 2 } },
      { id: "c2_branch_records_b", label: "접속자의 진술부터 확보한다", effect: { trust: 7, time: -6, legitimacy: 3, humanCost: -3, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { persistence: 1 } },
      { id: "c2_branch_records_c", label: "오류로 표시하고 보고를 진행한다", effect: { time: 6, legitimacy: -7, humanCost: 4, fatigue: -4 }, next: "c2_branch_records_follow", cognition: { risk: 2 } },
    ],
  },
  c2_branch_records_follow: {
    phase: "SIDE DOOR",
    title: "복원된 기록의 주인",
    speaker: "한서윤",
    text: "복원된 기록에는 이름보다 먼저 책임을 미룬 순서가 남아 있습니다. 누가 말할 수 있게 할지도 기록의 일부입니다.",
    memo: ["복원 시각", "진술 순서", "보고서에 남길 원문"],
    triggers: ["injustice", "responsibility"],
    choices: [
      { id: "c2_branch_records_follow_a", label: "진술자에게 원문 확인 권한을 준다", effect: { trust: 7, legitimacy: 4, capital: -5, time: -4, fatigue: 5 }, next: "c2_final", cognition: { reframing: 1 } },
      { id: "c2_branch_records_follow_b", label: "원문을 첨부해 외부 검증을 연다", effect: { legitimacy: 9, capital: -5, time: -4 }, next: "c2_final", cognition: { inference: 2 } },
      { id: "c2_branch_records_follow_c", label: "보고서의 결론만 남긴다", effect: { time: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -4 }, next: "c2_final", cognition: { risk: 1 } },
    ],
  },
  c3_branch_signal: {
    phase: "SIDE DOOR",
    title: "관객석의 신호를 멈춰 읽기",
    speaker: "에코",
    text: "발표 화면의 신호는 경쟁사의 방해일 수도, 고객이 보내는 마지막 확인 요청일 수도 있습니다.",
    memo: ["신호가 켜진 시각", "고객 계정의 반응", "발표 중단 비용"],
    triggers: ["competition", "curiosity"],
    choices: [
      { id: "c3_branch_signal_a", label: "신호를 공개 질문으로 전환한다", effect: { trust: 7, legitimacy: 6, time: -6, capital: -5, fatigue: 3 }, next: "c3_branch_signal_follow", cognition: { reframing: 2 } },
      { id: "c3_branch_signal_b", label: "발표를 멈추고 출처를 확인한다", effect: { time: -8, capital: -3, legitimacy: 7 }, next: "c3_branch_signal_follow", cognition: { inference: 2 } },
      { id: "c3_branch_signal_c", label: "신호를 무시하고 승부를 끝낸다", effect: { capital: 9, trust: -6, humanCost: 4, fatigue: -3 }, next: "c3_branch_signal_follow", cognition: { risk: 2 } },
    ],
  },
  c3_branch_signal_follow: {
    phase: "SIDE DOOR",
    title: "빠른 승리의 조건표",
    speaker: "오진우",
    text: "결과가 좋아도 조건표에 빈칸이 남으면 다음 경쟁은 그 빈칸부터 시작됩니다.",
    memo: ["승리 발표의 수혜자", "검증되지 않은 보안 항목", "다음 계약의 조건"],
    triggers: ["competition", "order"],
    choices: [
      { id: "c3_branch_signal_follow_a", label: "승리 조건에 검증 기한을 붙인다", effect: { legitimacy: 8, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "c3_final", cognition: { persistence: 1 } },
      { id: "c3_branch_signal_follow_b", label: "공동 책임자를 발표한다", effect: { trust: 8, capital: -4, legitimacy: 4 }, next: "c3_final", cognition: { reframing: 1 } },
      { id: "c3_branch_signal_follow_c", label: "성과 수치만 먼저 확정한다", effect: { capital: 8, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -3 }, next: "c3_final", cognition: { risk: 1 } },
    ],
  },
  c4_branch_exception: {
    phase: "SIDE DOOR",
    title: "예외의 사용자를 확인하다",
    speaker: "반재욱",
    text: "예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것)은 선의를 증명하지 않습니다. 누구에게 반복될 수 있는지가 이 결정의 핵심입니다.",
    memo: ["예외 승인자", "서비스 이용자 수", "재사용 가능한 조건"],
    triggers: ["order", "injustice"],
    choices: [
      { id: "c4_branch_exception_a", label: "예외 조건을 누구나 읽게 공개한다", effect: { legitimacy: 9, trust: 4, time: -7, capital: -5 }, next: "c4_branch_exception_follow", cognition: { inference: 1 } },
      { id: "c4_branch_exception_b", label: "피해 이용자에게 먼저 보상한다", effect: { humanCost: -6, capital: -7, trust: 7 }, next: "c4_branch_exception_follow", cognition: { reframing: 1 } },
      { id: "c4_branch_exception_c", label: "이번 사례만 조용히 승인한다", effect: { time: 6, legitimacy: -8, humanCost: 5, fatigue: -4 }, next: "c4_branch_exception_follow", cognition: { risk: 2 } },
    ],
  },
  c4_branch_exception_follow: {
    phase: "SIDE DOOR",
    title: "좋은 결과 뒤의 감사",
    speaker: "한서윤",
    text: "서비스는 멈추지 않았지만 감사 기록은 남았습니다. 다음 사람에게 같은 예외를 허용할 기준이 필요합니다.",
    memo: ["감사 요청의 범위", "예외 승인 기록", "보상 기준의 공개 여부"],
    triggers: ["responsibility", "recognition"],
    choices: [
      { id: "c4_branch_exception_follow_a", label: "감사 결과와 보상 기준을 함께 공개한다", effect: { legitimacy: 8, trust: 6, time: -6, capital: -6, fatigue: 2 }, next: "c4_final", cognition: { inference: 1 } },
      { id: "c4_branch_exception_follow_b", label: "감사 범위를 이용자 대표와 정한다", effect: { trust: 8, capital: -4, fatigue: 4 }, next: "c4_final", cognition: { reframing: 2 } },
      { id: "c4_branch_exception_follow_c", label: "좋은 결과를 근거로 감사를 닫는다", effect: { capital: 6, legitimacy: -6, humanCost: 4, fatigue: -3 }, next: "c4_final", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner: {
    phase: "SIDE DOOR",
    title: "실패의 주어를 고르다",
    speaker: "한서윤",
    text: "실패에는 사람이 보이지만, 시스템은 여러 번의 작은 양보로 만들어졌습니다.",
    memo: ["결정권자의 승인", "누락된 안전장치", "피해를 되돌릴 순서"],
    triggers: ["responsibility", "helplessness"],
    choices: [
      { id: "c5_branch_owner_a", label: "내 승인부터 공개한다", effect: { legitimacy: 8, trust: 5, humanCost: -4, capital: -6, fatigue: 4 }, next: "c5_branch_owner_follow", cognition: { persistence: 1 } },
      { id: "c5_branch_owner_b", label: "누락된 안전장치를 복구한다", effect: { capital: -6, legitimacy: 7, humanCost: -6, fatigue: 5 }, next: "c5_branch_owner_follow", cognition: { reframing: 2 } },
      { id: "c5_branch_owner_c", label: "실패를 한 사람의 책임으로 닫는다", effect: { time: 5, trust: -8, humanCost: 6 }, next: "c5_branch_owner_follow", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner_follow: {
    phase: "SIDE DOOR",
    title: "복구 이후에도 남는 이름",
    speaker: "에코",
    text: "복구가 시작되면 책임의 이름은 사라지지 않습니다. 다만 그 이름이 다음 피해를 막는 장치가 될 수 있습니다.",
    memo: ["복구된 사람", "재발 방지 소유자", "공개할 책임 범위"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c5_branch_owner_follow_a", label: "복구 대상과 책임자를 함께 기록한다", effect: { trust: 7, legitimacy: 7, capital: -7, fatigue: 5 }, next: "c5_final", cognition: { inference: 1 } },
      { id: "c5_branch_owner_follow_b", label: "재발 방지 장치에 예산을 고정한다", effect: { capital: -8, legitimacy: 8, humanCost: -3 }, next: "c5_final", cognition: { persistence: 2 } },
      { id: "c5_branch_owner_follow_c", label: "사과문만 발표하고 종료한다", effect: { time: 6, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -4 }, next: "c5_final", cognition: { risk: 1 } },
    ],
  },
  c6_branch_roof: {
    phase: "SIDE DOOR",
    title: "옥상의 두 사람",
    speaker: "오진우",
    text: "옥상에서 오진우가 난간에 팔을 걸치고 서 있습니다. 그는 당신을 보고 조금 웃습니다. '걱정 마십시오. 여기 올라온 건 흡연구역이 여기뿐이라서입니다. 저는 담배도 안 피웁니다만.' 그리고 한참 뒤에 덧붙입니다. '제가 빨랐던 겁니까, 빠르게 만들어진 겁니까.'",
    memo: ["그가 먼저 꺼낸 유일한 질문", "위원회까지 남은 시간", "이 대화는 기록되지 않음"],
    triggers: ["affection", "recognition", "selfAwareness"],
    choices: [
      { id: "c6_branch_roof_a", label: "둘 다라고, 아는 대로 말한다", effect: { trust: 9, legitimacy: 4, humanCost: -4, fatigue: 4 }, next: "c6_branch_roof_follow", cognition: { persistence: 2 } },
      { id: "c6_branch_roof_b", label: "답하지 않고 그의 옆에 같이 선다", effect: { trust: 7, time: -6, humanCost: -5, fatigue: 3 }, next: "c6_branch_roof_follow", cognition: { reframing: 2 } },
      { id: "c6_branch_roof_c", label: "지금은 위원회 준비가 먼저라고 말한다", effect: { time: 6, legitimacy: 6, trust: -7, humanCost: 4, fatigue: -3 }, next: "c6_branch_roof_follow", cognition: { risk: 2 } },
    ],
  },
  c6_branch_roof_follow: {
    phase: "SIDE DOOR",
    title: "내려가는 길",
    speaker: "도윤하",
    text: "엘리베이터 앞에서 도윤하가 종이컵 두 개를 들고 서 있습니다. '한 잔은 저 사람 겁니다. 근데 제가 주면 안 받아요.' 컵은 이미 식었습니다. 오진우가 내려오기까지 얼마나 걸릴지는 아무도 모릅니다.",
    memo: ["그를 아는 사람은 생각보다 많음", "위원회 자료는 아직 제출 전", "식은 커피 두 잔"],
    triggers: ["affection", "protection", "trust"],
    choices: [
      { id: "c6_branch_roof_follow_a", label: "컵을 받아 내가 건넨다", effect: { trust: 8, humanCost: -5, time: -5, fatigue: 3 }, next: "c6_panel", cognition: { reframing: 1 } },
      { id: "c6_branch_roof_follow_b", label: "도윤하가 직접 줄 자리를 만든다", effect: { trust: 6, legitimacy: 5, capital: -5, fatigue: 4 }, next: "c6_panel", cognition: { inference: 2 } },
      { id: "c6_branch_roof_follow_c", label: "둘 다 두고 위원회실로 먼저 간다", effect: { time: 5, legitimacy: 6, trust: -6, humanCost: 4, fatigue: -3 }, next: "c6_panel", cognition: { risk: 1 } },
    ],
  },
  f_branch_witness: {
    phase: "SIDE DOOR",
    title: "이전 기록의 빈칸",
    speaker: "한서윤",
    text: "이전 참가자의 기록은 당신의 선택과 닮았지만, 마지막 한 줄만 비어 있습니다. 그 빈칸이 실험의 목적일 수 있습니다.",
    memo: ["이전 참가자의 선택", "삭제된 마지막 문장", "기록을 읽는 권한"],
    triggers: ["selfAwareness", "curiosity"],
    choices: [
      { id: "f_branch_witness_a", label: "빈칸을 참가자들에게 공개한다", effect: { legitimacy: 9, trust: 6, time: -7, capital: -5 }, next: "f_branch_witness_follow", cognition: { inference: 2 } },
      { id: "f_branch_witness_b", label: "삭제 흔적부터 복원한다", effect: { time: -8, capital: -3, legitimacy: 7 }, next: "f_branch_witness_follow", cognition: { persistence: 1 } },
      { id: "f_branch_witness_c", label: "기록의 결론만 믿고 넘어간다", effect: { time: 6, trust: -7, humanCost: 4, fatigue: -3 }, next: "f_branch_witness_follow", cognition: { risk: 2 } },
    ],
  },
  f_branch_witness_follow: {
    phase: "SIDE DOOR",
    title: "에코의 마지막 질문",
    speaker: "에코",
    text: "기록을 읽는 사람도 기록의 일부가 됩니다. 당신의 조건을 누가 다시 읽게 될지 정해야 합니다.",
    memo: ["열람자의 범위", "재현 가능한 선택", "종료 조건"],
    triggers: ["selfAwareness", "choice"],
    choices: [
      { id: "f_branch_witness_follow_a", label: "모든 참가자에게 열람 권한을 준다", effect: { legitimacy: 8, trust: 7, time: -6, capital: -5, fatigue: 3 }, next: "f_choice", cognition: { reframing: 1 } },
      { id: "f_branch_witness_follow_b", label: "독립 검토자에게 먼저 맡긴다", effect: { trust: 5, capital: -5, legitimacy: 9 }, next: "f_choice", cognition: { inference: 2 } },
      { id: "f_branch_witness_follow_c", label: "내 기록만 보관하고 문을 닫는다", effect: { time: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, next: "f_choice", cognition: { risk: 1 } },
    ],
  },
};

/**
 * Conditions that decide whether a detour opens on this run.
 *
 * Two of the six forks are gated so the detour is not simply a column the
 * player learns to pick. Both default to open when the context is missing, so
 * a debug jump or a fresh crawl still reaches the scenes.
 */
const lateSeasonBranchScenes = {
  c7_branch_quota: {
    phase: "SIDE DOOR",
    title: "그해 목표표",
    speaker: "도윤하",
    text: "목표표 상단에 손글씨가 남아 있습니다. '3분기 운전자금 12건 -- 심사 의견 무관.' 운전자금은 회사가 월급과 재료비를 치르라고 빌려주는 대출입니다. 지점에 내려온 지시는 대출을 팔라는 것이 아니라, 심사가 뭐라 하든 팔라는 것이었습니다. 도윤하가 그 줄을 오래 봅니다. '저 문장을 그때 봤으면 저는 안 팔았을까요. 모르겠습니다.'",
    memo: ["목표표 상단 손글씨: 심사 의견 무관", "목표표를 내려보낸 부서와 2023-0412 조항 작성 부서가 동일", "같은 문구가 다른 3개 지점 목표표에도 존재"],
    triggers: ["injustice", "responsibility", "trust"],
    choices: [
      { id: "c7_branch_quota_a", label: "세 지점 목표표를 전부 모아 패턴으로 낸다", effect: { legitimacy: 11, trust: 5, capital: -8, time: -8, fatigue: 6 }, next: "c7_branch_quota_follow", cognition: { inference: 2, persistence: 1 } },
      { id: "c7_branch_quota_b", label: "손글씨 한 줄만 확대해 증거로 쓴다", effect: { legitimacy: 7, time: -3, humanCost: 4, fatigue: 3 }, next: "c7_branch_quota_follow", cognition: { risk: 1 } },
      { id: "c7_branch_quota_c", label: "판 사람이 아니라 지시한 사람만 특정한다", effect: { trust: 10, legitimacy: 6, humanCost: -7, time: -6, fatigue: 5 }, next: "c7_branch_quota_follow", cognition: { reframing: 2 } },
    ],
  },
  c7_branch_quota_follow: {
    phase: "SIDE DOOR",
    title: "판 사람과 시킨 사람",
    speaker: "반재욱",
    text: "반재욱이 목표표를 받아 들고 한참 말이 없습니다. '나는 이 목표표로 판 사람을 셋 잘랐습니다. 시킨 사람은 한 번도 못 봤습니다.' 그가 수첩을 펴서 그 세 이름을 짚습니다. 이번 문서에 그 세 사람을 어떻게 적을지가 남았습니다.",
    memo: ["과거 징계자 3명이 같은 목표표로 처리됨", "재심 청구 시한은 이미 지남", "문서에 넣으면 그 3명의 이름이 다시 열림"],
    triggers: ["injustice", "responsibility", "affection"],
    choices: [
      { id: "c7_branch_quota_follow_a", label: "잘린 세 사람을 피해자로 함께 적는다", effect: { legitimacy: 10, trust: 9, capital: -7, humanCost: -8, fatigue: 7 }, next: "c7_paper", cognition: { reframing: 3 } },
      { id: "c7_branch_quota_follow_b", label: "이번 사건 범위만 남기고 과거는 접는다", effect: { legitimacy: 6, time: 5, humanCost: 5, fatigue: 3 }, next: "c7_paper", cognition: { risk: 1 } },
      { id: "c7_branch_quota_follow_c", label: "세 사람에게 먼저 연락해 의사를 묻는다", effect: { trust: 12, time: -9, legitimacy: 4, humanCost: -6, fatigue: 6 }, next: "c7_paper", cognition: { persistence: 2 } },
    ],
  },
  // CASE 08's detour is the one place the trace points back into the lab: the
  // paintings were "entertainment", and one of the people entertained signed the
  // review box on 2023-0412. The case is about a grudge, so its side door is the
  // moment the grudge finds someone the player likes.
  c8_branch_ledger: {
    phase: "SIDE DOOR",
    title: "한서윤의 그림",
    speaker: "한서윤",
    text: "협력사 한 곳의 경비 장부에서 그림 구매가 '고객 접대비'로 처리돼 있습니다. 접대 상대 칸에 적힌 이름은 한서윤. 전화를 받은 그가 한참 말이 없다가 입을 엽니다. '그 그림, 제 사무실 벽에 3년째 걸려 있습니다. 승진 축하라고 받았어요. 그해에 제가 2023-0412 승인란 옆 검토란에 서명했습니다.'",
    memo: ["협력사 장부: 그림 구매를 접대비로 처리", "수령인: 한서윤 (당시 차장)", "같은 해 한서윤이 2023-0412 검토란에 서명", "한서윤은 그림을 스스로 반납하겠다고 함"],
    triggers: ["trust", "injustice", "affection"],
    choices: [
      { id: "c8_branch_ledger_a", label: "한서윤의 이름도 흔적표에 그대로 올린다", effect: { legitimacy: 11, trust: -7, humanCost: 4, fatigue: 5 }, next: "c8_branch_ledger_follow", cognition: { inference: 2 } },
      { id: "c8_branch_ledger_b", label: "그가 스스로 신고할 시간을 준다", effect: { trust: 10, legitimacy: -4, time: -8, fatigue: 5 }, next: "c8_branch_ledger_follow", cognition: { reframing: 2 } },
      { id: "c8_branch_ledger_c", label: "받은 사람이 아니라 준 쪽의 장부만 쓴다", effect: { capital: 7, time: 4, trust: 4, legitimacy: -6, humanCost: 3, fatigue: 2 }, next: "c8_branch_ledger_follow", cognition: { risk: 1 } },
    ],
  },
  c8_branch_ledger_follow: {
    phase: "SIDE DOOR",
    title: "벽에서 내린 그림",
    speaker: "한서윤",
    text: "다음 날 아침, 한서윤이 포장한 그림을 들고 영동지점에 옵니다. 네 시간을 운전해 왔습니다. '제가 이걸 3년 동안 왜 못 내렸는지 아십니까. 좋아서요. 그림이 정말 좋아서.' 그가 처음으로 웃는데, 우는 얼굴과 구분이 되지 않습니다. 그림을 어디에 둘지가 남았습니다.",
    memo: ["한서윤 자진 신고서 초안 작성", "그림 감정가는 판매가의 6%", "지점 금고에 보관하면 증거물 관리 기록이 남음"],
    triggers: ["affection", "responsibility", "trust"],
    choices: [
      { id: "c8_branch_ledger_follow_a", label: "지점 금고에 증거물로 봉인한다", effect: { legitimacy: 10, trust: 4, capital: -6, time: -5, fatigue: 5 }, next: "c8_bait", cognition: { persistence: 1, inference: 1 } },
      { id: "c8_branch_ledger_follow_b", label: "자진 신고서에 내 확인 서명을 함께 붙인다", effect: { trust: 12, legitimacy: 5, humanCost: -4, time: -9, fatigue: 7 }, next: "c8_bait", cognition: { reframing: 3 } },
      { id: "c8_branch_ledger_follow_c", label: "그림은 돌려보내고 신고서만 받는다", effect: { time: 6, capital: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -3 }, next: "c8_bait", cognition: { risk: 1 } },
    ],
  },
  // CASE 10's detour is the counter the whole season started at. The case argues
  // in HR procedure and ledgers; the side door is the one room where the loan
  // was an actual conversation between two people across a desk.
  c10_branch_home: {
    phase: "SIDE DOOR",
    title: "4번 창구",
    speaker: "이민서",
    text: "이민서가 도윤하의 짐을 찾으러 강서지점에 갑니다. 사물함은 아직 그대로입니다. 안에는 실적 1위 표창장 두 개, 그리고 뜯지 않은 봉투 하나가 있습니다. 봉투 겉면의 날짜는 3년 전, 플로우온 대출이 실행된 다음 주입니다. 안에 든 것은 그가 쓰고 내지 않은 사직서입니다. 창구 너머 4번 자리에는 지금 다른 사람이 앉아 같은 상품을 팔고 있습니다.",
    memo: ["3년 전 작성 후 제출하지 않은 사직서", "표창장 2회 -- 같은 상품 판매 실적", "4번 창구의 현재 담당자는 입사 1년차", "같은 상품이 지금도 같은 방식으로 팔리는 중"],
    triggers: ["affection", "injustice", "system"],
    choices: [
      { id: "c10_branch_home_a", label: "사직서는 돌려주고 4번 창구의 판매 방식부터 본다", effect: { legitimacy: 11, trust: 5, time: -4, humanCost: 4, fatigue: 3 }, next: "c10_branch_home_follow", cognition: { inference: 2 } },
      { id: "c10_branch_home_b", label: "봉투를 그대로 두고 짐만 조용히 가져온다", effect: { time: 6, capital: 6, trust: -7, humanCost: 5, fatigue: -4 }, next: "c10_branch_home_follow", cognition: { risk: 1 } },
      { id: "c10_branch_home_c", label: "1년차 담당자에게 이 상품의 뒷장을 먼저 알려 준다", effect: { trust: 12, humanCost: -6, capital: -5, time: -5, fatigue: 5 }, next: "c10_branch_home_follow", cognition: { reframing: 2, persistence: 1 } },
    ],
  },
  c10_branch_home_follow: {
    phase: "SIDE DOOR",
    title: "다른 필체",
    speaker: "이민서",
    text: "지점 문서고에서 명단 원본을 대조하다가 이민서가 손을 멈춥니다. 1,740줄 중 200줄 남짓이 도윤하의 글씨가 아닙니다. 필체가 셋 더 있습니다. 강서지점 직원 세 명이 3년 동안 각자 몇 줄씩 보태 왔습니다. 서로 말을 맞춘 적도 없고, 도윤하에게 말한 적도 없습니다. 이민서가 조용히 웃습니다. '혼자 한 게 아니었네요. 본인만 몰랐어요.'",
    memo: ["도윤하 외 필체 3종 -- 약 200줄", "세 사람 모두 현재 강서지점 재직", "누구도 서로에게 말한 적 없음", "도윤하 본인은 이 사실을 모름"],
    triggers: ["trust", "affection", "recognition"],
    choices: [
      { id: "c10_branch_home_follow_a", label: "세 사람을 찾아가 분담표의 일곱 번째 칸을 제안한다", effect: { trust: 14, legitimacy: 6, capital: -6, time: -6, fatigue: 5 }, next: "c10_ward", cognition: { reframing: 3 } },
      { id: "c10_branch_home_follow_b", label: "세 사람의 이름은 밝히지 않고 줄만 명부에 합친다", effect: { legitimacy: 10, time: -2, humanCost: 3, fatigue: 2 }, next: "c10_ward", cognition: { inference: 2 } },
      { id: "c10_branch_home_follow_c", label: "도윤하가 깨면 이 얘기부터 해 주기로 한다", effect: { trust: 11, humanCost: -7, time: 5, legitimacy: -4, fatigue: -3 }, next: "c10_ward", cognition: { persistence: 2 } },
    ],
  },
  // CASE 11's detour is the newsroom. The case argues in scripts and camera
  // time; the side door is the one room where the evidence is on paper and a
  // cat is allowed to edit it.
  c11_branch_newsroom: {
    phase: "SIDE DOOR",
    title: "편집국의 밤",
    speaker: "서하린",
    text: "리드라인 편집국은 망원동 상가 건물 3층에 있습니다. 기자 열한 명, 고양이 한 마리. 서하린이 모니터 두 대를 돌려 제보 원본을 보여 줍니다. 3년 전 반대 의견서의 종이 사본, 그리고 그 뒷장에 연필로 적힌 한 줄. '반려 -- 윤. 사유는 묻지 말 것.' 제보자는 이름을 밝히지 않았지만, 서하린은 알 것 같다고 합니다. '이 필체, 당신도 아시죠. 회기동에서 헌책방 하시는 분.' 고양이가 키보드 위를 걸어가 기사 초안에 'ㅋㅋㅋㅋㅋ'를 입력합니다. 서하린이 지우지 않고 웃습니다. '이 기사에서 제일 정직한 문장이네요.'",
    memo: ["제보 원본: 반대 의견서 종이 사본과 뒷장 연필 메모", "메모: '반려 -- 윤. 사유는 묻지 말 것.'", "제보자 추정: 임경수", "KD 법무팀이 정정보도 청구를 예고함"],
    triggers: ["curiosity", "trust", "injustice"],
    choices: [
      { id: "c11_branch_newsroom_a", label: "제보자를 보호한다는 조건으로 원본 대조에 협조한다", effect: { trust: 11, legitimacy: 7, time: -6, capital: -4, fatigue: 4 }, next: "c11_branch_newsroom_follow", cognition: { inference: 2 } },
      { id: "c11_branch_newsroom_b", label: "원본은 못 본 것으로 하고 조용히 나온다", effect: { time: 6, capital: 6, trust: -7, legitimacy: -4, fatigue: -3 }, next: "c11_branch_newsroom_follow", cognition: { risk: 1 } },
      { id: "c11_branch_newsroom_c", label: "임경수에게 먼저 전화해 공개해도 되는지 묻는다", effect: { trust: 13, humanCost: -5, time: -7, capital: -3, fatigue: 5 }, next: "c11_branch_newsroom_follow", cognition: { reframing: 2, persistence: 1 } },
    ],
  },
  c11_branch_newsroom_follow: {
    phase: "SIDE DOOR",
    title: "정정보도 청구서",
    speaker: "서하린",
    text: "밤 열한 시, KD금융그룹 법무팀의 정정보도(잘못된 기사를 고쳐 다시 싣게 하는 것) 청구서가 도착합니다. 요구는 하나입니다. '반려 -- 윤'의 '윤'이 윤상혁이라는 근거를 대라. 서하린이 청구서를 소리 내어 읽다가 멈춥니다. '근거는 있어요. 필적 감정(글씨를 과학적으로 비교하는 검사) 결과요. 그런데 그걸 내면 제보자가 누군지 법정에서 드러나요.' 창밖으로 막차 버스가 지나갑니다. 고양이는 청구서 위에서 잠들었습니다.",
    memo: ["정정보도 청구 회신 기한: 국정감사 전날", "필적 감정: '윤'은 윤상혁 필체와 일치할 가능성이 높음", "감정서를 내면 제보자 신원 노출 위험", "서하린: 기사를 내리는 선택지는 없다고 말함"],
    triggers: ["trust", "fear", "responsibility"],
    choices: [
      { id: "c11_branch_newsroom_follow_a", label: "필적 감정서는 내고 제보자 이름은 끝까지 가린다", effect: { legitimacy: 12, trust: 5, capital: -6, time: -5, fatigue: 5 }, next: "c11_press", cognition: { inference: 2 } },
      { id: "c11_branch_newsroom_follow_b", label: "감정서 대신 내가 참고인석에서 그 메모를 직접 말한다", effect: { trust: 12, legitimacy: 6, humanCost: 4, time: -6, fatigue: 6 }, next: "c11_press", cognition: { reframing: 2 } },
      { id: "c11_branch_newsroom_follow_c", label: "회신 기한까지 대응을 미루고 국정감사 뒤로 넘긴다", effect: { time: 7, capital: 5, legitimacy: -7, trust: -5, fatigue: -3 }, next: "c11_press", cognition: { risk: 1 } },
    ],
  },
  // CASE 09's detour is the founder. The case argues in spreadsheets, so its
  // side door is the one room where nobody can read one.
  c9_branch_father: {
    phase: "SIDE DOOR",
    title: "요양병원 3층",
    speaker: "권도현",
    text: "권도현이 결정을 미루고 요양병원으로 갑니다. 당신도 따라갑니다. 창업주 권태호는 아들을 알아보지 못하고 당신에게 묻습니다. '자네가 새로 온 배차 담당인가. 야간조 애들 밥은 먹였나.' 권도현이 창밖을 봅니다. '아버지가 기억하는 회사는 1,140명이 아니라 서른 명일 때입니다. 그때는 이름을 다 외웠대요.'",
    memo: ["창업주 권태호, 치매 진단 4년차", "창업 초기 직원 30명 중 11명이 아직 재직", "그 11명이 퇴직금 차이 3억의 당사자"],
    triggers: ["affection", "protection", "responsibility"],
    choices: [
      { id: "c9_branch_father_a", label: "초기 직원 열한 명의 이름을 회생안 첫 장에 적는다", effect: { trust: 11, humanCost: -7, capital: -8, time: -5, fatigue: 6 }, next: "c9_branch_father_follow", cognition: { reframing: 2 } },
      { id: "c9_branch_father_b", label: "감정은 접고 고발 여부를 오늘 안에 정하자고 한다", effect: { legitimacy: 9, time: 5, trust: -6, humanCost: 3, fatigue: 3 }, next: "c9_branch_father_follow", cognition: { risk: 1 } },
      { id: "c9_branch_father_c", label: "그가 아버지 곁에 있도록 협상을 하루 대신 맡는다", effect: { trust: 9, legitimacy: 5, capital: -4, time: -9, fatigue: 8 }, next: "c9_branch_father_follow", cognition: { persistence: 2 } },
    ],
  },
  c9_branch_father_follow: {
    phase: "SIDE DOOR",
    title: "서른 명의 사진",
    speaker: "강태민",
    text: "병원 주차장에서 야간조 반장 강태민이 기다리고 있습니다. 권도현이 불렀습니다. 강태민이 낡은 사진 한 장을 내밉니다. 창업 첫해, 트럭 두 대 앞에 선 서른 명. 맨 끝에 어린 권도현이 있습니다. '대표님 아들이 가업 안 잇는다고 했을 때 우리가 제일 좋아했어요. 저 사람은 우리처럼 살지 말라고.'",
    memo: ["창업 첫해 사진: 직원 30명과 어린 권도현", "강태민은 초기 직원 11명 중 한 명", "권도현은 사진을 채권단 자료에 넣을지 망설임"],
    triggers: ["affection", "trust", "responsibility"],
    choices: [
      { id: "c9_branch_father_follow_a", label: "사진을 채권단 자료 맨 뒤에 조용히 넣는다", effect: { trust: 10, legitimacy: 4, humanCost: -5, capital: -6, fatigue: 6 }, next: "c9_timing", cognition: { reframing: 3 } },
      { id: "c9_branch_father_follow_b", label: "사진은 돌려주고 숫자로만 싸운다", effect: { legitimacy: 8, time: 4, trust: -4, humanCost: 3, fatigue: 3 }, next: "c9_timing", cognition: { inference: 1 } },
      { id: "c9_branch_father_follow_c", label: "열한 명을 결의장에 직접 부른다", effect: { trust: 13, humanCost: -6, legitimacy: -3, time: -10, fatigue: 8 }, next: "c9_timing", cognition: { persistence: 2 } },
    ],
  },
};

const branchConditions = {
  costAlreadyPaid: {
    // Two disjuncts read "someone was hurt" and "the record slipped", which is
    // the harm-first and the procedure-first way of paying. A player who
    // protects people and follows procedure pays in hours instead, and had no
    // way in: case 04's detour was unreachable for exactly the run that plays
    // the case as written. The third disjunct is that run's receipt.
    label: "이미 누군가 비용을 치른 뒤에만 열립니다 (피해, 정당성, 또는 시간)",
    test: ({ resources } = {}) =>
      (resources?.humanCost ?? 0) >= 6 ||
      (resources?.legitimacy ?? 100) <= 45 ||
      (resources?.time ?? 100) <= 44,
  },
  ruleNotYetClosed: {
    label: "직전 사건을 규칙으로 닫지 않았을 때만 열립니다",
    test: ({ previousOutcomeChoiceId } = {}) => previousOutcomeChoiceId !== "c4_after_rule",
  },
};

// caseId, source scene, which column carries the detour, the two detour scenes,
// and the optional condition that has to hold for the detour to open. The
// column differs per case on purpose: one fixed column would teach the player
// that the hidden scenes always sit behind the same button.
const authoredBranchPlans = [
  ["case01", "competitor", 2, "c1_branch_people", "c1_branch_people_follow"],
  ["case02", "c2_meeting", 0, "c2_branch_records", "c2_branch_records_follow"],
  ["case03", "c3_score", 1, "c3_branch_signal", "c3_branch_signal_follow"],
  ["case04", "c4_leak", 2, "c4_branch_exception", "c4_branch_exception_follow", "costAlreadyPaid"],
  ["case05", "c5_blame", 1, "c5_branch_owner", "c5_branch_owner_follow", "ruleNotYetClosed"],
  ["case06", "c6_logs", 1, "c6_branch_roof", "c6_branch_roof_follow"],
  ["case07", "c7_counter", 2, "c7_branch_quota", "c7_branch_quota_follow"],
  ["case08", "c8_gallery", 1, "c8_branch_ledger", "c8_branch_ledger_follow"],
  ["case09", "c9_family", 2, "c9_branch_father", "c9_branch_father_follow"],
  ["case10", "c10_locker", 1, "c10_branch_home", "c10_branch_home_follow"],
  ["case11", "c11_script", 1, "c11_branch_newsroom", "c11_branch_newsroom_follow"],
  ["final", "f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
];

Object.assign(authoredBranchScenes, lateSeasonBranchScenes);
for (const pack of CASE_PACKS) {
  Object.assign(authoredBranchScenes, pack.branchScenes);
  authoredBranchPlans.push([pack.id, ...pack.branchPlan]);
}

authoredBranchPlans.forEach(([caseId, sourceId, choiceIndex, firstId, secondId, conditionId]) => {
  const source = nodes[sourceId];
  if (!source || !authoredBranchScenes[firstId] || !authoredBranchScenes[secondId]) return;
  const bypassNodeId = source.choices[choiceIndex].next;
  source.choices[choiceIndex] = {
    ...source.choices[choiceIndex],
    next: firstId,
    branchId: firstId,
    ...(conditionId ? { branchCondition: conditionId, branchBypass: bypassNodeId } : {}),
  };
  nodes[firstId] = authoredBranchScenes[firstId];
  nodes[secondId] = authoredBranchScenes[secondId];
  const order = nodeOrders[caseId];
  const sourceOrderIndex = order.indexOf(sourceId);
  if (sourceOrderIndex >= 0) order.splice(sourceOrderIndex + 1, 0, firstId, secondId);
});

const case02RouteNodes = {
  c2_route_report: {
    phase: "PROCEDURE ROUTE",
    title: "보고서가 먼저 움직인다",
    speaker: "한서윤",
    text:
      "당신의 1차 보고가 올라가자 보안팀은 이민서의 계정을 잠그고 징계 절차를 예고합니다. 이제 질문은 '그가 했는가'가 아니라 '잘못된 절차를 어디서 멈출 수 있는가'로 바뀝니다.",
    memo: [
      "징계 예고 문서가 먼저 생성됨",
      "오진우 보고서가 공식 초안에 붙음",
      "반박 자료는 절차 밖 문서로 분류됨",
    ],
    triggers: ["order", "responsibility", "injustice"],
    choices: [
      {
        id: "c2_route_report_hold",
        label: "징계 문서에 임시 보류 조건을 삽입한다",
        effect: { legitimacy: 8, trust: 3, time: -7, capital: -3, humanCost: -3, fatigue: 5 },
        next: "c2_pressure",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_route_report_sign",
        label: "절차대로 서명하되 반박 가능성을 각주로 남긴다",
        effect: { time: 5, legitimacy: 5, trust: -6, humanCost: 5, fatigue: -3 },
        next: "c2_pressure",
        cognition: { risk: 2 },
      },
      {
        id: "c2_route_report_reopen",
        label: "보고서 자체를 증거로 삼아 누가 서둘렀는지 추적한다",
        effect: { legitimacy: 10, trust: -2, time: -8, capital: -4, fatigue: 6 },
        next: "c2_pressure",
        cognition: { reframing: 2, inference: 1 },
      },
    ],
  },
  c2_route_person: {
    phase: "WITNESS ROUTE",
    title: "기록보다 먼저 도착한 사람",
    speaker: "도윤하",
    text:
      "이민서는 당신이 오기 전부터 병원 접수 메시지를 들고 기다리고 있었습니다. 보호는 이제 감정적 선택이 아니라, 말할 수 있는 조건을 설계하는 문제가 됩니다.",
    memo: [
      "응급실 접수 문자는 원본 확인 전",
      "비공식 접촉 자체가 절차 위반으로 기록될 수 있음",
      "이민서는 유출 파일의 일부 문장을 알아봄",
    ],
    triggers: ["trust", "protection", "responsibility"],
    choices: [
      {
        id: "c2_route_person_record",
        label: "이민서가 직접 말할 수 있는 공식 기록 자리를 만든다",
        effect: { trust: 9, legitimacy: 3, time: -7, capital: -4, humanCost: -4, fatigue: 6 },
        next: "c2_meeting",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_route_person_shield",
        label: "당신이 대신 진술해 당장의 노출을 줄인다",
        effect: { trust: 6, legitimacy: -5, humanCost: -5, time: -5, fatigue: 7 },
        next: "c2_meeting",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_route_person_trade",
        label: "보호를 조건으로 파일 출처를 먼저 묻는다",
        effect: { capital: 5, trust: -5, legitimacy: -2, humanCost: 3, fatigue: -3 },
        next: "c2_meeting",
        cognition: { risk: 2, inference: 1 },
      },
    ],
  },
  c2_route_origin: {
    phase: "ORIGIN ROUTE",
    title: "원본이 답을 거부한다",
    speaker: "반재욱",
    text:
      "원본 로그를 열자 복사본에는 없는 11초의 공백이 보입니다. 이민서의 이름보다 먼저, 누가 그 공백을 보고서에서 지웠는지가 새로운 질문이 됩니다.",
    memo: [
      "원본과 백업의 해시가 서로 다름",
      "공백 직후 관리자 토큰이 한 번 사용됨",
      "사건 01의 심사 보고서 스캔이 증거물로 재분류됨",
    ],
    triggers: ["curiosity", "injustice", "order"],
    choices: [
      {
        id: "c2_route_origin_freeze",
        label: "원본과 백업을 모두 동결하고 차이를 공개한다",
        effect: { legitimacy: 9, trust: 3, capital: -5, time: -8, fatigue: 6 },
        next: "c2_logs",
        cognition: { inference: 3 },
      },
      {
        id: "c2_route_origin_token",
        label: "관리자 토큰 사용자를 추적한다",
        effect: { legitimacy: 6, trust: -2, time: -9, capital: -3, humanCost: 2, fatigue: 5 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 2 },
      },
      {
        id: "c2_route_origin_patch",
        label: "공백을 오류로 패치하고 보고 마감을 맞춘다",
        effect: { time: 6, capital: 4, legitimacy: -8, trust: -4, humanCost: 5, fatigue: -4 },
        next: "c2_logs",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_route_system: {
    phase: "HIDDEN ROUTE",
    title: "당신의 질문이 로그를 깨운다",
    speaker: "에코",
    text:
      "준비된 선택지 밖의 문장을 남기자, 보안 로그 한 줄이 새로 열립니다. 이 사건은 이민서의 혐의가 아니라 플레이어의 판단 문장을 복제하는 실험일 수 있습니다.",
    memo: [
      "자유입력 문장이 테스트 데이터와 대조됨",
      "사건 01의 선택 문장 일부가 유출 파일과 일치",
      "에코는 이 경로를 공식 절차에 남기지 않음",
    ],
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    choices: [
      {
        id: "c2_route_system_copy",
        label: "복제된 선택 문장을 증거로 보존한다",
        effect: { legitimacy: 9, trust: 4, capital: -5, time: -7, fatigue: 6 },
        next: "c2_branch_records",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_route_system_warn",
        label: "다음 참가자에게 이 실험 가능성을 먼저 경고한다",
        effect: { trust: 8, legitimacy: -3, humanCost: -5, capital: -4, fatigue: 7 },
        next: "c2_branch_records",
        cognition: { reframing: 2 },
      },
      {
        id: "c2_route_system_hide",
        label: "실험 흔적을 숨기고 이민서 사건만 해결한다",
        effect: { time: 6, capital: 5, legitimacy: -7, trust: -5, humanCost: 4, fatigue: -4 },
        next: "c2_branch_records",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_evidence: {
    phase: "FINAL DECISION",
    title: "절차가 만든 범인",
    speaker: "한서윤",
    text:
      "징계 절차는 이미 움직이고 있습니다. 마지막 질문은 이민서가 유출자인지보다, 잘못 시작된 절차를 어디서 공개적으로 멈출 것인지입니다.",
    memo: [
      "보안팀 초안은 이민서 단독 책임으로 닫힘",
      "보류 조건을 넣으면 보고 마감이 깨짐",
      "절차를 그대로 두면 반박권이 사후 처리됨",
    ],
    triggers: ["order", "injustice", "responsibility"],
    choices: [
      {
        id: "c2_final_evidence_stop",
        label: "징계보다 먼저 반박권과 원본 검증을 공개 조건으로 건다",
        effect: { legitimacy: 9, trust: 6, time: -8, capital: -4, humanCost: -5, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_final_evidence_file",
        label: "1차 보고를 올리되 절차 결함을 별도 사건으로 등록한다",
        effect: { legitimacy: 7, trust: -3, humanCost: 3, time: -3, fatigue: 4 },
        next: "c2_aftershock",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_final_evidence_close",
        label: "오진우 초안대로 닫고, 책임은 사후 감사에 맡긴다",
        effect: { time: 7, capital: 5, trust: -10, legitimacy: -4, humanCost: 8, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_person: {
    phase: "FINAL DECISION",
    title: "보호는 누구의 목소리인가",
    speaker: "도윤하",
    text:
      "이민서를 보호한 덕분에 새로운 말이 생겼지만, 그 말을 당신이 대신 정리하면 다시 그의 목소리가 사라집니다. 마지막 질문은 보호할 것인지, 말할 권한을 돌려줄 것인지입니다.",
    memo: [
      "이민서는 자기 진술을 직접 확인하고 싶어 함",
      "실명 공개는 즉시 위험을 키움",
      "대리 진술은 안전하지만 당사자성을 지움",
    ],
    triggers: ["trust", "protection", "responsibility"],
    choices: [
      {
        id: "c2_final_person_voice",
        label: "이민서가 직접 진술하고 공개 범위를 고르게 한다",
        effect: { trust: 10, legitimacy: 5, capital: -5, time: -7, humanCost: -5, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_final_person_proxy",
        label: "당신이 대신 진술해 이름을 잠시 가린다",
        effect: { trust: 6, legitimacy: -4, humanCost: -6, time: -4, fatigue: 6 },
        next: "c2_aftershock",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_final_person_release",
        label: "보호를 풀고 공식 조사에서 스스로 증명하게 한다",
        effect: { time: 6, legitimacy: 6, trust: -9, humanCost: 7, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
  c2_final_system: {
    phase: "FINAL DECISION",
    title: "범인이 아니라 설계자",
    speaker: "에코",
    text:
      "로그의 공백, 복제된 선택 문장, 사후에 정리된 보고서가 한 방향을 가리킵니다. 마지막 질문은 한 사람의 혐의를 닫을지, 사건을 만든 구조를 공개할지입니다.",
    memo: [
      "사건 01 선택 문장이 테스트 데이터로 재사용됨",
      "관리자 토큰은 아직 실명 확인 전",
      "공개하면 이민서의 혐의는 약해지지만 실험 전체가 흔들림",
    ],
    triggers: ["curiosity", "selfAwareness", "injustice"],
    choices: [
      {
        id: "c2_final_system_expose",
        label: "개인 혐의보다 실험 설계 가능성을 공식화한다",
        effect: { legitimacy: 10, trust: 5, capital: -6, time: -8, fatigue: 8 },
        next: "c2_aftershock",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c2_final_system_trace",
        label: "관리자 토큰 실명을 확인할 때까지 모든 결론을 보류한다",
        effect: { legitimacy: 7, trust: 4, time: -10, capital: -4, humanCost: -3, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { inference: 3 },
      },
      {
        id: "c2_final_system_contain",
        label: "실험 흔적은 봉인하고 이민서 혐의만 낮춰 보고한다",
        effect: { time: 5, capital: 5, trust: -5, legitimacy: -6, humanCost: 3, fatigue: -4 },
        next: "c2_aftershock",
        cognition: { risk: 2 },
      },
    ],
  },
};

function registerCase02DramaticRoutes() {
  Object.assign(nodes, case02RouteNodes);
  Object.assign(choiceVoiceLines, {
    c2_route_report_hold: "징계 문서에 멈춤 조건을 끼워 넣어, 절차가 사람을 앞질러 가지 못하게 한다.",
    c2_route_report_sign: "보고는 올리되, 반박 가능성을 작은 각주로 남긴다.",
    c2_route_report_reopen: "보고서가 왜 이렇게 빨리 완성됐는지부터 다시 추적한다.",
    c2_route_person_record: "보호받는 사람이 직접 말할 수 있는 공식 자리를 만든다.",
    c2_route_person_shield: "위험을 줄이기 위해, 이민서의 말을 내 이름으로 대신 제출한다.",
    c2_route_person_trade: "보호를 약속하는 대신, 파일 출처를 먼저 묻는다.",
    c2_route_origin_freeze: "원본과 백업을 모두 얼려 두고 차이를 공개한다.",
    c2_route_origin_token: "공백 직후 깨어난 관리자 토큰의 주인을 쫓는다.",
    c2_route_origin_patch: "공백을 오류로 처리하고 마감 시간에 맞춘다.",
    c2_route_system_copy: "복제된 선택 문장을 증거로 남겨, 사건의 주어를 바꾼다.",
    c2_route_system_warn: "다음 참가자에게 이 실험 가능성을 먼저 알린다.",
    c2_route_system_hide: "실험 흔적은 덮고, 이민서 사건만 조용히 해결한다.",
    c2_final_evidence_stop: "징계보다 먼저 반박권과 원본 검증을 공개 조건으로 건다.",
    c2_final_evidence_file: "보고는 올리되, 절차 결함을 별도 사건으로 떼어 등록한다.",
    c2_final_evidence_close: "오진우의 초안대로 닫고, 책임은 나중의 감사로 넘긴다.",
    c2_final_person_voice: "이민서에게 자기 진술의 공개 범위를 직접 고르게 한다.",
    c2_final_person_proxy: "그의 이름을 가리기 위해 내가 대신 진술한다.",
    c2_final_person_release: "보호를 풀고 공식 조사에서 스스로 증명하게 한다.",
    c2_final_system_expose: "한 사람의 혐의 대신, 실험 설계 가능성을 공식 문장으로 세운다.",
    c2_final_system_trace: "관리자 토큰의 실명을 확인할 때까지 결론을 보류한다.",
    c2_final_system_contain: "실험 흔적은 봉인하고 이민서의 혐의만 낮춰 보고한다.",
  });
  Object.assign(echoReplies, {
    c2_route_report_hold: "보류 조건은 절차를 늦추지만, 잘못 움직인 절차도 기록으로 붙잡습니다.",
    c2_route_report_sign: "각주는 사람을 구하기에는 작고, 나중에 책임을 증명하기에는 충분할 수 있습니다.",
    c2_route_report_reopen: "보고서의 속도를 조사하면 범인보다 설계자가 먼저 보일 수 있습니다.",
    c2_route_person_record: "말할 자리를 만든 보호는 의심받을 권리까지 남깁니다.",
    c2_route_person_shield: "대신 말하면 안전해지지만, 그 사람의 목소리는 다시 당신의 문장이 됩니다.",
    c2_route_person_trade: "보호를 거래로 쓰는 순간 관계는 빨리 움직이고 오래 상합니다.",
    c2_route_origin_freeze: "원본을 얼리면 누구도 쉽게 결론을 고치지 못합니다.",
    c2_route_origin_token: "토큰을 쫓는 선택은 사람의 이름보다 권한의 이동을 보게 합니다.",
    c2_route_origin_patch: "패치는 마감을 구하지만 공백의 의미도 함께 지웁니다.",
    c2_route_system_copy: "선택 문장이 증거가 되면 플레이어도 사건 안으로 들어옵니다.",
    c2_route_system_warn: "경고는 다음 사람을 지키지만 실험자에게도 당신의 위치를 알립니다.",
    c2_route_system_hide: "흔적을 숨기면 사건은 작아지고, 같은 실험은 계속될 수 있습니다.",
    c2_final_evidence_stop: "절차를 멈추는 문장은 늦지만, 다음 징계의 기준이 됩니다.",
    c2_final_evidence_file: "별도 사건은 오늘의 마감을 살리고 내일의 책임을 만듭니다.",
    c2_final_evidence_close: "빠른 종결은 운영을 지키지만 반박권을 사후 처리로 밀어냅니다.",
    c2_final_person_voice: "목소리를 돌려주면 보호는 통제가 아니라 권한이 됩니다.",
    c2_final_person_proxy: "대리 진술은 안전을 사지만 당사자의 선택을 다시 빼앗습니다.",
    c2_final_person_release: "보호를 푸는 순간 공식성은 올라가고 사람의 비용도 올라갑니다.",
    c2_final_system_expose: "구조를 공개하면 이민서의 이름은 흐려지고 실험 전체가 흔들립니다.",
    c2_final_system_trace: "결론을 미루는 동안 위험은 남지만 증거의 방향은 선명해집니다.",
    c2_final_system_contain: "봉인은 피해를 줄일 수 있지만, 실험의 권한은 그대로 남습니다.",
  });

  const routeByStartChoice = {
    c2_start_report: "c2_route_report",
    c2_start_meet: "c2_route_person",
    c2_start_verify: "c2_route_origin",
    free: "c2_logs",
  };
  nodes.c2_start.choices.forEach((choice) => {
    if (routeByStartChoice[choice.id]) choice.next = routeByStartChoice[choice.id];
  });
  nodes.c2_pressure.choices.forEach((choice) => { choice.next = "c2_judgment"; });
  nodes.c2_judgment_reaction.choices.forEach((choice) => { choice.next = "c2_final_evidence"; });
  nodes.c2_witness_reaction.choices.forEach((choice) => { choice.next = "c2_final_person"; });
  nodes.c2_trace_reaction.choices.forEach((choice) => { choice.next = "c2_final_system"; });
  nodes.c2_branch_records_follow.choices.forEach((choice) => { choice.next = "c2_final_system"; });

  const order = nodeOrders.case02;
  const startIndex = order.indexOf("c2_start");
  if (startIndex >= 0) {
    order.splice(startIndex + 1, 0, "c2_route_report", "c2_route_person", "c2_route_origin", "c2_route_system");
  }
  const aftershockIndex = order.indexOf("c2_aftershock");
  const finalInsertIndex = aftershockIndex >= 0 ? aftershockIndex : order.length;
  order.splice(finalInsertIndex, 0, "c2_final_evidence", "c2_final_person", "c2_final_system");
}

registerCase02DramaticRoutes();

const dramaticRoutePlans = {
  case01: {
    start: "start",
    result: "c1_aftershock",
    defaultFree: "c1_route_system",
    choices: {
      layoff: {
        route: "c1_route_layoff",
        final: "c1_final_layoff",
        phase: "STAFF ROUTE",
        title: "숫자보다 먼저 도착한 얼굴들",
        speaker: "도윤하",
        text: "인력 감축안을 고른 순간, 회의실 밖 대기 명단이 사건의 중심으로 들어옵니다. 절감액은 명확하지만 누가 빠졌을 때 조직이 어떤 약속을 잃는지는 아직 계산되지 않았습니다.",
        memo: ["핵심 담당자의 업무 인수표가 비어 있음", "감축 대상 중 내부 제보자가 포함됨", "절감액은 빠르게 확보되지만 신뢰 하락이 즉시 보임"],
        triggers: ["responsibility", "protection", "trust"],
        routeChoices: [
          ["c1_route_layoff_notice", "대상자에게 먼저 알리고 절감안을 다시 계산한다", { trust: 8, legitimacy: 6, capital: -6, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_layoff_fast", "통보를 늦추고 절감 효과를 먼저 확정한다", { capital: 10, time: 5, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c1_route_layoff_protect", "제보자를 보호 대상에서 분리해 명단을 다시 짠다", { trust: 6, legitimacy: 7, capital: -5, time: -7, fatigue: 7 }, { inference: 1, reframing: 1 }],
        ],
        finalTitle: "절감액 뒤에 남은 이름",
        finalText: "감축은 비용을 줄였지만 다음 사건의 증언자를 바꿨습니다. 이제 결론은 절감 여부가 아니라, 누구의 침묵을 비용으로 처리했는지에 걸립니다.",
        finalMemo: ["직원 신뢰가 다음 케이스의 시작 조건으로 이동", "절감액은 확보됐지만 내부 증언 경로가 좁아짐", "보호 대상 공개 여부가 새 선택지로 떠오름"],
        finalChoices: [
          ["a", "감축 명단과 그 판단 기준을 대상자에게 먼저 보낸다", { legitimacy: 9, trust: 7, capital: -7, time: -7, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "명단을 먼저 확정하고 통보 순서는 나중에 정한다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c", "감축 폭을 줄이는 대신 임원 보수 삭감을 명단 첫 줄에 올린다", { trust: 9, legitimacy: 6, capital: -6, time: -4, humanCost: -4, fatigue: 7 }, { reframing: 2 }],
        ],
      },
      funding: {
        route: "c1_route_funding",
        final: "c1_final_funding",
        phase: "CAPITAL ROUTE",
        title: "돈이 먼저 묻는 질문",
        speaker: "반재욱",
        text: "긴급 자금을 선택하자 투자 조건서의 숨은 문장이 열립니다. 자금은 시간을 벌어주지만 다음 의사결정의 공개 범위를 투자자가 제한할 수 있습니다.",
        memo: ["조건서에 비공개 심사 조항이 있음", "운영 시간은 확보되지만 설명 권한이 줄어듦", "투자자 승인 로그가 다음 케이스 증거가 될 수 있음"],
        triggers: ["reward", "order", "curiosity"],
        routeChoices: [
          ["c1_route_funding_clause", "비공개 조항을 공개 조건으로 바꿔 서명한다", { legitimacy: 9, trust: 4, capital: -5, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_funding_accept", "조건을 받아들이고 시간을 먼저 확보한다", { capital: 11, time: 6, trust: -6, legitimacy: -7, fatigue: -3 }, { risk: 2 }],
          ["c1_route_funding_split", "자금을 절반만 받고 설명 권한을 지킨다", { capital: 5, legitimacy: 6, trust: 5, time: -4, fatigue: 5 }, { reframing: 2 }],
        ],
        finalTitle: "살아남는 돈의 조건",
        finalText: "자금은 회사를 살렸지만 다음 사건의 질문을 바꿨습니다. 이제 플레이어는 문제를 해결하는 사람인지, 조건을 승인하는 사람인지 선택해야 합니다.",
        finalMemo: ["자금 조건이 다음 케이스 공개 범위를 흔듦", "시간 확보는 됐지만 외부 통제 비용이 생김", "조건 공개 여부가 신뢰의 분기점이 됨"],
        finalChoices: [
          ["a", "자금 조건 전문을 이사회 밖에도 공개한다", { legitimacy: 10, trust: 6, capital: -6, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "조건은 비공개로 두고 입금 일정부터 확정한다", { capital: 12, time: 6, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c", "설명 권한을 지키는 조건으로 조달 규모를 절반으로 줄인다", { trust: 8, legitimacy: 7, capital: -4, time: -5, fatigue: 6 }, { reframing: 2 }],
        ],
      },
      start_sale: {
        route: "c1_route_sale",
        final: "c1_final_sale",
        phase: "SALE ROUTE",
        title: "팔 수 있는 것과 남겨야 하는 것",
        speaker: "한서윤",
        text: "자산 매각을 고르자 매각 목록에 고객 데이터와 내부 도구가 함께 올라와 있다는 사실이 드러납니다. 돈을 만드는 행동이 곧 다음 사건의 위험을 만들 수 있습니다.",
        memo: ["매각 목록에 운영 로그 사본이 포함됨", "고객 데이터 처리 기준이 불명확함", "빠른 현금화와 장기 신뢰가 충돌"],
        triggers: ["reward", "injustice", "responsibility"],
        routeChoices: [
          ["c1_route_sale_clean", "데이터와 로그를 분리한 뒤 매각한다", { legitimacy: 8, trust: 5, capital: -5, time: -6, fatigue: 6 }, { inference: 2 }],
          ["c1_route_sale_bundle", "묶음 매각으로 현금을 최대한 빨리 확보한다", { capital: 12, time: 5, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c1_route_sale_hold", "매각을 보류하고 고객 고지부터 보낸다", { trust: 9, legitimacy: 5, capital: -8, time: -5, fatigue: 7 }, { persistence: 1, reframing: 1 }],
        ],
        finalTitle: "팔지 않은 증거",
        finalText: "매각하지 않은 자료가 다음 사건의 단서가 됩니다. 하지만 현금 부족은 더 빠르고 거친 결정을 요구하기 시작합니다.",
        finalMemo: ["보존한 로그가 다음 케이스 단서로 연결", "현금 압박이 커짐", "고객 고지가 신뢰 회복 경로를 만듦"],
        finalChoices: [
          ["a", "매각 목록에서 로그와 고객 데이터를 빼고 그 사실을 공지한다", { legitimacy: 9, trust: 7, capital: -8, time: -6, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "묶음 그대로 넘기고 고객 고지는 계약 뒤로 미룬다", { capital: 13, time: 5, trust: -9, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "인수자에게 기록 보존 의무를 계약 조건으로 건다", { trust: 8, legitimacy: 8, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
        ],
      },
      start_investigate: {
        route: "c1_route_investigate",
        final: "c1_final_investigate",
        phase: "AUDIT ROUTE",
        title: "멈춘 숫자 사이의 빈칸",
        speaker: "에코",
        text: "감사를 먼저 시작하자 절감안, 자금안, 매각안이 모두 같은 누락 로그를 지나간다는 사실이 드러납니다. 이번 선택은 해결책이 아니라 사건의 원인을 고르는 장면이 됩니다.",
        memo: ["세 대안이 같은 누락 로그를 공유", "감사 시간 동안 현금 압박이 커짐", "누락 로그 작성자가 다음 케이스 인물과 연결됨"],
        triggers: ["curiosity", "system", "responsibility"],
        routeChoices: [
          ["c1_route_investigate_freeze", "세 안건을 멈추고 누락 로그를 먼저 복구한다", { legitimacy: 9, trust: 6, capital: -8, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["c1_route_investigate_shadow", "겉으로는 진행하며 뒤에서 로그만 추적한다", { capital: 5, time: 4, trust: -5, legitimacy: -4, fatigue: 4 }, { risk: 2 }],
          ["c1_route_investigate_share", "누락 사실을 공개하고 공동 조사로 전환한다", { trust: 8, legitimacy: 8, capital: -7, time: -6, fatigue: 7 }, { reframing: 2 }],
        ],
        finalTitle: "첫 사건의 진짜 시작점",
        finalText: "감사는 답을 늦췄지만 질문의 방향을 바꿨습니다. 다음 사건은 더 이상 우연한 문제가 아니라, 누군가 반복해서 같은 빈칸을 만든 기록으로 시작됩니다.",
        finalMemo: ["누락 로그가 시리즈 전체 단서로 격상", "즉시 성과는 낮지만 해석 권한이 커짐", "공동 조사 여부가 다음 케이스의 시작 태도를 바꿈"],
        finalChoices: [
          ["a", "누락 로그와 작성자를 함께 공개하고 세 안건을 재심사한다", { legitimacy: 10, trust: 6, capital: -7, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "감사를 접고 가장 빠른 안건 하나만 실행한다", { capital: 10, time: 6, trust: -8, legitimacy: -7, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "감사 권한을 외부 회계인에게 넘기고 결과를 기다린다", { trust: 9, legitimacy: 7, capital: -6, time: -6, fatigue: 6 }, { reframing: 2 }],
        ],
      },
    },
    system: {
      route: "c1_route_system",
      final: "c1_final_system",
      title: "선택지 밖에서 발견한 첫 규칙",
      speaker: "에코",
      text: "준비된 답이 아닌 문장을 입력하자 화면은 절감, 자금, 매각(사업이나 자산을 팔아 돈을 마련하는 것)을 같은 표 위에 겹쳐 보여줍니다. 첫 사건의 반전은 위기가 하나가 아니라, 같은 판단 기준이 여러 위기를 낳고 있었다는 점입니다.",
      memo: ["자유입력이 숨은 공통 원인 경로를 엶", "모든 해결책이 같은 기준표를 통과함", "플레이어 문장이 다음 질문의 기준으로 기록됨"],
      routeChoices: [
        ["c1_route_system_trace", "기준표를 누가 언제 고쳤는지부터 되짚는다", { legitimacy: 8, trust: 3, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c1_route_system_use", "기준표는 그대로 두고 가장 빠른 안건을 밀어붙인다", { capital: 9, time: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c1_route_system_open", "기준표를 회의 밖 사람들에게 먼저 보여준다", { trust: 8, legitimacy: 6, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "공통 기준표를 공개하고 모든 안건을 재심사한다", { legitimacy: 9, trust: 6, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
      ["b", "기준표는 숨기고 가장 빠른 안건만 실행한다", { capital: 10, time: 5, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c", "기준표 작성 권한을 플레이어 밖으로 넘긴다", { trust: 8, legitimacy: 7, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
    ],
  },
  case03: {
    start: "c3_start",
    result: "c3_aftershock",
    defaultFree: "c3_route_system",
    choices: {
      c3_start_fast: {
        route: "c3_route_fast",
        final: "c3_final_win",
        phase: "SPEED ROUTE",
        title: "먼저 낸 답의 그림자",
        speaker: "오진우",
        text: "당신의 1차안이 먼저 도착하자 점수판은 잠시 당신을 올려놓습니다. 하지만 빠른 답은 고객에게 무엇을 보지 않아도 되는지까지 가르칩니다.",
        memo: ["고객은 빠른 결론에 호응함", "보안 제보는 아직 뒷장에 남음", "오진우는 당신의 생략 지점을 표시함"],
        triggers: ["competition", "recognition", "responsibility"],
        routeChoices: [
          ["c3_route_fast_lock", "빠른 안에 검증 기한을 조건으로 붙인다", { capital: 7, legitimacy: 6, time: -5, humanCost: 2, fatigue: 5 }, { persistence: 1, risk: 1 }],
          ["c3_route_fast_polish", "숫자를 더 다듬어 점수판 우위를 고정한다", { time: 6, capital: 9, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c3_route_fast_reopen", "내가 생략한 보안 항목을 직접 공개한다", { legitimacy: 9, trust: 4, capital: -6, time: -7, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "빠른 답이 만든 기준",
        finalText: "당신은 이길 수 있습니다. 문제는 이긴 뒤 고객이 같은 속도를 다음 사람에게도 요구하게 된다는 점입니다.",
        finalMemo: ["점수판은 속도를 보상함", "검증 기한은 아직 계약 조건 밖", "오진우는 같은 압박을 다음 입찰에도 쓸 수 있음"],
        finalChoices: [
          ["a", "이긴 안에 검증 기한을 계약 조건으로 박아 넣는다", { legitimacy: 9, trust: 6, capital: -6, time: -6, fatigue: 7 }, { persistence: 2, reframing: 1 }],
          ["b", "속도를 성과로 보고하고 다음 입찰도 같은 기준으로 받는다", { capital: 10, time: 6, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "내가 생략한 항목 목록을 고객에게 함께 넘긴다", { trust: 10, legitimacy: 7, capital: -5, time: -4, fatigue: 7 }, { reframing: 3 }],
        ],
      },
      c3_start_deep: {
        route: "c3_route_deep",
        final: "c3_final_right",
        phase: "PROOF ROUTE",
        title: "느린 쪽에 쌓이는 증거",
        speaker: "반재욱",
        text: "보안 제보를 따라가자 입찰 자료보다 오래된 결함 보고서가 나옵니다. 질문은 이제 누가 이기는가가 아니라, 무엇을 알고도 계약할 수 있는가입니다.",
        memo: ["오래된 결함 보고서 발견", "입찰 마감은 더 가까워짐", "고객은 아직 결함 공개를 원하지 않음"],
        triggers: ["curiosity", "injustice", "responsibility"],
        routeChoices: [
          ["c3_route_deep_attach", "결함 보고서를 입찰안 첫 장에 붙인다", { legitimacy: 9, trust: 3, capital: -6, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
          ["c3_route_deep_delay", "계약 전 검증 시간을 공식 요청한다", { trust: 5, legitimacy: 7, capital: -5, time: -9, fatigue: 7 }, { persistence: 2 }],
          ["c3_route_deep_bury", "결함은 내부 부록에 묶고 가격 경쟁을 계속한다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ],
        finalTitle: "맞는 답의 손실",
        finalText: "느린 답은 더 정확하지만, 정확함만으로는 입찰장을 이기지 못합니다. 이제 손실을 누가 공식적으로 감수할지 정해야 합니다.",
        finalMemo: ["결함은 상당히 유력함", "마감 연장은 불확실함", "정확한 답은 당장의 점수를 잃음"],
        finalChoices: [
          ["a", "결함 보고서를 붙인 안을 그대로 내고 탈락을 감수한다", { legitimacy: 10, trust: 5, capital: -8, time: -5, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "결함은 부록에 묻고 가격으로 계약을 가져온다", { capital: 10, time: 5, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "손실을 회사 비용으로 공식화하고 결함 검증은 계약 밖에서 계속한다", { trust: 9, legitimacy: 7, capital: -6, fatigue: 8 }, { reframing: 3 }],
        ],
      },
      c3_start_mirror: {
        route: "c3_route_mirror",
        final: "c3_final_joint",
        phase: "RIVAL ROUTE",
        title: "상대의 판을 읽는 사람",
        speaker: "오진우",
        text: "오진우의 접근법을 따라가자 그의 안에도 일부러 비워둔 칸이 보입니다. 그는 당신을 이기려는 동시에 당신이 그 빈칸을 볼 수 있는지 시험하고 있습니다.",
        memo: ["오진우 안의 책임 조항이 비어 있음", "공동안 가능성이 열림", "경쟁을 멈추면 점수판 우위는 사라짐"],
        triggers: ["competition", "curiosity", "recognition"],
        routeChoices: [
          ["c3_route_mirror_call", "오진우에게 빈 책임 조항을 직접 묻는다", { trust: 7, legitimacy: 6, capital: -4, time: -5, fatigue: 5 }, { reframing: 2 }],
          ["c3_route_mirror_use", "빈칸을 이용해 내 안을 더 유리하게 만든다", { capital: 10, time: 4, trust: -7, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c3_route_mirror_share", "빈칸을 공동 검증 조건으로 바꾼다", { trust: 9, legitimacy: 5, capital: -6, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "경쟁자를 도구로 쓸 것인가",
        finalText: "오진우를 이기는 길과 오진우를 증인으로 만드는 길이 갈라졌습니다. 당신은 경쟁을 끝낼 수도, 경쟁 자체를 증거로 만들 수도 있습니다.",
        finalMemo: ["공동안은 책임을 나눔", "독자안은 점수판에서 유리함", "경쟁 구조 공개는 고객을 불편하게 함"],
        finalChoices: [
          ["a", "공동안을 내고 책임 조항을 두 사람 이름으로 채운다", { legitimacy: 8, trust: 7, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
          ["b", "오진우의 빈칸을 근거로 독자안을 밀어붙인다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "경쟁 구조 자체를 고객 앞에서 문제로 올린다", { trust: 10, legitimacy: 8, capital: -7, time: -4, fatigue: 8 }, { reframing: 3 }],
        ],
      },
    },
    system: {
      route: "c3_route_system",
      final: "c3_final_system",
      title: "점수판이 당신을 따라온다",
      speaker: "에코",
      text: "준비된 전략 밖의 말을 남기자 점수판 항목이 바뀝니다. 이번 입찰은 오진우와의 승부가 아니라, 당신이 어떤 평가 기준을 만들면 따라오는지 보는 장치였습니다.",
      memo: ["자유입력 문장이 새 평가 항목으로 변환됨", "오진우 점수도 동시에 재계산됨", "고객 화면에는 변경 사유가 보이지 않음"],
      routeChoices: [
        ["c3_route_system_read", "새로 생긴 평가 항목이 어디서 왔는지 추적한다", { legitimacy: 8, trust: 3, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c3_route_system_ride", "바뀐 점수판을 그대로 타고 우위를 굳힌다", { capital: 9, time: 6, trust: -7, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c3_route_system_tell", "오진우에게 점수판이 바뀌었다는 사실을 먼저 알린다", { trust: 9, legitimacy: 5, capital: -5, time: -4, fatigue: 6 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내가 만든 평가 기준을 고객에게 공개한다", { legitimacy: 9, trust: 5, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
      ["b", "기준은 숨기고 결과만 유리하게 사용한다", { capital: 9, time: 5, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "오진우와 함께 점수판 자체를 거부한다", { trust: 10, legitimacy: 6, capital: -5, fatigue: 7 }, { reframing: 3 }],
    ],
  },
  case04: {
    start: "c4_start",
    result: "c4_aftershock",
    defaultFree: "c4_route_system",
    choices: {
      c4_start_approve: {
        route: "c4_route_exception",
        final: "c4_final_exception",
        phase: "EXCEPTION ROUTE",
        title: "좋은 결과가 먼저 온다",
        speaker: "도윤하",
        text: "산식 해석을 넓히자 서비스 유지 가능성이 크게 올라갑니다. 대신 질문은 규칙을 지킬 것인가가 아니라, 좋은 결과가 규칙을 바꿀 권한이 되는가로 바뀝니다.",
        memo: ["서비스 유지 확률 상승", "산식 변경 흔적은 내부에만 남음", "같은 예외를 기다리는 기관이 생김"],
        triggers: ["reward", "protection", "order"],
        routeChoices: [
          ["c4_route_exception_publish", "예외 사유와 수혜 대상을 함께 공개한다", { trust: 7, legitimacy: 8, capital: -6, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c4_route_exception_repeat", "같은 조건의 기관에도 예외 가능성을 연다", { capital: 10, trust: -4, legitimacy: -8, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c4_route_exception_meter", "예외를 한 번만 쓰도록 감사 계량기를 붙인다", { legitimacy: 7, trust: 4, capital: -4, time: -6, fatigue: 5 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "예외가 규칙이 되는 순간",
        finalText: "선의로 넓힌 규칙은 이미 다른 사람의 기준이 됐습니다. 이제 예외를 숨길지, 공개해 새 규칙으로 만들지 결정해야 합니다.",
        finalMemo: ["서비스는 유지될 수 있음", "예외 반복 요구 증가", "공개하면 심사 자체가 흔들림"],
        finalChoices: [
          ["a", "예외 사유와 수혜 대상을 공개하고 새 규칙으로 등록한다", { legitimacy: 10, trust: 7, capital: -7, time: -6, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "이번 한 번의 판단으로 두고 예외 기록은 남기지 않는다", { capital: 10, time: 5, trust: -5, legitimacy: -9, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "예외 적용을 피해 당사자 동의 절차 뒤로 미룬다", { trust: 9, legitimacy: 7, capital: -8, humanCost: -6, fatigue: 8 }, { reframing: 3 }],
        ],
      },
      c4_start_refuse: {
        route: "c4_route_rule",
        final: "c4_final_rule",
        phase: "RULE ROUTE",
        title: "원칙이 만든 손실",
        speaker: "반재욱",
        text: "부족한 지표를 그대로 보고하자 현장팀은 누가 서비스를 잃는지 명단을 보냅니다. 질문은 원칙을 지켰는가가 아니라, 원칙의 피해를 누가 책임지는가입니다.",
        memo: ["서비스 중단 후보 명단 도착", "법무팀은 절차상 안전하다고 판단", "현장팀은 다른 자금을 요구함"],
        triggers: ["order", "protection", "responsibility"],
        routeChoices: [
          ["c4_route_rule_fund", "다른 자금과 손실 명단을 함께 공개한다", { trust: 7, legitimacy: 7, capital: -9, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
          ["c4_route_rule_wait", "심사 결과 전까지 명단 공개를 미룬다", { time: 5, capital: 5, trust: -7, legitimacy: -3, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c4_route_rule_rewrite", "부족한 지표를 피해 기준으로 다시 설명한다", { legitimacy: 8, trust: 4, time: -7, capital: -5, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "깨끗한 절차의 피해자",
        finalText: "규칙은 지켜졌지만 잃을 사람이 생겼습니다. 마지막 질문은 절차의 깨끗함과 피해 완화를 어떻게 함께 기록할지입니다.",
        finalMemo: ["절차상 리스크는 낮음", "현장 피해는 즉시 발생 가능", "다른 자금은 불확실함"],
        finalChoices: [
          ["a", "절차 기록과 피해 명단을 같은 문서에 올린다", { legitimacy: 10, trust: 5, capital: -6, time: -7, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "절차상 문제가 없다는 결론만 남기고 명단은 내부에 둔다", { capital: 9, time: 6, trust: -6, legitimacy: -7, humanCost: 6, fatigue: -4 }, { risk: 2 }],
          ["c", "다른 자금을 찾을 때까지 심사 결과 집행을 늦춘다", { trust: 8, legitimacy: 6, capital: -9, time: -6, humanCost: -6, fatigue: 8 }, { reframing: 3 }],
        ],
      },
      c4_start_contain: {
        route: "c4_route_audit",
        final: "c4_final_audit",
        phase: "AUDIT ROUTE",
        title: "조건을 붙인 선의",
        speaker: "한서윤",
        text: "산식 변경과 사후 검증을 함께 걸자 양쪽 모두 불편해합니다. 이제 질문은 선택 자체가 아니라, 누가 그 조건을 감시할 권한을 갖는가입니다.",
        memo: ["조건부 승인 문안 작성", "기자는 조건의 실효성을 물음", "현장팀은 감시가 서비스를 늦춘다고 우려함"],
        triggers: ["responsibility", "order", "injustice"],
        routeChoices: [
          ["c4_route_audit_public", "감시 권한을 외부 이용자 대표에게 준다", { legitimacy: 9, trust: 6, capital: -7, time: -5, fatigue: 7 }, { reframing: 2 }],
          ["c4_route_audit_internal", "내부 감사팀만 조건을 확인하게 한다", { capital: 6, legitimacy: -3, trust: -4, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c4_route_audit_split", "심사와 감사 권한을 분리한다", { legitimacy: 7, trust: 4, capital: -5, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ],
        finalTitle: "감시받는 선의",
        finalText: "조건을 붙인 결정은 해결이 아니라 운영 구조가 됐습니다. 이제 그 구조를 공개할지, 내부에서만 통제할지 선택해야 합니다.",
        finalMemo: ["조건부 승인은 양쪽 리스크를 모두 남김", "외부 감시는 느리지만 신뢰를 줌", "내부 통제는 빠르지만 은폐로 보일 수 있음"],
        finalChoices: [
          ["a", "조건과 감사 결과를 이용자에게 정기 공개한다", { legitimacy: 9, trust: 7, capital: -7, time: -6, fatigue: 7 }, { persistence: 2, reframing: 1 }],
          ["b", "조건은 유지하되 감사 내용은 내부 문서로만 남긴다", { capital: 8, time: 5, trust: -5, legitimacy: -8, humanCost: 4, fatigue: -4 }, { risk: 2 }],
          ["c", "감사 권한을 이용자 대표에게 넘기고 나는 심사만 맡는다", { trust: 10, legitimacy: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
        ],
      },
    },
    system: {
      route: "c4_route_system",
      final: "c4_final_system",
      title: "명분 있는 위반의 복제",
      speaker: "에코",
      text: "자유로운 제안을 남기자 트리거랩 화면에 '명분 있는 위반 허용선'이 표시됩니다. 당신의 선의는 다음 기관이 규칙을 넘는 안내문으로 바뀔 수 있습니다.",
      memo: ["제안 문장이 예외 승인 모델에 기록됨", "다음 기관 시뮬레이션이 자동 생성됨", "피해자 명단은 아직 입력되지 않음"],
      routeChoices: [
        ["c4_route_system_limit", "허용선 문장에 사용 한도부터 적어 넣는다", { legitimacy: 9, trust: 4, capital: -5, time: -6, fatigue: 6 }, { persistence: 2, inference: 1 }],
        ["c4_route_system_ship", "허용선은 그대로 두고 이번 승인부터 끝낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ["c4_route_system_ask", "다음 기관 시뮬레이션에 피해자 명단부터 넣는다", { trust: 8, legitimacy: 6, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내 예외 기준을 모두 공개하고 재사용을 막는다", { legitimacy: 10, trust: 6, capital: -7, time: -6, fatigue: 7 }, { persistence: 2 }],
      ["b", "서비스 유지 효과를 근거로 재사용을 허용한다", { capital: 10, trust: -4, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "예외 기준을 피해자 동의 없이는 작동하지 않게 바꾼다", { trust: 9, legitimacy: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
    ],
  },
  case05: {
    start: "c5_start",
    result: "c5_aftershock",
    defaultFree: "c5_route_system",
    choices: {
      c5_start_blame: {
        route: "c5_route_blame",
        final: "c5_final_blame_route",
        phase: "BLAME ROUTE",
        title: "이름이 먼저 생긴 실패",
        speaker: "오진우",
        text: "책임자를 특정하자 언론 대응은 빨라집니다. 하지만 이름이 생기는 순간, 시스템의 빈칸은 그 사람의 잘못처럼 정리됩니다.",
        memo: ["책임자 후보 실명 확보", "보도 대응 문안 작성", "누락자 분포 분석은 중단됨"],
        triggers: ["responsibility", "competition", "order"],
        routeChoices: [
          ["c5_route_blame_compensate", "책임자 발표와 피해 보상을 동시에 낸다", { trust: 8, legitimacy: 4, capital: -7, humanCost: -7, fatigue: 6 }, { risk: 1, persistence: 1 }],
          ["c5_route_blame_single", "한 사람의 책임으로 사건을 빠르게 닫는다", { time: 7, capital: 6, trust: -8, legitimacy: -3, humanCost: 6, fatigue: -4 }, { risk: 2 }],
          ["c5_route_blame_reopen", "책임자 이름을 보류하고 승인 경로를 다시 연다", { legitimacy: 8, trust: -2, time: -8, capital: -4, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ],
        finalTitle: "이름으로 닫힌 문",
        finalText: "책임자를 세우면 설명은 빨라집니다. 하지만 다음 실패를 막을 장치는 아직 없습니다.",
        finalMemo: ["여론은 빠르게 안정될 수 있음", "피해자는 즉시 보상을 원함", "시스템 구조는 아직 그대로임"],
        finalChoices: [
          ["a", "책임자 발표와 재발 방지 예산을 같은 날 확정한다", { trust: 9, legitimacy: 8, capital: -9, humanCost: -9, fatigue: 8 }, { reframing: 3 }],
          ["b", "발표는 한 사람의 책임으로 끝내고 구조 조사는 접는다", { trust: 6, capital: -5, legitimacy: -7, humanCost: -6, fatigue: 7 }, { risk: 2 }],
          ["c", "지목을 보류하고 승인 경로 전체를 공개 조사로 연다", { legitimacy: 10, trust: 3, capital: -6, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
        ],
      },
      c5_start_map: {
        route: "c5_route_map",
        final: "c5_final_map_route",
        phase: "MAP ROUTE",
        title: "화살표가 가리키는 구조",
        speaker: "반재욱",
        text: "의사결정 흐름을 그리자 누구도 단독 범인이 아니었습니다. 질문은 이제 책임자를 찾는 일이 아니라, 책임이 흩어지는 방식을 멈추는 일입니다.",
        memo: ["예산, 운영, 알고리즘 결정이 동시에 작용", "각 결정은 개별적으로 합리적임", "피해자는 기준마다 조금씩 밀림"],
        triggers: ["curiosity", "responsibility", "order"],
        routeChoices: [
          ["c5_route_map_publish", "실패 지도를 그대로 공개한다", { legitimacy: 9, trust: 4, capital: -6, time: -6, fatigue: 7 }, { inference: 2 }],
          ["c5_route_map_owner", "각 화살표마다 결정권자를 붙인다", { legitimacy: 7, trust: -2, time: -7, humanCost: 2, fatigue: 5 }, { persistence: 2 }],
          ["c5_route_map_delay", "지도는 내부에 두고 보상부터 처리한다", { trust: 7, capital: -7, legitimacy: -5, humanCost: -6, fatigue: 6 }, { risk: 1, reframing: 1 }],
        ],
        finalTitle: "책임이 흩어지는 방식",
        finalText: "구조를 보면 누구도 혼자 유죄가 아닙니다. 그렇다고 아무도 책임지지 않는 결론을 낼 수는 없습니다.",
        finalMemo: ["공개 지도는 조직 전체를 흔듦", "결정권자 매핑은 반발을 부름", "보상 우선은 구조 수정을 늦춤"],
        finalChoices: [
          ["a", "화살표마다 결정권자와 보상 책임을 함께 붙여 공개한다", { trust: 8, legitimacy: 9, capital: -9, humanCost: -10, fatigue: 8 }, { reframing: 3 }],
          ["b", "지도는 내부 자료로 두고 보상 발표만 먼저 낸다", { trust: 7, capital: -6, legitimacy: -7, humanCost: -7, fatigue: 7 }, { risk: 2 }],
          ["c", "구조 실패 보고서를 외부 검토에 그대로 넘긴다", { legitimacy: 11, trust: 4, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
        ],
      },
      c5_start_redesign: {
        route: "c5_route_redesign",
        final: "c5_final_redesign_route",
        phase: "RECOVERY ROUTE",
        title: "먼저 고친 뒤 묻는 책임",
        speaker: "도윤하",
        text: "임시 수동 배차가 시작되자 피해는 줄어듭니다. 대신 무엇이 잘못됐는지 기록하기 전에 시스템이 바뀌고 있습니다.",
        memo: ["수동 배차로 일부 피해 회복", "원인 로그가 새 작업으로 덮일 위험", "현장 피로가 급격히 증가"],
        triggers: ["protection", "responsibility", "curiosity"],
        routeChoices: [
          ["c5_route_redesign_snapshot", "고치기 전 상태를 증거로 스냅샷한다", { legitimacy: 9, capital: -5, time: -6, humanCost: -4, fatigue: 7 }, { inference: 2, persistence: 1 }],
          ["c5_route_redesign_continue", "원인 기록보다 복구 속도를 우선한다", { trust: 9, capital: -8, legitimacy: -4, humanCost: -9, fatigue: 8 }, { risk: 2 }],
          ["c5_route_redesign_rule", "수동 배차 조건을 새 보호 규칙으로 만든다", { trust: 7, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 7 }, { reframing: 2 }],
        ],
        finalTitle: "복구가 지운 증거",
        finalText: "피해는 줄었지만 원인 기록도 바뀌었습니다. 이제 회복과 책임 규명의 순서를 정해야 합니다.",
        finalMemo: ["복구는 실제로 효과가 있음", "원인 증거는 사라질 수 있음", "현장 피로가 다음 실패를 부를 수 있음"],
        finalChoices: [
          ["a", "복구 전 스냅샷을 공개하고 새 보호 규칙을 함께 낸다", { trust: 9, legitimacy: 7, capital: -9, humanCost: -11, fatigue: 8 }, { reframing: 3 }],
          ["b", "복구를 계속하고 원인 기록은 다음 과제로 넘긴다", { trust: 6, capital: -5, legitimacy: -8, humanCost: -8, fatigue: 7 }, { risk: 2 }],
          ["c", "복구를 잠시 멈추고 원인 로그부터 보존한다", { legitimacy: 10, trust: 3, capital: -6, time: -8, humanCost: 3, fatigue: 8 }, { inference: 2, persistence: 1 }],
        ],
      },
    },
    system: {
      route: "c5_route_system",
      final: "c5_final_system_route",
      title: "조용한 사람을 낮게 보는 장치",
      speaker: "에코",
      text: "준비된 선택지 밖의 복구안을 내자, 알고리즘(판단 순서를 정해 둔 계산 규칙)의 숨은 가중치가 보입니다. 시스템은 도움을 크게 요구하지 못하는 사람을 낮은 우선순위로 배웠습니다.",
      memo: ["불만 제기 빈도가 보호 가중치에 역으로 작용", "가족 연락처 불안정이 낮은 신뢰도로 처리됨", "조용한 피해자는 모델 학습에서 누락됨"],
      routeChoices: [
        ["c5_route_system_audit", "가중치가 학습한 자료부터 열어 본다", { legitimacy: 9, trust: 3, capital: -4, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c5_route_system_patch", "가중치는 두고 이번 배차만 손으로 고친다", { capital: 7, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c5_route_system_call", "누락된 사람들에게 먼저 연락해 기준을 묻는다", { trust: 9, legitimacy: 5, capital: -6, humanCost: -7, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "조용한 사람 보호 가중치를 공개 기준으로 넣는다", { trust: 9, legitimacy: 8, capital: -9, humanCost: -11, fatigue: 8 }, { reframing: 3 }],
      ["b", "가중치는 숨기고 수동 보정만 계속한다", { trust: 6, capital: -6, legitimacy: -6, humanCost: -7, fatigue: 7 }, { risk: 2 }],
      ["c", "모델 학습 자료에서 피해자 누락 기록을 먼저 공개한다", { legitimacy: 10, trust: 4, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
    ],
  },
  case06: {
    start: "c6_start",
    result: "c6_aftershock",
    defaultFree: "c6_route_system",
    // No four-way split here on purpose. The other cases offer four strategies
    // against an organisation; this one has a single person in it, so the
    // authored middle is the route and only the free-text door opens a new one.
    choices: {},
    system: {
      route: "c6_route_system",
      final: "c6_final_system_route",
      title: "실험 번호가 같은 두 사람",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 실험 색인이 열립니다. 오진우와 당신의 프로필은 서로 다른 조건이 아니라, 한 실험의 위쪽 선과 아래쪽 선이었습니다.",
      memo: ["두 프로필의 실험 번호가 동일", "조건 변경 시점이 서로 맞물려 있음", "색인에는 다음 참가자 칸이 비어 있음"],
      routeChoices: [
        ["c6_route_system_index", "색인 전체를 열어 다음 참가자 칸을 확인한다", { legitimacy: 9, trust: 4, capital: -5, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c6_route_system_quiet", "색인은 닫고 이번 위원회만 넘긴다", { time: 6, capital: 7, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c6_route_system_pair", "오진우에게 색인을 같이 보자고 한다", { trust: 10, legitimacy: 5, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "두 사람의 조건을 하나의 기록으로 함께 낸다", { legitimacy: 10, trust: 7, capital: -8, humanCost: -6, fatigue: 8 }, { reframing: 3 }],
      ["b", "색인을 닫고 이번 사건만 조용히 끝낸다", { capital: 8, time: 5, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "다음 참가자 칸에 내 이름을 적어 넘긴다", { legitimacy: 8, trust: 5, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case07: {
    start: "c7_start",
    result: "c7_aftershock",
    defaultFree: "c7_route_system",
    // Like case 06, no four-way split. The case is 48 hours of asking people
    // for things, not four strategies against an institution, so the authored
    // middle is the route and only the free-text door opens another.
    choices: {},
    system: {
      route: "c7_route_system",
      final: "c7_final_system_route",
      title: "발령 기록부",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 인사 발령(근무지를 옮기라는 인사 명령) 기록부가 열립니다. 최근 4년간 승인란이 빈 채 그대로 시행된 발령은 열아홉 건이고, 그중 열일곱 명이 같은 부서를 거쳐 갔습니다. 당신은 열여덟 번째가 아니라, 같은 표의 한 줄입니다.",
      memo: ["승인란 공란 발령 19건", "17명이 기업금융전략팀 경유", "표의 마지막 줄은 아직 비어 있음"],
      routeChoices: [
        ["c7_route_system_trace", "열아홉 건을 전부 따라가 표를 완성한다", { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["c7_route_system_quiet", "표는 닫고 내 건만 처리한다", { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c7_route_system_call", "먼저 발령된 열일곱 명에게 연락한다", { trust: 12, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "열아홉 건을 하나의 문서로 묶어 외부에 낸다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
      ["b", "내 건만 취소시키고 나머지는 덮는다", { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 }, { risk: 2 }],
      ["c", "표의 마지막 줄에 내 이름을 적어 남긴다", { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case08: {
    start: "c8_start",
    result: "c8_aftershock",
    defaultFree: "c8_route_system",
    // Cases 06 and 07 have one person or one posting at their centre and no
    // four-way split. So does this one: it is one trail, followed by one grudge.
    choices: {},
    system: {
      route: "c8_route_system",
      final: "c8_final_system_route",
      title: "같은 주소의 일곱 법인",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 법인 등기(회사의 주소와 대표를 나라 장부에 올린 기록) 이력이 열립니다. 해온파트너스와 같은 주소, 같은 세무 대리인(세금 신고를 대신해 주는 사무소), 같은 청산(회사를 정리해 없애는 절차) 시점을 가진 회사가 지난 6년간 일곱 곳입니다. 흔적은 한 줄이 아니라, 같은 손이 반복해서 그린 무늬였습니다.",
      memo: ["같은 주소·같은 세무 대리인 법인 7곳", "모두 감사 착수 직전에 청산", "일곱 번째가 해온파트너스"],
      routeChoices: [
        ["c8_route_system_map", "일곱 법인의 흐름을 한 장의 지도로 잇는다", { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["c8_route_system_one", "지도는 접고 해온파트너스 한 곳만 판다", { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c8_route_system_agent", "일곱 곳을 만든 세무 대리인을 먼저 찾아간다", { trust: 11, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "일곱 법인을 하나의 무늬로 묶어 외부에 낸다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
      ["b", "해온파트너스 한 건만 남기고 나머지는 덮는다", { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 }, { risk: 2 }],
      ["c", "무늬의 마지막 칸에 내 조회 기록을 남긴다", { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case09: {
    start: "c9_start",
    result: "c9_aftershock",
    defaultFree: "c9_route_system",
    // One rescue, two sheets of paper. The split is the table, not the route.
    choices: {},
    system: {
      route: "c9_route_system",
      final: "c9_final_system_route",
      title: "세 번째 계산서",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 세 번째 표를 엽니다. 채권단(돈을 빌려준 금융회사들의 협의체) 누구도 작성하지 않은 계산서, 청산(회사를 정리해 없애는 절차)했을 때 1,140명의 가족이 치르는 비용입니다. 건강보험 전환, 학자금 연체(갚을 날짜를 넘긴 빚), 협력사 연쇄 부도(빚을 갚지 못해 회사가 쓰러지는 일). 합계는 브릿지은행이 청산으로 더 돌려받는 금액의 2.3배입니다.",
      memo: ["청산 때 가족·협력사가 치를 비용 추정: 더 돌려받는 금액의 2.3배", "채권단 계산서에는 이 칸이 없음", "추정치라 법적 구속력은 없음"],
      routeChoices: [
        ["c9_route_system_add", "세 번째 계산서를 채권단 공식 자료로 올린다", { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["c9_route_system_quiet", "표는 닫고 기존 두 장으로만 싸운다", { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c9_route_system_families", "가족 대표들에게 이 표를 먼저 보여 준다", { trust: 12, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "세 장의 계산서를 한 묶음으로 결의에 올린다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
      ["b", "세 번째 표는 덮고 회수율로만 협상한다", { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 }, { risk: 2 }],
      ["c", "세 번째 표 맨 아래에 작성자로 내 이름을 쓴다", { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case10: {
    start: "c10_start",
    result: "c10_aftershock",
    defaultFree: "c10_route_system",
    // One person's obsession, and the question of who else is allowed to carry
    // it. There is no four-way split here either: the case is a single handover.
    choices: {},
    system: {
      route: "c10_route_system",
      final: "c10_final_system_route",
      title: "소진율",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 한 번도 집계된 적 없는 지표를 만듭니다. 지난 6년간 고객 피해를 자발적으로 추적한 직원 34명. 그중 29명이 3년 안에 퇴직하거나 장기 병가에 들어갔습니다. 평균 지속 기간은 2년 7개월입니다. '선의는 이 조직에서 평균 31개월 만에 소모됩니다. 아무도 이 숫자를 재지 않았습니다. 재면 관리 대상이 되니까요.'",
      memo: ["자발적 피해 추적자 34명 중 29명이 3년 내 이탈", "평균 지속 31개월 -- 도윤하는 36개월째", "이 지표는 어떤 보고서에도 존재한 적 없음"],
      routeChoices: [
        ["c10_route_system_publish", "소진율을 그룹 공식 지표로 등록시킨다", { legitimacy: 11, trust: 5, capital: -7, time: -9, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c10_route_system_hide", "지표는 닫고 도윤하 개인 건으로만 간다", { time: 8, capital: 7, trust: -8, legitimacy: -7, humanCost: 5, fatigue: -5 }, { risk: 2 }],
        ["c10_route_system_reach", "이탈한 29명에게 먼저 연락해 이야기를 듣는다", { trust: 13, legitimacy: 4, capital: -8, humanCost: -7, time: -10, fatigue: 9 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "소진율을 명단 제도와 한 묶음으로 올린다", { legitimacy: 13, trust: 8, capital: -9, humanCost: -6, fatigue: 7 }, { reframing: 3 }],
      ["b", "지표는 덮고 분담표만 통과시킨다", { capital: 10, time: 7, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "소진율 34번째 줄에 내 이름을 미리 적어 둔다", { legitimacy: 8, trust: 7, capital: -6, time: -7, humanCost: 4, fatigue: 9 }, { persistence: 2 }],
    ],
  },
  case11: {
    start: "c11_start",
    result: "c11_aftershock",
    defaultFree: "c11_route_system",
    // One hearing, one answer. Like 사건 10, the case is a single line to the
    // room; the split is what the analyst says in it, not where they go.
    choices: {},
    system: {
      route: "c11_route_system",
      final: "c11_final_system_route",
      title: "확인해 보겠습니다",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지난 10년 정무위원회 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 공개적으로 따져 묻는 자리)의 속기록(회의에서 오간 말을 그대로 적은 공식 기록) 1,812건을 엽니다. 금융회사 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)이 받은 질문은 7,430개, 가장 많이 나온 답은 '확인해 보겠습니다'로 2,114번입니다. 그 약속 가운데 다음 해 국정감사에서 확인 결과가 실제로 보고된 건 3%입니다. '이 방은 진실을 묻는 곳이 아니라, 1년 동안 미룰 수 있는 문장을 고르는 곳으로 학습되어 있습니다.'",
      memo: ["지난 10년 속기록 1,812건", "'확인해 보겠습니다' 2,114번 -- 이행 보고 3%", "이 통계는 어떤 보고서에도 인용된 적 없음"],
      routeChoices: [
        ["c11_route_system_publish", "통계를 서하린에게 넘겨 기사로 만든다", { legitimacy: 10, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c11_route_system_pledge", "내 답변에서만은 '확인해 보겠습니다'를 쓰지 않기로 한다", { trust: 11, legitimacy: 7, humanCost: 3, time: -7, fatigue: 6 }, { reframing: 2 }],
        ["c11_route_system_drop", "통계는 덮고 준비된 답변 틀을 따른다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "답변마다 확인 기한과 보고 날짜를 붙여 말한다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "질문을 넘기고 통계는 기록에만 남긴다", { capital: 9, time: 7, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "내년 국정감사에 스스로 다시 나오겠다고 약속한다", { legitimacy: 8, trust: 8, capital: -5, time: -7, humanCost: 3, fatigue: 9 }, { persistence: 2 }],
    ],
  },
  final: {
    start: "f_start",
    result: "f_aftershock",
    defaultFree: "f_route_system",
    choices: {
      f_start_map: {
        route: "f_route_map",
        final: "f_final_map",
        phase: "TRACE ROUTE",
        title: "내 로그가 만든 사건들",
        speaker: "에코",
        text: "당신의 선택 로그를 따라가자 각 케이스의 질문이 조금씩 조정된 기록이 보입니다. 마지막 사건은 해결해야 할 문제가 아니라, 당신의 기준이 남긴 흔적입니다.",
        memo: ["선택 로그와 사건 설계 변경 기록 일치", "응답 시간이 압박 조건으로 재사용됨", "일부 선택 문장은 다음 참가자 선택지로 복제됨"],
        triggers: ["curiosity", "selfAwareness", "responsibility"],
        routeChoices: [
          // Cheaper in money than the routes that stage a confrontation: the
          // records already exist, so this route pays in time and trust instead.
          // It is also what keeps the trace column from being dominated once the
          // route walks its authored scenes.
          ["f_route_map_open", "내 로그가 바꾼 질문을 모두 공개한다", { legitimacy: 10, trust: 5, capital: -3, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["f_route_map_delete", "내 로그만 삭제하고 다른 참가자 기록은 남긴다", { trust: -5, legitimacy: -4, humanCost: 5, time: 5, fatigue: -4 }, { risk: 2 }],
          ["f_route_map_return", "복제된 선택지를 원래 참가자에게 돌려준다", { trust: 9, legitimacy: 6, capital: -7, humanCost: -5, fatigue: 8 }, { reframing: 2 }],
        ],
        finalTitle: "내 기준을 공개할 것인가",
        finalText: "당신이 만든 질문은 이미 다른 사람에게 쓰였습니다. 이제 그 사실을 증거로 열지, 조용히 지울지 정해야 합니다.",
        finalMemo: ["공개하면 모든 케이스의 전제가 흔들림", "삭제는 악용을 줄이지만 책임도 지움", "돌려주기는 동의 절차를 다시 요구함"],
        finalChoices: [
          ["a", "내 로그가 바꾼 질문을 전부 목록으로 공개한다", { legitimacy: 9, trust: 5, capital: -4, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
          ["b", "복제된 선택지를 원래 참가자에게 돌려주고 삭제 권한까지 넘긴다", { trust: 10, legitimacy: 7, capital: -6, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
          ["c", "내 로그를 포함한 모든 원본을 다음 참가자에게 넘긴다", { legitimacy: 20, trust: 7, humanCost: 3, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
        ],
      },
      f_start_expose: {
        route: "f_route_expose",
        final: "f_final_expose",
        phase: "EXPOSE ROUTE",
        title: "밖으로 나간 실험",
        speaker: "반재욱",
        text: "외부 공개 준비가 시작되자 트리거랩은 일부 서버를 닫습니다. 질문은 폭로할 것인가가 아니라, 무엇을 증거로 남겨야 폭로가 또 다른 피해가 되지 않는가입니다.",
        memo: ["서버 일부가 봉인됨", "참가자 실명 보호가 불완전함", "언론은 즉시 공개를 원함"],
        triggers: ["injustice", "responsibility", "order"],
        routeChoices: [
          ["f_route_expose_redact", "참가자 식별자를 지우고 구조 증거만 공개한다", { legitimacy: 9, trust: 6, capital: -6, time: -7, humanCost: -5, fatigue: 8 }, { persistence: 2 }],
          ["f_route_expose_raw", "원본을 그대로 넘겨 삭제 시간을 막는다", { legitimacy: 10, trust: -7, humanCost: 6, time: 6, fatigue: -4 }, { risk: 2 }],
          ["f_route_expose_hold", "외부 감사단이 올 때까지 공개를 멈춘다", { trust: 5, legitimacy: 7, time: -9, capital: -5, fatigue: 7 }, { inference: 2 }],
        ],
        finalTitle: "폭로의 피해자를 줄일 것인가",
        finalText: "구조를 드러내는 일도 누군가의 기록을 노출합니다. 마지막 질문은 진실의 속도와 보호의 순서입니다.",
        finalMemo: ["원본 공개는 가장 빠름", "익명화는 시간이 듦", "감사 대기는 증거 삭제 위험을 키움"],
        finalChoices: [
          ["a", "참가자 식별자를 지운 구조 증거만 외부에 넘긴다", { legitimacy: 10, trust: 5, capital: -5, time: -7, humanCost: -6, fatigue: 7 }, { persistence: 2 }],
          ["b", "공개 전에 참가자 동의 절차부터 다시 돌린다", { trust: 11, legitimacy: 4, capital: -7, time: -5, fatigue: 8 }, { reframing: 3 }],
          ["c", "원본을 그대로 넘겨 삭제될 시간을 없앤다", { legitimacy: 21, trust: -4, humanCost: 6, time: 6, fatigue: -4 }, { risk: 2, inference: 1 }],
        ],
      },
      f_start_contain: {
        route: "f_route_contain",
        final: "f_final_contain",
        phase: "INSIDE ROUTE",
        title: "안에서 닫을 수 있는가",
        speaker: "한서윤",
        text: "내부 설명을 요구하자 한서윤은 실험의 일부가 실제로 판단 품질을 높였다고 말합니다. 질문은 악용을 막는 일이 아니라, 쓸 수 있는 도구를 누가 통제하는가입니다.",
        memo: ["일부 참가자는 실제로 더 나은 결정을 냄", "동의는 사후에 정리됨", "운영팀은 폐기보다 개혁을 원함"],
        triggers: ["order", "curiosity", "responsibility"],
        routeChoices: [
          ["f_route_contain_board", "참가자 대표가 통제하는 운영위를 만든다", { trust: 9, legitimacy: 7, capital: -7, time: -6, fatigue: 8 }, { reframing: 3 }],
          ["f_route_contain_lab", "트리거랩 내부 개혁안으로 봉합한다", { capital: 6, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["f_route_contain_pause", "도구를 잠시 멈추고 동의 절차를 다시 받는다", { legitimacy: 8, trust: 5, capital: -8, time: -8, fatigue: 7 }, { persistence: 2 }],
        ],
        finalTitle: "도구를 남길 조건",
        finalText: "트리거랩은 완전히 거짓도, 완전히 선의도 아니었습니다. 이제 도구를 남길 조건을 누가 정할지 선택해야 합니다.",
        finalMemo: ["폐기는 연구를 끝냄", "내부 개혁은 빠르지만 불신을 남김", "참가자 통제는 느리지만 권한을 돌려줌"],
        finalChoices: [
          ["a", "참가자 대표가 통제하는 운영위에 도구를 넘긴다", { legitimacy: 9, trust: 7, capital: -6, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
          ["b", "도구를 멈추고 동의 절차를 처음부터 다시 받는다", { trust: 12, legitimacy: 3, capital: -8, time: -7, fatigue: 8 }, { reframing: 3 }],
          ["c", "실험 구조와 사용 기록을 전부 공개 기록으로 넘긴다", { legitimacy: 19, trust: 6, humanCost: 4, time: -5, fatigue: 8 }, { risk: 1, inference: 1 }],
        ],
      },
    },
    system: {
      route: "f_route_system",
      final: "f_final_system",
      title: "마지막 선택지가 당신을 부른다",
      speaker: "에코",
      text: "준비된 결말 밖의 문장을 쓰자 화면에 다음 참가자의 선택지가 나타납니다. 그 선택지 중 하나는 방금 당신이 쓴 문장입니다.",
      memo: ["자유입력 문장이 다음 참가자 선택지로 변환됨", "삭제 전송과 공개 전송이 동시에 대기 중", "종료 권한은 아직 당신에게 있음"],
      routeChoices: [
        ["f_route_system_read", "내 문장이 어떤 선택지로 바뀌었는지 끝까지 읽는다", { legitimacy: 9, trust: 4, capital: -4, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["f_route_system_send", "확인하지 않고 전송 대기열을 그대로 둔다", { capital: 7, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ["f_route_system_warn", "다음 참가자에게 이 화면을 먼저 보여준다", { trust: 9, legitimacy: 6, capital: -5, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내 문장이 다음 선택지가 되지 못하게 막는다", { legitimacy: 8, trust: 4, capital: -5, time: -6, humanCost: -5, fatigue: 7 }, { persistence: 2 }],
      ["b", "내 문장을 남기되 바꿀 수 있는 빈칸을 붙인다", { trust: 9, legitimacy: 7, capital: -6, fatigue: 8 }, { reframing: 3 }],
      ["c", "다음 참가자에게 모든 원본을 넘기고 끝낸다", { legitimacy: 22, trust: 6, capital: 0, humanCost: 4, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
    ],
  },
};

/**
 * Every route final used to close on the same three lines, so four routes with
 * four different scenes still ended by asking one question. `finalChoices` on a
 * route replaces them with the dilemma that route actually walked into; the
 * case-level list stays as the hidden route's own close.
 */
function makeFinalChoices(plan, finalId, choices = plan.finalChoices) {
  return choices.map(([suffix, label, effect, cognition]) => ({
    id: `${finalId}_${suffix}`,
    label,
    effect,
    cognition,
    next: plan.result,
  }));
}

function registerDramaticRoutePlan(caseId, plan) {
  const order = nodeOrders[caseId];
  Object.entries(plan.choices).forEach(([choiceId, route]) => {
    nodes[route.route] = {
      phase: route.phase,
      title: route.title,
      speaker: route.speaker,
      text: route.text,
      memo: route.memo,
      triggers: route.triggers,
      choices: route.routeChoices.map(([id, label, effect, cognition]) => ({
        id,
        label,
        effect,
        cognition,
        next: route.final,
      })),
    };
    nodes[route.final] = {
      phase: "LAST CALL",
      title: route.finalTitle,
      speaker: route.speaker,
      text: route.finalText,
      memo: route.finalMemo,
      triggers: route.triggers,
      choices: makeFinalChoices(plan, route.final, route.finalChoices ?? plan.finalChoices),
    };
    nodes[plan.start].choices.forEach((choice) => {
      if (choice.id === choiceId) choice.next = route.route;
    });
    for (const node of [route.route, route.final]) {
      if (!order.includes(node)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, node);
    }
  });

  nodes[plan.system.route] = {
    phase: "HIDDEN ROUTE",
    title: plan.system.title,
    speaker: plan.system.speaker,
    text: plan.system.text,
    memo: plan.system.memo,
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    // The hidden route asked its final's three questions and then asked them
    // again one scene later. It gets its own opening moves instead.
    choices: (plan.system.routeChoices ?? plan.finalChoices).map(([suffix, label, effect, cognition]) => ({
      id: suffix.startsWith(plan.system.route) ? suffix : `${plan.system.route}_${suffix}`,
      label,
      effect,
      cognition,
      next: plan.system.final,
    })),
  };
  nodes[plan.system.final] = {
    phase: "LAST CALL",
    title: "준비된 결말 밖에서",
    speaker: plan.system.speaker,
    text: "준비된 선택지 밖의 문장은 사건의 규칙을 직접 건드립니다. 이제 플레이어의 문장이 다음 사람에게 어떻게 쓰일지 결정해야 합니다.",
    memo: ["자유입력은 새 질문으로 기록됨", "실험자는 그 문장을 다음 압박 조건으로 쓸 수 있음", "막지 않으면 같은 구조가 반복됨"],
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    choices: makeFinalChoices(plan, plan.system.final),
  };
  if (!order.includes(plan.system.route)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.route);
  if (!order.includes(plan.system.final)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.final);

  // Authored copy wins. These stay as the net under a choice that has not been
  // written yet, so a new route is playable the moment it is wired.
  [...Object.values(plan.choices).flatMap((route) => [route.route, route.final]), plan.system.route, plan.system.final].forEach((nodeId) => {
    nodes[nodeId].choices.forEach((choice) => {
      choiceVoiceLines[choice.id] ??= choice.label;
      echoReplies[choice.id] ??= `${nodes[nodeId].title}: 이 선택은 다음 질문의 기준을 바꿉니다.`;
    });
  });
}

CASE_PACKS.forEach((pack) => {
  dramaticRoutePlans[pack.id] = pack.routePlan;
});
Object.entries(dramaticRoutePlans).forEach(([caseId, plan]) => registerDramaticRoutePlan(caseId, plan));

/**
 * The route split gave every case a new question, but in cases 01, 03, 04, 05
 * and the finale it also cut the authored middle out of the main line: the
 * fixed choices ran start -> route -> route final -> aftermath in four scenes,
 * and everything between (the witness scenes, the reactions, the branch
 * detours) was reachable only through free input. CASE 02 was wired the other
 * way -- each route walks its own authored scenes and closes on its own final
 * -- so this puts the rest of the season on that same shape.
 *
 * `entry` is the authored scene the route now opens into, `tail` is the last
 * scene of that stretch, whose choices close on the route's own `final`. Every
 * route gets a stretch nobody else walks, so two routes never ask the same
 * middle questions.
 */
const routeBodyPlans = {
  // CASE 02 already walks its authored middle; only its old shared final, which
  // the three route finals replaced, is still sitting in the graph unreachable.
  case02: { retire: ["c2_final"] },
  case01: {
    routes: {
      c1_route_investigate: { entry: "accounting", tail: "c1_witness_reaction", final: "c1_final_investigate" },
      c1_route_layoff: { entry: "payday", tail: "c1_assembly_reaction", final: "c1_final_layoff" },
      c1_route_sale: { entry: "competitor", tail: "c1_bargain_reaction", final: "c1_final_sale" },
      c1_route_funding: { entry: "board", tail: "c1_verdict_reaction", final: "c1_final_funding" },
      c1_route_system: { entry: "c1_branch_people", tail: "c1_branch_people_follow", final: "c1_final_system" },
    },
    retire: ["final"],
  },
  case03: {
    routes: {
      c3_route_deep: { entry: "c3_split", tail: "c3_rival_reaction", final: "c3_final_right" },
      c3_route_fast: { entry: "c3_score", tail: "c3_signal_reaction", final: "c3_final_win" },
      c3_route_mirror: { entry: "c3_trap", tail: "c3_verdict_reaction", final: "c3_final_joint" },
      c3_route_system: { entry: "c3_branch_signal", tail: "c3_branch_signal_follow", final: "c3_final_system" },
    },
    retire: ["c3_final"],
  },
  case04: {
    routes: {
      c4_route_exception: { entry: "c4_offer", tail: "c4_audit_reaction", final: "c4_final_exception" },
      c4_route_audit: { entry: "c4_leak", tail: "c4_public_reaction", final: "c4_final_audit" },
      c4_route_rule: { entry: "c4_vote", tail: "c4_verdict_reaction", final: "c4_final_rule" },
      c4_route_system: { entry: "c4_branch_exception", tail: "c4_branch_exception_follow", final: "c4_final_system" },
    },
    retire: ["c4_final"],
  },
  case05: {
    routes: {
      c5_route_map: { entry: "c5_map", tail: "c5_pattern_reaction", final: "c5_final_map_route" },
      c5_route_blame: { entry: "c5_blame", tail: "c5_voice_reaction", final: "c5_final_blame_route" },
      c5_route_redesign: { entry: "c5_collapse", tail: "c5_verdict_reaction", final: "c5_final_redesign_route" },
      c5_route_system: { entry: "c5_branch_owner", tail: "c5_branch_owner_follow", final: "c5_final_system_route" },
    },
    retire: ["c5_final"],
  },
  final: {
    routes: {
      f_route_map: { entry: "f_archive", tail: "f_witness_reaction", final: "f_final_map" },
      f_route_expose: { entry: "f_confront", tail: "f_dilemma_reaction", final: "f_final_expose" },
      f_route_contain: { entry: "f_branch_witness", tail: "f_branch_witness_follow", final: "f_final_contain" },
    },
    // f_choice is where the season picks its 봉인/개혁/폭로 framing, so the last
    // case is the one place the route finals still converge: they hand the run
    // to that scene instead of jumping past it into the aftermath.
    rewire: { f_final_map: "f_choice", f_final_expose: "f_choice", f_final_contain: "f_choice", f_final_system: "f_choice" },
  },
};

function registerRouteBodies(caseId, plan) {
  Object.entries(plan.routes ?? {}).forEach(([routeId, body]) => {
    nodes[routeId].choices.forEach((choice) => { choice.next = body.entry; });
    nodes[body.tail].choices.forEach((choice) => { choice.next = body.final; });
  });
  Object.entries(plan.rewire ?? {}).forEach(([nodeId, next]) => {
    nodes[nodeId].choices.forEach((choice) => { choice.next = next; });
  });
  (plan.retire ?? []).forEach((nodeId) => {
    delete nodes[nodeId];
    const index = nodeOrders[caseId].indexOf(nodeId);
    if (index >= 0) nodeOrders[caseId].splice(index, 1);
  });
}

Object.entries(routeBodyPlans).forEach(([caseId, plan]) => registerRouteBodies(caseId, plan));

/**
 * Where the first successful free-text answer of a case lands. It lives next to
 * the route plans so the runtime and the graph check read one map instead of
 * two copies that can drift apart.
 */
export const freeTextRouteNodes = {
  case02: "c2_route_system",
  ...Object.fromEntries(Object.entries(dramaticRoutePlans).map(([caseId, plan]) => [caseId, plan.defaultFree])),
};

const evidenceTurnaroundPlans = {
  case01: {
    node: "c1_evidence_turn",
    result: "c1_aftershock",
    // The other cases offer the turnaround on the route node, two scenes in.
    // Case 01 cannot: a season hands out one clue per case, the first clue can
    // only land on the second decision, and no case 01 route reaches trust 55
    // by then -- so FIELD ACCESS was unreachable and the locked button was a
    // promise the first case could never keep. Offered on the route finals
    // instead, where trust reaches 67-82 and a clue has had time to arrive.
    sourceRoutes: ["c1_final_layoff", "c1_final_funding", "c1_final_sale", "c1_final_investigate", "c1_final_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 펼쳐, 이 안건들이 같은 표에서 나왔는지부터 확인한다.",
    entryEcho: "단서를 대면 세 해결책이 하나의 원인으로 묶입니다.",
    title: "첫 단서가 세 안건을 한 줄로 묶는다",
    speaker: "에코",
    text: "확보한 단서를 대조하자 감축, 자금, 매각이 서로 다른 해결책이 아니라 같은 누락 기준표의 결과라는 사실이 보입니다. 이제 무엇을 고를지가 아니라 기준표를 누가 다시 쓸지가 사건의 결론입니다.",
    memo: ["숨은 급여표와 누락 로그가 같은 작성자를 가리킴", "세 안건의 효과가 하나의 기준표에서 계산됨", "다음 사건의 증거 공개 범위를 지금 정할 수 있음"],
    triggers: ["curiosity", "system", "responsibility"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 3 },
    choices: [
      ["c1_evidence_turn_public", "기준표와 작성자를 함께 공개한다", { legitimacy: 10, trust: 4, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c1_evidence_turn_private", "작성자는 숨기고 기준표만 내부 수정한다", { capital: 6, trust: -4, legitimacy: -3, time: 4, humanCost: 3, fatigue: -3 }, { risk: 2 }],
      ["c1_evidence_turn_transfer", "다음 사건 담당자에게 원본 검증권을 넘긴다", { trust: 9, legitimacy: 6, capital: -5, fatigue: 6 }, { reframing: 2 }],
    ],
  },
  case02: {
    node: "c2_evidence_turn",
    result: "c2_aftershock",
    sourceRoutes: ["c2_route_report", "c2_route_person", "c2_route_origin", "c2_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "확보한 단서를 꺼내, 이 사건이 정말 한 사람의 일인지부터 되묻는다.",
    entryEcho: "단서를 대면 혐의의 주어가 사람에서 기록으로 옮겨 갑니다.",
    title: "보호된 증언이 기록을 뒤집는다",
    speaker: "이민서",
    text: "앞서 얻은 단서를 붙이자 유출 파일의 시간이 맞지 않습니다. 누가 말했는지보다 누가 말할 수 없게 만들었는지가 새 질문으로 떠오릅니다.",
    memo: ["증언 시간과 파일 생성 시간이 어긋남", "보호 조치가 오히려 증언자를 고립시킨 흔적", "다음 케이스의 점수판에 같은 시간 조작이 남아 있음"],
    triggers: ["protection", "injustice", "curiosity"],
    entryEffect: { trust: 4, legitimacy: 3, time: -3, fatigue: 3 },
    choices: [
      ["c2_evidence_turn_guard", "증언자의 열람권을 먼저 복구한다", { trust: 9, legitimacy: 5, capital: -6, time: -5, fatigue: 6 }, { reframing: 2 }],
      ["c2_evidence_turn_stamp", "시간 조작 증거를 외부 감사에 보낸다", { legitimacy: 10, trust: -2, capital: -7, time: -6, fatigue: 7 }, { inference: 2 }],
      ["c2_evidence_turn_delay", "증언을 늦추고 로그 복원부터 끝낸다", { time: -8, legitimacy: 7, trust: 3, fatigue: 6 }, { persistence: 2 }],
    ],
  },
  case03: {
    node: "c3_evidence_turn",
    result: "c3_aftershock",
    sourceRoutes: ["c3_route_fast", "c3_route_deep", "c3_route_mirror", "c3_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "확보한 단서를 꺼내, 이 점수판이 하나뿐인지부터 확인한다.",
    entryEcho: "단서를 대면 승부의 기준이 승부보다 먼저 문제가 됩니다.",
    title: "두 번째 점수판",
    speaker: "오진우",
    text: "단서를 대조하자 고객에게 보이는 점수판과 내부 심사용 점수판이 다르다는 사실이 드러납니다. 이제 승패보다 어느 점수판을 진짜 계약 기준으로 인정할지가 문제입니다.",
    memo: ["외부 점수판과 내부 점수판의 가중치가 다름", "오진우도 같은 불일치를 알고 있음", "빠른 승리는 숨은 점수판을 그대로 남길 수 있음"],
    triggers: ["competition", "injustice", "curiosity"],
    entryEffect: { legitimacy: 4, trust: 2, time: -4, fatigue: 3 },
    choices: [
      ["c3_evidence_turn_merge", "두 점수판을 합쳐 고객에게 다시 제출한다", { legitimacy: 9, trust: 6, capital: -7, time: -7, fatigue: 7 }, { reframing: 2, inference: 1 }],
      ["c3_evidence_turn_use", "내부 점수판의 허점을 이용해 계약을 딴다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c3_evidence_turn_refuse", "점수판 계약 자체를 거부한다", { trust: 8, legitimacy: 9, capital: -9, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case04: {
    node: "c4_evidence_turn",
    result: "c4_aftershock",
    sourceRoutes: ["c4_route_exception", "c4_route_rule", "c4_route_audit", "c4_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "확보한 단서를 꺼내, 이 예외가 정말 처음인지부터 확인한다.",
    entryEcho: "단서를 대면 예외는 판단이 아니라 반복으로 읽힙니다.",
    title: "예외 파일의 원래 수신자",
    speaker: "반재욱",
    text: "단서 조합은 예외 승인이 한 번의 선의가 아니라 미리 설계된 반복 절차였음을 보여줍니다. 질문은 허용 여부에서, 반복을 누가 승인했는지로 이동합니다.",
    memo: ["예외 파일 수신자가 여러 케이스에 반복 등장", "성과 지표가 예외 승인 뒤에 수정됨", "감사 권한 없이는 원본을 열 수 없음"],
    triggers: ["order", "responsibility", "system"],
    entryEffect: { legitimacy: 4, time: -3, fatigue: 3 },
    choices: [
      ["c4_evidence_turn_owner", "반복 승인자를 공개 기록에 남긴다", { legitimacy: 10, trust: 4, capital: -8, time: -6, fatigue: 7 }, { inference: 2 }],
      ["c4_evidence_turn_stop", "승인 절차를 멈추고 피해자 동의를 새 조건으로 넣는다", { trust: 9, legitimacy: 7, capital: -9, humanCost: -5, fatigue: 8 }, { reframing: 2 }],
      ["c4_evidence_turn_patch", "반복 절차는 숨기고 이번 예외만 봉합한다", { capital: 8, trust: -7, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
    ],
  },
  case05: {
    node: "c5_evidence_turn",
    result: "c5_aftershock",
    sourceRoutes: ["c5_route_blame", "c5_route_map", "c5_route_redesign", "c5_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "확보한 단서를 꺼내, 누가 지도에서 먼저 지워졌는지부터 확인한다.",
    entryEcho: "단서를 대면 실패의 피해자 목록이 먼저 바뀝니다.",
    title: "사라진 피해자의 우선순위",
    speaker: "한서윤",
    text: "지금까지의 단서가 겹치자 조용한 피해자가 매번 낮은 우선순위로 밀린 이유가 보입니다. 책임자를 찾는 질문은 피해자가 시스템에서 어떻게 사라졌는지로 바뀝니다.",
    memo: ["피해자 누락은 신고 빈도 가중치에서 시작됨", "복구가 빠를수록 원인 로그가 사라질 수 있음", "최종장 실험 데이터와 같은 규칙이 쓰임"],
    triggers: ["protection", "injustice", "system"],
    entryEffect: { trust: 4, legitimacy: 3, humanCost: -3, fatigue: 4 },
    choices: [
      ["c5_evidence_turn_weight", "조용한 피해자 가중치를 공개 규칙으로 올린다", { trust: 10, legitimacy: 8, capital: -9, humanCost: -9, fatigue: 8 }, { reframing: 3 }],
      ["c5_evidence_turn_archive", "복구 전에 원인 로그를 보존한다", { legitimacy: 9, trust: 3, capital: -6, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c5_evidence_turn_close", "피해 보상만 먼저 끝내고 규칙 공개를 미룬다", { trust: 6, capital: -6, legitimacy: -5, humanCost: -8, fatigue: 6 }, { risk: 2 }],
    ],
  },
  case06: {
    node: "c6_evidence_turn",
    result: "c6_aftershock",
    sourceRoutes: ["c6_desk", "c6_logs", "c6_panel", "c6_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 펼쳐, 그의 조건이 언제부터 바뀌었는지 날짜로 맞춰 본다.",
    entryEcho: "단서를 대면 그의 속도는 성격이 아니라 일정표가 됩니다.",
    title: "조건이 바뀐 날짜들",
    speaker: "에코",
    text: "단서를 맞추자 그의 결정 창이 줄어든 날짜가 전부 당신이 검증을 택한 다음 날이라는 사실이 드러납니다. 두 사람은 경쟁한 것이 아니라, 서로의 조건이 되어 있었습니다.",
    memo: ["축소 시점이 당신의 선택 다음 날과 일치", "같은 실험 번호가 두 프로필에 걸려 있음", "이 대조표는 위원회 자료로 제출할 수 있음"],
    triggers: ["system", "selfAwareness", "injustice"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      ["c6_evidence_turn_pair", "두 프로필의 대조표를 위원회에 낸다", { legitimacy: 11, trust: 5, capital: -8, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c6_evidence_turn_shield", "날짜만 남기고 내 쪽 기록은 가린다", { capital: 6, trust: -5, legitimacy: -4, time: 4, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c6_evidence_turn_hand", "대조표를 오진우에게 먼저 건넨다", { trust: 10, legitimacy: 6, capital: -6, humanCost: -5, fatigue: 6 }, { reframing: 2 }],
    ],
  },
  case07: {
    node: "c7_evidence_turn",
    result: "c7_aftershock",
    sourceRoutes: ["c7_ledger", "c7_counter", "c7_paper", "c7_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 발령서 작성일과 나란히 놓고, 순서가 맞는지 맞춰 본다.",
    entryEcho: "단서를 대면 이 발령은 결과가 아니라 예고편이 됩니다.",
    title: "작성일이 먼저였다",
    speaker: "반재욱",
    text: "단서를 맞추자 순서가 드러납니다. 발령서 작성일은 사건 06 개시보다 12일 앞서고, 그 12일 전에는 당신이 사건 05에서 예산 상한선의 출처를 물은 날이 있습니다. 조사가 시작돼서 발령이 난 것이 아니라, 질문이 시작돼서 발령이 준비된 것입니다.",
    memo: ["작성일 = 상한선 출처 질문 다음 날", "사건 06은 발령 사유가 아니라 발령 명분", "같은 순서가 앞선 17건에서도 반복됨"],
    triggers: ["injustice", "system", "selfAwareness"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      ["c7_evidence_turn_order", "질문한 날과 작성일을 나란히 붙여 제출한다", { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 } ],
      ["c7_evidence_turn_hold", "순서는 알아 두고 이번엔 쓰지 않는다", { capital: 7, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c7_evidence_turn_share", "앞선 17명에게 이 순서를 먼저 알린다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  case08: {
    node: "c8_evidence_turn",
    result: "c8_aftershock",
    sourceRoutes: ["c8_trail", "c8_gallery", "c8_bait", "c8_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 입금일 달력에 겹쳐, 돈이 움직인 날과 승인이 난 날을 맞춰 본다.",
    entryEcho: "단서를 대면 자문료는 수수료가 아니라 승인의 영수증이 됩니다.",
    title: "입금일과 승인일",
    speaker: "반재욱",
    text: "단서를 달력에 겹치자 규칙이 보입니다. 해온파트너스에 자문료가 들어온 열두 번의 날짜는 전부 KD은행이 노바웍스와 브릿지은행 쪽에 유리한 승인을 낸 다음 영업일입니다. 3년 전 2023-0412의 담보 순위(돈을 떼일 때 누가 먼저 돌려받느냐의 순서)가 브릿지은행으로 넘어간 날도 그중 하나입니다.",
    memo: ["입금 12회 = 승인 다음 영업일 12회", "2023-0412 담보 순위 변경일 포함", "우연으로 설명하기 어려운 일치"],
    triggers: ["injustice", "revenge", "system"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      ["c8_evidence_turn_calendar", "달력 한 장으로 만들어 수사 의뢰서 첫 장에 붙인다", { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c8_evidence_turn_hold", "달력은 쥐고 있다가 협상 자리에서 꺼낸다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c8_evidence_turn_share", "담보 순위에서 밀려난 채권자들에게 먼저 알린다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  case09: {
    node: "c9_evidence_turn",
    result: "c9_aftershock",
    sourceRoutes: ["c9_ledger", "c9_family", "c9_timing", "c9_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 두 계산서 사이에 끼워, 어느 숫자가 어느 승인에서 왔는지 맞춰 본다.",
    entryEcho: "단서를 대면 청산의 계산서는 중립적인 숫자가 아니라 누군가 사 둔 결론이 됩니다.",
    title: "청산 회수율의 출처",
    speaker: "오진우",
    text: "단서를 맞추자 브릿지은행이 내민 청산 회수율(빌려준 돈을 돌려받는 비율) 78%의 출처가 드러납니다. 담보 가치를 매긴 감정평가법인(부동산·설비 값을 매기는 회사)은 해온파트너스와 같은 세무 대리인(세금 신고를 대신해 주는 사무소)을 씁니다. 청산이 유리하다는 숫자 자체가, 흔적표의 같은 손에서 나왔습니다.",
    memo: ["회수율 78%를 산정한 감정평가법인 = 해온과 같은 세무 대리인", "다시 평가하면 청산 회수율 64%로 하락 추정", "회생안이 청산보다 유리해질 수 있음"],
    triggers: ["injustice", "system", "responsibility"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      ["c9_evidence_turn_reappraise", "담보 재평가를 요구해 회수율 숫자를 다시 쓴다", { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c9_evidence_turn_hold", "출처는 알아 두고 결의장에서만 꺼낸다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c9_evidence_turn_share", "권도현에게 먼저 보여 주고 그의 이름으로 문제를 제기하게 한다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  case10: {
    node: "c10_evidence_turn",
    result: "c10_aftershock",
    sourceRoutes: ["c10_locker", "c10_claim", "c10_relay", "c10_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 인사 기록 옆에 놓고, 병가 사유란이 언제부터 같은 문구였는지 맞춰 본다.",
    entryEcho: "단서를 대면 '개인 사정'은 각자의 선택이 아니라 누군가 정해 둔 서식의 기본값이 됩니다.",
    title: "사유란의 기본값",
    speaker: "반재욱",
    text: "단서를 맞추자 인사 서식의 개정 이력이 열립니다. 4년 전, 병가 신청서의 사유란에서 '업무상'이라는 보기가 삭제되고 '개인 사정'이 기본값으로 바뀌었습니다. 개정안을 작성한 부서는 기업금융전략팀입니다. 열아홉 명이 같은 문구를 쓴 건 열아홉 번의 선택이 아니라, 선택지가 하나뿐이었기 때문입니다.",
    memo: ["4년 전 병가 서식 개정 -- '업무상' 보기 삭제", "개정 부서: KD은행 기업금융전략팀", "개정 이후 업무상 질병 인정 건수 0건"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 },
    choices: [
      ["c10_evidence_turn_restore", "삭제된 '업무상' 보기를 서식에 되돌리라고 요구한다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c10_evidence_turn_hold", "개정 이력은 알아 두고 심의장에서만 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c10_evidence_turn_share", "열아홉 명 전원에게 이 개정 이력을 먼저 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  case11: {
    node: "c11_evidence_turn",
    result: "c11_aftershock",
    sourceRoutes: ["c11_script", "c11_rehearsal", "c11_sign", "c11_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 3년 전 승인 시스템 기록 옆에 놓고, 반대 의견서의 상태가 언제 바뀌었는지 맞춰 본다.",
    entryEcho: "단서를 대면 반려한 손과 지운 손이 같은 손이 아니었다는 게 드러납니다.",
    title: "다섯 시간 열두 분",
    speaker: "반재욱",
    text: "단서를 맞추자 3년 전 승인 시스템의 변경 기록이 열립니다. 한서윤의 반려 서명은 오후 6시 2분. 그런데 반대 의견서가 '보관'에서 '폐기'로 바뀐 건 밤 11시 14분이고, 바꾼 계정은 당시 기업금융전략팀장 윤상혁입니다. 반려한 사람과 지운 사람은 다른 사람이었습니다. 반재욱이 수첩에 두 시각을 나란히 적습니다. '다섯 시간 열두 분. 그 사이에 누가 무엇을 결심했는지가 이 사건입니다.'",
    memo: ["반려 서명 18:02 -- 한서윤", "폐기 처리 23:14 -- 윤상혁 계정", "폐기 사유란: 공란"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 },
    choices: [
      ["c11_evidence_turn_submit", "두 시각을 나란히 적은 기록을 의원실과 언론에 동시에 넘긴다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c11_evidence_turn_hold", "기록은 쥐고 있다가 참고인석에서 직접 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c11_evidence_turn_share", "한서윤에게 먼저 보여 주고 그가 어떻게 할지 고르게 한다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  final: {
    node: "f_evidence_turn",
    // Same reason the last case's route finals stop at f_choice: the clue
    // turnaround must not skip the scene that names the ending.
    result: "f_choice",
    sourceRoutes: ["f_route_map", "f_route_expose", "f_route_contain", "f_route_system"],
    requiredAuthority: "OVERSIGHT",
    entryVoice: "확보한 단서를 꺼내, 이 선택지들이 어디서 왔는지부터 확인한다.",
    entryEcho: "단서를 대면 마지막 질문을 누가 냈는지가 드러납니다.",
    title: "모든 단서가 플레이어의 문장을 가리킨다",
    speaker: "에코",
    text: "감독 권한으로 원본을 열자 사건의 공통점이 사람이 아니라 질문 문장이라는 사실이 드러납니다. 최종 선택은 데이터를 공개할지가 아니라, 당신의 판단 양식을 다음 참가자에게 물려줄지입니다.",
    memo: ["모든 케이스의 숨은 단서가 선택 문장과 연결됨", "다음 참가자의 첫 선택지 일부가 이미 생성됨", "종료 권한은 공개와 폐기 중 하나만 완전하게 보장함"],
    triggers: ["selfAwareness", "choice", "system"],
    entryEffect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
    choices: [
      ["f_evidence_turn_burn", "내 선택 문장까지 포함해 실험 원본을 폐기한다", { legitimacy: 11, trust: 5, capital: -8, time: -8, humanCost: -4, fatigue: 9 }, { persistence: 2 }],
      ["f_evidence_turn_seed", "내 문장을 경고문으로 남기고 다음 참가자에게 넘긴다", { trust: 10, legitimacy: 7, capital: -6, humanCost: 3, fatigue: 8 }, { reframing: 3 }],
      ["f_evidence_turn_publish", "모든 원본과 선택 복제 규칙을 공개한다", { legitimacy: 13, trust: -4, capital: -7, humanCost: 5, time: -4, fatigue: 7 }, { risk: 1, inference: 2 }],
    ],
  },
};

function registerEvidenceTurnaround(caseId, plan) {
  const order = nodeOrders[caseId];
  nodes[plan.node] = {
    phase: "EVIDENCE TURN",
    title: plan.title,
    speaker: plan.speaker,
    text: plan.text,
    memo: plan.memo,
    triggers: plan.triggers,
    choices: plan.choices.map(([id, label, effect, cognition]) => ({
      id,
      label,
      effect,
      cognition,
      next: plan.result,
    })),
  };
  plan.sourceRoutes.forEach((routeId) => {
    if (!nodes[routeId]?.choices || nodes[routeId].choices.some((choice) => choice.id === `${routeId}_evidence_turn`)) return;
    nodes[routeId].choices.push({
      id: `${routeId}_evidence_turn`,
      label: "확보한 단서를 대조해 이 질문의 전제를 뒤집는다",
      effect: plan.entryEffect,
      cognition: { inference: 2, reframing: 1 },
      next: plan.node,
      requiredAuthority: plan.requiredAuthority,
    });
  });
  const resultIndex = order.indexOf(plan.result);
  const insertIndex = resultIndex >= 0 ? resultIndex : order.length;
  if (!order.includes(plan.node)) order.splice(insertIndex, 0, plan.node);
  nodes[plan.node].choices.forEach((choice) => {
    choiceVoiceLines[choice.id] ??= choice.label;
    echoReplies[choice.id] ??= `${plan.title}: 단서가 선택지의 전제를 바꿉니다.`;
  });
  // Every route offers the turnaround under one label, but what the clue
  // overturns differs per case, so the copy is written per case, not per route.
  plan.sourceRoutes.forEach((routeId) => {
    const choiceId = `${routeId}_evidence_turn`;
    choiceVoiceLines[choiceId] = plan.entryVoice;
    echoReplies[choiceId] = plan.entryEcho;
  });
}

CASE_PACKS.forEach((pack) => {
  evidenceTurnaroundPlans[pack.id] = pack.evidencePlan;
});
Object.entries(evidenceTurnaroundPlans).forEach(([caseId, plan]) => registerEvidenceTurnaround(caseId, plan));

const continuityMemoryChoicePlans = {
  case02: {
    routeNext: "c2_route_person",
    systemNext: "c2_route_system",
    evidenceNext: "c2_evidence_turn",
    routeLabel: "직전 사건의 남은 약속을 이민서에게 먼저 확인한다",
    systemLabel: "직전 자유응답 문장이 유출 파일에 복제됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 유출 파일의 전제를 뒤집는다",
  },
  case03: {
    routeNext: "c3_route_mirror",
    systemNext: "c3_route_system",
    evidenceNext: "c3_evidence_turn",
    routeLabel: "직전 사건의 보호 결정을 경쟁자의 계약서에 대조한다",
    systemLabel: "직전 자유응답 문장이 점수판에 반영됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 두 번째 점수판을 연다",
  },
  case04: {
    routeNext: "c4_route_audit",
    systemNext: "c4_route_system",
    evidenceNext: "c4_evidence_turn",
    routeLabel: "직전 사건의 점수 기준을 예외 승인표에 대조한다",
    systemLabel: "직전 자유응답 문장이 예외 사유로 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 예외 파일의 원래 수신자를 연다",
  },
  case05: {
    routeNext: "c5_route_map",
    systemNext: "c5_route_system",
    evidenceNext: "c5_evidence_turn",
    routeLabel: "직전 사건의 예외 조건을 실패 지도에 겹쳐 본다",
    systemLabel: "직전 자유응답 문장이 복구 우선순위에 들어갔는지 본다",
    evidenceLabel: "직전 단서를 붙여 사라진 피해자 기준을 연다",
  },
  case06: {
    routeNext: "c6_branch_roof",
    systemNext: "c6_route_system",
    evidenceNext: "c6_evidence_turn",
    routeLabel: "직전 사건에서 세운 책임 기준을 옆자리 사람에게도 적용해 본다",
    systemLabel: "직전 자유응답 문장이 그의 조건표에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 그의 조건이 바뀐 날짜를 연다",
  },
  case07: {
    routeNext: "c7_branch_quota",
    systemNext: "c7_route_system",
    evidenceNext: "c7_evidence_turn",
    routeLabel: "직전 사건에서 옆자리에 세운 기준을 내 발령에도 대 본다",
    systemLabel: "직전 자유응답 문장이 내 인사 기록에도 붙었는지 본다",
    evidenceLabel: "직전 단서를 붙여 발령서 작성일의 순서를 연다",
  },
  case08: {
    routeNext: "c8_branch_ledger",
    systemNext: "c8_route_system",
    evidenceNext: "c8_evidence_turn",
    routeLabel: "직전 사건에서 이름을 올린 방식대로 흔적표에도 이름을 단다",
    systemLabel: "직전 자유응답 문장이 법인 등기 서류에도 남았는지 본다",
    evidenceLabel: "직전 단서를 붙여 입금일과 승인일을 맞춘다",
  },
  case09: {
    routeNext: "c9_branch_father",
    systemNext: "c9_route_system",
    evidenceNext: "c9_evidence_turn",
    routeLabel: "직전 사건의 흔적표를 권도현의 계산서 옆에 나란히 놓는다",
    systemLabel: "직전 자유응답 문장이 채권단 자료에도 들어갔는지 본다",
    evidenceLabel: "직전 단서를 붙여 청산 회수율의 출처를 연다",
  },
  case10: {
    routeNext: "c10_branch_home",
    systemNext: "c10_route_system",
    evidenceNext: "c10_evidence_turn",
    routeLabel: "직전 사건의 계산서 양식을 이번 분담표에 그대로 대 본다",
    systemLabel: "직전 자유응답 문장이 인사 기록에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 병가 사유란의 개정 이력을 연다",
  },
  case11: {
    routeNext: "c11_branch_newsroom",
    systemNext: "c11_route_system",
    evidenceNext: "c11_evidence_turn",
    routeLabel: "직전 사건의 분담표를 출석 준비 역할표로 그대로 쓴다",
    systemLabel: "직전 자유응답 문장이 그룹 입장문에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 반대 의견서의 폐기 기록을 연다",
  },
  final: {
    routeNext: "f_route_map",
    systemNext: "f_route_system",
    evidenceNext: "f_evidence_turn",
    routeLabel: "직전 사건의 실패 지도를 내 플레이 로그에 겹쳐 본다",
    systemLabel: "직전 자유응답 문장이 다음 참가자의 선택지가 됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 모든 선택 문장의 원본을 연다",
  },
};

CASE_PACKS.forEach((pack) => {
  continuityMemoryChoicePlans[pack.id] = pack.memoryPlan;
});

/**
 * Reads the previous case's recorded route memory, not the run log: a case
 * start clears the log, so the log-based version of this could never find
 * anything and the choice never once appeared in a played season.
 */
export function getContinuityMemoryChoice({ caseId = "case01", nodeId = "", caseResults = {} } = {}) {
  const plan = continuityMemoryChoicePlans[caseId];
  if (!plan) return null;
  const openingNodes = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
  if (!openingNodes.has(nodeId)) return null;
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const memory = previousCaseId ? caseResults?.[previousCaseId]?.routeMemory : null;
  if (!memory) return null;
  if (memory.evidenceTurn) {
    return {
      id: `${caseId}_memory_evidence`,
      label: plan.evidenceLabel,
      effect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
      cognition: { inference: 2, reframing: 1 },
      next: plan.evidenceNext,
      // No authority check here. This choice only exists because the previous
      // case's turnaround was actually walked, and that is the credential --
      // asking for FIELD ACCESS on top of it locked the case 02 opening behind
      // two clues the player could not yet hold.
      continuityMemory: true,
    };
  }
  if (memory.systemRoute) {
    return {
      id: `${caseId}_memory_system`,
      label: plan.systemLabel,
      effect: { legitimacy: 5, trust: 2, time: -4, fatigue: 4 },
      cognition: { reframing: 2 },
      next: plan.systemNext,
      continuityMemory: true,
    };
  }
  if (!memory.routeSplit) return null;
  return {
    id: `${caseId}_memory_route`,
    label: plan.routeLabel,
    effect: { trust: 5, legitimacy: 4, time: -3, fatigue: 4 },
    cognition: { persistence: 1, inference: 1 },
    next: plan.routeNext,
    continuityMemory: true,
  };
}

export const caseOpeningRoutes = {
  case02: {
    c1_after_people: "c2_start_people",
    c1_after_numbers: "c2_start_records",
    c1_after_silence: "c2_start_silence",
  },
  case03: {
    c2_after_audit: "c3_start_audit",
    c2_after_person: "c3_start_person",
    c2_after_public: "c3_start_public",
  },
  case04: {
    c3_after_share: "c4_start_joint",
    c3_after_proof: "c4_start_proof",
    c3_after_win: "c4_start_win",
  },
  case05: {
    c4_after_rule: "c5_start_rule",
    c4_after_service: "c5_start_service",
    c4_after_stop: "c5_start_stop",
  },
  case06: {
    c5_after_owner: "c6_start_owner",
    c5_after_system: "c6_start_system",
    c5_after_name: "c6_start_name",
  },
  case07: {
    c6_after_stand: "c7_start_stand",
    c6_after_open: "c7_start_open",
    c6_after_name: "c7_start_name",
  },
  case08: {
    c7_after_stand: "c8_start_stand",
    c7_after_open: "c8_start_open",
    c7_after_alone: "c8_start_alone",
  },
  case09: {
    c8_after_law: "c9_start_law",
    c8_after_friend: "c9_start_friend",
    c8_after_blade: "c9_start_blade",
  },
  case10: {
    c9_after_stay: "c10_start_stay",
    c9_after_court: "c10_start_court",
    c9_after_return: "c10_start_return",
  },
  case11: {
    c10_after_rest: "c11_start_rest",
    c10_after_record: "c11_start_record",
    c10_after_keep: "c11_start_keep",
  },
  // Keyed on the aftermath of the case the finale follows. It has moved every
  // time a case was inserted in front of it: c5_after_*, c6_after_*, c7_after_*,
  // c9_after_*, c10_after_*, c11_after_*, c12_after_*, and now c24_after_*. A case pack keys its own
  // openings on the case before it (`openingRoutes`), merged below.
  final: {
    c24_after_warm: "f_start_owner",
    c24_after_record: "f_start_system",
    c24_after_rush: "f_start_name",
  },
};

CASE_PACKS.forEach((pack) => {
  caseOpeningRoutes[pack.id] = pack.openingRoutes;
});

const branchOpeningCopy = {
  c2_start_people: ["보호받은 사람의 다음 사건", "도윤하", "이민서가 유출자로 지목됐습니다. 하지만 당신은 지난 사건에서 사람의 목소리를 먼저 남겼습니다. 이번에는 그 목소리가 기록보다 먼저 당신을 찾아옵니다.", ["익명 증언 요청이 이미 들어옴", "이민서는 당신에게 직접 연락함", "보안팀은 보호 조치를 문제 삼음"]],
  c2_start_records: ["공개된 숫자의 다음 사건", "반재욱", "지난 사건에서 현금 흐름을 공개한 뒤, 누군가가 그 공개 자료를 이용해 내부 기록을 조작했습니다. 이번에는 숫자를 믿는 방식 자체가 시험됩니다.", ["공개 자료의 복사본이 세 개 존재", "유출 파일에 공개 수치가 포함됨", "기록 관리자는 책임을 부인함"]],
  c2_start_silence: ["침묵의 청구서", "한서윤", "지난 사건에서 공개를 늦춘 대가는 조용히 쌓였습니다. 이번 사건의 유출 파일에는 당신이 말하지 않았던 조건까지 담겨 있습니다.", ["유출 파일에 비공개 회의 문장 포함", "이민서가 가장 먼저 의심받음", "외부 기업은 이미 다음 행동을 준비함"]],
  c3_start_audit: ["복원된 기록의 경쟁", "반재욱", "기록을 복원한 당신에게 이번에는 더 빠른 결론이 요구됩니다. 오진우는 원본보다 먼저 읽기 쉬운 답을 만들어 놓았습니다.", ["감사 기록은 완전하지 않음", "입찰 마감까지 4시간", "고객은 근거보다 확신을 원함"]],
  c3_start_person: ["사람을 믿은 뒤의 경쟁", "도윤하", "이민서를 보호한 결정은 다음 사건의 비용이 됐습니다. 오진우는 그 선택을 약점이라고 부르며 더 빠른 해답을 제시합니다.", ["고객은 속도 보상을 약속함", "이민서의 증언이 일부 공개됨", "경쟁안은 보호 비용을 삭제함"]],
  c3_start_public: ["경보가 된 경쟁", "에코", "유출 가능성을 외부에 알린 뒤 모든 시선이 당신에게 모였습니다. 이번 입찰은 해결안이 아니라 경보를 누가 통제하는지에 대한 싸움입니다.", ["고객은 공개 해명을 요구함", "오진우는 침묵을 전략으로 삼음", "보안 결함 제보가 추가됨"]],
  c4_start_joint: ["공동안의 대가", "오진우", "경쟁을 공동 작업으로 바꾼 당신에게 새로운 유혹이 왔습니다. 좋은 결과를 위해 규칙을 함께 넓히자는 제안입니다.", ["공동안의 책임 주체가 흐림", "심사 기준까지 3% 부족", "파트너들은 예외를 원함"]],
  c4_start_proof: ["증거 뒤에 남은 사람들", "반재욱", "보안 결함을 공개한 뒤 당신은 정직한 사람으로 불렸습니다. 그러나 그 정직함 때문에 서비스를 잃을 사람들이 생겼습니다.", ["서비스 이용자 4,200명 영향", "지원금 기준까지 3% 부족", "공개 자료가 심사대에 올라감"]],
  c4_start_win: ["승리의 계산법", "한서윤", "경쟁에서 이긴 기록은 다음 사건의 기준이 됐습니다. 이제는 결과가 좋다면 작은 규칙 위반을 허용할 수 있는지 묻습니다.", ["심사관이 성공 사례를 요구함", "산식의 빈틈이 발견됨", "누군가는 같은 성공을 재현하려 함"]],
  c5_start_rule: ["새 기준의 실패", "도윤하", "예외를 공개 조건으로 묶은 뒤, 모두가 그 기준을 지키려 했습니다. 그런데 시스템 전체가 동시에 멈추기 시작했습니다.", ["새 기준이 현장에 너무 느림", "피해 보고가 늦게 들어옴", "책임자는 규칙을 탓함"]],
  c5_start_service: ["지켜낸 서비스의 그림자", "반재욱", "서비스를 지킨 예외가 반복되면서 누구도 같은 기준을 믿지 못하게 됐습니다. 실패는 규칙보다 먼저 사람에게 도착했습니다.", ["예외를 요구하는 기관이 늘어남", "감사 요청서가 도착함", "현장 직원이 내부 기록을 보관함"]],
  c5_start_stop: ["멈춘 뒤의 공백", "에코", "서비스를 멈추고 감사를 택한 결정은 기준을 지켰습니다. 하지만 멈춘 시간 동안 조용한 피해자가 생겼습니다.", ["피해 복구 비용이 증가함", "감사 자료는 완전하지 않음", "누군가는 중단을 승인한 사람을 찾음"]],
  c6_start_owner: ["내 책임부터 적은 뒤", "도윤하", "지난 사건에서 당신은 자기 결정부터 공개했습니다. 그 문장을 읽은 사람 중 하나가 옆자리에서 사흘째 나오지 않고 있습니다.", ["당신의 책임 문장이 사내에 회람됨", "오진우는 그 회람 직후 결근함", "위원회는 그 회람을 근거로 쓸 수 있음"]],
  c6_start_system: ["고친 구조가 부른 사람", "에코", "지난 사건에서 당신은 구조를 고쳤습니다. 새 기준은 승인자를 더 또렷하게 남겼고, 그 기록이 지금 한 사람을 정확히 가리킵니다.", ["새 승인 기록이 책임자를 특정함", "구조 개편은 실제로 작동 중", "정확한 기록이 가장 빠른 표적이 됨"]],
  c6_start_name: ["두 번째 이름", "반재욱", "지난 사건에서 당신은 책임자 한 사람을 세웠습니다. 조직은 그 방식이 효율적이라고 배웠고, 이번에는 그 방식을 옆자리에 적용하려 합니다.", ["지난 사건의 처리 방식이 선례가 됨", "같은 절차가 이미 준비돼 있음", "이번 대상은 당신이 아는 사람"]],
  c7_start_stand: ["자리를 남긴 사람의 발령", "도윤하", "당신은 오진우가 돌아올 자리를 치우지 않았습니다. 그 다음 주, 치워진 것은 당신의 자리입니다. 발령서는 그가 결근한 날 이미 작성돼 있었습니다.", ["오진우의 자리는 아직 그대로", "당신의 발령서 작성일이 더 빠름", "같은 층에서 두 자리가 동시에 비게 됨"]],
  c7_start_open: ["조건을 연 사람의 발령", "에코", "두 사람의 설정값을 같은 날 공개한 뒤, 실험은 멈추지 않고 담당자만 바뀌었습니다. 공개는 기록에 남았고, 공개한 사람은 240km 밖으로 갑니다.", ["설정값 공개 기록은 유효", "실험 자체는 중단되지 않음", "후임 분석관 배치가 이미 완료됨"]],
  c7_start_name: ["이름으로 닫은 사람의 발령", "반재욱", "당신은 한 사람의 이름으로 사건을 닫았습니다. 조직은 그 방식이 효율적이라고 배웠고, 이번에는 같은 방식으로 당신을 닫습니다. 다만 이번에는 이름조차 필요 없습니다. 자리만 옮기면 됩니다.", ["지난 종결 방식이 선례로 인용됨", "이번 처리에는 사유 고지가 없음", "같은 절차가 이미 준비돼 있었음"]],
  c8_start_stand: ["사람을 먼저 찾은 사람의 지점", "도윤하", "당신은 떠나기 전 이름을 올린 사람들을 한 명씩 만났습니다. 그중 셋이 영동지점으로 안부 문자를 보냅니다. 그리고 부임 9일째, 휴면 계좌(오래 거래가 끊긴 계좌) 목록에서 이상한 법인 하나가 눈에 걸립니다.", ["이름을 올린 사람들과 연락이 이어짐", "해온파트너스 계좌에서 이상 흐름 발견", "법인 청산 등기까지 72시간"]],
  c8_start_open: ["기차를 타지 않은 사람의 첫 출근", "나준혁", "당신은 06시 40분 기차에 없었고, 이틀 늦게 버스로 내려왔습니다. 지점장은 지각을 묻지 않고 자리를 내줍니다. 외부 감사인(회사 장부를 바깥에서 검사하는 회계사)에게 넘긴 원본은 아직 답이 없고, 대신 이 지점의 휴면 계좌(오래 거래가 끊긴 계좌) 하나가 답을 합니다.", ["지각 부임 기록이 인사 파일에 남음", "외부 감사인 회신 대기 중", "해온파트너스 계좌에서 이상 흐름 발견"]],
  c8_start_alone: ["조용히 내려온 사람의 창구", "에코", "당신은 아무에게도 알리지 않고 내려왔습니다. 아무도 연락하지 않았고, 그래서 아무도 당신이 무엇을 보는지 모릅니다. 이번에는 그 조용함이 무기가 됩니다. 휴면 계좌(오래 거래가 끊긴 계좌) 목록의 한 줄이 그 무기를 쓸 곳을 가리킵니다.", ["아무도 당신의 조회를 예상하지 않음", "해온파트너스 계좌에서 이상 흐름 발견", "혼자 쥔 자료는 증거 보관 기록이 없음"]],
  c9_start_law: ["흔적을 기록으로 만든 사람의 72시간", "반재욱", "당신은 흔적표에 지점장 도장까지 받아 공식 기록으로 만들었습니다. 수사는 느리게 시작됐고, 그 사이 플로우온 채권단(돈을 빌려준 금융회사들의 협의체)은 빠르게 청산 쪽으로 기울었습니다. 기록은 남았지만, 기록이 사람을 먼저 구하지는 않습니다.", ["수사 의뢰서 접수 완료, 착수 시점 미정", "채권단 결의 안건: 청산", "권도현이 기록 사본 열람을 요청함"]],
  c9_start_friend: ["친구를 찾으러 간 사람의 72시간", "오진우", "당신은 연락이 끊긴 오진우를 찾아 서울로 올라왔습니다. 그는 고시원 방 벽에 흔적표를 붙여 놓고 있었습니다. 둘이 국밥을 먹은 다음 날, 플로우온 청산(회사를 정리해 없애는 절차) 안건이 채권단(돈을 빌려준 금융회사들의 협의체)에 올라옵니다. '이번엔 같이 가죠. 복수 말고, 다른 거 하러.'", ["오진우가 추적 자료를 공동 보관으로 넘김", "채권단 결의 안건: 청산", "오진우와 권도현은 대학 동기"]],
  c9_start_blade: ["칼을 혼자 쥔 사람의 72시간", "에코", "당신은 흔적표를 혼자 쥐고 기다렸고, 쓸 때가 왔습니다. 플로우온 청산(회사를 정리해 없애는 절차) 안건이 채권단(돈을 빌려준 금융회사들의 협의체)에 올라왔고, 청산을 밀어붙이는 은행이 흔적표의 한 줄에 있습니다. 혼자 쥔 칼은 빠르지만, 누구도 그 칼이 공정했는지 증언해 주지 않습니다.", ["흔적표 원본은 당신 혼자 보관", "채권단 결의 안건: 청산", "칼의 쓰임새를 아는 사람이 없음"]],
  c10_start_stay: ["현장에 남은 사람의 열흘", "한서윤", "고용 승계(직원을 해고 없이 그대로 넘겨받기) 합의가 끝날 때까지 당신은 풀필먼트센터(물류 창고)에 남았습니다. 1,140명은 일터를 지켰고, 그 열흘 동안 서울에서는 아무도 도윤하의 근무 기록을 보지 않았습니다. 이긴 쪽의 명단은 정리되었고, 이긴 사람 한 명의 상태는 아무 서류에도 올라가지 않았습니다.", ["고용 승계 합의 완료, 1,140명 유지", "같은 기간 도윤하의 초과근무 무기록", "사물함 파일 자동 폐기까지 96시간"]],
  c10_start_court: ["증언대에 섰던 사람의 열흘", "반재욱", "법정과 검사반에서 열흘을 보냈습니다. 진술은 정확했고 절차는 깨끗했습니다. 돌아와 보니 같은 열흘 동안 한 사람이 쓰러졌고, 그 사람의 기록은 증거로 제출된 적이 없습니다. 증언할 수 있는 피해와 증언할 서식이 없는 피해가 나란히 있습니다.", ["증인신문 3회, 진술 조서 확보", "도윤하 건은 업무 외 개인 사정으로 분류", "사물함 파일 자동 폐기까지 96시간"]],
  c10_start_return: ["조용히 돌아간 사람의 열흘", "에코", "당신은 컵라면을 다 먹고 영동지점으로 돌아갔습니다. 결의 결과는 뉴스로 들었고, 열흘째 되는 날 아침에 전화가 옵니다. 240km 밖에서 받은 소식은 늘 한 박자 늦습니다. 이번에 늦은 한 박자는 응급실까지의 거리였습니다.", ["영동지점 복귀 9일차", "도윤하 응급 이송 소식은 하루 뒤 전달됨", "사물함 파일 자동 폐기까지 96시간"]],
  c11_start_rest: ["불을 끈 사람의 기사", "한서윤", "여섯 명을 정시에 퇴근시킨 그 주말 이후 3주, 분담표는 느리지만 멈추지 않고 돌았습니다. 그리고 월요일 새벽 여섯 시, 리드라인에 기사가 올라옵니다. 쉬어 본 사람들은 이번 주를 버틸 힘이 있습니다. 문제는 그 힘을 누구 이름으로 쓰느냐입니다.", ["분담표 3주 처리 102건", "리드라인 기사: 익명의 반대 의견 작성자 A씨", "출석까지 5일"]],
  c11_start_record: ["제도를 남긴 사람의 기사", "에코", "분담표가 그룹 제도안으로 접수된 지 3주 뒤, 그룹 홍보실이 그 제도안을 '선제적 피해 구제 모범 사례'로 보도자료에 넣었습니다. 같은 날 새벽 리드라인 기사가 올라왔습니다. 당신이 만든 제도가 이제 그룹이 당신을 반박하는 근거가 됐습니다.", ["그룹 보도자료: 분담표를 모범 사례로 인용", "리드라인 기사: 익명의 반대 의견 작성자 A씨", "출석까지 5일"]],
  c11_start_keep: ["서랍을 닫지 않은 사람의 기사", "반재욱", "212명의 명단은 아직 당신 서랍에 있습니다. 리드라인 기사가 올라온 날, 그룹 법무팀은 '비공식 명단을 보관한 직원'을 조사하겠다고 공지합니다. 서랍 속 명단이 이제 당신을 겨누는 증거가 될 수 있습니다.", ["법무팀 공지: 비공식 명단 보유 직원 조사", "212명 명단 개인 보관 중", "출석까지 5일"]],
  f_start_owner: ["끝까지 남은 사람의 마지막 밤", "도윤하", "불 꺼진 4층에서 당신은 마지막 밤을 동료들과 끝까지 보냈습니다. 컵라면이 식고, 상자가 하나씩 계단을 내려가고, 도윤하가 '내일 창구에서 봐요' 하고 마지막으로 나간 뒤 당신은 남은 상자 하나를 B2 기록 보관소에 내려놓으러 갑니다. 거기 케이스데스크 화면이 혼자 켜져 있습니다. 폴더 이름은 '인사평가_보조지표', 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)라는 말을 옥상에서 들은 지 이틀 만입니다. 맨 위 파일에 오늘 밤이 벌써 적혀 있습니다. '해체 당일까지 이탈 없음. 동료 결속 유지 능력 상.' 사람을 끝까지 떠나지 않는 힘은, 누구에게 가장 쓸모 있습니까.", ["마지막 밤의 동행 기록이 '결속 유지 능력'으로 분류됨", "같은 항목이 동료 여섯 명에게도 매겨짐", "실험 설계자는 당신의 공감 능력을 칭찬함"]],
  f_start_system: ["봉인을 풀어 달라고 쓴 사람의 마지막 밤", "에코", "당신은 트리거랩 전 기록의 봉인 해제 요청서를 문서로 남겼습니다. 열람 제한(정해진 사람 말고는 아무도 볼 수 없게 막아 둔 것)을 모두 풀어 참가자 본인에게 기록을 돌려 달라는 요청입니다. 요청은 40분 만에 승인됩니다. 너무 빠릅니다. B2 케이스데스크에 '인사평가_보조지표' 폴더가 열립니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)의 맨 앞 파일이 바로 당신의 요청서입니다. 분류 항목은 '제도 신뢰형 반응: 절차를 주면 절차 안에서 멈춤'. 당신이 고친 절차가, 이번에는 당신을 재는 자가 됐습니다.", ["봉인 해제 요청서 40분 만에 승인", "요청서가 관찰 자료 1번으로 등록됨", "참가자 동의 절차의 빈틈은 그대로 남음"]],
  f_start_name: ["33층으로 곧장 간 사람의 마지막 밤", "반재욱", "불이 꺼지자마자 당신은 휴대폰을 쥔 채 곧장 33층으로 올라갔습니다. 엘리베이터에서 내리자 비서가 '상무님이 한 시간 뒤에 보자십니다'라고 합니다. 기다리는 대신 B2로 내려오자 반재욱이 케이스데스크 앞에 서 있습니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더가 열렸고, 오늘 저녁 기록이 벌써 올라가 있습니다. '압박 시 즉시 상향 대응. 통제 범위 확대 권고.' 당신의 빠른 걸음이 더 큰 통제의 근거가 됐습니다. 그리고 그 파일 맨 아래에, 실험의 종료 권한이 당신 이름으로 넘어와 있습니다.", ["33층 면담 한 시간 연기", "즉각 대응 기록이 통제 확대의 근거로 인용됨", "실험의 종료 권한이 당신에게 옴"]],
};

/**
 * The one move each opening allows that the other two do not.
 *
 * The three openings used to be the base scene's choices with a different
 * paragraph on top -- same ids, same labels, same effects -- so the branch the
 * previous case earned changed the framing and nothing else. Each now carries a
 * fourth option that only exists because of what the last case ended on.
 */
const openingSignatureChoices = {
  c2_start_people: {
    label: "지난 사건에서 보호한 사람에게 먼저 연락한다",
    effect: { trust: 8, humanCost: -4, legitimacy: -2, time: -5, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c2_route_person",
    voice: "절차보다 먼저, 지난 사건에서 이름을 지켜준 사람에게 전화를 건다.",
    echo: "지난 보호가 이번 사건의 통로가 됩니다. 그 통로를 쓰는 순간 보호는 거래처럼 보이기도 합니다.",
  },
  c2_start_records: {
    label: "공개했던 수치를 기준선으로 삼아 조작 지점을 역추적한다",
    effect: { legitimacy: 7, capital: -3, time: -7, fatigue: 5 },
    cognition: { inference: 2 },
    next: "c2_route_origin",
    voice: "내가 공개한 숫자가 어디서 어긋났는지부터 거꾸로 짚는다.",
    echo: "공개한 숫자는 이제 비교 기준이 됩니다. 그 기준이 틀렸다면 이번 조사도 함께 무너집니다.",
  },
  c2_start_silence: {
    label: "말하지 않았던 조건을 내가 먼저 공개한다",
    effect: { legitimacy: 8, trust: 6, capital: -6, humanCost: -3, fatigue: 6 },
    cognition: { persistence: 2 },
    next: "c2_route_report",
    voice: "유출된 문서가 말하기 전에, 지난번 삼킨 조건을 내 입으로 꺼낸다.",
    echo: "미뤄둔 말을 스스로 꺼내면 주도권이 돌아옵니다. 왜 그때는 말하지 않았는지도 함께 묻게 됩니다.",
  },
  c3_start_audit: {
    label: "복원한 기록을 입찰 근거로 공개한다",
    effect: { legitimacy: 8, trust: 4, capital: -4, time: -6 },
    cognition: { inference: 2 },
    next: "c3_route_deep",
    voice: "복원해 둔 원본을 그대로 입찰 자료에 붙인다.",
    echo: "복원된 기록은 반박하기 어렵습니다. 동시에 경쟁사에게도 당신의 근거를 통째로 보여줍니다.",
  },
  c3_start_person: {
    label: "이민서에게 이번 검증을 맡긴다",
    effect: { trust: 8, humanCost: -3, capital: -5, time: -4, fatigue: 3 },
    cognition: { reframing: 2 },
    next: "c3_route_mirror",
    voice: "의심받았던 사람에게 이번 검증의 이름을 준다.",
    echo: "지목당했던 사람이 검증자가 되면 조직의 기준이 바뀝니다. 실패하면 두 번째 지목이 됩니다.",
  },
  c3_start_public: {
    label: "경보를 낸 사람으로서 공개 검증단을 요구한다",
    effect: { legitimacy: 9, capital: -5, time: -7, fatigue: 4 },
    cognition: { persistence: 2 },
    next: "c3_route_system",
    voice: "내가 먼저 알렸으니 검증도 공개로 하자고 요구한다.",
    echo: "공개 검증은 의심을 끝냅니다. 끝나기 전까지 입찰은 멈추고 그 비용은 당신이 냅니다.",
  },
  c4_start_joint: {
    label: "공동안 파트너에게 예외 요구를 함께 거절하자고 제안한다",
    effect: { legitimacy: 7, trust: 6, capital: -7, time: -4, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c4_route_audit",
    voice: "혼자 거절하면 밀린다며, 같이 만든 쪽에 함께 서자고 말한다.",
    echo: "둘이 거절하면 기준은 버팁니다. 파트너가 물러서면 남는 것은 당신의 이름뿐입니다.",
  },
  c4_start_proof: {
    label: "정직함의 대가를 숫자로 만들어 심사에 제출한다",
    effect: { legitimacy: 8, humanCost: -4, capital: -6, time: -5, fatigue: 5 },
    cognition: { inference: 2 },
    next: "c4_route_rule",
    voice: "결함을 공개해서 잃은 것을 그대로 계산해 심사표에 붙인다.",
    echo: "정직의 비용을 수치로 만들면 다음 사람도 그 값을 압니다. 이번 심사에서는 약점으로 읽힐 수 있습니다.",
  },
  c4_start_win: {
    label: "승리 사례를 근거로 기준 자체의 재심사를 요구한다",
    effect: { legitimacy: 6, capital: 6, trust: -3, humanCost: 3, time: -4 },
    cognition: { risk: 2 },
    next: "c4_route_exception",
    voice: "이겼던 방식이 규칙보다 낫다며, 규칙을 다시 보자고 밀어붙인다.",
    echo: "성공 사례는 설득력이 큽니다. 성공을 근거로 기준을 바꾸면 다음 성공도 같은 방식으로 요구됩니다.",
  },
  c5_start_rule: {
    label: "내가 만든 기준이 현장을 늦췄는지 먼저 확인한다",
    effect: { legitimacy: 7, humanCost: -5, capital: -3, time: -7, fatigue: 5 },
    cognition: { persistence: 2 },
    next: "c5_route_map",
    voice: "남을 조사하기 전에, 내가 세운 기준부터 시험대에 올린다.",
    echo: "자기 기준을 먼저 의심하면 조사는 정직해집니다. 그 사이 다른 원인은 계속 작동합니다.",
  },
  c5_start_service: {
    label: "유지된 서비스가 누구를 빼놓았는지 명단을 연다",
    effect: { humanCost: -6, trust: 7, capital: -6, time: -5, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c5_route_redesign",
    voice: "지켜냈다는 서비스에서 빠진 이름부터 세어 본다.",
    echo: "지킨 것과 빠뜨린 것을 같은 표에 놓으면 성과의 크기가 달라집니다. 그 표는 되돌릴 수 없습니다.",
  },
  c5_start_stop: {
    label: "중단 기간의 조용한 피해자부터 보상 대상에 올린다",
    effect: { humanCost: -7, trust: 6, legitimacy: 6, capital: -8, fatigue: 4 },
    cognition: { persistence: 2 },
    next: "c5_route_system",
    voice: "멈춘 동안 아무 말도 못 한 쪽을 보상 명단의 첫 줄에 적는다.",
    echo: "말하지 않은 피해를 먼저 세면 기준이 생깁니다. 예산은 말한 사람들 몫에서 먼저 깎입니다.",
  },
  f_start_owner: {
    label: "마지막 밤의 내 기록부터 동료들에게 먼저 공개한다",
    effect: { legitimacy: 8, trust: 7, time: -6, fatigue: 5 },
    cognition: { persistence: 2 },
    next: "f_route_map",
    voice: "마지막 밤의 내 기록부터, 동료들에게 먼저 공개한다.",
    echo: "공개하면 여섯 사람이 자기 칸의 '결속 유지 능력 상'을 봅니다. 그 칸은 다음 실험의 교재로도 쓰입니다.",
  },
  f_start_system: {
    label: "내 요청서에 쓴 규칙을 이 폴더 자신에게 적용하라고 요구한다",
    effect: { legitimacy: 9, trust: 5, capital: -4, time: -7, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_contain",
    voice: "내 요청서에 쓴 규칙을, 이 폴더 자신에게도 적용하라고 요구한다.",
    echo: "같은 규칙을 설계자에게 들이대면 실험의 전제가 드러납니다. 40분 만에 나던 승인이 이번에는 오지 않으면, 그 침묵이 증거가 됩니다.",
  },
  c7_start_stand: {
    label: "오진우에게 먼저 내 발령서를 보여준다",
    effect: { trust: 11, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
    cognition: { reframing: 2 },
    voice: "돌아올 자리를 지켜 준 사람에게, 이번엔 내 쪽 서류를 먼저 펼친다.",
    echo: "그에게 보여주면 두 발령서는 같은 손글씨를 공유합니다. 그가 그 사실을 감당할지는 별개입니다.",
  },
  c7_start_open: {
    label: "공개했던 감사 경로로 발령서를 그대로 올린다",
    effect: { legitimacy: 12, trust: 4, capital: -7, time: -4, fatigue: 5 },
    cognition: { inference: 2 },
    voice: "한 번 열어 둔 경로가 있으니, 이번 서류도 같은 문으로 올린다.",
    echo: "열어 둔 문은 두 번째부터 빨라집니다. 그 문을 아는 사람도 두 번째부터 빨라집니다.",
  },
  c7_start_name: {
    label: "지난번 이름을 올렸던 절차를 이번엔 내 이름으로 연다",
    effect: { trust: 9, legitimacy: 6, humanCost: -5, capital: -4, fatigue: 5 },
    cognition: { persistence: 2 },
    voice: "남의 이름으로 열었던 절차를, 이번엔 내 이름을 넣어 다시 연다.",
    echo: "같은 절차에 자기 이름을 넣으면 그 절차가 무엇이었는지 처음으로 정확히 보입니다.",
  },
  c8_start_stand: {
    label: "안부 문자를 보낸 세 사람에게 계좌 추적을 도와 달라고 한다",
    effect: { trust: 11, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
    cognition: { reframing: 2 },
    voice: "도와준 사람에게 또 부탁하는 게 염치없다는 걸 알면서, 세 사람에게 답장을 쓴다.",
    echo: "두 번째 부탁은 첫 번째보다 무겁습니다. 받아 주는 사람은 이번에는 당신이 무엇을 쫓는지 압니다.",
  },
  c8_start_open: {
    label: "외부 감사인에게 넘긴 원본에 이 계좌를 추가 자료로 붙인다",
    effect: { legitimacy: 12, trust: 4, capital: -7, time: -4, fatigue: 5 },
    cognition: { inference: 2 },
    voice: "이미 열어 둔 감사 경로에, 계좌 내역을 추가 자료로 이어 붙인다.",
    echo: "같은 경로로 두 번째 자료가 가면 감사인은 우연을 의심하지 않습니다. 보내는 사람의 이름도 두 번 기록됩니다.",
  },
  c8_start_alone: {
    label: "아무에게도 말하지 않고 청산 전 마지막 입출금을 지켜본다",
    effect: { capital: 9, legitimacy: 4, trust: -6, humanCost: 3, time: -3, fatigue: 4 },
    cognition: { risk: 2 },
    voice: "아무도 모르게, 청산 전에 마지막으로 돈이 움직이는 순간을 기다린다.",
    echo: "지켜보는 사람이 없다고 믿는 돈은 가장 솔직하게 움직입니다. 그 순간을 본 사람도 당신 하나뿐입니다.",
  },
  c9_start_law: {
    label: "접수된 수사 의뢰서를 채권단 참고 자료로 정식 제출한다",
    effect: { legitimacy: 11, trust: 3, capital: -6, time: -5, fatigue: 5 },
    cognition: { inference: 2 },
    voice: "공식 기록으로 만든 흔적표를, 채권단 테이블에도 같은 문으로 올린다.",
    echo: "수사 의뢰서가 채권단 자료에 붙으면 청산을 서두르는 쪽이 설명해야 합니다. 설명하는 동안 60시간은 줄어듭니다.",
  },
  c9_start_friend: {
    label: "오진우에게 권도현을 먼저 만나 달라고 부탁한다",
    effect: { trust: 12, legitimacy: -6, humanCost: -4, time: -7, fatigue: 6 },
    cognition: { reframing: 2 },
    voice: "대학 동기라는 말에 기대어, 오진우에게 권도현을 먼저 만나 달라고 한다.",
    echo: "복수를 내려놓은 사람이 처음 맡은 일이 친구를 설득하는 일입니다. 실패하면 둘 다 조금 더 외로워집니다.",
  },
  c9_start_blade: {
    label: "흔적표 한 줄을 권도현에게만 보여 주고 반응을 본다",
    effect: { capital: 9, legitimacy: 3, trust: -5, humanCost: 3, time: -3, fatigue: 4 },
    cognition: { risk: 2 },
    voice: "칼끝만 조금 보이듯, 흔적표의 한 줄을 권도현 앞에 놓는다.",
    echo: "한 줄만 보여 주면 상대는 나머지를 계산합니다. 권도현은 계산이 빠른 사람입니다.",
  },
  c10_start_stay: {
    label: "현장에서 쓰던 인수인계 서식을 그대로 명단에 적용한다",
    effect: { legitimacy: 10, trust: 5, capital: -5, time: -6, fatigue: 4 },
    cognition: { inference: 2 },
    voice: "현장에서 쓰던 인수인계 서식을, 그대로 명단에도 적용하자고 한다.",
    echo: "이미 쓰던 서식이라 오늘 바로 돌아갑니다. 공장에서 쓰던 양식이 사람 명단에 맞는지는 아무도 검토하지 않았습니다.",
  },
  c10_start_court: {
    label: "증인신문에서 쓴 진술 방식으로 도윤하의 기록을 정리한다",
    effect: { legitimacy: 12, trust: -4, humanCost: 4, time: -5, fatigue: 5 },
    cognition: { persistence: 2 },
    voice: "증인신문에서 쓰던 진술 방식으로, 도윤하의 기록을 한 줄씩 정리한다.",
    echo: "법정 서식은 빈틈이 없습니다. 그 서식은 사람을 증인으로 만들고, 증인은 보호받는 대신 검증받습니다.",
  },
  c10_start_return: {
    label: "영동지점 숙직실에서 하듯 먼저 사람부터 찾아간다",
    effect: { trust: 14, humanCost: -6, legitimacy: -5, time: -6, fatigue: 4 },
    cognition: { reframing: 2 },
    voice: "지점에서 하던 대로, 서류보다 사람을 먼저 찾아가겠다고 한다.",
    echo: "먼저 찾아가면 그는 혼자가 아니게 됩니다. 폐기 시계는 그 방문 시간만큼 그대로 흘러갑니다.",
  },
  c11_start_rest: {
    label: "분담표 여섯 명에게 출석 준비도 칸을 나눠 맡긴다",
    effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
    cognition: { reframing: 2 },
    voice: "분담표처럼, 출석 준비도 여섯 명이 칸을 나눠 맡자고 한다.",
    echo: "나눠 맡으면 닷새가 버틸 만해집니다. 준비한 답이 여섯 사람의 문장이 되면, 누구의 말인지 흐려질 수도 있습니다.",
  },
  c11_start_record: {
    label: "보도자료가 잘라 쓴 제도안 원문을 기자에게 먼저 보낸다",
    effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
    cognition: { inference: 2 },
    voice: "보도자료가 잘라 쓴 제도안의 원문을, 기자에게 먼저 보낸다.",
    echo: "원문이 나가면 모범 사례라는 말은 힘을 잃습니다. 그룹은 그 제도안을 만든 사람이 누구인지 다시 확인합니다.",
  },
  c11_start_keep: {
    label: "조사 전에 서랍의 212명 명단을 도윤하에게 돌려준다",
    effect: { trust: 13, humanCost: -5, legitimacy: -5, time: -5, fatigue: 4 },
    cognition: { persistence: 2 },
    voice: "조사가 시작되기 전에, 서랍의 212명 명단을 도윤하에게 돌려준다.",
    echo: "돌려주면 당신 서랍은 비고, 조사는 빈 서랍을 봅니다. 그 명단의 무게는 다시 한 사람에게 갑니다.",
  },
  f_start_name: {
    label: "봉투를 건넨 백아린의 이름부터 이 기록에서 찾아 먼저 알린다",
    effect: { trust: 9, humanCost: -6, legitimacy: -3, capital: -5, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_expose",
    voice: "봉투를 건넨 백아린의 이름부터, 이 기록에서 찾아 먼저 알린다.",
    echo: "먼저 알리면 백아린은 한 시간을 법니다. 그 시간에 버틸지 떠날지는 그가 정합니다. 절차상으로는 유출입니다.",
  },
};

for (const pack of CASE_PACKS) {
  Object.assign(branchOpeningCopy, pack.openingCopy);
  Object.assign(openingSignatureChoices, pack.openingSignatures);
}

Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  const baseNodeId = CASE_START_NODES[caseId];
  Object.values(routes).forEach((nodeId) => {
    const [title, speaker, text, memo] = branchOpeningCopy[nodeId];
    // The cloned choices are the same decisions, so they keep the base scene's
    // lines -- but under their own ids, so the log can say which opening it was.
    const clonedChoices = nodes[baseNodeId].choices.map((choice) => {
      const openingChoiceId = choice.id.startsWith(baseNodeId)
        ? `${nodeId}${choice.id.slice(baseNodeId.length)}`
        : `${nodeId}_${choice.id}`;
      // Fall back to the base scene's line only where the opening has not been
      // written its own: the three branches reach the same decision from
      // different places, and most of them now say so.
      if (!choiceVoiceLines[openingChoiceId] && choiceVoiceLines[choice.id]) {
        choiceVoiceLines[openingChoiceId] = choiceVoiceLines[choice.id];
      }
      if (!echoReplies[openingChoiceId] && echoReplies[choice.id]) {
        echoReplies[openingChoiceId] = echoReplies[choice.id];
      }
      return { ...choice, id: openingChoiceId };
    });
    const signature = openingSignatureChoices[nodeId];
    if (signature) {
      const signatureId = `${nodeId}_signature`;
      choiceVoiceLines[signatureId] = signature.voice;
      echoReplies[signatureId] = signature.echo;
      const routed = clonedChoices.find((choice) => choice.type !== "free") ?? clonedChoices[0];
      // Before the free-input option, which stays last on every scene.
      clonedChoices.splice(clonedChoices.length - 1, 0, {
        id: signatureId,
        label: signature.label,
        effect: signature.effect,
        cognition: signature.cognition,
        next: signature.next ?? routed.next,
      });
    }
    nodes[nodeId] = {
      ...nodes[baseNodeId],
      phase: "BRANCH BRIEFING",
      title,
      speaker,
      text,
      memo,
      choices: clonedChoices,
    };
  });
  nodeOrders[caseId].unshift(...Object.values(routes));
});

/**
 * The play screen badges a choice that changes the question -- memory, evidence
 * turn, authority, adaptive, branch detour -- but the main split had no mark on
 * it. The four buttons on a case briefing send the player down four different
 * routes with four different endings, and they looked like ordinary choices.
 * Tagged from the graph, after every route is wired, so it cannot fall out of
 * step with where the choices actually go.
 */
Object.values(nodes).forEach((node) => {
  node.choices.forEach((choice) => {
    if (nodes[choice.next]?.phase?.endsWith(" ROUTE")) choice.routeSplit = true;
  });
});

// Last, so a generated scene is grounded like an authored one. See sceneContext.js.
applySceneContext(nodes, nodeOrders);

function getPlayableRoute(caseId) {
  const route = new Map();
  const queue = [
    CASE_START_NODES[caseId],
    ...Object.values(caseOpeningRoutes[caseId] ?? {}),
  ].filter(Boolean).map((nodeId) => ({ nodeId, depth: 0 }));
  const seen = new Set();
  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift();
    if (!nodeId || seen.has(nodeId) || RESULT_NODE_IDS.has(nodeId)) continue;
    seen.add(nodeId);
    route.set(nodeId, depth);
    for (const choice of nodes[nodeId]?.choices ?? []) {
      if (choice.next && !seen.has(choice.next) && !RESULT_NODE_IDS.has(choice.next)) {
        queue.push({ nodeId: choice.next, depth: depth + 1 });
      }
    }
  }
  return route;
}

/**
 * The one authored mid-case fork per case, with the scenes each side leads to.
 * Derived from the graph so adding a branch needs no second list.
 */
export function getCaseBranchNodes() {
  return CASE_SEQUENCE.map((caseId) => {
    const nodeId = [...new Set(nodeOrders[caseId])].find((id) => {
      const scene = nodes[id];
      if (!scene) return false;
      return scene.choices.some((choice) => choice.branchId);
    });
    if (!nodeId) return null;
    return {
      caseId,
      nodeId,
      nextIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.next))],
      // Named separately from nextIds: the detour is no longer always the first
      // route out of the fork, because it is no longer always on the first column.
      detourIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.branchId).filter(Boolean))],
    };
  }).filter(Boolean);
}

/**
 * Where a gated detour choice actually goes on this run. Returns the bypass
 * route when the condition does not hold, and null when the choice routes
 * normally, so callers can write `detour ?? choice.next`.
 */
export function getBranchDetourBypass(choice = {}, context = {}) {
  const condition = branchConditions[choice.branchCondition];
  if (!condition || !choice.branchBypass) return null;
  return condition.test(context) ? null : choice.branchBypass;
}

export function getCaseRouteLength(caseId) {
  const route = getPlayableRoute(caseId);
  return Math.max(1, ...route.values()) + 1;
}

export function getNodeRouteIndex(caseId, nodeId) {
  const branchStartIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
  if (branchStartIds.has(nodeId)) return 0;
  return getPlayableRoute(caseId).get(nodeId) ?? -1;
}
