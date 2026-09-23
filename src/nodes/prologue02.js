/**
 * PROLOGUE 02 -- 2023-0412, the loan the whole season is the aftermath of.
 *
 * April 2023. The analyst is five months past the trainee tag and holds a first
 * solo file: 310억 to 플로우온, a dawn-delivery logistics platform everybody
 * liked that year. 윤상혁 calls it a group strategy task, which is how this bank
 * says a thing is already approved. The site visit is not an ambush. 권태호, the
 * founder, knows the name of every night-shift lead, feeds the analyst
 * 순댓국 at 4 a.m., and is telling the truth about all of it. 강태민 is on the
 * floor moving boxes, four years before the season meets him. 문성호 signs a
 * three-year supply contract on the strength of a loan that has not been
 * approved yet, and his wife 문가을 wraps rice cakes for the bank people.
 *
 * What the analyst finds is small and arithmetical. The CFO 배성준 moved four
 * weeks of revenue forward in the books and the reported debt ratio came out at
 * 179.6%. Clause 7 of the bank's own contract lets KD call the loan the moment
 * the ratio passes 180%. The clause was written by 기업금융전략팀 -- this desk,
 * this room -- and the circulation record of its draft carries six employee
 * numbers, the last of which is the analyst's own, stamped one evening while
 * still a trainee. The loan is not a trap somebody set. It is a loan that has
 * been standing on 0.4 percentage points since the day it was designed, and
 * everyone who built it was doing their job politely.
 *
 * Nothing here can be won. The final is only the shape of the dissent -- alone
 * under one name, carried by signatures that will thin out, or softened into a
 * conditional-approval opinion that never gets returned because it never says
 * no. The first of those is the document that, three years later, is not in the
 * archive. The reader already knows that. The analyst does not.
 */
export const prologue02Nodes = {
  p2_start: {
    phase: "PROLOGUE 02 BRIEFING",
    title: "310억이 올라온 아침",
    speaker: "윤상혁",
    text:
      "2023년 4월 12일 수요일 아침 아홉 시, KD은행 본점 6층 기업금융전략팀 심사실입니다. 수습 딱지를 뗀 지 다섯 달 만에 당신 책상에 두꺼운 서류철 하나가 놓입니다. 대출번호 2023-0412, 돈을 빌리는 회사는 새벽 배송 물류 플랫폼 플로우온, 금액은 310억 원입니다. 첫 장에 적힌 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)은 179.6%이고, 마지막 장 심사 담당 칸에는 당신 이름이 인쇄돼 있습니다. 윤상혁 팀장이 서류철 위에 손바닥을 얹습니다. '이건 그룹 전략 과제네. 실사(현장에 직접 가서 확인하는 일)는 자네가 나가고, 의견서는 다음 주 화요일까지. 심사위원회는 이달 26일이야.' 그가 웃습니다. 질책이 아니라 축하에 가까운 얼굴입니다. '자네 첫 단독 건이지. 이런 회사는 10년에 한 번 나와. 잘 봐 두게.'",
    memo: [
      "대출번호 2023-0412 · 플로우온 운영자금 310억",
      "보고된 부채비율 179.6%",
      "윤상혁: '그룹 전략 과제' -- 심사위원회 4월 26일",
      "의견서 제출 기한: 4월 18일 화요일 18시",
    ],
    triggers: ["order", "responsibility", "curiosity"],
    choices: [
      {
        id: "p2_start_team",
        label: "팀원들을 모아 이 건을 어떻게 볼지 먼저 나눈다",
        effect: { trust: 12, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "p2_site",
        cognition: { persistence: 2 },
      },
      {
        id: "p2_start_scope",
        label: "'그룹 전략 과제'라는 말의 범위를 문서로 확인해 달라고 한다",
        effect: { legitimacy: 11, trust: -2, time: -5, humanCost: 2, fatigue: 3 },
        next: "p2_site",
        cognition: { inference: 2 },
      },
      {
        id: "p2_start_accept",
        label: "기한을 그대로 받고 오늘 저녁 실사 일정부터 잡는다",
        effect: { capital: 9, time: 5, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -2 },
        next: "p2_site",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p2_site",
      },
    ],
  },
  p2_site: {
    phase: "SITE VISIT",
    title: "창업주의 동선",
    speaker: "권태호",
    text:
      "4월 13일 목요일, 플로우온 본사와 김포 제2풀필먼트센터(주문받은 물건을 보관했다가 포장해서 보내 주는 큰 창고)로 실사(현장에 직접 가서 확인하는 일)를 나갑니다. 창업주 권태호가 직접 안내를 맡습니다. 그는 회의실에 앉지 않고 컨베이어 옆을 걸으며 설명하고, 지나가는 반장들의 이름을 한 명씩 부릅니다. 여덟 해 전 트럭 두 대로 시작한 회사가 지금은 직원 1,140명, 하루 처리 물량 21만 상자입니다. '은행 분들이 오시면 다 숫자부터 보시는데요.' 그가 웃으며 창고 끝을 가리킵니다. '저는 저기 3번 라인부터 보시라고 해요. 저기 사람들이 우리 회사예요.' 보고된 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%가 적힌 자료를 그가 직접 펼쳐 보이는데, 숫자를 짚는 손가락에 망설임이 전혀 없습니다. 오후 여섯 시, 야간조가 교대하러 들어오고 컨베이어 소리가 한 단계 커집니다.",
    memo: [
      "플로우온 직원 1,140명 · 하루 21만 상자",
      "김포 제2센터 -- 임차 계약 2026년까지",
      "권태호 창업 8년차, 지분 구조는 가족 중심",
      "야간조 교대 18시 -- 이후 인원 380명",
    ],
    triggers: ["curiosity", "trust", "recognition"],
    choices: [
      {
        id: "p2_site_floor",
        label: "안내 동선을 벗어나 3번 라인 사람들에게 직접 묻는다",
        effect: { trust: 13, humanCost: -5, time: -7, capital: -3, fatigue: 5 },
        next: "p2_model",
        cognition: { reframing: 2 },
      },
      {
        id: "p2_site_papers",
        label: "창고 임차 계약과 장부를 현장에서 한 장씩 대조한다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 2, fatigue: 4 },
        next: "p2_model",
        cognition: { inference: 2 },
      },
      {
        id: "p2_site_tour",
        label: "준비된 동선대로 돌고 일정보다 일찍 본점으로 돌아온다",
        effect: { capital: 8, time: 6, trust: -3, legitimacy: -3, humanCost: 3, fatigue: -3 },
        next: "p2_model",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p2_model",
      },
    ],
  },
  p2_model: {
    phase: "RECALCULATION",
    title: "0.4%포인트",
    speaker: "한서윤",
    text:
      "4월 14일 금요일 밤 열한 시, 심사실에 남은 사람은 당신과 한서윤 과장뿐입니다. 플로우온이 낸 장부를 월별로 다시 갈라 놓자 한 덩어리가 어긋납니다. 12월 마지막 주에 몰린 매출 412억 가운데 268억은 실제로 물건이 나간 날이 1월입니다. 숫자를 지어낸 것이 아니라, 장부에 올리는 시점만 4주 당겨 놓은 것입니다. 그 268억을 원래 자리로 돌려놓고 다시 세우면 부채비율은 184.2%가 됩니다. 보고된 179.6%와 계약서 제7조가 그어 놓은 180% 사이의 거리는 0.4%포인트입니다. 한서윤이 계산기를 엎어 놓고 한참 화면을 봅니다. '이걸 틀렸다고 쓰려면 회계법인 의견서가 우리 편이어야 해요. 그 의견서는 회사가 값을 치르고 받아 온 거고요.' 그가 잠깐 말을 멈춥니다. '그리고 이런 문장은, 쓴 사람 이름으로 남아요.'",
    memo: [
      "12월 매출 412억 중 268억 -- 실제 출고는 1월",
      "다시 세운 부채비율 184.2% / 보고치 179.6%",
      "계약서 제7조 기준선 180%까지 0.4%포인트",
      "회계법인 적정 의견 -- 회사가 비용을 낸 용역",
    ],
    triggers: ["injustice", "system", "fear"],
    choices: [
      {
        id: "p2_model_ask",
        label: "회사 재무팀에 왜 시점을 당겼는지 직접 묻기로 한다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -4, fatigue: 5 },
        next: "p2_draft",
        cognition: { persistence: 2 },
      },
      {
        id: "p2_model_rebuild",
        label: "월별 원자료로 계산 과정을 처음부터 다시 세워 문서로 남긴다",
        effect: { legitimacy: 13, trust: 2, time: -7, humanCost: 3, fatigue: 5 },
        next: "p2_draft",
        cognition: { inference: 2 },
      },
      {
        id: "p2_model_report",
        label: "보고치 179.6%를 그대로 쓰고 차이만 각주로 달아 둔다",
        effect: { capital: 8, time: 6, legitimacy: -6, trust: -2, humanCost: 4, fatigue: -3 },
        next: "p2_draft",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p2_draft",
      },
    ],
  },
  p2_draft: {
    phase: "THE CLAUSE",
    title: "제7조를 쓴 곳",
    speaker: "오진우",
    text:
      "4월 17일 월요일, 계약서 초안의 출처를 따라가다 당신은 자기 팀 공유 폴더에 도착합니다. 제7조는 플로우온 쪽이 받아들인 조건이 아니라 기업금융전략팀이 2022년 11월에 만들어 넣은 문장입니다. 부채비율이 180%를 넘으면 은행이 만기 전이라도 대출금을 즉시 회수할 수 있다. 같은 문장이 들어간 계약이 그 폴더에만 열한 건 있습니다. 즉 이 310억은 설계된 날부터 0.4%포인트 위에 얹혀 있었고, 그 높이를 정한 곳은 지금 당신이 앉아 있는 이 방입니다. 오진우 대리가 모니터를 자기 쪽으로 돌리다 손을 멈춥니다. '이걸 의견서에 쓰면요, 회사가 장부를 손댔다는 얘기가 아니라 우리 팀이 조항을 그렇게 짰다는 얘기가 돼요.' 그가 목소리를 낮춥니다. '저희 아버지는 승인을 하루 늦춰서 지점에서 밀려났어요. 하루요. 저는 그 하루를 아직도 세고 있고요.'",
    memo: [
      "계약서 제7조 작성: 기업금융전략팀 (2022년 11월)",
      "같은 문장이 들어간 계약 -- 팀 폴더 내 11건",
      "조항 기준선 180% · 보고치 179.6%",
      "오진우: 아버지 오상철, 지점에서 밀려남",
    ],
    triggers: ["responsibility", "order", "protection"],
    choices: [
      {
        id: "p2_draft_open",
        label: "조항 이야기를 팀 회의에 정식 안건으로 올리자고 한다",
        effect: { trust: 12, legitimacy: 5, humanCost: -5, time: -7, capital: -4, fatigue: 6 },
        next: "p2_final",
        cognition: { reframing: 2 },
      },
      {
        id: "p2_draft_trace",
        label: "조항 초안이 누구 요청으로 만들어졌는지 기록부터 뽑는다",
        effect: { legitimacy: 12, trust: -3, time: -6, humanCost: 3, fatigue: 4 },
        next: "p2_final",
        cognition: { inference: 2 },
      },
      {
        id: "p2_draft_split",
        label: "조항은 건드리지 않고 숫자 문제로만 의견서를 좁힌다",
        effect: { capital: 9, time: 5, trust: 3, legitimacy: -7, humanCost: 4, fatigue: -2 },
        next: "p2_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p2_final",
      },
    ],
  },
  p2_final: {
    phase: "FINAL DECISION",
    title: "무엇을 적을 것인가",
    speaker: "한서윤",
    text:
      "4월 18일 화요일 저녁 다섯 시, 제출까지 한 시간 남았습니다. 심사실 책상에는 세 뭉치가 놓여 있습니다. 현장에서 받아 적은 야간조와 협력사 사람들의 말, 184.2%까지 가는 계산 과정, 그리고 제7조 초안이 어디서 나왔는지 적힌 반 장짜리 메모입니다. 세 뭉치를 다 넣으면 의견서는 열한 장이 되고, 한 시간으로는 한 뭉치를 고를 시간밖에 없습니다. 한서윤이 문을 닫고 들어와 맞은편에 앉습니다. '반대 의견서를 낼 거면 낼 수 있어요. 그건 규정에 있어요.' 그가 종이컵을 두 개 놓습니다. '대신 무엇을 적느냐가 그 문서의 수명을 정해요. 조건부 승인(조건을 달아서 내주는 승인) 의견으로 쓰면 반려당하지 않고, 사람 이야기를 앞에 놓으면 감정적이라고 잘리고, 조항 이야기를 쓰면 이 방 전체가 대상이 돼요.' 그가 당신을 봅니다. '저도 12년 전에 한 번 써 봤어요. 그래서 아는 거예요.'",
    memo: [
      "제출 기한까지 1시간 -- 의견서 최대 11장",
      "현장 진술 14명 · 계산 과정 6장 · 조항 메모 1장",
      "한서윤: 12년 전에 같은 문서를 써 본 적 있음",
      "이 선택이 4월 26일 심사위원회로 이어짐",
    ],
    triggers: ["choice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "p2_final_people",
        label: "현장에서 만난 사람들의 말을 의견서 맨 앞에 놓는다",
        effect: { trust: 13, legitimacy: 4, humanCost: -6, capital: -6, time: -5, fatigue: 6 },
        next: "prologue02_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "p2_final_clause",
        label: "제7조를 만든 곳이 우리 팀이라는 사실을 그대로 적는다",
        effect: { legitimacy: 14, trust: -5, capital: -5, time: -6, humanCost: 4, fatigue: 5 },
        next: "prologue02_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "p2_final_margin",
        label: "0.4%포인트 하나만 남기고 나머지는 전부 덜어 낸다",
        effect: { capital: 10, time: 6, legitimacy: 3, trust: -4, humanCost: 5, fatigue: -3 },
        next: "prologue02_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "prologue02_result",
      },
    ],
  },
};

/**
 * Everything else prologue 02 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const prologue02 = {
  id: "prologue02",
  nodes: prologue02Nodes,
  aftermath: {
    p2_aftershock: {
      phase: "AFTERMATH",
      title: "누구 이름으로 내는가",
      speaker: "오진우",
      text: "4월 19일 수요일 아침 여덟 시. 의견서는 다 썼고, 남은 칸은 맨 아랫줄 하나입니다. 작성자 칸입니다. 오진우가 종이컵 두 개를 들고 와 하나를 놓습니다. '어제 세 명한테 물어봤어요. 같이 이름 올리겠다는 사람 셋 다 있어요. 지금은요.' 그가 컵을 내려다봅니다. '서명을 모으면 오늘은 못 내요. 빨라야 금요일이에요. 그리고 금요일까지 사람 마음은 바뀌고요.' 창밖으로 출근하는 사람들이 지나갑니다. 프린터가 열한 장을 뱉어 내고, 마지막 장의 작성자 칸만 비어 있습니다. 오진우가 마지막으로 한 번 더 말합니다. '조건부 승인으로 쓰면 아무도 안 다쳐요. 반려도 안 당하고요. 대신 3년 뒤에 누가 이 문서를 찾으면, 반대였다는 게 안 보일 거예요.'",
      memo: ["의견서 11장 -- 작성자 칸만 공란", "공동 서명 의사 3명 -- 제출은 금요일로 밀림", "조건부 승인 형태: 반려 위험 없음", "4월 26일 심사위원회까지 7일"],
      triggers: ["choice", "trust", "fear"],
      choices: [
        { id: "p2_after_alone", label: "작성자 칸에 내 이름 하나만 적고 오늘 오전에 낸다", effect: { legitimacy: 14, trust: -4, humanCost: 4, capital: -4, fatigue: 6 }, next: "prologue02_result", cognition: { persistence: 2, inference: 1 } },
        { id: "p2_after_shared", label: "사흘을 더 써서 동료들의 서명을 모아 공동 의견으로 낸다", effect: { trust: 12, legitimacy: 6, humanCost: -5, time: -8, capital: -5, fatigue: 7 }, next: "prologue02_result", cognition: { reframing: 2 } },
        { id: "p2_after_soften", label: "표현을 눅여 조건부 승인 의견으로 바꿔 낸다", effect: { capital: 9, time: 6, legitimacy: -7, trust: 3, humanCost: 5, fatigue: -4 }, next: "prologue02_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["p2_final", "p2_aftershock"],
  connectiveScenes: [
    ["p2_nightshift", "p2_site", "p2_model", "새벽 네 시의 3번 라인", "강태민", "실사 첫날 밤, 권태호가 야간조 순댓국을 시켜 놓고 먼저 돌아갑니다. 남은 사람은 당신과 형광 조끼를 입은 스물여덟 살 강태민입니다. 그는 창업 첫해에 들어와 지금 3번 라인 피킹(창고에서 주문받은 물건을 찾아 꺼내는 일)을 맡고 있습니다. 새벽 네 시에 컨베이어가 가장 빨라지고, 그때 한 사람이 시간당 상자 320개를 지나보냅니다. 강태민이 국그릇을 두 손으로 감싸 쥡니다. '은행에서 오셨다면서요. 돈 빌려주는 거 맞죠?' 그가 컨베이어 쪽을 턱으로 가리킵니다. '저기 절반이 계약직이에요. 회사가 크면 정규직 전환한다고 했어요. 그 말 믿고 2년 기다린 사람이 저 말고도 많아요.' 그리고 묻습니다. '그 돈 나오면, 저 약속도 같이 나오는 거예요?'", ["야간조 380명 중 계약직 181명", "3번 라인 새벽 4시 -- 시간당 320상자", "정규직 전환 약속: 문서 없음, 구두"], ["약속이 문서에 없다는 사실을 야간조에게 그대로 말한다", "정규직 전환 계획을 회사에 문서로 요구해 자료에 넣는다", "그건 은행이 볼 일이 아니라며 말을 아낀다"]],
    ["p2_ledger", "p2_model", "p2_draft", "네 주를 당긴 사람", "배성준", "토요일 오전, 플로우온 재무책임자 배성준이 먼저 전화를 걸어옵니다. 숨기려는 목소리가 아닙니다. '아, 12월 건요. 그거 제가 당겼습니다.' 그는 회사의 유동성(현금이 도는 정도)이 12월 말에 가장 나빠 보이는 구조라고 설명합니다. 창고 임차료와 배송 수수료가 연말에 몰려 나가고, 대금은 1월에 들어옵니다. '그래서 4주를 당겼어요. 회계법인도 관행 범위라고 했고요.' 그리고 그가 한 문장을 덧붙입니다. '솔직히 말씀드리면, 180%라는 선이 어디서 왔는지 저는 몰라요. 은행에서 주신 계약서에 있길래 거기 맞춘 겁니다.' 수화기 너머로 아이 목소리가 들리고, 그가 잠깐 송화구를 막습니다.", ["배성준 -- 매출 계상 시점 4주 조정, 본인 인정", "회계법인 답변: '관행 범위'", "180% 기준선의 출처를 회사는 모름"], ["그의 말을 그대로 받아 적고 어디까지 쓸지 함께 정한다", "통화 내용을 시각과 함께 공식 기록으로 남긴다", "확인은 됐으니 통화를 짧게 끊고 계산으로 돌아간다"]],
    ["p2_corridor", "p2_draft", "p2_final", "비어 있는 서명란", "윤상혁", "월요일 저녁, 비상계단 층계참에서 윤상혁을 만납니다. 그가 승인 문서 초안 한 부를 들고 있는데, 아래쪽 서명란 다섯 칸이 전부 비어 있습니다. '이름은 마지막에 넣는 거네.' 그가 종이를 접지 않고 그대로 보여 줍니다. '먼저 넣으면 사람들이 그 이름을 보고 의견을 정해. 비워 두면 내용을 보지.' 그는 당신이 무엇을 발견했는지 이미 알고 있는 얼굴입니다. 그런데 화를 내지 않습니다. '자네 계산이 틀렸다고 한 적 없네. 나는 그 계산이 놓일 자리를 말하는 거야. 이번 건은 그룹이 3년 동안 준비한 성장 과제고, 자네 의견서는 그 위에 얹히는 한 장이야.' 그가 계단을 내려가다 돌아봅니다. '그 한 장을 어디에 놓을지는 자네가 정하게. 나는 자리를 정하고.'", ["승인 문서 초안 -- 서명란 다섯 칸 전부 공란", "윤상혁: '이름은 마지막에 넣는 것'", "그룹 성장 과제 3년차 -- 이번이 최대 건"], ["그 자리에서 무엇을 발견했는지 팀장에게 전부 말한다", "면담 시각과 오간 말을 그날 밤 기록으로 남긴다", "듣기만 하고 아무 말도 하지 않은 채 올라온다"]],
  ],
  connectiveOrder: [["p2_site", "p2_nightshift"], ["p2_model", "p2_ledger"], ["p2_draft", "p2_corridor"]],
  choiceEffects: {
    p2_site: [
      { trust: 11, humanCost: -4, time: -5, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -6, humanCost: 2, fatigue: 4 },
      { time: 5, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    p2_model: [
      { trust: 10, legitimacy: 3, humanCost: -4, time: -5, capital: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -6, humanCost: 3, fatigue: 3 },
      { time: 6, capital: 3, trust: -3, legitimacy: -2, humanCost: 2, fatigue: -4 },
    ],
    p2_draft: [
      { trust: 10, humanCost: -3, legitimacy: -3, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 11, trust: -2, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 5, trust: 2, legitimacy: -4, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    p2_site: {
      voice: ["약속이 문서에 없다는 사실을, 야간조에게 그대로 말한다.", "정규직 전환 계획을 회사에 문서로 요구해, 자료에 넣는다.", "그건 은행이 볼 일이 아니라며, 말을 아낀다."],
      echo: ["그대로 말하면 강태민이 한참 국만 젓습니다. 그리고 '알려 줘서 고마워요'라고 합니다. 고맙다는 말이 제일 아픕니다.", "요구하면 회사가 사흘 뒤 한 장을 보내옵니다. '단계적 검토'라는 단어가 세 번 나오고, 날짜는 한 번도 나오지 않습니다.", "말을 아끼면 새벽 교대가 조용히 끝납니다. 강태민은 다음 질문을 하지 않습니다. 묻지 않는 법을 이미 아는 사람입니다."],
    },
    p2_model: {
      voice: ["그의 말을 그대로 받아 적고, 어디까지 쓸지 함께 정한다.", "통화 내용을 시각과 함께, 공식 기록으로 남긴다.", "확인은 됐으니 통화를 짧게 끊고, 계산으로 돌아간다."],
      echo: ["함께 정하면 배성준이 두 문장을 빼 달라고 합니다. 둘 다 자기 가족이 읽을까 봐 걱정되는 문장입니다.", "기록으로 남기면 그의 인정이 날짜를 얻습니다. 3년 뒤 그 날짜는 그를 겨눕니다. 그때 그는 이 통화를 후회할 겁니다.", "끊으면 12분이 남습니다. 남은 건 시간이고, 사라진 건 그가 자기 입으로 말한 문장입니다."],
    },
    p2_draft: {
      voice: ["그 자리에서 무엇을 발견했는지, 팀장에게 전부 말한다.", "면담 시각과 오간 말을, 그날 밤 기록으로 남긴다.", "듣기만 하고 아무 말도 하지 않은 채, 올라온다."],
      echo: ["전부 말하면 윤상혁이 처음으로 2초 멈춥니다. 그리고 '자네는 숨기질 못하는군'이라고 합니다. 칭찬처럼 들리는데 칭찬이 아닙니다.", "기록으로 남기면 그 밤의 층계참이 문서가 됩니다. 문서는 남고, 그 문서를 보관할 사람은 아직 정해지지 않았습니다.", "올라오면 아무 일도 없었던 게 됩니다. 층계참에서 오간 말은 두 사람만 알고, 그중 한 사람은 자리를 정하는 사람입니다."],
    },
  },
  reactionScenes: [
    ["p2_nightshift_reaction", "p2_nightshift", "p2_model", "4번 창구의 교육 자료", "도윤하", "센터에서 나오는 길에 모르는 번호로 전화가 옵니다. 강서지점 4번 창구의 스물네 살 행원 도윤하입니다. 지점에 다음 달 캠페인 교육 자료가 내려왔는데, 상품 이름이 '플로우온 협력사 상생 대출'이라고 합니다. '본점에서 이 건 보시는 분이 선배님이라고 해서요.' 그가 조심스럽게 묻습니다. '자료에 협력사 사장님들한테 권해 드리라고 적혀 있는데, 이게 어떤 상품인지 설명이 반쪽이에요. 여기 이 조항이요, 무슨 뜻이에요?' 그가 읽어 주는 문장은 당신이 어제 폴더에서 본 그 문장입니다. 뒤에서 지점 실적판에 숫자를 적는 소리가 들립니다.", ["조항의 뜻을 처음부터 끝까지 전화로 다 설명해 준다", "지점 교육 자료가 설명을 빠뜨렸다는 점을 문서로 지적한다", "심사 중인 건이라 말할 수 없다며 통화를 끝낸다"]],
    ["p2_ledger_reaction", "p2_ledger", "p2_draft", "수첩 첫 장", "반재욱", "통화가 끝나자 감사팀 3년차 조사역 반재욱이 심사실로 올라옵니다. 손에 표지가 아직 빳빳한 검은 수첩이 들려 있습니다. '정기 점검은 아니고요, 제가 궁금해서 왔습니다.' 그가 수첩 첫 장을 폅니다. 거기 적힌 건 한 줄뿐입니다. '2023-0412 -- 179.6.' 그가 펜을 쥔 채 묻습니다. '이 숫자, 왜 하필 180 바로 아래입니까? 저는 우연이라는 말을 잘 못 믿습니다.' 그리고 덧붙입니다. '제가 지금 이걸 정식으로 열면 심사가 멈춥니다. 안 열면 아무 일도 안 일어나고요. 어느 쪽이 좋으신지 먼저 여쭤보러 왔어요.'", ["정식으로 열어 달라고 부탁하고 자료를 다 넘긴다", "심사 기한 안에 쓸 수 있게 비공식 확인만 받는다", "지금은 열지 말아 달라고 하고 혼자 끝까지 간다"]],
    ["p2_corridor_reaction", "p2_corridor", "p2_final", "끈으로 묶은 원본", "임경수", "층계참에서 올라오자 8층 기업대출심사팀장 임경수가 복도에서 기다리고 있습니다. 정년을 1년 남긴 사람입니다. 그가 끈으로 묶은 종이 뭉치를 내밉니다. 2022년 11월 제7조 초안의 종이 원본입니다. '전산은 고치면 그만이지만 종이는 태워야 하네. 태운 자리는 표가 나고.' 그가 안경을 벗어 천천히 닦습니다. '자네가 쓸 그 문서 말이야. 뒷장을 따로 만들어 두게. 앞장은 어디로 갈지 알 수 없지만 뒷장은 자네가 가질 수 있어.' 그가 뭉치를 다시 자기 쪽으로 당깁니다. '이건 내가 갖고 있겠네. 나는 이제 태울 일이 없거든.'", ["뒷장을 따로 만들어 임경수에게 맡겨 두기로 한다", "종이 원본을 정식 증빙으로 심사 서류에 붙인다", "원본은 그대로 두고 의견서에만 집중한다"]],
  ],
  reactionEffects: {
    p2_nightshift: [
      { trust: 11, humanCost: -4, legitimacy: -2, time: -4, capital: -1, fatigue: 3 },
      { legitimacy: 10, trust: 3, time: -5, capital: -3, fatigue: 3 },
      { time: 5, capital: 3, legitimacy: 2, trust: -5, humanCost: 4, fatigue: -2 },
    ],
    p2_ledger: [
      { legitimacy: 12, trust: 4, time: -8, capital: -5, humanCost: 2, fatigue: 4 },
      { trust: 8, legitimacy: 3, time: -3, capital: -2, humanCost: 3, fatigue: 3 },
      { time: 4, capital: 4, trust: -4, legitimacy: -5, humanCost: 3, fatigue: -3 },
    ],
    p2_corridor: [
      { trust: 10, legitimacy: 4, humanCost: -3, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 11, trust: -3, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -4, humanCost: 2, fatigue: -4 },
    ],
  },
  reactionCopy: {
    p2_nightshift: {
      voice: ["조항의 뜻을 처음부터 끝까지, 전화로 다 설명해 준다.", "지점 교육 자료가 설명을 빠뜨렸다는 점을, 문서로 지적한다.", "심사 중인 건이라 말할 수 없다며, 통화를 끝낸다."],
      echo: ["다 설명하면 도윤하가 한참 말이 없다가 묻습니다. '그럼 저는 이걸 팔면 안 되는 거예요?' 당신은 그 질문에 답할 권한이 없습니다.", "지적하면 교육 자료가 한 주 늦게 다시 내려옵니다. 설명은 두 줄 늘고, 판매 목표는 그대로입니다.", "끝내면 전화가 조용히 끊깁니다. 도윤하는 다음 달 그 상품을 4번 창구에서 팔게 됩니다."],
    },
    p2_ledger: {
      voice: ["정식으로 열어 달라고 부탁하고, 자료를 다 넘긴다.", "심사 기한 안에 쓸 수 있게, 비공식 확인만 받는다.", "지금은 열지 말아 달라고 하고, 혼자 끝까지 간다."],
      echo: ["정식으로 열면 심사가 멈추고, 멈춘 심사는 누가 멈추게 했는지로 기억됩니다. 반재욱이 수첩에 당신 이름을 적습니다.", "비공식 확인은 빠릅니다. 대신 그 확인은 어떤 문서에도 근거로 쓸 수 없습니다. 반재욱이 '이건 없던 일입니다'라고 두 번 말합니다.", "열지 말아 달라고 하면 반재욱이 수첩을 덮습니다. '알겠습니다. 대신 이 줄은 안 지웁니다.' 179.6이라는 숫자가 첫 장에 남습니다."],
    },
    p2_corridor: {
      voice: ["뒷장을 따로 만들어, 임경수에게 맡겨 두기로 한다.", "종이 원본을 정식 증빙으로, 심사 서류에 붙인다.", "원본은 그대로 두고, 의견서에만 집중한다."],
      echo: ["맡기면 임경수가 끈을 한 번 더 묶습니다. '자네 글씨는 크군. 늙어서도 읽히겠어.' 그 뒷장은 3년 동안 아무도 찾지 않습니다.", "붙이면 원본이 절차 안으로 들어옵니다. 절차 안에 들어온 종이는 절차가 정한 방식으로 없어질 수도 있습니다.", "집중하면 의견서는 한 시간 빨리 끝납니다. 임경수는 뭉치를 들고 8층으로 돌아가고, 끈은 다시 묶이지 않습니다."],
    },
  },
  reactionMemos: {
    p2_nightshift_reaction: ["강서지점 4번 창구 도윤하 -- 다음 달 캠페인", "교육 자료의 조항 설명: 반쪽"],
    p2_ledger_reaction: ["반재욱 수첩 첫 줄: '2023-0412 -- 179.6'", "정식 조사 개시 여부를 당신에게 먼저 물음"],
    p2_corridor_reaction: ["제7조 초안 종이 원본 -- 끈으로 묶임", "임경수의 조언: 뒷장을 따로 만들어 둘 것"],
  },
  branchPlan: ["p2_site", 0, "p2_branch_supplier", "p2_branch_supplier_follow"],
  branchScenes: {
    // PROLOGUE 02's detour is the supplier. The site visit is the borrower's own
    // floor; the side door is the small factory that is about to sign a three-year
    // contract on the strength of a loan that has not been approved yet.
    p2_branch_supplier: {
      phase: "SIDE DOOR",
      title: "3년 납품 계약",
      speaker: "문성호",
      text: "3번 라인에서 만난 반장이 주소 하나를 적어 줍니다. 문래동의 작은 정밀가공 공장입니다. 직원 일곱 명, 선반 여섯 대, 그리고 내일 오전에 서명할 3년짜리 납품 계약서 한 부. 대표 문성호가 작업복 차림으로 계약서를 펼쳐 보여 줍니다. '플로우온이 은행에서 310억 받으면 자동화 라인을 깐대요. 그 라인 부품을 우리가 만들어요.' 그가 웃습니다. '설비 대출은 이미 승인 났어요. 계약서 보여 드렸더니 바로 되던데요.' 공장 구석에 아직 포장도 뜯지 않은 새 기계가 서 있습니다. 그가 그 기계를 손바닥으로 한 번 쓸고 말합니다. '이거 우리 인생 제일 큰 결정이에요. 은행에서 오셨다니까 하나만 여쭐게요. 그 310억, 나오죠?'",
      memo: ["문래동 가온정밀 -- 직원 7명, 선반 6대", "3년 납품 계약 서명 예정: 다음 날 오전", "설비 대출 이미 실행 -- 담보는 공장", "새 기계 1대 -- 포장 미개봉"],
      triggers: ["protection", "helplessness", "responsibility"],
      choices: [
        { id: "p2_branch_supplier_a", label: "아직 결정되지 않았다고 사실대로 말하고 서명을 미루라고 한다", effect: { trust: 13, humanCost: -6, capital: -5, time: -5, fatigue: 5 }, next: "p2_branch_supplier_follow", cognition: { persistence: 2 } },
        { id: "p2_branch_supplier_b", label: "납품 계약과 설비 대출 서류를 받아 실사 자료에 함께 넣는다", effect: { legitimacy: 12, trust: 4, time: -6, humanCost: 2, fatigue: 4 }, next: "p2_branch_supplier_follow", cognition: { inference: 2 } },
        { id: "p2_branch_supplier_c", label: "심사 중인 건이라 답할 수 없다고 하고 공장을 나온다", effect: { time: 6, capital: 5, trust: -5, humanCost: 4, fatigue: -3 }, next: "p2_branch_supplier_follow", cognition: { risk: 1 } },
      ],
    },
    p2_branch_supplier_follow: {
      phase: "SIDE DOOR",
      title: "떡 두 상자",
      speaker: "문가을",
      text: "공장을 나서는데 골목 끝 떡집에서 문성호의 아내 문가을이 나옵니다. 가게 이름은 아직 없고 간판 자리에 종이만 붙어 있습니다. 그가 비닐봉지 두 개를 내밉니다. '한 상자는 은행 가져가시고, 한 상자는 오늘 드세요. 우리 그이가 은행 분들 온다고 어제부터 말했어요.' 손에 아직 쌀가루가 묻어 있습니다. 그가 공장 쪽을 돌아봅니다. '저 사람 열여덟 살부터 저 일만 했어요. 3년 계약이면 아들 대학까지는 되겠다고, 어제 계산기 두드리면서 좋아하더라고요.' 그리고 당신을 봅니다. 아무것도 의심하지 않는 얼굴입니다. '잘 좀 봐 주세요. 우리는 잘 몰라서, 은행이 된다고 하면 되는 줄 알거든요.'",
      memo: ["문가을 -- 문래동 떡집, 간판 없음", "아들 문하준 -- 초등학생", "가온정밀 문성호: 18세부터 같은 일", "떡 두 상자 -- 하나는 은행 몫"],
      triggers: ["affection", "helplessness", "protection"],
      choices: [
        { id: "p2_branch_supplier_follow_a", label: "떡은 받지 않고 이 계약이 무엇에 걸려 있는지 부부에게 다 말한다", effect: { trust: 14, humanCost: -5, capital: -5, time: -5, fatigue: 6 }, next: "p2_nightshift", cognition: { reframing: 3 } },
        { id: "p2_branch_supplier_follow_b", label: "두 사람의 말을 진술로 받아 적어 실사 자료 맨 앞에 붙인다", effect: { legitimacy: 13, trust: 5, time: -6, humanCost: 2, fatigue: 5 }, next: "p2_nightshift", cognition: { inference: 2 } },
        { id: "p2_branch_supplier_follow_c", label: "떡만 받고 잘 보겠다는 말만 남기고 돌아선다", effect: { time: 5, capital: 6, trust: -4, humanCost: 5, fatigue: -3 }, next: "p2_nightshift", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "p2_start",
    result: "p2_aftershock",
    defaultFree: "p2_route_system",
    // One loan, one week. Like 사건 12 the case is a single line; the split is
    // what the dissent is allowed to say out loud.
    choices: {},
    system: {
      route: "p2_route_system",
      final: "p2_final_system_route",
      title: "47건의 같은 문장",
      speaker: "임경수",
      text: "준비된 보기 밖의 문장을 쓰자 임경수가 8층 기록 보관실 문을 열어 줍니다. 형광등이 두 번 깜박이고 끈으로 묶은 종이 뭉치들이 선반 스물두 칸을 채우고 있습니다. 그가 지난 3년치를 꺼내 바닥에 늘어놓습니다. 제7조와 토씨 하나 다르지 않은 문장이 들어간 계약이 47건입니다. 그중 9건은 계약하던 날의 여유가 1%포인트 아래였고, 아홉 건 전부 서류 맨 위에 '성장 전략 과제'라는 붉은 도장이 찍혀 있습니다. 임경수가 무릎을 짚고 일어납니다. '자네는 이 조항이 회수하려고 있는 줄 알았지. 아니야. 이건 승인하려고 있는 거야. 위험한 회사에 돈을 주면서, 위험할 때 뺄 수 있다고 써 두면 승인이 되거든.'",
      memo: ["같은 문장이 들어간 계약 47건 (3년치)", "계약 시점 여유 1%포인트 미만 -- 9건", "9건 전부 '성장 전략 과제' 분류"],
      routeChoices: [
        ["p2_route_system_annex", "47건 목록을 의견서 부록으로 그대로 붙인다", { legitimacy: 13, trust: 3, capital: -6, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["p2_route_system_nine", "여유 1%포인트 아래 9건의 담당자들을 먼저 찾아간다", { trust: 11, legitimacy: 4, humanCost: -5, capital: -5, time: -8, fatigue: 6 }, { reframing: 2 }],
        ["p2_route_system_keep", "목록은 접어 두고 내 건 하나에만 쓴다", { time: 7, capital: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "여유가 1%포인트 아래면 조항 자체를 못 쓰게 하자고 제안한다", { legitimacy: 14, trust: 5, capital: -7, humanCost: -3, time: -2, fatigue: 7 }, { reframing: 3 }],
      ["b", "목록은 두고 2023-0412 한 건만 막는다", { capital: 8, time: 6, trust: -4, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "9건 담당자들의 이름을 모아 같은 의견서에 함께 올린다", { legitimacy: 9, trust: 10, capital: -6, time: -8, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "p2_evidence_turn",
    result: "p2_aftershock",
    sourceRoutes: ["p2_site", "p2_model", "p2_draft", "p2_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 제7조 초안 옆에 놓고, 이 조항을 누가 요청했는지 맞춰 본다.",
    entryEcho: "단서를 대면 초안의 회람 기록이 열립니다. 조항을 쓴 손과 조항을 시킨 손이 다를 수 있습니다.",
    title: "회람 확인란 여섯 줄",
    speaker: "반재욱",
    text: "단서를 맞추자 2022년 11월 제7조 초안의 회람 기록이 열립니다. 조항을 만들어 달라고 요청한 문서는 팀 안에서 나오지 않았습니다. 그룹전략실에서 내려온 한 장짜리 요청서이고, 사유 칸에는 이렇게 적혀 있습니다. '성장 과제 대출의 심사 부담을 낮출 것. 회수 조건을 두면 승인 근거가 생김.' 그 아래 회람 확인란에 사번 여섯 개가 찍혀 있습니다. 윤상혁, 한서윤, 오진우, 그리고 네 번째 줄부터는 수습 세 명입니다. 마지막 줄은 당신 사번이고, 확인 시각은 2022년 11월 14일 18시 02분입니다. 반재욱이 수첩을 덮습니다. '반대 의견서를 쓰시려는 분 이름이, 그 조항 회람에 이미 있습니다. 읽고 눌렀든 안 읽고 눌렀든 기록은 같습니다.'",
    memo: ["조항 요청: 그룹전략실 한 장짜리 요청서", "사유: '회수 조건을 두면 승인 근거가 생김'", "회람 확인란 여섯 줄 -- 마지막 줄에 당신 사번"],
    triggers: ["system", "manipulation", "selfAwareness"],
    entryEffect: { legitimacy: 6, trust: 4, time: -4, capital: -2, fatigue: 4 },
    choices: [
      ["p2_evidence_turn_attach", "요청서와 회람 기록을 의견서 부록으로 그대로 붙인다", { legitimacy: 14, trust: 4, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["p2_evidence_turn_hold", "회람 기록은 쥐고 있다가 심사위원회에서 처음 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["p2_evidence_turn_own", "내 사번이 거기 있다는 사실부터 의견서 첫 줄에 적는다", { trust: 12, legitimacy: 7, capital: -6, humanCost: -4, time: -3, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "p2_branch_supplier",
    systemNext: "p2_route_system",
    evidenceNext: "p2_evidence_turn",
    routeLabel: "지난가을 강서지점에서 만난 사람들과 이번 현장 순서를 맞춰 본다",
    systemLabel: "직전 자유응답 문장이 제7조 초안에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 조항을 누가 요청했는지 연다",
  },
  openingRoutes: {
    p1_after_credit: "p2_start_credit",
    p1_after_record: "p2_start_record",
    p1_after_speed: "p2_start_speed",
  },
  openingCopy: {
    p2_start_credit: ["빚을 갚으러 온 사수", "오진우", "지난가을 수습 딱지를 떼면서 당신은 공을 사수에게 돌렸습니다. 보고서 표지의 이름은 오진우였고, 팀장은 그 이름을 그대로 읽었습니다. 다섯 달이 지난 4월 12일 아침, 대출번호 2023-0412 서류철이 당신 책상에 놓이자 오진우가 자기 자리에서 먼저 일어납니다. 새벽 배송 물류 플랫폼 플로우온, 310억 원, 보고된 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%입니다. 그가 서류철을 한 번 넘겨 보고 말합니다. '이거 원래 제 건이었어요. 제가 팀장님한테 당신 이름을 넣자고 했고요.' 그리고 목소리를 낮춥니다. '갚는 거예요. 근데 갚는 방법이 이것밖에 없어서, 좀 미안하네요.'", ["2023-0412 심사 담당: 당신 -- 오진우의 추천", "플로우온 운영자금 310억 · 보고 부채비율 179.6%", "윤상혁: '그룹 전략 과제' -- 심사위원회 4월 26일"]],
    p2_start_record: ["그런 사람으로 알려진 뒤", "한서윤", "지난가을 당신은 본 것을 자기 이름으로 남겼습니다. 그 한 장 때문에 팀은 당신을 '그런 사람'으로 분류했고, 분류는 편리해서 아무도 다시 확인하지 않았습니다. 4월 12일 아침, 대출번호 2023-0412 서류철이 당신 책상에 놓입니다. 플로우온, 310억 원, 보고된 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%, 심사 담당 칸에 인쇄된 당신 이름. 한서윤 과장이 지나가다 서류철 모서리를 손끝으로 두 번 두드립니다. '팀장님이 이 건은 꼼꼼한 사람이 봐야 한다고 하셨어요.' 그가 잠깐 멈춥니다. '꼼꼼한 사람한테 맡기는 건 두 가지 뜻이에요. 잘 보라는 뜻이거나, 잘 봐도 바뀌는 게 없다는 걸 보여 주려는 뜻이거나.'", ["2023-0412 심사 담당: 당신 -- 팀장 지명", "지난가을 기록 이후 팀 내 분류: '꼼꼼한 사람'", "플로우온 310억 · 보고 부채비율 179.6%"]],
    p2_start_speed: ["속도가 남긴 것", "윤상혁", "지난가을 당신은 속도를 택했습니다. 하루를 아꼈고, 그 하루가 당신의 평판이 됐습니다. 4월 12일 아침 여덟 시 사십 분, 다른 사람들보다 스무 분 먼저 나온 심사실에 서류철이 이미 놓여 있습니다. 대출번호 2023-0412, 플로우온, 310억 원, 보고된 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%. 윤상혁 팀장이 뒤에서 걸어 들어오며 말합니다. '자네가 제일 먼저 나와 있을 줄 알았네.' 그가 서류철 위에 일정표를 얹습니다. 심사위원회 4월 26일, 의견서 4월 18일. 원래 2주짜리 일정이 열흘로 줄어 있습니다. '빠른 사람한테는 빠른 일정을 주는 게 맞지. 그게 대접이야.'", ["2023-0412 심사 담당: 당신 -- 일정 열흘로 단축", "의견서 기한 4월 18일 · 심사위원회 4월 26일", "플로우온 310억 · 보고 부채비율 179.6%"]],
  },
  openingSignatures: {
    p2_start_credit: {
      label: "왜 이 건을 나에게 넘겼는지 오진우에게 끝까지 듣는다",
      effect: { trust: 13, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "왜 이 건을 나에게 넘겼는지, 오진우에게 끝까지 듣는다.",
      echo: "끝까지 들으면 오진우가 마지막에 한 줄을 덧붙입니다. '팀장님이 젊은 사람 이름이 좋다고 하셨어요.' 그게 추천의 전부였습니다.",
    },
    p2_start_record: {
      label: "'그런 사람'이라는 분류를 이번에는 먼저 입 밖에 낸다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "'그런 사람'이라는 분류를, 이번에는 먼저 입 밖에 낸다.",
      echo: "먼저 말하면 한서윤이 웃지 않고 답합니다. '저도 그렇게 불린 적 있어요. 12년 전에요.' 그리고 더 설명하지 않습니다.",
    },
    p2_start_speed: {
      label: "열흘로 줄어든 일정이 무엇을 못 보게 하는지 팀장에게 짚어 준다",
      effect: { legitimacy: 11, trust: 5, humanCost: 3, time: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "열흘로 줄어든 일정이 무엇을 못 보게 하는지, 팀장에게 짚어 준다.",
      echo: "짚어 주면 윤상혁이 일정표를 다시 봅니다. 그리고 하루를 돌려줍니다. '자네 말이 맞네. 하루면 되겠지?' 이틀은 끝내 돌아오지 않습니다.",
    },
  },
  voiceLines: {
    // PROLOGUE 02. Every line is said inside a week where nothing has gone
    // wrong yet, so none of them is allowed to sound like a warning from later.
    p2_start_team: "팀원들을 모아, 이 건을 어떻게 볼지 먼저 나눈다.",
    p2_start_scope: "'그룹 전략 과제'라는 말의 범위를, 문서로 확인해 달라고 한다.",
    p2_start_accept: "기한을 그대로 받고, 오늘 저녁 실사 일정부터 잡는다.",
    p2_site_floor: "안내 동선을 벗어나, 3번 라인 사람들에게 직접 묻는다.",
    p2_site_papers: "창고 임차 계약과 장부를, 현장에서 한 장씩 대조한다.",
    p2_site_tour: "준비된 동선대로 돌고, 일정보다 일찍 본점으로 돌아온다.",
    p2_branch_supplier_a: "아직 결정되지 않았다고 사실대로 말하고, 서명을 미루라고 한다.",
    p2_branch_supplier_b: "납품 계약과 설비 대출 서류를 받아, 실사 자료에 함께 넣는다.",
    p2_branch_supplier_c: "심사 중인 건이라 답할 수 없다고 하고, 공장을 나온다.",
    p2_branch_supplier_follow_a: "떡은 받지 않고, 이 계약이 무엇에 걸려 있는지 부부에게 다 말한다.",
    p2_branch_supplier_follow_b: "두 사람의 말을 진술로 받아 적어, 실사 자료 맨 앞에 붙인다.",
    p2_branch_supplier_follow_c: "떡만 받고, 잘 보겠다는 말만 남기고 돌아선다.",
    p2_model_ask: "회사 재무팀에, 왜 시점을 당겼는지 직접 묻기로 한다.",
    p2_model_rebuild: "월별 원자료로 계산 과정을 처음부터 다시 세워, 문서로 남긴다.",
    p2_model_report: "보고치 179.6%를 그대로 쓰고, 차이만 각주로 달아 둔다.",
    p2_draft_open: "조항 이야기를, 팀 회의에 정식 안건으로 올리자고 한다.",
    p2_draft_trace: "조항 초안이 누구 요청으로 만들어졌는지, 기록부터 뽑는다.",
    p2_draft_split: "조항은 건드리지 않고, 숫자 문제로만 의견서를 좁힌다.",
    p2_final_people: "현장에서 만난 사람들의 말을, 의견서 맨 앞에 놓는다.",
    p2_final_clause: "제7조를 만든 곳이 우리 팀이라는 사실을, 그대로 적는다.",
    p2_final_margin: "0.4%포인트 하나만 남기고, 나머지는 전부 덜어 낸다.",
    p2_after_alone: "작성자 칸에 내 이름 하나만 적고, 오늘 오전에 낸다.",
    p2_after_shared: "사흘을 더 써서 동료들의 서명을 모아, 공동 의견으로 낸다.",
    p2_after_soften: "표현을 눅여, 조건부 승인 의견으로 바꿔 낸다.",
    p2_route_system_annex: "47건 목록을, 의견서 부록으로 그대로 붙인다.",
    p2_route_system_nine: "여유 1%포인트 아래 9건의 담당자들을, 먼저 찾아간다.",
    p2_route_system_keep: "목록은 접어 두고, 내 건 하나에만 쓴다.",
    p2_final_system_route_a: "여유가 1%포인트 아래면, 조항 자체를 못 쓰게 하자고 제안한다.",
    p2_final_system_route_b: "목록은 두고, 2023-0412 한 건만 막는다.",
    p2_final_system_route_c: "9건 담당자들의 이름을 모아, 같은 의견서에 함께 올린다.",
    p2_evidence_turn_attach: "요청서와 회람 기록을, 의견서 부록으로 그대로 붙인다.",
    p2_evidence_turn_hold: "회람 기록은 쥐고 있다가, 심사위원회에서 처음 꺼낸다.",
    p2_evidence_turn_own: "내 사번이 거기 있다는 사실부터, 의견서 첫 줄에 적는다.",
  },
  echoReplies: {
    // PROLOGUE 02.
    p2_start_team: "모으면 여섯 명이 30분을 냅니다. 다섯 명이 '좋은 회사'라고 하고, 오진우 혼자 '기한이 이상하다'고 합니다.",
    p2_start_scope: "요청하면 답이 다음 날 옵니다. 한 줄입니다. '그룹 성장 전략 과제 대상 -- 심사 기준은 통상과 동일함.' 무엇이 다른지는 끝내 적혀 있지 않습니다.",
    p2_start_accept: "곧장 잡으면 실사가 하루 앞당겨집니다. 그 하루로 당신은 야간조 교대를 보게 됩니다. 일정표에는 없던 시간입니다.",
    p2_site_floor: "동선을 벗어나면 권태호가 막지 않습니다. 오히려 따라와 3번 라인 반장 이름을 대신 불러 줍니다. 그는 숨길 게 있는 사람처럼 굴지 않습니다.",
    p2_site_papers: "대조하면 창고 임차료가 장부보다 월 1억 2천 더 나가고 있습니다. 차이는 12월에 시작됐습니다.",
    p2_site_tour: "동선대로 돌면 세 시간 만에 끝납니다. 돌아오는 차 안에서 당신은 야간조를 한 번도 못 봤다는 걸 깨닫습니다.",
    p2_branch_supplier_a: "말하면 문성호가 웃음을 거둡니다. '그럼 저희는 어떻게 해요? 기계는 벌써 왔는데요.' 미루라는 말에는 뒤가 없습니다.",
    p2_branch_supplier_b: "받아 오면 실사 자료가 두 배가 됩니다. 협력사 서류가 은행 심사에 들어간 건 이 팀에서 처음입니다.",
    p2_branch_supplier_c: "나오면 문성호가 문밖까지 따라 나와 인사합니다. 다음 날 오전 열 시, 그는 계약서에 서명합니다.",
    p2_branch_supplier_follow_a: "다 말하면 문가을이 떡 봉지를 도로 가져갑니다. 그리고 한참 뒤에 다시 하나를 내밉니다. '그래도 이건 드세요. 오늘 만든 거라 내일이면 굳어요.'",
    p2_branch_supplier_follow_b: "진술을 받으면 문성호가 자기 이름을 두 번 씁니다. 한 번은 틀려서, 한 번은 똑바로. 그 종이가 3년 뒤 유일한 기록이 됩니다.",
    p2_branch_supplier_follow_c: "돌아서면 골목 끝까지 떡 냄새가 따라옵니다. 문가을은 다음 날 간판을 답니다. 가게 이름은 '가을떡방'입니다.",
    p2_model_ask: "직접 물으면 재무책임자가 숨기지 않고 답합니다. 숨기지 않는다는 것이 가장 이상한 부분입니다.",
    p2_model_rebuild: "다시 세우면 계산 과정이 여섯 장이 됩니다. 여섯 장 어디에도 '조작'이라는 단어를 쓸 근거는 없습니다.",
    p2_model_report: "각주로 달면 의견서가 두 장 짧아집니다. 읽는 사람은 본문을 읽고, 각주는 나중에 찾는 사람만 읽습니다.",
    p2_draft_open: "안건으로 올리면 회의가 40분 만에 끝납니다. 결론은 '조항은 표준이므로 개별 건에서 다루지 않는다'입니다.",
    p2_draft_trace: "기록을 뽑으면 초안 파일이 나옵니다. 만든 사람은 이 팀이고, 만들라고 한 문서는 이 팀 밖에 있습니다.",
    p2_draft_split: "좁히면 의견서가 단정해집니다. 그리고 반박도 단정해집니다. '숫자 차이는 회계법인이 적정 의견을 냈습니다.' 한 줄이면 끝납니다.",
    p2_final_people: "사람 이야기를 앞에 놓으면 문서가 읽힙니다. 읽히는 문서는 인용되기도 하고, 감정적이라고 불리기도 합니다.",
    p2_final_clause: "조항을 적으면 이 방 전체가 대상이 됩니다. 심사위원회에 앉는 사람 중 셋이 그 회람 확인란에 있습니다.",
    p2_final_margin: "0.4%포인트만 남기면 의견서는 두 장이 됩니다. 두 장짜리 문서는 반려당해도 아무도 놀라지 않습니다.",
    p2_after_alone: "혼자 내면 접수 시각이 4월 19일 오전 10시 12분으로 찍힙니다. 작성자 칸에 이름이 하나뿐인 문서는, 지우기도 한 번이면 됩니다.",
    p2_after_shared: "모으면 금요일까지 갑니다. 셋 중 둘이 목요일 밤에 이름을 뺍니다. 한 사람은 아이가 아프고, 한 사람은 이유를 말하지 않습니다.",
    p2_after_soften: "눅이면 문서는 살아남습니다. '조건 충족 시 승인 가능'이라는 제목 아래에서, 반대였다는 사실은 셋째 문단에 한 줄로 남습니다.",
    p2_route_system_annex: "붙이면 의견서가 서른 장이 됩니다. 심사위원회 배포 자료는 열 장으로 요약되고, 요약하는 사람은 당신이 아닙니다.",
    p2_route_system_nine: "찾아가면 아홉 명 중 넷이 만나 줍니다. 그중 둘은 자기 건도 그랬다는 걸 처음 압니다. 나머지 다섯은 전화를 받지 않습니다.",
    p2_route_system_keep: "접어 두면 47건은 서고에 그대로 있습니다. 임경수가 끈을 다시 묶으며 '언젠가 누가 오겠지'라고 합니다.",
    p2_final_system_route_a: "기준이 생기면 다음 계약부터 조항이 막힙니다. 이번 계약은 아직 기준보다 먼저 만들어졌습니다.",
    p2_final_system_route_b: "한 건만 막으면 나머지 마흔여섯 건은 오늘도 같은 문장 위에 서 있습니다.",
    p2_final_system_route_c: "이름을 모으면 아홉 사람이 서로를 처음 봅니다. 그 의견서를 받을 부서는 그 조항을 만든 부서입니다.",
    p2_evidence_turn_attach: "붙이면 요청서가 공식 서류가 됩니다. 그룹전략실은 그날부터 이 심사를 자기 일로 여기게 됩니다.",
    p2_evidence_turn_hold: "쥐고 있으면 26일 아침에 가장 강한 패가 됩니다. 그 사이 요청서 원본이 어디 있는지는 당신도 모릅니다.",
    p2_evidence_turn_own: "첫 줄에 적으면 읽는 사람이 먼저 안심합니다. 그리고 두 번째 줄부터 의심하지 않고 읽습니다. 값은 당신 이름이 치릅니다.",
  },
  characterProfiles: {
    권태호: {
      role: "플로우온 창업주 · 8년차 · 51세",
      stance: "성장 · 사람 · 확신",
      job: "숫자가 아니라 현장을 먼저 보여 준다. 그가 보여 주는 현장은 전부 사실이다.",
      appearance: "회사 로고가 박힌 얇은 점퍼, 안전화, 반장들 이름이 빼곡한 손바닥만 한 수첩.",
      thought: "여덟 해 동안 한 번도 거짓말한 적 없다. 장부는 재무팀이 보고, 나는 사람을 본다.",
      gesture: "권태호는 대답하기 전에 컨베이어 소리가 잦아드는 쪽으로 몇 걸음 걸어간다. 조용한 데서 말하려는 버릇이다.",
      voice: "회의실 말투가 아니라 현장 말투로, 숫자를 물으면 사람 이야기로 답한다.",
      line: "저기 3번 라인부터 보세요. 저기 사람들이 우리 회사예요.",
    },
    배성준: {
      role: "플로우온 재무책임자 · 권도현의 고모부 · 47세",
      stance: "관행 · 방어 · 계산",
      job: "회사가 살아 있게 숫자의 시점을 옮긴다. 옮겼다는 사실을 숨기지 않는다.",
      appearance: "소매를 두 번 접은 셔츠, 화면 두 대에 띄워 둔 같은 장부, 책상에 세워 둔 아이 사진.",
      thought: "180%는 은행이 그은 선이고, 나는 선 아래로 가는 길을 찾는 사람이다. 그게 내 일이다.",
      gesture: "배성준은 곤란한 질문을 받으면 송화구를 손으로 막고 2초를 센다. 그 2초 뒤에는 늘 솔직하게 말한다.",
      voice: "변명하지 않고 설명한다. 설명이 길어질수록 목소리가 낮아진다.",
      line: "180%가 어디서 왔는지는 저도 몰라요. 은행에서 주신 계약서에 있길래 거기 맞춘 겁니다.",
    },
  },
  setting: { place: "KD은행 본점 6층 기업금융전략팀 심사실", clock: "2023년 4월 12일 수요일 · 09시" },
  sceneContext: {
    p2_start: {
      place: "KD은행 본점 6층 기업금융전략팀 심사실",
      clock: "2023년 4월 12일 수요일 · 09시",
      question: "첫 단독 심사로 310억 대출 서류철이 올라왔고, 승인은 이미 정해진 분위기입니다. 무엇부터 하겠습니까?",
      lead: "수습 딱지를 뗀 지 다섯 달 만에, 대출번호 2023-0412 서류철이 당신 책상에 놓입니다.",
    },
    p2_start_credit: {
      place: "KD은행 본점 6층 기업금융전략팀 심사실",
      clock: "2023년 4월 12일 수요일 · 09시",
      question: "사수가 자기 건을 당신 이름으로 넘겼습니다. 이 서류철을 어떻게 받겠습니까?",
      lead: "지난가을 공을 돌려받은 사람이, 이번에는 자기 건을 당신 쪽으로 밀어 놓았습니다.",
    },
    p2_start_record: {
      place: "KD은행 본점 6층 기업금융전략팀 심사실",
      clock: "2023년 4월 12일 수요일 · 09시",
      question: "팀은 당신을 '꼼꼼한 사람'으로 분류해 두고 이 건을 맡겼습니다. 무엇부터 하겠습니까?",
      lead: "지난가을 자기 이름으로 남긴 한 장 뒤로, 팀의 시선이 먼저 도착해 있습니다.",
    },
    p2_start_speed: {
      place: "KD은행 본점 6층 기업금융전략팀 심사실",
      clock: "2023년 4월 12일 수요일 · 08시 40분",
      question: "빠르다는 평판 때문에 2주짜리 일정이 열흘로 줄었습니다. 이 일정을 어떻게 하겠습니까?",
      lead: "남들보다 스무 분 먼저 나온 심사실에, 서류철이 이미 놓여 있습니다.",
    },
    p2_site: {
      place: "플로우온 본사 · 김포 제2풀필먼트센터",
      clock: "2023년 4월 13일 목요일 · 14시",
      question: "창업주가 직접 안내하는 동선 위에서 실사를 해야 합니다. 무엇을 먼저 보겠습니까?",
      lead: "컨베이어 옆을 걸으며 설명하는 창업주가, 지나가는 반장들의 이름을 한 명씩 부릅니다.",
    },
    p2_branch_supplier: {
      place: "문래동 가온정밀 · 작업장",
      clock: "2023년 4월 13일 목요일 · 17시",
      question: "협력사 대표가 내일 오전 3년 계약에 서명합니다. 이 자리에서 무엇을 말하겠습니까?",
    },
    p2_branch_supplier_follow: {
      place: "문래동 골목 · 간판 없는 떡집 앞",
      clock: "2023년 4월 13일 목요일 · 18시",
      question: "아무것도 의심하지 않는 사람이 떡 두 상자를 내밉니다. 어떻게 하겠습니까?",
    },
    p2_nightshift: {
      place: "김포 제2센터 · 3번 라인 휴게실",
      clock: "2023년 4월 14일 금요일 · 04시",
      question: "야간조 절반이 문서에 없는 약속을 믿고 2년을 기다렸습니다. 무엇이라 답하겠습니까?",
    },
    p2_nightshift_reaction: {
      place: "김포에서 본점으로 가는 차 안",
      clock: "2023년 4월 14일 금요일 · 07시",
      question: "강서지점 창구 행원이 다음 달 팔 상품의 조항을 묻습니다. 어디까지 설명하겠습니까?",
    },
    p2_model: {
      place: "본점 6층 심사실 · 불 꺼진 사무실",
      clock: "2023년 4월 14일 금요일 · 23시",
      question: "다시 세운 부채비율은 184.2%이고, 기준선까지는 0.4%포인트입니다. 이 숫자를 어떻게 쓰겠습니까?",
      lead: "장부를 월별로 갈라 놓자, 12월에 몰려 있던 268억이 원래 자리로 돌아갑니다.",
    },
    p2_ledger: {
      place: "본점 6층 심사실 · 전화기 앞",
      clock: "2023년 4월 15일 토요일 · 10시",
      question: "재무책임자가 시점을 당겼다고 먼저 인정합니다. 이 인정을 어떻게 다루겠습니까?",
    },
    p2_ledger_reaction: {
      place: "본점 6층 심사실 · 창가 자리",
      clock: "2023년 4월 15일 토요일 · 15시",
      question: "감사팀이 정식으로 열지 말지를 당신에게 먼저 묻습니다. 어떻게 답하겠습니까?",
    },
    p2_draft: {
      place: "본점 6층 심사실 · 팀 공유 폴더",
      clock: "2023년 4월 17일 월요일 · 11시",
      question: "제7조를 써 넣은 곳이 당신의 팀이라는 사실을 알게 됐습니다. 이 사실을 어떻게 하겠습니까?",
      lead: "계약서 초안의 출처를 따라가다, 화면은 자기 팀 공유 폴더에서 멈춥니다.",
    },
    p2_corridor: {
      place: "본점 6층과 7층 사이 비상계단 층계참",
      clock: "2023년 4월 17일 월요일 · 19시",
      question: "팀장이 서명란이 전부 빈 승인 문서를 보여 줍니다. 이 자리에서 무엇을 하겠습니까?",
    },
    p2_corridor_reaction: {
      place: "본점 8층 복도 · 기업대출심사팀 앞",
      clock: "2023년 4월 17일 월요일 · 20시",
      question: "정년 1년 전인 심사팀장이 조항 초안의 종이 원본을 보여 줍니다. 어떻게 하겠습니까?",
    },
    p2_route_system: {
      place: "본점 8층 기록 보관실",
      clock: "2023년 4월 17일 월요일",
      question: "같은 문장이 들어간 계약 47건 중 9건이 1%포인트 아래에 서 있었습니다. 이 목록을 어떻게 하겠습니까?",
    },
    p2_final_system_route: {
      place: "본점 8층 기록 보관실 · 선반 사이",
      clock: "2023년 4월 17일 월요일 · 22시",
      question: "이 조항이 쓰이는 방식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    p2_evidence_turn: {
      place: "본점 6층 심사실 · 문서 이력 화면",
      clock: "2023년 4월 18일 화요일 · 09시",
      question: "조항 초안 회람 확인란 마지막 줄에 당신 사번이 있습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    p2_final: {
      place: "본점 6층 심사실 · 닫힌 문 안",
      clock: "2023년 4월 18일 화요일 · 17시",
      question: "제출까지 한 시간, 세 뭉치 중 한 뭉치만 의견서에 들어갑니다. 무엇을 적겠습니까?",
      lead: "책상 위에는 사람들의 말과 계산 과정과 조항 메모가 나란히 놓여 있습니다.",
    },
    p2_aftershock: {
      place: "본점 6층 심사실 · 프린터 앞",
      clock: "2023년 4월 19일 수요일 · 08시",
      question: "열한 장을 다 썼고, 남은 칸은 작성자 칸 하나입니다. 어떤 형태로 내겠습니까?",
    },
  },
  clue: {
    id: "p2-clause-circulation",
    title: "제7조 회람 명단",
    text: "부채비율 180% 기준선을 만든 계약서 제7조는 그룹전략실의 한 장짜리 요청서에서 시작됐고, 사유 칸에는 '회수 조건을 두면 승인 근거가 생김'이라고 적혀 있었습니다. 초안 회람 확인란 여섯 줄의 마지막은 수습이던 당신의 사번입니다.",
  },
  outcomes: {
    p2_after_alone: { tag: "혼자 낸 결말", title: "작성자 칸에 이름 하나를 적고 냈다", text: "2023년 4월 19일 오전 10시 12분, 열한 장짜리 반대 의견서가 접수됩니다. 작성자는 한 사람이고, 그래서 이 문서의 수명은 한 사람에게 달려 있습니다." },
    p2_after_shared: { tag: "함께 낸 결말", title: "서명을 모으는 데 사흘을 썼다", text: "공동 의견서는 금요일에 접수됩니다. 처음 이름을 올리겠다던 세 명 중 둘이 목요일 밤에 빠졌고, 남은 이름은 둘입니다." },
    p2_after_soften: { tag: "누그러뜨린 결말", title: "조건부 승인 의견으로 바꿔 냈다", text: "문서는 반려당하지 않습니다. 제목은 '조건 충족 시 승인 가능'이고, 반대였다는 사실은 셋째 문단의 한 줄로 남습니다." },
  },
  carryovers: {
    p2_after_alone: { legitimacy: 13, trust: -4, humanCost: 4 },
    p2_after_shared: { trust: 11, legitimacy: 6, fatigue: 6 },
    p2_after_soften: { capital: 9, legitimacy: -7, trust: 3 },
  },
  continuityChallenges: {
    p1_after_credit: { id: "protect-trust", title: "사수가 갚으려는 빚 지켜 내기", text: "지난가을 공을 돌려받은 오진우가 이번 건을 당신 이름으로 올렸습니다. 그 호의를 빚으로 만들지 않으려면, 그가 왜 그랬는지 먼저 듣는 선택을 찾아야 보너스가 열립니다." },
    p1_after_record: { id: "use-reframe", title: "'그런 사람'이라는 분류로 판 뒤집기", text: "자기 이름으로 기록을 남긴 뒤 팀은 당신을 꼼꼼한 사람으로 분류해 두었습니다. 그 분류를 숨기지 말고 먼저 꺼내, 이번 심사의 모양을 다시 짜야 합니다." },
    p1_after_speed: { id: "repair-legitimacy", title: "줄어든 열흘의 공정함 회복하기", text: "빠르다는 평판 때문에 2주짜리 일정이 열흘로 줄었습니다. 그 일정이 무엇을 못 보게 하는지 팀장에게 짚어 주는 선택을 찾아야 합니다." },
  },
};
