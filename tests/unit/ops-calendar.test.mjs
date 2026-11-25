import assert from "node:assert/strict";
import { test } from "node:test";

const {
  calendarRunsLow,
  calendarWeeksLeft,
  describeCalendarWarning,
  describeOpsSummary,
  describeToday,
  kstDay,
  lastBookedWeek,
  main,
} = await import("../../scripts/ops-calendar.mjs");
const { WEEKLY_RULES } = await import("../../src/gauntlet/weeklyCalendar.js");

const kst = (local) => Date.parse(`${local}+09:00`);

test("the day is the Korean one", () => {
  assert.equal(kstDay(Date.parse("2026-11-30T15:00:00Z")), "2026-12-01");
  assert.equal(kstDay(Number.NaN), null);
});

test("the calendar counts its booked weeks and warns under six", () => {
  assert.equal(lastBookedWeek(WEEKLY_RULES).week >= "2027-W15", true);
  assert.equal(lastBookedWeek([]), null);
  const calendar = [{ week: "2027-W03", id: "short-clock", added: "x" }, { week: "2026-W52", id: "near-wall", added: "x" }, { week: "2027-W01", id: "x", added: "dev" }];
  assert.equal(lastBookedWeek(calendar).week, "2027-W03");
  assert.equal(calendarWeeksLeft(kst("2027-01-18T10:00:00"), calendar), 1, "W03 itself");
  assert.equal(calendarWeeksLeft(kst("2027-01-25T10:00:00"), calendar), 0, "past it");
  assert.equal(calendarWeeksLeft(kst("2026-12-07T10:00:00"), calendar), 7);
  assert.equal(calendarRunsLow(kst("2026-12-14T10:00:00"), calendar), false, "six left: W51 to W03, 2026 has a W53");
  assert.equal(calendarRunsLow(kst("2026-12-21T10:00:00"), calendar), true);
  assert.match(describeCalendarWarning(kst("2026-12-21T10:00:00"), calendar), /5주.*2027-W03.*12주/);
  assert.equal(describeCalendarWarning(kst("2026-12-07T10:00:00"), calendar), "");
  assert.equal(calendarWeeksLeft(Number.NaN, calendar), 0);
  assert.equal(calendarRunsLow(kst("2026-11-16T10:00:00")), false, "the booked calendar is not low today");
});

test("the lines say every day deploys, with no deploy weekday or quarter day", () => {
  assert.match(describeToday(kst("2026-12-02T10:00:00")), /^12-02\(수\): 매일 배포\(18:50까지\) · 주간 규칙 달력 \d+주 남음$/);
  const summary = describeOpsSummary(kst("2026-12-03T10:00:00"));
  assert.match(summary, /^## 운영 달력/);
  assert.match(summary, /12-03\(목\): 매일 배포/);
  assert.doesNotMatch(summary, /⚠|배포 요일|분기|비움/);
  const calendar = [{ week: "2027-W03", id: "short-clock", added: "x" }];
  assert.match(describeOpsSummary(kst("2026-12-21T10:00:00"), calendar), /> ⚠ 주간 규칙 달력의 남은 예약이 5주/);
});

test("the command line", () => {
  const at = ["--at", "2026-12-02T15:00:00+09:00"];
  assert.match(main(at).out, /12-02\(수\)/);
  assert.match(main([...at, "--summary"]).out, /## 운영 달력/);
  assert.equal(main([...at, "--calendar-warning"]).out, "");
  assert.equal(main([...at, "--merge"]).code, 0, "the old merge question is gone and never holds a merge");
  assert.match(main([], { now: kst("2026-11-16T10:00:00") }).out, /11-16/);
  assert.throws(() => main(["--at", "nope"]), /not a time/);
});
