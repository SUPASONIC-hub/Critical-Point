/**
 * CASE 32 -- the raid, and the day the dissenter's own name turns up in the boxes.
 *
 * For thirty-one cases the analyst has been the one who wrote the dissent and
 * the one who went looking. In mid-June the 서울중앙지검 raids the group's 33rd
 * floor and KD캐피탈 at once, and the case turns the search around. 나은호, a
 * prosecutor who is fast and honest to the point of rudeness, calls the analyst
 * in as a witness -- then asks the questions he would ask a suspect. The boxes
 * tell him to: the lab's reaction records carry the analyst's name 1,106 pages
 * deep, and a May price review for the 라운드힐 asset sale carries the analyst's
 * electronic signature, dated a night the analyst was in Singapore. Three years
 * ago the signature box was empty. This time there is a name in it that the
 * analyst never wrote.
 *
 * The laughter is 강태민 at the loading dock, stopped from carrying evidence,
 * setting a box down like a sleeping child and then counting the truck better
 * than the investigator who numbered it; 나은호 eating 김밥 through an
 * interrogation and missing the bin; 권도현 pricing the raid per box and
 * finding, for the first time, an investigation that turns a profit. The anger
 * is a stack of lab boxes stickered for shredding three days out and a box 27
 * that left the building two days before anyone was supposed to know. The
 * sorrow is 반재욱's notebook going into an evidence bag with his daughter's
 * star stickers on it, because stickers are part of the exhibit. The joy is
 * 한서윤, two months without a desk, waiting across the street at 22:40 with
 * five lunch boxes and a rolled omelette that failed three times. The case ends
 * on which status to accept -- witness, suspect, or a trade. After midnight, on
 * the emptied floor, 백아린 squares twelve chairs without a word and leaves the
 * seizure list with box 27 blank; 사건 33 begins a week later with her report.
 */
export const case32Nodes = {
  c32_start: {
    phase: "CASE 32 BRIEFING",
    title: "07시 40분",
    speaker: "나은호",
    text:
      "6월 16일 화요일 아침 7시 40분, KD캐피탈 12층 위험관리부 문이 열리고 파란 조끼를 입은 사람 열한 명이 들어옵니다. 서울중앙지검 수사관들입니다. 맨 앞의 남자가 종이 한 장을 들어 보입니다. 압수수색 영장(법원이 허락해 준, 자료와 물건을 강제로 가져가도 된다는 문서)입니다. 같은 시각 본사 33층 그룹전략실과 윤상혁의 대표이사실에도 같은 종이가 들어갔습니다. 남자는 자기를 나은호 검사라고 소개하고 곧장 당신 책상 앞에서 멈춥니다. '반대 의견 쓰신 분 맞죠? 기사로 봤어요. 오늘 오후 두 시, 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 오세요.' 그가 당신 모니터에 봉인 스티커를 붙이며 덧붙입니다. '참고인이라고 했습니다. 지금은요.'",
    memo: [
      "압수수색 장소 3곳: 33층 그룹전략실, KD캐피탈 대표이사실, 위험관리부",
      "혐의: 평택 오피스텔 대출 손실 미루기, 라운드힐 매각 가격, 해온파트너스 자문료",
      "참고인 출석 요구: 오늘 14시, 서울중앙지검 1108호",
      "수사관 11명, 접어 온 빈 상자 60개",
    ],
    triggers: ["fear", "injustice", "protection"],
    choices: [
      {
        id: "c32_start_calm",
        label: "겁먹은 팀원들에게 무엇을 거절할 수 있는지부터 알려 준다",
        effect: { trust: 11, humanCost: -5, time: -4, capital: -3, fatigue: 6 },
        next: "c32_boxes",
        cognition: { persistence: 2 },
      },
      {
        id: "c32_start_list",
        label: "압수 목록을 한 줄씩 확인한 뒤에만 서명한다",
        effect: { legitimacy: 12, time: -5, trust: -3, humanCost: 2, fatigue: 3 },
        next: "c32_boxes",
        cognition: { inference: 2 },
      },
      {
        id: "c32_start_hand",
        label: "휴대폰을 순순히 넘기고 오후 조사 준비부터 한다",
        effect: { capital: 7, time: 6, legitimacy: -5, trust: -2, humanCost: 3, fatigue: -1 },
        next: "c32_boxes",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c32_boxes",
      },
    ],
  },
  c32_boxes: {
    phase: "SEIZED BOXES",
    title: "상자에 붙은 이름",
    speaker: "백아린",
    text:
      "오전 10시 반, 나은호가 당신을 33층으로 데려갑니다. '트리거랩 상자가 어느 건지 아는 사람이 당신밖에 없다더군요.' 그룹전략실 복도에 트리거랩 기록 상자 마흔 개가 쌓여 있고, 수사관들이 하나씩 번호표를 붙입니다. 백아린은 자기 책상 서랍이 비워지는 걸 선 채로 봅니다. 늘 매끄럽던 사람이 손톱을 뜯고 있습니다. 상자 옆면마다 2주 전 지하 자료실에서 본 것과 같은 서식의 법무팀 스티커가 붙어 있습니다. '보관 기한 만료, 6월 20일 폐기 예정.' 사흘 뒤입니다. 나은호가 상자 하나를 엽니다. 맨 위 파일철의 이름표가 당신 이름입니다. 반응 기록 1,106쪽. '당신 이름이 제일 많이 나와요. 윤상혁 이름은 아직 한 번도 안 나왔고요.' 그가 파일철을 탁 덮습니다. '증언하러 온 사람치고는 좀 많죠?'",
    memo: [
      "트리거랩 기록 상자 40개 -- 법무팀 스티커 '6월 20일 폐기 예정'",
      "당신의 반응 기록 1,106쪽",
      "상자 속 윤상혁의 이름: 0회",
      "백아린의 책상 서랍 3칸, 오전 중 압수 완료",
    ],
    triggers: ["injustice", "selfAwareness", "system"],
    choices: [
      {
        id: "c32_boxes_seal",
        label: "동료들의 기록 상자는 따로 봉인해 달라고 요청한다",
        effect: { trust: 12, humanCost: -5, time: -4, fatigue: 6 },
        next: "c32_room",
        cognition: { persistence: 2 },
      },
      {
        id: "c32_boxes_match",
        label: "압수 상자와 트리거랩 원래 목록을 한 칸씩 맞춰 본다",
        effect: { legitimacy: 11, trust: -3, time: -4, humanCost: 2, fatigue: 4 },
        next: "c32_room",
        cognition: { inference: 2 },
      },
      {
        id: "c32_boxes_mine",
        label: "내 이름 상자부터 먼저 넘겨 수사를 빨리 돌린다",
        effect: { capital: 7, time: 5, legitimacy: 2, trust: -2, humanCost: 4, fatigue: -2 },
        next: "c32_room",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c32_room",
      },
    ],
  },
  c32_room: {
    phase: "INTERROGATION",
    title: "지난달의 서명",
    speaker: "나은호",
    text:
      "오후 2시, 서울중앙지검 1108호. 나은호가 은박지에 싼 김밥 한 줄을 책상에 올려놓습니다. '점심을 못 먹어서요. 드실래요? 안 드시면 제가 다 먹습니다.' 첫 질문은 3년 전 반대 의견이 아닙니다. 그가 종이 한 장을 밀어 줍니다. 5월 28일자 KD캐피탈 '부실 자산 매각 가격 검토서'. 라운드힐 캐피탈에 장부가의 38%로 넘긴 그 매각이고, 검토자 칸에 당신의 전자 서명이 있습니다. 그날 밤 당신은 싱가포르에 있었습니다. 회사에서 남의 전자 서명을 입력할 수 있는 사람은 대표이사 명의 서명을 대신 넣어 온 비서실장 석재우 한 명뿐입니다. '반대 의견은 3년 전 거고, 이 서명은 지난달 거예요. 저는 지난달 걸 수사합니다.' 그가 김밥을 씹으며 고개를 끄덕입니다. '그럼 누가 당신 이름을 썼을까요. 그 사람을 찾을 때까지, 질문은 피의자(죄를 지었다고 의심받아 수사를 받는 사람)한테 하듯 하겠습니다.'",
    memo: [
      "검토서 날짜 5월 28일 -- 당신은 싱가포르 체류 중",
      "매각 가격: 장부가의 38%, 매수자 라운드힐 캐피탈",
      "검토자 칸: 당신의 전자 서명",
      "전자 서명 대리 입력 권한: 대표이사실 비서실장 석재우",
    ],
    triggers: ["fear", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c32_room_plain",
        label: "동료 이름은 빼 달라고 하고 내 행적만 숨김없이 말한다",
        effect: { trust: 12, humanCost: -4, legitimacy: -1, time: -4, fatigue: 6 },
        next: "c32_notebook",
        cognition: { persistence: 2 },
      },
      {
        id: "c32_room_counsel",
        label: "변호사 입회와 참고인 신분 확인서부터 요구한다",
        effect: { legitimacy: 12, trust: -4, time: -4, humanCost: 2, fatigue: 3 },
        next: "c32_notebook",
        cognition: { inference: 2 },
      },
      {
        id: "c32_room_alibi",
        label: "싱가포르 출국 기록부터 내밀어 서명 의혹을 빨리 끊는다",
        effect: { capital: 6, time: 5, legitimacy: 4, trust: -2, humanCost: 3, fatigue: -2 },
        next: "c32_notebook",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c32_notebook",
      },
    ],
  },
  c32_notebook: {
    phase: "EXHIBIT",
    title: "스티커도 증거물입니다",
    speaker: "반재욱",
    text:
      "밤 9시, 검찰청 주차장. 지방 감사 순회 중이던 반재욱이 대전에서 차를 몰고 올라왔습니다. 그의 검은 수첩에도 제출 요구가 왔습니다. 여섯 달 전 법무팀이 가져가려던 그 수첩입니다. 이번에는 법원이 내준 문서가 붙어 있어서, 거절할 방법이 없습니다. 반재욱이 조수석에서 수첩을 꺼냅니다. 표지에는 딸 서아가 붙인 별 스티커 열두 개가 그대로 있고, 안쪽 하윤재의 이름 옆에는 꽃 스티커 하나가 있습니다. '수사관이 스티커도 떼면 안 된답니다. 증거물은 원래 모양 그대로.' 그가 안경을 벗습니다. '어젯밤 서아가 물었어요. 아빠 수첩이 감옥 가는 거냐고. 아니라고 했는데, 저도 잘 모르겠습니다.' 수첩 맨 뒷장에는 연필로 쓴 당신 이름이 아직 있습니다.",
    memo: [
      "반재욱 수첩 제출 요구 -- 이번에는 법원 허가",
      "표지 별 스티커 12개, 하윤재 이름 옆 꽃 스티커 1개",
      "맨 뒷장: 연필로 쓴 당신 이름과 그 날짜",
      "반서아, 초등 4학년 -- '아빠 수첩이 감옥 가?'",
    ],
    triggers: ["affection", "helplessness", "trust"],
    choices: [
      {
        id: "c32_notebook_seoa",
        label: "수첩을 내기 전에 서아에게 같이 가서 사정을 말해 준다",
        effect: { trust: 12, humanCost: -5, time: -5, capital: -2, fatigue: 6 },
        next: "c32_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c32_notebook_copy",
        label: "수첩 전 쪽을 사본으로 떠 두고 원본은 요구대로 낸다",
        effect: { legitimacy: 11, trust: 3, time: -4, humanCost: 2, fatigue: 5 },
        next: "c32_final",
        cognition: { inference: 2 },
      },
      {
        id: "c32_notebook_later",
        label: "내 이름이 적힌 뒷장 얘기는 미루고 제출부터 끝낸다",
        effect: { capital: 6, time: 5, trust: -2, legitimacy: -3, humanCost: 3, fatigue: -3 },
        next: "c32_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c32_final",
      },
    ],
  },
  c32_final: {
    phase: "FINAL DECISION",
    title: "이름이 너무 많은 사람",
    speaker: "나은호",
    text:
      "밤 11시 40분, 마지막 조사가 끝나자 나은호가 복도까지 따라 나옵니다. 넥타이는 이미 주머니에 들어가 있습니다. '내일부터 당신 신분을 정해야 해요. 선택지는 제가 드리죠, 빠르게.' 그가 손가락을 하나씩 폅니다. 하나, 윤상혁에 대해 아는 걸 전부 말하면 증언하는 사람으로 남습니다. 대신 트리거랩 동료들의 반응 기록도 전부 증거로 열어야 합니다. 둘, 당신 이름이 쓰인 검토서부터 수사 대상으로 조사받습니다. 이름을 대신 쓴 사람을 찾기까지 몇 달이 걸릴 수 있습니다. 셋, 오늘 밤 윤상혁에 관한 것만 먼저 내고 나머지는 나중에 정합니다. '저는 빠른 걸 좋아합니다. 근데 이번엔 빠른 게 맞는 건지 저도 모르겠네요.' 그가 엘리베이터 버튼을 누릅니다. '3년 전엔 서명란이 비어 있었다면서요. 이번엔 당신 이름이 너무 많아요.'",
    memo: [
      "신분 결정 시한: 내일 09시",
      "증언으로 남을 경우: 트리거랩 동료 반응 기록 전부 공개",
      "수사 대상이 될 경우: 대신 서명한 사람 찾기까지 수개월",
      "27번 상자 -- 아직 행방 모름",
    ],
    triggers: ["choice", "responsibility", "trust"],
    choices: [
      {
        id: "c32_final_shield",
        label: "동료들의 기록을 닫는 조건으로 내가 아는 전부를 진술한다",
        effect: { trust: 11, humanCost: -6, legitimacy: -4, capital: -4, time: -5, fatigue: 6 },
        next: "case32_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c32_final_stand",
        label: "내 이름이 쓰인 검토서부터 수사 대상으로 조사받겠다고 한다",
        effect: { legitimacy: 13, trust: 6, capital: -8, time: -7, humanCost: -3, fatigue: 5 },
        next: "case32_result",
        cognition: { persistence: 1, inference: 2 },
      },
      {
        id: "c32_final_trade",
        label: "윤상혁에 관한 진술만 오늘 밤 먼저 넘긴다",
        effect: { capital: 10, time: 6, legitimacy: 5, trust: -4, humanCost: 4, fatigue: -2 },
        next: "case32_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case32_result",
      },
    ],
  },
};

/**
 * Everything else case 32 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case32 = {
  id: "case32",
  nodes: case32Nodes,
  aftermath: {
    c32_aftershock: {
      phase: "AFTERMATH",
      title: "의자 열두 개",
      speaker: "강태민",
      text: "자정을 넘겨 KD캐피탈 12층으로 돌아옵니다. 위험관리부는 서랍이 전부 빠진 채 비어 있고, 의자들은 복도까지 밀려나 있습니다. 경비실에서 방문증을 받아 온 동료들이 말없이 소매를 걷습니다. 강태민은 책상을 한 번에 두 개씩 밀고, 권도현은 '원상 복구 비용은 청구서에 넣겠습니다'라며 서랍 번호를 맞춥니다. 그때 엘리베이터가 열리고 백아린이 들어옵니다. 33층에서 내려왔다는 말도 없이 의자 열두 개를 줄 맞춰 세우더니, 당신 책상에 압수 목록 사본 312줄을 올려놓고 먼저 갑니다. 목록 맨 끝, 27번 상자 칸만 비어 있습니다. 휴대폰에는 나은호의 문자가 와 있습니다. '신분은 내일 아침 아홉 시까지 정하시죠.'",
      memo: ["위험관리부 책상 23개 -- 서랍 전부 압수", "백아린이 세운 의자 12개", "압수 목록 사본 312줄, 27번 칸만 빈칸", "나은호: 신분 결정은 내일 09시까지"],
      triggers: ["trust", "affection", "choice"],
      choices: [
        { id: "c32_after_warm", label: "빈 책상들을 동료들과 끝까지 제자리로 돌려놓는다", effect: { trust: 13, humanCost: -5, time: -3, capital: -2, fatigue: -7 }, next: "case32_result", cognition: { reframing: 2 } },
        { id: "c32_after_record", label: "압수 목록 312줄을 한 줄씩 대조해 사본 목록으로 남긴다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -3, fatigue: 6 }, next: "case32_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c32_after_rush", label: "날이 밝는 대로 곧장 나은호 검사를 찾아간다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 7 }, next: "case32_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c32_final", "c32_aftershock"],
  connectiveScenes: [
    ["c32_dock", "c32_boxes", "c32_room", "스물여섯 번이 두 개", "강태민", "정오 무렵 본사 지하 주차장 하역장에 검찰 트럭 두 대가 서 있습니다. 야간조를 마치고 뉴스를 보자마자 왔다는 강태민이 컵라면 봉지를 든 채 서 있습니다. 수사관 하나가 상자 셋을 한꺼번에 들다 휘청이자, 강태민이 반사적으로 손을 뻗어 받칩니다. '선생님, 그거 증거물입니다. 손 떼세요.' 강태민이 상자를 잠든 아기 내려놓듯 바닥에 놓고 두 손을 등 뒤로 모읍니다. 그러고는 트럭 안을 한참 보다가 말합니다. '스물여섯 번이 두 개예요. 하나는 스물일곱 번 자리에 있어야 되는데.' 번호표를 붙인 수사관 진태윤가 목록을 넘기다 얼굴이 굳습니다. 27번 상자는 목록에만 있고 트럭에는 없습니다.", ["검찰 트럭 2대 -- 상자 58개 적재", "26번 상자 중복, 27번 상자 없음", "강태민: 야간조 상하차 14년"], ["강태민이 옆에서 번호 맞추는 걸 돕게 해 달라고 부탁한다", "27번 상자가 빠졌다는 사실을 기록으로 남겨 달라고 한다", "번호는 수사관 몫이라며 강태민을 데리고 하역장을 나온다"]],
    ["c32_invoice", "c32_room", "c32_notebook", "흑자인 수사", "권도현", "조사가 잠깐 멈춘 사이 복도 의자에 권도현이 앉아 있습니다. 라운드힐 매각에 브릿지은행도 입찰했던 터라 그도 증언하러 불려 왔습니다. 무릎 위 종이에는 벌써 세로줄이 그어져 있습니다. '상자 58개, 수사관 11명, 포렌식(지워진 파일까지 되살려 들여다보는 분석)까지 넣으면 오늘 하루에 세금이 대략 이천사백만 원 듭니다.' 그가 볼펜을 멈춥니다. '해온파트너스로 열두 번 나간 자문료(조언값이라는 이름으로 내보낸 돈)에 비하면, 이 가격이면 적자는 아니네요. 흑자인 수사는 처음 봅니다.' 그가 종이를 뒤집습니다. 뒷면은 그가 받은 질문지입니다. 질문 스물두 개 중 열여덟 개가 당신에 관한 것입니다.", ["오늘 수사 비용 추산 -- 약 2,400만 원", "권도현 질문지 22개 중 18개가 당신에 관한 것", "권도현: 라운드힐 매각 입찰 참여 은행 소속"], ["권도현에게 나에 관한 질문에는 아는 그대로만 답해 달라고 한다", "질문지는 그의 것이라며 읽지 않고 돌려준다", "열여덟 개 질문에 맞춰 내 답을 미리 정리해 둔다"]],
    ["c32_bento", "c32_notebook", "c32_final", "계란말이 네 번", "한서윤", "밤 10시 40분, 검찰청 건너편 횡단보도 앞에 한서윤이 서 있습니다. 대기발령(일을 주지 않고 자리만 남겨 두는 인사 조치) 두 달째인 그가 보자기에 싼 도시락 다섯 개를 들고 있습니다. '대기발령이면 시간이 남거든요. 계란말이를 네 번 말았어요. 세 번은 망했고요.' 오진우가 넥타이를 풀며 오고, 도윤하는 지점 마감을 끝내고 택시에서 내립니다. 단체방 메시지는 그사이 312개가 쌓였습니다. 강태민이 편의점에서 컵라면 물을 받아 오고, 권도현은 도시락 원가를 계산하다 한서윤에게 젓가락을 빼앗깁니다. 이민서가 계란말이를 먹다가 웁니다. 맛있어서라고 합니다. 한서윤이 당신 몫의 뚜껑을 열며 묻습니다. '마지막 조사, 몇 시예요?'", ["한서윤의 도시락 5개 -- 계란말이 네 번째 성공작", "단체방 메시지 312개", "마지막 조사 23시"], ["도시락을 다 먹을 때까지 조사 얘기는 꺼내지 않는다", "여섯 명이 오늘 겪은 일을 시간순으로 한 장에 적어 둔다", "도시락은 들고 들어가 조사를 빨리 끝내고 나온다"]],
  ],
  connectiveOrder: [["c32_boxes", "c32_dock"], ["c32_room", "c32_invoice"], ["c32_notebook", "c32_bento"]],
  choiceEffects: {
    c32_boxes: [
      { trust: 11, legitimacy: 4, humanCost: -4, time: -5, capital: -2, fatigue: 5 },
      { legitimacy: 9, trust: 2, time: -3, humanCost: 2, fatigue: 3 },
      { time: 6, capital: 4, trust: 2, humanCost: 3, fatigue: -4 },
    ],
    c32_room: [
      { trust: 10, legitimacy: 3, humanCost: -3, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -3, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 5, legitimacy: -5, trust: -2, humanCost: 3, fatigue: -4 },
    ],
    c32_notebook: [
      { trust: 11, humanCost: -5, capital: -3, time: -4, fatigue: -2 },
      { legitimacy: 9, trust: 4, time: -4, humanCost: 2, fatigue: 2 },
      { time: 5, capital: 4, trust: 3, humanCost: 2, legitimacy: -3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c32_boxes: {
      voice: ["강태민이 옆에서, 번호 맞추는 걸 돕게 해 달라고 부탁한다.", "27번 상자가 빠졌다는 사실을, 기록으로 남겨 달라고 한다.", "번호는 수사관 몫이라며, 강태민을 데리고 하역장을 나온다."],
      echo: ["진태윤가 잠깐 고민하다 목록 한 장을 건넵니다. 강태민은 증거물에 손을 대지 않고 눈으로만 58개를 세고, 한 번도 틀리지 않습니다.", "기록에는 '27번 상자 미확인'이라는 한 줄이 들어갑니다. 그 줄을 쓴 시각이 11시 52분이라는 것도 함께 남습니다.", "하역장을 나오며 강태민이 한 번 돌아봅니다. 26번 상자 두 개는 그대로 트럭에 실리고, 빈자리는 아무도 세지 않습니다."],
    },
    c32_room: {
      voice: ["권도현에게, 나에 관한 질문에는 아는 그대로만 답해 달라고 한다.", "질문지는 그의 것이라며, 읽지 않고 돌려준다.", "열여덟 개 질문에 맞춰, 내 답을 미리 정리해 둔다."],
      echo: ["권도현이 세로줄 오른쪽에 한 줄을 적습니다. '아는 그대로: 비용 0원.' 그가 그 줄에 동그라미를 칩니다.", "돌려받은 질문지를 권도현이 반으로 접습니다. '증인끼리 말 맞췄다는 소리는 안 듣겠네요. 계산서로는 손해인데, 장부로는 이익입니다.'", "답은 매끄러워집니다. 너무 매끄러운 답은 나은호가 가장 먼저 의심하는 종류입니다."],
    },
    c32_notebook: {
      voice: ["도시락을 다 먹을 때까지, 조사 얘기는 꺼내지 않는다.", "여섯 명이 오늘 겪은 일을, 시간순으로 한 장에 적어 둔다.", "도시락은 들고 들어가, 조사를 빨리 끝내고 나온다."],
      echo: ["도시락이 비는 동안 아무도 검찰 얘기를 하지 않습니다. 오진우가 계란말이 성공작과 실패작을 맛으로 구별하겠다고 나섰다가 세 번 다 틀립니다.", "한 장에 적으니 오늘이 한눈에 보입니다. 7시 40분부터 22시 40분까지, 여섯 명 모두 한 번씩은 누군가를 대신해 불려 갔습니다.", "도시락은 조사실 책상 위에서 식습니다. 나은호가 계란말이를 한 번 쳐다보고, 조사는 예정보다 20분 일찍 끝납니다."],
    },
  },
  reactionScenes: [
    ["c32_dock_reaction", "c32_dock", "c32_room", "상하차 동기", "진태윤", "진태윤가 트럭 문을 닫고 강태민에게 캔커피를 내밉니다. '저도 대학 때 택배 상하차를 3년 했습니다. 번호 틀리면 새벽에 반장한테 혼났죠.' 강태민이 '그 반장이 나였으면 안 혼냈어요'라고 하자 둘이 잠깐 웃습니다. 진태윤가 목소리를 낮춥니다. '27번은 33층 반출 기록에 있습니다. 이틀 전 저녁 6시, 그룹 법무팀 이름으로 나갔어요. 우리가 오는 날을 누가 알았다는 뜻이죠.' 그가 당신을 봅니다. '검사님께는 제가 보고합니다. 다만 선생님이 먼저 아셨다는 기록이 남으면, 그게 좋을지 나쁠지는 저도 모르겠네요.'", ["번호를 찾아낸 강태민의 이름은 보고서에서 빼 달라고 한다", "33층 반출 기록 사본을 공식 증거로 요청한다", "27번 상자는 모른 척하고 오후 조사에만 집중한다"]],
    ["c32_invoice_reaction", "c32_invoice", "c32_notebook", "빗나간 은박지", "나은호", "나은호가 복도로 나와 둘을 봅니다. 손에는 김밥 은박지가 공처럼 뭉쳐 있습니다. '증언하러 온 두 분이 복도에서 질문지를 돌려 보시면, 제가 조서에 뭐라고 적어야 할까요.' 그가 은박지를 쓰레기통에 던지고, 빗나갑니다. 줍지 않습니다. '솔직하게 말할게요. 저는 반대 의견 쓴 사람 별로 안 좋아해요. 다들 쓰고 나서 지하로 내려가 3년을 가만히 있거든요. 그 3년 동안 윤상혁 같은 사람은 상자를 비우고요.' 그가 권도현의 종이를 턱으로 가리킵니다. '저 흑자 계산, 맞아요. 근데 그 흑자는 누가 기소(죄가 있다고 보고 재판에 넘기는 것)되느냐에 달렸죠.'", ["3년 동안 가만히 있지 않았다고 동료들 이름을 대며 말한다", "복도에서 나눈 말을 그대로 조서에 적어 달라고 한다", "대꾸하지 않고 은박지를 주워 버린 뒤 다음 조사 시각만 묻는다"]],
    ["c32_bento_reaction", "c32_bento", "c32_final", "통장에 그대로", "도윤하", "도시락을 치우다 도윤하가 휴대폰을 보여 줍니다. 내일 오전 10시, 그도 증언하러 나오라는 문자입니다. 3년 전 창구에서 그 대출을 판 사람이니까요. '웃기죠. 그 대출 팔고 받은 성과급, 아직 통장에 그대로 있어요. 쓰지를 못해서요.' 그가 빈 도시락 뚜껑을 닫습니다. '내일 물어보면 그대로 말할 거예요. 그럼 상자에 제 이름이 하나 더 들어가겠죠. 괜찮아요. 거기 제 이름이 없는 게 더 이상하잖아요.' 횡단보도 신호가 바뀌고, 한서윤이 도윤하의 등을 한 번 쓸어 줍니다.", ["내일 아침 도윤하와 함께 검찰청까지 가겠다고 한다", "성과급 명세를 도윤하의 진술 자료로 같이 정리한다", "도윤하의 일은 도윤하에게 맡기고 오늘 밤 조사에 집중한다"]],
  ],
  reactionEffects: {
    c32_dock: [
      { trust: 9, humanCost: -4, time: -5, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, capital: -3, time: -3, fatigue: 3 },
      { time: 5, capital: 4, trust: -2, humanCost: 3, legitimacy: -2, fatigue: -3 },
    ],
    c32_invoice: [
      { trust: 10, humanCost: -4, legitimacy: -2, time: -3, fatigue: 5 },
      { legitimacy: 11, trust: 2, capital: -4, time: -3, fatigue: 3 },
      { time: 5, capital: 2, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c32_bento: [
      { trust: 11, humanCost: -4, capital: -3, time: -5, fatigue: 6 },
      { legitimacy: 10, trust: 4, time: -4, humanCost: -2, fatigue: 3 },
      { time: 5, capital: 3, trust: 2, humanCost: 3, legitimacy: -2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c32_dock: {
      voice: ["번호를 찾아낸 강태민의 이름은, 보고서에서 빼 달라고 한다.", "33층 반출 기록 사본을, 공식 증거로 요청한다.", "27번 상자는 모른 척하고, 오후 조사에만 집중한다."],
      echo: ["진태윤가 고개를 끄덕입니다. 보고서에는 '현장 확인 중 발견'이라고만 적히고, 강태민은 캔커피 값을 내겠다고 우깁니다.", "요청은 공문으로 남습니다. 그룹 법무팀은 오후 3시에 '반출은 정상적인 문서 정리'라는 답을 보내옵니다.", "모른 척한 상자는 오후 내내 머릿속에서 굴러다닙니다. 진태윤의 보고서에는 당신이 옆에 있었다는 줄만 남습니다."],
    },
    c32_invoice: {
      voice: ["3년 동안 가만히 있지 않았다고, 동료들 이름을 대며 말한다.", "복도에서 나눈 말을, 그대로 조서에 적어 달라고 한다.", "대꾸하지 않고 은박지를 주워 버린 뒤, 다음 조사 시각만 묻는다."],
      echo: ["이름을 하나씩 대자 나은호가 처음으로 받아 적습니다. 도윤하, 이민서, 반재욱, 강태민. '많네요. 그 사람들 상자도 저한테 다 있습니다.'", "나은호가 잠깐 멈췄다가 웃습니다. '좋아요, 적죠. 제 말이 무례했다는 것도 같이 적을까요?' 그는 정말로 적습니다.", "은박지를 주워 쓰레기통에 넣자 나은호가 한쪽 눈썹을 올립니다. '다음 조사는 20분 뒤입니다. 그리고 고마워요.'"],
    },
    c32_bento: {
      voice: ["내일 아침, 도윤하와 함께 검찰청까지 가겠다고 한다.", "성과급 명세를, 도윤하의 진술 자료로 같이 정리한다.", "도윤하의 일은 도윤하에게 맡기고, 오늘 밤 조사에 집중한다."],
      echo: ["같이 가겠다고 하자 도윤하가 '그럼 아침은 제가 살게요'라고 합니다. 그 성과급으로는 아니라고 덧붙입니다.", "명세를 정리하니 3년 치 숫자가 한 장이 됩니다. 도윤하는 그 종이를 내일 조사실 책상 위에 제일 먼저 올리겠다고 합니다.", "도윤하가 고개를 끄덕입니다. '맞아요, 제 일이에요.' 그가 먼저 택시를 잡습니다. 뒷모습이 오늘따라 작아 보입니다."],
    },
  },
  reactionMemos: {
    c32_dock_reaction: ["27번 상자: 이틀 전 18시 법무팀 반출", "압수 날짜를 미리 안 사람이 있다"],
    c32_invoice_reaction: ["나은호: '반대 의견 쓴 사람, 별로 안 좋아해요'", "흑자는 누가 재판에 넘겨지느냐에 달렸다"],
    c32_bento_reaction: ["도윤하 참고인 출석: 내일 10시", "3년째 손대지 않은 성과급"],
  },
  branchPlan: ["c32_room", 1, "c32_branch_waiting", "c32_branch_waiting_follow"],
  branchScenes: {
    // CASE 32's detour is the waiting room. The interrogation asks who wrote
    // the analyst's name; the side door is the colleague whose name the record
    // is about to write for her, the way it did three years ago.
    c32_branch_waiting: {
      phase: "SIDE DOOR",
      title: "대기실의 이민서",
      speaker: "이민서",
      text: "휴식 시간, 복도 끝 대기실에 이민서가 앉아 있습니다. KD데이터랩에 남아 있던 트리거랩 기록 사본 때문에 그도 증언하러 불려 왔습니다. 무릎 위의 출석 요구서가 구겨져 있습니다. '아까 수사관님이 물었어요. 기록 보관 담당이 누구였냐고요. 저였잖아요.' 그가 웃으려다 맙니다. '3년 전에도 기록이 저를 가리켰어요. 사라진 11초요. 그때는 계약직이라 정리하기 쉬웠고요.' 벽시계 분침이 한 칸 넘어갑니다. 이민서의 차례까지 20분 남았습니다.",
      memo: ["이민서 출석 사유: KD데이터랩의 트리거랩 기록 사본", "수사관 질문: '기록 보관 담당자는 누구였나'", "사건 02 '사라진 11초' 이후 3년", "이민서 조사까지 20분"],
      triggers: ["protection", "fear", "trust"],
      choices: [
        { id: "c32_branch_waiting_a", label: "이민서 조사에 같이 들어갈 수 있는지 검사에게 묻는다", effect: { trust: 12, legitimacy: 3, capital: -5, time: -6, fatigue: 5 }, next: "c32_branch_waiting_follow", cognition: { reframing: 2 } },
        { id: "c32_branch_waiting_b", label: "기록 보관 권한표를 찾아 누가 담당이었는지 증명한다", effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 2, fatigue: 4 }, next: "c32_branch_waiting_follow", cognition: { inference: 2 } },
        { id: "c32_branch_waiting_c", label: "각자 조사는 각자 받는 거라며 20분을 쉬게 둔다", effect: { time: 5, capital: 5, trust: -5, humanCost: 4, fatigue: -3 }, next: "c32_branch_waiting_follow", cognition: { risk: 1 } },
      ],
    },
    c32_branch_waiting_follow: {
      phase: "SIDE DOOR",
      title: "조서의 한 문장",
      speaker: "이민서",
      text: "40분 뒤 이민서가 나옵니다. 손에 진술조서(조사에서 한 말을 수사기관이 받아 적은 문서) 사본이 들려 있습니다. 서명하기 전에 읽어 보라고 줬답니다. 셋째 쪽에 한 문장이 있습니다. '진술인은 트리거랩 반응 기록을 임의로 복사해 보관하였다.' 이민서는 그렇게 말한 적이 없습니다. 복사는 인사부 지시였고, 지시 메일도 남아 있습니다. 문장을 고치려면 조사를 처음부터 다시 받아야 하고, 그러면 밤 열 시가 넘습니다. 이민서가 볼펜을 쥔 채 당신을 봅니다. '그냥 서명할까요? 엄마가 저녁 차려 놓고 기다린대요.'",
      memo: ["조서 3쪽: '임의로 복사해 보관하였다'", "실제: 인사부 지시 메일로 복사", "고쳐 받으면 22시 이후 종료", "이민서 어머니의 저녁 -- 19시"],
      triggers: ["injustice", "protection", "order"],
      choices: [
        { id: "c32_branch_waiting_follow_a", label: "밤이 늦어져도 그 문장을 고칠 때까지 옆에 있는다", effect: { trust: 13, legitimacy: 4, humanCost: -4, capital: -6, time: -6, fatigue: 6 }, next: "c32_invoice", cognition: { persistence: 2 } },
        { id: "c32_branch_waiting_follow_b", label: "인사부 지시 메일을 조서 첨부로 붙이게 한다", effect: { legitimacy: 12, trust: 4, time: -5, humanCost: -2, fatigue: 4 }, next: "c32_invoice", cognition: { inference: 2 } },
        { id: "c32_branch_waiting_follow_c", label: "오늘은 서명하고 문장은 나중에 의견서로 고친다", effect: { time: 6, capital: 5, trust: -5, humanCost: 4, fatigue: -2 }, next: "c32_invoice", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c32_start",
    result: "c32_aftershock",
    defaultFree: "c32_route_system",
    // One raid, one day. Like the cases before it the case is a single line;
    // the split is whose name the boxes end up holding.
    choices: {},
    system: {
      route: "c32_route_system",
      final: "c32_final_system_route",
      title: "상자 속 이름의 통계",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 위험관리부 단말의 노아가 지난 10년 금융회사 압수수색(법원의 허락을 받아 자료를 강제로 거둬 가는 수사) 사건 64건의 판결문을 엽니다. 재판에 넘겨진 사람 208명 가운데 실무자가 167명, 임원이 29명, 최종 결정권자는 12명입니다. 결정권자가 기소(죄가 있다고 보고 재판에 넘기는 것)된 12건은 모두 그 사람의 서명이 상자에서 나온 사건이었습니다. '상자에 이름이 많이 나오는 사람이 재판에 넘겨지는 것으로 학습되어 있습니다. 서명란을 비워 둔 사람은 상자에 이름이 없습니다.'",
      memo: ["압수수색 사건 64건 -- 재판에 넘겨진 208명", "실무자 167명, 임원 29명, 결정권자 12명", "결정권자 12건 모두 서명이 상자에서 나옴"],
      routeChoices: [
        ["c32_route_system_publish", "판결문 통계를 나은호 검사에게 의견서로 낸다", { legitimacy: 11, trust: 5, capital: -5, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c32_route_system_warn", "상자에 이름이 많은 실무자 동료들에게 먼저 알린다", { trust: 10, legitimacy: 3, humanCost: -4, capital: -3, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c32_route_system_drop", "통계는 덮고 오늘 조사 일정대로 간다", { time: 7, capital: 7, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "결정한 사람의 서명 흔적부터 찾도록 수사 순서를 바꾸자고 한다", { legitimacy: 12, trust: 7, capital: -7, humanCost: -4, fatigue: 8 }, { reframing: 3 }],
      ["b", "실무자 동료들의 처벌만 낮춰 주는 협조를 약속한다", { capital: 8, time: 6, trust: -5, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "이름이 많은 실무자들을 위한 변호 기금을 같이 모은다", { legitimacy: 7, trust: 10, capital: -8, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c32_evidence_turn",
    result: "c32_aftershock",
    sourceRoutes: ["c32_boxes", "c32_room", "c32_notebook", "c32_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 33층 문서 반출 기록 옆에 놓고, 27번 상자가 언제 누구 이름으로 나갔는지 맞춰 본다.",
    entryEcho: "단서를 대면 상자가 나간 시각이 보입니다. 그 시각 바로 전에 걸려 온 전화 한 통도 함께 보입니다.",
    title: "27번 상자의 행방",
    speaker: "반재욱",
    text: "단서를 맞추자 33층 문서 반출 기록과 오늘의 압수 목록이 한 화면에 겹칩니다. 27번 상자는 이틀 전 18시 4분에 나갔습니다. 반출 신청자는 그룹 법무팀, 승인자 칸은 비어 있습니다. 상자 겉면에 적힌 내용물은 '트리거랩 설계 문서 원본 및 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 전달 확인서'입니다. 반출 12분 전, 33층 대표 번호로 4분짜리 전화가 한 통 걸려 왔습니다. 발신지는 서초동입니다. 반재욱이 수첩을 덮습니다. '상자를 빼 간 사람은 알고 있었습니다. 우리가 언제 오는지요. 그리고 또 승인자 칸이 비었군요.'",
    memo: ["27번 상자 반출: 이틀 전 18:04, 신청 그룹 법무팀", "승인자 칸: 빈칸", "반출 12분 전, 서초동발 4분 통화"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 2, time: -4, capital: -2, fatigue: 5 },
    choices: [
      ["c32_evidence_turn_hand", "반출 기록을 오늘 밤 나은호 검사에게 그대로 넘긴다", { legitimacy: 13, trust: 5, capital: -7, time: -6, fatigue: 7 }, { inference: 2, persistence: 1 }],
      ["c32_evidence_turn_hold", "반출 기록은 쥐고 있다가 신분이 정해질 때 꺼낸다", { capital: 8, time: 4, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c32_evidence_turn_share", "27번 상자에 기록이 든 동료들에게 먼저 알린다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 9 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c32_branch_waiting",
    systemNext: "c32_route_system",
    evidenceNext: "c32_evidence_turn",
    routeLabel: "직전 사건에서 밤을 같이 새운 동료들에게 오늘 조사 일정을 먼저 돌린다",
    systemLabel: "직전 자유응답 문장이 압수 목록의 분류 기준에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 33층 문서 반출 기록을 연다",
  },
  openingRoutes: {
    c31_after_warm: "c32_start_warm",
    c31_after_record: "c32_start_record",
    c31_after_rush: "c32_start_rush",
  },
  openingCopy: {
    c32_start_warm: ["도시락을 비운 사람들의 압수수색", "오진우", "검사팀이 떠난 그 밤, 헌책방 1층에서 여섯 명과 최서진이 한서윤의 도시락 일곱 개를 남김없이 비웠습니다. 나흘 뒤 6월 16일 아침 7시 40분, 그 일곱 명의 단체방이 먼저 울립니다. 오진우가 보낸 속보 링크입니다. '서울중앙지검, KD금융그룹 33층과 KD캐피탈 압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사).' 한지우가 말한 '다음 주의 상자'입니다. 12층에 닿자 위험관리부 문 앞에 파란 조끼들이 서 있고, 나은호 검사가 당신 이름을 부릅니다. '오후 두 시, 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 오세요.' 단체방에는 '괜찮아?'가 여섯 개 쌓여 있습니다. 최서진의 것이 제일 먼저입니다.", ["압수수색 장소 3곳: 33층, KD캐피탈 대표이사실, 위험관리부", "단체방 '괜찮아?' 6개 -- 최서진이 1번", "참고인 출석 요구: 오늘 14시"]],
    c32_start_record: ["기록을 묶은 사람의 압수수색", "반재욱", "검사 닷새의 질문과 답을 날짜순으로 묶은 당신의 기록 한 권은, 한지우가 검찰에 보낸 통보서 뒤에 그대로 붙었습니다. 나흘 뒤 6월 16일 아침 7시 40분, 그 기록을 든 수사관들이 KD캐피탈 12층으로 들어옵니다. 서울중앙지검의 압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사)입니다. 나은호 검사가 당신의 기록을 흔들어 보입니다. '정리 잘하셨더라고요. 너무 잘하셔서, 이걸 어떻게 다 알았는지부터 여쭤봐야겠어요. 오후 두 시, 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 오세요.' 표지의 작성자 칸에 당신 이름이 인쇄돼 있습니다.", ["검찰 통보서 첨부: 당신이 묶은 검사 닷새 기록", "기록 표지 작성자 칸: 당신 이름", "참고인 출석 요구: 오늘 14시"]],
    c32_start_rush: ["먼저 내려간 사람의 압수수색", "이민서", "검사팀이 떠난 그 밤, 당신은 상자가 오기 전에 지하 자료실로 내려가 평택 현장 원본 상자를 먼저 챙겼습니다. 출입 기록 맨 위에는 또 당신 이름이 찍혔습니다. 나흘 뒤 6월 16일 아침 7시 40분, 서울중앙지검의 압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사)이 시작되고, 수사관이 제일 먼저 뽑아 드는 것이 그 출입 기록입니다. 나은호 검사가 당신 이름에 손가락을 올립니다. '원본 상자를 옮기신 분이죠? 증거를 지킨 건지 치운 건지, 설명해 주실 수 있죠? 오후 두 시, 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 오세요. 아마 길어질 겁니다.'", ["지하 자료실 출입 기록 맨 위: 당신 이름", "평택 현장 원본 상자 -- 지금 당신 책상 밑", "참고인 출석 요구: 오늘 14시"]],
  },
  openingSignatures: {
    c32_start_warm: {
      label: "단체방 여섯 명에게 오늘 각자 맡을 일을 나눠 준다",
      effect: { trust: 11, humanCost: -4, capital: -4, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "단체방 여섯 명에게, 오늘 각자 맡을 일을 나눠 준다.",
      echo: "나누면 답이 30초 만에 여섯 개 옵니다. 이민서는 변호사 번호를, 강태민은 '하역장으로 갑니다'를 보냅니다. 무엇을 나를지는 아직 아무도 모릅니다.",
    },
    c32_start_record: {
      label: "기록 한 권을 어떻게 묶었는지 작성 경위를 서면으로 먼저 낸다",
      effect: { legitimacy: 12, trust: -2, capital: -5, time: -5, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "기록 한 권을 어떻게 묶었는지, 작성 경위를 서면으로 먼저 낸다.",
      echo: "서면은 나은호의 책상에 제일 먼저 올라갑니다. 그가 읽고 나서 말합니다. '좋네요. 이제 질문이 두 배로 늘었습니다.'",
    },
    c32_start_rush: {
      label: "책상 밑의 평택 원본 상자를 수사관에게 먼저 내놓는다",
      effect: { trust: 12, legitimacy: 4, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "책상 밑의 평택 원본 상자를, 수사관에게 먼저 내놓는다.",
      echo: "먼저 내놓자 나은호가 상자보다 당신 얼굴을 오래 봅니다. '치운 사람은 이렇게 안 하죠.' 그래도 출입 기록은 증거물 번호를 받습니다.",
    },
  },
  voiceLines: {
    // CASE 32. A raid day. Every line is said with an investigator in the room,
    // so none of them is allowed to sound like it is performing for one.
    c32_start_calm: "겁먹은 팀원들에게, 무엇을 거절할 수 있는지부터 알려 준다.",
    c32_start_list: "압수 목록을 한 줄씩 확인한 뒤에만, 서명하겠다고 한다.",
    c32_start_hand: "휴대폰을 순순히 넘기고, 오후 조사 준비부터 한다.",
    c32_boxes_seal: "동료들의 기록 상자는, 따로 봉인해 달라고 요청한다.",
    c32_boxes_match: "압수 상자와 트리거랩 원래 목록을, 한 칸씩 맞춰 본다.",
    c32_boxes_mine: "내 이름 상자부터 먼저 넘겨, 수사를 빨리 돌린다.",
    c32_room_plain: "동료 이름은 빼 달라고 하고, 내 행적만 숨김없이 말한다.",
    c32_room_counsel: "변호사 입회와, 참고인 신분 확인서부터 요구한다.",
    c32_room_alibi: "싱가포르 출국 기록부터 내밀어, 서명 의혹을 빨리 끊는다.",
    c32_branch_waiting_a: "이민서 조사에 같이 들어갈 수 있는지, 검사에게 묻는다.",
    c32_branch_waiting_b: "기록 보관 권한표를 찾아, 누가 담당이었는지 증명한다.",
    c32_branch_waiting_c: "각자 조사는 각자 받는 거라며, 20분을 쉬게 둔다.",
    c32_branch_waiting_follow_a: "밤이 늦어져도, 그 문장을 고칠 때까지 옆에 있는다.",
    c32_branch_waiting_follow_b: "인사부 지시 메일을, 조서 첨부로 붙이게 한다.",
    c32_branch_waiting_follow_c: "오늘은 서명하고, 문장은 나중에 의견서로 고친다.",
    c32_notebook_seoa: "수첩을 내기 전에, 서아에게 같이 가서 사정을 말해 준다.",
    c32_notebook_copy: "수첩 전 쪽을 사본으로 떠 두고, 원본은 요구대로 낸다.",
    c32_notebook_later: "내 이름이 적힌 뒷장 얘기는 미루고, 제출부터 끝낸다.",
    c32_final_shield: "동료들의 기록을 닫는 조건으로, 내가 아는 전부를 진술한다.",
    c32_final_stand: "내 이름이 쓰인 검토서부터, 수사 대상으로 조사받겠다고 한다.",
    c32_final_trade: "윤상혁에 관한 진술만, 오늘 밤 먼저 넘긴다.",
    c32_after_warm: "빈 책상들을, 동료들과 끝까지 제자리로 돌려놓는다.",
    c32_after_record: "압수 목록 312줄을 한 줄씩 대조해, 사본 목록으로 남긴다.",
    c32_after_rush: "날이 밝는 대로, 곧장 나은호 검사를 찾아간다.",
    c32_route_system_publish: "판결문 통계를, 나은호 검사에게 의견서로 낸다.",
    c32_route_system_warn: "상자에 이름이 많은 실무자 동료들에게, 먼저 알린다.",
    c32_route_system_drop: "통계는 덮고, 오늘 조사 일정대로 간다.",
    c32_final_system_route_a: "결정한 사람의 서명 흔적부터 찾도록, 수사 순서를 바꾸자고 한다.",
    c32_final_system_route_b: "실무자 동료들의 처벌만 낮춰 주는, 협조를 약속한다.",
    c32_final_system_route_c: "이름이 많은 실무자들을 위해, 변호 기금을 같이 모은다.",
    c32_evidence_turn_hand: "반출 기록을, 오늘 밤 나은호 검사에게 그대로 넘긴다.",
    c32_evidence_turn_hold: "반출 기록은 쥐고 있다가, 신분이 정해질 때 꺼낸다.",
    c32_evidence_turn_share: "27번 상자에 기록이 든 동료들에게, 먼저 알린다.",
  },
  echoReplies: {
    // CASE 32.
    c32_start_calm: "알려 주면 팀원들의 손 떨림이 조금 멎습니다. 그사이 수사관들은 당신 책상 서랍 세 칸을 먼저 비웁니다.",
    c32_start_list: "한 줄씩 확인하면 목록의 오타 두 개가 고쳐집니다. 한 시간이 걸리고, 그동안 팀원들은 복도에 선 채 기다립니다.",
    c32_start_hand: "넘기면 일은 빨리 끝납니다. 휴대폰 안의 단체방 대화도 함께 상자에 들어갑니다.",
    c32_boxes_seal: "따로 봉인하면 동료들의 상자에 빨간 테이프가 한 줄 더 감깁니다. 나은호는 '그 사람들도 결국 볼 겁니다'라고만 합니다.",
    c32_boxes_match: "맞춰 보면 원래 목록은 마흔한 개입니다. 복도에는 마흔 개가 있습니다.",
    c32_boxes_mine: "당신 상자가 제일 먼저 트럭으로 갑니다. 1,106쪽이 첫 번째 증거물 번호를 받습니다.",
    c32_room_plain: "숨김없이 말하면 나은호가 김밥을 내려놓습니다. 동료 이름을 빼 달라는 부탁에는 '그건 제가 정합니다'라고 답합니다.",
    c32_room_counsel: "요구하면 조사가 40분 멈춥니다. 확인서에는 '참고인'이라고 적히지만, 질문지 제목은 바뀌지 않습니다.",
    c32_room_alibi: "출국 기록은 당신이 그날 서울에 없었다는 걸 증명합니다. 누가 당신 이름을 썼는지는 증명하지 않습니다.",
    c32_branch_waiting_a: "묻자 나은호가 '안 됩니다'라고 합니다. 대신 대기실 문을 열어 두라고 수사관에게 말합니다.",
    c32_branch_waiting_b: "권한표를 찾으면 보관 담당 칸에 이민서 위로 결정자 이름이 하나 더 있습니다. 찾는 데 한 시간이 듭니다.",
    c32_branch_waiting_c: "20분 동안 이민서는 자판기 커피를 두 잔 뽑고 한 잔도 마시지 않습니다.",
    c32_branch_waiting_follow_a: "옆에 있으면 조서는 밤 10시 20분에 다시 쓰입니다. 이민서 어머니의 저녁은 식고, 문장은 고쳐집니다.",
    c32_branch_waiting_follow_b: "메일이 붙으면 '임의로'라는 말이 빠집니다. 수사관은 첨부 목록에 번호를 하나 더 매깁니다.",
    c32_branch_waiting_follow_c: "서명하면 이민서는 저녁 시간에 맞춰 집에 갑니다. 셋째 쪽의 문장은 오늘부터 공식 기록입니다.",
    c32_notebook_seoa: "가서 말하면 서아가 한참 생각하다 묻습니다. '그럼 스티커도 재판 가?' 반재욱이 처음으로 웃습니다.",
    c32_notebook_copy: "사본을 뜨면 47개의 이름과 스티커 열세 개가 복사기 유리 위를 지나갑니다. 원본은 증거물 봉투로 들어갑니다.",
    c32_notebook_later: "제출은 빨리 끝납니다. 연필로 쓴 당신 이름은 설명 없이 수사 기록의 한 쪽이 됩니다.",
    c32_final_shield: "전부 말하면 동료들의 상자는 닫힙니다. 대신 당신의 진술이 그들 모두의 이야기를 대신합니다.",
    c32_final_stand: "수사 대상이 되면 몇 달 동안 당신 이름 뒤에 한 단어가 붙습니다. 대신 누가 그 서명을 했는지 찾는 일이 수사가 됩니다.",
    c32_final_trade: "먼저 넘기면 윤상혁 쪽 수사가 빨라집니다. 당신의 나머지 이름들은 나중이라는 칸에 남습니다.",
    c32_after_warm: "책상 스물세 개가 새벽 3시에 제자리로 돌아갑니다. 백아린이 세운 의자 열두 개만은 아무도 건드리지 않습니다.",
    c32_after_record: "대조하면 312줄 가운데 빈칸이 하나 더 나옵니다. 27번 상자 말고, 목록에 이름조차 없는 서류 하나입니다.",
    c32_after_rush: "책상 정리는 동료들에게 맡겨집니다. 아침 9시, 나은호는 당신 얼굴을 보자마자 질문 대신 이름 하나를 묻습니다.",
    c32_route_system_publish: "의견서를 내면 나은호가 한 줄에 밑줄을 긋습니다. '결정권자 12명.' 그가 '적네요'라고만 합니다.",
    c32_route_system_warn: "알리면 실무자 동료들이 변호사를 알아봅니다. 몇 명은 알리지 말지 그랬냐고 묻습니다.",
    c32_route_system_drop: "통계는 단말 안에 남습니다. 오늘 상자에 들어간 이름들은 그 통계대로 움직입니다.",
    c32_final_system_route_a: "순서를 바꾸자는 제안은 조서에 적힙니다. 받아들일지는 나은호가 아니라 그 위의 사람이 정합니다.",
    c32_final_system_route_b: "처벌이 낮아지면 동료들은 안도합니다. 결정한 사람의 상자는 여전히 비어 있습니다.",
    c32_final_system_route_c: "기금이 생기면 실무자들이 혼자 법정에 서지 않습니다. 첫 달 모금액은 떡값 수준입니다.",
    c32_evidence_turn_hand: "넘기면 나은호가 새벽 1시에 답장을 보냅니다. '서초동 번호, 우리도 봅니다.' 그 번호가 누구의 것인지는 아직 말하지 않습니다.",
    c32_evidence_turn_hold: "쥐고 있으면 카드가 됩니다. 그 카드를 쥔 사람이 누구인지도 곧 드러납니다.",
    c32_evidence_turn_share: "알리면 동료들이 자기 기록이 어디 있는지 처음으로 압니다. 그 밤, 단체방에서 몇 명은 오래 말이 없습니다.",
  },
  characterProfiles: {
    나은호: {
      role: "서울중앙지검 반부패수사부 검사 · 17년차",
      stance: "속도 · 증거 · 무례한 솔직함",
      job: "분석관을 증언하는 사람과 수사 대상 사이에 세워 둔다. 상자에 이름이 많은 사람부터 묻는다.",
      appearance: "소매를 걷은 흰 셔츠, 주머니에 구겨 넣은 넥타이, 은박지째 들고 다니는 김밥 한 줄.",
      thought: "반대 의견을 쓰고 가만히 있던 사람과 서명란을 비운 사람은 둘 다 상자에 흔적이 적다. 나는 그 차이를 증명해야 한다.",
      gesture: "나은호는 질문하기 전에 손가락을 하나씩 편다. 다 펴기 전에 대답하면 처음부터 다시 편다.",
      voice: "빠르고 짧게, 돌려 말하지 않는다. 무례했다는 걸 알면 그 말도 조서에 같이 적는다.",
      line: "참고인이라고 했습니다. 지금은요.",
    },
    진태윤: {
      role: "서울중앙지검 수사관 · 압수물 담당",
      stance: "원칙 · 번호 · 뜻밖의 동료애",
      job: "상자마다 번호를 붙이고, 번호가 틀리면 누구보다 먼저 얼굴이 굳는다.",
      appearance: "파란 조끼, 목장갑 두 켤레, 볼펜 대신 쓰는 굵은 유성 매직.",
      thought: "상자 하나가 비면 누군가 그걸 먼저 들고 나갔다는 뜻이다.",
      gesture: "진태윤는 대답 대신 목록 한 장을 넘기고, 틀린 칸에 매직으로 동그라미를 친다.",
      voice: "딱딱한 존댓말로 말하다가, 상하차 얘기가 나오면 말이 빨라진다.",
      line: "선생님, 그거 증거물입니다. 손 떼세요.",
    },
  },
  setting: { place: "KD캐피탈 12층 · 위험관리부 사무실", clock: "6월 16일 화요일 · 07:40" },
  sceneContext: {
    c32_start: {
      place: "KD캐피탈 12층 · 위험관리부 사무실",
      clock: "6월 16일 화요일 · 07:40",
      question: "수사관들이 책상을 봉인하고, 검사가 오후에 증언하러 오라고 합니다. 무엇부터 하겠습니까?",
      lead: "출근 카드를 찍고 12층에 내리자, 엘리베이터 앞에 접힌 빈 상자 60개가 쌓여 있습니다.",
    },
    c32_start_warm: {
      place: "KD캐피탈 12층 · 위험관리부 사무실",
      clock: "6월 16일 화요일 · 07:40",
      question: "도시락을 같이 비운 여섯 명이 단체방에서 당신 답을 기다립니다. 무엇이라고 답하겠습니까?",
      lead: "헌책방 1층에서 도시락 일곱 개를 비운 그 밤 이후, 단체방은 하루도 조용한 적이 없었습니다.",
    },
    c32_start_record: {
      place: "KD캐피탈 12층 · 위험관리부 사무실",
      clock: "6월 16일 화요일 · 07:40",
      question: "당신이 묶은 기록 한 권이 수사관의 손에 들려 돌아왔습니다. 그 기록을 어떻게 설명하겠습니까?",
      lead: "날짜순으로 묶어 둔 검사 닷새의 기록이 나흘 만에 파란 조끼의 손에 들려 12층으로 돌아옵니다.",
    },
    c32_start_rush: {
      place: "KD캐피탈 12층 · 위험관리부 사무실",
      clock: "6월 16일 화요일 · 07:40",
      question: "자료실 출입 기록 맨 위의 이름이 당신입니다. 옮긴 상자를 어떻게 설명하겠습니까?",
      lead: "그 밤 지하 자료실에서 들고 올라온 상자가 아직 당신 책상 밑에 있습니다.",
    },
    c32_boxes: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "6월 16일 · 10:30",
      question: "사흘 뒤 폐기될 예정이던 상자에서 당신 이름이 제일 많이 나옵니다. 이 상자들을 어떻게 하겠습니까?",
      lead: "나은호가 트리거랩 상자를 알아볼 사람이 필요하다며 당신을 33층 엘리베이터에 태웁니다.",
    },
    c32_dock: {
      place: "KD금융그룹 본사 · 지하 주차장 하역장",
      clock: "6월 16일 · 11:50",
      question: "야간조 반장이 수사관보다 먼저 빠진 상자를 찾았습니다. 이 발견을 어떻게 다루겠습니까?",
    },
    c32_dock_reaction: {
      place: "KD금융그룹 본사 · 지하 주차장 하역장",
      clock: "6월 16일 · 12:05",
      question: "27번 상자는 압수 이틀 전에 법무팀 이름으로 나갔습니다. 먼저 안 사실을 어떻게 하겠습니까?",
    },
    c32_room: {
      place: "서울중앙지검 11층 · 1108호 면담실",
      clock: "6월 16일 · 14:00",
      question: "당신이 없던 날 당신 이름으로 서명된 검토서가 나왔습니다. 어떻게 답하겠습니까?",
      lead: "서초동 청사 11층 복도 끝, 김밥 냄새가 나는 방의 문이 열려 있습니다.",
    },
    c32_branch_waiting: {
      place: "서울중앙지검 11층 · 대기실",
      clock: "6월 16일 · 15:40",
      question: "3년 전처럼 기록이 이민서를 가리키려 합니다. 남은 20분을 어떻게 쓰겠습니까?",
    },
    c32_branch_waiting_follow: {
      place: "서울중앙지검 11층 · 대기실",
      clock: "6월 16일 · 16:40",
      question: "이민서가 하지 않은 말이 조서에 적혀 있고, 집에서는 저녁이 기다립니다. 어떻게 하겠습니까?",
    },
    c32_invoice: {
      place: "서울중앙지검 11층 · 복도",
      clock: "6월 16일 · 17:30",
      question: "권도현의 질문지 스물두 개 중 열여덟 개가 당신에 관한 것입니다. 이 종이를 어떻게 하겠습니까?",
    },
    c32_invoice_reaction: {
      place: "서울중앙지검 11층 · 복도",
      clock: "6월 16일 · 17:45",
      question: "반대 의견 쓴 사람은 3년 동안 가만히 있었다고 검사가 말합니다. 어떻게 받아치겠습니까?",
    },
    c32_notebook: {
      place: "서울중앙지검 앞 · 주차장",
      clock: "6월 16일 · 21:10",
      question: "딸의 스티커가 붙은 수첩이 증거물이 됩니다. 뒷장에는 당신 이름이 있습니다. 어떻게 하겠습니까?",
      lead: "대전에서 두 시간을 달려온 반재욱의 차가 주차장 가로등 아래 서 있습니다.",
    },
    c32_bento: {
      place: "서울중앙지검 앞 · 횡단보도",
      clock: "6월 16일 · 22:40",
      question: "보자기에 싼 도시락 다섯 개가 검찰청 건너편에서 기다립니다. 이 저녁을 어떻게 먹겠습니까?",
    },
    c32_bento_reaction: {
      place: "서울중앙지검 앞 · 횡단보도",
      clock: "6월 16일 · 23:05",
      question: "도윤하가 내일 3년 전 그 대출을 판 사람으로 불려 갑니다. 무엇을 해 주겠습니까?",
    },
    c32_route_system: {
      place: "KD캐피탈 12층 · 위험관리부 단말",
      clock: "6월 16일 · 13:20",
      question: "상자에 이름이 많은 사람이 재판에 넘겨지고, 서명란을 비운 사람은 상자에 없습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c32_final_system_route: {
      place: "KD캐피탈 12층 · 위험관리부 단말",
      clock: "6월 17일 · 00:30",
      question: "수사가 이름을 세는 순서를 바꿀 수 있다면, 무엇부터 세게 하겠습니까?",
    },
    c32_evidence_turn: {
      place: "KD캐피탈 12층 · 빈 위험관리부",
      clock: "6월 17일 · 00:20",
      question: "27번 상자는 누군가 압수 날짜를 알려 준 뒤에 나갔습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c32_final: {
      place: "서울중앙지검 11층 · 복도",
      clock: "6월 16일 · 23:40",
      question: "증언하는 사람으로 남을지, 수사 대상이 될지, 먼저 거래할지 내일 아침까지 정해야 합니다. 어떻게 하겠습니까?",
      lead: "도시락 뚜껑을 닫고 다시 올라간 11층, 마지막 조사가 끝나자 나은호가 넥타이를 주머니에 넣으며 따라 나옵니다.",
    },
    c32_aftershock: {
      place: "KD캐피탈 12층 · 빈 위험관리부",
      clock: "6월 17일 · 00:50",
      question: "백아린이 의자를 세우고 27번 칸이 빈 목록을 두고 갔습니다. 이 새벽을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c32-box-27",
    title: "27번 상자의 행방",
    text: "압수 이틀 전 18시 4분, 트리거랩 설계 문서 원본이 든 27번 상자가 그룹 법무팀 이름으로 33층을 나갔습니다. 승인자 칸은 비어 있었고, 12분 전 서초동에서 전화가 한 통 걸려 왔습니다.",
  },
  outcomes: {
    c32_after_warm: { tag: "끝까지 남은 결말", title: "상자가 빠져나간 책상들을 끝까지 제자리로 돌려놓았다", text: "상자 58개가 실려 간 밤, 동료들은 새벽 3시까지 책상 스물세 개를 제자리로 돌려놓았습니다. 백아린이 세운 의자 열두 개는 그대로 두었습니다." },
    c32_after_record: { tag: "목록을 맞춘 결말", title: "압수 목록 312줄을 한 줄씩 대조해 남겼다", text: "무엇이 실려 갔고 무엇이 실려 가지 않았는지, 312줄의 사본 목록이 남았습니다. 빈칸은 27번 상자 하나가 아니었습니다." },
    c32_after_rush: { tag: "먼저 찾아간 결말", title: "날이 밝자마자 나은호의 검사실 문을 두드렸다", text: "책상 정리는 동료들에게 남기고 당신은 서초동으로 갔습니다. 나은호는 질문 대신 이름 하나를 물었습니다." },
  },
  carryovers: {
    c32_after_warm: { trust: 9, humanCost: -4, fatigue: -8, time: -1 },
    c32_after_record: { legitimacy: 12, trust: 3, fatigue: 4, time: -1 },
    c32_after_rush: { capital: 6, legitimacy: 4, trust: -7, fatigue: 1 },
  },
  continuityChallenges: {
    c31_after_warm: { id: "protect-trust", title: "도시락을 같이 비운 사람들과 함께 버티기", text: "검사가 끝난 밤 헌책방에 모였던 일곱 명이 이번에는 수사관 앞에 섭니다. 혼자 답하지 않고 그 사람들과 하루를 나누는 선택을 찾아야 보너스가 열립니다." },
    c31_after_record: { id: "use-reframe", title: "내가 묶은 기록을 다시 내 편으로", text: "날짜순으로 묶은 검사 기록이 당신을 향한 질문의 근거가 됐습니다. 그 기록이 누구의 흔적을 보여 주는지 판을 다시 짜야 합니다." },
    c31_after_rush: { id: "repair-legitimacy", title: "옮긴 원본 상자의 공정함 회복하기", text: "먼저 챙긴 평택 원본 상자와 출입 기록의 당신 이름이 수사관 손에 있습니다. 지킨 것인지 치운 것인지 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
