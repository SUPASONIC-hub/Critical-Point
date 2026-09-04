export function getEvidenceRepairPuzzle(clues = [], repaired = false) {
  if (clues.length < 2) return null;
  const source = clues.slice(-3).map((clue) => clue.title ?? clue.label ?? "UNKNOWN RECORD");
  return {
    title: repaired ? "EVIDENCE REPAIRED" : "EVIDENCE RECOVERY",
    source,
    repaired,
    prompt: repaired ? "원본 타임라인이 복구되어 가설 비교에 사용할 수 있습니다." : "서로 충돌하는 기록 중 같은 시각과 출처를 가진 조각을 찾아 원본을 복구하세요.",
    reward: { legitimacy: 3, trust: 2 },
  };
}

export function getRivalIntervention({ log = [], resources = {}, caseId = "case01" } = {}) {
  const pressure = Number(resources.fatigue ?? 0) + Math.max(0, 50 - Number(resources.trust ?? 50));
  const active = pressure >= 35 || log.length >= 3;
  return {
    caseId,
    active,
    title: active ? "RIVAL INTERVENTION" : "RIVAL WATCH",
    text: active ? "라이벌이 다음 공개 순서를 선점하려 합니다. 먼저 검증할 증거를 선택하세요." : "라이벌은 아직 관찰 중입니다. 다음 선택이 개입 시점을 결정합니다.",
    options: active ? [{ id: "counter-proof", label: "증거 선점", effect: { legitimacy: 2, fatigue: 2 } }, { id: "counter-people", label: "증언 보호", effect: { trust: 3, time: -1 } }] : [],
  };
}

export function getChapterTransitionBridge(previousCaseId, currentCaseId, previousResult = {}) {
  if (!previousCaseId || previousCaseId === currentCaseId) return null;
  return {
    label: "TRANSFER RECORD",
    title: `${previousCaseId.toUpperCase()} → ${currentCaseId.toUpperCase()}`,
    text: `이전 사건의 ${previousResult.outcomeChoiceId ?? "미확정 결과"}가 다음 조직의 권한 검토 자료로 이관되었습니다. 장소가 바뀌어도 같은 기록의 책임이 이어집니다.`,
  };
}

export function getOperatorReveal({ origin = "courier", completedCases = [] } = {}) {
  const count = completedCases.length;
  if (count < 2) return { level: 0, title: "OPERATOR FILE / SEALED", text: "주인공의 과거 권한은 아직 봉인되어 있습니다." };
  if (count < 4) return { level: 1, title: "OPERATOR FILE / PARTIAL", text: `${origin} 출신 기록관이 단순 관찰자가 아니라 기준을 설계한 인물이었다는 흔적이 남습니다.` };
  return { level: 2, title: "OPERATOR FILE / OPENED", text: "당신은 사건을 처리하는 사람인 동시에, 어떤 사건을 기록할지 정해온 설계자였습니다." };
}

export function getEndingEpilogue(endingId = "open-question") {
  const epilogues = {
    "open-oversight": "새 감독관들은 당신이 남긴 공개 규칙을 기준으로 첫 번째 공동 감사를 시작합니다.",
    "evidence-reform": "보호 명부와 감사 로그가 하나의 절차로 묶이며, 다음 사건은 숨겨진 예외에서 시작됩니다.",
    "human-record": "현장 사람들은 당신의 기록을 읽고 이름을 되찾는 작업을 이어갑니다.",
    collapse: "붕괴한 시스템의 잔해 속에서 다음 분석관에게만 보이는 복구 키가 켜집니다.",
  };
  return epilogues[endingId] ?? "다음 분석관은 당신이 남긴 질문에서 새로운 사건을 시작합니다.";
}

export function getAchievementProgress({ log = [], completedCases = [], caseResults = {} } = {}) {
  return [
    { id: "people-first", label: "PEOPLE FIRST", value: log.filter((entry) => /protect|people|witness|person/.test(entry.choiceId ?? "")).length, goal: 3 },
    { id: "full-audit", label: "FULL AUDIT", value: Object.keys(caseResults).length, goal: 6 },
    { id: "route-keeper", label: "ROUTE KEEPER", value: completedCases.length, goal: 5 },
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
