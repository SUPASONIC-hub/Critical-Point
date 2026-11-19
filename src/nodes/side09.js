/**
 * 번외 9 -- 92일 (N11: one side case a month, outside the ranking).
 *
 * Thursday 13 August 2026 to the Friday, the day before 광복절: after 사건 40
 * opens (the Saturday after the broadcast, 8월 8일) and before its third week
 * (8월 17일), a fortnight before 사건 41's hearing. The analyst sits in
 * KD캐피탈's 위험관리부 under 채이안, as 사건 41 finds them, and the
 * department reads the wording of 고객채권부's monthly 「유족 배려 안내」: 87
 * letters that tell a dead customer's family, for the first time, what he
 * owed. The rule, written in March 2024 by 상속채권파트장 위성규, sends them
 * "92 days after the death" -- the longest any three months can be -- "so as
 * not to press a grieving family". Three months is the time a family has to
 * tell a court it takes on only what the estate holds (한정승인) or nothing
 * (상속포기). Since the rule the department's collection rate on inherited
 * debt has gone from 41% to 68%.
 *
 * One of the 87 still has a day: 국진호, 61, who drove a one-ton refrigerated
 * truck out of 인천 연안부두 and died at the wheel on 5월 14일 (목). He owes
 * KD캐피탈 6,370만 원 (3,960만 left on the truck, 2,410만 of working-capital
 * loan); he leaves the truck (1,800만) and 410만 in the bank. His three months
 * end on 8월 14일 (금), and the list closes at 18:00 that day.
 *
 * Speakers: 채이안 (existing) and one new: 아이굴 세리코바, his wife, 57, from
 * Almaty, 21 years in Korea, a permanent resident who kept her name. She
 * answers in Korean (said once, in the narration, as docs/canon.md's
 * people-from-abroad rules ask); a photograph, docs/portrait-credits.md. Her
 * name is spelled one way on her residence card and another (「세리꼬바」) on
 * the family register of 2005. 위성규 (the rule's author, the case's wrong
 * side) speaks only in the narration, as 번외 6's 기성철 and 번외 8's
 * 설경민; their daughter 국하늘 (20) does not speak.
 *
 * Money in the story is in 원, as every case writes it (docs/writing-a-case.md
 * 18장): 6,370만 = 3,960만 + 2,410만; the estate 2,210만 = 1,800만 + 410만;
 * if the three months pass, the wife's share 3,822만 (3/5) and the
 * daughter's 2,548만 (2/5).
 *
 * The endings are the first line of the 86 letters left once her claim is in:
 * the way out written on top (the department's name on the change), the
 * rule's numbers sent to audit (the letters go as they are; the rule changes
 * three months later), or 「상속 채무 이행 안내」 left as it is. In each, her
 * claim of 8월 14일 16시 52분 stands. None touches 사건 40's score or 41's hearing.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): ten
 * scenes, `s9_aftershock`'s three cards to `s9_result`, three `outcomes`.
 */
export const side09 = {
  id: "side09",
  label: "번외 9",
  title: "92일",
  startNode: "s9_start",
  // A table from the August of 사건 40-41, not this device's season.
  startState: {
    resources: { time: 46, capital: 50, trust: 48, legitimacy: 50, humanCost: 28, fatigue: 40 },
  },
  nodes: {
    s9_start: {
      phase: "SIDE 09 BRIEFING",
      title: "92일",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "8월 13일 (목) 16:10, 명단 마감 하루 전",
      lead: "광복절을 이틀 앞둔 목요일 오후. 위험관리부 책상에 화요일에 나갈 우편물 견본이 한 묶음 놓입니다.",
      text: "채이안이 귀에서 연필을 빼 견본 첫 장을 넘깁니다. 고객채권부의 「유족 배려 안내」 87통. 돌아가신 고객의 빚을 가족에게 처음 알리는 편지입니다. 첫 줄은 「상속 채무 이행 안내」, 그 아래 갚을 금액과 9월 30일 납부 기한. '위험관리부는 문구만 보면 된대요.' 그가 양식 맨 아래 작은 글씨를 짚습니다. 「발송 대상: 사망일로부터 92일이 된 고객. 명단 마감 8월 14일 18시, 발송 8월 18일 (화).」 '왜 하필 92일인지 알아요? 석 달 가운데 가장 긴 석 달이 92일이에요.'",
      question: "87통의 첫 줄을 검토해야 합니다. 무엇부터 보겠습니까?",
      memo: ["유족 배려 안내 87통, 8월 18일 (화) 발송", "발송 대상: 사망일로부터 92일이 된 고객", "첫 줄: '상속 채무 이행 안내', 납부 기한 9월 30일"],
      triggers: ["responsibility", "curiosity", "system"],
      choices: [
        { id: "s9_start_rule", label: "92일 기준이 생긴 문서부터 찾는다", effect: { legitimacy: 6, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s9_rule" },
        { id: "s9_start_dates", label: "87명의 사망일을 한 줄씩 대조한다", effect: { legitimacy: 4, trust: 2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s9_rule" },
        { id: "s9_start_list", label: "문구만 보고 명단은 담당 부서에 묻는다", effect: { time: 3, legitimacy: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s9_list" },
      ],
    },
    s9_rule: {
      phase: "SIDE 09 RULE",
      title: "유족 배려",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 고객채권부",
      clock: "17:20",
      text: "고객채권부 문서함에 2024년 3월의 기준 개정안이 있습니다. 작성자는 상속채권파트장 위성규. 「장례 직후의 독촉은 유족에게 상처가 됨. 통지는 상속이 확정된 뒤로.」 다음 장은 상속 채권 회수율입니다. 개정 전 41%, 개정 뒤 68%. 채이안이 말합니다. '가족이 물려받은 재산만큼만 갚겠다(한정승인)거나 아예 안 받겠다(상속포기)고 법원에 낼 수 있는 기간이 석 달이에요.' 그가 연필로 92를 두 번 긋습니다. '편지가 그 뒤에 가면, 그런 길이 있었는지도 모르죠.' 위성규의 단체 메시지가 뜹니다. 「유족 안내 87통 화요일 발송 ^^ 올해도 민원 0건 가 봅시다!」",
      question: "'배려'라는 기준이 석 달을 비켜 갑니다. 어떻게 하겠습니까?",
      memo: ["2024년 3월 개정, 작성자 상속채권파트장 위성규", "상속 채권 회수율 41% → 68%", "한정승인·상속포기: 사망을 안 날부터 석 달"],
      triggers: ["system", "injustice", "curiosity"],
      choices: [
        { id: "s9_rule_print", label: "개정안과 회수율 표를 함께 출력한다", effect: { legitimacy: 8, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_list" },
        { id: "s9_rule_ask", label: "위성규에게 92라는 숫자의 이유를 묻는다", effect: { legitimacy: 5, trust: -1, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s9_list" },
        { id: "s9_rule_skip", label: "기준은 고객채권부 일이라며 덮는다", effect: { time: 3, trust: -2, legitimacy: -3 }, cognition: { risk: 1 }, next: "s9_list" },
      ],
    },
    s9_list: {
      phase: "SIDE 09 LIST",
      title: "하루 남은 이름",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "18:40",
      text: "87명의 사망일을 달력에 옮기던 채이안의 연필이 한 줄에서 멈춥니다. 국진호, 61세. 1톤 냉동 탑차로 인천 연안부두의 생선을 나르던 개인 사업자. 5월 14일 (목) 새벽, 운전석에서 심장마비. 탑차 할부 남은 돈 3,960만 원, 운영자금 대출 2,410만 원, 합쳐 6,370만 원. '다른 86명은 석 달이 다 지났어요. 이 사람만 내일까지예요.' 가족은 아내와 스무 살 딸. 그가 연필을 귀에 다시 꽂습니다. '기준대로면 화요일 전에는 가족한테 연락하면 안 돼요. 기준이 그래요.'",
      question: "석 달이 하루 남은 집이 하나 있습니다. 어떻게 하겠습니까?",
      memo: ["국진호(61): 5월 14일 (목) 사망, 석 달은 8월 14일까지", "남은 빚: 탑차 할부 3,960만 + 운영자금 2,410만 = 6,370만 원", "기준: 발송일 전 가족 연락 금지"],
      triggers: ["responsibility", "fear", "choice"],
      choices: [
        { id: "s9_list_go", label: "오늘 밤 가족을 직접 찾아간다", effect: { trust: 5, legitimacy: 2, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s9_villa" },
        { id: "s9_list_log", label: "기준 밖 연락이라고 일지에 먼저 적는다", effect: { legitimacy: 6, time: -3, fatigue: 3 }, cognition: { inference: 1, persistence: 1 }, next: "s9_villa" },
        { id: "s9_list_ian", label: "채이안에게 같이 가자고 한다", effect: { trust: 3, legitimacy: 3, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s9_villa" },
      ],
    },
    s9_villa: {
      phase: "SIDE 09 NIGHT",
      title: "넉 달",
      speaker: "아이굴 세리코바",
      place: "인천 남동구 · 빌라 앞 주차장",
      clock: "20:30",
      text: "빌라 앞 주차장에 흰 냉동 탑차가 석 달째 서 있습니다. 아이굴 세리코바가 계단을 내려옵니다. 카자흐스탄 알마티에서 와 한국에서 21년, 한국어로 답합니다. 당신이 KD캐피탈 명함을 내밀자 그가 탑차 문에 손을 얹습니다. '남편이 트럭은 넉 달만 더 내면 끝난다고 했어요.' 당신이 숫자를 말합니다. 할부 3,960만 원, 대출 2,410만 원. 그가 숫자를 천천히 따라 말합니다. '6,370만 원. 그 사람 거짓말 잘 못하는 사람인데.' 그리고 묻습니다. '왜 석 달 동안 아무도 말 안 했어요?'",
      question: "석 달 동안 아무도 말하지 않은 빚입니다. 어떻게 답하겠습니까?",
      memo: ["아이굴 세리코바: 알마티 출신, 한국 21년, 국진호의 아내", "남편의 말: '트럭은 넉 달만 더 내면 끝'", "실제 남은 빚: 6,370만 원"],
      triggers: ["affection", "injustice", "helplessness"],
      choices: [
        { id: "s9_villa_rule", label: "92일 기준을 숨기지 않고 말한다", effect: { trust: 6, legitimacy: 3, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s9_home" },
        { id: "s9_villa_court", label: "내일까지 법원에 낼 길부터 말한다", effect: { legitimacy: 5, humanCost: -1, time: -1, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_name" },
        { id: "s9_villa_sorry", label: "회사 대신 먼저 사과한다", effect: { trust: 5, legitimacy: -1, time: -1, fatigue: 1 }, cognition: { persistence: 1, reframing: 1 }, next: "s9_home" },
      ],
    },
    s9_home: {
      phase: "SIDE 09 HOME",
      title: "마흔째 날",
      speaker: "아이굴 세리코바",
      place: "인천 남동구 · 빌라 거실",
      clock: "21:40",
      text: "거실 장식장 위, 국진호의 사진 앞에 튀긴 빵 바우르사크 한 접시가 놓여 있습니다. '카자흐에서는 떠난 사람의 마흔째 날에 상을 차려요. 그날부터 못 치웠어요.' 딸 국하늘이 방에서 나와 엄마 옆에 앉습니다. 대학 2학년, 2학기 등록금 고지서가 냉장고에 붙어 있습니다. 당신이 계산을 보여 줍니다. 이대로 석 달이 지나면 빚은 가족 몫이 됩니다. 아내 3,822만 원, 딸 2,548만 원. 아이굴 세리코바가 고개를 젓습니다. '그 사람이 갚는다고 했으면 제가 갚아야죠. 하늘이 이름만 빼 주세요.'",
      question: "어머니는 갚겠다고, 딸 몫만 빼 달라고 합니다. 어떻게 하겠습니까?",
      memo: ["석 달이 지나면: 아내 3,822만 원, 딸 2,548만 원", "남편이 남긴 것: 탑차 시세 1,800만 원, 통장 410만 원", "냉장고에 붙은 2학기 등록금 고지서"],
      triggers: ["affection", "protection", "helplessness"],
      choices: [
        { id: "s9_home_math", label: "물려받은 만큼만 갚는 길을 숫자로 보인다", effect: { legitimacy: 6, trust: 3, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_name" },
        { id: "s9_home_both", label: "딸에게도 같은 설명을 따로 한다", effect: { trust: 6, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s9_name" },
        { id: "s9_home_wait", label: "오늘은 마음부터 정하시라고 한다", effect: { trust: 3, time: 1, humanCost: 1, fatigue: -1 }, cognition: { risk: 1 }, next: "s9_name" },
      ],
    },
    s9_name: {
      phase: "SIDE 09 PAPERS",
      title: "세리꼬바",
      speaker: "아이굴 세리코바",
      place: "인천 남동구 · 행정복지센터",
      clock: "8월 14일 (금) 09:40",
      text: "금요일 아침, 행정복지센터 창구. 법원에 낼 서류를 떼던 직원이 화면을 두 번 봅니다. 외국인등록증의 이름은 「세리코바 아이굴」인데, 2005년 혼인신고 때 남편의 가족관계등록부에는 「세리꼬바 아이굴」로 적혀 있습니다. 같은 사람인지 보여 줄 서류가 더 있어야 할 수도 있다고 합니다. 아이굴 세리코바가 지갑에서 빛바랜 혼인신고서 사본을 꺼냅니다. '그때 구청 직원이 이렇게 써 줬어요. 21년 동안 아무도 안 물었어요.' 법원 접수는 오늘 18시까지. 국하늘이 휴대폰으로 법원 가는 버스를 찾습니다.",
      question: "이름 한 글자가 남은 하루를 잡아먹습니다. 어떻게 하겠습니까?",
      memo: ["외국인등록증 「세리코바」 / 가족관계등록부 「세리꼬바」", "2005년 혼인신고서 사본: 같은 사람이라는 증거", "가정법원 접수: 오늘 18시까지"],
      triggers: ["system", "helplessness", "protection"],
      choices: [
        { id: "s9_name_copy", label: "혼인신고서 사본을 여러 장 복사해 둔다", effect: { legitimacy: 6, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_balance" },
        { id: "s9_name_call", label: "채이안에게 빚 증명서부터 부탁한다", effect: { legitimacy: 4, trust: 2, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s9_balance" },
        { id: "s9_name_bus", label: "서류는 법원에서 묻자며 바로 출발한다", effect: { time: 3, legitimacy: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s9_buyer" },
      ],
    },
    s9_balance: {
      phase: "SIDE 09 BALANCE",
      title: "확인 불가",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "11:30",
      text: "법원에 낼 서류에는 물려받는 빚이 얼마인지도 적어야 합니다. 당신이 국진호의 빚 잔액 증명서를 신청하자 화면에 한 줄이 뜹니다. 「상속인 문의: 통지 전 확인 불가. 안내 대본 7번.」 7번은 '해당 정보는 추후 우편으로 안내드립니다'입니다. 위성규 파트장이 위험관리부까지 올라와 웃으며 말합니다. 기준은 유족을 위한 거라고, 장례 치른 집에 숫자부터 들이밀 수는 없지 않냐고. 채이안이 연필을 귀에서 뺍니다. '증명서는 우리 부서장 승인로도 뗄 수 있어요. 대신 승인란에 이름이 남죠.'",
      question: "증명서 한 장에 승인 이름이 남습니다. 어떻게 하겠습니까?",
      memo: ["상속인 문의: '통지 전 확인 불가', 안내 대본 7번", "위성규: '장례 치른 집에 숫자부터 들이밀 수는 없다'", "부서장 승인로 발급 가능, 승인란에 이름"],
      triggers: ["fear", "system", "responsibility"],
      choices: [
        { id: "s9_bal_sign", label: "승인란에 내 이름도 같이 올린다", effect: { trust: 5, legitimacy: 5, capital: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s9_buyer" },
        { id: "s9_bal_script", label: "안내 대본 7번을 출력해 서류철에 넣는다", effect: { legitimacy: 7, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_buyer" },
        { id: "s9_bal_listen", label: "위성규의 설명을 끝까지 듣는다", effect: { trust: 3, time: -2, legitimacy: 1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s9_buyer" },
      ],
    },
    s9_buyer: {
      phase: "SIDE 09 TRUCK",
      title: "열쇠",
      speaker: "아이굴 세리코바",
      place: "인천 남동구 · 빌라 앞 주차장",
      clock: "14:00",
      text: "빌라 앞에 중고 화물차 업자가 먼저 와 있습니다. 지난주에 잡아 둔 약속입니다. 그가 현금 봉투를 보여 줍니다. 탑차 값 1,800만 원, 오늘 바로. 아이굴 세리코바가 탑차 열쇠를 꺼냅니다. '이걸로 남편 빚 먼저 갚으면 되잖아요. 남의 돈 안 갚고 사는 거, 그 사람도 저도 못 해요.' 국하늘이 엄마의 소매를 잡습니다. 당신은 채이안이 전화로 한 말을 떠올립니다. 법원에 내기 전에 남편 이름의 물건을 팔면, 물려받은 만큼만 갚겠다는 신청이 막힐 수 있다고. 업자가 시계를 봅니다. '오늘 아니면 저도 다른 차 봐요.'",
      question: "남편 빚을 갚겠다는 열쇠가 업자 앞에 있습니다. 어떻게 하겠습니까?",
      memo: ["업자 현금 1,800만 원, 오늘만", "법원에 내기 전 처분: 신청이 막힐 수 있음", "아이굴 세리코바: '남의 돈 안 갚고 사는 거 못 해요'"],
      triggers: ["choice", "protection", "injustice"],
      choices: [
        { id: "s9_buy_wait", label: "트럭은 서류를 낸 뒤에 팔자고 말한다", effect: { legitimacy: 5, trust: 4, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s9_court" },
        { id: "s9_buy_pay", label: "그래도 물려받은 만큼은 갚게 된다고 말한다", effect: { trust: 6, humanCost: -1, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s9_court" },
        { id: "s9_buy_send", label: "업자에게 오늘은 안 된다고 대신 말한다", effect: { trust: 2, legitimacy: 2, time: -1, humanCost: 1 }, cognition: { risk: 1 }, next: "s9_court" },
      ],
    },
    s9_court: {
      phase: "SIDE 09 COURT",
      title: "16시 52분",
      speaker: "아이굴 세리코바",
      place: "인천가정법원 · 민원실",
      clock: "16:20",
      text: "가정법원 민원실, 번호표 61번. 직원이 혼인신고서 사본과 외국인등록증을 나란히 놓고 한참 봅니다. 그리고 접수 도장을 찍습니다. 8월 14일 16시 52분. 아이굴 세리코바가 접수증을 두 손으로 받아 국하늘에게 건넵니다. '이제 하늘이 이름은 괜찮아요?' 법원 문을 나서며 그가 당신에게 묻습니다. '그 편지, 다른 집에도 가요? 몇 집이에요?' 당신이 86이라고 답합니다. 그가 잠깐 서 있다가 말합니다. '그 집들도 석 달 동안 아무도 말 안 했어요? 우리처럼?'",
      question: "한 집은 접수증을 받았고, 86집이 남았습니다. 어떻게 하겠습니까?",
      memo: ["접수: 8월 14일 16시 52분, 인천가정법원", "아이굴 세리코바: '그 편지, 다른 집에도 가요?'", "남은 편지 86통, 명단 마감 오늘 18시"],
      triggers: ["injustice", "affection", "responsibility"],
      choices: [
        { id: "s9_court_table", label: "86집의 석 달 끝난 날을 표로 만든다", effect: { legitimacy: 7, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s9_aftershock" },
        { id: "s9_court_call", label: "채이안에게 문구 고칠 시간을 묻는다", effect: { legitimacy: 4, trust: 2, time: -1, fatigue: 1 }, cognition: { persistence: 2 }, next: "s9_aftershock" },
        { id: "s9_court_stop", label: "두 사람을 버스 정류장까지 바래다준다", effect: { trust: 6, humanCost: -2, time: -2, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s9_aftershock" },
      ],
    },
    s9_aftershock: {
      phase: "SIDE 09 AFTERMATH",
      title: "첫 줄",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "17:50, 명단 마감 10분 전",
      text: "위험관리부 책상에 세 가지가 놓여 있습니다. 화요일에 나갈 편지 86통의 견본, 2024년 3월의 기준 개정안, 그리고 아이굴 세리코바의 접수증 사본. 86집은 모두 석 달이 지났습니다. 그래도 빚이 재산보다 많은 줄 몰랐던 가족은 그것을 안 날부터 석 달 안에 다시 법원에 낼 수 있습니다(특별한정승인). 그 사실을 알려 줄 수 있는 건 이 편지 한 통뿐입니다. 채이안이 연필을 당신 앞에 내려놓습니다. '위험관리부가 고칠 수 있는 건 첫 줄 하나예요. 18시에 잠겨요.'",
      question: "86통의 첫 줄은 하나입니다. 무엇을 쓰겠습니까?",
      memo: ["편지 86통, 8월 18일 (화) 발송", "몰랐던 가족: 안 날부터 석 달 안에 다시 신청 가능", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "recognition"],
      choices: [
        { id: "s9_after_notice", label: "갚지 않아도 되는 길이 있다고 쓴다", effect: { trust: 6, capital: -2 }, cognition: { persistence: 2 }, next: "s9_result" },
        { id: "s9_after_cause", label: "92일 기준의 회수율 표를 감사팀에 보낸다", effect: { legitimacy: 7, trust: 1 }, cognition: { inference: 2 }, next: "s9_result" },
        { id: "s9_after_none", label: "'상속 채무 이행 안내'를 그대로 둔다", effect: { time: 4, legitimacy: -3 }, cognition: { risk: 1 }, next: "s9_result" },
      ],
    },
  },
  outcomes: {
    s9_after_notice: {
      title: "86통",
      text: "당신은 첫 줄을 이렇게 고칩니다. '이 빚을 모두 갚지 않아도 되는 길이 있습니다. 받으신 날부터 석 달 안에 가정법원에 물어 주십시오.' 승인란에 당신의 이름이 붙고, 고객채권부의 하반기 예상 회수액은 그날 오후 다시 계산됩니다. 화요일, 86통이 나갑니다. 11월까지 그중 39집이 법원에 서류를 냅니다. 아이굴 세리코바의 접수(8월 14일 16시 52분)는 9월에 받아들여지고, 6,370만 원 아래에서 국하늘의 이름이 빠집니다. 탑차는 그 뒤에 1,800만 원에 팔려 남편의 빚을 갚는 데 쓰입니다.",
    },
    s9_after_cause: {
      title: "92일",
      text: "당신은 첫 줄을 그대로 두고, 2024년 3월의 개정안과 회수율 표(41% → 68%)를 감사팀에 보냅니다. 화요일, 86통은 '상속 채무 이행 안내'로 나갑니다. 석 달 뒤 고객채권부 기준이 한 줄 바뀝니다. '상속인 통지: 사망 확인 뒤 14일 안, 한정승인 안내 포함.' 위성규는 자리를 옮기지 않고, 기준을 고친 공로로 연말 표창 후보에 오릅니다. 아이굴 세리코바의 접수(8월 14일 16시 52분)는 9월에 받아들여집니다. 그 전에 나간 86통 가운데 몇 집이 다시 법원에 갔는지는 어느 표에도 없습니다.",
    },
    s9_after_none: {
      title: "이행 안내",
      text: "당신은 첫 줄을 건드리지 않습니다. 18시, 명단이 잠깁니다. 화요일, 86통이 '상속 채무 이행 안내'로 나갑니다. 수요일 아침 첫 입금이 들어옵니다. 50만 원, 입금자 메모 '일단 이것부터'. 고객채권부 단체방에 한 줄이 뜹니다. '8월 유족 안내 첫 입금 ^^ 올해도 민원 0건!' 아이굴 세리코바의 접수(8월 14일 16시 52분)는 9월에 받아들여집니다. 추석 전날, 그가 바우르사크 한 봉지를 위험관리부로 보냅니다. 봉지에 붙은 쪽지에는 한 줄. '다른 집들은요?'",
    },
  },
};
