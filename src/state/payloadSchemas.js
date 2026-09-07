const SUMMARY_REQUIRED_KEYS = ["saveSchemaVersion", "exportedAt", "exportMode", "currentCase", "summary", "gameplay"];
const SUMMARY_PRIVATE_KEYS = ["playerName", "freeText", "comment", "sessionId", "log", "errorLog", "saveSlots", "trace"];

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
const PRIVATE_TELEMETRY_KEYS = new Set(["freeText", "playerName", "comment", "feedbackComment", "spokenChoice"]);

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
