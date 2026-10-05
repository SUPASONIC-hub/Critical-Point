/**
 * CASE 05 -- the authored scenes of the collapse case.
 *
 * This is where the loan finally lands on people who never borrowed anything.
 * The dispatch algorithm's budget ceiling came from the repayment terms the bank
 * imposed in 사건 04; every team downstream of that ceiling behaved correctly and
 * 312 people were dropped anyway. The case keeps its answer -- there is no
 * villain here -- but now the player can see the room the villain was in, three
 * years earlier, and that the reviewer who signed the weighting table is the man
 * in the next chair.
 */
export const case05Nodes = {
  c5_start: {
    phase: "CASE 05 BRIEFING",
    title: "NO ONE TO BLAME",
    speaker: "반재욱",
    text:
      "도시형 돌봄 배차 시스템에서 대규모 누락 사고가 났습니다. 312명이 예정된 방문 서비스를 받지 못했고, 언론은 책임자를 요구합니다. 그런데 첫 자료를 보면 모두가 규정대로 행동했습니다. 반재욱이 수첩을 펼칩니다. '규정을 따라 올라가 봤습니다. 맨 위에 있는 건 사람이 아니라 예산 상한선이고, 그 상한선은 온새 상환(빌린 돈을 갚는 일) 조건표에서 그대로 내려왔습니다.'",
    memo: [
      "서비스 누락: 312명",
      "현장 직원은 안내서대로 처리",
      "배차 시스템은 승인된 기준대로 작동",
      "예산 상한선의 출처: 온새의 상환 조건표",
    ],
    triggers: ["responsibility", "curiosity", "order"],
    choices: [
      {
        id: "c5_start_blame",
        label: "운영 책임자를 특정해 조사한다",
        effect: { trust: -4, legitimacy: 6, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "c5_start_map",
        label: "누락이 생긴 전체 의사결정 흐름을 그린다",
        effect: { time: -12, legitimacy: 3, fatigue: 4 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c5_start_redesign",
        label: "즉시 임시 수동 배차 체계로 전환한다",
        effect: { capital: -8, trust: 7, humanCost: -9, fatigue: 4 },
        cognition: { reframing: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c5_map",
      },
    ],
  },
  c5_map: {
    phase: "SYSTEM MAP",
    title: "합리적인 조각들",
    speaker: "에코",
    text:
      "각 부서는 합리적으로 움직였습니다. 예산팀은 상한을 지켰고, 운영팀은 우선순위 규칙을 따랐고, 시스템은 승인된 가중치를 적용했습니다. 문제는 그 합리성이 합쳐진 결과입니다. 에코가 가중치표의 승인 이력을 엽니다. 마지막 검토자 칸에 이름이 하나 있습니다. 오진우입니다.",
    memo: [
      "예산팀: 비용 상한 준수",
      "운영팀: 우선순위 규칙 준수",
      "시스템: 승인된 가중치 적용",
      "가중치표 최종 검토자: 오진우 (검토 시간 6분)",
    ],
    triggers: ["curiosity", "order", "responsibility"],
    choices: [
      {
        id: "c5_map_map",
        label: "기준별로 밀려난 사람들의 공통점을 찾는다",
        effect: { time: -10, legitimacy: 4, fatigue: 4 },
        cognition: { inference: 3 },
      },
      {
        id: "c5_map_blame",
        label: "경고 지표를 놓친 관리자 책임을 묻는다",
        effect: { trust: -6, legitimacy: 6, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "c5_map_redesign",
        label: "누락자 보호 가중치를 임시로 높인다",
        effect: { capital: -6, trust: 7, humanCost: -11, fatigue: 4 },
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
  c5_blame: {
    phase: "PUBLIC PRESSURE",
    title: "누군가는 책임져야 한다",
    speaker: "오진우",
    text:
      "오진우가 말합니다. '악인이 없다는 말은 밖에서 들으면 변명입니다. 책임자를 세우지 않으면 조직 전체가 흔들립니다.' 틀린 말이 아닙니다. 그리고 그가 잠깐 멈췄다가 덧붙입니다. '그 가중치표, 제가 6분 보고 넘겼습니다. 그때 제 검토 제한시간이 6분이었거든요. 누가 정했는지는 저도 모릅니다.'",
    memo: [
      "언론은 책임자 실명을 요구",
      "피해자 단체는 즉시 사과와 보상을 요구",
      "관리자 한 명을 징계하면 여론은 빠르게 가라앉을 가능성",
      "오진우의 검토 제한시간은 그가 정하지 않았음",
    ],
    triggers: ["responsibility", "competition", "injustice"],
    choices: [
      {
        id: "c5_blame_blame",
        label: "관리자 징계와 보상안을 먼저 발표한다",
        effect: { trust: 9, legitimacy: 3, humanCost: -5, fatigue: 2 },
        cognition: { risk: 2 },
      },
      {
        id: "c5_blame_map",
        label: "단일 책임보다 구조 실패 보고서를 발표한다",
        effect: { trust: -6, legitimacy: 6, fatigue: 4 },
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c5_blame_redesign",
        label: "징계, 보상, 시스템 개편을 한 패키지로 묶는다",
        effect: { capital: -8, trust: 6, legitimacy: 5, humanCost: -7, fatigue: 5 },
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c5_collapse: {
    phase: "COLLAPSE",
    title: "선의의 실패",
    speaker: "도윤하",
    text:
      "도윤하가 현장 기록을 펼칩니다. 누락된 사람들은 불만을 거의 제기하지 않았고, 가족 연락처가 불안정했고, 이전 이용 기록도 적었습니다. 시스템은 '조용한 사람들'을 낮은 우선순위로 밀어냈습니다. 도윤하가 목록의 한 줄을 짚습니다. '이분, 플로우온 야간조였던 분입니다. 작년에 정리됐고, 올해 돌봄 대상이 됐습니다.'",
    memo: [
      "불만 제기 빈도 낮음",
      "가족 연락처 불안정",
      "이전 이용 기록 부족",
      "누락자 명단에 플로우온 퇴직자 7명 포함",
    ],
    triggers: ["protection", "curiosity", "order"],
    choices: [
      {
        id: "c5_collapse_redesign",
        label: "조용한 사람을 보호하는 역가중치를 넣는다",
        effect: { capital: -10, trust: 9, legitimacy: 6, humanCost: -13, fatigue: 4 },
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c5_collapse_blame",
        label: "기존 관리자 책임과 현장 보완 교육을 선택한다",
        effect: { trust: 5, legitimacy: 4, humanCost: -5, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "c5_collapse_map",
        label: "피해자 기준으로 전체 지표를 다시 설계한다",
        effect: { time: -12, capital: -8, legitimacy: 7, humanCost: -11, fatigue: 5 },
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꾼다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 05 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case05 = {
  id: "case05",
  nodes: case05Nodes,
  aftermath: {
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
  },
  aftermathRoute: [null, "c5_aftershock"],
  connectiveScenes: [
    {
      id: "c5_pattern",
      after: "c5_map",
      next: "c5_blame",
      title: "실패가 움직인 경로",
      speaker: "반재욱",
      text: "지도 위의 화살표가 한 사람에게 모이지 않습니다. 모든 화살표가 서로의 합리적인 선택을 통과해 같은 곳에 도착했습니다.",
      memo: ["각 팀은 다른 팀의 정보를 보지 못함", "가장 먼저 위험을 말한 기록이 누락됨", "책임표에는 승인자만 남아 있음"],
      choices: [
        {
          label: "정보가 막힌 지점을 먼저 고친다",
          effect: { legitimacy: 8, capital: -7, time: -7, fatigue: 6 },
          voice: "정보가 막혀 있던 지점부터 고치겠습니다.",
          echo: "막힌 곳을 열면 같은 실패는 줄고, 이미 일어난 실패의 책임은 그대로 남습니다.",
        },
        {
          label: "승인자에게 책임을 집중한다",
          effect: { legitimacy: 5, trust: -6, humanCost: 5, time: -3, fatigue: 3 },
          voice: "승인한 사람에게 책임을 모으겠습니다.",
          echo: "책임이 한 사람에게 모이면 결론은 빨라지고, 구조는 그 자리에 그대로 있습니다.",
        },
        {
          label: "피해가 큰 부서부터 보상한다",
          effect: { humanCost: -7, trust: 7, capital: -9, fatigue: 5 },
          voice: "피해가 가장 큰 부서부터 보상하겠습니다.",
          echo: "큰 피해부터 갚으면 눈에 보이는 곳은 회복되고, 작게 흩어진 피해는 계산되지 않습니다.",
        },
      ],
    },
    {
      id: "c5_voice",
      after: "c5_blame",
      next: "c5_collapse",
      title: "이름 없는 증언",
      speaker: "도윤하",
      text: "누군가가 회의실 밖에서 말합니다. 자신은 결정권자가 아니었지만, 실패를 가장 먼저 보았다고 합니다.",
      memo: ["증언자는 기록에서 빠져 있음", "말하면 팀 전체가 조사받을 수 있음", "피해자들은 책임자 이름보다 회복을 요구함"],
      choices: [
        {
          label: "증언자를 보호하고 기록을 복원한다",
          effect: { trust: 9, humanCost: -5, capital: -5, time: -6, fatigue: 6 },
          voice: "증언자를 보호하면서 지워진 기록부터 복원하겠습니다.",
          echo: "복원된 기록은 증언을 대신하지 못하고, 증언 혼자 서 있게 두지도 않습니다.",
        },
        {
          label: "공식 책임자 발표를 먼저 한다",
          effect: { legitimacy: 8, trust: -4, humanCost: 4, time: -4, fatigue: 4 },
          voice: "공식 책임자를 먼저 발표하겠습니다.",
          echo: "이름이 먼저 나오면 조직은 답을 얻고, 그 이름이 구조를 가립니다.",
        },
        {
          label: "보상안을 만들고 조사를 미룬다",
          effect: { capital: -7, trust: 4, legitimacy: -6, humanCost: -4, time: 5, fatigue: -4 },
          voice: "보상안을 먼저 만들고 조사는 뒤로 미루겠습니다.",
          echo: "먼저 도착한 보상은 피해를 덮고, 미룬 조사는 대개 다시 열리지 않습니다.",
        },
        {
          label: "증언자의 고용을 내 권한으로 보장한다",
          effect: { trust: 7, legitimacy: -4, capital: -8, humanCost: -6, fatigue: 7 },
          voice: "증언자의 자리를 제 권한으로 보장하겠습니다.",
          echo: "개인이 보증한 자리는 그 개인이 사라지면 함께 사라집니다.",
        },
      ],
    },
    {
      id: "c5_verdict",
      after: "c5_collapse",
      next: "c5_final_redesign_route",
      title: "책임의 모양",
      speaker: "한서윤",
      text: "실패를 설명하는 방법은 세 가지입니다. 사람을 지목하거나, 구조를 고치거나, 피해를 먼저 되돌리는 것. 어느 것도 공짜는 아닙니다.",
      memo: ["개선 예산은 한정됨", "책임 발표를 기다리는 언론", "피해 복구팀이 즉시 출범할 수 있음"],
      choices: [
        {
          label: "내 결정부터 공개한다",
          effect: { legitimacy: 9, trust: 5, humanCost: 2, time: -4, fatigue: 7 },
          voice: "제가 무엇을 결정했는지부터 공개하겠습니다.",
          echo: "자기 결정을 먼저 여는 사람은 신뢰를 얻고, 그 문서는 되돌릴 수 없습니다.",
        },
        {
          label: "반복을 막는 구조에 투자한다",
          effect: { capital: -9, legitimacy: 8, time: -6, fatigue: 5 },
          voice: "다음 실패를 막는 장치를 지금 결정하겠습니다.",
          echo: "구조에 쓴 돈은 오늘의 피해자에게 닿지 않고, 다음 피해자를 지웁니다.",
        },
        {
          label: "피해 복구를 가장 먼저 시작한다",
          effect: { humanCost: -8, trust: 8, capital: -8, fatigue: 5 },
          voice: "사과문보다 피해 복구의 첫 행동을 먼저 시작하겠습니다.",
          echo: "복구가 먼저 움직이면 사과는 나중에 와도 늦지 않습니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c5_pattern_reaction",
      after: "c5_pattern",
      next: "c5_blame",
      title: "화살표를 거꾸로",
      speaker: "에코",
      text: "지도를 뒤집자 피해자에게 책임 화살표가 향했습니다. 누군가 만든 분류 방식이 실패를 더 오래 유지하고 있었습니다.",
      memo: ["책임 화살표가 향한 방향", "분류 밖에서 다시 들을 목소리"],
      choices: [
        {
          label: "분류 방식을 폐기하고 다시 듣는다",
          effect: { legitimacy: 7, humanCost: -6, capital: -5, time: -8, fatigue: 6 },
          voice: "분류를 폐기하고 처음부터 다시 듣겠습니다.",
          echo: "분류를 버리면 느려지지만 빠졌던 목소리가 돌아옵니다.",
        },
        {
          label: "가장 큰 승인자만 조사한다",
          effect: { legitimacy: 6, trust: -5, humanCost: 4, time: -4, fatigue: 3 },
          voice: "가장 큰 승인자부터 조사하겠습니다.",
          echo: "승인자를 겨누면 빠르고, 구조는 그대로 남습니다.",
        },
        {
          label: "기존 지도를 유지한 채 보완한다",
          effect: { time: 5, capital: 4, legitimacy: -4, humanCost: 4, fatigue: -5 },
          voice: "지도는 두고 빠진 부분만 채우겠습니다.",
          echo: "보완만 하면 지도의 틀린 전제도 함께 유지됩니다.",
        },
      ],
    },
    {
      id: "c5_voice_reaction",
      after: "c5_voice",
      next: "c5_collapse",
      title: "말할 수 있는 조건",
      speaker: "한서윤",
      text: "증언자는 말할 준비가 됐지만, 팀을 떠나야만 안전합니다. 진실을 얻는 대신 조직을 잃을 수 있습니다.",
      memo: ["증언을 가능하게 할 안전 조건", "조직을 떠나지 않고 말할 권리"],
      choices: [
        {
          label: "떠나지 않아도 말할 수 있게 보호한다",
          effect: { trust: 9, humanCost: -6, capital: -7, fatigue: 6 },
          voice: "떠나지 않고도 말할 수 있게 보장하겠습니다.",
          echo: "자리를 지키게 하는 보장은 비싸고, 다음 증언자를 만듭니다.",
        },
        {
          label: "증언 뒤에 즉시 조직을 바꾼다",
          effect: { legitimacy: 8, capital: -6, time: -6, fatigue: 7 },
          voice: "증언 직후에 조직을 바꾸겠습니다.",
          echo: "증언 뒤의 개편은 빠르지만 그 사람은 개편의 이유가 됩니다.",
        },
        {
          label: "조직을 지키기 위해 증언을 보류한다",
          effect: { time: 6, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -4 },
          voice: "조직을 지키기 위해 증언을 미루겠습니다.",
          echo: "미룬 증언은 사라지지 않고 다른 사람의 입으로 나옵니다.",
        },
      ],
    },
    {
      id: "c5_verdict_reaction",
      after: "c5_verdict",
      next: "c5_final_redesign_route",
      title: "책임의 다음 날",
      speaker: "도윤하",
      text: "책임을 발표한 다음 날에도 피해는 그대로였습니다. 누군가를 지목한 말보다, 무엇을 되돌릴지가 더 급해졌습니다.",
      memo: ["발표 뒤에도 남은 피해", "복구 순서를 정할 사람"],
      choices: [
        {
          label: "피해 복구를 발표의 첫 문장으로 둔다",
          effect: { humanCost: -7, trust: 7, capital: -8, fatigue: 5 },
          voice: "복구를 발표의 첫 문장으로 두겠습니다.",
          echo: "복구가 첫 문장이면 사과는 설명이 아니라 약속이 됩니다.",
        },
        {
          label: "책임자의 사과를 먼저 받는다",
          effect: { legitimacy: 6, trust: 4, humanCost: 2, time: -4, fatigue: 4 },
          voice: "책임자의 사과를 먼저 받겠습니다.",
          echo: "사과는 형식을 갖추지만 피해는 그 자리에 그대로입니다.",
        },
        {
          label: "개선 계획이 완성될 때까지 침묵한다",
          effect: { time: 6, trust: -6, legitimacy: -3, humanCost: 5, fatigue: -5 },
          voice: "개선 계획이 끝날 때까지 말하지 않겠습니다.",
          echo: "침묵은 계획을 지키고 기다리는 사람을 잃습니다.",
        },
      ],
    },
  ],
  branchPlan: ["c5_blame", 1, "c5_branch_owner", "c5_branch_owner_follow", "ruleNotYetClosed"],
  branchScenes: {
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
        { id: "c5_branch_owner_follow_a", label: "복구 대상과 책임자를 함께 기록한다", effect: { trust: 7, legitimacy: 7, capital: -7, fatigue: 5 }, next: "c5_final_system_route", cognition: { inference: 1 } },
        { id: "c5_branch_owner_follow_b", label: "재발 방지 장치에 예산을 고정한다", effect: { capital: -8, legitimacy: 8, humanCost: -3 }, next: "c5_final_system_route", cognition: { persistence: 2 } },
        { id: "c5_branch_owner_follow_c", label: "사과문만 발표하고 종료한다", effect: { time: 6, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -4 }, next: "c5_final_system_route", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
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
      text: "책임자를 세울지 복구부터 할지 정하기 전에 누가 먼저 밀렸는지부터 묻자, 알고리즘(판단 순서를 정해 둔 계산 규칙)의 숨은 가중치가 보입니다. 시스템은 도움을 크게 요구하지 못하는 사람을 낮은 우선순위로 배웠습니다.",
      memo: ["불만 제기 빈도가 보호 가중치에 역으로 작용", "가족 연락처 불안정이 낮은 신뢰도로 처리됨", "조용한 피해자는 모델 학습에서 누락됨"],
      routeChoices: [
        ["c5_route_system_audit", "가중치가 학습한 자료부터 열어 본다", { legitimacy: 9, trust: 3, capital: -4, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c5_route_system_patch", "가중치는 두고 이번 배차만 손으로 고친다", { capital: 7, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c5_route_system_call", "누락된 사람들에게 먼저 연락해 기준을 묻는다", { trust: 9, legitimacy: 5, capital: -6, humanCost: -7, fatigue: 7 }, { reframing: 2 }],
      ],
      finalTitle: "조용한 쪽이 밀리는 값",
      finalText: "공식 발표를 앞둔 통제실 화면에 가중치표(조건마다 얼마나 무겁게 따질지 적어 둔 표)가 아직 닫히지 않았습니다. 서비스를 받지 못한 312명 가운데 규정을 어긴 사람 때문에 밀린 사람은 없습니다. 에코의 글자가 표 아래에 뜹니다. '언론이 기다리는 것은 이름입니다. 312명을 뒤로 민 것은 이름이 아니라 숫자였습니다.'",
      finalMemo: ["누락 312명 -- 불만을 적게 낸 사람일수록 뒤로 밀림", "배차 시스템은 승인된 기준대로 작동함", "공식 발표 직전, 언론은 실명을 요구"],
    },
    finalChoices: [
      ["a", "조용한 사람 보호 가중치를 공개 기준으로 넣는다", { trust: 9, legitimacy: 8, capital: -9, humanCost: -11, fatigue: 8 }, { reframing: 3 }],
      ["b", "가중치는 숨기고 수동 보정만 계속한다", { trust: 6, capital: -6, legitimacy: -6, humanCost: -7, fatigue: 7 }, { risk: 2 }],
      ["c", "모델 학습 자료에서 피해자 누락 기록을 먼저 공개한다", { legitimacy: 10, trust: 4, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
    ],
  },
  routeBody: {
    routes: {
      c5_route_map: { entry: "c5_map", tail: "c5_pattern_reaction", final: "c5_final_map_route" },
      c5_route_blame: { entry: "c5_blame", tail: "c5_voice_reaction", final: "c5_final_blame_route" },
      c5_route_redesign: { entry: "c5_collapse", tail: "c5_verdict_reaction", final: "c5_final_redesign_route" },
      c5_route_system: { entry: "c5_branch_owner", tail: "c5_branch_owner_follow", final: "c5_final_system_route" },
    },
  },
  evidencePlan: {
    node: "c5_evidence_turn",
    result: "c5_aftershock",
    sourceRoutes: ["c5_route_blame", "c5_route_map", "c5_route_redesign", "c5_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "실패 지도에서 빠진 이름을 단서로 짚어, 누가 먼저 지워졌는지 되살핀다.",
    entryEcho: "빠진 이름을 짚으면 실패의 피해자 목록이 먼저 바뀝니다.",
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
    entryLabel: "지도에서 밀려난 피해자의 순번을 되살린다",
  },
  memoryPlan: {
    routeNext: "c5_route_map",
    systemNext: "c5_route_system",
    evidenceNext: "c5_evidence_turn",
    routeLabel: "직전 사건의 예외 조건을 실패 지도에 겹쳐 본다",
    systemLabel: "온새에서 다시 짠 판이 복구 우선순위표에 섞였는지 살펴본다",
    evidenceLabel: "예외 파일에 되풀이된 이름을 복구 순번표에서 찾는다",
    routeEcho: "겹쳐 보면 온새의 예외 조건이 실패 지도의 화살표 하나와 같은 자리에 놓입니다. 누구의 단독 결정도 아닌 칸입니다.",
    systemEcho: "살펴보면 복구 우선순위표의 한 줄이 당신이 다시 짠 판과 같은 순서입니다. 그 아래에서 가중치 설계 파일이 함께 열립니다.",
    evidenceEcho: "되풀이된 이름을 찾다 보면 매번 뒤로 밀린 사람들의 공통점이 보입니다. 신고를 적게 한 사람들입니다.",
  },
  openingRoutes: {
    c4_after_rule: "c5_start_rule",
    c4_after_service: "c5_start_service",
    c4_after_stop: "c5_start_stop",
  },
  openingCopy: {
    c5_start_rule: ["새 기준의 실패", "도윤하", "예외를 공개 조건으로 묶은 뒤, 모두가 그 기준을 지키려 했습니다. 그런데 시스템 전체가 동시에 멈추기 시작했습니다.", ["새 기준이 현장에 너무 느림", "피해 보고가 늦게 들어옴", "책임자는 규칙을 탓함"]],
    c5_start_service: ["지켜낸 서비스의 그림자", "반재욱", "서비스를 지킨 예외가 반복되면서 누구도 같은 기준을 믿지 못하게 됐습니다. 실패는 규칙보다 먼저 사람에게 도착했습니다.", ["예외를 요구하는 기관이 늘어남", "감사 요청서가 도착함", "현장 직원이 내부 기록을 보관함"]],
    c5_start_stop: ["멈춘 뒤의 공백", "에코", "서비스를 멈추고 감사를 택한 결정은 기준을 지켰습니다. 하지만 멈춘 시간 동안 조용한 피해자가 생겼습니다.", ["피해 복구 비용이 증가함", "감사 자료는 완전하지 않음", "누군가는 중단을 승인한 사람을 찾음"]],
  },
  openingSignatures: {
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
  },
  voiceLines: {
    c5_start_map: "누군가를 지목하기 전에, 실패가 이동한 경로부터 그리자고 한다.",
    c5_start_blame: "흩어진 분노를 한 사람의 책임으로 모으는 선택을 꺼낸다.",
    c5_start_redesign: "당장 비용이 들더라도, 누락이 더 이어지지 않게 배차를 손으로 돌리자고 한다.",
    c5_branch_owner_a: "다른 이름을 꺼내기 전에, 내 승인 기록부터 공개한다.",
    c5_branch_owner_b: "책임 논의를 미뤄두고, 빠진 안전장치부터 복구한다.",
    c5_branch_owner_c: "설명이 길어지는 것을 끊고, 실패를 한 사람의 책임으로 닫는다.",
    c5_branch_owner_follow_a: "복구 목록 옆에, 책임자의 이름도 함께 기록한다.",
    c5_branch_owner_follow_b: "말로 끝나지 않도록, 재발 방지 장치에 예산을 고정한다.",
    c5_branch_owner_follow_c: "더 건드리지 않기로 하고, 사과문만 발표한 뒤 종료한다.",
    c5_after_owner: "빈자리를 보고, 내 결정부터 책임진 뒤 개선 작업을 맡는다.",
    c5_after_system: "누구를 지목하는 대신, 반복을 막는 구조를 다시 설계한다.",
    c5_after_name: "회의를 끝내기 위해, 가장 큰 실수를 한 사람을 공식 책임자로 세운다.",
    c5_map_blame: "놓친 신호에 이름이 있다며, 그 자리를 먼저 부른다.",
    c5_blame_blame: "기다리는 사람들에게 줄 답이 필요하다며, 징계와 보상을 함께 낸다.",
    c5_collapse_blame: "사람을 바꾸고 교육을 붙이는, 가장 익숙한 답을 고른다.",
    c5_map_map: "빠진 사람들이 서로 닮았는지부터 확인한다.",
    c5_blame_map: "한 사람으로 끝날 일이 아니라며, 구조를 문장의 주어로 세운다.",
    c5_collapse_map: "누가 먼저 무너졌는지를 기준으로, 표 전체를 다시 만든다.",
    c5_map_redesign: "완성된 답이 아니라며, 밀려난 쪽에 임시 무게부터 얹는다.",
    c5_blame_redesign: "하나만 내면 나머지는 미뤄진다며, 셋을 같은 발표에 넣는다.",
    c5_collapse_redesign: "말하지 못한 쪽이 먼저 밀린다며, 계산을 반대로 기울인다.",
    c5_start_rule_blame: "내가 만든 기준을 지킨 사람을 조사해야 하는지 물으며 이름을 부른다.",
    c5_start_rule_map: "기준이 어디서 현장을 막았는지 흐름부터 그린다.",
    c5_start_rule_redesign: "기준을 잠시 내려놓고 손으로 돌리자고 결정한다.",
    c5_start_service_blame: "서비스를 지킨 예외가 여기까지 왔다는 걸 알면서 책임자를 부른다.",
    c5_start_service_map: "지킨 서비스가 누구를 밀어냈는지 전체 흐름을 편다.",
    c5_start_service_redesign: "유지가 목적이었으니 유지 방식을 바꾸자고 말한다.",
    c5_start_stop_blame: "멈춘 결정은 내가 했으니 실행의 책임부터 확인하겠다고 말한다.",
    c5_start_stop_map: "멈춘 동안 무엇이 어디서 끊겼는지 지도부터 그린다.",
    c5_start_stop_redesign: "멈춘 걸 다시 세우는 게 먼저라며 수동 체계로 돌린다.",
    c5_route_blame_compensate: "책임자 발표만으로 끝나지 않게, 보상안을 같은 자리에 올린다.",
    c5_route_blame_single: "빨리 닫는 것이 피해를 줄인다고 보고, 한 사람의 책임으로 정리한다.",
    c5_route_blame_reopen: "이름을 붙이기 전에 경로를 봐야 한다고 보고, 지목을 보류한다.",
    c5_final_blame_route_a: "책임자를 세우는 날에 재발 방지 예산도 함께 세운다.",
    c5_final_blame_route_b: "더 캐면 조직이 버티지 못한다고 보고, 한 사람의 책임으로 끝낸다.",
    c5_final_blame_route_c: "누구의 잘못인지보다 어디서 갈라졌는지를 묻기로 하고, 경로 전체를 연다.",
    c5_route_map_publish: "이해할 수 있게 만들려고, 실패 지도를 그대로 공개한다.",
    c5_route_map_owner: "화살표에 이름이 없으면 아무 일도 안 일어난다고 보고, 결정권자를 붙인다.",
    c5_route_map_delay: "지금은 설명보다 보상이 먼저라고 보고, 지도는 안에 둔다.",
    c5_final_map_route_a: "구조를 그리는 김에, 화살표마다 책임과 보상을 함께 적어 연다.",
    c5_final_map_route_b: "지도가 무기가 될 수 있다고 보고, 보상 발표만 먼저 낸다.",
    c5_final_map_route_c: "내 손으로 정리하지 않겠다는 듯, 보고서를 외부 검토에 그대로 넘긴다.",
    c5_route_redesign_snapshot: "고치기 전 상태가 증거라는 걸 알고, 먼저 스냅샷을 뜬다.",
    c5_route_redesign_continue: "지금 줄일 수 있는 피해가 먼저라고 보고, 복구 속도를 택한다.",
    c5_route_redesign_rule: "임시로 하던 것을 규칙으로 만들려고, 수동 배차 조건을 정식화한다.",
    c5_final_redesign_route_a: "고친 것과 고치기 전을 함께 보여주려고, 스냅샷과 새 규칙을 같이 낸다.",
    c5_final_redesign_route_b: "원인은 나중에 밝히면 된다고 보고, 복구를 계속한다.",
    c5_final_redesign_route_c: "증거가 먼저 사라진다고 판단하고, 복구를 멈추고 로그부터 보존한다.",
    c5_route_system_audit: "가중치가 무엇을 배웠는지부터 봐야 한다고 보고, 학습 자료를 연다.",
    c5_route_system_patch: "지금 배차를 살리는 게 먼저라고 보고, 가중치는 두고 손으로 고친다.",
    c5_route_system_call: "기준을 만든 쪽이 잘못 봤다고 보고, 누락된 사람들에게 직접 묻는다.",
    c5_final_system_route_a: "조용하다는 이유로 밀리지 않게, 보호 가중치를 공개 기준에 넣는다.",
    c5_final_system_route_b: "설명할 자신이 없어, 가중치는 두고 손으로만 계속 보정한다.",
    c5_final_system_route_c: "무엇을 배우지 못했는지부터 밝히려고, 누락 기록을 먼저 연다.",
    c5_evidence_turn_weight: "숨은 가중치를 규칙 자리로 끌어올려, 누구나 읽게 만든다.",
    c5_evidence_turn_archive: "복구가 증거를 덮기 전에, 원인 로그부터 잠근다.",
    c5_evidence_turn_close: "당장 급한 보상부터 끝내고, 규칙 공개는 뒤로 미룬다.",
  },
  echoReplies: {
    c5_start_map:
      "구조를 보는 선택입니다. 다만 구조를 보는 동안 지금 피해를 입는 사람들은 답을 기다립니다.",
    c5_start_blame:
      "책임자를 지정하면 행동은 빨라집니다. 그러나 잘못된 단일 원인은 시스템 실패를 다시 반복하게 만들 수 있습니다.",
    c5_start_redesign:
      "시스템을 바꾸는 선택입니다. 효과는 크지만 당장의 책임 요구를 만족시키기 어렵습니다.",
    c5_branch_owner_a:
      "자기 이름을 먼저 적으면 조사는 정직해집니다. 동시에 당신이 가장 다루기 쉬운 표적이 됩니다.",
    c5_branch_owner_b:
      "장치 복구는 다음 피해를 막습니다. 이번 피해자는 아직 아무 답도 받지 못했습니다.",
    c5_branch_owner_c:
      "한 사람으로 닫으면 조직은 빨리 회복합니다. 같은 구조가 다음 사람을 같은 자리에 세웁니다.",
    c5_branch_owner_follow_a:
      "이름과 조치를 같이 남기면 기록은 완전해집니다. 그 사람은 평생 그 문서와 함께 검색됩니다.",
    c5_branch_owner_follow_b:
      "예산이 붙은 약속만 다음 해까지 살아남습니다. 그 예산은 다른 곳에서 잘려 나온 것입니다.",
    c5_branch_owner_follow_c:
      "사과는 국면을 닫습니다. 닫힌 국면 안에서 원인은 그대로 작동합니다.",
    c5_after_owner:
      "먼저 책임지면 논의가 시작됩니다. 책임진 사람이 개선까지 맡으면 검증할 사람이 사라진다는 점도 남습니다.",
    c5_after_system:
      "구조를 고치면 다음이 안전해집니다. 오늘 떠난 사람의 자리는 그 설계 어디에도 적히지 않습니다.",
    c5_after_name:
      "이름 하나로 회의는 닫힙니다. 그 다음 회의는 아무도 먼저 말하지 않는 회의가 됩니다.",
    c5_map_blame:
      "놓친 사람을 부르면 답은 빨라집니다. 그 사람도 같은 표를 보고 있었다는 사실은 남습니다.",
    c5_blame_blame:
      "발표는 분노를 가라앉힙니다. 가라앉은 자리에서 구조는 그대로 다음 사건을 준비합니다.",
    c5_collapse_blame:
      "익숙한 답은 실행이 쉽습니다. 같은 답이 세 번 반복됐다는 기록도 함께 남습니다.",
    c5_map_map:
      "공통점을 찾으면 기준의 결함이 보입니다. 찾는 동안 그 사람들은 계속 밀려 있습니다.",
    c5_blame_map:
      "구조를 주어로 쓰면 반복은 줄어듭니다. 대신 오늘 사과를 기다린 사람은 아무 이름도 듣지 못합니다.",
    c5_collapse_map:
      "피해자 기준은 가장 정직한 설계입니다. 가장 느리고 가장 비싼 설계이기도 합니다.",
    c5_map_redesign:
      "임시 가중치는 지금 사람을 지킵니다. 임시라는 말이 다음 분기에도 남으면 규칙이 됩니다.",
    c5_blame_redesign:
      "묶으면 미룰 수 없습니다. 묶인 만큼 어느 하나가 늦어지면 전부가 늦어집니다.",
    c5_collapse_redesign:
      "역가중치는 침묵의 비용을 줄입니다. 그 무게를 누가 대신 지는지도 표에 적어야 합니다.",
    c5_start_rule_blame:
      "기준을 만든 사람이 그 기준을 따른 사람을 조사합니다. 순서가 이상하다는 것을 모두가 압니다.",
    c5_start_rule_map:
      "자기 규칙의 실패를 그리는 일은 느리고 정확합니다. 그 사이 피해는 계속됩니다.",
    c5_start_rule_redesign:
      "만든 규칙을 스스로 끄는 선택입니다. 다시 켤 조건을 지금 적어야 합니다.",
    c5_start_service_blame:
      "예외를 승인한 것은 당신이고 실행한 것은 그 사람입니다. 조사는 한쪽에서만 시작됩니다.",
    c5_start_service_map:
      "지킨 것을 세는 표와 밀려난 사람을 세는 표는 다릅니다. 두 표를 겹쳐야 실패가 보입니다.",
    c5_start_service_redesign:
      "임시 체계는 서비스를 살립니다. 임시가 길어지면 그것이 기준이 됩니다.",
    c5_start_stop_blame:
      "중단을 승인한 사람이 중단의 책임을 묻습니다. 답하는 쪽은 그 순서를 기억합니다.",
    c5_start_stop_map:
      "중단의 공백은 기록이 얇습니다. 그리는 동안 조용한 피해가 계속 쌓입니다.",
    c5_start_stop_redesign:
      "복구가 조사보다 앞섭니다. 원인은 복구된 시스템 위에서 찾아야 합니다.",
    c5_route_blame_compensate: "함께 발표하면 여론은 정리되고, 구조 조사는 자리를 잃을 수 있습니다.",
    c5_route_blame_single: "한 이름으로 닫힌 사건은 조용해집니다. 같은 실패의 조건은 그대로입니다.",
    c5_route_blame_reopen: "보류는 비난을 당신에게 돌립니다. 대신 승인 경로가 다시 열립니다.",
    c5_final_blame_route_a: "예산이 같은 날 확정되면 발표는 사과가 아니라 계획이 됩니다.",
    c5_final_blame_route_b: "조직은 버팁니다. 다음 실패도 같은 자리에서 시작합니다.",
    c5_final_blame_route_c: "공개 조사는 오래 걸리고, 조사가 끝나기 전에 여론이 먼저 결론을 냅니다.",
    c5_route_map_publish: "지도는 조직 전체를 흔듭니다. 대신 아무도 단독 범인이 아니라는 사실이 보입니다.",
    c5_route_map_owner: "이름이 붙으면 반발이 옵니다. 그 반발이 결정의 위치를 확인해 줍니다.",
    c5_route_map_delay: "보상은 빨라지고, 같은 화살표는 다음에도 같은 방향을 가리킵니다.",
    c5_final_map_route_a: "책임이 분산돼도 적혀 있으면 흩어지지는 않습니다.",
    c5_final_map_route_b: "보상은 오늘의 피해를 덮고, 지도는 내부 문서로 늙습니다.",
    c5_final_map_route_c: "외부 검토는 조직을 흔들고, 결론은 당신의 편집을 거치지 않습니다.",
    c5_route_redesign_snapshot: "스냅샷은 복구를 늦춥니다. 대신 원인이 복구에 덮이지 않습니다.",
    c5_route_redesign_continue: "피해는 줄어듭니다. 무엇 때문에 생겼는지는 함께 지워집니다.",
    c5_route_redesign_rule: "규칙이 되면 보호는 유지되고, 현장의 피로도 규칙이 됩니다.",
    c5_final_redesign_route_a: "둘을 함께 내면 복구가 은폐로 읽히지 않습니다. 비용은 가장 큽니다.",
    c5_final_redesign_route_b: "다음 과제로 넘긴 원인은 다음 과제에서도 뒤로 밀립니다.",
    c5_final_redesign_route_c: "멈춘 복구는 피해를 되돌립니다. 원인 로그는 남습니다.",
    c5_route_system_audit: "학습 자료를 열면 이번 실패가 사고가 아니라 설계였다는 쪽으로 기웁니다.",
    c5_route_system_patch: "손으로 고친 배차는 오늘만 유효하고, 가중치는 내일도 같은 사람을 뒤로 미룹니다.",
    c5_route_system_call: "직접 물으면 기준이 바뀝니다. 그 통화는 시스템 밖의 시간으로 셉니다.",
    c5_final_system_route_a: "공개 기준이 되면 조정도 공개돼야 합니다. 예산은 즉시 늘어납니다.",
    c5_final_system_route_b: "보정은 사람이 붙어 있는 동안만 작동합니다.",
    c5_final_system_route_c: "누락이 공개되면 모델은 신뢰를 잃고, 다음 학습의 조건이 생깁니다.",
    c5_evidence_turn_weight: "규칙이 되면 되돌리기 어렵습니다. 그것이 이 선택의 목적입니다.",
    c5_evidence_turn_archive: "보존된 로그는 다음 사건의 첫 문장이 됩니다.",
    c5_evidence_turn_close: "보상은 피해를 덮고, 규칙은 그대로 다음 사람을 고릅니다.",
  },
  setting: { place: "돌봄 배차 복구 통제실", clock: "사고 발생 +18h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 05
    c5_start_rule: {
      place: "돌봄 배차 복구 통제실",
      clock: "사고 발생 +18h",
      question: "당신이 세운 공개 기준을 모두가 지켰는데 시스템이 멈췄습니다. 기준을 의심하겠습니까, 실행을 의심하겠습니까?",
      lead: "온새를 떠나 도시형 돌봄 배차(돌봄 인력을 어느 집에 보낼지 정하는 일) 시스템의 복구 통제실로 왔습니다. 여기서는 당신이 만든 기준이 이미 운영 규칙입니다.",
    },
    c5_start_service: {
      place: "돌봄 배차 복구 통제실",
      clock: "사고 발생 +18h",
      question: "서비스를 지킨 예외가 반복되며 아무도 기준을 믿지 않습니다. 무엇부터 복구하겠습니까?",
      lead: "온새를 떠나 도시형 돌봄 배차(돌봄 인력을 어느 집에 보낼지 정하는 일) 시스템의 복구 통제실로 왔습니다. 반복된 예외가 여기까지 따라왔습니다.",
    },
    c5_start_stop: {
      place: "돌봄 배차 복구 통제실",
      clock: "사고 발생 +18h",
      question: "멈춰서 기준은 지켰지만 그 사이 조용한 피해자가 생겼습니다. 이번엔 무엇을 먼저 보겠습니까?",
      lead: "온새를 떠나 도시형 돌봄 배차(돌봄 인력을 어느 집에 보낼지 정하는 일) 시스템의 복구 통제실로 왔습니다. 멈춤의 비용이 여기서 청구됩니다.",
    },
    c5_start: {
      place: "돌봄 배차 복구 통제실",
      clock: "사고 발생 +18h",
      question: "312명이 서비스를 받지 못했는데 모두가 규정대로 움직였습니다. 책임자를 특정하겠습니까, 흐름을 그리겠습니까?",
      lead: "온새를 떠나 도시형 돌봄 배차(돌봄 인력을 어느 집에 보낼지 정하는 일) 시스템의 복구 통제실로 왔습니다. 언론은 책임자를 요구하는데, 첫 자료에는 규정을 어긴 사람이 없습니다. 규정을 따라 올라가면 맨 위에 사람 대신 예산 상한선이 있습니다.",
    },
    c5_map: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +22h",
      question: "각 부서는 모두 합리적이었고 합쳐진 결과만 틀렸습니다. 어디를 먼저 손대겠습니까?",
      lead: "예산·운영·알고리즘의 결정을 한 장에 겹쳐 그리자, 누락자들이 여러 기준에서 조금씩 밀린 사람이라는 게 보입니다.",
    },
    c5_blame: {
      place: "돌봄 배차 복구 통제실 · 브리핑룸",
      clock: "사고 발생 +26h",
      question: "악인이 없다는 말은 대중에게 변명으로 들립니다. 책임자를 세우겠습니까, 구조를 발표하겠습니까?",
      lead: "언론은 실명을, 피해자 단체는 즉시 사과와 보상을 요구합니다. 오진우의 말은 틀리지 않았습니다.",
    },
    c5_collapse: {
      place: "돌봄 배차 복구 통제실 · 현장 기록실",
      clock: "사고 발생 +30h",
      question: "시스템은 '조용한 사람들'을 낮은 우선순위로 밀어냈습니다. 이 가중치를 어떻게 바꾸겠습니까?",
      lead: "도윤하가 현장 기록을 펼칩니다. 누락된 사람들은 불만을 적게 냈고, 연락처가 불안정했고, 이용 기록이 적었습니다.",
    },
    c5_pattern: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +24h",
      question: "화살표가 한 사람에게 모이지 않습니다. 정보가 막힌 지점을 먼저 고치겠습니까?",
    },
    c5_pattern_reaction: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +25h",
      question: "지도를 뒤집자 책임 화살표가 피해자를 향합니다. 이 분류를 폐기하겠습니까?",
    },
    c5_voice: {
      place: "돌봄 배차 복구 통제실 · 브리핑룸 밖",
      clock: "사고 발생 +28h",
      question: "결정권자가 아닌 사람이 실패를 가장 먼저 봤다고 합니다. 그를 보호하겠습니까?",
    },
    c5_voice_reaction: {
      place: "돌봄 배차 복구 통제실 · 복도",
      clock: "사고 발생 +29h",
      question: "증언자는 팀을 떠나야만 안전합니다. 떠나지 않고 말할 조건을 만들겠습니까?",
    },
    c5_verdict: {
      place: "돌봄 배차 복구 통제실",
      clock: "사고 발생 +32h",
      question: "지목·개편·복구 중 어느 것도 공짜가 아닙니다. 무엇을 발표의 첫 문장으로 두겠습니까?",
    },
    c5_verdict_reaction: {
      place: "돌봄 배차 복구 통제실",
      clock: "발표 다음 날",
      question: "책임을 발표한 다음 날에도 피해는 그대로입니다. 무엇을 먼저 되돌리겠습니까?",
    },
    c5_branch_owner: {
      place: "돌봄 배차 복구 통제실 · 승인 기록실",
      clock: "사고 발생 +27h",
      question: "실패에는 사람이 보이지만 구조는 작은 양보로 만들어졌습니다. 실패의 주어를 누구로 쓰겠습니까?",
    },
    c5_branch_owner_follow: {
      place: "돌봄 배차 복구 통제실 · 승인 기록실",
      clock: "사고 발생 +31h",
      question: "복구 뒤에도 이름 하나가 남습니다. 그 이름을 어떻게 다루겠습니까?",
    },
    c5_route_blame: {
      place: "돌봄 배차 복구 통제실 · 브리핑룸",
      clock: "사고 발생 +20h",
      question: "이름이 먼저 생긴 실패입니다. 그 이름으로 사건을 닫겠습니까?",
      lead: "운영 책임자를 특정해 조사하겠다고 말한 직후입니다. 조사보다 이름이 먼저 밖으로 나갑니다.",
    },
    c5_route_map: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +20h",
      question: "화살표가 구조를 가리킵니다. 이 구조를 어디까지 공개하겠습니까?",
      lead: "누락이 생긴 전체 의사결정 흐름을 그리겠다고 말한 직후입니다.",
    },
    c5_route_redesign: {
      place: "돌봄 배차 복구 통제실 · 현장 배차석",
      clock: "사고 발생 +20h",
      question: "먼저 고치자 증거가 지워졌습니다. 복구와 조사 중 무엇을 앞에 두겠습니까?",
      lead: "즉시 임시 수동 배차 체계로 전환하겠다고 말한 직후입니다. 사람은 먼저 닿았고, 기록은 덮였습니다.",
    },
    c5_route_system: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +20h",
      question: "조용한 사람을 낮게 보는 장치가 드러났습니다. 이 장치를 어떻게 처리하겠습니까?",
      lead: "복구안을 고르기에 앞서 판을 다시 짜자 가중치(어떤 조건을 얼마나 무겁게 따질지 정한 값) 설계 파일이 함께 열렸습니다.",
    },
    c5_final_blame_route: {
      place: "돌봄 배차 복구 통제실",
      clock: "공식 발표 직전",
      question: "이름으로 문을 닫을 수 있습니다. 그렇게 닫겠습니까?",
    },
    c5_final_map_route: {
      place: "돌봄 배차 복구 통제실",
      clock: "공식 발표 직전",
      question: "책임이 흩어집니다. 이 흩어짐을 어떻게 기록하겠습니까?",
    },
    c5_final_redesign_route: {
      place: "돌봄 배차 복구 통제실",
      clock: "공식 발표 직전",
      question: "복구가 증거를 지웠습니다. 무엇을 남기겠습니까?",
    },
    c5_final_system_route: {
      place: "돌봄 배차 복구 통제실",
      clock: "공식 발표 직전",
      question: "가중치 설계가 곧 책임이었습니다. 이 설계를 누구에게 넘기겠습니까?",
    },
    c5_evidence_turn: {
      place: "돌봄 배차 복구 통제실 · 시스템 지도",
      clock: "사고 발생 +31h",
      question: "사라진 피해자의 우선순위가 복원됐습니다. 이 기준을 전체에 적용하겠습니까?",
    },
    c5_aftershock: {
      place: "돌봄 배차 복구 통제실",
      clock: "발표 다음 날",
      question: "누구도 단독 책임을 지지 않았습니다. 당신의 결정부터 책임지겠습니까?",
      lead: "원인 회의가 끝났지만 서명한 사람은 없습니다. 회의실 밖에는 조용히 떠난 사람의 자리가 하나 남아 있습니다.",
    },
  },
  clue: {
    id: "c5-empty-seat",
    title: "비어 있는 자리",
    text: "실패 보고서에는 이름이 하나 빠져 있습니다. 말하지 못한 사람이 시스템의 가장 큰 비용을 떠안았습니다.",
  },
  outcomes: {
    c5_after_owner: { tag: "책임을 맡은 결말", title: "내 이름부터 보고서에 올렸다", text: "단독 책임은 문제를 즉시 해결하지 못했지만, 사람들이 숨지 않고 실패를 말할 공간을 만들었습니다." },
    c5_after_system: { tag: "구조를 고친 결말", title: "범인 대신 반복을 멈추었다", text: "누구도 영웅이 되지 못했지만 같은 실패가 다시 일어날 길은 좁아졌습니다." },
    c5_after_name: { tag: "책임자를 지목한 결말", title: "한 사람의 이름으로 실패를 닫았다", text: "회의는 빨리 끝났지만, 말하지 못한 사람들의 기록은 아직 남아 있습니다." },
  },
  carryovers: {
    c5_after_owner: { trust: 7, legitimacy: 5, fatigue: 6 },
    c5_after_system: { legitimacy: 8, capital: -4, fatigue: 5 },
    c5_after_name: { trust: -9, humanCost: 7, fatigue: 2 },
  },
  continuityChallenges: {
    c4_after_rule: { id: "lower-risk", title: "새 기준의 빈틈 막기", text: "공개한 기준이 현장에서 만들 위험을 낮추는 선택을 찾아야 합니다." },
    c4_after_service: { id: "repair-legitimacy", title: "예외의 믿음 회복하기", text: "서비스를 지킨 뒤 흔들린 규칙의 믿음을 회복하는 선택이 숨은 단서를 열 수 있습니다." },
    c4_after_stop: { id: "protect-trust", title: "멈춤의 피해 보호하기", text: "감사를 위해 멈춘 서비스의 사람들을 먼저 보호해야 다음 사건을 버틸 수 있습니다." },
  },
};
