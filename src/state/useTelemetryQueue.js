import { useEffect, useLayoutEffect, useRef } from "react";

import {
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  writeSaveState,
} from "../appConfig.js";
import { createTelemetryEventId, sanitizeTelemetryQueue, validateTelemetryItem } from "./payloadSchemas.js";
import { reconcileTelemetryQueue, sendTelemetryBatch } from "./telemetryBatch.js";
import { pruneTelemetryQueue } from "./telemetryQueuePolicy.js";
import noticesCopy from "../copy/notices.js";
import runLines from "../copy/runLines.js";
import { fill } from "../locale.js";

// Rows built before payloads minted their own `event_id` (the case rows built
// in GameRuntime) get one when they are queued, so every retry reuses it.
function withEventId(item) {
  if (typeof item?.payload?.event_id === "string" && item.payload.event_id) return item;
  return { ...item, payload: { ...item.payload, event_id: createTelemetryEventId() } };
}

/**
 * The outbound telemetry queue: buffer an item, flush the buffer, and back off
 * when the network or storage refuses.
 *
 * Consent and connectivity are read from refs at the moment of sending. The
 * retry timer used to call the `scheduleTelemetryRetry` of the render that set
 * it, whose `dataConsent` was the one from before the player unticked the box,
 * so a revoked consent kept sending on every backoff tick.
 *
 * The pass over the queue is `sendTelemetryBatch` (telemetryBatch.js):
 * what a failure means, which rows wait, and where the batch stops.
 */
// A wait the server asked for is not a network blip, so the backoff runs on
// past a minute: a ranking row a day early would otherwise ask 1,440 times.
const RETRY_DELAY_CAP_MS = 5 * 60_000;

// The lines are copy/runLines.js `remote`. `unranked` is said when a ranking
// row is let go because the server does not hold every case of its run
// (telemetryBatch.isUnrankableRefusal); it names the two ways that happens,
// since the player can do something about one of them next time. `beatTable`
// when its season has a case closed before the table paid the logic streak
// (telemetryBatch.isBeatTableRefusal).

/**
 * What the status line says after a pass over the queue. A ranking row that
 * was let go is said first and whatever else happened after it: it is the one
 * outcome the player cannot see anywhere else, and the row is no longer in the
 * queue to be counted as waiting.
 */
export function describeBatchResult({ queueCommitted, left, refused = 0, unranked = 0, beatTable = 0 }) {
  if (!queueCommitted) {
    return {
      tone: "error",
      text: runLines.remote.queueCommitFailed,
    };
  }
  const words = runLines.remote;
  const lines = [];
  if (unranked > 0) lines.push(words.unranked);
  if (beatTable > 0) lines.push(words.beatTable);
  if (refused > 0) lines.push(fill(words.refused, { count: refused }));
  if (left > 0) lines.push(fill(words.left, { count: left }));
  if (lines.length === 0) return { tone: "success", text: words.done };
  return { tone: "error", text: lines.join(" ") };
}

export function useTelemetryQueue({
  pendingTelemetryRef,
  setPendingTelemetry,
  setTelemetryStatus,
  setIsRetryingTelemetry,
  setTelemetryRetryInfo,
  telemetryRetryTimerRef,
  isOnline,
  dataConsent,
  telemetryEnabled,
  isRetryingTelemetry,
  telemetryRetryAttemptRef,
  setSaveStatus,
  setLastSavedAt,
}) {
  const liveRef = useRef({ dataConsent, isOnline, isRetryingTelemetry });
  const scheduleRef = useRef(null);
  const retryingRef = useRef(false);

  useLayoutEffect(() => {
    liveRef.current = { dataConsent, isOnline, isRetryingTelemetry };
  }, [dataConsent, isOnline, isRetryingTelemetry]);

  const canSend = () => telemetryEnabled && liveRef.current.dataConsent && liveRef.current.isOnline;

  // Revoking consent or going offline cancels a retry already on the clock.
  useEffect(() => {
    if (dataConsent && isOnline) return;
    window.clearTimeout(telemetryRetryTimerRef.current);
    telemetryRetryTimerRef.current = null;
  }, [dataConsent, isOnline, telemetryRetryTimerRef]);

  function queueTelemetry(item) {
    const queued = withEventId(item);
    if (validateTelemetryItem(queued).length) {
      console.warn("Critical Point telemetry item was not queued", validateTelemetryItem(queued));
      return false;
    }
    const nextQueue = pruneTelemetryQueue([
      ...pendingTelemetryRef.current.filter((existing) => existing.id !== queued.id),
      { queuedAt: new Date().toISOString(), ...queued },
    ]);
    return commitPendingTelemetryQueue(nextQueue);
  }

  /**
   * The queue is part of the save, so it is written the way the save is:
   * through `writeSaveState`, which stamps a revision and tells the cloud copy.
   * It refuses when another tab has written since this tab last did -- the queue
   * then lives in memory and rides along with this tab's next save.
   */
  function commitPendingTelemetryQueue(nextQueue) {
    const queue = sanitizeTelemetryQueue(nextQueue);
    pendingTelemetryRef.current = queue;
    setPendingTelemetry(queue);
    const latestSaved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
    const savedAt = new Date().toISOString();
    const payload = latestSaved ? { ...latestSaved, pendingTelemetry: queue, savedAt } : null;
    if (!isSavedStateShapeValid(payload)) {
      setSaveStatus(runLines.remote.queueSaveFailed);
      return false;
    }
    const result = writeSaveState(payload, { isAhead: () => true });
    if (result.saved) {
      setLastSavedAt(savedAt);
      return true;
    }
    if (!result.stale && !result.replay) {
      setSaveStatus(noticesCopy.save.queueUnavailable);
    }
    return false;
  }

  async function retryPendingTelemetry() {
    const retryBatch = pendingTelemetryRef.current;
    if (!canSend() || retryBatch.length === 0 || retryingRef.current || liveRef.current.isRetryingTelemetry) {
      return { attempted: false, failedCount: retryBatch.length };
    }
    retryingRef.current = true;
    setIsRetryingTelemetry(true);
    setTelemetryStatus({
      tone: "pending",
      // A case row's first send comes through here too (useChoiceCommit), so
      // this does not say "again".
      text: fill(runLines.remote.sending, { count: retryBatch.length }),
    });

    // A row is sent only while the queue still holds it: the consent box
    // empties the queue on an untick, and a tick a moment later must not send
    // what the player was just told had been deleted.
    const isQueued = (item) => pendingTelemetryRef.current.some((queued) => queued.id === item.id);
    const { kept, aborted, refused, unranked, beatTable } = await sendTelemetryBatch(retryBatch, { canSend, isQueued });
    retryingRef.current = false;
    setIsRetryingTelemetry(false);
    if (aborted) {
      // Revoking consent clears the queue itself (IntroScreen); going offline
      // keeps it for the next retry. Either way nothing here rewrites it.
      return { attempted: true, failedCount: pendingTelemetryRef.current.length, aborted: true };
    }

    // From the queue as it is now: rows queued during the batch stay, and a
    // queue the player cleared during it stays cleared (reconcileTelemetryQueue).
    const nextQueue = pruneTelemetryQueue(reconcileTelemetryQueue(pendingTelemetryRef.current, retryBatch, kept));
    const queueCommitted = commitPendingTelemetryQueue(nextQueue);
    if (queueCommitted && nextQueue.length === 0) {
      telemetryRetryAttemptRef.current = 0;
      setTelemetryRetryInfo({ attempt: 0, nextRetryAt: "" });
    }
    setTelemetryStatus(describeBatchResult({ queueCommitted, left: nextQueue.length, refused, unranked, beatTable }));
    return { attempted: true, failedCount: nextQueue.length, queueCommitted };
  }

  function scheduleTelemetryRetry({ immediate = false } = {}) {
    if (!canSend() || pendingTelemetryRef.current.length === 0 || retryingRef.current) return;
    if (telemetryRetryTimerRef.current) return;
    const attempt = immediate ? 0 : telemetryRetryAttemptRef.current + 1;
    const delayMs = immediate ? 0 : Math.min(RETRY_DELAY_CAP_MS, 2_000 * 2 ** Math.max(0, Math.min(attempt, 12) - 1));
    const nextRetryAt = new Date(Date.now() + delayMs).toISOString();
    telemetryRetryAttemptRef.current = attempt;
    setTelemetryRetryInfo({ attempt, nextRetryAt });
    telemetryRetryTimerRef.current = window.setTimeout(async () => {
      telemetryRetryTimerRef.current = null;
      const result = await retryPendingTelemetry();
      // The next attempt goes through the latest render's scheduler, which
      // re-checks consent and connectivity before it sets another timer.
      if (result?.failedCount > 0 && !result.aborted) scheduleRef.current?.();
    }, delayMs);
  }

  useLayoutEffect(() => {
    scheduleRef.current = scheduleTelemetryRetry;
  });

  return { queueTelemetry, retryPendingTelemetry, scheduleTelemetryRetry };
}
