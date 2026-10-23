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
 * `WEEKLY_NOTICE_DAYS` before its week, or than its own `notice` in days when
 * it has one. 초안: the first week is a placeholder for the choice in the
 * report.
 *
 * 2026-W47 (11-16 to 11-22) is B3's and B2's test week, both devices
 * together. It was W44 (user, 2026-10-21, told five days ahead); on
 * 2026-10-22 the user moved it three weeks on, so the improvements waiting in
 * drafts are live first and the test is played on top of them. W44 is an
 * ordinary week again. Moved, it keeps the ordinary notice: the start screen
 * says it from W46 (11-09), beside W46's own rule (WeeklyRuleViews.jsx).
 * Listed after W46 so the first entry, which the tests and the e2e play as
 * "the event", stays W46.
 */
const MERGED_WEEKS = Object.freeze([
  Object.freeze({ week: "2026-W46", id: "near-wall", added: "2026-10-16" }),
  Object.freeze({ week: "2026-W47", id: "audit-cascade", added: "2026-10-22" }),
]);

/**
 * A development build's switch, so a rule can be played before any week has
 * it (B3's audit and B2's links were judged by simulation and the maker's
 * own plays before their test week). On the dev server, or a build that asked
 * for the debug tools, `?week=audit` or `?week=cascade` makes that catalogue
 * entry this week's rule: the start screen has its line and its box, and a
 * season started then carries the stamp in its save, so a reload without the
 * query plays on under it. Any id of the catalogue works; one that is not
 * there is no rule (getWeekRule). The week is the device's: a build whose
 * weekly clock is pinned (the e2e builds, state/weeklyClock.js) reads another
 * week, and the switch does nothing there.
 *
 * A release has no switch: `__CP_DEBUG_BUILD__` is false there and the bundler
 * drops the branch. A session with it on sends nothing to the server
 * (telemetry.js), so a forced week never reaches a ranking. Node, which runs
 * the tests and the bots, has no constant and no switch.
 */
export function devWeekEntry({ debugBuild = false, search = "", now = Date.now() } = {}) {
  if (!debugBuild) return null;
  const id = new URLSearchParams(search ?? "").get("week");
  const week = isoWeekKey(now);
  return id && /^[a-z][a-z-]{0,31}$/.test(id) && week ? Object.freeze({ week, id, added: "dev" }) : null;
}

/** This session's forced week (`devWeekEntry`), or null: always null in a release. */
export const DEV_WEEK_RULE =
  typeof __CP_DEBUG_BUILD__ !== "undefined" && __CP_DEBUG_BUILD__
    ? devWeekEntry({ debugBuild: true, search: globalThis.location?.search, now: Date.now() })
    : null;

/** The calendar every reader reads: the merged weeks, behind a forced one. */
export const WEEKLY_RULES = DEV_WEEK_RULE ? Object.freeze([DEV_WEEK_RULE, ...MERGED_WEEKS]) : MERGED_WEEKS;

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
