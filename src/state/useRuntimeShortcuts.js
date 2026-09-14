import { useEffect, useRef } from "react";

export function usePendingTelemetryRef(saved) {
  return useRef(saved?.pendingTelemetry ?? []);
}

export function useRuntimeOverlayShortcuts({
  decisionReveal,
  setDecisionReveal,
  showRanking,
  setShowRanking,
  showErrorLog,
  closeRecoveryCenter,
}) {
  useEffect(() => {
    const closeOverlay = (event) => {
      if (event.key !== "Escape") return;
      if (decisionReveal) {
        setDecisionReveal(null);
      } else if (showRanking) {
        setShowRanking(false);
      } else if (showErrorLog) {
        closeRecoveryCenter();
      }
    };
    window.addEventListener("keydown", closeOverlay);
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [closeRecoveryCenter, decisionReveal, setDecisionReveal, setShowRanking, showErrorLog, showRanking]);
}

/**
 * Session keys the runtime owns: save, and the result screen's retry and next.
 * The table's own keys -- number to stake, Space to push, Enter to cash -- live
 * with the table in `GauntletStage`, where the window they act on lives.
 */
export function useRuntimeChoiceShortcuts({
  currentCase,
  decisionReveal,
  isAdvancing,
  isResult,
  nextCaseSignal,
  saveCurrentGame,
  startCase,
  started,
}) {
  useEffect(() => {
    const handleShortcut = (event) => {
      if (!started || decisionReveal || isAdvancing) return;
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (isResult) {
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          startCase(currentCase);
        } else if (event.key.toLowerCase() === "n" && nextCaseSignal) {
          event.preventDefault();
          startCase(nextCaseSignal.caseId);
        }
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        saveCurrentGame({ exit: event.shiftKey });
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [currentCase, decisionReveal, isAdvancing, isResult, nextCaseSignal, saveCurrentGame, startCase, started]);
}
