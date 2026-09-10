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
  currentTicks: 0,
  score: 0,
  isSlowMotion: false,
  isBlind: false,
  shakeIntensity: 0,
  permanentMultiplier: 1,
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
  if (!type) return { ...DYNAMICS_INITIAL_STATE, ...state };
  const score = Number.isFinite(Number(event.score)) ? Number(event.score) : Number(state.score) || 0;
  const permanentMultiplier = Number(state.permanentMultiplier) || 1;

  if (type === "DECISION_STARTED") {
    const isReboot = state.thresholdState === "bust" || state.environmentMode === "blackout";
    return {
      ...DYNAMICS_INITIAL_STATE,
      environmentMode: isReboot ? "reboot" : "stable",
      permanentMultiplier: isReboot ? Number((permanentMultiplier + 0.2).toFixed(2)) : permanentMultiplier,
      lastEvent: isReboot ? "REBOOT" : type,
    };
  }

  if (type === "DECISION_TICK") {
    const currentTicks = Math.max(0, Number(event.currentTicks ?? state.currentTicks + 1) || 0);
    const seconds = Math.max(0, Number(event.seconds) || 0);
    const rawDecay = getTimeDecay(seconds);
    const deathDecay = Math.exp(currentTicks * 0.15);
    const timeDecay = clamp(rawDecay * deathDecay, 0, 1);
    const comboBacklash = Math.pow(Math.max(0, Number(state.combo) || 0), 2) * 1.5;
    const stressLevel = clamp(Math.round(timeDecay * 100 + comboBacklash), 0, 100);
    const isSlowMotion = stressLevel >= 90 && seconds < 1;
    const thresholdState = stressLevel >= 100 ? "bust" : stressLevel >= 90 ? "critical" : stressLevel > 0 ? "building" : "idle";
    return {
      ...state,
      currentTicks,
      timeDecay,
      stressLevel,
      thresholdState,
      isSlowMotion,
      isBlind: thresholdState === "bust",
      shakeIntensity: thresholdState === "bust" ? 20 : isSlowMotion ? 8 : 0,
      score,
      permanentMultiplier,
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
    const comboBacklash = Math.pow(Math.max(0, combo), 2) * 1.5;
    const stressLevel = clamp(state.stressLevel + (challengeMatch ? -Math.min(18, 8 + combo) : 5 + Math.max(0, riskDelta)) + comboBacklash, 0, 100);
    const outcome = getPushYourLuckOutcome({ stressLevel, riskDelta, challengeMatch });
    const busted = stressLevel >= 100 || outcome.busted;
    return {
      ...state,
      combo,
      stressLevel,
      hiddenChoice: null,
      ...outcome,
      thresholdState: busted ? "bust" : stressLevel >= 90 ? "critical" : outcome.thresholdState,
      environmentMode: busted ? "blackout" : state.environmentMode === "blackout" ? "reboot" : outcome.environmentMode,
      score: busted ? Math.floor(score * 0.5) : Math.floor(score * outcome.rewardMultiplier * permanentMultiplier),
      isSlowMotion: !busted && stressLevel >= 90 && Number(event.seconds) < 1,
      isBlind: busted,
      shakeIntensity: busted ? 20 : stressLevel >= 90 ? 8 : 0,
      permanentMultiplier,
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
    currentTicks: state.currentTicks,
    score: state.score,
    isSlowMotion: state.isSlowMotion,
    isBlind: state.isBlind,
    shakeIntensity: state.shakeIntensity,
    permanentMultiplier: state.permanentMultiplier,
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
