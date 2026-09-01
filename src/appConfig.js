export const STORAGE_KEY = "trigger-prototype-v2";
export const ERROR_LOG_STORAGE_KEY = "trigger-prototype-error-log-v1";
export const ERROR_LOG_MAX_ITEMS = 20;
export const SAVE_SLOT_STORAGE_KEY = "trigger-prototype-save-slots-v1";
export const RECOVERY_CENTER_STORAGE_KEY = "trigger-prototype-recovery-center-v1";
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
  "timerPenaltyApplied",
  "probeUsed",
  "investigatedTargets",
  "hypothesisDecisions",
  "paused",
  "savedAt",
];

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
      timerPenaltyApplied: Boolean(state.timerPenaltyApplied),
      probeUsed: Boolean(state.probeUsed),
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
  if (!state || typeof state !== "object" || Array.isArray(state)) return false;
  const arrayKeys = ["completedCases", "discoveredClues", "log", "pendingTelemetry"];
  const objectKeys = ["caseResults", "playtestFeedback", "resources", "triggers", "cognition"];
  const pendingTelemetryIsValid = Array.isArray(state.pendingTelemetry) && state.pendingTelemetry.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      TELEMETRY_QUEUE_TYPES.includes(item.type) &&
      typeof item.label === "string" &&
      item.payload &&
      typeof item.payload === "object" &&
      !Array.isArray(item.payload),
  );
  return (
    arrayKeys.every((key) => Array.isArray(state[key])) &&
    pendingTelemetryIsValid &&
    objectKeys.every((key) => state[key] && typeof state[key] === "object" && !Array.isArray(state[key])) &&
    (state.runId === undefined || typeof state.runId === "string") &&
    typeof state.currentCase === "string" &&
    typeof state.nodeId === "string"
  );
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
    timerPenaltyApplied: Boolean(snapshot.timerPenaltyApplied),
    probeUsed: Boolean(snapshot.probeUsed),
    nodeEnteredAt: Number.isFinite(snapshot.nodeEnteredAt) ? snapshot.nodeEnteredAt : Date.now(),
    savedAt: typeof snapshot.savedAt === "string" ? snapshot.savedAt : new Date().toISOString(),
    lastError: snapshot.lastError ?? null,
  };
}

export function restoreRecoverySnapshot(snapshot) {
  const recoverySnapshot = createRecoverySnapshot(snapshot);
  if (!recoverySnapshot) return null;
  const { recoverySlotSchemaVersion, ...saveSnapshot } = recoverySnapshot;
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
