import assert from "node:assert/strict";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  costWhenRising,
  initialResources,
  nodeOrders,
  nodes,
} from "../src/gameData.js";
import { applyEffect } from "../src/gameLogic.js";

/**
 * Balance guardrails for the authored graph.
 *
 * The audit found the game's central claim ("there is no clean option") was
 * false: picking the first choice every time won every resource axis at once.
 * These checks keep the trade real -- every archetype has to pay somewhere,
 * and every resource has to move in both directions.
 */

const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];
const isBetter = (key, a, b) => (costWhenRising.has(key) ? a < b : a > b);

const HUMAN_COST_COVERAGE_FLOOR = 0.35;
const UNIQUE_EFFECT_FLOOR = 0.7;
const FATIGUE_RECOVERY_FLOOR = 20;

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const failures = [];

const playableChoices = [];
const seenNodes = new Set();
for (const order of Object.values(nodeOrders)) {
  for (const nodeId of order) {
    if (seenNodes.has(nodeId)) continue;
    seenNodes.add(nodeId);
    for (const choice of nodes[nodeId]?.choices ?? []) {
      if (choice.type === "free") continue;
      playableChoices.push({ nodeId, choice });
    }
  }
}
const effects = playableChoices.map(({ choice }) => choice.effect ?? {});

// 1. Every choice charges something. A choice with only gains is a free lunch,
//    and enough of them turn one column of the scene list into a solved game.
for (const { nodeId, choice } of playableChoices) {
  const effect = choice.effect ?? {};
  const pays = Object.entries(effect).some(([key, value]) =>
    costWhenRising.has(key) ? value > 0 : value < 0,
  );
  if (!pays) failures.push(`${nodeId}/${choice.id} costs nothing: ${JSON.stringify(effect)}`);
}

// 2. Every resource has to move both ways, or it is a counter rather than a
//    resource. Fatigue is the one that used to have no recovery at all.
for (const key of RESOURCE_KEYS) {
  const up = effects.filter((effect) => (effect[key] ?? 0) > 0).length;
  const down = effects.filter((effect) => (effect[key] ?? 0) < 0).length;
  if (up === 0) failures.push(`${key} is never gained`);
  if (down === 0) failures.push(`${key} is never spent`);
}
const fatigueRecovery = effects.filter((effect) => (effect.fatigue ?? 0) < 0).length;
if (fatigueRecovery < FATIGUE_RECOVERY_FLOOR) {
  failures.push(`only ${fatigueRecovery} choices recover fatigue, need ${FATIGUE_RECOVERY_FLOOR}`);
}

// 3. The game is about who carries the cost, so humanCost has to be on enough
//    of the board to be a real lever rather than a label. Per case, not overall:
//    the season average was 46% while case 03 sat at 25% and the final case --
//    where the theme lands -- at 26%.
const humanCostCoverage =
  effects.filter((effect) => Number.isFinite(effect.humanCost) && effect.humanCost !== 0).length / effects.length;
for (const caseId of CASE_SEQUENCE) {
  const caseEffects = [...new Set(nodeOrders[caseId])]
    .flatMap((nodeId) => nodes[nodeId]?.choices ?? [])
    .filter((choice) => choice.type !== "free")
    .map((choice) => choice.effect ?? {});
  const coverage = caseEffects.filter((effect) => (effect.humanCost ?? 0) !== 0).length / caseEffects.length;
  if (coverage < HUMAN_COST_COVERAGE_FLOOR) {
    failures.push(
      `${caseId}: humanCost is on ${(coverage * 100).toFixed(0)}% of choices, need ${HUMAN_COST_COVERAGE_FLOOR * 100}%`,
    );
  }
}

// 4. Distinct effect vectors, so scenes are not the same decision retitled.
const uniqueRatio = new Set(effects.map((effect) => JSON.stringify(effect))).size / effects.length;
if (uniqueRatio < UNIQUE_EFFECT_FLOOR) {
  failures.push(
    `only ${(uniqueRatio * 100).toFixed(0)}% of effect vectors are unique, need ${UNIQUE_EFFECT_FLOOR * 100}%`,
  );
}

// 6. No choice may be dominated by another in the same scene. A column that
//    loses on every axis is a card nobody reading the numbers has a reason to
//    turn over, and this is how one gets added without anyone noticing.
for (const nodeId of new Set(Object.values(nodeOrders).flat())) {
  const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "free");
  for (const choice of choices) {
    const effect = choice.effect ?? {};
    const dominator = choices.find((other) => {
      if (other === choice) return false;
      const rival = other.effect ?? {};
      return (
        RESOURCE_KEYS.every((key) => !isBetter(key, effect[key] ?? 0, rival[key] ?? 0)) &&
        RESOURCE_KEYS.some((key) => isBetter(key, rival[key] ?? 0, effect[key] ?? 0))
      );
    });
    if (dominator) {
      failures.push(
        `${nodeId}/${choice.id} is dominated by ${dominator.id}: ` +
          `${JSON.stringify(effect)} vs ${JSON.stringify(dominator.effect ?? {})}`,
      );
    }
  }
}

/** Walk one case picking the same column every time. Cases reset resources. */
function walkCase(caseId, columnIndex) {
  let resources = { ...initialResources };
  let nodeId = CASE_START_NODES[caseId];
  const seen = new Set();
  while (nodeId && !seen.has(nodeId) && !resultNodeIds.has(nodeId)) {
    seen.add(nodeId);
    const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "free");
    if (choices.length === 0) break;
    const choice = choices[Math.min(columnIndex, choices.length - 1)];
    resources = applyEffect(resources, choice.effect ?? {});
    nodeId = choice.next;
  }
  return resources;
}

// 5. No column may be dominated: ending a case at least as well on every
//    resource and better on one means the other column was simply the right
//    answer, which is the free lunch this whole file exists to prevent. Stated
//    as domination rather than "strictly best on something" because resources
//    cap at 100, and two columns both reaching the cap is a tie, not a trap.
const COLUMNS = [0, 1, 2];
for (const caseId of CASE_SEQUENCE) {
  const outcomes = COLUMNS.map((columnIndex) => walkCase(caseId, columnIndex));
  for (const columnIndex of COLUMNS) {
    const mine = outcomes[columnIndex];
    const dominator = COLUMNS.find(
      (other) =>
        other !== columnIndex &&
        RESOURCE_KEYS.every((key) => !isBetter(key, mine[key], outcomes[other][key])) &&
        RESOURCE_KEYS.some((key) => isBetter(key, outcomes[other][key], mine[key])),
    );
    if (dominator !== undefined) {
      failures.push(
        `${caseId}: column ${columnIndex + 1} is dominated by column ${dominator + 1} ` +
          `(${RESOURCE_KEYS.map((key) => `${key} ${mine[key]}/${outcomes[dominator][key]}`).join(", ")})`,
      );
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `Balance checks passed (${playableChoices.length} choices, ` +
    `${(uniqueRatio * 100).toFixed(0)}% unique effects, ` +
    `humanCost on ${(humanCostCoverage * 100).toFixed(0)}%, ` +
    `${fatigueRecovery} fatigue recoveries)`,
);
