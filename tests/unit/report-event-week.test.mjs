import assert from "node:assert/strict";
import { test } from "node:test";

const { describeEventWeek, parseKstDate, kstDate, CALENDAR_HORIZON_DAYS } = await import("../../scripts/report-event-week.mjs");
const { WEEKLY_RULES } = await import("../../src/gauntlet/weeklyCalendar.js");

test("the event-week report reads a KST date and prints it back", () => {
  const ms = parseKstDate("2026-11-30");
  assert.equal(ms, Date.parse("2026-11-30T00:00:00+09:00"));
  assert.equal(kstDate(ms), "2026-11-30");
  assert.equal(parseKstDate("2026-02-30"), null);
  assert.equal(parseKstDate("2026-11-3"), null);
  assert.throws(() => describeEventWeek(Number.NaN));
});

test("in a running event week it names the rule, the notice of next week and last week's board", () => {
  const { week, lines, warnings } = describeEventWeek(parseKstDate("2026-11-24"));
  assert.equal(week, "2026-W48");
  const text = lines.join("\n");
  assert.match(text, /이번 주의 규칙: `heavy-fracture`.*진행 중/);
  assert.match(text, /다음 주의 규칙: `crisis-week`.*2026-11-30 0시부터/);
  assert.match(text, /지난주 판 탭: 2026-W47 `audit-cascade`, 2026-11-30 0시에 닫힘/);
  assert.deepEqual(warnings, []);
});

test("an ordinary week says so, and the calendar's end is warned about in time", () => {
  const calendar = [
    { week: "2026-W46", id: "near-wall", added: "2026-10-16" },
    { week: "2026-W50", id: "short-clock", added: "2026-10-23" },
  ];
  const quiet = describeEventWeek(parseKstDate("2026-11-18"), calendar);
  assert.match(quiet.lines.join("\n"), /이번 주의 규칙: 없음/);
  assert.match(quiet.lines.join("\n"), /남은 이벤트 주: 1개, 달력의 마지막 줄 2026-W50/);
  assert.equal(quiet.warnings.length, 1);
  assert.match(quiet.warnings[0], /다음 격주 자리 2026-W52\(2026-12-21\)는 2026-12-07까지 고르고 2026-12-14까지 병합/);

  const far = describeEventWeek(parseKstDate("2026-11-18") - CALENDAR_HORIZON_DAYS * 24 * 3600 * 1000, calendar);
  assert.ok(!far.warnings.some((line) => line.includes("일 안에 끝납니다")));

  const empty = describeEventWeek(parseKstDate("2026-12-14"), calendar);
  assert.match(empty.warnings.join("\n"), /앞으로의 이벤트 주가 없습니다/);
});

test("a calendar id the catalogue does not know is warned about", () => {
  const { warnings } = describeEventWeek(parseKstDate("2026-11-18"), [{ week: "2026-W50", id: "no-such-rule", added: "2026-11-01" }]);
  assert.match(warnings[0], /`no-such-rule`는 카탈로그에 없어/);
});

test("the shipped calendar gives no warning on 2026-11-18, the day the report was added", () => {
  const last = WEEKLY_RULES[WEEKLY_RULES.length - 1];
  assert.ok(describeEventWeek(parseKstDate("2026-11-18")).warnings.length === 0, `calendar ends at ${last.week}`);
});
