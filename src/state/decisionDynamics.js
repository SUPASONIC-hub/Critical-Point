import { useEffect, useReducer, useSyncExternalStore } from "react";
import { isResourceGain } from "../gameConstants.js";
import { onDecisionTick, getDecisionSeconds } from "./decisionClock.js";

export const DYNAMICS_INITIAL_STATE = Object.freeze({
  combo: 0,
  stressLevel: 0,
  // The clock burn, and the gauge the player bought on top of it. They are kept
  // apart because the tick recomputes its own term from scratch every second:
  // folded into one number, every press was overwritten within 999ms and the
  // one deliberate act in the loop had a sub-second half-life.
  clockStress: 0,
  heldGauge: 0,
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

/** What one deliberate press of 밀어붙이기 buys, in gauge. */
export const PUSH_STEP = 16;

/**
 * Where the line is, and what a challenge match is worth.
 *
 * A match used to remove the line entirely -- `!challengeMatch` in the bust
 * test -- and the badge that announces one renders on the card unconditionally
 * (`ChoiceList.jsx`), outside `전술 정보`. Between them the player knew, for
 * free and before touching the button, which of two scripts they were in: badge
 * present, press to the ceiling and collect; badge absent, do not press. That is
 * a lookup table, and a push-your-luck bet that resolves before the press is not
 * a bet.
 *
 * The match now moves the line instead of deleting it. It is a real edge -- the
 * difference between 92 and 99 is four presses of room -- and it still runs out,
 * so the greedy read stays punishable and the last press is a decision either
 * way.
 */
const BUST_FLOOR = 92;
const MATCHED_BUST_FLOOR = 99;

export function getPushYourLuckOutcome({ stressLevel = 0, riskDelta = 0, challengeMatch = false } = {}) {
  const rewardMultiplier = Number((1 + Math.pow(clamp(stressLevel, 0, 100) / 100, 2) * 2.5).toFixed(2));
  const bustFloor = challengeMatch ? MATCHED_BUST_FLOOR : BUST_FLOOR;
  const thresholdState = stressLevel >= bustFloor && riskDelta > 0 ? "bust" : stressLevel >= 78 ? "critical" : "building";
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

/**
 * What a reboot is worth, and the one place that says so.
 *
 * The buff is a pure function of how many times the run has been rebooted, so
 * the live reducer and a ledger rebuilt from a saved log cannot disagree about
 * it -- which matters, because the reducer's own state does not survive a
 * reload and the log does.
 */
export const REBOOT_PERMANENT_BONUS = 0.2;

export function getPermanentMultiplier(rebootCount = 0) {
  return Number((1 + Math.max(0, Number(rebootCount) || 0) * REBOOT_PERMANENT_BONUS).toFixed(2));
}

/**
 * The run's push record, rebuilt from the decision log.
 *
 * Read from the log rather than from this module's own state on purpose: the
 * log is what a saved run restores, and the reducer's state is not, so a ledger
 * read off state would zero itself the first time someone resumed.
 */
export function createPressureLedger(log = []) {
  let busts = 0;
  let reboots = 0;
  let bestMultiplier = 1;
  let bonusPoints = 0;
  let pushedDecisions = 0;

  for (const entry of log) {
    const multiplier = Number(entry?.threshold?.rewardMultiplier) || 1;
    if (entry?.threshold?.busted) busts += 1;
    if (entry?.environmentMode === "reboot") reboots += 1;
    if (multiplier > bestMultiplier) bestMultiplier = multiplier;
    if (multiplier <= 1) continue;
    pushedDecisions += 1;
    // The log keeps the multiplied effect, so the bonus is the raw value
    // subtracted back out of it.
    for (const value of Object.values(entry.riskRewardEffect ?? {})) {
      if (value > 0) bonusPoints += value - Math.round(value / multiplier);
    }
  }

  return {
    busts,
    reboots,
    bestMultiplier: Number(bestMultiplier.toFixed(2)),
    bonusPoints,
    pushedDecisions,
    permanentMultiplier: getPermanentMultiplier(reboots),
  };
}

const THRESHOLD_BUST_EFFECT = Object.freeze({ trust: -8, legitimacy: -8, fatigue: 8, time: -4 });

/**
 * The pot, applied. Gains scale with the gauge the player is holding; costs are
 * never discounted, which is the entire shape of the bet.
 *
 * "Gain" is not "positive". `humanCost` and `fatigue` are the two resources
 * where a rising number is the loss, which is the entire reason
 * `isResourceGain` exists -- and this function asked `value > 0` anyway. So the
 * bet paid out backwards on the only axis the fiction is about: holding the
 * gauge to 3.30x turned `humanCost: 18` into 59, and the comment directly above
 * this one promised that could not happen. 255 of the 379 authored effect
 * values are positive, so this was the common case, not an edge.
 *
 * The commit console previews the same numbers this produces, so it lives here
 * rather than in either caller: the console was printing the raw effect while
 * the runtime committed the multiplied one, and every push the player held made
 * that preview more wrong.
 */
export function applyRiskReward(effect = {}, multiplier = 1) {
  return Object.fromEntries(
    Object.entries(effect).map(([key, value]) => [key, isResourceGain(key, value) ? Math.round(value * multiplier) : value]),
  );
}

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
    riskRewardEffect: applyRiskReward(effect, rewardMultiplier),
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
      // A new window starts the player back at zero; the burn is the clock's again.
      const rebooting = base.thresholdState === "bust" || base.environmentMode === "blackout";
      const rebootCount = (Number(base.rebootCount) || 0) + (rebooting ? 1 : 0);
      // Derived from the count rather than incremented, so a ledger rebuilt from
      // the log lands on the same number this state is holding.
      const carried = rebooting ? getPermanentMultiplier(rebootCount) : permanentMultiplier;
      return {
        ...DYNAMICS_INITIAL_STATE,
        environmentMode: rebooting ? "reboot" : "stable",
        permanentMultiplier: carried,
        rewardMultiplier: carried,
        rebootCount,
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
      const clockStress = Math.min(TICK_BURN_CAP, burn * 100) + heat + overtime * OVERTIME_BURN;
      // The clock is a floor under the gauge, not the gauge itself. Anything the
      // player put there -- a press, a staged choice, a cancel -- rides on top of
      // it and survives the next tick, which is what makes a bust theirs.
      const heldGauge = clamp(Number(base.heldGauge) || 0, 0, 100);
      const rawStress = clockStress + heldGauge;
      const stressLevel = clamp(Math.round(rawStress), 0, 100);
      const busted = rawStress >= 100;
      const justBusted = busted && base.thresholdState !== "bust";
      const slowMotion = !busted && stressLevel >= CRITICAL_FLOOR && seconds <= 1;
      const score = justBusted ? Math.floor(anchorScore * 0.5) : anchorScore;
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted, slowMotion });
      return {
        ...base,
        currentTicks,
        clockStress,
        heldGauge: busted ? 0 : heldGauge,
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

    /**
     * The verb this whole system was missing.
     *
     * Stress only ever rose from the clock, from staging a choice (+2) and from
     * cancelling one (+3) -- so "push your luck" was spelled "sit still and do
     * not play," and a bust was the deadline arriving, an event with no author.
     * Balatro's grip is that the player presses the button; the number they were
     * reaching for is still on screen when it goes wrong, and they knew the last
     * press was greedy while their thumb was moving.
     *
     * The press does not resolve anything. It buys gauge, the gauge prices the
     * pot, and committing is still what settles the bet -- which is why the bust
     * test stays where it is, on the commit, and nothing new can bust here.
     */
    case "PUSH_HELD": {
      const heldGauge = clamp((Number(base.heldGauge) || 0) + PUSH_STEP, 0, 100);
      const stressLevel = clamp(Math.round((Number(base.clockStress) || 0) + heldGauge), 0, 100);
      const slowMotion = base.isSlowMotion && stressLevel >= CRITICAL_FLOOR;
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion });
      return {
        ...base,
        stressLevel,
        heldGauge,
        isSlowMotion: slowMotion,
        ...fx,
        // The press has to land harder than the gauge alone would, or the first
        // one at low pressure moves nothing and reads as a dead button.
        shakeIntensity: Math.max(7, fx.shakeIntensity),
        lastDelta: stressLevel - base.stressLevel,
        lastEvent: type,
      };
    }

    case "CHOICE_STAGED": {
      const heldGauge = clamp((Number(base.heldGauge) || 0) + 2, 0, 100);
      const stressLevel = clamp(Math.round((Number(base.clockStress) || 0) + heldGauge), 0, 100);
      const slowMotion = base.isSlowMotion && stressLevel >= CRITICAL_FLOOR;
      const fx = projectPressure({ stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion });
      return {
        ...base,
        hiddenChoice: event.choiceId ?? null,
        stressLevel,
        heldGauge,
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
      // Settle against the gauge the player owns, not against the total. Writing
      // `stressLevel` here and leaving `heldGauge` alone meant the next tick
      // recomputed `clockStress + heldGauge` and threw the relief away inside
      // 999ms -- the same erasure the tick used to do to a press, one case further
      // down this switch, and worse: it fired after the payout had already landed
      // on screen, and it busted the player for the correct read.
      const adjustment = challengeMatch ? heat - relief : penalty;
      const heldGauge = clamp((Number(base.heldGauge) || 0) + adjustment, 0, 140);
      const rawStress = (Number(base.clockStress) || 0) + heldGauge;
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
        heldGauge: busted ? 0 : clamp(heldGauge, 0, 100),
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
      const heldGauge = clamp((Number(base.heldGauge) || 0) + 3, 0, 100);
      const stressLevel = clamp(Math.round((Number(base.clockStress) || 0) + heldGauge), 0, 100);
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

/**
 * The press, delivered without threading a dispatcher through four components.
 *
 * The reducer lives in a `useReducer` inside the runtime, and the button that
 * feeds it sits in the commit console, four prop hops away past a view contract
 * that `check:views` pins. The clock already reaches the same reducer this way
 * -- `onDecisionTick` -- so the press uses the road that is already built.
 */
const pushListeners = new Set();

export function onPushHeld(listener) {
  pushListeners.add(listener);
  return () => pushListeners.delete(listener);
}

/** Ask the live decision window for one step of gauge. No-op between windows. */
export function requestPushHeld() {
  for (const listener of [...pushListeners]) listener();
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
    const unsubscribePush = onPushHeld(() => dispatch({ type: "PUSH_HELD" }));
    dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() });
    return () => {
      unsubscribe();
      unsubscribePush();
    };
  }, [active]);
  return { dynamics: state, dynamicsSummary: createDynamicsSummary(state), dispatchDynamics: dispatch };
}
