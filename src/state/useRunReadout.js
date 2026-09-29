import { useMemo } from "react";

import { readSettledWindowSeeds } from "../appConfig.js";
import { caseObjectives, getCaseBranchNodes, nodes, triggerLabels } from "../gameData.js";
import {
  buildNarrativeSpine,
  getAllDiscoveryClueIds,
  getCounterfactualReport,
  getDecisionFingerprint,
  getDecisionLedger,
  getGameplayStats,
  getObservationLedger,
  getObserverPattern,
  getRiskPressure,
  getSuspenseState,
} from "../gameLogic.js";
import { getTraceEvents } from "./trace.js";

/**
 * A window already settled under this seed -- a rolled-back save brought it
 * back -- is dealt again under a fresh draw, so its seen wall is not its wall.
 */
function dealGauntletSeed(baseSeed, settledSeeds = readSettledWindowSeeds()) {
  const settled = new Set(settledSeeds);
  let seed = baseSeed;
  for (let redeal = 1; settled.has(seed) && redeal < 50; redeal += 1) seed = `${baseSeed}~${redeal}`;
  return seed;
}

/**
 * What the run reads as, derived once per change rather than once per render.
 *
 * Every one of these is a pure function of the log and a few resources, and
 * they sat in the runtime's body, recomputed on every render -- including the
 * ones a live table causes -- while the log they read had not moved. The table
 * seed parsed up to 400 settled seeds out of storage on each of those renders.
 */
export function useRunReadout({ log, resources, triggers, cognition, node, currentCase, clueCount, seedBase, debugTools }) {
  const riskPressure = useMemo(() => getRiskPressure(resources), [resources]);
  const riskTier = riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  const narrativeSpine = useMemo(() => {
    const suspenseState = getSuspenseState({ riskPressure, log, currentCase });
    return buildNarrativeSpine({
      caseObjective: caseObjectives[currentCase],
      node,
      log,
      triggerLabels,
      riskTier,
      suspenseState,
    });
  }, [currentCase, log, node, riskPressure, riskTier]);
  const logReadout = useMemo(() => {
    const visitedNodeIds = new Set(log.map((entry) => entry.nodeId));
    const unopenedBranchCount = getCaseBranchNodes().reduce(
      (total, branch) => total + branch.nextIds.filter((nodeId) => !visitedNodeIds.has(nodeId)).length,
      0,
    );
    return {
      observationLedger: getObservationLedger(log),
      observerPattern: getObserverPattern(log),
      counterfactualReport: getCounterfactualReport(log, nodes),
      unopenedBranchCount,
      // The quiet beat shows the player their own words -- which are now always
      // a line they picked rather than one they typed.
      endingQuietLine: [...log].reverse().find((entry) => entry.spokenChoice)?.spokenChoice ?? "",
      currentAverageResponseTime: log.length > 0
        ? Math.round(log.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) / log.length)
        : 0,
      reframeEntries: log.filter((entry) => entry.reframeOpenedRoute),
    };
  }, [log]);
  const gameplayStats = useMemo(() => getGameplayStats(log, riskPressure), [log, riskPressure]);
  const decisionLedger = useMemo(() => getDecisionLedger(log, resources), [log, resources]);
  const decisionFingerprint = useMemo(
    () => getDecisionFingerprint({ triggerScores: triggers, cognitionScores: cognition, entries: log, resources }),
    [cognition, log, resources, triggers],
  );
  // What this run left shut: clues never surfaced, and the far side of every fork.
  const unopenedClueCount = Math.max(0, getAllDiscoveryClueIds().length - clueCount);
  const gauntletSeed = useMemo(() => (seedBase ? dealGauntletSeed(seedBase) : null), [seedBase]);
  // The trace is session storage, not state, and only the debug overlay prints
  // it, so only a debug build reads it on render.
  const silentFailureCount = debugTools
    ? getTraceEvents().filter((event) => event.kind === "error" && String(event.note ?? "").startsWith("silent-")).length
    : 0;

  return {
    ...logReadout,
    riskPressure,
    riskTier,
    narrativeSpine,
    gameplayStats,
    decisionLedger,
    decisionFingerprint,
    unopenedClueCount,
    unopenedRecordCount: unopenedClueCount + logReadout.unopenedBranchCount,
    gauntletSeed,
    silentFailureCount,
  };
}
