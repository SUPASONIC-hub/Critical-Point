import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, testWeekQuery, readTestWeek, describeTestWeek, readSimulation, SIMULATION_LINES } = await import("../../scripts/report-test-week.mjs");

// One window of a case's decision log, as useChoiceCommit writes it (the fields the report reads).
const board = (state, gauge, pushes, environmentMode = "stable", burn = 0) => ({
  nodeId: `n${gauge}`, choiceId: "c", environmentMode,
  threshold: { state, busted: state === "bust", gauge, pushes },
  riskRewardEffect: burn ? { trust: -burn } : {},
});

test("the test week's report reads the audit and the links the way the game settles them, and prints no row", () => {
  const quiet = [board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1, "reboot")];
  const nearly = [board("cash", 30, 1), board("cash", 30, 1), board("cash", 30, 1, "cascade"), board("bust", 50, 3), board("cash", 65, 4, "reboot")];
  const heavy = [board("cash", 20, 1, "stable", 9), board("cash", 45, 2, "cascade"), board("cash", 35, 2, "reboot")];
  const rows = [
    { run_id: "secret-run-a", case_id: "case01", device: 1, vault: 900, log: quiet },
    { run_id: "secret-run-a", case_id: "case02", device: 1, vault: 1500, log: nearly },
    { run_id: "secret-run-a", case_id: "final", device: 1, vault: 2000, ending: "collapse", log: heavy },
    { run_id: "secret-run-a", case_id: "season-final", device: 1, ranked_week: "2026-W47", log: [] },
    // A NEW GAME+ season's case rows carry the mark (newGamePlusMark); the CLI's JSON may give it as text.
    { run_id: "secret-run-b", case_id: "case01", device: 2, vault: 100, new_game_plus: "true", log: [{ ...board("cash", 30, 1), assistStory: true }] },
    // Seasons of the week without the rule come back as one bare row each.
    { run_id: "secret-run-c", case_id: "turned-down", device: 2, ending: null, vault: null, log: [] },
    { run_id: "secret-run-d", case_id: "turned-down", device: 3, ending: null, vault: null, log: [] },
  ];
  const t = readTestWeek(rows);
  assert.equal(t.seasons, 2, "a season without the rule is not one of the week's");
  assert.equal(t.newGamePlus, 1, "a season whose rows carry newGamePlus is counted once");
  assert.equal(t.turnedDown, 2);
  assert.equal(t.devicesOn, 2);
  assert.equal(t.devicesOff, 2);
  assert.equal(t.devices, 3, "a device that played with and without the rule is one device");
  assert.equal(t.finished, 1);
  assert.equal(t.ranked, 1);
  assert.equal(t.judged, 3, "a story case is not judged");
  assert.equal(t.caught, 1, "four quiet cashes fill the audit");
  assert.equal(t.nearLimit, 2);
  assert.equal(t.nearLimitClear, 1, "a cash at 65 took the audit back down before the close");
  assert.equal(t.vaultLost, 300, "the caught close moved 900, three parts of the 1,200 it secured");
  assert.equal(t.cascadeBoards, 2, "a board is CASCADE when the entry before it dealt one");
  assert.equal(t.cascadeBusts, 1);
  assert.equal(t.made, 1, "a heavy cash makes a link");
  assert.equal(t.collapse, 1);
  const text = describeTestWeek(t);
  assert.doesNotMatch(text, /secret-run/);
  assert.match(text, /시즌당 적발/);
  assert.match(text, /규칙 없이 친 시즌\(규칙을 끔·첫 시즌 기본 꺼짐.*\| 2 \(50\.0%\) \|/);
  assert.match(text, /그중 NEW GAME\+ 시즌.*\| 1 \(50\.0%\) \|/);
  assert.match(text, /서로 다른 기기.*\| 2 \/ 2 \/ 3 \|/);
});

test("the query is one read-only statement", () => {
  assert.match(QUERY, /^with runs as \(/);
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|create|grant|truncate)\b|;/i);
  assert.match(QUERY, /'audit-cascade'/);
  assert.match(QUERY, /'2026-W47'/);
  assert.equal(QUERY, testWeekQuery("2026-W47", "audit-cascade"));
});

test("the query sends no device id out of the database, only its rank among the week's", () => {
  const selected = QUERY.slice(QUERY.lastIndexOf("\nselect "));
  assert.doesNotMatch(selected, /session_id|session_code/);
  assert.match(selected, /s\.summary->>'newGamePlus' = 'true' as new_game_plus/);
  assert.match(QUERY, /dense_rank\(\) over \(order by r\.session_id\) as device/);
});

test("the workflow and the script read the calendar's test week by default (W47 since 2026-10-22), and only its rows", async () => {
  const { readFileSync } = await import("node:fs");
  const { WEEKLY_RULES } = await import("../../src/gauntlet/weeklyRules.js");
  const tests = WEEKLY_RULES.filter((entry) => entry.id === "audit-cascade").map((entry) => entry.week);
  assert.deepEqual(tests, ["2026-W47"]);
  assert.equal(QUERY, testWeekQuery(tests[0], "audit-cascade"));
  const workflow = readFileSync(new URL("../../.github/workflows/test-week.yml", import.meta.url), "utf8");
  assert.equal([...workflow.matchAll(/\d{4}-W\d{2}/g)].map(([week]) => week).filter((week) => week !== tests[0]).length, 0, "the workflow names no other week");
  // A day outside the week: the query keeps only runs whose first row came in that week, so it reads nothing.
  assert.match(QUERY, /having public\.kst_iso_week\(min\(s\.completed_at\)\) = '2026-W47'/);
  assert.match(describeTestWeek(readTestWeek([])), /시작한 시즌 \/ 사건 행 \| 0 \/ 0/);
});

test("the reference column is the bot with both rules on (check:endings' own lines), not each rule alone", () => {
  assert.deepEqual(readSimulation(SIMULATION_LINES), {
    seasons: 600, collapse: "21.0%", made: "44.15", back: "35.04", cascadeBust: "12.5%", bust: "10.7%",
    caught: "1.31", caughtShare: "10.3%", vaultLost: "0.6%",
  });
  const text = describeTestWeek(readTestWeek([]));
  assert.match(text, /시즌당 적발 \/ 적발이 있었던 시즌 \| — \/ 0 \(—\) \| 1\.31 \/ 10\.3% \(둘 다 켬·면제, 600시즌 봇\) \|/);
  assert.match(text, /금고로 갈 몫의 잃은 비율\(추정\) \| — \| 0\.6% \|/);
  assert.match(text, /CASCADE 판 BUST \(모든 판\) \| — \(—\) \| 12\.5% \(10\.7%\) \|/);
  assert.match(text, /시즌당 만듦 \/ 돌아옴 \| — \/ — \| 44\.15 \/ 35\.04 \|/);
  assert.match(text, /붕괴 결말 \| — \(0\/0\) \| 21\.0% \|/);
  assert.match(text, /감사·연쇄를 함께 켠 시즌 봇입니다/);
  assert.doesNotMatch(text, /따로 켠|1\.75 \/|\| 0\.7% \||20\.7%/);
  // A run with one rule off prints no line for it, and the report says so rather than show a stale figure.
  assert.throws(() => readSimulation(SIMULATION_LINES.split("\n").slice(0, 2).join("\n")), /no audit line/);
});
