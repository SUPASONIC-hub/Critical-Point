/**
 * Reporting a post on the 참가자 게시판 (supabase/migrations/20261027000000_board_reports.sql).
 *
 * A report is a post id, one of four reasons and the board writer id, and
 * nothing typed: a report cannot carry the abuse it is about. The reasons are
 * the table's check constraint, in the same order; `npm run check:grants` sends
 * every one of them as anon, and one that is not, so the two lists cannot
 * drift apart unseen.
 *
 * A leaf module with no imports, so the board screen's chunk and the grants
 * check can both read it without pulling anything else along. The reasons'
 * labels and the refusals are words of the board screen, which lays another
 * language over them in place (src/copy/board.js).
 */
export const BOARD_REPORT_REASONS = Object.freeze([
  { id: "spam", label: "광고·도배" },
  { id: "abuse", label: "욕설·괴롭힘" },
  { id: "privacy", label: "개인정보 노출" },
  { id: "other", label: "그 밖의 문제" },
]);

const REASON_IDS = new Set(BOARD_REPORT_REASONS.map((reason) => reason.id));

/** The row as posted, before `buildTelemetryPayload` adds the event id. */
export function createBoardReportPayload({ postId, reason, sessionId }) {
  if (!Number.isSafeInteger(postId) || postId <= 0) throw new Error(`board report names no post: ${postId}`);
  if (!REASON_IDS.has(reason)) throw new Error(`unknown board report reason: ${reason}`);
  return { post_id: postId, session_id: sessionId, reason };
}

/**
 * What the reporter is told when the server refuses. It refuses in English (a
 * trigger that also answers `curl`), so each refusal it can raise has a
 * sentence here, and anything else falls back to the general one.
 */
export const BOARD_REPORT_FAILURES = {
  gone: "이미 내려간 글입니다. 신고하지 않아도 됩니다.",
  limit: "한 시간에 신고할 수 있는 횟수를 넘었습니다. 시간을 두고 다시 눌러 주세요.",
  offline: "오프라인이라 신고를 보내지 못했습니다. 연결된 뒤에 다시 눌러 주세요.",
  failed: "신고를 보내지 못했습니다. 잠시 뒤에 다시 눌러 주세요.",
};

export function describeBoardReportFailure(error, isOnline) {
  const message = `${error?.serverMessage ?? ""} ${error instanceof Error ? error.message : ""}`;
  if (/names no visible post/.test(message)) return BOARD_REPORT_FAILURES.gone;
  if (/report rate limit exceeded/.test(message)) return BOARD_REPORT_FAILURES.limit;
  if (!isOnline) return BOARD_REPORT_FAILURES.offline;
  return BOARD_REPORT_FAILURES.failed;
}
