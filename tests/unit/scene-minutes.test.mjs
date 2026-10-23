import assert from "node:assert/strict";
import { test } from "node:test";

import { RESULT_NODE_IDS } from "../../src/gameCases.js";
import { CASE_SEQUENCE, nodeOrders, nodes } from "../../src/gameData.js";
import { getBlackoutSkip, getSceneMinutes } from "../../src/state/caseRoutes.js";

/**
 * A bust plays the next scene without the analyst. The minutes are how that
 * scene is still read: in the reveal, and in the report from the id the bust's
 * log entry already holds.
 */
const context = { resources: {}, previousOutcomeChoiceId: undefined };

test("the minutes of a scene are its own title, text and question, with when, where and who", () => {
  const scene = nodes.p2_site;
  const minutes = getSceneMinutes("p2_site");
  assert.equal(minutes.title, scene.title);
  assert.equal(minutes.text, scene.text);
  assert.equal(minutes.question, scene.question);
  assert.equal(minutes.lead, scene.lead ?? "");
  assert.equal(minutes.heading, [scene.clock, scene.place, scene.speaker].filter(Boolean).join(" · "));
  assert.ok(minutes.heading.includes(scene.speaker), "who spoke");
  assert.deepEqual(Object.keys(minutes).sort(), ["heading", "lead", "question", "text", "title"], "no card, no effect: nothing was played");
});

test("an id the graph does not have has no minutes, and neither does no id", () => {
  assert.equal(getSceneMinutes("a_scene_an_older_graph_had"), null);
  assert.equal(getSceneMinutes(undefined), null);
  assert.equal(getSceneMinutes(null), null);
  assert.equal(getSceneMinutes(""), null);
});

test("every scene a bust can skip has minutes to read, with a title and a question", () => {
  let skippable = 0;
  for (const caseId of CASE_SEQUENCE) {
    for (const nodeId of nodeOrders[caseId] ?? []) {
      if (RESULT_NODE_IDS.has(nodeId)) continue;
      const skip = getBlackoutSkip(nodeId, context);
      if (!skip) continue;
      skippable += 1;
      const minutes = getSceneMinutes(skip.skippedNodeId);
      assert.ok(minutes, `${nodeId} has minutes`);
      assert.equal(minutes.title, skip.skippedTitle, `${nodeId}: the title the reveal names`);
      // B-13: the reveal says where the scene went on, not always 회의실.
      assert.ok(skip.skippedPlace && skip.skippedPlace === nodes[nodeId].place, `${nodeId}: the place the reveal names`);
      assert.ok(minutes.text.length > 0, `${nodeId} has text`);
      assert.ok(minutes.question.length > 0, `${nodeId} has a question`);
      assert.ok(!minutes.heading.startsWith(" · ") && !minutes.heading.endsWith(" · "), `${nodeId}: no empty part in the heading`);
    }
  }
  assert.ok(skippable >= CASE_SEQUENCE.length, "every case has a scene a bust can skip");
});
