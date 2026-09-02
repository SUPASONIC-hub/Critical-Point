export const CASE_SEQUENCE = ["case01", "case02", "case03", "case04", "case05", "final"];
export const CASE_START_NODES = {
  case01: "start",
  case02: "c2_start",
  case03: "c3_start",
  case04: "c4_start",
  case05: "c5_start",
  final: "f_start",
};
export const CASE_RESULT_NODES = {
  case01: "result",
  case02: "case02_result",
  case03: "case03_result",
  case04: "case04_result",
  case05: "case05_result",
  final: "final_result",
};
export const RESULT_NODE_IDS = new Set(Object.values(CASE_RESULT_NODES));

export const nodeOrders = {
  case01: ["start", "accounting", "payday", "competitor", "board", "final"],
  case02: ["c2_start", "c2_logs", "c2_meeting", "c2_pressure", "c2_final"],
  case03: ["c3_start", "c3_split", "c3_score", "c3_trap", "c3_final"],
  case04: ["c4_start", "c4_offer", "c4_leak", "c4_vote", "c4_final"],
  case05: ["c5_start", "c5_map", "c5_blame", "c5_collapse", "c5_final"],
  final: ["f_start", "f_archive", "f_confront", "f_choice"],
};

export const caseObjectives = {
  case01: "72시간 안에 플로우온의 손실 구조를 선택한다",
  case02: "증거와 사람의 맥락 사이에서 1차 보고 기준을 정한다",
  case03: "오진우보다 빠른 결론이 아니라 더 견고한 판을 만든다",
  case04: "큰 성과를 위해 작은 규칙 위반을 어디까지 허용할지 정한다",
  case05: "악인이 없는 실패에서 책임과 개선 가능성을 구분한다",
  final: "트리거랩의 실험 구조를 마주하고 자신의 트리거 사용 방식을 선택한다",
};

export const seasonCasesBase = [
  {
    id: "case01",
    label: "사건 01",
    title: "72시간",
    trigger: "책임 / 보호 / 부당함",
    status: "PLAYABLE",
    summary: "플로우온의 현금이 72시간 뒤 바닥난다. 생존, 투명성, 직원 보호가 처음 충돌한다.",
  },
  {
    id: "case02",
    label: "사건 02",
    title: "가짜 신호",
    trigger: "신뢰 / 정의 / 애정",
    status: "LOCKED",
    summary: "가까운 동료가 내부 정보 유출자로 지목된다. 증거는 명확하지만 어딘가 조작된 흔적이 있다.",
  },
  {
    id: "case03",
    label: "사건 03",
    title: "경쟁자의 반격",
    trigger: "경쟁 / 인정 / 호기심",
    status: "LOCKED",
    summary: "오진우가 같은 사건을 더 빠르게 해결한다. 플레이어의 반응 패턴이 사건 난이도를 바꾸기 시작한다.",
  },
  {
    id: "case04",
    label: "사건 04",
    title: "치러야 할 대가",
    trigger: "보상 / 책임 / 질서",
    status: "LOCKED",
    summary: "작은 규칙 위반 하나가 수백 명을 살릴 수 있다. 대신 누군가 그 약점을 기록한다.",
  },
  {
    id: "case05",
    label: "사건 05",
    title: "범인은 없었다",
    trigger: "시스템 / 호기심 / 무력감",
    status: "LOCKED",
    summary: "명백한 악인은 없다. 모두가 합리적으로 움직였지만 시스템 전체가 실패한다.",
  },
  {
    id: "final",
    label: "마지막 사건",
    title: "트리거랩의 진실",
    trigger: "자기 인식 / 조종 / 선택",
    status: "LOCKED",
    summary: "트리거랩의 목적이 드러난다. 사고가 활성화되는 조건은 동시에 조종 가능한 조건이었다.",
  },
];

