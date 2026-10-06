import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_RESULT_NODES, CASE_SEQUENCE, nodeOrders, nodes } from "../../src/gameData.js";
import { getLeadChoice, getOutcomeChoiceId, getUnattendedNext } from "../../src/gameLogic.js";

/**
 * The runtime's own two cards (the adaptive reframe, the relationship bridge)
 * and the scene a bust skips all go where a scene's lead card goes. What a
 * case records, and where the room goes without the player, has to be read
 * off that same card -- not off whichever card the shuffled deal put first.
 */
const scene = (choices, leadChoiceId) => ({ choices, leadChoiceId });

test("the lead card is the one the scene names, wherever the deal put it", () => {
  const cards = [{ id: "reframe", type: "reframe", next: "x" }, { id: "second", next: "b" }, { id: "first", next: "a" }];
  assert.equal(getLeadChoice(scene(cards, "first")).id, "first");
  assert.equal(getLeadChoice(scene(cards, undefined)).id, "second", "no lead named: the first card dealt, never 판을 다시 짠다");
  assert.equal(getLeadChoice(scene([], "first")), null);
  assert.equal(getLeadChoice(null), null);
});

test("a case closed by a runtime card records the lead card it followed", () => {
  const closing = scene([{ id: "c_after_silence", next: "result" }, { id: "c_after_people", next: "result" }], "c_after_people");
  assert.equal(getOutcomeChoiceId("case01_relationship_bridge", closing), "c_after_people");
  assert.equal(getOutcomeChoiceId("case01_adaptive_reframe", closing), "c_after_people");
  assert.equal(getOutcomeChoiceId("c_after_silence", closing), "c_after_silence", "an authored card records itself");
  assert.equal(getOutcomeChoiceId("case01_relationship_bridge", null), "case01_relationship_bridge");
});

test("on every closing scene of the season the stand-in is the lead card", () => {
  let closingScenes = 0;
  for (const caseId of CASE_SEQUENCE) {
    for (const nodeId of nodeOrders[caseId] ?? []) {
      const lead = getLeadChoice(nodes[nodeId]);
      if (!lead || lead.next !== CASE_RESULT_NODES[caseId]) continue;
      closingScenes += 1;
      assert.equal(getOutcomeChoiceId(`${caseId}_relationship_bridge`, nodes[nodeId]), nodes[nodeId].leadChoiceId, nodeId);
    }
  }
  assert.ok(closingScenes >= CASE_SEQUENCE.length, "every case has a closing scene");
});

test("a skipped scene goes where its lead card goes, and through that card's gate", () => {
  const fork = scene(
    [
      { id: "detour", next: "side", branchCondition: "ruleNotYetClosed", branchBypass: "main" },
      { id: "straight", next: "main" },
    ],
    "straight",
  );
  assert.equal(getUnattendedNext(fork), "main", "not the first card dealt");

  const gated = scene(fork.choices, "detour");
  assert.equal(getUnattendedNext(gated, { previousOutcomeChoiceId: "c4_after_trust" }), "side", "the gate is open on this run");
  assert.equal(getUnattendedNext(gated, { previousOutcomeChoiceId: "c4_after_rule" }), "main", "the gate is shut: the bypass");
  assert.equal(getUnattendedNext(scene([], undefined)), null);
});
