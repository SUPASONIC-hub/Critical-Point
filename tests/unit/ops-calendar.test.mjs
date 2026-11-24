import assert from "node:assert/strict";
import { test } from "node:test";

const {
  OPS_MODE_START,
  calendarRunsLow,
  calendarWeeksLeft,
  describeCalendarWarning,
  describeOpsSummary,
  describeToday,
  isDeployDay,
  isQuarterResetDay,
  kstDay,
  lastBookedWeek,
  main,
  mergeVerdict,
  nextDeployDay,
  nextQuarterReset,
  opsModeOn,
  quarterResetDay,
  shipsToPlayers,
} = await import("../../scripts/ops-calendar.mjs");
const { RANKING_RESET_MS, WEEKLY_RULES } = await import("../../src/gauntlet/weeklyCalendar.js");

const kst = (local) => Date.parse(`${local}+09:00`);

test("ops mode starts on 2026-12-01 in Korean time", () => {
  assert.equal(OPS_MODE_START, "2026-12-01");
  assert.equal(opsModeOn(kst("2026-11-30T23:59:59")), false);
  assert.equal(opsModeOn(kst("2026-12-01T00:00:00")), true);
  assert.equal(kstDay(Date.parse("2026-11-30T15:00:00Z")), "2026-12-01");
  assert.equal(opsModeOn(Number.NaN), false);
});

test("every day deploys before ops mode, Tuesday and Friday after it", () => {
  assert.equal(isDeployDay(kst("2026-11-29T12:00:00")), true, "a Sunday in November");
  assert.equal(isDeployDay(kst("2026-12-01T09:00:00")), true, "Tuesday");
  assert.equal(isDeployDay(kst("2026-12-02T09:00:00")), false, "Wednesday");
  assert.equal(isDeployDay(kst("2026-12-04T09:00:00")), true, "Friday");
  assert.equal(isDeployDay(kst("2026-12-06T09:00:00")), false, "Sunday");
  assert.equal(nextDeployDay(kst("2026-12-02T09:00:00")), "2026-12-04");
  assert.equal(nextDeployDay(kst("2026-12-05T09:00:00")), "2026-12-08");
  assert.equal(nextDeployDay(kst("2026-11-20T09:00:00")), "2026-11-20");
  assert.equal(isDeployDay(Number.NaN), false);
  assert.equal(nextDeployDay(Number.NaN), null);
});

test("a scheduled wipe is the first Monday of a quarter, and 11-30 is the last one off it", () => {
  assert.equal(quarterResetDay(2027, 0), "2027-01-04");
  assert.equal(quarterResetDay(2027, 1), "2027-04-05");
  assert.equal(quarterResetDay(2027, 2), "2027-07-05");
  assert.equal(quarterResetDay(2027, 3), "2027-10-04");
  assert.equal(quarterResetDay(2029, 9 / 3), "2029-10-01", "a quarter that starts on a Monday");
  assert.equal(isQuarterResetDay("2027-01-04"), true);
  assert.equal(isQuarterResetDay("2027-01-11"), false);
  assert.equal(isQuarterResetDay("2027-02-01"), false);
  assert.equal(isQuarterResetDay("nope"), false);
  assert.deepEqual(nextQuarterReset(kst("2026-11-16T10:00:00")), { day: "2027-01-04", noticeFrom: "2026-12-21" });
  assert.deepEqual(nextQuarterReset(kst("2027-01-05T10:00:00")), { day: "2027-04-05", noticeFrom: "2027-03-22" });
  assert.equal(nextQuarterReset(Number.NaN), null);
  // The rule the start screen's notice reads: a wipe after 11-30 is a quarter day.
  const resetDay = kstDay(RANKING_RESET_MS);
  assert.ok(resetDay === "2026-11-30" || isQuarterResetDay(resetDay), `RANKING_RESET_MS ${resetDay} is not the first Monday of a quarter`);
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

test("only what ships to players waits for a deploy day", () => {
  for (const file of ["src/App.jsx", "public/sw.js", "supabase/migrations/20261119000000_x.sql", "scripts/content-pages/guide-text.mjs", "scripts\\site-pages.mjs", "index.html", "package-lock.json"]) {
    assert.equal(shipsToPlayers(file), true, file);
  }
  for (const file of ["docs/work-status.md", "README.md", "tests/unit/x.test.mjs", ".github/workflows/funnel.yml", "scripts/report-funnel.mjs", "scripts/ops-calendar.mjs"]) {
    assert.equal(shipsToPlayers(file), false, file);
  }
  const wednesday = kst("2026-12-02T15:00:00");
  assert.equal(mergeVerdict(wednesday, ["docs/x.md"]).ok, true);
  const held = mergeVerdict(wednesday, ["src/App.jsx", "docs/x.md"]);
  assert.equal(held.ok, false);
  assert.match(held.reason, /12-04\(금\)/);
  assert.deepEqual(held.shipping, ["src/App.jsx"]);
  assert.equal(mergeVerdict(wednesday, ["src/App.jsx"], { hotfix: true }).ok, true);
  assert.equal(mergeVerdict(kst("2026-12-04T15:00:00"), ["src/App.jsx"]).ok, true);
  assert.equal(mergeVerdict(kst("2026-11-18T15:00:00"), ["src/App.jsx"]).ok, true, "before ops mode");
});

test("the first Monday of a quarter is the rule-change window, and no other Monday is", () => {
  const files = ["src/gauntlet/weeklyCalendar.js"];
  for (const local of ["2026-12-28T10:00:00", "2027-01-11T10:00:00", "2027-04-12T10:00:00"]) {
    const verdict = mergeVerdict(kst(local), files);
    assert.equal(verdict.ok, false, local);
    assert.doesNotMatch(verdict.reason, /분기 규칙 변경 창/, local);
  }
  for (const [local, label] of [["2027-01-04T10:00:00", "01-04\\(월\\)"], ["2027-04-05T10:00:00", "04-05\\(월\\)"]]) {
    const verdict = mergeVerdict(kst(local), files);
    assert.equal(verdict.ok, true, local);
    assert.match(verdict.reason, new RegExp(`${label}은 분기 첫 월요일, 분기 규칙 변경 창`));
    assert.match(verdict.reason, /노트·화면 등 다른 변경은 다음 배포 요일/);
  }
  // Tuesday and Friday stay plain deploy days, also right after the window.
  for (const local of ["2027-01-05T10:00:00", "2027-01-08T10:00:00"]) {
    const verdict = mergeVerdict(kst(local), files);
    assert.equal(verdict.ok, true, local);
    assert.match(verdict.reason, /배포 요일입니다/, local);
    assert.doesNotMatch(verdict.reason, /분기 규칙 변경 창/, local);
  }
  // The window is the Korean day, not the UTC one.
  assert.equal(mergeVerdict(Date.parse("2027-01-03T14:59:59Z"), files).ok, false, "Sunday 23:59:59 KST");
  assert.match(mergeVerdict(Date.parse("2027-01-03T15:00:00Z"), files).reason, /분기 규칙 변경 창/, "Monday 00:00 KST");
  assert.match(mergeVerdict(Date.parse("2027-01-04T14:59:59Z"), files).reason, /분기 규칙 변경 창/, "Monday 23:59:59 KST");
  assert.doesNotMatch(mergeVerdict(Date.parse("2027-01-04T15:00:00Z"), files).reason, /분기 규칙 변경 창/, "Tuesday 00:00 KST");
  // The window does not make the Monday a deploy day anywhere else.
  assert.equal(isDeployDay(kst("2027-01-04T10:00:00")), false);
  assert.equal(nextDeployDay(kst("2027-01-04T10:00:00")), "2027-01-05");
  assert.equal(main(["--at", "2027-01-04T10:00:00+09:00", "--merge"], { changedFiles: files }).code, 0);
  assert.equal(main(["--at", "2027-01-11T10:00:00+09:00", "--merge"], { changedFiles: files }).code, 1);
});

test("the lines say the day, the next wipe and the calendar", () => {
  assert.match(describeToday(kst("2026-11-16T10:00:00")), /11-16\(월\): 운영 모드 전.*2027-01-04\(예고 2026-12-21부터\).*주 남음/);
  assert.match(describeToday(kst("2026-12-02T10:00:00")), /배포 요일 아님 — 다음 12-04\(금\)/);
  assert.match(describeToday(kst("2026-12-04T10:00:00")), /배포 요일\(18:50까지\)/);
  const summary = describeOpsSummary(kst("2026-12-03T10:00:00"));
  assert.match(summary, /^## 운영 달력/);
  assert.match(summary, /다음 배포 12-04\(금\)/);
  assert.doesNotMatch(summary, /⚠/);
  assert.match(describeOpsSummary(kst("2026-11-20T10:00:00")), /운영 모드 전/);
});

test("the command line", () => {
  const at = ["--at", "2026-12-02T15:00:00+09:00"];
  assert.match(main(at).out, /12-02\(수\)/);
  assert.match(main([...at, "--summary"]).out, /## 운영 달력/);
  assert.equal(main([...at, "--calendar-warning"]).out, "");
  assert.deepEqual(main([...at, "--merge"], { changedFiles: ["src/App.jsx"] }).code, 1);
  assert.deepEqual(main([...at, "--merge", "--hotfix"], { changedFiles: ["src/App.jsx"] }).code, 0);
  assert.equal(main([...at, "--merge"], { changedFiles: ["docs/a.md"] }).code, 0);
  assert.match(main([], { now: kst("2026-11-16T10:00:00") }).out, /11-16/);
  assert.throws(() => main(["--at", "nope"]), /not a time/);
});
