/**
 * CASE 43 -- the board meeting, where the group finally votes to remove 윤상혁
 * and the question is whether removing him is the end of the story or the
 * way the story is ended.
 *
 * Act 8 opens the week after 경포. The KD금융그룹 board puts a motion on the
 * table to remove 윤상혁 as a 사내이사 and call an extraordinary shareholders'
 * meeting. Eight people vote: 회장 서도경 and seven outside directors. The
 * analyst has spent five months as 윤상혁's own subordinate at KD캐피탈, and now
 * walks into the board as a witness. 권도현 turns the seven outside directors
 * into seven one-page profit-and-loss sheets; 표세린 refuses to call the removal
 * reform unless the 2023 board that received the dissent is on the record too;
 * 백아린, sued by her former employer since her whistleblowing report, holds
 * the page that shows the current board chair 연태경 initialled "dissent: handled"
 * in April 2023.
 *
 * The case is the season's tail-cutting argument made concrete. 서도경 votes last
 * and names his price: one closing line in the resolution declaring that the
 * responsibility for 2023-0412 has been fully established. The evidence turn
 * finds the press office had already written both results, pass and fail, with
 * the same last paragraph. Anger at the pre-written ending, laughter at a
 * decimal-place duel and eighty cup noodles stopped at a security gate, grief
 * in a professor's father and in 윤상혁's daughter waiting in the lobby for
 * someone other than him, and joy when the 1주 모임 fill the lobby again. The
 * motion passes 5 to 3; the first-instance verdict is days away, which is where
 * 사건 44 begins.
 */
export const case43Nodes = {
  c43_start: {
    phase: "CASE 43 BRIEFING",
    title: "안건 제1호",
    speaker: "한서윤",
    text:
      "KD캐피탈 위험관리부 모니터마다 같은 공지가 떠 있습니다. 9월 7일 월요일 14시, KD금융그룹 이사회. 안건 제1호는 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 해임안(이사를 자리에서 물러나게 하는 안건) 상정과 임시 주주총회(주주들이 모여 회사의 큰일을 표로 정하는 회의) 소집의 건입니다. 여덟 층 위가 그의 대표이사실입니다. 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 다섯 달째인 한서윤이 전화를 겁니다. '표를 던지는 사람은 여덟이에요. 회장님, 그리고 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 일곱 명. 윤상혁은 당사자라 빠지고요.' 종이 넘기는 소리가 납니다. '설명서 마지막 줄은 관련 위험 자산 정리 완료, 마흔일곱 곳이에요. 그런데 2023년 이사회 얘기는 한 줄도 없어요. 한 사람만 나가면 끝나는 거면, 그때 반려에 서명한 저 같은 사람은 없던 일이 되는 거예요. 그게 다행인지 모르겠어요.'",
    memo: [
      "이사회: 9월 7일(월) 14시 · 본사 33층",
      "안건 제1호: 사내이사 윤상혁 해임안 · 임시 주주총회 소집",
      "표결 8명 -- 서도경 회장 1 · 사외이사 7 · 가결 5표",
      "설명서 마지막 줄: '관련 위험 자산 정리 완료' 47곳 · 2023년 언급 0줄",
    ],
    triggers: ["injustice", "responsibility", "choice"],
    choices: [
      {
        id: "c43_start_arin",
        label: "백아린부터 찾아가 증언 자료를 함께 정리한다",
        effect: { trust: 11, humanCost: -4, time: -5, capital: -3, fatigue: 5 },
        next: "c43_ledger",
        cognition: { persistence: 2 },
      },
      {
        id: "c43_start_charter",
        label: "이사회 규정과 안건 설명서부터 조항별로 따진다",
        effect: { legitimacy: 11, time: -4, trust: -2, humanCost: 3, fatigue: 3 },
        next: "c43_ledger",
        cognition: { inference: 2 },
      },
      {
        id: "c43_start_count",
        label: "사외이사 일곱 명의 표부터 빠르게 셈한다",
        effect: { capital: 7, time: 6, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c43_ledger",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c43_ledger",
      },
    ],
  },
  c43_ledger: {
    phase: "BOARD MATH",
    title: "일곱 장의 손익계산서",
    speaker: "권도현",
    text:
      "회기동 헌책방 1층 탁자에 A4 일곱 장이 나란히 놓입니다. 권도현이 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 한 명당 한 장씩 손익계산서를 만들어 왔습니다. 왼쪽 칸은 찬성하면 그 사람이 얻는 것, 오른쪽 칸은 잃는 것, 맨 아래는 찬성 확률입니다. 오진우가 휴대폰을 들이밉니다. '저는 은채원 교수를 0.6으로 봤는데요.' '근거는요?' '감이요.' 권도현이 말없이 그 칸에 줄을 긋습니다. 결론은 이렇습니다. 확실한 찬성 셋, 반대 유력 둘. 남는 건 막내 사외이사 은채원 0.48, 이사회 의장 연태경 0.50, 그리고 비워 둔 서도경 회장의 칸입니다. '회장님은 계산이 안 됩니다. 변수가 아니라 상수라서요.' 그가 연태경의 종이를 뒤집습니다. 뒷면에 연필로 한 줄이 적혀 있습니다. '2023년 4월 이사회 참석 -- 그때도 사외이사.'",
    memo: [
      "사외이사 7명 · 1인당 손익계산서 1장",
      "확실한 찬성 3 · 반대 유력 2 (해온파트너스 자문위원 출신)",
      "남은 칸: 은채원 0.48 · 의장 연태경 0.50 · 회장 1표",
      "연태경: 2023년 4월 이사회에도 참석",
    ],
    triggers: ["competition", "order", "injustice"],
    choices: [
      {
        id: "c43_ledger_visit",
        label: "막내 사외이사 은채원을 찾아가 피해자들의 이야기를 전한다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -4, capital: -3, fatigue: 5 },
        next: "c43_advisor",
        cognition: { persistence: 2 },
      },
      {
        id: "c43_ledger_conflict",
        label: "반대 유력 두 사람의 자문 이력을 이해충돌로 공식 제기한다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 3, fatigue: 4 },
        next: "c43_advisor",
        cognition: { inference: 2 },
      },
      {
        id: "c43_ledger_target",
        label: "확률표대로 표가 될 두 사람만 골라 공략한다",
        effect: { capital: 6, time: 5, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -3 },
        next: "c43_advisor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c43_advisor",
      },
    ],
  },
  c43_advisor: {
    phase: "THE ADVISER",
    title: "꼬리의 값",
    speaker: "표세린",
    text:
      "클리어보트 회의실에는 여섯 달 전처럼 화분 하나 없습니다. 표세린이 노트북을 당신 쪽으로 돌립니다. 이사회가 해임안을 통과시키면 한 달 뒤 임시 주주총회(주주들이 모여 회사의 큰일을 표로 정하는 회의)가 열리고, 기관투자자(연기금·운용사처럼 큰돈을 모아 투자하는 곳) 상당수가 그의 권고를 보고 표를 정합니다. 화면 속 권고 초안의 결론 칸은 비어 있습니다. '해임 찬성 권고는 쉬워요. 그러면 이 회사 지배구조(회사가 누구의 결정으로 움직이고 누가 감시하는지의 짜임) 점수가 올라가요. 한 사람을 내보냈으니까요.' 그가 2023년 이사회 자료를 짚습니다. '그때 반대 의견 보고를 받은 이사가 이번 표결의 의장이에요. 이건 개혁이 아니라 아랫사람 하나한테 책임을 다 지우고 윗선은 빠지는 거예요.' 그가 커서를 결론 칸에 둡니다. '근거를 주시면 조건부로 씁니다. 해임만으로는 부족하다고요. 그 권고가 해임을 떨어뜨릴 수도 있다는 것까지 알고 주세요.'",
    memo: [
      "클리어보트 권고 초안 -- 결론 칸 비어 있음",
      "임시 주주총회: 이사회 가결 시 한 달 뒤",
      "2023년 반대 의견 보고 수신 이사 = 현 이사회 의장",
      "표세린: '이건 개혁이 아니라 꼬리 자르기예요'",
    ],
    triggers: ["order", "system", "choice"],
    choices: [
      {
        id: "c43_advisor_voices",
        label: "1주 모임의 요구를 모아 조건부 권고의 근거로 싣는다",
        effect: { trust: 11, legitimacy: 4, humanCost: -4, time: -5, capital: -3, fatigue: 6 },
        next: "c43_corridor",
        cognition: { persistence: 2 },
      },
      {
        id: "c43_advisor_amend",
        label: "서명란 실명제를 담은 수정안 문안을 써서 사외이사들에게 보낸다",
        effect: { legitimacy: 13, trust: -2, time: -5, humanCost: 3, fatigue: 4 },
        next: "c43_corridor",
        cognition: { reframing: 2 },
      },
      {
        id: "c43_advisor_simple",
        label: "개혁 조건은 다음으로 미루고 해임 찬성 권고만 부탁한다",
        effect: { time: 6, capital: 5, legitimacy: -4, trust: 3, humanCost: 4, fatigue: -3 },
        next: "c43_corridor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c43_corridor",
      },
    ],
  },
  c43_corridor: {
    phase: "THE CORRIDOR",
    title: "등받이 없는 벤치",
    speaker: "윤상혁",
    text:
      "월요일 14시 20분, 33층 이사회 회의실 앞 복도. 참고인 대기석은 등받이 없는 벤치 하나이고, 그 끝에 윤상혁이 먼저 앉아 있습니다. 당사자라 표결에는 못 들어가고, 해명 10분만 허락받았습니다. 그가 옆자리를 손바닥으로 한 번 쓸어 줍니다. 당신은 다섯 달째 그의 부하 직원입니다. '자네 보고서는 매주 읽었네. 위험관리부 보고서 중에 제일 길더군.' 그가 소매 끝을 당깁니다. '들어가서 내 얘기를 해도 좋네. 다만 이것만 알고 들어가게. 그 칸을 비워 두라고 한 사람이 나 하나였다면, 3년 동안 아무도 나를 못 건드렸을 것 같나.' 문틈으로 연태경 의장의 낮은 목소리가 새어 나옵니다. 윤상혁이 휴대폰을 뒤집어 놓습니다. 잠금 화면은 딸 윤서진의 졸업 사진입니다. '서진이가 로비에 와 있네. 나 말고, 자네를 보러.'",
    memo: [
      "이사회 개회 14:00 · 참고인 호출 14:40 예정",
      "윤상혁: 해명 10분 · 표결 제외",
      "'그 칸을 비워 두라고 한 사람이 나 하나였다면'",
      "윤서진, 1층 로비 대기",
    ],
    triggers: ["manipulation", "selfAwareness", "curiosity"],
    choices: [
      {
        id: "c43_corridor_speak",
        label: "들어가서 그 사람 이름을 직접 말하라고 윤상혁을 설득한다",
        effect: { trust: 10, legitimacy: 4, humanCost: -3, time: -4, capital: -3, fatigue: 6 },
        next: "c43_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c43_corridor_statement",
        label: "방금 한 말을 서명한 진술서로 남겨 달라고 요구한다",
        effect: { legitimacy: 12, trust: -3, time: -4, humanCost: 4, fatigue: 4 },
        next: "c43_final",
        cognition: { inference: 2 },
      },
      {
        id: "c43_corridor_ignore",
        label: "흔들릴 시간이 없다며 준비한 발언 원고만 다시 읽는다",
        effect: { time: 6, capital: 4, trust: 2, legitimacy: -3, humanCost: 4, fatigue: -4 },
        next: "c43_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c43_final",
      },
    ],
  },
  c43_final: {
    phase: "FINAL DECISION",
    title: "마지막 한 표",
    speaker: "서도경",
    text:
      "참고인 발언이 끝나자 연태경 의장이 표결을 부칩니다. 사외이사 일곱 명이 차례로 투표용지를 접어 넣고, 사무국 직원이 한 장씩 폅니다. 찬성 넷, 반대 셋. 은채원의 손이 탁자 아래에서 떨리고 있습니다. 남은 건 서도경 회장의 한 표입니다. 회장이 펜을 내려놓고 결의문 초안을 넘깁니다. 마지막 줄에 문장 하나가 붙어 있습니다. '이로써 2023-0412 관련 책임 규명은 마무리된 것으로 한다.' 회장이 말합니다. '이 줄이 있으면 찬성하겠네. 없으면 이 회사는 끝나지 않는 싸움을 계속할 테니, 반대하겠고.' 그가 처음으로 당신을 똑바로 봅니다. '참고인에게 묻지. 한 사람을 내보내고 끝내겠나, 아무도 내보내지 못한 채 계속하겠나.' 벽시계 초침 소리가 회의실을 채웁니다.",
    memo: [
      "사외이사 7표 개표: 찬성 4 · 반대 3",
      "남은 표: 서도경 회장 1 · 5표면 가결",
      "결의문 마지막 줄: '책임 규명은 마무리'",
      "이 선택은 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c43_final_names",
        label: "로비의 사람들 이름을 들어 마지막 줄을 빼 달라고 호소한다",
        effect: { trust: 11, legitimacy: 4, capital: -7, time: -5, humanCost: -3, fatigue: 7 },
        next: "case43_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c43_final_amend",
        label: "마지막 줄 대신 2023년 이사회 책임 조사를 결의문에 넣자고 한다",
        effect: { legitimacy: 13, trust: -2, capital: -5, time: -5, humanCost: 4, fatigue: 5 },
        next: "case43_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c43_final_take",
        label: "마지막 줄이 붙어도 오늘 해임이 먼저라며 표결을 받아들인다",
        effect: { capital: 6, time: 5, legitimacy: 3, trust: -4, humanCost: 5, fatigue: -3 },
        next: "case43_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case43_result",
      },
    ],
  },
};

/**
 * Everything else case 43 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case43 = {
  id: "case43",
  nodes: case43Nodes,
  aftermath: {
    c43_aftershock: {
      phase: "AFTERMATH",
      title: "5대 3",
      speaker: "표세린",
      text: "16시 07분, 사무국이 결과를 알립니다. 해임안(이사를 자리에서 물러나게 하는 안건) 가결, 찬성 5 반대 3. 결의문 마지막 줄은 밤사이 정리해 공시(회사가 중요한 일을 모두에게 알리는 것)하겠답니다. 회의실 문이 열리자 복도에 1주 모임 대표 스무 명이 서 있습니다. 사무국이 로비에서 올려 보낸 사람들입니다. 강태민은 끝내 뜯지 못한 컵라면 상자를 안았고, 문가을은 남은 떡을 보안요원에게 돌립니다. 검색대의 그 요원이 두 개째를 받습니다. 윤상혁이 사원증을 풀어 비서에게 건네고 엘리베이터 앞에서 돌아봅니다. '1심 선고가 곧일세. 그날은 내가 피고인석에 앉지.' 표세린의 문자가 옵니다. '결론 칸 채웠어요. 조건부 찬성, 각주 열한 개.' 복도 끝의 윤서진은 엘리베이터 숫자가 1이 될 때까지 봅니다.",
      memo: ["해임안 가결 -- 찬성 5 · 반대 3", "결의문 마지막 줄: 오늘 밤 공시 예정", "1주 모임 대표 20명, 33층 복도까지 입장", "1심 선고 임박 · 클리어보트 조건부 찬성 권고"],
      triggers: ["trust", "helplessness", "choice"],
      choices: [
        { id: "c43_after_warm", label: "복도를 지켜 준 사람들 곁에 새벽까지 남는다", effect: { trust: 12, humanCost: -6, time: -3, capital: -3, fatigue: -7 }, next: "case43_result", cognition: { reframing: 2 } },
        { id: "c43_after_record", label: "오늘의 표결을 한 줄씩 적어 날짜와 함께 기록으로 남긴다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -2, fatigue: 5 }, next: "case43_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c43_after_rush", label: "선고를 지키러 복도에서 곧장 서초동으로 간다", effect: { capital: 7, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 5 }, next: "case43_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c43_final", "c43_aftershock"],
  connectiveScenes: [
    ["c43_professor", "c43_ledger", "c43_advisor", "시급 200만 원", "은채원", "경영대 5층 구석 연구실 문에 '면담은 메일로'라는 종이가 붙어 있습니다. 그래도 문을 열어 준 은채원은 사외이사 일곱 명 중 가장 어립니다. 그는 묻지도 않았는데 이사회 한 번 수당이 400만 원이라는 것부터 말합니다. '두 시간 회의니까 시급 200만 원이죠. 그래서 제가 제일 무서워요. 이 돈 받고 틀리면 어떡하나.' 책상 위 안건 설명서는 형광펜 네 가지 색으로 빽빽하고, 여백에는 물음표가 스물세 개 있습니다. 그가 가장 큰 물음표를 가리킵니다. '해임하면 끝나는 겁니까? 저는 그게 제일 궁금해요. 끝나는 거면 찬성하고, 아니면...' 말끝이 형광펜 뚜껑 닫는 소리에 묻힙니다.", ["은채원: 회계학 교수 · 사외이사 1년차", "이사회 수당 1회 400만 원 · 설명서 여백 물음표 23개", "질문: '해임하면 끝나는 겁니까?'"], ["끝나지 않는다며 1주 모임 사람들을 직접 만나 달라고 청한다", "해임 뒤에도 남는 2023년 이사회 책임을 자료로 설명한다", "지금은 끝난다고 말해 찬성표부터 확보한다"]],
    ["c43_call", "c43_advisor", "c43_corridor", "기억으로 굴러가는 회사", "서도경", "클리어보트를 나와 탄 택시 안에서 모르는 번호가 울립니다. '회장님 바꿔 드리겠습니다.' 비서실장 여민규의 목소리가 지나가고, 서도경 회장이 인사도 없이 묻습니다. '자네, 그 사람이 나가면 끝난다고 보나?' 대답하기도 전에 말이 이어집니다. '나는 끝난다고 보네. 회사는 사람이 아니라 기억으로 굴러가거든. 한 사람을 내보내면 회사는 그 사람을 기억하지 않아. 나는 그걸 개혁이라고 부르네.' 창밖으로 마포대교 불빛이 지나갑니다. '월요일에 나는 맨 마지막에 던지네. 앞에서 표가 어떻게 나오든. 자네가 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 들어온다지. 무슨 말을 할지는 자네가 정하게. 들을지는 내가 정하고.' 통화 시간 3분 12초, 전화가 먼저 끊깁니다.", ["서도경 회장 직접 통화 · 3분 12초", "'회사는 사람이 아니라 기억으로 굴러가네'", "회장은 마지막 순서로 투표"], ["회사가 잊을 사람들의 이름을 들고 가겠다고 답장한다", "통화 내용을 날짜와 시각까지 적어 한서윤에게 맡겨 둔다", "회장의 한 표는 못 바꾼다고 보고 앞의 표에 집중한다"]],
    ["c43_lobby", "c43_corridor", "c43_final", "물 안 부은 컵라면", "강태민", "같은 시각 1층 로비. 이사회는 비공개라 1주 모임 사람들은 회전문 안쪽 로비까지만 들어올 수 있습니다. 강태민이 야간조 여든 명 몫의 컵라면 상자를 안고 검색대에서 막힙니다. '액체류는 반입이 안 됩니다.' '아직 물 안 부었는데요.' 보안요원이 상자를 한참 보다가 무전기를 듭니다. 문가을은 떡 상자를, 문하준은 스케치북을 들고 있습니다. 첫 장에 큰 글씨로 '끝까지'가 적혀 있습니다. 로비 소파 끝에는 윤서진이 혼자 앉아 누구와도 눈을 맞추지 않습니다. 그때 33층의 이민서에게서 문자가 옵니다. '표결은 무기명이래요. 누가 어느 쪽에 던졌는지는 의사록(회의에서 오간 말과 결과를 적은 공식 기록)에도 안 남긴대요.'", ["1주 모임 로비 대기 약 140명", "컵라면 80개 -- 검색대 통과 보류", "이사회 표결: 무기명 · 이사별 찬반 기록 없음"], ["로비에 전화해 윤서진을 1주 모임 곁에 앉혀 달라고 부탁한다", "이사별 찬반을 의사록에 남기라고 발언 첫머리에 요구한다", "기록 방식은 넘어가고 표결 결과부터 받아 낸다"]],
  ],
  connectiveOrder: [["c43_ledger", "c43_professor"], ["c43_advisor", "c43_call"], ["c43_corridor", "c43_lobby"]],
  choiceEffects: {
    c43_ledger: [
      { trust: 11, humanCost: -4, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -4, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -3, humanCost: 4, fatigue: -3 },
    ],
    c43_advisor: [
      { trust: 10, humanCost: -5, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, humanCost: 3, time: -3, fatigue: 2 },
      { time: 5, capital: 5, trust: -4, humanCost: 3, fatigue: -4 },
    ],
    c43_corridor: [
      { trust: 12, humanCost: -5, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 11, trust: 3, time: -4, humanCost: 3, fatigue: 4 },
      { time: 5, capital: 3, trust: -3, legitimacy: -2, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c43_ledger: {
      voice: ["끝나지 않는다며, 1주 모임 사람들을 직접 만나 달라고 청한다.", "해임 뒤에도 남는 2023년 이사회 책임을, 자료로 설명한다.", "지금은 끝난다고 말해, 찬성표부터 확보한다."],
      echo: ["청하면 은채원이 달력을 봅니다. 토요일 오전, 망원시장. 그는 '이사가 이해관계인을 만나도 되나' 하고 한 시간을 고민한 뒤에 옵니다.", "자료를 보자 은채원의 물음표가 스물세 개에서 서른 개로 늘어납니다. 줄어드는 건 그의 확신입니다.", "은채원이 고개를 끄덕이고 물음표 하나에 줄을 긋습니다. 당신이 한 말이 사실이 아니라는 건 그 줄 아래에 남습니다."],
    },
    c43_advisor: {
      voice: ["회사가 잊을 사람들의 이름을 들고 가겠다고, 회장에게 답장한다.", "통화 내용을 날짜와 시각까지 적어, 한서윤에게 맡겨 둔다.", "회장의 한 표는 못 바꾼다고 보고, 앞의 표에 집중한다."],
      echo: ["답장에는 읽음 표시만 뜹니다. 월요일 회의실에서 회장은 명단의 첫 이름을 먼저 말합니다. 당신보다 먼저.", "기록은 정확합니다. 한서윤이 그 종이를 대기발령 통지서와 같은 봉투에 넣습니다.", "앞의 일곱 표를 세는 동안 회장의 한 표는 아무도 건드리지 않은 채 월요일까지 갑니다."],
    },
    c43_corridor: {
      voice: ["로비에 전화해, 윤서진을 1주 모임 곁에 앉혀 달라고 부탁한다.", "이사별 찬반을 의사록에 남기라고, 발언 첫머리에 요구한다.", "기록 방식은 넘어가고, 표결 결과부터 받아 낸다."],
      echo: ["도윤하가 윤서진에게 자리를 권합니다. 그는 한 칸 떨어져 앉지만, 일어나지는 않습니다.", "요구는 발언 기록 첫 줄에 남습니다. 연태경 의장이 '검토하겠다'고 답하고 그 말도 기록에 남습니다.", "결과는 빨리 나옵니다. 누가 어느 쪽이었는지는 여덟 명만 압니다."],
    },
  },
  reactionScenes: [
    ["c43_professor_reaction", "c43_professor", "c43_advisor", "위에서 정한 일", "은채원", "은채원이 형광펜을 내려놓고 창문을 엽니다. '제가 왜 회계를 공부했는지 말씀드릴까요.' 그의 아버지는 안산에서 금형 공장을 했고, 은채원이 고3이던 해에 부도(빚을 갚지 못해 회사가 쓰러지는 일)가 났습니다. 거래 은행 지점장이 집까지 찾아와 현관에서 고개를 숙였습니다. '저도 위에서 정한 일이라서요.' 은채원이 웃습니다. 웃는데 눈가가 붉습니다. '그 사람이 나쁜 사람이 아니었다는 게 제일 싫었어요. 위가 누군지는 끝내 아무도 안 알려 줬고요.' 그가 안건 설명서 첫 장을 손바닥으로 누릅니다. '이번에도 위는 한 사람뿐인가요?'", ["그 지점장 이야기를 월요일 이사회에서 직접 해 달라고 부탁한다", "그 '위'가 누구였는지 2023년 승인 순서를 함께 찾자고 한다", "개인사는 표결과 무관하다며 안건 이야기로 돌아간다"]],
    ["c43_call_reaction", "c43_call", "c43_corridor", "빠지고 싶었던 이름", "한서윤", "밤 열한 시, 회기동 헌책방 1층. 통화 이야기를 들은 한서윤이 한참 계산대 모서리만 봅니다. '솔직히 말할게요. 회장님 말이 반가웠어요. 한 사람이 나가면 회사가 기억하지 않는다. 그럼 저도 기억에서 빠지는 거잖아요.' 그가 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 통지서를 접었다 폅니다. 다섯 달째 같은 종이입니다. '그게 제일 부끄러워요. 그래서 월요일에 저도 가겠어요. 2023년에 반대 의견을 반려한 사람으로요. 참고인 명단에 제 이름을 넣어 주세요.' 상자 더미 위에서 졸던 강태민이 몸을 일으키다 선반에 머리를 부딪힙니다. 아무도 안 웃다가, 셋이 동시에 웃습니다.", ["한서윤과 나란히 이사회 참고인으로 서겠다고 한다", "반려 당시의 문서를 먼저 모아 그의 진술을 뒷받침한다", "한서윤까지 드러나면 표가 흔들린다며 이번엔 말린다"]],
    ["c43_lobby_reaction", "c43_lobby", "c43_final", "기다려 본 사람", "문가을", "문가을이 떡 상자를 들고 로비 소파 끝으로 갑니다. 윤서진이 고개를 들고, 그가 누군지 알아봅니다. 문가을은 인사 대신 떡 한 팩을 그의 무릎에 올려놓습니다. '아버지 기다리는 거죠. 나도 남편 기다려 봤어요. 병원 복도에서.' 윤서진이 울음을 참다 떡을 한 입 뭅니다. '저희 아버지가 한 일, 저 다 알아요. 그래서 여기 앉아 있는 거예요. 도망가면 제가 아버지랑 똑같아질 것 같아서요.' 문가을이 한참 떡 상자 끈만 만지다가 말합니다. '그 말, 반대 의견 쓴 사람한테 가서 해요. 그 사람이 3년 동안 제일 듣고 싶었던 말일 거예요.'", ["문가을 편에 발언이 끝나면 곧장 내려가겠다고 전한다", "윤서진의 말을 가족 진술서로 받아 두자고 제안한다", "지금은 이사회에 집중하겠다며 휴대폰을 무음으로 돌린다"]],
  ],
  reactionEffects: {
    c43_professor: [
      { trust: 10, humanCost: -3, legitimacy: 2, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 4, capital: -4, time: -4, fatigue: 3 },
      { time: 4, capital: 3, legitimacy: 2, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c43_call: [
      { trust: 11, legitimacy: 3, humanCost: 3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 3, capital: -4, time: -4, fatigue: 3 },
      { time: 4, capital: 4, trust: 2, legitimacy: -3, humanCost: 4, fatigue: -3 },
    ],
    c43_lobby: [
      { trust: 11, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: -2, humanCost: 3, time: -3, capital: -2, fatigue: 3 },
      { time: 4, capital: 3, trust: -1, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c43_professor: {
      voice: ["그 지점장 이야기를, 월요일 이사회에서 직접 해 달라고 부탁한다.", "그 '위'가 누구였는지, 2023년 승인 순서를 함께 찾자고 한다.", "개인사는 표결과 무관하다며, 안건 이야기로 돌아간다."],
      echo: ["은채원이 오래 창밖을 봅니다. '두 시간에 400만 원이면, 그 얘기 할 시간은 되겠네요.'", "승인 순서를 따라가면 2023년 4월 이사회 17쪽에 닿습니다. 은채원이 그 쪽수를 형광펜 다섯 번째 색으로 칠합니다.", "은채원이 창문을 닫습니다. 설명서 여백의 물음표는 그대로 스물세 개입니다."],
    },
    c43_call: {
      voice: ["한서윤과 나란히, 이사회 참고인으로 서겠다고 한다.", "반려 당시의 문서를 먼저 모아, 그의 진술을 뒷받침한다.", "한서윤까지 드러나면 표가 흔들린다며, 이번엔 말린다."],
      echo: ["나란히 서면 반대한 사람과 반려한 사람이 같은 벤치에 앉습니다. 윤상혁이 그 모습을 가장 오래 봅니다.", "문서가 붙으면 한서윤의 진술은 고백이 아니라 증거가 됩니다. 증거에는 그의 이름도 함께 남습니다.", "한서윤은 '알겠어요' 하고 통지서를 다시 접습니다. 접힌 자리가 조금 더 하얘집니다."],
    },
    c43_lobby: {
      voice: ["문가을 편에, 발언이 끝나면 곧장 내려가겠다고 전한다.", "윤서진의 말을, 가족 진술서로 받아 두자고 제안한다.", "지금은 이사회에 집중하겠다며, 휴대폰을 무음으로 돌린다."],
      echo: ["전해 들은 윤서진이 떡 팩을 가방에 넣고 자리를 지킵니다. 약속 하나가 로비에서 기다리기 시작합니다.", "진술서라는 말에 윤서진의 얼굴이 굳습니다. 그는 서명하지만, 다음 말을 아낍니다.", "무음이 된 휴대폰에 문가을의 메시지가 세 개 쌓입니다. 마지막 것은 떡 사진 한 장입니다."],
    },
  },
  reactionMemos: {
    c43_professor_reaction: ["'저도 위에서 정한 일이라서요'", "이번에도 위는 한 사람뿐인가"],
    c43_call_reaction: ["기억에서 빠지고 싶었던 이름", "반려한 사람으로 참고인이 되겠다"],
    c43_lobby_reaction: ["병원 복도에서 기다려 본 사람", "도망가면 아버지랑 똑같아질까 봐"],
  },
  branchPlan: ["c43_ledger", 0, "c43_branch_witness", "c43_branch_witness_follow"],
  branchScenes: {
    // CASE 43's detour is the witness. The case counts eight votes; the side door
    // is the one person whose page can change them and what that page costs her.
    c43_branch_witness: {
      phase: "SIDE DOOR",
      title: "17쪽의 한 줄",
      speaker: "백아린",
      text: "서초동 법원 앞 카페 창가에 백아린이 앉아 있습니다. 그룹 법무팀이 낸 영업비밀(회사가 비밀로 지키는 경영 정보) 유출 소송의 첫 준비 기일(재판 전에 다툴 점을 정리하는 날)을 마치고 막 나온 참입니다. 공익신고(회사의 불법을 공공기관에 알리는 것)를 한 지 두 달, 차는 변호사비로 팔았고 태블릿 배터리는 오늘도 9%입니다. 그가 서류 봉투를 테이블에 올립니다. 2023년 4월 KD금융그룹 이사회 보고 자료 사본입니다. 17쪽 구석에 '심사 과정 반대 의견 1건 -- 처리 완료' 한 줄이 있고, 옆에 당시 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 연태경의 검토 서명이 있습니다. '이걸 들고 월요일에 가면 법무팀은 소송 금액을 두 배로 올릴 거예요.' 그가 웃습니다. '엄마는 아직도 제 사원증을 액자에 걸어 두셨어요.'",
      memo: ["2023년 4월 이사회 보고 자료 17쪽", "'반대 의견 1건 -- 처리 완료' · 검토 서명: 연태경", "백아린: 영업비밀 유출 소송 · 차량 매각", "이사회까지 나흘"],
      triggers: ["protection", "trust", "fear"],
      choices: [
        { id: "c43_branch_witness_a", label: "백아린 곁에서 소송 비용부터 1주 모임과 함께 나눠 진다", effect: { trust: 12, humanCost: -5, capital: -7, time: -3, fatigue: 5 }, next: "c43_branch_witness_follow", cognition: { reframing: 2 } },
        { id: "c43_branch_witness_b", label: "사본의 출처와 서명을 공증받아 증거로 굳힌다", effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 3, fatigue: 4 }, next: "c43_branch_witness_follow", cognition: { inference: 2 } },
        { id: "c43_branch_witness_c", label: "자료만 받아 오고 백아린은 이사회에 오지 말라고 한다", effect: { time: 6, capital: 5, trust: -5, humanCost: 4, fatigue: -3 }, next: "c43_branch_witness_follow", cognition: { risk: 1 } },
      ],
    },
    c43_branch_witness_follow: {
      phase: "SIDE DOOR",
      title: "13시의 합의서",
      speaker: "백아린",
      text: "커피가 식을 무렵 백아린의 휴대폰이 울립니다. 그룹 법무팀입니다. 당신이 스피커를 가리키자 그가 망설이다 켭니다. '백아린 씨, 월요일 13시까지 합의서에 서명하시면 소송은 취하합니다. 조건은 하나, 이사회 전후 한 달간 이 건으로 어떤 진술도 하지 않는 겁니다.' 전화가 끊깁니다. 이사회는 14시입니다. 백아린이 봉투 모서리를 손톱으로 접었다 폅니다. '1년 전의 저라면 이 합의서를 직접 썼을 거예요. 문장도 더 매끄럽게.' 창밖 법원 앞 은행나무에서 이른 잎 하나가 떨어집니다. 그가 휴대폰을 뒤집어 놓습니다. '서명하면 엄마 액자는 그대로 걸려 있겠죠. 안 하면, 저는 이 이야기의 끝까지 가야 하고요.'",
      memo: ["합의 제안: 월요일 13시 마감 · 이사회 14시", "조건: 이사회 전후 한 달 진술 금지", "대가: 영업비밀 유출 소송 취하", "백아린: '1년 전의 저라면 직접 썼을 거예요'"],
      triggers: ["protection", "manipulation", "choice"],
      choices: [
        { id: "c43_branch_witness_follow_a", label: "합의서 대신 백아린의 증언을 지킬 변호인단을 1주 모임에서 꾸린다", effect: { trust: 13, humanCost: -4, capital: -6, time: -4, fatigue: 5 }, next: "c43_professor", cognition: { persistence: 2 } },
        { id: "c43_branch_witness_follow_b", label: "합의 제안 자체를 신고자 보복으로 금융당국에 알린다", effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 3, fatigue: 5 }, next: "c43_professor", cognition: { inference: 2 } },
        { id: "c43_branch_witness_follow_c", label: "백아린의 선택이니 서명해도 괜찮다고 말해 준다", effect: { time: 5, capital: 4, trust: 3, legitimacy: -6, humanCost: 4, fatigue: -4 }, next: "c43_professor", cognition: { reframing: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c43_start",
    result: "c43_aftershock",
    defaultFree: "c43_route_system",
    // One board, one motion. Like 사건 23 the case is a single line; the split is
    // whether removing one man opens the record or closes it.
    choices: {},
    system: {
      route: "c43_route_system",
      final: "c43_final_system_route",
      title: "486건과 마지막 줄",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 KD캐피탈 단말에서 노아가 대답합니다. 노아는 지난 10년 KD금융그룹 이사회 의사록(회의에서 오간 말과 결과를 적은 공식 기록)을 전부 읽어 두었습니다. 안건 486건 가운데 사외이사(회사 밖에서 와서 경영진을 감시하는 이사)가 반대표를 던진 건 세 번이고, 그 세 사람은 모두 이듬해 다시 선임되지 않았습니다. 임원 해임 결의는 두 번 있었는데, 두 결의문 모두 마지막 줄이 같았습니다. '관련 책임 규명은 마무리된 것으로 한다.' 노아가 한 줄을 덧붙입니다. '이 이사회에서 해임은 사건을 여는 절차가 아니라 닫는 절차로 쓰였습니다. 같은 모양이 반복될 확률, 0.97.'",
      memo: ["이사회 안건 486건 -- 사외이사 반대표 3번", "반대한 세 사람: 모두 이듬해 재선임 안 됨", "임원 해임 결의 2건 -- 마지막 줄이 같음"],
      routeChoices: [
        ["c43_route_system_publish", "10년 치 의사록 통계를 은채원과 표세린에게 동시에 보낸다", { legitimacy: 10, trust: 6, capital: -5, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c43_route_system_line", "결의문의 마지막 줄만 따로 떼어 공개 질의로 묻는다", { legitimacy: 8, trust: 3, capital: -2, time: -5, humanCost: 3, fatigue: 5 }, { reframing: 2 }],
        ["c43_route_system_drop", "통계는 넣어 두고 표 계산에 집중한다", { time: 7, capital: 6, trust: -4, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "해임 결의에 종결 문구를 못 쓰게 하는 이사회 규정을 제안한다", { legitimacy: 12, trust: 7, capital: -7, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "규정은 그대로 두고 이번 해임만 먼저 통과시킨다", { capital: 8, time: 6, trust: -6, legitimacy: -7, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "사외이사의 반대표와 그 뒤 재선임 여부를 해마다 공개하게 한다", { legitimacy: 9, trust: 8, capital: -6, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c43_evidence_turn",
    result: "c43_aftershock",
    sourceRoutes: ["c43_ledger", "c43_advisor", "c43_corridor", "c43_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 이사회 안건 설명서 옆에 놓고, 표결 결과가 어디서 먼저 쓰였는지 맞춰 본다.",
    entryEcho: "단서를 대면 표결이 결과를 정한 것인지, 결과가 표결을 기다린 것인지 보입니다.",
    title: "두 장의 보도자료",
    speaker: "반재욱",
    text: "단서를 맞추자 그룹 홍보실 공유 폴더의 파일 두 개가 열립니다. 링크를 보낸 사람은 홍보실 3년차 직원이고, 메일에는 이름 대신 '죄송합니다' 한 마디만 있습니다. 두 파일을 만든 날짜는 모두 이사회 사흘 전입니다. 하나는 '해임안 가결 -- KD금융그룹, 개혁을 마무리하다', 다른 하나는 '해임안 부결 -- 이사회 독립성이 확인되다'. 두 파일의 마지막 문단은 한 글자도 다르지 않습니다. '이로써 2023-0412 관련 논란은 일단락되었다.' 마지막으로 고친 사람은 회장 비서실장 여민규입니다. 반재욱이 수첩을 덮습니다. '표가 어떻게 나와도 회사가 이기게 짜여 있군요. 여덟 명이 무엇을 던지든, 끝나는 날짜는 이미 정해져 있었습니다.'",
    memo: ["보도자료 초안 2건 -- 작성일: 이사회 사흘 전", "가결본·부결본 마지막 문단 동일: '일단락'", "마지막 수정: 비서실장 여민규 · 제보자: 홍보실 3년차"],
    triggers: ["manipulation", "system", "injustice"],
    entryEffect: { legitimacy: 6, trust: 5, time: -4, capital: -3, fatigue: 3 },
    choices: [
      ["c43_evidence_turn_reveal", "두 장의 보도자료를 개회 전에 사외이사 전원에게 보낸다", { legitimacy: 12, trust: 4, capital: -6, time: -5, humanCost: 4, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c43_evidence_turn_protect", "파일을 보낸 홍보실 직원부터 보호할 방법을 찾는다", { trust: 12, legitimacy: 4, capital: -6, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
      ["c43_evidence_turn_hold", "보도자료는 표결 뒤에 쓸 카드로 남겨 둔다", { capital: 7, time: 6, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c43_branch_witness",
    systemNext: "c43_route_system",
    evidenceNext: "c43_evidence_turn",
    routeLabel: "직전 사건의 경포 단체 사진을 넘기다 백아린에게 먼저 전화를 건다",
    systemLabel: "직전 자유응답 문장이 해임안 설명서에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 홍보실 보도자료 폴더를 연다",
  },
  openingRoutes: {
    c42_after_warm: "c43_start_warm",
    c42_after_record: "c43_start_record",
    c42_after_rush: "c43_start_rush",
  },
  openingCopy: {
    c43_start_warm: ["바다에 남았던 아홉 명", "나준혁", "단체 사진을 열두 번 찍고 낮 기차 시간까지 동료들과 바다에 남았습니다. 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 두 명에게 보낼 의견서는 서울행 기차에서 아홉 명이 돌려 가며 고쳤고, 자정 7분 전에 보냈습니다. 월요일 아침 KD캐피탈 위험관리부 모니터에 공지가 뜹니다. 9월 7일 KD금융그룹 이사회, 안건 제1호 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 해임안(이사를 자리에서 물러나게 하는 안건). 표를 던지는 사람은 회장과 사외이사 일곱, 모두 여덟입니다. 단체방에 나준혁이 사진을 올립니다. 방파제의 밤, 각자 무엇이 자기를 멈추지 못하게 했는지 말할 때 그가 수첩에 받아 적은 쪽입니다. '이번 주는 이걸로 버팁시다. 글씨는 나도 못 알아보겠지만.' 그 아래 한서윤이 한 줄을 답니다. '설명서에 2023년이 없어요.'", ["나준혁의 수첩 한 쪽: 방파제의 대답 아홉 개", "의견서 발송: 자정 7분 전 · 사외이사 2명", "이사회까지 7일 -- 표결 8명"]],
    c43_start_record: ["이름이 하나뿐인 설명서", "반재욱", "방파제 아래의 대답들과 마흔일곱 곳의 주소를 당신은 돌아오는 기차에서 한 파일로 정리했고, 그 파일은 의견서에 붙어 이사회로 갔습니다. 월요일 KD캐피탈 위험관리부 모니터에 공지가 뜹니다. 9월 7일 KD금융그룹 이사회, 안건 제1호 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁 해임안(이사를 자리에서 물러나게 하는 안건). 반재욱이 안건 설명서를 출력해 와 당신 파일 옆에 나란히 놓습니다. 설명서는 두 쪽, 해임 사유는 '재판 중인 사안에 따른 그룹 신뢰 훼손' 한 줄, 마지막 줄은 '관련 위험 자산 정리 완료'입니다. 표를 던지는 건 회장과 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 일곱. 그가 펜으로 두 문서를 번갈아 짚습니다. '당신 파일에는 이름이 스무 개, 주소가 마흔일곱 개인데, 이 설명서에는 이름이 하나뿐이군요. 2023년 이사회에 앉아 있던 이름들은 어디 갔을까요.'", ["기차에서 쓴 파일: 이름 20개 · 주소 47곳", "안건 설명서 2쪽 -- 등장 이름 1개", "이사회까지 7일 -- 표결 8명"]],
    c43_start_rush: ["급한 사람의 빈칸", "권도현", "새벽 해변에서 해임안(이사를 자리에서 물러나게 하는 안건) 소식을 들은 당신은 단체 사진도 찍기 전에 첫 기차로 경포를 떠났습니다. 동료들은 당신 자리를 비워 둔 채 사진을 찍었고, 방명록 마지막 줄에는 펜션 주인 여다인이 대신 쓴 '급한 사람'이 남았습니다. 월요일 KD캐피탈 위험관리부 모니터에 공지가 뜹니다. 9월 7일 KD금융그룹 이사회, 안건 제1호 사내이사(회사 경영에 직접 참여하는 이사) 윤상혁의 건. 권도현이 벌써 표를 뽑아 왔습니다. '회장 한 표, 사외이사(회사 밖에서 와서 경영진을 감시하는 이사) 일곱 표. 확실한 찬성 셋, 반대 유력 둘, 모르는 둘.' 그가 펜을 멈춥니다. '계산은 끝났는데 칸이 하나 비어요. 백아린 씨요. 경포에서 문자가 스무 통 넘게 왔을 텐데, 답장 기록이 없으시죠.'", ["단체 사진: 당신 자리만 빈 채 · 방명록 '급한 사람'", "권도현 표: 찬성 3 · 반대 유력 2 · 미정 2 · 회장 1", "백아린 문자 23통 -- 답장 0통"]],
  },
  openingSignatures: {
    c43_start_warm: {
      label: "경포의 수첩 쪽을 들고 아홉 명과 표를 나눠 맡는다",
      effect: { trust: 10, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "경포의 수첩 쪽을 들고, 아홉 명과 표를 나눠 맡는다.",
      echo: "나누면 거의 한 사람이 사외이사 한 명씩을 맡습니다. 나준혁은 제일 나이 많은 이사를 고르며 '말이 통할 나이'라고 합니다.",
    },
    c43_start_record: {
      label: "안건 설명서에 2023년 이사회를 넣으라고 공식 질의한다",
      effect: { legitimacy: 12, trust: -3, capital: -4, time: -4, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "안건 설명서에 2023년 이사회를 넣으라고, 공식 질의한다.",
      echo: "질의는 접수됩니다. 사무국 답변은 '안건과 직접 관련 없음'이고, 답변 날짜는 이사회 다음 날입니다.",
    },
    c43_start_rush: {
      label: "백아린의 스물세 통에 답장하고 동료들에게 전화를 돌린다",
      effect: { trust: 12, humanCost: -3, capital: -2, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "백아린의 스물세 통에 답장하고, 동료들에게 전화를 돌린다.",
      echo: "백아린의 답은 한 줄입니다. '늦었지만 괜찮아요.' 다음 전화를 받은 오진우가 말합니다. '사진은 다시 찍으면 돼요. 이번엔 먼저 가지 마세요.'",
    },
  },
  voiceLines: {
    // CASE 43. A board meeting. Every line is spoken in a building where the
    // result was written before the vote, so none of them may sound like a press release.
    c43_start_arin: "증언할 사람이 먼저라며, 백아린부터 찾아가 자료를 함께 정리한다.",
    c43_start_charter: "이사회 규정과 안건 설명서부터, 조항별로 따진다.",
    c43_start_count: "시간이 없다며, 사외이사 일곱 명의 표부터 빠르게 셈한다.",
    c43_ledger_visit: "막내 사외이사 은채원을 찾아가, 피해자들의 이야기를 전한다.",
    c43_ledger_conflict: "반대 유력 두 사람의 자문 이력을, 이해충돌로 공식 제기한다.",
    c43_ledger_target: "확률표대로, 표가 될 두 사람만 골라 공략한다.",
    c43_branch_witness_a: "백아린 곁에서, 소송 비용부터 1주 모임과 함께 나눠 진다.",
    c43_branch_witness_b: "사본의 출처와 서명을 공증받아, 증거로 굳힌다.",
    c43_branch_witness_c: "자료만 받아 오고, 백아린은 이사회에 오지 말라고 한다.",
    c43_branch_witness_follow_a: "합의서 대신, 백아린의 증언을 지킬 변호인단을 1주 모임에서 꾸린다.",
    c43_branch_witness_follow_b: "합의 제안 자체를, 신고자 보복으로 금융당국에 알린다.",
    c43_branch_witness_follow_c: "백아린의 선택이니, 서명해도 괜찮다고 말해 준다.",
    c43_advisor_voices: "1주 모임의 요구를 모아, 조건부 권고의 근거로 싣는다.",
    c43_advisor_amend: "서명란 실명제를 담은 수정안 문안을 써서, 사외이사들에게 보낸다.",
    c43_advisor_simple: "개혁 조건은 다음으로 미루고, 해임 찬성 권고만 부탁한다.",
    c43_corridor_speak: "들어가서 그 사람 이름을 직접 말하라고, 윤상혁을 설득한다.",
    c43_corridor_statement: "방금 한 말을, 서명한 진술서로 남겨 달라고 요구한다.",
    c43_corridor_ignore: "흔들릴 시간이 없다며, 준비한 발언 원고만 다시 읽는다.",
    c43_final_names: "로비의 사람들 이름을 들어, 마지막 줄을 빼 달라고 호소한다.",
    c43_final_amend: "마지막 줄 대신, 2023년 이사회 책임 조사를 결의문에 넣자고 한다.",
    c43_final_take: "마지막 줄이 붙어도 오늘 해임이 먼저라며, 표결을 받아들인다.",
    c43_after_warm: "복도를 지켜 준 사람들 곁에, 새벽까지 남는다.",
    c43_after_record: "오늘의 표결을 한 줄씩 적어, 날짜와 함께 기록으로 남긴다.",
    c43_after_rush: "선고를 지키러, 복도에서 곧장 서초동으로 간다.",
    c43_route_system_publish: "10년 치 의사록 통계를, 은채원과 표세린에게 동시에 보낸다.",
    c43_route_system_line: "결의문의 마지막 줄만 따로 떼어, 공개 질의로 묻는다.",
    c43_route_system_drop: "통계는 넣어 두고, 표 계산에 집중한다.",
    c43_final_system_route_a: "해임 결의에 종결 문구를 못 쓰게 하는, 이사회 규정을 제안한다.",
    c43_final_system_route_b: "규정은 그대로 두고, 이번 해임만 먼저 통과시킨다.",
    c43_final_system_route_c: "사외이사의 반대표와 그 뒤 재선임 여부를, 해마다 공개하게 한다.",
    c43_evidence_turn_reveal: "두 장의 보도자료를, 개회 전에 사외이사 전원에게 보낸다.",
    c43_evidence_turn_protect: "파일을 보낸 홍보실 직원부터, 보호할 방법을 찾는다.",
    c43_evidence_turn_hold: "보도자료는, 표결 뒤에 쓸 카드로 남겨 둔다.",
  },
  echoReplies: {
    // CASE 43.
    c43_start_arin: "찾아가면 이틀이 백아린의 소송 서류 사이에서 갑니다. 대신 증언할 사람이 혼자 법원 앞 카페에 앉아 있지 않게 됩니다.",
    c43_start_charter: "규정을 따지면 해임 사유가 한 줄뿐이라는 게 공식 질문이 됩니다. 사무국은 '규정상 문제없음'이라고 답합니다.",
    c43_start_count: "셈은 빠릅니다. 셈 안에서 한서윤의 2023년은 변수 칸에 들어가지 않습니다.",
    c43_ledger_visit: "찾아가면 은채원은 반가워하지 않습니다. 대신 형광펜을 내려놓고 끝까지 듣고, 이사가 따로 사람을 만났다는 사실도 남습니다.",
    c43_ledger_conflict: "제기하면 두 사외이사 중 한 명이 표결에서 스스로 빠지겠다고 합니다. 다른 한 명은 변호사를 부릅니다.",
    c43_ledger_target: "두 사람은 움직입니다. 확률표는 맞았고, 그 표에서 사람이 한 번도 이름으로 불리지 않았습니다.",
    c43_branch_witness_a: "1주 모임 단체방에 모금 공지가 올라가고, 첫 입금자는 문가을입니다. 떡값 3만 원입니다.",
    c43_branch_witness_b: "공증을 받으면 사본은 증거가 됩니다. 백아린의 이름도 증거 목록 첫 줄에 함께 올라갑니다.",
    c43_branch_witness_c: "백아린이 봉투를 건네고 창밖을 봅니다. '저는 또 뒤에 있으라는 거네요.' 자료는 당신 가방으로 갑니다.",
    c43_branch_witness_follow_a: "변호사 세 명이 무료로 붙습니다. 그중 하나는 문가을 모임의 소송을 맡아 온 변호인입니다. 소송 금액은 그대로 두 배가 됩니다.",
    c43_branch_witness_follow_b: "신고는 접수 번호를 받습니다. 합의서 마감은 그 번호보다 먼저 옵니다.",
    c43_branch_witness_follow_c: "괜찮다는 말에 백아린이 한참 웃습니다. 그리고 합의서를 가방에 넣습니다. 서명했는지는 월요일 13시에 알게 됩니다.",
    c43_advisor_voices: "밤새 요구 140개가 모입니다. 표세린은 날짜와 문서가 붙은 열한 개만 각주로 씁니다.",
    c43_advisor_amend: "수정안은 일곱 명의 메일함에 들어갑니다. 열어 본 사람은 넷이고, 답장한 사람은 은채원 하나입니다.",
    c43_advisor_simple: "표세린이 노트북을 닫습니다. '부탁은 안 받는다고 했죠.' 권고는 그대로 조건부로 나갑니다. 당신의 부탁만 기록에 남습니다.",
    c43_corridor_speak: "윤상혁이 오래 웃습니다. '자네가 나한테 들어가라고 하는 날이 오는군.' 그는 일어서지만, 그 이름을 말할지는 문 안에서 정합니다.",
    c43_corridor_statement: "진술서라는 말에 윤상혁이 펜을 꺼냅니다. 서명란 앞에서 펜이 멈추고, 그는 그 칸을 비워 둔 채 종이를 건넵니다.",
    c43_corridor_ignore: "원고는 흔들리지 않습니다. 벤치 끝의 사람이 무엇을 더 말하려 했는지는 끝내 모릅니다.",
    c43_final_names: "이름이 불리자 은채원이 고개를 듭니다. 회장은 그 이름들을 끝까지 듣고, 펜을 다시 집습니다.",
    c43_final_amend: "수정안이 올라오자 연태경 의장이 휴회를 선언합니다. 20분 뒤 돌아온 결의문에는 '조사' 대신 '점검'이라는 말이 들어 있습니다.",
    c43_final_take: "해임은 오늘 이루어집니다. 마지막 줄도 함께 통과되고, 2023년 이사회는 그 줄 아래에서 조용해집니다.",
    c43_after_warm: "복도의 사람들과 회사 앞 포장마차까지 내려가 새벽 두 시에 헤어집니다. 공시는 그사이 올라오고, 아무도 먼저 휴대폰을 보지 않습니다.",
    c43_after_record: "개회 시각, 휴회 20분, 표결 순서, 마지막 줄의 문장까지 한 줄씩 적힙니다. 그 기록에 적힌 날짜 하나가 며칠 뒤 다른 서류의 날짜와 겹칩니다.",
    c43_after_rush: "서초동 법원 민원실에 닿으니 마감 5분 전입니다. 떡 상자는 당신 없이 비워지고, 복도의 스무 명은 당신이 어디 갔는지 단체방으로 묻습니다.",
    c43_route_system_publish: "통계는 은채원의 설명서 여백과 표세린의 각주로 들어갑니다. 반대표를 던진 세 사람의 이름도 함께 들어갑니다.",
    c43_route_system_line: "질의가 공개되면 사무국은 그 줄을 '관례적 문구'라고 부릅니다. 관례라는 말이 처음으로 기사 제목이 됩니다.",
    c43_route_system_drop: "표는 조금 더 정확하게 셈해집니다. 그 마지막 줄은 올해도 같은 자리에 붙을 준비를 합니다.",
    c43_final_system_route_a: "규정이 생기면 다음 해임부터는 끝났다는 말을 결의문에 쓸 수 없습니다. 이번 결의는 그 규정 밖에 있습니다.",
    c43_final_system_route_b: "해임은 통과됩니다. 규정은 다음 이사회를 기다리고, 그동안 마지막 줄은 지금 모양 그대로입니다.",
    c43_final_system_route_c: "공개가 시작되면 반대표를 던진 사람이 이듬해 어떻게 되는지 누구나 봅니다. 올해 반대할 사람은 그걸 먼저 봅니다.",
    c43_evidence_turn_reveal: "파일을 받은 일곱 명 중 둘이 개회 직전 회의실 밖으로 나가 통화를 합니다. 표결이 30분 늦어지고, 제보자를 찾는 홍보실의 메일이 돕니다.",
    c43_evidence_turn_protect: "직원은 무사합니다. 대신 두 보도자료는 이사회가 끝날 때까지 당신 가방 안에 있습니다.",
    c43_evidence_turn_hold: "카드는 남습니다. 오늘 여덟 명은 자기가 결과를 정한다고 믿으며 투표용지를 접습니다.",
  },
  characterProfiles: {
    은채원: {
      role: "KD금융그룹 사외이사 · 경영대 회계학 교수",
      stance: "두려움 · 성실 · 흔들리는 한 표",
      job: "일곱 명 중 가장 어린 사외이사로, 해임하면 정말 끝나는지 묻는다. 그 답에 따라 마지막 앞의 한 표가 움직인다.",
      appearance: "네 가지 색 형광펜, 여백마다 물음표가 찍힌 안건 설명서, '면담은 메일로'가 붙은 연구실 문.",
      thought: "두 시간에 400만 원이다. 이 돈을 받고 틀리면, 나는 우리 아버지 집 현관에 섰던 그 지점장이 된다.",
      gesture: "은채원은 대답하기 전에 형광펜 뚜껑을 닫는다. 딸깍 소리가 나야 말을 시작한다.",
      voice: "자기가 받는 돈과 두려움부터 먼저 털어놓고, 그다음에 질문한다.",
      line: "해임하면 끝나는 겁니까? 저는 그게 제일 궁금해요.",
    },
    연태경: {
      role: "KD금융그룹 이사회 의장 · 사외이사 · 전 금융위원회 국장",
      stance: "절차 · 체면 · 오래된 서명",
      job: "해임안 표결을 진행한다. 2023년 4월, 반대 의견 1건이 '처리 완료'로 보고된 자료에 검토 서명을 한 사람이기도 하다.",
      appearance: "은색 넥타이핀, 늘 같은 쪽으로 넘긴 흰머리, 의사봉 대신 쥔 몽블랑 만년필.",
      thought: "그때 나는 보고를 받았을 뿐이다. 받았을 뿐이라는 말이 얼마나 오래 버틸지, 나도 모른다.",
      gesture: "연태경은 곤란한 발언이 나오면 만년필 뚜껑을 천천히 돌려 닫는다. 다 닫히면 '다음 순서'라고 말한다.",
      voice: "낮고 느리게, 모든 문장을 절차의 말로 끝낸다.",
      line: "의견은 충분히 들었습니다. 표결로 가겠습니다.",
    },
  },
  setting: { place: "KD캐피탈 본사 · 위험관리부", clock: "8월 31일(월) · 이사회까지 D-7" },
  sceneContext: {
    c43_start: {
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "8월 31일(월) · 이사회까지 D-7",
      question: "이사회가 윤상혁 한 사람의 해임을 표결합니다. 2023년은 설명서에 없습니다. 무엇부터 하겠습니까?",
      lead: "경포에서 돌아온 첫 출근, 여덟 층 위 대표이사실의 불은 오늘 아침부터 꺼져 있습니다.",
    },
    c43_start_warm: {
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "8월 31일(월) · 이사회까지 D-7",
      question: "방파제에서 받아 적은 대답들로 이번 주를 버티자고 합니다. 아홉 명을 어떻게 나누겠습니까?",
      lead: "바다에 끝까지 남았던 사람들의 단체방은 서울에 와서도 조용해지지 않았습니다.",
    },
    c43_start_record: {
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "8월 31일(월) · 이사회까지 D-7",
      question: "당신 파일에는 이름이 스물, 안건 설명서에는 하나입니다. 빠진 이름들을 어떻게 되찾겠습니까?",
      lead: "원주를 지날 무렵 끝낸 파일이 아직 바탕화면 한가운데 열려 있습니다.",
    },
    c43_start_rush: {
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "8월 31일(월) · 이사회까지 D-7",
      question: "먼저 달려온 사이 사진에는 당신 자리만 비었고 방명록에는 '급한 사람'이 남았습니다. 무엇부터 채우겠습니까?",
      lead: "첫 기차에서 내려 곧장 출근한 책상 위에 권도현의 출력물이 먼저 와 있습니다.",
    },
    c43_ledger: {
      place: "회기동 헌책방 1층 · 책장 사이 탁자",
      clock: "9월 1일 · 이사회까지 D-6 · 20시",
      question: "사외이사 일곱 장의 확률표에서 두 칸이 비어 있습니다. 그 두 사람에게 어떻게 가겠습니까?",
      lead: "흩어진 동료들이 모이는 헌책방 1층, 권도현이 서류 가방을 열기 전부터 계산기를 꺼내 놓았습니다.",
    },
    c43_branch_witness: {
      place: "서초동 법원 앞 카페 · 창가",
      clock: "9월 3일 · 이사회까지 D-4 · 11시",
      question: "현 이사회 의장이 2023년에 '반대 의견 처리 완료'에 서명했습니다. 이 한 장을 가진 사람을 어떻게 지키겠습니까?",
    },
    c43_branch_witness_follow: {
      place: "서초동 법원 앞 카페 · 창가",
      clock: "9월 3일 · 이사회까지 D-4 · 11시 40분",
      question: "침묵하면 소송을 거두겠다는 합의서가 이사회 한 시간 전까지 유효합니다. 백아린에게 무엇이라 하겠습니까?",
    },
    c43_professor: {
      place: "경영대 5층 · 은채원 교수 연구실",
      clock: "9월 3일 · 이사회까지 D-4 · 16시",
      question: "막내 사외이사가 해임하면 끝나는 거냐고 묻습니다. 어떻게 답하겠습니까?",
    },
    c43_professor_reaction: {
      place: "경영대 5층 · 은채원 교수 연구실 창가",
      clock: "9월 3일 · 이사회까지 D-4 · 16시 30분",
      question: "'위에서 정한 일'이라던 지점장을 은채원이 아직 기억합니다. 그 기억을 어떻게 하겠습니까?",
    },
    c43_advisor: {
      place: "여의도 클리어보트 · 회의실",
      clock: "9월 4일 · 이사회까지 D-3",
      question: "표세린은 해임만으로는 꼬리 자르기라며 조건부 권고를 말합니다. 그 권고에 무엇을 건네겠습니까?",
      lead: "의결권 자문사(큰 투자 기관들에게 안건마다 찬성·반대를 권고하는 회사) 클리어보트의 작은 사무실, 여섯 달 만에 같은 문을 두드립니다.",
    },
    c43_call: {
      place: "택시 안 · 여의도에서 마포대교로",
      clock: "9월 4일 · 이사회까지 D-3 · 21시",
      question: "회장이 회사는 한 사람을 잊는 것으로 개혁한다고 말합니다. 그 전화에 어떻게 답하겠습니까?",
    },
    c43_call_reaction: {
      place: "회기동 헌책방 1층 · 계산대",
      clock: "9월 4일 · 23시",
      question: "반려에 서명한 한서윤이 자기도 참고인으로 서겠다고 합니다. 어떻게 하겠습니까?",
    },
    c43_corridor: {
      place: "여의도 KD금융그룹 본사 · 33층 이사회 회의실 앞 복도",
      clock: "9월 7일 · 이사회 당일 · 14:20",
      question: "벤치 끝의 윤상혁이 그 칸을 비우라고 한 사람이 자기 하나가 아니었다고 말합니다. 들어가기 전에 어떻게 하겠습니까?",
      lead: "참고인으로 불려 33층에 올라오니, 회의실 문 앞 벤치에 먼저 온 사람이 있습니다.",
    },
    c43_lobby: {
      place: "여의도 KD금융그룹 본사 · 로비",
      clock: "9월 7일 · 이사회 당일 · 14:30",
      question: "표결은 무기명이고 이사별 찬반은 어디에도 남지 않습니다. 로비와 33층 사이에서 무엇을 먼저 하겠습니까?",
    },
    c43_lobby_reaction: {
      place: "여의도 KD금융그룹 본사 · 로비 소파",
      clock: "9월 7일 · 이사회 당일 · 14:45",
      question: "윤서진이 아버지 대신 당신에게 할 말이 있어 로비에 앉아 있습니다. 어떻게 하겠습니까?",
    },
    c43_route_system: {
      place: "KD캐피탈 본사 · 위험관리부 단말",
      clock: "9월 1일 · 이사회까지 D-6",
      question: "10년 동안 이 이사회에서 해임은 사건을 닫는 절차였습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c43_final_system_route: {
      place: "KD캐피탈 본사 · 위험관리부 단말",
      clock: "9월 6일 · 이사회 전날 · 새벽",
      question: "해임 결의문의 마지막 줄을 다룰 규칙 하나를 정할 수 있다면, 무엇을 정하겠습니까?",
    },
    c43_evidence_turn: {
      place: "KD캐피탈 본사 · 기록 보관소",
      clock: "9월 7일 · 이사회 당일 · 07시",
      question: "가결본과 부결본 보도자료가 사흘 전에 같은 결말로 쓰여 있었습니다. 이 두 장을 어떻게 쓰겠습니까?",
    },
    c43_final: {
      place: "여의도 KD금융그룹 본사 · 33층 이사회 회의실",
      clock: "9월 7일 · 이사회 표결 · 15:40",
      question: "회장은 '책임 규명은 마무리'라는 한 줄이 있어야 마지막 표를 던지겠다고 합니다. 어떻게 하겠습니까?",
      lead: "참고인 발언을 마치고도 의장은 당신을 내보내지 않았습니다. 표결을 끝까지 지켜보라고 했습니다.",
    },
    c43_aftershock: {
      place: "여의도 KD금융그룹 본사 · 33층 복도",
      clock: "9월 7일 · 표결 직후 · 16:07",
      question: "해임은 5대 3으로 가결됐고 마지막 줄은 오늘 밤 공시됩니다. 복도에 선 사람들과 이 오후를 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c43-two-releases",
    title: "두 장의 보도자료",
    text: "이사회 사흘 전, 홍보실은 가결본과 부결본 보도자료를 모두 써 두었습니다. 두 장 모두 '2023-0412 관련 논란은 일단락되었다'로 끝났고, 마지막으로 고친 사람은 회장 비서실장 여민규였습니다.",
  },
  outcomes: {
    c43_after_warm: { tag: "곁에 남은 결말", title: "복도를 지켜 준 사람들과 새벽까지 함께 있었다", text: "해임은 5대 3으로 가결됐습니다. 당신은 33층 복도까지 올라와 기다려 준 1주 모임 사람들, 그리고 아버지를 보던 윤서진과 새벽까지 함께 있었습니다." },
    c43_after_record: { tag: "기록으로 남긴 결말", title: "표결의 하루가 한 줄씩 날짜와 함께 남았다", text: "개회부터 마지막 줄의 문장까지 오늘의 표결을 한 줄씩 적어 두었습니다. '책임 규명은 마무리'라는 문장이 언제 누구의 손에서 나왔는지가 기록이 됐습니다." },
    c43_after_rush: { tag: "먼저 달려간 결말", title: "해임이 가결된 복도에서 곧장 법원으로 갔다", text: "당신은 떡 상자와 복도의 스무 명을 두고 서초동으로 향했습니다. 1심 선고까지 남은 며칠이 법원 민원실 의자에서 시작됐습니다." },
  },
  carryovers: {
    c43_after_warm: { trust: 9, humanCost: -4, fatigue: -8 },
    c43_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c43_after_rush: { capital: 6, legitimacy: 4, trust: -7 },
  },
  continuityChallenges: {
    c42_after_warm: { id: "protect-trust", title: "불꽃을 같이 본 사람들과 같이 가기", text: "경포의 바다에 끝까지 함께 남은 아홉 명이 이번 주를 같이 버티자고 합니다. 여덟 표 앞에 혼자가 아니라 여럿이 서는 선택을 찾아야 보너스가 열립니다." },
    c42_after_record: { id: "use-reframe", title: "스무 개의 이름을 이사회의 언어로 다시 쓰기", text: "당신 파일에는 이름이 스무 개, 안건 설명서에는 하나입니다. 한 사람의 해임이 무엇을 지우는지 판을 다시 짜야 합니다." },
    c42_after_rush: { id: "repair-legitimacy", title: "먼저 떠난 첫차의 공정함 회복하기", text: "먼저 달려온 사이 사진에는 당신 자리가 비었고, 백아린의 문자는 답을 기다립니다. 그 빈자리를 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
