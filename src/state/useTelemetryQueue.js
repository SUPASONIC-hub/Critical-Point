import {
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  writeStoredValue,
} from "../appConfig.js";
import { saveCaseTelemetry, saveErrorTelemetry, saveFeedbackTelemetry } from "../telemetry.js";
import { recordAppError } from "./savedState.js";

const TELEMETRY_RETRY_DELAYS = [4000, 12000, 30000];

/**
 * The outbound telemetry queue: buffer an item, flush the buffer, and back off
 * when the network or storage refuses. Lifted out of App() unchanged; the state
 * it used to capture now arrives as an explicit argument.
 */
export function createTelemetryQueue({
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
  function queueTelemetry(item) {
    const nextQueue = [
      ...pendingTelemetryRef.current.filter((queued) => queued.id !== item.id),
      {
        queuedAt: new Date().toISOString(),
        ...item,
      },
    ];
    commitPendingTelemetryQueue(nextQueue);
  }

  function commitPendingTelemetryQueue(nextQueue) {
    const latestSaved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
    if (!isSavedStateShapeValid(latestSaved)) {
      setSaveStatus("원격 저장 대기열을 저장하지 못했습니다. 브라우저 저장본을 확인해 주세요.");
      return false;
    }
    const savedAt = new Date().toISOString();
    const stored = writeStoredValue(
      STORAGE_KEY,
      JSON.stringify({
        ...latestSaved,
        pendingTelemetry: nextQueue,
        savedAt,
      }),
    );
    if (stored) {
      pendingTelemetryRef.current = nextQueue;
      setPendingTelemetry(nextQueue);
      setLastSavedAt(savedAt);
      return true;
    }
    setSaveStatus("브라우저 저장소를 사용할 수 없어 원격 저장 대기열 변경을 반영하지 못했습니다.");
    return false;
  }

  async function sendTelemetryItem(item) {
    if (item.type === "case") return saveCaseTelemetry(item.payload);
    if (item.type === "feedback") return saveFeedbackTelemetry(item.payload);
    if (item.type === "error") return saveErrorTelemetry(item.payload);
    throw new Error(`Unknown telemetry item type: ${item.type}`);
  }

  async function retryPendingTelemetry() {
    const retryBatch = pendingTelemetryRef.current;
    if (!telemetryEnabled || !dataConsent || !isOnline || retryBatch.length === 0 || isRetryingTelemetry) {
      return { attempted: false, failedCount: retryBatch.length };
    }
    setIsRetryingTelemetry(true);
    setTelemetryStatus({
      tone: "pending",
      text: `대기 중인 원격 저장 ${retryBatch.length}건을 다시 전송하는 중입니다.`,
    });

    const failedItems = [];
    for (const item of retryBatch) {
      try {
        await sendTelemetryItem(item);
      } catch (error) {
        console.warn(error);
        failedItems.push(item);
      }
    }

    const retryIds = new Set(retryBatch.map((item) => item.id));
    const newlyQueuedItems = pendingTelemetryRef.current.filter((item) => !retryIds.has(item.id));
    const nextQueue = [...failedItems, ...newlyQueuedItems];
    const queueCommitted = commitPendingTelemetryQueue(nextQueue);
    const visibleQueue = queueCommitted ? nextQueue : retryBatch;
    setIsRetryingTelemetry(false);
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
              ? `원격 저장 ${visibleQueue.length}건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요.`
              : "원격 저장 응답을 받았지만 브라우저 저장본 갱신에 실패했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
          },
    );
    return { attempted: true, failedCount: visibleQueue.length, queueCommitted };
  }

  function scheduleTelemetryRetry({ immediate = false } = {}) {
    if (!telemetryEnabled || !dataConsent || !isOnline || pendingTelemetryRef.current.length === 0 || isRetryingTelemetry) return;
    if (telemetryRetryTimerRef.current) return;
    const attempt = immediate ? 0 : telemetryRetryAttemptRef.current + 1;
    const delayMs = immediate ? 0 : Math.min(60_000, 2_000 * 2 ** Math.max(0, attempt - 1));
    const nextRetryAt = new Date(Date.now() + delayMs).toISOString();
    telemetryRetryAttemptRef.current = attempt;
    setTelemetryRetryInfo({ attempt, nextRetryAt });
    telemetryRetryTimerRef.current = window.setTimeout(async () => {
      telemetryRetryTimerRef.current = null;
      const result = await retryPendingTelemetry();
      if (result?.failedCount > 0) {
        scheduleTelemetryRetry();
      }
    }, delayMs);
  }

  return { queueTelemetry, commitPendingTelemetryQueue, retryPendingTelemetry, scheduleTelemetryRetry };
}
