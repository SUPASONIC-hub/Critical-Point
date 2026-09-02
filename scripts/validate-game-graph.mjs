import assert from "node:assert/strict";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  triggerLabels,
} from "../src/gameData.js";

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const orderedNodeIds = new Set(Object.values(nodeOrders).flat());
const resourceKeys = new Set(Object.keys(initialResources));
const cognitionKeys = new Set(Object.keys(cognitionLabels));
const failures = [];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkNumberMap(owner, fieldName, value, allowedKeys) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    failures.push(`${owner}.${fieldName} must be an object when present`);
    return;
  }
  for (const [key, effectValue] of Object.entries(value)) {
    if (!allowedKeys.has(key)) failures.push(`${owner}.${fieldName} uses unknown key ${key}`);
    if (!Number.isFinite(effectValue)) failures.push(`${owner}.${fieldName}.${key} must be a finite number`);
  }
}

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
  if (!isNonEmptyString(node.title)) failures.push(`${nodeId} is missing a title`);
  if (!isNonEmptyString(node.text)) failures.push(`${nodeId} is missing body text`);
  if (node.phase !== undefined && !isNonEmptyString(node.phase)) failures.push(`${nodeId}.phase must be a non-empty string`);
  if (node.speaker !== undefined && !isNonEmptyString(node.speaker)) failures.push(`${nodeId}.speaker must be a non-empty string`);
  if (node.memo !== undefined) {
    if (!Array.isArray(node.memo)) failures.push(`${nodeId}.memo must be an array when present`);
    else node.memo.forEach((item, index) => {
      if (!isNonEmptyString(item)) failures.push(`${nodeId}.memo[${index}] must be a non-empty string`);
    });
  }
  if (!Array.isArray(node.choices) || node.choices.length === 0) {
    failures.push(`${nodeId} has no choices`);
    continue;
  }
  const choiceIds = new Set();
  for (const choice of node.choices) {
    if (!isNonEmptyString(choice.id)) failures.push(`${nodeId} has a choice without an id`);
    if (choice.id && choiceIds.has(choice.id)) failures.push(`${nodeId} has duplicate choice id ${choice.id}`);
    if (choice.id) choiceIds.add(choice.id);
    if (!isNonEmptyString(choice.label)) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no label`);
    if (!isNonEmptyString(choice.next)) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no next route`);
    if (choice.next && !nodes[choice.next] && !resultNodeIds.has(choice.next)) {
      failures.push(`${nodeId}/${choice.id} routes to missing node ${choice.next}`);
    }
    if (choice.type !== undefined && !["fixed", "free"].includes(choice.type)) {
      failures.push(`${nodeId}/${choice.id} uses unknown choice type ${choice.type}`);
    }
    checkNumberMap(`${nodeId}/${choice.id ?? "unknown"}`, "effect", choice.effect, resourceKeys);
    checkNumberMap(`${nodeId}/${choice.id ?? "unknown"}`, "cognition", choice.cognition, cognitionKeys);
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
