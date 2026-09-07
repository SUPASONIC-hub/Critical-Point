import { STORAGE_KEY } from "../../src/appConfig.js";

export const TEST_STORAGE_KEYS = Object.freeze({
  save: STORAGE_KEY,
  errorLog: "trigger-prototype-error-log-v1",
  recoveryCenter: "critical-point-recovery-center-v1",
  saveSlots: "trigger-prototype-save-slots-v1",
  localRanking: "critical-point-local-ranking-v1",
  nextParticipantMessage: "critical-point-next-participant-message",
  forceRenderError: "critical-point-force-render-error",
  telemetryUrl: "critical-point-telemetry-url",
  telemetryKey: "critical-point-telemetry-key",
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
