import { useSyncExternalStore } from "react";

/**
 * The decision window, kept outside React state on purpose.
 *
 * The countdown used to be root state, so every second rebuilt AppContent and
 * the ~150-key play view under it -- 45 full re-renders per scene. Only the two
 * places that print the clock subscribe per second now; the root subscribes to
 * a coarse phase that changes three times per window instead.
 */

const PHASE_SECONDS = 15;

let seconds = 0;
let intervalId = null;
const listeners = new Set();

function emit() {
  for (const listener of [...listeners]) listener();
}

export function getDecisionSeconds() {
  return seconds;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Restart the window for a new scene. */
export function startDecisionWindow(windowSeconds) {
  stopDecisionWindow();
  seconds = windowSeconds;
  emit();
  intervalId = setInterval(() => {
    if (typeof document !== "undefined" && document.hidden) return;
    // Counts past zero on purpose: overtime has to stay measurable so the
    // window can keep billing for it.
    seconds -= 1;
    emit();
  }, 1000);
}

/** Spend part of the remaining window (an Echo probe buys a hint with time). */
export function spendDecisionSeconds(cost) {
  seconds = Math.max(0, seconds - cost);
  emit();
}

export function stopDecisionWindow() {
  if (intervalId === null) return;
  clearInterval(intervalId);
  intervalId = null;
}

/** Per-second value, for the two components that print the clock. */
export function useDecisionSeconds() {
  return useSyncExternalStore(subscribe, getDecisionSeconds, () => 0);
}

/**
 * Coarse remaining-window phase. `useSyncExternalStore` re-renders only when
 * the snapshot changes, so a subscriber at the root wakes three times per
 * window rather than forty-five.
 */
function getDecisionPhase() {
  return Math.max(0, Math.ceil(seconds / PHASE_SECONDS));
}

export function useDecisionPhase() {
  return useSyncExternalStore(subscribe, getDecisionPhase, () => 0);
}

/** Seconds represented by one phase step, for callers scoring urgency. */
export const DECISION_PHASE_SECONDS = PHASE_SECONDS;

/** Subscribe outside render, for the overtime charge. */
export function onDecisionTick(listener) {
  return subscribe(listener);
}
