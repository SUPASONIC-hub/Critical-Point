import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, testWeekQuery, readTestWeek, describeTestWeek } = await import("../../scripts/report-test-week.mjs");

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
    { run_id: "secret-run-a", case_id: "season-final", device: 1, ranked_week: "2026-W44", log: [] },
    { run_id: "secret-run-b", case_id: "case01", device: 2, vault: 100, log: [{ ...board("cash", 30, 1), assistStory: true }] },
    // Seasons of the week without the rule come back as one bare row each.
    { run_id: "secret-run-c", case_id: "turned-down", device: 2, ending: null, vault: null, log: [] },
    { run_id: "secret-run-d", case_id: "turned-down", device: 3, ending: null, vault: null, log: [] },
  ];
  const t = readTestWeek(rows);
  assert.equal(t.seasons, 2, "a season without the rule is not one of the week's");
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
  assert.match(text, /규칙 없이 친 시즌.*\| 2 \(50\.0%\) \|/);
  assert.match(text, /서로 다른 기기.*\| 2 \/ 2 \/ 3 \|/);
});

test("the query is one read-only statement", () => {
  assert.match(QUERY, /^with runs as \(/);
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|create|grant|truncate)\b|;/i);
  assert.match(QUERY, /'audit-cascade'/);
  assert.match(QUERY, /'2026-W44'/);
  assert.equal(QUERY, testWeekQuery("2026-W44", "audit-cascade"));
});

test("the query sends no device id out of the database, only its rank among the week's", () => {
  const selected = QUERY.slice(QUERY.lastIndexOf("\nselect "));
  assert.doesNotMatch(selected, /session_id|session_code/);
  assert.match(QUERY, /dense_rank\(\) over \(order by r\.session_id\) as device/);
});
