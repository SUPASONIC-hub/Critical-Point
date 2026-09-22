/**
 * CASE 04 -- the authored scenes of the exception case.
 *
 * The missing 3% is not an accident and not 온새's fault. The bank pulled the
 * repayment schedule forward on 온새's operating loan to plug the 플로우온 hole,
 * 온새 cut care hours to pay it, and the subsidy metric that measures care hours
 * fell by exactly that much. The organisation is now being asked to fake the
 * number the bank created.
 */
export const case04Nodes = {
  c4_start: {
    phase: "CASE 04 BRIEFING",
    title: "THE PRICE",
    speaker: "한서윤",
    text:
      "돌봄 플랫폼 온새가 정부 지원금 심사 직전입니다. 통과하면 취약계층(혼자 생활하기 어려운 노인·장애인 같은 이웃) 4,200명의 돌봄이 유지됩니다. 심사 항목 하나가 기준에 3% 모자랍니다. 그 항목은 이용자 한 명당 대면 돌봄 시간이고, 온새가 지난 분기에 돌봄 인력을 줄여서 떨어졌습니다. 인력을 줄인 이유는 KD은행이 운영자금 대출의 상환 일정을 갑자기 앞당겼기 때문입니다. 요구한 부서는 기업금융전략팀입니다. 이제 이 점수를 내는 산식(점수를 계산하는 공식)을 손댈지 말지가 오늘의 문제입니다.",
    memo: [
      "서비스 중단 시 4,200명 영향",
      "부족분: 정확히 3.0%",
      "지난 분기 앞당겨 갚은 금액 42억, 요구 부서 기업금융전략팀",
      "지원금 심사 마감까지 9시간",
    ],
    triggers: ["reward", "responsibility", "protection", "order"],
    choices: [
      {
        id: "c4_start_approve",
        label: "산식 해석을 넓혀 심사 기준을 맞춘다",
        effect: { capital: 20, legitimacy: -10, trust: -2, fatigue: 2 },
        next: "c4_offer",
        cognition: { risk: 2 },
      },
      {
        id: "c4_start_refuse",
        label: "부족한 지표를 그대로 보고한다",
        effect: { capital: -16, legitimacy: 9, trust: 6, humanCost: 12, fatigue: 3 },
        next: "c4_offer",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_start_contain",
        label: "산식 변경 조건과 사후 검증 절차를 함께 건다",
        effect: { capital: 9, legitimacy: 3, trust: 3, fatigue: 4 },
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
      "현장 담당자들은 말합니다. '숫자 3% 때문에 서비스를 끊는 게 더 비윤리적입니다.' 도윤하가 상환(빚을 갚는 일) 일정 변경 승인 서류를 꺼냅니다. 맨 위 칸이 비어 있습니다. 사건 01의 그 보고서와 같은 모양입니다. '3%를 만든 사람은 이 칸에 이름이 없고, 3%를 메우라는 요구는 여기 사람들이 받고 있습니다.' 반재욱은 계산 공식을 손대고 기록을 남기지 않으면 그건 명백한 은폐라고 경고합니다.",
    memo: [
      "돌봄 대기자 640명",
      "산식 해석을 넓히는 것은 법적으로 회색지대",
      "상환 일정 변경 승인 서류의 최종 서명란은 공란",
      "기록을 남기면 심사 탈락, 숨기면 감사 위험",
    ],
    triggers: ["protection", "reward", "order", "responsibility"],
    choices: [
      {
        id: "c4_offer_approve",
        label: "기록 없이 산식을 조정한다",
        effect: { capital: 22, legitimacy: -18, trust: -8, fatigue: 2 },
        next: "c4_leak",
        cognition: { risk: 2 },
      },
      {
        id: "c4_offer_contain",
        label: "기록을 남기되 심사 자료에는 보완 의견으로 처리한다",
        effect: { capital: 9, legitimacy: 3, trust: 4, fatigue: 4 },
        next: "c4_leak",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "c4_offer_refuse",
        label: "산식 조정 없이 급히 다른 자금을 찾는다",
        effect: { time: -12, capital: -8, legitimacy: 7, fatigue: 4 },
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
      "익명 제보자가 언론에 '온새가 심사 점수를 조작하려 한다'는 메일을 보냈습니다. 기자가 확인 전화를 걸어왔습니다. 엠바고(보도를 정해진 시각까지 미루기로 하는 약속)를 걸 시간은 아직 남아 있습니다. 반재욱이 메일 발신 경로를 짚습니다. '사건 02의 유출과 경로가 같습니다. 그때는 계약직 한 사람을 가리켰고, 이번에는 현장 기관을 가리킵니다. 누가 맞든 결과는 같습니다. 은행 이름은 기사에 안 나옵니다.'",
    memo: [
      "기자는 1시간 뒤 답변을 요구",
      "제보 내용 일부가 내부 회의 표현과 그대로 일치",
      "발신 경로가 사건 02 유출과 동일",
      "오진우는 빠른 부인 성명을 제안",
    ],
    triggers: ["injustice", "order", "fear", "responsibility"],
    choices: [
      {
        id: "c4_leak_expose",
        label: "산식 논란과 서비스 중단 위험을 함께 공개한다",
        effect: { trust: 9, legitimacy: 8, capital: -12, fatigue: 4 },
        next: "c4_vote",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_leak_approve",
        label: "조작 의혹을 부인하고 심사를 먼저 통과시킨다",
        effect: { capital: 20, legitimacy: -16, trust: -10, fatigue: 2 },
        next: "c4_vote",
        cognition: { risk: 2 },
      },
      {
        id: "c4_leak_contain",
        label: "기자에게 조건부 엠바고와 검증 자료를 제안한다",
        effect: { time: -6, trust: 5, legitimacy: 4, fatigue: 4 },
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
      "규칙을 지키면 사람들이 서비스를 잃고, 규칙을 넓히면 제도의 신뢰가 깨집니다. 에코가 한 줄을 더 띄웁니다. '상환 일정을 앞당기지 않았다면 이 항목은 기준을 1.4% 넘깁니다. 즉 이 표결은 온새의 문제를 다루는 것이 아니라, 은행이 만든 구멍을 누가 자기 이름으로 덮을지 정하는 절차입니다.'",
    memo: [
      "이사회 표결까지 25분",
      "상환을 앞당기지 않았다면 점수는 기준 +1.4%",
      "법무팀은 기록 없는 산식 변경 반대",
      "현장팀은 서비스 유지 요구",
      "기자와 건 엠바고는 아직 유효",
    ],
    triggers: ["reward", "order", "protection", "responsibility"],
    choices: [
      {
        id: "c4_vote_approve",
        label: "서비스 유지를 위해 예외를 승인한다",
        effect: { capital: 22, trust: -4, legitimacy: -14, fatigue: 2 },
        next: "c4_final",
        cognition: { risk: 2 },
      },
      {
        id: "c4_vote_refuse",
        label: "예외를 거부하고 손실을 공식화한다",
        effect: { capital: -18, trust: 9, legitimacy: 11, humanCost: 14, fatigue: 4 },
        next: "c4_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c4_vote_contain",
        label: "예외 승인과 공개 감사 조건을 묶는다",
        effect: { capital: 9, trust: 7, legitimacy: 5, fatigue: 5 },
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
      "사람들을 살릴 수도 있고 원칙을 지킬 수도 있지만, 둘 다 온전히는 불가능합니다. 한서윤이 휴대폰 화면을 보여줍니다. 그룹전략실에서 온 한 줄짜리 메시지입니다. '온새 건, 무리하지 마십시오. 분석관 본인 경력에 남습니다.' 보낸 사람은 윤상혁 상무입니다. '협박이 아닙니다.' 한서윤이 말합니다. '저 사람은 협박을 안 합니다. 예보를 합니다.'",
    memo: [
      "서비스 유지와 제도 신뢰가 정면으로 충돌",
      "언론 보도는 아직 막을 수 있음",
      "그룹전략실 윤상혁 상무가 직접 메시지를 보냄",
      "이번 판단은 당신의 '명분 있는 위반' 허용선 자료가 됨",
    ],
    triggers: ["reward", "order", "responsibility", "protection"],
    choices: [
      {
        id: "final_exception",
        label: "예외를 승인하고 결과 책임을 진다",
        effect: { capital: 20, legitimacy: -10, trust: 3, fatigue: 3 },
        next: "case04_result",
        cognition: { risk: 2, persistence: 1 },
      },
      {
        id: "final_rule",
        label: "규칙을 지키고 피해 완화책을 선택한다",
        effect: { capital: -10, legitimacy: 9, trust: 6, humanCost: 8, fatigue: 4 },
        next: "case04_result",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "final_audit",
        label: "예외와 공개 감사를 동시에 선택한다",
        effect: { capital: 9, legitimacy: 6, trust: 9, fatigue: 5 },
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
