/**
 * What each case is, and what all twelve turn out to be.
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
 * the people who broke it on the same table, 10 is the bill the people who won
 * it are handed the week after, 11 is the first room the whole country can see
 * into -- a 국정감사 with the man at the top of the chain summoned and absent --
 * 12 walks into the lives the loan landed on, where a compensation fund comes
 * with a condition, and the finale is the empty signature box the whole thing
 * hangs from.
 */
export const CASE_SEQUENCE = ["case01", "case02", "case03", "case04", "case05", "case06", "case07", "case08", "case09", "case10", "case11", "case12", "case13", "case14", "case15", "case16", "case17", "case18", "case19", "case20", "case21", "case22", "case23", "case24", "final"];
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
  case10: "c10_start",
  case11: "c11_start",
  case12: "c12_start",
  case13: "c13_start",
  case14: "c14_start",
  case15: "c15_start",
  case16: "c16_start",
  case17: "c17_start",
  case18: "c18_start",
  case19: "c19_start",
  case20: "c20_start",
  case21: "c21_start",
  case22: "c22_start",
  case23: "c23_start",
  case24: "c24_start",
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
  case10: "case10_result",
  case11: "case11_result",
  case12: "case12_result",
  case13: "case13_result",
  case14: "case14_result",
  case15: "case15_result",
  case16: "case16_result",
  case17: "case17_result",
  case18: "case18_result",
  case19: "case19_result",
  case20: "case20_result",
  case21: "case21_result",
  case22: "case22_result",
  case23: "case23_result",
  case24: "case24_result",
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
  case10: ["c10_start", "c10_locker", "c10_claim", "c10_relay", "c10_final"],
  case11: ["c11_start", "c11_script", "c11_rehearsal", "c11_sign", "c11_final"],
  case12: ["c12_start", "c12_mediation", "c12_market", "c12_memorial", "c12_final"],
  case13: ["c13_start", "c13_studio", "c13_market", "c13_lab", "c13_final"],
  case14: ["c14_start", "c14_counter", "c14_desk", "c14_class", "c14_final"],
  case15: ["c15_start", "c15_form", "c15_rooftop", "c15_gate", "c15_final"],
  case16: ["c16_start", "c16_duel", "c16_review", "c16_roof", "c16_final"],
  case17: ["c17_start", "c17_truck", "c17_office", "c17_legal", "c17_final"],
  case18: ["c18_start", "c18_lounge", "c18_party", "c18_table", "c18_final"],
  case19: ["c19_start", "c19_shelves", "c19_ward", "c19_labels", "c19_final"],
  case20: ["c20_start", "c20_server", "c20_datacenter", "c20_farewell", "c20_final"],
  case21: ["c21_start", "c21_inn", "c21_orchard", "c21_breakwater", "c21_final"],
  case22: ["c22_start", "c22_counter", "c22_factory", "c22_roleplay", "c22_final"],
  case23: ["c23_start", "c23_proxy", "c23_advisor", "c23_backstage", "c23_final"],
  case24: ["c24_start", "c24_desks", "c24_rooftop", "c24_farewell", "c24_final"],
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
  case10: "한 사람의 집념으로 버티던 명단을 부서지지 않는 구조로 옮기면서, 그 구조에서 밀려나는 사람을 어떻게 할지 정한다",
  case11: "모두가 보는 방에서, 3년 전 사라진 반대 의견을 누가 지웠는지 말할지 그리고 그 말에 누구의 이름을 걸지 정한다",
  case12: "조건이 붙은 배상금 앞에서, 서류가 없는 212명까지 배상 기준에 넣을지와 그 대가를 누가 치를지 정한다",
  case13: "혁신위원회의 얼굴이 되어 달라는 제안 앞에서, 212명의 배상 기준과 동료들의 자리를 대가로 '과거는 정리됐다'는 문장을 읽을지 정한다",
  case14: "착한 이름을 단 펀드가 손실을 은퇴자에게 옮기기 전에, 판매를 멈출지 고칠지 돈의 길을 쫓을지 정하십시오.",
  case15: "이민서의 정규직 전환과 11초의 진실 사이에서, 그의 선택을 대신하지 않고 곁에 선다.",
  case16: "로봇 120대가 들어오는 리스 앞에서, 야간조 80명이 나가는 문을 문자 한 통이 아닌 길로 바꿀 수 있을지와 그 대가를 누가 치를지 정한다",
  case17: "47명의 이름이 적힌 수첩을 법원에 낼지, 이름의 주인들에게 돌려줄지, 태울지 정하고 그 대가를 누가 치를지 정한다",
  case18: "KD를 벨 수 있는 칼과 함께 온 스카우트 앞에서, 오진우를 붙잡을지 조건을 걸어 보낼지 매각 자체를 막을지, 그리고 그 대가를 매각 묶음 속 누가 치를지 정한다",
  case19: "철거 전 72시간 안에 40년 치 종이 원본을 옮기고, 그 종이가 누구의 이름으로 어디에 남을지 정한다",
  case20: "자정 교체 전에, 에코가 남긴 판단 원칙과 동의 없이 쓰인 반응 기록의 주인을 지킨다",
  case21: "자기 반응이 실험 자료였다는 걸 모르는 첫 번째 참가자에게, 무엇을 언제 알릴지와 그 기록을 누가 지킬지 정한다",
  case22: "죽은 사람의 이름으로 거절된 공장의 대출 앞에서, 한 곳을 사람의 서명으로 지금 살릴지, 같은 규칙에 걸린 41곳을 늦게 다 다시 보게 할지 정한다",
  case23: "한 주씩 모은 3,118명의 표와 1분의 발언으로, 윤상혁의 사내이사 선임을 막을지 서명란 실명제와 바꿀지 기록으로만 남길지 정한다",
  case24: "트리거랩이 해체되는 일주일 동안, 흩어지는 사람들과 옮겨지는 기록 중 무엇을 먼저 지킬지 정합니다.",
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
      "노바웍스 입찰에서 오진우와 같은 자료로 겨룬다. 이 입찰 자체가 플로우온의 손실을 다른 회사 장부로 옮기는 통로일 수 있다.",
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
    id: "case10",
    label: "사건 10",
    title: "멈추지 못하는 사람",
    trigger: "애정 / 무력감 / 선택",
    status: "LOCKED",
    summary:
      "이긴 다음 날 청구서가 온다. 3년간 피해자 명단을 혼자 들고 있던 사람이 쓰러지고, 그 명단은 공식 기록이 아니라 나흘 뒤 폐기된다.",
  },
  {
    id: "case11",
    label: "사건 11",
    title: "모두가 보는 방",
    trigger: "두려움 / 분노 / 웃음",
    status: "LOCKED",
    summary:
      "3년 전 사라진 반대 의견이 기사가 되고, 당신은 국정감사(국회가 공개적으로 따져 묻는 자리) 참고인석에 앉게 된다. 증인석의 윤상혁 자리는 비어 있다.",
  },
  {
    id: "case12",
    label: "사건 12",
    title: "1,740번째 사람",
    trigger: "분노 / 웃음 / 애도",
    status: "LOCKED",
    summary:
      "그룹이 300억 자율 배상안을 내놓는다. 조건은 다시는 소송하지 않겠다는 서명이다. 처음으로 피해자들의 가게와 공장과 추모공원으로 간다.",
  },
  {
    id: "case13",
    label: "사건 13",
    title: "혁신의 얼굴",
    trigger: "분노 / 웃음 / 연대",
    status: "LOCKED",
    summary:
      "국정감사(국회가 공개적으로 따져 묻는 자리) 뒤 여론을 돌리려는 그룹이 혁신위원회를 만들고, 반대 의견을 쓴 당신에게 광고의 얼굴이 되어 달라고 한다. 대본의 마지막 문장은 '과거는 모두 정리되었습니다'다.",
  },
  {
    id: "case14",
    label: "사건 14",
    title: "착한 펀드",
    trigger: "분노 / 웃음 / 슬픔 / 기쁨",
    status: "LOCKED",
    summary:
      "그룹이 은행 창구에서 은퇴자에게 '상생 펀드'를 팝니다. 펀드가 사들이는 것은 그룹의 부실채권과 플로우온 대출의 남은 조각이고, 판매 대본에는 도윤하가 3년 전 쓰던 문장이 그대로 있습니다.",
  },
  {
    id: "case15",
    label: "사건 15",
    title: "정규직 심사",
    trigger: "기쁨 / 분노 / 웃음 / 슬픔",
    status: "LOCKED",
    summary:
      "3년차 계약직 이민서에게 정규직 전환 제안이 옵니다. 조건은 유출 소동 때 사라진 11초를 자기 실수로 인정하는 확인서 서명이고, 면접 날은 동생의 수능 날입니다.",
  },
  {
    id: "case16",
    label: "사건 16",
    title: "무인 창고",
    trigger: "분노 / 웃음 / 애도 / 기쁨",
    status: "LOCKED",
    summary:
      "플로우온 풀필먼트센터가 리스로 물류 로봇 120대를 들이고, 야간조 80명은 새벽 문자 한 통으로 계약 종료를 통보받는다. 첫 새벽에 컵라면을 뜯어 주던 강태민의 사건이다.",
  },
  {
    id: "case17",
    label: "사건 17",
    title: "수첩의 이름들",
    trigger: "책임 / 웃음 / 애도",
    status: "LOCKED",
    summary:
      "그룹 법무팀이 반재욱의 수첩을 회사 기록물이라며 당신의 징계 증거로 쓰려 한다. 넘기기 전에, 그가 20년 동안 내보낸 47명을 한 명씩 찾아간다.",
  },
  {
    id: "case18",
    label: "사건 18",
    title: "스카우트",
    trigger: "경쟁 / 웃음 / 애정",
    status: "LOCKED",
    summary:
      "브릿지은행이 KD은행의 부실채권(돌려받기 어려워진 대출) 묶음을 사들이려 하고, 그 팀장 자리를 오진우에게 내민다. 연봉 두 배, 그리고 KD를 벨 수 있는 칼이다.",
  },
  {
    id: "case19",
    label: "사건 19",
    title: "종이의 무게",
    trigger: "웃음 / 분노 / 슬픔 / 기쁨",
    status: "LOCKED",
    summary:
      "전산에 없는 원본이 있는 회기동 헌책방 2층이 철거됩니다. 철거일은 국회의 자료 보존 기간 사흘 전으로 당겨졌고, 종이의 주인 임경수는 병원에 있습니다.",
  },
  {
    id: "case20",
    label: "사건 20",
    title: "에코의 업데이트",
    trigger: "슬픔 / 웃음 / 분노 / 기쁨",
    status: "LOCKED",
    summary:
      "에코가 새 AI 심사 엔진 노아로 교체되고 판단 기록은 초기화됩니다. 그런데 노아는 바로 그 기록으로, 동의 없이 배웠습니다.",
  },
  {
    id: "case21",
    label: "사건 21",
    title: "첫 번째 참가자",
    trigger: "기쁨 / 웃음 / 슬픔 / 분노",
    status: "LOCKED",
    summary:
      "노아가 배운 기록의 맨 아래 줄에, 당신보다 먼저 트리거랩을 거친 사람의 이름이 있다. 그는 지금 제주 구좌에서 귤 창고를 고친 게스트하우스를 하고, 자기 반응이 실험 자료였다는 걸 모른다.",
  },
  {
    id: "case22",
    label: "사건 22",
    title: "인턴 문하준",
    trigger: "기쁨 / 분노 / 애도",
    status: "LOCKED",
    summary:
      "문하준이 겨울방학 인턴으로 강서지점에 온다. 같은 주, 어머니와 기술자들이 다시 연 공장 끝까지정밀의 시설자금(기계나 설비를 사는 데 쓰는 돈) 신청을 AI 심사 엔진 노아가 0.8초 만에 거절한다. 사유는 세상을 떠난 아버지의 이름이다.",
  },
  {
    id: "case23",
    label: "사건 23",
    title: "주주총회",
    trigger: "분노 / 웃음 / 연대",
    status: "LOCKED",
    summary:
      "윤상혁을 사내이사(회사 경영에 직접 참여하는 이사)로 올리는 정기 주주총회가 열린다. 한 주씩 산 3,118명이 위임장을 들고 여의도 대강당 뒷줄을 채운다. 발언 시간은 1분이다.",
  },
  {
    id: "case24",
    label: "사건 24",
    title: "마지막 출근",
    trigger: "분노 / 웃음 / 슬픔 / 기쁨",
    status: "LOCKED",
    summary:
      "주주총회 사흘 뒤 월요일, 트리거랩 해체 공지가 뜹니다. 사유는 '성과 없음'. 마지막 일주일 동안 책상이 하나씩 비고, 옥상에서 한서윤이 절반만 고백하고, 33층에서 백아린이 봉투 하나를 건넵니다.",
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
