/**
 * Relics: the tools a run carries between cases.
 *
 * Every mutation the table deals is a punishment for something the player did.
 * Until relics, nothing went the other way: a season could only be survived,
 * never built. A relic is drafted when a case closes -- three offered, one kept
 * -- and it bends one rule of the table for the rest of the season. Most of
 * them soften a specific punishment, so the draft is a read of how this player
 * tends to break the board; HIGH ROLLER trades instead; the rarest are unlocked by
 * feats and stay unlocked across seasons in the codex.
 *
 * A relic never prints or narrows the wall. `check:pressure` plays every relic
 * alone and all of them together and holds the same invariants the bare table
 * holds: the heartbeat stays an instrument, and busting to skip stays a loss.
 *
 * This file is pure data and pure rules. The engine applies them; the codex
 * hook owns their persistence. The numbers a sentence quotes are the rule's own
 * (`tableRules.js`), so retuning a relic cannot leave its card saying the old one.
 */

import { objectParticle, subjectParticle } from "../playerLanguage.js";
import relicsCopy from "../copy/relics.js";
import { fill } from "../locale.js";
import {
  AFTERSHOCK_START,
  COLD_BLOOD_START,
  FRACTURE_RATE,
  GLASS_LENS_SEAL,
  HEAT_SINK_SECONDS,
  HEAT_SINK_SHARE,
  HIGH_ROLLER_CHIPS,
  HIGH_ROLLER_WALL,
  INSURANCE_SHARE,
  KINETIC_GRIP_CHIPS,
  LOCKPICK_SEAL,
  SEAL_BREAK_GAUGE,
  SILENCE_SECONDS,
  SPLINT_RATE,
  STEADY_ANCHOR_COOL,
  STEADY_ANCHOR_SECONDS,
} from "./tableRules.js";

export const RELIC_OFFER_SIZE = 3;
/**
 * How many relics a season carries at once. Twelve with no cap meant a season
 * that never passed held every relic open to it by case 15, and three of them
 * (INSURANCE, KINETIC GRIP, STETHOSCOPE) made 70% of what all twelve were
 * worth (day 10, item 6). With five, a draft that finds the slots full takes
 * the new relic only by putting one down, in the same answer.
 *
 * A season saved before the cap that already carries more keeps them: the cap
 * is checked when a relic is taken, never when a save is read, so such a run
 * still has to put one down to take another.
 */
export const RELIC_SLOTS = 5;
/** The logic streak that unlocks ENCORE: the streak at which the pot's bonus is full. */
const ENCORE_UNLOCK_COMBO = 8;
/** The pot the wall has to take from you before INSURANCE is on the table. */
export const INSURANCE_UNLOCK_LOSS = 5000;
/** The cash multiplier that unlocks HIGH ROLLER. */
const HIGH_ROLLER_UNLOCK_MULTIPLIER = 64;
/** A stance relic opens when its stance has reshaped enough charged cashes. */
export const STANCE_RELIC_UNLOCK_COUNT = 3;

const relicWords = relicsCopy.relics;

/**
 * One relic: its fixed parts, and its words (src/copy/relics.js) with the
 * rule's numbers filled in. `softens` is the mutation it softens, `unlock`
 * the feat's id; a relic with no feat has `unlock: null`.
 */
function relic(id, { label, icon, softens = null, unlock = null }, values = {}) {
  const words = relicWords[id];
  const say = (line) => fill(line, values);
  return {
    label,
    name: words.name,
    icon,
    text: say(words.text),
    proc: say(words.proc),
    ...(softens ? { softens: { mutation: softens, text: say(words.softens) } } : {}),
    unlock: unlock ? { id: unlock, text: say(words.unlock) } : null,
  };
}

export const RELICS = Object.freeze({
  metronome: relic("metronome", { label: "METRONOME", icon: "timer" }),
  coldBlood: relic("coldBlood", { label: "COLD BLOOD", icon: "snowflake", softens: "aftershock" }, {
    start: AFTERSHOCK_START, particle: subjectParticle(String(AFTERSHOCK_START)), cold: COLD_BLOOD_START,
  }),
  heatSink: relic("heatSink", { label: "HEAT SINK", icon: "fan", softens: "heatDebt" }, { share: HEAT_SINK_SHARE, seconds: HEAT_SINK_SECONDS }),
  lockpick: relic("lockpick", { label: "LOCKPICK", icon: "key", softens: "coldFeet" }, {
    seal: SEAL_BREAK_GAUGE, particle: subjectParticle(String(SEAL_BREAK_GAUGE)), pick: LOCKPICK_SEAL,
  }),
  splint: relic("splint", { label: "SPLINT", icon: "bandage", softens: "fracture" }, { rate: FRACTURE_RATE, splint: SPLINT_RATE }),
  encore: relic("encore", { label: "ENCORE", icon: "repeat", unlock: "combo" }, { combo: ENCORE_UNLOCK_COMBO }),
  insurance: relic("insurance", { label: "INSURANCE", icon: "shield", unlock: "loss" }, {
    share: INSURANCE_SHARE, loss: INSURANCE_UNLOCK_LOSS.toLocaleString("en-US"),
  }),
  highRoller: relic("highRoller", { label: "HIGH ROLLER", icon: "gem", unlock: "multiplier" }, {
    chips: HIGH_ROLLER_CHIPS, wall: HIGH_ROLLER_WALL, multiplier: HIGH_ROLLER_UNLOCK_MULTIPLIER,
  }),
  stethoscope: relic("stethoscope", { label: "STETHOSCOPE", icon: "stethoscope", softens: "silence", unlock: "silence" }, { seconds: SILENCE_SECONDS }),
  kineticGrip: relic("kineticGrip", { label: "KINETIC GRIP", icon: "crosshair", softens: "strikeMastery", unlock: "strikeMastery" }, {
    chips: KINETIC_GRIP_CHIPS, count: STANCE_RELIC_UNLOCK_COUNT,
  }),
  steadyAnchor: relic("steadyAnchor", { label: "STEADY ANCHOR", icon: "anchor", softens: "steadyMastery", unlock: "steadyMastery" }, {
    cool: STEADY_ANCHOR_COOL, particle: objectParticle(String(STEADY_ANCHOR_COOL)), seconds: STEADY_ANCHOR_SECONDS, count: STANCE_RELIC_UNLOCK_COUNT,
  }),
  glassLens: relic("glassLens", { label: "GLASS LENS", icon: "eye", softens: "exposeMastery", unlock: "exposeMastery" }, {
    seal: GLASS_LENS_SEAL, count: STANCE_RELIC_UNLOCK_COUNT,
  }),
});

export const RELIC_IDS = Object.freeze(Object.keys(RELICS));
/** Relics every season can draft without unlocking anything. */
export const DEFAULT_RELIC_POOL = Object.freeze(RELIC_IDS.filter((id) => !RELICS[id].unlock));

/**
 * Known ids, each once, in the order given. The default limit is every relic,
 * not `RELIC_SLOTS`: a season saved before the cap is read as it was saved.
 */
export function normalizeRelicIds(value, limit = RELIC_IDS.length) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  for (const id of value) {
    if (typeof id === "string" && RELICS[id] && !seen.has(id)) seen.add(id);
    if (seen.size >= limit) break;
  }
  return [...seen];
}

export function hasRelic(relics, id) {
  return Array.isArray(relics) && relics.includes(id);
}

/** The relic that softened a mutation on this board, if the board carries it. */
export function getSofteningRelic(mutationId, relics) {
  return RELIC_IDS.find((id) => RELICS[id].softens?.mutation === mutationId && hasRelic(relics, id)) ?? null;
}

/**
 * The feats a settled window proves. Each unlock is keyed to a moment the
 * player will remember -- a combo, a loss, a hot cash, a silenced heart -- so
 * a relic arriving in the codex reads as something earned, not a timer.
 */
export function getRelicUnlocks({ verdict, nextRun } = {}, unlocked = []) {
  if (!verdict) return [];
  const earned = [];
  const maxCombo = Math.max(Number(verdict.logic?.streak) || 0, Number(nextRun?.logic?.best) || 0);
  const mastery = nextRun?.stanceMastery && typeof nextRun.stanceMastery === "object" ? nextRun.stanceMastery : {};
  if (maxCombo >= ENCORE_UNLOCK_COMBO) earned.push("encore");
  if (verdict.outcome === "bust" && (Number(verdict.lostPot) || 0) + (Number(verdict.insuredPot) || 0) >= INSURANCE_UNLOCK_LOSS) earned.push("insurance");
  if (verdict.outcome === "cash" && (Number(verdict.multiplier) || 0) >= HIGH_ROLLER_UNLOCK_MULTIPLIER) earned.push("highRoller");
  if (Array.isArray(verdict.nextMutations) && verdict.nextMutations.some((mutation) => mutation.id === "silence")) earned.push("stethoscope");
  if ((Number(mastery.strike) || 0) >= STANCE_RELIC_UNLOCK_COUNT) earned.push("kineticGrip");
  if ((Number(mastery.steady) || 0) >= STANCE_RELIC_UNLOCK_COUNT) earned.push("steadyAnchor");
  if ((Number(mastery.expose) || 0) >= STANCE_RELIC_UNLOCK_COUNT) earned.push("glassLens");
  return earned.filter((id) => !hasRelic(unlocked, id));
}

/** Everything a season can draft: the defaults plus whatever the codex holds. */
export function getRelicPool(unlocked = []) {
  return RELIC_IDS.filter((id) => !RELICS[id].unlock || hasRelic(unlocked, id));
}
