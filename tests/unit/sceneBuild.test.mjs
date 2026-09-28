import assert from "node:assert/strict";
import { test } from "node:test";

import { authoredNodeOrders, CASE_SEQUENCE, CASE_START_NODES } from "../../src/gameCases.js";
import { fallbackCopy, nodeOrders, nodes } from "../../src/gameData.js";
import { CASE_PACKS } from "../../src/nodes/casePacks.js";
import { finishSceneGraph } from "../../src/nodes/sceneBuild.js";
import { getScenePlate } from "../../src/scenePlate.js";
import { getRouteMarker } from "../../src/state/savedState.js";

const KINDS = new Set(["briefing", "opening", "scene", "connective", "reaction", "branch", "route", "routeFinal", "evidence", "decision", "aftermath"]);

test("every scene knows its case, its kind and whether it is a pressure beat", () => {
  for (const [nodeId, node] of Object.entries(nodes)) {
    assert.ok(CASE_SEQUENCE.includes(node.caseId), `${nodeId} has no case`);
    assert.ok(nodeOrders[node.caseId].includes(nodeId), `${nodeId} is not in the order of ${node.caseId}`);
    assert.ok(KINDS.has(node.kind), `${nodeId} is a ${node.kind}`);
    assert.equal(typeof node.pressure, "boolean", `${nodeId} does not say whether it is a pressure beat`);
  }
  for (const caseId of CASE_SEQUENCE) {
    assert.equal(nodes[CASE_START_NODES[caseId]].kind, "briefing");
    const kinds = new Set(nodeOrders[caseId].map((nodeId) => nodes[nodeId].kind));
    for (const kind of ["connective", "reaction", "branch", "route", "routeFinal", "evidence", "aftermath"]) {
      assert.ok(kinds.has(kind), `${caseId} has no ${kind} scene`);
    }
  }
});

test("the chip is copy: renaming it changes neither the plate nor the report's marker", () => {
  const scene = nodes.c30_leaving;
  assert.equal(scene.pressure, true);
  const renamed = { ...scene, phase: "아무 이름" };
  assert.deepEqual(getScenePlate(renamed, "c30_leaving"), getScenePlate(scene, "c30_leaving"));
  assert.equal(getScenePlate(scene, "c30_leaving").accent, "heat");
  assert.equal(getScenePlate(nodes.c30_bookstore, "c30_bookstore").accent, "chip");
  assert.equal(getRouteMarker({ nodeId: "c30_start_warm" }).tone, "branch");
  assert.equal(getRouteMarker({ nodeId: "c30_lunch" }).tone, "evidence");
  assert.equal(getRouteMarker({ nodeId: "c30_lunch_reaction" }).tone, "reaction");
  assert.equal(getRouteMarker({ nodeId: "c30_aftershock" }).tone, "aftermath");
  assert.equal(getRouteMarker({ nodeId: "c30_datalab" }).tone, "decision");
});

test("pressure follows the story from 사건 13 on, not only the decision and its aftermath", () => {
  const late = CASE_SEQUENCE.slice(CASE_SEQUENCE.indexOf("case13"), -1);
  const withBeat = late.filter((caseId) => {
    const middle = authoredNodeOrders[caseId].slice(1, -1).filter((nodeId) => nodes[nodeId].pressure);
    assert.ok(middle.length <= 2, `${caseId} draws all three of its middle scenes hot, which is no contrast`);
    return middle.length >= 1;
  });
  // A few cases are quiet on purpose -- a guesthouse in 제주, a 추석 at the market.
  assert.ok(withBeat.length >= late.length - 5, `only ${withBeat.length} of ${late.length} late cases have a pressure beat before their decision`);
});

test("a scene nobody marked is an ordinary scene of its case", () => {
  const graph = { x_start: { choices: [] }, x_quiet: { choices: [] } };
  finishSceneGraph(graph, { prologue01: ["x_start", "x_quiet"] });
  assert.equal(graph.x_quiet.pressure, false);
  assert.equal(graph.x_quiet.caseId, "prologue01");
  assert.equal(graph.x_quiet.kind, "scene");
});

test("the deal is a shuffle of the scene's own cards, and the fixed slots stay put", () => {
  const byId = new Map(CASE_PACKS.flatMap((pack) => Object.entries(pack.nodes)));
  let moved = 0;
  for (const [nodeId, authored] of byId) {
    const dealt = nodes[nodeId].choices;
    const cards = (choices) => choices.filter((choice) => choice.type !== "reframe" && !choice.id.endsWith("_evidence_turn")).map((choice) => choice.id);
    assert.deepEqual([...cards(dealt)].sort(), [...cards(authored.choices)].sort(), `${nodeId} does not deal the cards it was written`);
    if (cards(dealt).join() !== cards(authored.choices).join()) moved += 1;
    const reframeAt = dealt.findIndex((choice) => choice.type === "reframe");
    assert.equal(reframeAt, authored.choices.findIndex((choice) => choice.type === "reframe"), `${nodeId} moved 판을 다시 짠다`);
    const turnAt = dealt.findIndex((choice) => choice.id.endsWith("_evidence_turn"));
    if (turnAt >= 0) assert.equal(turnAt, dealt.length - 1, `${nodeId} moved the evidence turn`);
  }
  assert.ok(moved > byId.size / 2, `only ${moved} of ${byId.size} authored scenes deal in a new order`);
});

test("the same scene always deals the same way", () => {
  const build = () => {
    const graph = {
      x_start: { choices: ["a", "b", "c", "d"].map((id) => ({ id, next: "x_next" })).concat([{ id: "reframe", type: "reframe" }, { id: "x_start_evidence_turn" }]) },
      x_next: { choices: [{ id: "only" }] },
    };
    finishSceneGraph(graph, { prologue01: ["x_start", "x_next"] });
    return graph.x_start.choices.map((choice) => choice.id);
  };
  const first = build();
  assert.deepEqual(build(), first);
  assert.deepEqual(first.slice(4), ["reframe", "x_start_evidence_turn"]);
  assert.deepEqual([...first.slice(0, 4)].sort(), ["a", "b", "c", "d"]);
});

test("the shell's copy of the orders stays as authored", () => {
  for (const caseId of CASE_SEQUENCE) {
    assert.ok(authoredNodeOrders[caseId].length <= 5, `${caseId}'s authored order was grown to ${authoredNodeOrders[caseId].length}`);
    assert.ok(nodeOrders[caseId].length > authoredNodeOrders[caseId].length);
    assert.equal(authoredNodeOrders[caseId][0], CASE_START_NODES[caseId]);
  }
  assert.ok(!Object.values(nodeOrders).flat().some((nodeId) => ["final", "c2_final", "c3_final", "c4_final", "c5_final"].includes(nodeId)));
});

test("fallback copy is counted, and a written closing scene is used", () => {
  assert.equal(fallbackCopy.scenes.length, new Set(fallbackCopy.scenes).size);
  for (const nodeId of fallbackCopy.scenes) assert.equal(nodes[nodeId].title, "준비된 결말 밖에서");
  for (const pack of CASE_PACKS) {
    const { final, finalTitle, finalText, finalMemo } = pack.routePlan.system;
    const written = Boolean(finalTitle && finalText && finalMemo?.length);
    assert.equal(fallbackCopy.scenes.includes(final), !written, `${final} is ${written ? "written" : "not written"} and the report says otherwise`);
    if (written) {
      assert.equal(nodes[final].title, finalTitle);
      assert.equal(nodes[final].text, finalText);
      assert.deepEqual(nodes[final].memo, finalMemo);
    }
  }
});
