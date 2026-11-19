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
 * anything malformed give nothing. `words` are the ranking screen's
 * (src/copy/ranking.js: hallBadge, hallMainBoard, hallProvisional), so the
 * badge reads in the page's language; a week's board keeps its ISO name.
 */
export function hallOfFameBadges(rows, words) {
  const badges = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const place = Number(row?.place);
    if (typeof row?.run_tag !== "string" || !row.run_tag || !(place >= 1 && place <= HALL_OF_FAME_PLACES) || typeof row.board !== "string") continue;
    const board = row.board.startsWith("table-") ? words.hallMainBoard : row.board;
    const label = words.hallBadge.replace("{board}", board).replace("{place}", String(place)) + (row.settled_on ? "" : words.hallProvisional);
    badges.set(row.run_tag, [...(badges.get(row.run_tag) ?? []), label]);
  }
  return badges;
}

/**
 * N46 (11-18 「1」): while a board keeps no place yet, how far it is from its
 * first three, 「첫 세 자리는 10시즌이 모이면 열립니다 (지금 n/10)」, one line a
 * board on the ranking screen in place of the bare 「표본 부족」 the daily log
 * keeps. Read off the same view as the badges: each board's row carries the
 * server's own count (`checked_seasons`, hall_of_fame_counts), places or not.
 *
 * Only boards still filling: not settled (a settled board never takes a
 * place), below `HALL_OF_FAME_MIN_SEASONS`, with no place yet; and of the
 * week boards only `week`'s own (the week the device's weekly clock is in),
 * since a past week's board takes no more seasons while it waits 28 days to
 * settle. The table's board comes first. Returns [{ board, label, count }],
 * `label` the badge's words for the board (the table's own board, or a week's
 * ISO name), `count` never above the threshold.
 */
export function hallOfFameProgress(rows, words, week = null) {
  const boards = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const count = Number(row?.checked_seasons);
    if (typeof row?.board !== "string" || !Number.isInteger(count) || count < 0) continue;
    const isTable = row.board.startsWith("table-");
    if (!isTable && row.board !== week) continue;
    const seen = boards.get(row.board);
    const placed = Number(row.place) >= 1;
    boards.set(row.board, {
      board: row.board,
      label: isTable ? words.hallMainBoard : row.board,
      count: Math.max(seen?.count ?? 0, count),
      closed: Boolean(seen?.closed || placed || row.settled_on),
      isTable,
    });
  }
  return [...boards.values()]
    .filter((board) => !board.closed && board.count < HALL_OF_FAME_MIN_SEASONS)
    .sort((a, b) => Number(b.isTable) - Number(a.isTable) || a.board.localeCompare(b.board))
    .map(({ board, label, count }) => ({ board, label, count }));
}
