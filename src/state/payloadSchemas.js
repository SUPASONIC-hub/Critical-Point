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
