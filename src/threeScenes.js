import { nodes } from "./gameData.js";
import { findFinalChoiceEntry } from "./verdictBranch.js";
import endingCopy from "./copy/ending.js";
import { fill } from "./locale.js";

/**
 * B-12(2) 「당신의 세 장면」: three cards of this player's season, named on the
 * closing report in the order they were played. Each is a scene where a name
 * goes into a blank -- whose name the 4,000만 원 went on (프롤로그 01), who signs
 * the fifth box (사건 48), and how the last box is closed (마지막 사건).
 *
 * Read off the record the season already keeps, and nothing is written back:
 * an earlier case's card from its summary in `caseResults` (the run's log is
 * cleared when the next case opens), the finale's from the finale's own log.
 * `field` says which card of the summary: the outcome card, or the card of the
 * case's last scene before the outcome (`finalChoiceId`, the one far callbacks
 * read too, farCallbacks.js). A card is shown only when it is one the scene
 * itself deals, so a save from before the field, a case not played, a card
 * the runtime built (adaptive reframe, bridge, memory) or a route that skipped
 * the scene shows nothing for it. The finale's card is left out when the clock
 * played it (`threshold.forced`): not the player's pick. An earlier case's
 * summary does not say whether its card was forced, so that card is shown.
 */
export const THREE_SCENES = Object.freeze([
  { caseId: "prologue01", sceneId: "p1_aftershock", field: "outcomeChoiceId" },
  { caseId: "case48", sceneId: "c48_final", field: "finalChoiceId" },
  { caseId: "final", sceneId: "f_choice", field: "finalChoiceId" },
]);

/** The section's heading for `count` scenes: 「당신의 세 장면」 when all three are there. */
export function threeScenesHeading(count) {
  const { heading, counts } = endingCopy.threeScenes;
  return fill(heading, { count: counts[count] ?? counts[3] });
}

function cardLabel(sceneId, choiceId, scenes) {
  if (typeof choiceId !== "string" || !choiceId) return "";
  const choices = Array.isArray(scenes[sceneId]?.choices) ? scenes[sceneId].choices : [];
  const label = choices.find((choice) => choice?.id === choiceId)?.label;
  return typeof label === "string" ? label.trim() : "";
}

function finaleChoiceId(caseResults, log) {
  const entry = findFinalChoiceEntry(log);
  // The log has the finale's last question: its card, unless nobody chose it.
  if (entry) return entry.isSystemEvent === true || entry.threshold?.forced === true ? null : entry.choiceId;
  return caseResults?.final?.finalChoiceId;
}

/**
 * The scenes this season has a card for, in season order, as
 * `{ id, place, label }`: `place` is the case and the scene's title, `label`
 * the card. Empty when it has none. Reads its arguments and changes nothing.
 */
export function getThreeScenes({ caseResults, log } = {}, scenes = nodes) {
  const results = caseResults && typeof caseResults === "object" && !Array.isArray(caseResults) ? caseResults : {};
  return THREE_SCENES.flatMap(({ caseId, sceneId, field }) => {
    const caseLabel = endingCopy.threeScenes.cases[caseId];
    const choiceId = caseId === "final" ? finaleChoiceId(results, log) : results[caseId]?.[field];
    const label = cardLabel(sceneId, choiceId, scenes);
    if (!label) return [];
    const title = typeof scenes[sceneId]?.title === "string" ? scenes[sceneId].title : "";
    return [{ id: caseId, place: title ? `${caseLabel} · ${title}` : caseLabel, label }];
  });
}
