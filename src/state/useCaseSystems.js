import { useMemo } from "react";

import { getBalanceSignals, getDelayedConsequences, getSeasonGoals } from "../advancedSystems.js";
import { getAchievementProgress, getOperationsSnapshot, getOperatorReveal } from "../featurePack.js";
import { getClueHypotheses } from "../gameLogic.js";
import { createAuthorityState } from "../viewModels/sceneViewModels.js";

/**
 * The world the run has produced, derived in one place.
 *
 * Evidence, authority, the season's goals and the operations snapshot are all
 * pure functions of the same few pieces of run state, and they sat as a long
 * run of consecutive statements in the middle of `GameRuntime` between the
 * scene derivations above them and the decision machinery below.
 *
 * This returned thirty-six fields until 2026-09-16 and `GameRuntime`
 * destructured nine of them: the other twenty-seven -- a relationship graph,
 * hypothesis actions, investigation targets, a mid-boss, an evidence repair
 * puzzle, a chapter transfer record -- were computed on every render of every
 * scene and dropped on the floor, because no screen had ever been wired to
 * read them. They are in the history if the game ever wants them back.
 */
export function useCaseSystems({
  caseResults,
  completedCases,
  discoveredClues,
  localErrorEntries,
  localRankingRows,
  log,
  operatorOrigin,
  pendingTelemetry,
  resources,
}) {
  const delayedConsequences = useMemo(() => getDelayedConsequences(log, caseResults), [caseResults, log]);
  const seasonGoals = getSeasonGoals();
  const balanceSignals = useMemo(() => getBalanceSignals(log), [log]);
  const authorityState = useMemo(
    () =>
      createAuthorityState({
        evidence: discoveredClues.length,
        legitimacy: resources.legitimacy ?? 0,
        operatorOrigin,
        trust: resources.trust ?? 0,
      }),
    [discoveredClues.length, operatorOrigin, resources.legitimacy, resources.trust],
  );
  const clueCount = discoveredClues.length;
  const clueHypotheses = useMemo(() => getClueHypotheses(discoveredClues), [discoveredClues]);
  const operatorReveal = getOperatorReveal({ origin: operatorOrigin, completedCases, caseResults });
  const achievementProgress = getAchievementProgress({ log, completedCases, caseResults });
  const operationsSnapshot = getOperationsSnapshot({
    errors: localErrorEntries,
    pending: pendingTelemetry,
    rankings: localRankingRows,
    caseResults,
  });

  return {
    achievementProgress,
    authorityState,
    balanceSignals,
    clueCount,
    clueHypotheses,
    delayedConsequences,
    operationsSnapshot,
    operatorReveal,
    seasonGoals,
  };
}
