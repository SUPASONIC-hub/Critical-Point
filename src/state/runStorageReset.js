import {
  appendStoredErrorLog,
  ERROR_LOG_STORAGE_KEY,
  NEXT_PARTICIPANT_MESSAGE_KEY,
  removeStoredValue,
  SAVE_BACKUP_STORAGE_KEY,
  SAVE_SLOT_STORAGE_KEY,
  SESSION_ID_STORAGE_KEY,
  SETTLED_WINDOWS_STORAGE_KEY,
  STORAGE_KEY,
} from "../appConfig.js";
import { SEEN_GLOSSES_KEY } from "../components/seenGlosses.js";
import { clearTraceEvents } from "./trace.js";
import { clearReadingTally } from "./readingTally.js";
import { LOCAL_RANKING_STORAGE_KEY } from "./useLocalRanking.js";

/**
 * What 초기화 removes: the run and everything written about it.
 *
 * The save, the kept copy of an unreadable one, the error log, the recovery
 * slots and the local ranking; the seeds of the windows the run settled; the
 * line the player typed for the next analyst; and the random id its telemetry
 * rows were filed under, so the next run starts under a new one; and the glossed
 * words the run has seen explained, so the next one sees them explained. The trace of
 * this tab's last scenes goes too (`clearTraceEvents`, it is in sessionStorage), and so
 * does the reading tally of the open case (`clearReadingTally`, D-11).
 * The last four were left behind while the question asked said "everything".
 *
 * What it keeps, on purpose, and the question now says so (runLifecycle.resetRun):
 * the screen and sound settings, the relic codex, the NEW GAME+ unlock, the
 * season it remembers and the season record (newGamePlusCarry.js: how many
 * seasons this device finished, and how the last one ended), the scenes the
 * seasons before read (seenScenes.js) and the cards the last season picked
 * (pastPicks.js, 「지난 시즌의 당신」), the board nickname and writer id, and the online save's
 * code, its sync record and the copy on the server. The sync record is kept
 * and marked: the reset holds a conflict in it, so the next run is not
 * uploaded over that copy unasked (cloudSave.holdCloudCopyThroughReset).
 *
 * "trigger-prototype" is the save key the prototype wrote before the game had
 * a name; a reset still clears it from browsers that ran that build.
 */
export const RESET_STORAGE_KEYS = [
  "trigger-prototype",
  STORAGE_KEY,
  SAVE_BACKUP_STORAGE_KEY,
  ERROR_LOG_STORAGE_KEY,
  SAVE_SLOT_STORAGE_KEY,
  LOCAL_RANKING_STORAGE_KEY,
  SETTLED_WINDOWS_STORAGE_KEY,
  NEXT_PARTICIPANT_MESSAGE_KEY,
  SESSION_ID_STORAGE_KEY,
  // The words this save has seen explained (B-7): a new run explains them again.
  SEEN_GLOSSES_KEY,
];

/**
 * Removes every key a reset clears and returns the ones the browser refused.
 * The reset and its retry used to carry their own copy of this list.
 */
export function clearRunStorage() {
  clearTraceEvents();
  clearReadingTally();
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
