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
      "인사 발령서가 도착했습니다. 강원 영동지점 기업대출 담당, 48시간 뒤부터 적용. 징계가 아니라 인사이므로 이의 절차도, 사유 고지도 없습니다. 한서윤이 종이를 뒤집어 마지막 장을 보여줍니다. 최종 승인란이 비어 있습니다. '3년 전 그 서류하고 같은 모양입니다. 이 사람은 이름을 안 씁니다. 자리를 씁니다.'",
    memo: [
      "적용까지 48시간, 이의 절차 없음",
      "발령 문서 최종 승인란: 공란",
      "발령서 작성일은 사건 06 개시보다 12일 앞섬",
      "발령 후에는 사내 기록 열람 권한이 지점 범위로 축소됨",
    ],
    triggers: ["injustice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c7_start_gather",
        label: "남은 48시간을 자료를 모으는 데 전부 쓴다",
        effect: { time: -12, legitimacy: 7, trust: 5, fatigue: 4 },
        next: "c7_ledger",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c7_start_appeal",
        label: "발령 자체에 공식 이의를 제기한다",
        effect: { time: -6, legitimacy: 11, capital: -9, fatigue: 3 },
        next: "c7_ledger",
        cognition: { risk: 1, persistence: 1 },
      },
      {
        id: "c7_start_accept",
        label: "발령을 받아들이고 인수인계부터 끝낸다",
        effect: { time: 9, capital: 8, trust: -12, legitimacy: -6, fatigue: 2 },
        next: "c7_ledger",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c7_ledger",
      },
    ],
  },
  c7_ledger: {
    phase: "THE NOTEBOOK",
    title: "반재욱의 수첩",
    speaker: "반재욱",
    text:
      "감사팀 서고에서 반재욱이 표지가 닳은 수첩을 꺼냅니다. 그가 조사해서 자리를 잃은 사람 마흔한 명의 이름과 날짜가 순서대로 적혀 있습니다. 뒤쪽 한 줄은 연필입니다. 당신의 이름, 그리고 2주 전 날짜. '나는 내가 자른 사람을 다 적습니다. 지우면 안 자른 게 되니까요.' 이 수첩은 규정상 존재하면 안 되는 기록이고, 제출하는 순간 그의 경력도 같이 끝납니다.",
    memo: [
      "수첩에 적힌 이름 41명, 마지막 줄은 연필",
      "당신의 이름이 적힌 날짜: 사건 06 개시 12일 전",
      "감사역의 사적 기록 보관은 내부 규정 위반",
      "제출하면 반재욱도 함께 조사 대상이 됨",
    ],
    triggers: ["trust", "responsibility", "affection"],
    choices: [
      {
        id: "c7_ledger_take",
        label: "수첩 전체를 증거로 받는다",
        effect: { legitimacy: 13, trust: 6, humanCost: 9, fatigue: 5 },
        next: "c7_counter",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c7_ledger_page",
        label: "내 이름이 적힌 한 장만 받는다",
        effect: { legitimacy: 6, trust: 9, humanCost: -4, time: -4, fatigue: 3 },
        next: "c7_counter",
        cognition: { reframing: 2 },
      },
      {
        id: "c7_ledger_refuse",
        label: "수첩은 두고, 그의 증언만 요청한다",
        effect: { trust: 12, legitimacy: -5, humanCost: -7, time: -8, fatigue: 4 },
        next: "c7_counter",
        cognition: { persistence: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c7_counter",
      },
    ],
  },
  c7_counter: {
    phase: "THE COUNTER",
    title: "강서지점의 3년",
    speaker: "도윤하",
    text:
      "도윤하가 3년 만에 강서지점 문을 엽니다. 그를 창구에서 내보낸 지점장은 아직 그 자리에 있습니다. 필요한 것은 플로우온 대출 신청서 원본 뒷장 -- 그해 지점에 내려온 판매 목표표가 그대로 붙어 있는 장입니다. 지점장은 줄 수 있습니다. 대신 그 서류가 나가면 그때 그 창구에 앉았던 사람 이름이 전부 따라 나갑니다. 도윤하의 이름부터입니다.",
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
        next: "c7_paper",
        cognition: { risk: 2 },
      },
      {
        id: "c7_counter_mask",
        label: "담당자 이름을 지운 사본만 받는다",
        effect: { legitimacy: 5, trust: 7, humanCost: -6, time: -7, fatigue: 5 },
        next: "c7_paper",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c7_counter_ask",
        label: "네 사람에게 먼저 묻고 결정한다",
        effect: { time: -12, trust: 13, legitimacy: 4, humanCost: -9, fatigue: 6 },
        next: "c7_paper",
        cognition: { persistence: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c7_paper",
      },
    ],
  },
  c7_paper: {
    phase: "THE PAGE",
    title: "태운 자리",
    speaker: "임경수",
    text:
      "헌책방 2층. 임경수가 끈을 풀고 종이 한 장을 밀어 놓습니다. 2023-0412 심사 보고서 3페이지 원본, 서명란이 비어 있고 그 아래에 연필로 적힌 지시자 이니셜이 남아 있습니다. 전산에는 없는 장입니다. 그리고 그가 처음으로 뭔가를 요구합니다. '보호해 주겠다는 말은 마시오. 4년 동안 이걸 들고 책방에 앉아 있었어요. 낼 거면 내 이름을 맨 위에 쓰시오. 그게 내가 받고 싶은 겁니다.'",
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
        next: "c7_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c7_paper_shield",
        label: "요청을 접어 두고 익명 자료로 낸다",
        effect: { legitimacy: 4, trust: -6, humanCost: -8, fatigue: 4 },
        next: "c7_final",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "c7_paper_pair",
        label: "그의 이름 옆에 내 이름도 같이 쓴다",
        effect: { legitimacy: 11, trust: 12, humanCost: 3, time: -5, fatigue: 5 },
        next: "c7_final",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c7_final",
      },
    ],
  },
  c7_final: {
    phase: "FINAL DECISION",
    title: "누구 이름으로 가져갈 것인가",
    speaker: "오진우",
    text:
      "적용까지 6시간. 마지막 한 조각은 오진우의 진술입니다. 결정 제한시간이 설정값이었다고 말할 수 있는 사람은 그 조건을 겪은 본인뿐입니다. 그가 책상 정리를 멈추고 묻습니다. '그 문서에 이름이 몇 개 올라갑니까.' 그리고 덧붙입니다. '저는 아버지 이름을 30년 동안 그 서류에서 못 지웠습니다. 이번엔 누구 이름이 남는지 먼저 알고 싶습니다.'",
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
        next: "case07_result",
        cognition: { risk: 2, inference: 1 },
      },
      {
        id: "c7_final_mine",
        label: "내 이름 하나만 올리고 나머지는 자료로만 낸다",
        effect: { legitimacy: 9, trust: 14, humanCost: -10, capital: -8, fatigue: 6 },
        next: "case07_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c7_final_none",
        label: "이름 없이 자료만 익명으로 넘긴다",
        effect: { capital: 11, legitimacy: -7, trust: -9, humanCost: -5, time: 6, fatigue: 2 },
        next: "case07_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case07_result",
      },
    ],
  },
};
