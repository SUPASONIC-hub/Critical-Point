/**
 * 게시판 「이번 주 질문」 (N33, 2026-11-16 결정 Q10 (1)): one question pinned
 * over the board's posts, changing on the day the week's rule does (Monday
 * 00:00 KST, the ISO week of weeklyCalendar.js).
 *
 * The questions are ours (the makers', 「우리」), written in advance and lined
 * up by week, so an empty board still has something to answer. They are
 * static: no server row, no admin screen, nothing a player can change. The
 * words are src/copy/board.js `weekQuestion.questions`, by id, in each
 * language; this file only says which id belongs to which week.
 *
 * The first four weeks are 2026-W47 to W50. A week with no entry has no
 * question and the board looks as it did: a later batch is one more line per
 * week here and its words in the copy table (the unit test holds both sides
 * to each other).
 *
 * The clock is the week's rule's own (state/weeklyClock.js), so the e2e and
 * visual builds, held on a January week with no entry, never draw it.
 */
import { isoWeekKey } from "./gauntlet/weeklyCalendar.js";

export const WEEK_QUESTIONS = Object.freeze([
  Object.freeze({ week: "2026-W47", id: "first-stake" }),
  Object.freeze({ week: "2026-W48", id: "stopped-at-wall" }),
  Object.freeze({ week: "2026-W49", id: "numbers-or-people" }),
  Object.freeze({ week: "2026-W50", id: "short-clock" }),
]);

/** This week's question id at `ms` (KST ISO week), or "" for a week with none. */
export function weekQuestionId(ms, calendar = WEEK_QUESTIONS) {
  const week = isoWeekKey(ms);
  if (!week) return "";
  return calendar.find((entry) => entry.week === week)?.id ?? "";
}

/**
 * The question's words for `id` in a table of them (copy/board.js
 * `weekQuestion.questions`), or "" when the table has none by that id.
 */
export function weekQuestionText(questions, id) {
  if (!id || !questions || !Object.hasOwn(questions, id)) return "";
  const text = questions[id];
  return typeof text === "string" ? text : "";
}
