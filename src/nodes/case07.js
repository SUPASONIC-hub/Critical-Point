/**
 * CASE 07 -- the authored scenes of the transfer case.
 *
 * Six cases ask what the analyst will give up. None of them ever let the analyst
 * take anything back, so the season ran on one register -- pressure, loss, a
 * colder room -- and arrived at the finale with nothing but resentment to spend.
 *
 * This is the case that pays. 사건 06 closes and the group answers the only way
 * it knows: not a dismissal, which would need grounds, but a posting. The
 * analyst is moved to a branch 240km away, effective in 48 hours, and the
 * sign-off box on the order is empty in exactly the shape of 2023-0412. Nobody
 * has to be fired when the files can simply be left behind.
 *
 * So the 48 hours are spent collecting: a notebook, a counter record, a page of
 * paper nobody digitised, and a testimony only one person can give. Every one of
 * them costs its owner something, and three of the four hand it over anyway.
 * That is the beat the season was missing -- not a win, but the discovery that
 * the debts run both ways.
 */
export const case07Nodes = {
  c7_start: {
    phase: "CASE 07 BRIEFING",
    title: "발령",
    speaker: "한서윤",
    text:
      "인사위원회가 끝나고 한 주 뒤 아침, 트리거랩 4층 분석관실. 한서윤이 인쇄된 종이를 들고 당신 자리로 옵니다. 인사 발령서입니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 서울에서 240km 떨어진 곳입니다. 징계가 아니라 인사이므로 이의 절차도, 사유 고지도 없습니다. 발령이 적용되면 사내 기록을 볼 수 있는 권한은 그 지점 범위로 줄어듭니다. 한서윤이 종이를 뒤집어 마지막 장을 보여 줍니다. 최종 승인란이 비어 있습니다. '3년 전 그 서류하고 같은 모양입니다. 이 사람은 이름을 안 씁니다. 자리를 씁니다.' 작성일은 오진우 조사가 시작된 날보다 12일 앞서 있습니다.",
    memo: [
      "적용까지 48시간, 이의 절차 없음",
      "발령 문서 최종 승인란: 공란",
      "발령서 작성일은 오진우 조사 개시보다 12일 앞섬",
      "발령 후에는 사내 기록 열람 권한이 지점 범위로 축소됨",
    ],
    triggers: ["injustice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c7_start_gather",
        label: "남은 48시간을 자료를 모으는 데 전부 쓴다",
        effect: { time: -12, legitimacy: 7, trust: 5, fatigue: 4 },
        voice: "짐은 나중에 싸도 된다며, 남은 이틀을 전부 자료에 쓰겠다고 말한다.",
        echo: "이틀을 전부 쓰면 자료는 모입니다. 인수인계가 비면 그것도 하나의 기록이 됩니다.",
        next: "c7_ledger",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c7_start_appeal",
        label: "발령 자체에 공식 이의를 제기한다",
        effect: { time: -6, legitimacy: 11, capital: -9, fatigue: 3 },
        voice: "묻지도 않고 정해진 발령이라며, 공식 이의부터 낸다.",
        echo: "이의는 절차를 만들고, 절차는 시간을 씁니다. 당신에게 남은 것이 그 시간입니다.",
        next: "c7_ledger",
        cognition: { risk: 1, persistence: 1 },
      },
      {
        id: "c7_start_accept",
        label: "발령을 받아들이고 인수인계부터 끝낸다",
        effect: { time: 9, capital: 8, trust: -12, legitimacy: -6, fatigue: 2 },
        voice: "싸울 자리가 아니라고 판단하고, 인수인계 목록부터 연다.",
        echo: "받아들이면 오늘은 조용합니다. 옮겨 간 자리에서는 여기 파일들을 열 수 없습니다.",
        next: "c7_ledger",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c7_ledger",
      },
    ],
  },
  c7_ledger: {
    phase: "THE NOTEBOOK",
    title: "반재욱의 수첩",
    speaker: "반재욱",
    text:
      "트리거랩 2층 감사팀 서고, 창문이 없는 방입니다. 반재욱이 안쪽 캐비닛을 열쇠로 열고 표지가 닳은 검은 수첩을 꺼냅니다. 그가 조사해서 자리를 잃은 사람 마흔일곱 명의 이름과 날짜가 한 줄에 하나씩, 순서대로 적혀 있습니다. 전부 볼펜입니다. 뒤쪽 한 줄만 연필입니다. 당신의 이름, 그리고 3주 전 날짜. '나는 내가 자른 사람을 다 적습니다. 지우면 안 자른 게 되니까요.' 그가 연필로 적은 줄을 손가락으로 짚습니다. '이건 연필입니다. 아직 끝난 일이 아니라서요.' 이 수첩은 규정상 존재하면 안 되는 기록이고, 제출하는 순간 그의 경력도 같이 끝납니다.",
    memo: [
      "수첩에 적힌 이름 47명, 마지막 줄은 연필",
      "당신의 이름이 적힌 날짜: 오진우 조사 개시 12일 전",
      "감사역의 사적 기록 보관은 내부 규정 위반",
      "제출하면 반재욱도 함께 조사 대상이 됨",
    ],
    triggers: ["trust", "responsibility", "affection"],
    choices: [
      {
        id: "c7_ledger_take",
        label: "수첩 전체를 증거로 받는다",
        effect: { legitimacy: 13, trust: 6, humanCost: 9, fatigue: 5 },
        voice: "그의 경력도 같이 끝난다는 걸 알면서, 수첩 전체를 두 손으로 받는다.",
        echo: "수첩은 마흔일곱 명을 증명합니다. 그 마흔일곱 명 중 마지막 한 명이 그 자신이 됩니다.",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c7_ledger_page",
        label: "내 이름이 적힌 한 장만 받는다",
        effect: { legitimacy: 6, trust: 9, humanCost: -4, time: -4, fatigue: 3 },
        voice: "필요한 건 한 장뿐이라며, 내 이름이 적힌 쪽만 뜯어 받는다.",
        echo: "한 장은 당신을 지킵니다. 나머지 마흔 명은 여전히 아무 데도 없습니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "c7_ledger_refuse",
        label: "수첩은 두고, 그의 증언만 요청한다",
        effect: { trust: 12, legitimacy: -5, humanCost: -7, time: -8, fatigue: 4 },
        voice: "수첩은 그의 것이라며 덮어 두고, 대신 증언해 달라고 부탁한다.",
        echo: "증언은 사람의 기억이고, 기억에는 날짜가 붙지 않습니다. 그가 남는 대신 문서가 얇아집니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c7_counter: {
    phase: "THE COUNTER",
    title: "강서지점의 3년",
    speaker: "도윤하",
    text:
      "KD은행 강서지점, 도윤하가 3년 만에 그 문을 엽니다. 입구 옆 실적판은 같은 자리에 있고 이달의 판매왕 스티커도 그대로 붙어 있습니다. 그를 창구에서 내보낸 지점장은 아직 같은 방에 앉아 있습니다. 필요한 것은 플로우온 대출 신청서 원본의 뒷장입니다. 그해 지점에 내려온 판매 목표표가 그대로 붙어 있는 장입니다. 지점장은 줄 수 있다고 합니다. 화도 내지 않습니다. 대신 서류철을 연 채로 말합니다. 이 장이 나가면 그 목표를 받아 팔았던 창구 담당 이름이 전부 따라 나간다고요. 도윤하의 이름부터입니다. 도윤하는 실적판 쪽을 보지 않으려고 번호표 기계만 보고 있습니다.",
    memo: [
      "신청서 뒷장에 그해 지점 판매 목표표가 첨부됨",
      "목표표를 내려보낸 부서: 기업금융전략팀",
      "서류가 나가면 당시 창구 담당 4명이 함께 특정됨",
      "도윤하는 그중 한 명",
    ],
    triggers: ["protection", "trust", "injustice"],
    choices: [
      {
        id: "c7_counter_pull",
        label: "뒷장을 그대로 받아 나온다",
        effect: { legitimacy: 12, capital: 5, trust: -8, humanCost: 11, fatigue: 4 },
        voice: "네 사람의 이름이 따라 나온다는 걸 알면서, 뒷장을 그대로 받아 나온다.",
        echo: "뒷장은 지시를 증명합니다. 같은 장이 네 사람의 근무 기록도 증명합니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c7_counter_mask",
        label: "담당자 이름을 지운 사본만 받는다",
        effect: { legitimacy: 5, trust: 7, humanCost: -6, time: -7, fatigue: 5 },
        voice: "이름 칸에 종이를 덧대고, 숫자만 남긴 사본을 요청한다.",
        echo: "가린 이름은 그들을 지킵니다. 가린 문서는 누가 팔았는지 말하지 못합니다.",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c7_counter_ask",
        label: "네 사람에게 먼저 묻고 결정한다",
        effect: { time: -12, trust: 13, legitimacy: 4, humanCost: -9, fatigue: 6 },
        voice: "내가 정할 일이 아니라며, 네 사람의 연락처부터 받는다.",
        echo: "물어보면 결정권이 그들에게 갑니다. 그 결정에는 당신이 없는 시간이 필요합니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c7_paper: {
    phase: "THE PAGE",
    title: "태운 자리",
    speaker: "임경수",
    text:
      "회기동 헌책방 2층, 계단을 오르면 종이 냄새가 먼저 옵니다. 임경수가 창가 책상에서 끈을 풀고 종이 한 장을 밀어 놓습니다. 2023-0412 심사 보고서 3페이지 원본입니다. 서명란은 비어 있고, 그 아래에 연필로 적힌 지시자 이니셜이 남아 있습니다. 전산에 올라간 3페이지는 바로 그 아랫부분이 잘려 있습니다. 그가 안경을 벗어 닦고, 처음으로 뭔가를 요구합니다. '보호해 주겠다는 말은 마시오. 3년을 이걸 들고 있었어요. 은행에서도, 이 책방에서도. 낼 거면 내 이름을 맨 위에 쓰시오. 그게 내가 받고 싶은 겁니다.' 아래층에서 책방 주인이 책 묶는 끈을 끊는 소리가 올라옵니다.",
    memo: [
      "3페이지 원본 하단에 연필로 적힌 이니셜 확인",
      "전산본에는 해당 하단 영역이 잘려 있음",
      "임경수는 익명 처리를 거부함",
      "그의 이름이 들어가면 문서의 증거력은 올라감",
    ],
    triggers: ["recognition", "responsibility", "choice"],
    choices: [
      {
        id: "c7_paper_name",
        label: "그의 뜻대로 이름을 맨 위에 쓴다",
        effect: { legitimacy: 14, trust: 10, humanCost: 5, fatigue: 3 },
        voice: "보호하겠다는 말을 삼키고, 그의 이름을 문서 맨 위에 적는다.",
        echo: "그의 이름이 올라가면 문서는 단단해집니다. 3년을 숨긴 사람이 하루 만에 공개됩니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c7_paper_shield",
        label: "요청을 접어 두고 익명 자료로 낸다",
        effect: { legitimacy: 4, trust: -6, humanCost: -8, fatigue: 4 },
        voice: "이름이 나가면 조용하던 3년이 끝난다며, 익명으로 처리한다.",
        echo: "익명은 그를 남깁니다. 남은 그는 4년째 같은 종이를 들고 앉아 있게 됩니다.",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "c7_paper_pair",
        label: "그의 이름 옆에 내 이름도 같이 쓴다",
        effect: { legitimacy: 11, trust: 12, humanCost: 3, time: -5, fatigue: 5 },
        voice: "혼자 세우지는 않겠다며, 그의 이름 옆에 내 이름을 나란히 적는다.",
        echo: "두 이름은 서로를 증인으로 만듭니다. 한쪽이 무너지면 다른 쪽도 같이 읽힙니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c7_final: {
    phase: "FINAL DECISION",
    title: "누구 이름으로 가져갈 것인가",
    speaker: "오진우",
    text:
      "발령 적용까지 6시간, 트리거랩 4층 통로 끝. 오진우가 책상을 정리하고 있습니다. 색깔별로 줄 서 있던 메모지가 상자 하나에 들어가 있습니다. 마지막 한 조각은 그의 진술입니다. 결정 제한시간이 설정값이었다고 말할 수 있는 사람은 그 조건을 겪은 본인뿐입니다. 그가 정리를 멈추고 묻습니다. '그 문서에 이름이 몇 개 올라갑니까.' 그리고 덧붙입니다. '저는 아버지 이름을 그 서류에서 끝내 못 지웠습니다. 이번엔 누구 이름이 남는지 먼저 알고 싶습니다.' 이름이 많을수록 문서는 무거워지고, 다칠 사람도 늘어납니다. 낼 곳은 감사팀이 아니라 그룹 바깥의 감사인입니다.",
    memo: [
      "제출 가능한 자료: 수첩, 창구 뒷장, 종이 원본, 오진우 진술",
      "이름이 많을수록 증거력은 오르고 피해 범위도 넓어짐",
      "적용 6시간 뒤 열람 권한이 지점 범위로 축소",
      "제출처는 감사팀이 아니라 그룹 외부 감사인",
    ],
    triggers: ["responsibility", "affection", "choice", "selfAwareness"],
    choices: [
      {
        id: "c7_final_all",
        label: "도와준 사람 전부의 이름을 올린다",
        effect: { legitimacy: 16, trust: 8, humanCost: 12, fatigue: 5 },
        voice: "도와준 사람을 지우면 문서가 아니라며, 이름을 전부 올린다.",
        echo: "이름이 많은 문서는 반박하기 어렵습니다. 반박당할 사람도 그만큼 많아집니다.",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c7_final_mine",
        label: "내 이름 하나만 올리고 나머지는 자료로만 낸다",
        effect: { legitimacy: 9, trust: 14, humanCost: -10, capital: -8, fatigue: 6 },
        voice: "값은 내가 치른다며, 이름 칸에 나 하나만 남긴다.",
        echo: "혼자 지면 아무도 다치지 않습니다. 혼자 이기면 아무도 증인이 아닙니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c7_final_none",
        label: "이름 없이 자료만 익명으로 넘긴다",
        effect: { capital: 11, legitimacy: -7, trust: -9, humanCost: -5, time: 6, fatigue: 2 },
        voice: "아무도 다치지 않는 길을 고르며, 이름 없이 자료만 넘긴다.",
        echo: "익명 자료는 조사를 엽니다. 여는 데까지 몇 달이 걸리고, 당신은 그때 지점에 있습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 07 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 *
 * The voice lines. The season's one case where the analyst asks instead of
 * decides, so the lines are spoken to a person in the room rather than to a
 * document.
 */
export const case07 = {
  id: "case07",
  nodes: case07Nodes,
  aftermath: {
    c7_aftershock: {
      phase: "AFTERMATH",
      title: "적용 시각",
      speaker: "한서윤",
      text: "발령이 적용된 아침 9시 10분, 당신의 사원증은 아직 4층 문을 엽니다. 전산 반영이 하루 늦은 겁니다. 분석관실에는 당신 자리와 통로 끝 자리, 두 책상이 비워질 차례를 기다리고 있습니다. 한서윤이 커피를 두 잔 들고 와 한 잔을 당신 책상에 내려놓습니다. 그는 발령서 얘기를 꺼내지 않습니다. '오늘 하루는 아직 여기 사람입니다. 어디에 쓰시겠습니까.' 그룹 바깥의 감사인에게서는 아직 회신이 없습니다. 도와준 사람들은 각자 자리에서 그 회신을 기다립니다. 창밖으로 합정동 골목의 아침 장사가 시작됩니다.",
      memo: ["권한 축소가 하루 지연됨", "외부 감사인 회신까지 미정", "도와준 사람들의 이름은 이미 문서에 있음"],
      triggers: ["responsibility", "affection", "choice"],
      choices: [
        {
          id: "c7_after_stand",
          label: "이름을 올린 사람들을 먼저 찾아간다",
          effect: { trust: 14, legitimacy: 4, capital: -6, fatigue: 7 },
          voice: "아직 여기 사람인 오늘 하루를 써서, 이름이 올라간 사람들을 한 명씩 찾아간다.",
          echo: "찾아간 자리는 기억됩니다. 그 하루에 문서는 한 줄도 나아가지 않습니다.",
          next: "case07_result",
          cognition: { persistence: 2 },
        },
        {
          id: "c7_after_open",
          label: "남은 하루로 외부 감사인에게 원본을 마저 넘긴다",
          effect: { legitimacy: 15, trust: 4, humanCost: -4, fatigue: 8 },
          voice: "하루가 더 있다는 걸 알고, 남은 원본을 마저 밖으로 보낸다.",
          echo: "남은 하루는 권한이 살아 있는 마지막 하루입니다. 쓰면 사라지고, 안 쓰면 그냥 사라집니다.",
          next: "case07_result",
          cognition: { inference: 2, reframing: 1 },
        },
        {
          id: "c7_after_alone",
          label: "아무에게도 알리지 않고 조용히 짐을 싼다",
          effect: { capital: 12, trust: -13, legitimacy: -5, humanCost: 8, fatigue: 3 },
          voice: "아무에게도 알리지 않고, 책상 서랍부터 비운다.",
          echo: "조용히 떠나면 아무 일도 없었던 것이 됩니다. 문서에 적힌 이름들만 남습니다.",
          next: "case07_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c7_final", "c7_aftershock"],
  // The connective scenes of case 07 trade in the same three shapes as the rest
  // of the season -- people first pays in cash or time, procedure first makes
  // someone wait, the shortcut gives fatigue back -- so the case reads as part
  // of the set even though its subject is the analyst's own posting.
  connectiveScenes: [
    {
      id: "c7_receipt",
      after: "c7_ledger",
      next: "c7_counter",
      title: "영수증",
      speaker: "반재욱",
      text: "서고에서는 더 말할 수 없다며 반재욱이 택시를 잡았고, 차는 한 블록을 돌아 다시 트리거랩 앞 도로에 섰습니다. 미터기에는 4,300원이 찍혀 있습니다. 그가 택시비를 반으로 나누자며 영수증을 찢어 반쪽을 내밉니다. 반쪽에는 그의 서명까지 있습니다. 마흔일곱 명을 자른 사람이 4,300원을 두고 실랑이를 합니다. '기록에 남길 수 없는 건 안 받습니다. 받은 것도, 준 것도요.' 그는 농담을 한 적이 없고, 이번에도 농담이 아닙니다. 수첩이 든 가방은 아직 무릎 위에 닫혀 있습니다. 둘이 서고에 들어갔다는 출입 기록은 이미 남았습니다.",
      memo: ["반쪽 영수증에 그의 서명이 있음", "그는 아직 수첩을 가방에서 꺼내지 않음", "감사팀 서고 출입 기록은 이미 남았음"],
      choices: [
        {
          label: "그의 방식대로 반씩 나눠 적는다",
          effect: { trust: 8, legitimacy: 4, capital: -6, time: -4, fatigue: 5 },
          voice: "4,300원도 기록이라며, 그의 방식대로 반씩 적는다.",
          echo: "반씩 적힌 기록은 아무도 빚지지 않게 합니다. 빚이 없으면 부탁도 없습니다.",
        },
        {
          label: "영수증을 받아 내 경비로 처리한다",
          effect: { legitimacy: 7, time: -5, humanCost: 3, fatigue: 4 },
          voice: "영수증을 받아 들고, 오늘 경비는 내가 지겠다고 한다.",
          echo: "당신이 낸 경비는 그를 편하게 하고, 그 편함은 나중에 수첩을 꺼내기 어렵게 만듭니다.",
        },
        {
          label: "그냥 넘기고 시간을 아낀다",
          effect: { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 },
          voice: "이런 데 쓸 시간이 없다며 그냥 넘긴다.",
          echo: "아낀 2분은 오늘 쓸모가 있고, 그가 왜 4,300원을 세는 사람인지는 끝내 모릅니다.",
        },
      ],
    },
    {
      id: "c7_teller",
      after: "c7_counter",
      next: "c7_paper",
      title: "창구 4번",
      speaker: "도윤하",
      text: "지점을 나오는 길, 4번 창구에서 누가 도윤하를 부릅니다. '윤하 씨, 아직 그 말버릇 있네.' 머리가 센 행원입니다. 3년 전 같은 줄에 앉아 있던 사람이고 내년이 정년입니다. 그는 무슨 일로 왔느냐고 묻지 않습니다. 손님이 없는 틈에 서랍을 열어 종이 한 장을 꺼냅니다. 그해 목표표의 사본, 지점이 따로 보관해 온 것입니다. 창구 담당 이름이 적힌 쪽을 그가 손톱으로 눌러 접습니다. 자기 이름이 있는 줄입니다. 접은 채로 창구 유리 아래로 밀어 줍니다. '접은 건 내가 접은 거야. 펴는 건 가져가는 사람 마음이고.' 번호표 기계가 다음 번호를 부릅니다.",
      memo: ["4번 창구 행원은 당시 같은 팀", "사본은 지점 자체 보관본", "그는 내년이 정년"],
      choices: [
        {
          label: "접힌 쪽을 펴서 그의 이름도 함께 쓴다",
          effect: { trust: 9, legitimacy: 5, capital: -5, time: -5, fatigue: 5 },
          voice: "접힌 종이를 펴서, 그의 이름도 같은 줄에 쓴다.",
          echo: "펴서 쓰면 그는 증인이 됩니다. 정년 한 해를 앞둔 증인입니다.",
        },
        {
          label: "접힌 그대로 받아 이름은 가린다",
          effect: { legitimacy: 6, time: -4, humanCost: 4, fatigue: 3 },
          voice: "내년이 정년인 사람이 스스로 접어 준 쪽이라, 접힌 그대로 받아 이름은 가린다.",
          echo: "가린 이름은 오늘 그를 지키고, 문서의 힘은 그만큼 줄어듭니다.",
        },
        {
          label: "사본은 두고 원본 절차만 밟는다",
          effect: { time: 5, capital: 7, trust: -6, humanCost: 5, fatigue: -3 },
          voice: "사본은 사양하고, 정식 열람 절차만 밟겠다고 한다.",
          echo: "절차는 깨끗하고 느립니다. 48시간 안에 끝나는 절차는 아닙니다.",
        },
      ],
    },
    {
      id: "c7_ticket",
      after: "c7_paper",
      next: "c7_final",
      title: "기차표",
      speaker: "에코",
      text: "헌책방 계단참에서 전화기가 한 번 울립니다. 에코가 조용히 문서 하나를 띄웁니다. 총무팀이 이미 발권한 기차표입니다. 출발 06:40, 강릉행, 편도. 돌아오는 표는 없습니다. 발권된 날은 발령이 적용되기도 전입니다. 승인자 칸에는 이번에도 아무도 없습니다. 에코가 한 줄을 더 붙입니다. '시스템은 당신이 갈 것이라고 계산했습니다. 계산은 대개 맞습니다.' 계단 아래 골목에서는 누가 헌책 상자를 손수레에 싣고 있습니다. 표는 취소할 수 있습니다. 다만 취소해도 끊었다는 기록과 취소했다는 기록이 둘 다 남습니다.",
      memo: ["편도 기차표가 발령 적용 전에 발권됨", "승인자 칸 공란", "표는 취소해도 기록은 남음"],
      choices: [
        {
          label: "표를 취소하고 그 기록을 증거로 남긴다",
          effect: { legitimacy: 9, trust: 4, capital: -7, time: -6, fatigue: 5 },
          voice: "발령 적용 전에 승인자도 없이 끊긴 표라서, 표를 취소하고 그 기록을 증거로 남긴다.",
          echo: "취소 기록은 이 발령이 예정돼 있었다는 증거가 됩니다. 동시에 당신이 저항한다는 신고이기도 합니다.",
        },
        {
          label: "표는 그대로 두고 자료를 먼저 보낸다",
          effect: { legitimacy: 5, trust: 6, time: -4, humanCost: 3, fatigue: 4 },
          voice: "시스템이 내가 갈 거라고 계산하고 있는 동안, 표는 그대로 두고 자료를 먼저 보낸다.",
          echo: "표를 두면 아무도 놀라지 않습니다. 자료는 그 틈으로 나갑니다.",
        },
        {
          label: "표를 받아 두고 오늘은 아무 말도 안 한다",
          effect: { time: 6, capital: 5, trust: -7, humanCost: 4, fatigue: -3 },
          voice: "승인자 칸이 비어 따질 상대도 없어서, 표를 받아 두고 오늘은 아무 말도 안 한다.",
          echo: "받아 둔 표는 오늘 조용합니다. 06:40에 그 조용함이 끝납니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c7_receipt_reaction",
      after: "c7_receipt",
      next: "c7_counter",
      title: "가방에서 나온 것",
      speaker: "반재욱",
      text: "영수증 문제가 끝나자 반재욱이 내리지 않고 뒷자리에서 가방을 엽니다. 수첩은 비닐에 싸여 있습니다. 모서리가 누렇게 바랜, 3년째 같은 비닐입니다. 기사는 백미러를 보지 않으려고 라디오 소리를 조금 키웁니다. 반재욱이 수첩을 무릎 위에 올려놓고 손은 떼지 않습니다. '이걸 어떻게 받을지는 당신이 정하십시오. 정식으로 접수하든, 따로 받든, 말로만 듣든. 나는 어느 쪽이든 오늘 안에 사표를 씁니다.' 부탁을 받는 사람이 아니라 빚을 정리하는 사람의 얼굴입니다. 미터기 숫자가 다시 올라가기 시작합니다.",
      memo: ["빚지지 않는 사람에게 부탁하는 법", "사표가 먼저 나가는 순서"],
      choices: [
        {
          label: "정식 절차로 접수한다",
          effect: { trust: 8, legitimacy: 3, capital: -4, time: -5, fatigue: 4 },
          cognition: { inference: 1 },
          voice: "빚을 지지 않겠다는 그의 방식에 맞춰, 수첩도 정식 절차로 받겠다고 한다.",
          echo: "정식 절차로 받으면 수첩은 증거가 되고, 그는 위반자가 됩니다. 둘 다 기록에 남습니다.",
        },
        {
          label: "사적으로 받아 그를 남긴다",
          effect: { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
          voice: "사적인 기록이니 사적으로 받겠다고, 조용히 가져간다.",
          echo: "조용히 받으면 그는 안전하고, 그 수첩은 법정에서 존재한 적이 없게 됩니다.",
        },
        {
          label: "수첩 없이 증언만 받는다",
          effect: { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -3 },
          voice: "수첩 없이도 된다며, 그의 증언만 받겠다고 한다.",
          echo: "증언만 받으면 날짜는 남지 않습니다. 남는 것은 한 사람의 기억입니다.",
        },
      ],
    },
    {
      id: "c7_teller_reaction",
      after: "c7_teller",
      next: "c7_paper",
      title: "네 개의 이름",
      speaker: "도윤하",
      text: "강서지점 앞 버스 정류장, 도윤하가 목표표를 들고 서 있습니다. 그 목표를 받은 창구 담당 네 명의 이름이 세로로 적혀 있습니다. 4번 창구의 그 행원, 도윤하, 그리고 두 사람 더. 그가 자기 이름이 적힌 줄에 손톱으로 금을 긋습니다. '제 이름은 제가 올릴게요. 그건 제가 정할 수 있어요.' 버스가 한 대 서고, 그는 타지 않습니다. '나머지 세 사람은 저도 못 정합니다. 같이 앉아 있었다고 해서 제가 그분들 이름을 대신 내놓을 수는 없잖아요.' 그가 종이를 반으로 접어 당신에게 건넵니다. 접힌 선이 네 이름 한가운데를 지나갑니다.",
      memo: ["자기 이름을 자기가 올릴 권리", "정년 한 해 앞의 증인"],
      choices: [
        {
          label: "네 사람에게 각자 정하게 한다",
          effect: { trust: 9, legitimacy: 4, capital: -5, time: -4, fatigue: 5 },
          voice: "네 사람에게 각자 결정하게 하겠다며, 연락처를 받아 나온다.",
          echo: "각자 정하게 하면 시간이 갑니다. 정한 사람은 자기 이름을 자기가 올린 게 됩니다.",
        },
        {
          label: "한 사람만 남기고 지운다",
          effect: { legitimacy: 5, trust: 4, time: -3, humanCost: 4, fatigue: 3 },
          voice: "가장 위험이 적은 한 사람만 남기고 나머지는 지운다.",
          echo: "한 사람만 남기면 그 한 사람이 전부를 감당합니다. 지점에서는 그 방식을 이미 봤습니다.",
        },
        {
          label: "이름은 전부 지우고 숫자만 쓴다",
          effect: { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
          voice: "세 사람의 이름은 도윤하도 못 정한다고 하니, 이름은 전부 지우고 목표표의 숫자만 쓴다.",
          echo: "숫자만으로도 목표표는 읽힙니다. 누가 그 목표를 받았는지는 읽히지 않습니다.",
        },
      ],
    },
    {
      id: "c7_ticket_reaction",
      after: "c7_ticket",
      next: "c7_final",
      title: "06:40",
      speaker: "에코",
      text: "헌책방 앞 골목으로 내려오자 에코가 발권 기록 옆에 조회 결과를 붙입니다. '이 노선의 지난 3년 발권 기록 중 같은 패턴이 여섯 건 있습니다. 승인자 없이, 편도로, 발령 적용 전에 끊긴 표입니다. 여섯 명 전원이 탑승했습니다.' 여섯 줄의 좌석 번호가 화면에 세로로 섭니다. 탄 날은 전부 다르지만 탄 시각은 전부 06:40입니다. 당신이 일곱 번째입니다. 골목 끝에서 헌책 상자를 실은 손수레가 모퉁이를 돕니다. 그 시각에 역에 서 있을지 말지는 아직 아무 기록에도 적혀 있지 않습니다.",
      memo: ["여섯 명이 전부 탄 노선", "타지 않는 장면의 값"],
      choices: [
        {
          label: "역에 나가서 타지 않는다",
          effect: { legitimacy: 8, trust: 4, capital: -6, time: -5, fatigue: 5 },
          voice: "06:40에 실제로 역에 나가서, 가지 않는 장면을 기록으로 남긴다.",
          echo: "가지 않는 장면은 강력합니다. 그 장면 이후 당신은 협상 대상이 아니라 사건이 됩니다.",
        },
        {
          label: "내려가되 자료는 먼저 보낸다",
          effect: { legitimacy: 6, time: -4, humanCost: 3, fatigue: 4 },
          voice: "표를 쓰고 내려가되, 자료 제출은 이미 끝내 둔다.",
          echo: "내려가면 소란은 없습니다. 자료는 이미 밖에 있고, 당신은 안에 없습니다.",
        },
        {
          label: "하루를 더 기다린다",
          effect: { time: -6, capital: 6, trust: -6, humanCost: 4, fatigue: -3 },
          voice: "표도 자료도 손대지 않고, 하루를 더 기다린다.",
          echo: "기다린 하루는 아무것도 바꾸지 않고, 권한 축소는 예정대로 적용됩니다.",
        },
      ],
    },
  ],
  branchPlan: ["c7_counter", 2, "c7_branch_quota", "c7_branch_quota_follow"],
  branchScenes: {
    c7_branch_quota: {
      phase: "SIDE DOOR",
      title: "그해 목표표",
      speaker: "도윤하",
      text: "지점 2층 문서고, 네 사람에게 먼저 묻겠다고 하자 지점장이 열쇠를 내주고 자리를 비켰습니다. 서류철에서 꺼낸 목표표 상단에 손글씨가 남아 있습니다. '3분기 운전자금 12건 -- 심사 의견 무관.' 운전자금은 회사가 월급과 재료비를 치르라고 빌려주는 대출입니다. 지점에 내려온 지시는 대출을 팔라는 것이 아니라, 심사가 뭐라 하든 팔라는 것이었습니다. 문서고 목록에는 같은 문구가 다른 세 지점의 목표표에도 있다고 적혀 있습니다. 도윤하가 형광등 아래에서 그 줄을 오래 봅니다. '저 문장을 그때 봤으면 저는 안 팔았을까요.' 그가 종이를 내려놓습니다. '모르겠습니다. 그게 제일 싫어요.'",
      memo: ["목표표 상단 손글씨: 심사 의견 무관", "목표표를 내려보낸 부서와 2023-0412 조항 작성 부서가 동일", "같은 문구가 다른 3개 지점 목표표에도 존재"],
      triggers: ["injustice", "responsibility", "trust"],
      choices: [
        {
          id: "c7_branch_quota_a",
          label: "세 지점 목표표를 전부 모아 패턴으로 낸다",
          effect: { legitimacy: 11, trust: 5, capital: -8, time: -8, fatigue: 6 },
          voice: "한 장으로는 우연이라며, 세 지점 목표표를 전부 모은다.",
          echo: "세 장이 모이면 한 줄은 지시가 됩니다. 모으는 데 필요한 시간은 당신에게 없는 것입니다.",
          next: "c7_branch_quota_follow",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c7_branch_quota_b",
          label: "손글씨 한 줄만 확대해 증거로 쓴다",
          effect: { legitimacy: 7, time: -3, humanCost: 4, fatigue: 3 },
          voice: "긴 설명 대신 한 줄이라며, 손글씨만 확대해 붙인다.",
          echo: "확대한 한 줄은 강합니다. 한 줄짜리 증거는 한 줄짜리 해명으로 닫힙니다.",
          next: "c7_branch_quota_follow",
          cognition: { risk: 1 },
        },
        {
          id: "c7_branch_quota_c",
          label: "판 사람이 아니라 지시한 사람만 특정한다",
          effect: { trust: 10, legitimacy: 6, humanCost: -7, time: -6, fatigue: 5 },
          voice: "판 사람이 아니라 시킨 사람이라며, 지시 라인만 짚는다.",
          echo: "지시 라인만 짚으면 창구는 보호됩니다. 창구가 빠진 문서는 현장을 증명하지 못합니다.",
          next: "c7_branch_quota_follow",
          cognition: { reframing: 2 },
        },
      ],
    },
    c7_branch_quota_follow: {
      phase: "SIDE DOOR",
      title: "판 사람과 시킨 사람",
      speaker: "반재욱",
      text: "연락을 받은 반재욱이 문서고로 옵니다. 목표표를 받아 들고 한참 말이 없습니다. 손글씨 줄을 두 번 읽습니다. '나는 이 목표표로 판 사람을 셋 잘랐습니다. 시킨 사람은 한 번도 못 봤습니다.' 그가 가방에서 수첩을 꺼내 중간쯤을 폅니다. 세 이름이 나란히 적혀 있습니다. 세 사람 모두 다시 심사해 달라고 청할 수 있는 기한은 이미 지났습니다. '이번 문서에 이 사람들을 넣으면 닫혔던 이름이 다시 열립니다. 본인들이 원하는지는 저도 모릅니다.' 그가 수첩을 펼친 채 탁자에 놓습니다. '잘린 사람으로 적을지, 당한 사람으로 적을지. 그것부터 정해야 합니다.'",
      memo: ["과거 징계자 3명이 같은 목표표로 처리됨", "재심 청구 시한은 이미 지남", "문서에 넣으면 그 3명의 이름이 다시 열림"],
      triggers: ["injustice", "responsibility", "affection"],
      choices: [
        {
          id: "c7_branch_quota_follow_a",
          label: "잘린 세 사람을 피해자로 함께 적는다",
          effect: { legitimacy: 10, trust: 9, capital: -7, humanCost: -8, fatigue: 7 },
          voice: "이미 잘린 세 사람도 같은 문서의 당사자라며, 피해자 칸에 적는다.",
          echo: "세 사람을 피해자로 적으면 사건은 3년 전까지 넓어집니다. 그들에게 묻지 않고 늘린 것입니다.",
          next: "c7_paper",
          cognition: { reframing: 3 },
        },
        {
          id: "c7_branch_quota_follow_b",
          label: "이번 사건 범위만 남기고 과거는 접는다",
          effect: { legitimacy: 6, time: 5, humanCost: 5, fatigue: 3 },
          voice: "지금 사건부터 닫자며, 과거 세 건은 접어 둔다.",
          echo: "범위를 좁히면 오늘 닫힙니다. 그 세 사람은 이번에도 자기 이름을 못 봅니다.",
          next: "c7_paper",
          cognition: { risk: 1 },
        },
        {
          id: "c7_branch_quota_follow_c",
          label: "세 사람에게 먼저 연락해 의사를 묻는다",
          effect: { trust: 12, time: -9, legitimacy: 4, humanCost: -6, fatigue: 6 },
          voice: "그들의 이름이니 그들이 정하라며, 먼저 연락을 돌린다.",
          echo: "연락하면 그들이 고릅니다. 그 통화 하나에 남은 시간의 절반이 들어갑니다.",
          next: "c7_paper",
          cognition: { persistence: 2 },
        },
      ],
    },
  },
  routePlan: {
    start: "c7_start",
    result: "c7_aftershock",
    defaultFree: "c7_route_system",
    // Like case 06, no four-way split. The case is 48 hours of asking people
    // for things, not four strategies against an institution, so the authored
    // middle is the route and only the 판을 다시 짠다 card opens another.
    choices: {},
    system: {
      route: "c7_route_system",
      final: "c7_final_system_route",
      title: "발령 기록부",
      speaker: "에코",
      text: "내 발령(근무지를 옮기라는 인사 명령) 한 건을 다투는 대신 같은 모양의 발령이 몇 건인지부터 묻자, 분석관실 단말에 인사 발령 기록부가 열립니다. 에코가 조건을 걸러 냅니다. 최종 승인란이 빈 채 그대로 시행된 발령. 최근 4년 동안 열아홉 건입니다. 날짜도 보낸 곳도 제각각인데, 그중 열일곱 명이 같은 부서를 거쳐 갔습니다. 기업금융전략팀입니다. 사유 칸은 열아홉 줄 모두 비어 있습니다. 에코가 표의 맨 아래에 빈 줄 하나를 남겨 둡니다. '당신은 열여덟 번째가 아니라, 같은 표의 한 줄입니다. 이 열아홉 건은 지금까지 한 표로 묶인 적이 없었습니다.'",
      memo: ["승인란 공란 발령 19건", "17명이 기업금융전략팀 경유", "표의 마지막 줄은 아직 비어 있음"],
      routeChoices: [
        {
          id: "c7_route_system_trace",
          label: "열아홉 건을 전부 따라가 표를 완성한다",
          effect: { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 },
          voice: "빈 승인란이 우연인지 가려낼 수 있게, 열아홉 건을 전부 따라가 표를 완성한다.",
          echo: "전부 따라가면 열아홉 장이 한 장의 표가 됩니다. 표를 완성하는 데 남은 시간의 절반이 들어갑니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c7_route_system_quiet",
          label: "표는 닫고 내 건만 처리한다",
          effect: { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 },
          voice: "남의 발령까지 다툴 처지가 아니라며, 표는 닫고 내 건만 처리한다.",
          echo: "표를 닫으면 당신의 발령은 한 건의 인사로 돌아갑니다. 같은 모양의 발령들은 서로를 모르는 채 남습니다.",
          cognition: { risk: 2 },
        },
        {
          id: "c7_route_system_call",
          label: "먼저 발령된 열일곱 명에게 연락한다",
          effect: { trust: 12, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 },
          voice: "기록보다 겪은 사람들 말이 먼저여서, 먼저 발령된 열일곱 명에게 연락한다.",
          echo: "연락하면 몇 사람은 전화를 끊고, 몇 사람은 오래 말합니다. 그들은 자기 발령이 표의 한 줄이었다는 것을 처음 듣습니다.",
          cognition: { reframing: 2 },
        },
      ],
      finalTitle: "열아홉 줄과 빈 한 줄",
      finalText: "발령(근무지를 옮기라는 인사 명령)까지 열두 시간, 인사 대장 단말에는 승인란이 빈 발령 열아홉 건이 한 표로 떠 있습니다. 이름, 날짜, 보낸 곳, 그리고 비어 있는 승인란. 열일곱 명이 기업금융전략팀을 거쳤고, 표의 마지막 줄은 아직 비어 있습니다. 분석관실 창밖은 벌써 어둡고, 층에는 당신 자리의 불만 켜져 있습니다. 에코가 묻습니다. '당신이 열기 전에 이것은 표가 아니었습니다. 따로 보관된 열아홉 장이었습니다. 다시 낱장으로 돌려놓겠습니까?' 낱장일 때는 인사였고, 표가 되면 방식이 됩니다.",
      finalMemo: ["승인란 공란 발령 19건이 한 표로 묶임", "표의 마지막 줄: 공란", "발령 적용까지 12시간"],
    },
    finalChoices: [
      {
        id: "a",
        label: "열아홉 건을 하나의 문서로 묶어 외부에 낸다",
        effect: { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 },
        voice: "다시 낱장으로 흩어지지 않게, 열아홉 건을 하나의 문서로 묶어 외부에 낸다.",
        echo: "한 문서가 되면 빈 승인란은 실수가 아니라 방식으로 읽힙니다. 열아홉 명의 이름도 그 문서와 함께 밖으로 나갑니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "내 건만 취소시키고 나머지는 덮는다",
        effect: { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 },
        voice: "열두 시간으로 되돌릴 수 있는 건 하나라며, 내 건만 취소시키고 나머지는 덮는다.",
        echo: "당신의 발령은 취소될 수 있습니다. 같은 표의 다른 줄들은 취소된 줄이 있었다는 것도 모릅니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "표의 마지막 줄에 내 이름을 적어 남긴다",
        effect: { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 },
        voice: "나도 같은 표의 한 줄임을 숨기지 않기로 하고, 표의 마지막 줄에 내 이름을 적어 남긴다.",
        echo: "이름을 적으면 표의 빈 줄이 채워집니다. 다음에 이 표를 여는 사람은 마지막 줄에서 당신을 먼저 만납니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c7_evidence_turn",
    result: "c7_aftershock",
    sourceRoutes: ["c7_ledger", "c7_counter", "c7_paper", "c7_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "발령서 작성일을 단서의 날짜들 사이에 끼워, 무엇이 먼저였는지 순서를 세운다.",
    entryEcho: "순서를 세우면 이 발령은 결과가 아니라 예고편이 됩니다.",
    title: "작성일이 먼저였다",
    speaker: "반재욱",
    text: "쥐고 있던 단서를 발령서 작성일에 대자 순서가 드러납니다. 감사팀 서고에서 반재욱이 달력을 펴고 날짜 세 개에 동그라미를 칩니다. 발령서 작성일은 오진우 조사가 시작된 날보다 12일 앞섭니다. 그리고 그 작성일 하루 전에, 당신이 온새 건에서 대출 갚는 조건표가 어디서 내려왔느냐고 물은 날이 있습니다. 반재욱이 세 동그라미를 선으로 잇습니다. '조사가 시작돼서 발령이 난 게 아닙니다. 질문이 시작돼서 발령이 준비된 겁니다. 오진우 건은 사유가 아니라 명분이었습니다.' 그가 수첩에 같은 선을 옮겨 그립니다. 승인란이 빈 채 기업금융전략팀을 거쳐 간 발령은 앞서 열일곱 건이 더 있고, 순서가 전부 같습니다.",
    memo: ["작성일 = 온새의 대출 갚는 조건표 출처를 물은 다음 날", "오진우 조사는 발령 사유가 아니라 발령 명분", "같은 순서가 앞선 17건에서도 반복됨"],
    triggers: ["injustice", "system", "selfAwareness"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      {
        id: "c7_evidence_turn_order",
        label: "질문한 날과 작성일을 나란히 붙여 제출한다",
        effect: { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 },
        voice: "질문한 날과 작성한 날을 같은 줄에 놓고, 그대로 제출한다.",
        echo: "두 날짜를 나란히 놓으면 우연이라는 말이 어려워집니다. 당신의 질문도 함께 기록됩니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c7_evidence_turn_hold",
        label: "순서는 알아 두고 이번엔 쓰지 않는다",
        effect: { capital: 7, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 },
        voice: "이 순서는 내가 알고만 있겠다며, 이번 문서에서는 뺀다.",
        echo: "알고만 있으면 오늘은 안전합니다. 열여덟 번째 발령은 예정대로 시행됩니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c7_evidence_turn_share",
        label: "앞선 17명에게 이 순서를 먼저 알린다",
        effect: { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 },
        voice: "나보다 먼저 옮겨진 사람들에게, 이 순서부터 알린다.",
        echo: "앞선 사람들이 알면 표는 혼자 서지 않습니다. 열일곱 명 중 몇이 답할지는 모릅니다.",
        cognition: { reframing: 2 },
      },
    ],
    entryLabel: "발령서가 쓰인 날과 조사가 시작된 날의 순서를 연다",
  },
  memoryPlan: {
    systemNext: "c7_route_system",
    evidenceNext: "c7_evidence_turn",
    systemLabel: "오진우 곁에서 다시 짠 판이 내 인사 기록에 따라붙었는지 들춘다",
    evidenceLabel: "거울 프로필의 실험 번호를 발령서 작성일 옆에 적는다",
    systemEcho: "들추면 당신의 인사 기록 비고란에 그때 다시 짠 판이 옮겨져 있습니다. 그 아래로 같은 모양의 발령 기록부가 열립니다.",
    evidenceEcho: "실험 번호를 옆에 적으면 발령서 작성일이 조사 개시일보다 앞에 놓입니다. 순서가 바뀌면 이유와 결과도 자리를 바꿉니다.",
  },
  openingRoutes: {
    c6_after_stand: "c7_start_stand",
    c6_after_open: "c7_start_open",
    c6_after_name: "c7_start_name",
  },
  openingCopy: {
    c7_start_stand: ["자리를 남긴 사람의 발령", "도윤하", "당신은 오진우가 돌아올 자리를 치우지 않았습니다. 그 다음 주 아침, 통로 끝 그 책상 앞에 도윤하가 종이 한 장을 들고 서 있습니다. 화분에 물을 주러 왔다가 당신 자리에 놓인 걸 먼저 봤다고 합니다. 인사 발령서(근무지를 옮기라는 인사 명령서)입니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 징계가 아니라 인사라서 이의 절차도, 사유를 알려 줄 의무도 없습니다. 마지막 장의 최종 승인란은 비어 있습니다. 도윤하가 작성일을 손가락으로 짚습니다. 오진우가 결근하기 시작한 날보다 앞선 날짜입니다. '그 사람 자리는 그대로인데요. 치워지는 건 분석관님 자리예요.'", ["오진우의 자리는 아직 그대로", "당신의 발령서 작성일이 더 빠름", "같은 층에서 두 자리가 동시에 비게 됨"]],
    c7_start_open: ["조건을 연 사람의 발령", "에코", "두 사람의 설정값을 공개 기록으로 연 지 한 주. 분석관실 공개 기록 단말에는 그 기록이 그대로 떠 있습니다. 실험은 멈추지 않았습니다. 담당자만 바뀌었습니다. 에코가 같은 화면에 문서 하나를 더 띄웁니다. 인사 발령서(근무지를 옮기라는 인사 명령서)입니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 징계가 아니라 인사라서 이의 절차도 사유 고지도 없고, 최종 승인란은 비어 있습니다. 후임 분석관의 배치는 이미 끝나 있습니다. '공개는 기록에 남았습니다. 공개한 사람은 240km 밖으로 갑니다. 이 두 줄은 서로 다른 문서에 적혀 있어서, 나란히 읽는 사람이 없습니다.'", ["설정값 공개 기록은 유효", "실험 자체는 중단되지 않음", "후임 분석관 배치가 이미 완료됨"]],
    c7_start_name: ["이름으로 닫은 사람의 발령", "반재욱", "당신은 한 사람의 이름으로 사건을 닫았습니다. 다음 주 아침, 반재욱이 분석관실로 올라와 종이 한 장을 책상에 놓습니다. 인사 발령서(근무지를 옮기라는 인사 명령서)입니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 최종 승인란은 비어 있습니다. '징계가 아니라 인사입니다. 그래서 이의 절차가 없고, 사유를 알려 줄 의무도 없습니다.' 그가 수첩을 펴지 않고 말합니다. '조직은 그 방식이 빠르다는 걸 배웠습니다. 한 사람으로 닫는 방식 말입니다. 이번에는 그걸 분석관님한테 씁니다. 다만 이번에는 이름조차 필요 없습니다. 자리만 옮기면 되니까요.' 근거 칸에는 지난번 종결 문서의 번호가 선례로 적혀 있습니다.", ["지난 종결 방식이 선례로 인용됨", "이번 처리에는 사유 고지가 없음", "같은 절차가 이미 준비돼 있었음"]],
  },
  openingSignatures: {
    c7_start_stand: {
      label: "오진우에게 먼저 내 발령서를 보여준다",
      effect: { trust: 11, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
      cognition: { reframing: 2 },
      voice: "내가 자리를 남겨 둔 그 사람에게, 이번엔 내 쪽 서류를 먼저 펼친다.",
      echo: "그에게 보여주면 두 발령서는 같은 손글씨를 공유합니다. 그가 그 사실을 감당할지는 별개입니다.",
    },
    c7_start_open: {
      label: "공개했던 감사 경로로 발령서를 그대로 올린다",
      effect: { legitimacy: 12, trust: 4, capital: -7, time: -4, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "한 번 열어 둔 경로가 있으니, 이번 서류도 같은 문으로 올린다.",
      echo: "열어 둔 문은 두 번째부터 빨라집니다. 그 문을 아는 사람도 두 번째부터 빨라집니다.",
    },
    c7_start_name: {
      label: "지난번 이름을 올렸던 절차를 이번엔 내 이름으로 연다",
      effect: { trust: 9, legitimacy: 6, humanCost: -5, capital: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "남의 이름으로 열었던 절차를, 이번엔 내 이름을 넣어 다시 연다.",
      echo: "같은 절차에 자기 이름을 넣으면 그 절차가 무엇이었는지 처음으로 정확히 보입니다.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "발령까지 48h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 07
    c7_start: {
      place: "트리거랩 4층 분석관실",
      clock: "발령까지 48h",
      question: "48시간 뒤면 당신은 240km 밖 지점에 있고 파일은 여기 남습니다. 남은 이틀을 어디에 쓰겠습니까?",
      lead: "인사위원회(직원의 징계나 자리 이동을 정하는 회의)가 끝나고 한 주 뒤 아침입니다. 한서윤이 인쇄된 발령서(새 근무지로 옮기라는 인사 명령서)를 들고 와 마지막 장의 빈 승인란을 먼저 보여줍니다.",
    },
    c7_start_stand: {
      place: "트리거랩 4층 · 오진우의 자리 앞",
      clock: "발령까지 48h",
      question: "그의 자리를 지켜 준 다음 주에 치워진 것은 당신의 자리입니다. 남은 이틀을 어디에 쓰겠습니까?",
      lead: "돌아올 의자를 치우지 않은 대가가 도착했습니다. 발령서(근무지를 옮기라는 인사 명령서) 작성일은 그가 결근한 날보다 앞섭니다.",
    },
    c7_start_open: {
      place: "트리거랩 4층 분석관실 · 공개 기록 단말",
      clock: "발령까지 48h",
      question: "설정값을 공개한 사람은 남고 실험도 남았는데 당신만 옮겨집니다. 남은 이틀을 어디에 쓰겠습니까?",
      lead: "공개는 기록에 남았습니다. 실험은 멈추지 않았고, 후임 분석관 배치만 조용히 끝나 있었습니다.",
    },
    c7_start_name: {
      place: "트리거랩 4층 분석관실",
      clock: "발령까지 48h",
      question: "한 사람의 이름으로 사건을 닫은 절차가 이번에는 당신에게 옵니다. 남은 이틀을 어디에 쓰겠습니까?",
      lead: "이번에는 이름도 필요 없었습니다. 자리를 옮기는 데에는 사유 고지 의무가 없습니다.",
    },
    c7_ledger: {
      place: "트리거랩 2층 감사팀 서고",
      clock: "발령까지 46h",
      question: "존재해서는 안 되는 수첩에 당신의 이름이 연필로 적혀 있습니다. 이 기록을 어떻게 받겠습니까?",
      lead: "반재욱이 서고 안쪽 캐비닛을 열쇠로 엽니다. 그가 이 방을 다른 사람에게 보여준 적은 없습니다.",
    },
    c7_receipt: {
      place: "트리거랩 앞 도로",
      clock: "발령까지 45h",
      question: "마흔일곱 명을 자른 사람이 4,300원을 반으로 나누자고 합니다. 이 계산을 어떻게 끝내겠습니까?",
    },
    c7_receipt_reaction: {
      place: "트리거랩 앞 도로 · 택시 뒷자리",
      clock: "발령까지 44h",
      question: "수첩은 비닐에 싸여 있고 그는 어느 쪽이든 오늘 사표를 씁니다. 어떤 방식으로 받겠습니까?",
    },
    c7_counter: {
      place: "KD은행 강서지점",
      clock: "발령까지 43h",
      question: "신청서 뒷장이 나가면 그때 창구에 앉았던 네 사람의 이름이 따라 나옵니다. 어떻게 받겠습니까?",
      lead: "도윤하가 3년 만에 자기 지점 문을 엽니다. 그를 내보낸 지점장은 아직 같은 자리에 앉아 있습니다.",
    },
    c7_branch_quota: {
      place: "KD은행 강서지점 · 문서고",
      clock: "발령까지 42h",
      question: "목표표 상단에 '심사 의견 무관'이라는 손글씨가 있습니다. 이 한 줄을 어떻게 쓰겠습니까?",
    },
    c7_branch_quota_follow: {
      place: "KD은행 강서지점 · 문서고",
      clock: "발령까지 41h",
      question: "같은 목표표로 이미 세 사람이 잘렸습니다. 그 세 이름을 이번 문서에 어떻게 적겠습니까?",
    },
    c7_teller: {
      place: "KD은행 강서지점 · 4번 창구",
      clock: "발령까지 42h",
      question: "정년 한 해를 앞둔 행원이 자기 이름을 접어서 사본을 내밉니다. 그 접힌 쪽을 펴겠습니까?",
    },
    c7_teller_reaction: {
      place: "KD은행 강서지점 앞",
      clock: "발령까지 41h",
      question: "목표표에는 네 사람의 이름이 있고 도윤하는 자기 것만 정할 수 있습니다. 나머지 셋은 어떻게 하겠습니까?",
    },
    c7_paper: {
      place: "회기동 헌책방 2층",
      clock: "발령까지 21h",
      question: "임경수는 보호가 아니라 자기 이름을 맨 위에 써 달라고 합니다. 그 요구를 받아들이겠습니까?",
      lead: "3년 동안 종이 한 장을 지켜 온 사람이 처음으로 대가를 말합니다.",
    },
    c7_ticket: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "발령까지 19h",
      question: "총무팀은 이미 06:40 강릉행 편도를 발권했습니다. 이 표를 어떻게 하겠습니까?",
    },
    c7_ticket_reaction: {
      place: "회기동 헌책방 앞 골목",
      clock: "발령까지 18h",
      question: "같은 패턴의 발권이 3년간 여섯 건이고 여섯 명 전원이 탔습니다. 당신은 어떻게 하겠습니까?",
    },
    c7_route_system: {
      place: "트리거랩 4층 분석관실 · 인사 대장 단말",
      clock: "발령까지 15h",
      question: "승인란이 빈 채 시행된 발령이 4년간 열아홉 건입니다. 이 표를 어디까지 열겠습니까?",
    },
    c7_final_system_route: {
      place: "트리거랩 4층 분석관실 · 인사 대장 단말",
      clock: "발령까지 12h",
      question: "표의 마지막 줄은 아직 비어 있습니다. 이 표를 어떻게 닫겠습니까?",
    },
    c7_evidence_turn: {
      place: "트리거랩 2층 감사팀 서고",
      clock: "발령까지 10h",
      question: "발령서 작성일이 당신의 질문 다음 날입니다. 이 순서를 어떻게 쓰겠습니까?",
    },
    c7_final: {
      place: "트리거랩 4층 · 오진우의 자리",
      clock: "발령까지 6h",
      question: "이 문서에 이름이 몇 개 올라가는지가 남았습니다. 누구의 이름으로 가져가겠습니까?",
      lead: "오진우가 책상 정리를 멈추고 돌아봅니다. 그의 진술 없이는 설정값을 말할 수 있는 사람이 없습니다.",
    },
    c7_aftershock: {
      place: "트리거랩 4층 분석관실",
      clock: "적용일 09:10",
      question: "전산 반영이 하루 늦어 사원증이 아직 열립니다. 남은 하루를 어디에 쓰겠습니까?",
    },
  },
  clue: {
    id: "c7-drafted-first",
    title: "먼저 쓰인 발령서",
    text: "발령서 작성일이 조사 개시보다 12일 앞섭니다. 이 인사는 사건의 결과가 아니라 사건보다 먼저 준비된 답입니다.",
  },
  outcomes: {
    c7_after_stand: { tag: "사람을 먼저 찾은 결말", title: "이름을 올린 사람들을 하루 만에 다 만났다", text: "문서는 한 줄도 나아가지 않았습니다. 대신 그 문서에 적힌 이름들이 무엇에 동의한 것인지 전부 알고 있게 됐습니다." },
    c7_after_open: { tag: "원본을 넘긴 결말", title: "권한이 살아 있는 마지막 하루를 다 썼다", text: "외부 감사인은 원본을 받았습니다. 당신은 다음 날 06시 40분 기차에 없었고, 그 사실도 함께 기록됐습니다." },
    c7_after_alone: { tag: "조용히 떠난 결말", title: "아무에게도 알리지 않고 짐을 쌌다", text: "소란은 없었습니다. 문서에 적힌 다른 이름들은 그대로 남았고, 그들은 당신이 어디 있는지 모릅니다." },
  },
  carryovers: {
    c7_after_stand: { trust: 9, capital: -5, fatigue: 6 },
    c7_after_open: { legitimacy: 10, humanCost: -4, fatigue: 7 },
    c7_after_alone: { trust: -11, humanCost: 7, capital: 6 },
  },
  continuityChallenges: {
    c6_after_stand: { id: "protect-trust", title: "지켜 준 자리를 청구서로 만들지 않기", text: "옆자리를 지킨 기준이 이번엔 당신을 향합니다. 그 기준을 스스로에게도 적용하는 선택을 찾아야 합니다." },
    c6_after_open: { id: "find-cost", title: "공개가 비껴간 사람 찾기", text: "조건을 열었는데 실험은 남았습니다. 그 공개가 누구를 지나쳤는지 찾으면 숨은 단서가 열릴 수 있습니다." },
    c6_after_name: { id: "repair-legitimacy", title: "같은 절차를 내 이름으로 열기", text: "남의 이름으로 닫았던 절차가 이번에는 당신 차례입니다. 그 절차를 공정하게 되돌리는 선택이 압박을 낮춥니다." },
  },
};
