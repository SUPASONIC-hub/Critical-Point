import { expect, test } from "./helpers/network.js";
import { startFirstRun } from "./helpers/gameFlow.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

const ACCENT_PEAK_GAIN = 0.045;
const REVEAL_PEAK_GAIN = 0.035;
const LOW_PRESET_MULTIPLIER = 0.58;
const TARGET_LOCK_GAIN_RATIO = 0.72;
// playTargetLockCue's three notes, and the shortest and longest of
// playDecisionRevealCue's chords (src/components/AdaptiveMusic.jsx).
const TARGET_LOCK_NOTES = 3;
const REVEAL_NOTES_MIN = 2;
const REVEAL_NOTES_MAX = 4;

/* The probe counts the objects that can make sound instead of listening for it:
   headless Chromium has no audio device, but node creation is still observable.

   `voices` is one entry per oscillator wired to a gain: the level that gain is
   ramped up to. It is what tells a cue from the score. The background pulse
   makes oscillators all the time, so "three more oscillators than before the
   click" was true of a click that played nothing; a cue is the oscillators
   whose gain peaks at the cue's own level, and those are counted. */
async function installAudioProbe(page) {
  await page.addInitScript(() => {
    const probe = { contexts: 0, oscillators: 0, risingSweeps: 0, gainTargets: [], voices: [] };
    const rampsOf = new WeakMap();
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
        const connect = node.connect.bind(node);
        node.connect = (destination, ...rest) => {
          // The same array the gain's ramps are pushed to, so a ramp set after
          // the wiring is still read.
          if (rampsOf.has(destination)) probe.voices.push(rampsOf.get(destination));
          return connect(destination, ...rest);
        };
        return node;
      };

      const nativeCreateGain = NativeContext.prototype.createGain;
      NativeContext.prototype.createGain = function createGain(...args) {
        const node = nativeCreateGain.apply(this, args);
        const rampToValue = node.gain.exponentialRampToValueAtTime.bind(node.gain);
        const ramps = [];
        rampsOf.set(node, ramps);
        node.gain.exponentialRampToValueAtTime = (value, time) => {
          probe.gainTargets.push(value);
          ramps.push(value);
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
  return page.evaluate(() => ({
    ...window.__audioProbe,
    gainTargets: [...window.__audioProbe.gainTargets],
    // The loudest level each wired oscillator's gain is ramped to.
    voices: window.__audioProbe.voices.map((ramps) => (ramps.length ? Math.max(...ramps) : 0)),
  }));
}

const at = (peak) => (value) => Math.abs(value - peak) < 1e-5;

/** The oscillators wired since `before` whose gain peaks at `peak`: a cue's own notes. */
function voicesSince(before, after, peak) {
  return after.voices.slice(before.voices.length).filter(at(peak));
}

test("muted player hears nothing when the first case starts", { tag: "@prod" }, async ({ page }) => {
  await installAudioProbe(page);
  await seedMusicPreference(page, "false", "normal");
  await page.goto("/");

  // The burst assertion moved to season-flow's cold-open test, which clicks
  // raw and can catch the 860ms overlay; startFirstRun waits for the shell, and
  // the shell is only reachable through the burst callback, so racing a
  // finished overlay here would only add flake.
  await startFirstRun(page);

  const probe = await readProbe(page);
  expect(probe.contexts).toBe(0);
  expect(probe.oscillators).toBe(0);
});

test("music player hears the accent at the chosen volume preset", { tag: "@prod" }, async ({ page, browserName }) => {
  // Playwright's WebKit build for Windows ships without Web Audio: the app
  // says so itself ("이 브라우저는 배경음을 지원하지 않습니다"). Where the browser
  // has no audio there is no accent to hear; on Linux and macOS this runs.
  test.skip(browserName === "webkit" && process.platform === "win32", "this WebKit build has no Web Audio");
  await installAudioProbe(page);
  await seedMusicPreference(page, "true", "low");
  await page.goto("/");

  await expect.poll(() => page.evaluate(() => window.__audioProbe.contexts)).toBe(1);
  const expectedPeak = ACCENT_PEAK_GAIN * LOW_PRESET_MULTIPLIER;
  const before = await readProbe(page);
  expect(before.risingSweeps).toBe(0);
  expect(before.gainTargets.some((value) => Math.abs(value - expectedPeak) < 1e-5)).toBe(false);

  await startFirstRun(page);

  const after = await readProbe(page);
  expect(after.risingSweeps).toBeGreaterThanOrEqual(1);
  expect(after.contexts).toBe(1);
  const accentTarget = after.gainTargets.find((value) => Math.abs(value - expectedPeak) < 1e-5);
  expect(accentTarget).toBeCloseTo(expectedPeak, 5);

  // Staking a card plays the lock: three notes, each at the lock's level and
  // at the chosen preset. Nothing before the click was at that level, so the
  // three counted are the click's and not the score's.
  const expectedLockPeak = ACCENT_PEAK_GAIN * TARGET_LOCK_GAIN_RATIO * LOW_PRESET_MULTIPLIER;
  const beforeLock = await readProbe(page);
  expect(beforeLock.voices.filter(at(expectedLockPeak)), "the lock had not sounded before a card was staked").toHaveLength(0);
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toBeVisible();

  await expect.poll(async () => voicesSince(beforeLock, await readProbe(page), expectedLockPeak).length).toBe(TARGET_LOCK_NOTES);
  const afterLock = await readProbe(page);
  expect(afterLock.gainTargets.slice(beforeLock.gainTargets.length).filter(at(expectedLockPeak))).toHaveLength(TARGET_LOCK_NOTES);

  // Cashing opens the reveal, whose chord is two to four notes: the first at
  // the reveal's level and each one after it quieter, the nth at a nth of it.
  const expectedRevealPeak = REVEAL_PEAK_GAIN * LOW_PRESET_MULTIPLIER;
  const beforeReveal = await readProbe(page);
  expect(beforeReveal.voices.filter(at(expectedRevealPeak)), "the reveal had not sounded before the cash").toHaveLength(0);
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("decision-next")).toBeVisible();

  await expect.poll(async () => voicesSince(beforeReveal, await readProbe(page), expectedRevealPeak).length).toBe(1);
  const afterReveal = await readProbe(page);
  const chord = Array.from({ length: REVEAL_NOTES_MAX }, (_, index) => voicesSince(beforeReveal, afterReveal, expectedRevealPeak / (index + 1)).length);
  expect(chord.slice(0, REVEAL_NOTES_MIN), "the chord's first notes, one each").toEqual(Array(REVEAL_NOTES_MIN).fill(1));
  // One chord: no level twice, and no fourth note without a third.
  expect(Math.max(...chord)).toBe(1);
  expect(chord.join(""), "the notes run on from the first without a gap").toMatch(/^1+0*$/);
  expect(afterReveal.gainTargets.slice(beforeReveal.gainTargets.length).filter(at(expectedRevealPeak))).toHaveLength(1);
  // The lock did not sound again when the card was cashed.
  expect(voicesSince(beforeReveal, afterReveal, expectedLockPeak)).toHaveLength(0);
});

test("muted player hears nothing when a decision is made", { tag: "@prod" }, async ({ page }) => {
  await installAudioProbe(page);
  await seedMusicPreference(page, "false", "normal");
  await page.goto("/");
  await startFirstRun(page);

  // The cues on the decision window are the ones the mute toggle used to miss:
  // the juice layer opened a second AudioContext of its own and played through
  // it, so `배경음 끄기` silenced the score and nothing else. Staking a card and
  // cashing it reaches the table's cues: the heartbeat, the drone, the register.
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toBeVisible();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("decision-next")).toBeVisible();

  const probe = await readProbe(page);
  expect(probe.contexts, "a muted run must not open an AudioContext at all").toBe(0);
  expect(probe.oscillators).toBe(0);
});
