import { CASE_SEQUENCE } from "./gameCases.js";



export function getOperatorReveal({ origin = "courier", completedCases = [] } = {}) {
  const count = completedCases.length;
  if (count < 2) return { level: 0, title: "OPERATOR FILE / SEALED", text: "주인공의 과거 권한은 아직 봉인되어 있습니다." };
  if (count < 4) return { level: 1, title: "OPERATOR FILE / PARTIAL", text: `${origin} 출신 기록관이 단순 관찰자가 아니라 기준을 설계한 인물이었다는 흔적이 남습니다.` };
  return { level: 2, title: "OPERATOR FILE / OPENED", text: "당신은 사건을 처리하는 사람인 동시에, 어떤 사건을 기록할지 정해온 설계자였습니다." };
}

/**
 * What the season left behind, months after the last night.
 *
 * `getEndingVariant` resolves nine endings and four of them had an epilogue, so
 * five seasons closed on the same fallback sentence -- the run's last words were
 * the one line that knew nothing about the run. Each one now follows the same
 * shape: the season's own places and people first, the analyst second, the door
 * the next participant walks through last.
 */
export function getEndingEpilogue(endingId = "open-question") {
  const epilogues = {
    "open-oversight":
      "반년 뒤, 플로우온 야간조의 급여 규정과 온새의 예외 승인 절차는 같은 공개 기준을 인용합니다. 트리거랩은 해체되지 않았지만 감사위원 자리 하나가 외부에 열렸고, 첫 회의 자료의 맨 앞 장은 당신이 쓴 문장입니다. 다음 분석관은 실험이 아니라 규칙을 물려받습니다.",
    "evidence-reform":
      "보호 명부와 감사 로그가 하나의 절차로 묶였습니다. 이민서는 자기 기록의 열람 권한을 가진 첫 번째 직원이 됐고, 돌봄 배차의 가중치표에는 '조용한 이용자' 항목이 새로 생겼습니다. 다음 사건은 이제 공개된 예외가 아니라 아직 숨어 있는 예외에서 시작됩니다.",
    "human-record":
      "당신이 선택지 밖에 써넣은 문장들이 그대로 보관소에 남았습니다. 현장 사람들은 그 기록을 읽고 자기 이름을 되찾는 작업을 이어가고, 플로우온에서 잘린 야간조 열여덟 명 중 아홉 명이 자기 사건 파일을 열람했습니다. 다음 참가자의 첫 단서는 정답이 아니라 당신의 문장입니다.",
    "profitable-silence":
      "장부는 살아남았습니다. 플로우온은 인수되지 않았고 온새의 서비스도 끊기지 않았지만, 어느 회의실에서도 같은 질문이 다시 나오지 않습니다. 트리거랩의 다음 참가자는 당신의 로그를 '가장 효율적인 침묵'이라는 이름의 표본으로 받습니다.",
    "cold-justice":
      "절차는 한 줄도 어긋나지 않았습니다. 보고서는 모두 통과했고 감사도 깨끗했지만, 이민서는 복직 대신 사직을 택했고 야간조 대기실에는 당신 이름을 기억하는 사람이 없습니다. 다음 분석관은 완벽한 규정집과 아무도 말을 걸지 않는 자리를 함께 물려받습니다.",
    "field-pact":
      "공식 승인보다 현장의 약속이 먼저 움직였습니다. 협력사 대표들과 돌봄 배차 현장 담당자들이 당신의 연락처를 공유하고 있고, 그 관계망은 잠긴 기록 몇 개를 여는 열쇠가 됐습니다. 다만 그 열쇠는 문서가 아니라 사람에게 있어서, 당신이 사라지면 함께 사라집니다.",
    "quiet-cover":
      "위험 곡선은 끝까지 평평했습니다. 무너진 것도 드러난 것도 없고, '인사평가_보조지표' 폴더는 다시 잠겼습니다. 다음 플레이의 첫 단서는 당신이 열지 않은 문 뒤에 그대로 있습니다.",
    collapse:
      "일곱 사건 중 셋이 정상화되지 못한 채 닫혔습니다. 남은 것은 기록뿐이고 그 기록에도 서명한 사람이 없습니다. 다만 붕괴한 시스템의 잔해 속에서 다음 분석관에게만 보이는 복구 키 하나가 켜져 있습니다.",
  };
  return (
    epilogues[endingId] ||
    "당신이 닫지 못한 질문은 폴더에 그대로 남았습니다. 다음 분석관은 답이 아니라 그 질문에서 사건을 시작합니다."
  );
}

export function getAchievementProgress({ log = [], completedCases = [], caseResults = {} } = {}) {
  // The two season-shaped goals read the sequence, so a new case cannot leave a
  // badge that says 6/6 while the season has seven cases in it.
  return [
    { id: "people-first", label: "PEOPLE FIRST", value: log.filter((entry) => /protect|people|witness|person/.test(entry.choiceId ?? "")).length, goal: 3 },
    { id: "full-audit", label: "FULL AUDIT", value: Object.keys(caseResults).length, goal: CASE_SEQUENCE.length },
    { id: "route-keeper", label: "ROUTE KEEPER", value: completedCases.length, goal: CASE_SEQUENCE.length - 1 },
  ].map((item) => ({ ...item, unlocked: item.value >= item.goal }));
}

export function getFailureRecovery(ending = {}, resources = {}) {
  if (!ending.failure) return null;
  const key = Number(resources.fatigue ?? 0) > 30 ? "fatigue" : Number(resources.trust ?? 50) < 35 ? "trust" : "timing";
  return { key, title: "RECOVERY ROUTE AVAILABLE", text: key === "fatigue" ? "다음 실행에서 조사 횟수를 줄이면 숨겨진 선택지가 열립니다." : key === "trust" ? "다음 실행에서 증언 보호를 먼저 선택하면 라이벌 개입이 늦춰집니다." : "다음 실행에서 첫 공개를 한 박자 늦추면 다른 엔딩 조건을 확인할 수 있습니다." };
}

export function getOperationsSnapshot({ errors = [], pending = [], rankings = [], caseResults = {} } = {}) {
  return { errorCount: errors.length, pendingCount: pending.length, rankingCount: rankings.length, completedCount: Object.keys(caseResults).length, state: errors.length ? "ACTION REQUIRED" : pending.length ? "QUEUE ACTIVE" : "HEALTHY" };
}
