/**
 * CASE 27 -- a run on a neighbourhood credit union, and who started the queue.
 *
 * Act 5 scatters the lab across the group, and every place it lands shows a new
 * link of the same chain. In 사건 26 the chain was a stalled office-tower site in
 * 평택 financed before a single unit was sold. This case follows that money to
 * the smallest lender on the list: 군산 새봄신협, a credit union that put 60억
 * into the project as a junior lender. On a Friday night in early May a single
 * screenshot tells every local group chat that the union will not survive the
 * month. By Monday morning three hundred people are queuing at a door that has
 * never had a queue since 1998.
 *
 * 나준혁 goes down because his first desk as a banker was in 군산, and the
 * analyst goes because the union's exposure is a line in KD캐피탈's own risk
 * book. The union's managing director 남궁솔 knows every depositor by name, and
 * the whole case is about what a name is worth against a rumour: the laughter of
 * hand-stamped queue tickets that become collectibles, the grief of a 74-year-old
 * breaking a savings plan two months before it matures because her son saw the
 * news, the joy of a fishmonger carrying his cash back in a black plastic bag,
 * and the anger of finding that the screenshot was cut from KD캐피탈's internal
 * messenger -- and that a price for the union's share was written a week before
 * the rumour ran. The final choice is the one the bible asks for: stop the run
 * with group money, open every number to the queue, or limit withdrawals.
 */
export const case27Nodes = {
  c27_start: {
    phase: "CASE 27 BRIEFING",
    title: "금요일 밤의 캡처",
    speaker: "나준혁",
    text:
      "5월 4일 월요일 새벽 6시 50분, KD캐피탈 위험관리부 자리에 앉기도 전에 나준혁에게서 전화가 옵니다. '군산에 줄이 섰어요. 새벽 네 시부터요. 지금 180명쯤.' 금요일 밤부터 지역 단체방마다 캡처 한 장이 돌았다고 합니다. 군산 새봄신협(동네 사람들이 조합원이 되어 함께 꾸리는 작은 금융 조합)이 부동산 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출)에 물려 이번 달을 못 넘긴다는 한 줄입니다. 어느 공사장인지는 캡처에 없지만 당신은 압니다. KD캐피탈이 앞장선 평택 오피스텔, 새봄신협은 거기에 60억을 넣었습니다. 뱅크런(예금자들이 한꺼번에 돈을 찾으러 몰려드는 일)은 사실보다 빨리 달립니다. 나준혁이 숨을 고릅니다. '나 은행 들어와서 처음 앉은 데가 군산이었어요. 오늘 내려갑니다. 도장 챙겨서요.'",
    memo: [
      "새봄신협 앞 대기 약 180명 -- 04시부터",
      "평택 오피스텔 PF 후순위 참여 60억",
      "소문의 시작: 금요일 밤 지역 단체방 캡처 한 장",
      "조합원 4,812명, 예금 약 1,300억",
    ],
    triggers: ["protection", "fear", "responsibility"],
    choices: [
      {
        id: "c27_start_visit",
        label: "첫차로 군산에 내려가 줄 선 사람들부터 만난다",
        effect: { trust: 11, humanCost: -5, time: -6, capital: -2, fatigue: 5 },
        next: "c27_queue",
        cognition: { persistence: 2 },
      },
      {
        id: "c27_start_numbers",
        label: "새봄신협이 평택에 얼마를 어떤 순서로 넣었는지부터 확인한다",
        effect: { legitimacy: 11, time: -4, trust: -2, humanCost: 3, fatigue: 3 },
        next: "c27_queue",
        cognition: { inference: 2 },
      },
      {
        id: "c27_start_report",
        label: "위험관리부 보고로 올리고 대응은 그룹에 맡긴다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: -2, humanCost: 3, fatigue: 1 },
        next: "c27_queue",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c27_queue",
      },
    ],
  },
  c27_queue: {
    phase: "THE QUEUE",
    title: "도장 찍힌 번호표",
    speaker: "남궁솔",
    text:
      "오전 9시, 객장 문이 열리자 번호표 기계가 187번에서 종이를 토해 내다 멈춥니다. 남궁솔 전무가 줄 선 사람들을 한 명씩 이름으로 부릅니다. '혜숙 이모, 무릎은 좀 어떠세요? 정호 삼촌, 오늘 배는 안 나가셨네.' 조합원 4,812명의 이름을 다 안다는 말이 과장이 아닙니다. 나준혁은 입금 전표 뒷면에 번호를 쓰고 도장 세 개를 차례로 찍어 번호표 대신 나눠 줍니다. 30년 솜씨라 도장이 한 치도 비뚤지 않자, 줄 뒤쪽에서 '지점장 도장 받은 표는 먼저 준대' 하는 소문이 하나 더 돕니다. 할아버지 한 분은 도장만 받고 '됐어, 이거면 됐어' 하며 돌아갑니다. 남궁솔이 웃다가 창구 뒤 금고 쪽을 봅니다. 오늘 시재(창구와 금고에 지금 있는 현금)는 14억, 줄은 300명을 넘었습니다.",
    memo: [
      "번호표 기계 187번에서 고장 -- 이후 수기 번호표",
      "오전 대기 312명, 평균 인출 요청 1,900만 원",
      "금고 시재 14억 -- 오후 2시면 바닥",
      "나준혁의 도장 세 개: 지점장·검인·확인",
    ],
    triggers: ["protection", "trust", "fear"],
    choices: [
      {
        id: "c27_queue_explain",
        label: "줄 선 사람 한 명씩에게 예금이 보호되는 한도부터 설명한다",
        effect: { trust: 12, humanCost: -6, time: -6, capital: -2, fatigue: 6 },
        next: "c27_rumor",
        cognition: { persistence: 2 },
      },
      {
        id: "c27_queue_post",
        label: "새봄신협의 평택 몫과 현금 사정을 숫자로 객장 벽에 붙인다",
        effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 3, fatigue: 4 },
        next: "c27_rumor",
        cognition: { inference: 2 },
      },
      {
        id: "c27_queue_open",
        label: "창구를 전부 열어 달라는 대로 빨리 내준다",
        effect: { time: 5, capital: 6, trust: 3, legitimacy: -6, humanCost: 5, fatigue: -2 },
        next: "c27_rumor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c27_rumor",
      },
    ],
  },
  c27_rumor: {
    phase: "RUMOR TRACE",
    title: "회색 말풍선",
    speaker: "이민서",
    text:
      "5월 5일 어린이날, 새봄신협은 문을 닫았지만 전무실 불은 켜져 있습니다. 판교 KD데이터랩으로 옮겨 간 이민서가 화상 통화로 캡처를 거꾸로 추적해 왔습니다. 처음 올라온 곳은 금요일 밤 11시 14분 군산의 한 학부모 단체방, 두 시간 만에 서른한 개 방으로 번졌습니다. '근데 이 캡처, 원본이 단체방이 아니에요.' 그가 화면을 키웁니다. 회색 말풍선, 오른쪽 위의 작은 방패 무늬, 읽음 숫자 14. 당신은 휴대폰을 꺼내 KD캐피탈 사내 메신저를 엽니다. 말풍선 색도, 방패 무늬도 같습니다. 가려진 이름 옆으로 팀 이름이 반쯤 보입니다. '부동산금…'. 옆 교회 아이들이 씌워 준 풍선 모자를 쓴 나준혁이 말없이 믹스커피를 한 잔 더 탑니다.",
    memo: [
      "최초 게시: 금요일 23:14, 군산 학부모 단체방",
      "두 시간 만에 31개 방으로 확산",
      "캡처 화면 = KD캐피탈 사내 메신저 화면",
      "가려진 발신자 옆 팀 이름: '부동산금…'",
    ],
    triggers: ["injustice", "manipulation", "curiosity"],
    choices: [
      {
        id: "c27_rumor_tell",
        label: "돈을 빼 간 사람들에게 소문이 어디서 나왔는지 직접 알린다",
        effect: { trust: 12, humanCost: -4, legitimacy: -3, time: -5, fatigue: 6 },
        next: "c27_offer",
        cognition: { persistence: 2 },
      },
      {
        id: "c27_rumor_trace",
        label: "캡처의 원본 대화방과 보낸 사람을 사내 감사 절차로 확인한다",
        effect: { legitimacy: 12, trust: -3, time: -6, humanCost: 3, fatigue: 4 },
        next: "c27_offer",
        cognition: { inference: 2 },
      },
      {
        id: "c27_rumor_hold",
        label: "캡처는 쥐고 있다가 협상 카드로 쓴다",
        effect: { capital: 7, time: 5, trust: -4, legitimacy: -2, humanCost: 4, fatigue: -2 },
        next: "c27_offer",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c27_offer",
      },
    ],
  },
  c27_offer: {
    phase: "THE OFFER",
    title: "38퍼센트",
    speaker: "권도현",
    text:
      "목요일 아침 7시, KD캐피탈 부동산금융팀 명의의 '긴급 지원안'이 남궁솔의 메일함에 들어옵니다. 새봄신협이 평택에 넣은 60억, 후순위(돈을 돌려받는 차례가 뒤인 자리) 몫을 38%에 사 주겠다는 내용입니다. 22억 8천만 원을 오늘 현금으로, 서명은 18시까지. 그 손실은 조합원 출자금(조합원들이 낸 밑천으로, 예금과 달리 보호되지 않는 돈)부터 깎아 먹습니다. 그때 객장 문이 열리고 권도현이 들어옵니다. 평택 공사의 선순위(돈을 먼저 돌려받는 자리) 채권자인 브릿지은행 쪽 사람이고, 휴가를 내고 왔다고 합니다. 그가 번호표 뒷면에 세로줄을 긋고 회수율(빌려준 돈 중 실제로 돌려받는 비율)을 적습니다. 공사가 다시 돌면 71%, 오늘 팔면 38%. '이 가격이면 적자가 아닙니다. 약탈입니다.' 남궁솔이 메일을 끝까지 내립니다. 담당자 서명란이 비어 있습니다.",
    memo: [
      "KD캐피탈 제안: 후순위 60억을 38%(22억 8천만 원)에 매입",
      "서명 기한: 목요일 18시",
      "권도현 계산: 공사 재개 시 회수율 71%",
      "손실 37억 2천만 원 -- 출자금부터 깎임",
    ],
    triggers: ["injustice", "responsibility", "competition"],
    choices: [
      {
        id: "c27_offer_stand",
        label: "평택 몫은 팔지 말고 버티자며 남궁솔 곁에 선다",
        effect: { trust: 12, humanCost: -5, capital: -6, time: -4, fatigue: 6 },
        next: "c27_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c27_offer_table",
        label: "권도현의 회수율 계산을 이사회 공식 자료로 올린다",
        effect: { legitimacy: 12, trust: 4, time: -7, humanCost: 3, fatigue: 5 },
        next: "c27_final",
        cognition: { inference: 2 },
      },
      {
        id: "c27_offer_sell",
        label: "38%라도 오늘 팔아 현금부터 만들자고 권한다",
        effect: { capital: 9, time: 5, trust: -5, legitimacy: -3, humanCost: 5, fatigue: -2 },
        next: "c27_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c27_final",
      },
    ],
  },
  c27_final: {
    phase: "FINAL DECISION",
    title: "어버이날 아침",
    speaker: "남궁솔",
    text:
      "5월 8일 어버이날 아침 7시 30분, 새봄신협 3층 회의실에 이사 일곱 명이 모입니다. 창밖 줄은 벌써 140명이고, 가슴마다 어젯밤 접은 종이 카네이션이 달려 있습니다. 탁자에는 종이 세 장이 놓여 있습니다. KD금융그룹이 100억을 맡기겠다는 예치 제안서, 그 조건란 맨 아래에 작은 글씨로 '평택 후순위 몫 매각 협의'. 새봄신협의 평택 몫과 메신저 캡처를 모두 공개하자는 남궁솔의 공지 초안. 그리고 하루 인출 한도를 두게 해 달라는 금융당국 신청서. 9시 객장 문이 열리기 전에 하나를 골라야 합니다. 남궁솔이 당신을 봅니다. '아버지는 사흘을 버텼대요. 저는 오늘 하루를 어떻게 버틸지 정해야 해요. 저 줄에 선 사람들 이름으로요.'",
    memo: [
      "그룹 예치 제안 100억 -- 조건: 평택 몫 매각 협의",
      "전면 공개 공지 초안 -- 캡처 원본 포함",
      "인출 한도 신청서 -- 1인 1일 500만 원",
      "객장 개점 09:00, 대기 140명",
    ],
    triggers: ["choice", "protection", "injustice"],
    choices: [
      {
        id: "c27_final_fund",
        label: "그룹 돈 100억을 받아 오늘 줄부터 막고 조건은 나중에 싸운다",
        effect: { trust: 11, humanCost: -6, legitimacy: -6, capital: 4, time: -4, fatigue: 5 },
        next: "case27_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c27_final_open",
        label: "문 열기 전에 평택 몫과 캡처를 객장에 전부 공개한다",
        effect: { legitimacy: 13, trust: 6, capital: -7, time: -8, humanCost: 3, fatigue: 6 },
        next: "case27_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c27_final_limit",
        label: "금융당국에 인출 한도를 요청해 하루 500만 원으로 묶는다",
        effect: { time: 7, capital: 9, trust: -6, legitimacy: -3, humanCost: 6, fatigue: -4 },
        next: "case27_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case27_result",
      },
    ],
  },
};

/**
 * Everything else case 27 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case27 = {
  id: "case27",
  nodes: case27Nodes,
  aftermath: {
    c27_aftershock: {
      phase: "AFTERMATH",
      title: "짬뽕 열두 그릇",
      speaker: "남궁솔",
      text: "금요일 오후 4시, 셔터가 내려갑니다. 마지막 번호표는 412번이었고, 그 뒤로 돈을 다시 맡기러 온 사람이 서른여덟 명입니다. 남궁솔이 역전 중국집에서 짬뽕 열두 그릇을 시킵니다. 권도현은 한 그릇 값과 오늘 다시 들어온 예금을 나란히 적다가 '이건 제가 계산할 칸이 아니네요' 하고 젓가락을 듭니다. 나준혁은 도장 찍힌 번호표 한 장을 지갑 속 오징어순대집 쿠폰 옆에 꽂습니다. '30년 만에 제일 잘 찍은 도장이야.' 하정희 할머니가 카네이션을 단 채 새 통장을 흔들며 지나갑니다. 그때 도윤하에게서 메시지가 옵니다. '다음 주부터 KD생명 콜센터로 보내진대요. 미리 받은 대본에 거절이라는 말이 열네 번 나와요.'",
      memo: ["마지막 번호표 412번", "다시 맡긴 조합원 38명", "짬뽕 12그릇 -- 계산은 남궁솔", "도윤하: 다음 주 KD생명 콜센터 파견, 대본 속 '거절' 14번"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c27_after_warm", label: "군산에 하루 더 남아 돌아오는 사람들을 끝까지 맞는다", effect: { trust: 12, humanCost: -6, time: -4, capital: -2, fatigue: -7 }, next: "case27_result", cognition: { reframing: 2 } },
        { id: "c27_after_record", label: "대화방 기록과 정리안을 소문 피해 보고서로 남긴다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -2, fatigue: 5 }, next: "case27_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c27_after_rush", label: "캡처를 들고 곧장 KD캐피탈 부동산금융팀으로 올라간다", effect: { capital: 8, legitimacy: 5, trust: -6, humanCost: 5, fatigue: 5 }, next: "case27_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c27_final", "c27_aftershock"],
  connectiveScenes: [
    ["c27_savings", "c27_queue", "c27_rumor", "두 달 남은 적금", "남궁솔", "오후 2시, 일흔네 살 하정희 할머니 차례입니다. 손주 대학 등록금으로 3년 가까이 부어 온 적금 2,400만 원, 만기까지 두 달 남았습니다. 지금 깨면 이자가 절반 넘게 날아갑니다. 남궁솔이 할머니 손을 잡고 천천히 설명합니다. 이 적금은 예금자 보호(금융회사가 문을 닫아도 1억 원까지는 돌려받게 해 주는 제도) 대상이라 한 푼도 사라지지 않습니다. 할머니가 고개를 끄덕이다가 웁니다. '솔이 너는 믿어. 근데 서울 사는 우리 아들이 뉴스 보고 당장 빼래. 자식 말도 들어야지.' 통장을 쥔 손이 떨립니다.", ["하정희(74) 적금 2,400만 원 -- 만기 두 달 전", "중도 해지 시 이자 절반 이상 손실", "예금자 보호 한도 1억 원 -- 전액 보호 대상"], ["할머니 아들에게 직접 전화해 예금이 안전한 이유를 설명한다", "해지 대신 적금을 맡기고 급한 돈만 빌리는 길을 안내한다", "원하시는 대로 해지 처리를 빨리 끝내 드린다"]],
    ["c27_returns", "c27_rumor", "c27_offer", "검정 비닐봉지", "나준혁", "수요일 점심 무렵, 장화를 신은 수산시장 곽 사장이 검정 비닐봉지를 들고 줄을 거슬러 들어옵니다. 창구에 봉지를 쏟자 5만 원권 다발이 나옵니다. 월요일에 찾아 갔던 3천만 원입니다. '솔이 얼굴 보니께 도로 넣어야 쓰겄어. 집에 두니 잠이 안 와.' 줄 뒤에서 웃음이 터집니다. 오후까지 다시 맡기러 온 사람이 열일곱 명입니다. 나준혁은 입금 전표에 도장을 찍으며 사람마다 '돌아온 걸 환영합니다'라고 말하다가 목이 멥니다. 그래도 줄은 아직 200명이고, 나가는 돈이 들어오는 돈보다 세 배 많습니다.", ["재예치 17명 -- 곽 사장 3천만 원 첫 번째", "수요일 대기 약 200명", "인출액이 재예치액의 세 배"], ["다시 맡기러 온 사람들의 입금 줄을 따로 만들어 앞세운다", "다시 맡긴 조합원에게 줄 우대 조건을 공식 공지로 낸다", "들어온 돈은 조용히 받고 소문이 가라앉기만 기다린다"]],
    ["c27_carnation", "c27_offer", "c27_final", "도면 같은 카네이션", "나준혁", "목요일 밤 10시, 객장 탁자에 색종이가 쌓입니다. 내일은 어버이날이고, 남궁솔은 줄 선 어르신들에게 카네이션을 달아 드리고 싶다고 했습니다. 나준혁은 도장 찍던 손으로 꽃잎 끝을 한 치 오차 없이 접습니다. 권도현이 접은 카네이션은 꽃잎이 정확히 여섯 장이고 모서리가 전부 직각이라, 남궁솔이 '이건 꽃이 아니라 도면이네요' 하고 웃습니다. 강태민이 보낸 컵라면 한 상자가 택배로 도착합니다. 웃음이 잦아들 무렵 남궁솔이 색종이를 내려놓습니다. '내일 이걸 달아 드리면서, 한도가 있다고 말해야 할 수도 있어요.'", ["종이 카네이션 150개 목표", "권도현의 카네이션: 꽃잎 6장, 전부 직각", "강태민 택배: 컵라면 한 상자"], ["내일 줄 선 어르신들에게 카네이션을 직접 달아 드리자고 한다", "내일 아침 이사회 자료부터 밤새 같이 정리한다", "카네이션은 두고 인출 한도 공지문부터 써 둔다"]],
  ],
  connectiveOrder: [["c27_queue", "c27_savings"], ["c27_rumor", "c27_returns"], ["c27_offer", "c27_carnation"]],
  choiceEffects: {
    c27_queue: [
      { trust: 10, humanCost: -5, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 7, trust: 4, humanCost: -2, time: -5, fatigue: 3 },
      { time: 4, capital: 4, trust: -3, humanCost: 5, fatigue: -3 },
    ],
    c27_rumor: [
      { trust: 11, legitimacy: 3, humanCost: -4, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 8, trust: 3, capital: -5, time: -3, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
    c27_offer: [
      { trust: 10, humanCost: -4, time: -3, capital: -2, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 2, fatigue: 4 },
      { time: 5, capital: 4, trust: -2, humanCost: 4, fatigue: -2 },
    ],
  },
  choiceCopy: {
    c27_queue: {
      voice: ["할머니 아들에게 직접 전화해, 예금이 안전한 이유를 설명한다.", "해지 대신 적금을 맡기고, 급한 돈만 빌리는 길을 안내한다.", "원하시는 대로, 해지 처리를 빨리 끝내 드린다."],
      echo: ["전화를 받은 아들은 한참 말이 없다가 '엄마 바꿔 주세요'라고 합니다. 그 통화가 20분 걸리는 동안 뒤의 줄은 열두 명이 늘어납니다.", "적금을 맡기고 빌리면 이자는 지켜집니다. 할머니는 서류 네 장에 서명하다가 '이게 더 무섭다'고 합니다.", "해지는 3분이면 끝납니다. 할머니는 현금 봉투를 가슴에 안고 나가고, 통장 마지막 줄에 '해지' 두 글자가 남습니다."],
    },
    c27_rumor: {
      voice: ["다시 맡기러 온 사람들의, 입금 줄을 따로 만들어 앞세운다.", "다시 맡긴 조합원에게 줄 우대 조건을, 공식 공지로 낸다.", "들어온 돈은 조용히 받고, 소문이 가라앉기만 기다린다."],
      echo: ["입금 줄이 따로 서자 사람들이 그 줄을 구경합니다. 구경하던 사람 중 둘이 슬그머니 그 줄로 옮겨 섭니다.", "공지는 정확합니다. 그리고 우대 조건이라는 말이 붙는 순간 몇 사람은 '그만큼 급하다는 거냐'고 묻습니다.", "조용히 받은 돈은 조용히 쌓입니다. 곽 사장은 자기가 돌아왔다는 걸 아무도 모른다며 조금 서운해합니다."],
    },
    c27_offer: {
      voice: ["내일 줄 선 어르신들에게, 카네이션을 직접 달아 드리자고 한다.", "내일 아침 이사회 자료부터, 밤새 같이 정리한다.", "카네이션은 두고, 인출 한도 공지문부터 써 둔다."],
      echo: ["직접 달아 드리려면 새벽 여섯 시에 나와야 합니다. 권도현이 '그럼 직각 카네이션도 달겠습니다'라고 합니다.", "자료는 새벽 두 시에 끝납니다. 카네이션 절반은 탁자 위에 접히다 만 채로 남습니다.", "공지문은 반 장이면 됩니다. 남궁솔은 그 반 장을 세 번 고쳐 쓰고, 세 번 다 지웁니다."],
    },
  },
  reactionScenes: [
    ["c27_savings_reaction", "c27_savings", "c27_rumor", "1998년의 이불", "남궁솔", "밤 9시, 셔터를 내린 객장에 번호표 조각이 흩어져 있습니다. 첫날 빠져나간 돈은 38억. 남궁솔이 대기 의자에 앉아 벽에 걸린 흑백 사진을 가리킵니다. 같은 객장 바닥에 이불을 깔고 앉은 남자입니다. '아버지예요. 1998년에 여기 전무였어요. 그때도 소문이 돌아서 사흘을 여기서 주무셨대요. 줄 선 사람들한테 보리차를 끓여 주면서요.' 그가 웃습니다. '그때 줄 섰던 분들이 지금 우리 이모 삼촌들이에요. 그분들이 오늘 또 섰어요. 아버지가 이걸 못 보고 가셔서 다행이에요.'", ["오늘 밤은 남궁솔과 같이 객장을 지킨다", "내일 창구에서 쓸 설명 문안을 같이 다듬는다", "숙소로 돌아가 쉬고 내일 아침 일찍 다시 온다"]],
    ["c27_returns_reaction", "c27_returns", "c27_offer", "금요일 밤, 월요일 아침", "반재욱", "저녁, 감사팀 지방 순회로 전주에 있던 반재욱이 차를 몰고 옵니다. 그가 주차장에서 수첩을 펼칩니다. 지난 1년 사이 전북의 작은 금융 조합 세 곳에 똑같은 소문이 돌았습니다. 짓다 만 공사장에 물려 이번 달을 못 넘긴다는 한 줄. 세 곳 모두 한 달 안에 그 공사장에 넣었던 몫을 KD캐피탈에 헐값으로 넘겼고, 그중 한 곳은 이듬해 다른 조합에 합쳐져 이름이 사라졌습니다. 반재욱이 펜을 멈춥니다. '소문은 매번 금요일 밤에 돌았습니다. 그리고 매번 월요일 아침에 같은 회사가 전화를 걸었습니다.'", ["세 곳 조합 사람들에게 연락해 같은 일을 겪었는지 묻는다", "세 건의 매각 기록을 감사팀 공식 자료로 요청한다", "지난 일은 두고 새봄신협 하나를 지키는 데 집중한다"]],
    ["c27_carnation_reaction", "c27_carnation", "c27_final", "해지 두 글자", "하정희", "밤 11시, 셔터를 두드리는 소리가 납니다. 하정희 할머니가 박대 한 묶음과 해지한 적금 통장을 들고 서 있습니다. '낮에 곽 사장이 도로 넣었다는 말 듣고 잠이 안 와서.' 할머니가 통장을 탁자에 놓습니다. '우리 아들한테 전화해서 혼냈어. 엄마 돈은 엄마가 알아서 한다고. 이거 도로 살릴 수 있어? 우리 손주 입학할 때 딱 맞춰 찾으려던 거야.' 통장 마지막 줄에는 월요일 날짜와 '해지' 두 글자가 찍혀 있습니다. 남궁솔이 대답 대신 할머니 손부터 잡습니다.", ["해지한 적금을 원래 조건 그대로 되살릴 방법을 찾는다", "되살릴 수 없다면 그 이유를 서류로 쉽게 설명해 드린다", "오늘은 박대만 받고 새 적금은 다음에 들자고 한다"]],
  ],
  reactionEffects: {
    c27_savings: [
      { trust: 9, humanCost: -3, time: -3, fatigue: 5 },
      { legitimacy: 8, trust: 3, capital: -3, time: -4, fatigue: 3 },
      { time: 4, capital: 2, trust: 2, humanCost: 2, fatigue: -4 },
    ],
    c27_returns: [
      { trust: 9, humanCost: -4, time: -5, fatigue: 4 },
      { legitimacy: 9, trust: 2, capital: -3, time: -4, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, legitimacy: -4, humanCost: 3, fatigue: -3 },
    ],
    c27_carnation: [
      { trust: 11, humanCost: -5, capital: -4, legitimacy: -2, fatigue: 4 },
      { legitimacy: 8, trust: 2, humanCost: 2, time: -4, fatigue: 3 },
      { time: 3, capital: 3, trust: 2, humanCost: 3, legitimacy: -2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c27_savings: {
      voice: ["오늘 밤은, 남궁솔과 같이 객장을 지킨다.", "내일 창구에서 쓸 설명 문안을, 같이 다듬는다.", "숙소로 돌아가 쉬고, 내일 아침 일찍 다시 온다."],
      echo: ["같이 지키면 남궁솔이 보리차를 끓입니다. 아버지가 쓰던 주전자라고 합니다. 새벽 세 시쯤 둘 다 대기 의자에서 잠이 듭니다.", "문안은 석 줄로 줄어듭니다. '보호됩니다. 1억 원까지입니다. 이모 돈은 안 없어져요.' 마지막 줄은 남궁솔이 고쳐 넣습니다.", "쉬고 오면 머리는 맑습니다. 남궁솔은 그 밤을 혼자 객장에서 보내고, 아침에 같은 옷을 입고 문을 엽니다."],
    },
    c27_returns: {
      voice: ["세 곳 조합 사람들에게 연락해, 같은 일을 겪었는지 묻는다.", "세 건의 매각 기록을, 감사팀 공식 자료로 요청한다.", "지난 일은 두고, 새봄신협 하나를 지키는 데 집중한다."],
      echo: ["전화를 받은 옛 전무 한 사람이 한참 웃습니다. '이제야 누가 물어보네요.' 이름이 사라진 조합의 사람입니다.", "요청서는 반재욱의 이름으로 올라갑니다. 지방 순회 중인 감사역의 요청을 누가 먼저 읽을지는 아직 모릅니다.", "새봄신협 하나에 집중하면 오늘 줄은 조금 줄어듭니다. 세 곳의 이야기는 반재욱의 수첩에만 남습니다."],
    },
    c27_carnation: {
      voice: ["해지한 적금을, 원래 조건 그대로 되살릴 방법을 찾는다.", "되살릴 수 없다면, 그 이유를 서류로 쉽게 설명해 드린다.", "오늘은 박대만 받고, 새 적금은 다음에 들자고 한다."],
      echo: ["방법은 하나 있습니다. 새봄신협이 이자 차액을 떠안는 것입니다. 남궁솔이 그 칸에 자기 이름을 적습니다.", "서류는 정확하고 친절합니다. 할머니는 끝까지 읽고 '그러니까 안 된다는 거지' 하고 웃습니다.", "박대는 맛있습니다. 권도현이 '이건 칸이 필요 없는 선물'이라며 한 마리를 굽습니다. 통장은 할머니 가방으로 돌아갑니다."],
    },
  },
  reactionMemos: {
    c27_savings_reaction: ["1998년 객장 사진 -- 이불을 깐 전 전무", "그때 줄 섰던 사람들이 오늘 또 섰다"],
    c27_returns_reaction: ["전북 작은 조합 세 곳 -- 같은 소문, 같은 매수자", "금요일 밤 소문, 월요일 아침 전화"],
    c27_carnation_reaction: ["해지한 적금 통장과 박대 한 묶음", "손주 입학에 맞춰 두었던 만기"],
  },
  branchPlan: ["c27_rumor", 2, "c27_branch_vault", "c27_branch_vault_follow"],
  branchScenes: {
    // CASE 27's detour is the vault. The rumour scene decides what to do with a
    // screenshot; the side door is the room the screenshot was aimed at, where
    // two people count what is left the night before the doors reopen.
    c27_branch_vault: {
      phase: "SIDE DOOR",
      title: "지폐 세는 소리",
      speaker: "나준혁",
      text: "캡처를 휴대폰 깊숙이 넣고 전무실을 나오니 금고 문이 반쯤 열려 있습니다. 남궁솔과 나준혁이 지폐 계수기 두 대를 돌리며 수요일 아침에 쓸 시재(창구와 금고에 지금 있는 현금)를 세고 있습니다. 5만 원권 띠지가 쌓이는 속도보다 계산기 숫자가 줄어드는 속도가 빠릅니다. 남은 현금 9억 2천만 원. 중앙회에 맡겨 둔 돈을 현금으로 받으려면 수요일 오전 10시 수송차를 기다려야 합니다. 나준혁이 띠지를 묶다 말고 말합니다. '30년 동안 돈 세는 소리가 이렇게 무서운 건 처음이네.' 남궁솔이 계수기를 멈춥니다. '문 열고 한 시간이면 이게 다 나가요.'",
      memo: ["금고 잔액 9억 2천만 원", "중앙회 현금 수송: 수요일 10:00", "월요일 인출 38억, 화요일 휴무", "개점 09:00부터 수송 도착까지 한 시간 공백"],
      triggers: ["fear", "protection", "responsibility"],
      choices: [
        { id: "c27_branch_vault_a", label: "수송차가 올 때까지 창구 앞에서 직접 사정을 설명하겠다고 한다", effect: { trust: 11, legitimacy: 4, capital: -6, time: -5, fatigue: 5 }, next: "c27_branch_vault_follow", cognition: { persistence: 2 } },
        { id: "c27_branch_vault_b", label: "남은 현금과 중앙회 자금 일정을 조합원 공지로 투명하게 낸다", effect: { legitimacy: 10, trust: 3, time: -6, humanCost: 3, fatigue: 4 }, next: "c27_branch_vault_follow", cognition: { inference: 2 } },
        { id: "c27_branch_vault_c", label: "문을 한 시간 늦게 열어 수송차 도착 시각에 맞춘다", effect: { capital: 7, time: 5, trust: -2, humanCost: 4, fatigue: -3 }, next: "c27_branch_vault_follow", cognition: { risk: 1 } },
      ],
    },
    c27_branch_vault_follow: {
      phase: "SIDE DOOR",
      title: "앞문으로 들어오는 상자",
      speaker: "남궁솔",
      text: "수요일 오전 10시 2분, 현금 수송차가 객장 앞 골목에 섭니다. 나준혁이 경비원에게 부탁합니다. 돈 상자를 뒷문 말고 앞문으로, 줄 선 사람들 눈앞으로 들여 달라는 겁니다. 회색 상자 여섯 개가 사람들 사이를 지나가자 줄이 술렁입니다. '돈 들어온다.' '저거 다 진짜여?' 몇 사람이 번호표를 접어 주머니에 넣고 돌아섭니다. 남궁솔이 당신 옆에서 작게 말합니다. '저 상자, 중앙회에서 빌려 온 거예요. 이자 붙는 돈이에요. 보여 드리는 건 좋은데, 저게 원래 우리 돈인 줄 아시면 안 되잖아요.'",
      memo: ["현금 상자 6개 -- 중앙회 긴급 차입", "앞문 반입 뒤 대기 23명 이탈", "차입 이자 연 4.1%", "나준혁: '보여 주는 것도 설명이다'"],
      triggers: ["trust", "manipulation", "responsibility"],
      choices: [
        { id: "c27_branch_vault_follow_a", label: "상자가 빌린 돈이라는 것까지 줄 선 사람들에게 솔직히 말한다", effect: { trust: 12, legitimacy: 3, humanCost: -4, capital: -7, time: -5, fatigue: 5 }, next: "c27_returns", cognition: { reframing: 2 } },
        { id: "c27_branch_vault_follow_b", label: "중앙회 차입 조건을 이사회 보고로 먼저 남긴다", effect: { legitimacy: 11, trust: 4, time: -6, humanCost: 3, fatigue: 5 }, next: "c27_returns", cognition: { inference: 2 } },
        { id: "c27_branch_vault_follow_c", label: "보여 주기는 통했으니 설명은 줄이 빠진 뒤로 미룬다", effect: { time: 6, capital: 5, trust: 3, humanCost: 4, legitimacy: -3, fatigue: -3 }, next: "c27_returns", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c27_start",
    result: "c27_aftershock",
    defaultFree: "c27_route_system",
    // One town, one door. Like the cases before it this is a single line; the
    // split is what the union trades to get through the week.
    choices: {},
    system: {
      route: "c27_route_system",
      final: "c27_final_system_route",
      title: "소문의 할인율",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 KD캐피탈 단말에서 노아가 답합니다. 노아는 그룹의 AI 심사 엔진(대출을 내줄지 자동으로 판단하는 프로그램)입니다. 지난 10년 전국 작은 금융 조합에서 일어난 뱅크런(예금자들이 한꺼번에 돈을 찾으러 몰려드는 일) 34건 가운데 29건이 출처를 끝내 모르는 소문으로 시작됐습니다. 그중 21건은 석 달 안에 그 조합이 들고 있던 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출) 후순위(돈을 돌려받는 차례가 뒤인 자리) 몫이 더 큰 금융회사로 헐값에 넘어갔습니다. 사들인 회사 이름이 채워진 기록은 여섯 건뿐입니다. '소문은 원인이 아니라 할인율로 학습되어 있습니다. 소문이 빠를수록 가격이 낮습니다.'",
      memo: ["작은 조합 뱅크런 34건 중 출처 불명 소문 29건", "석 달 안 헐값 매각 21건", "매수 회사가 기록된 건 6건"],
      routeChoices: [
        ["c27_route_system_publish", "통계를 새봄신협 객장과 지역 언론에 동시에 공개한다", { legitimacy: 10, trust: 6, capital: -5, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c27_route_system_warn", "헐값에 넘어간 21곳의 옛 조합원들을 찾아 사실을 알린다", { trust: 10, legitimacy: 3, humanCost: -4, capital: -5, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c27_route_system_drop", "통계는 덮고 이번 주 줄을 버티는 데만 쓴다", { time: 8, capital: 6, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "소문이 퍼진 조합의 자산은 석 달간 못 사게 하는 규칙을 제안한다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 두고 새봄신협의 매각 가격만 올려 받는다", { capital: 10, time: 6, trust: -6, legitimacy: -7, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "소문 때문에 손해 본 조합원들의 피해 신고를 대신 모은다", { legitimacy: 7, trust: 10, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c27_evidence_turn",
    result: "c27_aftershock",
    sourceRoutes: ["c27_queue", "c27_rumor", "c27_offer", "c27_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 캡처 옆에 놓고, 회색 말풍선이 원래 어느 대화방에 있었는지 맞춰 본다.",
    entryEcho: "단서를 대면 소문보다 먼저 쓰인 문서가 보입니다. 그 문서에는 새봄신협의 값이 이미 적혀 있습니다.",
    title: "소문보다 먼저 쓰인 가격",
    speaker: "반재욱",
    text: "단서를 맞추자 캡처 속 대화방의 전체 기록이 열립니다. KD캐피탈 부동산금융팀 사람들이 들어 있는 사내 대화방, 금요일 밤 10시 52분. 팀장 구승민이 표 하나를 올립니다. 평택 공사에 돈을 댄 일곱 곳 가운데 새봄신협 칸만 빨갛게 칠해져 있습니다. '여기는 줄 한 번 서면 알아서 던집니다.' 22분 뒤 같은 표가 군산 학부모 단체방에 올라옵니다. 대화방 맨 위에는 4월 28일에 만든 문서 하나가 걸려 있습니다. '새봄 후순위 정리안: 38% 매입 후 라운드힐 묶음에 편입.' 새봄신협 몫을 싸게 사들여 라운드힐 통매각(부실 자산을 한 묶음으로 한꺼번에 파는 것)에 끼워 넣겠다는 뜻입니다. 승인자 칸은 비어 있습니다. 반재욱이 수첩을 덮습니다. '소문이 먼저가 아니었습니다. 가격표가 먼저 있었고, 소문은 그 가격표를 붙이는 풀이었습니다.'",
    memo: ["대화방 게시 22:52 → 학부모 단체방 23:14", "정리안 작성일 4월 28일 -- 소문보다 나흘 앞섬", "'라운드힐 통매각 묶음 편입', 승인자 칸 빈칸"],
    triggers: ["injustice", "manipulation", "system"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, capital: -3, fatigue: 4 },
    choices: [
      ["c27_evidence_turn_assembly", "정리안을 새봄신협 조합원 총회에 원문 그대로 공개한다", { legitimacy: 12, trust: 7, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c27_evidence_turn_hold", "정리안은 쥐고 라운드힐 거래가 드러날 때까지 기다린다", { capital: 9, time: 5, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c27_evidence_turn_share", "소문을 믿고 돈을 뺀 조합원들에게 정리안부터 보여 준다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c27_branch_vault",
    systemNext: "c27_route_system",
    evidenceNext: "c27_evidence_turn",
    routeLabel: "직전 사건의 평택 현장 연락망으로 새봄신협 금고 사정부터 듣는다",
    systemLabel: "직전 자유응답 문장이 소문 캡처의 말투와 닮았는지 본다",
    evidenceLabel: "직전 단서를 붙여 캡처 속 대화방의 원본 기록을 연다",
  },
  openingRoutes: {
    c26_after_warm: "c27_start_warm",
    c26_after_record: "c27_start_record",
    c26_after_rush: "c27_start_rush",
  },
  openingCopy: {
    c27_start_warm: ["현장에 남았던 사람의 뱅크런", "나준혁", "평택 공사 현장에서 사람들 곁에 남아 밤을 넘긴 뒤 열흘, 점퍼에는 아직 시멘트 가루가 묻어 있습니다. 5월 4일 새벽, 그 점퍼 주머니에서 휴대폰이 울립니다. 나준혁입니다. '군산에 새벽 네 시부터 줄이 섰어요.' 금요일 밤부터 돌기 시작한 소문은 한 줄입니다. 군산 새봄신협(동네 사람들이 조합원이 되어 함께 꾸리는 작은 금융 조합)이 평택 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출)에 물려 이번 달을 못 넘긴다는 것. 멈춘 타워크레인을 직접 본 사람은 당신입니다. 그 크레인에 새봄신협 조합원들의 돈 60억이 걸려 있습니다. 뱅크런(예금자들이 한꺼번에 돈을 찾으러 몰려드는 일)이 크레인보다 먼저 사람들을 무너뜨리려 합니다.", ["새봄신협 앞 대기 약 180명 -- 04시부터", "평택 오피스텔 PF 후순위 참여 60억", "나준혁: 은행원 첫 자리가 군산"]],
    c27_start_record: ["기록을 남긴 사람의 뱅크런", "반재욱", "평택 현장에서 본 것을 당신은 문서로 남겼습니다. 공사에 돈을 댄 일곱 곳과 각자 넣은 금액까지 표로 정리했습니다. 5월 4일 새벽, 감사팀 지방 순회로 전주에 있던 반재욱이 캡처 한 장을 보냅니다. 군산 새봄신협(동네 사람들이 조합원이 되어 함께 꾸리는 작은 금융 조합)이 평택 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출)에 물려 이번 달을 못 넘긴다는 한 줄, 그 아래 붙은 표가 당신 문서의 3쪽과 칸 하나까지 같습니다. 새봄신협 앞에는 새벽 네 시부터 줄이 섰습니다. 뱅크런(예금자들이 한꺼번에 돈을 찾으러 몰려드는 일)입니다. 반재욱이 덧붙입니다. '당신 표가 누구 손을 거쳐 군산 단체방까지 갔는지부터 봐야겠습니다.'", ["캡처 속 표 = 당신 문서 3쪽", "새봄신협 앞 대기 약 180명", "반재욱: 감사팀 지방 순회 중 전주"]],
    c27_start_rush: ["먼저 돌아온 사람의 뱅크런", "나준혁", "평택을 뒤로하고 곧장 본사로 돌아온 당신은 금요일 밤 11시까지 KD캐피탈 본사 12층에 남아 다음 안건을 넘겼습니다. 그 밤, 칸막이 너머 부동산금융팀 자리에서 메신저 알림이 유난히 자주 울렸고 누군가 낮게 웃었습니다. 월요일 새벽 6시 50분, 나준혁이 전화합니다. '군산에 줄이 섰어요. 벌써 180명이에요.' 금요일 밤부터 돌기 시작한 캡처는 한 줄입니다. 군산 새봄신협(동네 사람들이 조합원이 되어 함께 꾸리는 작은 금융 조합)이 평택 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출)에 물려 이번 달을 못 넘긴다는 것. 뱅크런(예금자들이 한꺼번에 돈을 찾으러 몰려드는 일)이 시작됐습니다. 금요일 밤 그 웃음소리가 당신 귀에 다시 들립니다.", ["금요일 23시, 부동산금융팀 자리의 메신저 알림", "새봄신협 앞 대기 약 180명", "캡처 최초 게시 시각: 금요일 23:14"]],
  },
  openingSignatures: {
    c27_start_warm: {
      label: "평택에서 함께 버틴 동료들을 군산 줄 앞으로 불러 모은다",
      effect: { trust: 12, humanCost: -4, capital: -4, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "평택에서 함께 버틴 동료들을, 군산 줄 앞으로 불러 모은다.",
      echo: "부르면 강태민이 가장 먼저 답합니다. '컵라면 몇 개요.' 다른 사람들은 휴가를 내느라 반나절이 걸립니다.",
    },
    c27_start_record: {
      label: "내 문서의 표가 소문에 쓰였다는 사실부터 새봄신협에 밝힌다",
      effect: { trust: 9, legitimacy: 6, humanCost: 2, time: -5, capital: -3, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "내 문서의 표가 소문에 쓰였다는 사실부터, 새봄신협에 밝힌다.",
      echo: "밝히면 남궁솔은 당신을 한참 봅니다. 그리고 '그럼 그 표를 쓴 사람이 누군지도 같이 찾아 주세요'라고 합니다.",
    },
    c27_start_rush: {
      label: "금요일 밤 부동산금융팀의 메신저 알림을 떠올려 대화방부터 찾는다",
      effect: { legitimacy: 10, capital: 4, trust: -4, humanCost: 3, time: -3, fatigue: 3 },
      cognition: { persistence: 2 },
      voice: "금요일 밤 부동산금융팀의 메신저 알림을 떠올려, 대화방부터 찾는다.",
      echo: "찾기 시작하면 12층에 남은 사람은 당신뿐입니다. 군산의 줄은 그동안 스무 명이 더 늘어납니다.",
    },
  },
  voiceLines: {
    // CASE 27. A queue of neighbours. Every line is said to someone holding a
    // passbook, so none of them is allowed to sound like a press release.
    c27_start_visit: "숫자는 가면서 보겠다며, 첫차로 군산에 내려가 줄 선 사람들부터 만난다.",
    c27_start_numbers: "새봄신협이 평택에, 얼마를 어떤 순서로 넣었는지부터 확인한다.",
    c27_start_report: "위험관리부 보고로 올리고, 대응은 그룹에 맡긴다.",
    c27_queue_explain: "줄 선 사람 한 명씩에게, 예금이 보호되는 한도부터 설명한다.",
    c27_queue_post: "새봄신협의 평택 몫과 현금 사정을, 숫자로 객장 벽에 붙인다.",
    c27_queue_open: "창구를 전부 열어, 달라는 대로 빨리 내준다.",
    c27_rumor_tell: "돈을 빼 간 사람들에게, 소문이 어디서 나왔는지 직접 알린다.",
    c27_rumor_trace: "캡처의 원본 대화방과 보낸 사람을, 사내 감사 절차로 확인한다.",
    c27_rumor_hold: "캡처는 쥐고 있다가, 협상 카드로 쓴다.",
    c27_branch_vault_a: "수송차가 올 때까지, 창구 앞에서 직접 사정을 설명하겠다고 한다.",
    c27_branch_vault_b: "남은 현금과 중앙회 자금 일정을, 조합원 공지로 투명하게 낸다.",
    c27_branch_vault_c: "문을 한 시간 늦게 열어, 수송차 도착 시각에 맞춘다.",
    c27_branch_vault_follow_a: "상자가 빌린 돈이라는 것까지, 줄 선 사람들에게 솔직히 말한다.",
    c27_branch_vault_follow_b: "중앙회 차입 조건을, 이사회 보고로 먼저 남긴다.",
    c27_branch_vault_follow_c: "보여 주기는 통했으니, 설명은 줄이 빠진 뒤로 미룬다.",
    c27_offer_stand: "평택 몫은 팔지 말고 버티자며, 남궁솔 곁에 선다.",
    c27_offer_table: "권도현의 회수율 계산을, 이사회 공식 자료로 올린다.",
    c27_offer_sell: "38%라도 오늘 팔아, 현금부터 만들자고 권한다.",
    c27_final_fund: "그룹 돈 100억을 받아 오늘 줄부터 막고, 조건은 나중에 싸운다.",
    c27_final_open: "문 열기 전에, 평택 몫과 캡처를 객장에 전부 공개한다.",
    c27_final_limit: "금융당국에 인출 한도를 요청해, 하루 500만 원으로 묶는다.",
    c27_after_warm: "군산에 하루 더 남아, 돌아오는 사람들을 끝까지 맞는다.",
    c27_after_record: "대화방 기록과 정리안을, 소문 피해 보고서로 남긴다.",
    c27_after_rush: "캡처를 들고, 곧장 KD캐피탈 부동산금융팀으로 올라간다.",
    c27_route_system_publish: "통계를, 새봄신협 객장과 지역 언론에 동시에 공개한다.",
    c27_route_system_warn: "헐값에 넘어간 21곳의 옛 조합원들을 찾아, 사실을 알린다.",
    c27_route_system_drop: "통계는 덮고, 이번 주 줄을 버티는 데만 쓴다.",
    c27_final_system_route_a: "소문이 퍼진 조합의 자산은, 석 달간 못 사게 하는 규칙을 제안한다.",
    c27_final_system_route_b: "규칙은 두고, 새봄신협의 매각 가격만 올려 받는다.",
    c27_final_system_route_c: "소문 때문에 손해 본 조합원들의, 피해 신고를 대신 모은다.",
    c27_evidence_turn_assembly: "정리안을, 새봄신협 조합원 총회에 원문 그대로 공개한다.",
    c27_evidence_turn_hold: "정리안은 쥐고, 라운드힐 거래가 드러날 때까지 기다린다.",
    c27_evidence_turn_share: "소문을 믿고 돈을 뺀 조합원들에게, 정리안부터 보여 준다.",
  },
  echoReplies: {
    // CASE 27.
    c27_start_visit: "첫차는 세 시간이 걸립니다. 버스가 군산에 닿을 무렵 나준혁이 줄 사진을 보냅니다. 골목을 한 바퀴 감았습니다.",
    c27_start_numbers: "숫자를 보면 새봄신협이 평택에서 가장 뒤 차례라는 게 드러납니다. 그걸 확인하는 데 오전이 다 갑니다.",
    c27_start_report: "보고는 10분 만에 올라갑니다. 그룹 대응팀의 첫 답장은 '상황 주시'이고, 군산의 줄은 그사이 두 배가 됩니다.",
    c27_queue_explain: "한 명씩 설명하면 줄이 느려집니다. 설명을 들은 사람 셋 중 하나는 번호표를 접고 돌아섭니다.",
    c27_queue_post: "벽에 붙은 숫자는 정확합니다. 어르신 몇 분은 돋보기를 꺼내 들고, 몇 분은 숫자가 많아서 더 무섭다고 합니다.",
    c27_queue_open: "창구가 다 열리면 줄이 빨리 줄어듭니다. 금고도 그만큼 빨리 줄어듭니다. 오후 1시에 현금이 바닥을 보입니다.",
    c27_rumor_tell: "알리면 단체방이 뒤집힙니다. '은행이 은행을 망하게 했다고?' 아직 확인되지 않은 말이라는 것도 같이 퍼집니다.",
    c27_rumor_trace: "감사 절차는 정확하고 느립니다. 요청서가 접수된 시각에 캡처는 서른두 번째 방으로 넘어갑니다.",
    c27_rumor_hold: "쥐고 있으면 강한 카드가 됩니다. 그 카드가 쓰일 때까지 소문을 믿은 사람들은 계속 줄을 섭니다.",
    c27_branch_vault_a: "창구 앞에 서면 첫 질문이 바로 나옵니다. '그래서 내 돈 있어요, 없어요?' 대답하는 데 한 사람당 4분이 걸립니다.",
    c27_branch_vault_b: "공지에 9억 2천만 원이 찍히자 단체방이 조용해졌다가 다시 시끄러워집니다. 숫자가 작아 보인다는 말과 솔직해서 믿겠다는 말이 반반입니다.",
    c27_branch_vault_c: "한 시간 늦게 열면 문 앞 줄은 한 시간만큼 길어집니다. '문 닫은 거 아니냐'는 사진이 단체방에 올라옵니다.",
    c27_branch_vault_follow_a: "솔직히 말하면 몇 사람은 다시 줄로 돌아옵니다. 그리고 정호 삼촌이 '빌려서라도 주는 데가 어디 있냐'며 번호표를 찢습니다.",
    c27_branch_vault_follow_b: "보고는 기록으로 남습니다. 이자가 붙는 돈이라는 걸 아는 사람은 이사 일곱 명뿐입니다.",
    c27_branch_vault_follow_c: "미루면 오늘 줄은 줄어듭니다. 사람들은 상자 여섯 개를 새봄신협의 돈으로 기억합니다.",
    c27_offer_stand: "버티면 18시가 지나갑니다. 22억 8천만 원은 오지 않고, 금요일 아침의 줄은 여전히 거기 있습니다.",
    c27_offer_table: "자료로 올리면 이사들이 회수율 71%를 처음 봅니다. 권도현은 번호표 뒷면을 복사해 달라고 부탁합니다. 원본은 기념으로 갖겠답니다.",
    c27_offer_sell: "팔면 오늘 현금이 생깁니다. 조합원 출자금에서 37억이 빠지고, 평택 몫은 KD캐피탈 장부로 넘어갑니다.",
    c27_final_fund: "100억이 들어오면 오늘 줄은 오전 안에 사라집니다. 조건란의 작은 글씨는 다음 주 월요일 이사회 안건으로 올라옵니다.",
    c27_final_open: "공개하면 객장 벽 앞에 사람들이 모입니다. 캡처를 본 정호 삼촌이 '이놈들이었어?' 하고 번호표를 구깁니다. 줄이 줄어들지는 아직 모릅니다.",
    c27_final_limit: "한도가 걸리면 줄은 멈춥니다. 카네이션을 단 어르신들이 500만 원짜리 봉투를 받고, 나머지는 다음 날 다시 오라는 말을 듣습니다.",
    c27_after_warm: "남으면 토요일 아침 곽 사장이 박대를 한 상자 들고 옵니다. 서울로 가는 버스는 일요일 막차입니다.",
    c27_after_record: "보고서는 일곱 장입니다. 첫 장에 하정희 할머니의 해지 날짜가 들어가고, 마지막 장에 비어 있는 승인자 칸이 들어갑니다.",
    c27_after_rush: "곧장 올라가면 12층 부동산금융팀 자리는 불이 꺼져 있습니다. 사내 메신저 목록에서 그 대화방은 이미 사라졌습니다.",
    c27_route_system_publish: "공개하면 지역 신문이 먼저 받습니다. 제목은 '소문은 누가 돌렸나'이고, 기사에 KD캐피탈이라는 이름은 아직 없습니다.",
    c27_route_system_warn: "찾아가면 이름이 사라진 조합의 옛 조합원들이 전화를 받습니다. 몇 명은 이제 와서 뭐 하냐고 끊습니다.",
    c27_route_system_drop: "덮으면 이번 주는 버팁니다. 서른다섯 번째 뱅크런이 어디서 시작될지는 노아만 압니다.",
    c27_final_system_route_a: "규칙이 생기면 다음 소문은 값이 떨어집니다. 이번 소문은 이미 제값을 받았습니다.",
    c27_final_system_route_b: "가격은 조금 오릅니다. 소문을 돌린 쪽은 조금 덜 벌고, 여전히 법니다.",
    c27_final_system_route_c: "신고가 모이면 하정희 할머니의 이자 손실이 첫 줄에 적힙니다. 신고를 받아 줄 곳은 아직 정해지지 않았습니다.",
    c27_evidence_turn_assembly: "총회에서 원문이 읽히자 강당이 조용해집니다. 누군가 '38%'를 따라 말하고, 그 숫자가 방 안을 한 바퀴 돕니다.",
    c27_evidence_turn_hold: "쥐고 있으면 라운드힐이라는 이름이 더 큰 판에서 쓸모가 있습니다. 그 사이 새봄신협은 혼자 금요일을 버팁니다.",
    c27_evidence_turn_share: "보여 주면 돈을 뺀 사람들이 자기가 누구 계산에 쓰였는지 압니다. 몇 명은 그날 오후 다시 통장을 만듭니다.",
  },
  characterProfiles: {
    남궁솔: {
      role: "군산 새봄신협 전무 · 30대",
      stance: "동네 · 이름 · 버팀",
      job: "숫자로 흔들리는 줄을 이름으로 붙잡는다. 소문과 싸울 무기가 사람을 기억하는 것뿐인 금융인.",
      appearance: "신협 로고가 박힌 남색 조끼, 손목에 감은 번호표 묶음용 고무줄 세 개, 아버지가 쓰던 찌그러진 보리차 주전자.",
      thought: "아버지가 1998년에 이불 깔고 지킨 객장이다. 캡처 한 장에 넘겨줄 수는 없다.",
      gesture: "남궁솔은 대답하기 전에 상대의 이름부터 부른다. 이름을 부르고 나면 목소리가 한 단계 낮아진다.",
      voice: "군산 말씨가 살짝 섞인 빠른 존댓말로, 숫자보다 이름을 먼저 말한다.",
      line: "번호 말고 이름으로 불러 드릴게요. 여기는 그래도 되는 데예요.",
    },
    하정희: {
      role: "새봄신협 조합원 · 74세",
      stance: "손주 · 불안 · 자존심",
      job: "소문이 가장 먼저 닿는 사람의 얼굴이 된다. 보호받는 돈을 잃는 건 돈이 아니라 믿음 때문이라는 걸 보여 준다.",
      appearance: "꽃무늬 누빔 조끼, 고무줄로 묶은 통장 세 권, 장바구니에 늘 든 박대 한 묶음.",
      thought: "솔이는 믿는다. 그래도 자식이 빼라는데 어미가 버틸 수가 있나.",
      gesture: "하정희는 통장을 가슴에 대고 두 손으로 누른 채 말한다.",
      voice: "느린 전라도 말씨로, 미안할 때일수록 목소리가 커진다.",
      line: "솔이 너는 믿어. 근데 자식 말도 들어야지.",
    },
  },
  setting: { place: "KD캐피탈 본사 12층 · 위험관리부", clock: "5월 4일 월요일 · 새벽 06:50" },
  sceneContext: {
    c27_start: {
      place: "KD캐피탈 본사 12층 · 위험관리부",
      clock: "5월 4일 월요일 · 새벽 06:50",
      question: "군산의 작은 금융 조합 앞에 캡처 한 장 때문에 줄이 섰습니다. 무엇부터 하겠습니까?",
      lead: "KD캐피탈 위험관리부로 옮겨 온 지 한 달, 사원증 사진은 아직 트리거랩 시절 얼굴입니다.",
    },
    c27_start_warm: {
      place: "KD캐피탈 본사 12층 · 위험관리부",
      clock: "5월 4일 월요일 · 새벽 06:50",
      question: "평택에서 본 멈춘 크레인이 군산의 줄이 되었습니다. 그 줄 앞에 누구와 서겠습니까?",
      lead: "평택 현장에서 돌아온 뒤에도 당신은 점퍼를 한 번도 빨지 않았습니다.",
    },
    c27_start_record: {
      place: "KD캐피탈 본사 12층 · 위험관리부",
      clock: "5월 4일 월요일 · 새벽 06:50",
      question: "당신이 정리한 표가 소문의 근거로 쓰였습니다. 그 사실을 어떻게 하겠습니까?",
      lead: "반재욱이 보낸 캡처를 확대하자, 당신이 직접 맞춘 표의 칸 간격이 보입니다.",
    },
    c27_start_rush: {
      place: "KD캐피탈 본사 12층 · 위험관리부",
      clock: "5월 4일 월요일 · 새벽 06:50",
      question: "금요일 밤 칸막이 너머의 알림 소리가 떠오릅니다. 그 기억을 어디에 쓰겠습니까?",
      lead: "금요일 밤 늦게까지 남아 있던 그 자리에, 월요일 새벽 가장 먼저 앉았습니다.",
    },
    c27_queue: {
      place: "군산 새봄신협 · 객장",
      clock: "5월 4일 월요일 · 09:00",
      question: "금고의 현금은 오후 두 시면 바닥나고 줄은 300명을 넘었습니다. 이 줄을 어떻게 맞겠습니까?",
      lead: "세 시간을 달려 닿은 군산 시내 골목, 3층짜리 새봄신협 건물을 사람들이 한 바퀴 감고 서 있습니다.",
    },
    c27_savings: {
      place: "군산 새봄신협 · 3번 창구",
      clock: "5월 4일 월요일 · 14:10",
      question: "보호받는 적금을 두 달 남기고 깨려는 할머니가 울고 있습니다. 어떻게 하겠습니까?",
    },
    c27_savings_reaction: {
      place: "군산 새봄신협 · 셔터 내린 객장",
      clock: "5월 4일 월요일 · 21:00",
      question: "1998년에 이불을 깔고 객장을 지킨 사람의 딸이 오늘 밤 혼자 남으려 합니다. 어떻게 하겠습니까?",
    },
    c27_rumor: {
      place: "군산 새봄신협 · 전무실",
      clock: "5월 5일 어린이날 · 휴무",
      question: "소문의 캡처가 당신 회사의 사내 메신저 화면과 똑같습니다. 이 사실을 어떻게 쓰겠습니까?",
      lead: "어린이날이라 객장은 닫혔고, 전무실 창밖으로 옆 교회 마당의 풍선이 보입니다.",
    },
    c27_branch_vault: {
      place: "군산 새봄신협 · 지하 금고",
      clock: "5월 5일 어린이날 · 23:40",
      question: "문을 열면 한 시간 만에 바닥날 현금을 세고 있습니다. 수송차가 올 때까지 어떻게 버티겠습니까?",
    },
    c27_branch_vault_follow: {
      place: "군산 새봄신협 · 객장 앞 골목",
      clock: "5월 6일 수요일 · 10:02",
      question: "줄 선 사람들 앞으로 들어간 돈 상자가 실은 빌린 돈입니다. 그 사실을 언제 말하겠습니까?",
    },
    c27_returns: {
      place: "군산 새봄신협 · 객장",
      clock: "5월 6일 수요일 · 12:30",
      question: "돈을 도로 들고 온 사람들이 생겼지만 나가는 돈이 아직 세 배입니다. 돌아온 사람들을 어떻게 맞겠습니까?",
    },
    c27_returns_reaction: {
      place: "군산 새봄신협 · 주차장",
      clock: "5월 6일 수요일 · 19:00",
      question: "같은 소문이 1년 새 세 조합을 거쳐 같은 회사로 이어졌습니다. 이 패턴을 어떻게 하겠습니까?",
    },
    c27_offer: {
      place: "군산 새봄신협 · 2층 면담실",
      clock: "5월 7일 목요일 · 07:10",
      question: "소문이 퍼진 지 엿새 만에 평택 몫을 38%에 사겠다는 제안이 왔습니다. 무엇이라 하겠습니까?",
      lead: "이틀째 객장에서 잔 남궁솔이 메일 알림 소리에 벌떡 일어납니다.",
    },
    c27_carnation: {
      place: "군산 새봄신협 · 객장 탁자",
      clock: "5월 7일 목요일 · 22:00",
      question: "내일 어르신들 가슴에 카네이션과 한도 안내를 함께 달아야 할지 모릅니다. 오늘 밤을 어디에 쓰겠습니까?",
    },
    c27_carnation_reaction: {
      place: "군산 새봄신협 · 셔터 앞",
      clock: "5월 7일 목요일 · 23:00",
      question: "해지한 적금 통장을 든 할머니가 되살릴 수 있냐고 묻습니다. 어떻게 답하겠습니까?",
    },
    c27_route_system: {
      place: "KD캐피탈 본사 12층 · 위험관리부 단말",
      clock: "5월 5일 어린이날 · 새벽 01:20",
      question: "작은 조합의 뱅크런은 대개 가격표로 끝났습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c27_final_system_route: {
      place: "군산 새봄신협 · 전무실 원격 단말",
      clock: "5월 8일 어버이날 · 새벽 05:10",
      question: "소문과 헐값 매각 사이의 고리를 끊을 수 있다면, 무엇을 끊겠습니까?",
    },
    c27_evidence_turn: {
      place: "군산 새봄신협 · 전무실 자료실",
      clock: "5월 8일 어버이날 · 06:00",
      question: "소문보다 나흘 먼저 새봄신협의 값이 매겨져 있었습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c27_final: {
      place: "군산 새봄신협 · 3층 이사회실",
      clock: "5월 8일 어버이날 · 07:30",
      question: "그룹 돈, 전면 공개, 인출 한도 가운데 하나로 오늘 하루를 버텨야 합니다. 어떻게 하겠습니까?",
      lead: "창밖 줄의 어르신들 가슴마다 종이 카네이션이 달려 있고, 그중 몇 송이는 모서리가 직각입니다.",
    },
    c27_aftershock: {
      place: "군산 새봄신협 · 셔터 내린 골목",
      clock: "5월 8일 어버이날 · 16:00",
      question: "줄은 끝났고 짬뽕이 식어 가는데 다음 자리의 소식이 왔습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c27-rumor-price",
    title: "소문보다 먼저 쓰인 가격",
    text: "새봄신협을 무너뜨린 캡처는 KD캐피탈 부동산금융팀 사람들이 들어 있는 사내 대화방에서 나왔고, 그보다 나흘 먼저 새봄신협의 평택 몫을 38%에 사들이는 정리안이 쓰여 있었습니다. 승인자 칸은 비어 있었습니다.",
  },
  outcomes: {
    c27_after_warm: { tag: "끝까지 맞은 결말", title: "돌아오는 사람들을 마지막 한 명까지 맞았다", text: "군산에 하루 더 남아 다시 통장을 만드는 사람들을 맞았습니다. 토요일 아침 곽 사장이 박대 한 상자를 들고 왔습니다." },
    c27_after_record: { tag: "기록으로 남긴 결말", title: "소문이 어떻게 값이 되었는지 문서가 생겼다", text: "대화방 기록과 정리안을 묶은 소문 피해 보고서가 남았습니다. 첫 장에는 하정희 할머니의 해지 날짜가 적혔습니다." },
    c27_after_rush: { tag: "먼저 올라간 결말", title: "캡처를 들고 부동산금융팀으로 먼저 갔다", text: "당신은 짬뽕이 식기 전에 서울행 버스를 탔습니다. 불 꺼진 12층에 닿았을 때 그 대화방은 이미 지워져 있었습니다." },
  },
  carryovers: {
    c27_after_warm: { trust: 10, humanCost: -5, fatigue: -7 },
    c27_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c27_after_rush: { capital: 7, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c26_after_warm: { id: "protect-trust", title: "평택처럼 군산에서도 곁에 남기", text: "평택에서 당신은 사람들 곁에 남았습니다. 군산의 줄 앞에서도 혼자가 아니라 함께 서는 선택을 찾아야 보너스가 열립니다." },
    c26_after_record: { id: "use-reframe", title: "소문의 재료가 된 숫자 되찾기", text: "평택에서 문서로 남긴 숫자가 군산에서는 소문의 재료가 됐습니다. 같은 숫자를 사람을 지키는 쪽으로 다시 짜야 합니다." },
    c26_after_rush: { id: "repair-legitimacy", title: "먼저 돌아온 금요일 밤의 공정함 회복하기", text: "먼저 본사로 돌아온 그 밤, 칸막이 너머에서 소문이 만들어졌습니다. 그 밤을 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
