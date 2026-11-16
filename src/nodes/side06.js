/**
 * 번외 6 -- 보증금 (E-11, 금융 소재 기획 2026-11-13 (a), 결정 Q1~Q5 모두 (1):
 * 번외 5~7 가운데 전세 편, 랭킹 밖).
 *
 * A Friday in May 2026, 5월 8일 어버이날, from 17:50 to 23:30: four days after
 * 사건 27 opens (5월 4일) and the last working day before 도윤하 is sent to
 * KD생명's call centre for ten days (사건 28, 「다음 주부터」 in c27). 송하율 --
 * 사건 26's buyer, whose own 전세 ends in December -- calls the analyst: the
 * tenant one floor down, 레 티 호아, was to move out on 4월 30일 and has not had
 * her 보증금 back. The landlord is one company, 모아든 주식회사, with 37 flats in
 * four buildings of the same street, and the tenants' 전세자금대출 went out,
 * nearly all of them, from KD은행 강서지점 -- most from the window beside
 * 도윤하's.
 *
 * What the night finds is a row of the same number three times -- 감정가,
 * 매매가, 전세가, 2억 1천만 원 -- twenty-three rows down, and three more loans
 * for the same company's flats set to go out at 09:30 on Monday, when 도윤하
 * will be in 구로. The case does not explain how such a row is made (금융 소재
 * 기획 3절 6: no method); it shows the row, and who stands behind each line.
 *
 * It keeps clear of 사건 26 and 27: the 평택 site is one line in the agent's
 * mouth and nothing more, no bank run, no 새봄신협. The endings say what is
 * left on Friday night -- a hold request under 도윤하's 사번, a plain-language
 * note in the tenants' group chat, a table in the branch manager's inbox --
 * never whether a deposit came back or a loan was stopped.
 *
 * Its one new speaker has a portrait: 레 티 호아 (베트남 출신, 서울 9년째 공대
 * 연구원; she answers in Korean, the narration says so once, and her speech is
 * plain natural Korean -- 다국적 등장인물 기획 2-4). 송하율 and 도윤하 are the
 * season's own. 기성철, the company's 관리 대리인 (the 「다음 세입자 들어오면」
 * side, an ordinary tired man with a carnation basket for his own mother), and
 * the 5번 창구 colleague are never speakers: the narration names no speaker
 * before 기성철's words in s6_agent, so no balloon gives them to anyone else.
 *
 * The laughter is a villa called 은행나무빌 and 도윤하's 「숫자가 너무
 * 반듯해요」; the anger a row that repeats; the sorrow 송하율 unable to say
 * 「다행」 in front of 란; the joy 란's rice cooker, unpacked again.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): nine
 * scenes, `s6_aftershock`'s three cards to `s6_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side06 = {
  id: "side06",
  label: "번외 6",
  title: "보증금",
  startNode: "s6_start",
  // A table from between 사건 27 and 28, not this device's season.
  startState: {
    resources: { time: 44, capital: 52, trust: 54, legitimacy: 50, humanCost: 30, fatigue: 44 },
  },
  nodes: {
    s6_start: {
      phase: "SIDE 06 BRIEFING",
      title: "아래층",
      speaker: "송하율",
      place: "KD캐피탈 본사 12층 · 위험관리부",
      clock: "5월 8일 (금) 17:50, 어버이날",
      lead: "평택 현장에서 받은 명함 한 장. 퇴근 직전, 그 명함의 번호로 송하율이 전화를 걸어왔습니다.",
      text: "수화기 너머로 송하율이 숨을 고릅니다. 배가 제법 불러 계단이 숨차다고 합니다. '분석관님, 숫자 보시는 분이니까 여쭤요. 아래층 호아 씨가 4월 30일에 나가야 했는데, 보증금(전세로 들어갈 때 집주인에게 맡기는 돈)을 아직 못 받았어요.' 집주인은 사람이 아니라 법인입니다. 같은 골목 빌라 네 동, 37채가 다 그 회사 것입니다. '다음 세입자가 들어오면 준대요. 저는 12월이 만기예요.' 그가 웃으려다 맙니다. '평택 집은 바닥도 없고, 지금 집은 돈이 안 나오고요.' 빌라 이름은 은행나무빌입니다.",
      question: "송하율이 아래층 세입자의 보증금 이야기를 꺼냅니다. 어떻게 하겠습니까?",
      memo: ["아래층 세입자: 4월 30일 만기, 보증금 못 받음", "집주인: 법인 하나, 같은 골목 빌라 4동 37채", "송하율의 전세 만기: 12월", "빌라 이름: 은행나무빌"],
      triggers: ["affection", "curiosity", "responsibility"],
      choices: [
        { id: "s6_start_visit", label: "퇴근길에 은행나무빌로 가서 직접 듣는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s6_tenant" },
        { id: "s6_start_paper", label: "계약서와 대출 서류를 사진으로 보내 달라고 한다", effect: { legitimacy: 8, trust: 2, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_tenant" },
        { id: "s6_start_short", label: "법인 이름만 받아 적고 통화를 짧게 끝낸다", effect: { time: 5, trust: -3, fatigue: -1 }, cognition: { risk: 1 }, next: "s6_tenant" },
      ],
    },
    s6_tenant: {
      phase: "SIDE 06 TENANT",
      title: "상자 열두 개",
      speaker: "레 티 호아",
      place: "강서구 은행나무빌 · 2층 복도",
      clock: "18:50",
      text: "2층 문 앞에 이삿짐 상자 열두 개가 쌓여 있습니다. 맨 위에 밥솥이 있습니다. 레 티 호아는 베트남에서 와 서울에서 9년째 공대 연구실에 다니고, 한국어로 또박또박 답합니다. '새로 계약한 집에 계약금을 이미 냈어요. 이달 안에 못 들어가면 그것도 날아가요.' 보증금은 1억 9천만 원, 9년 동안 모은 돈입니다. 설에도 하노이에 안 가고 모았습니다. 그가 노트북을 엽니다. 등기부(집의 주인과 빚을 적은 공개 기록) 서른일곱 장을 실험 데이터처럼 한 표로 옮겨 두었습니다. '집주인 회사가 이 집들을 다 2024년 한 해에 샀어요. 그게 이상한 건지, 저는 그걸 모르겠어요.'",
      question: "호아 씨가 직접 만든 표를 내밉니다. 어떻게 하겠습니까?",
      memo: ["레 티 호아: 서울 9년째, 공대 연구원", "보증금 1억 9천만 원, 4월 30일 만기", "새 집 계약금: 이달 못 들어가면 잃음", "호아 씨의 표: 등기부 37장, 모두 2024년에 산 집"],
      triggers: ["affection", "injustice", "curiosity"],
      choices: [
        { id: "s6_tenant_sheet", label: "호아 씨의 표를 받아 한 줄씩 같이 읽는다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_agent" },
        { id: "s6_tenant_box", label: "상자 옆에 앉아 계약금 사정부터 듣는다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s6_agent" },
        { id: "s6_tenant_rush", label: "표는 파일로 받고 지점부터 가자고 한다", effect: { time: 5, trust: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s6_agent" },
      ],
    },
    s6_agent: {
      phase: "SIDE 06 AGENT",
      title: "카네이션",
      speaker: "레 티 호아",
      place: "강서구 은행나무빌 · 1층 주차장",
      clock: "19:30",
      text: "주차장에 회색 승합차가 섭니다. 모아든 주식회사의 관리 대리인 기성철이 카네이션 바구니를 조수석에 내려놓고 내립니다. '어머니 갖다 드릴 거예요. 오늘 어버이날이라.' 그는 2층 세입자에게 먼저 고개를 숙입니다. '돈이 없는 게 아니라 묶여 있는 거예요. 대표님이 평택 쪽에 좀 물려서요. 다음 세입자 들어오면 바로 드려요.' 그가 휴대폰 일정표를 보여 줍니다. '이번 주에도 세 집 계약됐어요. 월요일 아침이면 돈 들어와요. KD은행 강서지점.' '저도 월급 받는 사람이에요. 이 일 2년 했고요.' 승합차가 떠나자 레 티 호아가 노트북을 다시 엽니다. '다음 세입자 돈으로 제 돈을 준대요. 그럼 그분 돈은 누가 줘요?'",
      question: "대리인이 다음 세입자의 돈으로 보증금을 주겠다고 합니다. 어떻게 하겠습니까?",
      memo: ["기성철: 모아든 주식회사 관리 대리인", "'다음 세입자 들어오면 바로 드려요'", "이번 주 새 계약 3집: 월요일 아침 KD은행 강서지점", "'대표님이 평택 쪽에 좀 물려서'"],
      triggers: ["system", "injustice", "choice"],
      choices: [
        { id: "s6_agent_whose", label: "월요일 세 집의 돈이 누구 돈인지 묻는다", effect: { legitimacy: 8, trust: 1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_branch" },
        { id: "s6_agent_date", label: "호아 씨에게 줄 날짜를 명함 뒤에 적어 달라고 한다", effect: { trust: 8, humanCost: -1, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s6_branch" },
        { id: "s6_agent_go", label: "따지지 않고 어머니께 가 보시라고 보낸다", effect: { time: 4, trust: -1, humanCost: 1, fatigue: -1 }, cognition: { reframing: 1 }, next: "s6_branch" },
      ],
    },
    s6_branch: {
      phase: "SIDE 06 BRANCH",
      title: "셔터 안쪽",
      speaker: "도윤하",
      place: "KD은행 강서지점 · 셔터 내린 창구",
      clock: "20:20",
      text: "셔터 안쪽, 4번 창구에만 불이 켜져 있습니다. 도윤하가 김밥 두 줄을 꺼냅니다. '월요일부터 열흘 KD생명 파견이라 책상 정리하던 중이었어요.' 그가 은행나무빌 골목의 주소 넷을 조회 화면에 넣습니다. 전세자금대출(전세 보증금을 내려고 받는 대출) 스물세 건이 뜹니다. 모두 강서지점에서 나갔고, 그 가운데 스물한 건이 옆 5번 창구입니다. 맨 아래에 회색 줄이 셋 더 있습니다. 실행 예정 5월 11일 (월) 09:30. 기성철이 말한 세 집입니다. 도윤하가 김밥을 내려놓습니다. '월요일 아침엔 제가 여기 없네요.'",
      question: "같은 골목에서 나간 대출 스물세 건과, 월요일에 나갈 세 건이 화면에 있습니다. 무엇부터 보겠습니까?",
      memo: ["도윤하: 월요일부터 KD생명 열흘 파견", "같은 골목 전세자금대출 23건, 모두 강서지점", "그중 21건: 옆 5번 창구", "실행 예정 3건: 5월 11일 (월) 09:30"],
      triggers: ["system", "recognition", "responsibility"],
      choices: [
        { id: "s6_branch_table", label: "스물세 건을 주소별로 한 표에 늘어놓는다", effect: { legitimacy: 9, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s6_row" },
        { id: "s6_branch_monday", label: "월요일 세 건의 서류부터 연다", effect: { legitimacy: 6, trust: 2, time: -2, fatigue: 2 }, cognition: { persistence: 1, risk: 1 }, next: "s6_row" },
        { id: "s6_branch_eat", label: "김밥부터 같이 먹고 천천히 연다", effect: { trust: 7, fatigue: -3, time: -1 }, cognition: { reframing: 1 }, next: "s6_row" },
      ],
    },
    s6_row: {
      phase: "SIDE 06 THE ROW",
      title: "같은 숫자 세 개",
      speaker: "도윤하",
      place: "KD은행 강서지점 · 4번 창구",
      clock: "21:00",
      text: "표가 완성됩니다. 칸은 셋입니다. 감정가(은행이 매긴 집값), 매매가(회사가 산 값), 전세가(세입자가 맡긴 돈). 첫 줄은 2억 1천만 원, 2억 1천만 원, 2억 1천만 원. 둘째 줄도, 열째 줄도 같습니다. 스물세 줄이 위에서 아래까지 같은 숫자 세 개로 서 있습니다. 도윤하가 화면을 한참 봅니다. '숫자가 너무 반듯해요.' 3년 전, 당신이 반대 의견을 쓴 서류에서도 숫자는 기준선 바로 앞에 반듯하게 서 있었습니다. 맨 끝 칸, 전세보증(보증금을 못 돌려받으면 대신 돌려주는 보증) 가입 여부는 줄마다 다릅니다.",
      question: "스물세 줄이 같은 숫자 세 개로 서 있습니다. 어떻게 하겠습니까?",
      memo: ["감정가 = 매매가 = 전세가 = 2억 1천만 원", "같은 줄 23개", "전세보증 가입 여부: 줄마다 다름", "도윤하: '숫자가 너무 반듯해요'"],
      triggers: ["recognition", "injustice", "curiosity"],
      choices: [
        { id: "s6_row_mark", label: "세 숫자가 같은 줄에 하나씩 표시를 붙인다", effect: { legitimacy: 9, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_window" },
        { id: "s6_row_guard", label: "전세보증이 없는 줄부터 따로 센다", effect: { trust: 6, legitimacy: 4, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s6_window" },
        { id: "s6_row_call", label: "표는 여기서 멈추고 송하율에게 전화한다", effect: { trust: 6, time: -1, fatigue: 1 }, cognition: { reframing: 1 }, next: "s6_call" },
      ],
    },
    s6_window: {
      phase: "SIDE 06 NEXT WINDOW",
      title: "옆 창구",
      speaker: "도윤하",
      place: "KD은행 강서지점 · 5번 창구 앞",
      clock: "21:40",
      text: "5번 창구 위 벽에 지점 실적판이 붙어 있습니다. '4월 우수 창구: 5번, 전세자금대출 1위.' 접수 메모 칸에는 소개인 이름 기성철이 스물한 번 적혀 있습니다. 도윤하가 실적판 앞에 섭니다. '선배 탓하려는 거 아니에요. 3년 전엔 제가 4번 창구에서 그 표를 받았어요.' 망원시장 사장님들이 버스를 타고 찾아왔던 그 창구입니다. '위에서 내려온 표를 받으면, 다들 1등을 해요. 저도 그랬고요.' 그가 5번 창구 의자를 조금 밀어 넣습니다. 의자 등받이에 선배의 카디건이 걸려 있습니다.",
      question: "옆 창구는 3년 전 도윤하의 창구와 같은 표를 받았습니다. 어떻게 하겠습니까?",
      memo: ["실적판: '4월 우수 창구 5번, 전세자금대출 1위'", "접수 메모 소개인: 기성철 21번", "도윤하: 3년 전엔 4번 창구가 같은 표를 받음"],
      triggers: ["recognition", "helplessness", "trust"],
      choices: [
        { id: "s6_window_log", label: "실적판 말고 접수 기록만 날짜순으로 적는다", effect: { legitimacy: 8, trust: 1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_call" },
        { id: "s6_window_listen", label: "도윤하가 그때 이야기를 끝까지 하게 둔다", effect: { trust: 9, humanCost: -1, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s6_call" },
        { id: "s6_window_board", label: "실적판을 사진으로 찍어 표 옆에 붙인다", effect: { legitimacy: 5, trust: -2, time: -1, fatigue: 1 }, cognition: { risk: 2 }, next: "s6_call" },
      ],
    },
    s6_call: {
      phase: "SIDE 06 KITCHEN",
      title: "다행이라는 말",
      speaker: "송하율",
      place: "영상 통화 · 송하율의 부엌",
      clock: "22:20",
      text: "영상 통화 화면에 송하율의 부엌 식탁이 나옵니다. 옆자리에 레 티 호아가 앉아 있고, 식탁에는 수박 반 통이 있습니다. 표에서 송하율의 줄은 열일곱 번째, 전세보증 칸에 '가입'이 적혀 있습니다. 아래층 줄에는 대출이 없고, 보증 칸은 비어 있습니다. 송하율이 입을 엽니다. '저는 보증을 들어 놨대요. 다행이라고 해야 하는데...' 그가 옆자리를 보고 말을 멈춥니다. 레 티 호아가 수박을 한 조각 밀어 줍니다. '다행이라고 하세요, 하율 씨. 한 집이라도 다행이면 다행이에요.' 송하율이 평면도 대신 식탁 모서리를 손가락으로 짚습니다.",
      question: "같은 빌라에서 한 사람은 보증이 있고, 한 사람은 없습니다. 어떻게 하겠습니까?",
      memo: ["송하율: 17번째 줄, 전세보증 가입", "호아 씨: 대출 없음, 보증 없음", "호아 씨: '한 집이라도 다행이면 다행이에요'"],
      triggers: ["affection", "helplessness", "choice"],
      choices: [
        { id: "s6_call_both", label: "두 사람에게 같은 순서로 할 일을 적어 준다", effect: { trust: 8, legitimacy: 2, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s6_rule" },
        { id: "s6_call_lan", label: "보증이 없는 호아 씨 쪽 길부터 같이 찾는다", effect: { trust: 7, humanCost: -3, time: -4, fatigue: 3 }, cognition: { reframing: 2 }, next: "s6_rule" },
        { id: "s6_call_group", label: "빌라 세입자가 몇 명 연락되는지 묻는다", effect: { legitimacy: 6, trust: 3, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s6_rule" },
      ],
    },
    s6_rule: {
      phase: "SIDE 06 RULE",
      title: "월요일 09:30",
      speaker: "도윤하",
      place: "KD은행 강서지점 · 4번 창구",
      clock: "22:50",
      text: "도윤하가 규정집 화면을 넘깁니다. 실행 전 대출은 직원 누구나 '실행 보류 요청'을 올릴 수 있습니다. 다만 자기 사번으로, 사유를 적어서. 받아들일지는 지점장이 정합니다. 지점장에게 보낸 메시지에는 답이 하나 와 있습니다. '월요일에 얘기합시다.' 월요일 9시 반이면 세 건은 이미 나갑니다. 도윤하가 웃습니다. '남의 창구 손님 대출에 제 이름으로 보류를 거는 거네요. 파견 가기 전날에.' 그는 웃음을 끝까지 하지 않습니다. 창밖에서 카네이션을 든 사람이 버스에서 내립니다.",
      question: "월요일 아침에는 도윤하가 없고, 지점장은 월요일에 얘기하자고 합니다. 어떻게 하겠습니까?",
      memo: ["실행 보류 요청: 직원 누구나, 자기 사번으로, 사유 적어서", "받아들일지는 지점장이 정함", "지점장: '월요일에 얘기합시다'", "월요일 09:30: 세 건 실행 예정"],
      triggers: ["choice", "system", "responsibility"],
      choices: [
        { id: "s6_rule_reason", label: "보류 사유를 세 줄로 같이 쓴다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s6_aftershock" },
        { id: "s6_rule_words", label: "세입자에게 보낼 쉬운 안내문부터 쓴다", effect: { trust: 8, humanCost: -2, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s6_aftershock" },
        { id: "s6_rule_sheet", label: "지점장에게 넘길 표를 한 장으로 줄인다", effect: { legitimacy: 6, time: -2, fatigue: 1 }, cognition: { inference: 2 }, next: "s6_aftershock" },
      ],
    },
    s6_aftershock: {
      phase: "SIDE 06 AFTERMATH",
      title: "셔터 뒷문",
      speaker: "도윤하",
      place: "KD은행 강서지점 · 뒷문",
      clock: "23:30",
      text: "경비원이 뒷문 열쇠를 흔들며 기다립니다. 도윤하가 4번 창구 서랍을 마지막으로 비웁니다. 화면에는 세 가지가 떠 있습니다. 반쯤 쓴 실행 보류 요청서, 송하율이 단체방에 올릴 안내문 초안, 지점장에게 보낼 표 한 장. 셋 다 하기엔 밤이 짧고, 월요일 아침엔 그가 구로에 있습니다. 휴대폰에 레 티 호아의 메시지가 옵니다. 밥솥 사진입니다. '다시 꺼냈어요. 오늘은 여기서 자니까요.' 도윤하가 가방을 메며 당신을 봅니다. '하나만 제 이름으로 올리고 갈게요. 뭘로 할까요?'",
      question: "도윤하는 오늘 밤 하나만 올리고 떠납니다. 무엇을 남기겠습니까?",
      memo: ["보류 요청서: 월요일 세 건, 도윤하의 사번", "안내문: 은행나무빌 세입자 단체방", "표 한 장: 지점장 받은 편지함", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "trust", "affection"],
      choices: [
        { id: "s6_after_hold", label: "월요일 세 건에 실행 보류 요청을 지금 건다", effect: { legitimacy: 6, trust: 2 }, cognition: { persistence: 2 }, next: "s6_result" },
        { id: "s6_after_notice", label: "이미 나간 스물세 집에 안내문부터 보낸다", effect: { trust: 7, humanCost: -2 }, cognition: { reframing: 2 }, next: "s6_result" },
        { id: "s6_after_branch", label: "표를 지점장에게 보내고 지점에 맡긴다", effect: { legitimacy: 4, time: 2 }, cognition: { inference: 2 }, next: "s6_result" },
      ],
    },
  },
  outcomes: {
    s6_after_hold: {
      title: "보류 요청 중",
      text: "도윤하가 사유 칸에 세 줄을 넣고 자기 사번으로 올립니다. 같은 법인 물건, 감정가 = 매매가 = 전세가 스물세 줄, 기존 세입자 보증금 미반환. 접수 번호가 뜹니다. 그는 번호를 포스트잇에 적어 5번 창구 모니터 옆에 붙였다가, 다시 떼어 자기 수첩에 끼웁니다. '선배가 아침에 이걸 먼저 보면 안 되니까요.' 월요일 9시 반, 구로행 지하철에서 그가 접수 번호를 한 번 더 조회합니다. 화면에는 '검토 중' 세 글자뿐입니다.",
    },
    s6_after_notice: {
      title: "단체방",
      text: "송하율이 안내문을 은행나무빌 세입자 단체방에 올립니다. 내 계약서와 등기부를 다시 볼 것, 전세보증 가입 여부를 확인할 것, 만기 석 달 전부터 날짜를 적어 둘 것. 레 티 호아의 표가 파일로 붙습니다. 이름은 빼고 주소와 숫자만. 자정이 넘도록 단체방 인원이 2명에서 19명이 됩니다. 누군가 묻습니다. '우리 집도 2억 1천이에요. 이거 무슨 뜻이에요?' 송하율이 답을 쓰다 지우고, 다시 씁니다. '내일 같이 봐요. 1층 주차장 10시.'",
    },
    s6_after_branch: {
      title: "받은 편지함",
      text: "도윤하가 표 한 장을 지점장에게 보냅니다. 제목은 '은행나무빌 골목 전세자금대출 23건 정리'. 본문은 두 줄입니다. 월요일 09:30 실행 예정 세 건이 같은 법인 물건입니다. 저는 월요일부터 KD생명에 있습니다. 보낸 편지함에 메일이 한 줄 생깁니다. 읽음 표시는 아직 없습니다. 도윤하가 셔터 뒷문을 나서며 말합니다. '지점에 맡겼으니, 이제 지점 일이에요.' 그러고는 버스 정류장에서 한 번 더 휴대폰을 엽니다. 읽음 표시는 그때도 없습니다.",
    },
  },
};
