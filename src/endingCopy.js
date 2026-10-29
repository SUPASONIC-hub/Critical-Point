/**
 * The copy the final report and the ending sequence print. Its words are
 * src/copy/ending.js's, where another language is laid over them.
 *
 * It sat inside `ResultScreen`'s component body, a hundred lines of prose
 * between the view bag and the markup, rebuilt on every render. It is data: a
 * verdict per final choice, the verdict of a collapse, what the run leaves
 * behind per observed reaction, and the three axes the report scores. The
 * screen keeps only what depends on this run -- which entry to read.
 */

import { getVerdictKey } from "./verdictBranch.js";
import words from "./copy/ending.js";

/** The ending's words (src/copy/ending.js), for the result screen's twists and records. */
export { words as endingWords };

export const observationLabels = words.observationLabels;

const choiceVerdicts = words.verdicts;

const failureVerdict = words.collapse;

/**
 * The ruling the ending sequence reads out: the collapse when the run failed,
 * the verdict of the final choice when it made one of the three and the ending
 * agrees with it (`getVerdictKey`, verdictBranch.js), and otherwise the open verdict, written
 * from the ending variant the run reached.
 *
 * A run always has both things the open verdict is written from: the ruling
 * returns one of its endings whatever it is given (`getEndingVariant`,
 * gameLogic.js), and every ending has a scene with an action of its own
 * (`getEndingSceneProfile`, runtimeSystems.js). The three sentences kept here
 * for a run without them were never printed; tests/unit/report-copy.test.mjs
 * holds the two facts.
 */
export function getFinalVerdict({ endingVariant, finalChoiceId, endingSceneChoice }) {
  const verdict = getVerdictKey({ endingVariant, finalChoiceId });
  if (verdict === "collapse") return failureVerdict;
  return (
    choiceVerdicts[verdict] ?? {
      title: endingVariant.title,
      ruling: endingVariant.text,
      execution: `${endingSceneChoice}.`,
      cost: words.openCost,
    }
  );
}

export const endingTwistTitles = words.twistTitles;

export const endingAxisCopy = words.axes;

const endingAfterglows = words.afterglows;

/**
 * What the page that opens the finale says about the season record.
 *
 * Closing the finale sends one more row than a case does: the season's, which
 * is what the online ranking lists. Nothing said so until it had been sent --
 * or, for a run whose earlier cases were closed with the consent box unticked,
 * until the server had refused it ("이 회차는 온라인 시즌 랭킹에 오르지
 * 않습니다", useTelemetryQueue.js). The page before the finale is the last
 * place the player can still do something with that, so it is said there.
 *
 * A season with a case closed before the table paid the logic streak is not
 * ranked either (`hasBeatTableCase`, logicReport.js; `beatSeason` here), and
 * its row is not sent: with the box ticked it is told that, not that the
 * record will go to the ranking.
 *
 * Null wherever it would be noise: any page that is not the one before the
 * finale, and a build with no server, which sends nothing and ranks nobody.
 */
export function getSeasonRecordNotice({ nextCaseId, telemetryEnabled, dataConsent, beatSeason }) {
  if (nextCaseId !== "final" || !telemetryEnabled) return null;
  if (!dataConsent) return words.seasonRecord.notSent;
  return beatSeason ? words.seasonRecord.beatTable : words.seasonRecord.sent;
}

const openAfterglow = words.openAfterglow;

/**
 * What the run leaves behind, read from the observation ledger: the afterglow
 * of the reaction the observer saw most, the first of them on a tie. The ledger
 * counts exactly these four (`getObservationLedger`, gameLogic.js), and a
 * finale can end with all four at zero. That run is not told it kept order: it
 * gets the open afterglow, which names no reaction.
 */
export function getEndingAfterglow(ledger) {
  const [observation, seen] = Object.entries(ledger).sort((a, b) => b[1] - a[1])[0];
  return seen > 0 ? endingAfterglows[observation] : openAfterglow;
}
