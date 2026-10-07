import assert from "node:assert/strict";
import { test } from "node:test";

import { triggerLabels } from "../../src/gameConstants.js";
import { buildLeaderboard, getLeaderboardHeadline } from "../../src/ranking.js";

/**
 * A remote ranking row is whatever someone posted. The ranking screen prints
 * `headline`, `league`, `handle`, `caseTitle`, `runLabel`, the trigger's label,
 * `rank`, `score`, `completedAt`, `averageResponseTime` and `reframeCount` as
 * JSX children, and React throws on an object there -- so every one of them
 * has to be text or a number whatever the row held.
 */
const PRINTED = ["headline", "league", "handle", "caseTitle", "runLabel", "rank", "score", "completedAt", "averageResponseTime", "reframeCount", "position"];

const honest = {
  run_tag: "ABCD1234",
  player_name: "익명 분석관",
  case_id: "season-final",
  case_title: "SEASON 01 COMPLETE",
  completed_at: "2026-09-28T09:00:00.000Z",
  score: 88,
  summary: { burstScore: 88, rank: "A", primary: ["responsibility", 120], averageResponseTime: 12.5, reframeCount: 3, reflectionScore: 60, pressureAdaptScore: 40, cognitionScore: 55, seasonComplete: true },
};

const hostile = [
  { ...honest, run_tag: "OBJECT01", summary: { ...honest.summary, primary: [{ nested: true }, 1] } },
  { ...honest, run_tag: "OBJECT02", summary: { ...honest.summary, primary: { 0: "x" } } },
  { ...honest, run_tag: "OBJECT03", summary: { ...honest.summary, primary: ["<b>아무 글</b>", 1] } },
  { ...honest, run_tag: "OBJECT04", case_title: { toString: "x" }, completed_at: { $date: 1 } },
  { ...honest, run_tag: "OBJECT05", summary: { ...honest.summary, averageResponseTime: { a: 1 }, reframeCount: [3], rank: { S: 1 } } },
  { ...honest, run_tag: "OBJECT06", summary: JSON.stringify([1, 2, 3]), score: 50 },
  { ...honest, run_tag: "OBJECT07", summary: "not json", score: 50 },
  { ...honest, run_tag: { a: 1 }, case_id: ["season-final"], score: 50 },
  { ...honest, run_tag: "OBJECT09", player_name: { a: 1 }, local: "yes" },
  { ...honest, run_tag: "OBJECT10", case_title: "가".repeat(500) },
];

test("an honest row reads as it was written", () => {
  const [entry] = buildLeaderboard([honest]);
  assert.equal(entry.score, 88);
  assert.equal(entry.rank, "A");
  assert.equal(entry.trigger, "responsibility");
  assert.equal(entry.caseTitle, "SEASON 01 COMPLETE");
  assert.equal(entry.seasonComplete, true);
  assert.equal(entry.name, "익명 분석관");
  assert.equal(entry.integrity.valid, true);
});

test("no row can put anything but text or a number where the screen prints", () => {
  const entries = buildLeaderboard(hostile, 50);
  assert.equal(entries.length, hostile.length, "a malformed row is shown as far as it can be, not thrown away or thrown on");
  for (const entry of entries) {
    for (const key of PRINTED) {
      assert.ok(["string", "number"].includes(typeof entry[key]), `${entry.runTag}.${key} is ${JSON.stringify(entry[key])}`);
    }
    assert.ok(Object.hasOwn(triggerLabels, entry.trigger), `${entry.runTag}.trigger is ${JSON.stringify(entry.trigger)}`);
    assert.equal(typeof entry.integrity.label, "string");
    assert.equal(typeof entry.id, "string");
    assert.ok(entry.caseTitle.length <= 80);
  }
  assert.doesNotThrow(() => getLeaderboardHeadline(entries));
});

test("rows that are not rows at all are left out", () => {
  assert.deepEqual(buildLeaderboard([null, undefined, "row", 7, [], {}]), []);
  // No usable score, or one outside the scale.
  assert.deepEqual(buildLeaderboard([{ ...honest, score: null, summary: { rank: "A" } }, { ...honest, score: 101 }, { ...honest, score: "" , summary: {} }]), []);
});

test("a remote row cannot pass itself off as this browser's own", () => {
  const [entry] = buildLeaderboard([{ ...honest, local: "true", player_name: "읽어 보세요" }]);
  assert.equal(entry.isLocal, false);
  assert.equal(entry.name, "익명 분석관");
  assert.notEqual(entry.headline, "읽어 보세요");
});

test("this browser's own row keeps its name", () => {
  const [entry] = buildLeaderboard([{ ...honest, local: true, run_id: "run-local-ABCD1234", player_name: "분석관 김" }]);
  assert.equal(entry.isLocal, true);
  assert.equal(entry.name, "분석관 김");
});

test("a telemetry row names its ending by id, in the form the server's ranking takes", async () => {
  const { ENDING_IDS, getEndingVariant } = await import("../../src/gameLogic.js");
  const { toRowSummary } = await import("../../src/state/useChoiceCommit.js");
  // ranking_public_summary, 20260929050000: a string matching this, or the key is dropped.
  const SERVER_ENDING = /^[a-z][a-z0-9-]{0,39}$/;
  assert.ok(ENDING_IDS.length >= 2);
  for (const id of ENDING_IDS) assert.match(id, SERVER_ENDING);
  const ending = getEndingVariant({});
  assert.equal(typeof ending, "object", "the run keeps the record the report prints");
  const row = toRowSummary({ burstScore: 88, rank: "A", endingVariant: ending });
  assert.equal(row.endingVariant, ending.id);
  assert.ok(ENDING_IDS.includes(row.endingVariant));
  assert.deepEqual([row.burstScore, row.rank], [88, "A"], "the rest of the summary is as it was");
  assert.equal(toRowSummary({ endingVariant: "collapse" }).endingVariant, "collapse");
  assert.equal(toRowSummary({}).endingVariant, null);
});
