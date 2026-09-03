/** CASE 04 -- the authored scenes of the exception case. */
export const case04Nodes = {
  c4_start: {
    phase: "CASE 04 BRIEFING",
    title: "THE PRICE",
    speaker: "한서윤",
    text:
      "사회복지 플랫폼 온새가 정부 보조금 심사 직전에 있습니다. 심사를 통과하면 취약계층 4,200명의 돌봄 서비스가 유지됩니다. 다만 핵심 지표 하나가 기준에 3% 부족합니다.",
    memo: [
      "서비스 중단 시 4,200명 영향",
      "지표 부족분: 3%",
      "보조금 심사 마감까지 9시간",
      "내부에서는 산식 해석을 넓히자는 의견이 나옴",
    ],
    triggers: ["reward", "responsibility", "protection", "order"],
    choices: [
      {
        id: "c4_start_approve",
        label: "산식 해석을 넓혀 심사 기준을 맞춘다",
        effect: { capital: 18, legitimacy: -10, trust: -2, fatigue: 2 },
        next: "c4_offer",
        cognition: { risk: 2 },
      },
      {
        id: "c4_start_refuse",
        label: "부족한 지표를 그대로 보고한다",
        effect: { capital: -16, legitimacy: 8, trust: 5, humanCost: 12, fatigue: 3 },
        next: "c4_offer",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_start_contain",
        label: "산식 변경 조건과 사후 검증 절차를 함께 건다",
        effect: { capital: 8, legitimacy: 2, trust: 2, fatigue: 4 },
        next: "c4_offer",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c4_offer",
      },
    ],
  },
  c4_offer: {
    phase: "TEMPTATION",
    title: "작은 예외",
    speaker: "도윤하",
    text:
      "현장 담당자들은 말합니다. '숫자 3% 때문에 서비스를 끊는 게 더 비윤리적입니다.' 동시에 반재욱은 산식 변경 기록을 남기지 않으면 명백한 은폐가 된다고 경고합니다.",
    memo: [
      "현장 대기자 640명",
      "산식 변경은 법적으로 회색지대",
      "기록을 남기면 심사 탈락 가능성 증가",
      "기록을 숨기면 추후 감사 리스크 증가",
    ],
    triggers: ["protection", "reward", "order", "responsibility"],
    choices: [
      {
        id: "c4_offer_approve",
        label: "기록 없이 산식을 조정한다",
        effect: { capital: 20, legitimacy: -18, trust: -8, fatigue: 2 },
        next: "c4_leak",
        cognition: { risk: 2 },
      },
      {
        id: "c4_offer_contain",
        label: "기록을 남기되 심사 자료에는 보완 의견으로 처리한다",
        effect: { capital: 8, legitimacy: 2, trust: 3, fatigue: 4 },
        next: "c4_leak",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "c4_offer_refuse",
        label: "산식 조정 없이 긴급 대체 재원을 찾는다",
        effect: { time: -12, capital: -8, legitimacy: 6, fatigue: 4 },
        next: "c4_leak",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c4_leak",
      },
    ],
  },
  c4_leak: {
    phase: "LEAK",
    title: "외부 제보",
    speaker: "반재욱",
    text:
      "익명 제보자가 언론에 '온새가 심사 지표를 조작하려 한다'는 메일을 보냈습니다. 아직 보도 전이지만 기자가 확인 전화를 걸어왔습니다.",
    memo: [
      "기자는 1시간 뒤 답변을 요구",
      "제보 내용 일부는 내부 회의 표현과 일치",
      "오진우는 빠른 부인 성명을 제안",
      "에코는 CASE 02와 같은 유출 패턴을 표시함",
    ],
    triggers: ["injustice", "order", "fear", "responsibility"],
    choices: [
      {
        id: "c4_leak_expose",
        label: "산식 논란과 서비스 중단 위험을 함께 공개한다",
        effect: { trust: 8, legitimacy: 7, capital: -12, fatigue: 4 },
        next: "c4_vote",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_leak_approve",
        label: "조작 의혹을 부인하고 심사를 먼저 통과시킨다",
        effect: { capital: 18, legitimacy: -16, trust: -10, fatigue: 2 },
        next: "c4_vote",
        cognition: { risk: 2 },
      },
      {
        id: "c4_leak_contain",
        label: "기자에게 조건부 엠바고와 검증 자료를 제안한다",
        effect: { time: -6, trust: 4, legitimacy: 3, fatigue: 4 },
        next: "c4_vote",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c4_vote",
      },
    ],
  },
  c4_vote: {
    phase: "BOARD VOTE",
    title: "누가 비용을 내는가",
    speaker: "에코",
    text:
      "이제 선택은 선의의 문제가 아닙니다. 규칙을 지키면 사람들이 서비스를 잃고, 규칙을 넓히면 시스템의 신뢰가 손상됩니다. 어느 쪽 비용을 공식적으로 감수할지 정해야 합니다.",
    memo: [
      "이사회 표결까지 25분",
      "현장팀은 서비스 유지 요구",
      "법무팀은 기록 없는 산식 변경 반대",
      "트리거랩은 보상 트리거 상승을 표시함",
    ],
    triggers: ["reward", "order", "protection", "responsibility"],
    choices: [
      {
        id: "c4_vote_approve",
        label: "서비스 유지를 위해 예외를 승인한다",
        effect: { capital: 20, trust: -4, legitimacy: -14, fatigue: 2 },
        next: "c4_final",
        cognition: { risk: 2 },
      },
      {
        id: "c4_vote_refuse",
        label: "예외를 거부하고 손실을 공식화한다",
        effect: { capital: -18, trust: 8, legitimacy: 10, humanCost: 14, fatigue: 4 },
        next: "c4_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c4_vote_contain",
        label: "예외 승인과 공개 감사 조건을 묶는다",
        effect: { capital: 8, trust: 6, legitimacy: 4, fatigue: 5 },
        next: "c4_final",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c4_final",
      },
    ],
  },
  c4_final: {
    phase: "FINAL DECISION",
    title: "좋은 결과의 가격",
    speaker: "한서윤",
    text:
      "당신은 사람들을 살릴 수 있습니다. 원칙도 지킬 수 있습니다. 하지만 둘 다 완전하게는 불가능합니다. 이번 결정은 트리거랩이 당신의 '명분 있는 위반' 허용선을 계산하는 자료가 됩니다.",
    memo: [
      "서비스 유지와 규칙 신뢰가 충돌",
      "언론 보도는 아직 막을 수 있음",
      "감사 기록은 남길 수도 숨길 수도 있음",
      "다음 케이스는 악인이 없는 실패 구조로 넘어감",
    ],
    triggers: ["reward", "order", "responsibility", "protection"],
    choices: [
      {
        id: "final_exception",
        label: "예외를 승인하고 결과 책임을 진다",
        effect: { capital: 18, legitimacy: -10, trust: 2, fatigue: 3 },
        next: "case04_result",
        cognition: { risk: 2, persistence: 1 },
      },
      {
        id: "final_rule",
        label: "규칙을 지키고 피해 완화책을 선택한다",
        effect: { capital: -10, legitimacy: 8, trust: 5, humanCost: 8, fatigue: 4 },
        next: "case04_result",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "final_audit",
        label: "예외와 공개 감사를 동시에 선택한다",
        effect: { capital: 8, legitimacy: 5, trust: 8, fatigue: 5 },
        next: "case04_result",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case04_result",
      },
    ],
  },
};
