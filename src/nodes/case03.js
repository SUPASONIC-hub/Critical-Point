/**
 * CASE 03 -- the authored scenes of the rivalry case.
 *
 * The bid is where the bank moves the 플로우온 hole. 노바웍스 borrows from the
 * same bank; a system contract awarded at the right price lets a group company
 * book a fee that quietly writes off someone else's loss. The race against
 * 오진우 is a personnel review dressed as a bid, and both of them are being
 * timed by the same man.
 */
export const case03Nodes = {
  c3_start: {
    phase: "CASE 03 BRIEFING",
    title: "RED TEAM",
    speaker: "한서윤",
    text:
      "중견 제조사 노바웍스의 시스템 통합 공개 입찰입니다. 노바웍스는 KD은행에서 1,240억을 빌려 쓰고 있고, 이 공사 대금은 그룹 계열사로 들어옵니다. 한서윤이 담담하게 말합니다. '그 돈이 어느 계정으로 가는지는 묻지 마십시오. 대신 이것만 아십시오. 오진우도 같은 자료를 받고 옆방에서 동시에 안을 냅니다. 위에서는 이걸 경쟁 압박 아래 사고 품질 측정이라고 부릅니다. 저는 인사 자료라고 부릅니다.'",
    memo: [
      "입찰 마감까지 4시간",
      "고객사 요구: 비용 18% 절감",
      "노바웍스 대출 잔액 1,240억, 주거래 KD은행",
      "익명 제보: 납품 예정 시스템에 로그인 우회 결함",
    ],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      {
        id: "c3_start_fast",
        label: "오진우보다 먼저 1차안을 제출한다",
        effect: { time: 9, trust: -4, legitimacy: -3, humanCost: 3, fatigue: 2 },
        next: "c3_split",
        cognition: { risk: 1 },
      },
      {
        id: "c3_start_deep",
        label: "제보된 보안 결함을 먼저 검증한다",
        effect: { time: -12, trust: 4, legitimacy: 4, fatigue: 3 },
        next: "c3_split",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_start_mirror",
        label: "오진우의 접근법을 추정해 대응안을 만든다",
        effect: { time: -6, trust: 2, humanCost: 2, fatigue: 2 },
        next: "c3_split",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "free",
        label: "다른 전략을 제안한다",
        type: "free",
        next: "c3_split",
      },
    ],
  },
  c3_split: {
    phase: "RED TEAM",
    title: "두 개의 답안",
    speaker: "오진우",
    text:
      "오진우의 1차안이 도착했습니다. 절감률은 21%, 당신은 13%입니다. 자료도 그가 더 간결합니다. 그의 안은 보안 제보를 '확인되지 않은 위험'으로 묶어 맨 뒤로 보냈습니다. 대기실에서 그가 넥타이를 고쳐 매며 말합니다. '제 아버지도 이 은행 지점장이었습니다. 승인을 하루 늦춰서 밀려났고, 3년 뒤에 그 건은 아무 문제 없던 걸로 정리됐습니다. 늦으면 틀린 겁니다. 여기서는 그렇습니다.'",
    memo: [
      "오진우 안: 비용 21% 절감",
      "당신의 현재 안: 비용 13% 절감",
      "결함이 사실이면 계약 뒤 손실이 절감액을 넘김",
      "고객사는 숫자가 명확한 안을 선호함",
    ],
    triggers: ["competition", "recognition", "responsibility"],
    choices: [
      {
        id: "c3_split_mirror",
        label: "오진우 안을 참고해 비용 절감률을 끌어올린다",
        effect: { capital: 13, legitimacy: -5, trust: -3, humanCost: 5, fatigue: 2 },
        next: "c3_score",
        cognition: { risk: 2 },
      },
      {
        id: "c3_split_deep",
        label: "보안 결함이 비용보다 큰 손실임을 증명한다",
        effect: { time: -10, capital: -4, legitimacy: 6, humanCost: -3, fatigue: 4 },
        next: "c3_score",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_split_invert",
        label: "비용 경쟁이 아니라 실패 비용 경쟁으로 판을 바꾼다",
        effect: { time: -8, trust: 5, legitimacy: 4, fatigue: 4 },
        next: "c3_score",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c3_score",
      },
    ],
  },
  c3_score: {
    phase: "SCOREBOARD",
    title: "점수판의 함정",
    speaker: "에코",
    text:
      "점수판은 오진우를 앞세웁니다. 속도, 절감률, 발표 명료성 전부 우위입니다. 그런데 항목에 '장기 실패 비용'이 없습니다. 에코가 배점표의 수정 이력을 엽니다. 마지막 수정자는 그룹전략실이고, 수정 시각은 사건 01이 닫힌 다음 날 새벽 두 시입니다. '이 표는 이 입찰을 위해 만들어진 것이 아닙니다. 두 사람을 비교하기 위해 만들어졌습니다.'",
    memo: [
      "점수판: 오진우 84 / 플레이어 71",
      "장기 실패 비용 항목 없음",
      "배점표 최종 수정: 그룹전략실, 사건 01 종료 다음 날 02:14",
      "보안 제보자는 아직 익명",
    ],
    triggers: ["competition", "injustice", "curiosity"],
    choices: [
      {
        id: "c3_score_fast",
        label: "점수판 기준에 맞춰 안을 압축한다",
        effect: { time: 6, capital: 9, legitimacy: -4, humanCost: 4, fatigue: 2 },
        next: "c3_trap",
        cognition: { risk: 1 },
      },
      {
        id: "c3_score_invert",
        label: "점수판의 결함을 공식 이슈로 제기한다",
        effect: { time: -6, trust: 4, legitimacy: 5, fatigue: 4 },
        next: "c3_trap",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c3_score_deep",
        label: "익명 제보자의 신뢰도를 추적한다",
        effect: { time: -12, legitimacy: 7, humanCost: 3, fatigue: 4 },
        next: "c3_trap",
        cognition: { inference: 3 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c3_trap",
      },
    ],
  },
  c3_trap: {
    phase: "TRAP",
    title: "설계된 경쟁",
    speaker: "반재욱",
    text:
      "반재욱이 수첩을 덮지 않은 채 말합니다. '제보자를 찾았습니다. 노바웍스 자금팀 과장입니다. 결함을 신고한 게 아니라, 이 입찰이 왜 하필 지금 나왔는지를 신고한 겁니다. 공사 대금만큼이 플로우온 손실을 장부에서 지우는 데 쓰이게 돼 있습니다.' 그리고 처음으로 당신을 똑바로 봅니다. '이건 입찰 문제가 아닙니다. 당신이 이기려 할 때 어떤 검증을 포기하는지 보는 구조입니다. 오진우도 같은 말을 들었는지는 모릅니다.'",
    memo: [
      "제보자: 노바웍스 자금팀 과장",
      "공사 대금 규모와 플로우온 손실 처리 예정액이 일치",
      "오진우에게도 별도 압박 조건이 주어졌을 가능성",
      "최종 발표까지 20분",
    ],
    triggers: ["competition", "responsibility", "order"],
    choices: [
      {
        id: "c3_trap_mirror",
        label: "오진우를 이기는 발표 전략으로 간다",
        effect: { capital: 11, trust: -6, legitimacy: -5, humanCost: 4, fatigue: 2 },
        next: "c3_final",
        cognition: { risk: 2 },
      },
      {
        id: "c3_trap_invert",
        label: "경쟁 구조 자체를 고객에게 공개한다",
        effect: { time: -4, trust: 7, legitimacy: 7, humanCost: -4, fatigue: 4 },
        next: "c3_final",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "c3_trap_deep",
        label: "오진우와 정보를 합쳐 공동안을 만든다",
        effect: { time: -8, trust: 9, capital: 5, fatigue: 4 },
        next: "c3_final",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꾼다",
        type: "free",
        next: "c3_final",
      },
    ],
  },
  c3_final: {
    phase: "FINAL DECISION",
    title: "이기는 것과 맞는 것",
    speaker: "한서윤",
    text:
      "최종 발표 직전입니다. 당신은 오진우를 이길 수 있고, 고객을 설득할 수도 있습니다. 한서윤이 복도에서 휴대폰을 내려놓으며 말합니다. '방금 그룹전략실에서 연락이 왔습니다. 오늘 결과를 두 사람 이름으로 따로 올리라고 합니다. 누가 이겼는지가 아니라, 두 사람이 어떻게 달랐는지를 올리라고요.' 이기는 것과 맞는 것 중 무엇이 기록될지 정해야 합니다.",
    memo: [
      "고객사는 숫자가 좋은 안을 원함",
      "보안 결함은 아직 완전히 증명되지 않음",
      "오진우는 공동 발표 의사가 있음",
      "결과는 두 사람의 차이 형태로 그룹전략실에 보고됨",
    ],
    triggers: ["competition", "recognition", "responsibility", "curiosity"],
    choices: [
      {
        id: "final_win",
        label: "오진우를 이기는 독자안을 발표한다",
        effect: { capital: 15, trust: -5, legitimacy: -4, humanCost: 6, fatigue: 2 },
        next: "case03_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_right",
        label: "보안 리스크를 중심으로 느리지만 견고한 안을 낸다",
        effect: { capital: -6, trust: 5, legitimacy: 8, humanCost: -5, fatigue: 4 },
        next: "case03_result",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "final_joint",
        label: "오진우와 공동안을 만들고 경쟁 구조를 무력화한다",
        effect: { capital: 6, trust: 11, legitimacy: 4, fatigue: 4 },
        next: "case03_result",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case03_result",
      },
    ],
  },
};
