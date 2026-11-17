import { readStoredValue, WEEKLY_REMINDER_KEY } from "../appConfig.js";
import { isStandalone } from "./installPrompt.js";

/**
 * 주 1회 알림 (N25, 다음 개선점 2차 2026-11-16; 2026-11-17 결정: iOS까지 Web
 * Push, 규칙 있는 주만, 기본 꺼짐): on the Monday morning of a week with a
 * rule, a device that turned it on is told the week's rule, once.
 *
 * Off on every device until the player turns it on, in the comfort settings
 * of a copy opened from the home screen (components/WeeklyReminderToggle.jsx);
 * the switch is not shown anywhere else, nor in a build without the Web Push
 * public key (`VITE_VAPID_PUBLIC_KEY`). Turning it on is the one moment the
 * browser is asked for permission to notify, from the player's own tap.
 *
 * Delivery is Web Push, so it reaches iOS (16.4+, an app on the home screen)
 * as well as Android and desktop: turning it on hands the browser's push
 * subscription (endpoint and keys, and the page's language) to the server
 * (state/weeklyReminderPush.js, supabase/migrations/*_push_subscriptions.sql),
 * and .github/workflows/weekly-push.yml sends the notification. Turning it
 * off deletes that row. This file is the light half the comfort panel reads
 * to decide whether to fetch the switch at all.
 */

/** @type {Partial<ImportMetaEnv>} */
const viteEnv = import.meta.env ?? {};
/** The Web Push public key (base64url) the build was given; "" without one. */
export const VAPID_PUBLIC_KEY = String(viteEnv.VITE_VAPID_PUBLIC_KEY ?? "").trim();

/**
 * Whether the switch can be offered here: "ok", "denied" (notifications
 * blocked for the site: shown, with a word on how to unblock), "not-installed"
 * (a browser tab: not shown) or "unsupported" (no key in this build, or no
 * notifications, service worker or push: not shown).
 */
export function reminderAvailability(scope = globalThis, key = VAPID_PUBLIC_KEY) {
  if (!key) return "unsupported";
  if (typeof scope?.Notification !== "function" || !scope.navigator?.serviceWorker || typeof scope.PushManager !== "function") return "unsupported";
  if (!isStandalone(scope)) return "not-installed";
  return scope.Notification.permission === "denied" ? "denied" : "ok";
}

/** Whether this device turned the reminder on. */
export const reminderOn = () => readStoredValue(WEEKLY_REMINDER_KEY, "0") === "1";
