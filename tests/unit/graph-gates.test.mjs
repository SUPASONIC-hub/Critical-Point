import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_RESULT_NODES, CASE_START_NODES, nodeOrders, nodes } from "../../src/gameData.js";
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

/**
 * `gameData.js` builds the season when it is imported, from the packs as they
 * stand at that moment, so a plan no pack writes yet is proved the same way:
 * change the pack in memory and import the module again. The finale is the
 * fixture because it is the case that needs this: its side door's two scenes
 * are already the middle of the route `f_route_contain` opens.
 */
let builds = 0;
async function seasonBuiltWith(branchPlan) {
  const restore = swap(pack("final"), "branchPlan", branchPlan);
  try {
    return await import(`../../src/gameData.js?build=${(builds += 1)}`);
  } finally {
    restore();
  }
}
const routeOf = (plan, routeId) => [...Object.values(plan?.choices ?? {}), ...(plan ? [plan.system] : [])].find((route) => route.route === routeId);

test("every side door hangs on the card its plan names, and its two scenes follow that scene", () => {
  for (const { id, nodes: authored, routePlan, branchPlan: [sourceId, index, firstId, secondId] } of CASE_PACKS) {
    const written = (authored[sourceId]?.choices ?? routeOf(routePlan, sourceId)?.routeChoices)?.[index];
    assert.ok(written, `${id}: card ${index + 1} of ${sourceId}`);
    const doors = nodes[sourceId].choices.filter((choice) => choice.branchId);
    assert.deepEqual(doors.map((choice) => [choice.id, choice.next, choice.branchId]), [[written.id, firstId, firstId]], id);
    const order = nodeOrders[id];
    assert.deepEqual(order.slice(order.indexOf(sourceId) + 1, order.indexOf(sourceId) + 3), [firstId, secondId], id);
    assert.equal(nodes[firstId].kind, "branch");
    assert.equal(nodes[secondId].kind, "branch");
  }
});

test("a side door can hang on a route scene, which is built after the authored ones", async () => {
  const plan = ["f_route_contain", 2, "f_branch_witness", "f_branch_witness_follow"];
  const built = await seasonBuiltWith(plan);
  const written = pack("final").routePlan.choices.f_start_contain.routeChoices[2];
  const doors = Object.entries(built.nodes).flatMap(([nodeId, node]) => (node.caseId === "final" ? node.choices.filter((choice) => choice.branchId).map((choice) => [nodeId, choice.id, choice.next]) : []));
  assert.deepEqual(doors, [["f_route_contain", written.id, "f_branch_witness"]], "one door, on the route's card, and none left on f_confront");
  assert.equal(built.nodes.f_branch_witness.kind, "branch");
  assert.equal(built.nodes.f_branch_witness_follow.kind, "branch");
  const order = built.nodeOrders.final;
  assert.deepEqual(order.slice(order.indexOf("f_route_contain") + 1, order.indexOf("f_route_contain") + 3), ["f_branch_witness", "f_branch_witness_follow"]);
  assert.deepEqual(new Set(order), new Set(nodeOrders.final), "the case has the scenes it had");
  assert.deepEqual(built.getCaseBranchNodes().find((fork) => fork.caseId === "final").nodeId, "f_route_contain");
  // Every other case is built as it was.
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.caseId !== "final") assert.deepEqual(built.nodes[nodeId], node, nodeId);
  }

  // The graph check reads the season it imported, so it is handed this one:
  // the finale's scenes and order as just built, and the plan that built them.
  const said = await graphCheckAfter(() => {
    const restores = [
      swap(pack("final"), "branchPlan", plan),
      swap(nodeOrders, "final", order),
      ...order.map((nodeId) => swap(nodes, nodeId, built.nodes[nodeId])),
    ];
    return () => restores.reverse().forEach((restore) => restore());
  });
  assert.equal(said, "");
});

test("a side door on a route scene still has to name a scene and a card the routes write", async () => {
  const to = ["f_branch_witness", "f_branch_witness_follow"];
  await assert.rejects(seasonBuiltWith(["f_route_nowhere", 0, ...to]), /final branch plan names the scene "f_route_nowhere", which the graph does not have/);
  // The fourth card of a route is the evidence turn, dealt by the build and not written on the route.
  await assert.rejects(seasonBuiltWith(["f_route_contain", 3, ...to]), /final branch plan puts its detour on card 4 of f_route_contain, which is not a card that scene deals/);
  // The route's body already opens into the detour, so a condition would close nothing.
  await assert.rejects(seasonBuiltWith(["f_route_contain", 0, ...to, "costAlreadyPaid"]), /final branch plan opens its detour on "costAlreadyPaid", but card 1 of f_route_contain leads to f_branch_witness either way/);

  const noScene = await graphCheckAfter(() => swap(pack("final"), "branchPlan", ["f_route_nowhere", 0, ...to]));
  assert.match(noScene, /pack final: branchPlan hangs the side door on card 1 of f_route_nowhere, which is not a card that scene deals/);
  const noCard = await graphCheckAfter(() => swap(pack("final"), "branchPlan", ["f_route_contain", 3, ...to]));
  assert.match(noCard, /pack final: branchPlan hangs the side door on card 4 of f_route_contain, which is not a card that scene deals/);
  assert.equal(await graphCheckAfter(() => swap(pack("final"), "branchPlan", ["f_route_system", 0, ...to])), "", "the hidden route's scene is a route scene too");
});
