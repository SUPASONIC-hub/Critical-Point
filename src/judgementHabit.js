import { ENDING_GATES } from "./gameConstants.js";
import { getSeasonLogic } from "./gameLogic.js";
import { readClosedCases, readCollapseTally } from "./seasonStanding.js";
import habitsCopy from "./copy/habits.js";

/**
 * The season's 판단 습관: a short, slightly unkind name for how the player
 * played, the way a personality test names its reader, and one line that says
 * what the name means. It is what the result card prints in large type
 * (`resultCardModel.js` reads `fingerprint.habit`).
 *
 * It is read off the case summaries the season has already stored -- the
 * table record (pushes, LOCKs, BUSTs), the logic record, the wild cards staked,
 * the harm each case closed on, the decisions that put people first and the
 * time decisions took -- and off nothing else, so a reloaded season gets the
 * name it had, and nothing that says who played can reach the card through it.
 *
 * The rules are tried in order and the first that holds names the season.
 * Nothing here is random: the same summaries always get the same name. The
 * card's chunk had about 40 gzip bytes left, so the names and lines live on
 * the runtime's side (src/copy/habits.js, where another language is laid over
 * them), and the card is handed the finished name. The line
 * is not drawn on the card (no room left in its chunk); the report's
 * 당신이 반복한 방식 box draws it under the name (ResultScreen.jsx).
 */

/** Below this many settled windows a season has not shown a habit. */
export const HABIT_MIN_WINDOWS = 5;
/** Logic windows the 논리 유지력 has to be read over before it names a season. */
const LOGIC_MIN_WINDOWS = 10;
/**
 * Harm a case closed on, on average, that names a bulldozer: past the collapse
 * gate (ENDING_GATES.collapseHarmPerCase, 20), so a season that only just
 * collapsed can still be named for how it pushed or held its logic.
 *
 * The thresholds below were set on 2026-10-15 from `npm run report:endings`
 * (600 bot seasons and the two wild-card hands' 80 each): bust rate, pushes and
 * seconds move with the season rather than the bot, so those habits each take
 * a share of every kind of player, and harm, people first, logic hold and wild
 * cards are what tell the kinds apart.
 */
const BULLDOZER_HARM_PER_CASE = 25;

/**
 * The habits, in the order they are tried. `holds` is handed the season as
 * `readHabitSeason` reads it. The last one holds for every season, so a
 * season with a record always has a name. `title` and `line` are read from
 * src/copy/habits.js when asked, so they are the page's language.
 */
const HABIT_RULES = [
  {
    id: "bulldozer",
    holds: (season) => season.harmPerCase >= BULLDOZER_HARM_PER_CASE,
  },
  {
    id: "moth",
    holds: (season) => season.bustRate >= 0.28,
  },
  {
    id: "tightrope",
    // Pushes and BUSTs rise together (3.6 pushes a window usually BUSTs about
    // one window in ten), so this is pushing that far and BUSTing less.
    holds: (season) => season.pushesPerWindow >= 3.6 && season.bustRate < 0.09,
  },
  {
    id: "reframer",
    holds: (season) => season.wildPerCase >= 1,
  },
  {
    id: "shield",
    holds: (season) => season.peopleFirstShare >= 0.7 && season.harmPerCase < ENDING_GATES.collapseOverreachHarm,
  },
  {
    id: "one-track",
    holds: (season) => season.logicWindows >= LOGIC_MIN_WINDOWS && season.logicHold >= 75,
  },
  {
    id: "card-shopper",
    holds: (season) => season.logicWindows >= LOGIC_MIN_WINDOWS && season.logicHold < 45,
  },
  {
    id: "stepping-stone",
    holds: (season) => season.pushesPerWindow <= 3.3 && season.bustRate <= 0.04,
  },
  {
    id: "marathon",
    holds: (season) => season.averageSeconds >= 12,
  },
  {
    id: "lightning",
    holds: (season) => season.averageSeconds > 0 && season.averageSeconds <= 6,
  },
  {
    id: "steady",
    holds: () => true,
  },
];

const withWords = (habit) =>
  Object.freeze(
    Object.defineProperties(habit, {
      title: { enumerable: true, get: () => habitsCopy[habit.id].title },
      line: { enumerable: true, get: () => habitsCopy[habit.id].line },
    }),
  );

export const JUDGEMENT_HABITS = Object.freeze(HABIT_RULES.map(withWords));

const count = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
const ratio = (part, whole) => (whole > 0 ? part / whole : 0);

/**
 * The numbers the habits are judged on, from the stored case summaries. Every
 * one is a plain sum or mean of fields `createCaseSummary` writes; a field an
 * older save lacks counts as nothing.
 */
export function readHabitSeason(caseResults = {}) {
  const results = caseResults && typeof caseResults === "object" && !Array.isArray(caseResults) ? caseResults : {};
  const summaries = readClosedCases(results)
    .map(([, summary]) => summary)
    .filter((summary) => summary && typeof summary === "object");
  const { casesPlayed, seasonWindows, seasonBusts, seasonHumanCost } = readCollapseTally(summaries);
  const sum = (read) => summaries.reduce((total, summary) => total + count(read(summary)), 0);
  const logic = getSeasonLogic(results);
  const timed = summaries.map((summary) => count(summary.averageResponseTime)).filter((seconds) => seconds > 0);
  return {
    cases: casesPlayed,
    windows: seasonWindows,
    bustRate: ratio(seasonBusts, seasonWindows),
    pushesPerWindow: ratio(sum((summary) => summary.pushRecord?.pushes), seasonWindows),
    harmPerCase: ratio(seasonHumanCost, casesPlayed),
    wildPerCase: ratio(sum((summary) => summary.reframeCount), casesPlayed),
    peopleFirstShare: ratio(sum((summary) => summary.peopleFirstCount), seasonWindows),
    logicWindows: sum((summary) => summary.logicRecord?.windows),
    // A season with no window that could have ended a streak has no hold; it
    // reads as the middle so neither logic habit names it.
    logicHold: Number.isInteger(logic.logicHold) ? logic.logicHold : 50,
    averageSeconds: timed.length ? timed.reduce((total, seconds) => total + seconds, 0) / timed.length : 0,
  };
}

/**
 * `{ id, title, line }` for the season, or null for a season with too few
 * settled windows to have a habit (the card then prints its 판단 DNA title).
 */
export function getJudgementHabit(caseResults = {}) {
  const season = readHabitSeason(caseResults);
  if (season.windows < HABIT_MIN_WINDOWS) return null;
  const { id, title, line } = JUDGEMENT_HABITS.find((habit) => habit.holds(season));
  return { id, title, line };
}
