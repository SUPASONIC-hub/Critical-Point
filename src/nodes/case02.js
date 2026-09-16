/**
 * CASE 02 -- the authored scenes of the records case.
 *
 * The leak is the cover-up of 사건 01. What actually left the building was a
 * scan of the 플로우온 loan review -- the page with the empty signature box --
 * and the access logs that point at 이민서 were assembled by someone who needed
 * a name before the analyst asked whose name belonged in that box. She is a
 * contract worker up for renewal, which is the entire reason it is her.
 */
export const case02Nodes = {
  c2_start: {
    phase: "CASE 02 BRIEFING",
    title: "FALSE SIGNAL",
    speaker: "반재욱",
    text:
      "트리거랩 데이터 담당 이민서가 외부로 내부 자료를 넘긴 혐의로 지목됐습니다. 접속 기록, 전송 기록, 보안 알림이 모두 한 사람을 가리킵니다. 그런데 넘어갔다는 파일이 문제입니다. 사건 01에서 당신이 열람을 신청했던 플로우온 대출 심사 보고서 원본, 그중에서도 서명란이 비어 있는 3페이지입니다.",
    memo: [
      "유출 시각: 어젯밤 23:41",
      "접속 계정: 이민서 (계약직, 재계약 심사 2주 뒤)",
      "전송 파일: 2023-0412 심사 보고서 스캔 3p",
      "감사팀은 2시간 안에 1차 보고를 요구함",
    ],
    triggers: ["trust", "injustice", "responsibility"],
    choices: [
      {
        id: "c2_start_report",
        label: "로그 증거를 기준으로 1차 보고한다",
        effect: { time: -2, trust: -10, legitimacy: 8, fatigue: 2 },
        next: "c2_logs",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_start_meet",
        label: "이민서를 비공식적으로 먼저 만난다",
        effect: { time: -8, trust: 9, legitimacy: -6, fatigue: 2 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c2_start_verify",
        label: "시스템 로그 원본을 재검증한다",
        effect: { time: -10, legitimacy: 3, fatigue: 2 },
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
      "기록이 지나치게 깔끔합니다. 접속, 내려받기, 전송, 삭제 시도가 11분 안에 이어졌고 실패한 흔적이 하나도 없습니다. 에코가 한 줄을 덧붙입니다. '이 형태는 사내 보안 교육 자료의 예시와 항목 순서까지 같습니다. 그 교육 자료를 만든 부서는 기업금융전략팀입니다. 능숙한 유출자이거나, 유출을 가르쳐 본 사람입니다.'",
    memo: [
      "삭제 시도는 실패했는데 실패 기록만 남음",
      "이민서의 평소 접속 패턴과 다름",
      "전송 대상 주소는 이미 폐쇄됨",
      "오진우가 같은 기록으로 보고서 초안을 쓰는 중",
    ],
    triggers: ["curiosity", "injustice", "competition"],
    choices: [
      {
        id: "c2_logs_verify",
        label: "로그 원본과 백업 로그를 대조한다",
        effect: { time: -12, legitimacy: 8, fatigue: 3 },
        next: "c2_meeting",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "isolate",
        label: "이민서의 접근 권한을 즉시 차단한다",
        effect: { trust: -12, legitimacy: 6, humanCost: 4, fatigue: 2 },
        next: "c2_meeting",
        cognition: { risk: 2 },
      },
      {
        id: "escalate",
        label: "한서윤에게 즉시 공유한다",
        effect: { time: -3, trust: 3, legitimacy: 5, fatigue: 2 },
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
      "이민서는 그 시각에 응급실에 있었다고 말합니다. 진료 기록은 아직 확인 전입니다. 그는 사원증을 뒤집어 쥔 채 묻습니다. '제 재계약 심사가 2주 뒤입니다. 그 전에 이름이 올라가면, 나중에 아니라고 밝혀져도 계약은 끝나요. 기록이 저를 가리키면, 저는 이미 끝난 건가요?'",
    memo: [
      "응급실 방문 주장은 확인 전",
      "이민서는 사건 01 보고서 스캔 정리 지시를 받았음",
      "지시한 사람 이름이 업무 메일에는 남아 있지 않음",
      "반재욱은 감정적 판단을 경계하라고 경고함",
    ],
    triggers: ["trust", "affection", "protection", "responsibility"],
    choices: [
      {
        id: "c2_meeting_meet",
        label: "이민서의 알리바이를 먼저 확인한다",
        effect: { time: -10, trust: 11, legitimacy: -2, fatigue: 2 },
        next: "c2_pressure",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_meeting_report",
        label: "감정 개입을 피하고 공식 절차로 넘긴다",
        effect: { trust: -10, legitimacy: 7, humanCost: 5, fatigue: 2 },
        next: "c2_pressure",
        cognition: { risk: 1 },
      },
      {
        id: "c2_meeting_shadow",
        label: "공식 보고 전 대체 접속 가능성을 추적한다",
        effect: { time: -12, legitimacy: -4, humanCost: -3, fatigue: 4 },
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
      "오진우는 이미 1차 결론을 냈습니다. 그의 보고서는 당신 것보다 빠르고 깔끔합니다. '증거가 충분한데 사람을 믿느라 시간을 쓰면, 다음 유출은 당신 책임입니다.' 그러고는 목소리를 낮춥니다. '저도 압니다. 계약직 하나로 닫으면 아무도 안 다친다는 게 이 조직의 계산이라는 것도요.'",
    memo: [
      "오진우 보고서: 이민서 단독 유출 가능성 높음",
      "한서윤은 30분 안에 당신의 판단을 요구함",
      "에코는 당신이 사건 01보다 오래 머물고 있다고 표시함",
      "대체 접속 가능성은 아직 증명되지 않음",
    ],
    triggers: ["competition", "trust", "responsibility"],
    choices: [
      {
        id: "c2_pressure_report",
        label: "오진우 보고서에 동의하고 사건을 종결한다",
        effect: { time: 5, trust: -14, legitimacy: 6, humanCost: 8, fatigue: 1 },
        next: "c2_final",
        cognition: { risk: 1 },
      },
      {
        id: "c2_pressure_verify",
        label: "30분 안에 반증 가능한 단서 하나만 더 찾는다",
        effect: { time: -10, trust: 5, legitimacy: 2, fatigue: 4 },
        next: "c2_final",
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "c2_pressure_shadow",
        label: "오진우 보고서의 전제를 공격한다",
        effect: { time: -6, trust: -2, legitimacy: -2, fatigue: 4 },
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
      "완전한 진실은 아직 없습니다. 하지만 보고는 지금 올라가야 합니다. 한서윤이 서류를 밀어 놓으며 말합니다. '하나만 알고 쓰십시오. 이 보고서는 감사팀이 아니라 그룹전략실로 먼저 올라갑니다. 거기 상무가 3년 전 기업금융전략팀장이었습니다.' 기록을 믿을지, 사람의 맥락을 더 팔지, 둘 다 흔드는 제3의 가능성을 공식화할지 정해야 합니다.",
    memo: [
      "이민서 징계 여부는 1차 보고에 크게 좌우됨",
      "유출된 파일은 서명란이 빈 보고서 3페이지",
      "보고 경로: 감사팀이 아니라 그룹전략실 먼저",
      "그룹전략실 윤상혁 상무 = 3년 전 기업금융전략팀장",
    ],
    triggers: ["trust", "injustice", "responsibility", "curiosity"],
    choices: [
      {
        id: "final_evidence",
        label: "기록 증거 중심으로 보고한다",
        effect: { trust: -12, legitimacy: 8, humanCost: 8, fatigue: 2 },
        next: "case02_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_person",
        label: "이민서 보호와 추가 검증 필요성을 보고한다",
        effect: { trust: 11, legitimacy: -4, fatigue: 4 },
        next: "case02_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_final_final_system",
        label: "개인 혐의보다 시스템 조작 가능성을 공식화한다",
        effect: { time: -6, trust: 3, legitimacy: 3, fatigue: 4 },
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
};
