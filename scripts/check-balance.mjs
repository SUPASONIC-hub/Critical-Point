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
//    of the board to be a real lever rather than a label.
const humanCostCoverage =
  effects.filter((effect) => Number.isFinite(effect.humanCost) && effect.humanCost !== 0).length / effects.length;
if (humanCostCoverage < HUMAN_COST_COVERAGE_FLOOR) {
  failures.push(
    `humanCost appears on ${(humanCostCoverage * 100).toFixed(0)}% of choices, need ${HUMAN_COST_COVERAGE_FLOOR * 100}%`,
  );
}

// 4. Distinct effect vectors, so scenes are not the same decision retitled.
const uniqueRatio = new Set(effects.map((effect) => JSON.stringify(effect))).size / effects.length;
if (uniqueRatio < UNIQUE_EFFECT_FLOOR) {
  failures.push(
    `only ${(uniqueRatio * 100).toFixed(0)}% of effect vectors are unique, need ${UNIQUE_EFFECT_FLOOR * 100}%`,
  );
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

// 5. In every case each archetype -- people first, procedure first, profit
//    first -- has to end strictly best on at least one axis. That is what makes
//    the column you pick a judgement instead of a solved optimum.
const COLUMNS = [0, 1, 2];
for (const caseId of CASE_SEQUENCE) {
  const outcomes = COLUMNS.map((columnIndex) => walkCase(caseId, columnIndex));
  for (const columnIndex of COLUMNS) {
    const mine = outcomes[columnIndex];
    const wins = RESOURCE_KEYS.filter((key) =>
      COLUMNS.every((other) => other === columnIndex || isBetter(key, mine[key], outcomes[other][key])),
    );
    if (wins.length === 0) {
      failures.push(
        `${caseId}: column ${columnIndex + 1} is not strictly best on any resource ` +
          `(${RESOURCE_KEYS.map((key) => `${key} ${mine[key]}`).join(", ")})`,
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
