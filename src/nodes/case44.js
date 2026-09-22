/**
 * CASE 44 -- the authored scenes of the first verdict.
 *
 * 사건 08 found the money: twelve consulting fees into 해온파트너스, each paid
 * the business day after the bank approved something the other side wanted,
 * each forwarded the same day to a gallery in 윤상혁's wife's name. Thirty-six
 * cases later the trail reaches a courtroom. The prosecution asked for seven
 * years. The day before the verdict, the defence files two more papers: a
 * pardon letter from KD은행 -- the legal victim of the breach of trust -- and a
 * petition of 1,204 employees. The victim forgives, and the court is obliged to
 * weigh it.
 *
 * The case is about who does the forgiving. The pardon letter carries the
 * corporate seal and an empty signature box for the chief executive; the "harm
 * repaired" it cites is the 300억 compensation fund from 사건 12, which the
 * ledger shows was cut from staff bonuses and then re-booked under his name; the
 * petition was signed on the back of the branch holiday-gift order form. Four of
 * the twelve counts end in acquittal because the approvals were left unsigned.
 * The verdict is three years, suspended for five, and he goes home for dinner.
 *
 * The range is deliberate: the anger of a court reading "the harm has largely
 * been repaired" to the people who paid for it, the comedy of a dawn ballot
 * queue (강태민's thermos, 권도현's expected value, a betting pool on how many
 * times the judge says '다만'), the grief of 윤서진 glad her father is coming
 * home and hating that she is glad, and the joy of a rice-cake shop that closes
 * the day on its own sentence: "끝났다는 말은, 우리가 할게요." 임경수's call at
 * the end opens 사건 45.
 */
export const case44Nodes = {
  c44_start: {
    phase: "CASE 44 BRIEFING",
    title: "선고 전날",
    speaker: "오진우",
    text:
      "선고 전날 밤, 회기동 헌책방 1층. 오진우가 A4 한 장을 책장 사이 테이블에 내려놓습니다. 내일 오전 10시는 해온파트너스 자문료(조언해 준 값이라며 주고받은 돈) 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 사건의 1심 선고입니다. 검사는 징역 7년을 구형(검사가 판사에게 요청하는 형량)했습니다. 그런데 오늘 오후, 윤상혁 쪽이 서류 두 가지를 더 냈습니다. KD은행 명의의 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류), 그리고 직원 1,204명의 탄원서입니다. 오진우가 웃지 않습니다. '이 죄의 피해자는 법으로는 KD은행입니다. 피해자가 괜찮다고 하면 판사는 그걸 양형(형량을 얼마로 할지 정하는 일)에 넣어야 해요. 제가 3년을 쫓은 돈인데, 용서는 회사가 하네요.'",
    memo: [
      "선고: 9월 10일(목) 오전 10시, 서울중앙지방법원 417호",
      "검찰 요청: 징역 7년, 해온 자문료 38억 4천만 원 몰수",
      "선고 전날 제출: KD은행 명의 처벌불원서, 탄원서 1,204장",
      "방청석 102석 -- 새벽 추첨",
    ],
    triggers: ["injustice", "revenge", "responsibility"],
    choices: [
      {
        id: "c44_start_seats",
        label: "모임 사람들이 앉을 방청석 자리부터 챙긴다",
        effect: { trust: 11, humanCost: -5, time: -5, capital: -3, fatigue: 5 },
        next: "c44_lottery",
        cognition: { persistence: 2 },
      },
      {
        id: "c44_start_brief",
        label: "처벌불원서를 반박할 의견서를 밤새 써서 검찰에 보낸다",
        effect: { legitimacy: 12, time: -5, trust: -2, humanCost: 1, fatigue: 4 },
        next: "c44_lottery",
        cognition: { inference: 2 },
      },
      {
        id: "c44_start_trace",
        label: "선고는 기자들에게 맡기고 빼돌린 돈의 행방부터 쫓는다",
        effect: { capital: 8, time: 5, legitimacy: -6, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c44_lottery",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c44_lottery",
      },
    ],
  },
  c44_lottery: {
    phase: "THE LINE",
    title: "방청권 102장",
    speaker: "강태민",
    text:
      "새벽 4시 30분, 서울중앙지방법원 동관 앞. 방청권은 102장이고 추첨은 8시입니다. 강태민은 벌써 두 시간째 보온병을 끼고 줄 맨 앞에 서 있습니다. 나준혁은 영동 객장 어르신 여섯 분을 승합차로 모셔 와 '서울 법원 구경'이라고 설명했고, 권도현은 신청자를 세더니 당첨 확률 18.9%를 선언하고 아무도 묻지 않은 기대값까지 계산합니다. 그런데 줄 가운데에 남색 모자를 쓴 스무 명이 서 있습니다. 서로 모르는 사이인데 모자가 똑같습니다. 한 사람의 휴대폰 화면에 문자가 떠 있습니다. '법원 방청 대기 일당 12만 원, 당첨 시 5만 원 추가.' 문가을은 한참 뒤쪽에서 떡 보따리를 안고 서 있습니다. 이대로면 모임 사람 절반은 법정에 못 들어갑니다.",
    memo: [
      "방청권 102장, 신청자 540명",
      "남색 모자 20명 -- 같은 의뢰 문자",
      "피해자 모임 참석자 38명",
      "권도현 계산: 당첨 확률 18.9%",
    ],
    triggers: ["injustice", "protection", "competition"],
    choices: [
      {
        id: "c44_lottery_give",
        label: "당첨된 우리 방청권을 모임 사람들에게 먼저 넘긴다",
        effect: { trust: 12, humanCost: -4, time: -4, legitimacy: -2, fatigue: 6 },
        next: "c44_court",
        cognition: { reframing: 2 },
      },
      {
        id: "c44_lottery_report",
        label: "대리 줄서기 문자를 법원 경위에게 알리고 확인을 요청한다",
        effect: { legitimacy: 11, trust: 2, time: -5, humanCost: 2, fatigue: 4 },
        next: "c44_court",
        cognition: { inference: 2 },
      },
      {
        id: "c44_lottery_press",
        label: "기자석 옆자리를 얻어 먼저 들어가 기록부터 챙긴다",
        effect: { time: 6, capital: 4, trust: -5, humanCost: 4, legitimacy: 2, fatigue: -3 },
        next: "c44_court",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c44_court",
      },
    ],
  },
  c44_court: {
    phase: "THE READING",
    title: "다만",
    speaker: "권도현",
    text:
      "417호 법정, 판결 이유 낭독 31분째. 재판장 이하경은 해온파트너스로 들어간 자문료(조언값이라며 주고받은 돈) 열두 번 가운데 여덟 번을 배임(맡은 일을 저버려 회사에 손해를 끼친 죄)으로 인정했습니다. 권도현은 방청석에서 손가락을 접으며 '다만'을 셉니다. 판결이 한쪽으로 기울 때마다 재판장이 '다만'으로 방향을 틉니다. 지금 아홉 번째. 오진우는 열다섯 번에, 권도현은 스무 번에 만 원을 걸었습니다. 그리고 양형(형량을 얼마로 할지 정하는 일) 사유가 나옵니다. '다만, 피해자 KD은행이 처벌을 원하지 않고, 피고인이 300억 원 규모 자율 배상안 마련에 기여하여 피해가 상당 부분 회복된 점은…' 문가을의 손이 떡 보따리를 움켜쥡니다. 그 300억은 직원 성과급을 깎아 만든 돈이었습니다. 문가을이 일어서려 하고, 법정 경위가 이쪽으로 고개를 돌립니다.",
    memo: [
      "자문료 12회 중 8회 유죄 인정",
      "양형 사유: 처벌불원서, 배상안 기여, 초범, 탄원서",
      "'다만' 9회째 -- 권도현·오진우 만 원 내기",
      "법정 소란 시 감치(법정 질서 위반으로 바로 가두는 처분) 가능",
    ],
    triggers: ["injustice", "protection", "helplessness"],
    choices: [
      {
        id: "c44_court_hold",
        label: "문가을의 손을 잡고 곁에 앉아 끝까지 듣는다",
        effect: { trust: 13, humanCost: -5, legitimacy: -3, time: -3, fatigue: 6 },
        next: "c44_lunch",
        cognition: { persistence: 2 },
      },
      {
        id: "c44_court_note",
        label: "양형 사유를 한 줄씩 받아 적어 다음 재판 자료로 남긴다",
        effect: { legitimacy: 12, trust: 3, time: -4, humanCost: 1, fatigue: 4 },
        next: "c44_lunch",
        cognition: { inference: 2 },
      },
      {
        id: "c44_court_leave",
        label: "문가을과 함께 먼저 나가 기자들 앞에 선다",
        effect: { capital: 7, time: 4, trust: 3, legitimacy: -5, humanCost: 4, fatigue: -2 },
        next: "c44_lunch",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c44_lunch",
      },
    ],
  },
  c44_lunch: {
    phase: "AFTER THE BENCH",
    title: "순댓국 열한 그릇",
    speaker: "문가을",
    text:
      "법원 뒷골목 순댓국집. 열한 명이 테이블 세 개를 붙여 앉습니다. 아침 보안 검색대에서 맡겨 두었던 문가을의 떡 보따리가 돌아왔는데, 경위가 '하나만' 하며 가져간 게 세 개입니다. 문하준은 스케치북을 펼쳐 재판장이 안경을 밀어 올린 횟수(열네 번)를 보여 주고, 권도현은 '다만' 최종 스물세 번으로 내기에서 이겨 오진우에게 만 원을 받아 냅니다. 오진우는 지폐를 내밀며 재검표를 요구합니다. 웃음이 한 바퀴 돈 뒤, 문가을이 수저를 내려놓습니다. '남편 가게를 망하게 한 돈이 25억이래요. 그 사람은 오늘 집에 가서 밥 먹는대요. 우리는 여기서 밥 먹고요.' 그때 문이 열리고 나은호 검사가 들어와 빈자리에 앉습니다. 은박지째 든 김밥을 순댓국 옆에 내려놓고 손가락을 하나 폅니다. '항소(1심 판결에 불복해 다시 재판해 달라고 하는 것)하려면 이유가 필요해요. 기한은 7일이고요.'",
    memo: [
      "판결: 징역 3년, 집행유예 5년, 추징 25억 6천만 원",
      "무죄 4건 -- 승인 문서 서명란이 비어 있음",
      "검찰 항소 기한: 선고일로부터 7일",
      "나은호: 새 증거나 양형을 뒤집을 사정이 필요",
    ],
    triggers: ["affection", "revenge", "choice"],
    choices: [
      {
        id: "c44_lunch_ask",
        label: "모임 사람들의 뜻부터 모아 항소를 요청하는 편지로 만든다",
        effect: { trust: 12, legitimacy: 3, humanCost: -4, time: -5, capital: -3, fatigue: 5 },
        next: "c44_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c44_lunch_state",
        label: "열두 번의 날짜를 아는 증인으로 진술서를 쓰겠다고 한다",
        effect: { legitimacy: 13, trust: -3, time: -5, humanCost: 2, fatigue: 5 },
        next: "c44_final",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c44_lunch_money",
        label: "항소보다 추징금이 피해자에게 가는 길부터 찾자고 한다",
        effect: { capital: 9, time: 3, trust: -4, legitimacy: -3, humanCost: 4, fatigue: -2 },
        next: "c44_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c44_final",
      },
    ],
  },
  c44_final: {
    phase: "FINAL DECISION",
    title: "끝났다는 말",
    speaker: "문가을",
    text:
      "오후 5시 20분, 서울중앙지방법원 정문 앞. 카메라가 열일곱 대입니다. KD금융그룹 홍보실은 이미 입장문을 돌렸습니다. '사법부의 판단을 존중하며, 그룹의 개혁은 계속됩니다.' 기자들이 마이크를 문가을 쪽으로 몰아옵니다. 그는 하루 종일 인터뷰를 거절했습니다. 앞치마 대신 검은 재킷, 손에는 남은 떡 두 개. 문가을이 마이크 하나를 손등으로 밀어내고 한 문장만 말합니다. '형량은 판사님이 정했어요. 근데 끝났다는 말은, 우리가 할게요.' 카메라들이 한꺼번에 당신 쪽으로 돌아섭니다. 항소(판결에 불복해 다시 재판해 달라고 하는 것) 기한은 7일, 추징금 25억 6천만 원은 나라 금고로 들어갑니다. 1,740명에게 가는 돈은 그중 한 푼도 없습니다. 다음 문장은 당신 차례입니다.",
    memo: [
      "카메라 17대 -- 그룹 입장문 '개혁은 계속'",
      "추징금 25억 6천만 원 -- 국고 귀속, 피해자 배상 아님",
      "항소 기한 D-7, 결정권은 검찰에",
      "문가을: '끝났다는 말은 우리가'",
    ],
    triggers: ["choice", "injustice", "affection"],
    choices: [
      {
        id: "c44_final_mic",
        label: "마이크를 모임 사람들에게 넘기고 문가을 뒤에 선다",
        effect: { trust: 13, humanCost: -6, legitimacy: 3, capital: -4, time: -5, fatigue: 5 },
        next: "case44_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c44_final_appeal",
        label: "모임 이름으로 항소를 요청하는 피해자 의견서를 검찰에 낸다",
        effect: { legitimacy: 13, trust: 6, capital: -7, time: -7, humanCost: 2, fatigue: 5 },
        next: "case44_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c44_final_fund",
        label: "추징금이 배상에 쓰이도록 그룹과 바로 협상하겠다고 밝힌다",
        effect: { capital: 11, time: 5, trust: 2, legitimacy: -6, humanCost: 4, fatigue: -3 },
        next: "case44_result",
        cognition: { risk: 2, reframing: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case44_result",
      },
    ],
  },
};

/**
 * Everything else case 44 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case44 = {
  id: "case44",
  nodes: case44Nodes,
  aftermath: {
    c44_aftershock: {
      phase: "AFTERMATH",
      title: "선고 날의 떡",
      speaker: "임소율",
      text: "그날 밤 가을떡방. 셔터를 반쯤 내린 가게에 열한 명이 다시 모입니다. 나준혁이 영동 어르신들의 소감을 전합니다. '법원이 생각보다 춥더래요. 전기세는 누가 내냐고.' 강태민은 서지호를 데려와 떡 상자를 접게 하고, 권도현은 순댓국 값을 11분의 1로 나누다 문가을에게 '공짜 떡에 계산서 붙이지 마요' 소리를 듣습니다. 문하준이 스케치북 한 장을 찢어 벽에 붙입니다. 재판장 얼굴 옆에 '다만 23번'이라고 적혀 있습니다. 밤 10시, 임소율에게서 전화가 옵니다. '할아버지가 라디오로 선고를 들으셨어요. 그러더니 봉투 하나를 찾으세요. 이제 줄 때가 됐대요. 근데 숨이 너무 차세요.'",
      memo: ["선고 결과: 집행유예, 법정구속 없음", "가을떡방 벽: 문하준의 '다만 23번'", "서지호, 떡 상자 접기 첫 출근", "임경수: '이제 줄 때가 됐다' -- 숨이 참"],
      triggers: ["affection", "helplessness", "choice"],
      choices: [
        { id: "c44_after_warm", label: "남은 떡을 싸 들고 모두 함께 임경수에게 간다", effect: { trust: 12, humanCost: -5, time: -3, capital: -3, fatigue: -8 }, next: "case44_result", cognition: { reframing: 2 } },
        { id: "c44_after_record", label: "판결문 전문을 받아 모임용 쉬운 해설본부터 쓴다", effect: { legitimacy: 14, trust: 3, time: -4, capital: -2, fatigue: 5 }, next: "case44_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c44_after_rush", label: "곧장 검찰청으로 가서 나은호와 항소 이유를 짠다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 4, fatigue: 5 }, next: "case44_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c44_final", "c44_aftershock"],
  connectiveScenes: [
    ["c44_cap", "c44_lottery", "c44_court", "남색 모자", "강태민", "남색 모자 가운데 한 명이 강태민을 보고 고개를 숙입니다. 서지호, 스물여섯. 작년 겨울 로봇 120대가 들어오던 달에 계약이 끝난 플로우온 야간조였습니다. 지금은 줄서기 대행 앱으로 하루를 삽니다. 어제는 아이돌 팬 사인회, 오늘은 법원입니다. 누구 재판인지는 몰랐다고 합니다. 강태민이 보온병 뚜껑에 보리차를 따라 건넵니다. 서지호가 모자챙을 만지작거립니다. '반장님, 저 이거 당첨되면 5만 원 더 받아요. 이번 달 월세가 딱 5만 원 모자라요.'", ["서지호: 전 플로우온 야간조, 로봇 도입 때 계약 종료", "줄서기 대행 일당 12만 원 + 당첨 5만 원", "의뢰인이 누구인지 서지호는 모름"], ["모자란 5만 원을 우리가 채우고 모임 일을 맡긴다", "서지호가 받은 의뢰 문자를 증거로 받아 둔다", "그의 하루벌이니 줄은 그대로 두고 지나간다"]],
    ["c44_verdict", "c44_court", "c44_lunch", "주문", "이하경", "재판장이 주문(판결의 결론 부분)을 읽습니다. 징역 3년에 집행유예(유죄지만 형을 당장 살게 하지 않고 미뤄 두는 것) 5년, 추징(범죄로 얻은 돈만큼을 나라가 거둬 가는 것) 25억 6천만 원. 열두 번 가운데 네 번은 무죄입니다. 그 네 번의 승인 문서는 서명란이 비어 있어 누가 승인했는지 특정할 수 없다는 이유입니다. 법정구속(선고 자리에서 바로 구치소로 데려가는 것)은 없습니다. 윤상혁이 재판부를 향해 허리를 숙이고, 변호인 여덟 명과 함께 걸어 나갑니다. 방청석 어딘가에서 누군가 짧게 웁니다. 문하준이 스케치북 귀퉁이에 적습니다. '빈칸 = 무죄.'", ["징역 3년, 집행유예 5년, 추징 25억 6천만 원", "무죄 4건: 서명란이 빈 승인 문서", "윤상혁, 법정구속 없이 퇴정"], ["문가을 곁으로 먼저 가서 아무 말 없이 선다", "판결 요지를 받아 적어 모임 단체방에 그대로 올린다", "윤상혁이 나가는 복도로 곧장 따라간다"]],
    ["c44_petition", "c44_lunch", "c44_final", "1,204장", "도윤하", "나은호가 두고 간 탄원서 목록을 도윤하가 넘깁니다. 1,204명 가운데 강서지점 직원이 서른한 명입니다. 여섯 번째 장에서 도윤하의 손이 멈춥니다. 탁예린. 노아의 거절을 뒤집으려고 끝까지 싸우던 그 대리입니다. 서명 옆에는 지점 총무가 연필로 적은 메모가 남아 있습니다. '추석 선물 신청서 뒷면.' 선물 세트를 고르고 종이를 넘기면 '조직 안정을 위한 동료 서명'이 나오는 방식이었습니다. 도윤하가 목록을 덮습니다. '성과급 깎인 사람들이, 그 돈으로 생색낸 사람 선처를 빌었네요. 선물 세트 고르다가.'", ["탄원서 1,204장 중 강서지점 31명", "서명 방식: 추석 선물 신청서 뒷면", "탁예린의 서명 포함"], ["탁예린에게 직접 연락해 어떻게 서명했는지 듣는다", "서명을 받은 방식을 조사해 달라고 검찰에 요청한다", "서명한 사람들은 탓하지 않고 목록을 덮어 둔다"]],
  ],
  connectiveOrder: [["c44_lottery", "c44_cap"], ["c44_court", "c44_verdict"], ["c44_lunch", "c44_petition"]],
  choiceEffects: {
    c44_lottery: [
      { trust: 10, humanCost: -5, capital: -5, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: -2, time: -4, humanCost: 1, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, humanCost: 5, fatigue: -3 },
    ],
    c44_court: [
      { trust: 11, humanCost: -4, time: -3, capital: -2, fatigue: 5 },
      { legitimacy: 9, trust: 4, time: -3, humanCost: 1, fatigue: 3 },
      { time: 5, capital: 4, trust: -4, legitimacy: 3, humanCost: 4, fatigue: -3 },
    ],
    c44_lunch: [
      { trust: 10, humanCost: -5, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: -3, time: -4, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 3, trust: -4, legitimacy: 2, humanCost: 5, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c44_lottery: {
      voice: ["모자란 5만 원은 우리가 채우고, 모임 일을 맡긴다.", "서지호가 받은 의뢰 문자를, 증거로 받아 둔다.", "그의 하루벌이라며, 줄은 그대로 두고 지나간다."],
      echo: ["5만 원이 채워지면 서지호는 남색 모자를 벗고 문가을의 떡 보따리를 듭니다. 줄에서 한 자리가 비고, 그 자리는 다른 알바가 채웁니다.", "문자는 증거가 됩니다. 서지호는 그 앱에서 다시는 일감을 받지 못할 수도 있다는 걸 압니다.", "줄은 그대로입니다. 서지호가 당첨되면 월세를 내고, 모임 사람 한 명은 복도 모니터로 선고를 봅니다."],
    },
    c44_court: {
      voice: ["문가을 곁으로 먼저 가서, 아무 말 없이 선다.", "판결 요지를 받아 적어, 모임 단체방에 그대로 올린다.", "윤상혁이 나가는 복도로, 곧장 따라간다."],
      echo: ["곁에 서면 문가을은 한참 아무 말도 하지 않습니다. 그러다 떡 하나를 꺼내 당신 손에 쥐여 줍니다.", "요지가 올라가자 단체방이 1분 동안 조용합니다. 그다음 '빈칸이 뭐예요?'라는 질문이 마흔 개 올라옵니다.", "복도에서 윤상혁은 걸음을 늦추지 않습니다. 변호인 여덟 명이 당신과 그 사이에 벽처럼 섭니다."],
    },
    c44_lunch: {
      voice: ["탁예린에게 직접 연락해, 어떻게 서명했는지 듣는다.", "서명을 받은 방식을, 조사해 달라고 검찰에 요청한다.", "서명한 사람들은 탓하지 않고, 목록을 덮어 둔다."],
      echo: ["전화를 걸면 탁예린은 변명하지 않습니다. 대신 지점 총무가 종이를 어떻게 돌렸는지 순서대로 말합니다.", "요청하면 서명 방식이 조사 대상이 됩니다. 서른한 명 모두가 한 번씩 불려 가 설명해야 합니다.", "목록은 덮입니다. 1,204라는 숫자는 판결문에 그대로 남습니다."],
    },
  },
  reactionScenes: [
    ["c44_cap_reaction", "c44_cap", "c44_court", "스무 명의 값", "권도현", "서지호가 보여 준 앱 화면에 의뢰인 이름이 떠 있습니다. '모먼트피알'. 권도현이 검색 두 번 만에 찾아냅니다. KD금융그룹 계열사(같은 그룹에 속한 다른 회사)들의 행사 대행을 3년째 맡아 온 홍보 회사입니다. 권도현이 계산기를 꺼내다가 도로 넣습니다. '스무 명에 12만 원이면 240만 원. 피해자 가족 스무 명을 법정 밖에 세워 두는 값이 240만 원이라는 뜻이죠.' 그가 모자 쓴 사람들을 한 번 둘러봅니다. '싸게 막았네요. 이 가격이면 저쪽은 흑자입니다.'", ["남색 모자 스무 명에게 사정을 말하고 자리를 부탁한다", "의뢰 기록을 캡처해 재판부에 서면으로 알린다", "들어갈 자리는 이미 있으니 따지지 않고 넘어간다"]],
    ["c44_verdict_reaction", "c44_verdict", "c44_lunch", "미역국", "윤서진", "복도 끝 자판기 앞에서 윤서진이 기다리고 있습니다. 모자를 벗은 얼굴이 붉습니다. '아버지 오늘 집에 와요. 어머니가 저녁에 미역국 끓인대요. 생일도 아닌데.' 그가 캔커피 두 개를 뽑아 하나를 내밉니다. '아까 그 사진 봤어요. 빈 칸.' 그가 정확히 3초 멈춥니다. '저는 아빠가 오늘 집에 오는 게 기뻐요. 그리고 그게 기쁜 제가 싫어요.' 캔을 쥔 손이 떨립니다. '이 두 개가 동시에 되는 거, 알아요?'", ["캔커피를 받고 그 말이 끝날 때까지 곁에 있는다", "빈 칸에 대해 아는 것이 있으면 검찰에 말해 달라고 한다", "지금은 할 말이 없다며 모임 사람들에게 돌아간다"]],
    ["c44_petition_reaction", "c44_petition", "c44_final", "한우 세트", "탁예린", "탁예린이 두 번째 신호에 전화를 받습니다. 지점 셔터가 내려가는 소리가 들립니다. '제 글씨 맞아요. 한우 세트 고르고 뒷장에 이름 쓰라길래 썼어요. 다들 쓰니까요.' 한참 조용하다가 목소리가 작아집니다. '하준이 인턴 때 노아가 끝까지정밀 거절하는 거 보고 저 화장실에서 울었잖아요. 그래 놓고 제가 그 위에 있던 사람 선처해 달라고 이름을 쓴 거예요. 지울 수 있어요? 못 지우면, 적어도 제가 몰랐다는 건 어디 적어 줄 수 있어요?'", ["지울 방법을 함께 찾자며 내일 지점으로 찾아간다", "서명을 철회하는 확인서 양식을 만들어 보낸다", "선고 뒤라 달라질 게 없다고 솔직하게 말한다"]],
  ],
  reactionEffects: {
    c44_cap: [
      { trust: 9, legitimacy: 2, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -4, capital: -2, fatigue: 3 },
      { time: 4, capital: 4, trust: -3, humanCost: 3, fatigue: -4 },
    ],
    c44_verdict: [
      { trust: 10, humanCost: -3, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, capital: -3, time: -3, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, humanCost: 4, legitimacy: -3, fatigue: -3 },
    ],
    c44_petition: [
      { trust: 9, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 3, capital: -3, time: -4, fatigue: 3 },
      { time: 4, capital: 4, trust: 2, legitimacy: -4, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c44_cap: {
      voice: ["남색 모자 스무 명에게 사정을 말하고, 자리를 부탁한다.", "의뢰 기록을 캡처해, 재판부에 서면으로 알린다.", "들어갈 자리는 이미 있으니, 따지지 않고 넘어간다."],
      echo: ["사정을 들은 스무 명 중 일곱 명이 모자를 벗습니다. 나머지는 일당을 포기할 수 없다고 고개를 숙입니다.", "서면은 접수됩니다. 재판부가 그 종이를 읽는 건 선고가 끝난 뒤입니다.", "넘어가면 오늘은 조용합니다. 다음 재판에도 남색 모자는 옵니다."],
    },
    c44_verdict: {
      voice: ["캔커피를 받고, 그 말이 끝날 때까지 곁에 있는다.", "빈 칸에 대해 아는 것이 있으면, 검찰에 말해 달라고 한다.", "지금은 할 말이 없다며, 모임 사람들에게 돌아간다."],
      echo: ["곁에 있으면 윤서진은 캔을 다 비울 때까지 아버지 이야기를 합니다. 좋은 이야기가 더 많습니다.", "부탁을 들은 윤서진의 얼굴이 굳습니다. '저한테 아빠를 고발하라는 거예요?' 대답을 기다리지 않고 돌아섭니다.", "돌아가는 등 뒤에서 캔 따는 소리가 한 번 납니다. 두 번째 캔은 따지지 않은 채 자판기 위에 남습니다."],
    },
    c44_petition: {
      voice: ["지울 방법을 함께 찾자며, 내일 지점으로 찾아간다.", "서명을 철회하는 확인서 양식을 만들어 보낸다.", "선고 뒤라 달라질 게 없다고, 솔직하게 말한다."],
      echo: ["찾아가면 탁예린이 지점 뒷문에서 기다립니다. 같은 종이에 서명한 동료 두 명을 데리고 나옵니다.", "양식이 가면 서른한 명 중 열아홉 명이 철회서를 냅니다. 판결은 이미 나왔지만 기록은 남습니다.", "솔직한 말에 탁예린이 '그렇죠' 하고 웃습니다. 그 웃음이 전화를 끊을 때까지 이어지지 않습니다."],
    },
  },
  reactionMemos: {
    c44_cap_reaction: ["의뢰인: 그룹 계열사 행사 대행 홍보 회사", "스무 명 × 12만 원 = 240만 원"],
    c44_verdict_reaction: ["기쁜 것과 기쁜 게 싫은 것", "자판기 위의 따지 않은 캔"],
    c44_petition_reaction: ["한우 세트 뒷장의 서명", "지울 수 없으면 몰랐다는 기록이라도"],
  },
  branchPlan: ["c44_court", 1, "c44_branch_seal", "c44_branch_seal_follow"],
  branchScenes: {
    // CASE 44's detour is the paper the court is reading while you take notes.
    // The side door opens only for the one who writes the reasons down: the
    // pardon has a seal and no name, dated before the board even met.
    c44_branch_seal: {
      phase: "SIDE DOOR",
      title: "도장만 있는 용서",
      speaker: "반재욱",
      text: "받아 적는 당신 쪽으로 반재욱이 휴대폰을 기울입니다. 지난주 나은호 검사가 열람을 허락한 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류) 사본입니다. 문서 맨 아래 'KD은행 대표이사' 칸은 비어 있고, 그 옆에 법인 인감만 찍혀 있습니다. 날짜는 8월 28일, 이사회 안건이 정해지기 하루 전입니다. 반재욱이 수첩을 펼쳐 방금 적은 한 줄을 보여 줍니다. '회사가 용서했다. 누가 용서했는지는 없다.' 재판장은 지금 바로 그 서류를 근거로 읽는 중입니다.",
      memo: ["처벌불원서: 대표이사 서명란 비어 있음, 법인 인감만", "작성일 8월 28일 -- 이사회 안건 확정 전날", "반재욱 수첩: '누가 용서했는지는 없다'", "재판부는 이 서류를 양형 사유로 읽는 중"],
      triggers: ["injustice", "system", "curiosity"],
      choices: [
        { id: "c44_branch_seal_a", label: "문가을에게 먼저 사진을 보여 주고 뜻을 묻는다", effect: { trust: 11, humanCost: -4, legitimacy: 3, time: -4, capital: -2, fatigue: 5 }, next: "c44_branch_seal_follow", cognition: { reframing: 2 } },
        { id: "c44_branch_seal_b", label: "검사석에 쪽지를 넘겨 비어 있는 서명란을 알린다", effect: { legitimacy: 12, trust: 2, time: -4, humanCost: 1, fatigue: 4 }, next: "c44_branch_seal_follow", cognition: { inference: 2 } },
        { id: "c44_branch_seal_c", label: "지금은 선고부터 듣고 사진은 나중에 쓰기로 한다", effect: { time: 5, capital: 5, trust: -5, humanCost: 3, fatigue: -3 }, next: "c44_branch_seal_follow", cognition: { risk: 1 } },
      ],
    },
    c44_branch_seal_follow: {
      phase: "SIDE DOOR",
      title: "주문 3분 전",
      speaker: "나은호",
      text: "재판장이 마지막 장을 넘깁니다. 결론까지 3분. 검사석의 나은호가 뒤를 돌아 반재욱의 휴대폰을 한 번 보고, 다시 앞을 봅니다. 입 모양은 짧습니다. '늦었어요.' 선고 날에 새 자료를 낼 길은 없습니다. 쓸 수 있는 곳은 항소(1심 판결에 불복해 다시 재판해 달라고 하는 것)뿐이고, 기한은 선고일로부터 7일입니다. 방청석 맨 뒷줄에는 모자를 눌러쓴 젊은 여자가 앉아 있습니다. 윤상혁의 딸 윤서진입니다. 그가 이쪽 휴대폰 화면을 봤다는 걸, 당신은 압니다.",
      memo: ["선고 당일 추가 증거 제출 불가", "항소 기한: 선고일로부터 7일", "방청석 맨 뒷줄: 윤서진", "사진 원본은 나은호 검사의 열람 기록"],
      triggers: ["choice", "trust", "fear"],
      choices: [
        { id: "c44_branch_seal_follow_a", label: "결론이 나오는 순간 문가을 곁을 지키기로 한다", effect: { trust: 10, humanCost: -3, time: -4, capital: -2, fatigue: 4 }, next: "c44_verdict", cognition: { persistence: 2 } },
        { id: "c44_branch_seal_follow_b", label: "사진과 날짜를 정리해 7일 안의 항소 자료로 묶는다", effect: { legitimacy: 10, trust: 3, time: -5, fatigue: 4 }, next: "c44_verdict", cognition: { inference: 2 } },
        { id: "c44_branch_seal_follow_c", label: "사진을 서하린에게 넘겨 오늘 기사로 먼저 낸다", effect: { capital: 6, time: 4, legitimacy: -4, humanCost: 3, fatigue: -3 }, next: "c44_verdict", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c44_start",
    result: "c44_aftershock",
    defaultFree: "c44_route_system",
    // A verdict is read once and the room cannot change it. Like 사건 12 the case
    // is a single line; the split is what the people in the gallery do with it.
    choices: {},
    system: {
      route: "c44_route_system",
      final: "c44_final_system_route",
      title: "용서의 통계",
      speaker: "이민서",
      text: "준비된 보기 밖의 문장을 쓰자, 이민서가 헌책방 테이블 위 노트북에 공개 판결문 검색 결과를 띄웁니다. 지난 10년, 금융회사 임원의 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 1심 판결 64건. 집행유예(유죄지만 형을 당장 살게 하지 않고 미뤄 두는 것)가 49건입니다. 그중 41건에 피해자인 회사가 낸 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류)가 있었습니다. 그 처벌불원서에 이사회 결의가 붙어 있던 경우는 두 건뿐입니다. 이민서가 화면을 돌립니다. '회사가 용서하면 사람은 집에 가요. 그런데 회사 안에서 누가 용서하기로 했는지는, 거의 아무 데도 안 적혀 있어요.'",
      memo: ["금융회사 임원 배임 1심 64건 중 집행유예 49건", "그중 회사 명의 처벌불원서 41건", "이사회 결의가 붙은 처벌불원서 2건"],
      routeChoices: [
        ["c44_route_system_publish", "통계를 서하린과 모임에 동시에 공개한다", { legitimacy: 12, trust: 5, capital: -5, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c44_route_system_rule", "처벌불원서에 이사회 결의와 실명 서명을 요구하는 제도안을 낸다", { legitimacy: 10, trust: 6, time: -9, humanCost: 2, fatigue: 6 }, { reframing: 2 }],
        ["c44_route_system_drop", "통계는 덮어 두고 선고만 기다린다", { time: 7, capital: 6, trust: -6, legitimacy: -8, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "회사가 용서할 때 피해를 떠안은 직원들의 동의를 거치게 하자고 제안한다", { legitimacy: 12, trust: 8, capital: -7, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "제도는 그대로 두고 이번 판결만 받아들인다", { capital: 8, time: 6, trust: -5, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "빈 서명란 때문에 무죄가 된 네 건을 따로 다시 고발한다", { legitimacy: 9, trust: 10, capital: -6, time: -6, humanCost: 2, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c44_evidence_turn",
    result: "c44_aftershock",
    sourceRoutes: ["c44_lottery", "c44_court", "c44_lunch", "c44_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 판결문의 '피해가 상당 부분 회복된 점' 옆에 놓고, 그 회복이 장부에서 누구 이름으로 적혔는지 맞춰 본다.",
    entryEcho: "단서를 대면 누가 갚았는지와 누가 갚았다고 적혔는지가 갈라집니다. 둘 사이의 거리가 25억보다 멉니다.",
    title: "갚은 사람의 이름",
    speaker: "반재욱",
    text: "단서를 맞추자 KD은행 회계 원장(돈의 모든 드나듦을 적은 기본 장부)의 한 줄이 열립니다. 300억 자율 배상안 가운데 210억, 직원 성과급을 깎아 만든 바로 그 돈이 8월 28일 자로 계정을 옮겨 '윤상혁 건 피해 회복 충당'이라는 이름을 달았습니다. 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류)가 만들어진 날입니다. 직원들이 낸 돈이 서류 위에서는 윤상혁이 갚은 돈이 된 겁니다. 반재욱이 47명의 이름이 적힌 수첩의 맨 뒷장을 폅니다. '가져간 사람은 25억을 추징당하고, 갚은 건 직원들인데, 판결문에는 그 사람이 갚았다고 적혔습니다. 이 한 줄은 제가 적겠습니다.'",
    memo: ["210억: 직원 성과급 삭감분", "8월 28일 계정 이름 변경: '윤상혁 건 피해 회복 충당'", "판결문 양형 사유: '피해가 상당 부분 회복'"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 7, trust: 2, time: -2, capital: -3, fatigue: 4 },
    choices: [
      ["c44_evidence_turn_submit", "원장 사본을 항소 자료로 검찰에 정식 제출한다", { legitimacy: 14, trust: 5, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c44_evidence_turn_hold", "원장은 쥐고 있다가 그룹과의 배상 협상 카드로 쓴다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c44_evidence_turn_share", "성과급이 깎인 직원들에게 이 한 줄부터 알린다", { trust: 13, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c44_branch_seal",
    systemNext: "c44_route_system",
    evidenceNext: "c44_evidence_turn",
    routeLabel: "직전 사건의 사외이사 표 계산표로 방청석 자리를 나눈다",
    systemLabel: "직전 자유응답 문장이 그룹 입장문에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 배상금이 장부에서 누구 이름이 됐는지 연다",
  },
  openingRoutes: {
    c43_after_warm: "c44_start_warm",
    c43_after_record: "c44_start_record",
    c43_after_rush: "c44_start_rush",
  },
  openingCopy: {
    c44_start_warm: ["로비에 남은 사람의 선고 전날", "도윤하", "해임안(이사를 자리에서 물러나게 하는 안건)이 5대 3으로 가결된 날, 로비 불이 꺼질 때까지 1주 모임 사람들, 그리고 아버지를 기다리던 윤서진과 같은 소파에 있었습니다. 그 사람들이 이틀 뒤 헌책방 1층에 다시 모입니다. 내일은 해온파트너스 자문료(조언해 준 값이라며 주고받은 돈) 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 사건의 1심 선고입니다. 도윤하가 오늘 오후에 들어온 소식을 읽습니다. 윤상혁 쪽이 KD은행 명의의 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류)와 직원 1,204명의 탄원서를 냈습니다. '그 로비에 있던 사람 중에 이 종이에 서명한 사람은 없어요. 그런데 1,204명이래요.'", ["로비의 1주 모임 전원, 선고 방청 신청", "KD은행 명의 처벌불원서 제출", "탄원서 1,204장 -- 서명자 명단 미공개"]],
    c44_start_record: ["서한을 보낸 사람의 선고 전날", "반재욱", "결의문 마지막 줄의 원문을 공개하라는 주주 서한에 그룹이 답을 보내왔습니다. 첨부된 결의문 초안 파일의 작성일은 8월 28일. 반재욱이 그 날짜를 오늘 법원에 들어온 서류 옆에 놓습니다. 날짜가 같습니다. KD은행이 해온파트너스 자문료(조언값이라며 주고받은 돈) 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 사건 재판부에 낼 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류)를 만든 날입니다. 이사회 안건이 정해지기 하루 전이죠. 선고는 내일 오전 10시입니다. 반재욱이 기록을 덮지 않습니다. '회사가 용서하기로 정한 회의는 어디에도 없습니다. 회의보다 용서가 먼저 나왔어요.'", ["결의문 초안 작성일과 처벌불원서 작성일 일치: 8월 28일", "처벌불원서를 정한 회의 기록 없음", "선고 내일 오전 10시"]],
    c44_start_rush: ["먼저 달려간 사람의 선고 전날", "오진우", "해임된 윤상혁과 같은 엘리베이터를 탔습니다. 스물아홉 층 동안 둘 다 말이 없었고, 1층에서 문이 열릴 때 그가 한마디만 했습니다. '선고 날 보세.' 그 뒤 이틀 동안 법원 민원실을 오갔고, 그래서 오늘 오후 서류가 들어오는 걸 가장 먼저 봤습니다. KD은행 명의의 처벌불원서(피해자가 처벌을 원하지 않는다고 법원에 내는 서류), 그리고 탄원서 1,204장. 내일 오전 10시가 해온파트너스 자문료(조언해 준 값이라며 주고받은 돈) 배임(맡은 일을 저버려 회사에 손해를 끼친 죄) 사건의 1심 선고입니다. 오진우가 민원실 의자에서 일어섭니다. '빨리 와서 빨리 봤습니다. 막을 시간은 없고요.'", ["엘리베이터 29층 -- 윤상혁: '선고 날 보세'", "처벌불원서·탄원서 접수 장면 직접 확인", "헌책방 동료들은 소식을 아직 모름"]],
  },
  openingSignatures: {
    c44_start_warm: {
      label: "로비의 사람들과 함께 방청권 줄에 밤새 선다",
      effect: { trust: 12, humanCost: -4, capital: -5, time: -4, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "로비의 사람들과 함께, 방청권 줄에 밤새 선다.",
      echo: "밤새 서면 줄 맨 앞은 우리 차지가 됩니다. 새벽 세 시, 강태민이 보온병을 한 바퀴 돌립니다.",
    },
    c44_start_record: {
      label: "8월 28일이라는 날짜를 표로 만들어 검찰에 보낸다",
      effect: { legitimacy: 11, trust: 2, capital: -4, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "8월 28일이라는 날짜를, 표로 만들어 검찰에 보낸다.",
      echo: "표는 도착합니다. 나은호 검사의 답장은 두 글자입니다. '늦음.' 그래도 표는 기록에 남습니다.",
    },
    c44_start_rush: {
      label: "민원실에서 본 서류 목록을 모임에 곧바로 알린다",
      effect: { trust: 8, legitimacy: 6, humanCost: 3, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "민원실에서 본 서류 목록을, 모임에 곧바로 알린다.",
      echo: "알리면 모임 단체방이 밤새 울립니다. 문가을은 '떡은 몇 개 쪄 가요?'라고만 묻습니다.",
    },
  },
  voiceLines: {
    // CASE 44. A verdict day. Nobody in the gallery can change what is read, so
    // every line is about where to stand while it is read.
    c44_start_seats: "사람이 먼저 앉아야 한다며, 모임 사람들의 방청석 자리부터 챙긴다.",
    c44_start_brief: "처벌불원서를 반박할 의견서를, 밤새 써서 검찰에 보낸다.",
    c44_start_trace: "선고는 기자들에게 맡기고, 빼돌린 돈의 행방부터 쫓는다.",
    c44_lottery_give: "당첨된 우리 방청권을, 모임 사람들에게 먼저 넘긴다.",
    c44_lottery_report: "대리 줄서기 문자를 법원 경위에게 알리고, 확인을 요청한다.",
    c44_lottery_press: "기자석 옆자리를 얻어 먼저 들어가, 기록부터 챙긴다.",
    c44_court_hold: "문가을의 손을 잡고, 곁에 앉아 끝까지 듣는다.",
    c44_court_note: "양형 사유를 한 줄씩 받아 적어, 다음 재판 자료로 남긴다.",
    c44_court_leave: "문가을과 함께 먼저 나가, 기자들 앞에 선다.",
    c44_branch_seal_a: "문가을에게 먼저 사진을 보여 주고, 뜻을 묻는다.",
    c44_branch_seal_b: "검사석에 쪽지를 넘겨, 비어 있는 서명란을 알린다.",
    c44_branch_seal_c: "지금은 선고부터 듣고, 사진은 나중에 쓰기로 한다.",
    c44_branch_seal_follow_a: "결론이 나오는 순간, 문가을 곁을 지키기로 한다.",
    c44_branch_seal_follow_b: "사진과 날짜를 정리해, 7일 안의 항소 자료로 묶는다.",
    c44_branch_seal_follow_c: "사진을 서하린에게 넘겨, 오늘 기사로 먼저 낸다.",
    c44_lunch_ask: "모임 사람들의 뜻부터 모아, 항소를 요청하는 편지로 만든다.",
    c44_lunch_state: "열두 번의 날짜를 아는 증인으로, 진술서를 쓰겠다고 한다.",
    c44_lunch_money: "항소보다, 추징금이 피해자에게 가는 길부터 찾자고 한다.",
    c44_final_mic: "마이크를 모임 사람들에게 넘기고, 문가을 뒤에 선다.",
    c44_final_appeal: "모임 이름으로, 항소를 요청하는 피해자 의견서를 검찰에 낸다.",
    c44_final_fund: "추징금이 배상에 쓰이도록, 그룹과 바로 협상하겠다고 밝힌다.",
    c44_after_warm: "남은 떡을 싸 들고, 모두 함께 임경수에게 간다.",
    c44_after_record: "판결문 전문을 받아, 모임용 쉬운 해설본부터 쓴다.",
    c44_after_rush: "곧장 검찰청으로 가서, 나은호와 항소 이유를 짠다.",
    c44_route_system_publish: "통계를, 서하린과 모임에 동시에 공개한다.",
    c44_route_system_rule: "처벌불원서에 이사회 결의와 실명 서명을 요구하는, 제도안을 낸다.",
    c44_route_system_drop: "통계는 덮어 두고, 선고만 기다린다.",
    c44_final_system_route_a: "회사가 용서할 때, 피해를 떠안은 직원들의 동의를 거치게 하자고 제안한다.",
    c44_final_system_route_b: "제도는 그대로 두고, 이번 판결만 받아들인다.",
    c44_final_system_route_c: "빈 서명란 때문에 무죄가 된 네 건을, 따로 다시 고발한다.",
    c44_evidence_turn_submit: "원장 사본을, 항소 자료로 검찰에 정식 제출한다.",
    c44_evidence_turn_hold: "원장은 쥐고 있다가, 그룹과의 배상 협상 카드로 쓴다.",
    c44_evidence_turn_share: "성과급이 깎인 직원들에게, 이 한 줄부터 알린다.",
  },
  echoReplies: {
    // CASE 44.
    c44_start_seats: "자리를 챙기면 모임 서른여덟 명이 새벽 네 시에 모입니다. 의견서는 아무도 쓰지 않은 채 밤이 지나갑니다.",
    c44_start_brief: "의견서는 새벽 세 시에 도착합니다. 선고 전날 밤에 온 종이를 재판부가 읽을 시간은 없습니다. 검찰 기록에는 남습니다.",
    c44_start_trace: "돈을 쫓으면 해온 자문료의 남은 조각이 싱가포르 계좌로 이어진 흔적이 한 줄 더 보입니다. 내일 방청석에는 당신 자리가 없습니다.",
    c44_lottery_give: "넘기면 문가을이 방청권을 쥐고 한참 봅니다. 당신은 복도 모니터 앞에서 선고를 듣게 됩니다.",
    c44_lottery_report: "경위가 확인하는 동안 추첨이 20분 늦어집니다. 남색 모자 여덟 명이 줄에서 빠지고, 뒤에 선 어르신들이 다리를 두드립니다.",
    c44_lottery_press: "기자석 옆은 잘 들립니다. 뒤를 돌아보면 문가을이 서 있어야 할 자리에 남색 모자가 앉아 있습니다.",
    c44_court_hold: "손을 잡으면 문가을이 자리에 다시 앉습니다. 그 손이 43분 동안 한 번도 풀리지 않습니다.",
    c44_court_note: "받아 적은 양형 사유는 열한 줄입니다. 그중 세 줄이 같은 300억을 가리킵니다.",
    c44_court_leave: "먼저 나가면 카메라가 문가을의 떨리는 얼굴을 잡습니다. 선고의 결론은 복도 스피커로 듣습니다.",
    c44_branch_seal_a: "사진을 본 문가을이 한참 있다가 말합니다. '도장은 사람이 찍잖아요. 그 사람 이름을 알고 싶어요.'",
    c44_branch_seal_b: "쪽지가 검사석에 닿습니다. 나은호는 읽고, 접어서 서류철 맨 앞에 끼웁니다.",
    c44_branch_seal_c: "사진은 휴대폰에 남습니다. 재판장이 그 서류를 읽는 3분 동안, 당신은 알면서 아무것도 하지 않습니다.",
    c44_branch_seal_follow_a: "곁을 지키면 결론이 나오는 순간 문가을이 당신 소매를 붙잡습니다. 사진은 주머니에 그대로 있습니다.",
    c44_branch_seal_follow_b: "묶어 둔 자료는 7일짜리 시계가 됩니다. 첫날이 오늘입니다.",
    c44_branch_seal_follow_c: "기사는 오후 세 시에 나갑니다. 제목의 '빈 칸' 두 글자가 그룹 홍보실을 한 시간 앞당겨 움직이게 합니다.",
    c44_lunch_ask: "편지를 모으면 서른여덟 명이 순댓국 옆에서 한 줄씩 씁니다. 문가을의 줄이 제일 짧습니다. '끝까지.'",
    c44_lunch_state: "진술서를 쓰겠다고 하면 나은호가 처음으로 수저를 내려놓습니다. '그럼 당신도 증인으로 법정에 서요. 저쪽 변호인 여덟 명이 당신의 3년을 전부 물을 거예요.'",
    c44_lunch_money: "돈부터 찾으면 문가을이 고개를 끄덕입니다. 나은호는 '그건 제 일이 아니네요' 하고 순댓국만 비우고 갑니다.",
    c44_final_mic: "마이크를 넘기면 문가을 뒤로 모임 사람 서른여덟 명이 줄을 섭니다. 저녁 뉴스에 당신 얼굴은 나오지 않습니다.",
    c44_final_appeal: "의견서는 그날 밤 접수됩니다. 항소할지는 검찰이 정하고, 7일 동안 모임 단체방은 매일 같은 질문으로 시작합니다.",
    c44_final_fund: "협상하겠다고 하면 그룹 홍보실이 한 시간 만에 연락해 옵니다. 너무 빠른 연락이라 반재욱이 수첩에 시간을 적습니다.",
    c44_after_warm: "떡을 싸 들고 가면 병실 창가에 열한 명이 섭니다. 임경수가 눈을 뜨고 떡 냄새부터 알아봅니다.",
    c44_after_record: "해설본은 새벽 두 시에 끝납니다. 첫 문장은 '빈칸은 무죄가 아닙니다'입니다. 병원에는 아침에 갑니다.",
    c44_after_rush: "검찰청 불은 밤 열한 시까지 켜져 있습니다. 항소 이유서의 뼈대가 섭니다. 임소율의 부재중 전화가 두 통 쌓입니다.",
    c44_route_system_publish: "공개하면 서하린의 기사에 '64건 중 49건'이 제목으로 걸립니다. 선고 전날 밤이라 판사도 그 제목을 봅니다.",
    c44_route_system_rule: "제도안은 국회 차지원 보좌관에게 먼저 갑니다. '7분 안에 설명되네요.' 그가 처음으로 초를 세지 않습니다.",
    c44_route_system_drop: "통계를 덮으면 내일은 조용한 선고가 됩니다. 64건은 65건이 됩니다.",
    c44_final_system_route_a: "직원 동의를 거치게 하면 회사의 용서가 느려집니다. 느려진 용서는, 처음으로 누구의 것인지 드러납니다.",
    c44_final_system_route_b: "받아들이면 판결은 확정을 향해 갑니다. 성과급을 깎인 1만 2천 명은 판결문의 어디에도 없습니다.",
    c44_final_system_route_c: "다시 고발하면 비어 있던 네 칸이 수사 대상이 됩니다. 누가 비워 두었는지 묻는 데 몇 달이 걸립니다.",
    c44_evidence_turn_submit: "제출하면 원장 한 줄이 항소 이유서의 첫 쪽에 들어갑니다. 그룹 법무팀은 그날 밤 계정 이름을 다시 바꿉니다. 이미 늦었습니다.",
    c44_evidence_turn_hold: "쥐고 있으면 협상 테이블에서 그룹의 목소리가 낮아집니다. 직원들은 그 한 줄을 모른 채 다음 달 급여 명세서를 받습니다.",
    c44_evidence_turn_share: "알리면 사내 게시판에 캡처가 퍼집니다. 댓글 1,300개 중 첫 번째는 '내 성과급이 저 사람 이름으로 갚아졌다고?'입니다.",
  },
  characterProfiles: {
    서지호: {
      role: "줄서기 대행 아르바이트 · 전 플로우온 풀필먼트센터 야간조",
      stance: "생계 · 부끄러움 · 의리",
      job: "재판정 밖에 세워 둘 사람을 사는 값이 얼마인지 보여 준다. 누구 재판인지 모르고 줄을 선 사람이 누구의 줄에 서 있었는지 알게 된다.",
      appearance: "남색 대행사 모자, 무릎 나온 트레이닝 바지, 야간조 시절 받은 손목 보호대를 아직 찬다.",
      thought: "반장님 앞에서는 창피하다. 그래도 월세는 월세다.",
      gesture: "곤란하면 모자챙을 두 번 만지고 고개를 숙인다.",
      voice: "말끝을 흐리다가 숫자를 말할 때만 또렷해진다.",
      line: "반장님, 저 이거 당첨되면 5만 원 더 받아요.",
    },
    이하경: {
      role: "서울중앙지방법원 형사합의부 재판장",
      stance: "절차 · 균형 · 문장",
      job: "43분 동안 판결을 읽는다. 유죄를 말하고, '다만'으로 무게를 옮긴다. 법이 저울에 올리라고 한 것은 전부 올린다.",
      appearance: "자꾸 흘러내리는 은테 안경, 판결문 모서리마다 붙인 노란 메모지.",
      thought: "법정은 억울함을 재는 곳이 아니라, 법이 정한 저울에 올라온 것만 재는 곳이다.",
      gesture: "문단이 바뀔 때마다 안경을 밀어 올린다. 문하준의 집계로 열네 번.",
      voice: "높낮이 없이 또박또박 읽고, 숫자에서만 한 박자 쉰다.",
      line: "다만, 피해자가 처벌을 원하지 않는 점은 피고인에게 유리한 정상으로 참작한다.",
    },
  },
  setting: { place: "회기동 헌책방 1층 · 책장 사이 테이블", clock: "9월 9일 · 선고 D-1 · 22:10" },
  sceneContext: {
    c44_start: {
      place: "회기동 헌책방 1층 · 책장 사이 테이블",
      clock: "9월 9일 · 선고 D-1 · 22:10",
      question: "선고 전날 밤, 피해자인 회사가 가해자를 용서한다는 서류가 들어왔습니다. 무엇부터 하겠습니까?",
      lead: "해임안(이사를 자리에서 물러나게 하는 안건)이 5대 3으로 가결되고 이틀, 헌책방 1층에는 선고 전날 밤의 불이 늦게까지 켜져 있습니다.",
    },
    c44_start_warm: {
      place: "회기동 헌책방 1층 · 책장 사이 테이블",
      clock: "9월 9일 · 선고 D-1 · 22:10",
      question: "로비에서 함께 버틴 사람 중 누구도 서명하지 않았는데 탄원서는 1,204장입니다. 무엇부터 하겠습니까?",
      lead: "이사회 날 로비 소파를 함께 지킨 얼굴들이 그대로 책장 사이에 앉아 있습니다.",
    },
    c44_start_record: {
      place: "회기동 헌책방 1층 · 책장 사이 테이블",
      clock: "9월 9일 · 선고 D-1 · 22:10",
      question: "용서를 정한 회의가 없는데 용서의 날짜는 있습니다. 이 날짜를 어떻게 쓰겠습니까?",
      lead: "주주 서한의 답장에 붙은 결의문 초안을 넘기다가, 반재욱이 작성일 칸에서 손을 멈춥니다.",
    },
    c44_start_rush: {
      place: "서울중앙지방법원 · 민원실 대기실",
      clock: "9월 9일 · 선고 D-1 · 17:40",
      question: "서류가 들어오는 걸 가장 먼저 봤지만 막을 시간은 없습니다. 본 것을 누구에게 먼저 가져가겠습니까?",
      lead: "이틀째 같은 민원실 의자에 앉아 있다가, 접수 창구로 들어가는 서류 봉투 두 개를 봤습니다.",
    },
    c44_lottery: {
      place: "서울중앙지방법원 · 동관 앞 도로",
      clock: "9월 10일 · 새벽 04:30",
      question: "방청권 줄 가운데 일당을 받고 선 스무 명이 있습니다. 이 줄을 어떻게 하겠습니까?",
      lead: "새벽 공기가 벌써 9월답게 서늘합니다. 줄 맨 앞에서 강태민이 보온병을 흔들어 보입니다.",
    },
    c44_cap: {
      place: "서울중앙지방법원 · 동관 앞 도로",
      clock: "9월 10일 · 새벽 05:10",
      question: "남색 모자 속 얼굴이 로봇에게 자리를 내준 야간조였습니다. 그의 5만 원을 어떻게 하겠습니까?",
    },
    c44_cap_reaction: {
      place: "서울중앙지방법원 · 동관 로비",
      clock: "9월 10일 · 07:50",
      question: "피해자 가족 스무 명을 밖에 세워 두는 값이 240만 원이었습니다. 그 값을 어떻게 치르게 하겠습니까?",
    },
    c44_court: {
      place: "서울중앙지방법원 · 417호 법정",
      clock: "9월 10일 · 10:31 · 판결 낭독 31분째",
      question: "직원들이 낸 300억이 가해자의 감형 사유로 읽히고 있습니다. 일어서려는 문가을 곁에서 어떻게 하겠습니까?",
      lead: "방청석 102석이 꽉 찼고, 권도현의 손가락은 벌써 아홉 번 접혔습니다.",
    },
    c44_branch_seal: {
      place: "서울중앙지방법원 · 417호 법정 방청석",
      clock: "9월 10일 · 10:36",
      question: "용서한다는 서류에 사람 이름이 없습니다. 재판장이 그 서류를 읽는 지금, 어떻게 하겠습니까?",
    },
    c44_branch_seal_follow: {
      place: "서울중앙지방법원 · 417호 법정 방청석",
      clock: "9월 10일 · 10:40 · 결론 3분 전",
      question: "선고 날에는 새 자료를 낼 수 없고, 맨 뒷줄에서 윤서진이 보고 있습니다. 남은 3분을 어떻게 쓰겠습니까?",
    },
    c44_verdict: {
      place: "서울중앙지방법원 · 417호 법정",
      clock: "9월 10일 · 10:43",
      question: "빈 서명란 네 칸이 무죄가 됐고, 윤상혁은 걸어서 나갑니다. 선고 직후 어디에 서겠습니까?",
    },
    c44_verdict_reaction: {
      place: "서울중앙지방법원 · 4층 복도",
      clock: "9월 10일 · 10:55",
      question: "아버지가 집에 오는 게 기쁘고, 그게 기쁜 자신이 싫다는 사람이 캔커피를 내밉니다. 어떻게 하겠습니까?",
    },
    c44_lunch: {
      place: "서초동 법원 뒷골목 · 순댓국집",
      clock: "9월 10일 · 12:20",
      question: "검사가 항소할 이유를 달라며 순댓국 앞에 앉았습니다. 무엇을 내놓겠습니까?",
      lead: "선고가 끝나고 한 시간, 열한 명이 아무 말 없이 걷다가 김이 나는 가게 앞에서 동시에 멈췄습니다.",
    },
    c44_petition: {
      place: "서초동 법원 뒷골목 · 카페 창가 자리",
      clock: "9월 10일 · 14:10",
      question: "성과급을 깎인 사람들이 선물 세트를 고르다 선처 탄원에 서명했습니다. 이 목록을 어떻게 하겠습니까?",
    },
    c44_petition_reaction: {
      place: "KD은행 강서지점 · 셔터 내려가는 객장",
      clock: "9월 10일 · 16:05",
      question: "지울 수 없으면 몰랐다는 것만이라도 적어 달라는 부탁입니다. 어떻게 답하겠습니까?",
    },
    c44_route_system: {
      place: "회기동 헌책방 1층 · 책장 앞 노트북",
      clock: "9월 9일 · 선고 D-1 · 23:40",
      question: "회사가 용서한 41건 중 누가 용서했는지 적힌 건 두 건뿐입니다. 이 통계를 어떻게 하겠습니까?",
    },
    c44_final_system_route: {
      place: "회기동 헌책방 1층 · 책장 앞 노트북",
      clock: "9월 10일 · 새벽 02:15",
      question: "회사가 누군가를 용서하는 방식을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c44_evidence_turn: {
      place: "서울중앙지검 · 자료실",
      clock: "9월 10일 · 16:30",
      question: "직원들이 낸 210억이 장부에서 가해자가 갚은 돈으로 이름을 바꿨습니다. 이 한 줄을 어떻게 쓰겠습니까?",
    },
    c44_final: {
      place: "서울중앙지방법원 · 정문 앞 도로",
      clock: "9월 10일 · 17:20",
      question: "끝났다는 말은 우리가 하겠다는 문가을 뒤로 카메라 열일곱 대가 당신을 봅니다. 다음 문장을 무엇으로 하겠습니까?",
      lead: "해가 기울어 법원 정문 그림자가 길어졌습니다. 문가을이 남은 떡 두 개를 재킷 주머니에 넣습니다.",
    },
    c44_aftershock: {
      place: "망원시장 가을떡방 · 셔터 반쯤 내린 가게",
      clock: "9월 10일 · 22:00",
      question: "선고 날 밤 떡집에 모였는데 임경수의 숨이 차다는 전화가 옵니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c44-blank-pardon",
    title: "도장만 있는 용서",
    text: "KD은행의 처벌불원서에는 대표이사 서명 없이 법인 인감만 있었고, 같은 날 직원 성과급 210억이 장부에서 '윤상혁 건 피해 회복'으로 이름을 바꿨습니다.",
  },
  outcomes: {
    c44_after_warm: { tag: "곁에 간 결말", title: "선고 날 남은 떡을 들고 임경수의 병실로 갔다", text: "열한 명이 병실 창가에 섰습니다. 임경수는 판결 이야기 대신 떡이 덜 쪄졌다는 말부터 했습니다." },
    c44_after_record: { tag: "풀어 쓴 결말", title: "판결문을 모임이 읽을 수 있는 말로 옮겼다", text: "'빈칸은 무죄가 아닙니다'로 시작하는 해설본이 모임 단체방에 올라갔습니다. 서른여덟 명이 끝까지 읽었습니다." },
    c44_after_rush: { tag: "먼저 달려간 결말", title: "선고 날 밤 검찰청에서 항소 이유를 짰다", text: "7일짜리 시계의 첫날 밤을 검찰청에서 보냈습니다. 휴대폰에는 임소율의 부재중 전화가 남았습니다." },
  },
  carryovers: {
    c44_after_warm: { trust: 9, humanCost: -4, fatigue: -7 },
    c44_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c44_after_rush: { capital: 7, legitimacy: 4, trust: -7 },
  },
  continuityChallenges: {
    c43_after_warm: { id: "protect-trust", title: "로비의 사람들과 같이 법정에 들어가기", text: "이사회 날 로비를 함께 지킨 사람들이 그대로 모였습니다. 방청석에 혼자가 아니라 그들과 함께 앉는 선택을 찾아야 보너스가 열립니다." },
    c43_after_record: { id: "use-reframe", title: "결의문의 날짜를 선고의 언어로 바꾸기", text: "주주 서한으로 받아 낸 결의문 초안의 날짜가 처벌불원서의 날짜와 겹칩니다. 그 날짜가 법정에서 무엇을 뜻하는지 판을 다시 짜야 합니다." },
    c43_after_rush: { id: "repair-legitimacy", title: "먼저 올라탄 이틀의 공정함 회복하기", text: "엘리베이터에서 들은 말과 민원실에서 혼자 본 서류는 아직 아무도 모릅니다. 본 것을 절차 안으로 옮기는 선택을 찾아야 합니다." },
  },
};
