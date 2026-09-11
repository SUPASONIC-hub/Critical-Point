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
  // BUST_FLOOR_MAX - PUSH_STEP_MAX and - PUSH_STEP_MAX * 2, written out because
  // both constants are declared below this object. The widest wall, so the
  // opening frame of a scene never claims more room than the drawn wall has.
  criticalFloor: 75,
  overdriveFloor: 54,
  clockStress: 0,
  heldGauge: 0,
  windowIndex: 0,
  // What the run owes the wall. A bust adds to it; a window closed without one
  // pays it back down. `rebootCount` cannot do this job -- it is the permanent
  // multiplier's counter and must only ever rise -- and using it to walk the wall
  // down made the ratchet a one-way trip: measured over a 42-window season, one
  // press committed with twenty seconds to spare busted 20 times and left the
  // wall pinned at its fatal floor, because each bust made the next one likelier
  // and nothing could undo it.
  wallDebt: 0,
  bustFloor: 96,
  pressCount: 0,
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
const NUMERIC_DYNAMICS_FIELDS = [
  "combo",
  "stressLevel",
  "criticalFloor",
  "overdriveFloor",
  "clockStress",
  "heldGauge",
  "windowIndex",
  "wallDebt",
  "bustFloor",
  "pressCount",
  "timeDecay",
  "rewardMultiplier",
  "currentTicks",
  "score",
  "shakeIntensity",
  "permanentMultiplier",
  "cashedMultiplier",
  "heat",
  "vignette",
  "heartbeatBpm",
  "rebootCount",
  "banked",
  "lastDelta",
];
const BOOLEAN_DYNAMICS_FIELDS = ["isSlowMotion", "isBlind", "overdrive"];
const ENVIRONMENT_MODES = new Set(["stable", "blackout", "reboot"]);
const THRESHOLD_STATES = new Set(["idle", "building", "critical", "bust"]);

export function normalizeDecisionDynamicsState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return DYNAMICS_INITIAL_STATE;
  const next = { ...DYNAMICS_INITIAL_STATE };
  for (const field of NUMERIC_DYNAMICS_FIELDS) {
    const numeric = Number(value[field]);
    if (Number.isFinite(numeric)) next[field] = numeric;
  }
  for (const field of BOOLEAN_DYNAMICS_FIELDS) {
    if (typeof value[field] === "boolean") next[field] = value[field];
  }
  next.combo = Math.max(0, Math.trunc(next.combo));
  next.stressLevel = clamp(Math.round(next.stressLevel), 0, 100);
  next.criticalFloor = clamp(Math.round(next.criticalFloor), 1, 100);
  next.overdriveFloor = clamp(Math.round(next.overdriveFloor), 1, 100);
  next.clockStress = clamp(next.clockStress, 0, 180);
  next.heldGauge = clamp(next.heldGauge, 0, 140);
  next.windowIndex = Math.max(0, Math.trunc(next.windowIndex));
  next.wallDebt = clamp(Math.trunc(next.wallDebt), 0, MAX_WALL_DEBT);
  next.bustFloor = clamp(Math.round(next.bustFloor), BUST_FLOOR_FATAL, BUST_FLOOR_MAX);
  next.pressCount = Math.max(0, Math.trunc(next.pressCount));
  next.timeDecay = clamp(next.timeDecay, 0, 1);
  next.rewardMultiplier = clamp(next.rewardMultiplier, 1, 8);
  next.currentTicks = Math.max(0, Math.trunc(next.currentTicks));
  next.shakeIntensity = clamp(next.shakeIntensity, 0, 24);
  next.permanentMultiplier = clamp(next.permanentMultiplier, 1, MAX_PERMANENT_MULTIPLIER);
  next.cashedMultiplier = Math.max(0, next.cashedMultiplier);
  next.heat = Math.max(0, next.heat);
  next.vignette = clamp(next.vignette, 0, 1);
  next.heartbeatBpm = clamp(Math.round(next.heartbeatBpm), 40, 180);
  next.rebootCount = Math.max(0, Math.trunc(next.rebootCount));
  next.banked = Math.max(0, Math.round(next.banked));
  next.hiddenChoice = typeof value.hiddenChoice === "string" ? value.hiddenChoice : null;
  next.environmentMode = ENVIRONMENT_MODES.has(value.environmentMode) ? value.environmentMode : DYNAMICS_INITIAL_STATE.environmentMode;
  next.thresholdState = THRESHOLD_STATES.has(value.thresholdState) ? value.thresholdState : DYNAMICS_INITIAL_STATE.thresholdState;
  next.lastEvent = typeof value.lastEvent === "string" ? value.lastEvent.slice(0, 48) : DYNAMICS_INITIAL_STATE.lastEvent;
  return next;
}

export function serializeDecisionDynamicsState(value) {
  const state = normalizeDecisionDynamicsState(value);
  return Object.fromEntries(Object.keys(DYNAMICS_INITIAL_STATE).map((key) => [key, state[key]]));
}

/**
 * What one press of 밀어붙인다 buys, and why it is not a constant.
 *
 * It was 16, and a constant step is what made the moving wall almost pointless:
 * the gauge could only ever land on `clockStress + 16n`, a grid of six rungs, and
 * a band of 80-96 sits between two of them for most of a window. Measured against
 * a fixed wall at 92, a drawn wall changed the outcome of a press in 4% of
 * windows at ten seconds elapsed and 17% at twenty. The uncertainty was real and
 * almost never reachable.
 *
 * A press worth somewhere between 11 and 21 puts the gauge on a grid the player
 * cannot see the rungs of, and the wall starts mattering everywhere rather than
 * at one rung. Seeded on the window and the press index for the same reason the
 * wall is: replay links and the six-thousand-season balance suite both have to
 * draw the same numbers twice.
 */
const PUSH_STEP_MIN = 11;
const PUSH_STEP_MAX = 21;

/** The centre of the band, for callers that need one number to reason about. */
export const PUSH_STEP = 16;

export function drawPushStep(seed) {
  const state = (Math.imul(hashSeed(seed) || 1, 1664525) + 1013904223) >>> 0;
  return PUSH_STEP_MIN + Math.round((state / 4294967296) * (PUSH_STEP_MAX - PUSH_STEP_MIN));
}

/**
 * Where the line is, and what a challenge match is worth.
 *
 * A match used to remove the line entirely, and the badge announcing one printed
 * free on the card, so the player knew before touching the button which of two
 * scripts they were in. The match moves the line now instead of deleting it.
 *
 * The line itself moves too, and that is the part that makes the press a bet
 * rather than arithmetic. `PUSH_STEP` is a constant, the gauge is printed every
 * frame as `STRESS {n}%`, and the multiplier is printed on the button -- with a
 * fixed wall, a player could compute at any moment exactly how many presses were
 * free and stop one short, every time, forever. A window draws its own floor
 * from a band a press wide, so standing at 88 is a genuine question: the wall is
 * somewhere in here, and the only way to find out is to commit.
 *
 * The draw is seeded, not random. Replay links restore a scene from a seed and
 * the balance suite replays thousands of seasons; a `Math.random()` here would
 * make both non-reproducible. Same seed, same wall.
 */
const BUST_FLOOR_MIN = 80;
/** However many times a run has blown up, the wall never comes closer than this. */
const BUST_FLOOR_FATAL = 52;
const BUST_FLOOR_MAX = 96;

function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * The wall for one decision window. Stable for a given window, unknown to the
 * player, and closer every time they have blown up.
 *
 * `REBOOT_PERMANENT_BONUS` gives a rebooted run +0.2x forever, which made a
 * deliberate bust a *strategy* rather than a comeback: measured over forty
 * windows, busting every fourth banked 22,114 against 13,587 for never busting
 * at all -- 63% more, because the multiplier compounds and the bill is one
 * window. The bonus is real and it should be; what it cannot be is free. Each
 * reboot takes `REBOOT_FLOOR_COST` off both ends of the band, so the run that
 * bought the multiplier has less room to use it, and farming reboots walks the
 * wall down towards the gauge instead of away from it.
 */
const REBOOT_FLOOR_COST = 8;
/** Past this the fatal floor clamps anyway, and more debt is only a longer climb back. */
const MAX_WALL_DEBT = 6;

export function drawBustFloor(seed, wallDebt = 0) {
  const state = (Math.imul(hashSeed(seed) || 1, 1664525) + 1013904223) >>> 0;
  const drawn = BUST_FLOOR_MIN + Math.round((state / 4294967296) * (BUST_FLOOR_MAX - BUST_FLOOR_MIN));
  const cost = Math.max(0, Number(wallDebt) || 0) * REBOOT_FLOOR_COST;
  return Math.max(BUST_FLOOR_FATAL, drawn - cost);
}

export function getPushYourLuckOutcome({ stressLevel = 0, bustFloor = BUST_FLOOR_MAX } = {}) {
  const rewardMultiplier = Number((1 + Math.pow(clamp(stressLevel, 0, 100) / 100, 2) * 2.5).toFixed(2));
  const floor = bustFloor;
  const thresholdState = stressLevel >= floor ? "bust" : stressLevel >= 78 ? "critical" : "building";
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

const MAX_PERMANENT_MULTIPLIER = 2;

export function getPermanentMultiplier(rebootCount = 0) {
  const earned = 1 + Math.max(0, Number(rebootCount) || 0) * REBOOT_PERMANENT_BONUS;
  return Number(Math.min(MAX_PERMANENT_MULTIPLIER, earned).toFixed(2));
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
  let bestMultiplier = 1;
  let bonusPoints = 0;
  let pushedDecisions = 0;

  for (const entry of log) {
    const multiplier = Number(entry?.threshold?.rewardMultiplier) || 1;
    if (entry?.threshold?.busted) busts += 1;
    if (multiplier > bestMultiplier) bestMultiplier = multiplier;
    if (multiplier <= 1) continue;
    pushedDecisions += 1;
    // The log keeps the multiplied effect, so the bonus is the raw value
    // subtracted back out of it.
    for (const value of Object.values(entry.riskRewardEffect ?? {})) {
      if (value > 0) bonusPoints += value - Math.round(value / multiplier);
    }
  }

  // A reboot is what a bust becomes at the top of the next window, so the log
  // has exactly as many of one as the other. This used to count entries whose
  // `environmentMode` read "reboot" -- a value no commit can ever write, because
  // `DECISION_STARTED` turns blackout into reboot before the next commit runs
  // and a second commit inside a busted window is still blackout. So the panel
  // built to price the bust reported x1 and "리부트 0회" to a player who had just
  // blown up twice, and told them, in the sentence below its own heading, that
  // they had never blown up at all.
  const reboots = busts;

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
const DEATH_CURVE_K = 0.09;
const DEATH_CURVE_SPAN = Math.exp(DEATH_CURVE_K * DECISION_WINDOW_SECONDS) - 1;
const COMBO_BACKLASH_K = 3.4;
/**
 * The warning lights, expressed against the wall rather than against 100.
 *
 * They were constants -- CRITICAL at 90, OVERDRIVE at 78 -- while the wall is
 * drawn in 80..96 and walks down 8 a reboot to a floor of 52. So from one reboot
 * on, 100% of windows had their wall below the OVERDRIVE band: the gauge read
 * `BUILDING` and `61%` and then the run ended. The player could not feel it
 * coming because nothing on screen was wired to the thing that was coming.
 */
/*
 * Measured in presses, not in percent.
 *
 * Ratios looked right and could not work. On an exponential burn the lead time
 * a ratio buys is `ln(1/ratio)/k` -- a constant, the same 1.49s at a wall of 96
 * and at a wall of 52, one or two frames at 1Hz. And a ratio band is a fraction
 * of the wall, so the red band was `0.08 x wall` = 4 to 8 points: narrower than
 * `PUSH_STEP_MIN` at all 45 wall values, which means a press could never land
 * inside it. 15.3% of presses that crossed the wall skipped every warning band
 * in one step, going BUILDING -> dead.
 *
 * The bands are widths in gauge now, sized to the thing that moves the gauge:
 * red is one full press below the wall, amber is two. Whatever the wall is,
 * a player standing in the clear cannot reach it without passing through both.
 */
function criticalFloorFor(wall) {
  return Math.max(1, Math.round((Number(wall) || BUST_FLOOR_MAX) - PUSH_STEP_MAX));
}

function overdriveFloorFor(wall) {
  return Math.max(1, Math.round((Number(wall) || BUST_FLOOR_MAX) - PUSH_STEP_MAX * 2));
}
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
  return streak * COMBO_BACKLASH_K * (1 + clamp(Number(burn) || 0, 0, 1));
}

function readSeconds(event, fallback = DECISION_WINDOW_SECONDS) {
  const raw = Number(event?.seconds);
  return Number.isFinite(raw) ? raw : fallback;
}

/** Every branch renders the same presentation payload from the same numbers. */
function projectPressure({ stressLevel, combo, permanentMultiplier, busted, slowMotion, bustFloor = BUST_FLOOR_MAX }) {
  const ratio = clamp(Number(stressLevel) || 0, 0, 100) / 100;
  return {
    criticalFloor: criticalFloorFor(bustFloor),
    overdriveFloor: overdriveFloorFor(bustFloor),
    rewardMultiplier: Number(((1 + Math.pow(ratio, 2) * 2.5) * permanentMultiplier).toFixed(2)),
    vignette: Number(Math.pow(ratio, 1.6).toFixed(3)),
    heartbeatBpm: Math.round(58 + ratio * 72 + Math.max(0, Number(combo) || 0) * 4),
    overdrive: !busted && ratio * 100 >= overdriveFloorFor(bustFloor),
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
    case "RESET_DYNAMICS":
      return normalizeDecisionDynamicsState(event.state);

    case "DECISION_STARTED": {
      // A new window starts the player back at zero; the burn is the clock's again.
      const rebooting = base.thresholdState === "bust" || base.environmentMode === "blackout";
      const rebootCount = (Number(base.rebootCount) || 0) + (rebooting ? 1 : 0);
      // Derived from the count rather than incremented, so a ledger rebuilt from
      // the log lands on the same number this state is holding.
      const carried = rebooting ? getPermanentMultiplier(rebootCount) : permanentMultiplier;
      // Every window draws its own wall. The counter is what makes two windows in
      // one run differ; `rebootCount` and `banked` are what make two runs differ.
      const windowIndex = (Number(base.windowIndex) || 0) + 1;
      const wallDebt = Math.max(0, Number(base.wallDebt) || 0);
      return {
        ...DYNAMICS_INITIAL_STATE,
        windowIndex,
        wallDebt,
        bustFloor: drawBustFloor(`${rebootCount}:${windowIndex}:${Number(base.banked) || 0}`, wallDebt),
        environmentMode: rebooting ? "reboot" : "stable",
        permanentMultiplier: carried,
        rewardMultiplier: carried,
        rebootCount,
        // A streak is the one thing a window was supposed to inherit, and this
        // branch spread the initial state over it -- so `combo` was 0 in every
        // tick and every commit, `getComboBacklash` returned 0 forever,
        // COMBO_BACKLASH_K was inert, the `heat` term in the burn was multiplied
        // by zero, and the COMBO chip could only ever read x1. A reboot is still
        // what breaks a streak; a new scene is not.
        combo: rebooting ? 0 : Number(base.combo) || 0,
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
      const wall = Number(base.bustFloor) || BUST_FLOOR_MAX;
      const busted = rawStress >= wall || Boolean(base.isBlind);
      const stressLevel = base.isBlind ? base.stressLevel : clamp(Math.round(rawStress), 0, 100);
      const justBusted = busted && base.thresholdState !== "bust";
      const slowMotion = !busted && stressLevel >= criticalFloorFor(base.bustFloor) && seconds <= 1;
      const score = justBusted ? Math.floor(anchorScore * 0.5) : anchorScore;
      const fx = projectPressure({ bustFloor: Number(base.bustFloor) || BUST_FLOOR_MAX, stressLevel, combo: base.combo, permanentMultiplier, busted, slowMotion });
      return {
        ...base,
        currentTicks,
        clockStress,
        heldGauge: busted ? Math.max(0, stressLevel - clockStress) : heldGauge,
        wallDebt: justBusted ? Math.min(MAX_WALL_DEBT, (Number(base.wallDebt) || 0) + 1) : Number(base.wallDebt) || 0,
        timeDecay: Number(burn.toFixed(3)),
        heat: Number(heat.toFixed(2)),
        stressLevel,
        combo: justBusted ? 0 : base.combo,
        thresholdState: busted ? "bust" : stressLevel >= criticalFloorFor(base.bustFloor) ? "critical" : stressLevel > 0 ? "building" : "idle",
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
      const pressCount = (Number(base.pressCount) || 0) + 1;
      const step = drawPushStep(`${base.rebootCount}:${base.windowIndex}:${pressCount}`);
      const heldGauge = clamp((Number(base.heldGauge) || 0) + step, 0, 100);
      const stressLevel = clamp(Math.round((Number(base.clockStress) || 0) + heldGauge), 0, 100);
      const slowMotion = base.isSlowMotion && stressLevel >= criticalFloorFor(base.bustFloor);
      const fx = projectPressure({ bustFloor: Number(base.bustFloor) || BUST_FLOOR_MAX, stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion });
      return {
        ...base,
        stressLevel,
        heldGauge,
        pressCount,
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
      const slowMotion = base.isSlowMotion && stressLevel >= criticalFloorFor(base.bustFloor);
      const fx = projectPressure({ bustFloor: Number(base.bustFloor) || BUST_FLOOR_MAX, stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion });
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
      // Capped to the amber band. The bands are sized so that nothing can cross
      // from clear to dead in one step -- that holds for the press, which is
      // 21 at most against a 21-point red band. It did not hold here: with
      // `priorBacklash = combo * 3.4 * (1 + timeDecay)` the miss penalty reached
      // 121.6, three times the amber band, so 14.15% of deaths showed no red
      // frame at all and 113 came straight out of the clear. The same skip that
      // was removed from the press had simply moved to the commit.
      // Scaled to the room the run has left, not a flat number against a wall that
      // moves. A constant 16 is a sixth of a fresh wall and a third of a walked-down
      // one, so the same wrong answer went from survivable to fatal purely because
      // of what had happened in earlier windows: at three debt a reader who missed
      // the objective busted 100% of the time, having pressed nothing. The bill for
      // a wrong answer should be the same size of thing wherever the wall is.
      const roomScale = (Number(base.bustFloor) || BUST_FLOOR_MAX) / BUST_FLOOR_MAX;
      const penalty = Math.min(PUSH_STEP_MAX * 2, (16 + Math.max(0, riskDelta) * 3 + priorBacklash) * roomScale);
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
      const outcome = getPushYourLuckOutcome({ stressLevel, bustFloor: Number(base.bustFloor) || 96 });
      const busted = rawStress >= 100 || outcome.busted || Boolean(base.isBlind);
      const slowMotion = !busted && stressLevel >= criticalFloorFor(base.bustFloor) && seconds <= 1;
      const fx = projectPressure({ bustFloor: Number(base.bustFloor) || BUST_FLOOR_MAX, stressLevel, combo, permanentMultiplier, busted, slowMotion });
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
        // Committing spends the gauge, win or lose: it is the act that settles the
        // bet. Carrying it past the commit let the very next tick weigh it against
        // the wall again and bust a player who had already been paid.
        heldGauge: 0,
        wallDebt: busted
          ? Math.min(MAX_WALL_DEBT, (Number(base.wallDebt) || 0) + (base.isBlind ? 0 : 1))
          : Math.max(0, (Number(base.wallDebt) || 0) - 1),
        hiddenChoice: null,
        thresholdState: busted ? "bust" : stressLevel >= criticalFloorFor(base.bustFloor) ? "critical" : outcome.thresholdState,
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
      const fx = projectPressure({ bustFloor: Number(base.bustFloor) || BUST_FLOOR_MAX, stressLevel, combo: base.combo, permanentMultiplier, busted: base.isBlind, slowMotion: false });
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
  "heat",
  "wallDebt",
  "rewardMultiplier",
  "vignette",
  "heartbeatBpm",
  "shakeIntensity",
  "overdrive",
  "criticalFloor",
  "overdriveFloor",
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

export function useDecisionDynamics({ active = true, initialState = null } = {}) {
  const restoredInitialState = initialState && typeof initialState === "object";
  const [state, dispatch] = useReducer(
    reduceDecisionDynamics,
    initialState,
    normalizeDecisionDynamicsState,
  );
  useEffect(() => {
    publishPressure(state);
  }, [state]);
  useEffect(() => {
    if (!active) return undefined;
    if (!restoredInitialState) dispatch({ type: "DECISION_STARTED" });
    const unsubscribe = onDecisionTick(() => dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() }));
    const unsubscribePush = onPushHeld(() => dispatch({ type: "PUSH_HELD" }));
    if (!restoredInitialState) dispatch({ type: "DECISION_TICK", seconds: getDecisionSeconds() });
    return () => {
      unsubscribe();
      unsubscribePush();
    };
  }, [active, restoredInitialState]);
  return { dynamics: state, dynamicsSummary: createDynamicsSummary(state), dispatchDynamics: dispatch };
}
