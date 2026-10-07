import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
globalThis.sessionStorage = createStorage();

const { isSavedStateShapeValid, SAVE_STATE_KEYS } = await import("../../src/appConfig.js");
const { getOperatorProfiles } = await import("../../src/advancedSystems.js");
const { RUN_INITIAL_STATE, serializeRunState } = await import("../../src/gauntlet/gauntletEngine.js");
const { applyRunPatch, initialRunState, RUN_FIELD_NAMES, RUN_FIELDS, toSavePayload, transition } = await import("../../src/state/runState.js");
const { createStartSave } = await import("../../src/state/shellStartSave.js");

/**
 * 시작 is pressed in one of two places. Before the runtime has loaded, the
 * shell writes the new run's save itself (shellStartSave.js); after, the
 * runtime writes it off `RUN_FIELDS`' newGame rule. The shell's copy is typed
 * out by hand because it cannot import the table's engine, and it had drifted:
 * an empty echo, and no `dynamics` key at all. Loading hid both, so nothing
 * failed -- which is how a third difference would arrive unseen too.
 *
 * These hold the two saves together key by key, and say which keys differ on
 * purpose.
 */
const NOW = 5_000;
const RUN_ID = "run-new";
const SAVED_AT = new Date(NOW).toISOString();

/** The save the runtime writes for the same press, on the same device. */
function runtimeStart({ playerName, playStyle, dataConsent, operatorOrigin }) {
  const context = { runId: "run-old", operatorOrigin, sessionId: "session", now: 1_000, openRecovery: false };
  // What the player set on the intro is in the run before 시작 is pressed.
  const before = applyRunPatch(initialRunState(null, context), { playerName, playStyle, dataConsent });
  const run = transition(before, { type: "newGame", runId: RUN_ID, playerName: playerName.trim() || "분석관", now: NOW });
  return { run, context, save: toSavePayload(run, { savedAt: SAVED_AT }) };
}

const ORIGINS = getOperatorProfiles().map((profile) => profile.id);
const SETUPS = [
  ...ORIGINS.map((operatorOrigin) => ({ playerName: "한서윤", playStyle: "instinct", dataConsent: true, operatorOrigin })),
  { playerName: "", playStyle: "instinct", dataConsent: false, operatorOrigin: "courier" },
];

test("the shell's first save has every key of the save, in the save's order", () => {
  const save = createStartSave(SETUPS[0], { now: NOW, runId: RUN_ID });
  assert.deepEqual(Object.keys(save), SAVE_STATE_KEYS);
  assert.ok(isSavedStateShapeValid(save), "the runtime's own validator, table record included");
});

test("the shell's first save is the runtime's, key for key", () => {
  assert.ok(ORIGINS.length > 1);
  for (const setup of SETUPS) {
    const shell = createStartSave(setup, { now: NOW, runId: RUN_ID });
    const runtime = runtimeStart(setup);
    for (const key of SAVE_STATE_KEYS) {
      // The one key held to a looser rule; the next test is about it.
      if (key === "dynamics") continue;
      assert.deepEqual(shell[key], runtime.save[key], `${key} (${setup.operatorOrigin}, "${setup.playerName}")`);
    }
  }
});

test("the table record the shell leaves empty is read as the one the runtime writes", () => {
  const shell = createStartSave(SETUPS[0], { now: NOW, runId: RUN_ID });
  const runtime = runtimeStart(SETUPS[0]);
  // The engine is not in the entry chunk, so the shell writes the format's
  // "no table yet" and the runtime's load makes the opening table of it.
  assert.equal(shell.dynamics, null);
  assert.deepEqual(RUN_FIELDS.gauntletRun.load(shell), RUN_INITIAL_STATE);
  assert.deepEqual(serializeRunState(shell.dynamics), runtime.save.dynamics);
});

test("the run loaded from the shell's save is the run the runtime's new game leaves", () => {
  for (const setup of SETUPS) {
    const shell = createStartSave(setup, { now: NOW, runId: RUN_ID });
    const runtime = runtimeStart(setup);
    const loaded = initialRunState(shell, runtime.context);
    for (const name of RUN_FIELD_NAMES) {
      // The runtime's run learns the time from the write that follows; the
      // loaded one reads it off the save that write produced.
      if (name === "lastSavedAt") {
        assert.equal(loaded.lastSavedAt, SAVED_AT);
        continue;
      }
      assert.deepEqual(loaded[name], runtime.run[name], `${name} (${setup.operatorOrigin})`);
    }
  }
});

test("a new game in the runtime keeps a queue the shell's save starts without", () => {
  // Deliberate, and safe only because AppContent opens the runtime, not the
  // shell, over a save that holds rows it may send. See shellStartSave.js.
  const context = { runId: "run-old", operatorOrigin: "courier", sessionId: "session", now: 1_000, openRecovery: false };
  const queued = applyRunPatch(initialRunState(null, context), { pendingTelemetry: [{ id: "row" }] });
  const run = transition(queued, { type: "newGame", runId: RUN_ID, playerName: "분석관", now: NOW });
  assert.deepEqual(run.pendingTelemetry, [{ id: "row" }]);
  assert.deepEqual(createStartSave(SETUPS[0], { now: NOW, runId: RUN_ID }).pendingTelemetry, []);
});
