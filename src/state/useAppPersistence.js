import {
  appendSaveSlot,
  ERROR_LOG_STORAGE_KEY,
  getTabToken,
  isReplaySession,
  parseCurrentSavedState,
  isSavedStateShapeValid,
  RECOVERY_CENTER_STORAGE_KEY,
  RECOVERY_SLOT_SCHEMA_VERSION,
  parseErrorLog,
  parseRecoverySlots,
  readStoredValue,
  removeStoredValue,
  restoreRecoverySnapshot,
  SAVE_BACKUP_STORAGE_KEY,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
  setReplaySession,
  STORAGE_KEY,
  writeSaveState,
  writeStoredValue,
} from "../appConfig.js";
import {
  normalizeSavedGameplayState,
  recordAppError,
  repairSavedState,
  shouldCaptureSaveSlot,
} from "./savedState.js";
import { clearReplayFromLocation } from "./trace.js";
import { confirmAction } from "./confirmAction.js";
import { hasSlotAtRecoveryPoint, takeQueuedErrorTelemetry } from "./errorRecovery.js";
import { toSavePatch, toSavePayload } from "./runState.js";
import { carryTableRecordIntoRestore, isSaveAheadOf } from "../gauntlet/gauntletEngine.js";
import { withEveryCase } from "./caseArrival.js";

const isAheadOfThisTab = (stored, payload) => isSaveAheadOf(stored, payload, getTabToken());

// Asked before a control throws progress away, the way 초기화 asks.
const CONFIRM_START_FRESH = "저장된 진행을 지우고 새 게임으로 시작할까요? 복구 슬롯과 오류 기록은 남습니다.";
const CONFIRM_RESTORE_SLOT = "이 복구 지점으로 되돌릴까요? 그 뒤의 이야기 진행은 사라집니다.";
const CONFIRM_DELETE_SLOT = "이 복구 지점을 지울까요? 지운 뒤에는 되돌릴 수 없습니다.";
const CONFIRM_CLEAR_ERROR_LOG = "오류 기록을 모두 지울까요?";
const CONFIRM_RESTORE_BACKUP = "읽지 못했던 저장본을 다시 읽어 지금 진행 대신 불러올까요?";

// What a refused write says. Each names why nothing was written: the old code
// printed the storage-unavailable line for all three, which sent a player whose
// other tab was simply ahead looking for a browser permission problem.
const SAVE_UNAVAILABLE_MESSAGE = "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.";
const SAVE_STALE_MESSAGE = "다른 탭에서 이 진행이 더 앞서 있어 이 탭의 진행은 기록하지 않았습니다. 새로고침하면 최신 진행을 불러옵니다.";
const SAVE_REPLAY_MESSAGE = "재현 링크로 연 장면이라 진행을 기록하지 않습니다. 내 저장은 그대로 남아 있습니다.";
const RESTORE_NEEDS_CASES_MESSAGE = "사건 자료를 다 받지 못해 되돌리지 않았습니다. 연결을 확인하고 다시 눌러 주세요. 저장은 그대로 있습니다.";

/** Ends a replay: the tab writes its saves again and a reload opens the player's own. */
export function leaveReplaySession() {
  if (!isReplaySession()) return;
  setReplaySession(false);
  clearReplayFromLocation();
}

export function useAppPersistence({ run, patchRun, refs, setters, config }) {
  const { pendingTelemetryRef } = refs;
  const { setSaveStatus, setLocalErrorEntries, setSaveSlots, setPendingTelemetry } = setters;
  const { persistSuppressed, onSuppressSaves, onResumeSaves, formatSaveTime, debugErrorKey } = config;

  /** The queue as the next save should hold it: this tab's, plus rows the error path queued in storage. */
  function foldQueuedErrorTelemetry() {
    const queued = takeQueuedErrorTelemetry();
    const known = new Set(pendingTelemetryRef.current.map((item) => item.id));
    const added = queued.filter((item) => !known.has(item.id));
    if (added.length === 0) return pendingTelemetryRef.current;
    pendingTelemetryRef.current = [...pendingTelemetryRef.current, ...added];
    setPendingTelemetry?.(pendingTelemetryRef.current);
    return pendingTelemetryRef.current;
  }

  /**
   * Writes the run as this render holds it, with `nextState` over it. The
   * keys of `nextState` are the save's; a change to the run itself goes
   * through `applyRun`, which derives them.
   */
  function persist(nextState, { force = false } = {}) {
    if (persistSuppressed()) return { storageSaved: false };
    const payload = {
      ...toSavePayload(run, { pendingTelemetry: foldQueuedErrorTelemetry(), savedAt: new Date().toISOString() }),
      ...nextState,
    };
    const previousState = { started: run.started, currentCase: run.currentCase, nodeId: run.nodeId, completedCases: run.completedCases };
    const result = writeSaveState(payload, { force, isAhead: isAheadOfThisTab });
    if (result.stale) {
      // The tab stops: no table and no writes until it reloads (runState.staleSave).
      patchRun({ staleSave: true });
      setSaveStatus(SAVE_STALE_MESSAGE);
      return { ...payload, storageSaved: false, stale: true };
    }
    if (result.replay) {
      setSaveStatus(SAVE_REPLAY_MESSAGE);
      return { ...payload, storageSaved: false, replay: true };
    }
    // One slot for one place. 이어하기 pressed inside the runtime is "a run
    // picked up again" each time, so leaving a scene and coming back five times
    // filled all five slots with that scene and pushed out every case boundary.
    if (result.saved && shouldCaptureSaveSlot(previousState, payload) && !hasSlotAtRecoveryPoint(payload)) appendSaveSlot(payload);
    if (!result.saved) setSaveStatus(SAVE_UNAVAILABLE_MESSAGE);
    // Every write that landed is the last save, not only 저장 pressed by hand:
    // the intro prints this time beside 이어하기, and after a choice saved
    // itself it showed the time the page was loaded, or nothing after a reset.
    else patchRun({ lastSavedAt: payload.savedAt });
    return { ...payload, storageSaved: result.saved };
  }

  /**
   * A change to the run, made in memory and written to the save in one step.
   * `patch` is in the run's own fields; what the save holds for them is read
   * off the same patch (runState.toSavePatch), so the two cannot disagree.
   *
   * `saveOnly` is for the one thing the save is told and the run is not: that
   * the page is going away (GameRuntime's suspension). Its keys are the save's.
   */
  function applyRun(patch, { force = false, saveOnly = {} } = {}) {
    patchRun(patch);
    return persist({ ...toSavePatch(patch), ...saveOnly }, { force });
  }

  function startFreshAfterRecovery() {
    if (!confirmAction(CONFIRM_START_FRESH)) return;
    onSuppressSaves();
    leaveReplaySession();
    // Nothing was removed and nothing reloads, so the run on screen goes on and
    // has to be saved again: the suppression used to outlive the failure.
    if (!removeStoredValue(STORAGE_KEY)) { onResumeSaves?.(); setSaveStatus("저장본을 초기화하지 못했습니다."); return; }
    writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1"); removeStoredValue(debugErrorKey); window.location.reload();
  }

  /**
   * `heldRun` is a window put down on the way out (useWindowSuspension): it
   * goes into the save with the exit, and into the run whatever the save says.
   */
  function saveCurrentGame({ exit = false, heldRun = null } = {}) {
    if (heldRun) patchRun({ gauntletRun: heldRun });
    const patch = {
      started: exit ? false : run.started,
      isPausedSave: exit,
      nodeEnteredAt: exit ? run.nodeEnteredAt : Date.now(),
      ...(heldRun ? { gauntletRun: heldRun } : {}),
    };
    const payload = persist(toSavePatch(patch));
    // Another tab is ahead: nothing was written, so leaving would drop this
    // tab onto an intro that offers a run the save no longer holds. The table
    // is already locked (the stale lock in `persist`) and persist has said why.
    if (payload.stale) return;
    const savedLine = heldRun ? `판을 그대로 보관했습니다 ${formatSaveTime(payload.savedAt)}` : `저장됨 ${formatSaveTime(payload.savedAt)}`;
    patchRun(patch);
    setSaveStatus(payload.storageSaved ? savedLine : payload.replay ? SAVE_REPLAY_MESSAGE : SAVE_UNAVAILABLE_MESSAGE);
  }

  function refreshSaveSlots() {
    const parsed = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    setSaveSlots(Array.isArray(parsed?.slots) ? parsed.slots : []);
  }

  function refreshLocalErrorLog() {
    const raw = readStoredValue(ERROR_LOG_STORAGE_KEY, "null");
    const parsed = parseErrorLog(raw);
    if (parsed && raw !== JSON.stringify(parsed)) writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(parsed));
    setLocalErrorEntries(Array.isArray(parsed?.entries) ? parsed.entries : []); refreshSaveSlots();
  }

  function dismissRecoveryNotice() { applyRun({ lastRecoveredError: null }); }
  function closeRecoveryCenter() { patchRun({ showErrorLog: false, showRecoveryCenter: false }); removeStoredValue(RECOVERY_CENTER_STORAGE_KEY); }

  function clearLocalErrorLog() {
    if (!confirmAction(CONFIRM_CLEAR_ERROR_LOG)) return;
    if (!removeStoredValue(ERROR_LOG_STORAGE_KEY)) {
      recordAppError(new Error("Error log clear failed because local storage could not be written."), {}, "error-log-clear");
      setSaveStatus("오류 기록을 지우지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.");
      refreshLocalErrorLog();
      return;
    }
    setLocalErrorEntries([]); applyRun({ lastRecoveredError: null });
  }

  // From the slots in storage, not the list on screen. The list is read when
  // the page loads and when the panel is refreshed, and saves add slots in
  // between: writing the list back less one slot deleted those too, unasked.
  function deleteSaveSlot(slotId) {
    if (!confirmAction(CONFIRM_DELETE_SLOT)) return;
    const storedSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"))?.slots ?? [];
    const nextSlots = storedSlots.filter((slot) => slot.id !== slotId);
    if (!writeStoredValue(SAVE_SLOT_STORAGE_KEY, JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: nextSlots }))) {
      recordAppError(new Error("Save slot delete failed because local storage could not be written."), {}, "save-slot-delete");
      setSaveStatus("복구 지점을 지우지 못했습니다. 브라우저 저장소를 사용할 수 없습니다."); return;
    }
    setSaveSlots(nextSlots);
  }

  /**
   * Writes a save over the current one and reloads into it. Saves are
   * suppressed first: the reload fires `pagehide`, whose handler saves the run
   * this tab still holds in memory, and that run is the one being replaced. A
   * slot restored in the middle of play used to be written, overwritten by that
   * save, and reloaded into the scene the player was trying to leave.
   */
  function replaceSaveAndReload(nextState, { source, what, failure }) {
    onSuppressSaves();
    leaveReplaySession();
    if (!writeSaveState(nextState, { force: true }).saved) {
      onResumeSaves?.();
      recordAppError(new Error(`${what} failed because local storage could not be written.`), {}, source);
      setSaveStatus(failure);
      return false;
    }
    window.location.reload();
    return true;
  }

  /** A slot, or any save text, made into the paused save a reload will open. */
  function createRestoredSave(restored, current) {
    const { state: repaired } = repairSavedState(restored);
    if (!repaired || !isSavedStateShapeValid(repaired)) return null;
    // A restore rolls back the story, not the network's backlog or the feedback
    // the player already wrote: both are kept from the current save.
    //
    // Nor the consent. A slot is the save as it stood, consent box included,
    // so restoring one from before the player unticked the box ticked it again
    // for them, and the next closed case was sent. Consent is what the save
    // holds now, as it is when a cloud copy is loaded (cloudSave.applyCloudSave);
    // with no save to ask it is off, and so is the queue it would have sent.
    const held = isSavedStateShapeValid(current);
    const dataConsent = held && current.dataConsent === true;
    return normalizeSavedGameplayState({
      ...repaired,
      dataConsent,
      playtestFeedback: held ? current.playtestFeedback : repaired.playtestFeedback,
      pendingTelemetry: dataConsent ? current.pendingTelemetry : [],
      paused: true,
      started: false,
      savedAt: new Date().toISOString(),
    });
  }

  /**
   * A restore's save, built once every case is here (caseArrival.withEveryCase):
   * the repair inside it reads the scenes the restored log names. `undefined`
   * when the season could not be fetched, which the player is told.
   */
  async function buildRestoredSave(build) {
    try {
      return await withEveryCase(() => {
        const current = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
        return build(current);
      });
    } catch (error) {
      console.warn(error);
      setSaveStatus(RESTORE_NEEDS_CASES_MESSAGE);
      return undefined;
    }
  }

  async function restoreSaveSlot(slot) {
    const nextState = await buildRestoredSave((current) =>
      createRestoredSave(carryTableRecordIntoRestore(restoreRecoverySnapshot(slot?.snapshot), current), current),
    );
    if (nextState === undefined) return;
    if (!nextState) {
      setSaveStatus("이 복구 슬롯은 손상되어 불러올 수 없습니다. 다른 슬롯을 고르세요.");
      return;
    }
    if (!confirmAction(CONFIRM_RESTORE_SLOT)) return;
    replaceSaveAndReload(nextState, {
      source: "save-slot-restore",
      what: "Save slot restore",
      failure: "복구 지점을 불러오지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    });
  }

  /**
   * The save this build could not read when it was found (`backUpUnreadableSave`),
   * read again. A newer build may read what an older one could not, which is the
   * rolled-back deploy the copy is kept for.
   */
  async function restoreSaveBackup() {
    const backup = parseCurrentSavedState(readStoredValue(SAVE_BACKUP_STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
    const nextState = backup ? await buildRestoredSave((current) => createRestoredSave(backup, current)) : null;
    if (nextState === undefined) return;
    if (!nextState) {
      setSaveStatus("보관한 저장본은 이 버전에서도 읽을 수 없습니다. 지우지 않고 그대로 둡니다.");
      return;
    }
    if (!confirmAction(CONFIRM_RESTORE_BACKUP)) return;
    const restored = replaceSaveAndReload(nextState, {
      source: "save-backup-restore",
      what: "Save backup restore",
      failure: "보관한 저장본을 불러오지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.",
    });
    // It is the save now; the kept copy has done what it was kept for.
    if (restored) removeStoredValue(SAVE_BACKUP_STORAGE_KEY);
  }

  return { persist, applyRun, startFreshAfterRecovery, saveCurrentGame, refreshLocalErrorLog, refreshSaveSlots, dismissRecoveryNotice, closeRecoveryCenter, clearLocalErrorLog, deleteSaveSlot, restoreSaveSlot, restoreSaveBackup };
}
