import { readStoredValue, writeStoredValue } from "./appConfig.js";

const localTelemetryConfigEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true";
const localTelemetryUrl = localTelemetryConfigEnabled ? readStoredValue("critical-point-telemetry-url", "") : "";
const localTelemetryKey = localTelemetryConfigEnabled ? readStoredValue("critical-point-telemetry-key", "") : "";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || localTelemetryUrl;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || localTelemetryKey;
const TELEMETRY_TIMEOUT_MS = 10000;

export const telemetryEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function fetchWithTimeout(url, options = {}) {
  if (globalThis.navigator?.onLine === false) {
    throw new Error("Network unavailable");
  }
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = setTimeout(() => controller?.abort(), TELEMETRY_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      ...(controller ? { signal: controller.signal } : {}),
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getSessionId() {
  const key = "critical-point-session-id";
  const existing = readStoredValue(key);
  if (existing) return existing;

  const next =
    globalThis.crypto?.randomUUID?.() ??
    `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  writeStoredValue(key, next);
  return next;
}

export function getSessionCode(sessionId) {
  return sessionId.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
}

export async function saveCaseTelemetry(payload) {
  if (!telemetryEnabled) return { skipped: true };

  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/playtest_sessions`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Telemetry save failed: ${response.status}`);
  }

  return { saved: true };
}

export async function saveFeedbackTelemetry(payload) {
  if (!telemetryEnabled) return { skipped: true };

  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/playtest_feedback`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Feedback save failed: ${response.status}`);
  }

  return { saved: true };
}

export async function saveErrorTelemetry(payload) {
  if (!telemetryEnabled) return { skipped: true };

  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/app_error_logs`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error log save failed: ${response.status}`);
  }

  return { saved: true };
}

async function checkTelemetryTable(tableName) {
  if (!telemetryEnabled) return { table: tableName, ok: false, skipped: true };

  const query = new URLSearchParams({
    select: "*",
    limit: "1",
  });
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${tableName}?${query.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  return {
    table: tableName,
    ok: response.ok,
    status: response.status,
  };
}

export async function checkTelemetryHealth() {
  if (!telemetryEnabled) return { skipped: true, tables: [] };
  const tables = await Promise.all(
    ["playtest_sessions", "playtest_feedback", "app_error_logs"].map((tableName) =>
      checkTelemetryTable(tableName).catch((error) => ({
        table: tableName,
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : "Healthcheck failed",
      })),
    ),
  );
  return {
    ok: tables.every((table) => table.ok),
    tables,
  };
}

export async function fetchLeaderboard(limit = 100) {
  if (!telemetryEnabled) return { skipped: true, rows: [] };

  const query = new URLSearchParams({
    select: "session_code,player_name,case_id,case_title,completed_at,summary",
    order: "completed_at.desc",
    limit: String(limit),
  });
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/playtest_sessions?${query.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Leaderboard fetch failed: ${response.status}`);
  }

  return { rows: await response.json() };
}
