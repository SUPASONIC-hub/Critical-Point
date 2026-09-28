import { useEffect, useRef } from "react";

export function usePendingTelemetryRef(saved) {
  return useRef(saved?.pendingTelemetry ?? []);
}

/**
 * Escape closes what is in front: the reveal, else the recovery centre. 랭킹 and
 * 게시판 close on Escape too, in `useOverlayScreens`, which the pre-start shell
 * shares; while one of them is up (`screenOpen`) the key is theirs, so one press
 * does not also close the recovery centre underneath.
 */
export function useRuntimeOverlayShortcuts({
  decisionReveal,
  setDecisionReveal,
  screenOpen,
  showErrorLog,
  closeRecoveryCenter,
}) {
  useEffect(() => {
    const closeOverlay = (event) => {
      if (event.key !== "Escape") return;
      if (decisionReveal) {
        setDecisionReveal(null);
      } else if (showErrorLog && !screenOpen) {
        closeRecoveryCenter();
      }
    };
    window.addEventListener("keydown", closeOverlay);
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [closeRecoveryCenter, decisionReveal, screenOpen, setDecisionReveal, showErrorLog]);
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
      // Ctrl/Cmd+R is the browser's reload and Ctrl+P its print dialog; a
      // modified key is never one of the game's.
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      // Read off the physical key, as the table's letters are (useTableKeys):
      // with a Hangul layout active `event.key` is ㄱ, ㅜ or ㅔ, not r, n or p.
      if (isResult) {
        if (event.code === "KeyR") {
          event.preventDefault();
          startCase(currentCase);
        } else if (event.code === "KeyN" && nextCaseSignal) {
          event.preventDefault();
          startCase(nextCaseSignal.caseId);
        }
        return;
      }
      if (event.code === "KeyP") {
        event.preventDefault();
        saveCurrentGame({ exit: event.shiftKey });
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [currentCase, decisionReveal, isAdvancing, isResult, nextCaseSignal, saveCurrentGame, startCase, started]);
}
