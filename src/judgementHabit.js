import { ENDING_GATES } from "./gameConstants.js";
import { getSeasonLogic } from "./gameLogic.js";
import { readClosedCases, readCollapseTally } from "./seasonStanding.js";

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
 * card's chunk had about 40 gzip bytes left, so the names and lines live here,
 * on the runtime's side, and the card is handed the finished name. The line
 * is not drawn on the card (no room left in its chunk); the report's
 * 당신이 반복한 방식 box draws it under the name (ResultScreen.jsx).
 */

/** Below this many settled windows a season has not shown a habit. */
export const HABIT_MIN_WINDOWS = 5;
/** Logic windows the 논리 유지력 has to be read over before it names a season. */
const LOGIC_MIN_WINDOWS = 10;

/**
 * The habits, in the order they are tried. `holds` is handed the season as
 * `readHabitSeason` reads it. The last one holds for every season, so a
 * season with a record always has a name.
 */
export const JUDGEMENT_HABITS = Object.freeze([
  {
    id: "bulldozer",
    title: "실적 우선 불도저형",
    line: "판은 이겼는데, 사람 피해가 뒤에 쌓였습니다.",
    // The collapse gate itself: harm a case closed on, on average.
    holds: (season) => season.harmPerCase >= ENDING_GATES.collapseHarmPerCase,
  },
  {
    id: "moth",
    title: "하이리스크 불나방형",
    line: "벽이 가까워질수록 손이 더 빨라집니다.",
    holds: (season) => season.bustRate >= 0.25,
  },
  {
    id: "tightrope",
    title: "벽 앞 줄타기 장인형",
    line: "벽 바로 앞까지 밀고도 멀쩡히 돌아옵니다.",
    holds: (season) => season.pushesPerWindow >= 5.5 && season.bustRate < 0.12,
  },
  {
    id: "reframer",
    title: "판 뒤집기 상습범형",
    line: "카드가 마음에 안 들면 판부터 다시 짭니다.",
    holds: (season) => season.wildPerCase >= 0.7,
  },
  {
    id: "one-track",
    title: "외길 논리형",
    line: "한 번 정한 논리는 열기가 올라도 놓지 않습니다.",
    holds: (season) => season.logicWindows >= LOGIC_MIN_WINDOWS && season.logicHold >= 80,
  },
  {
    id: "shield",
    title: "사람 먼저 방패형",
    line: "숫자보다 그 숫자 뒤의 사람을 먼저 셉니다.",
    holds: (season) => season.peopleFirstShare >= 0.5 && season.harmPerCase < ENDING_GATES.collapseOverreachHarm,
  },
  {
    id: "stepping-stone",
    title: "돌다리 두들김형",
    line: "벽 근처엔 가지도 않고 일찍 LOCK을 누릅니다.",
    holds: (season) => season.pushesPerWindow <= 3.5 && season.bustRate <= 0.05,
  },
  {
    id: "marathon",
    title: "생각 마라톤형",
    line: "결론보다 생각이 오래 걸려야 마음이 놓입니다.",
    holds: (season) => season.averageSeconds >= 20,
  },
  {
    id: "lightning",
    title: "속전속결형",
    line: "읽자마자 고르고, 고르자마자 밉니다.",
    holds: (season) => season.averageSeconds > 0 && season.averageSeconds <= 5,
  },
  {
    id: "card-shopper",
    title: "카드 쇼핑형",
    line: "판마다 다른 카드를 집고, 콤보는 신경 안 씁니다.",
    holds: (season) => season.logicWindows >= LOGIC_MIN_WINDOWS && season.logicHold < 30,
  },
  {
    id: "steady",
    title: "무난한 균형형",
    line: "튀지 않게, 그러나 끝까지 판을 닫았습니다.",
    holds: () => true,
  },
]);

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
