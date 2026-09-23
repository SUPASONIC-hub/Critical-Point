/**
 * CASE 05 -- the authored scenes of the collapse case.
 *
 * This is where the loan finally lands on people who never borrowed anything.
 * The dispatch algorithm's budget ceiling came from the repayment terms the bank
 * imposed in 사건 04; every team downstream of that ceiling behaved correctly and
 * 312 people were dropped anyway. The case keeps its answer -- there is no
 * villain here -- but now the player can see the room the villain was in, three
 * years earlier, and that the reviewer who signed the weighting table is the man
 * in the next chair.
 */
export const case05Nodes = {
  c5_start: {
    phase: "CASE 05 BRIEFING",
    title: "NO ONE TO BLAME",
    speaker: "반재욱",
    text:
      "도시형 돌봄 배차 시스템에서 대규모 누락 사고가 났습니다. 312명이 예정된 방문 서비스를 받지 못했고, 언론은 책임자를 요구합니다. 그런데 첫 자료를 보면 모두가 규정대로 행동했습니다. 반재욱이 수첩을 펼칩니다. '규정을 따라 올라가 봤습니다. 맨 위에 있는 건 사람이 아니라 예산 상한선이고, 그 상한선은 온새 상환(빌린 돈을 갚는 일) 조건표에서 그대로 내려왔습니다.'",
    memo: [
      "서비스 누락: 312명",
      "현장 직원은 안내서대로 처리",
      "배차 시스템은 승인된 기준대로 작동",
      "예산 상한선의 출처: 사건 04의 상환 조건표",
    ],
    triggers: ["responsibility", "curiosity", "order"],
    choices: [
      {
        id: "c5_start_blame",
        label: "운영 책임자를 특정해 조사한다",
        effect: { trust: -4, legitimacy: 6, fatigue: 2 },
        next: "c5_map",
        cognition: { risk: 1 },
      },
      {
        id: "c5_start_map",
        label: "누락이 생긴 전체 의사결정 흐름을 그린다",
        effect: { time: -12, legitimacy: 3, fatigue: 4 },
        next: "c5_map",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c5_start_redesign",
        label: "즉시 임시 수동 배차 체계로 전환한다",
        effect: { capital: -8, trust: 7, humanCost: -9, fatigue: 4 },
        next: "c5_map",
        cognition: { reframing: 1, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c5_map",
      },
    ],
  },
  c5_map: {
    phase: "SYSTEM MAP",
    title: "합리적인 조각들",
    speaker: "에코",
    text:
      "각 부서는 합리적으로 움직였습니다. 예산팀은 상한을 지켰고, 운영팀은 우선순위 규칙을 따랐고, 시스템은 승인된 가중치를 적용했습니다. 문제는 그 합리성이 합쳐진 결과입니다. 에코가 가중치표의 승인 이력을 엽니다. 마지막 검토자 칸에 이름이 하나 있습니다. 오진우입니다.",
    memo: [
      "예산팀: 비용 상한 준수",
      "운영팀: 우선순위 규칙 준수",
      "시스템: 승인된 가중치 적용",
      "가중치표 최종 검토자: 오진우 (검토 시간 6분)",
    ],
    triggers: ["curiosity", "order", "responsibility"],
    choices: [
      {
        id: "c5_map_map",
        label: "기준별로 밀려난 사람들의 공통점을 찾는다",
        effect: { time: -10, legitimacy: 4, fatigue: 4 },
        next: "c5_blame",
        cognition: { inference: 3 },
      },
      {
        id: "c5_map_blame",
        label: "경고 지표를 놓친 관리자 책임을 묻는다",
        effect: { trust: -6, legitimacy: 6, fatigue: 2 },
        next: "c5_blame",
        cognition: { risk: 1 },
      },
      {
        id: "c5_map_redesign",
        label: "누락자 보호 가중치를 임시로 높인다",
        effect: { capital: -6, trust: 7, humanCost: -11, fatigue: 4 },
        next: "c5_blame",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
        next: "c5_blame",
      },
    ],
  },
  c5_blame: {
    phase: "PUBLIC PRESSURE",
    title: "누군가는 책임져야 한다",
    speaker: "오진우",
    text:
      "오진우가 말합니다. '악인이 없다는 말은 밖에서 들으면 변명입니다. 책임자를 세우지 않으면 조직 전체가 흔들립니다.' 틀린 말이 아닙니다. 그리고 그가 잠깐 멈췄다가 덧붙입니다. '그 가중치표, 제가 6분 보고 넘겼습니다. 그때 제 검토 제한시간이 6분이었거든요. 누가 정했는지는 저도 모릅니다.'",
    memo: [
      "언론은 책임자 실명을 요구",
      "피해자 단체는 즉시 사과와 보상을 요구",
      "관리자 한 명을 징계하면 여론은 빠르게 가라앉을 가능성",
      "오진우의 검토 제한시간은 그가 정하지 않았음",
    ],
    triggers: ["responsibility", "competition", "injustice"],
    choices: [
      {
        id: "c5_blame_blame",
        label: "관리자 징계와 보상안을 먼저 발표한다",
        effect: { trust: 9, legitimacy: 3, humanCost: -5, fatigue: 2 },
        next: "c5_collapse",
        cognition: { risk: 2 },
      },
      {
        id: "c5_blame_map",
        label: "단일 책임보다 구조 실패 보고서를 발표한다",
        effect: { trust: -6, legitimacy: 6, fatigue: 4 },
        next: "c5_collapse",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c5_blame_redesign",
        label: "징계, 보상, 시스템 개편을 한 패키지로 묶는다",
        effect: { capital: -8, trust: 6, legitimacy: 5, humanCost: -7, fatigue: 5 },
        next: "c5_collapse",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c5_collapse",
      },
    ],
  },
  c5_collapse: {
    phase: "COLLAPSE",
    title: "선의의 실패",
    speaker: "도윤하",
    text:
      "도윤하가 현장 기록을 펼칩니다. 누락된 사람들은 불만을 거의 제기하지 않았고, 가족 연락처가 불안정했고, 이전 이용 기록도 적었습니다. 시스템은 '조용한 사람들'을 낮은 우선순위로 밀어냈습니다. 도윤하가 목록의 한 줄을 짚습니다. '이분, 플로우온 야간조였던 분입니다. 작년에 정리됐고, 올해 돌봄 대상이 됐습니다.'",
    memo: [
      "불만 제기 빈도 낮음",
      "가족 연락처 불안정",
      "이전 이용 기록 부족",
      "누락자 명단에 플로우온 퇴직자 7명 포함",
    ],
    triggers: ["protection", "curiosity", "order"],
    choices: [
      {
        id: "c5_collapse_redesign",
        label: "조용한 사람을 보호하는 역가중치를 넣는다",
        effect: { capital: -10, trust: 9, legitimacy: 6, humanCost: -13, fatigue: 4 },
        next: "c5_final",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c5_collapse_blame",
        label: "기존 관리자 책임과 현장 보완 교육을 선택한다",
        effect: { trust: 5, legitimacy: 4, humanCost: -5, fatigue: 2 },
        next: "c5_final",
        cognition: { risk: 1 },
      },
      {
        id: "c5_collapse_map",
        label: "피해자 기준으로 전체 지표를 다시 설계한다",
        effect: { time: -12, capital: -8, legitimacy: 7, humanCost: -11, fatigue: 5 },
        next: "c5_final",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꾼다",
        type: "reframe",
        next: "c5_final",
      },
    ],
  },
  c5_final: {
    phase: "FINAL DECISION",
    title: "악인이 없을 때",
    speaker: "한서윤",
    text:
      "이 사건에는 뚜렷한 악인이 없습니다. 하지만 피해는 실제입니다. 한서윤이 창밖을 보며 말합니다. '악인이 없는 게 아닙니다. 3년 전 회의실에 있었고, 그 방 회의록은 남지 않았을 뿐입니다.' 당신은 책임을 개인에게 모을지, 시스템을 바꿀지, 둘 사이의 불완전한 조합을 택할지 정해야 합니다.",
    memo: [
      "개인 징계는 빠른 설명을 제공",
      "시스템 개편은 느리지만 반복을 줄임",
      "피해자 보상은 즉시 필요",
      "3년 전 그 회의의 회의록은 존재하지 않음",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "final_blame",
        label: "책임자 징계와 피해 보상을 우선한다",
        effect: { trust: 9, legitimacy: 3, humanCost: -9, fatigue: 2 },
        next: "case05_result",
        cognition: { risk: 2 },
      },
      {
        id: "c5_final_final_system",
        label: "시스템 개편과 피해자 기준 재설계를 우선한다",
        effect: { capital: -12, trust: 4, legitimacy: 8, humanCost: -13, fatigue: 5 },
        next: "case05_result",
        cognition: { reframing: 2, inference: 2 },
      },
      {
        id: "final_both",
        label: "징계, 보상, 재설계를 불완전하게라도 묶는다",
        effect: { capital: -10, trust: 9, legitimacy: 6, humanCost: -11, fatigue: 5 },
        next: "case05_result",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case05_result",
      },
    ],
  },
};
