import { CASE_SEQUENCE } from "./gameCases.js";

/**
 * The analyst's record title: a name for how far into the season this run's
 * record goes, so a returning player can see they are rising.
 *
 * It is the record's title, not a job. The story never promotes the analyst
 * -- 수습 in 프롤로그 01, 심사 담당 after it, 트리거랩 분석관 from 사건 01, moved
 * down to a branch in 사건 08 and out to KD캐피탈 in 사건 25 (docs/canon.md,
 * "The people") -- so the screen labels it 기록 칭호 and no scene ever names
 * it. It is read off progress the save already has, the case in play and the
 * cases closed; nothing new is stored.
 *
 * Each step starts at the case named; a step holds until the next one.
 */
export const ANALYST_TITLE_STEPS = [
  { from: "prologue01", title: "수습 분석관" },
  { from: "case01", title: "분석관" },
  { from: "case18", title: "선임 분석관" },
  { from: "case36", title: "수석 분석관" },
];

const STEP_STARTS = ANALYST_TITLE_STEPS.map((step) => CASE_SEQUENCE.indexOf(step.from));

/**
 * The furthest place in the season this run has reached: the case in play, or
 * the one after the furthest case closed. A case replayed from the roadmap
 * does not take the title back down, because the closed cases still count.
 * -1 for a run that has reached nothing the season knows.
 */
export function readFurthestCase({ currentCase = null, caseResults = {} } = {}) {
  const closed = Object.keys(caseResults ?? {})
    .map((caseId) => CASE_SEQUENCE.indexOf(caseId))
    .filter((index) => index >= 0)
    .map((index) => Math.min(index + 1, CASE_SEQUENCE.length - 1));
  return Math.max(CASE_SEQUENCE.indexOf(currentCase), ...closed, -1);
}

/** The record title for that place, or "" when the run has reached nothing. */
export function getAnalystTitle(progress = {}) {
  const furthest = readFurthestCase(progress);
  if (furthest < 0) return "";
  let title = "";
  STEP_STARTS.forEach((start, step) => {
    if (start >= 0 && furthest >= start) title = ANALYST_TITLE_STEPS[step].title;
  });
  return title;
}
