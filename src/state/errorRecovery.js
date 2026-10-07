import {
  appendSaveSlot,
  appendStoredErrorLog,
  createSafeErrorContext,
  parseCurrentSavedState,
  parseRecoverySlots,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
  serializeError,
  STORAGE_KEY,
  writeSaveState,
} from "../appConfig.js";
import { getSessionCode, getSessionId, telemetryEnabled } from "../telemetry.js";
import { createTelemetryEventId } from "./payloadSchemas.js";
import { pruneTelemetryQueue, sendTelemetryItem, TELEMETRY_QUEUE_MAX_ITEMS } from "./telemetryQueuePolicy.js";
import { appendTraceEvent, getTraceEvents } from "./trace.js";

/** The source the root error boundary records under: a screen that failed to draw. */
export const RENDER_CRASH_SOURCE = "react-render";

function createSafeDomSnapshot(documentRef = globalThis.document) {
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

function createErrorRecoveryEntry(error, errorInfo = {}, source = "runtime") {
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

/**
 * A slot is a place to go back to, and five copies of the scene that keeps
 * crashing are one place. The error path used to add a slot for every recorded
 * error, so three attempts at a broken scene pushed out every slot from before
 * it and left nothing to roll back to. One slot at the broken point is kept --
 * it is the only slot a first-case crash has -- and no second one.
 *
 * The same place is the same run, case, scene, number of decisions and number
 * of closed cases. The last is for the save's own slots (useAppPersistence),
 * which ask this too: a case opened again as practice starts at the scene and
 * the empty log its first opening had, and is a different place to go back to.
 */
export function hasSlotAtRecoveryPoint(saved) {
  const slots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"))?.slots ?? [];
  const logLength = Array.isArray(saved.log) ? saved.log.length : 0;
  const closedCases = Array.isArray(saved.completedCases) ? saved.completedCases.length : 0;
  return slots.some(
    (slot) =>
      slot.snapshot.runId === (typeof saved.runId === "string" ? saved.runId : "") &&
      slot.currentCase === saved.currentCase &&
      slot.nodeId === saved.nodeId &&
      slot.snapshot.log.length === logLength &&
      slot.completedCases.length === closedCases,
  );
}

/** A line written to `console.error`: logged, and nothing more. */
const CONSOLE_SOURCE = "console-error";

function persistErrorRecovery(entry) {
  appendStoredErrorLog(entry);
  // A console line is not a failure of the run. It goes in the error log and
  // the save is left as it is: it used to be rewritten whole, paused and
  // marked with `lastError`, for every line any script on the page logged.
  if (entry.context.source === CONSOLE_SOURCE) return;
  const saved = getSavedRecoveryState();
  if (!saved) return;

  const previousError = saved.lastError;
  const sameRecoveryPoint =
    previousError?.currentCase === entry.context.currentCase &&
    previousError?.nodeId === entry.context.nodeId;
  // What the boundary's retry button counts is screens that failed to draw from
  // this save. A console line or a rejected promise at the same scene is logged
  // but is not a failed attempt, and must not spend one.
  const earlierCrashes = sameRecoveryPoint ? Number(previousError.retryCount) || 0 : 0;
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
      retryCount: earlierCrashes + (entry.context.source === RENDER_CRASH_SOURCE ? 1 : 0),
    },
  };
  // This edits the stored save, not the run this tab holds (see writeSaveState).
  if (!writeSaveState(recoveredSave, { sideChannel: true }).saved) return;
  if (!hasSlotAtRecoveryPoint(recoveredSave)) appendSaveSlot(recoveredSave);
}

/** `event_id` is minted with the row, so a retry from the queue names the same row. */
function createErrorTelemetryPayload(entry) {
  const sessionId = getSessionId();
  return {
    event_id: createTelemetryEventId(),
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

/**
 * The rows queued here since the runtime last asked. The runtime keeps the
 * queue in memory and writes that copy with every save, so a row this file
 * wrote into storage was gone at the next decision: only an error followed by a
 * reload ever reached the server. The runtime's save folds these in by id.
 */
const queuedSinceLastSave = [];

export function takeQueuedErrorTelemetry() {
  return queuedSinceLastSave.splice(0);
}

/**
 * A failed error row joins the save's retry queue. It is written through
 * `writeSaveState` like every other save write, and not over a save another tab
 * has moved on since this tab last wrote: that tab's queue is its own.
 */
export function queueSavedErrorTelemetry(entry, payload) {
  const saved = getSavedRecoveryState();
  if (saved?.dataConsent !== true) return false;
  const pendingTelemetry = Array.isArray(saved.pendingTelemetry) ? saved.pendingTelemetry : [];
  const item = {
    id: entry.id,
    queuedAt: new Date().toISOString(),
    type: "error",
    label: `${entry.context.currentCase} / ${entry.context.nodeId} 에러 로그`,
    payload,
  };
  queuedSinceLastSave.push(item);
  queuedSinceLastSave.splice(0, Math.max(0, queuedSinceLastSave.length - TELEMETRY_QUEUE_MAX_ITEMS));
  const nextQueue = pruneTelemetryQueue([...pendingTelemetry.filter((queued) => queued.id !== entry.id), item]);
  return writeSaveState({ ...saved, pendingTelemetry: nextQueue, savedAt: entry.occurredAt }, { isAhead: () => true }).saved;
}

function reportErrorRecovery(entry) {
  if (!telemetryEnabled) return;
  const saved = getSavedRecoveryState();
  if (saved?.dataConsent !== true) return;
  const item = { id: entry.id, type: "error", label: "error", payload: createErrorTelemetryPayload(entry) };
  sendTelemetryItem(item).catch((telemetryError) => {
    console.warn("Critical Point error telemetry failed", telemetryError);
    queueSavedErrorTelemetry(entry, item.payload);
  });
}

/**
 * One failure, one record. A render crash reaches this file more than once --
 * React reports it, the boundary that caught it reports it, a boundary that
 * passed it up reports it again -- and each record used to add one to the
 * retry count, so the first crash at a scene arrived already at the limit and
 * the only button left was the one that wipes the save.
 */
const recordedErrors = new WeakMap();

/**
 * The same thing said again. The WeakMap above knows an Error by the object,
 * and a console line makes a new one every time it is written: a warning that
 * repeats, or a script on the page that logs in a loop, became a write of the
 * error log and a row to the server for every line, with nothing to slow it.
 *
 * So what was recorded is also remembered by what it said: the same message
 * from the same source is one record for `REPEAT_BURST_MS` wherever it was
 * said, and for `REPEAT_WINDOW_MS` at the same scene. A screen that failed to
 * draw is never folded this way -- each one is a retry the boundary counts.
 * And however varied the lines, the console gets `CONSOLE_BUDGET` records a
 * minute; past that a line is still printed, and not recorded.
 */
const REPEAT_BURST_MS = 2_000;
const REPEAT_WINDOW_MS = 60_000;
const CONSOLE_BUDGET = 12;
const REPEAT_MEMORY = 60;
const recentRecords = new Map();
let consoleRecordTimes = [];
let lastConsoleRecord = null;

function forgetOldRecords(now) {
  for (const [key, known] of recentRecords) {
    if (now - known.at > REPEAT_WINDOW_MS || recentRecords.size > REPEAT_MEMORY) recentRecords.delete(key);
  }
}

/** Test seam: what has been recorded is forgotten, as on a fresh page. */
export function resetRecordedErrors() {
  recentRecords.clear();
  consoleRecordTimes = [];
  lastConsoleRecord = null;
}

export function recordAppError(error, errorInfo = {}, source = "runtime", { now = Date.now() } = {}) {
  const known = error instanceof Error ? recordedErrors.get(error) : null;
  // A crash first seen as a console line still has to count as a crash.
  const crashSeenAsSomethingElse = source === RENDER_CRASH_SOURCE && known?.context.source !== RENDER_CRASH_SOURCE;
  if (known && !crashSeenAsSomethingElse) return known;
  if (source === RENDER_CRASH_SOURCE) return rememberRecord(error, recordNewAppError(error, errorInfo, source));

  const said = `${source}|${serializeError(error).message}`;
  // Before storage is read at all: this is the line a loop repeats.
  const burst = recentRecords.get(said);
  if (burst && now - burst.at < REPEAT_BURST_MS) return burst.entry;
  const saved = getSavedRecoveryState();
  const saidHere = `${said}|${saved?.currentCase ?? ""}|${saved?.nodeId ?? ""}`;
  const repeat = recentRecords.get(saidHere);
  if (repeat && now - repeat.at < REPEAT_WINDOW_MS) return repeat.entry;
  if (source === CONSOLE_SOURCE) {
    consoleRecordTimes = consoleRecordTimes.filter((at) => now - at < REPEAT_WINDOW_MS);
    // Over the budget: the last record is handed back and nothing is written.
    if (consoleRecordTimes.length >= CONSOLE_BUDGET) return lastConsoleRecord ?? createErrorRecoveryEntry(error, errorInfo, source);
    consoleRecordTimes.push(now);
  }

  const entry = rememberRecord(error, recordNewAppError(error, errorInfo, source));
  if (source === CONSOLE_SOURCE) lastConsoleRecord = entry;
  forgetOldRecords(now);
  recentRecords.set(said, { entry, at: now });
  recentRecords.set(saidHere, { entry, at: now });
  return entry;
}

function rememberRecord(error, entry) {
  if (error instanceof Error) recordedErrors.set(error, entry);
  return entry;
}

function recordNewAppError(error, errorInfo, source) {
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
