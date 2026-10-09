import { clamp, isResourceGain } from "../gameConstants.js";
import { objectParticle } from "../playerLanguage.js";
import { DEFAULT_RELIC_POOL, getSofteningRelic, hasRelic, normalizeRelicIds, RELIC_OFFER_SIZE } from "./relics.js";
import {
  AFTERSHOCK_START,
  BLACKOUT_WALL_SHIFT,
  COLD_BLOOD_START,
  COLD_FEET_CHIPS,
  FRACTURE_RATE,
  GLASS_LENS_SEAL,
  HEAT_DEBT_GAUGE,
  HEAT_DEBT_SECONDS,
  HEAT_DEBT_SHARE,
  HEAT_SINK_SECONDS,
  HEAT_SINK_SHARE,
  HIGH_ROLLER_CHIPS,
  HIGH_ROLLER_WALL,
  HOT_CASH_MULTIPLIER,
  INSURANCE_SHARE,
  KINETIC_GRIP_CHIPS,
  LOCKPICK_SEAL,
  METRONOME_REACH,
  OVERCLOCK_CHIPS,
  OVERCLOCK_STREAK,
  SEAL_BREAK_GAUGE,
  SILENCE_SECONDS,
  SPLINT_RATE,
  STEADY_ANCHOR_COOL,
  STEADY_ANCHOR_SECONDS,
  STEADY_LINE_COOL,
  STEADY_LINE_SECONDS,
  STEADY_LINE_WALL,
  STRIKE_WAKE_CHIPS,
} from "./tableRules.js";

export { FRACTURE_RATE, HOT_CASH_MULTIPLIER, METRONOME_REACH, SEAL_BREAK_GAUGE } from "./tableRules.js";

/**
 * The rules a window is played under when none are named: all of them. The
 * callers that know the case pass the case's own (`tableUnlocks.js`, a Set of
 * rule ids), and everything here only ever asks a set whether it `has` one.
 * The list itself is not imported: this module is in the chunk the start
 * screen loads to repair a save, and the list brings the prologues' copy.
 */
const ALL_RULES = Object.freeze({ has: () => true });

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
/**
 * The briefing before the table has a clock of its own. It is sized to what
 * the scene asks the player to read -- lead, body, case facts and question --
 * at a brisk Korean reading pace, with a floor so a short scene still lands.
 * When it runs out the table opens on its own; the player can open it, or
 * stake a card, any time before that.
 *
 * The ceiling sits above the longest scene in the season (690 characters, 49
 * seconds). At 35 it cut 86 scenes short -- the longest would have had to be
 * read at 24 characters a second, half again the pace this function assumes --
 * and the table opened by itself on a page nobody could have finished.
 */
export const READING_MIN_SECONDS = 12;
export const READING_MAX_SECONDS = 50;
const READING_CHARS_PER_SECOND = 16;
const READING_SETTLE_SECONDS = 6;

/**
 * `breach` is the PROTOCOL BREACH panel, when the page shows one: the changed
 * rules of this table, each printed as a label, a title and a sentence. They
 * are read on the same page against the same clock, and until 2026-10-08 they
 * were not counted -- the page that follows a bust carried the most text and
 * the clock of the scene alone. The ceiling is the same.
 */
export function getReadingSeconds(node = {}, breach = []) {
  const rules = breach.flatMap((rule) => [rule?.label, rule?.title, rule?.text]);
  const chars = [node.lead, node.text, node.question, ...(node.memo ?? []), ...rules]
    .filter(Boolean)
    .join("")
    .replace(/\s+/g, "").length;
  const seconds = Math.round(READING_SETTLE_SECONDS + chars / READING_CHARS_PER_SECOND);
  return Math.max(READING_MIN_SECONDS, Math.min(READING_MAX_SECONDS, seconds));
}

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

const round2 = (value) => Math.round(value * 100) / 100;
/**
 * Halves round away from zero on both sides. `Math.round` sends -7.5 to -7 and
 * 7.5 to 8, so a fractured trust -5 was billed -7 while a fatigue +5 was billed
 * 8, and a falling 사람 피해 rode the heat one point short of a rising 믿음.
 */
const roundAway = (value) => Math.sign(value) * Math.round(Math.abs(value));

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
/** How far from the wall the heartbeat starts to hear it. */
const TELL_SPAN = 44;

export function getCloseness(gauge, wall) {
  return clamp(1 - ((Number(wall) || GAUGE_MAX) - (Number(gauge) || 0)) / TELL_SPAN, 0, 1);
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
    // A rule the save holds as null takes the default: `Number(null)` is 0,
    // and a 0-second board clamped to the shortest clock is not what was saved.
    if (source[key] === null || source[key] === undefined) continue;
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
  // Priority 33, held here because every board ends here: one push from just
  // under the seal must not be able to reach the lowest wall. It used to hold
  // only by the modifiers happening to leave room, and HIGH ROLLER's closer wall
  // under OVERCLOCK and STRIKE WAKE's wider push left none (29 + 24 against a
  // wall that can sit at 52). The seal opens earlier on such a board; the push
  // and the wall stay what their rules made them.
  schema.sealBreak = clamp(Math.round(schema.sealBreak), 0, Math.min(SEAL_BREAK_GAUGE, Math.max(0, schema.wallMin - schema.stepMax)));
  schema.relics = normalizeRelicIds(source.relics);
  return schema;
}

/* ------------------------------------------------------------------ cards */

/**
 * The id the table gives 판을 다시 짠다, and what it is worth before heat.
 *
 * The card is not dealt from the scene's hand -- it is the one card every scene
 * has -- so it needs an id the hand cannot collide with. It was the bare string
 * "__wild__" spelled out in four places in the stage and one in the briefing.
 */
export const REFRAME_CARD_ID = "__reframe__";
export const WILD_CARD_CHIPS = 24;

/** Chips: what a card is worth before heat. The sum of what it gains. */
export function getCardChips(choice, schema = BASE_SCHEMA) {
  if (choice?.type === "reframe") return Math.round(WILD_CARD_CHIPS * normalizeSchema(schema).chipsScale);
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
      key === fracturedAxis && value !== 0 && !isResourceGain(key, value) ? [key, roundAway(value * rate)] : [key, value],
    ),
  );
}

/** The card a sealed hand locks: the richest one. Ties go to the earlier card. */
export function getSealedCardId(choices = [], schema = BASE_SCHEMA) {
  const normalized = normalizeSchema(schema);
  if (!normalized.sealHighest) return null;
  const playable = choices.filter((choice) => choice && choice.type !== "reframe");
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
    Object.entries(fractured).map(([key, value]) => [key, isResourceGain(key, value) ? roundAway(value * multiplier) : value]),
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
    text: "더 큰 판돈을 잠그지만, 헛치면 더 크게 막힌다.",
    gainScale: 1.15,
    missHeat: FOCUS_MISS_HEAT + 2,
    missSeconds: FOCUS_MISS_SECONDS,
    potRate: 1.15,
    resourceRate: 0.32,
    reliefPerHit: 0,
  },
  steady: {
    label: "STEADY",
    text: "보상은 작지만, LOCK마다 판이 식는다.",
    gainScale: 0.9,
    missHeat: Math.max(1, FOCUS_MISS_HEAT - 2),
    missSeconds: FOCUS_MISS_SECONDS * 0.8,
    potRate: 0.62,
    resourceRate: 0.34,
    reliefPerHit: 2,
  },
  expose: {
    label: "EXPOSE",
    text: "카드의 자원 효과를 키운다.",
    gainScale: 1,
    missHeat: FOCUS_MISS_HEAT,
    missSeconds: FOCUS_MISS_SECONDS,
    potRate: 0.78,
    resourceRate: 0.72,
    reliefPerHit: 0,
  },
});

const BEAT_GRADES = new Set(["perfect", "good", "miss"]);

/** The GOOD window in milliseconds for a beat of this period. */
export function getGoodWindowMs(periodMs, wide = false) {
  return Math.max(periodMs * BEAT_GOOD, BEAT_GOOD_FLOOR_MS) * (wide ? METRONOME_REACH : 1);
}

/**
 * Where a press landed against the beat: "perfect", "good", "miss", or null with
 * no beat to read. `wide` is METRONOME. `sinceBeatMs` may be negative: a
 * press up to one beat ahead of the stamp is read against the beat it preceded.
 */
export function judgeBeat(sinceBeatMs, periodMs, wide = false) {
  const period = Number(periodMs);
  const since = Number(sinceBeatMs);
  // A press stamped just before the beat it was aimed at -- the hand landed, then
  // the frame that sounds the beat ran -- is early by that much, not ungraded.
  // Further back than one beat there is no beat to have aimed at.
  if (!Number.isFinite(period) || period <= 0 || !Number.isFinite(since) || since < -period) return null;
  const phase = ((since % period) + period) % period;
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

/**
 * What the hand can add to a pot, the beat and LOCK together: the groove's own
 * cap. LOCK used to multiply on top of the groove with no ceiling of its own --
 * STRIKE at full charge was x2.15, x3.2 with a full groove -- and
 * `check:pressure`, which had only ever played hands that never locked, measured
 * a hand that locked and pushed on the beat at 3.5 times the best listening
 * policy and nearly twice a player who could see the wall. Timing had become
 * the strategy. The stances still differ in how fast they reach the cap, in
 * what they do to the card's resources, and in the board they carry forward.
 */
export const HAND_CAP = 1 + GROOVE_CAP;

export function getHandBonus(groove, focus, mode = "strike") {
  return round2(Math.min(HAND_CAP, getGrooveBonus(groove) * getFocusBonus(focus, mode).pot));
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

/** The charge a cash has to hold for its stance to count: toward mastery, and into the next board. */
export const STANCE_CHARGE = 70;

function earnedStance(mode, charge, hits, outcome) {
  return outcome === "cash" && FOCUS_MODES.includes(mode) && charge >= STANCE_CHARGE && hits > 0;
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

/** A clock scale as a window keeps it: 1 (the board's own clock) to 4 times slower. */
function normalizeTimeScale(value) {
  const scale = Number(value);
  return Number.isFinite(scale) ? clamp(scale, 1, 4) : 1;
}

/** The ways a window can bust on the table, as a hold written at closure records them. */
const CLOSED_CAUSES = new Set(["push", "creep", "timeout", "focus"]);
/**
 * Every way a window closes, as a verdict names it: the cash, the four busts
 * the table deals -- a push into the wall, the clock's heat reaching it, the
 * clock running out, a lock off the beat heating into it -- and a bet walked
 * away from. Whatever tells the player why reads this list, so a cause added
 * here without a sentence fails a test instead of borrowing another's.
 */
export const VERDICT_CAUSES = Object.freeze(["cash", ...CLOSED_CAUSES, "abandon"]);

export function createWindow({ schema = BASE_SCHEMA, seed = "0", abandoned = false, closedAs = null, beatCombo = 0, resume = null } = {}) {
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
    // How many times slower than the board's clock this window has been run,
    // at its slowest (the table-time comfort setting). It is the window's, and
    // it is saved with a window put down: the setting itself can be changed on
    // the intro between leaving a window and cashing it, and the ranking's
    // "played with a slower clock" mark used to read the setting at the cash.
    timeScale: 1,
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
  // A window that had already bust when the page went away (`closedAs`) comes
  // back the same way, and keeps what it bust on: running out the clock still
  // deals SILENCE, whether or not the page was reloaded under the slam.
  return abandoned ? { ...window, status: "bust", cause: "abandon", closedAs: CLOSED_CAUSES.has(closedAs) ? closedAs : null } : window;
}

const SUSPENDED_WINDOW_NUMBERS = [
  "gauge", "pushes", "lastStep", "elapsed", "beatCombo", "maxCombo", "groove", "beatHits", "perfects", "slips",
  "focus", "focusCombo", "maxFocusCombo", "focusHits", "focusPerfects", "focusMisses", "timeScale",
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
  restored.timeScale = normalizeTimeScale(restored.timeScale);
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
 *
 * `rules` is what the case plays under (`tableUnlocks`), and an event for a
 * rule the case does not have yet is ignored here, whatever the stage draws:
 * without `beat` a push is a push and its grade is not read -- no combo, no
 * groove, and no slip to pay for a beat nobody was shown; without `lock` a
 * FOCUS leaves the window as it was; without `stance` so does SET_FOCUS_MODE,
 * and the window stays in the stance it opened in (STRIKE). A window resumed
 * from a save keeps what it held -- that is the player's, and `resolveWindow`
 * decides what it is worth.
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

export function reduceWindow(window, event = {}, rules = ALL_RULES) {
  if (!window || window.status !== "live") return window;
  switch (event.type) {
    case "TICK": {
      const advanced = advanceClock(window, clamp(Number(event.delta) || 0, 0, 1));
      // The slowest the clock has run in this window (the table-time setting).
      const scale = normalizeTimeScale(event.scale);
      return scale > advanced.timeScale ? { ...advanced, timeScale: scale } : advanced;
    }
    case "PUSH": {
      const pushes = window.pushes + 1;
      const step = drawStep(window.schema, window.seed, pushes);
      const gauge = clamp(window.gauge + step, 0, GAUGE_MAX);
      const grade = rules.has("beat") && BEAT_GRADES.has(event.grade) ? event.grade : null;
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
      if (!window.selectedId || !rules.has("lock")) return window;
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
    case "SET_FOCUS_MODE": {
      // A charge belongs to the stance that built it. Changing stance used to
      // keep it, so a hand cooled the gauge with STEADY locks and cashed them as
      // STRIKE: the relief of one stance and the payout and carry of another.
      if (!rules.has("stance")) return window;
      const focusMode = normalizeFocusMode(event.mode);
      if (focusMode === normalizeFocusMode(window.focusMode)) return window;
      return { ...window, focusMode, focus: 0, focusCombo: 0, jammed: false, lastFocusGrade: null };
    }
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
  // How many of those windows were practice (a closed case played again). They
  // seed and order the table like any other window, and the season does not
  // lean in for them: see `getEscalationWindow`.
  practiceWindows: 0,
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
  // Set while a case that already closed is being played again: the table
  // record as it stood when the replay opened. See `openCaseRun`.
  practice: null,
  // The run was begun with NEW GAME+: its table has every rule from the first
  // window (`tableUnlocks`). A plain start on the same device does not.
  veteran: false,
  schema: BASE_SCHEMA,
});

const PRACTICE_RECORD_KEYS = ["busts", "cashes", "bestMultiplier", "potBanked", "potLost", "pushes", "bestCombo", "beatHits", "perfects", "slips", "grooveBanked"];

function normalizePractice(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const vault = Math.max(0, Math.round(Number(value.vault) || 0));
  const source = value.record && typeof value.record === "object" ? value.record : null;
  return {
    vault,
    grooveVault: clamp(Math.round(Number(value.grooveVault) || 0), 0, vault),
    relics: normalizeRelicIds(value.relics),
    relicOffer: normalizeRelicIds(value.relicOffer, RELIC_OFFER_SIZE),
    stanceMastery: normalizeStanceMastery(value.stanceMastery),
    bestMultiplier: clamp(Number(value.bestMultiplier) || 1, 1, 512),
    bestCombo: clamp(Math.trunc(Number(value.bestCombo) || 0), 0, 999),
    record: source ? Object.fromEntries(PRACTICE_RECORD_KEYS.map((key) => [key, Math.max(0, Number(source[key]) || 0)])) : null,
  };
}

export function normalizeRunState(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const run = { ...RUN_INITIAL_STATE };
  for (const key of ["windowIndex", "practiceWindows", "runPot", "vault", "streak", "busts", "cashes", "bestMultiplier", "lastGauge", "beatCombo", "bestCombo", "bestFocusCombo", "focusHits", "focusPerfects", "focusMisses", "runGroove", "grooveVault"]) {
    // A value the save does not hold, or holds as null, takes the default:
    // `Number(null)` is 0, which is finite, and used to be taken as written.
    if (source[key] === null || source[key] === undefined) continue;
    const numeric = Number(source[key]);
    if (Number.isFinite(numeric)) run[key] = numeric;
  }
  run.windowIndex = Math.max(0, Math.trunc(run.windowIndex));
  run.practiceWindows = clamp(Math.trunc(run.practiceWindows), 0, run.windowIndex);
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
  run.practice = normalizePractice(source.practice);
  run.veteran = source.veteran === true;
  run.lastOutcome = ["none", "cash", "bust"].includes(source.lastOutcome) ? source.lastOutcome : "none";
  run.openSeed = typeof source.openSeed === "string" ? source.openSeed.slice(0, 200) : null;
  run.openCardId = run.openSeed && typeof source.openCardId === "string" ? source.openCardId.slice(0, 200) : null;
  run.schema = normalizeSchema(source.schema);
  run.suspended = normalizeSuspendedWindow(source.suspended, run.windowIndex);
  return run;
}

export function serializeRunState(value) {
  const run = normalizeRunState(value);
  return {
    ...run,
    stanceMastery: normalizeStanceMastery(run.stanceMastery),
    practice: run.practice ? { ...run.practice, relics: [...run.practice.relics], relicOffer: [...run.practice.relicOffer] } : null,
    schema: { ...run.schema, mutations: [...run.schema.mutations] },
  };
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
    text: `임계점을 넘긴 대가. 다음 판은 카드의 칩과 소모가 가려지고, 벽이 ${BLACKOUT_WALL_SHIFT} 가까워진다.`,
  },
  aftershock: {
    label: "AFTERSHOCK",
    title: "여진이 남았다",
    text: `게이지가 ${AFTERSHOCK_START}에서 시작한다. 방금 터진 열이 아직 식지 않았다.`,
  },
  silence: {
    label: "SILENCE",
    title: "심장이 거짓말을 한다",
    text: `시간을 흘려보낸 대가. 다음 판은 심박이 벽을 알려주지 않고, 결정 시간이 ${SILENCE_SECONDS}초다.`,
  },
  heatDebt: {
    label: "HEAT DEBT",
    title: "탐욕은 열을 남긴다",
    text: `높은 배율로 확정한 대가. 이번 열의 ${HEAT_DEBT_SHARE}분의 1을 안고 시작하고, ${HEAT_DEBT_SECONDS}초를 잃는다.`,
  },
  overclock: {
    label: "OVERCLOCK",
    title: "판돈이 두 배로 뛴다",
    text: `연속으로 x${HOT_CASH_MULTIPLIER} 이상을 챙겼다. 칩이 ${OVERCLOCK_CHIPS}배지만, 한 번 밀 때 오르는 열도 커진다.`,
  },
  coldFeet: {
    label: "COLD FEET",
    title: "가장 좋은 카드가 봉인됐다",
    text: `밀지 않고 확정한 대가. 가장 비싼 카드는 게이지 ${SEAL_BREAK_GAUGE}${objectParticle(String(SEAL_BREAK_GAUGE))} 넘겨야 열리고, 칩이 줄어든다.`,
  },
  fracture: {
    label: "FRACTURE",
    title: "균열이 난 축",
    text: `방금 가장 크게 태운 축. 다음 판에서 그 축을 태우는 카드는 ${FRACTURE_RATE}배로 청구된다.`,
  },
  reboot: {
    label: "REBOOT",
    title: "사건이 닫혔다",
    text: "판돈은 금고로 옮겨졌고, 규칙이 초기화됐다. 이제 잃을 수 없다.",
  },
  strikeWake: {
    label: "STRIKE WAKE",
    title: "다음 판이 더 두껍게 깨어난다",
    text: `STRIKE로 채운 LOCK. 다음 판은 칩이 ${STRIKE_WAKE_CHIPS}배지만, 한 번 밀 때 오르는 열도 커진다.`,
  },
  steadyLine: {
    label: "STEADY LINE",
    title: "다음 판이 식은 채 열린다",
    text: `STEADY로 채운 LOCK. 다음 판은 열기 ${STEADY_LINE_COOL} 낮게 시작하고 시간이 ${STEADY_LINE_SECONDS}초 늘며, 벽이 ${STEADY_LINE_WALL} 멀어진다.`,
  },
  exposedHand: {
    label: "EXPOSED HAND",
    title: "다음 판은 패를 숨기지 못한다",
    text: "EXPOSE로 채운 LOCK. 다음 판은 카드가 뒤집히지 않고, COLD FEET 봉인도 풀린다.",
  },
  strikeMastery: {
    label: "STRIKE MASTERY",
    title: "시즌이 먼저 치는 법을 익혔다",
    text: "STRIKE LOCK을 거듭 채운 결과. 새 판마다 칩이 두꺼워지고, 밀 때 오르는 열이 1 늘어난다.",
  },
  steadyMastery: {
    label: "STEADY MASTERY",
    title: "시즌이 버티는 법을 익혔다",
    text: "STEADY LOCK을 거듭 채운 결과. 새 판마다 식은 채 시작하고, 시간이 조금 늘어난다.",
  },
  exposeMastery: {
    label: "EXPOSE MASTERY",
    title: "시즌이 판을 읽는 법을 익혔다",
    text: "EXPOSE LOCK을 거듭 채운 결과. 봉인이 더 일찍 열리고, 더 쌓이면 가려진 판도 숨지 못한다.",
  },
});

/**
 * What two of them say once EXPOSE mastery has taken half of the rule back.
 * A bust deals BLACKOUT and a cash with no push deals COLD FEET, and then the
 * season's mastery (or GLASS LENS on top of it) turns the cards face up and
 * lifts the seal. The id stays -- the wall is still closer, the chips are
 * still thinner -- but the briefing and the reveal went on printing "카드가
 * 가려지고" over a hand that was face up, and "봉인됐다" over a card that was
 * not.
 */
const LIFTED_MUTATIONS = Object.freeze({
  blackout: {
    lifted: (board) => !board.faceDown,
    title: "벽이 다가왔다",
    text: `임계점을 넘긴 대가. 벽이 ${BLACKOUT_WALL_SHIFT} 가까워진다. 카드는 EXPOSE 숙련이 뒤집히지 않게 막았다.`,
  },
  coldFeet: {
    lifted: (board) => !board.sealHighest,
    title: "칩이 줄었다",
    text: "밀지 않고 확정한 대가. 칩이 줄어든다. 봉인은 EXPOSE 숙련이 풀었다.",
  },
});

export function describeMutations(schema) {
  const board = normalizeSchema(schema);
  const { mutations, fracturedAxis, relics } = board;
  return mutations
    .filter((id) => MUTATIONS[id])
    .map((id) => {
      const { lifted, ...remainder } = LIFTED_MUTATIONS[id] ?? {};
      return { id, ...MUTATIONS[id], ...(lifted?.(board) ? remainder : null), axis: id === "fracture" ? fracturedAxis : null, softenedBy: getSofteningRelic(id, relics) };
    });
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
      next.chipsScale *= HIGH_ROLLER_CHIPS;
      next.wallMin -= HIGH_ROLLER_WALL;
      next.wallMax -= HIGH_ROLLER_WALL;
    }
    if (id === "lockpick") next.sealBreak = Math.min(next.sealBreak, LOCKPICK_SEAL);
    if (id === "splint") next.fractureRate = Math.min(next.fractureRate, SPLINT_RATE);
    if (id === "stethoscope") next.sedated = false;
    if (id === "coldBlood" && next.mutations.includes("aftershock")) next.startGauge = Math.min(next.startGauge, COLD_BLOOD_START);
    if (id === "kineticGrip") {
      if (next.mutations.includes("strikeMastery")) {
        next.stepMin = Math.max(BASE_SCHEMA.stepMin, next.stepMin - 1);
        next.stepMax = Math.max(BASE_SCHEMA.stepMax, next.stepMax - 1);
      }
      if (next.mutations.includes("strikeWake")) next.chipsScale *= KINETIC_GRIP_CHIPS;
    }
    if (id === "steadyAnchor" && next.mutations.includes("steadyMastery")) {
      next.startGauge = Math.max(0, next.startGauge - STEADY_ANCHOR_COOL);
      next.seconds += STEADY_ANCHOR_SECONDS;
    }
    if (id === "glassLens" && next.mutations.includes("exposeMastery")) {
      next.faceDown = false;
      next.sealHighest = false;
      next.sealBreak = Math.min(next.sealBreak, GLASS_LENS_SEAL);
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

/** What a practice run borrowed, handed back. */
function endPractice(run) {
  if (!run.practice) return run;
  const { record: _record, ...held } = run.practice;
  return { ...run, ...held, practice: null };
}

/**
 * The run a case opens with. A case that closed has already moved its pot to
 * the vault and dealt the REBOOT board -- and its relic offer -- so both stay.
 * A case abandoned mid-run forfeits its pot and opens on the base rules, with
 * the season's relics and the stances it has mastered applied.
 *
 * A case that already has a summary (`replayOf`) opens as practice. Playing a
 * closed case again used to bank a second pot into the vault, draft a second
 * relic and add to mastery every time, so the vault the ending reads per case
 * could be filled by repeating one. The replay plays the same table and keeps
 * none of it: the vault, the relics, the mastery and any draft still waiting
 * are remembered here and handed back when the replay closes or is left, the
 * summary keeps the table record of the case's first close, and its windows do
 * not move the season's schedule along (`getEscalationWindow`).
 *
 * "None of it" is the table. The story is the other way round, on purpose: a
 * case played again is that case as it now stands -- its outcome, what it cost
 * and what it carries into the next case replace the first play's (the retry
 * button says the earlier choices are thrown away), and the season counts the
 * case once (`getSeasonStrain`). Its ranking row replaces the run's earlier
 * one too, so repeating a case adds nothing to the board (useLocalRanking).
 *
 * `rules` is what the case being opened plays under. A board laid here follows
 * them; a REBOOT board and a draft the run already holds are kept as they are.
 */
export function openCaseRun(run, { replayOf = null, rules = ALL_RULES } = {}) {
  const opened = normalizeRunState(run);
  const current = endPractice(opened);
  const rebooted = current.schema.mutations.includes("reboot");
  // A replay left half way hands back the draft it was holding, like the rest.
  const offer = rebooted || opened.practice ? current.relicOffer : [];
  const practice = replayOf
    ? {
        vault: current.vault,
        grooveVault: current.grooveVault,
        relics: current.relics,
        relicOffer: offer,
        stanceMastery: current.stanceMastery,
        bestMultiplier: current.bestMultiplier,
        bestCombo: current.bestCombo,
        record: replayOf.pushRecord ?? null,
      }
    : null;
  return normalizeRunState({
    ...current,
    runPot: 0,
    runGroove: 0,
    insuranceSpent: false,
    practice,
    relicOffer: practice ? [] : offer,
    schema: rebooted
      ? current.schema
      : applyRelics(applySeasonEscalation(applyStanceMastery(BASE_SCHEMA, current.stanceMastery, rules), getEscalationWindow(current)), current.relics),
  });
}

/** Builds the next board from what just happened. */
/** A burn smaller than this is a scratch, not a fracture. */
export const FRACTURE_MIN_BURN = 10;

function applyFocusCarry(schema, { outcome, focusMode = "strike", focusCharge = 0, focusHits = 0 } = {}, rules = ALL_RULES) {
  if (!rules.has("stance") || !earnedStance(focusMode, focusCharge, focusHits, outcome)) return schema;
  const next = { ...schema, mutations: [...schema.mutations] };
  const addMutation = (id) => {
    if (!next.mutations.includes(id)) next.mutations.push(id);
  };
  if (focusMode === "strike") {
    next.chipsScale *= STRIKE_WAKE_CHIPS;
    next.stepMin += 2;
    next.stepMax += 3;
    addMutation("strikeWake");
  } else if (focusMode === "steady") {
    next.startGauge = Math.max(0, next.startGauge - STEADY_LINE_COOL);
    next.seconds += STEADY_LINE_SECONDS;
    next.wallMin += STEADY_LINE_WALL;
    next.wallMax += STEADY_LINE_WALL;
    addMutation("steadyLine");
  } else if (focusMode === "expose") {
    // Only a cash carries a stance, and a cash never deals BLACKOUT, so the
    // seal is all there is to lift.
    next.sealHighest = false;
    next.sealBreak = Math.min(next.sealBreak, 10);
    next.chipsScale = Math.max(next.chipsScale, BASE_SCHEMA.chipsScale);
    next.mutations = next.mutations.filter((id) => id !== "coldFeet");
    addMutation("exposedHand");
  }
  return next;
}

/**
 * The season's mastery, laid on a new board. It comes with the choice of
 * stance: a case that has no `stance` yet deals no mastery board, whatever the
 * run holds, and the run goes on holding it.
 */
function applyStanceMastery(schema, mastery = EMPTY_STANCE_MASTERY, rules = ALL_RULES) {
  if (!rules.has("stance")) return schema;
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

/**
 * The season leans in. A case late in the season used to play on exactly the
 * board the 프롤로그 did, and with the authored effects drifting slightly
 * smaller as the season went on, per-case peak pressure fell from 19-21 in the
 * first act to 14-16 from 사건 20 on: the fiftieth case was the easiest.
 *
 * Every `ESCALATION_STEP_WINDOWS` windows the run has played, the top of the
 * wall's band comes down by `ESCALATION_WALL_STEP` and the clock creeps a little
 * hotter, up to `ESCALATION_MAX_STEPS` steps -- about the length of a season.
 * Only the top of the band moves, so the lowest wall a board can draw, and with
 * it the sealed-card rule (`sealBreak - 1 + stepMax < wallMin`), is untouched,
 * and the band on the HUD still says exactly where the wall can be. It is read
 * off `windowIndex`, which a save carries and a restore never rolls back.
 */
export const ESCALATION_STEP_WINDOWS = 100;
export const ESCALATION_MAX_STEPS = 4;
const ESCALATION_WALL_STEP = 2;
const ESCALATION_CREEP_STEP = 0.03;

export function getSeasonEscalation(windowIndex = 0) {
  const steps = clamp(Math.floor((Number(windowIndex) || 0) / ESCALATION_STEP_WINDOWS), 0, ESCALATION_MAX_STEPS);
  return { steps, wallMax: -steps * ESCALATION_WALL_STEP, creep: round2(steps * ESCALATION_CREEP_STEP) };
}

/**
 * How far into the season the table has leaned: the windows the run has
 * played, less the ones that were practice. A replayed case keeps nothing
 * (`openCaseRun`), and that has to include the schedule -- every window used
 * to count, so replaying cases walked the wall down for the rest of the
 * season, for good.
 */
export function getEscalationWindow(run) {
  return Math.max(0, (Number(run?.windowIndex) || 0) - (Number(run?.practiceWindows) || 0));
}

function applySeasonEscalation(schema, windowIndex) {
  const { steps, wallMax, creep } = getSeasonEscalation(windowIndex);
  if (steps === 0) return schema;
  return { ...schema, wallMax: Math.max(schema.wallMin, schema.wallMax + wallMax), creep: round2(schema.creep + creep) };
}

/**
 * `rules` is what the board is dealt under (`tableUnlocks`): a way of breaking
 * the next board that the case does not have yet is not dealt, and the board
 * is the base one in that respect. The relics the run carries are applied
 * whatever the rules say -- they are held, not dealt -- and so is the season's
 * lean. With every rule, which is the default, this is the board it always was.
 */
export function buildNextSchema({ outcome, cause, gauge, pushes, streak, burnAxis, caseClosed, relics = [], focusMode = "strike", focusCharge = 0, focusHits = 0, stanceMastery = EMPTY_STANCE_MASTERY, windowIndex = 0, rules = ALL_RULES }) {
  if (caseClosed) return applyRelics(applySeasonEscalation(applyStanceMastery({ ...BASE_SCHEMA, mutations: ["reboot"] }, stanceMastery, rules), windowIndex), relics);
  const schema = { ...BASE_SCHEMA, mutations: [] };
  if (outcome === "bust") {
    if (rules.has("blackout")) {
      schema.faceDown = true;
      schema.wallMin -= BLACKOUT_WALL_SHIFT;
      schema.wallMax -= BLACKOUT_WALL_SHIFT;
      schema.mutations.push("blackout");
    }
    if (rules.has("aftershock")) {
      schema.startGauge = AFTERSHOCK_START;
      schema.mutations.push("aftershock");
    }
    if (cause === "timeout" && rules.has("silence")) {
      schema.sedated = true;
      schema.seconds = SILENCE_SECONDS;
      schema.mutations.push("silence");
    }
  } else {
    if (gauge >= HEAT_DEBT_GAUGE && rules.has("heatDebt")) {
      const sink = hasRelic(relics, "heatSink");
      schema.startGauge = Math.round(gauge / (sink ? HEAT_SINK_SHARE : HEAT_DEBT_SHARE));
      schema.seconds -= sink ? HEAT_SINK_SECONDS : HEAT_DEBT_SECONDS;
      schema.mutations.push("heatDebt");
    }
    if (streak >= OVERCLOCK_STREAK && rules.has("overclock")) {
      schema.chipsScale *= OVERCLOCK_CHIPS;
      schema.stepMin += 4;
      schema.stepMax += 6;
      schema.mutations.push("overclock");
    }
    if (pushes === 0 && rules.has("coldFeet")) {
      schema.sealHighest = true;
      schema.chipsScale *= COLD_FEET_CHIPS;
      schema.mutations.push("coldFeet");
    }
  }
  if (burnAxis && rules.has("fracture")) {
    schema.fracturedAxis = burnAxis;
    schema.mutations.push("fracture");
  }
  return applyRelics(applySeasonEscalation(applyStanceMastery(applyFocusCarry(schema, { outcome, focusMode, focusCharge, focusHits }, rules), stanceMastery, rules), windowIndex), relics);
}

const UNBEATEN = Object.freeze({ beatCombo: 0, maxCombo: 0, groove: 0, beatHits: 0, perfects: 0, slips: 0, lastGrade: null });
const UNLOCKED = Object.freeze({ focus: 0, focusCombo: 0, maxFocusCombo: 0, focusHits: 0, focusPerfects: 0, focusMisses: 0, jammed: false, lastFocusGrade: null });

/**
 * The window as the case's rules read it. What a rule the case does not have
 * would have earned is not there to be settled: no beat, no groove or combo;
 * no LOCK, no charge; no choice of stance, STRIKE. The reducer already refuses
 * those presses, so this only ever changes a window that came from somewhere
 * else -- a save made before the steps existed, a script. With every rule the
 * window is handed back as it is.
 */
function readWindowUnder(window, rules) {
  const beat = rules.has("beat");
  const lock = rules.has("lock");
  const stance = rules.has("stance");
  if (!window || (beat && lock && stance)) return window;
  return { ...window, ...(beat ? null : UNBEATEN), ...(lock ? null : UNLOCKED), ...(stance ? null : { focusMode: "strike" }) };
}

/**
 * Settles a closed window against the run. Returns the verdict the runtime logs
 * and the reveal prints, and the run state the next window is dealt from.
 *
 * `rules` is what the case on the table plays under, and decides what this
 * window can earn and how the next board can break:
 *
 *   beat       without it nothing of the tempo is credited, and the combo the
 *              run carries is neither added to nor taken.
 *   lock       without it there is no charge, so no LOCK pot and no stance.
 *   stance     without it LOCK is STRIKE, it carries nothing into the next
 *              board, and mastery does not advance.
 *   overclock  without it the chain is not counted. It used to be counted in
 *              every case, and counting it through the steps before OVERCLOCK
 *              would let the first cash of the step that has it deal one.
 *
 * `nextRules` is what the board dealt here will be played under: the same
 * rules, except on the window that closes a case, where the caller passes the
 * next case's. That board and the draft offered with it belong to the next
 * case, so a draft is offered only when the next case has `relics`. What the
 * run already holds -- relics, mastery, a draft still waiting, the board on
 * the table -- is left as it is under any rules.
 */
export function resolveWindow({ run, window: closedWindow, card, caseClosed = false, offerRelics = false, relicPool = DEFAULT_RELIC_POOL, rules = ALL_RULES, nextRules = rules }) {
  const window = readWindowUnder(closedWindow, rules);
  const current = normalizeRunState(run);
  const relics = current.relics;
  const outcome = window?.status === "cashed" ? "cash" : "bust";
  // A window that bust and was then reloaded under its slam comes back as left;
  // what it bust on is what breaks the next board.
  const cause = outcome === "cash" ? "cash" : (window?.cause === "abandon" && window?.closedAs) || window?.cause || "push";
  const gauge = clamp(Number(window?.gauge) || 0, 0, GAUGE_MAX);
  const multiplier = outcome === "cash" ? getMultiplier(gauge) : 0;
  const chips = card ? getCardChips(card, current.schema) : 0;
  const reachedGroove = Math.max(0, Number(window?.groove) || 0);
  const focusCharge = Math.max(0, Number(window?.focus) || 0);
  const focusMode = normalizeFocusMode(window?.focusMode);
  const focusBonus = outcome === "cash" ? getFocusBonus(focusCharge, focusMode) : getFocusBonus(0, focusMode);
  const handBonus = outcome === "cash" ? getHandBonus(reachedGroove, focusCharge, focusMode) : 1;
  const focusHits = Math.trunc(Number(window?.focusHits) || 0);
  // Practice builds no mastery, so it cannot be repeated into a stance relic either.
  const stanceMastery = current.practice || !rules.has("stance")
    ? current.stanceMastery
    : advanceStanceMastery(current.stanceMastery, { outcome, focusMode, focusCharge, focusHits });
  const basePot = outcome === "cash" ? Math.round(chips * multiplier) : 0;
  const pot = outcome === "cash" ? Math.round(chips * multiplier * handBonus) : 0;
  // The hand's share of the pot, told apart: what the beat earned, and what
  // LOCK added on top of it under the cap. It was one number called groove, so
  // a cash with no beat in it printed "GROOVE · 박자 0회".
  const groovePot = outcome === "cash" ? Math.min(pot, Math.round(chips * multiplier * getGrooveBonus(reachedGroove))) - basePot : 0;
  const focusPot = pot - basePot - groovePot;
  // INSURANCE: once a case, the wall leaves a third of the pot. At half it lifted
  // the best heartbeat play to 0.59 of a wall-seeing player, against a 0.60 cap.
  const insured = outcome === "bust" && hasRelic(relics, "insurance") && !current.insuranceSpent && current.runPot > 0;
  const insuredPot = insured ? Math.floor(current.runPot / INSURANCE_SHARE) : 0;
  const lostPot = outcome === "bust" ? current.runPot - insuredPot : 0;
  const windowCombo = Math.max(0, Math.trunc(Number(window?.beatCombo) || 0));
  const encored = outcome === "bust" && hasRelic(relics, "encore") && windowCombo > 0;
  // `runGroove` is the hand's whole share, beat and LOCK: the ending's vault
  // slack reads the vault without it, and neither is reading the table.
  const runGrooveAfter = outcome === "cash" ? current.runGroove + groovePot + focusPot : insured ? Math.floor(current.runGroove / INSURANCE_SHARE) : 0;
  const streak = rules.has("overclock") && outcome === "cash" && multiplier >= HOT_CASH_MULTIPLIER ? current.streak + 1 : 0;
  const runPotAfter = outcome === "cash" ? current.runPot + pot : insuredPot;
  // A practice run closes a case the table has already been paid for: nothing
  // moves to the vault, and the next case is dealt what the season held before.
  const practice = caseClosed ? current.practice : null;
  const secured = caseClosed && !practice ? runPotAfter : 0;
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
    relics: practice?.relics ?? relics,
    focusMode,
    focusCharge,
    focusHits,
    stanceMastery: practice?.stanceMastery ?? stanceMastery,
    windowIndex: getEscalationWindow(current) + (current.practice ? 0 : 1),
    rules: caseClosed ? nextRules : rules,
  });
  const nextMutations = describeMutations(nextSchema);
  const relicProcs = [
    ...(insured ? ["insurance"] : []),
    ...(encored ? ["encore"] : []),
    ...nextMutations.map((mutation) => mutation.softenedBy).filter(Boolean),
  ];
  const relicOffer = practice
    ? practice.relicOffer
    : caseClosed && offerRelics && nextRules.has("relics") ? drawRelicOffer(window?.seed ?? current.windowIndex, relicPool, relics) : [];
  const verdict = {
    outcome,
    cause,
    practice: Boolean(practice),
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
      // Carried on the closing entry of a replayed case, where the summary's
      // table record is read from (`createTableRecord`).
      ...(practice?.record ? { firstRecord: practice.record } : {}),
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
      // What LOCK added to this pot, after the hand's cap.
      potMultiplier: round2(handBonus / (outcome === "cash" ? getGrooveBonus(reachedGroove) : 1)),
      pot: focusPot,
      tier: focusBonus.tier,
      jammed: window?.jammed === true,
      stanceEarned: !current.practice && rules.has("stance") && earnedStance(focusMode, focusCharge, focusHits, outcome),
      masteryCount: stanceMastery[focusMode],
    },
  };
  const settled = {
    practice: current.practice,
    veteran: current.veteran,
    windowIndex: current.windowIndex + 1,
    practiceWindows: current.practiceWindows + (current.practice ? 1 : 0),
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
    beatCombo: !rules.has("beat") ? current.beatCombo : outcome === "cash" || encored ? windowCombo : 0,
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
  };
  return { verdict, nextRun: normalizeRunState(practice ? endPractice(settled) : settled) };
}

/**
 * Who holds a window. The saved `openSeed` is `<window seed>#<tab token>`: the
 * seed says which window was touched, the token says which tab touched it, so
 * a second tab on the same window can be told apart from a reload of the first.
 * A window that closed before it was settled adds `~<cause>` (`createOpenSeed`).
 */
export function splitOpenSeed(openSeed) {
  if (typeof openSeed !== "string" || !openSeed) return { seed: null, token: null, closedAs: null };
  const index = openSeed.lastIndexOf("#");
  if (index < 0) return { seed: openSeed, token: null, closedAs: null };
  const [token, closedAs = null] = openSeed.slice(index + 1).split(CLOSED_MARK);
  return { seed: openSeed.slice(0, index), token, closedAs: CLOSED_CAUSES.has(closedAs) ? closedAs : null };
}

/**
 * The hold a tab writes on a window. `closedAs` is set when the window has
 * already bust: the table writes that before the slam is painted, so a reload
 * under the slam -- with the wall on screen -- finds the window closed rather
 * than fresh. A window nobody touched used to leave no hold at all, and timing
 * out and pressing F5 dealt the same wall again with the answer known.
 */
const CLOSED_MARK = "~";

export function createOpenSeed(seed, tabToken, closedAs = null) {
  return `${seed}#${tabToken}${CLOSED_CAUSES.has(closedAs) ? `${CLOSED_MARK}${closedAs}` : ""}`;
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
      practiceWindows: Math.max(restoredRun.practiceWindows, currentRun.practiceWindows),
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
  const playable = choices.filter((choice) => choice && choice.type !== "reframe");
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
  };
}

/**
 * The table record a case summary keeps. A replayed case keeps the record its
 * first close wrote: the replay is practice, and a clean second walk must not
 * take a bust out of the season the ending reads.
 */
export function createTableRecord(log = []) {
  const first = log.findLast((entry) => entry?.threshold?.tempo?.firstRecord)?.threshold.tempo.firstRecord;
  return first ? { ...createGauntletLedger([]), ...first } : createGauntletLedger(log);
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
