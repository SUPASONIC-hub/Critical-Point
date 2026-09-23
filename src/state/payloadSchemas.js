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
const PRIVATE_TELEMETRY_KEYS = new Set(["playerName", "comment", "feedbackComment", "spokenChoice"]);

function containsPrivateTelemetryKey(value) {
  if (Array.isArray(value)) return value.some(containsPrivateTelemetryKey);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, entry]) => PRIVATE_TELEMETRY_KEYS.has(key) || containsPrivateTelemetryKey(entry));
}

export function validateTelemetryItem(item) {
  const errors = [];
  if (!TELEMETRY_TYPES.has(item?.type)) errors.push(`invalid type ${item?.type}`);
  if (!item?.payload || typeof item.payload !== "object" || Array.isArray(item.payload)) errors.push("payload must be an object");
  if (containsPrivateTelemetryKey(item?.payload)) errors.push("payload contains private fields");
  return errors;
}

export function validateSavedStatePayload(state) {
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
  if (state.dynamics !== undefined && state.dynamics !== null) {
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
    }
  }
  if (Array.isArray(state.pendingTelemetry)) {
    for (const item of state.pendingTelemetry) {
      if (!item || typeof item !== "object" || typeof item.id !== "string" || typeof item.label !== "string" || validateTelemetryItem(item).length) {
        errors.push("invalid pendingTelemetry item");
      }
    }
  }
  return errors;
}
