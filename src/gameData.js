export { cognitionLabels, initialResources, triggerLabels } from "./gameConstants.js";
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
      { id: "c3_after_share", label: "두 안의 장점을 합쳐 고객에게 다시 제안한다", effect: { trust: 8, legitimacy: 5, fatigue: 7 }, next: "case03_result", cognition: { reframing: 2 } },
      { id: "c3_after_proof", label: "점수보다 보안 결함의 증거를 먼저 공개한다", effect: { capital: -8, legitimacy: 14, fatigue: 6 }, next: "case03_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c3_after_win", label: "승리를 확정하고 경쟁자의 허점을 이용한다", effect: { capital: 12, trust: -10, legitimacy: -8, fatigue: 3 }, next: "case03_result", cognition: { risk: 2 } },
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
      { id: "f_after_witness", label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다", effect: { legitimacy: 12, trust: 4, fatigue: 8 }, next: "final_result", cognition: { inference: 2, persistence: 1 } },
      { id: "f_after_control", label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다", effect: { trust: 10, legitimacy: 8, fatigue: 10 }, next: "final_result", cognition: { reframing: 3 } },
      { id: "f_after_burn", label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다", effect: { legitimacy: 6, trust: -6, fatigue: 5 }, next: "final_result", cognition: { risk: 2 } },
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
  ["c1_assembly", "payday", "competitor", "급여일 전의 약속", "도윤하", "급여일 아침을 버티려면 돈만 필요한 것이 아닙니다. 직원들은 회사가 무엇을 숨기고 있는지보다, 내일도 자신이 이곳에 있을지 알고 싶어 합니다.", ["야간조 대표가 공동 공지를 요구함", "협력사 세 곳이 같은 지급 기준을 요구함", "임원진은 개인 보수를 먼저 공개하길 꺼림"], ["직원 대표와 함께 공개 약속을 만든다", "지급 순서를 숫자로 고정한다", "임원진만 아는 임시 합의를 만든다"]],
  ["c1_bargain", "competitor", "board", "팔리지 않은 자리", "오진우", "북선로지스의 협상안에는 빈칸이 하나 있습니다. 인수하지 않을 사업부, 남겨질 직원, 협력사 중 누가 그 빈칸을 채울지 아무도 쓰지 않았습니다.", ["인수 조건에 책임 주체가 없음", "협력사는 매각보다 지급 보장을 원함", "오진우는 승률을 높이는 문장만 골라냄"], ["빈칸을 채운 뒤에만 협상한다", "가장 약한 쪽의 조건부터 반영한다", "빈칸을 남겨 빠르게 사인한다"]],
  ["c1_verdict", "board", "final", "판결이 아닌 선택", "에코", "모든 자료가 테이블 위에 올라왔지만 결론은 더 멀어졌습니다. 이제 당신의 선택은 회사를 설명하는 문장이 아니라, 누가 내일의 비용을 들 것인지 정하는 문장입니다.", ["직원·협력사·투자자의 요구가 동시에 도착함", "한쪽을 살리면 다른 쪽의 신뢰가 줄어듦", "반응 패턴이 다음 사건으로 전송될 예정"], ["가장 약한 사람의 손실부터 줄인다", "살아남을 돈을 먼저 확보한다", "결정의 책임과 근거를 모두 공개한다"]],
  ["c2_trace", "c2_logs", "c2_meeting", "사라진 11초", "반재욱", "접속 기록에는 11초의 빈틈이 있습니다. 누군가는 그 짧은 시간에 파일을 바꿀 수 있었고, 누군가는 그 빈틈을 일부러 남겼을 수 있습니다.", ["복사본에는 없는 원본의 흔적", "이민서 계정은 빈틈 직전에 사용됨", "보안팀은 빈틈을 단순 오류라고 주장함"], ["11초를 기술적으로 재현한다", "이민서에게 그 시간의 행동을 묻는다", "오류로 처리하고 보고 시간을 지킨다"]],
  ["c2_witness", "c2_meeting", "c2_pressure", "이민서의 침묵", "도윤하", "이민서는 자신을 변호하지 않습니다. 대신 파일을 받은 사람이 누군지보다, 왜 그 파일이 다음 테스트에 필요했는지부터 물어봅니다.", ["이민서는 CASE 01 보고서를 읽지 못함", "유출 파일에는 선택하지 않은 경로도 포함됨", "누군가 플레이어의 반응을 미리 분류함"], ["이민서의 안전을 먼저 확보한다", "파일의 이동 경로만 추적한다", "침묵을 의심 신호로 기록한다"]],
  ["c2_judgment", "c2_pressure", "c2_final", "보고서 밖의 사람", "한서윤", "보안팀은 결론을 요구하지만, 이민서의 동료들은 보고서에 없는 사실을 알고 있습니다. 공식 기록과 사람의 기억 중 하나만 고를 수는 없습니다.", ["동료 두 명이 익명 증언을 제출함", "1차 보고 마감까지 18분", "외부 기업은 유출 사실을 부인함"], ["익명 증언을 공식 부록으로 붙인다", "기록에 없는 정보는 보류한다", "외부 기업과 먼저 대면한다"]],
  ["c3_rival", "c3_split", "c3_score", "같은 자료, 다른 목적", "오진우", "오진우는 당신의 자료에 없는 숫자를 들고 왔습니다. 고객이 실제로 원하는 것은 비용 절감이 아니라 실패했을 때 책임질 사람이라는 사실입니다.", ["고객사는 책임 조항을 비공개로 요구함", "경쟁안은 책임을 하청사로 넘김", "보안팀은 발표에서 빠져 있음"], ["책임 조항을 앞에 세운다", "비용표부터 다시 계산한다", "오진우에게 없는 숫자의 출처를 묻는다"]],
  ["c3_signal", "c3_score", "c3_trap", "관객석의 신호", "에코", "발표장 뒤편의 불이 두 번 깜빡였습니다. 고객 신호인지 트리거랩의 시험인지 알 수 없지만, 오진우는 그 신호를 보고 답을 바꿉니다.", ["불빛은 보안 경고와 같은 주기임", "고객 대표는 신호를 부인함", "오진우의 응답 시간이 비정상적으로 짧아짐"], ["신호를 공개 질문으로 바꾼다", "발표를 멈추고 보안부터 확인한다", "상대보다 먼저 결론을 밀어붙인다"]],
  ["c3_verdict", "c3_trap", "c3_final", "승부의 끝에서", "한서윤", "당신은 이제 오진우보다 빠르거나 느린 사람이 아닙니다. 어떤 기준으로 승부를 끝낼지 정하는 사람입니다.", ["고객사는 오늘 안에 결론을 원함", "보안 결함은 아직 완전 증명 전", "공동 발표를 하면 책임은 나뉨"], ["검증을 끝낸 뒤 발표한다", "공동 책임으로 발표한다", "불확실성을 숨기고 승리를 확정한다"]],
  ["c4_audit", "c4_offer", "c4_leak", "3%의 주인", "반재욱", "부족한 3%는 단순한 숫자가 아니었습니다. 그 숫자를 계산한 사람과, 그 숫자를 기다리는 사람의 이름이 서로 달랐습니다.", ["산식에는 현장 업무가 빠져 있음", "심사 기준은 2년 전 자료에 고정됨", "서비스 이용자 대표가 발언을 요청함"], ["이용자 대표의 기준을 반영한다", "산식 변경 이력을 남긴다", "3%를 조용히 보정한다"]],
  ["c4_public", "c4_leak", "c4_vote", "기자가 기다리는 문장", "도윤하", "기자는 아직 기사를 쓰지 않았습니다. 다만 당신이 어떤 표현을 선택하는지에 따라 내일의 제목이 정해질 것이라고 말합니다.", ["제보 메일은 내부에서 시작됨", "온새는 서비스 중단을 막고 싶어 함", "심사관은 공개 설명을 요구함"], ["사실과 모르는 것을 함께 공개한다", "서비스 이용자 피해를 먼저 알린다", "기사에 나갈 표현을 최소화한다"]],
  ["c4_verdict", "c4_vote", "c4_final", "선의의 증거", "에코", "좋은 의도는 증거가 되지 않습니다. 하지만 좋은 결과만을 위해 규칙을 늘리면, 다음 사람은 그 규칙을 이용할 수 있습니다.", ["이사회는 오늘 결정을 요구함", "감사 자료는 공개 가능함", "서비스 이용자 4,200명이 결과를 기다림"], ["예외를 공개된 조건으로 묶는다", "규칙을 지키고 서비스를 포기한다", "결과가 좋다면 기록은 나중에 설명한다"]],
  ["c5_pattern", "c5_map", "c5_blame", "실패가 움직인 경로", "반재욱", "지도 위의 화살표가 한 사람에게 모이지 않습니다. 모든 화살표가 서로의 합리적인 선택을 통과해 같은 곳에 도착했습니다.", ["각 팀은 다른 팀의 정보를 보지 못함", "가장 먼저 위험을 말한 기록이 누락됨", "책임표에는 승인자만 남아 있음"], ["정보가 막힌 지점을 먼저 고친다", "승인자에게 책임을 집중한다", "피해가 큰 부서부터 보상한다"]],
  ["c5_voice", "c5_blame", "c5_collapse", "이름 없는 증언", "도윤하", "누군가가 회의실 밖에서 말합니다. 자신은 결정권자가 아니었지만, 실패를 가장 먼저 보았다고 합니다.", ["증언자는 기록에서 빠져 있음", "말하면 팀 전체가 조사받을 수 있음", "피해자들은 책임자 이름보다 회복을 요구함"], ["증언자를 보호하고 기록을 복원한다", "공식 책임자 발표를 먼저 한다", "보상안을 만들고 조사를 미룬다"]],
  ["c5_verdict", "c5_collapse", "c5_final", "책임의 모양", "한서윤", "실패를 설명하는 방법은 세 가지입니다. 사람을 지목하거나, 구조를 고치거나, 피해를 먼저 되돌리는 것. 어느 것도 공짜는 아닙니다.", ["개선 예산은 한정됨", "책임 발표를 기다리는 언론", "피해 복구팀이 즉시 출범할 수 있음"], ["내 결정부터 공개한다", "반복을 막는 구조에 투자한다", "피해 복구를 가장 먼저 시작한다"]],
  ["f_witness", "f_archive", "f_confront", "첫 번째 참가자", "도윤하", "보관소 안에는 당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그 사람은 자신의 반응이 다른 사람의 선택지를 만드는 데 쓰였다는 사실을 몰랐습니다.", ["이전 참가자의 동의 기록이 없음", "선택 문장이 다음 사건의 대사로 복제됨", "실험 설계자는 책임을 분산시킴"], ["이전 참가자에게 먼저 알린다", "복제된 문장을 모두 증거로 수집한다", "실험을 멈추기 위해 서버를 닫는다"]],
  ["f_dilemma", "f_confront", "f_choice", "끝내는 방법", "에코", "문을 닫으면 기록도 사라집니다. 문을 열어두면 더 많은 사람이 같은 압박을 받습니다. 당신은 이제 답이 아니라 종료 조건을 설계해야 합니다.", ["서버 종료 권한은 당신에게 있음", "외부 공개 전 백업이 생성됨", "참가자 동의 절차는 아직 바꿀 수 있음"], ["모든 참가자에게 사실을 알린다", "동의와 감시 규칙을 먼저 만든다", "실험 데이터를 전부 폐기한다"]],
];

const authoredSceneChoiceEffects = {
  c1_witness: [{ trust: 6, legitimacy: 2, fatigue: 5 }, { time: -5, legitimacy: 6, fatigue: 4 }, { capital: 4, trust: -6, fatigue: 2 }],
  c1_assembly: [{ trust: 5, humanCost: -2, fatigue: 5 }, { time: -6, legitimacy: 6, fatigue: 4 }, { capital: 6, trust: -7, fatigue: 2 }],
  c1_bargain: [{ trust: 6, legitimacy: 4, fatigue: 6 }, { capital: -5, legitimacy: 7, time: -4 }, { capital: 7, trust: -8, fatigue: 2 }],
  c1_verdict: [{ legitimacy: 7, trust: 4, fatigue: 5 }, { time: -5, capital: -3, legitimacy: 6 }, { capital: 6, trust: -6, fatigue: 2 }],
  c2_trace: [{ legitimacy: 7, time: -6, fatigue: 3 }, { trust: 6, time: -4, legitimacy: 2 }, { time: 5, legitimacy: -7, fatigue: 2 }],
  c2_witness: [{ trust: 7, humanCost: -3, fatigue: 5 }, { legitimacy: 6, time: -5, fatigue: 4 }, { capital: 5, trust: -8, fatigue: 2 }],
  c2_judgment: [{ legitimacy: 8, trust: 3, fatigue: 6 }, { time: -6, capital: -3, legitimacy: 5 }, { capital: 5, trust: -7, fatigue: 2 }],
  c3_rival: [{ trust: 6, legitimacy: 5, fatigue: 6 }, { capital: -4, time: -5, legitimacy: 7 }, { capital: 8, trust: -8, fatigue: 2 }],
  c3_signal: [{ legitimacy: 6, trust: 5, time: -5 }, { time: -8, capital: -3, legitimacy: 6 }, { capital: 8, trust: -7, fatigue: 3 }],
  c3_verdict: [{ legitimacy: 8, trust: 5, fatigue: 6 }, { time: -5, capital: -4, legitimacy: 7 }, { capital: 7, trust: -8, legitimacy: -3 }],
  c4_audit: [{ legitimacy: 7, trust: 4, time: -5 }, { capital: -6, legitimacy: 8, fatigue: 5 }, { capital: 7, trust: -7, fatigue: 2 }],
  c4_public: [{ legitimacy: 8, trust: 3, fatigue: 7 }, { capital: 6, legitimacy: -5, time: -4 }, { capital: 8, trust: -8, fatigue: 2 }],
  c4_verdict: [{ legitimacy: 8, trust: 5, fatigue: 6 }, { capital: -5, time: -6, legitimacy: 7 }, { capital: 7, trust: -8, legitimacy: -4 }],
  c5_pattern: [{ legitimacy: 7, trust: 4, time: -5 }, { humanCost: -4, legitimacy: 6, fatigue: 5 }, { capital: 6, trust: -8, fatigue: 2 }],
  c5_voice: [{ trust: 7, humanCost: -3, fatigue: 6 }, { legitimacy: 8, time: -5, fatigue: 5 }, { capital: 5, trust: -7, fatigue: 2 }],
  c5_verdict: [{ legitimacy: 8, trust: 5, humanCost: -3 }, { capital: -6, legitimacy: 8, fatigue: 6 }, { capital: 7, trust: -9, fatigue: 2 }],
  f_witness: [{ legitimacy: 8, trust: 5, time: -6 }, { time: -8, capital: -3, legitimacy: 7 }, { capital: 6, trust: -8, fatigue: 3 }],
  f_dilemma: [{ trust: 8, legitimacy: 6, fatigue: 7 }, { time: -6, capital: -4, legitimacy: 8 }, { capital: 8, trust: -9, fatigue: 2 }],
};

Object.assign(authoredSceneChoiceEffects, {
  accounting: authoredSceneChoiceEffects.c1_witness,
  payday: authoredSceneChoiceEffects.c1_assembly,
  competitor: authoredSceneChoiceEffects.c1_bargain,
  board: authoredSceneChoiceEffects.c1_verdict,
  c2_logs: authoredSceneChoiceEffects.c2_trace,
  c2_meeting: authoredSceneChoiceEffects.c2_witness,
  c2_pressure: authoredSceneChoiceEffects.c2_judgment,
  c3_split: authoredSceneChoiceEffects.c3_rival,
  c3_score: authoredSceneChoiceEffects.c3_signal,
  c3_trap: authoredSceneChoiceEffects.c3_verdict,
  c4_offer: authoredSceneChoiceEffects.c4_audit,
  c4_leak: authoredSceneChoiceEffects.c4_public,
  c4_vote: authoredSceneChoiceEffects.c4_verdict,
  c5_map: authoredSceneChoiceEffects.c5_pattern,
  c5_blame: authoredSceneChoiceEffects.c5_voice,
  c5_collapse: authoredSceneChoiceEffects.c5_verdict,
  f_archive: authoredSceneChoiceEffects.f_witness,
  f_confront: authoredSceneChoiceEffects.f_dilemma,
});

const authoredSceneChoiceCopy = {
  accounting: { voice: ["보호받아야 할 사람의 이름부터 기록하겠습니다.", "원본과 증언을 함께 남기고 다음 판단으로 가겠습니다.", "확인 전 결론은 보류하고 접근 범위를 줄이겠습니다."], echo: ["보호를 먼저 적으면 이후 기록의 책임선이 달라집니다.", "원본을 남기는 선택은 늦어도 되돌릴 수 있습니다.", "보류는 중립이 아니라 접근을 제한하는 결정입니다."] },
  payday: { voice: ["지급 약속을 공개하고 당사자와 함께 검증하겠습니다.", "현금 흐름과 사람의 손실을 같은 표에 올리겠습니다.", "불만을 숫자로 지우지 않고 협상 조건으로 남기겠습니다."], echo: ["급여표는 돈의 표이면서 신뢰의 기록입니다.", "숫자와 사람을 나누면 다음 장면에서 비용이 돌아옵니다.", "조건을 적어야 약속이 나중에 증언이 됩니다."] },
  competitor: { voice: ["경쟁사의 요구를 공개 조건으로 바꾸겠습니다.", "속도보다 누가 무엇을 책임지는지 먼저 묻겠습니다.", "거래의 빈칸마다 되돌릴 조건을 붙이겠습니다."], echo: ["경쟁은 속도를 주지만 책임의 주체를 흐릴 수 있습니다.", "빠른 제안일수록 출처와 책임선을 함께 기록해야 합니다.", "빈칸을 남기면 다음 협상자가 그 비용을 떠안습니다."] },
  board: { voice: ["결론보다 피해를 받는 사람에게 먼저 설명하겠습니다.", "근거와 책임자를 같은 문서에 공개하겠습니다.", "오늘의 합의가 내일의 규칙이 되는지 확인하겠습니다."], echo: ["결론은 설명될 때 비로소 조직의 기록이 됩니다.", "근거 없는 책임은 다음 사건의 희생양을 만듭니다.", "이번 합의에는 다음 사람이 따라야 할 규칙이 남습니다."] },
  c2_logs: { voice: ["공백 전후의 원본 로그를 보존하겠습니다.", "계정의 움직임과 사람의 진술을 대조하겠습니다.", "오류 처리를 서두르지 않고 복구 순서를 공개하겠습니다."], echo: ["짧은 공백도 복원 순서가 없으면 의혹으로 남습니다.", "로그는 행동을 보여주지만 의도까지 대신 말하지는 않습니다.", "복구 순서가 공개돼야 수정이 은폐로 보이지 않습니다."] },
  c2_meeting: { voice: ["지목된 사람에게 먼저 반박할 권한을 주겠습니다.", "증언과 기록을 서로 검증하는 절차를 만들겠습니다.", "보고서 밖의 사람도 확인 가능한 문장을 남기겠습니다."], echo: ["보호는 침묵시키는 일이 아니라 말할 조건을 만드는 일입니다.", "증언은 기록과 경쟁하지 않고 기록의 빈틈을 드러냅니다.", "보고서 밖의 목소리가 다음 판단의 기준이 될 수 있습니다."] },
  c2_pressure: { voice: ["보고 마감보다 사실의 순서를 먼저 고정하겠습니다.", "익명 증언의 위험과 필요를 함께 공개하겠습니다.", "누가 책임을 미뤘는지보다 어떤 장치가 허용했는지 보겠습니다."], echo: ["마감은 중요하지만 잘못 고정된 순서는 더 오래 남습니다.", "익명성은 약점이 아니라 말할 수 있게 하는 비용입니다.", "개인을 지목해도 같은 구조가 반복되면 해결되지 않습니다."] },
  c3_split: { voice: ["고객의 목적과 비용 절감의 목적을 분리해 묻겠습니다.", "경쟁사의 책임 조항을 문장 단위로 확인하겠습니다.", "공동 발표라면 실패했을 때의 책임도 함께 쓰겠습니다."], echo: ["같은 자료가 다른 목적을 섬길 때 기준을 먼저 세워야 합니다.", "책임 조항의 작은 문장이 결론의 방향을 바꿉니다.", "공동 책임은 좋은 말이 아니라 실패 시 작동해야 합니다."] },
  c3_score: { voice: ["신호를 경보로 단정하기 전에 출처를 확인하겠습니다.", "발표를 잠시 멈추고 고객에게 보이는 사실을 묻겠습니다.", "빠른 승리보다 검증 가능한 조건을 선택하겠습니다."], echo: ["신호는 결론이 아니라 확인할 질문을 만듭니다.", "고객이 본 장면은 내부 점수표보다 먼저 검증돼야 합니다.", "승리의 조건을 적어야 다음 경쟁에서도 기준이 남습니다."] },
  c3_trap: { voice: ["경보의 주기와 출처를 모두 공개하겠습니다.", "불확실성을 숨기지 않고 발표의 전제로 삼겠습니다.", "결론을 밀기 전에 보안 담당자의 확인을 받겠습니다."], echo: ["반복되는 신호일수록 출처를 확인해야 패턴이 됩니다.", "불확실성을 공개하면 오히려 검증의 범위가 선명해집니다.", "보안 확인은 속도를 늦추지만 잘못된 확신을 막습니다."] },
  c3_verdict: { voice: ["성과와 책임을 같은 발표문에 넣겠습니다.", "검증이 끝난 부분과 남은 부분을 구분하겠습니다.", "공동 결정의 실패 비용도 공동으로 기록하겠습니다."], echo: ["성과만 남은 발표는 다음 판단의 함정이 됩니다.", "검증된 사실과 추정은 문장부터 나눠야 합니다.", "공동 결정에는 공동으로 감당할 비용이 따라옵니다."] },
  c4_offer: { voice: ["예외 조건의 수혜자와 비용 부담자를 함께 적겠습니다.", "작은 비율의 차이가 누구에게 누적되는지 계산하겠습니다.", "서비스를 유지하되 감사 가능한 조건을 붙이겠습니다."], echo: ["작은 비율도 반복되면 조직의 규칙이 됩니다.", "수혜자와 부담자가 다르면 예외는 먼저 공개돼야 합니다.", "서비스의 명분은 감사 가능한 조건을 가질 때 지켜집니다."] },
  c4_leak: { voice: ["공개 가능한 사실과 아직 모르는 사실을 나누겠습니다.", "기자의 문장보다 피해 복구의 순서를 먼저 확정하겠습니다.", "보안 결함의 범위와 책임을 함께 설명하겠습니다."], echo: ["모르는 것을 함께 적는 것이 공개의 첫 조건입니다.", "기사의 속도보다 복구 순서가 피해자에게 직접 닿습니다.", "결함을 설명하지 않으면 책임의 방향도 왜곡됩니다."] },
  c4_vote: { voice: ["감사 결과를 보상 기준과 함께 공개하겠습니다.", "좋은 결과가 규칙 위반을 지우지 못하게 하겠습니다.", "예외를 허용한 결정권자의 근거를 남기겠습니다."], echo: ["보상 기준이 공개되면 결과 뒤의 규칙도 보입니다.", "좋은 결과는 규칙을 면제하는 증거가 아닙니다.", "결정권자의 근거가 없으면 예외는 다시 반복됩니다."] },
  c5_map: { voice: ["실패가 모이는 경로부터 다시 그리겠습니다.", "한 사람의 과실과 시스템의 빈틈을 분리하겠습니다.", "피해가 반복된 지점을 개선 예산에 올리겠습니다."], echo: ["실패의 경로를 그리면 비난보다 개입 지점이 보입니다.", "개인의 과실만 남기면 시스템의 빈틈은 계속 작동합니다.", "개선 예산은 피해가 반복된 곳에 먼저 닿아야 합니다."] },
  c5_blame: { voice: ["말할 수 없었던 사람의 조건부터 복구하겠습니다.", "책임 발표 전에 결정권과 정보 흐름을 공개하겠습니다.", "보상과 조사 일정을 한 번에 약속하겠습니다."], echo: ["침묵의 조건을 고치지 않으면 같은 증언은 다시 사라집니다.", "책임은 결정권과 정보 접근이 확인될 때 구체화됩니다.", "보상과 조사는 서로를 미루는 핑계가 되어서는 안 됩니다."] },
  c5_collapse: { voice: ["사과문보다 피해 복구의 첫 행동을 정하겠습니다.", "책임자의 이름과 개선 기한을 함께 기록하겠습니다.", "다음 실패를 막는 장치를 지금 결정하겠습니다."], echo: ["사과는 첫 행동이 기록될 때 책임으로 이어집니다.", "이름만 남은 책임은 기한이 없으면 다시 흐려집니다.", "다음 실패를 막는 장치가 없으면 결말은 반복됩니다."] },
  f_archive: { voice: ["이전 참가자의 선택과 조건을 원본 그대로 열겠습니다.", "복제된 문장과 실제 결과를 나란히 비교하겠습니다.", "실험을 멈출 조건을 먼저 기록하겠습니다."], echo: ["이전 기록은 정답지가 아니라 다음 판단의 조건입니다.", "문장이 복제되면 결과가 누구의 것인지 다시 물어야 합니다.", "멈출 조건이 없으면 실험은 책임을 외주화합니다."] },
  f_confront: { voice: ["관찰된 선택을 숨기지 않고 당사자에게 돌려주겠습니다.", "종료 권한과 감시 규칙을 함께 공개하겠습니다.", "다음 참가자가 바꿀 수 있는 빈칸을 남기겠습니다."], echo: ["관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.", "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.", "빈칸을 남기는 일은 다음 판단자에게 책임을 넘기는 방식입니다."] },
};

Object.assign(authoredSceneChoiceCopy, {
  c1_witness: authoredSceneChoiceCopy.accounting,
  c1_assembly: authoredSceneChoiceCopy.payday,
  c1_bargain: authoredSceneChoiceCopy.competitor,
  c1_verdict: authoredSceneChoiceCopy.board,
  c2_trace: authoredSceneChoiceCopy.c2_logs,
  c2_witness: authoredSceneChoiceCopy.c2_meeting,
  c2_judgment: authoredSceneChoiceCopy.c2_pressure,
  c3_rival: authoredSceneChoiceCopy.c3_split,
  c3_signal: authoredSceneChoiceCopy.c3_score,
  c3_verdict: authoredSceneChoiceCopy.c3_trap,
  c4_audit: authoredSceneChoiceCopy.c4_offer,
  c4_public: authoredSceneChoiceCopy.c4_leak,
  c4_verdict: authoredSceneChoiceCopy.c4_vote,
  c5_pattern: authoredSceneChoiceCopy.c5_map,
  c5_voice: authoredSceneChoiceCopy.c5_blame,
  c5_verdict: authoredSceneChoiceCopy.c5_collapse,
  f_witness: authoredSceneChoiceCopy.f_archive,
  f_dilemma: authoredSceneChoiceCopy.f_confront,
});

function getAuthoredSceneEffects(sourceId, id) {
  const effects = authoredSceneChoiceEffects[sourceId];
  if (!effects) {
    throw new Error(`Missing authored choice effects for generated scene source: ${sourceId} (${id})`);
  }
  return effects;
}

function getAuthoredSceneCopy(sourceId, id) {
  const copy = authoredSceneChoiceCopy[sourceId];
  if (!copy) {
    throw new Error(`Missing authored choice copy for generated scene source: ${sourceId} (${id})`);
  }
  return id.endsWith("_reaction") ? copy.reaction ?? copy : copy;
}

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
        cognition: index === 0 ? { persistence: 1 } : index === 1 ? { inference: 1 } : { risk: 1 },
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
      { id: "c1_branch_people_a", label: "남겨질 사람부터 협상서에 적는다", effect: { trust: 7, capital: -6, fatigue: 3 }, next: "c1_branch_people_follow", cognition: { reframing: 2 } },
      { id: "c1_branch_people_b", label: "협력사 지급일을 먼저 고정한다", effect: { legitimacy: 5, time: -5, trust: 2 }, next: "c1_branch_people_follow", cognition: { inference: 1 } },
      { id: "c1_branch_people_c", label: "인수 조건만 남기고 서명한다", effect: { capital: 8, trust: -7, fatigue: 4 }, next: "c1_branch_people_follow", cognition: { risk: 2 } },
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
      { id: "c1_branch_people_follow_a", label: "약속을 공개 기록으로 남긴다", effect: { legitimacy: 6, time: -4, fatigue: 2 }, next: "board", cognition: { inference: 1 } },
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
      { id: "c2_branch_records_a", label: "원본과 백업을 동시에 보존한다", effect: { legitimacy: 7, time: -6, fatigue: 3 }, next: "c2_branch_records_follow", cognition: { inference: 2 } },
      { id: "c2_branch_records_b", label: "접속자의 진술부터 확보한다", effect: { trust: 6, time: -5, legitimacy: 2 }, next: "c2_branch_records_follow", cognition: { persistence: 1 } },
      { id: "c2_branch_records_c", label: "오류로 표시하고 보고를 진행한다", effect: { time: 5, legitimacy: -7, fatigue: 2 }, next: "c2_branch_records_follow", cognition: { risk: 2 } },
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
      { id: "c2_branch_records_follow_a", label: "진술자에게 원문 확인 권한을 준다", effect: { trust: 6, legitimacy: 3, fatigue: 4 }, next: "c2_final", cognition: { reframing: 1 } },
      { id: "c2_branch_records_follow_b", label: "원문을 첨부해 외부 검증을 연다", effect: { legitimacy: 8, capital: -5, time: -4 }, next: "c2_final", cognition: { inference: 2 } },
      { id: "c2_branch_records_follow_c", label: "보고서의 결론만 남긴다", effect: { time: 4, trust: -6, legitimacy: -4 }, next: "c2_final", cognition: { risk: 1 } },
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
      { id: "c3_branch_signal_a", label: "신호를 공개 질문으로 전환한다", effect: { trust: 6, legitimacy: 5, time: -5 }, next: "c3_branch_signal_follow", cognition: { reframing: 2 } },
      { id: "c3_branch_signal_b", label: "발표를 멈추고 출처를 확인한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "c3_branch_signal_follow", cognition: { inference: 2 } },
      { id: "c3_branch_signal_c", label: "신호를 무시하고 승부를 끝낸다", effect: { capital: 8, trust: -6, fatigue: 3 }, next: "c3_branch_signal_follow", cognition: { risk: 2 } },
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
      { id: "c3_branch_signal_follow_a", label: "승리 조건에 검증 기한을 붙인다", effect: { legitimacy: 7, time: -5, fatigue: 2 }, next: "c3_final", cognition: { persistence: 1 } },
      { id: "c3_branch_signal_follow_b", label: "공동 책임자를 발표한다", effect: { trust: 7, capital: -4, legitimacy: 3 }, next: "c3_final", cognition: { reframing: 1 } },
      { id: "c3_branch_signal_follow_c", label: "성과 수치만 먼저 확정한다", effect: { capital: 7, trust: -7, legitimacy: -3 }, next: "c3_final", cognition: { risk: 1 } },
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
      { id: "c4_branch_exception_a", label: "예외 조건을 누구나 읽게 공개한다", effect: { legitimacy: 8, trust: 3, time: -6 }, next: "c4_branch_exception_follow", cognition: { inference: 1 } },
      { id: "c4_branch_exception_b", label: "피해 이용자에게 먼저 보상한다", effect: { humanCost: -5, capital: -7, trust: 6 }, next: "c4_branch_exception_follow", cognition: { reframing: 1 } },
      { id: "c4_branch_exception_c", label: "이번 사례만 조용히 승인한다", effect: { time: 5, legitimacy: -8, fatigue: 3 }, next: "c4_branch_exception_follow", cognition: { risk: 2 } },
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
      { id: "c4_branch_exception_follow_a", label: "감사 결과와 보상 기준을 함께 공개한다", effect: { legitimacy: 7, trust: 5, time: -5 }, next: "c4_final", cognition: { inference: 1 } },
      { id: "c4_branch_exception_follow_b", label: "감사 범위를 이용자 대표와 정한다", effect: { trust: 7, capital: -4, fatigue: 4 }, next: "c4_final", cognition: { reframing: 2 } },
      { id: "c4_branch_exception_follow_c", label: "좋은 결과를 근거로 감사를 닫는다", effect: { capital: 5, legitimacy: -6, fatigue: 2 }, next: "c4_final", cognition: { risk: 1 } },
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
      { id: "c5_branch_owner_a", label: "내 승인부터 공개한다", effect: { legitimacy: 7, trust: 4, humanCost: -3 }, next: "c5_branch_owner_follow", cognition: { persistence: 1 } },
      { id: "c5_branch_owner_b", label: "누락된 안전장치를 복구한다", effect: { capital: -6, legitimacy: 6, fatigue: 5 }, next: "c5_branch_owner_follow", cognition: { reframing: 2 } },
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
      { id: "c5_branch_owner_follow_a", label: "복구 대상과 책임자를 함께 기록한다", effect: { trust: 6, legitimacy: 6, fatigue: 4 }, next: "c5_final", cognition: { inference: 1 } },
      { id: "c5_branch_owner_follow_b", label: "재발 방지 장치에 예산을 고정한다", effect: { capital: -8, legitimacy: 7, humanCost: -2 }, next: "c5_final", cognition: { persistence: 2 } },
      { id: "c5_branch_owner_follow_c", label: "사과문만 발표하고 종료한다", effect: { time: 5, trust: -6, legitimacy: -4 }, next: "c5_final", cognition: { risk: 1 } },
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
      { id: "f_branch_witness_a", label: "빈칸을 참가자들에게 공개한다", effect: { legitimacy: 8, trust: 5, time: -6 }, next: "f_branch_witness_follow", cognition: { inference: 2 } },
      { id: "f_branch_witness_b", label: "삭제 흔적부터 복원한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "f_branch_witness_follow", cognition: { persistence: 1 } },
      { id: "f_branch_witness_c", label: "기록의 결론만 믿고 넘어간다", effect: { time: 5, trust: -7, fatigue: 3 }, next: "f_branch_witness_follow", cognition: { risk: 2 } },
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
      { id: "f_branch_witness_follow_a", label: "모든 참가자에게 열람 권한을 준다", effect: { legitimacy: 7, trust: 6, time: -5 }, next: "f_choice", cognition: { reframing: 1 } },
      { id: "f_branch_witness_follow_b", label: "독립 검토자에게 먼저 맡긴다", effect: { trust: 4, capital: -5, legitimacy: 8 }, next: "f_choice", cognition: { inference: 2 } },
      { id: "f_branch_witness_follow_c", label: "내 기록만 보관하고 문을 닫는다", effect: { time: 4, trust: -6, legitimacy: -5 }, next: "f_choice", cognition: { risk: 1 } },
    ],
  },
};

const authoredBranchPlans = [
  ["case01", "competitor", 0, "c1_branch_people", "c1_branch_people_follow"],
  ["case02", "c2_meeting", 0, "c2_branch_records", "c2_branch_records_follow"],
  ["case03", "c3_score", 0, "c3_branch_signal", "c3_branch_signal_follow"],
  ["case04", "c4_leak", 0, "c4_branch_exception", "c4_branch_exception_follow"],
  ["case05", "c5_blame", 0, "c5_branch_owner", "c5_branch_owner_follow"],
  ["final", "f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
];

authoredBranchPlans.forEach(([caseId, sourceId, choiceIndex, firstId, secondId]) => {
  const source = nodes[sourceId];
  if (!source || !authoredBranchScenes[firstId] || !authoredBranchScenes[secondId]) return;
  source.choices[choiceIndex] = { ...source.choices[choiceIndex], next: firstId, branchId: firstId };
  nodes[firstId] = authoredBranchScenes[firstId];
  nodes[secondId] = authoredBranchScenes[secondId];
  const order = nodeOrders[caseId];
  const sourceOrderIndex = order.indexOf(sourceId);
  if (sourceOrderIndex >= 0) order.splice(sourceOrderIndex + 1, 0, firstId, secondId);
});

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

Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  const baseNodeId = caseId === "case02" ? "c2_start" : caseId === "case03" ? "c3_start" : caseId === "case04" ? "c4_start" : caseId === "case05" ? "c5_start" : "f_start";
  Object.values(routes).forEach((nodeId) => {
    const [title, speaker, text, memo] = branchOpeningCopy[nodeId];
    nodes[nodeId] = {
      ...nodes[baseNodeId],
      phase: "BRANCH BRIEFING",
      title,
      speaker,
      text,
      memo,
      choices: nodes[baseNodeId].choices.map((choice) => ({ ...choice })),
    };
  });
  nodeOrders[caseId].unshift(...Object.values(routes));
});

function getPlayableRoute(caseId) {
  const route = [];
  const seen = new Set();
  let nodeId = CASE_START_NODES[caseId];
  while (nodeId && !seen.has(nodeId) && !RESULT_NODE_IDS.has(nodeId)) {
    seen.add(nodeId);
    route.push(nodeId);
    nodeId = nodes[nodeId]?.choices?.[0]?.next;
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
      return new Set(scene.choices.map((choice) => choice.next)).size > 1;
    });
    if (!nodeId) return null;
    return { caseId, nodeId, nextIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.next))] };
  }).filter(Boolean);
}

export function getCaseRouteLength(caseId) {
  return getPlayableRoute(caseId).length;
}

export function getNodeRouteIndex(caseId, nodeId) {
  const branchStartIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
  if (branchStartIds.has(nodeId)) return 0;
  return getPlayableRoute(caseId).indexOf(nodeId);
}
