const operatorProfiles = {
  courier: {
    id: "courier",
    label: "BRANCH DESK",
    title: "지점 창구 출신 분석관",
    authority: "현장 기록을 가장 먼저 보고, 고객에게 사실을 직접 전달할 권한",
    premise: "창구에서 판 대출이 어떻게 끝나는지를 끝까지 본 사람이 몇 없었습니다. 당신이 그중 하나입니다.",
    permissions: ["현장 기록 열람", "당사자 인터뷰", "긴급 전달 요청"],
  },
  lab: {
    id: "lab",
    label: "CREDIT REVIEW",
    title: "기업대출심사팀 출신 분석관",
    authority: "심사 기준과 검증 절차를 조정할 권한",
    premise: "승인 서류에 반대 의견을 한 줄 쓴 대가로 이 지하 분석실에 배치됐습니다.",
    permissions: ["심사 기록 열람", "검증 기준 제안", "보호 명부 요청"],
  },
  public: {
    id: "public",
    label: "PUBLIC AUDITOR",
    title: "금융감독 출신 파견 분석관",
    authority: "기록의 공개 범위와 피해 보호 순서를 조정할 권한",
    premise: "감독기관에서 이 그룹을 검사하다가, 그룹 안으로 자리를 옮겨 같은 기록을 다시 봅니다.",
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


const endingScenes = {
  "open-oversight": { location: "OBSERVATORY / OPEN FLOOR", image: "/ending-oversight-room.webp", cue: "여러 개의 기록 창이 동시에 열립니다.", choice: "모든 참가자에게 기준 편집 권한을 넘긴다" },
  "evidence-reform": { location: "TRIGGER LAB / PUBLIC AUDIT", image: "/ending-final-archive.webp", cue: "감사 화면과 보호 명부가 한 화면에 겹칩니다.", choice: "공개와 보호를 함께 운영 규칙으로 고정한다" },
  "human-record": { location: "FIELD OFFICE / WITNESS ROOM", image: "/scene-case05.webp", cue: "당신의 문장이 증언자의 목소리와 겹쳐 재생됩니다.", choice: "다음 분석관에게 사람의 이름부터 전달한다" },
  "profitable-silence": { location: "BOARDROOM / SEALED WINDOW", image: "/scene-case04.webp", cue: "박수 소리 뒤에서 기록 잠금음이 들립니다.", choice: "수익 보고서에 침묵의 비용을 추가한다" },
  "cold-justice": { location: "POLICY ROOM / EMPTY CHAIR", image: "/scene-case03.webp", cue: "완벽한 절차표 옆에 비어 있는 의자가 남습니다.", choice: "절차에 관계 회복 단계를 추가한다" },
  "field-pact": { location: "DELIVERY HUB / NIGHT SHIFT", image: "/scene-case01.webp", cue: "공식 승인 전 현장 라디오가 먼저 응답합니다.", choice: "현장 협약을 공식 권한으로 승격한다" },
  "quiet-cover": { location: "ARCHIVE / LOW LIGHT", image: "/scene-case02.webp", cue: "압박계는 낮지만 잠긴 폴더가 더 많아집니다.", choice: "안전한 기록 하나를 열어 다음 단서로 삼는다" },
  collapse: { location: "SYSTEM CORE / REDLINE", image: "/ending-system-collapse.webp", cue: "경보와 사람들의 호출이 한꺼번에 끊깁니다.", choice: "다음 플레이에서 압박을 분산할 기준을 남긴다" },
  "open-question": { location: "TRANSFER HALL / NEXT SHIFT", image: "/ending-final-archive.webp", cue: "다음 분석관의 출입증이 천천히 켜집니다.", choice: "답 대신 가장 위험한 질문을 인계한다" },
};

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
  const tone = entry.prematureHypothesis ? "warning" : entry.streakReward ? "signal" : effectCount >= 3 ? "tradeoff" : "signal";
  return {
    tone,
    label: entry.prematureHypothesis?.label ?? entry.streakReward?.label ?? (tone === "tradeoff" ? "TRADEOFF REGISTERED" : "SIGNAL REGISTERED"),
    text: entry.prematureHypothesis?.text ?? entry.streakReward?.text ?? "이 선택은 다음 장면의 관계와 자원에 누적됩니다.",
  };
}

export function getEndingVisualClass(endingId = "open-question") {
  return `ending-visual-${String(endingId).replace(/[^a-z0-9-]/gi, "-")}`;
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

export function getPastRunMemory(memory = {}) {
  const entries = Object.entries(memory ?? {}).filter(([, value]) => value?.outcomeChoiceId);
  if (entries.length === 0) return null;
  const [caseId, result] = entries.at(-1);
  return { caseId, choice: result.outcomeChoiceId, label: "PAST RUN MEMORY", text: `이전 기록에서 ${caseId}의 ${result.outcomeChoiceId} 선택을 남겼습니다. 이번에는 그 결과를 바꿀 수 있습니다.` };
}

export function getOriginPrologue(origin = "courier") {
  const profiles = {
    courier: { title: "창구 마감이 늦어진 밤", text: "당신은 창구에서 직접 판 대출이 어떻게 끝나는지를 끝까지 본 사람입니다. 그 기억이 첫 번째 권한을 열었습니다." },
    lab: { title: "반대 의견을 쓴 밤", text: "당신은 승인 서류에 혼자 반대 의견을 썼고, 다음 인사에서 이 지하로 내려왔습니다. 3년이 지나 같은 번호의 파일이 책상에 올라옵니다." },
    public: { title: "검사 자료를 덮은 밤", text: "당신은 감독기관에서 이 그룹을 검사하다 안쪽으로 자리를 옮겼습니다. 공개 권한은 크지만, 보호해야 할 사람도 함께 늘어납니다." },
  };
  return profiles[origin] ?? profiles.courier;
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

export function getOriginStartEffects(origin = "courier") {
  return {
    courier: { capital: 4, trust: 4, legitimacy: 0, fatigue: 0 },
    lab: { capital: 0, trust: 1, legitimacy: 5, fatigue: 2 },
    public: { capital: -2, trust: 0, legitimacy: 8, fatigue: 3 },
  }[origin] ?? { capital: 0, trust: 0, legitimacy: 0, fatigue: 0 };
}

export function getAuthorityReview(origin = {}, level = "OBSERVER", result = {}) {
  return {
    title: `${origin.title ?? "분석관"} / AUTHORITY REVIEW`,
    text: level === "OVERSIGHT"
      ? "당신은 기록을 읽는 사람에서 종료 조건을 제안하는 사람으로 이동했습니다. 이제 권한의 결과도 책임져야 합니다."
      : `현재 권한은 ${level}입니다. ${result.challengeClearCount ?? 0}개의 검증 신호와 관계 기록이 다음 심사의 근거가 됩니다.`,
    next: level === "OBSERVER" ? "증거와 관계자 신뢰를 확보하십시오." : level === "FIELD ACCESS" ? "정당성과 보호 비용을 함께 관리하십시오." : "공개 이후의 피해 복구까지 설계하십시오.",
  };
}


export function getRankingLeague(style = "FIELD DECIDER") {
  if (style.includes("RISK")) return "RISK LEAGUE";
  if (style.includes("BOARD")) return "REFRAME LEAGUE";
  if (style.includes("SYSTEM")) return "SYSTEM LEAGUE";
  return "FIELD LEAGUE";
}

export function getOriginEndingVariant(origin = "courier", endingId = "open-question") {
  const labels = { courier: "현장 기록의 계승", lab: "심사 기준의 계승", public: "공개 책임의 계승" };
  return { label: labels[origin] ?? labels.courier, text: `${labels[origin] ?? labels.courier} 경로에서 ${endingId}의 결과가 다르게 읽힙니다.` };
}

export function getAftermath(endingId = "open-question", origin = "courier") {
  return { title: "AFTERMATH / NEXT SHIFT", text: `${origin} 출신 분석관의 선택 이후, ${endingId} 경로는 다음 근무자의 질문과 현장의 대응으로 이어집니다.` };
}

export function getRankingIntegrity(entry = {}) {
  const summary = entry.summary ?? {};
  return { valid: Boolean(entry.runId && entry.completedAt && summary.rank), label: entry.runId ? "RUN VERIFIED" : "RUN ID MISSING", text: entry.runId ? "독립 런으로 집계된 기록입니다." : "런 식별자가 없어 임시 로컬 기록으로 처리됩니다." };
}

export function getReplayDiagnostics({ runId = "", caseId = "", nodeId = "", choiceId = "", pending = 0 } = {}) {
  return { runId, scene: `${caseId}/${nodeId}`, choiceId, pending, text: `${caseId}/${nodeId}에서 ${choiceId || "선택 없음"} 처리 후 대기 큐 ${pending}건` };
}
