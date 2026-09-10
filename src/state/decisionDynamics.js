import { useEffect, useReducer } from "react";
import { onDecisionTick, getDecisionSeconds } from "./decisionClock.js";

export const DYNAMICS_INITIAL_STATE = Object.freeze({
  combo: 0,
  stressLevel: 0,
  timeDecay: 0,
  hiddenChoice: null,
  environmentMode: "stable",
  thresholdState: "idle",
  rewardMultiplier: 1,
  lastEvent: "idle",
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getTimeDecay(seconds, windowSeconds = 45) {
  return clamp(1 - seconds / windowSeconds, 0, 1);
}

export function getPushYourLuckOutcome({ stressLevel = 0, riskDelta = 0, challengeMatch = false } = {}) {
  const rewardMultiplier = Number((1 + Math.pow(clamp(stressLevel, 0, 100) / 100, 2) * 2.5).toFixed(2));
  const thresholdState = stressLevel >= 92 && riskDelta > 0 && !challengeMatch ? "bust" : stressLevel >= 78 ? "critical" : "building";
  return {
    thresholdState,
    rewardMultiplier,
    busted: thresholdState === "bust",
    environmentMode: thresholdState === "bust" ? "blackout" : "stable",
  };
}

export function getEnvironmentEffect(environmentMode) {
  return environmentMode === "blackout" ? { fatigue: 4, time: -3 } : {};
}

export function reduceDecisionDynamics(state = DYNAMICS_INITIAL_STATE, event = {}) {
  const type = event?.type;
  if (!type) return state;
  if (type === "DECISION_STARTED") {
    return {
      ...DYNAMICS_INITIAL_STATE,
      environmentMode: state.environmentMode === "blackout" ? "reboot" : "stable",
      lastEvent: type,
    };
  }
  if (type === "DECISION_TICK") {
    const timeDecay = getTimeDecay(Number(event.seconds) || 0);
    const comboHeat = Math.min(12, state.combo * 1.5);
    const stressLevel = clamp(Math.round(Math.pow(timeDecay, 1.65) * 100 + comboHeat), 0, 100);
    return {
      ...state,
      timeDecay,
      stressLevel,
      thresholdState: stressLevel >= 92 ? "bust" : stressLevel >= 78 ? "critical" : stressLevel >= 45 ? "building" : "idle",
      lastEvent: type,
    };
  }
  if (type === "CHOICE_STAGED") {
    return { ...state, hiddenChoice: event.choiceId ?? null, lastEvent: type };
  }
  if (type === "CHOICE_COMMITTED") {
    const riskDelta = Number(event.riskDelta) || 0;
    const challengeMatch = Boolean(event.challengeMatch);
    const combo = challengeMatch ? state.combo + 1 : Math.max(0, state.combo - 1);
    const stressLevel = clamp(
      state.stressLevel + (challengeMatch ? -Math.min(18, 8 + combo) : 5 + Math.max(0, riskDelta)),
      0,
      100,
    );
    const outcome = getPushYourLuckOutcome({ stressLevel, riskDelta, challengeMatch });
    return {
      ...state,
      combo,
      stressLevel,
      hiddenChoice: null,
      ...outcome,
      environmentMode: outcome.busted ? "blackout" : state.environmentMode === "blackout" ? "reboot" : outcome.environmentMode,
      lastEvent: type,
    };
  }
  if (type === "CHOICE_CANCELLED") return { ...state, hiddenChoice: null, lastEvent: type };
  return { ...state, lastEvent: type };
}

export function createDynamicsSummary(state) {
  return {
    combo: state.combo,
    stressLevel: state.stressLevel,
    timeDecay: Number(state.timeDecay.toFixed(3)),
    hiddenChoice: Boolean(state.hiddenChoice),
    environmentMode: state.environmentMode,
    thresholdState: state.thresholdState,
    rewardMultiplier: state.rewardMultiplier,
  };
}

export function useDecisionDynamics({ active = true } = {}) {
  const [state, dispatch] = useReducer(reduceDecisionDynamics, DYNAMICS_INITIAL_STATE);
  useEffect(() => {
    if (!active) return undefined;
    dispatch({ type: "DECISION_STARTED" });
    const unsubscribe = onDecisionTick(() => dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() }));
    dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() });
    return unsubscribe;
  }, [active]);
  return { dynamics: state, dynamicsSummary: createDynamicsSummary(state), dispatchDynamics: dispatch };
}
