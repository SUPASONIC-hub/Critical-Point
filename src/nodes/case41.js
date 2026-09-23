/**
 * CASE 41 -- the second hearing, where the empty chair finally fills.
 *
 * Thirty cases ago 윤상혁 sent an absence note to a 국정감사 and the cameras filmed
 * an empty chair. This time he comes. He is the chief executive of KD캐피탈 now,
 * on trial for the consulting fees, and the analyst works three floors under him.
 * He arrives prepared, with two lawyers and one sentence -- "기억나지 않습니다" --
 * which he says twenty-three times before the day is out. The committee gives
 * the analyst one minute of 차지원's seven and a single question, put to him face
 * to face.
 *
 * The case is about what a question is for when the answer is already written.
 * A memory cannot be proven false, so every choice is about building a question
 * whose "I do not remember" turns into something else in the room: a paper with
 * his signature on it, a widow's husband's name, a notebook in his daughter's bag.
 * The laughter is character-driven -- 나준혁's second turn as 윤상혁 in a suit that
 * finally buttons, 오진우's betting pool, 문가을 arguing with Assembly security that
 * three boxes of rice cake are 1,740 people -- and the grief sits in a daughter's
 * count through a study door and a notebook line written the same day as a
 * tuition payment. It ends on a hot night at a 포장마차 with "next time, somewhere
 * without paperwork", which 사건 42 takes to the sea.
 */
export const case41Nodes = {
  c41_start: {
    phase: "CASE 41 BRIEFING",
    title: "이번에는 온다",
    speaker: "차지원",
    text:
      "8월 넷째 주 월요일, 국회 정무위원회가 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 일정을 확정합니다. 안건은 2023-0412 대출 은폐와 트리거랩 반응 기록 유출. 증인 명단 첫 줄은 KD캐피탈 대표이사 윤상혁입니다. 작년 가을 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 따져 묻는 자리)에는 불출석 사유서(나오지 못하는 이유를 적어 내는 서류)를 냈던 사람이 이번에는 변호인을 통해 '성실히 출석하겠다'고 알려 왔습니다. 당신은 다시 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)입니다. 차지원이 전화 너머로 삼각김밥 포장을 뜯습니다. '안 나오는 사람은 쉬워요. 빈 의자는 반박을 안 하거든요. 무서운 건 나오는 사람이에요. 준비를 다 끝냈다는 뜻이니까.'",
    memo: [
      "청문회 D-4 -- 금요일 10시 개회",
      "증인 윤상혁: KD캐피탈 대표이사, 자문료 배임 혐의 재판 중",
      "참고인 질문 기회 1개 -- 의원 질의 7분 중 1분",
      "작년 가을엔 빈 의자, 이번엔 출석 통보",
    ],
    triggers: ["injustice", "fear", "responsibility"],
    choices: [
      {
        id: "c41_start_team",
        label: "흩어진 동료들을 불러 청문회 준비를 함께 한다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -3, fatigue: 4 },
        next: "c41_drill",
        cognition: { persistence: 2 },
      },
      {
        id: "c41_start_timeline",
        label: "윤상혁의 지난 발언과 서류를 날짜순으로 맞춘다",
        effect: { legitimacy: 10, time: -5, trust: -2, humanCost: 3, fatigue: 3 },
        next: "c41_drill",
        cognition: { inference: 2 },
      },
      {
        id: "c41_start_office",
        label: "의원실로 곧장 가서 질의 순서부터 잡아 둔다",
        effect: { capital: 7, time: 5, legitimacy: -5, trust: -3, humanCost: 3, fatigue: 1 },
        next: "c41_drill",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c41_drill",
      },
    ],
  },
  c41_drill: {
    phase: "THE REHEARSAL",
    title: "기억나지 않습니다",
    speaker: "나준혁",
    text:
      "회기동 헌책방 1층, 모의 청문회 2회차입니다. 작년 가을의 사과 상자 의원석은 접이식 탁자가 됐고, 윤상혁 역은 이번에도 나준혁입니다. 감색 정장을 자기 돈으로 새로 샀다며 단추를 잠가 보입니다. 잠깁니다. 박수가 터집니다. 그런데 무엇을 물어도 대답이 하나입니다. '기억나지 않습니다.' 강태민이 '어제 저녁 뭐 드셨어요' 해도 같은 대답입니다. 권도현이 '1994년 영동지점 반려 보고서 셋째 줄은요' 하자, 나준혁이 눈을 감고 한 글자도 틀리지 않고 욉니다. 웃음이 멎습니다. 기억은 고르는 겁니다. 오진우가 화이트보드에 내기판을 그립니다. '실전에서 몇 번 나올까. 난 열아홉.' 그때 차지원의 문자가 옵니다. '형식 확정됐어요. 대질신문(말이 엇갈리는 두 사람을 마주 세워 묻는 방식), 1분, 질문 딱 하나.'",
    memo: [
      "모의 질의 14회 -- '기억나지 않습니다' 14회",
      "나준혁의 새 정장: 단추 잠김, 경비 처리 불가(권도현 판정)",
      "내기판: 오진우 19, 권도현 23, 강태민 '안 셈'",
      "참고인 질문 형식: 대질신문 1분",
    ],
    triggers: ["curiosity", "competition", "trust"],
    choices: [
      {
        id: "c41_drill_victims",
        label: "피해자들이 묻고 싶은 질문을 모아 그중 하나를 고른다",
        effect: { trust: 12, humanCost: -4, time: -5, capital: -3, fatigue: 4 },
        next: "c41_corridor",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c41_drill_paper",
        label: "기억이 안 난다고 할 수 없는 서류 질문만 추린다",
        effect: { legitimacy: 12, trust: 1, time: -5, capital: -2, humanCost: 3, fatigue: 4 },
        next: "c41_corridor",
        cognition: { inference: 2 },
      },
      {
        id: "c41_drill_hand",
        label: "질문 초안은 의원실에 맡기고 증거 정리에만 집중한다",
        effect: { time: 6, capital: 5, legitimacy: 3, trust: -2, humanCost: 3, fatigue: -3 },
        next: "c41_corridor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c41_corridor",
      },
    ],
  },
  c41_corridor: {
    phase: "COUNTER PRESSURE",
    title: "대기실 복도",
    speaker: "윤상혁",
    text:
      "청문회 당일 9시 20분, 국회 본관 3층 증인 대기실 앞 복도. 변호인 두 명을 거느린 윤상혁이 먼저 와 있습니다. 같은 회사의 대표이사와 직원이 같은 복도에서 서로 다른 문을 기다리는 셈입니다. 그가 종이컵 커피를 한 잔 내밉니다. 컵에 KD캐피탈 로고가 찍혀 있습니다. '질문이 하나라고 들었네. 신중하게 고르게. 서진이가 방청석에 온다더군.' 딸의 이름이 나오는 순간 복도가 반쯤 좁아집니다. 그가 커피를 든 손을 거두지 않은 채 덧붙입니다. '나는 기억력이 나쁜 사람이 아닐세. 다만 오늘은 기억할 필요가 없는 날이지.' 변호인 한 명이 손목시계를 봅니다. 개회까지 40분입니다.",
    memo: [
      "증인 대기실 앞 -- 개회 40분 전",
      "윤상혁 측 변호인 2명",
      "윤서진 방청 신청 확인",
      "증인과 참고인의 사전 접촉 -- 어디에도 기록 없음",
    ],
    triggers: ["manipulation", "affection", "injustice"],
    choices: [
      {
        id: "c41_corridor_daughter",
        label: "윤서진을 먼저 찾아가 오늘 무엇을 묻게 될지 미리 말해 준다",
        effect: { trust: 11, humanCost: -6, legitimacy: -2, time: -4, fatigue: 5 },
        next: "c41_chamber",
        cognition: { reframing: 2 },
      },
      {
        id: "c41_corridor_report",
        label: "복도에서 오간 말을 그대로 적어 위원장실에 알린다",
        effect: { legitimacy: 12, trust: -3, time: -4, humanCost: 2, fatigue: 5 },
        next: "c41_chamber",
        cognition: { inference: 2 },
      },
      {
        id: "c41_corridor_cup",
        label: "커피는 받지 않고 한마디 없이 지나간다",
        effect: { time: 4, capital: 4, trust: 3, legitimacy: -4, humanCost: 4, fatigue: -4 },
        next: "c41_chamber",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c41_chamber",
      },
    ],
  },
  c41_chamber: {
    phase: "HEARING",
    title: "스물두 번째",
    speaker: "차지원",
    text:
      "10시 정각, 증인 선서를 마친 윤상혁이 마이크를 손가락 한 마디만큼 당깁니다. 첫 의원이 해온파트너스 자문료(조언값이라며 내보낸 돈)를 묻자 '기억나지 않습니다.' 두 번째 의원이 트리거랩 반응 기록을 묻자 '기억나지 않습니다.' 방청석의 오진우가 휴대폰 메모장에 바를 정 자를 긋습니다. 정오까지 스물두 번. 오진우의 열아홉은 이미 졌고, 권도현의 스물셋까지 한 번 남았습니다. 정회 직전 차지원이 쪽지를 밀어 넣습니다. '정회 끝나고 첫 1분이 당신 거예요. 저 사람은 스물세 번째 대답을 벌써 준비해 왔어요. 그 대답이 틀린 말이 되는 질문을 하세요.' 책상 위에는 서류가 셋입니다. 백아린이 건넨 빈 서명란 원본의 수신 기록(서류를 누가 언제 받았는지 남은 기록), 윤서진의 가방 속 아버지 수첩, 그리고 KD캐피탈이 핏스코어에 넣은 40억의 투자 승인서.",
    memo: [
      "'기억나지 않습니다' 22회 -- 정회 전까지",
      "내기: 오진우 19 탈락, 권도현 23 대기",
      "서류: 수신 기록 · 수첩 · 핏스코어 투자 승인서",
      "참고인 질문 1분 -- 정회 직후",
    ],
    triggers: ["injustice", "choice", "system"],
    choices: [
      {
        id: "c41_chamber_notebook",
        label: "윤서진의 동의를 받아 아버지 수첩의 한 줄을 꺼낸다",
        effect: { trust: 9, legitimacy: 6, humanCost: 4, time: -5, fatigue: 6 },
        next: "c41_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c41_chamber_receipt",
        label: "수신 기록 한 장으로 그가 그 서류를 받았다는 것부터 확인시킨다",
        effect: { legitimacy: 12, trust: 3, time: -5, capital: -3, fatigue: 5 },
        next: "c41_final",
        cognition: { inference: 2 },
      },
      {
        id: "c41_chamber_invest",
        label: "핏스코어 40억 투자 승인서를 꺼내 오늘 뉴스를 잡는다",
        effect: { capital: 8, time: 3, legitimacy: 4, trust: -3, humanCost: 4, fatigue: -2 },
        next: "c41_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c41_final",
      },
    ],
  },
  c41_final: {
    phase: "FINAL DECISION",
    title: "하나의 질문",
    speaker: "차지원",
    text:
      "14시 속개. 서태린 위원장이 초시계 두 개를 나란히 세웁니다. '참고인과 증인의 대질신문(말이 엇갈리는 두 사람을 마주 세워 묻는 방식)을 1분간 허용합니다.' 증인석과 참고인석 사이는 네 걸음입니다. 윤상혁이 처음으로 당신 쪽으로 몸을 돌립니다. 방청석 셋째 줄에 문가을과 윤서진이 나란히 앉아 있고, 맨 끝자리의 문하준은 떡방 앞치마를 벗어 무릎에 접어 두었습니다. 카메라 빨간 불이 일제히 켜집니다. 차지원이 초시계를 누릅니다. 60초. 어떤 질문을 하든 그가 준비해 온 대답은 '기억나지 않습니다'일 겁니다. 남은 문제는 하나입니다. 그 대답이 이 방에서 무엇이 되느냐.",
    memo: [
      "대질신문 1분 -- 질문 1개",
      "'기억나지 않습니다' 22회, 권도현의 내기까지 1회",
      "방청석: 문가을 · 윤서진 · 문하준",
      "이 질문은 시즌 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c41_final_name",
        label: "방청석을 가리키며 저분 남편의 이름을 아느냐고 묻는다",
        effect: { trust: 13, humanCost: -6, legitimacy: 3, capital: -5, time: -4, fatigue: 6 },
        next: "case41_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c41_final_page",
        label: "서명란이 빈 3페이지를 들고 이 칸의 주인이 누구냐고 묻는다",
        effect: { legitimacy: 13, trust: 5, capital: -6, time: -5, humanCost: 3, fatigue: 5 },
        next: "case41_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c41_final_chair",
        label: "질문을 위원장에게 돌려 그 위의 결정권자를 증인으로 부르자고 한다",
        effect: { capital: 6, legitimacy: 6, trust: 2, time: -3, humanCost: 3, fatigue: 2 },
        next: "case41_result",
        cognition: { reframing: 3 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case41_result",
      },
    ],
  },
};

/**
 * Everything else case 41 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case41 = {
  id: "case41",
  nodes: case41Nodes,
  aftermath: {
    c41_aftershock: {
      phase: "AFTERMATH",
      title: "스물세 번",
      speaker: "권도현",
      text: "청문회는 18시 40분에 끝납니다. 속기록(오간 말을 그대로 적은 공식 기록)에 남은 '기억나지 않습니다'는 정확히 스물세 번, 마지막 한 번은 당신의 1분 안에서 나왔습니다. 내기에서 이긴 권도현은 강태민에게 컵라면 한 상자를 받고 '상금에 세금이 붙는지 알아보겠습니다'라고 합니다. 국회 정문 앞에서 윤서진이 아버지의 차에 타지 않고 돌아서서, 문가을의 빈 떡 상자를 대신 들어 줍니다. 여의도 포장마차에서 차지원이 처음으로 삼각김밥이 아닌 밥을 먹습니다. 두 그릇째입니다. 잔이 한 바퀴 돌았을 때 강태민이 짧게 말합니다. '다음엔 서류 없는 데서 봅시다.'",
      memo: ["속기록: '기억나지 않습니다' 23회", "내기 승자 권도현 -- 상금 컵라면 1상자", "위원회, 위증 고발 여부 다음 주 의결", "강태민: '다음엔 서류 없는 데서'"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c41_after_warm", label: "포장마차에 남아 오늘 방청 온 사람들과 끝까지 잔을 비운다", effect: { trust: 12, humanCost: -5, time: -2, capital: -3, fatigue: -7 }, next: "case41_result", cognition: { reframing: 2 } },
        { id: "c41_after_record", label: "스물세 번의 대답을 그날 서류와 맞춰 표로 남긴다", effect: { legitimacy: 14, trust: 3, time: -5, capital: -2, fatigue: 6 }, next: "case41_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c41_after_rush", label: "청문회장을 나서자마자 곧장 사무실로 돌아가 다음 싸움을 준비한다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 5, fatigue: 5 }, next: "case41_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c41_final", "c41_aftershock"],
  connectiveScenes: [
    ["c41_questions", "c41_drill", "c41_corridor", "질문함 1,112개", "도윤하", "강서지점 창구 문을 열기 전, 도윤하가 휴대폰을 내밉니다. 어젯밤 피해자 모임 단체방에 '윤상혁 대표에게 묻고 싶은 질문 한 줄씩'이라는 공지를 올렸고, 아침까지 1,112개가 달렸습니다. 절반은 욕이고, 나머지 절반은 이상할 만큼 구체적입니다. '우리 공장 담보는 누가 추가하라고 했어요?' '제 적금 만기일은 기억하세요?' 문가을의 질문은 여덟 글자입니다. '우리 남편 이름 알아요?' 도윤하가 화면을 끄지 못합니다. '질문은 하나밖에 못 하잖아요. 나머지 천백열한 개는 어디로 가요?'", ["하룻밤 질문 1,112개 -- 절반은 욕", "문가을: '우리 남편 이름 알아요?'", "참고인 질문은 1개"], ["문가을의 여덟 글자를 그대로 가져가겠다고 약속한다", "질문 1,112개를 분류해 위원회에 서면 질의로 낸다", "모집은 오늘 닫고 질문 한 줄에만 집중한다"]],
    ["c41_gallery", "c41_corridor", "c41_chamber", "떡 반입 금지", "문가을", "방청석 입구 보안 검색대에서 문가을이 멈춰 섭니다. 떡 상자 세 개가 걸렸습니다. 국회 방호원이 '음식물은 반입할 수 없습니다'라고 하자, 문가을의 존댓말이 또렷해집니다. '이건 음식이 아니라 1,740명이에요.' 나준혁이 30년 창구 말투로 협상을 시작하고, 강태민은 '증거를 줄이겠다'며 그 자리에서 인절미 세 개를 먹습니다. 결국 떡은 보관함으로 갑니다. 그런데 방청권은 마흔 장이고, 피해자 모임과 41점 모임에서 온 사람은 여든두 명입니다. 절반은 복도 모니터 앞에 남아야 합니다.", ["떡 3상자 -- 보관함 17번", "방청권 40장, 온 사람 82명", "강태민, 인절미 3개로 '증거 인멸' 시도"], ["동료들의 방청권을 피해자 모임 사람들에게 넘긴다", "방청권 배정 기준을 공개하라고 국회 사무처에 요구한다", "먼저 줄 선 순서대로 들여보내고 개회를 기다린다"]],
    ["c41_recess", "c41_chamber", "c41_final", "정회 10분", "차지원", "정회. 청문회장 뒤 복도에서 차지원이 삼각김밥을 두 입에 먹고 포장지를 반으로 접습니다. '의원님은 이름을 원해요. 작년처럼. 윤상혁이 지웠다, 한 문장. 그게 내일 1면이에요.' 그가 휴대폰을 보여 줍니다. 그룹 홍보실이 방금 기자들에게 돌린 문자입니다. '윤상혁 대표는 개인 자격으로 출석했으며 그룹과는 무관합니다.' 차지원이 웃지도 않고 말합니다. '보세요, 벌써 꼬리를 자르고 있어요. 이름만 말하면 그 사람 하나로 끝나요. 그게 당신이 원하는 거예요?'", ["의원실 요청: '윤상혁이 지웠다' 한 문장", "그룹 홍보실 문자: '개인 자격 출석'", "정회 종료까지 10분"], ["이름 대신 피해자 한 사람의 이야기로 1분을 열겠다고 한다", "그룹 홍보실 문자를 위원회 자료로 제출해 달라고 한다", "의원실이 원하는 한 문장을 그대로 받아들인다"]],
  ],
  connectiveOrder: [["c41_drill", "c41_questions"], ["c41_corridor", "c41_gallery"], ["c41_chamber", "c41_recess"]],
  choiceEffects: {
    c41_drill: [
      { trust: 11, humanCost: -4, legitimacy: 2, time: -4, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -5, humanCost: -2, capital: -2, fatigue: 4 },
      { time: 5, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c41_corridor: [
      { trust: 12, humanCost: -5, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 2, time: -4, humanCost: 2, capital: -1, fatigue: 3 },
      { time: 5, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c41_chamber: [
      { trust: 10, humanCost: -4, legitimacy: 3, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -3, capital: -2, fatigue: 3 },
      { capital: 6, time: 4, trust: -2, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c41_drill: {
      voice: ["문가을의 여덟 글자를, 그대로 가져가겠다고 약속한다.", "질문 1,112개를 분류해서, 위원회에 서면 질의로 낸다.", "모집은 오늘 닫고, 질문 한 줄에만 집중하자고 한다."],
      echo: ["약속하면 문가을이 '진짜 물어요?'라고 세 번 묻습니다. 나머지 천백열한 개는 단체방에 그대로 남습니다.", "서면 질의는 속기록에 붙습니다. 방송에는 나가지 않고, 답변 기한은 청문회가 끝난 뒤입니다.", "모집이 닫히자 단체방이 조용해집니다. 조용해진 사람들 중 몇은 다음에도 질문을 보내지 않을 겁니다."],
    },
    c41_corridor: {
      voice: ["동료들의 방청권을, 피해자 모임 사람들에게 넘긴다.", "방청권 배정 기준을 공개하라고, 국회 사무처에 요구한다.", "먼저 줄 선 순서대로 들여보내고, 개회를 기다린다."],
      echo: ["넘기면 동료들은 복도 모니터 앞에 섭니다. 강태민은 모니터 앞 의자를 문간까지 날라 줄을 세웁니다.", "기준을 물으면 사무처가 '관례'라고 답합니다. 관례는 적혀 있지 않아서 반박하기도 어렵습니다.", "줄 순서대로 들어가면 새벽 첫차를 탄 사람들이 앉습니다. 늦게 온 문가을의 이웃 셋은 복도에 남습니다."],
    },
    c41_chamber: {
      voice: ["이름 대신, 피해자 한 사람의 이야기로 1분을 열겠다고 한다.", "그룹 홍보실 문자를, 위원회 자료로 제출해 달라고 한다.", "의원실이 원하는 한 문장을, 그대로 받아들인다."],
      echo: ["차지원이 한숨을 쉽니다. '4면이네요.' 그리고 질의서 여백에 문가을의 이름을 적습니다.", "제출된 문자는 속기록에 붙습니다. 그룹이 꼬리를 자른 시각이 11시 52분으로 남습니다.", "한 문장은 1면이 됩니다. 그 1면에는 윤상혁 한 사람만 있고, 그 위에는 아무도 없습니다."],
    },
  },
  reactionScenes: [
    ["c41_questions_reaction", "c41_questions", "c41_corridor", "41점의 질문", "문하준", "그날 오후, 떡방 아르바이트 사흘째인 문하준이 앞치마 차림으로 헌책방에 옵니다. 핏스코어 결과지를 스케치북 사이에 끼워 왔습니다. '41점 모임 사람들이 물어봐 달래요. 우리 점수를 깎은 기준이 누구 기록인지.' 하준이 잠깐 머뭇거리다 웃습니다. '근데 그 기준이 당신 기록이라면서요. 망설인 9초요. 저는 그게 좀 좋았어요. 닮았다는 거요.' 그가 스케치북을 덮습니다. '청문회 가도 돼요? 그 사람 얼굴 보고 싶어요. 욕은 안 할게요. 아마도요.'", ["문하준을 방청석에 데려가겠다고 약속한다", "결과지를 핏스코어 자료로 위원회에 함께 낸다", "원서 마감이 먼저라며 이번엔 떡방에 있으라고 한다"]],
    ["c41_gallery_reaction", "c41_gallery", "c41_chamber", "옆자리", "윤서진", "방청석 좌석표는 신청 순서대로입니다. 문가을의 옆자리가 윤서진입니다. 두 사람 다 좌석표를 두 번 확인합니다. 윤서진이 먼저 일어나 고개를 숙입니다. '제가 자리를 바꿀게요.' 문가을은 대답 대신 가방에서 인절미 하나를 꺼내 내밉니다. 보관함에 다 맡긴 줄 알았던 떡입니다. '앉아요. 딸이 무슨 죄예요. 근데 아버지 대답은 똑바로 들어요. 나도 똑바로 들을 거니까.' 윤서진이 떡을 받아 쥔 채 앉습니다. 개회 2분 전입니다.", ["두 사람이 나란히 앉도록 그대로 둔다", "좌석 문제를 방청 담당자에게 알려 공식적으로 조정한다", "신경 쓸 틈이 없다며 참고인석으로 먼저 들어간다"]],
    ["c41_recess_reaction", "c41_recess", "c41_final", "다섯 달의 파일", "한서윤", "정회가 끝나기 3분 전, 방청석 뒷줄에서 한서윤이 내려옵니다. 4월부터 대기발령(일을 주지 않고 자리만 두는 인사 조치) 중이라 사원증 대신 방문증을 목에 걸었습니다. 그가 휴대폰을 당신 손에 쥐여 줍니다. 그때 그 통화의 녹취(녹음해 둔 통화 기록)입니다. '작년엔 이 파일이 당신 싸움이었어요. 오늘은 제 이름을 붙여서 쓰세요. 반려한 사람이 저라는 것까지 같이요.' 그의 손끝이 조금 떨립니다. '다섯 달 동안 일을 안 했더니, 이 파일 하나만 남았더라고요.'", ["한서윤의 이름은 지키고 녹취는 내 목소리로만 설명한다", "녹취를 한서윤 명의로 위원회에 정식 제출한다", "시간이 없다며 녹취 파일만 받아 둔다"]],
  ],
  reactionEffects: {
    c41_questions: [
      { trust: 10, humanCost: -4, time: -3, capital: -1, fatigue: 3 },
      { legitimacy: 8, trust: 3, humanCost: 3, time: -2, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, humanCost: 2, legitimacy: -5, fatigue: -3 },
    ],
    c41_gallery: [
      { trust: 10, humanCost: -3, time: -2, fatigue: 3 },
      { legitimacy: 6, trust: -2, humanCost: 2, time: -2, fatigue: 2 },
      { time: 4, capital: 2, trust: 3, humanCost: 3, legitimacy: -3, fatigue: -3 },
    ],
    c41_recess: [
      { trust: 11, humanCost: -5, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 11, trust: 4, humanCost: 4, time: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: -1, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c41_questions: {
      voice: ["문하준을, 방청석에 데려가겠다고 약속한다.", "결과지를, 핏스코어 자료로 위원회에 함께 낸다.", "원서 마감이 먼저라며, 이번엔 떡방에 있으라고 한다."],
      echo: ["약속하면 하준이 앞치마를 벗어 가방에 접어 넣습니다. 그날 떡방은 문가을 혼자 봅니다.", "결과지가 자료가 되면 하준의 41점에 사건 번호가 붙습니다. 하준은 그 번호를 스케치북에 옮겨 적습니다.", "하준이 고개를 끄덕이고 돌아섭니다. 청문회 날 떡방 라디오 볼륨이 평소보다 두 칸 높습니다."],
    },
    c41_gallery: {
      voice: ["두 사람이, 나란히 앉도록 그대로 둔다.", "좌석 문제를 방청 담당자에게 알려, 공식적으로 조정한다.", "신경 쓸 틈이 없다며, 참고인석으로 먼저 들어간다."],
      echo: ["그대로 두면 두 사람은 개회 내내 한 번도 서로를 보지 않습니다. 인절미는 윤서진의 손에서 끝까지 식어 갑니다.", "자리가 바뀌면 문가을이 조금 서운한 얼굴을 합니다. '떡 줬잖아요. 그럼 된 거지.'", "참고인석에서 돌아보면 두 사람이 같은 방향을 보고 있습니다. 무슨 말이 오갔는지 당신은 끝내 모릅니다."],
    },
    c41_recess: {
      voice: ["한서윤의 이름은 지키고, 녹취는 내 목소리로만 설명한다.", "녹취를 한서윤 명의로, 위원회에 정식 제출한다.", "시간이 없다며, 녹취 파일만 받아 둔다."],
      echo: ["이름을 지키면 한서윤은 방청석에 그대로 앉아 있습니다. 파일 속 목소리만 당신의 설명을 따라 방에 나옵니다.", "명의가 붙으면 녹취는 증거가 되고 한서윤은 증인 후보가 됩니다. 그가 방문증을 벗지 않고 끝까지 앉아 있습니다.", "받아 두기만 하면 파일은 당신 휴대폰에 남습니다. 한서윤은 빈손으로 뒷줄로 돌아갑니다."],
    },
  },
  reactionMemos: {
    c41_questions_reaction: ["점수를 깎은 기준이 된 9초", "'닮았다는 게 좋았어요'"],
    c41_gallery_reaction: ["피해자의 아내와 증인의 딸, 옆자리", "보관함을 빠져나온 인절미 하나"],
    c41_recess_reaction: ["대기발령 다섯 달, 남은 파일 하나", "반려한 사람의 이름까지 같이"],
  },
  branchPlan: ["c41_drill", 1, "c41_branch_study", "c41_branch_study_follow"],
  branchScenes: {
    // CASE 41's detour is the witness's own house. The case asks what a question
    // is for when the answer is rehearsed; the side door is the person who has
    // been listening to the rehearsal through a study door.
    c41_branch_study: {
      phase: "SIDE DOOR",
      title: "서재 문 너머",
      speaker: "윤서진",
      text: "모의 청문회가 끝난 밤 11시, 윤서진이 헌책방 앞 골목으로 찾아옵니다. 대학원 가방에 아버지 서재에서 들고 나온 수첩이 들어 있습니다. '아빠가 매일 밤 서재에서 연습해요. 변호사님이 질문을 읽으면 아빠가 대답하고요. 문 너머로 세어 봤어요. 어젯밤에만 스물세 번이었어요. 기억나지 않습니다.' 그가 가방끈을 꽉 쥡니다. '기억 못 하는 사람은 연습을 안 해요. 저 그거 알려 드리러 왔어요. 그리고 이것도요.' 가방 지퍼가 반쯤 열립니다.",
      memo: ["윤서진: 금융윤리 대학원생, 윤상혁의 딸", "서재 연습 -- 하룻밤 '기억나지 않습니다' 23회", "가방 속: 아버지의 2023년 수첩", "청문회까지 사흘"],
      triggers: ["affection", "helplessness", "curiosity"],
      choices: [
        { id: "c41_branch_study_a", label: "서진 씨가 오늘 무엇을 원하는지부터 끝까지 듣는다", effect: { trust: 11, humanCost: -3, time: -4, capital: -2, fatigue: 4 }, next: "c41_branch_study_follow", cognition: { reframing: 2 } },
        { id: "c41_branch_study_b", label: "서재에서 들은 연습을 날짜와 함께 진술서로 적어 두자고 한다", effect: { legitimacy: 11, trust: 2, humanCost: 3, time: -3, capital: -2, fatigue: 4 }, next: "c41_branch_study_follow", cognition: { inference: 2 } },
        { id: "c41_branch_study_c", label: "아버지 일은 아버지 일이라며 오늘은 그냥 돌려보낸다", effect: { time: 4, capital: 3, trust: -4, humanCost: 4, fatigue: -3 }, next: "c41_branch_study_follow", cognition: { risk: 1 } },
      ],
    },
    c41_branch_study_follow: {
      phase: "SIDE DOOR",
      title: "보관 X",
      speaker: "윤서진",
      text: "골목 가로등 아래서 윤서진이 수첩을 폅니다. 7월에 사진 한 장으로만 보여 줬던 그 줄이 아버지 글씨 그대로 있습니다. '0412 — 반대 의견 — 보관 X.' 같은 주 금요일 칸에는 '온 개관 — 서진 등록금 확인.' 윤서진이 웃는데 눈이 먼저 젖습니다. '처음엔 이 수첩으로 아빠를 지키고 싶었어요. 기억 못 한 게 아니라 알고 있었다는 걸 보여 주면, 적어도 거짓말쟁이는 아니잖아요. 이상하죠. 그게 제가 해 줄 수 있는 제일 좋은 변호래요.'",
      memo: ["0412: '반대 의견 — 보관 X'", "같은 주 금요일: '온 개관 — 서진 등록금 확인'", "수첩 원본은 윤서진이 보관", "윤서진: 청문회 방청 신청 완료"],
      triggers: ["affection", "responsibility", "selfAwareness"],
      choices: [
        { id: "c41_branch_study_follow_a", label: "수첩을 쓸지는 서진 씨가 청문회 날 직접 정하게 한다", effect: { trust: 12, humanCost: -5, legitimacy: 2, time: -3, fatigue: 5 }, next: "c41_questions", cognition: { reframing: 2 } },
        { id: "c41_branch_study_follow_b", label: "수첩 사본을 공식 증거로 위원회에 먼저 제출한다", effect: { legitimacy: 12, trust: -3, humanCost: 5, time: -3, fatigue: 3 }, next: "c41_questions", cognition: { inference: 2 } },
        { id: "c41_branch_study_follow_c", label: "수첩은 쓰지 않겠다며 가방에 도로 넣어 준다", effect: { time: 3, capital: 4, trust: 4, legitimacy: -5, humanCost: 3, fatigue: -3 }, next: "c41_questions", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c41_start",
    result: "c41_aftershock",
    defaultFree: "c41_route_system",
    // One room, one minute, one question. Like 사건 11 the case is a single line;
    // the split is what the rehearsed answer turns into.
    choices: {},
    system: {
      route: "c41_route_system",
      final: "c41_final_system_route",
      title: "기억의 통계",
      speaker: "이민서",
      text: "준비된 보기 밖의 문장을 쓰자 이민서가 노트북을 돌려 보입니다. 밤새 국회 회의록 공개 자료를 긁어모았습니다. 지난 20년 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 속기록(오간 말을 그대로 적은 공식 기록) 1,406건에서 '기억나지 않습니다'와 비슷한 말이 6,212번 나왔습니다. 그중 위증(선서한 증인이 거짓으로 말하는 것)으로 고발된 건 14건, 유죄가 확정된 건 2건입니다. 이민서가 화면을 닫습니다. '기억이 안 난다는 말은 거짓이라고 증명할 수가 없어요. 그래서 제일 안전한 대답이에요. 다들 알고 쓰는 거예요.'",
      memo: ["청문회 속기록 1,406건 -- '기억나지 않습니다' 계열 6,212회", "위증 고발 14건, 유죄 확정 2건", "이 통계는 어느 청문회 자료에도 인용된 적 없음"],
      routeChoices: [
        ["c41_route_system_share", "통계를 위원 전원과 방청석에 동시에 돌린다", { legitimacy: 10, trust: 6, capital: -4, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c41_route_system_reframe", "기억을 묻는 질문 대신 서류가 대답하는 질문으로 바꾼다", { legitimacy: 8, trust: 4, capital: 3, time: -6, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c41_route_system_skip", "통계는 기사로 넘기고 청문회는 예정대로 간다", { time: 7, capital: 6, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "기억나지 않는다는 대답마다 그날의 서류를 한 장씩 올려놓는다", { legitimacy: 13, trust: 6, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["b", "그 대답을 위증 고발 요건과 함께 속기록에 남기게 한다", { legitimacy: 9, capital: 5, trust: -4, time: -4, humanCost: 4, fatigue: 3 }, { risk: 2 }],
      ["c", "1분을 서류 없는 212명의 이름을 읽는 데 쓴다", { trust: 12, humanCost: -6, legitimacy: -3, capital: -5, time: -5, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c41_evidence_turn",
    result: "c41_aftershock",
    sourceRoutes: ["c41_drill", "c41_corridor", "c41_chamber", "c41_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 오전 속기록 옆에 놓고, '기억나지 않습니다'가 나온 자리마다 그날의 서류를 맞춰 본다.",
    entryEcho: "맞춰 보면 기억이 비어 있는 자리마다 서류가 서 있습니다. 서류는 기억과 달리 고를 수 없습니다.",
    title: "기억의 날짜표",
    speaker: "반재욱",
    text: "정회 시간, 청문회장 뒤 자료실에서 반재욱이 수첩을 펴고 표 하나를 내밉니다. 오전 속기록(오간 말을 그대로 적은 공식 기록)에서 윤상혁이 '기억나지 않습니다'라고 답한 스물두 번을 한 줄씩 옮기고, 옆 칸에 그 질문이 가리키는 날짜의 서류를 붙였습니다. 스물두 줄 중 열아홉 줄에 그날 윤상혁이 직접 받았거나 서명한 문서가 있습니다. 빈 서명란 원본의 수신 기록(서류를 누가 언제 받았는지 남은 기록), 해온파트너스 자문료(조언값이라며 내보낸 돈) 지급 확인서, 핏스코어 투자 승인서. 반재욱이 펜을 내려놓습니다. '기억은 안 날 수 있습니다. 서명은 안 지워집니다.'",
    memo: ["오전 '기억나지 않습니다' 22회", "그중 19회: 그날 윤상혁이 받거나 서명한 문서 있음", "남은 3회: 문서 없음 -- 정말 모를 수도 있음"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 6, trust: 4, time: -3, capital: -2, fatigue: 3 },
    choices: [
      ["c41_evidence_turn_submit", "날짜표 전체를 위원장에게 내고 위증 고발을 요청한다", { legitimacy: 13, trust: 5, capital: -6, time: -7, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c41_evidence_turn_one", "열아홉 줄 중 한 줄만 골라 질문 하나에 싣는다", { trust: 9, legitimacy: 8, capital: -4, time: -4, humanCost: 3, fatigue: 5 }, { reframing: 2 }],
      ["c41_evidence_turn_court", "날짜표는 다음 달 배임 재판부로 곧장 보낸다", { capital: 8, time: 5, legitimacy: 4, trust: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c41_branch_study",
    systemNext: "c41_route_system",
    evidenceNext: "c41_evidence_turn",
    routeLabel: "직전 사건의 41점 모임 명단으로 방청석을 채운다",
    systemLabel: "직전 자유응답 문장이 청문회 질의서에도 들어갔는지 본다",
    evidenceLabel: "직전 단서를 붙여 '기억나지 않습니다'마다 날짜를 맞춘다",
  },
  openingRoutes: {
    c40_after_warm: "c41_start_warm",
    c40_after_record: "c41_start_record",
    c40_after_rush: "c41_start_rush",
  },
  openingCopy: {
    c41_start_warm: ["떡방 셔터를 내린 사람의 청문회", "문하준", "떡방 셔터를 내리고 하준의 첫 시급 봉투를 같이 센 그 주, 국회 정무위원회가 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 일정을 확정합니다. 증인 윤상혁, 이번에는 출석. 당신은 다시 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)이고, 질문은 하나입니다. 하준이 단체방에 한 줄을 올립니다. '방청은 어떻게 신청해요? 41점 모임 사람들이 다 가고 싶대요. 저 금요일은 알바 빼 달라고 할게요. 사장님이 엄마라서 괜찮아요.'", ["첫 시급 봉투: 문가을 글씨 '100점'", "청문회 D-4 -- 증인 윤상혁 출석 통보", "41점 모임, 방청 희망자 속출"]],
    c41_start_record: ["명단을 묶은 사람의 청문회", "차지원", "41점 모임 1,106명의 명단을 동의서와 함께 묶어 보낸 지 사흘, 의원회관 7층 자료철 맨 앞에 그 문서가 끼워져 있습니다. 국회 정무위원회가 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 일정을 확정했고, 증인 윤상혁은 이번에 출석합니다. 당신은 다시 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)입니다. 차지원이 자료철을 톡톡 두드립니다. '서류 잘 쓰시네요. 근데 1,106명은 7분에 안 들어가요. 이번엔 이 서류가 질문 하나가 돼야 해요.'", ["41점 모임 명단 1,106명 -- 의원실 접수", "청문회 D-4 -- 증인 윤상혁 출석 통보", "참고인 질문 기회 1개"]],
    c41_start_rush: ["인절미를 든 사람의 청문회", "차지원", "가방에 인절미를 넣은 채 의원회관 7층에 도착했을 때, 차지원은 이미 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 증인 명단을 출력하고 있었습니다. 첫 줄은 윤상혁, 이번에는 출석. 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람) 칸은 아직 비어 있습니다. 차지원이 인절미 냄새부터 알아채고 하나를 집은 뒤 볼펜을 내밉니다. '일찍 오셨으니 이름은 직접 쓰세요. 대신 일찍 온 사람이 제일 먼저 공격받아요. 저 사람 변호인들, 벌써 당신 인사 기록을 떼 갔대요.'", ["의원회관 7층 도착 -- 인절미 1개 차지원 몫", "참고인 칸 빈칸 -- 직접 기재", "윤상혁 측, 당신의 인사 기록 열람"]],
  },
  openingSignatures: {
    c41_start_warm: {
      label: "41점 모임 사람들과 방청 신청서를 한 장씩 같이 쓴다",
      effect: { trust: 12, humanCost: -5, capital: -2, time: -7, fatigue: 5 },
      cognition: { reframing: 2 },
      voice: "41점 모임 사람들과, 방청 신청서를 한 장씩 같이 쓴다.",
      echo: "같이 쓰면 신청서가 여든두 장이 됩니다. 방청권은 마흔 장뿐이라는 걸 아는 사람은 아직 당신뿐입니다.",
    },
    c41_start_record: {
      label: "1,106명의 명단을 질문 하나로 줄이는 작업부터 한다",
      effect: { legitimacy: 12, trust: 2, time: -7, capital: -2, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "1,106명의 명단을, 질문 하나로 줄이는 작업부터 한다.",
      echo: "줄이는 동안 이름이 하나씩 빠집니다. 마지막에 남는 한 줄에는 누구의 이름도 없습니다.",
    },
    c41_start_rush: {
      label: "참고인 칸에 내 이름을 직접 쓰고 첫 순서를 받는다",
      effect: { capital: 5, time: 4, legitimacy: 3, trust: -4, humanCost: 4, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "참고인 칸에 내 이름을 직접 쓰고, 첫 순서를 받는다.",
      echo: "첫 순서는 당신 것이 됩니다. 저쪽 변호인들이 당신의 인사 기록을 읽을 시간도 그만큼 깁니다.",
    },
  },
  voiceLines: {
    // CASE 41. One minute, one question, an answer already rehearsed. Every line
    // is said in a room where it will be written down.
    c41_start_team: "혼자 준비하지 않겠다며, 흩어진 동료들을 불러 청문회 준비를 함께 한다.",
    c41_start_timeline: "윤상혁의 지난 발언과 서류를, 날짜순으로 하나씩 맞춘다.",
    c41_start_office: "의원실로 곧장 가서, 질의 순서부터 잡아 둔다.",
    c41_drill_victims: "피해자들이 묻고 싶은 질문을 모아서, 그중 하나를 고른다.",
    c41_drill_paper: "기억이 안 난다고 할 수 없는, 서류 질문만 추린다.",
    c41_drill_hand: "질문 초안은 의원실에 맡기고, 증거 정리에만 집중한다.",
    c41_branch_study_a: "서진 씨가 오늘 무엇을 원하는지부터, 끝까지 듣는다.",
    c41_branch_study_b: "서재에서 들은 연습을, 날짜와 함께 진술서로 적어 두자고 한다.",
    c41_branch_study_c: "아버지 일은 아버지 일이라며, 오늘은 그냥 돌려보낸다.",
    c41_branch_study_follow_a: "수첩을 쓸지는, 서진 씨가 청문회 날 직접 정하게 한다.",
    c41_branch_study_follow_b: "수첩 사본을, 공식 증거로 위원회에 먼저 제출한다.",
    c41_branch_study_follow_c: "수첩은 쓰지 않겠다며, 가방에 도로 넣어 준다.",
    c41_corridor_daughter: "윤서진을 먼저 찾아가, 오늘 무엇을 묻게 될지 미리 말해 준다.",
    c41_corridor_report: "복도에서 오간 말을 그대로 적어, 위원장실에 알린다.",
    c41_corridor_cup: "커피는 받지 않고, 한마디 없이 지나간다.",
    c41_chamber_notebook: "윤서진의 동의를 받아, 아버지 수첩의 한 줄을 꺼낸다.",
    c41_chamber_receipt: "수신 기록 한 장으로, 그가 그 서류를 받았다는 것부터 확인시킨다.",
    c41_chamber_invest: "핏스코어 40억 투자 승인서를 꺼내, 오늘 뉴스를 잡는다.",
    c41_final_name: "방청석을 가리키며, 저분 남편의 이름을 아느냐고 묻는다.",
    c41_final_page: "서명란이 빈 3페이지를 들고, 이 칸의 주인이 누구냐고 묻는다.",
    c41_final_chair: "질문을 위원장에게 돌려, 그 위의 결정권자를 증인으로 부르자고 한다.",
    c41_after_warm: "포장마차에 남아, 오늘 방청 온 사람들과 끝까지 잔을 비운다.",
    c41_after_record: "스물세 번의 대답을, 그날 서류와 맞춰 표로 남긴다.",
    c41_after_rush: "청문회장을 나서자마자, 곧장 사무실로 돌아가 다음 싸움을 준비한다.",
    c41_route_system_share: "이 통계를, 위원 전원과 방청석에 동시에 돌린다.",
    c41_route_system_reframe: "기억을 묻는 질문 대신, 서류가 대답하는 질문으로 바꾼다.",
    c41_route_system_skip: "통계는 기사로 넘기고, 청문회는 예정대로 간다.",
    c41_final_system_route_a: "기억나지 않는다는 대답마다, 그날의 서류를 한 장씩 올려놓는다.",
    c41_final_system_route_b: "그 대답을, 위증 고발 요건과 함께 속기록에 남기게 한다.",
    c41_final_system_route_c: "1분을, 서류 없는 212명의 이름을 읽는 데 쓴다.",
    c41_evidence_turn_submit: "날짜표 전체를 위원장에게 내고, 위증 고발을 요청한다.",
    c41_evidence_turn_one: "열아홉 줄 중 한 줄만 골라, 질문 하나에 싣는다.",
    c41_evidence_turn_court: "날짜표는, 다음 달 배임 재판부로 곧장 보낸다.",
  },
  echoReplies: {
    // CASE 41.
    c41_start_team: "부르면 여섯 곳에서 여섯 명이 옵니다. 퇴근길이 제각각이라 첫 회의는 밤 아홉 시에야 시작됩니다.",
    c41_start_timeline: "날짜를 맞추면 윤상혁이 '기억나지 않을' 날들이 미리 보입니다. 그 표를 만드는 데 이틀 밤이 듭니다.",
    c41_start_office: "순서는 빨리 잡힙니다. 순서를 잡은 사람의 질문은 의원실이 먼저 고쳐 씁니다.",
    c41_drill_victims: "모으면 질문이 쏟아집니다. 하나를 고르는 순간, 고르지 않은 사람들이 생깁니다.",
    c41_drill_paper: "서류 질문은 단단합니다. 단단한 질문은 방송에서 40초를 넘기기 어렵습니다.",
    c41_drill_hand: "의원실은 질문을 잘 씁니다. 다만 그 질문의 마지막 줄은 의원실이 원하는 문장입니다.",
    c41_branch_study_a: "끝까지 들으면 윤서진은 수첩 이야기를 꺼내기까지 40분이 걸립니다. 그 40분이 그에게는 필요했습니다.",
    c41_branch_study_b: "진술서가 되면 윤서진의 이름이 서류에 오릅니다. 그는 펜을 들었다가 한 번 내려놓습니다.",
    c41_branch_study_c: "돌려보내면 윤서진은 골목 끝에서 한 번 돌아봅니다. 가방 지퍼는 끝까지 닫혀 있습니다.",
    c41_branch_study_follow_a: "정하게 두면 수첩은 윤서진의 가방에 남습니다. 그 가방이 청문회장에 들어올지는 그날 아침에야 압니다.",
    c41_branch_study_follow_b: "제출하면 수첩은 증거 번호를 받습니다. 윤서진은 아버지보다 먼저 그 번호를 알게 됩니다.",
    c41_branch_study_follow_c: "도로 넣으면 윤서진이 고맙다고 합니다. 그리고 청문회 날, 그 가방을 들고 방청석에 옵니다.",
    c41_corridor_daughter: "미리 말하면 윤서진은 방청석을 떠나지 않습니다. 대신 개회 내내 아버지의 등만 봅니다.",
    c41_corridor_report: "알리면 위원장이 개회 첫마디에 '증인의 참고인 접촉'을 경고합니다. 윤상혁은 표정 하나 바꾸지 않습니다.",
    c41_corridor_cup: "지나가면 종이컵이 그의 손에 남습니다. 그는 그 커피를 끝까지 마시지 않습니다.",
    c41_chamber_notebook: "수첩의 한 줄이 나오면 방청석 셋째 줄이 조용해집니다. 그 한 줄을 아는 사람이 둘 앉아 있습니다.",
    c41_chamber_receipt: "수신 기록은 반박할 수 없습니다. 받은 사람이 기억하지 못한다는 것만 빼고요.",
    c41_chamber_invest: "40억은 뉴스가 됩니다. 뉴스가 되는 순간 방청석의 1,740명은 화면 밖으로 밀려납니다.",
    c41_final_name: "그가 '기억나지 않습니다'라고 답합니다. 스물세 번째입니다. 방청석에서 문가을이 일어나 남편 이름을 또박또박 말하고, 속기록이 그 이름을 받아 적습니다.",
    c41_final_page: "그가 '기억나지 않습니다'라고 답합니다. 스물세 번째입니다. 빈칸 위의 대답이라, 그 대답 자체가 칸을 채운 첫 기록이 됩니다.",
    c41_final_chair: "위원장이 잠시 망설이다 '검토하겠습니다'라고 합니다. 윤상혁은 처음으로 대답할 필요가 없는 1분을 얻습니다.",
    c41_after_warm: "마지막 잔을 비울 때 포장마차에 열두 명이 남습니다. 문하준은 사이다로 건배를 세 번 합니다.",
    c41_after_record: "표는 스물세 칸입니다. 열아홉 칸에 그의 서명이 있고, 남은 네 칸은 당신도 모릅니다.",
    c41_after_rush: "사무실 불을 제일 늦게 끄는 날이 이어집니다. 포장마차 단체방에는 당신만 사진이 없습니다.",
    c41_route_system_share: "돌리면 방청석이 통계를 먼저 읽습니다. 증인석의 변호인도 같은 종이를 받아 읽습니다.",
    c41_route_system_reframe: "서류가 대답하는 질문에는 '기억나지 않습니다'가 대답이 되지 않습니다. 대신 준비할 시간이 모자랍니다.",
    c41_route_system_skip: "기사는 나옵니다. 청문회는 예정대로, 6,213번째 '기억나지 않습니다'와 함께 끝납니다.",
    c41_final_system_route_a: "서류가 쌓일수록 그의 대답이 짧아집니다. 스물세 번째는 거의 들리지 않습니다.",
    c41_final_system_route_b: "요건이 속기록에 남으면 고발은 절차가 됩니다. 절차는 느리고, 그 사이 1분은 끝납니다.",
    c41_final_system_route_c: "이름을 읽는 동안 윤상혁은 대답할 기회가 없습니다. 기억나지 않는다는 말도, 이번만은 나오지 않습니다.",
    c41_evidence_turn_submit: "제출하면 위원장이 위증 고발을 다음 주 안건으로 올립니다. 오늘 방송에는 이 표가 나오지 않습니다.",
    c41_evidence_turn_one: "한 줄은 날카롭습니다. 나머지 열여덟 줄은 반재욱의 수첩에 남습니다.",
    c41_evidence_turn_court: "재판부는 이 표를 받습니다. 국회 방청석의 사람들은 이 표가 있었다는 걸 모릅니다.",
  },
  characterProfiles: {
    서태린: {
      role: "국회 정무위원장 · 3선 의원",
      stance: "공정 · 절차 · 시간",
      job: "청문회의 시간을 나눈다. 누구 편도 들지 않으려고 초시계를 두 개 쓴다.",
      appearance: "은테 안경, 위원장석에 나란히 세운 초시계 두 개, 늘 한 칸 내려 맨 넥타이.",
      thought: "여기서 공평함은 시간뿐이다. 시간만큼은 누구에게도 1초 더 주지 않는다.",
      gesture: "서태린은 발언이 길어지면 말없이 초시계 하나를 들어 보인다.",
      voice: "낮고 느리게 말하지만, 시간이 끝나면 문장 중간이라도 끊는다.",
      line: "증인의 기억은 증인의 것입니다. 이 방의 1분은 모두의 것이고요.",
    },
  },
  setting: { place: "KD캐피탈 본사 · 대표이사실 앞 복도", clock: "8월 넷째 주 월요일 · 청문회 D-4" },
  sceneContext: {
    c41_start: {
      place: "KD캐피탈 본사 · 대표이사실 앞 복도",
      clock: "8월 넷째 주 월요일 · 청문회 D-4",
      question: "빈 의자였던 증인이 이번에는 준비를 끝내고 옵니다. 무엇부터 준비하겠습니까?",
      lead: "증인 명단이 공개된 날, 대표이사실 앞 복도에서 윤상혁이 당신에게 목례만 하고 지나갔습니다.",
    },
    c41_start_warm: {
      place: "망원시장 가을떡방 · 셔터 내린 가게 안",
      clock: "8월 넷째 주 월요일 · 청문회 D-4",
      question: "41점 모임 사람들이 모두 방청석에 가고 싶어 합니다. 이 마음을 어디부터 모으겠습니까?",
      lead: "첫 시급 봉투를 센 떡방에서, 하준이 단체방 알림을 소리 내어 읽습니다.",
    },
    c41_start_record: {
      place: "국회 의원회관 7층 · 의원실",
      clock: "8월 넷째 주 월요일 · 청문회 D-4",
      question: "1,106명의 명단이 7분에 들어가지 않습니다. 이 서류를 어떻게 질문으로 바꾸겠습니까?",
      lead: "의원실 자료철 맨 앞에서 당신이 묶어 보낸 문서를 발견했습니다.",
    },
    c41_start_rush: {
      place: "국회 의원회관 7층 · 의원실",
      clock: "8월 셋째 주 토요일 · 청문회 D-6",
      question: "참고인 칸이 비어 있고, 저쪽 변호인들은 이미 당신 기록을 읽고 있습니다. 먼저 무엇을 하겠습니까?",
      lead: "의원회관 7층 복도를 뛰어온 숨이 아직 가라앉지 않았습니다.",
    },
    c41_drill: {
      place: "회기동 헌책방 1층 · 책장 사이 모의 청문회",
      clock: "화요일 · 청문회 D-3 · 20시",
      question: "무엇을 물어도 '기억나지 않습니다'가 돌아옵니다. 단 하나의 질문을 어떻게 고르겠습니까?",
      lead: "흩어진 동료들이 퇴근길에 하나둘 헌책방 1층으로 모였습니다. 접이식 탁자 위에 명패 대신 종이컵이 놓였습니다.",
    },
    c41_branch_study: {
      place: "회기동 헌책방 앞 · 골목",
      clock: "청문회 D-3 · 23:00",
      question: "증인의 딸이 아버지의 연습을 문 너머로 세어 왔습니다. 이 방문을 어떻게 받겠습니까?",
    },
    c41_branch_study_follow: {
      place: "회기동 헌책방 앞 · 골목 가로등 아래",
      clock: "청문회 D-3 · 23:40",
      question: "수첩 한 주에 반대 의견과 딸의 등록금이 같이 적혀 있습니다. 이 수첩을 어떻게 하겠습니까?",
    },
    c41_questions: {
      place: "KD은행 강서지점 · 창구 개점 전",
      clock: "청문회 D-2 · 08:40",
      question: "하룻밤에 질문 1,112개가 모였고, 쓸 수 있는 건 하나입니다. 나머지는 어떻게 하겠습니까?",
    },
    c41_questions_reaction: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "청문회 D-2 · 16시",
      question: "당신을 닮아서 떨어진 고등학생이 증인의 얼굴을 보고 싶어 합니다. 뭐라고 하겠습니까?",
    },
    c41_corridor: {
      place: "국회 본관 3층 · 증인 대기실 앞 복도",
      clock: "8월 넷째 주 금요일 · 청문회 당일 09:20",
      question: "증인이 개회 전 복도에서 딸의 이름을 꺼냈습니다. 이 커피 한 잔에 어떻게 답하겠습니까?",
      lead: "복도 끝에서 KD캐피탈 로고가 찍힌 종이컵이 먼저 보입니다.",
    },
    c41_gallery: {
      place: "국회 본관 · 로비 보안 검색대",
      clock: "청문회 당일 · 09:45",
      question: "방청권은 마흔 장인데 여든두 명이 왔습니다. 누구를 들여보내겠습니까?",
    },
    c41_gallery_reaction: {
      place: "국회 정무위원회 회의실 · 방청석",
      clock: "청문회 당일 · 09:58",
      question: "피해자의 아내와 증인의 딸이 나란히 앉게 됐습니다. 이 옆자리를 어떻게 하겠습니까?",
    },
    c41_chamber: {
      place: "국회 정무위원회 회의실 · 청문회장 참고인석",
      clock: "청문회 당일 · 12:10 정회 직전",
      question: "'기억나지 않습니다'가 스물두 번 나왔고 서류는 셋입니다. 1분 앞에 어떤 서류를 놓겠습니까?",
      lead: "선서하는 윤상혁의 오른손은 한 번도 떨리지 않았습니다. 참고인석에서 그 손이 잘 보입니다.",
    },
    c41_recess: {
      place: "국회 본관 · 청문회장 뒤 복도",
      clock: "청문회 당일 · 정회 12:15",
      question: "의원실은 이름 한 문장을 원하고, 그룹은 벌써 꼬리를 자르고 있습니다. 어떻게 하겠습니까?",
    },
    c41_recess_reaction: {
      place: "국회 정무위원회 회의실 · 방청석 뒷줄",
      clock: "청문회 당일 · 13:57",
      question: "반려한 사람이 자기 이름까지 쓰라며 녹취를 건넵니다. 이 파일을 어떻게 쓰겠습니까?",
    },
    c41_route_system: {
      place: "회기동 헌책방 1층 · 책장 옆 노트북",
      clock: "청문회 D-1 · 02:30",
      question: "'기억나지 않습니다'는 20년 동안 가장 안전한 대답이었습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c41_final_system_route: {
      place: "국회 정무위원회 회의실 · 참고인석",
      clock: "청문회 당일 · 14:00 속개",
      question: "증명할 수 없는 대답을 증명할 수 있는 것으로 바꿀 수 있다면, 무엇으로 바꾸겠습니까?",
    },
    c41_evidence_turn: {
      place: "국회 본관 · 청문회장 뒤 자료실",
      clock: "청문회 당일 · 정회 13:20",
      question: "스물두 번의 '기억나지 않습니다' 중 열아홉 번에 그의 서명이 있습니다. 이 표를 어떻게 쓰겠습니까?",
    },
    c41_final: {
      place: "국회 정무위원회 회의실 · 증인석과 참고인석 사이",
      clock: "청문회 당일 · 14:00 속개",
      question: "60초, 질문 하나, 대답은 이미 정해져 있습니다. 무엇을 묻겠습니까?",
      lead: "정회가 끝나고, 참고인석 마이크에 다시 빨간 불이 들어옵니다.",
    },
    c41_aftershock: {
      place: "여의도 · 국회 앞 포장마차",
      clock: "청문회 당일 · 21시 · 열대야",
      question: "스물세 번의 '기억나지 않습니다'가 끝난 밤, 서류 없는 데서 보자는 말이 나왔습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c41-memory-table",
    title: "기억의 날짜표",
    text: "윤상혁이 '기억나지 않습니다'라고 답한 스물두 번 가운데 열아홉 번은, 그날 그가 직접 받았거나 서명한 문서가 남아 있었습니다.",
  },
  outcomes: {
    c41_after_warm: { tag: "끝까지 남은 결말", title: "청문회가 끝난 밤, 포장마차의 마지막 잔까지 함께했다", text: "방청석에 앉았던 사람도, 복도 모니터 앞에 섰던 사람도 한 천막 아래 모였습니다. 서류 없는 데서 다시 보자는 말이 약속이 됐습니다." },
    c41_after_record: { tag: "표로 남긴 결말", title: "스물세 번의 '기억나지 않습니다'가 스물세 칸의 표가 됐다", text: "대답 하나하나 옆에 그날의 문서를 붙였습니다. 기억은 비어 있어도 칸은 비어 있지 않았습니다." },
    c41_after_rush: { tag: "먼저 달려간 결말", title: "청문회장을 나서자마자 다음 싸움으로 갔다", text: "당신은 포장마차 대신 불 꺼진 사무실로 돌아갔습니다. 단체방의 그날 밤 사진에는 당신만 없습니다." },
  },
  carryovers: {
    c41_after_warm: { trust: 11, humanCost: -4, fatigue: -7 },
    c41_after_record: { legitimacy: 13, trust: 4, fatigue: 6 },
    c41_after_rush: { capital: 5, legitimacy: 6, trust: -8 },
  },
  continuityChallenges: {
    c40_after_warm: { id: "protect-trust", title: "떡방에서 같이 센 사람들과 같이 가기", text: "하준의 첫 근무를 함께한 사람들이 청문회장에도 가고 싶어 합니다. 그 사람들을 방청석 밖에 두지 않는 선택을 찾아야 보너스가 열립니다." },
    c40_after_record: { id: "use-reframe", title: "1,106명의 명단을 질문 하나로 바꾸기", text: "문서로 묶은 명단은 7분에 들어가지 않습니다. 그 명단이 질문 하나가 되도록 판을 다시 짜야 합니다." },
    c40_after_rush: { id: "repair-legitimacy", title: "먼저 도착한 참고인의 공정함 회복하기", text: "일찍 온 당신의 인사 기록을 저쪽이 먼저 읽었습니다. 서두른 만큼 비어 있는 절차를 되찾는 선택을 찾아야 합니다." },
  },
};
