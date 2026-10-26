import { useState } from "react";

import { createBoardReportPayload, describeBoardReportFailure } from "../boardReport.js";
import { getBoardWriterId, saveBoardReport } from "../telemetry.js";

const REPORT_SENT = "신고를 받았습니다. 운영자가 확인하고 필요하면 글을 내립니다.";
const REPORT_NEEDS_REASON = "신고 사유를 하나 골라 주세요.";
const REPORT_NO_SERVER = "이 배포에는 게시판 서버가 없어 신고를 보내지 못했습니다.";

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
      setReportStatus(REPORT_NEEDS_REASON);
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
        setReportStatus(REPORT_NO_SERVER);
        return;
      }
      setReportedIds((ids) => new Set(ids).add(postId));
      setOpenPostId(null);
      setReason("");
      setReportStatus(REPORT_SENT);
    } catch (error) {
      console.warn(error);
      setReportStatus(describeBoardReportFailure(error, globalThis.navigator?.onLine !== false));
    } finally {
      setIsSending(false);
    }
  }

  return { openPostId, reason, isSending, reportedIds, reportStatus, toggleReport, cancelReport, pickReason, submitReport };
}
