import { CASE_SEQUENCE } from "./gameCases.js";
import { ACT_CARDS } from "./gauntlet/actCardCopy.js";

/**
 * N23 막 진행 표시 (owner's answer Q6 (1), 2026-11-16). 사건 01 to 07 lose the
 * most players, and the next thing the season gives back after 프롤로그 was
 * the 중간 결산 on 사건 19's act card (N1) -- eighteen cases away. So the
 * report of 사건 01 to 17 says where the player stands, in one line: the act
 * (the act cards' own acts: 1막 is 사건 01~07, 2막 08~12, 3막 13~18), the case's
 * place in it, and how many cases to the next 중간 결산 -- 사건 07's report,
 * which now carries a small one (ActProgress.jsx), or 사건 18's, whose next
 * page is the act card that has carried one since N1.
 *
 * Display only: it reads the case id and nothing of the run.
 */

/** The cases whose report carries the line. */
export const ACT_PROGRESS_CASES = Object.freeze(CASE_SEQUENCE.slice(CASE_SEQUENCE.indexOf("case01"), CASE_SEQUENCE.indexOf("case18")));

/** The reports a 중간 결산 follows: 사건 07's (small, N23) and 사건 18's (on the next act card, N1). */
export const TALLY_AFTER_CASES = Object.freeze(["case07", "case18"]);

/** The small tally on 사건 07's report reads as the card of the act it closes leads into: 사건 08's. */
export const MINI_TALLY_FOR = Object.freeze({ case07: "case08" });

const ACT_STARTS = Object.keys(ACT_CARDS).map((caseId) => CASE_SEQUENCE.indexOf(caseId)).sort((a, b) => a - b);

/**
 * `{ act, pos, size, left }` for a report of 사건 01 to 17 -- 「1막 · 3/7 ·
 * 중간 결산까지 4사건」 -- or null for any other case. `left` is 0 on 사건 07's
 * own report, where the tally is.
 */
export function readActProgress(caseId) {
  if (!ACT_PROGRESS_CASES.includes(caseId)) return null;
  const index = CASE_SEQUENCE.indexOf(caseId);
  const startIndex = ACT_STARTS.filter((start) => start <= index).at(-1);
  const endIndex = (ACT_STARTS.find((start) => start > index) ?? CASE_SEQUENCE.length) - 1;
  const tallyIndex = TALLY_AFTER_CASES.map((id) => CASE_SEQUENCE.indexOf(id)).find((at) => at >= index);
  return {
    act: ACT_CARDS[CASE_SEQUENCE[startIndex]].act,
    pos: index - startIndex + 1,
    size: endIndex - startIndex + 1,
    left: tallyIndex - index,
  };
}

/**
 * N42 떠나는 순간 한 줄 (owner's answer Q7 (1), 2026-11-18). The reports where
 * players most often stop -- 프롤로그 05 (the prologue is done), 사건 03 and
 * 사건 07 (the end of 1막) -- end on one quiet line that the season is saved
 * and what comes next (LeaveLine.jsx), with the home-screen button where the
 * browser offers one. Every run that stopped between 사건 01 and 07 did not
 * come back (Funnel, 11-18).
 */
export const LEAVE_LINE_CASES = Object.freeze(["prologue05", "case03", "case07"]);

/**
 * `{ next, minutes }` for the line -- the next case's own title as the report's
 * next-case panel prints it, and the typical length of a case -- or null for
 * any other report, or one with no next case.
 */
export function readLeaveLine(caseId, nextCaseSignal, minutes) {
  if (!LEAVE_LINE_CASES.includes(caseId) || !nextCaseSignal?.title) return null;
  return { next: nextCaseSignal.title, minutes };
}
