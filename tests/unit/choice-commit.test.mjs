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
const { carryChoiceLinks, settleChoice } = await import("../../src/state/settleChoice.js");

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
  return reduceWindow({ ...staked, gauge: fresh.wall - 0.001 }, { type: "PUSH" });
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
  assert.equal(patch.decisionReveal.short, false, "프롤로그 01 is still introducing the table: the whole sheet");
  assert.equal(patch.decisionReveal.skippedTitle, null);
  assert.equal(patch.decisionReveal.verdict.outcome, "cash");
  assert.equal(patch.decisionReveal.echo, entry.echo, "the reveal closes on the line written for the card");

  // Nothing leaves the tab for a case that is still open; the settled seed is kept so the window cannot be replayed.
  assert.deepEqual([did.rankingRows.length, did.queued.length, did.telemetryStatus.length], [0, 0, 0]);
  assert.deepEqual(JSON.parse(browser.storage.getItem(SETTLED_WINDOWS_STORAGE_KEY)), [window.seed]);
  assert.deepEqual(did.kept.length, 1, "the feats the window proved go to the codex once the save has taken the decision");
});

// The short reveal (tableUnlocks' `isTableTaught`): the same card on the same
// scene, in a run begun with NEW GAME+, which has nothing left to be taught.
test("a run begun with NEW GAME+ is handed the short reveal on the first table of 프롤로그 01", () => {
  const plain = sceneContext("p1_start");
  const { context, did } = sceneContext("p1_start", { gauntletRun: { ...plain.context.gauntletRun, veteran: true } });
  mount(context).choose(context.node.choices[0], closedWindow("cash", "unit-veteran"));
  assert.equal(did.patches.length, 1);
  assert.equal(did.patches[0].decisionReveal.short, true);
  assert.equal(did.patches[0].decisionReveal.verdict.outcome, "cash");
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
  assert.match(did.saveStatus.at(-1), /^Choice locked: 믿음 55 이상 또는 단서 2개 이상이 필요합니다\. 지금 믿음 \d+, 단서 \d+개\.$/);

  // The clock running out stakes whatever the table forces, gate or no gate.
  choose(locked, closedWindow("cash"), true);
  assert.equal(did.patches.length, 1);
  assert.equal(did.patches[0].nodeId, locked.next);
  assert.equal(did.patches[0].log[0].threshold.forced, true);
  assert.equal(did.patches[0].decisionReveal.echo, null, "a card the clock staked was not chosen: its reveal keeps the template too");
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
  assert.ok(entry.echo, "the card has a line of its own");
  assert.equal(patch.decisionReveal.echo, null, "which says what confirming it came to: a bust closes on the sentence made from the effect");
  assert.equal(patch.decisionReveal.beat, entry.sceneBeat);
  for (const [key, value] of Object.entries(BUST_EFFECT)) {
    assert.equal(entry.effect[key] - (entry.riskRewardEffect[key] ?? 0), value, `the bust's own ${key} is on top of what the card cost`);
  }
  // The card led to p1_counter; the room went on past it.
  assert.equal(entry.skippedNodeId, card.next);
  assert.equal(entry.routeChangeKind, "blackout-skip");
  assert.notEqual(patch.nodeId, card.next);
  assert.ok(nodes[patch.nodeId], "and stayed on the authored graph");
  assert.equal(patch.decisionReveal.skippedTitle, nodes[card.next].title);
  assert.equal(patch.decisionReveal.skippedNodeId, card.next, "the reveal can open the scene's minutes");
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
  const caseResults = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B", assistTime: caseId === earlier[3] ? 2 : 1, gauntlet: { logicStreak: 0, tableRules: 3 } }]));
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

/* ------------------------------------------------------------- story mode */

/** The run as a case opened in story mode holds it (the stamp is runLifecycle's). */
const inStoryMode = (run, extra = {}) => ({ ...run, story: true, ...extra });
const finaleScene = () => {
  const finaleId = Object.keys(nodes).find((id) => nodes[id].caseId === "final" && nodes[id].choices?.some((choice) => choice.next === CASE_RESULT_NODES.final));
  return { finaleId, earlier: CASE_SEQUENCE.filter((caseId) => caseId !== "final") };
};

test("a decision at the table says nothing about story mode", () => {
  const { context, did } = sceneContext("p1_aftershock");
  mount(context).choose(context.node.choices[1], closedWindow("cash"));
  const [patch] = did.patches;
  assert.equal("assistStory" in patch.log[0], false);
  assert.equal("assistTime" in patch.log[0], false);
  assert.equal("assistStory" in patch.caseResults.prologue01, false);
  assert.equal("assistStory" in did.queued[0].payload.summary, false);
  assert.equal(patch.gauntletRun.story, false);
});

test("in a story run a bust costs the bust and the pot, and no scene is played without the analyst", () => {
  const { context, did } = sceneContext("p1_start");
  context.gauntletRun = inStoryMode(context.gauntletRun, { runPot: 500 });
  const card = context.node.choices[0];
  const window = closedWindow("bust");
  assert.equal(window.status, "bust");
  mount(context).choose(card, window);

  const [patch] = did.patches;
  const [entry] = patch.log;
  assert.equal(entry.threshold.state, "bust");
  for (const [key, value] of Object.entries(BUST_EFFECT)) {
    assert.equal(entry.effect[key] - (entry.riskRewardEffect[key] ?? 0), value, `the bust's own ${key} is still charged`);
  }
  assert.equal(entry.threshold.lostPot, 500, "and the pot is still lost");
  assert.equal(patch.gauntletRun.runPot, 0);
  assert.equal(patch.gauntletRun.busts, 1);
  // The card led to p1_counter, and that is where the run goes.
  assert.equal(patch.nodeId, card.next);
  assert.equal(entry.skippedNodeId, undefined);
  assert.equal(entry.routeChangeKind, undefined);
  assert.equal(patch.decisionReveal.skippedTitle, null);
  assert.equal(patch.decisionReveal.nextTitle, nodes[card.next].title);
  // Nor is the next board broken, and the run is still a story run.
  assert.equal(entry.environmentMode, "stable");
  assert.deepEqual(patch.gauntletRun.schema.mutations, []);
  assert.equal(patch.gauntletRun.story, true);
  // The same bust at the table, for the difference.
  const table = sceneContext("p1_start");
  mount(table.context).choose(card, closedWindow("bust", "unit-bust-table"));
  assert.equal(table.did.patches[0].log[0].routeChangeKind, "blackout-skip");

  // 프롤로그 01 has no way to break a board in any run. In 사건 01, which has
  // every rule, the table's bust breaks the next board and the story run's does not.
  const wholeTable = Object.keys(nodes).find((id) => nodes[id].caseId === "case01" && nodes[id].choices?.some((choice) => nodes[choice.next]));
  const bustIn = (run) => {
    const scene = sceneContext(wholeTable);
    scene.context.gauntletRun = run(scene.context.gauntletRun);
    mount(scene.context).choose(scene.context.node.choices.find((choice) => nodes[choice.next]), closedWindow("bust", `unit-bust-${wholeTable}`), true);
    return scene.did.patches[0];
  };
  assert.match(bustIn((run) => run).log[0].environmentMode, /blackout/);
  const storyBust = bustIn(inStoryMode);
  assert.equal(storyBust.log[0].environmentMode, "stable");
  assert.deepEqual(storyBust.gauntletRun.schema.mutations, []);
  assert.equal(storyBust.log[0].skippedNodeId, undefined);
});

test("a story run's decisions and its case summary are marked, with the clock it was given", () => {
  const { context, did } = sceneContext("p1_aftershock");
  context.gauntletRun = inStoryMode(context.gauntletRun);
  // A window cashed before its first tick has no scale of its own to report.
  const window = closedWindow("cash");
  assert.equal(window.timeScale, 1);
  mount(context).choose(context.node.choices[1], window);

  const [patch] = did.patches;
  assert.equal(patch.log[0].assistStory, true);
  assert.equal(patch.log[0].assistTime, 2, "a story run's clock is never faster than twice as slow");
  const summary = patch.caseResults.prologue01;
  assert.equal(summary.assistStory, true);
  assert.equal(summary.assistTime, 2);
  assert.equal(did.rankingRows[0].summary.assistStory, true, "this device's ranking row has it");
  // The case row is still sent, with the mark, and the server's shape check takes it.
  assert.equal(did.queued.length, 1);
  assert.deepEqual(validateTelemetryItem(did.queued[0]), []);
  assert.equal(did.queued[0].payload.summary.assistStory, true);
  assert.equal(did.queued[0].payload.decision_log[0].assistStory, true);
});

test("a story case played again at the table is still a story case: the vault it banked is still in the season", () => {
  const { context, did } = sceneContext("p1_aftershock", {
    completedCases: ["prologue01"],
    caseResults: { prologue01: { burstScore: 60, rank: "B", assistStory: true } },
  });
  assert.equal(context.gauntletRun.story, false, "the replay itself is played at the table");
  mount(context).choose(context.node.choices[1], closedWindow("cash", "replay-at-table"));
  const [patch] = did.patches;
  assert.equal("assistStory" in patch.log[0], false, "its decisions are not marked");
  assert.equal(patch.caseResults.prologue01.assistStory, true, "and the case keeps the mark of the play that banked its vault");
});

test("a season with any story case is not sent to the public ranking, and this device still ranks it with the mark", async () => {
  const { buildLeaderboard } = await import("../../src/ranking.js");
  const { finaleId, earlier } = finaleScene();
  // Every case closed at the logic table: its run summary has the table's mark (`hasBeatTableCase`).
  const plainResults = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B", gauntlet: { logicStreak: 0, tableRules: 3 } }]));
  const seasons = {
    "the finale itself": { caseResults: plainResults, story: true },
    "one case long before it": { caseResults: { ...plainResults, [earlier[7]]: { ...plainResults[earlier[7]], assistStory: true } }, story: false },
  };
  for (const [which, { caseResults, story }] of Object.entries(seasons)) {
    const { context, did } = sceneContext(finaleId, { completedCases: earlier, caseResults });
    if (story) context.gauntletRun = inStoryMode(context.gauntletRun);
    mount(context).choose(context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final), closedWindow("cash", `story-season-${story}`));

    const summary = did.patches[0].caseResults.final;
    assert.equal(did.patches[0].completedCases.length, CASE_SEQUENCE.length);
    assert.equal(summary.assistStory, true, `${which}: the finale carries the season's mark`);
    assert.equal(did.seasonFinals.length, 1, "NEW GAME+ is still told");
    // Only the case row leaves the device.
    assert.deepEqual(did.queued.map((item) => item.payload.case_id), ["final"], which);
    assert.equal(did.queued.some((item) => item.id.startsWith("season-final")), false);
    assert.equal(did.queued[0].payload.summary.assistStory, true, "the case row says why");
    assert.deepEqual(validateTelemetryItem(did.queued[0]), []);
    // The device's own ranking keeps the season, marked.
    assert.deepEqual(did.rankingRows.map((row) => row.case_id), ["final", "season-final"]);
    assert.equal(did.rankingRows[1].summary.assistStory, true);
    assert.equal(did.rankingRows[1].summary.seasonComplete, true);
    const [ranked] = buildLeaderboard(did.rankingRows);
    assert.deepEqual([ranked.seasonComplete, ranked.assistStory, ranked.isLocal], [true, true, true], which);
  }

  // A season with no story case is sent as it always was.
  const { context, did } = sceneContext(finaleId, { completedCases: earlier, caseResults: plainResults });
  mount(context).choose(context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final), closedWindow("cash", "plain-season"));
  assert.equal("assistStory" in did.patches[0].caseResults.final, false);
  assert.deepEqual(did.queued.map((item) => item.payload.case_id), ["final", "season-final"]);
  assert.equal("assistStory" in did.queued[1].payload.summary, false);
  assert.equal(buildLeaderboard(did.rankingRows)[0].assistStory, false);
});

test("a season with a case from before the logic table is not sent to the public ranking, and this device still ranks it", () => {
  const { finaleId, earlier } = finaleScene();
  const logicResults = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B", gauntlet: { logicStreak: 0, tableRules: 3 } }]));
  const seasons = {
    "a case with the beat table's summary": { ...logicResults, [earlier[3]]: { burstScore: 60, rank: "B", gauntlet: { beatCombo: 4, bestCombo: 11, grooveVault: 520 } } },
    "a case from before the table": { ...logicResults, [earlier[3]]: { burstScore: 60, rank: "B" } },
    // The finale first closed at the beat table and played again here: the server keeps the first close's row.
    "the finale's own first close": { ...logicResults, final: { burstScore: 60, rank: "B", gauntlet: { beatCombo: 2 } } },
  };
  for (const [which, caseResults] of Object.entries(seasons)) {
    const { context, did } = sceneContext(finaleId, { completedCases: caseResults.final ? [...earlier, "final"] : earlier, caseResults });
    mount(context).choose(context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final), closedWindow("cash", `beat-season-${which.length}`));
    assert.equal(did.patches[0].completedCases.length, CASE_SEQUENCE.length, which);
    // The finale just closed has the mark, as the row it is sent with has.
    assert.equal(typeof did.patches[0].caseResults.final.gauntlet.logicStreak, "number", which);
    // Its case row leaves the device as any season's does; the ranking row is not queued to be refused.
    assert.deepEqual(did.queued.map((item) => item.payload.case_id), ["final"], which);
    assert.equal(typeof did.queued[0].payload.dynamics.logicStreak, "number", which);
    assert.deepEqual(did.rankingRows.map((row) => row.case_id), ["final", "season-final"], which);
    assert.equal(did.seasonFinals.length, 1, which);
  }
});

// The replay record (F1 phase 2, gauntlet/windowTrail.js): the table hands the
// closed window over with its trail, and the entry carries what the server's
// checker plays again -- and it plays back to the very threshold logged.
test("a window handed over with its trail leaves a replay record the checker plays back to the logged threshold", async () => {
  const { appendWindowEvent } = await import("../../src/gauntlet/windowTrail.js");
  const { recheckCaseWindows } = await import("../../src/rankingRecheck.js");
  const played = (seed, presses) => {
    let window = createWindow({ schema: BASE_SCHEMA, seed });
    let trail = [];
    for (const event of presses) {
      const next = reduceWindow(window, event);
      trail = appendWindowEvent(trail, window, event, next);
      window = next;
    }
    return { ...window, trail };
  };
  const tick = { type: "TICK", delta: 0.137 };
  const cashed = played("unit-replay", [{ type: "SELECT", id: "a" }, ...Array(9).fill(tick), { type: "PUSH" }, ...Array(12).fill(tick), { type: "PUSH" }, tick, { type: "CASH" }]);
  assert.equal(cashed.status, "cashed");
  assert.ok(cashed.trail.every(([at]) => Number.isInteger(at * 1000)), "the clock is written to the thousandth");

  const { context, did } = sceneContext("p1_start");
  mount(context).choose(context.node.choices[0], cashed);
  const [entry] = did.patches[0].log;
  assert.deepEqual(entry.replay.events.map(([, code]) => code), ["S", "P", "P", "C"]);
  assert.equal(entry.replay.seed, "unit-replay");
  const row = { case_id: "prologue01", summary: {}, decision_log: [entry] };
  assert.deepEqual(recheckCaseWindows(row).counts, { match: 1, mismatch: 0, unreplayable: 0, abandoned: 0, unrecorded: 0 });
  const forged = { ...row, decision_log: [{ ...entry, threshold: { ...entry.threshold, pushes: 1 } }] };
  assert.equal(recheckCaseWindows(forged).counts.mismatch, 1);

  // No record: a window without a trail (resumed from a save that kept none), or one walked away from.
  for (const [window, which] of [[{ ...cashed, trail: null }, "no trail"], [{ ...createWindow({ schema: BASE_SCHEMA, seed: "unit-left", abandoned: true }), trail: [] }, "abandoned"]]) {
    const scene = sceneContext("p1_start");
    mount(scene.context).choose(scene.context.node.choices[0], window);
    assert.equal(scene.did.patches[0].log[0].replay, undefined, which);
  }
});

/* ------------------------------------------------------------- NEW GAME+ */

test("every case summary of a NEW GAME+ season is marked, and a plain season's never is", () => {
  const veteran = sceneContext("p1_aftershock");
  veteran.context.gauntletRun = { ...veteran.context.gauntletRun, veteran: true };
  mount(veteran.context).choose(veteran.context.node.choices[1], closedWindow("cash"));
  const summary = veteran.did.patches[0].caseResults.prologue01;
  assert.equal(summary.newGamePlus, true);
  assert.equal(veteran.did.rankingRows[0].summary.newGamePlus, true, "this device's ranking row has it");
  assert.equal(veteran.did.queued[0].payload.summary.newGamePlus, true, "the case row carries it to the server");
  assert.deepEqual(validateTelemetryItem(veteran.did.queued[0]), []);
  assert.equal("newGamePlus" in veteran.did.queued[0].payload.decision_log[0], false, "the mark is the case's, not each decision's");

  const plain = sceneContext("p1_aftershock");
  mount(plain.context).choose(plain.context.node.choices[1], closedWindow("cash"));
  assert.equal("newGamePlus" in plain.did.patches[0].caseResults.prologue01, false);
});

// F1 phase 3, S2: the commit's settlement is settleChoice.js, which a server
// check runs in node. A whole case on the audit and chain week, cashes, busts,
// a cash at the edge and a card the clock staked: at every press the hook moved
// the run to the scene, the verdict, the priced effect and the run the pure
// function gives for the same state.
test("the commit settles as settleChoice does, press by press, through a case on the audit and chain week", () => {
  let state = null;
  let presses = 0;
  for (let step = 0; step < 40; step += 1) {
    const { context, did } = sceneContext(state?.nodeId ?? "p1_start", state ? {
      resources: state.resources, triggers: state.triggers, cognition: state.cognition, log: state.log,
      gauntletRun: state.gauntletRun, discoveredClues: state.discoveredClues, clueCount: state.discoveredClues.length,
    } : {});
    if (!state) context.gauntletRun = { ...context.gauntletRun, weekRule: "audit-cascade" };
    const card = context.node.choices[step % context.node.choices.length];
    const window = step % 4 === 3 ? closedWindow("bust", `unit-settle-${step}`) : closedWindow("cash", `unit-settle-${step}`);
    const forced = step % 5 === 4;
    const pure = settleChoice(
      { caseId: context.currentCase, nodeId: context.resolvedNodeId, node: context.node, resources: context.resources, log: context.log, caseResults: context.caseResults, run: context.gauntletRun, runId: context.runId, reframeCount: 0, clueCount: context.clueCount, casesOpened: context.casesOpened, unlocked: [] },
      { choice: card, window, forced },
    );
    mount(context).choose(card, window, forced);
    const [patch] = did.patches;
    if (!patch) continue;
    presses += 1;
    const entry = patch.log.at(-1);
    assert.equal(patch.nodeId, pure.nextNode);
    assert.deepEqual(patch.decisionReveal.verdict, pure.verdict);
    assert.deepEqual(entry.riskRewardEffect, pure.gauntletEffect);
    assert.deepEqual(patch.gauntletRun, carryChoiceLinks(pure, { run: context.gauntletRun, nextLog: patch.log, runId: context.runId, caseId: context.currentCase }));
    if (patch.decisionReveal.caseClosed) break;
    state = { ...patch };
  }
  assert.ok(presses >= 5, `the case was played (${presses} presses)`);
});

test("a season ranking row storage would not take is said and logged, and the season still closes", () => {
  const finaleId = Object.keys(nodes).find((id) => nodes[id].caseId === "final" && nodes[id].choices?.some((choice) => choice.next === CASE_RESULT_NODES.final));
  const earlier = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
  const caseResults = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B", gauntlet: { logicStreak: 0, tableRules: 2 } }]));
  const { context, did } = sceneContext(finaleId, {
    completedCases: earlier,
    caseResults,
    appendLocalRankingRow: (row) => {
      did.rankingRows.push(row);
      return { rows: did.rankingRows, saved: row.case_id !== "season-final" };
    },
  });
  const card = context.node.choices.find((choice) => choice.next === CASE_RESULT_NODES.final);
  mount(context).choose(card, closedWindow("cash"));

  assert.equal(did.patches[0].completedCases.length, CASE_SEQUENCE.length);
  assert.ok(did.saveStatus.includes("Season ranking save failed: browser storage is unavailable."));
  assert.match(JSON.stringify(getLocalErrorLog()), /Season ranking save failed/);
});

// B-14(1) 「지난 시즌의 당신」 (설계 ③(a)): the season before's picks ride on
// the page, never on the commit. The same press with them and without writes
// the same log entry, case summary and ranking row, to the byte.
test("the season before's picks change nothing the commit writes", async (t) => {
  const { createSecondSeason, getScenePick } = await import("../../src/state/secondSeason.js");
  t.mock.timers.enable({ apis: ["Date"], now: 1_760_000_100_000 });
  const press = (secondSeason) => {
    browser.storage.removeItem(SETTLED_WINDOWS_STORAGE_KEY);
    const base = sceneContext("p1_aftershock");
    const { context, did } = sceneContext("p1_aftershock", { gauntletRun: { ...base.context.gauntletRun, veteran: true }, secondSeason });
    mount(context).choose(context.node.choices[1], closedWindow("cash", "unit-past-pick"));
    assert.equal(did.patches.length, 1);
    const [patch] = did.patches;
    return { log: patch.log, summary: patch.caseResults.prologue01, rows: did.rankingRows, cognition: patch.cognition, resources: patch.resources };
  };
  const picked = nodes.p1_aftershock.choices[1].id;
  const marked = createSecondSeason({ veteran: true, picks: new Map([["p1_aftershock", picked]]) });
  assert.equal(getScenePick(marked, "p1_aftershock"), picked, "the page would mark the very card pressed");
  const without = press(createSecondSeason({ veteran: true }));
  const withPicks = press(marked);
  assert.deepEqual(withPicks, without);
  assert.equal(JSON.stringify(withPicks), JSON.stringify(without));
  for (const entry of withPicks.log) assert.equal(Object.keys(entry).some((key) => /pick|past/i.test(key)), false);
});
