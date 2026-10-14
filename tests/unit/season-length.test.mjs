import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, TYPICAL_CASE_MINUTES } from "../../src/gameCases.js";
import { nodes } from "../../src/gameData.js";
import { getLeadChoice } from "../../src/gameLogic.js";
import { BASE_SCHEMA, getReadingSeconds } from "../../src/gauntlet/gauntletEngine.js";

/**
 * The intro says how long one case takes (`TYPICAL_CASE_MINUTES`, the 한 사건
 * stat). Nothing computes that sentence while the game runs -- the screen that
 * prints it is drawn before the graph is loaded -- so this walks the graph and
 * holds the number to it: a season rewritten at twice the length has to change
 * what the intro promises.
 */
const resultIds = new Set(Object.values(CASE_RESULT_NODES));

/** A case on the route its lead cards walk: how many decisions, and what its briefing pages' clocks add up to. */
function walkCase(caseId) {
  let nodeId = CASE_START_NODES[caseId];
  let decisions = 0;
  let readingSeconds = 0;
  while (!resultIds.has(nodeId)) {
    assert.ok(nodes[nodeId], `${caseId}: ${nodeId} is in the graph`);
    assert.ok(decisions < 40, `${caseId}: the route ends`);
    decisions += 1;
    readingSeconds += getReadingSeconds(nodes[nodeId]);
    nodeId = getLeadChoice(nodes[nodeId]).next;
  }
  return { decisions, readingSeconds };
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Minutes for each case, for someone who uses `share` of each reading clock, `table` seconds at each table and `report` seconds after it. */
const minutes = (routes, { share, table, report }) =>
  routes.map((route) => (route.readingSeconds * share + route.decisions * table + report) / 60);

test("the minutes the intro gives a case are inside what the season's clocks allow", () => {
  const routes = CASE_SEQUENCE.map(walkCase);
  assert.equal(routes.length, 55, "five prologues, forty-nine cases and the finale");
  const decisions = routes.map((route) => route.decisions);
  assert.ok(Math.min(...decisions) >= 4 && Math.max(...decisions) <= 16, `a case is ${Math.min(...decisions)} to ${Math.max(...decisions)} decisions`);

  const quick = median(minutes(routes, { share: 0.4, table: 8, report: 30 }));
  const steady = median(minutes(routes, { share: 0.7, table: 18, report: 60 }));
  const slowest = median(minutes(routes, { share: 1, table: BASE_SCHEMA.seconds, report: 120 }));
  assert.ok(quick < TYPICAL_CASE_MINUTES, `a quick reader's median case, ${quick.toFixed(1)} minutes, is under it`);
  assert.ok(slowest > TYPICAL_CASE_MINUTES, `every clock run out, ${slowest.toFixed(1)} minutes, is over it`);
  // "안팎": within three minutes of the median case at a steady pace.
  assert.ok(Math.abs(steady - TYPICAL_CASE_MINUTES) <= 3, `a steady reader's median case is ${steady.toFixed(1)} minutes`);
  // And of the first one, which is the case a first visit is deciding about.
  const first = minutes(routes.slice(0, 1), { share: 0.7, table: 18, report: 60 })[0];
  assert.ok(Math.abs(first - TYPICAL_CASE_MINUTES) <= 3, `the first case is ${first.toFixed(1)} minutes at that pace`);
});
