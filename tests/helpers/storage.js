import { CLOUD_SAVE_ENABLED_KEY, RECOVERY_CENTER_STORAGE_KEY, STORAGE_KEY } from "../../src/appConfig.js";

// Every value here has to be a key the app itself reads or writes;
// `npm run check:test-storage` fails on one it does not (recoveryCenter named a
// key nothing used until that check could see it).
export const TEST_STORAGE_KEYS = Object.freeze({
  save: STORAGE_KEY,
  errorLog: "trigger-prototype-error-log-v1",
  recoveryCenter: RECOVERY_CENTER_STORAGE_KEY,
  saveSlots: "trigger-prototype-save-slots-v1",
  localRanking: "critical-point-local-ranking-v7",
  relicCodex: "critical-point-relic-codex-v1",
  nextParticipantMessage: "critical-point-next-participant-message",
  forceRenderError: "critical-point-force-render-error",
  telemetryUrl: "critical-point-telemetry-url",
  telemetryKey: "critical-point-telemetry-key",
  musicEnabled: "critical-point-music-enabled",
  musicVolume: "critical-point-music-volume",
  cloudEnabled: CLOUD_SAVE_ENABLED_KEY,
  cloudCode: "critical-point-cloud-code-v1",
  cloudSync: "critical-point-cloud-sync-v1",
  settledWindows: "critical-point-settled-windows-v1",
});

export async function clearGameStorage(page) {
  await page.evaluate(() => localStorage.clear());
}

export async function readStorage(page, key) {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key);
}

export async function readJsonStorage(page, key, fallback = null) {
  const raw = await readStorage(page, key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export async function writeJsonStorage(page, key, value) {
  await page.evaluate(({ storageKey, storageValue }) => {
    localStorage.setItem(storageKey, JSON.stringify(storageValue));
  }, { storageKey: key, storageValue: value });
}

export async function removeStorage(page, key) {
  await page.evaluate((storageKey) => localStorage.removeItem(storageKey), key);
}
