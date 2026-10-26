/**
 * 번외 3 -- 보통의 밤 (E-11, 설계안 질문 6 (3)).
 *
 * A Saturday night in November 2025, 11월 8일, from 21:30 to the 06:00 send:
 * the night shift of 플로우온's fulfilment centre, three weeks before the first
 * snow of 사건 16 and five days before 수능, whose evening brings the first
 * rumour of robots to the group chat (c16_start_warm). Nobody on the floor
 * has heard of robots, a lease or 31 December. The player who has closed a
 * finale has.
 *
 * The centre has posted a notice: tonight every worker's picks per hour are
 * measured, "결과는 연말 계약 갱신 때 참고합니다". 강태민 asks the analyst to
 * come and watch, because the analyst reads numbers. What the night finds is
 * what the scanner does not count: 강태민 carrying a colleague's water bundles
 * with his wrist scanner silent, 유하온 under conveyor 3 with a hairpin for 52
 * minutes and so at the bottom of the live ranking, 배수경 re-taping split
 * boxes left-handed that were already counted to whoever packed them first.
 * The idle-reason menu has four entries -- 휴식, 교육, 설비 대기, 기타 -- and
 * the sheet goes to head office at six by itself.
 *
 * It keeps clear of 사건 16. No robot, no lease, no 다람이, no 04:12 text and
 * no 120 or 31 December; 정우 형 is never named, and 강태민 still does not say
 * why he buys his cup noodles two at a time (c16_roof is where he does). The
 * endings say what the analyst leaves behind that morning, never that the
 * measurement changed anything; who stays on in 사건 16 is chosen by another
 * rule (강태민 + 35세 이하 남성 5명), and this case does not say so either.
 *
 * Its speakers are the season's, with portraits: 강태민, 배수경 and 유하온
 * (사건 16's packing line and youngest). The night manager and the day-shift
 * lead are spoken of and quoted, never a scene's speaker.
 *
 * The laughter is the ranking screen's smiling face beside the red bottom row
 * and 배수경's "2등은 손목 수술 한 번 더?"; the anger a sheet with no box for
 * fixing or carrying; the sorrow is the player's alone -- 강태민's "내년에도
 * 이렇게만 했으면 좋겠네요" on the loading dock; the joy a whiteboard of
 * everything eighty people did that no screen counted.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): ten
 * scenes, `s3_aftershock`'s three cards to `s3_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side03 = {
  id: "side03",
  label: "번외 3",
  title: "보통의 밤",
  startNode: "s3_start",
  // A table from just before 사건 15, not this device's season.
  startState: {
    resources: { time: 50, capital: 58, trust: 60, legitimacy: 54, humanCost: 22, fatigue: 36 },
  },
  nodes: {
    s3_start: {
      phase: "SIDE 03 BRIEFING",
      title: "두 개씩",
      speaker: "강태민",
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "11월 8일 (토) 21:30, 야간조 출근 30분 전",
      lead: "첫눈이 오기 3주 전, 11월의 토요일 밤. 야간조 반장 강태민이 숫자 잘 보는 사람이 필요하다며 당신을 부릅니다.",
      text: "강태민이 방문자용 형광 조끼를 내밉니다. 자기 조끼 주머니에는 늘 그렇듯 컵라면이 두 개 꽂혀 있습니다. '토요일 밤에 불러서 미안해요. 낮에 오라고 할 땐 안 오더니.' 그가 대기실 게시판을 턱으로 가리킵니다. A4 한 장이 붙어 있습니다. '오늘 야간, 개인별 처리량 측정. 결과는 연말 계약 갱신 때 참고합니다.' 그 밑에 누군가 볼펜으로 '왜 하필 토요일'이라고 적어 놓았습니다. 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. '숫자로 우리를 잰대요. 근데 숫자는 분석관님이 더 잘 보잖아요. 오늘 밤만 옆에서 봐 줘요.'",
      question: "강태민이 오늘 밤의 측정을 옆에서 봐 달라고 합니다. 어떻게 하겠습니까?",
      memo: ["측정 공지: 오늘 야간, 개인별 처리량", "'결과는 연말 계약 갱신 때 참고합니다'", "야간조 80명, 22:00 ~ 06:00", "강태민의 조끼 주머니: 컵라면 두 개"],
      triggers: ["trust", "curiosity", "responsibility"],
      choices: [
        { id: "s3_start_vest", label: "조끼를 입고 오늘 밤 끝까지 옆에 있겠다고 한다", effect: { trust: 10, humanCost: -3, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s3_board" },
        { id: "s3_start_notice", label: "공지문을 찍어 두고 측정 기준부터 묻는다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s3_board" },
        { id: "s3_start_light", label: "토요일 밤이니 가볍게 구경만 하겠다고 한다", effect: { time: 5, trust: -3, fatigue: -2 }, cognition: { risk: 1 }, next: "s3_board" },
      ],
    },
    s3_board: {
      phase: "SIDE 03 BOARD",
      title: "웃는 얼굴",
      speaker: "배수경",
      place: "야간조 대기실 · 순위 화면 앞",
      clock: "22:20",
      text: "대기실 벽의 큰 화면에 오늘 처음 보는 표가 뜹니다. 실시간 처리량 순위. 한 시간에 몇 건을 찾고 담고 쌌는지, 이름 옆에 막대가 자랍니다. 맨 아래 칸은 빨간색이고, 그 옆에 웃는 얼굴 그림과 '힘내세요!'가 붙어 있습니다. 포장 라인 9년차 배수경이 손목 보호대를 조이며 화면을 올려다봅니다. '1등 하면 뭐 줘요? 2등은 손목 수술 한 번 더?' 대기실에 웃음이 터집니다. 그가 당신의 등을 두 번 두드립니다. '근데 저 막대, 내가 테이프 다시 붙이는 건 안 세요. 터진 상자는 다시 싸야 나가는데.' 화면 맨 위에는 벌써 강태민의 이름이 올라가 있습니다.",
      question: "웃는 얼굴 그림이 맨 아래 이름을 응원합니다. 무엇부터 보겠습니까?",
      memo: ["순위 화면: 한 시간 처리 건수, 이름마다 막대", "맨 아래 칸: 빨간색, 웃는 얼굴, '힘내세요!'", "배수경: 다시 싼 상자는 세지 않음"],
      triggers: ["injustice", "affection", "system"],
      choices: [
        { id: "s3_board_laugh", label: "배수경의 농담을 끝까지 듣고 같이 웃는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s3_line" },
        { id: "s3_board_rule", label: "순위가 무엇을 세고 무엇을 빼는지 적어 둔다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s3_line" },
        { id: "s3_board_floor", label: "화면은 두고 바로 현장으로 내려간다", effect: { time: 5, legitimacy: -2, trust: -1, fatigue: 1 }, cognition: { risk: 2 }, next: "s3_line" },
      ],
    },
    s3_line: {
      phase: "SIDE 03 FLOOR",
      title: "B동 선반",
      speaker: "강태민",
      place: "물류센터 B동 선반 사이",
      clock: "23:10",
      text: "B동 선반 사이에서 강태민은 손목의 스캐너를 울리며 거의 뛰듯이 걷습니다. 삑, 담고, 삑, 담고. 화면 맨 위에 있을 만합니다. 그러다 통로 끝에서 그가 멈춥니다. 쉰이 넘은 동료 하나가 2리터 생수 여섯 묶음 앞에서 허리를 펴고 있습니다. 강태민이 말없이 묶음 세 개를 어깨에 얹고 수레까지 나릅니다. 그동안 손목 스캐너는 조용하고, 대기실 화면의 그의 막대도 멈춥니다. 돌아온 강태민이 숨을 고릅니다. '저건 안 세요. 근데 저거 안 하면 내일 저 형이 안 나와요.' 통로 저편, 컨베이어 쪽에서 쇠 긁히는 소리가 납니다.",
      question: "순위 1위가 순위에 잡히지 않는 일을 하고 있습니다. 어떻게 하겠습니까?",
      memo: ["강태민: 시간당 처리량 1위", "생수 묶음 나르기 -- 스캐너에 찍히지 않음", "컨베이어 3번 쪽에서 쇠 긁히는 소리"],
      triggers: ["affection", "system", "curiosity"],
      choices: [
        { id: "s3_line_carry", label: "남은 생수 묶음을 같이 수레까지 나른다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 5 }, cognition: { persistence: 2 }, next: "s3_jam" },
        { id: "s3_line_time", label: "스캐너가 멈춘 시간을 손목시계로 잰다", effect: { legitimacy: 8, trust: 1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s3_jam" },
        { id: "s3_line_pack", label: "소리는 두고 포장 라인으로 먼저 간다", effect: { time: 4, trust: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s3_tape" },
      ],
    },
    s3_jam: {
      phase: "SIDE 03 CONVEYOR",
      title: "컨베이어 3번",
      speaker: "유하온",
      place: "B동 컨베이어 3번 밑",
      clock: "23:40",
      text: "컨베이어 3번이 멈춰 있고, 벨트 밑으로 작업화 두 짝이 삐져나와 있습니다. 끈은 둘 다 풀려 있습니다. 야간조 막내 유하온이 귀에 꽂던 머리핀으로 롤러 사이를 긁어내고 있습니다. '롤러에 테이프가 감겼어요? 기사님은 월요일에 오시고요?' 벨트가 덜컹 돌기 시작합니다. 유하온이 기어 나와 기름 묻은 손으로 휴대폰을 봅니다. 대기실 화면 맨 아래 빨간 칸에 그의 이름이 있습니다. 비가동 52분. 일을 안 한 시간이라는 뜻입니다. 웃는 얼굴이 그를 응원합니다. '저 오늘 맨 아래예요? 고치는 건 일이 아닌가 봐요?' 그가 머리핀을 귀에 다시 꽂습니다.",
      question: "멈춘 벨트를 고친 사람이 순위 맨 아래에 있습니다. 어떻게 하겠습니까?",
      memo: ["컨베이어 3번: 롤러에 테이프가 감겨 멈춤", "정비 기사: 월요일에 옴", "유하온: 비가동 52분, 순위 맨 아래"],
      triggers: ["injustice", "recognition", "helplessness"],
      choices: [
        { id: "s3_jam_praise", label: "고친 걸 봤다고, 잘했다고 그대로 말해 준다", effect: { trust: 9, humanCost: -2, time: -2, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s3_tape" },
        { id: "s3_jam_log", label: "벨트가 멈춘 시각과 다시 돈 시각을 적는다", effect: { legitimacy: 9, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s3_tape" },
        { id: "s3_jam_later", label: "52분 이야기는 쉬는 시간으로 미룬다", effect: { time: 4, trust: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s3_break" },
      ],
    },
    s3_tape: {
      phase: "SIDE 03 PACKING",
      title: "테이프 세 번",
      speaker: "배수경",
      place: "포장 라인 끝",
      clock: "01:00",
      text: "포장 라인 끝에 귀퉁이가 터진 상자들이 쌓여 있습니다. 배수경이 상자를 하나씩 뜯어 물건을 꺼내고, 새 상자에 다시 담고, 테이프를 세 번 돌립니다. 오른손이 아니라 왼손으로 돌립니다. '오른손은 쉬는 중이에요. 왼손이 9년차고.' 다시 싼 상자는 순위 화면에 잡히지 않습니다. 처음 싼 사람 몫으로 이미 세어졌기 때문입니다. 배수경이 테이프를 끊으며 웃습니다. '이거 안 하면 아침에 누가 터진 상자를 받잖아. 받는 사람은 그걸 내가 싼 줄 알고.' 그가 앞치마 주머니의 파스를 만지작거립니다. '딸 등록금이 아직 남았거든. 그래서 이 일 오래 해야 돼.'",
      question: "아무도 세지 않는 상자를 배수경이 왼손으로 다시 쌉니다. 어떻게 하겠습니까?",
      memo: ["포장 라인: 귀퉁이 터진 상자 다시 싸기", "다시 싼 상자: 순위에 잡히지 않음(처음 싼 사람 몫)", "배수경: 왼손으로 테이프, '오른손은 쉬는 중'"],
      triggers: ["affection", "injustice", "responsibility"],
      choices: [
        { id: "s3_tape_hold", label: "상자를 잡아 주며 테이프 끝을 같이 붙인다", effect: { trust: 9, humanCost: -3, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s3_break" },
        { id: "s3_tape_count", label: "오늘 다시 싼 상자를 하나씩 센다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s3_break" },
        { id: "s3_tape_rest", label: "오른손 얘기를 듣고 쉬는 시간을 당기자고 한다", effect: { trust: 4, humanCost: -2, time: 2, fatigue: -2 }, cognition: { reframing: 2 }, next: "s3_break" },
      ],
    },
    s3_break: {
      phase: "SIDE 03 BREAK",
      title: "쉬는 시간 30분",
      speaker: "강태민",
      place: "야간조 대기실",
      clock: "02:30",
      text: "대기실 전기포트 네 대가 한꺼번에 끓습니다. 80명이 의자와 바닥과 사물함 앞에 흩어져 앉습니다. 사물함 80칸마다 이름이 마스킹테이프로 붙어 있습니다. 강태민이 조끼 주머니에서 컵라면 두 개를 꺼내 하나를 당신 앞에 놓습니다. 배수경이 국물을 불며 웃습니다. '반장님은 꼭 두 개씩 사요. 왜냐고 물어도 안 알려 줘.' 강태민은 대답 대신 젓가락을 쪼갭니다. 유하온이 휴대폰으로 순위 화면을 보여 줍니다. 쉬는 30분 동안 80명의 막대가 한꺼번에 멈춰 있습니다. '이것 봐요? 지금은 우리 다 같이 맨 아래예요?' 이번에는 강태민까지 웃습니다.",
      question: "80명이 같은 30분을 쉬고, 화면은 그 30분을 모두의 빈칸으로 셉니다. 어떻게 하겠습니까?",
      memo: ["쉬는 시간 30분: 전기포트 네 대", "사물함 80칸, 이름은 마스킹테이프", "강태민의 컵라면: 늘 두 개 -- 이유는 말하지 않음", "쉬는 동안 80명의 막대가 함께 멈춤"],
      triggers: ["affection", "trust", "curiosity"],
      choices: [
        { id: "s3_break_eat", label: "컵라면을 다 먹을 때까지 숫자 얘기는 꺼내지 않는다", effect: { trust: 10, humanCost: -2, time: -3, fatigue: -3 }, cognition: { persistence: 2 }, next: "s3_count" },
        { id: "s3_break_list", label: "화면에 안 잡힌 일을 같이 세어 보자고 한다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 1, reframing: 1 }, next: "s3_count" },
        { id: "s3_break_sheet", label: "쉬는 동안 관리자 화면부터 보러 간다", effect: { time: 4, legitimacy: 2, trust: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s3_sheet" },
      ],
    },
    s3_count: {
      phase: "SIDE 03 TALLY",
      title: "손으로 세기",
      speaker: "유하온",
      place: "야간조 대기실 · 화이트보드 앞",
      clock: "02:50",
      text: "쉬는 시간이 끝나기 전에 유하온이 화이트보드를 끌고 옵니다. 당신이 칸을 나누고, 80명이 하나씩 부릅니다. 컨베이어 고친 것 세 번. 터진 상자 다시 싼 것 서른여덟 개. 생수 묶음 대신 든 것 스물몇 번, 정확히는 모름. 신입 둘 데리고 다닌 것. 유하온이 마커를 들고 말이 빨라집니다. '롤러에 감긴 테이프요? 그거 터진 상자에서 떨어진 거예요? 그럼 수경 이모 일이랑 제 일이 한 줄이에요?' 배수경이 그의 등을 두 번 두드립니다. '그걸 이제 알았어?' 보드가 금방 찹니다. 순위 화면에는 이 줄이 한 칸도 없습니다.",
      question: "80명이 부른 일이 보드를 채웠고, 화면에는 하나도 없습니다. 어떻게 하겠습니까?",
      memo: ["손으로 센 일: 컨베이어 수리 3번, 다시 싼 상자 38개", "생수 묶음 대신 든 것: 스물몇 번, 정확히는 모름", "순위 화면: 이 줄은 한 칸도 없음"],
      triggers: ["recognition", "curiosity", "system"],
      choices: [
        { id: "s3_count_names", label: "줄마다 한 사람의 이름을 같이 적는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s3_sheet" },
        { id: "s3_count_photo", label: "보드를 지우기 전에 시각이 보이게 찍어 둔다", effect: { legitimacy: 9, trust: 1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s3_sheet" },
        { id: "s3_count_line", label: "유하온이 찾은 '한 줄'을 따로 크게 적는다", effect: { trust: 6, legitimacy: 3, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s3_sheet" },
      ],
    },
    s3_sheet: {
      phase: "SIDE 03 SHEET",
      title: "사유 칸",
      speaker: "강태민",
      place: "센터 관리자석",
      clock: "04:20",
      text: "관리자석 모니터에 오늘 밤의 측정표가 떠 있습니다. 여섯 시가 되면 본사로 저절로 보내집니다. 막대가 멈춘 시간마다 '비가동 사유'를 하나 골라야 합니다. 고를 수 있는 것은 넷입니다. 휴식, 교육, 설비 대기, 기타. '고침'도, '나름'도, '다시 싸기'도 없습니다. 야간 관리자가 하품을 하며 말합니다. '기타로 하세요. 비고는 어차피 아무도 안 읽어요.' 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. 그가 화면의 자기 이름과 유하온의 이름을 손가락으로 차례로 짚습니다. '맨 위랑 맨 아래가 오늘 밤 한 일은 비슷해요. 이 칸이 모를 뿐이지.'",
      question: "고친 일과 나른 일을 고를 칸이 없습니다. 어떻게 하겠습니까?",
      memo: ["측정표: 06:00 본사로 자동 전송", "비가동 사유: 휴식 / 교육 / 설비 대기 / 기타", "야간 관리자: '비고는 어차피 아무도 안 읽어요'"],
      triggers: ["system", "injustice", "choice"],
      choices: [
        { id: "s3_sheet_try", label: "사유 하나를 골라 비고에 한 줄 써 본다", effect: { legitimacy: 8, trust: 3, time: -4, fatigue: 4 }, cognition: { persistence: 1, inference: 1 }, next: "s3_dawn" },
        { id: "s3_sheet_ask", label: "관리자에게 사유 칸을 더할 수 있는지 묻는다", effect: { legitimacy: 6, trust: 2, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s3_dawn" },
        { id: "s3_sheet_close", label: "여섯 시 전까지 손대지 않고 마무리로 간다", effect: { time: 5, trust: -1, legitimacy: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s3_aftershock" },
      ],
    },
    s3_dawn: {
      phase: "SIDE 03 DOCK",
      title: "다섯 시의 트럭",
      speaker: "배수경",
      place: "출고장",
      clock: "05:20",
      text: "출고장 셔터가 올라가고, 새벽 배송 트럭들이 한 대씩 빠져나갑니다. 오늘 밤 다시 싼 상자들도 그 안에 있습니다. 배수경이 출고장 턱에 걸터앉아 손목 보호대를 풉니다. 하늘은 아직 깜깜합니다. '받는 사람들은 모르지. 이 상자를 두 번 쌌는지, 누가 쌌는지.' 그가 웃으며 당신의 등을 두 번 두드립니다. '모르는 게 맞아요. 몰라도 되게 하는 게 우리 일이니까.' 유하온이 떠나는 트럭에 손을 흔듭니다. 강태민은 셔터 옆에서 출고 대수를 세다가 말합니다. '내년에도 이렇게만 했으면 좋겠네요.' 아무도 대답하지 않습니다. 트럭 한 대가 더 나갑니다.",
      question: "받는 사람은 모르는 일이 트럭에 실려 나갑니다. 어떻게 하겠습니까?",
      memo: ["새벽 배송 트럭 출발, 다시 싼 상자도 함께", "배수경: '몰라도 되게 하는 게 우리 일'", "강태민: '내년에도 이렇게만 했으면'"],
      triggers: ["affection", "helplessness", "trust"],
      choices: [
        { id: "s3_dawn_sit", label: "턱에 같이 앉아 마지막 트럭이 나갈 때까지 본다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s3_aftershock" },
        { id: "s3_dawn_count", label: "강태민과 오늘 밤 출고 대수를 맞춰 본다", effect: { legitimacy: 8, trust: 2, time: -2, fatigue: 3 }, cognition: { inference: 2 }, next: "s3_aftershock" },
        { id: "s3_dawn_wave", label: "유하온 옆에서 트럭에 같이 손을 흔든다", effect: { trust: 6, humanCost: -1, fatigue: -2 }, cognition: { reframing: 1 }, next: "s3_aftershock" },
      ],
    },
    s3_aftershock: {
      phase: "SIDE 03 AFTERMATH",
      title: "여섯 시 전송",
      speaker: "강태민",
      place: "야간조 대기실",
      clock: "05:50, 전송 10분 전",
      text: "퇴근 카드를 찍는 줄이 출입구까지 늘어섭니다. 화이트보드에는 오늘 밤 손으로 센 일이 남아 있고, 관리자석 모니터에는 여섯 시 전송을 기다리는 측정표가 떠 있습니다. 순위 화면 맨 위에는 강태민, 맨 아래에는 유하온. 웃는 얼굴은 아직 '힘내세요!'를 말하고 있습니다. 강태민이 빈 컵라면 용기 두 개를 포개 쓰레기통에 넣습니다. '보통 밤이었어요. 늘 이래요.' 그가 화이트보드와 모니터를 번갈아 봅니다. '저건 아침이면 낮 조가 지우고, 저건 본사로 가요. 분석관님이 정해요. 뭘 남길지.'",
      question: "보통의 밤이 끝나 갑니다. 무엇을 남기겠습니까?",
      memo: ["화이트보드: 낮 조가 오면 지워짐", "측정표: 06:00 본사로", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "recognition", "affection"],
      choices: [
        { id: "s3_after_board", label: "보드에 '지우지 마세요' 쪽지를 붙인다", effect: { trust: 6, humanCost: -2 }, cognition: { persistence: 2 }, next: "s3_result" },
        { id: "s3_after_memo", label: "유하온에게 고친 일을 직접 적어 두라고 한다", effect: { trust: 4, legitimacy: 3 }, cognition: { reframing: 2 }, next: "s3_result" },
        { id: "s3_after_note", label: "측정표 비고 칸에 오늘 한 일을 다 적는다", effect: { legitimacy: 6, trust: 1 }, cognition: { inference: 2 }, next: "s3_result" },
      ],
    },
  },
  outcomes: {
    s3_after_board: {
      title: "지우지 마세요",
      text: "당신이 화이트보드 귀퉁이에 쪽지를 붙입니다. '지우지 마세요. 야간조가 오늘 밤 한 일.' 여섯 시 반, 낮 조 반장이 지우개를 들고 왔다가 쪽지를 읽습니다. 한참 서 있던 그가 지우개를 내려놓고, 맨 아래에 한 줄을 더 씁니다. '낮 조: 지게차 배터리 대신 갈아 끼운 것 일곱 번.' 오후에 강태민에게서 사진이 옵니다. 보드의 줄이 다섯 개 늘었습니다. 누가 지울지 정한 사람이 없어서, 보드는 그 주 내내 그대로입니다.",
    },
    s3_after_memo: {
      title: "한 줄씩",
      text: "당신이 유하온에게 말합니다. 고친 건 고친 사람이 적어 두면 일이 된다고. 유하온이 머리핀을 뺐다가 다시 꽂습니다. 그러고는 액정에 금이 간 휴대폰에 첫 줄을 씁니다. '컨베이어 3번, 롤러에 테이프, 52분.' 강태민이 어깨 너머로 보다가 말합니다. '네가 적으면 그게 일이야.' 다음 날 밤, 야간조 단체방에 사진이 올라옵니다. 메모가 두 줄이 됐습니다. 그 밑에 유하온이 묻습니다. '이거 계속 써도 돼요?'",
    },
    s3_after_note: {
      title: "기타",
      text: "강태민이 자판을 치고, 당신이 불러 줍니다. 비가동 칸마다 '기타'를 고르고, 비고에 한 일을 한 줄씩 씁니다. 컨베이어 3번 수리. 생수 묶음 나르기. 터진 상자 다시 싸기 서른여덟 개. 여섯 시, 전송이 끝납니다. 답은 오지 않습니다. 강태민이 퇴근 카드를 찍으며 말합니다. '아무도 안 읽는다던데요.' 그러고는 혼자 덧붙입니다. '그래도 적혀는 있네요.' 그가 새 컵라면 하나를 당신 조끼 주머니에 꽂아 줍니다. '다음엔 낮에 와요.'",
    },
  },
};
