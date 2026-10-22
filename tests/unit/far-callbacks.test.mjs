import assert from "node:assert/strict";
import { test } from "node:test";

import { farCallbacks, resolveFarCallbackLine, withFarCallback } from "../../src/caseCopy.js";
import { caseAftermathNodeId, nodes } from "../../src/gameData.js";
import { getReadingSeconds } from "../../src/gauntlet/gauntletEngine.js";

/**
 * Far callbacks (src/caseCopy.js): a late scene that says one line about the
 * outcome card of a case played long before, read off the save's caseResults.
 * What is tested: each card gets its own line, a missing record gets the
 * fallback, and the line lands inside the scene's text where the reading
 * clock counts it.
 */
const results = (caseId, outcomeChoiceId) => ({ [caseId]: { outcomeChoiceId, outcomeNodeId: caseAftermathNodeId(caseId) } });

for (const [nodeId, callback] of Object.entries(farCallbacks)) {
  test(`${nodeId}: the anchor is in the scene's text once`, () => {
    const text = nodes[nodeId]?.text ?? "";
    assert.equal(text.split(callback.after).length - 1, 1, `${nodeId} must hold "${callback.after}" exactly once`);
  });

  test(`${nodeId}: every card the line names is an outcome card of ${callback.fromCase}`, () => {
    const outcomeIds = new Set(nodes[caseAftermathNodeId(callback.fromCase)]?.choices?.map((choice) => choice.id) ?? []);
    assert.ok(outcomeIds.size > 0, `${callback.fromCase} has an aftermath`);
    for (const choiceId of Object.keys(callback.lines)) assert.ok(outcomeIds.has(choiceId), `${choiceId} is not an outcome card of ${callback.fromCase}`);
    for (const choiceId of outcomeIds) assert.ok(callback.lines[choiceId], `${choiceId} has no line`);
  });

  test(`${nodeId}: each card gets a different line, and none is the fallback`, () => {
    const lines = Object.keys(callback.lines).map((choiceId) => resolveFarCallbackLine(callback, results(callback.fromCase, choiceId)));
    assert.equal(new Set(lines).size, lines.length);
    assert.ok(!lines.includes(callback.fallback));
  });

  test(`${nodeId}: no record, or a card the table does not name, gets the fallback`, () => {
    for (const caseResults of [undefined, {}, { [callback.fromCase]: {} }, results(callback.fromCase, "reframe"), results("case01", Object.keys(callback.lines)[0])]) {
      assert.equal(resolveFarCallbackLine(callback, caseResults), callback.fallback);
    }
  });

  test(`${nodeId}: the line is printed right after the anchor and counted by the reading clock`, () => {
    const scene = nodes[nodeId];
    for (const choiceId of [...Object.keys(callback.lines), null]) {
      const caseResults = choiceId ? results(callback.fromCase, choiceId) : {};
      const line = choiceId ? callback.lines[choiceId] : callback.fallback;
      const read = withFarCallback(nodeId, scene, caseResults);
      assert.notEqual(read, scene, "the graph's own scene is not changed");
      assert.ok(read.text.includes(`${callback.after} ${line}`));
      assert.equal(read.text.length, scene.text.length + line.length + 1);
      assert.ok(getReadingSeconds(read) >= getReadingSeconds(scene));
      assert.equal(withFarCallback(nodeId, scene, caseResults), read, "one object per line, so memos hold");
    }
    assert.ok(!scene.text.includes(callback.fallback), "the graph text stays as written");
  });
}

test("a scene with no far callback comes back as the graph's own object", () => {
  const scene = nodes.c48_start;
  assert.equal(withFarCallback("c48_start", scene, results("prologue01", "p1_after_record")), scene);
});
