import { CASE_SEQUENCE } from "./gameCases.js";
import { ENDING_GATES } from "./gameConstants.js";
import { isPeopleFirstEffect } from "./gameLogic.js";
import { easyResourceLabels, objectParticle, subjectParticle } from "./playerLanguage.js";
import { getOperatorProfile } from "./advancedSystems.js";
import { getSeasonStanding } from "./seasonStanding.js";
import epilogueCopy from "./copy/epilogue.js";
import { fill } from "./locale.js";

// The words are src/copy/epilogue.js's, where another language is laid over them.
const W = epilogueCopy;



export function getOperatorReveal({ origin = "courier", completedCases = [] } = {}) {
  const count = completedCases.length;
  if (count < 2) return { level: 0, title: "OPERATOR FILE / SEALED", text: W.operator.sealed };
  // The origin is a key (`courier`); the profile holds what it is called.
  const who = getOperatorProfile(origin).title;
  if (count < 4) return { level: 1, title: "OPERATOR FILE / PARTIAL", text: fill(W.operator.partial, { who, particle: subjectParticle(who) }) };
  return { level: 2, title: "OPERATOR FILE / OPENED", text: W.operator.opened };
}

/**
 * What the season left behind, months after the last night.
 *
 * `getEndingVariant` resolves nine endings. Eight have an epilogue here, and
 * OPEN QUESTION closes on the fallback, which is written for it -- once, only
 * four had one, and five seasons in nine closed on a line that knew nothing
 * about the run. Each follows the same shape: the season's own places and
 * people first, the analyst second, the door the next participant walks
 * through last. Counts are read off the season, not written into the copy.
 *
 * They are written from the season the finale closes, not from its first six
 * cases: 트리거랩 was dissolved in 사건 24, so no epilogue may say it stands,
 * and the people they name are where `characterRoleSpans` puts them after
 * 사건 25 (윤상혁 removed and sentenced, 이민서 at KD데이터랩, the analyst at
 * KD캐피탈). The fixed facts -- 1,740명, the 31 still 확인 불가, 63명 -- are
 * docs/canon.md's.
 */
const NUMBERED_CASES = CASE_SEQUENCE.filter((caseId) => /^case\d+$/.test(caseId)).length;

export function getEndingEpilogue(endingId = "open-question") {
  // The collapse's counts the season's numbered cases (`{count}`).
  return fill(W.epilogues[endingId] || W.open, { count: NUMBERED_CASES });
}

/**
 * PEOPLE FIRST counts the season's decisions whose largest gain went to the
 * people in the scene (`isPeopleFirstEffect`). It used to match
 * /protect|people|witness|person/ on the choice id -- and generated scenes are
 * `<scene>_choice_N`, so every choice in a scene called `c1_witness` counted --
 * and it read only the case on screen, whose log the next case clears. Closed
 * cases now carry their count in their summary; the case being played is
 * counted from its log. The bar is three such decisions a case, across the
 * season: a player who leads with people clears it, one who weighs everything
 * evenly about half the time, and nobody by accident.
 */
const PEOPLE_FIRST_PER_CASE = 3;

export function getAchievementProgress({ log = [], completedCases = [], caseResults = {} } = {}) {
  const closed = caseResults ?? {};
  const peopleFirst =
    Object.values(closed).reduce((sum, summary) => sum + (Number(summary?.peopleFirstCount) || 0), 0) +
    log.filter((entry) => entry && !entry.isSystemEvent && !closed[entry.caseId] && isPeopleFirstEffect(entry.effect)).length;
  // The two season-shaped goals read the sequence, so a new case cannot leave a
  // badge that says 6/6 while the season has seven cases in it.
  return [
    { id: "people-first", label: "PEOPLE FIRST", value: peopleFirst, goal: PEOPLE_FIRST_PER_CASE * CASE_SEQUENCE.length },
    { id: "full-audit", label: "FULL AUDIT", value: Object.keys(closed).length, goal: CASE_SEQUENCE.length },
    { id: "route-keeper", label: "ROUTE KEEPER", value: completedCases.length, goal: CASE_SEQUENCE.length - 1 },
  ].map((item) => ({ ...item, unlocked: item.value >= item.goal }));
}

/**
 * What the next season has to do differently, from the gate that closed this
 * one. It promised a hidden choice for fewer investigations and a later rival
 * for protecting a witness -- neither exists. Each line now names the collapse
 * gate (`ENDING_GATES`) and nothing the game does not do.
 */
export function getFailureRecovery(ending = {}, resources = {}) {
  if (!ending.failure) return null;
  const harm = easyResourceLabels.humanCost;
  const { collapseHarmPerCase, collapseBustRate, collapseOverreachHarm } = ENDING_GATES;
  const key = ending.cause?.id ?? (Number(resources.humanCost) > 0 ? "harm" : "overreach");
  const text = key === "overreach"
    ? fill(W.recovery.overreach, { bust: Math.round(collapseBustRate * 100), harm, particle: objectParticle(harm), gate: collapseOverreachHarm })
    : fill(W.recovery.harm, { harm, particle: objectParticle(harm), gate: collapseHarmPerCase });
  return { key, title: "RECOVERY ROUTE", text };
}

/** What a season that collapsed is marked with on the result card (improvement note C6). */
export const COLLAPSED_SEASON_MARK = W.collapsedMark;

/**
 * What a collapse cost, in the words the collapse panel prints under its
 * ending (improvement note C4). Only what the season's summaries hold: the
 * case that closed on the most harm, as `getSeasonStanding` lists it, with its
 * label, title and the harm it closed on. The season's mean harm is not
 * repeated here; the report prints it beside this (`getFailureCause`).
 * A season over the line on the table's harm alone has no closed case to
 * name, and its toll is the first and last sentence.
 *
 * @param {{ caseResults?: Record<string, any>, resources?: Record<string, any>, cases?: Array<{ id: string, label: string, title: string }> }} [input]
 */
export function getCollapseToll({ caseResults = {}, resources = {}, cases = [] } = {}) {
  const harm = easyResourceLabels.humanCost;
  const [worst] = getSeasonStanding({ caseResults, resources }).harmCases;
  const named = worst && cases.find((caseItem) => caseItem.id === worst.caseId);
  return [
    fill(W.toll.over, { harm, particle: subjectParticle(harm) }),
    named && fill(W.toll.worst, { label: named.label, title: named.title, harm, value: worst.harm, particle: objectParticle(String(worst.harm)) }),
    W.toll.paid,
  ].filter(Boolean).join(" ");
}

export function getOperationsSnapshot({ errors = [], pending = [], rankings = [], caseResults = {} } = {}) {
  return { errorCount: errors.length, pendingCount: pending.length, rankingCount: rankings.length, completedCount: Object.keys(caseResults).length, state: errors.length ? "ACTION REQUIRED" : pending.length ? "QUEUE ACTIVE" : "HEALTHY" };
}
