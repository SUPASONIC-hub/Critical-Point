import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse as parseYaml } from "yaml";

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

test("Verify Ranking adds the report to its summary with no secret, and a failure there fails nothing", () => {
  const workflow = parseYaml(readFileSync(new URL("../../.github/workflows/verify-ranking.yml", import.meta.url), "utf8"));
  const steps = workflow.jobs.verify.steps;
  const at = steps.findIndex((step) => step.name === "Add the event week line");
  assert.ok(at > 0, "the step is there");
  const step = steps[at];
  assert.equal(step["continue-on-error"], true);
  assert.equal(step.env, undefined, "no secret, no env");
  assert.match(step.run, /npm run --silent report:event-week .*\|\| true/);
  assert.match(step.if, /always\(\)/);
  assert.ok(at < steps.findIndex((other) => other.name === "Upload the summary"), "before the summary's artifact");
});

test("N48: the alarm names a reason only on the day the calendar enters 28 days, on D-14 and on D-7", async () => {
  const { eventWeekAlarm, ALARM_DAY_SHIFT_HOURS } = await import("../../scripts/report-event-week.mjs");
  const calendar = [
    { week: "2026-W46", id: "near-wall", added: "2026-10-16" },
    { week: "2026-W50", id: "short-clock", added: "2026-10-23" },
  ];
  // Funnel's 22:10 KST run on that day.
  const at = (day) => parseKstDate(day) + (22 * 60 + 10) * 60 * 1000;
  const due = [];
  for (let ms = parseKstDate("2026-11-01"); ms < parseKstDate("2027-01-31"); ms += 24 * 3600 * 1000) {
    if (eventWeekAlarm(ms + (22 * 60 + 10) * 60 * 1000, calendar).length) due.push(kstDate(ms));
  }
  // W50 starts 2026-12-07; the next slot is W52 (2026-12-21): enter 28 days on 11-10, pick by 12-07, merge by 12-14.
  assert.deepEqual(due, ["2026-11-10", "2026-12-07", "2026-12-14"]);
  assert.match(eventWeekAlarm(at("2026-11-10"), calendar)[0], /28일 안에 끝납니다\(마지막 줄 2026-W50 `short-clock`\).*2026-W52\(2026-12-21\)는 2026-12-07까지 고르고 2026-12-14까지 병합/);
  assert.match(eventWeekAlarm(at("2026-12-07"), calendar)[0], /2026-12-07.*고르는 마감\(D-14\)/);
  assert.match(eventWeekAlarm(at("2026-12-14"), calendar)[0], /2026-12-14.*병합 마감\(D-7\)/);
  // The report's own warning shows every day in between; the alarm does not.
  assert.equal(describeEventWeek(at("2026-11-20"), calendar).warnings.length, 1);
  assert.deepEqual(eventWeekAlarm(at("2026-11-20"), calendar), []);
  // A run GitHub started hours late, after midnight, still counts as the day it was booked for.
  assert.equal(ALARM_DAY_SHIFT_HOURS, 12);
  assert.equal(eventWeekAlarm(parseKstDate("2026-12-15") + 6 * 3600 * 1000, calendar).length, 1);
  assert.deepEqual(eventWeekAlarm(parseKstDate("2026-12-15") + 13 * 3600 * 1000, calendar), []);
  assert.deepEqual(eventWeekAlarm(at("2026-12-01"), []), []);
  assert.throws(() => eventWeekAlarm(Number.NaN));
});

test("N48: the shipped calendar rings first on 2027-05-25 and not today", async () => {
  const { eventWeekAlarm } = await import("../../scripts/report-event-week.mjs");
  const last = WEEKLY_RULES.reduce((a, b) => (b.week > a.week ? b : a));
  const day = (text) => parseKstDate(text) + (22 * 60 + 10) * 60 * 1000;
  assert.deepEqual(eventWeekAlarm(day("2026-11-19")), []);
  if (last.week === "2027-W25") {
    assert.equal(eventWeekAlarm(day("2027-05-25")).length, 1);
    assert.equal(eventWeekAlarm(day("2027-06-21")).length, 1);
    assert.equal(eventWeekAlarm(day("2027-06-28")).length, 1);
  }
});

test("N48: Funnel fails a scheduled run on an event week deadline, last, with no secret", () => {
  const workflow = parseYaml(readFileSync(new URL("../../.github/workflows/funnel.yml", import.meta.url), "utf8"));
  const steps = workflow.jobs.read.steps;
  const read = steps.findIndex((step) => step.id === "eventweek");
  const fail = steps.findIndex((step) => step.name === "Fail on an event week deadline");
  assert.ok(read > 0 && fail === read + 1 && fail === steps.length - 1, "read then fail, as the last two steps");
  assert.equal(steps[read].env, undefined, "no secret");
  assert.match(steps[read].run, /node scripts\/report-event-week\.mjs --alarm/);
  assert.match(steps[read].if, /!cancelled\(\)/);
  assert.match(steps[fail].if, /github\.event_name == 'schedule'/);
  assert.match(steps[fail].if, /steps\.eventweek\.outputs\.due == 'true'/);
  assert.match(steps[fail].run, /exit 1/);
  // The same road as the 80% alarm.
  assert.ok(steps.some((step) => step.name === "Fail when a global budget is near its end"));
});
