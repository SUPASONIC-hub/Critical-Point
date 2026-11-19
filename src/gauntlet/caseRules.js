/**
 * 「이번 사건만」 (N26, 다음 개선점 2차 2026-11-16, Q3 (1)): four cases in
 * 사건 08-17 play under one of the week's rules for that case alone.
 *
 * 사건 08 to 17 are the longest stretch with nothing new on the table: the
 * ladder (tableUnlocks.js) turns its last rule on in 사건 03, and the next
 * thing that changes a board is 사건 12's 「고점 판」. Four of the ten get a
 * rule the weekly catalogue already has (weeklyRules.js
 * `WEEK_RULE_CATALOGUE`) -- no new rule, no new engine code: the board is
 * dealt with the rule laid over it exactly as a week's would be
 * (gauntletEngine.js `getTableSchema`).
 *
 * Which four, and which rule each (the case's story first, then the order):
 * - 사건 09, the 72 hours again: SHORT CLOCK, the clock shorter and the chips
 *   thicker, so the first one pays for itself;
 * - 사건 11, the hearing everyone watches: NEAR WALL;
 * - 사건 14, the fund that buys the bad loans at 92: HEAVY FRACTURE;
 * - 사건 16, the robots leased for the night shift: CRISIS WEEK.
 * Not 사건 08 or 13, the first cases of acts 2 and 3, which are quiet tables
 * (fxVariables.js); not 사건 12, which is a peak already (`PEAK_CASES`); not
 * 사건 17, the case before 사건 18's peak. Only the board's own numbers move
 * (`schema` rules), never the devices a week may switch on (`erosion`,
 * `shock`): those are tried out as weeks first.
 *
 * A case's rule stands aside for the week's (`caseRuleFor`): a season that
 * took a week's rule plays every case under it and under nothing else, so no
 * board is ever dealt two rules at once. A story run has neither. NEW GAME+
 * has both, like the peak.
 *
 * A leaf module, like tableRules.js: no imports, so the PlayScreen chunk
 * (tableStaging.js) can ask which case has a rule without the catalogue.
 *
 * Ships with the 11-30 reset (묶음 R): a rule on a board is a change of the
 * ranking's table, and the ranking only changes on a reset.
 */

/** The switch. Off, no case has a rule of its own: the table as it was before N26. */
export const CASE_RULES_ON = true;

/** The case and the catalogue id it plays under. */
export const CASE_RULES = Object.freeze({
  case09: "short-clock",
  case11: "near-wall",
  case14: "heavy-fracture",
  case16: "crisis-week",
});

/**
 * The rule a case plays under for itself, or null: none for a case not listed,
 * in a story run, in a season that carries a week's rule, and with the switch
 * off. `run` is the gauntlet's run (the save's `dynamics`).
 */
export function caseRuleFor(caseId, run, on = CASE_RULES_ON) {
  if (!on || typeof caseId !== "string" || !Object.hasOwn(CASE_RULES, caseId)) return null;
  if (run?.story === true || (typeof run?.weekRule === "string" && run.weekRule)) return null;
  return CASE_RULES[caseId];
}
