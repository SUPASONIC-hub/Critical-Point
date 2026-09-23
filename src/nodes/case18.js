/**
 * CASE 18 -- 오진우's arc, and the last door of 3막.
 *
 * 오진우 came into the season as the rival: faster, colder, the son of a branch
 * manager who was pushed out for delaying one approval by one day. He learned
 * in this room that being late is not the same as being wrong, and the night
 * after the 국정감사 he sat at the same table as his father for the first time
 * in three years. Now, the week before Christmas, a rival bank offers him the
 * one thing that answers every wound at once: the youngest team lead in its
 * history, twice the salary, and a mandate to buy KD은행's bundle of bad loans
 * -- with full access to the files of the people who pushed his father out.
 *
 * The case is a scouting that turns out to be a transaction. 도하람, the
 * strategist who reads people better than spreadsheets, hands him the knife in
 * the open; the appendix 권도현 has to sign lists 612 people to be let go, the
 * first of them a side-dish factory whose owner banked with 오상철 for thirty
 * years; and on the hidden and evidence routes the offer itself proves to have
 * been written on KD's own 33rd floor, as clause 7 of the sale. The emotional
 * beats run on 오진우: the comedy of a year-end party in the pantry (a
 * calculator-shaped rice cake, a farewell speech that fails five times), the
 * anger of the appendix, the grief of a father who says "stand on the winning
 * side" because he knows what losing cost his customers, and the joy of a team
 * that lets him choose. It ends on 12월 31일 with a message from 임경수's
 * granddaughter, which is where 4막 begins.
 */
export const case18Nodes = {
  c18_start: {
    phase: "CASE 18 BRIEFING",
    title: "연봉 두 배",
    speaker: "오진우",
    text:
      "오진우가 출근하자마자 당신 책상에 흰 봉투를 내려놓습니다. 브릿지은행 전략본부의 채용 제안서입니다. 직책은 인수팀장. 서른넷에 팀장이면 그 은행 최연소이고, 연봉은 지금의 두 배입니다. 팀이 맡을 일은 한 줄입니다. KD은행이 연말에 내놓는 부실채권(돌려받기 어려워진 대출) 묶음 1,860억을 원금의 19%에 사들이는 것. 오진우가 펜을 모니터와 나란히 맞추며 말합니다. '이 묶음을 사면 KD 대출 서류를 전부 볼 수 있습니다. 3년 전 아버지를 밀어낸 사람들 서류까지요.' 그가 잠깐 멈춥니다. '아직 아무한테도 말 안 했어요. 당신이 처음입니다. 이기는 쪽이 어딘지는 제가 계산할 수 있어요. 맞는 쪽이 어딘지는 모르겠습니다.'",
    memo: [
      "브릿지은행 인수팀장 제안 -- 연봉 두 배, 최연소",
      "업무: KD은행 부실채권 묶음 1,860억 매입",
      "제시 가격: 원금의 19%",
      "답변 기한: 12월 28일 09시",
    ],
    triggers: ["competition", "recognition", "choice"],
    choices: [
      {
        id: "c18_start_listen",
        label: "봉투는 덮어 두고 오진우의 이야기부터 끝까지 듣는다",
        effect: { trust: 12, humanCost: -4, time: -6, capital: -3, fatigue: 5 },
        next: "c18_lounge",
        cognition: { persistence: 2 },
      },
      {
        id: "c18_start_terms",
        label: "제안서의 조건과 매각 묶음 목록부터 한 줄씩 확인한다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c18_lounge",
        cognition: { inference: 2 },
      },
      {
        id: "c18_start_knife",
        label: "이 자리가 KD를 칠 칼이 될 수 있는지부터 계산한다",
        effect: { capital: 9, time: 5, legitimacy: -6, trust: -4, humanCost: 3, fatigue: 1 },
        next: "c18_lounge",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c18_lounge",
      },
    ],
  },
  c18_lounge: {
    phase: "THE OFFER",
    title: "사람을 보는 사람",
    speaker: "도하람",
    text:
      "브릿지은행 본점 32층 라운지. 통유리 너머 정면에 KD금융그룹 본사가 보입니다. 도하람 전략본부장이 커피 세 잔을 직접 들고 옵니다. 한 잔은 권도현 몫인데, 권도현은 창가에 선 채 받지 않습니다. 도하람이 앉자마자 말합니다. '오진우 씨를 고른 건 빨라서가 아닙니다. 지는 걸 못 견뎌서죠. 그런 사람은 끝까지 갑니다.' 그가 태블릿을 돌립니다. 실사(사기 전에 장부와 서류를 샅샅이 확인하는 일) 권한 48시간, KD 대출 서류 1,214건 전체 열람. '칼은 드립니다. 어디를 벨지는 팀장이 정하세요.' 그리고 당신을 봅니다. '분석관님은 이 사람을 붙잡으러 오셨습니까, 보내러 오셨습니까?' 권도현이 창밖을 본 채 말합니다. '19%면 KD는 적자, 우리는 흑자입니다. 채무자 칸은… 아직 아무도 안 채웠습니다.'",
    memo: [
      "도하람: 브릿지은행 전략본부장, 권도현의 상사",
      "실사 권한 48시간 -- KD 대출 서류 1,214건",
      "19%에 사면 브릿지 예상 수익 2.1배",
      "계획서의 '채무자 처리 방안' 칸: 비어 있다고 함",
    ],
    triggers: ["competition", "recognition", "manipulation"],
    choices: [
      {
        id: "c18_lounge_ask",
        label: "연봉보다 오진우가 그 자리에서 지킬 사람을 먼저 묻는다",
        effect: { trust: 13, humanCost: -5, legitimacy: -1, time: -4, fatigue: 6 },
        next: "c18_party",
        cognition: { persistence: 2 },
      },
      {
        id: "c18_lounge_paper",
        label: "가격을 매긴 근거를 서면으로 달라고 한다",
        effect: { legitimacy: 12, trust: -4, time: -6, humanCost: 2, fatigue: 4 },
        next: "c18_party",
        cognition: { inference: 2 },
      },
      {
        id: "c18_lounge_blade",
        label: "그 칼로 KD의 어디를 벨 수 있는지 먼저 따져 본다",
        effect: { capital: 8, time: 5, trust: -3, legitimacy: -2, humanCost: 4, fatigue: -2 },
        next: "c18_party",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c18_party",
      },
    ],
  },
  c18_party: {
    phase: "YEAR-END PARTY",
    title: "마니또",
    speaker: "나준혁",
    text:
      "트리거랩 탕비실 송년회. 강태민이 컵라면 마흔 개로 트리를 쌓았고, 꼭대기 별은 이민서가 은박지로 접었습니다. 마니또(한 달 동안 몰래 챙겨 준 비밀 친구) 공개 시간, 나준혁이 영동에서 새벽 버스로 들고 온 상자를 권도현에게 내밉니다. 가을떡방에서 맞춘 계산기 모양 떡입니다. 버튼마다 깨가 박혀 있고, '=' 자리에는 팥으로 '흑자'라고 썼습니다. 권도현이 한참 보다가 말합니다. '이건 먹으면 적자입니다. 못 먹겠습니다.' 모두가 웃는 사이, 도윤하가 비상계단에서 오진우를 찾아냅니다. 휴대폰 메모장 제목은 '송별사', 혼자 하는 다섯 번째 연습입니다. '그동안 감사… 아니, 제가 감사할 분이… 아니.' 도윤하가 문을 잡은 채 서 있습니다. 오진우가 휴대폰을 내립니다. '아직 안 정했어요. 그냥, 혹시 몰라서요.'",
    memo: [
      "마니또 공개: 나준혁 → 권도현, 계산기 모양 떡",
      "컵라면 트리 40개 -- 강태민",
      "오진우 메모장 '송별사' -- 연습 5회, 전부 첫 문장에서 멈춤",
      "답변 기한까지 닷새",
    ],
    triggers: ["affection", "trust", "choice"],
    choices: [
      {
        id: "c18_party_wait",
        label: "재촉하지 않고 오진우가 스스로 말할 때까지 송년회를 지킨다",
        effect: { trust: 12, humanCost: -4, capital: -4, time: -5, fatigue: 5 },
        next: "c18_table",
        cognition: { persistence: 2 },
      },
      {
        id: "c18_party_share",
        label: "팀 전원에게 매각 계획서를 보여 주고 함께 판단하자고 한다",
        effect: { legitimacy: 11, trust: 5, time: -6, humanCost: 2, fatigue: 5 },
        next: "c18_table",
        cognition: { inference: 2 },
      },
      {
        id: "c18_party_push",
        label: "오늘 밤 안에 답을 정하라고 오진우를 재촉한다",
        effect: { capital: 8, time: 6, trust: -4, humanCost: 4, fatigue: 1 },
        next: "c18_table",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c18_table",
      },
    ],
  },
  c18_table: {
    phase: "FAMILY TABLE",
    title: "이기는 쪽",
    speaker: "오상철",
    text:
      "수원 오상철의 집 식탁. 어머니가 계란말이를 세 접시째 부치고, 거실 TV에서는 캐럴 특집이 소리 없이 흐릅니다. 오진우가 제안 이야기를 꺼내자 오상철이 젓가락을 내려놓습니다. 매각 묶음에 매탄지점 옛 고객들이 들어 있다는 말에도 그는 한동안 말이 없습니다. 그러다 입을 엽니다. '가라. 너는 이기는 쪽에 서라.' 오진우의 얼굴이 굳습니다. '아버지는 하루 늦추셨잖아요. 그게 옳았다고 하셨잖아요.' 오상철이 식은 국을 한 숟가락 뜹니다. '옳았지. 그래서 30년 고객들한테 명절 인사 한 번 못 가는 사람이 됐다. 옳은 사람이 지면, 그 사람 편이던 사람들까지 같이 진다.' 어머니가 계란말이 접시를 아들 앞으로 조용히 밉니다. 아무도 그 접시에 손을 대지 않습니다.",
    memo: [
      "매탄지점 옛 고객 64명이 매각 묶음에 포함",
      "오상철: 지점장 교체 뒤 옛 고객과 연락을 끊음",
      "어머니: 계란말이 세 접시째",
      "답변 기한까지 나흘",
    ],
    triggers: ["affection", "helplessness", "selfAwareness"],
    choices: [
      {
        id: "c18_table_stay",
        label: "두 사람이 끝까지 말하도록 식탁에 남아 대화를 거든다",
        effect: { trust: 13, humanCost: -5, time: -4, fatigue: 7 },
        next: "c18_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c18_table_list",
        label: "매각 묶음 속 옛 고객 명단을 오상철과 한 줄씩 짚어 본다",
        effect: { legitimacy: 10, trust: 4, time: -6, humanCost: 3, fatigue: 4 },
        next: "c18_final",
        cognition: { inference: 2 },
      },
      {
        id: "c18_table_win",
        label: "이기는 쪽에 서라는 말을 받아 가라고 오진우에게 권한다",
        effect: { capital: 9, time: 5, trust: 3, legitimacy: -5, humanCost: 3, fatigue: -2 },
        next: "c18_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c18_final",
      },
    ],
  },
  c18_final: {
    phase: "FINAL DECISION",
    title: "8시 21분",
    speaker: "오진우",
    text:
      "12월 28일 아침 8시 20분. 트리거랩 4층에 아무도 부르지 않았는데 모두 와 있습니다. 강태민은 야간조를 마치고 조끼 차림 그대로 왔고, 나준혁은 영동에서 첫차를 탔습니다. 오진우가 제안서와 고무줄로 묶은 명함 뭉치, 권도현의 손익계산서를 책상에 나란히 놓습니다. 부록 3의 612명, 소담찬방의 31명, 그리고 도하람이 건넨 칼. '가면 안에서 가격도 조건도 바꿀 수 있습니다. 안 가면 다음 팀장이 매탄지점이 어딘지도 모르고 이 묶음을 삽니다.' 그가 당신을 봅니다. '제가 빨랐던 건지 빠르게 만들어진 건지, 전에 물었죠. 이번엔 제가 정하고 싶어요. 그런데 당신 말을 먼저 듣고 싶습니다.' 벽시계가 8시 21분으로 넘어갑니다.",
    memo: [
      "서명 시각: 오늘 09시, 브릿지은행 32층",
      "매각 묶음 1,860억 · 인력 정리 대상 612명",
      "권도현 심사 의견서: 가격 칸 아직 비어 있음",
      "이 선택은 4막의 첫 사건으로 이어짐",
    ],
    triggers: ["choice", "affection", "competition"],
    choices: [
      {
        id: "c18_final_keep",
        label: "트리거랩이 네 자리라며 오진우를 붙잡는다",
        effect: { trust: 12, humanCost: -3, legitimacy: 3, capital: -9, time: -5, fatigue: 5 },
        next: "case18_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c18_final_terms",
        label: "보내되 채무자 보호 조항과 안팎에서 같이 싸울 약속을 조건으로 건다",
        effect: { legitimacy: 13, trust: 8, capital: -6, time: -8, humanCost: 3, fatigue: 6 },
        next: "case18_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c18_final_block",
        label: "오진우의 결정을 기다리지 않고 매각 자체를 막으러 간다",
        effect: { capital: 6, time: 4, humanCost: -5, trust: 2, legitimacy: 4, fatigue: 5 },
        next: "case18_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case18_result",
      },
    ],
  },
};

/**
 * Everything else case 18 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case18 = {
  id: "case18",
  nodes: case18Nodes,
  aftermath: {
    c18_aftershock: {
      phase: "AFTERMATH",
      title: "여섯 번째 송별사",
      speaker: "오진우",
      text: "12월 31일 저녁, 탕비실의 컵라면 트리가 절반쯤 줄었습니다. 오진우가 휴대폰 메모장을 열고 일어섭니다. 여섯 번째입니다. 이번에는 첫 문장에서 멈추지 않습니다. '저는 늘 늦을까 봐 무서웠습니다. 이 방에서 처음으로, 늦어도 틀린 게 아니라는 걸 배웠습니다. 어느 책상에 앉든 그건 안 잊겠습니다.' 강태민이 제일 먼저 박수를 치고, 권도현은 '송별사인지 신년사인지 분류가 안 됩니다'라고 투덜대며 계산기 떡의 마지막 조각을 먹습니다. 그때 당신 휴대폰에 모르는 번호로 문자가 옵니다. '임경수 할아버지 손녀예요. 할아버지가 폐렴으로 입원하셨어요. 헌책방 건물에 철거 예고문이 붙었대요.'",
      memo: ["오진우 송별사 6번째 -- 처음으로 끝까지", "컵라면 트리 남은 개수 19개", "권도현: 계산기 떡 끝내 다 먹음", "임경수 폐렴 입원 · 헌책방 철거 예고"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c18_after_warm", label: "오늘은 탕비실 불을 끌 때까지 오진우와 함께 남는다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case18_result", cognition: { reframing: 2 } },
        { id: "c18_after_record", label: "매각 묶음의 채무자 보호 기준을 문서로 남겨 둔다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case18_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c18_after_rush", label: "문자를 받자마자 곧장 회기동 헌책방으로 간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case18_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c18_final", "c18_aftershock"],
  connectiveScenes: [
    ["c18_appendix", "c18_lounge", "c18_party", "부록 3", "권도현", "라운지를 나오는 엘리베이터에서 권도현이 출력물 한 장을 내밉니다. 계획서 부록 3, '채무자 처리 방안'. 비어 있다던 그 칸이 누군가의 초안으로 빼곡히 채워져 있습니다. 채무 기업 43곳, 인력 정리 대상 612명. 1순위는 수원의 반찬 공장 '소담찬방', 직원 31명입니다. 권도현이 층수 버튼만 보며 말합니다. '제가 쓴 거 아닙니다. 그런데 제 이름으로 올라갑니다. 가격을 매기는 심사역이 저니까요.' 엘리베이터가 1층에 닿기 직전, 그가 한마디를 더 합니다. '소담찬방 대표 이름 보셨습니까. 송미란. 오진우 씨 아버님 지점의 30년 고객입니다.'", ["부록 3: 채무 기업 43곳 · 인력 정리 대상 612명", "1순위: 소담찬방(수원), 직원 31명", "심사 의견서 서명자: 권도현"], ["부록을 오진우에게 오늘 바로 보여 준다", "부록의 초안 작성자가 누구인지부터 확인한다", "부록은 모른 척하고 제안서 본문만 본다"]],
    ["c18_ledger", "c18_party", "c18_table", "칸 하나", "권도현", "오진우의 마니또는 권도현이었습니다. 선물은 포장지 대신 클리어 파일에 든 A4 한 장, '오진우 이직 손익계산서'. 왼쪽 얻는 것 칸에는 연봉 차액 8,400만 원, 팀장 직함, KD 서류 열람권이 모서리까지 맞춰 적혀 있습니다. 오른쪽 잃는 것 칸에는 '출퇴근 12분 증가' 한 줄뿐이고, 그 아래가 비어 있습니다. 권도현이 헛기침을 합니다. '그 아래는 제가 못 채웠습니다. 한 달 동안 몰래 관찰했는데 계산이 안 됩니다.' 오진우가 종이를 들여다보다 웃음을 터뜨립니다. 그러다 웃음이 천천히 멎습니다.", ["얻는 것: 연봉 차액 8,400만 원 외 2항목", "잃는 것: 출퇴근 12분 -- 나머지 빈칸", "권도현: '한 달 관찰, 계산 불가'"], ["빈칸에 트리거랩 동료들의 이름을 적어 준다", "빈칸은 오진우가 직접 채워야 한다며 펜을 건넨다", "빈칸은 비워 둔 채 파일을 돌려준다"]],
    ["c18_snow", "c18_table", "c18_final", "명절 인사", "오상철", "대문을 나서자 12월 눈발이 굵어집니다. 버스 정류장까지 걷는데 오상철이 슬리퍼 차림으로 따라 나옵니다. 손에 노란 고무줄로 묶은 명함 뭉치가 들려 있습니다. 매탄지점 30년 동안 받은 고객 명함 수백 장, 맨 위는 소담찬방 송미란입니다. '이기는 쪽에 서라고 한 건, 네가 그 사람들을 사는 쪽이면 적어도 살살은 다룰 수 있어서다.' 그가 명함 뭉치를 아들 손에 쥐여 줍니다. '지는 쪽에 서면, 나처럼 아무것도 못 해 준다.' 정류장 전광판에 버스 도착 2분 전이 뜹니다. 오진우는 명함을 코트 안주머니에 넣지 못하고 손에 든 채 서 있습니다.", ["명함 뭉치: 매탄지점 30년 고객", "맨 위: 소담찬방 송미란", "오상철: '살살은 다룰 수 있어서다'"], ["버스를 한 대 보내고 정류장에서 오상철의 말을 끝까지 듣는다", "명함 속 고객들에게 매각 사실을 알릴 방법부터 정리한다", "명함 뭉치를 오진우에게 맡기고 먼저 버스에 오른다"]],
  ],
  connectiveOrder: [["c18_lounge", "c18_appendix"], ["c18_party", "c18_ledger"], ["c18_table", "c18_snow"]],
  choiceEffects: {
    c18_lounge: [
      { trust: 11, legitimacy: 4, humanCost: -5, time: -5, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 2, fatigue: 4 },
      { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c18_party: [
      { trust: 11, legitimacy: 2, humanCost: -5, capital: -3, time: -4, fatigue: 4 },
      { legitimacy: 6, trust: 5, time: -3, humanCost: 2, fatigue: 2 },
      { time: 5, capital: 4, trust: -3, humanCost: 4, fatigue: -4 },
    ],
    c18_table: [
      { trust: 10, humanCost: -5, legitimacy: 2, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: 4, humanCost: -3, capital: -5, time: -4, fatigue: 5 },
      { time: 5, capital: 4, trust: -4, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c18_lounge: {
      voice: ["부록을, 오진우에게 오늘 바로 보여 준다.", "부록의 초안 작성자가 누구인지부터, 확인하겠다고 한다.", "부록은 모른 척하고, 제안서 본문만 본다."],
      echo: ["보여 주면 오진우는 송미란이라는 이름에서 한참 멈춥니다. 그리고 제안서를 서랍에 넣지 않고 책상 위에 펼쳐 둡니다.", "확인하면 초안 파일의 작성자 칸에 KD금융그룹 그룹전략실 계정이 찍혀 있습니다. 파는 쪽이 사는 쪽의 부록을 썼습니다.", "본문만 보면 제안은 깔끔합니다. 612명은 부록 3에 그대로 남습니다."],
    },
    c18_party: {
      voice: ["빈칸에, 트리거랩 동료들의 이름을 적어 준다.", "빈칸은 오진우가 직접 채워야 한다며, 펜을 건넨다.", "빈칸은 비워 둔 채, 파일을 돌려준다."],
      echo: ["이름을 적으면 칸이 모자랍니다. 권도현이 '이래서 계산이 안 된 겁니다'라고 말합니다.", "펜을 받은 오진우는 한참 쓰지 못합니다. 그러다 칸 맨 위에 '아버지'라고 적고, 그 줄에는 세로줄을 긋지 않습니다.", "돌려준 파일은 오진우의 가방에 들어갑니다. 빈칸은 그가 혼자 있을 때 다시 열립니다."],
    },
    c18_table: {
      voice: ["버스를 한 대 보내고, 정류장에서 오상철의 말을 끝까지 듣는다.", "명함 속 고객들에게 매각 사실을 알릴 방법부터, 정리한다.", "명함 뭉치를 오진우에게 맡기고, 먼저 버스에 오른다."],
      echo: ["버스를 보내면 눈이 오상철의 어깨에 쌓입니다. 그는 3년 동안 아무에게도 안 한 이야기를 슬리퍼를 신은 채 합니다.", "알릴 방법을 정리하면 명함 뭉치가 연락처 목록이 됩니다. 송미란의 번호는 3년 전 그대로입니다.", "먼저 오르면 창밖으로 부자가 눈 속에 서 있는 게 보입니다. 두 사람 중 누구도 먼저 들어가지 않습니다."],
    },
  },
  reactionScenes: [
    ["c18_appendix_reaction", "c18_appendix", "c18_party", "제가 쓴 시험", "도하람", "로비 회전문 앞에서 도하람이 당신을 따라잡습니다. 권도현이 무엇을 보여 줬는지 이미 아는 얼굴입니다. '그 부록, 보여 주세요. 오진우 씨한테요.' 그가 장갑을 끼며 말합니다. '612명을 보고도 오겠다면 그 사람은 이 일을 할 수 있는 사람입니다. 보고 안 오겠다면, 좋은 사람을 하나 알게 된 거고요. 저는 어느 쪽이든 손해를 안 봅니다.' 회전문이 한 바퀴 돕니다. '분석관님이 숨기면, 그건 분석관님이 그 사람을 못 믿는다는 뜻이겠죠.'", ["부록은 내가 아니라 권도현이 직접 설명하게 한다", "도하람의 말을 그대로 오진우에게 전한다", "시험이든 뭐든 부록은 당분간 덮어 둔다"]],
    ["c18_ledger_reaction", "c18_ledger", "c18_table", "딱 한 번", "나준혁", "송년회가 끝나 갈 무렵, 나준혁이 믹스커피 두 잔을 들고 비상계단으로 오진우를 따라 나옵니다. '나도 30년 동안 딴 은행에서 딱 한 번 불렀어요. 연봉 1.5배. 그때 우리 집사람이 뭐랬는지 알아요? 당신 도장 세 개는 누가 들고 가냐고.' 오진우가 웃습니다. 나준혁도 웃다가 커피를 내려다봅니다. '안 갔어요. 그리고 거기 남아서 보고서를 세 번 반려했죠. 남는다고 다 잘하는 거 아니에요. 가는 게 도망도 아니고.' 계단 아래에서 꼬마전구가 한 번 깜빡입니다.", ["계단에 같이 앉아 두 사람 이야기를 끝까지 듣는다", "남는 사람과 가는 사람이 할 일을 나눠 적어 보자고 한다", "두 사람만 남기고 조용히 탕비실로 돌아간다"]],
    ["c18_snow_reaction", "c18_snow", "c18_final", "가격표의 이름", "권도현", "밤 11시, 서울로 가는 버스 안에서 권도현의 전화를 받습니다. '도 본부장님이 서명을 12월 28일 아침 9시로 못 박았습니다. 오진우 씨가 오든 안 오든 그날 가격이 확정됩니다.' 수화기 너머로 계산기 두드리는 소리가 들립니다. '그 가격표에 제 이름이 들어갑니다. 19%로 쓰면 우리는 흑자, KD는 적자, 소담찬방은 법원에 넘어갑니다. 23%로 쓰면 저는 이 은행에서 제일 비싼 심사역이 되고요.' 그가 짧게 웃습니다. '살면서 제 이름값을 계산해 본 건 처음입니다. 이 가격이면 적자입니다. 제 쪽이요.'", ["23%를 쓸 근거를 권도현과 밤새 같이 만든다", "가격은 권도현의 판단에 맡기고 기록만 남기라고 한다", "19% 그대로 쓰고 다음 싸움에 이름을 아끼라고 한다"]],
  ],
  reactionEffects: {
    c18_appendix: [
      { trust: 10, legitimacy: 3, humanCost: -4, time: -3, fatigue: 4 },
      { legitimacy: 7, trust: 3, capital: -4, time: -2, fatigue: 2 },
      { time: 4, capital: 3, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c18_ledger: [
      { trust: 10, humanCost: -5, time: -3, fatigue: 4 },
      { legitimacy: 7, trust: 4, capital: -4, time: -3, fatigue: 3 },
      { time: 4, capital: 3, trust: -2, humanCost: 2, fatigue: -3 },
    ],
    c18_snow: [
      { trust: 10, humanCost: -5, capital: -5, time: -3, fatigue: 6 },
      { legitimacy: 9, trust: 3, time: -4, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 6, trust: -3, legitimacy: -3, humanCost: 4, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c18_appendix: {
      voice: ["부록은 내가 아니라, 권도현이 직접 설명하게 한다.", "도하람의 말을, 그대로 오진우에게 전한다.", "시험이든 뭐든, 부록은 당분간 덮어 둔다."],
      echo: ["권도현이 설명하면 그는 자기 이름이 들어갈 칸부터 짚습니다. 오진우는 처음으로 권도현의 계산서를 끝까지 봅니다.", "그대로 전하면 오진우가 웃습니다. '시험이면 시험이라고 말해 주는 사람이네요. 그게 더 무섭습니다.'", "덮어 두면 송년회는 조용히 시작됩니다. 부록 3은 권도현의 가방 안에서 하루를 더 기다립니다."],
    },
    c18_ledger: {
      voice: ["계단에 같이 앉아, 두 사람 이야기를 끝까지 듣는다.", "남는 사람과 가는 사람이 할 일을, 나눠 적어 보자고 한다.", "두 사람만 남기고, 조용히 탕비실로 돌아간다."],
      echo: ["끝까지 들으면 커피가 식습니다. 나준혁은 식은 믹스커피를 원래 좋아한다고 우깁니다.", "나눠 적으면 표가 하나 생깁니다. 오진우는 '가는 사람' 칸의 할 일이 생각보다 많다는 걸 봅니다.", "돌아가면 계단에는 두 사람만 남습니다. 나준혁의 이야기가 아내의 두 번째 말까지 이어졌다고, 나중에 도윤하가 전합니다."],
    },
    c18_snow: {
      voice: ["23%를 쓸 근거를, 권도현과 밤새 같이 만든다.", "가격은 권도현의 판단에 맡기고, 기록만 남기라고 한다.", "19% 그대로 쓰고, 다음 싸움에 이름을 아끼라고 한다."],
      echo: ["밤새 만들면 근거가 생깁니다. 새벽 4시, 권도현이 '소담찬방 직원 31명의 숙련도'라는 칸을 처음으로 만듭니다.", "맡기면 권도현은 혼자 정합니다. 그는 늘 혼자 정했고, 그 결과를 늘 혼자 계산서로 들고 다녔습니다.", "아끼라는 말에 권도현이 '알겠습니다'라고 합니다. 그 대답이 너무 빨라서 오히려 오래 남습니다."],
    },
  },
  reactionMemos: {
    c18_appendix_reaction: ["어느 쪽이든 손해 보지 않는 사람", "숨기면 못 믿는다는 뜻"],
    c18_ledger_reaction: ["30년 동안 딱 한 번 온 제안", "남는 것도 가는 것도 도망은 아님"],
    c18_snow_reaction: ["서명: 12월 28일 09시", "19%와 23% 사이의 이름값"],
  },
  branchPlan: ["c18_lounge", 2, "c18_branch_dataroom", "c18_branch_dataroom_follow"],
  branchScenes: {
    // CASE 18's detour is the knife itself. Whoever weighs the offer as a weapon
    // gets to hold it: 48 hours in the data room, and the one file 오진우 has
    // wanted to read for three years.
    c18_branch_dataroom: {
      phase: "SIDE DOOR",
      title: "일곱 글자",
      speaker: "오진우",
      text: "도하람이 준 임시 계정으로 실사 자료실 단말에 들어갑니다. 창문 없는 방, 모니터 네 대, 책상마다 '출력 금지' 스티커. 오진우가 검색창에 '매탄지점'을 칩니다. 3년 전 아버지가 승인을 하루 늦췄던 그 지점입니다. 파일 하나가 뜹니다. 지점장 교체 검토서, 작성자 기업금융전략팀장 윤상혁. 사유 칸에 손글씨로 한 줄이 있습니다. '본점 일정 비협조.' 오진우의 손이 마우스 위에서 멈춥니다. '이게 우리 아버지 30년의 사유예요. 일곱 글자.' 검토서 아래로, 같은 지점 옛 고객 64명의 대출이 이번 매각 묶음에 들어 있다는 목록이 이어집니다.",
      memo: ["임시 계정 -- 모든 열람이 기록됨", "지점장 교체 검토서: 작성자 윤상혁", "사유: '본점 일정 비협조'", "매탄지점 옛 고객 64명이 이번 묶음에 포함"],
      triggers: ["revenge", "injustice", "system"],
      choices: [
        { id: "c18_branch_dataroom_a", label: "오진우와 함께 아버지의 파일만 끝까지 읽는다", effect: { trust: 12, humanCost: -3, time: -5, capital: -4, fatigue: 5 }, next: "c18_branch_dataroom_follow", cognition: { persistence: 2 } },
        { id: "c18_branch_dataroom_b", label: "열람 사실을 기록에 남기고 파일은 닫는다", effect: { legitimacy: 11, trust: -3, time: -4, humanCost: 3, fatigue: 3 }, next: "c18_branch_dataroom_follow", cognition: { inference: 2 } },
        { id: "c18_branch_dataroom_c", label: "출력 금지를 무시하고 휴대폰으로 화면을 찍는다", effect: { capital: 7, time: 4, legitimacy: -6, humanCost: 4, fatigue: -3 }, next: "c18_branch_dataroom_follow", cognition: { risk: 2 } },
      ],
    },
    c18_branch_dataroom_follow: {
      phase: "SIDE DOOR",
      title: "칼의 주인",
      speaker: "도하람",
      text: "자료실 문을 나서자 복도 끝에 도하람이 서 있습니다. 손에는 열람 기록을 출력한 A4 한 장. '14시 07분, 매탄지점. 역시 거기부터 여셨네요.' 그가 종이를 반으로 접어 오진우의 재킷 주머니에 꽂습니다. '저는 이 기록을 아무에게도 보내지 않습니다. 대신 기억은 합니다. 입사하면 그 파일은 팀장님 겁니다. 안 오시면 다음 팀장 것이 되고요.' 오진우가 주머니를 누릅니다. 도하람이 돌아서다 덧붙입니다. '다음 팀장은 매탄지점이 어딘지도 모를 겁니다. 저는 그게 더 편하긴 해요.'",
      memo: ["열람 기록 원본: 도하람 보관", "입사 시 해당 파일 열람 권한 유지", "거절 시 다음 후보자에게 권한 이전", "다음 후보: 매탄지점과 무관한 외부 인사"],
      triggers: ["manipulation", "revenge", "choice"],
      choices: [
        { id: "c18_branch_dataroom_follow_a", label: "그 파일을 누가 갖든 오진우의 편에 서겠다고 말한다", effect: { trust: 12, legitimacy: 4, capital: -6, time: -5, fatigue: 5 }, next: "c18_appendix", cognition: { reframing: 2 } },
        { id: "c18_branch_dataroom_follow_b", label: "열람 기록 사본을 우리도 한 부 달라고 요구한다", effect: { legitimacy: 11, trust: 4, time: -6, humanCost: 3, fatigue: 4 }, next: "c18_appendix", cognition: { inference: 2 } },
        { id: "c18_branch_dataroom_follow_c", label: "기록은 도하람에게 두고 조용히 자리를 뜬다", effect: { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -3 }, next: "c18_appendix", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c18_start",
    result: "c18_aftershock",
    defaultFree: "c18_route_system",
    // One offer, one person. The case is a single line like 사건 12; the split
    // is what the team lets 오진우 decide for himself.
    choices: {},
    system: {
      route: "c18_route_system",
      final: "c18_final_system_route",
      title: "스카우트 파일",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 브릿지은행 제안서의 첨부 파일을 엽니다. 도하람의 '후보자 평가표'에 오진우는 '압박 상황 판단 속도 상위 3%, 경쟁 자극 시 집중도 1.8배'로 적혀 있습니다. 에코가 두 숫자에 밑줄을 긋습니다. '이 수치는 면접으로는 나오지 않습니다. 트리거랩 반응 기록의 항목 이름과 소수점까지 같습니다.' 화면 구석에 파일을 처음 만든 계정이 뜹니다. KD금융그룹 그룹전략실. '오진우는 스카우트된 것이 아니라, 추천된 것일 수 있습니다. 본인의 동의 기록은 없습니다.'",
      memo: ["후보자 평가표 수치 = 트리거랩 반응 기록 항목", "파일 작성 계정: KD금융그룹 그룹전략실", "오진우 본인 동의 기록 없음"],
      routeChoices: [
        ["c18_route_system_tell", "평가표를 오진우에게 그대로 보여 준다", { trust: 10, humanCost: -3, legitimacy: 4, capital: -5, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c18_route_system_audit", "반응 기록이 밖으로 나간 경위를 공식 조사로 요청한다", { legitimacy: 12, trust: 3, time: -8, humanCost: 3, fatigue: 5 }, { inference: 2 }],
        ["c18_route_system_card", "평가표는 덮어 두고 매각 협상의 카드로 쥔다", { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "반응 기록을 쓴 채용은 무효라는 조항을 서명 조건에 넣는다", { legitimacy: 13, trust: 6, capital: -8, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "오진우가 알든 모르든 제안 조건만 올려 받게 한다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "오진우와 함께 도하람에게 추천인이 누구인지 직접 묻는다", { trust: 10, legitimacy: 7, capital: -6, time: -7, humanCost: 3, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c18_evidence_turn",
    result: "c18_aftershock",
    sourceRoutes: ["c18_lounge", "c18_party", "c18_table", "c18_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 매각 계약서 초안 옆에 놓고, 파는 쪽과 사는 쪽이 무엇을 주고받는지 맞춰 본다.",
    entryEcho: "단서를 대면 가격 말고도 거래되는 것이 보입니다. 계약서 본문에 적히지 않은 쪽이 더 비쌀 수 있습니다.",
    title: "거래 조건 7번",
    speaker: "반재욱",
    text: "단서를 맞추자 매각 계약서 초안의 부속 합의서가 열립니다. 조건 1번부터 6번은 가격과 날짜입니다. 7번은 한 줄입니다. '매도인은 매수인의 핵심 인력 채용에 협조한다. 대상: 트리거랩 오진우.' 작성일은 브릿지가 제안서를 보내기 열하루 전입니다. 반재욱이 수첩을 덮습니다. '스카우트가 아니라 옮겨 심기군요. KD는 대출 묶음을 싸게 넘기고, 덤으로 시끄러운 분석관 하나를 치웁니다.' 그가 안경을 고쳐 씁니다. '오진우 씨가 이기는 쪽이라고 생각한 그 자리, 처음부터 KD가 정해 둔 자리였습니다.'",
    memo: ["부속 합의서 7번: 트리거랩 오진우 채용 협조", "작성일: 제안서 발송 11일 전", "서명: KD금융그룹 그룹전략실 · 브릿지은행 전략본부"],
    triggers: ["injustice", "manipulation", "system"],
    entryEffect: { legitimacy: 7, trust: 2, time: -5, capital: -2, fatigue: 4 },
    choices: [
      ["c18_evidence_turn_show", "7번 조항을 오진우에게 가장 먼저 보여 준다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
      ["c18_evidence_turn_file", "7번 조항을 금융감독원에 부당한 거래 조건으로 신고한다", { legitimacy: 13, trust: 4, capital: -7, time: -8, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c18_evidence_turn_hold", "7번은 쥐고 있다가 서명 직전에 협상 카드로 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c18_branch_dataroom",
    systemNext: "c18_route_system",
    evidenceNext: "c18_evidence_turn",
    routeLabel: "직전 사건의 수첩 방식대로 매각 묶음 속 이름을 한 명씩 적어 본다",
    systemLabel: "직전 자유응답 문장이 브릿지의 후보자 평가표에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 매각 계약서의 부속 합의서를 연다",
  },
  openingRoutes: {
    c17_after_warm: "c18_start_warm",
    c17_after_record: "c18_start_record",
    c17_after_rush: "c18_start_rush",
  },
  openingCopy: {
    c18_start_warm: ["곁에 남았던 사람의 봉투", "오진우", "어젯밤 당신은 정태오의 떡꼬치 트럭이 불을 끌 때까지 남아 반재욱과 소스 통을 흔들었습니다. 그사이 오진우는 트럭 뒤에서 전화 한 통을 오래 받고 돌아와, 아무 일 없다는 얼굴로 꼬치를 뒤집었습니다. 월요일 아침, 그가 당신 책상에 흰 봉투를 내려놓습니다. 브릿지은행 인수팀장, 연봉 두 배. 할 일은 KD은행의 부실채권(돌려받기 어려워진 대출) 묶음 1,860억을 사들이는 것입니다. '어제 그 전화예요. 트럭 앞에서 꺼냈으면 반 선배 수첩에 제 이름도 적혔을 거예요.'", ["어젯밤 트럭 뒤의 전화: 브릿지은행", "브릿지은행 인수팀장 제안 -- 연봉 두 배", "업무: KD은행 부실채권 묶음 1,860억 매입"]],
    c18_start_record: ["문서에 이름을 올린 사람의 봉투", "에코", "어젯밤 당신은 감사 보고서에 '지시한 사람' 칸을 넣자는 제안서를 남겼고, 검토자 칸에는 오진우가 이름을 올렸습니다. 제안서는 새벽에 그룹 법무팀으로 넘어갔습니다. 월요일 아침, 오진우가 내민 브릿지은행 채용 제안서의 경력란 맨 아래에 그 검토 이력이 한 줄 붙어 있습니다. 인수팀장, 연봉 두 배. 할 일은 KD은행의 부실채권(돌려받기 어려워진 대출) 묶음 1,860억을 사들이는 것입니다. 에코가 짚습니다. '열 시간 전에 쓴 문서가 다른 은행의 경력란에 있습니다. 누군가 밤사이 건넸습니다.'", ["어젯밤 제안서의 검토자: 오진우", "브릿지 채용 제안서가 그 검토 이력을 경력으로 인용", "업무: KD은행 부실채권 묶음 1,860억 매입"]],
    c18_start_rush: ["복도에서 기다린 사람의 봉투", "오진우", "어젯밤 트럭 뒤까지 따라가 그 전화가 뭐냐고 물었을 때, 오진우는 전화를 끊고 '아무것도 아니에요'라고 했습니다. 월요일 아침, 그 아무것도 아닌 것이 흰 봉투에 담겨 당신 책상에 놓입니다. 브릿지은행 인수팀장, 연봉 두 배. 할 일은 KD은행의 부실채권(돌려받기 어려워진 대출) 묶음 1,860억을 사들이는 것입니다. '어제는 거짓말했어요. 따라와서 물어본 사람한테는 제일 먼저 말해야 할 것 같아서요. 대신 오래 끌지는 말아 주세요.'", ["어젯밤의 대답: '아무것도 아니에요'", "브릿지은행 인수팀장 제안 -- 연봉 두 배", "답변 기한: 12월 28일 09시"]],
  },
  openingSignatures: {
    c18_start_warm: {
      label: "반재욱처럼 오진우의 이야기를 수첩에 끝까지 받아 적는다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "반재욱처럼, 오진우의 이야기를 수첩에 끝까지 받아 적는다.",
      echo: "받아 적으면 오진우가 처음으로 말을 천천히 합니다. 수첩 한 장이 다 찰 때까지 연봉 얘기는 한 번도 나오지 않습니다.",
    },
    c18_start_record: {
      label: "밤사이 내 문서를 누가 건넸는지부터 브릿지에 묻는다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "밤사이 내 문서를 누가 건넸는지부터, 브릿지에 공식으로 묻는다.",
      echo: "물으면 브릿지는 정중한 답장을 보냅니다. '공개된 자료를 참고했습니다.' 누가 그 자료를 건넸는지는 적혀 있지 않습니다.",
    },
    c18_start_rush: {
      label: "어젯밤 거짓말은 묻지 않고 오진우와 바로 결론까지 이야기한다",
      effect: { trust: 12, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "어젯밤 거짓말은 묻지 않고, 오진우와 바로 결론까지 이야기한다.",
      echo: "묻지 않으면 이야기는 빠릅니다. 빠른 결론에 오진우가 안도하는 얼굴을 보이고, 그 얼굴이 조금 마음에 걸립니다.",
    },
  },
  voiceLines: {
    // CASE 18. Every line is said to someone who might leave. None of them is
    // allowed to decide for him.
    c18_start_listen: "봉투는 덮어 두고, 오진우의 이야기부터 끝까지 듣는다.",
    c18_start_terms: "제안서의 조건과 매각 묶음 목록부터, 한 줄씩 확인한다.",
    c18_start_knife: "이 자리가 KD를 칠 칼이 될 수 있는지부터, 계산해 본다.",
    c18_lounge_ask: "연봉보다, 오진우가 그 자리에서 지킬 사람이 누구인지 먼저 묻는다.",
    c18_lounge_paper: "가격을 매긴 근거를, 서면으로 달라고 한다.",
    c18_lounge_blade: "그 칼로 KD의 어디를 벨 수 있는지, 먼저 따져 본다.",
    c18_branch_dataroom_a: "오진우와 함께, 아버지의 파일만 끝까지 읽는다.",
    c18_branch_dataroom_b: "열람 사실을 기록에 남기고, 파일은 닫는다.",
    c18_branch_dataroom_c: "출력 금지를 무시하고, 휴대폰으로 화면을 찍는다.",
    c18_branch_dataroom_follow_a: "그 파일을 누가 갖든, 오진우의 편에 서겠다고 말한다.",
    c18_branch_dataroom_follow_b: "열람 기록 사본을, 우리도 한 부 달라고 요구한다.",
    c18_branch_dataroom_follow_c: "기록은 도하람에게 두고, 조용히 자리를 뜬다.",
    c18_party_wait: "재촉하지 않고, 오진우가 스스로 말할 때까지 송년회를 지킨다.",
    c18_party_share: "팀 전원에게 매각 계획서를 보여 주고, 함께 판단하자고 한다.",
    c18_party_push: "오늘 밤 안에 답을 정하라고, 오진우를 재촉한다.",
    c18_table_stay: "두 사람이 끝까지 말하도록, 식탁에 남아 대화를 거든다.",
    c18_table_list: "매각 묶음 속 옛 고객 명단을, 오상철과 한 줄씩 짚어 본다.",
    c18_table_win: "이기는 쪽에 서라는 말을 받아, 가라고 오진우에게 권한다.",
    c18_final_keep: "트리거랩이 네 자리라며, 오진우를 붙잡는다.",
    c18_final_terms: "보내되, 채무자 보호 조항과 안팎에서 같이 싸울 약속을 조건으로 건다.",
    c18_final_block: "오진우의 결정을 기다리지 않고, 매각 자체를 막으러 간다.",
    c18_after_warm: "오늘은 탕비실 불을 끌 때까지, 오진우와 함께 남는다.",
    c18_after_record: "매각 묶음의 채무자 보호 기준을, 문서로 남겨 둔다.",
    c18_after_rush: "문자를 받자마자, 곧장 회기동 헌책방으로 간다.",
    c18_route_system_tell: "평가표를, 오진우에게 그대로 보여 준다.",
    c18_route_system_audit: "반응 기록이 밖으로 나간 경위를, 공식 조사로 요청한다.",
    c18_route_system_card: "평가표는 덮어 두고, 매각 협상의 카드로 쥔다.",
    c18_final_system_route_a: "반응 기록을 쓴 채용은 무효라는 조항을, 서명 조건에 넣는다.",
    c18_final_system_route_b: "오진우가 알든 모르든, 제안 조건만 올려 받게 한다.",
    c18_final_system_route_c: "오진우와 함께, 도하람에게 추천인이 누구인지 직접 묻는다.",
    c18_evidence_turn_show: "7번 조항을, 오진우에게 가장 먼저 보여 준다.",
    c18_evidence_turn_file: "7번 조항을, 금융감독원에 부당한 거래 조건으로 신고한다.",
    c18_evidence_turn_hold: "7번은 쥐고 있다가, 서명 직전에 협상 카드로 꺼낸다.",
  },
  echoReplies: {
    // CASE 18.
    c18_start_listen: "끝까지 들으면 오진우가 봉투 이야기보다 아버지 이야기를 더 오래 합니다. 그날 오전 일정은 전부 밀립니다.",
    c18_start_terms: "목록을 읽으면 1,214건 중 64건이 한 지점에서 나온 대출이라는 게 보입니다. 오진우는 당신이 자기 얼굴보다 목록을 먼저 봤다는 걸 압니다.",
    c18_start_knife: "계산하면 칼은 분명히 날이 서 있습니다. 오진우는 당신도 그 칼을 먼저 봤다는 사실에 조금 안도하고, 조금 실망합니다.",
    c18_lounge_ask: "물으면 도하람이 처음으로 대답을 늦춥니다. 오진우는 대답 대신 창밖의 KD 본사를 봅니다.",
    c18_lounge_paper: "서면을 요구하면 근거는 남습니다. 도하람은 '꼼꼼한 분을 데려오셨네요'라며 오진우에게만 웃습니다.",
    c18_lounge_blade: "따져 보면 벨 곳은 많습니다. 그중 어느 곳에도 채무자 1,214명은 적혀 있지 않습니다.",
    c18_branch_dataroom_a: "끝까지 읽으면 검토서 마지막 장에 오상철의 반박 메모가 붙어 있습니다. 3년 동안 아무도 읽지 않은 메모입니다.",
    c18_branch_dataroom_b: "기록을 남기면 열람은 떳떳해집니다. 오진우가 본 일곱 글자는 그대로 화면 안에 남습니다.",
    c18_branch_dataroom_c: "찍은 사진은 칼이 됩니다. 출력 금지를 어긴 계정은 오진우의 임시 계정입니다.",
    c18_branch_dataroom_follow_a: "편에 서겠다는 말에 도하람이 고개를 끄덕입니다. '그럼 두 분을 같이 모셔야겠네요.' 농담인지 아닌지 알 수 없습니다.",
    c18_branch_dataroom_follow_b: "사본을 받으면 증거가 둘이 됩니다. 도하람은 순순히 한 부를 더 뽑아 주고, 그 순순함이 더 계산된 것처럼 보입니다.",
    c18_branch_dataroom_follow_c: "자리를 뜨면 기록은 도하람의 서랍으로 갑니다. 오진우는 엘리베이터 안에서 주머니를 한 번 더 누릅니다.",
    c18_party_wait: "기다리면 송년회는 자정을 넘깁니다. 오진우는 끝내 말하지 않지만, 마지막까지 남아 컵라면 트리를 치웁니다.",
    c18_party_share: "보여 주면 탕비실이 조용해집니다. 모두가 판단을 보태고, 오진우는 자기 일이 모두의 안건이 된 것을 조금 버거워합니다.",
    c18_party_push: "재촉하면 답은 빨라집니다. 오진우가 '내일 말할게요' 하고 먼저 코트를 챙깁니다. 트리 꼭대기 별이 기울어집니다.",
    c18_table_stay: "남아 거들면 저녁은 두 시간을 넘깁니다. 어머니가 네 번째 계란말이를 부칩니다.",
    c18_table_list: "짚어 보면 오상철이 이름마다 가게 위치와 아이들 이름을 기억해 냅니다. 식탁이 저녁 밥상에서 심사장이 됩니다.",
    c18_table_win: "권하면 오상철이 처음으로 당신을 똑바로 봅니다. 오진우는 두 사람에게 같은 말을 들은 얼굴로 젓가락을 내려놓습니다.",
    c18_final_keep: "붙잡으면 오진우는 남습니다. 도하람은 그날 오후 다른 팀장을 뽑고, 그 사람은 매탄지점이 어디인지 모릅니다.",
    c18_final_terms: "조건을 걸면 오진우는 가고, 계약서에 채무자 보호 조항 한 장이 붙습니다. 그 조항을 지키게 할 사람은 이제 다른 은행에 있습니다.",
    c18_final_block: "막으러 가면 9시 서명은 열리지 않습니다. 오진우는 자기 대신 누군가 정해 버린 아침을, 한동안 당신에게 따지지 않습니다.",
    c18_after_warm: "불을 끌 때까지 남으면 컵라면 트리가 다 없어집니다. 헌책방 문자에는 내일 아침 첫차에서 답합니다.",
    c18_after_record: "문서가 된 기준은 누가 팀장이 되든 남습니다. 오진우가 검토자 칸에 이름을 쓰고, 이번에는 경력으로 쓰지 말라고 적어 둡니다.",
    c18_after_rush: "곧장 가면 헌책방 셔터 앞에 처음 보는 20대 여성이 '짐'이라고 적힌 상자를 들고 서 있습니다.",
    c18_route_system_tell: "보여 주면 오진우가 숫자 두 개를 오래 봅니다. '저를 산 게 아니라, 제 반응을 산 거네요.'",
    c18_route_system_audit: "조사를 요청하면 경위는 서류가 됩니다. 조사 기간은 오진우의 답변 기한보다 깁니다.",
    c18_route_system_card: "카드로 쥐면 협상은 유리해집니다. 오진우는 자기에 대한 가장 중요한 사실을 모르는 채 서명장에 갑니다.",
    c18_final_system_route_a: "무효 조항이 들어가면 브릿지는 채용을 처음부터 다시 해야 합니다. 이번에는 면접으로요.",
    c18_final_system_route_b: "조건이 오르면 오진우는 더 좋은 계약서를 받습니다. 그 계약서의 근거가 된 숫자는 여전히 그의 동의 없이 쓰였습니다.",
    c18_final_system_route_c: "직접 물으면 도하람이 잠깐 웃습니다. '추천서는 33층에서 왔습니다. 저도 처음엔 이상하다고 생각했어요.'",
    c18_evidence_turn_show: "보여 주면 오진우가 제안서를 반으로 접습니다. 그리고 다시 펴서, 가격 칸을 봅니다.",
    c18_evidence_turn_file: "신고는 기록으로 남습니다. 9시 서명은 예정대로 열리고, 조사 결과는 봄에 나옵니다.",
    c18_evidence_turn_hold: "쥐고 있으면 서명 직전의 방은 당신 것이 됩니다. 오진우는 그 조항을 자기보다 당신이 먼저 알았다는 걸 나중에 압니다.",
  },
  characterProfiles: {
    도하람: {
      role: "브릿지은행 전략본부장 · 권도현의 상사",
      stance: "사람 · 거래 · 냉정",
      job: "사람의 약점이 아니라 그 사람이 끝까지 가는 이유를 보고 값을 매긴다. 그에게 스카우트는 거래의 한 항목이다.",
      appearance: "단추 하나를 늘 풀어 둔 회색 코트, 커피를 직접 나르는 손, 후보자 이름 하나만 적힌 얇은 가죽 폴더.",
      thought: "사람은 연봉을 보고 오지 않는다. 자기가 이길 수 있다고 믿는 판을 보고 온다.",
      gesture: "도하람은 상대가 대답하기 전에 커피잔을 상대 쪽으로 한 뼘 민다. 그 한 뼘이 기다려 주는 시간이다.",
      voice: "빠르지 않고 정확하게, 상대가 스스로 하려던 말을 먼저 한다.",
      line: "칼은 드립니다. 어디를 벨지는 팀장이 정하세요.",
    },
    오상철: {
      role: "전 KD은행 수원 매탄지점장 · 오진우의 아버지",
      stance: "옳음 · 패배 · 아버지",
      job: "옳았지만 진 사람이 치른 값을, 아들에게 밥상 위에서 말한다.",
      appearance: "보풀이 인 카디건, 30년 치 고객 명함을 묶은 노란 고무줄, 현관에 가지런히 벗어 둔 낡은 구두.",
      thought: "옳은 사람이 지면 그 사람 편이던 사람들까지 진다. 아들은 그러지 않았으면 한다.",
      gesture: "오상철은 어려운 말을 하기 전에 식은 국을 한 숟가락 먼저 뜬다.",
      voice: "짧게 말하고, 가장 아픈 말은 밥상 위에서 한다.",
      line: "가라. 너는 이기는 쪽에 서라.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "12월 21일 · 답변 기한 D-7" },
  sceneContext: {
    c18_start: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 21일 · 답변 기한 D-7",
      question: "오진우가 연봉 두 배와 KD를 벨 칼이 든 봉투를 당신에게 가장 먼저 보여 줍니다. 무엇부터 하겠습니까?",
      lead: "12월 21일 아침, 트리거랩 4층 탕비실에 누군가 크리스마스트리 대신 컵라면 탑을 쌓아 두었습니다.",
    },
    c18_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 21일 · 답변 기한 D-7",
      question: "떡꼬치 트럭 뒤에서 받은 전화가 흰 봉투가 되어 돌아왔습니다. 오진우의 말을 어떻게 받겠습니까?",
      lead: "떡꼬치 소스 냄새가 코트에서 채 빠지지 않은 월요일 아침입니다.",
    },
    c18_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 21일 · 답변 기한 D-7",
      question: "어젯밤 남긴 문서가 동료를 데려갈 제안서의 경력 한 줄이 됐습니다. 그 문서를 어떻게 되찾겠습니까?",
      lead: "어젯밤 남긴 제안서의 공유 기록을 보다가, 낯선 은행 이름에서 멈췄습니다.",
    },
    c18_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 21일 · 답변 기한 D-7",
      question: "어젯밤 아무것도 아니라던 전화가 봉투가 되어 책상에 놓였습니다. 무엇을 먼저 말하겠습니까?",
      lead: "어젯밤 트럭 뒤에서 들은 '아무것도 아니에요'가 아직 귀에 남아 있는 월요일 아침입니다.",
    },
    c18_lounge: {
      place: "여의도 브릿지은행 본점 · 32층 라운지 회의실",
      clock: "12월 22일 · 답변 기한 D-6",
      question: "도하람이 오진우에게 칼을 내밀고, 당신에게는 붙잡으러 왔는지 보내러 왔는지 묻습니다. 어떻게 답하겠습니까?",
      lead: "오진우가 혼자 가기 싫다며 당신을 브릿지은행 본점 32층까지 데려왔습니다. 창밖 정면에 KD 본사가 보입니다.",
    },
    c18_branch_dataroom: {
      place: "여의도 브릿지은행 · 실사 자료실",
      clock: "12월 22일 · 14:07",
      question: "아버지를 밀어낸 사유가 일곱 글자로 화면에 떠 있습니다. 이 파일을 어떻게 하겠습니까?",
    },
    c18_branch_dataroom_follow: {
      place: "여의도 브릿지은행 · 22층 복도",
      clock: "12월 22일 · 14:40",
      question: "도하람이 열람 기록을 쥔 채 그 파일의 주인이 누가 될지 말합니다. 어떻게 답하겠습니까?",
    },
    c18_appendix: {
      place: "여의도 브릿지은행 · 엘리베이터",
      clock: "12월 22일 · 15:10",
      question: "비어 있다던 채무자 칸이 612명의 인력 정리 계획으로 채워져 있습니다. 이 부록을 어떻게 하겠습니까?",
    },
    c18_appendix_reaction: {
      place: "여의도 브릿지은행 본점 · 1층 로비",
      clock: "12월 22일 · 15:15",
      question: "도하람은 부록을 숨기면 오진우를 못 믿는 것이라고 합니다. 그 시험에 어떻게 응하겠습니까?",
    },
    c18_party: {
      place: "트리거랩 4층 · 탕비실 송년회",
      clock: "12월 23일 · 19:30",
      question: "송년회 한가운데서 오진우가 혼자 송별사를 다섯 번째 연습하고 있었습니다. 어떻게 하겠습니까?",
      lead: "12월 23일 저녁, 트리거랩 탕비실에 꼬마전구가 걸렸습니다. 송년회는 도윤하가 3주 전부터 준비했습니다.",
    },
    c18_ledger: {
      place: "트리거랩 4층 · 탕비실",
      clock: "12월 23일 · 21:00",
      question: "권도현의 손익계산서에서 잃는 것 칸 아래가 비어 있습니다. 그 빈칸을 어떻게 하겠습니까?",
    },
    c18_ledger_reaction: {
      place: "트리거랩 4층 · 비상구 복도",
      clock: "12월 23일 · 22:10",
      question: "나준혁이 30년 동안 딱 한 번 받은 제안 이야기를 꺼냅니다. 이 자리에서 무엇을 하겠습니까?",
    },
    c18_table: {
      place: "수원 오상철의 집 · 식탁",
      clock: "12월 24일 · 크리스마스이브 19시",
      question: "옳았던 아버지가 아들에게 이기는 쪽에 서라고 합니다. 이 식탁에서 어떻게 하겠습니까?",
      lead: "크리스마스이브, 오진우가 '혼자 가면 또 싸울 것 같다'며 당신을 수원 본가 식탁에 앉혔습니다.",
    },
    c18_snow: {
      place: "수원 매탄동 · 버스 정류장 골목",
      clock: "12월 24일 · 눈발 · 21:40",
      question: "슬리퍼 차림의 오상철이 30년 치 고객 명함을 아들 손에 쥐여 줍니다. 버스가 오기 전에 무엇을 하겠습니까?",
    },
    c18_snow_reaction: {
      place: "수원발 광역버스 · 차 안",
      clock: "12월 24일 · 23:00",
      question: "권도현이 가격표에 자기 이름값을 얼마로 쓸지 묻습니다. 어떻게 답하겠습니까?",
    },
    c18_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "12월 21일 · 23:40",
      question: "브릿지의 후보자 평가표에 트리거랩 반응 기록의 숫자가 그대로 있습니다. 이 사실을 어떻게 하겠습니까?",
    },
    c18_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "12월 28일 · 새벽 05:30",
      question: "동의 없이 쓰인 반응 기록이 채용의 근거가 됐습니다. 서명 전에 무엇을 바꾸겠습니까?",
    },
    c18_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 매각 계약서 사본",
      clock: "12월 28일 · 07시",
      question: "스카우트는 제안서보다 열하루 먼저 거래 조건 7번으로 적혀 있었습니다. 이 조항을 어떻게 쓰겠습니까?",
    },
    c18_final: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 28일 · 08:21 · 서명까지 39분",
      question: "서명 39분 전, 오진우가 스스로 정하기 전에 당신 말을 먼저 듣고 싶다고 합니다. 무엇이라 하겠습니까?",
      lead: "서명 당일 아침, 오진우는 브릿지은행으로 가기 전에 트리거랩 4층에 먼저 들렀습니다.",
    },
    c18_aftershock: {
      place: "트리거랩 4층 · 탕비실",
      clock: "12월 31일 · 저녁",
      question: "여섯 번째 송별사가 끝나자 헌책방 철거 소식이 옵니다. 한 해의 마지막 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c18-clause-seven",
    title: "거래 조건 7번",
    text: "매각 계약서 부속 합의서 7번은 '매도인은 매수인의 핵심 인력 채용에 협조한다. 대상: 트리거랩 오진우'였습니다. 스카우트는 제안서보다 열하루 먼저 거래 조건으로 적혀 있었습니다.",
  },
  outcomes: {
    c18_after_warm: { tag: "끝까지 남은 결말", title: "탕비실 불을 끌 때까지 오진우와 남았다", text: "여섯 번째 송별사가 끝난 밤, 컵라면 트리의 남은 19개를 모두 같이 먹었습니다. 마지막으로 불을 끈 사람은 오진우였습니다." },
    c18_after_record: { tag: "기준을 남긴 결말", title: "매각 묶음의 채무자 보호 기준이 문서가 됐다", text: "누가 사든, 누가 팀장이든 따라야 할 기준이 한 장으로 남았습니다. 첫 줄에는 소담찬방 직원 31명이 적혀 있습니다." },
    c18_after_rush: { tag: "먼저 달려간 결말", title: "송별사가 끝나자마자 헌책방으로 갔다", text: "박수가 채 끝나기 전에 당신은 코트를 들었습니다. 오진우가 계단까지 따라 나와 '가세요, 이번엔 제가 늦게 갈게요'라고 했습니다." },
  },
  carryovers: {
    c18_after_warm: { trust: 9, humanCost: -4, fatigue: -8 },
    c18_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c18_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c17_after_warm: { id: "protect-trust", title: "떠날지도 모르는 동료 곁에 남기", text: "트럭 불이 꺼질 때까지 수첩 속 사람들 곁에 남았던 것처럼, 이번에는 떠날지도 모르는 동료 곁에 남는 선택을 찾아야 보너스가 열립니다." },
    c17_after_record: { id: "use-reframe", title: "경력이 된 내 문서 되찾기", text: "당신이 남긴 문서가 오진우를 데려가는 제안서의 경력 한 줄이 됐습니다. 그 문서가 누구를 위한 것인지 판을 다시 짜야 합니다." },
    c17_after_rush: { id: "repair-legitimacy", title: "따라가서 들은 거짓말의 공정함 회복하기", text: "트럭 뒤까지 따라가 물었지만 오진우는 아무것도 아니라고 했습니다. 서둘러 캐물은 밤 대신, 그의 선택을 서두르게 하지 않는 길을 찾아야 합니다." },
  },
};
