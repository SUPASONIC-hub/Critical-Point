/**
 * Which ruling a finished season reached, as one word: the collapse, one of the
 * three verdicts of the final choice, or the open verdict.
 *
 * It is the judgement `getFinalVerdict` (endingCopy.js) prints the ruling by,
 * taken out on its own so that what NEW GAME+ carries into the next season
 * (newGamePlusCarry.js) is read by the same rule without bringing the report's
 * copy into the chunk that starts a season. The two cannot part:
 * `getFinalVerdict` asks this function.
 */

/**
 * The endings each final choice's verdict can stand beside. The verdict and
 * the epilogue are read from two things -- the last card and the season's
 * ruling -- and ten pairs said opposite things: 폭로 printed "외부로 넘어가고"
 * above a QUIET COVER epilogue that says nothing came out.
 */
export const VERDICT_ENDINGS = Object.freeze({
  ending_seal: Object.freeze(["quiet-cover", "cold-justice", "field-pact", "open-question"]),
  ending_reform: Object.freeze(["open-oversight", "evidence-reform", "human-record", "cold-justice", "field-pact", "open-question"]),
  ending_expose: Object.freeze(["evidence-reform", "human-record", "field-pact", "open-question"]),
});

/**
 * "collapse" when the run failed; the final choice's id (`ending_seal`,
 * `ending_reform`, `ending_expose`) when it made one of the three and the
 * ending agrees with it; otherwise "open". `finalChoiceId` is the choice made
 * at the finale's last question (`f_choice`), not the card the finale closed
 * on.
 */
export function getVerdictKey({ endingVariant, finalChoiceId } = {}) {
  if (endingVariant?.failure === true) return "collapse";
  return Object.hasOwn(VERDICT_ENDINGS, finalChoiceId ?? "") && VERDICT_ENDINGS[finalChoiceId].includes(endingVariant?.id) ? finalChoiceId : "open";
}

/** The entry of the finale's last question in a log: the one `getVerdictKey` is asked about. */
export function findFinalChoiceEntry(log = []) {
  return [...(Array.isArray(log) ? log : [])].reverse().find((entry) => entry?.nodeId === "f_choice") ?? null;
}
