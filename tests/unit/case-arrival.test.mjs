import assert from "node:assert/strict";
import { test } from "node:test";

import { SEASON_ENTRY_CASE } from "../../src/gameCases.js";
import { createCaseArrival, prepareGameRuntime, savedRunNamesOtherCases, storageNeedsEveryCase, whenCaseReady } from "../../src/state/caseArrival.js";

/**
 * What the runtime waits for before it mounts, and before it opens a case
 * (src/state/caseArrival.js), against a store the test controls.
 */
function fakeStore({ failWith = null } = {}) {
  const calls = [];
  const loaded = new Set();
  return {
    calls,
    loaded,
    isCaseLoaded: (caseId) => loaded.has(caseId),
    ensureCase: (caseId) => {
      calls.push(`case:${caseId}`);
      if (failWith) return Promise.reject(failWith);
      loaded.add(caseId);
      return Promise.resolve();
    },
    ensureAllCases: () => {
      calls.push("all");
      return failWith ? Promise.reject(failWith) : Promise.resolve();
    },
  };
}

test("a first visit waits for the first case and fetches the rest behind it; a save waits for all", async () => {
  const fresh = fakeStore();
  await createCaseArrival(fresh).prepareGameRuntime({ hasSave: false });
  assert.deepEqual(fresh.calls, [`case:${SEASON_ENTRY_CASE}`, "all"]);

  const saved = fakeStore();
  await createCaseArrival(saved).prepareGameRuntime({ hasSave: true });
  assert.deepEqual(saved.calls, ["all"]);
});

test("the background fetch failing does not fail the first visit", async () => {
  const store = fakeStore();
  store.ensureAllCases = () => Promise.reject(new Error("offline"));
  await createCaseArrival(store).prepareGameRuntime({ hasSave: false });
});

test("a case opens at once when it is here, and when it lands otherwise", async () => {
  const store = fakeStore();
  const { whenCaseReady: ready } = createCaseArrival(store);
  const opened = [];
  store.loaded.add("case01");
  ready("case01", () => opened.push("case01"));
  assert.deepEqual(opened, ["case01"], "synchronously");
  await ready("case02", () => opened.push("case02"));
  assert.deepEqual(opened, ["case01", "case02"]);
});

test("a case file a deploy removed reloads the page; any other failure is thrown", async () => {
  const missing = new TypeError("Failed to fetch dynamically imported module: /assets/case03.js");
  let reloads = 0;
  await createCaseArrival(fakeStore({ failWith: missing }), { reload: () => ++reloads > 0 }).whenCaseReady("case03", () => assert.fail("opened"));
  assert.equal(reloads, 1);
  await assert.rejects(
    createCaseArrival(fakeStore({ failWith: missing }), { reload: () => false }).whenCaseReady("case03", () => {}),
    /Failed to fetch/,
    "already reloaded once: the panel answers it",
  );
  await assert.rejects(createCaseArrival(fakeStore({ failWith: new Error("bad data") })).whenCaseReady("case03", () => {}), /bad data/);
});

test("a save just written for a first start does not ask for every case; a run under way does", () => {
  const fresh = { currentCase: SEASON_ENTRY_CASE, nodeId: "p1_start", log: [], completedCases: [], caseResults: {} };
  assert.equal(savedRunNamesOtherCases(fresh), false);
  assert.equal(storageNeedsEveryCase({ saved: fresh }), false, "the shell wrote this before the runtime mounted");
  assert.equal(storageNeedsEveryCase({ saved: null }), false, "no save at all");

  assert.equal(savedRunNamesOtherCases({ ...fresh, log: [{ nodeId: "p1_start" }] }), true);
  assert.equal(savedRunNamesOtherCases({ ...fresh, completedCases: [SEASON_ENTRY_CASE] }), true);
  assert.equal(savedRunNamesOtherCases({ ...fresh, caseResults: { [SEASON_ENTRY_CASE]: {} } }), true);
  assert.equal(savedRunNamesOtherCases({ ...fresh, currentCase: "case12" }), true);
});

test("a save that will not read, recovery slots, a kept copy and a replay link each ask for every case", () => {
  for (const reason of ["unreadable", "hasSlots", "hasBackup", "replay"]) {
    assert.equal(storageNeedsEveryCase({ saved: null, [reason]: true }), true, reason);
  }
});

test("a reader of the whole season runs after every case is here, and not at all when they cannot be fetched", async () => {
  const store = fakeStore();
  let release;
  store.ensureAllCases = () => new Promise((resolve) => (release = resolve));
  let reads = 0;
  const pending = createCaseArrival(store).withEveryCase(() => ++reads);
  await Promise.resolve();
  assert.equal(reads, 0, "the season is still arriving");
  release();
  assert.equal(await pending, 1);

  await assert.rejects(createCaseArrival(fakeStore({ failWith: new Error("offline") })).withEveryCase(() => assert.fail("read")), /offline/);
});

test("in Node every case is present, so the bound helpers wait for nothing", async () => {
  await prepareGameRuntime({ hasSave: false });
  let opened = 0;
  whenCaseReady("case12", () => (opened += 1));
  assert.equal(opened, 1);
});
