import { saveCaseTelemetry, saveErrorTelemetry, saveFeedbackTelemetry } from "../telemetry.js";
import { validateTelemetryItem } from "./payloadSchemas.js";

export const TELEMETRY_QUEUE_MAX_ITEMS = 50;
const TELEMETRY_QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function pruneTelemetryQueue(items, now = Date.now()) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => {
      const queuedAt = Date.parse(item?.queuedAt ?? "");
      return !Number.isFinite(queuedAt) || now - queuedAt <= TELEMETRY_QUEUE_TTL_MS;
    })
    .slice(-TELEMETRY_QUEUE_MAX_ITEMS);
}

const SENDERS = { case: saveCaseTelemetry, feedback: saveFeedbackTelemetry, error: saveErrorTelemetry };

/**
 * Sends one telemetry row, first attempt or retry alike. The privacy check runs
 * before every send -- it used to run on retries only, so a row that should
 * never have left went out on the first try and then failed forever from the
 * queue. The row's own `event_id` is its idempotency key; the queue id is only
 * the fallback for rows queued before payloads carried one.
 */
export function sendTelemetryItem(item) {
  const validationErrors = validateTelemetryItem(item);
  if (validationErrors.length) return Promise.reject(new Error(`Invalid telemetry item: ${validationErrors.join(", ")}`));
  return SENDERS[item.type](item.payload, item.payload.event_id ?? item.id);
}
