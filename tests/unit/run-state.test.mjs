import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
globalThis.sessionStorage = createStorage();

const { SAVE_SCHEMA_VERSION, SAVE_STATE_KEYS } = await import("../../src/appConfig.js");
const { RUN_INITIAL_STATE, serializeRunState } = await import("../../src/gauntlet/gauntletEngine.js");
const {
  applyRunPatch,
  createRunSetters,
  FRESH,
  initialRunState,
  KEEP,
  OPENING_ECHO,
  RUN_FIELD_NAMES,
  RUN_FIELDS,
  RUN_TRANSITIONS,
  runReducer,
  runTransition,
  toSavePatch,
  toSavePayload,
  transition,
} = await import("../../src/state/runState.js");

/**
 * The run's one definition (src/state/runState.js), held to what it is for:
 * no field without a rule for every transition, no key of the save without a
 * field, and the state change and the save payload read off one patch.
 * What each transition does in full is pinned in run-lifecycle.test.mjs.
 */
const context = { runId: "run-ctx", operatorOrigin: "lab", sessionId: "session-ctx", now: 1_000, openRecovery: false };
const EVENTS = {
  newGame: { type: "newGame", runId: "run-new", playerName: "분석관", now: 2_000 },
  openCase: {
    type: "openCase",
    caseId: "prologue02",
    nodeId: "p2_start",
    resources: { trust: 1 },
    openingLegacy: { title: "이어받은 판" },
    echo: "사건의 첫 줄.",
    gauntletRun: { ...RUN_INITIAL_STATE, windowIndex: 4 },
    now: 2_000,
  },
  jumpToNode: { type: "jumpToNode", caseId: "case05", nodeId: "c5_voice", completedCases: ["prologue01"], echo: "재현.", runId: "run-jump", now: 2_000 },
  reset: { type: "reset", runId: "run-reset", sessionId: "session-reset", now: 2_000 },
};

test("every field says what each of the four transitions does to it", () => {
  for (const name of RUN_FIELD_NAMES) {
    const field = RUN_FIELDS[name];
    assert.equal(typeof field.load, "function", `${name}.load`);
    assert.equal(typeof field.fresh, "function", `${name}.fresh`);
    assert.ok(field.save === null || typeof field.save === "string", `${name}.save`);
    for (const type of RUN_TRANSITIONS) {
      const rule = field[type];
      assert.ok(rule === KEEP || rule === FRESH || typeof rule === "function", `${name} has no rule for ${type}`);
    }
  }
});

test("every key of the save comes from exactly one field, or from the write itself", () => {
  const fromFields = RUN_FIELD_NAMES.map((name) => RUN_FIELDS[name]).filter((field) => field.save && !field.patchOnly).map((field) => field.save);
  assert.equal(new Set(fromFields).size, fromFields.length, "two fields share a save key");
  assert.deepEqual([...fromFields, "saveSchemaVersion", "savedAt"].sort(), [...SAVE_STATE_KEYS].sort());
});

test("the save payload is the save's keys, in the save's order, from the run", () => {
  const run = initialRunState(null, context);
  const payload = toSavePayload(run, { pendingTelemetry: [{ id: "queued" }], savedAt: "2026-10-06T00:00:00.000Z" });
  assert.deepEqual(Object.keys(payload), SAVE_STATE_KEYS);
  assert.equal(payload.saveSchemaVersion, SAVE_SCHEMA_VERSION);
  assert.equal(payload.savedAt, "2026-10-06T00:00:00.000Z");
  assert.equal(payload.paused, run.isPausedSave);
  assert.deepEqual(payload.dynamics, serializeRunState(run.gauntletRun));
  // The sender's ref is what a write holds, not the run's copy of the queue.
  assert.deepEqual(payload.pendingTelemetry, [{ id: "queued" }]);
  assert.ok(!("lastError" in payload), "the recovery notice is written only by a patch that names it");
  assert.ok(!("operatorOrigin" in payload) && !("sessionId" in payload) && !("staleSave" in payload));
});

test("a patch over the run is the same change in the save's own keys", () => {
  const held = { ...RUN_INITIAL_STATE, windowIndex: 7 };
  assert.deepEqual(toSavePatch({ isPausedSave: true, gauntletRun: held, lastRecoveredError: null, decisionReveal: { nextNode: "x" }, staleSave: true }), {
    paused: true,
    dynamics: serializeRunState(held),
    lastError: null,
  });
  assert.throws(() => toSavePatch({ notAField: 1 }), /no field named notAField/);
});

test("a transition's patch and the run after it agree, field for field, and so does the save", () => {
  const before = { ...initialRunState(null, context), started: true, log: [{ nodeId: "x" }], staleSave: true, lastSavedAt: "earlier" };
  for (const type of RUN_TRANSITIONS) {
    const patch = runTransition(before, EVENTS[type]);
    const after = transition(before, EVENTS[type]);
    for (const name of RUN_FIELD_NAMES) {
      const kept = RUN_FIELDS[name][type] === KEEP;
      assert.equal(name in patch, !kept, `${type}: ${name} is ${kept ? "kept" : "set"}`);
      assert.deepEqual(after[name], kept ? before[name] : patch[name], `${type}: ${name}`);
    }
    // What a write after the transition holds is what the patch said it would.
    const written = { ...toSavePayload(before, { savedAt: "now" }), ...toSavePatch(patch) };
    const rewritten = { ...toSavePayload(after, { savedAt: "now" }), ...toSavePatch(patch) };
    assert.deepEqual(written, rewritten, `${type}: the payload and the run after it disagree`);
  }
});

test("what the four transitions are for", () => {
  const before = { ...initialRunState(null, context), playerName: "남는 이름", playStyle: "audit", dataConsent: true, caseResults: { prologue01: { rank: "A" } }, staleSave: true };

  const fresh = transition(before, EVENTS.newGame);
  assert.equal(fresh.runId, "run-new");
  assert.equal(fresh.echo, OPENING_ECHO);
  assert.deepEqual(fresh.caseResults, {});
  assert.equal(fresh.staleSave, false, "a new run is this tab's own");
  assert.deepEqual([fresh.playStyle, fresh.dataConsent, fresh.operatorOrigin], ["audit", true, "lab"], "the setup is kept");

  const opened = transition(before, EVENTS.openCase);
  assert.equal(opened.runId, before.runId);
  assert.deepEqual(opened.caseResults, before.caseResults, "a case opens inside the run");
  assert.deepEqual([opened.currentCase, opened.nodeId, opened.echo], ["prologue02", "p2_start", "사건의 첫 줄."]);
  assert.equal(opened.gauntletRun.windowIndex, 4);
  assert.equal(opened.staleSave, true, "opening a case does not take the run back from another tab");

  const jumped = transition(before, EVENTS.jumpToNode);
  assert.deepEqual([jumped.runId, jumped.currentCase, jumped.nodeId], ["run-jump", "case05", "c5_voice"]);
  assert.deepEqual(jumped.completedCases, ["prologue01"]);
  assert.deepEqual(jumped.gauntletRun, RUN_INITIAL_STATE);

  const wiped = transition(before, EVENTS.reset);
  assert.deepEqual(
    [wiped.playerName, wiped.playStyle, wiped.dataConsent, wiped.operatorOrigin, wiped.sessionId, wiped.started],
    ["", "instinct", false, "courier", "session-reset", false],
  );
  assert.deepEqual(wiped.pendingTelemetry, []);
});

test("resume and pause change what they name and nothing else", () => {
  const paused = { ...initialRunState(null, context), started: false, isPausedSave: true, decisionReveal: { nextNode: "x" } };
  assert.deepEqual(runTransition(paused, { type: "resume", now: 5_000 }), { started: true, isPausedSave: false, nodeEnteredAt: 5_000, decisionReveal: null });
  assert.deepEqual(runTransition(paused, { type: "pause" }), { started: false, isPausedSave: true });
  assert.throws(() => runTransition(paused, { type: "teleport" }), /no transition named teleport/);
});

test("the reducer hands back the same run when nothing changed", () => {
  const run = initialRunState(null, context);
  assert.equal(runReducer(run, { type: "patch", patch: { started: run.started, log: run.log } }), run);
  assert.equal(runReducer(run, { type: "set", field: "playerName", value: run.playerName }), run);
  assert.equal(applyRunPatch(run, {}), run);
  const named = runReducer(run, { type: "set", field: "playerName", value: "새 이름" });
  assert.notEqual(named, run);
  assert.equal(named.playerName, "새 이름");
  assert.equal(runReducer(run, EVENTS.newGame).runId, "run-new");
});

test("a setter takes a value or a function of the old one, as a state setter does", () => {
  let run = initialRunState(null, context);
  const setters = createRunSetters((action) => {
    run = runReducer(run, action);
  });
  assert.deepEqual(Object.keys(setters).sort(), RUN_FIELD_NAMES.map((name) => `set${name[0].toUpperCase()}${name.slice(1)}`).sort());
  setters.setIsPausedSave(true);
  setters.setPendingTelemetry((queue) => [...queue, { id: "row" }]);
  assert.equal(run.isPausedSave, true);
  assert.deepEqual(run.pendingTelemetry, [{ id: "row" }]);
});

test("a run loaded from nothing, and from every save the fixtures keep", () => {
  const empty = initialRunState(null, context);
  assert.deepEqual(
    [empty.runId, empty.operatorOrigin, empty.sessionId, empty.nodeEnteredAt, empty.echo, empty.started, empty.dataConsent],
    ["run-ctx", "lab", "session-ctx", 1_000, OPENING_ECHO, false, false],
  );
  assert.deepEqual(empty.gauntletRun, RUN_INITIAL_STATE);

  const directory = fileURLToPath(new URL("./fixtures/saves/", import.meta.url));
  const files = readdirSync(directory).filter((file) => file.endsWith(".json"));
  assert.ok(files.length > 0);
  for (const file of files) {
    const saved = JSON.parse(readFileSync(`${directory}${file}`, "utf8"));
    const run = initialRunState(saved, context);
    assert.deepEqual(Object.keys(run), RUN_FIELD_NAMES, file);
    // What is in the save is what the run holds; what is not falls back.
    assert.equal(run.runId, saved.runId || "run-ctx", file);
    assert.equal(run.isPausedSave, saved.paused ?? false, file);
    assert.equal(run.lastSavedAt, saved.savedAt ?? "", file);
    assert.equal(run.dataConsent, saved.dataConsent === true, file);
    assert.deepEqual(run.lastRecoveredError, saved.lastError ?? null, file);
    assert.deepEqual(run.log, saved.log ?? [], file);
  }
});

test("the hook starts a run from the save and what the device holds, read once", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { useRunState } = await import("../../src/state/useRunState.js");
  let reads = 0;
  let held;
  function Probe() {
    held = useRunState({ runId: "run-saved", playerName: "저장된 이름", paused: true }, () => {
      reads += 1;
      return context;
    });
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  assert.equal(reads, 1);
  assert.deepEqual(held.run, initialRunState({ runId: "run-saved", playerName: "저장된 이름", paused: true }, context));
  assert.equal(typeof held.patchRun, "function");
  assert.equal(typeof held.setters.setPlayerName, "function");
});

test("a string where the consent flag belongs is not consent", () => {
  assert.equal(initialRunState({ dataConsent: "false" }, context).dataConsent, false);
  assert.equal(initialRunState({ dataConsent: "true" }, context).dataConsent, false);
});
