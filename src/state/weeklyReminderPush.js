import { readStoredValue, WEEKLY_REMINDER_KEY, WEEKLY_REMINDER_SYNC_KEY, writeStoredValue } from "../appConfig.js";
import { isoWeekKey } from "../gauntlet/weeklyCalendar.js";
import { LANG } from "../locale.js";
import { callSupabaseRpc } from "../telemetry.js";
import { reminderAvailability, reminderOn, VAPID_PUBLIC_KEY } from "./weeklyReminder.js";

/**
 * 주 1회 알림's Web Push half (N25, state/weeklyReminder.js): the browser's
 * push subscription, and the two server calls that keep or drop it
 * (`push_subscribe`, `push_unsubscribe`, supabase/migrations/
 * 20261129000000_push_subscriptions.sql). What leaves the device is the
 * subscription's endpoint and keys and the page's language, nothing else.
 *
 * Fetched only by the switch (components/WeeklyReminderToggle.jsx) and, on a
 * device that turned it on, once after `load` (main.jsx), which hands the
 * subscription over again when it changed, the language changed, or a new
 * week began since the last time -- so a row the server lost comes back
 * within a week of the app being opened.
 */

/** How long the page waits for the worker before giving up. */
const READY_TIMEOUT_MS = 5000;
const LANGUAGES = ["ko", "en", "ja"];

/** A base64url key as the bytes `pushManager.subscribe` takes. */
export function keyBytes(key) {
  const text = String(key).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(text + "=".repeat((4 - (text.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** The server call's arguments for a subscription, or null when it is not one. */
export function subscriptionRow(subscription, language = LANG) {
  const json = typeof subscription?.toJSON === "function" ? subscription.toJSON() : subscription;
  const endpoint = json?.endpoint;
  const { p256dh, auth } = json?.keys ?? {};
  if (typeof endpoint !== "string" || !endpoint.startsWith("https://") || typeof p256dh !== "string" || typeof auth !== "string") return null;
  return { p_endpoint: endpoint, p_p256dh: p256dh, p_auth: auth, p_language: LANGUAGES.includes(language) ? language : "ko" };
}

/** The worker in charge, or null when there is none within `READY_TIMEOUT_MS`. */
async function readyRegistration(scope) {
  const container = scope.navigator?.serviceWorker;
  if (!container?.ready) return null;
  let timer;
  const timeout = new Promise((resolve) => {
    timer = scope.setTimeout?.(() => resolve(null), READY_TIMEOUT_MS);
  });
  try {
    return await Promise.race([container.ready, timeout]);
  } catch {
    return null;
  } finally {
    scope.clearTimeout?.(timer);
  }
}

/** This browser's subscription, made with `key` when it has none. Null when push refuses. */
async function currentSubscription(registration, key) {
  const manager = registration?.pushManager;
  if (!manager) return null;
  try {
    return (await manager.getSubscription()) ?? (await manager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(key) }));
  } catch {
    return null;
  }
}

const readSync = () => {
  try {
    return JSON.parse(readStoredValue(WEEKLY_REMINDER_SYNC_KEY, "null"));
  } catch {
    return null;
  }
};

/** Hands the row to the server; true when it was stored. A build without a server stores nothing. */
async function sendRow(rpc, row, now) {
  try {
    const answer = await rpc("push_subscribe", row);
    if (answer?.skipped) return false;
    writeStoredValue(WEEKLY_REMINDER_SYNC_KEY, JSON.stringify({ endpoint: row.p_endpoint, language: row.p_language, week: isoWeekKey(now) }));
    return true;
  } catch {
    return false;
  }
}

/**
 * The player turned it on: asks the browser's permission (this has to run in
 * the tap's own handler), subscribes, and hands the subscription to the
 * server. The switch is stored on only when all three went through. Returns
 * the permission ("granted", "denied", "default") and whether it is on.
 */
export async function turnReminderOn({ scope = globalThis, key = VAPID_PUBLIC_KEY, language = LANG, rpc = callSupabaseRpc, now = Date.now() } = {}) {
  let permission;
  try {
    permission = await scope.Notification.requestPermission();
  } catch {
    permission = "default";
  }
  if (permission !== "granted") return { permission, on: false };
  const subscription = await currentSubscription(await readyRegistration(scope), key);
  const row = subscriptionRow(subscription, language);
  if (!row || !(await sendRow(rpc, row, now))) {
    try {
      await subscription?.unsubscribe?.();
    } catch {
      // Left to the browser: the server has no row for it, so nothing is sent to it.
    }
    return { permission, on: false };
  }
  writeStoredValue(WEEKLY_REMINDER_KEY, "1");
  return { permission, on: true };
}

/** The player turned it off: stored at once, the server's row deleted, the subscription dropped. */
export async function turnReminderOff({ scope = globalThis, rpc = callSupabaseRpc } = {}) {
  writeStoredValue(WEEKLY_REMINDER_KEY, "0");
  writeStoredValue(WEEKLY_REMINDER_SYNC_KEY, "null");
  const registration = await readyRegistration(scope);
  let subscription;
  try {
    subscription = await registration?.pushManager?.getSubscription?.();
  } catch {
    subscription = null;
  }
  const endpoint = subscriptionRow(subscription)?.p_endpoint ?? subscription?.endpoint;
  if (endpoint) {
    try {
      await rpc("push_unsubscribe", { p_endpoint: endpoint });
    } catch {
      // Offline or refused: the browser's subscription goes below, and the
      // weekly sender deletes the row when the push service answers 404/410.
    }
  }
  try {
    await subscription?.unsubscribe?.();
  } catch {
    // Nothing more this page can do.
  }
  return true;
}

/**
 * On every opening of a device that turned it on (main.jsx): hands the
 * subscription over again when it is not the one the server was last told
 * of, in this language, this week. Returns "off" (not on, or not available
 * here), "kept" (nothing to send), "sent", or "failed".
 */
export async function refreshReminderOnOpen({ scope = globalThis, key = VAPID_PUBLIC_KEY, language = LANG, rpc = callSupabaseRpc, now = Date.now() } = {}) {
  if (!reminderOn() || reminderAvailability(scope, key) !== "ok" || scope.Notification.permission !== "granted") return "off";
  const row = subscriptionRow(await currentSubscription(await readyRegistration(scope), key), language);
  if (!row) return "failed";
  const synced = readSync();
  if (synced?.endpoint === row.p_endpoint && synced.language === row.p_language && synced.week === isoWeekKey(now)) return "kept";
  return (await sendRow(rpc, row, now)) ? "sent" : "failed";
}
