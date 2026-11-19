import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { authoredNodeOrders } from "../gameCases.js";
import { createTelemetryEventId } from "./telemetryEventId.js";
import runLines from "../copy/runLines.js";
import { fill } from "../locale.js";
import { sendTelemetryItem } from "./telemetryQueuePolicy.js";

/**
 * N22 떠나기 전 한 줄 의견 (owner's answer Q7 (1), 2026-11-16).
 *
 * The case report's feedback form (useFeedback.js) is only reached by a
 * player who closes a case, and most first players leave in the middle of
 * 프롤로그 01 or 02. So once a season, on the sheet between two hands of those
 * two cases, the reveal asks 「여기까지 어땠나요?」 with three buttons -- 재밌음,
 * 어려움, 길다 -- and nothing to type. One press sends one `playtest_feedback`
 * row, the table the form writes, with the answer as a word of three and the
 * scene as a whole number. Not answering is fine: the sheet's own 「다음 판」
 * goes on as always, and the question does not come back that season.
 *
 * Asked only where the answer can be sent: a build with the backend and a
 * device that left 「기록 보내기」 on. Not in a NEW GAME+ season, and not in a
 * prologue played again (the players it is for are on their first one).
 */

/** The cases it is asked in. */
export const PULSE_CASES = Object.freeze(["prologue01", "prologue02"]);

/** The three answers, in the order the buttons stand. */
export const PULSE_ANSWERS = Object.freeze(["fun", "hard", "long"]);

/** The season it was asked in: its run id, so the next season may ask once again. */
export const PULSE_STORAGE_KEY = "critical-point-between-pulse-v1";

/**
 * Not on the first sheet of the season: a player who has settled one hand
 * has not seen enough to say. From the second hand on.
 */
export const PULSE_MIN_HANDS = 2;

/** The scene's place in its case as written (1 to 5), or 0 for one the graph adds. */
export function pulseSceneNo(caseId, nodeId) {
  return (authoredNodeOrders[caseId] ?? []).indexOf(nodeId) + 1;
}

/**
 * Whether the sheet about to open asks. `hands` is the season's settled hands
 * counting this one (the log's length); `askedRunId` what the device stored.
 */
export function shouldAskPulse({ caseId, caseClosed, consent, telemetryOn, veteran = false, replay = false, hands = 0, runId, askedRunId = readStoredValue(PULSE_STORAGE_KEY, "") }) {
  return PULSE_CASES.includes(caseId)
    && caseClosed !== true
    && consent === true
    && telemetryOn === true
    && veteran !== true
    && replay !== true
    && Number(hands) >= PULSE_MIN_HANDS
    && typeof runId === "string" && runId.length > 0
    && askedRunId !== runId;
}

/** Shown once: the season is marked as soon as the question is on screen. */
export function markPulseAsked(runId) {
  return writeStoredValue(PULSE_STORAGE_KEY, runId);
}

/**
 * The row: the form's own shape (`createFeedbackTelemetryPayload`), its
 * scores and comment empty, with `kind`, `answer` and `sceneNo` beside them.
 * Null for an answer that is not one of the three.
 */
export function createPulseItem({ sessionId, sessionCode, caseId, caseLabel = caseId, sceneNo, answer, now = new Date() }) {
  if (!PULSE_ANSWERS.includes(answer) || !PULSE_CASES.includes(caseId)) return null;
  const submittedAt = now.toISOString();
  return {
    id: `feedback-pulse-${caseId}-${now.getTime()}`,
    type: "feedback",
    label: fill(runLines.queue.feedback, { case: caseLabel }),
    payload: {
      event_id: createTelemetryEventId(),
      session_id: sessionId,
      session_code: sessionCode,
      case_id: caseId,
      feedback: {
        kind: "between-hands",
        answer,
        sceneNo: Number.isInteger(sceneNo) && sceneNo > 0 ? sceneNo : null,
        submittedAt,
        clarity: null,
        difficulty: null,
        comment: null,
      },
    },
  };
}

/**
 * Sends the answer; a send that fails goes to the retry queue like the
 * form's. Resolves to "sent", "queued" or "dropped" (not an answer).
 */
export async function sendPulseAnswer(fields, { queueTelemetry, send = sendTelemetryItem } = {}) {
  const item = createPulseItem(fields);
  if (!item) return "dropped";
  try {
    await send(item);
    return "sent";
  } catch {
    queueTelemetry?.(item);
    return "queued";
  }
}
