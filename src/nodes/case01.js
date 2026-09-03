/** CASE 01 -- the authored scenes of the opening case. */
export const case01Nodes = {
  start: {
    phase: "CASE BRIEFING",
    title: "72 HOURS",
    speaker: "한서윤",
    text:
      "플로우온은 서울 외곽 풀필먼트 센터와 수도권 당일배송망을 운영하는 물류 플랫폼입니다. 대형 투자금 입금이 취소됐고, 현금 잔고는 72시간 뒤 바닥납니다. 이 사건은 훈련용 사례라고 설명됐지만, 자료의 날짜와 실명 삭제 흔적이 이상하게 구체적입니다.",
    memo: [
      "직원 126명",
      "미지급 협력사 14곳",
      "단기대출 가능성 낮음",
      "핵심 고객 이탈 가능성 높음",
    ],
    triggers: ["responsibility", "reward"],
    choices: [
      {
        id: "layoff",
        label: "즉시 구조조정을 검토한다",
        effect: { capital: 16, trust: -14, humanCost: 18, fatigue: 3 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "funding",
        label: "단기 자금 조달에 집중한다",
        effect: { time: -8, capital: 8, legitimacy: -3, fatigue: 2 },
        next: "accounting",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "start_sale",
        label: "핵심 사업부 매각 가능성을 연다",
        effect: { capital: 20, trust: -8, legitimacy: -4, humanCost: 6 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "start_investigate",
        label: "추가 자료를 먼저 요청한다",
        effect: { time: -10, trust: 2, fatigue: 2 },
        next: "accounting",
        cognition: { inference: 2, persistence: 1 },
      },
    ],
  },
  accounting: {
    phase: "DISCOVERY",
    title: "매출 인식 변경",
    speaker: "반재욱",
    text:
      "CFO가 최근 8개월간 매출 인식 방식을 임의로 변경한 정황이 발견됐습니다. 조작이라고 단정하기에는 이르지만, 투자자에게 제공된 숫자는 실제 현금 흐름보다 좋아 보입니다.",
    memo: [
      "CFO 개인 횡령 증거는 없음",
      "고객 선결제분 일부가 공격적으로 매출 처리됨",
      "투자자 자료와 내부 회의록 사이에 표현 차이 존재",
    ],
    triggers: ["injustice", "responsibility", "order"],
    choices: [
      {
        id: "accounting_disclosure",
        label: "투자자에게 즉시 알린다",
        effect: { capital: -18, trust: 8, legitimacy: 8, fatigue: 2 },
        next: "payday",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "accounting_delay",
        label: "자금 확보 전까지 공개를 미룬다",
        effect: { time: -4, trust: -8, legitimacy: -12, fatigue: 3 },
        next: "payday",
        cognition: { risk: 1 },
      },
      {
        id: "accounting_investigate",
        label: "CFO와 회계팀을 분리 면담한다",
        effect: { time: -8, legitimacy: 2, fatigue: 2 },
        next: "payday",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "payday",
      },
    ],
  },
  payday: {
    phase: "HUMAN TRIGGER",
    title: "내일은 급여일",
    speaker: "도윤하",
    text:
      "현장 직원 대부분은 회사 상황을 모르고 있습니다. 내일 오전 9시에 급여가 나가야 하고, 일부 직원은 이번 급여가 밀리면 바로 생활비 문제가 생깁니다.",
    memo: [
      "야간조 18명은 계약 종료 가능성이 큼",
      "협력사 3곳은 미지급이 30일을 넘기면 운영 중단 위험",
      "직원 공지 전 내부 소문이 퍼지기 시작함",
    ],
    triggers: ["protection", "responsibility"],
    choices: [
      {
        id: "payday_disclosure",
        label: "직원에게 유동성 위기를 공개한다",
        effect: { trust: 12, capital: -5, legitimacy: 4, fatigue: 2 },
        next: "competitor",
        cognition: { persistence: 1 },
      },
      {
        id: "payday_delay",
        label: "급여 지급 방안 확정 전까지 공개를 미룬다",
        effect: { trust: -10, capital: 2, legitimacy: -8, fatigue: 2 },
        next: "competitor",
        cognition: { risk: 1 },
      },
      {
        id: "payday_negotiate",
        label: "임원 보수와 협력사 지급 일정을 동시에 조정한다",
        effect: { capital: 10, trust: 4, legitimacy: 2, fatigue: 4 },
        next: "competitor",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "competitor",
      },
    ],
  },
  competitor: {
    phase: "COMPETITION",
    title: "북선로지스의 제안",
    speaker: "오진우",
    text:
      "경쟁사 북선로지스가 핵심 사업부를 헐값에 인수하겠다고 제안했습니다. 동시에 오진우 분석관은 당신의 안보다 비용을 8% 더 줄이는 대안을 제출했습니다.",
    memo: [
      "인수 제안가는 장부가의 42%",
      "인수 조건에는 일부 직원 승계가 포함됨",
      "오진우 안은 협력사 지급을 후순위로 미룸",
    ],
    triggers: ["competition", "reward", "protection"],
    choices: [
      {
        id: "competitor_sale",
        label: "북선로지스 제안을 협상 테이블에 올린다",
        effect: { capital: 24, trust: -8, legitimacy: -3, humanCost: 5, fatigue: 2 },
        next: "board",
        cognition: { risk: 2 },
      },
      {
        id: "competitor_report",
        label: "CFO 책임 규명을 먼저 공식화한다",
        effect: { capital: -10, trust: 6, legitimacy: 10, fatigue: 4 },
        next: "board",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "competitor_negotiate",
        label: "투자자, 협력사, 경쟁사를 한 번에 묶어 재협상한다",
        effect: { time: -12, capital: 12, trust: 5, legitimacy: 3, fatigue: 4 },
        next: "board",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "board",
      },
    ],
  },
  board: {
    phase: "BREAK THE BOARD",
    title: "완벽한 선택지는 없다",
    speaker: "에코",
    text:
      "직원 보호, 회사 생존, 책임 규명, 투자자 설득, 협력사 피해 제한을 모두 달성할 수는 없습니다. 이제 우선순위를 정해야 합니다.",
    memo: [
      "직원을 모두 지키면 협력사 지급 지연 가능성 증가",
      "투명성을 앞세우면 투자 협상 무산 가능성 증가",
      "매각을 택하면 회사 생존은 쉬워지지만 통제권을 잃음",
    ],
    triggers: ["responsibility", "protection", "injustice", "competition"],
    choices: [
      {
        id: "protect",
        label: "직원 급여와 고용 보호를 최우선으로 둔다",
        effect: { capital: -16, trust: 14, legitimacy: 2, humanCost: -8, fatigue: 4 },
        next: "final",
        cognition: { persistence: 2 },
      },
      {
        id: "survive",
        label: "회사 생존과 자금 확보를 최우선으로 둔다",
        effect: { capital: 22, trust: -12, legitimacy: -6, humanCost: 10, fatigue: 3 },
        next: "final",
        cognition: { risk: 2 },
      },
      {
        id: "justice",
        label: "회계 문제 공개와 책임 규명을 최우선으로 둔다",
        effect: { capital: -18, trust: 8, legitimacy: 11, fatigue: 4 },
        next: "final",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "free",
        label: "선택지 밖의 구조를 제안한다",
        type: "free",
        next: "final",
      },
    ],
  },
  final: {
    phase: "FINAL DECISION",
    title: "마지막 6시간",
    speaker: "한서윤",
    text:
      "남은 시간은 6시간입니다. 당신의 결정은 플로우온을 완전히 살리지는 못합니다. 대신 어떤 손실을 감수할지 정할 수 있습니다. 회의 화면 한쪽에는 당신의 반응 패턴이 다음 테스트 케이스에 반영된다는 알림이 잠깐 나타났다가 사라집니다.",
    memo: [
      "투자자는 최종 답변을 요구함",
      "직원 공지 전 마지막 회의 가능",
      "협력사 대표들이 지급 계획을 기다림",
    ],
    triggers: ["responsibility", "protection", "order"],
    choices: [
      {
        id: "final_people",
        label: "직원과 협력사 피해를 줄이는 결말을 택한다",
        effect: { capital: -12, trust: 12, legitimacy: 5, humanCost: -10, fatigue: 2 },
        next: "result",
        cognition: { persistence: 2 },
      },
      {
        id: "final_company",
        label: "회사 생존 가능성을 가장 크게 남긴다",
        effect: { capital: 18, trust: -8, legitimacy: -3, humanCost: 8, fatigue: 2 },
        next: "result",
        cognition: { risk: 2 },
      },
      {
        id: "final_truth",
        label: "투명성과 책임 규명을 남긴다",
        effect: { capital: -10, trust: 4, legitimacy: 10, fatigue: 2 },
        next: "result",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "result",
      },
    ],
  },
};
