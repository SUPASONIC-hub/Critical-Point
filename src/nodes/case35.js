/**
 * CASE 35 -- the monsoon, and the machine that learned to refuse the drowned.
 *
 * Mid-July, the middle of 6막 「조사」. The group is under inspection and under
 * search warrants, and the analyst sits in KD캐피탈's risk department, where a
 * wall screen maps the group's exposure to weather. One night of rain -- 110mm
 * an hour -- puts two places the season loves under water at once: 망원시장,
 * where 문가을's rice-cake shop sits in the lowest alley, and 끝까지정밀, the
 * cooperative the old 가온정밀 technicians reopened in 남동공단, whose six lathes
 * have turned for less than a year.
 *
 * The case is the season's plainest test of the game's claim that feeling
 * steers intelligence. Everyone carries sandbags; the comedy is 권도현 in the
 * only boots left at the market hardware store (pink, floral, 240mm, "이 장화는
 * 흑자입니다"). The grief is technicians wiping mud off a machine their dead boss
 * bought while an insurance adjuster asks them not to touch it until her survey
 * is done, and a line in 문성호's handwriting under the mud: "끝까지 돌 것". The
 * anger is 노아 again: the emergency flood loans the bank created for exactly
 * this week are refused because the applicants were flooded. 노아 learned the
 * weight from 2020, when flooded businesses closed -- because every bank then
 * refused them. The evidence turn finds who asked for that weight: the
 * analyst's own department, a week before the analyst arrived, with the
 * approval line left blank.
 *
 * The case closes on the market steaming rice cakes for everyone who bailed
 * water, and on a text from the chairman's office inviting the analyst to
 * dinner in 한남동 -- which is 사건 36.
 */
export const case35Nodes = {
  c35_start: {
    phase: "CASE 35 BRIEFING",
    title: "시간당 110mm",
    speaker: "도윤하",
    text:
      "7월 14일 화요일 밤 11시 40분, 주말부터 이어진 장맛비가 시간당 110mm로 굵어집니다. KD캐피탈 위험관리부 상황판에서 서울 서부와 인천 남동부가 붉게 번집니다. 휴대폰이 연달아 울립니다. 먼저 도윤하입니다. '망원시장 골목에 물이 발목까지 찼대요. 문가을 사장님이 떡 기계 전원부터 뽑고 계세요.' 이어서 인천 끝까지정밀의 김 반장이 사진 한 장을 보냅니다. 강태민과 뚫어 둔 배수구가 다시 막혀, 셔터 밑으로 흙탕물이 혀처럼 밀려드는 사진입니다. 선반 여섯 대가 다시 돌기 시작한 지 1년이 안 됐습니다. 도윤하가 말을 잇습니다. '지점 문자함에 벌써 내일 아침 수해 긴급 대출 문의가 쌓여요. 그런데 그 대출, 이제 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 봐요.' 창밖 빗소리가 상황판의 경보음을 덮습니다.",
    memo: [
      "주말부터 나흘째 장맛비 -- 오늘 밤 시간당 110mm",
      "망원시장 저지대 골목 침수 시작, 가을떡방 포함",
      "끝까지정밀 공장 셔터 밑 침수 -- 선반 6대",
      "수해 긴급 대출 심사: AI 심사 엔진 노아",
    ],
    triggers: ["protection", "affection", "fear"],
    choices: [
      {
        id: "c35_start_go",
        label: "모래주머니를 싣고 곧장 망원시장으로 간다",
        effect: { trust: 11, humanCost: -5, time: -5, capital: -3, fatigue: 6 },
        next: "c35_sandbag",
        cognition: { persistence: 2 },
      },
      {
        id: "c35_start_photo",
        label: "피해 시각과 사진부터 남기라고 상인들에게 알린다",
        effect: { legitimacy: 11, time: -4, trust: -3, humanCost: 3, fatigue: 2 },
        next: "c35_sandbag",
        cognition: { inference: 2 },
      },
      {
        id: "c35_start_file",
        label: "긴급 대출 신청서를 밤사이 한꺼번에 넣어 둔다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: 2, humanCost: 3, fatigue: 1 },
        next: "c35_sandbag",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c35_sandbag",
      },
    ],
  },
  c35_sandbag: {
    phase: "THE MARKET",
    title: "분홍 꽃장화",
    speaker: "민도현",
    text:
      "새벽 1시 30분, 망원시장. 아케이드 지붕을 때리는 빗소리에 말소리가 묻힙니다. 상인회 총무 민도현이 휴대폰 라이브 방송을 켠 채 외칩니다. '모래주머니 300개 왔습니다! 손 있는 분은 떡방 골목으로요!' 강태민이 두 개씩 어깨에 메고 뛰고, 퇴근길에 달려온 권도현은 시장 철물점에 남은 마지막 장화를 신었습니다. 분홍 꽃무늬, 240mm입니다. 그가 발가락을 접은 채 계산기를 꺼냅니다. '장화 1만 2천 원, 젖을 뻔한 구두 38만 원. 이 장화는 흑자입니다.' 웃음이 번지는 것도 잠깐, 민도현이 젖은 시장 지도를 폅니다. 300개로는 한 곳만 막을 수 있습니다. 어르신 가게가 몰린 가장 낮은 골목, 시장 전체 냉장고의 전기가 모인 지하 전기실, 큰길 쪽 가게 스무 곳이 늘어선 입구. 물은 10분에 한 뼘씩 오릅니다.",
    memo: [
      "모래주머니 300개 -- 한 구역만 막을 수 있음",
      "가장 낮은 골목: 어르신 가게 11곳, 가을떡방 포함",
      "지하 전기실: 시장 전체 냉장·냉동 전원",
      "입구: 큰길 쪽 가게 20곳",
    ],
    triggers: ["protection", "choice", "helplessness"],
    choices: [
      {
        id: "c35_sandbag_alley",
        label: "어르신 가게가 몰린 가장 낮은 골목부터 막는다",
        effect: { trust: 12, humanCost: -6, capital: -4, time: -4, legitimacy: -2, fatigue: 6 },
        next: "c35_lathe",
        cognition: { persistence: 2 },
      },
      {
        id: "c35_sandbag_power",
        label: "구청 재난 매뉴얼대로 지하 전기실부터 막는다",
        effect: { legitimacy: 10, humanCost: -2, trust: -3, time: -4, fatigue: 4 },
        next: "c35_lathe",
        cognition: { inference: 2 },
      },
      {
        id: "c35_sandbag_gate",
        label: "입구에 한꺼번에 쌓아 큰길 쪽 가게 스무 곳을 지킨다",
        effect: { time: 5, capital: 6, trust: -3, humanCost: 5, fatigue: -3 },
        next: "c35_lathe",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c35_lathe",
      },
    ],
  },
  c35_lathe: {
    phase: "THE FACTORY",
    title: "손대지 마세요",
    speaker: "서하윤",
    text:
      "7월 15일 오후 2시, 인천 남동공단 끝까지정밀. 물은 빠졌지만 바닥에 한 뼘 두께의 뻘이 남았습니다. 선반 여섯 대가 허리 높이에 흙탕물 자국을 두르고 서 있습니다. 김 반장이 걸레로 첫 번째 선반의 핸들을 닦다가 손을 멈춥니다. '이게 문 사장님이 처음 산 기계예요. 공장 문 닫을 때도 안 팔고 버틴 놈인데.' 기술자 넷이 말없이 걸레를 적십니다. 그때 그룹 보험사 KD손해보험의 손해사정사(보험 사고의 손해를 조사해 보험금을 정하는 사람) 서하윤이 장화를 신고 들어섭니다. 태블릿을 든 그의 첫마디는 이렇습니다. '조사가 끝날 때까지 기계에 손대지 말아 주세요. 닦은 기계는 피해를 입증하기 어려워요.' 김 반장이 걸레를 쥔 채 돌아봅니다. 젖은 쇠는 48시간이면 녹이 슬고, 조사는 사흘 뒤에 끝납니다. 세온메디칼 납품까지는 아흐레입니다.",
    memo: [
      "선반 6대 침수 -- 허리 높이 흙탕물 자국",
      "녹 발생까지 약 48시간, 손해 조사 완료까지 3일",
      "KD손해보험: 조사 전 세척 시 피해 입증 어려움",
      "세온메디칼 부품 납품 D-9",
    ],
    triggers: ["affection", "order", "helplessness"],
    choices: [
      {
        id: "c35_lathe_wipe",
        label: "기술자들과 지금 기계를 닦아 녹부터 막는다",
        effect: { trust: 12, humanCost: -5, legitimacy: -4, capital: -3, fatigue: 6 },
        next: "c35_noah",
        cognition: { persistence: 2 },
      },
      {
        id: "c35_lathe_wait",
        label: "조사가 끝날 때까지 기계에 손대지 않게 한다",
        effect: { legitimacy: 11, capital: 4, trust: -4, humanCost: 3, time: -3, fatigue: 2 },
        next: "c35_noah",
        cognition: { inference: 2 },
      },
      {
        id: "c35_lathe_order",
        label: "협력 공장에 주문을 넘겨 납품 날짜부터 지킨다",
        effect: { capital: 8, time: 5, trust: -3, humanCost: 3, fatigue: -3 },
        next: "c35_noah",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c35_noah",
      },
    ],
  },
  c35_noah: {
    phase: "THE COUNTER",
    title: "잠겼으니까 안 됩니다",
    speaker: "탁예린",
    text:
      "7월 16일 오전 10시, KD은행 강서지점 창구. 번호표가 140번을 넘었습니다. 젖은 운동화를 신은 망원시장 상인들이 수해 긴급 대출 신청서를 들고 줄을 섰습니다. 기업대출 창구의 탁예린이 모니터를 당신 쪽으로 돌립니다. AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 어제부터 받은 수해 긴급 대출 41건 중 38건을 거절했습니다. 전국 지점을 합치면 사흘 새 312건입니다. 사유는 한 줄입니다. '침수 피해 사업장, 상환(빌린 돈을 갚는 것) 능력 급락 예상.' 끝까지정밀도, 가을떡방도 그 38건 안에 있습니다. 탁예린이 목소리를 낮춥니다. '물에 잠긴 사람을 도우라고 만든 대출이, 물에 잠겼다는 이유로 거절돼요.' 옆 창구에서 거절 안내문을 읽던 도윤하가 두 번째 줄에서 멈춥니다. 사람이 결과를 뒤집는 예외 승인(기준 밖이지만 책임자가 이름을 걸고 승인하는 것) 서명란은 이번에도 비어 있습니다.",
    memo: [
      "강서지점 수해 긴급 대출 41건 중 38건 거절 -- 전국 312건",
      "거절 사유: '침수 피해 사업장, 상환 능력 급락 예상'",
      "끝까지정밀·가을떡방 모두 거절 명단에",
      "예외 승인 서명란: 비어 있음",
    ],
    triggers: ["injustice", "system", "responsibility"],
    choices: [
      {
        id: "c35_noah_sign",
        label: "탁예린의 예외 승인 서명 옆에 내 이름을 나란히 올린다",
        effect: { trust: 12, humanCost: -6, legitimacy: -3, capital: -4, time: -3, fatigue: 5 },
        next: "c35_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c35_noah_object",
        label: "노아의 수해 거절 기준에 정식으로 이의를 제기한다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 2, fatigue: 5 },
        next: "c35_final",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c35_noah_route",
        label: "정부 재해 지원 자금 창구로 상인들을 바로 안내한다",
        effect: { capital: 9, time: 5, trust: 1, legitimacy: -3, humanCost: 3, fatigue: -3 },
        next: "c35_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c35_final",
      },
    ],
  },
  c35_final: {
    phase: "FINAL DECISION",
    title: "잠긴 사진의 쓸모",
    speaker: "민도현",
    text:
      "7월 18일 토요일 오전 10시, 빗줄기가 가늘어진 망원시장 상인회 사무실. 벽에 물 자국이 허리 높이로 남았고 선풍기 세 대가 젖은 장부를 말립니다. KD은행 본점 심사부 탁지훈 부장이 서류 세 가지를 내려놓습니다. 첫째, 노아가 거절한 38건을 사람이 다시 보는 특별 창구. 심사역이 모자라 3주가 걸립니다. 둘째, 노아의 재해 기준을 금융감독원에 정식으로 따지는 민원. 전국 기준이 바뀔 수 있지만 몇 달이 걸립니다. 셋째, 상인들이 피해 사진과 보험 조사 기록을 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓰는 자료)로 넘긴다는 동의서. 서명하면 노아를 다시 학습시켜 사흘 안에 대출이 나갑니다. 민도현이 동의서를 넘기다 묻습니다. '우리가 물에 잠긴 사진으로, 다음에 잠길 사람을 거절하는 법을 가르치는 거예요?' 문가을은 대답 대신 창밖을 봅니다. 세온메디칼 납품까지 닷새입니다.",
    memo: [
      "특별 창구: 38건 사람 재심사 -- 3주",
      "금융감독원 민원: 전국 재해 대출 기준 -- 수개월",
      "학습 데이터 동의서: 서명 시 사흘 안에 대출",
      "이 선택은 사건 36의 한남동 식탁으로 이어짐",
    ],
    triggers: ["choice", "injustice", "protection"],
    choices: [
      {
        id: "c35_final_desk",
        label: "사람 심사 특별 창구에 직접 앉아 오늘부터 한 건씩 본다",
        effect: { trust: 13, humanCost: -6, capital: -4, time: -6, legitimacy: 2, fatigue: 7 },
        next: "case35_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c35_final_appeal",
        label: "노아의 재해 기준을 금융감독원에 정식으로 문제 삼는다",
        effect: { legitimacy: 13, trust: 4, time: -5, humanCost: 3, fatigue: 5 },
        next: "case35_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c35_final_consent",
        label: "사진을 넘기는 동의서를 받고 사흘 만에 대출을 풀게 한다",
        effect: { capital: 10, time: 6, trust: -4, legitimacy: -5, humanCost: 4, fatigue: -3 },
        next: "case35_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case35_result",
      },
    ],
  },
};

/**
 * Everything else case 35 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case35 = {
  id: "case35",
  nodes: case35Nodes,
  aftermath: {
    c35_aftershock: {
      phase: "AFTERMATH",
      title: "비 갠 날의 떡",
      speaker: "문가을",
      text: "7월 19일 일요일 오후, 비가 그치고 여드레 만에 해가 납니다. 가을떡방 앞에 상인들이 말린 시루와 빌려 온 찜기를 늘어놓습니다. 물에 잠겼다 살아난 떡 기계가 첫 김을 뿜자 골목에서 박수가 터집니다. 하 할머니가 방앗간에서 짜 온 참기름을 인절미에 두르고, 민도현은 라이브 방송 제목을 '망원시장 영업 재개'로 바꿉니다. 권도현의 분홍 꽃장화는 떡방 간판 옆에 못으로 걸렸고, 할머니들은 이제 그를 '꽃장화 총각'이라고 부릅니다. 문가을이 김이 오르는 떡 한 판을 당신 앞에 내려놓습니다. '물 퍼 준 사람들 몫이에요. 은행 사람 몫 아니고요.' 골목 끝에는 아직 못 치운 모래주머니가 산처럼 쌓여 있습니다. 그때 탁예린의 문자가 옵니다. '본점에서 들었는데요, 회장님이 민도현 씨 라이브 영상을 비서실에서 틀어 놓고 보셨대요. 선배 얼굴 나오는 대목에서 멈추셨고요.'",
      memo: ["비 그친 첫날 -- 떡 기계 재가동", "시장 상인 공동 떡 나눔, 봉사자 전원", "권도현의 꽃장화: 떡방 간판 옆에 걸림", "탁예린: 회장이 시장 라이브 영상을 비서실에서 봄"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c35_after_warm", label: "마지막 모래주머니를 치울 때까지 시장 사람들 곁에 남는다", effect: { trust: 13, humanCost: -5, time: -3, capital: -3, fatigue: -7 }, next: "case35_result", cognition: { reframing: 2 } },
        { id: "c35_after_record", label: "노아가 거절한 수해 대출 312건을 문서로 정리해 준법감시팀에 낸다", effect: { legitimacy: 14, trust: 2, time: -5, capital: -3, fatigue: 4 }, next: "case35_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c35_after_rush", label: "비가 그치자마자 거절 기록을 들고 곧장 검찰청으로 간다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 5 }, next: "case35_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c35_final", "c35_aftershock"],
  connectiveScenes: [
    ["c35_elder", "c35_sandbag", "c35_lathe", "영감이 사 준 기계", "민도현", "새벽 3시, 물이 정강이까지 찬 가장 안쪽 골목. 43년째 참기름을 짜 온 하씨방앗간의 하 할머니가 셔터를 반만 내린 채 가게 안에 버티고 있습니다. 압착기가 잠기면 끝이라며 기계 위에 올라앉았습니다. 민도현이 라이브 방송을 끄고 물속에 무릎을 꿇습니다. '할머니, 기계는 또 사면 돼요.' 할머니가 웃습니다. '이거 영감이 사 준 거야. 또 사는 거 아니야.' 구청 대피 안내 문자가 세 번째로 옵니다. 강태민이 셔터 밑으로 몸을 밀어 넣으며 당신을 돌아봅니다.", ["하씨방앗간 43년 -- 압착기 위에 앉은 하 할머니", "구청 대피 안내 문자 3회", "골목 수위: 정강이, 10분에 한 뼘씩 상승"], ["할머니를 설득해 업고 골목을 빠져나온다", "119를 불러 대피 절차대로 할머니를 모신다", "압착기 둘레에 모래주머니를 쌓고 할머니 곁을 지킨다"]],
    ["c35_rust", "c35_lathe", "c35_noah", "끝까지 돌 것", "문하준", "밤 10시, 공장에 발전기 소리만 남았습니다. 기말고사를 막 끝낸 고3 문하준이 교복 바지를 걷어붙이고 방청유(쇠가 녹슬지 않게 바르는 기름) 통을 듭니다. 세 번째 선반 옆면의 흙을 걷어 내자 네임펜 글씨가 나옵니다. '끝까지 돌 것 -- 문성호.' 하준이 한참 그 글씨를 봅니다. '아빠가 기계한테도 이 말을 했네요.' 김 반장이 등을 돌리고 코를 풉니다. 하준이 휴대폰으로 사진을 찍다 말고 묻습니다. '이거 지우면 안 되죠? 근데 조사하는 분은 원래 모습 그대로 두래요.'", ["세 번째 선반 옆면: 문성호의 네임펜 글씨", "문하준, 기말고사 끝난 날 공장으로 직행", "녹 방지 작업 가능 시간 남은 약 20시간"], ["글씨가 있는 옆판은 떼어 따로 두고 기계를 닦는다", "글씨까지 그대로 손해 조사 기록에 남겨 둔다", "글씨는 사진만 찍고 오늘 밤 기계를 모두 닦는다"]],
    ["c35_weight", "c35_noah", "c35_final", "0.41", "류세아", "오후 3시, 판교 KD데이터랩과 영상 통화가 연결됩니다. 류세아가 라벨 프린터를 목에 건 채 노아의 판단 기록을 띄웁니다. '재해 노출' 가중치(판단에서 어떤 항목을 얼마나 무겁게 볼지 정한 값)가 0.41입니다. 나머지 항목을 다 합친 것보다 큽니다. 노아는 2020년 여름 수해를 입은 사업자들의 기록으로 이 값을 배웠습니다. 그해 수해 사업자의 31%가 1년 안에 문을 닫았습니다. 류세아가 기록 한 줄에 라벨을 붙입니다. '그런데 그분들이 문을 닫은 이유가요, 그해 은행들이 추가 대출을 다 거절해서예요. 노아는 거절당한 사람들이 무너진 기록을 보고 거절하는 법을 배웠어요.'", ["'재해 노출' 가중치 0.41 -- 나머지 항목 합계보다 큼", "학습 출처: 2020년 여름 수해 사업자 기록", "그해 폐업 31% -- 대부분 추가 대출 거절 뒤"], ["거절된 38명에게 이 사실을 직접 설명하러 간다", "가중치 변경을 류세아와 공식 절차로 요청한다", "이번 주만 그 가중치를 꺼 달라고 류세아에게 부탁한다"]],
  ],
  connectiveOrder: [["c35_sandbag", "c35_elder"], ["c35_lathe", "c35_rust"], ["c35_noah", "c35_weight"]],
  choiceEffects: {
    c35_sandbag: [
      { trust: 10, humanCost: -5, time: -3, fatigue: 5 },
      { legitimacy: 9, trust: -2, time: -4, humanCost: 2, fatigue: 2 },
      { time: 4, capital: 3, trust: 3, humanCost: 4, fatigue: -3 },
    ],
    c35_lathe: [
      { trust: 9, humanCost: -5, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 8, trust: 3, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, humanCost: 3, fatigue: -4 },
    ],
    c35_noah: [
      { trust: 9, humanCost: -4, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -5, humanCost: 3, fatigue: 4 },
      { time: 4, capital: 5, trust: -3, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c35_sandbag: {
      voice: ["할머니를 설득해, 업고 골목을 빠져나오겠다고 한다.", "119를 불러, 대피 절차대로 할머니를 모시자고 한다.", "압착기 둘레에 모래주머니를 쌓고, 할머니 곁을 지킨다."],
      echo: ["업혀 나온 할머니는 골목 끝에서 뒤를 돌아봅니다. 셔터 안에서 압착기가 물에 잠기는 소리가 들립니다.", "구조대는 40분 뒤에 옵니다. 그동안 물은 네 뼘이 오르고, 할머니는 절차대로 들것에 실려 나옵니다.", "압착기는 살아남습니다. 할머니 곁에 남은 강태민은 새벽 5시까지 허리까지 찬 물속에 서 있습니다."],
    },
    c35_lathe: {
      voice: ["글씨가 있는 옆판은 떼어 따로 두고, 기계를 닦자고 한다.", "글씨까지 그대로, 손해 조사 기록에 남겨 두자고 한다.", "글씨는 사진만 찍고, 오늘 밤 기계를 모두 닦는다."],
      echo: ["떼어 낸 옆판은 하준의 책상 위로 갑니다. 조사 기록에는 '부품 일부 분리'라는 한 줄이 붙습니다.", "기록 사진 속 글씨는 조사 보고서 17쪽에 들어갑니다. 그 사이 두 번째 선반 축에 첫 녹이 핍니다.", "기계는 녹을 피합니다. 흙과 함께 지워진 글씨는 이제 하준의 휴대폰 사진첩에만 있습니다."],
    },
    c35_noah: {
      voice: ["거절된 38명에게, 이 사실을 직접 설명하러 간다.", "가중치 변경을, 류세아와 공식 절차로 요청한다.", "이번 주만 그 가중치를 꺼 달라고, 류세아에게 부탁한다."],
      echo: ["설명을 들은 상인들은 화를 냅니다. 기계에게가 아니라, 기계를 믿은 은행에게.", "요청서는 KD데이터랩 변경 심의에 올라갑니다. 다음 심의는 8월 첫 주입니다.", "류세아는 한참 말이 없다가 '그러면 저도 노아랑 똑같이 설명 못 하는 판단을 하는 거예요'라고 답합니다."],
    },
  },
  reactionScenes: [
    ["c35_elder_reaction", "c35_elder", "c35_lathe", "하룻밤의 점수", "이민서", "골목을 빠져나오자 이민서의 메시지가 와 있습니다. KD데이터랩 야간 모니터를 찍은 사진입니다. '폭우 시작 여섯 시간 만에 노아가 망원동과 남동공단 일대 사업자 신용 점수를 한꺼번에 낮췄어요. 사유는 재해 노출 지역. 아직 아무도 대출을 신청하지 않았는데, 거절할 준비부터 끝낸 거예요.' 사진 아래에 가을떡방 사업자 번호가 보입니다. 하룻밤 새 187점이 떨어졌습니다. 이민서가 한 줄을 더 보냅니다. '이거 제가 보면 안 되는 화면이에요. 그래도 보내요.'", ["상인들에게 이 사실을 지금 바로 알린다", "류세아에게 공식 문제 제기서를 보낸다", "나중을 위해 화면 사진만 받아 둔다"]],
    ["c35_rust_reaction", "c35_rust", "c35_noah", "자연재해라서", "서하윤", "자정 무렵, 서하윤이 공장 앞 차 안에서 당신을 부릅니다. 태블릿에 본사 공문이 떠 있습니다. '이번 호우 피해 가운데 영업 중단 특약(기본 보험에 따로 덧붙여 드는 약속)은 자연재해 면책(보험사가 보험금을 주지 않아도 되는 경우) 조항을 먼저 검토할 것.' 끝까지정밀이 봄에 따로 돈을 내고 든 게 바로 그 특약입니다. 서하윤이 핸들에 이마를 댑니다. '특약 이름이 「자연재해 영업 손실 보장」이에요. 자연재해라서 안 준다는 공문을, 제가 읽어 드려야 해요.'", ["공문을 문가을과 조합원들에게 그대로 보여 준다", "서하윤과 함께 공문의 근거 조항부터 따진다", "기계 보험금이라도 먼저 받게 공문은 덮어 둔다"]],
    ["c35_weight_reaction", "c35_weight", "c35_final", "도장 들고 튄 사람", "나준혁", "밤 9시, 강서지점 옥상 처마 밑. 영동의 나준혁이 전화를 겁니다. 뉴스에서 망원시장을 봤답니다. '나 신입 때 한강 둑이 넘친 여름이 있었어. 그때 지점장이 도장이랑 인주를 비닐에 싸서 대피소 체육관으로 갔지. 줄 선 사람들 신청서를 거기서 받았어. 심사는 얼굴 보고 했고.' 그가 웃습니다. '그 양반 별명이 \"도장 들고 튄 사람\"이었어. 본점이 발칵 뒤집혔거든.' 웃음이 잦아듭니다. '그때 빌려 간 사람 중에 못 갚은 사람이 두 명이었어. 두 명. 기계는 그 숫자를 몰라.'", ["대피소로 직접 가서 신청서를 받자고 제안한다", "그 여름의 대출 기록을 찾아 노아의 기준 옆에 놓는다", "옛날이야기는 접고 내일 창구 일정부터 정리한다"]],
  ],
  reactionEffects: {
    c35_elder: [
      { trust: 9, legitimacy: 3, humanCost: -3, time: -3, fatigue: 4 },
      { legitimacy: 10, time: -4, humanCost: 2, fatigue: 3 },
      { capital: 4, time: 3, trust: -4, humanCost: 3, fatigue: -2 },
    ],
    c35_rust: [
      { trust: 8, legitimacy: 4, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 11, trust: 1, time: -5, humanCost: 2, fatigue: 4 },
      { capital: 5, time: 4, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
    ],
    c35_weight: [
      { trust: 10, humanCost: -4, time: -4, fatigue: 3 },
      { legitimacy: 8, trust: 4, capital: -3, time: -3, fatigue: 3 },
      { capital: 4, time: 4, trust: 3, legitimacy: -4, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c35_elder: {
      voice: ["상인들에게, 이 사실을 지금 바로 알린다.", "류세아에게, 공식 문제 제기서를 보낸다.", "나중을 위해, 화면 사진만 받아 둔다."],
      echo: ["민도현이 라이브 방송에서 그 화면을 읽습니다. 시청자 4천 명이 동시에 은행 앱을 엽니다. 이민서의 접속 기록도 함께 남습니다.", "문제 제기서는 월요일 아침에 접수됩니다. 그 전에 신청하는 사람들은 이미 낮아진 점수로 심사를 받습니다.", "사진은 당신 휴대폰에 남습니다. 날이 밝으면 상인들은 아무것도 모른 채 창구에 줄을 섭니다."],
    },
    c35_rust: {
      voice: ["공문을, 문가을과 조합원들에게 그대로 보여 준다.", "서하윤과 함께, 공문의 근거 조항부터 따진다.", "기계 보험금이라도 먼저 받게, 공문은 덮어 둔다."],
      echo: ["공문을 본 문가을은 웃습니다. 너무 어이가 없으면 웃음이 난다고 합니다. 서하윤은 그 웃음을 오래 기억합니다.", "약관 12조와 공문을 나란히 놓자, 면책 조항에는 호우라는 말이 한 번도 없습니다. 따지는 데 사흘이 걸립니다.", "기계 보험금은 빨리 나옵니다. 공장이 멈춘 날들의 손실은 아무 서류에도 청구되지 않습니다."],
    },
    c35_weight: {
      voice: ["대피소로 직접 가서, 신청서를 받자고 제안한다.", "그 여름의 대출 기록을 찾아, 노아의 기준 옆에 놓는다.", "옛날이야기는 접고, 내일 창구 일정부터 정리한다."],
      echo: ["나준혁이 웃습니다. '도장은 내가 들고 갈게. 이번엔 튀지 말고 걸어가자고.'", "헌책방 종이 더미에서 그 여름의 장부가 나옵니다. 상환하지 못한 두 명의 이름 옆에 '재해 유예'라는 도장이 찍혀 있습니다.", "일정표는 깔끔해집니다. 나준혁은 전화를 끊기 전에 '그래, 요즘은 요즘 방식이 있지'라고 조금 늦게 말합니다."],
    },
  },
  reactionMemos: {
    c35_elder_reaction: ["신청하기도 전에 떨어진 점수", "보면 안 되는 화면"],
    c35_rust_reaction: ["자연재해를 보장하는 특약의 자연재해 면책", "읽어 드려야 하는 공문"],
    c35_weight_reaction: ["대피소 체육관의 도장", "못 갚은 사람 두 명"],
  },
  branchPlan: ["c35_sandbag", 1, "c35_branch_cellar", "c35_branch_cellar_follow"],
  branchScenes: {
    // CASE 35's side door is the cellar under the rice-cake shop. The case is
    // about what a flood takes; the detour asks what the shop and the lawsuit
    // each need saved first, while the stairs fill one step at a time.
    c35_branch_cellar: {
      phase: "SIDE DOOR",
      title: "지하 창고의 네 번째 계단",
      speaker: "문가을",
      text: "모래주머니를 나르던 중 문가을이 당신 팔을 잡아끕니다. 가을떡방 뒤편 지하 창고 계단에 물이 네 칸째 차올랐습니다. 창고에는 가을 대목에 쓸 찹쌀 마흔 포대와, 남편이 남긴 가온정밀의 장부 상자 여섯 개가 있습니다. 장부에는 플로우온에 납품하고 받지 못한 대금이 한 장씩 적혀 있습니다. 다음 달 첫 재판이 열릴 집단소송(피해자 여럿이 함께 내는 소송)의 증거입니다. 문가을이 계단 중간에서 멈춥니다. '둘 다는 못 올려요. 물이 무릎까지 오기 전에 한 번, 많으면 두 번이에요.' 위에서 문하준이 손전등을 비춥니다. 불빛 속에서 쌀 포대와 장부 상자가 나란히 젖어 갑니다.",
      memo: ["지하 창고 계단 침수 4칸째", "찹쌀 40포대 -- 가을 대목 원료", "가온정밀 장부 6상자 -- 집단소송 증거", "올릴 수 있는 횟수: 한두 번"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c35_branch_cellar_rice", label: "찹쌀 포대부터 올려 떡방의 가을을 지킨다", effect: { trust: 10, humanCost: -4, capital: -5, time: -2, fatigue: 5 }, next: "c35_branch_cellar_follow", cognition: { persistence: 2 } },
        { id: "c35_branch_cellar_books", label: "장부 상자부터 올려 소송의 증거를 지킨다", effect: { legitimacy: 11, trust: 4, time: -4, humanCost: 1, fatigue: 5 }, next: "c35_branch_cellar_follow", cognition: { inference: 2 } },
        { id: "c35_branch_cellar_leave", label: "창고는 보험에 맡기고 사람부터 올라가게 한다", effect: { capital: 5, time: 3, trust: -3, humanCost: 3, fatigue: -2 }, next: "c35_branch_cellar_follow", cognition: { risk: 1 } },
      ],
    },
    c35_branch_cellar_follow: {
      phase: "SIDE DOOR",
      title: "드라이어 스물두 대",
      speaker: "민도현",
      text: "새벽 4시, 상인회 사무실 2층. 민도현이 라이브 방송에 '젖은 종이 말릴 드라이어 구해요'라고 한 줄 썼더니, 20분 만에 시장 미용실 세 곳과 동네 주민들이 드라이어 스물두 대를 들고 올라왔습니다. 책상마다 젖은 장부가 펼쳐져 있고, 문하준이 한 장씩 뒤집으며 바람을 쏩니다. 그러다 한 장에서 멈춥니다. 여백에 남편의 글씨가 있습니다. '받을 돈 -- 끝까지 받을 것.' 문가을이 그 장을 오래 봅니다. '이 사람은 받을 돈 적는 데만 끝까지였어요. 달라는 말은 끝까지 못 했고요.' 드라이어 소리 사이로 민도현이 묻습니다. '이거 원본이 중요한 거예요, 적힌 게 중요한 거예요?'",
      memo: ["드라이어 22대 -- 미용실 3곳과 주민들", "장부 여백: '받을 돈 -- 끝까지 받을 것'", "젖은 종이 원본 보존 가능 시간 약 12시간", "다음 달 집단소송 첫 재판"],
      triggers: ["affection", "trust", "order"],
      choices: [
        { id: "c35_branch_cellar_follow_dry", label: "문가을 가족과 밤새 한 장씩 원본을 말린다", effect: { trust: 11, humanCost: -3, time: -5, fatigue: 5 }, next: "c35_elder", cognition: { persistence: 2 } },
        { id: "c35_branch_cellar_follow_scan", label: "모든 장을 촬영해 법원에 낼 사본부터 만든다", effect: { legitimacy: 10, trust: 3, time: -3, humanCost: 2, fatigue: 5 }, next: "c35_elder", cognition: { inference: 2 } },
        { id: "c35_branch_cellar_follow_hand", label: "복원 업체에 장부를 맡기고 골목으로 돌아간다", effect: { time: 5, capital: 4, legitimacy: -3, humanCost: 3, fatigue: -3 }, next: "c35_elder", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c35_start",
    result: "c35_aftershock",
    defaultFree: "c35_route_system",
    // One flood, one machine. Like the rest of the season the case is a single
    // line; the split is who is allowed to overrule the machine, and how fast.
    choices: {},
    system: {
      route: "c35_route_system",
      final: "c35_final_system_route",
      title: "한 바퀴 도는 이유",
      speaker: "류세아",
      text: "준비된 보기 밖의 문장을 쓰자 류세아가 열어 둔 노아의 시험 화면이 답합니다. '수해 긴급 대출을 왜 거절하는가.' 노아가 0.2초 만에 씁니다. '재해 지역 차주(돈을 빌린 사람)의 1년 안 연체(갚을 날을 넘기는 것) 비율이 평균의 4.2배이므로.' 다시 묻습니다. '그 차주들은 왜 연체했는가.' '운영 자금이 부족했으므로.' '운영 자금은 왜 부족했는가.' 노아가 처음으로 1.4초를 씁니다. '추가 대출이 거절되었으므로.' 류세아가 화면을 캡처합니다. '긴급 대출이 있어야 하는 이유를 노아는 거절 사유로 배웠어요. 원인과 결과가 한 바퀴 돌아서 서로를 증명해요.'",
      memo: ["노아 답변: 재해 지역 연체 비율 평균의 4.2배", "세 번째 질문에서 처음으로 1.4초 지연", "마지막 답: '추가 대출이 거절되었으므로'"],
      routeChoices: [
        ["c35_route_system_publish", "한 바퀴 도는 설명을 상인들과 언론에 그대로 공개한다", { legitimacy: 10, trust: 6, capital: -4, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c35_route_system_rule", "재해 대출은 반드시 사람 심사를 거치게 하는 규칙을 요구한다", { legitimacy: 8, trust: 3, capital: 3, time: -6, humanCost: 2, fatigue: 5 }, { reframing: 2 }],
        ["c35_route_system_drop", "캡처는 덮어 두고 거절 건을 하나씩 따로 푼다", { time: 7, capital: 6, trust: -5, legitimacy: -7, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "재해 대출 거절에는 원인을 거슬러 묻는 칸을 반드시 넣게 한다", { legitimacy: 12, trust: 7, capital: -6, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "노아의 결과는 두고 그룹 기부금으로 피해를 메운다", { capital: 9, time: 5, trust: -4, legitimacy: -6, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "장마가 끝날 때까지 수해 대출을 노아 심사에서 빼게 한다", { trust: 10, legitimacy: 6, capital: -6, time: -6, humanCost: 2, fatigue: 6 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c35_evidence_turn",
    result: "c35_aftershock",
    sourceRoutes: ["c35_sandbag", "c35_lathe", "c35_noah", "c35_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 노아의 판단 기록 옆에 놓고, 재해 가중치가 누구의 요청으로 들어왔는지 맞춰 본다.",
    entryEcho: "단서를 대면 가중치를 누가 넣었는지 보입니다. 그 이름이 당신과 얼마나 가까운지도 함께 보입니다.",
    title: "승인란이 빈 요청서",
    speaker: "이민서",
    text: "단서를 맞추자 노아에 '재해 노출' 가중치(판단에서 어떤 항목을 얼마나 무겁게 볼지 정한 값)를 넣어 달라는 요청서가 열립니다. 요청 부서는 KD캐피탈 위험관리부, 당신이 지금 앉아 있는 부서입니다. 요청일은 당신이 이 부서로 오기 한 주 전이고, 승인란은 비어 있습니다. 첨부 문서도 하나 있습니다. KD손해보험의 호우 피해 접수 명단을 여섯 시간마다 노아에 넘긴다는 데이터 공유 약정입니다. 이민서가 명단 첫 줄을 가리킵니다. '보험금을 청구한 사람이 대출에서 거절돼요. 피해를 신고한 순서대로요. 끝까지정밀은 새벽 2시 14분에 신고했고, 2시 20분에 점수가 떨어졌어요.'",
    memo: ["요청 부서: KD캐피탈 위험관리부 -- 승인란 빈칸", "요청일: 당신이 부서에 오기 한 주 전", "보험 피해 접수 명단 → 노아, 6시간마다 전송"],
    triggers: ["injustice", "system", "selfAwareness"],
    entryEffect: { legitimacy: 5, trust: 4, time: -4, fatigue: 4 },
    choices: [
      ["c35_evidence_turn_reveal", "내 부서의 이름이 적힌 요청서를 그대로 공개한다", { legitimacy: 13, trust: 5, capital: -6, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c35_evidence_turn_quiet", "요청서는 조용히 철회시키고 공개는 미룬다", { capital: 8, time: 5, trust: -5, legitimacy: -4, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c35_evidence_turn_share", "보험을 청구한 상인들에게 이 연결부터 알린다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c35_branch_cellar",
    systemNext: "c35_route_system",
    evidenceNext: "c35_evidence_turn",
    routeLabel: "직전 사건의 수첩처럼, 물에 젖기 전에 남길 종이부터 고른다",
    systemLabel: "직전 자유응답처럼 노아에게도 이유의 이유를 끝까지 묻는다",
    evidenceLabel: "직전 단서를 붙여 재해 가중치의 빈 승인란을 연다",
  },
  openingRoutes: {
    c34_after_warm: "c35_start_warm",
    c34_after_record: "c35_start_record",
    c34_after_rush: "c35_start_rush",
  },
  openingCopy: {
    c35_start_warm: ["복숭아 다음의 단체방", "도윤하", "윤서진이 가져온 복숭아 한 상자를 헌책방 1층에서 다 함께 비운 저녁 이후, 동료들은 매일 밤 단체방에 '오늘 무사함' 한 줄을 올렸습니다. 주말부터 비가 시작됐고, 나흘째인 오늘 밤 그 단체방이 쉬지 않고 울립니다. 시간당 110mm 폭우입니다. 망원시장 골목에 물이 발목까지 찼고, 인천 끝까지정밀 셔터 밑으로 흙탕물이 스밉니다. 도윤하가 전화를 겁니다. '내일 아침 수해 긴급 대출 문의가 쏟아질 거예요. 그런데 그 대출, 이제 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 봐요.' 단체방에 강태민의 한 줄이 올라옵니다. '모래주머니 차 있음.' 윤서진도 한 줄을 보탭니다. '복숭아 상자 빈 거, 모래 담을 때 쓰세요.'", ["단체방 '오늘 무사함' 닷새째 -- 오늘은 끊김", "망원시장·끝까지정밀 동시 침수", "강태민: 모래주머니 실은 트럭 확보, 윤서진도 단체방에"]],
    c35_start_record: ["경위서 두 쪽 다음", "이민서", "수첩이 어디서 어떻게 나왔는지 적은 경위서 두 쪽을 남긴 뒤 닷새, 당신은 매일 밤 위험관리부에 남아 그룹 문서의 보관 기록을 대조했습니다. 윤서진의 서명 옆 칸이 비지 않도록 당신 이름도 적었던 그 문서가 서랍에 있습니다. 오늘 밤 모니터 옆 상황판이 붉게 번집니다. 시간당 110mm 폭우, 망원시장과 인천 남동공단이 잠기고 있습니다. 이민서가 메시지를 보냅니다. '수해 긴급 대출도 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 봐요. 그런데 노아 판단 기록은 보관 기간이 72시간이에요. 거절 사유는 사흘 뒤에 사라져요.'", ["수첩 경위서 제출 후 닷새", "노아 판단 기록 보관 기간 72시간", "상황판: 서울 서부·인천 남동부 호우"]],
    c35_start_rush: ["먼저 온 사람의 셔터", "문가을", "비 소식에 모래주머니를 싣고 인천 끝까지정밀로 달려간 지 닷새, 당신은 퇴근마다 공장에 들러 강태민과 막힌 배수구를 뚫었습니다. 헌책방에 두고 온 깎다 만 복숭아는 그 뒤로 떠올릴 틈이 없었습니다. 오늘 밤 시간당 110mm 폭우가 쏟아지고, 모래주머니 너머로 흙탕물이 셔터 밑을 넘습니다. 물속에서 휴대폰을 꺼내 보니 부재중 전화가 일곱 통, 전부 문가을입니다. 다시 걸자 빗소리가 먼저 들립니다. '공장은 당신이 지킨다길래요. 가게 문턱을 물이 넘었어요.' 잠깐 말이 끊깁니다. '은행 사람 중에 전화할 데가 당신밖에 없어서요.' 내일부터 창구에서는 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 수해 대출을 봅니다.", ["문가을 부재중 전화 7통", "끝까지정밀 셔터 밑 침수 -- 모래주머니 한계", "가을떡방 문턱 침수, 수해 대출 심사: 노아"]],
  },
  openingSignatures: {
    c35_start_warm: {
      label: "강태민의 트럭에 단체방 사람들을 모아 함께 달려간다",
      effect: { trust: 10, humanCost: -4, capital: -2, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "강태민의 트럭에, 단체방 사람들을 모아 함께 달려간다.",
      echo: "트럭 짐칸에 여섯 명이 모래주머니와 함께 탑니다. 권도현은 우비 값을 나눠 내자고 하다가 강태민에게 우비를 한 벌 더 받습니다.",
    },
    c35_start_record: {
      label: "노아의 판단 기록 보관 기간부터 늘려 달라고 요청한다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -4, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "노아의 판단 기록 보관 기간부터, 늘려 달라고 요청한다.",
      echo: "요청은 새벽 1시에 접수됩니다. 거절 사유는 사라지지 않고, 그 대신 당신은 시장에 두 시간 늦게 도착합니다.",
    },
    c35_start_rush: {
      label: "공장은 김 반장에게 맡기고 문가을의 떡방으로 달려간다",
      effect: { trust: 9, legitimacy: 5, humanCost: 3, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "공장은 김 반장에게 맡기고, 문가을의 떡방으로 달려간다.",
      echo: "김 반장이 '공장은 우리가 봐요' 하고 등을 떠밉니다. 강태민이 혼자 셔터를 붙잡고, 문가을은 떡방에 들어선 당신에게 고맙다는 말 대신 앞치마를 던져 줍니다.",
    },
  },
  voiceLines: {
    // CASE 35. Every line is spoken with water at the ankles; none of them has
    // time to sound like a policy.
    c35_start_go: "모래주머니를 싣고, 곧장 망원시장으로 간다.",
    c35_start_photo: "피해 시각과 사진부터 남기라고, 상인들에게 알린다.",
    c35_start_file: "긴급 대출 신청서를, 밤사이 한꺼번에 넣어 둔다.",
    c35_sandbag_alley: "어르신 가게가 몰린, 가장 낮은 골목부터 막는다.",
    c35_sandbag_power: "구청 재난 매뉴얼대로, 지하 전기실부터 막는다.",
    c35_sandbag_gate: "입구에 한꺼번에 쌓아, 큰길 쪽 가게 스무 곳을 지킨다.",
    c35_branch_cellar_rice: "찹쌀 포대부터 올려, 떡방의 가을을 지킨다.",
    c35_branch_cellar_books: "장부 상자부터 올려, 소송의 증거를 지킨다.",
    c35_branch_cellar_leave: "창고는 보험에 맡기고, 사람부터 올라가게 한다.",
    c35_branch_cellar_follow_dry: "문가을 가족과 밤새, 한 장씩 원본을 말린다.",
    c35_branch_cellar_follow_scan: "모든 장을 촬영해, 법원에 낼 사본부터 만든다.",
    c35_branch_cellar_follow_hand: "복원 업체에 장부를 맡기고, 골목으로 돌아간다.",
    c35_lathe_wipe: "기술자들과 지금, 기계를 닦아 녹부터 막는다.",
    c35_lathe_wait: "조사가 끝날 때까지, 기계에 손대지 않게 한다.",
    c35_lathe_order: "협력 공장에 주문을 넘겨, 납품 날짜부터 지킨다.",
    c35_noah_sign: "탁예린의 예외 승인 서명 옆에, 내 이름을 나란히 올린다.",
    c35_noah_object: "노아의 수해 거절 기준에, 정식으로 이의를 제기한다.",
    c35_noah_route: "정부 재해 지원 자금 창구로, 상인들을 바로 안내한다.",
    c35_final_desk: "사람 심사 특별 창구에 직접 앉아, 오늘부터 한 건씩 본다.",
    c35_final_appeal: "노아의 재해 기준을, 금융감독원에 정식으로 문제 삼는다.",
    c35_final_consent: "사진을 넘기는 동의서를 받고, 사흘 만에 대출을 풀게 한다.",
    c35_after_warm: "마지막 모래주머니를 치울 때까지, 시장 사람들 곁에 남는다.",
    c35_after_record: "노아가 거절한 수해 대출 312건을, 문서로 정리해 준법감시팀에 낸다.",
    c35_after_rush: "비가 그치자마자 거절 기록을 들고, 곧장 검찰청으로 간다.",
    c35_route_system_publish: "한 바퀴 도는 설명을, 상인들과 언론에 그대로 공개한다.",
    c35_route_system_rule: "재해 대출은 반드시 사람 심사를 거치게 하는, 규칙을 요구한다.",
    c35_route_system_drop: "캡처는 덮어 두고, 거절 건을 하나씩 따로 푼다.",
    c35_final_system_route_a: "재해 대출 거절에는, 원인을 거슬러 묻는 칸을 반드시 넣게 한다.",
    c35_final_system_route_b: "노아의 결과는 두고, 그룹 기부금으로 피해를 메운다.",
    c35_final_system_route_c: "장마가 끝날 때까지, 수해 대출을 노아 심사에서 빼게 한다.",
    c35_evidence_turn_reveal: "내 부서의 이름이 적힌 요청서를, 그대로 공개한다.",
    c35_evidence_turn_quiet: "요청서는 조용히 철회시키고, 공개는 미룬다.",
    c35_evidence_turn_share: "보험을 청구한 상인들에게, 이 연결부터 알린다.",
  },
  echoReplies: {
    // CASE 35.
    c35_start_go: "트렁크에 모래주머니 스무 개를 싣고 나서면, 올림픽대로는 이미 통제 중입니다. 마지막 1km는 걸어서 갑니다.",
    c35_start_photo: "상인들이 찍은 사진은 나중에 증거가 됩니다. 그 사진을 찍는 동안 물은 한 뼘 더 오릅니다.",
    c35_start_file: "신청서는 새벽 2시에 한꺼번에 접수됩니다. 노아는 그 신청서들을 아침 9시에 한꺼번에 읽습니다.",
    c35_sandbag_alley: "골목 열한 가게가 살아납니다. 지하 전기실이 잠기면서 시장 냉동고 서른 대가 새벽 4시에 멈춥니다.",
    c35_sandbag_power: "전기는 살아남습니다. 가장 낮은 골목의 할머니들은 불이 켜진 채 잠긴 가게를 봅니다.",
    c35_sandbag_gate: "큰길 쪽 스무 곳은 문을 엽니다. 떡방 골목은 무릎까지 잠기고, 민도현의 라이브 방송은 그 골목을 비춥니다.",
    c35_branch_cellar_rice: "찹쌀 마흔 포대가 계단을 올라옵니다. 장부 상자 여섯 개는 물속에서 천천히 무거워집니다.",
    c35_branch_cellar_books: "장부 상자가 올라옵니다. 쌀 포대는 물을 먹고, 문가을은 가을 대목 주문서 한 장을 조용히 찢습니다.",
    c35_branch_cellar_leave: "모두 무사히 올라옵니다. 창고에 남은 것들은 보험 서류의 한 줄이 되고, 그 한 줄은 아무것도 설명하지 않습니다.",
    c35_branch_cellar_follow_dry: "해가 뜰 무렵 장부 절반이 마릅니다. 문하준은 드라이어를 쥔 채 책상에 엎드려 잠듭니다.",
    c35_branch_cellar_follow_scan: "사본 1,140장이 만들어집니다. 법원은 사본을 받아 주지만, 여백의 글씨는 사진 속에서 조금 흐려집니다.",
    c35_branch_cellar_follow_hand: "업체는 2주 뒤 장부를 돌려준다고 합니다. 첫 재판은 그보다 사흘 먼저입니다.",
    c35_lathe_wipe: "녹은 막습니다. 서하윤은 태블릿에 '조사 전 임의 세척'이라고 적고, 그 한 줄이 보험금에서 몇 할을 깎을지 아직 모릅니다.",
    c35_lathe_wait: "조사는 정확해집니다. 사흘째 아침 두 번째 선반 축에 붉은 녹이 번지고, 김 반장은 그 녹을 손톱으로 긁어 봅니다.",
    c35_lathe_order: "납품 날짜는 지켜집니다. 협력 공장이 세온메디칼 담당자와 명함을 주고받고, 김 반장은 그 장면을 보지 않으려고 고개를 돌립니다.",
    c35_noah_sign: "서명란에 이름이 두 개 생깁니다. 본점 심사부는 그날 오후 두 사람에게 '예외 승인 사유서'를 각각 요구합니다.",
    c35_noah_object: "이의서는 접수됩니다. 처리 기한은 30일이고, 상인들의 냉동고는 30일을 기다리지 못합니다.",
    c35_noah_route: "정부 자금은 금리가 낮고 서류가 많습니다. 하 할머니는 신청서 앞에서 돋보기를 두 번 닦습니다.",
    c35_final_desk: "특별 창구 첫날 당신은 열한 건을 봅니다. 한 건마다 사진 속 물 높이를 손가락으로 재어 보다가 밤 9시에 불을 끕니다.",
    c35_final_appeal: "민원은 접수됩니다. 전국의 다음 장마에는 기준이 바뀔지 모르지만, 이번 장마의 38명은 여전히 기다립니다.",
    c35_final_consent: "사흘 만에 대출이 나갑니다. 노아는 망원시장의 물 높이를 배웠고, 다음 장마에 그 높이를 기억할 것입니다.",
    c35_after_warm: "마지막 모래주머니가 트럭에 실릴 때 권도현이 꽃장화를 다시 신고 삽을 듭니다. 회장실 이야기는 그날 밤 아무도 꺼내지 않습니다.",
    c35_after_record: "312건의 첫 장에 망원시장 38개 가게 이름이 적힙니다. 문가을이 가을떡방 이름 옆에 떡 도장을 찍어 줍니다. 그 보고서를 누가 먼저 읽을지는 아직 모릅니다.",
    c35_after_rush: "떡판을 두고 일어서는 당신 등 뒤에서 문가을이 당신 몫을 민도현에게 건넵니다. 검찰청 민원실 번호표는 오후 4시에 마감됩니다.",
    c35_route_system_publish: "캡처는 오후 뉴스에 나갑니다. KD데이터랩은 그날 밤 노아의 시험 화면 접속 권한을 모두 막습니다.",
    c35_route_system_rule: "규칙은 받아들여집니다. 사람 심사자는 두 명뿐이라, 재해 대출 한 건에 이틀이 걸립니다.",
    c35_route_system_drop: "거절 건은 하나씩 풀립니다. 한 바퀴 도는 설명은 다음 장마에도 그대로 돕니다.",
    c35_final_system_route_a: "칸이 생기면 노아는 네 번째 질문에서 멈춥니다. 멈춘 자리에서 사람이 답을 써야 합니다.",
    c35_final_system_route_b: "기부금 보도자료가 나가고, 사진 속 회장이 모래주머니를 듭니다. 노아의 기준은 한 줄도 바뀌지 않습니다.",
    c35_final_system_route_c: "장마 동안 노아는 수해 대출을 보지 않습니다. 장마가 언제 끝나는지는 기상청도 아직 모릅니다.",
    c35_evidence_turn_reveal: "당신 부서 이름이 기사 첫 줄에 오릅니다. 위험관리부 동료들이 다음 날 아침 당신 자리를 지나며 인사를 하지 않습니다.",
    c35_evidence_turn_quiet: "요청서는 소리 없이 철회됩니다. 가중치는 내려가지만, 누가 그것을 넣었는지는 아무도 모르게 됩니다.",
    c35_evidence_turn_share: "상인들은 보험 청구가 대출 거절로 이어졌다는 걸 알게 됩니다. 몇 명은 청구를 취소하겠다고 하고, 당신이 말립니다.",
  },
  characterProfiles: {
    서하윤: {
      role: "KD손해보험 손해사정사 · 6년 차",
      stance: "원칙 · 증거 · 미안함",
      job: "피해를 정확히 재는 것이 피해자를 돕는 길이라고 믿는다. 그래서 가장 먼저 '손대지 말라'고 말해야 하는 사람이다.",
      appearance: "무릎까지 오는 남색 장화, 방수 케이스에 넣은 태블릿, 머리끈에 끼운 줄자.",
      thought: "사진 한 장이 보험금을 정한다. 그 사진을 찍는 동안 녹이 스는 것도 안다.",
      gesture: "서하윤은 나쁜 소식을 전하기 전에 장화 끝으로 바닥의 물 높이를 먼저 잰다.",
      voice: "침착하고 정확하게 말하다가, 회사 문장을 대신 읽어야 할 때만 한 박자 늦어진다.",
      line: "닦으면 깨끗해져요. 깨끗해지면 피해가 없던 게 돼요.",
    },
    민도현: {
      role: "망원시장 상인회 총무 · 도현청과 2대 사장",
      stance: "생활 · 연결 · 떠들썩함",
      job: "시장 가게 예순 곳의 사정을 다 알고, 휴대폰 라이브 방송 하나로 사람과 모래주머니와 드라이어를 모은다.",
      appearance: "목에 건 방수 휴대폰 거치대, 시장 로고가 박힌 형광 조끼, 귀 뒤에 꽂은 네임펜.",
      thought: "시장은 가게가 아니라 사람들 사이에 있다. 은행은 그 사이를 못 본다.",
      gesture: "민도현은 심각한 말을 하기 전에 라이브 방송을 끄고 휴대폰을 뒤집어 놓는다.",
      voice: "시장 호객하듯 크게 말하다가, 누가 울면 갑자기 목소리를 반으로 줄인다.",
      line: "구독자 4천 명보다 모래주머니 하나가 급해요. 둘 다 오면 더 좋고요.",
    },
  },
  setting: { place: "KD캐피탈 위험관리부 · 상황판", clock: "7월 14일 · 폭우 · 23:40" },
  sceneContext: {
    c35_start: {
      place: "KD캐피탈 위험관리부 · 상황판",
      clock: "7월 14일 · 폭우 · 23:40",
      question: "망원시장과 끝까지정밀이 한 밤에 함께 잠기고 있습니다. 무엇부터 하겠습니까?",
      lead: "압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사) 뒤 야근이 일상이 된 위험관리부에서, 재해 상황판이 처음으로 아는 이름들을 붉게 칠합니다.",
    },
    c35_start_warm: {
      place: "KD캐피탈 위험관리부 · 상황판",
      clock: "7월 14일 · 폭우 · 23:40",
      question: "'오늘 무사함'이 끊긴 단체방이 쉬지 않고 울립니다. 누구와 함께 어디로 가겠습니까?",
      lead: "헌책방에서 복숭아 한 상자를 나눠 먹은 뒤 닷새, 단체방의 '오늘 무사함'은 하루도 빠지지 않았습니다.",
    },
    c35_start_record: {
      place: "KD캐피탈 위험관리부 · 상황판",
      clock: "7월 14일 · 폭우 · 23:40",
      question: "노아의 거절 사유는 사흘 뒤면 사라집니다. 물과 기록 중 무엇부터 붙잡겠습니까?",
      lead: "경위서 사본을 서랍에 넣고 보관 기록 대조표를 넘기던 손이, 상황판의 경보음에 멈춥니다.",
    },
    c35_start_rush: {
      place: "인천 남동공단 끝까지정밀 · 공장",
      clock: "7월 14일 · 폭우 · 23:40",
      question: "놓친 전화 일곱 통 끝에 문가을이 당신밖에 없다고 합니다. 무엇을 내려놓겠습니까?",
      lead: "닷새째 뚫어 온 배수구 앞에서 허리를 펴자, 휴대폰 화면에 같은 이름이 일곱 번 떠 있습니다.",
    },
    c35_sandbag: {
      place: "망원시장 · 떡방 골목",
      clock: "7월 15일 · 폭우 · 01:30",
      question: "모래주머니 300개로 막을 수 있는 곳은 한 군데뿐입니다. 어디를 막겠습니까?",
      lead: "통제된 도로에 택시를 버리고 마지막 1km를 뛰어오자, 시장 입구 셔터마다 흙탕물이 찰랑입니다.",
    },
    c35_branch_cellar: {
      place: "망원시장 가을떡방 · 지하 창고",
      clock: "7월 15일 · 폭우 · 02:10",
      question: "찹쌀 마흔 포대와 소송 장부 여섯 상자 중 한 번에 하나만 올릴 수 있습니다. 무엇을 올리겠습니까?",
    },
    c35_branch_cellar_follow: {
      place: "망원시장 상인회 사무실 · 2층",
      clock: "7월 15일 · 폭우 · 04:00",
      question: "젖은 장부 여백에 '끝까지 받을 것'이 남았습니다. 이 종이를 어떻게 지키겠습니까?",
    },
    c35_elder: {
      place: "망원시장 · 가장 안쪽 골목",
      clock: "7월 15일 · 폭우 · 03:00",
      question: "하 할머니가 남편이 사 준 압착기 위에서 내려오지 않습니다. 어떻게 하겠습니까?",
    },
    c35_elder_reaction: {
      place: "망원시장 · 아케이드 입구",
      clock: "7월 15일 · 폭우 · 03:40",
      question: "노아가 신청도 받기 전에 시장 전체의 점수를 낮췄습니다. 이 화면을 어떻게 쓰겠습니까?",
    },
    c35_lathe: {
      place: "인천 남동공단 끝까지정밀 · 공장",
      clock: "7월 15일 · 폭우 뒤 · 14:00",
      question: "지금 닦으면 녹을 막고, 기다리면 보험금을 지킵니다. 선반 여섯 대를 어떻게 하겠습니까?",
      lead: "공단 진입로의 물이 빠지자마자 달려왔습니다. 공장 바닥에 발목까지 빠지는 뻘이 깔려 있습니다.",
    },
    c35_rust: {
      place: "인천 남동공단 끝까지정밀 · 선반 앞",
      clock: "7월 15일 · 장마 · 22:00",
      question: "흙 아래에서 문성호의 글씨가 나왔습니다. 닦아야 할 기계 위의 글씨를 어떻게 하겠습니까?",
    },
    c35_rust_reaction: {
      place: "인천 남동공단 · 공장 앞 주차장",
      clock: "7월 15일 · 장마 · 23:50",
      question: "자연재해를 보장하는 특약에 자연재해 면책을 먼저 보라는 공문이 왔습니다. 어떻게 하겠습니까?",
    },
    c35_noah: {
      place: "KD은행 강서지점 · 창구",
      clock: "7월 16일 · 장마 · 10:00",
      question: "물에 잠겼다는 이유로 수해 긴급 대출 38건이 거절됐습니다. 이 거절 앞에서 무엇을 하겠습니까?",
      lead: "지점 객장 바닥에 젖은 발자국이 번호표 기계까지 이어져 있습니다.",
    },
    c35_weight: {
      place: "KD은행 강서지점 · 회의실",
      clock: "7월 16일 · 장마 · 15:00",
      question: "노아는 거절당한 사람들이 무너진 기록으로 거절을 배웠습니다. 이 가중치를 어떻게 하겠습니까?",
    },
    c35_weight_reaction: {
      place: "KD은행 강서지점 · 옥상",
      clock: "7월 16일 · 장마 · 21:00",
      question: "도장 들고 대피소로 간 지점장의 여름에 못 갚은 사람은 두 명이었습니다. 그 이야기를 어떻게 쓰겠습니까?",
    },
    c35_route_system: {
      place: "KD데이터랩 · 서버실",
      clock: "7월 17일 · 장마",
      question: "노아의 거절 이유가 한 바퀴 돌아 제자리로 옵니다. 이 설명을 어떻게 하겠습니까?",
    },
    c35_final_system_route: {
      place: "KD데이터랩 · 서버실",
      clock: "7월 18일 · 장마 · 새벽",
      question: "재해 앞의 기계 심사에 규칙 하나를 넣을 수 있다면, 무엇을 넣겠습니까?",
    },
    c35_evidence_turn: {
      place: "KD캐피탈 위험관리부 · 자료실",
      clock: "7월 18일 · 장마 · 07:00",
      question: "재해 가중치를 요청한 곳은 당신의 부서였습니다. 이 요청서를 어떻게 쓰겠습니까?",
    },
    c35_final: {
      place: "망원시장 상인회 사무실 · 회의실",
      clock: "7월 18일 · 장마 끝물 · 10:00",
      question: "3주의 사람 심사, 몇 달의 민원, 사흘의 동의서가 놓였습니다. 어느 서류를 집겠습니까?",
      lead: "빗줄기가 가늘어진 아침, 상인회 사무실 계단마다 물 자국이 허리 높이로 남아 있습니다.",
    },
    c35_aftershock: {
      place: "망원시장 가을떡방 · 가게 앞",
      clock: "7월 19일 · 비 갠 오후",
      question: "떡이 도는 오후, 회장이 시장 영상 속 당신 얼굴에서 멈췄다는 소식이 옵니다. 이 오후를 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c35-flood-weight",
    title: "빈 승인란의 재해 가중치",
    text: "노아의 '재해 노출' 가중치는 KD캐피탈 위험관리부의 요청으로 들어갔고 승인란은 비어 있었습니다. 보험 피해 접수 명단이 6시간마다 노아의 거절 목록으로 넘어갔습니다.",
  },
  outcomes: {
    c35_after_warm: { tag: "곁에 남은 결말", title: "마지막 모래주머니를 치울 때까지 망원시장에 남았다", text: "비 갠 첫날, 물을 퍼 준 사람들 모두가 떡 한 조각씩을 받았고 골목 끝 모래주머니 산은 해 질 무렵 다 치워졌습니다. 마지막 삽질은 꽃장화를 다시 신은 권도현이 했습니다." },
    c35_after_record: { tag: "문서로 남긴 결말", title: "거절된 312건이 한 권의 보고서가 됐다", text: "장마 동안 노아가 거절한 수해 긴급 대출 312건이 한 건씩 정리돼 그룹 준법감시팀에 접수됐습니다. 첫 장의 망원시장 가게 이름마다 문가을의 떡 도장이 찍혔습니다." },
    c35_after_rush: { tag: "먼저 달려간 결말", title: "비가 그치자마자 거절 기록을 들고 검찰청으로 갔다", text: "당신은 떡이 다 돌기 전에 노아의 거절 기록을 들고 검찰청으로 향했습니다. 떡판 위 당신 몫은 민도현의 라이브 방송 구독자 추첨 상품이 됐습니다." },
  },
  carryovers: {
    c35_after_warm: { trust: 10, humanCost: -6, fatigue: -7 },
    c35_after_record: { legitimacy: 12, trust: 4, fatigue: 6 },
    c35_after_rush: { capital: 8, legitimacy: 3, trust: -7 },
  },
  continuityChallenges: {
    c34_after_warm: { id: "protect-trust", title: "복숭아를 나눈 사람들과 함께 가기", text: "헌책방에서 복숭아 한 상자를 함께 비운 사람들이 오늘 밤은 무사하지 않습니다. 물에 잠긴 사람들 앞에 혼자가 아니라 여럿이 서는 선택을 찾아야 보너스가 열립니다." },
    c34_after_record: { id: "use-reframe", title: "사라질 거절 사유 붙잡기", text: "수첩이 나온 길을 문서로 남긴 당신 앞에, 72시간이면 사라지는 노아의 거절 사유가 있습니다. 기록이 누구를 지키는지 판을 다시 짜야 합니다." },
    c34_after_rush: { id: "repair-legitimacy", title: "공장 밖에서 놓친 일곱 통의 공정함 회복하기", text: "먼저 공장으로 달려간 사이 문가을의 전화를 일곱 번 놓쳤습니다. 이번에는 잠긴 사람들이 왜 거절당했는지 납득할 수 있는 선택을 찾아야 합니다." },
  },
};
