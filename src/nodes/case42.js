/**
 * CASE 42 -- the vacation, and the game's question asked out loud.
 *
 * A week after the second hearing, where 윤상혁 said "I do not remember"
 * twenty-three times, 나준혁 stamps a "vacation order" and books the whole cast
 * into a pension on 경포 beach for the fireworks festival. He booked it on
 * purpose: it is the old 해온 펜션 from 사건 08, the address the consulting-fee
 * shell used, since liquidated and sold at auction to 여다인 -- a former contract
 * teller from his own 영동 branch who put her mother's savings and a KD캐피탈
 * business loan into a house with a sea view. His joke is that paying full price
 * to sleep where their money used to run is the cleanest revenge there is.
 *
 * The case is mostly joy on purpose: a parasol that lasts four minutes, a
 * dialect karaoke hundred, a swimming race won by the one person the group has
 * put on indefinite standby. Then, at 19:04 on a Friday, an automated notice
 * tells 여다인 her loan will be called early. She has never missed a payment.
 * The machine did not score her; it scored her address. The night on the
 * breakwater is where the season answers its own question head-on -- each
 * person says what kept them from stopping (to win, fear, 1,140 people, the
 * faces at the counter, the second cup of ramen, shame) and the analyst has to
 * say theirs. At dawn the board tables 윤상혁's dismissal, and its briefing
 * counts the forty-seven addresses he once touched as "risk cleared". Cutting
 * one man off is being paid for, again, by the people at the edge of the chain.
 */
export const case42Nodes = {
  c42_start: {
    phase: "CASE 42 BRIEFING",
    title: "빈 승인란의 휴가",
    speaker: "나준혁",
    text:
      "두 번째 청문회가 끝나고 엿새째 저녁, KD캐피탈 위험관리부. 금요일 하루 휴가를 낸 신청서가 나흘째 승인 화면에 떠 있습니다. 팀장 승인, 부서장 승인, 그리고 마지막 칸 '대표이사'. 직원 휴가가 대표 책상까지 올라간 건 이 회사에서 당신이 처음이고, 그 칸은 아직 비어 있습니다. 그때 단체방에 사진 한 장이 올라옵니다. A4 한 장에 붓펜으로 쓴 '휴가 명령서', 그 아래 빨간 도장 세 개. 나준혁입니다. '경포 불꽃축제 앞 펜션 잡았어요. 방 넷, 이불 열두 채. 기억 안 난다는 사람을 스물세 번 보느라 다들 얼굴이 반쪽이야. 명령입니다. 도장 찍었어요.'",
    memo: [
      "휴가 승인선: 팀장 → 부서장 → 대표이사 윤상혁",
      "대표이사 칸 나흘째 빈칸 -- 승인도 반려도 아님",
      "나준혁의 '휴가 명령서': 도장 세 개, 참석 요청 아홉 명",
      "경포 불꽃축제: 내일 21시, 펜션에서 걸어서 6분",
    ],
    triggers: ["affection", "injustice", "choice"],
    choices: [
      {
        id: "c42_start_go",
        label: "승인이 없어도 동료들과 경포로 떠난다",
        effect: { trust: 11, humanCost: -4, legitimacy: -4, capital: -3, time: -5, fatigue: 4 },
        next: "c42_pension",
        cognition: { reframing: 2 },
      },
      {
        id: "c42_start_ask",
        label: "빈 승인란의 경위를 인사팀에 공식으로 묻는다",
        effect: { legitimacy: 10, time: -4, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c42_pension",
        cognition: { inference: 2 },
      },
      {
        id: "c42_start_laptop",
        label: "노트북을 챙겨 휴가지에서도 업무를 받겠다고 한다",
        effect: { capital: 8, time: 5, trust: -4, legitimacy: -3, humanCost: 2, fatigue: 2 },
        next: "c42_pension",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c42_pension",
      },
    ],
  },
  c42_pension: {
    phase: "THE PENSION",
    title: "주소가 같은 집",
    speaker: "권도현",
    text:
      "금요일 정오, 경포 해변에서 두 블록 들어간 '물결스테이'. 흰 벽은 새로 칠했고 마당에 튜브 여섯 개가 걸려 있습니다. 서른두 살 사장 여다인이 방 열쇠 넷을 건네며 웃습니다. '축제 날 만실은 처음이에요.' 숙박 명부에 서명하던 권도현의 펜이 멈춥니다. 도로명 주소가 그가 외우는 주소입니다. 작년 영동지점 시절 당신이 쫓던 해온 펜션, 윤상혁의 처남이 가졌던 집, 자문료(조언값이라며 오간 돈)가 서울 갤러리로 빠져나가던 회사의 등록 주소. 그 회사가 청산(회사를 정리해 없애는 절차)된 뒤 집은 경매(빚을 못 갚은 사람의 재산을 법원이 공개 입찰로 파는 절차)로 넘어갔습니다. 나준혁이 믹스커피를 한 잔 더 탑니다. '알고 잡았어요. 그 사람들 돈 흐르던 집에 우리가 제값 내고 자 주는 거, 이게 제일 깔끔한 복수 아닙니까.'",
    memo: [
      "물결스테이: 옛 해온 펜션, 경매로 여다인이 낙찰",
      "여다인: 전 KD은행 영동지점 창구 계약직, 32세",
      "낙찰 자금 일부: KD캐피탈 사업자 대출",
      "오늘 밤 만실 -- 문을 연 뒤 처음",
    ],
    triggers: ["curiosity", "revenge", "affection"],
    choices: [
      {
        id: "c42_pension_tell",
        label: "여다인에게 이 집의 지난 주인을 솔직히 알려 준다",
        effect: { trust: 10, legitimacy: 3, humanCost: 2, time: -4, fatigue: 5 },
        next: "c42_karaoke",
        cognition: { persistence: 2 },
      },
      {
        id: "c42_pension_check",
        label: "말하기 전에 등기부와 경매 기록부터 확인한다",
        effect: { legitimacy: 10, time: -6, trust: -2, humanCost: 3, fatigue: 3 },
        next: "c42_karaoke",
        cognition: { inference: 2 },
      },
      {
        id: "c42_pension_rest",
        label: "오늘은 휴가라며 주소 이야기는 꺼내지 않는다",
        effect: { time: 5, capital: 4, trust: -4, humanCost: 3, fatigue: -6 },
        next: "c42_karaoke",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c42_karaoke",
      },
    ],
  },
  c42_karaoke: {
    phase: "KARAOKE",
    title: "영동 사투리 100점",
    speaker: "나준혁",
    text:
      "저녁 일곱 시, 해변 앞 골목 노래방 5번 방. 나준혁이 트로트 한 곡을 영동 사투리로 바꿔 부릅니다. '마카 여 모이래요, 우터 이래 좋드래요.' 화면 가사와 한 글자도 안 맞는데 점수는 100점입니다. 오진우가 같은 곡을 세 번 불러 97점, 94점, 91점을 받고 기계를 의심합니다. 권도현은 '한 곡에 500원, 오진우 씨는 1,500원 적자입니다'를 외치고, 강태민의 탬버린은 끝내 박자를 못 찾습니다. 그때 당신 휴대폰이 웁니다. 여다인이 보낸 캡처, KD캐피탈 명의 문자, 발송 19시 04분. '고객님의 대출은 내부 기준에 따라 조기 회수(만기 전에 빌려준 돈을 한꺼번에 돌려받는 것) 대상으로 분류되었습니다.' 금요일 저녁 일곱 시에, 사람이 보낸 문자가 아닙니다.",
    memo: [
      "나준혁 100점 -- 사투리 개사, 가사 일치 0%",
      "오진우 세 번 연속 도전, 점수는 매번 하락",
      "KD캐피탈 문자 19:04 -- 업무 종료 뒤 자동 발송",
      "사유: '내부 기준' 외 설명 없음",
    ],
    triggers: ["injustice", "competition", "protection"],
    choices: [
      {
        id: "c42_karaoke_run",
        label: "노래방을 나와 여다인에게 곧장 달려간다",
        effect: { trust: 11, humanCost: -5, time: -5, capital: -2, fatigue: 5 },
        next: "c42_breakwater",
        cognition: { persistence: 2 },
      },
      {
        id: "c42_karaoke_basis",
        label: "회수 분류의 '내부 기준'이 무엇인지 문서로 요구한다",
        effect: { legitimacy: 11, trust: 2, time: -6, humanCost: 3, fatigue: 4 },
        next: "c42_breakwater",
        cognition: { inference: 2 },
      },
      {
        id: "c42_karaoke_call",
        label: "당직 직원에게 전화해 내 권한으로 발송을 멈춘다",
        effect: { capital: 6, time: 5, trust: 3, legitimacy: -6, humanCost: -2, fatigue: -2 },
        next: "c42_breakwater",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c42_breakwater",
      },
    ],
  },
  c42_breakwater: {
    phase: "FIREWORKS",
    title: "못 멈춘 이유",
    speaker: "도윤하",
    text:
      "밤 아홉 시, 경포 방파제 아래 모래사장. 첫 불꽃이 올라가고 바다 위로 금색 가루가 쏟아집니다. 강태민이 보온병을 꺼내 컵라면 열 개에 물을 붓습니다. 나준혁이 수첩을 펴며 불꽃 소리 사이로 말합니다. '한 명씩 해 봅시다. 뭐 때문에 못 멈췄는지. 내가 받아 적을게요.' 오진우가 먼저입니다. '이기고 싶어서요. 아직도요. 창피하지만.' 이민서는 짧습니다. '무서워서요. 무서우면 오히려 눈이 떠져요.' 권도현은 처음으로 계산 없이 말합니다. '1,140명. 제 아버지 회사 사람들.' 도윤하는 창구에서 자기가 대출을 판 사람들의 얼굴이라고 하고, 강태민은 '두 번째 컵라면'이라고만 합니다. 불꽃이 잠깐 끊긴 사이, 모두가 당신을 봅니다. 청문회에서도 한 번 받지 못한 질문입니다.",
    memo: [
      "경포 불꽃축제 본 행사 21:00~21:40",
      "오진우 이기고 싶어서, 이민서 무서워서, 권도현 1,140명",
      "도윤하 창구의 얼굴들, 강태민 두 번째 컵라면",
      "남은 차례: 당신, 그리고 한서윤",
    ],
    triggers: ["selfAwareness", "affection", "revenge"],
    choices: [
      {
        id: "c42_breakwater_faces",
        label: "반대 의견 뒤에 있던 사람들 얼굴 때문이라고 말한다",
        effect: { trust: 12, humanCost: -4, legitimacy: -2, time: -3, fatigue: 5 },
        next: "c42_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c42_breakwater_duty",
        label: "내가 쓴 반대 의견을 끝까지 책임지고 싶었다고 말한다",
        effect: { legitimacy: 10, trust: 4, time: -4, humanCost: 2, fatigue: 4 },
        next: "c42_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c42_breakwater_win",
        label: "윤상혁을 이기고 싶었다고 솔직하게 말한다",
        effect: { capital: 5, trust: 4, time: 3, legitimacy: -5, humanCost: 3, fatigue: -3 },
        next: "c42_final",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c42_final",
      },
    ],
  },
  c42_final: {
    phase: "FINAL DECISION",
    title: "새벽 5시 40분의 전화",
    speaker: "백아린",
    text:
      "새벽 5시 40분, 경포 해변. 밤을 새운 사람들이 모래 위에서 해를 기다립니다. 전화가 옵니다. 백아린입니다. '이사회가 윤상혁 대표를 자리에서 물러나게 하는 안건을 올렸어요. 9월 7일 월요일이에요.' 오진우가 두 팔을 들다가 그의 다음 말에 멈춥니다. 백아린이 안건 설명 자료의 마지막 문장을 읽어 줍니다. '해임과 함께 관련 위험 자산 정리 완료.' '그 정리 대상이 마흔일곱 곳이에요. 물결스테이도 들어 있어요.' 그가 숨을 고릅니다. '사외이사(회사 밖에서 와서 경영을 감시하는 이사) 두 분이 당신 의견서를 받고 싶대요. 오늘 자정까지요.' 관리동에서 여다인이 해장국 냄비를 들고 나옵니다. 그는 아직 이 전화 내용을 모릅니다.",
    memo: [
      "이사회: 9월 7일 월요일, 안건 윤상혁 해임",
      "설명 자료: '관련 위험 자산 정리 완료' -- 대상 47곳",
      "사외이사 2명 의견서 요청, 기한 오늘 자정",
      "47곳 중 연체 이력 없는 곳 39곳",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c42_final_stay",
        label: "서울보다 먼저 여다인의 회수 분류부터 멈추고 간다",
        effect: { trust: 11, humanCost: -5, legitimacy: 3, capital: -4, time: -6, fatigue: 6 },
        next: "case42_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c42_final_attach",
        label: "해임안에 마흔일곱 곳의 회수 중단을 함께 올리라고 요구한다",
        effect: { legitimacy: 13, trust: 6, capital: -7, time: -7, humanCost: 2, fatigue: 6 },
        next: "case42_result",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c42_final_push",
        label: "마흔일곱 곳은 빼고 해임 찬성 의견서만 오늘 보낸다",
        effect: { capital: 10, time: 6, legitimacy: 4, trust: -5, humanCost: 5, fatigue: -3 },
        next: "case42_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case42_result",
      },
    ],
  },
};

/**
 * Everything else case 42 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case42 = {
  id: "case42",
  nodes: case42Nodes,
  aftermath: {
    c42_aftershock: {
      phase: "AFTERMATH",
      title: "방명록 첫 장",
      speaker: "여다인",
      text: "아침 여섯 시 반, 물결스테이 마당. 튜브 여섯 개가 빨랫줄에서 마르고, 강태민이 단체 사진을 찍겠다며 삼각대를 세웁니다. 여다인이 방명록을 내밉니다. 첫 장에 나준혁이 도장 세 개를 찍고, 강태민은 '또 옴' 두 글자를 쓰고, 권도현은 숙박비 정산표를 붙입니다. 오진우는 부표 재경기 날짜를 적어 두고, 한서윤은 자기 이름 옆에 작은 메달을 그립니다. 여다인이 방명록을 덮으며 말합니다. '이 집 지난 주인이 누군지 이제 알아요. 그래도 여기서 좋은 사람들이 잤다는 것도 알아요.' 휴대폰에는 백아린의 문자가 쌓이고, 서울행 첫 기차는 7시 2분입니다.",
      memo: ["서울행 첫 기차 07:02, 다음 기차 12:10", "방명록 첫 장: 도장 세 개, '또 옴', 숙박비 정산표", "사외이사 의견서 기한: 오늘 자정", "이사회: 9월 7일 월요일, 윤상혁 해임안"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c42_after_warm", label: "단체 사진을 찍고 낮 기차까지 동료들과 바다에 남는다", effect: { trust: 12, humanCost: -5, time: -4, capital: -2, fatigue: -8 }, next: "case42_result", cognition: { reframing: 2 } },
        { id: "c42_after_record", label: "그 밤의 대답과 마흔일곱 곳을 기차에서 문서로 남긴다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case42_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c42_after_rush", label: "단체 사진도 찍기 전에 첫 기차로 서울에 간다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 4, fatigue: 6 }, next: "case42_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c42_final", "c42_aftershock"],
  connectiveScenes: [
    ["c42_buoy", "c42_pension", "c42_karaoke", "부표까지 200미터", "오진우", "오후 두 시, 백사장. 권도현이 파라솔 대여료를 계산합니다. '세 시간 넘으면 사는 게 이득입니다.' 그가 편의점에서 파라솔을 사 오고, 그 파라솔은 꽂은 지 4분 만에 바람에 날아가 강태민이 스무 걸음을 뛰어 잡아 옵니다. 나준혁은 1990년대 꽃무늬 수영복 차림으로 '나는 심판'이라며 튜브에 눕습니다. 오진우가 수경을 쓰며 부표를 가리킵니다. '저기 먼저 닿는 사람이 저녁 메뉴 정하기.' 출발 신호와 함께 그가 튀어 나가고, 한서윤이 말없이 따라 들어갑니다. 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 다섯 달째인 사람이 물속에서는 누구보다 빠릅니다.", ["파라솔 구입비 1만 9천 원 -- 사용 시간 4분", "부표까지 약 200미터, 안전요원 깃발 구역 안", "한서윤: 대기발령 다섯 달째"], ["한서윤을 따라 부표까지 같이 헤엄쳐 간다", "안전요원 깃발 구역부터 확인하고 해변에 남는다", "파라솔 그늘에 누워 한 시간 푹 잔다"]],
    ["c42_ledger", "c42_karaoke", "c42_breakwater", "낙찰 영수증", "여다인", "펜션 관리동, 형광등 아래 여다인이 파일철을 폅니다. 법원 낙찰 영수증, 엄마 적금 해지 확인서, KD캐피탈 대출 약정서. '영동지점 창구에서 4년 있었어요. 계약 끝나는 날 퇴근길에 이 집이 경매(빚을 못 갚은 사람의 재산을 법원이 공개 입찰로 파는 절차)에 나온 걸 봤어요. 바다 보이는 집이 제 평생 소원이었거든요.' 그가 약정서의 한 줄을 짚습니다. 14개월 동안 한 번도 밀린 적 없음. '그런데 왜 저예요? 제가 뭘 잘못했어요?' 문간에 나준혁이 들어오지 못하고 서 있습니다. 여다인이 창구에 있던 4년 동안, 그 지점의 지점장이 나준혁이었습니다.", ["낙찰가 4억 1천 -- 엄마 적금 7천, KD캐피탈 대출 2억 9천", "14개월 연체 0회", "여다인: 영동지점 계약직 4년, 당시 지점장 나준혁"], ["오늘 밤 예약 손님 응대를 우리가 대신 맡는다", "연체 0회 기록으로 재심사 요청서를 같이 쓴다", "흔한 전산 오류라며 여다인을 안심시킨다"]],
    ["c42_embers", "c42_breakwater", "c42_final", "창피해서요", "한서윤", "불꽃이 끝나고 방파제 끝에 연기만 남습니다. 마지막 차례는 한서윤입니다. 그가 컵라면 뚜껑을 한참 만지작거립니다. '저는 창피해서요. 3년 전에 제가 반려 칸에 서명했잖아요. 멈추는 순간 그 서명이 다시 제 얼굴이 돼요. 그래서 못 멈춰요.' 그는 엄마가 일요일마다 전화해 '아직 안 잘렸니'부터 묻는다고 말하고 웃습니다. 아무도 따라 웃지 않습니다. 그때 지방 순회를 마친 반재욱이 택시에서 내려 방파제로 걸어옵니다. 한 손에는 수첩, 다른 손에는 축제 기념품 가게에서 산 야광봉 열한 개가 들려 있습니다.", ["한서윤: 3년 전 반려 칸 서명", "대기발령 중 일요일마다 어머니 전화", "반재욱 도착 23:10 -- 야광봉 11개"], ["한서윤의 서명을 이제 같이 짊어지자고 말한다", "그 서명이 누구 지시였는지 기록으로 밝히자고 한다", "야광봉을 나눠 주며 분위기부터 바꾼다"]],
  ],
  connectiveOrder: [["c42_pension", "c42_buoy"], ["c42_karaoke", "c42_ledger"], ["c42_breakwater", "c42_embers"]],
  choiceEffects: {
    c42_pension: [
      { trust: 8, humanCost: -3, time: -3, fatigue: 4 },
      { legitimacy: 5, trust: 2, humanCost: 2, time: -2, fatigue: 2 },
      { time: 2, trust: -2, humanCost: 2, fatigue: -6 },
    ],
    c42_karaoke: [
      { trust: 10, humanCost: -4, capital: -3, time: -4, fatigue: 5 },
      { legitimacy: 9, trust: 4, time: -5, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: -5, humanCost: 4, fatigue: -3 },
    ],
    c42_breakwater: [
      { trust: 11, humanCost: -3, legitimacy: -2, time: -3, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -4, humanCost: 3, fatigue: 4 },
      { time: 3, trust: 3, capital: 2, humanCost: 2, fatigue: -5 },
    ],
  },
  choiceCopy: {
    c42_pension: {
      voice: ["한서윤을 따라, 부표까지 같이 헤엄쳐 간다.", "안전요원 깃발 구역부터 확인하고, 해변에 남는다.", "파라솔 그늘에 누워, 한 시간 푹 잔다."],
      echo: ["같이 헤엄치면 한서윤은 한 번도 뒤를 돌아보지 않습니다. 뒤에 누가 오는지 알기 때문입니다.", "깃발 안에서는 아무도 다치지 않습니다. 대신 경주는 당신 없이 끝납니다.", "한 시간 자고 일어나면 얼굴 반쪽이 탔습니다. 누가 먼저 닿았는지는 모래 위의 소문으로 듣습니다."],
    },
    c42_karaoke: {
      voice: ["오늘 밤 예약 손님 응대는, 우리가 대신 맡겠다고 한다.", "연체 0회 기록으로, 재심사 요청서를 같이 쓴다.", "흔한 전산 오류라며, 여다인을 안심시킨다."],
      echo: ["손님을 대신 맞으면 강태민이 짐을 나르고 권도현이 영수증을 끊습니다. 여다인은 그 사이 처음으로 앉아서 웁니다.", "요청서는 빈틈이 없습니다. 월요일 아침 9시까지는 누구도 그 요청서를 열지 않습니다.", "안심한 여다인이 웃습니다. 그 문자가 오류가 아니라는 걸 아는 사람은 이 방에서 당신뿐입니다."],
    },
    c42_breakwater: {
      voice: ["한서윤의 서명을, 이제 같이 짊어지자고 말한다.", "그 서명이 누구 지시였는지, 기록으로 밝히자고 한다.", "야광봉을 나눠 주며, 분위기부터 바꾼다."],
      echo: ["같이 짊어지자는 말에 한서윤이 대답하지 않습니다. 컵라면을 끝까지 다 먹는 것으로 대답합니다.", "지시한 사람을 밝히면 한서윤의 서명은 가벼워집니다. 그 이름이 누구인지 모두가 이미 짐작하고 있습니다.", "초록 불빛이 돌자 오진우가 야광봉으로 칼싸움을 겁니다. 한서윤의 이야기는 거기서 멈춥니다."],
    },
  },
  reactionScenes: [
    ["c42_buoy_reaction", "c42_buoy", "c42_karaoke", "아무도 재지 않는 곳", "한서윤", "부표를 먼저 짚은 건 한서윤입니다. 오진우가 3초 늦게 닿아 물을 뱉으며 '재경기'를 외칩니다. 한서윤은 부표에 팔을 걸고 해변을 봅니다. 사람들이 콩알만 합니다. '여기 오니까 처음으로 아무도 저를 안 재네요. 대기발령 받은 날부터 매일 아침 출근 카드를 찍었어요. 갈 자리가 없는데도요. 안 찍으면 그만둔 걸로 칠까 봐.' 그가 웃는데, 눈가가 젖은 게 바닷물 때문만은 아닙니다. '고등학교 때 수영 선수였어요. 뭘 이겨 본 게 몇 년 만인지 모르겠어요.'", ["오늘 이긴 걸 단체방에 크게 자랑하자고 한다", "대기발령 기간의 출근 기록을 증거로 모아 두자고 한다", "재경기를 받아 주라며 오진우 편을 들어 준다"]],
    ["c42_ledger_reaction", "c42_ledger", "c42_breakwater", "세 번 반려한 주소", "나준혁", "나준혁이 관리동 계단에 앉아 믹스커피를 두 잔 탑니다. 한 잔은 여다인 몫입니다. '다인 씨, 나 이 주소 알아요. 지점에 있을 때 이 주소로 드나드는 돈을 전임자가 세 번 올렸는데, 세 번 다 내 도장으로 반려(받아 주지 않고 돌려보냄)했어요. 그때 끝까지 했으면 이 집은 경매에 안 나왔겠지. 그럼 다인 씨는 여기 없었을 거고.' 그가 웃다가 멈춥니다. '웃기지. 내가 부끄러워서 잡은 집에 다인 씨가 평생 모은 돈이 들어 있어요. 이번엔 반려 안 할게요.'", ["나준혁과 함께 오늘 밤 여다인 곁을 지킨다", "나준혁의 반려 기록을 재심사 참고 자료로 붙인다", "지난 일은 지난 일이라며 나준혁을 달랜다"]],
    ["c42_embers_reaction", "c42_embers", "c42_final", "열한 개의 야광봉", "반재욱", "반재욱이 야광봉을 하나씩 꺾어 나눠 줍니다. 열한 개, 여기 있는 사람보다 하나 많습니다. '하나는 사장님 몫입니다. 관리동 불이 아직 켜져 있더군요.' 그리고 수첩을 폅니다. '순회 중에 본사 자료를 봤습니다. 이번 주에 조기 회수(만기 전에 한꺼번에 돌려받는 것) 문자가 나간 곳이 전국에 마흔일곱 곳. 전부 윤상혁이 한 번이라도 스쳐 간 주소입니다. 사람이 아니라 주소가 벌을 받고 있어요.' 방파제 위에서 초록 불빛 열한 개가 흔들립니다.", ["야광봉 하나를 들고 여다인을 방파제로 데려온다", "마흔일곱 곳의 주소 목록을 오늘 밤 정리한다", "마흔일곱 곳은 월요일에 보자며 오늘은 쉰다"]],
  ],
  reactionEffects: {
    c42_buoy: [
      { trust: 9, humanCost: -4, time: -2, fatigue: 3 },
      { legitimacy: 7, trust: 3, time: -3, humanCost: 2, fatigue: 3 },
      { time: 3, capital: 2, trust: 2, humanCost: 2, fatigue: -4 },
    ],
    c42_ledger: [
      { trust: 9, humanCost: -3, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 2, capital: -2, time: -3, humanCost: 2, fatigue: 2 },
      { time: 3, capital: 3, trust: 3, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    c42_embers: [
      { trust: 10, humanCost: -4, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -4, capital: -2, fatigue: 5 },
      { time: 4, capital: 3, trust: 2, humanCost: 3, fatigue: -5 },
    ],
  },
  reactionCopy: {
    c42_buoy: {
      voice: ["오늘 이긴 걸, 단체방에 크게 자랑하자고 한다.", "대기발령 기간의 출근 기록을, 증거로 모아 두자고 한다.", "재경기를 받아 주라며, 오진우 편을 들어 준다."],
      echo: ["단체방에 '한서윤 1위' 사진이 올라가자 도윤하가 메달 이모티콘을 서른 개 보냅니다. 한서윤은 그 사진을 배경화면으로 바꿉니다.", "출근 기록은 다섯 달 치, 하루도 빠짐없습니다. 그 성실함이 부당함의 증거가 된다는 게 한서윤을 더 슬프게 합니다.", "재경기에서 오진우가 이깁니다. 한서윤이 일부러 늦게 갔다는 걸 오진우만 모릅니다."],
    },
    c42_ledger: {
      voice: ["나준혁과 함께, 오늘 밤 여다인 곁을 지킨다.", "나준혁의 반려 기록을, 재심사 참고 자료로 붙인다.", "지난 일은 지난 일이라며, 나준혁을 달랜다."],
      echo: ["곁을 지키면 관리동의 불이 새벽까지 켜져 있습니다. 불꽃은 창문으로만 봅니다.", "자기 반려 기록이 증거가 되는 걸 나준혁은 말리지 않습니다. 도장 세 개가 이번엔 반대쪽에 찍힙니다.", "달래는 말에 나준혁이 고개를 끄덕입니다. 그리고 믹스커피를 한 잔 더 탑니다. 대답하기 곤란할 때 하는 버릇입니다."],
    },
    c42_embers: {
      voice: ["야광봉 하나를 들고, 여다인을 방파제로 데려온다.", "마흔일곱 곳의 주소 목록을, 오늘 밤 정리한다.", "마흔일곱 곳은 월요일에 보자며, 오늘은 쉰다."],
      echo: ["방파제에 온 여다인이 야광봉을 받아 들고 한참 웃습니다. 불꽃은 끝났지만 그는 오늘 처음 축제를 봅니다.", "목록은 새벽 세 시에 완성됩니다. 마흔일곱 줄 중 서른아홉 줄에 '연체 없음'이 적힙니다.", "쉬는 동안 마흔일곱 곳에도 밤이 옵니다. 그 집들 중 몇 곳은 오늘 밤 불을 끄지 못합니다."],
    },
  },
  reactionMemos: {
    c42_buoy_reaction: ["다섯 달 만에 처음 이긴 사람", "갈 자리 없이 찍은 출근 카드"],
    c42_ledger_reaction: ["세 번 반려한 도장", "부끄러워서 잡은 집"],
    c42_embers_reaction: ["열한 개 -- 사람보다 하나 많은 야광봉", "주소가 받는 벌, 마흔일곱 곳"],
  },
  branchPlan: ["c42_pension", 2, "c42_branch_attic", "c42_branch_attic_follow"],
  branchScenes: {
    // CASE 42's detour is upstairs in the pension's office block. The house was
    // sold at auction with everything in it, including the one box the last
    // owners were told to shred and did not.
    c42_branch_attic: {
      phase: "SIDE DOOR",
      title: "다락의 우편물",
      speaker: "강태민",
      text: "체크인이 끝나자 여다인이 강태민에게 부탁합니다. '관리동 다락에 전 주인 짐이 남아 있는데 혼자서는 못 내려요.' 강태민이 상자 여섯 개를 한 번에 안고 내려옵니다. 맨 아래 상자의 테이프가 터지며 우편물이 쏟아집니다. 봉투마다 같은 발신인, 해온파트너스. 분기별 자문료(조언값이라며 받은 돈) 청구서 사본과 갤러리 온으로 보낸 송금 확인서가 3년 치 묶여 있고, 한 봉투 겉면에는 볼펜으로 '상무님 확인 후 파기'라고 적혀 있습니다. 파기되지 않았습니다. 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. '이거, 버리라던 거 맞죠?'",
      memo: ["상자 여섯 개 중 하나: 해온파트너스 우편물 3년 치", "자문료 청구서 사본 12장, 송금 확인서 12장", "봉투 메모: '상무님 확인 후 파기'", "소유권: 경매로 집과 함께 여다인에게 넘어옴"],
      triggers: ["curiosity", "injustice", "order"],
      choices: [
        { id: "c42_branch_attic_a", label: "여다인에게 보여 주고 우편물을 어떻게 할지 묻는다", effect: { trust: 10, legitimacy: 3, humanCost: -2, time: -4, fatigue: 4 }, next: "c42_branch_attic_follow", cognition: { reframing: 2 } },
        { id: "c42_branch_attic_b", label: "손대지 말고 검찰에 증거로 낼 준비부터 한다", effect: { legitimacy: 11, time: -5, trust: -2, humanCost: 3, fatigue: 3 }, next: "c42_branch_attic_follow", cognition: { inference: 2 } },
        { id: "c42_branch_attic_c", label: "봉투 겉면만 사진으로 찍어 두고 상자를 다시 닫는다", effect: { time: 5, capital: 4, trust: 2, legitimacy: -3, humanCost: 2, fatigue: -3 }, next: "c42_branch_attic_follow", cognition: { risk: 1 } },
      ],
    },
    c42_branch_attic_follow: {
      phase: "SIDE DOOR",
      title: "파기되지 않은 봉투",
      speaker: "여다인",
      text: "여다인이 봉투 하나를 들고 한참 봅니다. '이 사람들 때문에 이 집이 경매(빚을 못 갚은 사람의 재산을 법원이 공개 입찰로 파는 절차)에 나온 거네요. 그 덕에 제가 샀고요.' 웃는데 웃음이 이상합니다. 권도현이 송금 확인서를 날짜순으로 늘어놓다가 멈춥니다. 마지막 송금일은 해온파트너스의 청산(회사를 정리해 없애는 절차) 신청 전날이고, 그날만 갤러리가 아닌 개인 계좌로 나갔습니다. 받는 사람 이름 칸은 먹으로 지워져 있습니다. 여다인이 상자를 밀어 줍니다. '가져가세요. 대신 이 집 이름은 이 상자에서 빼 주세요. 저는 여기서 계속 살아야 하거든요.'",
      memo: ["마지막 송금: 청산 신청 전날, 개인 계좌로", "받는 사람 이름 칸 먹칠", "여다인의 조건: 물결스테이 이름은 빼 달라", "1심 재판부 추가 증거 제출 기한: 다음 주"],
      triggers: ["trust", "injustice", "protection"],
      choices: [
        { id: "c42_branch_attic_follow_a", label: "여다인의 조건대로 집 이름을 가리고 사본만 넘긴다", effect: { trust: 11, legitimacy: 4, capital: -3, time: -4, fatigue: 4 }, next: "c42_buoy", cognition: { reframing: 2 } },
        { id: "c42_branch_attic_follow_b", label: "먹칠 아래 이름을 감식 의뢰해 원본째 검찰에 낸다", effect: { legitimacy: 12, trust: -2, time: -6, humanCost: 3, fatigue: 5 }, next: "c42_buoy", cognition: { inference: 2 } },
        { id: "c42_branch_attic_follow_c", label: "상자는 우리가 맡고 쓸 때는 나중에 정한다", effect: { time: 4, capital: 5, trust: -3, legitimacy: -2, humanCost: 2, fatigue: -3 }, next: "c42_buoy", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c42_start",
    result: "c42_aftershock",
    defaultFree: "c42_route_system",
    // A vacation is still one line. The split is what the analyst says on the
    // breakwater, and what they let the board count as "cleared".
    choices: {},
    system: {
      route: "c42_route_system",
      final: "c42_final_system_route",
      title: "주소의 무게",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자, 노트북 업무 창에서 노아(KD의 AI 대출 심사 시스템)가 여다인의 회수 분류 근거를 펼칩니다. 연체 0회, 매출 상승, 담보 충분. 점수를 끌어내린 항목은 하나, '소재지 평판 위험'입니다. 가중치(판단에서 한 요소를 얼마나 무겁게 볼지 정한 값) 0.31. 이 항목은 두 번째 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 다음 날 새로 생겼고, 전국 마흔일곱 개 주소에만 값이 붙어 있습니다. 노아가 한 줄을 덧붙입니다. '저는 이 주소에 지금 누가 사는지 모릅니다. 이 주소에 누가 살았는지만 압니다.'",
      memo: ["여다인 신용 항목: 전부 정상 이상", "하락 요인: 소재지 평판 위험, 가중치 0.31", "항목 신설일: 두 번째 청문회 다음 날"],
      routeChoices: [
        ["c42_route_system_zero", "주소 항목의 가중치를 0으로 돌리라고 공식 요청한다", { legitimacy: 11, trust: 5, capital: -5, time: -6, fatigue: 5 }, { inference: 2 }],
        ["c42_route_system_names", "마흔일곱 주소에 지금 누가 사는지 한 명씩 찾는다", { trust: 10, humanCost: -4, time: -7, capital: -3, fatigue: 6 }, { persistence: 2 }],
        ["c42_route_system_skip", "항목은 두고 여다인 한 건만 따로 빼 달라고 한다", { time: 6, capital: 5, trust: 3, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "평판 항목은 사람 심사에서만 참고하도록 규칙을 바꾼다", { legitimacy: 12, trust: 6, capital: -7, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "항목은 그대로 두고 회수 시기만 1년 늦춘다", { capital: 8, time: 6, trust: -5, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "마흔일곱 곳 주인들에게 이의 신청 방법부터 알린다", { trust: 10, legitimacy: 7, capital: -5, time: -7, humanCost: -2, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c42_evidence_turn",
    result: "c42_aftershock",
    sourceRoutes: ["c42_pension", "c42_karaoke", "c42_breakwater", "c42_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 마흔일곱 곳의 주소 옆에 놓고, 그 목록이 어디서 왔는지 맞춰 본다.",
    entryEcho: "단서를 대면 목록의 출처가 보입니다. 그 출처가 해임안을 쓴 사람들과 같은 층이라는 것도 보입니다.",
    title: "정리표",
    speaker: "반재욱",
    text: "단서를 맞추자 마흔일곱 개 주소의 출처가 열립니다. 그룹 법무팀의 엑셀 파일 '윤상혁 관련 자산 정리표', 작성일은 두 번째 청문회 다음 날 아침입니다. 파일의 마지막 수정자는 그룹전략실이고, 같은 날 오후 이 목록이 통째로 노아(KD의 AI 대출 심사 시스템)의 새 항목이 됐습니다. 반재욱이 수첩을 덮습니다. '대표를 물러나게 하는 안건 자료에 위험 정리 완료라고 쓰려면 정리한 숫자가 있어야 하죠. 윤상혁을 자르면서, 그 사람이 스쳐 간 주소에 사는 사람들까지 같이 잘라서 숫자를 채운 겁니다. 3년 전하고 모양이 똑같아요. 위에서 정하고, 아래에서 치릅니다.'",
    memo: ["출처: 그룹 법무팀 '윤상혁 관련 자산 정리표'", "최종 수정: 그룹전략실, 청문회 다음 날", "같은 날 노아에 새 항목으로 입력 -- 47곳"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 6, trust: 4, time: -6, capital: -2, fatigue: 5 },
    choices: [
      ["c42_evidence_turn_board", "정리표를 사외이사 의견서에 붙여 이사회에 낸다", { legitimacy: 13, trust: 5, capital: -6, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c42_evidence_turn_hold", "정리표는 쥐고 있다가 이사회 당일에 꺼낸다", { capital: 8, time: 6, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c42_evidence_turn_owners", "마흔일곱 곳의 주인들에게 먼저 이 사실을 알린다", { trust: 12, legitimacy: 6, capital: -6, time: -5, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c42_branch_attic",
    systemNext: "c42_route_system",
    evidenceNext: "c42_evidence_turn",
    routeLabel: "직전 청문회의 질문 순서표로 1박 2일의 역할을 나눈다",
    systemLabel: "직전 자유응답 문장이 노아의 회수 사유에도 남았는지 본다",
    evidenceLabel: "직전 단서를 붙여 마흔일곱 개 주소가 어디서 왔는지 연다",
  },
  openingRoutes: {
    c41_after_warm: "c42_start_warm",
    c41_after_record: "c42_start_record",
    c41_after_rush: "c42_start_rush",
  },
  openingCopy: {
    c42_start_warm: ["끝까지 남았던 사람들의 휴가", "나준혁", "청문회장을 나선 그 밤, 당신은 동료들 곁에 끝까지 남았습니다. 헤어질 때 누군가 말했습니다. 다음에는 서류 없는 데서 보자고. 엿새 뒤 나준혁이 그 말을 도장 세 개로 굳혀 옵니다. 붓펜으로 쓴 '휴가 명령서', 경포 불꽃축제 앞 펜션, 방 넷, 이불 열두 채. 그런데 KD캐피탈에 낸 당신의 금요일 휴가 신청서는 마지막 승인 칸, 대표이사 윤상혁의 칸에서 나흘째 멈춰 있습니다. 반려도 아니고 승인도 아닙니다. 3년 전 그 서명란처럼, 그냥 비어 있습니다.", ["휴가 명령서: 나준혁 도장 세 개", "금요일 휴가 신청: 대표이사 칸 나흘째 빈칸", "참석 확정 아홉 명"]],
    c42_start_record: ["스물세 칸을 채운 사람의 휴가", "이민서", "엿새 동안 당신은 청문회 속기록(오간 말을 그대로 적은 공식 기록)의 '기억나지 않습니다' 스물세 번을 하나씩 당시 문서와 맞춰 표로 만들었습니다. 스물세 칸 중 열아홉 칸에, 그가 기억했어야 할 그의 서명이 있습니다. 표를 저장하는 순간 이민서가 단체방에 나준혁의 '휴가 명령서'를 올립니다. 경포, 불꽃축제, 내일. 그런데 당신의 금요일 휴가 신청서는 마지막 승인 칸, 대표이사 윤상혁의 칸에서 나흘째 멈춰 있습니다. 기억나지 않는다던 사람이, 당신의 휴가는 잊지 않았습니다.", ["'기억나지 않습니다' 23회 -- 서명 문서와 맞는 칸 19개", "금요일 휴가 신청: 대표이사 칸 나흘째 빈칸", "휴가 명령서 게시: 이민서"]],
    c42_start_rush: ["먼저 달린 사람의 휴가", "반재욱", "청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리)가 끝나 회의장을 나서자마자 당신은 곧장 다음 싸움으로 갔습니다. 엿새 동안 KD캐피탈 사무실 불을 제일 늦게 껐고, 위험관리부 사람들은 당신 자리를 '야간 당직석'이라고 부릅니다. 목요일 저녁, 지방 순회 중인 반재욱이 전화를 겁니다. '나준혁 지점장님이 휴가 명령서를 돌렸습니다. 당신 이름이 맨 위에 있어요. 도장까지 찍혀서.' 당신의 금요일 휴가 신청서는 마지막 승인 칸, 대표이사 윤상혁의 칸에서 나흘째 멈춰 있습니다. 그 칸을 누가 비워 두는지 당신은 압니다.", ["엿새 연속 마지막 퇴근", "금요일 휴가 신청: 대표이사 칸 나흘째 빈칸", "휴가 명령서 맨 윗줄: 당신"]],
  },
  openingSignatures: {
    c42_start_warm: {
      label: "그 밤의 약속대로 서류 하나 없이 빈손으로 떠난다",
      effect: { trust: 10, humanCost: -3, legitimacy: -5, time: -4, fatigue: -2 },
      cognition: { reframing: 2 },
      voice: "그 밤의 약속대로, 서류 하나 없이 빈손으로 떠난다.",
      echo: "빈손으로 가면 가방이 가볍습니다. 월요일 아침 인사팀은 무단결근 사유서를 당신 책상에 올려 둡니다.",
    },
    c42_start_record: {
      label: "스물세 칸 표를 휴가 신청서에 붙여 다시 올린다",
      effect: { legitimacy: 12, trust: 2, capital: -2, time: -5, humanCost: 2, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "스물세 칸 표를, 휴가 신청서에 붙여 다시 올린다.",
      echo: "표가 붙은 휴가 신청서는 두 시간 만에 승인됩니다. 승인자 칸에는 윤상혁이 아니라 비서실 직원의 이름이 찍힙니다.",
    },
    c42_start_rush: {
      label: "휴가 대신 경포 출장으로 서류를 바꿔 올린다",
      effect: { capital: 6, time: 6, trust: 4, legitimacy: -5, humanCost: 2, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "휴가 대신, 경포 출장으로 서류를 바꿔 올린다.",
      echo: "출장은 팀장 선에서 끝납니다. 대표 칸을 건너뛰는 대신, 당신은 이번 1박 2일을 회사 일로 적어 두었습니다.",
    },
  },
  voiceLines: {
    // CASE 42. A vacation and a breakwater. The lines are spoken among friends,
    // so none of them is allowed to sound like a hearing.
    c42_start_go: "승인이 없어도, 동료들과 경포로 떠난다.",
    c42_start_ask: "빈 승인란의 경위를, 인사팀에 공식으로 묻는다.",
    c42_start_laptop: "노트북을 챙겨, 휴가지에서도 업무를 받겠다고 한다.",
    c42_pension_tell: "여다인에게, 이 집의 지난 주인을 솔직히 알려 준다.",
    c42_pension_check: "말하기 전에, 등기부와 경매 기록부터 확인한다.",
    c42_pension_rest: "오늘은 휴가라며, 주소 이야기는 꺼내지 않는다.",
    c42_branch_attic_a: "여다인에게 보여 주고, 우편물을 어떻게 할지 묻는다.",
    c42_branch_attic_b: "손대지 말고, 검찰에 증거로 낼 준비부터 한다.",
    c42_branch_attic_c: "봉투 겉면만 사진으로 찍어 두고, 상자를 다시 닫는다.",
    c42_branch_attic_follow_a: "여다인의 조건대로, 집 이름을 가리고 사본만 넘긴다.",
    c42_branch_attic_follow_b: "먹칠 아래 이름을 감식 의뢰해, 원본째 검찰에 낸다.",
    c42_branch_attic_follow_c: "상자는 우리가 맡고, 쓸 때는 나중에 정하자고 한다.",
    c42_karaoke_run: "노래방을 나와, 여다인에게 곧장 달려간다.",
    c42_karaoke_basis: "회수 분류의 '내부 기준'이 무엇인지, 문서로 요구한다.",
    c42_karaoke_call: "당직 직원에게 전화해, 내 권한으로 발송을 멈춘다.",
    c42_breakwater_faces: "반대 의견 뒤에 있던, 사람들 얼굴 때문이라고 말한다.",
    c42_breakwater_duty: "내가 쓴 반대 의견을, 끝까지 책임지고 싶었다고 말한다.",
    c42_breakwater_win: "윤상혁을 이기고 싶었다고, 솔직하게 말한다.",
    c42_final_stay: "서울보다 먼저, 여다인의 회수 분류부터 멈추고 간다.",
    c42_final_attach: "해임안에, 마흔일곱 곳의 회수 중단을 함께 올리라고 요구한다.",
    c42_final_push: "마흔일곱 곳은 빼고, 해임 찬성 의견서만 오늘 보낸다.",
    c42_after_warm: "단체 사진을 찍고, 낮 기차까지 동료들과 바다에 남는다.",
    c42_after_record: "그 밤의 대답과 마흔일곱 곳을, 돌아가는 기차에서 문서로 남긴다.",
    c42_after_rush: "단체 사진도 찍기 전에, 첫 기차로 서울에 간다.",
    c42_route_system_zero: "주소 항목의 가중치를 0으로 돌리라고, 공식 요청한다.",
    c42_route_system_names: "마흔일곱 주소에 지금 누가 사는지, 한 명씩 찾는다.",
    c42_route_system_skip: "항목은 두고, 여다인 한 건만 따로 빼 달라고 한다.",
    c42_final_system_route_a: "평판 항목은, 사람 심사에서만 참고하도록 규칙을 바꾼다.",
    c42_final_system_route_b: "항목은 그대로 두고, 회수 시기만 1년 늦춘다.",
    c42_final_system_route_c: "마흔일곱 곳 주인들에게, 이의 신청 방법부터 알린다.",
    c42_evidence_turn_board: "정리표를, 사외이사 의견서에 붙여 이사회에 낸다.",
    c42_evidence_turn_hold: "정리표는 쥐고 있다가, 이사회 당일에 꺼낸다.",
    c42_evidence_turn_owners: "마흔일곱 곳의 주인들에게, 먼저 이 사실을 알린다.",
  },
  echoReplies: {
    // CASE 42.
    c42_start_go: "승인 없이 떠나면 금요일 아침 기차는 즐겁습니다. 대표 칸이 비어 있는 동안, 당신의 금요일은 결근으로도 휴가로도 적히지 않습니다.",
    c42_start_ask: "공식 문의는 기록이 됩니다. 인사팀의 답은 이틀 뒤에 오고, 그동안 경포행 기차는 당신 없이 출발합니다.",
    c42_start_laptop: "노트북은 가방 맨 위에 들어갑니다. 바다에 가서도 당신은 KD캐피탈 직원입니다. 그 사실이 오늘 밤 쓸모가 있을지도 모릅니다.",
    c42_pension_tell: "알려 주면 여다인의 얼굴에서 웃음이 사라집니다. 그리고 한참 뒤 '그래도 말해 줘서 고마워요'라고 합니다.",
    c42_pension_check: "등기부를 떼면 낙찰 과정은 깨끗합니다. 깨끗하다는 걸 확인하는 데 오후 한나절이 듭니다.",
    c42_pension_rest: "말하지 않으면 오늘은 평화롭습니다. 여다인은 이 집의 과거를, 오늘 밤 전혀 다른 방식으로 알게 됩니다.",
    c42_branch_attic_a: "보여 주면 여다인이 봉투를 오래 봅니다. 자기 집 다락에 무엇이 3년이나 있었는지, 그는 처음 압니다.",
    c42_branch_attic_b: "증거로 준비하면 봉투에는 아무도 손대지 못합니다. 여다인은 자기 집 다락에 출입 금지 테이프가 붙는 걸 봅니다.",
    c42_branch_attic_c: "사진은 남습니다. 상자는 다시 다락으로 올라가고, 누가 언제 다시 열지는 아무도 모릅니다.",
    c42_branch_attic_follow_a: "이름을 가린 사본은 증거로서 조금 약합니다. 대신 여다인은 이 집에서 계속 장사를 할 수 있습니다.",
    c42_branch_attic_follow_b: "감식을 맡기면 먹칠 아래 이름이 나올 수 있습니다. 물결스테이라는 이름도 공소장 어딘가에 함께 적힙니다.",
    c42_branch_attic_follow_c: "상자를 맡으면 선택지는 늘어납니다. 제출 기한은 그만큼 가까워집니다.",
    c42_karaoke_run: "달려가면 노래방 5번 방에는 나준혁의 100점 화면만 남습니다. 여다인은 관리동 계단에 휴대폰을 쥐고 앉아 있습니다.",
    c42_karaoke_basis: "문서로 요구하면 답은 월요일에 옵니다. 주말 동안 여다인은 이유를 모른 채 손님을 받습니다.",
    c42_karaoke_call: "당직 직원은 당신 목소리에 놀라 발송을 멈춥니다. 월요일 아침, 멈춘 사람의 이름이 기록에 남습니다.",
    c42_breakwater_faces: "얼굴 때문이라고 말하면 도윤하가 고개를 끄덕입니다. 둘이 떠올린 얼굴 중 몇은 같은 사람입니다.",
    c42_breakwater_duty: "책임이라고 말하면 방파제가 잠깐 조용해집니다. 한서윤이 그 말을 자기 이야기처럼 듣고 있습니다.",
    c42_breakwater_win: "이기고 싶었다고 하면 오진우가 제일 크게 웃습니다. '거봐요, 저만 그런 거 아니죠.' 그 말이 조금 무섭기도 합니다.",
    c42_final_stay: "여다인부터 멈추면 해장국을 같이 먹습니다. 의견서는 서울행 기차 안에서, 흔들리는 글씨로 씁니다.",
    c42_final_attach: "마흔일곱 곳을 붙이면 해임안이 무거워집니다. 사외이사 한 명은 '안건이 너무 복잡해진다'고 전화를 끊습니다.",
    c42_final_push: "해임 찬성만 보내면 안건은 깔끔하게 올라갑니다. 마흔일곱 곳은 '정리 완료'라는 한 줄로 남습니다.",
    c42_after_warm: "사진 속 아홉 명은 다 눈을 감고 있어서 강태민이 열두 번을 다시 찍습니다. 바다에서 오진우가 재경기를 청하고 또 지고, 의견서는 낮 기차 안에서 자정 7분 전에 나갑니다.",
    c42_after_record: "기차가 원주를 지날 때 문서가 끝납니다. 그 밤의 대답에 나온 이름 스물과 마흔일곱 곳의 주소가 한 파일에 들어가고, 여다인은 그 파일에 자기 이름이 있다는 걸 문자로 듣습니다.",
    c42_after_rush: "첫 기차를 타면 단체 사진에 당신 자리만 비어 있습니다. 여다인이 방명록 마지막 줄에 당신 대신 '급한 사람'이라고 적어 둡니다.",
    c42_route_system_zero: "요청은 노아의 설정표에 올라갑니다. 그 설정표를 바꿀 권한이 누구에게 있는지 적힌 칸은 비어 있습니다.",
    c42_route_system_names: "한 명씩 찾으면 마흔일곱 개의 주소가 사람이 됩니다. 식당, 민박, 세탁소, 그리고 할머니 혼자 사는 집 하나.",
    c42_route_system_skip: "여다인 한 건은 빠집니다. 나머지 마흔여섯 곳에는 월요일 아침 같은 문자가 한 번 더 갑니다.",
    c42_final_system_route_a: "사람이 보게 하면 느려집니다. 느려진 만큼 마흔일곱 곳은 이름을 가지고 심사를 받습니다.",
    c42_final_system_route_b: "1년이 생깁니다. 1년 뒤에도 그 주소는 같은 주소입니다.",
    c42_final_system_route_c: "이의 신청서가 마흔일곱 통 들어오면, 누군가는 그 항목을 설명해야 합니다.",
    c42_evidence_turn_board: "정리표가 이사회에 들어가면 해임안의 마지막 문장이 흔들립니다. 그 문장을 쓴 층도 함께 흔들립니다.",
    c42_evidence_turn_hold: "쥐고 있으면 이사회 당일 가장 센 패가 됩니다. 그때까지 마흔일곱 곳에는 회수 문자가 계속 갑니다.",
    c42_evidence_turn_owners: "먼저 알리면 마흔일곱 곳의 전화가 한꺼번에 울립니다. 그중 몇은 화를 내고, 몇은 당신에게 고맙다고 합니다.",
  },
  characterProfiles: {
    여다인: {
      role: "경포 '물결스테이' 사장 · 전 KD은행 영동지점 창구 계약직",
      stance: "생계 · 새 출발 · 억울함",
      job: "사슬이 끊긴 자리에 새로 들어와 사는 사람. 지난 주인의 그림자가 주소에 남아 자기에게 청구된다.",
      appearance: "물 빠진 청록색 앞치마, 방 열쇠 네 개가 달린 고무줄 팔찌, 손등에 남은 흰 페인트 자국.",
      thought: "평생 모은 돈으로 바다 보이는 집을 샀다. 그 집의 과거까지 산 줄은 몰랐다.",
      gesture: "여다인은 곤란한 말을 들으면 마당의 튜브를 하나씩 뒤집어 말린다.",
      voice: "창구에서 4년 배운 존댓말이 빠르고 또렷하다. 억울할수록 숫자부터 말한다.",
      line: "연체 한 번 없었어요. 그럼 제가 뭘 더 해야 돼요?",
    },
  },
  setting: { place: "KD캐피탈 위험관리부", clock: "경포 불꽃축제 전날 · 18:10" },
  sceneContext: {
    c42_start: {
      place: "KD캐피탈 위험관리부 · 복도",
      clock: "경포 불꽃축제 전날 · 18:10",
      question: "휴가 신청서의 대표이사 칸이 나흘째 비어 있고, 도장 찍힌 휴가 명령서가 도착했습니다. 어떻게 하겠습니까?",
      lead: "두 번째 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 뒤 엿새, 퇴근 시간이 지난 복도에서 휴대폰 단체방이 쉬지 않고 울립니다.",
    },
    c42_start_warm: {
      place: "KD캐피탈 위험관리부 · 복도",
      clock: "경포 불꽃축제 전날 · 18:10",
      question: "그 밤에 한 약속이 도장 찍힌 명령서가 되어 왔습니다. 빈 승인 칸을 두고 어떻게 떠나겠습니까?",
      lead: "청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 날 밤을 끝까지 같이 보낸 사람들이, 엿새 만에 다시 같은 단체방에 모였습니다.",
    },
    c42_start_record: {
      place: "KD캐피탈 위험관리부 · 복도",
      clock: "경포 불꽃축제 전날 · 18:10",
      question: "스물세 칸의 표를 막 완성했는데 휴가 칸 하나가 비어 있습니다. 그 표를 어디에 쓰겠습니까?",
      lead: "엿새 동안 만든 표를 저장하고 고개를 드니 창밖이 어둡습니다.",
    },
    c42_start_rush: {
      place: "KD캐피탈 위험관리부 · 복도",
      clock: "경포 불꽃축제 전날 · 18:10",
      question: "엿새를 달린 사람 앞에 휴가 명령서와 빈 승인 칸이 함께 놓였습니다. 멈추겠습니까, 돌아가겠습니까?",
      lead: "오늘도 마지막까지 남은 사무실에서, 반재욱의 전화가 울립니다.",
    },
    c42_pension: {
      place: "경포 물결스테이 펜션 · 마당",
      clock: "불꽃축제 당일 · 12:10",
      question: "새 주인이 모르는 이 집의 지난 주인을 당신은 압니다. 그 이야기를 어떻게 하겠습니까?",
      lead: "강릉역에서 택시로 15분, 마당에 튜브가 걸린 흰 펜션 앞에서 나준혁이 손을 흔듭니다.",
    },
    c42_branch_attic: {
      place: "경포 물결스테이 펜션 · 관리동 다락",
      clock: "불꽃축제 당일 · 13:00",
      question: "'확인 후 파기'라고 적힌 봉투가 파기되지 않은 채 쏟아졌습니다. 이 우편물을 어떻게 하겠습니까?",
    },
    c42_branch_attic_follow: {
      place: "경포 물결스테이 펜션 · 관리동",
      clock: "불꽃축제 당일 · 13:30",
      question: "여다인이 집 이름만 빼 달라며 상자를 내밉니다. 이 조건을 어떻게 받겠습니까?",
    },
    c42_buoy: {
      place: "경포 해변 · 백사장",
      clock: "불꽃축제 당일 · 14:00",
      question: "오진우가 부표까지 경주를 걸었고 한서윤이 말없이 물에 들어갔습니다. 당신은 어디에 있겠습니까?",
    },
    c42_buoy_reaction: {
      place: "경포 해변 · 부표 앞 바다",
      clock: "불꽃축제 당일 · 14:20",
      question: "다섯 달 만에 처음 이긴 사람이 부표에 매달려 웁니다. 무엇이라고 하겠습니까?",
    },
    c42_karaoke: {
      place: "경포 해변 앞 · 노래방 골목",
      clock: "불꽃축제 당일 · 19:04",
      question: "연체 한 번 없는 여다인에게 금요일 저녁 자동 회수 문자가 왔습니다. 지금 무엇을 하겠습니까?",
      lead: "나준혁이 100점을 받은 화면 앞에서, 당신 휴대폰에 여다인의 캡처가 뜹니다.",
    },
    c42_ledger: {
      place: "경포 물결스테이 펜션 · 관리동",
      clock: "불꽃축제 당일 · 20:10",
      question: "왜 자기냐고 묻는 여다인 앞에 파일철 세 개가 펼쳐져 있습니다. 오늘 밤 무엇을 해 주겠습니까?",
    },
    c42_ledger_reaction: {
      place: "경포 물결스테이 펜션 · 관리동 계단참",
      clock: "불꽃축제 당일 · 20:40",
      question: "세 번 반려한 도장의 주인이 이번엔 반려하지 않겠다고 합니다. 그 말을 어떻게 받겠습니까?",
    },
    c42_breakwater: {
      place: "경포 방파제",
      clock: "불꽃축제 본 행사 · 21:00",
      question: "불꽃 아래서 모두가 무엇 때문에 못 멈췄는지 말했습니다. 당신의 대답은 무엇입니까?",
      lead: "불꽃이 오르기 5분 전, 강태민이 보온병을 들고 방파제 끝자리를 맡아 두었습니다.",
    },
    c42_embers: {
      place: "경포 방파제 · 끝자리",
      clock: "불꽃축제 끝 · 23:00",
      question: "한서윤은 창피해서 못 멈춘다고 말합니다. 그 서명을 어떻게 하겠습니까?",
    },
    c42_embers_reaction: {
      place: "경포 방파제 · 등대 아래",
      clock: "불꽃축제 끝 · 23:10",
      question: "사람이 아니라 주소가 벌을 받는 곳이 마흔일곱 곳입니다. 오늘 밤 무엇부터 하겠습니까?",
    },
    c42_route_system: {
      place: "경포 물결스테이 펜션 · 2층 방",
      clock: "불꽃축제 당일 · 19:30",
      question: "노아는 주소에 누가 살았는지만 압니다. 그 항목을 어떻게 하겠습니까?",
    },
    c42_final_system_route: {
      place: "경포 물결스테이 펜션 · 2층 방",
      clock: "불꽃축제 다음 날 · 새벽",
      question: "주소에 점수를 매기는 규칙을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c42_evidence_turn: {
      place: "경포 방파제 · 등대 아래",
      clock: "불꽃축제 다음 날 · 01:20",
      question: "마흔일곱 곳은 해임안의 숫자를 채우려고 잘린 주소였습니다. 이 정리표를 어떻게 쓰겠습니까?",
    },
    c42_final: {
      place: "경포 해변 · 백사장",
      clock: "불꽃축제 다음 날 · 05:40",
      question: "해임안이 올라갔고, 그 설명 자료가 마흔일곱 곳을 정리 완료라고 적었습니다. 어떻게 하겠습니까?",
      lead: "모래 위에 담요 네 장이 펴져 있고, 수평선이 막 밝아 오기 시작합니다.",
    },
    c42_aftershock: {
      place: "경포 물결스테이 펜션 · 마당",
      clock: "불꽃축제 다음 날 · 06:30",
      question: "방명록에 한 줄이 남았고 서울행 첫 기차가 기다립니다. 이 여름의 마지막 오전을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c42-address-sheet",
    title: "주소가 받는 벌",
    text: "노아의 새 항목 '소재지 평판 위험'은 그룹 법무팀의 '윤상혁 관련 자산 정리표'에서 왔습니다. 마흔일곱 곳 중 서른아홉 곳은 연체가 한 번도 없었습니다.",
  },
  outcomes: {
    c42_after_warm: { tag: "바다에 남은 결말", title: "마지막 불꽃까지 남았고, 아침 사진에도 다 같이 있었다", text: "단체 사진을 열두 번 찍고 모두 바다에 한 번 더 들어갔습니다. 의견서는 낮 기차에서 아홉 명이 돌려 읽으며 고쳤고, 자정 7분 전에 사외이사들에게 갔습니다." },
    c42_after_record: { tag: "기록으로 남긴 결말", title: "그 밤의 대답과 마흔일곱 곳이 한 파일이 됐다", text: "돌아가는 기차에서 방파제 아래의 대답과 마흔일곱 개 주소를 문서로 정리했습니다. 이름 스무 개와 서른아홉 개의 '연체 없음'이 의견서에 들어갑니다." },
    c42_after_rush: { tag: "먼저 올라간 결말", title: "단체 사진에 내 자리를 비워 두고 첫 기차를 탔다", text: "당신은 새벽 첫 기차로 서울에 올라갔습니다. 동료들은 당신 자리를 비워 둔 채 사진을 찍었고, 방명록 마지막 줄에는 여다인이 대신 쓴 '급한 사람'이 남았습니다." },
  },
  carryovers: {
    c42_after_warm: { trust: 9, humanCost: -4, fatigue: -9 },
    c42_after_record: { legitimacy: 12, trust: 3, fatigue: 4 },
    c42_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c41_after_warm: { id: "protect-trust", title: "끝까지 남았던 사람들과 쉬기", text: "청문회 밤을 같이 보낸 사람들이 다시 모였습니다. 쉬러 간 자리에서도 그 사람들 곁을 먼저 지키는 선택을 찾아야 보너스가 열립니다." },
    c41_after_record: { id: "use-reframe", title: "스물세 번의 '기억나지 않습니다'를 다시 쓰기", text: "당신이 만든 표는 청문회를 위한 것이었습니다. 그 표가 바닷가의 한 사람에게 무슨 쓸모가 있는지 판을 다시 짜야 합니다." },
    c41_after_rush: { id: "repair-legitimacy", title: "달리느라 비운 자리의 공정함 회복하기", text: "엿새를 먼저 달린 사이 절차는 뒤에 남았습니다. 빈 승인 칸과 자동 문자 앞에서 공정함을 되찾는 선택을 찾아야 합니다." },
  },
};
