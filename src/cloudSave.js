import {
  CLOUD_SAVE_CODE_KEY,
  CLOUD_SAVE_ENABLED_KEY,
  CLOUD_SAVE_SYNC_KEY,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readSettledWindowSeeds,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_WRITTEN_EVENT,
  SETTLED_WINDOWS_STORAGE_KEY,
  STORAGE_KEY,
  writeSaveState,
  writeStoredValue,
} from "./appConfig.js";
import { callSupabaseRpc, telemetryEnabled } from "./telemetry.js";

/**
 * Saves that follow the player to another device, and survive being offline.
 *
 * The device is always written first -- `writeSaveState` is still the save, and
 * a run never waits on a network. Every write that reaches device storage fires
 * `SAVE_WRITTEN_EVENT`; this module notes that a newer local copy exists and
 * uploads it once the browser is online, a moment after the writes settle.
 * Going offline only means the note waits: the next `online` event, a retry
 * tick, or the next launch sends it.
 *
 * The copy is filed under a continuation code the player can read off one
 * device and type into another. The server keeps one copy per code and refuses
 * an upload older than the one it holds (`put_cloud_save`), so a phone that was
 * offline all morning cannot overwrite the evening's play on a laptop; this
 * module reports that as a conflict and offers the newer copy instead.
 *
 * This file must not import the scene graph: the intro shell loads it.
 */

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 12;
const UPLOAD_DELAY_MS = 2500;
const RETRY_INTERVAL_MS = 30000;
const SETTLED_WINDOWS_LIMIT = 400;

export const cloudSaveAvailable = telemetryEnabled;

let snapshot = Object.freeze({ phase: "idle", syncedAt: "", remoteSavedAt: "", message: "" });
const listeners = new Set();
let uploadTimer = null;
let inFlight = null;
let installed = false;

function publish(next) {
  snapshot = Object.freeze({ ...snapshot, ...next });
  listeners.forEach((listener) => listener());
}

export function subscribeCloudSave(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCloudSaveSnapshot() {
  return snapshot;
}

export function normalizeCloudCode(input) {
  const code = String(input ?? "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  return code.length === CODE_LENGTH && [...code].every((char) => CODE_ALPHABET.includes(char)) ? code : null;
}

export function formatCloudCode(code) {
  return code ? code.match(/.{1,4}/g).join("-") : "";
}

/** 32 symbols divide 256, so a byte modulo 32 is unbiased: 60 bits of code. */
export function createCloudCode(fillRandom = (bytes) => globalThis.crypto.getRandomValues(bytes)) {
  const bytes = fillRandom(new Uint8Array(CODE_LENGTH));
  return [...bytes].map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function getCloudCode() {
  const existing = normalizeCloudCode(readStoredValue(CLOUD_SAVE_CODE_KEY, ""));
  if (existing) return existing;
  const created = createCloudCode();
  writeStoredValue(CLOUD_SAVE_CODE_KEY, created);
  return created;
}

export function isCloudSaveEnabled() {
  return cloudSaveAvailable && readStoredValue(CLOUD_SAVE_ENABLED_KEY, "1") !== "0";
}

export function setCloudSaveEnabled(enabled) {
  writeStoredValue(CLOUD_SAVE_ENABLED_KEY, enabled ? "1" : "0");
  if (enabled) scheduleUpload(0);
  else publish({ phase: "disabled", message: "" });
}

function readSync() {
  try {
    const parsed = JSON.parse(readStoredValue(CLOUD_SAVE_SYNC_KEY, "{}"));
    return {
      pending: typeof parsed?.pending === "string" ? parsed.pending : "",
      synced: typeof parsed?.synced === "string" ? parsed.synced : "",
    };
  } catch {
    return { pending: "", synced: "" };
  }
}

function writeSync(next) {
  writeStoredValue(CLOUD_SAVE_SYNC_KEY, JSON.stringify({ ...readSync(), ...next }));
}

function readLocalSave() {
  try {
    const save = JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    return save && typeof save === "object" && typeof save.savedAt === "string" ? save : null;
  } catch {
    return null;
  }
}

function isOffline() {
  return globalThis.navigator?.onLine === false;
}

/** Upload the device's newest save if the server does not have it yet. */
export function flushCloudSave() {
  if (!isCloudSaveEnabled()) {
    publish({ phase: cloudSaveAvailable ? "disabled" : "unavailable" });
    return Promise.resolve(false);
  }
  const save = readLocalSave();
  const { pending, synced } = readSync();
  if (!save || (!pending && synced === save.savedAt)) {
    publish({ phase: save ? "synced" : "idle", syncedAt: synced });
    return Promise.resolve(Boolean(save));
  }
  if (isOffline()) {
    publish({ phase: "offline" });
    return Promise.resolve(false);
  }
  if (inFlight) return inFlight;
  publish({ phase: "syncing", message: "" });
  inFlight = callSupabaseRpc("put_cloud_save", {
    p_code: getCloudCode(),
    p_saved_at: save.savedAt,
    p_payload: { save, settledWindows: readSettledWindowSeeds() },
  })
    .then(({ data }) => {
      if (data?.accepted === false) {
        writeSync({ pending: "" });
        publish({ phase: "conflict", remoteSavedAt: String(data.saved_at ?? "") });
        return false;
      }
      // A write that landed while this one was in flight is still pending.
      if (readSync().pending === pending || readSync().pending === save.savedAt) writeSync({ pending: "" });
      writeSync({ synced: save.savedAt });
      publish({ phase: readSync().pending ? "pending" : "synced", syncedAt: save.savedAt, remoteSavedAt: "" });
      if (readSync().pending) scheduleUpload(UPLOAD_DELAY_MS);
      return true;
    })
    .catch((error) => {
      publish({ phase: isOffline() ? "offline" : "error", message: error instanceof Error ? error.message : "" });
      return false;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

function scheduleUpload(delay = UPLOAD_DELAY_MS) {
  globalThis.clearTimeout(uploadTimer);
  uploadTimer = globalThis.setTimeout(() => {
    flushCloudSave();
  }, delay);
}

/** Starts following local saves. Safe to call more than once. */
export function installCloudSync() {
  if (installed || typeof globalThis.addEventListener !== "function") return;
  installed = true;
  if (!cloudSaveAvailable) {
    publish({ phase: "unavailable" });
    return;
  }
  globalThis.addEventListener(SAVE_WRITTEN_EVENT, (event) => {
    if (!isCloudSaveEnabled()) return;
    writeSync({ pending: String(event?.detail?.savedAt ?? "") || new Date().toISOString() });
    publish({ phase: isOffline() ? "offline" : "pending" });
    scheduleUpload();
  });
  globalThis.addEventListener("online", () => scheduleUpload(0));
  globalThis.addEventListener("offline", () => {
    if (readSync().pending) publish({ phase: "offline" });
  });
  globalThis.setInterval(() => {
    if (readSync().pending && !isOffline()) flushCloudSave();
  }, RETRY_INTERVAL_MS);
  scheduleUpload(1000);
}

/** Reads the copy filed under a code. Returns null when there is none. */
export async function fetchCloudSave(codeInput) {
  const code = normalizeCloudCode(codeInput);
  if (!code) throw new Error("이어하기 코드는 12자리 영문·숫자입니다.");
  if (!cloudSaveAvailable) throw new Error("이 배포에는 온라인 저장 서버가 설정되어 있지 않습니다.");
  if (isOffline()) throw new Error("오프라인이라 불러올 수 없습니다. 연결된 뒤 다시 시도하세요.");
  const { data } = await callSupabaseRpc("get_cloud_save", { p_code: code });
  const save = parseCurrentSavedState(JSON.stringify(data?.payload?.save ?? null), SAVE_SCHEMA_VERSION);
  if (!save || !isSavedStateShapeValid(save)) return null;
  const settledWindows = Array.isArray(data.payload.settledWindows)
    ? data.payload.settledWindows.filter((seed) => typeof seed === "string")
    : [];
  return { code, save, settledWindows, savedAt: String(data.saved_at ?? save.savedAt ?? "") };
}

/**
 * Makes a fetched copy this device's save, and this device's code the one it
 * was filed under, so the two devices keep one save between them. The run opens
 * paused on the intro, so 이어하기 is still the player's own click.
 */
export function applyCloudSave({ code, save, settledWindows = [] }) {
  const settled = [...new Set([...readSettledWindowSeeds(), ...settledWindows])].slice(-SETTLED_WINDOWS_LIMIT);
  writeStoredValue(SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(settled));
  const written = writeSaveState({ ...save, started: false, paused: true }, { force: true });
  if (!written.saved) return false;
  writeStoredValue(CLOUD_SAVE_CODE_KEY, code);
  writeSync({ pending: "", synced: save.savedAt });
  publish({ phase: "synced", syncedAt: save.savedAt, remoteSavedAt: "" });
  return true;
}

/** The one status line each phase prints. */
export function describeCloudPhase(phase) {
  return (
    {
      idle: "아직 저장된 진행이 없습니다.",
      pending: "기기에 저장됨 · 곧 온라인에 올립니다.",
      syncing: "온라인에 올리는 중입니다.",
      synced: "기기와 온라인 모두 최신입니다.",
      offline: "오프라인 · 기기에 저장해 두었고, 연결되면 자동으로 올립니다.",
      conflict: "다른 기기에 더 최근 저장이 있습니다. 아래에서 불러올 수 있습니다.",
      error: "온라인 저장에 실패했습니다. 기기 저장은 안전하며 잠시 뒤 다시 시도합니다.",
      disabled: "온라인 저장을 껐습니다. 이 기기에만 저장합니다.",
      unavailable: "이 배포에는 온라인 저장 서버가 없어 이 기기에만 저장합니다.",
    }[phase] ?? ""
  );
}
