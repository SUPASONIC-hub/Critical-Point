/**
 * A case opens when the case before it in the season is complete.
 *
 * This was a hand-written chain that stopped at 사건 05 and opened the finale
 * straight after it, so 사건 06 and 07 only ever showed as open while being
 * played. The order is the order `seasonCasesBase` lists the season in.
 */
export function createSeasonCases({ seasonCasesBase, completedCases, currentCase }) {
  return seasonCasesBase.map((caseItem, index) => {
    const isCompleted = completedCases.includes(caseItem.id);
    const isCurrent = caseItem.id === currentCase;
    const previousCaseId = seasonCasesBase[index - 1]?.id;
    const isUnlocked = index === 0 || completedCases.includes(previousCaseId) || isCurrent;
    return {
      ...caseItem,
      status: isCompleted ? "COMPLETE" : isCurrent ? "PLAYING" : isUnlocked ? "OPEN" : "LOCKED",
    };
  });
}

export function createLocalLeaderboardRows({
  caseResults,
  localRankingRows,
  playerName,
  runId,
  seasonCasesBase,
  sessionCode,
}) {
  return [
    ...localRankingRows,
    ...Object.entries(caseResults).map(([caseId, summary]) => ({
      local: true,
      run_id: summary?.runId ?? runId,
      session_code: sessionCode,
      player_name: playerName || "현재 분석관",
      case_id: caseId,
      case_title: seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.title ?? caseId,
      completed_at: summary?.completedAt ?? "",
      summary,
    })),
  ];
}

function createSeasonCompletionSummary({ caseSummary, completedCaseCount }) {
  return { ...caseSummary, seasonComplete: true, completedCaseCount };
}

export function createSeasonLeaderboardRow({
  caseSummary,
  completedCaseCount,
  playerName,
  runId,
  sessionCode,
}) {
  return {
    local: true,
    run_id: caseSummary?.runId ?? runId,
    session_code: sessionCode,
    player_name: playerName || "현재 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: caseSummary?.completedAt ?? "",
    summary: createSeasonCompletionSummary({ caseSummary, completedCaseCount }),
  };
}

export function createSeasonTelemetryPayload({
  caseSummary,
  completedCaseCount,
  cognition,
  decisionLog,
  resources,
  runId,
  sessionCode,
  sessionId,
  triggers,
}) {
  return {
    session_id: sessionId,
    run_id: runId,
    session_code: sessionCode,
    player_name: "익명 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: new Date().toISOString(),
    summary: createSeasonCompletionSummary({ caseSummary, completedCaseCount }),
    resources,
    triggers,
    cognition,
    decision_log: decisionLog,
  };
}

/**
 * A stored case summary read back in full. Saves written by older builds are
 * missing fields the report and the intro both print, so every reader goes
 * through this rather than reaching into the stored object.
 */
export function normalizeCaseSummary(summary) {
  return {
    schemaVersion: summary?.schemaVersion ?? 1,
    primary: summary?.primary ?? ["responsibility", 0],
    secondary: summary?.secondary ?? ["protection", 0],
    thinking: summary?.thinking ?? ["persistence", 0],
    reframeCount: summary?.reframeCount ?? 0,
    averageResponseTime: summary?.averageResponseTime ?? 0,
    challengeClearCount: summary?.challengeClearCount ?? 0,
    reducedRiskCount: summary?.reducedRiskCount ?? 0,
    rhythmScore: summary?.rhythmScore ?? 0,
    cognitionScore: summary?.cognitionScore ?? 0,
    pressureAdaptScore: summary?.pressureAdaptScore ?? 0,
    reflectionScore: summary?.reflectionScore ?? 0,
    consistencyScore: summary?.consistencyScore ?? 0,
    exploitPenalty: summary?.exploitPenalty ?? 0,
    burstScore: summary?.burstScore ?? summary?.momentumScore ?? 0,
    momentumScore: summary?.momentumScore ?? 0,
    momentumTier: summary?.momentumTier ?? "BUILDING",
    rank: summary?.rank ?? "C",
    outcomeChoiceId: summary?.outcomeChoiceId ?? null,
    outcomeNodeId: summary?.outcomeNodeId ?? null,
    runId: typeof summary?.runId === "string" ? summary.runId : "",
  };
}
