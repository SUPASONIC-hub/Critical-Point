const SUMMARY_REQUIRED_KEYS = ["saveSchemaVersion", "exportedAt", "exportMode", "currentCase", "summary", "gameplay"];
const SUMMARY_PRIVATE_KEYS = ["playerName", "comment", "sessionId", "log", "errorLog", "saveSlots", "trace"];

export function validatePlaytestExport(payload, { includeDiagnostics = false } = {}) {
  const errors = [];
  for (const key of SUMMARY_REQUIRED_KEYS) {
    if (!(key in (payload ?? {}))) errors.push(`missing ${key}`);
  }
  if (payload?.exportMode !== (includeDiagnostics ? "diagnostic" : "summary")) {
    errors.push(`invalid exportMode ${payload?.exportMode}`);
  }
  if (!includeDiagnostics) {
    for (const key of SUMMARY_PRIVATE_KEYS) {
      if (key in (payload ?? {})) errors.push(`private field ${key}`);
    }
  }
  return errors;
}

const TELEMETRY_TYPES = new Set(["case", "feedback", "error"]);
// Keys whose value is something the player typed or is called. `spokenChoice`
// used to be on this list, but it is the card's authored line, and every
// decision_log entry carries one -- so every queued case row failed its retry.
const PRIVATE_TELEMETRY_KEYS = new Set(["playerName", "comment", "feedbackComment"]);
// A feedback row exists to carry the comment the player wrote and sent under
// the consent box; it is the one place a comment may travel.
const ALLOWED_PRIVATE_KEYS = { feedback: new Set(["comment"]) };
const NO_ALLOWED_KEYS = new Set();

/** An empty value discloses nothing, so the check reads values, not key presence. */
function isDisclosingValue(value) {
  if (value === undefined || value === null || value === false) return false;
  return typeof value === "string" ? value.trim().length > 0 : true;
}

function containsPrivateTelemetryValue(value, allowedKeys) {
  if (Array.isArray(value)) return value.some((entry) => containsPrivateTelemetryValue(entry, allowedKeys));
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, entry]) =>
      (PRIVATE_TELEMETRY_KEYS.has(key) && !allowedKeys.has(key) && isDisclosingValue(entry)) ||
      containsPrivateTelemetryValue(entry, allowedKeys),
  );
}

/**
 * The idempotency key a telemetry row is sent with. It is minted once, when the
 * payload is built, so the first send and every retry name the same row and the
 * server's unique index on `event_id` drops the duplicates.
 */
export { createTelemetryEventId } from "./telemetryEventId.js";

/**
 * A case row's `dynamics` (F1 phase 3, S3): the run summary, the close's
 * `linksOut`, `relicOffer` and `practiceWindows`, and the case's opening
 * snapshot `open`. The server takes 6,144 bytes of it as jsonb text
 * (20261102030000, which writes `": "` and `", "` where JSON.stringify writes
 * `:` and `,`), so the page keeps it to 4,096 bytes as JSON.stringify counts:
 * an honest row measures at most 1.5 KB and the largest a run can make
 * 2.2 KB as jsonb, 2.0 KB of JSON (tests/unit/case-open.test.mjs), so this is
 * room, not a squeeze.
 */
export const CASE_DYNAMICS_MAX_BYTES = 4096;

const jsonBytes = (value) => new TextEncoder().encode(JSON.stringify(value) ?? "").length;

/** What is wrong with a case row's `dynamics` as the page sends it (S3's keys); none for a row without it. */
export function validateCaseDynamics(dynamics) {
  if (dynamics === undefined || dynamics === null) return [];
  if (typeof dynamics !== "object" || Array.isArray(dynamics)) return ["invalid dynamics"];
  const errors = [];
  const open = dynamics.open;
  if (open !== undefined && open !== null && (typeof open !== "object" || Array.isArray(open) || typeof open.caseId !== "string")) errors.push("invalid dynamics.open");
  for (const key of ["linksOut", "relicOffer"]) {
    if (dynamics[key] !== undefined && !Array.isArray(dynamics[key])) errors.push(`invalid dynamics.${key}`);
  }
  if (jsonBytes(dynamics) > CASE_DYNAMICS_MAX_BYTES) errors.push("dynamics too large");
  return errors;
}

/**
 * The `dynamics` a case row is sent with: as built, or without its opening
 * snapshot when the whole would not fit. The row is worth more than the
 * snapshot -- the server ranks a run only when every case has a row -- and a
 * row without one is read as not checked, never as broken (chainRecheck.js).
 */
export function fitCaseDynamics(dynamics) {
  if (!dynamics?.open || jsonBytes(dynamics) <= CASE_DYNAMICS_MAX_BYTES) return dynamics;
  const { open: _open, ...rest } = dynamics;
  return rest;
}

export function validateTelemetryItem(item) {
  const errors = [];
  if (!TELEMETRY_TYPES.has(item?.type)) errors.push(`invalid type ${item?.type}`);
  if (!item?.payload || typeof item.payload !== "object" || Array.isArray(item.payload)) errors.push("payload must be an object");
  if (item?.payload?.event_id !== undefined && (typeof item.payload.event_id !== "string" || !item.payload.event_id)) {
    errors.push("invalid event_id");
  }
  if (containsPrivateTelemetryValue(item?.payload, ALLOWED_PRIVATE_KEYS[item?.type] ?? NO_ALLOWED_KEYS)) {
    errors.push("payload contains private fields");
  }
  if (item?.type === "case") errors.push(...validateCaseDynamics(item?.payload?.dynamics));
  return errors;
}

/**
 * A feedback row queued before the payload matched the table: it named columns
 * (`case_title`, `clarity_score`, ...) that `playtest_feedback` never had, so it
 * could only ever fail. It is rewritten into the row the table takes.
 */
function migrateQueuedFeedbackPayload(item) {
  const payload = item.payload;
  if (item.type !== "feedback" || !payload || typeof payload !== "object" || Array.isArray(payload)) return item;
  if (payload.feedback && typeof payload.feedback === "object" && !Array.isArray(payload.feedback)) return item;
  return {
    ...item,
    payload: {
      event_id: typeof payload.event_id === "string" && payload.event_id ? payload.event_id : item.id,
      session_id: payload.session_id,
      session_code: payload.session_code,
      case_id: payload.case_id,
      feedback: {
        caseTitle: payload.case_title ?? payload.case_id ?? "",
        submittedAt: payload.submitted_at ?? "",
        clarity: payload.clarity_score ?? null,
        difficulty: payload.difficulty_score ?? null,
        comment: payload.comment ?? null,
      },
    },
  };
}

function isQueueItemShape(item) {
  return Boolean(item) && typeof item === "object" && !Array.isArray(item) && typeof item.id === "string" && typeof item.label === "string";
}

/**
 * The saved retry queue with every item that can never be sent dropped. One bad
 * item used to fail the whole save's validation: the runtime threw the run away
 * on reload, the queue could no longer be written, and a cloud copy was refused.
 */
export function sanitizeTelemetryQueue(queue) {
  if (!Array.isArray(queue)) return [];
  return queue
    .filter(isQueueItemShape)
    .map(migrateQueuedFeedbackPayload)
    .filter((item) => validateTelemetryItem(item).length === 0);
}

export function validateSavedStatePayload(state, { dynamics: checkDynamics = true } = {}) {
  const errors = [];
  if (!state || typeof state !== "object" || Array.isArray(state)) return ["state must be an object"];
  for (const key of ["completedCases", "discoveredClues", "log", "pendingTelemetry"]) {
    if (!Array.isArray(state[key])) errors.push(`invalid ${key}`);
  }
  for (const key of ["caseResults", "playtestFeedback", "resources", "triggers", "cognition"]) {
    if (!state[key] || typeof state[key] !== "object" || Array.isArray(state[key])) errors.push(`invalid ${key}`);
  }
  if (typeof state.currentCase !== "string") errors.push("invalid currentCase");
  if (typeof state.nodeId !== "string") errors.push("invalid nodeId");
  if (state.runId !== undefined && typeof state.runId !== "string") errors.push("invalid runId");
  if (checkDynamics && state.dynamics !== undefined && state.dynamics !== null) {
    // The gauntlet run: pot, vault, and the rules the next window is dealt from.
    const run = state.dynamics;
    if (!run || typeof run !== "object" || Array.isArray(run)) {
      errors.push("invalid dynamics");
    } else {
      for (const key of ["windowIndex", "runPot", "vault", "streak", "busts", "cashes", "bestMultiplier", "lastGauge"]) {
        if (typeof run[key] !== "number" || !Number.isFinite(run[key])) errors.push(`invalid dynamics.${key}`);
      }
      if (typeof run.lastOutcome !== "string") errors.push("invalid dynamics.lastOutcome");
      if (!run.schema || typeof run.schema !== "object" || !Array.isArray(run.schema.mutations)) {
        errors.push("invalid dynamics.schema");
      }
      // The case's opening snapshot (S3): none in a save from before it.
      if (run.open !== undefined && run.open !== null && (typeof run.open !== "object" || Array.isArray(run.open) || typeof run.open.caseId !== "string")) {
        errors.push("invalid dynamics.open");
      }
    }
  }
  if (Array.isArray(state.pendingTelemetry)) {
    for (const item of state.pendingTelemetry) {
      if (!isQueueItemShape(item) || validateTelemetryItem(item).length) {
        errors.push("invalid pendingTelemetry item");
      }
    }
  }
  return errors;
}
