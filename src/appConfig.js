export const STORAGE_KEY = "trigger-prototype-v2";
export const SAVE_SCHEMA_VERSION = 2;
export const FREE_TEXT_MAX_LENGTH = 600;
export const FEEDBACK_COMMENT_MAX_LENGTH = 600;

export function parseSavedState(raw, schemaVersion) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed.saveSchemaVersion === schemaVersion ? parsed : null;
  } catch {
    return null;
  }
}

export function isSavedStateShapeValid(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return false;
  const arrayKeys = ["completedCases", "discoveredClues", "log", "pendingTelemetry"];
  const objectKeys = ["caseResults", "playtestFeedback", "resources", "triggers", "cognition"];
  return (
    arrayKeys.every((key) => Array.isArray(state[key])) &&
    objectKeys.every((key) => state[key] && typeof state[key] === "object" && !Array.isArray(state[key])) &&
    typeof state.currentCase === "string" &&
    typeof state.nodeId === "string"
  );
}

export function readStoredValue(key, fallback = null) {
  try {
    return globalThis.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStoredValue(key) {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // Storage can be unavailable in private or embedded browser contexts.
  }
}

export async function copyText(value) {
  try {
    if (globalThis.navigator?.clipboard?.writeText) {
      try {
        await globalThis.navigator.clipboard.writeText(value);
        return true;
      } catch {
        // Permission policies can reject Clipboard API calls while legacy copy still works.
      }
    }

    const documentRef = globalThis.document;
    if (!documentRef?.body) return false;
    const textarea = documentRef.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    documentRef.body.appendChild(textarea);
    textarea.select();
    const copied = documentRef.execCommand?.("copy") ?? false;
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}
