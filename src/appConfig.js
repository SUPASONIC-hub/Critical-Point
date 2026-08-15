export const STORAGE_KEY = "trigger-prototype-v2";
export const SAVE_SCHEMA_VERSION = 2;
export const FREE_TEXT_MAX_LENGTH = 600;
export const FEEDBACK_COMMENT_MAX_LENGTH = 600;

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
      await globalThis.navigator.clipboard.writeText(value);
      return true;
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
