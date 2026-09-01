const chapterUi = {
  case01: { label: "FIELD DISPATCH", title: "배송망 생존 현황", accent: "#d9ff62", metrics: ["배송 지연", "지급 우선순위", "보호 대상"] },
  case02: { label: "TRIGGER LAB", title: "실험 기록 검증", accent: "#8bd3c7", metrics: ["원본 보존", "진술 신뢰", "타임스탬프"] },
  case03: { label: "COMPETITIVE ARENA", title: "점수판 뒤의 의도", accent: "#ffb36b", metrics: ["승률", "검증 기한", "공동 책임"] },
  case04: { label: "POLICY ROOM", title: "예외 승인 감사", accent: "#f28f8f", metrics: ["예외 수", "보상 기준", "공개 범위"] },
  case05: { label: "FAILURE ARCHIVE", title: "책임 공백 추적", accent: "#c5b7ff", metrics: ["책임자", "복구율", "재발 방지"] },
  final: { label: "OBSERVER CORE", title: "당신의 기록을 판독", accent: "#e9f5b4", metrics: ["자기 인식", "개입 권한", "다음 기록"] },
};

const operatorProfiles = {
  courier: {
    id: "courier",
    label: "FIELD COURIER",
    title: "현장 배송망 출신 분석관",
    authority: "현장 기록을 가장 먼저 보고, 사람에게 사실을 전달할 권한",
    premise: "배송 지연과 파손 기록에서 시스템의 첫 번째 균열을 발견했습니다.",
    permissions: ["현장 기록 열람", "당사자 인터뷰", "긴급 전달 요청"],
  },
  lab: {
    id: "lab",
    label: "TRIGGER LAB",
    title: "트리거랩 파견 분석관",
    authority: "실험 기준과 검증 절차를 조정할 권한",
    premise: "배송망의 이상 징후를 검증하기 위해 트리거랩이 직접 파견했습니다.",
    permissions: ["실험 로그 열람", "검증 기준 제안", "보호 명부 요청"],
  },
  public: {
    id: "public",
    label: "PUBLIC AUDITOR",
    title: "독립 공익 감사관",
    authority: "기록의 공개 범위와 피해 보호 순서를 조정할 권한",
    premise: "외부 검증 요청을 받아 회사와 실험실 사이의 기록을 대조합니다.",
    permissions: ["공개 범위 제안", "외부 검증 요청", "책임 기록 보존"],
  },
};

export function getOperatorProfiles() {
  return Object.values(operatorProfiles);
}

export function getOperatorProfile(origin = "courier") {
  return operatorProfiles[origin] ?? operatorProfiles.courier;
}

export function getAuthorityProfile(origin = "courier", level = "OBSERVER") {
  const profile = getOperatorProfile(origin);
  const levelPermissions = {
    OBSERVER: ["제한 열람", "질문 요청", "관찰 기록"],
    "FIELD ACCESS": ["기록 대조", "관계자 질문", "기준 제안"],
    OVERSIGHT: ["기록 공개", "현장 개입", "실험 종료"],
  };
  return {
    ...profile,
    level,
    permissions: levelPermissions[level] ?? levelPermissions.OBSERVER,
    originPermissions: profile.permissions,
  };
}

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

endingScenes["open-oversight"].image = "/ending-oversight-room.png";
endingScenes.collapse.image = "/ending-system-collapse.png";

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

export function getEndingPreview(ending = {}) {
  if (!ending?.id) return null;
  const labels = {
    "open-oversight": "공개와 개입",
    "evidence-reform": "증거와 개혁",
    "human-record": "사람과 기록",
    "profitable-silence": "성과와 침묵",
    "cold-justice": "절차와 책임",
    "field-pact": "현장과 협약",
    "quiet-cover": "보호와 은폐",
    collapse: "압박과 붕괴",
    "open-question": "질문과 계승",
  };
  return {
    label: labels[ending.id] ?? "미확정 경로",
    text: ending.failure ? "현재 선택 패턴이 시스템 붕괴 쪽으로 기울고 있습니다." : "현재 선택 패턴이 이 엔딩의 조건을 강화하고 있습니다.",
  };
}

export function getChoiceOutcomeFeedback(entry = {}) {
  if (!entry?.choiceId) return null;
  const effectCount = Object.values(entry.effect ?? {}).filter((value) => value !== 0).length;
  const tone = entry.prematureHypothesis ? "warning" : effectCount >= 3 ? "tradeoff" : "signal";
  return {
    tone,
    label: entry.prematureHypothesis ? entry.prematureHypothesis.label : tone === "tradeoff" ? "TRADEOFF REGISTERED" : "SIGNAL REGISTERED",
    text: entry.prematureHypothesis?.text ?? "이 선택은 다음 장면의 관계와 자원에 누적됩니다.",
  };
}

export function getEndingVisualClass(endingId = "open-question") {
  return `ending-visual-${String(endingId).replace(/[^a-z0-9-]/gi, "-")}`;
}

export function getInterlude(caseId = "case01", previousChoice = "") {
  const interludes = {
    case02: { label: "TRANSFER / 02", title: "배송망의 원본이 트리거랩으로 도착했습니다.", text: "당신은 장소를 바꾼 것이 아니라, 같은 기록을 다른 권한으로 다시 읽게 됩니다." },
    case03: { label: "TRANSFER / 03", title: "감사 로그가 경쟁 점수판으로 변환됩니다.", text: "숫자는 달라졌지만 누가 손실을 감당했는지는 아직 같습니다." },
    case04: { label: "TRANSFER / 04", title: "승리 기록이 정책 예외 문서로 넘어갑니다.", text: "좋은 결과가 규칙 위반을 지워주지는 않습니다." },
    case05: { label: "TRANSFER / 05", title: "예외 문서에서 책임 공백이 발견됩니다.", text: "이제 문제는 누구를 탓할지가 아니라, 다음 실패를 막을 구조입니다." },
    final: { label: "TRANSFER / FINAL", title: "모든 장소의 기록이 관찰자 코어에 모였습니다.", text: `당신이 남긴 ${previousChoice || "이전 선택"}이 이제 당신의 권한을 판독하는 자료가 됩니다.` },
  };
  return interludes[caseId] ?? null;
}

export function getSeasonGoals() {
  return [
    { id: "protect", label: "PROTECT SEASON", text: "인간 비용 45 이하로 시즌 완료" },
    { id: "evidence", label: "EVIDENCE SEASON", text: "숨은 단서 5개 이상 확보" },
    { id: "trust", label: "TRUST SEASON", text: "관계 퀘스트 3개 이상 완료" },
  ];
}

export function getBalanceSignals(log = []) {
  const choices = log.filter((entry) => !entry?.isSystemEvent);
  const counts = choices.reduce((map, entry) => {
    map[entry.choiceId] = (map[entry.choiceId] ?? 0) + 1;
    return map;
  }, {});
  const total = choices.length || 1;
  return Object.entries(counts)
    .filter(([, count]) => count / total >= 0.6)
    .map(([choiceId, count]) => ({ choiceId, share: Math.round((count / total) * 100), count, signal: "CHOICE DOMINANCE" }));
}

export function getHypothesisFeedback(hypothesis, discoveredClues = []) {
  if (!hypothesis) return null;
  const confidence = Number(hypothesis.confidence) || 0;
  const supported = discoveredClues.length >= (confidence >= 80 ? 4 : 2);
  return supported
    ? { tone: "confirmed", label: "HYPOTHESIS SUPPORTED", text: "다음 선택에서 이 가설을 기준으로 위험을 줄일 수 있습니다." }
    : { tone: "unstable", label: "HYPOTHESIS UNSTABLE", text: "증거가 부족합니다. 성급히 공개하면 신뢰와 시간이 함께 줄어듭니다." };
}

export function getRelationshipScene(quest = null, caseId = "case01") {
  if (!quest?.unlocked) return null;
  return {
    title: `${quest.speaker} / PRIVATE CHANNEL`,
    text: `${quest.speaker}가 공식 기록에 남기지 못했던 마지막 조건을 직접 건넵니다. 이 증언은 ${caseId}의 공개 범위를 바꿀 수 있습니다.`,
    action: "증언을 원문 그대로 보존한다",
  };
}

export function getPastRunMemory(memory = {}) {
  const entries = Object.entries(memory ?? {}).filter(([, value]) => value?.outcomeChoiceId);
  if (entries.length === 0) return null;
  const [caseId, result] = entries.at(-1);
  return { caseId, choice: result.outcomeChoiceId, label: "PAST RUN MEMORY", text: `이전 기록에서 ${caseId}의 ${result.outcomeChoiceId} 선택을 남겼습니다. 이번에는 그 결과를 바꿀 수 있습니다.` };
}

export function getOriginPrologue(origin = "courier") {
  const profiles = {
    courier: { title: "첫 번째 배송이 멈춘 밤", text: "당신은 배송 지연표의 작은 오차에서 시작했습니다. 누구도 문제라고 부르지 않은 기록이 첫 번째 권한을 열었습니다." },
    lab: { title: "검증 요청서가 도착한 밤", text: "당신은 트리거랩의 검증 요청을 받고 파견되었습니다. 실험실은 답을 원하지만, 당신은 질문의 출처부터 확인해야 합니다." },
    public: { title: "외부 감사가 시작된 밤", text: "당신은 외부 감사관으로 기록 사이의 공백을 조사합니다. 공개 권한은 크지만, 보호해야 할 사람도 함께 늘어납니다." },
  };
  return profiles[origin] ?? profiles.courier;
}

export function getRelationshipGraph(scores = []) {
  return scores.map((item) => ({
    ...item,
    state: item.value >= 70 ? "ALLIED" : item.value >= 35 ? "NEGOTIATING" : "DISTANT",
  }));
}

export function getEvidenceCombinations(discoveredClues = []) {
  if (discoveredClues.length < 2) return [];
  const pairs = [];
  for (let index = 0; index < discoveredClues.length - 1; index += 2) {
    const first = discoveredClues[index];
    const second = discoveredClues[index + 1];
    pairs.push({
      id: `${first.id ?? index}-${second.id ?? index + 1}`,
      title: "CROSS-REFERENCE FOUND",
      text: `${first.title ?? "기록"} + ${second.title ?? "기록"}이 같은 책임 공백을 가리킵니다. 공개 전에 원본과 증언을 함께 확인할 수 있습니다.`,
    });
  }
  return pairs;
}

export function getHypothesisActions(hypotheses = [], authority = {}) {
  if (hypotheses.length === 0) return [];
  return [
    { id: "hold", label: "가설 보류", text: "증거를 더 모으고 공개 위험을 줄입니다.", effect: { fatigue: 1, legitimacy: 1 } },
    { id: "investigate", label: "추가 조사", text: "관계자 질문으로 가설의 반증을 찾습니다.", effect: { time: -2, trust: 2 } },
    ...(authority.level !== "OBSERVER" ? [{ id: "publish", label: "검증 공개", text: "현재 가설을 공개 검증선에 올립니다.", effect: { legitimacy: 4, trust: -2, fatigue: 3 } }] : []),
  ];
}

export function getFailureCause(variant = {}, resources = {}) {
  if (!variant?.failure) return null;
  const candidates = [
    ["human-cost", resources.humanCost ?? 0, "사람의 비용이 누적되었습니다."],
    ["fatigue", resources.fatigue ?? 0, "판단 피로가 선택의 폭을 좁혔습니다."],
    ["risk", resources.time ?? 0, "시간 압박이 위험한 지름길을 만들었습니다."],
  ];
  const [id, value, text] = candidates.sort((a, b) => b[1] - a[1])[0];
  return { id, value, text, recovery: id === "human-cost" ? "관계 회복을 먼저 선택하십시오." : id === "fatigue" ? "한 장면을 멈추고 기록을 정리하십시오." : "공개 전에 위험 경로를 하나 줄이십시오." };
}

export function getEndingAtmosphere(endingId = "open-question") {
  const atmospheres = {
    "open-oversight": { palette: "lime", motion: "expanding", sound: "wide-harmonics" },
    "evidence-reform": { palette: "mint", motion: "layered", sound: "measured-pulse" },
    "human-record": { palette: "warm", motion: "close-focus", sound: "voice-memory" },
    collapse: { palette: "redline", motion: "fractured", sound: "low-impact" },
  };
  return atmospheres[endingId] ?? { palette: "archive", motion: "slow-pan", sound: "quiet-motif" };
}

export function getPlayReport(summary = {}, log = []) {
  const entries = log.filter((entry) => !entry?.isSystemEvent);
  return {
    decisions: entries.length,
    clues: summary.challengeClearCount ?? 0,
    dominantStyle: summary.freeCount > summary.challengeClearCount ? "BOARD BREAKER" : summary.pressureAdaptScore >= summary.reflectionScore ? "RISK CUTTER" : "SYSTEM THINKER",
    route: entries.map((entry) => entry.choiceId).filter(Boolean).slice(-8),
  };
}

export function getTelemetryDashboardSnapshot({ errors = [], pending = [], rankings = [], caseResults = {} } = {}) {
  return {
    errors: errors.length,
    pending: pending.length,
    runs: new Set(rankings.map((row) => row.run_id).filter(Boolean)).size,
    completed: Object.keys(caseResults).length,
    lastError: errors.at(-1)?.error?.message ?? errors.at(-1)?.error_message ?? "none",
  };
}
