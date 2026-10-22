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
 * The season's score on the ranking (사용자 2026-10-22 Q7 (1)): the mean of its
 * cases' burst scores, rounded half up to a whole number (`Math.round`; the
 * server's `round()` agrees on numbers that are never negative), with the tier
 * and letter that number earns. It used to be the finale's own score, made
 * from the eight or so decisions of the last case only, since every case
 * starts its log anew.
 *
 * A case played again counts the score of its first close
 * (`firstBurstScore`, createCaseSummary): the server keeps a run's first row
 * of each case and drops the replay's, and the two rankings have to agree.
 * Only the season's cases count, and a case with no score to read is left
 * out; a season with none has no score ({}). The server's copy of this is
 * `ranking_run_summary` (20261102020000_season_score_case_mean).
 */
export function getSeasonScore(caseResults = {}, caseIds = CASE_SEQUENCE) {
  const scores = caseIds
    .map((caseId) => caseResults?.[caseId])
    .filter((result) => result && typeof result === "object")
    .map((result) => Number(result.firstBurstScore ?? result.burstScore))
    .filter((score) => Number.isFinite(score));
  if (!scores.length) return {};
  const mean = scores.reduce((total, score) => total + score, 0) / scores.length;
  return scoreMarks(Math.round(clamp(mean, 0, 100)));
}
