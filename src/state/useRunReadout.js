import { useMemo } from "react";

import { readSettledWindowSeeds } from "../appConfig.js";
import { caseObjectives, getCaseBranchNodes, nodes, triggerLabels } from "../gameData.js";
import {
  buildNarrativeSpine,
  getAllDiscoveryClueIds,
  getAverageResponseTime,
  getCounterfactualReport,
  getDecisionFingerprint,
  getDecisionLedger,
  getGameplayStats,
  getObservationLedger,
  getObserverPattern,
  getRiskPressure,
  getSuspenseState,
} from "../gameLogic.js";
import { getJudgementHabit } from "../judgementHabit.js";
import { countAudit } from "../gauntlet/auditRisk.js";
import { readLinks } from "../gauntlet/cascadeRisk.js";
import { getTraceEvents } from "./trace.js";
import { getSeasonOpening } from "./newGamePlusCarry.js";
import { getSeasonPage, isCaseFirstPage } from "./secondSeason.js";
import { getSceneRead } from "./seenScenes.js";

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
export function useRunReadout({ log, resources, triggers, cognition, caseResults, node, currentCase, clueCount, gauntletRun, runId, echo, secondSeason = null, nodeId = null, seedBase, debugTools }) {
  const riskPressure = useMemo(() => getRiskPressure(resources), [resources]);
  const riskTier = riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  // It rides on the spine, which the play view already carries, so the view
  // takes no new field (check:runtime-budget).
  // On a NEW GAME+ season, a case's first page also carries what the season
  // before left on it (secondSeason.js): an object of two lines, or null.
  const seasonLine = getSeasonOpening({ gauntletRun, currentCase, log, caseResults, echo });
  const firstPage = useMemo(() => isCaseFirstPage(log, currentCase), [log, currentCase]);
  // And on every page of one, whether a season before read the scene (E-1).
  const read = getSceneRead(secondSeason?.seen, nodeId);
  const opening = useMemo(
    () => getSeasonPage({ secondSeason, currentCase, firstPage, opening: seasonLine, read }),
    [secondSeason, currentCase, firstPage, seasonLine, read],
  );
  const narrativeSpine = useMemo(() => {
    const suspenseState = getSuspenseState({ riskPressure, log, currentCase });
    return {
      ...buildNarrativeSpine({
        caseObjective: caseObjectives[currentCase],
        node,
        log,
        triggerLabels,
        riskTier,
        suspenseState,
      }),
      opening,
    };
  }, [currentCase, log, node, opening, riskPressure, riskTier]);
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
      currentAverageResponseTime: getAverageResponseTime(log),
      reframeEntries: log.filter((entry) => entry.reframeOpenedRoute),
    };
  }, [log]);
  const gameplayStats = useMemo(() => getGameplayStats(log, riskPressure), [log, riskPressure]);
  const decisionLedger = useMemo(() => getDecisionLedger(log, resources), [log, resources]);
  // The season's 판단 습관 rides on the fingerprint because the fingerprint is
  // what the report already hands the result card: the card is given the
  // finished name and no new field (judgementHabit.js).
  const judgementHabit = useMemo(() => getJudgementHabit(caseResults), [caseResults]);
  const decisionFingerprint = useMemo(
    () => ({ ...getDecisionFingerprint({ triggerScores: triggers, cognitionScores: cognition, entries: log, resources }), habit: judgementHabit }),
    [cognition, judgementHabit, log, resources, triggers],
  );
  // What this run left shut: clues never surfaced, and the far side of every fork.
  const unopenedClueCount = Math.max(0, getAllDiscoveryClueIds().length - clueCount);
  const gauntletSeed = useMemo(() => (seedBase ? dealGauntletSeed(seedBase) : null), [seedBase]);
  // The case's audit (B3), off the same log the settlement counts; the table shows it only on a week that has it.
  const auditCount = useMemo(() => countAudit(log), [log]);
  // B2's links off the case's log (cascadeRisk.js): null on a table without them.
  const linkReading = useMemo(() => readLinks(gauntletRun, log, runId), [gauntletRun, log, runId]);
  // The two as one field of the play view, which has room for one (check:runtime-budget).
  const tableRisk = useMemo(() => ({ audit: auditCount, links: linkReading }), [auditCount, linkReading]);
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
    tableRisk,
    silentFailureCount,
  };
}
