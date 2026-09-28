import assert from "node:assert/strict";
import { test } from "node:test";

import {
  adoptSaveRevision,
  appendSaveSlot,
  backUpUnreadableSave,
  ERROR_LOG_STORAGE_KEY,
  hasRecoverySlots,
  makeEmptyScores,
  parseRecoverySlots,
  readUnreadableSave,
  SAVE_BACKUP_STORAGE_KEY,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
  STORAGE_KEY,
  writeSaveState,
} from "../../src/appConfig.js";
import { getOriginStartEffects } from "../../src/advancedSystems.js";
import { cognitionLabels, initialResources, triggerLabels } from "../../src/gameConstants.js";
import { isChunkLoadError, reloadForMissingChunk } from "../../src/state/chunkReload.js";
import { queueSavedErrorTelemetry, recordAppError, RENDER_CRASH_SOURCE, takeQueuedErrorTelemetry } from "../../src/state/errorRecovery.js";
import { createOpeningResources } from "../../src/state/openingState.js";

/** Browser storage as one Map, with a byte budget so a full disk can be staged. */
function installStorage({ quota = Infinity } = {}) {
  const store = new Map();
  const used = () => [...store].reduce((total, [key, value]) => total + key.length + value.length, 0);
  const area = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      const text = String(value);
      const next = used() - (store.has(key) ? key.length + store.get(key).length : 0) + key.length + text.length;
      if (next > quota) throw new Error("QuotaExceededError");
      store.set(key, text);
    },
    removeItem: (key) => store.delete(key),
  };
  const previous = { local: globalThis.localStorage, session: globalThis.sessionStorage };
  globalThis.localStorage = area;
  globalThis.sessionStorage = installSession();
  return {
    store,
    restore() {
      globalThis.localStorage = previous.local;
      globalThis.sessionStorage = previous.session;
    },
  };
}

function installSession() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
}

function runSave(overrides = {}) {
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId: "run-1",
    playerName: "분석관",
    dataConsent: false,
    started: true,
    paused: false,
    currentCase: "case03",
    nodeId: "c3_start",
    completedCases: ["case01", "case02"],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    resources: { ...initialResources },
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    log: [],
    pendingTelemetry: [],
    savedAt: "2026-09-28T00:00:00.000Z",
    ...overrides,
  };
}

const readSave = (store) => JSON.parse(store.get(STORAGE_KEY));
const readSlots = (store) => parseRecoverySlots(store.get(SAVE_SLOT_STORAGE_KEY) ?? "null")?.slots ?? [];

test("a render crash is one crash, however many times it is reported", () => {
  const { store, restore } = installStorage();
  try {
    writeSaveState(runSave(), { force: true });
    const crash = new Error("Cannot read properties of undefined");
    // React's report reaches the console hook first, then the boundary.
    recordAppError(crash, {}, "console-error");
    const entry = recordAppError(crash, { componentStack: "at PlayScreen" }, RENDER_CRASH_SOURCE);
    const again = recordAppError(crash, {}, RENDER_CRASH_SOURCE);
    assert.equal(again, entry, "the same Error is the same record");
    assert.equal(readSave(store).lastError.retryCount, 1, "the first crash at a scene leaves one retry");
    assert.equal(crash.name, "Error", "and the Error its thrower holds is not renamed");

    recordAppError(new Error("Cannot read properties of undefined"), {}, RENDER_CRASH_SOURCE);
    assert.equal(readSave(store).lastError.retryCount, 2, "the reload that crashed again is the second");
  } finally {
    restore();
  }
});

test("a console line or a rejected promise at the scene does not spend a retry", () => {
  const { store, restore } = installStorage();
  try {
    writeSaveState(runSave(), { force: true });
    recordAppError(new Error("network hiccup"), {}, "unhandled-rejection");
    recordAppError(new Error("a warning logged as an error"), {}, "console-error");
    assert.equal(readSave(store).lastError.retryCount, 0);
    recordAppError(new Error("render failed"), {}, RENDER_CRASH_SOURCE);
    assert.equal(readSave(store).lastError.retryCount, 1);
  } finally {
    restore();
  }
});

test("errors at one scene keep one recovery slot there and leave the earlier ones", () => {
  const { store, restore } = installStorage();
  try {
    for (const nodeId of ["c1_witness", "payday", "competitor", "board"]) {
      appendSaveSlot(runSave({ currentCase: "case01", nodeId, log: [] }));
    }
    writeSaveState(runSave(), { force: true });
    for (let attempt = 0; attempt < 6; attempt += 1) recordAppError(new Error(`crash ${attempt}`), {}, RENDER_CRASH_SOURCE);
    const slots = readSlots(store);
    assert.equal(slots.filter((slot) => slot.nodeId === "c3_start").length, 1, "one slot at the broken scene");
    assert.deepEqual(
      slots.map((slot) => slot.nodeId),
      ["c3_start", "board", "competitor", "payday", "c1_witness"],
      "and every place to go back to is still there",
    );
  } finally {
    restore();
  }
});

test("an error in a tab that is behind does not let it write over the tab ahead", () => {
  const { store, restore } = installStorage();
  try {
    // This tab loads the run at window 3.
    writeSaveState(runSave({ dynamics: { windowIndex: 3 } }), { force: true });
    adoptSaveRevision();
    // Another tab plays on to window 5.
    const ahead = readSave(store);
    store.set(STORAGE_KEY, JSON.stringify({ ...ahead, dynamics: { windowIndex: 5 }, saveRevision: ahead.saveRevision + 4 }));
    // Something fails here; the recovery writes `lastError` into the stored save.
    recordAppError(new Error("stale tab failure"), {}, "window-error");
    assert.equal(readSave(store).dynamics.windowIndex, 5, "the recovery edits what storage holds");
    assert.ok(readSave(store).lastError);
    // This tab's own save is still refused.
    const stale = writeSaveState(runSave({ dynamics: { windowIndex: 3 } }), {
      isAhead: (stored, payload) => stored.dynamics.windowIndex > payload.dynamics.windowIndex,
    });
    assert.equal(stale.stale, true);
    assert.equal(readSave(store).dynamics.windowIndex, 5);
  } finally {
    restore();
  }
});

test("an error in the tab that is playing does not lock that tab", () => {
  const { store, restore } = installStorage();
  try {
    writeSaveState(runSave({ dynamics: { windowIndex: 3 } }), { force: true });
    adoptSaveRevision();
    recordAppError(new Error("a failure in the only tab"), {}, "window-error");
    const next = writeSaveState(runSave({ dynamics: { windowIndex: 4 } }), { isAhead: () => true });
    assert.equal(next.saved, true, "the tab was level with storage, so it still is");
    assert.equal(readSave(store).dynamics.windowIndex, 4);
  } finally {
    restore();
  }
});

test("the revision is read off the end of the save, wherever an older build put it", () => {
  const { store, restore } = installStorage();
  try {
    const first = writeSaveState(runSave({ saveRevision: 900 }), { force: true });
    assert.match(store.get(STORAGE_KEY), /"saveRevision":\d+\}$/, "written last, and once");
    assert.equal(readSave(store).saveRevision, first.revision);
    assert.equal(store.get(STORAGE_KEY).match(/saveRevision/g).length, 1);
    // An older build spread the payload first, so the revision sat mid-object.
    store.set(STORAGE_KEY, JSON.stringify({ saveRevision: 41, ...runSave() }));
    assert.equal(adoptSaveRevision(), 41);
    assert.equal(writeSaveState(runSave()).revision, 42);
  } finally {
    restore();
  }
});

test("a full storage gives up recovery slots and the error log before it gives up the save", () => {
  const { store, restore } = installStorage();
  try {
    // A slot holds the whole log, which is where its weight is.
    const big = runSave({ echo: "가".repeat(4000), log: [{ nodeId: "start", note: "다".repeat(4000) }] });
    for (const nodeId of ["payday", "competitor", "board"]) appendSaveSlot({ ...big, currentCase: "case01", nodeId });
    store.set(ERROR_LOG_STORAGE_KEY, JSON.stringify({ saveSchemaVersion: 1, entries: [] }));
    writeSaveState(big, { force: true });
    restore();

    // The same storage, now with room for nothing new.
    const used = [...store].reduce((total, [key, value]) => total + key.length + value.length, 0);
    const full = installStorage({ quota: used + 200 });
    for (const [key, value] of store) full.store.set(key, value);
    try {
      const grown = writeSaveState({ ...big, echo: "나".repeat(9000) }, { force: true });
      assert.equal(grown.saved, true, "the save is written");
      assert.equal(grown.evicted, true);
      assert.equal(readSave(full.store).echo.length, 9000);
      assert.equal(readSlots(full.store).length, 1, "at the cost of the older slots, newest kept");
      assert.ok(full.store.has(ERROR_LOG_STORAGE_KEY), "the error log is the last to go, and was not needed");
    } finally {
      full.restore();
    }
  } finally {
    restore();
  }
});

test("a save this build cannot read is kept before anything writes over it", () => {
  const { store, restore } = installStorage();
  try {
    assert.equal(readUnreadableSave(), null, "no save is not an unreadable save");
    writeSaveState(runSave(), { force: true });
    assert.equal(readUnreadableSave(), null, "nor is one that reads");

    const fromTheFuture = JSON.stringify({ ...runSave(), saveSchemaVersion: SAVE_SCHEMA_VERSION + 1 });
    for (const raw of ["{ not json", "[1,2,3]", fromTheFuture]) {
      store.set(STORAGE_KEY, raw);
      assert.equal(readUnreadableSave(), raw);
    }
    assert.equal(backUpUnreadableSave(fromTheFuture), true);
    assert.equal(backUpUnreadableSave(fromTheFuture), false, "the same text is not written twice");
    assert.equal(backUpUnreadableSave(null), false);
    writeSaveState(runSave({ runId: "a-fresh-run" }), { force: true });
    assert.equal(store.get(SAVE_BACKUP_STORAGE_KEY), fromTheFuture, "and the new run does not reach the copy");

    assert.equal(hasRecoverySlots(), false);
    appendSaveSlot(runSave());
    assert.equal(hasRecoverySlots(), true);
  } finally {
    restore();
  }
});

test("an error row queued in storage is handed to the runtime's queue once", () => {
  const { store, restore } = installStorage();
  try {
    takeQueuedErrorTelemetry();
    const entry = {
      id: "error-1",
      occurredAt: "2026-09-28T00:00:01.000Z",
      context: { currentCase: "case03", nodeId: "c3_start" },
    };
    const payload = { event_id: "event-1", source: "window-error", error_message: "failed" };

    writeSaveState(runSave({ dataConsent: false }), { force: true });
    assert.equal(queueSavedErrorTelemetry(entry, payload), false, "no consent, no row");
    assert.deepEqual(takeQueuedErrorTelemetry(), []);

    writeSaveState(runSave({ dataConsent: true }), { force: true });
    assert.equal(queueSavedErrorTelemetry(entry, payload), true);
    assert.deepEqual(readSave(store).pendingTelemetry.map((item) => item.id), ["error-1"], "the row is in the stored save");
    const taken = takeQueuedErrorTelemetry();
    assert.deepEqual(taken.map((item) => [item.id, item.type, item.payload.event_id]), [["error-1", "error", "event-1"]]);
    assert.deepEqual(takeQueuedErrorTelemetry(), [], "and is handed over once");
  } finally {
    restore();
  }
});

test("every way into the season deals the same opening hand", () => {
  for (const origin of ["courier", "lab", "public", "somewhere-else"]) {
    const dealt = createOpeningResources(origin);
    for (const [key, value] of Object.entries(getOriginStartEffects(origin))) {
      const ceiling = key === "time" ? 72 : 100;
      assert.equal(dealt[key], Math.min(ceiling, Math.max(0, initialResources[key] + value)), `${origin}: ${key}`);
    }
    assert.equal(dealt.time, initialResources.time);
    assert.equal(dealt.humanCost, initialResources.humanCost);
  }
  assert.notDeepEqual(createOpeningResources("public"), initialResources, "an origin is not the bare resources");
});

test("a chunk that will not load is told apart from a fault in the run", () => {
  assert.equal(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: https://x/assets/ResultScreen-abc.js")), true);
  assert.equal(isChunkLoadError(new TypeError("error loading dynamically imported module")), true);
  assert.equal(isChunkLoadError(new TypeError("Importing a module script failed.")), true);
  assert.equal(isChunkLoadError(new Error("Unable to preload CSS for /assets/index-abc.css")), true);
  assert.equal(isChunkLoadError(new TypeError("Cannot read properties of undefined (reading 'choices')")), false);
  assert.equal(isChunkLoadError("Failed to fetch dynamically imported module"), false, "only an Error is a load failure");
});

test("the reload for a missing chunk happens once, not in a loop", () => {
  const { restore } = installStorage();
  try {
    let reloads = 0;
    const reload = () => {
      reloads += 1;
    };
    assert.equal(reloadForMissingChunk({ now: 1_000_000, reload }), true);
    assert.equal(reloadForMissingChunk({ now: 1_005_000, reload }), false, "the reloaded page failed the same way");
    assert.equal(reloads, 1);
    assert.equal(reloadForMissingChunk({ now: 1_000_000 + 61_000, reload }), true, "a later deploy is a new reason");
    assert.equal(reloads, 2);
  } finally {
    restore();
  }
});
