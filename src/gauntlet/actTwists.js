/**
 * G5 (2026-11-19, 「전부 1」): one table twist for each of acts 3, 5 and 7
 * (B-11's acts, actCardCopy.js), under the next rules (nextTable.js).
 *
 * After the prologue and 사건 01-03 bring in the rules, 사건 01-49 played with
 * the same numbers (the bot banked the same in every case), and N26
 * (caseRules.js) gave four cases a rule of their own. A twist is the same kind
 * of thing for a whole act, told by the act's story:
 *
 * - 3막 「사슬은 반복된다」 (사건 13-18): 합병. The group stages its reform by
 *   merging: every card's chips `MERGER_CHIPS` times, the wall's band
 *   `MERGER_SHIFT` closer. A bigger table and a nearer wall.
 * - 5막 「흩어진 자리」 (사건 25-30): 흩어진 자리. The lab's people are scattered
 *   and every desk's wall stands somewhere else: the band `SCATTER_SPREAD`
 *   wider on both sides, the chips `SCATTER_CHIPS` times.
 * - 7막 「기록의 전쟁」 (사건 37-42): 청문회. The hearing over whose records they
 *   are: the clock `HEARING_CLOCK` of itself (30% shorter), the chips `HEARING_CHIPS` times.
 *
 * Laid over the board the way N26's case rules are (gauntletEngine.js
 * `getTableSchema` via `caseRuleFor`), with the same rule: a case's own rule
 * (사건 14, 16) stands in front of the act's, and a season with a week's rule
 * plays only the week's. Acts 1, 2, 4, 6 and 8 have none yet (January).
 *
 * A leaf module, like caseRules.js: the entries are numbers only; their words
 * are src/copy/weekRules.js `actTwists` (weeklyRules.js `getActTwist`).
 */

export const MERGER_CHIPS = 1.5;
export const MERGER_SHIFT = 4;
export const SCATTER_SPREAD = 4;
export const SCATTER_CHIPS = 1.15;
export const HEARING_CLOCK = 0.7;
export const HEARING_CHIPS = 1.25;

/** The twist's numbers, in the catalogue's schema terms (weeklyRules.js `weekRuleOverlay`). */
export const ACT_TWIST_RULES = Object.freeze({
  merger: Object.freeze({ label: "MERGER", act: 3, schema: Object.freeze({ wallShift: -MERGER_SHIFT, chipsFactor: MERGER_CHIPS }) }),
  scattered: Object.freeze({ label: "SCATTERED", act: 5, schema: Object.freeze({ wallSpread: SCATTER_SPREAD, chipsFactor: SCATTER_CHIPS }) }),
  hearing: Object.freeze({ label: "HEARING", act: 7, schema: Object.freeze({ secondsFactor: HEARING_CLOCK, chipsFactor: HEARING_CHIPS }) }),
});

const span = (from, to, id) => Object.fromEntries(Array.from({ length: to - from + 1 }, (_, at) => [`case${from + at}`, id]));

/** The cases each twist is dealt in: the act's six. */
export const ACT_TWIST_CASES = Object.freeze({ ...span(13, 18, "merger"), ...span(25, 30, "scattered"), ...span(37, 42, "hearing") });
