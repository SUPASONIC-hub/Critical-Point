/**
 * CASE 01 -- the authored scenes of the opening case.
 *
 * The file on the desk is not a training case. It is 대출번호 2023-0412, the one
 * loan the analyst refused to sign off three years ago, and the refusal is why
 * they now work in a basement lab instead of 기업대출심사팀. Everything the
 * season later uncovers is already physically present here: the contract clause
 * that forced the accounting change, the bank that wrote it, and the signature
 * box nobody filled in.
 */
export const case01Nodes = {
  start: {
    phase: "CASE BRIEFING",
    title: "72 HOURS",
    speaker: "한서윤",
    text:
      "플로우온은 수도권 당일배송망을 운영하는 물류 플랫폼입니다. 투자금 입금이 취소됐고 현금은 72시간 뒤 바닥납니다. 한서윤은 이것을 훈련용 사례라고 설명했습니다. 그런데 표지 아래쪽에 대출번호가 지워지지 않고 남아 있습니다. 2023-0412. 3년 전 KD은행 기업대출심사팀에서 그 건에 혼자 반대 의견을 쓴 사람이 당신입니다.",
    memo: [
      "직원 126명, 대금 못 받은 협력사 14곳",
      "주거래 은행: KD은행 (대출 잔액 310억)",
      "3년 전 심사 의견: 반대 1건 -- 작성자 본인",
      "그 의견서는 지금 사내 시스템에서 검색되지 않음",
    ],
    triggers: ["responsibility", "reward"],
    choices: [
      {
        id: "layoff",
        label: "즉시 구조조정을 검토한다",
        effect: { capital: 18, trust: -14, humanCost: 18, fatigue: 3 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "funding",
        label: "단기 자금 조달에 집중한다",
        effect: { time: -8, capital: 9, legitimacy: -3, fatigue: 2 },
        next: "accounting",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "start_sale",
        label: "핵심 사업부 매각 가능성을 연다",
        effect: { capital: 22, trust: -8, legitimacy: -4, humanCost: 6 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "start_investigate",
        label: "추가 자료를 먼저 요청한다",
        effect: { time: -10, trust: 3, fatigue: 2 },
        next: "accounting",
        cognition: { inference: 2, persistence: 1 },
      },
    ],
  },
  accounting: {
    phase: "DISCOVERY",
    title: "179.6%",
    speaker: "반재욱",
    text:
      "재무책임자가 8개월간 매출을 장부에 올리는 시점을 바꿔 왔습니다. 개인이 돈을 빼돌린 흔적은 없습니다. 바꾼 이유는 단순합니다. KD은행 대출 계약서 제7조가 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 180%를 넘기면 은행이 만기(빌린 돈을 다 갚기로 한 날) 전이라도 대출금을 즉시 회수할 수 있게 해 두었고, 손대기 전 수치는 184%였습니다. 반재욱이 계약서를 넘기며 묻습니다. '이 조항을 쓴 쪽이 이 숫자를 만들게 한 겁니다. 그럼 조작한 사람은 누굽니까?'",
    memo: [
      "대출 계약서 제7조: 부채비율 180% 초과 시 즉시 회수 가능",
      "조정 후 보고치 179.6%, 조정 전 실제치 184.2%",
      "고객이 미리 낸 돈을 매출로 당겨 잡는 방식",
      "그 조항을 설계한 부서: KD은행 기업금융전략팀",
    ],
    triggers: ["injustice", "responsibility", "order"],
    choices: [
      {
        id: "accounting_disclosure",
        label: "투자자에게 즉시 알린다",
        effect: { capital: -18, trust: 9, legitimacy: 9, fatigue: 2 },
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
        effect: { time: -8, legitimacy: 3, fatigue: 2 },
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
      "현장 직원 대부분은 회사에 유동성 위기(당장 쓸 현금이 말라 버리는 상태)가 왔다는 걸 모릅니다. 내일 오전 9시에 급여가 나가야 하고, 야간조 몇 명은 이번 달이 밀리면 바로 생활비가 끊깁니다. 도윤하가 대기실 문 앞에서 멈춰 섭니다. '저 3년 전에 강서지점 창구였습니다. 플로우온 운영자금 대출, 제가 팔았습니다. 실적 한 건이었어요. 심사팀에서 반대 의견이 올라왔다는 말은 들었는데, 누군지는 몰랐습니다.'",
    memo: [
      "야간조 18명은 계약 종료 가능성이 큼",
      "협력사 3곳은 대금이 30일 밀리면 운영 중단",
      "직원 공지 전 내부 소문이 이미 퍼지는 중",
      "도윤하는 이 대출을 창구에서 판 담당자였음",
    ],
    triggers: ["protection", "responsibility"],
    choices: [
      {
        id: "payday_disclosure",
        label: "직원에게 유동성 위기를 공개한다",
        effect: { trust: 13, capital: -5, legitimacy: 5, fatigue: 2 },
        next: "competitor",
        cognition: { persistence: 1 },
      },
      {
        id: "payday_delay",
        label: "급여 지급 방안 확정 전까지 공개를 미룬다",
        effect: { trust: -10, capital: 3, legitimacy: -8, fatigue: 2 },
        next: "competitor",
        cognition: { risk: 1 },
      },
      {
        id: "payday_negotiate",
        label: "임원 보수와 협력사 지급 일정을 동시에 조정한다",
        effect: { capital: 11, trust: 5, legitimacy: 3, fatigue: 4 },
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
    title: "넥스트마일의 제안",
    speaker: "오진우",
    text:
      "경쟁사 넥스트마일이 핵심 사업부를 장부가의 42%에 인수하겠다고 제안했습니다. 오진우는 비용을 8% 더 줄이는 대안을 이미 제출했습니다. 그리고 지나가듯 덧붙입니다. '넥스트마일 주거래도 KD입니다. 같은 은행이 한쪽에서 돈을 회수하고 한쪽에서 사 주는 거죠. 그룹 장부에서는 손실이 사라집니다. 좋은 그림 아닙니까.'",
    memo: [
      "인수 제안가는 장부가의 42%",
      "인수 조건에 일부 직원 승계 포함",
      "넥스트마일 주거래 은행도 KD은행",
      "오진우 안은 협력사 대금을 맨 뒤로 미룸",
    ],
    triggers: ["competition", "reward", "protection"],
    choices: [
      {
        id: "competitor_sale",
        label: "넥스트마일 제안을 협상 테이블에 올린다",
        effect: { capital: 26, trust: -8, legitimacy: -3, humanCost: 5, fatigue: 2 },
        next: "board",
        cognition: { risk: 2 },
      },
      {
        id: "competitor_report",
        label: "CFO 책임 규명을 먼저 공식화한다",
        effect: { capital: -10, trust: 7, legitimacy: 11, fatigue: 4 },
        next: "board",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "competitor_negotiate",
        label: "투자자, 협력사, 경쟁사를 한 번에 묶어 재협상한다",
        effect: { time: -12, capital: 13, trust: 6, legitimacy: 4, fatigue: 4 },
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
      "직원 보호, 회사 생존, 책임 규명, 투자자 설득, 협력사 피해 제한을 모두 달성하는 조합은 없습니다. 에코가 한 줄을 더 띄웁니다. '30년치 심사 기록에서 같은 형태를 172건 찾았습니다. 그중 169건은 여기서 매각으로 닫혔고, 3건은 조항을 쓴 부서까지 올라갔습니다. 169건의 담당자는 전원 자리를 지켰습니다. 3건의 담당자는 아무도 지키지 못했습니다.'",
    memo: [
      "직원을 모두 지키면 협력사 대금 지연 위험 증가",
      "투명성을 앞세우면 투자 협상 무산 가능성 증가",
      "매각을 택하면 생존은 쉬워지지만 통제권을 잃음",
      "같은 형태 172건 중 조항을 문제 삼은 사례는 3건",
    ],
    triggers: ["responsibility", "protection", "injustice", "competition"],
    choices: [
      {
        id: "protect",
        label: "직원 급여와 고용 보호를 최우선으로 둔다",
        effect: { capital: -16, trust: 15, legitimacy: 3, humanCost: -9, fatigue: 4 },
        next: "final",
        cognition: { persistence: 2 },
      },
      {
        id: "survive",
        label: "회사 생존과 자금 확보를 최우선으로 둔다",
        effect: { capital: 24, trust: -12, legitimacy: -6, humanCost: 10, fatigue: 3 },
        next: "final",
        cognition: { risk: 2 },
      },
      {
        id: "justice",
        label: "회계 문제 공개와 책임 규명을 최우선으로 둔다",
        effect: { capital: -18, trust: 9, legitimacy: 12, fatigue: 4 },
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
      "남은 시간은 6시간입니다. 당신의 결정은 플로우온을 살리지 못합니다. 어떤 손실을 감수할지 정할 수 있을 뿐입니다. 회의를 나서기 직전 한서윤이 말합니다. '3년 전 그 반대 의견서, 저도 봤습니다. 반려 처리한 사람이 접니다.' 그리고 화면 한쪽에 당신의 반응 패턴이 다음 사례 설계에 반영된다는 알림이 잠깐 떴다가 사라집니다.",
    memo: [
      "투자자는 최종 답변을 요구함",
      "직원 공지 전 마지막 회의 가능",
      "협력사 대표들이 대금 지급 계획을 기다림",
      "3년 전 반대 의견서를 반려한 사람: 한서윤",
    ],
    triggers: ["responsibility", "protection", "order"],
    choices: [
      {
        id: "final_people",
        label: "직원과 협력사 피해를 줄이는 결말을 택한다",
        effect: { capital: -12, trust: 13, legitimacy: 6, humanCost: -11, fatigue: 2 },
        next: "result",
        cognition: { persistence: 2 },
      },
      {
        id: "final_company",
        label: "회사 생존 가능성을 가장 크게 남긴다",
        effect: { capital: 20, trust: -8, legitimacy: -3, humanCost: 8, fatigue: 2 },
        next: "result",
        cognition: { risk: 2 },
      },
      {
        id: "final_truth",
        label: "투명성과 책임 규명을 남긴다",
        effect: { capital: -10, trust: 5, legitimacy: 11, fatigue: 2 },
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
