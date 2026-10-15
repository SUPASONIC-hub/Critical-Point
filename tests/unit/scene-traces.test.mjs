import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getSceneTraceLine, readSceneBustRate, SCENE_TRACE_COPY, SCENE_TRACE_FLOOR } from "../../src/sceneTraces.js";

/**
 * The other players' trace on a scene (src/sceneTraces.js): the line it
 * prints, the floor under which it prints nothing, and the answers it does
 * not trust. The shape is `scene_bust_rates()`'s: case, scene, [windows, percent].
 */
const ANSWER = { case01: { start: [64, 31], payday: [49, 80], board: [50, 0] }, case02: { c2_logs: [120, 100] } };

test("a scene with enough windows prints the rate in the fixed words", () => {
  assert.equal(getSceneTraceLine(ANSWER, "case01", "start"), "이 장면에서 다른 분석관의 31%가 벽에 닿았습니다.");
  assert.equal(getSceneTraceLine(ANSWER, "case02", "c2_logs"), SCENE_TRACE_COPY.line(100));
  assert.match(SCENE_TRACE_COPY.line(7), /벽에 닿았습니다\.$/, "the fixed term is 벽에 닿다");
});

test("the floor is the ranking band's, and it is checked on the device as well", () => {
  assert.equal(SCENE_TRACE_FLOOR, 50);
  const logic = readFileSync("src/logicReport.js", "utf8");
  assert.match(logic, /LOGIC_RANK_FLOOR = 50;/, "the two floors are the same number");
  assert.equal(readSceneBustRate(ANSWER, "case01", "payday"), null, "49 windows print nothing");
  assert.deepEqual(readSceneBustRate(ANSWER, "case01", "board"), { windows: 50, percent: 0 }, "50 windows are enough");
});

test("no answer, another scene or an answer out of shape prints nothing", () => {
  for (const data of [null, undefined, [], "x", 3, {}]) assert.equal(getSceneTraceLine(data, "case01", "start"), null);
  assert.equal(getSceneTraceLine(ANSWER, "case03", "start"), null);
  assert.equal(getSceneTraceLine(ANSWER, "case01", "accounting"), null);
  assert.equal(getSceneTraceLine(ANSWER, undefined, "start"), null, "a scene with no case is never looked up");
  for (const pair of [[64], [64, 31, 1], [64.5, 31], [64, 31.5], [64, -1], [64, 101], ["64", "31"], { 0: 64, 1: 31 }]) {
    assert.equal(getSceneTraceLine({ case01: { start: pair } }, "case01", "start"), null, JSON.stringify(pair));
  }
  assert.equal(getSceneTraceLine({ case01: { toString: [64, 31] } }, "case01", "constructor"), null, "only the answer's own keys");
});

test("offline, the line is hidden even with an answer in hand", () => {
  assert.equal(getSceneTraceLine(ANSWER, "case01", "start", false), null);
  assert.ok(getSceneTraceLine(ANSWER, "case01", "start", undefined), "a browser that does not say is taken as online");
});

test("the request carries nothing of the player's", () => {
  const hook = readFileSync("src/state/useSceneBustRates.js", "utf8");
  assert.match(hook, /callSupabaseRpc\("scene_bust_rates"\)/, "no body: the server is told no case, scene, id or score");
  assert.doesNotMatch(hook, /dataConsent|getSessionId|runId/);
});
