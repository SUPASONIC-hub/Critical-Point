/**
 * CASE 19 -- the weight of paper. The door into Act 4.
 *
 * Since 사건 02 the season has leaned on one room nobody could delete: the
 * second floor above a used-book shop in 회기동, where 임경수 keeps the paper
 * originals the bank's systems no longer hold. Act 4 turns from the chain of
 * losses to the people who designed it, and it opens by threatening the one
 * archive the designers never controlled. In January, in a cold wave, a
 * demolition notice goes up on the shutter. The developer is KD리얼티, the
 * group's real-estate arm; the date has been pulled forward to three days
 * before a parliamentary preservation window opens. 임경수 is in hospital with
 * pneumonia. There are 72 hours to move forty years of paper.
 *
 * The case is 임경수's arc, told largely through his granddaughter 임소율, a
 * webtoon artist who has called the paper "짐" her whole life, and through a
 * demolition foreman, 구태형, who keeps exactly the promises the paperwork makes
 * and not one minute more. Anger: a schedule quietly moved to beat a
 * preservation order. Laughter: 나준혁 reading a 1996 report aloud and finding
 * his own handwriting, 권도현 weighing every box into a freight invoice.
 * Sorrow: 임경수 asking, from an oxygen line, to have it all burned so his
 * granddaughter will not inherit it. Joy: 임소율 drawing a label for every box
 * and discovering that the margins were full of people, not numbers. The case
 * closes on where the originals finally go, and plants the 트리거랩 budget
 * review (and the name 선우진) that the rest of the act will follow.
 */
export const case19Nodes = {
  c19_start: {
    phase: "CASE 19 BRIEFING",
    title: "철거 예고문",
    speaker: "임소율",
    text:
      "1월, 한파 경보가 사흘째 이어지는 월요일 아침. 회기동 헌책방 셔터에, 섣달그믐에 붙었던 철거 예고문 위로 새 종이가 덧붙어 있습니다. '4월 14일'이던 철거 예정일이 '1월 29일 06시'로 바뀌었고, 아래에 KD리얼티의 이름이 있습니다. 이 재개발의 시행사(재개발 사업을 맡아 진행하는 회사)인 KD리얼티는 그룹의 부동산 계열사(같은 그룹에 속한 다른 회사)입니다. 성에 낀 2층 창문 안쪽에는 임경수가 40년 동안 모은 종이가 있고, 임경수는 아직 병원에 있습니다. 나아 가던 폐렴이 지난주 다시 번졌습니다. 셔터 앞에서 패딩 모자를 눌러쓴 손녀 임소율이 도장 모양 키링이 달린 열쇠 꾸러미를 내밉니다. '할아버지가 이걸 당신한테 드리래요.' 입김 사이로 그가 덧붙입니다. '솔직히 저는 이 짐, 다 버렸으면 좋겠어요.'",
    memo: [
      "철거 예정 1월 29일 06시 -- 원래 4월 14일, 남은 시간 72시간",
      "2층 종이 상자 추정 300여 개, 1985년부터 모은 원본",
      "임경수: 이음병원 입원 4주째, 폐렴 재발",
      "시행사 KD리얼티 -- KD금융그룹 부동산 계열사",
    ],
    triggers: ["responsibility", "affection", "injustice"],
    choices: [
      {
        id: "c19_start_ward",
        label: "열쇠를 받기 전에 병원부터 가서 임경수의 뜻을 묻는다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -2, fatigue: 5 },
        next: "c19_shelves",
        cognition: { persistence: 2 },
      },
      {
        id: "c19_start_notice",
        label: "철거 예고문의 날짜와 근거부터 구청 서류로 확인한다",
        effect: { legitimacy: 11, time: -4, trust: -2, humanCost: 2, fatigue: 3 },
        next: "c19_shelves",
        cognition: { inference: 2 },
      },
      {
        id: "c19_start_haul",
        label: "열쇠를 받자마자 트럭부터 불러 짐을 빼기 시작한다",
        effect: { time: 9, capital: -2, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c19_shelves",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c19_shelves",
      },
    ],
  },
  c19_shelves: {
    phase: "THE SHELVES",
    title: "1996년의 글씨",
    speaker: "나준혁",
    text:
      "헌책방 2층은 계단참부터 종이입니다. 책장 스물두 칸, 끈으로 묶은 서류 뭉치, 연도를 매직으로 적은 사과 상자들. 난로를 켤 수 없어 모두 패딩을 입은 채 일합니다. 강태민은 상자 두 개를 한꺼번에 들고 계단을 오르내리고, 권도현은 욕실용 체중계를 가져와 상자마다 무게를 적습니다. 나준혁이 1996년 상자에서 심사 보고서 하나를 꺼내 소리 내어 읽다가 웃습니다. '이 사람 글씨 나랑 똑같네. 맞춤법 틀리는 데까지 똑같아요.' 세 줄을 더 읽고 그가 조용해집니다. 작성자 칸에 자기 이름이 있습니다. 신입 시절의 보고서입니다. 권도현이 체중계에서 내려옵니다. '312상자, 5.7톤입니다. 72시간 안에 전부는 못 옮깁니다. 무엇부터 뺄지 정하셔야 합니다.'",
    memo: [
      "상자 312개 -- 총 5.7톤, 약 9만 4천 장",
      "1톤 트럭 하루 최대 네 번 왕복",
      "1996년 상자: 나준혁의 신입 시절 보고서",
      "2023-0412 관련 상자는 11개",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "c19_shelves_all",
        label: "한 장도 고르지 않고 전부 옮길 수 있게 사람을 더 모은다",
        effect: { trust: 12, legitimacy: 4, humanCost: -5, capital: -5, time: -3, fatigue: 5 },
        next: "c19_ward",
        cognition: { persistence: 2 },
      },
      {
        id: "c19_shelves_list",
        label: "상자마다 연도와 건명을 적은 목록부터 만들며 옮긴다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 2, fatigue: 4 },
        next: "c19_ward",
        cognition: { inference: 2 },
      },
      {
        id: "c19_shelves_pick",
        label: "2023-0412 관련 상자 11개부터 빼고 나머지는 뒤로 미룬다",
        effect: { time: 7, capital: 5, trust: -3, legitimacy: -2, humanCost: 3, fatigue: -2 },
        next: "c19_ward",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c19_ward",
      },
    ],
  },
  c19_ward: {
    phase: "THE WARD",
    title: "태워야 없어진다",
    speaker: "임경수",
    text:
      "이음병원 호흡기내과 6인실, 창가 자리. 임경수가 콧줄로 산소를 받으며 누워 있습니다. 팔꿈치가 닳은 카디건은 침대 난간에 걸려 있고, 안경은 벗은 채입니다. 당신이 상자 목록을 보여 주자 그가 한참 들여다보다 손을 젓습니다. '종이는 태워야 없어진다고 했지. 그러니 이번엔 자네가 태워 주게.' 숨을 두 번 고르고 말을 잇습니다. '40년이면 됐어. 내가 여기서 못 나가면 그게 다 저 애 짐이 돼.' 커튼 너머 보호자 의자에서 임소율이 고개를 듭니다. 그가 할아버지의 종이를 '짐'이라고 부른 건 바로 오늘 아침, 당신 앞에서였습니다.",
    memo: [
      "임경수: 폐렴 재발, 주치의 소견 2주 더 입원",
      "'태워 달라'는 부탁 -- 2023-0412 상자 포함",
      "임소율, 병원에서 이틀째 밤샘",
      "태우면 3년 치 증거의 원본이 함께 사라짐",
    ],
    triggers: ["affection", "helplessness", "choice"],
    choices: [
      {
        id: "c19_ward_why",
        label: "그 종이가 왜 짐이 아닌지 임소율 앞에서 직접 말해 달라고 부탁한다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: 3, fatigue: 5 },
        next: "c19_labels",
        cognition: { reframing: 2 },
      },
      {
        id: "c19_ward_consent",
        label: "태울 상자와 남길 상자를 그가 직접 고르게 하고 동의서로 받는다",
        effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 4 },
        next: "c19_labels",
        cognition: { inference: 2 },
      },
      {
        id: "c19_ward_nod",
        label: "안심시키려고 태우겠다고 대답하고 상자는 그대로 옮긴다",
        effect: { time: 6, capital: 4, trust: -5, legitimacy: -2, humanCost: 4, fatigue: -3 },
        next: "c19_labels",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c19_labels",
      },
    ],
  },
  c19_labels: {
    phase: "THE LABELS",
    title: "그림 라벨",
    speaker: "임소율",
    text:
      "수요일 새벽 세 시, 트리거랩 기록 보관소 B2. 상자 204개가 선반에 올라갔습니다. 임소율이 태블릿 대신 네임펜을 들고 상자마다 라벨을 그립니다. 1989년 상자에는 주판, 1998년에는 연기가 끊긴 공장 굴뚝, 2023년에는 빈 서명란. 그러다 한 상자 앞에서 펜이 멈춥니다. 심사 보고서 여백마다 할아버지 글씨가 있습니다. '대표 딸이 피아노를 침. 공장 닫으면 레슨 끊김.' '거짓말을 못 하는 얼굴.' 임소율이 작게 웃습니다. '종이를 모은 게 아니었네. 사람을 적어 놨네.' 그때 보관소 단말이 울립니다. '외부 반입 기록물: 30일 안에 등록하지 않으면 보존연한(기록을 몇 년 보관할지 정해 둔 기간) 0년으로 자동 폐기.'",
    memo: [
      "B2 입고 204상자 / 전체 312상자",
      "임소율의 손그림 라벨 204장",
      "여백 메모: 대출 신청인의 가족과 사정",
      "미등록 외부 기록물은 30일 뒤 자동 폐기",
    ],
    triggers: ["affection", "recognition", "system"],
    choices: [
      {
        id: "c19_labels_draw",
        label: "임소율과 밤새 라벨을 마저 그리고 여백 메모도 목록에 넣는다",
        effect: { trust: 12, legitimacy: 3, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
        next: "c19_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c19_labels_register",
        label: "상자마다 출처와 기증자 임경수를 적어 정식 등록부터 한다",
        effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 4 },
        next: "c19_final",
        cognition: { inference: 2 },
      },
      {
        id: "c19_labels_post",
        label: "임소율의 웹툰으로 철거 소식과 라벨 사진을 먼저 알리게 한다",
        effect: { time: 6, capital: 5, trust: 3, legitimacy: -4, humanCost: 5, fatigue: -3 },
        next: "c19_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c19_final",
      },
    ],
  },
  c19_final: {
    phase: "FINAL DECISION",
    title: "마지막 트럭",
    speaker: "구태형",
    text:
      "목요일 새벽 다섯 시 이십 분, 눈발 속에 굴착기가 골목 입구에 멈춰 섭니다. 마지막 트럭에 108상자, B2 선반에 204상자. 구태형이 안전모에 쌓인 눈을 털며 시계를 봅니다. '40분 남았습니다. 트럭은 어디로 갑니까.' 공공 기록관에 기증하면 누구나 읽을 수 있지만, 이관(기록을 다른 기관에 넘겨 맡기는 것)과 정리에 1년 반이 걸립니다. 법원에 증거 보전 신청(증거가 없어지지 않게 법원이 미리 확보해 두는 절차)을 하면 힘은 가장 세지만, 봉인된 종이는 재판이 끝날 때까지 아무도 못 읽습니다. B2에 두면 우리가 지키지만, 그 건물 열쇠는 그룹이 쥐고 있습니다. 휴대폰이 울립니다. 임경수입니다. '자네가 정하게. 이번엔 태우라고 안 하겠네.'",
    memo: [
      "마지막 트럭 108상자 + B2 204상자",
      "기록관 기증: 일반 공개까지 18개월",
      "증거 보전: 법원 봉인, 재판이 끝날 때까지 열람 불가",
      "B2 보관: 출입 권한은 그룹 소유",
    ],
    triggers: ["choice", "responsibility", "trust"],
    choices: [
      {
        id: "c19_final_donate",
        label: "312상자를 임경수의 이름으로 공공 기록관에 기증한다",
        effect: { trust: 11, legitimacy: 6, humanCost: -5, capital: -6, time: -7, fatigue: 6 },
        next: "case19_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c19_final_court",
        label: "법원에 증거 보전 신청을 내고 원본을 봉인해 맡긴다",
        effect: { legitimacy: 13, trust: 3, capital: -7, time: -7, humanCost: 2, fatigue: 5 },
        next: "case19_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c19_final_keep",
        label: "트리거랩 B2에 두고 우리 손으로 지킨다",
        effect: { capital: 10, time: 7, trust: 5, legitimacy: -8, humanCost: 4, fatigue: 2 },
        next: "case19_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case19_result",
      },
    ],
  },
};

/**
 * Everything else case 19 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case19 = {
  id: "case19",
  nodes: case19Nodes,
  aftermath: {
    c19_aftershock: {
      phase: "AFTERMATH",
      title: "종이의 무게",
      speaker: "임소율",
      text: "철거가 끝난 날 저녁, 6인실 창가 자리에 여덟 명이 끼어 앉습니다. 간호사가 두 번 와서 두 번 못 본 척합니다. 임경수는 이제 콧줄 없이 말합니다. 나준혁이 보온병 믹스커피를 돌리고, 권도현은 최종 운송비가 견적보다 38만 원 적게 나왔다고 보고하다가 처음으로 웃습니다. 구태형에게서 문자가 옵니다. '2층 확인 완료. 남은 것 없음. 라벨 그림 하나 받을 수 있습니까.' 임소율이 태블릿을 내밉니다. 다음 주 연재분 「종이의 무게」, 첫 컷은 계단참에 앉은 할아버지입니다. 임경수가 안경을 쓰고 오래 봅니다. '내 코가 이렇게 컸나.' 그때 모두의 휴대폰에 에코의 알림이 동시에 뜹니다. '2월 1일부로 대출 판단 검증 시스템 교체 예정.'",
      memo: ["철거 완료 06:40 -- 원본 312상자 전부 반출", "임경수, 산소 공급 중단", "임소율 연재분 「종이의 무게」", "에코 교체 공지: 2월 1일"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c19_after_warm", label: "오늘 밤은 보호자 의자에서 임경수 곁을 지킨다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case19_result", cognition: { reframing: 2 } },
        { id: "c19_after_record", label: "312상자 목록에 임경수의 서명을 받아 인수 문서로 남긴다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case19_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c19_after_rush", label: "알림을 보자마자 트리거랩 서버실로 곧장 내려간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case19_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c19_final", "c19_aftershock"],
  connectiveScenes: [
    ["c19_crew", "c19_shelves", "c19_ward", "계단참의 반장", "구태형", "오후 네 시, 계단참에 안전모를 쓴 남자가 섭니다. 철거 용역 반장 구태형. 안전모 앞에 매직으로 이름이 적혀 있고, 손에는 보온병이 들려 있습니다. 그가 인사 대신 공정표(공사 날짜를 단계별로 적은 표)를 내밉니다. '72시간은 거주자 짐 빼는 시간입니다. 그건 제가 지킵니다. 1분도 더는 없습니다.' 나준혁이 믹스커피를 타서 건네자 그가 잠깐 망설이다 받습니다. '위에서 모레 새벽으로 당기라고 전화가 왔습니다. 안 된다고 했어요. 서류에 72시간이라고 적혀 있으니까. 근데 제가 버틸 수 있는 건 딱 서류까지입니다.'", ["구태형: 철거 경력 27년, 용역 12명 인솔", "공정표상 짐 반출 보장 72시간", "시행사 쪽에서 '모레 새벽 착공' 요청 전화"], ["반장이 혼자 버티지 않게 우리가 같이 막아서겠다고 한다", "시행사의 전화 요청을 서면으로 받아 달라고 반장에게 부탁한다", "용역 인부들에게 일당을 얹어 주고 짐 나르기를 맡긴다"]],
    ["c19_freight", "c19_ward", "c19_labels", "운송비", "권도현", "화요일 밤, 헌책방 앞 골목에 눈발이 굵어집니다. 권도현이 트럭 옆에서 태블릿에 표를 그립니다. 상자 312개의 무게를 전부 쟀습니다. 평균 18.4kg, 가장 무거운 것은 31kg짜리 1998년 상자입니다. '1톤 트럭 한 번에 40만 원, 한파 할증 20%, 골목이 좁아 사다리차 추가, 계단 할증 별도.' 계산기를 두드리는 손끝이 빨갛습니다. '총 612만 원. 이 가격이면 적자입니다.' 강태민이 그 31kg 상자를 어깨에 얹고 지나가며 말합니다. '적자면 내가 두 번 들죠.' 권도현이 계산기를 내려다봅니다. '그건 칸에 어떻게 적어야 합니까.'", ["상자 평균 18.4kg -- 최대 31kg(1998년)", "운송비 견적 612만 원, 한파 할증 포함", "트리거랩 운영비 잔액 230만 원"], ["강태민과 야간조 동료들 손으로 나르고 저녁을 산다", "운송비를 기록 보존 비용으로 적어 그룹에 정식 청구한다", "견적이 싼 업체를 불러 상자를 한꺼번에 밀어 싣는다"]],
    ["c19_margin", "c19_labels", "c19_final", "빨간 펜", "나준혁", "동이 트기 전, 나준혁이 1996년 상자 앞에 쪼그려 앉아 있습니다. 자기가 쓴 보고서 마지막 장에 빨간 펜 글씨가 있습니다. '반려. 단, 판단은 이 사람이 옳음. 다음엔 근거를 한 장 더 붙여 끝까지 쓸 것. -- 임.' 나준혁이 믹스커피를 타려다 뜨거운 물이 없다는 걸 알고 빈 종이컵만 쥡니다. '30년 동안 그때 반려당한 줄만 알았어요. 칭찬받은 줄은 몰랐네.' 그가 종이를 한참 들고 있다가 묻습니다. '이거 한 장만, 제가 가져가면 안 될까요.'", ["1996년 나준혁 보고서 -- 반려, 빨간 펜 메모", "'판단은 이 사람이 옳음'", "원본 한 장이 빠지면 상자 목록 번호가 빔"], ["나준혁에게 그 한 장의 원본을 그대로 건넨다", "원본은 상자에 남기고 똑같은 사본을 만들어 준다", "지금은 시간이 없다며 그 장을 상자에 다시 넣는다"]],
  ],
  connectiveOrder: [["c19_shelves", "c19_crew"], ["c19_ward", "c19_freight"], ["c19_labels", "c19_margin"]],
  choiceEffects: {
    c19_shelves: [
      { trust: 11, legitimacy: 3, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
      { legitimacy: 10, trust: 3, time: -5, humanCost: 2, fatigue: 3 },
      { time: 7, capital: -4, trust: -3, humanCost: 3, fatigue: -4 },
    ],
    c19_ward: [
      { trust: 11, legitimacy: 2, humanCost: -4, capital: -4, time: -3, fatigue: 5 },
      { legitimacy: 9, capital: 3, trust: 2, time: -5, humanCost: 2, fatigue: 3 },
      { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -4 },
    ],
    c19_labels: [
      { trust: 11, humanCost: -4, legitimacy: -3, time: -2, fatigue: 3 },
      { legitimacy: 9, trust: 5, time: -4, capital: -2, fatigue: 3 },
      { time: 5, capital: 3, trust: -4, humanCost: 2, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c19_shelves: {
      voice: ["반장이 혼자 버티지 않게, 우리가 같이 막아서겠다고 한다.", "시행사의 전화 요청을, 서면으로 받아 달라고 반장에게 부탁한다.", "용역 인부들에게 일당을 얹어 주고, 짐 나르기를 맡긴다."],
      echo: ["같이 막아서면 구태형이 처음으로 안전모를 벗습니다. 대신 그 전화를 건 사람은 이제 반장 한 명이 아니라 우리 모두를 상대합니다.", "서면을 달라는 말에 구태형이 한참 휴대폰을 봅니다. 서면이 오면 그는 증인이 되고, 다음 현장에서 그를 부를 회사는 줄어듭니다.", "일당이 붙자 짐은 두 배로 빠집니다. 상자를 어느 순서로 싣는지 아는 사람은 이제 아무도 없습니다."],
    },
    c19_ward: {
      voice: ["강태민과 야간조 동료들 손으로 나르고, 저녁은 우리가 산다.", "운송비를 기록 보존 비용으로 적어, 그룹에 정식 청구한다.", "견적이 싼 업체를 불러, 상자를 한꺼번에 밀어 싣는다."],
      echo: ["야간조 여섯 명이 퇴근길에 골목으로 옵니다. 저녁은 순댓국 여덟 그릇이고, 다음 날 그들의 허리는 계산서에 없습니다.", "청구서는 접수됩니다. 그룹이 돈을 내면, 그 종이가 어디에 있는지도 그룹이 알게 됩니다.", "싼 업체는 빠릅니다. 1998년 상자 모서리가 트럭 문에 찢기고, 몇 장이 눈 위에 떨어집니다."],
    },
    c19_labels: {
      voice: ["나준혁에게, 그 한 장의 원본을 그대로 건넨다.", "원본은 상자에 남기고, 똑같은 사본을 만들어 준다.", "지금은 시간이 없다며, 그 장을 상자에 다시 넣는다."],
      echo: ["원본을 받은 나준혁이 그 장을 조끼 안주머니에 넣습니다. 목록의 1996-14번은 빈칸이 되고, 그 빈칸은 언젠가 누군가 묻습니다.", "사본을 받은 나준혁이 빨간 글씨를 손가락으로 쓸어 봅니다. '사본도 빨갛네요.' 원본은 번호를 지킵니다.", "종이는 제자리로 돌아갑니다. 나준혁은 빈 종이컵을 쥔 채 한동안 일어나지 않습니다."],
    },
  },
  reactionScenes: [
    ["c19_crew_reaction", "c19_crew", "c19_ward", "당겨진 날짜", "에코", "에코가 구청에 접수된 철거 계획 변경 신고를 띄웁니다. 원래 철거 예정일은 4월 14일이었습니다. 변경 신고일은 1월 23일 금요일 오후 여섯 시, 사유는 '한파 전 공정 단축'. 에코가 날짜 하나를 옆에 붙입니다. 국정감사(국회가 공개적으로 따져 묻는 자리) 후속으로, 국회가 2023-0412 관련 자료를 없애지 말라고 요청한 보존 기간은 2월 1일부터입니다. '철거일은 그 기간이 시작되기 사흘 전입니다. 한파 때문에 당겼다는 공사가, 한 해 중 가장 추운 주에 잡혀 있습니다.'", ["구태형 반장에게 이 날짜가 무슨 뜻인지 먼저 알려 준다", "변경 신고의 사유가 사실과 다르다고 구청에 이의를 낸다", "날짜 싸움은 뒤로 미루고 남은 시간을 짐 옮기는 데만 쓴다"]],
    ["c19_freight_reaction", "c19_freight", "c19_labels", "B2의 빈 선반", "한서윤", "밤 열한 시, 한서윤이 골목까지 직접 옵니다. 코트 어깨에 눈이 쌓여 있습니다. '트리거랩 B2 기록 보관소에 빈 선반이 예순 칸 있어요. 312상자는 거기 들어가요.' 그가 잠시 멈춥니다. '다만 B2는 그룹 건물이에요. 들어가는 순간 이 종이들은 그룹이 관리하는 기록이 되고, 꺼낼 때마다 제 서명이 필요해요. 저는 3년 전에 서명 하나를 잘못한 사람이고요.' 장갑 낀 손으로 트럭 짐칸을 두드립니다. '그래도 영하 15도에 종이를 트럭에서 재울 수는 없잖아요.'", ["한서윤의 서명을 믿고 오늘 밤은 B2에 상자를 내린다", "B2 입고 조건을 문서로 먼저 정하고 그 뒤에 내린다", "트럭째 창고에 세워 두고 오늘 밤만 넘긴다"]],
    ["c19_margin_reaction", "c19_margin", "c19_final", "스캐너 두 대", "이민서", "이민서가 스캐너 두 대를 카트에 싣고 B2로 내려옵니다. '9만 4천 장이에요. 한 대에 시간당 1,200장, 두 대를 쉬지 않고 돌려도 39시간이요. 철거 전까지는 못 끝내요.' 그가 전원을 꽂으며 덧붙입니다. '그리고 스캔하면 이 종이들이 전산으로 들어가요. 임경수 선생님이 40년 동안 피해 온 바로 그 전산이요. 전산은 고치면 그만이라고 하셨잖아요.' 이민서가 첫 장을 유리판에 올려놓고 당신을 봅니다. '뭐부터 넣을까요?'", ["임경수에게 전화로 먼저 묻고 그가 고른 장부터 스캔한다", "2023-0412 상자부터 스캔해 원본과 파일을 함께 남긴다", "스캔은 건너뛰고 남은 시간을 전부 마지막 반출에 쓴다"]],
  ],
  reactionEffects: {
    c19_crew: [
      { trust: 10, humanCost: -4, time: -3, legitimacy: 2, fatigue: 3 },
      { legitimacy: 11, trust: 2, capital: -4, time: -4, fatigue: 4 },
      { time: 6, capital: 3, trust: -2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
    c19_freight: [
      { trust: 10, humanCost: -4, legitimacy: 2, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, capital: -2, fatigue: 3 },
      { time: 6, capital: 2, trust: -2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
    c19_margin: [
      { trust: 10, humanCost: -4, time: -5, legitimacy: 2, fatigue: 4 },
      { legitimacy: 11, trust: 3, capital: -4, time: -4, fatigue: 5 },
      { time: 6, capital: 4, trust: -2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c19_crew: {
      voice: ["구태형 반장에게, 이 날짜가 무슨 뜻인지 먼저 알려 준다.", "변경 신고의 사유가 사실과 다르다고, 구청에 이의를 낸다.", "날짜 싸움은 뒤로 미루고, 남은 시간을 짐 옮기는 데만 쓴다."],
      echo: ["날짜의 뜻을 들은 구태형이 공정표를 접습니다. '그럼 저는 뭘 부수러 온 겁니까.' 그 질문에 답하는 데 한 시간이 듭니다.", "이의는 접수됩니다. 구청의 답변 기한은 14일이고, 철거는 사흘 뒤입니다.", "짐은 빨리 빠집니다. 누가 날짜를 당겼는지는 굴착기 소리에 묻힙니다."],
    },
    c19_freight: {
      voice: ["한서윤의 서명을 믿고, 오늘 밤은 B2에 상자를 내린다.", "B2 입고 조건을 문서로 먼저 정하고, 그 뒤에 내린다.", "트럭째 창고에 세워 두고, 오늘 밤만 넘긴다."],
      echo: ["믿는다는 말에 한서윤이 대답 대신 출입 카드를 내밉니다. 그 카드의 주인은 여전히 그룹입니다.", "조건을 적는 데 두 시간이 걸립니다. 그동안 트럭 짐칸의 온도계는 영하 16도를 가리킵니다.", "창고 셔터가 내려갑니다. 종이는 얼지 않지만, 그 창고 주소를 아는 사람은 당신뿐입니다."],
    },
    c19_margin: {
      voice: ["임경수에게 전화로 먼저 묻고, 그가 고른 장부터 스캔한다.", "2023-0412 상자부터 스캔해, 원본과 파일을 함께 남긴다.", "스캔은 건너뛰고, 남은 시간을 전부 마지막 반출에 쓴다."],
      echo: ["전화를 받은 임경수가 한참 기침을 하고 말합니다. '여백부터 찍게. 거긴 전산에 한 번도 없었던 데야.'", "파일이 생기면 원본이 사라져도 내용은 남습니다. 파일을 고치는 데 필요한 건 비밀번호 하나뿐이라는 것도 함께 남습니다.", "스캐너는 꺼진 채 카트에 남습니다. 9만 4천 장은 여전히 한 벌뿐입니다."],
    },
  },
  reactionMemos: {
    c19_crew_reaction: ["4월에서 1월로 당겨진 철거일", "보존 기간 시작 사흘 전"],
    c19_freight_reaction: ["빈 선반 예순 칸", "꺼낼 때마다 필요한 서명"],
    c19_margin_reaction: ["9만 4천 장, 39시간", "전산으로 들어가는 종이"],
  },
  branchPlan: ["c19_ward", 0, "c19_branch_bookshop", "c19_branch_bookshop_follow"],
  branchScenes: {
    // CASE 19's detour is the ground floor. Everyone carries the second floor;
    // nobody thinks to look in the shop underneath, where the most dangerous
    // pages were shelved inside books, one a week, for nineteen years.
    c19_branch_bookshop: {
      phase: "SIDE DOOR",
      title: "1층 경제사 칸",
      speaker: "임소율",
      text: "병실을 나서는데 임경수가 쉰 목소리로 한마디를 보탰습니다. '1층, 경제사 칸.' 회기동으로 돌아오니 1층 헌책방 주인 할머니가 책을 끈으로 묶고 있습니다. 1만 2천 권, 내일 아침 폐지 업체가 kg당 110원에 실어 갑니다. 임소율이 경제사 칸에서 『한국 금융 50년』을 뽑자 누런 종이 한 장이 떨어집니다. 1997년 심사 보고서의 한 페이지입니다. 두 번째 책에서도, 세 번째 책에서도 나옵니다. 할머니가 끈을 놓습니다. '그 양반, 책 사러 온 게 아니었구먼. 19년을 매주 와서 한 권씩 꽂고 갔어.'",
      memo: ["1층 재고 1만 2천 권 -- 내일 07시 폐지 반출", "경제사 칸 약 1,400권", "책 속 원본 페이지: 지금까지 3장", "주인 할머니 보상금 1,900만 원, 책값은 0원으로 계산됨"],
      triggers: ["curiosity", "protection", "affection"],
      choices: [
        { id: "c19_branch_bookshop_a", label: "할머니의 책 1만 2천 권을 폐지값보다 비싸게 전부 사들인다", effect: { trust: 12, humanCost: -4, capital: -9, time: -3, fatigue: 4 }, next: "c19_branch_bookshop_follow", cognition: { reframing: 2 } },
        { id: "c19_branch_bookshop_b", label: "밤새 경제사 칸 1,400권을 한 권씩 넘겨 나온 장마다 기록한다", effect: { legitimacy: 11, trust: 3, time: -7, humanCost: 2, fatigue: 7 }, next: "c19_branch_bookshop_follow", cognition: { inference: 2 } },
        { id: "c19_branch_bookshop_c", label: "경제사 칸 책만 상자째 가져가고 나머지는 폐지 업체에 맡긴다", effect: { time: 6, capital: 4, trust: -5, humanCost: 4, fatigue: -3 }, next: "c19_branch_bookshop_follow", cognition: { risk: 1 } },
      ],
    },
    c19_branch_bookshop_follow: {
      phase: "SIDE DOOR",
      title: "마흔한 장",
      speaker: "임소율",
      text: "새벽 한 시, 경제사 칸에서 나온 종이는 마흔한 장입니다. 대부분 반려된 대출의 심사 의견이고, 가장 최근 것은 2023년 3월, 바로 그 대출 번호입니다. 임소율이 한 책의 면지에서 할아버지 글씨를 찾습니다. '소율 여덟 살 생일. 오늘도 못 감.' 날짜 옆에 서툰 케이크가 그려져 있습니다. 케이크인지 도장인지 모를 그림입니다. 임소율이 한참 보다가 웃습니다. '이거 제가 그려 준 거 따라 그린 거예요. 되게 못 그렸다.' 주인 할머니가 보리차를 따라 주며 묻습니다. '그 종이들, 이제 어디로 가요?'",
      memo: ["책 속 원본 41장 -- 반려 의견 38장", "가장 최근 1장: 2023년 3월, 2023-0412", "면지 메모 '소율 여덟 살 생일'", "주인 할머니: 폐지 반출 하루 연기 가능"],
      triggers: ["affection", "recognition", "responsibility"],
      choices: [
        { id: "c19_branch_bookshop_follow_a", label: "마흔한 장은 할아버지 상자에 넣고 면지 메모 책은 임소율에게 준다", effect: { trust: 13, humanCost: -5, legitimacy: 2, time: -4, fatigue: 4 }, next: "c19_freight", cognition: { reframing: 3 } },
        { id: "c19_branch_bookshop_follow_b", label: "마흔한 장이 나온 책 제목과 쪽수를 전부 적어 출처 목록을 만든다", effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 3, fatigue: 5 }, next: "c19_freight", cognition: { inference: 2 } },
        { id: "c19_branch_bookshop_follow_c", label: "2023-0412 한 장만 따로 챙기고 나머지는 상자에 섞어 싣는다", effect: { time: 6, capital: 5, trust: -6, legitimacy: -2, humanCost: 4, fatigue: -3 }, next: "c19_freight", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c19_start",
    result: "c19_aftershock",
    defaultFree: "c19_route_system",
    // Seventy-two hours, one building. The case is a single line like 사건 12;
    // the split is where the paper ends up and whose name goes on it.
    choices: {},
    system: {
      route: "c19_route_system",
      final: "c19_final_system_route",
      title: "당겨진 공정표",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD리얼티가 지난 5년 동안 맡은 재개발 구역 23곳의 공정표(공사 날짜를 단계별로 적은 표)를 겹쳐 놓습니다. 그중 금융 기록 보관처가 있던 건물은 7곳입니다. 7곳 모두 철거일이 한 번 이상 당겨졌고, 5곳은 감사나 국정감사(국회가 공개적으로 따져 묻는 자리)의 자료 요청일 2주 안쪽이었습니다. 변경 사유는 다섯 번 모두 '공정 단축'입니다. '철거는 공사로 학습되어 있습니다. 같은 사유로 다섯 번 당겨진 공사를 우연이라고 부를 확률은 0.3%입니다.'",
      memo: ["KD리얼티 재개발 23곳 중 기록 보관처 7곳", "7곳 모두 철거일 당김 -- 5곳은 자료 요청 2주 안", "변경 사유 5건 모두 '공정 단축'"],
      routeChoices: [
        ["c19_route_system_publish", "다섯 곳의 공정표를 겹친 표를 리드라인에 먼저 넘긴다", { legitimacy: 8, trust: 5, capital: -5, time: -6, humanCost: 3, fatigue: 5 }, { inference: 2 }],
        ["c19_route_system_request", "국회 보존 요청 기간을 철거일 전으로 앞당겨 달라고 요청한다", { legitimacy: 12, trust: 3, time: -8, capital: -3, fatigue: 5 }, { persistence: 2, inference: 1 }],
        ["c19_route_system_skip", "표는 저장만 해 두고 짐 옮기는 일정대로 간다", { time: 8, capital: 6, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "기록 보관처가 있는 건물은 철거 전에 기록 조사를 거치게 하라고 요구한다", { legitimacy: 13, trust: 6, capital: -8, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "이번 한 번만 철거를 한 주 미루는 것으로 합의한다", { time: 7, capital: 6, trust: -5, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ["c", "다섯 곳에서 사라진 기록의 주인들을 찾아 함께 공개한다", { trust: 10, legitimacy: 7, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c19_evidence_turn",
    result: "c19_aftershock",
    sourceRoutes: ["c19_shelves", "c19_ward", "c19_labels", "c19_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 철거 계획 변경 공문 옆에 놓고, 누가 날짜를 당겼는지 맞춰 본다.",
    entryEcho: "단서를 대면 날짜를 당긴 손이 보입니다. 그 손이 찾던 게 무엇이었는지도 함께 보입니다.",
    title: "관찰 연구비",
    speaker: "반재욱",
    text: "단서를 맞추자 두 장이 한 줄에 놓입니다. 첫 장은 철거 계획 변경을 요청한 공문입니다. 발신은 KD리얼티가 아니라 KD금융그룹 그룹전략실, 담당 차장 백아린. 둘째 장은 임경수의 211번 상자에서 나온 5년 전 예산 심사서 사본입니다. 항목 이름은 '트리거랩 참가자 반응 관찰 연구비', 1기 참가자 5명, 첫 줄의 이름은 선우진. 심사 의견란에 임경수의 글씨가 있습니다. '사람을 재료로 쓰는 예산. 반대.' 반재욱이 수첩을 덮습니다. '철거를 당긴 사람들이 찾던 건 2023-0412가 아니었을 수도 있습니다.'",
    memo: ["철거 일정 변경 요청: 그룹전략실, 담당 백아린", "211번 상자: 트리거랩 관찰 연구비 예산 심사서 사본", "1기 참가자 5명 -- 첫 이름 선우진"],
    triggers: ["curiosity", "system", "injustice"],
    entryEffect: { legitimacy: 5, trust: 3, time: -6, fatigue: 3 },
    choices: [
      ["c19_evidence_turn_file", "변경 공문과 예산 심사서를 묶어 감사위원회에 정식으로 낸다", { legitimacy: 13, trust: 4, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c19_evidence_turn_hold", "선우진이라는 이름은 알아 두고 지금은 아무에게도 말하지 않는다", { capital: 8, time: 6, trust: -6, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c19_evidence_turn_tell", "그가 쓴 반대 의견이 남아 있었다고 임경수에게 먼저 알린다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c19_branch_bookshop",
    systemNext: "c19_route_system",
    evidenceNext: "c19_evidence_turn",
    routeLabel: "직전 사건의 송년회 단톡방으로 헌책방 짐을 나를 사람을 한 명씩 부른다",
    systemLabel: "직전 사건의 매각 묶음 명세처럼 KD리얼티의 공정표도 겹쳐 본다",
    evidenceLabel: "직전 단서를 붙여 철거 날짜를 당긴 부서를 연다",
  },
  openingRoutes: {
    c18_after_warm: "c19_start_warm",
    c18_after_record: "c19_start_record",
    c18_after_rush: "c19_start_rush",
  },
  openingCopy: {
    c19_start_warm: ["송년회가 끝나지 않은 사람들", "오진우", "그믐밤 탕비실 불을 끄고 나온 사람들은 1월 넷째 주까지 단톡방에서 계산기 떡 사진을 주고받습니다. 어느 책상에서 새해를 맞았든 오진우가 늘 제일 먼저 답합니다. 한파가 사흘째인 월요일 아침, 그 오진우가 사진 한 장을 올립니다. 회기동 헌책방 셔터, 그믐에 봤던 철거 예고문 위에 새 종이가 덧붙어 있습니다. 4월 14일이던 날짜가 1월 29일로 당겨졌고, 시행사(재개발 사업을 맡아 진행하는 회사)는 그룹 계열사(같은 그룹에 속한 다른 회사) KD리얼티입니다. '임경수 선생님은 아직 입원 중이시랍니다. 남은 시간은 72시간이고요.'", ["철거 예정 1월 29일 06시 -- 원래 4월 14일", "시행사 KD리얼티, 그룹 부동산 계열사", "단톡방 전원이 이번 주 일정을 비우는 중"]],
    c19_start_record: ["기준을 남긴 사람의 새해", "반재욱", "그믐밤 당신이 문서로 남긴 매각 묶음의 채무자 보호 기준은 새해 첫 이사회 자료에 원문 그대로 붙었습니다. 반재욱은 그 기준의 근거 칸마다 '원본: 회기동 헌책방 2층'이라는 각주가 여섯 개 달려 있다는 걸 세어 둡니다. 1월 한파 속 월요일, 그 헌책방 셔터의 철거 예고문 위에 새 종이가 덧붙습니다. 4월 14일이던 날짜가 1월 29일로 당겨졌습니다. 시행사(재개발 사업을 맡아 진행하는 회사)는 그룹 계열사(같은 그룹에 속한 다른 회사) KD리얼티입니다. 반재욱이 수첩을 엽니다. '각주 여섯 개의 원본이 72시간 뒤에 굴착기 밑으로 들어갑니다.'", ["철거 예정 1월 29일 06시 -- 원래 4월 14일", "채무자 보호 기준의 근거 원본 6건이 헌책방 2층에 있음", "임경수 입원 4주째, 폐렴 재발"]],
    c19_start_rush: ["먼저 달려간 사람의 석 달", "임소율", "그믐밤, 송별사 박수가 끝나기도 전에 당신은 회기동으로 달려갔습니다. 그때 셔터의 철거 예고문에 적힌 날짜는 4월 14일이었고, 임소율과 언 손으로 번호를 주고받으며 석 달이면 충분하다고 말했습니다. 1월 한파 속 월요일 아침, 그 번호로 전화가 옵니다. '예고문 위에 새 종이가 붙었어요. 1월 29일 06시래요.' 시행사(재개발 사업을 맡아 진행하는 회사)는 그대로 KD리얼티, 그룹 계열사(같은 그룹에 속한 다른 회사)입니다. 수화기 너머 목소리가 차갑습니다. '석 달이면 된다고 하셨잖아요. 이제 사흘이에요.'", ["그믐밤 예고문: 4월 14일 -- 새 예고문: 1월 29일 06시", "남은 시간 72시간", "임경수 입원 4주째, 폐렴 재발"]],
  },
  openingSignatures: {
    c19_start_warm: {
      label: "송년회 단톡방에 짐 나를 사람을 모아 다 같이 회기동으로 간다",
      effect: { trust: 11, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "송년회 단톡방에 짐 나를 사람을 모아, 다 같이 회기동으로 간다.",
      echo: "단톡방에 '짐'이라고 쓰자 1분 만에 답이 아홉 개 달립니다. 권도현의 답은 '상자당 단가부터 보내 주십시오'입니다.",
    },
    c19_start_record: {
      label: "철거 계획이 언제 왜 바뀌었는지 구청 서류부터 열람 신청한다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -6, fatigue: 3 },
      cognition: { inference: 2 },
      voice: "철거 계획이 언제 왜 바뀌었는지, 구청 서류부터 열람 신청한다.",
      echo: "열람 신청은 접수됩니다. 창구 직원이 '처리 기한은 열흘'이라고 말하는 동안, 72시간 중 세 시간이 지나갑니다.",
    },
    c19_start_rush: {
      label: "그믐밤 찍어 둔 첫 예고문 사진을 들고 오늘 바로 짐을 빼러 간다",
      effect: { time: 8, trust: 4, capital: -3, humanCost: 3, fatigue: 2 },
      cognition: { risk: 1, persistence: 1 },
      voice: "그믐밤 찍어 둔 첫 예고문 사진을 들고, 오늘 바로 짐을 빼러 간다.",
      echo: "사진 속 4월 14일과 셔터의 1월 29일이 나란히 놓입니다. 임소율이 그 사진을 한참 보다가 말합니다. '그날 와 주신 건 고마웠어요. 근데 석 달 얘기는 다시 하지 마세요.'",
    },
  },
  voiceLines: {
    // CASE 19. Everything in this case is carried by hand, so every line is
    // said to someone holding a box, a key or an oxygen line.
    c19_start_ward: "열쇠를 받기 전에, 병원부터 가서 임경수의 뜻을 묻겠다고 한다.",
    c19_start_notice: "철거 예고문의 날짜와 근거부터, 구청 서류로 확인한다.",
    c19_start_haul: "열쇠를 받자마자, 트럭부터 불러 짐을 빼기 시작한다.",
    c19_shelves_all: "한 장도 고르지 않겠다며, 전부 옮길 수 있게 사람을 더 모은다.",
    c19_shelves_list: "상자마다 연도와 건명을 적은 목록부터 만들며, 옮기자고 한다.",
    c19_shelves_pick: "2023-0412 관련 상자 11개부터 빼고, 나머지는 뒤로 미룬다.",
    c19_ward_why: "그 종이가 왜 짐이 아닌지, 임소율 앞에서 직접 말해 달라고 부탁한다.",
    c19_ward_consent: "태울 상자와 남길 상자를 직접 고르시라며, 동의서로 받는다.",
    c19_ward_nod: "안심시키려고 태우겠다고 대답하고, 상자는 그대로 옮긴다.",
    c19_branch_bookshop_a: "할머니의 책 1만 2천 권을, 폐지값보다 비싸게 전부 사들인다.",
    c19_branch_bookshop_b: "밤새 경제사 칸 1,400권을 한 권씩 넘겨, 나온 장마다 기록한다.",
    c19_branch_bookshop_c: "경제사 칸 책만 상자째 가져가고, 나머지는 폐지 업체에 맡긴다.",
    c19_branch_bookshop_follow_a: "마흔한 장은 할아버지 상자에 넣고, 면지 메모 책은 임소율에게 준다.",
    c19_branch_bookshop_follow_b: "마흔한 장이 나온 책 제목과 쪽수를 전부 적어, 출처 목록을 만든다.",
    c19_branch_bookshop_follow_c: "2023-0412 한 장만 따로 챙기고, 나머지는 상자에 섞어 싣는다.",
    c19_labels_draw: "임소율과 밤새 라벨을 마저 그리고, 여백 메모도 목록에 넣는다.",
    c19_labels_register: "상자마다 출처와 기증자 임경수를 적어, 정식 등록부터 한다.",
    c19_labels_post: "임소율의 웹툰으로, 철거 소식과 라벨 사진을 먼저 알리게 한다.",
    c19_final_donate: "312상자를, 임경수의 이름으로 공공 기록관에 기증한다.",
    c19_final_court: "법원에 증거 보전 신청을 내고, 원본을 봉인해 맡긴다.",
    c19_final_keep: "트리거랩 B2에 두고, 우리 손으로 지키겠다고 한다.",
    c19_after_warm: "오늘 밤은, 보호자 의자에서 임경수 곁을 지킨다.",
    c19_after_record: "312상자 목록에 임경수의 서명을 받아, 인수 문서로 남긴다.",
    c19_after_rush: "알림을 보자마자, 트리거랩 서버실로 곧장 내려간다.",
    c19_route_system_publish: "다섯 곳의 공정표를 겹친 표를, 리드라인에 먼저 넘긴다.",
    c19_route_system_request: "국회 보존 요청 기간을, 철거일 전으로 앞당겨 달라고 요청한다.",
    c19_route_system_skip: "표는 저장만 해 두고, 짐 옮기는 일정대로 간다.",
    c19_final_system_route_a: "기록 보관처가 있는 건물은, 철거 전에 기록 조사를 거치게 하라고 요구한다.",
    c19_final_system_route_b: "이번 한 번만, 철거를 한 주 미루는 것으로 합의한다.",
    c19_final_system_route_c: "다섯 곳에서 사라진 기록의 주인들을 찾아, 함께 공개한다.",
    c19_evidence_turn_file: "변경 공문과 예산 심사서를 묶어, 감사위원회에 정식으로 낸다.",
    c19_evidence_turn_hold: "선우진이라는 이름은 알아 두고, 지금은 아무에게도 말하지 않는다.",
    c19_evidence_turn_tell: "그가 쓴 반대 의견이 남아 있었다고, 임경수에게 먼저 알린다.",
  },
  echoReplies: {
    // CASE 19.
    c19_start_ward: "병원에 먼저 가면 열쇠는 하루 늦게 돌아갑니다. 대신 임경수가 어느 상자부터 들어야 하는지 손가락으로 알려 줍니다.",
    c19_start_notice: "구청 서류를 떼면 철거일이 1월 23일 금요일 저녁에 바뀌었다는 게 보입니다. 그걸 확인하는 데 72시간 중 다섯 시간이 듭니다.",
    c19_start_haul: "트럭은 한 시간 만에 옵니다. 임소율은 열쇠를 건네고, 당신이 할아버지를 보러 갈지 묻지 않고 돌아섭니다.",
    c19_shelves_all: "사람을 모으면 계단참이 붐빕니다. 312상자 모두에 자리가 생기고, 그 사람들의 이번 주 저녁은 전부 헌책방 몫이 됩니다.",
    c19_shelves_list: "목록은 정확해집니다. 상자 하나에 3분씩, 312상자면 열다섯 시간이 목록에 들어갑니다.",
    c19_shelves_pick: "11상자는 오늘 안에 안전해집니다. 나머지 301상자에는 나준혁의 1996년도 들어 있습니다.",
    c19_ward_why: "부탁을 들은 임경수가 오래 천장을 봅니다. 그리고 손녀를 부릅니다. 산소 콧줄 너머로 나오는 이야기가 길어 간호사가 두 번 옵니다.",
    c19_ward_consent: "동의서는 깨끗합니다. 임경수가 떨리는 손으로 '태울 것' 칸에 상자 번호 하나를 적고, 그 번호가 무엇인지는 말하지 않습니다.",
    c19_ward_nod: "그가 안심하고 눈을 감습니다. 커튼 너머에서 임소율이 당신의 대답을 들었고, 그 대답이 거짓말이라는 것도 압니다.",
    c19_branch_bookshop_a: "할머니가 책값으로 받은 봉투를 두 손으로 쥡니다. '40년 장사에 책값을 제대로 받는 건 오늘이 처음이네.' 트리거랩 운영비는 바닥납니다.",
    c19_branch_bookshop_b: "1,400권을 넘기는 데 밤이 다 갑니다. 새벽 네 시, 강태민이 컵라면 두 개를 들고 와서 말없이 여섯 번째 칸부터 넘깁니다.",
    c19_branch_bookshop_c: "경제사 칸은 살아남습니다. 옆 칸 『한국 산업 지도』 사이에 끼워 둔 네 장은 폐지 트럭에 실립니다.",
    c19_branch_bookshop_follow_a: "면지 메모 책을 받은 임소율이 그 책을 패딩 안에 넣습니다. 마흔한 장은 출처 없이 상자 속으로 섞입니다.",
    c19_branch_bookshop_follow_b: "출처 목록이 생기면 어느 책 몇 쪽에서 나왔는지까지 증명됩니다. 면지 메모 책도 목록의 한 줄이 되어 상자로 들어갑니다.",
    c19_branch_bookshop_follow_c: "한 장은 당신 가방에 들어갑니다. 나머지 마흔 장은 어느 책에서 왔는지 아무도 모르게 됩니다.",
    c19_labels_draw: "라벨이 다 그려지면 새벽 여섯 시입니다. 임소율의 웹툰 마감은 하루 밀리고, 여백 메모 1,380줄이 목록에 들어갑니다.",
    c19_labels_register: "등록이 끝나면 30일 폐기 경고는 꺼집니다. 등록부 관리자 칸에는 그룹 총무팀 이름이 자동으로 들어갑니다.",
    c19_labels_post: "연재분은 한 시간 만에 조회 수 12만을 넘깁니다. 댓글 창에 '회기동 헌책방 2층 주소'를 묻는 글이 달리기 시작합니다.",
    c19_final_donate: "기증하면 종이는 모두의 것이 됩니다. 1년 반 동안은 아무도 읽을 수 없고, 그 사이에 열리는 재판에 원본은 없습니다.",
    c19_final_court: "봉인되면 누구도 손댈 수 없습니다. 그 누구에는 당신과, 원본을 40년 지킨 임경수도 들어 있습니다.",
    c19_final_keep: "B2에 두면 내일이라도 꺼내 쓸 수 있습니다. 그 문을 여는 카드는 매달 그룹이 새로 발급합니다.",
    c19_after_warm: "보호자 의자는 딱딱합니다. 새벽 세 시에 임경수가 깨어 '종이는 어디 있나' 묻고, 대답을 듣고 다시 잠듭니다. 에코의 알림은 아침까지 기다립니다.",
    c19_after_record: "인수 문서 첫 줄에 임경수가 이름을 씁니다. 글씨가 떨리자 그가 웃습니다. '태운 자리보다는 표가 덜 나는군.'",
    c19_after_rush: "서버실로 내려가는 동안 임소율이 라벨 사진을 보냅니다. 마지막 사진은 당신 얼굴을 그린 라벨이고, 당신은 그걸 다음 날에야 엽니다.",
    c19_route_system_publish: "표가 기사가 되면 KD리얼티는 해명 자료를 냅니다. 해명 자료에 가장 많이 나오는 단어도 '공정 단축'입니다.",
    c19_route_system_request: "요청은 의원실에 닿습니다. 국회가 날짜를 당기려면 회의가 필요하고, 회의는 철거일 다음 주에 잡힙니다.",
    c19_route_system_skip: "표는 폴더 안에 남습니다. 여섯 번째 건물의 철거일도 언젠가 조용히 당겨질 겁니다.",
    c19_final_system_route_a: "조건이 생기면 다음 철거 전에 누군가 건물 안의 종이를 확인해야 합니다. 그 조건에 KD리얼티는 석 달 동안 답하지 않습니다.",
    c19_final_system_route_b: "한 주가 생깁니다. 다섯 곳의 기록은 여전히 사라진 채로 있고, 이 건물만 운이 좋았다고 기록됩니다.",
    c19_final_system_route_c: "주인들을 찾는 데 한 달이 걸립니다. 그중 두 명은 이미 세상을 떠났고, 가족들은 무엇이 사라졌는지도 몰랐습니다.",
    c19_evidence_turn_file: "감사위원회에 가면 백아린의 이름이 공식 문서에 처음 오릅니다. 선우진의 이름도 함께 오르고, 그는 아직 그 사실을 모릅니다.",
    c19_evidence_turn_hold: "이름은 당신 수첩에만 있습니다. 211번 상자가 있는 B2의 출입 기록은 그룹이 매일 봅니다.",
    c19_evidence_turn_tell: "알리면 임경수가 한참 웃다가 기침을 합니다. '그건 내가 쓴 반대 의견 중에 제일 짧은 거였어. 짧은 게 오래 가는군.'",
  },
  characterProfiles: {
    임소율: {
      role: "웹툰 작가 · 임경수의 손녀",
      stance: "서운함 · 이해 · 그림",
      job: "할아버지의 종이를 '짐'이라 부르던 사람이, 그 종이에 적힌 사람들을 처음 읽는다.",
      appearance: "물감 자국이 남은 패딩 소매, 귀 뒤에 꽂은 네임펜, 연재 마감 알림이 울리는 태블릿.",
      thought: "주말마다 할아버지는 책방 2층에 있었다. 나보다 종이가 중요한 줄 알았다.",
      gesture: "임소율은 대답하기 전에 손등에 작은 그림부터 그린다. 그림이 끝나야 말이 나온다.",
      voice: "짧고 솔직하게 말하고, 서운한 말일수록 농담처럼 던진다.",
      line: "저는 이걸 짐이라고 불렀어요. 무거우니까요. 근데 무거운 이유가 있었네요.",
    },
    구태형: {
      role: "철거 용역 반장 · 경력 27년",
      stance: "원칙 · 일정 · 안전",
      job: "위에서 당기는 날짜와 서류에 적힌 날짜 사이에서 서류 쪽에 선다. 딱 서류까지만.",
      appearance: "매직으로 이름을 쓴 흰 안전모, 무릎이 해진 방한 작업복, 믹스커피가 든 스테인리스 보온병.",
      thought: "나는 부수는 사람이지 버리는 사람이 아니다. 안에 뭐가 남았는지는 확인하고 부순다.",
      gesture: "구태형은 대답 대신 공정표를 펴서 해당 줄을 손톱으로 긋는다.",
      voice: "말수가 적고 숫자로 끝맺는다. 존댓말이지만 굽히지는 않는다.",
      line: "72시간은 지킵니다. 1분도 더는 없습니다.",
    },
  },
  setting: { place: "회기동 헌책방 · 앞 골목", clock: "1월 · 한파 · 철거까지 72h" },
  sceneContext: {
    c19_start: {
      place: "회기동 헌책방 · 앞 골목",
      clock: "1월 · 한파 · 철거까지 72h",
      question: "40년 치 종이가 든 건물에 철거 예고문이 붙었고, 주인은 병원에 있습니다. 무엇부터 하겠습니까?",
      lead: "섣달그믐의 문자 이후 4주, 회기동 헌책방 앞에 다시 와 보니 예고문 위에 새 종이가 덧붙어 있습니다.",
    },
    c19_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 · 한파 · 철거까지 72h",
      question: "송년회 밤을 함께 버틴 사람들이 철거 예고문 사진을 봤습니다. 그 사람들과 어디부터 가겠습니까?",
      lead: "탕비실 벽에 남은 송년회 사진을 떼려던 참에 단톡방 알림이 울립니다.",
    },
    c19_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 · 한파 · 철거까지 72h",
      question: "당신이 남긴 기준의 근거 원본 여섯 건이 철거될 건물 안에 있습니다. 문서를 어떻게 원본 쪽으로 돌리겠습니까?",
      lead: "이사회 자료집의 각주를 세던 반재욱이 당신 책상으로 의자를 끌고 옵니다.",
    },
    c19_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 · 한파 · 철거까지 72h",
      question: "석 달이라던 시간이 사흘로 줄었습니다. 그믐밤에 한 약속을 어떻게 지키겠습니까?",
      lead: "그믐밤 받아 둔 번호가 월요일 아침 여덟 시에 울립니다.",
    },
    c19_shelves: {
      place: "회기동 헌책방 2층 · 책장",
      clock: "1월 · 한파 · 철거까지 66h",
      question: "5.7톤의 종이를 72시간 안에 다 옮길 수 없습니다. 무엇부터 빼겠습니까?",
      lead: "열쇠로 2층 문을 열자 묵은 종이 냄새와 함께 입김이 먼저 번집니다. 동료들이 계단 아래에서 패딩 지퍼를 올리고 있습니다.",
    },
    c19_crew: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "1월 · 한파 · 철거까지 62h",
      question: "철거 반장이 버틸 수 있는 건 서류까지라고 합니다. 그 서류 너머를 어떻게 하겠습니까?",
    },
    c19_crew_reaction: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "1월 · 한파 · 철거까지 61h",
      question: "한파 때문에 당겼다는 철거일이 국회 보존 기간 사흘 전입니다. 이 날짜를 어떻게 하겠습니까?",
    },
    c19_ward: {
      place: "강서 이음병원 · 호흡기내과 병실",
      clock: "1월 · 철거까지 54h",
      question: "40년 동안 종이를 지킨 사람이 이제 태워 달라고 합니다. 어떻게 대답하겠습니까?",
      lead: "병동 복도 끝 창가 침대, 커튼 틈으로 산소 줄이 먼저 보입니다. 임소율이 보호자 의자에서 일어나 자리를 비켜 줍니다.",
    },
    c19_branch_bookshop: {
      place: "회기동 헌책방 · 1층 책장",
      clock: "1월 · 한파 · 철거까지 50h",
      question: "원본이 숨어 있는 책 1,400권이 내일 아침 폐지로 실려 갑니다. 이 책들을 어떻게 하겠습니까?",
    },
    c19_branch_bookshop_follow: {
      place: "회기동 헌책방 · 1층 책장",
      clock: "1월 · 한파 · 새벽 01:00",
      question: "책 속에서 원본 마흔한 장과 손녀의 생일 메모가 나왔습니다. 무엇을 어디에 두겠습니까?",
    },
    c19_freight: {
      place: "회기동 헌책방 · 앞 골목",
      clock: "1월 · 눈발 · 철거까지 36h",
      question: "운송비 612만 원이 운영비 잔액의 세 배입니다. 312상자를 어떻게 싣겠습니까?",
    },
    c19_freight_reaction: {
      place: "회기동 헌책방 · 앞 골목",
      clock: "1월 · 눈발 · 23:00",
      question: "B2에 넣으면 종이는 얼지 않지만 그룹의 기록이 됩니다. 오늘 밤 상자를 어디에 내리겠습니까?",
    },
    c19_labels: {
      place: "트리거랩 기록 보관소 B2 · 서고",
      clock: "1월 · 철거까지 27h · 새벽 03:00",
      question: "여백마다 사람이 적혀 있고, 등록하지 않으면 30일 뒤 전부 폐기됩니다. 이 상자들을 어떻게 남기겠습니까?",
      lead: "지하 2층 서고에는 한파가 닿지 않습니다. 트럭에서 내린 상자들이 아직 눈을 묻힌 채 선반에 올라가 있습니다.",
    },
    c19_margin: {
      place: "트리거랩 기록 보관소 B2 · 서고",
      clock: "1월 · 새벽 05:10",
      question: "30년 전의 빨간 펜 한 장을 나준혁이 갖고 싶어 합니다. 그 원본을 어떻게 하겠습니까?",
    },
    c19_margin_reaction: {
      place: "트리거랩 기록 보관소 B2 · 자료실",
      clock: "1월 · 철거까지 24h",
      question: "9만 4천 장을 다 스캔할 시간은 없고, 스캔하면 종이가 전산이 됩니다. 무엇부터 넣겠습니까?",
    },
    c19_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "1월 · 철거까지 60h",
      question: "기록이 있던 건물 일곱 곳의 철거일이 모두 당겨졌습니다. 이 겹친 공정표를 어떻게 하겠습니까?",
    },
    c19_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "1월 · 철거 당일 · 새벽",
      question: "철거와 기록 사이에 규칙 하나를 끼워 넣을 수 있다면, 무엇을 넣겠습니까?",
    },
    c19_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 211번 선반",
      clock: "1월 · 철거까지 8h",
      question: "날짜를 당긴 곳은 그룹전략실이었고, 상자 속에는 트리거랩의 첫 예산서가 있었습니다. 이 두 장을 어떻게 쓰겠습니까?",
    },
    c19_final: {
      place: "회기동 헌책방 · 앞 골목",
      clock: "1월 29일 · 눈발 · 05:20",
      question: "굴착기 앞에서 마지막 트럭의 행선지를 정해야 합니다. 312상자를 어디로 보내겠습니까?",
      lead: "밤새 내린 눈 위로 트럭 바퀴 자국만 여섯 줄 나 있습니다. 골목 입구에서 굴착기 엔진이 공회전하고 있습니다.",
    },
    c19_aftershock: {
      place: "강서 이음병원 · 호흡기내과 병실",
      clock: "1월 29일 · 한파 · 저녁",
      question: "철거가 끝난 병실에 에코 교체 공지가 도착했습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c19-lab-budget",
    title: "관찰 연구비",
    text: "철거 일정을 당겨 달라는 요청은 그룹전략실에서 나갔습니다. 임경수의 211번 상자에는 트리거랩 설립 때의 '참가자 반응 관찰 연구비' 예산 심사서가 있었고, 1기 참가자 명단의 첫 이름은 선우진이었습니다.",
  },
  outcomes: {
    c19_after_warm: { tag: "곁을 지킨 결말", title: "보호자 의자에서 그가 다시 잠드는 걸 봤다", text: "철거가 끝난 밤, 당신은 병실 보호자 의자에서 임경수 곁을 지켰습니다. 새벽에 그가 깨어 종이가 어디 있는지 묻고, 대답을 듣고 다시 잠들었습니다." },
    c19_after_record: { tag: "목록을 남긴 결말", title: "312상자의 맨 위에 그의 이름이 적혔다", text: "인수 문서 첫 줄에 기증자 임경수의 이름과 서명이 들어갔습니다. 40년 동안 숨겨 온 종이가 처음으로 주인의 이름을 달았습니다." },
    c19_after_rush: { tag: "먼저 내려간 결말", title: "병실을 나와 곧장 서버실로 갔다", text: "알림을 본 당신은 병실에 인사만 남기고 트리거랩 서버실로 향했습니다. 임소율이 보낸 라벨 사진은 다음 날 아침에야 열어 봤습니다." },
  },
  carryovers: {
    c19_after_warm: { trust: 10, humanCost: -4, fatigue: -8 },
    c19_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c19_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c18_after_warm: { id: "protect-trust", title: "불을 끌 때까지 남은 사람들과 같이 들기", text: "그믐밤 탕비실 불을 끌 때까지 남은 사람들이 아직 흩어지지 않았습니다. 이번 짐도 혼자가 아니라 같이 드는 선택을 찾아야 보너스가 열립니다." },
    c18_after_record: { id: "use-reframe", title: "각주의 원본을 살려 내기", text: "당신이 남긴 채무자 보호 기준의 근거는 헌책방 2층의 종이였습니다. 문서가 원본을 지키도록 판을 다시 짜야 합니다." },
    c18_after_rush: { id: "repair-legitimacy", title: "그믐밤에 말한 석 달의 공정함 회복하기", text: "그믐밤 먼저 달려간 당신은 석 달이면 충분하다고 말했습니다. 그 말이 사흘로 줄어든 이유를 가족에게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
