import assert from "node:assert/strict";
import {
  byEffectWeight,
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  costWhenRising,
  initialResources,
  isResourceGain,
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
      if (choice.type === "reframe") continue;
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
    .filter((choice) => choice.type !== "reframe")
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
  const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "reframe");
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

/** The axis a card gains most on, or null when it gains nothing. */
function topGainAxis(choice) {
  const [axis] = Object.entries(choice.effect ?? {}).filter(([key, value]) => isResourceGain(key, value)).sort(byEffectWeight)[0] ?? [];
  return axis ?? null;
}

/**
 * The three ways of playing the cards are written to: the person in the room,
 * the record, the clock. A habit takes, in every scene, the card that pays it
 * most -- what walking one column did while the columns were dealt in the
 * order they were written.
 */
const HABITS = {
  "people first": ["trust", "humanCost"],
  "procedure first": ["legitimacy"],
  "speed first": ["capital", "time"],
};

function habitScore(choice, axes) {
  return axes.reduce((sum, key) => {
    const value = choice.effect?.[key] ?? 0;
    return sum + (isResourceGain(key, value) ? Math.abs(value) : -Math.abs(value));
  }, 0);
}

/** Walk one case on one habit. Cases reset resources. */
function walkCase(caseId, axes) {
  let resources = { ...initialResources };
  let nodeId = CASE_START_NODES[caseId];
  const seen = new Set();
  while (nodeId && !seen.has(nodeId) && !resultNodeIds.has(nodeId)) {
    seen.add(nodeId);
    const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "reframe" && !choice.requiredAuthority);
    if (choices.length === 0) break;
    // Ties go to the card whose id sorts first, never to where it was dealt.
    const choice = [...choices].sort((a, b) => habitScore(b, axes) - habitScore(a, axes) || a.id.localeCompare(b.id))[0];
    resources = applyEffect(resources, choice.effect ?? {});
    nodeId = choice.next;
  }
  return resources;
}

// 5. No habit may be dominated: ending a case at least as well on every
//    resource and better on one means the other habit was simply the right
//    answer, which is the free lunch this whole file exists to prevent. Stated
//    as domination rather than "strictly best on something" because resources
//    cap at 100, and two habits both reaching the cap is a tie, not a trap.
//    This walked columns until the deal was shuffled (gameData.js); a column
//    is no longer a way of playing, so the walk asks the cards.
for (const caseId of CASE_SEQUENCE) {
  const outcomes = Object.entries(HABITS).map(([habit, axes]) => [habit, walkCase(caseId, axes)]);
  for (const [habit, mine] of outcomes) {
    const dominator = outcomes.find(
      ([other, theirs]) =>
        other !== habit &&
        RESOURCE_KEYS.every((key) => !isBetter(key, mine[key], theirs[key])) &&
        RESOURCE_KEYS.some((key) => isBetter(key, theirs[key], mine[key])),
    );
    if (dominator) {
      failures.push(
        `${caseId}: playing ${habit} is dominated by playing ${dominator[0]} ` +
          `(${RESOURCE_KEYS.map((key) => `${key} ${mine[key]}/${dominator[1][key]}`).join(", ")})`,
      );
    }
  }
}

/**
 * Where a card sits must say nothing about what it is.
 *
 * The way of thinking a generated card exercises is read from the card, not
 * its column (`inferChoiceCognition` in gameData.js), and the axis a card gains
 * most on is whatever its author gave it -- but every scene was written in one
 * order, so the first card's top gain was 믿음 in 99% of the scenes the packs
 * author and a player could pick a column instead of a card. The deal is
 * shuffled per scene now; this holds the result. Measured on the table as it
 * is dealt, over every scene: no column may be one way of thinking in more
 * than 90% of the generated cards, and no column may carry one axis as its top
 * gain in more than half of its cards.
 */
const MAX_COLUMN_COGNITION_SHARE = 0.9;
const MAX_COLUMN_AXIS_SHARE = 0.5;
const columnCognition = new Map();
const columnAxis = new Map();
const tally = (table, index, key) => {
  const counts = table.get(index) ?? new Map();
  counts.set(key, (counts.get(key) ?? 0) + 1);
  table.set(index, counts);
};
for (const nodeId of new Set(Object.values(nodeOrders).flat())) {
  const dealt = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "reframe");
  dealt.forEach((choice, index) => {
    // The evidence turn is one card under one label in a slot of its own; it is
    // not part of the hand the shuffle deals.
    if (choice.id.endsWith("_evidence_turn")) return;
    const axis = topGainAxis(choice);
    if (axis) tally(columnAxis, index, axis);
    if (!/_choice_\d+$/.test(choice.id ?? "")) return;
    const [type] = Object.entries(choice.cognition ?? {}).sort((a, b) => b[1] - a[1])[0] ?? [];
    tally(columnCognition, index, type);
  });
}
const leaderOf = (counts) => {
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const [key, count] = [...counts].sort((a, b) => b[1] - a[1])[0];
  return { key, count, total, share: count / total };
};
for (const [index, counts] of columnCognition) {
  const { key, count, total, share } = leaderOf(counts);
  if (total >= 20 && share > MAX_COLUMN_COGNITION_SHARE) {
    failures.push(`generated column ${index + 1} is ${key} in ${count} of ${total} cards: cognition is being read from the position again`);
  }
}
const columnAxisReport = [];
for (const [index, counts] of [...columnAxis].sort((a, b) => a[0] - b[0])) {
  const { key, count, total, share } = leaderOf(counts);
  if (total < 20) continue;
  columnAxisReport.push(`column ${index + 1}: ${key} ${(share * 100).toFixed(0)}%`);
  if (share > MAX_COLUMN_AXIS_SHARE) {
    failures.push(`column ${index + 1} gains most on ${key} in ${count} of ${total} cards: the position gives the card away`);
  }
}
assert.ok(columnAxisReport.length >= 3, "the column check measured fewer than three columns");

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `Balance checks passed (${playableChoices.length} choices, ` +
    `${(uniqueRatio * 100).toFixed(0)}% unique effects, ` +
    `humanCost on ${(humanCostCoverage * 100).toFixed(0)}%, ` +
    `${fatigueRecovery} fatigue recoveries; top gain by ${columnAxisReport.join(", ")})`,
);
