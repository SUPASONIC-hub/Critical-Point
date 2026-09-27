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
import { pruneTelemetryQueue, sendTelemetryItem } from "./telemetryQueuePolicy.js";

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
 */
const RETRYABLE_CLIENT_STATUSES = new Set([408, 425, 429]);

function isPermanentRefusal(error) {
  const status = Number(error?.status);
  return status >= 400 && status < 500 && !RETRYABLE_CLIENT_STATUSES.has(status);
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
      setSaveStatus("원격 저장 대기열을 저장하지 못했습니다. 브라우저 저장본을 확인해 주세요.");
      return false;
    }
    const result = writeSaveState(payload, { isAhead: () => true });
    if (result.saved) {
      setLastSavedAt(savedAt);
      return true;
    }
    if (!result.stale && !result.replay) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 원격 저장 대기열 변경을 반영하지 못했습니다.");
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
      text: `대기 중인 원격 저장 ${retryBatch.length}건을 다시 전송하는 중입니다.`,
    });

    const failedItems = [];
    let aborted = false;
    for (const item of retryBatch) {
      // The player can untick consent while a send is in flight: stop there.
      if (!canSend()) {
        aborted = true;
        break;
      }
      try {
        await sendTelemetryItem(item);
      } catch (error) {
        console.warn(error);
        // A 4xx other than timeout/too-early/rate-limit is the server refusing
        // the row itself (a season-final for a run with missing case rows, a
        // payload over its cap). Sending it again for seven days changes nothing.
        if (!isPermanentRefusal(error)) failedItems.push(item);
      }
    }
    retryingRef.current = false;
    setIsRetryingTelemetry(false);
    if (aborted) {
      // Revoking consent clears the queue itself (IntroScreen); going offline
      // keeps it for the next retry. Either way nothing here rewrites it.
      return { attempted: true, failedCount: pendingTelemetryRef.current.length, aborted: true };
    }

    const retryIds = new Set(retryBatch.map((item) => item.id));
    const newlyQueuedItems = pendingTelemetryRef.current.filter((item) => !retryIds.has(item.id));
    const nextQueue = pruneTelemetryQueue([...failedItems, ...newlyQueuedItems]);
    const queueCommitted = commitPendingTelemetryQueue(nextQueue);
    if (queueCommitted && nextQueue.length === 0) {
      telemetryRetryAttemptRef.current = 0;
      setTelemetryRetryInfo({ attempt: 0, nextRetryAt: "" });
    }
    setTelemetryStatus(
      queueCommitted && nextQueue.length === 0
        ? {
            tone: "success",
            text: "대기 중이던 원격 저장을 모두 완료했습니다.",
          }
        : {
            tone: "error",
            text: queueCommitted
              ? `원격 저장 ${nextQueue.length}건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요.`
              : "원격 저장 응답을 받았지만 브라우저 저장본 갱신에 실패했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
          },
    );
    return { attempted: true, failedCount: nextQueue.length, queueCommitted };
  }

  function scheduleTelemetryRetry({ immediate = false } = {}) {
    if (!canSend() || pendingTelemetryRef.current.length === 0 || retryingRef.current) return;
    if (telemetryRetryTimerRef.current) return;
    const attempt = immediate ? 0 : telemetryRetryAttemptRef.current + 1;
    const delayMs = immediate ? 0 : Math.min(60_000, 2_000 * 2 ** Math.max(0, attempt - 1));
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
