/**
 * 이벤트 주의 오늘 할 일, 달력만 읽어서(F7 작은 형태, docs/event-week.md).
 *
 * 저장소의 달력(`MERGED_WEEKS`, src/gauntlet/weeklyCalendar.js)과 카탈로그만 읽고, DB·네트워크·파일 쓰기는
 * 없습니다. 판의 숫자도 점수도 건드리지 않습니다: 문서 3~6장의 절차 가운데 「오늘 어느 칸에 있나」를 한 번에
 * 보이게 할 뿐입니다.
 *
 *   npm run report:event-week                      지금(한국 시간)
 *   npm run report:event-week -- --at=2026-11-30   그날 0시(KST)로 미리 보기(dry-run)
 *
 * 줄은 마크다운 목록이라 Job Summary에 그대로 붙일 수 있습니다. 알릴 것이 있으면 `주의:` 줄이 붙지만 종료
 * 코드는 늘 0입니다(보고만 함).
 */
import { pathToFileURL } from "node:url";

import { DAY_MS, isoWeekKey, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs } from "../src/gauntlet/weeklyCalendar.js";
import { getWeekRule, nextWeekRuleAt, WEEKLY_NOTICE_DAYS, weekBoardsAt, weekRuleAt } from "../src/gauntlet/weeklyRules.js";

/** 달력의 마지막 주가 이 일수 안에 시작하면 다음 줄을 고를 때(3-1 D-14, 3-2 D-7)라고 알립니다. */
export const CALENDAR_HORIZON_DAYS = 28;
/** 이벤트 주는 대체로 격주(2장): 마지막 줄 다음 빈 자리는 2주 뒤로 봅니다. */
const NEXT_SLOT_WEEKS = 2;

/** KST 날짜 "YYYY-MM-DD"(그날 0시 KST)를 UTC 밀리초로. 아니면 null. */
export function parseKstDate(text) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text ?? ""));
  if (!match) return null;
  const ms = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) - KST_OFFSET_MS;
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10) === text ? ms : null;
}

/** UTC 밀리초를 KST 날짜 "YYYY-MM-DD"로. */
export function kstDate(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

const ruleName = (rule) => `\`${rule.id}\` (${rule.label})`;

/**
 * 그 시각의 이벤트 주 상태: `lines`는 보여 줄 줄, `warnings`는 그중 `주의:` 줄만.
 * `calendar`는 테스트가 바꿔 끼울 수 있는 달력(기본은 배포되는 것).
 */
export function describeEventWeek(ms, calendar = WEEKLY_RULES) {
  const now = Number(ms);
  if (!Number.isFinite(now)) throw new Error("시각이 숫자가 아닙니다");
  const week = isoWeekKey(now);
  const lines = [`- 기준: ${kstDate(now)} (KST), ${week}`];
  const warnings = [];
  const warn = (text) => {
    warnings.push(text);
    lines.push(`- 주의: ${text}`);
  };

  const unknown = calendar.filter((entry) => !getWeekRule(entry.id));
  for (const entry of unknown) warn(`달력 ${entry.week}의 \`${entry.id}\`는 카탈로그에 없어 「규칙 없음」으로 읽힙니다 (3-1)`);

  const current = weekRuleAt(now, calendar);
  if (current) {
    lines.push(`- 이번 주의 규칙: ${ruleName(current)}, 진행 중 -- 4장 「주중에 바꾸지 않는 것」을 지킵니다 (3-4)`);
  } else {
    lines.push("- 이번 주의 규칙: 없음 (평범한 주)");
  }

  const next = nextWeekRuleAt(now, calendar);
  if (next) {
    lines.push(`- 다음 주의 규칙: ${ruleName(next)}, ${kstDate(weekStartMs(next.week))} 0시부터 -- 시작 화면 예고를 세 언어로 확인 (3-3)`);
  } else {
    lines.push("- 다음 주의 규칙: 없음");
  }

  const last = weekBoardsAt(now, calendar).find((board) => board.last);
  if (last) {
    const closes = kstDate(weekStartMs(week) + 7 * DAY_MS);
    lines.push(`- 지난주 판 탭: ${last.week} \`${last.rule}\`, ${closes} 0시에 닫힘 -- 6장의 기록(history·work-status·HANDOFF)`);
  }

  const ahead = calendar
    .map((entry) => ({ ...entry, start: weekStartMs(entry.week) }))
    .filter((entry) => entry.start !== null && entry.start > now)
    .sort((a, b) => a.start - b.start);
  if (ahead.length === 0) {
    warn("달력에 앞으로의 이벤트 주가 없습니다 -- 3-1·3-2로 다음 줄을 고르고 올립니다");
    return { week, lines, warnings };
  }
  const end = ahead[ahead.length - 1];
  const daysToEnd = Math.ceil((end.start - now) / DAY_MS);
  lines.push(`- 남은 이벤트 주: ${ahead.length}개, 달력의 마지막 줄 ${end.week} \`${end.id}\` (${kstDate(end.start)}, ${daysToEnd}일 뒤)`);
  if (daysToEnd < CALENDAR_HORIZON_DAYS) {
    const slot = end.start + NEXT_SLOT_WEEKS * 7 * DAY_MS;
    warn(
      `달력이 ${CALENDAR_HORIZON_DAYS}일 안에 끝납니다 -- 다음 격주 자리 ${isoWeekKey(slot)}(${kstDate(slot)})는 ` +
        `${kstDate(slot - 14 * DAY_MS)}까지 고르고 ${kstDate(slot - WEEKLY_NOTICE_DAYS * DAY_MS)}까지 병합 (3-1·3-2, 마이그레이션은 병합 직전에 묻기)`,
    );
  }
  return { week, lines, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const at = process.argv.slice(2).find((arg) => arg.startsWith("--at="))?.slice(5);
  const ms = at === undefined ? Date.now() : parseKstDate(at);
  if (ms === null) {
    console.error("--at=YYYY-MM-DD (한국 날짜) 꼴이어야 합니다");
    process.exit(2);
  }
  console.log(`### 이벤트 주 (docs/event-week.md)\n\n${describeEventWeek(ms).lines.join("\n")}`);
}
