import { CASE_SEQUENCE } from "./gameCases.js";
import W from "./copy/introPanels.js";

/**
 * The analyst's record title (기록 칭호): a name for how far this device's
 * record goes, so a returning player can see they are rising. Titles only
 * (C1, user decision 2026-11-05): the score and the limits do not move with it.
 *
 * It is the record's title, not a job. The story never promotes the analyst
 * -- 수습 in 프롤로그 01, 심사 담당 after it, 트리거랩 분석관 from 사건 01, moved
 * down to a branch in 사건 08 and out to KD캐피탈 in 사건 25 (docs/canon.md,
 * "The people") -- so the screen labels it 기록 칭호 and no scene ever names
 * it. It is read off progress the save and the season record already keep:
 * the case in play, the cases closed, and whether a season has been finished
 * (NEW GAME+ open). Nothing new is stored.
 *
 * Five steps, each at a milestone the game already has; a step holds until
 * the next one:
 *   수습 분석관  from 프롤로그 01 -- a new run. 프롤로그 01 is the trainee's last
 *               task (docs/canon.md, 2022-10-17 to 10-21).
 *   분석관      from 프롤로그 02 -- 프롤로그 01 closed. The traineeship ends on
 *               2022-10-21 and from 프롤로그 02 on the analyst is not called a
 *               trainee (canon; check:canon `trainee-after-1021`), and 02 is
 *               the first case whose briefing opens a new rule (NEW PROTOCOL).
 *   선임 분석관  from 사건 01 -- the prologue done; the 2025 season begins.
 *   책임 분석관  from 사건 25 -- half the season's 49 cases reached (24 closed).
 *   수석 분석관  once the finale has been closed -- this device has finished a
 *               season, which is also when NEW GAME+ opens; a second season
 *               keeps it from its first page.
 */
export const ANALYST_TITLE_STEPS = [
  { id: "prologue01", from: "prologue01" },
  { id: "prologue02", from: "prologue02" },
  { id: "case01", from: "case01" },
  { id: "case25", from: "case25" },
  // No case: the step starts one past the finale, where a closed finale reaches.
  { id: "finished", from: null },
].map(({ id, from }) => ({
  id,
  from,
  // The title in the page's language (src/copy/introPanels.js), read when it is asked for.
  get title() {
    return W.analystTitles[id];
  },
}));

/** One past the finale: where a finished season stands on the season's line. */
const SEASON_FINISHED = CASE_SEQUENCE.length;

const STEP_STARTS = ANALYST_TITLE_STEPS.map((step) => (step.from === null ? SEASON_FINISHED : CASE_SEQUENCE.indexOf(step.from)));

/**
 * The furthest place in the season this record has reached: the case in play,
 * the one after the furthest case closed (one past the finale when the finale
 * is closed), or one past the finale when a season has been finished on this
 * device. A case replayed from the roadmap does not take the title back down,
 * because the closed cases still count. -1 for a record that has reached
 * nothing the season knows.
 */
export function readFurthestCase({ currentCase = null, caseResults = {}, finishedSeason = false } = {}) {
  const closed = Object.keys(caseResults ?? {})
    .map((caseId) => CASE_SEQUENCE.indexOf(caseId))
    .filter((index) => index >= 0)
    .map((index) => index + 1);
  return Math.max(CASE_SEQUENCE.indexOf(currentCase), ...closed, finishedSeason ? SEASON_FINISHED : -1);
}

/** The record title for that place, or "" when the record has reached nothing. */
export function getAnalystTitle(progress = {}) {
  const furthest = readFurthestCase(progress);
  if (furthest < 0) return "";
  let title = "";
  STEP_STARTS.forEach((start, step) => {
    if (start >= 0 && furthest >= start) title = ANALYST_TITLE_STEPS[step].title;
  });
  return title;
}
