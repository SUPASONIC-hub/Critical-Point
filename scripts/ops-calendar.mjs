/**
 * 운영 달력: how many weeks the weekly rule calendar (src/gauntlet/weeklyCalendar.js)
 * still has booked, as pure functions over that file's own arithmetic.
 *
 * Ops mode (Tuesday/Friday deploys, ranking wipes and rule numbers on a
 * quarter's first Monday) was dropped on 2026-11-25: the project deploys
 * every day by 18:50 and merges a change when it is ready (docs/ops-mode.md).
 * What stays is the calendar's top-up rule: 12 more weeks when fewer than 6
 * booked weeks are left.
 *
 * Nothing here deploys, merges or blocks CI. The Funnel run writes the
 * summary (and a warning when the calendar runs low) every night.
 *
 *   node scripts/ops-calendar.mjs                     today, in one line
 *   node scripts/ops-calendar.mjs --summary           the Funnel Job Summary's section
 *   node scripts/ops-calendar.mjs --calendar-warning  a line when the calendar runs low, else nothing
 *   --at <ISO time> reads another moment (tests).
 */
import { pathToFileURL } from "node:url";

import { DAY_MS, isoWeekKey, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs } from "../src/gauntlet/weeklyCalendar.js";

const DEPLOY_CUTOFF = "18:50";
/** The calendar is topped up below this many weeks... */
const CALENDAR_MIN_WEEKS = 6;
/** ...by this many. */
const CALENDAR_EXTEND_WEEKS = 12;

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** The KST calendar day of a moment, "YYYY-MM-DD"; null for a moment that is not one. */
export function kstDay(ms) {
  const at = Number(ms);
  if (!Number.isFinite(at)) return null;
  return new Date(at + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** "12-04(금)". */
const shortDay = (day) => `${day.slice(5)}(${WEEKDAY_KO[new Date(`${day}T00:00:00Z`).getUTCDay()]})`;

/** The last booked week of the calendar (by its Monday), or null for an empty one. */
export function lastBookedWeek(calendar = WEEKLY_RULES) {
  let last = null;
  for (const entry of calendar) {
    if (entry.added === "dev") continue;
    const start = weekStartMs(entry.week);
    if (start !== null && (last === null || start > last.start)) last = { week: entry.week, start };
  }
  return last;
}

/** Whole weeks from the week of `ms` to the last booked week, that week counted; 0 when it is past. */
export function calendarWeeksLeft(ms, calendar = WEEKLY_RULES) {
  const last = lastBookedWeek(calendar);
  const thisWeek = weekStartMs(isoWeekKey(ms));
  if (!last || thisWeek === null) return 0;
  return Math.max(0, Math.round((last.start - thisWeek) / (7 * DAY_MS)) + 1);
}

export function calendarRunsLow(ms, calendar = WEEKLY_RULES) {
  return calendarWeeksLeft(ms, calendar) < CALENDAR_MIN_WEEKS;
}

/** One line for the terminal. */
export function describeToday(ms, calendar = WEEKLY_RULES) {
  return `${shortDay(kstDay(ms))}: 매일 배포(${DEPLOY_CUTOFF}까지) · 주간 규칙 달력 ${calendarWeeksLeft(ms, calendar)}주 남음`;
}

/** The warning when the calendar runs low, or "". */
export function describeCalendarWarning(ms, calendar = WEEKLY_RULES) {
  if (!calendarRunsLow(ms, calendar)) return "";
  const last = lastBookedWeek(calendar);
  return `주간 규칙 달력의 남은 예약이 ${calendarWeeksLeft(ms, calendar)}주입니다(마지막 ${last?.week ?? "없음"}). ${CALENDAR_MIN_WEEKS}주 밑이면 ${CALENDAR_EXTEND_WEEKS}주를 더 붙입니다: weeklyCalendar.js 한 줄씩 + 서버 weekly_rules 마이그레이션(번호 질문 한 번).`;
}

/** The Funnel Job Summary's section. */
export function describeOpsSummary(ms, calendar = WEEKLY_RULES) {
  const last = lastBookedWeek(calendar);
  const lines = [
    "## 운영 달력",
    "",
    `- 오늘 ${shortDay(kstDay(ms))}: 매일 배포(${DEPLOY_CUTOFF}까지)`,
    `- 주간 규칙 달력: ${calendarWeeksLeft(ms, calendar)}주 남음(마지막 ${last?.week ?? "없음"})`,
  ];
  const warning = describeCalendarWarning(ms, calendar);
  if (warning) lines.push("", `> ⚠ ${warning}`);
  return `${lines.join("\n")}\n`;
}

function argValue(argv, name) {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

export function main(argv = process.argv.slice(2), { now = Date.now() } = {}) {
  const at = argValue(argv, "--at");
  const ms = at === undefined ? now : Date.parse(at);
  if (!Number.isFinite(ms)) throw new Error(`--at ${at} is not a time`);
  if (argv.includes("--summary")) return { out: describeOpsSummary(ms), code: 0 };
  if (argv.includes("--calendar-warning")) return { out: describeCalendarWarning(ms), code: 0 };
  return { out: describeToday(ms), code: 0 };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { out, code } = main();
  if (out) console.log(out.trimEnd());
  process.exitCode = code;
}
