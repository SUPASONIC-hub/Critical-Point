import {
  appendSaveSlot,
  ERROR_LOG_STORAGE_KEY,
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
  STORAGE_KEY,
  writeStoredValue,
} from "../appConfig.js";
import {
  normalizeSavedGameplayState,
  normalizeSavedNestedState,
  repairSavedRoute,
  shouldCaptureSaveSlot,
} from "./savedState.js";

export function useAppPersistence({
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
  freeText,
  echo,
  nodeEnteredAt,
  pendingTelemetryRef,
  protocolUsed,
  timerPenaltyApplied,
  probeUsed,
  isPausedSave,
  setPlayerName,
  setStarted,
  setIsPausedSave,
  setCurrentCase,
  setCompletedCases,
  setDiscoveredClues,
  setCaseResults,
  setPlaytestFeedback,
  setResources,
  setLog,
  setTriggers,
  setCognition,
  setProtocolUsed,
  setTimerPenaltyApplied,
  setProbeUsed,
  setOpeningLegacy,
  setDecisionReveal,
  setPendingChoice,
  setLastRecoveredError,
  setShowRecoveryCenter,
  setShowErrorLog,
  setFreeText,
  setNodeId,
  setNodeEnteredAt,
  setLastSavedAt,
  setSaveStatus,
  setLocalErrorEntries,
  setSaveSlots,
  normalizePlayerName,
  initialResources,
  triggerLabels,
  cognitionLabels,
  makeEmptyScores,
  normalizeSavedText,
  persistSuppressed,
  onSuppressSaves,
  formatSaveTime,
  debugErrorKey,
}) {
  function persist(nextState) {
    if (persistSuppressed()) return { storageSaved: false };
    const baseState = {
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
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
      freeText,
      echo,
      nodeEnteredAt,
      pendingTelemetry: pendingTelemetryRef.current,
      protocolUsed,
      timerPenaltyApplied,
      probeUsed,
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
    const storageSaved = writeStoredValue(STORAGE_KEY, JSON.stringify(payload));
    if (storageSaved && shouldCaptureSaveSlot(previousState, payload)) appendSaveSlot(payload);
    if (!storageSaved) setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
    return { ...payload, storageSaved };
  }

  function startGame() {
    const name = normalizePlayerName(playerName) || "분석관";
    const emptyTriggers = makeEmptyScores(triggerLabels);
    const emptyCognition = makeEmptyScores(cognitionLabels);
    setPlayerName(name); setStarted(true); setIsPausedSave(false); setCurrentCase("case01");
    setCompletedCases([]); setDiscoveredClues([]); setCaseResults({}); setPlaytestFeedback({});
    setResources(initialResources); setLog([]); setTriggers(emptyTriggers); setCognition(emptyCognition);
    setProtocolUsed(false); setTimerPenaltyApplied(false); setProbeUsed(false); setOpeningLegacy(null);
    setDecisionReveal(null); setPendingChoice(null); setLastRecoveredError(null);
    setShowRecoveryCenter(false); setShowErrorLog(false); removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setFreeText(""); setNodeId("start"); setNodeEnteredAt(Date.now());
    persist({ playerName: name, playStyle, openingLegacy: null, dataConsent, started: true, currentCase: "case01", completedCases: [], discoveredClues: [], caseResults: {}, playtestFeedback: {}, resources: initialResources, log: [], triggers: emptyTriggers, cognition: emptyCognition, nodeId: "start", freeText: "", nodeEnteredAt: Date.now(), protocolUsed: false, timerPenaltyApplied: false, probeUsed: false, paused: false, lastError: null });
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
    if (!removeStoredValue(STORAGE_KEY)) { setSaveStatus("저장본을 초기화하지 못했습니다."); return; }
    writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1"); removeStoredValue(debugErrorKey); window.location.reload();
  }

  function saveCurrentGame({ exit = false } = {}) {
    const nextStarted = exit ? false : started;
    const nextNodeEnteredAt = exit ? nodeEnteredAt : Date.now();
    const payload = persist({ started: nextStarted, paused: exit, nodeEnteredAt: nextNodeEnteredAt });
    if (payload.storageSaved) setLastSavedAt(payload.savedAt);
    setIsPausedSave(exit); setSaveStatus(payload.storageSaved ? `저장됨 ${formatSaveTime(payload.savedAt)}` : "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
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
    if (!removeStoredValue(ERROR_LOG_STORAGE_KEY)) { setSaveStatus("Error log clear failed: browser storage is unavailable."); refreshLocalErrorLog(); return; }
    setLocalErrorEntries([]); setLastRecoveredError(null); persist({ lastError: null });
  }

  function deleteSaveSlot(slotId) {
    const nextSlots = saveSlots.filter((slot) => slot.id !== slotId);
    if (!writeStoredValue(SAVE_SLOT_STORAGE_KEY, JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: nextSlots }))) {
      setSaveStatus("Delete failed: browser storage is unavailable."); return;
    }
    setSaveSlots(nextSlots);
  }

  function restoreSaveSlot(slot) {
    const restored = restoreRecoverySnapshot(slot?.snapshot);
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(restored)));
    if (!repaired || !isSavedStateShapeValid(repaired)) return;
    const nextState = normalizeSavedGameplayState({ ...repaired, paused: true, started: false, savedAt: new Date().toISOString() });
    if (!writeStoredValue(STORAGE_KEY, JSON.stringify(nextState))) { setSaveStatus("Restore failed: browser storage is unavailable."); return; }
    window.location.reload();
  }

  return { persist, startGame, resumeSavedGame, pauseAfterRecovery, startFreshAfterRecovery, saveCurrentGame, refreshLocalErrorLog, refreshSaveSlots, dismissRecoveryNotice, closeRecoveryCenter, clearLocalErrorLog, deleteSaveSlot, restoreSaveSlot };
}
