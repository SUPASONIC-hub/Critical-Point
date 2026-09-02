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

async function createTelemetryError(response, fallbackMessage) {
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 500);
  } catch {
    // A body is optional; fall back to the status code alone.
  }
  const suffix = detail ? `: ${detail}` : "";
  return new Error(`${fallbackMessage}: ${response.status}${suffix}`);
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

function restHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

async function insertRow(table, payload, failureLabel) {
  if (!telemetryEnabled) return { skipped: true };

  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: restHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await createTelemetryError(response, failureLabel);
  }

  return { saved: true };
}

export function saveCaseTelemetry(payload) {
  return insertRow("playtest_sessions", payload, "Telemetry save failed");
}

export function saveFeedbackTelemetry(payload) {
  return insertRow("playtest_feedback", payload, "Feedback save failed");
}

export function saveErrorTelemetry(payload) {
  return insertRow("app_error_logs", payload, "Error log save failed");
}

async function checkTelemetryTable(tableName) {
  if (!telemetryEnabled) return { table: tableName, ok: false, skipped: true };

  const readTableName = tableName === "playtest_sessions" ? "public_rankings" : "telemetry_health";
  const query = new URLSearchParams(
    tableName === "playtest_sessions"
      ? { select: "*", limit: "1" }
      : { select: "table_name", table_name: `eq.${tableName}`, limit: "1" },
  );
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${readTableName}?${query.toString()}`, {
    headers: restHeaders(),
  });

  return {
    table: tableName,
    endpoint: readTableName,
    ok: response.ok,
    status: response.status,
    message: response.ok ? "" : (await response.text()).slice(0, 240),
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
    select: "run_id,session_code,player_name,case_id,case_title,completed_at,summary",
    order: "completed_at.desc",
    limit: String(limit),
  });
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/public_rankings?${query.toString()}`, {
    headers: restHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Leaderboard fetch failed: ${response.status}`);
  }

  return { rows: await response.json() };
}
