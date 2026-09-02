import { useEffect, useState } from "react";

import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { limitText } from "../gameLogic.js";

const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";
const QUIET_HOLD_MS = 8000;
const NEXT_PARTICIPANT_MESSAGE_MAX_LENGTH = 180;
const TWIST_COUNT = 2;
const LAST_STEP = 3;

function prefersReducedMotion() {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/**
 * The final-case ending: two twist beats, then a paced four-step sequence with
 * a quiet hold the player can skip, and the handover message left for the next
 * analyst. Reduced-motion players skip the hold entirely.
 */
export function useEndingSequence({ isResult, currentCase }) {
  const [endingStep, setEndingStep] = useState(0);
  const [endingTwistIndex, setEndingTwistIndex] = useState(0);
  const [endingQuietReady, setEndingQuietReady] = useState(prefersReducedMotion);
  const [nextParticipantMessage, setNextParticipantMessage] = useState(() =>
    readStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, ""),
  );

  useEffect(() => {
    if (!isResult || currentCase !== "final" || endingStep !== 1) return undefined;
    let cancelled = false;
    if (prefersReducedMotion()) {
      queueMicrotask(() => {
        if (!cancelled) setEndingQuietReady(true);
      });
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (!cancelled) setEndingQuietReady(false);
    });
    const timer = window.setTimeout(() => setEndingQuietReady(true), QUIET_HOLD_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [currentCase, endingStep, isResult]);

  function skipEndingQuietHold() {
    setEndingQuietReady(true);
  }

  function advanceEndingStep() {
    if (endingStep === 0 && endingTwistIndex < TWIST_COUNT) {
      setEndingTwistIndex((index) => index + 1);
      return;
    }
    setEndingStep((step) => Math.min(LAST_STEP, step + 1));
  }

  function saveNextParticipantMessage() {
    const message = limitText(nextParticipantMessage.trim(), NEXT_PARTICIPANT_MESSAGE_MAX_LENGTH);
    setNextParticipantMessage(message);
    writeStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, message);
    setEndingStep(LAST_STEP);
  }

  function resetEndingSequence() {
    setEndingStep(0);
    setEndingTwistIndex(0);
  }

  return {
    endingStep,
    endingTwistIndex,
    endingQuietReady,
    nextParticipantMessage,
    setNextParticipantMessage,
    skipEndingQuietHold,
    advanceEndingStep,
    saveNextParticipantMessage,
    resetEndingSequence,
  };
}
