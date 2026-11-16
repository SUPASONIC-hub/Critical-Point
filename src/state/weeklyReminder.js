import { readStoredValue, WEEKLY_REMINDER_KEY, writeStoredValue } from "../appConfig.js";
import { isStandalone } from "./installPrompt.js";

/**
 * 주 1회 알림 (N25, 다음 개선점 2차 2026-11-16, Q2 (1)): once a week with a
 * rule, a device that turned it on and has not opened the game that week is
 * told the week's rule, once.
 *
 * Off on every device until the player turns it on, in the comfort settings
 * of a copy opened from the home screen (components/WeeklyReminderToggle.jsx);
 * the switch is not shown anywhere else. Turning it on is the one moment the
 * browser is asked for permission to notify, from the player's own tap.
 *
 * No server and no push: nothing leaves the device. The page hands the
 * service worker the weeks to remind of (state/weeklyReminderPlan.js) each
 * time the app is opened, with the week it was opened in, and the worker
 * shows the notification itself when the browser wakes it for a periodic
 * check (`periodicsync`, Chromium on an installed app). Where the browser has
 * no periodic check -- iOS, Firefox, a Chromium that turned it down for this
 * site -- the switch still works but the worker is never woken while the app
 * is closed, so the switch says so (`openOnly`). A push server (VAPID and a
 * scheduled function) is what would reach those: a question for later, not
 * this.
 */

export const REMINDER_TAG = "cp-weekly-rule";
/** How often the browser is asked to wake the worker; it decides, and usually waits longer. */
export const REMINDER_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;
/** How long the page waits for the worker before giving up on telling it anything. */
const READY_TIMEOUT_MS = 5000;

/**
 * Whether the switch can be offered here: "ok", "denied" (notifications
 * blocked for the site: shown, with a word on how to unblock), "not-installed"
 * (a browser tab: not shown) or "unsupported" (no notifications or no service
 * worker: not shown).
 */
export function reminderAvailability(scope = globalThis) {
  if (typeof scope?.Notification !== "function" || !scope.navigator?.serviceWorker) return "unsupported";
  if (!isStandalone(scope)) return "not-installed";
  return scope.Notification.permission === "denied" ? "denied" : "ok";
}

/** Whether this device turned the reminder on. */
export const reminderOn = () => readStoredValue(WEEKLY_REMINDER_KEY, "0") === "1";

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

/**
 * Whether the browser will wake the worker while the app is closed: it has
 * periodic background sync and has granted it to this site (Chromium grants
 * it to an installed app it sees used). Asking for it is free, and the answer
 * can change; `false` on any doubt.
 */
export async function canCheckClosed(scope = globalThis, registration = null) {
  if (!registration?.periodicSync) return false;
  try {
    const status = await scope.navigator?.permissions?.query?.({ name: "periodic-background-sync" });
    return status?.state === "granted";
  } catch {
    return false;
  }
}

/**
 * Tells the worker the weeks to remind of and the week the app was opened in,
 * and asks the browser to wake it now and then. `plan` is
 * weeklyReminderPlan.js's. Returns "periodic" (it will be woken), "open-only"
 * (it will not, see above) or "off" (nothing done: off, or no worker).
 */
export async function syncReminder({ scope = globalThis, now = Date.now(), plan = [], week = null } = {}) {
  if (!reminderOn() || reminderAvailability(scope) !== "ok") return "off";
  const registration = await readyRegistration(scope);
  const worker = registration?.active;
  if (!worker) return "off";
  worker.postMessage({ type: "reminder-plan", plan, seen: week, at: now });
  if (!(await canCheckClosed(scope, registration))) return "open-only";
  try {
    await registration.periodicSync.register(REMINDER_TAG, { minInterval: REMINDER_MIN_INTERVAL_MS });
    return "periodic";
  } catch {
    return "open-only";
  }
}

/**
 * The player turned it on: asks the browser's permission (this has to run in
 * the tap's own handler), stores the switch only when it was granted, and
 * hands the worker its plan. Returns the permission ("granted", "denied",
 * "default") and, when granted, what `syncReminder` answered.
 */
export async function enableReminder({ scope = globalThis, now = Date.now(), plan = [], week = null } = {}) {
  let permission;
  try {
    permission = await scope.Notification.requestPermission();
  } catch {
    permission = "default";
  }
  if (permission !== "granted") return { permission, mode: "off" };
  writeStoredValue(WEEKLY_REMINDER_KEY, "1");
  return { permission, mode: await syncReminder({ scope, now, plan, week }) };
}

/** The player turned it off: stored at once, and the worker is told to forget its plan. */
export async function disableReminder({ scope = globalThis } = {}) {
  writeStoredValue(WEEKLY_REMINDER_KEY, "0");
  const registration = await readyRegistration(scope);
  registration?.active?.postMessage({ type: "reminder-plan", plan: [], seen: null });
  try {
    await registration?.periodicSync?.unregister?.(REMINDER_TAG);
  } catch {
    // Never registered, or the browser refused: nothing will wake it for this.
  }
  return true;
}
