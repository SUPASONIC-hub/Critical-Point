import assert from "node:assert/strict";
import fs from "node:fs";
import {
  byEffectWeight,
  caseAftermathNodeId,
  caseOpeningRoutes,
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  costWhenRising,
  getContinuityMemoryChoice,
  initialResources,
  isResourceGain,
  nodeOrders,
  nodes,
} from "../src/gameData.js";
import { applyEffect, getLeadChoice } from "../src/gameLogic.js";

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

const dominates = (winner, loser) =>
  RESOURCE_KEYS.every((key) => !isBetter(key, loser[key] ?? 0, winner[key] ?? 0)) &&
  RESOURCE_KEYS.some((key) => isBetter(key, winner[key] ?? 0, loser[key] ?? 0));

/**
 * 6b. The cards the runtime deals itself sit on the same table and were in no
 *     rule: the memory card an opening is dealt for what the last case did
 *     (seasonRules.js), 관계의 증언 on a scene whose speaker the run has stayed
 *     with, and 판 공개 기준 on the closing scene (GameRuntime.jsx). Rule 6
 *     asks only the scene's own cards, so one of these could beat a written
 *     card on every axis, or lose to it on every axis, and pass.
 *
 *     A runtime card is compared with the written cards that go where it goes:
 *     two cards to one scene differ only in what they cost, so one beating the
 *     other outright leaves a card with no reason to be picked. A card to a
 *     different scene buys a different story and is not compared.
 *
 *     Two of the three are built inside a component, so their numbers are read
 *     from its source; if the reader finds nothing the check fails rather than
 *     compare against a card that is no longer dealt.
 */
const runtimeSource = fs.readFileSync(new URL("../src/GameRuntime.jsx", import.meta.url), "utf8");
function runtimeCardEffect(idSuffix) {
  const written = new RegExp(`_${idSuffix}\`,[^}]*?effect: \\{([^}]*)\\}`).exec(runtimeSource)?.[1];
  const effect = Object.fromEntries([...(written ?? "").matchAll(/(\w+): (-?\d+)/g)].map(([, key, value]) => [key, Number(value)]));
  if (Object.keys(effect).length === 0 || Object.keys(effect).some((key) => !RESOURCE_KEYS.includes(key))) {
    failures.push(`the runtime's ${idSuffix} card could not be read from GameRuntime.jsx; rule 6b no longer knows what it costs`);
  }
  return effect;
}
const RELATIONSHIP_EFFECT = runtimeCardEffect("relationship_bridge");
const ADAPTIVE_EFFECT = runtimeCardEffect("adaptive_reframe");

const MEMORY_KINDS = ["evidenceTurn", "systemRoute", "routeSplit"];
const runtimeCards = [];
CASE_SEQUENCE.forEach((caseId, index) => {
  const previousCaseId = CASE_SEQUENCE[index - 1];
  const openings = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
  for (const nodeId of new Set(nodeOrders[caseId] ?? [])) {
    const node = nodes[nodeId];
    const lead = node ? getLeadChoice(node) : null;
    if (!lead) continue;
    if (openings.has(nodeId) && previousCaseId) {
      for (const kind of MEMORY_KINDS) {
        const routeMemory = Object.fromEntries(MEMORY_KINDS.map((key) => [key, key === kind]));
        const card = getContinuityMemoryChoice({ caseId, nodeId, caseResults: { [previousCaseId]: { routeMemory } } });
        if (card) runtimeCards.push({ nodeId, id: card.id, effect: card.effect, next: card.next });
      }
    }
    // 관계의 증언 needs two decisions behind it, so no opening deals it.
    if (!openings.has(nodeId) && node.speaker) runtimeCards.push({ nodeId, id: `${caseId}_relationship_bridge`, effect: RELATIONSHIP_EFFECT, next: lead.next });
    if (nodeId === caseAftermathNodeId(caseId)) runtimeCards.push({ nodeId, id: `${caseId}_adaptive_reframe`, effect: ADAPTIVE_EFFECT, next: lead.next });
  }
});
if (runtimeCards.length === 0) failures.push("rule 6b compared no runtime card");
const runtimeDominance = [];
for (const card of runtimeCards) {
  for (const written of nodes[card.nodeId].choices) {
    if (written.type === "reframe" || written.next !== card.next) continue;
    const effect = written.effect ?? {};
    if (dominates(card.effect, effect)) runtimeDominance.push(`${card.nodeId}/${written.id} is dominated by the runtime's ${card.id}: ${JSON.stringify(effect)} vs ${JSON.stringify(card.effect)}`);
    if (dominates(effect, card.effect)) runtimeDominance.push(`${card.nodeId}: the runtime's ${card.id} is dominated by ${written.id}: ${JSON.stringify(card.effect)} vs ${JSON.stringify(effect)}`);
  }
}

/**
 * 7. A label that says how the card treats the clock has to agree with what
 *    the card does to it. 시간 is time left: a card that waits or puts a thing
 *    off spends it, and a card that acts 바로 does not. Only the words that say
 *    so outright are read, and not where the label refuses them ("미루지
 *    않고") or 바로 means something else (바로잡는다, 바로 그 서류).
 */
const WAITS = /기다리|기다린|미루|미룬|보류|유예|늦추|늦춘|연기한|연기하/g;
const ACTS_NOW = /(?<!올)바로(?!잡| 그| 앞| 옆| 뒤| 위| 아래| 전| 다음)|즉시|곧장/g;
const refused = (label, match) => /^[가-힣]{0,2}지 (?:않|말|못)|^하지 (?:않|말|못)/.test(label.slice(match.index + match[0].length));
const says = (label, pattern) => [...label.matchAll(pattern)].some((match) => !refused(label, match));
const clockMismatches = [];
for (const { nodeId, choice } of playableChoices) {
  const time = choice.effect?.time ?? 0;
  const waits = says(choice.label ?? "", WAITS);
  const actsNow = says(choice.label ?? "", ACTS_NOW);
  if (waits === actsNow) continue;
  if (waits && time > 0) clockMismatches.push(`${nodeId}/${choice.id} waits and gains time (${time}): "${choice.label}"`);
  if (actsNow && time < 0) clockMismatches.push(`${nodeId}/${choice.id} acts at once and loses time (${time}): "${choice.label}"`);
}

/**
 * Rules 6b and 7 were written on 2026-10-07 and found cards the season already
 * deals. Those are numbers and labels to rebalance, not a script to fix, so
 * each count is a ceiling: the check fails when it rises and prints every
 * offender, and the ceiling comes down as cards are fixed.
 */
const RUNTIME_DOMINANCE_CEILING = 7;
const CLOCK_MISMATCH_CEILING = 76;
for (const [name, found, ceiling] of [
  ["runtime cards that beat, or lose to, a written card going the same way", runtimeDominance, RUNTIME_DOMINANCE_CEILING],
  ["labels that disagree with what the card does to the clock", clockMismatches, CLOCK_MISMATCH_CEILING],
]) {
  if (found.length > ceiling) failures.push(`${found.length} ${name}, over the ${ceiling} allowed:\n  ${found.join("\n  ")}`);
  else if (process.argv.includes("--list")) console.log(`${found.length} ${name}:\n  ${found.join("\n  ")}`);
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

/** Walk one case on one habit from one of its opening scenes. Cases reset resources. */
function walkCase(startId, axes) {
  let resources = { ...initialResources };
  let nodeId = startId;
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
//    A season opens every case after the first on one of its three opening
//    variants (`describeCaseOpening`, runLifecycle.js), each with a signature
//    card the default start does not deal, so the walk sets out from each of
//    them as well: from the default start alone it measured a scene a season
//    shows only on a retry or a debug jump.
let habitWalks = 0;
for (const caseId of CASE_SEQUENCE) {
  const starts = [...new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})])].filter((nodeId) => nodes[nodeId]);
  for (const startId of starts) {
    habitWalks += 1;
    const outcomes = Object.entries(HABITS).map(([habit, axes]) => [habit, walkCase(startId, axes)]);
    for (const [habit, mine] of outcomes) {
      const dominator = outcomes.find(
        ([other, theirs]) =>
          other !== habit &&
          RESOURCE_KEYS.every((key) => !isBetter(key, mine[key], theirs[key])) &&
          RESOURCE_KEYS.some((key) => isBetter(key, theirs[key], mine[key])),
      );
      if (dominator) {
        failures.push(
          `${caseId} from ${startId}: playing ${habit} is dominated by playing ${dominator[0]} ` +
            `(${RESOURCE_KEYS.map((key) => `${key} ${mine[key]}/${dominator[1][key]}`).join(", ")})`,
        );
      }
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
    `${fatigueRecovery} fatigue recoveries; top gain by ${columnAxisReport.join(", ")}; ` +
    `${habitWalks} openings walked on three habits; ` +
    `${runtimeDominance.length} of ${RUNTIME_DOMINANCE_CEILING} allowed runtime cards beat or lose to a written card going the same way, ` +
    `${clockMismatches.length} of ${CLOCK_MISMATCH_CEILING} allowed labels disagree with the clock)`,
);
