import { useEffect, useReducer, useSyncExternalStore } from "react";
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
  cashedMultiplier: 0,
  heat: 0,
  vignette: 0,
  heartbeatBpm: 58,
  overdrive: false,
  rebootCount: 0,
  banked: 0,
  lastDelta: 0,
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

const THRESHOLD_BUST_EFFECT = Object.freeze({ trust: -8, legitimacy: -8, fatigue: 8, time: -4 });

/**
 * Everything a committed choice owes to the pressure system, settled in one
 * place from one verdict.
 *
 * The runtime used to score this itself, with its own copy of the threshold
 * formula read against the gauge as it stood *before* the commit. So the run's
 * resources, the screen's vignette and the state machine's own branch could each
 * name a different moment as the critical point, and the reward multiplier was
 * priced off a gauge that had not yet paid. Running the real event through the
 * pure reducer settles all three, and the caller dispatches the same
 * `commitEvent` to move the store to the state this verdict already describes.
 */
export function resolveDecisionCommit({ dynamics, challengeMatch, riskDelta = 0, seconds, effect = {} } = {}) {
  const commitEvent = { type: "CHOICE_COMMITTED", challengeMatch: Boolean(challengeMatch), riskDelta, seconds };
  const verdict = reduceDecisionDynamics(dynamics, commitEvent);
  // Busting cashes nothing, so the pot stops multiplying and the threshold
  // penalty is what the turn pays.
  const rewardMultiplier = verdict.cashedMultiplier || 1;
  return {
    commitEvent,
    verdict,
    thresholdState: verdict.thresholdState,
    rewardMultiplier,
    riskRewardEffect: Object.fromEntries(
      Object.entries(effect).map(([key, value]) => [key, value > 0 ? Math.round(value * rewardMultiplier) : value]),
    ),
    environmentEffect: getEnvironmentEffect(dynamics?.environmentMode),
    thresholdEffect: verdict.thresholdState === "bust" ? { ...THRESHOLD_BUST_EFFECT } : {},
    environmentMode: verdict.environmentMode,
  };
}

/**
 * The whole feel of a decision window lives in the reducer below.
 *
 * `event.seconds` is always REMAINING window time -- decisionClock counts down
 * and keeps counting past zero so overtime stays billable -- so pressure is read
 * off elapsed ticks instead of a linear drain. The burn curve is an exponential
 * normalised to land on exactly 1.0 at the deadline: the first twenty seconds
 * barely move the gauge, the last two evaporate it.
 */
const DECISION_WINDOW_SECONDS = 45;
const DEATH_CURVE_K = 0.15;
const DEATH_CURVE_SPAN = Math.exp(DEATH_CURVE_K * DECISION_WINDOW_SECONDS) - 1;
const COMBO_BACKLASH_K = 1.5;
const CRITICAL_FLOOR = 90;
const OVERDRIVE_FLOOR = 78;
const OVERTIME_BURN = 14;
// The clock alone tops out just under bust: the last four points are always paid
// by a combo you refused to cash or by overtime you chose to burn.
const TICK_BURN_CAP = 96;
const BASE_PAYOUT = 120;

function getDeathBurn(elapsedTicks) {
  const ticks = clamp(Number(elapsedTicks) || 0, 0, DECISION_WINDOW_SECONDS);
  return clamp((Math.exp(DEATH_CURVE_K * ticks) - 1) / DEATH_CURVE_SPAN, 0, 1);
}

/** A streak is a loan: it multiplies the gauge it is riding on. */
function getComboBacklash(combo, burn = 0) {
  const streak = Math.max(0, Number(combo) || 0);
  return streak * streak * COMBO_BACKLASH_K * (1 + clamp(Number(burn) || 0, 0, 1));
}

function readSeconds(event, fallback = DECISION_WINDOW_SECONDS) {
  const raw = Number(event?.seconds);
  return Number.isFinite(raw) ? raw : fallback;
}

/** Every branch renders the same presentation payload from the same numbers. */
function projectPressure({ stressLevel, combo, permanentMultiplier, busted, slowMotion }) {
  const ratio = clamp(Number(stressLevel) || 0, 0, 100) / 100;
  return {
    rewardMultiplier: Number(((1 + Math.pow(ratio, 2) * 2.5) * permanentMultiplier).toFixed(2)),
    vignette: Number(Math.pow(ratio, 1.6).toFixed(3)),
    heartbeatBpm: Math.round(58 + ratio * 72 + Math.max(0, Number(combo) || 0) * 4),
    overdrive: !busted && ratio * 100 >= OVERDRIVE_FLOOR,
    shakeIntensity: busted ? 20 : slowMotion ? 8 : Math.round(ratio * 9),
  };
}

export function reduceDecisionDynamics(state = DYNAMICS_INITIAL_STATE, event = {}) {
  const base = { ...DYNAMICS_INITIAL_STATE, ...state };
  const type = event?.type;
  if (!type) return base;

  const permanentMultiplier = Number(base.permanentMultiplier) || 1;
  const incomingScore = Number(event.score);
  const anchorScore = Number.isFinite(incomingScore) ? incomingScore : Number(base.score) || 0;

  switch (type) {
    case "DECISION_STARTED": {
      const rebooting = base.thresholdState === "bust" || base.environmentMode === "blackout";
      const carried = rebooting ? Number((permanentMultiplier + 0.2).toFixed(2)) : permanentMultiplier;
      return {
        ...DYNAMICS_INITIAL_STATE,
        environmentMode: rebooting ? "reboot" : "stable",
        permanentMultiplier: carried,
        rewardMultiplier: carried,
        rebootCount: (Number(base.rebootCount) || 0) + (rebooting ? 1 : 0),
        banked: Number(base.banked) || 0,
        score: rebooting ? 0 : anchorScore,
        lastEvent: rebooting ? "REBOOT" : type,
      };
    }

    case "DECISION_TICK": {
      const seconds = readSeconds(event);
      // The clock is the source of truth while it is still running; a tick that
      // arrives before the window starts falls back to counting itself, so an
      // unstarted window cannot report a full burn and bust on mount.
      const clockTicks = DECISION_WINDOW_SECONDS - seconds;
      const proposedTicks = Number(event.currentTicks ?? (seconds > 0 ? clockTicks : (Number(base.currentTicks) || 0) + 1));
      const currentTicks = Math.max(0, Number.isFinite(proposedTicks) ? proposedTicks : 0);
      const overtime = Math.max(0, -seconds);
      const burn = getDeathBurn(currentTicks);
      const heat = getComboBacklash(base.combo, burn);
      const rawStress = Math.min(TICK_BURN_CAP, burn * 100) + heat + overtime * OVERTIME_BURN;
      const stressLevel = clamp(Math.round(rawStress), 0, 100);
      const busted = rawStress >= 100;
      const justBusted = busted && base.thresholdState !== "bust";
      const slowMotion = !busted && stressLevel >= CRITICAL_FLOOR && seconds <= 1;
      const score = justBusted ? Math.floor(anchorScore * 0.5) : anchorScore;
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted, slowMotion });
      return {
        ...base,
        currentTicks,
        timeDecay: Number(burn.toFixed(3)),
        heat: Number(heat.toFixed(2)),
        stressLevel,
        combo: justBusted ? 0 : base.combo,
        thresholdState: busted ? "bust" : stressLevel >= CRITICAL_FLOOR ? "critical" : stressLevel > 0 ? "building" : "idle",
        environmentMode: busted ? "blackout" : base.environmentMode === "blackout" ? "reboot" : base.environmentMode,
        score,
        lastDelta: score - anchorScore,
        isSlowMotion: slowMotion,
        isBlind: busted,
        ...fx,
        permanentMultiplier,
        lastEvent: justBusted ? "BUST" : type,
      };
    }

    case "CHOICE_STAGED": {
      const stressLevel = clamp(base.stressLevel + 2, 0, 100);
      const slowMotion = base.isSlowMotion && stressLevel >= CRITICAL_FLOOR;
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion });
      return {
        ...base,
        hiddenChoice: event.choiceId ?? null,
        stressLevel,
        isSlowMotion: slowMotion,
        ...fx,
        shakeIntensity: Math.max(4, fx.shakeIntensity),
        lastDelta: 0,
        lastEvent: type,
      };
    }

    case "CHOICE_COMMITTED": {
      const riskDelta = Number(event.riskDelta) || 0;
      const challengeMatch = Boolean(event.challengeMatch);
      const seconds = readSeconds(event, DECISION_WINDOW_SECONDS - (Number(base.currentTicks) || 0));
      const priorBacklash = getComboBacklash(base.combo, base.timeDecay);
      const combo = challengeMatch ? Math.max(0, Number(base.combo) || 0) + 1 : 0;
      const heat = getComboBacklash(combo, base.timeDecay);
      const relief = 12 + combo * 2;
      // A miss bills the streak it broke: the higher the combo, the worse the fall.
      const penalty = 16 + Math.max(0, riskDelta) * 3 + priorBacklash;
      const rawStress = clamp(base.stressLevel + (challengeMatch ? heat - relief : penalty), 0, 140);
      const stressLevel = clamp(Math.round(rawStress), 0, 100);
      const outcome = getPushYourLuckOutcome({ stressLevel, riskDelta, challengeMatch });
      const busted = rawStress >= 100 || outcome.busted;
      const slowMotion = !busted && stressLevel >= CRITICAL_FLOOR && seconds <= 1;
      const fx = projectPressure({ stressLevel, combo, permanentMultiplier, busted, slowMotion });
      // Price the commit off the gauge the player carried in, not the one left
      // after it vents. Cashing at 94% used to pay the post-vent multiplier,
      // which quietly made pushing your luck worth less than not pushing it.
      const carried = projectPressure({ stressLevel: base.stressLevel, combo: base.combo, permanentMultiplier, busted: false, slowMotion: false });
      const cashedMultiplier = busted ? 0 : carried.rewardMultiplier;
      const payout = challengeMatch && !busted ? Math.round(BASE_PAYOUT * cashedMultiplier * (1 + combo * 0.35)) : 0;
      const score = busted ? Math.floor(anchorScore * 0.5) : anchorScore + payout;
      return {
        ...base,
        combo: busted ? 0 : combo,
        cashedMultiplier,
        heat: busted ? 0 : Number(heat.toFixed(2)),
        stressLevel,
        hiddenChoice: null,
        thresholdState: busted ? "bust" : stressLevel >= CRITICAL_FLOOR ? "critical" : outcome.thresholdState,
        environmentMode: busted ? "blackout" : base.environmentMode === "blackout" ? "reboot" : outcome.environmentMode,
        score,
        banked: busted ? Number(base.banked) || 0 : (Number(base.banked) || 0) + payout,
        lastDelta: score - anchorScore,
        isSlowMotion: slowMotion,
        isBlind: busted,
        ...fx,
        shakeIntensity: busted ? 20 : Math.max(fx.shakeIntensity, challengeMatch ? 6 : 10),
        permanentMultiplier,
        lastEvent: busted ? "BUST" : type,
      };
    }

    case "CHOICE_CANCELLED": {
      const stressLevel = clamp(base.stressLevel + 3, 0, 100);
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion: false });
      return { ...base, hiddenChoice: null, stressLevel, isSlowMotion: false, ...fx, lastDelta: 0, lastEvent: type };
    }

    default:
      return { ...base, lastEvent: type };
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
    currentTicks: state.currentTicks,
    score: state.score,
    isSlowMotion: state.isSlowMotion,
    isBlind: state.isBlind,
    shakeIntensity: state.shakeIntensity,
    permanentMultiplier: state.permanentMultiplier,
    cashedMultiplier: state.cashedMultiplier,
    heat: state.heat,
    vignette: state.vignette,
    heartbeatBpm: state.heartbeatBpm,
    overdrive: state.overdrive,
    rebootCount: state.rebootCount,
    banked: state.banked,
    lastDelta: state.lastDelta,
  };
}

/**
 * Presentation broadcast for the pressure numbers.
 *
 * The feedback layer paints from the reducer, but it hangs off the play screen,
 * five props deep in a 150-key view bag that a contract check keeps honest. Rather
 * than thread nine display fields through that bag -- and re-render the screen on
 * every tick to do it -- the pressure snapshot is published here and read with
 * `useSyncExternalStore`, exactly how decisionClock keeps the countdown out of
 * root state. Only the layer subscribes, so only the layer wakes per second.
 */
const PRESSURE_FIELDS = [
  "stressLevel",
  "thresholdState",
  "environmentMode",
  "combo",
  "rewardMultiplier",
  "vignette",
  "heartbeatBpm",
  "shakeIntensity",
  "overdrive",
  "isSlowMotion",
  "isBlind",
  "lastDelta",
  "timeDecay",
];

function projectSnapshot(state) {
  const snapshot = {};
  for (const field of PRESSURE_FIELDS) snapshot[field] = state[field];
  return Object.freeze(snapshot);
}

export const PRESSURE_IDLE_SNAPSHOT = projectSnapshot(DYNAMICS_INITIAL_STATE);

let pressureSnapshot = PRESSURE_IDLE_SNAPSHOT;
const pressureListeners = new Set();

function subscribePressure(listener) {
  pressureListeners.add(listener);
  return () => pressureListeners.delete(listener);
}

export function getPressureSnapshot() {
  return pressureSnapshot;
}

function getIdlePressure() {
  return PRESSURE_IDLE_SNAPSHOT;
}

/**
 * `useSyncExternalStore` re-reads on every notify and tears down if the snapshot
 * is a fresh object each time, so an unchanged tick has to return the identical
 * reference rather than an equal one.
 */
export function publishPressure(state) {
  for (const field of PRESSURE_FIELDS) {
    if (pressureSnapshot[field] !== state[field]) {
      pressureSnapshot = projectSnapshot(state);
      for (const listener of [...pressureListeners]) listener();
      return pressureSnapshot;
    }
  }
  return pressureSnapshot;
}

export function usePressure() {
  return useSyncExternalStore(subscribePressure, getPressureSnapshot, getIdlePressure);
}

export function useDecisionDynamics({ active = true } = {}) {
  const [state, dispatch] = useReducer(reduceDecisionDynamics, DYNAMICS_INITIAL_STATE);
  useEffect(() => {
    publishPressure(state);
  }, [state]);
  useEffect(() => {
    if (!active) return undefined;
    dispatch({ type: "DECISION_STARTED" });
    const unsubscribe = onDecisionTick(() => dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() }));
    dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() });
    return unsubscribe;
  }, [active]);
  return { dynamics: state, dynamicsSummary: createDynamicsSummary(state), dispatchDynamics: dispatch };
}
