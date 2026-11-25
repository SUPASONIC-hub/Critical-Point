/**
 * 운영 모드 달력 (N6 of the 2026-11-12 next-improvements note, 결정 Q4 (1)
 * and Q5 (1)): what day it is for the project, as pure functions over the
 * weekly clock's own arithmetic (src/gauntlet/weeklyCalendar.js).
 *
 * Until the end of 2026-11-30 the project ships every day (「속도 최대, 매일
 * 19시 전 배포」); from 2026-12-01 (KST) it runs in ops mode:
 *
 *   - a pull request that changes what the site shows or what the server keeps
 *     (screens, rules, text, migrations) merges on a deploy day only,
 *     Tuesday or Friday, by 18:50; other days take docs, tests and tooling;
 *     an outage or a security fix goes any day (`--hotfix`);
 *   - the ranking is wiped, and the rules' numbers change, only on the first
 *     Monday of a quarter (next: 2027-01-04), told in the game 14 days before;
 *     `--merge` opens that one Monday as the quarter's rule-change window, for
 *     that change alone: it is not a deploy day for notes or screens;
 *   - the weekly rule calendar is topped up by 12 weeks when fewer than 6
 *     booked weeks are left.
 *
 * Nothing here deploys, merges or blocks CI. The Funnel run writes the
 * summary (and a warning when the calendar runs low) every night; a person or
 * an agent asks `--merge` before merging by hand.
 *
 *   node scripts/ops-calendar.mjs                     today, in one line
 *   node scripts/ops-calendar.mjs --summary           the Funnel Job Summary's section
 *   node scripts/ops-calendar.mjs --calendar-warning  a line when the calendar runs low, else nothing
 *   node scripts/ops-calendar.mjs --merge [--base origin/main] [--hotfix]
 *        exit 1 when this branch changes the site and today is not a deploy day
 *   --at <ISO time> reads another moment (tests, a dry run of 12-01).
 */
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  DAY_MS,
  isoWeekKey,
  KST_OFFSET_MS,
  RANKING_RESET_MS,
  RANKING_RESET_NOTICE_DAYS,
  WEEKLY_RULES,
  weekStartMs,
} from "../src/gauntlet/weeklyCalendar.js";

/** The first day of ops mode, KST. Before it every day is a deploy day. */
export const OPS_MODE_START = "2026-12-01";
/** Tuesday and Friday (Date#getUTCDay of the KST day). */
const DEPLOY_WEEKDAYS = Object.freeze([2, 5]);
const DEPLOY_CUTOFF = "18:50";
/** The calendar is topped up below this many weeks... */
const CALENDAR_MIN_WEEKS = 6;
/** ...by this many. */
const CALENDAR_EXTEND_WEEKS = 12;
/** The first months of the quarters (0-based): a scheduled wipe is the first Monday of one. */
const QUARTER_MONTHS = Object.freeze([0, 3, 6, 9]);

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** The KST calendar day of a moment, "YYYY-MM-DD"; null for a moment that is not one. */
export function kstDay(ms) {
  const at = Number(ms);
  if (!Number.isFinite(at)) return null;
  return new Date(at + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** 00:00 KST of a "YYYY-MM-DD", in UTC milliseconds. */
function dayStartMs(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day ?? ""))) return null;
  const at = Date.parse(`${day}T00:00:00+09:00`);
  return Number.isFinite(at) && kstDay(at) === day ? at : null;
}

const weekdayOf = (day) => new Date(`${day}T00:00:00Z`).getUTCDay();
const addDays = (day, days) => kstDay(dayStartMs(day) + days * DAY_MS);
/** "12-04(금)". */
const shortDay = (day) => `${day.slice(5)}(${WEEKDAY_KO[weekdayOf(day)]})`;

export function opsModeOn(ms) {
  const day = kstDay(ms);
  return day !== null && day >= OPS_MODE_START;
}

/** Every day before ops mode; Tuesday and Friday from 2026-12-01. */
export function isDeployDay(ms) {
  const day = kstDay(ms);
  if (day === null) return false;
  return day < OPS_MODE_START || DEPLOY_WEEKDAYS.includes(weekdayOf(day));
}

/** The deploy day on or after `ms`, "YYYY-MM-DD". */
export function nextDeployDay(ms) {
  let day = kstDay(ms);
  if (day === null) return null;
  for (let i = 0; i < 7 && !isDeployDay(dayStartMs(day)); i += 1) day = addDays(day, 1);
  return day;
}

/** The first Monday of a quarter's first month, "YYYY-MM-DD". */
export function quarterResetDay(year, quarter) {
  const first = new Date(Date.UTC(year, QUARTER_MONTHS[quarter], 1));
  const offset = (8 - first.getUTCDay()) % 7;
  return new Date(first.getTime() + offset * DAY_MS).toISOString().slice(0, 10);
}

export function isQuarterResetDay(day) {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(String(day ?? ""));
  if (!match) return false;
  const quarter = QUARTER_MONTHS.indexOf(Number(match[2]) - 1);
  return quarter >= 0 && quarterResetDay(Number(match[1]), quarter) === day;
}

/**
 * The next day the ranking may be wiped, on or after `ms`, and the day the
 * game would start telling of it. Ops mode's first one is 2027-01-04: the
 * 11-26 wipe (RANKING_RESET_MS, moved up from 11-30) is the last one off the quarter days.
 */
export function nextQuarterReset(ms) {
  const today = kstDay(ms);
  if (today === null) return null;
  const year = Number(today.slice(0, 4));
  for (const y of [year, year + 1]) {
    for (let q = 0; q < QUARTER_MONTHS.length; q += 1) {
      const day = quarterResetDay(y, q);
      if (day >= today && day > kstDay(RANKING_RESET_MS)) {
        return { day, noticeFrom: addDays(day, -RANKING_RESET_NOTICE_DAYS) };
      }
    }
  }
  return null;
}

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

/**
 * Whether a changed file changes what players get: the app and its pages, the
 * server (a migration applies on merge), the build. Docs, tests, workflows and
 * the tooling under scripts/ that no page is built from are not.
 */
export function shipsToPlayers(file) {
  const path = String(file ?? "").replaceAll("\\", "/");
  if (/^(src|public|supabase)\//.test(path)) return true;
  if (/^scripts\/(content-pages\/|site-pages\.mjs|legal-pages\.mjs|structured-data\.mjs|static-shell\.mjs|service-worker-build\.mjs|build-|critical-css|locale-preload|vite-season-data|season-split|font-charset|adsense-config|analytics-config)/.test(path)) return true;
  return /^(index\.html|vite\.config\.js|render\.yaml|package\.json|package-lock\.json)$/.test(path);
}

/** May this branch merge at `ms`? `files` are the paths it changes against main. */
export function mergeVerdict(ms, files, { hotfix = false } = {}) {
  const shipping = files.filter(shipsToPlayers);
  const day = kstDay(ms);
  if (!opsModeOn(ms)) return { ok: true, reason: `${OPS_MODE_START} 전이라 매일 배포(${DEPLOY_CUTOFF}까지)입니다.`, shipping };
  if (shipping.length === 0) return { ok: true, reason: "화면·규칙·서버가 바뀌지 않는 PR이라 요일과 상관없이 병합할 수 있습니다.", shipping };
  if (hotfix) return { ok: true, reason: "장애·보안 수정(--hotfix)이라 요일과 상관없이 병합합니다.", shipping };
  if (isDeployDay(ms)) return { ok: true, reason: `오늘 ${shortDay(day)}은 배포 요일입니다(${DEPLOY_CUTOFF}까지).`, shipping };
  if (isQuarterResetDay(day)) {
    return {
      ok: true,
      reason: `오늘 ${shortDay(day)}은 분기 첫 월요일, 분기 규칙 변경 창입니다(${DEPLOY_CUTOFF}까지). 규칙 숫자·랭킹 비움만 병합하고, 노트·화면 등 다른 변경은 다음 배포 요일 ${shortDay(nextDeployDay(ms))}에 묶음으로.`,
      shipping,
    };
  }
  return {
    ok: false,
    reason: `오늘 ${shortDay(day)}은 배포 요일이 아닙니다. 화면·규칙·서버가 바뀌는 파일 ${shipping.length}개 → 다음 배포 요일 ${shortDay(nextDeployDay(ms))}에 묶음으로.`,
    shipping,
  };
}

/** One line for the terminal. */
export function describeToday(ms, calendar = WEEKLY_RULES) {
  const day = kstDay(ms);
  const deploy = opsModeOn(ms)
    ? isDeployDay(ms) ? `배포 요일(${DEPLOY_CUTOFF}까지)` : `배포 요일 아님 — 다음 ${shortDay(nextDeployDay(ms))}`
    : `운영 모드 전(${OPS_MODE_START}부터 화·금) — 매일 배포`;
  const reset = nextQuarterReset(ms);
  return `${shortDay(day)}: ${deploy} · 다음 랭킹 비움 가능일 ${reset.day}(예고 ${reset.noticeFrom}부터) · 주간 규칙 달력 ${calendarWeeksLeft(ms, calendar)}주 남음`;
}

/** The warning when the calendar runs low, or "". */
export function describeCalendarWarning(ms, calendar = WEEKLY_RULES) {
  if (!calendarRunsLow(ms, calendar)) return "";
  const last = lastBookedWeek(calendar);
  return `주간 규칙 달력의 남은 예약이 ${calendarWeeksLeft(ms, calendar)}주입니다(마지막 ${last?.week ?? "없음"}). ${CALENDAR_MIN_WEEKS}주 밑이면 ${CALENDAR_EXTEND_WEEKS}주를 더 붙입니다: weeklyCalendar.js 한 줄씩 + 서버 weekly_rules 마이그레이션(번호 질문 한 번).`;
}

/** The Funnel Job Summary's section. */
export function describeOpsSummary(ms, calendar = WEEKLY_RULES) {
  const day = kstDay(ms);
  const reset = nextQuarterReset(ms);
  const last = lastBookedWeek(calendar);
  const lines = [
    "## 운영 달력",
    "",
    opsModeOn(ms)
      ? `- 오늘 ${shortDay(day)}: ${isDeployDay(ms) ? `배포 요일(${DEPLOY_CUTOFF}까지)` : `배포 요일 아님 — 다음 배포 ${shortDay(nextDeployDay(ms))}`}`
      : `- 오늘 ${shortDay(day)}: 운영 모드 전 — 매일 배포. ${OPS_MODE_START}부터 배포는 화·금만`,
    `- 다음 랭킹 비움 가능일: ${reset.day}(분기 첫 월요일, 비운다면 게임 안 예고 ${reset.noticeFrom}부터)`,
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

export function main(argv = process.argv.slice(2), { now = Date.now(), changedFiles } = {}) {
  const at = argValue(argv, "--at");
  const ms = at === undefined ? now : Date.parse(at);
  if (!Number.isFinite(ms)) throw new Error(`--at ${at} is not a time`);
  if (argv.includes("--summary")) return { out: describeOpsSummary(ms), code: 0 };
  if (argv.includes("--calendar-warning")) return { out: describeCalendarWarning(ms), code: 0 };
  if (argv.includes("--merge")) {
    const base = argValue(argv, "--base") ?? "origin/main";
    const files = changedFiles ?? execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" }).split("\n").filter(Boolean);
    const verdict = mergeVerdict(ms, files, { hotfix: argv.includes("--hotfix") });
    return { out: `${verdict.ok ? "병합 가능" : "병합 보류"}: ${verdict.reason}`, code: verdict.ok ? 0 : 1 };
  }
  return { out: describeToday(ms), code: 0 };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { out, code } = main();
  if (out) console.log(out.trimEnd());
  process.exitCode = code;
}
