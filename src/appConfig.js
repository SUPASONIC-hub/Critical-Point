import { validateSavedStatePayload } from "./state/payloadSchemas.js";

export const STORAGE_KEY = "trigger-prototype-v2";
export const ERROR_LOG_STORAGE_KEY = "trigger-prototype-error-log-v1";
export const ERROR_LOG_MAX_ITEMS = 20;
export const SAVE_SLOT_STORAGE_KEY = "trigger-prototype-save-slots-v1";
export const RECOVERY_CENTER_STORAGE_KEY = "trigger-prototype-recovery-center-v1";
export const NEW_GAME_PLUS_KEY = "critical-point-new-game-plus-unlocked";
export const NEW_GAME_PLUS_MEMORY_KEY = "critical-point-new-game-plus-memory";
export const OPERATOR_ORIGIN_KEY = "critical-point-operator-origin";
export const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";
// Set by the debug console to force the next render to throw, and cleared by the
// error boundary's reload. Both files used to spell the string out for
// themselves, which is one typo away from a boundary that can never be reset.
export const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
// Cloud saves (src/cloudSave.js): this device's continuation code, whether the
// player turned uploading off, and which local save has reached the server.
export const CLOUD_SAVE_CODE_KEY = "critical-point-cloud-code-v1";
export const CLOUD_SAVE_ENABLED_KEY = "critical-point-cloud-enabled-v1";
export const CLOUD_SAVE_SYNC_KEY = "critical-point-cloud-sync-v1";
/** Fired on `globalThis` after every save that reached device storage. */
export const SAVE_WRITTEN_EVENT = "critical-point:save-written";

/**
 * Debug tooling is on in a build that asks for it, and in a dev server visited
 * with ?debug=1. The shell reads it to decide whether the runtime mounts at once;
 * the runtime reads it to draw the console. One definition so the two agree.
 */
export const debugToolsEnabled =
  (import.meta.env ?? {}).VITE_ENABLE_DEBUG_TOOLS === "true" ||
  Boolean(
    (import.meta.env ?? {}).DEV &&
      new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1",
  );
export const SAVE_SLOT_MAX_ITEMS = 5;
export const SAVE_SCHEMA_VERSION = 2;
export const RECOVERY_SLOT_SCHEMA_VERSION = 1;
export const PLAYER_NAME_MAX_LENGTH = 24;
export const FREE_TEXT_MAX_LENGTH = 600;
export const FEEDBACK_COMMENT_MAX_LENGTH = 600;
export const TELEMETRY_QUEUE_TYPES = ["case", "feedback", "error"];
export const SAVE_STATE_KEYS = [
  "saveSchemaVersion",
  "runId",
  "playerName",
  "playStyle",
  "openingLegacy",
  "dataConsent",
  "started",
  "currentCase",
  "completedCases",
  "discoveredClues",
  "caseResults",
  "playtestFeedback",
  "nodeId",
  "resources",
  "log",
  "triggers",
  "cognition",
  "freeText",
  "echo",
  "nodeEnteredAt",
  "pendingTelemetry",
  "protocolUsed",
  "timerPenaltyCount",
  "probeUsed",
  "investigatedTargets",
  "hypothesisDecisions",
  "dynamics",
  "paused",
  "savedAt",
];

/**
 * How many overtime charges this decision has already taken. Saves written
 * before the window kept charging carry a boolean instead.
 */
function normalizeTimerPenaltyCount(state = {}) {
  if (Number.isFinite(state.timerPenaltyCount)) return Math.max(0, Math.trunc(state.timerPenaltyCount));
  return state.timerPenaltyApplied ? 1 : 0;
}

export function normalizePlayerName(value) {
  return typeof value === "string" ? value.trim().slice(0, PLAYER_NAME_MAX_LENGTH) : "";
}

export function normalizeSavedText(value, maxLength = 0) {
  if (typeof value !== "string") return "";
  return Number.isFinite(maxLength) && maxLength > 0 ? value.slice(0, maxLength) : value;
}

export function normalizeFeedback(value) {
  const feedback = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    clarity: normalizeSavedText(feedback.clarity),
    difficulty: normalizeSavedText(feedback.difficulty),
    comment: normalizeSavedText(feedback.comment, FEEDBACK_COMMENT_MAX_LENGTH),
    savedAt: normalizeSavedText(feedback.savedAt),
  };
}

export function parseSavedState(raw, schemaVersion) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed.saveSchemaVersion === schemaVersion ? parsed : null;
  } catch {
    return null;
  }
}

export function migrateSavedState(state, targetSchemaVersion = SAVE_SCHEMA_VERSION) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;
  const sourceVersion = Number(state.saveSchemaVersion ?? 1);
  if (sourceVersion > targetSchemaVersion) return null;
  if (sourceVersion === targetSchemaVersion) return state;

  if (sourceVersion === 1 && targetSchemaVersion === 2) {
    return {
      ...state,
      saveSchemaVersion: 2,
      runId: typeof state.runId === "string" ? state.runId : "",
      discoveredClues: Array.isArray(state.discoveredClues) ? state.discoveredClues : [],
      pendingTelemetry: Array.isArray(state.pendingTelemetry) ? state.pendingTelemetry : [],
      caseResults: state.caseResults && typeof state.caseResults === "object" && !Array.isArray(state.caseResults) ? state.caseResults : {},
      playtestFeedback: state.playtestFeedback && typeof state.playtestFeedback === "object" && !Array.isArray(state.playtestFeedback) ? state.playtestFeedback : {},
      protocolUsed: Boolean(state.protocolUsed),
      timerPenaltyCount: normalizeTimerPenaltyCount(state),
      probeUsed: Boolean(state.probeUsed),
      dynamics: state.dynamics && typeof state.dynamics === "object" && !Array.isArray(state.dynamics) ? state.dynamics : null,
    };
  }

  return null;
}

export function parseCurrentSavedState(raw, schemaVersion = SAVE_SCHEMA_VERSION) {
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateSavedState(parsed, schemaVersion);
    return migrated?.saveSchemaVersion === schemaVersion ? migrated : null;
  } catch {
    return null;
  }
}

export function isSavedStateShapeValid(state) {
  return validateSavedStatePayload(state).length === 0;
}

export function getInvalidSavedStateKeys(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return ["<not-an-object>"];
  const invalid = [];
  for (const key of ["completedCases", "discoveredClues", "log", "pendingTelemetry"]) {
    if (!Array.isArray(state[key])) invalid.push(key);
  }
  for (const key of ["caseResults", "playtestFeedback", "resources", "triggers", "cognition"]) {
    if (!state[key] || typeof state[key] !== "object" || Array.isArray(state[key])) invalid.push(key);
  }
  for (const key of ["currentCase", "nodeId"]) {
    if (typeof state[key] !== "string") invalid.push(key);
  }
  if (state.runId !== undefined && typeof state.runId !== "string") invalid.push("runId");
  return invalid;
}

export function readStoredValue(key, fallback = null) {
  try {
    return globalThis.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * The save, written with a revision.
 *
 * Every write stamps `saveRevision` one past the highest revision anyone has
 * written, and each tab remembers the last revision it read or wrote. A tab
 * whose in-memory run is older than the save -- another tab settled a window,
 * or this tab sat on the intro while one did -- would otherwise write that old
 * run straight back over the newer one: a bust erased by switching tabs, and a
 * window reopened with its wall already known. `force` is for writers that have
 * just read the save themselves (the shell, recovery, a fresh run).
 */
let knownSaveRevision = null;

export function readSaveRevision() {
  try {
    const parsed = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    return Math.max(0, Math.trunc(Number(parsed?.saveRevision) || 0));
  } catch {
    return 0;
  }
}

/** Call when this tab loads its run from the save: it now knows that revision. */
export function adoptSaveRevision() {
  knownSaveRevision = readSaveRevision();
  return knownSaveRevision;
}

/**
 * `isAhead(stored, payload)` narrows what counts as a conflict once storage has
 * moved past this tab. Without it any newer revision refuses the write, which is
 * right for writers that know nothing about the run and wrong for the runtime:
 * a second tab that only opened the game would lock the first.
 */
export function writeSaveState(payload, { force = false, isAhead = null } = {}) {
  const storedRevision = readSaveRevision();
  if (knownSaveRevision === null) knownSaveRevision = storedRevision;
  if (!force && storedRevision > knownSaveRevision) {
    let stored;
    try {
      stored = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    } catch {
      stored = null;
    }
    if (!isAhead || isAhead(stored, payload)) return { saved: false, stale: true, revision: storedRevision };
  }
  const revision = Math.max(storedRevision, knownSaveRevision) + 1;
  const saved = writeStoredValue(STORAGE_KEY, JSON.stringify({ ...payload, saveRevision: revision }));
  if (saved) {
    knownSaveRevision = revision;
    // The device copy is the save; the cloud copy follows it (src/cloudSave.js).
    if (typeof globalThis.dispatchEvent === "function" && typeof globalThis.CustomEvent === "function") {
      globalThis.dispatchEvent(new CustomEvent(SAVE_WRITTEN_EVENT, { detail: { savedAt: payload?.savedAt ?? "" } }));
    }
  }
  return { saved, stale: false, revision };
}

/**
 * Windows that have already been settled, kept apart from the save. A save can
 * be rolled back -- a recovery slot, an old snapshot -- and a rolled-back save
 * names a window whose wall has been seen. The table deals that window again
 * under a fresh draw instead of replaying it.
 */
export const SETTLED_WINDOWS_STORAGE_KEY = "critical-point-settled-windows-v1";

/**
 * One token per browser tab. It lives in sessionStorage, which survives a reload
 * of the same tab and is empty in a new one, so a reload of the tab that placed
 * a bet can be told apart from a different tab opening the same run.
 */
export const TAB_TOKEN_SESSION_KEY = "critical-point-tab-token-v1";
let fallbackTabToken = null;

export function getTabToken() {
  try {
    const storage = globalThis.sessionStorage;
    const existing = storage?.getItem(TAB_TOKEN_SESSION_KEY);
    if (existing) return existing;
    const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    storage?.setItem(TAB_TOKEN_SESSION_KEY, created);
    if (storage) return created;
    fallbackTabToken ??= created;
    return fallbackTabToken;
  } catch {
    fallbackTabToken ??= `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return fallbackTabToken;
  }
}
const SETTLED_WINDOWS_LIMIT = 400;

export function readSettledWindowSeeds() {
  try {
    const parsed = JSON.parse(readStoredValue(SETTLED_WINDOWS_STORAGE_KEY, "[]"));
    return Array.isArray(parsed) ? parsed.filter((seed) => typeof seed === "string") : [];
  } catch {
    return [];
  }
}

export function recordSettledWindowSeed(seed) {
  if (typeof seed !== "string" || !seed) return false;
  const seeds = readSettledWindowSeeds().filter((existing) => existing !== seed);
  seeds.push(seed);
  return writeStoredValue(SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(seeds.slice(-SETTLED_WINDOWS_LIMIT)));
}

export function removeStoredValue(key) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return false;
    storage.removeItem(key);
    return true;
  } catch {
    // Storage can be unavailable in private or embedded browser contexts.
    return false;
  }
}

export function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? "",
    };
  }
  return {
    name: "Error",
    message: typeof error === "string" ? error : "Unknown error",
    stack: "",
  };
}

export function createSafeErrorContext(saved = {}, source = "runtime") {
  const logEntries = Array.isArray(saved.log) ? saved.log : [];
  const lastEntry = logEntries.at(-1);
  return {
    source,
    currentCase: typeof saved.currentCase === "string" ? saved.currentCase : "unknown",
    nodeId: typeof saved.nodeId === "string" ? saved.nodeId : "unknown",
    started: Boolean(saved.started),
    completedCases: Array.isArray(saved.completedCases) ? saved.completedCases : [],
    logLength: logEntries.length,
    lastChoiceId: typeof lastEntry?.choiceId === "string" ? lastEntry.choiceId : "",
    lastNodeId: typeof lastEntry?.nodeId === "string" ? lastEntry.nodeId : "",
  };
}

function normalizeErrorLogEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  const context = entry.context && typeof entry.context === "object" && !Array.isArray(entry.context)
    ? entry.context
    : {};
  const error = entry.error && typeof entry.error === "object" && !Array.isArray(entry.error)
    ? entry.error
    : {};
  return {
    id: normalizeSavedText(entry.id) || `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    occurredAt: normalizeSavedText(entry.occurredAt),
    error: {
      name: normalizeSavedText(error.name) || "Error",
      message: normalizeSavedText(error.message) || "Unknown error",
      stack: normalizeSavedText(error.stack, 12000),
    },
    componentStack: normalizeSavedText(entry.componentStack, 12000),
    domSnapshot: normalizeSavedText(entry.domSnapshot, 12000),
    viewport: {
      width: Number.isFinite(entry.viewport?.width) ? entry.viewport.width : 0,
      height: Number.isFinite(entry.viewport?.height) ? entry.viewport.height : 0,
    },
    context: {
      source: normalizeSavedText(context.source) || "runtime",
      currentCase: normalizeSavedText(context.currentCase) || "unknown",
      nodeId: normalizeSavedText(context.nodeId) || "unknown",
      started: Boolean(context.started),
      completedCases: Array.isArray(context.completedCases) ? context.completedCases.filter((value) => typeof value === "string") : [],
      logLength: Number.isFinite(context.logLength) ? context.logLength : 0,
      lastChoiceId: normalizeSavedText(context.lastChoiceId),
      lastNodeId: normalizeSavedText(context.lastNodeId),
      failedStorageKeys: Array.isArray(context.failedStorageKeys)
        ? context.failedStorageKeys.filter((value) => typeof value === "string")
        : [],
    },
  };
}

export function parseErrorLog(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || parsed.saveSchemaVersion !== 1) return null;
    const entries = Array.isArray(parsed.entries)
      ? parsed.entries.map(normalizeErrorLogEntry).filter(Boolean).slice(0, ERROR_LOG_MAX_ITEMS)
      : [];
    return { saveSchemaVersion: 1, entries };
  } catch {
    return null;
  }
}

export function appendStoredErrorLog(entry) {
  const existing = parseErrorLog(readStoredValue(ERROR_LOG_STORAGE_KEY, "null"));
  const normalizedEntry = normalizeErrorLogEntry(entry);
  const entries = Array.isArray(existing?.entries) ? existing.entries : [];
  const nextLog = {
    saveSchemaVersion: 1,
    entries: [normalizedEntry, ...entries].filter(Boolean).slice(0, ERROR_LOG_MAX_ITEMS),
  };
  return writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(nextLog));
}

export function parseRecoverySlots(raw, schemaVersion = RECOVERY_SLOT_SCHEMA_VERSION) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    if (parsed.recoverySlotSchemaVersion !== schemaVersion || !Array.isArray(parsed.slots)) return null;
    const slots = parsed.slots
      .map((slot) => {
        if (!slot || typeof slot !== "object" || Array.isArray(slot)) return null;
        const snapshot = createRecoverySnapshot(slot.snapshot);
        if (!snapshot) return null;
        return {
          id: normalizeSavedText(slot.id),
          savedAt: normalizeSavedText(slot.savedAt),
          currentCase: normalizeSavedText(slot.currentCase),
          nodeId: normalizeSavedText(slot.nodeId),
          completedCases: Array.isArray(slot.completedCases) ? slot.completedCases : [],
          snapshot,
        };
      })
      .filter((slot) => slot?.id && slot.savedAt && slot.currentCase && slot.nodeId)
      .slice(0, SAVE_SLOT_MAX_ITEMS);
    return {
      recoverySlotSchemaVersion: schemaVersion,
      slots,
    };
  } catch {
    return null;
  }
}

function createRecoveryLogEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {};
  return {
    nodeId: normalizeSavedText(entry.nodeId),
    title: normalizeSavedText(entry.title, 120),
    choiceId: normalizeSavedText(entry.choiceId),
    choice: normalizeSavedText(entry.choice, 160),
    effect: entry.effect && typeof entry.effect === "object" && !Array.isArray(entry.effect) ? entry.effect : {},
    triggers: Array.isArray(entry.triggers) ? entry.triggers : [],
    responseTimeSec: Number.isFinite(entry.responseTimeSec) ? entry.responseTimeSec : 0,
    isSystemEvent: Boolean(entry.isSystemEvent),
    challenge: entry.challenge && typeof entry.challenge === "object" && !Array.isArray(entry.challenge)
      ? {
          title: normalizeSavedText(entry.challenge.title, 120),
          matched: Boolean(entry.challenge.matched),
          riskDelta: Number.isFinite(entry.challenge.riskDelta) ? entry.challenge.riskDelta : 0,
        }
      : null,
  };
}

export function createRecoverySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return null;
  return {
    recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION,
    saveSchemaVersion: snapshot.saveSchemaVersion ?? SAVE_SCHEMA_VERSION,
    runId: normalizeSavedText(snapshot.runId),
    playerName: normalizePlayerName(snapshot.playerName),
    playStyle: normalizeSavedText(snapshot.playStyle),
    openingLegacy: snapshot.openingLegacy ?? null,
    dataConsent: Boolean(snapshot.dataConsent),
    started: Boolean(snapshot.started),
    paused: Boolean(snapshot.paused),
    currentCase: typeof snapshot.currentCase === "string" ? snapshot.currentCase : "unknown",
    nodeId: typeof snapshot.nodeId === "string" ? snapshot.nodeId : "unknown",
    completedCases: Array.isArray(snapshot.completedCases) ? snapshot.completedCases : [],
    discoveredClues: Array.isArray(snapshot.discoveredClues) ? snapshot.discoveredClues : [],
    caseResults: snapshot.caseResults && typeof snapshot.caseResults === "object" && !Array.isArray(snapshot.caseResults) ? snapshot.caseResults : {},
    playtestFeedback: {},
    resources: snapshot.resources && typeof snapshot.resources === "object" && !Array.isArray(snapshot.resources) ? snapshot.resources : {},
    triggers: snapshot.triggers && typeof snapshot.triggers === "object" && !Array.isArray(snapshot.triggers) ? snapshot.triggers : {},
    cognition: snapshot.cognition && typeof snapshot.cognition === "object" && !Array.isArray(snapshot.cognition) ? snapshot.cognition : {},
    echo: normalizeSavedText(snapshot.echo, 900),
    log: Array.isArray(snapshot.log) ? snapshot.log.slice(-20).map(createRecoveryLogEntry) : [],
    pendingTelemetry: [],
    protocolUsed: Boolean(snapshot.protocolUsed),
    timerPenaltyCount: normalizeTimerPenaltyCount(snapshot),
    probeUsed: Boolean(snapshot.probeUsed),
    dynamics: snapshot.dynamics && typeof snapshot.dynamics === "object" && !Array.isArray(snapshot.dynamics) ? snapshot.dynamics : null,
    nodeEnteredAt: Number.isFinite(snapshot.nodeEnteredAt) ? snapshot.nodeEnteredAt : Date.now(),
    savedAt: typeof snapshot.savedAt === "string" ? snapshot.savedAt : new Date().toISOString(),
    lastError: snapshot.lastError ?? null,
  };
}

export function restoreRecoverySnapshot(snapshot) {
  const recoverySnapshot = createRecoverySnapshot(snapshot);
  if (!recoverySnapshot) return null;
  const { recoverySlotSchemaVersion: _version, ...saveSnapshot } = recoverySnapshot;
  return {
    ...saveSnapshot,
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    freeText: "",
    pendingTelemetry: [],
  };
}

export function appendSaveSlot(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return false;
  const recoverySnapshot = createRecoverySnapshot(snapshot);
  if (!recoverySnapshot) return false;
  const existing = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
  const slots = Array.isArray(existing?.slots) ? existing.slots : [];
  const slot = {
    id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: recoverySnapshot.savedAt,
    currentCase: recoverySnapshot.currentCase,
    nodeId: recoverySnapshot.nodeId,
    completedCases: recoverySnapshot.completedCases,
    snapshot: recoverySnapshot,
  };
  return writeStoredValue(
    SAVE_SLOT_STORAGE_KEY,
    JSON.stringify({
      recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION,
      slots: [slot, ...slots].slice(0, SAVE_SLOT_MAX_ITEMS),
    }),
  );
}

export async function copyText(value) {
  try {
    if (globalThis.navigator?.clipboard?.writeText) {
      try {
        await globalThis.navigator.clipboard.writeText(value);
        return true;
      } catch {
        // Permission policies can reject Clipboard API calls while legacy copy still works.
      }
    }

    const documentRef = globalThis.document;
    if (!documentRef?.body) return false;
    const textarea = documentRef.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    documentRef.body.appendChild(textarea);
    textarea.select();
    const copied = documentRef.execCommand?.("copy") ?? false;
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

/**
 * Small shared helpers. They live beside the storage keys because both the
 * pre-start shell and the runtime need them and the shell cannot import
 * gameLogic.js without pulling the scene graph into the first load.
 */
export function limitText(text = "", maxLength = 0) {
  if (!Number.isFinite(maxLength) || maxLength <= 0) return "";
  return String(text).slice(0, maxLength);
}

export function makeEmptyScores(labels) {
  return Object.fromEntries(Object.keys(labels).map((key) => [key, 0]));
}

export function createRunId() {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatSaveTime(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}
