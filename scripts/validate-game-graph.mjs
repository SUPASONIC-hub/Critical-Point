import assert from "node:assert/strict";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  nodeOrders,
  nodes,
  triggerLabels,
} from "../src/gameData.js";

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const orderedNodeIds = new Set(Object.values(nodeOrders).flat());
const failures = [];

for (const caseId of CASE_SEQUENCE) {
  if (!nodeOrders[caseId]?.length) failures.push(`${caseId} is missing from nodeOrders`);
  if (!nodes[CASE_START_NODES[caseId]]) failures.push(`${caseId} start node is missing`);
  if (!CASE_RESULT_NODES[caseId]) failures.push(`${caseId} result node is missing`);
}

for (const [nodeId, node] of Object.entries(nodes)) {
  if (!orderedNodeIds.has(nodeId)) failures.push(`${nodeId} is not listed in any case order`);
  if (!node || typeof node !== "object") {
    failures.push(`${nodeId} is not a scene object`);
    continue;
  }
  if (!node.title) failures.push(`${nodeId} is missing a title`);
  if (!node.text) failures.push(`${nodeId} is missing body text`);
  if (!Array.isArray(node.choices) || node.choices.length === 0) {
    failures.push(`${nodeId} has no choices`);
    continue;
  }
  for (const choice of node.choices) {
    if (!choice.id) failures.push(`${nodeId} has a choice without an id`);
    if (!choice.label) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no label`);
    if (!choice.next) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no next route`);
    if (choice.next && !nodes[choice.next] && !resultNodeIds.has(choice.next)) {
      failures.push(`${nodeId}/${choice.id} routes to missing node ${choice.next}`);
    }
  }
  for (const trigger of node.triggers ?? []) {
    if (!triggerLabels[trigger]) failures.push(`${nodeId} uses unknown trigger ${trigger}`);
  }
}

for (const [caseId, routes] of Object.entries(caseOpeningRoutes)) {
  for (const [outcomeId, nodeId] of Object.entries(routes)) {
    if (!nodes[nodeId]) failures.push(`${caseId}/${outcomeId} routes to missing opening ${nodeId}`);
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log("Game graph checks passed");
