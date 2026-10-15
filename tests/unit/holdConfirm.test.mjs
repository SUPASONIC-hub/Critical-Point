import assert from "node:assert/strict";
import { test } from "node:test";

import { HOLD_IDLE, HOLD_MS, isClosingScene, SECOND_PRESS_MS, stepHold } from "../../src/gauntlet/holdConfirm.js";
import { CASE_PACKS, nodes } from "../../src/gameData.js";

/**
 * The held 확정 on a case's closing scene (improvement notes A4), as a
 * machine with no browser and no clock of its own: every step is handed the
 * time it happens at.
 */

/** Runs events from idle and says, for each, whether it confirmed. */
function run(events) {
  let state = HOLD_IDLE;
  return events.map(([type, at]) => {
    const step = stepHold(state, { type, at });
    state = step.state;
    return { confirmed: step.confirmed, phase: state.phase };
  });
}

test("a press held for 0.8s confirms when the hold fills, not when it lets go", () => {
  const steps = run([
    ["press", 1000],
    ["tick", 1000 + HOLD_MS - 1],
    ["tick", 1000 + HOLD_MS],
    ["release", 1000 + HOLD_MS + 300],
  ]);
  assert.deepEqual(steps.map((step) => step.confirmed), [false, false, true, false]);
  assert.equal(steps[1].phase, "holding", "a tick before the hold fills changes nothing");
  assert.equal(steps.at(-1).phase, "idle", "letting go after the confirm is not a second one");
});

test("a release at or past the hold confirms if no tick got there first", () => {
  assert.equal(run([["press", 0], ["release", HOLD_MS]]).at(-1).confirmed, true);
});

test("a short press confirms nothing, and arms a second press", () => {
  const steps = run([["press", 0], ["release", 200]]);
  assert.deepEqual(steps.map((step) => step.confirmed), [false, false]);
  assert.equal(steps.at(-1).phase, "armed");
});

test("a second press within 3s confirms at once, without holding", () => {
  const steps = run([["press", 0], ["release", 150], ["press", 150 + SECOND_PRESS_MS]]);
  assert.equal(steps.at(-1).confirmed, true);
  assert.equal(steps.at(-1).phase, "idle");
});

test("a second press after 3s starts over as a new hold", () => {
  const steps = run([["press", 0], ["release", 150], ["press", 151 + SECOND_PRESS_MS]]);
  assert.equal(steps.at(-1).confirmed, false);
  assert.equal(steps.at(-1).phase, "holding");
});

test("an arm runs out on the tick after 3s", () => {
  const steps = run([["press", 0], ["release", 100], ["tick", 100 + SECOND_PRESS_MS], ["tick", 101 + SECOND_PRESS_MS]]);
  assert.deepEqual(steps.map((step) => step.phase), ["holding", "armed", "armed", "idle"]);
  assert.ok(steps.every((step) => !step.confirmed));
});

test("a screen reader's click (a tap with no press) arms, and a second one confirms", () => {
  const steps = run([["tap", 0], ["tap", 2500]]);
  assert.deepEqual(steps.map((step) => [step.phase, step.confirmed]), [["armed", false], ["idle", true]]);
  // A tap and a press are the same second press: the fallback does not care
  // which way each one arrived.
  assert.equal(run([["tap", 0], ["press", 900]]).at(-1).confirmed, true);
  assert.equal(run([["press", 0], ["release", 100], ["tap", 900]]).at(-1).confirmed, true);
});

test("a tap during a hold does not cut it short", () => {
  const steps = run([["press", 0], ["tap", 100], ["tick", HOLD_MS]]);
  assert.deepEqual(steps.map((step) => step.confirmed), [false, false, true]);
});

test("cancel drops a hold in progress and keeps an arm", () => {
  const dropped = run([["press", 0], ["cancel", 400], ["tick", HOLD_MS], ["release", HOLD_MS + 10]]);
  assert.deepEqual(dropped.map((step) => step.phase), ["holding", "idle", "idle", "idle"]);
  assert.ok(dropped.every((step) => !step.confirmed), "a release after a cancel is not a press");
  const kept = run([["tap", 0], ["cancel", 500], ["tap", 1000]]);
  assert.equal(kept.at(-1).confirmed, true, "moving the mouse away between two clicks is not changing your mind");
});

test("a repeated press while holding does not restart the hold", () => {
  const steps = run([["press", 0], ["press", 500], ["tick", HOLD_MS]]);
  assert.equal(steps.at(-1).confirmed, true);
});

test("one gesture never confirms twice", () => {
  const steps = run([["press", 0], ["tick", HOLD_MS], ["tick", HOLD_MS * 2], ["release", HOLD_MS * 2], ["tap", HOLD_MS * 2 + 10]]);
  assert.equal(steps.filter((step) => step.confirmed).length, 1);
  assert.equal(steps.at(-1).phase, "armed", "a tap after the confirm is the start of a new one");
});

test("the hold is on the case's last choice, and on nothing before it", () => {
  // Every scene the hold is on has a card into the case's aftermath, and
  // every case has one: its closing decision, its route finals or its
  // evidence turn.
  for (const pack of CASE_PACKS) {
    const closing = Object.entries(nodes).filter(([, node]) => node.caseId === pack.id && isClosingScene(node));
    assert.ok(closing.length > 0, `${pack.id} has a last choice that holds 확정`);
    const [decisionId, aftermathId] = pack.aftermathRoute;
    if (decisionId) assert.ok(isClosingScene(nodes[decisionId]), `${decisionId} closes ${pack.id}`);
    assert.equal(isClosingScene(nodes[aftermathId]), false, `${aftermathId}, the aftermath, is a click`);
  }
  assert.ok(isClosingScene(nodes.f_choice), "the finale's 봉인 / 규칙 / 폭로 is held");
  // The finale's route finals lead on to the confrontation, not the end.
  for (const id of ["f_final_map", "f_final_expose", "f_final_contain", "f_final_system"]) {
    assert.equal(isClosingScene(nodes[id]), false, `${id} is not the finale's last choice`);
  }
  assert.ok(isClosingScene(nodes.c1_final_layoff), "사건 01 closes on its routes' finals");
  assert.ok(isClosingScene(nodes.c6_evidence_turn), "the evidence turn goes straight to the aftermath");
  assert.equal(isClosingScene(nodes.c6_desk), false, "an ordinary scene is a click");
  assert.equal(isClosingScene(undefined), false);
});

test("the closing test reads the graph it is handed", () => {
  const graph = { end: { kind: "aftermath" }, next: { kind: "scene" } };
  assert.equal(isClosingScene({ choices: [{ next: "next" }, { next: "end" }] }, graph), true);
  assert.equal(isClosingScene({ choices: [{ next: "next" }] }, graph), false);
  assert.equal(isClosingScene({}, graph), false);
});
