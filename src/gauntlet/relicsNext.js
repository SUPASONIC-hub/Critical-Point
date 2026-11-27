/**
 * G4 (2026-11-19, 「전부 1」): the tools made conditional and big.
 *
 * check:pressure measured the tools of C-7 barely moving play: a heartbeat hand
 * banked 17,992 with none and 19,535 with the best (INSURANCE, +8.6%), and
 * AUDIT CONTACT did nothing outside the audit. Under the next rules
 * (nextTableRules.js `isNextOn`) most tools keep what they did and add one condition that pays:
 * when the condition holds on a cash, the pot of that cash is multiplied by the
 * tool's `boost`. Each condition asks the player to play a certain way -- cash
 * early, push hot, keep one side, switch, cash fast, cash on a broken board --
 * so a tool is a plan, not a small softening.
 *
 * Pure: the engine hands in what the window was (`resolveWindow`) and reads the
 * product back. The numbers are the cards' own (src/copy/relics.js `next`).
 */
import { FRONT_PAGE_BOOST_FOURTEEN, isMarkFourteenOn } from "./nextTableRules.js";

/** AUDIT CONTACT: a cash under this heat, with at least one push, pays `boost`. */
export const LOW_CASH_HEAT = 50;
/** HEAT SINK: a cash at or over this heat pays `boost`. */
export const HOT_CASH_HEAT = 75;
/** FIELD NOTES: a streak of this many on one side pays `boost`. */
export const SIDE_STREAK = 5;
/** ENCORE: a streak of this many pays `boost`. Small: the streak hands hold one this long on most cashes, and with G1 halving instead of ending the streak ENCORE already lifts them about 7% (at 1.3 it lifted a switching hand 39%, past RELIC_LIFT_CAP). */
export const LONG_STREAK = 8;
/** TESTIMONY: a cash with at least this share of the clock left pays `boost`. */
const FAST_CASH_SHARE = 0.5;

/**
 * The pot multiplier per tool and what it asks. `when` reads the cash:
 * `gauge`, `pushes`, `move` (the streak's move this window), `streak`,
 * `afterBust` (the window before was a bust), `mutations` (the board's),
 * `clockLeft` (share of the clock left), `focusMode`, `focusCharged`.
 */
// G12 (11-20, 게임성 개선점 Q6 (1)): METRONOME 1.4 -> 1.7, CARBON COPY 1.5 -> 1.7, FRONT PAGE 1.15 -> 1.2 (the paper's 1.12
// left the spread x1.128, under the x1.15 the report asks; 1.25 made it every hand's best),
// COLD BLOOD's AFTERSHOCK-free board also stands its wall COLD_BLOOD_WALL further (gauntletEngine.js).
export const COLD_BLOOD_WALL = 2;
export const RELIC_BOOSTS = Object.freeze({
  auditContact: Object.freeze({ boost: 1.8, when: (cash) => cash.pushes > 0 && cash.gauge < LOW_CASH_HEAT }),
  heatSink: Object.freeze({ boost: 1.6, when: (cash) => cash.gauge >= HOT_CASH_HEAT }),
  fieldNote: Object.freeze({ boost: 1.25, when: (cash) => cash.streak >= SIDE_STREAK }),
  encore: Object.freeze({ boost: 1.15, when: (cash) => cash.streak >= LONG_STREAK }),
  // G21 (RULES_MARK 8): also the first board after METRONOME_HOLD in a row on one direction (`heldPast`, set by the settlement).
  metronome: Object.freeze({ boost: 1.7, when: (cash) => cash.move === "switch" || cash.heldPast === true }),
  coldBlood: Object.freeze({ boost: 2, when: (cash) => cash.afterBust }),
  carbonCopy: Object.freeze({ boost: 1.7, when: (cash) => cash.mutations.includes("blackout") }),
  testimony: Object.freeze({ boost: 1.1, when: (cash) => cash.clockLeft >= FAST_CASH_SHARE }),
  frontPage: Object.freeze({ boost: 1.2, when: (cash) => cash.mutations.includes("overclock") }),
  stethoscope: Object.freeze({ boost: 1.5, when: (cash) => cash.mutations.includes("silence") }),
  kineticGrip: Object.freeze({ boost: 1.2, when: (cash) => cash.focusMode === "strike" && cash.focusCharged }),
});

/**
 * G11c (RULES_MARK 7, 2026-11-25): the most the tools' boosts may multiply one
 * cash's pot together. They multiplied without end, so a season's end that held
 * three tools whose conditions met (HEAT SINK, COLD BLOOD and FRONT PAGE on one
 * hot board after a bust) paid ×3.68 and the vault of every tool ran ×2.17 the
 * vault of none (게임성 개선점 G11).
 */
export const RELIC_BOOST_CAP = 1.6;

/** One tool's boost under `rules`: RELIC_BOOSTS', but FRONT PAGE's FRONT_PAGE_BOOST_FOURTEEN from RULES_MARK 14 (G51). */
export function getRelicBoost(id, rules) {
  return id === "frontPage" && isMarkFourteenOn(rules) ? FRONT_PAGE_BOOST_FOURTEEN : RELIC_BOOSTS[id].boost;
}

/**
 * The tools whose condition held on this cash, and the product of their boosts.
 * Under RULES_MARK 7 (`cap`, RELIC_BOOST_CAP) two or more that held together pay
 * no more than the cap, or than the biggest of them alone where that is more
 * (AUDIT CONTACT ×1.8, COLD BLOOD ×2): a second tool never takes from the first.
 * `capped` when the cap cut the product.
 */
export function readRelicBoost(relics, cash, cap = Infinity, refined = [], rules = undefined) {
  const boostOf = (id) => (refined.includes(id) ? getRefinedBoost(id, rules) : getRelicBoost(id, rules));
  const held = Array.isArray(relics) ? relics : [];
  const fired = held.filter((id) => Object.hasOwn(RELIC_BOOSTS, id) && RELIC_BOOSTS[id].when(cash));
  const product = fired.reduce((total, id) => total * boostOf(id), 1);
  const most = fired.length > 1 ? Math.max(cap, ...fired.map(boostOf)) : Infinity;
  return product > most ? { fired, factor: most, capped: true } : { fired, factor: product };
}

/** What the draft costs under the next rules: the reroll 1,500 (was 4,000); one more stays 12,000, once a season. */
export const NEXT_REROLL_COST = 1500;

/** G25 도구 다듬기 (RULES_MARK 8): once a season per tool, for this much; the tool's bonus is REFINE_SHARE times what it was. */
export const REFINE_COST = 8000;
export const REFINE_SHARE = 1.5;
export const getRefinedBoost = (id, rules) => Math.round((1 + (getRelicBoost(id, rules) - 1) * REFINE_SHARE) * 1000) / 1000;
/** The held tools that can still be refined: those with a boost, not refined yet. */
export const listRefinable = (relics = [], refined = []) => relics.filter((id) => Object.hasOwn(RELIC_BOOSTS, id) && !refined.includes(id));

/** The card's numbers as percent, for the words. */
export const boostPercent = (id, rules) => Math.round((getRelicBoost(id, rules) - 1) * 100);
