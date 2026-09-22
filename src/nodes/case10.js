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
 * everyone hurt by the loan she sold at a branch counter three years ago --
 * stops being able to stand up. The group files it as a personal matter, and
 * her list, having never been an official record, is due for deletion.
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
        next: "c10_locker",
        cognition: { inference: 2 },
      },
      {
        id: "c10_start_claim",
        label: "도윤하의 산업재해 신청부터 접수한다",
        effect: { trust: 13, humanCost: -7, capital: -6, time: -5, fatigue: 4 },
        next: "c10_locker",
        cognition: { persistence: 2 },
      },
      {
        id: "c10_start_cover",
        label: "그를 깨우지 않고 업무부터 인수한다",
        effect: { time: 8, capital: 7, trust: -9, humanCost: 6, fatigue: -3 },
        next: "c10_locker",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
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
        next: "c10_claim",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c10_locker_money",
        label: "그가 사비로 보낸 47건부터 추적한다",
        effect: { trust: 10, humanCost: -6, time: -7, legitimacy: 4, fatigue: 4 },
        next: "c10_claim",
        cognition: { inference: 3 },
      },
      {
        id: "c10_locker_close",
        label: "미해결 1,128명은 덮고 해결분만 이관한다",
        effect: { time: 9, capital: 10, trust: -10, humanCost: 9, legitimacy: -5 },
        next: "c10_claim",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c10_claim",
      },
    ],
  },
  c10_claim: {
    phase: "COUNTER PRESSURE",
    title: "소진은 재해인가",
    speaker: "반재욱",
    text:
      "산업재해(일하다 생긴 병이나 다침을 회사와 국가가 함께 책임지는 제도) 인정 여부를 가리는 회의가 열렸습니다. 쟁점은 하나입니다. 탈진이 업무 때문이라는 걸 증명하려면, 도윤하가 규정 밖에서 얼마나 무리했는지를 기록으로 내야 합니다. 그 기록은 동시에 그가 3년간 사규를 어긴 증거입니다. 반재욱이 수첩을 덮고 처음으로 자기 손을 봅니다. '20년 동안 이 자리에서 사람을 잘랐습니다. 오늘은 이 서류가 저 사람을 살리는지 자르는지 저도 모르겠습니다.'",
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
        next: "c10_relay",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c10_claim_narrow",
        label: "위반은 빼고 근무 시간 기록만으로 다툰다",
        effect: { capital: 8, time: 6, legitimacy: -7, trust: -5, fatigue: 2 },
        next: "c10_relay",
        cognition: { risk: 2 },
      },
      {
        id: "c10_claim_system",
        label: "개인 심의가 아니라 제도 결함으로 안건을 바꾼다",
        effect: { legitimacy: 9, trust: 11, capital: -8, time: -8, humanCost: -6, fatigue: 6 },
        next: "c10_relay",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c10_relay",
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
        next: "c10_final",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c10_relay_pay",
        label: "무보수로 두지 않겠다며 수당 예산부터 따낸다",
        effect: { capital: -10, trust: 12, legitimacy: 8, time: -7, fatigue: 5 },
        next: "c10_final",
        cognition: { persistence: 3 },
      },
      {
        id: "c10_relay_keep",
        label: "정식 조직이 되면 식는다며 지금의 약속으로 둔다",
        effect: { trust: 9, time: 7, legitimacy: -9, humanCost: 7, fatigue: -4 },
        next: "c10_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c10_final",
      },
    ],
  },
  c10_final: {
    phase: "FINAL DECISION",
    title: "멈추는 법",
    speaker: "도윤하",
    text:
      "도윤하가 2주 만에 돌아옵니다. 명단은 이제 제도가 됐고, 제도가 되면서 212명이 빠졌습니다. 서류가 남지 않은 사람, 대출 명의가 가족이던 사람, 이미 시효(법으로 책임을 물을 수 있는 기간)가 지난 사람. 규정은 그들을 담을 칸이 없습니다. 도윤하가 책상에 앉아 새 수첩을 꺼내 첫 장에 212라고 적습니다. 그리고 당신을 봅니다. '알아요. 이러다 또 쓰러진다는 거. 그런데 이 212명은 제가 안 적으면 아무 데도 없어요. 말려 주실 겁니까, 같이 적으실 겁니까.'",
    memo: [
      "제도에 편입된 916명, 규정 밖으로 밀려난 212명",
      "212명은 어느 공식 명부에도 존재하지 않음",
      "도윤하의 의사 소견: 3개월 내 재발 가능성 높음",
      "이 선택은 시즌 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "affection", "selfAwareness"],
    choices: [
      {
        id: "c10_final_stop",
        label: "수첩을 덮게 하고 212명은 제도 개정으로 미룬다",
        effect: { legitimacy: 12, humanCost: 8, trust: -6, time: 6, fatigue: -5 },
        next: "case10_result",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c10_final_join",
        label: "그 수첩의 절반을 내 이름으로 나눠 적는다",
        effect: { trust: 15, humanCost: -9, capital: -6, time: -7, fatigue: 7 },
        next: "case10_result",
        cognition: { persistence: 3 },
      },
      {
        id: "c10_final_rule",
        label: "212명이 들어갈 칸을 규정에 새로 만들자고 요구한다",
        effect: { legitimacy: 10, trust: 9, capital: -9, time: -9, humanCost: -5, fatigue: 6 },
        next: "case10_result",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case10_result",
      },
    ],
  },
};
