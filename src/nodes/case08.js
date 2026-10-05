/**
 * CASE 08 -- the authored scenes of the trace case.
 *
 * 사건 07 ends with the analyst posted 240km away, which the group meant as an
 * ending. It is the season's second act instead. The branch the analyst is sent
 * to holds a dormant corporate account that takes a consulting fee every quarter
 * and forwards all of it, the same day, to a gallery in Seoul -- the system
 * calculated where to put a nuisance and put it on the one counter the money
 * passes.
 *
 * The case runs on the other engine of the season's thesis. The first seven
 * cases are mostly about what care costs; this one is about what a grudge can
 * see. 오진우's father was pushed out for a one-day delay, and the line his
 * father left him is the case's method: a man above you is still a man, a man is
 * ruled by what he wants, and wanting spends money, and money leaves a trail.
 * The dilemma is not whether the trail is real. It is whether the hand that
 * follows it is allowed to become the thing it is following.
 */
export const case08Nodes = {
  c8_start: {
    phase: "CASE 08 BRIEFING",
    title: "240km 밖의 창구",
    speaker: "나준혁",
    text:
      "강원 영동지점 부임 9일째. 휴면 법인 계좌(오래 거래가 끊긴 회사 계좌)를 정리하다 한 줄에서 손이 멈춥니다. 경포 펜션 주소로 등록된 컨설팅 회사 해온파트너스. 3년 전부터 분기마다 자문료(조언을 해 준 값으로 받는 돈)가 들어오고, 같은 날 전액이 서울 청담동의 한 갤러리로 나갑니다. 그리고 오늘 아침, 이 회사의 청산(회사를 정리해 없애는 절차) 신청서가 접수됐습니다. 나준혁 지점장이 믹스커피를 내려놓습니다. '그 계좌, 전임자가 세 번 올렸다가 세 번 다 반려(받아 주지 않고 돌려보냄)됐어요.'",
    memo: [
      "해온파트너스: 분기 자문료 입금 당일 전액 출금",
      "입금처: 노바웍스, 브릿지은행 계열 자문사",
      "출금처: 청담동 갤러리 온",
      "청산 등기까지 72시간, 등기가 끝나면 계좌 조회 불가",
    ],
    triggers: ["revenge", "injustice", "curiosity"],
    choices: [
      {
        id: "c8_start_report",
        label: "의심거래 보고서를 정식으로 올린다",
        effect: { legitimacy: 10, trust: 3, time: -8, fatigue: 4 },
        voice: "이상한 흐름을 보고도 넘길 수는 없다며, 의심거래 보고서를 내 이름으로 정식으로 올린다.",
        echo: "의심거래 보고서(수상한 돈 흐름을 금융당국에 알리는 서류)는 기록에 남습니다. 이 계좌는 앞서 세 번 반려됐고, 이번에 돌려보내는 사람은 이유를 적어야 합니다.",
        next: "c8_trail",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c8_start_copy",
        label: "조회 기록 없이 거래 내역만 따로 떠 둔다",
        effect: { time: 6, capital: 5, legitimacy: -8, humanCost: 3, fatigue: 3 },
        voice: "조회 기록이 남으면 들킨다며, 거래 내역만 조용히 떠 둔다.",
        echo: "기록 없는 사본은 들키지 않습니다. 법정에서도 존재한 적이 없는 자료가 됩니다.",
        next: "c8_trail",
        cognition: { risk: 2 },
      },
      {
        id: "c8_start_ask",
        label: "지점장에게 이 계좌가 지나온 경위부터 묻는다",
        effect: { trust: 10, legitimacy: 3, time: -9, fatigue: 5 },
        voice: "보고서보다 사람이 먼저라며, 지점장에게 이 계좌가 지나온 경위부터 묻는다.",
        echo: "지점장에게 물으면 72시간 중 몇 시간이 순대 한 접시와 함께 사라집니다. 대신 이 계좌가 세 번 반려된 이유가 사람의 입으로 나옵니다.",
        next: "c8_trail",
        cognition: { reframing: 1, inference: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c8_trail",
      },
    ],
  },
  c8_trail: {
    phase: "THE TRACE",
    title: "욕망의 목록",
    speaker: "오진우",
    text:
      "사직서가 수리된 지 엿새. 오진우가 영상통화로 벽에 붙인 A4 네 장을 비춥니다. 갤러리 온의 대표는 윤상혁 상무의 배우자, 경포 펜션의 실소유주(서류상 이름과 상관없이 실제로 가진 사람)는 그의 처남입니다. '사람은 결국 욕망의 노예입니다. 욕망은 돈을 쓰고, 돈은 흔적을 남기죠. 아버지가 지점에서 밀려난 날 저한테 한 말입니다.' 그가 잠깐 웃습니다. '그 말을 누구한테 배웠는지 아십니까. 윤상혁한테 배웠답니다.'",
    memo: [
      "갤러리 온 대표: 윤상혁 배우자 명의",
      "해온 펜션 실소유주: 윤상혁 처남",
      "오진우는 퇴사 후 개인 자격으로 추적 중",
      "출처가 불분명한 자료가 섞이면 증거 능력이 떨어짐",
    ],
    triggers: ["revenge", "curiosity", "injustice"],
    choices: [
      {
        id: "c8_trail_money",
        label: "사람 말고 돈이 지나간 경로만 따라간다",
        effect: { legitimacy: 9, trust: -4, time: -7, fatigue: 5 },
        voice: "누구를 미워하는지는 빼고, 돈이 지나간 경로만 따라가겠다고 한다.",
        echo: "돈만 따라가면 흔적은 깨끗합니다. 오진우는 그 깨끗함이 차갑다고 느낄 겁니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c8_trail_family",
        label: "가족 명의 재산까지 전부 목록에 올린다",
        effect: { legitimacy: 5, capital: 6, trust: -9, humanCost: 7, fatigue: 3 },
        voice: "욕망은 가족 이름으로 숨는다며, 가족 명의 재산까지 전부 목록에 올린다.",
        echo: "가족 명의까지 올리면 목록은 길어집니다. 그 목록에는 이 일과 무관한 이름도 섞입니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c8_trail_split",
        label: "오진우의 자료와 내 자료를 섞지 않고 따로 둔다",
        effect: { trust: 8, legitimacy: 6, capital: -5, time: -10, fatigue: 6 },
        voice: "그의 분노와 내 증거가 섞이면 안 된다며, 오진우의 자료를 따로 둔다.",
        echo: "자료를 나누면 증거는 오염되지 않습니다. 나눈 만큼 시간이 들고, 오진우는 조금 서운해합니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c8_gallery: {
    phase: "THE GALLERY",
    title: "그림값",
    speaker: "반재욱",
    text:
      "청담동 갤러리 온. 사표가 수리된 반재욱이 관람객처럼 서서 가격표를 수첩에 옮겨 적습니다. 무명 작가의 소품 열두 점, 점당 1억 2천. 구매자는 전부 노바웍스와 브릿지은행의 협력사이고, 작가는 브릿지은행 남궁현 부행장의 조카입니다. '그림은 좋은 도구입니다. 값이 정해져 있지 않으니까. 비싸게 사 주면 그게 곧 뇌물이죠.' 그가 수첩을 덮지 않습니다. '나는 이제 감사역이 아니라서, 이걸 적어도 낼 곳이 없습니다. 그래도 적습니다.'",
    memo: [
      "소품 12점 × 1억 2천 = 14억 4천",
      "구매자 전원이 노바웍스·브릿지은행 협력사",
      "작가: 브릿지은행 남궁현 부행장의 조카",
      "그림은 시세를 매기기 어려워 배임 입증이 까다로움",
    ],
    triggers: ["injustice", "revenge", "trust"],
    choices: [
      {
        id: "c8_gallery_price",
        label: "감정평가를 따로 받아 그림값을 숫자로 만든다",
        effect: { legitimacy: 11, capital: -8, time: -6, fatigue: 4 },
        voice: "그림값이 얼마여야 했는지 숫자로 만들자며, 감정평가를 따로 받는다.",
        echo: "감정평가는 그림값을 숫자로 만듭니다. 숫자가 되는 데 드는 돈과 시간은 당신이 냅니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c8_gallery_buyers",
        label: "그림을 산 협력사 담당자를 한 명씩 찾아간다",
        effect: { trust: 7, legitimacy: 5, humanCost: 6, time: -8, fatigue: 6 },
        voice: "그림을 산 사람들도 이유가 있을 거라며, 담당자를 한 명씩 찾아간다.",
        echo: "찾아간 담당자들은 대개 시킨 대로 샀습니다. 그들의 이름이 먼저 흔들립니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c8_gallery_note",
        label: "반재욱의 수첩 기록을 그대로 증언으로 받는다",
        effect: { trust: 11, humanCost: -4, legitimacy: -3, time: -4, fatigue: 4 },
        voice: "낼 곳이 없다는 그 수첩을, 내가 낼 곳이 되겠다며 증언으로 받는다.",
        echo: "수첩은 성실한 기록이지만 사적인 기록입니다. 증언이 되는 순간 반재욱도 증인석에 섭니다.",
        cognition: { reframing: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c8_bait: {
    phase: "THE BAIT",
    title: "미끼",
    speaker: "오진우",
    text:
      "오진우가 계획을 꺼냅니다. 윤상혁 쪽에 '감사팀이 해온파트너스를 본다'는 소문을 흘리면, 청산 전에 남은 돈을 급히 옮길 겁니다. 급하게 옮긴 돈이 가장 선명한 흔적을 남깁니다. 그의 목소리가 처음으로 떨립니다. '저는 그 사람이 서류를 덮는 속도를 압니다. 이번엔 제가 그 속도를 정하고 싶습니다.' 일부러 끌어낸 거래는 흔적을 선명하게 만들고, 같은 이유로 법정에서 흐려집니다. 막으려면 청산 전에 법원에 보전 신청(재산을 못 옮기게 묶어 두는 절차)을 내야 합니다.",
    memo: [
      "소문이 돌면 48시간 안에 자금 이동 가능성 높음",
      "일부러 끌어낸 거래는 증거로 인정될지 다툼이 생김",
      "오진우는 사적인 복수라는 말을 부인하지 않음",
      "송금 실무는 갤러리 직원 2명이 맡고 있음",
    ],
    triggers: ["revenge", "choice", "affection"],
    choices: [
      {
        id: "c8_bait_set",
        label: "미끼를 놓아 돈이 움직이게 만든다",
        effect: { capital: 9, legitimacy: 6, trust: -6, humanCost: 8, fatigue: 5 },
        voice: "그가 서류를 덮는 속도를 이번엔 우리가 정하자며, 미끼를 놓는다.",
        echo: "유도된 거래는 선명합니다. 변호인은 그 선명함이 누가 만든 것인지부터 물을 겁니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c8_bait_stop",
        label: "오진우를 말리고 청산 전에 법원에 보전 신청을 낸다",
        effect: { legitimacy: 12, trust: -5, capital: -9, time: -7, fatigue: 5 },
        voice: "함정은 증거를 흐린다며 오진우를 말리고, 법원에 보전 신청부터 낸다.",
        echo: "보전 신청은 느리고 확실합니다. 오진우는 당신이 그의 칼을 뺏었다고 생각할 수 있습니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c8_bait_listen",
        label: "계획은 멈추고 오진우의 이야기부터 끝까지 듣는다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -11, fatigue: 6 },
        voice: "계획은 잠깐 내려놓자며, 오진우의 아버지 이야기부터 끝까지 듣는다.",
        echo: "끝까지 들은 이야기는 계획을 늦춥니다. 대신 그 계획이 누구를 위한 것인지 처음으로 말해집니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c8_final: {
    phase: "FINAL DECISION",
    title: "칼을 쥔 손",
    speaker: "오진우",
    text:
      "청산 등기까지 5시간. 해온파트너스의 자문료(조언값이라며 받은 돈), 갤러리의 그림값, 그리고 3년 전 2023-0412의 빈 서명란이 하나의 흔적표로 이어졌습니다. 오진우가 파일을 넘기기 전에 묻습니다. '이걸로 그 사람을 무너뜨릴 수 있습니다. 그런데 무너뜨리는 게 목적이면, 저는 그 사람하고 뭐가 다릅니까.' 칼을 누구 손에 쥐여 줄지가 남았습니다.",
    memo: [
      "흔적표: 해온 자문료 → 갤러리 그림값 → 윤상혁 가족",
      "검찰 수사 의뢰 시 공개까지 수개월",
      "플로우온 채권단 협상의 지렛대로 쓸 수 있음",
      "오진우는 탐사보도팀 기자와 이미 연락함",
    ],
    triggers: ["revenge", "responsibility", "choice", "selfAwareness"],
    choices: [
      {
        id: "c8_final_law",
        label: "흔적표를 검찰 수사 의뢰서로 만들어 넘긴다",
        effect: { legitimacy: 16, trust: 5, capital: -9, time: -6, fatigue: 5 },
        voice: "칼은 법이 쥐어야 한다며, 흔적표를 검찰 수사 의뢰서로 만든다.",
        echo: "법이 쥔 칼은 느리게 내려옵니다. 내려오는 동안 흔적표는 여러 사람의 손을 거칩니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c8_final_lever",
        label: "흔적표를 쥐고 채권단 협상의 지렛대로 쓴다",
        effect: { capital: 12, trust: 6, humanCost: -6, legitimacy: -8, fatigue: 5 },
        voice: "벌하기 전에 살릴 사람이 있다며, 흔적표를 협상 테이블 밑에 쥐고 간다.",
        echo: "지렛대로 쓴 흔적은 사람을 살리는 데 쓰입니다. 벌은 그만큼 미뤄지고, 미룬 벌은 협상의 일부가 됩니다.",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "c8_final_press",
        label: "오진우가 원하는 대로 탐사보도에 먼저 넘긴다",
        effect: { trust: 10, legitimacy: 6, humanCost: 9, capital: -6, fatigue: 3 },
        voice: "오진우가 이미 연락해 둔 기자를 믿어 보겠다며, 탐사보도에 먼저 넘긴다.",
        echo: "보도는 가장 빠른 칼입니다. 기사가 나가는 날 가장 먼저 다치는 사람은 대개 기사에 이름이 작게 나온 사람입니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 08 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case08 = {
  id: "case08",
  nodes: case08Nodes,
  aftermath: {
    c8_aftershock: {
      phase: "AFTERMATH",
      title: "청산 등기 다음 날",
      speaker: "나준혁",
      text: "해온파트너스의 청산은 결국 등기됐습니다. 계좌는 닫혔고 흔적표는 당신 손에 남았습니다. 퇴근길, 나준혁 지점장이 오징어순대 한 접시를 시켜 놓고 말합니다. '나는 여기서 30년 동안 본점 사람들 욕만 했지, 뭘 해 본 적은 없어요. 그 반려된 세 건, 내가 도장 찍었던 거예요.' 그가 젓가락을 내려놓습니다. '이번엔 내 도장도 찍을게요.'",
      memo: ["해온파트너스 법인 청산 등기 완료", "지점장이 과거 반려 서명을 스스로 밝힘", "오진우는 서울에서 연락이 끊김", "흔적표 원본은 당신과 반재욱 두 사람만 가짐"],
      triggers: ["revenge", "responsibility", "affection"],
      choices: [
        {
          id: "c8_after_law",
          label: "지점장의 도장까지 받아 흔적표를 공식 기록으로 만든다",
          effect: { legitimacy: 14, trust: 5, capital: -7, fatigue: 7 },
          voice: "30년 만에 꺼낸 지점장의 도장까지 받아, 흔적표를 공식 기록으로 만든다.",
          echo: "도장이 찍힌 흔적표는 지점장의 30년도 함께 기록합니다. 그는 그걸 알고 찍었습니다.",
          next: "case08_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c8_after_friend",
          label: "연락이 끊긴 오진우부터 찾으러 서울로 올라간다",
          effect: { trust: 13, humanCost: -5, time: -8, fatigue: 8 },
          voice: "흔적표보다 사람이 먼저라며, 연락이 끊긴 오진우를 찾으러 올라간다.",
          echo: "찾아간 친구는 문을 열어 줍니다. 그 사이 흔적표는 가방 안에서 하루를 더 기다립니다.",
          next: "case08_result",
          cognition: { persistence: 2 },
        },
        {
          id: "c8_after_blade",
          label: "흔적표를 혼자 쥐고 쓸 때를 기다린다",
          effect: { capital: 11, time: 6, trust: -12, legitimacy: -6, humanCost: 6, fatigue: 3 },
          voice: "아직은 쓸 때가 아니라며, 흔적표를 혼자 쥐고 기다린다.",
          echo: "혼자 쥔 칼은 언제든 쓸 수 있습니다. 누구도 그 칼을 쓴 이유를 대신 설명해 주지 않습니다.",
          next: "case08_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c8_final", "c8_aftershock"],
  connectiveScenes: [
    {
      id: "c8_sundae",
      after: "c8_trail",
      next: "c8_gallery",
      title: "오징어순대",
      speaker: "나준혁",
      text: "점심시간, 지점장이 시장 골목 오징어순대 집으로 당신을 데려갑니다. 그는 세 번 반려된 보고서 얘기는 한 마디도 하지 않고, 순대를 달걀물에 찍는 순서만 설명합니다. '서울 사람들은 이걸 그냥 먹어요. 그러니까 맛을 모르지.' 계산할 때 그가 영수증 뒷면에 전임자의 휴대폰 번호를 적어 줍니다.",
      memo: ["전임자는 2년 전 명예퇴직", "지점장은 반려 사유를 기억한다고 말함", "영수증 뒷면에 적힌 번호 하나"],
      choices: [
        {
          label: "전임자에게 바로 전화를 걸어 사정을 듣는다",
          effect: { trust: 8, legitimacy: 4, capital: -5, time: -5, fatigue: 5 },
          voice: "영수증 뒷면의 번호로, 전임자에게 바로 전화를 걸어 사정을 듣겠다고 한다.",
          echo: "바로 건 전화는 사람을 먼저 엽니다. 준비되지 않은 사람의 말은 정확하지 않을 수 있습니다.",
        },
        {
          label: "번호는 받아 두고 반려 기록부터 확인한다",
          effect: { legitimacy: 7, time: -4, humanCost: 3, fatigue: 4 },
          voice: "번호는 지갑에 넣어 두고, 반려 기록부터 확인하겠다고 한다.",
          echo: "기록부터 보면 질문이 날카로워집니다. 그 사이 전임자는 전화를 받을 이유를 잃을 수도 있습니다.",
        },
        {
          label: "오늘은 묻지 않고 순대 맛만 칭찬하고 넘어간다",
          effect: { time: 6, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
          voice: "지점장이 반려 얘기를 한 마디도 꺼내지 않으니, 오늘은 묻지 않고 순대 맛만 칭찬하고 넘어간다.",
          echo: "묻지 않은 점심은 편합니다. 지점장이 번호를 적어 준 이유는 하루 더 설명되지 않습니다.",
        },
      ],
    },
    {
      id: "c8_mother",
      after: "c8_gallery",
      next: "c8_bait",
      title: "반찬통",
      speaker: "도윤하",
      text: "도윤하에게서 전화가 옵니다. 오진우의 어머니가 트리거랩 로비에 반찬통을 들고 찾아왔다고 합니다. 아들이 회사를 그만둔 걸 모르고, 요즘 밤마다 옛 서류를 뒤진다며 걱정합니다. '그 애 아버지도 그만두기 전에 꼭 저랬어요.' 도윤하가 조용히 묻습니다. '뭐라고 말씀드릴까요.'",
      memo: ["어머니는 아들의 퇴사를 모름", "오진우의 아버지도 퇴직 직전 같은 행동을 보임", "도윤하는 거짓말은 하지 않겠다고 함"],
      choices: [
        {
          label: "오진우에게 전화해 어머니께 직접 말하게 한다",
          effect: { trust: 9, humanCost: -3, capital: -4, time: -5, fatigue: 5 },
          voice: "퇴사는 아들 입으로 들어야 할 소식이라, 오진우에게 전화해 어머니께 직접 말하게 한다.",
          echo: "직접 말하게 하면 그는 오늘 밤 복수 말고 다른 일을 하나 하게 됩니다. 전화를 받을지는 모릅니다.",
        },
        {
          label: "회사 규정대로 퇴사 사실만 확인해 드린다",
          effect: { legitimacy: 6, time: -3, humanCost: 4, fatigue: 3 },
          voice: "도윤하가 거짓말은 하지 않겠다고 하니, 회사 규정대로 퇴사 사실만 확인해 드리라고 한다.",
          echo: "규정대로 확인하면 거짓말은 없습니다. 어머니는 로비에서 그 사실을 혼자 듣게 됩니다.",
        },
        {
          label: "잘 지낸다고만 전하고 반찬통은 대신 받아 둔다",
          effect: { time: 5, capital: 4, trust: -7, humanCost: 4, fatigue: -3 },
          voice: "잘 지낸다고만 전하고, 반찬통은 우리가 대신 받아 두자고 한다.",
          echo: "대신 받은 반찬통은 오늘을 조용하게 합니다. 그 조용함은 오진우가 모르는 채로 쌓입니다.",
        },
      ],
    },
    {
      id: "c8_clerks",
      after: "c8_bait",
      next: "c8_final",
      title: "도장 찍은 사람",
      speaker: "반재욱",
      text: "갤러리 온의 직원 둘이 퇴근길에 반재욱을 붙잡습니다. 그림값 송금 서류에 도장을 찍은 사람이 자기들이라고, 윗선이 무너지면 자기들 이름만 남는다고. 스물여섯, 스물아홉. 한 사람은 아직 수습 기간입니다. 반재욱이 수첩을 덮습니다. '내가 자른 마흔한 명이 대개 이 나이였습니다.'",
      memo: ["송금 실무 도장은 직원 2명 명의", "한 명은 수습 3개월째", "두 사람은 협조 의사를 밝힘"],
      choices: [
        {
          label: "두 사람을 협조자로 보호할 방법부터 만든다",
          effect: { trust: 8, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
          voice: "도장을 찍은 두 사람을 협조자로 보호할 방법부터 만들겠다고 한다.",
          echo: "보호 장치를 먼저 만들면 두 사람은 끝까지 말합니다. 그 장치를 만드는 동안 청산 시계는 멈추지 않습니다.",
        },
        {
          label: "진술서를 받고 절차대로 참고인으로 올린다",
          effect: { legitimacy: 8, time: -5, humanCost: 3, fatigue: 4 },
          voice: "두 사람이 협조 의사를 밝혔으니, 진술서를 받고 절차대로 참고인으로 올린다.",
          echo: "참고인으로 올리면 진술은 단단해집니다. 두 사람의 이름도 같은 문서에서 단단해집니다.",
        },
        {
          label: "실무자는 빼고 윗선의 흔적만 쓴다",
          effect: { time: 6, capital: 6, trust: -6, humanCost: 5, fatigue: -3 },
          voice: "실무자 이름은 빼고, 윗선의 흔적만 쓰겠다고 한다.",
          echo: "실무자를 빼면 빠릅니다. 도장 찍힌 서류는 그래도 그들의 이름으로 남아 있습니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c8_sundae_reaction",
      after: "c8_sundae",
      next: "c8_gallery",
      title: "전임자의 목소리",
      speaker: "나준혁",
      text: "전임자는 춘천에서 과수원을 합니다. 전화기 너머로 경운기 소리가 들립니다. '세 번 올렸어요. 세 번째 반려 때 인사 면담을 했고, 네 번째는 안 올렸죠. 그 사람들은 올리는 사람보다 반려하는 사람을 먼저 봐요.' 옆에서 듣던 나준혁 지점장이 조용히 커피잔을 내려놓습니다.",
      memo: ["세 번 반려된 보고서의 네 번째", "올리는 사람보다 먼저 보이는 반려자"],
      choices: [
        {
          label: "그의 증언을 받아 반려 경위서에 붙인다",
          effect: { trust: 8, legitimacy: 3, capital: -4, time: -5, fatigue: 4 },
          voice: "세 번째 반려 뒤에 인사 면담이 있었다는 말을 남기려고, 전임자의 증언을 받아 반려 경위서에 붙인다.",
          echo: "증언이 붙은 경위서는 반려가 실수가 아니었음을 말합니다. 그는 4년 만에 다시 그 일의 당사자가 됩니다.",
        },
        {
          label: "반려 승인 라인만 문서로 확인한다",
          effect: { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
          voice: "증언은 받지 않고, 반려 승인 라인만 문서로 확인한다.",
          echo: "승인 라인은 누가 막았는지 보여줍니다. 왜 막았는지는 문서에 없습니다.",
        },
        {
          label: "과수원까지 끌어들이지 않고 통화를 끝낸다",
          effect: { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
          voice: "과수원까지 끌어들이지 말자며, 고맙다고 하고 통화를 끝낸다.",
          echo: "끝낸 통화는 그를 과수원에 남겨 둡니다. 세 번의 반려는 여전히 이유 없는 반려입니다.",
        },
      ],
    },
    {
      id: "c8_mother_reaction",
      after: "c8_mother",
      next: "c8_bait",
      title: "계란말이",
      speaker: "도윤하",
      text: "도윤하가 반찬통을 들고 4층으로 올라옵니다. 멸치볶음, 깻잎, 그리고 오진우가 어릴 때 좋아했다는 계란말이. 도윤하가 통을 열다 말고 웃습니다. '이거 우리가 먹으면 안 되겠죠.' 둘 다 한 조각씩 먹습니다. 그리고 도윤하가 말합니다. '복수를 하든 뭘 하든, 밥은 먹고 하게 해야죠.'",
      memo: ["복수보다 먼저 먹어야 할 밥", "모르는 채로 걱정하는 가족"],
      choices: [
        {
          label: "반찬통을 들고 오진우를 직접 찾아간다",
          effect: { trust: 9, humanCost: -3, capital: -4, time: -6, fatigue: 5 },
          voice: "복수를 하든 밥은 먹고 하게 해야 한다는 말에, 반찬통을 들고 오진우를 직접 찾아간다.",
          echo: "직접 찾아가면 그는 문을 열 수도, 안 열 수도 있습니다. 반찬통은 어느 쪽이든 전달됩니다.",
        },
        {
          label: "반찬통은 택배로 보내고 연락은 절차대로 한다",
          effect: { legitimacy: 5, trust: 3, time: -3, humanCost: 4, fatigue: 3 },
          voice: "밥은 먹게 하되 퇴사 얘기에는 끼지 않으려고, 반찬통은 택배로 보내고 연락은 절차대로 한다.",
          echo: "택배는 정확하게 도착합니다. 누가 보냈는지는 송장에 적힌 이름 하나로만 남습니다.",
        },
        {
          label: "반찬통은 탕비실에 두고 이 일에서 한발 물러선다",
          effect: { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
          voice: "아들과 어머니 사이의 일에 낄 자리는 없다며, 반찬통은 탕비실에 두고 이 일에서 한발 물러선다.",
          echo: "한발 물러서면 복수는 그 혼자의 일이 됩니다. 탕비실의 계란말이는 내일이면 식습니다.",
        },
      ],
    },
    {
      id: "c8_clerks_reaction",
      after: "c8_clerks",
      next: "c8_final",
      title: "수습 3개월",
      speaker: "에코",
      text: "에코가 두 직원의 급여 이체 내역을 띄웁니다. 수습 직원의 월급은 그가 도장을 찍은 그림값의 0.2%입니다. '흔적은 위로 올라갈수록 흐려지고, 아래로 내려올수록 이름이 선명해집니다. 이 표에서 가장 선명한 이름은 가장 적게 받은 사람입니다.'",
      memo: ["가장 적게 받고 가장 선명한 이름", "흔적표를 읽는 순서"],
      choices: [
        {
          label: "두 사람의 이름을 가장 나중에 쓰도록 순서를 바꾼다",
          effect: { trust: 8, legitimacy: 4, humanCost: -4, time: -5, fatigue: 5 },
          voice: "가장 적게 받은 두 사람의 이름이 가장 나중에 나오도록, 순서를 바꾼다.",
          echo: "순서를 바꾸면 흔적표는 위에서부터 읽힙니다. 위쪽은 흐려서, 읽는 사람이 더 오래 봐야 합니다.",
        },
        {
          label: "이름은 그대로 두고 급여 대비 책임 비율을 붙인다",
          effect: { legitimacy: 7, time: -4, humanCost: 3, fatigue: 4 },
          voice: "수습 직원 월급이 도장 찍은 그림값의 0.2%라서, 이름은 그대로 두고 급여 대비 책임 비율을 붙인다.",
          echo: "비율을 붙이면 숫자가 두 사람을 변호합니다. 법정은 비율보다 도장을 먼저 봅니다.",
        },
        {
          label: "선명한 이름부터 써서 수사를 빨리 연다",
          effect: { time: 6, capital: 5, trust: -6, humanCost: 5, fatigue: -3 },
          voice: "위로 갈수록 흔적이 흐려 기다릴 수 없다며, 선명한 이름부터 써서 수사를 빨리 연다.",
          echo: "선명한 이름은 수사를 빠르게 엽니다. 가장 먼저 불려 가는 사람은 수습 3개월째입니다.",
        },
      ],
    },
  ],
  branchPlan: ["c8_gallery", 1, "c8_branch_ledger", "c8_branch_ledger_follow"],
  branchScenes: {
    // CASE 08's detour is the one place the trace points back into the lab: the
    // paintings were "entertainment", and one of the people entertained signed the
    // review box on 2023-0412. The case is about a grudge, so its side door is the
    // moment the grudge finds someone the player likes.
    c8_branch_ledger: {
      phase: "SIDE DOOR",
      title: "한서윤의 그림",
      speaker: "한서윤",
      text: "협력사 한 곳의 경비 장부에서 그림 구매가 '고객 접대비'로 처리돼 있습니다. 접대 상대 칸에 적힌 이름은 한서윤. 전화를 받은 그가 한참 말이 없다가 입을 엽니다. '그 그림, 제 사무실 벽에 3년째 걸려 있습니다. 승진 축하라고 받았어요. 그해에 제가 2023-0412 승인란 옆 검토란에 서명했습니다.'",
      memo: ["협력사 장부: 그림 구매를 접대비로 처리", "수령인: 한서윤 (당시 차장)", "같은 해 한서윤이 2023-0412 검토란에 서명", "한서윤은 그림을 스스로 반납하겠다고 함"],
      triggers: ["trust", "injustice", "affection"],
      choices: [
        {
          id: "c8_branch_ledger_a",
          label: "한서윤의 이름도 흔적표에 그대로 올린다",
          effect: { legitimacy: 11, trust: -7, humanCost: 4, fatigue: 5 },
          voice: "좋아하는 사람이라서 더 빼면 안 된다며, 한서윤의 이름도 흔적표에 올린다.",
          echo: "좋아하는 사람의 이름을 올리면 흔적표는 공정해집니다. 한서윤은 그날 처음으로 당신을 피하지 않습니다.",
          next: "c8_branch_ledger_follow",
          cognition: { inference: 2 },
        },
        {
          id: "c8_branch_ledger_b",
          label: "그가 스스로 신고할 시간을 준다",
          effect: { trust: 10, legitimacy: -4, time: -8, fatigue: 5 },
          voice: "스스로 말할 기회는 한 번 줘야 한다며, 신고할 시간을 준다.",
          echo: "스스로 말할 시간은 그를 증인으로 만듭니다. 그 시간 동안 흔적표에는 빈칸이 하나 남습니다.",
          next: "c8_branch_ledger_follow",
          cognition: { reframing: 2 },
        },
        {
          id: "c8_branch_ledger_c",
          label: "받은 사람이 아니라 준 쪽의 장부만 쓴다",
          effect: { capital: 7, time: 4, trust: 4, legitimacy: -6, humanCost: 3, fatigue: 2 },
          voice: "받은 사람보다 준 쪽이 설계자라며, 준 쪽의 장부만 쓴다.",
          echo: "준 쪽만 쓰면 설계는 드러납니다. 받은 쪽의 3년은 그림처럼 벽에 걸린 채 남습니다.",
          next: "c8_branch_ledger_follow",
          cognition: { risk: 1 },
        },
      ],
    },
    c8_branch_ledger_follow: {
      phase: "SIDE DOOR",
      title: "벽에서 내린 그림",
      speaker: "한서윤",
      text: "다음 날 아침, 한서윤이 포장한 그림을 들고 영동지점에 옵니다. 네 시간을 운전해 왔습니다. '제가 이걸 3년 동안 왜 못 내렸는지 아십니까. 좋아서요. 그림이 정말 좋아서.' 그가 처음으로 웃는데, 우는 얼굴과 구분이 되지 않습니다. 그림을 어디에 둘지가 남았습니다.",
      memo: ["한서윤 자진 신고서 초안 작성", "그림 감정가는 판매가의 6%", "지점 금고에 보관하면 증거물 관리 기록이 남음"],
      triggers: ["affection", "responsibility", "trust"],
      choices: [
        {
          id: "c8_branch_ledger_follow_a",
          label: "지점 금고에 증거물로 봉인한다",
          effect: { legitimacy: 10, trust: 4, capital: -6, time: -5, fatigue: 5 },
          voice: "좋은 그림이라서 더 정확히 다뤄야 한다며, 지점 금고에 봉인한다.",
          echo: "금고에 들어간 그림은 증거물 번호를 받습니다. 한서윤은 그 번호를 오래 기억할 겁니다.",
          next: "c8_bait",
          cognition: { persistence: 1, inference: 1 },
        },
        {
          id: "c8_branch_ledger_follow_b",
          label: "자진 신고서에 내 확인 서명을 함께 붙인다",
          effect: { trust: 12, legitimacy: 5, humanCost: -4, time: -9, fatigue: 7 },
          voice: "혼자 내게 두지 않겠다며, 자진 신고서에 내 확인 서명을 붙인다.",
          echo: "같이 서명하면 그는 혼자 신고한 사람이 아닙니다. 당신도 그 그림을 본 사람이 됩니다.",
          next: "c8_bait",
          cognition: { reframing: 3 },
        },
        {
          id: "c8_branch_ledger_follow_c",
          label: "그림은 돌려보내고 신고서만 받는다",
          effect: { time: 6, capital: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -3 },
          voice: "3년을 못 내린 그림에 증거물 기록까지 붙이지 않으려고, 그림은 돌려보내고 신고서만 받는다.",
          echo: "돌려보낸 그림은 다시 누군가의 벽에 걸립니다. 신고서 한 장은 그림보다 가볍습니다.",
          next: "c8_bait",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  routePlan: {
    start: "c8_start",
    result: "c8_aftershock",
    defaultFree: "c8_route_system",
    // Cases 06 and 07 have one person or one posting at their centre and no
    // four-way split. So does this one: it is one trail, followed by one grudge.
    choices: {},
    system: {
      route: "c8_route_system",
      final: "c8_final_system_route",
      title: "같은 주소의 일곱 법인",
      speaker: "에코",
      text: "해온파트너스 한 곳을 쫓는 대신 같은 주소를 쓴 회사가 더 있는지부터 묻자 법인 등기(회사의 주소와 대표를 나라 장부에 올린 기록) 이력이 열립니다. 해온파트너스와 같은 주소, 같은 세무 대리인(세금 신고를 대신해 주는 사무소), 같은 청산(회사를 정리해 없애는 절차) 시점을 가진 회사가 지난 6년간 일곱 곳입니다. 흔적은 한 줄이 아니라, 같은 손이 반복해서 그린 무늬였습니다.",
      memo: ["같은 주소·같은 세무 대리인 법인 7곳", "모두 감사 착수 직전에 청산", "일곱 번째가 해온파트너스"],
      routeChoices: [
        {
          id: "c8_route_system_map",
          label: "일곱 법인의 흐름을 한 장의 지도로 잇는다",
          effect: { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 },
          voice: "한 곳씩 보아서는 무늬가 안 보여서, 일곱 법인의 흐름을 한 장의 지도로 잇는다.",
          echo: "한 장으로 이으면 일곱 회사가 한 사람의 필체처럼 보입니다. 지도를 그리는 동안 청산 등기의 시계도 같이 갑니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c8_route_system_one",
          label: "지도는 접고 해온파트너스 한 곳만 판다",
          effect: { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 },
          voice: "사라진 여섯 곳은 이미 늦었다며, 지도는 접고 해온파트너스 한 곳만 판다.",
          echo: "한 곳만 파면 자료는 빨리 모입니다. 앞선 여섯 곳은 이번에도 서로 상관없는 회사로 남습니다.",
          cognition: { risk: 2 },
        },
        {
          id: "c8_route_system_agent",
          label: "일곱 곳을 만든 세무 대리인을 먼저 찾아간다",
          effect: { trust: 11, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 },
          voice: "같은 손이 누구 손인지 알아내려고, 일곱 곳을 만든 세무 대리인을 먼저 찾아간다.",
          echo: "찾아가면 세무 대리인은 일곱 곳 모두 의뢰받은 대로 했다고 말합니다. 누가 의뢰했는지는 그의 장부에 있습니다.",
          cognition: { reframing: 2 },
        },
      ],
      finalTitle: "일곱 번째 칸",
      finalText: "청산(회사를 정리해 없애는 절차) 등기까지 열 시간, 영동지점 단말에는 같은 주소와 같은 세무 대리인을 쓴 법인 일곱 곳이 한 줄로 서 있습니다. 앞선 여섯 곳은 감사가 시작되기 직전에 사라졌고, 일곱 번째인 해온파트너스가 같은 길에 올라 있습니다. 에코는 날짜 일곱 개를 세로로 늘어놓습니다. '여섯 번은 아무도 이어 보지 않았습니다. 일곱 번째는 지금 당신 화면에 있습니다.'",
      finalMemo: ["같은 주소·같은 세무 대리인 법인 7곳", "앞선 여섯 곳: 감사 착수 직전에 정리됨", "해온파트너스 청산 등기까지 10시간"],
    },
    finalChoices: [
      {
        id: "a",
        label: "일곱 법인을 하나의 무늬로 묶어 외부에 낸다",
        effect: { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 },
        voice: "앞선 여섯 번처럼 끊겨 보이지 않게, 일곱 법인을 하나의 무늬로 묶어 외부에 낸다.",
        echo: "무늬로 묶이면 해온파트너스는 사건이 아니라 일곱 번째 사례가 됩니다. 받는 쪽은 첫 번째부터 다시 읽어야 합니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "해온파트너스 한 건만 남기고 나머지는 덮는다",
        effect: { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 },
        voice: "열 시간 안에 막을 수 있는 건 하나라며, 해온파트너스 한 건만 남기고 나머지는 덮는다.",
        echo: "한 건만 남기면 설명은 짧아집니다. 같은 손이 여덟 번째 회사를 만들 때 막아설 기록은 없습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "무늬의 마지막 칸에 내 조회 기록을 남긴다",
        effect: { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 },
        voice: "이번에는 이어 본 사람이 있었음을 알리려고, 무늬의 마지막 칸에 내 조회 기록을 남긴다.",
        echo: "조회 기록을 남기면 이 무늬를 본 사람이 있었다는 사실이 남습니다. 그 사람이 누구인지도 함께 남습니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c8_evidence_turn",
    result: "c8_aftershock",
    sourceRoutes: ["c8_trail", "c8_gallery", "c8_bait", "c8_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "자문료 입금일을 단서와 한 달력에 겹쳐, 돈이 움직인 날과 승인이 난 날의 간격을 잰다.",
    entryEcho: "간격을 재면 자문료는 수수료가 아니라 승인의 영수증이 됩니다.",
    title: "입금일과 승인일",
    speaker: "반재욱",
    text: "단서를 달력에 겹치자 규칙이 보입니다. 해온파트너스에 자문료가 들어온 열두 번의 날짜는 전부 KD은행이 노바웍스와 브릿지은행 쪽에 유리한 승인을 낸 다음 영업일입니다. 3년 전 2023-0412의 담보 순위(돈을 떼일 때 누가 먼저 돌려받느냐의 순서)가 브릿지은행으로 넘어간 날도 그중 하나입니다.",
    memo: ["입금 12회 = 승인 다음 영업일 12회", "2023-0412 담보 순위 변경일 포함", "우연으로 설명하기 어려운 일치"],
    triggers: ["injustice", "revenge", "system"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      {
        id: "c8_evidence_turn_calendar",
        label: "달력 한 장으로 만들어 수사 의뢰서 첫 장에 붙인다",
        effect: { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 },
        voice: "열두 번의 입금일을 달력 한 장에 찍어, 수사 의뢰서 첫 장에 붙인다.",
        echo: "달력 한 장은 긴 설명보다 강합니다. 열두 번의 우연은 누구도 우연이라고 부르지 못합니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c8_evidence_turn_hold",
        label: "달력은 쥐고 있다가 협상 자리에서 꺼낸다",
        effect: { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 },
        voice: "이 달력은 협상장에서 꺼낼 카드라며, 지금은 접어 둔다.",
        echo: "접어 둔 달력은 협상을 유리하게 합니다. 그 사이 담보에서 밀려난 사람들은 이유를 모른 채 기다립니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c8_evidence_turn_share",
        label: "담보 순위에서 밀려난 채권자들에게 먼저 알린다",
        effect: { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 },
        voice: "담보 순위에서 밀려난 채권자들에게, 이 달력부터 보여 준다.",
        echo: "채권자들이 달력을 보면 흔적표는 혼자가 아닙니다. 소문도 그만큼 빨리 퍼집니다.",
        cognition: { reframing: 2 },
      },
    ],
    entryLabel: "입금일과 승인일을 달력 한 장에 겹친다",
  },
  memoryPlan: {
    systemNext: "c8_route_system",
    evidenceNext: "c8_evidence_turn",
    systemLabel: "발령 앞에서 다시 짠 판이 법인 등기 서류에 흔적을 남겼는지 더듬는다",
    evidenceLabel: "먼저 쓰인 발령서의 작성일을 자문료 입금일과 나란히 적는다",
    systemEcho: "더듬어도 등기 서류에는 당신의 판이 없습니다. 대신 같은 주소를 쓴 법인들의 이력이 줄줄이 열립니다.",
    evidenceEcho: "나란히 적으면 자문료가 들어온 날과 승인이 난 날이 달력 위에서 하루 차이로 붙습니다.",
  },
  openingRoutes: {
    c7_after_stand: "c8_start_stand",
    c7_after_open: "c8_start_open",
    c7_after_alone: "c8_start_alone",
  },
  openingCopy: {
    c8_start_stand: ["사람을 먼저 찾은 사람의 지점", "도윤하", "당신은 떠나기 전 이름을 올린 사람들을 한 명씩 만났습니다. 그중 셋이 영동지점으로 안부 문자를 보냅니다. 그리고 부임 9일째, 휴면 계좌(오래 거래가 끊긴 계좌) 목록에서 이상한 법인 하나가 눈에 걸립니다.", ["이름을 올린 사람들과 연락이 이어짐", "해온파트너스 계좌에서 이상 흐름 발견", "법인 청산 등기까지 72시간"]],
    c8_start_open: ["기차를 타지 않은 사람의 첫 출근", "나준혁", "당신은 06시 40분 기차에 없었고, 이틀 늦게 버스로 내려왔습니다. 지점장은 지각을 묻지 않고 자리를 내줍니다. 외부 감사인(회사 장부를 바깥에서 검사하는 회계사)에게 넘긴 원본은 아직 답이 없고, 대신 이 지점의 휴면 계좌(오래 거래가 끊긴 계좌) 하나가 답을 합니다.", ["지각 부임 기록이 인사 파일에 남음", "외부 감사인 회신 대기 중", "해온파트너스 계좌에서 이상 흐름 발견"]],
    c8_start_alone: ["조용히 내려온 사람의 창구", "에코", "당신은 아무에게도 알리지 않고 내려왔습니다. 아무도 연락하지 않았고, 그래서 아무도 당신이 무엇을 보는지 모릅니다. 이번에는 그 조용함이 무기가 됩니다. 휴면 계좌(오래 거래가 끊긴 계좌) 목록의 한 줄이 그 무기를 쓸 곳을 가리킵니다.", ["아무도 당신의 조회를 예상하지 않음", "해온파트너스 계좌에서 이상 흐름 발견", "혼자 쥔 자료는 증거 보관 기록이 없음"]],
  },
  openingSignatures: {
    c8_start_stand: {
      label: "안부 문자를 보낸 세 사람에게 계좌 추적을 도와 달라고 한다",
      effect: { trust: 11, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
      cognition: { reframing: 2 },
      voice: "도와준 사람에게 또 부탁하는 게 염치없다는 걸 알면서, 세 사람에게 답장을 쓴다.",
      echo: "두 번째 부탁은 첫 번째보다 무겁습니다. 받아 주는 사람은 이번에는 당신이 무엇을 쫓는지 압니다.",
    },
    c8_start_open: {
      label: "외부 감사인에게 넘긴 원본에 이 계좌를 추가 자료로 붙인다",
      effect: { legitimacy: 12, trust: 4, capital: -7, time: -4, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "이미 열어 둔 감사 경로에, 계좌 내역을 추가 자료로 이어 붙인다.",
      echo: "같은 경로로 두 번째 자료가 가면 감사인은 우연을 의심하지 않습니다. 보내는 사람의 이름도 두 번 기록됩니다.",
    },
    c8_start_alone: {
      label: "아무에게도 말하지 않고 청산 전 마지막 입출금을 지켜본다",
      effect: { capital: 9, legitimacy: 4, trust: -6, humanCost: 3, time: -3, fatigue: 4 },
      cognition: { risk: 2 },
      voice: "아무도 모르게, 청산 전에 마지막으로 돈이 움직이는 순간을 기다린다.",
      echo: "지켜보는 사람이 없다고 믿는 돈은 가장 솔직하게 움직입니다. 그 순간을 본 사람도 당신 하나뿐입니다.",
    },
  },
  setting: { place: "KD은행 강원 영동지점", clock: "청산 등기까지 72h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 08
    c8_start: {
      place: "KD은행 강원 영동지점 · 기업대출 창구",
      clock: "청산 등기까지 72h",
      question: "세 번 반려된 계좌가 72시간 뒤 청산됩니다. 이 한 줄을 어떻게 붙잡겠습니까?",
      lead: "오후 세 시, 창구 앞이 텅 빈 지점입니다. 오래 거래가 끊긴 계좌 목록의 한 줄이 분기마다 서울로 돈을 보내고 있습니다.",
    },
    c8_start_stand: {
      place: "KD은행 강원 영동지점 · 기업대출 창구",
      clock: "청산 등기까지 72h",
      question: "안부를 보내 온 사람들이 있고, 계좌는 72시간 뒤 사라집니다. 이 한 줄을 어떻게 붙잡겠습니까?",
      lead: "떠나기 전 한 명씩 만난 사람들 중 셋이 지점으로 문자를 보냈습니다. 그리고 휴면 계좌(오래 거래가 끊긴 계좌) 목록에서 이상한 법인이 눈에 걸립니다.",
    },
    c8_start_open: {
      place: "KD은행 강원 영동지점 · 기업대출 창구",
      clock: "청산 등기까지 72h",
      question: "원본은 감사인에게 갔지만 돈은 아직 이 창구를 지나갑니다. 이 한 줄을 어떻게 붙잡겠습니까?",
      lead: "기차 대신 이틀 늦은 버스로 내려왔습니다. 지점장은 지각을 묻지 않았고, 휴면 계좌(오래 거래가 끊긴 계좌) 하나가 대신 말을 겁니다.",
    },
    c8_start_alone: {
      place: "KD은행 강원 영동지점 · 기업대출 창구",
      clock: "청산 등기까지 72h",
      question: "아무도 당신이 무엇을 보는지 모릅니다. 조용히 발견한 이 한 줄을 어떻게 쓰겠습니까?",
      lead: "아무에게도 알리지 않고 내려온 지점입니다. 연락 오는 사람이 없으니, 휴면 계좌(오래 거래가 끊긴 계좌) 목록을 끝까지 읽을 시간이 있었습니다.",
    },
    c8_trail: {
      place: "KD은행 강원 영동지점 · 기업대출 담당석",
      clock: "청산 등기까지 64h",
      question: "갤러리와 펜션이 윤상혁의 가족 이름으로 이어집니다. 어디까지 따라가겠습니까?",
      lead: "사직서가 수리된 오진우가 영상통화를 걸어 옵니다. 그의 방 벽에는 A4 네 장이 붙어 있습니다.",
    },
    c8_sundae: {
      place: "강릉 중앙시장 · 오징어순대 골목",
      clock: "청산 등기까지 60h",
      question: "지점장이 영수증 뒷면에 전임자의 번호를 적어 줍니다. 이 번호를 언제 쓰겠습니까?",
    },
    c8_sundae_reaction: {
      place: "KD은행 강원 영동지점 · 지점장실",
      clock: "청산 등기까지 58h",
      question: "전임자는 세 번 올리고 네 번째를 포기했습니다. 그의 목소리를 어떻게 남기겠습니까?",
    },
    c8_gallery: {
      place: "청담동 갤러리 온 · 전시장",
      clock: "청산 등기까지 50h",
      question: "무명 작가의 소품 열두 점이 점당 1억 2천에 팔렸습니다. 이 그림값을 어떻게 증거로 만들겠습니까?",
      lead: "새벽 버스로 서울에 올라왔습니다. 반재욱은 사표가 수리된 뒤에도 수첩을 들고 먼저 와 있습니다.",
    },
    c8_branch_ledger: {
      place: "청담동 갤러리 온 · 전시장",
      clock: "청산 등기까지 47h",
      question: "그림을 받은 사람 칸에 한서윤의 이름이 있습니다. 이 이름을 흔적표에 어떻게 적겠습니까?",
    },
    c8_branch_ledger_follow: {
      place: "KD은행 강원 영동지점 · 객장",
      clock: "청산 등기까지 40h",
      question: "한서윤이 네 시간을 운전해 그림을 들고 왔습니다. 이 그림을 어디에 두겠습니까?",
    },
    c8_mother: {
      place: "트리거랩 1층 로비",
      clock: "청산 등기까지 44h",
      question: "오진우의 어머니는 아들이 회사를 그만둔 걸 모릅니다. 도윤하에게 뭐라고 전하게 하겠습니까?",
    },
    c8_mother_reaction: {
      place: "트리거랩 4층 · 탕비실",
      clock: "청산 등기까지 42h",
      question: "계란말이가 든 반찬통이 탕비실에 있습니다. 이 반찬통을 어떻게 하겠습니까?",
    },
    c8_bait: {
      place: "경포 해온 펜션 · 관리동",
      clock: "청산 등기까지 30h",
      question: "소문을 흘리면 돈이 급히 움직여 흔적이 선명해집니다. 미끼를 놓겠습니까?",
      lead: "펜션 관리동 불은 꺼져 있고, 주차장에 서울 번호판 차 한 대가 서 있습니다. 오진우가 계획을 꺼냅니다.",
    },
    c8_clerks: {
      place: "청담동 갤러리 온 · 뒷골목",
      clock: "청산 등기까지 20h",
      question: "송금 서류에 도장을 찍은 사람은 스물여섯, 스물아홉 살 직원입니다. 이 둘을 어떻게 다루겠습니까?",
    },
    c8_clerks_reaction: {
      place: "청담동 갤러리 온 · 뒷골목",
      clock: "청산 등기까지 18h",
      question: "흔적표에서 가장 선명한 이름이 가장 적게 받은 사람입니다. 이 순서를 어떻게 하겠습니까?",
    },
    c8_route_system: {
      place: "KD은행 강원 영동지점 · 법인 등기 단말",
      clock: "청산 등기까지 16h",
      question: "같은 주소와 세무 대리인을 쓴 법인이 일곱 곳입니다. 이 무늬를 어디까지 열겠습니까?",
    },
    c8_final_system_route: {
      place: "KD은행 강원 영동지점 · 법인 등기 단말",
      clock: "청산 등기까지 10h",
      question: "일곱 번째 법인이 몇 시간 뒤 사라집니다. 이 무늬를 어떻게 닫겠습니까?",
    },
    c8_evidence_turn: {
      place: "KD은행 강원 영동지점 · 숙직실",
      clock: "청산 등기까지 8h",
      question: "자문료 입금일이 모두 승인 다음 영업일입니다. 이 달력을 어떻게 쓰겠습니까?",
    },
    c8_final: {
      place: "경포 방파제",
      clock: "청산 등기까지 5h",
      question: "흔적표는 완성됐고 오진우는 자신이 누구와 다른지 묻습니다. 이 칼을 누구 손에 쥐여 주겠습니까?",
      lead: "새벽 방파제에서 오진우가 파일을 쥐고 서 있습니다. 바다 쪽에서 첫 배가 들어옵니다.",
    },
    c8_aftershock: {
      place: "강릉 중앙시장 · 오징어순대집",
      clock: "청산 등기 다음 날",
      question: "지점장이 30년 만에 도장을 꺼냅니다. 흔적표를 어디로 가져가겠습니까?",
    },
  },
  clue: {
    id: "c8-painting-dates",
    title: "그림값의 날짜",
    text: "그림값을 작품이 아니라 승인 일정으로 나누면 딱 떨어집니다. 이 갤러리는 그림을 판 것이 아니라 날짜를 팔았습니다.",
  },
  outcomes: {
    c8_after_law: { tag: "칼을 법에 맡긴 결말", title: "30년 만에 꺼낸 도장이 흔적표에 찍혔다", text: "복수는 느려졌고 증거는 단단해졌습니다. 오진우는 그 느림을 견디기 어려워했지만, 흔적표에는 이제 반박할 틈이 없습니다." },
    c8_after_friend: { tag: "친구를 찾은 결말", title: "흔적표보다 먼저 오진우의 문을 두드렸다", text: "고시원 문이 열렸고 둘은 국밥을 먹었습니다. 칼은 아직 아무도 쓰지 않았고, 오진우는 처음으로 복수 말고 다른 계획을 말했습니다." },
    c8_after_blade: { tag: "칼을 혼자 쥔 결말", title: "흔적표를 혼자 쥐고 기다렸다", text: "아무도 당신이 무엇을 가졌는지 모릅니다. 가장 강한 패를 쥐었지만, 그 패를 쓴 이유를 증언해 줄 사람도 없습니다." },
  },
  carryovers: {
    c8_after_law: { legitimacy: 10, capital: -5, fatigue: 6 },
    c8_after_friend: { trust: 9, humanCost: -3, fatigue: 7 },
    c8_after_blade: { capital: 7, trust: -10, legitimacy: -4 },
  },
  continuityChallenges: {
    c7_after_stand: { id: "protect-trust", title: "도와준 사람을 흔적에 묻히지 않기", text: "이름을 올려 준 사람들에게 다시 부탁하게 됩니다. 그들의 이름을 흔적표의 피해자로 만들지 않는 선택을 찾아야 합니다." },
    c7_after_open: { id: "find-cost", title: "원본 뒤에 남은 돈 찾기", text: "원본은 감사인에게 갔지만 돈은 아직 움직입니다. 원본이 비껴간 흐름을 찾으면 숨은 단서가 열릴 수 있습니다." },
    c7_after_alone: { id: "repair-legitimacy", title: "혼자 본 것을 증거로 만들기", text: "아무도 모르게 내려온 조용함은 무기이자 약점입니다. 혼자 본 흔적을 공정한 기록으로 바꾸는 선택이 압박을 낮춥니다." },
  },
};
