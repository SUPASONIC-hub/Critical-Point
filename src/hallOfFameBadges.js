/**
 * The hall of fame on the ranking screen (D2, 2nd stage): a tag on the row of
 * a run that stands in it, read by run tag from the public view
 * (`public_hall_of_fame`, fetchHallOfFame). Kept apart from src/hallOfFame.js,
 * whose selection needs the checker, so the ranking screen's chunk carries
 * only this. Not mixed with the record title (C1, src/analystTitle.js): that
 * one is progress, this one is a place.
 */

/** Places a board keeps (question 6 (1)). */
export const HALL_OF_FAME_PLACES = 3;
/** Checked seasons a board needs before it keeps any place (question 6 (1)). */
export const HALL_OF_FAME_MIN_SEASONS = 10;
/** A week's board settles this many days after its Monday (question 9 (1)). */
export const WEEK_SETTLE_DAYS = 28;

/** A board's name for people: the table's own board, or a week's. */
export function hallOfFameBoardLabel(board) {
  return typeof board === "string" && board.startsWith("table-") ? `본 판 (판 규칙 ${board.slice(6)})` : String(board);
}

/**
 * Run tag -> its badges, e.g. 「명예의 전당 · 2026-W47 1위 (잠정)」. `rows`
 * are the view's rows; a row with no place (a board below the threshold) and
 * anything malformed give nothing.
 */
export function hallOfFameBadges(rows) {
  const badges = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const place = Number(row?.place);
    if (typeof row?.run_tag !== "string" || !row.run_tag || !(place >= 1 && place <= HALL_OF_FAME_PLACES) || typeof row.board !== "string") continue;
    const board = row.board.startsWith("table-") ? "본 판" : row.board;
    const label = `명예의 전당 · ${board} ${place}위${row.settled_on ? "" : " (잠정)"}`;
    badges.set(row.run_tag, [...(badges.get(row.run_tag) ?? []), label]);
  }
  return badges;
}
