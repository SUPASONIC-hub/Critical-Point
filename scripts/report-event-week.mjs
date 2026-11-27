/**
 * 이벤트 주의 오늘 할 일, 달력만 읽어서(F7 작은 형태, docs/event-week.md).
 *
 * 저장소의 달력(`MERGED_WEEKS`, src/gauntlet/weeklyCalendar.js)과 카탈로그만 읽고, DB·네트워크·파일 쓰기는
 * 없습니다. 판의 숫자도 점수도 건드리지 않습니다: 문서 3~6장의 절차 가운데 「오늘 어느 칸에 있나」를 한 번에
 * 보이게 할 뿐입니다.
 *
 *   npm run report:event-week                      지금(한국 시간)
 *   npm run report:event-week -- --at=2026-11-30   그날 0시(KST)로 미리 보기(dry-run)
 *   npm run report:event-week -- --alarm           알람 날이면 그 까닭을 한 줄씩, 아니면 아무것도(N48)
 *
 * 줄은 마크다운 목록이라 Job Summary에 그대로 붙일 수 있습니다. 알릴 것이 있으면 `주의:` 줄이 붙지만 종료
 * 코드는 늘 0입니다(보고만 함). `--alarm`도 종료 코드는 0이고, 실패로 끝내는 것은 Funnel 워크플로의 몫입니다
 * (예산 80% 알람과 같은 길: 예약 실행이 실패하면 GitHub이 메일을 보냄).
 */
import { pathToFileURL } from "node:url";

import { DAY_MS, isoWeekKey, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs } from "../src/gauntlet/weeklyCalendar.js";
import { getWeekRule, nextWeekRuleAt, WEEKLY_NOTICE_DAYS, weekBoardsAt, weekRuleAt } from "../src/gauntlet/weeklyRules.js";

/** 달력의 마지막 주가 이 일수 안에 시작하면 다음 줄을 고를 때(3-1 D-14, 3-2 D-7)라고 알립니다. */
export const CALENDAR_HORIZON_DAYS = 28;
/** 이벤트 주는 대체로 격주(2장): 마지막 줄 다음 빈 자리는 2주 뒤로 봅니다. */
const NEXT_SLOT_WEEKS = 2;
/**
 * 알람이 보는 「그날」은 실행 시각에서 12시간을 뺀 날(KST)입니다. Funnel은 22:10 KST 예약이지만 GitHub이 몇
 * 시간 늦게 시작하기도 해서(10-24~11-02 Verify Ranking은 3~8시간 늦음), 자정을 넘긴 늦은 실행도 예약한 날로 셉니다.
 */
export const ALARM_DAY_SHIFT_HOURS = 12;

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

/**
 * N48: 알람 메일을 보낼 날의 까닭들(없으면 빈 배열). `주의:` 줄은 달력이 28일 안에 끝나는 동안 매일 뜨므로,
 * 메일은 세 날에만 갑니다 -- 28일 안에 처음 들어온 날, 다음 격주 자리를 고르는 마감(D-14), 병합 마감(D-7).
 * 날짜는 달력의 마지막 줄(지난 줄이어도)에서 셉니다: D-14 마감은 바로 그 마지막 주의 첫날이라, 그날부터는
 * `describeEventWeek`의 「앞으로의 이벤트 주」에 그 줄이 없습니다. 달력에 줄을 더하면 날짜도 따라 밀립니다.
 */
export function eventWeekAlarm(ms, calendar = WEEKLY_RULES) {
  const now = Number(ms);
  if (!Number.isFinite(now)) throw new Error("시각이 숫자가 아닙니다");
  const starts = calendar.map((entry) => ({ ...entry, start: weekStartMs(entry.week) })).filter((entry) => entry.start !== null);
  if (starts.length === 0) return [];
  const end = starts.reduce((a, b) => (b.start > a.start ? b : a));
  const day = kstDate(now - ALARM_DAY_SHIFT_HOURS * 3600 * 1000);
  const slot = end.start + NEXT_SLOT_WEEKS * 7 * DAY_MS;
  const slotName = `${isoWeekKey(slot)}(${kstDate(slot)})`;
  const pick = kstDate(slot - 14 * DAY_MS);
  const merge = kstDate(slot - WEEKLY_NOTICE_DAYS * DAY_MS);
  const reasons = [];
  if (day === kstDate(end.start - (CALENDAR_HORIZON_DAYS - 1) * DAY_MS)) {
    reasons.push(`달력이 ${CALENDAR_HORIZON_DAYS}일 안에 끝납니다(마지막 줄 ${end.week} \`${end.id}\`): 다음 격주 자리 ${slotName}는 ${pick}까지 고르고 ${merge}까지 병합 (3-1·3-2)`);
  }
  if (day === pick) reasons.push(`오늘(${pick})이 다음 격주 자리 ${slotName}의 규칙을 고르는 마감(D-14)입니다 (3-1)`);
  if (day === merge) reasons.push(`오늘(${merge})이 다음 격주 자리 ${slotName}의 병합 마감(D-7)입니다 -- 마이그레이션은 병합 직전에 묻기 (3-2)`);
  return reasons;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const at = args.find((arg) => arg.startsWith("--at="))?.slice(5);
  const ms = at === undefined ? Date.now() : parseKstDate(at);
  if (ms === null) {
    console.error("--at=YYYY-MM-DD (한국 날짜) 꼴이어야 합니다");
    process.exit(2);
  }
  if (args.includes("--alarm")) {
    // --at은 그날 0시라 12시간을 빼면 전날이 되므로, 미리 보기에서는 그날 22:10(Funnel 예약 시각)으로 봅니다.
    const reasons = eventWeekAlarm(at === undefined ? ms : ms + (22 * 60 + 10) * 60 * 1000);
    if (reasons.length) console.log(reasons.join("\n"));
  } else {
    console.log(`### 이벤트 주 (docs/event-week.md)\n\n${describeEventWeek(ms).lines.join("\n")}`);
  }
}
