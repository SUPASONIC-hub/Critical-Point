import { useEffect } from "react";

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

export function useRuntimeChoiceShortcuts({
  choose,
  currentCase,
  decisionReveal,
  fixedChoices,
  isAdvancing,
  isResult,
  nextCaseSignal,
  pendingChoice,
  previewChoice,
  saveCurrentGame,
  setPendingChoice,
  startCase,
  started,
}) {
  useEffect(() => {
    const handleChoiceShortcut = (event) => {
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
        return;
      }
      if (event.key === "Escape" && pendingChoice) {
        event.preventDefault();
        setPendingChoice(null);
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && pendingChoice) {
        event.preventDefault();
        choose(pendingChoice);
        return;
      }
      if (fixedChoices.length > 1 && ["ArrowDown", "ArrowRight", "j", "J", "ArrowUp", "ArrowLeft", "k", "K"].includes(event.key)) {
        event.preventDefault();
        const currentIndex = pendingChoice ? fixedChoices.findIndex((choice) => choice.id === pendingChoice.id) : -1;
        const direction = ["ArrowUp", "ArrowLeft", "k", "K"].includes(event.key) ? -1 : 1;
        const nextIndex = (currentIndex + direction + fixedChoices.length) % fixedChoices.length;
        previewChoice(fixedChoices[nextIndex]);
        return;
      }
      const choiceIndex = Number(event.key) - 1;
      if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || !fixedChoices[choiceIndex]) return;
      event.preventDefault();
      previewChoice(fixedChoices[choiceIndex]);
    };
    window.addEventListener("keydown", handleChoiceShortcut);
    return () => window.removeEventListener("keydown", handleChoiceShortcut);
  }, [
    choose,
    currentCase,
    decisionReveal,
    fixedChoices,
    isAdvancing,
    isResult,
    nextCaseSignal,
    pendingChoice,
    previewChoice,
    saveCurrentGame,
    setPendingChoice,
    startCase,
    started,
  ]);
}
