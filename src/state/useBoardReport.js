import { useState } from "react";

import { createBoardReportPayload, describeBoardReportFailure } from "../boardReport.js";
import { getBoardWriterId, saveBoardReport } from "../telemetry.js";
import boardCopy from "../copy/board.js";

/**
 * The report button on each board post: which post's form is open, the reason
 * picked in it, and what the last report came to.
 *
 * Read by the board screen alone, so it sits in that screen's lazy chunk and
 * not in useBoard, which the pre-start shell carries. The posts this page has
 * reported are kept for the page only: the server takes a second report of
 * the same post from the same writer and drops it (20261027000000), so a
 * report pressed again after a reload costs nothing and inflates nothing.
 */
export function useBoardReport() {
  const [openPostId, setOpenPostId] = useState(null);
  const [reason, setReason] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [reportedIds, setReportedIds] = useState(() => new Set());
  const [reportStatus, setReportStatus] = useState("");

  function toggleReport(postId) {
    if (isSending || reportedIds.has(postId)) return;
    setOpenPostId((current) => (current === postId ? null : postId));
    setReason("");
    setReportStatus("");
  }

  function cancelReport() {
    if (isSending) return;
    setOpenPostId(null);
    setReason("");
  }

  function pickReason(value) {
    setReason(value);
    setReportStatus("");
  }

  async function submitReport() {
    if (isSending || openPostId === null) return;
    if (!reason) {
      setReportStatus(boardCopy.reportNeedsReason);
      return;
    }
    const postId = openPostId;
    setIsSending(true);
    // One id per press, so a double press lands once (`board_reports.event_id`
    // is unique); random, so it ties the report to nothing.
    const eventId =
      globalThis.crypto?.randomUUID?.() ?? `report-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    try {
      const { skipped = false } = await saveBoardReport(
        createBoardReportPayload({ postId, reason, sessionId: getBoardWriterId() }),
        eventId,
      );
      if (skipped) {
        setReportStatus(boardCopy.reportNoServer);
        return;
      }
      setReportedIds((ids) => new Set(ids).add(postId));
      setOpenPostId(null);
      setReason("");
      setReportStatus(boardCopy.reportSent);
    } catch (error) {
      console.warn(error);
      setReportStatus(describeBoardReportFailure(error, globalThis.navigator?.onLine !== false));
    } finally {
      setIsSending(false);
    }
  }

  return { openPostId, reason, isSending, reportedIds, reportStatus, toggleReport, cancelReport, pickReason, submitReport };
}
