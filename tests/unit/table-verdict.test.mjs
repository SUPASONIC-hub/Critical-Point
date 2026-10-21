import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BASE_SCHEMA, buildNextSchema, createWindow, describeMutations, isPenaltyMutation, MUTATIONS, READ_GRACE_SECONDS, reduceWindow, resolveWindow, VERDICT_CAUSES,
} from "../../src/gauntlet/gauntletEngine.js";
import { describeNextTable, describeVerdictCause } from "../../src/gauntlet/tableReadout.js";

/**
 * What the reveal and the briefing say happened, against what the engine did:
 * the cause a window closed on, and the rules a mutation still carries once
 * mastery has lifted part of it (the 2026-10-07 audit, B1 findings 3 and 10).
 */

/** One closed window for each way the reducer can close one. */
function closedWindows() {
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "causes" });
  const staked = { ...fresh, selectedId: "a" };
  const underWall = { ...staked, gauge: fresh.wall - 0.001, elapsed: READ_GRACE_SECONDS };
  return {
    cash: reduceWindow(staked, { type: "CASH" }),
    push: reduceWindow({ ...staked, gauge: fresh.wall - 0.001 }, { type: "PUSH" }),
    creep: reduceWindow(underWall, { type: "TICK", delta: 1 }),
    timeout: reduceWindow({ ...fresh, schema: { ...fresh.schema, creep: 0 }, elapsed: fresh.schema.seconds - 0.5 }, { type: "TICK", delta: 1 }),
    abandon: createWindow({ schema: BASE_SCHEMA, seed: "causes", abandoned: true }),
  };
}

test("the reveal names what closed the window, one true sentence a cause", () => {
  const windows = closedWindows();
  assert.deepEqual(Object.keys(windows).sort(), [...VERDICT_CAUSES].sort(), "a window for every cause the engine lists");
  const sentences = new Map();
  for (const [cause, window] of Object.entries(windows)) {
    assert.equal(window.closedAs ?? window.cause, cause, `the reducer closes a window as ${cause}`);
    assert.equal(window.status, cause === "cash" ? "cashed" : "bust");
    const { verdict } = resolveWindow({ run: null, window, card: { id: "a", effect: {} } });
    assert.equal(verdict.cause, cause, "and the verdict carries it to the reveal");
    sentences.set(cause, describeVerdictCause(verdict));
  }
  assert.equal(new Set(sentences.values()).size, VERDICT_CAUSES.length, "no two causes share a sentence");
  assert.equal(sentences.get("cash"), "직접 확정했다");
  for (const cause of VERDICT_CAUSES.filter((name) => name !== "cash")) {
    assert.doesNotMatch(sentences.get(cause), /확정/, `a ${cause} bust is not reported as the player's cash`);
  }
  assert.match(sentences.get("creep"), /시계/);
  // No press closes a window on its own, so "focus" is not a cause the engine deals. A verdict logged before
  // 2026-10-10 can name it, and its reveal still reads as it did.
  assert.equal(VERDICT_CAUSES.includes("focus"), false);
  const logged = describeVerdictCause({ outcome: "bust", cause: "focus" });
  assert.equal(logged, "LOCK이 올린 열기가 벽에 닿았다");
  assert.equal([...sentences.values()].includes(logged), false, "a sentence of its own");
  // A LOCK press under the wall is charged in clock, and the clock is what closes the window.
  const pressed = reduceWindow({ ...createWindow({ schema: BASE_SCHEMA, seed: "causes" }), selectedId: "a", gauge: closedWindows().creep.wall - 0.001, elapsed: READ_GRACE_SECONDS }, { type: "FOCUS" });
  assert.deepEqual([pressed.status, pressed.cause], ["bust", "creep"]);

  // A window that bust and was reloaded under its slam is settled as what it bust on.
  for (const closedAs of ["creep", "timeout", "push"]) {
    const reloaded = createWindow({ schema: BASE_SCHEMA, seed: "causes", abandoned: true, closedAs });
    const { verdict } = resolveWindow({ run: null, window: reloaded, card: { id: "a", effect: {} } });
    assert.equal(describeVerdictCause(verdict), sentences.get(closedAs));
  }

  // A cause this table has no sentence for says only what the outcome proves.
  assert.doesNotMatch(describeVerdictCause({ outcome: "bust", cause: "meteor" }), /확정/);
  assert.equal(describeVerdictCause({ outcome: "cash" }), "직접 확정했다");
  assert.equal(describeVerdictCause(null), "직접 확정했다");
});

test("BLACKOUT and COLD FEET say what is left once EXPOSE mastery has lifted them", () => {
  const master = { strike: 0, steady: 0, expose: 99, mastered: [] };
  const bust = (stanceMastery) => buildNextSchema({ outcome: "bust", cause: "push", gauge: 60, pushes: 2, streak: 0, stanceMastery });
  const coldCash = (stanceMastery) => buildNextSchema({ outcome: "cash", cause: "cash", gauge: 10, pushes: 0, streak: 0, stanceMastery });
  const find = (schema, id) => describeMutations(schema).find((mutation) => mutation.id === id);

  const plainBust = bust(undefined);
  assert.equal(plainBust.faceDown, true);
  assert.match(find(plainBust, "blackout").text, /가려지고/);
  const plainCold = coldCash(undefined);
  assert.equal(plainCold.sealHighest, true);
  assert.match(find(plainCold, "coldFeet").title, /봉인/);

  const liftedBust = bust(master);
  assert.equal(liftedBust.faceDown, false, "the fixture's mastery turns the cards face up");
  const blackout = find(liftedBust, "blackout");
  assert.ok(blackout, "the id stays: the wall is still closer");
  assert.doesNotMatch(`${blackout.title} ${blackout.text}`, /가려지|뒤집혔다/);
  assert.match(blackout.text, new RegExp(`벽이 ${BASE_SCHEMA.wallMin - plainBust.wallMin} 가까워진다`));
  assert.equal(liftedBust.wallMin, plainBust.wallMin, "and it is as close as the sentence says");

  const liftedCold = coldCash(master);
  assert.equal(liftedCold.sealHighest, false);
  const coldFeet = find(liftedCold, "coldFeet");
  assert.doesNotMatch(coldFeet.title, /봉인/);
  assert.match(coldFeet.text, /칩이 줄어든다/);
  assert.ok(liftedCold.chipsScale < BASE_SCHEMA.chipsScale * 1.5 && liftedCold.chipsScale === plainCold.chipsScale, "the chips are still thinner");

  // The reveal's "다음 판" line promises a locked card only on a board that seals one.
  const general = "이번 열기와 소모가 다음 판의 환경을 다시 계산한다.";
  assert.match(describeNextTable(describeMutations(plainCold), false), /가장 비싼 카드가 봉인된다\.$/);
  assert.equal(describeNextTable(describeMutations(liftedCold), false), general, "EXPOSE mastery lifted the seal: the id stays, nothing is locked");
  const lens = buildNextSchema({ outcome: "cash", cause: "cash", gauge: 10, pushes: 0, streak: 0, stanceMastery: { strike: 0, steady: 0, expose: 3, mastered: [] }, relics: ["glassLens"] });
  assert.deepEqual([lens.mutations.includes("coldFeet"), lens.sealHighest], [true, false], "GLASS LENS lifts it on the first rung of mastery");
  assert.equal(describeNextTable(describeMutations(lens), false), general);
  assert.equal(describeNextTable(describeMutations(buildNextSchema({ outcome: "cash", cause: "cash", gauge: 10, pushes: 0, streak: 0, relics: ["lockpick"] })), false).endsWith("봉인된다."), true, "a lockpick opens the seal sooner, and the card is still sealed");
  assert.equal(describeNextTable(describeMutations(plainBust), true), "다음 판은 벽에 닿은 대가로 바뀐 규칙으로 시작한다.");
  assert.equal(describeNextTable([], false), "");
});

/**
 * Which mutations are a breach. The briefing's red panel, its alarm and its
 * glitch answered every entry of the list until 2026-10-12 -- a charged
 * stance, a hot chain, the season's mastery and a closed case among them. A
 * mutation added to the catalogue has to be given a kind here before this
 * passes, so none is a breach, or not one, by default.
 */
const MUTATION_KINDS = {
  blackout: "penalty",
  aftershock: "penalty",
  silence: "penalty",
  heatDebt: "penalty",
  coldFeet: "penalty",
  fracture: "penalty",
  cascade: "penalty",
  overclock: "carry",
  strikeWake: "carry",
  steadyLine: "carry",
  exposedHand: "carry",
  strikeMastery: "carry",
  steadyMastery: "carry",
  exposeMastery: "carry",
  reboot: "reset",
};

test("every mutation is a penalty or it is not, and only the penalties are a breach", () => {
  assert.deepEqual(Object.keys(MUTATION_KINDS).sort(), Object.keys(MUTATIONS).sort(), "every mutation in the catalogue has a kind");
  for (const [id, kind] of Object.entries(MUTATION_KINDS)) {
    assert.equal(isPenaltyMutation(id), kind === "penalty", id);
    assert.equal(isPenaltyMutation({ id }), kind === "penalty", `${id}, as the table describes it`);
    assert.ok(MUTATIONS[id].penalty === true || !("penalty" in MUTATIONS[id]), `${id}: the mark is true or absent`);
  }
  for (const unknown of [undefined, null, "", "toString", "nothing", {}, { id: "nothing" }]) assert.equal(isPenaltyMutation(unknown), false);
});

test("a described mutation is what it was before the mark: the id and what is printed", () => {
  // One to a board: a schema holds eight at most.
  for (const id of Object.keys(MUTATIONS)) {
    const [mutation, ...rest] = describeMutations({ ...BASE_SCHEMA, mutations: [id], fracturedAxis: "trust" });
    assert.equal(rest.length, 0);
    assert.equal(mutation.id, id);
    // `lifted` is there only on a rule whose seal has been lifted: the reveal reads it.
    assert.deepEqual(Object.keys(mutation).filter((key) => key !== "lifted"), ["id", "label", "title", "text", "axis", "softenedBy"], id);
    assert.equal(mutation.label, MUTATIONS[id].label);
  }
});

test("a bust deals only penalties, a charged stance and a closed case deal none", () => {
  const ids = (schema) => schema.mutations;
  const bust = buildNextSchema({ outcome: "bust", cause: "timeout", gauge: 80, pushes: 2, streak: 0, burnAxis: "trust", caseClosed: false });
  assert.ok(ids(bust).length >= 4 && ids(bust).every(isPenaltyMutation), ids(bust).join());
  for (const [focusMode, carry] of [["strike", "strikeWake"], ["steady", "steadyLine"], ["expose", "exposedHand"]]) {
    const cash = buildNextSchema({ outcome: "cash", cause: "cash", gauge: 30, pushes: 2, streak: 0, burnAxis: null, caseClosed: false, focusMode, focusCharge: 99, focusHits: 9 });
    assert.deepEqual(ids(cash), [carry], focusMode);
    assert.equal(ids(cash).some(isPenaltyMutation), false);
  }
  const chained = buildNextSchema({ outcome: "cash", cause: "cash", gauge: 30, pushes: 2, streak: 99, burnAxis: null, caseClosed: false });
  assert.deepEqual(ids(chained), ["overclock"]);
  const closed = buildNextSchema({ outcome: "cash", cause: "cash", gauge: 30, pushes: 2, streak: 0, caseClosed: true, stanceMastery: { strike: 9, steady: 9, expose: 9 } });
  assert.deepEqual(ids(closed), ["reboot", "strikeMastery", "steadyMastery", "exposeMastery"]);
  assert.equal(ids(closed).some(isPenaltyMutation), false);
});
