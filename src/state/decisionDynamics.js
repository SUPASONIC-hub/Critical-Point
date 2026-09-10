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
  switch (event.type) {
    case "DECISION_STARTED":
      return { ...DYNAMICS_INITIAL_STATE, environmentMode: state.environmentMode, lastEvent: event.type };
    case "DECISION_TICK": {
      const timeDecay = getTimeDecay(event.seconds);
      return {
        ...state,
        timeDecay,
        stressLevel: clamp(Math.round(timeDecay * 100), 0, 100),
        lastEvent: event.type,
      };
    }
    case "CHOICE_STAGED":
      return { ...state, hiddenChoice: event.choiceId ?? null, lastEvent: event.type };
    case "CHOICE_COMMITTED": {
      const combo = event.challengeMatch ? state.combo + 1 : 0;
      const stressLevel = clamp(state.stressLevel + (event.challengeMatch ? -8 : 4), 0, 100);
      const outcome = getPushYourLuckOutcome({ stressLevel: state.stressLevel, riskDelta: event.riskDelta, challengeMatch: event.challengeMatch });
      return { ...state, combo, stressLevel, hiddenChoice: null, ...outcome, lastEvent: event.type };
    }
    case "CHOICE_CANCELLED":
      return { ...state, hiddenChoice: null, lastEvent: event.type };
    default:
      return state;
  }
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
