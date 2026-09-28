import { CASE_SEQUENCE } from "../gameCases.js";
import { saveCaseTelemetry, saveErrorTelemetry, saveFeedbackTelemetry } from "../telemetry.js";
import { validateTelemetryItem } from "./payloadSchemas.js";

/**
 * What the queue has to be able to hold: a whole season played with no server
 * in reach. That is a row for every case and the ranking row after them, the
 * feedback a player may send on each case, and a few error reports. The cap
 * was 50 while a season writes 56 rows, so the first cases of an offline season
 * fell off the front and that run could never rank. Counted from the season,
 * so the next case added does not bring the bug back.
 */
const TELEMETRY_QUEUE_ERROR_ITEMS = 8;
export const TELEMETRY_QUEUE_MAX_ITEMS = CASE_SEQUENCE.length * 2 + 1 + TELEMETRY_QUEUE_ERROR_ITEMS;
const TELEMETRY_QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// What goes first when the queue is over its cap: an error report is the
// cheapest loss, a case row the dearest -- a run missing one cannot rank.
const DROP_ORDER = ["error", "feedback", "case"];

export function pruneTelemetryQueue(items, now = Date.now()) {
  const fresh = (Array.isArray(items) ? items : []).filter((item) => {
    const queuedAt = Date.parse(item?.queuedAt ?? "");
    return !Number.isFinite(queuedAt) || now - queuedAt <= TELEMETRY_QUEUE_TTL_MS;
  });
  let excess = fresh.length - TELEMETRY_QUEUE_MAX_ITEMS;
  if (excess <= 0) return fresh;
  const dropped = new Set();
  for (const type of [...DROP_ORDER, null]) {
    for (const item of fresh) {
      if (excess <= 0) break;
      if (dropped.has(item) || (type !== null && item?.type !== type)) continue;
      dropped.add(item);
      excess -= 1;
    }
  }
  return fresh.filter((item) => !dropped.has(item));
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
  if (validationErrors.length) {
    return Promise.reject(Object.assign(new Error(`Invalid telemetry item: ${validationErrors.join(", ")}`), { invalid: true }));
  }
  return SENDERS[item.type](item.payload, item.payload.event_id ?? item.id);
}
