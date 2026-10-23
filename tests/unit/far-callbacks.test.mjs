import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { isSavedStateShapeValid, parseCurrentSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { farCallbacks, resolveFarCallbackLine, withFarCallback } from "../../src/farCallbacks.js";
import { caseAftermathNodeId, nodes } from "../../src/gameData.js";
import { getFinalSceneChoiceId } from "../../src/gameLogic.js";
import { getReadingSeconds } from "../../src/gauntlet/gauntletEngine.js";
import { repairSavedState } from "../../src/state/savedState.js";
import { toRowSummary } from "../../src/state/useChoiceCommit.js";
import { viewGroups } from "../../src/viewModels/appViewModels.js";
import { createPlayView } from "../../src/viewModels/playViewModel.js";

/**
 * Far callbacks (src/farCallbacks.js): a late scene that says one line about the
 * outcome card of a case played long before, read off the save's caseResults.
 * What is tested: each card gets its own line, a missing record gets the
 * fallback, and the line lands inside the scene's text where the reading
 * clock counts it.
 */
const results = (caseId, outcomeChoiceId) => ({ [caseId]: { outcomeChoiceId, outcomeNodeId: caseAftermathNodeId(caseId) } });
/** The record a callback reads, holding `choiceId` in the field it reads. */
const recordFor = (callback, choiceId) => (
  callback.field ? { [callback.fromCase]: { [callback.field]: choiceId, outcomeNodeId: caseAftermathNodeId(callback.fromCase) } } : results(callback.fromCase, choiceId)
);

for (const [nodeId, callback] of Object.entries(farCallbacks)) {
  const sourceNodeId = callback.fromScene ?? caseAftermathNodeId(callback.fromCase);
  test(`${nodeId}: the anchor is in the scene's text once`, () => {
    const text = nodes[nodeId]?.text ?? "";
    assert.equal(text.split(callback.after).length - 1, 1, `${nodeId} must hold "${callback.after}" exactly once`);
  });

  test(`${nodeId}: every card the line names is a card of ${sourceNodeId}, and each has a line`, () => {
    const cardIds = new Set(nodes[sourceNodeId]?.choices?.filter((choice) => choice.type !== "reframe").map((choice) => choice.id) ?? []);
    assert.ok(cardIds.size > 0, `${sourceNodeId} deals cards`);
    for (const choiceId of Object.keys(callback.lines)) assert.ok(cardIds.has(choiceId), `${choiceId} is not a card of ${sourceNodeId}`);
    for (const choiceId of cardIds) assert.ok(callback.lines[choiceId], `${choiceId} has no line`);
  });

  test(`${nodeId}: each card gets a different line, and none is the fallback`, () => {
    const lines = Object.keys(callback.lines).map((choiceId) => resolveFarCallbackLine(callback, recordFor(callback, choiceId)));
    assert.equal(new Set(lines).size, lines.length);
    assert.ok(!lines.includes(callback.fallback));
  });

  test(`${nodeId}: no record, or a card the table does not name, gets the fallback`, () => {
    for (const caseResults of [undefined, {}, { [callback.fromCase]: {} }, recordFor(callback, "reframe"), recordFor(callback, 7), { case01: recordFor(callback, Object.keys(callback.lines)[0])[callback.fromCase] }]) {
      assert.equal(resolveFarCallbackLine(callback, caseResults), callback.fallback);
    }
  });

  test(`${nodeId}: the line is printed right after the anchor and counted by the reading clock`, () => {
    const scene = nodes[nodeId];
    for (const choiceId of [...Object.keys(callback.lines), null]) {
      const caseResults = choiceId ? recordFor(callback, choiceId) : {};
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

test("the play view hands the screen the scene with its far callback", () => {
  // Every field the play contract asks for, so the view builds; only the scene matters here.
  const bag = (nodeId) => ({ ...Object.fromEntries(Object.values(viewGroups.play).flat().map((field) => [field, null])), node: nodes[nodeId], resolvedNodeId: nodeId });
  const view = createPlayView(bag("c48_final"), {}, results("prologue01", "p1_after_credit"));
  assert.ok(view.node.text.includes(farCallbacks.c48_final.lines.p1_after_credit));
  assert.ok(!("caseResults" in view), "case results are not part of the view");
  const plain = createPlayView(bag("c48_start"));
  assert.equal(plain.node, nodes.c48_start);
});

/**
 * 사건 15 -> 37 reads `finalChoiceId`, the card of the case's last scene before
 * its outcome, which the case summary keeps (useChoiceCommit) because the log
 * that holds it is cleared when the next case opens.
 */
const entry = (nodeId, choiceId, extra = {}) => ({ caseId: "case15", nodeId, choiceId, ...extra });

test("the last scene's card is the one before the outcome scene", () => {
  const log = [entry("c15_start", "c15_start_compare"), entry("c15_final", "c15_final_respect"), entry("c15_aftershock", "c15_after_warm")];
  assert.equal(getFinalSceneChoiceId(log, "c15_aftershock"), "c15_final_respect");
  // A system event between them is not a scene.
  const withEvent = [log[0], log[1], { nodeId: "gauntlet", choiceId: "x", isSystemEvent: true }, log[2]];
  assert.equal(getFinalSceneChoiceId(withEvent, "c15_aftershock"), "c15_final_respect");
  // The other ways into the outcome scene keep their own card, which reads the fallback.
  assert.equal(getFinalSceneChoiceId([entry("c15_final_system_route", "c15_final_system_route_a"), log[2]], "c15_aftershock"), "c15_final_system_route_a");
  assert.equal(resolveFarCallbackLine(farCallbacks.c37_final, { case15: { finalChoiceId: "c15_final_system_route_a" } }), farCallbacks.c37_final.fallback);
  // A log with only the outcome scene has no last scene.
  assert.equal(getFinalSceneChoiceId([log[2]], "c15_aftershock"), null);
  assert.equal(getFinalSceneChoiceId([], "c15_aftershock"), null);
});

const v4 = JSON.parse(readFileSync(new URL("./fixtures/saves/v4-current.json", import.meta.url), "utf8")).save;
/** `useRuntimeSavedState`'s pipeline (save-fixtures.test.mjs): parse and migrate, repair, validate. */
function loadWithCase15(case15) {
  const save = { ...v4, completedCases: [...(v4.completedCases ?? []), "case15"], caseResults: { ...v4.caseResults, case15 } };
  const parsed = parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION);
  const { state, repaired } = repairSavedState(parsed);
  return { state, repaired, valid: isSavedStateShapeValid(state) };
}
const case15Summary = { outcomeChoiceId: "c15_after_warm", outcomeNodeId: "c15_aftershock", rank: "B" };

test("a save from before the field loads unchanged and 사건 37 reads the fallback", () => {
  const { state, repaired, valid } = loadWithCase15(case15Summary);
  assert.equal(valid, true);
  assert.equal(repaired, false, "an old save is not called repaired for a field it never had");
  assert.ok(!("finalChoiceId" in state.caseResults.case15));
  assert.equal(state.saveSchemaVersion, SAVE_SCHEMA_VERSION, "the save format version stays");
  const scene = withFarCallback("c37_final", nodes.c37_final, state.caseResults);
  assert.ok(scene.text.includes(farCallbacks.c37_final.fallback));
});

test("a save with the field keeps it through a reload, and 사건 37 reads its line", () => {
  const { state, repaired, valid } = loadWithCase15({ ...case15Summary, finalChoiceId: "c15_final_fight" });
  assert.equal(valid, true);
  assert.equal(repaired, false);
  assert.equal(state.caseResults.case15.finalChoiceId, "c15_final_fight");
  const again = repairSavedState(JSON.parse(JSON.stringify(state)));
  assert.equal(again.state.caseResults.case15.finalChoiceId, "c15_final_fight", "a cloud copy round-trips as JSON");
  const scene = withFarCallback("c37_final", nodes.c37_final, state.caseResults);
  assert.ok(scene.text.includes(farCallbacks.c37_final.lines.c15_final_fight));
});

test("a damaged value is dropped, and 사건 37 reads the fallback", () => {
  for (const finalChoiceId of [7, "", null, { id: "c15_final_fight" }]) {
    const { state, valid } = loadWithCase15({ ...case15Summary, finalChoiceId });
    assert.equal(valid, true);
    assert.ok(!("finalChoiceId" in state.caseResults.case15), `${JSON.stringify(finalChoiceId)} is dropped`);
    assert.equal(resolveFarCallbackLine(farCallbacks.c37_final, state.caseResults), farCallbacks.c37_final.fallback);
  }
});

test("the server's case row does not carry the field: the summary keeps the shape it had", () => {
  const row = toRowSummary({ ...case15Summary, finalChoiceId: "c15_final_publish", endingVariant: { id: "quiet", label: "x" } });
  assert.ok(!("finalChoiceId" in row));
  assert.deepEqual(row, { ...case15Summary, endingVariant: "quiet" });
});
