import { useMemo } from "react";

import {
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  appendSaveSlot,
  getInvalidSavedStateKeys,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  writeStoredValue,
} from "../appConfig.js";
import {
  createReplaySavedState,
  normalizeSavedGameplayState,
  normalizeSavedNestedState,
  repairSavedRoute,
  reportSilentFailure,
} from "./savedState.js";
import { getReplaySeedFromLocation } from "./trace.js";

const replaySeed = getReplaySeedFromLocation();

export function useRuntimeSavedState(initialStartState) {
  return useMemo(() => {
    const replay = createReplaySavedState(replaySeed);
    const rawSaved = readStoredValue(STORAGE_KEY, "null");
    const hasStoredSave =
      Boolean(replay) ||
      Boolean(initialStartState) ||
      (typeof rawSaved === "string" && rawSaved !== "null" && rawSaved !== "");
    const parsed = replay ?? parseCurrentSavedState(rawSaved, SAVE_SCHEMA_VERSION) ?? initialStartState;
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(parsed)));
    if (!isSavedStateShapeValid(repaired)) {
      // A first-time visitor simply has no save yet; only a save that exists and
      // fails validation is a real failure worth spending an error-log slot on.
      if (hasStoredSave) {
        reportSilentFailure("save-shape", {
          currentCase: repaired?.currentCase,
          nodeId: repaired?.nodeId,
          invalidKeys: getInvalidSavedStateKeys(repaired),
        });
      }
      return null;
    }
    const resumed = repaired.started && repaired.paused ? { ...repaired, paused: false } : repaired;
    if (resumed !== parsed) {
      writeStoredValue(STORAGE_KEY, JSON.stringify(resumed));
      appendSaveSlot(resumed);
    }
    return resumed;
  }, [initialStartState]);
}
