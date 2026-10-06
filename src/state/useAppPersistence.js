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
  SAVE_STATE_KEYS,
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
import { takeQueuedErrorTelemetry } from "./errorRecovery.js";
import { createOpeningResources } from "./openingState.js";
import { carryTableRecordIntoRestore, isSaveAheadOf } from "../gauntlet/gauntletEngine.js";
import { SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "../gameCases.js";
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
function leaveReplaySession() {
  if (!isReplaySession()) return;
  setReplaySession(false);
  clearReplayFromLocation();
}

export function useAppPersistence({ state, refs, setters, config }) {
  const {
    runId, playerName, playStyle, openingLegacy, dataConsent, started, currentCase,
    completedCases, discoveredClues, caseResults, playtestFeedback, nodeId, resources,
    log, triggers, cognition, echo, nodeEnteredAt,
    dynamics, isPausedSave, saveSlots,
  } = state;
  const { pendingTelemetryRef } = refs;
  const {
    setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase,
    setCompletedCases, setDiscoveredClues, setCaseResults, setPlaytestFeedback,
    setResources, setLog, setTriggers, setCognition, setEcho,
    setOpeningLegacy, setDecisionReveal,
    setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog,
    setNodeId, setNodeEnteredAt, setLastSavedAt, setSaveStatus,
    setLocalErrorEntries, setSaveSlots, setPendingTelemetry,
  } = setters;
  const {
    normalizePlayerName, triggerLabels, cognitionLabels,
    makeEmptyScores, persistSuppressed, onSuppressSaves, onResumeSaves, formatSaveTime,
    debugErrorKey, createRunId, initialDynamics, resetDecisionDynamics, onStaleSave, operatorOrigin, openingEcho,
  } = config;

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

  function persist(nextState, { force = false } = {}) {
    if (persistSuppressed()) return { storageSaved: false };
    const baseState = {
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      runId,
      playerName,
      playStyle,
      openingLegacy,
      dataConsent,
      started,
      currentCase,
      completedCases,
      discoveredClues,
      caseResults,
      playtestFeedback,
      nodeId,
      resources,
      log,
      triggers,
      cognition,
      echo,
      nodeEnteredAt,
      pendingTelemetry: foldQueuedErrorTelemetry(),
      dynamics: dynamics ?? null,
      paused: isPausedSave,
      savedAt: new Date().toISOString(),
    };
    const missingKeys = SAVE_STATE_KEYS.filter((key) => !Object.hasOwn(baseState, key));
    if (missingKeys.length > 0 && import.meta.env.DEV) {
      throw new Error(`Save payload missing keys: ${missingKeys.join(", ")}`);
    }
    const payload = {
      ...SAVE_STATE_KEYS.reduce((state, key) => {
        state[key] = baseState[key];
        return state;
      }, {}),
      ...nextState,
    };
    const previousState = { started, currentCase, nodeId, completedCases };
    const result = writeSaveState(payload, { force, isAhead: isAheadOfThisTab });
    if (result.stale) {
      onStaleSave?.();
      setSaveStatus(SAVE_STALE_MESSAGE);
      return { ...payload, storageSaved: false, stale: true };
    }
    if (result.replay) {
      setSaveStatus(SAVE_REPLAY_MESSAGE);
      return { ...payload, storageSaved: false, replay: true };
    }
    if (result.saved && shouldCaptureSaveSlot(previousState, payload)) appendSaveSlot(payload);
    if (!result.saved) setSaveStatus(SAVE_UNAVAILABLE_MESSAGE);
    return { ...payload, storageSaved: result.saved };
  }

  function startGame() {
    // A run of one's own ends a replay; from here the tab writes its save again.
    leaveReplaySession();
    const name = normalizePlayerName(playerName) || "분석관";
    const nextRunId = createRunId();
    const emptyTriggers = makeEmptyScores(triggerLabels);
    const emptyCognition = makeEmptyScores(cognitionLabels);
    const openingResources = createOpeningResources(operatorOrigin);
    setRunId(nextRunId);
    setPlayerName(name); setStarted(true); setIsPausedSave(false); setCurrentCase(SEASON_ENTRY_CASE);
    setCompletedCases([]); setDiscoveredClues([]); setCaseResults({}); setPlaytestFeedback({});
    setResources(openingResources); setLog([]); setTriggers(emptyTriggers); setCognition(emptyCognition);
    setOpeningLegacy(null);
    // The line under the first scene is the season's opening one. It was left
    // as the last run's last reply: this list reset everything but the echo,
    // and the save was written with the old one in it.
    setEcho?.(openingEcho ?? "");
    resetDecisionDynamics?.();
    setDecisionReveal(null); setLastRecoveredError(null);
    setShowRecoveryCenter(false); setShowErrorLog(false); removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setNodeId(SEASON_ENTRY_NODE); setNodeEnteredAt(Date.now());
    persist({ runId: nextRunId, playerName: name, playStyle, openingLegacy: null, dataConsent, started: true, currentCase: SEASON_ENTRY_CASE, completedCases: [], discoveredClues: [], caseResults: {}, playtestFeedback: {}, resources: openingResources, log: [], triggers: emptyTriggers, cognition: emptyCognition, echo: "", nodeId: SEASON_ENTRY_NODE, nodeEnteredAt: Date.now(), dynamics: initialDynamics ?? null, paused: false, lastError: null }, { force: true });
  }

  function resumeSavedGame() {
    setStarted(true); setIsPausedSave(false); setNodeEnteredAt(Date.now()); setSaveStatus(""); setDecisionReveal(null);
    persist({ started: true, paused: false, nodeEnteredAt: Date.now() });
  }

  function pauseAfterRecovery() {
    setStarted(false); setIsPausedSave(true); setSaveStatus("현재 지점을 일시정지했습니다."); persist({ started: false, paused: true });
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

  function saveCurrentGame({ exit = false, dynamics: suspendedDynamics = null } = {}) {
    const nextNodeEnteredAt = exit ? nodeEnteredAt : Date.now();
    const payload = persist({ started: exit ? false : started, paused: exit, nodeEnteredAt: nextNodeEnteredAt, ...(suspendedDynamics ? { dynamics: suspendedDynamics } : {}) });
    // Another tab is ahead: nothing was written, so leaving would drop this
    // tab onto an intro that offers a run the save no longer holds. The table
    // is already locked (onStaleSave) and persist has said why.
    if (payload.stale) return;
    if (payload.storageSaved) setLastSavedAt(payload.savedAt);
    const savedLine = suspendedDynamics ? `판을 그대로 보관했습니다 ${formatSaveTime(payload.savedAt)}` : `저장됨 ${formatSaveTime(payload.savedAt)}`;
    setIsPausedSave(exit);
    setSaveStatus(payload.storageSaved ? savedLine : payload.replay ? SAVE_REPLAY_MESSAGE : SAVE_UNAVAILABLE_MESSAGE);
    if (exit) setStarted(false); else setNodeEnteredAt(nextNodeEnteredAt);
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

  function dismissRecoveryNotice() { setLastRecoveredError(null); persist({ lastError: null }); }
  function closeRecoveryCenter() { setShowErrorLog(false); setShowRecoveryCenter(false); removeStoredValue(RECOVERY_CENTER_STORAGE_KEY); }

  function clearLocalErrorLog() {
    if (!confirmAction(CONFIRM_CLEAR_ERROR_LOG)) return;
    if (!removeStoredValue(ERROR_LOG_STORAGE_KEY)) {
      recordAppError(new Error("Error log clear failed because local storage could not be written."), {}, "error-log-clear");
      setSaveStatus("오류 기록을 지우지 못했습니다. 브라우저 저장소를 사용할 수 없습니다.");
      refreshLocalErrorLog();
      return;
    }
    setLocalErrorEntries([]); setLastRecoveredError(null); persist({ lastError: null });
  }

  function deleteSaveSlot(slotId) {
    if (!confirmAction(CONFIRM_DELETE_SLOT)) return;
    const nextSlots = saveSlots.filter((slot) => slot.id !== slotId);
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
    return normalizeSavedGameplayState({
      ...repaired,
      playtestFeedback: isSavedStateShapeValid(current) ? current.playtestFeedback : repaired.playtestFeedback,
      pendingTelemetry: isSavedStateShapeValid(current) ? current.pendingTelemetry : repaired.pendingTelemetry,
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

  return { persist, startGame, resumeSavedGame, pauseAfterRecovery, startFreshAfterRecovery, saveCurrentGame, refreshLocalErrorLog, refreshSaveSlots, dismissRecoveryNotice, closeRecoveryCenter, clearLocalErrorLog, deleteSaveSlot, restoreSaveSlot, restoreSaveBackup };
}
