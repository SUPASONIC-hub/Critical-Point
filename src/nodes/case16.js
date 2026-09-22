/**
 * CASE 16 -- the authored scenes of the night shift the robots were leased for.
 *
 * 강태민 has been the season's fixed point since the first dawn: the night-shift
 * lead who tore open a cup noodle for the analyst while 플로우온 was seventy-two
 * hours from collapse, and who has carried two of them in his vest ever since.
 * This is his case. Two months after the group's "reform", 플로우온's fulfilment
 * centre leases 120 picking robots from KD캐피탈, and the eighty people on the
 * night shift learn at 04:12, mid-shift, by text message, that their contracts
 * end on 31 December.
 *
 * The case refuses the easy villain. The robots are not the enemy -- the night
 * shift names one '다람이', 강태민 beats it in a thirty-minute picking race and then
 * cannot stand up, and the young lease reviewer 최서진 genuinely believes machines
 * take people out of work that breaks wrists. What the case finds instead is the
 * season's pattern again: a lease whose condition precedent is "eighty people
 * gone by year end", a reviewer's dissent quietly replaced with "no remarks" (the
 * analyst's own story, three years younger), and a request memo from the group
 * strategy office with the requester's field left blank, because the point was
 * never the robots but a cheaper payroll before a stake sale.
 *
 * Laughter is the race and 권도현 running out of whiteboard; anger is the text
 * message; sorrow is where the second cup noodle came from; joy is the night shift
 * finding out it has been the robots' maintenance crew all along. The case closes
 * on eighty-one cup noodles and a call from 반재욱 about his notebook -- 사건 17.
 */
export const case16Nodes = {
  c16_start: {
    phase: "CASE 16 BRIEFING",
    title: "새벽 4시 12분",
    speaker: "강태민",
    text:
      "첫눈이 온 아침, 강태민이 처음으로 낮에 트리거랩 4층에 올라옵니다. 형광 조끼 어깨에 앉은 눈이 녹아 번집니다. 그가 인사 대신 휴대폰을 내밉니다. '[플로우온] 12월 31일부로 계약이 종료됨을 안내드립니다. 그동안 수고 많으셨습니다.' 발신 시각은 새벽 4시 12분, 야간조 80명이 상자를 들고 있던 시간입니다. 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)가 KD캐피탈 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융)로 물류 로봇 120대를 들인다고 합니다. 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. '저는 괜찮아요. 80명 중에 서른 명이 안 괜찮아요.'",
    memo: [
      "계약 종료 통보: 문자 1통, 새벽 4시 12분",
      "야간조 80명 -- 12월 31일 계약 종료",
      "KD캐피탈 리스 물류 로봇 120대, 월 리스료 3억 4천만 원",
      "리스 승인위원회까지 6일",
    ],
    triggers: ["injustice", "protection", "affection"],
    choices: [
      {
        id: "c16_start_night",
        label: "오늘 밤 야간조 대기실로 가서 80명을 직접 만난다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c16_duel",
        cognition: { persistence: 2 },
      },
      {
        id: "c16_start_lease",
        label: "리스 신청서와 계약 조건부터 한 줄씩 읽는다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c16_duel",
        cognition: { inference: 2 },
      },
      {
        id: "c16_start_severance",
        label: "막을 수 없다면 퇴직 위로금부터 빨리 올려 받자고 한다",
        effect: { capital: 9, time: 6, legitimacy: -6, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c16_duel",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c16_duel",
      },
    ],
  },
  c16_duel: {
    phase: "NIGHT SHIFT",
    title: "강태민 대 다람이",
    speaker: "강태민",
    text:
      "새벽 두 시, 풀필먼트센터 B동. 시범 운영 중인 로봇 네 대가 선반 사이를 오갑니다. 야간조는 그중 한 대에 '다람이'라는 이름을 붙였습니다. 앞에 달린 주황색 불빛 두 개가 도토리를 문 다람쥐 볼 같다고요. 리스 현장 심사를 나온 KD캐피탈 최서진이 태블릿을 들고 서 있는데, 막내 유하온이 판을 벌입니다. '반장님 대 다람이, 30분 피킹(주문 목록대로 선반에서 물건을 골라 담는 일) 대결!' 결과는 강태민 212건, 다람이 198건. 대기실이 환호로 뒤집힙니다. 그리고 강태민이 허리를 짚고 주저앉는 사이, 다람이는 삑 소리와 함께 199번째 주문을 집습니다. 최서진이 조용히 말합니다. '저 로봇은 허리가 없어요. 그래서 들였으면 하는 거예요.'",
    memo: [
      "시범 운영 로봇 4대 -- 도입 예정 120대",
      "30분 대결: 강태민 212건 · 다람이 198건",
      "다람이 가동 시간: 하루 22시간, 충전 2시간",
      "최서진: KD캐피탈 리스 심사역, 현장 심사 중",
    ],
    triggers: ["competition", "affection", "curiosity"],
    choices: [
      {
        id: "c16_duel_faces",
        label: "최서진에게 80명의 이름과 얼굴부터 한 명씩 소개한다",
        effect: { trust: 13, legitimacy: -3, humanCost: -5, time: -4, fatigue: 5 },
        next: "c16_review",
        cognition: { persistence: 2 },
      },
      {
        id: "c16_duel_data",
        label: "대결 기록과 현장 사고 기록을 심사 자료로 달라고 한다",
        effect: { legitimacy: 12, trust: -4, time: -6, humanCost: 3, fatigue: 4 },
        next: "c16_review",
        cognition: { inference: 2 },
      },
      {
        id: "c16_duel_ask",
        label: "로봇이 들어오면 누구의 하루가 달라지는지 최서진에게 묻는다",
        effect: { trust: 10, humanCost: -6, legitimacy: 4, capital: -5, time: -7, fatigue: 5 },
        next: "c16_review",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c16_review",
      },
    ],
  },
  c16_review: {
    phase: "REVIEW ROOM",
    title: "지워진 의견란",
    speaker: "최서진",
    text:
      "밤 아홉 시 반, 을지로 KD캐피탈 12층 리스심사팀 회의실. 최서진이 모두 퇴근한 뒤에 당신을 들입니다. 화면에는 플로우온 리스 심사 보고서가 떠 있고, 맨 아래 '심사역 의견'란에는 '특이사항 없음' 여섯 글자뿐입니다. 최서진이 자기 노트북에서 사흘 전 올린 원본을 엽니다. '야간 인력의 단계적 전환 및 재교육 조건 부여 권고.' 여섯 줄이 있었습니다. '팀장님이 위원회에 올리기 전에 정리했대요. 위원들이 바쁘시다고.' 그가 웃으려다 맙니다. '엄마가 택배 분류를 12년 하다가 손목 수술을 두 번 받았어요. 그래서 로봇 공부를 했고, 그래서 이 일을 해요. 근데 제 의견이 이렇게 없어지는 거, 원래 이래요?' 당신은 그 질문의 답을 3년째 알고 있습니다.",
    memo: [
      "심사 보고서 원본: 의견 6줄 · 제출본: '특이사항 없음'",
      "수정자: 리스심사2팀장, 승인위원회 사흘 전",
      "최서진: 로봇공학 전공, 입사 3년차",
      "3년 전 당신의 반대 의견도 같은 칸에서 사라짐",
    ],
    triggers: ["selfAwareness", "injustice", "trust"],
    choices: [
      {
        id: "c16_review_sign",
        label: "원본 의견을 다시 올리고 자기 이름으로 서명하라고 권한다",
        effect: { trust: 12, legitimacy: 6, capital: -6, time: -5, fatigue: 5 },
        next: "c16_roof",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c16_review_trace",
        label: "원본과 제출본의 수정 이력을 승인위원회에 정식으로 알린다",
        effect: { legitimacy: 11, trust: 7, time: -8, humanCost: -4, fatigue: 6 },
        next: "c16_roof",
        cognition: { inference: 2 },
      },
      {
        id: "c16_review_quiet",
        label: "그 의견은 협상에만 조용히 쓰고 최서진은 드러내지 않는다",
        effect: { capital: 8, time: 5, trust: -5, humanCost: 5, legitimacy: -2, fatigue: 2 },
        next: "c16_roof",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c16_roof",
      },
    ],
  },
  c16_roof: {
    phase: "FIRST SNOW",
    title: "두 번째 컵라면",
    speaker: "강태민",
    text:
      "새벽 네 시 반, 센터 옥상 난간에 첫눈이 쌓입니다. 강태민이 보온병의 물을 컵라면 두 개에 붓습니다. '그날 새벽 기억나요? 플로우온 망한다던 72시간.' 당신은 기억합니다. 은행 사람이 아무도 밤에 오지 않던 그때, 그가 두 번째 컵라면을 뜯어 주었습니다. '그거 원래 정우 형 거였어요. 창업 첫해 동기. 맨날 까먹고 안 챙겨 와서 제가 두 개씩 샀죠. 4년 전에 야간조 하다 쓰러졌어요. 산업재해(일하다 다치거나 병든 것) 인정은 못 받았고요.' 그가 김이 오르는 컵을 내밉니다. '회사가 저보고 남으래요. 로봇 지켜보는 여섯 명 중에 반장이니까 제일 먼저. 근데 79명 보내고 혼자 남으면, 이 두 번째는 누구 줘요?'",
    memo: [
      "잔류 제안: 로봇 관제 인력 6명, 명단 첫 줄 강태민",
      "정우 형: 창업 첫해 동기, 4년 전 야간 근무 중 쓰러짐",
      "산업재해 불인정 -- 사유: 업무 관련성 부족",
      "옥상 적설 2cm, 첫눈",
    ],
    triggers: ["affection", "helplessness", "responsibility"],
    choices: [
      {
        id: "c16_roof_beside",
        label: "강태민이 무엇을 정하든 끝까지 옆에 있겠다고 약속한다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: -2, fatigue: 5 },
        next: "c16_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c16_roof_criteria",
        label: "잔류 여섯 명이 어떤 기준으로 뽑혔는지부터 확인하자고 한다",
        effect: { legitimacy: 8, time: 5, trust: -5, humanCost: 3, fatigue: 2 },
        next: "c16_final",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c16_roof_inside",
        label: "남아서 안에서 79명이 돌아올 문을 여는 사람이 되어 달라고 한다",
        effect: { trust: 11, humanCost: -4, capital: -5, time: -7, fatigue: 5 },
        next: "c16_final",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c16_final",
      },
    ],
  },
  c16_final: {
    phase: "FINAL DECISION",
    title: "120대와 80명",
    speaker: "강태민",
    text:
      "KD캐피탈 리스 승인위원회. 긴 탁자에 위원 다섯 명이 앉고, 벽 화면에는 로봇 120대의 도입 일정표가 떠 있습니다. 최서진이 심사역 자리에서 원본 의견서를 두 손으로 쥐고 있습니다. 창밖에는 첫눈이 이틀째 내리고, 로비 소파에는 야간조를 마치고 곧장 온 강태민이 형광 조끼 차림으로 앉아 있습니다. 위원장이 안건을 읽습니다. '원안대로면 오늘 승인, 1월 2일 가동입니다.' 회의 직전 복도에서 강태민이 한 말이 아직 귀에 남아 있습니다. '로봇 들어와도 돼요. 정우 형 허리 대신 쟤들이 들면 좋죠. 근데 우리가 나가는 문이 문자 한 통이면 안 돼요.' 위원장이 당신을 봅니다. 발언 시간은 5분입니다.",
    memo: [
      "원안: 로봇 120대 리스 · 조건 '야간 인력 80명 연내 정리'",
      "조건을 바꾸면 리스료 4% 인상 -- 플로우온이 다른 리스사로 갈 수 있음",
      "승인 시 1월 2일 가동",
      "최서진 원본 의견서 6줄 지참",
    ],
    triggers: ["choice", "injustice", "affection"],
    choices: [
      {
        id: "c16_final_phase",
        label: "단계적 전환과 재교육을 리스 조건에 넣어 승인한다",
        effect: { trust: 11, legitimacy: 6, capital: -5, time: -5, humanCost: -4, fatigue: 6 },
        next: "case16_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c16_final_block",
        label: "지워진 의견과 인력 정리 조건을 들어 승인을 막는다",
        effect: { legitimacy: 13, trust: 5, capital: -10, time: -9, humanCost: 3, fatigue: 6 },
        next: "case16_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c16_final_severance",
        label: "승인은 받아들이고 퇴직 조건을 두 배로 올린다",
        effect: { capital: 12, time: 6, trust: -3, legitimacy: -7, humanCost: 4, fatigue: -3 },
        next: "case16_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case16_result",
      },
    ],
  },
};

/**
 * Everything else case 16 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case16 = {
  id: "case16",
  nodes: case16Nodes,
  aftermath: {
    c16_aftershock: {
      phase: "AFTERMATH",
      title: "컵라면 여든 개",
      speaker: "강태민",
      text: "승인위원회가 끝난 밤, 야간조 대기실에서 전기포트 네 대가 한꺼번에 끓습니다. 강태민이 컵라면 여든 개를 탁자에 줄 세우고, 권도현은 개당 1,150원이라며 영수증부터 챙깁니다. 유하온은 다람이 등에 컵라면 상자를 싣고 대기실을 한 바퀴 돌게 합니다. 다람이가 배수경 앞에서 멈추자 그가 '너 나 좋아하지' 하며 주황색 불빛을 쓰다듬습니다. 최서진은 빌린 형광 조끼를 입은 채 처음으로 국물까지 다 마십니다. 강태민이 여든한 번째 컵라면을 당신 앞에 놓습니다. '두 번째 거예요.' 그때 반재욱에게서 문자가 옵니다. '그룹 법무팀이 내 수첩을 내놓으랍니다. 당신 이름이 거기 있다고요.'",
      memo: ["컵라면 80개 + 1개", "다람이 적재 시험: 컵라면 상자 12개 성공", "최서진, 야간조 단체방에 초대됨", "반재욱: 그룹 법무팀이 수첩 제출 요구"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c16_after_warm", label: "오늘은 마지막 컵라면을 다 먹을 때까지 대기실에 남는다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case16_result", cognition: { reframing: 2 } },
        { id: "c16_after_record", label: "전환과 재교육 조건을 그룹 리스의 표준 조항으로 문서화한다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case16_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c16_after_rush", label: "컵라면을 내려놓고 법무팀이 기다리는 다음 싸움으로 곧장 간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case16_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c16_final", "c16_aftershock"],
  connectiveScenes: [
    ["c16_ledger", "c16_duel", "c16_review", "칸이 모자랍니다", "권도현", "새벽 네 시, 대기실 화이트보드. 강태민의 연락을 받고 온 권도현이 세로줄을 긋습니다. 왼쪽은 로봇 1대, 오른쪽은 야간조 1명. 월 리스료 283만 원 대 월급 312만 원, 로봇이 이깁니다. 그가 칸을 더합니다. 정비비, 전기료, 로봇이 멈출 때마다 밀리는 주문, 지켜보는 인력. 사람 쪽에는 야간수당과 허리 치료비. 칸이 늘수록 두 숫자가 붙습니다. 보드 끝에 닿자 권도현이 마커를 든 채 멈춥니다. '칸이 모자랍니다.' 그가 벽에 A4 용지를 테이프로 이어 붙이기 시작합니다. 강태민이 컵라면을 건넵니다. '그거 다 붙이면 날 새요.' '이미 샜습니다.'", ["로봇 1대 월 리스료 283만 원 · 야간조 1인 월 312만 원", "숨은 비용 칸 14개 -- 화이트보드 초과", "칸을 다 채우면 차이는 1인당 월 9만 원"], ["칸을 더 붙여 사람 쪽 비용까지 전부 적는다", "완성된 계산서를 리스 심사 자료로 정식 제출한다", "계산은 됐으니 결론 숫자 하나만 챙겨 간다"]],
    ["c16_log", "c16_review", "c16_roof", "새벽의 오류 기록", "최서진", "다음 날 밤, 최서진이 태블릿 대신 형광 조끼를 빌려 입고 센터에 옵니다. 시범 로봇의 정지 기록을 뽑아 보니 한 달에 마흔일곱 번 멈췄고, 마흔일곱 번 모두 야간에 누군가 다시 켰습니다. 기록마다 짧은 메모가 붙어 있습니다. '03:12 바퀴 비닐 감김 제거 -- 하온.' '04:40 그냥 삐짐. 쓰다듬어 줌 -- 하온.' 최서진이 한참 웃다가 조용해집니다. '이분들이 이미 정비를 하고 계셨네요.' 그가 수첩을 폅니다. '제조사 정비 교육 과정이 12주예요. 이걸 야간조한테 먼저 열자고 하면요?'", ["야간 정지 47회 -- 다시 켠 사람은 전부 야간조", "제조사 정비 교육: 12주, 정원 20명", "수료하면 로봇 정비 직무로 옮길 수 있음"], ["정비 교육 과정을 야간조에게 먼저 열자고 함께 제안한다", "교육 대상과 선발 기준부터 문서로 정리한다", "교육은 나중 문제라며 승인 일정부터 맞춘다"]],
    ["c16_list", "c16_roof", "c16_final", "잔류 명단", "배수경", "아침 교대 시간, 대기실 게시판에 A4 한 장이 붙습니다. '관제(로봇이 움직이는 화면을 지켜보며 조정하는 일) 인력 잔류 명단, 6명.' 첫 줄이 강태민입니다. 누가 먼저랄 것도 없이 박수가 나옵니다. 축하하는 박수인지 배웅하는 박수인지 아무도 모릅니다. 강태민이 게시판 앞에서 장갑을 벗다가 멈춥니다. 포장 라인 배수경이 그의 등을 두드립니다. '반장, 받아. 반장 하나는 남아 있어야 우리가 나중에 놀러 오지.' 그러고는 목소리를 낮춥니다. '근데 반장 빼고 다섯이 다 서른다섯 아래 남자야. 그건 좀 이상하지 않아?'", ["잔류 6명: 강태민 + 35세 이하 남성 5명", "선발 기준 공개 없음", "발표 방식: 게시판 A4 1장"], ["강태민의 결정에 맡기고 대기실의 작별부터 챙긴다", "잔류 명단의 선발 기준을 공개하라고 요구한다", "명단은 이미 났으니 승인위원회 준비로 넘어간다"]],
  ],
  connectiveOrder: [["c16_duel", "c16_ledger"], ["c16_review", "c16_log"], ["c16_roof", "c16_list"]],
  choiceEffects: {
    c16_duel: [
      { trust: 11, legitimacy: 5, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
      { legitimacy: 7, trust: 3, time: -7, humanCost: 4, fatigue: 4 },
      { time: 6, capital: 5, trust: -5, humanCost: 5, fatigue: -3 },
    ],
    c16_review: [
      { trust: 11, legitimacy: 4, humanCost: -5, capital: -4, time: -4, fatigue: 4 },
      { legitimacy: 6, humanCost: -3, trust: 3, capital: -2, time: -5, fatigue: 2 },
      { time: 5, capital: 5, trust: -5, humanCost: 4, fatigue: -4 },
    ],
    c16_roof: [
      { trust: 9, humanCost: -5, legitimacy: -3, time: -2, fatigue: 3 },
      { legitimacy: 10, trust: 5, humanCost: 3, time: -5, fatigue: 4 },
      { time: 5, capital: 4, trust: -4, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c16_duel: {
      voice: ["칸을 더 붙여서, 사람 쪽 비용까지 전부 적자고 한다.", "완성된 계산서를, 리스 심사 자료로 정식 제출한다.", "계산은 됐으니, 결론 숫자 하나만 챙겨 간다."],
      echo: ["A4가 벽 한 면을 다 덮습니다. 마지막 칸에 권도현이 '정우 형'이라고 적었다가, 한참 뒤에 '산재 위험'으로 고칩니다.", "제출된 계산서는 위원회 자료집 41쪽에 들어갑니다. 위원들이 41쪽까지 넘길지는 모릅니다.", "월 9만 원이라는 숫자 하나가 남습니다. 그 숫자를 만든 열네 칸은 화이트보드 지우개에 지워집니다."],
    },
    c16_review: {
      voice: ["정비 교육 과정을, 야간조에게 먼저 열자고 함께 제안한다.", "교육 대상과 선발 기준부터, 문서로 정리하자고 한다.", "교육은 나중 문제라며, 승인 일정부터 맞춘다."],
      echo: ["최서진이 그 자리에서 제조사에 메일을 씁니다. 제목에 '급함'을 세 번 붙였다가 두 번 지웁니다.", "기준이 문서가 되면 공정해집니다. 문서가 되는 동안 교육 1기 모집 마감은 지나갈 수 있습니다.", "일정은 맞춰집니다. 유하온의 메모 마흔일곱 줄은 로그 파일 안에 그대로 묻힙니다."],
    },
    c16_roof: {
      voice: ["강태민의 결정에 맡기고, 대기실의 작별부터 챙긴다.", "잔류 명단의 선발 기준을, 공개하라고 요구한다.", "명단은 이미 났으니, 승인위원회 준비로 넘어간다."],
      echo: ["작별을 챙기면 대기실에 롤링페이퍼가 돕니다. 강태민 칸에만 '컵라면 사 줘요'가 스물세 번 적힙니다.", "기준을 묻자 인사 담당자가 '체력 평가'라고 답합니다. 체력 평가를 받은 사람은 아무도 없습니다.", "준비는 빨라집니다. 게시판의 A4는 한 달 동안 떼어지지 않고, 배수경의 질문도 그 옆에 남습니다."],
    },
  },
  reactionScenes: [
    ["c16_ledger_reaction", "c16_ledger", "c16_review", "먼저 나가야 하는 사람들", "에코", "에코가 권도현의 A4 옆에 리스 계약서 초안을 띄웁니다. 월 9만 원 차이를 위해 80명을 내보내자는 계산은 어디에도 없습니다. 대신 부속서(계약서 뒤에 붙는 추가 약속 문서) 3쪽에 한 줄이 있습니다. '리스 개시의 선행 조건(이게 먼저 이뤄져야 계약이 효력을 갖는 조건): 야간 인력 80명 연내 정리 확약.' 에코가 밑줄을 긋습니다. '로봇이 사람을 대신하는 순서가 아닙니다. 사람이 먼저 나가야 로봇이 들어올 수 있게 적혀 있습니다. 이 순서를 누가 정했는지는 계약서에 없습니다.'", ["선행 조건 조항을 강태민과 야간조에게 그대로 보여 준다", "누가 이 조항을 넣었는지 계약서 작성 이력을 요청한다", "조항은 협상 카드로 쥐고 아직 말하지 않는다"]],
    ["c16_log_reaction", "c16_log", "c16_roof", "저 고졸인데요", "유하온", "대기실에 교육 이야기가 돌자 유하온이 제일 먼저 손을 듭니다. 그리고 곧바로 내립니다. '저 고졸인데요. 그런 거 대학 나온 사람들이 하는 거 아니에요?' 최서진이 태블릿을 돌려 제조사 정비 매뉴얼 첫 장을 보여 줍니다. '자격 요건: 없음.' 유하온이 두 번 읽습니다. 뒤에서 강태민이 말합니다. '얘 손이 센터에서 제일 빨라요.' 배수경이 끼어듭니다. '나도 할래. 손목은 안 쓰는 거지?' 대기실이 웃음으로 뒤집히는 사이, 정원이 스무 명이라는 말이 뒤늦게 돕니다. 80명 중 스무 명입니다.", ["정원을 늘려 80명 모두에게 기회를 달라고 요구한다", "누가 먼저 갈지 선발 기준을 야간조와 함께 정한다", "손 드는 사람 중 빠른 순서로 스무 명을 먼저 보낸다"]],
    ["c16_list_reaction", "c16_list", "c16_final", "4퍼센트", "최서진", "승인위원회 전날 밤, 센터 주차장에 눈발이 날릴 때 최서진이 전화를 겁니다. 목소리가 떨립니다. '팀장님이 그러는데요, 단계적 전환이나 재교육을 조건으로 달면 리스료가 4% 오른대요. 그러면 플로우온은 다른 리스사로 간대요. 거기는 아무 조건도 안 붙이고요.' 수화기 너머 키보드 소리가 멈춥니다. '그럼 우리가 조건을 달아도 80명은 그대로 나가고, 우리는 실적만 잃는 거잖아요. 로봇이 사람을 살린다고 생각했는데, 로봇은 아무 생각이 없고 사람만 생각이 많네요.'", ["틀리지 않았다고 말하고 내일 최서진과 같이 들어간다", "다른 리스사의 조건을 확인해 4%의 근거부터 따진다", "4% 인상분을 플로우온이 떠안도록 협상 카드로 쓴다"]],
  ],
  reactionEffects: {
    c16_ledger: [
      { trust: 10, humanCost: -4, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: 3, capital: -5, time: -4, fatigue: 5 },
      { time: 5, capital: 5, trust: -5, humanCost: 5, fatigue: -3 },
    ],
    c16_log: [
      { trust: 10, humanCost: -5, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 7, trust: 4, time: -4, humanCost: 2, fatigue: 2 },
      { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c16_list: [
      { trust: 8, humanCost: -4, legitimacy: 2, time: -5, fatigue: 3 },
      { legitimacy: 11, trust: 3, capital: -6, time: -3, fatigue: 5 },
      { capital: 6, time: 4, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c16_ledger: {
      voice: ["선행 조건 조항을, 강태민과 야간조에게 그대로 보여 준다.", "누가 이 조항을 넣었는지, 계약서 작성 이력을 요청한다.", "조항은 협상 카드로 쥐고, 아직 말하지 않는다."],
      echo: ["조항을 본 대기실이 조용해집니다. 강태민이 처음으로 컵라면 뚜껑을 덮지 않은 채 오래 둡니다.", "이력 요청은 사흘이 걸린다는 답이 옵니다. 승인위원회는 닷새 뒤입니다.", "카드는 손에 남습니다. 80명은 그 줄이 있다는 걸 모르는 채 교대 근무에 들어갑니다."],
    },
    c16_log: {
      voice: ["정원을 늘려, 80명 모두에게 기회를 달라고 요구한다.", "누가 먼저 갈지, 선발 기준을 야간조와 함께 정한다.", "손 드는 사람 중 빠른 순서로, 스무 명을 먼저 보낸다."],
      echo: ["정원을 늘리자는 요구에 제조사가 강사를 두 명 더 구해야 한다고 답합니다. 비용 칸이 하나 늘어납니다.", "기준을 같이 정하자 배수경이 '손목 아픈 사람 먼저'를 제안합니다. 반대하는 사람이 없습니다.", "스무 명은 빨리 정해집니다. 손을 늦게 든 예순 명 중에는 그날 휴무였던 사람이 열한 명입니다."],
    },
    c16_list: {
      voice: ["틀리지 않았다고 말하고, 내일 최서진과 같이 들어간다.", "다른 리스사의 조건을 확인해, 4%의 근거부터 따진다.", "4% 인상분을, 플로우온이 떠안도록 협상 카드로 쓴다."],
      echo: ["최서진이 한참 말이 없다가 '내일 여덟 시 반에 로비에서 봬요'라고 합니다. 목소리가 조금 덜 떨립니다.", "확인해 보니 다른 리스사는 정비를 제외한 조건입니다. 그 사실을 증명하는 데 밤을 씁니다.", "플로우온이 4%를 떠안으면 조건은 살아남습니다. 그 비용이 결국 누구의 연말 상여에서 빠질지는 아직 모릅니다."],
    },
  },
  reactionMemos: {
    c16_ledger_reaction: ["사람이 먼저 나가야 효력이 생기는 계약", "순서를 정한 사람은 계약서에 없음"],
    c16_log_reaction: ["자격 요건: 없음", "80명 중 스무 명"],
    c16_list_reaction: ["조건을 달면 리스료 4% 인상", "아무 조건 없는 다른 리스사"],
  },
  branchPlan: ["c16_duel", 0, "c16_branch_locker", "c16_branch_locker_follow"],
  branchScenes: {
    // CASE 16's detour is the lockers. The case argues over a lease; the side
    // door is the eighty strips of masking tape the lease will peel off, and the
    // discovery that the night shift has been fixing the robots all along.
    c16_branch_locker: {
      phase: "SIDE DOOR",
      title: "사물함 80칸",
      speaker: "배수경",
      text: "대기실 뒤편 사물함 80칸에는 이름이 마스킹테이프로 붙어 있습니다. 포장 라인 9년차 배수경이 벌써 자기 칸을 비우고 있습니다. 손목 보호대 세 짝, 딸 졸업 사진, 반쯤 남은 파스 한 통. '문자 받자마자 싸기 시작했어요. 미리 싸 두면 덜 서운할까 봐.' 그가 보호대를 들어 보입니다. '오른손은 두 번 수술했어요. 산업재해(일하다 다치거나 병든 것)로 신청하려다 말았죠. 계약 연장 안 해 줄까 봐.' 그러고는 웃습니다. '로봇 들어온다니 솔직히 반가워요. 내 손목 대신 쟤가 하면 좋지. 근데 나는 어디로 가요?'",
      memo: ["사물함 80칸 중 이미 비운 칸 11개", "배수경: 포장 라인 9년차, 오른손 손목 수술 2회", "산업재해 신청 0건 -- '계약 연장 안 될까 봐'", "야간조 평균 나이 47세"],
      triggers: ["affection", "helplessness", "injustice"],
      choices: [
        { id: "c16_branch_locker_a", label: "배수경의 손목 수술을 산업재해로 다시 신청하도록 돕는다", effect: { trust: 11, legitimacy: 4, capital: -4, time: -3, fatigue: 3 }, next: "c16_branch_locker_follow", cognition: { persistence: 2 } },
        { id: "c16_branch_locker_b", label: "짐은 싸 두고 위로금 조건부터 알아보자고 한다", effect: { capital: 9, time: 5, trust: -6, humanCost: 4, fatigue: -3 }, next: "c16_branch_locker_follow", cognition: { risk: 1 } },
        { id: "c16_branch_locker_c", label: "80명이 다치고도 신청하지 못한 기록부터 모은다", effect: { legitimacy: 11, time: -6, humanCost: 3, trust: 3, fatigue: 4 }, next: "c16_branch_locker_follow", cognition: { inference: 2 } },
      ],
    },
    c16_branch_locker_follow: {
      phase: "SIDE DOOR",
      title: "머리핀 정비사",
      speaker: "유하온",
      text: "새벽 세 시, 다람이가 C열 한가운데서 멈춥니다. 바퀴에 포장 비닐이 감겼습니다. 제조사 정비 기사는 낮에만 옵니다. 막내 유하온이 주머니에서 머리핀을 꺼내 바퀴 틈을 파내고, 뒤판을 열어 리셋 버튼을 3초 누릅니다. 주황색 불빛이 다시 켜집니다. 유하온이 휴대폰 메모를 보여 줍니다. 한 달 동안 적은 오류 기록 마흔일곱 줄. '비닐 감김 19번, 바코드 못 읽음 11번, 그냥 삐짐 3번.' 대기실에 웃음이 터집니다. 유하온이 머쓱하게 덧붙입니다. '낮에 오는 기사님보다 제가 얘를 더 많이 고쳤어요. 근데 저는 12월 31일에 나가요.'",
      memo: ["시범 로봇 4대 야간 정지 47회 -- 전부 야간조가 해결", "제조사 정비 계약: 주간 09~18시만", "유하온: 야간조 막내, 24세, 오류 기록 47줄", "'그냥 삐짐' 3회 -- 원인 불명"],
      triggers: ["curiosity", "trust", "injustice"],
      choices: [
        { id: "c16_branch_locker_follow_a", label: "유하온의 오류 기록을 들고 야간 정비 인력이 필요하다고 설득한다", effect: { trust: 12, legitimacy: 4, capital: -4, time: -3, fatigue: 3 }, next: "c16_ledger", cognition: { reframing: 3 } },
        { id: "c16_branch_locker_follow_b", label: "야간 정지 47회를 리스 심사의 공식 위험 항목으로 올린다", effect: { legitimacy: 12, trust: 5, time: -7, humanCost: 3, fatigue: 5 }, next: "c16_ledger", cognition: { inference: 2 } },
        { id: "c16_branch_locker_follow_c", label: "정비는 제조사 몫이라며 오류 기록은 유하온에게 돌려준다", effect: { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 }, next: "c16_ledger", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c16_start",
    result: "c16_aftershock",
    defaultFree: "c16_route_system",
    // One lease, eighty people. Like 사건 12 the case is a single line; the
    // split is whether the people leave through a door or through a text.
    choices: {},
    system: {
      route: "c16_route_system",
      final: "c16_final_system_route",
      title: "옮겨 간 위험",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD캐피탈이 지난 5년 동안 승인한 자동화 장비 리스 37건을 엽니다. 도입한 현장의 사고는 평균 41% 줄었습니다. 최서진이 믿는 숫자입니다. 에코가 칸 하나를 더 엽니다. 그 현장에서 계약이 끝난 1,906명의 1년 뒤입니다. 62%가 건설 일용직과 새벽 배송으로 옮겨 갔고, 그곳의 사고율은 전보다 두 배 높습니다. '위험은 줄지 않았습니다. 장부 밖으로 옮겨졌습니다. 37건 가운데 재교육 조건이 붙은 리스는 0건입니다.'",
      memo: ["자동화 리스 37건 -- 도입 현장 사고 41% 감소", "계약 종료자 1,906명 중 62%가 더 위험한 일로 이동", "재교육 조건이 붙은 리스 0건"],
      routeChoices: [
        ["c16_route_system_show", "이 통계를 최서진과 승인위원회에 동시에 보여 준다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c16_route_system_track", "계약이 끝난 사람의 1년 뒤를 추적하는 조항을 요구한다", { legitimacy: 9, trust: 4, capital: -3, time: -7, humanCost: -3, fatigue: 6 }, { reframing: 2 }],
        ["c16_route_system_drop", "통계는 덮고 승인 일정대로 간다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "계약이 끝나는 사람마다 1년치 전환 지원금을 리스료에 얹는다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "조건은 두지 않고 위로금만 올린다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "재교육을 마친 사람을 다른 센터에서도 먼저 뽑도록 묶는다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: -2, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c16_evidence_turn",
    result: "c16_aftershock",
    sourceRoutes: ["c16_duel", "c16_review", "c16_roof", "c16_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 리스 계약서 부속서 옆에 놓고, 80명 정리 조항을 누가 요청했는지 맞춰 본다.",
    entryEcho: "단서를 대면 조항을 쓴 사람이 아니라 조항을 원한 사람이 보입니다. 그 사람의 이름 칸은 비어 있습니다.",
    title: "빈 담당자란",
    speaker: "반재욱",
    text: "단서를 맞추자 선행 조건(이게 먼저 이뤄져야 계약이 효력을 갖는 조건) 조항의 작성 이력이 열립니다. '야간 인력 80명 연내 정리 확약'은 KD캐피탈이 쓴 문장이 아닙니다. 요청 부서는 KD금융그룹 그룹전략실, 요청일은 혁신위원회 출범 다음 주입니다. 첨부 메모에 한 줄이 있습니다. '1분기 플로우온 지분(회사를 나눠 가진 몫) 매각 전 인건비 개선 필요.' 담당자란은 비어 있습니다. 반재욱이 수첩을 덮습니다. '로봇을 들이려던 게 아니었군요. 회사를 비싸게 팔려고 사람부터 뺀 겁니다. 그리고 이번에도 서명한 사람이 없어요.'",
    memo: ["조항 요청 부서: KD금융그룹 그룹전략실", "메모: '1분기 지분 매각 전 인건비 개선 필요'", "담당자란: 공란"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
    choices: [
      ["c16_evidence_turn_expose", "요청 메모를 승인위원회에 내고 조항 삭제를 요구한다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c16_evidence_turn_hold", "메모는 쥐고 있다가 지분 매각 때 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c16_evidence_turn_share", "야간조 80명에게 먼저 이 메모를 보여 준다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c16_branch_locker",
    systemNext: "c16_route_system",
    evidenceNext: "c16_evidence_turn",
    routeLabel: "직전 사건의 교문 앞 응원단 명단으로 야간조를 한 명씩 찾아간다",
    systemLabel: "직전 자유응답 문장이 리스 심사 보고서에도 옮겨졌는지 본다",
    evidenceLabel: "직전 단서를 붙여 인력 정리 조항의 작성 이력을 연다",
  },
  openingRoutes: {
    c15_after_warm: "c16_start_warm",
    c15_after_record: "c16_start_record",
    c15_after_rush: "c16_start_rush",
  },
  openingCopy: {
    c16_start_warm: ["목요일 저녁의 빈자리", "강태민", "수능 날 저녁 교문 계단에서 식은 뭇국을 나눠 먹을 때, 강태민의 휴대폰에 뜬 야간조 단체방 글은 소문 한 줄이었습니다. 'B동에 로봇 들어온대.' 그날 계단에 같이 앉았던 사람들은 그 뒤로 목요일마다 저녁을 먹었고, 열흘 뒤 첫눈이 온 목요일에 강태민이 처음으로 늦습니다. 그가 인사 대신 휴대폰을 내밉니다. 새벽 4시 12분에 온 계약 종료 문자입니다. 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)가 KD캐피탈 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융)로 로봇 120대를 들이고, 야간조 80명은 연말에 나갑니다. 이서준이 젓가락을 내려놓습니다. '아저씨도요?'", ["목요일 저녁 모임 -- 수능 이후 두 번째", "수능 날 소문 한 줄이 열흘 만에 계약 종료 문자로", "KD캐피탈 리스 로봇 120대, 야간조 80명", "리스 승인위원회까지 6일"]],
    c16_start_record: ["요청자 없는 서류", "에코", "계약직 확인서 관행을 없애는 개선안을 인사부에 접수하며, 당신은 맨 앞에 원칙 한 줄을 적었습니다. '위에서 내려온 서류에는 요청한 사람의 이름과 거절할 수 있는 칸이 있어야 한다.' 열흘 뒤 에코가 그 원칙에 걸리는 서류를 하나 찾아냅니다. KD캐피탈 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융) 신청서입니다. 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)에 로봇 120대를 들이는 건이고, 수능 날 저녁 강태민의 단체방을 스친 소문의 정체입니다. 첨부된 인력 계획에는 야간조 80명의 계약 종료가 적혀 있고, 요청한 사람의 이름은 없습니다. 80명은 이미 새벽 4시 12분에 문자를 받았습니다.", ["리스 신청서 첨부: 야간조 80명 계약 종료", "요청자란: 공란 · 거절 칸: 없음", "통보 방식: 문자 1통, 새벽 4시 12분", "리스 승인위원회까지 6일"]],
    c16_start_rush: ["새벽 다섯 시의 노크", "강태민", "수능 날 저녁 강태민의 단체방 글을 따라 곧장 센터로 간 뒤 열흘, 당신은 'B동에 로봇 들어온대'라는 소문의 출처를 쫓느라 거의 집에 들어가지 못했습니다. 아무도 확인해 주지 않았습니다. 첫눈이 온 새벽 다섯 시, 트리거랩 4층 문을 누가 두드립니다. 야간조를 막 마친 강태민이 형광 조끼에 눈을 얹은 채 서 있습니다. '확인됐어요.' 그가 새벽 4시 12분에 온 계약 종료 문자를 내밉니다. 플로우온 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고)가 KD캐피탈 리스(장비를 빌려 쓰고 매달 사용료를 내는 금융)로 로봇 120대를 들인답니다. '80명이에요. 당신처럼 빨리 뛰는 사람이 필요해요.'", ["계약 종료 문자: 야간조 80명, 48분 전", "열흘 쫓은 소문, 문자 한 통으로 확인", "KD캐피탈 리스 로봇 120대", "리스 승인위원회까지 6일"]],
  },
  openingSignatures: {
    c16_start_warm: {
      label: "목요일 저녁 식탁을 그대로 야간조 대기실로 옮겨 차린다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "목요일 저녁 식탁을, 그대로 야간조 대기실로 옮겨 차린다.",
      echo: "떡볶이 냄비가 대기실에 들어서자 야간조가 줄을 섭니다. 80명 몫은 아니어서, 이서준이 편의점을 세 번 다녀옵니다.",
    },
    c16_start_record: {
      label: "리스 신청서에 요청한 사람의 이름을 적으라고 공식 요구한다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "리스 신청서에, 요청한 사람의 이름을 적으라고 공식 요구한다.",
      echo: "요구는 접수됩니다. 답변 기한은 승인위원회 다음 날로 잡힙니다.",
    },
    c16_start_rush: {
      label: "강태민과 함께 그 길로 센터 교대 시간에 맞춰 간다",
      effect: { trust: 12, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "강태민과 함께, 그 길로 센터 교대 시간에 맞춰 간다.",
      echo: "교대 시간에 도착하면 퇴근하는 80명과 마주칩니다. 문자를 받은 얼굴들이 당신이 누군지 묻습니다.",
    },
  },
  voiceLines: {
    // CASE 16. The night shift. Every line is said in a room where somebody is
    // holding a box, so none of them is allowed to sound like a press release.
    c16_start_night: "오늘 밤, 야간조 대기실로 가서 80명을 직접 만난다.",
    c16_start_lease: "80명이 왜 나가는지 거기 적혀 있을 거라며, 리스 신청서와 계약 조건부터 한 줄씩 읽는다.",
    c16_start_severance: "막을 수 없다면, 퇴직 위로금부터 빨리 올려 받자고 한다.",
    c16_duel_faces: "로봇보다 사람이 먼저라며, 최서진에게 80명의 이름과 얼굴부터 한 명씩 소개한다.",
    c16_duel_data: "대결 기록과 현장 사고 기록을, 심사 자료로 달라고 한다.",
    c16_duel_ask: "로봇이 들어오면 누구의 하루가 달라지는지, 최서진에게 묻는다.",
    c16_branch_locker_a: "배수경의 손목 수술을, 산업재해로 다시 신청하도록 돕는다.",
    c16_branch_locker_b: "짐은 싸 두고, 위로금 조건부터 알아보자고 한다.",
    c16_branch_locker_c: "80명이 다치고도 신청하지 못한 기록부터, 모은다.",
    c16_branch_locker_follow_a: "유하온의 오류 기록을 들고, 야간 정비 인력이 필요하다고 설득한다.",
    c16_branch_locker_follow_b: "야간 정지 47회를, 리스 심사의 공식 위험 항목으로 올린다.",
    c16_branch_locker_follow_c: "정비는 제조사 몫이라며, 오류 기록은 유하온에게 돌려준다.",
    c16_review_sign: "원본 의견을 다시 올리고, 자기 이름으로 서명하라고 권한다.",
    c16_review_trace: "원본과 제출본의 수정 이력을, 승인위원회에 정식으로 알린다.",
    c16_review_quiet: "그 의견은 협상에만 조용히 쓰고, 최서진은 드러내지 않는다.",
    c16_roof_beside: "강태민이 무엇을 정하든, 끝까지 옆에 있겠다고 약속한다.",
    c16_roof_criteria: "잔류 여섯 명이 어떤 기준으로 뽑혔는지부터, 확인하자고 한다.",
    c16_roof_inside: "남아서 안에서, 79명이 돌아올 문을 여는 사람이 되어 달라고 한다.",
    c16_final_phase: "단계적 전환과 재교육을, 리스 조건에 넣어 승인한다.",
    c16_final_block: "지워진 의견과 인력 정리 조건을 들어, 승인을 막는다.",
    c16_final_severance: "승인은 받아들이고, 퇴직 조건을 두 배로 올린다.",
    c16_after_warm: "오늘은 마지막 컵라면을 다 먹을 때까지, 대기실에 남는다.",
    c16_after_record: "전환과 재교육 조건을, 그룹 리스의 표준 조항으로 문서화한다.",
    c16_after_rush: "컵라면을 내려놓고, 법무팀이 기다리는 다음 싸움으로 곧장 간다.",
    c16_route_system_show: "이 통계를, 최서진과 승인위원회에 동시에 보여 준다.",
    c16_route_system_track: "계약이 끝난 사람의 1년 뒤를, 추적하는 조항을 요구한다.",
    c16_route_system_drop: "통계는 덮고, 승인 일정대로 간다.",
    c16_final_system_route_a: "계약이 끝나는 사람마다, 1년치 전환 지원금을 리스료에 얹는다.",
    c16_final_system_route_b: "조건은 두지 않고, 위로금만 올린다.",
    c16_final_system_route_c: "재교육을 마친 사람을, 다른 센터에서도 먼저 뽑도록 묶는다.",
    c16_evidence_turn_expose: "요청 메모를 승인위원회에 내고, 조항 삭제를 요구한다.",
    c16_evidence_turn_hold: "메모는 쥐고 있다가, 지분 매각 때 꺼낸다.",
    c16_evidence_turn_share: "야간조 80명에게, 먼저 이 메모를 보여 준다.",
  },
  echoReplies: {
    // CASE 16.
    c16_start_night: "대기실에 가면 80명 중 누구도 당신을 반기지 않습니다. 강태민이 컵라면을 하나 건네자 그제야 자리가 납니다.",
    c16_start_lease: "계약 조건을 읽으면 부속서 3쪽에서 손가락이 멈춥니다. 그 한 줄을 설명하는 데 하루가 듭니다.",
    c16_start_severance: "위로금은 오를 수 있습니다. 오른 위로금을 받는 순간 80명은 떠나는 쪽으로 서류상 확정됩니다.",
    c16_duel_faces: "이름을 들을 때마다 최서진이 태블릿에 받아 적습니다. 서른 번째쯤에서 펜이 느려집니다.",
    c16_duel_data: "기록은 정확합니다. 212 대 198이라는 숫자는 강태민의 허리 통증까지는 적지 않습니다.",
    c16_duel_ask: "묻자 최서진이 오래 생각합니다. '관리자 하루는 편해져요. 여기 계신 분들 하루는… 없어져요.'",
    c16_branch_locker_a: "다시 신청하면 배수경의 손목은 서류가 됩니다. 그 서류는 계약이 끝난 뒤에도 그를 따라다닙니다.",
    c16_branch_locker_b: "위로금은 현실적인 답입니다. 배수경이 마지막 보호대를 가방에 넣고 사물함 테이프를 뗍니다.",
    c16_branch_locker_c: "기록을 모으면 80명 중 서른한 명이 다치고도 말하지 않았다는 게 드러납니다. 이유는 모두 같습니다.",
    c16_branch_locker_follow_a: "마흔일곱 줄이 증거가 되면 유하온이 처음으로 자기 메모를 부끄러워하지 않습니다.",
    c16_branch_locker_follow_b: "위험 항목으로 올라간 47회는 리스료를 올립니다. 리스료가 오르면 누군가는 그 숫자를 사람으로 메우려 합니다.",
    c16_branch_locker_follow_c: "돌려받은 메모를 유하온이 지우지 않고 둡니다. 12월 31일 이후 그 메모를 읽을 사람은 없습니다.",
    c16_review_sign: "이름을 걸면 최서진의 의견은 다시는 '정리'되지 않습니다. 대신 그의 다음 인사 평가가 달라집니다.",
    c16_review_trace: "수정 이력이 위원회에 가면 팀장이 해명서를 씁니다. 해명서 첫 줄은 '관행상'입니다.",
    c16_review_quiet: "최서진은 보호받습니다. 3년 전 당신의 의견처럼, 그의 여섯 줄도 아무도 모르는 문장으로 남습니다.",
    c16_roof_beside: "약속하면 강태민이 컵라면을 다 먹을 때까지 아무 말도 하지 않습니다. 다 먹고 나서 '고마워요'가 아니라 '식었네요'라고 합니다.",
    c16_roof_criteria: "기준을 확인하는 동안 강태민은 답을 미룹니다. 회사는 모레까지 답하라고 합니다.",
    c16_roof_inside: "남아 달라는 부탁은 무겁습니다. 강태민이 두 번째 컵라면을 눈 쌓인 난간에 한참 올려 둡니다.",
    c16_final_phase: "조건을 넣으면 로봇은 넉 달에 걸쳐 들어오고, 그동안 스무 명씩 교육을 받습니다. 리스료는 4% 오릅니다.",
    c16_final_block: "승인을 막으면 플로우온은 다른 리스사로 갑니다. 80명의 계약 종료일은 그대로 12월 31일입니다.",
    c16_final_severance: "퇴직 조건은 두 배가 됩니다. 1월 2일, 다람이 120대가 불을 켜고 대기실은 비어 있습니다.",
    c16_after_warm: "마지막 컵라면을 먹는 동안 다람이가 충전기로 돌아갑니다. 반재욱의 문자는 내일 아침까지 기다립니다.",
    c16_after_record: "표준 조항은 다음 센터, 그다음 센터에도 붙습니다. 강태민이 문서 맨 끝에 '정우 형 조항'이라고 연필로 적습니다.",
    c16_after_rush: "컵라면이 식는 동안 당신은 택시를 탑니다. 문자를 보낸 반재욱이 대신 대기실에 와서, 계약이 끝나는 80명에게 남은 서류를 한 장씩 챙겨 줍니다.",
    c16_route_system_show: "통계를 본 최서진이 한참 말이 없습니다. '저는 절반만 보고 있었네요.'",
    c16_route_system_track: "추적 조항은 전례가 없습니다. 전례가 없다는 이유로 법무 검토가 이틀 늘어납니다.",
    c16_route_system_drop: "일정은 지켜집니다. 1,906명 옆에 80명이 조용히 더해집니다.",
    c16_final_system_route_a: "지원금이 붙으면 계약이 끝나도 1년은 길이 남습니다. 리스료 계산서에 처음으로 사람 이름의 칸이 생깁니다.",
    c16_final_system_route_b: "위로금은 오릅니다. 떠난 사람이 1년 뒤 어디에 있는지는 여전히 아무도 세지 않습니다.",
    c16_final_system_route_c: "다른 센터까지 묶으면 교육받은 스무 명이 갈 곳이 생깁니다. 그 약속을 지킬 사람을 찾는 데 한 달이 걸립니다.",
    c16_evidence_turn_expose: "메모를 내면 위원회가 휴회합니다. 그룹전략실은 '실무 착오'라는 답을 30분 만에 보냅니다.",
    c16_evidence_turn_hold: "메모는 더 큰 싸움의 무기가 됩니다. 그 싸움이 오기 전에 80명은 짐을 쌉니다.",
    c16_evidence_turn_share: "메모를 본 대기실에서 누군가 '우리가 비싸서가 아니라 팔려고 그런 거네'라고 말합니다. 그 말이 단체방을 타고 밤새 돕니다.",
  },
  characterProfiles: {
    최서진: {
      role: "KD캐피탈 리스 심사역 · 입사 3년차",
      stance: "이상 · 기술 · 흔들림",
      job: "자동화가 사람을 위험한 일에서 빼 준다고 진심으로 믿는다. 그 믿음이 80명을 내보내는 서류에 쓰이는 걸 처음 본다.",
      appearance: "로봇공학과 학생증 끈을 그대로 쓰는 사원증, 태블릿, 센터에서 빌린 한 치수 큰 형광 조끼.",
      thought: "엄마 손목을 대신할 기계를 만들고 싶었다. 엄마를 대신할 기계를 만들고 싶었던 건 아니다.",
      gesture: "최서진은 확신이 흔들리면 태블릿 화면을 끄고, 맨손으로 수첩에 숫자를 다시 적는다.",
      voice: "기술 이야기를 할 때는 빠르고, 사람 이야기를 할 때는 문장 끝을 흐린다.",
      line: "저 로봇은 허리가 없어요. 그래서 들였으면 하는 거예요.",
    },
    다람이: {
      role: "플로우온 풀필먼트센터 시범 운영 물류 로봇 · 야간조가 붙인 이름",
      stance: "지치지 않음 · 가끔 삐짐",
      job: "하루 22시간 선반 사이를 오간다. 야간조와 겨룰 수는 있어도, 야간조의 대기실을 대신할 수는 없다.",
      appearance: "무릎 높이의 회색 몸체, 앞에 달린 주황색 불빛 두 개, 누군가 붙여 준 도토리 스티커.",
      thought: "(생각은 없다. 오류 기록에 '그냥 삐짐'이 세 번 있을 뿐이다.)",
      gesture: "다람이는 멈추기 전에 삑 소리를 두 번 내고, 다시 켜지면 한 바퀴 제자리를 돈다.",
      voice: "삑. 가끔 삑삑.",
      line: "삑. (다음 주문)",
    },
    유하온: {
      role: "플로우온 풀필먼트센터 야간조 막내 · 24세",
      stance: "손재주 · 머쓱함 · 발견",
      job: "아무도 시키지 않았는데 로봇을 고쳐 왔다. 그 일이 직업이 될 수 있다는 걸 모른다.",
      appearance: "귀에 꽂은 머리핀, 액정 깨진 휴대폰 속 오류 메모 마흔일곱 줄, 늘 풀려 있는 작업화 끈.",
      thought: "나는 고졸이고 막내다. 그런데 다람이는 내 말을 제일 잘 듣는다.",
      gesture: "유하온은 칭찬을 들으면 머리핀을 뺐다가 다시 꽂는다.",
      voice: "말끝을 올리며 묻듯이 말하고, 기계 이야기에서만 말이 빨라진다.",
      line: "낮에 오는 기사님보다 제가 얘를 더 많이 고쳤어요.",
    },
    배수경: {
      role: "플로우온 풀필먼트센터 포장 라인 · 9년차",
      stance: "생계 · 농담 · 손목",
      job: "떠날 사람들 가운데 가장 먼저 짐을 싸고, 가장 먼저 이상한 걸 알아챈다.",
      appearance: "양손의 손목 보호대, 앞치마 주머니의 파스, 사물함 문에 붙인 딸 졸업 사진.",
      thought: "로봇은 반갑다. 내 손목 대신 쟤가 하면. 문제는 나는 어디로 가느냐다.",
      gesture: "배수경은 심각한 말을 하기 직전에 상대의 등을 두 번 두드린다.",
      voice: "반말 반 존댓말 반, 웃으면서 제일 아픈 데를 짚는다.",
      line: "미리 싸 두면 덜 서운할까 봐.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "11월 말 · 첫눈 · 리스 승인위원회까지 D-6" },
  sceneContext: {
    c16_start: {
      place: "트리거랩 4층 분석관실",
      clock: "11월 말 · 첫눈 · 리스 승인위원회까지 D-6",
      question: "야간조 80명이 일하던 새벽에 계약 종료 문자를 받았습니다. 무엇부터 하겠습니까?",
      lead: "첫눈이 온 아침, 야간조 반장이 낮에 올라온 건 처음이라 분석관실이 잠깐 조용해집니다.",
    },
    c16_start_warm: {
      place: "망원동 이민서의 옥탑방 · 옥상",
      clock: "11월 말 · 첫눈 · 목요일 19시",
      question: "목요일 저녁 식탁에 계약 종료 문자가 올라왔습니다. 이 식탁을 어디로 옮기겠습니까?",
      lead: "수능 날 교문 계단 이후로 목요일 저녁은 이민서의 옥탑방에서 먹는 날이 됐습니다.",
    },
    c16_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "11월 말 · 첫눈 · 리스 승인위원회까지 D-6",
      question: "요청한 사람의 이름이 없는 서류가 또 올라왔습니다. 당신이 남긴 규칙을 어떻게 쓰겠습니까?",
      lead: "확인서 개선안이 접수된 지 열흘, 에코가 그 첫 줄에 걸리는 서류를 가져옵니다.",
    },
    c16_start_rush: {
      place: "트리거랩 4층 분석관실 · 새벽",
      clock: "첫눈 · 새벽 05:00 · 리스 승인위원회까지 D-6",
      question: "새벽 다섯 시에 야간조 반장이 문을 두드렸습니다. 그와 함께 어디로 가겠습니까?",
      lead: "소문을 쫓느라 열흘째 불이 꺼지지 않은 분석관실에 새벽 노크 소리가 납니다.",
    },
    c16_duel: {
      place: "플로우온 풀필먼트센터 · 물류 현장 B동",
      clock: "첫눈 · 새벽 02:10 · 승인위원회 D-5",
      question: "사람이 로봇을 이겼지만 허리를 잡고 주저앉았습니다. 리스 심사역에게 무엇을 보여 주겠습니까?",
      lead: "야간조 출입증을 빌려 목에 걸자, 선반 사이에서 주황색 불빛 두 개가 다가옵니다.",
    },
    c16_branch_locker: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실 사물함",
      clock: "첫눈 · 새벽 02:50",
      question: "통보를 받자마자 짐을 싸는 사람의 손목에 수술 자국이 있습니다. 무엇을 돕겠습니까?",
    },
    c16_branch_locker_follow: {
      place: "플로우온 풀필먼트센터 · 물류 현장 C열",
      clock: "첫눈 · 새벽 03:05",
      question: "로봇을 가장 많이 고친 사람이 12월 31일에 나갑니다. 그 마흔일곱 줄을 어떻게 하겠습니까?",
    },
    c16_ledger: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "첫눈 · 새벽 04:00",
      question: "칸을 다 채우자 로봇과 사람의 차이가 월 9만 원이 됐습니다. 이 계산서를 어떻게 하겠습니까?",
    },
    c16_ledger_reaction: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실 화이트보드",
      clock: "첫눈 · 새벽 04:40",
      question: "사람이 먼저 나가야 로봇이 들어오는 조항이 있습니다. 이 한 줄을 어떻게 쓰겠습니까?",
    },
    c16_review: {
      place: "을지로 KD캐피탈 12층 · 리스심사팀 회의실",
      clock: "승인위원회 D-4 · 21:30",
      question: "3년 전 당신의 의견이 사라진 방식 그대로, 젊은 심사역의 여섯 줄이 사라졌습니다. 무엇이라 하겠습니까?",
      lead: "경비실에 방문증을 받고 올라오자 12층에는 회의실 한 칸만 불이 켜져 있습니다.",
    },
    c16_log: {
      place: "플로우온 풀필먼트센터 · 물류 현장",
      clock: "승인위원회 D-3 · 새벽 01:20 · 첫눈",
      question: "야간조가 한 달 동안 로봇을 마흔일곱 번 살려 왔습니다. 그 기록으로 무엇을 제안하겠습니까?",
    },
    c16_log_reaction: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "승인위원회 D-3 · 새벽 02:00",
      question: "정비 교육 정원은 스무 명, 손을 든 사람은 그보다 많습니다. 누구를 먼저 보내겠습니까?",
    },
    c16_roof: {
      place: "플로우온 풀필먼트센터 · 옥상",
      clock: "첫눈 · 새벽 04:30 · 승인위원회 D-2",
      question: "강태민 혼자 남으라는 제안이 왔고, 두 번째 컵라면을 줄 사람이 사라집니다. 그에게 무엇을 부탁하겠습니까?",
      lead: "대기실이 너무 조용해서, 강태민이 보온병을 들고 옥상 계단을 먼저 오릅니다.",
    },
    c16_list: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실 게시판",
      clock: "승인위원회 D-1 · 아침 교대 07:00",
      question: "잔류 명단에 박수가 나왔지만 그 기준이 이상합니다. 이 아침을 어떻게 넘기겠습니까?",
    },
    c16_list_reaction: {
      place: "플로우온 풀필먼트센터 · 주차장",
      clock: "승인위원회 전날 · 23:40 · 눈발",
      question: "조건을 달면 리스료가 4% 오르고 고객은 떠날 수 있습니다. 흔들리는 심사역에게 어떻게 답하겠습니까?",
    },
    c16_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "승인위원회 D-3",
      question: "자동화 리스 37건이 사고를 줄였지만 위험은 장부 밖으로 옮겨졌습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c16_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "승인위원회 당일 · 새벽",
      question: "리스 계약서에 사람의 1년 뒤를 적을 수 있다면, 무엇을 적겠습니까?",
    },
    c16_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 계약 문서 서고",
      clock: "승인위원회 당일 · 07시",
      question: "80명 정리 조항을 원한 곳은 그룹전략실이었고 담당자란은 비어 있습니다. 이 메모를 어떻게 쓰겠습니까?",
    },
    c16_final: {
      place: "KD캐피탈 · 리스 승인위원회 회의실",
      clock: "첫눈 이틀째 · 오늘 10시",
      question: "로봇 120대가 들어오는 날, 80명이 나가는 문의 모양을 정해야 합니다. 어떻게 하겠습니까?",
      lead: "로비를 지나며 형광 조끼 차림의 강태민과 눈이 마주칩니다. 그가 엄지를 한 번 들어 보입니다.",
    },
    c16_aftershock: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "승인위원회 날 · 23:00 · 첫눈",
      question: "컵라면 여든한 개가 익는 동안 반재욱의 수첩이 불려 갑니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c16-blank-requester",
    title: "요청자 없는 확약",
    text: "야간조 80명을 연내 정리하라는 리스 조건은 KD금융그룹 그룹전략실이 요청한 문장이었습니다. 이유는 1분기 플로우온 지분 매각 전 인건비 개선, 담당자란은 비어 있었습니다.",
  },
  outcomes: {
    c16_after_warm: { tag: "끝까지 남은 결말", title: "여든한 번째 컵라면을 대기실에서 다 먹었다", text: "승인위원회가 끝난 밤, 야간조와 최서진과 다람이가 한 방에 있었습니다. 두 번째 컵라면은 이번에도 당신 몫이었습니다." },
    c16_after_record: { tag: "조항을 남긴 결말", title: "전환과 재교육이 리스의 표준 조항이 됐다", text: "다음 센터의 리스 계약서에도 같은 조항이 붙습니다. 문서 끝에는 강태민이 연필로 적은 '정우 형 조항'이 지워지지 않고 남았습니다." },
    c16_after_rush: { tag: "먼저 떠난 결말", title: "식어 가는 컵라면을 두고 다음 싸움으로 먼저 갔다", text: "당신은 대기실을 먼저 나왔습니다. 강태민은 여든한 번째 컵에 뚜껑을 덮어 두었고, 그 자리에는 반재욱이 남아 80명의 서류를 챙겼습니다." },
  },
  carryovers: {
    c16_after_warm: { trust: 10, humanCost: -4, fatigue: -8 },
    c16_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c16_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c15_after_warm: { id: "protect-trust", title: "교문 계단의 사람들과 대기실로 가기", text: "식은 뭇국을 끝까지 나눠 먹은 사람들이 이번엔 야간조 곁에 설 차례입니다. 80명 앞에 혼자가 아니라 함께 서는 선택을 찾아야 보너스가 열립니다." },
    c15_after_record: { id: "use-reframe", title: "개선안의 첫 줄을 다른 서류에 대기", text: "요청자 이름과 거절 칸이 있어야 한다는 당신의 원칙이 리스 신청서에서도 통하는지, 판을 다시 짜서 보여 줘야 합니다." },
    c15_after_rush: { id: "repair-legitimacy", title: "소문을 쫓은 열흘의 공정함 회복하기", text: "도시락을 두고 달려간 열흘은 빨랐지만 기록을 남기지 못했습니다. 80명의 계약 종료를 절차 위에서 다시 따질 선택을 찾아야 합니다." },
  },
};
