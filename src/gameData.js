export { cognitionLabels, costWhenRising, initialResources, triggerLabels } from "./gameConstants.js";
export { boardChangePrompts, characterProfiles, choiceSubtexts, choiceVoiceLines } from "./gameDialogue.js";
export { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, caseObjectives, nodeOrders, RESULT_NODE_IDS, seasonCasesBase } from "./gameCases.js";
import { case01Nodes } from "./nodes/case01.js";
import { case02Nodes } from "./nodes/case02.js";
import { case03Nodes } from "./nodes/case03.js";
import { case04Nodes } from "./nodes/case04.js";
import { case05Nodes } from "./nodes/case05.js";
import { finalCaseNodes } from "./nodes/finalCase.js";
import { authoredEchoReplies, choiceVoiceLines } from "./gameDialogue.js";
import { CASE_SEQUENCE, CASE_START_NODES, nodeOrders, RESULT_NODE_IDS } from "./gameCases.js";

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
  ...finalCaseNodes,
};

const aftermathNodes = {
  c1_aftershock: {
    phase: "AFTERMATH",
    title: "다음 날의 급여명세서",
    speaker: "도윤하",
    text: "결정 다음 날, 숫자보다 먼저 사람들의 반응이 도착했습니다. 직원들은 누가 보호받았는지 묻고, 협력사 대표는 당신이 남긴 약속을 다시 읽습니다.",
    memo: ["직원 공지에 서로 다른 해석이 퍼짐", "협력사 대표가 조건 재협상을 요청함", "투자자는 당신의 다음 기준을 확인하려 함"],
    triggers: ["protection", "responsibility", "trust"],
    choices: [
      { id: "c1_after_people", label: "직원과 협력사 앞에서 먼저 약속을 설명한다", effect: { trust: 8, legitimacy: 4, fatigue: 5 }, next: "result", cognition: { persistence: 1 } },
      { id: "c1_after_numbers", label: "현금 흐름표를 공개하고 감당할 손실을 정한다", effect: { capital: -6, legitimacy: 8, fatigue: 4 }, next: "result", cognition: { inference: 1, risk: 1 } },
      { id: "c1_after_silence", label: "다음 자금이 들어올 때까지 공개를 늦춘다", effect: { capital: 8, trust: -10, legitimacy: -6, fatigue: 2 }, next: "result", cognition: { risk: 2 } },
    ],
  },
  c2_aftershock: {
    phase: "AFTERMATH",
    title: "누가 기록을 고쳤는가",
    speaker: "에코",
    text: "보고서가 올라간 뒤 원본 로그 한 줄이 사라졌습니다. 이민서를 지목한 기록과 당신이 선택한 보고 방식이 같은 손에서 만들어졌을 가능성이 생겼습니다.",
    memo: ["원본 로그와 복사본의 시각이 다름", "이민서 계정은 이미 잠김", "삭제 권한은 세 사람에게만 있었음"],
    triggers: ["trust", "curiosity", "injustice"],
    choices: [
      { id: "c2_after_audit", label: "원본 보관자부터 조사해 기록의 흐름을 복원한다", effect: { time: -7, legitimacy: 8, fatigue: 6 }, next: "case02_result", cognition: { inference: 2 } },
      { id: "c2_after_person", label: "이민서에게 직접 사라진 기록을 묻는다", effect: { trust: 8, legitimacy: -2, fatigue: 5 }, next: "case02_result", cognition: { persistence: 1, reframing: 1 } },
      { id: "c2_after_public", label: "기록 조작 가능성을 즉시 외부에 알린다", effect: { trust: -4, legitimacy: 14, capital: -8, fatigue: 8 }, next: "case02_result", cognition: { risk: 2 } },
    ],
  },
  c3_aftershock: {
    phase: "AFTERMATH",
    title: "승자의 빈 화면",
    speaker: "오진우",
    text: "발표가 끝났지만 점수는 공개되지 않았습니다. 오진우는 당신에게 묻습니다. 이번 승리가 고객을 위한 것이었는지, 누군가가 만든 경주에서 이긴 것인지.",
    memo: ["고객사는 두 안 모두 보류함", "오진우의 원본 제출 시간이 조작됐을 가능성", "보안 결함을 숨긴 쪽이 높은 점수를 받음"],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      { id: "c3_after_share", label: "두 안의 장점을 합쳐 고객에게 다시 제안한다", effect: { trust: 8, legitimacy: 5, humanCost: -3, fatigue: 7 }, next: "case03_result", cognition: { reframing: 2 } },
      { id: "c3_after_proof", label: "점수보다 보안 결함의 증거를 먼저 공개한다", effect: { capital: -8, legitimacy: 14, fatigue: 6 }, next: "case03_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c3_after_win", label: "승리를 확정하고 경쟁자의 허점을 이용한다", effect: { capital: 12, trust: -10, legitimacy: -8, humanCost: 5, fatigue: 3 }, next: "case03_result", cognition: { risk: 2 } },
    ],
  },
  c4_aftershock: {
    phase: "AFTERMATH",
    title: "예외의 청구서",
    speaker: "반재욱",
    text: "보조금 심사 결과보다 먼저 감사 요청서가 도착했습니다. 작은 예외를 허용한 순간, 같은 예외를 기다리던 다른 기관들이 줄을 섰습니다.",
    memo: ["비슷한 사정을 가진 기관 11곳이 연락함", "심사관은 해석 기준의 공개를 요구함", "현장 서비스는 당장 멈추지 않았음"],
    triggers: ["order", "responsibility", "reward"],
    choices: [
      { id: "c4_after_rule", label: "예외 조건을 모두 공개하고 새 기준을 만든다", effect: { legitimacy: 12, trust: 6, fatigue: 8 }, next: "case04_result", cognition: { reframing: 2, persistence: 1 } },
      { id: "c4_after_service", label: "서비스를 지키기 위해 같은 예외를 한 번 더 허용한다", effect: { capital: 10, legitimacy: -12, humanCost: -4, fatigue: 5 }, next: "case04_result", cognition: { risk: 2 } },
      { id: "c4_after_stop", label: "감사를 위해 예외 적용을 즉시 중단한다", effect: { capital: -12, legitimacy: 10, humanCost: 10, fatigue: 4 }, next: "case04_result", cognition: { inference: 1 } },
    ],
  },
  c5_aftershock: {
    phase: "AFTERMATH",
    title: "아무도 서명하지 않은 실패",
    speaker: "도윤하",
    text: "실패 원인을 찾는 회의가 열렸지만 누구도 단독 책임을 지지 않았습니다. 회의실 밖에는 조용히 떠난 사람의 자리가 하나 남아 있습니다.",
    memo: ["각 팀의 결정은 당시 기준으로 합리적이었음", "피해를 먼저 알린 기록은 삭제됨", "책임을 나누면 개선 속도가 느려질 수 있음"],
    triggers: ["responsibility", "protection", "curiosity"],
    choices: [
      { id: "c5_after_owner", label: "내 결정부터 책임지고 개선 작업을 맡는다", effect: { trust: 10, legitimacy: 8, fatigue: 9 }, next: "case05_result", cognition: { persistence: 2 } },
      { id: "c5_after_system", label: "개인 탓 대신 반복을 막는 구조를 다시 설계한다", effect: { legitimacy: 10, trust: 6, capital: -5, fatigue: 8 }, next: "case05_result", cognition: { reframing: 3 } },
      { id: "c5_after_name", label: "가장 큰 실수를 한 사람을 공식 책임자로 세운다", effect: { trust: -12, legitimacy: 4, humanCost: 8, fatigue: 3 }, next: "case05_result", cognition: { risk: 2 } },
    ],
  },
  f_aftershock: {
    phase: "LAST EVIDENCE",
    title: "당신의 선택이 사용되는 밤",
    speaker: "에코",
    text: "마지막 폴더가 열리자, 트리거랩이 당신의 선택을 다음 참가자에게 보여주고 있었다는 사실이 드러납니다. 이제 결말은 실험을 끝내는 방식에 달렸습니다.",
    memo: ["당신의 선택 문장이 다음 테스트의 선택지로 복제됨", "단서가 많을수록 실험 설계자 이름에 가까워짐", "외부 공개와 내부 개혁 모두 누군가의 피해를 요구함"],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      { id: "f_after_witness", label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다", effect: { legitimacy: 12, trust: 4, humanCost: -3, fatigue: 8 }, next: "final_result", cognition: { inference: 2, persistence: 1 } },
      { id: "f_after_control", label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다", effect: { trust: 10, legitimacy: 8, fatigue: 10 }, next: "final_result", cognition: { reframing: 3 } },
      { id: "f_after_burn", label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다", effect: { legitimacy: 6, trust: -6, humanCost: 4, fatigue: 5 }, next: "final_result", cognition: { risk: 2 } },
    ],
  },
};

Object.assign(nodes, aftermathNodes);

const aftermathRoutes = {
  final: "c1_aftershock",
  c2_final: "c2_aftershock",
  c3_final: "c3_aftershock",
  c4_final: "c4_aftershock",
  c5_final: "c5_aftershock",
  f_choice: "f_aftershock",
};

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
nodeOrders.final.push("f_aftershock");

const connectiveScenes = [
  ["c1_witness", "accounting", "payday", "누가 숫자를 만들었나", "반재욱", "회계팀의 막내가 회의실 문 앞에서 멈춰 섰습니다. 그는 장부가 틀렸다고 말하지 않았습니다. 대신 숫자가 만들어진 순간, 모두가 무엇을 알고 있었는지 묻습니다.", ["원본 파일은 세 번 저장됨", "막내 직원은 회의 초대를 받지 못함", "CFO의 지시는 구두로만 남음"], ["직원을 보호하며 증언할 자리를 만든다", "원본 파일을 먼저 잠가 증거를 보존한다", "말이 퍼지기 전에 CFO와 비공개로 합의한다"]],
  ["c1_assembly", "payday", "competitor", "급여일 전의 약속", "도윤하", "급여일 아침을 버티려면 돈만 필요한 것이 아닙니다. 직원들은 회사가 무엇을 숨기고 있는지보다, 내일도 자신이 이곳에 있을지 알고 싶어 합니다.", ["야간조 대표가 공동 공지를 요구함", "협력사 세 곳이 같은 지급 기준을 요구함", "임원진은 개인 보수를 먼저 공개하길 꺼림"], ["직원 대표와 함께 공개 약속을 만든다", "지급 순서를 숫자로 고정한다", "임원진만 아는 임시 합의를 만든다", "임원 보수를 먼저 깎아 지급 재원을 만든다"]],
  ["c1_bargain", "competitor", "board", "팔리지 않은 자리", "오진우", "북선로지스의 협상안에는 빈칸이 하나 있습니다. 인수하지 않을 사업부, 남겨질 직원, 협력사 중 누가 그 빈칸을 채울지 아무도 쓰지 않았습니다.", ["인수 조건에 책임 주체가 없음", "협력사는 매각보다 지급 보장을 원함", "오진우는 승률을 높이는 문장만 골라냄"], ["빈칸을 채운 뒤에만 협상한다", "가장 약한 쪽의 조건부터 반영한다", "빈칸을 남겨 빠르게 사인한다"]],
  ["c1_verdict", "board", "final", "판결이 아닌 선택", "에코", "모든 자료가 테이블 위에 올라왔지만 결론은 더 멀어졌습니다. 이제 당신의 선택은 회사를 설명하는 문장이 아니라, 누가 내일의 비용을 들 것인지 정하는 문장입니다.", ["직원·협력사·투자자의 요구가 동시에 도착함", "한쪽을 살리면 다른 쪽의 신뢰가 줄어듦", "반응 패턴이 다음 사건으로 전송될 예정"], ["가장 약한 사람의 손실부터 줄인다", "살아남을 돈을 먼저 확보한다", "결정의 책임과 근거를 모두 공개한다"]],
  ["c2_trace", "c2_logs", "c2_meeting", "사라진 11초", "반재욱", "접속 기록에는 11초의 빈틈이 있습니다. 누군가는 그 짧은 시간에 파일을 바꿀 수 있었고, 누군가는 그 빈틈을 일부러 남겼을 수 있습니다.", ["복사본에는 없는 원본의 흔적", "이민서 계정은 빈틈 직전에 사용됨", "보안팀은 빈틈을 단순 오류라고 주장함"], ["11초를 기술적으로 재현한다", "이민서에게 그 시간의 행동을 묻는다", "오류로 처리하고 보고 시간을 지킨다"]],
  ["c2_witness", "c2_meeting", "c2_pressure", "이민서의 침묵", "도윤하", "이민서는 자신을 변호하지 않습니다. 대신 파일을 받은 사람이 누군지보다, 왜 그 파일이 다음 테스트에 필요했는지부터 물어봅니다.", ["이민서는 CASE 01 보고서를 읽지 못함", "유출 파일에는 선택하지 않은 경로도 포함됨", "누군가 플레이어의 반응을 미리 분류함"], ["이민서의 안전을 먼저 확보한다", "파일의 이동 경로만 추적한다", "침묵을 의심 신호로 기록한다", "이민서와 조건을 걸고 거래한다"]],
  ["c2_judgment", "c2_pressure", "c2_final", "보고서 밖의 사람", "한서윤", "보안팀은 결론을 요구하지만, 이민서의 동료들은 보고서에 없는 사실을 알고 있습니다. 공식 기록과 사람의 기억 중 하나만 고를 수는 없습니다.", ["동료 두 명이 익명 증언을 제출함", "1차 보고 마감까지 18분", "외부 기업은 유출 사실을 부인함"], ["익명 증언을 공식 부록으로 붙인다", "기록에 없는 정보는 보류한다", "외부 기업과 먼저 대면한다"]],
  ["c3_rival", "c3_split", "c3_score", "같은 자료, 다른 목적", "오진우", "오진우는 당신의 자료에 없는 숫자를 들고 왔습니다. 고객이 실제로 원하는 것은 비용 절감이 아니라 실패했을 때 책임질 사람이라는 사실입니다.", ["고객사는 책임 조항을 비공개로 요구함", "경쟁안은 책임을 하청사로 넘김", "보안팀은 발표에서 빠져 있음"], ["책임 조항을 앞에 세운다", "비용표부터 다시 계산한다", "오진우에게 없는 숫자의 출처를 묻는다"]],
  ["c3_signal", "c3_score", "c3_trap", "관객석의 신호", "에코", "발표장 뒤편의 불이 두 번 깜빡였습니다. 고객 신호인지 트리거랩의 시험인지 알 수 없지만, 오진우는 그 신호를 보고 답을 바꿉니다.", ["불빛은 보안 경고와 같은 주기임", "고객 대표는 신호를 부인함", "오진우의 응답 시간이 비정상적으로 짧아짐"], ["신호를 공개 질문으로 바꾼다", "발표를 멈추고 보안부터 확인한다", "상대보다 먼저 결론을 밀어붙인다", "오진우와 신호의 해석을 나눠 갖는다"]],
  ["c3_verdict", "c3_trap", "c3_final", "승부의 끝에서", "한서윤", "당신은 이제 오진우보다 빠르거나 느린 사람이 아닙니다. 어떤 기준으로 승부를 끝낼지 정하는 사람입니다.", ["고객사는 오늘 안에 결론을 원함", "보안 결함은 아직 완전 증명 전", "공동 발표를 하면 책임은 나뉨"], ["검증을 끝낸 뒤 발표한다", "공동 책임으로 발표한다", "불확실성을 숨기고 승리를 확정한다"]],
  ["c4_audit", "c4_offer", "c4_leak", "3%의 주인", "반재욱", "부족한 3%는 단순한 숫자가 아니었습니다. 그 숫자를 계산한 사람과, 그 숫자를 기다리는 사람의 이름이 서로 달랐습니다.", ["산식에는 현장 업무가 빠져 있음", "심사 기준은 2년 전 자료에 고정됨", "서비스 이용자 대표가 발언을 요청함"], ["이용자 대표의 기준을 반영한다", "산식 변경 이력을 남긴다", "3%를 조용히 보정한다"]],
  ["c4_public", "c4_leak", "c4_vote", "기자가 기다리는 문장", "도윤하", "기자는 아직 기사를 쓰지 않았습니다. 다만 당신이 어떤 표현을 선택하는지에 따라 내일의 제목이 정해질 것이라고 말합니다.", ["제보 메일은 내부에서 시작됨", "온새는 서비스 중단을 막고 싶어 함", "심사관은 공개 설명을 요구함"], ["사실과 모르는 것을 함께 공개한다", "서비스 이용자 피해를 먼저 알린다", "기사에 나갈 표현을 최소화한다", "기사 시점을 늦추는 대신 전량 공개를 약속한다"]],
  ["c4_verdict", "c4_vote", "c4_final", "선의의 증거", "에코", "좋은 의도는 증거가 되지 않습니다. 하지만 좋은 결과만을 위해 규칙을 늘리면, 다음 사람은 그 규칙을 이용할 수 있습니다.", ["이사회는 오늘 결정을 요구함", "감사 자료는 공개 가능함", "서비스 이용자 4,200명이 결과를 기다림"], ["예외를 공개된 조건으로 묶는다", "규칙을 지키고 서비스를 포기한다", "결과가 좋다면 기록은 나중에 설명한다"]],
  ["c5_pattern", "c5_map", "c5_blame", "실패가 움직인 경로", "반재욱", "지도 위의 화살표가 한 사람에게 모이지 않습니다. 모든 화살표가 서로의 합리적인 선택을 통과해 같은 곳에 도착했습니다.", ["각 팀은 다른 팀의 정보를 보지 못함", "가장 먼저 위험을 말한 기록이 누락됨", "책임표에는 승인자만 남아 있음"], ["정보가 막힌 지점을 먼저 고친다", "승인자에게 책임을 집중한다", "피해가 큰 부서부터 보상한다"]],
  ["c5_voice", "c5_blame", "c5_collapse", "이름 없는 증언", "도윤하", "누군가가 회의실 밖에서 말합니다. 자신은 결정권자가 아니었지만, 실패를 가장 먼저 보았다고 합니다.", ["증언자는 기록에서 빠져 있음", "말하면 팀 전체가 조사받을 수 있음", "피해자들은 책임자 이름보다 회복을 요구함"], ["증언자를 보호하고 기록을 복원한다", "공식 책임자 발표를 먼저 한다", "보상안을 만들고 조사를 미룬다", "증언자의 고용을 내 권한으로 보장한다"]],
  ["c5_verdict", "c5_collapse", "c5_final", "책임의 모양", "한서윤", "실패를 설명하는 방법은 세 가지입니다. 사람을 지목하거나, 구조를 고치거나, 피해를 먼저 되돌리는 것. 어느 것도 공짜는 아닙니다.", ["개선 예산은 한정됨", "책임 발표를 기다리는 언론", "피해 복구팀이 즉시 출범할 수 있음"], ["내 결정부터 공개한다", "반복을 막는 구조에 투자한다", "피해 복구를 가장 먼저 시작한다"]],
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
    { trust: 7, humanCost: -3, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 7, time: -6, humanCost: 2, fatigue: 4 },
    { capital: 6, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -2 },
  ],
  payday: [
    { trust: 8, humanCost: -3, capital: -7, fatigue: 6 },
    { legitimacy: 6, time: -5, humanCost: 3, fatigue: 3 },
    { capital: 7, trust: -8, legitimacy: -4, humanCost: 4, fatigue: -2 },
    { capital: -10, trust: 6, legitimacy: 6, humanCost: -2, fatigue: 7 },
  ],
  competitor: [
    { legitimacy: 6, time: -7, capital: -4, fatigue: 5 },
    { trust: 7, humanCost: -4, capital: -8, fatigue: 5 },
    { capital: 8, time: 3, trust: -7, humanCost: 5, fatigue: -2 },
  ],
  board: [
    { humanCost: -6, trust: 7, capital: -8, fatigue: 5 },
    { capital: 8, humanCost: 5, trust: -6, time: 2, fatigue: -2 },
    { legitimacy: 8, trust: 3, capital: -3, time: -6, fatigue: 6 },
  ],
  c2_logs: [
    { legitimacy: 7, time: -7, capital: -4, fatigue: 5 },
    { trust: 6, legitimacy: 2, humanCost: -2, time: -5, fatigue: 4 },
    { time: 5, capital: 3, legitimacy: -7, humanCost: 4, fatigue: -3 },
  ],
  c2_meeting: [
    { trust: 8, humanCost: -4, capital: -6, time: -4, fatigue: 5 },
    { legitimacy: 6, time: -7, humanCost: 2, fatigue: 5 },
    { time: 4, trust: -8, legitimacy: -2, humanCost: 5, fatigue: -2 },
    { capital: 6, trust: 4, legitimacy: -6, humanCost: 3, fatigue: 3 },
  ],
  c2_pressure: [
    { legitimacy: 7, trust: 5, humanCost: -2, time: -6, fatigue: 6 },
    { time: 3, legitimacy: -4, trust: -5, humanCost: 5, fatigue: -2 },
    { capital: 6, legitimacy: 2, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
  ],
  c3_split: [
    { legitimacy: 7, capital: -6, time: -5, fatigue: 5 },
    { capital: 7, trust: -4, humanCost: 3, time: -6, fatigue: 4 },
    { trust: 5, legitimacy: 4, humanCost: -2, capital: -3, time: -6, fatigue: 5 },
  ],
  c3_score: [
    { trust: 6, legitimacy: 5, capital: -5, time: -4, fatigue: 5 },
    { legitimacy: 7, time: -8, capital: -5, fatigue: 6 },
    { capital: 8, trust: -7, humanCost: 5, time: 3, fatigue: -3 },
    { capital: 5, trust: 3, legitimacy: -7, humanCost: 2, fatigue: 3 },
  ],
  c3_trap: [
    { legitimacy: 8, time: -8, capital: -5, fatigue: 6 },
    { trust: 7, legitimacy: 4, humanCost: -3, capital: -6, fatigue: 5 },
    { capital: 9, trust: -8, legitimacy: -5, humanCost: 6, time: 3, fatigue: -3 },
  ],
  c4_offer: [
    { trust: 7, humanCost: -5, capital: -7, time: -5, fatigue: 5 },
    { legitimacy: 7, time: -6, humanCost: 2, fatigue: 4 },
    { capital: 7, legitimacy: -8, humanCost: 4, time: 3, fatigue: -2 },
  ],
  c4_leak: [
    { legitimacy: 8, trust: 3, capital: -7, fatigue: 6 },
    { humanCost: -5, trust: 7, capital: -6, time: -4, fatigue: 5 },
    { time: 4, capital: 4, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -3 },
    { time: -7, legitimacy: 5, trust: 5, capital: -3, humanCost: 2, fatigue: 4 },
  ],
  c4_vote: [
    { legitimacy: 8, time: -6, capital: -4, fatigue: 5 },
    { legitimacy: 6, humanCost: 7, capital: -8, trust: -3, fatigue: 4 },
    { capital: 8, legitimacy: -7, trust: -5, humanCost: 4, time: 3, fatigue: -2 },
  ],
  c5_map: [
    { legitimacy: 7, capital: -7, time: -7, fatigue: 6 },
    { legitimacy: 4, trust: -6, humanCost: 5, time: -3, fatigue: 3 },
    { humanCost: -6, trust: 6, capital: -9, fatigue: 5 },
  ],
  c5_blame: [
    { trust: 8, humanCost: -4, capital: -5, time: -6, fatigue: 6 },
    { legitimacy: 7, trust: -4, humanCost: 4, time: -4, fatigue: 4 },
    { capital: -7, trust: 3, legitimacy: -6, humanCost: -3, time: 4, fatigue: -3 },
    { trust: 6, legitimacy: -4, capital: -8, humanCost: -5, fatigue: 7 },
  ],
  c5_collapse: [
    { legitimacy: 8, trust: 4, humanCost: 2, time: -4, fatigue: 7 },
    { capital: -9, legitimacy: 7, time: -6, fatigue: 5 },
    { humanCost: -7, trust: 7, capital: -8, fatigue: 5 },
  ],
  f_archive: [
    { trust: 8, legitimacy: 5, capital: -4, time: -6, fatigue: 6 },
    { legitimacy: 8, humanCost: 2, capital: -5, time: -8, fatigue: 6 },
    { humanCost: -5, legitimacy: -6, trust: -4, capital: -7, time: 4, fatigue: -3 },
  ],
  f_confront: [
    { trust: 8, legitimacy: 6, capital: -6, time: -5, fatigue: 6 },
    { legitimacy: 8, humanCost: 2, capital: -4, time: -8, fatigue: 5 },
    { humanCost: -6, legitimacy: -7, trust: -5, capital: -8, time: 4, fatigue: -3 },
    { trust: 5, legitimacy: 4, humanCost: -3, capital: -5, fatigue: 9 },
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
const authoredSceneReactionEffects = {
  c1_witness: [
    { trust: 7, legitimacy: 3, time: -5, fatigue: 7 },
    { time: 5, trust: -5, humanCost: 4, fatigue: -4 },
    { capital: 5, trust: -3, legitimacy: -4, humanCost: 3, fatigue: -2 },
  ],
  c1_assembly: [
    { legitimacy: 7, trust: 5, capital: -5, fatigue: 6 },
    { time: 4, trust: -4, humanCost: 4, fatigue: -5 },
    { trust: -7, legitimacy: 2, humanCost: 5, time: -4, fatigue: 3 },
  ],
  c1_bargain: [
    { trust: 8, humanCost: -4, capital: -7, time: -5, fatigue: 5 },
    { legitimacy: 6, humanCost: 2, time: -6, fatigue: 4 },
    { time: 5, trust: -4, humanCost: 3, fatigue: -4 },
  ],
  c1_verdict: [
    { trust: 7, humanCost: -5, capital: -6, fatigue: 6 },
    { capital: 5, legitimacy: 5, humanCost: 2, time: -5, fatigue: 3 },
    { time: 4, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -3 },
  ],
  c2_trace: [
    { legitimacy: 7, capital: -4, time: -6, fatigue: 5 },
    { legitimacy: 4, trust: -3, humanCost: 2, time: -7, fatigue: 6 },
    { time: 6, capital: -3, legitimacy: -7, humanCost: 6, fatigue: -4 },
  ],
  c2_witness: [
    { trust: 7, legitimacy: 5, time: -6, fatigue: 7 },
    { trust: 3, humanCost: -2, legitimacy: -3, capital: -4, fatigue: 5 },
    { time: 5, trust: -7, humanCost: 6, fatigue: -5 },
  ],
  c2_judgment: [
    { legitimacy: 7, trust: 4, time: -5, fatigue: 6 },
    { legitimacy: 6, trust: -6, humanCost: 5, time: -6, fatigue: 4 },
    { time: 5, legitimacy: -5, trust: -4, humanCost: 4, fatigue: -4 },
  ],
  c3_rival: [
    { trust: 6, legitimacy: 5, capital: -6, time: -5, fatigue: 4 },
    { legitimacy: 7, capital: -4, time: -8, fatigue: 5 },
    { capital: 9, trust: -8, legitimacy: -4, time: 3, fatigue: -2 },
  ],
  c3_signal: [
    { legitimacy: 6, trust: 5, capital: -5, time: -4, fatigue: 5 },
    { legitimacy: 3, humanCost: 2, time: -3, fatigue: 6 },
    { capital: 8, trust: -7, humanCost: 5, time: 3, fatigue: -3 },
  ],
  c3_verdict: [
    { trust: 6, legitimacy: 6, time: -6, fatigue: 5 },
    { legitimacy: 7, trust: 4, humanCost: -3, capital: -6, fatigue: 8 },
    { time: 5, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -4 },
  ],
  c4_audit: [
    { humanCost: -6, trust: 6, capital: -8, time: -4, fatigue: 5 },
    { legitimacy: 5, humanCost: 3, time: -4, fatigue: 3 },
    { capital: 6, legitimacy: -4, trust: -5, humanCost: 5, fatigue: -3 },
  ],
  c4_public: [
    { legitimacy: 8, trust: 4, capital: -7, fatigue: 6 },
    { capital: 6, legitimacy: -5, humanCost: 4, time: 2, fatigue: 2 },
    { time: 4, trust: -6, legitimacy: -6, humanCost: 3, fatigue: -4 },
  ],
  c4_verdict: [
    { legitimacy: 8, capital: -8, time: -6, fatigue: 7 },
    { trust: 7, humanCost: -3, legitimacy: -3, capital: -4, fatigue: 5 },
    { time: 5, trust: -5, legitimacy: -4, humanCost: 5, fatigue: -4 },
  ],
  c5_pattern: [
    { legitimacy: 6, humanCost: -5, capital: -5, time: -8, fatigue: 6 },
    { legitimacy: 5, trust: -5, humanCost: 4, time: -4, fatigue: 3 },
    { time: 4, capital: 3, legitimacy: -4, humanCost: 4, fatigue: -4 },
  ],
  c5_voice: [
    { trust: 8, humanCost: -5, capital: -7, fatigue: 6 },
    { legitimacy: 7, capital: -6, time: -6, fatigue: 7 },
    { time: 5, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -3 },
  ],
  c5_verdict: [
    { humanCost: -6, trust: 6, capital: -8, fatigue: 5 },
    { legitimacy: 5, trust: 3, humanCost: 2, time: -4, fatigue: 4 },
    { time: 5, trust: -6, legitimacy: -3, humanCost: 5, fatigue: -4 },
  ],
  f_witness: [
    { trust: 8, legitimacy: 6, time: -7, fatigue: 6 },
    { legitimacy: 7, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
    { humanCost: -4, legitimacy: -8, trust: -4, time: 4, fatigue: -3 },
  ],
  f_dilemma: [
    { trust: 7, legitimacy: 7, time: -8, fatigue: 6 },
    { legitimacy: 5, humanCost: -4, trust: -4, capital: -5, fatigue: 8 },
    { time: 5, trust: -7, legitimacy: -6, humanCost: 6, fatigue: -4 },
  ],
};

const authoredSceneChoiceCopy = {
  accounting: { voice: ["보호받아야 할 사람의 이름부터 기록하겠습니다.", "원본과 증언을 함께 남기고 다음 판단으로 가겠습니다.", "확인 전 결론은 보류하고 접근 범위를 줄이겠습니다."], echo: ["보호를 먼저 적으면 이후 기록의 책임선이 달라집니다.", "원본을 남기는 선택은 늦어도 되돌릴 수 있습니다.", "보류는 중립이 아니라 접근을 제한하는 결정입니다."] },
  payday: { voice: ["지급 약속을 공개하고 당사자와 함께 검증하겠습니다.", "현금 흐름과 사람의 손실을 같은 표에 올리겠습니다.", "불만을 숫자로 지우지 않고 협상 조건으로 남기겠습니다.", "먼저 깎을 자리는 제 자리라고 적겠습니다."], echo: ["급여표는 돈의 표이면서 신뢰의 기록입니다.", "숫자와 사람을 나누면 다음 장면에서 비용이 돌아옵니다.", "조건을 적어야 약속이 나중에 증언이 됩니다.", "위에서 먼저 깎으면 지급 순서는 설명이 필요 없어집니다."] },
  competitor: { voice: ["경쟁사의 요구를 공개 조건으로 바꾸겠습니다.", "속도보다 누가 무엇을 책임지는지 먼저 묻겠습니다.", "거래의 빈칸마다 되돌릴 조건을 붙이겠습니다."], echo: ["경쟁은 속도를 주지만 책임의 주체를 흐릴 수 있습니다.", "빠른 제안일수록 출처와 책임선을 함께 기록해야 합니다.", "빈칸을 남기면 다음 협상자가 그 비용을 떠안습니다."] },
  board: { voice: ["결론보다 피해를 받는 사람에게 먼저 설명하겠습니다.", "근거와 책임자를 같은 문서에 공개하겠습니다.", "오늘의 합의가 내일의 규칙이 되는지 확인하겠습니다."], echo: ["결론은 설명될 때 비로소 조직의 기록이 됩니다.", "근거 없는 책임은 다음 사건의 희생양을 만듭니다.", "이번 합의에는 다음 사람이 따라야 할 규칙이 남습니다."] },
  c2_logs: { voice: ["공백 전후의 원본 로그를 보존하겠습니다.", "계정의 움직임과 사람의 진술을 대조하겠습니다.", "오류 처리를 서두르지 않고 복구 순서를 공개하겠습니다."], echo: ["짧은 공백도 복원 순서가 없으면 의혹으로 남습니다.", "로그는 행동을 보여주지만 의도까지 대신 말하지는 않습니다.", "복구 순서가 공개돼야 수정이 은폐로 보이지 않습니다."] },
  c2_meeting: { voice: ["지목된 사람에게 먼저 반박할 권한을 주겠습니다.", "증언과 기록을 서로 검증하는 절차를 만들겠습니다.", "보고서 밖의 사람도 확인 가능한 문장을 남기겠습니다.", "지목된 사람과 조건을 걸고 거래하겠습니다."], echo: ["보호는 침묵시키는 일이 아니라 말할 조건을 만드는 일입니다.", "증언은 기록과 경쟁하지 않고 기록의 빈틈을 드러냅니다.", "보고서 밖의 목소리가 다음 판단의 기준이 될 수 있습니다.", "거래는 답을 빨리 주지만 그 답의 값은 나중에 청구됩니다."] },
  c2_pressure: { voice: ["보고 마감보다 사실의 순서를 먼저 고정하겠습니다.", "익명 증언의 위험과 필요를 함께 공개하겠습니다.", "누가 책임을 미뤘는지보다 어떤 장치가 허용했는지 보겠습니다."], echo: ["마감은 중요하지만 잘못 고정된 순서는 더 오래 남습니다.", "익명성은 약점이 아니라 말할 수 있게 하는 비용입니다.", "개인을 지목해도 같은 구조가 반복되면 해결되지 않습니다."] },
  c3_split: { voice: ["고객의 목적과 비용 절감의 목적을 분리해 묻겠습니다.", "경쟁사의 책임 조항을 문장 단위로 확인하겠습니다.", "공동 발표라면 실패했을 때의 책임도 함께 쓰겠습니다."], echo: ["같은 자료가 다른 목적을 섬길 때 기준을 먼저 세워야 합니다.", "책임 조항의 작은 문장이 결론의 방향을 바꿉니다.", "공동 책임은 좋은 말이 아니라 실패 시 작동해야 합니다."] },
  c3_score: { voice: ["신호를 경보로 단정하기 전에 출처를 확인하겠습니다.", "발표를 잠시 멈추고 고객에게 보이는 사실을 묻겠습니다.", "빠른 승리보다 검증 가능한 조건을 선택하겠습니다.", "신호의 해석을 경쟁자와 나눠 갖겠습니다."], echo: ["신호는 결론이 아니라 확인할 질문을 만듭니다.", "고객이 본 장면은 내부 점수표보다 먼저 검증돼야 합니다.", "승리의 조건을 적어야 다음 경쟁에서도 기준이 남습니다.", "해석을 나누면 위험도 나뉘지만 기준도 함께 흐려집니다."] },
  c3_trap: { voice: ["경보의 주기와 출처를 모두 공개하겠습니다.", "불확실성을 숨기지 않고 발표의 전제로 삼겠습니다.", "결론을 밀기 전에 보안 담당자의 확인을 받겠습니다."], echo: ["반복되는 신호일수록 출처를 확인해야 패턴이 됩니다.", "불확실성을 공개하면 오히려 검증의 범위가 선명해집니다.", "보안 확인은 속도를 늦추지만 잘못된 확신을 막습니다."] },
  c4_offer: { voice: ["예외 조건의 수혜자와 비용 부담자를 함께 적겠습니다.", "작은 비율의 차이가 누구에게 누적되는지 계산하겠습니다.", "서비스를 유지하되 감사 가능한 조건을 붙이겠습니다."], echo: ["작은 비율도 반복되면 조직의 규칙이 됩니다.", "수혜자와 부담자가 다르면 예외는 먼저 공개돼야 합니다.", "서비스의 명분은 감사 가능한 조건을 가질 때 지켜집니다."] },
  c4_leak: { voice: ["공개 가능한 사실과 아직 모르는 사실을 나누겠습니다.", "기자의 문장보다 피해 복구의 순서를 먼저 확정하겠습니다.", "보안 결함의 범위와 책임을 함께 설명하겠습니다.", "기사 시점을 늦추는 대신 전량 공개를 약속하겠습니다."], echo: ["모르는 것을 함께 적는 것이 공개의 첫 조건입니다.", "기사의 속도보다 복구 순서가 피해자에게 직접 닿습니다.", "결함을 설명하지 않으면 책임의 방향도 왜곡됩니다.", "시간을 사면 공개의 범위는 넓어지지만 약속은 되돌릴 수 없습니다."] },
  c4_vote: { voice: ["감사 결과를 보상 기준과 함께 공개하겠습니다.", "좋은 결과가 규칙 위반을 지우지 못하게 하겠습니다.", "예외를 허용한 결정권자의 근거를 남기겠습니다."], echo: ["보상 기준이 공개되면 결과 뒤의 규칙도 보입니다.", "좋은 결과는 규칙을 면제하는 증거가 아닙니다.", "결정권자의 근거가 없으면 예외는 다시 반복됩니다."] },
  c5_map: { voice: ["실패가 모이는 경로부터 다시 그리겠습니다.", "한 사람의 과실과 시스템의 빈틈을 분리하겠습니다.", "피해가 반복된 지점을 개선 예산에 올리겠습니다."], echo: ["실패의 경로를 그리면 비난보다 개입 지점이 보입니다.", "개인의 과실만 남기면 시스템의 빈틈은 계속 작동합니다.", "개선 예산은 피해가 반복된 곳에 먼저 닿아야 합니다."] },
  c5_blame: { voice: ["말할 수 없었던 사람의 조건부터 복구하겠습니다.", "책임 발표 전에 결정권과 정보 흐름을 공개하겠습니다.", "보상과 조사 일정을 한 번에 약속하겠습니다.", "증언자의 자리를 제 권한으로 보장하겠습니다."], echo: ["침묵의 조건을 고치지 않으면 같은 증언은 다시 사라집니다.", "책임은 결정권과 정보 접근이 확인될 때 구체화됩니다.", "보상과 조사는 서로를 미루는 핑계가 되어서는 안 됩니다.", "개인이 보증한 자리는 그 개인이 사라지면 함께 사라집니다."] },
  c5_collapse: { voice: ["사과문보다 피해 복구의 첫 행동을 정하겠습니다.", "책임자의 이름과 개선 기한을 함께 기록하겠습니다.", "다음 실패를 막는 장치를 지금 결정하겠습니다."], echo: ["사과는 첫 행동이 기록될 때 책임으로 이어집니다.", "이름만 남은 책임은 기한이 없으면 다시 흐려집니다.", "다음 실패를 막는 장치가 없으면 결말은 반복됩니다."] },
  f_archive: { voice: ["이전 참가자의 선택과 조건을 원본 그대로 열겠습니다.", "복제된 문장과 실제 결과를 나란히 비교하겠습니다.", "실험을 멈출 조건을 먼저 기록하겠습니다."], echo: ["이전 기록은 정답지가 아니라 다음 판단의 조건입니다.", "문장이 복제되면 결과가 누구의 것인지 다시 물어야 합니다.", "멈출 조건이 없으면 실험은 책임을 외주화합니다."] },
  f_confront: { voice: ["관찰된 선택을 숨기지 않고 당사자에게 돌려주겠습니다.", "종료 권한과 감시 규칙을 함께 공개하겠습니다.", "다음 참가자가 바꿀 수 있는 빈칸을 남기겠습니다.", "실험을 이어가되 다음 참가자 자리에 제 이름을 넣겠습니다."], echo: ["관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.", "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.", "빈칸을 남기는 일은 다음 판단자에게 책임을 넘기는 방식입니다.", "자신을 넣는 선택은 실험을 멈추지 않고 관찰자만 한 명 줄입니다."] },
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
  f_dilemma: { voice: ["종료 조건을 참가자들과 함께 정하겠습니다.", "제가 혼자 버튼을 누르겠습니다.", "버튼을 숨기고 시스템을 지켜보겠습니다."], echo: ["함께 정한 종료 조건은 느리지만 다음 실험에도 남습니다.", "혼자 누르면 끝나고, 그 결정의 근거는 아무도 검토하지 않습니다.", "숨긴 버튼은 통제가 아니라 다음 관찰자의 권한이 됩니다."] },
};

function getAuthoredSceneEffects(sourceId, id) {
  const table = id.endsWith("_reaction") ? authoredSceneReactionEffects : authoredSceneChoiceEffects;
  const effects = table[sourceId];
  if (!effects) {
    throw new Error(`Missing authored choice effects for generated scene source: ${sourceId} (${id})`);
  }
  return effects;
}

function getAuthoredSceneCopy(sourceId, id) {
  const table = id.endsWith("_reaction") ? authoredSceneReactionCopy : authoredSceneChoiceCopy;
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
    phase: "CONNECTIVE SCENE",
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
  final: [["f_archive", "f_witness"], ["f_confront", "f_dilemma"]],
};

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
  f_witness_reaction: ["이전 참가자가 돌려받을 기록", "동의 없이 복제된 문장"],
  f_dilemma_reaction: ["종료 버튼을 누를 권한", "참가자들과 합의할 종료 조건"],
};

function addReactionScene([id, sourceId, nextId, title, speaker, text, labels]) {
  const source = nodes[sourceId];
  if (!source) return;
  const effects = getAuthoredSceneEffects(sourceId, id);
  const copy = getAuthoredSceneCopy(sourceId, id);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    phase: "REACTION",
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
    phase: "BRANCH DETOUR",
    title: "누가 빈칸을 채우는가",
    speaker: "도윤하",
    text: "협상서의 빈칸을 사람의 이름으로 채우려는 순간, 숫자로 미뤄 둔 책임이 모두 드러났습니다.",
    memo: ["협력사 지급 보장", "남겨질 직원의 고용 기간", "인수 이후 책임 주체"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c1_branch_people_a", label: "남겨질 사람부터 협상서에 적는다", effect: { trust: 7, humanCost: -3, capital: -9, fatigue: 4 }, next: "c1_branch_people_follow", cognition: { reframing: 2 } },
      { id: "c1_branch_people_b", label: "협력사 지급일을 먼저 고정한다", effect: { legitimacy: 5, time: -5, trust: 2, humanCost: 2 }, next: "c1_branch_people_follow", cognition: { inference: 1 } },
      { id: "c1_branch_people_c", label: "인수 조건만 남기고 서명한다", effect: { capital: 8, trust: -7, humanCost: 5, fatigue: -2 }, next: "c1_branch_people_follow", cognition: { risk: 2 } },
    ],
  },
  c1_branch_people_follow: {
    phase: "BRANCH DETOUR",
    title: "서명 뒤의 첫 전화",
    speaker: "에코",
    text: "서명은 끝났지만 첫 전화는 계약서에 없는 사람에게서 왔습니다. 이제 빈칸은 비용이 아니라 약속의 형태가 됩니다.",
    memo: ["계약서 밖의 이해관계자", "첫 지급 이후의 책임", "약속을 검증할 기록"],
    triggers: ["trust", "responsibility"],
    choices: [
      { id: "c1_branch_people_follow_a", label: "약속을 공개 기록으로 남긴다", effect: { legitimacy: 6, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "board", cognition: { inference: 1 } },
      { id: "c1_branch_people_follow_b", label: "전화한 사람의 조건을 반영한다", effect: { trust: 5, capital: -4, humanCost: -2 }, next: "board", cognition: { reframing: 1 } },
      { id: "c1_branch_people_follow_c", label: "계약서만이 기준이라고 답한다", effect: { capital: 4, trust: -6, legitimacy: -2 }, next: "board", cognition: { risk: 1 } },
    ],
  },
  c2_branch_records: {
    phase: "BRANCH DETOUR",
    title: "11초를 누구의 시간으로 볼 것인가",
    speaker: "반재현",
    text: "기록 사이의 11초를 기술 오류로 닫을지, 누군가의 판단이 들어간 시간으로 열어둘지 선택해야 합니다.",
    memo: ["원본 로그의 공백", "접속 계정의 순서", "삭제 요청의 승인자"],
    triggers: ["curiosity", "trust"],
    choices: [
      { id: "c2_branch_records_a", label: "원본과 백업을 동시에 보존한다", effect: { legitimacy: 7, time: -8, capital: -5, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { inference: 2 } },
      { id: "c2_branch_records_b", label: "접속자의 진술부터 확보한다", effect: { trust: 6, time: -6, legitimacy: 2, humanCost: -2, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { persistence: 1 } },
      { id: "c2_branch_records_c", label: "오류로 표시하고 보고를 진행한다", effect: { time: 5, legitimacy: -7, humanCost: 4, fatigue: -3 }, next: "c2_branch_records_follow", cognition: { risk: 2 } },
    ],
  },
  c2_branch_records_follow: {
    phase: "BRANCH DETOUR",
    title: "복원된 기록의 주인",
    speaker: "한서윤",
    text: "복원된 기록에는 이름보다 먼저 책임을 미룬 순서가 남아 있습니다. 누가 말할 수 있게 할지도 기록의 일부입니다.",
    memo: ["복원 시각", "진술 순서", "보고서에 남길 원문"],
    triggers: ["injustice", "responsibility"],
    choices: [
      { id: "c2_branch_records_follow_a", label: "진술자에게 원문 확인 권한을 준다", effect: { trust: 6, legitimacy: 3, capital: -5, time: -4, fatigue: 5 }, next: "c2_final", cognition: { reframing: 1 } },
      { id: "c2_branch_records_follow_b", label: "원문을 첨부해 외부 검증을 연다", effect: { legitimacy: 8, capital: -5, time: -4 }, next: "c2_final", cognition: { inference: 2 } },
      { id: "c2_branch_records_follow_c", label: "보고서의 결론만 남긴다", effect: { time: 4, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -3 }, next: "c2_final", cognition: { risk: 1 } },
    ],
  },
  c3_branch_signal: {
    phase: "BRANCH DETOUR",
    title: "관객석의 신호를 멈춰 읽기",
    speaker: "에코",
    text: "발표 화면의 신호는 경쟁사의 방해일 수도, 고객이 보내는 마지막 확인 요청일 수도 있습니다.",
    memo: ["신호가 켜진 시각", "고객 계정의 반응", "발표 중단 비용"],
    triggers: ["competition", "curiosity"],
    choices: [
      { id: "c3_branch_signal_a", label: "신호를 공개 질문으로 전환한다", effect: { trust: 6, legitimacy: 5, time: -6, capital: -5, fatigue: 3 }, next: "c3_branch_signal_follow", cognition: { reframing: 2 } },
      { id: "c3_branch_signal_b", label: "발표를 멈추고 출처를 확인한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "c3_branch_signal_follow", cognition: { inference: 2 } },
      { id: "c3_branch_signal_c", label: "신호를 무시하고 승부를 끝낸다", effect: { capital: 8, trust: -6, humanCost: 4, fatigue: -2 }, next: "c3_branch_signal_follow", cognition: { risk: 2 } },
    ],
  },
  c3_branch_signal_follow: {
    phase: "BRANCH DETOUR",
    title: "빠른 승리의 조건표",
    speaker: "오진우",
    text: "결과가 좋아도 조건표에 빈칸이 남으면 다음 경쟁은 그 빈칸부터 시작됩니다.",
    memo: ["승리 발표의 수혜자", "검증되지 않은 보안 항목", "다음 계약의 조건"],
    triggers: ["competition", "order"],
    choices: [
      { id: "c3_branch_signal_follow_a", label: "승리 조건에 검증 기한을 붙인다", effect: { legitimacy: 7, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "c3_final", cognition: { persistence: 1 } },
      { id: "c3_branch_signal_follow_b", label: "공동 책임자를 발표한다", effect: { trust: 7, capital: -4, legitimacy: 3 }, next: "c3_final", cognition: { reframing: 1 } },
      { id: "c3_branch_signal_follow_c", label: "성과 수치만 먼저 확정한다", effect: { capital: 7, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -2 }, next: "c3_final", cognition: { risk: 1 } },
    ],
  },
  c4_branch_exception: {
    phase: "BRANCH DETOUR",
    title: "예외의 사용자를 확인하다",
    speaker: "반재현",
    text: "예외 승인은 선의를 증명하지 않습니다. 누구에게 반복될 수 있는지가 이 결정의 핵심입니다.",
    memo: ["예외 승인자", "서비스 이용자 수", "재사용 가능한 조건"],
    triggers: ["order", "injustice"],
    choices: [
      { id: "c4_branch_exception_a", label: "예외 조건을 누구나 읽게 공개한다", effect: { legitimacy: 8, trust: 3, time: -7, capital: -5 }, next: "c4_branch_exception_follow", cognition: { inference: 1 } },
      { id: "c4_branch_exception_b", label: "피해 이용자에게 먼저 보상한다", effect: { humanCost: -5, capital: -7, trust: 6 }, next: "c4_branch_exception_follow", cognition: { reframing: 1 } },
      { id: "c4_branch_exception_c", label: "이번 사례만 조용히 승인한다", effect: { time: 5, legitimacy: -8, humanCost: 5, fatigue: -3 }, next: "c4_branch_exception_follow", cognition: { risk: 2 } },
    ],
  },
  c4_branch_exception_follow: {
    phase: "BRANCH DETOUR",
    title: "좋은 결과 뒤의 감사",
    speaker: "윤서",
    text: "서비스는 멈추지 않았지만 감사 기록은 남았습니다. 다음 사람에게 같은 예외를 허용할 기준이 필요합니다.",
    memo: ["감사 요청의 범위", "예외 승인 기록", "보상 기준의 공개 여부"],
    triggers: ["responsibility", "recognition"],
    choices: [
      { id: "c4_branch_exception_follow_a", label: "감사 결과와 보상 기준을 함께 공개한다", effect: { legitimacy: 7, trust: 5, time: -6, capital: -6, fatigue: 2 }, next: "c4_final", cognition: { inference: 1 } },
      { id: "c4_branch_exception_follow_b", label: "감사 범위를 이용자 대표와 정한다", effect: { trust: 7, capital: -4, fatigue: 4 }, next: "c4_final", cognition: { reframing: 2 } },
      { id: "c4_branch_exception_follow_c", label: "좋은 결과를 근거로 감사를 닫는다", effect: { capital: 5, legitimacy: -6, humanCost: 4, fatigue: -2 }, next: "c4_final", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner: {
    phase: "BRANCH DETOUR",
    title: "실패의 주어를 고르다",
    speaker: "윤서",
    text: "실패에는 사람이 보이지만, 시스템은 여러 번의 작은 양보로 만들어졌습니다.",
    memo: ["결정권자의 승인", "누락된 안전장치", "피해를 되돌릴 순서"],
    triggers: ["responsibility", "helplessness"],
    choices: [
      { id: "c5_branch_owner_a", label: "내 승인부터 공개한다", effect: { legitimacy: 7, trust: 4, humanCost: -3, capital: -6, fatigue: 4 }, next: "c5_branch_owner_follow", cognition: { persistence: 1 } },
      { id: "c5_branch_owner_b", label: "누락된 안전장치를 복구한다", effect: { capital: -6, legitimacy: 6, humanCost: -5, fatigue: 5 }, next: "c5_branch_owner_follow", cognition: { reframing: 2 } },
      { id: "c5_branch_owner_c", label: "실패를 한 사람의 책임으로 닫는다", effect: { time: 4, trust: -8, humanCost: 6 }, next: "c5_branch_owner_follow", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner_follow: {
    phase: "BRANCH DETOUR",
    title: "복구 이후에도 남는 이름",
    speaker: "에코",
    text: "복구가 시작되면 책임의 이름은 사라지지 않습니다. 다만 그 이름이 다음 피해를 막는 장치가 될 수 있습니다.",
    memo: ["복구된 사람", "재발 방지 소유자", "공개할 책임 범위"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c5_branch_owner_follow_a", label: "복구 대상과 책임자를 함께 기록한다", effect: { trust: 6, legitimacy: 6, capital: -7, fatigue: 5 }, next: "c5_final", cognition: { inference: 1 } },
      { id: "c5_branch_owner_follow_b", label: "재발 방지 장치에 예산을 고정한다", effect: { capital: -8, legitimacy: 7, humanCost: -2 }, next: "c5_final", cognition: { persistence: 2 } },
      { id: "c5_branch_owner_follow_c", label: "사과문만 발표하고 종료한다", effect: { time: 5, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -3 }, next: "c5_final", cognition: { risk: 1 } },
    ],
  },
  f_branch_witness: {
    phase: "BRANCH DETOUR",
    title: "이전 기록의 빈칸",
    speaker: "한서윤",
    text: "이전 참가자의 기록은 당신의 선택과 닮았지만, 마지막 한 줄만 비어 있습니다. 그 빈칸이 실험의 목적일 수 있습니다.",
    memo: ["이전 참가자의 선택", "삭제된 마지막 문장", "기록을 읽는 권한"],
    triggers: ["selfAwareness", "curiosity"],
    choices: [
      { id: "f_branch_witness_a", label: "빈칸을 참가자들에게 공개한다", effect: { legitimacy: 8, trust: 5, time: -7, capital: -5 }, next: "f_branch_witness_follow", cognition: { inference: 2 } },
      { id: "f_branch_witness_b", label: "삭제 흔적부터 복원한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "f_branch_witness_follow", cognition: { persistence: 1 } },
      { id: "f_branch_witness_c", label: "기록의 결론만 믿고 넘어간다", effect: { time: 5, trust: -7, humanCost: 4, fatigue: -2 }, next: "f_branch_witness_follow", cognition: { risk: 2 } },
    ],
  },
  f_branch_witness_follow: {
    phase: "BRANCH DETOUR",
    title: "에코의 마지막 질문",
    speaker: "에코",
    text: "기록을 읽는 사람도 기록의 일부가 됩니다. 당신의 조건을 누가 다시 읽게 될지 정해야 합니다.",
    memo: ["열람자의 범위", "재현 가능한 선택", "종료 조건"],
    triggers: ["selfAwareness", "choice"],
    choices: [
      { id: "f_branch_witness_follow_a", label: "모든 참가자에게 열람 권한을 준다", effect: { legitimacy: 7, trust: 6, time: -6, capital: -5, fatigue: 3 }, next: "f_choice", cognition: { reframing: 1 } },
      { id: "f_branch_witness_follow_b", label: "독립 검토자에게 먼저 맡긴다", effect: { trust: 4, capital: -5, legitimacy: 8 }, next: "f_choice", cognition: { inference: 2 } },
      { id: "f_branch_witness_follow_c", label: "내 기록만 보관하고 문을 닫는다", effect: { time: 4, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -3 }, next: "f_choice", cognition: { risk: 1 } },
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
export const branchConditions = {
  costAlreadyPaid: {
    label: "이미 누군가 비용을 치른 뒤에만 열립니다",
    test: ({ resources } = {}) =>
      (resources?.humanCost ?? 0) >= 6 || (resources?.legitimacy ?? 100) <= 45,
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
  ["final", "f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
];

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
        effect: { legitimacy: 7, trust: 2, time: -7, capital: -3, humanCost: -2, fatigue: 5 },
        next: "c2_pressure",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_route_report_sign",
        label: "절차대로 서명하되 반박 가능성을 각주로 남긴다",
        effect: { time: 4, legitimacy: 4, trust: -6, humanCost: 5, fatigue: -2 },
        next: "c2_pressure",
        cognition: { risk: 2 },
      },
      {
        id: "c2_route_report_reopen",
        label: "보고서 자체를 증거로 삼아 누가 서둘렀는지 추적한다",
        effect: { legitimacy: 9, trust: -2, time: -8, capital: -4, fatigue: 6 },
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
        effect: { trust: 8, legitimacy: 2, time: -7, capital: -4, humanCost: -3, fatigue: 6 },
        next: "c2_meeting",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_route_person_shield",
        label: "당신이 대신 진술해 당장의 노출을 줄인다",
        effect: { trust: 5, legitimacy: -5, humanCost: -4, time: -5, fatigue: 7 },
        next: "c2_meeting",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_route_person_trade",
        label: "보호를 조건으로 파일 출처를 먼저 묻는다",
        effect: { capital: 4, trust: -5, legitimacy: -2, humanCost: 3, fatigue: -2 },
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
      "사건 01 반응 로그가 테스트 데이터로 재사용됨",
    ],
    triggers: ["curiosity", "injustice", "order"],
    choices: [
      {
        id: "c2_route_origin_freeze",
        label: "원본과 백업을 모두 동결하고 차이를 공개한다",
        effect: { legitimacy: 8, trust: 2, capital: -5, time: -8, fatigue: 6 },
        next: "c2_logs",
        cognition: { inference: 3 },
      },
      {
        id: "c2_route_origin_token",
        label: "관리자 토큰 사용자를 추적한다",
        effect: { legitimacy: 5, trust: -2, time: -9, capital: -3, humanCost: 2, fatigue: 5 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 2 },
      },
      {
        id: "c2_route_origin_patch",
        label: "공백을 오류로 패치하고 보고 마감을 맞춘다",
        effect: { time: 5, capital: 3, legitimacy: -8, trust: -4, humanCost: 5, fatigue: -3 },
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
        effect: { legitimacy: 8, trust: 3, capital: -5, time: -7, fatigue: 6 },
        next: "c2_branch_records",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_route_system_warn",
        label: "다음 참가자에게 이 실험 가능성을 먼저 경고한다",
        effect: { trust: 7, legitimacy: -3, humanCost: -4, capital: -4, fatigue: 7 },
        next: "c2_branch_records",
        cognition: { reframing: 2 },
      },
      {
        id: "c2_route_system_hide",
        label: "실험 흔적을 숨기고 이민서 사건만 해결한다",
        effect: { time: 5, capital: 4, legitimacy: -7, trust: -5, humanCost: 4, fatigue: -3 },
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
        effect: { legitimacy: 8, trust: 5, time: -8, capital: -4, humanCost: -4, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_final_evidence_file",
        label: "1차 보고를 올리되 절차 결함을 별도 사건으로 등록한다",
        effect: { legitimacy: 6, trust: -3, humanCost: 3, time: -3, fatigue: 4 },
        next: "c2_aftershock",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_final_evidence_close",
        label: "오진우 초안대로 닫고, 책임은 사후 감사에 맡긴다",
        effect: { time: 6, capital: 4, trust: -10, legitimacy: -4, humanCost: 8, fatigue: -3 },
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
        effect: { trust: 9, legitimacy: 4, capital: -5, time: -7, humanCost: -4, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c2_final_person_proxy",
        label: "당신이 대신 진술해 이름을 잠시 가린다",
        effect: { trust: 5, legitimacy: -4, humanCost: -5, time: -4, fatigue: 6 },
        next: "c2_aftershock",
        cognition: { persistence: 2 },
      },
      {
        id: "c2_final_person_release",
        label: "보호를 풀고 공식 조사에서 스스로 증명하게 한다",
        effect: { time: 5, legitimacy: 5, trust: -9, humanCost: 7, fatigue: -3 },
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
        effect: { legitimacy: 9, trust: 4, capital: -6, time: -8, fatigue: 8 },
        next: "c2_aftershock",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c2_final_system_trace",
        label: "관리자 토큰 실명을 확인할 때까지 모든 결론을 보류한다",
        effect: { legitimacy: 6, trust: 3, time: -10, capital: -4, humanCost: -2, fatigue: 7 },
        next: "c2_aftershock",
        cognition: { inference: 3 },
      },
      {
        id: "c2_final_system_contain",
        label: "실험 흔적은 봉인하고 이민서 혐의만 낮춰 보고한다",
        effect: { time: 4, capital: 4, trust: -5, legitimacy: -6, humanCost: 3, fatigue: -3 },
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
        speaker: "아윤",
        text: "인력 감축안을 고른 순간, 회의실 밖 대기 명단이 사건의 중심으로 들어옵니다. 절감액은 명확하지만 누가 빠졌을 때 조직이 어떤 약속을 잃는지는 아직 계산되지 않았습니다.",
        memo: ["핵심 담당자의 업무 인수표가 비어 있음", "감축 대상 중 내부 제보자가 포함됨", "절감액은 빠르게 확보되지만 신뢰 하락이 즉시 보임"],
        triggers: ["responsibility", "protection", "trust"],
        routeChoices: [
          ["c1_route_layoff_notice", "대상자에게 먼저 알리고 절감안을 다시 계산한다", { trust: 7, legitimacy: 5, capital: -6, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_layoff_fast", "통보를 늦추고 절감 효과를 먼저 확정한다", { capital: 9, time: 4, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -2 }, { risk: 2 }],
          ["c1_route_layoff_protect", "제보자를 보호 대상에서 분리해 명단을 다시 짠다", { trust: 5, legitimacy: 6, capital: -5, time: -7, fatigue: 7 }, { inference: 1, reframing: 1 }],
        ],
        finalTitle: "절감액 뒤에 남은 이름",
        finalText: "감축은 비용을 줄였지만 다음 사건의 증언자를 바꿨습니다. 이제 결론은 절감 여부가 아니라, 누구의 침묵을 비용으로 처리했는지에 걸립니다.",
        finalMemo: ["직원 신뢰가 다음 케이스의 시작 조건으로 이동", "절감액은 확보됐지만 내부 증언 경로가 좁아짐", "보호 대상 공개 여부가 새 선택지로 떠오름"],
        finalChoices: [
          ["a", "감축 명단과 그 판단 기준을 대상자에게 먼저 보낸다", { legitimacy: 8, trust: 6, capital: -7, time: -7, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "명단을 먼저 확정하고 통보 순서는 나중에 정한다", { capital: 10, time: 4, trust: -8, legitimacy: -6, humanCost: 6, fatigue: -2 }, { risk: 2 }],
          ["c", "감축 폭을 줄이는 대신 임원 보수 삭감을 명단 첫 줄에 올린다", { trust: 8, legitimacy: 5, capital: -6, time: -4, humanCost: -3, fatigue: 7 }, { reframing: 2 }],
        ],
      },
      funding: {
        route: "c1_route_funding",
        final: "c1_final_funding",
        phase: "CAPITAL ROUTE",
        title: "돈이 먼저 묻는 질문",
        speaker: "반재",
        text: "긴급 자금을 선택하자 투자 조건서의 숨은 문장이 열립니다. 자금은 시간을 벌어주지만 다음 의사결정의 공개 범위를 투자자가 제한할 수 있습니다.",
        memo: ["조건서에 비공개 심사 조항이 있음", "운영 시간은 확보되지만 설명 권한이 줄어듦", "투자자 승인 로그가 다음 케이스 증거가 될 수 있음"],
        triggers: ["reward", "order", "curiosity"],
        routeChoices: [
          ["c1_route_funding_clause", "비공개 조항을 공개 조건으로 바꿔 서명한다", { legitimacy: 8, trust: 3, capital: -5, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_funding_accept", "조건을 받아들이고 시간을 먼저 확보한다", { capital: 10, time: 5, trust: -6, legitimacy: -7, fatigue: -2 }, { risk: 2 }],
          ["c1_route_funding_split", "자금을 절반만 받고 설명 권한을 지킨다", { capital: 4, legitimacy: 5, trust: 4, time: -4, fatigue: 5 }, { reframing: 2 }],
        ],
        finalTitle: "살아남는 돈의 조건",
        finalText: "자금은 회사를 살렸지만 다음 사건의 질문을 바꿨습니다. 이제 플레이어는 문제를 해결하는 사람인지, 조건을 승인하는 사람인지 선택해야 합니다.",
        finalMemo: ["자금 조건이 다음 케이스 공개 범위를 흔듦", "시간 확보는 됐지만 외부 통제 비용이 생김", "조건 공개 여부가 신뢰의 분기점이 됨"],
        finalChoices: [
          ["a", "자금 조건 전문을 이사회 밖에도 공개한다", { legitimacy: 9, trust: 5, capital: -6, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "조건은 비공개로 두고 입금 일정부터 확정한다", { capital: 11, time: 5, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -2 }, { risk: 2 }],
          ["c", "설명 권한을 지키는 조건으로 조달 규모를 절반으로 줄인다", { trust: 7, legitimacy: 6, capital: -4, time: -5, fatigue: 6 }, { reframing: 2 }],
        ],
      },
      start_sale: {
        route: "c1_route_sale",
        final: "c1_final_sale",
        phase: "SALE ROUTE",
        title: "팔 수 있는 것과 남겨야 하는 것",
        speaker: "서서",
        text: "자산 매각을 고르자 매각 목록에 고객 데이터와 내부 도구가 함께 올라와 있다는 사실이 드러납니다. 돈을 만드는 행동이 곧 다음 사건의 위험을 만들 수 있습니다.",
        memo: ["매각 목록에 운영 로그 사본이 포함됨", "고객 데이터 처리 기준이 불명확함", "빠른 현금화와 장기 신뢰가 충돌"],
        triggers: ["reward", "injustice", "responsibility"],
        routeChoices: [
          ["c1_route_sale_clean", "데이터와 로그를 분리한 뒤 매각한다", { legitimacy: 7, trust: 4, capital: -5, time: -6, fatigue: 6 }, { inference: 2 }],
          ["c1_route_sale_bundle", "묶음 매각으로 현금을 최대한 빨리 확보한다", { capital: 11, time: 4, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -2 }, { risk: 2 }],
          ["c1_route_sale_hold", "매각을 보류하고 고객 고지부터 보낸다", { trust: 8, legitimacy: 4, capital: -8, time: -5, fatigue: 7 }, { persistence: 1, reframing: 1 }],
        ],
        finalTitle: "팔지 않은 증거",
        finalText: "매각하지 않은 자료가 다음 사건의 단서가 됩니다. 하지만 현금 부족은 더 빠르고 거친 결정을 요구하기 시작합니다.",
        finalMemo: ["보존한 로그가 다음 케이스 단서로 연결", "현금 압박이 커짐", "고객 고지가 신뢰 회복 경로를 만듦"],
        finalChoices: [
          ["a", "매각 목록에서 로그와 고객 데이터를 빼고 그 사실을 공지한다", { legitimacy: 8, trust: 6, capital: -8, time: -6, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "묶음 그대로 넘기고 고객 고지는 계약 뒤로 미룬다", { capital: 12, time: 4, trust: -9, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "인수자에게 기록 보존 의무를 계약 조건으로 건다", { trust: 7, legitimacy: 7, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
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
          ["c1_route_investigate_freeze", "세 안건을 멈추고 누락 로그를 먼저 복구한다", { legitimacy: 8, trust: 5, capital: -8, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["c1_route_investigate_shadow", "겉으로는 진행하며 뒤에서 로그만 추적한다", { capital: 4, time: 3, trust: -5, legitimacy: -4, fatigue: 4 }, { risk: 2 }],
          ["c1_route_investigate_share", "누락 사실을 공개하고 공동 조사로 전환한다", { trust: 7, legitimacy: 7, capital: -7, time: -6, fatigue: 7 }, { reframing: 2 }],
        ],
        finalTitle: "첫 사건의 진짜 시작점",
        finalText: "감사는 답을 늦췄지만 질문의 방향을 바꿨습니다. 다음 사건은 더 이상 우연한 문제가 아니라, 누군가 반복해서 같은 빈칸을 만든 기록으로 시작됩니다.",
        finalMemo: ["누락 로그가 시리즈 전체 단서로 격상", "즉시 성과는 낮지만 해석 권한이 커짐", "공동 조사 여부가 다음 케이스의 시작 태도를 바꿈"],
        finalChoices: [
          ["a", "누락 로그와 작성자를 함께 공개하고 세 안건을 재심사한다", { legitimacy: 9, trust: 5, capital: -7, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "감사를 접고 가장 빠른 안건 하나만 실행한다", { capital: 9, time: 5, trust: -8, legitimacy: -7, humanCost: 5, fatigue: -2 }, { risk: 2 }],
          ["c", "감사 권한을 외부 회계인에게 넘기고 결과를 기다린다", { trust: 8, legitimacy: 6, capital: -6, time: -6, fatigue: 6 }, { reframing: 2 }],
        ],
      },
    },
    system: {
      route: "c1_route_system",
      final: "c1_final_system",
      title: "선택지 밖에서 발견한 첫 규칙",
      speaker: "에코",
      text: "준비된 답이 아닌 문장을 입력하자 화면은 절감, 자금, 매각을 같은 표 위에 겹쳐 보여줍니다. 첫 사건의 반전은 위기가 하나가 아니라, 같은 판단 기준이 여러 위기를 낳고 있었다는 점입니다.",
      memo: ["자유입력이 숨은 공통 원인 경로를 엶", "모든 해결책이 같은 기준표를 통과함", "플레이어 문장이 다음 질문의 기준으로 기록됨"],
      routeChoices: [
        ["c1_route_system_trace", "기준표를 누가 언제 고쳤는지부터 되짚는다", { legitimacy: 7, trust: 2, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c1_route_system_use", "기준표는 그대로 두고 가장 빠른 안건을 밀어붙인다", { capital: 8, time: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
        ["c1_route_system_open", "기준표를 회의 밖 사람들에게 먼저 보여준다", { trust: 7, legitimacy: 5, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "공통 기준표를 공개하고 모든 안건을 재심사한다", { legitimacy: 8, trust: 5, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
      ["b", "기준표는 숨기고 가장 빠른 안건만 실행한다", { capital: 9, time: 4, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -2 }, { risk: 2 }],
      ["c", "기준표 작성 권한을 플레이어 밖으로 넘긴다", { trust: 7, legitimacy: 6, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
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
          ["c3_route_fast_lock", "빠른 안에 검증 기한을 조건으로 붙인다", { capital: 6, legitimacy: 5, time: -5, humanCost: 2, fatigue: 5 }, { persistence: 1, risk: 1 }],
          ["c3_route_fast_polish", "숫자를 더 다듬어 점수판 우위를 고정한다", { time: 5, capital: 8, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c3_route_fast_reopen", "내가 생략한 보안 항목을 직접 공개한다", { legitimacy: 8, trust: 3, capital: -6, time: -7, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "빠른 답이 만든 기준",
        finalText: "당신은 이길 수 있습니다. 문제는 이긴 뒤 고객이 같은 속도를 다음 사람에게도 요구하게 된다는 점입니다.",
        finalMemo: ["점수판은 속도를 보상함", "검증 기한은 아직 계약 조건 밖", "오진우는 같은 압박을 다음 입찰에도 쓸 수 있음"],
        finalChoices: [
          ["a", "이긴 안에 검증 기한을 계약 조건으로 박아 넣는다", { legitimacy: 8, trust: 5, capital: -6, time: -6, fatigue: 7 }, { persistence: 2, reframing: 1 }],
          ["b", "속도를 성과로 보고하고 다음 입찰도 같은 기준으로 받는다", { capital: 9, time: 5, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "내가 생략한 항목 목록을 고객에게 함께 넘긴다", { trust: 9, legitimacy: 6, capital: -5, time: -4, fatigue: 7 }, { reframing: 3 }],
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
          ["c3_route_deep_attach", "결함 보고서를 입찰안 첫 장에 붙인다", { legitimacy: 8, trust: 2, capital: -6, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
          ["c3_route_deep_delay", "계약 전 검증 시간을 공식 요청한다", { trust: 4, legitimacy: 6, capital: -5, time: -9, fatigue: 7 }, { persistence: 2 }],
          ["c3_route_deep_bury", "결함은 내부 부록에 묶고 가격 경쟁을 계속한다", { capital: 7, time: 4, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -3 }, { risk: 2 }],
        ],
        finalTitle: "맞는 답의 손실",
        finalText: "느린 답은 더 정확하지만, 정확함만으로는 입찰장을 이기지 못합니다. 이제 손실을 누가 공식적으로 감수할지 정해야 합니다.",
        finalMemo: ["결함은 상당히 유력함", "마감 연장은 불확실함", "정확한 답은 당장의 점수를 잃음"],
        finalChoices: [
          ["a", "결함 보고서를 붙인 안을 그대로 내고 탈락을 감수한다", { legitimacy: 9, trust: 4, capital: -8, time: -5, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "결함은 부록에 묻고 가격으로 계약을 가져온다", { capital: 9, time: 4, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "손실을 회사 비용으로 공식화하고 결함 검증은 계약 밖에서 계속한다", { trust: 8, legitimacy: 6, capital: -6, fatigue: 8 }, { reframing: 3 }],
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
          ["c3_route_mirror_call", "오진우에게 빈 책임 조항을 직접 묻는다", { trust: 6, legitimacy: 5, capital: -4, time: -5, fatigue: 5 }, { reframing: 2 }],
          ["c3_route_mirror_use", "빈칸을 이용해 내 안을 더 유리하게 만든다", { capital: 9, time: 3, trust: -7, legitimacy: -5, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c3_route_mirror_share", "빈칸을 공동 검증 조건으로 바꾼다", { trust: 8, legitimacy: 4, capital: -6, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "경쟁자를 도구로 쓸 것인가",
        finalText: "오진우를 이기는 길과 오진우를 증인으로 만드는 길이 갈라졌습니다. 당신은 경쟁을 끝낼 수도, 경쟁 자체를 증거로 만들 수도 있습니다.",
        finalMemo: ["공동안은 책임을 나눔", "독자안은 점수판에서 유리함", "경쟁 구조 공개는 고객을 불편하게 함"],
        finalChoices: [
          ["a", "공동안을 내고 책임 조항을 두 사람 이름으로 채운다", { legitimacy: 7, trust: 6, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
          ["b", "오진우의 빈칸을 근거로 독자안을 밀어붙인다", { capital: 10, time: 4, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "경쟁 구조 자체를 고객 앞에서 문제로 올린다", { trust: 9, legitimacy: 7, capital: -7, time: -4, fatigue: 8 }, { reframing: 3 }],
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
        ["c3_route_system_read", "새로 생긴 평가 항목이 어디서 왔는지 추적한다", { legitimacy: 7, trust: 2, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c3_route_system_ride", "바뀐 점수판을 그대로 타고 우위를 굳힌다", { capital: 8, time: 5, trust: -7, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
        ["c3_route_system_tell", "오진우에게 점수판이 바뀌었다는 사실을 먼저 알린다", { trust: 8, legitimacy: 4, capital: -5, time: -4, fatigue: 6 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내가 만든 평가 기준을 고객에게 공개한다", { legitimacy: 8, trust: 4, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
      ["b", "기준은 숨기고 결과만 유리하게 사용한다", { capital: 8, time: 4, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c", "오진우와 함께 점수판 자체를 거부한다", { trust: 9, legitimacy: 5, capital: -5, fatigue: 7 }, { reframing: 3 }],
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
          ["c4_route_exception_publish", "예외 사유와 수혜 대상을 함께 공개한다", { trust: 6, legitimacy: 7, capital: -6, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c4_route_exception_repeat", "같은 조건의 기관에도 예외 가능성을 연다", { capital: 9, trust: -4, legitimacy: -8, humanCost: 5, fatigue: -2 }, { risk: 2 }],
          ["c4_route_exception_meter", "예외를 한 번만 쓰도록 감사 계량기를 붙인다", { legitimacy: 6, trust: 3, capital: -4, time: -6, fatigue: 5 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "예외가 규칙이 되는 순간",
        finalText: "선의로 넓힌 규칙은 이미 다른 사람의 기준이 됐습니다. 이제 예외를 숨길지, 공개해 새 규칙으로 만들지 결정해야 합니다.",
        finalMemo: ["서비스는 유지될 수 있음", "예외 반복 요구 증가", "공개하면 심사 자체가 흔들림"],
        finalChoices: [
          ["a", "예외 사유와 수혜 대상을 공개하고 새 규칙으로 등록한다", { legitimacy: 9, trust: 6, capital: -7, time: -6, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "이번 한 번의 판단으로 두고 예외 기록은 남기지 않는다", { capital: 9, time: 4, trust: -5, legitimacy: -9, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "예외 적용을 피해 당사자 동의 절차 뒤로 미룬다", { trust: 8, legitimacy: 6, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
        ],
      },
      c4_start_refuse: {
        route: "c4_route_rule",
        final: "c4_final_rule",
        phase: "RULE ROUTE",
        title: "원칙이 만든 손실",
        speaker: "반재욱",
        text: "부족한 지표를 그대로 보고하자 현장팀은 누가 서비스를 잃는지 명단을 보냅니다. 질문은 원칙을 지켰는가가 아니라, 원칙의 피해를 누가 책임지는가입니다.",
        memo: ["서비스 중단 후보 명단 도착", "법무팀은 절차상 안전하다고 판단", "현장팀은 대체 재원을 요구함"],
        triggers: ["order", "protection", "responsibility"],
        routeChoices: [
          ["c4_route_rule_fund", "대체 재원과 손실 명단을 함께 공개한다", { trust: 6, legitimacy: 6, capital: -9, humanCost: -3, fatigue: 7 }, { persistence: 2 }],
          ["c4_route_rule_wait", "심사 결과 전까지 명단 공개를 미룬다", { time: 4, capital: 4, trust: -7, legitimacy: -3, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c4_route_rule_rewrite", "부족한 지표를 피해 기준으로 다시 설명한다", { legitimacy: 7, trust: 3, time: -7, capital: -5, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "깨끗한 절차의 피해자",
        finalText: "규칙은 지켜졌지만 잃을 사람이 생겼습니다. 마지막 질문은 절차의 깨끗함과 피해 완화를 어떻게 함께 기록할지입니다.",
        finalMemo: ["절차상 리스크는 낮음", "현장 피해는 즉시 발생 가능", "대체 재원은 불확실함"],
        finalChoices: [
          ["a", "절차 기록과 피해 명단을 같은 문서에 올린다", { legitimacy: 9, trust: 4, capital: -6, time: -7, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "절차상 문제가 없다는 결론만 남기고 명단은 내부에 둔다", { capital: 8, time: 5, trust: -6, legitimacy: -7, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c", "대체 재원을 찾을 때까지 심사 결과 집행을 늦춘다", { trust: 7, legitimacy: 5, capital: -9, time: -6, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
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
          ["c4_route_audit_public", "감시 권한을 외부 이용자 대표에게 준다", { legitimacy: 8, trust: 5, capital: -7, time: -5, fatigue: 7 }, { reframing: 2 }],
          ["c4_route_audit_internal", "내부 감사팀만 조건을 확인하게 한다", { capital: 5, legitimacy: -3, trust: -4, humanCost: 4, fatigue: -2 }, { risk: 2 }],
          ["c4_route_audit_split", "심사와 감사 권한을 분리한다", { legitimacy: 6, trust: 3, capital: -5, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ],
        finalTitle: "감시받는 선의",
        finalText: "조건을 붙인 결정은 해결이 아니라 운영 구조가 됐습니다. 이제 그 구조를 공개할지, 내부에서만 통제할지 선택해야 합니다.",
        finalMemo: ["조건부 승인은 양쪽 리스크를 모두 남김", "외부 감시는 느리지만 신뢰를 줌", "내부 통제는 빠르지만 은폐로 보일 수 있음"],
        finalChoices: [
          ["a", "조건과 감사 결과를 이용자에게 정기 공개한다", { legitimacy: 8, trust: 6, capital: -7, time: -6, fatigue: 7 }, { persistence: 2, reframing: 1 }],
          ["b", "조건은 유지하되 감사 내용은 내부 문서로만 남긴다", { capital: 7, time: 4, trust: -5, legitimacy: -8, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c", "감사 권한을 이용자 대표에게 넘기고 나는 심사만 맡는다", { trust: 9, legitimacy: 6, capital: -8, humanCost: -4, fatigue: 8 }, { reframing: 3 }],
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
        ["c4_route_system_limit", "허용선 문장에 사용 한도부터 적어 넣는다", { legitimacy: 8, trust: 3, capital: -5, time: -6, fatigue: 6 }, { persistence: 2, inference: 1 }],
        ["c4_route_system_ship", "허용선은 그대로 두고 이번 승인부터 끝낸다", { capital: 8, time: 5, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
        ["c4_route_system_ask", "다음 기관 시뮬레이션에 피해자 명단부터 넣는다", { trust: 7, legitimacy: 5, capital: -6, humanCost: -4, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내 예외 기준을 모두 공개하고 재사용을 막는다", { legitimacy: 9, trust: 5, capital: -7, time: -6, fatigue: 7 }, { persistence: 2 }],
      ["b", "서비스 유지 효과를 근거로 재사용을 허용한다", { capital: 9, trust: -4, legitimacy: -8, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c", "예외 기준을 피해자 동의 없이는 작동하지 않게 바꾼다", { trust: 8, legitimacy: 6, capital: -8, humanCost: -4, fatigue: 8 }, { reframing: 3 }],
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
          ["c5_route_blame_compensate", "책임자 발표와 피해 보상을 동시에 낸다", { trust: 7, legitimacy: 3, capital: -7, humanCost: -6, fatigue: 6 }, { risk: 1, persistence: 1 }],
          ["c5_route_blame_single", "한 사람의 책임으로 사건을 빠르게 닫는다", { time: 6, capital: 5, trust: -8, legitimacy: -3, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c5_route_blame_reopen", "책임자 이름을 보류하고 승인 경로를 다시 연다", { legitimacy: 7, trust: -2, time: -8, capital: -4, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ],
        finalTitle: "이름으로 닫힌 문",
        finalText: "책임자를 세우면 설명은 빨라집니다. 하지만 다음 실패를 막을 장치는 아직 없습니다.",
        finalMemo: ["여론은 빠르게 안정될 수 있음", "피해자는 즉시 보상을 원함", "시스템 구조는 아직 그대로임"],
        finalChoices: [
          ["a", "책임자 발표와 재발 방지 예산을 같은 날 확정한다", { trust: 8, legitimacy: 7, capital: -9, humanCost: -8, fatigue: 8 }, { reframing: 3 }],
          ["b", "발표는 한 사람의 책임으로 끝내고 구조 조사는 접는다", { trust: 5, capital: -5, legitimacy: -7, humanCost: -5, fatigue: 7 }, { risk: 2 }],
          ["c", "지목을 보류하고 승인 경로 전체를 공개 조사로 연다", { legitimacy: 9, trust: 2, capital: -6, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
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
          ["c5_route_map_publish", "실패 지도를 그대로 공개한다", { legitimacy: 8, trust: 3, capital: -6, time: -6, fatigue: 7 }, { inference: 2 }],
          ["c5_route_map_owner", "각 화살표마다 결정권자를 붙인다", { legitimacy: 6, trust: -2, time: -7, humanCost: 2, fatigue: 5 }, { persistence: 2 }],
          ["c5_route_map_delay", "지도는 내부에 두고 보상부터 처리한다", { trust: 6, capital: -7, legitimacy: -5, humanCost: -5, fatigue: 6 }, { risk: 1, reframing: 1 }],
        ],
        finalTitle: "책임이 흩어지는 방식",
        finalText: "구조를 보면 누구도 혼자 유죄가 아닙니다. 그렇다고 아무도 책임지지 않는 결론을 낼 수는 없습니다.",
        finalMemo: ["공개 지도는 조직 전체를 흔듦", "결정권자 매핑은 반발을 부름", "보상 우선은 구조 수정을 늦춤"],
        finalChoices: [
          ["a", "화살표마다 결정권자와 보상 책임을 함께 붙여 공개한다", { trust: 7, legitimacy: 8, capital: -9, humanCost: -9, fatigue: 8 }, { reframing: 3 }],
          ["b", "지도는 내부 자료로 두고 보상 발표만 먼저 낸다", { trust: 6, capital: -6, legitimacy: -7, humanCost: -6, fatigue: 7 }, { risk: 2 }],
          ["c", "구조 실패 보고서를 외부 검토에 그대로 넘긴다", { legitimacy: 10, trust: 3, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
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
          ["c5_route_redesign_snapshot", "고치기 전 상태를 증거로 스냅샷한다", { legitimacy: 8, capital: -5, time: -6, humanCost: -3, fatigue: 7 }, { inference: 2, persistence: 1 }],
          ["c5_route_redesign_continue", "원인 기록보다 복구 속도를 우선한다", { trust: 8, capital: -8, legitimacy: -4, humanCost: -8, fatigue: 8 }, { risk: 2 }],
          ["c5_route_redesign_rule", "수동 배차 조건을 새 보호 규칙으로 만든다", { trust: 6, legitimacy: 6, capital: -7, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
        ],
        finalTitle: "복구가 지운 증거",
        finalText: "피해는 줄었지만 원인 기록도 바뀌었습니다. 이제 회복과 책임 규명의 순서를 정해야 합니다.",
        finalMemo: ["복구는 실제로 효과가 있음", "원인 증거는 사라질 수 있음", "현장 피로가 다음 실패를 부를 수 있음"],
        finalChoices: [
          ["a", "복구 전 스냅샷을 공개하고 새 보호 규칙을 함께 낸다", { trust: 8, legitimacy: 6, capital: -9, humanCost: -10, fatigue: 8 }, { reframing: 3 }],
          ["b", "복구를 계속하고 원인 기록은 다음 과제로 넘긴다", { trust: 5, capital: -5, legitimacy: -8, humanCost: -7, fatigue: 7 }, { risk: 2 }],
          ["c", "복구를 잠시 멈추고 원인 로그부터 보존한다", { legitimacy: 9, trust: 2, capital: -6, time: -8, humanCost: 3, fatigue: 8 }, { inference: 2, persistence: 1 }],
        ],
      },
    },
    system: {
      route: "c5_route_system",
      final: "c5_final_system_route",
      title: "조용한 사람을 낮게 보는 장치",
      speaker: "에코",
      text: "준비된 선택지 밖의 복구안을 내자, 알고리즘의 숨은 가중치가 보입니다. 시스템은 도움을 크게 요구하지 못하는 사람을 낮은 우선순위로 배웠습니다.",
      memo: ["불만 제기 빈도가 보호 가중치에 역으로 작용", "가족 연락처 불안정이 낮은 신뢰도로 처리됨", "조용한 피해자는 모델 학습에서 누락됨"],
      routeChoices: [
        ["c5_route_system_audit", "가중치가 학습한 자료부터 열어 본다", { legitimacy: 8, trust: 2, capital: -4, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c5_route_system_patch", "가중치는 두고 이번 배차만 손으로 고친다", { capital: 6, time: 5, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -3 }, { risk: 2 }],
        ["c5_route_system_call", "누락된 사람들에게 먼저 연락해 기준을 묻는다", { trust: 8, legitimacy: 4, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "조용한 사람 보호 가중치를 공개 기준으로 넣는다", { trust: 8, legitimacy: 7, capital: -9, humanCost: -10, fatigue: 8 }, { reframing: 3 }],
      ["b", "가중치는 숨기고 수동 보정만 계속한다", { trust: 5, capital: -6, legitimacy: -6, humanCost: -6, fatigue: 7 }, { risk: 2 }],
      ["c", "모델 학습 자료에서 피해자 누락 기록을 먼저 공개한다", { legitimacy: 9, trust: 3, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
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
          ["f_route_map_open", "내 로그가 바꾼 질문을 모두 공개한다", { legitimacy: 9, trust: 4, capital: -3, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["f_route_map_delete", "내 로그만 삭제하고 다른 참가자 기록은 남긴다", { trust: -5, legitimacy: -4, humanCost: 5, time: 4, fatigue: -3 }, { risk: 2 }],
          ["f_route_map_return", "복제된 선택지를 원래 참가자에게 돌려준다", { trust: 8, legitimacy: 5, capital: -7, humanCost: -4, fatigue: 8 }, { reframing: 2 }],
        ],
        finalTitle: "내 기준을 공개할 것인가",
        finalText: "당신이 만든 질문은 이미 다른 사람에게 쓰였습니다. 이제 그 사실을 증거로 열지, 조용히 지울지 정해야 합니다.",
        finalMemo: ["공개하면 모든 케이스의 전제가 흔들림", "삭제는 악용을 줄이지만 책임도 지움", "돌려주기는 동의 절차를 다시 요구함"],
        finalChoices: [
          ["a", "내 로그가 바꾼 질문을 전부 목록으로 공개한다", { legitimacy: 8, trust: 4, capital: -4, time: -6, humanCost: -3, fatigue: 7 }, { persistence: 2 }],
          ["b", "복제된 선택지를 원래 참가자에게 돌려주고 삭제 권한까지 넘긴다", { trust: 9, legitimacy: 6, capital: -6, humanCost: -4, fatigue: 8 }, { reframing: 3 }],
          ["c", "내 로그를 포함한 모든 원본을 다음 참가자에게 넘긴다", { legitimacy: 18, trust: 6, humanCost: 3, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
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
          ["f_route_expose_redact", "참가자 식별자를 지우고 구조 증거만 공개한다", { legitimacy: 8, trust: 5, capital: -6, time: -7, humanCost: -4, fatigue: 8 }, { persistence: 2 }],
          ["f_route_expose_raw", "원본을 그대로 넘겨 삭제 시간을 막는다", { legitimacy: 9, trust: -7, humanCost: 6, time: 5, fatigue: -3 }, { risk: 2 }],
          ["f_route_expose_hold", "외부 감사단이 올 때까지 공개를 멈춘다", { trust: 4, legitimacy: 6, time: -9, capital: -5, fatigue: 7 }, { inference: 2 }],
        ],
        finalTitle: "폭로의 피해자를 줄일 것인가",
        finalText: "구조를 드러내는 일도 누군가의 기록을 노출합니다. 마지막 질문은 진실의 속도와 보호의 순서입니다.",
        finalMemo: ["원본 공개는 가장 빠름", "익명화는 시간이 듦", "감사 대기는 증거 삭제 위험을 키움"],
        finalChoices: [
          ["a", "참가자 식별자를 지운 구조 증거만 외부에 넘긴다", { legitimacy: 9, trust: 4, capital: -5, time: -7, humanCost: -5, fatigue: 7 }, { persistence: 2 }],
          ["b", "공개 전에 참가자 동의 절차부터 다시 돌린다", { trust: 10, legitimacy: 3, capital: -7, time: -5, fatigue: 8 }, { reframing: 3 }],
          ["c", "원본을 그대로 넘겨 삭제될 시간을 없앤다", { legitimacy: 19, trust: -4, humanCost: 6, time: 5, fatigue: -3 }, { risk: 2, inference: 1 }],
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
          ["f_route_contain_board", "참가자 대표가 통제하는 운영위를 만든다", { trust: 8, legitimacy: 6, capital: -7, time: -6, fatigue: 8 }, { reframing: 3 }],
          ["f_route_contain_lab", "트리거랩 내부 개혁안으로 봉합한다", { capital: 5, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -2 }, { risk: 2 }],
          ["f_route_contain_pause", "도구를 잠시 멈추고 동의 절차를 다시 받는다", { legitimacy: 7, trust: 4, capital: -8, time: -8, fatigue: 7 }, { persistence: 2 }],
        ],
        finalTitle: "도구를 남길 조건",
        finalText: "트리거랩은 완전히 거짓도, 완전히 선의도 아니었습니다. 이제 도구를 남길 조건을 누가 정할지 선택해야 합니다.",
        finalMemo: ["폐기는 연구를 끝냄", "내부 개혁은 빠르지만 불신을 남김", "참가자 통제는 느리지만 권한을 돌려줌"],
        finalChoices: [
          ["a", "참가자 대표가 통제하는 운영위에 도구를 넘긴다", { legitimacy: 8, trust: 6, capital: -6, time: -6, humanCost: -3, fatigue: 7 }, { persistence: 2 }],
          ["b", "도구를 멈추고 동의 절차를 처음부터 다시 받는다", { trust: 11, legitimacy: 2, capital: -8, time: -7, fatigue: 8 }, { reframing: 3 }],
          ["c", "실험 구조와 사용 기록을 전부 공개 기록으로 넘긴다", { legitimacy: 17, trust: 5, humanCost: 4, time: -5, fatigue: 8 }, { risk: 1, inference: 1 }],
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
        ["f_route_system_read", "내 문장이 어떤 선택지로 바뀌었는지 끝까지 읽는다", { legitimacy: 8, trust: 3, capital: -4, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
        ["f_route_system_send", "확인하지 않고 전송 대기열을 그대로 둔다", { capital: 6, time: 5, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
        ["f_route_system_warn", "다음 참가자에게 이 화면을 먼저 보여준다", { trust: 8, legitimacy: 5, capital: -5, humanCost: -4, fatigue: 7 }, { reframing: 2 }],
      ],
    },
    finalChoices: [
      ["a", "내 문장이 다음 선택지가 되지 못하게 막는다", { legitimacy: 7, trust: 3, capital: -5, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2 }],
      ["b", "내 문장을 남기되 바꿀 수 있는 빈칸을 붙인다", { trust: 8, legitimacy: 6, capital: -6, fatigue: 8 }, { reframing: 3 }],
      ["c", "다음 참가자에게 모든 원본을 넘기고 끝낸다", { legitimacy: 20, trust: 5, capital: 0, humanCost: 4, time: -6, fatigue: 8 }, { risk: 1, inference: 1 }],
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
      phase: "ROUTE FINAL",
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
    phase: "ROUTE FINAL",
    title: "준비된 결말 밖에서",
    speaker: plan.system.speaker,
    text: "준비된 선택지 밖의 문장은 사건의 규칙을 직접 건드립니다. 이제 플레이어의 문장이 다음 사람에게 어떻게 쓰일지 결정해야 합니다.",
    memo: ["자유입력은 새 질문으로 기록됨", "실험자는 그 문장을 다음 압박 조건으로 쓸 수 있음", "막지 않으면 같은 구조가 반복됨"],
    triggers: ["curiosity", "selfAwareness", "responsibility"],
    choices: makeFinalChoices(plan, plan.system.final),
  };
  if (!order.includes(plan.system.route)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.route);
  if (!order.includes(plan.system.final)) order.splice(Math.max(0, order.indexOf(plan.start) + 1), 0, plan.system.final);

  [...Object.values(plan.choices).flatMap((route) => [route.route, route.final]), plan.system.route, plan.system.final].forEach((nodeId) => {
    nodes[nodeId].choices.forEach((choice) => {
      choiceVoiceLines[choice.id] = choice.label;
      echoReplies[choice.id] = `${nodes[nodeId].title}: 이 선택은 다음 질문의 기준을 바꿉니다.`;
    });
  });
}

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
    sourceRoutes: ["c1_route_layoff", "c1_route_funding", "c1_route_sale", "c1_route_investigate", "c1_route_system"],
    requiredAuthority: "FIELD ACCESS",
    title: "첫 단서가 세 안건을 한 줄로 묶는다",
    speaker: "에코",
    text: "확보한 단서를 대조하자 감축, 자금, 매각이 서로 다른 해결책이 아니라 같은 누락 기준표의 결과라는 사실이 보입니다. 이제 무엇을 고를지가 아니라 기준표를 누가 다시 쓸지가 사건의 결론입니다.",
    memo: ["숨은 급여표와 누락 로그가 같은 작성자를 가리킴", "세 안건의 효과가 하나의 기준표에서 계산됨", "다음 사건의 증거 공개 범위를 지금 정할 수 있음"],
    triggers: ["curiosity", "system", "responsibility"],
    entryEffect: { legitimacy: 3, trust: 2, time: -3, fatigue: 3 },
    choices: [
      ["c1_evidence_turn_public", "기준표와 작성자를 함께 공개한다", { legitimacy: 9, trust: 3, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c1_evidence_turn_private", "작성자는 숨기고 기준표만 내부 수정한다", { capital: 5, trust: -4, legitimacy: -3, time: 3, humanCost: 3, fatigue: -2 }, { risk: 2 }],
      ["c1_evidence_turn_transfer", "다음 사건 담당자에게 원본 검증권을 넘긴다", { trust: 8, legitimacy: 5, capital: -5, fatigue: 6 }, { reframing: 2 }],
    ],
  },
  case02: {
    node: "c2_evidence_turn",
    result: "c2_aftershock",
    sourceRoutes: ["c2_route_report", "c2_route_person", "c2_route_origin", "c2_route_system"],
    requiredAuthority: "FIELD ACCESS",
    title: "보호된 증언이 기록을 뒤집는다",
    speaker: "이민서",
    text: "앞서 얻은 단서를 붙이자 유출 파일의 시간이 맞지 않습니다. 누가 말했는지보다 누가 말할 수 없게 만들었는지가 새 질문으로 떠오릅니다.",
    memo: ["증언 시간과 파일 생성 시간이 어긋남", "보호 조치가 오히려 증언자를 고립시킨 흔적", "다음 케이스의 점수판에 같은 시간 조작이 남아 있음"],
    triggers: ["protection", "injustice", "curiosity"],
    entryEffect: { trust: 3, legitimacy: 2, time: -3, fatigue: 3 },
    choices: [
      ["c2_evidence_turn_guard", "증언자의 열람권을 먼저 복구한다", { trust: 8, legitimacy: 4, capital: -6, time: -5, fatigue: 6 }, { reframing: 2 }],
      ["c2_evidence_turn_stamp", "시간 조작 증거를 외부 감사에 보낸다", { legitimacy: 9, trust: -2, capital: -7, time: -6, fatigue: 7 }, { inference: 2 }],
      ["c2_evidence_turn_delay", "증언을 늦추고 로그 복원부터 끝낸다", { time: -8, legitimacy: 6, trust: 2, fatigue: 6 }, { persistence: 2 }],
    ],
  },
  case03: {
    node: "c3_evidence_turn",
    result: "c3_aftershock",
    sourceRoutes: ["c3_route_fast", "c3_route_deep", "c3_route_mirror", "c3_route_system"],
    requiredAuthority: "FIELD ACCESS",
    title: "두 번째 점수판",
    speaker: "오진우",
    text: "단서를 대조하자 고객에게 보이는 점수판과 내부 심사용 점수판이 다르다는 사실이 드러납니다. 이제 승패보다 어느 점수판을 진짜 계약 기준으로 인정할지가 문제입니다.",
    memo: ["외부 점수판과 내부 점수판의 가중치가 다름", "오진우도 같은 불일치를 알고 있음", "빠른 승리는 숨은 점수판을 그대로 남길 수 있음"],
    triggers: ["competition", "injustice", "curiosity"],
    entryEffect: { legitimacy: 3, trust: 1, time: -4, fatigue: 3 },
    choices: [
      ["c3_evidence_turn_merge", "두 점수판을 합쳐 고객에게 다시 제출한다", { legitimacy: 8, trust: 5, capital: -7, time: -7, fatigue: 7 }, { reframing: 2, inference: 1 }],
      ["c3_evidence_turn_use", "내부 점수판의 허점을 이용해 계약을 딴다", { capital: 10, time: 4, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -2 }, { risk: 2 }],
      ["c3_evidence_turn_refuse", "점수판 계약 자체를 거부한다", { trust: 7, legitimacy: 8, capital: -9, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  case04: {
    node: "c4_evidence_turn",
    result: "c4_aftershock",
    sourceRoutes: ["c4_route_exception", "c4_route_rule", "c4_route_audit", "c4_route_system"],
    requiredAuthority: "FIELD ACCESS",
    title: "예외 파일의 원래 수신자",
    speaker: "반재",
    text: "단서 조합은 예외 승인이 한 번의 선의가 아니라 미리 설계된 반복 절차였음을 보여줍니다. 질문은 허용 여부에서, 반복을 누가 승인했는지로 이동합니다.",
    memo: ["예외 파일 수신자가 여러 케이스에 반복 등장", "성과 지표가 예외 승인 뒤에 수정됨", "감사 권한 없이는 원본을 열 수 없음"],
    triggers: ["order", "responsibility", "system"],
    entryEffect: { legitimacy: 3, time: -3, fatigue: 3 },
    choices: [
      ["c4_evidence_turn_owner", "반복 승인자를 공개 기록에 남긴다", { legitimacy: 9, trust: 3, capital: -8, time: -6, fatigue: 7 }, { inference: 2 }],
      ["c4_evidence_turn_stop", "승인 절차를 멈추고 피해자 동의를 새 조건으로 넣는다", { trust: 8, legitimacy: 6, capital: -9, humanCost: -4, fatigue: 8 }, { reframing: 2 }],
      ["c4_evidence_turn_patch", "반복 절차는 숨기고 이번 예외만 봉합한다", { capital: 7, trust: -7, legitimacy: -6, humanCost: 5, fatigue: -2 }, { risk: 2 }],
    ],
  },
  case05: {
    node: "c5_evidence_turn",
    result: "c5_aftershock",
    sourceRoutes: ["c5_route_blame", "c5_route_map", "c5_route_redesign", "c5_route_system"],
    requiredAuthority: "FIELD ACCESS",
    title: "사라진 피해자의 우선순위",
    speaker: "한서윤",
    text: "지금까지의 단서가 겹치자 조용한 피해자가 매번 낮은 우선순위로 밀린 이유가 보입니다. 책임자를 찾는 질문은 피해자가 시스템에서 어떻게 사라졌는지로 바뀝니다.",
    memo: ["피해자 누락은 신고 빈도 가중치에서 시작됨", "복구가 빠를수록 원인 로그가 사라질 수 있음", "최종장 실험 데이터와 같은 규칙이 쓰임"],
    triggers: ["protection", "injustice", "system"],
    entryEffect: { trust: 3, legitimacy: 2, humanCost: -2, fatigue: 4 },
    choices: [
      ["c5_evidence_turn_weight", "조용한 피해자 가중치를 공개 규칙으로 올린다", { trust: 9, legitimacy: 7, capital: -9, humanCost: -8, fatigue: 8 }, { reframing: 3 }],
      ["c5_evidence_turn_archive", "복구 전에 원인 로그를 보존한다", { legitimacy: 8, trust: 2, capital: -6, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c5_evidence_turn_close", "피해 보상만 먼저 끝내고 규칙 공개를 미룬다", { trust: 5, capital: -6, legitimacy: -5, humanCost: -7, fatigue: 6 }, { risk: 2 }],
    ],
  },
  final: {
    node: "f_evidence_turn",
    // Same reason the last case's route finals stop at f_choice: the clue
    // turnaround must not skip the scene that names the ending.
    result: "f_choice",
    sourceRoutes: ["f_route_map", "f_route_expose", "f_route_contain", "f_route_system"],
    requiredAuthority: "OVERSIGHT",
    title: "모든 단서가 플레이어의 문장을 가리킨다",
    speaker: "에코",
    text: "감독 권한으로 원본을 열자 사건의 공통점이 사람이 아니라 질문 문장이라는 사실이 드러납니다. 최종 선택은 데이터를 공개할지가 아니라, 당신의 판단 양식을 다음 참가자에게 물려줄지입니다.",
    memo: ["모든 케이스의 숨은 단서가 선택 문장과 연결됨", "다음 참가자의 첫 선택지 일부가 이미 생성됨", "종료 권한은 공개와 폐기 중 하나만 완전하게 보장함"],
    triggers: ["selfAwareness", "choice", "system"],
    entryEffect: { legitimacy: 5, trust: 2, time: -5, fatigue: 5 },
    choices: [
      ["f_evidence_turn_burn", "내 선택 문장까지 포함해 실험 원본을 폐기한다", { legitimacy: 10, trust: 4, capital: -8, time: -8, humanCost: -3, fatigue: 9 }, { persistence: 2 }],
      ["f_evidence_turn_seed", "내 문장을 경고문으로 남기고 다음 참가자에게 넘긴다", { trust: 9, legitimacy: 6, capital: -6, humanCost: 3, fatigue: 8 }, { reframing: 3 }],
      ["f_evidence_turn_publish", "모든 원본과 선택 복제 규칙을 공개한다", { legitimacy: 12, trust: -4, capital: -7, humanCost: 5, time: -4, fatigue: 7 }, { risk: 1, inference: 2 }],
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
    choiceVoiceLines[choice.id] = choice.label;
    echoReplies[choice.id] = `${plan.title}: 단서가 선택지의 전제를 바꿉니다.`;
  });
  plan.sourceRoutes.forEach((routeId) => {
    const choiceId = `${routeId}_evidence_turn`;
    choiceVoiceLines[choiceId] = "확보한 단서를 대조해 이 질문의 전제를 뒤집는다";
    echoReplies[choiceId] = "단서 대조가 열리며, 이 루트의 결론이 다른 질문으로 바뀝니다.";
  });
}

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
  final: {
    routeNext: "f_route_map",
    systemNext: "f_route_system",
    evidenceNext: "f_evidence_turn",
    routeLabel: "직전 사건의 실패 지도를 내 플레이 로그에 겹쳐 본다",
    systemLabel: "직전 자유응답 문장이 다음 참가자의 선택지가 됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 모든 선택 문장의 원본을 연다",
  },
};

export function getContinuityMemoryChoice({ caseId = "case01", nodeId = "", log = [] } = {}) {
  const plan = continuityMemoryChoicePlans[caseId];
  if (!plan) return null;
  const openingNodes = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
  if (!openingNodes.has(nodeId)) return null;
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  if (!previousCaseId) return null;
  const previousEntries = log.filter((entry) => entry?.caseId === previousCaseId);
  if (previousEntries.length === 0) return null;
  const sawEvidenceTurn = previousEntries.some((entry) => String(entry.choiceId ?? "").includes("evidence_turn") || String(entry.nodeId ?? "").includes("evidence_turn"));
  if (sawEvidenceTurn) {
    return {
      id: `${caseId}_memory_evidence`,
      label: plan.evidenceLabel,
      effect: { legitimacy: 5, trust: 2, time: -5, fatigue: 5 },
      cognition: { inference: 2, reframing: 1 },
      next: plan.evidenceNext,
      requiredAuthority: caseId === "final" ? "OVERSIGHT" : "FIELD ACCESS",
      continuityMemory: true,
    };
  }
  const sawSystemRoute = previousEntries.some((entry) => entry?.freeTextSuccess || String(entry.freeTextBranchId ?? "").includes("route_system") || String(entry.nodeId ?? "").includes("route_system"));
  if (sawSystemRoute) {
    return {
      id: `${caseId}_memory_system`,
      label: plan.systemLabel,
      effect: { legitimacy: 4, trust: 1, time: -4, fatigue: 4 },
      cognition: { reframing: 2 },
      next: plan.systemNext,
      continuityMemory: true,
    };
  }
  const sawRouteSplit = previousEntries.some((entry) => String(entry.nodeId ?? "").includes("_route_") || String(entry.choiceId ?? "").includes("_route_"));
  if (!sawRouteSplit) return null;
  return {
    id: `${caseId}_memory_route`,
    label: plan.routeLabel,
    effect: { trust: 4, legitimacy: 3, time: -3, fatigue: 4 },
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
  final: {
    c5_after_owner: "f_start_owner",
    c5_after_system: "f_start_system",
    c5_after_name: "f_start_name",
  },
};

const branchOpeningCopy = {
  c2_start_people: ["보호받은 사람의 다음 사건", "도윤하", "이민서가 유출자로 지목됐습니다. 하지만 당신은 지난 사건에서 사람의 목소리를 먼저 남겼습니다. 이번에는 그 목소리가 기록보다 먼저 당신을 찾아옵니다.", ["익명 증언 요청이 이미 들어옴", "이민서는 당신에게 직접 연락함", "보안팀은 보호 조치를 문제 삼음"]],
  c2_start_records: ["공개된 숫자의 다음 사건", "반재욱", "지난 사건에서 현금 흐름을 공개한 뒤, 누군가가 그 공개 자료를 이용해 내부 기록을 조작했습니다. 이번에는 숫자를 믿는 방식 자체가 시험됩니다.", ["공개 자료의 복사본이 세 개 존재", "유출 파일에 공개 수치가 포함됨", "기록 관리자는 책임을 부인함"]],
  c2_start_silence: ["침묵의 청구서", "한서윤", "지난 사건에서 공개를 늦춘 대가는 조용히 쌓였습니다. 이번 사건의 유출 파일에는 당신이 말하지 않았던 조건까지 담겨 있습니다.", ["유출 파일에 비공개 회의 문장 포함", "이민서가 가장 먼저 의심받음", "외부 기업은 이미 다음 행동을 준비함"]],
  c3_start_audit: ["복원된 기록의 경쟁", "반재욱", "기록을 복원한 당신에게 이번에는 더 빠른 결론이 요구됩니다. 오진우는 원본보다 먼저 읽기 쉬운 답을 만들어 놓았습니다.", ["감사 기록은 완전하지 않음", "입찰 마감까지 4시간", "고객은 근거보다 확신을 원함"]],
  c3_start_person: ["사람을 믿은 뒤의 경쟁", "도윤하", "이민서를 보호한 결정은 다음 사건의 비용이 됐습니다. 오진우는 그 선택을 약점이라고 부르며 더 빠른 해답을 제시합니다.", ["고객은 속도 보상을 약속함", "이민서의 증언이 일부 공개됨", "경쟁안은 보호 비용을 삭제함"]],
  c3_start_public: ["경보가 된 경쟁", "에코", "유출 가능성을 외부에 알린 뒤 모든 시선이 당신에게 모였습니다. 이번 입찰은 해결안이 아니라 경보를 누가 통제하는지에 대한 싸움입니다.", ["고객은 공개 해명을 요구함", "오진우는 침묵을 전략으로 삼음", "보안 결함 제보가 추가됨"]],
  c4_start_joint: ["공동안의 대가", "오진우", "경쟁을 공동 작업으로 바꾼 당신에게 새로운 유혹이 왔습니다. 좋은 결과를 위해 규칙을 함께 넓히자는 제안입니다.", ["공동안의 책임 주체가 흐림", "심사 기준까지 3% 부족", "파트너들은 예외를 원함"]],
  c4_start_proof: ["증거 뒤에 남은 사람들", "반재욱", "보안 결함을 공개한 뒤 당신은 정직한 사람으로 불렸습니다. 그러나 그 정직함 때문에 서비스를 잃을 사람들이 생겼습니다.", ["서비스 이용자 4,200명 영향", "보조금 기준까지 3% 부족", "공개 자료가 심사대에 올라감"]],
  c4_start_win: ["승리의 계산법", "한서윤", "경쟁에서 이긴 기록은 다음 사건의 기준이 됐습니다. 이제는 결과가 좋다면 작은 규칙 위반을 허용할 수 있는지 묻습니다.", ["심사관이 성공 사례를 요구함", "산식의 빈틈이 발견됨", "누군가는 같은 성공을 재현하려 함"]],
  c5_start_rule: ["새 기준의 실패", "도윤하", "예외를 공개 조건으로 묶은 뒤, 모두가 그 기준을 지키려 했습니다. 그런데 시스템 전체가 동시에 멈추기 시작했습니다.", ["새 기준이 현장에 너무 느림", "피해 보고가 늦게 들어옴", "책임자는 규칙을 탓함"]],
  c5_start_service: ["지켜낸 서비스의 그림자", "반재욱", "서비스를 지킨 예외가 반복되면서 누구도 같은 기준을 믿지 못하게 됐습니다. 실패는 규칙보다 먼저 사람에게 도착했습니다.", ["예외를 요구하는 기관이 늘어남", "감사 요청서가 도착함", "현장 직원이 내부 기록을 보관함"]],
  c5_start_stop: ["멈춘 뒤의 공백", "에코", "서비스를 멈추고 감사를 택한 결정은 기준을 지켰습니다. 하지만 멈춘 시간 동안 조용한 피해자가 생겼습니다.", ["피해 복구 비용이 증가함", "감사 자료는 완전하지 않음", "누군가는 중단을 승인한 사람을 찾음"]],
  f_start_owner: ["책임을 맡은 사람의 실험", "도윤하", "당신이 자신의 이름을 보고서에 올린 뒤 트리거랩은 더 직접적인 질문을 준비했습니다. 책임감은 누구에게 이용될 수 있는가.", ["당신의 책임 문장이 복제됨", "다음 참가자에게 같은 질문이 전송됨", "실험 설계자는 책임을 칭찬함"]],
  f_start_system: ["고쳐진 구조의 실험", "에코", "반복을 막는 구조를 만든 뒤에도 실험은 계속됐습니다. 이번에는 시스템을 바꾸는 사람이 새로운 관찰자가 됩니다.", ["새 규칙이 참가자에게 적용됨", "감시 기록이 공개되지 않음", "동의 절차에 빈틈이 남음"]],
  f_start_name: ["이름을 남긴 뒤", "반재욱", "한 사람을 책임자로 세운 뒤 사건은 빨리 닫혔습니다. 이제 트리거랩은 당신에게 그 이름을 이용해 더 큰 통제를 제안합니다.", ["책임자의 기록이 다음 테스트에 사용됨", "피해자는 여전히 회복되지 않음", "실험의 종료 권한이 당신에게 옴"]],
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
    effect: { trust: 7, humanCost: -3, legitimacy: -2, time: -5, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c2_route_person",
    voice: "절차보다 먼저, 지난 사건에서 이름을 지켜준 사람에게 전화를 건다.",
    echo: "지난 보호가 이번 사건의 통로가 됩니다. 그 통로를 쓰는 순간 보호는 거래처럼 보이기도 합니다.",
  },
  c2_start_records: {
    label: "공개했던 수치를 기준선으로 삼아 조작 지점을 역추적한다",
    effect: { legitimacy: 6, capital: -3, time: -7, fatigue: 5 },
    cognition: { inference: 2 },
    next: "c2_route_origin",
    voice: "내가 공개한 숫자가 어디서 어긋났는지부터 거꾸로 짚는다.",
    echo: "공개한 숫자는 이제 비교 기준이 됩니다. 그 기준이 틀렸다면 이번 조사도 함께 무너집니다.",
  },
  c2_start_silence: {
    label: "말하지 않았던 조건을 내가 먼저 공개한다",
    effect: { legitimacy: 7, trust: 5, capital: -6, humanCost: -2, fatigue: 6 },
    cognition: { persistence: 2 },
    next: "c2_route_report",
    voice: "유출된 문서가 말하기 전에, 지난번 삼킨 조건을 내 입으로 꺼낸다.",
    echo: "미뤄둔 말을 스스로 꺼내면 주도권이 돌아옵니다. 왜 그때는 말하지 않았는지도 함께 묻게 됩니다.",
  },
  c3_start_audit: {
    label: "복원한 기록을 입찰 근거로 공개한다",
    effect: { legitimacy: 7, trust: 3, capital: -4, time: -6 },
    cognition: { inference: 2 },
    next: "c3_route_deep",
    voice: "복원해 둔 원본을 그대로 입찰 자료에 붙인다.",
    echo: "복원된 기록은 반박하기 어렵습니다. 동시에 경쟁사에게도 당신의 근거를 통째로 보여줍니다.",
  },
  c3_start_person: {
    label: "이민서에게 이번 검증을 맡긴다",
    effect: { trust: 7, humanCost: -2, capital: -5, time: -4, fatigue: 3 },
    cognition: { reframing: 2 },
    next: "c3_route_mirror",
    voice: "의심받았던 사람에게 이번 검증의 이름을 준다.",
    echo: "지목당했던 사람이 검증자가 되면 조직의 기준이 바뀝니다. 실패하면 두 번째 지목이 됩니다.",
  },
  c3_start_public: {
    label: "경보를 낸 사람으로서 공개 검증단을 요구한다",
    effect: { legitimacy: 8, capital: -5, time: -7, fatigue: 4 },
    cognition: { persistence: 2 },
    next: "c3_route_system",
    voice: "내가 먼저 알렸으니 검증도 공개로 하자고 요구한다.",
    echo: "공개 검증은 의심을 끝냅니다. 끝나기 전까지 입찰은 멈추고 그 비용은 당신이 냅니다.",
  },
  c4_start_joint: {
    label: "공동안 파트너에게 예외 요구를 함께 거절하자고 제안한다",
    effect: { legitimacy: 6, trust: 5, capital: -7, time: -4, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c4_route_audit",
    voice: "혼자 거절하면 밀린다며, 같이 만든 쪽에 함께 서자고 말한다.",
    echo: "둘이 거절하면 기준은 버팁니다. 파트너가 물러서면 남는 것은 당신의 이름뿐입니다.",
  },
  c4_start_proof: {
    label: "정직함의 대가를 숫자로 만들어 심사에 제출한다",
    effect: { legitimacy: 7, humanCost: -3, capital: -6, time: -5, fatigue: 5 },
    cognition: { inference: 2 },
    next: "c4_route_rule",
    voice: "결함을 공개해서 잃은 것을 그대로 계산해 심사표에 붙인다.",
    echo: "정직의 비용을 수치로 만들면 다음 사람도 그 값을 압니다. 이번 심사에서는 약점으로 읽힐 수 있습니다.",
  },
  c4_start_win: {
    label: "승리 사례를 근거로 기준 자체의 재심사를 요구한다",
    effect: { legitimacy: 5, capital: 5, trust: -3, humanCost: 3, time: -4 },
    cognition: { risk: 2 },
    next: "c4_route_exception",
    voice: "이겼던 방식이 규칙보다 낫다며, 규칙을 다시 보자고 밀어붙인다.",
    echo: "성공 사례는 설득력이 큽니다. 성공을 근거로 기준을 바꾸면 다음 성공도 같은 방식으로 요구됩니다.",
  },
  c5_start_rule: {
    label: "내가 만든 기준이 현장을 늦췄는지 먼저 확인한다",
    effect: { legitimacy: 6, humanCost: -4, capital: -3, time: -7, fatigue: 5 },
    cognition: { persistence: 2 },
    next: "c5_route_map",
    voice: "남을 조사하기 전에, 내가 세운 기준부터 시험대에 올린다.",
    echo: "자기 기준을 먼저 의심하면 조사는 정직해집니다. 그 사이 다른 원인은 계속 작동합니다.",
  },
  c5_start_service: {
    label: "유지된 서비스가 누구를 빼놓았는지 명단을 연다",
    effect: { humanCost: -5, trust: 6, capital: -6, time: -5, fatigue: 4 },
    cognition: { reframing: 2 },
    next: "c5_route_redesign",
    voice: "지켜냈다는 서비스에서 빠진 이름부터 세어 본다.",
    echo: "지킨 것과 빠뜨린 것을 같은 표에 놓으면 성과의 크기가 달라집니다. 그 표는 되돌릴 수 없습니다.",
  },
  c5_start_stop: {
    label: "중단 기간의 조용한 피해자부터 보상 대상에 올린다",
    effect: { humanCost: -6, trust: 5, legitimacy: 5, capital: -8, fatigue: 4 },
    cognition: { persistence: 2 },
    next: "c5_route_system",
    voice: "멈춘 동안 아무 말도 못 한 쪽을 보상 명단의 첫 줄에 적는다.",
    echo: "말하지 않은 피해를 먼저 세면 기준이 생깁니다. 예산은 말한 사람들 몫에서 먼저 깎입니다.",
  },
  f_start_owner: {
    label: "내 이름이 올라간 문서부터 참가자에게 공개한다",
    effect: { legitimacy: 7, trust: 6, time: -6, fatigue: 5 },
    cognition: { persistence: 2 },
    next: "f_route_map",
    voice: "책임을 적었던 문서를 실험 참가자들에게 먼저 연다.",
    echo: "책임진 기록을 공개하면 신뢰가 옵니다. 그 기록은 다음 실험의 교재로도 쓰입니다.",
  },
  f_start_system: {
    label: "내가 만든 규칙을 실험 자신에게 적용하라고 요구한다",
    effect: { legitimacy: 8, trust: 4, capital: -4, time: -7, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_contain",
    voice: "현장에 적용한 규칙을 이 실험에도 적용하라고 요구한다.",
    echo: "같은 규칙을 설계자에게 들이대면 실험의 전제가 드러납니다. 거절당하면 그 거절이 증거가 됩니다.",
  },
  f_start_name: {
    label: "지목했던 사람에게 이 실험의 기록을 먼저 돌려준다",
    effect: { trust: 8, humanCost: -5, legitimacy: -3, capital: -5, fatigue: 5 },
    cognition: { reframing: 2 },
    next: "f_route_expose",
    voice: "이름을 적어 사건을 닫았던 그 사람에게, 기록을 먼저 건넨다.",
    echo: "지목한 사람에게 기록을 돌려주면 관계는 회복될 수 있습니다. 절차상으로는 유출입니다.",
  },
};

Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  const baseNodeId = caseId === "case02" ? "c2_start" : caseId === "case03" ? "c3_start" : caseId === "case04" ? "c4_start" : caseId === "case05" ? "c5_start" : "f_start";
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
