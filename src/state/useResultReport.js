import { useMemo } from "react";

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
import { createCaseSummary, getCaseOutcome, getEndingVariant } from "../gameLogic.js";
import { createEndingProfile } from "../viewModels/reportViewModels.js";
import { getRouteMarker } from "./savedState.js";

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
  localErrorEntries,
  localRankingRows,
  log,
  operatorOrigin,
  operatorProfile,
  pendingTelemetry,
  resolvedNodeId,
  resources,
  runId,
  triggers,
}) {
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
  const outcomeNodeId = currentCase === "final" ? "f_aftershock" : `${currentCase}_aftershock`;
  const outcomeEntry = [...log].reverse().find((entry) => entry.nodeId === outcomeNodeId);

  return {
    result,
    endingVariant,
    rankingComparison,
    routeTimeline,
    finalEndingEntry,
    finalAftermathEntry,
    latestChoiceFeedback: getChoiceOutcomeFeedback(log.at(-1)),
    endingPreview: getEndingPreview(endingVariant),
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
