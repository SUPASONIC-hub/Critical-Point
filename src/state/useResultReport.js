import { useMemo, useSyncExternalStore } from "react";

import { SAVE_SCHEMA_VERSION } from "../appConfig.js";
import {
  getAftermath,
  getAuthorityReview,
  getChoiceOutcomeFeedback,
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
import { caseAftermathNodeId, triggerLabels } from "../gameData.js";
import { createCaseSummary, getCaseOutcome, getEndingVariant, getOutcomeCarryover } from "../gameLogic.js";
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
          ? "구조 재설계 입력이 선택지 밖의 계획처럼 느껴졌나요?"
          : "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
        nextCaseSignal
          ? `다음 사건 「${nextCaseSignal.title}」까지 이어서 보고 싶은 이유가 생겼나요?`
          : "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
      ],
    };
  }, [gameplayStats, log, nextCaseSignal, result, riskTier, seasonJourney]);
}

/**
 * What the season has cost so far, for the closing ruling.
 *
 * Every case starts from the same resources, so the last case alone never
 * reaches the thresholds the ending is written against. This adds up the human
 * cost each case ended on and takes the highest pressure any case reached.
 */
export function getSeasonStrain(caseResults = {}, pending = null) {
  const summaries = [...Object.values(caseResults ?? {}), pending].filter(Boolean);
  return {
    seasonHumanCost: summaries.reduce((sum, summary) => sum + (Number(summary.finalHumanCost) || 0), 0),
    peakRiskPressure: summaries.reduce((peak, summary) => Math.max(peak, Number(summary.peakRiskPressure) || 0), 0),
    seasonBusts: summaries.reduce((sum, summary) => sum + (Number(summary.pushRecord?.busts) || 0), 0),
    seasonBestMultiplier: summaries.reduce((best, summary) => Math.max(best, Number(summary.pushRecord?.bestMultiplier) || 1), 1),
    // The vault is cumulative across the season, so the largest summary holds it,
    // and it is read per case: a season total rises with every case played. The
    // groove the beat added is taken back out -- the vault's slack rewards
    // reading the table, and the beat has its own door below.
    seasonVaultPerCase: summaries.length
      ? summaries.reduce(
        (vault, summary) => Math.max(vault, (Number(summary.gauntlet?.vault) || 0) - (Number(summary.gauntlet?.grooveVault) || 0)),
        0,
      ) / summaries.length
      : 0,
    seasonBestCombo: summaries.reduce(
      (best, summary) => Math.max(best, Number(summary.pushRecord?.bestCombo) || 0, Number(summary.gauntlet?.bestCombo) || 0),
      0,
    ),
  };
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
  const endingVariant = useMemo(
    () => getEndingVariant({ resources, discoveredClues, log, ...getSeasonStrain(caseResults) }),
    [caseResults, discoveredClues, log, resources],
  );
  const rankingComparison = useMemo(() => getRankingComparison(result), [result]);
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
    routeTimeline,
    finalEndingEntry,
    finalAftermathEntry,
    latestChoiceFeedback: getChoiceOutcomeFeedback(log.at(-1)),
    endingPreview: { ...getEndingPreview(endingVariant), rationale: [
      `${easyResourceLabels.trust} ${resources.trust ?? 0}`,
      `${easyResourceLabels.legitimacy} ${resources.legitimacy ?? 0}`,
      `${easyResourceLabels.capital} ${resources.capital ?? 0}`,
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
    caseOutcome: getCaseOutcome({ caseId: currentCase, choiceId: outcomeEntry?.choiceId }),
    endingProfile: createEndingProfile({ finalEndingEntry }),
  };
}
