/**
 * 번외 5 -- 상장 전야 (E-11, 금융소재-기획-20261113 (a), 결정 Q1~Q5 모두 (1)).
 *
 * A Thursday night in February 2026, 2월 12일, from 21:40 to the 09:00
 * meeting the next morning: three days after 사건 21 and eleven before 사건 22
 * opens (2월 23일), with 설 four days off. KD은행 is the partner bank that
 * gives the virtual-asset exchange 카노바 its 실명확인 계좌, and 카노바 lists
 * a new coin, 미레온, at 10:00 on Friday. Deposits to it run at nine times
 * the usual, 1,900 이상거래 경보 are waiting, and the bank's 자금세탁방지팀,
 * two people that night, asks 트리거랩 how many go up as 의심거래 보고 before
 * the meeting. The same week 카노바's app carries a banner: 「연 12% 예치 이자,
 * KD은행 제휴」.
 *
 * The line it holds (결정 Q5 (1)): only the people who put money in and the
 * analysts are seen. No price moves on screen, nobody profits, no sentence can
 * be read as 사라 or 팔라, and no method is described -- the alerts are told by
 * who sent money, never by how. 카노바 and 미레온 are made up and were searched
 * for on 2026-11-13 (no exchange or coin of either name); no ticker is printed.
 * No real collapse, withdrawal halt or bankruptcy is borrowed.
 *
 * It keeps clear of 사건 20-22: no 노아, no 에코, no internship scene. 문하준's
 * internship at the bank is the week of 2월 23일 and he only mentions it ahead.
 * The endings say what goes to the 09:00 meeting, never what the listing did
 * and never whether anyone's money came back.
 *
 * Its speakers: 이민서 and 문하준 (the season's, with portraits) and three new
 * ones with generated portraits -- 육성빈 (디지털자산제휴팀 과장, the fee side,
 * an ordinary tired man who put his name in the 확인 box), 추영복 (64, a 공덕동
 * 철물점, the one who put money in because the banner said KD은행) and
 * 마리사 탄 (Singaporean, the exchange group's regional compliance head, on a
 * video call; she speaks English, quoted here in Korean, and calls 이민서
 * 「민서 씨」 by her given name, which makes 이민서 pause).
 *
 * The laughter is 육성빈's triangle gimbap handed round at 23:10; the anger a
 * banner whose 확인 box holds the bank's own team; the sorrow 추영복's "거기
 * 은행이죠? 그럼 됐네"; the joy, if any, is a folder 이민서 will not delete.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): nine
 * scenes, `s5_aftershock`'s three cards to `s5_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side05 = {
  id: "side05",
  label: "번외 5",
  title: "상장 전야",
  startNode: "s5_start",
  // A table from between 사건 21 and 22, not this device's season.
  startState: {
    resources: { time: 44, capital: 52, trust: 54, legitimacy: 50, humanCost: 28, fatigue: 42 },
  },
  nodes: {
    s5_start: {
      phase: "SIDE 05 BRIEFING",
      title: "아홉 배",
      speaker: "이민서",
      place: "트리거랩 분석관실",
      clock: "2월 12일 (목) 21:40, 상장까지 12시간 20분",
      lead: "설 연휴를 앞둔 2월의 목요일 밤. 퇴근하려던 당신을 이민서가 모니터 앞으로 부릅니다.",
      text: "이민서가 사원증을 뒤집어 쥔 채 그래프 하나를 가리킵니다. 가상자산 거래소 카노바로 들어가는 입금이 오늘 저녁에만 평소의 아홉 배입니다. KD은행은 카노바에 실명확인 계좌(거래소 이용자가 자기 이름의 은행 계좌로만 돈을 넣고 빼게 하는 계좌)를 대 주는 제휴 은행입니다. 내일 오전 10시에는 카노바에 새 코인 '미레온'이 올라옵니다. 자금세탁방지팀 화면에는 이상거래 경보가 1,900건 쌓였습니다. '팀에 남은 사람이 둘이래요. 아침 9시 회의 전까지 몇 건을 의심거래 보고(수상한 돈 흐름을 금융당국에 알리는 것)로 올릴지 정해 달래요.' 이민서가 식은 커피를 내려놓습니다. '저 이런 숫자 처음 봐요.'",
      question: "이민서가 아침까지 경보 1,900건을 같이 봐 달라고 합니다. 어떻게 하겠습니까?",
      memo: ["카노바행 입금: 평소의 9배", "미레온 상장: 내일 10:00", "이상거래 경보: 1,900건", "자금세탁방지팀 당직: 2명, 09:00 회의"],
      triggers: ["responsibility", "curiosity", "system"],
      choices: [
        { id: "s5_start_stay", label: "외투를 벗고 아침까지 같이 보겠다고 한다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s5_banner" },
        { id: "s5_start_rule", label: "경보가 무엇을 보고 울렸는지부터 묻는다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_banner" },
        { id: "s5_start_cut", label: "1,900건을 금액 순으로 잘라 빨리 줄인다", effect: { time: 6, trust: -3, fatigue: 1 }, cognition: { risk: 1 }, next: "s5_banner" },
      ],
    },
    s5_banner: {
      phase: "SIDE 05 BANNER",
      title: "KD은행 제휴",
      speaker: "문하준",
      place: "트리거랩 분석관실 · 휴대폰 화면",
      clock: "22:20",
      text: "휴대폰이 울립니다. 도윤하에게 당신 번호를 받았다는 문하준입니다. 사진 한 장이 먼저 옵니다. 카노바 앱 첫 화면의 배너. '연 12% 예치 이자, KD은행 제휴.' 문자가 이어집니다. '이거 진짜 KD은행이 하는 거예요? 같은 반 친구 어머니가 친구 수시 원서비 모아 둔 걸 여기 넣으셨대요. 은행 이름 있으니까 괜찮다고요.' 한 줄이 더 옵니다. '저 다음다음 주에 KD은행 인턴 가요. 그때 물어봐도 돼요?' 이민서가 어깨 너머로 화면을 봅니다. 예치(돈을 맡겨 두는 것) 상품 약관의 맨 아래에는 작은 글씨가 있습니다. '이 상품은 예금자 보호 대상이 아닙니다.'",
      question: "고등학생이 은행 이름을 믿어도 되는지 묻습니다. 어떻게 하겠습니까?",
      memo: ["카노바 앱 배너: '연 12% 예치 이자, KD은행 제휴'", "문하준: 친구 어머니가 수시 원서비를 넣음", "약관 맨 아래: '예금자 보호 대상이 아닙니다'"],
      triggers: ["affection", "injustice", "curiosity"],
      choices: [
        { id: "s5_banner_reply", label: "은행이 아는 만큼만 솔직하게 답장한다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s5_partner" },
        { id: "s5_banner_save", label: "배너와 약관 맨 아래 줄을 함께 저장한다", effect: { legitimacy: 9, trust: 1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_partner" },
        { id: "s5_banner_later", label: "답장은 아침으로 미루고 경보로 돌아간다", effect: { time: 5, trust: -3, fatigue: -1 }, cognition: { risk: 1 }, next: "s5_partner" },
      ],
    },
    s5_partner: {
      phase: "SIDE 05 PARTNER",
      title: "삼각김밥",
      speaker: "육성빈",
      place: "트리거랩 분석관실 입구",
      clock: "23:10",
      text: "디지털자산제휴팀 육성빈 과장이 편의점 봉지를 들고 내려옵니다. 상장 전날 밤이라 팀에서 혼자 당직이라고 합니다. 그가 삼각김밥을 하나씩 나눠 주고 의자를 끌어다 앉습니다. '경보 많죠. 저희도 봤어요.' 그는 자기 휴대폰의 표를 보여 줍니다. 카노바 제휴 수수료, 올해 팀 목표의 40%. '보고 올리시는 건 분석관님 일이에요. 근데 상장 전날 밤에 몇백 건이 올라가면 거래소 계좌가 묶일 수 있어요. 그럼 오늘 넣은 사람들 돈도 같이 묶이고요.' 그가 김밥 비닐을 끝까지 벗기지 못하고 내려놓습니다. '배너요? 거래소가 만들었어요. 저희는 확인만 했고.'",
      question: "제휴팀 과장이 보고가 사람들의 돈까지 묶을 수 있다고 합니다. 어떻게 하겠습니까?",
      memo: ["육성빈: 디지털자산제휴팀 과장, 오늘 당직", "카노바 제휴 수수료: 팀 목표의 40%", "'배너는 거래소가 만들고 저희는 확인만'"],
      triggers: ["system", "choice", "trust"],
      choices: [
        { id: "s5_partner_eat", label: "김밥을 받고 그의 사정을 끝까지 듣는다", effect: { trust: 8, humanCost: -1, time: -3, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s5_call" },
        { id: "s5_partner_doc", label: "배너를 '확인'한 문서가 있는지 묻는다", effect: { legitimacy: 9, trust: -1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_call" },
        { id: "s5_partner_deal", label: "묶이지 않게 보고 건수를 줄이는 쪽으로 맞춘다", effect: { time: 5, trust: 2, legitimacy: -3, humanCost: 2 }, cognition: { risk: 2 }, next: "s5_call" },
      ],
    },
    s5_call: {
      phase: "SIDE 05 CALL",
      title: "그럼 됐네",
      speaker: "추영복",
      place: "트리거랩 분석관실 · 고객 확인 전화",
      clock: "23:40",
      text: "경보 목록 위쪽에 22시 58분, 3,800만 원짜리 이체가 있습니다. 보낸 사람은 추영복, 예순넷, 공덕동에서 철물점을 합니다. 규정대로 확인 전화를 겁니다. 셔터 내리는 소리 너머로 목소리가 들립니다. '누가 시켜서 보낸 거 아니에요. 내 돈 내가 넣는 거예요.' 그가 웃습니다. '손녀가 3월에 대학 들어가요. 등록금 내기 전에 한 달만 넣어 두면 38만 원이 붙는대요. KD은행이 같이 한다길래.' 그는 이 은행에 32년 동안 가게 통장을 두었다고 말합니다. '거기 은행이죠? 그럼 됐네.' 통화 화면의 대본에는 확인 질문 다섯 줄이 있고, 이 경우는 그 다섯 줄 어디에도 없습니다.",
      question: "추영복은 은행 이름을 보고 돈을 보냈다고 합니다. 어떻게 하겠습니까?",
      memo: ["추영복(64): 공덕동 철물점, KD은행 거래 32년", "22:58 카노바행 3,800만 원", "손녀 대학 등록금: 3월", "대본의 확인 질문 5줄 -- 이 경우는 없음"],
      triggers: ["affection", "helplessness", "responsibility"],
      choices: [
        { id: "s5_call_listen", label: "손녀 이야기를 끝까지 듣고 통화를 서두르지 않는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s5_overseas" },
        { id: "s5_call_terms", label: "'제휴'가 무슨 뜻인지 약관대로 읽어 준다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_overseas" },
        { id: "s5_call_script", label: "대본의 다섯 줄만 묻고 통화를 끝낸다", effect: { time: 5, trust: -3, humanCost: 2 }, cognition: { risk: 1 }, next: "s5_overseas" },
      ],
    },
    s5_overseas: {
      phase: "SIDE 05 OVERSEAS",
      title: "민서 씨",
      speaker: "마리사 탄",
      place: "트리거랩 분석관실 · 화상 회의",
      clock: "2월 13일 (금) 00:40, 싱가포르 23:40",
      text: "이민서가 화상 회의를 엽니다. 화면 속 창밖으로 싱가포르의 불빛이 보입니다. 카노바를 가진 그룹의 지역 컴플라이언스(회사가 법과 규정을 지키는지 살피는 일) 책임자, 마리사 탄입니다. 그가 영어로 인사하고 곧장 본론으로 갑니다. '민서 씨, 숫자는 우리도 봤어요. 지난주에 상장을 미루자는 의견을 냈고, 서울 사업 쪽이 받지 않았어요.' 이름이 불린 이민서가 잠깐 멈칫합니다. 마리사 탄이 문서 하나를 화면에 띄웁니다. 배너 문구 승인 기록, 확인자 칸에 KD은행 디지털자산제휴팀. '우리가 볼 수 있는 건 거래소 안쪽뿐이에요. 돈이 어디서 왔는지는 은행이 봐요. 이 제휴는 그렇게 생겼어요.'",
      question: "거래소 쪽 책임자가 배너의 확인 기록을 보여 줍니다. 어떻게 하겠습니까?",
      memo: ["마리사 탄: 카노바 그룹 지역 컴플라이언스 책임자, 싱가포르", "지난주: 상장 연기 의견 -- 받아들여지지 않음", "배너 문구 확인자: KD은행 디지털자산제휴팀"],
      triggers: ["curiosity", "system", "recognition"],
      choices: [
        { id: "s5_overseas_thanks", label: "늦은 시각에 나와 준 데 먼저 고맙다고 한다", effect: { trust: 8, humanCost: -1, time: -2, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s5_sort" },
        { id: "s5_overseas_record", label: "승인 기록을 받아 확인자 칸을 적어 둔다", effect: { legitimacy: 10, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_sort" },
        { id: "s5_overseas_delay", label: "지금이라도 상장을 미룰 수 없는지 묻는다", effect: { legitimacy: 4, trust: 3, time: -3, fatigue: 3 }, cognition: { reframing: 2 }, next: "s5_sort" },
      ],
    },
    s5_sort: {
      phase: "SIDE 05 SORT",
      title: "세 줄",
      speaker: "이민서",
      place: "트리거랩 분석관실 · 경보 화면",
      clock: "02:30",
      text: "이민서가 1,900건을 세 줄로 나눠 화면에 띄웁니다. 첫 줄은 312건. 오늘 처음 만든 계좌들이 저녁 내내 비슷한 금액을 보냈습니다. 둘째 줄은 1,400여 건. 추영복처럼 오래된 통장에서 큰돈이 한 번 갑니다. 셋째 줄은 나머지, 아직 무엇인지 모릅니다. '의심거래 보고는 수상한 돈 흐름을 알리는 거잖아요. 둘째 줄 사람들은 수상한 게 아니라 속은 쪽일 수도 있어요.' 이민서가 키보드에서 손을 뗍니다. '보고로 올릴지, 아침까지 쥐고 있을지, 제휴팀에 넘길지. 정해 주세요. 저는 숫자만 맞출게요.'",
      question: "1,900건이 세 줄로 나뉘었습니다. 어떻게 하겠습니까?",
      memo: ["첫 줄 312건: 오늘 만든 계좌, 비슷한 금액", "둘째 줄 1,400여 건: 오래된 통장, 큰돈 한 번", "셋째 줄: 아직 모름", "보고 / 보류 / 제휴팀에 넘김"],
      triggers: ["choice", "responsibility", "injustice"],
      choices: [
        { id: "s5_sort_report", label: "처음 만든 계좌 312건을 의심거래 보고로 올린다", effect: { legitimacy: 10, trust: 1, time: -4, fatigue: 3 }, cognition: { inference: 2 }, next: "s5_fee" },
        { id: "s5_sort_hold", label: "1,900건 모두 아침 회의까지 보류한다", effect: { trust: 5, legitimacy: 3, time: -2, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s5_fee" },
        { id: "s5_sort_pass", label: "판단은 제휴팀에 넘기고 목록만 남긴다", effect: { time: 6, legitimacy: -3, trust: -2, fatigue: -1 }, cognition: { risk: 2 }, next: "s5_morning" },
      ],
    },
    s5_fee: {
      phase: "SIDE 05 FEE",
      title: "확인 칸",
      speaker: "육성빈",
      place: "트리거랩 분석관실",
      clock: "05:30",
      text: "육성빈 과장이 다시 내려옵니다. 이번에는 빈손입니다. 넥타이는 풀었고, 셔츠 단추 하나가 엇갈려 채워져 있습니다. '아침 회의 자료 봤어요.' 그가 의자에 앉지 않고 등받이를 잡습니다. '저희 팀 일곱 명 중 셋이 계약직이에요. 수수료가 목표 밑으로 내려가면 3월에 재계약 얘기가 나와요.' 그는 잠시 말이 없다가 덧붙입니다. '저도 배너 문구 싫었어요. 제휴라는 말 빼자고 했더니, 거래소가 그럼 안 한대요. 그래서 확인 칸에 제 이름을 넣었어요.' 그가 웃으려다 맙니다. '회의에서 제 이름 나오겠죠.'",
      question: "확인 칸에 이름을 넣은 사람이 그 이름이 불릴 것을 압니다. 어떻게 하겠습니까?",
      memo: ["제휴팀 7명 중 3명 계약직, 3월 재계약", "육성빈: '제휴'를 빼자고 했다가 물러섬", "배너 확인 칸: 육성빈"],
      triggers: ["affection", "system", "helplessness"],
      choices: [
        { id: "s5_fee_sit", label: "의자를 내주고 그의 이야기를 먼저 듣는다", effect: { trust: 8, humanCost: -1, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s5_morning" },
        { id: "s5_fee_name", label: "확인 칸의 이름은 자료에 그대로 둔다", effect: { legitimacy: 9, trust: -2, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_morning" },
        { id: "s5_fee_soft", label: "자료에서 그의 이름을 팀 이름으로 바꿔 준다", effect: { trust: 5, legitimacy: -2, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s5_morning" },
      ],
    },
    s5_morning: {
      phase: "SIDE 05 MORNING",
      title: "은행이 말해 주면",
      speaker: "추영복",
      place: "트리거랩 분석관실 · 걸려 온 전화",
      clock: "07:10",
      text: "추영복이 먼저 전화를 겁니다. 가게 문을 여는 소리, 난로에 불을 붙이는 소리가 들립니다. '어젯밤엔 내가 좀 퉁명스러웠죠. 밤새 생각해 봤는데.' 그가 숨을 고릅니다. '그래서 넣어 둬도 되는 거예요, 안 되는 거예요? 은행이 말해 주면 그대로 할게요.' 당신 앞의 화면에서 상장 시각까지 남은 시간이 초 단위로 줄어듭니다. 은행은 그 상품을 판 적이 없고, 대신 골라 줄 수도 없습니다. 할 수 있는 말은 약관에 있는 몇 줄과, 이 전화가 녹음된다는 것뿐입니다. 손녀 이름이 적힌 등록금 고지서가 계산대 위에 있다고 그가 말합니다.",
      question: "추영복이 은행이 정해 주면 그대로 하겠다고 합니다. 어떻게 하겠습니까?",
      memo: ["추영복: '은행이 말해 주면 그대로 할게요'", "은행은 이 상품을 판 적 없음", "통화 녹음 중", "계산대 위: 손녀의 등록금 고지서"],
      triggers: ["affection", "responsibility", "helplessness"],
      choices: [
        { id: "s5_morning_plain", label: "은행이 보증하지 않는다는 것을 쉬운 말로 말한다", effect: { trust: 8, legitimacy: 3, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s5_aftershock" },
        { id: "s5_morning_terms", label: "약관의 '예금자 보호 대상 아님'을 그대로 읽는다", effect: { legitimacy: 8, trust: 2, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s5_aftershock" },
        { id: "s5_morning_script", label: "대본대로 '고객님 판단입니다'라고만 한다", effect: { time: 4, trust: -3, humanCost: 2 }, cognition: { risk: 1 }, next: "s5_aftershock" },
      ],
    },
    s5_aftershock: {
      phase: "SIDE 05 AFTERMATH",
      title: "회의 20분 전",
      speaker: "이민서",
      place: "트리거랩 분석관실",
      clock: "08:40, 회의 20분 전 · 상장 80분 전",
      text: "창밖이 밝아 옵니다. 이민서가 세 줄로 나눈 화면을 그대로 둔 채 기지개를 켭니다. 책상 위에는 식은 삼각김밥 하나, 문하준이 보낸 배너 사진, 마리사 탄의 승인 기록, 추영복의 통화 기록이 있습니다. 9시에는 회의가 있고, 10시에는 상장이 있습니다. 어느 쪽도 이 방에서 멈출 수는 없습니다. '밤새 한 일 중에 하나만 회의에 들고 갈 수 있대요.' 이민서가 뒤집어 쥐고 있던 사원증을 바로 돌려 겁니다. '고르세요. 나머지는 제가 폴더에 남길게요.'",
      question: "상장 전야가 끝나 갑니다. 무엇을 회의에 들고 가겠습니까?",
      memo: ["09:00 자금세탁방지팀 회의", "10:00 미레온 상장 -- 이 방에서 멈출 수 없음", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "recognition"],
      choices: [
        { id: "s5_after_report", label: "312건의 의심거래 보고를 들고 간다", effect: { legitimacy: 7, trust: 1 }, cognition: { inference: 2 }, next: "s5_result" },
        { id: "s5_after_banner", label: "'KD은행 제휴' 배너를 내리자고 한다", effect: { trust: 5, legitimacy: 3 }, cognition: { reframing: 2 }, next: "s5_result" },
        { id: "s5_after_folder", label: "아무것도 들고 가지 않고 폴더만 남긴다", effect: { trust: 3, humanCost: -1 }, cognition: { persistence: 2 }, next: "s5_result" },
      ],
    },
  },
  outcomes: {
    s5_after_report: {
      title: "접수 번호",
      text: "9시 회의에서 당신이 312건을 읽습니다. 오늘 처음 만든 계좌, 비슷한 금액, 같은 저녁. 육성빈 과장이 고개를 숙인 채 받아 적습니다. 9시 40분, 보고가 접수되고 화면에 접수 번호가 뜹니다. 10시, 미레온은 예정대로 상장됩니다. 접수 번호가 무엇을 바꿀지는 아무도 말하지 않습니다. 오후에 이민서가 폴더 이름을 고칩니다. '상장 전야, 접수 312.' 그 밑에 한 줄을 더 적습니다. '둘째 줄 1,400명은 보고 대상 아님. 속은 쪽일 수 있음.'",
    },
    s5_after_banner: {
      title: "제휴",
      text: "회의에서 당신은 숫자 대신 사진 두 장을 띄웁니다. 문하준이 보낸 배너, 그리고 마리사 탄의 승인 기록. 확인자 칸의 팀 이름에서 회의실이 조용해집니다. 9시 50분, 카노바 앱의 배너에서 'KD은행 제휴'가 빠집니다. 연 12%는 그대로입니다. 10시, 상장은 예정대로입니다. 점심때 문하준에게서 문자가 옵니다. '배너 바뀌었어요. 친구 어머니가 이거 보고 은행에 전화해 보신대요.' 육성빈 과장은 수수료 표를 접어 서랍에 넣습니다.",
    },
    s5_after_folder: {
      title: "날짜뿐인 폴더",
      text: "당신은 회의에 아무것도 들고 가지 않습니다. 회의는 11분 만에 끝나고, 10시에 미레온은 예정대로 상장됩니다. 경보 화면의 숫자가 0으로 돌아갑니다. 이민서가 밤새 나눈 세 줄을 폴더 하나에 담습니다. 폴더 이름은 날짜뿐입니다. 오후 3시, 추영복이 한 번 더 전화를 겁니다. '어제 그 분석관 양반 있어요? 그냥, 고맙다고.' 그가 돈을 넣었는지 뺐는지, 당신은 묻지 않습니다. 이민서가 폴더를 닫다가 말합니다. '이건 지우지 말아요. 누가 물어보면 있어야 하니까.'",
    },
  },
};
