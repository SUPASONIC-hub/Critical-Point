import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, funnelQuery, readFunnel, describeFunnel, quantile, duration, MILESTONES, STOPS } = await import("../../scripts/report-funnel.mjs");
const { CASE_SEQUENCE } = await import("../../src/gameCases.js");

const DAY = 86400;
const NOW = 1_800_000_000;
const T0 = NOW - 30 * DAY;
// A run's cases, each `step` seconds after the one before, from `start`.
const through = (lastCase, start, step = 600) =>
  CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(lastCase) + 1).map((caseId, index) => [caseId, start + index * step]);

test("the funnel counts where runs stopped, how long players stay away, and what finished seasons did next, and prints no id", () => {
  const finishedA = [...through("final", T0), ["season-final", T0 + 54 * 600 + 60]];
  // Finished over two sittings, four days apart.
  const twoSittings = through("final", T0, 600).map(([caseId, at], index) => [caseId, index >= 20 ? at + 4 * DAY : at]);
  const finishedB = [...twoSittings, ["season-final", twoSittings.at(-1)[1] + 60]];
  const rows = [
    { device: 1, marked: false, new_game_plus: false, cases: finishedA },
    // The same device opens a new run after its finale, as text the way some JSON gives booleans.
    { device: 1, marked: "true", new_game_plus: "true", cases: through("case08", T0 + 2 * DAY) },
    { device: 2, marked: false, new_game_plus: false, cases: JSON.stringify(finishedB) },
    { device: 3, marked: false, new_game_plus: false, cases: through("prologue02", T0) },
    // Still playing: its last row is a day old.
    { device: 4, marked: false, new_game_plus: false, cases: through("case18", NOW - DAY - 17 * 600) },
    // Rows out of order and an unknown case id are read by the case's place in the season.
    { device: 5, marked: false, new_game_plus: false, cases: [["prologue03", T0 + 1200], ["prologue01", T0], ["prologue02", T0 + 600], ["mystery", T0 + 1800]] },
  ];
  const f = readFunnel(rows, NOW);
  assert.equal(f.runs, 6);
  assert.equal(f.devices, 5);
  assert.deepEqual(f.reach, [6, 6, 5, 4, 4, 4, 4, 3, 2, 2], MILESTONES.join(","));
  const stops = Object.fromEntries(STOPS.map(([name], index) => [name, f.stops[index]]));
  assert.deepEqual(stops["프롤로그 02"], { all: 1, stale: 1 });
  assert.deepEqual(stops["프롤로그 03"], { all: 1, stale: 1 });
  assert.deepEqual(stops["사건 08–17"], { all: 1, stale: 1 });
  assert.deepEqual(stops["사건 18–35"], { all: 1, stale: 0 }, "a run with a row from yesterday has not stopped");
  assert.deepEqual(stops["피날레"], { all: 2, stale: 0 });
  assert.equal(f.breaks, 1, "one gap of four days");
  assert.equal(f.breakMedian, 4 * DAY + 600);
  assert.equal(f.runsWithBreak, 1);
  assert.equal(f.gapMedian, 600);
  assert.equal(f.finished, 2);
  assert.ok(Math.abs(f.seasonDaysMedian - (54 * 600 + 60) / DAY) < 1e-9);
  assert.ok(Math.abs(f.seasonDaysP90 - (4 * DAY + 54 * 600 + 60) / DAY) < 1e-9);
  assert.equal(f.restarted, 1, "device 1 began a run after its season-final; device 2 did not");
  assert.equal(f.markedRuns, 1);
  assert.equal(f.newGamePlus.runs, 1);
  assert.deepEqual(f.newGamePlus.reach, [1, 1, 1, 1, 1, 1, 1, 0, 0, 0]);

  const text = describeFunnel(f, { since: "", at: new Date(NOW * 1000) });
  assert.match(text, /\| 피날레 \| 2 \| 33\.3% \|/);
  assert.match(text, /끝낸 뒤 같은 기기에서 새 런을 연 비율 \| 50\.0% \(1\/2\)/);
  assert.match(text, /동의한 기기의 행만/);
  assert.match(text, /newGamePlus: true` 런 1개/);
  assert.doesNotMatch(text, /### NEW GAME\+\n\n아직 없음/);
});

test("without a NEW GAME+ mark on any row the funnel says it has none yet", () => {
  const f = readFunnel([{ device: 1, marked: false, new_game_plus: false, cases: through("case01", T0) }], NOW);
  assert.equal(f.markedRuns, 0);
  const text = describeFunnel(f, { since: "2026-10-01", at: new Date(NOW * 1000) });
  assert.match(text, /### NEW GAME\+\n\n아직 없음/);
  assert.match(text, /2026-10-01\(KST\) 이후/);
  assert.match(text, /완주에 걸린 날.*\| — \/ — \|/);
});

test("quantiles and durations read the way the summary prints them", () => {
  assert.equal(quantile([], 0.5), null);
  assert.equal(quantile([5, 1, 3], 0.5), 3);
  assert.equal(quantile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.9), 9);
  assert.equal(duration(null), "—");
  assert.equal(duration(600), "10분");
  assert.equal(duration(5 * 3600), "5.0시간");
  assert.equal(duration(3 * DAY), "3.0일");
});

test("the query is one read-only statement that sends no run or device id out", () => {
  assert.match(QUERY, /^with runs as \(/);
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|create|grant|truncate)\b|;/i);
  assert.equal(QUERY, funnelQuery(""));
  // What leaves the database: a device's rank, the two marks and the cases.
  const selected = QUERY.slice(QUERY.lastIndexOf("\nselect ")).replace("dense_rank() over (order by r.session_id) as device", "device");
  assert.doesNotMatch(selected, /run_id|session_id|session_code|player_name/);
  assert.match(QUERY, /dense_rank\(\) over \(order by r\.session_id\) as device/);
  assert.match(funnelQuery("2026-10-01"), /having min\(s\.completed_at\) >= '2026-10-01T00:00:00\+09:00'::timestamptz/);
});

test("the player tables count new and active devices, runs begun and finished by KST day and week", async () => {
  const { readTraffic, describeTraffic, kstDay, kstWeek, TRAFFIC_DAYS, TRAFFIC_WEEKS } = await import("../../scripts/report-funnel.mjs");
  // 2027-01-15 is a Friday; 12:00 KST is 03:00 UTC.
  const noon = Date.parse("2027-01-15T03:00:00Z") / 1000;
  assert.equal(kstDay(Date.parse("2027-01-14T15:30:00Z") / 1000), "2027-01-15", "00:30 KST is already the next day");
  assert.equal(kstWeek(noon), "2027-01-11");
  assert.equal(kstWeek(Date.parse("2027-01-10T14:59:00Z") / 1000), "2027-01-04", "Sunday 23:59 KST is the week before");
  const at = (dayOffset, minutes = 0) => noon - dayOffset * DAY + minutes * 60;
  const rows = [
    // Device 1: began two days ago, came back today; a second run finished today.
    { device: 1, marked: false, new_game_plus: false, cases: [["prologue01", at(2)], ["prologue02", at(0)]] },
    { device: 1, marked: false, new_game_plus: false, cases: [...CASE_SEQUENCE.map((caseId, index) => [caseId, at(1, index)]), ["season-final", at(0, 5)]] },
    // Device 2: new today, got past the prologue.
    { device: 2, marked: false, new_game_plus: false, cases: [["prologue01", at(0, 1)], ["prologue05", at(0, 2)], ["case01", at(0, 3)]] },
    // Device 3: first seen long before the window.
    { device: 3, marked: false, new_game_plus: false, cases: [["prologue01", at(100)]] },
  ];
  const t = readTraffic(rows, noon);
  assert.equal(t.days.length, TRAFFIC_DAYS);
  assert.equal(t.weeks.length, TRAFFIC_WEEKS);
  assert.equal(t.devices, 3);
  const [today, yesterday, twoAgo] = t.days;
  assert.deepEqual(today, { key: "2027-01-15", newDevices: 1, active: 2, began: 1, pastPrologue: 1, finished: 1 });
  assert.deepEqual(yesterday, { key: "2027-01-14", newDevices: 0, active: 1, began: 1, pastPrologue: 1, finished: 0 });
  assert.deepEqual(twoAgo, { key: "2027-01-13", newDevices: 1, active: 1, began: 1, pastPrologue: 0, finished: 0 });
  assert.deepEqual(t.weeks[0], { key: "2027-01-11", newDevices: 2, active: 2, began: 3, pastPrologue: 2, finished: 1 });
  const text = describeTraffic(t);
  assert.match(text, /\| 2027-01-15 \| 1 \| 2 \| 1 \| 1 \| 1 \|/);
  assert.match(text, /서로 다른 기기 3대/);
  assert.doesNotMatch(text, /grants-check-session|run-/);
});

test("runs are read by the language their rows name, a run naming none is presumed Korean, and English runs get the preview's funnel", async () => {
  const { readTraffic, describeTraffic, readFunnel: read, describeFunnel: describe, EN_MILESTONES, ENGLISH_OPENED } = await import("../../scripts/report-funnel.mjs");
  const opened = Date.parse(`${ENGLISH_OPENED}T00:00:00+09:00`) / 1000;
  const now = opened + 3 * DAY;
  const named = (lastCase, start, locale) => through(lastCase, start).map((entry) => [...entry, locale]);
  const rows = [
    // English through the end of the preview and on into 사건 11 in Korean.
    { device: 1, marked: false, new_game_plus: false, cases: named("case12", now - DAY, "en") },
    // English, stopped at 프롤로그 05; its first row came from before the field and names nothing.
    { device: 2, marked: false, new_game_plus: false, cases: [["prologue01", now - DAY, null], ...named("prologue05", now - DAY + 600, "en").slice(1)] },
    // English, reached the end of the preview and has not gone on.
    { device: 3, marked: false, new_game_plus: false, cases: named("case10", now - 2 * DAY, "en") },
    { device: 4, marked: false, new_game_plus: false, cases: named("case03", now - DAY, "ko") },
    // No language anywhere: one from before the English page, one after it; an unknown code counts as none.
    { device: 5, marked: false, new_game_plus: false, cases: through("case01", opened - 10 * DAY) },
    { device: 6, marked: false, new_game_plus: false, cases: named("prologue02", now - DAY, "fr") },
  ];
  const f = read(rows, now);
  assert.deepEqual(f.locales, { ko: 1, en: 3 });
  assert.equal(f.unnamed, 2);
  assert.equal(f.unnamedSinceEnglish, 1, "the run that began before the English page opened was Korean for certain");
  assert.equal(f.english.runs, 3);
  assert.deepEqual(f.english.reach, [3, 3, 3, 3, 3, 2, 2, 2, 1], EN_MILESTONES.join(","));
  const text = describe(f, { since: "", at: new Date(now * 1000) });
  assert.match(text, /\| ko\(추정\) \| 2 \|/);
  assert.match(text, /\| en \| 3 \|/);
  assert.match(text, /사건 11\(「Continue in Korean」.*\| 1 \| 33\.3% \|/);
  assert.match(text, /사건 10에 닿은 런 중 50\.0%/);
  assert.match(text, /\| 사건 10\(시범 끝\) \| 2 \| 66\.7% \|/);

  const t = readTraffic(rows, now);
  assert.equal(t.english.devices, 3);
  assert.deepEqual(t.english.days[1], { key: t.days[1].key, newDevices: 2, active: 2, began: 2, pastPrologue: 1, finished: 0 });
  assert.deepEqual(t.english.days[2], { key: t.days[2].key, newDevices: 1, active: 1, began: 1, pastPrologue: 1, finished: 0 });
  assert.match(describeTraffic(t), /### 최근 14일, 영어 런만[\s\S]*영어 런을 연 기기 3대/);

  const none = describe(read([{ device: 1, marked: false, new_game_plus: false, cases: through("case01", now - DAY) }], now), { since: "", at: new Date(now * 1000) });
  assert.match(none, /### 영어 런 퍼널[^\n]*\n\n아직 없음/);
});

test("the query takes each row's language out of its summary and nothing else of it", () => {
  assert.match(QUERY, /jsonb_build_array\(s\.case_id, extract\(epoch from s\.completed_at\), s\.summary->>'locale'\)/);
});
