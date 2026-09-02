export function createSeasonCases({ seasonCasesBase, completedCases, currentCase }) {
  return seasonCasesBase.map((caseItem) => {
    const isCompleted = completedCases.includes(caseItem.id);
    const isCurrent = caseItem.id === currentCase;
    const isUnlocked =
      caseItem.id === "case01" ||
      (caseItem.id === "case02" && completedCases.includes("case01")) ||
      (caseItem.id === "case03" && completedCases.includes("case02")) ||
      (caseItem.id === "case04" && completedCases.includes("case03")) ||
      (caseItem.id === "case05" && completedCases.includes("case04")) ||
      (caseItem.id === "final" && completedCases.includes("case05")) ||
      isCurrent;
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
