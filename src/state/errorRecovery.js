import {
  appendSaveSlot,
  appendStoredErrorLog,
  createSafeErrorContext,
  parseCurrentSavedState,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  serializeError,
  STORAGE_KEY,
  TELEMETRY_QUEUE_TYPES,
  writeStoredValue,
} from "../appConfig.js";
import { getSessionCode, getSessionId, saveErrorTelemetry, telemetryEnabled } from "../telemetry.js";
import { appendTraceEvent, getTraceEvents } from "./trace.js";

export function createSafeDomSnapshot(documentRef = globalThis.document) {
  try {
    const root = documentRef?.querySelector?.("#root");
    if (!root) return "";
    const elements = [
      ...root.querySelectorAll("main, section, article, button, input, select, textarea, [role], [aria-label]"),
    ].slice(0, 40);
    return elements
      .map((element) => {
        const tag = element.tagName.toLowerCase();
        const className =
          typeof element.className === "string"
            ? element.className.split(/\s+/).filter(Boolean).slice(0, 3).join(".")
            : "";
        const role = element.getAttribute("role");
        const ariaLabel = element.getAttribute("aria-label");
        return [tag, className ? `.${className}` : "", role ? `[role=${role}]` : "", ariaLabel ? "[aria-label]" : ""].join("");
      })
      .join(" > ")
      .slice(0, 1800);
  } catch {
    return "";
  }
}

export function getSavedRecoveryState() {
  const saved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : null;
}

export function createErrorRecoveryEntry(error, errorInfo = {}, source = "runtime") {
  const saved = getSavedRecoveryState();
  const serialized = serializeError(error);
  const occurredAt = new Date().toISOString();
  const context = createSafeErrorContext(saved ?? {}, source);

  return {
    id: `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    occurredAt,
    error: serialized,
    componentStack: errorInfo?.componentStack ?? "",
    domSnapshot: createSafeDomSnapshot(),
    viewport: {
      width: globalThis.innerWidth ?? 0,
      height: globalThis.innerHeight ?? 0,
    },
    context,
    trace: getTraceEvents(),
  };
}

export function persistErrorRecovery(entry) {
  appendStoredErrorLog(entry);
  const saved = getSavedRecoveryState();
  if (!saved) return;

  const previousError = saved.lastError;
  const sameRecoveryPoint =
    previousError?.currentCase === entry.context.currentCase &&
    previousError?.nodeId === entry.context.nodeId;
  const recoveredSave = {
    ...saved,
    savedAt: entry.occurredAt,
    paused: true,
    lastError: {
      id: entry.id,
      occurredAt: entry.occurredAt,
      source: entry.context.source,
      message: entry.error.message,
      currentCase: entry.context.currentCase,
      nodeId: entry.context.nodeId,
      retryCount: sameRecoveryPoint ? (Number(previousError.retryCount) || 0) + 1 : 1,
    },
  };
  writeStoredValue(STORAGE_KEY, JSON.stringify(recoveredSave));
  appendSaveSlot(recoveredSave);
}

export function createErrorTelemetryPayload(entry) {
  const sessionId = getSessionId();
  return {
    session_id: sessionId,
    session_code: getSessionCode(sessionId),
    occurred_at: entry.occurredAt,
    source: entry.context.source,
    current_case: entry.context.currentCase,
    node_id: entry.context.nodeId,
    error_name: entry.error.name,
    error_message: entry.error.message,
    error_stack: entry.error.stack,
    component_stack: entry.componentStack,
    dom_snapshot: entry.domSnapshot ?? "",
    viewport: entry.viewport ?? {},
    context: entry.context,
  };
}

export function queueSavedErrorTelemetry(entry) {
  const saved = getSavedRecoveryState();
  if (!saved) return false;
  const pendingTelemetry = Array.isArray(saved.pendingTelemetry) ? saved.pendingTelemetry : [];
  const nextQueue = [
    ...pendingTelemetry.filter((item) => item.id !== entry.id),
    {
      id: entry.id,
      queuedAt: new Date().toISOString(),
      type: TELEMETRY_QUEUE_TYPES.includes("error") ? "error" : "case",
      label: `${entry.context.currentCase} / ${entry.context.nodeId} error log`,
      payload: createErrorTelemetryPayload(entry),
    },
  ];
  return writeStoredValue(
    STORAGE_KEY,
    JSON.stringify({
      ...saved,
      pendingTelemetry: nextQueue,
      savedAt: entry.occurredAt,
    }),
  );
}

export function reportErrorRecovery(entry) {
  if (!telemetryEnabled) return;
  const saved = getSavedRecoveryState();
  if (!saved?.dataConsent) return;
  saveErrorTelemetry(createErrorTelemetryPayload(entry)).catch((telemetryError) => {
    console.warn("Critical Point error telemetry failed", telemetryError);
    queueSavedErrorTelemetry(entry);
  });
}

export function recordAppError(error, errorInfo = {}, source = "runtime") {
  const saved = getSavedRecoveryState();
  appendTraceEvent({
    kind: "error",
    caseId: saved?.currentCase,
    nodeId: saved?.nodeId,
    logLength: saved?.log?.length ?? 0,
    note: serializeError(error).message,
  });
  const entry = createErrorRecoveryEntry(error, errorInfo, source);
  persistErrorRecovery(entry);
  reportErrorRecovery(entry);
  return entry;
}
