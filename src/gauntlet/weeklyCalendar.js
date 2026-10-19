/**
 * 이번 주의 규칙's calendar and its week arithmetic (weeklyRules.js has the
 * rules and the rest). A leaf: what the entry chunk needs to tell whether the
 * start screen has a line to show, and nothing it does not.
 */

/** Korea keeps no daylight saving: its time is UTC + 9 all year. */
export const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The calendar. `added` is the day the entry was merged (KST), which is the day
 * it was announced; the unit test fails an entry added fewer than
 * `WEEKLY_NOTICE_DAYS` before its week. 초안: the first week is a placeholder
 * for the choice in the report.
 */
export const WEEKLY_RULES = Object.freeze([
  Object.freeze({ week: "2026-W46", id: "near-wall", added: "2026-10-16" }),
]);

/** The ISO week a moment falls in, in Korean time: "2026-W53". */
export function isoWeekKey(ms) {
  const numeric = Number(ms);
  if (!Number.isFinite(numeric)) return null;
  const local = new Date(numeric + KST_OFFSET_MS);
  const day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  // Monday = 0. The ISO year is the year of the week's Thursday.
  const weekday = (new Date(day).getUTCDay() + 6) % 7;
  const thursday = new Date(day + (3 - weekday) * DAY_MS);
  const isoYear = thursday.getUTCFullYear();
  const yearStart = Date.UTC(isoYear, 0, 1);
  const week = 1 + Math.floor((thursday.getTime() - yearStart) / DAY_MS / 7);
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

/** Monday 00:00 KST of a week key, in UTC milliseconds; null for a key that is not one. */
export function weekStartMs(weekKey) {
  const match = /^(\d{4})-W(\d{2})$/.exec(String(weekKey ?? ""));
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  // 4 January is always in week 1.
  const jan4 = Date.UTC(year, 0, 4);
  const jan4Weekday = (new Date(jan4).getUTCDay() + 6) % 7;
  const start = jan4 - jan4Weekday * DAY_MS + (week - 1) * 7 * DAY_MS - KST_OFFSET_MS;
  return isoWeekKey(start) === weekKey ? start : null;
}

/** Whether the week at `ms` or the one after it is in the calendar: the start screen's line, this week's or the notice. */
export function weekHasNews(ms, calendar = WEEKLY_RULES) {
  const weeks = [isoWeekKey(ms), isoWeekKey(Number(ms) + 7 * DAY_MS)];
  return calendar.some((entry) => weeks.includes(entry.week));
}
