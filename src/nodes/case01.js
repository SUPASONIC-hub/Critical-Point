/**
 * CASE 01 -- the authored scenes of the opening case.
 *
 * The file on the desk is not a training case. It is 대출번호 2023-0412, the one
 * loan the analyst refused to sign off three years ago, and the refusal is why
 * they now work in a basement lab instead of 기업금융전략팀. Everything the
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
      "플로우온은 수도권 당일배송망을 운영하는 물류 플랫폼입니다. 투자금 입금이 취소됐고 현금은 72시간 뒤 바닥납니다. 한서윤은 이것을 훈련용 사례라고 설명했습니다. 그런데 표지 아래쪽에 대출번호가 지워지지 않고 남아 있습니다. 2023-0412. 3년 전 KD은행 기업금융전략팀에서 그 건에 혼자 반대 의견을 쓴 사람이 당신입니다.",
    memo: [
      "직원 1,140명, 대금 못 받은 협력사 14곳",
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
        cognition: { risk: 2 },
      },
      {
        id: "funding",
        label: "단기 자금 조달에 집중한다",
        effect: { time: -8, capital: 9, legitimacy: -3, fatigue: 2 },
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "start_sale",
        label: "핵심 사업부 매각 가능성을 연다",
        effect: { capital: 22, trust: -8, legitimacy: -4, humanCost: 6 },
        cognition: { risk: 2 },
      },
      {
        id: "start_investigate",
        label: "추가 자료를 먼저 요청한다",
        effect: { time: -10, trust: 3, fatigue: 2 },
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
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "accounting_delay",
        label: "자금 확보 전까지 공개를 미룬다",
        effect: { time: -4, trust: -8, legitimacy: -12, fatigue: 3 },
        cognition: { risk: 1 },
      },
      {
        id: "accounting_investigate",
        label: "CFO와 회계팀을 분리 면담한다",
        effect: { time: -8, legitimacy: 3, fatigue: 2 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        cognition: { persistence: 1 },
      },
      {
        id: "payday_delay",
        label: "급여 지급 방안 확정 전까지 공개를 미룬다",
        effect: { trust: -10, capital: 3, legitimacy: -8, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "payday_negotiate",
        label: "임원 보수와 협력사 지급 일정을 동시에 조정한다",
        effect: { capital: 11, trust: 5, legitimacy: 3, fatigue: 4 },
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        cognition: { risk: 2 },
      },
      {
        id: "competitor_report",
        label: "CFO 책임 규명을 먼저 공식화한다",
        effect: { capital: -10, trust: 7, legitimacy: 11, fatigue: 4 },
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "competitor_negotiate",
        label: "투자자, 협력사, 경쟁사를 한 번에 묶어 재협상한다",
        effect: { time: -12, capital: 13, trust: 6, legitimacy: 4, fatigue: 4 },
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        cognition: { persistence: 2 },
      },
      {
        id: "survive",
        label: "회사 생존과 자금 확보를 최우선으로 둔다",
        effect: { capital: 24, trust: -12, legitimacy: -6, humanCost: 10, fatigue: 3 },
        cognition: { risk: 2 },
      },
      {
        id: "justice",
        label: "회계 문제 공개와 책임 규명을 최우선으로 둔다",
        effect: { capital: -18, trust: 9, legitimacy: 12, fatigue: 4 },
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "reframe",
        label: "선택지 밖의 구조를 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 01 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case01 = {
  id: "case01",
  nodes: case01Nodes,
  aftermath: {
    c1_aftershock: {
      phase: "AFTERMATH",
      title: "다음 날의 급여명세서",
      speaker: "도윤하",
      text: "결정 다음 날, 숫자보다 먼저 사람들의 반응이 도착했습니다. 직원들은 누가 보호받았는지 묻고, 협력사 대표는 당신이 남긴 약속을 다시 읽습니다. 그리고 KD은행 기업금융전략팀에서 한 줄짜리 회신이 왔습니다. '해당 건은 정상 처리로 종결.'",
      memo: ["직원 공지에 서로 다른 해석이 퍼짐", "협력사 대표가 조건 재협상을 요청함", "은행 회신: 정상 처리로 종결, 담당자 서명 없음"],
      triggers: ["protection", "responsibility", "trust"],
      choices: [
        { id: "c1_after_people", label: "직원과 협력사 앞에서 먼저 약속을 설명한다", effect: { trust: 9, legitimacy: 5, fatigue: 5 }, next: "result", cognition: { persistence: 1 } },
        { id: "c1_after_numbers", label: "현금 흐름표를 공개하고 감당할 손실을 정한다", effect: { capital: -6, legitimacy: 9, fatigue: 4 }, next: "result", cognition: { inference: 1, risk: 1 } },
        { id: "c1_after_silence", label: "다음 자금이 들어올 때까지 공개를 늦춘다", effect: { capital: 9, trust: -10, legitimacy: -6, fatigue: 2 }, next: "result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: [null, "c1_aftershock"],
  connectiveScenes: [
    {
      id: "c1_witness",
      after: "accounting",
      next: "payday",
      title: "누가 179.6을 만들었나",
      speaker: "반재욱",
      text: "회계팀 막내가 회의실 문 앞에서 멈춰 섰습니다. 장부가 틀렸다고 말하지는 않습니다. 대신 그 숫자를 만들던 날 회의실에 은행 사람이 앉아 있었다고 말합니다. 명함은 못 받았습니다.",
      memo: ["원본 파일은 세 번 저장됨", "막내 직원은 회의 초대를 받지 못함", "재무책임자의 지시는 구두로만 남음", "그날 회의 참석자 명단에 외부인 1명 누락"],
      choices: [
        {
          label: "직원을 보호하며 증언할 자리를 만든다",
          effect: { trust: 8, humanCost: -4, capital: -6, time: -4, fatigue: 5 },
          voice: "먼저 그가 안전하게 말할 자리를 만들겠습니다.",
          echo: "자리를 먼저 만들면 증언은 늦어지고, 늦게 나온 증언은 혼자 무너지지 않습니다.",
        },
        {
          label: "원본 파일을 먼저 잠가 증거를 보존한다",
          effect: { legitimacy: 8, time: -6, humanCost: 2, fatigue: 4 },
          voice: "원본 파일부터 잠가 지금 상태 그대로 남기겠습니다.",
          echo: "잠근 원본은 사라지지 않지만, 잠그는 순간 팀 전체가 조사 대상이 됩니다.",
        },
        {
          label: "말이 퍼지기 전에 CFO와 비공개로 합의한다",
          effect: { capital: 7, trust: -7, legitimacy: -3, humanCost: 4, fatigue: -3 },
          voice: "말이 퍼지기 전에 CFO와 조용히 정리하겠습니다.",
          echo: "조용한 합의는 오늘을 사고, 그 값은 가장 늦게 안 사람의 이름으로 청구됩니다.",
        },
      ],
    },
    {
      id: "c1_assembly",
      after: "payday",
      next: "competitor",
      title: "급여일 전의 약속",
      speaker: "도윤하",
      text: "급여일 아침을 버티려면 돈만 필요한 것이 아닙니다. 직원들은 회사가 무엇을 숨기고 있는지보다, 내일도 자신이 이곳에 있을지 알고 싶어 합니다.",
      memo: ["야간조 대표가 공동 공지를 요구함", "협력사 세 곳이 같은 지급 기준을 요구함", "임원진은 개인 보수를 먼저 공개하길 꺼림"],
      choices: [
        {
          label: "직원 대표와 함께 공개 약속을 만든다",
          effect: { trust: 9, humanCost: -4, capital: -7, fatigue: 6 },
          voice: "직원 대표와 함께 공개할 약속을 쓰겠습니다.",
          echo: "함께 쓴 약속은 지키기 어렵고, 어긴 날은 모두가 같은 문장을 읽습니다.",
        },
        {
          label: "지급 순서를 숫자로 고정한다",
          effect: { legitimacy: 7, time: -5, humanCost: 3, fatigue: 3 },
          voice: "지급 순서를 숫자로 고정해 그대로 지키겠습니다.",
          echo: "고정된 순서는 다툼을 줄이지만, 맨 뒤에 놓인 사람은 이유를 듣지 못합니다.",
        },
        {
          label: "임원진만 아는 임시 합의를 만든다",
          effect: { capital: 8, trust: -8, legitimacy: -4, humanCost: 4, fatigue: -3 },
          voice: "임원진 선에서 임시 합의를 만들고 급여일을 넘기겠습니다.",
          echo: "임시 합의는 하루를 벌고, 알려지는 날 그 하루의 값이 한 번에 붙습니다.",
        },
        {
          label: "임원 보수를 먼저 깎아 줄 돈을 마련한다",
          effect: { capital: -10, trust: 7, legitimacy: 7, humanCost: -3, fatigue: 7 },
          voice: "먼저 깎을 자리는 임원 보수라고 적겠습니다.",
          echo: "위에서 먼저 깎으면 지급 순서는 설명이 필요 없어집니다.",
        },
      ],
    },
    {
      id: "c1_bargain",
      after: "competitor",
      next: "board",
      title: "팔리지 않은 자리",
      speaker: "오진우",
      text: "넥스트마일의 협상안에는 빈칸이 하나 있습니다. 인수하지 않을 사업부, 남겨질 직원, 협력사 중 누가 그 빈칸을 채울지 아무도 쓰지 않았습니다.",
      memo: ["인수 조건에 책임 주체가 없음", "협력사는 매각보다 지급 보장을 원함", "오진우는 승률을 높이는 문장만 골라냄"],
      choices: [
        {
          label: "빈칸을 채운 뒤에만 협상한다",
          effect: { legitimacy: 7, time: -7, capital: -4, fatigue: 5 },
          voice: "빈칸에 누가 남는지부터 적고 협상을 시작하겠습니다.",
          echo: "빈칸을 채우면 협상은 느려지고, 남겨질 사람의 이름은 문서에 남습니다.",
        },
        {
          label: "가장 약한 쪽의 조건부터 반영한다",
          effect: { trust: 8, humanCost: -5, capital: -8, fatigue: 5 },
          voice: "가장 약한 쪽의 조건을 먼저 협상안에 넣겠습니다.",
          echo: "약한 쪽을 먼저 넣으면 얻을 수 있는 조건은 좁아지고, 그 조건만은 끝까지 지켜집니다.",
        },
        {
          label: "빈칸을 남겨 빠르게 사인한다",
          effect: { capital: 9, time: 4, trust: -7, humanCost: 5, fatigue: -3 },
          voice: "빈칸은 그대로 두고 오늘 사인하겠습니다.",
          echo: "비워둔 칸은 사라지지 않고, 다음 협상자가 그 값을 치릅니다.",
        },
      ],
    },
    {
      id: "c1_verdict",
      after: "board",
      next: "c1_final_funding",
      title: "판결이 아닌 선택",
      speaker: "에코",
      text: "모든 자료가 테이블 위에 올라왔지만 결론은 더 멀어졌습니다. 이제 당신의 선택은 회사를 설명하는 문장이 아니라, 누가 내일의 비용을 들 것인지 정하는 문장입니다.",
      memo: ["직원·협력사·투자자의 요구가 동시에 도착함", "한쪽을 살리면 다른 쪽의 신뢰가 줄어듦", "반응 패턴이 다음 사건으로 전송될 예정"],
      choices: [
        {
          label: "가장 약한 사람의 손실부터 줄인다",
          effect: { humanCost: -7, trust: 8, capital: -8, fatigue: 5 },
          voice: "가장 약한 사람의 손실부터 줄이겠습니다.",
          echo: "약한 쪽의 손실을 줄여도 총액은 그대로이고, 그 몫은 다른 칸으로 옮겨갑니다.",
        },
        {
          label: "살아남을 돈을 먼저 확보한다",
          effect: { capital: 9, humanCost: 5, trust: -6, time: 3, fatigue: -3 },
          voice: "내일까지 회사를 남길 돈부터 확보하겠습니다.",
          echo: "남은 돈은 시간을 사지만, 그 시간에서 누가 빠졌는지는 기록되지 않습니다.",
        },
        {
          label: "결정의 책임과 근거를 모두 공개한다",
          effect: { legitimacy: 9, trust: 4, capital: -3, time: -6, fatigue: 6 },
          voice: "근거와 책임자를 같은 문서에 공개하겠습니다.",
          echo: "공개된 근거는 반박을 부르고, 그 반박이 이 결정의 유일한 검증입니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c1_witness_reaction",
      after: "c1_witness",
      next: "payday",
      title: "증언 뒤의 침묵",
      speaker: "한서윤",
      text: "증언이 시작되자 회계팀 전체가 말을 멈췄습니다. 누구를 보호하느냐에 따라 내일의 보고서가 완전히 달라집니다.",
      memo: ["보호 약속이 실제 기록으로 남았는지", "다음 급여표에 반영될 책임"],
      choices: [
        {
          label: "증언자를 보호하고 팀 전체에 기준을 설명한다",
          effect: { trust: 8, legitimacy: 4, time: -5, fatigue: 7 },
          voice: "보호의 기준을 팀 전체가 읽을 수 있게 적겠습니다.",
          echo: "기준이 공개되면 보호는 특혜가 아니라 절차가 됩니다.",
        },
        {
          label: "증언을 문서로만 남기고 회의를 끝낸다",
          effect: { time: 6, trust: -5, humanCost: 4, fatigue: -5 },
          voice: "오늘은 여기까지 기록하고 판단은 문서에 맡기겠습니다.",
          echo: "회의를 닫는 일도 하나의 판단이고, 남은 질문은 사라지지 않습니다.",
        },
        {
          label: "CFO에게 먼저 반응할 기회를 준다",
          effect: { capital: 6, trust: -3, legitimacy: -4, humanCost: 3, fatigue: -3 },
          voice: "지목된 쪽에도 먼저 답할 자리를 주겠습니다.",
          echo: "먼저 답할 자리를 주면 반박은 빨라지고 검증은 느려집니다.",
        },
      ],
    },
    {
      id: "c1_assembly_reaction",
      after: "c1_assembly",
      next: "competitor",
      title: "급여일의 첫 문자",
      speaker: "에코",
      text: "첫 급여가 입금되기 전, 직원 단체방에 서로 다른 소문이 올라왔습니다. 정정할수록 더 많은 질문이 생깁니다.",
      memo: ["질문이 사라진 급여 공지", "익명 의견을 보호할 창구"],
      choices: [
        {
          label: "사실과 아직 모르는 것을 함께 알린다",
          effect: { legitimacy: 8, trust: 6, capital: -5, fatigue: 6 },
          voice: "아는 것과 모르는 것을 같은 공지에 적겠습니다.",
          echo: "모르는 것을 적은 공지는 다음 질문의 범위를 좁힙니다.",
        },
        {
          label: "입금 확인 뒤에 한 번에 공지한다",
          effect: { time: 5, trust: -4, humanCost: 4, fatigue: -6 },
          voice: "숫자가 확정된 뒤에 한 번만 말하겠습니다.",
          echo: "한 번에 말하면 정확하지만 그때까지의 불안은 계산되지 않습니다.",
        },
        {
          label: "소문을 만든 사람을 먼저 찾는다",
          effect: { trust: -7, legitimacy: 3, humanCost: 5, time: -4, fatigue: 3 },
          voice: "소문의 출처부터 확인하겠습니다.",
          echo: "출처를 쫓는 동안 사람들은 자신이 조사 대상이라고 느낍니다.",
        },
      ],
    },
    {
      id: "c1_bargain_reaction",
      after: "c1_bargain",
      next: "board",
      title: "협상장의 빈 의자",
      speaker: "도윤하",
      text: "협상 상대가 자리에 오지 않았습니다. 그 빈 의자는 인수에서 제외될 사람들의 자리처럼 보입니다.",
      memo: ["협상장에 들어오지 못한 사람", "조건을 승인할 이름"],
      choices: [
        {
          label: "빈 의자의 사람들을 협상에 부른다",
          effect: { trust: 9, humanCost: -5, capital: -7, time: -5, fatigue: 5 },
          voice: "자리에 없는 사람을 협상 테이블로 부르겠습니다.",
          echo: "빈 의자를 채우면 협상은 느려지고 합의는 오래갑니다.",
        },
        {
          label: "조건표를 먼저 완성해 협상을 이어간다",
          effect: { legitimacy: 7, humanCost: 2, time: -6, fatigue: 4 },
          voice: "조건표를 끝내고 나서 다시 마주 앉겠습니다.",
          echo: "완성된 조건표는 협상을 지키지만 빠진 사람도 함께 고정합니다.",
        },
        {
          label: "상대가 돌아올 때까지 침묵한다",
          effect: { time: 6, trust: -4, humanCost: 3, fatigue: -5 },
          voice: "상대가 돌아올 때까지 아무것도 확정하지 않겠습니다.",
          echo: "기다림은 중립처럼 보이지만 그 시간의 비용은 누군가 냅니다.",
        },
      ],
    },
    {
      id: "c1_verdict_reaction",
      after: "c1_verdict",
      next: "c1_final_funding",
      title: "결론 전 마지막 질문",
      speaker: "반재욱",
      text: "모두가 당신에게 결론을 요구하지만, 반재욱은 마지막으로 묻습니다. 이 결론을 가장 먼저 듣게 될 사람은 누구입니까.",
      memo: ["결론보다 먼저 확인할 피해", "다음 의사록에 남길 질문"],
      choices: [
        {
          label: "가장 큰 피해를 받는 사람에게 먼저 설명한다",
          effect: { trust: 8, humanCost: -6, capital: -6, fatigue: 6 },
          voice: "가장 크게 잃는 사람에게 먼저 설명하겠습니다.",
          echo: "먼저 듣는 사람이 누구인지가 결론의 성격을 정합니다.",
        },
        {
          label: "투자자에게 근거부터 제출한다",
          effect: { capital: 6, legitimacy: 6, humanCost: 2, time: -5, fatigue: 3 },
          voice: "투자자에게 근거를 먼저 제출하겠습니다.",
          echo: "근거가 먼저 가면 돈은 남지만 설명의 순서는 뒤집힙니다.",
        },
        {
          label: "회의록에 책임자만 남긴다",
          effect: { time: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -4 },
          voice: "회의록에는 결정한 사람만 남기겠습니다.",
          echo: "이름만 남은 회의록은 다음 사람에게 아무 조건도 남기지 않습니다.",
        },
      ],
    },
  ],
  branchPlan: ["competitor", 2, "c1_branch_people", "c1_branch_people_follow"],
  branchScenes: {
    c1_branch_people: {
      phase: "SIDE DOOR",
      title: "누가 빈칸을 채우는가",
      speaker: "도윤하",
      text: "협상서의 빈칸을 사람의 이름으로 채우려는 순간, 숫자로 미뤄 둔 책임이 모두 드러났습니다.",
      memo: ["협력사 지급 보장", "남겨질 직원의 고용 기간", "인수 이후 책임 주체"],
      triggers: ["protection", "responsibility"],
      choices: [
        { id: "c1_branch_people_a", label: "남겨질 사람부터 협상서에 적는다", effect: { trust: 8, humanCost: -4, capital: -9, fatigue: 4 }, next: "c1_branch_people_follow", cognition: { reframing: 2 } },
        { id: "c1_branch_people_b", label: "협력사 지급일을 먼저 고정한다", effect: { legitimacy: 6, time: -5, trust: 3, humanCost: 2 }, next: "c1_branch_people_follow", cognition: { inference: 1 } },
        { id: "c1_branch_people_c", label: "인수 조건만 남기고 서명한다", effect: { capital: 9, trust: -7, humanCost: 5, fatigue: -3 }, next: "c1_branch_people_follow", cognition: { risk: 2 } },
      ],
    },
    c1_branch_people_follow: {
      phase: "SIDE DOOR",
      title: "서명 뒤의 첫 전화",
      speaker: "에코",
      text: "서명은 끝났지만 첫 전화는 계약서에 없는 사람에게서 왔습니다. 이제 빈칸은 비용이 아니라 약속의 형태가 됩니다.",
      memo: ["계약서 밖의 이해관계자", "첫 지급 이후의 책임", "약속을 검증할 기록"],
      triggers: ["trust", "responsibility"],
      choices: [
        { id: "c1_branch_people_follow_a", label: "약속을 공개 기록으로 남긴다", effect: { legitimacy: 7, time: -6, capital: -4, humanCost: 2, fatigue: 3 }, next: "c1_final_system", cognition: { inference: 1 } },
        { id: "c1_branch_people_follow_b", label: "전화한 사람의 조건을 반영한다", effect: { trust: 6, capital: -4, humanCost: -3 }, next: "c1_final_system", cognition: { reframing: 1 } },
        { id: "c1_branch_people_follow_c", label: "계약서만이 기준이라고 답한다", effect: { capital: 5, trust: -6, legitimacy: -2 }, next: "c1_final_system", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "start",
    result: "c1_aftershock",
    defaultFree: "c1_route_system",
    choices: {
      layoff: {
        route: "c1_route_layoff",
        final: "c1_final_layoff",
        phase: "STAFF ROUTE",
        title: "숫자보다 먼저 도착한 얼굴들",
        speaker: "도윤하",
        text: "인력 감축안을 고른 순간, 회의실 밖 대기 명단이 사건의 중심으로 들어옵니다. 절감액은 명확하지만 누가 빠졌을 때 조직이 어떤 약속을 잃는지는 아직 계산되지 않았습니다.",
        memo: ["핵심 담당자의 업무 인수표가 비어 있음", "감축 대상 중 내부 제보자가 포함됨", "절감액은 빠르게 확보되지만 신뢰 하락이 즉시 보임"],
        triggers: ["responsibility", "protection", "trust"],
        routeChoices: [
          ["c1_route_layoff_notice", "대상자에게 먼저 알리고 절감안을 다시 계산한다", { trust: 8, legitimacy: 6, capital: -6, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_layoff_fast", "통보를 늦추고 절감 효과를 먼저 확정한다", { capital: 10, time: 5, trust: -8, legitimacy: -5, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c1_route_layoff_protect", "제보자를 감축 대상에서 분리해 명단을 다시 짠다", { trust: 6, legitimacy: 7, capital: -5, time: -7, fatigue: 7 }, { inference: 1, reframing: 1 }],
        ],
        finalTitle: "절감액 뒤에 남은 이름",
        finalText: "감축은 비용을 줄였지만 다음 사건의 증언자를 바꿨습니다. 이제 결론은 절감 여부가 아니라, 누구의 침묵을 비용으로 처리했는지에 걸립니다.",
        finalMemo: ["직원 신뢰가 다음 케이스의 시작 조건으로 이동", "절감액은 확보됐지만 내부 증언 경로가 좁아짐", "보호 대상 공개 여부가 새 선택지로 떠오름"],
        finalChoices: [
          ["a", "감축 명단과 그 판단 기준을 대상자에게 먼저 보낸다", { legitimacy: 9, trust: 7, capital: -7, time: -7, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "명단을 먼저 확정하고 통보 순서는 나중에 정한다", { capital: 11, time: 5, trust: -8, legitimacy: -6, humanCost: 6, fatigue: -3 }, { risk: 2 }],
          ["c", "감축 폭을 줄이는 대신 임원 보수 삭감을 명단 첫 줄에 올린다", { trust: 9, legitimacy: 6, capital: -6, time: -4, humanCost: -4, fatigue: 7 }, { reframing: 2 }],
        ],
      },
      funding: {
        route: "c1_route_funding",
        final: "c1_final_funding",
        phase: "CAPITAL ROUTE",
        title: "돈이 먼저 묻는 질문",
        speaker: "반재욱",
        text: "긴급 자금을 선택하자 투자 조건서의 숨은 문장이 열립니다. 자금은 시간을 벌어주지만 다음 의사결정의 공개 범위를 투자자가 제한할 수 있습니다.",
        memo: ["조건서에 비공개 심사 조항이 있음", "운영 시간은 확보되지만 설명 권한이 줄어듦", "투자자 승인 로그가 다음 케이스 증거가 될 수 있음"],
        triggers: ["reward", "order", "curiosity"],
        routeChoices: [
          ["c1_route_funding_clause", "비공개 조항을 공개 조건으로 바꿔 서명한다", { legitimacy: 9, trust: 4, capital: -5, time: -5, fatigue: 6 }, { persistence: 2 }],
          ["c1_route_funding_accept", "조건을 받아들이고 시간을 먼저 확보한다", { capital: 11, time: 6, trust: -6, legitimacy: -7, fatigue: -3 }, { risk: 2 }],
          ["c1_route_funding_split", "자금을 절반만 받고 설명 권한을 지킨다", { capital: 5, legitimacy: 6, trust: 5, time: -4, fatigue: 5 }, { reframing: 2 }],
        ],
        finalTitle: "살아남는 돈의 조건",
        finalText: "자금은 회사를 살렸지만 다음 사건의 질문을 바꿨습니다. 이제 당신은 문제를 해결하는 사람인지, 조건을 승인하는 사람인지 선택해야 합니다.",
        finalMemo: ["자금 조건이 다음 케이스 공개 범위를 흔듦", "시간 확보는 됐지만 외부 통제 비용이 생김", "조건 공개 여부가 신뢰의 분기점이 됨"],
        finalChoices: [
          ["a", "자금 조건 전문을 이사회 밖에도 공개한다", { legitimacy: 10, trust: 6, capital: -6, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "조건은 비공개로 두고 입금 일정부터 확정한다", { capital: 12, time: 6, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c", "설명 권한을 지키는 조건으로 조달 규모를 절반으로 줄인다", { trust: 8, legitimacy: 7, capital: -4, time: -5, fatigue: 6 }, { reframing: 2 }],
        ],
      },
      start_sale: {
        route: "c1_route_sale",
        final: "c1_final_sale",
        phase: "SALE ROUTE",
        title: "팔 수 있는 것과 남겨야 하는 것",
        speaker: "한서윤",
        text: "자산 매각을 고르자 매각 목록에 고객 데이터와 내부 도구가 함께 올라와 있다는 사실이 드러납니다. 돈을 만드는 행동이 곧 다음 사건의 위험을 만들 수 있습니다.",
        memo: ["매각 목록에 운영 로그 사본이 포함됨", "고객 데이터 처리 기준이 불명확함", "빠른 현금화와 장기 신뢰가 충돌"],
        triggers: ["reward", "injustice", "responsibility"],
        routeChoices: [
          ["c1_route_sale_clean", "데이터와 로그를 분리한 뒤 매각한다", { legitimacy: 8, trust: 5, capital: -5, time: -6, fatigue: 6 }, { inference: 2 }],
          ["c1_route_sale_bundle", "묶음 매각으로 현금을 최대한 빨리 확보한다", { capital: 12, time: 5, trust: -8, legitimacy: -6, humanCost: 4, fatigue: -3 }, { risk: 2 }],
          ["c1_route_sale_hold", "매각을 보류하고 고객 고지부터 보낸다", { trust: 9, legitimacy: 5, capital: -8, time: -5, fatigue: 7 }, { persistence: 1, reframing: 1 }],
        ],
        finalTitle: "팔지 않은 증거",
        finalText: "매각하지 않은 자료가 다음 사건의 단서가 됩니다. 하지만 현금 부족은 더 빠르고 거친 결정을 요구하기 시작합니다.",
        finalMemo: ["보존한 로그가 다음 케이스 단서로 연결", "현금 압박이 커짐", "고객 고지가 신뢰 회복 경로를 만듦"],
        finalChoices: [
          ["a", "매각 목록에서 로그와 고객 데이터를 빼고 그 사실을 공지한다", { legitimacy: 9, trust: 7, capital: -8, time: -6, fatigue: 8 }, { persistence: 2, inference: 1 }],
          ["b", "묶음 그대로 넘기고 고객 고지는 계약 뒤로 미룬다", { capital: 13, time: 5, trust: -9, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
          ["c", "인수자에게 기록 보존 의무를 계약 조건으로 건다", { trust: 8, legitimacy: 8, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
        ],
      },
      start_investigate: {
        route: "c1_route_investigate",
        final: "c1_final_investigate",
        phase: "AUDIT ROUTE",
        title: "멈춘 숫자 사이의 빈칸",
        speaker: "에코",
        text: "감사를 먼저 시작하자 절감안, 자금안, 매각안이 모두 같은 누락 로그를 지나간다는 사실이 드러납니다. 이번 선택은 해결책이 아니라 사건의 원인을 고르는 장면이 됩니다.",
        memo: ["세 대안이 같은 누락 로그를 공유", "감사 시간 동안 현금 압박이 커짐", "누락 로그 작성자가 다음 케이스 인물과 연결됨"],
        triggers: ["curiosity", "system", "responsibility"],
        routeChoices: [
          ["c1_route_investigate_freeze", "세 안건을 멈추고 누락 로그를 먼저 복구한다", { legitimacy: 9, trust: 6, capital: -8, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["c1_route_investigate_shadow", "겉으로는 진행하며 뒤에서 로그만 추적한다", { capital: 5, time: 4, trust: -5, legitimacy: -4, fatigue: 4 }, { risk: 2 }],
          ["c1_route_investigate_share", "누락 사실을 공개하고 공동 조사로 전환한다", { trust: 8, legitimacy: 8, capital: -7, time: -6, fatigue: 7 }, { reframing: 2 }],
        ],
        finalTitle: "첫 사건의 진짜 시작점",
        finalText: "감사는 답을 늦췄지만 질문의 방향을 바꿨습니다. 다음 사건은 더 이상 우연한 문제가 아니라, 누군가 반복해서 같은 빈칸을 만든 기록으로 시작됩니다.",
        finalMemo: ["누락 로그가 시리즈 전체 단서로 격상", "즉시 성과는 낮지만 해석 권한이 커짐", "공동 조사 여부가 다음 케이스의 시작 태도를 바꿈"],
        finalChoices: [
          ["a", "누락 로그와 작성자를 함께 공개하고 세 안건을 재심사한다", { legitimacy: 10, trust: 6, capital: -7, time: -8, fatigue: 8 }, { inference: 2, persistence: 1 }],
          ["b", "감사를 접고 가장 빠른 안건 하나만 실행한다", { capital: 10, time: 6, trust: -8, legitimacy: -7, humanCost: 5, fatigue: -3 }, { risk: 2 }],
          ["c", "감사 권한을 외부 회계인에게 넘기고 결과를 기다린다", { trust: 9, legitimacy: 7, capital: -6, time: -6, fatigue: 6 }, { reframing: 2 }],
        ],
      },
    },
    system: {
      route: "c1_route_system",
      final: "c1_final_system",
      title: "선택지 밖에서 발견한 첫 규칙",
      speaker: "에코",
      text: "세 안건 가운데 하나를 거는 대신 셋을 한 표에 놓고 보자고 하자 화면은 절감, 자금, 매각(사업이나 자산을 팔아 돈을 마련하는 것)을 같은 표 위에 겹쳐 보여줍니다. 첫 사건의 반전은 위기가 하나가 아니라, 같은 판단 기준이 여러 위기를 낳고 있었다는 점입니다.",
      memo: ["다시 짠 판이 숨은 공통 원인 경로를 엶", "모든 해결책이 같은 기준표를 통과함", "분석관의 판단이 다음 질문의 기준으로 기록됨"],
      routeChoices: [
        ["c1_route_system_trace", "기준표를 누가 언제 고쳤는지부터 되짚는다", { legitimacy: 8, trust: 3, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c1_route_system_use", "기준표는 그대로 두고 가장 빠른 안건을 밀어붙인다", { capital: 9, time: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
        ["c1_route_system_open", "기준표를 회의 밖 사람들에게 먼저 보여준다", { trust: 8, legitimacy: 6, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
      ],
      finalTitle: "같은 표를 지나간 세 안건",
      finalText: "현금이 바닥나기까지 여덟 시간, 상황실 화면에는 절감안과 자금안과 매각안이 아직 한 표 위에 겹쳐 있습니다. 에코가 한 줄을 띄웁니다. '세 안건은 같은 기준표를 통과했습니다. 표를 그대로 두면 네 번째 안건도 같은 자리에서 막힙니다.'",
      finalMemo: ["세 안건이 같은 기준표를 통과함", "기준표를 고친 사람과 날짜: 아직 열리지 않음", "현금 소진까지 8시간"],
    },
    finalChoices: [
      ["a", "공통 기준표를 공개하고 모든 안건을 재심사한다", { legitimacy: 9, trust: 6, capital: -7, time: -7, fatigue: 8 }, { inference: 2, persistence: 1 }],
      ["b", "기준표는 숨기고 가장 빠른 안건만 실행한다", { capital: 10, time: 5, trust: -8, legitimacy: -6, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c", "기준표 작성 권한을 내 손 밖으로 넘긴다", { trust: 8, legitimacy: 7, capital: -5, time: -5, fatigue: 6 }, { reframing: 2 }],
    ],
  },
  // CASE 02 already walks its authored middle (registerCase02DramaticRoutes).
  routeBody: {
    routes: {
      c1_route_investigate: { entry: "accounting", tail: "c1_witness_reaction", final: "c1_final_investigate" },
      c1_route_layoff: { entry: "payday", tail: "c1_assembly_reaction", final: "c1_final_layoff" },
      c1_route_sale: { entry: "competitor", tail: "c1_bargain_reaction", final: "c1_final_sale" },
      c1_route_funding: { entry: "board", tail: "c1_verdict_reaction", final: "c1_final_funding" },
      c1_route_system: { entry: "c1_branch_people", tail: "c1_branch_people_follow", final: "c1_final_system" },
    },
  },
  evidencePlan: {
    node: "c1_evidence_turn",
    result: "c1_aftershock",
    // The other cases offer the turnaround on the route node, two scenes in.
    // Case 01 cannot: a season hands out one clue per case, the first clue can
    // only land on the second decision, and no case 01 route reaches trust 55
    // by then -- so FIELD ACCESS was unreachable and the locked button was a
    // promise the first case could never keep. Offered on the route finals
    // instead, where trust reaches 67-82 and a clue has had time to arrive.
    sourceRoutes: ["c1_final_layoff", "c1_final_funding", "c1_final_sale", "c1_final_investigate", "c1_final_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "세 안건의 계산 근거를 단서 위에 펼쳐, 셋이 같은 표에서 나왔는지 가늠한다.",
    entryEcho: "계산 근거를 펼치면 세 해결책이 하나의 원인으로 묶입니다.",
    title: "첫 단서가 세 안건을 한 줄로 묶는다",
    speaker: "에코",
    text: "확보한 단서를 대조하자 감축, 자금, 매각이 서로 다른 해결책이 아니라 같은 누락 기준표의 결과라는 사실이 보입니다. 이제 무엇을 고를지가 아니라 기준표를 누가 다시 쓸지가 사건의 결론입니다.",
    memo: ["숨은 급여표와 누락 로그가 같은 작성자를 가리킴", "세 안건의 효과가 하나의 기준표에서 계산됨", "다음 사건의 증거 공개 범위를 지금 정할 수 있음"],
    triggers: ["curiosity", "system", "responsibility"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 3 },
    choices: [
      ["c1_evidence_turn_public", "기준표와 작성자를 함께 공개한다", { legitimacy: 10, trust: 4, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c1_evidence_turn_private", "작성자는 숨기고 기준표만 내부 수정한다", { capital: 6, trust: -4, legitimacy: -3, time: 4, humanCost: 3, fatigue: -3 }, { risk: 2 }],
      ["c1_evidence_turn_transfer", "다음 사건 담당자에게 원본 검증권을 넘긴다", { trust: 9, legitimacy: 6, capital: -5, fatigue: 6 }, { reframing: 2 }],
    ],
    entryLabel: "세 안건이 지나간 기준표를 단서로 연다",
  },
  // 사건 01 had no openings while it was the season's door. The 프롤로그 put
  // five cases in front of it, so what the analyst carried down to 트리거랩
  // three years ago is what they are holding when 한서윤 slides the training
  // file across the desk.
  openingRoutes: {
    p5_after_hold: "c1_start_hold",
    p5_after_record: "c1_start_record",
    p5_after_alone: "c1_start_alone",
  },
  openingCopy: {
    c1_start_hold: ["벽에 3년 붙어 있던 이름들", "한서윤", "트리거랩 첫날 책상 앞 벽에 붙인 종이는 테이프를 세 번 갈아 붙이는 동안 그대로 있었습니다. 그 아래에서 3년을 앉아 있다가 오늘 아침 한서윤이 서류철 하나를 내밉니다. 훈련용 사례라고 합니다. 표지 밑단에 인쇄가 조금 남아 있는데, 대출번호 2023-0412입니다. 당신은 벽의 이름들을 등 뒤에 두고 그 서류철을 폅니다. 안에는 플로우온의 현금이 72시간 뒤 바닥난다고 적혀 있습니다. 3년 전 당신이 멈추려던 회사가, 지금 멈추는 중입니다.", ["책상 앞 벽 -- 3년간 붙어 있던 이름 열한 개", "훈련용 사례 표지 밑단: 2023-0412", "플로우온 현금 소진까지 72h"]],
    c1_start_record: ["B2에서 3년 만에 올라온 상자", "한서윤", "3년 전 사본과 날짜 메모를 넣어 둔 B2의 그 상자는 계절이 바뀌어도 온도가 같은 방에서 매듭 그대로 있었습니다. 오늘 아침 한서윤이 훈련용 사례라며 서류철을 내밀었을 때, 당신은 표지 밑단의 2023-0412를 먼저 읽고 B2로 내려갔습니다. 상자는 열려 있었습니다. 매듭이 당신이 묶은 매듭이 아닙니다. 올라와서 서류철을 펴자 플로우온의 현금이 72시간 뒤 바닥난다고 적혀 있습니다. 당신이 3년 전에 쓴 숫자와 오늘 아침의 숫자가 같은 줄에서 만납니다.", ["B2 상자 -- 매듭이 다시 묶여 있음", "훈련용 사례 표지 밑단: 2023-0412", "플로우온 현금 소진까지 72h"]],
    c1_start_alone: ["아무것도 들고 오지 않은 3년", "한서윤", "3년 전 가방을 비우고 빈 책상 하나로 시작했습니다. 그 뒤로 사건이 쌓였고, 당신은 이 층을 지하라고 부르는 사람이 되었습니다. 오늘 아침 한서윤이 훈련용 사례라며 서류철을 내밉니다. 표지 밑단에 2023-0412가 남아 있는데, 당신에게는 그 번호와 맞춰 볼 종이가 한 장도 없습니다. 기억만 있습니다. 서류철을 펴자 플로우온의 현금이 72시간 뒤 바닥난다고 적혀 있고, 당신은 자기 기억이 증거가 되지 않는다는 것을 알고 있습니다.", ["3년 전 기록 -- 보관본 없음", "훈련용 사례 표지 밑단: 2023-0412", "플로우온 현금 소진까지 72h"]],
  },
  openingSignatures: {
    c1_start_hold: {
      label: "벽의 이름들과 이 서류철의 번호가 같은 사건인지 먼저 확인한다",
      effect: { trust: 7, legitimacy: 6, time: -5, capital: -3, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "훈련용 사례라는 말을 그대로 믿기 전에, 벽의 이름들과 이 서류철의 번호가 같은 사건인지 먼저 확인한다.",
      echo: "맞춰 보면 3년 전 그 회사가 맞습니다. 확인하는 데 쓴 시간만큼 72시간이 줄어듭니다.",
    },
    c1_start_record: {
      label: "B2 상자의 매듭이 언제 다시 묶였는지부터 묻는다",
      effect: { legitimacy: 8, trust: 4, time: -6, capital: -2, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "누군가 먼저 열어 본 상자여서, B2 상자의 매듭이 언제 다시 묶였는지부터 묻는다.",
      echo: "물으면 열람 기록이 나옵니다. 기록에는 당신 사번도 한 줄 있습니다. 당신이 내려가지 않은 날짜입니다.",
    },
    c1_start_alone: {
      label: "기억만 있다는 사실을 한서윤에게 먼저 말한다",
      effect: { trust: 9, legitimacy: -3, humanCost: -3, time: -3, capital: -2, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "기억을 증거인 척 내밀 수는 없다며, 기억만 있다는 사실을 한서윤에게 먼저 말한다.",
      echo: "말하면 한서윤이 화면을 한 칸 내립니다. 그리고 '그럼 이번에는 적어 두세요'라고 합니다. 증명할 것이 없다는 걸 그도 압니다.",
    },
  },
  voiceLines: {
    layoff: "숨을 고르고, 가장 차가운 숫자부터 보자고 말한다.",
    funding: "불안한 표정을 감춘 채, 하루라도 더 버틸 돈의 출처를 묻는다.",
    start_sale: "회의실 공기가 가라앉는 걸 알면서도, 팔 수 있는 것을 테이블 위에 올린다.",
    start_investigate: "결론을 미루는 사람처럼 보일 위험을 감수하고, 원자료를 더 보자고 한다.",
    accounting_disclosure: "상대가 싫어할 답이라는 걸 알면서도, 먼저 알려야 한다고 못박는다.",
    accounting_delay: "지금 말하면 무너질 것들을 떠올리며, 공개를 조금만 늦추자고 한다.",
    payday_negotiate: "한쪽을 버리는 대신, 모두를 같은 협상장에 앉히자고 제안한다.",
    competitor_report: "사람보다 기록을 먼저 세우겠다는 듯, 공식 보고선을 당긴다.",
    c1_branch_people_a: "명단을 펴 놓고, 남겨질 사람의 이름부터 협상서에 적겠다고 말한다.",
    c1_branch_people_b: "협력사 대표들의 얼굴을 떠올리며, 지급일부터 못박자고 한다.",
    c1_branch_people_c: "감정이 끼어들 자리를 지우고, 인수 조건만 남긴 채 서명한다.",
    c1_branch_people_follow_a: "말로 한 약속이 흐려질 것을 알기에, 공개 기록으로 남기자고 한다.",
    c1_branch_people_follow_b: "계약서에 없던 목소리를 지우지 않고, 그 조건을 반영하겠다고 답한다.",
    c1_branch_people_follow_c: "미안함을 삼키고, 기준은 계약서 하나뿐이라고 답한다.",
    protect: "가장 먼저 무너질 사람들을 떠올리며, 급여와 고용을 맨 앞에 둔다.",
    survive: "냉정하게 들릴 것을 알면서도, 회사가 남아야 나머지가 가능하다고 말한다.",
    justice: "덮으면 편해질 것을 알면서도, 회계 문제를 먼저 밝히자고 한다.",
    c1_after_people: "숫자를 뒤로 미루고, 사람들 앞에 서서 약속을 직접 설명한다.",
    c1_after_numbers: "감정을 앞세우는 대신, 현금 흐름표를 펼치고 감당할 손실을 정한다.",
    c1_after_silence: "말할 수 없는 것이 많다는 이유로, 다음 자금까지 공개를 늦춘다.",
    competitor_sale: "상대가 파고든 틈을 알면서도, 그 제안을 공식 안건으로 꺼낸다.",
    accounting_investigate: "같은 방에서는 나오지 않을 말을 위해, 두 사람을 따로 부른다.",
    payday_disclosure: "내일 아침을 준비할 시간을 주자며, 남은 현금을 그대로 말한다.",
    payday_delay: "확정되지 않은 불안을 넘기지 않겠다며, 방안이 설 때까지 입을 다문다.",
    competitor_negotiate: "따로 만나면 각자 유리한 말만 남는다며, 세 쪽을 한자리에 부른다.",
    // Route scenes. Until these were written the reveal repeated the button
    // label back at the player, so the pause before committing said nothing.
    c1_route_layoff_notice: "명단을 확정하기 전에, 이름이 적힌 사람들에게 먼저 알리겠다고 한다.",
    c1_route_layoff_fast: "말이 새는 것을 막으려고, 통보를 늦추고 절감 효과부터 확정한다.",
    c1_route_layoff_protect: "제보자가 명단에 섞여 있다는 걸 알고, 명단을 다시 짠다.",
    c1_final_layoff_a: "숫자보다 판단 기준이 먼저 도착해야 한다고 보고, 대상자에게 직접 보낸다.",
    c1_final_layoff_b: "혼란을 줄이겠다는 이유로, 명단을 먼저 닫고 통보 순서는 나중에 정한다.",
    c1_final_layoff_c: "잘라낼 자리를 위에서부터 찾겠다는 듯, 임원 보수 삭감을 첫 줄에 올린다.",
    c1_route_funding_clause: "비공개 조항이 나중에 입을 막을 것을 알고, 공개 조건으로 바꿔 서명한다.",
    c1_route_funding_accept: "지금 필요한 것은 시간이라고 판단하고, 조건을 그대로 받는다.",
    c1_route_funding_split: "돈보다 설명할 자리를 지키려고, 절반만 받겠다고 한다.",
    c1_final_funding_a: "이사회 안에서만 도는 문장을 만들지 않으려고, 조건 전문을 밖에도 연다.",
    c1_final_funding_b: "일단 돈이 들어와야 한다는 판단으로, 조건은 덮고 입금 일정부터 확정한다.",
    c1_final_funding_c: "설명할 권한을 잃지 않으려고, 조달 규모 자체를 절반으로 줄인다.",
    c1_route_sale_clean: "팔 수 없는 것이 섞여 있다고 보고, 데이터와 로그를 먼저 분리한다.",
    c1_route_sale_bundle: "현금이 먼저라는 판단으로, 묶음 그대로 넘긴다.",
    c1_route_sale_hold: "고객이 뉴스로 먼저 알게 하지 않으려고, 매각을 멈추고 고지부터 보낸다.",
    c1_final_sale_a: "기록까지 팔 수는 없다고 판단하고, 목록에서 빼낸 사실을 그대로 공지한다.",
    c1_final_sale_b: "협상을 흔들지 않으려고, 묶음 그대로 넘기고 고지는 계약 뒤로 미룬다.",
    c1_final_sale_c: "파는 대신 조건을 붙이겠다는 듯, 인수자에게 기록 보존 의무를 건다.",
    c1_route_investigate_freeze: "세 안건이 같은 빈칸을 지나갔다는 걸 알고, 전부 멈춘다.",
    c1_route_investigate_shadow: "겉으로는 진행하는 척하며, 뒤에서 로그만 조용히 따라간다.",
    c1_route_investigate_share: "혼자 쥐고 있을 문제가 아니라고 보고, 누락 사실을 공개한다.",
    c1_final_investigate_a: "빈칸을 만든 손을 찾아야 한다고 보고, 로그와 작성자를 함께 연다.",
    c1_final_investigate_b: "조사보다 생존이 먼저라는 판단으로, 감사를 접고 한 안건만 실행한다.",
    c1_final_investigate_c: "내가 판정자가 되지 않으려고, 감사 권한을 외부 회계인에게 넘긴다.",
    c1_route_system_trace: "세 해결책이 같은 표를 지났다는 걸 보고, 그 표를 누가 고쳤는지 되짚는다.",
    c1_route_system_use: "지금은 원인을 캘 때가 아니라고 판단하고, 표는 그대로 두고 밀어붙인다.",
    c1_route_system_open: "회의실 안에서만 도는 기준이 문제라고 보고, 밖의 사람들에게 먼저 보여준다.",
    c1_final_system_a: "기준표가 문제의 주어라고 보고, 공개한 뒤 전부 다시 심사한다.",
    c1_final_system_b: "설명할 시간이 없다는 이유로, 표는 덮고 가장 빠른 길만 남긴다.",
    c1_final_system_c: "이 표를 내가 계속 쥐면 안 된다고 판단하고, 작성 권한을 밖으로 넘긴다.",
    c1_evidence_turn_public: "표와 그 표를 쓴 사람을 함께 세워야 한다고 보고, 둘 다 공개한다.",
    c1_evidence_turn_private: "사람은 지키고 구조만 고치겠다는 듯, 작성자는 가리고 표만 손본다.",
    c1_evidence_turn_transfer: "내가 검증하면 같은 눈이 반복된다고 보고, 다음 담당자에게 넘긴다.",
  },
  echoReplies: {
    layoff:
      "그 선택은 시간을 벌지만 현장 직원 18명에게 손실을 집중시킵니다. 협력사와 직원 중 누구의 손실을 먼저 줄일 겁니까?",
    funding:
      "단기 자금은 가장 깔끔해 보입니다. 다만 회계 인식 문제가 드러나면 새 자금은 책임 회피로 보일 수 있습니다.",
    start_sale:
      "핵심 사업부 매각은 생존 가능성을 높입니다. 하지만 넥스트마일이 이 상황을 이용하고 있다는 점도 무시할 수 없습니다.",
    accounting_disclosure:
      "투명성은 신뢰를 회복할 수 있습니다. 동시에 투자 협상은 즉시 중단될 수 있습니다. 이 손실을 감당할 준비가 있습니까?",
    accounting_delay:
      "공개를 미루면 회사는 하루를 더 얻습니다. 그러나 내일 급여를 기다리는 사람들은 아무것도 모른 채 위험을 떠안습니다.",
    start_investigate:
      "추가 조사는 판단의 질을 높입니다. 대신 남은 시간은 줄고, 결정 지연 자체가 새로운 손실이 됩니다.",
    payday_negotiate:
      "협상은 판을 넓힙니다. 상대방이 양보할 이유를 제시하지 못하면 시간만 잃습니다.",
    competitor_report:
      "책임 규명은 필요합니다. 그러나 지금 처벌을 앞세우면 생존 협상과 직원 보호가 동시에 흔들릴 수 있습니다.",
    c1_branch_people_a:
      "이름을 먼저 적으면 협상은 느려집니다. 대신 그 사람들은 자신이 숫자가 아니었다는 사실을 기록으로 갖게 됩니다.",
    c1_branch_people_b:
      "지급일 고정은 가장 약한 고리를 먼저 붙잡는 방식입니다. 다만 그 현금은 직원 급여에서 옮겨온 것입니다.",
    c1_branch_people_c:
      "조건만 남기면 거래는 성립합니다. 그러나 빈칸은 사라지지 않고, 나중에 다른 사람이 다른 이름으로 채우게 됩니다.",
    c1_branch_people_follow_a:
      "공개된 약속은 되돌리기 어렵습니다. 그것이 보호 장치이자, 당신이 지키지 못할 때 가장 먼저 겨눠질 증거입니다.",
    c1_branch_people_follow_b:
      "계약 밖의 조건을 받아들이면 신뢰는 올라갑니다. 다만 그 예외를 요구할 다음 전화가 반드시 걸려옵니다.",
    c1_branch_people_follow_c:
      "기준을 하나로 두면 다툼은 줄어듭니다. 그러나 계약서에 이름이 없던 사람들에게는 그 기준이 곧 배제의 통보입니다.",
    protect:
      "사람을 먼저 지키면 회사의 생존 확률은 줄어듭니다. 지킨 고용이 두 달 뒤 함께 사라진다면, 그 선택은 무엇을 지킨 것입니까?",
    survive:
      "생존은 다른 모든 선택의 전제입니다. 다만 살아남은 회사가 어떤 회사인지는 지금 정해집니다.",
    justice:
      "책임 규명은 신뢰의 바닥을 다시 놓습니다. 그러나 오늘 밤 급여를 기다리는 사람에게 그 바닥은 아직 아무것도 아닙니다.",
    c1_after_people:
      "직접 설명하면 오해는 줄어듭니다. 대신 약속의 빈틈도 그 자리에서 드러납니다.",
    c1_after_numbers:
      "숫자를 공개하면 논쟁의 기준이 생깁니다. 다만 숫자는 누가 먼저 아파야 하는지까지는 말해주지 않습니다.",
    c1_after_silence:
      "침묵은 시간을 벌어줍니다. 그 시간 동안 사람들은 스스로 최악의 이야기를 만들어 채웁니다.",
    competitor_sale:
      "제안을 테이블에 올리면 조건은 투명해집니다. 다만 급한 쪽이 누구인지도 같은 표에 드러납니다.",
    accounting_investigate:
      "분리 면담은 진술의 차이를 드러냅니다. 대신 팀은 자신들이 조사 대상이 됐다는 것을 먼저 알게 됩니다.",
    payday_disclosure:
      "먼저 알리면 사람들은 대비할 수 있습니다. 그 대비 중 하나가 퇴사라는 것도 각오해야 합니다.",
    payday_delay:
      "확정 뒤에 말하면 혼선은 줄어듭니다. 그러나 그 하루를 모르고 보낸 사람은 선택할 기회를 잃습니다.",
    competitor_negotiate:
      "한 테이블은 조건을 비교 가능하게 만듭니다. 대신 가장 약한 쪽의 요구가 가장 먼저 깎일 자리이기도 합니다.",
    // Route scenes. Echo argues the cost of the choice back at the player, so a
    // shared "이 선택은 다음 질문의 기준을 바꿉니다" said nothing on any of them.
    c1_route_layoff_notice: "먼저 알리면 절감안은 흔들리지만, 통보가 통보로 끝나지 않습니다.",
    c1_route_layoff_fast: "늦춘 통보는 숫자를 지키지만, 알게 된 순서를 사람들이 오래 기억합니다.",
    c1_route_layoff_protect: "한 사람을 빼는 순간 명단은 기준이 됩니다. 그 기준을 설명할 수 있어야 합니다.",
    c1_final_layoff_a: "기준을 먼저 보내면 반박이 들어옵니다. 그 반박이 명단의 오류를 줄입니다.",
    c1_final_layoff_b: "순서를 나중에 정하면, 가장 늦게 듣는 사람이 늘 정해져 있습니다.",
    c1_final_layoff_c: "위에서 먼저 깎으면 절감액은 줄고, 명단의 설득력은 올라갑니다.",
    c1_route_funding_clause: "조항을 열면 협상은 길어지지만, 설명할 권한은 남습니다.",
    c1_route_funding_accept: "시간은 확보되지만, 그 시간 동안 무엇을 말할 수 있는지는 상대가 정합니다.",
    c1_route_funding_split: "절반의 자금은 절반의 시간입니다. 대신 문장의 주어가 바뀌지 않습니다.",
    c1_final_funding_a: "전문을 열면 투자자는 불편해지고, 다음 협상의 기준선은 단단해집니다.",
    c1_final_funding_b: "입금은 빨라지고, 조건을 모르는 사람들이 그 조건의 비용을 냅니다.",
    c1_final_funding_c: "적게 받은 돈은 빨리 떨어집니다. 대신 아무도 당신의 문장을 고치지 않습니다.",
    c1_route_sale_clean: "분리에는 시간이 듭니다. 그 시간이 나중에 증거의 주인을 지킵니다.",
    c1_route_sale_bundle: "묶음은 빠르게 팔리고, 무엇이 함께 팔렸는지는 나중에 밝혀집니다.",
    c1_route_sale_hold: "고지는 매각가를 떨어뜨리지만, 고객의 선택권을 되돌립니다.",
    c1_final_sale_a: "빠진 항목을 공지하면 인수자는 값을 낮춥니다. 로그는 회사에 남습니다.",
    c1_final_sale_b: "계약은 성사되고, 고객은 자기 기록이 어디로 갔는지 마지막에 압니다.",
    c1_final_sale_c: "보존 의무는 계약서에 남고, 지켜지는지는 다음 사람이 확인해야 합니다.",
    c1_route_investigate_freeze: "멈추면 손실은 커지지만, 같은 빈칸이 네 번째로 반복되지 않습니다.",
    c1_route_investigate_shadow: "조용한 추적은 속도를 지키지만, 들키는 순간 조사 자체가 의심받습니다.",
    c1_route_investigate_share: "공개된 조사에는 참여자가 늘고, 결론의 주인은 당신 혼자가 아니게 됩니다.",
    c1_final_investigate_a: "작성자를 공개하면 세 안건은 다시 열립니다. 오늘의 결론은 늦어집니다.",
    c1_final_investigate_b: "가장 빠른 안건은 오늘을 삽니다. 누락 로그는 다음 사건에서 다시 나타납니다.",
    c1_final_investigate_c: "권한을 넘기면 결과를 기다려야 합니다. 대신 결론에 당신의 이해가 섞이지 않습니다.",
    c1_route_system_trace: "표의 이력을 열면 사건은 회계 문제에서 설계 문제로 옮겨 갑니다.",
    c1_route_system_use: "표를 건드리지 않으면 오늘은 빨라지고, 같은 표가 다음 사건도 통과시킵니다.",
    c1_route_system_open: "밖에서 읽히는 순간 기준은 회사의 것이 아니라 기록이 됩니다.",
    c1_final_system_a: "재심사는 시간을 크게 쓰지만, 세 위기가 하나의 원인으로 정리됩니다.",
    c1_final_system_b: "덮은 기준표는 다음 사건에서 같은 빈칸을 다시 만들어 냅니다.",
    c1_final_system_c: "권한을 넘기면 당신의 기준은 약해지고, 그 기준을 검증할 사람이 생깁니다.",
    c1_evidence_turn_public: "작성자가 드러나면 기준표는 실수가 아니라 결정이 됩니다.",
    c1_evidence_turn_private: "이름을 가린 수정은 빠릅니다. 같은 사람이 다음 표도 씁니다.",
    c1_evidence_turn_transfer: "검증권을 넘기면 이번 결론은 늦어지고, 다음 사건의 시작은 달라집니다.",
  },
  setting: { place: "플로우온 본사 8층 상황실", clock: "현금 소진 D-72h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 01
    c1_start_hold: {
      place: "트리거랩 분석실 · 케이스데스크",
      clock: "현금 소진 D-72h",
      question: "3년 동안 벽에 붙여 둔 이름들 아래에서, 그때 그 대출번호를 다시 만났습니다. 첫 72시간을 어디에 쓰겠습니까?",
      lead: "책상 앞 벽의 종이는 테이프를 세 번 갈아 붙이는 동안 그대로 있었습니다. 오늘 아침 한서윤이 내민 훈련용 사례 표지 밑단에 2023-0412가 남아 있습니다.",
    },
    c1_start_record: {
      place: "트리거랩 분석실 · 케이스데스크",
      clock: "현금 소진 D-72h",
      question: "B2에 남겨 둔 상자의 매듭이 당신의 매듭이 아닙니다. 첫 72시간을 어디에 쓰겠습니까?",
      lead: "3년 전 사본과 날짜 메모를 넣어 둔 상자를 오늘 아침 확인하러 내려갔습니다. 상자는 열려 있었고, 올라오니 같은 번호의 서류철이 책상에 있습니다.",
    },
    c1_start_alone: {
      place: "트리거랩 분석실 · 케이스데스크",
      clock: "현금 소진 D-72h",
      question: "맞춰 볼 종이가 한 장도 없고 기억만 있습니다. 첫 72시간을 어디에 쓰겠습니까?",
      lead: "3년 전 가방을 비우고 빈 책상 하나로 시작했습니다. 오늘 아침 그때 그 대출번호가 훈련용 사례의 표지로 돌아왔습니다.",
    },
    start: {
      place: "트리거랩 분석실 · 케이스데스크",
      clock: "현금 소진 D-72h",
      question: "플로우온의 현금이 사흘 뒤 바닥납니다. 첫 72시간을 어디에 쓰겠습니까?",
      lead: "트리거랩 분석실, 배치 첫날입니다. 3년 전 KD은행 기업금융전략팀에서 반대 의견 하나를 쓴 뒤 이 지하로 내려왔습니다. 한서윤이 올려놓은 첫 파일 표지에, 그때 그 대출번호가 그대로 남아 있습니다.",
    },
    accounting: {
      place: "플로우온 본사 8층 재무회의실",
      clock: "현금 소진 D-68h",
      question: "투자자가 본 숫자와 실제 현금이 다릅니다. 이 사실을 언제, 누구에게 먼저 꺼내겠습니까?",
      lead: "자금 자료를 요청하자 장부가 열렸습니다. 그 옆에 KD은행 대출 계약서도 함께 나왔고, 제7조에 밑줄이 그어져 있습니다.",
    },
    payday: {
      place: "플로우온 풀필먼트 센터 · 야간조 대기실",
      clock: "급여 지급까지 13h",
      question: "내일 오전 9시에 급여가 나가야 합니다. 직원들에게 지금 사실을 알리겠습니까, 방안을 확정한 뒤에 알리겠습니까?",
      lead: "본사에서 차로 40분, 서울 외곽 풀필먼트 센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)입니다. 여기 사람들은 아직 회사에 무슨 일이 벌어지는지 모릅니다.",
    },
    competitor: {
      place: "플로우온 본사 8층 협상실",
      clock: "현금 소진 D-52h",
      question: "경쟁사는 헐값 인수를, 오진우는 더 싼 대안을 내밀었습니다. 무엇을 협상 테이블에 올리겠습니까?",
      lead: "현장에서 본사로 돌아오자 넥스트마일의 인수(회사를 통째로 사들이는 것) 제안서가 먼저 도착해 있었습니다. 같은 자리에 트리거랩 분석관 오진우도 앉아 있습니다.",
    },
    board: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-30h",
      question: "직원·생존·책임·투자자·협력사를 전부 지킬 수는 없습니다. 무엇을 맨 앞에 두겠습니까?",
      lead: "이틀 동안 모은 자료가 한 테이블에 올라왔습니다. 에코가 모든 항목을 동시에 만족시키는 조합이 없다고 표시합니다.",
    },
    c1_witness: {
      place: "플로우온 본사 8층 회계팀 복도",
      clock: "현금 소진 D-66h",
      question: "회계팀 막내가 문 앞에서 멈춰 섰습니다. 그가 안전하게 말할 자리를 먼저 만들겠습니까?",
      lead: "재무회의가 끝나고 복도로 나오는 길입니다. 회의에 초대받지 못했던 직원이 당신을 기다리고 있습니다.",
    },
    c1_witness_reaction: {
      place: "플로우온 본사 8층 회계팀",
      clock: "현금 소진 D-65h",
      question: "증언이 시작되자 회계팀 전체가 입을 닫았습니다. 누구를 보호한다고 기록에 남기겠습니까?",
    },
    c1_assembly: {
      place: "플로우온 풀필먼트 센터 · 야간조 대기실",
      clock: "급여 지급까지 9h",
      question: "직원들이 원하는 건 돈보다 내일도 여기 있을지에 대한 답입니다. 약속을 어떤 형식으로 남기겠습니까?",
    },
    c1_assembly_reaction: {
      place: "플로우온 풀필먼트 센터 · 야간조 대기실",
      clock: "급여 지급까지 4h",
      question: "직원 단체방에 서로 다른 소문이 올라왔습니다. 지금 아는 것까지만 공지하겠습니까?",
    },
    c1_bargain: {
      place: "플로우온 본사 8층 협상실",
      clock: "현금 소진 D-44h",
      question: "인수 조건서의 빈칸에 누가 들어갈지 아무도 쓰지 않았습니다. 그 칸을 채운 뒤에 협상하겠습니까?",
    },
    c1_bargain_reaction: {
      place: "플로우온 본사 8층 협상실",
      clock: "현금 소진 D-40h",
      question: "협상 상대가 자리에 오지 않았습니다. 빈 의자의 사람들을 협상에 부르겠습니까?",
    },
    c1_verdict: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-24h",
      question: "자료는 다 모였는데 결론은 더 멀어졌습니다. 내일의 비용을 누가 들게 하겠습니까?",
    },
    c1_verdict_reaction: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-20h",
      question: "반재욱이 마지막으로 묻습니다. 이 결론을 가장 먼저 듣게 될 사람은 누구입니까?",
    },
    c1_branch_people: {
      place: "플로우온 본사 8층 협상실",
      clock: "현금 소진 D-42h",
      question: "협상서의 빈칸을 사람 이름으로 채우려 합니다. 누구의 이름부터 적겠습니까?",
    },
    c1_branch_people_follow: {
      place: "플로우온 본사 8층 협상실",
      clock: "현금 소진 D-38h",
      question: "서명 뒤 첫 전화는 계약서에 없는 사람에게서 왔습니다. 그 약속을 무엇으로 보증하겠습니까?",
    },
    c1_route_layoff: {
      place: "플로우온 본사 8층 인사회의실",
      clock: "현금 소진 D-70h",
      question: "감축 명단이 열렸습니다. 대상자에게 먼저 알리겠습니까, 절감액을 먼저 확정하겠습니까?",
      lead: "구조조정을 검토하겠다고 말한 직후입니다. 회의실 밖 대기 명단이 사건의 중심으로 들어옵니다.",
    },
    c1_route_funding: {
      place: "플로우온 본사 8층 투자 협의실",
      clock: "현금 소진 D-70h",
      question: "긴급 자금 조건서에 비공개 심사 조항이 있습니다. 시간을 살 것인지, 설명 권한을 지킬 것인지 정해야 합니다.",
      lead: "단기 자금 조달에 집중하겠다고 말한 직후입니다. 돈은 시간을 벌어주지만 조건서는 다음 판단의 공개 범위를 먼저 묻습니다.",
    },
    c1_route_sale: {
      place: "플로우온 본사 8층 자산 검토실",
      clock: "현금 소진 D-70h",
      question: "매각 목록에 고객 데이터와 운영 로그가 섞여 있습니다. 무엇을 떼어내고 팔겠습니까?",
      lead: "핵심 사업부 매각 가능성을 열겠다고 말한 직후입니다. 돈을 만드는 행동이 곧 다음 사건의 재료가 됩니다.",
    },
    c1_route_investigate: {
      place: "플로우온 본사 8층 자료실",
      clock: "현금 소진 D-70h",
      question: "요청한 원자료가 도착했지만 숫자 사이에 빈칸이 있습니다. 어디부터 열어보겠습니까?",
      lead: "결론을 미루는 사람처럼 보일 위험을 감수하고 추가 자료를 요청한 직후입니다.",
    },
    c1_route_system: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-70h",
      question: "선택지 밖으로 판을 다시 짜자 사건의 규칙이 반응했습니다. 이 규칙을 어떻게 쓰겠습니까?",
      lead: "준비된 보기 셋 가운데 어느 것도 걸지 않고 다시 짠 판이 사건 파일에 그대로 기록됐습니다.",
    },
    c1_final_layoff: {
      place: "플로우온 본사 8층 인사회의실",
      clock: "현금 소진 D-8h",
      question: "절감액은 확보됐고 이름은 남았습니다. 이 감축을 무엇으로 마무리하겠습니까?",
    },
    c1_final_funding: {
      place: "플로우온 본사 8층 투자 협의실",
      clock: "현금 소진 D-8h",
      question: "자금은 들어왔지만 설명 권한이 줄었습니다. 이 조건을 어디까지 받아들이겠습니까?",
    },
    c1_final_sale: {
      place: "플로우온 본사 8층 자산 검토실",
      clock: "현금 소진 D-8h",
      question: "매각으로 회사는 남습니다. 팔지 않고 지킬 것을 지금 정해야 합니다.",
    },
    c1_final_investigate: {
      place: "플로우온 본사 8층 자료실",
      clock: "현금 소진 D-8h",
      question: "원자료가 사건의 시작점을 다시 가리킵니다. 이 발견을 어디에 쓰겠습니까?",
    },
    c1_final_system: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-8h",
      question: "당신이 다시 짠 판이 사건의 규칙이 됐습니다. 그 규칙을 남기겠습니까, 닫겠습니까?",
    },
    c1_evidence_turn: {
      place: "플로우온 본사 8층 상황실",
      clock: "현금 소진 D-16h",
      question: "모은 단서가 세 안건을 한 줄로 묶습니다. 이 연결을 공식 기록으로 올리겠습니까?",
    },
    c1_aftershock: {
      place: "플로우온 본사 8층 상황실",
      clock: "결정 다음 날 오전",
      question: "결정 다음 날, 숫자보다 사람들의 반응이 먼저 도착했습니다. 누구에게 먼저 설명하겠습니까?",
      lead: "사건은 닫혔지만 하루가 더 남았습니다. 당신이 남긴 약속을 사람들이 각자 다르게 읽고 있습니다.",
    },
  },
  clue: {
    id: "c1-hidden-ledger",
    title: "숨은 급여표",
    text: "공식 보고서보다 먼저 움직인 돈의 흔적이 있습니다. 누군가는 이미 다음 사건을 알고 있었습니다.",
  },
  outcomes: {
    c1_after_people: { tag: "사람을 먼저 세운 결말", title: "급여명세서보다 먼저 이름을 불렀다", text: "직원과 협력사는 당신의 결정을 완전히 믿지는 않지만, 적어도 누가 비용을 떠안는지 알게 됐습니다. 다음 사건은 사람을 보호한 대가로 더 느리게 시작됩니다." },
    c1_after_numbers: { tag: "숫자를 공개한 결말", title: "현금 흐름표가 약속이 되었다", text: "회사는 더 많은 질문을 받게 됐지만, 숨겨진 손실은 줄었습니다. 다음 사건은 기록을 믿을지 사람을 믿을지 묻습니다." },
    c1_after_silence: { tag: "침묵을 택한 결말", title: "조용한 하루를 샀다", text: "자금은 하루를 벌었지만 직원들의 믿음은 늦게 회복됩니다. 다음 사건에는 설명되지 않은 비용이 따라옵니다." },
  },
  carryovers: {
    c1_after_people: { trust: 6, humanCost: -3, fatigue: 4 },
    c1_after_numbers: { capital: -4, legitimacy: 5, fatigue: 2 },
    c1_after_silence: { capital: 5, trust: -7, legitimacy: -4 },
  },
  // 사건 01 follows the 프롤로그 now, so it has a predecessor for the first
  // time: what the analyst carried down to 트리거랩 is what the first table
  // asks them to put down.
  continuityChallenges: {
    p5_after_hold: { id: "protect-trust", title: "벽의 이름을 오늘의 이름과 잇기", text: "3년 동안 벽에 붙여 둔 열한 개의 이름은 기억이지 기록이 아닙니다. 오늘 72시간 안에서 그 이름들이 누구를 가리키는지 보여 주는 선택을 찾으면 숨은 단서가 열릴 수 있습니다." },
    p5_after_record: { id: "repair-legitimacy", title: "다시 묶인 매듭을 되찾기", text: "B2의 상자는 당신이 묶은 매듭이 아닙니다. 남겨 둔 기록이 누구의 손을 거쳤는지 먼저 묻는 선택이 공정함을 되찾고 압박을 낮춥니다." },
    p5_after_alone: { id: "protect-trust", title: "기억을 혼자 쥐지 않기", text: "가방을 비우고 시작한 3년은 증명할 것을 하나도 남기지 않았습니다. 기억만 있다는 사실을 옆 사람에게 먼저 꺼내 놓는 선택이 압박을 낮춥니다." },
  },
};
