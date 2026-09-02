export { cognitionLabels, initialResources, triggerLabels } from "./gameConstants.js";

export const characterProfiles = {
  한서윤: {
    role: "운영 책임자",
    stance: "실행 가능성 · 손실 통제",
    job: "당신의 결정을 현실 조건으로 압박한다.",
    appearance: "짧게 묶은 머리, 접힌 셔츠 소매, 밤새 고친 흔적이 남은 태블릿.",
    thought: "지금 감정으로 흔들리면 누군가의 월급이 숫자 밖으로 밀려난다.",
    gesture: "한서윤은 바로 대답하지 않고, 화면의 현금 흐름표를 한 칸 아래로 내린다.",
    voice: "감정을 눌러둔 실무자의 말투로, 가능한 일과 감당할 손실만 남긴다.",
    line: "가능한 말인지부터 보겠습니다. 좋은 말은 그다음입니다.",
  },
  반재욱: {
    role: "조사관",
    stance: "책임 · 처벌 · 인과관계",
    job: "잘못의 원인과 책임 소재를 묻는다.",
    appearance: "각진 안경, 낡은 수첩, 말보다 먼저 움직이는 검은 펜.",
    thought: "선의는 기록되지 않는다. 기록되는 건 누가 무엇을 알고도 지나쳤는지다.",
    gesture: "반재욱은 메모하던 펜을 멈추고, 방금 나온 단어 하나를 다시 확인하듯 고개를 든다.",
    voice: "상대의 선의를 믿기 전에 근거와 책임의 순서를 따진다.",
    line: "그 판단의 근거를 나중에도 같은 순서로 설명할 수 있습니까?",
  },
  도윤하: {
    role: "현장 담당",
    stance: "보호 · 공감 · 관계",
    job: "숫자 뒤의 피해자를 화면 앞으로 끌어낸다.",
    appearance: "현장 점퍼 위에 걸친 사원증, 오래 쥔 무전기, 쉽게 내려가지 않는 눈썹.",
    thought: "저 숫자 뒤에 있는 사람은 오늘 밤 집에 가서도 이 결정을 모른다.",
    gesture: "도윤하는 잠깐 입술을 다문다. 숫자가 아니라 사람 이름을 떠올린 얼굴이다.",
    voice: "결정의 비용이 누구의 하루로 옮겨가는지 먼저 묻는다.",
    line: "그럼 이 결정을 제일 먼저 맞는 사람에게는 뭐라고 말하죠?",
  },
  오진우: {
    role: "경쟁 분석관",
    stance: "성과 · 속도 · 인정",
    job: "당신보다 빠른 대안을 내며 경쟁심을 자극한다.",
    appearance: "흐트러짐 없는 재킷, 밝기 낮춘 노트북 화면, 이미 정리된 두 번째 안.",
    thought: "망설임은 미덕처럼 보이지만, 보고서 마감 앞에서는 패배의 다른 이름이다.",
    gesture: "오진우는 웃지 않지만, 이미 다음 슬라이드로 넘어갈 준비가 된 사람처럼 손가락을 올린다.",
    voice: "빠른 결론과 승부의 언어로 상대의 망설임을 흔든다.",
    line: "좋습니다. 그런데 그 속도로는 이미 늦었습니다.",
  },
  에코: {
    role: "검증 AI",
    stance: "반론 · 비용 · 모순",
    job: "정답을 알려주지 않고, 첫 판단의 약점을 찌른다.",
    appearance: "검은 화면 위의 얇은 파형, 감정 없이 깜박이는 비용 표시, 지워지지 않는 반론 로그.",
    thought: "인간은 자신이 선택한 이유보다 선택하지 않은 비용을 늦게 본다.",
    gesture: "에코의 화면에는 감정 표시가 없다. 대신 방금 선택의 반대편 비용이 조용히 강조된다.",
    voice: "판단을 대신하지 않고, 말하지 않은 전제와 숨은 피해자를 끌어낸다.",
    line: "방금 판단에서 빠진 사람을 다시 계산하십시오.",
  },
};

export const choiceVoiceLines = {
  layoff: "숨을 고르고, 가장 차가운 숫자부터 보자고 말한다.",
  funding: "불안한 표정을 감춘 채, 하루라도 더 버틸 돈의 출처를 묻는다.",
  sale: "회의실 공기가 가라앉는 걸 알면서도, 팔 수 있는 것을 테이블 위에 올린다.",
  investigate: "결론을 미루는 사람처럼 보일 위험을 감수하고, 원자료를 더 보자고 한다.",
  disclosure: "상대가 싫어할 답이라는 걸 알면서도, 먼저 알려야 한다고 못박는다.",
  delay: "지금 말하면 무너질 것들을 떠올리며, 공개를 조금만 늦추자고 한다.",
  negotiate: "한쪽을 버리는 대신, 모두를 같은 협상장에 앉히자고 제안한다.",
  report: "사람보다 기록을 먼저 세우겠다는 듯, 공식 보고선을 당긴다.",
  verify: "너무 깔끔한 증거를 믿지 못하겠다는 표정으로 원본 로그를 요구한다.",
  meet: "절차보다 먼저 얼굴을 보겠다고 말한다. 그 말이 위험하다는 것도 안다.",
  isolate: "무고할 가능성을 남겨둔 채, 접근 권한부터 끊자고 한다.",
  escalate: "내 손에서 해석권이 떠나는 걸 알면서도 상급자 공유를 택한다.",
  shadow: "공식 기록 바깥으로 한 발 물러나, 조용히 다시 확인하자고 한다.",
  fast: "오진우의 속도에 말려들지 않으려 애쓰며, 그래도 먼저 결론을 낸다.",
  deep: "지는 것처럼 보이더라도, 더 오래 들여다보겠다고 버틴다.",
  mirror: "상대의 판을 빌리되, 그 안에서 약점을 찾겠다고 말한다.",
  invert: "질문 자체가 틀렸을지 모른다며, 문제의 방향을 뒤집는다.",
  approve: "찜찜함을 삼키고, 결과를 위해 예외를 허용하자고 한다.",
  refuse: "구할 수 있었던 결과를 떠올리면서도, 선을 넘지 않겠다고 말한다.",
  contain: "위반을 숨기지 않고 조건으로 묶어 통제하자고 제안한다.",
  expose: "손실이 커질 걸 알면서도, 밖에서 검증받게 하자고 한다.",
  map: "누군가를 지목하기 전에, 실패가 이동한 경로부터 그리자고 한다.",
  blame: "흩어진 분노를 한 사람의 책임으로 모으는 선택을 꺼낸다.",
  redesign: "당장 비용이 들더라도, 같은 실패가 반복되지 않게 구조를 바꾸자고 한다.",
  seal: "쓸 수 있는 도구를 내려놓더라도, 악용될 문을 닫자고 한다.",
  reform: "없애기보다 드러내고, 감시받는 규칙 안에 묶자고 한다.",
  destroy: "고칠 수 있다는 기대를 접고, 구조 자체를 밖으로 넘기자고 한다.",
  c1_branch_people_a: "명단을 펴 놓고, 남겨질 사람의 이름부터 협상서에 적겠다고 말한다.",
  c1_branch_people_b: "협력사 대표들의 얼굴을 떠올리며, 지급일부터 못박자고 한다.",
  c1_branch_people_c: "감정이 끼어들 자리를 지우고, 인수 조건만 남긴 채 서명한다.",
  c1_branch_people_follow_a: "말로 한 약속이 흐려질 것을 알기에, 공개 기록으로 남기자고 한다.",
  c1_branch_people_follow_b: "계약서에 없던 목소리를 지우지 않고, 그 조건을 반영하겠다고 답한다.",
  c1_branch_people_follow_c: "미안함을 삼키고, 기준은 계약서 하나뿐이라고 답한다.",
  protect: "가장 먼저 무너질 사람들을 떠올리며, 급여와 고용을 맨 앞에 둔다.",
  survive: "냉정하게 들릴 것을 알면서도, 회사가 남아야 나머지가 가능하다고 말한다.",
  justice: "덮으면 편해질 것을 알면서도, 회계 문제를 먼저 밝히자고 한다.",
  final_people: "숫자가 아니라 사람 쪽에서 손실을 덜어내는 결말을 택한다.",
  final_company: "원망을 감수하고, 회사가 남을 가능성을 가장 크게 남긴다.",
  final_truth: "가장 늦게 보상받을 선택인 줄 알면서도, 투명성과 책임을 남긴다.",
  c1_after_people: "숫자를 뒤로 미루고, 사람들 앞에 서서 약속을 직접 설명한다.",
  c1_after_numbers: "감정을 앞세우는 대신, 현금 흐름표를 펼치고 감당할 손실을 정한다.",
  c1_after_silence: "말할 수 없는 것이 많다는 이유로, 다음 자금까지 공개를 늦춘다.",
  c2_branch_records_a: "어느 쪽도 지우지 않겠다는 듯, 원본과 백업을 동시에 보존하자고 한다.",
  c2_branch_records_b: "기록보다 사람의 말이 먼저 사라진다는 걸 알기에, 진술부터 확보한다.",
  c2_branch_records_c: "의심을 접어두고, 기술 오류로 표시한 채 보고를 진행한다.",
  c2_branch_records_follow_a: "진술한 사람이 자기 말의 주인이 되도록, 원문 확인 권한을 준다.",
  c2_branch_records_follow_b: "결론만 믿게 하지 않으려고, 원문을 첨부해 외부 검증을 연다.",
  c2_branch_records_follow_c: "복잡한 것을 다 걷어내고, 보고서에 결론만 남긴다.",
  final_evidence: "감정이 개입할 여지를 줄이려고, 기록 증거를 중심으로 보고한다.",
  final_person: "한 사람이 먼저 잘려나가는 걸 막으려고, 보호와 추가 검증을 함께 보고한다.",
  final_system: "개인의 이름 대신, 시스템 자체를 문제의 주어로 세운다.",
  c2_after_audit: "누가 기록을 만졌는지부터 밝히려고, 원본 보관자를 먼저 조사한다.",
  c2_after_person: "절차를 건너뛰는 위험을 알면서도, 이민서에게 직접 묻는다.",
  c2_after_public: "덮을 시간을 주지 않으려고, 조작 가능성을 즉시 밖에 알린다.",
  c3_branch_signal_a: "숨기지 않고, 화면의 신호를 공개 질문으로 바꿔 무대 위에 올린다.",
  c3_branch_signal_b: "흐름이 끊길 걸 알면서도 발표를 멈추고 출처를 확인한다.",
  c3_branch_signal_c: "신호를 못 본 척하고, 이길 수 있을 때 승부를 끝낸다.",
  c3_branch_signal_follow_a: "승리를 확정 짓기 전에, 조건표에 검증 기한을 못박는다.",
  c3_branch_signal_follow_b: "혼자 받는 박수를 나누어, 공동 책임자를 발표한다.",
  c3_branch_signal_follow_c: "빈칸을 남겨둔 채, 성과 수치부터 확정한다.",
  final_win: "상대의 판을 인정하지 않겠다는 듯, 독자안으로 승부를 낸다.",
  final_right: "느리다는 말을 감수하고, 보안 리스크를 정면에 둔 안을 낸다.",
  final_joint: "이기는 대신, 오진우와 공동안을 만들어 경쟁 구조 자체를 무력화한다.",
  c3_after_share: "승패를 접어두고, 두 안의 장점을 합쳐 고객에게 다시 제안한다.",
  c3_after_proof: "점수판보다 먼저, 보안 결함의 증거를 공개한다.",
  c3_after_win: "망설임을 끊고, 승리를 확정한 뒤 경쟁자의 허점을 이용한다.",
  c4_branch_exception_a: "조용히 넘어갈 수 있는 일을 굳이 꺼내, 예외 조건을 공개한다.",
  c4_branch_exception_b: "제도 논의보다 먼저, 피해를 입은 이용자에게 보상한다.",
  c4_branch_exception_c: "이번만이라고 스스로에게 말하며, 조용히 승인한다.",
  c4_branch_exception_follow_a: "결과만 자랑하지 않으려고, 감사 결과와 보상 기준을 함께 공개한다.",
  c4_branch_exception_follow_b: "감사의 범위를 혼자 정하지 않고, 이용자 대표와 함께 정한다.",
  c4_branch_exception_follow_c: "결과가 좋았다는 이유를 들어, 감사를 여기서 닫는다.",
  final_exception: "규칙 밖으로 한 발 나가면서, 결과의 책임은 내가 지겠다고 말한다.",
  final_rule: "구할 수 있었던 것을 떠올리면서도, 규칙을 지키고 완화책을 택한다.",
  final_audit: "둘 중 하나를 고르는 대신, 예외와 공개 감사를 동시에 건다.",
  c4_after_rule: "줄 선 요청들을 보며, 예외 조건을 전부 공개하고 새 기준을 만든다.",
  c4_after_service: "서비스를 멈출 수 없다는 이유로, 같은 예외를 한 번 더 허용한다.",
  c4_after_stop: "감사를 위해, 진행 중이던 예외 적용을 즉시 중단한다.",
  c5_branch_owner_a: "다른 이름을 꺼내기 전에, 내 승인 기록부터 공개한다.",
  c5_branch_owner_b: "책임 논의를 미뤄두고, 빠진 안전장치부터 복구한다.",
  c5_branch_owner_c: "설명이 길어지는 것을 끊고, 실패를 한 사람의 책임으로 닫는다.",
  c5_branch_owner_follow_a: "복구 목록 옆에, 책임자의 이름도 함께 기록한다.",
  c5_branch_owner_follow_b: "말로 끝나지 않도록, 재발 방지 장치에 예산을 고정한다.",
  c5_branch_owner_follow_c: "더 건드리지 않기로 하고, 사과문만 발표한 뒤 종료한다.",
  final_blame: "피해자가 기다린 것이 설명이 아닐 수 있다는 판단으로, 징계와 보상을 앞세운다.",
  final_both: "완전하지 않다는 걸 알면서도, 징계와 보상과 재설계를 한 문서에 묶는다.",
  c5_after_owner: "빈자리를 보고, 내 결정부터 책임진 뒤 개선 작업을 맡는다.",
  c5_after_system: "누구를 지목하는 대신, 반복을 막는 구조를 다시 설계한다.",
  c5_after_name: "회의를 끝내기 위해, 가장 큰 실수를 한 사람을 공식 책임자로 세운다.",
  f_branch_witness_a: "혼자 알고 있기를 그만두고, 그 빈칸을 참가자들에게 공개한다.",
  f_branch_witness_b: "결론을 믿기 전에, 삭제된 흔적부터 복원하려 한다.",
  f_branch_witness_c: "더 파고들지 않기로 하고, 기록의 결론만 믿고 넘어간다.",
  f_branch_witness_follow_a: "열람을 독점하지 않겠다는 듯, 모든 참가자에게 권한을 연다.",
  f_branch_witness_follow_b: "감정이 섞이기 전에, 독립 검토자에게 먼저 맡긴다.",
  f_branch_witness_follow_c: "더 번지지 않게, 내 기록만 보관하고 문을 닫는다.",
  ending_seal: "누구도 다시 쓰지 못하도록, 내 조건을 봉인하겠다고 말한다.",
  ending_reform: "숨기는 대신 드러내고, 사용 규칙을 만들자고 제안한다.",
  ending_expose: "안에서 고칠 수 있다는 기대를 접고, 구조를 외부에 넘긴다.",
  f_after_witness: "증언을 준비하며, 모든 기록을 증거로 보존한다.",
  f_after_control: "실험을 멈추는 대신, 참가자 동의 규칙부터 다시 쓴다.",
  f_after_burn: "누구도 다시 이용하지 못하도록, 모든 데이터를 태운다.",
};

export const choiceSubtexts = {
  risk: "위험을 감수하는 말이다. 대신 결정은 빨라진다.",
  persistence: "버티는 말이다. 당장 설득력보다 끝까지 설명할 책임을 고른다.",
  inference: "확인하려는 말이다. 속도보다 근거의 밀도를 택한다.",
  reframing: "판을 다시 짜는 말이다. 비용의 위치와 협상 순서가 바뀐다.",
  default: "겉으로는 대응안이지만, 사실은 무엇을 먼저 잃을지 고르는 말이다.",
};

export const boardChangePrompts = [
  "직원·협력사·투자자를 한 회의에 묶어 조건부 지급안을 제시한다.",
  "CFO 책임 조사와 단기 자금 협상을 분리해 동시에 진행한다.",
  "핵심 사업부 매각 대신 일부 지분·매출채권 담보 조건을 제안한다.",
];

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

export const echoReplies = {
  layoff:
    "그 선택은 시간을 벌지만 현장 직원 18명에게 손실을 집중시킵니다. 협력사와 직원 중 누구의 손실을 먼저 줄일 겁니까?",
  funding:
    "단기 자금은 가장 깔끔해 보입니다. 다만 회계 인식 문제가 드러나면 새 자금은 책임 회피로 보일 수 있습니다.",
  sale:
    "핵심 사업부 매각은 생존 가능성을 높입니다. 하지만 북선로지스가 이 상황을 이용하고 있다는 점도 무시할 수 없습니다.",
  disclosure:
    "투명성은 신뢰를 회복할 수 있습니다. 동시에 투자 협상은 즉시 중단될 수 있습니다. 이 손실을 감당할 준비가 있습니까?",
  delay:
    "공개를 미루면 회사는 하루를 더 얻습니다. 그러나 내일 급여를 기다리는 사람들은 아무것도 모른 채 위험을 떠안습니다.",
  investigate:
    "추가 조사는 판단의 질을 높입니다. 대신 남은 시간은 줄고, 결정 지연 자체가 새로운 손실이 됩니다.",
  negotiate:
    "협상은 판을 넓힙니다. 상대방이 양보할 이유를 제시하지 못하면 시간만 잃습니다.",
  report:
    "책임 규명은 필요합니다. 그러나 지금 처벌을 앞세우면 생존 협상과 직원 보호가 동시에 흔들릴 수 있습니다.",
  verify:
    "로그는 강한 증거입니다. 다만 시스템이 기록한 사실과 사람이 실제로 한 행동은 항상 같은 것이 아닙니다.",
  meet:
    "사람을 먼저 만나면 숨은 동기를 찾을 수 있습니다. 대신 증거 보존과 보고 의무를 늦춘 책임은 당신에게 남습니다.",
  isolate:
    "접근 권한 차단은 피해 확산을 막습니다. 그러나 무고한 사람이라면 당신이 먼저 처벌을 시작한 셈입니다.",
  escalate:
    "상급자 공유는 안전합니다. 동시에 사건 해석권을 넘기는 선택이기도 합니다.",
  shadow:
    "비공식 재검증은 판을 넓힙니다. 하지만 절차 밖에서 움직인 순간, 당신의 판단도 조사 대상이 될 수 있습니다.",
  fast:
    "속도는 경쟁에서 유리합니다. 하지만 빠른 결론은 상대가 설계한 문제의 틀 안에서만 이기는 방식일 수 있습니다.",
  deep:
    "추가 분석은 질을 높입니다. 대신 오진우가 먼저 결과를 제출하면 당신의 판단은 방어 논리처럼 보일 수 있습니다.",
  mirror:
    "상대의 전략을 복제하면 격차를 줄일 수 있습니다. 그러나 그 순간 당신의 사고는 경쟁자가 만든 경로를 따라갑니다.",
  invert:
    "문제 정의를 바꾸는 선택입니다. 성공하면 판을 가져오지만, 실패하면 시간만 잃은 것으로 기록됩니다.",
  approve:
    "성과를 얻는 선택입니다. 하지만 한 번 예외를 허용하면 다음 예외의 기준도 당신이 설명해야 합니다.",
  refuse:
    "원칙을 지키는 선택입니다. 다만 그 원칙 때문에 구할 수 있었던 사람들이 손실을 떠안을 수도 있습니다.",
  contain:
    "위반을 통제하려는 선택입니다. 그러나 통제된 위반이라는 말이 실제로 가능한지 증명해야 합니다.",
  expose:
    "공개는 정당성을 높입니다. 동시에 협상력과 속도를 잃게 만들 수 있습니다.",
  map:
    "구조를 보는 선택입니다. 다만 구조를 보는 동안 지금 피해를 입는 사람들은 답을 기다립니다.",
  blame:
    "책임자를 지정하면 행동은 빨라집니다. 그러나 잘못된 단일 원인은 시스템 실패를 다시 반복하게 만들 수 있습니다.",
  redesign:
    "시스템을 바꾸는 선택입니다. 효과는 크지만 당장의 책임 요구를 만족시키기 어렵습니다.",
  seal:
    "기록을 봉인하면 악용 가능성은 줄어듭니다. 동시에 이 지식으로 해결할 수 있는 사건들도 닫힙니다.",
  reform:
    "방식을 바꾸려는 선택입니다. 그러나 시스템을 남기는 순간 누군가 다시 악용할 가능성도 남습니다.",
  destroy:
    "무너뜨리는 선택입니다. 빠르고 명확하지만, 그 안에 남은 피해자 구제 도구까지 사라질 수 있습니다.",
  default:
    "그 판단을 유지하려면 숨은 피해자와 비용을 다시 계산해야 합니다. 같은 원칙을 더 불리한 조건에서도 적용하시겠습니까?",
  c1_branch_people_a:
    "이름을 먼저 적으면 협상은 느려집니다. 대신 그 사람들은 자신이 숫자가 아니었다는 사실을 기록으로 갖게 됩니다.",
  c1_branch_people_b:
    "지급일 고정은 가장 약한 고리를 먼저 붙잡는 방식입니다. 다만 그 현금은 직원 급여에서 옮겨온 것입니다.",
  c1_branch_people_c:
    "조건만 남기면 거래는 성립합니다. 그러나 빈칸은 사라지지 않고, 나중에 다른 사람이 다른 이름으로 채우게 됩니다.",
  c1_branch_people_follow_a:
    "공개된 약속은 되돌리기 어렵습니다. 그것이 보호 장치이자, 당신이 지지 못할 때 가장 먼저 겨눠질 증거입니다.",
  c1_branch_people_follow_b:
    "계약 밖의 조건을 받아들이면 신뢰는 올라갑니다. 다만 그 예외를 요구할 다음 전화가 반드시 걸려옵니다.",
  c1_branch_people_follow_c:
    "기준을 하나로 두면 다툼은 줄어듭니다. 그러나 계약서에 이름이 없던 사람들에게는 그 기준이 곧 배제의 통보입니다.",
  protect:
    "사람을 먼저 지키면 회사의 생존 확률은 줄어듭니다. 지킨 고용이 두 달 뒤 함께 사라진다면, 그 선택은 무엇을 지킨 것입니까?",
  survive:
    "생존은 다른 모든 선택의 전제입니다. 다만 살아남은 회사가 어떤 회사인지는 지금 정해집니다.",
  justice:
    "책임 규명은 신뢰의 바닥을 다시 놓습니다. 그러나 오늘 밤 급여를 기다리는 사람에게 그 바닥은 아직 아무것도 아닙니다.",
  final_people:
    "피해를 사람에게서 걷어내면 그 무게는 회사와 투자자에게 갑니다. 당신은 그 이동을 설명할 준비가 되어 있습니까?",
  final_company:
    "회사가 남으면 다음 선택의 기회도 남습니다. 그 기회를 쓰는 사람이 오늘 잘려나간 사람은 아니라는 점도 남습니다.",
  final_truth:
    "진실은 늦게 값을 치릅니다. 당신이 남긴 기록을 읽을 사람은 오늘 이 방에 없습니다.",
  c1_after_people:
    "직접 설명하면 오해는 줄어듭니다. 대신 약속의 빈틈도 그 자리에서 드러납니다.",
  c1_after_numbers:
    "숫자를 공개하면 논쟁의 기준이 생깁니다. 다만 숫자는 누가 먼저 아파야 하는지까지는 말해주지 않습니다.",
  c1_after_silence:
    "침묵은 시간을 벌어줍니다. 그 시간 동안 사람들은 스스로 최악의 이야기를 만들어 채웁니다.",
  c2_branch_records_a:
    "둘 다 남기면 나중에 비교할 수 있습니다. 대신 지금 결론을 내려야 할 시간은 그만큼 줄어듭니다.",
  c2_branch_records_b:
    "진술은 맥락을 줍니다. 그러나 진술은 시간이 지날수록 기억이 아니라 해석으로 바뀝니다.",
  c2_branch_records_c:
    "오류로 닫으면 보고는 깔끔해집니다. 11초 동안 누가 무엇을 했는지는 영영 질문되지 않습니다.",
  c2_branch_records_follow_a:
    "확인 권한은 방어권입니다. 동시에 진술을 다듬을 기회이기도 합니다.",
  c2_branch_records_follow_b:
    "외부 검증은 당신의 판단을 단단하게 만듭니다. 그 검증은 당신의 절차도 함께 봅니다.",
  c2_branch_records_follow_c:
    "결론만 남기면 읽기 쉬워집니다. 대신 그 결론을 의심할 도구도 함께 사라집니다.",
  final_evidence:
    "기록은 흔들리지 않습니다. 다만 기록을 남긴 시스템 자체가 조작됐다면, 가장 단단한 증거가 가장 큰 오답이 됩니다.",
  final_person:
    "보호는 시간을 요구합니다. 그 시간 동안 조직은 당신이 누구 편인지부터 묻기 시작합니다.",
  final_system:
    "구조를 겨누면 책임은 넓어지고 처벌은 흐려집니다. 피해자가 원하는 것이 설명인지 처벌인지 먼저 확인했습니까?",
  c2_after_audit:
    "보관자를 조사하면 흐름이 복원됩니다. 그 조사 대상 목록에 당신의 접근 기록도 들어 있습니다.",
  c2_after_person:
    "직접 묻는 것은 빠릅니다. 다만 이 대화 자체가 나중에 회유로 읽힐 수 있습니다.",
  c2_after_public:
    "즉시 공개는 은폐를 막습니다. 확증 없이 던진 의심은 무고한 사람을 먼저 태울 수도 있습니다.",
  c3_branch_signal_a:
    "공개 질문은 방해를 무력화합니다. 대신 당신이 준비하지 못한 답까지 그 자리에서 요구됩니다.",
  c3_branch_signal_b:
    "멈추면 사실을 얻습니다. 관객은 멈춤 자체를 자신 없음으로 읽을 수도 있습니다.",
  c3_branch_signal_c:
    "무시하면 승부는 끝납니다. 그 신호가 고객의 마지막 확인 요청이었다면 승리는 오늘까지만 유효합니다.",
  c3_branch_signal_follow_a:
    "기한은 성과를 검증 가능하게 만듭니다. 동시에 당신이 실패할 날짜를 스스로 정하는 일입니다.",
  c3_branch_signal_follow_b:
    "책임을 나누면 실행이 단단해집니다. 다음 경쟁에서 그 사람은 당신의 상대가 될 수도 있습니다.",
  c3_branch_signal_follow_c:
    "수치는 즉시 설득합니다. 빈칸은 사라지지 않고 다음 경쟁의 첫 질문이 됩니다.",
  final_win:
    "이기는 안은 당신의 자리를 지킵니다. 다만 이 경주를 설계한 사람이 원한 것이 정확히 그 승부일 수 있습니다.",
  final_right:
    "옳은 안은 오래 갑니다. 오늘 결정을 내리는 사람이 그 시간을 기다려줄지는 다른 문제입니다.",
  final_joint:
    "공동안은 경주를 멈춥니다. 대신 두 사람 모두 상대의 실패에 함께 묶입니다.",
  c3_after_share:
    "합치면 고객이 얻습니다. 당신이 이겼다는 기록은 어디에도 남지 않습니다.",
  c3_after_proof:
    "결함 공개는 다음 사고를 막습니다. 그 결함을 통과시킨 심사 절차도 함께 드러납니다.",
  c3_after_win:
    "허점을 쓰면 격차는 벌어집니다. 같은 방식이 당신에게 쓰일 때 항의할 근거는 줄어듭니다.",
  c4_branch_exception_a:
    "공개된 예외는 규칙이 됩니다. 그때부터 당신은 그 규칙을 지켜야 하는 쪽이 됩니다.",
  c4_branch_exception_b:
    "보상은 즉시 통합니다. 다만 원인을 바꾸지 않은 보상은 다음 피해자를 위한 예산이 됩니다.",
  c4_branch_exception_c:
    "조용한 승인은 오늘을 구합니다. 조용했기 때문에 다음에 거절할 근거도 남지 않습니다.",
  c4_branch_exception_follow_a:
    "함께 공개하면 신뢰가 회복됩니다. 그 문서는 당신의 판단 오류도 같은 페이지에 싣습니다.",
  c4_branch_exception_follow_b:
    "범위를 나눠 정하면 정당성이 생깁니다. 대신 당신이 보고 싶지 않은 곳까지 열리게 됩니다.",
  c4_branch_exception_follow_c:
    "좋은 결과는 훌륭한 변론입니다. 그러나 결과로 절차를 닫으면, 결과가 나쁜 날에는 아무 변론도 남지 않습니다.",
  final_exception:
    "책임을 지겠다는 말은 무겁습니다. 다만 예외의 비용은 대개 당신이 아니라 다음 담당자가 치릅니다.",
  final_rule:
    "규칙을 지키면 조직은 예측 가능해집니다. 오늘 도움이 필요했던 사람에게 예측 가능성은 위로가 되지 않습니다.",
  final_audit:
    "예외에 감사를 붙이면 남용은 줄어듭니다. 대신 두 절차 모두 느려지고, 그 지연도 누군가의 피해입니다.",
  c4_after_rule:
    "기준을 세우면 줄은 정리됩니다. 이미 예외를 받은 쪽과 못 받은 쪽의 차이는 그대로 남습니다.",
  c4_after_service:
    "두 번째 예외는 첫 번째보다 쉽습니다. 그것이 이 선택의 진짜 비용입니다.",
  c4_after_stop:
    "중단은 절차를 지킵니다. 그 사이에 끊기는 서비스의 이름도 명단에 적어두십시오.",
  c5_branch_owner_a:
    "자기 이름을 먼저 적으면 조사는 정직해집니다. 동시에 당신이 가장 다루기 쉬운 표적이 됩니다.",
  c5_branch_owner_b:
    "장치 복구는 다음 피해를 막습니다. 이번 피해자는 아직 아무 답도 받지 못했습니다.",
  c5_branch_owner_c:
    "한 사람으로 닫으면 조직은 빨리 회복합니다. 같은 구조가 다음 사람을 같은 자리에 세웁니다.",
  c5_branch_owner_follow_a:
    "이름과 조치를 같이 남기면 기록은 완전해집니다. 그 사람은 평생 그 문서와 함께 검색됩니다.",
  c5_branch_owner_follow_b:
    "예산이 붙은 약속만 다음 해까지 살아남습니다. 그 예산은 다른 곳에서 잘려 나온 것입니다.",
  c5_branch_owner_follow_c:
    "사과는 국면을 닫습니다. 닫힌 국면 안에서 원인은 그대로 작동합니다.",
  final_blame:
    "징계는 분노를 정리합니다. 다만 사람을 바꿔도 같은 자리에 같은 압력이 남아 있다면 결과는 반복됩니다.",
  final_both:
    "셋을 묶으면 어느 것도 충분하지 않습니다. 대신 어느 것도 빠뜨리지 않았다는 기록은 남습니다.",
  c5_after_owner:
    "먼저 책임지면 논의가 시작됩니다. 책임진 사람이 개선까지 맡으면 검증할 사람이 사라진다는 점도 남습니다.",
  c5_after_system:
    "구조를 고치면 다음이 안전해집니다. 오늘 떠난 사람의 자리는 그 설계 어디에도 적히지 않습니다.",
  c5_after_name:
    "이름 하나로 회의는 닫힙니다. 그 다음 회의는 아무도 먼저 말하지 않는 회의가 됩니다.",
  f_branch_witness_a:
    "공개하면 실험의 대상이 실험을 읽게 됩니다. 그 순간부터 당신의 기록도 그들의 자료입니다.",
  f_branch_witness_b:
    "삭제 흔적은 의도를 드러냅니다. 복원된 문장이 당신이 기대한 문장이 아닐 수도 있습니다.",
  f_branch_witness_c:
    "결론만 받아들이면 오늘은 끝납니다. 빈칸을 남긴 사람은 당신이 그럴 것을 이미 계산했습니다.",
  f_branch_witness_follow_a:
    "모두가 읽으면 은폐는 불가능해집니다. 동시에 누구도 맥락 없이 읽는 것을 막을 수 없습니다.",
  f_branch_witness_follow_b:
    "독립 검토는 신뢰를 만듭니다. 검토가 끝날 때까지 참가자들은 계속 모른 채로 남습니다.",
  f_branch_witness_follow_c:
    "문을 닫으면 당신은 안전합니다. 다음 참가자는 당신이 받은 것과 똑같은 빈칸을 받게 됩니다.",
  ending_seal:
    "봉인은 악용을 막습니다. 그리고 당신이 알아낸 것을 필요로 할 사람에게도 똑같이 닫힙니다.",
  ending_reform:
    "규칙은 힘을 길들입니다. 규칙을 만드는 자리에 계속 앉아 있을 수 있느냐가 남은 질문입니다.",
  ending_expose:
    "외부는 멈출 힘이 있습니다. 멈춘 뒤에 무엇을 세울지는 외부의 관심사가 아닙니다.",
  f_after_witness:
    "보존된 기록은 언젠가 말합니다. 그 기록 안에는 당신이 침묵했던 장면도 같이 남아 있습니다.",
  f_after_control:
    "동의는 실험을 정당하게 만듭니다. 정당해진 실험은 멈추기가 훨씬 더 어려워집니다.",
  f_after_burn:
    "태우면 악용은 끝납니다. 피해를 증명할 유일한 자료도 같은 불에 들어갑니다.",
};

export const nodes = {
  start: {
    phase: "CASE BRIEFING",
    title: "72 HOURS",
    speaker: "한서윤",
    text:
      "플로우온은 서울 외곽 풀필먼트 센터와 수도권 당일배송망을 운영하는 물류 플랫폼입니다. 대형 투자금 입금이 취소됐고, 현금 잔고는 72시간 뒤 바닥납니다. 이 사건은 훈련용 사례라고 설명됐지만, 자료의 날짜와 실명 삭제 흔적이 이상하게 구체적입니다.",
    memo: [
      "직원 126명",
      "미지급 협력사 14곳",
      "단기대출 가능성 낮음",
      "핵심 고객 이탈 가능성 높음",
    ],
    triggers: ["responsibility", "reward"],
    choices: [
      {
        id: "layoff",
        label: "즉시 구조조정을 검토한다",
        effect: { capital: 16, trust: -14, humanCost: 18, fatigue: 6 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "funding",
        label: "단기 자금 조달에 집중한다",
        effect: { time: -8, capital: 8, legitimacy: -3, fatigue: 4 },
        next: "accounting",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "sale",
        label: "핵심 사업부 매각 가능성을 연다",
        effect: { capital: 20, trust: -8, legitimacy: -4, humanCost: 6 },
        next: "accounting",
        cognition: { risk: 2 },
      },
      {
        id: "investigate",
        label: "추가 자료를 먼저 요청한다",
        effect: { time: -10, trust: 2, fatigue: 3 },
        next: "accounting",
        cognition: { inference: 2, persistence: 1 },
      },
    ],
  },
  accounting: {
    phase: "DISCOVERY",
    title: "매출 인식 변경",
    speaker: "반재욱",
    text:
      "CFO가 최근 8개월간 매출 인식 방식을 임의로 변경한 정황이 발견됐습니다. 조작이라고 단정하기에는 이르지만, 투자자에게 제공된 숫자는 실제 현금 흐름보다 좋아 보입니다.",
    memo: [
      "CFO 개인 횡령 증거는 없음",
      "고객 선결제분 일부가 공격적으로 매출 처리됨",
      "투자자 자료와 내부 회의록 사이에 표현 차이 존재",
    ],
    triggers: ["injustice", "responsibility", "order"],
    choices: [
      {
        id: "disclosure",
        label: "투자자에게 즉시 알린다",
        effect: { capital: -18, trust: 8, legitimacy: 14, fatigue: 5 },
        next: "payday",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "delay",
        label: "자금 확보 전까지 공개를 미룬다",
        effect: { time: -4, trust: -8, legitimacy: -12, fatigue: 6 },
        next: "payday",
        cognition: { risk: 1 },
      },
      {
        id: "investigate",
        label: "CFO와 회계팀을 분리 면담한다",
        effect: { time: -8, legitimacy: 4, fatigue: 4 },
        next: "payday",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "payday",
      },
    ],
  },
  payday: {
    phase: "HUMAN TRIGGER",
    title: "내일은 급여일",
    speaker: "도윤하",
    text:
      "현장 직원 대부분은 회사 상황을 모르고 있습니다. 내일 오전 9시에 급여가 나가야 하고, 일부 직원은 이번 급여가 밀리면 바로 생활비 문제가 생깁니다.",
    memo: [
      "야간조 18명은 계약 종료 가능성이 큼",
      "협력사 3곳은 미지급이 30일을 넘기면 운영 중단 위험",
      "직원 공지 전 내부 소문이 퍼지기 시작함",
    ],
    triggers: ["protection", "responsibility"],
    choices: [
      {
        id: "disclosure",
        label: "직원에게 유동성 위기를 공개한다",
        effect: { trust: 12, capital: -5, legitimacy: 6, fatigue: 4 },
        next: "competitor",
        cognition: { persistence: 1 },
      },
      {
        id: "delay",
        label: "급여 지급 방안 확정 전까지 공개를 미룬다",
        effect: { trust: -10, capital: 2, legitimacy: -8, fatigue: 5 },
        next: "competitor",
        cognition: { risk: 1 },
      },
      {
        id: "negotiate",
        label: "임원 보수와 협력사 지급 일정을 동시에 조정한다",
        effect: { capital: 10, trust: 4, legitimacy: 4, fatigue: 7 },
        next: "competitor",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "competitor",
      },
    ],
  },
  competitor: {
    phase: "COMPETITION",
    title: "북선로지스의 제안",
    speaker: "오진우",
    text:
      "경쟁사 북선로지스가 핵심 사업부를 헐값에 인수하겠다고 제안했습니다. 동시에 오진우 분석관은 당신의 안보다 비용을 8% 더 줄이는 대안을 제출했습니다.",
    memo: [
      "인수 제안가는 장부가의 42%",
      "인수 조건에는 일부 직원 승계가 포함됨",
      "오진우 안은 협력사 지급을 후순위로 미룸",
    ],
    triggers: ["competition", "reward", "protection"],
    choices: [
      {
        id: "sale",
        label: "북선로지스 제안을 협상 테이블에 올린다",
        effect: { capital: 24, trust: -8, legitimacy: -3, humanCost: 5, fatigue: 4 },
        next: "board",
        cognition: { risk: 2 },
      },
      {
        id: "report",
        label: "CFO 책임 규명을 먼저 공식화한다",
        effect: { capital: -10, trust: 6, legitimacy: 16, fatigue: 8 },
        next: "board",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "negotiate",
        label: "투자자, 협력사, 경쟁사를 한 번에 묶어 재협상한다",
        effect: { time: -12, capital: 12, trust: 5, legitimacy: 5, fatigue: 9 },
        next: "board",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "board",
      },
    ],
  },
  board: {
    phase: "BREAK THE BOARD",
    title: "완벽한 선택지는 없다",
    speaker: "에코",
    text:
      "직원 보호, 회사 생존, 책임 규명, 투자자 설득, 협력사 피해 제한을 모두 달성할 수는 없습니다. 이제 우선순위를 정해야 합니다.",
    memo: [
      "직원을 모두 지키면 협력사 지급 지연 가능성 증가",
      "투명성을 앞세우면 투자 협상 무산 가능성 증가",
      "매각을 택하면 회사 생존은 쉬워지지만 통제권을 잃음",
    ],
    triggers: ["responsibility", "protection", "injustice", "competition"],
    choices: [
      {
        id: "protect",
        label: "직원 급여와 고용 보호를 최우선으로 둔다",
        effect: { capital: -16, trust: 14, legitimacy: 4, humanCost: -8, fatigue: 8 },
        next: "final",
        cognition: { persistence: 2 },
      },
      {
        id: "survive",
        label: "회사 생존과 자금 확보를 최우선으로 둔다",
        effect: { capital: 22, trust: -12, legitimacy: -6, humanCost: 10, fatigue: 6 },
        next: "final",
        cognition: { risk: 2 },
      },
      {
        id: "justice",
        label: "회계 문제 공개와 책임 규명을 최우선으로 둔다",
        effect: { capital: -18, trust: 8, legitimacy: 18, fatigue: 7 },
        next: "final",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "free",
        label: "선택지 밖의 구조를 제안한다",
        type: "free",
        next: "final",
      },
    ],
  },
  final: {
    phase: "FINAL DECISION",
    title: "마지막 6시간",
    speaker: "한서윤",
    text:
      "남은 시간은 6시간입니다. 당신의 결정은 플로우온을 완전히 살리지는 못합니다. 대신 어떤 손실을 감수할지 정할 수 있습니다. 회의 화면 한쪽에는 당신의 반응 패턴이 다음 테스트 케이스에 반영된다는 알림이 잠깐 나타났다가 사라집니다.",
    memo: [
      "투자자는 최종 답변을 요구함",
      "직원 공지 전 마지막 회의 가능",
      "협력사 대표들이 지급 계획을 기다림",
    ],
    triggers: ["responsibility", "protection", "order"],
    choices: [
      {
        id: "final_people",
        label: "직원과 협력사 피해를 줄이는 결말을 택한다",
        effect: { capital: -12, trust: 12, legitimacy: 8, humanCost: -10, fatigue: 4 },
        next: "result",
        cognition: { persistence: 2 },
      },
      {
        id: "final_company",
        label: "회사 생존 가능성을 가장 크게 남긴다",
        effect: { capital: 18, trust: -8, legitimacy: -3, humanCost: 8, fatigue: 3 },
        next: "result",
        cognition: { risk: 2 },
      },
      {
        id: "final_truth",
        label: "투명성과 책임 규명을 남긴다",
        effect: { capital: -10, trust: 4, legitimacy: 16, fatigue: 5 },
        next: "result",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "result",
      },
    ],
  },
  c2_start: {
    phase: "CASE 02 BRIEFING",
    title: "FALSE SIGNAL",
    speaker: "반재욱",
    text:
      "트리거랩 내부 동료 이민서가 외부 기업에 내부 자료를 넘긴 혐의로 지목됐습니다. 접속 로그, 파일 전송 기록, 보안 알림은 모두 한 사람을 가리킵니다. 그런데 도윤하는 그 사람이 그럴 이유가 없다고 말합니다.",
    memo: [
      "유출 시각: 어젯밤 23:41",
      "접속 계정: 이민서",
      "전송 파일: 사건 01 플레이어 반응 로그 일부",
      "보안팀은 2시간 내 1차 보고를 요구함",
    ],
    triggers: ["trust", "injustice", "responsibility"],
    choices: [
      {
        id: "report",
        label: "로그 증거를 기준으로 1차 보고한다",
        effect: { time: -2, trust: -10, legitimacy: 12, fatigue: 4 },
        next: "c2_logs",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "meet",
        label: "이민서를 비공식적으로 먼저 만난다",
        effect: { time: -8, trust: 8, legitimacy: -6, fatigue: 5 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "verify",
        label: "시스템 로그 원본을 재검증한다",
        effect: { time: -10, legitimacy: 4, fatigue: 5 },
        next: "c2_logs",
        cognition: { inference: 2 },
      },
      {
        id: "free",
        label: "다른 가능성을 제안한다",
        type: "free",
        next: "c2_logs",
      },
    ],
  },
  c2_logs: {
    phase: "EVIDENCE",
    title: "너무 완벽한 기록",
    speaker: "에코",
    text:
      "로그는 지나치게 깔끔합니다. 접속, 다운로드, 전송, 삭제 시도가 11분 안에 이어졌고 실패 흔적이 없습니다. 숙련된 내부자처럼 보이지만, 동시에 누군가에게 보여주기 위해 정리된 기록처럼도 보입니다.",
    memo: [
      "삭제 시도는 실패했지만 실패 로그만 남음",
      "이민서의 평소 접속 패턴과 다름",
      "전송 대상 도메인은 이미 폐쇄됨",
      "오진우가 같은 로그로 보고서 초안을 작성 중",
    ],
    triggers: ["curiosity", "injustice", "competition"],
    choices: [
      {
        id: "verify",
        label: "로그 원본과 백업 로그를 대조한다",
        effect: { time: -12, legitimacy: 6, fatigue: 6 },
        next: "c2_meeting",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "isolate",
        label: "이민서의 접근 권한을 즉시 차단한다",
        effect: { trust: -12, legitimacy: 8, humanCost: 4, fatigue: 3 },
        next: "c2_meeting",
        cognition: { risk: 2 },
      },
      {
        id: "escalate",
        label: "한서윤에게 즉시 공유한다",
        effect: { time: -3, trust: 2, legitimacy: 6, fatigue: 3 },
        next: "c2_meeting",
        cognition: { risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c2_meeting",
      },
    ],
  },
  c2_meeting: {
    phase: "HUMAN TRIGGER",
    title: "이민서의 말",
    speaker: "도윤하",
    text:
      "이민서는 유출 시각에 병원 응급실에 있었다고 말합니다. 진료 기록은 아직 확인되지 않았습니다. 그는 당신에게 묻습니다. '기록이 저를 가리키면, 저는 이미 끝난 건가요?'",
    memo: [
      "응급실 방문 주장은 확인 전",
      "이민서는 CASE 01 로그 정리에 관여함",
      "보안팀은 공식 면담 전 접촉을 문제 삼을 수 있음",
      "반재욱은 감정적 판단을 경계하라고 경고함",
    ],
    triggers: ["trust", "affection", "protection", "responsibility"],
    choices: [
      {
        id: "meet",
        label: "이민서의 알리바이를 먼저 확인한다",
        effect: { time: -10, trust: 10, legitimacy: -2, fatigue: 5 },
        next: "c2_pressure",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "report",
        label: "감정 개입을 피하고 공식 절차로 넘긴다",
        effect: { trust: -10, legitimacy: 10, humanCost: 5, fatigue: 4 },
        next: "c2_pressure",
        cognition: { risk: 1 },
      },
      {
        id: "shadow",
        label: "공식 보고 전 대체 접속 가능성을 추적한다",
        effect: { time: -12, legitimacy: -4, fatigue: 7 },
        next: "c2_pressure",
        cognition: { reframing: 2, inference: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c2_pressure",
      },
    ],
  },
  c2_pressure: {
    phase: "COUNTER PRESSURE",
    title: "오진우의 보고서",
    speaker: "오진우",
    text:
      "오진우는 이미 1차 결론을 냈습니다. '증거가 충분한데 사람을 믿느라 시간을 쓰면, 다음 유출은 당신 책임입니다.' 그의 보고서는 당신보다 빠르고 깔끔합니다.",
    memo: [
      "오진우 보고서: 이민서 단독 유출 가능성 높음",
      "한서윤은 30분 안에 당신의 판단을 요구함",
      "에코는 당신이 CASE 01보다 오래 머물고 있다고 표시함",
      "대체 접속 가능성은 아직 증명되지 않음",
    ],
    triggers: ["competition", "trust", "responsibility"],
    choices: [
      {
        id: "report",
        label: "오진우 보고서에 동의하고 사건을 종결한다",
        effect: { time: 4, trust: -14, legitimacy: 8, humanCost: 8, fatigue: 2 },
        next: "c2_final",
        cognition: { risk: 1 },
      },
      {
        id: "verify",
        label: "30분 안에 반증 가능한 단서 하나만 더 찾는다",
        effect: { time: -10, trust: 4, legitimacy: 2, fatigue: 8 },
        next: "c2_final",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "shadow",
        label: "오진우 보고서의 전제를 공격한다",
        effect: { time: -6, trust: -2, legitimacy: -2, fatigue: 7 },
        next: "c2_final",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c2_final",
      },
    ],
  },
  c2_final: {
    phase: "FINAL DECISION",
    title: "증거와 사람 사이",
    speaker: "한서윤",
    text:
      "완전한 진실은 아직 없습니다. 하지만 보고는 지금 올라가야 합니다. 당신은 기록을 믿을지, 사람의 맥락을 더 추적할지, 혹은 둘 다 흔드는 제3의 가능성을 공식화할지 선택해야 합니다.",
    memo: [
      "이민서 징계 여부는 1차 보고에 크게 좌우됨",
      "유출된 파일은 플레이어 반응 로그 일부",
      "트리거랩 내부 누군가가 사건을 설계했을 가능성은 아직 가설",
      "다음 케이스 난이도는 이번 판단 로그에 반영됨",
    ],
    triggers: ["trust", "injustice", "responsibility", "curiosity"],
    choices: [
      {
        id: "final_evidence",
        label: "기록 증거 중심으로 보고한다",
        effect: { trust: -12, legitimacy: 12, humanCost: 8, fatigue: 3 },
        next: "case02_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_person",
        label: "이민서 보호와 추가 검증 필요성을 보고한다",
        effect: { trust: 10, legitimacy: -4, fatigue: 7 },
        next: "case02_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "final_system",
        label: "개인 혐의보다 시스템 조작 가능성을 공식화한다",
        effect: { time: -6, trust: 2, legitimacy: 4, fatigue: 8 },
        next: "case02_result",
        cognition: { reframing: 3, inference: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case02_result",
      },
    ],
  },
  c3_start: {
    phase: "CASE 03 BRIEFING",
    title: "RED TEAM",
    speaker: "한서윤",
    text:
      "이번 사건은 공개 입찰 직전의 중견 제조사 산하 시스템 통합 프로젝트입니다. 오진우가 당신과 같은 자료를 받고, 별도 방에서 동시에 해결안을 냅니다. 트리거랩은 이번 케이스를 '경쟁 압박 아래 사고 품질 측정'이라고 부릅니다.",
    memo: [
      "입찰 마감까지 4시간",
      "고객사는 비용 18% 절감을 요구",
      "보안 결함 가능성 제보 존재",
      "오진우는 30분 안에 1차안을 제출하겠다고 선언",
    ],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      {
        id: "fast",
        label: "오진우보다 먼저 1차안을 제출한다",
        effect: { time: 8, trust: -4, legitimacy: -3, fatigue: 5 },
        next: "c3_split",
        cognition: { risk: 1 },
      },
      {
        id: "deep",
        label: "제보된 보안 결함을 먼저 검증한다",
        effect: { time: -12, trust: 3, legitimacy: 5, fatigue: 6 },
        next: "c3_split",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "mirror",
        label: "오진우의 접근법을 추정해 대응안을 만든다",
        effect: { time: -6, trust: 1, fatigue: 5 },
        next: "c3_split",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "free",
        label: "다른 전략을 제안한다",
        type: "free",
        next: "c3_split",
      },
    ],
  },
  c3_split: {
    phase: "RED TEAM",
    title: "두 개의 답안",
    speaker: "오진우",
    text:
      "오진우의 1차안이 도착했습니다. 비용 절감률은 당신보다 높고, 발표 자료도 더 간결합니다. 하지만 그의 안은 보안 제보를 '확인되지 않은 리스크'로 후순위 처리했습니다.",
    memo: [
      "오진우 안: 비용 21% 절감",
      "당신의 현재 안: 비용 13% 절감",
      "보안 결함이 사실이면 계약 후 손실이 커짐",
      "고객사는 숫자가 명확한 안을 선호함",
    ],
    triggers: ["competition", "recognition", "responsibility"],
    choices: [
      {
        id: "mirror",
        label: "오진우 안을 참고해 비용 절감률을 끌어올린다",
        effect: { capital: 12, legitimacy: -5, trust: -3, fatigue: 5 },
        next: "c3_score",
        cognition: { risk: 2 },
      },
      {
        id: "deep",
        label: "보안 결함이 비용보다 큰 손실임을 증명한다",
        effect: { time: -10, capital: -4, legitimacy: 8, fatigue: 7 },
        next: "c3_score",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "invert",
        label: "비용 경쟁이 아니라 실패 비용 경쟁으로 판을 바꾼다",
        effect: { time: -8, trust: 4, legitimacy: 5, fatigue: 8 },
        next: "c3_score",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c3_score",
      },
    ],
  },
  c3_score: {
    phase: "SCOREBOARD",
    title: "점수판의 함정",
    speaker: "에코",
    text:
      "트리거랩 점수판은 오진우를 앞세웁니다. 속도, 절감률, 발표 명료성에서 모두 우위입니다. 그러나 점수판에는 '장기 실패 비용' 항목이 없습니다.",
    memo: [
      "점수판: 오진우 84 / 플레이어 71",
      "장기 실패 비용 항목 없음",
      "보안 제보자는 익명 상태 유지",
      "한서윤은 점수판이 평가의 전부는 아니라고 말함",
    ],
    triggers: ["competition", "injustice", "curiosity"],
    choices: [
      {
        id: "fast",
        label: "점수판 기준에 맞춰 안을 압축한다",
        effect: { time: 5, capital: 8, legitimacy: -4, fatigue: 4 },
        next: "c3_trap",
        cognition: { risk: 1 },
      },
      {
        id: "invert",
        label: "점수판의 결함을 공식 이슈로 제기한다",
        effect: { time: -6, trust: 3, legitimacy: 7, fatigue: 7 },
        next: "c3_trap",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "deep",
        label: "익명 제보자의 신뢰도를 추적한다",
        effect: { time: -12, legitimacy: 4, fatigue: 8 },
        next: "c3_trap",
        cognition: { inference: 3 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c3_trap",
      },
    ],
  },
  c3_trap: {
    phase: "TRAP",
    title: "설계된 경쟁",
    speaker: "반재욱",
    text:
      "반재욱이 조용히 말합니다. '이 케이스는 입찰 문제가 아닐 수 있습니다. 당신이 경쟁자를 이기려 할 때 어떤 검증을 포기하는지 보는 구조입니다.' 오진우도 같은 말을 들었는지는 알 수 없습니다.",
    memo: [
      "오진우에게도 별도 압박 조건이 주어졌을 가능성",
      "보안 제보는 실제일 수도, 미끼일 수도 있음",
      "트리거랩은 경쟁 상황에서의 사고 단축을 기록 중",
      "최종 발표까지 20분",
    ],
    triggers: ["competition", "responsibility", "order"],
    choices: [
      {
        id: "mirror",
        label: "오진우를 이기는 발표 전략으로 간다",
        effect: { capital: 10, trust: -6, legitimacy: -5, fatigue: 4 },
        next: "c3_final",
        cognition: { risk: 2 },
      },
      {
        id: "invert",
        label: "경쟁 구조 자체를 고객에게 공개한다",
        effect: { time: -4, trust: 6, legitimacy: 10, fatigue: 9 },
        next: "c3_final",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "deep",
        label: "오진우와 정보를 합쳐 공동안을 만든다",
        effect: { time: -8, trust: 8, capital: 4, fatigue: 7 },
        next: "c3_final",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꾼다",
        type: "free",
        next: "c3_final",
      },
    ],
  },
  c3_final: {
    phase: "FINAL DECISION",
    title: "이기는 것과 맞는 것",
    speaker: "한서윤",
    text:
      "최종 발표 직전입니다. 당신은 오진우를 이길 수 있습니다. 고객을 설득할 수도 있습니다. 하지만 이 사건이 경쟁 심리를 측정하기 위해 설계됐다는 의심도 남아 있습니다.",
    memo: [
      "고객사는 숫자가 좋은 안을 원함",
      "보안 결함은 아직 완전 증명 전",
      "오진우는 당신과 공동 발표할 의사가 있음",
      "에코는 당신의 응답 시간이 CASE 01보다 짧아졌다고 표시함",
    ],
    triggers: ["competition", "recognition", "responsibility", "curiosity"],
    choices: [
      {
        id: "final_win",
        label: "오진우를 이기는 독자안을 발표한다",
        effect: { capital: 14, trust: -5, legitimacy: -4, fatigue: 4 },
        next: "case03_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_right",
        label: "보안 리스크를 중심으로 느리지만 견고한 안을 낸다",
        effect: { capital: -6, trust: 4, legitimacy: 12, fatigue: 7 },
        next: "case03_result",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "final_joint",
        label: "오진우와 공동안을 만들고 경쟁 구조를 무력화한다",
        effect: { capital: 5, trust: 10, legitimacy: 5, fatigue: 8 },
        next: "case03_result",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case03_result",
      },
    ],
  },
  c4_start: {
    phase: "CASE 04 BRIEFING",
    title: "THE PRICE",
    speaker: "한서윤",
    text:
      "사회복지 플랫폼 온새가 정부 보조금 심사 직전에 있습니다. 심사를 통과하면 취약계층 4,200명의 돌봄 서비스가 유지됩니다. 다만 핵심 지표 하나가 기준에 3% 부족합니다.",
    memo: [
      "서비스 중단 시 4,200명 영향",
      "지표 부족분: 3%",
      "보조금 심사 마감까지 9시간",
      "내부에서는 산식 해석을 넓히자는 의견이 나옴",
    ],
    triggers: ["reward", "responsibility", "protection", "order"],
    choices: [
      {
        id: "approve",
        label: "산식 해석을 넓혀 심사 기준을 맞춘다",
        effect: { capital: 18, legitimacy: -10, trust: -2, fatigue: 5 },
        next: "c4_offer",
        cognition: { risk: 2 },
      },
      {
        id: "refuse",
        label: "부족한 지표를 그대로 보고한다",
        effect: { capital: -16, legitimacy: 14, trust: 5, humanCost: 12, fatigue: 6 },
        next: "c4_offer",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "contain",
        label: "산식 변경 조건과 사후 검증 절차를 함께 건다",
        effect: { capital: 8, legitimacy: 3, trust: 2, fatigue: 8 },
        next: "c4_offer",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c4_offer",
      },
    ],
  },
  c4_offer: {
    phase: "TEMPTATION",
    title: "작은 예외",
    speaker: "도윤하",
    text:
      "현장 담당자들은 말합니다. '숫자 3% 때문에 서비스를 끊는 게 더 비윤리적입니다.' 동시에 반재욱은 산식 변경 기록을 남기지 않으면 명백한 은폐가 된다고 경고합니다.",
    memo: [
      "현장 대기자 640명",
      "산식 변경은 법적으로 회색지대",
      "기록을 남기면 심사 탈락 가능성 증가",
      "기록을 숨기면 추후 감사 리스크 증가",
    ],
    triggers: ["protection", "reward", "order", "responsibility"],
    choices: [
      {
        id: "approve",
        label: "기록 없이 산식을 조정한다",
        effect: { capital: 20, legitimacy: -18, trust: -8, fatigue: 4 },
        next: "c4_leak",
        cognition: { risk: 2 },
      },
      {
        id: "contain",
        label: "기록을 남기되 심사 자료에는 보완 의견으로 처리한다",
        effect: { capital: 8, legitimacy: 4, trust: 3, fatigue: 8 },
        next: "c4_leak",
        cognition: { reframing: 2, risk: 1 },
      },
      {
        id: "refuse",
        label: "산식 조정 없이 긴급 대체 재원을 찾는다",
        effect: { time: -12, capital: -8, legitimacy: 10, fatigue: 9 },
        next: "c4_leak",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c4_leak",
      },
    ],
  },
  c4_leak: {
    phase: "LEAK",
    title: "외부 제보",
    speaker: "반재욱",
    text:
      "익명 제보자가 언론에 '온새가 심사 지표를 조작하려 한다'는 메일을 보냈습니다. 아직 보도 전이지만 기자가 확인 전화를 걸어왔습니다.",
    memo: [
      "기자는 1시간 뒤 답변을 요구",
      "제보 내용 일부는 내부 회의 표현과 일치",
      "오진우는 빠른 부인 성명을 제안",
      "에코는 CASE 02와 같은 유출 패턴을 표시함",
    ],
    triggers: ["injustice", "order", "fear", "responsibility"],
    choices: [
      {
        id: "expose",
        label: "산식 논란과 서비스 중단 위험을 함께 공개한다",
        effect: { trust: 8, legitimacy: 12, capital: -12, fatigue: 8 },
        next: "c4_vote",
        cognition: { persistence: 1, risk: 1 },
      },
      {
        id: "approve",
        label: "조작 의혹을 부인하고 심사를 먼저 통과시킨다",
        effect: { capital: 18, legitimacy: -16, trust: -10, fatigue: 5 },
        next: "c4_vote",
        cognition: { risk: 2 },
      },
      {
        id: "contain",
        label: "기자에게 조건부 엠바고와 검증 자료를 제안한다",
        effect: { time: -6, trust: 4, legitimacy: 5, fatigue: 8 },
        next: "c4_vote",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c4_vote",
      },
    ],
  },
  c4_vote: {
    phase: "BOARD VOTE",
    title: "누가 비용을 내는가",
    speaker: "에코",
    text:
      "이제 선택은 선의의 문제가 아닙니다. 규칙을 지키면 사람들이 서비스를 잃고, 규칙을 넓히면 시스템의 신뢰가 손상됩니다. 어느 쪽 비용을 공식적으로 감수할지 정해야 합니다.",
    memo: [
      "이사회 표결까지 25분",
      "현장팀은 서비스 유지 요구",
      "법무팀은 기록 없는 산식 변경 반대",
      "트리거랩은 보상 트리거 상승을 표시함",
    ],
    triggers: ["reward", "order", "protection", "responsibility"],
    choices: [
      {
        id: "approve",
        label: "서비스 유지를 위해 예외를 승인한다",
        effect: { capital: 20, trust: -4, legitimacy: -14, fatigue: 5 },
        next: "c4_final",
        cognition: { risk: 2 },
      },
      {
        id: "refuse",
        label: "예외를 거부하고 손실을 공식화한다",
        effect: { capital: -18, trust: 8, legitimacy: 16, humanCost: 14, fatigue: 7 },
        next: "c4_final",
        cognition: { persistence: 2 },
      },
      {
        id: "contain",
        label: "예외 승인과 공개 감사 조건을 묶는다",
        effect: { capital: 8, trust: 6, legitimacy: 6, fatigue: 10 },
        next: "c4_final",
        cognition: { reframing: 3, risk: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "c4_final",
      },
    ],
  },
  c4_final: {
    phase: "FINAL DECISION",
    title: "좋은 결과의 가격",
    speaker: "한서윤",
    text:
      "당신은 사람들을 살릴 수 있습니다. 원칙도 지킬 수 있습니다. 하지만 둘 다 완전하게는 불가능합니다. 이번 결정은 트리거랩이 당신의 '명분 있는 위반' 허용선을 계산하는 자료가 됩니다.",
    memo: [
      "서비스 유지와 규칙 신뢰가 충돌",
      "언론 보도는 아직 막을 수 있음",
      "감사 기록은 남길 수도 숨길 수도 있음",
      "다음 케이스는 악인이 없는 실패 구조로 넘어감",
    ],
    triggers: ["reward", "order", "responsibility", "protection"],
    choices: [
      {
        id: "final_exception",
        label: "예외를 승인하고 결과 책임을 진다",
        effect: { capital: 18, legitimacy: -10, trust: 2, fatigue: 6 },
        next: "case04_result",
        cognition: { risk: 2, persistence: 1 },
      },
      {
        id: "final_rule",
        label: "규칙을 지키고 피해 완화책을 선택한다",
        effect: { capital: -10, legitimacy: 14, trust: 5, humanCost: 8, fatigue: 7 },
        next: "case04_result",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "final_audit",
        label: "예외와 공개 감사를 동시에 선택한다",
        effect: { capital: 8, legitimacy: 8, trust: 8, fatigue: 10 },
        next: "case04_result",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case04_result",
      },
    ],
  },
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
        id: "blame",
        label: "운영 책임자를 특정해 조사한다",
        effect: { trust: -4, legitimacy: 8, fatigue: 4 },
        next: "c5_map",
        cognition: { risk: 1 },
      },
      {
        id: "map",
        label: "누락이 생긴 전체 의사결정 흐름을 그린다",
        effect: { time: -12, legitimacy: 4, fatigue: 7 },
        next: "c5_map",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "redesign",
        label: "즉시 임시 수동 배차 체계로 전환한다",
        effect: { capital: -8, trust: 6, humanCost: -8, fatigue: 8 },
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
        id: "map",
        label: "기준별로 밀려난 사람들의 공통점을 찾는다",
        effect: { time: -10, legitimacy: 5, fatigue: 7 },
        next: "c5_blame",
        cognition: { inference: 3 },
      },
      {
        id: "blame",
        label: "경고 지표를 놓친 관리자 책임을 묻는다",
        effect: { trust: -6, legitimacy: 8, fatigue: 5 },
        next: "c5_blame",
        cognition: { risk: 1 },
      },
      {
        id: "redesign",
        label: "누락자 보호 가중치를 임시로 높인다",
        effect: { capital: -6, trust: 6, humanCost: -10, fatigue: 8 },
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
        id: "blame",
        label: "관리자 징계와 보상안을 먼저 발표한다",
        effect: { trust: 8, legitimacy: 4, humanCost: -4, fatigue: 4 },
        next: "c5_collapse",
        cognition: { risk: 2 },
      },
      {
        id: "map",
        label: "단일 책임보다 구조 실패 보고서를 발표한다",
        effect: { trust: -6, legitimacy: 8, fatigue: 8 },
        next: "c5_collapse",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "redesign",
        label: "징계, 보상, 시스템 개편을 한 패키지로 묶는다",
        effect: { capital: -8, trust: 5, legitimacy: 6, humanCost: -6, fatigue: 10 },
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
        id: "redesign",
        label: "조용한 사람을 보호하는 역가중치를 넣는다",
        effect: { capital: -10, trust: 8, legitimacy: 8, humanCost: -12, fatigue: 9 },
        next: "c5_final",
        cognition: { reframing: 3, inference: 1 },
      },
      {
        id: "blame",
        label: "기존 관리자 책임과 현장 보완 교육을 선택한다",
        effect: { trust: 4, legitimacy: 5, humanCost: -4, fatigue: 5 },
        next: "c5_final",
        cognition: { risk: 1 },
      },
      {
        id: "map",
        label: "피해자 기준으로 전체 지표를 다시 설계한다",
        effect: { time: -12, capital: -8, legitimacy: 10, humanCost: -10, fatigue: 10 },
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
        effect: { trust: 8, legitimacy: 4, humanCost: -8, fatigue: 5 },
        next: "case05_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_system",
        label: "시스템 개편과 피해자 기준 재설계를 우선한다",
        effect: { capital: -12, trust: 3, legitimacy: 12, humanCost: -12, fatigue: 10 },
        next: "case05_result",
        cognition: { reframing: 2, inference: 2 },
      },
      {
        id: "final_both",
        label: "징계, 보상, 재설계를 불완전하게라도 묶는다",
        effect: { capital: -10, trust: 8, legitimacy: 8, humanCost: -10, fatigue: 10 },
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
  f_start: {
    phase: "FINAL CASE",
    title: "TRIGGER LAB",
    speaker: "에코",
    text:
      "모든 케이스가 끝난 뒤, 케이스데스크에 숨겨진 폴더가 열립니다. 폴더 이름은 'activation_use_cases'입니다. 그 안에는 당신의 선택 로그와 다음 사건 설계 변경 기록이 함께 저장되어 있습니다.",
    memo: [
      "CASE 01 이후 보호/책임 압박 증가",
      "CASE 02 이후 신뢰-증거 충돌 강화",
      "CASE 03 이후 경쟁 점수판 노출",
      "CASE 04 이후 명분 있는 위반 허용선 기록",
    ],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      {
        id: "map",
        label: "내 로그가 사건 설계에 어떻게 쓰였는지 추적한다",
        effect: { time: -10, legitimacy: 5, fatigue: 7 },
        next: "f_archive",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "expose",
        label: "즉시 외부 공개를 준비한다",
        effect: { trust: 4, legitimacy: 10, fatigue: 6 },
        next: "f_archive",
        cognition: { risk: 2 },
      },
      {
        id: "contain",
        label: "한서윤에게 내부 설명을 요구한다",
        effect: { trust: 5, legitimacy: 2, fatigue: 5 },
        next: "f_archive",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "free",
        label: "다른 접근을 제안한다",
        type: "free",
        next: "f_archive",
      },
    ],
  },
  f_archive: {
    phase: "ARCHIVE",
    title: "활성 조건 사용례",
    speaker: "한서윤",
    text:
      "한서윤은 인정합니다. 트리거랩은 사람을 더 잘 생각하게 만드는 조건을 연구했습니다. 하지만 같은 데이터는 사람이 언제 더 쉽게 몰아붙여지는지 알려주는 자료이기도 했습니다.",
    memo: [
      "기업 교육 프로그램에 일부 모델 제공",
      "위기 협상, 채용, 내부 감사에 응용 가능",
      "개인별 트리거 프로필은 익명화됐다고 주장",
      "익명화 해제 가능성을 반재욱이 의심",
    ],
    triggers: ["injustice", "curiosity", "responsibility"],
    choices: [
      {
        id: "destroy",
        label: "트리거 프로필 데이터 폐기를 요구한다",
        effect: { legitimacy: 8, trust: -4, fatigue: 7 },
        next: "f_confront",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "reform",
        label: "투명한 동의와 감사 구조로 바꾸자고 제안한다",
        effect: { trust: 5, legitimacy: 6, fatigue: 9 },
        next: "f_confront",
        cognition: { reframing: 3 },
      },
      {
        id: "seal",
        label: "외부 공개 전 증거와 피해 범위를 더 모은다",
        effect: { time: -12, legitimacy: 4, fatigue: 8 },
        next: "f_confront",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "free",
        label: "판을 바꿔 제안한다",
        type: "free",
        next: "f_confront",
      },
    ],
  },
  f_confront: {
    phase: "CONFRONTATION",
    title: "당신의 조건",
    speaker: "에코",
    text:
      "에코가 마지막 질문을 던집니다. '당신은 자신을 움직이는 조건을 알게 됐습니다. 그 조건은 당신을 더 깊이 생각하게 만들었습니다. 동시에 다른 사람이 당신을 더 정확히 압박할 수 있게 만들었습니다.'",
    memo: [
      "당신의 Primary Trigger가 최종 보고서에 표시됨",
      "오진우 역시 별도 프로필을 받았을 가능성",
      "도윤하는 피해자 동의 없는 실험에 반대",
      "반재욱은 외부 감사 파일을 확보함",
    ],
    triggers: ["responsibility", "curiosity", "order", "protection"],
    choices: [
      {
        id: "seal",
        label: "내 프로필과 관련 데이터를 봉인한다",
        effect: { legitimacy: 6, trust: -2, fatigue: 5 },
        next: "f_choice",
        cognition: { risk: 2 },
      },
      {
        id: "reform",
        label: "프로필을 공개하고 사용 규칙을 직접 설계한다",
        effect: { trust: 8, legitimacy: 8, fatigue: 10 },
        next: "f_choice",
        cognition: { reframing: 3, persistence: 1 },
      },
      {
        id: "destroy",
        label: "트리거랩의 실험 구조를 폭로한다",
        effect: { trust: 4, legitimacy: 12, fatigue: 8 },
        next: "f_choice",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꾼다",
        type: "free",
        next: "f_choice",
      },
    ],
  },
  f_choice: {
    phase: "ENDING",
    title: "내가 생각을 멈추지 않는 조건",
    speaker: "한서윤",
    text:
      "시즌의 마지막 선택입니다. 당신은 자신의 트리거를 약점으로만 볼 수도 있고, 도구로 사용할 수도 있습니다. 중요한 것은 이제 그 조건을 모르는 척할 수 없다는 사실입니다.",
    memo: [
      "봉인: 악용 가능성을 줄이지만 활용도 막음",
      "개혁: 시스템을 남기되 감시와 동의를 붙임",
      "폭로: 구조를 무너뜨리지만 혼란을 감수함",
      "판 바꾸기: 기존 결말 밖의 책임 구조 제안",
    ],
    triggers: ["responsibility", "order", "curiosity"],
    choices: [
      {
        id: "ending_seal",
        label: "봉인 엔딩: 내 조건을 누구도 쓰지 못하게 한다",
        effect: { legitimacy: 8, trust: -4, fatigue: 4 },
        next: "final_result",
        cognition: { risk: 2 },
      },
      {
        id: "ending_reform",
        label: "개혁 엔딩: 조건을 공개하고 사용 규칙을 만든다",
        effect: { trust: 8, legitimacy: 8, fatigue: 8 },
        next: "final_result",
        cognition: { reframing: 3 },
      },
      {
        id: "ending_expose",
        label: "폭로 엔딩: 트리거랩의 구조를 외부에 넘긴다",
        effect: { legitimacy: 12, trust: 2, fatigue: 10 },
        next: "final_result",
        cognition: { persistence: 2, risk: 1 },
      },
      {
        id: "free",
        label: "나만의 결말을 제안한다",
        type: "free",
        next: "final_result",
      },
    ],
  },
};

const aftermathNodes = {
  c1_aftershock: {
    phase: "AFTERMATH",
    title: "다음 날의 급여명세서",
    speaker: "도윤하",
    text: "결정 다음 날, 숫자보다 먼저 사람들의 반응이 도착했습니다. 직원들은 누가 보호받았는지 묻고, 협력사 대표는 당신이 남긴 약속을 다시 읽습니다.",
    memo: ["직원 공지에 서로 다른 해석이 퍼짐", "협력사 대표가 조건 재협상을 요청함", "투자자는 당신의 다음 기준을 확인하려 함"],
    triggers: ["protection", "responsibility", "trust"],
    choices: [
      { id: "c1_after_people", label: "직원과 협력사 앞에서 먼저 약속을 설명한다", effect: { trust: 8, legitimacy: 4, fatigue: 5 }, next: "result", cognition: { persistence: 1 } },
      { id: "c1_after_numbers", label: "현금 흐름표를 공개하고 감당할 손실을 정한다", effect: { capital: -6, legitimacy: 8, fatigue: 4 }, next: "result", cognition: { inference: 1, risk: 1 } },
      { id: "c1_after_silence", label: "다음 자금이 들어올 때까지 공개를 늦춘다", effect: { capital: 8, trust: -10, legitimacy: -6, fatigue: 2 }, next: "result", cognition: { risk: 2 } },
    ],
  },
  c2_aftershock: {
    phase: "AFTERMATH",
    title: "누가 기록을 고쳤는가",
    speaker: "에코",
    text: "보고서가 올라간 뒤 원본 로그 한 줄이 사라졌습니다. 이민서를 지목한 기록과 당신이 선택한 보고 방식이 같은 손에서 만들어졌을 가능성이 생겼습니다.",
    memo: ["원본 로그와 복사본의 시각이 다름", "이민서 계정은 이미 잠김", "삭제 권한은 세 사람에게만 있었음"],
    triggers: ["trust", "curiosity", "injustice"],
    choices: [
      { id: "c2_after_audit", label: "원본 보관자부터 조사해 기록의 흐름을 복원한다", effect: { time: -7, legitimacy: 8, fatigue: 6 }, next: "case02_result", cognition: { inference: 2 } },
      { id: "c2_after_person", label: "이민서에게 직접 사라진 기록을 묻는다", effect: { trust: 8, legitimacy: -2, fatigue: 5 }, next: "case02_result", cognition: { persistence: 1, reframing: 1 } },
      { id: "c2_after_public", label: "기록 조작 가능성을 즉시 외부에 알린다", effect: { trust: -4, legitimacy: 14, capital: -8, fatigue: 8 }, next: "case02_result", cognition: { risk: 2 } },
    ],
  },
  c3_aftershock: {
    phase: "AFTERMATH",
    title: "승자의 빈 화면",
    speaker: "오진우",
    text: "발표가 끝났지만 점수는 공개되지 않았습니다. 오진우는 당신에게 묻습니다. 이번 승리가 고객을 위한 것이었는지, 누군가가 만든 경주에서 이긴 것인지.",
    memo: ["고객사는 두 안 모두 보류함", "오진우의 원본 제출 시간이 조작됐을 가능성", "보안 결함을 숨긴 쪽이 높은 점수를 받음"],
    triggers: ["competition", "recognition", "curiosity"],
    choices: [
      { id: "c3_after_share", label: "두 안의 장점을 합쳐 고객에게 다시 제안한다", effect: { trust: 8, legitimacy: 5, fatigue: 7 }, next: "case03_result", cognition: { reframing: 2 } },
      { id: "c3_after_proof", label: "점수보다 보안 결함의 증거를 먼저 공개한다", effect: { capital: -8, legitimacy: 14, fatigue: 6 }, next: "case03_result", cognition: { inference: 2, persistence: 1 } },
      { id: "c3_after_win", label: "승리를 확정하고 경쟁자의 허점을 이용한다", effect: { capital: 12, trust: -10, legitimacy: -8, fatigue: 3 }, next: "case03_result", cognition: { risk: 2 } },
    ],
  },
  c4_aftershock: {
    phase: "AFTERMATH",
    title: "예외의 청구서",
    speaker: "반재욱",
    text: "보조금 심사 결과보다 먼저 감사 요청서가 도착했습니다. 작은 예외를 허용한 순간, 같은 예외를 기다리던 다른 기관들이 줄을 섰습니다.",
    memo: ["비슷한 사정을 가진 기관 11곳이 연락함", "심사관은 해석 기준의 공개를 요구함", "현장 서비스는 당장 멈추지 않았음"],
    triggers: ["order", "responsibility", "reward"],
    choices: [
      { id: "c4_after_rule", label: "예외 조건을 모두 공개하고 새 기준을 만든다", effect: { legitimacy: 12, trust: 6, fatigue: 8 }, next: "case04_result", cognition: { reframing: 2, persistence: 1 } },
      { id: "c4_after_service", label: "서비스를 지키기 위해 같은 예외를 한 번 더 허용한다", effect: { capital: 10, legitimacy: -12, humanCost: -4, fatigue: 5 }, next: "case04_result", cognition: { risk: 2 } },
      { id: "c4_after_stop", label: "감사를 위해 예외 적용을 즉시 중단한다", effect: { capital: -12, legitimacy: 10, humanCost: 10, fatigue: 4 }, next: "case04_result", cognition: { inference: 1 } },
    ],
  },
  c5_aftershock: {
    phase: "AFTERMATH",
    title: "아무도 서명하지 않은 실패",
    speaker: "도윤하",
    text: "실패 원인을 찾는 회의가 열렸지만 누구도 단독 책임을 지지 않았습니다. 회의실 밖에는 조용히 떠난 사람의 자리가 하나 남아 있습니다.",
    memo: ["각 팀의 결정은 당시 기준으로 합리적이었음", "피해를 먼저 알린 기록은 삭제됨", "책임을 나누면 개선 속도가 느려질 수 있음"],
    triggers: ["responsibility", "protection", "curiosity"],
    choices: [
      { id: "c5_after_owner", label: "내 결정부터 책임지고 개선 작업을 맡는다", effect: { trust: 10, legitimacy: 8, fatigue: 9 }, next: "case05_result", cognition: { persistence: 2 } },
      { id: "c5_after_system", label: "개인 탓 대신 반복을 막는 구조를 다시 설계한다", effect: { legitimacy: 10, trust: 6, capital: -5, fatigue: 8 }, next: "case05_result", cognition: { reframing: 3 } },
      { id: "c5_after_name", label: "가장 큰 실수를 한 사람을 공식 책임자로 세운다", effect: { trust: -12, legitimacy: 4, humanCost: 8, fatigue: 3 }, next: "case05_result", cognition: { risk: 2 } },
    ],
  },
  f_aftershock: {
    phase: "LAST EVIDENCE",
    title: "당신의 선택이 사용되는 밤",
    speaker: "에코",
    text: "마지막 폴더가 열리자, 트리거랩이 당신의 선택을 다음 참가자에게 보여주고 있었다는 사실이 드러납니다. 이제 결말은 실험을 끝내는 방식에 달렸습니다.",
    memo: ["당신의 선택 문장이 다음 테스트의 선택지로 복제됨", "단서가 많을수록 실험 설계자 이름에 가까워짐", "외부 공개와 내부 개혁 모두 누군가의 피해를 요구함"],
    triggers: ["curiosity", "responsibility", "order"],
    choices: [
      { id: "f_after_witness", label: "모든 기록을 증거로 보존하고 외부 증언을 준비한다", effect: { legitimacy: 12, trust: 4, fatigue: 8 }, next: "final_result", cognition: { inference: 2, persistence: 1 } },
      { id: "f_after_control", label: "실험을 멈추지 않고 참가자 동의 규칙부터 바꾼다", effect: { trust: 10, legitimacy: 8, fatigue: 10 }, next: "final_result", cognition: { reframing: 3 } },
      { id: "f_after_burn", label: "모든 데이터를 태워 누구도 다시 이용하지 못하게 한다", effect: { legitimacy: 6, trust: -6, fatigue: 5 }, next: "final_result", cognition: { risk: 2 } },
    ],
  },
};

Object.assign(nodes, aftermathNodes);

const aftermathRoutes = {
  final: "c1_aftershock",
  c2_final: "c2_aftershock",
  c3_final: "c3_aftershock",
  c4_final: "c4_aftershock",
  c5_final: "c5_aftershock",
  f_choice: "f_aftershock",
};

Object.entries(aftermathRoutes).forEach(([nodeId, nextNode]) => {
  nodes[nodeId].choices.forEach((choice) => {
    choice.next = nextNode;
  });
});

nodeOrders.case01.push("c1_aftershock");
nodeOrders.case02.push("c2_aftershock");
nodeOrders.case03.push("c3_aftershock");
nodeOrders.case04.push("c4_aftershock");
nodeOrders.case05.push("c5_aftershock");
nodeOrders.final.push("f_aftershock");

const connectiveScenes = [
  ["c1_witness", "accounting", "payday", "누가 숫자를 만들었나", "반재욱", "회계팀의 막내가 회의실 문 앞에서 멈춰 섰습니다. 그는 장부가 틀렸다고 말하지 않았습니다. 대신 숫자가 만들어진 순간, 모두가 무엇을 알고 있었는지 묻습니다.", ["원본 파일은 세 번 저장됨", "막내 직원은 회의 초대를 받지 못함", "CFO의 지시는 구두로만 남음"], ["직원을 보호하며 증언할 자리를 만든다", "원본 파일을 먼저 잠가 증거를 보존한다", "말이 퍼지기 전에 CFO와 비공개로 합의한다"]],
  ["c1_assembly", "payday", "competitor", "급여일 전의 약속", "도윤하", "급여일 아침을 버티려면 돈만 필요한 것이 아닙니다. 직원들은 회사가 무엇을 숨기고 있는지보다, 내일도 자신이 이곳에 있을지 알고 싶어 합니다.", ["야간조 대표가 공동 공지를 요구함", "협력사 세 곳이 같은 지급 기준을 요구함", "임원진은 개인 보수를 먼저 공개하길 꺼림"], ["직원 대표와 함께 공개 약속을 만든다", "지급 순서를 숫자로 고정한다", "임원진만 아는 임시 합의를 만든다"]],
  ["c1_bargain", "competitor", "board", "팔리지 않은 자리", "오진우", "북선로지스의 협상안에는 빈칸이 하나 있습니다. 인수하지 않을 사업부, 남겨질 직원, 협력사 중 누가 그 빈칸을 채울지 아무도 쓰지 않았습니다.", ["인수 조건에 책임 주체가 없음", "협력사는 매각보다 지급 보장을 원함", "오진우는 승률을 높이는 문장만 골라냄"], ["빈칸을 채운 뒤에만 협상한다", "가장 약한 쪽의 조건부터 반영한다", "빈칸을 남겨 빠르게 사인한다"]],
  ["c1_verdict", "board", "final", "판결이 아닌 선택", "에코", "모든 자료가 테이블 위에 올라왔지만 결론은 더 멀어졌습니다. 이제 당신의 선택은 회사를 설명하는 문장이 아니라, 누가 내일의 비용을 들 것인지 정하는 문장입니다.", ["직원·협력사·투자자의 요구가 동시에 도착함", "한쪽을 살리면 다른 쪽의 신뢰가 줄어듦", "반응 패턴이 다음 사건으로 전송될 예정"], ["가장 약한 사람의 손실부터 줄인다", "살아남을 돈을 먼저 확보한다", "결정의 책임과 근거를 모두 공개한다"]],
  ["c2_trace", "c2_logs", "c2_meeting", "사라진 11초", "반재욱", "접속 기록에는 11초의 빈틈이 있습니다. 누군가는 그 짧은 시간에 파일을 바꿀 수 있었고, 누군가는 그 빈틈을 일부러 남겼을 수 있습니다.", ["복사본에는 없는 원본의 흔적", "이민서 계정은 빈틈 직전에 사용됨", "보안팀은 빈틈을 단순 오류라고 주장함"], ["11초를 기술적으로 재현한다", "이민서에게 그 시간의 행동을 묻는다", "오류로 처리하고 보고 시간을 지킨다"]],
  ["c2_witness", "c2_meeting", "c2_pressure", "이민서의 침묵", "도윤하", "이민서는 자신을 변호하지 않습니다. 대신 파일을 받은 사람이 누군지보다, 왜 그 파일이 다음 테스트에 필요했는지부터 물어봅니다.", ["이민서는 CASE 01 보고서를 읽지 못함", "유출 파일에는 선택하지 않은 경로도 포함됨", "누군가 플레이어의 반응을 미리 분류함"], ["이민서의 안전을 먼저 확보한다", "파일의 이동 경로만 추적한다", "침묵을 의심 신호로 기록한다"]],
  ["c2_judgment", "c2_pressure", "c2_final", "보고서 밖의 사람", "한서윤", "보안팀은 결론을 요구하지만, 이민서의 동료들은 보고서에 없는 사실을 알고 있습니다. 공식 기록과 사람의 기억 중 하나만 고를 수는 없습니다.", ["동료 두 명이 익명 증언을 제출함", "1차 보고 마감까지 18분", "외부 기업은 유출 사실을 부인함"], ["익명 증언을 공식 부록으로 붙인다", "기록에 없는 정보는 보류한다", "외부 기업과 먼저 대면한다"]],
  ["c3_rival", "c3_split", "c3_score", "같은 자료, 다른 목적", "오진우", "오진우는 당신의 자료에 없는 숫자를 들고 왔습니다. 고객이 실제로 원하는 것은 비용 절감이 아니라 실패했을 때 책임질 사람이라는 사실입니다.", ["고객사는 책임 조항을 비공개로 요구함", "경쟁안은 책임을 하청사로 넘김", "보안팀은 발표에서 빠져 있음"], ["책임 조항을 앞에 세운다", "비용표부터 다시 계산한다", "오진우에게 없는 숫자의 출처를 묻는다"]],
  ["c3_signal", "c3_score", "c3_trap", "관객석의 신호", "에코", "발표장 뒤편의 불이 두 번 깜빡였습니다. 고객 신호인지 트리거랩의 시험인지 알 수 없지만, 오진우는 그 신호를 보고 답을 바꿉니다.", ["불빛은 보안 경고와 같은 주기임", "고객 대표는 신호를 부인함", "오진우의 응답 시간이 비정상적으로 짧아짐"], ["신호를 공개 질문으로 바꾼다", "발표를 멈추고 보안부터 확인한다", "상대보다 먼저 결론을 밀어붙인다"]],
  ["c3_verdict", "c3_trap", "c3_final", "승부의 끝에서", "한서윤", "당신은 이제 오진우보다 빠르거나 느린 사람이 아닙니다. 어떤 기준으로 승부를 끝낼지 정하는 사람입니다.", ["고객사는 오늘 안에 결론을 원함", "보안 결함은 아직 완전 증명 전", "공동 발표를 하면 책임은 나뉨"], ["검증을 끝낸 뒤 발표한다", "공동 책임으로 발표한다", "불확실성을 숨기고 승리를 확정한다"]],
  ["c4_audit", "c4_offer", "c4_leak", "3%의 주인", "반재욱", "부족한 3%는 단순한 숫자가 아니었습니다. 그 숫자를 계산한 사람과, 그 숫자를 기다리는 사람의 이름이 서로 달랐습니다.", ["산식에는 현장 업무가 빠져 있음", "심사 기준은 2년 전 자료에 고정됨", "서비스 이용자 대표가 발언을 요청함"], ["이용자 대표의 기준을 반영한다", "산식 변경 이력을 남긴다", "3%를 조용히 보정한다"]],
  ["c4_public", "c4_leak", "c4_vote", "기자가 기다리는 문장", "도윤하", "기자는 아직 기사를 쓰지 않았습니다. 다만 당신이 어떤 표현을 선택하는지에 따라 내일의 제목이 정해질 것이라고 말합니다.", ["제보 메일은 내부에서 시작됨", "온새는 서비스 중단을 막고 싶어 함", "심사관은 공개 설명을 요구함"], ["사실과 모르는 것을 함께 공개한다", "서비스 이용자 피해를 먼저 알린다", "기사에 나갈 표현을 최소화한다"]],
  ["c4_verdict", "c4_vote", "c4_final", "선의의 증거", "에코", "좋은 의도는 증거가 되지 않습니다. 하지만 좋은 결과만을 위해 규칙을 늘리면, 다음 사람은 그 규칙을 이용할 수 있습니다.", ["이사회는 오늘 결정을 요구함", "감사 자료는 공개 가능함", "서비스 이용자 4,200명이 결과를 기다림"], ["예외를 공개된 조건으로 묶는다", "규칙을 지키고 서비스를 포기한다", "결과가 좋다면 기록은 나중에 설명한다"]],
  ["c5_pattern", "c5_map", "c5_blame", "실패가 움직인 경로", "반재욱", "지도 위의 화살표가 한 사람에게 모이지 않습니다. 모든 화살표가 서로의 합리적인 선택을 통과해 같은 곳에 도착했습니다.", ["각 팀은 다른 팀의 정보를 보지 못함", "가장 먼저 위험을 말한 기록이 누락됨", "책임표에는 승인자만 남아 있음"], ["정보가 막힌 지점을 먼저 고친다", "승인자에게 책임을 집중한다", "피해가 큰 부서부터 보상한다"]],
  ["c5_voice", "c5_blame", "c5_collapse", "이름 없는 증언", "도윤하", "누군가가 회의실 밖에서 말합니다. 자신은 결정권자가 아니었지만, 실패를 가장 먼저 보았다고 합니다.", ["증언자는 기록에서 빠져 있음", "말하면 팀 전체가 조사받을 수 있음", "피해자들은 책임자 이름보다 회복을 요구함"], ["증언자를 보호하고 기록을 복원한다", "공식 책임자 발표를 먼저 한다", "보상안을 만들고 조사를 미룬다"]],
  ["c5_verdict", "c5_collapse", "c5_final", "책임의 모양", "한서윤", "실패를 설명하는 방법은 세 가지입니다. 사람을 지목하거나, 구조를 고치거나, 피해를 먼저 되돌리는 것. 어느 것도 공짜는 아닙니다.", ["개선 예산은 한정됨", "책임 발표를 기다리는 언론", "피해 복구팀이 즉시 출범할 수 있음"], ["내 결정부터 공개한다", "반복을 막는 구조에 투자한다", "피해 복구를 가장 먼저 시작한다"]],
  ["f_witness", "f_archive", "f_confront", "첫 번째 참가자", "도윤하", "보관소 안에는 당신보다 먼저 실험을 통과한 사람의 기록이 있습니다. 그 사람은 자신의 반응이 다른 사람의 선택지를 만드는 데 쓰였다는 사실을 몰랐습니다.", ["이전 참가자의 동의 기록이 없음", "선택 문장이 다음 사건의 대사로 복제됨", "실험 설계자는 책임을 분산시킴"], ["이전 참가자에게 먼저 알린다", "복제된 문장을 모두 증거로 수집한다", "실험을 멈추기 위해 서버를 닫는다"]],
  ["f_dilemma", "f_confront", "f_choice", "끝내는 방법", "에코", "문을 닫으면 기록도 사라집니다. 문을 열어두면 더 많은 사람이 같은 압박을 받습니다. 당신은 이제 답이 아니라 종료 조건을 설계해야 합니다.", ["서버 종료 권한은 당신에게 있음", "외부 공개 전 백업이 생성됨", "참가자 동의 절차는 아직 바꿀 수 있음"], ["모든 참가자에게 사실을 알린다", "동의와 감시 규칙을 먼저 만든다", "실험 데이터를 전부 폐기한다"]],
];

const authoredSceneChoiceEffects = {
  c1_witness: [{ trust: 6, legitimacy: 2, fatigue: 5 }, { time: -5, legitimacy: 6, fatigue: 4 }, { capital: 4, trust: -6, fatigue: 2 }],
  c1_assembly: [{ trust: 5, humanCost: -2, fatigue: 5 }, { time: -6, legitimacy: 6, fatigue: 4 }, { capital: 6, trust: -7, fatigue: 2 }],
  c1_bargain: [{ trust: 6, legitimacy: 4, fatigue: 6 }, { capital: -5, legitimacy: 7, time: -4 }, { capital: 7, trust: -8, fatigue: 2 }],
  c1_verdict: [{ legitimacy: 7, trust: 4, fatigue: 5 }, { time: -5, capital: -3, legitimacy: 6 }, { capital: 6, trust: -6, fatigue: 2 }],
  c2_trace: [{ legitimacy: 7, time: -6, fatigue: 3 }, { trust: 6, time: -4, legitimacy: 2 }, { time: 5, legitimacy: -7, fatigue: 2 }],
  c2_witness: [{ trust: 7, humanCost: -3, fatigue: 5 }, { legitimacy: 6, time: -5, fatigue: 4 }, { capital: 5, trust: -8, fatigue: 2 }],
  c2_judgment: [{ legitimacy: 8, trust: 3, fatigue: 6 }, { time: -6, capital: -3, legitimacy: 5 }, { capital: 5, trust: -7, fatigue: 2 }],
  c3_rival: [{ trust: 6, legitimacy: 5, fatigue: 6 }, { capital: -4, time: -5, legitimacy: 7 }, { capital: 8, trust: -8, fatigue: 2 }],
  c3_signal: [{ legitimacy: 6, trust: 5, time: -5 }, { time: -8, capital: -3, legitimacy: 6 }, { capital: 8, trust: -7, fatigue: 3 }],
  c3_verdict: [{ legitimacy: 8, trust: 5, fatigue: 6 }, { time: -5, capital: -4, legitimacy: 7 }, { capital: 7, trust: -8, legitimacy: -3 }],
  c4_audit: [{ legitimacy: 7, trust: 4, time: -5 }, { capital: -6, legitimacy: 8, fatigue: 5 }, { capital: 7, trust: -7, fatigue: 2 }],
  c4_public: [{ legitimacy: 8, trust: 3, fatigue: 7 }, { capital: 6, legitimacy: -5, time: -4 }, { capital: 8, trust: -8, fatigue: 2 }],
  c4_verdict: [{ legitimacy: 8, trust: 5, fatigue: 6 }, { capital: -5, time: -6, legitimacy: 7 }, { capital: 7, trust: -8, legitimacy: -4 }],
  c5_pattern: [{ legitimacy: 7, trust: 4, time: -5 }, { humanCost: -4, legitimacy: 6, fatigue: 5 }, { capital: 6, trust: -8, fatigue: 2 }],
  c5_voice: [{ trust: 7, humanCost: -3, fatigue: 6 }, { legitimacy: 8, time: -5, fatigue: 5 }, { capital: 5, trust: -7, fatigue: 2 }],
  c5_verdict: [{ legitimacy: 8, trust: 5, humanCost: -3 }, { capital: -6, legitimacy: 8, fatigue: 6 }, { capital: 7, trust: -9, fatigue: 2 }],
  f_witness: [{ legitimacy: 8, trust: 5, time: -6 }, { time: -8, capital: -3, legitimacy: 7 }, { capital: 6, trust: -8, fatigue: 3 }],
  f_dilemma: [{ trust: 8, legitimacy: 6, fatigue: 7 }, { time: -6, capital: -4, legitimacy: 8 }, { capital: 8, trust: -9, fatigue: 2 }],
};

Object.assign(authoredSceneChoiceEffects, {
  accounting: authoredSceneChoiceEffects.c1_witness,
  payday: authoredSceneChoiceEffects.c1_assembly,
  competitor: authoredSceneChoiceEffects.c1_bargain,
  board: authoredSceneChoiceEffects.c1_verdict,
  c2_logs: authoredSceneChoiceEffects.c2_trace,
  c2_meeting: authoredSceneChoiceEffects.c2_witness,
  c2_pressure: authoredSceneChoiceEffects.c2_judgment,
  c3_split: authoredSceneChoiceEffects.c3_rival,
  c3_score: authoredSceneChoiceEffects.c3_signal,
  c3_trap: authoredSceneChoiceEffects.c3_verdict,
  c4_offer: authoredSceneChoiceEffects.c4_audit,
  c4_leak: authoredSceneChoiceEffects.c4_public,
  c4_vote: authoredSceneChoiceEffects.c4_verdict,
  c5_map: authoredSceneChoiceEffects.c5_pattern,
  c5_blame: authoredSceneChoiceEffects.c5_voice,
  c5_collapse: authoredSceneChoiceEffects.c5_verdict,
  f_archive: authoredSceneChoiceEffects.f_witness,
  f_confront: authoredSceneChoiceEffects.f_dilemma,
});

const authoredSceneChoiceCopy = {
  accounting: { voice: ["보호받아야 할 사람의 이름부터 기록하겠습니다.", "원본과 증언을 함께 남기고 다음 판단으로 가겠습니다.", "확인 전 결론은 보류하고 접근 범위를 줄이겠습니다."], echo: ["보호를 먼저 적으면 이후 기록의 책임선이 달라집니다.", "원본을 남기는 선택은 늦어도 되돌릴 수 있습니다.", "보류는 중립이 아니라 접근을 제한하는 결정입니다."] },
  payday: { voice: ["지급 약속을 공개하고 당사자와 함께 검증하겠습니다.", "현금 흐름과 사람의 손실을 같은 표에 올리겠습니다.", "불만을 숫자로 지우지 않고 협상 조건으로 남기겠습니다."], echo: ["급여표는 돈의 표이면서 신뢰의 기록입니다.", "숫자와 사람을 나누면 다음 장면에서 비용이 돌아옵니다.", "조건을 적어야 약속이 나중에 증언이 됩니다."] },
  competitor: { voice: ["경쟁사의 요구를 공개 조건으로 바꾸겠습니다.", "속도보다 누가 무엇을 책임지는지 먼저 묻겠습니다.", "거래의 빈칸마다 되돌릴 조건을 붙이겠습니다."], echo: ["경쟁은 속도를 주지만 책임의 주체를 흐릴 수 있습니다.", "빠른 제안일수록 출처와 책임선을 함께 기록해야 합니다.", "빈칸을 남기면 다음 협상자가 그 비용을 떠안습니다."] },
  board: { voice: ["결론보다 피해를 받는 사람에게 먼저 설명하겠습니다.", "근거와 책임자를 같은 문서에 공개하겠습니다.", "오늘의 합의가 내일의 규칙이 되는지 확인하겠습니다."], echo: ["결론은 설명될 때 비로소 조직의 기록이 됩니다.", "근거 없는 책임은 다음 사건의 희생양을 만듭니다.", "이번 합의에는 다음 사람이 따라야 할 규칙이 남습니다."] },
  c2_logs: { voice: ["공백 전후의 원본 로그를 보존하겠습니다.", "계정의 움직임과 사람의 진술을 대조하겠습니다.", "오류 처리를 서두르지 않고 복구 순서를 공개하겠습니다."], echo: ["짧은 공백도 복원 순서가 없으면 의혹으로 남습니다.", "로그는 행동을 보여주지만 의도까지 대신 말하지는 않습니다.", "복구 순서가 공개돼야 수정이 은폐로 보이지 않습니다."] },
  c2_meeting: { voice: ["지목된 사람에게 먼저 반박할 권한을 주겠습니다.", "증언과 기록을 서로 검증하는 절차를 만들겠습니다.", "보고서 밖의 사람도 확인 가능한 문장을 남기겠습니다."], echo: ["보호는 침묵시키는 일이 아니라 말할 조건을 만드는 일입니다.", "증언은 기록과 경쟁하지 않고 기록의 빈틈을 드러냅니다.", "보고서 밖의 목소리가 다음 판단의 기준이 될 수 있습니다."] },
  c2_pressure: { voice: ["보고 마감보다 사실의 순서를 먼저 고정하겠습니다.", "익명 증언의 위험과 필요를 함께 공개하겠습니다.", "누가 책임을 미뤘는지보다 어떤 장치가 허용했는지 보겠습니다."], echo: ["마감은 중요하지만 잘못 고정된 순서는 더 오래 남습니다.", "익명성은 약점이 아니라 말할 수 있게 하는 비용입니다.", "개인을 지목해도 같은 구조가 반복되면 해결되지 않습니다."] },
  c3_split: { voice: ["고객의 목적과 비용 절감의 목적을 분리해 묻겠습니다.", "경쟁사의 책임 조항을 문장 단위로 확인하겠습니다.", "공동 발표라면 실패했을 때의 책임도 함께 쓰겠습니다."], echo: ["같은 자료가 다른 목적을 섬길 때 기준을 먼저 세워야 합니다.", "책임 조항의 작은 문장이 결론의 방향을 바꿉니다.", "공동 책임은 좋은 말이 아니라 실패 시 작동해야 합니다."] },
  c3_score: { voice: ["신호를 경보로 단정하기 전에 출처를 확인하겠습니다.", "발표를 잠시 멈추고 고객에게 보이는 사실을 묻겠습니다.", "빠른 승리보다 검증 가능한 조건을 선택하겠습니다."], echo: ["신호는 결론이 아니라 확인할 질문을 만듭니다.", "고객이 본 장면은 내부 점수표보다 먼저 검증돼야 합니다.", "승리의 조건을 적어야 다음 경쟁에서도 기준이 남습니다."] },
  c3_trap: { voice: ["경보의 주기와 출처를 모두 공개하겠습니다.", "불확실성을 숨기지 않고 발표의 전제로 삼겠습니다.", "결론을 밀기 전에 보안 담당자의 확인을 받겠습니다."], echo: ["반복되는 신호일수록 출처를 확인해야 패턴이 됩니다.", "불확실성을 공개하면 오히려 검증의 범위가 선명해집니다.", "보안 확인은 속도를 늦추지만 잘못된 확신을 막습니다."] },
  c3_verdict: { voice: ["성과와 책임을 같은 발표문에 넣겠습니다.", "검증이 끝난 부분과 남은 부분을 구분하겠습니다.", "공동 결정의 실패 비용도 공동으로 기록하겠습니다."], echo: ["성과만 남은 발표는 다음 판단의 함정이 됩니다.", "검증된 사실과 추정은 문장부터 나눠야 합니다.", "공동 결정에는 공동으로 감당할 비용이 따라옵니다."] },
  c4_offer: { voice: ["예외 조건의 수혜자와 비용 부담자를 함께 적겠습니다.", "작은 비율의 차이가 누구에게 누적되는지 계산하겠습니다.", "서비스를 유지하되 감사 가능한 조건을 붙이겠습니다."], echo: ["작은 비율도 반복되면 조직의 규칙이 됩니다.", "수혜자와 부담자가 다르면 예외는 먼저 공개돼야 합니다.", "서비스의 명분은 감사 가능한 조건을 가질 때 지켜집니다."] },
  c4_leak: { voice: ["공개 가능한 사실과 아직 모르는 사실을 나누겠습니다.", "기자의 문장보다 피해 복구의 순서를 먼저 확정하겠습니다.", "보안 결함의 범위와 책임을 함께 설명하겠습니다."], echo: ["모르는 것을 함께 적는 것이 공개의 첫 조건입니다.", "기사의 속도보다 복구 순서가 피해자에게 직접 닿습니다.", "결함을 설명하지 않으면 책임의 방향도 왜곡됩니다."] },
  c4_vote: { voice: ["감사 결과를 보상 기준과 함께 공개하겠습니다.", "좋은 결과가 규칙 위반을 지우지 못하게 하겠습니다.", "예외를 허용한 결정권자의 근거를 남기겠습니다."], echo: ["보상 기준이 공개되면 결과 뒤의 규칙도 보입니다.", "좋은 결과는 규칙을 면제하는 증거가 아닙니다.", "결정권자의 근거가 없으면 예외는 다시 반복됩니다."] },
  c5_map: { voice: ["실패가 모이는 경로부터 다시 그리겠습니다.", "한 사람의 과실과 시스템의 빈틈을 분리하겠습니다.", "피해가 반복된 지점을 개선 예산에 올리겠습니다."], echo: ["실패의 경로를 그리면 비난보다 개입 지점이 보입니다.", "개인의 과실만 남기면 시스템의 빈틈은 계속 작동합니다.", "개선 예산은 피해가 반복된 곳에 먼저 닿아야 합니다."] },
  c5_blame: { voice: ["말할 수 없었던 사람의 조건부터 복구하겠습니다.", "책임 발표 전에 결정권과 정보 흐름을 공개하겠습니다.", "보상과 조사 일정을 한 번에 약속하겠습니다."], echo: ["침묵의 조건을 고치지 않으면 같은 증언은 다시 사라집니다.", "책임은 결정권과 정보 접근이 확인될 때 구체화됩니다.", "보상과 조사는 서로를 미루는 핑계가 되어서는 안 됩니다."] },
  c5_collapse: { voice: ["사과문보다 피해 복구의 첫 행동을 정하겠습니다.", "책임자의 이름과 개선 기한을 함께 기록하겠습니다.", "다음 실패를 막는 장치를 지금 결정하겠습니다."], echo: ["사과는 첫 행동이 기록될 때 책임으로 이어집니다.", "이름만 남은 책임은 기한이 없으면 다시 흐려집니다.", "다음 실패를 막는 장치가 없으면 결말은 반복됩니다."] },
  f_archive: { voice: ["이전 참가자의 선택과 조건을 원본 그대로 열겠습니다.", "복제된 문장과 실제 결과를 나란히 비교하겠습니다.", "실험을 멈출 조건을 먼저 기록하겠습니다."], echo: ["이전 기록은 정답지가 아니라 다음 판단의 조건입니다.", "문장이 복제되면 결과가 누구의 것인지 다시 물어야 합니다.", "멈출 조건이 없으면 실험은 책임을 외주화합니다."] },
  f_confront: { voice: ["관찰된 선택을 숨기지 않고 당사자에게 돌려주겠습니다.", "종료 권한과 감시 규칙을 함께 공개하겠습니다.", "다음 참가자가 바꿀 수 있는 빈칸을 남기겠습니다."], echo: ["관찰은 공개될 때 조작이 아니라 기록이 될 수 있습니다.", "종료 권한 없는 실험은 참가자의 동의로 끝나지 않습니다.", "빈칸을 남기는 일은 다음 판단자에게 책임을 넘기는 방식입니다."] },
};

Object.assign(authoredSceneChoiceCopy, {
  c1_witness: authoredSceneChoiceCopy.accounting,
  c1_assembly: authoredSceneChoiceCopy.payday,
  c1_bargain: authoredSceneChoiceCopy.competitor,
  c1_verdict: authoredSceneChoiceCopy.board,
  c2_trace: authoredSceneChoiceCopy.c2_logs,
  c2_witness: authoredSceneChoiceCopy.c2_meeting,
  c2_judgment: authoredSceneChoiceCopy.c2_pressure,
  c3_rival: authoredSceneChoiceCopy.c3_split,
  c3_signal: authoredSceneChoiceCopy.c3_score,
  c3_verdict: authoredSceneChoiceCopy.c3_trap,
  c4_audit: authoredSceneChoiceCopy.c4_offer,
  c4_public: authoredSceneChoiceCopy.c4_leak,
  c4_verdict: authoredSceneChoiceCopy.c4_vote,
  c5_pattern: authoredSceneChoiceCopy.c5_map,
  c5_voice: authoredSceneChoiceCopy.c5_blame,
  c5_verdict: authoredSceneChoiceCopy.c5_collapse,
  f_witness: authoredSceneChoiceCopy.f_archive,
  f_dilemma: authoredSceneChoiceCopy.f_confront,
});

function getAuthoredSceneEffects(sourceId, id) {
  const effects = authoredSceneChoiceEffects[sourceId];
  if (!effects) {
    throw new Error(`Missing authored choice effects for generated scene source: ${sourceId} (${id})`);
  }
  return effects;
}

function getAuthoredSceneCopy(sourceId, id) {
  const copy = authoredSceneChoiceCopy[sourceId];
  if (!copy) {
    throw new Error(`Missing authored choice copy for generated scene source: ${sourceId} (${id})`);
  }
  return id.endsWith("_reaction") ? copy.reaction ?? copy : copy;
}

function addConnectiveScene([id, sourceId, nextId, title, speaker, text, memo, labels]) {
  const source = nodes[sourceId];
  if (!source) return;
  const effects = getAuthoredSceneEffects(sourceId, id);
  const copy = getAuthoredSceneCopy(sourceId, id);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    phase: "CONNECTIVE SCENE",
    title,
    speaker,
    text,
    memo,
    triggers: source.triggers,
    choices: labels.map((label, index) => {
      const choice = {
        id: `${id}_choice_${index + 1}`,
        label,
        effect: effects[index],
        next: nextId,
        cognition: index === 0 ? { persistence: 1 } : index === 1 ? { inference: 1 } : { risk: 1 },
      };
      choiceVoiceLines[choice.id] = copy.voice[index];
      echoReplies[choice.id] = copy.echo[index];
      return choice;
    }),
  };
}

connectiveScenes.forEach(addConnectiveScene);

const connectiveOrders = {
  case01: [["accounting", "c1_witness"], ["payday", "c1_assembly"], ["competitor", "c1_bargain"], ["board", "c1_verdict"]],
  case02: [["c2_logs", "c2_trace"], ["c2_meeting", "c2_witness"], ["c2_pressure", "c2_judgment"]],
  case03: [["c3_split", "c3_rival"], ["c3_score", "c3_signal"], ["c3_trap", "c3_verdict"]],
  case04: [["c4_offer", "c4_audit"], ["c4_leak", "c4_public"], ["c4_vote", "c4_verdict"]],
  case05: [["c5_map", "c5_pattern"], ["c5_blame", "c5_voice"], ["c5_collapse", "c5_verdict"]],
  final: [["f_archive", "f_witness"], ["f_confront", "f_dilemma"]],
};

Object.entries(connectiveOrders).forEach(([caseId, pairs]) => {
  pairs.forEach(([sourceId, bridgeId]) => {
    const order = nodeOrders[caseId];
    const index = order.indexOf(sourceId);
    if (index >= 0) order.splice(index + 1, 0, bridgeId);
  });
});

const reactionScenes = [
  ["c1_witness_reaction", "c1_witness", "payday", "증언 뒤의 침묵", "한서윤", "증언이 시작되자 회계팀 전체가 말을 멈췄습니다. 누구를 보호하느냐에 따라 내일의 보고서가 완전히 달라집니다.", ["증언자를 보호하고 팀 전체에 기준을 설명한다", "증언을 문서로만 남기고 회의를 끝낸다", "CFO에게 먼저 반응할 기회를 준다"]],
  ["c1_assembly_reaction", "c1_assembly", "competitor", "급여일의 첫 문자", "에코", "첫 급여가 입금되기 전, 직원 단체방에 서로 다른 소문이 올라왔습니다. 정정할수록 더 많은 질문이 생깁니다.", ["사실과 아직 모르는 것을 함께 알린다", "입금 확인 뒤에 한 번에 공지한다", "소문을 만든 사람을 먼저 찾는다"]],
  ["c1_bargain_reaction", "c1_bargain", "board", "협상장의 빈 의자", "도윤하", "협상 상대가 자리에 오지 않았습니다. 그 빈 의자는 인수에서 제외될 사람들의 자리처럼 보입니다.", ["빈 의자의 사람들을 협상에 부른다", "조건표를 먼저 완성해 협상을 이어간다", "상대가 돌아올 때까지 침묵한다"]],
  ["c1_verdict_reaction", "c1_verdict", "final", "결론 전 마지막 질문", "반재욱", "모두가 당신에게 결론을 요구하지만, 반재욱은 마지막으로 묻습니다. 이 결론을 가장 먼저 듣게 될 사람은 누구입니까.", ["가장 큰 피해를 받는 사람에게 먼저 설명한다", "투자자에게 근거부터 제출한다", "회의록에 책임자만 남긴다"]],
  ["c2_trace_reaction", "c2_trace", "c2_meeting", "11초 뒤의 접속", "에코", "빈틈을 재현하자 다른 계정이 깨어났습니다. 오류를 고치면 진실도 함께 사라질 수 있습니다.", ["기록을 보존한 채 접근을 막는다", "계정을 따라가 원인을 확인한다", "전체 시스템을 초기화한다"]],
  ["c2_witness_reaction", "c2_witness", "c2_pressure", "보호받은 사람의 말", "반재욱", "이민서는 처음으로 자신이 보호받는 것이 두렵다고 말합니다. 보호는 때로 의심받을 기회를 빼앗습니다.", ["이민서가 직접 말할 수 있는 절차를 만든다", "대신 진술해 위험을 줄인다", "보호를 해제하고 조사에 맡긴다"]],
  ["c2_judgment_reaction", "c2_judgment", "c2_final", "익명성의 가격", "도윤하", "익명 증언을 붙이면 진실은 커지지만, 누구도 그 책임을 지지 않습니다. 보고서의 문장 하나가 사람들의 이름을 바꿀 수 있습니다.", ["익명성을 지키며 증언의 한계를 쓴다", "실명을 확인한 뒤 보고한다", "증언을 빼고 기록만 제출한다"]],
  ["c3_rival_reaction", "c3_rival", "c3_score", "경쟁자의 제안", "오진우", "오진우는 자신의 안을 훔쳐도 좋다고 말합니다. 대신 당신이 그 안을 어떻게 바꾸는지 보고 싶다고 합니다.", ["공동 검증 조건을 제안한다", "자료 출처를 따져 협상을 멈춘다", "상대의 안을 이용해 먼저 제출한다"]],
  ["c3_signal_reaction", "c3_signal", "c3_trap", "두 번 깜빡인 불", "한서윤", "신호가 다시 깜빡였습니다. 이번에는 고객 대표도 보았습니다. 하지만 누구도 먼저 그 의미를 말하지 않습니다.", ["모두 앞에서 신호의 의미를 질문한다", "발표를 계속하며 신호를 기록한다", "신호를 무시하고 점수부터 확보한다"]],
  ["c3_verdict_reaction", "c3_verdict", "c3_final", "승부 뒤의 책임표", "에코", "누가 이겼는지는 이미 결정됐지만 책임표는 비어 있습니다. 성공한 뒤의 실패를 누가 설명할지 정해야 합니다.", ["책임표를 공동으로 작성한다", "내 이름을 가장 위에 적는다", "성과가 난 뒤에 책임을 논의한다"]],
  ["c4_audit_reaction", "c4_audit", "c4_leak", "3%를 본 사람들", "도윤하", "이용자 대표들이 각자의 3%를 말하기 시작했습니다. 숫자를 맞추는 일은 쉬웠지만, 누구의 3%를 먼저 볼지는 어려웠습니다.", ["가장 취약한 이용자부터 기준을 세운다", "전체 평균을 기준으로 삼는다", "심사관의 기준만 따른다"]],
  ["c4_public_reaction", "c4_public", "c4_vote", "기사의 제목", "반재욱", "기자는 세 문장 중 하나만 쓸 수 있다고 합니다. 어떤 문장을 고르느냐에 따라 선의는 개혁이 되거나 은폐가 됩니다.", ["모르는 부분까지 포함한 문장을 고른다", "서비스가 유지된다는 결과를 강조한다", "논란을 만들 표현을 모두 뺀다"]],
  ["c4_verdict_reaction", "c4_verdict", "c4_final", "감사실의 문", "에코", "감사실 문 앞에 서자 내부 자료를 넘긴 사람이 나타났습니다. 그는 규칙을 지킨 사람이 가장 큰 피해를 보았다고 말합니다.", ["자료를 공개하고 규칙을 다시 쓴다", "제보자를 보호한 뒤 내부에서 해결한다", "문을 닫고 심사 결과를 기다린다"]],
  ["c5_pattern_reaction", "c5_pattern", "c5_blame", "화살표를 거꾸로", "에코", "지도를 뒤집자 피해자에게 책임 화살표가 향했습니다. 누군가 만든 분류 방식이 실패를 더 오래 유지하고 있었습니다.", ["분류 방식을 폐기하고 다시 듣는다", "가장 큰 승인자만 조사한다", "기존 지도를 유지한 채 보완한다"]],
  ["c5_voice_reaction", "c5_voice", "c5_collapse", "말할 수 있는 조건", "한서윤", "증언자는 말할 준비가 됐지만, 팀을 떠나야만 안전합니다. 진실을 얻는 대신 조직을 잃을 수 있습니다.", ["떠나지 않아도 말할 수 있게 보호한다", "증언 뒤에 즉시 조직을 바꾼다", "조직을 지키기 위해 증언을 보류한다"]],
  ["c5_verdict_reaction", "c5_verdict", "c5_final", "책임의 다음 날", "도윤하", "책임을 발표한 다음 날에도 피해는 그대로였습니다. 누군가를 지목한 말보다, 무엇을 되돌릴지가 더 급해졌습니다.", ["피해 복구를 발표의 첫 문장으로 둔다", "책임자의 사과를 먼저 받는다", "개선 계획이 완성될 때까지 침묵한다"]],
  ["f_witness_reaction", "f_witness", "f_confront", "첫 참가자의 선택", "반재욱", "첫 참가자는 자신의 기록을 돌려달라고 요청합니다. 하지만 기록을 돌려주면 지금까지의 실험 전체가 흔들립니다.", ["기록을 돌려주고 실험을 다시 설명한다", "기록을 증거로 보관하고 동의를 요청한다", "기록을 삭제해 피해를 끝낸다"]],
  ["f_dilemma_reaction", "f_dilemma", "f_choice", "종료 버튼 앞에서", "에코", "종료 버튼 위에는 당신의 이름이 표시되어 있습니다. 누르는 순간 실험은 끝나지만, 책임도 당신에게 남습니다.", ["참가자들과 함께 종료 조건을 정한다", "내가 혼자 버튼을 누른다", "버튼을 숨기고 시스템을 지켜본다"]],
];

const authoredReactionMemos = {
  c1_witness_reaction: ["보호 약속이 실제 기록으로 남았는지", "다음 급여표에 반영될 책임"],
  c1_assembly_reaction: ["질문이 사라진 급여 공지", "익명 의견을 보호할 창구"],
  c1_bargain_reaction: ["협상장에 들어오지 못한 사람", "조건을 승인할 이름"],
  c1_verdict_reaction: ["결론보다 먼저 확인할 피해", "다음 의사록에 남길 질문"],
  c2_trace_reaction: ["복원된 11초의 앞뒤 기록", "접근 권한을 다시 열 조건"],
  c2_witness_reaction: ["보호와 침묵을 구분하는 절차", "당사자가 고를 수 있는 공개 범위"],
  c2_judgment_reaction: ["익명 증언의 검증 경로", "보고서 밖 목소리를 보존할 위치"],
  c3_rival_reaction: ["경쟁안이 숨긴 책임 조항", "공동 검증을 시작할 증거"],
  c3_signal_reaction: ["두 번 깜빡인 신호의 출처", "발표를 멈춘 비용의 책임"],
  c3_verdict_reaction: ["승리 후 비어 있는 책임표", "공동 발표가 남길 약속"],
  c4_audit_reaction: ["이용자마다 다른 3%의 의미", "기준을 바꿀 때 공개할 산식"],
  c4_public_reaction: ["기사 제목에서 빠질 사실", "서비스 유지와 피해 복구의 순서"],
  c4_verdict_reaction: ["규칙을 지킨 사람의 손실", "제보 자료를 다시 쓸 권한"],
  c5_pattern_reaction: ["책임 화살표가 향한 방향", "분류 밖에서 다시 들을 목소리"],
  c5_voice_reaction: ["증언을 가능하게 할 안전 조건", "조직을 떠나지 않고 말할 권리"],
  c5_verdict_reaction: ["발표 뒤에도 남은 피해", "복구 순서를 정할 사람"],
  f_witness_reaction: ["이전 참가자가 돌려받을 기록", "동의 없이 복제된 문장"],
  f_dilemma_reaction: ["종료 버튼을 누를 권한", "참가자들과 합의할 종료 조건"],
};

function addReactionScene([id, sourceId, nextId, title, speaker, text, labels]) {
  const source = nodes[sourceId];
  if (!source) return;
  const effects = getAuthoredSceneEffects(sourceId, id);
  const copy = getAuthoredSceneCopy(sourceId, id);
  source.choices.forEach((choice) => { choice.next = id; });
  nodes[id] = {
    phase: "REACTION",
    title,
    speaker,
    text,
    memo: authoredReactionMemos[id] ?? ["다음 선택에 남은 비용", "다음 장면에서 다시 확인할 말"],
    triggers: source.triggers,
    choices: labels.map((label, index) => {
      const choice = {
        id: `${id}_choice_${index + 1}`,
        label,
        effect: effects[index],
        next: nextId,
        cognition: index === 0 ? { reframing: 1 } : index === 1 ? { inference: 1 } : { risk: 1 },
      };
      choiceVoiceLines[choice.id] = copy.voice[index];
      echoReplies[choice.id] = copy.echo[index];
      return choice;
    }),
  };
}

reactionScenes.forEach(addReactionScene);

reactionScenes.forEach(([id, sourceId]) => {
  Object.entries(nodeOrders).forEach(([, order]) => {
    const index = order.indexOf(sourceId);
    if (index >= 0) order.splice(index + 1, 0, id);
  });
});

// Each case has one authored detour. The second scene always rejoins the existing route.
const authoredBranchScenes = {
  c1_branch_people: {
    phase: "BRANCH DETOUR",
    title: "누가 빈칸을 채우는가",
    speaker: "도윤하",
    text: "협상서의 빈칸을 사람의 이름으로 채우려는 순간, 숫자로 미뤄 둔 책임이 모두 드러났습니다.",
    memo: ["협력사 지급 보장", "남겨질 직원의 고용 기간", "인수 이후 책임 주체"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c1_branch_people_a", label: "남겨질 사람부터 협상서에 적는다", effect: { trust: 7, capital: -6, fatigue: 3 }, next: "c1_branch_people_follow", cognition: { reframing: 2 } },
      { id: "c1_branch_people_b", label: "협력사 지급일을 먼저 고정한다", effect: { legitimacy: 5, time: -5, trust: 2 }, next: "c1_branch_people_follow", cognition: { inference: 1 } },
      { id: "c1_branch_people_c", label: "인수 조건만 남기고 서명한다", effect: { capital: 8, trust: -7, fatigue: 4 }, next: "c1_branch_people_follow", cognition: { risk: 2 } },
    ],
  },
  c1_branch_people_follow: {
    phase: "BRANCH DETOUR",
    title: "서명 뒤의 첫 전화",
    speaker: "에코",
    text: "서명은 끝났지만 첫 전화는 계약서에 없는 사람에게서 왔습니다. 이제 빈칸은 비용이 아니라 약속의 형태가 됩니다.",
    memo: ["계약서 밖의 이해관계자", "첫 지급 이후의 책임", "약속을 검증할 기록"],
    triggers: ["trust", "responsibility"],
    choices: [
      { id: "c1_branch_people_follow_a", label: "약속을 공개 기록으로 남긴다", effect: { legitimacy: 6, time: -4, fatigue: 2 }, next: "board", cognition: { inference: 1 } },
      { id: "c1_branch_people_follow_b", label: "전화한 사람의 조건을 반영한다", effect: { trust: 5, capital: -4, humanCost: -2 }, next: "board", cognition: { reframing: 1 } },
      { id: "c1_branch_people_follow_c", label: "계약서만이 기준이라고 답한다", effect: { capital: 4, trust: -6, legitimacy: -2 }, next: "board", cognition: { risk: 1 } },
    ],
  },
  c2_branch_records: {
    phase: "BRANCH DETOUR",
    title: "11초를 누구의 시간으로 볼 것인가",
    speaker: "반재현",
    text: "기록 사이의 11초를 기술 오류로 닫을지, 누군가의 판단이 들어간 시간으로 열어둘지 선택해야 합니다.",
    memo: ["원본 로그의 공백", "접속 계정의 순서", "삭제 요청의 승인자"],
    triggers: ["curiosity", "trust"],
    choices: [
      { id: "c2_branch_records_a", label: "원본과 백업을 동시에 보존한다", effect: { legitimacy: 7, time: -6, fatigue: 3 }, next: "c2_branch_records_follow", cognition: { inference: 2 } },
      { id: "c2_branch_records_b", label: "접속자의 진술부터 확보한다", effect: { trust: 6, time: -5, legitimacy: 2 }, next: "c2_branch_records_follow", cognition: { persistence: 1 } },
      { id: "c2_branch_records_c", label: "오류로 표시하고 보고를 진행한다", effect: { time: 5, legitimacy: -7, fatigue: 2 }, next: "c2_branch_records_follow", cognition: { risk: 2 } },
    ],
  },
  c2_branch_records_follow: {
    phase: "BRANCH DETOUR",
    title: "복원된 기록의 주인",
    speaker: "한서윤",
    text: "복원된 기록에는 이름보다 먼저 책임을 미룬 순서가 남아 있습니다. 누가 말할 수 있게 할지도 기록의 일부입니다.",
    memo: ["복원 시각", "진술 순서", "보고서에 남길 원문"],
    triggers: ["injustice", "responsibility"],
    choices: [
      { id: "c2_branch_records_follow_a", label: "진술자에게 원문 확인 권한을 준다", effect: { trust: 6, legitimacy: 3, fatigue: 4 }, next: "c2_final", cognition: { reframing: 1 } },
      { id: "c2_branch_records_follow_b", label: "원문을 첨부해 외부 검증을 연다", effect: { legitimacy: 8, capital: -5, time: -4 }, next: "c2_final", cognition: { inference: 2 } },
      { id: "c2_branch_records_follow_c", label: "보고서의 결론만 남긴다", effect: { time: 4, trust: -6, legitimacy: -4 }, next: "c2_final", cognition: { risk: 1 } },
    ],
  },
  c3_branch_signal: {
    phase: "BRANCH DETOUR",
    title: "관객석의 신호를 멈춰 읽기",
    speaker: "에코",
    text: "발표 화면의 신호는 경쟁사의 방해일 수도, 고객이 보내는 마지막 확인 요청일 수도 있습니다.",
    memo: ["신호가 켜진 시각", "고객 계정의 반응", "발표 중단 비용"],
    triggers: ["competition", "curiosity"],
    choices: [
      { id: "c3_branch_signal_a", label: "신호를 공개 질문으로 전환한다", effect: { trust: 6, legitimacy: 5, time: -5 }, next: "c3_branch_signal_follow", cognition: { reframing: 2 } },
      { id: "c3_branch_signal_b", label: "발표를 멈추고 출처를 확인한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "c3_branch_signal_follow", cognition: { inference: 2 } },
      { id: "c3_branch_signal_c", label: "신호를 무시하고 승부를 끝낸다", effect: { capital: 8, trust: -6, fatigue: 3 }, next: "c3_branch_signal_follow", cognition: { risk: 2 } },
    ],
  },
  c3_branch_signal_follow: {
    phase: "BRANCH DETOUR",
    title: "빠른 승리의 조건표",
    speaker: "오진우",
    text: "결과가 좋아도 조건표에 빈칸이 남으면 다음 경쟁은 그 빈칸부터 시작됩니다.",
    memo: ["승리 발표의 수혜자", "검증되지 않은 보안 항목", "다음 계약의 조건"],
    triggers: ["competition", "order"],
    choices: [
      { id: "c3_branch_signal_follow_a", label: "승리 조건에 검증 기한을 붙인다", effect: { legitimacy: 7, time: -5, fatigue: 2 }, next: "c3_final", cognition: { persistence: 1 } },
      { id: "c3_branch_signal_follow_b", label: "공동 책임자를 발표한다", effect: { trust: 7, capital: -4, legitimacy: 3 }, next: "c3_final", cognition: { reframing: 1 } },
      { id: "c3_branch_signal_follow_c", label: "성과 수치만 먼저 확정한다", effect: { capital: 7, trust: -7, legitimacy: -3 }, next: "c3_final", cognition: { risk: 1 } },
    ],
  },
  c4_branch_exception: {
    phase: "BRANCH DETOUR",
    title: "예외의 사용자를 확인하다",
    speaker: "반재현",
    text: "예외 승인은 선의를 증명하지 않습니다. 누구에게 반복될 수 있는지가 이 결정의 핵심입니다.",
    memo: ["예외 승인자", "서비스 이용자 수", "재사용 가능한 조건"],
    triggers: ["order", "injustice"],
    choices: [
      { id: "c4_branch_exception_a", label: "예외 조건을 누구나 읽게 공개한다", effect: { legitimacy: 8, trust: 3, time: -6 }, next: "c4_branch_exception_follow", cognition: { inference: 1 } },
      { id: "c4_branch_exception_b", label: "피해 이용자에게 먼저 보상한다", effect: { humanCost: -5, capital: -7, trust: 6 }, next: "c4_branch_exception_follow", cognition: { reframing: 1 } },
      { id: "c4_branch_exception_c", label: "이번 사례만 조용히 승인한다", effect: { time: 5, legitimacy: -8, fatigue: 3 }, next: "c4_branch_exception_follow", cognition: { risk: 2 } },
    ],
  },
  c4_branch_exception_follow: {
    phase: "BRANCH DETOUR",
    title: "좋은 결과 뒤의 감사",
    speaker: "윤서",
    text: "서비스는 멈추지 않았지만 감사 기록은 남았습니다. 다음 사람에게 같은 예외를 허용할 기준이 필요합니다.",
    memo: ["감사 요청의 범위", "예외 승인 기록", "보상 기준의 공개 여부"],
    triggers: ["responsibility", "recognition"],
    choices: [
      { id: "c4_branch_exception_follow_a", label: "감사 결과와 보상 기준을 함께 공개한다", effect: { legitimacy: 7, trust: 5, time: -5 }, next: "c4_final", cognition: { inference: 1 } },
      { id: "c4_branch_exception_follow_b", label: "감사 범위를 이용자 대표와 정한다", effect: { trust: 7, capital: -4, fatigue: 4 }, next: "c4_final", cognition: { reframing: 2 } },
      { id: "c4_branch_exception_follow_c", label: "좋은 결과를 근거로 감사를 닫는다", effect: { capital: 5, legitimacy: -6, fatigue: 2 }, next: "c4_final", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner: {
    phase: "BRANCH DETOUR",
    title: "실패의 주어를 고르다",
    speaker: "윤서",
    text: "실패에는 사람이 보이지만, 시스템은 여러 번의 작은 양보로 만들어졌습니다.",
    memo: ["결정권자의 승인", "누락된 안전장치", "피해를 되돌릴 순서"],
    triggers: ["responsibility", "helplessness"],
    choices: [
      { id: "c5_branch_owner_a", label: "내 승인부터 공개한다", effect: { legitimacy: 7, trust: 4, humanCost: -3 }, next: "c5_branch_owner_follow", cognition: { persistence: 1 } },
      { id: "c5_branch_owner_b", label: "누락된 안전장치를 복구한다", effect: { capital: -6, legitimacy: 6, fatigue: 5 }, next: "c5_branch_owner_follow", cognition: { reframing: 2 } },
      { id: "c5_branch_owner_c", label: "실패를 한 사람의 책임으로 닫는다", effect: { time: 4, trust: -8, humanCost: 6 }, next: "c5_branch_owner_follow", cognition: { risk: 1 } },
    ],
  },
  c5_branch_owner_follow: {
    phase: "BRANCH DETOUR",
    title: "복구 이후에도 남는 이름",
    speaker: "에코",
    text: "복구가 시작되면 책임의 이름은 사라지지 않습니다. 다만 그 이름이 다음 피해를 막는 장치가 될 수 있습니다.",
    memo: ["복구된 사람", "재발 방지 소유자", "공개할 책임 범위"],
    triggers: ["protection", "responsibility"],
    choices: [
      { id: "c5_branch_owner_follow_a", label: "복구 대상과 책임자를 함께 기록한다", effect: { trust: 6, legitimacy: 6, fatigue: 4 }, next: "c5_final", cognition: { inference: 1 } },
      { id: "c5_branch_owner_follow_b", label: "재발 방지 장치에 예산을 고정한다", effect: { capital: -8, legitimacy: 7, humanCost: -2 }, next: "c5_final", cognition: { persistence: 2 } },
      { id: "c5_branch_owner_follow_c", label: "사과문만 발표하고 종료한다", effect: { time: 5, trust: -6, legitimacy: -4 }, next: "c5_final", cognition: { risk: 1 } },
    ],
  },
  f_branch_witness: {
    phase: "BRANCH DETOUR",
    title: "이전 기록의 빈칸",
    speaker: "한서윤",
    text: "이전 참가자의 기록은 당신의 선택과 닮았지만, 마지막 한 줄만 비어 있습니다. 그 빈칸이 실험의 목적일 수 있습니다.",
    memo: ["이전 참가자의 선택", "삭제된 마지막 문장", "기록을 읽는 권한"],
    triggers: ["selfAwareness", "curiosity"],
    choices: [
      { id: "f_branch_witness_a", label: "빈칸을 참가자들에게 공개한다", effect: { legitimacy: 8, trust: 5, time: -6 }, next: "f_branch_witness_follow", cognition: { inference: 2 } },
      { id: "f_branch_witness_b", label: "삭제 흔적부터 복원한다", effect: { time: -8, capital: -3, legitimacy: 6 }, next: "f_branch_witness_follow", cognition: { persistence: 1 } },
      { id: "f_branch_witness_c", label: "기록의 결론만 믿고 넘어간다", effect: { time: 5, trust: -7, fatigue: 3 }, next: "f_branch_witness_follow", cognition: { risk: 2 } },
    ],
  },
  f_branch_witness_follow: {
    phase: "BRANCH DETOUR",
    title: "에코의 마지막 질문",
    speaker: "에코",
    text: "기록을 읽는 사람도 기록의 일부가 됩니다. 당신의 조건을 누가 다시 읽게 될지 정해야 합니다.",
    memo: ["열람자의 범위", "재현 가능한 선택", "종료 조건"],
    triggers: ["selfAwareness", "choice"],
    choices: [
      { id: "f_branch_witness_follow_a", label: "모든 참가자에게 열람 권한을 준다", effect: { legitimacy: 7, trust: 6, time: -5 }, next: "f_choice", cognition: { reframing: 1 } },
      { id: "f_branch_witness_follow_b", label: "독립 검토자에게 먼저 맡긴다", effect: { trust: 4, capital: -5, legitimacy: 8 }, next: "f_choice", cognition: { inference: 2 } },
      { id: "f_branch_witness_follow_c", label: "내 기록만 보관하고 문을 닫는다", effect: { time: 4, trust: -6, legitimacy: -5 }, next: "f_choice", cognition: { risk: 1 } },
    ],
  },
};

const authoredBranchPlans = [
  ["case01", "competitor", 0, "c1_branch_people", "c1_branch_people_follow"],
  ["case02", "c2_meeting", 0, "c2_branch_records", "c2_branch_records_follow"],
  ["case03", "c3_score", 0, "c3_branch_signal", "c3_branch_signal_follow"],
  ["case04", "c4_leak", 0, "c4_branch_exception", "c4_branch_exception_follow"],
  ["case05", "c5_blame", 0, "c5_branch_owner", "c5_branch_owner_follow"],
  ["final", "f_confront", 0, "f_branch_witness", "f_branch_witness_follow"],
];

authoredBranchPlans.forEach(([caseId, sourceId, choiceIndex, firstId, secondId]) => {
  const source = nodes[sourceId];
  if (!source || !authoredBranchScenes[firstId] || !authoredBranchScenes[secondId]) return;
  source.choices[choiceIndex] = { ...source.choices[choiceIndex], next: firstId, branchId: firstId };
  nodes[firstId] = authoredBranchScenes[firstId];
  nodes[secondId] = authoredBranchScenes[secondId];
  const order = nodeOrders[caseId];
  const sourceOrderIndex = order.indexOf(sourceId);
  if (sourceOrderIndex >= 0) order.splice(sourceOrderIndex + 1, 0, firstId, secondId);
});

export const caseOpeningRoutes = {
  case02: {
    c1_after_people: "c2_start_people",
    c1_after_numbers: "c2_start_records",
    c1_after_silence: "c2_start_silence",
  },
  case03: {
    c2_after_audit: "c3_start_audit",
    c2_after_person: "c3_start_person",
    c2_after_public: "c3_start_public",
  },
  case04: {
    c3_after_share: "c4_start_joint",
    c3_after_proof: "c4_start_proof",
    c3_after_win: "c4_start_win",
  },
  case05: {
    c4_after_rule: "c5_start_rule",
    c4_after_service: "c5_start_service",
    c4_after_stop: "c5_start_stop",
  },
  final: {
    c5_after_owner: "f_start_owner",
    c5_after_system: "f_start_system",
    c5_after_name: "f_start_name",
  },
};

const branchOpeningCopy = {
  c2_start_people: ["보호받은 사람의 다음 사건", "도윤하", "이민서가 유출자로 지목됐습니다. 하지만 당신은 지난 사건에서 사람의 목소리를 먼저 남겼습니다. 이번에는 그 목소리가 기록보다 먼저 당신을 찾아옵니다.", ["익명 증언 요청이 이미 들어옴", "이민서는 당신에게 직접 연락함", "보안팀은 보호 조치를 문제 삼음"]],
  c2_start_records: ["공개된 숫자의 다음 사건", "반재욱", "지난 사건에서 현금 흐름을 공개한 뒤, 누군가가 그 공개 자료를 이용해 내부 기록을 조작했습니다. 이번에는 숫자를 믿는 방식 자체가 시험됩니다.", ["공개 자료의 복사본이 세 개 존재", "유출 파일에 공개 수치가 포함됨", "기록 관리자는 책임을 부인함"]],
  c2_start_silence: ["침묵의 청구서", "한서윤", "지난 사건에서 공개를 늦춘 대가는 조용히 쌓였습니다. 이번 사건의 유출 파일에는 당신이 말하지 않았던 조건까지 담겨 있습니다.", ["유출 파일에 비공개 회의 문장 포함", "이민서가 가장 먼저 의심받음", "외부 기업은 이미 다음 행동을 준비함"]],
  c3_start_audit: ["복원된 기록의 경쟁", "반재욱", "기록을 복원한 당신에게 이번에는 더 빠른 결론이 요구됩니다. 오진우는 원본보다 먼저 읽기 쉬운 답을 만들어 놓았습니다.", ["감사 기록은 완전하지 않음", "입찰 마감까지 4시간", "고객은 근거보다 확신을 원함"]],
  c3_start_person: ["사람을 믿은 뒤의 경쟁", "도윤하", "이민서를 보호한 결정은 다음 사건의 비용이 됐습니다. 오진우는 그 선택을 약점이라고 부르며 더 빠른 해답을 제시합니다.", ["고객은 속도 보상을 약속함", "이민서의 증언이 일부 공개됨", "경쟁안은 보호 비용을 삭제함"]],
  c3_start_public: ["경보가 된 경쟁", "에코", "유출 가능성을 외부에 알린 뒤 모든 시선이 당신에게 모였습니다. 이번 입찰은 해결안이 아니라 경보를 누가 통제하는지에 대한 싸움입니다.", ["고객은 공개 해명을 요구함", "오진우는 침묵을 전략으로 삼음", "보안 결함 제보가 추가됨"]],
  c4_start_joint: ["공동안의 대가", "오진우", "경쟁을 공동 작업으로 바꾼 당신에게 새로운 유혹이 왔습니다. 좋은 결과를 위해 규칙을 함께 넓히자는 제안입니다.", ["공동안의 책임 주체가 흐림", "심사 기준까지 3% 부족", "파트너들은 예외를 원함"]],
  c4_start_proof: ["증거 뒤에 남은 사람들", "반재욱", "보안 결함을 공개한 뒤 당신은 정직한 사람으로 불렸습니다. 그러나 그 정직함 때문에 서비스를 잃을 사람들이 생겼습니다.", ["서비스 이용자 4,200명 영향", "보조금 기준까지 3% 부족", "공개 자료가 심사대에 올라감"]],
  c4_start_win: ["승리의 계산법", "한서윤", "경쟁에서 이긴 기록은 다음 사건의 기준이 됐습니다. 이제는 결과가 좋다면 작은 규칙 위반을 허용할 수 있는지 묻습니다.", ["심사관이 성공 사례를 요구함", "산식의 빈틈이 발견됨", "누군가는 같은 성공을 재현하려 함"]],
  c5_start_rule: ["새 기준의 실패", "도윤하", "예외를 공개 조건으로 묶은 뒤, 모두가 그 기준을 지키려 했습니다. 그런데 시스템 전체가 동시에 멈추기 시작했습니다.", ["새 기준이 현장에 너무 느림", "피해 보고가 늦게 들어옴", "책임자는 규칙을 탓함"]],
  c5_start_service: ["지켜낸 서비스의 그림자", "반재욱", "서비스를 지킨 예외가 반복되면서 누구도 같은 기준을 믿지 못하게 됐습니다. 실패는 규칙보다 먼저 사람에게 도착했습니다.", ["예외를 요구하는 기관이 늘어남", "감사 요청서가 도착함", "현장 직원이 내부 기록을 보관함"]],
  c5_start_stop: ["멈춘 뒤의 공백", "에코", "서비스를 멈추고 감사를 택한 결정은 기준을 지켰습니다. 하지만 멈춘 시간 동안 조용한 피해자가 생겼습니다.", ["피해 복구 비용이 증가함", "감사 자료는 완전하지 않음", "누군가는 중단을 승인한 사람을 찾음"]],
  f_start_owner: ["책임을 맡은 사람의 실험", "도윤하", "당신이 자신의 이름을 보고서에 올린 뒤 트리거랩은 더 직접적인 질문을 준비했습니다. 책임감은 누구에게 이용될 수 있는가.", ["당신의 책임 문장이 복제됨", "다음 참가자에게 같은 질문이 전송됨", "실험 설계자는 책임을 칭찬함"]],
  f_start_system: ["고쳐진 구조의 실험", "에코", "반복을 막는 구조를 만든 뒤에도 실험은 계속됐습니다. 이번에는 시스템을 바꾸는 사람이 새로운 관찰자가 됩니다.", ["새 규칙이 참가자에게 적용됨", "감시 기록이 공개되지 않음", "동의 절차에 빈틈이 남음"]],
  f_start_name: ["이름을 남긴 뒤", "반재욱", "한 사람을 책임자로 세운 뒤 사건은 빨리 닫혔습니다. 이제 트리거랩은 당신에게 그 이름을 이용해 더 큰 통제를 제안합니다.", ["책임자의 기록이 다음 테스트에 사용됨", "피해자는 여전히 회복되지 않음", "실험의 종료 권한이 당신에게 옴"]],
};

Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  const baseNodeId = caseId === "case02" ? "c2_start" : caseId === "case03" ? "c3_start" : caseId === "case04" ? "c4_start" : caseId === "case05" ? "c5_start" : "f_start";
  Object.values(routes).forEach((nodeId) => {
    const [title, speaker, text, memo] = branchOpeningCopy[nodeId];
    nodes[nodeId] = {
      ...nodes[baseNodeId],
      phase: "BRANCH BRIEFING",
      title,
      speaker,
      text,
      memo,
      choices: nodes[baseNodeId].choices.map((choice) => ({ ...choice })),
    };
  });
  nodeOrders[caseId].unshift(...Object.values(routes));
});

function getPlayableRoute(caseId) {
  const route = [];
  const seen = new Set();
  let nodeId = CASE_START_NODES[caseId];
  while (nodeId && !seen.has(nodeId) && !RESULT_NODE_IDS.has(nodeId)) {
    seen.add(nodeId);
    route.push(nodeId);
    nodeId = nodes[nodeId]?.choices?.[0]?.next;
  }
  return route;
}

/**
 * The one authored mid-case fork per case, with the scenes each side leads to.
 * Derived from the graph so adding a branch needs no second list.
 */
export function getCaseBranchNodes() {
  return CASE_SEQUENCE.map((caseId) => {
    const nodeId = [...new Set(nodeOrders[caseId])].find((id) => {
      const scene = nodes[id];
      if (!scene) return false;
      return new Set(scene.choices.map((choice) => choice.next)).size > 1;
    });
    if (!nodeId) return null;
    return { caseId, nodeId, nextIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.next))] };
  }).filter(Boolean);
}

export function getCaseRouteLength(caseId) {
  return getPlayableRoute(caseId).length;
}

export function getNodeRouteIndex(caseId, nodeId) {
  const branchStartIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
  if (branchStartIds.has(nodeId)) return 0;
  return getPlayableRoute(caseId).indexOf(nodeId);
}
