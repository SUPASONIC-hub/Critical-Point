import {
  CLOUD_SAVE_CODE_KEY,
  CLOUD_SAVE_ENABLED_KEY,
  CLOUD_SAVE_SYNC_KEY,
  isSavedStateShapeValid,
  NEW_GAME_PLUS_KEY,
  parseCurrentSavedState,
  readSettledWindowSeeds,
  readStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_WRITTEN_EVENT,
  setReplaySession,
  SETTLED_WINDOWS_LIMIT,
  SETTLED_WINDOWS_STORAGE_KEY,
  STORAGE_KEY,
  writeSaveState,
  writeStoredValue,
} from "./appConfig.js";
import { clearReplayFromLocation } from "./state/trace.js";
import { callSupabaseRpc, isMissingRpc, telemetryEnabled } from "./telemetry.js";

/**
 * Saves that follow the player to another device, and survive being offline.
 *
 * Nothing here runs until the player turns 온라인 저장 on in CloudSavePanel;
 * `main.jsx` installs the sync only for a device that already opted in, and
 * the upload leaves out the name, feedback comments and the telemetry queue
 * (`createCloudSavePayload`).
 *
 * The device is always written first -- `writeSaveState` is still the save, and
 * a run never waits on a network. Every write that reaches device storage fires
 * `SAVE_WRITTEN_EVENT`; this module notes that a newer local copy exists and
 * uploads it once the browser is online, a moment after the writes settle.
 * Going offline only means the note waits: the next `online` event, a retry
 * tick, or the next launch sends it.
 *
 * The copy is filed under a continuation code the player can read off one
 * device and type into another, and two devices are ordered by lineage, not by
 * the clock. The server counts every accepted write (`revision`); an upload
 * names the revision it was built on, and is refused when the stored copy has
 * moved past it. It used to be ordered by the save's own timestamp, which
 * every local write stamps with the present -- so a phone that had fallen two
 * hours behind replaced the laptop's evening with one decision, or with a
 * telemetry-queue write that was no play at all.
 *
 * A refusal is a conflict, and a conflict stays: nothing uploads again until
 * the player either loads the copy the server holds or says, in so many words,
 * that this device's progress should replace it.
 *
 * The client is deployed before the migration it was written for
 * (20260929030000), so each new call falls back to the one the older database
 * answers: no `peek_cloud_save` means this device's own bookkeeping decides,
 * and no `p_expected_revision` means the put is sent the old way.
 *
 * This file must not import the scene graph: the intro loads it, when the
 * fold is opened or the device has opted in (`main.jsx`), and it is not part
 * of what a visitor who never turns online save on downloads. The one thing it
 * needs from the table -- carrying busts across a restore -- is fetched when a
 * copy is actually loaded.
 */

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 12;
const UPLOAD_DELAY_MS = 2500;
const RETRY_INTERVAL_MS = 30000;
// The server takes 240 puts an hour for one code (20260929030000, and
// check-grants drives it to the 241st). A scene is two saves or more -- the
// card laid down, then the verdict -- and each used to be an upload 2.5
// seconds later, so quick play reached the limit and sat in "요청이 너무
// 잦습니다" until the hour turned. The first half of the budget is spent as
// before; past it uploads are spaced so the rest of the hour cannot spend the
// other half. Counted per page load: a reload forgets, and the server still
// has the last word.
const HOURLY_PUT_BUDGET = 240;
const HOUR_MS = 60 * 60_000;
const SPACED_UPLOAD_MS = HOUR_MS / (HOURLY_PUT_BUDGET / 2);
const putTimes = [];

/** How long the next automatic upload waits: `delay`, or longer once half the hour's puts are spent. */
export function paceUpload(delay, recentPuts, now = Date.now()) {
  const inHour = recentPuts.filter((at) => now - at < HOUR_MS);
  if (inHour.length < HOURLY_PUT_BUDGET / 2) return delay;
  return Math.max(delay, inHour.at(-1) + SPACED_UPLOAD_MS - now);
}

export const cloudSaveAvailable = telemetryEnabled;

let snapshot = Object.freeze({ phase: "idle", syncedAt: "", remoteSavedAt: "", message: "" });
const listeners = new Set();
let uploadTimer = null;
let inFlight = null;
let installed = false;
// Whether this page load has asked the server what it holds. Asked once: the
// answer can only change through an upload, and an upload is refused if it did.
let remoteChecked = false;

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

/**
 * Off until the player turns it on. It used to be on by default, so every
 * visitor's run went to the server before anyone had asked -- beside a consent
 * box that promised the name stays on the device.
 */
export function isCloudSaveEnabled() {
  return cloudSaveAvailable && readStoredValue(CLOUD_SAVE_ENABLED_KEY, "0") === "1";
}

export function setCloudSaveEnabled(enabled) {
  writeStoredValue(CLOUD_SAVE_ENABLED_KEY, enabled ? "1" : "0");
  if (enabled) {
    installCloudSync();
    scheduleUpload(0);
  } else {
    globalThis.clearTimeout(uploadTimer);
    publish({ phase: "disabled", message: "" });
  }
}

/**
 * What leaves the device: the run, and nothing the player typed or is called.
 * The name, the feedback comments and the telemetry queue (which only exists
 * under the separate research consent) stay local. A restore fills them back
 * from the device it lands on (`applyCloudSave`).
 */
export function createCloudSavePayload(save) {
  const { pendingTelemetry: _queue, playerName: _name, ...run } = save;
  const feedback = save.playtestFeedback && typeof save.playtestFeedback === "object" && !Array.isArray(save.playtestFeedback)
    ? save.playtestFeedback
    : {};
  return {
    ...run,
    playtestFeedback: Object.fromEntries(
      Object.entries(feedback).map(([caseId, entry]) => [caseId, { ...entry, comment: "" }]),
    ),
  };
}

function toRevision(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const revision = value === "" ? NaN : Number(value);
  return Number.isInteger(revision) && revision >= 0 ? revision : null;
}

/**
 * This device's bookkeeping: `pending` is the local save still to upload,
 * `synced` the one the server last accepted and `revision` the count it gave
 * back for it, and `conflict` what the server said it holds when it refused.
 */
function readSync() {
  try {
    const parsed = JSON.parse(readStoredValue(CLOUD_SAVE_SYNC_KEY, "{}"));
    const conflict = parsed?.conflict && typeof parsed.conflict === "object" && !Array.isArray(parsed.conflict)
      ? { savedAt: typeof parsed.conflict.savedAt === "string" ? parsed.conflict.savedAt : "", revision: toRevision(parsed.conflict.revision) }
      : null;
    return {
      pending: typeof parsed?.pending === "string" ? parsed.pending : "",
      synced: typeof parsed?.synced === "string" ? parsed.synced : "",
      revision: toRevision(parsed?.revision),
      conflict,
    };
  } catch {
    return { pending: "", synced: "", revision: null, conflict: null };
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

function sameInstant(left, right) {
  const a = Date.parse(left);
  const b = Date.parse(right);
  return Number.isFinite(a) && a === b;
}

/** A sentence this module wrote for the player, as opposed to one a server raised. */
function cloudError(text) {
  return Object.assign(new Error(text), { userFacing: true });
}

/**
 * The server refuses in English, because a Postgres function raises the
 * message and it also answers `curl`. The panel used to print that text -- the
 * status line and up to 500 characters of JSON -- under the player's save.
 */
export function describeCloudFailure(error) {
  if (error?.userFacing) return error.message;
  const text = `${error?.serverMessage ?? ""} ${error instanceof Error ? error.message : ""}`;
  const status = Number(error?.status) || 0;
  if (/code limit/.test(text)) return "오늘 이 네트워크에서 새로 만들 수 있는 이어하기 코드를 모두 썼습니다. 내일 다시 켜 주세요. 이 기기 저장은 안전합니다.";
  if (status === 429 || /rate limit/.test(text)) return "온라인 저장 요청이 너무 잦습니다. 잠시 뒤에 다시 시도합니다. 이 기기 저장은 안전합니다.";
  if (/invalid cloud save code/.test(text)) return "이어하기 코드는 12자리 영문·숫자입니다.";
  if (/invalid cloud save payload/.test(text)) return "진행 기록이 온라인 저장 한도보다 커서 올리지 못했습니다. 이 기기 저장은 안전합니다.";
  if (isOffline() || status === 0) return "온라인 저장 서버에 연결하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.";
  return "온라인 저장에 실패했습니다. 이 기기 저장은 안전하며 잠시 뒤 다시 시도합니다.";
}

function holdConflict({ savedAt = "", revision = null } = {}) {
  writeSync({ conflict: { savedAt: String(savedAt ?? ""), revision: toRevision(revision) } });
  publish({ phase: "conflict", remoteSavedAt: String(savedAt ?? ""), message: "" });
}

/**
 * What the server holds for this code: `{ savedAt, revision }`, `null` when it
 * holds nothing, `undefined` when it cannot say (a database without
 * `peek_cloud_save`, or no answer at all).
 */
async function peekRemote() {
  try {
    const { data } = await callSupabaseRpc("peek_cloud_save", { p_code: getCloudCode() });
    if (data === null) return null;
    // An answer with no revision in it is not an answer to this question.
    const revision = toRevision(data?.revision);
    return revision === null ? undefined : { savedAt: String(data.saved_at ?? ""), revision };
  } catch (error) {
    if (!isMissingRpc(error)) console.warn("Critical Point cloud save could not be checked", error);
    return undefined;
  }
}

/** One put. A database without `p_expected_revision` gets the call it knows. */
async function putRemote(save, expectedRevision) {
  const body = {
    p_code: getCloudCode(),
    p_saved_at: save.savedAt,
    p_payload: { save: createCloudSavePayload(save), settledWindows: readSettledWindowSeeds() },
  };
  const now = Date.now();
  while (putTimes.length > 0 && now - putTimes[0] >= HOUR_MS) putTimes.shift();
  putTimes.push(now);
  if (expectedRevision === null) return (await callSupabaseRpc("put_cloud_save", body)).data;
  try {
    return (await callSupabaseRpc("put_cloud_save", { ...body, p_expected_revision: expectedRevision })).data;
  } catch (error) {
    if (!isMissingRpc(error)) throw error;
    return (await callSupabaseRpc("put_cloud_save", body)).data;
  }
}

/**
 * Whether a copy the server holds, and this upload did not expect, was put
 * there by this device after all -- by another tab of it. Every tab keeps its
 * own timer and its own "one upload at a time", and they share one record of
 * the last revision. So a tab can read revision n, and find the server at n+1
 * because the tab beside it uploaded in between: that was held as a conflict
 * with "another device", and it stopped uploads in both tabs until the player
 * settled it on the intro.
 *
 * Storage is read again, since the other tab writes the revision it was given
 * there. Before it has, the copy still carries the time of a save this device
 * wrote: the one in storage now, or the last one recorded as sent.
 */
function isOwnRemote(remote, save) {
  const sync = readSync();
  if (sync.revision !== null && toRevision(remote?.revision) === sync.revision) return true;
  return sameInstant(remote?.savedAt, save?.savedAt) || (Boolean(sync.synced) && sameInstant(remote?.savedAt, sync.synced));
}

/**
 * The revision the next upload is built on, or a conflict. With no revision on
 * record (a device that opted in before revisions were sent) the server's copy
 * counts as this device's own only when its time is the time of the save this
 * device last had accepted.
 */
async function resolveExpectedRevision(sync, save, { overwrite }) {
  if (sync.revision !== null && !overwrite && remoteChecked) return { expected: sync.revision };
  const remote = await peekRemote();
  remoteChecked = true;
  if (remote === undefined) return { expected: overwrite ? null : sync.revision };
  if (remote === null) return { expected: 0 };
  if (overwrite) return { expected: remote.revision };
  const own = sync.revision !== null ? remote.revision === sync.revision : Boolean(sync.synced) && sameInstant(remote.savedAt, sync.synced);
  if (own || isOwnRemote(remote, save)) return { expected: remote.revision };
  return { conflict: remote };
}

async function upload(save, pending, { overwrite }) {
  const sync = readSync();
  const upToDate = !pending && sync.synced === save.savedAt;
  if (upToDate && remoteChecked && !overwrite) {
    publish({ phase: "synced", syncedAt: sync.synced });
    return true;
  }
  const { expected, conflict } = await resolveExpectedRevision(sync, save, { overwrite });
  if (conflict) {
    holdConflict(conflict);
    return false;
  }
  // The server holds what this device last sent, and nothing has changed here.
  if (upToDate && !overwrite && expected !== 0) {
    if (expected !== null) writeSync({ revision: expected });
    publish({ phase: "synced", syncedAt: sync.synced });
    return true;
  }
  publish({ phase: "syncing", message: "" });
  let data = await putRemote(save, expected ?? null);
  // Refused over a copy another tab of this device just put there: built on
  // that copy, the upload is sent once more (isOwnRemote).
  const refusedAt = data?.accepted === false ? { savedAt: data.saved_at, revision: toRevision(data.revision) } : null;
  if (refusedAt && refusedAt.revision !== null && isOwnRemote(refusedAt, save)) data = await putRemote(save, refusedAt.revision);
  if (data?.accepted === false) {
    holdConflict({ savedAt: data.saved_at, revision: data.revision });
    return false;
  }
  // A write that landed while this one was in flight is still pending.
  const latest = readSync().pending;
  const stillPending = latest && latest !== pending && latest !== save.savedAt ? latest : "";
  writeSync({ pending: stillPending, synced: save.savedAt, revision: toRevision(data?.revision), conflict: null });
  publish({ phase: stillPending ? "pending" : "synced", syncedAt: save.savedAt, remoteSavedAt: "", message: "" });
  if (stillPending) scheduleUpload(UPLOAD_DELAY_MS);
  return true;
}

/**
 * Upload the device's newest save if the server does not have it yet.
 * `overwrite` is the player's own answer to a conflict: this device's progress
 * replaces what the server holds.
 */
export function flushCloudSave({ overwrite = false } = {}) {
  if (!isCloudSaveEnabled()) {
    publish({ phase: cloudSaveAvailable ? "disabled" : "unavailable" });
    return Promise.resolve(false);
  }
  const save = readLocalSave();
  if (!save) {
    publish({ phase: "idle" });
    return Promise.resolve(false);
  }
  const { pending, conflict } = readSync();
  if (conflict && !overwrite) {
    publish({ phase: "conflict", remoteSavedAt: conflict.savedAt });
    return Promise.resolve(false);
  }
  if (isOffline()) {
    publish({ phase: "offline" });
    return Promise.resolve(false);
  }
  if (inFlight) return inFlight;
  inFlight = upload(save, pending, { overwrite })
    .catch((error) => {
      publish({ phase: isOffline() ? "offline" : "error", message: describeCloudFailure(error) });
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
  }, paceUpload(delay, putTimes));
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
    // A conflict is not replaced by "곧 올립니다": nothing uploads until it is settled.
    if (readSync().conflict) return;
    publish({ phase: isOffline() ? "offline" : "pending" });
    scheduleUpload();
  });
  globalThis.addEventListener("online", () => scheduleUpload(0));
  globalThis.addEventListener("offline", () => {
    if (readSync().pending && !readSync().conflict) publish({ phase: "offline" });
  });
  // Through the same pacing as an upload after a save: the tick is a retry,
  // not a second budget.
  globalThis.setInterval(() => {
    if (readSync().pending && !readSync().conflict && !isOffline()) scheduleUpload(0);
  }, RETRY_INTERVAL_MS);
  scheduleUpload(1000);
}

/**
 * 초기화 tells the player the online copy is kept, and nothing here knew a
 * reset had happened. The code and the revision on record both survive one, so
 * the first save of the next run was uploaded as the next revision of the same
 * lineage, and the copy the question had just promised to keep was replaced a
 * few seconds into the new game.
 *
 * A run started after a reset is not built on what the server holds, which is
 * what a conflict is. So the reset holds one, from this device's own record
 * and without asking the network: uploads stop, and the panel offers the two
 * ways out it already has -- load the online copy, or say that this device's
 * progress replaces it. With nothing on record as uploaded there is nothing to
 * keep, and nothing is held.
 */
export function holdCloudCopyThroughReset() {
  const sync = readSync();
  if (sync.conflict || (sync.revision === null && !sync.synced)) return false;
  writeSync({ pending: "", conflict: { savedAt: sync.synced, revision: sync.revision } });
  if (isCloudSaveEnabled()) publish({ phase: "conflict", remoteSavedAt: sync.synced, message: "" });
  return true;
}

/** Whether uploads are stopped on a conflict the player has not settled. */
export function hasCloudConflict() {
  return isCloudSaveEnabled() && Boolean(readSync().conflict);
}

/** Reads the copy filed under a code. Returns null when there is none. */
export async function fetchCloudSave(codeInput) {
  const code = normalizeCloudCode(codeInput);
  if (!code) throw cloudError("이어하기 코드는 12자리 영문·숫자입니다.");
  if (!cloudSaveAvailable) throw cloudError("이 배포에는 온라인 저장 서버가 설정되어 있지 않습니다.");
  if (isOffline()) throw cloudError("오프라인이라 불러올 수 없습니다. 연결된 뒤 다시 시도하세요.");
  const { data } = await callSupabaseRpc("get_cloud_save", { p_code: code });
  // Uploads leave out the name and the queue, so a copy is whole without them.
  const remote = data?.payload?.save;
  const filled = remote && typeof remote === "object" && !Array.isArray(remote)
    ? { pendingTelemetry: [], playtestFeedback: {}, ...remote }
    : null;
  const save = parseCurrentSavedState(JSON.stringify(filled), SAVE_SCHEMA_VERSION);
  if (!save || !isSavedStateShapeValid(save)) return null;
  const settledWindows = Array.isArray(data.payload.settledWindows)
    ? data.payload.settledWindows.filter((seed) => typeof seed === "string")
    : [];
  return { code, save, settledWindows, savedAt: String(data.saved_at ?? save.savedAt ?? ""), revision: toRevision(data.revision) };
}

/**
 * Makes a fetched copy this device's save, and this device's code the one it
 * was filed under, so the two devices keep one save between them. The run opens
 * paused on the intro, so 이어하기 is still the player's own click.
 *
 * A copy of the run this device is already playing is a restore like any other
 * (priority 36): it rolls the story back, not the table. Without that, turning
 * uploads off, busting, and loading one's own code was a way back from the wall.
 */
export async function applyCloudSave({ code, save, settledWindows = [], revision = null }) {
  const settled = [...new Set([...readSettledWindowSeeds(), ...settledWindows])].slice(-SETTLED_WINDOWS_LIMIT);
  writeStoredValue(SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(settled));
  // The name, the research consent and its queue never travel; this device
  // keeps its own. Loading a copy is the player's own act, so it ends a replay.
  const local = readLocalSave();
  const { carryTableRecordIntoRestore } = await import("./gauntlet/gauntletEngine.js");
  const restored = carryTableRecordIntoRestore(save, local);
  setReplaySession(false);
  clearReplayFromLocation();
  const written = writeSaveState(
    {
      ...restored,
      playerName: typeof local?.playerName === "string" ? local.playerName : "",
      dataConsent: Boolean(local?.dataConsent),
      pendingTelemetry: Array.isArray(local?.pendingTelemetry) && local?.dataConsent ? local.pendingTelemetry : [],
      started: false,
      paused: true,
    },
    { force: true },
  );
  if (!written.saved) return false;
  writeStoredValue(CLOUD_SAVE_CODE_KEY, code);
  // A season that reached its finale opens NEW GAME+, and the key that says so
  // is written on the device that closed the finale. The runtime also reads
  // the save for it; the intro shown before the runtime loads reads only the
  // key, so a finished season carried here had no NEW GAME+ button there.
  if (restored.caseResults?.final) writeStoredValue(NEW_GAME_PLUS_KEY, "true");
  // What was carried across is this device's and not the server's yet, so the
  // copy is only "in step" when nothing had to be carried.
  const carried = restored !== save;
  writeSync({ pending: carried ? restored.savedAt ?? "" : "", synced: carried ? "" : save.savedAt, revision: toRevision(revision), conflict: null });
  remoteChecked = toRevision(revision) !== null;
  publish({ phase: carried ? "pending" : "synced", syncedAt: carried ? "" : save.savedAt, remoteSavedAt: "", message: "" });
  return true;
}

/**
 * Takes the online copy back. "unsupported" is a database from before
 * `delete_cloud_save`; the copy then ages out on its own.
 */
export async function deleteCloudSave() {
  if (!cloudSaveAvailable) return { deleted: false, unsupported: true };
  const code = normalizeCloudCode(readStoredValue(CLOUD_SAVE_CODE_KEY, ""));
  if (!code) return { deleted: false };
  if (isOffline()) throw cloudError("오프라인이라 온라인 사본을 지울 수 없습니다. 연결된 뒤 다시 시도하세요.");
  try {
    const { data } = await callSupabaseRpc("delete_cloud_save", { p_code: code });
    writeSync({ pending: "", synced: "", revision: null, conflict: null });
    remoteChecked = false;
    return { deleted: data === true };
  } catch (error) {
    if (isMissingRpc(error)) return { deleted: false, unsupported: true };
    throw error;
  }
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
      // True of both ways into a conflict: another device's upload, and a
      // reset on this one (holdCloudCopyThroughReset).
      conflict: "온라인에 이 기기의 지금 진행과 이어지지 않는 저장이 있어 올리기를 멈췄습니다. 다른 기기에서 저장했거나 초기화하기 전의 진행입니다. 아래에서 어느 쪽을 남길지 골라 주세요.",
      error: "온라인 저장에 실패했습니다. 기기 저장은 안전하며 잠시 뒤 다시 시도합니다.",
      disabled: "온라인 저장이 꺼져 있습니다. 이 기기에만 저장합니다.",
      unavailable: "이 배포에는 온라인 저장 서버가 없어 이 기기에만 저장합니다.",
    }[phase] ?? ""
  );
}
