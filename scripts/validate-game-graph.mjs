import assert from "node:assert/strict";
import fs from "node:fs";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseNodePrefix,
  caseOpeningRoutes,
  cognitionLabels,
  echoReplies,
  fallbackCopy,
  reframeRouteNodes,
  getContinuityMemoryChoice,
  initialResources,
  isResourceGain,
  nodeOrders,
  nodes,
  triggerLabels,
} from "../src/gameData.js";
import { characterProfileCollisions, getCharacterProfile } from "../src/gameDialogue.js";
import { branchConditions } from "../src/seasonRules.js";
import { applyEffect, getAuthorityLevel, getCaseOutcome, getContinuityChallenge, getLeadChoice, getOutcomeCarryover, getOutcomeChoiceId, getRouteMemory, REFRAME_COGNITION, REFRAME_EFFECT } from "../src/gameLogic.js";
import { pressureBeats } from "../src/nodes/sceneBuild.js";
import { sceneContext } from "../src/nodes/sceneContext.js";
import { CASE_PACKS as AUTHORED_CASE_PACKS } from "../src/nodes/casePacks.js";

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const orderedNodeIds = new Set(Object.values(nodeOrders).flat());
const resourceKeys = new Set(Object.keys(initialResources));
const cognitionKeys = new Set(Object.keys(cognitionLabels));
const failures = [];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * A card a case writes says how it thinks, and says it in the season's range:
 * one or two ways of thinking, each weighed 1 to 3. `checkNumberMap` lets a
 * missing map through because an effect may be absent; a missing `cognition`
 * is a card the report cannot read, and `{ reframing: 40 }` is one card
 * outweighing a case. The generated cards are held to the narrower rule further
 * down (one way of thinking, reframing at 2 and the rest at 1); a 판을 다시
 * 짠다 card carries none, because the runtime weighs it (REFRAME_COGNITION).
 */
const AUTHORED_COGNITION_MAX_KEYS = 2;
const AUTHORED_COGNITION_MAX_WEIGHT = 3;
function checkAuthoredCognition(owner, cognition) {
  const named = Object.entries(cognition && typeof cognition === "object" && !Array.isArray(cognition) ? cognition : {});
  if (named.length === 0) {
    failures.push(`${owner} names no way of thinking; give it a cognition`);
    return;
  }
  const weighed = named.every(([, weight]) => Number.isInteger(weight) && weight >= 1 && weight <= AUTHORED_COGNITION_MAX_WEIGHT);
  if (named.length > AUTHORED_COGNITION_MAX_KEYS || !weighed) {
    failures.push(`${owner} names its way of thinking as ${JSON.stringify(cognition)}: at most ${AUTHORED_COGNITION_MAX_KEYS} of them, each weighed 1 to ${AUTHORED_COGNITION_MAX_WEIGHT}`);
  }
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

// A card's line and reply are filed under its id for the whole case
// (`choiceVoiceLines[id] = voice`, gameData.js), so two scenes of a case that
// deal the same id answer with whichever was written last. 판을 다시 짠다 is the
// one card every scene shares, under one id, on purpose.
const cardScenes = new Map();

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
    if (choice.id && choice.type !== "reframe") {
      const cardKey = `${node.caseId}:${choice.id}`;
      const dealtBy = cardScenes.get(cardKey);
      if (dealtBy && dealtBy !== nodeId) failures.push(`${nodeId}/${choice.id} reuses the id of a card ${dealtBy} deals in the same case; the later one's line and reply overwrite the earlier`);
      else cardScenes.set(cardKey, nodeId);
    }
    if (!isNonEmptyString(choice.label)) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no label`);
    if (!isNonEmptyString(choice.next)) failures.push(`${nodeId}/${choice.id ?? "unknown"} has no next route`);
    // A result node closes the case it belongs to and no other: the runtime
    // shows the result screen for any case's result id, but records the summary
    // only when it is the current case's (`caseClosed`, useChoiceCommit.js), so
    // a card sent to another case's result ends the run on a case left open.
    if (choice.next && !nodes[choice.next] && choice.next !== CASE_RESULT_NODES[node.caseId]) {
      failures.push(
        resultNodeIds.has(choice.next)
          ? `${nodeId}/${choice.id} routes to ${choice.next}, the result of another case; ${node.caseId} closes on ${CASE_RESULT_NODES[node.caseId]}`
          : `${nodeId}/${choice.id} routes to missing node ${choice.next}`,
      );
    }
    if (nodes[choice.next] && nodes[choice.next].caseId !== node.caseId) {
      failures.push(`${nodeId}/${choice.id} routes to ${choice.next}, a scene of ${nodes[choice.next].caseId}`);
    }
    if (choice.branchCondition !== undefined && !branchConditions[choice.branchCondition]) {
      failures.push(`${nodeId}/${choice.id} opens its side door on "${choice.branchCondition}", a condition seasonRules.js does not have; the door would always be open`);
    }
    if (choice.type !== undefined && !["fixed", "reframe"].includes(choice.type)) {
      failures.push(`${nodeId}/${choice.id} uses unknown choice type ${choice.type}`);
    }
    checkNumberMap(`${nodeId}/${choice.id ?? "unknown"}`, "effect", choice.effect, resourceKeys);
    checkNumberMap(`${nodeId}/${choice.id ?? "unknown"}`, "cognition", choice.cognition, cognitionKeys);
    if (choice.type !== "reframe") checkAuthoredCognition(`${nodeId}/${choice.id ?? "unknown"}`, choice.cognition);
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
const MEMORY_KINDS = ["evidenceTurn", "systemRoute", "routeSplit"];
const onlyMemory = (kind) => Object.fromEntries(MEMORY_KINDS.map((key) => [key, key === kind]));

/**
 * What a case can hand the next one, read the way the runtime reads it: every
 * decision the case offers, put through `getRouteMemory` one at a time.
 *
 * A route split is a walk down a route that is not the hidden one, and only
 * 사건 01-05 and the finale have such routes -- every case since closes on one
 * line. So `routeLabel` and `routeNext` can be reached in the five cases that
 * follow 사건 01-05, and in no other.
 */
const memoryKindsByCase = {};
function walkMemoryKinds(caseId, memoryEntries = []) {
  const kinds = new Set();
  const seen = new Set();
  const queue = [CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})].map((nodeId) => ({ nodeId, log: onlyMemory(null) }));
  while (queue.length > 0) {
    const { nodeId, log } = queue.shift();
    const state = `${nodeId}|${MEMORY_KINDS.map((kind) => Number(log[kind])).join("")}`;
    if (seen.has(state)) continue;
    seen.add(state);
    if (nodeId === CASE_RESULT_NODES[caseId]) {
      // The card the next case deals reads the log in this order.
      const kind = MEMORY_KINDS.find((candidate) => log[candidate]);
      if (kind) kinds.add(kind);
      continue;
    }
    if (!nodes[nodeId]) continue;
    const cards = [...nodes[nodeId].choices, ...memoryEntries.filter((entry) => entry.from.has(nodeId)).map((entry) => entry.card)];
    for (const choice of cards) {
      const reframed = choice.type === "reframe" && Boolean(reframeRouteNodes[caseId]) && nodeId !== reframeRouteNodes[caseId];
      const entry = getRouteMemory([{ nodeId, choiceId: choice.id, reframeOpenedRoute: reframed }]);
      queue.push({
        nodeId: reframed ? reframeRouteNodes[caseId] : choice.next,
        log: Object.fromEntries(MEMORY_KINDS.map((kind) => [kind, log[kind] || entry[kind]])),
      });
    }
  }
  return kinds;
}

/**
 * The card a case's opening deals because of what the previous case did.
 *
 * This asked `getContinuityMemoryChoice` with a `log`, which the function
 * stopped reading when it moved to the case summaries: every call came back
 * null, a null is a legal answer, and no memory card's target was checked from
 * that day on. It is asked with `caseResults` now, once per kind of memory,
 * and the count of cards it actually read is asserted below.
 */
const memoryCards = [];
const unreachableMemoryFields = [];
function getMemoryCards(caseId) {
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  if (!previousCaseId) return [];
  return MEMORY_KINDS.flatMap((kind) => {
    const card = getContinuityMemoryChoice({
      caseId,
      nodeId: CASE_START_NODES[caseId],
      caseResults: { [previousCaseId]: { routeMemory: onlyMemory(kind) } },
    });
    if (!card) return [];
    return [{ caseId, kind, card, reachable: memoryKindsByCase[previousCaseId].has(kind) }];
  });
}
// In season order, because the memory card a case is dealt is itself a way
// through that case.
for (const caseId of CASE_SEQUENCE) {
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const openings = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
  const dealt = previousCaseId ? getMemoryCards(caseId).filter((entry) => entry.reachable).map((entry) => ({ ...entry, from: openings })) : [];
  memoryKindsByCase[caseId] = walkMemoryKinds(caseId, dealt);
}
for (const caseId of CASE_SEQUENCE) {
  for (const entry of getMemoryCards(caseId)) {
    const { kind, card, reachable } = entry;
    memoryCards.push(entry);
    if (!reachable) unreachableMemoryFields.push(`${caseId}.${kind}`);
    if (!isNonEmptyString(card.label)) failures.push(`${caseId} has a ${kind} memory card with no label`);
    if (!nodes[card.next]) failures.push(`${caseId}'s ${kind} memory card leads to ${card.next}, which the graph does not have`);
    else if (nodes[card.next].caseId !== caseId) failures.push(`${caseId}'s ${kind} memory card leads to ${card.next}, a scene of ${nodes[card.next].caseId}`);
    checkNumberMap(`${caseId}/${card.id}`, "effect", card.effect, resourceKeys);
    checkNumberMap(`${caseId}/${card.id}`, "cognition", card.cognition, cognitionKeys);
  }
}
if (memoryCards.length === 0) failures.push("no memory card was read: getContinuityMemoryChoice answered null for every case");
// A card no run can be dealt is copy nobody reads, and a kind of memory the
// previous case can hand on with no card for it is a card nobody wrote.
for (const field of unreachableMemoryFields) failures.push(`${field}: the previous case never hands this memory on; delete the card's label and next from the plan`);
// 사건 01 deals no memory card: what the 프롤로그 handed on picks which of its
// three openings it starts on (caseOpeningRoutes.case01).
const OPENS_ON_WHAT_WAS_HANDED_ON = new Set(["case01"]);
CASE_SEQUENCE.forEach((caseId, index) => {
  const previousCaseId = CASE_SEQUENCE[index - 1];
  if (!previousCaseId || OPENS_ON_WHAT_WAS_HANDED_ON.has(caseId)) return;
  const written = new Set(getMemoryCards(caseId).map((entry) => entry.kind));
  for (const kind of memoryKindsByCase[previousCaseId]) {
    if (!written.has(kind)) failures.push(`${caseId}: ${previousCaseId} can hand on ${kind}, and the plan deals no card for it`);
  }
});

function getCaseEntryNodes(caseId) {
  const entries = [CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})];
  // 판을 다시 짠다 jumps to the case's hidden route, and what the previous case
  // did can add a memory card on the opening screen. Both are real ways in, so
  // neither counts as an orphan.
  if (reframeRouteNodes[caseId]) entries.push(reframeRouteNodes[caseId]);
  for (const { card, reachable } of getMemoryCards(caseId)) {
    if (reachable) entries.push(card.next);
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

  // A case only moves forward. "Has a path to the result" is still true of a
  // decision scene whose card goes back to the case's first scene, and that
  // card replays the case with its effects charged twice. So no card may lead
  // to a scene that can come back to the card's own.
  const reachFrom = new Map();
  const reachOf = (startId) => {
    if (reachFrom.has(startId)) return reachFrom.get(startId);
    const seen = new Set();
    const pending = [startId];
    while (pending.length > 0) {
      const nodeId = pending.pop();
      if (seen.has(nodeId) || !nodes[nodeId]) continue;
      seen.add(nodeId);
      for (const choice of nodes[nodeId].choices ?? []) pending.push(choice.next);
    }
    reachFrom.set(startId, seen);
    return seen;
  };
  for (const nodeId of reached) {
    for (const choice of nodes[nodeId].choices ?? []) {
      if (nodes[choice.next] && reachOf(choice.next).has(nodeId)) {
        failures.push(`${caseId}/${nodeId}/${choice.id} leads to ${choice.next}, which can come back to ${nodeId}; a case has no way back`);
      }
    }
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
  // scene's lead card goes, so on a closing scene they close the case under
  // ids no table knows. The case records the card they stand in for, which has
  // to be that lead card -- the one whose `next` they were built from -- and
  // one of the outcomes checked above.
  for (const nodeId of nodeOrders[caseId] ?? []) {
    const lead = getLeadChoice(nodes[nodeId]);
    if (!lead || lead.next !== resultNodeId) continue;
    for (const bridge of ["adaptive_reframe", "relationship_bridge"]) {
      const standIn = getOutcomeChoiceId(`${caseId}_${bridge}`, nodes[nodeId]);
      if (standIn !== lead.id) failures.push(`${caseId}_${bridge} closes ${caseId} at ${nodeId} as ${standIn}, but it goes where ${lead.id} goes`);
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
 * A `next` that is written must be the one the built graph uses.
 */
const authoredSources = [
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

/**
 * A scene's context is keyed by the scene's id, and a key that names no scene
 * is copy nobody reads: four entries outlived the scenes they were written for.
 */
for (const nodeId of Object.keys(sceneContext)) {
  if (!nodes[nodeId]) failures.push(`sceneContext.${nodeId} grounds a scene the graph does not have`);
}
for (const nodeId of pressureBeats) {
  if (!nodes[nodeId]) failures.push(`pressureBeats names ${nodeId}, a scene the graph does not have`);
}

/**
 * What a case carries into the next is an effect like any other, and
 * `applyEffect` adds whatever key it is handed: a misspelt resource becomes a
 * seventh resource nothing prints. The scenes' effects are checked above; the
 * carryovers and the card the runtime deals itself are checked here.
 */
checkNumberMap("REFRAME_EFFECT", "effect", REFRAME_EFFECT, resourceKeys);
checkNumberMap("REFRAME_COGNITION", "cognition", REFRAME_COGNITION, cognitionKeys);
for (const caseId of CASE_SEQUENCE) {
  for (const nodeId of new Set(nodeOrders[caseId] ?? [])) {
    for (const choice of nodes[nodeId]?.choices ?? []) {
      if (choice.next !== CASE_RESULT_NODES[caseId]) continue;
      checkNumberMap(`${caseId}/${choice.id}`, "carryover", getOutcomeCarryover({ caseId, choiceId: choice.id }), resourceKeys);
    }
  }
}

/**
 * A continuity challenge is met by a card, so its id has to be one the table
 * knows how to match (`matchesChallenge` in useDecision.js) and the opening it
 * lands on has to deal a card that can meet it. An id nobody matches is a
 * bonus nobody can earn, and the id is a free string in fifty-five tables.
 */
const CHALLENGE_MET_BY = {
  "protect-trust": (choice) => isResourceGain("trust", choice.effect?.trust ?? 0),
  "repair-legitimacy": (choice) => isResourceGain("legitimacy", choice.effect?.legitimacy ?? 0),
  "find-cost": (choice) => Object.entries(choice.effect ?? {}).some(([key, value]) => value !== 0 && !isResourceGain(key, value)),
  "use-reframe": (choice) => choice.type === "reframe",
  // Risk moves against the resources the run arrives with, which no table
  // knows; the id is checked, the card is not.
  "lower-risk": () => true,
  "avoid-risk": () => true,
};
// Openings whose challenge no card on them can meet. Empty since 2026-09-29,
// when 사건 01's two were rewritten for the cards those openings deal; an entry
// that is no longer needed fails, so this list only shrinks.
const UNMEETABLE_CHALLENGES = new Set([]);
const unmeetableFound = new Set();
const decisionSource = fs.readFileSync(new URL("../src/state/useDecision.js", import.meta.url), "utf8");
for (const id of Object.keys(CHALLENGE_MET_BY)) {
  if (!decisionSource.includes(`"${id}"`)) failures.push(`the table no longer matches the challenge id ${id} (useDecision.js)`);
}
let challengesChecked = 0;
CASE_SEQUENCE.forEach((caseId, index) => {
  const previousCaseId = CASE_SEQUENCE[index - 1];
  if (!previousCaseId) return;
  for (const nodeId of new Set(nodeOrders[previousCaseId] ?? [])) {
    for (const closing of nodes[nodeId]?.choices ?? []) {
      if (closing.next !== CASE_RESULT_NODES[previousCaseId] || closing.type === "reframe") continue;
      const challenge = getContinuityChallenge({ caseId, choiceId: closing.id });
      if (!challenge) continue;
      challengesChecked += 1;
      const met = CHALLENGE_MET_BY[challenge.id];
      if (!met) {
        failures.push(`${caseId} answers ${closing.id} with the challenge "${challenge.id}", which no card can meet`);
        continue;
      }
      const openingId = caseOpeningRoutes[caseId]?.[closing.id] ?? CASE_START_NODES[caseId];
      if (!(nodes[openingId]?.choices ?? []).some(met)) {
        unmeetableFound.add(`${caseId}/${openingId}`);
        if (!UNMEETABLE_CHALLENGES.has(`${caseId}/${openingId}`)) failures.push(`${caseId} opens ${openingId} with the challenge "${challenge.id}", and no card there can meet it`);
      }
    }
  }
});
if (challengesChecked === 0) failures.push("no continuity challenge was checked");
for (const known of UNMEETABLE_CHALLENGES) {
  if (!unmeetableFound.has(known)) failures.push(`${known} can meet its challenge now; take it off UNMEETABLE_CHALLENGES`);
}

/**
 * The pack validator: what a case file has to be before it is wired in.
 *
 * A pack is one object with a field per table, and the tables are matched to
 * each other by id. Every pack has the same shape -- five
 * authored scenes, an aftermath, three connective and three reaction scenes, a
 * side door of two, a hidden route and its close, an evidence turn and (after
 * the first case) three openings -- so the shape is checked rather than
 * trusted, and a key two packs both write is a failure rather than whichever
 * one was merged last.
 */
const PACK_KEYS = [
  "id", "nodes", "aftermath", "aftermathRoute", "connectiveScenes", "reactionScenes", "branchPlan", "branchScenes", "routePlan",
  "evidencePlan", "memoryPlan", "openingRoutes", "openingCopy", "openingSignatures",
  "characterProfiles", "setting", "sceneContext", "clue", "outcomes", "carryovers", "continuityChallenges",
];
// `routeBody` is the authored stretch a route walks before its final; only
// 사건 01 and 03-05 route that way. A pack with no one new to introduce writes
// no `characterProfiles`.
// `writtenRoutes` is 사건 02 alone: its routes are scenes, not a plan.
// `openingLines` is what a start card says in one opening alone; most cards
// say the same thing in all of them.
const OPTIONAL_PACK_KEYS = ["characterOverrides", "characterProfiles", "routeBody", "writtenRoutes", "openingLines"];
/**
 * 사건 01-11 were written before the shape below was fixed, into tables the
 * whole season shared. They are packs now, held to everything a pack's tables
 * have to agree on with each other, but not to the scene counts: 사건 01 has
 * four connective scenes and ids with no prefix, 사건 01-05 fork into routes
 * that close on their own finals, and 사건 02 writes its routes out scene by
 * scene (`writtenRoutes`) instead of in a plan.
 */
// The finale is as old as they are and as loose: four authored scenes, two
// connective scenes, and routes that converge on the 33rd floor (`f_confront`)
// and go down from it to `f_choice`.
const EARLY_PACKS = CASE_SEQUENCE.filter((caseId) => /^case(0[1-9]|1[01])$|^final$/.test(caseId));
const PACK_OMISSIONS = {
  case01: ["memoryPlan"], // deals no memory card
  case02: ["routePlan"],
  case06: ["openingSignatures"],
  final: ["carryovers"], // nothing follows it
};
const sameKeys = (left, right) => left.length === right.length && [...left].sort().join() === [...right].sort().join();
const keyOwners = new Map();
function claim(table, key, packId) {
  const owner = keyOwners.get(`${table}:${key}`);
  if (owner) failures.push(`${packId}.${table}.${key} is also written by ${owner}`);
  else keyOwners.set(`${table}:${key}`, packId);
}
// A scene of a case that has no pack is claimed first, so a pack cannot take
// its id. Every case has one now; this holds the door for one that does not.
for (const [nodeId, node] of Object.entries(nodes)) {
  if (!AUTHORED_CASE_PACKS.some((pack) => pack.id === node.caseId)) claim("scene", nodeId, node.caseId);
}

AUTHORED_CASE_PACKS.forEach((pack, packIndex) => {
  const fail = (message) => failures.push(`pack ${pack.id}: ${message}`);
  const keys = Object.keys(pack);
  const early = EARLY_PACKS.includes(pack.id);
  const missing = PACK_KEYS.filter((key) => !keys.includes(key) && !OPTIONAL_PACK_KEYS.includes(key) && !PACK_OMISSIONS[pack.id]?.includes(key));
  const extra = keys.filter((key) => !PACK_KEYS.includes(key) && !OPTIONAL_PACK_KEYS.includes(key));
  if (missing.length) fail(`is missing ${missing.join(", ")}`);
  if (extra.length) fail(`has fields no module reads: ${extra.join(", ")}`);
  if (missing.length) return;
  if (!CASE_SEQUENCE.includes(pack.id)) fail("is not a case of the season");

  const prefix = `${caseNodePrefix(pack.id)}_`;
  const previousPrefix = `${caseNodePrefix(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(pack.id) - 1] ?? "")}_`;
  const hasOpenings = CASE_SEQUENCE.indexOf(pack.id) > 0;
  const connectiveIds = pack.connectiveScenes.map((scene) => scene.id);
  const reactionIds = pack.reactionScenes.map((scene) => scene.id);
  const openingIds = Object.values(pack.openingRoutes);
  const sceneIds = early
    ? Object.keys(nodes).filter((sceneId) => nodes[sceneId].caseId === pack.id)
    : [
        ...Object.keys(pack.nodes), ...Object.keys(pack.aftermath), ...connectiveIds, ...reactionIds, ...Object.keys(pack.branchScenes),
        pack.routePlan.system.route, pack.routePlan.system.final,
        ...Object.values(pack.routePlan.choices).flatMap((route) => [route.route, route.final]),
        pack.evidencePlan.node, ...openingIds,
      ];
  const expectedScenes = hasOpenings ? 20 : 17;
  if (!early) {
    if (sceneIds.length !== expectedScenes) fail(`writes ${sceneIds.length} scenes, not ${expectedScenes}`);
    if (Object.keys(pack.nodes).length !== 5) fail(`authors ${Object.keys(pack.nodes).length} scenes, not 5`);
    if (pack.connectiveScenes.length !== 3 || pack.reactionScenes.length !== 3) fail("does not have three connective and three reaction scenes");
  }
  if (Object.keys(pack.branchScenes).length !== 2) fail("does not have a side door of two scenes");
  if (openingIds.length !== (hasOpenings ? 3 : 0)) fail(`has ${openingIds.length} openings`);
  for (const sceneId of sceneIds) {
    if (!early && !sceneId?.startsWith(prefix)) fail(`the scene ${sceneId} does not carry the case's prefix ${prefix}`);
    else claim("scene", sceneId, pack.id);
    if (nodes[sceneId] && nodes[sceneId].caseId !== pack.id) fail(`the scene ${sceneId} was built into ${nodes[sceneId].caseId}`);
    if (!nodes[sceneId]) fail(`the scene ${sceneId} never reached the graph`);
  }

  // Generated scenes: every choice carries its own label, effect, line and
  // reply, so one cannot be edited out from under the others. Its way of
  // thinking is read from the label (sceneBuild.js) unless the card names one:
  // then it names exactly one, weighed as the reading would weigh it.
  for (const [family, scenes] of [["connectiveScenes", pack.connectiveScenes], ["reactionScenes", pack.reactionScenes]]) {
    for (const scene of scenes) {
      for (const field of ["id", "after", "next", "title", "speaker", "text"]) {
        if (typeof scene[field] !== "string" || !scene[field]) fail(`${family}: ${scene.id ?? "a scene"} has no ${field}`);
      }
      if (!Array.isArray(scene.memo) || !scene.memo.length) fail(`${scene.id} has no memo`);
      if (!sceneIds.includes(scene.after)) fail(`${scene.id} follows ${scene.after}, which the pack does not write`);
      if (!sceneIds.includes(scene.next)) fail(`${scene.id} leads to ${scene.next}, which the pack does not write`);
      if (!Array.isArray(scene.choices) || scene.choices.length < 3) {
        fail(`${scene.id} deals ${scene.choices?.length ?? 0} choices`);
        continue;
      }
      scene.choices.forEach((choice, index) => {
        const extra = Object.keys(choice).filter((key) => !["label", "effect", "voice", "echo", "cognition"].includes(key));
        if (extra.length) fail(`${scene.id} choice ${index + 1} has fields no module reads: ${extra.join(", ")}`);
        if (choice.cognition !== undefined) {
          const named = Object.entries(choice.cognition ?? {});
          const [type, weight] = named[0] ?? [];
          if (named.length !== 1 || !cognitionKeys.has(type) || weight !== (type === "reframing" ? 2 : 1)) {
            fail(`${scene.id} choice ${index + 1} names its way of thinking as ${JSON.stringify(choice.cognition)}: one of ${[...cognitionKeys].join(", ")}, reframing at 2 and the rest at 1`);
          }
        }
        for (const field of ["label", "voice", "echo"]) {
          if (typeof choice[field] !== "string" || !choice[field]) fail(`${scene.id} choice ${index + 1} has no ${field}`);
        }
        const effectKeys = Object.keys(choice.effect ?? {});
        if (!effectKeys.length || effectKeys.some((key) => !resourceKeys.has(key))) fail(`${scene.id} choice ${index + 1} has no effect on the run's resources`);
      });
    }
  }
  const reactionSources = pack.reactionScenes.map((scene) => scene.after);
  if (!sameKeys(reactionSources, connectiveIds)) fail("the reaction scenes do not follow the connective scenes one for one");

  // The side door: the card it hangs on has to be one the scene deals.
  const [branchSource, branchIndex, branchFirst, branchSecond, branchCondition, ...branchRest] = pack.branchPlan;
  // The fifth entry is the condition the door opens on. `getBranchDetourBypass`
  // answers "no bypass" for an id it does not know, so a misspelt condition is
  // a door that is always open, and nothing printed says so.
  if (branchCondition !== undefined && !branchConditions[branchCondition]) {
    fail(`branchPlan opens the side door on "${branchCondition}", which is not one of ${Object.keys(branchConditions).join(", ")}`);
  }
  if (branchRest.length) fail(`branchPlan has entries no module reads: ${JSON.stringify(branchRest)}`);
  // The door may hang on a route scene instead of an authored one (gameData.js
  // hangs it once the routes are built); its cards are the ones its plan writes.
  const branchRoute = (pack.routePlan ? [...Object.values(pack.routePlan.choices), pack.routePlan.system] : []).find((route) => route.route === branchSource);
  const branchCard = (pack.nodes[branchSource]?.choices ?? branchRoute?.routeChoices)?.[branchIndex];
  if (!branchCard || branchCard.type === "reframe") fail(`branchPlan hangs the side door on card ${branchIndex + 1} of ${branchSource}, which is not a card that scene deals`);
  if (!sameKeys(Object.keys(pack.branchScenes), [branchFirst, branchSecond])) fail("branchPlan and branchScenes name different scenes");

  // Openings are keyed on how the previous case closed.
  if (!sameKeys(Object.keys(pack.openingCopy), openingIds)) fail("openingCopy is not keyed by the openings");
  if (pack.openingSignatures && !sameKeys(Object.keys(pack.openingSignatures), openingIds)) fail("openingSignatures is not keyed by the openings");
  if (!sameKeys(Object.keys(pack.continuityChallenges), Object.keys(pack.openingRoutes)) && hasOpenings) fail("continuityChallenges and openingRoutes are keyed on different outcomes");
  for (const outcomeId of Object.keys(pack.openingRoutes)) {
    if (!outcomeId.startsWith(previousPrefix)) fail(`the opening for ${outcomeId} is not keyed on the previous case`);
  }

  // How the case closes.
  const closingIds = Object.values(pack.aftermath).flatMap((scene) => scene.choices.map((choice) => choice.id));
  if (!sameKeys(Object.keys(pack.outcomes), closingIds)) fail("outcomes is not keyed by the aftermath's choices");
  if (pack.carryovers && !sameKeys(Object.keys(pack.carryovers), closingIds)) fail("carryovers is not keyed by the aftermath's choices");
  for (const [outcomeId, carryover] of Object.entries(pack.carryovers ?? {})) checkNumberMap(`pack ${pack.id}/${outcomeId}`, "carryover", carryover, resourceKeys);
  // The finale's clue is named after the case, not its scene prefix, and saves hold the id.
  if (![caseNodePrefix(pack.id), pack.id].some((prefix) => pack.clue?.id?.startsWith(`${prefix}-`))) fail(`the clue ${pack.clue?.id} does not carry the case's prefix`);
  else claim("clue", pack.clue.id, pack.id);

  // Every card the pack writes carries its own line and reply. They were two
  // tables at the foot of the file, keyed by id, five hundred lines from the
  // label they answer.
  const writtenCards = [
    ...[pack.nodes, pack.aftermath, pack.branchScenes, pack.writtenRoutes?.routes, pack.writtenRoutes?.finals]
      .flatMap((table) => Object.values(table ?? {}))
      .flatMap((scene) => scene.choices.filter((choice) => choice.type !== "reframe")),
    ...Object.values(pack.routePlan?.choices ?? {}).flatMap((route) => [...route.routeChoices, ...(route.finalChoices ?? [])]),
    ...(pack.routePlan ? [...pack.routePlan.system.routeChoices, ...pack.routePlan.finalChoices] : []),
    ...pack.evidencePlan.choices,
  ];
  for (const card of writtenCards) {
    if (!card.voice || !card.echo) fail(`the card ${card.id} ("${card.label}") is written without its ${card.voice ? "reply" : "line"}`);
  }
  // A line one opening has to itself belongs to a card that opening deals.
  const choiceIds = new Set(sceneIds.flatMap((sceneId) => (nodes[sceneId]?.choices ?? []).map((choice) => choice.id)));
  for (const [key, lines] of Object.entries(pack.openingLines ?? {})) {
    claim("openingLines", key, pack.id);
    if (!choiceIds.has(key) || !openingIds.some((openingId) => key.startsWith(`${openingId}_`))) fail(`openingLines.${key} is a line for a card no opening of the case deals`);
    if (!lines.voice || !lines.echo) fail(`openingLines.${key} needs both a voice and an echo`);
  }
  for (const key of Object.keys(pack.sceneContext)) {
    claim("sceneContext", key, pack.id);
    if (!sceneIds.includes(key)) fail(`sceneContext.${key} grounds a scene the pack does not write`);
  }
  for (const sceneId of sceneIds) {
    if (!pack.sceneContext[sceneId]) fail(`${sceneId} has no scene context`);
  }
  if (AUTHORED_CASE_PACKS.findIndex((other) => other.id === pack.id) !== packIndex) fail("is listed twice");
});

/**
 * What is still standing on generated copy. Every hidden route closes on a
 * scene its case wrote, every reply is authored, and every memory card a run
 * can be dealt answers in its own words (2026-09-29), so any of those coming
 * back is a failure. A choice with no voice line speaks its own label, which is
 * authored if plain; 54 did on 2026-09-29, and none has since every card came
 * to carry its own line (2026-10-05), so one coming back is a failure too.
 */
const VOICE_FALLBACK_CEILING = 0;
const memoryCardsWithoutReply = memoryCards.filter(({ card }) => !echoReplies[card.id]);
for (const nodeId of fallbackCopy.scenes) failures.push(`${nodeId} closes a hidden route on the shared scene; write finalTitle, finalText and finalMemo on its plan`);
for (const choiceId of fallbackCopy.echo) failures.push(`${choiceId} answers with a generated reply; give it an authored echo`);
for (const { caseId, kind, card, reachable } of memoryCardsWithoutReply) {
  if (reachable) failures.push(`${card.id} (${caseId}, ${kind}) can be dealt and takes the default reply; give its plan a ${kind === "evidenceTurn" ? "evidenceEcho" : kind === "systemRoute" ? "systemEcho" : "routeEcho"}`);
}
if (fallbackCopy.voice.length > VOICE_FALLBACK_CEILING) {
  failures.push(`${fallbackCopy.voice.length} choices speak their own label, over the ${VOICE_FALLBACK_CEILING} allowed; write their voice lines`);
}
const fallbackReport =
  `${fallbackCopy.scenes.length} hidden routes close on the shared scene, ` +
  `${fallbackCopy.echo.length} choices answer with a generated reply and ${fallbackCopy.voice.length} speak their own label, ` +
  `${memoryCardsWithoutReply.length} of ${memoryCards.length} memory cards take the default reply ` +
  `(${memoryCardsWithoutReply.filter(({ reachable }) => reachable).length} of them on cards a run can be dealt)`;

/**
 * Everyone who speaks has a card, and one name is one person.
 *
 * A speaker with no profile printed "사건 관계자" over a stock description --
 * 노아 did, in 26 scenes -- and two packs introducing the same name silently
 * gave the earlier case the later one's person: 프롤로그 05 showed a 경포 펜션
 * 사장 at a desk in 합정동.
 */
const PROFILE_FIELDS = ["role", "stance", "job", "appearance", "thought", "gesture", "voice", "line"];
for (const collision of characterProfileCollisions) {
  failures.push(`${collision} introduces someone the season already has a profile for; one person per name, and a change of role goes in characterOverrides`);
}
const speakersChecked = new Set();
for (const [nodeId, node] of Object.entries(nodes)) {
  if (!node.speaker) continue;
  const profile = getCharacterProfile(node.speaker, node.caseId);
  if (!profile) {
    failures.push(`${nodeId} is spoken by ${node.speaker}, who has no character profile`);
    continue;
  }
  speakersChecked.add(node.speaker);
  for (const field of PROFILE_FIELDS) {
    if (!isNonEmptyString(profile[field])) failures.push(`${node.speaker} (${node.caseId}) has no ${field}`);
  }
}
if (speakersChecked.size === 0) failures.push("no speaker was checked against a profile");

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `Game graph checks passed (${Object.keys(nodes).length} scenes, ${AUTHORED_CASE_PACKS.length} packs, ${speakersChecked.size} speakers, ` +
    `${memoryCards.length} memory cards, ${challengesChecked} continuity challenges).`,
);
console.log(`Continuity challenges no card can meet: ${[...unmeetableFound].join(", ") || "none"}.`);
console.log(`Generated copy still in play: ${fallbackReport}.`);
