import { CASE_SEQUENCE } from "./gameCases.js";
import { clamp } from "./riskLogic.js";

/**
 * A burst score with its twin, its tier and its letter: one number under both
 * names, as the server's suspicion marks expect (20261020000000), which read
 * the thresholds off the two lines below (check:grants). getGameplayStats
 * marks a case's score with it, getSeasonScore the season's.
 */
export function scoreMarks(momentumScore) {
  return {
    momentumScore,
    burstScore: momentumScore,
    momentumTier: momentumScore >= 78 ? "BURST" : momentumScore >= 58 ? "FLOW" : momentumScore >= 36 ? "READY" : "BUILDING",
    rank: momentumScore >= 88 ? "S" : momentumScore >= 72 ? "A" : momentumScore >= 52 ? "B" : "C",
  };
}

/**
 * How many of a case's decisions leaned on each way of thinking: each counts
 * once, for the cognition its card weighs most (the first written on a tie).
 * System events are left out when the case has anything else, as
 * getGameplayStats leaves them out of every axis.
 */
export function getCognitionMix(entries = []) {
  const played = entries.filter((entry) => !entry.isSystemEvent);
  const mix = {};
  for (const entry of played.length > 0 ? played : entries) {
    const type = Object.entries(entry.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (type) mix[type] = (Object.hasOwn(mix, type) ? mix[type] : 0) + 1;
  }
  return mix;
}

/**
 * The 관점 전환 score: how evenly the decisions moved between the four ways of
 * thinking, from a list of types or a count of them (`getCognitionMix`).
 *
 * This used to be `types * 14 + shifts * 10 + length * 4`, which any run of a
 * dozen decisions filled to the cap: measured across five fixed strategies it
 * returned 100 every time, so a fifth of the score could not separate two runs.
 * Normalised entropy answers the same question and actually varies -- one
 * repeated approach lands near 0, an even spread across all four near 100.
 * The server's copy is `ranking_cognition_spread` (20261102020000).
 */
export function getCognitionSpread(types = []) {
  const counts = Array.isArray(types)
    ? [...types.reduce((map, type) => map.set(type, (map.get(type) ?? 0) + 1), new Map()).values()]
    : Object.values(types).filter((count) => count > 0);
  if (counts.length < 2) return 0;
  const total = counts.reduce((sum, count) => sum + count, 0);
  const entropy = counts.reduce((sum, count) => sum - (count / total) * Math.log(count / total), 0);
  // A run that only ever used two of the four ways cannot reach the top, even
  // if it alternated them perfectly.
  const reach = counts.length / 4;
  // floor(x + 0.5), which the server writes the same way.
  return Math.floor(clamp((entropy / Math.log(counts.length)) * reach * 100, 0, 100) + 0.5);
}

/**
 * C-12, the 판 읽기 index of a case: what the player's bare hand kept against
 * a hand that sees the wall, on the same boards (each logged window's
 * `threshold.read`, `[bare, seer]`, tableAfterword.js readWindowAgainstSeer).
 * A bust wipes what the bare hand had in the pot, as the table does without
 * INSURANCE; the seer never pushes into the wall. A whole percent, or null
 * for a log with nothing to compare (an older log). The case close prints it
 * (「벽을 본 사람의 N%」, tableAfterword.js describeCaseRead), and since C-1(1)
 * the score reads it too (`getReadingScore`).
 */
export function getCaseRead(log = []) {
  let mine = 0;
  let seer = 0;
  for (const entry of log) {
    const read = entry?.threshold?.read;
    if (!Array.isArray(read)) continue;
    mine = entry.threshold.busted ? 0 : mine + (Number(read[0]) || 0);
    seer += Number(read[1]) || 0;
  }
  return seer > 0 ? Math.round((mine / seer) * 100) : null;
}

/**
 * The 판 읽기 axis of the burst score (C-1(1), 사용자 2026-10-25 「전부 1」:
 * weight 0.2, the six axes before it shrunk by the same ratio): the case's
 * index (`getCaseRead`) kept within 0 to 100. A bare hand that pushed past
 * where the seer stopped and lived can read over 100%; the axis stops at 100.
 * A log with nothing to compare scores 0: every window the page settles
 * writes its read, a story-mode season is never ranked, and a season begun
 * before the axis is refused by the ranking (20261102030000), so only an
 * older log or one written by something else than the page reads 0.
 */
export function getReadingScore(log = []) {
  const read = getCaseRead(log);
  return read === null ? 0 : clamp(read, 0, 100);
}

/** A count the season's 관점 전환 can be read from: at most eight kinds, each a whole number from 0 to 999,999. */
const isCognitionMix = (mix) =>
  Boolean(mix) && typeof mix === "object" && !Array.isArray(mix) && Object.keys(mix).length <= 8 &&
  Object.values(mix).every((count) => Number.isInteger(count) && count >= 0 && count <= 999999);

/**
 * The season's score on the ranking (사용자 2026-10-22 Q7 (1)): the mean of its
 * cases' burst scores, with the tier and letter that number earns. It used to
 * be the finale's own score, made from the eight or so decisions of the last
 * case only, since every case starts its log anew.
 *
 * One axis is read off the whole season instead (사용자 2026-10-23 Q25 (1)):
 * 관점 전환, whose reach (kinds / 4) a case of seven decisions rarely fills,
 * which cost a season of one approach per case up to eight points. Each case's
 * own 관점 전환 (weight 0.16 since the 판 읽기 axis took 0.2 of the score,
 * C-1(1); 0.2 before) is swapped for the one its decisions make together
 * across the season (`cognitionMix` summed), so the score is
 * (25 * sum of scores + 4 * (cases * season's - sum of the cases')) / (25 * cases),
 * kept within 0 to 100 and rounded half up to a whole number (`Math.round`;
 * the server's `round()` agrees on numbers that are never negative). A season
 * with a case that carries no count (closed before the count was kept), or
 * whose counts are not ones, keeps the plain mean.
 *
 * A case played again counts its first close (`firstBurstScore`,
 * `firstCognitionMix`, createCaseSummary): the server keeps a run's first row
 * of each case and drops the replay's, and the two rankings have to agree.
 * Only the season's cases count, and a case with no score to read is left
 * out; a season with none has no score ({}). The server's copy of this is
 * `ranking_run_summary` (20261102020000_season_score_case_mean, with the
 * 0.16 weight since 20261102030000_season_score_reading_axis).
 */
export function getSeasonScore(caseResults = {}, caseIds = CASE_SEQUENCE) {
  const cases = caseIds
    .map((caseId) => caseResults?.[caseId])
    .filter((result) => result && typeof result === "object")
    .map((result) => ({
      score: Number(result.firstBurstScore ?? result.burstScore),
      mix: result.firstCognitionMix !== undefined ? result.firstCognitionMix : result.cognitionMix,
    }))
    .filter(({ score }) => Number.isFinite(score));
  if (!cases.length) return {};
  // 0.16 = 4 / 25, so the sum stays in whole numbers, as the server's does.
  let total = cases.reduce((sum, { score }) => sum + score, 0) * 25;
  const season = {};
  for (const { mix } of cases.filter(({ mix }) => isCognitionMix(mix))) {
    for (const [type, count] of Object.entries(mix)) season[type] = (Object.hasOwn(season, type) ? season[type] : 0) + count;
  }
  if (cases.every(({ mix }) => isCognitionMix(mix)) && isCognitionMix(season)) {
    total += 4 * (cases.length * getCognitionSpread(season) - cases.reduce((sum, { mix }) => sum + getCognitionSpread(mix), 0));
  }
  return scoreMarks(Math.round(clamp(total / (25 * cases.length), 0, 100)));
}
