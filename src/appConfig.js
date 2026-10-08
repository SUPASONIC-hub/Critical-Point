import { sanitizeTelemetryQueue, validateSavedStatePayload } from "./state/payloadSchemas.js";

export const STORAGE_KEY = "trigger-prototype-v2";
export const ERROR_LOG_STORAGE_KEY = "trigger-prototype-error-log-v1";
export const ERROR_LOG_MAX_ITEMS = 20;
export const SAVE_SLOT_STORAGE_KEY = "trigger-prototype-save-slots-v1";
export const RECOVERY_CENTER_STORAGE_KEY = "trigger-prototype-recovery-center-v1";
export const NEW_GAME_PLUS_KEY = "critical-point-new-game-plus-unlocked";
export const NEW_GAME_PLUS_MEMORY_KEY = "critical-point-new-game-plus-memory";
export const OPERATOR_ORIGIN_KEY = "critical-point-operator-origin";
export const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";
// The random id telemetry rows carry for this device (telemetry.getSessionId).
// A reset removes it, so the next run's rows are not filed beside the last one's.
export const SESSION_ID_STORAGE_KEY = "critical-point-session-id";
// Set by the debug console to force the next render to throw, and cleared by the
// error boundary's reload. Both files used to spell the string out for
// themselves, which is one typo away from a boundary that can never be reset.
export const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
// Cloud saves (src/cloudSave.js): this device's continuation code, whether the
// player turned uploading off, and which local save has reached the server.
export const CLOUD_SAVE_CODE_KEY = "critical-point-cloud-code-v1";
export const CLOUD_SAVE_ENABLED_KEY = "critical-point-cloud-enabled-v1";
export const CLOUD_SAVE_SYNC_KEY = "critical-point-cloud-sync-v1";
/** How long the server keeps a copy after its last upload (`purge_old_telemetry`). */
export const CLOUD_SAVE_RETENTION_DAYS = 180;
// 참가자 게시판 (src/state/useBoard.js): the nickname the player publishes on
// the board, kept on the device so the form is typed once rather than every
// visit. The posts are the server's copy and are not stored locally.
export const BOARD_NICKNAME_KEY = "critical-point-board-nickname-v1";
// When this device last posted which words, as a mark of the words and not the
// words (readOwnBoardPosts in useBoard.js). Entries are dropped after the six
// hours the server holds a repeat for.
export const BOARD_OWN_POSTS_KEY = "critical-point-board-posted-v1";
// The id the board files this device's posts under; apart from the telemetry
// session id on purpose (getBoardWriterId in src/telemetry.js).
export const BOARD_WRITER_ID_KEY = "critical-point-board-id-v1";
/** Fired on `globalThis` after every save that reached device storage. */
export const SAVE_WRITTEN_EVENT = "critical-point:save-written";
// The raw text of a save this build could not read -- broken JSON, or a schema
// newer than the build after a rolled-back deploy. Kept until the player has a
// readable save again, so the next write is not what destroys it.
export const SAVE_BACKUP_STORAGE_KEY = "critical-point-unreadable-save-v1";
// sessionStorage: when this tab last reloaded itself because a lazy chunk was
// gone (a deploy replaced the hashed files under an open tab).
export const CHUNK_RELOAD_SESSION_KEY = "critical-point-chunk-reload-v1";
// The player's comfort settings: table time, the reading clock, flashes,
// single-key shortcuts, the intro's motion (src/state/accessibilitySettings.js).
export const ACCESSIBILITY_SETTINGS_KEY = "critical-point-accessibility-v1";

/**
 * Debug tooling is on in a build that asks for it, and in a dev server visited
 * with ?debug=1. The shell reads it to decide whether the runtime mounts at once;
 * the runtime reads it to draw the console. One definition so the two agree.
 *
 * `__CP_DEBUG_BUILD__` is a constant the bundler writes (vite.config.js): true
 * on the dev server and in a build that asked for the tools, false in a
 * release. A screen puts it in front of this flag where it draws a debug
 * panel, because a flag that arrives through the view is one the bundler has
 * to ship the panel for; the constant lets it drop the panel. Node, which runs
 * the unit tests, has no such constant and no debug console either.
 */
export const debugToolsEnabled =
  (typeof __CP_DEBUG_BUILD__ === "undefined" ? false : __CP_DEBUG_BUILD__) &&
  ((import.meta.env ?? {}).VITE_ENABLE_DEBUG_TOOLS === "true" ||
    new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");
export const SAVE_SLOT_MAX_ITEMS = 5;
export const SAVE_SCHEMA_VERSION = 2;
export const RECOVERY_SLOT_SCHEMA_VERSION = 1;
export const PLAYER_NAME_MAX_LENGTH = 24;
export const FEEDBACK_COMMENT_MAX_LENGTH = 600;
// The board's post length, mirroring the 2-300 bound the table's trigger
// enforces (supabase/migrations/20260923010000_add_board_posts.sql). The
// nickname reuses PLAYER_NAME_MAX_LENGTH above, which is the same 24 the
// trigger checks.
export const BOARD_POST_MAX_LENGTH = 300;
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
  "echo",
  "nodeEnteredAt",
  "pendingTelemetry",
  "dynamics",
  "paused",
  "savedAt",
];
// Five more keys were written here until 2026-10: `protocolUsed`,
// `timerPenaltyCount`, `probeUsed`, `investigatedTargets` and
// `hypothesisDecisions`. They belonged to the decision board the table
// replaced; since then they were saved, reset in six places and copied into
// every recovery slot, and no rule read them. A save that still carries them
// loads as before -- nothing looks at them -- and the next write leaves them out.

/**
 * The first `maxLength` UTF-16 units of `text`, never ending on half a
 * character. An emoji is two units, and `slice` cuts between them as readily
 * as anywhere: what is left is a lone surrogate, which is not text. Postgres
 * will not store it, so the feedback or board row carrying it was refused
 * with a 400 on every attempt. The half is dropped with the half that was cut.
 */
function sliceWholeCharacters(text, maxLength) {
  const cut = text.slice(0, maxLength);
  if (cut.length === text.length) return cut;
  const last = cut.charCodeAt(cut.length - 1);
  return last >= 0xd800 && last <= 0xdbff ? cut.slice(0, -1) : cut;
}

export function normalizePlayerName(value) {
  return typeof value === "string" ? sliceWholeCharacters(value.trim(), PLAYER_NAME_MAX_LENGTH) : "";
}

export function normalizeSavedText(value, maxLength = 0) {
  if (typeof value !== "string") return "";
  return Number.isFinite(maxLength) && maxLength > 0 ? sliceWholeCharacters(value, maxLength) : value;
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
      dynamics: state.dynamics && typeof state.dynamics === "object" && !Array.isArray(state.dynamics) ? state.dynamics : null,
    };
  }

  return null;
}

export function parseCurrentSavedState(raw, schemaVersion = SAVE_SCHEMA_VERSION) {
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateSavedState(parsed, schemaVersion);
    if (migrated?.saveSchemaVersion !== schemaVersion) return null;
    // A queued telemetry item that can never be sent is dropped here rather than
    // failing the shape check, which would throw the whole run away with it.
    if (!Array.isArray(migrated.pendingTelemetry)) return migrated;
    const pendingTelemetry = sanitizeTelemetryQueue(migrated.pendingTelemetry);
    const unchanged =
      pendingTelemetry.length === migrated.pendingTelemetry.length &&
      pendingTelemetry.every((item, index) => item === migrated.pendingTelemetry[index]);
    return unchanged ? migrated : { ...migrated, pendingTelemetry };
  } catch {
    return null;
  }
}

/**
 * `dynamics: false` is for the pre-start shell, which reads the save without
 * repairing it: the table record is brought up to date by the runtime's repair,
 * so an older one is not the shell's to call invalid.
 */
export function isSavedStateShapeValid(state, options) {
  return validateSavedStatePayload(state, options).length === 0;
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

/**
 * A replay link opens someone's captured scene on this device. Nothing it does
 * is this player's run, so while it is open no write reaches the save: it used
 * to replace whatever run the viewer had with the linked scene.
 */
let replaySession = false;

export function setReplaySession(active) {
  replaySession = Boolean(active);
}

export function isReplaySession() {
  return replaySession;
}

// `writeSaveState` puts the revision last, so it can be read off the end of the
// stored text. A save is ~125KB by the end of a season and every write used to
// parse all of it to read this one number.
const SAVE_REVISION_TAIL = /"saveRevision":(\d+)\}\s*$/;

function readSaveRevision() {
  const raw = readStoredValue(STORAGE_KEY, "null");
  const tail = typeof raw === "string" ? SAVE_REVISION_TAIL.exec(raw.slice(-40)) : null;
  if (tail) return Math.max(0, Math.trunc(Number(tail[1]) || 0));
  // Written by an older build, or by hand: the revision is wherever it is.
  try {
    const parsed = JSON.parse(raw);
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
 * A save this build cannot use, as the text storage holds: not JSON, not an
 * object, or written under a schema newer than the build (a deploy rolled
 * back). `null` when there is no save or the save reads.
 */
export function readUnreadableSave() {
  const raw = readStoredValue(STORAGE_KEY, null);
  if (typeof raw !== "string" || raw === "" || raw === "null") return null;
  return parseCurrentSavedState(raw, SAVE_SCHEMA_VERSION) ? null : raw;
}

/** Keeps the text of an unusable save where the next write will not reach it. */
export function backUpUnreadableSave(raw) {
  if (typeof raw !== "string" || !raw || readStoredValue(SAVE_BACKUP_STORAGE_KEY, null) === raw) return false;
  return writeStoredValue(SAVE_BACKUP_STORAGE_KEY, raw);
}

/**
 * The finished season NEW GAME+ remembers: its case summaries by case id, or
 * an empty record. The shell and the runtime each parsed the key themselves
 * and took whatever JSON it held -- an array or a string as readily as the
 * record they went on to read by case id.
 */
export function readNewGamePlusMemory() {
  try {
    const memory = JSON.parse(readStoredValue(NEW_GAME_PLUS_MEMORY_KEY, "{}"));
    return memory && typeof memory === "object" && !Array.isArray(memory) ? memory : {};
  } catch {
    return {};
  }
}

export function hasRecoverySlots() {
  return (parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"))?.slots.length ?? 0) > 0;
}

/**
 * Makes room for the save when storage is full. The save is the one thing a
 * player cannot get back, so what is less important goes first: the kept copy
 * of an unreadable save, every recovery slot but the newest, then that one,
 * then the error log. A step answers whether it freed anything, and the write
 * is tried again only when it did.
 */
const SAVE_EVICTIONS = [
  () => readStoredValue(SAVE_BACKUP_STORAGE_KEY, null) !== null && removeStoredValue(SAVE_BACKUP_STORAGE_KEY),
  () => {
    const slots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"))?.slots ?? [];
    if (slots.length <= 1) return false;
    return writeStoredValue(
      SAVE_SLOT_STORAGE_KEY,
      JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: slots.slice(0, 1) }),
    );
  },
  () => readStoredValue(SAVE_SLOT_STORAGE_KEY, null) !== null && removeStoredValue(SAVE_SLOT_STORAGE_KEY),
  () => readStoredValue(ERROR_LOG_STORAGE_KEY, null) !== null && removeStoredValue(ERROR_LOG_STORAGE_KEY),
];

function writeSaveText(text) {
  if (writeStoredValue(STORAGE_KEY, text)) return { saved: true, evicted: false };
  for (const evict of SAVE_EVICTIONS) {
    if (evict() && writeStoredValue(STORAGE_KEY, text)) return { saved: true, evicted: true };
  }
  return { saved: false, evicted: false };
}

/**
 * `isAhead(stored, payload)` narrows what counts as a conflict once storage has
 * moved past this tab. Without it any newer revision refuses the write, which is
 * right for writers that know nothing about the run and wrong for the runtime:
 * a second tab that only opened the game would lock the first.
 *
 * `sideChannel` is for a writer that edits the stored save in place and knows
 * nothing about the run in memory (the error recovery). It writes the way
 * `force` does, but moves this tab's known revision only when the tab was level
 * with storage before the write. A tab that was already behind stays behind: a
 * force write used to bring it level, so the stale tab's next ordinary save
 * skipped the conflict check and wrote its old run over the other tab's.
 */
export function writeSaveState(payload, { force = false, sideChannel = false, isAhead = null } = {}) {
  if (replaySession) return { saved: false, stale: false, replay: true, revision: knownSaveRevision ?? 0 };
  const storedRevision = readSaveRevision();
  if (knownSaveRevision === null) knownSaveRevision = storedRevision;
  const behind = storedRevision > knownSaveRevision;
  if (!force && !sideChannel && behind) {
    let stored;
    try {
      stored = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    } catch {
      stored = null;
    }
    if (!isAhead || isAhead(stored, payload)) return { saved: false, stale: true, revision: storedRevision };
  }
  const revision = Math.max(storedRevision, knownSaveRevision) + 1;
  const { saveRevision: _previous, ...run } = payload ?? {};
  const { saved, evicted } = writeSaveText(JSON.stringify({ ...run, saveRevision: revision }));
  if (saved) {
    if (!(sideChannel && behind)) knownSaveRevision = revision;
    // The device copy is the save; the cloud copy follows it (src/cloudSave.js).
    if (typeof globalThis.dispatchEvent === "function" && typeof globalThis.CustomEvent === "function") {
      globalThis.dispatchEvent(new CustomEvent(SAVE_WRITTEN_EVENT, { detail: { savedAt: payload?.savedAt ?? "" } }));
    }
  }
  return { saved, stale: false, revision, evicted };
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

/**
 * One token, one live tab. A browser that copies a tab -- "Duplicate tab", or a
 * window opened from this one -- copies its sessionStorage too, token included,
 * and the copy then reads as a reload of the original: it would settle the
 * window the original is still playing as a bust. So a tab that starts with a
 * token already in storage asks whether anyone is holding it, and takes a new
 * one when a live tab answers. A reload asks too and hears nothing, because the
 * page that held the token is the one that went away.
 *
 * The answer is a message round trip, so it is awaited before the runtime
 * mounts (AppContent) rather than before the first paint.
 */
const TAB_TOKEN_CHANNEL = "critical-point-tab-token";
const TAB_TOKEN_CLAIM_MS = 80;
let tabTokenClaim = null;

function readStoredTabToken() {
  try {
    return globalThis.sessionStorage?.getItem(TAB_TOKEN_SESSION_KEY) ?? null;
  } catch {
    return null;
  }
}

export function claimTabToken() {
  if (tabTokenClaim) return tabTokenClaim;
  const inherited = readStoredTabToken();
  let channel = null;
  try {
    channel = typeof globalThis.BroadcastChannel === "function" ? new globalThis.BroadcastChannel(TAB_TOKEN_CHANNEL) : null;
  } catch {
    channel = null;
  }
  if (!channel) {
    tabTokenClaim = Promise.resolve(false);
    return tabTokenClaim;
  }
  let claiming = inherited !== null;
  tabTokenClaim = new Promise((resolve) => {
    const settle = (replaced) => {
      if (!claiming) return;
      claiming = false;
      resolve(replaced);
    };
    channel.onmessage = (event) => {
      const { type, token } = event.data ?? {};
      if (type === "claim" && !claiming && token === readStoredTabToken()) channel.postMessage({ type: "held", token });
      if (type !== "held" || !claiming || token !== inherited) return;
      try {
        globalThis.sessionStorage?.removeItem(TAB_TOKEN_SESSION_KEY);
      } catch {
        // No storage to clear: getTabToken falls back to a token of its own.
      }
      getTabToken();
      settle(true);
    };
    if (!claiming) {
      resolve(false);
      return;
    }
    channel.postMessage({ type: "claim", token: inherited });
    globalThis.setTimeout(() => settle(false), TAB_TOKEN_CLAIM_MS);
  });
  return tabTokenClaim;
}
export const SETTLED_WINDOWS_LIMIT = 400;

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

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * A recovery slot is the save as it stood, so restoring one is exact. It used
 * to keep the last twenty log entries with most of their fields stripped --
 * `caseId`, `threshold`, `resourcesBefore/After` among them -- which lost the
 * busts a restore has to carry forward (`carryTableRecordIntoRestore` indexes
 * the current log by the restored log's length) and the evidence the next
 * choice reads. The run's own queue and feedback stay out: restoring a slot
 * keeps the ones the current save holds (useAppPersistence.restoreSaveSlot).
 */
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
    log: Array.isArray(snapshot.log) ? snapshot.log.filter(isPlainObject) : [],
    pendingTelemetry: [],
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
    pendingTelemetry: [],
  };
}

export function appendSaveSlot(snapshot) {
  if (replaySession || !isPlainObject(snapshot)) return false;
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
  // Slots hold whole logs now, so a full storage drops the oldest slots rather
  // than the newest one.
  const candidates = [slot, ...slots].slice(0, SAVE_SLOT_MAX_ITEMS);
  for (let count = candidates.length; count > 0; count -= 1) {
    const written = writeStoredValue(
      SAVE_SLOT_STORAGE_KEY,
      JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: candidates.slice(0, count) }),
    );
    if (written) return true;
  }
  return false;
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
  return sliceWholeCharacters(String(text), maxLength);
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
