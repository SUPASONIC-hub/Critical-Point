/**
 * 번외 11 -- 부표까지 (Season 2026-12, owner's answer 11-20: 11-1).
 *
 * Saturday 5 September 2026, 05:40 to noon: the morning after 사건 42, the
 * 경포 불꽃축제 Friday at 물결스테이, where 한서윤 touched the buoy first and
 * 오진우 shouted 「재경기」. Two days before the 9월 7일 이사회 of 사건 43,
 * whose vote the case does not know.
 *
 * The rematch is set for 06:00, but the beach opens at 09:00 and nobody
 * goes past the buoy (80m out) before then: 염봉수, 66, a retired 해양경찰
 * on his thirty-first summer as the beach's 수상안전요원, says so. The ones
 * who wait are the ones who have waited five months: 오진우 and 한서윤 on
 * 대기발령, 한서윤 still tapping an 출근 카드 every morning with nowhere to
 * go (사건 42 says so); on a Saturday there is no card to tap.
 *
 * Speakers: 강태민, 권도현, 한서윤 and 오진우 (existing) and one new, 염봉수 (a
 * photograph, docs/portrait-credits.md). 여다인 and 나준혁 sleep. Nothing of
 * the 조기 회수 text of the night before, of 사건 43's vote or of 임경수.
 *
 * The endings are the line written that noon in 물결스테이's 방명록, beside
 * 강태민's 「또 옴」: the rematch's result (to the second) / 「09:00까지
 * 아무도 재지 않기」 / nothing, the car back to Seoul before nine. None changes
 * 사건 42 or 43.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): nine
 * scenes, `s11_aftershock`'s three cards to `s11_result`, three `outcomes`.
 */
export const side11 = {
  id: "side11",
  label: "번외 11",
  title: "부표까지",
  startNode: "s11_start",
  // A table from the September of 사건 42-43, not this device's season.
  startState: {
    resources: { time: 54, capital: 52, trust: 56, legitimacy: 50, humanCost: 22, fatigue: 46 },
  },
  nodes: {
    s11_start: {
      phase: "SIDE 11 BRIEFING",
      title: "재경기",
      speaker: "강태민",
      place: "경포 물결스테이 펜션 · 마당",
      clock: "9월 5일 (토) 05:40, 불꽃축제 다음 날",
      lead: "불꽃축제 다음 날 새벽. 마당에는 어젯밤 야광봉 몇 개가 아직 희미하게 빛납니다.",
      text: "강태민이 방문을 두 번 두드립니다. '심판이 필요하대요.' 마당에서 오진우가 수경을 이마에 올린 채 몸을 풉니다. 어제 부표를 3초 늦게 짚은 사람입니다. 한서윤은 평상에 앉아 신발 끈을 묶고 있습니다. '재경기는 받아 줬어요. 6시래요. 이 사람, 밤새 안 잔 것 같아요.' 강태민이 컵라면 두 개를 들어 보입니다. 하나는 자기 것, 하나는 늘 그렇듯 남의 몫. '끝나고 먹으려고요. 심판은 공짜예요.'",
      question: "새벽 6시 재경기에 심판이 필요합니다. 어떻게 하겠습니까?",
      memo: ["재경기: 오진우 대 한서윤, 06:00 부표까지", "어제 결과: 한서윤이 3초 먼저", "강태민의 컵라면 두 개"],
      triggers: ["affection", "curiosity", "choice"],
      choices: [
        { id: "s11_start_judge", label: "초시계를 켜고 심판을 맡는다", effect: { trust: 4, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s11_flag" },
        { id: "s11_start_check", label: "해변 수영 시간부터 확인한다", effect: { legitimacy: 5, time: -2, fatigue: 1 }, cognition: { inference: 2 }, next: "s11_flag" },
        { id: "s11_start_sleep", label: "한 시간만 더 자자고 말한다", effect: { time: 3, fatigue: -3, trust: -2 }, cognition: { risk: 1 }, next: "s11_flag" },
      ],
    },
    s11_flag: {
      phase: "SIDE 11 FLAG",
      title: "09:00",
      speaker: "염봉수",
      place: "경포 해변 · 백사장 감시탑",
      clock: "06:00",
      text: "백사장 감시탑 아래, 빨간 깃발이 서 있습니다. 수상안전요원 염봉수가 호루라기를 목에 건 채 다가옵니다. 해양경찰을 은퇴하고 이 해변에서 서른한 번째 여름입니다. '입수는 9시부터. 부표 너머는 언제든 안 되고.' 오진우가 부표까지는 80미터라고 말하자 그가 고개를 끄덕입니다. '알아요. 내가 매년 띄우니까.' 그가 깃발 줄을 고쳐 묶습니다. '새벽에 들어가겠다는 사람들은 꼭 이유가 있더라고. 이유가 있는 사람이 제일 위험해요.'",
      question: "입수는 세 시간 뒤부터입니다. 어떻게 하겠습니까?",
      memo: ["입수 09:00부터, 부표 너머 언제나 금지", "부표까지 80미터", "염봉수(66): 은퇴 해경, 이 해변 서른한 번째 여름"],
      triggers: ["system", "protection", "fear"],
      choices: [
        { id: "s11_flag_wait", label: "규칙대로 9시까지 기다리자고 한다", effect: { legitimacy: 6, time: -3, fatigue: 1 }, cognition: { persistence: 2 }, next: "s11_count" },
        { id: "s11_flag_why", label: "새벽에 들어오는 사람들의 이유를 묻는다", effect: { trust: 5, time: -2, fatigue: 1 }, cognition: { reframing: 2 }, next: "s11_count" },
        { id: "s11_flag_ask", label: "6시 반쯤은 안 되는지 한 번 묻는다", effect: { time: 2, trust: -2, legitimacy: -2 }, cognition: { risk: 1 }, next: "s11_count" },
      ],
    },
    s11_count: {
      phase: "SIDE 11 COUNT",
      title: "또 대기",
      speaker: "권도현",
      place: "경포 해변 · 백사장",
      clock: "06:20",
      text: "권도현이 모래에 세로줄을 하나 긋습니다. 왼쪽은 지금 들어갈 때, 오른쪽은 9시까지 기다릴 때. '지금 들어가면 과태료가 붙을 수 있고, 무엇보다 저 어르신이 뛰어들어야 합니다. 그건 비용이 너무 큽니다.' 그가 오른쪽 칸에 숫자를 적습니다. 대기 시간 2시간 40분. 그리고 한참 그 숫자를 봅니다. '두 분, 다섯 달째 대기 중이시죠. 거기에 2시간 40분 더하는 겁니다.' 오진우가 웃습니다. '그 계산, 회사는 안 해 줬는데.'",
      question: "다섯 달의 대기 끝에 2시간 40분이 더 붙습니다. 어떻게 하겠습니까?",
      memo: ["지금 입수: 과태료, 안전요원이 뛰어들어야 함", "9시까지 대기: 2시간 40분", "오진우·한서윤: 대기발령 다섯 달째"],
      triggers: ["system", "helplessness", "recognition"],
      choices: [
        { id: "s11_count_use", label: "기다리는 시간에 할 일을 정하자고 한다", effect: { trust: 4, legitimacy: 2, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s11_card" },
        { id: "s11_count_line", label: "권도현의 표에 '쉬는 시간' 칸을 더한다", effect: { trust: 5, humanCost: -1, time: -1 }, cognition: { inference: 2 }, next: "s11_card" },
        { id: "s11_count_nothing", label: "아무것도 정하지 않고 모래에 앉는다", effect: { fatigue: -3, time: 1, legitimacy: -1 }, cognition: { risk: 1 }, next: "s11_card" },
      ],
    },
    s11_card: {
      phase: "SIDE 11 CARD",
      title: "출근 카드",
      speaker: "한서윤",
      place: "경포 해변 · 감시탑 그늘",
      clock: "07:00",
      text: "7시가 되자 한서윤의 손이 바지 주머니로 갑니다. 아무것도 없습니다. '대기발령 받은 날부터 매일 아침 출근 카드를 찍었어요. 토요일엔 찍을 데가 없잖아요. 그게 제일 힘들어요.' 그가 빈손을 무릎에 올려놓습니다. '어제 저 부표에서는 아무도 저를 재지 않았어요. 오늘은 저 사람이 재겠다고 하고요.' 오진우는 저만치서 염봉수와 함께 감시탑 사다리를 칠하고 있습니다. 붓은 염봉수가 줬습니다. 한서윤이 묻습니다. '오늘도 저 이기면, 저 사람 괜찮을까요?'",
      question: "찍을 카드가 없는 아침입니다. 어떻게 하겠습니까?",
      memo: ["한서윤: 대기발령 뒤 매일 아침 출근 카드", "토요일: 찍을 데가 없음", "오진우: 염봉수와 감시탑 사다리 칠하는 중"],
      triggers: ["affection", "recognition", "helplessness"],
      choices: [
        { id: "s11_card_honest", label: "져 주지 말라고 말한다", effect: { trust: 5, legitimacy: 2, time: -1 }, cognition: { reframing: 2 }, next: "s11_ladder" },
        { id: "s11_card_paint", label: "같이 사다리를 칠하러 가자고 한다", effect: { trust: 4, humanCost: -1, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s11_ladder" },
        { id: "s11_card_quiet", label: "대답 대신 옆에 앉아 바다를 본다", effect: { trust: 3, fatigue: -2, time: -1 }, cognition: { risk: 1 }, next: "s11_ladder" },
      ],
    },
    s11_ladder: {
      phase: "SIDE 11 LADDER",
      title: "3초",
      speaker: "오진우",
      place: "경포 해변 · 감시탑 사다리",
      clock: "07:40",
      text: "오진우의 손등에 흰 페인트가 묻어 있습니다. '이분이 일을 주셨습니다. 다섯 달 만에 처음 받은 일입니다.' 그가 칠한 칸 수를 셉니다. 열네 칸. '어제 3초 진 건 억울하지 않습니다. 다만 그 3초를 다시 재고 싶었어요. 회사에서는 제가 어디서 몇 초 늦었는지 아무도 안 재 주거든요. 그냥 대기예요.' 염봉수가 아래에서 붓을 받아 듭니다. '사다리는 다 칠했고. 재경기는 9시. 그때까지 둘 다 물 마시고 몸 풀어요. 이유 있는 사람들은 쥐가 잘 나.'",
      question: "오진우는 3초를 다시 재고 싶어 합니다. 어떻게 하겠습니까?",
      memo: ["다섯 달 만에 처음 받은 일: 사다리 열네 칸", "오진우: '그 3초를 다시 재고 싶었어요'", "재경기: 09:00"],
      triggers: ["recognition", "affection", "choice"],
      choices: [
        { id: "s11_ladder_time", label: "어제 기록과 오늘 기록을 나란히 적어 둔다", effect: { legitimacy: 5, trust: 2, time: -1 }, cognition: { inference: 2 }, next: "s11_shore" },
        { id: "s11_ladder_warm", label: "둘에게 물과 몸풀기를 챙긴다", effect: { trust: 4, humanCost: -2, time: -2, fatigue: 1 }, cognition: { persistence: 2 }, next: "s11_shore" },
        { id: "s11_ladder_tease", label: "또 지면 저녁 메뉴는 내가 정한다고 한다", effect: { trust: 5, time: -1, fatigue: -1 }, cognition: { reframing: 2 }, next: "s11_shore" },
      ],
    },
    s11_shore: {
      phase: "SIDE 11 SHORE",
      title: "여기까지",
      speaker: "염봉수",
      place: "경포 해변 · 물가",
      clock: "08:55",
      text: "9시 5분 전, 염봉수가 빨간 깃발을 내리고 노란 깃발을 올립니다. 그가 두 사람을 물가에 세우고 부표를 가리킵니다. '저거, 끝이라고 생각하죠. 아니에요. 여기까지는 내가 볼 수 있다는 표시예요. 저 너머는 내 눈이 안 닿아.' 강태민이 초시계를 당신에게 넘깁니다. 권도현은 모래 위 표 맨 아래에 무언가를 적었다가 손바닥으로 지웁니다. 염봉수가 호루라기를 입에 뭅니다. '부표 짚으면 거기서 손 흔들어요. 그래야 내가 세요.'",
      question: "부표는 끝이 아니라 보이는 데까지의 표시입니다. 출발 전에 무엇을 하겠습니까?",
      memo: ["염봉수: '부표는 내가 볼 수 있다는 표시'", "부표를 짚으면 손을 흔들 것", "초시계는 당신 손에"],
      triggers: ["protection", "choice", "system"],
      choices: [
        { id: "s11_shore_go", label: "정확히 9시에 출발 신호를 준다", effect: { legitimacy: 5, trust: 2, time: -1 }, cognition: { persistence: 2 }, next: "s11_swim" },
        { id: "s11_shore_swim", label: "나도 같이 들어간다", effect: { trust: 6, fatigue: 4, time: -2 }, cognition: { risk: 1, reframing: 1 }, next: "s11_swim" },
        { id: "s11_shore_watch", label: "염봉수 옆에서 같이 본다", effect: { legitimacy: 3, humanCost: -1, time: -1 }, cognition: { inference: 2 }, next: "s11_swim" },
      ],
    },
    s11_swim: {
      phase: "SIDE 11 SWIM",
      title: "40미터",
      speaker: "한서윤",
      place: "경포 해변 · 물속",
      clock: "09:00",
      text: "출발. 둘은 나란히 갑니다. 40미터쯤에서 한서윤이 갑자기 멈추고 등을 대고 물에 뜹니다. 오진우가 몇 번 저어 가다 돌아봅니다. 한서윤이 하늘을 보고 말합니다. '먼저 가요. 저 여기 좀 있을래요. 이렇게 떠 있는 거, 대기랑 비슷한데 하나도 안 무서워요.' 오진우가 물속에서 제자리를 지킵니다. 부표는 40미터 앞, 초시계는 계속 갑니다. 해변에서 염봉수가 호루라기를 입에 문 채 둘을 봅니다. 아직 불지는 않습니다.",
      question: "한서윤은 멈췄고, 오진우는 돌아봅니다. 초시계는 계속 갑니다. 어떻게 하겠습니까?",
      memo: ["40미터 지점: 한서윤이 등을 대고 뜸", "오진우: 제자리에서 돌아봄", "부표까지 40미터, 초시계는 계속"],
      triggers: ["choice", "affection", "protection"],
      choices: [
        { id: "s11_swim_shout", label: "끝까지 가라고 오진우에게 외친다", effect: { legitimacy: 3, trust: 3, time: -1 }, cognition: { persistence: 2 }, next: "s11_buoy" },
        { id: "s11_swim_stop", label: "초시계를 멈추고 기다린다", effect: { trust: 6, humanCost: -2, time: -2 }, cognition: { reframing: 2 }, next: "s11_buoy" },
        { id: "s11_swim_ask", label: "염봉수에게 괜찮은지 묻는다", effect: { legitimacy: 4, humanCost: -1, time: -1 }, cognition: { inference: 2 }, next: "s11_buoy" },
      ],
    },
    s11_buoy: {
      phase: "SIDE 11 BUOY",
      title: "손 흔들기",
      speaker: "오진우",
      place: "경포 해변 · 부표",
      clock: "09:04",
      text: "오진우가 한서윤 옆으로 돌아가 같이 뜹니다. 잠시 뒤 둘은 천천히 부표까지 헤엄쳐 가 동시에 짚습니다. 해변에서 보면 둘 다 콩알만 합니다. 오진우가 숨을 고르며 말합니다. '월요일에 뭐가 되든, 오늘은 여기까지 왔습니다.' 한서윤이 부표를 잡은 채 손을 흔듭니다. 염봉수가 호루라기를 짧게 한 번 붑니다. 다 셌다는 신호입니다. 강태민이 컵라면 물을 끓이러 펜션 쪽으로 뛰어갑니다. 초시계에는 숫자 하나가 남아 있습니다.",
      question: "둘이 같이 부표를 짚었습니다. 초시계의 숫자를 어떻게 하겠습니까?",
      memo: ["둘이 동시에 부표를 짚음", "오진우: '월요일에 뭐가 되든, 오늘은 여기까지'", "염봉수의 호루라기: 다 셌다는 신호"],
      triggers: ["recognition", "affection", "choice"],
      choices: [
        { id: "s11_buoy_keep", label: "숫자를 그대로 적어 둔다", effect: { legitimacy: 5, trust: 2, time: -1 }, cognition: { inference: 2 }, next: "s11_aftershock" },
        { id: "s11_buoy_reset", label: "초시계를 0으로 돌려 놓는다", effect: { trust: 5, fatigue: -2, time: -1 }, cognition: { reframing: 2 }, next: "s11_aftershock" },
        { id: "s11_buoy_wave", label: "해변에서 마주 손을 흔든다", effect: { trust: 6, humanCost: -1, time: -1 }, cognition: { persistence: 1, reframing: 1 }, next: "s11_aftershock" },
      ],
    },
    s11_aftershock: {
      phase: "SIDE 11 AFTERMATH",
      title: "방명록",
      speaker: "강태민",
      place: "경포 물결스테이 펜션 · 마당",
      clock: "11:50",
      text: "점심 전, 펜션 마당 평상에 방명록이 펼쳐져 있습니다. 첫 장에는 나준혁의 도장 세 개와 강태민의 '또 옴'. 컵라면은 넷이 나눠 먹었고, 오진우는 흰 페인트를 아직 다 못 지웠습니다. 한서윤은 평상에 누워 처음으로 휴대폰을 엎어 둡니다. 강태민이 볼펜을 당신에게 건넵니다. '오늘 거 한 줄은 심판이 써야죠.' 이틀 뒤 월요일이 무엇이 되든, 이 한 줄은 이 집에 남습니다.",
      question: "방명록에 오늘의 한 줄을 씁니다. 무엇을 쓰겠습니까?",
      memo: ["방명록 첫 장: 도장 세 개, '또 옴'", "재경기: 둘이 동시에 부표", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "affection", "recognition"],
      choices: [
        { id: "s11_after_record", label: "재경기 기록을 초 단위로 적는다", effect: { legitimacy: 5, trust: 2 }, cognition: { inference: 2 }, next: "s11_result" },
        { id: "s11_after_nobody", label: "'9시까지 아무도 재지 않기'라고 쓴다", effect: { trust: 6, fatigue: -3 }, cognition: { reframing: 2 }, next: "s11_result" },
        { id: "s11_after_none", label: "아무것도 쓰지 않고 서울로 출발한다", effect: { time: 4, trust: -2 }, cognition: { risk: 1 }, next: "s11_result" },
      ],
    },
  },
  outcomes: {
    s11_after_record: {
      title: "동시",
      text: "당신은 이렇게 씁니다. '9월 5일 09:00 재경기, 부표까지 오진우·한서윤 동시. 기록 4분 11초. 심판 확인.' 강태민이 그 아래 '심판 공정함'이라고 덧붙이고, 권도현은 괄호 안에 '중간 정지 2분 포함'이라고 적습니다. 오진우는 그 줄을 휴대폰으로 찍어 두고, 한서윤은 찍지 않습니다. 오후 3시, 차는 서울로 출발합니다. 여름이 끝날 때까지 그 방명록 페이지는 넘겨지지 않습니다.",
    },
    s11_after_nobody: {
      title: "09:00까지",
      text: "당신은 이렇게 씁니다. '9월 5일, 9시까지 아무도 재지 않기.' 권도현이 한참 보더니 그 옆에 세로줄을 긋고 '쉰 시간 3시간 20분'이라고 적습니다. 결국 또 잰 것입니다. 한서윤이 웃습니다. 오후, 염봉수가 펜션 앞을 지나다 방명록을 봅니다. 그는 펜으로 맨 아래에 '이유 있는 사람들, 오늘은 무사'라고 쓰고 갑니다. 오진우의 손등에 남은 흰 페인트는 그 주 내내 지워지지 않습니다.",
    },
    s11_after_none: {
      title: "출발",
      text: "당신은 아무것도 쓰지 않습니다. 방명록은 '또 옴'에서 멈춘 채 덮이고, 당신과 넷은 점심 전에 서울로 출발합니다. 휴게소에서 한서윤이 습관처럼 주머니를 뒤졌다가 빈손을 웃으며 꺼냅니다. 오진우는 조수석에서 잠듭니다. 초시계에는 숫자 하나가 남아 있지만 아무도 그것을 다시 보지 않습니다. 그날 오후, 염봉수는 감시탑 사다리의 열네 칸을 한 번 더 칠합니다. 부표는 늘 그 자리에 떠 있습니다.",
    },
  },
};
