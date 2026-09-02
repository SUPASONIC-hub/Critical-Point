import {
  ERROR_LOG_STORAGE_KEY,
  parseErrorLog,
  parseRecoverySlots,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
} from "../appConfig.js";
import { getTraceEvents } from "./trace.js";

const REVOKE_DELAY_MS = 1000;

/**
 * Builds the JSON a playtester hands back.
 *
 * The summary export is the shareable one: it carries scores and route shape
 * but no free text, no session id, no telemetry queue and no error log. Only
 * the diagnostic export adds those, and it is reachable from the debug panel
 * alone — see the privacy notes in README.
 */
export function buildPlaytestExport({ includeDiagnostics = false, run, gameplay, diagnostics }) {
  const payload = {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    exportMode: includeDiagnostics ? "diagnostic" : "summary",
    ...run,
    gameplay,
  };
  if (!includeDiagnostics) return payload;

  const localErrorLog = parseErrorLog(readStoredValue(ERROR_LOG_STORAGE_KEY, "null"));
  const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
  return {
    ...payload,
    ...diagnostics,
    errorLog: Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : [],
    saveSlots: Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : [],
    trace: getTraceEvents(),
  };
}

export function downloadJson(payload, fileName) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.type = "application/json";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, REVOKE_DELAY_MS);
}
