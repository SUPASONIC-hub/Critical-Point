import { DAY_MS, isoWeekKey, weekStartMs, WEEKLY_RULES } from "../gauntlet/weeklyCalendar.js";
import { getWeekRule } from "../gauntlet/weeklyRules.js";
import reminderCopy from "../copy/reminder.js";
import { fill } from "../locale.js";
import { disableReminder, enableReminder, syncReminder } from "./weeklyReminder.js";

/**
 * 주 1회 알림 (N25): the weeks the service worker may remind of, written by the
 * page in the page's language, because the worker has neither the calendar
 * nor the words (serviceWorker/worker.js `dueReminder`). A file of its own so
 * the switch (state/weeklyReminder.js) and the entry chunk do not carry the
 * catalogue: it is fetched only on a device that turned the reminder on.
 *
 * Only weeks with a rule are in it (an ordinary week has nothing to say), from
 * the week of `now` to `PLAN_WEEKS` weeks after it: the page writes it again
 * each time the app is opened, so a device that does not open the app for two
 * months hears of two months of rules and then nothing more.
 */
export const PLAN_WEEKS = 8;

export function buildReminderPlan(now, calendar = WEEKLY_RULES) {
  const plan = [];
  for (let ahead = 0; ahead <= PLAN_WEEKS; ahead += 1) {
    const week = isoWeekKey(Number(now) + ahead * 7 * DAY_MS);
    const entry = week ? calendar.find((item) => item.week === week) : null;
    const rule = entry ? getWeekRule(entry.id) : null;
    if (!rule) continue;
    plan.push({
      week,
      startMs: weekStartMs(week),
      title: fill(reminderCopy.title, { label: rule.label }),
      body: rule.world ? `${rule.title}\n${rule.world}` : rule.title,
    });
  }
  return plan;
}

/** What the page hands the worker at `now`: the plan and the week the app is open in. */
export const reminderMessage = (now) => ({ now, plan: buildReminderPlan(now), week: isoWeekKey(now) });

/** On every opening of a device that turned it on (main.jsx): the plan again, and this week counted as seen. */
export function syncReminderOnOpen(scope = globalThis, now = Date.now()) {
  return syncReminder({ scope, ...reminderMessage(now) });
}

/** The switch's two taps (components/WeeklyReminderToggle.jsx). */
export const turnReminderOn = (scope = globalThis, now = Date.now()) => enableReminder({ scope, ...reminderMessage(now) });
export const turnReminderOff = (scope = globalThis) => disableReminder({ scope });
