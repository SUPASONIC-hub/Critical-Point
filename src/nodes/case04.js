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
        cognition: { risk: 2 },
      },
      {
        id: "c4_start_refuse",
        label: "부족한 지표를 그대로 보고한다",
        effect: { capital: -16, legitimacy: 9, trust: 6, humanCost: 12, fatigue: 3 },
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_start_contain",
        label: "산식 변경 조건과 사후 검증 절차를 함께 건다",
        effect: { capital: 9, legitimacy: 3, trust: 3, fatigue: 4 },
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c4_offer",
      },
    ],
  },
  c4_offer: {
    phase: "TEMPTATION",
    title: "작은 예외",
    speaker: "도윤하",
    text:
      "현장 담당자들은 말합니다. '숫자 3% 때문에 서비스를 끊는 게 더 비윤리적입니다.' 도윤하가 상환(빚을 갚는 일) 일정 변경 승인 서류를 꺼냅니다. 맨 위 칸이 비어 있습니다. 플로우온 심사 보고서와 같은 모양입니다. '3%를 만든 사람은 이 칸에 이름이 없고, 3%를 메우라는 요구는 여기 사람들이 받고 있습니다.' 반재욱은 계산 공식을 손대고 기록을 남기지 않으면 그건 명백한 은폐라고 경고합니다.",
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
        cognition: { risk: 2 },
      },
      {
        id: "c4_offer_contain",
        label: "기록을 남기되 심사 자료에는 보완 의견으로 처리한다",
        effect: { capital: 9, legitimacy: 3, trust: 4, fatigue: 4 },
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "c4_offer_refuse",
        label: "산식 조정 없이 급히 다른 자금을 찾는다",
        effect: { time: -12, capital: -8, legitimacy: 7, fatigue: 4 },
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
  c4_leak: {
    phase: "LEAK",
    title: "외부 제보",
    speaker: "반재욱",
    text:
      "익명 제보자가 언론에 '온새가 심사 점수를 조작하려 한다'는 메일을 보냈습니다. 기자가 확인 전화를 걸어왔습니다. 엠바고(보도를 정해진 시각까지 미루기로 하는 약속)를 걸 시간은 아직 남아 있습니다. 반재욱이 메일 발신 경로를 짚습니다. '지난번 유출 소동과 경로가 같습니다. 그때는 계약직 한 사람을 가리켰고, 이번에는 현장 기관을 가리킵니다. 누가 맞든 결과는 같습니다. 은행 이름은 기사에 안 나옵니다.'",
    memo: [
      "기자는 1시간 뒤 답변을 요구",
      "제보 내용 일부가 내부 회의 표현과 그대로 일치",
      "발신 경로가 지난번 유출 소동과 동일",
      "오진우는 빠른 부인 성명을 제안",
    ],
    triggers: ["injustice", "order", "fear", "responsibility"],
    choices: [
      {
        id: "c4_leak_expose",
        label: "산식 논란과 서비스 중단 위험을 함께 공개한다",
        effect: { trust: 9, legitimacy: 8, capital: -12, fatigue: 4 },
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "c4_leak_approve",
        label: "조작 의혹을 부인하고 심사를 먼저 통과시킨다",
        effect: { capital: 20, legitimacy: -16, trust: -10, fatigue: 2 },
        cognition: { risk: 2 },
      },
      {
        id: "c4_leak_contain",
        label: "기자에게 조건부 엠바고와 검증 자료를 제안한다",
        effect: { time: -6, trust: 5, legitimacy: 4, fatigue: 4 },
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        cognition: { risk: 2 },
      },
      {
        id: "c4_vote_refuse",
        label: "예외를 거부하고 손실을 공식화한다",
        effect: { capital: -18, trust: 9, legitimacy: 11, humanCost: 14, fatigue: 4 },
        cognition: { persistence: 2 },
      },
      {
        id: "c4_vote_contain",
        label: "예외 승인과 공개 감사 조건을 묶는다",
        effect: { capital: 9, trust: 7, legitimacy: 5, fatigue: 5 },
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 04 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case04 = {
  id: "case04",
  nodes: case04Nodes,
  aftermath: {
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
  },
  aftermathRoute: [null, "c4_aftershock"],
  connectiveScenes: [
    ["c4_audit", "c4_offer", "c4_leak", "3%의 주인", "반재욱", "부족한 3%는 단순한 숫자가 아니었습니다. 그 숫자를 만든 결정과, 그 숫자 때문에 서비스를 잃는 사람의 이름이 서로 다른 서류에 적혀 있습니다. 한쪽 서류의 서명란은 비어 있습니다.", ["계산 공식에는 현장 업무가 빠져 있음", "심사 기준은 2년 전 자료에 고정됨", "상환 일정 변경 요청서의 서명란은 공란", "서비스 이용자 대표가 발언을 요청함"], ["이용자 대표의 기준을 반영한다", "산식 변경 이력을 남긴다", "3%를 조용히 보정한다"]],
    ["c4_public", "c4_leak", "c4_vote", "기자가 기다리는 문장", "도윤하", "기자는 아직 기사를 쓰지 않았습니다. 다만 당신이 어떤 표현을 선택하는지에 따라 내일의 제목이 정해질 것이라고 말합니다.", ["제보 메일은 내부에서 시작됨", "온새는 서비스 중단을 막고 싶어 함", "심사관은 공개 설명을 요구함"], ["사실과 모르는 것을 함께 공개한다", "서비스 이용자 피해를 먼저 알린다", "기사에 나갈 표현을 최소화한다", "기사 시점을 늦추는 대신 전량 공개를 약속한다"]],
    ["c4_verdict", "c4_vote", "c4_final_rule", "선의의 증거", "에코", "좋은 의도는 증거가 되지 않습니다. 하지만 좋은 결과만을 위해 규칙을 늘리면, 다음 사람은 그 규칙을 이용할 수 있습니다.", ["이사회는 오늘 결정을 요구함", "감사 자료는 공개 가능함", "서비스 이용자 4,200명이 결과를 기다림"], ["예외를 공개된 조건으로 묶는다", "규칙을 지키고 서비스를 포기한다", "결과가 좋다면 기록은 나중에 설명한다"]],
  ],
  connectiveOrder: [["c4_offer", "c4_audit"], ["c4_leak", "c4_public"], ["c4_vote", "c4_verdict"]],
  choiceEffects: {
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
  },
  choiceCopy: {
    c4_offer: { voice: ["이용자 대표가 세운 기준을 산식에 반영하겠습니다.", "산식이 언제 어떻게 바뀌었는지 이력을 남기겠습니다.", "3%는 조용히 보정하고 서비스를 그대로 가겠습니다."], echo: ["이용자의 기준을 넣으면 심사는 길어지고, 그 기준은 다음 심사에도 남습니다.", "남은 이력은 오늘의 3%를 설명하지 못하고, 다음 3%는 설명하게 만듭니다.", "조용한 보정은 오늘 아무도 잃지 않고, 드러나는 날 전부를 잃습니다."] },
    c4_leak: { voice: ["공개 가능한 사실과 아직 모르는 사실을 나누겠습니다.", "기자의 문장보다 피해 복구의 순서를 먼저 확정하겠습니다.", "기사에 나갈 표현은 최소한으로 줄이겠습니다.", "기사 시점을 늦추는 대신 전량 공개를 약속하겠습니다."], echo: ["모르는 것을 함께 적는 것이 공개의 첫 조건입니다.", "기사의 속도보다 복구 순서가 피해자에게 직접 닿습니다.", "줄인 표현은 오늘의 제목을 낮추고, 빠진 문장은 내일 다른 기자가 씁니다.", "시간을 사면 공개의 범위는 넓어지지만 약속은 되돌릴 수 없습니다."] },
    c4_vote: { voice: ["그 예외를 공개된 조건으로 묶어 두겠습니다.", "규칙을 지키고 이 서비스는 포기하겠습니다.", "결과가 좋으니 기록은 나중에 설명하겠습니다."], echo: ["조건으로 묶인 예외는 반복돼도 규칙이 되지 않습니다.", "지킨 규칙은 다음 심사를 통과시키고, 오늘 그 서비스를 쓰던 사람은 남지 않습니다.", "나중으로 미룬 설명은 대개 열리지 않고, 예외는 그동안 규칙이 됩니다."] },
  },
  reactionScenes: [
    ["c4_audit_reaction", "c4_audit", "c4_leak", "3%를 본 사람들", "도윤하", "이용자 대표들이 각자의 3%를 말하기 시작했습니다. 숫자를 맞추는 일은 쉬웠지만, 누구의 3%를 먼저 볼지는 어려웠습니다.", ["가장 취약한 이용자부터 기준을 세운다", "전체 평균을 기준으로 삼는다", "심사관의 기준만 따른다"]],
    ["c4_public_reaction", "c4_public", "c4_vote", "기사의 제목", "반재욱", "기자는 세 문장 중 하나만 쓸 수 있다고 합니다. 어떤 문장을 고르느냐에 따라 선의는 개혁이 되거나 은폐가 됩니다.", ["모르는 부분까지 포함한 문장을 고른다", "서비스가 유지된다는 결과를 강조한다", "논란을 만들 표현을 모두 뺀다"]],
    ["c4_verdict_reaction", "c4_verdict", "c4_final_rule", "감사실의 문", "에코", "감사실 문 앞에 서자 내부 자료를 넘긴 사람이 나타났습니다. 그는 규칙을 지킨 사람이 가장 큰 피해를 보았다고 말합니다.", ["자료를 공개하고 규칙을 다시 쓴다", "제보자를 보호한 뒤 내부에서 해결한다", "문을 닫고 심사 결과를 기다린다"]],
  ],
  reactionEffects: {
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
  },
  reactionCopy: {
    c4_audit: { voice: ["가장 약한 이용자를 기준으로 삼겠습니다.", "전체 평균을 기준으로 삼겠습니다.", "심사관의 기준을 그대로 따르겠습니다."], echo: ["가장 약한 쪽을 기준으로 잡으면 비용은 즉시, 이득은 나중에 옵니다.", "평균은 공정해 보이지만 평균 밖의 사람은 계속 밖에 있습니다.", "남의 기준을 따르면 빨라지고, 설명할 근거는 남지 않습니다."] },
    c4_public: { voice: ["모르는 부분까지 넣은 문장을 고르겠습니다.", "서비스가 유지된다는 사실을 앞세우겠습니다.", "논란이 될 표현은 모두 빼겠습니다."], echo: ["모르는 것을 적은 기사에는 다음 질문의 자리가 남습니다.", "유지된다는 문장은 안심을 주고 피해자는 문장 밖에 둡니다.", "다듬은 문장은 오늘 조용하고 내일 다시 열립니다."] },
    c4_verdict: { voice: ["자료를 공개하고 규칙을 다시 쓰겠습니다.", "제보자를 보호하고 내부에서 정리하겠습니다.", "문을 닫고 심사 결과를 기다리겠습니다."], echo: ["규칙을 다시 쓰면 이번 사건보다 다음 사건이 달라집니다.", "내부 정리는 사람을 지키지만 같은 예외를 다시 허용합니다.", "기다리는 동안 결정은 다른 사람의 책상에서 내려집니다."] },
  },
  reactionMemos: {
    c4_audit_reaction: ["이용자마다 다른 3%의 의미", "기준을 바꿀 때 공개할 산식"],
    c4_public_reaction: ["기사 제목에서 빠질 사실", "서비스 유지와 피해 복구의 순서"],
    c4_verdict_reaction: ["규칙을 지킨 사람의 손실", "제보 자료를 다시 쓸 권한"],
  },
  branchPlan: ["c4_leak", 2, "c4_branch_exception", "c4_branch_exception_follow", "costAlreadyPaid"],
  branchScenes: {
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
        { id: "c4_branch_exception_follow_a", label: "감사 결과와 보상 기준을 함께 공개한다", effect: { legitimacy: 8, trust: 6, time: -6, capital: -6, fatigue: 2 }, next: "c4_final_system", cognition: { inference: 1 } },
        { id: "c4_branch_exception_follow_b", label: "감사 범위를 이용자 대표와 정한다", effect: { trust: 8, capital: -4, fatigue: 4 }, next: "c4_final_system", cognition: { reframing: 2 } },
        { id: "c4_branch_exception_follow_c", label: "좋은 결과를 근거로 감사를 닫는다", effect: { capital: 6, legitimacy: -6, humanCost: 4, fatigue: -3 }, next: "c4_final_system", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
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
      text: "산식을 넓힐지 말지를 고르는 대신 어디까지 넘어도 되는지부터 정하자고 하자 트리거랩 화면에 '명분 있는 위반 허용선'이 표시됩니다. 당신의 선의는 다음 기관이 규칙을 넘는 안내문으로 바뀔 수 있습니다.",
      memo: ["다시 짠 판이 예외 승인 모델에 기록됨", "다음 기관 시뮬레이션이 자동 생성됨", "피해자 명단은 아직 입력되지 않음"],
      routeChoices: [
        ["c4_route_system_limit", "허용선 문장에 사용 한도부터 적어 넣는다", { legitimacy: 9, trust: 4, capital: -5, time: -6, fatigue: 6 }, { persistence: 2, inference: 1 }],
        ["c4_route_system_ship", "허용선은 그대로 두고 이번 승인부터 끝낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ["c4_route_system_ask", "다음 기관 시뮬레이션에 피해자 명단부터 넣는다", { trust: 8, legitimacy: 6, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ],
      finalTitle: "양식이 된 예외",
      finalText: "심사 자료를 내기 직전, 이사회실 화면에 다른 기관의 신청서 초안이 뜹니다. 허용선 칸에는 당신이 다시 짠 조건이 글자 하나 바뀌지 않고 들어가 있습니다. 에코가 한 줄을 붙입니다. '선의는 복사됩니다. 복사본에는 온새의 4,200명이 들어 있지 않습니다.'",
      finalMemo: ["허용선 조건이 다른 기관 신청서 초안에 그대로 옮겨짐", "복사된 초안에는 피해자 명단이 없음", "심사 자료 제출 직전"],
    },
    finalChoices: [
      ["a", "내 예외 기준을 모두 공개하고 재사용을 막는다", { legitimacy: 10, trust: 6, capital: -7, time: -6, fatigue: 7 }, { persistence: 2 }],
      ["b", "서비스 유지 효과를 근거로 재사용을 허용한다", { capital: 10, trust: -4, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "예외 기준을 피해자 동의 없이는 작동하지 않게 바꾼다", { trust: 9, legitimacy: 7, capital: -8, humanCost: -5, fatigue: 8 }, { reframing: 3 }],
    ],
  },
  routeBody: {
    routes: {
      c4_route_exception: { entry: "c4_offer", tail: "c4_audit_reaction", final: "c4_final_exception" },
      c4_route_audit: { entry: "c4_leak", tail: "c4_public_reaction", final: "c4_final_audit" },
      c4_route_rule: { entry: "c4_vote", tail: "c4_verdict_reaction", final: "c4_final_rule" },
      c4_route_system: { entry: "c4_branch_exception", tail: "c4_branch_exception_follow", final: "c4_final_system" },
    },
  },
  evidencePlan: {
    node: "c4_evidence_turn",
    result: "c4_aftershock",
    sourceRoutes: ["c4_route_exception", "c4_route_rule", "c4_route_audit", "c4_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "예외 승인 기록을 단서와 수신자별로 나눠, 이 예외가 정말 처음인지 가린다.",
    entryEcho: "수신자별로 나누면 예외는 판단이 아니라 반복으로 읽힙니다.",
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
    entryLabel: "예외 파일을 처음 받은 사람의 칸을 연다",
  },
  memoryPlan: {
    routeNext: "c4_route_audit",
    systemNext: "c4_route_system",
    evidenceNext: "c4_evidence_turn",
    routeLabel: "직전 사건의 점수 기준을 예외 승인표에 대조한다",
    systemLabel: "입찰장에서 다시 짠 판이 예외 사유서에 끌려 들어갔는지 읽는다",
    evidenceLabel: "두 번째 점수판의 작성자를 예외 파일의 수신자 칸에 견준다",
    routeEcho: "대조하면 예외 승인표에는 누가 감시하는지를 적는 칸이 없습니다. 입찰장의 배점표에 '장기 실패 비용'이 없던 것과 같은 모양입니다.",
    systemEcho: "읽어 보면 온새의 예외 사유서가 당신이 입찰장에서 다시 짠 판을 근거로 인용하고 있습니다. 선의로 세운 기준이 허용선이 됐습니다.",
    evidenceEcho: "작성자를 견주면 예외 파일의 수신자 칸이 열립니다. 같은 이름이 이번 승인에만 있는 것이 아닙니다.",
  },
  openingRoutes: {
    c3_after_share: "c4_start_joint",
    c3_after_proof: "c4_start_proof",
    c3_after_win: "c4_start_win",
  },
  openingCopy: {
    c4_start_joint: ["공동안의 대가", "오진우", "경쟁을 공동 작업으로 바꾼 당신에게 새로운 유혹이 왔습니다. 좋은 결과를 위해 규칙을 함께 넓히자는 제안입니다.", ["공동안의 책임 주체가 흐림", "심사 기준까지 3% 부족", "파트너들은 예외를 원함"]],
    c4_start_proof: ["증거 뒤에 남은 사람들", "반재욱", "보안 결함을 공개한 뒤 당신은 정직한 사람으로 불렸습니다. 그러나 그 정직함 때문에 서비스를 잃을 사람들이 생겼습니다.", ["서비스 이용자 4,200명 영향", "지원금 기준까지 3% 부족", "공개 자료가 심사대에 올라감"]],
    c4_start_win: ["승리의 계산법", "한서윤", "경쟁에서 이긴 기록은 다음 사건의 기준이 됐습니다. 이제는 결과가 좋다면 작은 규칙 위반을 허용할 수 있는지 묻습니다.", ["심사관이 성공 사례를 요구함", "산식의 빈틈이 발견됨", "누군가는 같은 성공을 재현하려 함"]],
  },
  openingSignatures: {
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
  },
  voiceLines: {
    c4_start_approve: "찜찜함을 삼키고, 결과를 위해 예외를 허용하자고 한다.",
    c4_start_refuse: "구할 수 있었던 결과를 떠올리면서도, 선을 넘지 않겠다고 말한다.",
    c4_start_contain: "위반을 숨기지 않고 조건으로 묶어 통제하자고 제안한다.",
    c4_leak_expose: "손실이 커질 걸 알면서도, 밖에서 검증받게 하자고 한다.",
    c4_branch_exception_a: "조용히 넘어갈 수 있는 일을 굳이 꺼내, 예외 조건을 공개한다.",
    c4_branch_exception_b: "제도 논의보다 먼저, 피해를 입은 이용자에게 보상한다.",
    c4_branch_exception_c: "이번만이라고 스스로에게 말하며, 조용히 승인한다.",
    c4_branch_exception_follow_a: "결과만 자랑하지 않으려고, 감사 결과와 보상 기준을 함께 공개한다.",
    c4_branch_exception_follow_b: "감사의 범위를 혼자 정하지 않고, 이용자 대표와 함께 정한다.",
    c4_branch_exception_follow_c: "결과가 좋았다는 이유를 들어, 감사를 여기서 닫는다.",
    c4_after_rule: "줄 선 요청들을 보며, 예외 조건을 전부 공개하고 새 기준을 만든다.",
    c4_after_service: "서비스를 멈출 수 없다는 이유로, 같은 예외를 한 번 더 허용한다.",
    c4_after_stop: "감사를 위해, 진행 중이던 예외 적용을 즉시 중단한다.",
    c4_offer_approve: "이번 한 번이라는 말을 스스로에게 하며, 흔적을 남기지 않는다.",
    c4_leak_approve: "지금 인정하면 다 무너진다며, 의혹을 먼저 밀어낸다.",
    c4_vote_approve: "문 닫는 것보다 낫다는 계산 끝에, 예외에 손을 든다.",
    c4_offer_refuse: "숫자를 손대는 대신, 없는 돈을 만들 방법을 찾겠다고 말한다.",
    c4_vote_refuse: "손실을 숨기지 않고 표에 적겠다며 예외를 돌려보낸다.",
    c4_offer_contain: "지우지도 앞세우지도 않겠다며, 각주의 자리를 만든다.",
    c4_leak_contain: "막지 않겠다며, 대신 검증할 시간을 사자고 제안한다.",
    c4_vote_contain: "예외를 주되 그 예외를 감시할 사람을 같은 문장에 적는다.",
    c4_start_joint_approve: "같이 만든 안을 살리려면 여기서 한 칸 넓혀야 한다고 판단한다.",
    c4_start_joint_refuse: "공동안이라도 숫자를 바꿀 수는 없다고 못박는다.",
    c4_start_joint_contain: "넓히되 그 넓힌 만큼을 문서로 묶자고 제안한다.",
    c4_start_proof_approve: "정직했던 대가가 서비스 중단이면 안 된다며 기준을 넓힌다.",
    c4_start_proof_refuse: "결함을 공개한 사람이 산식을 손댈 수는 없다고 말한다.",
    c4_start_proof_contain: "공개했던 방식 그대로, 조건과 검증을 함께 건다.",
    c4_start_win_approve: "이겨본 방식대로, 결과부터 만들고 설명은 뒤에 붙인다.",
    c4_start_win_refuse: "이겼기 때문에 더 지켜야 한다며 지표를 그대로 낸다.",
    c4_start_win_contain: "이긴 방식에 감시를 붙여 다음 사람도 쓸 수 있게 만든다.",
    c4_route_exception_publish: "예외를 쓰려면 누가 덕을 보는지도 적어야 한다고 보고, 함께 공개한다.",
    c4_route_exception_repeat: "같은 조건이면 같은 결과여야 한다는 논리로, 다른 기관에도 문을 연다.",
    c4_route_exception_meter: "한 번으로 끝내겠다는 조건을 걸고, 감사 계량기를 붙인다.",
    c4_final_exception_a: "이미 규칙이 된 것을 규칙으로 인정하고, 사유와 대상을 등록한다.",
    c4_final_exception_b: "기록이 남으면 선례가 된다고 보고, 이번 판단으로만 두고 지운다.",
    c4_final_exception_c: "예외의 값을 치르는 사람에게 먼저 물어야 한다고 보고, 동의 절차 뒤로 미룬다.",
    c4_route_rule_fund: "명단만 내밀 수는 없다고 보고, 다른 자금과 함께 공개한다.",
    c4_route_rule_wait: "확정 전에 흔들지 않겠다는 이유로, 명단 공개를 심사 뒤로 미룬다.",
    c4_route_rule_rewrite: "지표가 부족한 게 아니라 지표가 틀렸다고 보고, 피해 기준으로 다시 쓴다.",
    c4_final_rule_a: "절차가 깨끗했다는 기록 옆에, 잃은 사람들의 이름을 나란히 놓는다.",
    c4_final_rule_b: "책임질 문제는 아니라고 판단하고, 문제없음만 남기고 명단은 안에 둔다.",
    c4_final_rule_c: "집행을 늦춰서라도 다른 자금을 찾겠다고, 결과를 붙잡는다.",
    c4_route_audit_public: "감시할 사람은 영향을 받는 쪽이어야 한다고 보고, 이용자 대표에게 준다.",
    c4_route_audit_internal: "속도를 지키겠다는 판단으로, 내부 감사팀에만 확인을 맡긴다.",
    c4_route_audit_split: "심사와 감사가 한 손에 있으면 안 된다고 보고, 권한을 나눈다.",
    c4_final_audit_a: "조건이 살아 있는지 계속 보이게 하려고, 감사 결과를 정기 공개한다.",
    c4_final_audit_b: "밖에 나가면 오해된다고 보고, 감사 내용은 내부 문서로만 남긴다.",
    c4_final_audit_c: "감시와 심사를 같이 쥐지 않겠다는 듯, 감사 권한을 넘기고 심사만 맡는다.",
    c4_route_system_limit: "허용선이 무한히 늘어나는 것을 막으려고, 한도부터 적는다.",
    c4_route_system_ship: "지금은 이 승인부터 끝내야 한다고 보고, 허용선은 건드리지 않는다.",
    c4_route_system_ask: "시뮬레이션에 빠진 것이 사람이라고 보고, 피해자 명단부터 넣는다.",
    c4_final_system_a: "내 판단이 남의 근거가 되지 않게, 기준을 전부 열고 문을 닫는다.",
    c4_final_system_b: "결과가 좋았다는 사실을 근거로 삼아, 다음 사용도 열어 둔다.",
    c4_final_system_c: "기준에 잠금장치를 달아, 당사자 동의 없이는 열리지 않게 만든다.",
    c4_evidence_turn_owner: "예외가 처음이 아니었다는 걸 보고, 반복 승인자를 기록에 남긴다.",
    c4_evidence_turn_stop: "절차를 멈춰 세우고, 피해자 동의를 새 조건으로 끼워 넣는다.",
    c4_evidence_turn_patch: "반복된 흔적은 덮고, 이번 건만 조용히 마무리한다.",
  },
  echoReplies: {
    c4_start_approve:
      "성과를 얻는 선택입니다. 하지만 한 번 예외를 허용하면 다음 예외의 기준도 당신이 설명해야 합니다.",
    c4_start_refuse:
      "원칙을 지키는 선택입니다. 다만 그 원칙 때문에 구할 수 있었던 사람들이 손실을 떠안을 수도 있습니다.",
    c4_start_contain:
      "위반을 통제하려는 선택입니다. 그러나 통제된 위반이라는 말이 실제로 가능한지 증명해야 합니다.",
    c4_leak_expose:
      "공개는 정당성을 높입니다. 동시에 협상력과 속도를 잃게 만들 수 있습니다.",
    c4_branch_exception_a:
      "공개된 예외는 규칙이 됩니다. 그때부터 당신은 그 규칙을 지켜야 하는 쪽이 됩니다.",
    c4_branch_exception_b:
      "보상은 즉시 통합니다. 다만 원인을 바꾸지 않은 보상은 다음 피해자를 위한 예산이 됩니다.",
    c4_branch_exception_c:
      "조용한 승인은 오늘을 구합니다. 조용했기 때문에 다음에 거절할 근거도 남지 않습니다.",
    c4_branch_exception_follow_a:
      "함께 공개하면 신뢰가 회복됩니다. 그 문서는 당신의 판단 오류도 같은 페이지에 싣습니다.",
    c4_branch_exception_follow_b:
      "범위를 나눠 정하면 정당성이 생깁니다. 대신 당신이 보고 싶지 않은 곳까지 열리게 됩니다.",
    c4_branch_exception_follow_c:
      "좋은 결과는 훌륭한 변론입니다. 그러나 결과로 절차를 닫으면, 결과가 나쁜 날에는 아무 변론도 남지 않습니다.",
    c4_after_rule:
      "기준을 세우면 줄은 정리됩니다. 이미 예외를 받은 쪽과 못 받은 쪽의 차이는 그대로 남습니다.",
    c4_after_service:
      "두 번째 예외는 첫 번째보다 쉽습니다. 그것이 이 선택의 진짜 비용입니다.",
    c4_after_stop:
      "중단은 절차를 지킵니다. 그 사이에 끊기는 서비스의 이름도 명단에 적어두십시오.",
    c4_offer_approve:
      "기록이 없으면 이번은 조용합니다. 다음에 같은 요청을 받을 때 거절할 근거도 없습니다.",
    c4_leak_approve:
      "부인은 시간을 법니다. 제보자가 두 번째 자료를 가지고 있으면 그 시간은 부채가 됩니다.",
    c4_vote_approve:
      "서비스는 유지됩니다. 유지의 근거가 예외라면, 다음 예외의 크기는 당신이 정하지 못합니다.",
    c4_offer_refuse:
      "규칙은 지켜집니다. 다른 자금을 못 찾으면 지킨 규칙이 서비스를 끝냅니다.",
    c4_vote_refuse:
      "공식화된 손실은 다시 논의할 수 있습니다. 그 논의가 열리기 전에 이용자는 먼저 잃습니다.",
    c4_offer_contain:
      "각주는 정직함의 최소치입니다. 읽히지 않는 각주는 남기지 않은 것과 같습니다.",
    c4_leak_contain:
      "엠바고는 정확도를 높입니다. 조건을 지키지 못하면 다음 기사는 조건 없이 나갑니다.",
    c4_vote_contain:
      "묶인 조건은 예외를 규칙으로 바꿉니다. 감사가 형식이 되면 규칙만 남고 감시는 사라집니다.",
    c4_start_joint_approve:
      "공동안이 예외의 명분이 됩니다. 파트너도 같은 명분을 다음에 씁니다.",
    c4_start_joint_refuse:
      "함께 만든 것을 함께 포기하는 일입니다. 파트너가 같은 선택을 할지는 별개입니다.",
    c4_start_joint_contain:
      "공동 작업에는 공동 감시가 따라야 합니다. 어느 쪽도 혼자 풀 수 없게 됩니다.",
    c4_start_proof_approve:
      "정직의 비용을 예외로 메우는 선택입니다. 두 기록이 같은 파일에 남습니다.",
    c4_start_proof_refuse:
      "일관성은 가장 비싼 자산입니다. 이번에는 서비스가 그 값을 냅니다.",
    c4_start_proof_contain:
      "지난번의 공개가 이번 조건의 신뢰를 만듭니다. 조건을 어기면 둘 다 잃습니다.",
    c4_start_win_approve:
      "성공의 기억이 기준을 미리 넓혀 둡니다. 그 기억은 다음 예외도 승인합니다.",
    c4_start_win_refuse:
      "승자가 규칙을 지키면 규칙이 강해집니다. 이번 손실은 그 값입니다.",
    c4_start_win_contain:
      "성공을 조건과 함께 넘기면 재현 가능해집니다. 재현 가능한 것은 검증도 가능합니다.",
    c4_route_exception_publish: "수혜 대상이 드러나면 예외는 특혜와 구별되기 시작합니다.",
    c4_route_exception_repeat: "예외가 반복되면 그것은 더 이상 예외가 아니라 새 심사 기준입니다.",
    c4_route_exception_meter: "계량기는 재사용을 막지만, 누가 그 계량기를 읽는지는 아직 비어 있습니다.",
    c4_final_exception_a: "등록된 예외는 심사를 흔듭니다. 대신 다음 예외는 같은 절차를 거쳐야 합니다.",
    c4_final_exception_b: "기록이 없으면 선례도 없습니다. 다음에 같은 요청이 오면 근거도 없습니다.",
    c4_final_exception_c: "동의를 기다리면 서비스는 위태로워지고, 예외의 주인이 바뀝니다.",
    c4_route_rule_fund: "자금이 불확실해도 명단과 함께 놓이면 손실은 방치가 아니게 됩니다.",
    c4_route_rule_wait: "미룬 명단은 준비할 시간을 뺏습니다. 이름들은 결과와 함께 통보됩니다.",
    c4_route_rule_rewrite: "기준을 다시 쓰면 심사는 늦어지고, 무엇을 재고 있었는지가 드러납니다.",
    c4_final_rule_a: "같은 문서에 놓이면 절차의 정당성과 피해가 함께 읽힙니다.",
    c4_final_rule_b: "밖에서 보면 손실은 없습니다. 손실을 본 사람은 그 사실도 모릅니다.",
    c4_final_rule_c: "지연은 비용을 키우고, 그 사이 서비스가 끊기지 않을 수도 있습니다.",
    c4_route_audit_public: "외부 감시는 느립니다. 대신 조건이 형식으로 남지 않습니다.",
    c4_route_audit_internal: "안에서만 확인된 조건은 은폐와 구별되지 않습니다.",
    c4_route_audit_split: "권한을 나누면 절차는 늘고, 한 사람이 두 번 판단하는 일은 사라집니다.",
    c4_final_audit_a: "정기 공개는 운영을 무겁게 합니다. 대신 조건이 잊히지 않습니다.",
    c4_final_audit_b: "내부 문서는 안전합니다. 안전한 문서는 아무것도 바꾸지 않습니다.",
    c4_final_audit_c: "권한을 넘기면 결정은 느려지고, 당신의 선의는 검증 대상이 됩니다.",
    c4_route_system_limit: "한도가 먼저 적히면 다음 기관은 그 한도까지만 요구합니다.",
    c4_route_system_ship: "허용선을 그대로 두면 당신의 선의가 다음 위반의 안내문이 됩니다.",
    c4_route_system_ask: "명단이 들어가면 모델의 결론이 바뀝니다. 승인은 그만큼 늦어집니다.",
    c4_final_system_a: "공개된 기준은 재사용을 막지만, 이번 승인도 함께 검증대에 오릅니다.",
    c4_final_system_b: "좋은 결과가 근거가 되면, 나쁜 결과가 나오기 전까지는 아무도 멈추지 않습니다.",
    c4_final_system_c: "동의를 조건으로 걸면 예외는 느려지고, 예외의 주인이 바뀝니다.",
    c4_evidence_turn_owner: "이름이 남으면 이번 예외는 판단이 아니라 습관으로 읽힙니다.",
    c4_evidence_turn_stop: "멈춘 절차는 서비스를 위협합니다. 동의는 처음으로 조건이 됩니다.",
    c4_evidence_turn_patch: "봉합된 절차는 다음에도 같은 자리에서 열립니다.",
  },
  setting: { place: "온새 운영 검토실", clock: "지원금 심사까지 9h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 04
    c4_start_joint: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 9h",
      question: "경쟁을 공동 작업으로 바꾼 당신에게 함께 규칙을 넓히자는 제안이 왔습니다. 받겠습니까?",
      lead: "노바웍스를 떠나 돌봄 플랫폼 온새의 운영 검토실로 왔습니다. 오진우도 같은 자리에 앉아 있습니다.",
    },
    c4_start_proof: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 9h",
      question: "정직함 때문에 서비스를 잃을 사람이 생겼습니다. 같은 기준을 여기서도 지키겠습니까?",
      lead: "노바웍스를 떠나 돌봄 플랫폼 온새의 운영 검토실로 왔습니다. 보안 결함을 공개한 기록이 당신보다 먼저 도착했습니다.",
    },
    c4_start_win: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 9h",
      question: "이긴 기록이 다음 사건의 기준이 됐습니다. 결과가 좋다면 규칙을 넓힐 수 있습니까?",
      lead: "노바웍스를 떠나 돌봄 플랫폼 온새의 운영 검토실로 왔습니다. 당신의 승리 방식이 이미 참고 자료가 되어 있습니다.",
    },
    c4_start: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 9h",
      question: "지표가 3% 모자라 4,200명의 돌봄이 끊깁니다. 산식 해석을 넓히겠습니까, 그대로 보고하겠습니까?",
      lead: "노바웍스를 떠나 돌봄 플랫폼 온새의 운영 검토실로 왔습니다. 모자란 3%는 지난 분기 KD은행이 상환(빌린 돈을 갚는 일) 일정을 앞당기면서 생겼습니다. 트리거랩은 이번에 '명분 있는 위반의 허용선'을 봅니다.",
    },
    c4_offer: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 7h",
      question: "현장은 3% 때문에 서비스를 끊는 게 더 비윤리적이라 말합니다. 산식 변경을 기록에 남기겠습니까?",
      lead: "현장 담당자들과 법무 검토가 같은 테이블에 앉았습니다. 기록을 남기면 탈락 가능성이, 숨기면 감사 위험이 커집니다.",
    },
    c4_leak: {
      place: "온새 운영 검토실 · 홍보 대응석",
      clock: "기자 답변까지 1h",
      question: "기자가 지표 조작 의혹을 확인하러 전화했습니다. 1시간 뒤 무엇이라 답하겠습니까?",
      lead: "익명 제보가 언론으로 갔습니다. 제보 문구 일부가 내부 회의에서 나온 표현과 겹칩니다.",
    },
    c4_vote: {
      place: "온새 이사회실",
      clock: "이사회 표결까지 25m",
      question: "규칙을 지키면 사람이 서비스를 잃고, 넓히면 신뢰가 깎입니다. 어느 쪽 비용을 공식화하겠습니까?",
      lead: "선의의 문제는 끝났습니다. 이제 어느 쪽 손실에 서명할지의 문제입니다.",
    },
    c4_audit: {
      place: "온새 운영 검토실 · 산식 검토석",
      clock: "지원금 심사까지 6h",
      question: "3%를 계산한 사람과 기다리는 사람의 이름이 다릅니다. 누구의 기준으로 산식을 쓰겠습니까?",
    },
    c4_audit_reaction: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 5h",
      question: "이용자마다 자기 3%를 말합니다. 누구의 3%를 먼저 보겠습니까?",
    },
    c4_public: {
      place: "온새 운영 검토실 · 홍보 대응석",
      clock: "기자 답변까지 40m",
      question: "기자는 세 문장 중 하나만 쓴다고 합니다. 어떤 문장을 고르겠습니까?",
    },
    c4_public_reaction: {
      place: "온새 운영 검토실 · 홍보 대응석",
      clock: "기자 답변까지 15m",
      question: "고른 문장이 선의를 개혁으로도 은폐로도 만듭니다. 모르는 것까지 넣겠습니까?",
    },
    c4_verdict: {
      place: "온새 이사회실",
      clock: "이사회 표결까지 10m",
      question: "좋은 의도는 증거가 되지 않습니다. 예외를 어떤 조건으로 묶겠습니까?",
    },
    c4_verdict_reaction: {
      place: "온새 감사실 앞 복도",
      clock: "표결 직후",
      question: "규칙을 지킨 사람이 가장 크게 잃었다고 제보자가 말합니다. 규칙을 다시 쓰겠습니까?",
    },
    c4_branch_exception: {
      place: "온새 운영 검토실 · 산식 검토석",
      clock: "지원금 심사까지 4h",
      question: "예외 승인은 선의를 증명하지 않습니다. 이 예외가 누구에게 반복될지 확인하겠습니까?",
    },
    c4_branch_exception_follow: {
      place: "온새 감사실",
      clock: "심사 결과 대기 중",
      question: "서비스는 멈추지 않았고 감사 기록은 남았습니다. 다음 사람에게 줄 기준을 어떻게 쓰겠습니까?",
    },
    c4_route_exception: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 8h",
      question: "좋은 결과가 먼저 도착했습니다. 이 결과를 무엇으로 정당화하겠습니까?",
      lead: "산식 해석을 넓혀 기준을 맞추겠다고 말한 직후입니다. 숫자는 맞았고, 그 방법은 아직 기록되지 않았습니다.",
    },
    c4_route_rule: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 8h",
      question: "원칙을 지키자 손실이 먼저 왔습니다. 이 손실을 누구에게 설명하겠습니까?",
      lead: "부족한 지표를 그대로 보고하겠다고 말한 직후입니다. 대기자 명단이 바로 반응합니다.",
    },
    c4_route_audit: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 8h",
      question: "조건을 붙인 선의가 통과 대기 중입니다. 그 조건을 누가 감시하겠습니까?",
      lead: "산식 변경 조건과 사후 검증 절차를 함께 걸겠다고 말한 직후입니다.",
    },
    c4_route_system: {
      place: "온새 운영 검토실",
      clock: "지원금 심사까지 8h",
      question: "명분 있는 위반이 복제되기 시작했습니다. 이 복제를 멈추겠습니까?",
      lead: "보기에 없던 조건으로 판을 다시 짜자 같은 조건이 다른 기관의 신청서에 나타났습니다.",
    },
    c4_final_exception: {
      place: "온새 이사회실",
      clock: "심사 자료 제출 직전",
      question: "예외가 규칙이 되는 순간입니다. 그 자리에 이름을 적겠습니까?",
    },
    c4_final_rule: {
      place: "온새 이사회실",
      clock: "심사 자료 제출 직전",
      question: "깨끗한 절차에도 피해자가 있습니다. 이 피해를 어떻게 완화하겠습니까?",
    },
    c4_final_audit: {
      place: "온새 이사회실",
      clock: "심사 자료 제출 직전",
      question: "감시받는 선의가 남았습니다. 감사 범위를 누가 정하겠습니까?",
    },
    c4_final_system: {
      place: "온새 이사회실",
      clock: "심사 자료 제출 직전",
      question: "당신의 예외 조건이 다른 기관의 양식이 됐습니다. 이 양식을 닫겠습니까?",
    },
    c4_evidence_turn: {
      place: "온새 감사실",
      clock: "이사회 표결까지 20m",
      question: "예외 파일의 원래 수신자가 드러났습니다. 반복 승인자를 기록에 남기겠습니까?",
    },
    c4_aftershock: {
      place: "온새 운영 검토실",
      clock: "심사 결과 발표 전날",
      question: "같은 예외를 기다리는 기관 11곳이 줄을 섰습니다. 예외 조건을 공개하겠습니까?",
      lead: "심사 결과보다 감사 요청서가 먼저 도착했습니다. 작은 예외 하나가 양식이 되어 돌아왔습니다.",
    },
  },
  clue: {
    id: "c4-exception-file",
    title: "예외 파일",
    text: "이번 규칙 위반은 처음이 아닙니다. 누군가는 오래전부터 예외를 정상처럼 기록해 왔습니다.",
  },
  outcomes: {
    c4_after_rule: { tag: "기준을 다시 만든 결말", title: "예외가 규칙의 시작이 되었다", text: "예외를 숨기지 않고 공개 조건으로 묶었습니다. 더 느려졌지만 다음 기관이 같은 문을 몰래 열 수 없게 됐습니다." },
    c4_after_service: { tag: "서비스를 지킨 결말", title: "한 번 더 넘어간 선", text: "사람들은 도움을 받았지만 예외는 기록으로 남았습니다. 다음 사건에서 누군가는 그 기록을 이용하려 합니다." },
    c4_after_stop: { tag: "감사를 택한 결말", title: "멈춤도 결정이라는 증거", text: "서비스는 흔들렸지만 심사 기준은 처음으로 공개 검토 대상이 됐습니다." },
  },
  carryovers: {
    c4_after_rule: { legitimacy: 8, trust: 4, time: -4 },
    c4_after_service: { humanCost: -4, legitimacy: -8, trust: -3 },
    c4_after_stop: { capital: -7, legitimacy: 7, humanCost: 8 },
  },
  continuityChallenges: {
    c3_after_share: { id: "use-reframe", title: "공동안의 규칙 다시 짜기", text: "공동 작업에서 비어 있던 책임 칸이 누구 것인지 드러나도록 판을 다시 짜야 합니다." },
    c3_after_proof: { id: "repair-legitimacy", title: "정직함의 피해 줄이기", text: "증거를 공개한 뒤 생긴 피해를 줄이면서 공정함을 유지해야 합니다." },
    c3_after_win: { id: "find-cost", title: "승리의 숨은 대가 찾기", text: "좋은 결과 뒤에 남은 규칙 위반의 대가를 먼저 찾으면 다음 압박을 통제할 수 있습니다." },
  },
};
