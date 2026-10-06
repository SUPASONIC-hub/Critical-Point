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

const setterField = (name) => {
  if (name === "setOperatorOriginState") return "operatorOrigin";
  const field = name.slice(3);
  return field[0].toLowerCase() + field.slice(1);
};

export async function createRunHarness({ saved = null, storage = {}, operatorOrigin = "courier", confirm = true, patch = {} } = {}) {
  const effects = [];
  installGlobals({ storage, confirm, effects });

  const appConfig = await import("../../../src/appConfig.js");
  const { useAppPersistence } = await import("../../../src/state/useAppPersistence.js");
  const { useGameSaveState } = await import("../../../src/state/useGameSave.js");
  const { createRunLifecycle } = await import("../../../src/state/runLifecycle.js");
  const { getTraceEvents } = await import("../../../src/state/trace.js");
  const { initialResources, triggerLabels, cognitionLabels } = await import("../../../src/gameData.js");
  const { makeEmptyScores } = await import("../../../src/gameLogic.js");
  const { normalizeRunState, RUN_INITIAL_STATE, serializeRunState } = await import("../../../src/gauntlet/gauntletEngine.js");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");

  // The tab knows the revision storage starts at, as a page that loaded it does.
  appConfig.adoptSaveRevision();

  let runIds = 0;
  const createRunId = () => `run-${(runIds += 1)}`;
  let sessionIds = 0;
  const getSessionId = () => `session-${(sessionIds += 1)}`;

  // What the runtime starts from: the save hook's state, and the five pieces
  // GameRuntime kept beside it, read the way its `useState` calls read them.
  let loaded;
  function Probe() {
    loaded = useGameSaveState({
      saved,
      initialRunId: saved?.runId || "run-0",
      initialResources,
      triggerDefaults: makeEmptyScores(triggerLabels),
      cognitionDefaults: makeEmptyScores(cognitionLabels),
    });
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  const run = Object.fromEntries(Object.entries(loaded).filter(([, value]) => typeof value !== "function"));
  Object.assign(run, {
    gauntletRun: normalizeRunState(saved?.dynamics),
    staleSave: false,
    operatorOrigin,
    echo: appConfig.normalizeSavedText(saved?.echo) || OPENING_ECHO,
    nodeEnteredAt: Number.isFinite(saved?.nodeEnteredAt) ? saved.nodeEnteredAt : HARNESS_NOW,
    decisionReveal: null,
    lastRecoveredError: saved?.lastError ?? null,
    showRecoveryCenter: false,
    showErrorLog: false,
    sessionId: "session-0",
    ...patch,
  });

  const loadedSavedAt = run.lastSavedAt;
  const outside = { status: null, telemetryStatus: null, localErrorEntries: null, saveSlots: [] };
  const pendingTelemetryRef = { current: run.pendingTelemetry };
  const setters = new Proxy({}, {
    get: (_, name) => (value) => {
      if (name === "setSaveStatus") outside.status = value;
      else if (name === "setTelemetryStatus") outside.telemetryStatus = value;
      else if (name === "setNextParticipantMessage") effects.push(`next-participant-message:${JSON.stringify(value)}`);
      else if (name === "setLocalErrorEntries") outside.localErrorEntries = value;
      else if (name === "setSaveSlots") outside.saveSlots = value;
      else {
        const field = setterField(name);
        run[field] = typeof value === "function" ? value(run[field]) : value;
      }
    },
  });

  /** One render's worth of functions: they close over the run as it stands now. */
  function render() {
    const persistence = useAppPersistence({
      state: { ...run, dynamics: serializeRunState(run.gauntletRun) },
      refs: { pendingTelemetryRef },
      setters,
      config: {
        normalizePlayerName: appConfig.normalizePlayerName,
        operatorOrigin: run.operatorOrigin,
        triggerLabels,
        cognitionLabels,
        makeEmptyScores,
        persistSuppressed: () => false,
        onSuppressSaves: () => effects.push("suppress-saves"),
        onResumeSaves: () => effects.push("resume-saves"),
        formatSaveTime: () => "<time>",
        debugErrorKey: appConfig.DEBUG_RENDER_CRASH_KEY,
        createRunId,
        initialDynamics: RUN_INITIAL_STATE,
        openingEcho: OPENING_ECHO,
        resetDecisionDynamics: () => {
          run.gauntletRun = RUN_INITIAL_STATE;
          run.staleSave = false;
        },
        onStaleSave: () => {
          run.staleSave = true;
        },
      },
    });
    const lifecycle = createRunLifecycle({
      state: { ...run, isOnline: true },
      setters,
      persist: persistence.persist,
      effects: {
        resetEndingSequence: () => effects.push("reset-ending-sequence"),
        setNextParticipantMessage: setters.setNextParticipantMessage,
        replacePendingTelemetry: (queue) => {
          pendingTelemetryRef.current = queue;
          run.pendingTelemetry = queue;
        },
        clearLocalRankingRows: () => effects.push("clear-local-ranking-rows"),
        setLocalErrorEntries: setters.setLocalErrorEntries,
        setSaveSlots: setters.setSaveSlots,
        setSaveStatus: setters.setSaveStatus,
        setTelemetryStatus: setters.setTelemetryStatus,
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
      startGame: () => persistence.startGame(),
      resume: () => persistence.resumeSavedGame(),
      pauseAfterRecovery: () => persistence.pauseAfterRecovery(),
      // The runtime holds the suspended window before it saves it (GameRuntime.saveCurrentGame).
      saveGame: (options) => {
        if (options?.dynamics) run.gauntletRun = normalizeRunState(options.dynamics);
        return persistence.saveCurrentGame(options);
      },
      dismissRecoveryNotice: () => persistence.dismissRecoveryNotice(),
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
