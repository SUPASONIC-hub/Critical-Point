import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse as parseYaml } from "yaml";

const { collectNights, formatStreak, hideSwitchStreak, readSummary, streakDay, HIDE_SWITCH_DAYS, HIDE_SWITCH_ON_SQL } = await import("../../scripts/hide-switch-days.mjs");

// A nightly run as GitHub starts it: 23:55 KST booked, often hours late.
const kst = (text) => Date.parse(`${text}+09:00`);
const night = (day, checked, hiding = 0) => ({ ms: kst(`${day}T23:55:00`), checked, hiding });

test("a summary gives its end line's counts, a read of nothing gives zero, a failed read nothing", () => {
  assert.deepEqual(readSummary("x\nHide switch (ranking_hide_marked, off until 14 days without a false flag): would hide 2 of 37 checked runs.\n"), { hiding: 2, checked: 37 });
  assert.deepEqual(readSummary("Boards ...\nRead 0 runs, 0 rows, in 6 s (1 queries).\n"), { hiding: 0, checked: 0 });
  assert.equal(readSummary("Boards ...\nRead 12 runs, 400 rows, in 80 s (13 queries).\n"), null);
  assert.equal(readSummary(""), null);
  assert.equal(readSummary(undefined), null);
});

test("a day is the KST date twelve hours before the run, so a late or Monday run counts for the night it was booked", () => {
  assert.equal(streakDay(kst("2026-11-18T23:55:00")), "2026-11-18");
  assert.equal(streakDay(kst("2026-11-19T07:23:35")), "2026-11-18");
  assert.equal(streakDay(kst("2026-11-16T05:25:48")), "2026-11-15");
});

test("the streak counts distinct clean days back to the last false flag, and the seasons they judged", () => {
  const nights = [];
  for (let d = 1; d <= 20; d += 1) nights.push(night(`2026-12-${String(d).padStart(2, "0")}`, 10, d === 5 ? 1 : 0));
  // Monday's second run, the same day as Sunday's nightly.
  nights.push({ ms: kst("2026-12-14T00:20:00"), checked: 3, hiding: 0 });
  const streak = hideSwitchStreak(nights);
  assert.equal(streak.days, 15);
  assert.equal(streak.checked, 153);
  assert.equal(streak.flaggedOn, "2026-12-05");
  const lines = formatStreak(streak).join("\n");
  assert.match(lines, /거짓 표시 0 연속 15일 \/ 14 \(판정한 행 153\)/);
  assert.match(lines, /마지막 거짓 표시: 2026-12-05/);
  assert.ok(lines.includes(HIDE_SWITCH_ON_SQL), "the SQL line at 14 days");
});

test("a flagged run on a day takes that whole day, and a missing night neither counts nor breaks", () => {
  const streak = hideSwitchStreak([night("2026-12-01", 5), { ms: kst("2026-12-02T23:00:00"), checked: 5, hiding: 1 }, { ms: kst("2026-12-03T05:00:00"), checked: 5, hiding: 0 }, night("2026-12-04", 5)]);
  assert.equal(streak.days, 1, "12-04 only: 12-03 had no read, 12-02 was flagged");
  assert.equal(streak.flaggedOn, "2026-12-02");
});

test("under 14 days, and at 14 with no season judged, no SQL", () => {
  const short = formatStreak(hideSwitchStreak([night("2026-12-01", 4), night("2026-12-02", 4)]));
  assert.deepEqual(short, ["- 거짓 표시 0 연속 2일 / 14 (판정한 행 8)"]);
  const empty = [];
  for (let d = 1; d <= HIDE_SWITCH_DAYS; d += 1) empty.push(night(`2026-12-${String(d).padStart(2, "0")}`, 0));
  const lines = formatStreak(hideSwitchStreak(empty)).join("\n");
  assert.match(lines, /연속 14일 \/ 14 \(판정한 행 0\)/);
  assert.ok(!lines.includes(HIDE_SWITCH_ON_SQL));
  assert.match(lines, /판정한 행이 0이라/);
  assert.deepEqual(formatStreak(hideSwitchStreak([])), ["- 거짓 표시 0 연속 0일 / 14 (판정한 행 0)"]);
});

test("the nights come from the earlier runs' artifacts and tonight's summary", () => {
  const files = {
    "prev/1/verify-ranking-summary.md": "Read 0 runs, 0 rows, in 5 s (1 queries).",
    "prev/2/verify-ranking-summary.md": "Read 3 runs, 9 rows\nwould hide 0 of 3 checked runs.",
  };
  const read = (path) => files[path.replace(/\\/g, "/")] ?? null;
  const runs = [
    { databaseId: 1, createdAt: "2026-12-01T22:00:00Z" },
    { databaseId: 2, createdAt: "2026-12-02T22:00:00Z" },
    { databaseId: 3, createdAt: "2026-12-03T22:00:00Z" },
    { databaseId: 4, createdAt: "not a date" },
  ];
  const nights = collectNights({ runs, prevDir: "prev", tonight: "would hide 0 of 4 checked runs.", now: kst("2026-12-04T23:55:00"), read });
  assert.equal(nights.length, 3);
  const streak = hideSwitchStreak(nights);
  assert.equal(streak.days, 3);
  assert.equal(streak.today, 4);
  assert.match(formatStreak(streak)[0], /연속 3일 \/ 14 \(판정한 행 7, 오늘 밤 4\)/);
  assert.equal(hideSwitchStreak(collectNights({ runs, prevDir: "prev", tonight: "", now: 0, read })).today, null);
});

test("the SQL is the migration's own line to turn the switch on", () => {
  const migration = readFileSync(new URL("../../supabase/migrations/20261117000000_ranking_hide_switch.sql", import.meta.url), "utf8");
  const on = /-- On:\r?\n--\s+(.+)\r?\n--\s+(.+)\r?\n/.exec(migration);
  assert.ok(on, "the header's On: lines");
  assert.equal(`${on[1].trim()} ${on[2].trim()}`, HIDE_SWITCH_ON_SQL);
});

test("Verify Ranking counts the days after the report, reads the earlier runs only, and a failure fails nothing", () => {
  const workflow = parseYaml(readFileSync(new URL("../../.github/workflows/verify-ranking.yml", import.meta.url), "utf8"));
  const job = workflow.jobs.verify;
  assert.deepEqual(job.permissions, { contents: "read", actions: "read" });
  const steps = job.steps;
  const at = steps.findIndex((step) => step.name === "Count the days for the hide switch");
  assert.ok(at > steps.findIndex((step) => step.name === "Write the report"));
  assert.ok(at < steps.findIndex((step) => step.name === "Upload the summary"));
  const step = steps[at];
  assert.equal(step["continue-on-error"], true);
  assert.match(step.if, /always\(\)/);
  assert.deepEqual(Object.keys(step.env), ["GH_TOKEN"], "the run's own token, no secret");
  assert.match(step.run, /gh run list .*--status completed/);
  assert.match(step.run, /gh run download .*-n verify-ranking-summary/);
  assert.match(step.run, /node scripts\/hide-switch-days\.mjs /);
});
