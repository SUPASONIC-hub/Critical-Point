import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * Committing a decision (state/useChoiceCommit.js), run against the authored
 * season with no browser under it. The hook was loaded by one test, for the one
 * helper it exports; the commit itself -- what the log gains, where the run
 * goes, what a closed case writes and to whom -- ran only in the browser tiers.
 *
 * The hook is rendered once on the server renderer, which runs its body and
 * hands back the functions; the context it reads is this file's object, so a
 * test changes what the next press sees by changing that object.
 */
const browser = installBrowser();
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { CASE_RESULT_NODES, CASE_SEQUENCE, seasonCasesBase } = await import("../../src/gameCases.js");
const { nodes, reframeRouteNodes } = await import("../../src/gameData.js");
const { getRiskPressure, REFRAME_EFFECT } = await import("../../src/gameLogic.js");
const { BASE_SCHEMA, BUST_EFFECT, createWindow, reduceWindow } = await import("../../src/gauntlet/gauntletEngine.js");
const { addToRelicCodex, settleAgainstCodex } = await import("../../src/gauntlet/useRelicTable.js");
const { ERROR_LOG_STORAGE_KEY, parseErrorLog, SETTLED_WINDOWS_STORAGE_KEY } = await import("../../src/appConfig.js");
const { initialRunState } = await import("../../src/state/runState.js");
const { createChoiceReaders } = await import("../../src/state/useDecision.js");
const { resourceMeta } = await import("../../src/appCopy.js");
const { createSceneChallenge } = await import("../../src/viewModels/sceneViewModels.js");
const { validateTelemetryItem } = await import("../../src/state/payloadSchemas.js");
const { useChoiceCommit } = await import("../../src/state/useChoiceCommit.js");

/** The error log this device keeps, as the recovery screen reads it. */
const getLocalErrorLog = () => parseErrorLog(browser.storage.getItem(ERROR_LOG_STORAGE_KEY))?.entries ?? [];

/** What the runtime hands the hook for one scene, and a record of everything the commit did with it. */
function sceneContext(nodeId, overrides = {}) {
  const node = nodes[nodeId];
  const run = initialRunState(null, { runId: "run-unit", operatorOrigin: "courier", sessionId: "unit-session-1", now: 1_760_000_000_000, openRecovery: false });
  const did = { patches: [], rankingRows: [], queued: [], saveStatus: [], telemetryStatus: [], seasonFinals: [], kept: [] };
  let codex = { unlocked: [] };
  const context = {
    currentCase: node.caseId,
    fallbackCaseId: node.caseId,
    resolvedNodeId: nodeId,
    node,
    resources: run.resources,
    triggers: run.triggers,
    cognition: run.cognition,
    log: [],
    caseResults: {},
    completedCases: [],
    discoveredClues: [],
    gauntletRun: run.gauntletRun,
    relicTable: {
      settle: (settlement) => settleAgainstCodex(settlement, codex.unlocked),
      keepUnlocks: (unlocked) => {
        did.kept.push(unlocked);
        codex = addToRelicCodex(codex, unlocked);
      },
    },
    nodeEnteredAt: Date.now() - 9_000,
    currentCaseReframeCount: 0,
    runId: "run-unit",
    sessionId: "unit-session-1",
    sessionCode: "UNIT01",
    playerName: "분석관 김",
    activeCaseMeta: seasonCasesBase.find((item) => item.id === node.caseId),
    dataConsent: true,
    staleSave: false,
    clueCount: 0,
    casesOpened: 0,
    applyRun: (patch) => {
      did.patches.push(patch);
      return { saved: true };
    },
    appendLocalRankingRow: (row) => {
      did.rankingRows.push(row);
      return { rows: did.rankingRows, saved: true };
    },
    queueTelemetry: (item) => did.queued.push(item),
    setSaveStatus: (text) => did.saveStatus.push(text),
    setTelemetryStatus: (status) => did.telemetryStatus.push(status),
    onSeasonFinal: (results) => did.seasonFinals.push(results),
    ...overrides,
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
  return { context, did };
}

/** The hook's functions for this context, as one render returns them. */
function mount(context) {
  let api = null;
  const Probe = () => {
    api = useChoiceCommit(context);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  return api;
}

function closedWindow(kind, seed = `unit-${kind}`) {
  const fresh = createWindow({ schema: BASE_SCHEMA, seed });
  const staked = { ...fresh, selectedId: "a" };
  if (kind === "cash") return reduceWindow({ ...staked, gauge: 30, pushes: 3, elapsed: 6 }, { type: "CASH" });
  return reduceWindow({ ...staked, gauge: fresh.wall - 0.001 }, { type: "PUSH", grade: "good" });
}

test("the build under test has a server, so a closed case has somewhere to send its row", async () => {
  const { telemetryEnabled } = await import("../../src/telemetry.js");
  assert.equal(telemetryEnabled, true);
});

test("a cashed card moves the run to the scene it leads to and logs what was paid for it", () => {
  const { context, did } = sceneContext("p1_start");
  const { choose } = mount(context);
  const card = context.node.choices[0];
  const window = closedWindow("cash");
  assert.equal(window.status, "cashed");

  choose(card, window);

  assert.equal(did.patches.length, 1, "one patch: the run in memory and the save are made from it");
  const [patch] = did.patches;
  assert.equal(patch.nodeId, card.next);
  assert.equal(patch.log.length, 1);
  const [entry] = patch.log;
  assert.deepEqual(
    [entry.nodeId, entry.caseId, entry.choiceId, entry.choice, entry.reframe],
    ["p1_start", "prologue01", card.id, card.label, false],
  );
  assert.deepEqual(entry.resourcesBefore, context.resources);
  assert.deepEqual(entry.resourcesAfter, patch.resources);
  assert.notDeepEqual(patch.resources, context.resources, "the card's effect reached the resources");
  assert.deepEqual([entry.threshold.state, entry.threshold.busted, entry.threshold.cause], ["cash", false, "cash"]);
  assert.equal(entry.threshold.gauge, 30);
  assert.equal(entry.routeChangeKind, undefined);
  assert.ok(entry.observerTag, "the observer's read of the entry is on it");
  for (const trigger of context.node.triggers) assert.equal(patch.triggers[trigger], 6, `${trigger} is counted once for the scene`);
  for (const [key, value] of Object.entries(card.cognition ?? {})) assert.equal(patch.cognition[key], value);
  assert.equal(patch.echo, entry.echo);
  assert.equal(patch.gauntletRun.cashes, 1);

  // The reveal opens over the next scene and names it.
  assert.equal(patch.decisionReveal.nextNode, card.next);
  assert.equal(patch.decisionReveal.nextTitle, nodes[card.next].title);
  assert.equal(patch.decisionReveal.caseClosed, false);
  assert.equal(patch.decisionReveal.skippedTitle, null);
  assert.equal(patch.decisionReveal.verdict.outcome, "cash");

  // Nothing leaves the tab for a case that is still open; the settled seed is kept so the window cannot be replayed.
  assert.deepEqual([did.rankingRows.length, did.queued.length, did.telemetryStatus.length], [0, 0, 0]);
  assert.deepEqual(JSON.parse(browser.storage.getItem(SETTLED_WINDOWS_STORAGE_KEY)), [window.seed]);
  assert.deepEqual(did.kept.length, 1, "the feats the window proved go to the codex once the save has taken the decision");
});

test("a second press does nothing until the reveal releases the first", () => {
  const { context, did } = sceneContext("p1_start");
  const { choose, releaseAdvance } = mount(context);
  choose(context.node.choices[0], closedWindow("cash", "first"));
  choose(context.node.choices[1], closedWindow("cash", "second"));
  assert.equal(did.patches.length, 1, "the commit in progress holds the table");
  releaseAdvance();
  choose(context.node.choices[1], closedWindow("cash", "third"));
  assert.equal(did.patches.length, 2);
  assert.equal(did.patches[1].log[0].choiceId, context.node.choices[1].id);
});

test("a tab another tab has moved past commits nothing", () => {
  const { context, did } = sceneContext("p1_start", { staleSave: true });
  mount(context).choose(context.node.choices[0], closedWindow("cash"));
  assert.equal(did.patches.length, 0);
});

test("a card behind an authority gate says why it is locked, and a forced card goes through", () => {
  const { context, did } = sceneContext("p1_counter");
  const locked = context.node.choices.find((choice) => choice.requiredAuthority);
  assert.ok(locked, "p1_counter still deals a card that needs FIELD ACCESS");
  const { choose } = mount(context);

  choose(locked, closedWindow("cash"));
  assert.equal(did.patches.length, 0);
  assert.match(did.saveStatus.at(-1), /^Choice locked: FIELD ACCESS /);

  // The clock running out stakes whatever the table forces, gate or no gate.
  choose(locked, closedWindow("cash"), true);
  assert.equal(did.patches.length, 1);
  assert.equal(did.patches[0].nodeId, locked.next);
  assert.equal(did.patches[0].log[0].threshold.forced, true);
  assert.equal(did.patches[0].log[0].routeChangeKind, "evidence-turn");
});

test("a card that leads off the graph is reported and not committed", () => {
  const { context, did } = sceneContext("p1_start");
  const { choose } = mount(context);
  const before = getLocalErrorLog().length;
  choose({ ...context.node.choices[0], next: "no_such_scene" }, closedWindow("cash"));
  assert.equal(did.patches.length, 0);
  const logged = getLocalErrorLog();
  assert.equal(logged.length, before + 1);
  assert.match(JSON.stringify(logged), /silent:bad-next/);
  // And the table is not held by a commit that never started.
  choose(context.node.choices[0], closedWindow("cash", "after-bad-next"));
  assert.equal(did.patches.length, 1);
});

test("a commit that throws half way releases the table", () => {
  const { context, did } = sceneContext("p1_start");
  let fail = true;
  context.applyRun = (patch) => {
    if (fail) throw new Error("storage went away");
    did.patches.push(patch);
    return { saved: true };
  };
  const { choose } = mount(context);
  assert.throws(() => choose(context.node.choices[0], closedWindow("cash")), /storage went away/);
  fail = false;
  choose(context.node.choices[0], closedWindow("cash", "again"));
  assert.equal(did.patches.length, 1, "the next press is taken");
});

test("a bust costs the bust, and the room plays the next scene without the analyst", () => {
  const { context, did } = sceneContext("p1_start");
  const card = context.node.choices[0];
  const window = closedWindow("bust");
  assert.equal(window.status, "bust");
  mount(context).choose(card, window);

  const [patch] = did.patches;
  const [entry] = patch.log;
  assert.equal(entry.threshold.state, "bust");
  assert.equal(entry.threshold.rewardMultiplier, 1);
  assert.equal(entry.clue, null, "a bust finds nothing");
  for (const [key, value] of Object.entries(BUST_EFFECT)) {
    assert.equal(entry.effect[key] - (entry.riskRewardEffect[key] ?? 0), value, `the bust's own ${key} is on top of what the card cost`);
  }
  // The card led to p1_counter; the room went on past it.
  assert.equal(entry.skippedNodeId, card.next);
  assert.equal(entry.routeChangeKind, "blackout-skip");
  assert.notEqual(patch.nodeId, card.next);
  assert.ok(nodes[patch.nodeId], "and stayed on the authored graph");
  assert.equal(patch.decisionReveal.skippedTitle, nodes[card.next].title);
  assert.equal(patch.gauntletRun.busts, 1);
});

test("a bust on the card that closes the case still closes it: a bust never skips onto, or past, a result", () => {
  const { context, did } = sceneContext("p1_aftershock");
  const card = context.node.choices[0];
  mount(context).choose(card, closedWindow("bust"));
  assert.equal(did.patches[0].nodeId, CASE_RESULT_NODES.prologue01);
  assert.equal(did.patches[0].log[0].skippedNodeId, undefined);
  assert.deepEqual(did.patches[0].completedCases, ["prologue01"]);
});

test("판을 다시 짠다, cashed, opens the case's hidden route once; bust, it opens nothing", () => {
  const caseId = "case02";
  const route = reframeRouteNodes[caseId];
  const [nodeId, node] = Object.entries(nodes).find(([id, item]) => item.caseId === caseId && id !== route && item.choices?.some((choice) => choice.type === "reframe"));
  const reframe = node.choices.find((choice) => choice.type === "reframe");

  const first = sceneContext(nodeId);
  mount(first.context).choose(reframe, closedWindow("cash"));
  const [opened] = first.did.patches;
  assert.equal(opened.nodeId, route);
  assert.deepEqual(
    [opened.log[0].reframe, opened.log[0].reframeOpenedRoute, opened.log[0].reframeBranchId, opened.log[0].routeChangeKind],
    [true, true, route, "reframe"],
  );
  assert.match(opened.echo, /다시 짠 판을 기준으로 이어집니다\.$/);
  for (const key of Object.keys(REFRAME_EFFECT)) assert.ok(key in opened.log[0].effect, `the reframe's own ${key}, not the card's`);
  for (const trigger of node.triggers) assert.equal(opened.triggers[trigger], 10, "a reframe weighs the scene's triggers more");

  // The route is opened once a case: the second reframe goes where the card says.
  const second = sceneContext(nodeId, { currentCaseReframeCount: 1 });
  mount(second.context).choose(reframe, closedWindow("cash", "second-reframe"));
  assert.equal(second.did.patches[0].log[0].reframeBranchId, null);
  assert.equal(second.did.patches[0].log[0].reframeOpenedRoute, true);

  const bust = sceneContext(nodeId);
  mount(bust.context).choose(reframe, closedWindow("bust"));
  assert.equal(bust.did.patches[0].log[0].reframeOpenedRoute, false, "the wall took the window before the new board was laid");
  assert.equal(bust.did.patches[0].log[0].reframeBranchId, null);
});

test("closing a case writes its summary, this device's ranking row, and one telemetry row the server will take", () => {
  const { context, did } = sceneContext("p1_aftershock");
  const card = context.node.choices[1];
  mount(context).choose(card, closedWindow("cash"));

  const [patch] = did.patches;
  assert.equal(patch.nodeId, CASE_RESULT_NODES.prologue01);
  assert.equal(patch.decisionReveal.caseClosed, true);
  assert.equal(patch.decisionReveal.nextTitle, "결과 화면");
  assert.deepEqual(patch.completedCases, ["prologue01"]);
  const summary = patch.caseResults.prologue01;
  assert.deepEqual([summary.runId, summary.outcomeNodeId], ["run-unit", "p1_aftershock"]);
  assert.equal(typeof summary.endingVariant, "object", "the run keeps the ending as the report prints it");
  assert.ok(Number.isFinite(Date.parse(summary.completedAt)));
  assert.equal(summary.gauntlet.cashes, 1);

  assert.equal(did.rankingRows.length, 1);
  assert.deepEqual(
    [did.rankingRows[0].local, did.rankingRows[0].run_id, did.rankingRows[0].case_id, did.rankingRows[0].player_name],
    [true, "run-unit", "prologue01", "분석관 김"],
  );
  assert.equal(did.rankingRows[0].summary, summary);

  assert.equal(did.queued.length, 1, "one case row, and no season row for a season still open");
  const [item] = did.queued;
  assert.deepEqual(validateTelemetryItem(item), []);
  assert.deepEqual([item.type, item.payload.case_id, item.payload.run_id, item.payload.session_id], ["case", "prologue01", "run-unit", "unit-session-1"]);
  assert.equal(item.id, `case-${item.payload.event_id}`);
  assert.equal(item.payload.player_name, "익명 분석관", "the name stays on this device");
  assert.equal(item.payload.summary.endingVariant, summary.endingVariant.id, "the row names the ending by id");
  assert.equal(item.payload.decision_log.length, 1);
  assert.equal(typeof item.payload.dynamics.responseTimeSec, "number");
  assert.deepEqual(did.telemetryStatus.at(-1).tone, "pending");
  assert.deepEqual(did.seasonFinals, [], "only the finale is remembered for NEW GAME+");
});

test("without consent the case stays on this device, and says so", () => {
  const { context, did } = sceneContext("p1_aftershock", { dataConsent: false, playerName: "" });
  mount(context).choose(context.node.choices[0], closedWindow("cash"));
  assert.equal(did.queued.length, 0);
  assert.deepEqual(did.telemetryStatus, [{ tone: "local", text: "데이터 제공 동의가 없어 원격 저장을 건너뛰었습니다." }]);
  assert.equal(did.rankingRows.length, 1, "the local record does not need consent");
  assert.equal(did.rankingRows[0].player_name, "현재 분석관");
});

test("a ranking row storage would not take is said and logged, and the case still closes", () => {
  const { context, did } = sceneContext("p1_aftershock");
  context.appendLocalRankingRow = (row) => {
    did.rankingRows.push(row);
    return { rows: [], saved: false };
  };
  mount(context).choose(context.node.choices[0], closedWindow("cash"));
  assert.deepEqual(did.saveStatus, ["Local ranking save failed: browser storage is unavailable."]);
  assert.match(JSON.stringify(getLocalErrorLog()), /Local ranking save failed/);
  assert.deepEqual(did.patches[0].completedCases, ["prologue01"]);
  assert.equal(did.queued.length, 1);
});

test("a decision the save refused sends nothing and unlocks nothing", () => {
  for (const refusal of [{ stale: true }, { replay: true }]) {
    const { context, did } = sceneContext("p1_aftershock");
    context.applyRun = (patch) => {
      did.patches.push(patch);
      return refusal;
    };
    const before = browser.storage.getItem(SETTLED_WINDOWS_STORAGE_KEY);
    mount(context).choose(context.node.choices[0], closedWindow("cash", `refused-${Object.keys(refusal)[0]}`));
    assert.equal(did.patches.length, 1, "the patch was offered");
    assert.deepEqual([did.rankingRows.length, did.queued.length, did.kept.length, did.telemetryStatus.length], [0, 0, 0, 0], JSON.stringify(refusal));
    assert.equal(browser.storage.getItem(SETTLED_WINDOWS_STORAGE_KEY), before, "and the window's seed is not spent");
  }
});

test("the finale closes the season: NEW GAME+ is told, and a ranking row waits behind the last case row", () => {
  const finaleId = Object.keys(nodes).find((id) => nodes[id].caseId === "final" && nodes[id].choices?.some((choice) => choice.next === CASE_RESULT_NODES.final));
  const earlier = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
  const caseResults = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B", assistTime: caseId === earlier[3] ? 2 : 1 }]));
  const { context, did } = sceneContext(finaleId, { completedCases: earlier, caseResults });
  const card = context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final);
  mount(context).choose(card, closedWindow("cash"));

  const [patch] = did.patches;
  assert.equal(patch.completedCases.length, CASE_SEQUENCE.length);
  const summary = patch.caseResults.final;
  assert.equal(summary.assistTime, 2, "the finale carries the slowest table clock of the season");
  assert.equal(patch.gauntletRun.relicOffer.length, 0, "nothing is drafted after the last case");

  assert.equal(did.seasonFinals.length, 1);
  assert.equal(did.seasonFinals[0].final, summary);
  assert.equal(Object.keys(did.seasonFinals[0]).length, CASE_SEQUENCE.length);

  assert.deepEqual(did.rankingRows.map((row) => row.case_id), ["final", "season-final"]);
  assert.deepEqual(did.queued.map((item) => item.id), [`case-${did.queued[0].payload.event_id}`, "season-final-run-unit"]);
  assert.equal(did.queued[1].label, "SEASON 01 COMPLETE");
  assert.deepEqual(validateTelemetryItem(did.queued[1]), []);
});

test("a finale closed without consent sends no ranking row either: the run cannot rank", () => {
  const finaleId = Object.keys(nodes).find((id) => nodes[id].caseId === "final" && nodes[id].choices?.some((choice) => choice.next === CASE_RESULT_NODES.final));
  const earlier = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
  const { context, did } = sceneContext(finaleId, { completedCases: earlier, dataConsent: false });
  mount(context).choose(context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final), closedWindow("cash"));
  assert.deepEqual(did.queued, []);
  assert.deepEqual(did.rankingRows.map((row) => row.case_id), ["final", "season-final"], "this device still ranks it");
});
