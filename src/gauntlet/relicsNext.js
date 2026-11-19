/**
 * G4 (2026-11-19, 「전부 1」): the tools made conditional and big.
 *
 * check:pressure measured the tools of C-7 barely moving play: a heartbeat hand
 * banked 17,992 with none and 19,535 with the best (INSURANCE, +8.6%), and
 * AUDIT CONTACT did nothing outside the audit. Under the next rules
 * (nextTable.js) most tools keep what they did and add one condition that pays:
 * when the condition holds on a cash, the pot of that cash is multiplied by the
 * tool's `boost`. Each condition asks the player to play a certain way -- cash
 * early, push hot, keep one side, switch, cash fast, cash on a broken board --
 * so a tool is a plan, not a small softening.
 *
 * Pure: the engine hands in what the window was (`resolveWindow`) and reads the
 * product back. The numbers are the cards' own (src/copy/relics.js `next`).
 */

/** AUDIT CONTACT: a cash under this heat, with at least one push, pays `boost`. */
export const LOW_CASH_HEAT = 45;
/** HEAT SINK: a cash at or over this heat pays `boost`. */
export const HOT_CASH_HEAT = 70;
/** FIELD NOTES: a streak of this many on one side pays `boost`. */
export const SIDE_STREAK = 5;
/** TESTIMONY: a cash with at least this share of the clock left pays `boost`. */
export const FAST_CASH_SHARE = 0.5;

/**
 * The pot multiplier per tool and what it asks. `when` reads the cash:
 * `gauge`, `pushes`, `move` (the streak's move this window), `streak`,
 * `afterBust` (the window before was a bust), `mutations` (the board's),
 * `clockLeft` (share of the clock left), `focusMode`, `focusCharged`.
 */
export const RELIC_BOOSTS = Object.freeze({
  auditContact: Object.freeze({ boost: 1.5, when: (cash) => cash.pushes > 0 && cash.gauge < LOW_CASH_HEAT }),
  heatSink: Object.freeze({ boost: 1.3, when: (cash) => cash.gauge >= HOT_CASH_HEAT }),
  fieldNote: Object.freeze({ boost: 1.25, when: (cash) => cash.streak >= SIDE_STREAK }),
  metronome: Object.freeze({ boost: 1.4, when: (cash) => cash.move === "switch" }),
  coldBlood: Object.freeze({ boost: 1.3, when: (cash) => cash.afterBust }),
  carbonCopy: Object.freeze({ boost: 1.5, when: (cash) => cash.mutations.includes("blackout") }),
  testimony: Object.freeze({ boost: 1.2, when: (cash) => cash.clockLeft >= FAST_CASH_SHARE }),
  frontPage: Object.freeze({ boost: 1.3, when: (cash) => cash.mutations.includes("overclock") }),
  stethoscope: Object.freeze({ boost: 1.5, when: (cash) => cash.mutations.includes("silence") }),
  kineticGrip: Object.freeze({ boost: 1.2, when: (cash) => cash.focusMode === "strike" && cash.focusCharged }),
});

/** The tools whose condition held on this cash, and the product of their boosts. */
export function readRelicBoost(relics, cash) {
  const held = Array.isArray(relics) ? relics : [];
  const fired = held.filter((id) => Object.hasOwn(RELIC_BOOSTS, id) && RELIC_BOOSTS[id].when(cash));
  return { fired, factor: fired.reduce((product, id) => product * RELIC_BOOSTS[id].boost, 1) };
}

/** What the draft costs under the next rules: the reroll 1,500 (was 4,000); one more stays 12,000, once a season. */
export const NEXT_REROLL_COST = 1500;

/** The card's numbers as percent, for the words. */
export const boostPercent = (id) => Math.round((RELIC_BOOSTS[id].boost - 1) * 100);
