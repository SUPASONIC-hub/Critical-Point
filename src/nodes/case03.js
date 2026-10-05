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
      "중견 제조사 노바웍스의 시스템 통합 공개 입찰입니다. 노바웍스는 KD은행에서 1,240억을 빌려 쓰고 있고, 이 공사 대금은 그룹 계열사로 들어옵니다. 한서윤이 담담하게 말합니다. '그 돈이 어느 계정으로 가는지는 묻지 마십시오. 대신 이것만 아십시오. 오진우도 같은 자료를 받고 옆방에서 동시에 안을 냅니다. 위에서는 이걸 경쟁 압박 아래 생각의 품질 측정이라고 부릅니다. 저는 인사 자료라고 부릅니다.'",
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
        cognition: { risk: 1 },
      },
      {
        id: "c3_start_deep",
        label: "제보된 보안 결함을 먼저 검증한다",
        effect: { time: -12, trust: 4, legitimacy: 4, fatigue: 3 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_start_mirror",
        label: "오진우의 접근법을 추정해 대응안을 만든다",
        effect: { time: -6, trust: 2, humanCost: 2, fatigue: 2 },
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 전략을 제안한다",
        type: "reframe",
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
        cognition: { risk: 2 },
      },
      {
        id: "c3_split_deep",
        label: "보안 결함이 비용보다 큰 손실임을 증명한다",
        effect: { time: -10, capital: -4, legitimacy: 6, humanCost: -3, fatigue: 4 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c3_split_invert",
        label: "비용 경쟁이 아니라 실패 비용 경쟁으로 판을 바꾼다",
        effect: { time: -8, trust: 5, legitimacy: 4, fatigue: 4 },
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
  c3_score: {
    phase: "SCOREBOARD",
    title: "점수판의 함정",
    speaker: "에코",
    text:
      "점수판은 오진우를 앞세웁니다. 속도, 절감률, 발표 명료성 전부 우위입니다. 그런데 항목에 '장기 실패 비용'이 없습니다. 에코가 배점표의 수정 이력을 엽니다. 마지막 수정자는 그룹전략실이고, 수정 시각은 플로우온 건이 닫힌 다음 날 새벽 두 시입니다. '이 표는 이 입찰을 위해 만들어진 것이 아닙니다. 두 사람을 비교하기 위해 만들어졌습니다.'",
    memo: [
      "점수판: 오진우 84 / 당신 71",
      "장기 실패 비용 항목 없음",
      "배점표 최종 수정: 그룹전략실, 플로우온 건 종료 다음 날 02:14",
      "보안 제보자는 아직 익명",
    ],
    triggers: ["competition", "injustice", "curiosity"],
    choices: [
      {
        id: "c3_score_fast",
        label: "점수판 기준에 맞춰 안을 압축한다",
        effect: { time: 6, capital: 9, legitimacy: -4, humanCost: 4, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "c3_score_invert",
        label: "점수판의 결함을 공식 이슈로 제기한다",
        effect: { time: -6, trust: 4, legitimacy: 5, fatigue: 4 },
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c3_score_deep",
        label: "익명 제보자의 신뢰도를 추적한다",
        effect: { time: -12, legitimacy: 7, humanCost: 3, fatigue: 4 },
        cognition: { inference: 3 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        cognition: { risk: 2 },
      },
      {
        id: "c3_trap_invert",
        label: "경쟁 구조 자체를 고객에게 공개한다",
        effect: { time: -4, trust: 7, legitimacy: 7, humanCost: -4, fatigue: 4 },
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "c3_trap_deep",
        label: "오진우와 정보를 합쳐 공동안을 만든다",
        effect: { time: -8, trust: 9, capital: 5, fatigue: 4 },
        cognition: { reframing: 2, inference: 1 },
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
 * Everything else 사건 03 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case03 = {
  id: "case03",
  nodes: case03Nodes,
  aftermath: {
    c3_aftershock: {
      phase: "AFTERMATH",
      title: "승자의 빈 화면",
      speaker: "오진우",
      text: "발표가 끝났지만 점수는 공개되지 않았습니다. 오진우가 묻습니다. 이번 결과가 고객을 위한 것이었는지, 누군가 배점표까지 만들어 놓은 경주에서 이긴 것인지. '그 표, 새벽 두 시에 수정됐더군요. 저도 봤습니다.'",
      memo: ["고객사는 두 안 모두 보류함", "오진우의 원본 제출 시간이 조작됐을 가능성", "보안 결함을 숨긴 쪽이 높은 점수를 받음"],
      triggers: ["competition", "recognition", "curiosity"],
      choices: [
        { id: "c3_after_share", label: "두 안의 장점을 합쳐 고객에게 다시 제안한다", effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 7 }, next: "case03_result", cognition: { reframing: 2 } },
        { id: "c3_after_proof", label: "점수보다 보안 결함의 증거를 먼저 공개한다", effect: { capital: -8, legitimacy: 15, fatigue: 6 }, next: "case03_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c3_after_win", label: "승리를 확정하고 경쟁자의 허점을 이용한다", effect: { capital: 13, trust: -10, legitimacy: -8, humanCost: 5, fatigue: 3 }, next: "case03_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: [null, "c3_aftershock"],
  connectiveScenes: [
    {
      id: "c3_rival",
      after: "c3_split",
      next: "c3_score",
      title: "같은 자료, 다른 목적",
      speaker: "오진우",
      text: "오진우는 당신의 자료에 없는 숫자를 들고 왔습니다. 고객이 실제로 원하는 것은 비용 절감이 아니라 실패했을 때 책임질 사람이라는 사실입니다.",
      memo: ["고객사는 책임 조항을 비공개로 요구함", "경쟁안은 책임을 하청사로 넘김", "보안팀은 발표에서 빠져 있음"],
      choices: [
        {
          label: "책임 조항을 앞에 세운다",
          effect: { legitimacy: 8, capital: -6, time: -5, fatigue: 5 },
          voice: "책임 조항을 문장 단위로 확인해 제안서 맨 앞에 세우겠습니다.",
          echo: "책임 조항을 앞에 세우면 제안은 무거워지고, 실패한 날 그 문장만 작동합니다.",
        },
        {
          label: "비용표부터 다시 계산한다",
          effect: { capital: 8, trust: -4, humanCost: 3, time: -6, fatigue: 4 },
          voice: "고객의 목적과 비용 절감의 목적을 분리해 비용표부터 다시 계산하겠습니다.",
          echo: "다시 계산한 표는 정확해지고, 그 사이 고객은 상대의 숫자를 먼저 봅니다.",
        },
        {
          label: "내 자료에 없는 숫자의 출처를 오진우에게 묻는다",
          effect: { trust: 6, legitimacy: 5, humanCost: -3, capital: -3, time: -6, fatigue: 5 },
          voice: "그 숫자가 어디서 왔는지 오진우에게 직접 묻겠습니다.",
          echo: "출처를 물으면 상대는 준비할 시간을 얻고, 답하지 않는 것도 하나의 답이 됩니다.",
        },
      ],
    },
    {
      id: "c3_signal",
      after: "c3_score",
      next: "c3_trap",
      title: "관객석의 신호",
      speaker: "에코",
      text: "발표장 뒤편의 불이 두 번 깜빡였습니다. 고객 신호인지 트리거랩의 시험인지 알 수 없지만, 오진우는 그 신호를 보고 답을 바꿉니다.",
      memo: ["불빛은 보안 경고와 같은 주기임", "고객 대표는 신호를 부인함", "오진우의 응답 시간이 비정상적으로 짧아짐"],
      choices: [
        {
          label: "신호를 공개 질문으로 바꾼다",
          effect: { trust: 7, legitimacy: 6, capital: -5, time: -4, fatigue: 5 },
          voice: "발표를 멈추지 않고, 저 신호를 질문으로 바꿔 화면에 올리겠습니다.",
          echo: "질문으로 바꾸면 의심은 공개되고, 발표의 주도권은 관객석으로 넘어갑니다.",
        },
        {
          label: "발표를 멈추고 보안부터 확인한다",
          effect: { legitimacy: 8, time: -8, capital: -5, fatigue: 6 },
          voice: "발표를 멈추고 보안부터 확인하겠습니다.",
          echo: "멈춘 발표는 다시 시작하기 어렵고, 확인하지 못한 채 끝내는 것보다는 낫습니다.",
        },
        {
          label: "상대보다 먼저 결론을 밀어붙인다",
          effect: { capital: 9, trust: -7, humanCost: 5, time: 4, fatigue: -4 },
          voice: "신호가 무엇이든 상대보다 먼저 결론을 밀어붙이겠습니다.",
          echo: "먼저 밀면 점수는 오늘 들어오고, 그 신호의 값은 다음 사람이 계산합니다.",
        },
        {
          label: "오진우와 신호의 해석을 나눠 갖는다",
          effect: { capital: 6, trust: 4, legitimacy: -7, humanCost: 2, fatigue: 3 },
          voice: "신호의 해석을 경쟁자와 나눠 갖겠습니다.",
          echo: "해석을 나누면 위험도 나뉘지만 기준도 함께 흐려집니다.",
        },
      ],
    },
    {
      id: "c3_verdict",
      after: "c3_trap",
      next: "c3_final_joint",
      title: "승부의 끝에서",
      speaker: "한서윤",
      text: "당신은 이제 오진우보다 빠르거나 느린 사람이 아닙니다. 어떤 기준으로 승부를 끝낼지 정하는 사람입니다.",
      memo: ["고객사는 오늘 안에 결론을 원함", "보안 결함은 아직 완전 증명 전", "공동 발표를 하면 책임은 나뉨"],
      choices: [
        {
          label: "검증을 끝낸 뒤 발표한다",
          effect: { legitimacy: 9, time: -8, capital: -5, fatigue: 6 },
          voice: "검증을 끝낸 뒤에 발표하겠습니다.",
          echo: "검증을 마치면 문장은 단단해지고, 발표할 자리는 이미 상대가 차지합니다.",
        },
        {
          label: "공동 책임으로 발표한다",
          effect: { trust: 8, legitimacy: 5, humanCost: -4, capital: -6, fatigue: 5 },
          voice: "책임을 나눠 지는 조건으로 함께 발표하겠습니다.",
          echo: "나눠 진 책임은 오늘의 부담을 줄이고, 실패한 날 누구의 것도 아니게 됩니다.",
        },
        {
          label: "불확실성을 숨기고 승리를 확정한다",
          effect: { capital: 10, trust: -8, legitimacy: -5, humanCost: 6, time: 4, fatigue: -4 },
          voice: "불확실한 부분은 덮고 승리부터 확정하겠습니다.",
          echo: "덮은 불확실성은 사라지지 않고, 확정된 승리 안에서 조용히 자랍니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c3_rival_reaction",
      after: "c3_rival",
      next: "c3_score",
      title: "경쟁자의 제안",
      speaker: "오진우",
      text: "오진우는 자신의 안을 훔쳐도 좋다고 말합니다. 대신 당신이 그 안을 어떻게 바꾸는지 보고 싶다고 합니다.",
      memo: ["경쟁안이 숨긴 책임 조항", "공동 검증을 시작할 증거"],
      choices: [
        {
          label: "공동 검증 조건을 제안한다",
          effect: { trust: 7, legitimacy: 6, capital: -6, time: -5, fatigue: 4 },
          voice: "공동 검증 조건을 먼저 제안하겠습니다.",
          echo: "공동 검증은 승부를 늦추고 기준을 남깁니다.",
        },
        {
          label: "자료 출처를 따져 협상을 멈춘다",
          effect: { legitimacy: 8, capital: -4, time: -8, fatigue: 5 },
          voice: "자료의 출처를 확인할 때까지 협상을 멈추겠습니다.",
          echo: "멈추는 동안 상대는 계속 움직이지만 근거는 당신 쪽에 쌓입니다.",
        },
        {
          label: "상대의 안을 이용해 먼저 제출한다",
          effect: { capital: 10, trust: -8, legitimacy: -4, time: 4, fatigue: -3 },
          voice: "상대의 안을 이용해 먼저 제출하겠습니다.",
          echo: "먼저 제출하면 이기고, 그 안의 출처는 영원히 당신 것이 아닙니다.",
        },
      ],
    },
    {
      id: "c3_signal_reaction",
      after: "c3_signal",
      next: "c3_trap",
      title: "두 번 깜빡인 불",
      speaker: "한서윤",
      text: "신호가 다시 깜빡였습니다. 이번에는 고객 대표도 보았습니다. 하지만 누구도 먼저 그 의미를 말하지 않습니다.",
      memo: ["두 번 깜빡인 신호의 출처", "발표를 멈춘 비용의 책임"],
      choices: [
        {
          label: "모두 앞에서 신호의 의미를 질문한다",
          effect: { legitimacy: 7, trust: 6, capital: -5, time: -4, fatigue: 5 },
          voice: "신호가 무엇인지 모두 앞에서 묻겠습니다.",
          echo: "공개된 질문은 답이 없어도 기준을 만듭니다.",
        },
        {
          label: "발표를 계속하며 신호를 기록한다",
          effect: { legitimacy: 4, humanCost: 2, time: -3, fatigue: 6 },
          voice: "발표를 계속하면서 신호를 기록해 두겠습니다.",
          echo: "기록하면서 계속하는 선택은 아무것도 결정하지 않는 방식이기도 합니다.",
        },
        {
          label: "신호를 무시하고 점수부터 확보한다",
          effect: { capital: 9, trust: -7, humanCost: 5, time: 4, fatigue: -4 },
          voice: "신호는 두고 점수부터 확보하겠습니다.",
          echo: "점수를 먼저 챙기면 신호는 다음 사람의 문제가 됩니다.",
        },
      ],
    },
    {
      id: "c3_verdict_reaction",
      after: "c3_verdict",
      next: "c3_final_joint",
      title: "승부 뒤의 책임표",
      speaker: "에코",
      text: "누가 이겼는지는 이미 결정됐지만 책임표는 비어 있습니다. 성공한 뒤의 실패를 누가 설명할지 정해야 합니다.",
      memo: ["승리 후 비어 있는 책임표", "공동 발표가 남길 약속"],
      choices: [
        {
          label: "책임표를 공동으로 작성한다",
          effect: { trust: 7, legitimacy: 7, time: -6, fatigue: 5 },
          voice: "책임표를 함께 작성하겠습니다.",
          echo: "함께 적은 표는 실패했을 때 실제로 작동합니다.",
        },
        {
          label: "내 이름을 가장 위에 적는다",
          effect: { legitimacy: 8, trust: 5, humanCost: -4, capital: -6, fatigue: 8 },
          voice: "책임표 맨 위에 제 이름을 적겠습니다.",
          echo: "맨 위의 이름은 방패가 되지만 그 사람 하나만 방패입니다.",
        },
        {
          label: "성과가 난 뒤에 책임을 논의한다",
          effect: { time: 6, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -5 },
          voice: "성과를 확정한 뒤에 책임을 논의하겠습니다.",
          echo: "뒤로 미룬 책임 논의는 대개 열리지 않습니다.",
        },
      ],
    },
  ],
  branchPlan: ["c3_score", 1, "c3_branch_signal", "c3_branch_signal_follow"],
  branchScenes: {
    c3_branch_signal: {
      phase: "SIDE DOOR",
      title: "관객석의 신호를 멈춰 읽기",
      speaker: "에코",
      text: "발표 화면의 신호는 경쟁사의 방해일 수도, 고객이 보내는 마지막 확인 요청일 수도 있습니다.",
      memo: ["신호가 켜진 시각", "고객 계정의 반응", "발표 중단 비용"],
      triggers: ["competition", "curiosity"],
      choices: [
        { id: "c3_branch_signal_a", label: "신호를 공개 질문으로 전환한다", effect: { trust: 7, legitimacy: 6, time: -6, capital: -5, fatigue: 3 }, next: "c3_branch_signal_follow", cognition: { reframing: 2 } },
        { id: "c3_branch_signal_b", label: "발표를 멈추고 출처를 확인한다", effect: { time: -8, capital: -3, legitimacy: 7 }, next: "c3_branch_signal_follow", cognition: { inference: 2 } },
        { id: "c3_branch_signal_c", label: "신호를 무시하고 승부를 끝낸다", effect: { capital: 9, trust: -6, humanCost: 4, fatigue: -3 }, next: "c3_branch_signal_follow", cognition: { risk: 2 } },
      ],
    },
    c3_branch_signal_follow: {
      phase: "SIDE DOOR",
      title: "빠른 승리의 조건표",
      speaker: "오진우",
      text: "결과가 좋아도 조건표에 빈칸이 남으면 다음 경쟁은 그 빈칸부터 시작됩니다.",
      memo: ["승리 발표의 수혜자", "검증되지 않은 보안 항목", "다음 계약의 조건"],
      triggers: ["competition", "order"],
      choices: [
        { id: "c3_branch_signal_follow_a", label: "승리 조건에 검증 기한을 붙인다", effect: { legitimacy: 8, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "c3_final_system", cognition: { persistence: 1 } },
        { id: "c3_branch_signal_follow_b", label: "공동 책임자를 발표한다", effect: { trust: 8, capital: -4, legitimacy: 4 }, next: "c3_final_system", cognition: { reframing: 1 } },
        { id: "c3_branch_signal_follow_c", label: "성과 수치만 먼저 확정한다", effect: { capital: 8, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -3 }, next: "c3_final_system", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
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
          ["c3_route_fast_lock", "빠른 안에 검증 기한을 조건으로 붙인다", { capital: 7, legitimacy: 6, time: -5, humanCost: 2, fatigue: 5 }, { persistence: 1, risk: 1 }],
          ["c3_route_fast_polish", "숫자를 더 다듬어 점수판 우위를 고정한다", { time: 6, capital: 9, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c3_route_fast_reopen", "내가 생략한 보안 항목을 직접 공개한다", { legitimacy: 9, trust: 4, capital: -6, time: -7, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "빠른 답이 만든 기준",
        finalText: "당신은 이길 수 있습니다. 문제는 이긴 뒤 고객이 같은 속도를 다음 사람에게도 요구하게 된다는 점입니다.",
        finalMemo: ["점수판은 속도를 보상함", "검증 기한은 아직 계약 조건 밖", "오진우는 같은 압박을 다음 입찰에도 쓸 수 있음"],
        finalChoices: [
          ["a", "이긴 안에 검증 기한을 계약 조건으로 박아 넣는다", { legitimacy: 9, trust: 6, capital: -6, time: -6, fatigue: 7 }, { persistence: 2, reframing: 1 }],
          ["b", "속도를 성과로 보고하고 다음 입찰도 같은 기준으로 받는다", { capital: 10, time: 6, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "내가 생략한 항목 목록을 고객에게 함께 넘긴다", { trust: 10, legitimacy: 7, capital: -5, time: -4, fatigue: 7 }, { reframing: 3 }],
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
          ["c3_route_deep_attach", "결함 보고서를 입찰안 첫 장에 붙인다", { legitimacy: 9, trust: 3, capital: -6, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
          ["c3_route_deep_delay", "계약 전 검증 시간을 공식 요청한다", { trust: 5, legitimacy: 7, capital: -5, time: -9, fatigue: 7 }, { persistence: 2 }],
          ["c3_route_deep_bury", "결함은 내부 부록에 묶고 가격 경쟁을 계속한다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
        ],
        finalTitle: "맞는 답의 손실",
        finalText: "느린 답은 더 정확하지만, 정확함만으로는 입찰장을 이기지 못합니다. 이제 손실을 누가 공식적으로 감수할지 정해야 합니다.",
        finalMemo: ["결함은 상당히 유력함", "마감 연장은 불확실함", "정확한 답은 당장의 점수를 잃음"],
        finalChoices: [
          ["a", "결함 보고서를 붙인 안을 그대로 내고 탈락을 감수한다", { legitimacy: 10, trust: 5, capital: -8, time: -5, fatigue: 7 }, { persistence: 2, inference: 1 }],
          ["b", "결함은 부록에 묻고 가격으로 계약을 가져온다", { capital: 10, time: 5, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "손실을 회사 비용으로 공식화하고 결함 검증은 계약 밖에서 계속한다", { trust: 9, legitimacy: 7, capital: -6, fatigue: 8 }, { reframing: 3 }],
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
          ["c3_route_mirror_call", "오진우에게 빈 책임 조항을 직접 묻는다", { trust: 7, legitimacy: 6, capital: -4, time: -5, fatigue: 5 }, { reframing: 2 }],
          ["c3_route_mirror_use", "빈칸을 이용해 내 안을 더 유리하게 만든다", { capital: 10, time: 4, trust: -7, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c3_route_mirror_share", "빈칸을 공동 검증 조건으로 바꾼다", { trust: 9, legitimacy: 5, capital: -6, fatigue: 6 }, { reframing: 2, inference: 1 }],
        ],
        finalTitle: "경쟁자를 도구로 쓸 것인가",
        finalText: "오진우를 이기는 길과 오진우를 증인으로 만드는 길이 갈라졌습니다. 당신은 경쟁을 끝낼 수도, 경쟁 자체를 증거로 만들 수도 있습니다.",
        finalMemo: ["공동안은 책임을 나눔", "독자안은 점수판에서 유리함", "경쟁 구조 공개는 고객을 불편하게 함"],
        finalChoices: [
          ["a", "공동안을 내고 책임 조항을 두 사람 이름으로 채운다", { legitimacy: 8, trust: 7, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
          ["b", "오진우의 빈칸을 근거로 독자안을 밀어붙인다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "경쟁 구조 자체를 고객 앞에서 문제로 올린다", { trust: 10, legitimacy: 8, capital: -7, time: -4, fatigue: 8 }, { reframing: 3 }],
        ],
      },
    },
    system: {
      route: "c3_route_system",
      final: "c3_final_system",
      title: "점수판이 당신을 따라온다",
      speaker: "에코",
      text: "오진우와 겨루는 대신 무엇으로 점수를 매기는지부터 묻자 점수판 항목이 바뀝니다. 이번 입찰은 오진우와의 승부가 아니라, 당신이 어떤 평가 기준을 만들면 따라오는지 보는 장치였습니다.",
      memo: ["다시 짠 판이 새 평가 항목으로 변환됨", "오진우 점수도 동시에 재계산됨", "고객 화면에는 변경 사유가 보이지 않음"],
      routeChoices: [
        ["c3_route_system_read", "새로 생긴 평가 항목이 어디서 왔는지 추적한다", { legitimacy: 8, trust: 3, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c3_route_system_ride", "바뀐 점수판을 그대로 타고 우위를 굳힌다", { capital: 9, time: 6, trust: -7, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c3_route_system_tell", "오진우에게 점수판이 바뀌었다는 사실을 먼저 알린다", { trust: 9, legitimacy: 5, capital: -5, time: -4, fatigue: 6 }, { reframing: 2 }],
      ],
      finalTitle: "기준을 만든 사람",
      finalText: "발표를 앞둔 화면에서 점수판이 한 번 더 고쳐집니다. 새로 생긴 항목의 이름은 당신이 다시 짠 판에서 그대로 왔고, 고객 화면에는 바뀐 이유가 보이지 않습니다. 에코가 덧붙입니다. '이 입찰은 두 사람 가운데 하나를 고르지 않습니다. 기준을 만드는 사람을 고릅니다.'",
      finalMemo: ["새 평가 항목: 다시 짠 판에서 옮겨 옴", "오진우의 점수도 함께 다시 계산됨", "고객 화면에는 변경 사유가 없음"],
    },
    finalChoices: [
      ["a", "내가 만든 평가 기준을 고객에게 공개한다", { legitimacy: 9, trust: 5, capital: -6, time: -6, fatigue: 7 }, { reframing: 2, persistence: 1 }],
      ["b", "기준은 숨기고 결과만 유리하게 사용한다", { capital: 9, time: 5, trust: -7, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "오진우와 함께 점수판 자체를 거부한다", { trust: 10, legitimacy: 6, capital: -5, fatigue: 7 }, { reframing: 3 }],
    ],
  },
  routeBody: {
    routes: {
      c3_route_deep: { entry: "c3_split", tail: "c3_rival_reaction", final: "c3_final_right" },
      c3_route_fast: { entry: "c3_score", tail: "c3_signal_reaction", final: "c3_final_win" },
      c3_route_mirror: { entry: "c3_trap", tail: "c3_verdict_reaction", final: "c3_final_joint" },
      c3_route_system: { entry: "c3_branch_signal", tail: "c3_branch_signal_follow", final: "c3_final_system" },
    },
  },
  evidencePlan: {
    node: "c3_evidence_turn",
    result: "c3_aftershock",
    sourceRoutes: ["c3_route_fast", "c3_route_deep", "c3_route_mirror", "c3_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "고객에게 보인 점수판을 단서에 비추어, 점수판이 정말 하나뿐인지 캔다.",
    entryEcho: "단서에 비추면 승부의 기준이 승부보다 먼저 문제가 됩니다.",
    title: "두 번째 점수판",
    speaker: "오진우",
    text: "단서를 대조하자 고객에게 보이는 점수판과 내부 심사용 점수판이 다르다는 사실이 드러납니다. 이제 승패보다 어느 점수판을 진짜 계약 기준으로 인정할지가 문제입니다.",
    memo: ["외부 점수판과 내부 점수판의 가중치가 다름", "오진우도 같은 불일치를 알고 있음", "빠른 승리는 숨은 점수판을 그대로 남길 수 있음"],
    triggers: ["competition", "injustice", "curiosity"],
    entryEffect: { legitimacy: 4, trust: 2, time: -4, fatigue: 3 },
    choices: [
      ["c3_evidence_turn_merge", "두 점수판을 합쳐 고객에게 다시 제출한다", { legitimacy: 9, trust: 6, capital: -7, time: -7, fatigue: 7 }, { reframing: 2, inference: 1 }],
      ["c3_evidence_turn_use", "내부 점수판의 허점을 이용해 계약을 딴다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c3_evidence_turn_refuse", "점수판 계약 자체를 거부한다", { trust: 8, legitimacy: 9, capital: -9, fatigue: 8 }, { persistence: 2 }],
    ],
    entryLabel: "공개 점수판 밑에 깔린 두 번째 점수판을 연다",
  },
  memoryPlan: {
    routeNext: "c3_route_mirror",
    systemNext: "c3_route_system",
    evidenceNext: "c3_evidence_turn",
    routeLabel: "직전 사건의 보호 결정을 경쟁자의 계약서에 대조한다",
    systemLabel: "감사실에서 다시 짠 판이 점수판 항목에 올랐는지 훑는다",
    evidenceLabel: "어긋난 시간을 단서 삼아 점수판 뒤의 평가표를 찾는다",
    routeEcho: "대조하면 오진우의 안에서 책임 조항만 비어 있는 것이 보입니다. 그 빈칸이 실수인지 시험인지는 그에게 물어야 압니다.",
    systemEcho: "훑으면 점수판의 새 항목 하나가 당신이 다시 짠 판과 같은 말로 적혀 있습니다. 점수를 매기는 쪽이 당신을 읽고 있었습니다.",
    evidenceEcho: "어긋난 시간을 따라가면 고객에게 보이는 점수판 아래에서 심사용 점수판이 하나 더 열립니다. 두 판은 같은 항목을 다른 무게로 답니다.",
  },
  openingRoutes: {
    c2_after_audit: "c3_start_audit",
    c2_after_person: "c3_start_person",
    c2_after_public: "c3_start_public",
  },
  openingCopy: {
    c3_start_audit: ["복원된 기록의 경쟁", "반재욱", "기록을 복원한 당신에게 이번에는 더 빠른 결론이 요구됩니다. 오진우는 원본보다 먼저 읽기 쉬운 답을 만들어 놓았습니다.", ["감사 기록은 완전하지 않음", "입찰 마감까지 4시간", "고객은 근거보다 확신을 원함"]],
    c3_start_person: ["사람을 믿은 뒤의 경쟁", "도윤하", "이민서를 보호한 결정은 다음 사건의 비용이 됐습니다. 오진우는 그 선택을 약점이라고 부르며 더 빠른 해답을 제시합니다.", ["고객은 속도 보상을 약속함", "이민서의 증언이 일부 공개됨", "경쟁안은 보호 비용을 삭제함"]],
    c3_start_public: ["경보가 된 경쟁", "에코", "유출 가능성을 외부에 알린 뒤 모든 시선이 당신에게 모였습니다. 이번 입찰은 해결안이 아니라 경보를 누가 통제하는지에 대한 싸움입니다.", ["고객은 공개 해명을 요구함", "오진우는 침묵을 전략으로 삼음", "보안 결함 제보가 추가됨"]],
  },
  openingSignatures: {
    c3_start_audit: {
      label: "복원한 기록을 입찰 근거로 공개한다",
      effect: { legitimacy: 8, trust: 4, capital: -4, time: -6 },
      cognition: { inference: 2 },
      next: "c3_route_deep",
      voice: "복원해 둔 원본을 그대로 입찰 자료에 붙인다.",
      echo: "복원된 기록은 반박하기 어렵습니다. 동시에 경쟁사에게도 당신의 근거를 통째로 보여줍니다.",
    },
    c3_start_person: {
      label: "이민서에게 이번 검증을 맡긴다",
      effect: { trust: 8, humanCost: -3, capital: -5, time: -4, fatigue: 3 },
      cognition: { reframing: 2 },
      next: "c3_route_mirror",
      voice: "의심받았던 사람에게 이번 검증의 이름을 준다.",
      echo: "지목당했던 사람이 검증자가 되면 조직의 기준이 바뀝니다. 실패하면 두 번째 지목이 됩니다.",
    },
    c3_start_public: {
      label: "경보를 낸 사람으로서 공개 검증단을 요구한다",
      effect: { legitimacy: 9, capital: -5, time: -7, fatigue: 4 },
      cognition: { persistence: 2 },
      next: "c3_route_system",
      voice: "내가 먼저 알렸으니 검증도 공개로 하자고 요구한다.",
      echo: "공개 검증은 의심을 끝냅니다. 끝나기 전까지 입찰은 멈추고 그 비용은 당신이 냅니다.",
    },
  },
  voiceLines: {
    c3_start_fast: "오진우의 속도에 말려들지 않으려 애쓰며, 그래도 먼저 결론을 낸다.",
    c3_start_deep: "지는 것처럼 보이더라도, 더 오래 들여다보겠다고 버틴다.",
    c3_start_mirror: "상대의 판을 빌리되, 그 안에서 약점을 찾겠다고 말한다.",
    c3_split_invert: "질문 자체가 틀렸을지 모른다며, 문제의 방향을 뒤집는다.",
    c3_branch_signal_a: "숨기지 않고, 화면의 신호를 공개 질문으로 바꿔 무대 위에 올린다.",
    c3_branch_signal_b: "흐름이 끊길 걸 알면서도 발표를 멈추고 출처를 확인한다.",
    c3_branch_signal_c: "신호를 못 본 척하고, 이길 수 있을 때 승부를 끝낸다.",
    c3_branch_signal_follow_a: "승리를 확정 짓기 전에, 조건표에 검증 기한을 못박는다.",
    c3_branch_signal_follow_b: "혼자 받는 박수를 나누어, 공동 책임자를 발표한다.",
    c3_branch_signal_follow_c: "빈칸을 남겨둔 채, 성과 수치부터 확정한다.",
    c3_after_share: "승패를 접어두고, 두 안의 장점을 합쳐 고객에게 다시 제안한다.",
    c3_after_proof: "결함을 숨긴 쪽이 높은 점수를 받았으니, 점수보다 보안 결함의 증거를 먼저 공개한다.",
    c3_after_win: "망설임을 끊고, 승리를 확정한 뒤 경쟁자의 허점을 이용한다.",
    c3_score_fast: "평가표가 요구하는 모양으로, 가진 안을 잘라 맞춘다.",
    c3_split_deep: "싼 답이 비싼 이유를 숫자로 만들겠다며 계산을 다시 연다.",
    c3_score_deep: "제보 내용보다 제보한 사람의 위치를 먼저 확인한다.",
    c3_trap_deep: "이기는 것보다 틀리지 않는 것이 낫다며, 상대에게 자료를 연다.",
    c3_split_mirror: "상대의 숫자를 인정하고, 그 위로 한 칸 더 올린다.",
    c3_trap_mirror: "내용보다 순서와 강조로 승부를 보겠다고 정한다.",
    c3_score_invert: "이 표로는 아무도 옳을 수 없다며, 평가 기준 자체를 안건에 올린다.",
    c3_trap_invert: "누가 이 경쟁을 설계했는지부터 고객에게 말한다.",
    c3_start_audit_fast: "복원해 둔 기록이 있으니 속도로도 지지 않는다며, 1차안을 먼저 낸다.",
    c3_start_audit_deep: "기록을 복원한 사람답게, 이번에도 결함부터 끝까지 본다.",
    c3_start_audit_mirror: "오진우가 무엇을 지웠을지부터 추정해 대응안을 짠다.",
    c3_start_person_fast: "사람을 지킨 대가를 속도로 갚겠다며 먼저 안을 낸다.",
    c3_start_person_deep: "한 번 믿은 사람을 다시 의심하지 않기 위해, 결함 쪽을 판다.",
    c3_start_person_mirror: "오진우가 그 보호를 어떻게 쓸지 먼저 계산한다.",
    c3_start_public_fast: "경보를 낸 쪽이 느리면 안 된다며 결론을 먼저 낸다.",
    c3_start_public_deep: "알린 사람이 증명도 해야 한다며 결함 검증을 끝까지 간다.",
    c3_start_public_mirror: "경보를 이용하려는 쪽의 수부터 읽는다.",
    c3_route_fast_lock: "빠른 답이 그대로 굳는 것을 막으려고, 검증 기한을 조건으로 붙인다.",
    c3_route_fast_polish: "우위를 굳히겠다는 판단으로, 숫자를 더 다듬어 점수판을 고정한다.",
    c3_route_fast_reopen: "내가 건너뛴 자리를 내가 먼저 말해야 한다고 보고, 보안 항목을 공개한다.",
    c3_final_win_a: "속도가 기준이 되는 것을 막으려고, 검증 기한을 계약서에 박아 넣는다.",
    c3_final_win_b: "이긴 방식이 옳았다고 보고, 같은 기준으로 다음 입찰도 받는다.",
    c3_final_win_c: "고객이 무엇을 못 봤는지 알아야 한다고 보고, 생략 목록을 함께 넘긴다.",
    c3_route_deep_attach: "결함을 부록에 숨기지 않겠다는 듯, 첫 장에 붙인다.",
    c3_route_deep_delay: "마감보다 확인이 먼저라고 보고, 공식으로 검증 시간을 요청한다.",
    c3_route_deep_bury: "이기고 나서 고치면 된다는 판단으로, 결함은 부록에 묶는다.",
    c3_final_right_a: "지더라도 틀린 안을 내지는 않겠다는 듯, 보고서를 붙인 채 제출한다.",
    c3_final_right_b: "정확함이 계약을 주지는 않는다고 판단하고, 가격으로 승부한다.",
    c3_final_right_c: "손실을 누가 지는지부터 정하려고, 회사 비용으로 공식화한다.",
    c3_route_mirror_call: "빈칸이 실수인지 시험인지 확인하려고, 오진우에게 직접 묻는다.",
    c3_route_mirror_use: "상대가 남긴 틈을 그대로 쓰겠다는 판단으로, 내 안을 유리하게 고친다.",
    c3_route_mirror_share: "이기는 대신 판을 바꾸려고, 빈칸을 공동 검증 조건으로 만든다.",
    c3_final_joint_a: "책임을 나눠 적어야 판이 유지된다고 보고, 두 이름을 함께 올린다.",
    c3_final_joint_b: "경쟁은 경쟁이라고 판단하고, 상대의 빈칸을 근거로 독자안을 민다.",
    c3_final_joint_c: "이 경쟁 자체가 문제라고 보고, 고객 앞에서 구조를 문제로 올린다.",
    c3_route_system_read: "새 항목이 어디서 왔는지 알아야 한다고 보고, 출처를 추적한다.",
    c3_route_system_ride: "바뀐 판이 유리하다는 판단으로, 그대로 타고 우위를 굳힌다.",
    c3_route_system_tell: "혼자만 아는 정보로 이기지 않겠다는 듯, 오진우에게 먼저 알린다.",
    c3_final_system_a: "기준을 만든 사람이 나였다는 사실부터 밝히고, 고객에게 연다.",
    c3_final_system_b: "설명할 이유가 없다고 보고, 기준은 덮은 채 결과만 쓴다.",
    c3_final_system_c: "판을 이기는 대신 판을 멈추자고, 경쟁자에게 손을 내민다.",
    c3_evidence_turn_merge: "고객이 두 개의 점수판을 봐야 한다고 보고, 합쳐서 다시 낸다.",
    c3_evidence_turn_use: "허점을 알고 있다는 것이 이점이라고 판단하고, 그대로 계약을 딴다.",
    c3_evidence_turn_refuse: "이 점수판으로는 계약하지 않겠다고, 자리에서 물러난다.",
  },
  echoReplies: {
    c3_start_fast:
      "속도는 경쟁에서 유리합니다. 하지만 빠른 결론은 상대가 설계한 문제의 틀 안에서만 이기는 방식일 수 있습니다.",
    c3_start_deep:
      "추가 분석은 질을 높입니다. 대신 오진우가 먼저 결과를 제출하면 당신의 판단은 방어 논리처럼 보일 수 있습니다.",
    c3_start_mirror:
      "상대의 전략을 복제하면 격차를 줄일 수 있습니다. 그러나 그 순간 당신의 생각은 경쟁자가 만든 경로를 따라갑니다.",
    c3_split_invert:
      "문제 정의를 바꾸는 선택입니다. 성공하면 판을 가져오지만, 실패하면 시간만 잃은 것으로 기록됩니다.",
    c3_branch_signal_a:
      "공개 질문은 방해를 무력화합니다. 대신 당신이 준비하지 못한 답까지 그 자리에서 요구됩니다.",
    c3_branch_signal_b:
      "멈추면 사실을 얻습니다. 관객은 멈춤 자체를 자신 없음으로 읽을 수도 있습니다.",
    c3_branch_signal_c:
      "무시하면 승부는 끝납니다. 그 신호가 고객의 마지막 확인 요청이었다면 승리는 오늘까지만 유효합니다.",
    c3_branch_signal_follow_a:
      "기한은 성과를 검증 가능하게 만듭니다. 동시에 당신이 실패할 날짜를 스스로 정하는 일입니다.",
    c3_branch_signal_follow_b:
      "책임을 나누면 실행이 단단해집니다. 다음 경쟁에서 그 사람은 당신의 상대가 될 수도 있습니다.",
    c3_branch_signal_follow_c:
      "수치는 즉시 설득합니다. 빈칸은 사라지지 않고 다음 경쟁의 첫 질문이 됩니다.",
    c3_after_share:
      "합치면 고객이 얻습니다. 당신이 이겼다는 기록은 어디에도 남지 않습니다.",
    c3_after_proof:
      "결함 공개는 다음 사고를 막습니다. 그 결함을 통과시킨 심사 절차도 함께 드러납니다.",
    c3_after_win:
      "허점을 쓰면 격차는 벌어집니다. 같은 방식이 당신에게 쓰일 때 항의할 근거는 줄어듭니다.",
    c3_score_fast:
      "점수에 맞추면 점수는 오릅니다. 잘려 나간 항목이 실패의 자리라는 것도 함께 기록됩니다.",
    c3_split_deep:
      "증명은 강합니다. 증명이 끝나기 전에 결정이 내려지면 아무 힘도 없습니다.",
    c3_score_deep:
      "출처를 확인하면 판단이 단단해집니다. 확인하는 동안 제보자는 노출됩니다.",
    c3_trap_deep:
      "공동안은 검증을 두 배로 만듭니다. 동시에 당신의 근거도 상대의 자산이 됩니다.",
    c3_split_mirror:
      "경쟁 지표는 따라잡힙니다. 따라잡는 동안 무엇을 지표에서 뺐는지는 기록되지 않습니다.",
    c3_trap_mirror:
      "발표는 이길 수 있습니다. 이긴 발표가 검증을 대신하지는 못합니다.",
    c3_score_invert:
      "기준을 문제 삼으면 이번 경쟁은 늦어집니다. 다음 경쟁부터는 다른 표로 시작합니다.",
    c3_trap_invert:
      "설계를 공개하면 판이 멈춥니다. 멈춘 판에서 먼저 손해를 보는 쪽이 당신일 수도 있습니다.",
    c3_start_audit_fast:
      "근거가 있는 속도는 다릅니다. 다만 상대는 그 근거를 읽지 않고 결론만 봅니다.",
    c3_start_audit_deep:
      "복원의 습관이 검증의 습관이 됩니다. 두 번 다 느렸다는 평가도 함께 쌓입니다.",
    c3_start_audit_mirror:
      "지운 흔적을 찾아본 사람은 상대의 공백을 먼저 봅니다. 그 시선이 이번엔 추측이 됩니다.",
    c3_start_person_fast:
      "보호의 비용을 성과로 덮으려는 선택입니다. 덮은 비용은 사라지지 않고 자리를 옮깁니다.",
    c3_start_person_deep:
      "사람을 믿은 판단을 지키려면 다른 곳에서 근거를 더 가져와야 합니다.",
    c3_start_person_mirror:
      "상대는 이미 당신의 지난 결정을 자료로 씁니다. 대응은 늦게 시작됩니다.",
    c3_start_public_fast:
      "먼저 알린 사람에게는 먼저 답할 의무가 붙습니다. 그 의무가 속도를 강제합니다.",
    c3_start_public_deep:
      "공개는 시작이고 증명은 부담입니다. 지금 멈추면 경보만 남습니다.",
    c3_start_public_mirror:
      "공개된 위험은 모두의 자원이 됩니다. 상대가 먼저 쓰기 전에 읽어야 합니다.",
    c3_route_fast_lock: "기한을 붙이면 승기는 약해지고, 이긴 뒤의 책임은 명확해집니다.",
    c3_route_fast_polish: "다듬은 숫자는 오늘 이깁니다. 생략한 항목은 계약서 안에서 기다립니다.",
    c3_route_fast_reopen: "생략을 스스로 열면 점수는 떨어지고, 다음 질문의 기준은 당신이 잡습니다.",
    c3_final_win_a: "계약에 들어간 기한은 다음 입찰에도 남습니다. 이번 마진은 줄어듭니다.",
    c3_final_win_b: "고객은 같은 속도를 다음 사람에게도 요구합니다. 그 사람은 당신이 아닙니다.",
    c3_final_win_c: "목록을 넘기면 신뢰는 오르고, 이번 계약의 조건은 다시 열립니다.",
    c3_route_deep_attach: "첫 장의 결함은 읽히지 않을 수 없습니다. 입찰에서는 불리하게 읽힙니다.",
    c3_route_deep_delay: "요청은 기록에 남습니다. 승인되지 않아도 누가 서둘렀는지는 남습니다.",
    c3_route_deep_bury: "부록은 아무도 읽지 않습니다. 결함이 터질 때 그 사실이 증거가 됩니다.",
    c3_final_right_a: "탈락은 즉시 오고, 결함을 알고도 계약한 회사는 나중에 드러납니다.",
    c3_final_right_b: "계약은 들어오고, 결함의 비용은 계약서 밖 사람들이 냅니다.",
    c3_final_right_c: "비용을 회사가 지면 검증은 계속됩니다. 이번 분기 숫자는 나빠집니다.",
    c3_route_mirror_call: "묻는 순간 당신이 빈칸을 봤다는 사실도 상대에게 넘어갑니다.",
    c3_route_mirror_use: "틈을 쓰면 이깁니다. 같은 틈을 남기는 법도 함께 배웁니다.",
    c3_route_mirror_share: "공동 검증은 우위를 지웁니다. 대신 책임 조항이 처음으로 채워집니다.",
    c3_final_joint_a: "공동안은 점수판에서 밀립니다. 대신 빈 조항이 남지 않습니다.",
    c3_final_joint_b: "독자안은 이기고, 오진우는 다음 입찰에서 같은 방식을 씁니다.",
    c3_final_joint_c: "고객은 불편해집니다. 이 사건 이후 점수판의 항목이 바뀝니다.",
    c3_route_system_read: "추적하면 이 입찰이 승부가 아니라 관찰이었다는 쪽으로 기웁니다.",
    c3_route_system_ride: "당신에게 맞춰진 점수판은 다음 사람에게도 맞춰집니다.",
    c3_route_system_tell: "알리면 우위는 사라지고, 점수판을 만든 쪽이 처음으로 노출됩니다.",
    c3_final_system_a: "기준이 공개되면 이번 결과는 흔들리고, 다음 평가는 검증을 거칩니다.",
    c3_final_system_b: "유리한 결과는 남고, 그 결과를 만든 문장은 다음 참가자에게 넘어갑니다.",
    c3_final_system_c: "둘이 거부하면 이번 입찰은 무너지고, 평가 방식이 처음으로 논의됩니다.",
    c3_evidence_turn_merge: "합친 점수판은 이번 순위를 지웁니다. 대신 평가의 근거가 하나로 남습니다.",
    c3_evidence_turn_use: "허점을 이용한 계약은 허점이 알려지는 날까지만 유효합니다.",
    c3_evidence_turn_refuse: "거부는 매출을 잃습니다. 거부한 이유는 기록으로 남습니다.",
  },
  setting: { place: "노바웍스 입찰 대기실", clock: "입찰 마감까지 4h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 03
    c3_start_audit: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 4h",
      question: "기록을 복원해 낸 당신에게 이번엔 속도가 요구됩니다. 원본과 읽기 쉬운 답 중 무엇을 먼저 내겠습니까?",
      lead: "감사실을 나와 고객사 노바웍스의 입찰장(여러 회사가 조건을 내고 일을 따내려 겨루는 자리)으로 이동했습니다. 오진우는 옆방에서 같은 자료를 받고 있습니다.",
    },
    c3_start_person: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 4h",
      question: "이민서를 지킨 선택이 약점으로 불립니다. 그 기준을 이번에도 유지하겠습니까?",
      lead: "감사실을 나와 고객사 노바웍스의 입찰장(여러 회사가 조건을 내고 일을 따내려 겨루는 자리)으로 이동했습니다. 오진우는 지난 사건의 당신을 이미 읽고 왔습니다.",
    },
    c3_start_public: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 4h",
      question: "유출 가능성을 밖에 알린 뒤 시선이 모였습니다. 이번 싸움은 해결안입니까, 경보의 통제권입니까?",
      lead: "감사실을 나와 고객사 노바웍스의 입찰장(여러 회사가 조건을 내고 일을 따내려 겨루는 자리)으로 이동했습니다. 당신이 만든 경보가 입찰장까지 따라왔습니다.",
    },
    c3_start: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 4h",
      question: "오진우가 옆방에서 같은 자료로 경쟁안을 씁니다. 속도와 검증 중 무엇을 먼저 택하겠습니까?",
      lead: "감사실을 떠나 노바웍스 입찰장(여러 회사가 조건을 내고 일을 따내려 겨루는 자리)으로 이동했습니다. 이 회사도 KD은행에서 1,240억을 빌려 쓰고 있고, 공사 대금은 그룹 계열사(같은 그룹에 속한 다른 회사)로 들어옵니다. 당신과 오진우는 같은 자료를 받고 다른 방에 앉았습니다.",
    },
    c3_split: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 3h",
      question: "오진우의 안이 더 싸고 더 깔끔합니다. 절감률을 따라가겠습니까, 보안 결함을 증명하겠습니까?",
      lead: "옆방의 1차안이 먼저 도착했습니다. 그 안은 보안 제보를 '확인되지 않은 위험'으로 뒤로 미뤘습니다.",
    },
    c3_score: {
      place: "노바웍스 입찰 대기실 · 점수판 앞",
      clock: "입찰 마감까지 2h",
      question: "점수판은 오진우가 앞섭니다. 점수판 기준에 맞추겠습니까, 점수판의 결함을 걸겠습니까?",
      lead: "트리거랩 점수판에는 속도와 절감률은 있어도 장기 실패 비용 항목이 없습니다.",
    },
    c3_trap: {
      place: "노바웍스 발표장 뒤편",
      clock: "최종 발표까지 20m",
      question: "이 케이스가 입찰이 아니라 당신의 검증 포기를 보는 구조일 수 있습니다. 그래도 이기러 가겠습니까?",
      lead: "발표를 앞두고 반재욱이 조용히 다가옵니다. 오진우도 같은 말을 들었는지는 알 수 없습니다.",
    },
    c3_rival: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 2h 40m",
      question: "고객이 원하는 건 절감이 아니라 실패 시 책임질 사람입니다. 책임 조항을 앞에 세우겠습니까?",
    },
    c3_rival_reaction: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 2h 20m",
      question: "오진우가 자기 안을 가져가도 좋다고 합니다. 이 제안을 어떻게 받겠습니까?",
    },
    c3_signal: {
      place: "노바웍스 발표장 뒤편",
      clock: "최종 발표까지 45m",
      question: "발표장 뒤 불빛이 두 번 깜빡였고 오진우가 답을 바꿨습니다. 이 신호를 공개하겠습니까?",
    },
    c3_signal_reaction: {
      place: "노바웍스 발표장",
      clock: "최종 발표까지 30m",
      question: "신호가 다시 깜빡였고 고객 대표도 봤습니다. 누가 먼저 그 의미를 말하겠습니까?",
    },
    c3_verdict: {
      place: "노바웍스 발표장 뒤편",
      clock: "최종 발표까지 10m",
      question: "당신은 이제 빠르거나 느린 사람이 아니라 기준을 정하는 사람입니다. 어떤 기준으로 끝내겠습니까?",
    },
    c3_verdict_reaction: {
      place: "노바웍스 발표장",
      clock: "발표 직후",
      question: "승패는 정해졌는데 책임표는 비어 있습니다. 성공 뒤의 실패를 누가 설명하겠습니까?",
    },
    c3_branch_signal: {
      place: "노바웍스 발표장 뒤편",
      clock: "최종 발표까지 40m",
      question: "발표를 멈추고 신호를 읽기로 했습니다. 이 중단의 비용을 누가 지겠습니까?",
    },
    c3_branch_signal_follow: {
      place: "노바웍스 발표장",
      clock: "최종 발표까지 25m",
      question: "빠른 승리의 조건표가 비어 있습니다. 검증 기한을 못박겠습니까?",
    },
    c3_route_fast: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 3h 30m",
      question: "먼저 낸 답에 그림자가 남았습니다. 속도를 계속 밀겠습니까?",
      lead: "오진우보다 먼저 1차안을 제출한 직후입니다. 빨랐다는 사실이 곧 기준이 되기 시작합니다.",
    },
    c3_route_deep: {
      place: "노바웍스 입찰 대기실 · 기술 검토석",
      clock: "입찰 마감까지 3h 30m",
      question: "느린 쪽에 증거가 쌓입니다. 이 증거를 언제 꺼내겠습니까?",
      lead: "제보된 보안 결함을 먼저 검증하겠다고 말한 직후입니다. 지는 것처럼 보이는 동안 자료만 늘어납니다.",
    },
    c3_route_mirror: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 3h 30m",
      question: "상대의 판을 읽어 대응안을 짭니다. 그 판 안에서 무엇을 바꾸겠습니까?",
      lead: "오진우의 접근법을 추정해 대응안을 만들겠다고 말한 직후입니다.",
    },
    c3_route_system: {
      place: "노바웍스 입찰 대기실",
      clock: "입찰 마감까지 3h 30m",
      question: "점수판이 당신을 따라옵니다. 이 평가 구조를 어떻게 다루겠습니까?",
      lead: "빠른 안도 느린 안도 내지 않고 판을 다시 짜자 점수판이 그 판을 항목으로 추가했습니다.",
    },
    c3_final_win: {
      place: "노바웍스 발표장",
      clock: "최종 발표 직전",
      question: "빠른 답이 기준이 됐습니다. 그 기준을 확정하겠습니까?",
    },
    c3_final_right: {
      place: "노바웍스 발표장",
      clock: "최종 발표 직전",
      question: "맞는 답에는 손실이 붙습니다. 그 손실을 감수하겠습니까?",
    },
    c3_final_joint: {
      place: "노바웍스 발표장",
      clock: "최종 발표 직전",
      question: "경쟁자를 도구로 쓸 수도, 공동 책임자로 세울 수도 있습니다. 어느 쪽입니까?",
    },
    c3_final_system: {
      place: "노바웍스 발표장",
      clock: "최종 발표 직전",
      question: "경쟁 구조 자체가 시험이었습니다. 이 구조를 고객에게 넘기겠습니까?",
    },
    c3_evidence_turn: {
      place: "노바웍스 발표장 뒤편",
      clock: "최종 발표까지 15m",
      question: "두 번째 점수판이 나타났습니다. 이 점수판을 공개하겠습니까?",
    },
    c3_aftershock: {
      place: "노바웍스 발표장",
      clock: "발표 다음 날",
      question: "점수는 공개되지 않았습니다. 이 승리가 누구를 위한 것이었는지 어떻게 정리하겠습니까?",
      lead: "고객사는 두 안을 모두 보류했습니다. 오진우가 발표장 뒤에서 당신을 기다리고 있습니다.",
    },
  },
  clue: {
    id: "c3-second-scoreboard",
    title: "두 번째 점수판",
    text: "공개 점수판 뒤에 다른 평가표가 있습니다. 경쟁자는 당신의 답뿐 아니라 망설임도 보고 있습니다.",
  },
  outcomes: {
    c3_after_share: { tag: "공동 설계 결말", title: "승부를 공동 작업으로 바꾸었다", text: "오진우와의 경쟁은 사라지지 않았지만, 고객에게는 두 사람이 책임지는 안이 남았습니다." },
    c3_after_proof: { tag: "증거를 택한 결말", title: "점수판보다 결함을 먼저 보여주었다", text: "당장 얻을 점수는 줄었지만, 숨겨진 보안 위험이 다음 사건의 공개 기록이 됐습니다." },
    c3_after_win: { tag: "승리를 확정한 결말", title: "가장 빠른 답이 가장 오래 남았다", text: "당신은 이겼지만, 경쟁자가 숨긴 빈틈까지 함께 가져왔습니다. 다음 사건은 그 승리의 비용을 청구합니다." },
  },
  carryovers: {
    c3_after_share: { trust: 7, fatigue: 5, legitimacy: 3 },
    c3_after_proof: { capital: -5, legitimacy: 8, time: -4 },
    c3_after_win: { capital: 7, trust: -8, fatigue: 2 },
  },
  continuityChallenges: {
    c2_after_audit: { id: "find-cost", title: "기록의 빈틈 찾기", text: "복원한 기록이 놓친 비용을 하나 더 찾아야 경쟁자의 빠른 답을 넘어설 수 있습니다." },
    c2_after_person: { id: "protect-trust", title: "보호와 검증 함께 하기", text: "사람을 지키면서도 근거를 남기는 선택을 찾으면 경쟁 압박을 견딜 수 있습니다." },
    c2_after_public: { id: "lower-risk", title: "경보의 위험 낮추기", text: "공개 이후 커진 위험을 낮추는 선택이 다음 사건의 기준이 됩니다." },
  },
};
