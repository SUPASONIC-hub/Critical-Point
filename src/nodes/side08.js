/**
 * 번외 8 -- 정상화 (N11: one side case a month, outside the ranking).
 *
 * Friday 10 July 2026 to the Monday after: a week after 사건 34 closes (7월 3일)
 * and the morning before 사건 35's night of rain (7월 14일). The analyst sits in
 * KD캐피탈's 위험관리부 under 채이안, as 사건 35 finds them, and Monday's 09:00
 * 회수심의 needs the department's opinion on one small client: 도담사출, a
 * plastic injection shop in 안산 반월공단, 23 people, four machines leased from
 * KD캐피탈 at 2,100만 원 a month. July's payment is late. The agenda takes the
 * four machines and, under the lease's 12조, the 4,200만 원 a customer owes the
 * shop on 7월 15일 -- the shop's last money.
 *
 * The group's screen carries one line nobody at KD캐피탈 reads: the shop has
 * paid nothing into its people's KD은행 퇴직연금 for seven months, December to
 * June, 3,640만 원 for the 23. From January to June the lease was paid on the
 * 5th, never late, because in January 채권관리팀 promised to hold the machines
 * if the lease came first ("정상화"). The same months, the same group, the
 * same money. The notices of the missed payments went to the company only.
 *
 * Speakers: 채이안 (existing) and one new: 비노드 타파, from Nepal, nine years
 * and eight months on machine 3, flying home on the Saturday night, who
 * answers in Korean (said once, in the narration, as docs/canon.md's
 * people-from-abroad rules ask; a photograph, docs/portrait-credits.md).
 * 설경민 (채권관리팀 차장, whose January note it is, the case's wrong side)
 * and 심재만 (the shop's 대표, who read all seven notices) speak only in the
 * narration -- in indirect speech or 「」 -- and are no scene's speaker: no
 * ordinary generated face could be found for them yet, and 번외 6 did the
 * same for 기성철 rather than leave a silhouette.
 *
 * Money in the story is in 원, as every case writes it (docs/writing-a-case.md
 * 18장): 2,100만, 4,200만, 3,640만, his 182만 of it, 2,310만 already saved.
 *
 * The endings are the first line of the department's opinion: the 4,200만 put
 * behind the pension (paid on 7월 17일; the analyst's name on the expected
 * loss), the cause written (the agenda passes, a line added to the collection
 * rules three months later, the 3,640만 left to a wage claim), or the form's
 * 「특이사항 없음」 left as it is. None says what became of the shop's people
 * beyond that, and none touches the flood of 사건 35.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): ten
 * scenes, `s8_aftershock`'s three cards to `s8_result`, three `outcomes`.
 */
export const side08 = {
  id: "side08",
  label: "번외 8",
  title: "정상화",
  startNode: "s8_start",
  // A table from the summer of 사건 34-35, not this device's season.
  startState: {
    resources: { time: 44, capital: 50, trust: 50, legitimacy: 50, humanCost: 26, fatigue: 38 },
  },
  nodes: {
    s8_start: {
      phase: "SIDE 08 BRIEFING",
      title: "의견 칸",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "7월 10일 (금) 15:20, 회수심의 사흘 전",
      lead: "장마가 오기 전의 금요일 오후. 위험관리부 책상에 월요일 회수심의 안건이 한 부 놓입니다.",
      text: "채이안이 연필로 안건 첫 장을 두드립니다. 안산 반월공단 도담사출, 플라스틱 사출 공장, 직원 스물세 명. 사출기 네 대를 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융)로 쓰는데 7월 사용료 2,100만 원이 밀렸습니다. 월요일 9시 안건은 둘입니다. 사출기 네 대 회수, 그리고 7월 15일 거래처가 공장에 줄 납품 대금 4,200만 원을 계약서 12조대로 우리가 직접 받기. '위험관리부 의견 칸만 비어 있어요.' 그가 그룹 통합 화면의 한 줄을 연필 끝으로 짚습니다. '관계사 거래: KD은행 퇴직연금, 회사 납입 7개월 밀림.' '이 줄은 우리 일이 아니라고들 하죠.'",
      question: "월요일 회수 안건에 의견을 써야 합니다. 무엇부터 보겠습니까?",
      memo: ["도담사출: 사출기 4대 리스, 월 2,100만 원", "월요일 9시 안건: 사출기 회수 + 7월 15일 납품 대금 4,200만 원", "그룹 화면: KD은행 퇴직연금 회사 납입 7개월 밀림"],
      triggers: ["responsibility", "curiosity", "system"],
      choices: [
        { id: "s8_start_ledger", label: "리스료 입금 기록을 1월부터 연다", effect: { legitimacy: 6, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s8_ledger" },
        { id: "s8_start_line", label: "그룹 화면의 그 한 줄부터 출력한다", effect: { legitimacy: 4, trust: 2, time: -2, fatigue: 2 }, cognition: { persistence: 1, inference: 1 }, next: "s8_ledger" },
        { id: "s8_start_brief", label: "안건 요약만 읽고 담당 팀에 묻는다", effect: { time: 3, legitimacy: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s8_ledger" },
      ],
    },
    s8_ledger: {
      phase: "SIDE 08 LEDGER",
      title: "여섯 달",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 채권관리팀",
      clock: "16:30",
      text: "채이안이 당신과 함께 채권관리팀으로 내려갑니다. '숫자는 저 사람 모니터에 다 있어요.' 설경민 차장이 모니터를 돌려 보여 줍니다. 도담사출 리스료 입금 기록. 1월부터 6월까지 매달 5일, 2,100만 원이 하루도 늦지 않았습니다. 1월 메모 칸에는 그가 쓴 한 줄. 「대표 통화: 리스료 우선 입금 약속, 회수 유예. 정상화.」 그 여섯 달이 그룹 화면의 밀린 일곱 달과 겹칩니다. 설경민은 웃으며 다들 그렇게 한다고, 연금은 은행 일이라고 말합니다. 그의 휴대폰에 팀장의 단체 메시지가 뜹니다. 「상반기 회수율 1위 축하해요 ^^ 하반기도 정상화 부탁!」",
      question: "여섯 달의 '정상화'가 일곱 달의 미납과 겹칩니다. 어떻게 하겠습니까?",
      memo: ["1~6월 리스료 매달 2,100만 원, 늦은 적 없음", "1월 메모: '리스료 우선 입금 약속, 회수 유예'", "같은 기간 KD은행 퇴직연금 회사 납입 없음"],
      triggers: ["system", "injustice", "curiosity"],
      choices: [
        { id: "s8_ledger_note", label: "1월 메모를 시각이 보이게 출력한다", effect: { legitimacy: 8, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s8_factory" },
        { id: "s8_ledger_ask", label: "그 순서를 누가 먼저 꺼냈는지 묻는다", effect: { legitimacy: 5, trust: -1, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s8_factory" },
        { id: "s8_ledger_close", label: "채권관리팀 일이라며 화면을 닫는다", effect: { time: 3, trust: -2, legitimacy: -3 }, cognition: { risk: 1 }, next: "s8_factory" },
      ],
    },
    s8_factory: {
      phase: "SIDE 08 FACTORY",
      title: "3번 사출기",
      speaker: "비노드 타파",
      place: "안산 반월공단 · 도담사출 공장",
      clock: "19:10",
      text: "기계 소리가 멎은 공장에 3번 사출기만 불이 켜져 있습니다. 비노드 타파가 금형 틈을 솔로 닦고 있습니다. 네팔에서 와 이 공장에서만 9년 8개월, 한국어로 답합니다. '오늘이 마지막 근무예요. 내일 밤 비행기로 카트만두 가요.' 그가 기계 옆에 붙은 쪽지를 떼어 보여 줍니다. 손으로 쓴 온도표입니다. '이 기계는 비 오는 날 3도 올려야 해요. 아무도 몰라요.' 당신의 서류철에 찍힌 KD캐피탈 글자를 보고 그가 잠깐 멈춥니다. '월요일에 기계 가져가는 분이에요? 그럼 제 퇴직금도 기계랑 같이 가요?'",
      question: "출국 전날 밤, 그가 퇴직금을 묻습니다. 어떻게 답하겠습니까?",
      memo: ["비노드 타파: 네팔, 도담사출 9년 8개월, 3번 사출기", "출국: 7월 11일 (토) 23:50 인천", "3번 기계 온도표: '비 오는 날 3도 올림'"],
      triggers: ["affection", "responsibility", "helplessness"],
      choices: [
        { id: "s8_fac_plain", label: "퇴직금은 기계와 따로라고 그대로 말한다", effect: { trust: 6, legitimacy: 3, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s8_owner" },
        { id: "s8_fac_owner", label: "대표에게 같이 가서 묻자고 한다", effect: { trust: 4, legitimacy: 4, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s8_owner" },
        { id: "s8_fac_screen", label: "그의 퇴직연금 화면부터 같이 본다", effect: { legitimacy: 6, humanCost: -1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s8_pension" },
      ],
    },
    s8_owner: {
      phase: "SIDE 08 OFFICE",
      title: "일곱 통",
      speaker: "비노드 타파",
      place: "도담사출 · 사무실",
      clock: "20:00",
      text: "비노드 타파가 당신을 사무실로 데려갑니다. '대표님, 이분한테 말해 주세요.' 심재만 대표가 서랍에서 봉투 일곱 통을 꺼냅니다. KD은행 퇴직연금 「회사 납입 지연 안내」. 12월분부터 6월분까지, 모두 뜯어 읽은 것입니다. 그는 다 알았다고 짧게 말합니다. 1월에 캐피탈에서 리스료만 먼저 넣으면 기계는 안 가져간다는 전화가 왔고, 기계가 서면 스물세 명 월급도 서니까 연금은 일감이 들어오면 몰아서 넣으려 했다고. 밀린 납입금은 스물세 명 몫 3,640만 원. 그가 창밖의 3번 기계 불빛을 봅니다. 15일에 들어올 4,200만 원이 마지막 돈이고, 그걸로 넣으려 했다고 합니다.",
      question: "마지막 납품 대금이 리스료와 연금 가운데 한쪽으로 갑니다. 어떻게 하겠습니까?",
      memo: ["서랍 속 납입 지연 안내 7통, 모두 읽음", "밀린 납입금: 23명, 3,640만 원", "7월 15일 납품 대금 4,200만 원, 회사의 마지막 돈"],
      triggers: ["injustice", "helplessness", "choice"],
      choices: [
        { id: "s8_owner_copy", label: "안내 일곱 통을 날짜순으로 복사해 둔다", effect: { legitimacy: 8, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s8_pension" },
        { id: "s8_owner_list", label: "스물세 명의 밀린 금액을 사람별로 받는다", effect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s8_pension" },
        { id: "s8_owner_blame", label: "알면서 안 넣은 책임부터 따진다", effect: { trust: -4, legitimacy: 2, humanCost: 2, time: -1 }, cognition: { risk: 1 }, next: "s8_pension" },
      ],
    },
    s8_pension: {
      phase: "SIDE 08 NIGHT",
      title: "멈춘 숫자",
      speaker: "비노드 타파",
      place: "도담사출 · 기숙사 컨테이너",
      clock: "21:30",
      text: "컨테이너 기숙사 문 앞에 23킬로그램에 맞춘 가방 두 개가 서 있습니다. 비노드 타파가 휴대폰의 KD은행 퇴직연금 화면을 내밉니다. 쌓인 돈 2,310만 원. 마지막 회사 납입은 작년 11월입니다. '12월부터 숫자가 안 움직여요. 앱이 고장 난 줄 알았어요.' 밀린 일곱 달 가운데 그의 몫은 182만 원. 그에게 안내 문자는 한 번도 오지 않았습니다. 안내는 회사로만 갔습니다. 그가 화면을 끕니다. '고향 다사인 명절에 아홉 번 못 갔어요. 이 돈이 그 아홉 번이에요.'",
      question: "출국까지 하루, 그의 몫 182만 원이 비어 있습니다. 어떻게 하겠습니까?",
      memo: ["쌓인 퇴직연금 2,310만 원, 마지막 회사 납입 작년 11월", "밀린 일곱 달 가운데 그의 몫 182만 원", "납입 지연 안내: 회사로만, 본인에게는 0번"],
      triggers: ["affection", "injustice", "protection"],
      choices: [
        { id: "s8_pen_shot", label: "화면을 시각이 보이게 찍어 둔다", effect: { legitimacy: 8, time: -1, fatigue: 1 }, cognition: { inference: 2 }, next: "s8_rule" },
        { id: "s8_pen_claim", label: "출국 전에 낼 수 있는 신고를 같이 찾는다", effect: { trust: 6, legitimacy: 4, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s8_rule" },
        { id: "s8_pen_promise", label: "월요일 결과를 꼭 알려 주겠다고 한다", effect: { trust: 5, humanCost: -1, time: -1, fatigue: 1 }, cognition: { reframing: 1, persistence: 1 }, next: "s8_saturday" },
      ],
    },
    s8_rule: {
      phase: "SIDE 08 RULE",
      title: "기타 사항",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "23:10",
      text: "늦은 밤 위험관리부에 불이 하나 켜져 있습니다. 채이안이 아직 퇴근하지 않았습니다. 당신이 메모 두 장을 내려놓자 그가 귀에 꽂은 연필을 뺍니다. '의견 칸은 400자예요. 우리 회사가 돈을 잃는지만 쓰는 칸이고.' 그가 칸 아래 작은 글씨를 짚습니다. 기타 사항. '여기는 아무도 안 읽어요. 그러니까 아무거나 써도 되고, 써도 아무 일 안 생겨요.' 그가 웃지 않고 덧붙입니다. '4,200만 원을 연금 뒤로 미루자고 쓰면, 우리 손실 4,200만 원에 당신 이름이 붙어요. 이 부서는 그걸 정하는 데예요.'",
      question: "손실에 이름이 붙는 칸입니다. 어떻게 하겠습니까?",
      memo: ["의견 칸 400자: KD캐피탈 손실 기준", "칸 아래 '기타 사항': 아무도 안 읽음", "납품 대금을 미루면 손실 4,200만 원에 의견 쓴 사람 이름"],
      triggers: ["fear", "system", "responsibility"],
      choices: [
        { id: "s8_rule_name", label: "내 이름이 붙어도 된다고 답한다", effect: { trust: 5, legitimacy: 5, capital: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s8_saturday" },
        { id: "s8_rule_other", label: "기타 사항 칸에 원인부터 적어 둔다", effect: { legitimacy: 7, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s8_saturday" },
        { id: "s8_rule_share", label: "부장님 이름도 같이 올리자고 한다", effect: { trust: 3, legitimacy: 3, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s8_saturday" },
      ],
    },
    s8_saturday: {
      phase: "SIDE 08 SATURDAY",
      title: "수첩",
      speaker: "비노드 타파",
      place: "도담사출 · 기숙사 앞 마당",
      clock: "7월 11일 (토) 13:00",
      text: "토요일 낮, 비노드 타파가 욕실 저울로 가방 무게를 다시 잽니다. 23.4킬로그램. 그가 공구 상자에서 손때 묻은 수첩 하나를 꺼내 당신에게 내밉니다. 9년 동안 적은 금형 온도와 압력, 날씨별로. '3번 기계 다음에 맡는 사람 주세요. 기계 가져가면, 가져간 데서 쓰는 사람 주세요.' 동료 둘이 공항버스 시간을 묻습니다. 그가 휴대폰을 봅니다. '어제 찍은 화면, 그거 증거 돼요? 저 가고 나면 누가 대신 말해요?'",
      question: "떠나는 사람이 수첩과 질문을 남깁니다. 어떻게 하겠습니까?",
      memo: ["가방 23.4킬로그램, 공항버스 18:40", "9년 치 금형 수첩: '다음 사람 주세요'", "'저 가고 나면 누가 대신 말해요?'"],
      triggers: ["affection", "protection", "responsibility"],
      choices: [
        { id: "s8_sat_proxy", label: "남는 동료 중 대신 말할 사람을 같이 정한다", effect: { trust: 7, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s8_airport" },
        { id: "s8_sat_note", label: "수첩을 받아 회수 목록에 같이 적는다", effect: { legitimacy: 5, trust: 4, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s8_airport" },
        { id: "s8_sat_bus", label: "공항버스 시간만 확인해 준다", effect: { time: 3, trust: -3, humanCost: 1 }, cognition: { risk: 1 }, next: "s8_monday" },
      ],
    },
    s8_airport: {
      phase: "SIDE 08 DEPARTURE",
      title: "흰 봉투",
      speaker: "비노드 타파",
      place: "인천공항 · 출국장",
      clock: "21:20",
      text: "출국장 앞, 도담사출 대표 심재만이 작업복 위에 양복 윗도리만 걸치고 와 있습니다. 그가 흰 봉투를 내밉니다. 182만 원, 누나에게 빌린 돈이라고 합니다. 비노드 타파가 봉투를 대표의 손에 다시 쥐여 줍니다. '이건 저 혼자 거예요. 남는 사람들 거 먼저 해 주세요.' 그가 가방을 끌고 게이트로 걸어갑니다. 심재만은 봉투를 든 채 당신을 돌아봅니다. 한 사람 몫은 이렇게라도 되지만, 월요일에 4,200만 원을 가져가면 남은 스물두 명 몫은 안 된다고. 그가 봉투를 반으로 접으며 묻습니다. 분석관님은 그 칸에 뭐라고 쓸 거냐고.",
      question: "한 사람 몫의 봉투가 대표의 손에 남았습니다. 어떻게 하겠습니까?",
      memo: ["봉투 182만 원: 대표가 누나에게 빌린 돈", "비노드 타파: 받지 않고 출국", "남은 스물두 명의 몫은 그대로"],
      triggers: ["injustice", "affection", "choice"],
      choices: [
        { id: "s8_air_list", label: "남은 스물두 명 명단을 월요일 자료에 붙인다", effect: { legitimacy: 7, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s8_monday" },
        { id: "s8_air_stay", label: "막차 시간까지 대표 곁에 남는다", effect: { trust: 7, humanCost: -2, time: -2, fatigue: 3 }, cognition: { persistence: 2 }, next: "s8_monday" },
        { id: "s8_air_honest", label: "아직 모르겠다고 솔직히 답한다", effect: { trust: 4, legitimacy: 2, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s8_monday" },
      ],
    },
    s8_monday: {
      phase: "SIDE 08 MONDAY",
      title: "특이사항 없음",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "7월 13일 (월) 08:10",
      text: "월요일 아침, 채이안이 회수심의 자료 최종본을 당신 책상에 내려놓습니다. 채권관리팀 설경민 차장이 두고 간 것입니다. 위험관리부 의견 칸에는 벌써 연한 글씨가 찍혀 있습니다. 특이사항 없음. '양식에 기본으로 들어가 있대요. 지우고 써도 된답니다.' 자료 위에 설경민의 쪽지가 붙어 있습니다. 「4,200만 원 미루시면 하반기 회수율이 제 이름으로 떨어져요. 저도 1월에 그 대표님 기계 지켜 드린 거예요. 반년이나. ^^」 회수 트럭은 10시에 반월공단으로 떠납니다. 장마 예보는 내일 밤부터입니다.",
      question: "의견 칸에 '특이사항 없음'이 미리 찍혀 있습니다. 어떻게 하겠습니까?",
      memo: ["의견 칸 기본 문구: '특이사항 없음'", "회수 트럭 10시 출발", "설경민의 쪽지: '1월에 기계 지켜 드린 거예요'"],
      triggers: ["system", "fear", "injustice"],
      choices: [
        { id: "s8_mon_erase", label: "기본 문구를 지우고 칸을 비워 둔다", effect: { legitimacy: 5, trust: -1, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s8_aftershock" },
        { id: "s8_mon_attach", label: "1월 메모와 안내 일곱 통을 자료 뒤에 붙인다", effect: { legitimacy: 8, trust: -2, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s8_aftershock" },
        { id: "s8_mon_coffee", label: "채권관리팀에 내려가 설경민의 사정을 듣는다", effect: { trust: 4, time: -2, legitimacy: -1, fatigue: 1 }, cognition: { persistence: 1, reframing: 1 }, next: "s8_aftershock" },
      ],
    },
    s8_aftershock: {
      phase: "SIDE 08 AFTERMATH",
      title: "아홉 시",
      speaker: "채이안",
      place: "KD캐피탈 본사 · 회의실",
      clock: "08:50, 회수심의 10분 전",
      text: "회의실 탁자에 세 가지가 놓여 있습니다. 사출기 네 대와 납품 대금 4,200만 원을 가져오는 안건, 1월 메모와 납입 지연 안내 일곱 통, 그리고 비노드 타파의 금형 수첩. 그는 이틀 전 카트만두에 내렸습니다. 채이안이 귀에서 연필을 빼 당신 앞에 내려놓습니다. '의견 칸은 하나예요. 위험을 줄이는 칸이 아니라, 위험이 누구 이름으로 적히는지 정하는 칸.' 그가 시계를 봅니다. '9시예요. 뭐라고 쓸지는 당신이 정해요.'",
      question: "의견 칸 첫 줄은 하나입니다. 무엇을 쓰겠습니까?",
      memo: ["안건: 사출기 4대 + 납품 대금 4,200만 원", "밀린 퇴직연금: 23명, 3,640만 원", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "recognition"],
      choices: [
        { id: "s8_after_hold", label: "납품 대금은 밀린 연금 뒤로 두자고 쓴다", effect: { trust: 6, capital: -2 }, cognition: { persistence: 2 }, next: "s8_result" },
        { id: "s8_after_cause", label: "1월의 '정상화'가 연금 미납이었다고 쓴다", effect: { legitimacy: 7, trust: 1 }, cognition: { inference: 2 }, next: "s8_result" },
        { id: "s8_after_none", label: "'특이사항 없음'을 그대로 둔다", effect: { time: 4, legitimacy: -3 }, cognition: { risk: 1 }, next: "s8_result" },
      ],
    },
  },
  outcomes: {
    s8_after_hold: {
      title: "3,640만 원",
      text: "당신은 첫 줄에 이렇게 씁니다. '7월 15일 납품 대금 4,200만 원은 밀린 퇴직연금 3,640만 원 납입 뒤로.' 사출기 네 대는 10시에 트럭에 실려 갑니다. 대금 건은 '2주 보류'로 의결되고, 회의록의 예상 손실 칸에 당신의 이름이 붙습니다. 7월 17일, KD은행 퇴직연금 화면에서 스물세 명의 일곱 달이 한꺼번에 '납입'으로 바뀝니다. 그날 밤 카트만두에서 사진 한 장이 옵니다. 182만 원이 들어온 화면, 그리고 한 줄. '3번 기계 수첩, 누가 받았어요?' 수첩은 아직 당신 서랍에 있습니다.",
    },
    s8_after_cause: {
      title: "정상화",
      text: "당신은 첫 줄에 원인을 씁니다. '1~6월 리스료 정상화 = 같은 기간 퇴직연금 회사 납입 없음. 1월 메모 첨부.' 안건은 원안대로 의결됩니다. 사출기와 4,200만 원은 KD캐피탈로 옵니다. 대신 채이안이 그 의견서를 KD은행 퇴직연금부와 감사팀에 함께 보냅니다. 석 달 뒤 채권관리 지침에 한 줄이 생깁니다. '회수 유예 전 관계사 퇴직연금 미납 확인.' 스물세 명의 3,640만 원은 체불 신고 서류로 남습니다. 서류철 맨 앞에는 비노드 타파가 찍어 둔 화면 한 장이 있습니다.",
    },
    s8_after_none: {
      title: "특이사항 없음",
      text: "당신은 연한 글씨를 그대로 둡니다. 9시 4분, 원안 의결. 10시에 트럭이 반월공단을 떠나고, 15일에 4,200만 원이 KD캐피탈 계좌로 들어옵니다. 오후에 채권관리팀 단체방에 공지가 뜹니다. '7월 회수 완료 ^^ 다들 고생하셨어요!' 도담사출은 그달 말 문을 닫습니다. 밀린 3,640만 원은 누구의 서류에도 다음 줄이 없습니다. 일주일 뒤 카트만두에서 메시지가 옵니다. '3번 기계는 비 오는 날 3도 올려야 해요. 새 주인한테 말해 줬어요?' 당신은 답장을 쓰다 지웁니다.",
    },
  },
};
