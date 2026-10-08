/**
 * CASE 10 -- the authored scenes of the bill that comes after the win.
 *
 * The season's thesis is that a strong feeling aims obsessive thinking rather
 * than clouding it: 사건 08 is the grudge finding a weak point, 사건 09 is
 * affection and responsibility writing two ledgers on one table. Both of those
 * cases end in a victory, and both of them are, taken alone, the exact thing the
 * source conversation refused to believe -- that a person can keep spending
 * themselves on other people's problems and not run out. The objection there was
 * blunt: 멘탈 에너지 소모가 엄청날 텐데 그 선의를 유지한다는 것이 잘 납득이 안
 * 된다, 소설적 허구라는 생각이야.
 *
 * This case is the season agreeing with that objection. Ten days after 플로우온
 * is saved, 도윤하 -- who has carried, alone and off the books, the list of
 * everyone hurt by the loan he sold at a branch counter three years ago --
 * stops being able to stand up. The group files it as a personal matter, and
 * his list, having never been an official record, is due for deletion.
 *
 * So the case does not ask whether goodwill is good. It asks what it costs and
 * who is holding the invoice. A person's obsession is not a renewable resource;
 * a procedure is renewable and does not care. Moving the list from the first to
 * the second keeps it alive and drops everyone the rules were not written for.
 * That trade is the case, and the last scene refuses to resolve it: 도윤하 comes
 * back, opens a new notebook, and starts writing the dropped names down again.
 */
export const case10Nodes = {
  c10_start: {
    phase: "CASE 10 BRIEFING",
    title: "열흘",
    speaker: "한서윤",
    text:
      "플로우온 결의가 끝난 지 열흘입니다. 어제 아침 도윤하가 강서 이음병원 응급실로 실려 갔습니다. 진단은 과로와 탈진, 그리고 3년째 처방받아 온 수면제입니다. 그룹은 이 건을 개인 사정으로 분류했습니다. 한서윤이 병실 문 앞에서 서류를 내밀지 못하고 손에 든 채 말합니다. '이 사람 사물함에서 나온 파일이 있습니다. 공식 문서로 등록된 적이 없어서, 보존연한(기록을 몇 년 보관하고 버릴지 정해 둔 기간)이 0입니다. 나흘 뒤에 자동 폐기됩니다.'",
    memo: [
      "도윤하: 과로·탈진, 수면제 3년치 처방 기록",
      "그룹 분류: 업무 외 개인 사정",
      "사물함 파일은 비공식 기록 -- 보존연한 0일",
      "자동 폐기까지 96시간",
    ],
    triggers: ["affection", "protection", "helplessness"],
    choices: [
      {
        id: "c10_start_file",
        label: "폐기 전에 파일부터 공식 기록으로 올린다",
        effect: { legitimacy: 12, time: -6, trust: -4, fatigue: 3 },
        voice: "나흘 뒤면 없어질 파일이라며, 폐기 전에 공식 기록으로 먼저 올린다.",
        echo: "공식 기록이 되면 나흘 뒤에도 남습니다. 등록이 끝나는 날 조직은 파일 안에 무엇이 있는지 알게 되고, 알게 된 것에 대해 방침을 정합니다.",
        next: "c10_locker",
        cognition: { inference: 2 },
      },
      {
        id: "c10_start_claim",
        label: "도윤하의 산업재해 신청부터 접수한다",
        effect: { trust: 13, humanCost: -7, capital: -6, time: -5, fatigue: 4 },
        voice: "치료비부터 나와야 한다며, 도윤하의 산업재해 신청을 접수한다.",
        echo: "신청이 접수되면 치료비 시계가 돌기 시작합니다. 심사는 그가 얼마나 무리했는지를 묻고, 그 답은 그를 규정 위반자로도 만듭니다.",
        next: "c10_locker",
        cognition: { persistence: 2 },
      },
      {
        id: "c10_start_cover",
        label: "그를 깨우지 않고 업무부터 인수한다",
        effect: { time: 8, capital: 7, trust: -9, humanCost: 6, fatigue: -3 },
        voice: "깨우지 않는 편이 낫다고 판단하고, 그의 업무부터 넘겨받는다.",
        echo: "업무를 넘겨받으면 오늘은 아무것도 무너지지 않습니다. 그가 깨어나서 가장 먼저 확인할 것은 명단이고, 그때 당신이 무엇을 했는지도 함께 확인됩니다.",
        next: "c10_locker",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c10_locker",
      },
    ],
  },
  c10_locker: {
    phase: "THE LIST",
    title: "1,740개의 이름",
    speaker: "이민서",
    text:
      "사물함 파일은 3년치입니다. 강서지점 창구에서 팔린 대출로 무너진 사람 1,740명. 이름, 연락처, 마지막 통화 날짜, 그리고 '해결' 또는 '미해결'. 이민서가 마지막 장에서 손을 멈춥니다. 미해결 칸 아래에 도윤하 본인의 글씨로 한 줄이 더 있습니다. '2023-0412 반대 의견 작성자 -- 지하로 내려감. 미해결.' 3년 동안 당신도 그가 세던 피해자 중 한 명이었습니다.",
    memo: [
      "3년치 1,740명 -- 해결 612명, 미해결 1,128명",
      "매달 급여 이체 내역에 소액 송금 47건",
      "명단 어디에도 그 자신의 이름은 없음",
      "마지막 줄의 미해결 항목이 당신",
    ],
    triggers: ["affection", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c10_locker_open",
        label: "1,740명 전부를 공식 피해자 명부로 연다",
        effect: { legitimacy: 14, trust: 8, capital: -9, time: -7, fatigue: 5 },
        voice: "1,740명은 개인 메모가 아니라며, 전부를 공식 피해자 명부로 연다.",
        echo: "명부가 열리면 1,740명은 한 사람의 파일에서 조직이 세는 숫자가 됩니다. 숫자가 된 사람들은 소송의 당사자도 될 수 있습니다.",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c10_locker_money",
        label: "그가 사비로 보낸 47건부터 추적한다",
        effect: { trust: 10, humanCost: -6, time: -7, legitimacy: 4, fatigue: 4 },
        voice: "월급에서 나간 47건이 먼저라며, 그 송금부터 추적한다.",
        echo: "47건은 그가 이 일을 어떻게 해 왔는지 증명합니다. 같은 자료가 그를 돈 관리도 못 하는 직원으로 만들 수 있습니다.",
        cognition: { inference: 3 },
      },
      {
        id: "c10_locker_close",
        label: "미해결 1,128명은 덮고 해결분만 이관한다",
        effect: { time: 9, capital: 10, trust: -10, humanCost: 9, legitimacy: -5 },
        voice: "미해결 1,128명은 지금 감당할 수 없다며, 해결분만 이관한다.",
        echo: "해결분만 넘기면 인수인계는 오늘 끝납니다. 미해결 1,128명은 누가 다시 꺼낼 때까지 아무 데도 없습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c10_claim: {
    phase: "COUNTER PRESSURE",
    title: "소진은 재해인가",
    speaker: "반재욱",
    text:
      "산업재해(일하다 생긴 병이나 다침을 회사와 국가가 함께 책임지는 제도) 인정 여부를 가리는 회의가 열렸습니다. 사물함 파일은 이 회의의 증거 자료로 묶여 폐기가 멈췄습니다. 쟁점은 하나입니다. 탈진이 업무 때문이라는 걸 증명하려면, 도윤하가 규정 밖에서 얼마나 무리했는지를 기록으로 내야 합니다. 그 기록은 동시에 그가 3년간 사규를 어긴 증거입니다. 반재욱이 수첩을 덮고 처음으로 자기 손을 봅니다. '20년 동안 이 자리에서 사람을 잘랐습니다. 오늘은 이 서류가 저 사람을 살리는지 자르는지 저도 모르겠습니다.'",
    memo: [
      "인과관계를 증명할 자료 = 사규 위반을 증명할 자료",
      "인정되면 치료비와 휴직 급여, 부정되면 자발적 사직 권고",
      "그룹 법무는 인정 시 1,740명 소송 가능성을 우려",
      "심의 의결까지 40시간",
    ],
    triggers: ["order", "injustice", "protection"],
    choices: [
      {
        id: "c10_claim_prove",
        label: "위반 기록까지 전부 내고 인과관계를 증명한다",
        effect: { legitimacy: 13, trust: 6, humanCost: 5, time: -6, fatigue: 5 },
        voice: "위반 기록까지 다 내겠다며, 일 때문에 아팠다는 인과관계를 증명한다.",
        echo: "전부 내면 인과관계는 증명됩니다. 같은 서류가 3년치 사규 위반도 같은 날 증명합니다.",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c10_claim_narrow",
        label: "위반은 빼고 근무 시간 기록만으로 다툰다",
        effect: { capital: 8, time: 6, legitimacy: -7, trust: -5, fatigue: 2 },
        voice: "아팠다는 증명이 사규 위반의 증거가 되지 않게, 위반은 빼고 근무 시간 기록만으로 다툰다.",
        echo: "근무 시간만으로 다투면 그는 위반자가 되지 않습니다. 근무 시간만으로는 이 병이 일 때문이라는 것도 되지 않습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c10_claim_system",
        label: "개인 심의가 아니라 제도 결함으로 안건을 바꾼다",
        effect: { legitimacy: 9, trust: 11, capital: -8, time: -8, humanCost: -6, fatigue: 6 },
        voice: "살릴 자료와 자를 자료가 같은 서류라면 제도가 틀린 거라며, 개인 심의가 아니라 제도 결함으로 안건을 바꾼다.",
        echo: "안건이 제도로 바뀌면 다음 사람은 이 심의를 다시 받지 않습니다. 바꾸는 데 걸리는 시간 동안 도윤하의 치료비는 아무 데서도 나오지 않습니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c10_relay: {
    phase: "THE RELAY",
    title: "나눠 지는 법",
    speaker: "나준혁",
    text:
      "회기동 헌책방 2층. 임경수가 장부를 치워 자리를 만들고, 나준혁이 강원에서 새벽 버스를 타고 올라와 믹스커피를 여섯 잔 탑니다. 이민서, 강태민, 오진우까지 왔습니다. 1,128명을 한 사람이 아니라 여섯 사람이 나눠 맡는 표를 짭니다. 나준혁이 종이컵을 돌리며 말합니다. '제가 30년 동안 배운 게 하나 있어요. 혼자 하는 착한 일은 반드시 끝납니다. 그 사람이 끝나거든요.' 오진우가 맨 마지막에 조용히 손을 듭니다. '저도 칸 하나 주십시오. 제일 어려운 걸로.'",
    memo: [
      "1,128명을 여섯 명이 분담하는 표",
      "나준혁 200 · 임경수 180 · 이민서 240 · 강태민 120 · 오진우 288 · 당신 100",
      "분담표는 선의가 아니라 담당자 지정이 되어야 유지됨",
      "여섯 명 중 넷은 이 일로 받는 보상이 없음",
    ],
    triggers: ["trust", "affection", "responsibility"],
    choices: [
      {
        id: "c10_relay_assign",
        label: "여섯 사람을 공식 담당자로 지정해 규정에 박는다",
        effect: { legitimacy: 15, trust: 7, time: -5, capital: -5, fatigue: 3 },
        voice: "약속은 흩어진다며, 여섯 사람을 공식 담당자로 규정에 박는다.",
        echo: "규정에 박힌 담당자는 사람이 바뀌어도 남습니다. 규정이 된 순간 그 일은 아무도 자원해서 하지 않는 일이 됩니다.",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c10_relay_pay",
        label: "무보수로 두지 않겠다며 수당 예산부터 따낸다",
        effect: { capital: -10, trust: 12, legitimacy: 8, time: -7, fatigue: 5 },
        voice: "여섯 명 중 넷은 이 일로 받는 것이 없어서, 수당 예산부터 따낸다.",
        echo: "수당이 붙으면 여섯 사람은 대가 없이 소모되지 않습니다. 예산을 따내는 동안 분담표는 아직 아무것도 처리하지 못합니다.",
        cognition: { persistence: 3 },
      },
      {
        id: "c10_relay_keep",
        label: "정식 조직이 되면 식는다며 지금의 약속으로 둔다",
        effect: { trust: 9, time: 7, legitimacy: -9, humanCost: 7, fatigue: -4 },
        voice: "새벽 버스를 타고 오고 스스로 손을 든 마음은 규정으로 못 만든다며, 분담표를 지금의 약속으로 둔다.",
        echo: "약속으로 두면 지금의 온도가 유지됩니다. 약속은 여섯 사람 중 누가 지치면 그 칸부터 비어 갑니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c10_final: {
    phase: "FINAL DECISION",
    title: "멈추는 법",
    speaker: "도윤하",
    text:
      "4주를 쉬라는 소견을 두고 도윤하가 2주 만에 돌아옵니다. 그사이 명단은 그룹의 정식 안건으로 올라갔고, 안건의 서식에 맞추는 동안 212명이 빠졌습니다. 서류가 남지 않은 사람, 대출 명의가 가족이던 사람, 이미 시효(법으로 책임을 물을 수 있는 기간)가 지난 사람. 규정은 그들을 담을 칸이 없습니다. 도윤하가 책상에 앉아 새 수첩을 꺼내 첫 장에 212라고 적습니다. 그리고 당신을 봅니다. '알아요. 이러다 또 쓰러진다는 거. 그런데 이 212명은 제가 안 적으면 아무 데도 없어요. 말려 주실 겁니까, 같이 적으실 겁니까.'",
    memo: [
      "안건에 오른 916명, 규정 밖으로 밀려난 212명",
      "212명은 어느 공식 명부에도 존재하지 않음",
      "도윤하의 의사 소견: 3개월 내 재발 가능성 높음",
      "새 수첩 첫 장에 적힌 숫자: 212",
    ],
    triggers: ["choice", "affection", "selfAwareness"],
    choices: [
      {
        id: "c10_final_stop",
        label: "수첩을 덮게 하고 212명은 제도 개정으로 미룬다",
        effect: { legitimacy: 12, humanCost: 8, trust: -6, time: 6, fatigue: -5 },
        voice: "석 달 안에 다시 쓰러질 수 있다는 소견이 있어서, 수첩을 덮게 하고 212명은 제도 개정으로 미룬다.",
        echo: "덮게 하면 그는 3개월 뒤에도 자리에 있습니다. 212명은 그때까지 어느 명부에도 없습니다.",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c10_final_join",
        label: "그 수첩의 절반을 내 이름으로 나눠 적는다",
        effect: { trust: 15, humanCost: -9, capital: -6, time: -7, fatigue: 7 },
        voice: "혼자 적게 두지는 않겠다며, 그 수첩의 절반을 내 이름으로 나눠 적는다.",
        echo: "절반을 나눠 적으면 그는 혼자 무너지지 않습니다. 두 사람이 같은 속도로 소모되는 것일 수도 있습니다.",
        cognition: { persistence: 3 },
      },
      {
        id: "c10_final_rule",
        label: "212명이 들어갈 칸을 규정에 새로 만들자고 요구한다",
        effect: { legitimacy: 10, trust: 9, capital: -9, time: -9, humanCost: -5, fatigue: 6 },
        voice: "규정에 담을 칸이 없어서 빠진 사람들이니, 212명이 들어갈 칸을 규정에 새로 만들자고 요구한다.",
        echo: "규정에 칸이 생기면 212명은 제도 안으로 들어옵니다. 그 개정이 통과될 때까지 그 212명은 계속 밖에 있습니다.",
        cognition: { reframing: 3 },
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
 * Everything else 사건 10 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 *
 * The voice lines. The bill for the two cases before it. The lines are spoken
 * either to a person who cannot answer yet or to a room deciding what one
 * person's three years were worth, so none of them argues with a document.
 */
export const case10 = {
  id: "case10",
  nodes: case10Nodes,
  aftermath: {
    c10_aftershock: {
      phase: "AFTERMATH",
      title: "여섯 개의 칸",
      speaker: "도윤하",
      text: "미해결 명단을 여섯 사람이 나눠 맡는 분담표가 붙은 첫 주말, 트리거랩 4층은 조용합니다. 서류가 남지 않은 212명은 그 표 어느 칸에도 들어가지 못했습니다. 병원에서 돌아온 도윤하가 명단의 이름 하나에 오늘 처음으로 '해결'이라고 적고, 펜을 놓고, 한참 그 줄을 봅니다. '3년 동안 이걸 혼자 적었는데요. 이번 주에는 여섯 명이 나눠 적었어요.' 창밖은 아직 밝습니다. 정시에 퇴근해 본 적이 언제인지 두 사람 다 기억하지 못합니다.",
      memo: ["첫 주 처리 34건 -- 혼자 하던 3년 평균의 여섯 배", "212명 명단은 아직 어느 제도에도 없음", "그룹전략실이 분담표 사본을 요청함", "본사 33층에서 당신을 호출함"],
      triggers: ["affection", "system", "selfAwareness"],
      choices: [
        {
          id: "c10_after_rest",
          label: "오늘은 정시에 불을 끄고 남은 사람을 다 퇴근시킨다",
          effect: { trust: 13, humanCost: -7, capital: -3, fatigue: -9 },
          voice: "오늘은 여기까지라며 불을 끄고, 남아 있던 사람을 정시에 퇴근시킨다.",
          echo: "불을 끄면 4층이 처음으로 정시에 비워집니다. 그 저녁에 처리하지 못한 건은 월요일로 넘어갑니다.",
          next: "case10_result",
          cognition: { reframing: 2 },
        },
        {
          id: "c10_after_record",
          label: "분담표를 그룹 공식 제도안으로 제출한다",
          effect: { legitimacy: 16, trust: 3, time: -4, humanCost: 4, fatigue: 4 },
          voice: "분담표가 제도가 되어야 남는다며, 그룹 공식 제도안으로 제출한다.",
          echo: "제도안이 되면 분담표는 담당자가 바뀌어도 살아남습니다. 그룹전략실은 그 표를 자기들 성과로 인용할 수 있습니다.",
          next: "case10_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c10_after_keep",
          label: "212명 명단만은 넘기지 않고 내 서랍에 남긴다",
          effect: { capital: 9, trust: 7, legitimacy: -10, humanCost: 6, fatigue: 3 },
          voice: "아직 어느 제도에도 없는 이름들이라, 212명 명단만은 넘기지 않고 내 서랍에 남긴다.",
          echo: "서랍에 두면 212명은 지워지지 않습니다. 보관자가 한 명뿐인 기록은 그 한 명이 사라지면 같이 사라집니다.",
          next: "case10_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c10_final", "c10_aftershock"],
  connectiveScenes: [
    {
      id: "c10_ward",
      after: "c10_locker",
      next: "c10_claim",
      title: "깨어난 십 분",
      speaker: "도윤하",
      text: "도윤하가 십 분 정도 깹니다. 자기 상태는 묻지 않습니다. '1,128명 파일요. 폐기되나요.' 그리고 처음으로 이유를 말합니다. '저 강서지점에서 실적 1위 두 번 했어요. 상 받고 사진도 찍었고요. 그 실적이 전부 저 명단이에요. 제가 판 겁니다. 제가 세야죠.' 말을 마치고 다시 잠듭니다.",
      memo: ["초과근무 3년치 4,180시간", "그중 명단 관련 2,940시간", "실적 1위 표창 2회 -- 2023년, 2024년", "의료진 소견: 최소 4주 절대 안정"],
      choices: [
        {
          label: "폐기는 막겠다고 먼저 안심시킨다",
          effect: { trust: 11, humanCost: -5, capital: -8, time: -5, fatigue: 6 },
          voice: "자기 상태보다 파일부터 묻는 사람이라, 폐기는 막겠다고 먼저 안심시킨다.",
          echo: "안심시키면 그는 다시 잠듭니다. 어떻게 막을지까지는 아직 말하지 않았습니다.",
        },
        {
          label: "지금은 아무 말도 하지 말라고 한다",
          effect: { legitimacy: 6, time: -7, humanCost: 4, fatigue: 5 },
          voice: "최소 4주는 절대 안정이라는 소견대로, 지금은 아무 말도 하지 말라고 한다.",
          echo: "말을 막으면 십 분이 온전히 쉬는 시간이 됩니다. 그가 깨어 있는 다음 십 분은 언제일지 모릅니다.",
        },
        {
          label: "명단의 실제 상태를 사실대로 말한다",
          effect: { time: 7, capital: 7, trust: -8, humanCost: 5, fatigue: -4 },
          voice: "3년을 센 사람에게 꾸며 말할 수는 없다며, 명단의 실제 상태를 사실대로 말한다.",
          echo: "사실대로 말하면 그는 계산을 시작합니다. 절대 안정 4주 중 첫 십 분이 그 계산에 쓰입니다.",
        },
      ],
    },
    {
      id: "c10_pills",
      after: "c10_claim",
      next: "c10_relay",
      title: "열아홉 명",
      speaker: "한서윤",
      text: "한서윤이 인사 기록부를 엽니다. 최근 3년, 트리거랩과 강서지점에서 같은 사유로 병가를 낸 사람이 열아홉 명입니다. 사유란은 전부 '개인 사정'입니다. 그가 화면을 한 줄 더 내리다가 멈춥니다. 열아홉 명 중 한 명이 한서윤 본인입니다. 3년 전, 2주.",
      memo: ["같은 사유 병가 19건 -- 전부 개인 사정으로 기록", "19명 중 현재 재직자는 11명", "한서윤 본인이 그중 한 명", "집단 심의로 묶으면 제도 결함이 쟁점이 됨"],
      choices: [
        {
          label: "열아홉 명을 한 건으로 묶어 집단 심의를 요구한다",
          effect: { trust: 8, legitimacy: 9, capital: -9, time: -6, fatigue: 7 },
          voice: "같은 사유가 열아홉 번이면 제도 문제라며, 열아홉 명을 한 건으로 묶어 집단 심의를 요구한다.",
          echo: "열아홉 건이 한 건이 되면 쟁점은 사람이 아니라 제도가 됩니다. 그 심의는 도윤하의 치료비보다 늦게 끝납니다.",
        },
        {
          label: "한서윤의 기록은 빼고 열여덟 명으로 간다",
          effect: { legitimacy: 5, time: -8, humanCost: 5, fatigue: 4 },
          voice: "화면을 연 사람까지 걸 수는 없다며, 한서윤의 기록은 빼고 열여덟 명으로 간다.",
          echo: "한 명을 빼면 표는 깨끗해집니다. 빠진 그 한 명은 이번에도 자기 2주를 개인 사정으로 남깁니다.",
        },
        {
          label: "개별 심의가 빠르다며 도윤하 건만 먼저 끝낸다",
          effect: { time: 8, capital: 5, trust: -7, humanCost: 6, fatigue: -5 },
          voice: "치료비가 급한 사람이 있어서, 개별 심의가 빠르다며 도윤하 건만 먼저 끝낸다.",
          echo: "한 건만 가면 이번 주에 끝납니다. 나머지 열여덟 명의 사유란은 그대로 개인 사정입니다.",
        },
      ],
    },
    {
      id: "c10_ledger",
      after: "c10_relay",
      next: "c10_final",
      title: "여섯 장의 손익계산서",
      speaker: "권도현",
      text: "오진우가 권도현을 불렀습니다. 그가 분담표를 보더니 빈 종이에 세로줄을 긋습니다. '여섯 칸 다 채우십시오. 잃는 것 칸이 비면 이 표는 반년 안에 무너집니다. 선의로 시작한 표가 무너지는 걸 저는 집안에서 봤습니다.' 다섯 칸이 채워집니다. 강태민은 야간 수당, 이민서는 계약 갱신 평가, 나준혁은 정년퇴직까지 2년, 임경수는 조용함, 오진우는 승진 순번. 여섯 번째 칸이 비어 있습니다.",
      memo: ["여섯 명 중 넷은 이 일로 얻는 것이 없음", "권도현: 잃는 것이 적힌 표만 오래 간다", "당신의 칸은 아직 공란", "표가 무너지면 1,128명이 다시 한 사람에게 돌아감"],
      choices: [
        {
          label: "내 칸에 승진과 복귀를 잃는다고 적는다",
          effect: { trust: 12, legitimacy: 6, capital: -10, time: -4, fatigue: 4 },
          voice: "빈 칸이 표를 무너뜨린다는 말을 받아들여, 내 칸에 승진과 복귀를 잃는다고 적는다.",
          echo: "당신 칸이 채워지면 표는 여섯 사람의 계약이 됩니다. 적은 것은 실제로 잃게 됩니다.",
        },
        {
          label: "잃을 것이 없다고 적고 표를 넘긴다",
          effect: { legitimacy: 9, time: -6, humanCost: 6, fatigue: 3 },
          voice: "내 몫까지 따질 때가 아니라며, 잃을 것이 없다고 적고 표를 넘긴다.",
          echo: "잃을 것이 없다고 적으면 당신만 대가 없이 돕는 사람이 됩니다. 권도현은 그 칸을 믿지 않습니다.",
        },
        {
          label: "여섯 칸을 모두 공개하고 서로 검토하게 한다",
          effect: { time: 4, capital: 8, trust: -9, humanCost: 4, fatigue: -6 },
          voice: "서로 무엇을 거는지 알아야 오래 간다며, 여섯 칸을 모두 공개하고 서로 검토하게 한다.",
          echo: "여섯 칸이 공개되면 누가 가장 많이 내는지 전부 압니다. 알고 나서도 그 자리에 남을지는 다른 문제입니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c10_ward_reaction",
      after: "c10_ward",
      next: "c10_claim",
      title: "회계에 잡히지 않는 것",
      speaker: "에코",
      text: "에코가 병실 밖 복도에서 계산을 띄웁니다. 도윤하의 3년치 초과근무 4,180시간 중 명단 관련이 2,940시간. 시급으로 환산하면 4,300만 원입니다. 청구된 적은 없습니다. '선의는 회계에 잡히지 않습니다. 잡히지 않는 비용은 줄어들지도 않습니다. 이 2,940시간은 이 조직의 장부 어디에도 지출로 기록된 적이 없습니다.'",
      memo: ["장부에 없는 2,940시간", "청구되지 않은 4,300만 원"],
      choices: [
        {
          label: "4,300만 원을 미지급 임금으로 정식 청구한다",
          effect: { trust: 10, legitimacy: 5, humanCost: -6, time: -6, fatigue: 6 },
          voice: "장부에 없던 2,940시간을 지출로 남기겠다며, 4,300만 원을 미지급 임금으로 정식 청구한다.",
          echo: "청구하면 그 시간은 처음으로 회계에 잡힙니다. 청구서를 받은 쪽은 그를 문제 직원으로 분류합니다.",
        },
        {
          label: "숫자로 만들면 선의가 훼손된다며 그대로 둔다",
          effect: { legitimacy: 8, time: -3, humanCost: 4, fatigue: 5 },
          voice: "값을 매기면 선의가 거래가 된다며, 숫자로 만들지 않고 그대로 둔다.",
          echo: "두면 선의는 선의로 남습니다. 회계에 잡히지 않는 비용은 다음 사람에게도 청구되지 않습니다.",
        },
        {
          label: "그 계산은 제도 개선 근거 자료로만 쓴다",
          effect: { time: 7, capital: 6, trust: -7, humanCost: 6, fatigue: -4 },
          voice: "본인에게 묻기 전에는 청구할 수 없어서, 그 계산은 제도 개선 근거 자료로만 쓴다.",
          echo: "근거 자료로만 쓰면 제도는 바뀝니다. 도윤하 개인에게 돌아오는 돈은 없습니다.",
        },
      ],
    },
    {
      id: "c10_pills_reaction",
      after: "c10_pills",
      next: "c10_relay",
      title: "3년 전 2주",
      speaker: "한서윤",
      text: "한서윤이 자기 병가 기록을 엽니다. 사유란: 개인 사정. 실제 날짜는 3년 전 플로우온 반대 의견서를 반려하는 서명을 한 뒤 두 달째 되는 날입니다. '저는 그때 아무한테도 말 안 했습니다. 말하면 제가 그 서명을 후회한다는 뜻이 되니까요.' 그가 화면을 닫으려다 손을 멈춥니다. '그런데 열아홉 명 중 열여덟 명도 같은 이유로 말을 안 했겠죠.'",
      memo: ["사유란에 적히지 않은 이유", "열아홉 번째로 비어 있는 칸"],
      choices: [
        {
          label: "그 2주를 기록에 사실대로 다시 쓰게 한다",
          effect: { trust: 9, legitimacy: 7, capital: -7, time: -5, fatigue: 6 },
          voice: "'개인 사정' 뒤에 묻히지 않게, 그 2주를 기록에 사실대로 다시 쓰게 한다.",
          echo: "다시 쓰면 열아홉 건이 전부 같은 이름의 사유를 갖습니다. 한서윤은 자기 서명을 후회한다고 적어야 합니다.",
        },
        {
          label: "본인이 원하지 않으면 그 기록은 그대로 둔다",
          effect: { legitimacy: 5, time: -6, humanCost: 5, fatigue: 4 },
          voice: "3년을 닫아 둔 데는 이유가 있다며, 본인이 원하지 않으면 그 기록은 그대로 둔다.",
          echo: "그대로 두면 그는 계속 압박하는 쪽에 설 수 있습니다. 열아홉 번째 칸은 영영 비어 있습니다.",
        },
        {
          label: "당사자 동의를 받아 열아홉 번째 사례로 넣는다",
          effect: { time: 6, capital: 7, trust: -8, humanCost: 5, fatigue: -5 },
          voice: "말할지 말지는 본인이 정할 일이라며, 당사자 동의를 받아 열아홉 번째 사례로 넣는다.",
          echo: "동의를 받으면 사례는 완전해집니다. 동의를 구하는 그 대화가 두 사람 사이를 바꿉니다.",
        },
      ],
    },
    {
      id: "c10_ledger_reaction",
      after: "c10_ledger",
      next: "c10_final",
      title: "오진우의 칸",
      speaker: "오진우",
      text: "오진우의 칸에는 '승진 순번'이라고 적혀 있습니다. 그런데 종이를 기울이면 지우고 다시 쓴 자국 아래로 원래 문장이 비칩니다. '아버지에게 할 말.' 그가 288명을 가져간 이유입니다. 아버지는 승인을 하루 늦춰 지점에서 밀려났고, 아들은 그 하루가 옳았다는 걸 288번 증명하려 합니다.",
      memo: ["지우고 다시 쓴 한 줄", "288이라는 숫자의 출처"],
      choices: [
        {
          label: "지우고 다시 쓴 그 줄을 못 본 척하고 표를 넘긴다",
          effect: { trust: 11, humanCost: -7, capital: -6, time: -7, fatigue: 7 },
          voice: "본인이 꺼낼 때까지 기다리기로 하고, 지우고 다시 쓴 그 줄을 못 본 척한 채 표를 넘긴다.",
          echo: "못 본 척하면 그는 288명을 끝까지 셉니다. 무엇을 증명하려는지는 아무도 묻지 않습니다.",
        },
        {
          label: "288명은 너무 많다며 칸을 다시 나눈다",
          effect: { legitimacy: 9, time: -5, humanCost: 4, fatigue: 5 },
          voice: "한 사람이 또 쓰러지는 표는 안 된다며, 288명은 너무 많다고 칸을 다시 나눈다.",
          echo: "다시 나누면 그의 몫이 줄어듭니다. 그는 그것을 또 한 번 밀려나는 것으로 읽을 수 있습니다.",
        },
        {
          label: "아버지를 한번 만나러 가자고 말한다",
          effect: { time: 5, capital: 9, trust: -6, humanCost: 5, fatigue: -3 },
          cognition: { persistence: 1 },
          voice: "288번 증명하는 것보다 한 번 말하는 게 빠르다며, 아버지를 한번 만나러 가자고 말한다.",
          echo: "만나러 가면 그 하루가 표에서 빠집니다. 아버지가 아들을 어떻게 볼지는 아무도 모릅니다.",
        },
      ],
    },
  ],
  branchPlan: ["c10_locker", 1, "c10_branch_home", "c10_branch_home_follow"],
  branchScenes: {
    // CASE 10's detour is the counter the whole season started at. The case argues
    // in HR procedure and ledgers; the side door is the one room where the loan
    // was an actual conversation between two people across a desk.
    c10_branch_home: {
      phase: "SIDE DOOR",
      title: "4번 창구",
      speaker: "이민서",
      text: "송금 47건의 받는 통장은 거의 다 강서지점에서 만든 것입니다. 이민서가 그 기록을 떼러 간 김에 도윤하의 옛 사물함에서 짐을 찾습니다. 안에는 실적 1위 표창장 두 개, 그리고 뜯지 않은 봉투 하나가 있습니다. 겉면에는 '사직서'라는 글씨와 3년 전 여름의 날짜가 적혀 있습니다. 그가 쓰고 내지 않은 것입니다. 창구 너머 4번 자리에는 지금 다른 사람이 앉아, 이름만 바뀐 상품을 같은 방식으로 팔고 있습니다.",
      memo: ["3년 전 작성 후 제출하지 않은 사직서", "표창장 2회 -- 그 상품의 판매 실적", "4번 창구의 현재 담당자는 입사 1년차", "이름만 바뀐 상품이 지금도 같은 방식으로 팔리는 중"],
      triggers: ["affection", "injustice", "system"],
      choices: [
        {
          id: "c10_branch_home_a",
          label: "사직서는 돌려주고 4번 창구의 판매 방식부터 본다",
          effect: { legitimacy: 11, trust: 5, time: -4, humanCost: 4, fatigue: 3 },
          voice: "사직서는 그의 것이라며 돌려주고, 4번 창구가 지금 파는 방식부터 본다.",
          echo: "지금 파는 방식을 보면 이 일이 3년 전 이야기가 아니라는 게 드러납니다. 드러난 만큼 사건은 도윤하 한 사람에서 지점 전체로 커집니다.",
          next: "c10_branch_home_follow",
          cognition: { inference: 2 },
        },
        {
          id: "c10_branch_home_b",
          label: "봉투를 그대로 두고 짐만 조용히 가져온다",
          effect: { time: 6, capital: 6, trust: -7, humanCost: 5, fatigue: -4 },
          voice: "봉투는 열지 않은 채 두고, 짐만 조용히 챙겨 나온다.",
          echo: "봉투를 두면 그의 3년은 그의 것으로 남습니다. 당신은 그가 왜 내지 않았는지 영영 모릅니다.",
          next: "c10_branch_home_follow",
          cognition: { risk: 1 },
        },
        {
          id: "c10_branch_home_c",
          label: "1년차 담당자에게 이 상품의 뒷장을 먼저 알려 준다",
          effect: { trust: 12, humanCost: -6, capital: -5, time: -5, fatigue: 5 },
          voice: "같은 자리에 앉은 1년차에게, 이 상품의 뒷장을 먼저 알려 준다.",
          echo: "알려 주면 1년차는 선택할 수 있게 됩니다. 그 선택의 대가는 이번에 그 사람이 치릅니다.",
          next: "c10_branch_home_follow",
          cognition: { reframing: 2, persistence: 1 },
        },
      ],
    },
    c10_branch_home_follow: {
      phase: "SIDE DOOR",
      title: "다른 필체",
      speaker: "이민서",
      text: "지점 문서고에서 명단 원본을 대조하다가 이민서가 손을 멈춥니다. 1,740줄 중 200줄 남짓이 도윤하의 글씨가 아닙니다. 필체가 셋 더 있습니다. 강서지점 직원 세 명이 3년 동안 각자 몇 줄씩 보태 왔습니다. 서로 말을 맞춘 적도 없고, 도윤하에게 말한 적도 없습니다. 이민서가 조용히 웃습니다. '혼자 한 게 아니었네요. 본인만 몰랐어요.'",
      memo: ["도윤하 외 필체 3종 -- 약 200줄", "세 사람 모두 현재 강서지점 재직", "누구도 서로에게 말한 적 없음", "도윤하 본인은 이 사실을 모름"],
      triggers: ["trust", "affection", "recognition"],
      choices: [
        {
          id: "c10_branch_home_follow_a",
          label: "세 사람을 찾아가 명단을 함께 맡자고 제안한다",
          effect: { trust: 14, legitimacy: 6, capital: -6, time: -6, fatigue: 5 },
          voice: "3년 동안 말없이 줄을 보태 온 사람들이라, 세 사람을 찾아가 명단을 함께 맡자고 제안한다.",
          echo: "함께 맡으면 세 사람은 숨어서 돕던 일을 드러내고 합니다. 드러난 이름은 인사 기록에도 드러납니다.",
          next: "c10_ward",
          cognition: { reframing: 3 },
        },
        {
          id: "c10_branch_home_follow_b",
          label: "세 사람의 이름은 밝히지 않고 줄만 명부에 합친다",
          effect: { legitimacy: 10, time: -2, humanCost: 3, fatigue: 2 },
          voice: "서로에게도 말한 적 없이 보탠 줄이라, 세 사람의 이름은 밝히지 않고 줄만 명부에 합친다.",
          echo: "이름을 가리면 세 사람은 안전합니다. 명부는 누가 3년을 함께 버텼는지 말하지 못합니다.",
          next: "c10_ward",
          cognition: { inference: 2 },
        },
        {
          id: "c10_branch_home_follow_c",
          label: "도윤하가 깨면 이 얘기부터 해 주기로 한다",
          effect: { trust: 11, humanCost: -7, time: 5, legitimacy: -4, fatigue: -3 },
          voice: "이 얘기는 본인이 먼저 들어야 한다며, 깨면 해 주기로 한다.",
          echo: "본인이 먼저 들으면 그는 혼자가 아니었다는 걸 압니다. 다만 그가 깨어 있는 시간은 짧고, 그 몇 분에 무엇부터 말할지는 그때 정해야 합니다.",
          next: "c10_ward",
          cognition: { persistence: 2 },
        },
      ],
    },
  },
  routePlan: {
    start: "c10_start",
    result: "c10_aftershock",
    defaultFree: "c10_route_system",
    // One person's obsession, and the question of who else is allowed to carry
    // it. There is no four-way split here either: the case is a single handover.
    choices: {},
    system: {
      route: "c10_route_system",
      final: "c10_final_system_route",
      title: "소진율",
      speaker: "에코",
      text: "도윤하 한 사람의 병가를 따지는 대신 같은 일을 하던 사람들이 얼마나 버텼는지 묻자 에코가 한 번도 집계된 적 없는 지표를 만듭니다. 지난 6년간 고객 피해를 자발적으로 추적한 직원 34명. 그중 29명이 3년 안에 퇴직하거나 장기 병가에 들어갔습니다. 평균 지속 기간은 2년 7개월입니다. '선의는 이 조직에서 평균 31개월 만에 소모됩니다. 아무도 이 숫자를 재지 않았습니다. 재면 관리 대상이 되니까요.'",
      memo: ["자발적 피해 추적자 34명 중 29명이 3년 내 이탈", "평균 지속 31개월 -- 도윤하는 36개월째", "이 지표는 어떤 보고서에도 존재한 적 없음"],
      routeChoices: [
        {
          id: "c10_route_system_publish",
          label: "소진율을 그룹 공식 지표로 등록시킨다",
          effect: { legitimacy: 11, trust: 5, capital: -7, time: -9, fatigue: 6 },
          voice: "재지 않는 숫자는 줄지도 않는다며, 소진율을 그룹 공식 지표로 등록시킨다.",
          echo: "등록되면 소진율은 분기마다 집계됩니다. 집계를 어느 부서가 맡을지는 그룹이 정합니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c10_route_system_hide",
          label: "지표는 닫고 도윤하 개인 건으로만 간다",
          effect: { time: 8, capital: 7, trust: -8, legitimacy: -7, humanCost: 5, fatigue: -5 },
          voice: "일이 커지면 도윤하 건이 밀린다며, 지표는 닫고 도윤하 개인 건으로만 간다.",
          echo: "개인 건으로 가면 심의는 한 사람의 병력만 봅니다. 앞서 떠난 스물아홉 명은 이번에도 각자의 사정으로 남습니다.",
          cognition: { risk: 2 },
        },
        {
          id: "c10_route_system_reach",
          label: "이탈한 29명에게 먼저 연락해 이야기를 듣는다",
          effect: { trust: 13, legitimacy: 4, capital: -8, humanCost: -7, time: -10, fatigue: 9 },
          voice: "숫자로 올리기 전에 당사자 말부터 들으려고, 이탈한 29명에게 먼저 연락해 이야기를 듣는다.",
          echo: "연락하면 떠난 사람들이 비슷한 말을 합니다. 그만둔 게 아니라 더는 못 한 거라고. 받아 적는 데 밤이 여럿 들어갑니다.",
          cognition: { reframing: 2 },
        },
      ],
      finalTitle: "서른한 달",
      finalText: "미해결 1,128명을 여섯 사람이 나눠 맡는 분담표의 확정까지 여덟 시간, 실험 단말에는 소진율 표가 떠 있습니다. 서른네 명 가운데 스물아홉 명이 3년 안에 자리를 떠났고, 도윤하는 서른여섯 달째입니다. 에코가 한 줄을 남깁니다. '이 숫자를 제도에 올리면 관리 대상이 됩니다. 올리지 않으면 다음 사람도 혼자 셉니다.'",
      finalMemo: ["자발적 피해 추적자 34명 -- 29명이 3년 안에 이탈", "도윤하: 36개월째", "분담표 확정까지 8시간"],
    },
    finalChoices: [
      {
        id: "a",
        label: "소진율을 명단 제도와 한 묶음으로 올린다",
        effect: { legitimacy: 13, trust: 8, capital: -9, humanCost: -6, fatigue: 7 },
        voice: "다음 사람이 혼자 세지 않게, 소진율을 명단 제도와 한 묶음으로 올린다.",
        echo: "한 묶음이 되면 명단을 지키는 제도에 사람을 지키는 숫자가 붙습니다. 승인하는 쪽은 그 숫자부터 빼자고 할 것입니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "지표는 덮고 분담표만 통과시킨다",
        effect: { capital: 10, time: 7, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -5 },
        voice: "여덟 시간 안에 표부터 살려야 한다며, 지표는 덮고 분담표만 통과시킨다.",
        echo: "분담표는 통과합니다. 여섯 사람이 나눠 든 무게가 얼마 만에 닳는지는 아무도 재지 않습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "소진율 35번째 줄에 내 이름을 미리 적어 둔다",
        effect: { legitimacy: 8, trust: 7, capital: -6, time: -7, humanCost: 4, fatigue: 9 },
        voice: "남의 숫자로만 두지 않겠다며, 소진율 35번째 줄에 내 이름을 미리 적어 둔다.",
        echo: "이름을 미리 적으면 당신도 세는 사람이 아니라 세어지는 사람이 됩니다. 도윤하가 그 줄을 보고 한참 말이 없습니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c10_evidence_turn",
    result: "c10_aftershock",
    sourceRoutes: ["c10_locker", "c10_claim", "c10_relay", "c10_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "최근 3년 같은 사유로 병가를 낸 열아홉 명의 신청서를 단서 곁에 쌓아, 사유란이 언제부터 같은 문구였는지 넘겨 센다.",
    entryEcho: "신청서를 쌓으면 '개인 사정'은 각자의 선택이 아니라 누군가 정해 둔 서식의 기본값이 됩니다.",
    title: "사유란의 기본값",
    speaker: "반재욱",
    text: "단서를 맞추자 인사 서식의 개정 이력이 열립니다. 4년 전, 병가 신청서의 사유란에서 '업무상'이라는 보기가 삭제되고 '개인 사정'이 기본값으로 바뀌었습니다. 개정안을 작성한 부서는 기업금융전략팀입니다. 병가를 낸 열아홉 명이 같은 문구를 쓴 건 열아홉 번의 선택이 아니라, 선택지가 하나뿐이었기 때문입니다.",
    memo: ["4년 전 병가 서식 개정 -- '업무상' 보기 삭제", "개정 부서: KD은행 기업금융전략팀", "개정 이후 업무상 질병 인정 건수 0건"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 },
    choices: [
      {
        id: "c10_evidence_turn_restore",
        label: "삭제된 '업무상' 보기를 서식에 되돌리라고 요구한다",
        effect: { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 },
        voice: "다음 사람에게는 선택지가 둘이어야 한다며, 삭제된 '업무상' 보기를 서식에 되돌리라고 요구한다.",
        echo: "요구가 접수되면 인사부는 보기를 왜 지웠는지부터 답해야 합니다. 그 질문은 개정안을 쓴 부서로 넘어갑니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c10_evidence_turn_hold",
        label: "개정 이력은 알아 두고 심의장에서만 꺼낸다",
        effect: { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 },
        voice: "상대가 대비하기 전에 쓰려고, 개정 이력은 알아 두고 심의장에서만 꺼낸다.",
        echo: "심의장에서 꺼내면 가장 크게 울립니다. 그때까지 도윤하의 신청서는 '개인 사정' 칸에 놓여 있습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c10_evidence_turn_share",
        label: "열아홉 명 전원에게 이 개정 이력을 먼저 알린다",
        effect: { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 },
        voice: "제 선택인 줄 알고 있을 사람들이라며, 열아홉 명 전원에게 이 개정 이력을 먼저 알린다.",
        echo: "알리면 열아홉 명이 자기 신청서를 다시 꺼냅니다. 스스로 고른 줄 알았던 문구가 하나뿐인 보기였다는 것을 처음 봅니다.",
        cognition: { reframing: 2 },
      },
    ],
    entryLabel: "병가 사유란에서 보기가 사라진 날을 찾는다",
  },
  memoryPlan: {
    systemNext: "c10_route_system",
    evidenceNext: "c10_evidence_turn",
    systemLabel: "채권단 앞에서 다시 짠 판이 인사 기록에 옮겨 적혔는지 가린다",
    evidenceLabel: "사 둔 회수율을 만든 손을 병가 서식의 개정 이력에서 찾는다",
    systemEcho: "가려 보면 인사 기록에는 옮겨 적힌 것이 없습니다. 기록되지 않는 것이 하나 더 있다는 것만 알게 됩니다. 선의가 닳는 속도입니다.",
    evidenceEcho: "개정 이력을 따라가면 병가 신청서의 사유란에서 보기 하나가 사라진 날짜가 나옵니다.",
  },
  openingRoutes: {
    c9_after_stay: "c10_start_stay",
    c9_after_court: "c10_start_court",
    c9_after_return: "c10_start_return",
  },
  openingCopy: {
    c10_start_stay: ["현장에 남은 사람의 열흘", "한서윤", "고용 승계(직원을 해고 없이 그대로 넘겨받기) 합의가 끝날 때까지 당신은 풀필먼트센터(물류 창고)에 남았습니다. 1,140명은 일터를 지켰고, 그 열흘 동안 서울에서는 아무도 도윤하의 근무 기록을 보지 않았습니다. 어제 아침 그가 응급실로 실려 갔습니다. 이긴 쪽의 명단은 정리되었고, 이긴 사람 한 명의 상태는 아무 서류에도 올라가지 않았습니다. 병실 앞에서 한서윤이 말합니다. '이 사람 사물함에서 나온 파일이 있습니다. 공식 기록이 아니라서 나흘 뒤에 자동 폐기됩니다.'", ["고용 승계 합의 완료, 1,140명 유지", "같은 기간 도윤하의 초과근무 무기록", "사물함 파일 자동 폐기까지 96시간"]],
    c10_start_court: ["증언대에 섰던 사람의 열흘", "반재욱", "법정과 검사반에서 열흘을 보냈습니다. 진술은 정확했고 절차는 깨끗했습니다. 돌아와 보니 어제 아침 도윤하가 응급실로 실려 갔고, 그 사람의 기록은 증거로 제출된 적이 없습니다. 증언할 수 있는 피해와 증언할 서식이 없는 피해가 나란히 있습니다. 병실 앞에서 반재욱이 말합니다. '사물함에서 파일이 나왔습니다. 공식 기록이 아니라서 나흘 뒤에 자동 폐기됩니다.'", ["증인신문 3회, 진술 조서 확보", "도윤하 건은 업무 외 개인 사정으로 분류", "사물함 파일 자동 폐기까지 96시간"]],
    c10_start_return: ["조용히 돌아간 사람의 열흘", "에코", "당신은 컵라면을 다 먹고 영동지점으로 돌아갔습니다. 고용 승계(직원을 해고 없이 그대로 넘겨받기) 합의 소식은 뉴스로 들었고, 열흘째 되는 날 아침에 전화가 옵니다. 도윤하가 어제 아침 응급실로 실려 갔다는 소식입니다. 240km 밖에서 받은 소식은 늘 한 박자 늦습니다. 이번에 늦은 한 박자는 응급실까지의 거리였습니다. 병실 앞에서 에코가 알립니다. '그의 사물함에서 나온 명단 파일은 공식 기록이 아닙니다. 나흘 뒤 자동 폐기됩니다.'", ["영동지점 복귀 9일차", "도윤하 응급 이송 소식은 하루 뒤 전달됨", "사물함 파일 자동 폐기까지 96시간"]],
  },
  openingSignatures: {
    c10_start_stay: {
      label: "현장에서 쓰던 인수인계 서식을 그대로 명단에 적용한다",
      effect: { legitimacy: 10, trust: 5, capital: -5, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "폐기까지 96시간이라 새 양식을 만들 틈이 없어서, 현장에서 쓰던 인수인계 서식을 그대로 명단에 적용한다.",
      echo: "이미 쓰던 서식이라 오늘 바로 돌아갑니다. 공장에서 쓰던 양식이 사람 명단에 맞는지는 아무도 검토하지 않았습니다.",
    },
    c10_start_court: {
      label: "증인신문에서 쓴 진술 방식으로 도윤하의 기록을 정리한다",
      effect: { legitimacy: 12, trust: -4, humanCost: 4, time: -5, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "증언할 서식이 없던 피해에 서식을 주려고, 증인신문에서 쓴 진술 방식으로 도윤하의 기록을 정리한다.",
      echo: "법정 서식은 빈틈이 없습니다. 그 서식은 사람을 증인으로 만들고, 증인은 보호받는 대신 검증받습니다.",
    },
    c10_start_return: {
      label: "영동지점 숙직실에서 하듯 먼저 사람부터 찾아간다",
      effect: { trust: 14, humanCost: -6, legitimacy: -5, time: -6, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "지점에서 하던 대로, 서류보다 사람을 먼저 찾아가겠다고 한다.",
      echo: "먼저 찾아가면 그는 혼자가 아니게 됩니다. 폐기 시계는 그 방문 시간만큼 그대로 흘러갑니다.",
    },
  },
  setting: { place: "강서 이음병원 · 병실", clock: "기록 폐기까지 96h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 10
    c10_start: {
      place: "강서 이음병원 · 병실",
      clock: "기록 폐기까지 96h",
      question: "이긴 다음 주에 한 사람이 쓰러졌고 그의 명단은 나흘 뒤 지워집니다. 무엇부터 붙잡겠습니까?",
      lead: "플로우온 결의가 끝난 지 열흘입니다. 한서윤이 병실 문 앞에서, 들고 온 서류를 끝내 내밀지 못하고 서 있습니다.",
    },
    c10_start_stay: {
      place: "강서 이음병원 · 병실",
      clock: "기록 폐기까지 96h",
      question: "1,140명을 지키는 동안 한 사람의 근무 기록은 아무도 보지 않았습니다. 무엇부터 붙잡겠습니까?",
      lead: "고용 승계(직원을 해고 없이 그대로 넘겨받기) 합의서에 마지막 서명을 받고 올라온 길입니다. 열흘 만에 본 도윤하는 침대에 있습니다.",
    },
    c10_start_court: {
      place: "강서 이음병원 · 병실",
      clock: "기록 폐기까지 96h",
      question: "증언할 수 있는 피해와 증언할 서식이 없는 피해가 나란히 있습니다. 무엇부터 붙잡겠습니까?",
      lead: "증인신문 세 번을 마치고 돌아온 날입니다. 법정에서는 모든 피해에 서식이 있었습니다.",
    },
    c10_start_return: {
      place: "강서 이음병원 · 병실",
      clock: "기록 폐기까지 96h",
      question: "240km 밖에서 받은 소식은 하루 늦었습니다. 지금 무엇부터 붙잡겠습니까?",
      lead: "영동지점 복귀 9일째 아침에 전화를 받고, 첫차로 올라왔습니다.",
    },
    c10_locker: {
      place: "트리거랩 4층 분석관실 · 인사 대장 단말",
      clock: "기록 폐기까지 88h",
      question: "명단 마지막 줄의 미해결 항목이 당신입니다. 이 1,740명을 어떻게 다루겠습니까?",
      lead: "사물함에서 나온 파일을 단말에 올렸습니다. 3년치가 한 화면에 들어가지 않습니다.",
    },
    c10_branch_home: {
      place: "KD은행 강서지점 · 4번 창구",
      clock: "기록 폐기까지 84h",
      question: "3년 전 쓰고 내지 않은 사직서가 나왔고, 이름만 바뀐 상품은 지금도 팔립니다. 무엇을 보겠습니까?",
    },
    c10_branch_home_follow: {
      place: "KD은행 강서지점 · 문서고",
      clock: "기록 폐기까지 80h",
      question: "명단 200줄은 그의 글씨가 아니었습니다. 이 세 사람을 어떻게 하겠습니까?",
    },
    c10_ward: {
      place: "강서 이음병원 · 병실",
      clock: "기록 폐기까지 76h",
      question: "깨어 있는 십 분 동안 그가 묻는 건 자기 몸이 아니라 명단입니다. 무엇을 말하겠습니까?",
    },
    c10_ward_reaction: {
      place: "강서 이음병원 3층 · 복도",
      clock: "기록 폐기까지 74h",
      question: "장부에 없는 2,940시간이 4,300만 원으로 환산됐습니다. 이 숫자를 어디에 쓰겠습니까?",
    },
    c10_claim: {
      place: "트리거랩 2층 인사위원회실",
      clock: "산업재해 심의까지 40h",
      question: "무리했다는 증거는 규정을 어겼다는 증거이기도 합니다. 무엇을 내겠습니까?",
      lead: "회의실 맞은편에 반재욱이 앉아 있습니다. 펴 놓은 수첩에는 오늘 아직 한 줄도 적히지 않았습니다.",
    },
    c10_pills: {
      place: "트리거랩 4층 분석관실 · 인사 대장 단말",
      clock: "산업재해 심의까지 34h",
      question: "같은 사유로 병가를 낸 열아홉 명 중 하나가 한서윤입니다. 이 건을 어떻게 세우겠습니까?",
    },
    c10_pills_reaction: {
      place: "트리거랩 4층 · 창가",
      clock: "산업재해 심의까지 32h",
      question: "말하면 자기 서명을 후회한다는 뜻이 된다고 그가 말합니다. 그 2주를 어떻게 하겠습니까?",
    },
    c10_relay: {
      place: "회기동 헌책방 2층 · 장부 더미",
      clock: "분담표 확정까지 20h",
      question: "1,128명을 여섯 명이 나눠 지는 표를 짰습니다. 이 표를 무엇으로 만들겠습니까?",
      lead: "임경수가 장부를 치워 자리를 만들었고, 나준혁이 강원에서 새벽 버스로 올라왔습니다.",
    },
    c10_ledger: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "분담표 확정까지 16h",
      question: "다섯 칸이 채워지고 당신 칸만 비어 있습니다. 거기에 무엇을 적겠습니까?",
    },
    c10_ledger_reaction: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "분담표 확정까지 14h",
      question: "오진우가 지우고 다시 쓴 줄에는 '아버지에게 할 말'이라고 적혀 있었습니다. 어떻게 하겠습니까?",
    },
    c10_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "분담표 확정까지 12h",
      question: "이 조직에서 선의는 평균 31개월 만에 소모됩니다. 이 지표를 어떻게 하겠습니까?",
    },
    c10_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "분담표 확정까지 8h",
      question: "아무도 재지 않은 숫자가 하나 더 생겼습니다. 제도안에 어떻게 올리겠습니까?",
    },
    c10_evidence_turn: {
      place: "트리거랩 2층 인사위원회실",
      clock: "산업재해 심의까지 6h",
      question: "병가 서식에서 '업무상' 보기를 지운 건 기업금융전략팀입니다. 이 이력을 어떻게 쓰겠습니까?",
    },
    c10_final: {
      place: "트리거랩 4층 분석관실",
      clock: "도윤하 복귀 첫날",
      question: "안건에 오르면서 212명이 빠졌고, 그가 새 수첩에 212라고 적었습니다. 말리겠습니까?",
      lead: "도윤하가 2주 만에 돌아왔습니다. 책상 위에는 아직 아무것도 없고, 새 수첩 하나만 놓여 있습니다.",
    },
    c10_aftershock: {
      place: "트리거랩 4층 분석관실",
      clock: "분담표 첫 주 · 금요일 18시",
      question: "이번 주 처음으로 여섯 사람이 명단을 나눠 적었습니다. 이 주말을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c10-default-reason",
    title: "사유란의 기본값",
    text: "4년 전 병가 신청서에서 '업무상' 보기가 삭제됐습니다. 열아홉 명이 같은 문구를 쓴 건 열아홉 번의 선택이 아니라 선택지가 하나였기 때문입니다.",
  },
  outcomes: {
    c10_after_rest: { tag: "불을 끈 결말", title: "4층의 불이 처음으로 정시에 꺼졌다", text: "남은 건은 월요일로 넘어갔고, 여섯 사람은 금요일 저녁을 돌려받았습니다. 오래 가는 일은 오래 갈 수 있는 속도로만 갑니다." },
    c10_after_record: { tag: "제도로 남긴 결말", title: "분담표가 담당자 이름 없이도 도는 문서가 되었다", text: "표는 그룹 제도안으로 접수됐고, 사람이 바뀌어도 남게 됐습니다. 그 표를 누가 자기 성과로 인용할지는 아직 정해지지 않았습니다." },
    c10_after_keep: { tag: "서랍에 남긴 결말", title: "212개의 이름이 여전히 한 사람의 손에 있다", text: "분담표는 돌기 시작했고, 그 표 밖의 이름들은 당신 서랍에 남았습니다. 보관자가 한 명뿐인 기록은 그 한 명과 함께 사라집니다." },
  },
  carryovers: {
    c10_after_rest: { trust: 8, humanCost: -5, fatigue: -8 },
    c10_after_record: { legitimacy: 11, humanCost: 3, fatigue: 5 },
    c10_after_keep: { capital: 5, trust: 6, legitimacy: -9 },
  },
  continuityChallenges: {
    c9_after_stay: { id: "find-cost", title: "이긴 판의 청구서 찾기", text: "1,140명은 지켰습니다. 그 열흘 동안 아무도 청구하지 않은 비용이 어디에 쌓였는지 먼저 찾으면 숨은 단서가 열릴 수 있습니다." },
    c9_after_court: { id: "use-reframe", title: "서식 없는 피해를 서식으로 만들기", text: "법정에서는 모든 피해에 서식이 있었습니다. 서식이 없어서 피해가 아닌 것이 된 쪽으로 판을 다시 짜야 합니다." },
    c9_after_return: { id: "protect-trust", title: "하루 늦은 소식을 늦지 않게 만들기", text: "240km는 늘 한 박자 늦습니다. 사람에게 가장 먼저 닿는 선택을 찾아야 합니다." },
  },
};
