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
        next: "c8_trail",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c8_start_copy",
        label: "조회 기록 없이 거래 내역만 따로 떠 둔다",
        effect: { time: 6, capital: 5, legitimacy: -8, humanCost: 3, fatigue: 3 },
        next: "c8_trail",
        cognition: { risk: 2 },
      },
      {
        id: "c8_start_ask",
        label: "지점장에게 반려된 세 번의 경위부터 묻는다",
        effect: { trust: 10, legitimacy: 3, time: -9, fatigue: 5 },
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
        next: "c8_gallery",
        cognition: { inference: 2 },
      },
      {
        id: "c8_trail_family",
        label: "가족 명의 재산까지 전부 목록에 올린다",
        effect: { legitimacy: 5, capital: 6, trust: -9, humanCost: 7, fatigue: 3 },
        next: "c8_gallery",
        cognition: { risk: 2 },
      },
      {
        id: "c8_trail_split",
        label: "오진우의 자료와 내 자료를 섞지 않고 따로 둔다",
        effect: { trust: 8, legitimacy: 6, capital: -5, time: -10, fatigue: 6 },
        next: "c8_gallery",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c8_gallery",
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
        next: "c8_bait",
        cognition: { inference: 2 },
      },
      {
        id: "c8_gallery_buyers",
        label: "그림을 산 협력사 담당자를 한 명씩 찾아간다",
        effect: { trust: 7, legitimacy: 5, humanCost: 6, time: -8, fatigue: 6 },
        next: "c8_bait",
        cognition: { persistence: 2 },
      },
      {
        id: "c8_gallery_note",
        label: "반재욱의 수첩 기록을 그대로 증언으로 받는다",
        effect: { trust: 11, humanCost: -4, legitimacy: -3, time: -4, fatigue: 4 },
        next: "c8_bait",
        cognition: { reframing: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c8_bait",
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
        next: "c8_final",
        cognition: { risk: 2 },
      },
      {
        id: "c8_bait_stop",
        label: "오진우를 말리고 청산 전에 법원에 보전 신청을 낸다",
        effect: { legitimacy: 12, trust: -5, capital: -9, time: -7, fatigue: 5 },
        next: "c8_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c8_bait_listen",
        label: "계획은 멈추고 오진우의 이야기부터 끝까지 듣는다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -11, fatigue: 6 },
        next: "c8_final",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c8_final",
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
        next: "case08_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c8_final_lever",
        label: "흔적표를 쥐고 채권단 협상의 지렛대로 쓴다",
        effect: { capital: 12, trust: 6, humanCost: -6, legitimacy: -8, fatigue: 5 },
        next: "case08_result",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "c8_final_press",
        label: "오진우가 원하는 대로 탐사보도에 먼저 넘긴다",
        effect: { trust: 10, legitimacy: 6, humanCost: 9, capital: -6, fatigue: 3 },
        next: "case08_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case08_result",
      },
    ],
  },
};
