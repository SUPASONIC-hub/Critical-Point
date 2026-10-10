import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The finale's 33rd floor (`f_confront`, src/nodes/finalCase.js).
 *
 * 윤상혁 was met on one path of four. Every path now makes its own last
 * decision in B2, goes up to him, and comes back down to `f_choice`; the four
 * cards he is answered with are four names for the empty box. What is held
 * here is the shape of that night, read off the built graph, and what a save
 * written before it does: the saves in `fixtures/saves/v2-pre-33f-*.json` were
 * played and written by the build at 7e54cdf, and are walked on with this
 * build's own commit (state/useChoiceCommit.js).
 */
installBrowser();
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { parseCurrentSavedState, SAVE_SCHEMA_VERSION } = await import("../../src/appConfig.js");
const { CASE_RESULT_NODES, seasonCasesBase } = await import("../../src/gameCases.js");
const { caseOpeningRoutes, continuityMemoryChoicePlans, getCaseBranchNodes, nodes, reframeRouteNodes } = await import("../../src/gameData.js");
const { getCasesOpened, getRiskPressure } = await import("../../src/gameLogic.js");
const { BASE_SCHEMA, BUST_EFFECT, createWindow, reduceWindow } = await import("../../src/gauntlet/gauntletEngine.js");
const { addToRelicCodex, settleAgainstCodex } = await import("../../src/gauntlet/useRelicTable.js");
const { resourceMeta } = await import("../../src/appCopy.js");
const { applyRunPatch, initialRunState } = await import("../../src/state/runState.js");
const { repairSavedState } = await import("../../src/state/savedState.js");
const { useChoiceCommit } = await import("../../src/state/useChoiceCommit.js");
const { createChoiceReaders } = await import("../../src/state/useDecision.js");
const { runsInto } = await import("../../src/seasonRules.js");
const { createSceneChallenge } = await import("../../src/viewModels/sceneViewModels.js");

const FLOOR = "f_confront";
const RESULT = CASE_RESULT_NODES.final;
const OPENINGS = ["f_start", ...Object.values(caseOpeningRoutes.final)];
const finaleScenes = Object.entries(nodes).filter(([, node]) => node.caseId === "final");

/** One cashed card on the run, committed by the runtime's own hook. */
function commitOn(run, card, { reframesOpened, bust = false } = {}) {
  const node = nodes[run.nodeId];
  let patch = null;
  let codex = { unlocked: [] };
  const context = {
    currentCase: run.currentCase,
    fallbackCaseId: run.currentCase,
    resolvedNodeId: run.nodeId,
    node,
    resources: run.resources,
    triggers: run.triggers,
    cognition: run.cognition,
    log: run.log,
    caseResults: run.caseResults,
    completedCases: run.completedCases,
    discoveredClues: run.discoveredClues,
    gauntletRun: run.gauntletRun,
    relicTable: {
      settle: (settlement) => settleAgainstCodex(settlement, codex.unlocked),
      keepUnlocks: (unlocked) => {
        codex = addToRelicCodex(codex, unlocked);
      },
    },
    nodeEnteredAt: Date.now() - 9_000,
    currentCaseReframeCount: reframesOpened ?? run.log.filter((entry) => entry.reframeOpenedRoute && entry.caseId === run.currentCase).length,
    runId: run.runId,
    sessionId: run.sessionId,
    sessionCode: "UNIT33",
    playerName: run.playerName,
    activeCaseMeta: seasonCasesBase.find((item) => item.id === run.currentCase),
    dataConsent: false,
    staleSave: false,
    clueCount: run.discoveredClues.length,
    casesOpened: getCasesOpened(run.currentCase),
    applyRun: (next) => {
      patch = next;
      return { saved: true };
    },
    appendLocalRankingRow: () => ({ rows: [], saved: true }),
    queueTelemetry: () => {},
    setSaveStatus: () => {},
    setTelemetryStatus: () => {},
    onSeasonFinal: () => {},
  };
  context.riskPressure = getRiskPressure(context.resources);
  context.sceneChallenge = createSceneChallenge({ reframeChoice: null, reframeCombo: 0, inheritedChallenge: null, node, riskPressure: context.riskPressure });
  context.readers = createChoiceReaders({
    sceneChallenge: context.sceneChallenge,
    resources: context.resources,
    log: context.log,
    riskPressure: context.riskPressure,
    discoveredClues: context.discoveredClues,
    currentCase: context.currentCase,
    resourceMeta,
  });
  let api = null;
  const Probe = () => {
    api = useChoiceCommit(context);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: `unit-33f:${run.log.length}:${run.nodeId}` });
  const closed = bust
    ? reduceWindow({ ...fresh, selectedId: card.id, gauge: fresh.wall - 0.001 }, { type: "PUSH", grade: "good" })
    : reduceWindow({ ...fresh, selectedId: card.id, gauge: 30, pushes: 3, elapsed: 6 }, { type: "CASH" });
  assert.equal(closed.status, bust ? "bust" : "cashed");
  api.choose(card, closed);
  assert.ok(patch, `${run.nodeId}/${card.id} was committed`);
  return applyRunPatch(run, { ...patch, decisionReveal: null });
}

/** A run standing on a scene of the finale, with nothing behind it. */
function runAt(nodeId) {
  const base = initialRunState(null, { runId: "run-unit-33f", operatorOrigin: "lab", sessionId: "unit-session-33f", now: 1_760_000_000_000, openRecovery: false });
  return applyRunPatch(base, { currentCase: "final", nodeId, started: true });
}

/**
 * Where a cashed card sends the run, as the commit decides it: 판을 다시 짠다
 * opens the hidden route once a case, except from a scene that route runs into.
 */
function nextOf(nodeId, card, reframed) {
  if (card.type !== "reframe" || reframed) return card.next;
  const hidden = reframeRouteNodes.final;
  if (runsInto(nodes, hidden, nodeId)) return card.next;
  return nodeId === hidden ? card.next : hidden;
}

/** How many times a walk from here can meet the 33rd floor before the result: every count some walk makes. */
const floorCounts = new Map();
function countsFrom(nodeId, reframed) {
  if (nodeId === RESULT) return new Set([0]);
  const key = `${nodeId}|${reframed}`;
  if (floorCounts.has(key)) return floorCounts.get(key);
  const counts = new Set();
  floorCounts.set(key, counts);
  const node = nodes[nodeId];
  assert.ok(node, `${nodeId} is a scene of the graph`);
  const memory = OPENINGS.includes(nodeId)
    ? [continuityMemoryChoicePlans.final.systemNext, continuityMemoryChoicePlans.final.evidenceNext].map((next) => ({ id: "memory", next }))
    : [];
  for (const card of [...node.choices, ...memory]) {
    const isReframe = card.type === "reframe";
    for (const count of countsFrom(nextOf(nodeId, card, reframed), reframed || isReframe)) counts.add(count + (nodeId === FLOOR ? 1 : 0));
  }
  return counts;
}

test("every walk of the finale meets 윤상혁 on the 33rd floor exactly once", () => {
  for (const opening of OPENINGS) {
    assert.deepEqual([...countsFrom(opening, false)], [1], opening);
  }
  // The hidden route and the evidence turn are walked above (a reframe from an
  // opening or from f_archive, the fourth card of a route scene, a memory
  // card); they are named here so a rewiring that drops one fails by name.
  for (const entry of ["f_route_map", "f_route_expose", "f_route_contain", "f_route_system", "f_evidence_turn"]) {
    assert.deepEqual([...countsFrom(entry, false)], [1], entry);
    assert.deepEqual([...countsFrom(entry, true)], [1], `${entry}, the case's reframe already spent`);
  }
  // And each path makes its own last decision before it goes up.
  for (const finalId of ["f_final_map", "f_final_expose", "f_final_contain", "f_final_system", "f_evidence_turn"]) {
    assert.deepEqual([...new Set(nodes[finalId].choices.map((card) => card.next))], [FLOOR], finalId);
  }
  assert.deepEqual([...new Set(nodes[FLOOR].choices.map((card) => card.next))], ["f_choice"]);
  assert.deepEqual([...new Set(nodes.f_choice.choices.map((card) => card.next))], ["f_aftershock"]);
});

test("the three paths keep their own middles, and the expose path reaches the end terminal without the 33rd floor in between", () => {
  const leadsTo = (nodeId) => [...new Set(nodes[nodeId].choices.filter((card) => !card.id.endsWith("_evidence_turn")).map((card) => card.next))];
  const walk = (from) => {
    const trail = [from];
    while (trail.at(-1) !== FLOOR) {
      const next = leadsTo(trail.at(-1));
      assert.equal(next.length, 1, `${trail.at(-1)} leads one way`);
      trail.push(next[0]);
    }
    return trail;
  };
  assert.deepEqual(walk("f_route_map"), ["f_route_map", "f_archive", "f_witness", "f_witness_reaction", "f_final_map", FLOOR]);
  assert.deepEqual(walk("f_route_expose"), ["f_route_expose", "f_dilemma", "f_dilemma_reaction", "f_final_expose", FLOOR]);
  assert.deepEqual(walk("f_route_contain"), ["f_route_contain", "f_branch_witness", "f_branch_witness_follow", "f_final_contain", FLOOR]);
  assert.deepEqual(walk("f_route_system"), ["f_route_system", "f_final_system", FLOOR]);
});

test("the witness side branch is entered from the inside route's scene and from nowhere else", () => {
  const into = (target) => finaleScenes.filter(([, node]) => node.choices.some((card) => card.next === target)).map(([nodeId]) => nodeId);
  assert.deepEqual(into("f_branch_witness"), ["f_route_contain"]);
  assert.deepEqual(into("f_branch_witness_follow"), ["f_branch_witness"]);
  const doors = finaleScenes.flatMap(([nodeId, node]) => node.choices.filter((card) => card.branchId).map((card) => [nodeId, card.id, card.branchId]));
  assert.deepEqual(doors, [["f_route_contain", "f_route_contain_pause", "f_branch_witness"]], "one door, and none left on the 33rd floor");
  assert.equal(getCaseBranchNodes().find((fork) => fork.caseId === "final").nodeId, "f_route_contain");
});

/**
 * The four cards are new words on the four slots the scene had. What each slot
 * pays and which way of thinking it counts are the values `f_confront_seal`,
 * `_reform`, `_destroy` and `_pact` carried on origin/main at 7e54cdf, written
 * out here so a change to either is a change to this table.
 */
const SLOTS = {
  f_confront_mine: { was: "f_confront_seal", effect: { legitimacy: 5, trust: -2, humanCost: 4, fatigue: 2 }, cognition: { risk: 2 } },
  f_confront_all: { was: "f_confront_reform", effect: { trust: 9, legitimacy: 6, humanCost: -4, fatigue: 5 }, cognition: { reframing: 3, persistence: 1 } },
  f_confront_his: { was: "f_confront_destroy", effect: { trust: 5, legitimacy: 8, fatigue: 4 }, cognition: { persistence: 2, risk: 1 } },
  f_confront_ask: { was: "f_confront_pact", effect: { trust: 11, legitimacy: -8, humanCost: -4, time: -4, fatigue: 4 }, cognition: { reframing: 2 } },
};

test("the 33rd floor deals four names for the box, none of them 판을 다시 짠다, at the old slots' prices", () => {
  const cards = nodes[FLOOR].choices;
  assert.equal(cards.length, 4);
  assert.deepEqual(cards.map((card) => card.id).sort(), Object.keys(SLOTS).sort());
  assert.ok(cards.every((card) => card.type !== "reframe"));
  for (const card of cards) {
    // Key order too: the effect is printed and applied in the order it is written.
    assert.equal(JSON.stringify(card.effect), JSON.stringify(SLOTS[card.id].effect), `${card.id} pays what ${SLOTS[card.id].was} paid`);
    assert.equal(JSON.stringify(card.cognition), JSON.stringify(SLOTS[card.id].cognition), `${card.id} counts as ${SLOTS[card.id].was} did`);
    assert.match(card.label, /이름/, `${card.id} answers whose name`);
  }
  // No scene of the finale still deals a retired id.
  const dealt = new Set(finaleScenes.flatMap(([, node]) => node.choices.map((card) => card.id)));
  for (const { was } of Object.values(SLOTS)) assert.ok(!dealt.has(was), was);
  assert.equal(nodes[FLOOR].question, "서명란을 비워 둔 사람이 펜을 내밉니다. 그 칸에 누구의 이름을 넣겠습니까?");
});

test("판을 다시 짠다 on a scene the hidden route runs into goes where the card says, not round again", () => {
  const hidden = reframeRouteNodes.final;
  assert.equal(hidden, "f_route_system");
  // The rule itself: what the hidden route runs into.
  assert.deepEqual(
    finaleScenes.map(([nodeId]) => nodeId).filter((nodeId) => runsInto(nodes, hidden, nodeId)).sort(),
    ["f_aftershock", "f_choice", "f_confront", "f_evidence_turn", "f_final_system"],
  );
  assert.equal(runsInto(nodes, hidden, hidden), false);
  assert.equal(runsInto(nodes, hidden, "f_archive"), false);

  // f_choice: the first reframe of the case used to jump to f_route_system,
  // whose final came back to f_choice a second time.
  const reframe = nodes.f_choice.choices.find((card) => card.type === "reframe");
  const closed = commitOn(runAt("f_choice"), reframe);
  assert.equal(closed.nodeId, "f_aftershock");
  assert.deepEqual([closed.log[0].reframe, closed.log[0].reframeOpenedRoute, closed.log[0].reframeBranchId, closed.log[0].routeChangeKind], [true, true, null, undefined]);

  // f_confront deals no such card; if one were dealt there it would not open the route either.
  const onFloor = commitOn(runAt(FLOOR), { ...reframe, next: "f_choice" });
  assert.equal(onFloor.nodeId, "f_choice");
  assert.equal(onFloor.log[0].reframeBranchId, null);

  // Everywhere before the route, the card still opens it, once.
  for (const from of ["f_start", "f_archive"]) {
    const card = nodes[from].choices.find((choice) => choice.type === "reframe");
    assert.equal(commitOn(runAt(from), card).nodeId, hidden, from);
    assert.equal(commitOn(runAt(from), card, { reframesOpened: 1 }).nodeId, card.next, `${from}, a second time`);
  }
});

test("in every other case the rule changes nothing: no scene with a reframe card sits past its hidden route", () => {
  const past = Object.entries(reframeRouteNodes).flatMap(([caseId, hidden]) =>
    Object.entries(nodes)
      .filter(([nodeId, node]) => node.caseId === caseId && node.choices.some((card) => card.type === "reframe") && runsInto(nodes, hidden, nodeId))
      .map(([nodeId]) => nodeId));
  assert.deepEqual(past, ["f_choice"]);
});

test("a bust on a path's last decision still goes up to the 33rd floor, and costs what a bust costs", () => {
  // The scene says it itself (`attended` in its scene context), and it is the only one in the season that does.
  assert.deepEqual(Object.entries(nodes).filter(([, node]) => node.attended).map(([nodeId]) => nodeId), [FLOOR]);

  for (const finalId of ["f_final_map", "f_final_expose", "f_final_contain", "f_final_system", "f_evidence_turn"]) {
    for (const card of nodes[finalId].choices) {
      const after = commitOn(runAt(finalId), card, { bust: true });
      const [entry] = after.log;
      assert.equal(after.nodeId, FLOOR, `${finalId}/${card.id}: the run lands on the 33rd floor`);
      assert.equal(entry.skippedNodeId, undefined, `${finalId}/${card.id}: nothing was played without the analyst`);
      assert.notEqual(entry.routeChangeKind, "blackout-skip");
      assert.equal(after.decisionReveal, null);
      assert.equal(entry.threshold.state, "bust");
      for (const [key, value] of Object.entries(BUST_EFFECT)) {
        assert.equal(entry.effect[key] - (entry.riskRewardEffect[key] ?? 0), value, `${finalId}/${card.id}: the bust's own ${key}`);
      }
      assert.equal(after.gauntletRun.busts, 1);
    }
  }

  // The rule is this scene's alone. A bust on the 33rd floor's own card is a
  // bust like any other: the room plays f_choice without the analyst.
  const [floorCard] = nodes[FLOOR].choices;
  const past = commitOn(runAt(FLOOR), floorCard, { bust: true });
  assert.deepEqual([past.nodeId, past.log[0].skippedNodeId, past.log[0].routeChangeKind], ["f_aftershock", "f_choice", "blackout-skip"]);
  // And a bust one scene earlier skips what it always skipped, not the floor.
  const earlier = commitOn(runAt("f_dilemma_reaction"), nodes.f_dilemma_reaction.choices[0], { bust: true });
  assert.deepEqual([earlier.nodeId, earlier.log[0].skippedNodeId], [FLOOR, "f_final_expose"]);
});

/** `useRuntimeSavedState`'s pipeline, then the run the page starts from. */
function resume(name) {
  const fixture = JSON.parse(readFileSync(fileURLToPath(new URL(`./fixtures/saves/${name}`, import.meta.url)), "utf8"));
  const { state, repaired } = repairSavedState(parseCurrentSavedState(JSON.stringify(fixture.save), SAVE_SCHEMA_VERSION));
  assert.equal(repaired, false, `${name}: nothing in the save had to be replaced or dropped`);
  assert.equal(state.lastError, undefined, `${name}: so there is no 복구됨 notice`);
  assert.equal(state.nodeId, fixture.save.nodeId, `${name}: and the run is where it was put down`);
  assert.deepEqual(state.log.map((entry) => entry.choiceId), fixture.save.log.map((entry) => entry.choiceId), `${name}: with every decision it had made`);
  const run = initialRunState(state, { runId: "run-ctx", operatorOrigin: "lab", sessionId: "session-ctx", now: 1_760_000_000_000, openRecovery: false });
  return { fixture, run };
}

/** Lead cards to the result; the scenes the run stood on, in order. */
function playOut(run) {
  const trail = [run.nodeId];
  let current = run;
  while (current.nodeId !== RESULT) {
    assert.ok(trail.length < 20, `the run is going round: ${trail.join(" > ")}`);
    const node = nodes[current.nodeId];
    const card = node.choices.find((choice) => choice.id === node.leadChoiceId) ?? node.choices[0];
    current = commitOn(current, card);
    trail.push(current.nodeId);
  }
  return { trail, run: current };
}

test("a run put down on the old 33rd floor resumes there, is dealt the four new cards, and goes down to the last decision", () => {
  const { run } = resume("v2-pre-33f-at-confront.json");
  assert.equal(run.nodeId, FLOOR);
  assert.deepEqual(nodes[run.nodeId].choices.map((card) => card.id).sort(), Object.keys(SLOTS).sort());
  const { trail, run: closed } = playOut(run);
  assert.deepEqual(trail, [FLOOR, "f_choice", "f_aftershock", RESULT]);
  assert.deepEqual(closed.completedCases.at(-1), "final");
  assert.ok(closed.caseResults.final.endingVariant, "the season closes on an ending");
});

test("a run that answered the old 33rd floor and was put down after it keeps its log and reaches the result, by way of the floor again", () => {
  // Known and accepted: these two saves meet the 33rd floor a second time. No
  // alias map sends them round it, and nothing is stripped on load.
  const atDilemma = resume("v2-pre-33f-at-dilemma.json");
  assert.ok(atDilemma.run.log.some((entry) => entry.choiceId === "f_confront_reform"), "the log holds a card this build no longer deals");
  const expose = playOut(atDilemma.run);
  assert.deepEqual(expose.trail, ["f_dilemma", "f_dilemma_reaction", "f_final_expose", FLOOR, "f_choice", "f_aftershock", RESULT]);
  assert.equal(expose.run.log.filter((entry) => entry.nodeId === FLOOR).length, 2);
  assert.equal(expose.run.log.find((entry) => entry.nodeId === FLOOR).choiceId, "f_confront_reform", "the old answer is still the first one in the record");

  const inBranch = resume("v2-pre-33f-in-branch.json");
  assert.ok(inBranch.run.log.some((entry) => entry.choiceId === "f_confront_seal"));
  const inside = playOut(inBranch.run);
  assert.deepEqual(inside.trail, ["f_branch_witness", "f_branch_witness_follow", "f_final_contain", FLOOR, "f_choice", "f_aftershock", RESULT]);
  assert.equal(inside.run.log.filter((entry) => entry.nodeId === FLOOR).length, 2);
  for (const closed of [expose.run, inside.run]) assert.ok(closed.caseResults.final.endingVariant);
});
