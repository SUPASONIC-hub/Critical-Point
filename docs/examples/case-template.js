/**
 * 견본: 사건 하나의 모양 (docs/writing-a-case.md와 함께 읽습니다)
 *
 * 이 파일은 게임에 들어가지 않습니다. 사건 목록(src/nodes/casePacks.js)이 불러오지
 * 않고, 빌드(scripts/vite-season-data.mjs)는 src/nodes/ 아래만 읽으며, 사건 검사
 * (check:graph·check:canon·check:dialogue·check:plain-language·check:card-labels)는
 * 조립된 시즌 그래프를 읽으므로 여기는 보지 않습니다. docs/ 아래의 .js를 읽는 검사는
 * `npm run lint`(저장소의 모든 .js)뿐이고, check:changed는 docs/ 아래를 문서 규칙
 * (check:doc-numbers, check:visual-baselines)으로 다룹니다.
 *
 * 실제 사건은 장면 20개(본 장면 5, 여파 1, 연결 3, 반응 3, 샛길 2, 숨은 경로 2,
 * 단서 반전 1, 오프닝 3)입니다. 여기는 그중 셋 -- 브리핑, 결정, 여파 -- 만 실제
 * 모양으로 두고, 나머지는 어느 칸에 들어가는지 주석으로 가리킵니다. 그대로
 * src/nodes/case50.js로 복사하면 check:graph가 "is missing ..."으로 멈추는 것이
 * 정상이고, 그 뒤부터는 docs/writing-a-case.md 1장·5장을 보며 채웁니다.
 *
 * 글의 규칙은 검사가 지킵니다: 카드 라벨 30자 이하, 장면 본문 420자 이하, 어려운
 * 말은 처음 읽히는 곳에서 괄호로 풀이, `voice`는 「이유, + 라벨」, `echo`는 카드를
 * 받아 이미 일어난 일로 열기(~자, ~니). 사건 50은 2026년이므로 요일이 붙은 날짜는
 * 2026년 달력과 맞아야 합니다(check:canon).
 */

// 본 장면. 실제 사건은 c50_start부터 결정 장면 c50_final까지 다섯 개입니다.
// 장면 id와 카드 id는 모두 `c50_`으로 시작합니다.
const case50Nodes = {
  c50_start: {
    phase: "CASE 50 BRIEFING",
    title: "두 번째 봉인 테이프",
    speaker: "한서윤",
    // 첫 문장은 날짜·시각이 아니라 행동이나 이미지로 엽니다. 날짜는 아래 sceneContext의 clock이 찍습니다.
    text: "한서윤이 바인더 하나를 책상 가운데에 놓습니다. 봉인 테이프(뜯으면 VOID 무늬가 남는 테이프)가 두 겹입니다. 아래 겹은 임경수의 서명이 있고, 위 겹에는 아무 서명도 없습니다. '어제 열람실에서 나온 겁니다. 누가 한 번 뜯고 다시 붙였어요.' 이민서가 열람 로그를 띄웁니다. 지난주 목요일 저녁, 사번 하나가 40분 동안 이 바인더를 꺼내 갔습니다. 그 사번은 지금 33층에 있습니다.",
    memo: [
      "바인더: 2023-0412 심사 기록 원본 출력본, 워터마크 있음",
      "봉인 테이프 두 겹 -- 아래 겹에만 임경수 서명",
      "열람 로그: 지난주 목요일 18:40~19:20, 사번 1건",
    ],
    triggers: ["curiosity", "responsibility", "system"],
    choices: [
      {
        id: "c50_start_log",
        label: "열람 로그의 사번부터 누구인지 확인한다", // 30자 이하
        effect: { legitimacy: 10, time: -5, trust: -2, fatigue: 3 },
        voice: "테이프보다 사람이 먼저라며, 열람 로그의 사번부터 누구인지 확인한다.",
        echo: "사번을 조회하니 그룹전략실 소속입니다. 이름은 인사 시스템이 가려 둔 채로 돌아옵니다.",
        next: "c50_final", // 실제 사건에서는 둘째 본 장면(예: c50_archive)으로 갑니다
        cognition: { inference: 2 },
      },
      {
        id: "c50_start_tape",
        label: "임경수에게 테이프 사진을 먼저 보낸다",
        effect: { trust: 10, humanCost: -3, time: -4, legitimacy: -2, fatigue: 4 },
        voice: "서명한 사람이 가장 빨리 안다며, 임경수에게 테이프 사진을 먼저 보낸다.",
        echo: "사진을 보내자 1분 만에 답이 옵니다. '위 겹은 내 테이프가 아닙니다. 내 것은 세 겹이었어요.'",
        next: "c50_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c50_start_open",
        label: "지금 바로 테이프를 뜯고 안을 확인한다",
        effect: { time: 6, capital: 3, legitimacy: -8, trust: -3, humanCost: 2, fatigue: 1 },
        voice: "기다리는 사이에 또 바뀔 수 있다며, 지금 바로 테이프를 뜯고 안을 확인한다.",
        echo: "테이프를 뜯으니 VOID 무늬가 두 겹으로 남습니다. 이제 누가 먼저 뜯었는지는 로그로만 말할 수 있습니다.",
        next: "c50_final",
        cognition: { risk: 2 },
      },
      // 판을 다시 짠다 카드. 라벨은 이 사건의 숨은 경로가 실제로 하는 일을 20자 안팎으로.
      // 효과·생각 방식은 게임이 정하므로 쓰지 않습니다.
      { id: "reframe", label: "같은 바인더의 열람 기록을 1년치 불러온다", type: "reframe", next: "c50_final" },
    ],
  },
  // c50_archive, c50_floor33, c50_crosscheck -- 둘째~넷째 본 장면이 여기 들어갑니다.
  // 그 장면들의 카드는 연결 장면(connectiveScenes)이 가져가므로 `next`를 쓰지 않습니다.
  c50_final: {
    phase: "FINAL DECISION",
    title: "누구의 이름으로 봉인하나",
    speaker: "반재욱",
    text: "반재욱이 새 봉인 테이프 한 롤을 책상에 올립니다. '다시 붙일 겁니다. 문제는 누구 서명으로 붙이느냐예요.' 임경수의 서명이면 원본이 그대로였다는 뜻이 되고, 분석관의 서명이면 한 번 열렸다는 기록이 남습니다. 서명 없이 붙이면 아무도 책임지지 않은 테이프가 하나 더 늘어납니다. 열람실 마감까지 20분입니다.",
    memo: ["새 봉인 테이프 1롤", "열람실 마감 18:00", "서명 후보: 임경수 / 분석관 / 없음"],
    triggers: ["responsibility", "order", "fear"],
    choices: [
      {
        id: "c50_final_sign",
        label: "분석관 이름으로 서명해 열렸던 기록을 남긴다",
        effect: { legitimacy: 12, trust: 4, time: -3, capital: -2, fatigue: 3 },
        voice: "한 번 열린 것을 지울 수는 없다며, 분석관 이름으로 서명해 열렸던 기록을 남긴다.",
        echo: "서명하자 반재욱이 사진을 찍어 감사팀 기록에 붙입니다. 33층에서 전화가 오는 데 11분이 걸립니다.",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c50_final_ask",
        label: "임경수를 불러 그의 서명으로 다시 봉인한다",
        effect: { trust: 10, humanCost: -4, time: -6, legitimacy: 2, fatigue: 5 },
        voice: "원래 서명한 사람의 손으로 닫혀야 한다며, 임경수를 불러 그의 서명으로 다시 봉인한다.",
        echo: "임경수가 택시로 옵니다. 테이프를 붙이며 그가 묻습니다. '위 겹은 누가 붙였는지 알아냈습니까?'",
        cognition: { persistence: 2 },
      },
      {
        id: "c50_final_blank",
        label: "서명 없이 봉인하고 로그만 보관한다",
        effect: { time: 7, capital: 4, legitimacy: -9, trust: -5, humanCost: 3, fatigue: -2 },
        voice: "마감이 먼저라며, 서명 없이 봉인하고 로그만 보관한다.",
        echo: "테이프는 마감 2분 전에 붙습니다. 서명란은 비어 있고, 그 빈칸을 본 사람은 셋입니다.",
        cognition: { risk: 2 },
      },
    ],
  },
};

export const case50 = {
  id: "case50",
  nodes: case50Nodes,
  // 여파 장면. 카드 셋이 이 사건의 결말 셋이고, next는 결과 화면 case50_result입니다.
  aftermath: {
    c50_aftershock: {
      phase: "AFTERMATH",
      title: "테이프 위의 이름",
      speaker: "이민서",
      text: "다음 날 아침, 열람실 입구에 안내문이 붙습니다. '봉인 자료 열람은 당일 신청·당일 반납.' 이민서가 안내문 사진을 단체방에 올리며 한 줄을 답니다. '어제 20분 늦게 붙였으면 이 문장이 없었을까요.' 바인더는 제자리에 있고, 테이프 위의 이름은 어제 고른 그대로입니다.",
      memo: ["열람실 안내문 1장 -- 당일 신청·당일 반납", "바인더 위치: 열람실 3열 2단"],
      triggers: ["order", "recognition"],
      choices: [
        {
          id: "c50_after_warm",
          label: "임경수와 이민서에게 먼저 고맙다고 말한다",
          effect: { trust: 8, fatigue: -3 },
          voice: "이름을 지킨 건 사람들이라며, 임경수와 이민서에게 먼저 고맙다고 말한다.",
          echo: "말하자 이민서가 안내문 사진을 한 장 더 찍습니다. '다음 사건 때 쓰려고요.'",
          next: "case50_result",
          cognition: { persistence: 1 },
        },
        {
          id: "c50_after_record",
          label: "열람 로그와 테이프 사진을 감사 기록으로 묶는다",
          effect: { legitimacy: 9, time: -3 },
          voice: "안내문 한 장으로 끝낼 일이 아니라며, 열람 로그와 테이프 사진을 감사 기록으로 묶는다.",
          echo: "묶으니 기록이 한 건 늘고, 33층의 사번 하나가 그 기록의 첫 줄에 남습니다.",
          next: "case50_result",
          cognition: { inference: 2 },
        },
        {
          id: "c50_after_rush",
          label: "다음 사건 준비로 바로 넘어간다",
          effect: { time: 6, capital: 3, trust: -3 },
          voice: "안내문이 붙었으면 된 거라며, 다음 사건 준비로 바로 넘어간다.",
          echo: "넘어가자 책상 위의 바인더 사진은 폴더 맨 아래로 내려갑니다.",
          next: "case50_result",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  aftermathRoute: ["c50_final", "c50_aftershock"],

  // 아래 칸은 실제 사건이 모두 채워야 하는 칸입니다. 모양은 docs/writing-a-case.md 1장·5장,
  // 실제 값은 src/nodes/case49.js를 봅니다.
  connectiveScenes: [], // 셋: { id, after, next, title, speaker, text, memo, choices } -- 카드에 id·next 없음
  reactionScenes: [], // 셋: after가 연결 장면 id
  branchPlan: null, // ["c50_archive", 0, "c50_branch_x", "c50_branch_x_follow"]
  branchScenes: {},
  routePlan: null, // 숨은 경로: start, result, defaultFree, system, finalChoices ...
  evidencePlan: null, // 단서 반전: sourceRoutes, entryLabel, requiredAuthority ...
  memoryPlan: null, // 기억 카드: systemLabel/evidenceLabel, systemNext/evidenceNext, systemEcho/evidenceEcho

  // 오프닝 셋. 키는 **앞 사건**(사건 49)의 여파 카드 id입니다.
  openingRoutes: { c49_after_warm: "c50_start_warm", c49_after_record: "c50_start_record", c49_after_rush: "c50_start_rush" },
  openingCopy: {
    // c50_start_warm: ["제목", "화자", "본문", ["메모"]], -- 셋 모두
  },
  openingSignatures: {
    // c50_start_warm: { label, effect, cognition, voice, echo }, -- 셋 모두
  },

  // 이 사건에서 처음 나오는 사람만. 여덟 칸을 모두 씁니다. 새 인물이 없으면 {}.
  characterProfiles: {},

  setting: { place: "트리거랩 지하 1층 · 분석관실", clock: "10월 둘째 주 · 17시 10분" },
  // 장면 20개 모두에 하나씩. place의 「건물 · 방」 모양이 장면 그림(src/scenePlate.js)의 방을 고릅니다.
  sceneContext: {
    c50_start: {
      place: "트리거랩 지하 1층 · 분석관실",
      clock: "열람실 마감까지 50분",
      question: "봉인 테이프가 두 겹입니다. 무엇부터 확인하겠습니까?",
      lead: "열람실(기록을 꺼내 보되 가지고 나갈 수 없는 방)에서 돌아온 바인더가 책상 가운데에 있습니다.",
    },
    c50_final: {
      place: "KD은행 본점 8층 · 심사 기록 열람실",
      clock: "열람실 마감까지 20분",
      question: "새 테이프에 누구의 서명을 붙이겠습니까?",
      lead: "열람실 창가 책상에 새 봉인 테이프 한 롤과 바인더가 나란히 놓여 있습니다.",
      pressure: true, // 결정 장면은 원래 압박 장면이라 없어도 됩니다. 다른 장면을 조여 들게 하려면 씁니다.
    },
    c50_aftershock: {
      place: "KD은행 본점 8층 · 심사 기록 열람실 앞 복도",
      clock: "다음 날 · 08시 50분",
      question: "안내문 한 장이 붙었습니다. 사건을 어떻게 닫겠습니까?",
      lead: "열람실 유리문에 A4 안내문 한 장이 테이프로 붙어 있습니다.",
    },
  },

  clue: { id: "c50-second-tape", title: "두 번째 봉인 테이프", text: "임경수의 서명 위에 서명 없는 테이프가 한 겹 더 붙어 있다. 열람 로그의 사번은 33층 소속." },

  // 키는 **이번 사건**의 여파 카드 id입니다.
  outcomes: {
    c50_after_warm: { tag: "사람", title: "고맙다는 말부터", text: "테이프 위의 이름보다 그 이름을 지킨 사람들에게 먼저 갔다." },
    c50_after_record: { tag: "기록", title: "감사 기록 한 건", text: "열람 로그와 사진이 감사 기록으로 묶였고, 33층의 사번이 첫 줄에 남았다." },
    c50_after_rush: { tag: "속도", title: "폴더 맨 아래", text: "안내문 한 장으로 사건을 닫았다. 바인더 사진은 폴더 맨 아래로 내려갔다." },
  },
  carryovers: {
    c50_after_warm: { trust: 6, fatigue: -3 },
    c50_after_record: { legitimacy: 6, time: -2 },
    c50_after_rush: { time: 4, capital: 2, trust: -2 },
  },
  // 키는 **앞 사건**의 여파 카드 id. id는 protect-trust / repair-legitimacy / find-cost / use-reframe / lower-risk / avoid-risk 중 하나.
  continuityChallenges: {
    c49_after_warm: { id: "protect-trust", title: "사람을 먼저", text: "어제 건넨 것들을 받은 사람들의 믿음을 이 사건에서도 지킨다." },
    c49_after_record: { id: "repair-legitimacy", title: "기록으로", text: "빈 서명란의 기록을 이 사건의 테이프에서도 이어 간다." },
    c49_after_rush: { id: "find-cost", title: "치른 값", text: "서두른 대가가 어디에 남았는지 이 사건에서 찾는다." },
  },
};
