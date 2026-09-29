import { useEffect, useMemo, useRef } from "react";

import {
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  adoptSaveRevision,
  appendSaveSlot,
  backUpUnreadableSave,
  getInvalidSavedStateKeys,
  hasRecoverySlots,
  isReplaySession,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  setReplaySession,
  writeSaveState,
} from "../appConfig.js";
import {
  collectSilentFailures,
  createReplaySavedState,
  repairSavedState,
  reportSilentFailure,
  reportSilentFailures,
} from "./savedState.js";
import { getReplaySeedFromLocation } from "./trace.js";

// A replay link is read once per page load. While it is open the tab writes
// nothing to the save (appConfig.writeSaveState); starting a run of one's own
// ends it (useAppPersistence.startGame).
const replayState = createReplaySavedState(getReplaySeedFromLocation());
if (replayState) setReplaySession(true);

/**
 * What the runtime starts from, derived without touching storage. The writes
 * the derivation calls for -- a repaired save, a recovery slot for it, the
 * silent-failure reports -- are returned as a plan for the effect to carry out.
 */
function deriveRuntimeSave(initialStartState) {
  const replay = isReplaySession() ? replayState : null;
  const rawSaved = readStoredValue(STORAGE_KEY, "null");
  const hasStoredSave =
    Boolean(replay) ||
    Boolean(initialStartState) ||
    (typeof rawSaved === "string" && rawSaved !== "null" && rawSaved !== "");
  const parsed = replay ?? parseCurrentSavedState(rawSaved, SAVE_SCHEMA_VERSION) ?? initialStartState;
  const { value: result, failures } = collectSilentFailures(() => repairSavedState(parsed));
  const repaired = result.state;
  if (!isSavedStateShapeValid(repaired)) {
    // A first-time visitor simply has no save yet; only a save that exists and
    // fails validation is a real failure worth spending an error-log slot on.
    const invalid = hasStoredSave
      ? { currentCase: repaired?.currentCase, nodeId: repaired?.nodeId, invalidKeys: getInvalidSavedStateKeys(repaired) }
      : null;
    // The player's own save, there and unusable: broken text, a schema newer
    // than this build, or a shape the repair could not mend. It opened as a
    // fresh intro, and the first write from that intro replaced it.
    const unreadable = !replay && !initialStartState && hasStoredSave ? rawSaved : null;
    return { saved: null, failures, invalid, write: false, slot: false, unreadable, recover: Boolean(unreadable) && hasRecoverySlots() };
  }
  const resumed = repaired.started && repaired.paused ? { ...repaired, paused: false } : repaired;
  return {
    saved: resumed,
    failures,
    invalid: null,
    // A replay is never this player's run, so none of it is written back.
    write: !replay && (result.repaired || resumed !== repaired),
    // A slot is for a save that needed repair, not for every reload.
    slot: !replay && result.repaired,
    unreadable: null,
    recover: false,
  };
}

/**
 * `recoverUnreadableSave` asks the runtime to open on the recovery centre: the
 * stored save could not be used and there are slots to go back to.
 */
export function useRuntimeSavedState(initialStartState) {
  const derived = useMemo(() => {
    const next = deriveRuntimeSave(initialStartState);
    // Reading the revision is what lets this tab tell its own writes from
    // another tab's; it is a read, and it has to precede any write.
    adoptSaveRevision();
    return next;
  }, [initialStartState]);
  const appliedRef = useRef(null);

  useEffect(() => {
    if (appliedRef.current === derived) return;
    appliedRef.current = derived;
    reportSilentFailures(derived.failures);
    if (derived.invalid) reportSilentFailure("save-shape", derived.invalid);
    if (derived.unreadable) backUpUnreadableSave(derived.unreadable);
    if (derived.write) writeSaveState(derived.saved, { force: true });
    if (derived.slot) appendSaveSlot(derived.saved);
  }, [derived]);

  return { saved: derived.saved, recoverUnreadableSave: derived.recover };
}
