import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_RESULT_NODES, CASE_START_NODES, caseOpeningRoutes, nodes } from "../../src/gameData.js";
import { getLeadChoice } from "../../src/seasonRules.js";

/**
 * `check-balance.mjs` reads the season when it is imported, so its rules are
 * proved on the season: unbalance one card in memory, import the check again,
 * and read what it says (audit of 2026-10-07, findings 4, 5 and 9).
 */
let probes = 0;
async function balanceCheckAfter(breakIt) {
  const restore = breakIt();
  try {
    await import(`../../scripts/check-balance.mjs?probe=${(probes += 1)}`);
    return "";
  } catch (error) {
    return String(error.message);
  } finally {
    restore();
  }
}

function swap(owner, key, value) {
  const before = owner[key];
  owner[key] = value;
  return () => {
    owner[key] = before;
  };
}

const openingIds = new Set(Object.values(caseOpeningRoutes).flatMap((routes) => Object.values(routes)));
const startIds = new Set(Object.values(CASE_START_NODES));

test("the season as it stands passes, so every failure below is the probe's", async () => {
  assert.equal(await balanceCheckAfter(() => () => {}), "");
});

test("a written card may not lose on every axis to a card the runtime deals to the same scene", async () => {
  // 관계의 증언 is { trust 5, legitimacy 2, fatigue 2 } and goes where the lead goes.
  const [, scene] = Object.entries(nodes).find(([nodeId, node]) => node.caseId === "case13" && node.speaker && !openingIds.has(nodeId) && !startIds.has(nodeId) && getLeadChoice(node));
  const lead = getLeadChoice(scene);
  const said = await balanceCheckAfter(() => swap(lead, "effect", { trust: 4, legitimacy: 1, fatigue: 3 }));
  assert.match(said, new RegExp(`${lead.id} is dominated by the runtime's case13_relationship_bridge`));
  assert.match(said, /runtime cards that beat, or lose to, a written card going the same way, over the \d+ allowed/);
});

test("a label that waits may not gain time, and one that acts at once may not lose it", async () => {
  const card = Object.values(nodes).flatMap((node) => node.choices).find((choice) => choice.type !== "reframe" && (choice.effect?.time ?? 0) > 0 && !/기다|미루|미룬|보류|바로|즉시|곧장/.test(choice.label));
  const waits = await balanceCheckAfter(() => swap(card, "label", "결과가 나올 때까지 하루 더 기다린다"));
  assert.match(waits, new RegExp(`${card.id} waits and gains time`));
  assert.match(waits, /labels that disagree with what the card does to the clock, over the \d+ allowed/);

  const spender = Object.values(nodes).flatMap((node) => node.choices).find((choice) => choice.type !== "reframe" && (choice.effect?.time ?? 0) < 0 && !/기다|미루|미룬|보류|바로|즉시|곧장/.test(choice.label));
  const now = await balanceCheckAfter(() => swap(spender, "label", "서류를 즉시 넘긴다"));
  assert.match(now, new RegExp(`${spender.id} acts at once and loses time`));

  // A label that refuses the word is not read as saying it.
  assert.equal(await balanceCheckAfter(() => swap(card, "label", "결과를 기다리지 않고 서류를 넘긴다")), "");
});

test("the habit walk sets out from every opening variant, not only the default start", async () => {
  // Close the case on an opening variant and deal it two cards: one that only
  // lowers a 사람 피해 already at zero, and one better everywhere else. People
  // first takes the first and ends below procedure first on every axis.
  const openingId = Object.values(caseOpeningRoutes.case13)[0];
  assert.notEqual(openingId, CASE_START_NODES.case13);
  const opening = nodes[openingId];
  const next = CASE_RESULT_NODES.case13;
  const said = await balanceCheckAfter(() =>
    swap(opening, "choices", [
      { id: "probe_people", label: "probe", next, effect: { humanCost: -10, legitimacy: -20, capital: -20, time: -20 }, cognition: { risk: 1 } },
      { id: "probe_record", label: "probe", next, effect: { trust: 9, legitimacy: 10, time: -1 }, cognition: { risk: 1 } },
    ]),
  );
  assert.match(said, new RegExp(`case13 from ${openingId}: playing people first is dominated by playing`));
});
