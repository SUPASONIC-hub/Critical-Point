import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_RESULT_NODES, CASE_START_NODES, nodes } from "../../src/gameData.js";
import { CASE_PACKS } from "../../src/nodes/casePacks.js";

/**
 * `validate-game-graph.mjs` checks the season when it is imported, so each rule
 * is proved the way the audit of 2026-10-07 found it missing: break the graph
 * in memory, import the script again, and read what it says. The graph is put
 * back before the next probe.
 */
let probes = 0;
async function graphCheckAfter(breakIt) {
  const restore = breakIt();
  try {
    await import(`../../scripts/validate-game-graph.mjs?probe=${(probes += 1)}`);
    return "";
  } catch (error) {
    return String(error.message);
  } finally {
    restore();
  }
}

/** Set `owner[key]` and hand back the way to undo it. */
function swap(owner, key, value) {
  const had = Object.hasOwn(owner, key);
  const before = owner[key];
  if (value === undefined) delete owner[key];
  else owner[key] = value;
  return () => {
    if (had) owner[key] = before;
    else delete owner[key];
  };
}

const cardOf = (nodeId, choiceId) => nodes[nodeId].choices.find((choice) => choice.id === choiceId);
const pack = (caseId) => CASE_PACKS.find((entry) => entry.id === caseId);

test("the graph as it stands passes, so every failure below is the probe's", async () => {
  assert.equal(await graphCheckAfter(() => () => {}), "");
});

test("a card may not close its case on another case's result", async () => {
  const said = await graphCheckAfter(() => swap(cardOf("c13_studio", "c13_studio_basis"), "next", CASE_RESULT_NODES.case12));
  assert.match(said, /c13_studio\/c13_studio_basis routes to case12_result, the result of another case/);
});

test("a card may not lead back to a scene that reaches it", async () => {
  const closing = Object.values(nodes).find((node) => node.caseId === "case13" && node.choices.some((choice) => choice.next === CASE_RESULT_NODES.case13 && choice.type !== "reframe"));
  const card = closing.choices.find((choice) => choice.next === CASE_RESULT_NODES.case13 && choice.type !== "reframe");
  const said = await graphCheckAfter(() => swap(card, "next", CASE_START_NODES.case13));
  assert.match(said, new RegExp(`${card.id} leads to ${CASE_START_NODES.case13}, which can come back to`));
});

test("two scenes of one case may not deal a card under the same id", async () => {
  const other = Object.entries(nodes).find(([nodeId, node]) => node.caseId === "case13" && nodeId !== "c13_studio" && nodeId !== CASE_START_NODES.case13);
  const card = other[1].choices.find((choice) => choice.type !== "reframe");
  const said = await graphCheckAfter(() => swap(card, "id", "c13_studio_basis"));
  assert.match(said, /c13_studio_basis reuses the id of a card c13_\w+ deals in the same case/);
});

test("an authored card names its way of thinking, within the season's weights", async () => {
  const missing = await graphCheckAfter(() => swap(cardOf("c13_studio", "c13_studio_basis"), "cognition", undefined));
  assert.match(missing, /c13_studio\/c13_studio_basis names no way of thinking/);
  const heavy = await graphCheckAfter(() => swap(cardOf("c13_studio", "c13_studio_basis"), "cognition", { reframing: 40 }));
  assert.match(heavy, /c13_studio_basis names its way of thinking as \{"reframing":40\}/);
});

test("a side door opens on a condition the season knows", async () => {
  const plan = pack("case04").branchPlan;
  const inPlan = await graphCheckAfter(() => swap(plan, 4, "costAlredyPaid"));
  assert.match(inPlan, /pack case04: branchPlan opens the side door on "costAlredyPaid"/);
  const door = Object.values(nodes).flatMap((node) => node.choices).find((choice) => choice.branchCondition === "ruleNotYetClosed");
  const inGraph = await graphCheckAfter(() => swap(door, "branchCondition", "ruleNotClosed"));
  assert.match(inGraph, /opens its side door on "ruleNotClosed"/);
});
