export const TRACE_STORAGE_KEY = "critical-point-trace-v1";
const TRACE_MAX_ITEMS = 200;
export const REPLAY_QUERY_KEY = "replay";

export function encodeReplaySeed(seed) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(seed))));
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
}

export function decodeReplaySeed(value) {
  if (!value) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}

export function getReplaySeedFromLocation() {
  try {
    return decodeReplaySeed(new URLSearchParams(globalThis.location?.search ?? "").get(REPLAY_QUERY_KEY));
  } catch {
    return null;
  }
}

export function getTraceEvents() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(TRACE_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendTraceEvent(event = {}) {
  try {
    const next = [
      ...getTraceEvents(),
      { t: Date.now(), ...event },
    ].slice(-TRACE_MAX_ITEMS);
    sessionStorage.setItem(TRACE_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getTraceEvents();
  }
}

