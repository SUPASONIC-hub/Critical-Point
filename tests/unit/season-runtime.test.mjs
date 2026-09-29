import assert from "node:assert/strict";
import { test } from "node:test";

import { buildRuntimeData, loadSeasonTables } from "../../scripts/season-split.mjs";
import { CASE_START_NODES } from "../../src/gameCases.js";
import * as gameData from "../../src/gameData.js";
import * as gameDialogue from "../../src/gameDialogue.js";
import { createSeasonRuntime } from "../../src/seasonRuntime.js";

/**
 * Step 2b of the per-case chunk split: the store the app will read
 * (src/seasonRuntime.js), fed the data it will be shipped -- through JSON, as
 * a file would carry it -- must answer exactly what gameData.js answers, both
 * with every case loaded and with only the case being played.
 */
const shipped = JSON.parse(JSON.stringify(buildRuntimeData(await loadSeasonTables())));
const caseIds = Object.keys(shipped.cases);
const copy = (value) => structuredClone(value);
const storeWith = () => createSeasonRuntime(copy(shipped.index), (caseId) => copy(shipped.cases[caseId]));

const everything = storeWith();
await Promise.all(caseIds.map((caseId) => everything.ensureCase(caseId)));

test("with every case loaded, the store holds exactly the season's tables", () => {
  assert.deepEqual(everything.nodes, gameData.nodes);
  assert.deepEqual(everything.echoReplies, gameData.echoReplies);
  assert.deepEqual(everything.choiceVoiceLines, gameData.choiceVoiceLines);
  assert.deepEqual(everything.nodeOrders, gameData.nodeOrders);
  assert.deepEqual(everything.caseOpeningRoutes, gameData.caseOpeningRoutes);
  assert.deepEqual(everything.reframeRouteNodes, gameData.reframeRouteNodes);
  assert.deepEqual(everything.characterProfiles, gameData.characterProfiles);
  assert.deepEqual(everything.getCaseBranchNodes(), gameData.getCaseBranchNodes());
  for (const pack of everything.CASE_PACKS) {
    const authored = gameData.CASE_PACKS.find((candidate) => candidate.id === pack.id);
    for (const field of Object.keys(pack)) assert.deepEqual(pack[field], authored[field], `${pack.id}.${field}`);
  }
  assert.ok(caseIds.every((caseId) => everything.isCaseLoaded(caseId)));
});

test("the rules answer as gameData.js does, for every case, opening, memory and speaker", () => {
  const memories = [{ evidenceTurn: true }, { systemRoute: true }, { routeSplit: true }, {}];
  for (const [index, caseId] of caseIds.entries()) {
    assert.equal(everything.getCaseRouteLength(caseId), gameData.getCaseRouteLength(caseId), `${caseId} route length`);
    for (const nodeId of gameData.nodeOrders[caseId]) {
      assert.equal(everything.getNodeRouteIndex(caseId, nodeId), gameData.getNodeRouteIndex(caseId, nodeId), `${caseId}/${nodeId} route index`);
    }
    const previous = caseIds[index - 1];
    const openings = [CASE_START_NODES[caseId], ...Object.values(gameData.caseOpeningRoutes[caseId] ?? {})];
    for (const nodeId of openings) {
      for (const routeMemory of memories) {
        const args = { caseId, nodeId, caseResults: previous ? { [previous]: { routeMemory } } : {} };
        assert.deepEqual(everything.getContinuityMemoryChoice(args), gameData.getContinuityMemoryChoice(args), `${caseId}/${nodeId} memory card`);
      }
    }
    for (const name of Object.keys(gameData.characterProfiles)) {
      assert.deepEqual(everything.getCharacterProfile(name, caseId), gameDialogue.getCharacterProfile(name, caseId), `${name} in ${caseId}`);
    }
  }
  const detour = { branchCondition: "costAlreadyPaid", branchBypass: "x" };
  assert.equal(everything.getBranchDetourBypass(detour, {}), gameData.getBranchDetourBypass(detour, {}));
});

test("with only the case being played loaded, its rules already answer the same", async () => {
  for (const caseId of caseIds) {
    const alone = storeWith();
    await alone.ensureCase(caseId);
    assert.equal(alone.getCaseRouteLength(caseId), gameData.getCaseRouteLength(caseId), `${caseId} alone: route length`);
    for (const nodeId of gameData.nodeOrders[caseId]) {
      assert.ok(alone.nodes[nodeId], `${caseId} alone is missing its own scene ${nodeId}`);
      assert.equal(alone.getNodeRouteIndex(caseId, nodeId), gameData.getNodeRouteIndex(caseId, nodeId), `${caseId}/${nodeId} alone`);
      for (const choice of alone.nodes[nodeId].choices) {
        if (gameData.echoReplies[choice.id] !== undefined) assert.equal(alone.echoReplies[choice.id], gameData.echoReplies[choice.id], `${choice.id} reply`);
        if (gameData.choiceVoiceLines[choice.id] !== undefined) assert.equal(alone.choiceVoiceLines[choice.id], gameData.choiceVoiceLines[choice.id], `${choice.id} voice`);
      }
    }
  }
});

test("a case arrives once, and a failed arrival is asked for again", async () => {
  let calls = 0;
  let fail = true;
  const store = createSeasonRuntime(copy(shipped.index), (caseId) => {
    calls += 1;
    if (fail) throw new Error("offline");
    return copy(shipped.cases[caseId]);
  });
  await assert.rejects(store.ensureCase(caseIds[0]), /offline/);
  assert.equal(store.isCaseLoaded(caseIds[0]), false);
  fail = false;
  await Promise.all([store.ensureCase(caseIds[0]), store.ensureCase(caseIds[0])]);
  assert.equal(calls, 2);
  assert.equal(store.isCaseLoaded(caseIds[0]), true);
  assert.equal(Object.keys(store.nodes).length, Object.keys(shipped.cases[caseIds[0]].nodes).length);
});
