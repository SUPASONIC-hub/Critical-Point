/**
 * Derived report state: the ending framing, the score rows, the badges and the
 * storage banner. All of it is a pure read of a finished run.
 */
import { easyResourceLabels, topicParticle } from "../playerLanguage.js";
import { initialResources } from "../gameConstants.js";
import { cutPerCase, getSeasonStanding } from "../seasonStanding.js";
import { fill } from "../locale.js";
import reportLinesCopy from "../copy/reportLines.js";

const { standing: STANDING, heldEndings: HELD_ENDINGS, score: SCORE, badges: BADGE, pace: PACE } = reportLinesCopy;

// A shape and a word for each level, so the level is read without its colour
// (the word is STANDING's, by the level).
const STANDING_MARKS = { clear: "○", near: "▲", over: "■" };

/**
 * How far under the start the season's mean cash must have closed for the
 * season to have lost money (개선 포인트 C3, 2026-11-05 draft): under this
 * share of `initialResources.capital`, so under 80 of the 100 a season
 * starts with. The one number the held line hangs on; where it sits is the
 * owner's (감수자's) call.
 */
export const HELD_LINE_CAPITAL_SHARE = 0.8;

/**
 * Whether the season lost money and kept people: its standing is clear of
 * both collapse routes and the cash its cases closed on, on average, is
 * under `HELD_LINE_CAPITAL_SHARE` of the start. `closing` is the mean
 * closing resources (`getSeasonStrain().seasonResources`), or null before a
 * case has closed -- and then nothing is held.
 *
 * @param {{ level?: string, closing?: Record<string, any> | null }} [input]
 */
export function readHeldLine({ level, closing } = {}) {
  const capital = Number(closing?.capital);
  return level === "clear" && Number.isFinite(capital) && capital < initialResources.capital * HELD_LINE_CAPITAL_SHARE ? { capital } : null;
}

/**
 * The line every case's report prints about SYSTEM COLLAPSE, and on a collapse
 * the cases worth playing again. All of it is `getSeasonStanding`, so the line
 * cannot say what the ending does not.
 *
 * `route` is the gate the level was read from, and the line prints that gate:
 * harm against 20, or -- when busts are what brought the season near -- harm
 * against 10 beside the bust share against a fifth. Both numbers are cut, not
 * rounded: 19.96 a case prints 19.9, never the 20 the season has not reached.
 *
 * `harmCases` keeps only cases the season can open (`cases`, the roadmap's
 * list): a summary under an id the season no longer has cannot be replayed.
 *
 * @param {object} [input]
 * @param {Record<string, any>} [input.caseResults] The season's case summaries, by case id.
 * @param {Record<string, any>} [input.resources] The resources on the table now.
 * @param {Array<{ id: string, label: string }>} [input.cases] The cases the season can open.
 * @param {Record<string, any> | null} [input.closing] The mean resources the season's cases closed on, for `held`.
 * @param {string} [input.endingId] The ending the season reached, for `endingHeld` (the finale only).
 *
 * `held` (C3) is the sentence after the line when the season lost money and
 * kept people (`readHeldLine`), else null; `endingHeld` is that season's
 * sentence after the ending's own line, by the ending, and null for an
 * ending that has none (the collapse, PROFITABLE SILENCE) or a season that
 * did not hold.
 */
export function createSeasonStandingReadout({ caseResults, resources, cases = [], closing = null, endingId = "" } = {}) {
  const { level, harm, overreach, casesCounted, harmCases } = getSeasonStanding({ caseResults, resources });
  const route = level === harm.level ? "harm" : "overreach";
  const perCase = cutPerCase(harm.total, casesCounted);
  const bustPercent = overreach.windows > 0 ? Math.floor((overreach.busts * 100) / overreach.windows) : 0;
  const harmLabel = easyResourceLabels.humanCost;
  const capitalLabel = easyResourceLabels.capital;
  const labels = new Map(cases.map((caseItem) => [caseItem.id, caseItem.label]));
  const heldLine = readHeldLine({ level, closing });
  return {
    level,
    route,
    mark: STANDING_MARKS[level],
    label: STANDING[level],
    text: route === "harm"
      ? fill(STANDING.harm, { harmLabel, perCase, gate: harm.gate, bustPercent })
      : fill(STANDING.overreach, { harmLabel, perCase, gate: overreach.harmGate, bustPercent, bustGate: Math.round(overreach.bustGate * 100) }),
    held: heldLine
      ? fill(STANDING.held, { capitalLabel, capitalParticle: topicParticle(capitalLabel), capital: heldLine.capital, harmLabel, harmParticle: topicParticle(harmLabel) })
      : null,
    endingHeld: heldLine && Object.hasOwn(HELD_ENDINGS, endingId) ? HELD_ENDINGS[endingId] : null,
    harmCases: harmCases
      .filter((entry) => labels.has(entry.caseId))
      .map((entry) => ({ ...entry, text: fill(STANDING.harmCase, { caseLabel: labels.get(entry.caseId), harmLabel, harm: entry.harm }) })),
  };
}

export function createEndingProfile({ finalEndingEntry }) {
  // The id comes out of a saved log: only the three framings are looked up by
  // it ("toString" from a damaged save is undecided, not a function). The words
  // are reportLines.js's `endingProfiles`, in the page's language.
  const profiles = reportLinesCopy.endingProfiles;
  const id = finalEndingEntry?.choiceId;
  return { ...(id !== "open" && Object.hasOwn(profiles, id ?? "") ? profiles[id] : profiles.open) };
}

export function createScoreBreakdown({ cognitionScore, consistencyScore, exploitPenalty, pressureAdaptScore, reflectionScore, rhythmScore }) {
  return [
  {
    label: SCORE.consistency.label,
    value: consistencyScore,
    text: fill(SCORE.points, { score: consistencyScore }),
    note: SCORE.consistency.note,
  },
  {
    label: SCORE.rhythm.label,
    value: rhythmScore,
    text: fill(SCORE.points, { score: rhythmScore }),
    note: SCORE.rhythm.note,
  },
  {
    label: SCORE.cognition.label,
    value: cognitionScore,
    text: fill(SCORE.points, { score: cognitionScore }),
    note: SCORE.cognition.note,
  },
  {
    label: SCORE.pressureAdapt.label,
    value: pressureAdaptScore,
    text: fill(SCORE.points, { score: pressureAdaptScore }),
    note: SCORE.pressureAdapt.note,
  },
  {
    label: SCORE.reflection.label,
    value: reflectionScore,
    text: fill(SCORE.points, { score: reflectionScore }),
    note: SCORE.reflection.note,
  },
  {
    label: SCORE.exploit.label,
    value: exploitPenalty,
    text: exploitPenalty > 0 ? fill(SCORE.penalty, { score: exploitPenalty }) : SCORE.none,
    note: SCORE.exploit.note,
  },
  ];
}

export function createAchievementBadges({ challengeClearCount, currentChallengeStreak, flowSurgeCount, momentumScore, momentumTier, reducedRiskCount, result, riskTier }) {
  return [
  { title: `Burst ${momentumTier}`, text: fill(BADGE.burst, { score: momentumScore }) },
  result.reframeCount > 0
    ? { title: "Board Breaker", text: BADGE.boardBreaker }
    : { title: "Route Follower", text: BADGE.routeFollower },
  result.averageResponseTime >= 20
    ? { title: "Slow Thinker", text: BADGE.slowThinker }
    : { title: "Fast Closer", text: BADGE.fastCloser },
  reducedRiskCount > 0
    ? { title: "Risk Cutter", text: fill(BADGE.riskCutter, { count: reducedRiskCount }) }
    : { title: "Heat Taker", text: BADGE.heatTaker },
  challengeClearCount > 0
    ? { title: "Challenge Clear", text: fill(BADGE.challengeClear, { count: challengeClearCount }) }
    : { title: "Open Quest", text: BADGE.openQuest },
  currentChallengeStreak >= 5
    ? { title: "Perfect Run", text: fill(BADGE.perfectRun, { count: currentChallengeStreak }) }
    : currentChallengeStreak >= 3
    ? { title: "Streak Breakthrough", text: fill(BADGE.streak, { count: currentChallengeStreak }) }
    : { title: "Chain Starter", text: BADGE.chainStarter },
  flowSurgeCount > 0
    ? { title: "Flow Surge", text: fill(BADGE.flowSurge, { count: flowSurgeCount }) }
    : { title: "No Surge", text: BADGE.noSurge },
  riskTier === "CRITICAL"
    ? { title: "Crisis Runner", text: BADGE.crisisRunner }
    : { title: "Pressure Keeper", text: BADGE.pressureKeeper },
  ];
}

/** The most decisions each end of `getDecisionPace` reads, and the fewest that make a comparison. */
const DECISION_PACE_SIZE = 10;
const DECISION_PACE_MIN = 3;

/**
 * How fast the first decisions of a log were made against the last: the same
 * number from each end -- at most `size`, at most half of what was counted, so
 * no decision is in both -- and each end's average, in whole seconds. Null
 * when fewer than `min` fit at each end. A mirror for the report, not a
 * reading the table acts on.
 *
 * `responseTimeSec` is the table clock's own reading (`getWindowResponseTime`),
 * and that clock does not run while the briefing is up, its reading clock held
 * or not, nor while the table is paused (GauntletStage's `paused`). Left out is
 * what that reading cannot be compared on: a window played on a slowed clock
 * (`assistTime`: its seconds are table seconds), one played in story mode
 * (`assistStory`), a card the table dealt because none was staked
 * (`threshold.forced`), the table's system entries, and an entry with no
 * reading (a save from before it was written).
 */
export function getDecisionPace(entries = [], { size = DECISION_PACE_SIZE, min = DECISION_PACE_MIN } = {}) {
  const times = (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent)
    .filter((entry) => !(Number(entry.assistTime) > 1) && entry.assistStory !== true && entry.threshold?.forced !== true)
    .map((entry) => Number(entry.responseTimeSec))
    .filter((seconds) => Number.isFinite(seconds) && seconds > 0);
  const count = Math.min(size, Math.floor(times.length / 2));
  if (count < Math.max(1, min)) return null;
  const average = (part) => Math.round(part.reduce((sum, seconds) => sum + seconds, 0) / part.length);
  return { count, first: average(times.slice(0, count)), last: average(times.slice(-count)) };
}

/** The report's one line on that pace (ReportArchive's Avg Time), or "" when there is none. */
export function describeDecisionPace(pace) {
  if (!pace) return "";
  const { count, first, last } = pace;
  if (first === last) return fill(PACE.same, { count, last });
  return fill(last < first ? PACE.faster : PACE.slower, { count, first, last });
}
