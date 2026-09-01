const chapterUi = {
  case01: { label: "FIELD DISPATCH", title: "배송망 생존 현황", accent: "#d9ff62", metrics: ["배송 지연", "지급 우선순위", "보호 대상"] },
  case02: { label: "TRIGGER LAB", title: "실험 기록 검증", accent: "#8bd3c7", metrics: ["원본 보존", "진술 신뢰", "타임스탬프"] },
  case03: { label: "COMPETITIVE ARENA", title: "점수판 뒤의 의도", accent: "#ffb36b", metrics: ["승률", "검증 기한", "공동 책임"] },
  case04: { label: "POLICY ROOM", title: "예외 승인 감사", accent: "#f28f8f", metrics: ["예외 수", "보상 기준", "공개 범위"] },
  case05: { label: "FAILURE ARCHIVE", title: "책임 공백 추적", accent: "#c5b7ff", metrics: ["책임자", "복구율", "재발 방지"] },
  final: { label: "OBSERVER CORE", title: "당신의 기록을 판독", accent: "#e9f5b4", metrics: ["자기 인식", "개입 권한", "다음 기록"] },
};

const relationshipQuests = {
  "한서윤": { title: "서윤의 지급 명부", goal: "보호 대상의 이름을 지우지 않고 다음 기록으로 넘기기", reward: "human-record", threshold: 24 },
  "반재욱": { title: "재욱의 원본 봉투", goal: "원본과 진술의 충돌을 함께 검증하기", reward: "evidence-reform", threshold: 24 },
  "도윤하": { title: "윤하의 빈 자리", goal: "성과표에서 빠진 사람의 몫을 복원하기", reward: "field-pact", threshold: 24 },
  "오진우": { title: "진우의 마지막 점수", goal: "승리보다 검증 기한을 먼저 확보하기", reward: "cold-justice", threshold: 24 },
  "에코": { title: "에코의 금지된 질문", goal: "AI의 계산을 그대로 믿지 않고 질문의 주인을 찾기", reward: "open-oversight", threshold: 24 },
};

const endingScenes = {
  "open-oversight": { location: "OBSERVATORY / OPEN FLOOR", image: "/ending-final-archive.png", cue: "여러 개의 기록 창이 동시에 열립니다.", choice: "모든 참가자에게 기준 편집 권한을 넘긴다" },
  "evidence-reform": { location: "TRIGGER LAB / PUBLIC AUDIT", image: "/ending-final-archive.png", cue: "감사 화면과 보호 명부가 한 화면에 겹칩니다.", choice: "공개와 보호를 함께 운영 규칙으로 고정한다" },
  "human-record": { location: "FIELD OFFICE / WITNESS ROOM", image: "/ending-final-archive.png", cue: "당신의 문장이 증언자의 목소리와 겹쳐 재생됩니다.", choice: "다음 분석관에게 사람의 이름부터 전달한다" },
  "profitable-silence": { location: "BOARDROOM / SEALED WINDOW", image: "/ending-final-archive.png", cue: "박수 소리 뒤에서 기록 잠금음이 들립니다.", choice: "수익 보고서에 침묵의 비용을 추가한다" },
  "cold-justice": { location: "POLICY ROOM / EMPTY CHAIR", image: "/ending-final-archive.png", cue: "완벽한 절차표 옆에 비어 있는 의자가 남습니다.", choice: "절차에 관계 회복 단계를 추가한다" },
  "field-pact": { location: "DELIVERY HUB / NIGHT SHIFT", image: "/ending-final-archive.png", cue: "공식 승인 전 현장 라디오가 먼저 응답합니다.", choice: "현장 협약을 공식 권한으로 승격한다" },
  "quiet-cover": { location: "ARCHIVE / LOW LIGHT", image: "/ending-final-archive.png", cue: "압박계는 낮지만 잠긴 폴더가 더 많아집니다.", choice: "안전한 기록 하나를 열어 다음 단서로 삼는다" },
  collapse: { location: "SYSTEM CORE / REDLINE", image: "/ending-final-archive.png", cue: "경보와 사람들의 호출이 한꺼번에 끊깁니다.", choice: "다음 플레이에서 압박을 분산할 기준을 남긴다" },
  "open-question": { location: "TRANSFER HALL / NEXT SHIFT", image: "/ending-final-archive.png", cue: "다음 분석관의 출입증이 천천히 켜집니다.", choice: "답 대신 가장 위험한 질문을 인계한다" },
};

export function getChapterUiModel(caseId = "case01") {
  return chapterUi[caseId] ?? chapterUi.case01;
}

export function getRelationshipQuest(speaker = "", score = 0) {
  const quest = relationshipQuests[speaker];
  if (!quest) return null;
  return { ...quest, speaker, progress: Math.min(100, Math.round((score / quest.threshold) * 100)), unlocked: score >= quest.threshold };
}

export function getEndingSceneProfile(endingId = "open-question") {
  return endingScenes[endingId] ?? endingScenes["open-question"];
}

export function getDelayedConsequences(log = [], caseResults = {}) {
  return Object.entries(caseResults)
    .filter(([, result]) => result?.outcomeChoiceId)
    .map(([caseId, result]) => ({
      caseId,
      source: result.outcomeChoiceId,
      visible: log.some((entry) => entry?.caseId !== caseId && entry?.continuitySource === result.outcomeChoiceId),
      text: `CASE ${caseId.replace("case", "")}의 ${result.outcomeChoiceId} 선택이 다음 사건의 기준으로 남아 있습니다.`,
    }));
}

export function getPlayStyleUnlocks(playStyle = "instinct", newGamePlus = false) {
  const styles = {
    instinct: { label: "INSTINCT ROUTE", unlock: "빠른 판단으로 압박을 돌파하는 선택지" },
    auditor: { label: "AUDIT ROUTE", unlock: "증거를 모아 위험 범위를 좁히는 선택지" },
    relational: { label: "RELATION ROUTE", unlock: "관계 퀘스트와 증언 분기" },
    reformer: { label: "REFORM ROUTE", unlock: "시스템 재설계와 정책 엔딩" },
  };
  const base = styles[playStyle] ?? styles.instinct;
  return { ...base, newGamePlus: newGamePlus ? "과거 플레이 기록을 참조하는 숨은 선택지" : "최종 기록을 완료하면 NEW GAME+ 해금" };
}

export function getFailureObjectives(variant = {}) {
  if (!variant.failure) return [];
  return ["위험 압력을 60 이하로 유지", "인간 비용 50 이하로 종료", "단서 3개 이상 확보"];
}

export function getTutorialSteps() {
  return [
    { id: "read", label: "장면 읽기", text: "상황, 화자, 이번 장면의 한계를 확인합니다." },
    { id: "weigh", label: "대가 비교", text: "선택지의 자원 변화와 관계 영향을 비교합니다." },
    { id: "commit", label: "기록 확정", text: "선택을 확정하면 다음 장면과 랭킹에 남습니다." },
    { id: "replay", label: "다시 보기", text: "다른 기록은 다른 권한과 엔딩을 엽니다." },
  ];
}

export function getRankingComparison(summary = {}) {
  return [
    { label: "EVIDENCE", value: Math.min(100, (summary.challengeClearCount ?? 0) * 20) },
    { label: "PEOPLE", value: Math.min(100, Math.max(0, 100 - (summary.exploitPenalty ?? 0) * 8)) },
    { label: "RHYTHM", value: Math.min(100, summary.rhythmScore ?? 0) },
  ];
}
