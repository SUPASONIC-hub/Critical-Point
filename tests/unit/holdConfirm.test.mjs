import assert from "node:assert/strict";
import { test } from "node:test";

import { HINT_MS, HOLD_IDLE, HOLD_MS, holdsConfirm, isClosingScene, isDangerZone, PHASE_MS, SECOND_PRESS_MS, stepHold } from "../../src/gauntlet/holdConfirm.js";
import { scheduleTick } from "../../src/gauntlet/useHoldConfirm.js";
import { CASE_PACKS, nodes } from "../../src/gameData.js";

/**
 * The held 확정 on the big decisions (improvement notes A4, 2026-11-05: the
 * case's last choice and the confirm in the danger zone), as a machine with
 * no browser and no clock of its own: every step is handed the time it
 * happens at.
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

test("the hold is 0.6 seconds, the hint 1.5 and a tap's second press 3", () => {
  assert.equal(HOLD_MS, 600);
  assert.equal(HINT_MS, 1500);
  assert.equal(SECOND_PRESS_MS, 3000);
  assert.deepEqual(PHASE_MS, { holding: HOLD_MS, hinted: HINT_MS, armed: SECOND_PRESS_MS });
});

test("a press held for 0.6s confirms when the hold fills, not when it lets go", () => {
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

test("a press let go early confirms nothing and shows the hint; a second short press is the same hint again", () => {
  const steps = run([["press", 0], ["release", 200], ["press", 400], ["release", 500]]);
  assert.deepEqual(steps.map((step) => step.confirmed), [false, false, false, false]);
  assert.deepEqual(steps.map((step) => step.phase), ["holding", "hinted", "holding", "hinted"]);
});

test("the hint runs out on the tick after 1.5s, and a press during it starts a hold that can fill", () => {
  const lapsed = run([["press", 0], ["release", 100], ["tick", 100 + HINT_MS - 1], ["tick", 100 + HINT_MS]]);
  assert.deepEqual(lapsed.map((step) => step.phase), ["holding", "hinted", "hinted", "idle"]);
  const held = run([["press", 0], ["release", 100], ["press", 300], ["tick", 300 + HOLD_MS]]);
  assert.equal(held.at(-1).confirmed, true);
});

test("a screen reader's click (a tap with no press) arms, and a second one within 3s confirms", () => {
  const steps = run([["tap", 0], ["tap", 2500]]);
  assert.deepEqual(steps.map((step) => [step.phase, step.confirmed]), [["armed", false], ["idle", true]]);
  // A tap and a press are the same second press: the fallback does not care
  // which way the second one arrived.
  assert.equal(run([["tap", 0], ["press", 900]]).at(-1).confirmed, true);
  assert.equal(run([["tap", 0], ["tap", 1 + SECOND_PRESS_MS]]).at(-1).phase, "armed", "a tap after 3s is a first tap again");
  const lapsed = run([["tap", 0], ["tick", SECOND_PRESS_MS], ["tick", 1 + SECOND_PRESS_MS]]);
  assert.deepEqual(lapsed.map((step) => step.phase), ["armed", "armed", "idle"]);
  assert.ok(lapsed.every((step) => !step.confirmed));
});

test("a pointer's short press never arms: only a bare tap does", () => {
  // Two quick clicks with a pointer are two hints, not a confirm.
  const clicks = run([["press", 0], ["release", 100], ["press", 300], ["release", 400]]);
  assert.ok(clicks.every((step) => !step.confirmed));
  assert.equal(clicks.at(-1).phase, "hinted");
  // A tap after a hint is a screen reader's first tap.
  assert.equal(run([["press", 0], ["release", 100], ["tap", 900]]).at(-1).phase, "armed");
});

test("a tap during a hold does not cut it short", () => {
  const steps = run([["press", 0], ["tap", 100], ["tick", HOLD_MS]]);
  assert.deepEqual(steps.map((step) => step.confirmed), [false, false, true]);
});

test("cancel drops a hold in progress and keeps a hint or an arm", () => {
  const dropped = run([["press", 0], ["cancel", 400], ["tick", HOLD_MS], ["release", HOLD_MS + 10]]);
  assert.deepEqual(dropped.map((step) => step.phase), ["holding", "idle", "idle", "idle"]);
  assert.ok(dropped.every((step) => !step.confirmed), "a release after a cancel is not a press");
  assert.equal(run([["press", 0], ["release", 100], ["cancel", 200]]).at(-1).phase, "hinted");
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
  assert.equal(stepHold(HOLD_IDLE, { type: "nothing", at: 0 }).state, HOLD_IDLE);
});

test("the hook's one timer ticks when the phase is due, and an idle machine sets none", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const [phase, due] of Object.entries(PHASE_MS)) {
    const sent = [];
    const stop = scheduleTick(phase, (type) => sent.push(type));
    t.mock.timers.tick(due + 19);
    assert.deepEqual(sent, [], `${phase}: nothing a frame early`);
    t.mock.timers.tick(1);
    assert.deepEqual(sent, ["tick"], `${phase}: one tick at ${due}ms plus the slack`);
    stop();
  }
  const sent = [];
  scheduleTick("idle", (type) => sent.push(type));
  t.mock.timers.tick(10_000);
  assert.deepEqual(sent, [], "idle waits for nothing");
  const stopped = [];
  const stop = scheduleTick("holding", (type) => stopped.push(type));
  stop();
  t.mock.timers.tick(10_000);
  assert.deepEqual(stopped, [], "a stopped timer never ticks");
});

test("the hold is on the case's last choice and in the danger zone, and on nothing else", () => {
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

  // The danger zone: the heat at or past the shown band's low edge.
  assert.equal(isDangerZone(70, 70), true);
  assert.equal(isDangerZone(69.9, 70), false);
  assert.equal(isDangerZone(NaN, 70), false);
  assert.equal(isDangerZone(80, undefined), false, "no band drawn is no danger zone");
  const ordinary = nodes.c6_desk;
  assert.equal(holdsConfirm({ node: ordinary, gauge: 30, wallMin: 70 }), false, "an ordinary table below the band is a click");
  assert.equal(holdsConfirm({ node: ordinary, gauge: 72, wallMin: 70 }), true, "the same table in the band is held");
  assert.equal(holdsConfirm({ node: nodes.c6_evidence_turn, gauge: 0, wallMin: 70 }), true, "the last choice is held from its first push");
});

test("the closing test reads the graph it is handed", () => {
  const graph = { end: { kind: "aftermath" }, next: { kind: "scene" } };
  assert.equal(isClosingScene({ choices: [{ next: "next" }, { next: "end" }] }, graph), true);
  assert.equal(isClosingScene({ choices: [{ next: "next" }] }, graph), false);
  assert.equal(isClosingScene({}, graph), false);
  assert.equal(holdsConfirm({ node: { choices: [{ next: "end" }] }, gauge: 0, wallMin: 70 }, graph), true);
});
