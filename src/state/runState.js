import { normalizeSavedText, SAVE_SCHEMA_VERSION, SAVE_STATE_KEYS } from "../appConfig.js";
import { SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "../gameCases.js";
import { cognitionLabels, initialResources, triggerLabels } from "../gameConstants.js";
import { makeEmptyScores } from "../gameLogic.js";
import { normalizeRunState, RUN_INITIAL_STATE, serializeRunState } from "../gauntlet/gauntletEngine.js";
import { createOpeningResources } from "./openingState.js";

/**
 * The run, defined once.
 *
 * A run is the fields below. Each row says where the field is kept in the save
 * (or that it is not), what it is read as when a save is loaded, what it is
 * when nothing has happened yet, and what each of the four transitions that
 * replace a run does to it:
 *
 *   newGame     시작 / NEW GAME+: a new run of the season, on this device's setup.
 *   openCase    a case opened from the intro or the result page, inside the run.
 *   jumpToNode  a scene entered directly: the debug jump and a replay link.
 *   reset       초기화: the run and what the player set up for it, both gone.
 *
 * Until 2026-10 these were four lists of `setX(...)` calls -- `startGame`,
 * `startCaseNow`, `startAtNode`, `reset` -- each with a save payload typed out
 * beside it, and nothing held a list to its payload or to the other lists. They
 * drifted three times that were found: a new game reset everything but the
 * echo, a reset left the stale-tab lock on, and the payload for a new game
 * held an echo the run did not. A field is now reset by a rule in its row, the
 * state change and the save payload are both read off the patch that rule
 * produces (`runTransition`, `toSavePatch`), and a field added without a rule
 * for every transition fails the unit test instead of the player.
 *
 * A rule is `KEEP`, `FRESH` (the row's `fresh` value), or a function of the
 * event and the run as it stands. The events carry what only the caller knows:
 * the clock, a new id, the scene a case opens on.
 */
export const KEEP = Symbol("keep");
export const FRESH = Symbol("fresh");

// The line under a season's first scene, before any choice has been answered.
export const OPENING_ECHO = "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";

const given = (key) => (event) => event[key];
const now = (event) => event.now;
const emptyTriggers = () => makeEmptyScores(triggerLabels);
const emptyCognition = () => makeEmptyScores(cognitionLabels);

export const RUN_FIELDS = {
  runId: {
    save: "runId",
    load: (saved, context) => saved?.runId || context.runId,
    fresh: (event) => event.runId,
    newGame: FRESH,
    openCase: KEEP,
    // A debug jump is a run of its own; a replay is somebody's run being looked at.
    jumpToNode: given("runId"),
    reset: FRESH,
  },
  playerName: {
    save: "playerName",
    load: (saved) => saved?.playerName ?? "",
    fresh: () => "",
    newGame: given("playerName"),
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  playStyle: {
    save: "playStyle",
    load: (saved) => saved?.playStyle ?? "instinct",
    fresh: () => "instinct",
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  dataConsent: {
    save: "dataConsent",
    // Ticked until the player unticks it: a device with no save starts with the
    // box on. A save answers for itself, and there only `true` is consent.
    load: (saved) => (saved ? saved.dataConsent === true : true),
    fresh: () => true,
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // Kept under a key of its own (OPERATOR_ORIGIN_KEY), not in the save.
  operatorOrigin: {
    save: null,
    load: (_saved, context) => context.operatorOrigin,
    fresh: () => "courier",
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // The id this device's telemetry rows are filed under. A reset ends it.
  sessionId: {
    save: null,
    load: (_saved, context) => context.sessionId,
    fresh: (event) => event.sessionId,
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  started: {
    save: "started",
    load: (saved) => saved?.started ?? false,
    fresh: () => false,
    newGame: () => true,
    openCase: () => true,
    jumpToNode: () => true,
    reset: FRESH,
  },
  isPausedSave: {
    save: "paused",
    load: (saved) => saved?.paused ?? false,
    fresh: () => false,
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  currentCase: {
    save: "currentCase",
    load: (saved) => saved?.currentCase ?? SEASON_ENTRY_CASE,
    fresh: () => SEASON_ENTRY_CASE,
    newGame: FRESH,
    openCase: given("caseId"),
    jumpToNode: given("caseId"),
    reset: FRESH,
  },
  completedCases: {
    save: "completedCases",
    load: (saved) => saved?.completedCases ?? [],
    fresh: () => [],
    newGame: FRESH,
    openCase: KEEP,
    // Every case before the one jumped into, so the roadmap is open that far.
    jumpToNode: given("completedCases"),
    reset: FRESH,
  },
  // A jump keeps the clues, results and feedback of the run it was made from.
  // The debug jump takes a new run id and still carries them; see the report
  // this refactor was made with before changing that.
  discoveredClues: {
    save: "discoveredClues",
    load: (saved) => saved?.discoveredClues ?? [],
    fresh: () => [],
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  caseResults: {
    save: "caseResults",
    load: (saved) => saved?.caseResults ?? {},
    fresh: () => ({}),
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  playtestFeedback: {
    save: "playtestFeedback",
    load: (saved) => saved?.playtestFeedback ?? {},
    fresh: () => ({}),
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  nodeId: {
    save: "nodeId",
    load: (saved) => saved?.nodeId ?? SEASON_ENTRY_NODE,
    fresh: () => SEASON_ENTRY_NODE,
    newGame: FRESH,
    openCase: given("nodeId"),
    jumpToNode: given("nodeId"),
    reset: FRESH,
  },
  resources: {
    save: "resources",
    load: (saved) => saved?.resources ?? initialResources,
    fresh: () => initialResources,
    // The origin's opening hand belongs to the season's first scene.
    newGame: (_event, run) => createOpeningResources(run.operatorOrigin),
    openCase: given("resources"),
    jumpToNode: FRESH,
    reset: FRESH,
  },
  log: {
    save: "log",
    load: (saved) => saved?.log ?? [],
    fresh: () => [],
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  triggers: {
    save: "triggers",
    load: (saved) => saved?.triggers ?? emptyTriggers(),
    fresh: emptyTriggers,
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  cognition: {
    save: "cognition",
    load: (saved) => saved?.cognition ?? emptyCognition(),
    fresh: emptyCognition,
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  openingLegacy: {
    save: "openingLegacy",
    load: (saved) => saved?.openingLegacy ?? null,
    fresh: () => null,
    newGame: FRESH,
    openCase: given("openingLegacy"),
    jumpToNode: FRESH,
    reset: FRESH,
  },
  echo: {
    save: "echo",
    load: (saved) => normalizeSavedText(saved?.echo) || OPENING_ECHO,
    fresh: () => OPENING_ECHO,
    newGame: FRESH,
    openCase: given("echo"),
    jumpToNode: given("echo"),
    reset: FRESH,
  },
  nodeEnteredAt: {
    save: "nodeEnteredAt",
    load: (saved, context) => (Number.isFinite(saved?.nodeEnteredAt) ? saved.nodeEnteredAt : context.now),
    fresh: now,
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  // The run's gauntlet: pot, vault, and the rules the next window is dealt
  // from. Saved under `dynamics`, the key the save format reserves for it.
  gauntletRun: {
    save: "dynamics",
    toSave: serializeRunState,
    load: (saved) => normalizeRunState(saved?.dynamics),
    fresh: () => RUN_INITIAL_STATE,
    newGame: FRESH,
    // A closed case keeps its REBOOT board and its relic draft; an abandoned
    // one forfeits its pot (gauntletEngine.openCaseRun, done by the caller).
    openCase: given("gauntletRun"),
    jumpToNode: FRESH,
    reset: FRESH,
  },
  // The queue the telemetry sender empties. The save holds it; the sender's
  // own ref is what a write reads (useAppPersistence.persist).
  pendingTelemetry: {
    save: "pendingTelemetry",
    load: (saved) => saved?.pendingTelemetry ?? [],
    fresh: () => [],
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // When the last write landed. The save's own `savedAt` is stamped by the write.
  lastSavedAt: {
    save: null,
    load: (saved) => saved?.savedAt ?? "",
    fresh: () => "",
    newGame: KEEP,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // The error the recovery notice is about. It is in the save only while the
  // notice stands: written by the error path, and by a write that clears it.
  lastRecoveredError: {
    save: "lastError",
    patchOnly: true,
    load: (saved) => saved?.lastError ?? null,
    fresh: () => null,
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // The reveal over the scene a commit just left. Never saved.
  decisionReveal: {
    save: null,
    load: () => null,
    fresh: () => null,
    newGame: FRESH,
    openCase: FRESH,
    jumpToNode: FRESH,
    reset: FRESH,
  },
  // Set when this tab's run is older than the save: another tab moved on. The
  // tab stops -- no table, no writes -- until it reloads from storage. A new
  // run is this tab's own, and a reset leaves storage with nothing to be behind.
  staleSave: {
    save: null,
    load: () => false,
    fresh: () => false,
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  // Asked for by the last page (a reset that reloaded), or by a save that could not be read.
  showRecoveryCenter: {
    save: null,
    load: (_saved, context) => context.openRecovery,
    fresh: () => false,
    newGame: FRESH,
    openCase: KEEP,
    jumpToNode: KEEP,
    reset: FRESH,
  },
  showErrorLog: {
    save: null,
    load: (_saved, context) => context.openRecovery,
    fresh: () => false,
    newGame: FRESH,
    openCase: KEEP,
    // The debug jump is pressed from inside the panel it closes.
    jumpToNode: FRESH,
    reset: FRESH,
  },
};

export const RUN_FIELD_NAMES = Object.keys(RUN_FIELDS);
export const RUN_TRANSITIONS = ["newGame", "openCase", "jumpToNode", "reset"];

/**
 * The transitions that change a few fields and leave the rest: each is the
 * whole of what it does. `pause` is leaving the table for the intro -- the
 * season map and the recovery notice both do it.
 */
const SMALL_TRANSITIONS = {
  resume: (event) => ({ started: true, isPausedSave: false, nodeEnteredAt: event.now, decisionReveal: null }),
  pause: () => ({ started: false, isPausedSave: true }),
};

/** The run a page starts from: `saved` is the save as loaded and repaired, or null. */
export function initialRunState(saved, context) {
  return Object.fromEntries(RUN_FIELD_NAMES.map((name) => [name, RUN_FIELDS[name].load(saved, context)]));
}

/** What an event changes, as a patch over the run. The rest of the run is kept. */
export function runTransition(run, event) {
  const small = SMALL_TRANSITIONS[event.type];
  if (small) return small(event, run);
  if (!RUN_TRANSITIONS.includes(event.type)) throw new Error(`The run has no transition named ${event.type}.`);
  const patch = {};
  for (const name of RUN_FIELD_NAMES) {
    const field = RUN_FIELDS[name];
    const rule = field[event.type];
    if (rule === KEEP) continue;
    patch[name] = rule === FRESH ? field.fresh(event, run) : rule(event, run);
  }
  return patch;
}

export function applyRunPatch(run, patch) {
  const changed = Object.keys(patch).some((name) => !Object.is(run[name], patch[name]));
  return changed ? { ...run, ...patch } : run;
}

/** The run after the event. */
export function transition(run, event) {
  return applyRunPatch(run, runTransition(run, event));
}

/** A patch over the run, as the keys and values the save holds for it. */
export function toSavePatch(patch) {
  const savePatch = {};
  for (const [name, value] of Object.entries(patch)) {
    const field = RUN_FIELDS[name];
    if (!field) throw new Error(`The run has no field named ${name}.`);
    if (field.save) savePatch[field.save] = field.toSave ? field.toSave(value) : value;
  }
  return savePatch;
}

/**
 * The whole save for a run, key for key what `SAVE_STATE_KEYS` lists. The
 * queue is passed in because the sender's ref is ahead of the run's copy of
 * it between renders, and the stamp because the write decides it.
 */
export function toSavePayload(run, { pendingTelemetry = run.pendingTelemetry, savedAt } = {}) {
  const held = { saveSchemaVersion: SAVE_SCHEMA_VERSION, savedAt };
  for (const name of RUN_FIELD_NAMES) {
    const field = RUN_FIELDS[name];
    if (!field.save || field.patchOnly) continue;
    held[field.save] = field.toSave ? field.toSave(run[name]) : run[name];
  }
  held.pendingTelemetry = pendingTelemetry;
  return Object.fromEntries(SAVE_STATE_KEYS.map((key) => [key, held[key]]));
}

/**
 * `{ type: "patch", patch }` merges fields; `{ type: "set", field, value }`
 * sets one, and takes a function of the old value the way a state setter does.
 * Both hand back the same object when nothing changed, so React skips the render.
 */
export function runReducer(run, action) {
  if (action.type === "patch") return applyRunPatch(run, action.patch);
  if (action.type === "set") {
    const value = typeof action.value === "function" ? action.value(run[action.field]) : action.value;
    return applyRunPatch(run, { [action.field]: value });
  }
  return transition(run, action);
}

/** `setPlayerName`, `setStarted`, ...: one per field, for the callers that set a single thing. */
export function createRunSetters(dispatch) {
  return Object.fromEntries(
    RUN_FIELD_NAMES.map((name) => [
      `set${name[0].toUpperCase()}${name.slice(1)}`,
      (value) => dispatch({ type: "set", field: name, value }),
    ]),
  );
}
