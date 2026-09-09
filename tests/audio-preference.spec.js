import { expect, test } from "@playwright/test";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

const ACCENT_PEAK_GAIN = 0.045;
const LOW_PRESET_MULTIPLIER = 0.58;
const TARGET_LOCK_GAIN_RATIO = 0.72;

/* The probe counts the objects that can make sound instead of listening for it:
   headless Chromium has no audio device, but node creation is still observable. */
async function installAudioProbe(page) {
  await page.addInitScript(() => {
    const probe = { contexts: 0, oscillators: 0, risingSweeps: 0, gainTargets: [] };
    window.__audioProbe = probe;
    try {
      const NativeContext = window.AudioContext || window.webkitAudioContext;
      if (!NativeContext) return;

      const nativeCreateOscillator = NativeContext.prototype.createOscillator;
      NativeContext.prototype.createOscillator = function createOscillator(...args) {
        const node = nativeCreateOscillator.apply(this, args);
        probe.oscillators += 1;
        const frequency = node.frequency;
        const setValueAtTime = frequency.setValueAtTime.bind(frequency);
        const rampToValue = frequency.exponentialRampToValueAtTime.bind(frequency);
        let lastValue = null;
        frequency.setValueAtTime = (value, time) => {
          lastValue = value;
          return setValueAtTime(value, time);
        };
        frequency.exponentialRampToValueAtTime = (value, time) => {
          if (lastValue !== null && value > lastValue) probe.risingSweeps += 1;
          lastValue = value;
          return rampToValue(value, time);
        };
        return node;
      };

      const nativeCreateGain = NativeContext.prototype.createGain;
      NativeContext.prototype.createGain = function createGain(...args) {
        const node = nativeCreateGain.apply(this, args);
        const rampToValue = node.gain.exponentialRampToValueAtTime.bind(node.gain);
        node.gain.exponentialRampToValueAtTime = (value, time) => {
          probe.gainTargets.push(value);
          return rampToValue(value, time);
        };
        return node;
      };

      function CountingAudioContext(...args) {
        probe.contexts += 1;
        return new NativeContext(...args);
      }
      CountingAudioContext.prototype = NativeContext.prototype;
      window.AudioContext = CountingAudioContext;
      if (window.webkitAudioContext) window.webkitAudioContext = CountingAudioContext;
    } catch {
      // The probe is diagnostic only; it must never break the page under test.
    }
  });
}

async function seedMusicPreference(page, enabled, volume) {
  await page.addInitScript(
    ({ keys, musicEnabled, musicVolume }) => {
      localStorage.setItem(keys.musicEnabled, musicEnabled);
      localStorage.setItem(keys.musicVolume, musicVolume);
    },
    { keys: TEST_STORAGE_KEYS, musicEnabled: enabled, musicVolume: volume },
  );
}

function readProbe(page) {
  return page.evaluate(() => ({ ...window.__audioProbe, gainTargets: [...window.__audioProbe.gainTargets] }));
}

test("muted player hears nothing when the first case starts", async ({ page }) => {
  await installAudioProbe(page);
  await seedMusicPreference(page, "false", "normal");
  await page.goto("/");

  await page.getByRole("button", { name: /첫 케이스 시작/ }).click();
  await expect(page.getByTestId("opening-burst")).toBeVisible();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });

  const probe = await readProbe(page);
  expect(probe.contexts).toBe(0);
  expect(probe.oscillators).toBe(0);
});

test("music player hears the accent at the chosen volume preset", async ({ page }) => {
  await installAudioProbe(page);
  await seedMusicPreference(page, "true", "low");
  await page.goto("/");

  await expect.poll(() => page.evaluate(() => window.__audioProbe.contexts)).toBe(1);
  const expectedPeak = ACCENT_PEAK_GAIN * LOW_PRESET_MULTIPLIER;
  const before = await readProbe(page);
  expect(before.risingSweeps).toBe(0);
  expect(before.gainTargets.some((value) => Math.abs(value - expectedPeak) < 1e-5)).toBe(false);

  await page.getByRole("button", { name: /첫 케이스 시작/ }).click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });

  const after = await readProbe(page);
  expect(after.risingSweeps).toBeGreaterThanOrEqual(1);
  expect(after.contexts).toBe(1);
  const accentTarget = after.gainTargets.find((value) => Math.abs(value - expectedPeak) < 1e-5);
  expect(accentTarget).toBeCloseTo(expectedPeak, 5);

  const beforeLock = await readProbe(page);
  await page.locator(".choices .choice").first().click();
  await expect(page.getByTestId("commit-target-lock")).toBeVisible();

  const afterLock = await readProbe(page);
  const expectedLockPeak = ACCENT_PEAK_GAIN * TARGET_LOCK_GAIN_RATIO * LOW_PRESET_MULTIPLIER;
  expect(afterLock.oscillators).toBeGreaterThanOrEqual(beforeLock.oscillators + 3);
  const lockTarget = afterLock.gainTargets.find((value) => Math.abs(value - expectedLockPeak) < 1e-5);
  expect(lockTarget).toBeCloseTo(expectedLockPeak, 5);
});
