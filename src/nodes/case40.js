/**
 * CASE 40 -- the score that learned to punish a pause.
 *
 * In 사건 20 the lab found that its reaction records had been sold with a second
 * purpose line, "organisational fit"; in 사건 30 the six found the buyer, a hiring
 * start-up called 핏스코어. Now the product is on the market. A twelve-minute
 * game replaces the interview at 138 companies, and anyone under 60 is dropped
 * without meeting a person. 문하준, a high-school senior trying to earn his own
 * university application fees, is dropped from a weekend bakery job with 41.
 *
 * 마서윤, the founder, is not a villain. She failed twenty-one interviews for her
 * accent and her smile and built a machine that cannot hear either. What she does
 * not know is what her machine learned from: the heaviest weight in the model is
 * the seconds a person hesitates, the "unfit" anchor profile is 분석관 A -- the
 * analyst, down to the nine seconds before the dissent -- and the "fit" anchor is
 * 관리자 H, 한서윤 rejecting that dissent in eleven minutes. The boy failed for
 * resembling the person who wrote it.
 *
 * The spread: 강태민 scoring 41 with "lacks leadership" because he carried every
 * teammate's boxes in the team round, 권도현 finding that dropping a person costs a
 * quarter of meeting one, a 54-year-old bookkeeper who froze on the question she
 * was once fired for refusing, 마서윤 failing her own test in a rice-cake shop and
 * being handed the burnt 인절미 that is not for sale, and 문가을 writing 100 on her
 * son's CV. It closes the Friday before the group's autumn hiring opens on the
 * test, and 차지원 calls: 윤상혁 is on the witness list for 사건 41.
 */
export const case40Nodes = {
  c40_start: {
    phase: "CASE 40 BRIEFING",
    title: "41점",
    speaker: "문하준",
    text:
      "화면에는 베이커리 카페 르방하우스 망원점의 주말 아르바이트 탈락 통보가 떠 있습니다. '지원자님의 조직 적합도(사람이 회사에 얼마나 잘 맞을지 매긴 점수)는 41점으로, 면접 기준 60점에 미치지 못했습니다.' 가게는 그걸 'AI 면접'이라고 불렀지만 사람은 한 명도 나오지 않았습니다. 지원서를 내자 12분짜리 게임형 역량검사(게임처럼 풀게 하면서 반응을 재는 채용 시험) 링크가 왔고, 일주일 뒤 어젯밤 다큐멘터리가 끝날 무렵 이 문자 한 줄이 왔습니다. 하준이 스케치북 귀퉁이를 접었다 폅니다. '수시 원서비 38만 원, 엄마 몰래 벌려고 했거든요. 근데 제가 뭐가 안 맞는지는 안 알려 줘요.' 그때 이민서의 메시지가 옵니다. 검사를 만든 회사는 핏스코어. 5월 말 KD데이터랩에서 찾아낸 계약서 속, 트리거랩 반응 기록을 사 간 바로 그 회사입니다. 어젯밤 방송에서 잘릴 뻔했던 6분의 주인공이기도 합니다.",
    memo: [
      "르방하우스 망원점 주말 아르바이트 -- 41점, 기준 60점",
      "'AI 면접' 12분, 사람 면접 0분",
      "검사 회사: 핏스코어 -- 트리거랩 반응 기록 구매처",
      "문하준의 목표: 수시 원서비 38만 원",
    ],
    triggers: ["injustice", "affection", "curiosity"],
    choices: [
      {
        id: "c40_start_visit",
        label: "문하준과 함께 그 가게 점장부터 직접 찾아간다",
        effect: { trust: 12, humanCost: -4, time: -4, capital: -2, fatigue: 5 },
        next: "c40_demo",
        cognition: { persistence: 2 },
      },
      {
        id: "c40_start_claim",
        label: "탈락 통보에 적힌 점수의 산정 근거부터 청구한다",
        effect: { legitimacy: 11, time: -5, trust: -1, humanCost: 3, fatigue: 3 },
        next: "c40_demo",
        cognition: { inference: 2 },
      },
      {
        id: "c40_start_post",
        label: "탈락 문자를 캡처해 오늘 밤 인터넷에 공개한다",
        effect: { capital: 7, time: 6, legitimacy: -6, trust: 2, humanCost: 4, fatigue: -2 },
        next: "c40_demo",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c40_demo",
      },
    ],
  },
  c40_demo: {
    phase: "THE DEMO",
    title: "12분의 게임",
    speaker: "마서윤",
    text:
      "통유리 회의실, 대표 마서윤이 흰 운동화 끝으로 박자를 맞추며 태블릿을 내밉니다. '의심되시면 직접 해 보세요.' 석 달 전 이 건물 설명회장에서 의자 180개를 혼자 폈던 강태민이 먼저 앉습니다. 12분 뒤 결과가 뜹니다. 41점, 리더십 부족, 협업 지수 하위 8%. 팀 과제에서 동료 아바타의 짐까지 전부 혼자 옮겼기 때문입니다. 강태민이 짧게 말합니다. '혼자 드는 게 빨라요.' 회의실에 웃음이 터지고 마서윤도 웃습니다. 그리고 진지해집니다. '저는 면접에서 스물한 번 떨어졌어요. 부산 사투리 때문에, 웃는 얼굴이 어색하다고. 숫자는 사투리를 몰라요.' 그가 알고리즘(점수를 계산하는 규칙) 설명서를 넘기다 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록) 출처 칸에서 손을 멈춥니다. '제공처: KD데이터랩.' 그 기록이 누구의 것인지는 모르는 얼굴입니다.",
    memo: [
      "핏스코어 도입 기업 138곳 -- 올해 응시자 6만 2천 명",
      "60점 미만 자동 탈락 9,412명",
      "강태민: 41점, '리더십 부족 · 혼자 짐을 드는 경향'",
      "학습 데이터 제공처: KD데이터랩",
    ],
    triggers: ["curiosity", "injustice", "competition"],
    choices: [
      {
        id: "c40_demo_rehear",
        label: "문하준의 점수를 사람 면접으로 다시 보게 해 달라고 한다",
        effect: { trust: 11, humanCost: -5, legitimacy: 2, time: -5, fatigue: 5 },
        next: "c40_anchor",
        cognition: { persistence: 2 },
      },
      {
        id: "c40_demo_source",
        label: "학습 데이터가 누구의 기록인지 출처부터 따진다",
        effect: { legitimacy: 12, trust: -3, time: -6, humanCost: 2, fatigue: 4 },
        next: "c40_anchor",
        cognition: { inference: 2 },
      },
      {
        id: "c40_demo_film",
        label: "강태민의 결과 화면을 찍어 여론전에 먼저 쓴다",
        effect: { capital: 6, time: 5, trust: 3, legitimacy: -7, humanCost: 4, fatigue: -3 },
        next: "c40_anchor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c40_anchor",
      },
    ],
  },
  c40_anchor: {
    phase: "THE MIRROR",
    title: "유사도 0.83",
    speaker: "류세아",
    text:
      "모델에는 '부적합 기준 프로필'이 하나 있습니다. 지원자의 반응이 이 프로필과 닮을수록 점수가 떨어집니다. 류세아가 프로필의 원본 번호를 따라가자 기호 하나가 나옵니다. 분석관 A. 7월 말 유출 때 온 나라가 읽은 그 기호, 당신입니다. 3년 치 반응 기록에 2023년 반대 의견서 작성 시각까지 들어 있습니다. 류세아가 문하준의 검사 결과를 옆에 띄웁니다. 두 기록의 유사도(두 반응 기록이 얼마나 닮았는지 나타내는 수치)는 0.83. 하준은 '고객에게 불리한 상품을 권하라는 지시' 문항에서 7초를 멈췄고, 당신은 3년 전 같은 모양의 문항에서 9초를 멈췄습니다. 류세아가 말끝을 낮춥니다. '하준이는 당신을 닮아서 떨어졌어요.' 이 기록의 정보 주체(그 기록의 주인인 사람)는 당신인데, 누구도 당신에게 묻지 않았습니다.",
    memo: [
      "부적합 기준 프로필: 분석관 A -- 당신의 3년 치 기록",
      "문하준과의 유사도 0.83",
      "하준 7초, 당신 9초 -- 같은 모양의 지시 문항",
      "기록 사용 동의: 받은 적 없음",
    ],
    triggers: ["selfAwareness", "affection", "injustice"],
    choices: [
      {
        id: "c40_anchor_tell",
        label: "문하준에게 내 기록 때문이라는 사실을 직접 먼저 말한다",
        effect: { trust: 13, humanCost: -4, legitimacy: -3, time: -4, fatigue: 5 },
        next: "c40_steam",
        cognition: { persistence: 2 },
      },
      {
        id: "c40_anchor_claim",
        label: "정보 주체로서 내 기록의 열람과 삭제를 공식 청구한다",
        effect: { legitimacy: 13, trust: 2, time: -6, humanCost: 3, fatigue: 5 },
        next: "c40_steam",
        cognition: { inference: 2 },
      },
      {
        id: "c40_anchor_hide",
        label: "내 기록이라는 사실은 숨기고 조용히 증거로만 쓴다",
        effect: { capital: 5, time: 6, trust: -3, legitimacy: 3, humanCost: 4, fatigue: -4 },
        next: "c40_steam",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c40_steam",
      },
    ],
  },
  c40_steam: {
    phase: "THE STEAM",
    title: "떡방의 재시험",
    speaker: "문가을",
    text:
      "찜기 김이 선풍기 바람에 흩어집니다. 문가을은 마서윤에게 떡을 권하지 않습니다. 대신 휴대폰을 내밉니다. '당신 회사 시험, 여기서 한번 풀어 봐요.' 마서윤이 웃으며 앉습니다. 9분째, 화면이 '고객에게 불리한 사실을 알릴지' 묻는 문항에서 그의 손가락이 멈춥니다. 한참 뒤 결과가 뜹니다. 44점. 가게 안이 조용해집니다. 강태민이 먼저 입을 엽니다. '저랑 하준이보다 3점 높네요. 리더십 부족 동지.' 누군가 웃고, 마서윤도 따라 웃다가 입술을 깨뭅니다. '제 회사에 제가 떨어졌네요. 스물두 번째예요.' 문가을이 한참 보다가 조금 탄 인절미 하나를 그 앞에 놓습니다. '그건 안 파는 거예요. 먹어요.' 마서윤이 인절미를 든 채 묻습니다. '그럼 저는 뭘 믿고 이 회사를 만든 거죠?'",
    memo: [
      "마서윤 본인 응시: 44점 -- 자기 회사 기준 탈락",
      "멈춘 문항: 고객에게 불리한 사실을 알릴지",
      "핏스코어 직원 42명, 다음 주 KD 공채 계약 대기",
      "문가을이 내놓은 것: 팔지 않는 탄 인절미",
    ],
    triggers: ["trust", "affection", "choice"],
    choices: [
      {
        id: "c40_steam_persuade",
        label: "마서윤에게 서비스를 함께 멈추자고 사람으로서 설득한다",
        effect: { trust: 12, humanCost: -4, legitimacy: 3, capital: -5, time: -3, fatigue: 5 },
        next: "c40_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c40_steam_audit",
        label: "외부 전문가의 모델 검증을 합의서로 받아 낸다",
        effect: { legitimacy: 12, trust: 4, capital: -4, time: -5, humanCost: 2, fatigue: 4 },
        next: "c40_final",
        cognition: { inference: 2 },
      },
      {
        id: "c40_steam_deal",
        label: "KD 기록만 빼는 조건으로 서비스 존속을 눈감아 준다",
        effect: { capital: 8, time: 5, trust: -4, legitimacy: -5, humanCost: 5, fatigue: -3 },
        next: "c40_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c40_final",
      },
    ],
  },
  c40_final: {
    phase: "FINAL DECISION",
    title: "월요일 전에",
    speaker: "마서윤",
    text:
      "화면 속 투자사 로고 가운데 하나가 KD캐피탈입니다. 마서윤이 스마트워치를 풀어 탁자에 내려놓습니다. '월요일에 KD 공채가 열리면 우리 검사를 6만 명이 풀어요. 회사가 이만큼 커 본 적이 없어요.' 류세아가 서류 세 장을 나란히 놓습니다. 60점 밑으로 떨어진 9,412명을 모두 사람 면접으로 다시 보게 하는 재심사 계획, 알고리즘과 항목별 점수 비중을 전부 공개하는 설명서, 그리고 이민서가 준비한 KD 기록 사용 계약 해지 통지서. 해지하면 서비스는 오늘 밤 멈추고, 직원 42명의 월요일도 멈춥니다. 유리문 너머 복도에서 문하준이 스케치북을 무릎에 올려놓고 기다립니다. 마서윤이 묻습니다. '어느 쪽이든, 제가 믿던 걸 틀렸다고 말하라는 거죠?'",
    memo: [
      "재심사 대상 9,412명 -- 사람 면접 비용 약 4억",
      "공개 설명서: 항목 40개와 기준 프로필 2개",
      "계약 해지 시 서비스 즉시 중단, 직원 42명",
      "KD금융그룹 하반기 공채 접수: 월요일 09시",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c40_final_list",
        label: "떨어진 9,412명을 모두 사람 면접으로 다시 보게 한다",
        effect: { trust: 13, humanCost: -6, legitimacy: 5, capital: -9, time: -7, fatigue: 6 },
        next: "case40_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c40_final_open",
        label: "알고리즘과 점수 비중을 전부 공개해야 공채를 열게 한다",
        effect: { legitimacy: 13, trust: 6, capital: -6, time: -8, humanCost: 3, fatigue: 5 },
        next: "case40_result",
        cognition: { inference: 2 },
      },
      {
        id: "c40_final_cut",
        label: "KD 기록 계약을 끊어 서비스를 오늘 밤 멈춘다",
        effect: { capital: 10, time: 6, trust: -3, legitimacy: -6, humanCost: 5, fatigue: -4 },
        next: "case40_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case40_result",
      },
    ],
  },
};

/**
 * Everything else case 40 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case40 = {
  id: "case40",
  nodes: case40Nodes,
  aftermath: {
    c40_aftershock: {
      phase: "AFTERMATH",
      title: "100점짜리 이력서",
      speaker: "문하준",
      text: "토요일 오후, 가을떡방 유리문에 A4 한 장이 붙습니다. '아르바이트 구함. 시험 없음. 면접은 떡 썰면서.' 문가을의 글씨입니다. 첫 지원자는 문하준이고, 문가을은 이력서 점수 칸에 빨간 펜으로 100을 씁니다. 하준이 '엄마, 이건 채용 비리예요'라고 하자 권도현이 '시급이 최저임금 이상이면 적법합니다'라고 확인해 줍니다. 강태민은 떡 상자를 혼자 다 나르다가 모두에게 '리더십 부족' 소리를 듣습니다. 해 질 무렵 휴대폰이 울립니다. 차지원입니다. 국회 청문회(국회가 증인을 불러 한 사건을 집중해서 따져 묻는 자리) 이야기입니다. '다음 주 증인 명단 확정됐어요. 윤상혁 이름이 있어요. 당신한테 질문 기회가 딱 하나 돌아와요.'",
      memo: ["가을떡방 아르바이트 채용 1명 -- 시험 없음", "이력서 점수 칸: 빨간 펜 100", "41점 모임 명단 1,106명", "차지원: 청문회 증인 윤상혁, 질문 기회 1개"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c40_after_warm", label: "오늘은 떡방 셔터를 내릴 때까지 하준의 첫 근무를 함께한다", effect: { trust: 11, humanCost: -6, time: -3, capital: -4, fatigue: -7 }, next: "case40_result", cognition: { reframing: 2 } },
        { id: "c40_after_record", label: "41점 모임 명단을 청문회 자료로 문서화해 남긴다", effect: { legitimacy: 14, trust: 5, time: -6, capital: -2, fatigue: 5 }, next: "case40_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c40_after_rush", label: "차지원의 전화를 받은 채 곧장 국회로 간다", effect: { capital: 7, legitimacy: 6, trust: -6, humanCost: 5, fatigue: 5 }, next: "case40_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c40_final", "c40_aftershock"],
  connectiveScenes: [
    ["c40_weight", "c40_demo", "c40_anchor", "마이너스 0.31", "류세아", "밤 11시, 판교 KD데이터랩 서버실. 류세아가 이민서의 출입증으로 들어온 당신을 보고 라벨을 한 장 뽑아 서버 랙에 붙입니다. '핏스코어'. 핏스코어가 받아 간 모델 설정 파일이 화면에 열립니다. 항목 40개의 가중치(점수를 매길 때 항목마다 주는 무게)가 한 줄씩 있습니다. 가장 무거운 항목은 '결정 전 망설임 시간', 값은 마이너스 0.31입니다. 망설일수록 점수가 깎인다는 뜻입니다. 류세아가 보온병 뚜껑을 닫습니다. '문제를 끝까지 읽는 사람, 대답 전에 한 번 더 생각하는 사람이 제일 크게 감점돼요. 이건 성실함을 벌주는 숫자예요.'", ["모델 항목 40개 -- 가장 무거운 항목: 망설임 시간", "값 -0.31: 오래 멈출수록 감점", "설정 파일 작성: KD데이터랩 · 핏스코어 공동"], ["망설임 항목을 빼고 탈락자 점수를 다시 계산해 본다", "가중치 표에 대한 설명 요구서를 정식으로 보낸다", "설정 화면만 찍어 두고 들키기 전에 서버실을 나온다"]],
    ["c40_list", "c40_anchor", "c40_steam", "41점 모임", "도윤하", "화요일 밤, 회기동 헌책방 1층. 도윤하가 문하준과 함께 '60점 밑에서 떨어진 사람'을 찾는 온라인 설문을 열었습니다. 하준이 제목을 '41점 모임'으로 바꾸자 밤새 1,106명이 답을 남깁니다. 도윤하가 한 줄을 소리 내어 읽다 멈춥니다. 쉰네 살 전직 경리입니다. '고객 돈을 다른 계좌로 옮기라는 문제에서 손이 멈췄어요. 예전 회사에서 그런 지시를 거절했다가 잘렸거든요. 그래서 이번에도 떨어진 것 같아요.' 도윤하가 수첩을 폅니다. 3년 전 창구에서 쓰던 수첩과 같은 모양입니다. 첫 줄에 그 사람 이름을 적습니다.", ["설문 12시간 응답 1,106명", "응답자 평균 점수 47점", "자유 서술 최다 단어: '멈췄다'"], ["응답자 한 명씩 전화해 사연을 직접 듣는다", "동의서를 받아 명단을 법적 자료 형식으로 정리한다", "숫자만 추려 오늘 밤 서하린에게 기사로 넘긴다"]],
    ["c40_notice", "c40_steam", "c40_final", "하반기 공채 공고", "오진우", "목요일 아침, 오진우가 브릿지은행 로비에서 전화를 겁니다. 목소리가 평소보다 빠릅니다. 'KD금융그룹 하반기 공채 공고 나왔어요. 신입 420명이에요. 상반기엔 최종 면접 참고 자료였던 핏스코어 점수가 이번엔 1차 관문이에요. 60점 밑은 서류도 안 봅니다. 접수는 다음 주 월요일.' 공고 맨 아래에는 도입 이유가 적혀 있습니다. '면접관의 편견을 줄이는 공정 채용.' 오진우가 잠깐 말을 멈춥니다. '우리 아버지가 좋아하실 문장이네요. 근데 저 검사로 뽑으면, 반대 의견 쓰는 사람은 이제 그 은행에 못 들어가요. 처음부터요.'", ["KD금융그룹 하반기 신입 420명 -- 1차 핏스코어", "60점 미만 서류 심사 제외", "접수 시작: 다음 주 월요일"], ["공채 지원 예정자들에게 검사 구조를 먼저 알린다", "그룹 인사부에 도입 근거 자료를 공식 요구한다", "공고 문장을 캡처해 오늘 안에 반박 글을 올린다"]],
  ],
  connectiveOrder: [["c40_demo", "c40_weight"], ["c40_anchor", "c40_list"], ["c40_steam", "c40_notice"]],
  choiceEffects: {
    c40_demo: [
      { trust: 10, humanCost: -5, capital: -3, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 2, time: -4, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -2, humanCost: 4, fatigue: -3 },
    ],
    c40_anchor: [
      { trust: 11, humanCost: -6, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -4, humanCost: 4, fatigue: 3 },
      { capital: 5, time: 5, trust: -3, humanCost: 4, legitimacy: 2, fatigue: -3 },
    ],
    c40_steam: [
      { trust: 10, humanCost: -4, legitimacy: 3, time: -4, fatigue: 4 },
      { legitimacy: 11, trust: -1, time: -4, humanCost: 3, fatigue: 2 },
      { time: 5, capital: 5, trust: 2, legitimacy: -6, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c40_demo: {
      voice: ["망설임 항목을 빼고, 탈락자 점수를 다시 계산해 본다.", "가중치 표에 대한 설명 요구서를, 정식으로 보낸다.", "설정 화면만 찍어 두고, 들키기 전에 서버실을 나온다."],
      echo: ["다시 계산하면 9,412명 중 6,030명이 60점을 넘습니다. 그 숫자를 받아 줄 회사는 아직 없습니다.", "요구서는 접수 번호를 받습니다. 답변 기한은 30일이고, KD 공채는 다음 주입니다.", "사진은 남습니다. 파일 원본이 아니라서 핏스코어는 '조작된 화면'이라고 말할 수 있습니다."],
    },
    c40_anchor: {
      voice: ["응답자 한 명씩 전화해서, 사연을 직접 듣는다.", "동의서를 받아, 명단을 법적 자료 형식으로 정리한다.", "숫자만 추려서, 오늘 밤 서하린에게 기사로 넘긴다."],
      echo: ["전화를 돌리면 밤이 짧아집니다. 쉰네 살 경리는 통화 끝에 '처음으로 제가 맞았다고 해 준 사람'이라고 말합니다.", "동의서는 명단을 증거로 만듭니다. 서명란 앞에서 망설이는 사람도 있습니다. 그 망설임도 기록이 됩니다.", "기사는 빨리 나갑니다. 1,106명은 숫자로 불리고, 이름은 아무도 모릅니다."],
    },
    c40_steam: {
      voice: ["공채 지원 예정자들에게, 검사 구조를 먼저 알린다.", "그룹 인사부에, 도입 근거 자료를 공식 요구한다.", "공고 문장을 캡처해서, 오늘 안에 반박 글을 올린다."],
      echo: ["알리면 지원자들은 멈추지 않는 법을 연습합니다. 검사를 피하는 대신 검사에 맞춰 자기를 고치기 시작합니다.", "요구는 인사부 문서함에 들어갑니다. 인사부는 '외부 업체의 영업비밀'이라는 답장을 준비합니다.", "반박 글은 하루 만에 퍼집니다. 그룹 홍보실은 '공정 채용을 반대하는 사람들'이라는 제목으로 답합니다."],
    },
  },
  reactionScenes: [
    ["c40_weight_reaction", "c40_weight", "c40_anchor", "적합이라는 이름표", "이민서", "이민서가 원본 기록의 정답 칸을 엽니다. 모델은 트리거랩 분석관들의 반응 기록마다 붙은 '적합'과 '부적합' 이름표로 배웠습니다. 기록은 가명 처리(이름을 지워 누구인지 모르게 바꾸는 것)돼 A-001부터 A-063까지 번호만 남았습니다. 그런데 이름표를 붙인 쪽의 칸에는 가명이 없습니다. '작성: 그룹전략실.' 이민서가 모니터를 손끝으로 두드립니다. '성과로 붙인 이름표가 아니에요. 윗선 지시에 빨리 따른 기록이 적합, 멈춘 기록이 부적합이에요. 이걸로 배운 기계가 지금 아르바이트생을 뽑고 있어요.'", ["이름표가 붙은 기록의 주인들에게 먼저 알린다", "이름표 작성 기록을 증거 목록에 정식으로 올린다", "이름표 문제는 접어 두고 점수 공개부터 밀어붙인다"]],
    ["c40_list_reaction", "c40_list", "c40_steam", "9,800원", "권도현", "권도현이 헌책방 계단참에 계산기를 올려놓습니다. 핏스코어 검사료는 지원자 한 명당 9,800원입니다. 기업이 면접관 두 명에게 한 시간을 쓰면 한 명당 4만 2천 원이 듭니다. '사람을 떨어뜨리는 값이 사람을 만나는 값의 4분의 1입니다.' 그가 계산기를 뒤집어 놓습니다. '이 가격이면 흑자입니다. 회사 장부에서는요. 적자는 떨어진 사람 장부에 적히는데, 그 사람들은 장부가 없습니다.' 옆에서 문하준이 스케치북에 1,106칸짜리 표를 그리기 시작합니다.", ["떨어진 사람들 몫의 장부를 우리가 대신 만든다", "검사료와 면접 비용 비교표를 공식 자료로 붙인다", "비교표는 접고 가장 센 사연 하나로 여론을 모은다"]],
    ["c40_notice_reaction", "c40_notice", "c40_final", "모범 답안", "한서윤", "그날 밤, 자리 없이 대기 중인 한서윤이 전화를 받자마자 말합니다. '류세아 씨한테 들었어요. 적합 기준 프로필 말이에요.' 모델에는 부적합의 기준만 있는 게 아니었습니다. 점수를 끌어올리는 '적합 기준 프로필'도 있었고, 가명은 관리자 H. 3년 전 당신의 반대 의견서를 11분 만에 반려한 기록이 들어 있습니다. 수화기 너머가 한참 조용합니다. '제가 모범 답안이래요. 당신 의견서를 제일 빨리 지운 사람이, 이 회사가 뽑고 싶은 사람이에요.' 웃는지 우는지 모를 숨소리가 들립니다.", ["한서윤에게 내일 핏스코어에 같이 가자고 한다", "한서윤의 기록도 삭제 청구 목록에 함께 올린다", "오늘은 위로를 접고 내일 협상 준비만 한다"]],
  ],
  reactionEffects: {
    c40_weight: [
      { trust: 9, legitimacy: 3, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 10, time: -4, humanCost: 2, capital: -2, fatigue: 3 },
      { time: 4, capital: 4, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
    ],
    c40_list: [
      { trust: 8, humanCost: -5, capital: -4, time: -2, fatigue: 3 },
      { legitimacy: 9, trust: 2, capital: -4, time: -3, fatigue: 2 },
      { capital: 6, time: 4, trust: 1, humanCost: 3, legitimacy: -2, fatigue: -2 },
    ],
    c40_notice: [
      { trust: 11, humanCost: -5, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 8, trust: 4, time: -3, humanCost: 2, fatigue: 2 },
      { capital: 5, time: 4, trust: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c40_weight: {
      voice: ["이름표가 붙은 기록의 주인들에게, 먼저 알린다.", "이름표 작성 기록을, 증거 목록에 정식으로 올린다.", "이름표 문제는 접어 두고, 점수 공개부터 밀어붙인다."],
      echo: ["알리면 63명이 자기 번호를 찾기 시작합니다. 이민서의 A-017 옆에도, 도윤하의 번호 옆에도 부적합이 붙어 있습니다.", "증거 목록에 오르면 '그룹전략실' 한 줄은 지워지지 않습니다. 그 줄을 쓴 사람의 이름까지는 아직 멉니다.", "점수 공개는 빠릅니다. 누가 이름표를 붙였는지는 공개된 점수 뒤에 숨습니다."],
    },
    c40_list: {
      voice: ["떨어진 사람들 몫의 장부를, 우리가 대신 만든다.", "검사료와 면접 비용 비교표를, 공식 자료로 붙인다.", "비교표는 접고, 가장 센 사연 하나로 여론을 모은다."],
      echo: ["장부가 생기면 1,106명에게 칸이 생깁니다. 권도현이 칸 이름을 '만나지 못한 비용'이라고 적습니다.", "비교표는 반박하기 어렵습니다. 대신 읽는 사람이 적습니다. 숫자는 사연만큼 멀리 가지 않습니다.", "사연 하나는 멀리 갑니다. 쉰네 살 경리의 이름이 하루 만에 검색어가 되고, 그는 전화를 끕니다."],
    },
    c40_notice: {
      voice: ["한서윤에게, 내일 핏스코어에 같이 가자고 한다.", "한서윤의 기록도, 삭제 청구 목록에 함께 올린다.", "오늘은 위로를 접고, 내일 협상 준비만 한다."],
      echo: ["같이 가면 반대한 사람과 반려한 사람이 마서윤 앞에 나란히 섭니다. 부적합과 적합의 원본이 한 탁자에 앉습니다.", "목록에 오르면 한서윤의 11분도 지워질 수 있습니다. 한서윤은 지워지고 싶은지 한참 대답하지 않습니다.", "준비는 단단해집니다. 한서윤은 전화를 끊고 오래 불을 켜 둡니다."],
    },
  },
  reactionMemos: {
    c40_weight_reaction: ["이름표 작성: 그룹전략실", "빨리 따르면 적합, 멈추면 부적합"],
    c40_list_reaction: ["떨어뜨리는 값 9,800원 · 만나는 값 4만 2천 원", "적자가 적힐 장부가 없는 사람들"],
    c40_notice_reaction: ["적합 기준 프로필: 관리자 H", "반려까지 11분 -- 모범 답안"],
  },
  branchPlan: ["c40_demo", 0, "c40_branch_bakery", "c40_branch_bakery_follow"],
  branchScenes: {
    // CASE 40's detour is the bakery. The case argues with a model about a
    // number; the side door is the manager who has to obey it, and the three
    // people she interviews after closing when the system will not let her.
    c40_branch_bakery: {
      phase: "SIDE DOOR",
      title: "점장의 모니터",
      speaker: "하예솔",
      text: "르방하우스 망원점, 오후 3시의 빈 가게. 점장 하예솔이 앞치마 끈을 두 번 묶었다 풉니다. 문하준이 봄에 이 가게 칠판 메뉴를 그려 준 적이 있다고 합니다. 그가 계산대 모니터를 돌려 보여 줍니다. 이번 달 주말 아르바이트 지원자 열네 명 가운데 열한 명이 60점 미만으로 자동 탈락했습니다. '본사 지침이에요. 60점 밑은 면접도 부르지 말래요. 저도 작년에 이 점수 받고 들어왔어요. 72점.' 그가 한 이름을 가리킵니다. 매일 아침 식빵을 사 가는 옆 건물 할머니의 손녀입니다. '이 친구는 청각장애가 있어요. 자막을 읽느라 반응이 느렸대요.'",
      memo: ["주말 아르바이트 지원자 14명 -- 자동 탈락 11명", "본사 지침: 60점 미만 면접 금지", "점장 하예솔 본인 점수 72점", "탈락자 중 청각장애 지원자 1명"],
      triggers: ["injustice", "affection", "trust"],
      choices: [
        { id: "c40_branch_bakery_a", label: "점장과 함께 탈락한 열한 명을 사람 면접으로 부른다", effect: { trust: 12, humanCost: -5, capital: -4, time: -4, fatigue: 4 }, next: "c40_branch_bakery_follow", cognition: { reframing: 2 } },
        { id: "c40_branch_bakery_b", label: "본사가 내려보낸 60점 지침 문서부터 받아 둔다", effect: { legitimacy: 10, trust: 2, time: -5, humanCost: 3, fatigue: 2 }, next: "c40_branch_bakery_follow", cognition: { inference: 2 } },
        { id: "c40_branch_bakery_c", label: "점장 입장을 봐서 문하준만 조용히 다시 봐 달라고 한다", effect: { time: 5, capital: 3, trust: -5, humanCost: 4, fatigue: -3 }, next: "c40_branch_bakery_follow", cognition: { risk: 1 } },
      ],
    },
    c40_branch_bakery_follow: {
      phase: "SIDE DOOR",
      title: "마감 뒤 면접",
      speaker: "문하준",
      text: "밤 9시, 문 닫은 가게의 불을 반만 켜고 하예솔이 탈락자 세 명을 불렀습니다. 문하준, 청각장애가 있는 스무 살 윤다온, 경력이 끊겼다가 다시 일을 찾는 쉰두 살 한미경 씨. 하예솔이 질문지를 들고 떨자 하준이 스케치북에 '질문은 천천히'라고 써서 식탁에 세웁니다. 윤다온은 질문을 글로 받고, 빵 반죽을 설명하듯 답을 또박또박 적습니다. 한미경 씨는 20년 경리 솜씨로 재고표에서 틀린 칸 두 개를 찾아냅니다. 면접이 끝나자 하예솔이 한숨을 쉽니다. '셋 다 뽑고 싶어요. 근데 본사 시스템에 60점 미만은 입력 칸이 안 열려요.'",
      memo: ["마감 뒤 사람 면접 3명 -- 셋 다 합격 수준", "윤다온: 질문을 글로 받으니 답이 가장 정확함", "한미경: 재고표 오류 2건 발견", "본사 시스템: 60점 미만 입력 불가"],
      triggers: ["trust", "responsibility", "injustice"],
      choices: [
        { id: "c40_branch_bakery_follow_a", label: "세 사람의 채용을 위해 점장 추천서를 함께 쓴다", effect: { trust: 13, humanCost: -6, capital: -6, time: -4, fatigue: 5 }, next: "c40_weight", cognition: { reframing: 3 } },
        { id: "c40_branch_bakery_follow_b", label: "입력 칸이 막힌 화면을 증거로 남겨 노동청 진정을 준비한다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 5 }, next: "c40_weight", cognition: { inference: 2 } },
        { id: "c40_branch_bakery_follow_c", label: "오늘 면접은 없던 일로 하고 점장의 자리부터 지킨다", effect: { time: 6, capital: 5, trust: -6, humanCost: 5, fatigue: -3 }, next: "c40_weight", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c40_start",
    result: "c40_aftershock",
    defaultFree: "c40_route_system",
    // One model, thousands of applicants. Like the cases before it the case is a
    // single line; the split is what the model is allowed to count.
    choices: {},
    system: {
      route: "c40_route_system",
      final: "c40_final_system_route",
      title: "멈춘 사람들의 이력",
      speaker: "류세아",
      text: "준비된 보기 밖의 문장을 쓰자 류세아가 핏스코어 탈락자 9,412명의 응답을 다른 방식으로 묶어 봅니다. 망설임 시간 상위 10% 가운데 자기소개서에 '부당한 지시를 거절한 경험'을 적은 사람은 다른 응시자보다 3.4배 많습니다. 류세아가 라벨을 뽑다 말고 멈춥니다. '이 알고리즘(점수를 계산하는 규칙)은 멈칫하는 사람을 거르고 있어요. 그중 꽤 많은 사람은 멈춰야 할 때 멈춘 사람들이에요. 모델은 그걸 결함으로 배웠고요.' 그가 라벨에 '멈춘 사람'이라고 써서 모니터 위에 붙입니다.",
      memo: ["망설임 상위 10% -- 부당 지시 거절 경험 3.4배", "탈락자 9,412명 중 해당자 약 2,700명", "이 통계는 핏스코어 설명서 어디에도 없음"],
      routeChoices: [
        ["c40_route_system_publish", "통계를 핏스코어를 쓰는 기업 138곳에 동시에 보낸다", { legitimacy: 11, trust: 5, capital: -4, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c40_route_system_reweight", "망설임 항목의 부호를 뒤집어 다시 점수를 매기자고 한다", { trust: 8, legitimacy: 7, humanCost: -3, capital: -6, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c40_route_system_drop", "통계는 덮고 핏스코어와 조용히 협상한다", { time: 7, capital: 5, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "망설임을 감점하지 않는 검사만 채용에 쓰게 하는 기준을 만든다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -3, fatigue: 7 }, { reframing: 3 }],
      ["b", "통계는 두고 탈락자에게 위로금만 지급하게 한다", { capital: 9, time: 6, trust: -5, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "탈락자가 사람 면접을 요구할 권리를 이용 약관에 넣게 한다", { trust: 10, legitimacy: 6, capital: -6, time: -7, humanCost: 2, fatigue: 6 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c40_evidence_turn",
    result: "c40_aftershock",
    sourceRoutes: ["c40_demo", "c40_anchor", "c40_steam", "c40_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 핏스코어 투자사 명단 옆에 놓고, 기록을 판 돈이 어디로 돌아왔는지 맞춰 본다.",
    entryEcho: "단서를 대면 기록을 판 쪽과 산 쪽이 같은 사람의 서명으로 이어집니다. 떨어진 사람들은 그 원 밖에 있습니다.",
    title: "한 바퀴 도는 돈",
    speaker: "반재욱",
    text: "단서를 맞추자 KD캐피탈 투자조합이 핏스코어에 넣은 40억의 투자 승인서가 열립니다. 그룹이 이 회사에 돈을 넣었다는 건 5월에 알았지만, 승인서 원본은 처음입니다. 대표이사 윤상혁의 서명 아래 조건이 두 줄 붙어 있습니다. '데이터 공급: KD데이터랩.' 'KD금융그룹 채용 전형에 우선 도입.' 기록의 이름표는 트리거랩 인사평가 보조지표(사람의 반응 기록을 인사평가에 곁들여 쓰던 점수)에서 그대로 옮겨졌습니다. 반재욱이 수첩을 덮습니다. '그룹이 판 기록을 그룹이 투자한 회사가 사서, 그룹 공채에 씁니다. 돈은 한 바퀴 돌아 제자리로 오고, 떨어진 사람만 밖에 남습니다.'",
    memo: ["KD캐피탈 투자조합 40억 -- 승인 서명 윤상혁", "투자 조건: KD데이터랩 데이터 공급 · 그룹 채용 우선 도입", "이름표 출처: 트리거랩 인사평가 보조지표"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 6, trust: 3, time: -5, fatigue: 4 },
    choices: [
      ["c40_evidence_turn_hand", "투자 계약서와 이름표 기록을 청문회 자료로 차지원에게 넘긴다", { legitimacy: 13, trust: 5, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c40_evidence_turn_show", "계약서를 마서윤에게 먼저 보여 주고 선택을 묻는다", { trust: 12, legitimacy: 4, humanCost: -5, time: -6, fatigue: 5 }, { reframing: 2 }],
      ["c40_evidence_turn_hold", "계약서는 알아 두고 협상 막판의 카드로 쥔다", { capital: 9, time: 6, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c40_branch_bakery",
    systemNext: "c40_route_system",
    evidenceNext: "c40_evidence_turn",
    routeLabel: "직전 사건에서 만난 인터뷰이 연락망으로 탈락자들을 찾는다",
    systemLabel: "직전 자유응답 문장이 핏스코어 설명서에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 핏스코어에 들어간 돈의 길을 연다",
  },
  openingRoutes: {
    c39_after_warm: "c40_start_warm",
    c39_after_record: "c40_start_record",
    c39_after_rush: "c40_start_rush",
  },
  openingCopy: {
    c40_start_warm: ["다음 날 아침으로 미룬 문자", "문하준", "편집실 불을 끌 때까지 인터뷰이들 곁에 남았던 밤, 하준의 문자는 다음 날 아침으로 미뤄 두었습니다. 금요일 오후 가을떡방, 떡 상자를 정리하던 하준이 그 화면을 다시 내밉니다. 르방하우스 망원점 주말 아르바이트, 가게가 'AI 면접'이라 부른 12분짜리 역량검사(게임처럼 풀게 하면서 반응을 재는 채용 시험)의 결과는 조직 적합도(사람이 회사에 얼마나 잘 맞을지 매긴 점수) 41점, 불합격입니다. 사람은 한 명도 만나지 못했습니다. 어젯밤 편집실에 있던 문가을이 떡 칼을 멈춥니다. '방송에 나온 그 회사가 우리 애를 떨어뜨렸다는 거죠?' 하준이 작게 덧붙입니다. '수시 원서비, 제가 벌려고 했던 거예요.'", ["밤새 미뤄 둔 문자 -- 조직 적합도 41점, 불합격", "'AI 면접' 12분, 사람 면접 0분", "핏스코어 -- 트리거랩 반응 기록 구매처"]],
    c40_start_record: ["보존 폴더 속의 6분", "이민서", "잘린 20분의 원본과 편집 이력을 보존 문서로 묶은 다음 날, 이민서가 그 폴더에서 한 구간을 다시 틉니다. 광고주의 '참고 의견'이 잘라 내라던 5부의 6분, 트리거랩 반응 기록이 핏스코어로 팔려 간 이야기입니다. 그때 문하준의 문자가 옵니다. 주말 아르바이트에 지원했더니 가게가 'AI 면접'이라 부르는 역량검사(게임처럼 풀게 하면서 반응을 재는 채용 시험) 링크가 왔고, 결과는 조직 적합도(사람이 회사에 얼마나 잘 맞을지 매긴 점수) 41점, 불합격. 사람은 한 명도 나오지 않았습니다. 이민서의 목소리가 낮아집니다. '우리가 지켜 낸 6분이 어제 방송에 나갔어요. 그리고 같은 밤에, 그 6분 속 회사가 하준이를 떨어뜨렸어요.'", ["보존 폴더: 잘린 20분 원본과 편집 이력", "5부 6분 -- 핏스코어로 팔린 반응 기록", "문하준: 르방하우스 아르바이트 41점 불합격"]],
    c40_start_rush: ["자정의 유리문", "문하준", "방송이 끝나자마자 하준의 41점 문자를 들고 성수동으로 달려갔지만, 자정의 핏스코어 사옥은 불이 꺼져 있었습니다. 휴대폰을 쥔 하준이 뒤따라와 유리문 앞에 나란히 섭니다. 문자에는 르방하우스 망원점 주말 아르바이트, 가게가 'AI 면접'이라 부른 12분짜리 역량검사(게임처럼 풀게 하면서 반응을 재는 채용 시험)의 결과가 적혀 있습니다. 조직 적합도(사람이 회사에 얼마나 잘 맞을지 매긴 점수) 41점, 불합격. 로비 벽에서 표어가 비상등에 비칩니다. '맞는 사람을, 더 빨리.' 하준이 한참 표어를 보다 묻습니다. '저는 느려서 떨어진 거예요? 문제 끝까지 읽었는데.' 경비실 인터폰이 깜빡입니다.", ["방송 직후 성수동 핏스코어 사옥 -- 불 꺼짐", "로비 표어: '맞는 사람을, 더 빨리'", "문하준: 르방하우스 아르바이트 41점 불합격"]],
  },
  openingSignatures: {
    c40_start_warm: {
      label: "어젯밤 편집실에 모였던 사람들과 하준의 일을 나눠 맡는다",
      effect: { trust: 11, humanCost: -4, capital: -4, time: -4, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "어젯밤 편집실에 모였던 사람들과, 하준의 일을 나눠 맡는다.",
      echo: "나눠 맡으면 떡방 단체방이 밤새 울립니다. 서하린이 정정의 사진을 올리자 하준이 그제야 웃습니다.",
    },
    c40_start_record: {
      label: "보존 폴더 속 6분의 원본부터 핏스코어 자료로 다시 본다",
      effect: { legitimacy: 12, trust: -3, capital: -3, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "보존 폴더 속 6분의 원본부터, 핏스코어 자료로 다시 본다.",
      echo: "원본 속 인터뷰이는 핏스코어의 전 직원입니다. 방송에서 빠진 한마디가 남아 있습니다. '모델이 뭘 배웠는지 아무도 안 물어봤어요.'",
    },
    c40_start_rush: {
      label: "경비실 인터폰으로 대표에게 내일 면담을 요구한다",
      effect: { capital: 5, time: 4, trust: 4, legitimacy: -4, humanCost: 4, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "경비실 인터폰으로, 대표에게 내일 면담을 요구한다.",
      echo: "인터폰은 자정에도 대표에게 연결됩니다. 그는 잠결에도 또렷하게 '직접 시연을 보여 드리겠다'고 합니다.",
    },
  },
  voiceLines: {
    // CASE 40. A score that punishes the pause. Every line is spoken by someone
    // whose own pause is in the model, so none of them may sound certain.
    c40_start_visit: "숫자보다 사람이 먼저라며, 문하준과 함께 그 가게 점장부터 직접 찾아간다.",
    c40_start_claim: "탈락 통보에 적힌 점수의, 산정 근거부터 청구한다.",
    c40_start_post: "탈락 문자를 캡처해서, 오늘 밤 인터넷에 공개한다.",
    c40_demo_rehear: "문하준의 점수를, 사람 면접으로 다시 보게 해 달라고 한다.",
    c40_demo_source: "학습 데이터가 누구의 기록인지, 출처부터 따진다.",
    c40_demo_film: "강태민의 결과 화면을 찍어서, 여론전에 먼저 쓴다.",
    c40_branch_bakery_a: "점장과 함께, 탈락한 열한 명을 사람 면접으로 부른다.",
    c40_branch_bakery_b: "본사가 내려보낸 60점 지침 문서부터, 받아 둔다.",
    c40_branch_bakery_c: "점장 입장을 봐서, 문하준만 조용히 다시 봐 달라고 한다.",
    c40_branch_bakery_follow_a: "세 사람의 채용을 위해, 점장 추천서를 함께 쓴다.",
    c40_branch_bakery_follow_b: "입력 칸이 막힌 화면을 증거로 남겨서, 노동청 진정을 준비한다.",
    c40_branch_bakery_follow_c: "오늘 면접은 없던 일로 하고, 점장의 자리부터 지킨다.",
    c40_anchor_tell: "문하준에게, 내 기록 때문이라는 사실을 직접 먼저 말한다.",
    c40_anchor_claim: "정보 주체로서, 내 기록의 열람과 삭제를 공식 청구한다.",
    c40_anchor_hide: "내 기록이라는 사실은 숨기고, 조용히 증거로만 쓴다.",
    c40_steam_persuade: "마서윤에게, 서비스를 함께 멈추자고 사람으로서 설득한다.",
    c40_steam_audit: "외부 전문가의 모델 검증을, 합의서로 받아 낸다.",
    c40_steam_deal: "KD 기록만 빼는 조건으로, 서비스 존속을 눈감아 준다.",
    c40_final_list: "떨어진 9,412명을, 모두 사람 면접으로 다시 보게 한다.",
    c40_final_open: "알고리즘과 점수 비중을 전부 공개해야, 공채를 열게 한다.",
    c40_final_cut: "KD 기록 계약을 끊어서, 서비스를 오늘 밤 멈춘다.",
    c40_after_warm: "오늘은 떡방 셔터를 내릴 때까지, 하준의 첫 근무를 함께한다.",
    c40_after_record: "41점 모임 명단을, 청문회 자료로 문서화해 남긴다.",
    c40_after_rush: "차지원의 전화를 받은 채, 곧장 국회로 간다.",
    c40_route_system_publish: "이 통계를, 핏스코어를 쓰는 기업 138곳에 동시에 보낸다.",
    c40_route_system_reweight: "망설임 항목의 부호를 뒤집어서, 다시 점수를 매기자고 한다.",
    c40_route_system_drop: "통계는 덮고, 핏스코어와 조용히 협상한다.",
    c40_final_system_route_a: "망설임을 감점하지 않는 검사만, 채용에 쓰게 하는 기준을 만든다.",
    c40_final_system_route_b: "통계는 두고, 탈락자에게 위로금만 지급하게 한다.",
    c40_final_system_route_c: "탈락자가 사람 면접을 요구할 권리를, 이용 약관에 넣게 한다.",
    c40_evidence_turn_hand: "투자 계약서와 이름표 기록을, 청문회 자료로 차지원에게 넘긴다.",
    c40_evidence_turn_show: "계약서를 마서윤에게 먼저 보여 주고, 선택을 묻는다.",
    c40_evidence_turn_hold: "계약서는 알아 두고, 협상 막판의 카드로 쥔다.",
  },
  echoReplies: {
    // CASE 40.
    c40_start_visit: "찾아가면 점장은 반가워하면서도 계산대 모니터를 먼저 가립니다. 본사 지침이 그 화면에 있습니다.",
    c40_start_claim: "청구서는 핏스코어 고객센터로 갑니다. 자동 응답은 '점수 산정 방식은 영업비밀'이라고 답합니다.",
    c40_start_post: "캡처는 밤새 퍼집니다. 하준의 이름을 가렸지만 가게 이름은 가리지 않았고, 점장이 먼저 전화를 받습니다.",
    c40_demo_rehear: "마서윤은 한 명을 위한 예외는 공정하지 않다고 답합니다. 그 말을 믿고 있다는 게 목소리에서 들립니다.",
    c40_demo_source: "출처를 따지면 마서윤이 처음으로 계약서를 다시 엽니다. 제공처 칸 아래 작은 글씨를 그도 오늘 처음 읽습니다.",
    c40_demo_film: "영상은 웃깁니다. 조회 수가 오를수록 사람들은 강태민을 기억하고, 9,412명은 기억하지 않습니다.",
    c40_branch_bakery_a: "사람 면접을 부르면 하예솔은 본사 몰래 저녁 시간을 비워야 합니다. 그는 비우겠다고 합니다.",
    c40_branch_bakery_b: "지침 문서는 두 쪽입니다. 둘째 쪽 맨 아래에 '점장 재량 없음'이라고 굵게 적혀 있습니다.",
    c40_branch_bakery_c: "하준만 다시 보면 하준은 붙습니다. 윤다온의 이름은 모니터에서 다음 달 목록으로 밀려납니다.",
    c40_branch_bakery_follow_a: "추천서가 올라가면 본사는 세 사람 대신 점장을 부릅니다. 하예솔은 가방에 추천서 사본을 넣고 갑니다.",
    c40_branch_bakery_follow_b: "진정서가 접수되면 노동청은 '채용 절차의 공정성' 항목으로 조사를 엽니다. 결과는 가을이 끝나야 나옵니다.",
    c40_branch_bakery_follow_c: "면접이 없던 일이 되면 하예솔의 자리는 남습니다. 한미경 씨가 찾아낸 틀린 칸 두 개도 그대로 남습니다.",
    c40_anchor_tell: "말하면 하준이 한참 스케치북만 봅니다. 그러다 묻습니다. '그럼 저 멈춘 거, 잘한 거예요?'",
    c40_anchor_claim: "청구하면 당신은 처음으로 당신 기록의 주인으로 불립니다. 삭제되는 순간 하준을 떨어뜨린 기준점도 사라집니다.",
    c40_anchor_hide: "숨기면 증거는 깨끗합니다. 하준은 자기가 누구를 닮아서 떨어졌는지 모르는 채로 다음 지원서를 씁니다.",
    c40_steam_persuade: "설득하면 마서윤은 인절미를 끝까지 먹습니다. 대답은 금요일까지 미룹니다. 그는 직원 42명의 얼굴을 떠올리고 있습니다.",
    c40_steam_audit: "합의서는 단단합니다. 검증에는 석 달이 걸리고, KD 공채는 다음 주 월요일에 열립니다.",
    c40_steam_deal: "KD 기록을 빼도 모델은 이미 배웠습니다. 기록은 지워지고 배운 버릇은 남습니다.",
    c40_final_list: "다시 보게 하면 9,412명에게 면접 날짜가 생깁니다. 비용 4억은 누가 낼지 아직 빈칸이고, 월요일 공채는 한 주 밀립니다.",
    c40_final_open: "공개하면 누구나 가중치를 읽을 수 있습니다. 읽은 사람 중 일부는 검사를 통과하는 요령부터 팝니다.",
    c40_final_cut: "끊으면 오늘 밤 서비스가 멈춥니다. 9,412명의 재심사 길도 함께 멈추고, 직원 42명은 월요일에 출근할 곳이 없습니다.",
    c40_after_warm: "셔터가 내려갈 때 하준의 첫 시급이 봉투에 담깁니다. 문가을이 봉투에 '100점'이라고 적습니다. 국회는 월요일까지 기다립니다.",
    c40_after_record: "문서가 된 1,106명은 청문회 자료 목록에 한 줄로 들어갑니다. 차지원이 그 줄에 형광펜을 긋습니다.",
    c40_after_rush: "국회 의원회관에 도착하면 차지원이 떡 냄새를 알아챕니다. 가방에 문가을이 넣어 준 인절미가 있습니다.",
    c40_route_system_publish: "138곳 중 11곳이 답장을 보냅니다. 세 곳은 검사를 멈추고, 여덟 곳은 '내부 검토'라고만 씁니다.",
    c40_route_system_reweight: "부호를 뒤집으면 멈춘 사람이 올라갑니다. 대신 이번에는 빨리 답한 사람이 이유 없이 떨어집니다.",
    c40_route_system_drop: "조용한 협상은 빨리 끝납니다. 멈춘 사람 2,700명은 자기들이 왜 떨어졌는지 끝내 모릅니다.",
    c40_final_system_route_a: "기준이 생기면 멈춤은 감점이 아닙니다. 그 기준을 지키는지 볼 사람은 아직 정해지지 않았습니다.",
    c40_final_system_route_b: "위로금은 빨리 나갑니다. 받은 사람은 다음 지원에서 같은 검사를 다시 봅니다.",
    c40_final_system_route_c: "권리가 약관에 들어가면 누구든 사람을 만날 수 있습니다. 약관을 끝까지 읽는 사람이 먼저 만납니다.",
    c40_evidence_turn_hand: "자료가 넘어가면 차지원이 질문지를 다시 씁니다. 윤상혁의 서명이 청문회 화면에 뜰 차례를 기다립니다.",
    c40_evidence_turn_show: "보여 주면 마서윤의 얼굴에서 핏기가 빠집니다. 그는 40억에 조건이 붙어 있었다는 걸 오늘 처음 압니다. 서명한 사람은 그가 아니었습니다.",
    c40_evidence_turn_hold: "쥐고 있으면 협상에서 이깁니다. 이긴 협상의 조건에는 윤상혁의 이름이 들어가지 않습니다.",
  },
  characterProfiles: {
    마서윤: {
      role: "채용 평가 회사 핏스코어 대표 · 30대",
      stance: "믿음 · 공정 · 숫자",
      job: "면접관의 편견을 없애겠다고 반응 기록으로 사람을 채점한다. 악당이 아니라 자기 숫자를 믿는 사람이고, 그 숫자가 무엇으로 배웠는지는 묻지 않았다.",
      appearance: "굽 낮은 흰 운동화, 초침 화면을 켜 둔 스마트워치, 탈락 통보 문자 스물한 개를 모아 둔 휴대폰 사진첩.",
      thought: "면접관은 내 사투리를 채점했다. 숫자는 사투리를 모른다. 그러니 숫자가 사람보다 공정하다.",
      gesture: "마서윤은 대답하기 전에 스마트워치 초침을 한 바퀴 본다. 자기가 몇 초 망설였는지 재는 버릇이다.",
      voice: "빠르고 확신에 차서 말하다가, 부산 억양이 새어 나오면 멈칫하고 표준어로 고쳐 말한다.",
      line: "저는 면접에서 스물한 번 떨어졌어요. 숫자는 제 사투리를 몰라요.",
    },
    하예솔: {
      role: "베이커리 카페 르방하우스 망원점 점장 · 20대 후반",
      stance: "난처함 · 성실 · 재량",
      job: "본사가 정한 점수 아래로는 면접조차 부를 수 없는 가게에서, 마감 뒤 불을 반만 켜고 사람을 만난다.",
      appearance: "밀가루가 묻은 검은 앞치마, 귀에 꽂은 볼펜, 계산대 옆에 붙인 문하준의 칠판 메뉴 사진.",
      thought: "나도 72점으로 들어왔다. 그 점수가 내가 좋은 점장이라는 뜻은 아니었다.",
      gesture: "하예솔은 곤란한 말을 하기 전에 앞치마 끈을 풀었다가 다시 묶는다.",
      voice: "상냥하게 말하다가, 본사 이야기가 나오면 존댓말이 딱딱해진다.",
      line: "셋 다 뽑고 싶어요. 근데 시스템에 칸이 안 열려요.",
    },
  },
  setting: { place: "망원시장 가을떡방", clock: "방송 다음 날 금요일 · 폭염 경보 14시" },
  sceneContext: {
    c40_start: {
      place: "망원시장 가을떡방",
      clock: "방송 다음 날 금요일 · 폭염 경보 14시",
      question: "고3 문하준이 면접도 없이 41점을 받고 떨어졌습니다. 무엇부터 하겠습니까?",
      lead: "다큐멘터리가 나간 다음 날, 폭염 경보가 사흘째인 금요일 오후, 가을떡방 선풍기 앞에서 문하준이 휴대폰을 내밉니다.",
    },
    c40_start_warm: {
      place: "망원시장 가을떡방",
      clock: "방송 다음 날 금요일 · 폭염 경보 15시",
      question: "편집실 곁에 남느라 미뤄 둔 41점 문자가 떡방에서 기다립니다. 누구와 함께 이 일을 시작하겠습니까?",
      lead: "편집실에서 밤을 보낸 사람들이 하나둘 떡방으로 돌아와 앞치마를 두릅니다.",
    },
    c40_start_record: {
      place: "판교 KD데이터랩 · 기록실",
      clock: "방송 다음 날 금요일 · 폭염 경보 11시",
      question: "지켜 낸 6분 속 회사가 같은 밤 하준을 떨어뜨렸습니다. 그 원본을 어떻게 쓰겠습니까?",
      lead: "보존 문서로 묶은 폴더를 이민서가 KD데이터랩 기록실 단말에서 다시 엽니다.",
    },
    c40_start_rush: {
      place: "성수동 핏스코어 · 로비",
      clock: "방송 다음 날 · 열대야 00:10",
      question: "자정의 유리문 앞에서 하준이 자기가 느려서 떨어졌냐고 묻습니다. 무엇부터 하겠습니까?",
      lead: "방송 엔딩 크레디트를 뒤로하고 택시를 탄 지 40분, 성수동 골목 끝 사옥은 비상등만 켜져 있습니다.",
    },
    c40_demo: {
      place: "성수동 핏스코어 · 시연 회의실",
      clock: "8월 셋째 주 월요일 · 폭염 11시",
      question: "대표가 스물한 번의 면접 탈락으로 만든 공정함을 보여 줍니다. 그 점수를 어떻게 다루겠습니까?",
      lead: "르방하우스 본사는 점수 이야기라면 핏스코어에 물으라고 했고, 핏스코어 대표가 직접 시연을 보여 주겠다며 성수동으로 불렀습니다.",
    },
    c40_branch_bakery: {
      place: "르방하우스 망원점 · 카페 계산대",
      clock: "8월 셋째 주 월요일 · 15시",
      question: "점장도 본사 점수에 묶여 열한 명을 면접조차 못 부릅니다. 이 가게에서 무엇을 하겠습니까?",
    },
    c40_branch_bakery_follow: {
      place: "르방하우스 망원점 · 마감 뒤 카페",
      clock: "8월 셋째 주 월요일 · 21시",
      question: "사람 면접으로 본 세 명이 모두 좋은데 시스템에 칸이 열리지 않습니다. 어떻게 하겠습니까?",
    },
    c40_weight: {
      place: "판교 KD데이터랩 · 서버실",
      clock: "8월 셋째 주 월요일 · 23:00",
      question: "가장 무거운 감점 항목이 망설임 시간입니다. 이 설정 파일을 어떻게 하겠습니까?",
    },
    c40_weight_reaction: {
      place: "판교 KD데이터랩 · 서버실 단말",
      clock: "8월 셋째 주 화요일 · 00:40",
      question: "적합과 부적합 이름표를 그룹전략실이 붙였습니다. 이 이름표를 어떻게 다루겠습니까?",
    },
    c40_anchor: {
      place: "판교 KD데이터랩 · 데이터센터",
      clock: "8월 셋째 주 화요일 · 02:10",
      question: "하준을 떨어뜨린 기준점이 당신의 기록이었습니다. 이 사실을 어떻게 하겠습니까?",
      lead: "새벽 2시, 류세아가 모델이 낮은 점수를 줄 때 기준으로 삼는 기록 하나를 찾았다며 당신을 데이터센터 안쪽으로 부릅니다.",
    },
    c40_list: {
      place: "회기동 헌책방 1층 · 책장 앞",
      clock: "8월 셋째 주 화요일 · 열대야 22시",
      question: "밤새 1,106명이 자기도 멈춰서 떨어졌다고 답했습니다. 이 명단을 어떻게 모으겠습니까?",
    },
    c40_list_reaction: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "8월 셋째 주 화요일 · 열대야 23:30",
      question: "사람을 떨어뜨리는 값이 만나는 값의 4분의 1입니다. 이 계산서를 어디에 쓰겠습니까?",
    },
    c40_steam: {
      place: "망원시장 가을떡방",
      clock: "8월 셋째 주 수요일 · 폭염 19시",
      question: "핏스코어 대표가 자기 검사에서 44점을 받고 떨어졌습니다. 그 앞에서 무엇을 청하겠습니까?",
      lead: "문가을이 핏스코어에 직접 전화를 걸어 '와서 설명하라'고 했고, 놀랍게도 마서윤이 혼자 떡방 문을 엽니다.",
    },
    c40_notice: {
      place: "여의도 브릿지은행 · 로비",
      clock: "8월 셋째 주 목요일 · 08시",
      question: "KD금융그룹이 다음 주 공채 420명을 이 검사로 거릅니다. 공고가 뜬 오늘 무엇부터 하겠습니까?",
    },
    c40_notice_reaction: {
      place: "여의도 한강공원 · 벤치 옆 주차장",
      clock: "8월 셋째 주 목요일 · 열대야 23:20",
      question: "한서윤의 반려 기록이 모델의 모범 답안이었습니다. 그 전화 앞에서 어떻게 하겠습니까?",
    },
    c40_route_system: {
      place: "판교 KD데이터랩 · 서버실 단말",
      clock: "8월 셋째 주 화요일 · 01:30",
      question: "망설임 상위 10%에 부당한 지시를 거절한 사람이 3.4배 몰려 있습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c40_final_system_route: {
      place: "판교 KD데이터랩 · 서버실 단말",
      clock: "8월 셋째 주 금요일 · 새벽",
      question: "채용 검사가 무엇을 셀 수 있는지 정할 수 있다면, 무엇을 금지하겠습니까?",
    },
    c40_evidence_turn: {
      place: "KD캐피탈 · 기록실",
      clock: "8월 셋째 주 금요일 · 07시",
      question: "기록을 판 돈이 투자금이 되어 같은 그룹 공채로 돌아왔습니다. 이 계약서를 어떻게 쓰겠습니까?",
    },
    c40_final: {
      place: "성수동 핏스코어 · 이사회 회의실",
      clock: "8월 셋째 주 금요일 · 17시 30분",
      question: "월요일 공채 전에 9,412명과 직원 42명 사이에서 하나를 골라야 합니다. 무엇에 서명하겠습니까?",
      lead: "금요일 오후, 마서윤이 투자사 화상회의를 30분 앞두고 당신과 류세아를 이사회 회의실로 부릅니다.",
    },
    c40_aftershock: {
      place: "망원시장 가을떡방 · 가게 앞",
      clock: "8월 셋째 주 토요일 · 폭염 18시",
      question: "떡방 아르바이트 첫날 저녁, 청문회 질문 기회 하나가 당신에게 옵니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c40-fit-anchor",
    title: "부적합의 기준점",
    text: "핏스코어 모델의 부적합 기준은 분석관 A, 곧 당신의 3년 치 반응 기록이었고, 적합 기준은 그 반대 의견서를 11분 만에 반려한 한서윤의 기록이었습니다. 이름표는 그룹전략실이 붙였고, 핏스코어에는 KD캐피탈의 40억이 들어가 있었습니다.",
  },
  outcomes: {
    c40_after_warm: { tag: "곁에 남은 결말", title: "셔터가 내려갈 때까지 하준의 첫 근무를 함께했다", text: "시험 없이 뽑힌 아르바이트생의 첫날, 떡방 사람들이 모두 앞치마를 둘렀습니다. 첫 시급 봉투에는 문가을의 글씨로 '100점'이 적혔습니다." },
    c40_after_record: { tag: "명단을 남긴 결말", title: "1,106명의 멈춤이 청문회 자료가 됐다", text: "41점 모임의 명단과 사연이 동의서와 함께 문서로 묶였습니다. 멈춰서 떨어진 사람들이 처음으로 한 줄씩 이름을 가졌습니다." },
    c40_after_rush: { tag: "먼저 달려간 결말", title: "인절미를 가방에 넣은 채 국회로 갔다", text: "당신은 떡방의 첫 근무를 두고 의원회관으로 향했습니다. 차지원은 질문지보다 먼저 떡 냄새를 알아챘습니다." },
  },
  carryovers: {
    c40_after_warm: { trust: 9, humanCost: -5, fatigue: -6 },
    c40_after_record: { legitimacy: 13, trust: 2, fatigue: 5 },
    c40_after_rush: { capital: 7, legitimacy: 5, trust: -8 },
  },
  continuityChallenges: {
    c39_after_warm: { id: "protect-trust", title: "편집실의 밤을 같이 보낸 사람들과 같이 가기", text: "편집실 불을 끌 때까지 곁에 있던 사람들이 떡방으로 돌아왔습니다. 41점을 받은 아이 앞에 혼자가 아니라 그 사람들과 함께 서는 선택을 찾아야 보너스가 열립니다." },
    c39_after_record: { id: "use-reframe", title: "지켜 낸 6분을 다시 쓰기", text: "보존 문서로 묶은 20분 가운데 6분이 핏스코어 이야기였습니다. 방송을 위해 지킨 기록이 한 아이의 41점을 위해 무엇이 될 수 있는지 판을 다시 짜야 합니다." },
    c39_after_rush: { id: "repair-legitimacy", title: "자정의 유리문 앞 공정함 회복하기", text: "41점 문자 하나만 들고 달려간 사옥은 불이 꺼져 있었고, 하준은 떡방 사람들 대신 당신 옆에 서 있습니다. 서두른 걸음을 절차로 되돌리는 선택을 찾아야 합니다." },
  },
};
