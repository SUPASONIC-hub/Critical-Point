/**
 * PROLOGUE 03 -- the rejection, and the twelve-year-old wound that signs it.
 *
 * The dissent from 프롤로그 02 goes up as 첨부 7 on the 27 April 2023 agenda of
 * the corporate loan committee, 8th floor of the head office. It never reaches
 * the table. At 13시 32분, twenty-eight minutes before the meeting opens, a
 * 과장 named 한서윤 signs it back at team level, and in the room he spends one
 * sentence on it: "첨부 7은 팀 검토 단계에서 반려했습니다. 안건에 영향 없습니다."
 * The chair says "반려된 부속 의견은 안건이 아닙니다." The meeting runs eleven
 * minutes. 310억 is approved with 제7조 attached. Nobody raises a voice, nobody
 * insults anybody, everybody is polite, and three years later 1,740 people pay
 * for those eleven minutes.
 *
 * The case belongs to 한서윤, because 사건 01 has him confess he was the one who
 * rejected it and never says why. Here is why. Twelve years ago he was a second
 * year reviewer who wrote a dissent of his own with a branch riding on it; it
 * went to the full table, it was not taken, and three months later he was posted
 * out for three years across four branches. What he brought back was two things:
 * how to write a document that does not get returned, and the belief that
 * standing on the returning side is how you keep people. He means "이건 자네를
 * 위한 겁니다" -- he means it about the seven people in his review room, three of
 * whom had a baby that year -- and that is the frightening part, not malice.
 *
 * 임경수, 기업대출심사팀장 with one year to retirement, appears for the first
 * time: the man who ties the paper originals with string while the electronic
 * copy of a returned attachment drops off the list after ninety days. On the
 * back of the last page there is a pencil line -- '반려 -- 윤. 사유는 묻지 말
 * 것.' -- and under it a printed 심사팀장 검토 의견 box with an erased '동의'.
 * Depending on the player's choices, they either watch him slide that one sheet
 * into his cardigan pocket or they do not; either way it is the sheet that comes
 * out of an envelope at his funeral in 사건 45. The evidence turn finds the
 * eleven-minute call from the team lead's room that preceded the rejection by
 * eleven minutes -- the recording 한서윤 cannot delete for three years.
 *
 * The final is what a person does after being returned: file for a re-review and
 * take it head on, keep a copy where nobody can return it, or believe the man who
 * says this was for you.
 */
export const prologue03Nodes = {
  p3_start: {
    phase: "PROLOGUE 03 BRIEFING",
    title: "첨부 7번",
    speaker: "오진우",
    text:
      "2023년 4월 27일 목요일 아침 8시 20분, KD은행 본점 4층 기업금융전략팀 심사실. 오후 2시 대출심사위원회 안건 목록이 새벽 다섯 시에 사내망에 올라왔습니다. 네 번째 안건이 2023-0412, 물류 플랫폼 플로우온 310억 원입니다. 당신이 쓴 반대 의견서는 본문이 아니라 '첨부 7'로 붙어 있습니다. 일곱 번째로 접수돼서 붙은 번호일 뿐인데, 하필 문제 삼은 조항도 제7조입니다. 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%, 기준선은 180%. 0.4%포인트 차이를 열한 쪽으로 쓴 문서입니다. 오진우가 종이컵 두 개를 들고 와 하나를 당신 책상에 내려놓습니다. '첨부는 위원장이 요청해야 읽혀요. 요청 안 하면 그냥 붙어 있는 거고요.' 그가 안건 목록을 손끝으로 두 번 두드립니다. '오늘 안건이 열한 개예요. 회의는 한 시간 잡혀 있고요. 열한 개를 한 시간에 하면 한 건에 몇 분 남는지 계산해 봤어요?'",
    memo: [
      "안건 4번: 2023-0412 플로우온 310억 원",
      "반대 의견서 -- 본문 아닌 '첨부 7', 11쪽",
      "오늘 안건 11건, 회의 배정 시간 60분",
      "위원회 개회까지 5시간 40분",
    ],
    triggers: ["responsibility", "order", "curiosity"],
    choices: [
      {
        id: "p3_start_ask",
        label: "한서윤 과장에게 마지막 장까지 읽어 달라고 직접 부탁한다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "p3_committee",
        cognition: { persistence: 2 },
      },
      {
        id: "p3_start_rule",
        label: "첨부를 본문 안건으로 올리는 절차를 규정에서 찾아 서면으로 요청한다",
        effect: { legitimacy: 11, trust: -2, time: -6, humanCost: 2, fatigue: 3 },
        next: "p3_committee",
        cognition: { inference: 2 },
      },
      {
        id: "p3_start_desk",
        label: "회의 시작 전에 위원 아홉 명 자리마다 한 장짜리 요약을 놓아 둔다",
        effect: { capital: 8, time: 5, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -1 },
        next: "p3_committee",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p3_committee",
      },
    ],
  },
  p3_committee: {
    phase: "THE COMMITTEE",
    title: "한 문장",
    speaker: "한서윤",
    text:
      "오후 2시, 본점 8층 대출심사위원회 회의실. 위원 아홉 명이 긴 탁자에 앉고, 배석자 여섯 명은 벽을 따라 놓인 의자에 앉습니다. 당신은 배석 네 번째 자리입니다. 위원장 진세라 부행장이 안건 4번을 부릅니다. 담당인 한서윤 과장이 일어서서 열네 줄을 읽습니다. 담보 구조, 매출 추이, 그리고 제7조. 빚이 기준선을 넘기면 은행이 대출을 즉시 거둬들일 수 있다는 조항입니다. 조건부 승인(조건을 붙여 내주는 승인)으로 올리자는 제안입니다. 진세라가 안경을 올립니다. '첨부 7이 반대 의견으로 돼 있던데요.' 한서윤이 고개를 한 번 숙입니다. '오늘 오전에 팀 검토 단계에서 반려했습니다. 안건에 영향 없습니다.' 진세라가 다음 장을 넘깁니다. '반려된 부속 의견은 안건이 아닙니다. 다음.' 그게 전부입니다. 아무도 소리를 높이지 않고, 아무도 당신을 보지 않습니다. 회의는 열한 개 안건을 마흔일곱 분에 끝냅니다.",
    memo: [
      "안건 4번 소요 시간 -- 4분 12초",
      "한서윤 발언: '팀 검토 단계에서 반려했습니다'",
      "진세라: '반려된 부속 의견은 안건이 아닙니다'",
      "2023-0412 승인 -- 310억, 제7조 포함",
    ],
    triggers: ["injustice", "helplessness", "order"],
    choices: [
      {
        id: "p3_committee_after",
        label: "회의가 끝난 뒤 한서윤을 붙잡고 이유부터 듣기로 한다",
        effect: { trust: 12, humanCost: -5, capital: -3, time: -4, fatigue: 5 },
        next: "p3_corridor",
        cognition: { persistence: 2 },
      },
      {
        id: "p3_committee_record",
        label: "첨부 7이 반려된 사실을 회의 기록에 남겨 달라고 그 자리에서 요청한다",
        effect: { legitimacy: 11, trust: 5, time: -6, humanCost: 3, fatigue: 5 },
        next: "p3_corridor",
        cognition: { inference: 2 },
      },
      {
        id: "p3_committee_stand",
        label: "배석 자리에서 손을 들어 3분만 달라고 위원장에게 말한다",
        effect: { capital: 7, time: 5, legitimacy: 2, trust: -2, humanCost: 3, fatigue: -3 },
        next: "p3_corridor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p3_corridor",
      },
    ],
  },
  p3_corridor: {
    phase: "TWELVE YEARS",
    title: "12년 전",
    speaker: "한서윤",
    text:
      "오후 2시 40분, 8층 복도. 위원들이 다 빠져나가고 형광등 두 개가 깜빡입니다. 한서윤이 창틀에 서류철을 내려놓고 먼저 말합니다. '12년 전에 저도 썼어요. 스물아홉이었고, 심사역 2년차였고요. 지점 하나가 걸린 건이었어요.' 그는 그때 자기 의견서가 본회의까지 올라갔다고 합니다. 위원 아홉 명 앞에서 읽혔고, 받아들여지지 않았고, 석 달 뒤에 발령(사람을 다른 자리로 보내는 인사 조치)을 받았습니다. 3년 동안 지점 네 곳을 돌았습니다. '돌아와서 두 가지를 배웠어요. 하나는 반려당하지 않는 문서를 쓰는 법이고요.' 그가 잠깐 멈춥니다. '하나는, 반려하는 쪽에 서면 사람을 지킬 수 있다는 거예요.' 그가 당신을 똑바로 봅니다. 화난 얼굴이 아니라 설명하는 얼굴입니다. '지금 심사실에 일곱 명 있어요. 그중 셋은 올해 아이가 태어났고요. 이건 자네를 위한 겁니다. 이 말, 나중에는 믿게 될 거예요.'",
    memo: [
      "한서윤 -- 12년 전 반대 의견서 작성, 본회의 상정",
      "석 달 뒤 지점 발령, 3년간 네 곳",
      "심사실 인원 7명 -- 그해 출산 3명",
      "그의 문장: '이건 자네를 위한 겁니다'",
    ],
    triggers: ["selfAwareness", "protection", "manipulation"],
    choices: [
      {
        id: "p3_corridor_listen",
        label: "그 3년 이야기를 복도에 선 채로 끝까지 듣는다",
        effect: { trust: 12, humanCost: -5, capital: -4, time: -5, fatigue: 5 },
        next: "p3_archive",
        cognition: { reframing: 2 },
      },
      {
        id: "p3_corridor_reason",
        label: "반려 사유를 서면으로 달라고 그 자리에서 요청한다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 2, capital: -1, fatigue: 4 },
        next: "p3_archive",
        cognition: { inference: 2 },
      },
      {
        id: "p3_corridor_push",
        label: "일곱 명 이야기는 접어 두고 숫자 이야기만 하자고 밀어붙인다",
        effect: { capital: 8, time: 4, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -2 },
        next: "p3_archive",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p3_archive",
      },
    ],
  },
  p3_archive: {
    phase: "PAPER AND SCREEN",
    title: "묶는 사람",
    speaker: "임경수",
    text:
      "저녁 6시 20분, 본점 지하 1층 기록 보관실. 형광등이 한 줄씩 켜지고, 노끈으로 묶인 서류 묶음이 철제 선반 아홉 칸을 채우고 있습니다. 기업대출심사팀장 임경수가 카디건 소매를 걷고 오늘 회의 서류를 묶고 있습니다. 정년까지 1년 2개월 남았다고, 묻지도 않았는데 먼저 말합니다. '전산에서는 반려된 첨부가 상태만 바뀌어요. 90일 지나면 목록에서 빠지고요. 찾으려면 문서번호를 알아야 하는데, 반려된 문서는 번호를 안 줍니다.' 그가 안경을 벗어 천천히 닦습니다. '종이는 달라요. 종이는 보존연한(문서를 반드시 남겨 둬야 하는 기간)까지 이 끈 안에 있어야 해요.' 그가 당신 의견서 마지막 장을 들어 뒤집습니다. 뒷면에 연필로 한 줄이 적혀 있습니다. '반려 -- 윤. 사유는 묻지 말 것.' 그 아래 인쇄된 '심사팀장 검토 의견' 칸에는 지우개로 문지른 자국이 남아 있습니다. 그가 그 칸을 손바닥으로 덮습니다. '자네가 본 건 앞장뿐이야. 뒷장은 늘 따로 있어.'",
    memo: [
      "전산: 반려 첨부는 90일 뒤 목록에서 사라짐",
      "종이 원본 -- 노끈 묶음, 보존연한까지 보관",
      "뒷장 연필 메모: '반려 -- 윤. 사유는 묻지 말 것.'",
      "심사팀장 검토 의견 칸 -- 지우개 자국",
    ],
    triggers: ["system", "trust", "curiosity"],
    choices: [
      {
        id: "p3_archive_trust",
        label: "뒷장은 선생님이 맡아 주시면 좋겠다고 부탁한다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, capital: -3, time: -4, fatigue: 4 },
        next: "p3_final",
        cognition: { reframing: 2 },
      },
      {
        id: "p3_archive_register",
        label: "뒷장까지 포함한 원본을 정식 보존 목록에 올려 달라고 요청한다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 3, fatigue: 4 },
        next: "p3_final",
        cognition: { inference: 2 },
      },
      {
        id: "p3_archive_copy",
        label: "복사기가 꺼지기 전에 뒷장까지 복사해 오늘 밤 들고 나간다",
        effect: { capital: 9, time: 4, legitimacy: -5, trust: -2, humanCost: 3, fatigue: -2 },
        next: "p3_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p3_final",
      },
    ],
  },
  p3_final: {
    phase: "FINAL DECISION",
    title: "반려 다음",
    speaker: "오진우",
    text:
      "밤 10시, 4층 심사실에 불이 두 개 남았습니다. 당신 자리와 오진우 자리입니다. 그가 자판기 커피 두 잔을 들고 와 하나를 놓습니다. 사내 규정집이 펼쳐져 있습니다. 반려 통지를 받은 사람은 5영업일 안에 재심(다시 심사해 달라는 요청)을 신청할 수 있습니다. 신청서에는 반려 사유에 대한 반박을 적게 돼 있는데, 반려 사유를 서면으로 받은 적이 없으니 반박할 칸이 비어 있습니다. 오진우가 규정집을 자기 쪽으로 돌려 놓고 한참 봅니다. '저희 아버지는 승인을 하루 늦춰서 밀려났어요. 저는 그래서 안 늦어요. 근데 오늘은 뭐가 빠른 건지 모르겠네요.' 그가 커피를 반쯤 마시고 종이컵을 내려놓습니다. '내일 아침 여덟 시 반이면 위원회 기록이 확정돼요. 그 전까지가 오늘이에요. 오늘 안에 뭘 할 건지만 정해요.'",
    memo: [
      "재심 신청 기한 -- 반려 통지일로부터 5영업일",
      "신청서의 반박란: 반려 사유 미수령으로 공란",
      "위원회 기록 확정: 다음 날 08시 30분",
      "심사실에 남은 사람 2명",
    ],
    triggers: ["choice", "responsibility", "trust"],
    choices: [
      {
        id: "p3_final_team",
        label: "심사실 일곱 명에게 오늘 있었던 일을 먼저 그대로 말한다",
        effect: { trust: 12, legitimacy: 5, humanCost: -5, capital: -6, time: -5, fatigue: 6 },
        next: "prologue03_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "p3_final_reason",
        label: "밤을 새워 재심 신청서와 반려 사유 요구서를 문서로 만든다",
        effect: { legitimacy: 13, trust: 3, capital: -5, time: -7, humanCost: 3, fatigue: 6 },
        next: "prologue03_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "p3_final_alone",
        label: "아무에게도 말하지 않고 내일 아침 혼자 8층으로 올라가기로 한다",
        effect: { capital: 10, time: 6, legitimacy: 3, trust: -5, humanCost: 4, fatigue: -2 },
        next: "prologue03_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "prologue03_result",
      },
    ],
  },
};

/**
 * Everything else 프롤로그 03 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const prologue03 = {
  id: "prologue03",
  nodes: prologue03Nodes,
  aftermath: {
    p3_aftershock: {
      phase: "AFTERMATH",
      title: "다음 날 여덟 시 이십 분",
      speaker: "한서윤",
      text: "4월 28일 금요일 아침 8시 20분, 어제와 같은 자리에 어제와 같은 종이컵이 놓입니다. 위원회 기록은 10분 뒤에 확정됩니다. 한서윤이 당신 책상 앞에 서 있습니다. 어제보다 목소리가 낮습니다. '어젯밤에 규정집 보셨죠. 5영업일 맞아요. 제가 알려 드릴 수도 있었는데 안 알려 드렸어요. 그것도 제 선택이었어요.' 그가 서류철 하나를 당신 책상 모서리에 올려놓습니다. 어제 회의의 배석자 명단입니다. 당신 이름 옆에 아무 표시가 없습니다. '재심을 걸면 이번엔 제 이름이 사유란에 들어가요. 사본을 남기면 저는 모르는 일이 되고요. 그냥 받아들이면, 3년 뒤에 아무도 오늘을 기억 못 해요.' 그가 처음으로 시선을 피합니다. '셋 다 제가 12년 전에 하나씩 해 본 거예요. 어떤 게 제일 나았는지는 아직도 모르겠어요.'",
      memo: ["위원회 기록 확정까지 10분", "배석자 명단 -- 당신 이름 옆 표시 없음", "한서윤: 재심 신청 기한을 알려 주지 않았다", "그가 12년 전에 셋 다 해 봤다고 함"],
      triggers: ["choice", "selfAwareness", "responsibility"],
      choices: [
        { id: "p3_after_appeal", label: "오늘 안에 재심을 신청하고 반려 사유를 정면으로 묻는다", effect: { legitimacy: 14, trust: 4, capital: -7, time: -6, humanCost: 3, fatigue: 6 }, next: "prologue03_result", cognition: { persistence: 2, inference: 1 } },
        { id: "p3_after_copy", label: "재심은 걸지 않고 원본과 뒷장의 사본을 따로 남겨 둔다", effect: { capital: 9, legitimacy: 5, trust: -3, time: 3, humanCost: 3, fatigue: 2 }, next: "prologue03_result", cognition: { risk: 2 } },
        { id: "p3_after_accept", label: "반려를 받아들이고 한서윤의 말을 믿어 보기로 한다", effect: { trust: 12, humanCost: -5, legitimacy: -8, time: 5, fatigue: -6 }, next: "prologue03_result", cognition: { reframing: 2 } },
      ],
    },
  },
  aftermathRoute: ["p3_final", "p3_aftershock"],
  connectiveScenes: [
    ["p3_minutes", "p3_committee", "p3_corridor", "부속 의견 없음", "진세라", "회의가 끝나고 위원들이 나간 뒤에도 진세라 부행장은 자리에 남아 안건 목록을 넘겨 봅니다. 배석 자리를 정리하던 당신을 보고 손짓으로 부릅니다. 그가 보고 있는 것은 방금 만들어진 의사록(회의 내용을 적은 공식 기록) 초안입니다. 안건 4번 항목의 마지막 줄은 여섯 글자입니다. '부속 의견 없음.' 진세라가 그 줄을 펜 끝으로 짚습니다. '내가 오늘 이 방에서 들은 말은 반려했다는 말이지, 의견이 없었다는 말이 아니에요.' 그가 펜을 내려놓습니다. '그런데 위원장은 부속 문서를 직접 열 권한이 없어요. 요청할 권한만 있고, 요청은 개회 전에 해야 하고요. 나는 오늘 그 요청을 안 했어요.'", ["의사록 초안 -- 안건 4번: '부속 의견 없음'", "위원장 권한: 개회 전 부속 문서 열람 요청", "진세라: 오늘 그 요청을 하지 않았음", "기록 확정까지 18시간"], ["'부속 의견 없음' 여섯 글자를 고쳐 달라고 부행장에게 직접 말한다", "반려된 첨부 7이 있었다는 사실을 기록에 각주로 남겨 달라고 요청한다", "기록은 두고 다음 회의의 발언 기회부터 약속받는다"]],
    ["p3_stairwell", "p3_corridor", "p3_archive", "4번 창구", "도윤하", "오후 4시 10분, 본점 비상계단 4층과 5층 사이. 모르는 번호로 전화가 옵니다. 강서지점 창구 행원 도윤하입니다. 목소리가 밝습니다. '본점에 아는 분이 여기밖에 없어서요. 이번 달 판매 목록에 새 상품이 떴는데, 설명 자료가 두 장이에요. 앞장은 상품 이름이고 뒷장은 다 표예요.' 그가 상품 코드를 읽어 줍니다. 2023-0412에 연계된 상품입니다. 오늘 오후 2시에 승인된 대출이 두 시간 만에 지점 창구까지 내려간 셈입니다. '이거 손님한테 뭐라고 설명해요? 제가 모르는 걸 파는 게 불완전판매(내용을 제대로 알리지 않고 파는 것)잖아요. 지점장님은 그냥 실적판에 올리라고 하시는데요.' 계단 아래에서 누군가 문을 여는 소리가 납니다.", ["강서지점 창구 판매 개시 -- 승인 2시간 뒤", "설명 자료 2장, 뒷장 전부 표", "도윤하: 상품 내용을 모르는 상태", "지점 실적판에 신규 항목 추가됨"], ["지금 아는 것을 전화로 하나도 빼지 않고 다 말해 준다", "창구에 내려가는 상품 설명 자료를 본점에 공식 요청한다", "확정된 게 없다며 다음에 설명하겠다고 끊는다"]],
    ["p3_boiler", "p3_archive", "p3_final", "자리를 그려 주는 사람", "윤상혁", "밤 9시, 4층 팀장실. 윤상혁 기업금융전략팀장이 블라인드를 반쯤 내린 방에서 당신을 기다리고 있습니다. 그는 오늘 일을 나무라지 않습니다. 나무라는 대신 종이를 한 장 꺼내 당신 앞날을 그려 줍니다. 내년에 신설될 분석 조직 이야기입니다. 이름도 아직 없고, 사람도 아직 없고, 자리가 네 개 있는데 그중 하나가 비어 있다고 합니다. '자네 판단이 틀렸다고 한 적은 없네. 다만 그 판단이 설 자리는 내가 정하지.' 그가 서류철을 덮습니다. 덮는 속도가 대답입니다. 그의 서류철 앞장에는 서명란이 비어 있습니다. 나가려는 당신에게 그가 덧붙입니다. '오늘 한 과장이 뭐라던가. 자네를 위한 거라고 했지? 그 사람은 그렇게 믿고 있어. 믿는 사람은 편해.'", ["내년 신설 예정 분석 조직 -- 자리 4개 중 1개 공석", "윤상혁 서류철 앞장 -- 서명란 비어 있음", "그의 말: '그 판단이 설 자리는 내가 정하지'", "면담 시간 9분"], ["자리 이야기 말고 오늘 반려 사유부터 묻는다", "제안의 조건과 일정을 문서로 달라고 한다", "자리 제안을 일단 받아 두고 시간을 번다"]],
  ],
  connectiveOrder: [["p3_committee", "p3_minutes"], ["p3_corridor", "p3_stairwell"], ["p3_archive", "p3_boiler"]],
  choiceEffects: {
    p3_committee: [
      { trust: 10, legitimacy: 4, humanCost: -4, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -2, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    p3_corridor: [
      { trust: 10, humanCost: -5, time: -5, capital: -3, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -6, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    p3_archive: [
      { legitimacy: 8, trust: 5, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 6, trust: -5, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    p3_committee: {
      voice: ["'부속 의견 없음' 여섯 글자를, 부행장에게 직접 고쳐 달라고 말한다.", "반려된 첨부 7이 있었다는 사실을, 기록에 각주로 남겨 달라고 요청한다.", "기록은 두고, 다음 회의의 발언 기회부터 약속받는다."],
      echo: ["말하면 진세라가 펜을 다시 듭니다. 그리고 여섯 글자를 그대로 둔 채 그 옆에 물음표를 하나 그립니다.", "각주가 붙으면 첨부 7은 '없던 것'에서 '반려된 것'이 됩니다. 반려한 사람의 이름도 그 각주에 함께 들어갑니다.", "약속은 받습니다. 다음 회의는 5월 25일이고, 2023-0412는 그 전에 실행됩니다."],
    },
    p3_corridor: {
      voice: ["지금 아는 것을, 전화로 하나도 빼지 않고 다 말해 준다.", "창구에 내려가는 상품 설명 자료를, 본점에 공식 요청한다.", "확정된 게 없다며, 다음에 설명하겠다고 끊는다."],
      echo: ["다 말하면 도윤하가 한참 조용합니다. 그리고 묻습니다. '그럼 저는 오늘 몇 건을 판 거예요?'", "요청이 들어가면 자료는 만들어집니다. 만드는 부서는 이 상품을 설계한 부서와 같은 부서입니다.", "끊고 나면 조용합니다. 강서지점 실적판에는 그날 저녁까지 네 건이 더 올라갑니다."],
    },
    p3_archive: {
      voice: ["자리 이야기 말고, 오늘 반려 사유부터 묻는다.", "제안의 조건과 일정을, 문서로 달라고 한다.", "자리 제안을 일단 받아 두고, 시간을 번다."],
      echo: ["물으면 윤상혁이 처음으로 웃습니다. '사유를 물으면 사유가 생기지. 그게 자네한테 좋을까.'", "문서로 달라고 하면 그가 펜을 들었다가 놓습니다. '아직 이름도 없는 조직일세. 이름 없는 건 서면이 안 나와.'", "받아 두면 그날 밤 그의 서류철 서명란은 여전히 비어 있습니다. 비어 있는 칸은 나중에 채워집니다."],
    },
  },
  reactionScenes: [
    ["p3_minutes_reaction", "p3_minutes", "p3_corridor", "수첩 첫 장", "반재욱", "회의실을 나서다 복도 자판기 앞에서 배석자 한 명과 마주칩니다. 감사팀 조사역 3년차 반재욱입니다. 표지가 아직 뻣뻣한 검은 수첩을 들고 있습니다. 첫 장에 오늘 날짜와 두 줄이 적혀 있습니다. '안건 4번 4분 12초', 그리고 '부속 의견 없음 -- 반려됐다는 말은 들었음'. 그가 펜을 멈추고 당신을 봅니다. '저는 오늘 감사 나온 게 아니라 순번으로 배석한 겁니다. 그래서 아무 권한도 없어요.' 그가 수첩을 덮었다가 다시 폅니다. '다만 적는 건 권한이 아니라 습관이라서요. 혹시 그 첨부 7, 몇 쪽이었습니까? 쪽수는 적어 두고 싶어서요.'", ["오늘 회의에서 본 것을 반재욱에게 그대로 말한다", "수첩에 적힌 시각을 나중에 확인해 줄 수 있는지 묻는다", "감사팀과 엮여서 좋을 게 없다며 자리를 뜬다"]],
    ["p3_stairwell_reaction", "p3_stairwell", "p3_archive", "하루 늦춘 승인", "오진우", "전화를 끊고 계단을 올라가자 오진우가 5층 문 앞에 서 있습니다. 통화를 어디까지 들었는지는 말하지 않습니다. 대신 자기 이야기를 합니다. '저희 아버지 성함이 오상철이에요. 지점장이셨고요. 한 건을 하루 늦게 올리셨어요. 딱 하루요.' 그가 계단 난간을 손바닥으로 문지릅니다. '그 하루 때문에 다른 은행에 거래처를 뺏겼다고 했어요. 그해 겨울에 지점 세 개짜리 관리 부서로 가셨고, 거기서 5년 계시다 그만두셨어요. 저는 그때 고등학생이었고요.' 그가 웃으려다 맙니다. '그래서 저는 안 늦어요. 그런데 오늘 보니까, 빠른 것도 그냥 반려되네요.'", ["아버지 이야기를 끝까지 듣고 오늘은 같이 퇴근한다", "오늘 반려 건을 둘이 함께 기록해 두자고 한다", "그 이야기는 오늘 일과 상관없다며 선을 긋는다"]],
    ["p3_boiler_reaction", "p3_boiler", "p3_final", "카디건 주머니", "임경수", "밤 9시 40분, 팀장실에서 내려와 지하 1층을 지나가는데 기록 보관실 문이 아직 열려 있습니다. 임경수가 오늘 묶음의 마지막 매듭을 짓고 있습니다. 매듭을 두 번 조이고, 묶음을 선반 일곱 번째 칸에 올립니다. 그리고 탁자에 남은 종이 한 장을 들어 반으로 접습니다. 당신 의견서의 마지막 장, 뒷면에 연필 한 줄이 있는 그 종이입니다. 그가 그것을 카디건 안주머니에 넣습니다. 넣고 나서 당신이 서 있는 것을 봅니다. 놀라지 않습니다. '이 종이는 90일 뒤에 목록에서 빠져요. 목록에서 빠진 종이는 태워도 아무도 몰라요.' 그가 안경을 벗어 닦습니다. '그래서 여기 두면 안 되는 겁니다.'", ["그 한 장을 왜 가져가시는지 그 자리에서 묻는다", "가져간 기록을 반출 대장에 적어 달라고 부탁한다", "못 본 것으로 하고 조용히 계단을 올라간다"]],
  ],
  reactionEffects: {
    p3_minutes: [
      { trust: 9, legitimacy: 4, humanCost: -3, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, humanCost: 2, capital: -1, fatigue: 3 },
      { time: 4, capital: 4, trust: -4, legitimacy: -3, humanCost: 3, fatigue: -2 },
    ],
    p3_stairwell: [
      { trust: 10, humanCost: -4, capital: -3, time: -4, fatigue: 4 },
      { legitimacy: 9, trust: 4, humanCost: 2, time: -5, fatigue: 3 },
      { time: 4, capital: 3, trust: -5, humanCost: 3, fatigue: -3 },
    ],
    p3_boiler: [
      { trust: 10, legitimacy: 3, humanCost: -4, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 10, trust: 2, time: -4, humanCost: 3, capital: -1, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    p3_minutes: {
      voice: ["오늘 회의에서 본 것을, 반재욱에게 그대로 말한다.", "수첩에 적힌 시각을, 나중에 확인해 줄 수 있는지 묻는다.", "감사팀과 엮여서 좋을 게 없다며, 자리를 뜬다."],
      echo: ["말하면 반재욱이 열한 쪽이라는 숫자를 적습니다. 그 아래에 '쪽수는 남고 내용은 안 남음'이라고 덧붙입니다.", "묻자 그가 손목시계와 수첩의 시각을 맞춰 봅니다. '3년 뒤에도 같은 수첩을 들고 다닐 겁니다.'", "자리를 뜨면 반재욱은 아무 말 없이 수첩을 닫습니다. 첫 장의 두 줄은 지우지 않습니다."],
    },
    p3_stairwell: {
      voice: ["아버지 이야기를 끝까지 듣고, 오늘은 같이 퇴근한다.", "오늘 반려 건을, 둘이 함께 기록해 두자고 한다.", "그 이야기는 오늘 일과 상관없다며, 선을 긋는다."],
      echo: ["같이 나가면 오진우가 지하철역까지 걷는 동안 아버지 이야기를 두 번 더 합니다. 두 번 다 끝을 맺지 못합니다.", "함께 적자고 하면 그가 한참 망설이다 자기 이름을 두 번째 줄에 씁니다. 첫 줄은 비워 둡니다.", "선을 그으면 오진우가 '그렇죠'라고 하고 먼저 올라갑니다. 그날 이후 그는 당신 앞에서 아버지 이야기를 꺼내지 않습니다."],
    },
    p3_boiler: {
      voice: ["그 한 장을 왜 가져가시는지, 그 자리에서 묻는다.", "가져간 기록을, 반출 대장에 적어 달라고 부탁한다.", "못 본 것으로 하고, 조용히 계단을 올라간다."],
      echo: ["물으면 임경수가 안경을 다시 씁니다. '언젠가 자네가 찾을 거야. 그때 없으면 곤란하지 않겠나.'", "대장에 적으면 종이의 행방은 남습니다. 대신 그 대장을 읽는 사람은 종이가 어디 있는지도 알게 됩니다.", "올라가면 그 한 장은 기록 어디에도 없는 상태가 됩니다. 어디에 있는지 아는 사람이 두 명 생깁니다."],
    },
  },
  reactionMemos: {
    p3_minutes_reaction: ["반재욱 수첩 첫 장 -- '안건 4번 4분 12초'", "첨부 7의 쪽수: 11쪽"],
    p3_stairwell_reaction: ["오상철 -- 승인을 하루 늦춘 지점장", "그해 겨울 관리 부서 발령, 5년 뒤 퇴직"],
    p3_boiler_reaction: ["임경수가 뒷장 한 장을 카디건 안주머니에 넣음", "'목록에서 빠진 종이는 태워도 아무도 모른다'"],
  },
  branchPlan: ["p3_corridor", 0, "p3_branch_closed", "p3_branch_closed_follow"],
  branchScenes: {
    // PROLOGUE 03's detour is the branch 한서윤 lost twelve years ago. The
    // corridor is where he explains himself; the side door is where the player
    // sees what the explanation is made of -- a shuttered office and a copy he
    // still carries.
    p3_branch_closed: {
      phase: "SIDE DOOR",
      title: "닫힌 지점",
      speaker: "한서윤",
      text: "복도에서 3년 이야기를 끝까지 듣자 한서윤이 차 키를 꺼냅니다. '30분이면 돼요. 보여 드릴 게 있어요.' 서대문구 연희동, 좁은 삼거리 모퉁이입니다. 12년 전 그가 지키려던 KD은행 연희동지점 자리입니다. 지금은 1층이 편의점이고 2층이 무인 세탁소입니다. 은행 간판이 있던 자리에 볼트 구멍 여섯 개가 그대로 남아 있습니다. 한서윤이 그 구멍을 올려다봅니다. '그때 제 의견서가 본회의에서 읽혔어요. 위원 아홉 명 앞에서요. 다 들으시고 승인하셨어요. 읽히는 게 이기는 건 줄 알았는데, 읽히기만 했어요.' 편의점 유리문이 열리고 야간 근무자가 담배를 피우러 나옵니다. '이 지점에 열네 명 있었어요. 지금 은행에 남은 사람은 저 하나예요.'",
      memo: ["KD은행 연희동지점 -- 12년 전 폐점", "현재: 1층 편의점, 2층 무인 세탁소", "당시 직원 14명 중 은행 잔류 1명", "한서윤 의견서 -- 본회의 상정 후 승인"],
      triggers: ["helplessness", "affection", "selfAwareness"],
      choices: [
        { id: "p3_branch_closed_a", label: "그 열네 명이 지금 어디 있는지 같이 세어 본다", effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 5 }, next: "p3_branch_closed_follow", cognition: { persistence: 2 } },
        { id: "p3_branch_closed_b", label: "12년 전 그 의견서가 어디에 보관돼 있는지 묻는다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 3 }, next: "p3_branch_closed_follow", cognition: { inference: 2 } },
        { id: "p3_branch_closed_c", label: "옛날 이야기는 됐다며 오늘 건 이야기로 돌아간다", effect: { time: 6, capital: 5, trust: -4, humanCost: 2, fatigue: -3 }, next: "p3_branch_closed_follow", cognition: { risk: 1 } },
      ],
    },
    p3_branch_closed_follow: {
      phase: "SIDE DOOR",
      title: "접힌 사본",
      speaker: "한서윤",
      text: "차로 돌아가 시동을 걸기 전에 한서윤이 조수석 사물함을 엽니다. 안쪽에서 네 번 접힌 종이 뭉치가 나옵니다. 12년 전 자기 반대 의견서의 사본입니다. 접힌 자리가 하얗게 닳아서 글자가 몇 개 끊겨 있습니다. '12년 동안 차를 세 번 바꿨는데 이건 계속 옮겼어요. 왜 그러는지는 저도 몰라요.' 그가 첫 장을 펴 보여 줍니다. 결론 문단에 빨간 펜으로 그어진 줄이 있습니다. 그가 나중에 스스로 그은 줄입니다. '여기가 틀렸어요. 여기서 제가 너무 확신했어요. 그래서 안 먹힌 거예요.' 그가 종이를 다시 접습니다. '자네 의견서도 여기가 그래요. 저는 그걸 고쳐 주려던 거예요. 반려하면 고칠 시간이 생기잖아요.' 그가 그렇게 말하고 자기 말을 한 번 더 듣는 사람처럼 잠깐 조용합니다.",
      memo: ["12년 전 사본 -- 네 번 접힌 채 차에 보관", "결론 문단에 본인이 그은 빨간 줄", "그의 해석: '너무 확신해서 안 먹혔다'", "연희동에서 본점까지 28분"],
      triggers: ["selfAwareness", "manipulation", "affection"],
      choices: [
        { id: "p3_branch_closed_follow_a", label: "확신이 문제였던 게 아니라고 그 자리에서 말해 준다", effect: { trust: 13, legitimacy: 3, humanCost: -4, capital: -4, time: -4, fatigue: 5 }, next: "p3_stairwell", cognition: { reframing: 3 } },
        { id: "p3_branch_closed_follow_b", label: "그 사본을 오늘 건 옆에 나란히 놓고 같이 읽자고 한다", effect: { legitimacy: 12, trust: 5, time: -6, humanCost: 2, fatigue: 4 }, next: "p3_stairwell", cognition: { inference: 2 } },
        { id: "p3_branch_closed_follow_c", label: "고칠 시간을 준 거면 사유를 달라며 사본을 돌려준다", effect: { time: 5, capital: 6, legitimacy: 4, trust: -4, humanCost: 3, fatigue: -3 }, next: "p3_stairwell", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "p3_start",
    result: "p3_aftershock",
    defaultFree: "p3_route_system",
    // One meeting, one sentence. Like 사건 24 the chapter does not fork on a
    // route; the split is what the analyst does after being returned.
    choices: {},
    system: {
      route: "p3_route_system",
      final: "p3_final_system_route",
      title: "묶음 서른네 개",
      speaker: "임경수",
      text: "준비된 보기 밖의 문장을 쓰자 임경수가 선반 맨 아래 칸을 가리킵니다. 지난 10년 동안 대출심사위원회에 부속으로 올라간 반대 의견서가 34건입니다. 그가 묶음을 하나씩 짚어 가며 셉니다. 본회의에서 실제로 읽힌 것은 2건입니다. 나머지 32건은 전부 팀 검토 단계에서 돌아왔습니다. 그리고 그가 다른 선반의 인사 기록을 펴서 숫자를 하나 더 말합니다. 그 32명 중 26명이 2년 안에 본점을 떠났습니다. 남은 6명 중 4명은 그 뒤로 반대 의견을 쓴 적이 없습니다. '이게 규정에 적혀 있으면 사람들이 화를 낼 텐데, 적혀 있지 않으니까 아무도 화를 안 내요. 숫자는 여기 이 끈 안에만 있고요.'",
      memo: ["10년간 부속 반대 의견서 34건", "본회의 낭독 2건 -- 팀 단계 반려 32건", "32명 중 26명 2년 내 본점 이탈", "남은 6명 중 4명: 이후 반대 의견 0건"],
      routeChoices: [
        ["p3_route_system_list", "34건의 목록을 문서로 정리해 위원회에 정식으로 낸다", { legitimacy: 12, trust: 4, capital: -6, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["p3_route_system_find", "본점을 떠난 26명을 찾아 그때 무슨 일이 있었는지 듣는다", { trust: 10, legitimacy: 4, humanCost: -5, capital: -4, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["p3_route_system_keep", "숫자는 접어 두고 오늘 내 건에만 쓴다", { time: 7, capital: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "부속 반대 의견은 반드시 본회의에서 읽게 하는 규칙을 제안한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -4, time: -1, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 두고 내 첨부 7만 다시 올리는 길을 찾는다", { capital: 7, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "반려된 32건의 작성자들에게 먼저 이 숫자를 보낸다", { legitimacy: 9, trust: 9, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "p3_evidence_turn",
    result: "p3_aftershock",
    sourceRoutes: ["p3_committee", "p3_corridor", "p3_archive", "p3_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 반려 처리 기록 옆에 놓고, 그 한 문장이 몇 시에 만들어졌는지 맞춰 본다.",
    entryEcho: "단서를 대면 반려의 시각이 열립니다. 결정한 시각과 통보한 시각은 다를 수 있습니다.",
    title: "28분",
    speaker: "반재욱",
    text: "단서를 맞추자 반재욱이 배석자 권한으로 뽑을 수 있는 처리 기록 한 장을 내밉니다. 첨부 7의 반려 처리 시각은 13시 32분입니다. 위원회 개회 28분 전입니다. 그 바로 앞에 사내 전화 기록이 한 줄 있습니다. 13시 21분, 4층 팀장실 내선에서 한서윤 자리 내선으로, 통화 시간 11분. 반재욱이 손목시계를 봅니다. '11분 통화가 끝나고 1분 만에 반려가 눌렸습니다. 문서를 열한 쪽 읽고 누른 시간은 아니죠.' 그가 수첩에 두 시각을 적고 그 사이에 화살표를 그립니다. '한서윤 과장은 아까 복도에서 12년 전 이야기를 했다면서요. 그건 사유가 아니라 이유입니다. 사유는 이 11분 안에 있습니다.' 그리고 그가 뒷장의 연필 한 줄을 다시 읽습니다. '반려 -- 윤. 사유는 묻지 말 것. 이 글씨, 한서윤 과장 글씨가 아닙니다.'",
    memo: ["첨부 7 반려 처리: 13시 32분 -- 개회 28분 전", "직전 통화: 13시 21분, 팀장실 내선 → 한서윤 자리, 11분", "뒷장 연필 글씨 -- 한서윤의 필체가 아님"],
    triggers: ["injustice", "manipulation", "system"],
    entryEffect: { legitimacy: 7, trust: 5, time: -3, capital: -2, fatigue: 4 },
    choices: [
      ["p3_evidence_turn_ask", "그 11분에 무슨 말을 들었는지 한서윤에게 직접 묻는다", { trust: 12, legitimacy: 6, capital: -7, humanCost: -6, time: -1, fatigue: 8 }, { reframing: 2 }],
      ["p3_evidence_turn_file", "두 시각과 통화 기록을 재심 신청서에 그대로 붙인다", { legitimacy: 13, trust: 5, capital: -8, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["p3_evidence_turn_hold", "이 기록은 쥐고 있다가 필요한 자리에서 처음 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "p3_branch_closed",
    systemNext: "p3_route_system",
    evidenceNext: "p3_evidence_turn",
    routeLabel: "복도에서 들은 12년 전 이야기가 어디서 시작됐는지 따라가 본다",
    systemLabel: "직전 자유응답 문장이 지난 10년 묶음에도 있었는지 찾아본다",
    evidenceLabel: "직전 단서를 붙여 반려가 몇 시에 눌렸는지 연다",
  },
  openingRoutes: {
    p2_after_alone: "p3_start_alone",
    p2_after_shared: "p3_start_shared",
    p2_after_soften: "p3_start_soften",
  },
  openingCopy: {
    p3_start_alone: ["이름이 하나뿐인 첨부", "오진우", "당신은 마지막에 서명란을 혼자 채웠습니다. 열한 쪽 끝에 이름이 하나입니다. 새벽 다섯 시에 올라온 안건 목록에서 그 문서는 '첨부 7'이 됐고, 작성자 칸에는 당신 이름만 있습니다. 아침 8시 20분, 심사실 문을 열자 사람들이 화면에서 눈을 떼지 않습니다. 이미 다 본 얼굴들입니다. 오진우가 종이컵 두 개를 들고 와 하나를 내려놓고, 목소리를 낮춥니다. '어제 저녁에 팀에서 이거 이름 하나짜리라고 두 번 얘기 나왔어요. 좋은 뜻으로 한 사람도 있었고요.' 그가 안건 목록의 네 번째 줄을 짚습니다. '이름이 하나면 반려도 한 번이면 끝나요. 그게 저쪽한테 제일 싼 방법이고요.'", ["첨부 7 작성자 -- 1명", "어제 저녁 팀 내부 언급 2회", "안건 4번 배정 시간 추정 5분", "개회까지 5시간 40분"]],
    p3_start_shared: ["밤새 전화를 받은 이름들", "오진우", "당신은 의견서를 공동 명의로 올렸습니다. 서명한 사람은 당신을 포함해 네 명입니다. 새벽 한 시부터 그 네 명 중 세 명에게 차례로 전화가 갔습니다. 건 사람은 각자 달랐고, 내용은 거의 같았습니다. 지금 이름을 빼면 없던 일로 해 준다는 것입니다. 아침 8시 20분, 심사실에 들어서자 세 사람이 각자 자기 자리에서 화면만 봅니다. 한 명은 아직 출근 전입니다. 오진우가 종이컵을 내려놓으며 말합니다. '밤새 전화 세 통이면, 저쪽은 이 문서를 읽었다는 뜻이에요. 안 읽었으면 전화할 이유가 없잖아요.' 그가 잠깐 웃다 맙니다. '읽혔는데도 오늘 안건에는 첨부로 붙어 있네요.'", ["공동 서명 4명 -- 새벽 전화 3명", "전화 내용: 이름을 빼면 없던 일로", "미출근 1명", "개회까지 5시간 40분"]],
    p3_start_soften: ["반대로 읽히지 않는 문장", "오진우", "당신은 마지막 밤에 결론 문단을 다시 썼습니다. '승인해서는 안 된다'가 '추가 확인이 필요하다'가 됐고, 179.6%라는 숫자는 본문에서 각주로 내려갔습니다. 새벽에 올라온 안건 목록에서 첨부 7의 제목은 '검토 참고 사항'입니다. 반대 의견이라는 말이 어디에도 없습니다. 아침 8시 20분, 오진우가 안건 목록을 보다가 당신 화면과 번갈아 봅니다. '이거 제목만 보면 찬성 자료 같은데요.' 그가 종이컵을 내려놓습니다. '부드럽게 쓰면 안 걸린다고 배우잖아요. 맞아요, 안 걸려요. 근데 안 걸린 문서는 안 읽혀요.' 심사실 전화가 한 번 울리다 끊깁니다.", ["첨부 7 제목: '검토 참고 사항'", "결론 문단 -- '추가 확인이 필요하다'로 수정", "179.6% -- 본문에서 각주로 이동", "개회까지 5시간 40분"]],
  },
  openingSignatures: {
    p3_start_alone: {
      label: "이름이 하나뿐인 문서를 그대로 들고 8층에 먼저 올라간다",
      effect: { trust: 4, legitimacy: 11, capital: -4, time: -5, humanCost: 3, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "이름이 하나뿐인 문서를 그대로 들고, 8층에 먼저 올라간다.",
      echo: "올라가면 회의실은 아직 잠겨 있습니다. 문 앞 게시판에 오늘 안건 열한 개가 붙어 있고, 네 번째 줄 옆에 이미 연필 표시가 하나 있습니다.",
    },
    p3_start_shared: {
      label: "밤새 전화를 받은 세 사람을 먼저 모아 놓고 이야기한다",
      effect: { trust: 12, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "밤새 전화를 받은 세 사람을 먼저 모아 놓고, 이야기한다.",
      echo: "모이면 셋 다 같은 말을 합니다. '이름은 안 뺄게요.' 그리고 셋 다 누가 전화했는지는 말하지 않습니다.",
    },
    p3_start_soften: {
      label: "제목부터 '반대 의견'으로 되돌려 달라고 오늘 아침에 요청한다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "제목부터 '반대 의견'으로 되돌려 달라고, 오늘 아침에 요청한다.",
      echo: "요청은 접수됩니다. 접수 담당자가 알려 줍니다. 안건 목록은 새벽 다섯 시에 확정됐고, 제목 수정은 다음 회의부터 반영됩니다.",
    },
  },
  voiceLines: {
    // PROLOGUE 03. Nobody in this chapter shouts, so no line is allowed to sound
    // like a fight. Every one of them is said politely, to a polite person.
    p3_start_ask: "한서윤 과장에게, 마지막 장까지 읽어 달라고 직접 부탁한다.",
    p3_start_rule: "첨부를 본문 안건으로 올리는 절차를, 규정에서 찾아 서면으로 요청한다.",
    p3_start_desk: "회의 시작 전에, 위원 아홉 명 자리마다 한 장짜리 요약을 놓아 둔다.",
    p3_committee_after: "회의가 끝난 뒤 한서윤을 붙잡고, 이유부터 듣기로 한다.",
    p3_committee_record: "첨부 7이 반려된 사실을, 회의 기록에 남겨 달라고 그 자리에서 요청한다.",
    p3_committee_stand: "배석 자리에서 손을 들어, 3분만 달라고 위원장에게 말한다.",
    p3_corridor_listen: "그 3년 이야기를, 복도에 선 채로 끝까지 듣는다.",
    p3_corridor_reason: "반려 사유를 서면으로 달라고, 그 자리에서 요청한다.",
    p3_corridor_push: "일곱 명 이야기는 접어 두고, 숫자 이야기만 하자고 밀어붙인다.",
    p3_branch_closed_a: "그 열네 명이 지금 어디 있는지, 같이 세어 본다.",
    p3_branch_closed_b: "12년 전 그 의견서가, 어디에 보관돼 있는지 묻는다.",
    p3_branch_closed_c: "옛날 이야기는 됐다며, 오늘 건 이야기로 돌아간다.",
    p3_branch_closed_follow_a: "확신이 문제였던 게 아니라고, 그 자리에서 말해 준다.",
    p3_branch_closed_follow_b: "그 사본을 오늘 건 옆에 나란히 놓고, 같이 읽자고 한다.",
    p3_branch_closed_follow_c: "고칠 시간을 준 거면 사유를 달라며, 사본을 돌려준다.",
    p3_archive_trust: "뒷장은 선생님이 맡아 주시면 좋겠다고, 부탁한다.",
    p3_archive_register: "뒷장까지 포함한 원본을, 정식 보존 목록에 올려 달라고 요청한다.",
    p3_archive_copy: "복사기가 꺼지기 전에, 뒷장까지 복사해 오늘 밤 들고 나간다.",
    p3_final_team: "심사실 일곱 명에게, 오늘 있었던 일을 먼저 그대로 말한다.",
    p3_final_reason: "밤을 새워, 재심 신청서와 반려 사유 요구서를 문서로 만든다.",
    p3_final_alone: "아무에게도 말하지 않고, 내일 아침 혼자 8층으로 올라가기로 한다.",
    p3_after_appeal: "오늘 안에 재심을 신청하고, 반려 사유를 정면으로 묻는다.",
    p3_after_copy: "재심은 걸지 않고, 원본과 뒷장의 사본을 따로 남겨 둔다.",
    p3_after_accept: "반려를 받아들이고, 한서윤의 말을 믿어 보기로 한다.",
    p3_route_system_list: "34건의 목록을 문서로 정리해, 위원회에 정식으로 낸다.",
    p3_route_system_find: "본점을 떠난 26명을 찾아, 그때 무슨 일이 있었는지 듣는다.",
    p3_route_system_keep: "숫자는 접어 두고, 오늘 내 건에만 쓴다.",
    p3_final_system_route_a: "부속 반대 의견은, 반드시 본회의에서 읽게 하는 규칙을 제안한다.",
    p3_final_system_route_b: "규칙은 두고, 내 첨부 7만 다시 올리는 길을 찾는다.",
    p3_final_system_route_c: "반려된 32건의 작성자들에게, 먼저 이 숫자를 보낸다.",
    p3_evidence_turn_ask: "그 11분에 무슨 말을 들었는지, 한서윤에게 직접 묻는다.",
    p3_evidence_turn_file: "두 시각과 통화 기록을, 재심 신청서에 그대로 붙인다.",
    p3_evidence_turn_hold: "이 기록은 쥐고 있다가, 필요한 자리에서 처음 꺼낸다.",
  },
  echoReplies: {
    // PROLOGUE 03.
    p3_start_ask: "부탁하면 한서윤이 '읽었습니다'라고 답합니다. 그리고 몇 쪽을 읽었는지는 말하지 않습니다.",
    p3_start_rule: "규정에는 절차가 있습니다. 부속 문서를 본문으로 올리려면 담당 과장의 검토 의견이 먼저 붙어야 합니다.",
    p3_start_desk: "요약은 아홉 자리에 다 놓입니다. 개회 직전에 진행 담당자가 일곱 장을 걷어 갑니다. 회의 자료가 아니라는 이유입니다.",
    p3_committee_after: "붙잡기로 하면 한서윤이 먼저 복도에서 기다립니다. 그는 오늘 이 대화를 예상하고 있었습니다.",
    p3_committee_record: "요청하면 진행 담당자가 위원장을 봅니다. 진세라가 3초 뒤에 '적어 두세요'라고 합니다. 그 3초 동안 아무도 움직이지 않습니다.",
    p3_committee_stand: "손을 들면 회의실이 조용해집니다. 진세라가 '배석자 발언은 위원 요청이 있을 때만'이라고 하고, 아무도 요청하지 않습니다.",
    p3_corridor_listen: "끝까지 들으면 한서윤의 이야기는 20분이 걸립니다. 그가 다 말하고 나서 '이런 얘기 처음 해요'라고 합니다.",
    p3_corridor_reason: "서면을 요청하면 그가 잠깐 웃습니다. '사유서를 쓰면 제 이름이 거기 남아요. 그래도 원하시면 쓰겠습니다.'",
    p3_corridor_push: "숫자 이야기만 하자고 하면 한서윤이 고개를 끄덕입니다. 그리고 숫자로만 대답합니다. 열한 쪽 중 그가 읽은 쪽은 한 쪽입니다.",
    p3_branch_closed_a: "같이 세면 열네 명 중 아홉 명까지 이름이 나옵니다. 나머지 다섯 명은 한서윤도 모릅니다.",
    p3_branch_closed_b: "물으면 그가 잠깐 말이 없습니다. '보관돼 있을 리가 없죠. 반려된 문서는 번호를 안 주니까요.'",
    p3_branch_closed_c: "돌아가자고 하면 차 안이 조용합니다. 한서윤은 본점까지 28분 동안 한 마디도 하지 않습니다.",
    p3_branch_closed_follow_a: "말해 주면 한서윤이 접힌 종이를 다시 펴다가 멈춥니다. '그 말은 12년 동안 아무도 안 했어요.'",
    p3_branch_closed_follow_b: "나란히 놓으면 두 문서의 결론 문단이 거의 같은 문장입니다. 12년 사이에 달라진 것은 금액과 회사 이름뿐입니다.",
    p3_branch_closed_follow_c: "돌려주면 그가 사본을 사물함에 도로 넣고 잠급니다. 사유서는 그날 밤에 오지 않습니다.",
    p3_archive_trust: "부탁하면 임경수가 안경을 닦다 말고 당신을 봅니다. '맡으라는 말은 오래 들어 봤는데, 맡아 달라는 말은 처음이네.'",
    p3_archive_register: "정식 목록에 올리면 원본은 보호됩니다. 대신 심사팀장 검토 의견 칸의 지우개 자국도 함께 목록에 오릅니다.",
    p3_archive_copy: "복사는 6분 만에 끝납니다. 복사기는 사용 기록을 남기고, 그 기록은 다음 날 아침 관리 부서로 넘어갑니다.",
    p3_final_team: "말하면 일곱 명 중 넷이 남아서 끝까지 듣습니다. 셋은 자리에서 일어나지 않은 채로 듣습니다.",
    p3_final_reason: "문서는 새벽 네 시에 끝납니다. 반박란은 끝내 비어 있습니다. 반려 사유를 아직 아무도 주지 않았기 때문입니다.",
    p3_final_alone: "혼자 가기로 하면 오진우가 종이컵 두 개를 겹쳐 버리고 먼저 나갑니다. 나가면서 불을 끄지 않습니다.",
    p3_after_appeal: "재심을 걸면 신청서가 접수됩니다. 사유란에 한서윤의 이름이 들어가고, 그 서류는 4층과 8층을 한 번씩 거칩니다.",
    p3_after_copy: "사본을 남기면 오늘은 아무 일도 일어나지 않습니다. 아무 일도 일어나지 않는 것이 이 선택의 값입니다.",
    p3_after_accept: "받아들이면 한서윤이 고맙다고 하지 않습니다. 대신 그날 저녁에 심사실 일곱 명 몫의 저녁을 시킵니다.",
    p3_route_system_list: "목록이 들어가면 접수는 됩니다. 34건을 정리하는 데 열흘이 걸리고, 2023-0412는 그 사이에 실행됩니다.",
    p3_route_system_find: "찾아가면 스물여섯 명 중 아홉 명이 만나 줍니다. 그중 둘은 자기 의견서가 아직 어딘가에 있다는 것을 오늘 처음 압니다.",
    p3_route_system_keep: "접어 두면 숫자는 끈 안에 남습니다. 내년에도 누군가 서른다섯 번째 묶음을 만들 겁니다.",
    p3_final_system_route_a: "규칙이 생기면 다음 부속 의견은 읽힙니다. 읽힌 뒤에 승인되는 일도 그대로 남습니다.",
    p3_final_system_route_b: "첨부 7만 다시 올리면 오늘 것은 살아납니다. 나머지 서른두 건은 오늘도 번호가 없습니다.",
    p3_final_system_route_c: "숫자를 보내면 서른두 명이 서로의 존재를 처음 압니다. 답장이 오는 데는 몇 년이 걸립니다.",
    p3_evidence_turn_ask: "물으면 한서윤이 한참 대답하지 않습니다. 그리고 휴대폰을 꺼내 화면을 잠깐 보다가 도로 넣습니다.",
    p3_evidence_turn_file: "붙이면 재심 신청서는 두 시각을 나란히 담습니다. 그 서류를 처음 받아 보는 부서는 4층 팀장실입니다.",
    p3_evidence_turn_hold: "쥐고 있으면 오늘은 조용합니다. 그 11분은 통화 기록에서 1년 뒤에 자동으로 지워집니다.",
  },
  characterProfiles: {
    진세라: {
      role: "KD은행 부행장 · 대출심사위원회 위원장",
      stance: "절차 · 시간 · 책임의 경계",
      job: "규정 안에서만 움직이고, 규정 밖의 일은 자기 일이 아니라고 말한다.",
      appearance: "회의 시간이 분 단위로 적힌 안건 목록, 손목 안쪽으로 돌려 찬 시계, 한 번도 흐트러지지 않는 목소리.",
      thought: "나는 오늘 잘못한 게 없다. 요청하지 않은 것은 잘못이 아니다.",
      gesture: "질문을 받으면 먼저 안건 목록의 남은 줄 수를 세고, 그다음에 대답한다.",
      voice: "부정하지 않고, 자기 권한의 경계만 정확히 그어서 말한다.",
      line: "반려된 부속 의견은 안건이 아닙니다. 다음.",
    },
  },
  setting: { place: "KD은행 본점 4층 기업금융전략팀 심사실", clock: "2023년 4월 27일 목요일 · 08시 20분" },
  sceneContext: {
    p3_start: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "2023년 4월 27일 목요일 · 08시 20분",
      question: "반대 의견서가 본문이 아니라 '첨부 7'로 붙어 있습니다. 개회 전에 무엇을 하겠습니까?",
      lead: "새벽 다섯 시에 확정된 안건 목록에서, 열한 쪽짜리 문서가 일곱 번째 첨부가 돼 있습니다.",
    },
    p3_start_alone: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "2023년 4월 27일 목요일 · 08시 20분",
      question: "첨부 7의 작성자 칸에 이름이 하나뿐입니다. 개회 전에 무엇을 하겠습니까?",
      lead: "혼자 서명한 문서가 안건 목록에 올라온 아침, 심사실 사람들은 이미 그것을 다 읽었습니다.",
    },
    p3_start_shared: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "2023년 4월 27일 목요일 · 08시 20분",
      question: "공동 서명자 세 명이 새벽에 전화를 받았습니다. 개회 전에 무엇을 하겠습니까?",
      lead: "네 사람이 이름을 올린 문서에, 새벽 한 시부터 세 통의 전화가 갔습니다.",
    },
    p3_start_soften: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "2023년 4월 27일 목요일 · 08시 20분",
      question: "첨부 7의 제목이 '검토 참고 사항'으로 올라갔습니다. 개회 전에 무엇을 하겠습니까?",
      lead: "누그러뜨린 결론 문단이 제목까지 바꿔 놓았고, 반대라는 말은 문서 어디에도 없습니다.",
    },
    p3_committee: {
      place: "KD은행 본점 8층 대출심사위원회 회의실",
      clock: "4월 27일 목요일 · 14시",
      question: "반려는 한 문장으로 끝났고 아무도 목소리를 높이지 않았습니다. 무엇을 하겠습니까?",
      lead: "긴 탁자에 위원 아홉, 벽을 따라 배석 여섯. 당신은 네 번째 의자입니다.",
    },
    p3_minutes: {
      place: "본점 8층 회의실 · 위원장 자리",
      clock: "4월 27일 목요일 · 14시 50분",
      question: "의사록 초안의 안건 4번 마지막 줄이 '부속 의견 없음'입니다. 어떻게 하겠습니까?",
    },
    p3_minutes_reaction: {
      place: "본점 8층 복도 · 자판기 앞",
      clock: "4월 27일 목요일 · 15시",
      question: "감사팀 조사역이 첨부 7의 쪽수를 적어 두고 싶다고 합니다. 어떻게 답하겠습니까?",
    },
    p3_corridor: {
      place: "본점 8층 복도 · 창가",
      clock: "4월 27일 목요일 · 14시 40분",
      question: "반려한 사람이 12년 전 자기 반대 의견서 이야기를 합니다. 어떻게 하겠습니까?",
      lead: "위원들이 다 빠져나간 복도에서, 한서윤이 서류철을 창틀에 내려놓고 먼저 입을 엽니다.",
    },
    p3_branch_closed: {
      place: "서대문구 연희동 삼거리 · 옛 KD은행 연희동지점",
      clock: "4월 27일 목요일 · 15시 30분",
      question: "12년 전 그가 지키려던 지점 자리에 볼트 구멍만 남아 있습니다. 무엇을 하겠습니까?",
    },
    p3_branch_closed_follow: {
      place: "연희동 삼거리 · 차 안",
      clock: "4월 27일 목요일 · 16시",
      question: "네 번 접힌 12년 전 사본에 그가 스스로 그은 빨간 줄이 있습니다. 어떻게 하겠습니까?",
    },
    p3_stairwell: {
      place: "본점 비상계단 · 4층과 5층 사이",
      clock: "4월 27일 목요일 · 16시 10분",
      question: "오늘 승인된 대출이 두 시간 만에 지점 창구로 내려갔습니다. 어떻게 답하겠습니까?",
    },
    p3_stairwell_reaction: {
      place: "본점 비상계단 · 5층 문 앞",
      clock: "4월 27일 목요일 · 16시 30분",
      question: "사수가 하루 늦은 승인 하나로 밀려난 아버지 이야기를 합니다. 어떻게 하겠습니까?",
    },
    p3_archive: {
      place: "본점 지하 1층 기록 보관실",
      clock: "4월 27일 목요일 · 18시 20분",
      question: "의견서 마지막 장 뒷면에 연필 한 줄이 있습니다. 이 종이를 어떻게 하겠습니까?",
      lead: "형광등이 한 줄씩 켜지고, 노끈으로 묶인 묶음이 철제 선반 아홉 칸을 채우고 있습니다.",
    },
    p3_boiler: {
      place: "본점 4층 팀장실",
      clock: "4월 27일 목요일 · 21시",
      question: "팀장이 나무라는 대신 내년에 생길 자리를 그려 줍니다. 어떻게 하겠습니까?",
    },
    p3_boiler_reaction: {
      place: "본점 지하 1층 기록 보관실 · 문 앞",
      clock: "4월 27일 목요일 · 21시 40분",
      question: "임경수가 뒷장 한 장을 접어 안주머니에 넣는 것을 보았습니다. 어떻게 하겠습니까?",
    },
    p3_route_system: {
      place: "본점 지하 1층 기록 보관실 · 맨 아래 칸",
      clock: "4월 27일 목요일",
      question: "10년 동안 올라온 부속 반대 의견 34건 중 32건이 팀 단계에서 돌아왔습니다. 어떻게 하겠습니까?",
    },
    p3_final_system_route: {
      place: "본점 지하 1층 기록 보관실 · 맨 아래 칸",
      clock: "4월 27일 목요일 · 19시",
      question: "부속 의견이 사라지는 방식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    p3_evidence_turn: {
      place: "본점 8층 복도 · 처리 기록 출력대",
      clock: "4월 27일 목요일 · 19시 40분",
      question: "반려는 11분짜리 통화가 끝난 1분 뒤에 눌렸습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    p3_final: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "4월 27일 목요일 · 22시",
      question: "반려 통지를 받은 뒤 오늘 안에 무엇을 할지 정해야 합니다. 어떻게 하겠습니까?",
      lead: "4층에 불이 두 개 남았습니다. 당신 자리와, 규정집을 펴 놓은 오진우 자리입니다.",
    },
    p3_aftershock: {
      place: "KD은행 본점 4층 기업금융전략팀 심사실",
      clock: "4월 28일 금요일 · 08시 20분",
      question: "위원회 기록이 10분 뒤에 확정됩니다. 반려된 다음을 어떻게 시작하겠습니까?",
    },
  },
  clue: {
    id: "p3-rejection-minute",
    title: "반려 28분",
    text: "첨부 7의 반려 처리 시각은 13시 32분, 위원회 개회 28분 전이었습니다. 그 1분 전까지 4층 팀장실 내선에서 한서윤 자리로 11분짜리 통화가 걸려 있었고, 의견서 뒷장의 '반려 -- 윤. 사유는 묻지 말 것.'은 한서윤의 글씨가 아니었습니다.",
  },
  outcomes: {
    p3_after_appeal: { tag: "정면으로 부딪친 결말", title: "반려된 다음 날 재심을 신청했다", text: "신청서 사유란에 반려한 사람의 이름이 들어갔습니다. 서류는 4층과 8층을 한 번씩 거쳐, 두 곳 모두에서 당신 이름이 읽혔습니다." },
    p3_after_copy: { tag: "사본을 남긴 결말", title: "재심 대신 원본과 뒷장의 사본을 남겼다", text: "오늘은 아무 일도 일어나지 않았습니다. 종이 한 장이 전산 목록 바깥에서 3년을 기다리기 시작합니다." },
    p3_after_accept: { tag: "믿어 본 결말", title: "반려를 받아들이고 그의 말을 믿기로 했다", text: "심사실 일곱 명은 그대로 남았습니다. 한서윤은 고맙다는 말 대신 저녁을 시켰고, 아무도 오늘 회의 이야기를 하지 않았습니다." },
  },
  carryovers: {
    p3_after_appeal: { legitimacy: 13, trust: 4, capital: -7 },
    p3_after_copy: { capital: 9, legitimacy: 5, trust: -3 },
    p3_after_accept: { trust: 12, humanCost: -5, legitimacy: -8 },
  },
  continuityChallenges: {
    p2_after_alone: { id: "protect-trust", title: "이름 하나로 버틴 사람 지키기", text: "의견서에 이름을 혼자 걸었기 때문에, 반려도 한 번으로 끝났습니다. 오늘 하루 동안 그 이름 옆에 설 사람을 한 명이라도 만드는 선택을 찾아야 보너스가 열립니다." },
    p2_after_shared: { id: "use-reframe", title: "밤새 걸려 온 전화로 판 뒤집기", text: "공동 서명자 세 명에게 새벽에 전화가 갔다는 것은, 저쪽이 그 문서를 읽었다는 뜻입니다. 읽혔다는 사실 자체를 오늘 판을 바꾸는 데 써야 합니다." },
    p2_after_soften: { id: "repair-legitimacy", title: "반대로 읽히지 않는 문서의 정당성 회복하기", text: "누그러뜨린 결론 때문에 첨부 7은 '검토 참고 사항'이 됐고, 위원회는 이것을 반대로 읽지 않습니다. 이 문서가 반대 의견이었다는 사실을 기록에 되돌리는 선택을 찾아야 합니다." },
  },
};
