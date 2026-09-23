/**
 * CASE 23 -- the shareholders' meeting, where the people the season moved around
 * get to vote on the man who moved them.
 *
 * For twenty-two cases 윤상혁 has decided who sits where. In March the group puts
 * him up as a 사내이사 at its annual general meeting, and the case turns the
 * season's chain around: the victims' group, the night shift, the cooperative
 * factory and the readers of 리드라인 each bought a single share in February,
 * before the record date that decides who may vote. 3,118 people, 0.0008% of the company. The case is a
 * proxy tour -- a 영동 branch full of pensioners who sign because the branch
 * manager asked, a rice-cake shop where 문가을 refuses to delegate her vote ever
 * again, a night-shift break room at half past two -- and then one morning in a
 * hall whose front six rows were filled by employees before the doors opened.
 *
 * The weight of a single share is not its size. It is a microphone for one
 * minute and a body in the back row, and the case argues over what to spend
 * both on. 표세린, an analyst at the proxy adviser whose recommendation moves the
 * foreign institutions, takes evidence and never favours. 백아린, 윤상혁's right
 * hand since 사건 13, wrote the one-minute rule herself and has carried an
 * unsigned resignation for three months. The vote passes at 50.6% -- a year ago
 * the same kind of item took 97% -- and a reorganisation notice is already
 * scheduled for Monday, which is where 사건 24 begins.
 */
export const case23Nodes = {
  c23_start: {
    phase: "CASE 23 BRIEFING",
    title: "안건 제3호",
    speaker: "한서윤",
    text:
      "KD금융그룹이 정기 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의) 소집 통지서를 보냅니다. 3월 20일 금요일 오전 10시, 여의도 본사 대강당. 안건 제3호는 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 선임의 건입니다. 한서윤이 통지서를 펼쳐 후보자 경력란을 손가락으로 짚습니다. 여섯 줄인데 2023년이 통째로 없습니다. '지난달, 표를 던질 수 있는 주주를 정하는 2월 27일 전에 한 주씩 산 사람들 있죠. 김 반장이 시작했고, 피해자 모임, 야간조, 끝까지정밀, 리드라인 독자들이 따라 샀어요. 3,118명이에요.' 그가 계산기를 두드립니다. '다 합쳐도 전체 주식의 0.0008%예요. 그래도 한 주는 의결권(주주가 표를 던질 권리) 하나고, 발언 신청 한 번이에요.' 그가 달력에 동그라미를 칩니다. '남은 건 9일이에요.'",
    memo: [
      "소집 통지: 3월 20일(금) 10시 · 본사 대강당",
      "안건 제3호: 사내이사 윤상혁 선임 -- 경력란에 2023년 없음",
      "1주 모임 3,118명 -- 전체 주식의 0.0008%",
      "외국인 주주 68% · 의결권 자문사 권고가 표를 가름",
    ],
    triggers: ["injustice", "trust", "competition"],
    choices: [
      {
        id: "c23_start_tour",
        label: "위임장을 받으러 3,118명을 한 사람씩 직접 찾아간다",
        effect: { trust: 11, humanCost: -5, time: -6, capital: -4, fatigue: 5 },
        next: "c23_proxy",
        cognition: { persistence: 2 },
      },
      {
        id: "c23_start_notice",
        label: "후보자 경력란에서 통째로 빠진 2023년부터 따진다",
        effect: { legitimacy: 11, time: -4, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c23_proxy",
        cognition: { inference: 2 },
      },
      {
        id: "c23_start_count",
        label: "표를 크게 쥔 기관투자자부터 셈하고 움직인다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: -4, humanCost: 3, fatigue: -2 },
        next: "c23_proxy",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c23_proxy",
      },
    ],
  },
  c23_proxy: {
    phase: "PROXY TOUR",
    title: "지점장님이 부탁하니까",
    speaker: "나준혁",
    text:
      "오후 세 시가 지난 영동지점 객장에 어르신 마흔한 분이 번호표 없이 앉아 있습니다. 2008년 은행이 금융그룹으로 바뀔 때 적금 대신 주식을 받아 여태 들고 있는 분들입니다. 나준혁이 믹스커피를 돌리고 위임장(주주총회에서 내 표를 다른 사람이 대신 던지도록 맡기는 서류)을 한 장씩 나눠 드립니다. 여든넷 서정란 할머니가 제일 먼저 도장을 찍습니다. '뭔지는 모르겠고, 지점장님이 부탁하니까.' 그다음 분도, 그다음 분도 같은 말을 합니다. 마흔한 장이 17분 만에 다 찹니다. 나준혁이 조끼 단추를 만지며 뿌듯하게 돌아보는데, 위임장 뭉치를 넘기던 권도현이 멈춥니다. '신분증 사본이 한 장도 없는데요. 이대로 내면 본사 사무국이 전부 무효로 칩니다.'",
    memo: [
      "영동 어르신 41명 · 보유 주식 합계 63,000주",
      "1주 모임 전체의 약 20배",
      "위임장 41장 -- 신분증 사본 0장",
      "서정란(84): '지점장님이 부탁하니까'",
    ],
    triggers: ["trust", "affection", "order"],
    choices: [
      {
        id: "c23_proxy_visit",
        label: "사본을 받으러 어르신 댁을 한 집씩 다시 돈다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -4, fatigue: 6 },
        next: "c23_advisor",
        cognition: { persistence: 2 },
      },
      {
        id: "c23_proxy_explain",
        label: "안건을 처음부터 설명하고 이해한 분의 위임장만 받는다",
        effect: { legitimacy: 12, trust: 2, time: -4, humanCost: 3, fatigue: 4 },
        next: "c23_advisor",
        cognition: { reframing: 2 },
      },
      {
        id: "c23_proxy_fast",
        label: "지점 복사기로 오늘 안에 사본을 한꺼번에 받는다",
        effect: { time: 6, capital: 5, legitimacy: -7, trust: -2, humanCost: 2, fatigue: -3 },
        next: "c23_advisor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c23_advisor",
      },
    ],
  },
  c23_advisor: {
    phase: "THE ADVISER",
    title: "셋째 자리까지",
    speaker: "표세린",
    text:
      "의결권 자문사(큰 투자 기관들에게 안건마다 찬성·반대를 권고하는 회사) 클리어보트의 회의실에는 화분도 액자도 없습니다. 애널리스트 표세린이 노트북을 돌려 화면을 보여 줍니다. 그룹이 보낸 자료 48쪽, 제목은 '윤상혁 후보의 혁신 성과'입니다. '반대 권고를 내 달라는 부탁은 안 받습니다. 근거를 주세요. 권고는 제가 씁니다.' 보고서 마감은 내일 아침 9시. 외국인 기관투자자(연기금·운용사처럼 큰돈을 모아 투자하는 곳)의 상당수가 이 권고를 보고 표를 정합니다. 따라온 권도현이 그의 엑셀 시트를 들여다보다 불쑥 말합니다. '소수점 둘째 자리까지 맞추시네요.' 표세린이 처음으로 고개를 듭니다. '셋째 자리까지요.' 둘이 동시에 안경을 고쳐 씁니다.",
    memo: [
      "클리어보트 권고 마감: 내일 09:00",
      "그룹 측 자료 48쪽 -- 2023년 언급 0회",
      "외국인 주주 68% 중 약 3분의 1이 권고를 따름",
      "표세린: '부탁은 안 받습니다. 근거를 주세요'",
    ],
    triggers: ["order", "competition", "system"],
    choices: [
      {
        id: "c23_advisor_voices",
        label: "1주 주주들의 진술을 모아 오늘 밤 안에 가져온다",
        effect: { trust: 12, legitimacy: 3, humanCost: -4, time: -6, capital: -3, fatigue: 7 },
        next: "c23_backstage",
        cognition: { persistence: 2 },
      },
      {
        id: "c23_advisor_docs",
        label: "반대 의견 원본과 혁신위원회 예산 문서를 근거로 낸다",
        effect: { legitimacy: 13, trust: 2, time: -4, humanCost: 4, fatigue: 4 },
        next: "c23_backstage",
        cognition: { inference: 2 },
      },
      {
        id: "c23_advisor_gap",
        label: "그룹 자료 48쪽의 빈 연도만 짚고 빠르게 나온다",
        effect: { time: 6, capital: 4, legitimacy: 4, trust: -3, humanCost: 3, fatigue: -3 },
        next: "c23_backstage",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c23_backstage",
      },
    ],
  },
  c23_backstage: {
    phase: "BACKSTAGE",
    title: "서명 없는 사표",
    speaker: "백아린",
    text:
      "대기실 테이블 위에 두 가지가 놓여 있습니다. 하나는 오늘 주주총회 진행 시나리오 98쪽, 다른 하나는 A4 한 장짜리 사표 초안입니다. 날짜는 작년 12월이고, 서명란은 비어 있습니다. 늘 80%로 충전돼 있던 그의 태블릿이 오늘은 11%입니다. 백아린이 시나리오 14쪽을 펼칩니다. '반대 발언이 길어질 경우 의장은 1인 1분으로 제한한다. 제가 쓴 문장이에요. 혁신위원회 광고 대본도 제가 썼고요. 좋은 이야기는 사실보다 오래 간다고 믿었어요.' 그가 사표 초안을 당신 쪽으로 밀어 놓습니다. 접힌 자리가 하얗게 닳아 있습니다. '석 달째 못 냈어요. 내면 제 이야기가 여기서 끝나거든요. 안 내면 오늘 10시에 제가 쓴 문장이 당신 입을 막고요.'",
    memo: [
      "주주총회 시나리오 98쪽 -- 작성: 백아린",
      "14쪽: '반대 발언 1인 1분 제한'",
      "사표 초안: 작년 12월 날짜, 서명 없음",
      "개회까지 80분",
    ],
    triggers: ["selfAwareness", "trust", "manipulation"],
    choices: [
      {
        id: "c23_backstage_stay",
        label: "사표 대신 남아서 14쪽의 그 문장을 지워 달라고 부탁한다",
        effect: { trust: 11, legitimacy: 3, humanCost: -4, time: -4, capital: -3, fatigue: 6 },
        next: "c23_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c23_backstage_script",
        label: "시나리오 원본을 넘겨받아 발언 제한의 근거로 남긴다",
        effect: { legitimacy: 12, trust: -2, time: -3, humanCost: 5, fatigue: 3 },
        next: "c23_final",
        cognition: { inference: 2 },
      },
      {
        id: "c23_backstage_go",
        label: "흔들릴 시간이 없다며 사표는 두고 먼저 대강당으로 간다",
        effect: { time: 6, capital: 4, legitimacy: 2, trust: -4, humanCost: 3, fatigue: -4 },
        next: "c23_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c23_final",
      },
    ],
  },
  c23_final: {
    phase: "FINAL DECISION",
    title: "1분",
    speaker: "윤상혁",
    text:
      "안건 제3호가 올라오자 의장이 마이크를 당깁니다. '발언 신청이 많아 1인 1분으로 제한하겠습니다.' 앞 여섯 줄에서 약속한 듯 박수가 나옵니다. 그런데 돌아보면 강당 뒷줄이 끝까지 차 있습니다. 재킷 아래로 앞치마 끈이 보이는 문가을, 새벽 버스로 온 영동 어르신들, 눈이 빨간 야간조 여든 명, 스케치북을 든 문하준. 서 있는 사람이 앉은 사람보다 많습니다. 미리 들어온 표로는 찬성 53%입니다. 이름이 불리기 직전 백아린이 쪽지를 건넵니다. 그룹이 지배구조(회사가 누구의 결정으로 움직이고 누가 감시하는지의 짜임) 개혁안, 모든 대출 서명란에 실명을 남기는 '서명란 실명제'를 받겠답니다. 조건은 오늘 발언을 접는 것. 후보석의 윤상혁이 서류철을 덮고, 단상 옆 타이머가 1:00에서 줄기 시작합니다.",
    memo: [
      "발언 시간: 1인 1분",
      "미리 들어온 표 기준 찬성 53%",
      "1주 주주 약 2,400명 입장 -- 뒷줄 입석 포함",
      "이 선택은 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "trust"],
    choices: [
      {
        id: "c23_final_block",
        label: "1분 동안 반대표를 호소해 선임을 막으려 한다",
        effect: { trust: 10, legitimacy: 5, capital: -8, time: -5, humanCost: -3, fatigue: 7 },
        next: "case23_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c23_final_deal",
        label: "서명란 실명제를 조건으로 발언을 접고 협상한다",
        effect: { legitimacy: 13, trust: -2, capital: -5, time: -5, humanCost: 4, fatigue: 5 },
        next: "case23_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c23_final_record",
        label: "표 대신 1분의 발언을 한 글자도 빠짐없이 남기게 한다",
        effect: { legitimacy: 8, time: 5, capital: 4, trust: -3, humanCost: 5, fatigue: -3 },
        next: "case23_result",
        cognition: { inference: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case23_result",
      },
    ],
  },
};

/**
 * Everything else case 23 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case23 = {
  id: "case23",
  nodes: case23Nodes,
  aftermath: {
    c23_aftershock: {
      phase: "AFTERMATH",
      title: "50.6%",
      speaker: "표세린",
      text: "오후 1시 12분, 의장이 결과를 읽습니다. 안건 제3호 찬성 50.6%, 가결. 앞 여섯 줄에서 박수가 나오고 뒷줄은 조용합니다. 표세린이 휴대폰 화면을 내밉니다. 작년 같은 안건의 찬성률, 97.1%. '46.5포인트예요. 이 회사에서 이렇게 떨어진 적은 없어요.' 로비에서 문가을이 떡 상자를 열고, 강태민은 야간조를 한 명씩 버스에 태웁니다. 나준혁이 서정란 할머니에게 '다음엔 이유를 알고 찍으세요' 하자 할머니가 답합니다. '그럼 지점장님이 또 설명해 줘.' 그때 한서윤의 메시지가 옵니다. '월요일 8시 전 직원 공지가 예약돼 있어요. 제목은 조직 개편, 첫 줄이 트리거랩이에요.'",
      memo: ["안건 제3호 찬성 50.6% -- 가결", "작년 같은 안건 찬성률 97.1%", "1주 주주 버스 6대 -- 영동·인천·풀필먼트센터", "월요일 08:00 전 직원 공지 예약: '조직 개편'"],
      triggers: ["trust", "helplessness", "choice"],
      choices: [
        { id: "c23_after_warm", label: "마지막 버스가 떠날 때까지 1주 주주들을 배웅한다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case23_result", cognition: { reframing: 2 } },
        { id: "c23_after_record", label: "50.6%와 오늘의 발언을 주주 서한으로 남겨 이사회에 보낸다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case23_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c23_after_rush", label: "월요일 공지를 막으러 곧장 33층으로 올라간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case23_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c23_final", "c23_aftershock"],
  connectiveScenes: [
    ["c23_market", "c23_proxy", "c23_advisor", "은행 총각의 마흔두 장", "오진우", "망원시장 가을떡방 안쪽 평상에 피해자 모임 할머니 열두 분이 앉아 있습니다. 오진우가 위임장을 내밀 때마다 떡이 한 접시씩 나옵니다. '은행 총각, 이것도 먹고 해.' 영동이 41장이라는 나준혁의 문자를 받은 오진우가 떡 열한 개째를 삼키며 선언합니다. '망원은 42장입니다.' 그런데 문가을이 앞치마를 벗지 않은 채 위임장을 도로 밀어냅니다. '내 표는 내가 던질 거예요. 남한테 맡기는 거, 3년 전에 한 번 해 봤어요. 은행한테요.' 도장을 쥔 할머니들의 손이 위임장 위에서 멈춥니다.", ["망원 피해자 모임 할머니 12명 · 1주씩", "오진우 목표: 42장 -- 영동보다 한 장 더", "문가을: 위임 거부, 직접 참석 희망"], ["문가을이 주주총회장에서 직접 말하도록 내 발언 1분을 넘긴다", "직접 오기 힘든 할머니들께 위임장 쓰는 법을 한 분씩 다시 설명한다", "42장을 채우는 게 먼저라며 다른 분들 위임장부터 받는다"]],
    ["c23_nightshift", "c23_advisor", "c23_backstage", "80주의 교대", "강태민", "새벽 두 시 반, 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고) 야간조 대기실. 컵라면 여든 개의 뚜껑에 강태민이 매직으로 번호를 적어 두었습니다. 지난달, 야간조 80명이 컵라면 값을 한 달 아껴 한 주씩 샀습니다. 주주총회는 금요일 오전 10시이고 야간조는 6시에 끝납니다. 올해 처음 열린 전자투표(주주총회에 가지 않고 휴대폰으로 표를 던지는 방법)도 있습니다. 막내 유건이 묻습니다. '반장님, 우리 80주면 몇 퍼센트예요?' 강태민이 계산기를 두드리다 화면을 끕니다. '안 보여. 0이 너무 많아.' 대기실에 웃음이 터지고, 그 웃음이 조금 오래 갑니다.", ["야간조 80명 · 1인 1주", "근무 종료 06:00 → 주주총회 10:00", "80주 = 전체 주식의 0.00002%"], ["잠을 못 자더라도 여든 명이 다 같이 버스로 간다", "대표 세 명만 보내고 나머지는 전자투표로 표를 던진다", "야간조는 쉬게 하고 표는 강태민에게 모아 맡긴다"]],
    ["c23_lobby", "c23_backstage", "c23_final", "4분의 줄", "이민서", "9시 20분, 본사 로비. 1주 주주들의 줄이 회전문을 지나 여의도 대로 인도까지 이어져 있습니다. 주주 확인 창구는 두 개, 한 사람 확인에 4분이 걸립니다. 이 속도면 10시 전에 들어가는 사람은 스무 명입니다. 바로 옆 '직원 주주' 전용 입구는 줄 없이 열려 있고, 사원증을 건 계열사(같은 그룹에 속한 다른 회사) 직원 400명이 이미 강당 앞쪽 여섯 줄을 채웠습니다. 줄 맨 끝에서 번호표를 나눠 주던 이민서가 돌아봅니다. '3,118번까지 있어요. 영동 어르신들은 새벽 5시 버스로 오셨고요.'", ["주주 확인 창구 2개 · 1인 4분", "10시 전 입장 가능 인원: 약 20명", "직원 주주 전용 입구: 대기 0명, 앞 여섯 줄 착석"], ["줄 선 어르신들부터 로비 의자에 앉히고 차례를 지킨다", "확인 창구를 늘리기 전에는 개회할 수 없다고 공식 요청한다", "먼저 들어간 사람부터 뒷줄 자리를 채우게 한다"]],
  ],
  connectiveOrder: [["c23_proxy", "c23_market"], ["c23_advisor", "c23_nightshift"], ["c23_backstage", "c23_lobby"]],
  choiceEffects: {
    c23_proxy: [
      { trust: 12, legitimacy: 3, humanCost: -5, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 5, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c23_advisor: [
      { trust: 12, legitimacy: 4, capital: -5, humanCost: 3, time: -3, fatigue: 5 },
      { legitimacy: 8, humanCost: -4, trust: 4, time: -4, capital: -2, fatigue: 2 },
      { time: 5, capital: 4, humanCost: -2, trust: 3, legitimacy: -3, fatigue: -4 },
    ],
    c23_backstage: [
      { trust: 11, humanCost: -5, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 11, trust: 3, time: -5, humanCost: 4, fatigue: 4 },
      { time: 6, capital: 4, trust: -2, humanCost: 5, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c23_proxy: {
      voice: ["문가을이 주주총회장에서 직접 말하도록, 내 발언 1분을 넘긴다.", "직접 오기 힘든 할머니들께, 위임장 쓰는 법을 한 분씩 다시 설명한다.", "42장을 채우는 게 먼저라며, 다른 분들 위임장부터 받는다."],
      echo: ["1분을 넘기면 당신은 마이크 앞에 서지 않습니다. 문가을이 떡 써는 칼을 내려놓고 처음으로 '고마워요'라고 합니다.", "다시 설명하면 할머니 세 분이 위임장 대신 직접 가겠다고 합니다. 오진우의 42장은 39장이 됩니다.", "42장은 채워집니다. 문가을의 한 표는 그 뭉치 안에 없고, 할머니들은 도장을 찍으며 문가을 쪽을 보지 않습니다."],
    },
    c23_advisor: {
      voice: ["잠을 못 자더라도, 여든 명이 다 같이 버스로 간다.", "대표 세 명만 보내고, 나머지는 전자투표로 표를 던지게 한다.", "야간조는 쉬게 하고, 표는 강태민에게 모아 맡긴다."],
      echo: ["여든 명이 가면 뒷줄 한 칸이 형광 조끼로 찹니다. 금요일 밤 근무에서 두 명이 졸다가 반장에게 깨워집니다.", "세 명만 가면 여든 명은 잠을 잡니다. 휴대폰으로 던진 표는 강당 안 누구의 눈에도 보이지 않습니다.", "강태민이 여든 장의 위임장을 조끼 주머니에 넣습니다. 막내 유건은 조금 서운한 얼굴로 퇴근합니다."],
    },
    c23_backstage: {
      voice: ["줄 선 어르신들부터 로비 의자에 앉히고, 차례를 지킨다.", "확인 창구를 늘리기 전에는, 개회할 수 없다고 공식 요청한다.", "먼저 들어간 사람부터, 뒷줄 자리를 채우게 한다."],
      echo: ["의자에 앉은 서정란 할머니가 지팡이를 무릎에 올려놓습니다. 줄은 그대로 느립니다.", "요청은 의사진행 기록에 남습니다. 사무국이 창구를 여섯 개로 늘리고, 개회가 40분 늦어집니다.", "들어간 사람들이 뒷줄에 가방을 놓아 자리를 맡습니다. 새벽 버스를 탄 어르신들은 아직 회전문 밖에 있습니다."],
    },
  },
  reactionScenes: [
    ["c23_market_reaction", "c23_market", "c23_advisor", "알아서 해 드릴게요", "문가을", "평상 위 떡 접시가 식을 무렵 문가을이 입을 엽니다. '남편 회사가 쓰러지기 두 달 전에 은행 창구에서 종이 한 장에 도장을 찍었어요. 직원이 저희가 알아서 처리해 드릴게요, 그러더래요. 그 종이 제목이 위임장이었어요.' 그 서류로 공장에 담보가 하나 더 잡혔습니다. 할머니들이 조용해지고, 오진우는 들고 있던 떡을 접시에 내려놓습니다. 문가을이 도장을 앞치마 주머니에 넣습니다. '그래서 이번엔 내가 가서, 내 입으로 말할 거예요.'", ["그 위임장 이야기를 주주총회 발언의 첫 문장으로 쓰자고 한다", "그때의 위임장이 어떻게 쓰였는지 서류부터 찾아 드린다", "오늘은 그 이야기를 묻어 두고 표 이야기만 한다"]],
    ["c23_nightshift_reaction", "c23_nightshift", "c23_backstage", "11초 연설", "강태민", "대기실 한쪽에서 강태민이 종이 한 장을 들고 일어섭니다. 주주 발언을 연습하겠답니다. '플로우온 야간조 강태민입니다. 3년 전 그 회사가 무너질 때 새벽에 상자를 옮기던 사람입니다. 그 대출 서명란이 왜 비었는지, 오늘은 누가 말해 줍니까.' 끝입니다. 위임장 투어 내내 따라다닌 권도현이 스톱워치를 멈춥니다. '11.4초. 효율이 아주 좋습니다.' 강태민이 종이를 접습니다. '1분 주면 48초 남잖아요. 그건 유건이 쓰라고.' 막내의 얼굴이 새빨개지고, 여든 명이 컵라면 뚜껑을 두드리며 박수를 칩니다.", ["강태민의 11초를 그대로 쓰고 남는 48초는 막내 유건에게 준다", "11초 연설에 날짜와 대출 번호를 넣어 기록에 남게 다듬는다", "발언은 내가 맡고 야간조는 뒷줄에서 박수만 쳐 달라고 한다"]],
    ["c23_lobby_reaction", "c23_lobby", "c23_final", "세지 않는 표", "윤상혁", "엘리베이터 문이 열리고 윤상혁이 내립니다. 장식 하나 없는 감색 정장입니다. 그는 로비를 가로지르다 당신 앞에서 멈추고, 인도까지 이어진 줄을 한 번 봅니다. '3,118주. 자네가 모은 표는 나도 세어 봤네. 사흘 전에.' 그가 소매 끝을 한 번 당깁니다. '그런데 내 표는 내가 세지 않아. 표는 원래 세어 주는 사람들이 따로 있지.' 그의 뒤로 사무국 직원들이 투표용지 상자를 밀고 지나갑니다. '들어오게. 자리는 있을 걸세. 뒷줄에.'", ["줄 선 사람들 앞에서 표를 세어 주는 사람이 누구냐고 되묻는다", "투표용지 상자에 개표 참관인을 붙이겠다고 요청한다", "대꾸할 시간에 한 사람이라도 더 들여보내러 간다"]],
  ],
  reactionEffects: {
    c23_market: [
      { trust: 10, legitimacy: 4, humanCost: 3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 4, capital: -5, time: -4, fatigue: 4 },
      { time: 5, capital: 3, trust: -2, humanCost: 3, fatigue: -3 },
    ],
    c23_nightshift: [
      { trust: 11, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -4, capital: -2, fatigue: 3 },
      { time: 4, capital: 3, legitimacy: 2, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c23_lobby: [
      { trust: 10, legitimacy: -3, humanCost: -3, time: -3, fatigue: 5 },
      { legitimacy: 11, trust: 4, capital: -5, time: -4, fatigue: 4 },
      { time: 5, capital: 3, trust: 3, legitimacy: -6, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c23_market: {
      voice: ["그 위임장 이야기를, 주주총회 발언의 첫 문장으로 쓰자고 한다.", "그때의 위임장이 어떻게 쓰였는지, 서류부터 찾아 드리겠다고 한다.", "오늘은 그 이야기를 묻어 두고, 표 이야기만 한다."],
      echo: ["첫 문장이 되면 그 이야기는 강당 전체가 듣습니다. 문가을은 연습하다 두 번 목이 멥니다.", "서류를 찾으면 담보를 권한 직원의 이름이 나옵니다. 그 사람은 지금 강서지점 부지점장입니다.", "이야기는 평상 위에 남습니다. 문가을은 고개를 끄덕이고, 떡을 한 번 더 썹니다."],
    },
    c23_nightshift: {
      voice: ["강태민의 11초를 그대로 쓰고, 남는 48초는 막내 유건에게 준다.", "11초 연설에 날짜와 대출 번호를 넣어, 기록에 남게 다듬는다.", "발언은 내가 맡고, 야간조는 뒷줄에서 박수만 쳐 달라고 한다."],
      echo: ["유건이 48초 원고를 쓰느라 이틀 밤을 샙니다. 첫 줄은 '저는 막내입니다'입니다.", "날짜와 번호가 들어가면 연설은 19초가 됩니다. 강태민은 '길어졌네' 하고 투덜대며 외웁니다.", "강태민은 '그러죠' 하고 종이를 주머니에 넣습니다. 그 종이는 금요일에도 주머니 밖으로 나오지 않습니다."],
    },
    c23_lobby: {
      voice: ["줄 선 사람들 앞에서, 표를 세어 주는 사람이 누구냐고 되묻는다.", "투표용지 상자에, 개표 참관인을 붙이겠다고 요청한다.", "대꾸할 시간에, 한 사람이라도 더 들여보내러 간다."],
      echo: ["되묻는 소리에 줄 선 사람들이 고개를 듭니다. 윤상혁은 웃고, 대답 대신 엘리베이터 쪽으로 손짓을 합니다.", "참관인 요청은 받아들여집니다. 이민서와 권도현이 개표석 옆 접이식 의자에 앉습니다.", "당신이 돌아서면 윤상혁도 돌아섭니다. 그 사이 회전문으로 할머니 네 분이 더 들어옵니다."],
    },
  },
  reactionMemos: {
    c23_market_reaction: ["'알아서 해 드릴게요'라는 위임장", "이번엔 내 입으로"],
    c23_nightshift_reaction: ["11.4초짜리 연설", "남는 48초의 주인"],
    c23_lobby_reaction: ["사흘 전에 세어 본 3,118주", "표를 세어 주는 사람들"],
  },
  branchPlan: ["c23_advisor", 1, "c23_branch_newsroom", "c23_branch_newsroom_follow"],
  branchScenes: {
    // CASE 23's detour is the newsroom. The case counts votes; the side door is
    // the place that made 1,996 readers into shareholders, and the question of
    // where reporting stops and organising begins.
    c23_branch_newsroom: {
      phase: "SIDE DOOR",
      title: "독자 1,996명",
      speaker: "서하린",
      text: "망원동 리드라인 편집국 소파 위에 위임장 1,996장이 우편 봉투째 쌓여 있고, 그 위에 명예 기자증을 목에 건 고양이 '정정'이 자리를 잡았습니다. 누가 봉투를 빼려 하면 앞발로 지그시 누릅니다. 서하린이 웃다가 출력물 한 장을 내밉니다. KD금융그룹 법무팀의 공문입니다. '언론사가 독자를 주주로 모아 표를 몰아주는 것은 보도의 공정성을 해치는 행위'라는 문장에 밑줄이 그어져 있습니다. '틀린 말은 아니에요. 우리가 기사를 썼고, 독자가 주식을 샀어요. 그 사이에 선을 어디에 그을지 오늘 정해야 해요.'",
      memo: ["리드라인 독자 위임장 1,996장", "그룹 법무팀 공문: '보도의 공정성 훼손'", "정정: 봉투 더미 위에서 비키지 않음", "다음 기사 마감: 주주총회 이틀 전"],
      triggers: ["trust", "order", "manipulation"],
      choices: [
        { id: "c23_branch_newsroom_a", label: "독자들이 직접 주주총회에 오도록 편집국이 버스를 댄다", effect: { trust: 12, legitimacy: -3, capital: -7, time: -4, fatigue: 5 }, next: "c23_branch_newsroom_follow", cognition: { reframing: 2 } },
        { id: "c23_branch_newsroom_b", label: "위임장은 독자에게 돌려주고 보도와 표를 분리한다", effect: { legitimacy: 12, trust: 3, time: -4, humanCost: 3, fatigue: 4 }, next: "c23_branch_newsroom_follow", cognition: { inference: 2 } },
        { id: "c23_branch_newsroom_c", label: "공문은 무시하고 위임장을 그대로 모아 낸다", effect: { capital: 6, time: 6, legitimacy: -7, trust: 3, humanCost: 3, fatigue: -3 }, next: "c23_branch_newsroom_follow", cognition: { risk: 1 } },
      ],
    },
    c23_branch_newsroom_follow: {
      phase: "SIDE DOOR",
      title: "빨간 점 열일곱 개",
      speaker: "서하린",
      text: "봉투 더미를 정리하던 서하린이 한 통을 따로 빼 둡니다. 보낸 사람 칸이 비어 있고, 안에는 위임장 대신 쪽지와 캡처 한 장이 들어 있습니다. 'KD은행 영업점 직원입니다. 저는 한 주가 아니라 1,200주를 가진 직원 주주입니다. 지점마다 위임장 제출 현황표가 돕니다. 안 낸 사람 이름 옆에는 빨간 점이 찍힙니다.' 캡처 속 표에는 이름 대신 사번이 있고, 빨간 점이 열일곱 개입니다. 정정이 다른 봉투에는 다 올라앉으면서 그 쪽지 위에만은 올라가지 않습니다. 서하린이 말합니다. '이건 기사예요. 그런데 이 사람은 사번으로 찾을 수 있어요.'",
      memo: ["익명 제보: 직원 주주, 1,200주 보유", "지점별 위임장 제출 현황표 캡처", "미제출자 표시: 빨간 점 17개", "캡처에 사번이 그대로 보임"],
      triggers: ["protection", "injustice", "fear"],
      choices: [
        { id: "c23_branch_newsroom_follow_a", label: "제보자를 먼저 지키고 사번을 지운 뒤에 기사를 쓴다", effect: { trust: 12, humanCost: -5, time: -5, capital: -3, fatigue: 5 }, next: "c23_nightshift", cognition: { persistence: 2 } },
        { id: "c23_branch_newsroom_follow_b", label: "현황표를 금융감독원에 먼저 알리고 기사는 뒤로 미룬다", effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 3, fatigue: 4 }, next: "c23_nightshift", cognition: { inference: 2 } },
        { id: "c23_branch_newsroom_follow_c", label: "주주총회 전에 캡처를 그대로 실어 기사를 내보낸다", effect: { capital: 5, time: 6, legitimacy: 4, trust: -7, humanCost: 6, fatigue: -3 }, next: "c23_nightshift", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c23_start",
    result: "c23_aftershock",
    defaultFree: "c23_route_system",
    // One meeting, one item. Like 사건 12 the case is a single line; the split is
    // what a single share is spent on -- the vote, the deal, or the record.
    choices: {},
    system: {
      route: "c23_route_system",
      final: "c23_final_system_route",
      title: "96.4%",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD금융그룹의 지난 10년 주주총회 의사록(회의에서 오간 말과 결과를 적은 공식 기록)을 엽니다. 안건 312건, 부결 0건, 평균 찬성률 96.4%. 사내이사 후보 스물여섯 명의 안건 설명서 어디에도 후보가 반대 의견을 어떻게 처리했는지는 적혀 있지 않습니다. 10년 동안 소액주주(주식을 조금 가진 개인 주주)가 한 발언은 모두 합쳐 1시간 52분이었고, 의사록에는 해마다 '기타 의견 있었음' 한 줄로 남았습니다. '주주의 표는 세어집니다. 주주의 말은 세어지지 않도록 설계되어 있습니다.'",
      memo: ["지난 10년 안건 312건 -- 부결 0건", "평균 찬성률 96.4%", "소액주주 발언 1시간 52분 → 의사록 한 줄"],
      routeChoices: [
        ["c23_route_system_send", "10년 치 통계를 의결권 자문사와 기관들에 보낸다", { legitimacy: 11, trust: 5, capital: -5, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c23_route_system_minutes", "올해 의사록에는 발언 전문을 남기라고 주주 서한을 낸다", { legitimacy: 8, trust: 4, capital: -3, time: -5, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c23_route_system_drop", "통계는 넣어 두고 표 모으기에 집중한다", { time: 7, capital: 6, trust: -5, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "후보 추천서에 반대 의견 처리 이력을 적게 하는 규정을 제안한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "올해는 표만 세고 규정은 내년 주주총회로 미룬다", { capital: 8, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "소액주주 발언을 모아 따로 공개 의사록을 만든다", { legitimacy: 8, trust: 9, capital: -6, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c23_evidence_turn",
    result: "c23_aftershock",
    sourceRoutes: ["c23_proxy", "c23_advisor", "c23_backstage", "c23_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 위임장 제출 현황표 옆에 놓고, 직원 주주의 표가 어떻게 걷혔는지 맞춰 본다.",
    entryEcho: "단서를 대면 그룹이 센 것이 표였는지 사람이었는지 보입니다.",
    title: "빨간 점의 주인",
    speaker: "반재욱",
    text: "단서를 맞추자 그룹 인사팀 공유 폴더의 파일 하나가 열립니다. '주주총회 위임장 제출 현황 -- 계열사 직원 주주 11,840명.' 낸 사람은 초록 점, 안 낸 사람은 빨간 점입니다. 비고란에 한 줄이 있습니다. '하반기 인사평가 협조도 항목 참고.' 위임장을 걷는 일은 외부 대행사 에이전다파트너스가 맡았고, 수수료 14억은 혁신위원회 예산 코드로 나갔습니다. 반재욱이 수첩을 덮습니다. '표를 센 게 아니군요. 사람을 셌어요. 누가 안 따랐는지를요.'",
    memo: ["직원 주주 11,840명 위임장 현황표", "비고: '하반기 인사평가 협조도 참고'", "대행사 수수료 14억 -- 혁신위원회 예산 코드"],
    triggers: ["injustice", "system", "fear"],
    entryEffect: { legitimacy: 6, trust: 3, time: -3, capital: -2, fatigue: 5 },
    choices: [
      ["c23_evidence_turn_disclose", "현황표를 주주총회장에서 공개하고 직원 표의 무효를 주장한다", { legitimacy: 12, trust: 4, capital: -6, time: -5, humanCost: 5, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c23_evidence_turn_protect", "빨간 점의 직원들부터 불이익이 없도록 먼저 연락한다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
      ["c23_evidence_turn_hold", "현황표는 주주총회 뒤에 쓸 카드로 남겨 둔다", { capital: 8, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c23_branch_newsroom",
    systemNext: "c23_route_system",
    evidenceNext: "c23_evidence_turn",
    routeLabel: "직전 사건의 끝까지정밀 소식을 실은 리드라인 편집국으로 위임장을 받으러 간다",
    systemLabel: "직전 자유응답 문장이 노아 도입 성과 자료에 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 직원 주주의 위임장 현황표를 연다",
  },
  openingRoutes: {
    c22_after_warm: "c23_start_warm",
    c22_after_record: "c23_start_record",
    c22_after_rush: "c23_start_rush",
  },
  openingCopy: {
    c23_start_warm: ["수료식 뒷줄의 한 주", "도윤하", "문하준의 인턴 수료식 날, 당신은 강서지점 객장에서 떡 상자가 빌 때까지 그 가족 곁에 남았습니다. 3주 뒤, 문가을네 떡집으로 봉투가 옵니다. KD금융그룹 정기 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의) 소집 통지서입니다. 그날 김 반장을 따라 산 한 주 덕분입니다. 안건 제3호는 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 선임. 도윤하가 문하준의 메시지를 보여 줍니다. 형광펜을 그은 통지서 사진 아래 한 줄이 있습니다. '이 한 주 의결권(주주가 표를 던질 권리)으로 뭘 할 수 있어요? 멘토님이 끝까지 가르쳐 준다면서요.'", ["문하준: 형광펜 그은 소집 통지서 사진", "안건 제3호: 사내이사 윤상혁 선임", "1주 모임 3,118명 -- 주주총회까지 9일"]],
    c23_start_record: ["이의서보다 빠른 달력", "에코", "하준의 인턴 보고서와 R-17 거절 사례 41건을 묶은 이의서는 접수 번호를 받았습니다. 처리 기한은 60일입니다. 그사이 KD금융그룹이 정기 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의) 소집 통지를 냅니다. 안건 제3호, 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 선임. 후보 추천 사유 첫 줄에는 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아를 들여와 대출 판단을 한결같게 만들었다는 공이 적혀 있습니다. 끝까지정밀을 자동 거절한 그 엔진이 한 사람의 경력이 되어 있습니다. 에코가 덧붙입니다. '이의서는 60일 뒤에 답을 받습니다. 의결권(주주가 표를 던질 권리)은 9일 뒤에 씁니다.'", ["R-17 이의서 -- 거절 사례 41건 · 처리 기한 60일", "후보 추천 사유 첫 줄: 노아 도입", "주주총회까지 9일"]],
    c23_start_rush: ["전화 한 통 없던 3주", "권도현", "수료식 박수가 끝나기도 전에 당신은 김 반장의 한 주를 시작으로 곧장 3월의 표결 준비에 들어갔습니다. 3주 동안 모은 건 KD금융그룹 주주 구성표 한 장입니다. 오늘 정기 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의) 소집 공고가 뜹니다. 안건 제3호, 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 선임. 권도현이 구성표 옆에 세로줄을 긋습니다. '외국인 68%, 국민연금 8%, 직원 5%, 그리고 한 주씩 산 3,118명. 이분들 의결권(주주가 표를 던질 권리)은 다 모아도 반올림하면 0입니다.' 그가 펜을 멈춥니다. '그런데 먼저 뛰느라, 그 3,118명한테 아직 전화 한 통 안 하셨죠.'", ["주주 구성표: 외국인 68% · 국민연금 8% · 직원 5%", "1주 모임 3,118명 -- 연락한 사람 0명", "주주총회까지 9일"]],
  },
  openingSignatures: {
    c23_start_warm: {
      label: "문하준과 문가을의 한 표부터 같이 쓰는 법을 정한다",
      effect: { trust: 10, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "문하준과 문가을의 한 표부터, 같이 쓰는 법을 정한다.",
      echo: "정하는 데 저녁 한 끼가 듭니다. 문하준이 스케치북에 '한 주 사용 설명서'를 그리고, 문가을은 그걸 떡집 벽에 붙입니다.",
    },
    c23_start_record: {
      label: "후보 추천 사유의 노아 문장에 공식 질의서를 보낸다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "후보 추천 사유의 노아 문장에, 공식 질의서를 보낸다.",
      echo: "질의서는 접수됩니다. 답변 기한은 주주총회 다음 날로 잡혀 있습니다.",
    },
    c23_start_rush: {
      label: "3,118명에게 늦은 전화부터 한 명씩 돌린다",
      effect: { trust: 12, humanCost: -3, capital: -3, time: -7, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "3,118명에게, 늦은 전화부터 한 명씩 돌린다.",
      echo: "첫 전화를 받은 사람은 문가을입니다. '3주 만이네요.' 그 말 한마디에 이틀 치 사과가 들어갑니다.",
    },
  },
  voiceLines: {
    // CASE 23. A shareholders' meeting. Every line is spoken by someone holding
    // one share, so none of them is allowed to sound like a proxy firm.
    c23_start_tour: "위임장을 받으러, 3,118명을 한 사람씩 직접 찾아간다.",
    c23_start_notice: "후보자 경력란에서, 통째로 빠진 2023년부터 따진다.",
    c23_start_count: "표를 크게 쥔, 기관투자자부터 셈하고 움직인다.",
    c23_proxy_visit: "신분증 사본을 받으러, 어르신 댁을 한 집씩 다시 돈다.",
    c23_proxy_explain: "안건을 처음부터 설명하고, 이해한 분의 위임장만 받는다.",
    c23_proxy_fast: "지점 복사기로, 오늘 안에 사본을 한꺼번에 받는다.",
    c23_advisor_voices: "1주 주주들의 진술을 모아, 오늘 밤 안에 가져온다.",
    c23_advisor_docs: "반대 의견 원본과, 혁신위원회 예산 문서를 근거로 낸다.",
    c23_advisor_gap: "그룹 자료 48쪽의 빈 연도만 짚고, 빠르게 나온다.",
    c23_branch_newsroom_a: "독자들이 직접 주주총회에 오도록, 편집국이 버스를 댄다.",
    c23_branch_newsroom_b: "위임장은 독자에게 돌려주고, 보도와 표를 분리한다.",
    c23_branch_newsroom_c: "공문은 무시하고, 위임장을 그대로 모아 낸다.",
    c23_branch_newsroom_follow_a: "제보자를 먼저 지키고, 사번을 지운 뒤에 기사를 쓴다.",
    c23_branch_newsroom_follow_b: "현황표를 금융감독원에 먼저 알리고, 기사는 뒤로 미룬다.",
    c23_branch_newsroom_follow_c: "주주총회 전에, 캡처를 그대로 실어 기사를 내보낸다.",
    c23_backstage_stay: "사표 대신 남아서, 14쪽의 그 문장을 지워 달라고 부탁한다.",
    c23_backstage_script: "시나리오 원본을 넘겨받아, 발언 제한의 근거로 남긴다.",
    c23_backstage_go: "흔들릴 시간이 없다며, 사표는 두고 먼저 대강당으로 간다.",
    c23_final_block: "남은 1분 동안, 반대표를 호소해 선임을 막으려 한다.",
    c23_final_deal: "서명란 실명제를 조건으로, 발언을 접고 협상한다.",
    c23_final_record: "표 대신, 1분의 발언을 한 글자도 빠짐없이 남기게 한다.",
    c23_after_warm: "마지막 버스가 떠날 때까지, 1주 주주들을 배웅한다.",
    c23_after_record: "50.6%와 오늘의 발언을, 주주 서한으로 남겨 이사회에 보낸다.",
    c23_after_rush: "월요일 공지를 막으러, 곧장 33층으로 올라간다.",
    c23_route_system_send: "10년 치 통계를, 의결권 자문사와 기관들에 보낸다.",
    c23_route_system_minutes: "올해 의사록에는 발언 전문을 남기라고, 주주 서한을 낸다.",
    c23_route_system_drop: "통계는 넣어 두고, 표 모으기에 집중한다.",
    c23_final_system_route_a: "후보 추천서에 반대 의견 처리 이력을 적게 하는, 규정을 제안한다.",
    c23_final_system_route_b: "올해는 표만 세고, 규정은 내년 주주총회로 미룬다.",
    c23_final_system_route_c: "소액주주 발언을 모아, 따로 공개 의사록을 만든다.",
    c23_evidence_turn_disclose: "현황표를 주주총회장에서 공개하고, 직원 표의 무효를 주장한다.",
    c23_evidence_turn_protect: "빨간 점의 직원들부터, 불이익이 없도록 먼저 연락한다.",
    c23_evidence_turn_hold: "현황표는, 주주총회 뒤에 쓸 카드로 남겨 둔다.",
  },
  echoReplies: {
    // CASE 23.
    c23_start_tour: "찾아가면 9일은 길 위에서 갑니다. 대신 3,118명 중 몇 명은 처음으로 그 한 주가 무엇인지 설명을 듣습니다.",
    c23_start_notice: "따지면 빈 연도가 공식 질문이 됩니다. 사무국의 답장은 '기재 의무 없음' 여섯 글자입니다.",
    c23_start_count: "셈은 빠르고 정확합니다. 그 셈 안에서 3,118명은 반올림되어 사라집니다.",
    c23_proxy_visit: "마흔한 집을 돌면 이틀이 갑니다. 집집마다 믹스커피가 나오고, 서정란 할머니는 사본과 함께 곶감을 싸 줍니다.",
    c23_proxy_explain: "설명을 듣고 아홉 분이 위임장을 거둬 갑니다. 윤상혁이 누군지 알고 나서 찬성하겠다는 분도 한 분 있습니다.",
    c23_proxy_fast: "마흔한 장이 한 시간 만에 찹니다. 고객 신분증이 지점 복사기를 거쳐 모임 가방으로 들어갔다는 사실도 함께 남습니다.",
    c23_advisor_voices: "밤새 진술 212건이 모입니다. 표세린은 그중 날짜와 서류가 붙은 38건만 각주에 넣습니다. 나머지는 읽고, 넣지 않습니다.",
    c23_advisor_docs: "문서는 강합니다. 원본의 반려란에는 한서윤의 서명이 있고, 그 이름도 보고서 부록에 함께 실립니다.",
    c23_advisor_gap: "빈 연도 하나로는 권고가 바뀌지 않습니다. 표세린은 '추가 확인 필요'라는 한 줄을 적고 노트북을 닫습니다.",
    c23_branch_newsroom_a: "버스가 서면 '언론사 동원'이라는 말도 함께 섭니다. 서하린은 버스비를 기자들이 나눠 냅니다.",
    c23_branch_newsroom_b: "돌려준 1,996장 중 몇 장이 다시 돌아올지는 모릅니다. 대신 공문은 근거를 잃습니다.",
    c23_branch_newsroom_c: "표는 온전히 들어갑니다. 다음 날 그룹 보도자료에 '특정 언론의 주주 동원'이라는 문장이 실립니다.",
    c23_branch_newsroom_follow_a: "사번을 지우는 데 하루가 듭니다. 기사는 주주총회 전날 밤에 나가고, 제보자는 무사합니다.",
    c23_branch_newsroom_follow_b: "감독원은 접수 번호를 줍니다. 주주총회는 그 번호보다 먼저 열립니다.",
    c23_branch_newsroom_follow_c: "기사는 빠르게 퍼집니다. 인사팀은 기사보다 빠르게 사번을 대조합니다.",
    c23_backstage_stay: "백아린이 한참 시나리오를 봅니다. 14쪽을 뜯지는 않고, 볼펜으로 한 줄을 긋습니다. 의장이 그 줄을 건너뛸지는 모릅니다.",
    c23_backstage_script: "원본은 증거가 됩니다. 작성자 칸의 이름도 함께 증거가 됩니다. 백아린은 그걸 알고 넘깁니다.",
    c23_backstage_go: "문이 닫힐 때 백아린은 사표 초안을 다시 접습니다. 석 달째 접힌 자리가 조금 더 닳습니다.",
    c23_final_block: "1분은 짧습니다. 뒷줄이 일어서서 박수를 치고, 의장은 그 박수까지 발언 시간에 넣습니다.",
    c23_final_deal: "협상하면 개혁안이 다음 이사회 안건이 됩니다. 뒷줄의 2,400명은 당신이 마이크 앞에서 돌아서는 모습을 봅니다.",
    c23_final_record: "기록은 남습니다. 표는 그대로 흘러가고, 오늘을 바꿀 수도 있었던 한마디는 내년 서류철로 들어갑니다.",
    c23_after_warm: "버스 여섯 대의 창문마다 손이 흔들립니다. 월요일 공지는 그사이에도 예약된 시간을 기다립니다.",
    c23_after_record: "서한은 이사회 안건 서류에 별첨으로 붙습니다. 이제 50.6%를 모르는 이사는 없습니다.",
    c23_after_rush: "33층 엘리베이터 앞에서 보안요원이 명단을 확인합니다. 당신의 이름 옆에는 벌써 빨간 점이 있습니다.",
    c23_route_system_send: "통계는 표세린의 보고서 부록이 됩니다. 부록까지 읽는 기관은 셋 중 하나입니다.",
    c23_route_system_minutes: "서한이 접수되면 사무국은 녹음기를 한 대 더 준비합니다. 발언 시간은 그대로입니다.",
    c23_route_system_drop: "표는 조금 더 모입니다. 10년 동안 한 줄로 남은 말들은 올해도 한 줄로 남을 준비를 합니다.",
    c23_final_system_route_a: "규정이 생기면 내년 후보부터 자기 반대 의견 처리 이력을 적어야 합니다. 올해 후보는 그 규정 밖에 있습니다.",
    c23_final_system_route_b: "표는 세어지고 규정은 한 해를 기다립니다. 그 한 해 동안 서명란은 지금 모양 그대로입니다.",
    c23_final_system_route_c: "공개 의사록은 1주 주주들이 직접 받아 적습니다. 공식 기록은 아니지만, 누구나 읽을 수 있습니다.",
    c23_evidence_turn_disclose: "공개하면 앞 여섯 줄이 술렁입니다. 빨간 점의 주인들도 그 자리에서 자기 사번을 봅니다.",
    c23_evidence_turn_protect: "연락받은 열일곱 명 중 셋은 전화를 받지 않습니다. 받은 한 사람은 '제 점이 빨간 줄 몰랐어요'라고 합니다.",
    c23_evidence_turn_hold: "카드는 남습니다. 오늘 표를 던진 11,840명 중 누가 원해서 던졌는지는 끝내 모릅니다.",
  },
  characterProfiles: {
    표세린: {
      role: "의결권 자문사 클리어보트 애널리스트 · 7년차",
      stance: "근거 · 공정 · 거리",
      job: "기관투자자에게 안건마다 찬성과 반대를 권고한다. 누구의 편도 들지 않고, 근거가 있는 쪽의 문장을 쓴다.",
      appearance: "소매 끝을 한 번 접은 흰 셔츠, 화분 하나 없는 책상, 소수점 셋째 자리까지 맞춘 엑셀 시트.",
      thought: "부탁으로 쓴 권고는 다음 해에 아무도 믿지 않는다. 내가 파는 건 찬성도 반대도 아니고, 믿을 수 있다는 사실이다.",
      gesture: "표세린은 대답하기 전에 노트북 화면을 상대 쪽으로 돌린다. 자기 숫자를 먼저 보여 주고 나서 말한다.",
      voice: "감정이 실린 말은 받아 적지 않는다. 그 말에 근거가 붙으면 한 글자도 빼지 않는다.",
      line: "반대 권고를 내 달라는 부탁은 안 받습니다. 근거를 주세요. 권고는 제가 씁니다.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "3월 11일 · 주주총회까지 D-9" },
  sceneContext: {
    c23_start: {
      place: "트리거랩 4층 분석관실",
      clock: "3월 11일 · 주주총회까지 D-9",
      question: "9일 뒤 윤상혁을 사내이사로 올리는 표결이 열립니다. 무엇부터 하겠습니까?",
      lead: "문하준의 겨울 인턴십이 끝난 지 3주, 트리거랩 4층 우편함에 같은 모양의 두꺼운 봉투가 여섯 통 꽂혀 있습니다.",
    },
    c23_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "3월 11일 · 주주총회까지 D-9",
      question: "문하준이 한 주로 무엇을 할 수 있냐고 묻습니다. 어떻게 답하겠습니까?",
      lead: "수료식 떡 상자가 빌 때까지 객장에 함께 남은 뒤로, 문하준은 모르는 게 생기면 당신에게 먼저 묻습니다.",
    },
    c23_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "3월 11일 · 주주총회까지 D-9",
      question: "끝까지정밀을 거절한 엔진이 후보의 추천 사유가 됐습니다. 이 문장을 어떻게 하겠습니까?",
      lead: "R-17 이의서 접수증을 서랍에 넣은 지 3주, 그 서랍 위에 두꺼운 봉투가 하나 올라옵니다.",
    },
    c23_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "3월 11일 · 주주총회까지 D-9",
      question: "먼저 달려온 3주 동안 3,118명에게 전화 한 통 하지 않았습니다. 무엇부터 메우겠습니까?",
      lead: "3주 동안 쉬지 않고 모은 주주 구성표가 책상 위에 펼쳐져 있습니다. 전화기는 조용합니다.",
    },
    c23_proxy: {
      place: "KD은행 강원 영동지점 · 객장",
      clock: "3월 13일 · 주주총회까지 D-7 · 15:20",
      question: "'지점장님이 부탁하니까' 찍은 위임장 마흔한 장에 신분증 사본이 없습니다. 어떻게 하겠습니까?",
      lead: "표를 모으러 다니는 길의 첫 정류장은 서울에서 240km 떨어진 강원 영동지점입니다. 나준혁은 전화로 '어르신들 모셔 놨어요'라고만 했습니다.",
    },
    c23_market: {
      place: "망원시장 가을떡방 · 안쪽 평상",
      clock: "3월 14일 · 주주총회까지 D-6 · 11시",
      question: "문가을이 자기 표는 다시는 남에게 맡기지 않겠다고 합니다. 어떻게 하겠습니까?",
    },
    c23_market_reaction: {
      place: "망원시장 가을떡방 · 가게 앞",
      clock: "3월 14일 · 주주총회까지 D-6 · 13시",
      question: "3년 전 '알아서 해 드린다'던 위임장이 공장에 담보를 하나 더 얹었습니다. 그 이야기를 어떻게 하겠습니까?",
    },
    c23_advisor: {
      place: "여의도 클리어보트 · 회의실",
      clock: "3월 16일 · 권고 보고서 마감 전날",
      question: "표세린은 부탁이 아니라 근거를 달라고 합니다. 내일 아침까지 무엇을 건네겠습니까?",
      lead: "영동과 망원에서 받은 위임장 뭉치를 가방에 넣은 채, 여의도 뒷골목의 작은 사무실 문을 두드립니다.",
    },
    c23_branch_newsroom: {
      place: "망원동 리드라인 편집국",
      clock: "3월 16일 · 주주총회까지 D-4 · 21시",
      question: "그룹이 언론사의 주주 동원이라며 공문을 보냈습니다. 보도와 표 사이에 선을 어디에 긋겠습니까?",
    },
    c23_branch_newsroom_follow: {
      place: "망원동 리드라인 편집국 · 소파",
      clock: "3월 16일 · 23:40",
      question: "위임장을 안 낸 직원 옆에 빨간 점이 찍힌 현황표가 왔습니다. 사번이 보이는 이 제보를 어떻게 하겠습니까?",
    },
    c23_nightshift: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "3월 18일 · 새벽 02:30",
      question: "금요일에 가면 야간조 여든 명은 잠을 못 잡니다. 이 80주를 어떻게 쓰겠습니까?",
    },
    c23_nightshift_reaction: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "3월 18일 · 새벽 02:50",
      question: "강태민의 발언은 11초이고 48초가 남습니다. 남은 시간을 어떻게 하겠습니까?",
    },
    c23_backstage: {
      place: "여의도 KD금융그룹 본사 · 대강당 대기실",
      clock: "3월 20일 · 주주총회 당일 · 08:40",
      question: "1분 제한을 쓴 사람이 서명 없는 사표를 내밉니다. 개회 80분 전, 어떻게 하겠습니까?",
      lead: "주주총회 당일 아침, 발언 신청서를 내러 갔더니 사무국 직원이 대강당 뒤편 대기실로 안내합니다. 기다리던 사람은 백아린입니다.",
    },
    c23_lobby: {
      place: "여의도 KD금융그룹 본사 · 로비",
      clock: "3월 20일 · 주주총회 당일 · 09:20",
      question: "직원 입구는 비어 있고 1주 주주의 줄은 인도까지 이어졌습니다. 개회 전에 어떻게 하겠습니까?",
    },
    c23_lobby_reaction: {
      place: "여의도 KD금융그룹 본사 · 로비 엘리베이터 앞",
      clock: "3월 20일 · 주주총회 당일 · 09:35",
      question: "윤상혁이 자기 표는 세어 주는 사람이 따로 있다고 말합니다. 무엇이라 답하겠습니까?",
    },
    c23_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "3월 12일 · 주주총회까지 D-8",
      question: "10년 동안 소액주주의 말은 의사록 한 줄로 남았습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c23_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "3월 19일 · 주주총회 전날 · 새벽",
      question: "후보를 추천하는 서류에 한 줄을 더 적게 할 수 있다면, 무엇을 적게 하겠습니까?",
    },
    c23_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 인사 자료실",
      clock: "3월 20일 · 주주총회 당일 · 06시",
      question: "직원 주주의 위임장이 인사평가 협조도와 함께 걷혔습니다. 이 현황표를 어떻게 쓰겠습니까?",
    },
    c23_final: {
      place: "여의도 KD금융그룹 본사 · 대강당 주주총회장",
      clock: "3월 20일 · 안건 제3호 상정 · 11:05",
      question: "타이머는 1분이고, 그룹은 서명란 실명제를 내밀며 침묵을 요구합니다. 어떻게 하겠습니까?",
      lead: "개회는 40분 늦게 시작됐습니다. 그사이 로비의 줄이 한 사람씩 대강당 뒷문으로 들어왔습니다.",
    },
    c23_aftershock: {
      place: "여의도 KD금융그룹 본사 · 로비",
      clock: "3월 20일 · 개표 직후 · 13:12",
      question: "찬성 50.6%로 가결됐고 월요일 아침 조직 개편 공지가 예약됐습니다. 이 오후를 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c23-proxy-ledger",
    title: "빨간 점의 명단",
    text: "직원 주주 11,840명의 위임장은 '인사평가 협조도 참고'라는 비고와 함께 걷혔습니다. 대행사 수수료 14억은 혁신위원회 예산 코드로 나갔습니다.",
  },
  outcomes: {
    c23_after_warm: { tag: "배웅한 결말", title: "마지막 버스의 창문마다 손이 흔들렸다", text: "가결 50.6%. 당신은 영동행 새벽 버스가 떠날 때까지 로비 앞에 서 있었습니다. 서정란 할머니는 내년에도 부탁해 달라고 했습니다." },
    c23_after_record: { tag: "기록으로 남긴 결말", title: "50.6%가 이사회 서류의 별첨이 됐다", text: "오늘의 발언과 찬성률이 주주 서한이 되어 이사회로 갔습니다. 97%에서 50.6%로 내려온 숫자는 이제 공식 기록입니다." },
    c23_after_rush: { tag: "먼저 올라간 결말", title: "버스가 떠나기 전에 33층 엘리베이터를 탔다", text: "당신은 떡 상자와 버스 행렬을 두고 월요일 공지를 막으러 올라갔습니다. 33층 명단에는 이미 당신 이름 옆에 빨간 점이 있었습니다." },
  },
  carryovers: {
    c23_after_warm: { trust: 9, humanCost: -5, fatigue: -7 },
    c23_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c23_after_rush: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c22_after_warm: { id: "protect-trust", title: "끝까지 곁에 있던 사람들과 같이 가기", text: "수료식 떡 상자가 빌 때까지 곁에 남은 당신에게 문하준이 먼저 묻습니다. 한 주를 가진 사람들 곁에 서는 선택을 찾아야 보너스가 열립니다." },
    c22_after_record: { id: "use-reframe", title: "후보 경력이 된 노아 다시 읽기", text: "끝까지정밀을 거절한 엔진이 윤상혁의 추천 사유가 됐습니다. 그 문장이 누구의 성과인지 판을 다시 짜야 합니다." },
    c22_after_rush: { id: "repair-legitimacy", title: "전화 한 통 없던 3주의 공정함 회복하기", text: "먼저 달려간 3주는 3,118명에게 아무것도 남기지 않았습니다. 그들의 표를 부탁할 자격을 되찾는 선택을 찾아야 합니다." },
  },
};
