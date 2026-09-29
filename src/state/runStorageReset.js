import {
  appendStoredErrorLog,
  ERROR_LOG_STORAGE_KEY,
  removeStoredValue,
  SAVE_BACKUP_STORAGE_KEY,
  SAVE_SLOT_STORAGE_KEY,
  STORAGE_KEY,
} from "../appConfig.js";
import { LOCAL_RANKING_STORAGE_KEY } from "./useLocalRanking.js";

// "trigger-prototype" is the save key the prototype wrote before the game had
// a name; a reset still clears it from browsers that ran that build.
const RESET_STORAGE_KEYS = ["trigger-prototype", STORAGE_KEY, SAVE_BACKUP_STORAGE_KEY, ERROR_LOG_STORAGE_KEY, SAVE_SLOT_STORAGE_KEY, LOCAL_RANKING_STORAGE_KEY];

/**
 * Removes every key a reset clears and returns the ones the browser refused.
 * The reset and its retry used to carry their own copy of this list.
 */
export function clearRunStorage() {
  return RESET_STORAGE_KEYS.filter((key) => !removeStoredValue(key));
}

/** Records a reset that left keys behind; returns whether the diagnostic itself was written. */
export function logStorageResetFailure({ source, failedStorageKeys, currentCase, nodeId }) {
  const retry = source === "reset-retry";
  return appendStoredErrorLog({
    id: `${retry ? "reset-retry-failed" : "reset-failed"}-${Date.now()}`,
    occurredAt: new Date().toISOString(),
    error: {
      name: retry ? "StorageResetRetryError" : "StorageResetError",
      message: `Some browser storage keys could not be removed during reset${retry ? " retry" : ""}.`,
      stack: "",
    },
    context: { source, currentCase, nodeId, failedStorageKeys },
  });
}
