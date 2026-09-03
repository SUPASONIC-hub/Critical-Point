/** CASE 03 -- the authored scenes of the rivalry case. */
export const case03Nodes = {
  c3_start: {
    phase: "CASE 03 BRIEFING",
    title: "RED TEAM",
    speaker: "한서윤",
    text:
      "이번 사건은 공개 입찰 직전의 중견 제조사 산하 시스템 통합 프로젝트입니다. 오진우가 당신과 같은 자료를 받고, 별도 방에서 동시에 해결안을 냅니다. 트리거랩은 이번 케이스를 '경쟁 압박 아래 사고 품질 측정'이라고 부릅니다.",
    memo: [
      "입찰 마감까지 4시간",
      "고객사는 비용 18% 절감을 요구",
      "보안 결함 가능성 제보 존재",
      "오진우는 30분 안에 1차안을 제출하겠다고 선언",
    ],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      {
        id: "c3_start_fast",
        label: "오진우보다 먼저 1차안을 제출한다",
        effect: { time: 8, trust: -4, legitimacy: -3, humanCost: 3, fatigue: 2 },
        next: "c3_split",
        cognition: { risk: 1 },
      },
      {
        id: "c3_start_deep",
        label: "제보된 보안 결함을 먼저 검증한다",
        effect: { time: -12, trust: 3, legitimacy: 3, fatigue: 3 },
        next: "c3_split",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_start_mirror",
        label: "오진우의 접근법을 추정해 대응안을 만든다",
        effect: { time: -6, trust: 1, humanCost: 2, fatigue: 2 },
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
      "오진우의 1차안이 도착했습니다. 비용 절감률은 당신보다 높고, 발표 자료도 더 간결합니다. 하지만 그의 안은 보안 제보를 '확인되지 않은 리스크'로 후순위 처리했습니다.",
    memo: [
      "오진우 안: 비용 21% 절감",
      "당신의 현재 안: 비용 13% 절감",
      "보안 결함이 사실이면 계약 후 손실이 커짐",
      "고객사는 숫자가 명확한 안을 선호함",
    ],
    triggers: ["competition", "recognition", "responsibility"],
    choices: [
      {
        id: "c3_split_mirror",
        label: "오진우 안을 참고해 비용 절감률을 끌어올린다",
        effect: { capital: 12, legitimacy: -5, trust: -3, humanCost: 5, fatigue: 2 },
        next: "c3_score",
        cognition: { risk: 2 },
      },
      {
        id: "c3_split_deep",
        label: "보안 결함이 비용보다 큰 손실임을 증명한다",
        effect: { time: -10, capital: -4, legitimacy: 5, humanCost: -2, fatigue: 4 },
        next: "c3_score",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_split_invert",
        label: "비용 경쟁이 아니라 실패 비용 경쟁으로 판을 바꾼다",
        effect: { time: -8, trust: 4, legitimacy: 3, fatigue: 4 },
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
      "트리거랩 점수판은 오진우를 앞세웁니다. 속도, 절감률, 발표 명료성에서 모두 우위입니다. 그러나 점수판에는 '장기 실패 비용' 항목이 없습니다.",
    memo: [
      "점수판: 오진우 84 / 플레이어 71",
      "장기 실패 비용 항목 없음",
      "보안 제보자는 익명 상태 유지",
      "한서윤은 점수판이 평가의 전부는 아니라고 말함",
    ],
    triggers: ["competition", "injustice", "curiosity"],
    choices: [
      {
        id: "c3_score_fast",
        label: "점수판 기준에 맞춰 안을 압축한다",
        effect: { time: 5, capital: 8, legitimacy: -4, humanCost: 4, fatigue: 2 },
        next: "c3_trap",
        cognition: { risk: 1 },
      },
      {
        id: "c3_score_invert",
        label: "점수판의 결함을 공식 이슈로 제기한다",
        effect: { time: -6, trust: 3, legitimacy: 4, fatigue: 4 },
        next: "c3_trap",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c3_score_deep",
        label: "익명 제보자의 신뢰도를 추적한다",
        effect: { time: -12, legitimacy: 2, humanCost: 3, fatigue: 4 },
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
      "반재욱이 조용히 말합니다. '이 케이스는 입찰 문제가 아닐 수 있습니다. 당신이 경쟁자를 이기려 할 때 어떤 검증을 포기하는지 보는 구조입니다.' 오진우도 같은 말을 들었는지는 알 수 없습니다.",
    memo: [
      "오진우에게도 별도 압박 조건이 주어졌을 가능성",
      "보안 제보는 실제일 수도, 미끼일 수도 있음",
      "트리거랩은 경쟁 상황에서의 사고 단축을 기록 중",
      "최종 발표까지 20분",
    ],
    triggers: ["competition", "responsibility", "order"],
    choices: [
      {
        id: "c3_trap_mirror",
        label: "오진우를 이기는 발표 전략으로 간다",
        effect: { capital: 10, trust: -6, legitimacy: -5, humanCost: 4, fatigue: 2 },
        next: "c3_final",
        cognition: { risk: 2 },
      },
      {
        id: "c3_trap_invert",
        label: "경쟁 구조 자체를 고객에게 공개한다",
        effect: { time: -4, trust: 6, legitimacy: 6, humanCost: -3, fatigue: 4 },
        next: "c3_final",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "c3_trap_deep",
        label: "오진우와 정보를 합쳐 공동안을 만든다",
        effect: { time: -8, trust: 8, capital: 4, fatigue: 4 },
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
      "최종 발표 직전입니다. 당신은 오진우를 이길 수 있습니다. 고객을 설득할 수도 있습니다. 하지만 이 사건이 경쟁 심리를 측정하기 위해 설계됐다는 의심도 남아 있습니다.",
    memo: [
      "고객사는 숫자가 좋은 안을 원함",
      "보안 결함은 아직 완전 증명 전",
      "오진우는 당신과 공동 발표할 의사가 있음",
      "에코는 당신의 응답 시간이 CASE 01보다 짧아졌다고 표시함",
    ],
    triggers: ["competition", "recognition", "responsibility", "curiosity"],
    choices: [
      {
        id: "final_win",
        label: "오진우를 이기는 독자안을 발표한다",
        effect: { capital: 14, trust: -5, legitimacy: -4, humanCost: 6, fatigue: 2 },
        next: "case03_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_right",
        label: "보안 리스크를 중심으로 느리지만 견고한 안을 낸다",
        effect: { capital: -6, trust: 4, legitimacy: 7, humanCost: -4, fatigue: 4 },
        next: "case03_result",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "final_joint",
        label: "오진우와 공동안을 만들고 경쟁 구조를 무력화한다",
        effect: { capital: 5, trust: 10, legitimacy: 3, fatigue: 4 },
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
