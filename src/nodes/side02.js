/**
 * 번외 2 -- 돌려줄 것 (E-11, 설계안 질문 6 (2)).
 *
 * A Friday night in January 2026, 1월 9일: the shutter of 임경수's used-book
 * shop in 회기동 has carried a demolition notice since 섣달그믐, and the date
 * on it is still 4월 14일 -- ten days later it is pulled forward to 1월 22일
 * and 사건 19 begins. 임경수 is in hospital with the pneumonia that was then
 * mending. He asks his granddaughter 임소율 to fetch one box from the second
 * floor and give what is in it back to its owner, and she calls the analyst,
 * whose number she has from her text of 12월 31일 (사건 18).
 *
 * In the 1998 box is a file: 순자봉제, a sewing workshop in 창신동, twelve
 * machines and eleven people, owner 양순자. In the spring of 1998 the bank --
 * 경동은행, which 킹스데일 파트너스 of New York was buying and would rename
 * KD은행 -- called in every small-business loan whose books no outside auditor
 * had checked, so that the book went over clean. Hers had never been a month
 * late in six years; the proof was six notebooks of her own accounts, which
 * she lent the bank and never got back. 임경수, then thirty-four, wrote two
 * pages against calling it, was overruled, carried her machines down on the
 * day the workshop closed, and promised to return the notebooks himself. On
 * the file is his note: 「돌려줄 것. 내가 직접.」 Twenty-eight years.
 *
 * The night goes to 창신동 and then to the 동대문 wholesale market, which
 * opens at night: the stall named in her ledger is now run by her daughter
 * 한미진, who drew on the last page of the last notebook at nine.
 *
 * It keeps clear of 사건 19. Nothing happens inside its seventy-two hours;
 * 임소율 still calls the paper 짐, and does not read the margins of the boxes
 * -- that night belongs to 사건 19's labels (1월 21일 03:00), and her birthday
 * is "not in a box" because it is in a book on the ground floor
 * (c19_branch_bookshop_follow). The endings say where the notebooks go and
 * not whether 임경수 ever went himself (사건 45).
 *
 * Its speakers are the season's, with portraits: 임소율, 임경수 (on a video
 * call from his ward) and 도윤하, whom market people talk to. 양순자 and
 * 한미진 are spoken of and quoted, never a scene's speaker.
 *
 * The laughter is 임소율 reviewing a nine-year-old's drawing as a working
 * webtoon artist, 임경수 finding a box by catalogue over a video call, and
 * 도윤하 mistaken for a buyer's runner and loaded with bundles. The anger is a
 * clean book for a buyer; the sorrow a daughter who says what 임소율 thinks of
 * her grandfather; the joy 양순자's notebook of tonight, still kept by hand.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): eleven
 * scenes, `s2_aftershock`'s three cards to `s2_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side02 = {
  id: "side02",
  label: "번외 2",
  title: "돌려줄 것",
  startNode: "s2_start",
  // A table from just before 사건 19, not this device's season.
  startState: {
    resources: { time: 52, capital: 60, trust: 58, legitimacy: 55, humanCost: 20, fatigue: 34 },
  },
  nodes: {
    s2_start: {
      phase: "SIDE 02 BRIEFING",
      title: "빨간 테이프",
      speaker: "임소율",
      place: "회기동 헌책방 앞",
      clock: "1월 9일 (금) 19:00, 철거 예정일은 아직 4월 14일",
      lead: "철거 날짜가 아직 4월 14일이던 1월의 금요일 밤. 임경수의 손녀 임소율이 상자 하나를 같이 찾아 달라고 연락해 옵니다.",
      text: "헌책방 셔터에 섣달그믐에 붙은 철거 예고문이 그대로 있습니다. 날짜는 4월 14일. 패딩 모자를 눌러쓴 임소율이 열쇠 꾸러미를 흔듭니다. '할아버지가 병원에서 숙제를 내줬어요. 1998년 상자, 빨간 테이프. 안에 든 걸 주인한테 돌려주래요. 오늘 밤 안에요.' 그가 2층 창문을 올려다봅니다. '저 짐 속에서 상자 하나를 찾으라는 거예요. 할아버지는 내 생일은 몰라도 상자 자리는 다 알아요.' 셔터가 반쯤 올라가다 걸립니다. 임소율이 발로 한 번 찹니다. '같이 가 줄 사람이 당신밖에 없었어요.'",
      question: "임경수가 손녀에게 상자 하나를 돌려주라는 숙제를 냈습니다. 어떻게 하겠습니까?",
      memo: ["철거 예고문: 4월 14일 -- 아직 석 달", "임경수: 이음병원 입원, 폐렴이 나아 가는 중", "1998년 상자, 빨간 테이프 -- '주인한테 돌려줄 것'"],
      triggers: ["affection", "responsibility", "curiosity"],
      choices: [
        { id: "s2_start_go", label: "셔터를 같이 올리고 2층으로 따라 올라간다", effect: { trust: 10, humanCost: -3, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s2_shelf" },
        { id: "s2_start_call", label: "올라가기 전에 임경수에게 영상 통화를 건다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s2_shelf" },
        { id: "s2_start_quick", label: "상자만 찾아 들고 바로 내려오자고 한다", effect: { time: 6, capital: 2, trust: -4, fatigue: -2 }, cognition: { risk: 2 }, next: "s2_shelf" },
      ],
    },
    s2_shelf: {
      phase: "SIDE 02 SHELF",
      title: "왼쪽 세 번째 칸",
      speaker: "임경수",
      place: "회기동 헌책방 2층",
      clock: "19:30",
      text: "2층은 난로를 켤 수 없어 입김부터 나옵니다. 연도를 매직으로 적은 사과 상자들이 천장까지 쌓여 있습니다. 휴대전화 화면 속 임경수는 병상에 기대 앉아 있습니다. 콧줄은 없고 안경은 썼습니다. '계단에서 왼쪽, 세 번째 칸. 위에서 네 번째. 1997 밑에 있네.' 임소율이 상자를 하나씩 내릴 때마다 그가 먼저 연도를 맞힙니다. 빨간 테이프가 나옵니다. 임소율이 화면에 대고 묻습니다. '그럼 내 생일은 몇 번째 칸에 있어요?' 임경수가 기침을 합니다. '...그건 상자에 없어.' 임소율이 코웃음을 칩니다. '그럴 줄 알았어요.'",
      question: "상자 자리는 정확히 아는 사람이, 손녀의 질문에는 대답을 못 합니다. 어떻게 하겠습니까?",
      memo: ["임경수: 영상 통화로 상자 자리를 하나씩 맞힘", "1998년 상자, 빨간 테이프 -- 1997년 상자 밑", "'내 생일은?' -- '그건 상자에 없어'"],
      triggers: ["affection", "curiosity", "selfAwareness"],
      choices: [
        { id: "s2_shelf_both", label: "두 사람 대화가 끝날 때까지 상자를 받쳐 든다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s2_ledger" },
        { id: "s2_shelf_open", label: "테이프를 뜯기 전에 상자 겉의 글씨부터 찍는다", effect: { legitimacy: 8, trust: 1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s2_ledger" },
        { id: "s2_shelf_cut", label: "통화를 끊고 상자부터 열어 보자고 한다", effect: { time: 5, trust: -3, fatigue: -1 }, cognition: { risk: 1 }, next: "s2_ledger" },
      ],
    },
    s2_ledger: {
      phase: "SIDE 02 FILE",
      title: "대학노트 여섯 권",
      speaker: "임소율",
      place: "회기동 헌책방 2층",
      clock: "19:50",
      text: "상자 안에는 대출 서류철 하나와 대학노트 여섯 권이 들어 있습니다. 서류철 표지에 '순자봉제 · 창신동 · 1998.4', 그 위에 노란 메모지 한 장. '돌려줄 것. 내가 직접.' 노트는 1992년부터 1998년까지, 날마다 손으로 쓴 장부입니다. 원단값, 미싱 기름, 직원 열한 명의 월급. 매달 25일 칸에는 같은 줄이 있습니다. '은행 이자 -- 냄.' 한 번도 빠지지 않았습니다. 마지막 권 마지막 장에는 크레파스 그림이 있습니다. 미싱 열두 대 앞에 아주 작은 여자 하나. 구석에 '미진 9살'. 임소율이 직업병처럼 그림을 들여다봅니다. '미싱 바늘 개수는 정확한데요, 엄마 얼굴이 미싱보다 작아요.'",
      question: "6년 동안 한 번도 이자를 거르지 않은 장부가 은행 상자에 있었습니다. 무엇부터 하겠습니까?",
      memo: ["순자봉제: 창신동, 미싱 12대, 직원 11명, 사장 양순자", "장부 6권(1992~1998): 이자를 한 번도 거르지 않음", "임경수의 메모: '돌려줄 것. 내가 직접.'", "마지막 장: 크레파스 그림, '미진 9살'"],
      triggers: ["curiosity", "injustice", "affection"],
      choices: [
        { id: "s2_ledger_ask", label: "왜 이 장부가 은행에 남았는지 임경수에게 묻는다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s2_why" },
        { id: "s2_ledger_draw", label: "임소율이 그림 이야기를 끝까지 하게 둔다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s2_why" },
        { id: "s2_ledger_go", label: "서류철의 주소부터 들고 바로 창신동으로 간다", effect: { time: 6, capital: 1, trust: -2, legitimacy: -2, fatigue: 1 }, cognition: { risk: 2 }, next: "s2_address" },
      ],
    },
    s2_why: {
      phase: "SIDE 02 RECORD",
      title: "깨끗한 장부",
      speaker: "임경수",
      place: "회기동 헌책방 2층 · 영상 통화",
      clock: "20:15",
      text: "임경수가 안경을 벗어 닦습니다. '1998년 봄, 경동은행은 팔리는 중이었네. 사는 쪽은 뉴욕의 킹스데일 파트너스. 그쪽 실사(사기 전에 장부를 뜯어보는 조사)팀이 목록을 내려보냈지. 외부 감사를 안 받은 작은 회사 대출은 인수 전에 다 정리하라고. 깨끗한 장부로 넘기라는 거야.' 그가 숨을 고릅니다. '양 사장은 6년 동안 이자를 하루도 안 밀렸어. 그 증거로 저 노트를 빌려 갔지. 나는 정리하면 안 된다고 두 장을 썼고, 반려됐네.' 서류철 사이에서 누렇게 바랜 종이 두 장이 나옵니다. 반대 의견서. 작성자 칸에 서른네 살 임경수의 이름이 있습니다. '공장은 6주 만에 문을 닫았어.'",
      question: "갚고 있던 대출이 팔리는 장부를 깨끗하게 하려고 정리됐습니다. 어떻게 하겠습니까?",
      memo: ["1998년 봄: 경동은행 매각 -- 인수자 킹스데일 파트너스(뉴욕)", "실사팀 목록: 외부 감사 없는 소기업 대출은 인수 전 정리", "임경수(34)의 반대 의견서 두 장 -- 반려", "순자봉제: 정리 6주 뒤 폐업"],
      triggers: ["injustice", "system", "responsibility"],
      choices: [
        { id: "s2_why_find", label: "양순자 씨가 지금 어디 있는지부터 찾는다", effect: { trust: 8, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s2_address" },
        { id: "s2_why_paper", label: "의견서 두 장을 날짜가 보이게 사진으로 남긴다", effect: { legitimacy: 10, trust: 1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s2_address" },
        { id: "s2_why_market", label: "장부의 거래처를 보고 동대문 시장으로 바로 간다", effect: { time: 5, legitimacy: 2, trust: -2, fatigue: 2 }, cognition: { risk: 1, inference: 1 }, next: "s2_market" },
      ],
    },
    s2_address: {
      phase: "SIDE 02 ROUTE",
      title: "창신동 계단 골목",
      speaker: "도윤하",
      place: "창신동 봉제 골목",
      clock: "21:10",
      text: "창신동 비탈길에는 밤에도 미싱 소리가 납니다. 마을버스에서 내린 도윤하가 패딩 지퍼를 올리며 뛰어옵니다. 시장 사람들은 이상하게 도윤하한테 말을 합니다. 서류철의 주소에는 '순자봉제' 대신 다른 공방 간판이 붙어 있습니다. 문을 두드리자 돋보기를 머리에 얹은 미싱 기사가 나옵니다. 장부 표지를 보더니 웃습니다. '순자 언니? 공장 닫고 동대문 나갔지. 지금은 딸이 가게 해. 밤 열 시에 문 여는 데.' 도윤하가 장부를 넘겨 거래처 목록을 짚습니다. '여기 매달 나오는 이름이 있어요. 동대문 도매상가 2층 87호.'",
      question: "공장 자리에는 다른 미싱이 돌고, 주인은 밤에 여는 시장으로 갔습니다. 어떻게 하겠습니까?",
      memo: ["창신동 주소: 지금은 다른 봉제 공방", "미싱 기사: '공장 닫고 동대문 나갔지, 지금은 딸이 가게 해'", "장부의 거래처: 동대문 도매상가 2층 87호", "도매상가: 밤 10시에 문을 연다"],
      triggers: ["trust", "curiosity", "helplessness"],
      choices: [
        { id: "s2_address_thanks", label: "미싱 기사에게 순자봉제 시절 이야기를 더 듣는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s2_market" },
        { id: "s2_address_list", label: "거래처 목록에서 87호가 나온 달을 모두 센다", effect: { legitimacy: 8, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s2_market" },
        { id: "s2_address_taxi", label: "택시를 잡아 문 여는 시간에 맞춰 간다", effect: { time: 5, capital: -2, trust: -1, fatigue: -1 }, cognition: { risk: 1 }, next: "s2_market" },
      ],
    },
    s2_market: {
      phase: "SIDE 02 MARKET",
      title: "밤 열 시의 도매상가",
      speaker: "도윤하",
      place: "동대문 도매상가 1층 통로",
      clock: "22:10",
      text: "밤 열 시, 도매상가 셔터들이 한꺼번에 올라갑니다. 검은 비닐 꾸러미를 실은 손수레가 통로를 메웁니다. 지방 옷가게 대신 옷을 사 주는 사입삼촌들입니다. 한 상인이 도윤하를 보자마자 꾸러미 세 개를 안깁니다. '삼촌, 대구 거 이거. 늦었어!' 도윤하가 얼떨결에 받아 들고, 버릇처럼 값을 묻습니다. '이거 열 장 묶음이면 얼마예요? 아, 저 삼촌 아닌데.' 상인이 웃으며 꾸러미를 도로 가져갑니다. 임소율이 장부를 품에 안은 채 2층 계단을 올려다봅니다. '할아버지 숙제치고는 사람이 너무 많네요.' 휴대전화가 울립니다. 임경수의 문자입니다. '찾았나.'",
      question: "밤에 여는 시장 한복판입니다. 2층 87호로 어떻게 가겠습니까?",
      memo: ["도매상가: 밤 10시 개장, 사입삼촌들의 손수레", "도윤하: 사입삼촌으로 오해받아 꾸러미 셋을 받음", "임경수의 문자: '찾았나.'"],
      triggers: ["curiosity", "affection", "trust"],
      choices: [
        { id: "s2_market_carry", label: "꾸러미 하나를 대신 날라 주며 길을 묻는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s2_stall" },
        { id: "s2_market_map", label: "층별 안내판에서 87호 자리를 먼저 찾는다", effect: { legitimacy: 6, time: -1, fatigue: 1 }, cognition: { inference: 2 }, next: "s2_stall" },
        { id: "s2_market_reply", label: "임경수에게 찾았다고 먼저 답장을 보낸다", effect: { trust: 6, humanCost: -1, time: -1, fatigue: -1 }, cognition: { reframing: 1 }, next: "s2_stall" },
      ],
    },
    s2_stall: {
      phase: "SIDE 02 STALL",
      title: "87호 미진",
      speaker: "임소율",
      place: "동대문 도매상가 2층 87호",
      clock: "22:50",
      text: "87호 간판에는 '미진'이라고만 적혀 있습니다. 서른 후반의 여자가 휴대전화 두 대로 주문 메시지를 받으면서 니트를 접고 있습니다. 한미진 씨입니다. 임소율이 장부 마지막 권을 펼쳐 보입니다. 접던 니트가 멈춥니다. '이거 내 그림인데.' 그가 크레파스 자국을 손톱으로 한 번 긁어 봅니다. '엄마가 이 노트 은행에 빌려줬다가 못 받았다고 했어요. 그거 없어서 다시는 대출을 못 받았대요. 증명할 게 없다고.' 주문 알림이 연달아 울립니다. 한미진 씨가 휴대전화를 엎어 놓습니다. '28년 동안 그 사람들, 이걸 어디다 둔 거예요?'",
      question: "장부를 잃은 뒤로 양순자 씨는 다시 대출을 받지 못했습니다. 어떻게 대답하겠습니까?",
      memo: ["87호 '미진': 한미진(37), 양순자의 딸", "장부가 없어 다시는 대출을 못 받음 -- '증명할 게 없다'", "'28년 동안 이걸 어디다 둔 거예요?'"],
      triggers: ["injustice", "helplessness", "responsibility"],
      choices: [
        { id: "s2_stall_true", label: "헌책방 2층 상자에 있었다고 있는 그대로 말한다", effect: { trust: 7, legitimacy: 4, humanCost: -1, time: -3, fatigue: 3 }, cognition: { persistence: 1, inference: 1 }, next: "s2_drawing" },
        { id: "s2_stall_mother", label: "어머니께 직접 말씀드릴 수 있는지 묻는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s2_mother" },
        { id: "s2_stall_note", label: "메모지 '내가 직접'을 먼저 보여 준다", effect: { legitimacy: 6, trust: 2, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s2_mother" },
      ],
    },
    s2_drawing: {
      phase: "SIDE 02 DRAWING",
      title: "주말의 미싱",
      speaker: "임소율",
      place: "동대문 도매상가 2층 87호",
      clock: "23:30",
      text: "손님이 뜸해지자 한미진 씨가 컵라면 두 개에 물을 붓습니다. 하나를 임소율에게 내밉니다. '이 그림 그린 날 기억나요. 토요일이었어요. 엄마는 주말에도 공장에 있었어요. 나보다 미싱이 중요한 줄 알았어요.' 임소율이 젓가락을 든 채 가만히 있습니다. 손등에 펜으로 작은 미싱 하나를 그립니다. 그림이 끝나기 전에는 말을 하지 않는 버릇입니다. 한미진 씨가 웃습니다. '근데 공장 닫던 날, 엄마가 이 노트부터 찾았대요. 미싱보다 먼저.' 임소율이 한참 만에 입을 엽니다. '우리 할아버지도 주말마다 2층에 있었어요.' 더는 말하지 않습니다.",
      question: "한미진 씨의 말이 임소율이 할아버지에게 하던 말과 같습니다. 어떻게 하겠습니까?",
      memo: ["한미진: '나보다 미싱이 중요한 줄 알았어요'", "공장 닫던 날, 양순자가 가장 먼저 찾은 것: 장부", "임소율: '우리 할아버지도 주말마다 2층에 있었어요'"],
      triggers: ["affection", "selfAwareness", "helplessness"],
      choices: [
        { id: "s2_drawing_quiet", label: "두 사람이 라면을 다 먹을 때까지 말을 아낀다", effect: { trust: 10, humanCost: -3, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s2_mother" },
        { id: "s2_drawing_page", label: "공장 닫던 날의 일을 장부에서 함께 찾아본다", effect: { legitimacy: 7, trust: 2, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s2_mother" },
        { id: "s2_drawing_joke", label: "임소율 손등의 미싱 그림을 칭찬해 분위기를 푼다", effect: { trust: 5, humanCost: -1, fatigue: -2 }, cognition: { reframing: 2 }, next: "s2_mother" },
      ],
    },
    s2_mother: {
      phase: "SIDE 02 CALL",
      title: "키 큰 심사역",
      speaker: "도윤하",
      place: "동대문 도매상가 2층 87호",
      clock: "00:20",
      text: "한미진 씨가 스피커폰으로 집에 전화를 겁니다. 일흔넷의 양순자 씨는 아직 깨어 있습니다. 밤에 수선 일을 하는 버릇이 남았다고 합니다. 장부 이야기를 듣자 한동안 미싱 소리만 들립니다. '그 심사역. 키 크고 안경 쓴. 공장 닫던 날 와서 미싱을 같이 날랐어. 넥타이를 주머니에 넣고.' 도윤하가 휴대전화 쪽으로 몸을 숙입니다. '그분이 지금 입원해 계세요. 노트를 직접 돌려드린다고 적어 두셨어요.' 양순자 씨가 웃습니다. '28년 걸렸네. 그 사람 아프다며. 그럼 나보고 병원에 가라는 거야, 기다리라는 거야?' 웃음 끝에 목소리가 조금 젖습니다.",
      question: "양순자 씨가 그날의 심사역을 기억합니다. 무엇을 하겠습니까?",
      memo: ["양순자(74): 아직 밤마다 수선 일", "공장 닫던 날: 심사역 임경수가 미싱을 같이 나름", "'28년 걸렸네. 병원에 가라는 거야, 기다리라는 거야?'"],
      triggers: ["affection", "trust", "responsibility"],
      choices: [
        { id: "s2_mother_listen", label: "양순자 씨가 그날 이야기를 끝낼 때까지 듣는다", effect: { trust: 10, humanCost: -3, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s2_notebook" },
        { id: "s2_mother_record", label: "1998년 4월의 날짜와 금액을 하나씩 확인한다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s2_notebook" },
        { id: "s2_mother_decide", label: "돌려줄 방법을 지금 이 자리에서 정하자고 한다", effect: { time: 5, trust: 2, legitimacy: -2, fatigue: -1 }, cognition: { risk: 2 }, next: "s2_aftershock" },
      ],
    },
    s2_notebook: {
      phase: "SIDE 02 NOTEBOOK",
      title: "오늘 밤의 장부",
      speaker: "임소율",
      place: "동대문 도매상가 2층 87호",
      clock: "01:30",
      text: "한미진 씨가 계산대 밑에서 노트 한 권을 꺼냅니다. 가게 주문은 다 앱으로 받는데, 이 노트에는 엄마 글씨가 있습니다. '엄마가 밤마다 이걸 써요. 수선 몇 벌, 실값 얼마. 앱에 다 있다고 해도 안 들어요.' 오늘 날짜 칸까지 채워져 있습니다. 임소율이 1998년 노트와 나란히 펼칩니다. 숫자 7의 꼬리, 줄 끝의 작은 점까지 똑같습니다. 28년 사이에 공장은 없어졌는데 글씨는 그대로입니다. 임소율이 두 노트를 사진으로 찍다가 말합니다. '이건 짐 아니네요. 한 권쯤은.' 그러고는 얼른 덧붙입니다. '할아버지 2층은 아직 짐이에요.'",
      question: "공장은 없어졌지만 장부를 쓰는 손은 남았습니다. 어떻게 하겠습니까?",
      memo: ["양순자의 오늘 노트: 밤마다 손으로 씀, 앱이 있어도", "1998년 노트와 같은 글씨 -- 숫자 7의 꼬리까지", "임소율: '이건 짐 아니네요. 한 권쯤은.'"],
      triggers: ["affection", "curiosity", "trust"],
      choices: [
        { id: "s2_notebook_side", label: "두 노트를 나란히 둔 채 한미진 씨 말을 더 듣는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s2_aftershock" },
        { id: "s2_notebook_years", label: "빈 28년을 오늘 노트가 잇는다고 적어 둔다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 2 }, cognition: { reframing: 1, inference: 1 }, next: "s2_aftershock" },
        { id: "s2_notebook_photo", label: "임소율이 찍은 사진을 임경수에게 보낸다", effect: { trust: 6, humanCost: -2, time: -1, fatigue: -1 }, cognition: { reframing: 1 }, next: "s2_aftershock" },
      ],
    },
    s2_aftershock: {
      phase: "SIDE 02 AFTERMATH",
      title: "돌려주는 법",
      speaker: "임소율",
      place: "동대문 도매상가 2층 87호",
      clock: "03:00, 셔터가 내려가기 전",
      text: "새벽 세 시, 통로의 손수레가 줄어듭니다. 계산대 위에 대학노트 여섯 권과 반려된 의견서 두 장, 노란 메모지가 놓여 있습니다. '돌려줄 것. 내가 직접.' 병원에서 문자가 옵니다. 새벽잠이 없는 임경수입니다. '주인은 찾았나. 자네들이 정하게.' 한미진 씨가 노트 표지를 쓰다듬다 손을 뗍니다. 임소율이 메모지를 집어 듭니다. '할아버지는 직접 하겠다고 써 놓고 28년을 못 했어요. 이번엔 누가 해요?' 그가 당신을 봅니다.",
      question: "28년 늦은 장부가 주인의 딸 앞에 있습니다. 어떻게 돌려주겠습니까?",
      memo: ["장부 6권, 반대 의견서 두 장, 메모지 '내가 직접'", "임경수의 문자: '자네들이 정하게.'", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "affection"],
      choices: [
        { id: "s2_after_hand", label: "장부 여섯 권을 한미진 씨 손에 지금 돌려준다", effect: { trust: 6, humanCost: -2 }, cognition: { persistence: 2 }, next: "s2_result" },
        { id: "s2_after_opinion", label: "장부와 함께 반려된 의견서 두 장도 건넨다", effect: { legitimacy: 6, trust: 2 }, cognition: { inference: 2 }, next: "s2_result" },
        { id: "s2_after_himself", label: "임경수가 직접 돌려주도록 상자에 다시 넣는다", effect: { time: 3, trust: 2 }, cognition: { reframing: 1 }, next: "s2_result" },
      ],
    },
  },
  outcomes: {
    s2_after_hand: {
      title: "여섯 권",
      text: "당신이 노트 여섯 권을 한미진 씨 품에 안깁니다. 그가 셔터를 내리고 택시를 잡습니다. 엄마가 깨어 있을 때 가져가겠다고 합니다. 아침 일곱 시, 임소율에게 사진 한 장이 옵니다. 양순자 씨가 돋보기를 쓰고 1998년 4월 장을 펼쳐 들고 있습니다. 아래에 짧은 글이 붙어 있습니다. '이자 칸 다 찼네. 내가 맞았네.' 임소율이 그 사진을 병원으로 보냅니다. 답이 옵니다. '그래. 그 사람이 맞았지.'",
    },
    s2_after_opinion: {
      title: "두 장",
      text: "당신이 장부 위에 반대 의견서 두 장을 얹습니다. 서른네 살 임경수가 '정리하면 안 된다'고 쓴 종이입니다. 반려 도장 옆에 그의 글씨가 그대로 있습니다. 한미진 씨가 두 장을 오래 읽습니다. '그때 엄마 편을 든 사람이 있었네요. 엄마는 몰랐어요.' 당신도 반려된 의견서를 하나 알고 있습니다. 한미진 씨가 의견서를 장부 맨 앞에 끼웁니다. '엄마한테 이것부터 읽으라고 할게요.'",
    },
    s2_after_himself: {
      title: "내가 직접",
      text: "당신이 장부를 빨간 테이프 상자에 다시 넣습니다. 임소율이 메모지 밑에 한 줄을 더 씁니다. '퇴원하면 할아버지가 직접. 손녀가 확인함.' 한미진 씨가 엄마에게 전합니다. 스피커폰 너머에서 양순자 씨가 웃습니다. '그럼 기다리지 뭐. 28년도 기다렸는데.' 상자는 다시 회기동 2층, 왼쪽 세 번째 칸으로 갑니다. 임소율이 투덜댑니다. '짐이 하나 늘었네요.' 그래도 상자를 혼자 들고 계단을 오릅니다.",
    },
  },
};
