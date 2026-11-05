import assert from "node:assert/strict";
import { test } from "node:test";

import { nodes } from "../../src/gameData.js";
import { MOODS, SCENE_MOODS, sceneMood } from "../../src/sceneMoods.js";
import { findMoodFailures } from "../../scripts/check-mood.mjs";
import { capCaseShare, parseReview, renderReview, renderSceneMoods, scoreScene } from "../../scripts/tag-mood.mjs";

test("MOODS is the design's five, neutral first", () => {
  assert.deepEqual(MOODS, ["neutral", "bright", "tense", "dread", "sorrow"]);
});

test("every tagged scene is in the graph, with a non-neutral mood from the list", () => {
  for (const [id, mood] of Object.entries(SCENE_MOODS)) {
    assert.ok(nodes[id], `${id} is not a scene`);
    assert.ok(MOODS.includes(mood) && mood !== "neutral", `${id}: ${mood}`);
  }
  assert.deepEqual(findMoodFailures(), []);
});

test("sceneMood answers neutral for an untagged or unknown scene", () => {
  assert.equal(sceneMood("no_such_scene"), "neutral");
  const untagged = Object.keys(nodes).find((id) => !(id in SCENE_MOODS));
  assert.equal(sceneMood(untagged), "neutral");
  const [tagged, mood] = Object.entries(SCENE_MOODS)[0];
  assert.equal(sceneMood(tagged), mood);
});

test("the check goes red on an unknown id, an unknown value, a written neutral and a case over the cap", () => {
  const graph = { a_1: {}, a_2: {}, a_3: {}, a_4: {} };
  const orders = { case01: ["a_1", "a_2", "a_3", "a_4"] };
  const failures = findMoodFailures({ moods: { a_1: "tense", a_2: "tense", a_3: "tense", a_4: "neutral", ghost: "calm" }, graph, orders });
  assert.ok(failures.some((line) => line.startsWith("ghost: not a scene")));
  assert.ok(failures.some((line) => line.includes('unknown mood "calm"')));
  assert.ok(failures.some((line) => line.startsWith("a_4: neutral is omitted")));
  assert.ok(failures.some((line) => line.includes("3 of 4 scenes are tense")));
  assert.deepEqual(findMoodFailures({ moods: { a_1: "tense", a_2: "sorrow" }, graph, orders }), []);
});

test("the generated file omits neutral and sorts by id", () => {
  const source = renderSceneMoods({ z_1: "tense", a_1: "neutral", m_1: "sorrow" });
  assert.match(source, /"m_1": "sorrow",\n {2}"z_1": "tense",/);
  assert.ok(!source.includes("a_1"));
  assert.ok(source.includes('export const sceneMood = (id) => SCENE_MOODS[id] ?? "neutral";'));
});

test("a scene's words score it, and a verb ending does not", () => {
  const scene = (text) => ({ title: "t", text, memo: [], choices: [], phase: "X" });
  const lines = { voice: {}, echo: {} };
  assert.equal(scoreScene("x_1", scene("빈소에 조문객이 늘어서고 영정 앞에서 눈물을 닦는다."), lines).mood, "sorrow");
  assert.equal(scoreScene("x_1", scene("그 돈은 급여였을 겁니다. 불출석 사유서를 냈습니다. 핏스코어 41점."), lines).mood, "neutral");
  assert.equal(scoreScene("x_1", scene("농담에 다들 웃음을 터뜨리고 케이크를 자른다. 고맙습니다."), lines).mood, "bright");
});

test("the case cap sends the weakest scenes of an over-full mood back to neutral", () => {
  const row = (nodeId, tense) => ({ nodeId, mood: "tense", scores: { bright: 0, tense, dread: 0, sorrow: 0 }, reasons: [] });
  const rows = capCaseShare([row("a", 9), row("b", 8), row("c", 5), row("d", 4)]);
  assert.deepEqual(
    rows.map((item) => item.mood),
    ["tense", "tense", "neutral", "neutral"],
  );
  assert.deepEqual(rows[3].reasons, ["cap70:tense"]);
});

test("a review table's 검토 column reads back, blanks left out", () => {
  const rows = [
    { nodeId: "a_1", node: { title: "제목", text: "본문 | 세로줄" }, reasons: ["pressure"], mood: "tense", review: "" },
    { nodeId: "a_2", node: { title: "둘", text: "본문" }, reasons: [], mood: "neutral", review: "sorrow" },
  ];
  const review = parseReview(renderReview("case01", rows));
  assert.deepEqual(review, { a_2: "sorrow" });
});
