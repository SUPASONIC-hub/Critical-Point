import { isResourceGain } from "../gameConstants.js";
import { DEFAULT_RELIC_POOL, getSofteningRelic, hasRelic, normalizeRelicIds, RELIC_OFFER_SIZE } from "./relics.js";

/**
 * The gauntlet: one hand of cards, one gauge, one wall you cannot see.
 *
 * A decision window is a bet. The player stakes a card, then either CASHES it
 * at the current multiplier or PUSHES for a bigger one. Every push adds a drawn
 * step of heat; the clock creeps heat in on its own. The wall sits somewhere in
 * a drawn band -- the band is on screen, the wall is not -- and the heartbeat is
 * the only honest instrument pointed at it. Reach the wall and the window busts:
 * the card resolves with none of its gains, the case pot is wiped, and the next
 * board is broken in the way this one went wrong.
 *
 * Everything here is pure and seeded. The live window and the balance script
 * draw the same walls and the same steps from the same seeds.
 */

export const WINDOW_SECONDS = 45;
/** Seconds of reading before the clock starts creeping heat into the gauge. */
export const READ_GRACE_SECONDS = 4;
export const GAUGE_MAX = 100;
const WALL_FLOOR = 38;
/** The heat at which a COLD FEET seal opens, before LOCKPICK. */
export const SEAL_BREAK_GAUGE = 30;
/** What FRACTURE bills the cracked axis, before SPLINT. */
export const FRACTURE_RATE = 1.5;

export const BASE_SCHEMA = Object.freeze({
  seconds: WINDOW_SECONDS,
  wallMin: 56,
  wallMax: 92,
  stepMin: 7,
  stepMax: 15,
  creep: 0.5,
  startGauge: 0,
  chipsScale: 1,
  faceDown: false,
  sedated: false,
  sealHighest: false,
  fracturedAxis: null,
  fractureRate: FRACTURE_RATE,
  sealBreak: SEAL_BREAK_GAUGE,
  mutations: [],
  // The relics this board was dealt with. Kept on the board, not only on the
  // run, so equipping one re-deals the rules once and never twice.
  relics: [],
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round2 = (value) => Math.round(value * 100) / 100;

export function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A uniform [0, 1) from a string seed. */
export function seededUnit(seed) {
  let value = hashSeed(seed) || 1;
  value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 2246822519) >>> 0;
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

export function drawWall(schema, seed) {
  const { wallMin, wallMax } = normalizeSchema(schema);
  return wallMin + Math.floor(seededUnit(`wall:${seed}`) * (wallMax - wallMin + 1));
}

export function drawStep(schema, seed, pushIndex) {
  const { stepMin, stepMax } = normalizeSchema(schema);
  return stepMin + Math.floor(seededUnit(`step:${seed}:${pushIndex}`) * (stepMax - stepMin + 1));
}

/**
 * The pot multiplier doubles every 11 points of heat: x1 cold, x44 at 60, x199
 * at 84. The smallest push (7) is worth x1.55 on its own, so every press
 * visibly buys something -- and every press is visibly more to lose.
 */
export const DOUBLING_HEAT = 11;

export function getMultiplier(gauge) {
  const raw = Math.pow(2, clamp(Number(gauge) || 0, 0, GAUGE_MAX) / DOUBLING_HEAT);
  if (raw >= 100) return Math.round(raw);
  return raw >= 10 ? Math.round(raw * 10) / 10 : Math.round(raw * 100) / 100;
}

/**
 * What heat does to the card's own resource gains. Damped on purpose: the pot is
 * the exponential reward, the resources are the story, and a x26 trust swing
 * would end the story in one card.
 */
export function getResourceMultiplier(gauge) {
  return round2(1 + (clamp(Number(gauge) || 0, 0, GAUGE_MAX) / GAUGE_MAX) * 1.5);
}

/**
 * 0 far from the wall, 1 touching it. The stage feeds it the window's *tell*
 * wall -- the real wall plus a seeded error of up to TELL_ERROR -- so the
 * heartbeat is an instrument, not an answer key. `npm run check:pressure`
 * measures it: at 8 the best heartbeat policy banked 80% of what a player who
 * could see the wall banks, at 18 it banks 57% and still beats every blind
 * policy by half again.
 */
export function getCloseness(gauge, wall) {
  return clamp(1 - ((Number(wall) || GAUGE_MAX) - (Number(gauge) || 0)) / 44, 0, 1);
}

/**
 * The pulse. Two things raise it and only one of them is secret.
 *
 * The tell reads the (noisy) wall. Under it sits a floor built from what the
 * player can already see -- the heat on the gauge and the time gone from the
 * clock -- so a hot gauge or a late window always races, whatever the tell
 * says, and an idle window no longer sits at a resting 60 while it runs out.
 * The floor carries no information about the wall, so it cannot turn the
 * heartbeat into an answer key; `check:pressure` holds that.
 */
export function getHeartbeatBpm(gauge, wall, sedated = false, urgency = 0) {
  const heat = clamp(Number(gauge) || 0, 0, GAUGE_MAX) / GAUGE_MAX;
  const late = clamp(Number(urgency) || 0, 0, 1);
  const floor = 60 + heat * heat * 94 + late * late * 50;
  const tell = sedated ? 88 : 60 + Math.pow(getCloseness(gauge, wall), 1.35) * 124;
  return Math.round(Math.min(190, Math.max(tell, floor)));
}

export function normalizeSchema(value) {
  const source = value && typeof value === "object" ? value : {};
  const schema = { ...BASE_SCHEMA };
  for (const key of ["seconds", "wallMin", "wallMax", "stepMin", "stepMax", "creep", "startGauge", "chipsScale", "fractureRate", "sealBreak"]) {
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) schema[key] = numeric;
  }
  for (const key of ["faceDown", "sedated", "sealHighest"]) {
    if (typeof source[key] === "boolean") schema[key] = source[key];
  }
  schema.fracturedAxis = typeof source.fracturedAxis === "string" ? source.fracturedAxis : null;
  schema.mutations = Array.isArray(source.mutations)
    ? source.mutations.filter((id) => typeof id === "string").slice(0, 8)
    : [];
  schema.seconds = clamp(Math.round(schema.seconds), 12, 60);
  schema.wallMin = clamp(Math.round(schema.wallMin), WALL_FLOOR, 96);
  schema.wallMax = clamp(Math.round(schema.wallMax), schema.wallMin, 98);
  schema.stepMin = clamp(Math.round(schema.stepMin), 1, 30);
  schema.stepMax = clamp(Math.round(schema.stepMax), schema.stepMin, 40);
  schema.creep = clamp(schema.creep, 0, 4);
  schema.startGauge = clamp(Math.round(schema.startGauge), 0, schema.wallMin - 8);
  schema.chipsScale = clamp(schema.chipsScale, 0.25, 4);
  schema.fractureRate = clamp(schema.fractureRate, 1, 2);
  schema.sealBreak = clamp(Math.round(schema.sealBreak), 0, SEAL_BREAK_GAUGE);
  schema.relics = normalizeRelicIds(source.relics);
  return schema;
}

/* ------------------------------------------------------------------ cards */

/** What the wild card -- a sentence the player writes -- is worth before heat. */
export const WILD_CARD_CHIPS = 24;

/** Chips: what a card is worth before heat. The sum of what it gains. */
export function getCardChips(choice, schema = BASE_SCHEMA) {
  if (choice?.type === "free") return Math.round(WILD_CARD_CHIPS * normalizeSchema(schema).chipsScale);
  const effect = choice?.effect ?? {};
  const gains = Object.entries(effect)
    .filter(([key, value]) => isResourceGain(key, value))
    .reduce((sum, [, value]) => sum + Math.abs(value), 0);
  return Math.max(5, Math.round((10 + gains * 2) * normalizeSchema(schema).chipsScale));
}

/** What the card burns, with the fractured axis billed half again. */
export function getCardBurn(choice, schema = BASE_SCHEMA) {
  const { fracturedAxis, fractureRate } = normalizeSchema(schema);
  const costs = Object.entries(applyFracture(choice?.effect ?? {}, fracturedAxis, fractureRate))
    .filter(([key, value]) => value !== 0 && !isResourceGain(key, value))
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));
  if (!costs.length) return null;
  const [key, value] = costs[0];
  return { key, value, fractured: key === fracturedAxis };
}

function applyFracture(effect, fracturedAxis, rate = FRACTURE_RATE) {
  if (!fracturedAxis) return { ...effect };
  return Object.fromEntries(
    Object.entries(effect).map(([key, value]) =>
      key === fracturedAxis && value !== 0 && !isResourceGain(key, value) ? [key, Math.round(value * rate)] : [key, value],
    ),
  );
}

/** The card a sealed hand locks: the richest one. Ties go to the earlier card. */
export function getSealedCardId(choices = [], schema = BASE_SCHEMA) {
  const normalized = normalizeSchema(schema);
  if (!normalized.sealHighest) return null;
  const playable = choices.filter((choice) => choice && choice.type !== "free");
  if (playable.length < 2) return null;
  let best = playable[0];
  for (const choice of playable) {
    if (getCardChips(choice, normalized) > getCardChips(best, normalized)) best = choice;
  }
  return best.id;
}

/**
 * The effect a resolved card actually applies. Gains ride the heat; costs on
 * the fractured axis are billed half again; a bust strips every gain and keeps
 * every cost, which is the entire shape of losing.
 */
export function applyGauntletEffect(effect = {}, { outcome = "cash", gauge = 0, fracturedAxis = null, fractureRate = FRACTURE_RATE, focusMultiplier = 1 } = {}) {
  const fractured = applyFracture(effect, fracturedAxis, fractureRate);
  if (outcome === "bust") {
    return Object.fromEntries(Object.entries(fractured).map(([key, value]) => [key, isResourceGain(key, value) ? 0 : value]));
  }
  const multiplier = getResourceMultiplier(gauge) * Math.max(1, Number(focusMultiplier) || 1);
  return Object.fromEntries(
    Object.entries(fractured).map(([key, value]) => [key, isResourceGain(key, value) ? Math.round(value * multiplier) : value]),
  );
}

export const BUST_EFFECT = Object.freeze({ trust: -6, legitimacy: -6, fatigue: 8, time: -4 });

/* ---------------------------------------------------------------- tempo */

/**
 * The beat. The heartbeat is the table's one honest instrument, so it is also
 * the table's rhythm: a push landed on the beat is a push made while listening.
 *
 * Timing never moves the wall or the step. The odds stay the heartbeat's
 * business and `check:pressure` holds that a perfectly timed player busts
 * exactly as often as an untimed one. What timing moves is what the pot pays
 * (groove) and what the clock costs (a slip).
 *
 * The windows are fractions of the beat with a floor in milliseconds, so a
 * pulse racing at 190 bpm next to the wall still leaves a gap a hand can hit.
 */
export const BEAT_PERFECT = 0.07;
export const BEAT_PERFECT_FLOOR_MS = 35;
export const BEAT_GOOD = 0.18;
export const BEAT_GOOD_FLOOR_MS = 60;
/** An off-beat push costs this much clock, creep included. */
export const SLIP_SECONDS = 1;
/** Groove one push can earn from its combo, before a PERFECT's extra point. */
export const COMBO_POINT_CAP = 4;
/**
 * Each groove point adds this much to the pot, up to GROOVE_CAP (x1.5). Sized
 * so the beat is a spice and the read is the game: in `check:pressure` a hand
 * that lands every push PERFECT banks 1.45x the best heartbeat policy, while
 * listening to the heartbeat banks 1.55x the best blind one. At 0.04 / x2 the
 * beat paid 1.81x -- past a player who could see the wall -- and timing had
 * become the strategy.
 */
export const GROOVE_RATE = 0.03;
export const GROOVE_CAP = 0.5;
/** The groove bonus at which the table goes into fever. */
export const FEVER_BONUS = 1.3;
export const FOCUS_MAX = 100;
export const FOCUS_PERFECT_GAIN = 24;
export const FOCUS_GOOD_GAIN = 13;
export const FOCUS_MISS_HEAT = 4;
export const FOCUS_MISS_SECONDS = 1.25;
export const FOCUS_MODES = Object.freeze(["strike", "steady", "expose"]);

const FOCUS_MODE_PROFILES = Object.freeze({
  strike: {
    label: "STRIKE",
    text: "Bigger pot lock, harsher jams.",
    gainScale: 1.15,
    missHeat: FOCUS_MISS_HEAT + 2,
    missSeconds: FOCUS_MISS_SECONDS,
    potRate: 1.15,
    resourceRate: 0.32,
    reliefPerHit: 0,
  },
  steady: {
    label: "STEADY",
    text: "Lower reward, every lock cools the table.",
    gainScale: 0.9,
    missHeat: Math.max(1, FOCUS_MISS_HEAT - 2),
    missSeconds: FOCUS_MISS_SECONDS * 0.8,
    potRate: 0.62,
    resourceRate: 0.34,
    reliefPerHit: 2,
  },
  expose: {
    label: "EXPOSE",
    text: "Amplifies the card's resource effect.",
    gainScale: 1,
    missHeat: FOCUS_MISS_HEAT,
    missSeconds: FOCUS_MISS_SECONDS,
    potRate: 0.78,
    resourceRate: 0.72,
    reliefPerHit: 0,
  },
});

const BEAT_GRADES = new Set(["perfect", "good", "miss"]);
/** How much wider METRONOME makes both beat windows. */
export const METRONOME_REACH = 1.5;

/** The GOOD window in milliseconds for a beat of this period. */
export function getGoodWindowMs(periodMs, wide = false) {
  return Math.max(periodMs * BEAT_GOOD, BEAT_GOOD_FLOOR_MS) * (wide ? METRONOME_REACH : 1);
}

/**
 * Where a press landed against the beat: "perfect", "good", "miss", or null with
 * no beat to read. `wide` is METRONOME.
 */
export function judgeBeat(sinceBeatMs, periodMs, wide = false) {
  const period = Number(periodMs);
  const since = Number(sinceBeatMs);
  if (!Number.isFinite(period) || period <= 0 || !Number.isFinite(since) || since < 0) return null;
  const phase = since % period;
  const offset = Math.min(phase, period - phase);
  const reach = wide ? METRONOME_REACH : 1;
  if (offset <= Math.max(period * BEAT_PERFECT, BEAT_PERFECT_FLOOR_MS) * reach) return "perfect";
  if (offset <= getGoodWindowMs(period, wide)) return "good";
  return "miss";
}

/**
 * One graded press against the running combo. A hit extends the combo and
 * earns groove worth the combo's length (capped); a miss breaks the combo and
 * keeps the groove, so the pot on the table never shrinks mid-window. An
 * ungraded press -- no beat on screen yet -- changes neither.
 */
export function scoreBeat({ beatCombo = 0, groove = 0 } = {}, grade = null) {
  const combo = Math.max(0, Math.trunc(Number(beatCombo) || 0));
  const banked = Math.max(0, Number(groove) || 0);
  if (grade === "perfect" || grade === "good") {
    const nextCombo = combo + 1;
    const points = Math.min(COMBO_POINT_CAP, nextCombo) + (grade === "perfect" ? 1 : 0);
    return { beatCombo: nextCombo, groove: banked + points, points };
  }
  if (grade === "miss") return { beatCombo: 0, groove: banked, points: 0 };
  return { beatCombo: combo, groove: banked, points: 0 };
}

export function getGrooveBonus(groove) {
  return round2(1 + Math.min(GROOVE_CAP, Math.max(0, Number(groove) || 0) * GROOVE_RATE));
}

export function normalizeFocusMode(value) {
  return FOCUS_MODES.includes(value) ? value : "strike";
}

export function getFocusModeProfile(mode) {
  return FOCUS_MODE_PROFILES[normalizeFocusMode(mode)];
}

export function scoreFocus({ focus = 0, focusCombo = 0, focusMode = "strike" } = {}, grade = null) {
  const charge = clamp(Math.round(Number(focus) || 0), 0, FOCUS_MAX);
  const combo = Math.max(0, Math.trunc(Number(focusCombo) || 0));
  const profile = getFocusModeProfile(focusMode);
  if (grade === "perfect" || grade === "good") {
    const nextCombo = combo + 1;
    const baseGain = grade === "perfect" ? FOCUS_PERFECT_GAIN : FOCUS_GOOD_GAIN;
    const chainGain = Math.min(12, nextCombo * 2);
    const gained = Math.round((baseGain + chainGain) * profile.gainScale);
    return {
      focus: clamp(charge + gained, 0, FOCUS_MAX),
      focusCombo: nextCombo,
      focusHits: 1,
      focusPerfects: grade === "perfect" ? 1 : 0,
      focusMisses: 0,
      focusRelief: grade === "perfect" ? profile.reliefPerHit + 1 : profile.reliefPerHit,
      jammed: false,
    };
  }
  if (grade === "miss") {
    return {
      focus: Math.max(0, charge - 12),
      focusCombo: 0,
      focusHits: 0,
      focusPerfects: 0,
      focusMisses: 1,
      focusRelief: 0,
      jammed: true,
    };
  }
  return {
    focus: charge,
    focusCombo: combo,
    focusHits: 0,
    focusPerfects: 0,
    focusMisses: 0,
    focusRelief: 0,
    jammed: false,
  };
}

export function getFocusBonus(focus, mode = "strike") {
  const charge = clamp(Number(focus) || 0, 0, FOCUS_MAX) / FOCUS_MAX;
  const profile = getFocusModeProfile(mode);
  return {
    mode: normalizeFocusMode(mode),
    label: profile.label,
    resource: round2(1 + charge * profile.resourceRate),
    pot: round2(1 + charge * profile.potRate),
    tier: charge >= 1 ? "deadeye" : charge >= 0.7 ? "locked" : charge >= 0.35 ? "traced" : "loose",
  };
}

export const STANCE_MASTERY_GOAL = 3;
export const EMPTY_STANCE_MASTERY = Object.freeze({ strike: 0, steady: 0, expose: 0 });

export function normalizeStanceMastery(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return FOCUS_MODES.reduce((mastery, mode) => {
    mastery[mode] = clamp(Math.trunc(Number(source[mode]) || 0), 0, 99);
    return mastery;
  }, {});
}

function earnedStance(mode, charge, hits, outcome) {
  return outcome === "cash" && FOCUS_MODES.includes(mode) && charge >= 70 && hits > 0;
}

export function advanceStanceMastery(mastery, { outcome, focusMode = "strike", focusCharge = 0, focusHits = 0 } = {}) {
  const next = normalizeStanceMastery(mastery);
  const mode = normalizeFocusMode(focusMode);
  if (earnedStance(mode, focusCharge, focusHits, outcome)) next[mode] += 1;
  return next;
}

export function getStanceMasteryProfile(mastery) {
  const state = normalizeStanceMastery(mastery);
  const leader = FOCUS_MODES.reduce((best, mode) => (state[mode] > state[best] ? mode : best), "strike");
  return {
    ...state,
    leader,
    total: FOCUS_MODES.reduce((sum, mode) => sum + state[mode], 0),
    mastered: FOCUS_MODES.filter((mode) => state[mode] >= STANCE_MASTERY_GOAL),
  };
}

/* --------------------------------------------------------------- window */

export const TELL_ERROR = 18;

export function drawTellOffset(seed) {
  return Math.round((seededUnit(`tell:${seed}`) * 2 - 1) * TELL_ERROR);
}

export function createWindow({ schema = BASE_SCHEMA, seed = "0", abandoned = false, beatCombo = 0, resume = null } = {}) {
  const normalized = normalizeSchema(schema);
  const carriedCombo = clamp(Math.trunc(Number(beatCombo) || 0), 0, 999);
  const window = {
    seed: String(seed),
    schema: normalized,
    wall: drawWall(normalized, seed),
    tellOffset: drawTellOffset(seed),
    gauge: normalized.startGauge,
    pushes: 0,
    lastStep: 0,
    elapsed: 0,
    selectedId: null,
    status: "live",
    cause: null,
    // The combo is carried in from the last cash; groove is earned here.
    beatCombo: carriedCombo,
    maxCombo: carriedCombo,
    groove: 0,
    beatHits: 0,
    perfects: 0,
    slips: 0,
    focus: 0,
    focusMode: "strike",
    focusCombo: 0,
    maxFocusCombo: 0,
    focusHits: 0,
    focusPerfects: 0,
    focusMisses: 0,
    jammed: false,
    lastGrade: null,
    lastFocusGrade: null,
  };
  // A window the player put down on purpose -- saved and left, or hid the tab --
  // picks up exactly where it stood. The wall and the tell are dealt from the
  // seed again, never read from the save, so a suspended window cannot carry a
  // different wall in with it; only the player's own progress is restored.
  if (resume) return resumeWindow(window, resume);
  // A window the player touched and then walked away from -- a reload, a tab
  // closed mid-bet -- is settled as a bust. Otherwise F5 undoes the wall.
  // The gauge stays where the window opened: an abandoned window must not
  // print the wall it was hiding, or a second tab becomes a way to read it.
  return abandoned ? { ...window, status: "bust", cause: "abandon" } : window;
}

const SUSPENDED_WINDOW_NUMBERS = [
  "gauge", "pushes", "lastStep", "elapsed", "beatCombo", "maxCombo", "groove", "beatHits", "perfects", "slips",
  "focus", "focusCombo", "maxFocusCombo", "focusHits", "focusPerfects", "focusMisses",
];

/**
 * The part of a live window worth keeping when the player puts it down: their
 * progress, never the wall. Tied to the run's window index, so a suspension
 * left in a save stops meaning anything the moment that window settles.
 */
function normalizeSuspendedWindow(value, windowIndex) {
  if (!value || typeof value !== "object" || typeof value.seed !== "string" || !value.seed) return null;
  if (Number(value.windowIndex) !== windowIndex) return null;
  const source = value.window && typeof value.window === "object" ? value.window : {};
  const window = {};
  for (const key of SUSPENDED_WINDOW_NUMBERS) {
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) window[key] = numeric;
  }
  window.selectedId = typeof source.selectedId === "string" ? source.selectedId.slice(0, 200) : null;
  window.focusMode = normalizeFocusMode(source.focusMode);
  return { seed: value.seed.slice(0, 200), windowIndex, window };
}

/** What `normalizeSuspendedWindow` keeps of a live window, ready to save. */
export function suspendWindow(window, windowIndex) {
  if (!window || window.status !== "live") return null;
  return normalizeSuspendedWindow({ seed: window.seed, windowIndex, window }, windowIndex);
}

function resumeWindow(window, resume) {
  const restored = { ...window };
  for (const key of SUSPENDED_WINDOW_NUMBERS) {
    if (Number.isFinite(resume[key])) restored[key] = Math.max(0, resume[key]);
  }
  restored.pushes = Math.trunc(restored.pushes);
  // Progress is clamped under the wall and the clock: a resumed window is always
  // still live, and the first tick or push decides it the way it would have.
  restored.gauge = clamp(restored.gauge, 0, Math.max(0, window.wall - 0.01));
  restored.elapsed = clamp(restored.elapsed, 0, Math.max(0, window.schema.seconds - 0.1));
  restored.selectedId = typeof resume.selectedId === "string" ? resume.selectedId : null;
  restored.focusMode = normalizeFocusMode(resume.focusMode);
  return restored;
}

export function getRemainingSeconds(window) {
  return Math.max(0, window.schema.seconds - window.elapsed);
}

/**
 * The live window. `TICK` carries elapsed seconds since the last tick; the
 * reducer owns the arithmetic so a slow frame and a fast one land the same.
 */
function advanceClock(window, delta) {
  const elapsed = window.elapsed + delta;
  const creepFrom = Math.max(window.elapsed, READ_GRACE_SECONDS);
  const creeping = Math.max(0, elapsed - creepFrom);
  const gauge = clamp(window.gauge + creeping * window.schema.creep * (1 + window.pushes * 0.12), 0, GAUGE_MAX);
  if (gauge >= window.wall) return { ...window, elapsed, gauge: window.wall, status: "bust", cause: "creep" };
  if (elapsed >= window.schema.seconds) return { ...window, elapsed: window.schema.seconds, gauge, status: "bust", cause: "timeout" };
  return { ...window, elapsed, gauge };
}

export function reduceWindow(window, event = {}) {
  if (!window || window.status !== "live") return window;
  switch (event.type) {
    case "TICK":
      return advanceClock(window, clamp(Number(event.delta) || 0, 0, 1));
    case "PUSH": {
      const pushes = window.pushes + 1;
      const step = drawStep(window.schema, window.seed, pushes);
      const gauge = clamp(window.gauge + step, 0, GAUGE_MAX);
      const grade = BEAT_GRADES.has(event.grade) ? event.grade : null;
      const scored = scoreBeat(window, grade);
      const pushed = {
        ...window,
        pushes,
        lastStep: step,
        gauge,
        beatCombo: scored.beatCombo,
        maxCombo: Math.max(Number(window.maxCombo) || 0, scored.beatCombo),
        groove: scored.groove,
        beatHits: (Number(window.beatHits) || 0) + (scored.points > 0 ? 1 : 0),
        perfects: (Number(window.perfects) || 0) + (grade === "perfect" ? 1 : 0),
        slips: (Number(window.slips) || 0) + (grade === "miss" ? 1 : 0),
        jammed: false,
        lastGrade: grade,
      };
      if (gauge >= window.wall) return { ...pushed, status: "bust", cause: "push" };
      // A slip is paid in clock, and the clock creeps heat while it runs, so a
      // mashed push can never be a way to skip creep.
      return grade === "miss" ? advanceClock(pushed, SLIP_SECONDS) : pushed;
    }
    case "FOCUS": {
      if (!window.selectedId) return window;
      const grade = BEAT_GRADES.has(event.grade) ? event.grade : null;
      const scored = scoreFocus(window, grade);
      const profile = getFocusModeProfile(window.focusMode);
      const focused = {
        ...window,
        focus: scored.focus,
        focusCombo: scored.focusCombo,
        maxFocusCombo: Math.max(Number(window.maxFocusCombo) || 0, scored.focusCombo),
        focusHits: (Number(window.focusHits) || 0) + scored.focusHits,
        focusPerfects: (Number(window.focusPerfects) || 0) + scored.focusPerfects,
        focusMisses: (Number(window.focusMisses) || 0) + scored.focusMisses,
        jammed: scored.jammed,
        lastFocusGrade: grade,
      };
      if (grade !== "miss") {
        const cooled = scored.focusRelief > 0
          ? { ...focused, gauge: clamp(focused.gauge - scored.focusRelief, 0, GAUGE_MAX) }
          : focused;
        return cooled;
      }
      const heated = {
        ...focused,
        gauge: clamp(focused.gauge + profile.missHeat, 0, GAUGE_MAX),
      };
      if (heated.gauge >= heated.wall) return { ...heated, gauge: heated.wall, status: "bust", cause: "focus" };
      return advanceClock(heated, profile.missSeconds);
    }
    case "SET_FOCUS_MODE":
      return { ...window, focusMode: normalizeFocusMode(event.mode) };
    case "REDEAL":
      // A relic equipped before the window is touched re-deals it under the new
      // rules. Once a card is staked, a push made or the clock started, the
      // board is the board.
      if (window.pushes > 0 || window.selectedId || window.elapsed > 0) return window;
      return createWindow({ schema: event.schema, seed: window.seed, beatCombo: window.beatCombo });
    case "SELECT":
      return { ...window, selectedId: typeof event.id === "string" ? event.id : null };
    case "CASH": {
      if (!window.selectedId || event.locked) return window;
      return { ...window, status: "cashed", cause: "cash" };
    }
    default:
      return window;
  }
}

/* ------------------------------------------------------------------ run */

export const RUN_INITIAL_STATE = Object.freeze({
  windowIndex: 0,
  runPot: 0,
  vault: 0,
  streak: 0,
  busts: 0,
  cashes: 0,
  bestMultiplier: 1,
  lastOutcome: "none",
  lastGauge: 0,
  // The seed of a window the player has already touched and not yet settled.
  // Saved the moment the window is touched, so a reload cannot un-bust it.
  openSeed: null,
  // The card staked in that window, so an abandoned window settles the card the
  // player chose rather than the worst one on the table.
  openCardId: null,
  // A live window the player put down on purpose, with their progress in it.
  // See `normalizeSuspendedWindow`.
  suspended: null,
  // The beat combo carried into the next window, the longest this run has
  // held, and the groove share of the pot and the vault. The ending's vault
  // slack reads the vault without its groove: it rewards reading the table.
  beatCombo: 0,
  bestCombo: 0,
  bestFocusCombo: 0,
  focusHits: 0,
  focusPerfects: 0,
  focusMisses: 0,
  stanceMastery: EMPTY_STANCE_MASTERY,
  runGroove: 0,
  grooveVault: 0,
  // The relics this season carries, the three a closed case is offering, and
  // whether INSURANCE has already paid out in this case.
  relics: [],
  relicOffer: [],
  insuranceSpent: false,
  schema: BASE_SCHEMA,
});

export function normalizeRunState(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const run = { ...RUN_INITIAL_STATE };
  for (const key of ["windowIndex", "runPot", "vault", "streak", "busts", "cashes", "bestMultiplier", "lastGauge", "beatCombo", "bestCombo", "bestFocusCombo", "focusHits", "focusPerfects", "focusMisses", "runGroove", "grooveVault"]) {
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) run[key] = numeric;
  }
  run.windowIndex = Math.max(0, Math.trunc(run.windowIndex));
  run.runPot = Math.max(0, Math.round(run.runPot));
  run.vault = Math.max(0, Math.round(run.vault));
  run.streak = Math.max(0, Math.trunc(run.streak));
  run.busts = Math.max(0, Math.trunc(run.busts));
  run.cashes = Math.max(0, Math.trunc(run.cashes));
  run.bestMultiplier = clamp(run.bestMultiplier, 1, 512);
  run.lastGauge = clamp(run.lastGauge, 0, GAUGE_MAX);
  run.beatCombo = clamp(Math.trunc(run.beatCombo), 0, 999);
  run.bestCombo = clamp(Math.trunc(run.bestCombo), run.beatCombo, 999);
  run.bestFocusCombo = clamp(Math.trunc(run.bestFocusCombo), 0, 999);
  run.focusHits = Math.max(0, Math.trunc(run.focusHits));
  run.focusPerfects = Math.max(0, Math.trunc(run.focusPerfects));
  run.focusMisses = Math.max(0, Math.trunc(run.focusMisses));
  run.stanceMastery = normalizeStanceMastery(source.stanceMastery);
  run.runGroove = clamp(Math.round(run.runGroove), 0, run.runPot);
  run.grooveVault = clamp(Math.round(run.grooveVault), 0, run.vault);
  run.relics = normalizeRelicIds(source.relics);
  run.relicOffer = normalizeRelicIds(source.relicOffer, RELIC_OFFER_SIZE).filter((id) => !run.relics.includes(id));
  run.insuranceSpent = source.insuranceSpent === true;
  run.lastOutcome = ["none", "cash", "bust"].includes(source.lastOutcome) ? source.lastOutcome : "none";
  run.openSeed = typeof source.openSeed === "string" ? source.openSeed.slice(0, 200) : null;
  run.openCardId = run.openSeed && typeof source.openCardId === "string" ? source.openCardId.slice(0, 200) : null;
  run.schema = normalizeSchema(source.schema);
  run.suspended = normalizeSuspendedWindow(source.suspended, run.windowIndex);
  return run;
}

export function serializeRunState(value) {
  const run = normalizeRunState(value);
  return { ...run, stanceMastery: normalizeStanceMastery(run.stanceMastery), schema: { ...run.schema, mutations: [...run.schema.mutations] } };
}

/**
 * The catalogue of ways a decision breaks the next board. Each one is keyed to
 * something the player did, and each one changes a rule, not a number on a
 * report.
 */
export const MUTATIONS = Object.freeze({
  blackout: {
    label: "BLACKOUT",
    title: "카드가 뒤집혔다",
    text: "임계점을 넘긴 대가. 다음 판은 카드의 칩과 소모가 가려지고, 벽이 6 가까워진다.",
  },
  aftershock: {
    label: "AFTERSHOCK",
    title: "여진이 남았다",
    text: "게이지가 22에서 시작한다. 방금 터진 열이 아직 식지 않았다.",
  },
  silence: {
    label: "SILENCE",
    title: "심장이 거짓말을 한다",
    text: "시간을 흘려보낸 대가. 다음 판은 심박이 벽을 알려주지 않고, 결정 시간이 30초다.",
  },
  heatDebt: {
    label: "HEAT DEBT",
    title: "탐욕은 열을 남긴다",
    text: "높은 배율로 확정한 대가. 이번 열의 3분의 1을 안고 시작하고, 12초를 잃는다.",
  },
  overclock: {
    label: "OVERCLOCK",
    title: "판돈이 두 배로 뛴다",
    text: "연속으로 x4 이상을 챙겼다. 칩이 두 배지만, 한 번 밀 때 오르는 열도 커진다.",
  },
  coldFeet: {
    label: "COLD FEET",
    title: "가장 좋은 카드가 봉인됐다",
    text: "밀지 않고 확정한 대가. 가장 비싼 카드는 게이지 30을 넘겨야 열리고, 칩이 줄어든다.",
  },
  fracture: {
    label: "FRACTURE",
    title: "균열이 난 축",
    text: "방금 가장 크게 태운 축. 다음 판에서 그 축을 태우는 카드는 1.5배로 청구된다.",
  },
  reboot: {
    label: "REBOOT",
    title: "사건이 닫혔다",
    text: "판돈은 금고로 옮겨졌고, 규칙이 초기화됐다. 이제 잃을 수 없다.",
  },
  strikeWake: {
    label: "STRIKE WAKE",
    title: "The next board wakes up richer and sharper.",
    text: "A charged STRIKE lock raises the next hand's chips, but the push step grows with it.",
  },
  steadyLine: {
    label: "STEADY LINE",
    title: "The next board opens calmer.",
    text: "A charged STEADY lock cools the starting gauge, buys time, and pushes the wall away.",
  },
  exposedHand: {
    label: "EXPOSED HAND",
    title: "The next board cannot hide the hand.",
    text: "A charged EXPOSE lock strips face-down and cold-feet seals from the next board.",
  },
  strikeMastery: {
    label: "STRIKE MASTERY",
    title: "Your season has learned to hit first.",
    text: "Repeated charged STRIKE locks permanently thicken chips, with a small push-step tax.",
  },
  steadyMastery: {
    label: "STEADY MASTERY",
    title: "Your season has learned to hold the line.",
    text: "Repeated charged STEADY locks cool every new board and buy a little more clock.",
  },
  exposeMastery: {
    label: "EXPOSE MASTERY",
    title: "Your season has learned to read the table.",
    text: "Repeated charged EXPOSE locks weaken seals and eventually stop hidden boards from staying hidden.",
  },
});

export function describeMutations(schema) {
  const { mutations, fracturedAxis, relics } = normalizeSchema(schema);
  return mutations
    .filter((id) => MUTATIONS[id])
    .map((id) => ({ id, ...MUTATIONS[id], axis: id === "fracture" ? fracturedAxis : null, softenedBy: getSofteningRelic(id, relics) }));
}

/**
 * Applies the relics a board has not been dealt with yet. Idempotent: the board
 * records which relics it carries, so equipping one mid-season re-deals the
 * rules once, never twice. HEAT SINK is applied where the debt is computed,
 * because it needs the heat the debt is taken from.
 */
export function applyRelics(schema, relics = []) {
  const board = normalizeSchema(schema);
  const pending = normalizeRelicIds(relics).filter((id) => !board.relics.includes(id));
  if (!pending.length) return board;
  const next = { ...board, mutations: [...board.mutations], relics: [...board.relics, ...pending] };
  for (const id of pending) {
    if (id === "highRoller") {
      next.chipsScale *= 1.3;
      next.wallMin -= 4;
      next.wallMax -= 4;
    }
    if (id === "lockpick") next.sealBreak = Math.min(next.sealBreak, 15);
    if (id === "splint") next.fractureRate = Math.min(next.fractureRate, 1.25);
    if (id === "stethoscope") next.sedated = false;
    if (id === "coldBlood" && next.mutations.includes("aftershock")) next.startGauge = Math.min(next.startGauge, 11);
    if (id === "kineticGrip") {
      if (next.mutations.includes("strikeMastery")) {
        next.stepMin = Math.max(BASE_SCHEMA.stepMin, next.stepMin - 1);
        next.stepMax = Math.max(BASE_SCHEMA.stepMax, next.stepMax - 1);
      }
      if (next.mutations.includes("strikeWake")) next.chipsScale *= 1.08;
    }
    if (id === "steadyAnchor" && next.mutations.includes("steadyMastery")) {
      next.startGauge = Math.max(0, next.startGauge - 4);
      next.seconds += 2;
    }
    if (id === "glassLens" && next.mutations.includes("exposeMastery")) {
      next.faceDown = false;
      next.sealHighest = false;
      next.sealBreak = Math.min(next.sealBreak, 8);
    }
  }
  return normalizeSchema(next);
}

/** Three relics for a closed case, seeded by its last window so a reload cannot reroll them. */
export function drawRelicOffer(seed, pool = DEFAULT_RELIC_POOL, owned = []) {
  return normalizeRelicIds(pool)
    .filter((id) => !hasRelic(owned, id))
    .map((id) => ({ id, order: seededUnit(`relic:${seed}:${id}`) }))
    .sort((left, right) => left.order - right.order)
    .slice(0, RELIC_OFFER_SIZE)
    .map((entry) => entry.id);
}

/**
 * Takes (or passes on) the relic a closed case offered. The board on the table
 * is re-dealt with it at once; a pass clears the offer and changes nothing else.
 */
export function equipRelic(run, relicId = null) {
  const current = normalizeRunState(run);
  const picked = relicId && current.relicOffer.includes(relicId) ? relicId : null;
  const relics = picked ? [...current.relics, picked] : current.relics;
  return normalizeRunState({ ...current, relics, relicOffer: [], schema: applyRelics(current.schema, relics) });
}

/**
 * The run a case opens with. A case that closed has already moved its pot to
 * the vault and dealt the REBOOT board -- and its relic offer -- so both stay.
 * A case abandoned mid-run forfeits its pot and opens on the base rules, with
 * the season's relics applied.
 */
export function openCaseRun(run) {
  const current = normalizeRunState(run);
  const rebooted = current.schema.mutations.includes("reboot");
  return normalizeRunState({
    ...current,
    runPot: 0,
    runGroove: 0,
    insuranceSpent: false,
    relicOffer: rebooted ? current.relicOffer : [],
    schema: rebooted ? current.schema : applyRelics(BASE_SCHEMA, current.relics),
  });
}

/** Builds the next board from what just happened. */
/** A burn smaller than this is a scratch, not a fracture. */
export const FRACTURE_MIN_BURN = 10;

function applyFocusCarry(schema, { outcome, focusMode = "strike", focusCharge = 0, focusHits = 0 } = {}) {
  if (!earnedStance(focusMode, focusCharge, focusHits, outcome)) return schema;
  const next = { ...schema, mutations: [...schema.mutations] };
  const addMutation = (id) => {
    if (!next.mutations.includes(id)) next.mutations.push(id);
  };
  if (focusMode === "strike") {
    next.chipsScale *= 1.25;
    next.stepMin += 2;
    next.stepMax += 3;
    addMutation("strikeWake");
  } else if (focusMode === "steady") {
    next.startGauge = Math.max(0, next.startGauge - 8);
    next.seconds += 4;
    next.wallMin += 3;
    next.wallMax += 3;
    addMutation("steadyLine");
  } else if (focusMode === "expose") {
    next.faceDown = false;
    next.sealHighest = false;
    next.sealBreak = Math.min(next.sealBreak, 10);
    next.chipsScale = Math.max(next.chipsScale, BASE_SCHEMA.chipsScale);
    next.mutations = next.mutations.filter((id) => id !== "coldFeet" && id !== "blackout");
    addMutation("exposedHand");
  }
  return next;
}

function applyStanceMastery(schema, mastery = EMPTY_STANCE_MASTERY) {
  const profile = getStanceMasteryProfile(mastery);
  const next = { ...schema, mutations: [...schema.mutations] };
  const addMutation = (id) => {
    if (!next.mutations.includes(id)) next.mutations.push(id);
  };
  if (profile.strike >= STANCE_MASTERY_GOAL) {
    next.chipsScale *= 1 + Math.min(0.18, profile.strike * 0.03);
    next.stepMin += 1;
    next.stepMax += 1;
    addMutation("strikeMastery");
  }
  if (profile.steady >= STANCE_MASTERY_GOAL) {
    next.startGauge = Math.max(0, next.startGauge - Math.min(12, profile.steady * 2));
    next.seconds += Math.min(6, profile.steady);
    next.wallMin += 1;
    next.wallMax += 1;
    addMutation("steadyMastery");
  }
  if (profile.expose >= STANCE_MASTERY_GOAL) {
    next.sealBreak = Math.max(0, next.sealBreak - Math.min(8, profile.expose));
    if (profile.expose >= STANCE_MASTERY_GOAL + 2) {
      next.faceDown = false;
      next.sealHighest = false;
    }
    addMutation("exposeMastery");
  }
  return next;
}

export function buildNextSchema({ outcome, cause, gauge, pushes, streak, burnAxis, caseClosed, relics = [], focusMode = "strike", focusCharge = 0, focusHits = 0, stanceMastery = EMPTY_STANCE_MASTERY }) {
  if (caseClosed) return applyRelics(applyStanceMastery({ ...BASE_SCHEMA, mutations: ["reboot"] }, stanceMastery), relics);
  const schema = { ...BASE_SCHEMA, mutations: [] };
  if (outcome === "bust") {
    schema.faceDown = true;
    schema.wallMin -= 6;
    schema.wallMax -= 6;
    schema.startGauge = 22;
    schema.mutations.push("blackout", "aftershock");
    if (cause === "timeout") {
      schema.sedated = true;
      schema.seconds = 30;
      schema.mutations.push("silence");
    }
  } else {
    if (gauge >= 60) {
      const sink = hasRelic(relics, "heatSink");
      schema.startGauge = Math.round(gauge / (sink ? 6 : 3));
      schema.seconds -= sink ? 6 : 12;
      schema.mutations.push("heatDebt");
    }
    if (streak >= 2) {
      schema.chipsScale *= 2;
      schema.stepMin += 4;
      schema.stepMax += 6;
      schema.mutations.push("overclock");
    }
    if (pushes === 0) {
      schema.sealHighest = true;
      schema.chipsScale *= 0.6;
      schema.mutations.push("coldFeet");
    }
  }
  if (burnAxis) {
    schema.fracturedAxis = burnAxis;
    schema.mutations.push("fracture");
  }
  return applyRelics(applyStanceMastery(applyFocusCarry(schema, { outcome, focusMode, focusCharge, focusHits }), stanceMastery), relics);
}

/**
 * Settles a closed window against the run. Returns the verdict the runtime logs
 * and the reveal prints, and the run state the next window is dealt from.
 */
export function resolveWindow({ run, window, card, caseClosed = false, offerRelics = false, relicPool = DEFAULT_RELIC_POOL }) {
  const current = normalizeRunState(run);
  const relics = current.relics;
  const outcome = window?.status === "cashed" ? "cash" : "bust";
  const cause = outcome === "cash" ? "cash" : window?.cause ?? "push";
  const gauge = clamp(Number(window?.gauge) || 0, 0, GAUGE_MAX);
  const multiplier = outcome === "cash" ? getMultiplier(gauge) : 0;
  const chips = card ? getCardChips(card, current.schema) : 0;
  const reachedGroove = Math.max(0, Number(window?.groove) || 0);
  const grooveBonus = outcome === "cash" ? getGrooveBonus(reachedGroove) : 1;
  const focusCharge = Math.max(0, Number(window?.focus) || 0);
  const focusMode = normalizeFocusMode(window?.focusMode);
  const focusBonus = outcome === "cash" ? getFocusBonus(focusCharge, focusMode) : getFocusBonus(0, focusMode);
  const focusHits = Math.trunc(Number(window?.focusHits) || 0);
  const stanceMastery = advanceStanceMastery(current.stanceMastery, { outcome, focusMode, focusCharge, focusHits });
  const basePot = outcome === "cash" ? Math.round(chips * multiplier) : 0;
  const pot = outcome === "cash" ? Math.round(chips * multiplier * grooveBonus * focusBonus.pot) : 0;
  const groovePot = pot - basePot;
  // INSURANCE: once a case, the wall leaves a third of the pot. At half it lifted
  // the best heartbeat play to 0.59 of a wall-seeing player, against a 0.60 cap.
  const insured = outcome === "bust" && hasRelic(relics, "insurance") && !current.insuranceSpent && current.runPot > 0;
  const insuredPot = insured ? Math.floor(current.runPot / 3) : 0;
  const lostPot = outcome === "bust" ? current.runPot - insuredPot : 0;
  const windowCombo = Math.max(0, Math.trunc(Number(window?.beatCombo) || 0));
  const encored = outcome === "bust" && hasRelic(relics, "encore") && windowCombo > 0;
  const runGrooveAfter = outcome === "cash" ? current.runGroove + groovePot : insured ? Math.floor(current.runGroove / 3) : 0;
  const streak = outcome === "cash" && multiplier >= 4 ? current.streak + 1 : 0;
  const runPotAfter = outcome === "cash" ? current.runPot + pot : insuredPot;
  const secured = caseClosed ? runPotAfter : 0;
  const burn = card ? getCardBurn(card, current.schema) : null;
  const fractureAxis = burn && Math.abs(burn.value) >= FRACTURE_MIN_BURN ? burn.key : null;
  const nextSchema = buildNextSchema({
    outcome,
    cause,
    gauge,
    pushes: Number(window?.pushes) || 0,
    streak,
    burnAxis: fractureAxis,
    caseClosed,
    relics,
    focusMode,
    focusCharge,
    focusHits,
    stanceMastery,
  });
  const nextMutations = describeMutations(nextSchema);
  const relicProcs = [
    ...(insured ? ["insurance"] : []),
    ...(encored ? ["encore"] : []),
    ...nextMutations.map((mutation) => mutation.softenedBy).filter(Boolean),
  ];
  const relicOffer = caseClosed && offerRelics ? drawRelicOffer(window?.seed ?? current.windowIndex, relicPool, relics) : [];
  const verdict = {
    outcome,
    cause,
    gauge: Math.round(gauge),
    wall: Number(window?.wall) || 0,
    pushes: Number(window?.pushes) || 0,
    elapsed: round2(Number(window?.elapsed) || 0),
    chips,
    multiplier,
    resourceMultiplier: outcome === "cash" ? getResourceMultiplier(gauge) : 0,
    pot,
    lostPot,
    insuredPot,
    secured,
    fracturedAxis: current.schema.fracturedAxis,
    fractureRate: current.schema.fractureRate,
    nextMutations,
    relicProcs,
    relicOffer,
    tempo: {
      grade: typeof window?.lastGrade === "string" ? window.lastGrade : null,
      combo: windowCombo,
      maxCombo: Math.max(windowCombo, Math.trunc(Number(window?.maxCombo) || 0)),
      hits: Math.trunc(Number(window?.beatHits) || 0),
      perfects: Math.trunc(Number(window?.perfects) || 0),
      slips: Math.trunc(Number(window?.slips) || 0),
      groove: reachedGroove,
      bonus: getGrooveBonus(reachedGroove),
      groovePot,
      lostCombo: outcome === "bust" && !encored ? windowCombo : 0,
    },
    focus: {
      charge: Math.round(focusCharge),
      mode: focusMode,
      label: focusBonus.label,
      combo: Math.max(0, Math.trunc(Number(window?.focusCombo) || 0)),
      maxCombo: Math.max(0, Math.trunc(Number(window?.maxFocusCombo) || 0)),
      hits: Math.trunc(Number(window?.focusHits) || 0),
      perfects: Math.trunc(Number(window?.focusPerfects) || 0),
      misses: Math.trunc(Number(window?.focusMisses) || 0),
      grade: typeof window?.lastFocusGrade === "string" ? window.lastFocusGrade : null,
      resourceMultiplier: focusBonus.resource,
      potMultiplier: focusBonus.pot,
      tier: focusBonus.tier,
      jammed: window?.jammed === true,
      stanceEarned: earnedStance(focusMode, focusCharge, focusHits, outcome),
      masteryCount: stanceMastery[focusMode],
    },
  };
  const nextRun = normalizeRunState({
    windowIndex: current.windowIndex + 1,
    runPot: caseClosed ? 0 : runPotAfter,
    vault: current.vault + secured,
    streak,
    busts: current.busts + (outcome === "bust" ? 1 : 0),
    cashes: current.cashes + (outcome === "cash" ? 1 : 0),
    bestMultiplier: Math.max(current.bestMultiplier, multiplier || 1),
    lastOutcome: outcome,
    lastGauge: gauge,
    // A cash carries the combo into the next window; the wall takes it with the
    // pot, unless ENCORE holds it.
    beatCombo: outcome === "cash" || encored ? windowCombo : 0,
    bestCombo: Math.max(current.bestCombo, verdict.tempo.maxCombo),
    bestFocusCombo: Math.max(current.bestFocusCombo, verdict.focus.maxCombo),
    focusHits: current.focusHits + verdict.focus.hits,
    focusPerfects: current.focusPerfects + verdict.focus.perfects,
    focusMisses: current.focusMisses + verdict.focus.misses,
    stanceMastery,
    runGroove: caseClosed ? 0 : runGrooveAfter,
    grooveVault: current.grooveVault + (caseClosed ? runGrooveAfter : 0),
    relics,
    relicOffer,
    insuranceSpent: !caseClosed && (current.insuranceSpent || insured),
    schema: nextSchema,
  });
  return { verdict, nextRun };
}

/**
 * Who holds a window. The saved `openSeed` is `<window seed>#<tab token>`: the
 * seed says which window was touched, the token says which tab touched it, so
 * a second tab on the same window can be told apart from a reload of the first.
 */
export function splitOpenSeed(openSeed) {
  if (typeof openSeed !== "string" || !openSeed) return { seed: null, token: null };
  const index = openSeed.lastIndexOf("#");
  return index < 0 ? { seed: openSeed, token: null } : { seed: openSeed.slice(0, index), token: openSeed.slice(index + 1) };
}

/**
 * Whether the stored save is ahead of the run this tab is about to write.
 *
 * A newer revision alone is not a conflict: another tab that only opened the
 * game, resumed it, or looked at a held bet writes the same run back. What this
 * tab must never write over is play it has not seen -- a different run, a
 * window settled past this tab's, or a window another tab has taken hold of.
 */
export function isSaveAheadOf(stored, payload, tabToken) {
  if (!stored || typeof stored !== "object") return false;
  if (stored.runId !== payload?.runId) return true;
  const storedRun = stored.dynamics ?? {};
  const ownRun = payload?.dynamics ?? {};
  const storedWindow = Number(storedRun.windowIndex) || 0;
  const ownWindow = Number(ownRun.windowIndex) || 0;
  if (storedWindow > ownWindow) return true;
  if (storedWindow < ownWindow) return false;
  const storedHold = splitOpenSeed(storedRun.openSeed);
  if (!storedHold.seed) return false;
  const ownHold = splitOpenSeed(ownRun.openSeed);
  return storedHold.token !== tabToken && storedHold.token !== ownHold.token;
}

/**
 * A recovery slot is a way back from a broken save, not a way back from the
 * wall. Restoring one rolls the story back to the slot; the table record since
 * the slot comes along. Busts settled after the slot stay in the log (as system
 * entries the ledger and the ending read), the pot they wiped stays wiped, the
 * board they broke stays broken, and the window count never goes backwards, so
 * the next window is a fresh draw.
 */
export function carryTableRecordIntoRestore(restored, current) {
  if (!restored || !current || restored.runId !== current.runId) return restored;
  const restoredRun = normalizeRunState(restored.dynamics);
  const currentRun = normalizeRunState(current.dynamics);
  if (currentRun.windowIndex <= restoredRun.windowIndex) return restored;
  const restoredLog = Array.isArray(restored.log) ? restored.log : [];
  const currentLog = Array.isArray(current.log) ? current.log : [];
  const sameCase = restored.currentCase === current.currentCase;
  const lostBusts = sameCase
    ? currentLog.slice(restoredLog.length).filter((entry) => entry?.threshold?.busted)
    : [];
  const bustedSince = currentRun.busts > restoredRun.busts;
  const carried = lostBusts.map((entry) => ({
    isSystemEvent: true,
    nodeId: entry.nodeId,
    caseId: entry.caseId,
    choiceId: "table-record-carry",
    title: "TABLE RECORD",
    choice: "복구 전에 난 BUST",
    effect: {},
    threshold: entry.threshold,
    resourcesBefore: restored.resources,
    resourcesAfter: restored.resources,
  }));
  return {
    ...restored,
    log: [...restoredLog, ...carried],
    dynamics: serializeRunState({
      ...restoredRun,
      windowIndex: currentRun.windowIndex,
      busts: Math.max(restoredRun.busts, currentRun.busts),
      cashes: Math.max(restoredRun.cashes, currentRun.cashes),
      bestMultiplier: Math.max(restoredRun.bestMultiplier, currentRun.bestMultiplier),
      runPot: bustedSince ? 0 : restoredRun.runPot,
      runGroove: bustedSince ? 0 : restoredRun.runGroove,
      streak: bustedSince ? 0 : restoredRun.streak,
      beatCombo: bustedSince ? 0 : restoredRun.beatCombo,
      bestCombo: Math.max(restoredRun.bestCombo, currentRun.bestCombo),
      bestFocusCombo: Math.max(restoredRun.bestFocusCombo, currentRun.bestFocusCombo),
      focusHits: Math.max(restoredRun.focusHits, currentRun.focusHits),
      focusPerfects: Math.max(restoredRun.focusPerfects, currentRun.focusPerfects),
      focusMisses: Math.max(restoredRun.focusMisses, currentRun.focusMisses),
      stanceMastery: normalizeStanceMastery({
        strike: Math.max(restoredRun.stanceMastery.strike, currentRun.stanceMastery.strike),
        steady: Math.max(restoredRun.stanceMastery.steady, currentRun.stanceMastery.steady),
        expose: Math.max(restoredRun.stanceMastery.expose, currentRun.stanceMastery.expose),
      }),
      // Relics are table record too: a rollback keeps what was drafted since and
      // cannot hand an INSURANCE payout back.
      relics: [...new Set([...restoredRun.relics, ...currentRun.relics])],
      relicOffer: [],
      insuranceSpent: restoredRun.insuranceSpent || currentRun.insuranceSpent,
      schema: bustedSince ? currentRun.schema : restoredRun.schema,
      lastOutcome: bustedSince ? "bust" : restoredRun.lastOutcome,
      openSeed: null,
      openCardId: null,
    }),
  };
}

/** The card the room plays for you when the window busts with nothing staged. */
export function getForcedCard(choices = [], schema = BASE_SCHEMA) {
  const playable = choices.filter((choice) => choice && choice.type !== "free");
  if (!playable.length) return null;
  const weight = (choice) => Math.abs(getCardBurn(choice, schema)?.value ?? 0);
  return playable.reduce((worst, choice) => (weight(choice) > weight(worst) ? choice : worst), playable[0]);
}

/**
 * The run's push record, rebuilt from the decision log so a resumed save and a
 * live run agree on it.
 */
export function createGauntletLedger(log = []) {
  let busts = 0;
  let cashes = 0;
  let bestMultiplier = 1;
  let potBanked = 0;
  let potLost = 0;
  let pushes = 0;
  let bestCombo = 0;
  let beatHits = 0;
  let perfects = 0;
  let slips = 0;
  let grooveBanked = 0;
  let focusHits = 0;
  let focusPerfects = 0;
  let focusMisses = 0;
  let bestFocusCombo = 0;
  const focusModes = { strike: 0, steady: 0, expose: 0 };
  const stanceMastery = normalizeStanceMastery();
  for (const entry of log) {
    const threshold = entry?.threshold;
    if (!threshold) continue;
    if (threshold.busted) busts += 1;
    else cashes += 1;
    bestMultiplier = Math.max(bestMultiplier, Number(threshold.potMultiplier) || 1);
    potBanked += Number(threshold.pot) || 0;
    potLost += Number(threshold.lostPot) || 0;
    pushes += Number(threshold.pushes) || 0;
    const tempo = threshold.tempo;
    if (tempo && typeof tempo === "object") {
      bestCombo = Math.max(bestCombo, Number(tempo.maxCombo) || 0);
      beatHits += Number(tempo.hits) || 0;
      perfects += Number(tempo.perfects) || 0;
      slips += Number(tempo.slips) || 0;
      grooveBanked += Number(tempo.groovePot) || 0;
    }
    const focus = threshold.focus;
    if (!focus || typeof focus !== "object") continue;
    focusHits += Number(focus.hits) || 0;
    focusPerfects += Number(focus.perfects) || 0;
    focusMisses += Number(focus.misses) || 0;
    bestFocusCombo = Math.max(bestFocusCombo, Number(focus.maxCombo) || 0);
    const mode = normalizeFocusMode(focus.mode);
    focusModes[mode] += Number(focus.hits) || Number(focus.misses) || 0;
    if (earnedStance(mode, Number(focus.charge) || 0, Number(focus.hits) || 0, threshold.busted ? "bust" : "cash")) {
      stanceMastery[mode] += 1;
    }
  }
  return {
    busts,
    cashes,
    bestMultiplier: round2(bestMultiplier),
    potBanked,
    potLost,
    pushes,
    bestCombo,
    beatHits,
    perfects,
    slips,
    grooveBanked,
    focusHits,
    focusPerfects,
    focusMisses,
    bestFocusCombo,
    focusModes,
    stanceMastery,
  };
}

export function createRunSummary(run) {
  const state = normalizeRunState(run);
  return {
    windowIndex: state.windowIndex,
    runPot: state.runPot,
    vault: state.vault,
    streak: state.streak,
    busts: state.busts,
    cashes: state.cashes,
    bestMultiplier: state.bestMultiplier,
    lastOutcome: state.lastOutcome,
    lastGauge: Math.round(state.lastGauge),
    beatCombo: state.beatCombo,
    bestCombo: state.bestCombo,
    bestFocusCombo: state.bestFocusCombo,
    focusHits: state.focusHits,
    focusPerfects: state.focusPerfects,
    focusMisses: state.focusMisses,
    stanceMastery: normalizeStanceMastery(state.stanceMastery),
    grooveVault: state.grooveVault,
    relics: [...state.relics],
    mutations: [...state.schema.mutations],
  };
}
