/** CASE 05 -- the authored scenes of the collapse case. */
export const case05Nodes = {
  c5_start: {
    phase: "CASE 05 BRIEFING",
    title: "NO ONE TO BLAME",
    speaker: "반재욱",
    text:
      "도시형 돌봄 배차 시스템에서 대규모 누락 사고가 발생했습니다. 312명이 예정된 서비스를 받지 못했고, 언론은 책임자를 요구합니다. 그런데 첫 자료를 보면 모두가 규정대로 행동했습니다.",
    memo: [
      "서비스 누락: 312명",
      "현장 직원은 매뉴얼대로 처리",
      "알고리즘은 승인된 기준대로 작동",
      "관리자는 경고 지표를 받지 못했다고 주장",
    ],
    triggers: ["responsibility", "curiosity", "order"],
    choices: [
      {
        id: "c5_start_blame",
        label: "운영 책임자를 특정해 조사한다",
        effect: { trust: -4, legitimacy: 5, fatigue: 2 },
        next: "c5_map",
        cognition: { risk: 1 },
      },
      {
        id: "c5_start_map",
        label: "누락이 생긴 전체 의사결정 흐름을 그린다",
        effect: { time: -12, legitimacy: 2, fatigue: 4 },
        next: "c5_map",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c5_start_redesign",
        label: "즉시 임시 수동 배차 체계로 전환한다",
        effect: { capital: -8, trust: 6, humanCost: -8, fatigue: 4 },
        next: "c5_map",
        cognition: { reframing: 1, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c5_map",
      },
    ],
  },
  c5_map: {
    phase: "SYSTEM MAP",
    title: "합리적인 조각들",
    speaker: "에코",
    text:
      "각 부서는 합리적으로 움직였습니다. 예산팀은 비용 초과를 막았고, 운영팀은 우선순위 규칙을 따랐고, 시스템은 승인된 가중치를 적용했습니다. 문제는 그 합리성이 합쳐진 결과입니다.",
    memo: [
      "예산팀: 비용 상한 준수",
      "운영팀: 우선순위 규칙 준수",
      "시스템: 승인된 가중치 적용",
      "누락자는 여러 기준에서 조금씩 밀린 사람들",
    ],
    triggers: ["curiosity", "order", "responsibility"],
    choices: [
      {
        id: "c5_map_map",
        label: "기준별로 밀려난 사람들의 공통점을 찾는다",
        effect: { time: -10, legitimacy: 3, fatigue: 4 },
        next: "c5_blame",
        cognition: { inference: 3 },
      },
      {
        id: "c5_map_blame",
        label: "경고 지표를 놓친 관리자 책임을 묻는다",
        effect: { trust: -6, legitimacy: 5, fatigue: 2 },
        next: "c5_blame",
        cognition: { risk: 1 },
      },
      {
        id: "c5_map_redesign",
        label: "누락자 보호 가중치를 임시로 높인다",
        effect: { capital: -6, trust: 6, humanCost: -10, fatigue: 4 },
        next: "c5_blame",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c5_blame",
      },
    ],
  },
  c5_blame: {
    phase: "PUBLIC PRESSURE",
    title: "누군가는 책임져야 한다",
    speaker: "오진우",
    text:
      "오진우는 말합니다. '악인이 없다는 말은 대중에게 변명처럼 들립니다. 책임자를 세우지 않으면 조직 전체가 무너집니다.' 그의 말은 틀리지 않습니다.",
    memo: [
      "언론은 책임자 실명을 요구",
      "피해자 단체는 즉시 사과와 보상을 요구",
      "관리자 한 명을 징계하면 여론은 빠르게 가라앉을 가능성",
      "근본 구조는 그대로 남을 수 있음",
    ],
    triggers: ["responsibility", "competition", "injustice"],
    choices: [
      {
        id: "c5_blame_blame",
        label: "관리자 징계와 보상안을 먼저 발표한다",
        effect: { trust: 8, legitimacy: 2, humanCost: -4, fatigue: 2 },
        next: "c5_collapse",
        cognition: { risk: 2 },
      },
      {
        id: "c5_blame_map",
        label: "단일 책임보다 구조 실패 보고서를 발표한다",
        effect: { trust: -6, legitimacy: 5, fatigue: 4 },
        next: "c5_collapse",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c5_blame_redesign",
        label: "징계, 보상, 시스템 개편을 한 패키지로 묶는다",
        effect: { capital: -8, trust: 5, legitimacy: 4, humanCost: -6, fatigue: 5 },
        next: "c5_collapse",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c5_collapse",
      },
    ],
  },
  c5_collapse: {
    phase: "COLLAPSE",
    title: "선의의 실패",
    speaker: "도윤하",
    text:
      "도윤하가 현장 기록을 보여줍니다. 누락된 사람들은 불만을 많이 제기하지 않았고, 가족 연락처도 불안정했고, 이전 이용 기록도 적었습니다. 시스템은 '조용한 사람들'을 낮은 우선순위로 밀어냈습니다.",
    memo: [
      "불만 제기 빈도 낮음",
      "가족 연락처 불안정",
      "이전 이용 기록 부족",
      "도움 요청 능력이 낮은 사람이 더 쉽게 누락됨",
    ],
    triggers: ["protection", "curiosity", "order"],
    choices: [
      {
        id: "c5_collapse_redesign",
        label: "조용한 사람을 보호하는 역가중치를 넣는다",
        effect: { capital: -10, trust: 8, legitimacy: 5, humanCost: -12, fatigue: 4 },
        next: "c5_final",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "c5_collapse_blame",
        label: "기존 관리자 책임과 현장 보완 교육을 선택한다",
        effect: { trust: 4, legitimacy: 3, humanCost: -4, fatigue: 2 },
        next: "c5_final",
        cognition: { risk: 1 },
      },
      {
        id: "c5_collapse_map",
        label: "피해자 기준으로 전체 지표를 다시 설계한다",
        effect: { time: -12, capital: -8, legitimacy: 6, humanCost: -10, fatigue: 5 },
        next: "c5_final",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꾼다",
        type: "free",
        next: "c5_final",
      },
    ],
  },
  c5_final: {
    phase: "FINAL DECISION",
    title: "악인이 없을 때",
    speaker: "한서윤",
    text:
      "이 사건에는 뚜렷한 악인이 없습니다. 하지만 피해는 실제입니다. 당신은 책임을 개인에게 집중할지, 시스템을 바꿀지, 둘 사이의 불완전한 조합을 선택해야 합니다.",
    memo: [
      "개인 징계는 빠른 설명을 제공",
      "시스템 개편은 느리지만 반복을 줄임",
      "피해자 보상은 즉시 필요",
      "FINAL CASE에서 트리거랩의 실험 구조가 드러남",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "final_blame",
        label: "책임자 징계와 피해 보상을 우선한다",
        effect: { trust: 8, legitimacy: 2, humanCost: -8, fatigue: 2 },
        next: "case05_result",
        cognition: { risk: 2 },
      },
      {
        id: "c5_final_final_system",
        label: "시스템 개편과 피해자 기준 재설계를 우선한다",
        effect: { capital: -12, trust: 3, legitimacy: 7, humanCost: -12, fatigue: 5 },
        next: "case05_result",
        cognition: { reframing: 2, inference: 2 },
      },
      {
        id: "final_both",
        label: "징계, 보상, 재설계를 불완전하게라도 묶는다",
        effect: { capital: -10, trust: 8, legitimacy: 5, humanCost: -10, fatigue: 5 },
        next: "case05_result",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case05_result",
      },
    ],
  },
};
