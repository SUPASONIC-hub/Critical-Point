import assert from "node:assert/strict";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  cognitionLabels,
  reframeRouteNodes,
  getContinuityMemoryChoice,
  initialResources,
  nodeOrders,
  nodes,
  triggerLabels,
} from "../src/gameData.js";
import { applyEffect, getAuthorityLevel, getCaseOutcome, getContinuityChallenge, getOutcomeCarryover, getOutcomeChoiceId } from "../src/gameLogic.js";
import { CASE_PACKS as AUTHORED_CASE_PACKS } from "../src/nodes/casePacks.js";
import { case01Nodes } from "../src/nodes/case01.js";
import { case02Nodes } from "../src/nodes/case02.js";
import { case03Nodes } from "../src/nodes/case03.js";
import { case04Nodes } from "../src/nodes/case04.js";
import { case05Nodes } from "../src/nodes/case05.js";
import { case06Nodes } from "../src/nodes/case06.js";
import { case07Nodes } from "../src/nodes/case07.js";
import { case08Nodes } from "../src/nodes/case08.js";
import { case09Nodes } from "../src/nodes/case09.js";
import { case10Nodes } from "../src/nodes/case10.js";
import { case11Nodes } from "../src/nodes/case11.js";
import { finalCaseNodes } from "../src/nodes/finalCase.js";

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
    if (choice.type !== undefined && !["fixed", "reframe"].includes(choice.type)) {
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

/**
 * A scene can pass every check above and still never be played. When the cases
 * were split into route nodes, the start choices were pointed at the new routes
 * and the authored middle of five cases silently fell off the graph -- fifteen
 * written scenes in case 01 alone. Structure checks did not notice, because
 * every orphan was still a valid scene. So walk each case the way a player
 * does and fail on anything the walk cannot reach or cannot leave.
 */
function getCaseEntryNodes(caseId) {
  const entries = [CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})];
  // A first successful free-text answer jumps to the case's hidden route, and
  // a previous case's log can add a memory choice on the opening screen. Both
  // are real ways in, so neither counts as an orphan.
  if (reframeRouteNodes[caseId]) entries.push(reframeRouteNodes[caseId]);
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  for (const previousEntry of [
    { nodeId: "prev_evidence_turn", choiceId: "prev_evidence_turn" },
    { reframeOpenedRoute: true, nodeId: "prev", choiceId: "prev" },
    { nodeId: "prev_route_split", choiceId: "prev" },
  ]) {
    const memoryChoice = getContinuityMemoryChoice({
      caseId,
      nodeId: CASE_START_NODES[caseId],
      log: [{ caseId: previousCaseId, ...previousEntry }],
    });
    if (memoryChoice?.next) entries.push(memoryChoice.next);
  }
  return entries.filter(Boolean);
}

for (const caseId of CASE_SEQUENCE) {
  const resultNodeId = CASE_RESULT_NODES[caseId];
  const reached = new Set();
  const queue = getCaseEntryNodes(caseId);
  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || reached.has(nodeId) || !nodes[nodeId]) continue;
    reached.add(nodeId);
    for (const choice of nodes[nodeId].choices ?? []) queue.push(choice.next);
  }
  for (const nodeId of new Set(nodeOrders[caseId] ?? [])) {
    if (!reached.has(nodeId)) failures.push(`${caseId}/${nodeId} is authored but no route reaches it`);
  }

  // Every reachable scene has to be able to finish the case. A route that only
  // loops back on itself would strand the run with no way to the result screen.
  const closes = new Set();
  for (let changed = true; changed; ) {
    changed = false;
    for (const nodeId of reached) {
      if (closes.has(nodeId)) continue;
      const exits = (nodes[nodeId].choices ?? []).map((choice) => choice.next);
      if (exits.some((next) => next === resultNodeId || closes.has(next))) {
        closes.add(nodeId);
        changed = true;
      }
    }
  }
  for (const nodeId of reached) {
    if (!closes.has(nodeId)) failures.push(`${caseId}/${nodeId} has no path left to ${resultNodeId}`);
  }

  /**
   * A gated choice that no run can open is worse than a missing one: the player
   * is shown the scene it leads to and told what would unlock it. Case 01 spent
   * a day in that state -- a season hands out one record per case, the first
   * record cannot land before the second decision, and no case 01 route reached
   * trust 55 by then, so FIELD ACCESS was unreachable for the whole case.
   *
   * So walk the case on its ungated edges, keep the best trust and legitimacy
   * each scene can be reached with, and pair that with the most records a run
   * could be holding there: one per case already played, plus this case's own
   * once a decision has been made.
   */
  const caseIndex = CASE_SEQUENCE.indexOf(caseId);
  const bestStanding = new Map();
  const walk = [{ nodeId: CASE_START_NODES[caseId], resources: { ...initialResources }, depth: 0 }];
  const openingNodeIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
  for (const nodeId of openingNodeIds) walk.push({ nodeId, resources: { ...initialResources }, depth: 0 });
  while (walk.length > 0) {
    const { nodeId, resources, depth } = walk.shift();
    if (!nodes[nodeId]) continue;
    const standing = bestStanding.get(nodeId);
    if (standing && standing.trust >= resources.trust && standing.legitimacy >= resources.legitimacy && standing.depth <= depth) continue;
    bestStanding.set(nodeId, {
      trust: Math.max(standing?.trust ?? 0, resources.trust),
      legitimacy: Math.max(standing?.legitimacy ?? 0, resources.legitimacy),
      depth: Math.min(standing?.depth ?? Infinity, depth),
    });
    for (const choice of nodes[nodeId].choices ?? []) {
      if (choice.requiredAuthority) continue;
      walk.push({ nodeId: choice.next, resources: applyEffect(resources, choice.effect ?? {}), depth: depth + 1 });
    }
  }
  for (const [nodeId, standing] of bestStanding) {
    const clues = caseIndex + (standing.depth >= 1 ? 1 : 0);
    for (const choice of nodes[nodeId].choices ?? []) {
      if (!choice.requiredAuthority) continue;
      const reachable = getAuthorityLevel({ clueCount: clues, trust: standing.trust, legitimacy: standing.legitimacy, casesOpened: caseIndex + 1 });
      const levels = { OBSERVER: 0, "FIELD ACCESS": 1, OVERSIGHT: 2 };
      if ((levels[reachable] ?? 0) < (levels[choice.requiredAuthority] ?? 99)) {
        failures.push(
          `${caseId}/${nodeId}/${choice.id} asks for ${choice.requiredAuthority}, ` +
            `but the best run reaches it with ${clues} clues, trust ${standing.trust}, legitimacy ${standing.legitimacy}`,
        );
      }
    }
  }
}

/**
 * Every way a case can close has to carry into the next one.
 *
 * A case closes on whichever choice leads to its result node, and that choice's
 * id is the case's outcome: the runtime reads the outcome and the carryover
 * with the case that closed, and the continuity challenge and the opening route
 * with the case that opens next -- `getContinuityChallenge({ caseId: <next
 * case>, choiceId })`. The continuity table was read with the closed case for
 * a while, and every lookup came back empty without anything failing, because
 * a missing challenge is a legal `null`. So the tables are walked here the way
 * the runtime reads them, and an outcome that falls through any of them fails.
 */
const UNRECORDED_OUTCOME = getCaseOutcome({ caseId: "__none__", choiceId: "__none__" }).title;
CASE_SEQUENCE.forEach((caseId, index) => {
  const nextCaseId = CASE_SEQUENCE[index + 1];
  const resultNodeId = CASE_RESULT_NODES[caseId];
  const outcomeIds = new Set(
    (nodeOrders[caseId] ?? [])
      .flatMap((nodeId) => nodes[nodeId]?.choices ?? [])
      .filter((choice) => choice.next === resultNodeId && choice.type !== "reframe")
      .map((choice) => choice.id),
  );
  if (outcomeIds.size === 0) failures.push(`${caseId} has no choice that closes it`);
  for (const choiceId of outcomeIds) {
    if (getCaseOutcome({ caseId, choiceId }).title === UNRECORDED_OUTCOME) failures.push(`${caseId}/${choiceId} closes the case with no outcome written`);
    if (!nextCaseId) continue;
    if (Object.keys(getOutcomeCarryover({ caseId, choiceId })).length === 0) failures.push(`${caseId}/${choiceId} carries nothing into ${nextCaseId}`);
    if (!getContinuityChallenge({ caseId: nextCaseId, choiceId })) failures.push(`${nextCaseId} has no continuity challenge for ${caseId}/${choiceId}`);
  }
  // The runtime's own two choices, 판 공개 기준 and 관계의 증언, go where a
  // scene's first choice goes, so on a closing scene they close the case under
  // ids no table knows. The case records the choice they stand in for, and
  // that has to be one of the outcomes checked above.
  for (const nodeId of nodeOrders[caseId] ?? []) {
    const first = nodes[nodeId]?.choices?.[0];
    if (!first || first.next !== resultNodeId) continue;
    for (const bridge of ["adaptive_reframe", "relationship_bridge"]) {
      const standIn = getOutcomeChoiceId(`${caseId}_${bridge}`, nodes[nodeId]);
      if (!outcomeIds.has(standIn)) failures.push(`${caseId}_${bridge} closes ${caseId} at ${nodeId} as ${standIn}, which is not one of its outcomes`);
    }
  }
  // An opening route keyed on an outcome the previous case cannot produce is a
  // door nobody reaches.
  const previousCaseId = CASE_SEQUENCE[index - 1];
  if (!previousCaseId) return;
  const previousOutcomes = new Set(
    (nodeOrders[previousCaseId] ?? [])
      .flatMap((nodeId) => nodes[nodeId]?.choices ?? [])
      .filter((choice) => choice.next === CASE_RESULT_NODES[previousCaseId])
      .map((choice) => choice.id),
  );
  for (const outcomeId of Object.keys(caseOpeningRoutes[caseId] ?? {})) {
    if (!previousOutcomes.has(outcomeId)) failures.push(`${caseId} opens on ${outcomeId}, which ${previousCaseId} never closes on`);
  }
});

/**
 * A case file says where each choice goes, and the file has to be right.
 *
 * `gameData.js` rewires the graph at load -- a connective, reaction, branch or
 * route scene takes over the choices that led past it -- and until 2026-09-27
 * it did so by overwriting the `next` each file had written: 880 of the 1,488
 * `next:` values in `src/nodes/` pointed somewhere no run ever went. Those are
 * gone, and a choice whose route a generator decides carries no `next` at all.
 * A `next` that is written must be the one the built graph uses. Scenes a route
 * plan retires are skipped: they never enter the graph.
 */
const authoredSources = [
  ...[case01Nodes, case02Nodes, case03Nodes, case04Nodes, case05Nodes, case06Nodes, case07Nodes, case08Nodes, case09Nodes, case10Nodes, case11Nodes, finalCaseNodes]
    .map((table) => ({ owner: "authored", table })),
  ...AUTHORED_CASE_PACKS.flatMap((pack) => [
    { owner: pack.id, table: pack.nodes },
    { owner: pack.id, table: pack.aftermath },
    { owner: pack.id, table: pack.branchScenes },
  ]),
];
for (const { owner, table } of authoredSources) {
  for (const [nodeId, node] of Object.entries(table ?? {})) {
    const built = nodes[nodeId];
    if (!built) continue;
    for (const choice of node.choices ?? []) {
      if (!("next" in choice)) continue;
      const builtChoice = built.choices.find((candidate) => candidate.id === choice.id);
      if (builtChoice && builtChoice.next !== choice.next) {
        failures.push(`${owner}/${nodeId}/${choice.id} is written to go to ${choice.next}, but the built graph sends it to ${builtChoice.next}; drop the dead next`);
      }
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log("Game graph checks passed");
