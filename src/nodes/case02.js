/** CASE 02 -- the authored scenes of the records case. */
export const case02Nodes = {
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
        id: "c2_start_report",
        label: "로그 증거를 기준으로 1차 보고한다",
        effect: { time: -2, trust: -10, legitimacy: 7, fatigue: 2 },
        next: "c2_logs",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_start_meet",
        label: "이민서를 비공식적으로 먼저 만난다",
        effect: { time: -8, trust: 8, legitimacy: -6, fatigue: 2 },
        next: "c2_logs",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c2_start_verify",
        label: "시스템 로그 원본을 재검증한다",
        effect: { time: -10, legitimacy: 2, fatigue: 2 },
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
        id: "c2_logs_verify",
        label: "로그 원본과 백업 로그를 대조한다",
        effect: { time: -12, legitimacy: 4, fatigue: 3 },
        next: "c2_meeting",
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "isolate",
        label: "이민서의 접근 권한을 즉시 차단한다",
        effect: { trust: -12, legitimacy: 5, humanCost: 4, fatigue: 2 },
        next: "c2_meeting",
        cognition: { risk: 2 },
      },
      {
        id: "escalate",
        label: "한서윤에게 즉시 공유한다",
        effect: { time: -3, trust: 2, legitimacy: 4, fatigue: 2 },
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
        id: "c2_meeting_meet",
        label: "이민서의 알리바이를 먼저 확인한다",
        effect: { time: -10, trust: 10, legitimacy: -2, fatigue: 2 },
        next: "c2_pressure",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_meeting_report",
        label: "감정 개입을 피하고 공식 절차로 넘긴다",
        effect: { trust: -10, legitimacy: 6, humanCost: 5, fatigue: 2 },
        next: "c2_pressure",
        cognition: { risk: 1 },
      },
      {
        id: "c2_meeting_shadow",
        label: "공식 보고 전 대체 접속 가능성을 추적한다",
        effect: { time: -12, legitimacy: -4, fatigue: 4 },
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
        id: "c2_pressure_report",
        label: "오진우 보고서에 동의하고 사건을 종결한다",
        effect: { time: 4, trust: -14, legitimacy: 5, humanCost: 8, fatigue: 1 },
        next: "c2_final",
        cognition: { risk: 1 },
      },
      {
        id: "c2_pressure_verify",
        label: "30분 안에 반증 가능한 단서 하나만 더 찾는다",
        effect: { time: -10, trust: 4, legitimacy: 1, fatigue: 4 },
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
        effect: { trust: -12, legitimacy: 7, humanCost: 8, fatigue: 2 },
        next: "case02_result",
        cognition: { risk: 2 },
      },
      {
        id: "final_person",
        label: "이민서 보호와 추가 검증 필요성을 보고한다",
        effect: { trust: 10, legitimacy: -4, fatigue: 4 },
        next: "case02_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c2_final_final_system",
        label: "개인 혐의보다 시스템 조작 가능성을 공식화한다",
        effect: { time: -6, trust: 2, legitimacy: 2, fatigue: 4 },
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
