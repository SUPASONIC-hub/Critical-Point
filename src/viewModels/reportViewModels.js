/**
 * Derived report state: the ending framing, the score rows, the badges and the
 * storage banner. All of it is a pure read of a finished run.
 */
import { easyResourceLabels } from "../playerLanguage.js";
import { getSeasonStanding } from "../seasonStanding.js";
import { fill } from "../locale.js";
import reportLinesCopy from "../copy/reportLines.js";

const { standing: STANDING, score: SCORE, badges: BADGE, pace: PACE } = reportLinesCopy;

// A shape and a word for each level, so the level is read without its colour
// (the word is STANDING's, by the level).
const STANDING_MARKS = { clear: "○", near: "▲", over: "■" };

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
 */
export function createSeasonStandingReadout({ caseResults, resources, cases = [] } = {}) {
  const { level, harm, overreach, casesCounted, harmCases } = getSeasonStanding({ caseResults, resources });
  const route = level === harm.level ? "harm" : "overreach";
  const perCase = Math.floor((harm.total * 10) / casesCounted) / 10;
  const bustPercent = overreach.windows > 0 ? Math.floor((overreach.busts * 100) / overreach.windows) : 0;
  const harmLabel = easyResourceLabels.humanCost;
  const labels = new Map(cases.map((caseItem) => [caseItem.id, caseItem.label]));
  return {
    level,
    route,
    mark: STANDING_MARKS[level],
    label: STANDING[level],
    text: route === "harm"
      ? fill(STANDING.harm, { harmLabel, perCase, gate: harm.gate, bustPercent })
      : fill(STANDING.overreach, { harmLabel, perCase, gate: overreach.harmGate, bustPercent, bustGate: Math.round(overreach.bustGate * 100) }),
    harmCases: harmCases
      .filter((entry) => labels.has(entry.caseId))
      .map((entry) => ({ ...entry, text: fill(STANDING.harmCase, { caseLabel: labels.get(entry.caseId), harmLabel, harm: entry.harm }) })),
  };
}

export function createEndingProfile({ finalEndingEntry }) {
  // The id comes out of a saved log. Without a prototype the lookup finds only
  // the three framings: "toString" from a damaged save is undecided, not a function.
  return {
  __proto__: null,
  ending_seal: {
    tag: "봉인",
    title: "당신은 문을 닫았지만, 흔적은 남겼다.",
    text: "데이터를 봉인해 다시 이용되지 않게 했습니다. 그러나 마지막 후폭풍에서 고른 태도는 당신이 지키려는 것이 침묵인지 안전인지 드러냈습니다.",
  },
  ending_reform: {
    tag: "개혁",
    title: "당신은 실험을 규칙으로 바꾸었다.",
    text: "트리거를 없애는 대신 동의와 감시를 붙였습니다. 사람을 읽는 힘을 누가, 언제, 어디까지 쓸 수 있는지 직접 정했습니다.",
  },
  ending_expose: {
    tag: "폭로",
    title: "당신은 관찰자를 세상 밖으로 끌어냈다.",
    text: "실험의 구조를 공개했습니다. 혼란은 시작됐지만, 적어도 다음 참가자는 자신이 관찰당하고 있다는 사실을 알고 선택할 수 있습니다.",
  },
  }[finalEndingEntry?.choiceId] ?? {
  tag: "미확정",
  title: "당신의 마지막 선택은 아직 기록 중이다.",
  text: "마지막 폴더의 문장이 완전히 닫히지 않았습니다. 다음 플레이에서는 다른 결말의 조건을 시험해 보십시오.",
  };
}

export function createScoreBreakdown({ cognitionScore, consistencyScore, exploitPenalty, pressureAdaptScore, readingScore = 0, reflectionScore, rhythmScore }) {
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
    label: SCORE.reading.label,
    value: readingScore,
    text: fill(SCORE.points, { score: readingScore }),
    note: SCORE.reading.note,
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
