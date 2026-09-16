/**
 * What each case is, and what all nine turn out to be.
 *
 * The season used to be an anthology: seven unrelated organisations, each with
 * its own crisis, strung together by a lab that watched the analyst react. That
 * made every case disposable -- nothing the player learned in 사건 01 could be
 * used in 사건 04, so nothing in 사건 01 mattered.
 *
 * They are now one chain. A single bad loan -- the 310억 KD은행 lent 플로우온
 * three years ago -- runs under all seven: 사건 01 is the loan collapsing, 02 is
 * the cover-up of its paperwork, 03 and 04 are the two places the bank tried to
 * move the loss to, 05 is where the loss finally lands on people who never
 * borrowed anything, 06 is what the chain does to the analyst in the next chair,
 * 07 is the posting that was meant to end it, 08 follows the money the chain paid
 * out to the man at the top of it, 09 goes back to 플로우온 to save it and charge
 * the people who broke it on the same table, and the finale is the empty
 * signature box the whole thing hangs from.
 */
export const CASE_SEQUENCE = ["case01", "case02", "case03", "case04", "case05", "case06", "case07", "case08", "case09", "final"];
export const CASE_START_NODES = {
  case01: "start",
  case02: "c2_start",
  case03: "c3_start",
  case04: "c4_start",
  case05: "c5_start",
  case06: "c6_start",
  case07: "c7_start",
  case08: "c8_start",
  case09: "c9_start",
  final: "f_start",
};
export const CASE_RESULT_NODES = {
  case01: "result",
  case02: "case02_result",
  case03: "case03_result",
  case04: "case04_result",
  case05: "case05_result",
  case06: "case06_result",
  case07: "case07_result",
  case08: "case08_result",
  case09: "case09_result",
  final: "final_result",
};
export const RESULT_NODE_IDS = new Set(Object.values(CASE_RESULT_NODES));

export const nodeOrders = {
  case01: ["start", "accounting", "payday", "competitor", "board", "final"],
  case02: ["c2_start", "c2_logs", "c2_meeting", "c2_pressure", "c2_final"],
  case03: ["c3_start", "c3_split", "c3_score", "c3_trap", "c3_final"],
  case04: ["c4_start", "c4_offer", "c4_leak", "c4_vote", "c4_final"],
  case05: ["c5_start", "c5_map", "c5_blame", "c5_collapse", "c5_final"],
  case06: ["c6_start", "c6_desk", "c6_logs", "c6_panel", "c6_final"],
  case07: ["c7_start", "c7_ledger", "c7_counter", "c7_paper", "c7_final"],
  case08: ["c8_start", "c8_trail", "c8_gallery", "c8_bait", "c8_final"],
  case09: ["c9_start", "c9_ledger", "c9_family", "c9_timing", "c9_final"],
  final: ["f_start", "f_archive", "f_confront", "f_choice"],
};

export const caseObjectives = {
  case01: "3년 전 당신이 반대했던 그 대출의 마지막 72시간을 어떻게 닫을지 정한다",
  case02: "조작된 접속 기록이 가리키는 사람과 그 기록을 만든 손 중 어느 쪽을 먼저 보고할지 정한다",
  case03: "오진우보다 빠른 결론이 아니라, 3년 뒤에도 무너지지 않는 판을 만든다",
  case04: "은행의 상환 요구가 만들어 낸 3% 부족분을 어디까지 손댈지 정한다",
  case05: "악인이 없는 실패에서 책임과 개선 가능성을 구분한다",
  case06: "옆자리 동료의 붕괴에서 보호와 기록 중 무엇을 먼저 둘지 정한다",
  case07: "발령까지 48시간 동안 무엇을 모으고, 그 대가를 누구에게 지울지 정한다",
  case08: "윤상혁에게 이어진 돈의 흔적을 복수가 아니라 증거로 남길 방법을 정한다",
  case09: "플로우온을 살리는 계산서와 무너뜨린 사람을 벌하는 계산서를 한 테이블에 올린다",
  final: "플로우온 심사 보고서의 빈 서명란에 누구의 이름이 있어야 했는지 확정한다",
};

export const seasonCasesBase = [
  {
    id: "case01",
    label: "사건 01",
    title: "72시간",
    trigger: "책임 / 보호 / 부당함",
    status: "PLAYABLE",
    summary:
      "플로우온의 현금이 72시간 뒤 바닥난다. 훈련용 사례라고 했지만, 3년 전 당신이 은행에서 혼자 반대했던 바로 그 대출이다.",
  },
  {
    id: "case02",
    label: "사건 02",
    title: "가짜 신호",
    trigger: "신뢰 / 정의 / 애정",
    status: "LOCKED",
    summary:
      "계약직 동료가 유출자로 지목된다. 새어 나갔다는 파일은 플로우온 대출 심사 보고서 원본이고, 접속 기록은 사람이 만든 것처럼 깔끔하다.",
  },
  {
    id: "case03",
    label: "사건 03",
    title: "경쟁자의 반격",
    trigger: "경쟁 / 인정 / 호기심",
    status: "LOCKED",
    summary:
      "세움테크 입찰에서 오진우와 같은 자료로 겨룬다. 이 입찰 자체가 플로우온의 손실을 다른 회사 장부로 옮기는 통로일 수 있다.",
  },
  {
    id: "case04",
    label: "사건 04",
    title: "치러야 할 대가",
    trigger: "보상 / 책임 / 질서",
    status: "LOCKED",
    summary:
      "돌봄 플랫폼 온새의 심사 점수 3% 부족은 우연이 아니다. 그 3%는 KD은행이 갑자기 앞당긴 대출 상환 일정이 만들어 냈다.",
  },
  {
    id: "case05",
    label: "사건 05",
    title: "범인은 없었다",
    trigger: "시스템 / 호기심 / 무력감",
    status: "LOCKED",
    summary:
      "명백한 악인은 없다. 모두가 규정대로 움직였고, 그 규정을 맨 위에서 누르고 있던 것은 3년 전 계약서 한 장이다.",
  },
  {
    id: "case06",
    label: "사건 06",
    title: "같은 방의 사람",
    trigger: "경쟁 / 애정 / 자기 인식",
    status: "LOCKED",
    summary:
      "경쟁자 오진우가 무너진다. 그를 몰아붙인 압박 조건은 당신의 실험과 같은 번호를 쓰고 있었다.",
  },
  {
    id: "case07",
    label: "사건 07",
    title: "되갚는 자리",
    trigger: "부당함 / 신뢰 / 선택",
    status: "LOCKED",
    summary:
      "징계가 아니라 인사다. 48시간 뒤면 당신은 240km 밖 지점에 있고, 파일은 여기 남는다. 그 48시간에 누가 손을 내미는지가 이 사건이다.",
  },
  {
    id: "case08",
    label: "사건 08",
    title: "돈의 흔적",
    trigger: "복수 / 욕망 / 부당함",
    status: "LOCKED",
    summary:
      "좌천된 지점의 휴면 계좌(오래 거래가 끊긴 계좌) 하나가 분기마다 자문료를 받아 서울의 갤러리로 보낸다. 사람은 욕망을 갖고, 욕망은 돈을 쓰고, 돈은 흔적을 남긴다.",
  },
  {
    id: "case09",
    label: "사건 09",
    title: "두 장의 손익계산서",
    trigger: "애정 / 책임 / 보상",
    status: "LOCKED",
    summary:
      "플로우온이 다시 72시간 앞에 선다. 이번 안건은 청산(회사를 정리해 없애는 절차)이다. 회사를 살리는 계산서와 무너뜨린 사람을 벌하는 계산서를 한 테이블에 올려야 한다.",
  },
  {
    id: "final",
    label: "마지막 사건",
    title: "빈 서명란",
    trigger: "자기 인식 / 조종 / 선택",
    status: "LOCKED",
    summary:
      "플로우온 심사 보고서의 서명란은 3년째 비어 있다. 그 칸을 비워 둔 사람이 트리거랩을 만들었고, 당신을 여기로 보냈다.",
  },
];
