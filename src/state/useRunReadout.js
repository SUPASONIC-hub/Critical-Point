import { useEffect, useMemo } from "react";

import { readSettledWindowSeeds } from "../appConfig.js";
import { caseObjectives, getCaseBranchNodes, nodes, triggerLabels } from "../gameData.js";
import {
  buildNarrativeSpine,
  getAllDiscoveryClueIds,
  getAverageResponseTime,
  getCounterfactualReport,
  getDiscoveryClue,
  getDecisionFingerprint,
  getDecisionLedger,
  getGameplayStats,
  getObservationLedger,
  getObserverPattern,
  getRiskPressure,
  getSuspenseState,
} from "../gameLogic.js";
import { getJudgementHabit } from "../judgementHabit.js";
import { countAudit, isAuditOn } from "../gauntlet/auditRisk.js";
import { readLinks } from "../gauntlet/cascadeRisk.js";
import { getTableReaction } from "../gauntlet/tableAfterword.js";
import { getTableRules } from "../gauntlet/tableUnlocks.js";
import { getTraceEvents } from "./trace.js";
import { getSceneBridge } from "../viewModels/sceneBridge.js";
import { caseCastFor } from "../gauntlet/CaseCastFold.jsx";
import { warmCasePortraits } from "../speakerPortraits.js";
import { getSeasonOpening } from "./newGamePlusCarry.js";
import { getScenePick, getSeasonPage, isCaseFirstPage } from "./secondSeason.js";
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
export function useRunReadout({ log, resources, triggers, cognition, caseResults, node, currentCase, clueCount, discoveredClues = [], gauntletRun, runId, seedBase, debugTools, echo = "", secondSeason = null, nodeId = null }) {
  // A case's report counts the doors of that case (D-10); the finale's, the season's.
  const caseScoped = currentCase !== "final";
  const riskPressure = useMemo(() => getRiskPressure(resources), [resources]);
  const riskTier = riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  // `opening` is the run's line under the scene (`run.echo`): the case's opening
  // voice until the first card is played (caseIntroEchoes). It rides on the
  // spine because the play view has no room for a field of its own
  // (check:runtime-budget); the briefing shows it on a case's first page only.
  // A NEW GAME+ season's first page carries its line (newGamePlusCarry.js),
  // beside the run's own `opening`; both ride on the spine.
  // On a NEW GAME+ season, a case's first page also carries what the season
  // before left on it (secondSeason.js), so `seasonOpening` is an object of
  // two lines (`echo`, `recall`) and, on every page, whether a season before
  // read the scene (`read`, E-1); or null.
  const seasonLine = getSeasonOpening({ gauntletRun, currentCase, log, caseResults, echo });
  const firstPage = useMemo(() => isCaseFirstPage(log, currentCase), [log, currentCase]);
  const read = getSceneRead(secondSeason?.seen, nodeId);
  // And the card the season before picked in it (B-14(1)): the page's, never the commit's or the clock's.
  const picked = getScenePick(secondSeason, nodeId);
  const seasonOpening = useMemo(
    () => getSeasonPage({ secondSeason, currentCase, firstPage, opening: seasonLine, read, picked }),
    [secondSeason, currentCase, firstPage, seasonLine, read, picked],
  );
  const narrativeSpine = useMemo(() => {
    const suspenseState = getSuspenseState({ riskPressure, log, currentCase });
    // `bridge` (D-7) and `caseCast` (D-8), the case file's cast drawn from
    // the case's log, ride on the spine to the briefing and the table's case
    // file: the play view has no field to spare.
    return {
      ...buildNarrativeSpine({
        caseObjective: caseObjectives[currentCase],
        node,
        log,
        triggerLabels,
        riskTier,
        suspenseState,
      }),
      bridge: getSceneBridge({ log, caseResults, currentCase }),
      caseCast: caseCastFor(log),
      // The speaker's line about the last table at the head of the scene (C-13, tableAfterword.js).
      reaction: getTableReaction(log, node?.title),
      opening: echo,
      seasonOpening,
    };
  }, [caseResults, currentCase, echo, log, node, riskPressure, riskTier, seasonOpening]);
  const logReadout = useMemo(() => {
    const visitedNodeIds = new Set(log.map((entry) => entry.nodeId));
    const unopenedBranchCount = getCaseBranchNodes().filter((branch) => !caseScoped || branch.caseId === currentCase).reduce(
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
  }, [caseScoped, currentCase, log]);
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
  // The case's own clue, when it is a case's report and the clue is still shut.
  const caseClue = caseScoped ? getDiscoveryClue({ currentCase, challengeMatch: true, riskDelta: 2, logLength: 1 }) : null;
  const caseClueShut = caseClue && !discoveredClues.some((found) => (found?.id ?? found) === caseClue.id) ? 1 : 0;
  const gauntletSeed = useMemo(() => (seedBase ? dealGauntletSeed(seedBase) : null), [seedBase]);
  // Every face of the case, fetched as its first scene opens (D-14): only
  // with a scene on the table (`seedBase`), not on the intro, where they would
  // race the first paint. Here rather than in the briefing (SceneBriefing.jsx),
  // whose table chunk had no room for it, nor in GameRuntime, which has no
  // effect to spare (check:runtime-budget).
  const warmCaseId = seedBase ? node?.caseId : null;
  useEffect(() => warmCasePortraits(warmCaseId), [warmCaseId]);
  // The case's rules (tableUnlocks.js): the audit is on from 사건 02 and the links from 사건 03 (RULES_MARK 4, C-4; 프롤로그 04 at RULES_MARK 3).
  const caseRules = getTableRules(currentCase, gauntletRun);
  // The case's audit (B3), off the same log the settlement counts; null in a case whose rules do not count it.
  const auditCount = useMemo(() => (isAuditOn(gauntletRun, caseRules) ? countAudit(log) : null), [caseRules, gauntletRun, log]);
  // B2's links off the case's log (cascadeRisk.js): null in a case whose rules do not have them.
  const linkReading = useMemo(() => readLinks(gauntletRun, log, runId, caseRules), [caseRules, gauntletRun, log, runId]);
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
    unopenedRecordCount: (caseScoped ? caseClueShut : unopenedClueCount) + logReadout.unopenedBranchCount,
    gauntletSeed,
    tableRisk,
    silentFailureCount,
  };
}
