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
import { carryTableRecordIntoRestore, isSaveAheadOf } from "../gauntlet/gauntletEngine.js";
import { SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "../gameCases.js";

const isAheadOfThisTab = (stored, payload) => isSaveAheadOf(stored, payload, getTabToken());

// What a refused write says. Each names why nothing was written: the old code
// printed the storage-unavailable line for all three, which sent a player whose
// other tab was simply ahead looking for a browser permission problem.
const SAVE_UNAVAILABLE_MESSAGE = "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.";
const SAVE_STALE_MESSAGE = "다른 탭에서 이 진행이 더 앞서 있어 이 탭의 진행은 기록하지 않았습니다. 새로고침하면 최신 진행을 불러옵니다.";
const SAVE_REPLAY_MESSAGE = "재현 링크로 연 장면이라 진행을 기록하지 않습니다. 내 저장은 그대로 남아 있습니다.";

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
    log, triggers, cognition, echo, nodeEnteredAt, protocolUsed,
    timerPenaltyCount, probeUsed, investigatedTargets, hypothesisDecisions,
    dynamics, isPausedSave, saveSlots,
  } = state;
  const { pendingTelemetryRef } = refs;
  const {
    setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase,
    setCompletedCases, setDiscoveredClues, setCaseResults, setPlaytestFeedback,
    setResources, setLog, setTriggers, setCognition, setProtocolUsed,
    setTimerPenaltyCount, setProbeUsed, setInvestigatedTargets,
    setHypothesisDecisions, setOpeningLegacy, setDecisionReveal,
    setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog,
    setNodeId, setNodeEnteredAt, setLastSavedAt, setSaveStatus,
    setLocalErrorEntries, setSaveSlots,
  } = setters;
  const {
    normalizePlayerName, initialResources, triggerLabels, cognitionLabels,
    makeEmptyScores, persistSuppressed, onSuppressSaves, formatSaveTime,
    debugErrorKey, createRunId, initialDynamics, resetDecisionDynamics, onStaleSave,
  } = config;
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
      pendingTelemetry: pendingTelemetryRef.current,
      protocolUsed,
      timerPenaltyCount,
      probeUsed,
      investigatedTargets,
      hypothesisDecisions,
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
    setRunId(nextRunId);
    setPlayerName(name); setStarted(true); setIsPausedSave(false); setCurrentCase(SEASON_ENTRY_CASE);
    setCompletedCases([]); setDiscoveredClues([]); setCaseResults({}); setPlaytestFeedback({});
    setResources(initialResources); setLog([]); setTriggers(emptyTriggers); setCognition(emptyCognition);
    setProtocolUsed(false); setTimerPenaltyCount(0); setProbeUsed(false);
    setInvestigatedTargets({}); setHypothesisDecisions({}); setOpeningLegacy(null);
    resetDecisionDynamics?.();
    setDecisionReveal(null); setLastRecoveredError(null);
    setShowRecoveryCenter(false); setShowErrorLog(false); removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setNodeId(SEASON_ENTRY_NODE); setNodeEnteredAt(Date.now());
    persist({ runId: nextRunId, playerName: name, playStyle, openingLegacy: null, dataConsent, started: true, currentCase: SEASON_ENTRY_CASE, completedCases: [], discoveredClues: [], caseResults: {}, playtestFeedback: {}, resources: initialResources, log: [], triggers: emptyTriggers, cognition: emptyCognition, nodeId: SEASON_ENTRY_NODE, nodeEnteredAt: Date.now(), protocolUsed: false, timerPenaltyCount: 0, probeUsed: false, investigatedTargets: {}, hypothesisDecisions: {}, dynamics: initialDynamics ?? null, paused: false, lastError: null }, { force: true });
  }

  function resumeSavedGame() {
    setStarted(true); setIsPausedSave(false); setNodeEnteredAt(Date.now()); setSaveStatus(""); setDecisionReveal(null);
    persist({ started: true, paused: false, nodeEnteredAt: Date.now() });
  }

  function pauseAfterRecovery() {
    setStarted(false); setIsPausedSave(true); setSaveStatus("현재 지점을 일시정지했습니다."); persist({ started: false, paused: true });
  }

  function startFreshAfterRecovery() {
    onSuppressSaves();
    leaveReplaySession();
    if (!removeStoredValue(STORAGE_KEY)) { setSaveStatus("저장본을 초기화하지 못했습니다."); return; }
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
    if (!removeStoredValue(ERROR_LOG_STORAGE_KEY)) {
      recordAppError(new Error("Error log clear failed because local storage could not be written."), {}, "error-log-clear");
      setSaveStatus("Error log clear failed: browser storage is unavailable.");
      refreshLocalErrorLog();
      return;
    }
    setLocalErrorEntries([]); setLastRecoveredError(null); persist({ lastError: null });
  }

  function deleteSaveSlot(slotId) {
    const nextSlots = saveSlots.filter((slot) => slot.id !== slotId);
    if (!writeStoredValue(SAVE_SLOT_STORAGE_KEY, JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: nextSlots }))) {
      recordAppError(new Error("Save slot delete failed because local storage could not be written."), {}, "save-slot-delete");
      setSaveStatus("Delete failed: browser storage is unavailable."); return;
    }
    setSaveSlots(nextSlots);
  }

  function restoreSaveSlot(slot) {
    const current = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
    const restored = carryTableRecordIntoRestore(restoreRecoverySnapshot(slot?.snapshot), current);
    const { state: repaired } = repairSavedState(restored);
    if (!repaired || !isSavedStateShapeValid(repaired)) {
      setSaveStatus("이 복구 슬롯은 손상되어 불러올 수 없습니다. 다른 슬롯을 고르세요.");
      return;
    }
    // A slot rolls back the story, not the network's backlog or the feedback
    // the player already wrote: both are kept from the current save.
    const nextState = normalizeSavedGameplayState({
      ...repaired,
      playtestFeedback: isSavedStateShapeValid(current) ? current.playtestFeedback : repaired.playtestFeedback,
      pendingTelemetry: isSavedStateShapeValid(current) ? current.pendingTelemetry : repaired.pendingTelemetry,
      paused: true,
      started: false,
      savedAt: new Date().toISOString(),
    });
    leaveReplaySession();
    if (!writeSaveState(nextState, { force: true }).saved) {
      recordAppError(new Error("Save slot restore failed because local storage could not be written."), {}, "save-slot-restore");
      setSaveStatus("Restore failed: browser storage is unavailable.");
      return;
    }
    window.location.reload();
  }

  return { persist, startGame, resumeSavedGame, pauseAfterRecovery, startFreshAfterRecovery, saveCurrentGame, refreshLocalErrorLog, refreshSaveSlots, dismissRecoveryNotice, closeRecoveryCenter, clearLocalErrorLog, deleteSaveSlot, restoreSaveSlot };
}
