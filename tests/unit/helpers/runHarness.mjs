import { createStorage } from "./browser.mjs";

/**
 * A run with no browser under it: storage, a clock that does not move, and the
 * functions that start, open, jump, leave and reset a run, wired the way
 * `GameRuntime` wires them. `tests/unit/run-lifecycle.test.mjs` drives it and
 * compares what it finds against a file written from the code as it stood
 * before the run's fields were given one definition.
 *
 * This file is the adapter: it knows how the modules are put together today.
 * The test and the file it compares against know only `act`, `run`, `saved`,
 * `effects` and `status`, so they do not change when the wiring here does.
 */
export const HARNESS_NOW = 1_760_000_000_000;
export const OPENING_ECHO = "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";

const realDateNow = Date.now;

function installGlobals({ storage, confirm, effects }) {
  globalThis.localStorage = createStorage(storage);
  globalThis.sessionStorage = createStorage();
  globalThis.confirm = (message) => {
    effects.push(`confirm:${message.slice(0, 12)}`);
    return confirm;
  };
  globalThis.window = { location: { reload: () => effects.push("reload") } };
  Date.now = () => HARNESS_NOW;
}

export function restoreGlobals() {
  Date.now = realDateNow;
  delete globalThis.confirm;
  delete globalThis.window;
}

export async function createRunHarness({ saved = null, storage = {}, operatorOrigin = "courier", confirm = true, patch = {} } = {}) {
  const effects = [];
  installGlobals({ storage, confirm, effects });

  const appConfig = await import("../../../src/appConfig.js");
  const { useAppPersistence } = await import("../../../src/state/useAppPersistence.js");
  const { initialRunState, runReducer } = await import("../../../src/state/runState.js");
  const { createRunLifecycle } = await import("../../../src/state/runLifecycle.js");
  const { getTraceEvents } = await import("../../../src/state/trace.js");
  const { normalizeRunState } = await import("../../../src/gauntlet/gauntletEngine.js");

  // The tab knows the revision storage starts at, as a page that loaded it does.
  appConfig.adoptSaveRevision();

  let runIds = 0;
  const createRunId = () => `run-${(runIds += 1)}`;
  let sessionIds = 0;
  const getSessionId = () => `session-${(sessionIds += 1)}`;

  // What the runtime starts from (useRunState's first render), then the
  // reducer it runs on, driven here without React.
  let run = {
    ...initialRunState(saved, { runId: "run-0", operatorOrigin, sessionId: "session-0", now: HARNESS_NOW, openRecovery: false }),
    ...patch,
  };
  const patchRun = (change) => {
    run = runReducer(run, { type: "patch", patch: change });
  };

  const loadedSavedAt = run.lastSavedAt;
  const outside = { status: null, telemetryStatus: null, localErrorEntries: null, saveSlots: [] };
  const pendingTelemetryRef = { current: run.pendingTelemetry };
  const setSaveStatus = (value) => {
    outside.status = value;
  };

  /** One render's worth of functions: they close over the run as it stands now. */
  function render() {
    const persistence = useAppPersistence({
      run,
      patchRun,
      refs: { pendingTelemetryRef },
      setters: {
        setSaveStatus,
        setLocalErrorEntries: (value) => {
          outside.localErrorEntries = value;
        },
        setSaveSlots: (value) => {
          outside.saveSlots = value;
        },
        setPendingTelemetry: (queue) => patchRun({ pendingTelemetry: queue }),
      },
      config: {
        persistSuppressed: () => false,
        onSuppressSaves: () => effects.push("suppress-saves"),
        onResumeSaves: () => effects.push("resume-saves"),
        formatSaveTime: () => "<time>",
        debugErrorKey: appConfig.DEBUG_RENDER_CRASH_KEY,
      },
    });
    const lifecycle = createRunLifecycle({
      run,
      applyRun: persistence.applyRun,
      patchRun,
      isOnline: true,
      effects: {
        resetEndingSequence: () => effects.push("reset-ending-sequence"),
        setNextParticipantMessage: (value) => effects.push(`next-participant-message:${JSON.stringify(value)}`),
        replacePendingTelemetry: (queue) => {
          pendingTelemetryRef.current = queue;
          patchRun({ pendingTelemetry: queue });
        },
        clearLocalRankingRows: () => effects.push("clear-local-ranking-rows"),
        setLocalErrorEntries: (value) => {
          outside.localErrorEntries = value;
        },
        setSaveSlots: (value) => {
          outside.saveSlots = value;
        },
        setSaveStatus,
        setTelemetryStatus: (value) => {
          outside.telemetryStatus = value;
        },
        onSuppressSaves: () => effects.push("suppress-saves"),
        resumeRuntimeSaves: () => effects.push("resume-saves"),
      },
      createRunId,
      getSessionId,
    });
    return {
      openCase: (caseId) => lifecycle.startCaseNow(caseId),
      jumpToNode: (caseId, nodeId, options) => lifecycle.startAtNode(caseId, nodeId, options),
      resetEverything: () => lifecycle.resetRun(),
      leaveToSeasonMap: () => lifecycle.leaveToSeasonMap(),
      startGame: () => lifecycle.startGame(),
      resume: () => lifecycle.resumeSavedGame(),
      pauseAfterRecovery: () => lifecycle.pauseAfterRecovery(),
      // The save's `dynamics` is how the test names a held window; the runtime hands over the run itself.
      saveGame: ({ dynamics, ...options } = {}) =>
        persistence.saveCurrentGame(dynamics ? { ...options, heldRun: normalizeRunState(dynamics) } : options),
      dismissRecoveryNotice: () => persistence.dismissRecoveryNotice(),
      closeRecoveryCenter: () => persistence.closeRecoveryCenter(),
      refreshErrorLog: () => persistence.refreshLocalErrorLog(),
      clearErrorLog: () => persistence.clearLocalErrorLog(),
      deleteSlot: (slotId) => persistence.deleteSaveSlot(slotId),
      restoreSlot: (slot) => persistence.restoreSaveSlot(slot),
      restoreBackup: () => persistence.restoreSaveBackup(),
      startFresh: () => persistence.startFreshAfterRecovery(),
      persist: (patch, options) => persistence.persist(patch, options),
      applyRun: (patch, options) => persistence.applyRun(patch, options),
    };
  }

  const readJson = (key) => {
    const raw = globalThis.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  };

  return {
    /** Runs one action against a fresh render, as a click does. */
    act(name, ...args) {
      const actions = render();
      if (!actions[name]) throw new Error(`The harness has no action named ${name}.`);
      return actions[name](...args);
    },
    get run() {
      // A save that landed stamps the run with the time it was written.
      const lastSavedAt = run.lastSavedAt && run.lastSavedAt !== loadedSavedAt ? "<savedAt>" : run.lastSavedAt;
      return structuredClone({ ...run, lastSavedAt, pendingTelemetryRef: pendingTelemetryRef.current });
    },
    /** The save as storage holds it, with the two fields that move on their own made still. */
    saved() {
      const save = readJson(appConfig.STORAGE_KEY);
      if (!save) return null;
      return { ...save, saveRevision: "<revision>", savedAt: typeof save.savedAt === "string" ? "<savedAt>" : save.savedAt };
    },
    /** The trace this tab keeps of where it has been, without the clock. */
    trace: () => getTraceEvents().map(({ t: _t, ...event }) => event),
    slotCount: () => readJson(appConfig.SAVE_SLOT_STORAGE_KEY)?.slots?.length ?? 0,
    storageKeys: () => Object.values(appConfig).filter((value) => typeof value === "string" && globalThis.localStorage.getItem(value) !== null).sort(),
    effects,
    get status() {
      return outside.status;
    },
    get outside() {
      return structuredClone(outside);
    },
    /** Another tab writes the save, a revision ahead of what this tab knows. */
    writeFromAnotherTab(save) {
      const current = readJson(appConfig.STORAGE_KEY) ?? {};
      globalThis.localStorage.setItem(appConfig.STORAGE_KEY, JSON.stringify({ ...current, ...save, saveRevision: (current.saveRevision ?? 0) + 1 }));
    },
  };
}
