import { useMemo, useSyncExternalStore } from "react";

import { SAVE_SCHEMA_VERSION } from "../appConfig.js";
import {
  getAftermath,
  getAuthorityReview,
  getEndingAtmosphere,
  getEndingPreview,
  getFailureCause,
  getOriginEndingVariant,
  getPlayReport,
  getRankingComparison,
  getRankingIntegrity,
  getReplayDiagnostics,
  getTelemetryDashboardSnapshot,
} from "../advancedSystems.js";
import { getFailureRecovery } from "../featurePack.js";
import { caseAftermathNodeId, nodes, seasonCasesBase, triggerLabels } from "../gameData.js";
import { createCaseSummary, getCaseOutcome, getEndingVariant, getOutcomeCarryover, getOutcomeChoiceId, getSeasonStrain } from "../gameLogic.js";
import { createLogicReport } from "../logicReport.js";
import { easyResourceLabels } from "../playerLanguage.js";
import { createAchievementBadges, createEndingProfile, createScoreBreakdown } from "../viewModels/reportViewModels.js";
import { createCompletedCaseResultList } from "../viewModels/introViewModel.js";
import { getRouteMarker } from "./savedState.js";
import { getTelemetryStats, subscribeTelemetryStats } from "../telemetry.js";

const RANK_LINES = {
  S: "생각 리듬, 관점 전환, 압박 회복이 동시에 솟았습니다.",
  A: "정답을 고른 것이 아니라, 압박 속에서 판단 패턴이 선명하게 드러났습니다.",
  B: "사건은 통과했습니다. 다음 플레이에서는 다른 생각 방식으로 흔들어볼 여지가 있습니다.",
};
const RANK_LINE_FALLBACK = "사건은 통과했지만 버스트 신호는 아직 약합니다. 즉답보다 근거, 비용, 회복 경로를 더 남겨보세요.";

/**
 * The copy the report prints around the numbers: the season so far, the rank's
 * one line, the score's parts, the badges and the three feedback questions.
 * They sat at the bottom of the runtime's body and were rebuilt on every render
 * of every scene.
 */
function useReportCopy({ caseResults, gameplayStats, log, nextCaseSignal, result, riskTier }) {
  const seasonJourney = useMemo(
    () =>
      createCompletedCaseResultList(caseResults).map((caseItem) => ({
        ...caseItem,
        outcome: getCaseOutcome({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
        carryover: getOutcomeCarryover({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
      })),
    [caseResults],
  );
  return useMemo(() => {
    const {
      challengeClearCount, cognitionScore, consistencyScore, currentChallengeStreak, exploitPenalty,
      momentumScore, momentumTier, pressureAdaptScore, rank, reducedRiskCount, reflectionScore, rhythmScore,
    } = gameplayStats;
    const primaryTrigger = triggerLabels[result.primary[0]];
    return {
      seasonJourney,
      resultRank: rank,
      rankLine: RANK_LINES[rank] ?? RANK_LINE_FALLBACK,
      resultBridge: result.longestDecision
        ? `${primaryTrigger} 압박이 가장 오래 남았고, "${result.longestDecision.title}"에서 판단 시간이 길어졌습니다.`
        : `${primaryTrigger} 압박이 다음 사건의 시작 조건으로 기록됩니다.`,
      scoreBreakdown: createScoreBreakdown({ cognitionScore, consistencyScore, exploitPenalty, pressureAdaptScore, reflectionScore, rhythmScore }),
      achievementBadges: createAchievementBadges({
        challengeClearCount,
        currentChallengeStreak,
        // Only saves from before the flow surge was retired carry one.
        flowSurgeCount: log.filter((entry) => entry.flowSurge).length,
        momentumScore,
        momentumTier,
        reducedRiskCount,
        result,
        riskTier,
      }),
      feedbackPrompts: [
        `${result.longestDecision?.title ?? "가장 오래 머문 장면"}에서 실제로 멈칫한 이유가 있었나요?`,
        result.reframeCount > 0
          ? "판을 다시 짜서 열린 경로가 보기에 없던 길처럼 느껴졌나요?"
          : "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
        nextCaseSignal
          ? `다음 사건 「${nextCaseSignal.title}」까지 이어서 보고 싶은 이유가 생겼나요?`
          : "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
      ],
    };
  }, [gameplayStats, log, nextCaseSignal, result, riskTier, seasonJourney]);
}

/**
 * Everything the closing report reads, derived in one place.
 *
 * These are pure functions of the run: the case summary, which of the nine
 * endings the season earned, the sentences written around that ending, and the
 * diagnostics printed beside them. They sat inline in `GameRuntime` among the
 * play-screen derivations, where nothing distinguished the values a result
 * screen needs from the values a scene needs, and the file grew past the point
 * where that could be read off it.
 *
 * The hook is called on every render, not only on a result: `progress` and the
 * screen-reader line on the play screen read `result` too.
 */
export function useResultReport({
  authorityState,
  caseResults,
  cognition,
  currentCase,
  discoveredClues,
  fallbackCaseId,
  gameplayStats,
  localErrorEntries,
  localRankingRows,
  log,
  nextCaseSignal,
  operatorOrigin,
  operatorProfile,
  pendingTelemetry,
  resolvedNodeId,
  resources,
  riskTier,
  runId,
  triggers,
}) {
  const telemetryStats = useSyncExternalStore(subscribeTelemetryStats, getTelemetryStats, getTelemetryStats);
  const result = useMemo(
    () =>
      createCaseSummary(triggers, cognition, log, {
        resources,
        schemaVersion: SAVE_SCHEMA_VERSION,
        includeLongestDecision: true,
      }),
    [triggers, cognition, log, resources],
  );
  // The season as `check:endings` replays it: the case summaries so far
  // (the closing case's included once it has closed) and the run's own log.
  const seasonStrain = useMemo(() => getSeasonStrain(caseResults), [caseResults]);
  const endingVariant = useMemo(
    () => getEndingVariant({ resources, discoveredClues, log, ...seasonStrain }),
    [discoveredClues, log, resources, seasonStrain],
  );
  // What the ruling read: the standing the season's cases closed on on average,
  // or the last case's when no summary carries one.
  const standing = seasonStrain.seasonResources ?? resources;
  const rankingComparison = useMemo(() => getRankingComparison(result), [result]);
  // The season's logic panel, from the stored summaries: `result` above is made
  // without `replayOf`, so it is not what a replayed case keeps (logicReport.js).
  const logicReport = useMemo(() => createLogicReport({ caseResults, cases: seasonCasesBase }), [caseResults]);
  const routeTimeline = useMemo(
    () =>
      log
        .filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent)
        .map((entry, index) => ({ ...entry, index, marker: getRouteMarker(entry) })),
    [log],
  );

  const finalEndingEntry = [...log].reverse().find((entry) => entry.nodeId === "f_choice");
  const finalAftermathEntry = [...log].reverse().find((entry) => entry.nodeId === "f_aftershock");
  // Every case closes on its own aftermath scene, and its id carries the case's
  // node prefix (`p1`, `c1`, `f`), never the case id itself.
  const outcomeNodeId = caseAftermathNodeId(currentCase);
  const outcomeEntry = [...log].reverse().find((entry) => entry.nodeId === outcomeNodeId);

  const reportCopy = useReportCopy({ caseResults, gameplayStats, log, nextCaseSignal, result, riskTier });

  return {
    ...reportCopy,
    result,
    endingVariant,
    rankingComparison,
    logicReport,
    routeTimeline,
    finalEndingEntry,
    finalAftermathEntry,
    endingPreview: { ...getEndingPreview(endingVariant), rationale: [
      `${easyResourceLabels.trust} ${standing.trust ?? 0}`,
      `${easyResourceLabels.legitimacy} ${standing.legitimacy ?? 0}`,
      `${easyResourceLabels.capital} ${standing.capital ?? 0}`,
      `단서 ${discoveredClues.length}`,
    ] },
    failureRecovery: getFailureRecovery(endingVariant, resources),
    endingCause: getFailureCause(endingVariant, resources),
    endingAtmosphere: getEndingAtmosphere(endingVariant.id),
    originEndingVariant: getOriginEndingVariant(operatorOrigin, endingVariant.id),
    aftermath: getAftermath(endingVariant.id, operatorOrigin),
    playReport: getPlayReport(result, log),
    telemetryDashboard: getTelemetryDashboardSnapshot({
      errors: localErrorEntries,
      pending: pendingTelemetry,
      rankings: localRankingRows,
      caseResults,
    }),
    telemetryStats,
    authorityReview: getAuthorityReview(operatorProfile, authorityState.level, result),
    rankingIntegrity: getRankingIntegrity({
      runId,
      completedAt: result.completedAt ?? new Date().toISOString(),
      summary: result,
    }),
    replayDiagnostics: getReplayDiagnostics({
      runId,
      caseId: fallbackCaseId,
      nodeId: resolvedNodeId,
      choiceId: log.at(-1)?.choiceId,
      pending: pendingTelemetry.length,
    }),
    caseOutcome: getCaseOutcome({ caseId: currentCase, choiceId: getOutcomeChoiceId(outcomeEntry?.choiceId, nodes[outcomeNodeId]) }),
    endingProfile: createEndingProfile({ finalEndingEntry }),
  };
}
