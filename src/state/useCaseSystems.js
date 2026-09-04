import { useMemo, useState } from "react";

import {
  getAutonomousSignals,
  getBalanceSignals,
  getChapterUiModel,
  getDelayedConsequences,
  getDynamicMusicLayers,
  getEvidenceCombinations,
  getEvidenceContamination,
  getEvidenceMetadata,
  getHypothesisActions,
  getHypothesisConflict,
  getHypothesisLockState,
  getInterlude,
  getInvestigationOutcome,
  getInvestigationTargets,
  getMidBoss,
  getPastRunMemory,
  getPlayStyleUnlocks,
  getRelationshipGraph,
  getRelationshipQuest,
  getRelationshipScene,
  getResourceChain,
  getSeasonGoals,
  getTimelineStamp,
} from "../advancedSystems.js";
import {
  getCharacterState,
  getRivalResponse,
} from "../characterSystems.js";
import {
  getAchievementProgress,
  getChapterTransitionBridge,
  getEvidenceRepairPuzzle,
  getOperationsSnapshot,
  getOperatorReveal,
  getRivalIntervention,
} from "../featurePack.js";
import {
  CASE_SEQUENCE,
} from "../gameData.js";
import {
  getClueHypotheses,
} from "../gameLogic.js";
import {
  createAuthorityState,
} from "../viewModels/sceneViewModels.js";

/**
 * The world the run has produced, derived in one place.
 *
 * Evidence, hypotheses, relationships, the rival, the chapter frame and the
 * operations snapshot are all pure functions of the same few pieces of run
 * state, and they sat as thirty-six consecutive statements in the middle of
 * `GameRuntime` between the scene derivations above them and the decision
 * machinery below. Nothing separated them but a blank line.
 *
 * The one piece of state here is `evidenceRepaired`: the repair puzzle is
 * answered on this screen and nothing outside these derivations reads it.
 */
export function useCaseSystems({
  caseResults,
  completedCases,
  currentCase,
  discoveredClues,
  fallbackCaseId,
  hypothesisAction,
  localErrorEntries,
  localRankingRows,
  log,
  newGamePlusMemory,
  newGamePlusUnlocked,
  node,
  operatorOrigin,
  pendingTelemetry,
  playStyle,
  relationshipScores,
  resources,
  riskTier,
  selectedInvestigation,
  speakerProfile,
}) {
const chapterUiModel = getChapterUiModel(currentCase);
  const activeRelationshipScore = relationshipScores.find((item) => item.active)?.value ?? 0;
  const relationshipQuest = getRelationshipQuest(node?.speaker, activeRelationshipScore);
  const relationshipScene = getRelationshipScene(relationshipQuest, currentCase);
  const pastRunMemory = getPastRunMemory(newGamePlusMemory);
  const delayedConsequences = useMemo(() => getDelayedConsequences(log, caseResults), [caseResults, log]);
  const playStyleUnlocks = getPlayStyleUnlocks(playStyle, newGamePlusUnlocked);
  const seasonGoals = getSeasonGoals();
  const interlude = getInterlude(currentCase, log.at(-1)?.choice);
  const balanceSignals = useMemo(() => getBalanceSignals(log), [log]);
  const authorityState = useMemo(() => createAuthorityState({ evidence: discoveredClues.length, legitimacy: resources.legitimacy ?? 0, operatorOrigin, trust: resources.trust ?? 0 }), [discoveredClues.length, operatorOrigin, resources.legitimacy, resources.trust]);
  const clueCount = discoveredClues.length;
  const clueHypotheses = useMemo(() => getClueHypotheses(discoveredClues), [discoveredClues]);
  const relationshipGraph = getRelationshipGraph(relationshipScores);
  const evidenceCombinations = getEvidenceCombinations(discoveredClues);
  const hypothesisActions = getHypothesisActions(clueHypotheses, authorityState);
  const evidenceMetadata = getEvidenceMetadata(discoveredClues);
  const hypothesisConflict = getHypothesisConflict(clueHypotheses);
  const investigationTargets = getInvestigationTargets(fallbackCaseId, authorityState);
  const autonomousSignal = getAutonomousSignals(fallbackCaseId, log);
  const timelineStamp = getTimelineStamp(fallbackCaseId, log.length);
  const evidenceContamination = getEvidenceContamination(discoveredClues, log);
  const hypothesisLockState = getHypothesisLockState(clueHypotheses, hypothesisAction);
  const resourceChain = getResourceChain(resources);
  const midBoss = getMidBoss(fallbackCaseId, log);
  const dynamicMusicLayers = getDynamicMusicLayers(riskTier, fallbackCaseId);
  const characterState = getCharacterState(speakerProfile?.name ?? speakerProfile?.id ?? "", log);
  const rivalResponse = getRivalResponse(fallbackCaseId, log, resources);
  const [evidenceRepaired, setEvidenceRepaired] = useState(false);
  const evidenceRepairPuzzle = getEvidenceRepairPuzzle(discoveredClues, evidenceRepaired);
  const rivalIntervention = getRivalIntervention({ caseId: fallbackCaseId, log, resources });
  const operatorReveal = getOperatorReveal({ origin: operatorOrigin, completedCases, caseResults });
  const chapterTransitionBridge = getChapterTransitionBridge(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(fallbackCaseId) - 1], fallbackCaseId, caseResults[CASE_SEQUENCE[CASE_SEQUENCE.indexOf(fallbackCaseId) - 1]]);
  const achievementProgress = getAchievementProgress({ log, completedCases, caseResults });
  const operationsSnapshot = getOperationsSnapshot({ errors: localErrorEntries, pending: pendingTelemetry, rankings: localRankingRows, caseResults });
  const selectedInvestigationOutcome = getInvestigationOutcome(investigationTargets.find((target) => target.id === selectedInvestigation), log.length);

  return {
    achievementProgress,
    authorityState,
    autonomousSignal,
    balanceSignals,
    chapterTransitionBridge,
    chapterUiModel,
    characterState,
    clueCount,
    clueHypotheses,
    delayedConsequences,
    dynamicMusicLayers,
    evidenceCombinations,
    evidenceContamination,
    evidenceMetadata,
    evidenceRepairPuzzle,
    evidenceRepaired,
    hypothesisActions,
    hypothesisConflict,
    hypothesisLockState,
    interlude,
    investigationTargets,
    midBoss,
    operationsSnapshot,
    operatorReveal,
    pastRunMemory,
    playStyleUnlocks,
    relationshipGraph,
    relationshipQuest,
    relationshipScene,
    resourceChain,
    rivalIntervention,
    rivalResponse,
    seasonGoals,
    selectedInvestigationOutcome,
    setEvidenceRepaired,
    timelineStamp,
  };
}
