import assert from "node:assert/strict";
import { CASE_SEQUENCE, CASE_START_NODES, CASE_RESULT_NODES, initialResources, nodes } from "../src/gameData.js";
import { applyEffect, getEndingVariant, getRiskPressure } from "../src/gameLogic.js";

/**
 * Every written ending has to be reachable.
 *
 * Two of the nine were not. `collapse` -- the season's only failure ending --
 * asked for pressure 82 or humanCost 70, but resources reset at the start of
 * every case, so a single case peaked at 33 and 31 across 4,000 runs. `field-pact`
 * asked for trust well above legitimacy, which no route in the last case could
 * produce. This walks whole seasons and fails if any ending has become
 * unreachable again, which is the shape of bug that hides for months.
 */

const RUNS = 6000;
const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const EXPECTED = [
  "collapse",
  "open-oversight",
  "evidence-reform",
  "human-record",
  "profitable-silence",
  "cold-justice",
  "field-pact",
  "quiet-cover",
  "open-question",
];

let seed = 20260903;
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}

function playSeason() {
  let seasonHumanCost = 0;
  let peakRiskPressure = 0;
  let closing = { ...initialResources };
  for (const caseId of CASE_SEQUENCE) {
    let resources = { ...initialResources };
    let nodeId = CASE_START_NODES[caseId];
    const seen = new Set();
    while (nodeId && !seen.has(nodeId) && !resultNodeIds.has(nodeId)) {
      seen.add(nodeId);
      const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "free");
      if (choices.length === 0) break;
      const choice = choices[Math.floor(random() * choices.length)];
      resources = applyEffect(resources, choice.effect ?? {});
      peakRiskPressure = Math.max(peakRiskPressure, getRiskPressure(resources));
      nodeId = choice.next;
    }
    seasonHumanCost += resources.humanCost ?? 0;
    closing = resources;
  }
  return { closing, seasonHumanCost, peakRiskPressure };
}

const seen = new Map();
for (let run = 0; run < RUNS; run += 1) {
  const { closing, seasonHumanCost, peakRiskPressure } = playSeason();
  const clueCount = Math.floor(random() * 7);
  const freeTextCount = Math.floor(random() * 3);
  const ending = getEndingVariant({
    resources: closing,
    discoveredClues: Array.from({ length: clueCount }, (_, index) => ({ id: `clue-${index}` })),
    log: Array.from({ length: freeTextCount }, () => ({ freeTextSuccess: true })),
    seasonHumanCost,
    peakRiskPressure,
  });
  seen.set(ending.id, (seen.get(ending.id) ?? 0) + 1);
}

/**
 * Reachability alone only fails once an ending is already gone, and an ending
 * does not vanish in one step -- it thins. Raising every authored gain by a
 * tenth (2026-09-04) took `field-pact` from 0.3% to 0.2%, which is twelve
 * seasons in six thousand and one more change of that size away from nothing.
 * This floor is what makes the erosion fail while the ending is still there to
 * save. The sampling is seeded, so the counts are stable rather than lucky;
 * ratchet the floor up as headroom is won, and treat lowering it as a decision
 * worth writing down.
 */
const RARE_ENDING_FLOORS = {
  collapse: 300,
  "profitable-silence": 50,
  "cold-justice": 50,
  "field-pact": 10,
};

const missing = EXPECTED.filter((id) => !seen.has(id));
assert.deepEqual(missing, [], `endings never reached in ${RUNS} random seasons: ${missing.join(", ")}`);
const unexpected = [...seen.keys()].filter((id) => !EXPECTED.includes(id));
assert.deepEqual(unexpected, [], `unlisted ending ids reached: ${unexpected.join(", ")}`);

const thin = Object.entries(RARE_ENDING_FLOORS)
  .filter(([id, floor]) => (seen.get(id) ?? 0) < floor)
  .map(([id, floor]) => `${id} reached ${seen.get(id) ?? 0} of ${RUNS} seasons, under the floor of ${floor}`);
assert.deepEqual(thin, [], thin.join("\n"));

const spread = EXPECTED.map((id) => `${id} ${((seen.get(id) / RUNS) * 100).toFixed(1)}%`).join(", ");
console.log(`Ending checks passed (${RUNS} random seasons: ${spread})`);
