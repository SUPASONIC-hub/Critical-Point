/**
 * CASE 22 -- the intern, and the machine that learned to say no.
 *
 * In 사건 12 a high-school boy stood at his father's columbarium and said he
 * would become a banker who lends to people like his father, properly. Five
 * months later 문하준 walks into the 강서지점 as a winter-break intern, with
 * 도윤하 -- who sold loans at that very counter -- as his mentor. The same week
 * the cooperative his mother and the old technicians reopened as '끝까지정밀'
 * asks for a machine loan, and 노아, the AI underwriting engine that replaced
 * 에코 in 사건 20, refuses it in 0.8 seconds: the applicant's family includes
 * the owner of a bankrupt firm. The bankrupt firm went under with 플로우온. The
 * owner is dead. The branch cannot overturn the result, because since 노아
 * arrived nobody has been willing to sign the override.
 *
 * The case is the season's warmest and one of its angriest at once: the joy of
 * a boy in an intern badge guiding grandmothers at the ticket machine, the
 * comedy of his mother handing rice cakes all the way into the manager's office
 * and of 권도현 counting eleven "끝까지" in a business plan the boy wrote, the
 * grief of a sales role-play he cannot finish, and the anger of learning where
 * 노아 got its list: the compensation claimants of 사건 12. It closes on who
 * signs a blank line -- the override field no one in the country has filled --
 * and on an old technician asking whether one share is enough to speak at the
 * March shareholders' meeting, which is 사건 23.
 */
export const case22Nodes = {
  c22_start: {
    phase: "CASE 22 BRIEFING",
    title: "0.8초",
    speaker: "도윤하",
    text:
      "2월 셋째 주 월요일 아침, 도윤하가 휴대폰 두 대를 나란히 내밉니다. 하나는 문하준이 보낸 사진입니다. 'KD은행 청소년 금융 인턴 문하준' 명찰, 배정 지점 강서지점, 멘토 칸에 도윤하. 다른 하나는 강서지점 탁예린 대리의 문자입니다. 끝까지정밀 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)이 낸 시설자금(기계나 설비를 사는 데 쓰는 돈) 3억 5천만 원 신청이 새 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아에게 0.8초 만에 거절됐습니다. 사유 코드 R-17, 특수관계인(대표자의 가족처럼 가까운 사람) 부도(빚을 갚지 못해 회사가 쓰러지는 것) 이력. 관계인 칸에는 문성호, 그 옆에 '사망'. 사람이 결과를 뒤집는 예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것)은 노아가 들어온 뒤로 한 건도 없습니다. 도윤하가 두 화면을 겹쳐 쥡니다. '하준이 인턴 첫날이 오늘이에요. 지금쯤 그 지점 번호표 기계 앞에 서 있을 거예요.'",
    memo: [
      "끝까지정밀 시설자금 신청 3억 5천만 원 -- 5축 가공기 1대",
      "노아 판단 시간 0.8초, 사유 코드 R-17",
      "관계인: 문성호(사망) -- 가온정밀 전 대표",
      "문하준 인턴십 5일, 멘토 도윤하",
    ],
    triggers: ["injustice", "affection", "system"],
    choices: [
      {
        id: "c22_start_desk",
        label: "강서지점 탁예린의 기업대출 창구부터 찾아간다",
        effect: { trust: 11, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c22_counter",
        cognition: { persistence: 2 },
      },
      {
        id: "c22_start_code",
        label: "R-17이 어떤 규칙으로 만들어졌는지부터 연다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 2, fatigue: 3 },
        next: "c22_counter",
        cognition: { inference: 2 },
      },
      {
        id: "c22_start_swap",
        label: "대표자를 김 반장으로 바꿔 서류를 다시 넣자고 한다",
        effect: { capital: 9, time: 6, legitimacy: -4, trust: -3, humanCost: 3, fatigue: 1 },
        next: "c22_counter",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c22_counter",
      },
    ],
  },
  c22_counter: {
    phase: "THE COUNTER",
    title: "번호표 기계 앞",
    speaker: "문하준",
    text:
      "월요일 오전 9시 10분, 강서지점 객장. 문하준이 인턴 명찰을 교복 위에 달고 번호표 기계 옆에 섭니다. 스케치북을 뜯어 창구 배치도를 그려 붙였고, '어르신, 통장 정리는 오른쪽 기계예요'를 벌써 스물몇 번째 말하고 있습니다. 10시에는 문가을이 떡 상자 네 개를 들고 들어옵니다. 인턴 아들 응원이라며 창구 직원, 청원경찰, 대기 손님에게 차례로 돌리더니 끝내 지점장실 문까지 두드립니다. 서태경 지점장이 인절미를 받아 들고 어색하게 고개를 숙입니다. 그 사이 2번 기업대출 창구의 탁예린이 당신을 부릅니다. 모니터에 끝까지정밀의 거절 화면이 떠 있습니다. '사장님은 아직 몰라요. 심사 중이라고만 말씀드렸어요.' 떡을 돌리던 문가을이 창구 쪽으로 손을 흔듭니다.",
    memo: [
      "인턴 첫날 번호표 안내 -- 문하준 손글씨 배치도",
      "문가을 떡 상자 4개, 지점장실까지 배달",
      "끝까지정밀 거절 통보, 신청인에게 아직 안 알림",
      "탁예린: 노아 정식 가동 일주일, 사람이 뒤집은 결과 0건",
    ],
    triggers: ["affection", "trust", "injustice"],
    choices: [
      {
        id: "c22_counter_tell",
        label: "떡을 다 돌리기 전에 문가을에게 거절 사실을 직접 알린다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -4, fatigue: 4 },
        next: "c22_factory",
        cognition: { persistence: 2 },
      },
      {
        id: "c22_counter_appeal",
        label: "탁예린과 재심사 요청서부터 접수한 뒤에 알린다",
        effect: { legitimacy: 12, trust: -4, time: -5, humanCost: 1, fatigue: 4 },
        next: "c22_factory",
        cognition: { inference: 2 },
      },
      {
        id: "c22_counter_wait",
        label: "하준의 인턴 주간이 끝날 때까지 소식을 미룬다",
        effect: { time: 5, capital: 5, trust: -4, humanCost: 3, fatigue: -3 },
        next: "c22_factory",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c22_factory",
      },
    ],
  },
  c22_factory: {
    phase: "THE FACTORY",
    title: "끝까지, 열한 번",
    speaker: "권도현",
    text:
      "수요일 저녁 7시, 인천 남동공단. 2월 바람이 셔터 틈으로 들어오지만 공장 안은 기계 소리로 따뜻합니다. 선반 여섯 대 중 네 대가 돌고, 김 반장이 난로 위에 보리차 주전자를 올려 둡니다. 권도현이 재심사에 낼 사업계획서를 넘기다 볼펜으로 책상을 칩니다. '끝까지 납품, 끝까지 품질, 끝까지 책임. \"끝까지\"가 열한 번 나옵니다. 사업계획서에 부사는 한 번이면 충분합니다.' 구석에서 문하준이 조용히 손을 듭니다. '그거 제가 썼는데요.' 권도현이 잠깐 멈추더니 열한 개에 전부 동그라미를 칩니다. '그럼 숫자로 증명합시다.' 김 반장이 발주서를 내밉니다. 의료기기 부품 회사 세온메디칼, 3월 4일까지 시제품 200개. 오차 0.005mm를 맞추려면 5축 가공기(깎는 날이 다섯 방향으로 움직이는 정밀 기계)가 있어야 합니다.",
    memo: [
      "선반 6대 중 4대 가동, 조합원 5명",
      "사업계획서 '끝까지' 11회 -- 작성자 문하준",
      "세온메디칼 발주: 3월 4일까지 시제품 200개",
      "필요 정밀도 0.005mm -- 기존 선반으로는 불가",
    ],
    triggers: ["trust", "responsibility", "competition"],
    choices: [
      {
        id: "c22_factory_crew",
        label: "조합원들과 밤새 사업계획서를 숫자로 다시 쓴다",
        effect: { trust: 11, legitimacy: 5, time: -5, capital: -3, fatigue: 5 },
        next: "c22_roleplay",
        cognition: { persistence: 2 },
      },
      {
        id: "c22_factory_record",
        label: "문성호의 이력을 부도가 아닌 기술 이력으로 다시 적는다",
        effect: { legitimacy: 12, trust: 4, time: -5, humanCost: -3, fatigue: 4 },
        next: "c22_roleplay",
        cognition: { reframing: 2 },
      },
      {
        id: "c22_factory_used",
        label: "새 기계 대신 중고 가공기로 신청액을 줄인다",
        effect: { capital: 9, time: 5, trust: -1, humanCost: 3, fatigue: -2 },
        next: "c22_roleplay",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c22_roleplay",
      },
    ],
  },
  c22_roleplay: {
    phase: "ROLE PLAY",
    title: "상품을 팔아 보세요",
    speaker: "도윤하",
    text:
      "목요일 오후 2시, 강서지점 3층 교육 회의실. 인턴 네 명이 역할극 과제를 받습니다. '고객에게 이달의 추천 상품을 팔아 보세요.' 설명서 맨 위에는 'KD 드림 적립식 펀드'와 지점 판매 목표가 적혀 있고, 고객 역할은 도윤하입니다. 문하준이 설명서를 읽다가 세 번째 줄에서 멈춥니다. 방이 조용해집니다. '저희 아빠도 은행에서 이 말 들었대요. 지금 받으시면 조건이 제일 좋다고. 그래서 받았고, 공장이 망했고, 이번 주에 제가 일하는 은행이 아빠 이름 때문에 엄마를 거절했어요.' 하준이 설명서를 내려놓습니다. '저 이거 못 팔겠어요. 파는 법 말고, 안 파는 법은 안 가르쳐 줘요?' 도윤하는 고객 의자에 앉은 채 움직이지 않습니다. 3년 전 이 지점 창구에서, 그 세 번째 줄은 그가 매일 쓰던 문장이었습니다.",
    memo: [
      "인턴 역할극 과제: 이달의 추천 상품 판매",
      "판매 목표가 적힌 설명서 -- 인턴에게도 배포",
      "문하준, 세 번째 줄에서 멈춤",
      "도윤하: 3년 전 같은 지점 창구 근무",
    ],
    triggers: ["affection", "selfAwareness", "helplessness"],
    choices: [
      {
        id: "c22_roleplay_hold",
        label: "역할극을 멈추고 도윤하와 하준의 이야기를 끝까지 듣는다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: -2, fatigue: 5 },
        next: "c22_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c22_roleplay_task",
        label: "'안 파는 법'을 인턴십 공식 과제로 넣자고 제안한다",
        effect: { legitimacy: 11, trust: 5, time: -4, humanCost: -2, fatigue: 4 },
        next: "c22_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c22_roleplay_next",
        label: "하준을 잠시 쉬게 하고 역할극은 다음 순서로 넘긴다",
        effect: { time: 5, capital: 4, trust: -1, humanCost: 2, fatigue: -3 },
        next: "c22_final",
        cognition: { risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c22_final",
      },
    ],
  },
  c22_final: {
    phase: "FINAL DECISION",
    title: "수료식 날의 서명란",
    speaker: "탁예린",
    text:
      "금요일 오후 3시, 강서지점 2층 회의실. 한 시간 뒤 객장에서 인턴 수료식이 열립니다. 세온메디칼은 월요일까지 기계 계약서가 없으면 주문을 베트남 업체로 넘기겠다고 통보했습니다. 테이블 위에 서류가 세 가지 있습니다. 탁예린이 칸을 다 채워 둔 예외 승인 신청서, 권도현과 류세아의 숫자를 붙인 R-17 이의 제기서, 다른 은행 두 곳의 상담 예약표. 서태경 지점장은 인절미 상자를 옆으로 밀어 둡니다. 유리벽 너머 객장에서 문하준이 수료식 의자를 줄 맞춰 놓고 있습니다. 탁예린이 말합니다. '예외 승인은 끝까지정밀 하나를 살려요. 이의 제기는 41건을 전부 다시 보게 하지만 몇 주가 걸려요. 어느 쪽이든, 이번 주에 이름을 쓰는 사람이 있어야 해요.'",
    memo: [
      "세온메디칼 최종 통보: 월요일까지 계약서",
      "R-17 거절 41건 -- 그중 29건이 플로우온 협력사 가족",
      "예외 승인 서명란: 책임자 이름 필요",
      "이 선택은 사건 23의 주주총회로 이어짐",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c22_final_override",
        label: "예외 승인으로 끝까지정밀의 결과를 사람이 뒤집는다",
        effect: { trust: 12, humanCost: -6, capital: -5, legitimacy: -4, time: -3, fatigue: 6 },
        next: "case22_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c22_final_object",
        label: "R-17 기준 자체에 이의를 제기해 41건을 모두 다시 심사하게 한다",
        effect: { legitimacy: 13, trust: 4, time: -7, humanCost: 3, fatigue: 6 },
        next: "case22_result",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c22_final_bank",
        label: "다른 은행을 연결해 월요일 전에 기계 계약부터 잡는다",
        effect: { capital: 10, time: 6, trust: -2, legitimacy: -3, humanCost: 3, fatigue: -3 },
        next: "case22_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case22_result",
      },
    ],
  },
};

/**
 * Everything else case 22 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case22 = {
  id: "case22",
  nodes: case22Nodes,
  aftermath: {
    c22_aftershock: {
      phase: "AFTERMATH",
      title: "수료증과 번호표",
      speaker: "문하준",
      text: "오후 4시, 강서지점 객장에서 인턴 수료식이 열립니다. 이름이 불리자 문하준이 앞으로 나가다 말고 번호표 기계 앞에서 멈춥니다. 기다리던 할머니에게 번호표를 먼저 뽑아 드리고 나서야 수료증을 받습니다. 맨 뒷줄에서 문가을이 떡 상자를 무릎에 올린 채 박수를 치고, 이번에는 서태경 지점장이 먼저 와서 떡을 하나 집어 갑니다. 하준의 인턴 보고서 마지막 줄은 이렇습니다. '은행은 거절하는 이유를 사람이 읽을 수 있게 말해야 한다.' 김 반장이 휴대폰을 들여다보다 당신에게 묻습니다. 'KD금융그룹 주식 말이에요. 한 주만 사도 3월에 주주들 모이는 회의에 가서 말할 수 있어요?'",
      memo: ["인턴 수료 4명 -- 문하준 보고서 제출", "번호표 기계 앞 마지막 안내", "김 반장: KD금융그룹 주식 1주 문의", "3월 말 정기 주주총회"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c22_after_warm", label: "수료식 떡 상자가 빌 때까지 하준이네 가족 곁에 남는다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case22_result", cognition: { reframing: 2 } },
        { id: "c22_after_record", label: "하준의 보고서와 R-17 거절 사례를 한 권의 문서로 남긴다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case22_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c22_after_rush", label: "김 반장의 1주를 시작으로 곧장 주주총회 준비에 들어간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case22_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c22_final", "c22_aftershock"],
  connectiveScenes: [
    ["c22_comment", "c22_counter", "c22_factory", "의견란 열아홉 칸", "탁예린", "영업이 끝난 오후 6시, 탁예린이 노아의 심사 화면을 처음부터 보여 줍니다. 결과 아래에 '담당자 의견'이라는 칸이 있습니다. 쓸 수는 있지만 결과를 바꾸지는 못합니다. 탁예린은 정식 가동 일주일 동안 이 칸에 의견 열아홉 개를 썼습니다. '매출이 늘고 있음', '담보 충분', '대표 성실함'. 노아는 열아홉 번 모두 같은 결과를 냈습니다. 그가 마우스를 놓고 두 손을 무릎에 올립니다. '저 기업대출 4년 차예요. 근데 이제 제 일은 거절 문자를 예쁘게 쓰는 거예요. 오늘 쓴 문장도 \"아쉽지만\"으로 시작해요.'", ["담당자 의견란: 입력 가능, 결과 반영 0", "탁예린 일주일간 의견 19건 -- 결과 변경 0건", "거절 안내 문자 표준 첫마디 '아쉽지만'"], ["거절 문자를 보내기 전에 신청인에게 직접 전화하자고 한다", "의견 19건을 묶어 본점 심사부에 정식 보고서로 올린다", "의견란은 그만 쓰고 거절 안내를 빨리 끝내자고 한다"]],
    ["c22_heater", "c22_factory", "c22_roleplay", "난로와 월급", "강태민", "밤 11시, 공장 난로가 꺼집니다. 강태민이 장갑을 벗어 조끼 주머니에 꽂고 난로를 뜯습니다. 부품 하나가 타 버렸습니다. 그는 주머니에서 컵라면 두 개를 꺼내 김 반장과 당신 앞에 놓더니, 남은 뜨거운 물을 페트병에 담아 선반 옆에 세워 둡니다. '기계가 추우면 오차가 커져요.' 김 반장이 웃다가 장부를 폅니다. 조합원 다섯 명은 12월과 1월 월급을 받지 않았습니다. 전기료 180만 원이 먼저였습니다. '세온 주문을 놓치면 3월 월급도 없어요. 우리는 괜찮아요. 근데 주문은 기다려 주지 않아요.'", ["난로 고장 -- 공장 안 영상 3도", "조합원 5명 두 달째 무급", "월 전기료 180만 원 우선 지급"], ["3월 시제품까지 조합원 생활비를 임시로 모아 보자고 한다", "세온메디칼에 납기 연장을 서면으로 요청한다", "우선 오차가 덜 까다로운 주문부터 받자고 한다"]],
    ["c22_notebook", "c22_roleplay", "c22_final", "수첩 3쪽", "도윤하", "퇴근 뒤 강서지점 뒤편 골목 계단, 2월 눈발이 난간에 쌓입니다. 도윤하가 사건 10 이후 새로 쓰기 시작한 수첩을 폅니다. 3쪽에 문성호라는 이름이 있습니다. 3년 전 이 지점 창구에서 그가 직접 받은 추가 대출 상담입니다. '납품대금 석 달 밀림, 플로우온만 믿는다고 함.' 그 아래 도윤하의 글씨로 '실적 1건'이라고 적혀 있습니다. 도윤하가 수첩을 덮습니다. '하준이한테 말해야 할까요. 너희 아빠한테 대출을 판 사람이 네 멘토라고. 내일이 수료식이에요.'", ["도윤하 수첩 3쪽: 문성호 상담 기록", "3년 전 강서지점 창구, 추가 대출 '실적 1건'", "수료식까지 하루"], ["수료식 전에 도윤하가 직접 말하도록 곁에 있겠다고 한다", "그 상담 기록을 재심사 자료에 은행의 책임으로 넣는다", "수료식이 끝날 때까지 수첩은 덮어 두자고 한다"]],
  ],
  connectiveOrder: [["c22_counter", "c22_comment"], ["c22_factory", "c22_heater"], ["c22_roleplay", "c22_notebook"]],
  choiceEffects: {
    c22_counter: [
      { trust: 11, humanCost: -5, legitimacy: 3, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, humanCost: 2, fatigue: 4 },
      { time: 6, capital: 5, trust: -2, legitimacy: 2, humanCost: 3, fatigue: -3 },
    ],
    c22_factory: [
      { trust: 11, humanCost: -6, capital: -6, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 3, time: -4, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 6, trust: 1, legitimacy: -2, humanCost: 2, fatigue: -4 },
    ],
    c22_roleplay: [
      { trust: 12, humanCost: -4, legitimacy: 2, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: -2, time: -4, humanCost: 2, fatigue: 4 },
      { time: 5, capital: 3, trust: -2, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c22_counter: {
      voice: ["거절 문자를 보내기 전에, 신청인에게 직접 전화하자고 한다.", "의견 19건을 묶어, 본점 심사부에 정식 보고서로 올린다.", "의견란은 그만 쓰고, 거절 안내를 빨리 끝내자고 한다."],
      echo: ["전화를 받은 신청인 중 둘은 화를 내고, 한 명은 이유를 알려 줘서 고맙다고 합니다. 탁예린은 그날 문자를 한 통도 보내지 않습니다.", "보고서는 접수됩니다. 본점 심사부의 답장은 '노아 운영 기준에 따름' 한 줄입니다.", "안내는 빨라집니다. 탁예린은 스무 번째 의견을 쓰다 말고 창을 닫습니다."],
    },
    c22_factory: {
      voice: ["3월 시제품까지, 조합원 생활비를 임시로 모아 보자고 한다.", "세온메디칼에, 납기 연장을 서면으로 요청한다.", "우선, 오차가 덜 까다로운 주문부터 받자고 한다."],
      echo: ["돈을 모으면 다섯 명은 3월까지 버팁니다. 권도현이 모금 명세서에 '임시'라는 말을 세 번 적습니다.", "서면 요청에 세온메디칼은 '검토하겠다'고 답합니다. 검토하는 동안 베트남 업체가 견적을 냅니다.", "쉬운 주문은 전기료를 냅니다. 5축 가공기가 필요한 일은 다른 공장으로 갑니다."],
    },
    c22_roleplay: {
      voice: ["수료식 전에 도윤하가 직접 말하도록, 곁에 있겠다고 한다.", "그 상담 기록을, 재심사 자료에 은행의 책임으로 넣는다.", "수료식이 끝날 때까지, 수첩은 덮어 두자고 한다."],
      echo: ["곁에 있으면 도윤하는 세 번 말을 꺼냈다가 멈춥니다. 네 번째에 하준이 먼저 묻습니다. '그거 선생님 글씨예요?'", "은행의 책임이 된 기록은 끝까지정밀의 재심사를 돕습니다. 도윤하의 이름도 그 기록에 함께 남습니다.", "수첩은 덮입니다. 수료식 사진 속 도윤하의 웃음이 반 박자 늦습니다."],
    },
  },
  reactionScenes: [
    ["c22_comment_reaction", "c22_comment", "c22_factory", "거절을 배운 기계", "류세아", "탁예린의 보고서 사본을 받은 류세아가 판교에서 영상 통화를 겁니다. 노아 도입 PM인 그가 R-17의 학습 근거를 화면에 띄웁니다. 지난 30년 KD은행 기록에서 부도 기업 대표의 가족이 낸 대출 신청은 94%가 거절됐습니다. 그런데 승인된 6%가 돈을 못 갚은 비율은 전체 평균보다 낮습니다. 정식 가동 일주일 동안 R-17로 거절된 신청은 전국에서 41건입니다. 류세아가 안경을 벗습니다. '노아는 위험을 배운 게 아니에요. 그 가족들을 거절해 온 우리 습관을 배웠어요. 설명할 수 있게 만들려고 이 일을 했는데, 설명해 보니 이렇네요.'", ["이 통계를 R-17 신청인 41명에게 먼저 알리자고 한다", "R-17의 학습 근거를 공식 검증 자료로 요청한다", "규칙은 두고 이번 한 건만 조용히 풀어 달라고 한다"]],
    ["c22_heater_reaction", "c22_heater", "c22_roleplay", "컵라면 뚜껑의 계산서", "권도현", "새벽 1시, 권도현이 다 먹은 컵라면 뚜껑 뒤에 계산을 합니다. 5축 가공기 3억 9천만 원, 세온 주문 1년 치 매출 7억 2천만 원, 조합원 다섯 명의 1년. 그 옆에 노아의 거절에 드는 비용을 적습니다. 0원. 권도현이 뚜껑을 뒤집어 당신에게 보여 줍니다. '거절한 쪽 장부에는 이 칸이 없습니다. 손실은 전부 거절당한 쪽 장부에만 적힙니다.' 그가 볼펜 뚜껑을 닫습니다. '이 가격이면 적자입니다. 누구의 적자인지가 문제지만요.'", ["이 뚜껑 계산을 조합원들 앞에서 다시 읽어 준다", "거절의 비용을 재심사 요청서 첫 장에 넣는다", "계산은 접어 두고 대출 서류부터 서두른다"]],
    ["c22_notebook_reaction", "c22_notebook", "c22_final", "비어 있는 칸", "탁예린", "밤 10시, 탁예린이 예외 승인 신청서 양식을 찾아 보냅니다. 노아 도입 이후 처음 열어 보는 양식입니다. 맨 아래에 '예외 승인 책임자' 서명란이 있습니다. 노아의 결과를 뒤집은 사람이 이름을 쓰고, 그 대출이 잘못되면 인사 평가에 반영된다는 문구가 붙어 있습니다. 도입 이후 이 칸에 이름을 쓴 사람은 전국에 한 명도 없습니다. 탁예린이 메시지를 하나 더 보냅니다. '제가 쓸까요. 4년 차 대리 이름으로도 되는지는 모르겠지만요.'", ["탁예린 혼자 두지 않고 지점장과 함께 서명하자고 한다", "책임자 한 명이 아닌 심사위원회 서명으로 양식을 바꾸자고 한다", "쓰겠다는 탁예린의 이름으로 바로 올린다"]],
  ],
  reactionEffects: {
    c22_comment: [
      { trust: 10, humanCost: -5, time: -2, fatigue: 3 },
      { legitimacy: 10, trust: 3, capital: -4, time: -3, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c22_heater: [
      { trust: 10, humanCost: -4, time: -2, fatigue: 3 },
      { legitimacy: 9, trust: 3, capital: -3, time: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: -2, humanCost: 2, fatigue: -3 },
    ],
    c22_notebook: [
      { trust: 10, legitimacy: 4, capital: -4, time: -2, fatigue: 3 },
      { legitimacy: 11, trust: 2, time: -4, humanCost: 3, fatigue: 4 },
      { time: 5, capital: 4, trust: 3, legitimacy: 2, humanCost: 5, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c22_comment: {
      voice: ["이 통계를, R-17 신청인 41명에게 먼저 알리자고 한다.", "R-17의 학습 근거를, 공식 검증 자료로 요청한다.", "규칙은 두고, 이번 한 건만 조용히 풀어 달라고 한다."],
      echo: ["알리면 41명 중 몇은 처음으로 자기 탓이 아니었다는 걸 압니다. 류세아는 윗선에 보고하기 전에 알린 사람이 됩니다.", "요청은 절차를 탑니다. 검증 위원회는 다음 달에 열립니다.", "류세아가 잠깐 망설이다 고개를 젓습니다. '한 건만 풀면, 나머지 40건은 영영 이유를 몰라요.'"],
    },
    c22_heater: {
      voice: ["이 뚜껑 계산을, 조합원들 앞에서 다시 읽어 준다.", "거절의 비용을, 재심사 요청서 첫 장에 넣는다.", "계산은 접어 두고, 대출 서류부터 서두른다."],
      echo: ["읽어 주면 김 반장이 뚜껑을 받아 작업대 유리 밑에 끼웁니다. 계산서가 처음으로 공장의 물건이 됩니다.", "첫 장에 적힌 0원은 심사부 사람들의 눈에 걸립니다. 눈에 걸린다고 결과가 바뀌지는 않습니다.", "서류는 빨라집니다. 뚜껑은 컵라면 용기와 함께 분리수거함에 들어갑니다."],
    },
    c22_notebook: {
      voice: ["탁예린 혼자 두지 않고, 지점장과 함께 서명하자고 한다.", "책임자 한 명이 아니라, 심사위원회 서명으로 양식을 바꾸자고 한다.", "쓰겠다는 탁예린의 이름으로, 바로 올린다."],
      echo: ["서태경 지점장은 하룻밤 생각하겠다고 합니다. 인절미 상자가 아직 그의 책상 위에 있습니다.", "양식을 바꾸자는 요청은 본점으로 갑니다. 바뀐 양식보다 세온메디칼의 납기가 먼저 옵니다.", "4년 차 대리의 이름이 전국 첫 번째 칸에 들어갑니다. 그 이름은 다음 인사 평가까지 그 칸에 묶입니다."],
    },
  },
  reactionMemos: {
    c22_comment_reaction: ["부도 기업 가족 신청 거절률 94%", "승인된 6%는 평균보다 잘 갚음"],
    c22_heater_reaction: ["거절한 쪽 장부의 비용 0원", "거절당한 쪽 장부의 비용 1년 치 매출"],
    c22_notebook_reaction: ["예외 승인 책임자 서명란 -- 전국 0명", "탁예린: 4년 차 대리의 이름"],
  },
  branchPlan: ["c22_counter", 0, "c22_branch_shop", "c22_branch_shop_follow"],
  branchScenes: {
    // CASE 22's detour is the rice-cake shop. The case argues with a machine
    // about a dead man's name; the side door is the widow deciding to take her
    // own name off the cooperative so the machine will let it through.
    c22_branch_shop: {
      phase: "SIDE DOOR",
      title: "반쯤 내린 셔터",
      speaker: "문가을",
      text: "그날 저녁 망원시장, 가을떡방 셔터가 반쯤 내려와 있습니다. 문가을은 당신이 건넨 거절 화면 출력물을 도마 옆에 놓고 한참 떡을 썹니다. 칼질이 평소보다 빠릅니다. '죽은 사람이 또 대출을 막네요. 살아서는 공장을 못 지키고, 죽어서는 공장을 못 열게 하고.' 냉장고 문에는 조합원 다섯 명이 12월 월급을 미루고 모은 출자금(조합원이 조합에 넣은 돈) 4천만 원의 영수증이 자석으로 붙어 있습니다. 문가을이 칼을 내려놓습니다. '은행이 남편 이름을 저한테 붙였으면, 제가 떼면 되잖아요. 제가 이사장에서 빠질게요.'",
      memo: ["거절 통보 당일 저녁 -- 가을떡방 셔터 절반", "조합원 5명 출자금 4천만 원, 12월 월급 유예", "이사장 명의: 문가을", "문가을: 이사장 사임 의사"],
      triggers: ["injustice", "affection", "helplessness"],
      choices: [
        { id: "c22_branch_shop_a", label: "빠지지 말라며 이사장 자리를 지킨 채 싸우자고 한다", effect: { trust: 12, legitimacy: 4, capital: -5, time: -3, fatigue: 3 }, next: "c22_branch_shop_follow", cognition: { reframing: 2 } },
        { id: "c22_branch_shop_b", label: "사임 전에 조합원 총회를 열어 모두의 뜻을 묻는다", effect: { legitimacy: 11, trust: 4, time: -7, humanCost: 3, fatigue: 4 }, next: "c22_branch_shop_follow", cognition: { inference: 2 } },
        { id: "c22_branch_shop_c", label: "일단 이사장 명의만 바꿔 대출부터 받자고 한다", effect: { capital: 9, time: 5, trust: -7, humanCost: 5, fatigue: -3 }, next: "c22_branch_shop_follow", cognition: { risk: 1 } },
      ],
    },
    c22_branch_shop_follow: {
      phase: "SIDE DOOR",
      title: "스케치북의 마지막 장",
      speaker: "문하준",
      text: "셔터 밑으로 교복 바지가 보이더니 문하준이 몸을 숙여 들어옵니다. 인턴 첫날을 마치고 지점 앞 분식집에서 떡볶이를 먹고 왔다며 신이 나 있다가, 도마 옆 출력물을 봅니다. 한참 말이 없던 하준이 스케치북 마지막 장을 폅니다. 조합 간판과 명함에 넣을 로고 시안입니다. 톱니바퀴 안에 '끝까지', 그 아래 작게 '이사장 문가을'. '엄마가 빠지면 이거 다시 그려야 돼요.' 문가을이 웃다가 고개를 돌립니다. 하준이 당신을 봅니다. '은행은 원래 이렇게 정해요? 아빠 때문에 엄마가 안 되는 거요?'",
      memo: ["문하준 인턴 1일차 종료", "로고 시안: 톱니바퀴 안의 '끝까지'", "하준이 거절 사유를 직접 봄", "질문: 가족 때문에 안 되는 대출"],
      triggers: ["affection", "selfAwareness", "injustice"],
      choices: [
        { id: "c22_branch_shop_follow_a", label: "하준에게 R-17 화면을 보여 주며 있는 그대로 설명한다", effect: { trust: 11, legitimacy: 5, humanCost: -3, time: -3, fatigue: 4 }, next: "c22_comment", cognition: { reframing: 2 } },
        { id: "c22_branch_shop_follow_b", label: "하준의 질문을 그대로 적어 재심사 요청서에 붙인다", effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 3, fatigue: 4 }, next: "c22_comment", cognition: { inference: 2 } },
        { id: "c22_branch_shop_follow_c", label: "오늘은 대답을 미루고 로고 이야기만 한다", effect: { time: 6, capital: 4, trust: -6, humanCost: 4, fatigue: -4 }, next: "c22_comment", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c22_start",
    result: "c22_aftershock",
    defaultFree: "c22_route_system",
    // One application, one machine. Like 사건 12 the case is a single line;
    // the split is who signs the line that lets a person overrule 노아.
    choices: {},
    system: {
      route: "c22_route_system",
      final: "c22_final_system_route",
      title: "제자리를 도는 설명",
      speaker: "류세아",
      text: "준비된 보기 밖의 문장을 쓰자 류세아가 열어 둔 노아의 시험 단말이 답합니다. 'R-17 거절 사유를 설명하라.' 노아가 0.3초 만에 쓴 설명은 이렇습니다. '과거 유사 신청의 94%가 거절되었으므로 본 신청도 거절이 적절합니다.' 다시 묻습니다. '과거 신청은 왜 거절되었나.' 노아가 답합니다. '과거 유사 신청의 다수가 거절되었으므로.' 류세아가 화면을 캡처합니다. '설명 가능한 AI라고 발표했어요. 설명은 하네요. 제자리를 도는 설명을요. 정식 가동 일주일 동안 이 코드로 거절된 신청이 41건이에요.'",
      memo: ["노아 설명 기능: 거절 사유를 과거 거절로 설명", "R-17 거절 41건 -- 정식 가동 일주일", "이 순환 설명이 도입 보고서에는 '설명 가능'으로 기록됨"],
      routeChoices: [
        ["c22_route_system_publish", "순환 설명 캡처를 41건 신청인과 지점에 공개한다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c22_route_system_human", "R-17 거절에는 사람이 쓴 사유서를 붙이라고 요구한다", { legitimacy: 8, trust: 5, time: -7, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c22_route_system_drop", "캡처는 덮고 이번 신청서만 다시 넣는다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "R-17 거절에는 사람이 다시 보는 절차를 의무로 붙인다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 그대로 두고 거절 안내문만 친절하게 고친다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "R-17로 거절된 41곳을 모아 공동 이의 신청단을 꾸린다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c22_evidence_turn",
    result: "c22_aftershock",
    sourceRoutes: ["c22_counter", "c22_factory", "c22_roleplay", "c22_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 노아의 학습 데이터 목록 옆에 놓고, R-17이 어디서 이름을 배웠는지 맞춰 본다.",
    entryEcho: "단서를 대면 거절의 이유가 아니라 거절의 명단이 보입니다. 그 명단을 누가 넘겨줬는지도 함께 보입니다.",
    title: "R-17의 명단",
    speaker: "이민서",
    text: "단서를 맞추자 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 목록이 열립니다. 이민서가 스크롤을 멈춥니다. '부도 관계인' 태그가 붙은 이름 1,021개. 사건 12의 자율 배상 신청자 명단입니다. 배상을 받으려고 낸 서류가 그대로 노아의 위험 목록으로 들어갔고, 입력 날짜는 첫 배상금이 들어간 다음 주입니다. 이민서가 명단 맨 위를 가리킵니다. '배상을 신청한 사람이 대출에서 거절돼요. 피해자라고 손을 든 사람이 위험한 사람이 된 거예요. 문가을 사장님 이름이 첫 줄에 있어요.'",
    memo: ["'부도 관계인' 태그 1,021건 -- 배상 신청자 명단과 일치", "입력 시점: 첫 배상 입금 다음 주", "R-17 거절 41건 중 29건이 이 명단에서 나옴"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 4, trust: 3, time: -2, capital: -3, fatigue: 4 },
    choices: [
      ["c22_evidence_turn_purge", "명단을 학습 데이터에서 지우기 전에는 어떤 심사도 받지 않는다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c22_evidence_turn_hold", "이 기록은 쥐고 있다가 3월 주주총회에서 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c22_evidence_turn_share", "피해자 모임 1,021명에게 이 사실부터 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c22_branch_shop",
    systemNext: "c22_route_system",
    evidenceNext: "c22_evidence_turn",
    routeLabel: "직전 사건 느린섬에서 짠 귤 따기 조 편성으로 조합 일손을 나눈다",
    systemLabel: "직전 자유응답 문장이 노아의 설명 문구에도 학습됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 노아의 학습 데이터 목록을 연다",
  },
  openingRoutes: {
    c21_after_warm: "c22_start_warm",
    c21_after_record: "c22_start_record",
    c21_after_rush: "c22_start_rush",
  },
  openingCopy: {
    c22_start_warm: ["귤 냄새가 남은 월요일", "도윤하", "마지막 비행기 시간까지 느린섬에서 귤 상자를 싸고 온 여섯 사람은 주말 내내 손끝에서 귤 냄새가 났습니다. 권도현의 지갑에는 아직 고은비의 명세서가 들어 있습니다. 금액 0원, 비고 '따지 마세요'. 월요일 아침, 도윤하가 휴대폰 두 대를 내밉니다. 하나는 오늘 첫 출근한 문하준의 인턴 명찰 사진, 다른 하나는 탁예린 대리의 문자입니다. 제주에서 문가을이 냈다던 끝까지정밀 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)의 시설자금(기계나 설비를 사는 데 쓰는 돈) 신청이 노아에게 0.8초 만에 거절됐습니다. 사유는 특수관계인(대표자의 가족처럼 가까운 사람) 부도(빚을 갚지 못해 회사가 쓰러지는 것) 이력, 관계인은 세상을 떠난 문성호. 사람이 뒤집는 예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것)은 노아가 온 뒤로 한 건도 없습니다.", ["느린섬에서 싸 온 귤 상자 6개", "끝까지정밀 시설자금 거절 -- 사유 코드 R-17", "문하준 인턴십 오늘 시작, 멘토 도윤하"]],
    c22_start_record: ["열람 청구서 다음의 거절", "이민서", "1기 참가자 네 명에게 열람 청구(내 기록을 보여 달라고 요구하는 것) 안내문이 발송된 지 사흘, 선우진에게서 '천천히 읽겠습니다'라는 답장이 왔습니다. 이민서가 그 답장을 출력해 모니터 옆에 붙이던 월요일 아침, 강서지점 탁예린 대리의 문자가 옵니다. 끝까지정밀 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)의 시설자금(기계나 설비를 사는 데 쓰는 돈) 신청이 노아에게 거절됐습니다. 사유 코드 R-17, 특수관계인(대표자의 가족처럼 가까운 사람) 부도(빚을 갚지 못해 회사가 쓰러지는 것) 이력. 관계인 칸에는 문성호, 사망. 예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것) 버튼은 회색입니다. 이민서가 화면을 봅니다. '기록의 주인한테 볼 길을 막 열어 줬는데, 이번엔 기계가 죽은 사람의 기록을 꺼내 쓰고 있네요.'", ["1기 열람 청구 안내문 4통 발송", "끝까지정밀 시설자금 거절 -- 관계인 문성호(사망)", "문하준 인턴십 오늘 시작, 같은 지점"]],
    c22_start_rush: ["열두 번째 줄", "오진우", "귤 상자를 든 채 첫 비행기로 올라온 당신은 주말 내내 노아의 첫 심사 목록을 붙들고 있었습니다. 공항까지 배웅 나온 건 느린섬의 꼭지뿐이었고, 귤 상자는 아직 뜯지도 않은 채 책상 밑에 있습니다. 월요일 새벽, 목록이 갱신됩니다. 열두 번째 줄이 끝까지정밀 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)입니다. 시설자금(기계나 설비를 사는 데 쓰는 돈) 3억 5천만 원, 결과 거절, 판단 시간 0.8초. 사유는 특수관계인(대표자의 가족처럼 가까운 사람) 부도(빚을 갚지 못해 회사가 쓰러지는 것) 이력. 출근한 오진우가 어깨 너머로 화면을 봅니다. '예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것)은 노아 가동 뒤로 한 건도 없대요. 그리고 오늘부터 하준이가 그 지점 인턴이에요.'", ["노아 첫 심사 목록 -- 12번째 줄 끝까지정밀", "책상 밑 귤 상자, 아직 안 뜯음", "예외 승인 0건 -- 노아 정식 가동 일주일"]],
  },
  openingSignatures: {
    c22_start_warm: {
      label: "귤 상자를 들고 다 같이 끝까지정밀 공장에 먼저 간다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "귤 상자를 들고, 다 같이 끝까지정밀 공장에 먼저 간다.",
      echo: "여섯 명이 귤 상자를 들고 들어서면 김 반장이 선반을 멈춥니다. 귤은 반가운데, 은행 사람 여섯이 한꺼번에 오는 건 좋은 소식이었던 적이 없습니다.",
    },
    c22_start_record: {
      label: "문가을과 함께 R-17 심사 기록의 열람부터 청구한다",
      effect: { legitimacy: 12, trust: 2, capital: -5, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "문가을과 함께, R-17 심사 기록의 열람부터 청구한다.",
      echo: "열람을 청구하면 은행은 열흘 안에 답해야 합니다. 세온메디칼의 납기는 열흘을 기다려 주지 않습니다.",
    },
    c22_start_rush: {
      label: "목록의 열두 번째 줄을 들고 곧장 강서지점으로 간다",
      effect: { time: 4, trust: 8, legitimacy: 3, humanCost: 3, capital: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "목록의 열두 번째 줄을 들고, 곧장 강서지점으로 간다.",
      echo: "셔터가 올라가기도 전에 도착하면 탁예린이 놀랍니다. 번호표 기계 앞의 하준은 더 놀랍니다. 선우진에게 천천히 하지 못한 인사는 여전히 남아 있습니다.",
    },
  },
  voiceLines: {
    // CASE 22. Every line is spoken in front of a boy learning what a bank is,
    // so none of them is allowed to sound like the answer a bank would give.
    c22_start_desk: "화면보다 사람이 먼저라며, 강서지점 탁예린의 기업대출 창구부터 찾아간다.",
    c22_start_code: "0.8초에도 규칙은 있다며, R-17이 어떤 규칙으로 만들어졌는지부터 연다.",
    c22_start_swap: "이름 하나가 문제라면, 대표자를 김 반장으로 바꿔 서류를 다시 넣자고 한다.",
    c22_counter_tell: "떡을 다 돌리기 전에, 문가을에게 거절 사실을 직접 알린다.",
    c22_counter_appeal: "빈손으로 알리지 않겠다며, 탁예린과 재심사 요청서부터 접수한 뒤에 알린다.",
    c22_counter_wait: "하준의 인턴 주간이 끝날 때까지, 소식을 미룬다.",
    c22_branch_shop_a: "빠지지 마시라며, 이사장 자리를 지킨 채 싸우자고 한다.",
    c22_branch_shop_b: "사임 전에, 조합원 총회를 열어 모두의 뜻을 묻는다.",
    c22_branch_shop_c: "일단 이사장 명의만 바꿔, 대출부터 받자고 한다.",
    c22_branch_shop_follow_a: "하준에게 R-17 화면을 보여 주며, 있는 그대로 설명한다.",
    c22_branch_shop_follow_b: "하준의 질문을 그대로 적어, 재심사 요청서에 붙인다.",
    c22_branch_shop_follow_c: "오늘은 대답을 미루고, 로고 이야기만 한다.",
    c22_factory_crew: "조합원들과 밤새, 사업계획서를 숫자로 다시 쓴다.",
    c22_factory_record: "문성호의 이력을, 부도가 아닌 기술 이력으로 다시 적는다.",
    c22_factory_used: "새 기계 대신 중고 가공기로, 신청액을 줄인다.",
    c22_roleplay_hold: "역할극을 멈추고, 도윤하와 하준의 이야기를 끝까지 듣는다.",
    c22_roleplay_task: "'안 파는 법'을, 인턴십 공식 과제로 넣자고 제안한다.",
    c22_roleplay_next: "하준을 잠시 쉬게 하고, 역할극은 다음 순서로 넘긴다.",
    c22_final_override: "예외 승인으로, 끝까지정밀의 결과를 사람이 뒤집는다.",
    c22_final_object: "R-17 기준 자체에 이의를 제기해, 41건을 모두 다시 심사하게 한다.",
    c22_final_bank: "다른 은행을 연결해, 월요일 전에 기계 계약부터 잡는다.",
    c22_after_warm: "수료식 떡 상자가 빌 때까지, 하준이네 가족 곁에 남는다.",
    c22_after_record: "하준의 보고서와 R-17 거절 사례를, 한 권의 문서로 남긴다.",
    c22_after_rush: "김 반장의 1주를 시작으로, 곧장 주주총회 준비에 들어간다.",
    c22_route_system_publish: "순환 설명 캡처를, 41건 신청인과 지점에 공개한다.",
    c22_route_system_human: "R-17 거절에는, 사람이 쓴 사유서를 붙이라고 요구한다.",
    c22_route_system_drop: "캡처는 덮고, 이번 신청서만 다시 넣는다.",
    c22_final_system_route_a: "R-17 거절에는, 사람이 다시 보는 절차를 의무로 붙인다.",
    c22_final_system_route_b: "규칙은 그대로 두고, 거절 안내문만 친절하게 고친다.",
    c22_final_system_route_c: "R-17로 거절된 41곳을 모아, 공동 이의 신청단을 꾸린다.",
    c22_evidence_turn_purge: "명단을 학습 데이터에서 지우기 전에는, 어떤 심사도 받지 않는다.",
    c22_evidence_turn_hold: "이 기록은 쥐고 있다가, 3월 주주총회에서 꺼낸다.",
    c22_evidence_turn_share: "피해자 모임 1,021명에게, 이 사실부터 알린다.",
  },
  echoReplies: {
    // CASE 22.
    c22_start_desk: "찾아가면 탁예린이 의자를 하나 더 끌어옵니다. 그 의자에 앉아 있는 동안 R-17이 무엇으로 만들어졌는지는 아무도 열어 보지 않습니다.",
    c22_start_code: "규칙을 열면 R-17 밑에 가중치 표가 딸려 나옵니다. 표를 읽는 사이 문가을은 '심사 중'이라는 문자만 받습니다.",
    c22_start_swap: "대표자를 바꾸면 노아는 통과시킬지도 모릅니다. 끝까지정밀 등기에서 문가을의 이름이 빠지고, 은행은 그 이름을 빼게 만든 이유를 영영 적지 않습니다.",
    c22_counter_tell: "알리면 떡 상자가 창구 위에서 멈춥니다. 문가을은 남은 떡을 끝까지 돌리고 나서야 자리에 앉습니다.",
    c22_counter_appeal: "요청서를 들고 알리면 문가을은 적어도 할 일이 있다는 걸 압니다. 그 요청서가 접수되는 두 시간 동안 그는 떡을 돌리며 웃고 있습니다.",
    c22_counter_wait: "미루면 하준의 인턴 주간은 조용합니다. 문가을은 금요일에야 알게 되고, 그 닷새를 누가 알고 있었는지도 함께 압니다.",
    c22_branch_shop_a: "지키면 문가을의 이름은 등기에 남습니다. 노아의 거절도 그 이름 옆에 그대로 남습니다.",
    c22_branch_shop_b: "총회를 열면 김 반장이 먼저 손을 듭니다. '사장님 빠지면 우리도 다 빠져요.' 총회 공고에 사흘이 듭니다.",
    c22_branch_shop_c: "명의를 바꾸면 대출은 빨라질 수 있습니다. 문가을은 그날 밤 이사장 도장을 서랍 깊숙이 넣습니다.",
    c22_branch_shop_follow_a: "있는 그대로 들은 하준이 스케치북에 'R-17'을 적습니다. 그리고 그 옆에 물음표를 세 개 그립니다.",
    c22_branch_shop_follow_b: "고등학생의 질문이 붙은 요청서를 본점 심사부는 처음 받아 봅니다. 답을 적어야 할 칸은 아직 없습니다.",
    c22_branch_shop_follow_c: "로고 이야기를 하면 하준은 웃습니다. 질문은 대답 없이 스케치북 마지막 장에 남습니다.",
    c22_factory_crew: "밤새 쓰면 사업계획서의 '끝까지'는 열한 번에서 한 번으로 줄고, 숫자는 스물세 개 늘어납니다. 하준이 조금 서운해합니다.",
    c22_factory_record: "다시 적으면 문성호는 부도 기업 대표가 아니라 20년 경력의 정밀 가공 기술자가 됩니다. 노아가 그 문장을 읽는 법을 아는지는 모릅니다.",
    c22_factory_used: "신청액이 줄면 심사는 가벼워집니다. 중고 가공기로는 0.005mm가 두 번에 한 번 맞습니다.",
    c22_roleplay_hold: "끝까지 들으면 하준은 아빠 이야기를 처음으로 처음부터 끝까지 합니다. 다른 인턴 세 명의 역할극은 다음 주로 밀립니다.",
    c22_roleplay_task: "제안서는 인재개발부로 갑니다. 다음 기수 교육 과정에 '안 파는 법' 한 시간이 들어갈지는 여름에 정해집니다.",
    c22_roleplay_next: "다음 순서로 넘기면 역할극은 제시간에 끝납니다. 하준은 복도 자판기 앞에서 한참 서 있습니다.",
    c22_final_override: "사람이 뒤집으면 끝까지정밀은 월요일에 기계 계약서를 씁니다. 전국 첫 예외 승인 서명란에 이름이 들어가고, 나머지 40건은 여전히 R-17 아래에 있습니다.",
    c22_final_object: "이의를 제기하면 41건이 모두 다시 심사대에 오릅니다. 세온메디칼은 기다려 주지 않고, 끝까지정밀의 첫 큰 주문은 베트남으로 갑니다.",
    c22_final_bank: "다른 은행은 이자를 더 받고 월요일에 서류를 받아 줍니다. 공장은 돌고, KD은행의 R-17은 아무 일도 없었던 것처럼 다음 신청을 거절합니다.",
    c22_after_warm: "남아 있으면 객장 불이 꺼질 때까지 떡이 돕니다. 하준이 번호표 기계 위에 마지막 떡을 올려 둡니다.",
    c22_after_record: "한 권으로 묶인 문서의 첫 장은 고등학생의 한 줄입니다. 본점 심사부 누군가가 그 줄에 형광펜을 긋습니다.",
    c22_after_rush: "곧장 가면 수료식 박수가 끝나기 전에 자리를 뜨게 됩니다. 하준은 사진 속에서 당신이 있던 빈자리를 봅니다.",
    c22_route_system_publish: "공개하면 41곳이 같은 문장을 받습니다. KD데이터랩은 그날 오후 '설명 기능 개선 예정'이라는 공지를 냅니다.",
    c22_route_system_human: "사유서를 붙이면 거절마다 사람의 이름이 한 줄씩 생깁니다. 탁예린은 처음으로 거절 문자가 아닌 사유를 씁니다.",
    c22_route_system_drop: "다시 넣은 신청서는 0.8초 만에 같은 결과를 받습니다. 캡처는 류세아의 바탕화면에 남습니다.",
    c22_final_system_route_a: "사람이 다시 보면 거절마다 하루가 더 걸립니다. 그 하루 동안 누군가는 결과가 아니라 이유를 듣게 됩니다.",
    c22_final_system_route_b: "안내문은 친절해집니다. '아쉽지만'이 '진심으로 아쉽지만'으로 바뀝니다.",
    c22_final_system_route_c: "41곳이 모이면 목소리가 커집니다. 그만큼 오래 걸리고, 그동안 가장 급한 곳부터 문을 닫습니다.",
    c22_evidence_turn_purge: "버티면 명단은 지워질지도 모릅니다. 그동안 끝까지정밀을 포함한 29곳은 어떤 대출도 받지 못합니다.",
    c22_evidence_turn_hold: "쥐고 있으면 주주총회 날의 가장 날카로운 칼이 됩니다. 그 사이 1,021명 중 누군가는 또 대출을 신청하고, 또 거절당합니다.",
    c22_evidence_turn_share: "알리면 피해자 모임 단체방이 밤새 울립니다. 문가을이 맨 처음 쓴 메시지는 '다들 대출 신청했으면 말해요'입니다.",
  },
  characterProfiles: {
    탁예린: {
      role: "KD은행 강서지점 기업대출 담당 대리 · 4년 차",
      stance: "답답함 · 원칙 · 이름",
      job: "노아의 결과를 사람이 뒤집을 수 없게 된 창구에서, 뒤집을 방법을 끝까지 찾는다.",
      appearance: "손목에 감은 머리끈, 형광펜으로 줄 친 노아 운영 지침, 모니터 옆에 붙인 '아쉽지만 금지' 포스트잇.",
      thought: "나는 심사를 배우려고 은행에 왔다. 거절 문자를 다듬으려고 온 게 아니다.",
      gesture: "탁예린은 할 말이 많을수록 마우스를 놓고 두 손을 무릎 위에 올린다.",
      voice: "빠르고 또박또박 말하고, 규정 번호를 먼저 댄 뒤 자기 생각을 붙인다.",
      line: "의견란은 있어요. 읽는 사람이 없을 뿐이에요.",
    },
    문하준: {
      role: "KD은행 청소년 금융 인턴 · 고등학교 2학년 · 문가을의 아들",
      stance: "호기심 · 애도 · 끝까지",
      job: "은행이 어떻게 판단하는지 처음 배우는 눈으로, 은행이 설명하지 않는 것을 묻는다.",
      appearance: "교복 위의 인턴 명찰, 모서리가 닳은 스케치북, 아빠 공장 열쇠고리를 따라 산 톱니바퀴 키링.",
      thought: "아빠 같은 사람한테 대출을 제대로 해 주는 은행원이 되고 싶다. 근데 제대로가 뭔지 아무도 안 알려 준다.",
      gesture: "문하준은 대답을 모르면 스케치북부터 펴서 그림을 그린다.",
      voice: "곧장 묻고, 어른들이 대답을 돌리면 같은 질문을 한 번 더 한다.",
      line: "파는 법 말고, 안 파는 법은 안 가르쳐 줘요?",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "2월 셋째 주 월요일 · 인턴십 1일차 08시" },
  sceneContext: {
    c22_start: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 셋째 주 월요일 · 인턴십 1일차 08시",
      question: "죽은 사람의 이름 때문에 공장의 대출이 0.8초 만에 거절됐습니다. 무엇부터 하겠습니까?",
      lead: "2월 셋째 주 월요일 아침, 도윤하가 휴대폰 두 대를 들고 분석관실 문을 엽니다.",
    },
    c22_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 셋째 주 월요일 · 인턴십 1일차 08시",
      question: "귤 냄새가 가시기도 전에 끝까지정밀이 거절됐습니다. 그 손으로 어디부터 가겠습니까?",
      lead: "손끝에서 아직 귤 냄새가 나는 월요일 아침입니다.",
    },
    c22_start_record: {
      place: "트리거랩 4층 분석관실 · 이민서 자리",
      clock: "2월 셋째 주 월요일 · 인턴십 1일차 08시",
      question: "기록의 주인에게 볼 길을 연 다음 주, 기계가 죽은 사람의 기록을 꺼내 썼습니다. 어느 기록부터 열겠습니까?",
      lead: "모니터 옆에 '천천히 읽겠습니다'라는 답장이 붙어 있는 월요일 아침입니다.",
    },
    c22_start_rush: {
      place: "트리거랩 4층 분석관실 · 새벽",
      clock: "2월 셋째 주 월요일 · 새벽 06:10",
      question: "서둘러 올라와 붙든 심사 목록의 열두 번째 줄이 끝까지정밀입니다. 어디로 먼저 가겠습니까?",
      lead: "주말 내내 켜 둔 모니터에서 월요일 새벽, 심사 목록이 갱신됩니다.",
    },
    c22_counter: {
      place: "KD은행 강서지점 · 객장",
      clock: "인턴십 1일차 · 10시",
      question: "떡을 돌리는 문가을은 아직 거절 사실을 모릅니다. 언제, 어떻게 알리겠습니까?",
      lead: "인턴 첫날, 셔터가 올라가기 전부터 교복 입은 인턴 하나가 번호표 기계를 닦고 있습니다.",
    },
    c22_branch_shop: {
      place: "망원시장 가을떡방 · 셔터 앞",
      clock: "2월 · 인턴십 1일차 · 20시",
      question: "남편 이름을 떼려고 문가을이 이사장에서 빠지겠다고 합니다. 무엇이라 하겠습니까?",
    },
    c22_branch_shop_follow: {
      place: "망원시장 가을떡방 · 도마 앞",
      clock: "2월 · 인턴십 1일차 · 21시",
      question: "아빠 때문에 엄마가 안 되는 거냐고 하준이 묻습니다. 어떻게 답하겠습니까?",
    },
    c22_comment: {
      place: "KD은행 강서지점 · 2번 기업대출 창구",
      clock: "인턴십 1일차 · 18시",
      question: "결과를 바꾸지 못하는 의견란에 열아홉 번 쓴 담당자가 있습니다. 그 칸을 어떻게 쓰겠습니까?",
    },
    c22_comment_reaction: {
      place: "KD은행 강서지점 · 창구 뒤 면담실",
      clock: "인턴십 1일차 · 19시",
      question: "노아는 위험이 아니라 거절해 온 습관을 배웠습니다. 이 통계를 어떻게 쓰겠습니까?",
    },
    c22_factory: {
      place: "인천 남동공단 끝까지정밀 · 공장",
      clock: "2월 · 인턴십 3일차 · 19시",
      question: "'끝까지'가 열한 번 나오는 계획서로는 3월 4일 납기를 설득하기 어렵습니다. 무엇을 고치겠습니까?",
      lead: "거절 소식을 안고 온 저녁, 공장 셔터 틈으로 기계 소리가 새어 나옵니다.",
    },
    c22_heater: {
      place: "인천 남동공단 끝까지정밀 · 선반 옆",
      clock: "2월 · 23:10",
      question: "난로는 꺼졌고 조합원들은 두 달째 월급이 없습니다. 3월까지 무엇으로 버티겠습니까?",
    },
    c22_heater_reaction: {
      place: "인천 남동공단 끝까지정밀 · 공장 작업대",
      clock: "2월 · 새벽 01:00",
      question: "거절한 쪽 장부에는 비용이 0원이라고 컵라면 뚜껑에 적혔습니다. 이 계산서를 어디에 쓰겠습니까?",
    },
    c22_roleplay: {
      place: "KD은행 강서지점 · 3층 교육 회의실",
      clock: "인턴십 4일차 · 14시",
      question: "판매 역할극 도중 하준이 아빠 이야기를 하다 멈췄습니다. 이 방을 어떻게 하겠습니까?",
      lead: "목요일 오후, 인턴 교육 시간표에 '판매 역할극'이라고 적혀 있습니다.",
    },
    c22_notebook: {
      place: "KD은행 강서지점 · 뒤편 골목 계단",
      clock: "2월 눈발 · 인턴십 4일차 · 19시",
      question: "하준의 아빠에게 대출을 판 사람이 멘토였습니다. 수료식 전날, 이 사실을 어떻게 하겠습니까?",
    },
    c22_notebook_reaction: {
      place: "트리거랩 4층 분석관실 · 야간",
      clock: "수료식 전날 · 22:00",
      question: "예외 승인 서명란에 전국에서 아무도 이름을 쓰지 않았습니다. 그 칸을 누가 채우게 하겠습니까?",
    },
    c22_route_system: {
      place: "판교 KD데이터랩 · 서버실 시험 단말",
      clock: "인턴십 1일차 · 23:30",
      question: "노아가 거절의 이유를 과거의 거절로만 설명합니다. 이 순환을 어떻게 끊겠습니까?",
    },
    c22_final_system_route: {
      place: "판교 KD데이터랩 · 데이터센터 관제 단말",
      clock: "수료식 당일 · 새벽",
      question: "기계의 거절에 한 가지 규칙을 붙일 수 있다면, 무엇을 붙이겠습니까?",
    },
    c22_evidence_turn: {
      place: "판교 KD데이터랩 · 서버실 학습 데이터 목록",
      clock: "수료식 당일 · 07시",
      question: "배상을 신청한 1,021명이 노아의 위험 명단이 되어 있었습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c22_final: {
      place: "KD은행 강서지점 · 2층 회의실",
      clock: "세온메디칼 통보 D-3 · 오늘 15시",
      question: "한 곳을 지금 살릴지, 41곳을 늦게 다 볼지, 다른 은행으로 보낼지 정해야 합니다. 어떻게 하겠습니까?",
      lead: "수료식 한 시간 전, 회의실 테이블에 서류 세 가지가 나란히 놓여 있습니다.",
    },
    c22_aftershock: {
      place: "KD은행 강서지점 · 객장",
      clock: "인턴십 5일차 · 수료식 16시",
      question: "수료식이 끝날 무렵 김 반장이 주식 한 주로 주주총회에서 말할 수 있냐고 묻습니다. 이 오후를 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c22-r17-list",
    title: "R-17의 명단",
    text: "노아의 '부도 관계인' 태그 1,021건은 사건 12의 자율 배상 신청자 명단이었습니다. 피해자라고 손을 든 사람들이 위험한 사람으로 학습됐습니다.",
  },
  outcomes: {
    c22_after_warm: { tag: "곁에 남은 결말", title: "수료식 떡 상자가 빌 때까지 객장에 남았다", text: "수료식이 끝나고도 한참, 문가을 가족과 탁예린과 여섯 사람이 객장 의자를 함께 정리했습니다. 마지막 떡은 번호표 기계 위에 올려 두었습니다." },
    c22_after_record: { tag: "문서로 남긴 결말", title: "인턴의 한 줄이 R-17 이의서의 첫 장이 됐다", text: "하준이 쓴 보고서 마지막 줄과 41건의 거절 사례가 한 권으로 묶여, 본점 심사부와 금융감독원에 함께 접수됐습니다." },
    c22_after_rush: { tag: "먼저 달려간 결말", title: "김 반장의 1주로 주주총회 준비를 시작했다", text: "수료식 박수가 끝나기도 전에 당신은 주주총회 일정표를 찾았습니다. 김 반장은 그날 밤 KD금융그룹 주식 한 주를 샀습니다." },
  },
  carryovers: {
    c22_after_warm: { trust: 9, humanCost: -5, fatigue: -7 },
    c22_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c22_after_rush: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c21_after_warm: { id: "protect-trust", title: "귤 상자를 나눈 사람들과 함께 가기", text: "마지막 비행기까지 귤 상자를 싼 여섯 명은 여전히 함께입니다. 끝까지정밀 앞에 혼자가 아니라 여섯이 서는 선택을 찾아야 보너스가 열립니다." },
    c21_after_record: { id: "use-reframe", title: "기록의 주인에게 돌려주기", text: "1기에게 자기 기록을 볼 길을 열어 준 다음 주, 노아가 죽은 사람의 이름을 위험으로 적었습니다. 이번 기록의 주인은 누구인지 판을 다시 짜야 합니다." },
    c21_after_rush: { id: "repair-legitimacy", title: "서둘러 떠난 섬의 공정함 회복하기", text: "선우진에게 천천히 인사하지 못하고 노아의 목록부터 열었습니다. 이번에는 거절당한 사람들이 이유를 이해할 수 있는 선택을 찾아야 합니다." },
  },
};
