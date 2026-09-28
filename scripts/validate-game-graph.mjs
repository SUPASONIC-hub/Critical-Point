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
import { applyEffect, getAuthorityLevel, getCaseOutcome, getContinuityChallenge, getOutcomeCarryover, getOutcomeChoiceId, getRouteMemory, REFRAME_COGNITION, REFRAME_EFFECT } from "../src/gameLogic.js";
import { pressureBeats } from "../src/nodes/sceneBuild.js";
import { sceneContext } from "../src/nodes/sceneContext.js";
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
 * A `next` that is written must be the one the built graph uses.
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
// Openings whose challenge no card on them can meet today. 사건 01 opens on a
// scene with no 판을 다시 짠다 card and no card that gains 공정함 after an
// opening carried in alone, so two of its three challenges are bonuses nobody
// can earn. The fix is a line of `getContinuityChallenge` (gameLogic.js); an
// entry that is no longer needed fails, so this list only shrinks.
const UNMEETABLE_CHALLENGES = new Set(["case01/c1_start_record", "case01/c1_start_alone"]);
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
 * each other by id and by position. Every pack has the same shape -- five
 * authored scenes, an aftermath, three connective and three reaction scenes, a
 * side door of two, a hidden route and its close, an evidence turn and (after
 * the first case) three openings -- so the shape is checked rather than
 * trusted, and a key two packs both write is a failure rather than whichever
 * one was merged last.
 */
const PACK_KEYS = [
  "id", "nodes", "aftermath", "aftermathRoute", "connectiveScenes", "connectiveOrder", "choiceEffects", "choiceCopy",
  "reactionScenes", "reactionEffects", "reactionCopy", "reactionMemos", "branchPlan", "branchScenes", "routePlan",
  "evidencePlan", "memoryPlan", "openingRoutes", "openingCopy", "openingSignatures", "voiceLines", "echoReplies",
  "characterProfiles", "setting", "sceneContext", "clue", "outcomes", "carryovers", "continuityChallenges",
];
const OPTIONAL_PACK_KEYS = ["characterOverrides"];
const sameKeys = (left, right) => left.length === right.length && [...left].sort().join() === [...right].sort().join();
const keyOwners = new Map();
function claim(table, key, packId) {
  const owner = keyOwners.get(`${table}:${key}`);
  if (owner) failures.push(`${packId}.${table}.${key} is also written by ${owner}`);
  else keyOwners.set(`${table}:${key}`, packId);
}
// What 사건 01-11 and the finale write by hand is claimed first, so a pack
// cannot take a scene id they already use.
for (const [nodeId, node] of Object.entries(nodes)) {
  if (!AUTHORED_CASE_PACKS.some((pack) => pack.id === node.caseId)) claim("scene", nodeId, node.caseId);
}

AUTHORED_CASE_PACKS.forEach((pack, packIndex) => {
  const fail = (message) => failures.push(`pack ${pack.id}: ${message}`);
  const keys = Object.keys(pack).filter((key) => !OPTIONAL_PACK_KEYS.includes(key));
  const missing = PACK_KEYS.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !PACK_KEYS.includes(key));
  if (missing.length) fail(`is missing ${missing.join(", ")}`);
  if (extra.length) fail(`has fields no module reads: ${extra.join(", ")}`);
  if (missing.length) return;
  if (!CASE_SEQUENCE.includes(pack.id)) fail("is not a case of the season");

  const prefix = `${caseNodePrefix(pack.id)}_`;
  const previousPrefix = `${caseNodePrefix(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(pack.id) - 1] ?? "")}_`;
  const hasOpenings = CASE_SEQUENCE.indexOf(pack.id) > 0;
  const connectiveIds = pack.connectiveScenes.map(([id]) => id);
  const reactionIds = pack.reactionScenes.map(([id]) => id);
  const openingIds = Object.values(pack.openingRoutes);
  const sceneIds = [
    ...Object.keys(pack.nodes), ...Object.keys(pack.aftermath), ...connectiveIds, ...reactionIds, ...Object.keys(pack.branchScenes),
    pack.routePlan.system.route, pack.routePlan.system.final,
    ...Object.values(pack.routePlan.choices).flatMap((route) => [route.route, route.final]),
    pack.evidencePlan.node, ...openingIds,
  ];
  const expectedScenes = hasOpenings ? 20 : 17;
  if (sceneIds.length !== expectedScenes) fail(`writes ${sceneIds.length} scenes, not ${expectedScenes}`);
  if (Object.keys(pack.nodes).length !== 5) fail(`authors ${Object.keys(pack.nodes).length} scenes, not 5`);
  if (pack.connectiveScenes.length !== 3 || pack.reactionScenes.length !== 3) fail("does not have three connective and three reaction scenes");
  if (Object.keys(pack.branchScenes).length !== 2) fail("does not have a side door of two scenes");
  if (openingIds.length !== (hasOpenings ? 3 : 0)) fail(`has ${openingIds.length} openings`);
  for (const sceneId of sceneIds) {
    if (!sceneId?.startsWith(prefix)) fail(`the scene ${sceneId} does not carry the case's prefix ${prefix}`);
    else claim("scene", sceneId, pack.id);
    if (nodes[sceneId] && nodes[sceneId].caseId !== pack.id) fail(`the scene ${sceneId} was built into ${nodes[sceneId].caseId}`);
    if (!nodes[sceneId]) fail(`the scene ${sceneId} never reached the graph`);
  }

  // Generated scenes: labels, effects, voice and echo are four lists matched
  // by position, under the id of the scene they follow.
  const generatedFamilies = [
    ["connectiveScenes", pack.connectiveScenes, pack.choiceEffects, pack.choiceCopy, 7],
    ["reactionScenes", pack.reactionScenes, pack.reactionEffects, pack.reactionCopy, 6],
  ];
  for (const [family, scenes, effects, copy, labelsAt] of generatedFamilies) {
    const sources = scenes.map(([, sourceId]) => sourceId);
    if (!sameKeys(Object.keys(effects), sources)) fail(`${family}: the effects table is keyed ${Object.keys(effects).join(", ")}, the scenes follow ${sources.join(", ")}`);
    if (!sameKeys(Object.keys(copy), sources)) fail(`${family}: the copy table is keyed ${Object.keys(copy).join(", ")}, the scenes follow ${sources.join(", ")}`);
    for (const scene of scenes) {
      const [id, sourceId, nextId] = scene;
      const labels = scene[labelsAt];
      if (!sceneIds.includes(sourceId)) fail(`${id} follows ${sourceId}, which the pack does not write`);
      if (!sceneIds.includes(nextId)) fail(`${id} leads to ${nextId}, which the pack does not write`);
      if (!Array.isArray(labels)) {
        fail(`${id} has no list of labels in position ${labelsAt + 1}`);
        continue;
      }
      const lengths = { labels: labels.length, effects: effects[sourceId]?.length, voice: copy[sourceId]?.voice?.length, echo: copy[sourceId]?.echo?.length };
      if (new Set(Object.values(lengths)).size !== 1) fail(`${id}: ${Object.entries(lengths).map(([name, length]) => `${length} ${name}`).join(", ")}`);
    }
  }
  if (JSON.stringify(pack.connectiveOrder) !== JSON.stringify(pack.connectiveScenes.map(([id, sourceId]) => [sourceId, id]))) {
    fail("connectiveOrder does not repeat the connective scenes in order");
  }
  if (!sameKeys(Object.keys(pack.reactionMemos), reactionIds)) fail("reactionMemos is not keyed by the reaction scenes");

  // The side door: the card it hangs on has to be one the scene deals.
  const [branchSource, branchIndex, branchFirst, branchSecond] = pack.branchPlan;
  const branchCard = pack.nodes[branchSource]?.choices?.[branchIndex];
  if (!branchCard || branchCard.type === "reframe") fail(`branchPlan hangs the side door on card ${branchIndex + 1} of ${branchSource}, which is not a card that scene deals`);
  if (!sameKeys(Object.keys(pack.branchScenes), [branchFirst, branchSecond])) fail("branchPlan and branchScenes name different scenes");

  // Openings are keyed on how the previous case closed.
  if (!sameKeys(Object.keys(pack.openingCopy), openingIds)) fail("openingCopy is not keyed by the openings");
  if (!sameKeys(Object.keys(pack.openingSignatures), openingIds)) fail("openingSignatures is not keyed by the openings");
  if (!sameKeys(Object.keys(pack.continuityChallenges), Object.keys(pack.openingRoutes)) && hasOpenings) fail("continuityChallenges and openingRoutes are keyed on different outcomes");
  for (const outcomeId of Object.keys(pack.openingRoutes)) {
    if (!outcomeId.startsWith(previousPrefix)) fail(`the opening for ${outcomeId} is not keyed on the previous case`);
  }

  // How the case closes.
  const closingIds = Object.values(pack.aftermath).flatMap((scene) => scene.choices.map((choice) => choice.id));
  if (!sameKeys(Object.keys(pack.outcomes), closingIds)) fail("outcomes is not keyed by the aftermath's choices");
  if (!sameKeys(Object.keys(pack.carryovers), closingIds)) fail("carryovers is not keyed by the aftermath's choices");
  for (const [outcomeId, carryover] of Object.entries(pack.carryovers)) checkNumberMap(`pack ${pack.id}/${outcomeId}`, "carryover", carryover, resourceKeys);
  if (!pack.clue?.id?.startsWith(`${caseNodePrefix(pack.id)}-`)) fail(`the clue ${pack.clue?.id} does not carry the case's prefix`);
  else claim("clue", pack.clue.id, pack.id);

  // Every key a table is looked up by belongs to this case, and to no other.
  const choiceIds = new Set(sceneIds.flatMap((sceneId) => (nodes[sceneId]?.choices ?? []).map((choice) => choice.id)));
  for (const table of ["voiceLines", "echoReplies"]) {
    for (const key of Object.keys(pack[table])) {
      claim(table, key, pack.id);
      if (!choiceIds.has(key)) fail(`${table}.${key} is a line for a choice the case does not offer`);
    }
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
 * What is still standing on generated copy. A report, not yet a failure: the
 * per-case closing scenes and replies are being written, and this is the count
 * that has to reach zero before it becomes one.
 */
const memoryCardsWithoutReply = memoryCards.filter(({ card }) => !echoReplies[card.id]);
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
console.log(
  `Memory cards no run can be dealt: ${unreachableMemoryFields.length} (${unreachableMemoryFields.filter((field) => field.endsWith(".routeSplit")).length} routeLabel/routeNext pairs; ` +
    `only a case with a route that is not the hidden one hands a route split on).`,
);
