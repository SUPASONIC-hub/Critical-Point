import { useState } from "react";

import { FEEDBACK_COMMENT_MAX_LENGTH } from "../appConfig.js";
import { anonymizeSensitiveText, limitText } from "../gameLogic.js";
import { saveFeedbackTelemetry, telemetryEnabled } from "../telemetry.js";

export function useFeedbackStatus() {
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  return { feedbackStatus, setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback };
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

    const feedbackTelemetryPayload = {
      session_id: sessionId,
      session_code: sessionCode,
      case_id: currentCase,
      case_title: activeCaseMeta?.title ?? currentCase,
      submitted_at: savedAt,
      clarity_score: Number(feedback.clarity) || null,
      difficulty_score: Number(feedback.difficulty) || null,
      comment: feedback.comment.trim() || null,
    };

    try {
      await saveFeedbackTelemetry(feedbackTelemetryPayload);
      setFeedbackStatus("피드백을 저장했습니다.");
    } catch (error) {
      console.warn(error);
      queueTelemetry({
        id: `feedback-${currentCase}-${Date.now()}`,
        type: "feedback",
        label: `${activeCaseMeta?.label ?? currentCase} 피드백`,
        payload: feedbackTelemetryPayload,
      });
      setFeedbackStatus("로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  return { updateCurrentFeedback, anonymizeFeedbackComment, submitCurrentFeedback };
}
