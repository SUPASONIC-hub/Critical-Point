import { useState } from "react";

import { FEEDBACK_COMMENT_MAX_LENGTH } from "../appConfig.js";
import { anonymizeSensitiveText, limitText } from "../gameLogic.js";
import { telemetryEnabled } from "../telemetry.js";
import { createTelemetryEventId } from "./payloadSchemas.js";
import { sendTelemetryItem } from "./telemetryQueuePolicy.js";

/** What the form's status line says on `caseId`'s result page: only what was said about that case. */
export function readFeedbackStatus(status, caseId) {
  return status?.caseId === caseId ? status.text : "";
}

/**
 * The line under the feedback form, kept with the case it is about. It was one
 * string for the whole run and nothing cleared it when a case opened, so
 * "피드백을 저장했습니다" from one case stood under the empty form of the next.
 * A send that answers after the player has moved on is still filed under the
 * case it was sent for: the setter belongs to the render that started it.
 */
export function useFeedbackStatus(caseId) {
  const [status, setStatus] = useState({ caseId: null, text: "" });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const setFeedbackStatus = (text) => setStatus({ caseId, text });
  return { feedbackStatus: readFeedbackStatus(status, caseId), setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback };
}

/**
 * Typing a comment wrote the whole save -- stringify, revision bump, cloud
 * notice -- on every keystroke. The comment is state at once and reaches the
 * save once typing pauses, or with the next save of any kind, which carries it
 * anyway. The write goes through the newest render's `persist`: an older one
 * would write that render's run back over whatever happened since.
 */
const FEEDBACK_PERSIST_DELAY_MS = 800;
const pendingFeedbackWrite = { timer: null, persist: null };

function cancelFeedbackWrite() {
  globalThis.clearTimeout(pendingFeedbackWrite.timer);
  pendingFeedbackWrite.timer = null;
  pendingFeedbackWrite.persist = null;
}

function scheduleFeedbackWrite(persist) {
  globalThis.clearTimeout(pendingFeedbackWrite.timer);
  pendingFeedbackWrite.persist = persist;
  pendingFeedbackWrite.timer = globalThis.setTimeout(() => {
    const latestPersist = pendingFeedbackWrite.persist;
    cancelFeedbackWrite();
    latestPersist?.({});
  }, FEEDBACK_PERSIST_DELAY_MS);
}

/**
 * The row `playtest_feedback` takes: the session, the case, and the answers in
 * its `feedback` jsonb. `event_id` is minted here, once, so a retry from the
 * queue names the same row as the first attempt.
 */
function createFeedbackTelemetryPayload({ sessionId, sessionCode, caseId, caseTitle, feedback }) {
  return {
    event_id: createTelemetryEventId(),
    session_id: sessionId,
    session_code: sessionCode,
    case_id: caseId,
    feedback: {
      caseTitle,
      submittedAt: feedback.savedAt,
      clarity: Number(feedback.clarity) || null,
      difficulty: Number(feedback.difficulty) || null,
      comment: feedback.comment.trim() || null,
    },
  };
}

/**
 * Per-case playtest feedback: edit, anonymize, and submit.
 *
 * Submitting always writes locally first; the remote call is best effort and
 * falls back to the retry queue, so a failed network never loses the comment.
 */
export function createFeedbackActions({
  currentCase,
  currentFeedback,
  playtestFeedback,
  setPlaytestFeedback,
  persist,
  activeFeedbackPrivacySignals,
  isSubmittingFeedback,
  setIsSubmittingFeedback,
  setFeedbackStatus,
  dataConsent,
  sessionId,
  sessionCode,
  activeCaseMeta,
  queueTelemetry,
}) {
  // A write waiting on the typing pause always runs with this render's persist.
  if (pendingFeedbackWrite.timer) pendingFeedbackWrite.persist = persist;

  function updateCurrentFeedback(patch) {
    const normalizedPatch =
      typeof patch.comment === "string"
        ? { ...patch, comment: limitText(patch.comment, FEEDBACK_COMMENT_MAX_LENGTH) }
        : patch;
    const nextFeedback = {
      ...playtestFeedback,
      [currentCase]: { ...currentFeedback, ...normalizedPatch },
    };
    setPlaytestFeedback(nextFeedback);
    setFeedbackStatus("");
    const onlyText = Object.keys(normalizedPatch).every((key) => key === "comment");
    if (onlyText) {
      scheduleFeedbackWrite(persist);
      return;
    }
    // A rating is one click: it is written now, with the comment as it stands.
    cancelFeedbackWrite();
    persist({ playtestFeedback: nextFeedback });
  }

  function anonymizeFeedbackComment() {
    updateCurrentFeedback({
      comment: limitText(anonymizeSensitiveText(currentFeedback.comment), FEEDBACK_COMMENT_MAX_LENGTH),
    });
  }

  async function submitCurrentFeedback() {
    if (isSubmittingFeedback) return;
    if (activeFeedbackPrivacySignals.length > 0) {
      setFeedbackStatus("식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요.");
      return;
    }

    setIsSubmittingFeedback(true);
    const savedAt = new Date().toISOString();
    const feedback = {
      ...currentFeedback,
      comment: limitText(currentFeedback.comment, FEEDBACK_COMMENT_MAX_LENGTH),
      savedAt,
    };
    const nextFeedback = { ...playtestFeedback, [currentCase]: feedback };
    setPlaytestFeedback(nextFeedback);
    cancelFeedbackWrite();
    persist({ playtestFeedback: nextFeedback });

    if (!telemetryEnabled || !dataConsent) {
      setFeedbackStatus(
        telemetryEnabled
          ? "로컬에 저장했습니다. 데이터 제공 동의가 없어 원격 저장은 건너뛰었습니다."
          : "로컬에 저장했습니다. 원격 저장 미설정 상태라 원격 저장은 건너뛰었습니다.",
      );
      setIsSubmittingFeedback(false);
      return;
    }

    const item = {
      id: `feedback-${currentCase}-${Date.now()}`,
      type: "feedback",
      label: `${activeCaseMeta?.label ?? currentCase} 피드백`,
      payload: createFeedbackTelemetryPayload({
        sessionId,
        sessionCode,
        caseId: currentCase,
        caseTitle: activeCaseMeta?.title ?? currentCase,
        feedback,
      }),
    };

    try {
      await sendTelemetryItem(item);
      setFeedbackStatus("피드백을 저장했습니다.");
    } catch (error) {
      console.warn(error);
      queueTelemetry(item);
      setFeedbackStatus("로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  return { updateCurrentFeedback, anonymizeFeedbackComment, submitCurrentFeedback };
}
