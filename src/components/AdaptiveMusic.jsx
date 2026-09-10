import { useEffect, useMemo, useRef, useState } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { chapterMotifs, groovePresets, musicModes, originMotifs, speakerMotifs } from "./musicData.js";
const MUSIC_PREF_KEY = "critical-point-music-enabled";
const MUSIC_VOLUME_KEY = "critical-point-music-volume";
const STEPS_PER_BAR = 16;
const MIX_VOLUME = 0.74;
// The kick is the only percussive voice with weight now; the hats are room
// noise, not a hi-hat line, so they sit well under the pad.
const KICK_GAIN = 0.2;
const SNARE_GAIN = 0.1;
const HAT_GAIN = 0.022;
const BASS_GAIN = 0.08;
const LEAD_GAIN = 0.045;
const PAD_GAIN = 0.045;
const volumePresets = {
  low: { label: "LOW", multiplier: 0.58 },
  normal: { label: "NORMAL", multiplier: 0.82 },
  high: { label: "HIGH", multiplier: 1 },
};
const volumePresetOrder = Object.keys(volumePresets);

function normalizeVolumePreset(value) {
  return Object.hasOwn(volumePresets, value) ? value : "normal";
}

function hashMusicKey(value = "") {
  return String(value).split("").reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0);
}

function shiftFrequency(frequency, semitones) {
  return frequency ? Number((frequency * 2 ** (semitones / 12)).toFixed(2)) : frequency;
}

function shiftPattern(pattern_, semitones) {
  return pattern_.map((item) =>
    Array.isArray(item) ? item.map((frequency) => shiftFrequency(frequency, semitones)) : shiftFrequency(item, semitones),
  );
}

function rotate(list, offset) {
  if (!offset) return list;
  const size = list.length;
  const shift = ((offset % size) + size) % size;
  return [...list.slice(size - shift), ...list.slice(0, size - shift)];
}

function thinOut(hits, every) {
  if (!every) return hits;
  return hits.map((hit, index) => (hit && index % every === 0 ? false : hit));
}

function createSceneMode(modeKey) {
  const parts = String(modeKey || "intro").split(":");
  const isFinal = parts.includes("final");
  const baseKey = isFinal && parts[0] === "result" ? "final" : parts[0];
  const base = musicModes[baseKey] ?? musicModes.intro;
  const hash = Math.abs(hashMusicKey(modeKey));
  const tempoMultipliers = [1, 0.94, 1.06, 0.88, 1.12, 0.82];
  const semitoneShifts = [-5, -2, 0, 3, 5, 7, -7];
  const tempo = tempoMultipliers[hash % tempoMultipliers.length];
  const semitoneShift = semitoneShifts[Math.floor(hash / 6) % semitoneShifts.length];
  const motif = chapterMotifs[parts[1]] ?? chapterMotifs.case01;
  const speakerMotif = speakerMotifs[parts[3]] ?? { wave: motif.wave, semitones: 0, pulse: 1 };
  const originMotif = originMotifs[parts[5]] ?? { semitones: 0, pulse: 1 };
  const sceneIndex = Number(parts.at(-1));
  const scenePulse = Number.isFinite(sceneIndex) ? sceneIndex % 4 : hash % 4;
  const groove = groovePresets[scenePulse];
  const transpose = semitoneShift + speakerMotif.semitones + originMotif.semitones;
  const intensity = motif.impact * speakerMotif.pulse * originMotif.pulse;

  return {
    label: base.label,
    interval: Math.max(96, Math.round(base.stepMs * tempo)),
    volume: Math.min(0.14, base.volume * MIX_VOLUME * (0.82 + intensity * 0.16 + scenePulse * 0.012)),
    wave: speakerMotif.wave ?? base.wave,
    drive: Math.min(0.9, base.drive * intensity),
    kick: rotate(base.kick, groove.kickShift),
    snare: base.snare,
    hat: thinOut(base.hat, groove.hatDrop),
    bass: shiftPattern(base.bass, transpose),
    lead: rotate(shiftPattern(base.lead, transpose), groove.leadShift),
    pad: shiftPattern(base.pad, transpose),
    noiseEvery: base.noiseEvery,
    detuneSpread: 3 + (hash % 11),
    impact: intensity,
    filterLift: motif.lift + (hash % 5) * 140,
  };
}

/** Soft-clip curve; `amount` 0 leaves the signal alone. */
function makeDriveCurve(amount) {
  const size = 1024;
  const curve = new Float32Array(size);
  const k = amount * 60;
  for (let index = 0; index < size; index += 1) {
    const x = (index * 2) / size - 1;
    curve[index] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
}

function connectMusicBus(context, output) {
  const input = context.createGain();
  const shaper = context.createWaveShaper();
  const lowpass = context.createBiquadFilter();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const wet = context.createGain();
  const compressor = context.createDynamicsCompressor();

  shaper.curve = makeDriveCurve(0);
  shaper.oversample = "2x";
  lowpass.type = "lowpass";
  lowpass.frequency.value = 4200;
  lowpass.Q.value = 0.7;
  delay.delayTime.value = 0.18;
  feedback.gain.value = 0.1;
  wet.gain.value = 0.08;
  compressor.threshold.value = -20;
  compressor.knee.value = 20;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.24;

  input.connect(shaper);
  shaper.connect(lowpass);
  lowpass.connect(compressor);
  lowpass.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(compressor);
  compressor.connect(output);
  return { input, shaper };
}

function playTone(context, destination, frequency, duration, gainValue, type = "sine", options = {}) {
  if (!frequency) return;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;
  const attack = options.attack ?? 0.08;
  const release = options.release ?? 0.22;
  const sustainUntil = now + Math.max(attack + 0.03, duration);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (Number.isFinite(options.detune)) oscillator.detune.setValueAtTime(options.detune, now);

  filter.type = options.filterType ?? "lowpass";
  filter.frequency.setValueAtTime(options.filterFrequency ?? 1800, now);
  filter.Q.setValueAtTime(options.q ?? 0.8, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), now + attack);
  gain.gain.setTargetAtTime(0.0001, sustainUntil, release);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(now);
  oscillator.stop(sustainUntil + release * 5);
}

function playChord(context, destination, frequencies = [], duration = 1, gainValue = 0.06, type = "sine") {
  frequencies.filter(Boolean).forEach((frequency, index) => {
    playTone(context, destination, frequency, duration + index * 0.05, gainValue / Math.max(1, frequencies.length), type, {
      attack: 0.3,
      release: 0.7,
      detune: (index - 1) * 5,
      filterFrequency: 1200 + index * 260,
    });
  });
}

/** Pitch-swept sine: the body of the kick. */
function playKick(context, destination, gainValue, impact = 1) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const decay = 0.13 + Math.min(impact, 1.35) * 0.035;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(118 * impact, now);
  oscillator.frequency.exponentialRampToValueAtTime(52, now + decay);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + decay + 0.02);
}

function createNoiseSource(context, duration) {
  const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  return source;
}

function playSnare(context, destination, gainValue, filterFrequency = 1900) {
  const now = context.currentTime;
  const duration = 0.22;
  const source = createNoiseSource(context, duration);
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const body = context.createOscillator();
  const bodyGain = context.createGain();

  filter.type = "highpass";
  filter.frequency.setValueAtTime(filterFrequency, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  body.type = "triangle";
  body.frequency.setValueAtTime(196, now);
  bodyGain.gain.setValueAtTime(gainValue * 0.5, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  body.connect(bodyGain);
  bodyGain.connect(destination);
  source.start(now);
  source.stop(now + duration);
  body.start(now);
  body.stop(now + duration);
}

function playHat(context, destination, gainValue, open = false) {
  const now = context.currentTime;
  const duration = open ? 0.16 : 0.045;
  const source = createNoiseSource(context, duration);
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  filter.type = "highpass";
  filter.frequency.setValueAtTime(7200, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + duration);
}

function playNoiseSweep(context, destination, duration = 0.7, gainValue = 0.02, filterFrequency = 520) {
  const now = context.currentTime;
  const source = createNoiseSource(context, duration);
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFrequency, now);
  filter.frequency.exponentialRampToValueAtTime(Math.max(120, filterFrequency * 0.35), now + duration);
  filter.Q.setValueAtTime(1.4, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), now + duration * 0.4);
  gain.gain.setTargetAtTime(0.0001, now + duration * 0.55, duration * 0.25);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

/**
 * One audio graph for the whole session.
 *
 * AdaptiveMusic is rendered inside each screen, so it remounts on every screen
 * change. Building a context per mount both leaked them (browsers cap how many
 * a page may open) and cut the score off at each transition; sharing one keeps
 * the bar running across the intro -> play -> result seam.
 */
const audioRuntime = { context: null, master: null, bus: null, drive: null };

function ensureAudioRuntime(volume) {
  if (!audioRuntime.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioRuntime.context = new AudioContextClass();
  }
  const context = audioRuntime.context;
  if (!audioRuntime.master) {
    audioRuntime.master = context.createGain();
    audioRuntime.master.gain.value = volume;
    audioRuntime.master.connect(context.destination);
  }
  if (!audioRuntime.bus) {
    const bus = connectMusicBus(context, audioRuntime.master);
    audioRuntime.bus = bus.input;
    audioRuntime.drive = bus.shaper;
  }
  return context;
}

const ACCENT_PEAK_GAIN = 0.045;
const REVEAL_PEAK_GAIN = 0.035;
const TICK_PEAK_GAIN = 0.02;
const PREVIEW_PEAK_GAIN = 0.014;

/**
 * The start button's confirmation tone.
 *
 * It rides the shared runtime so the intro no longer opens a context per press,
 * and it reads the stored preferences at click time so the mute toggle and the
 * volume preset both apply. It connects to `destination`, not `master`: master
 * carries `mode.volume` (0.1 in the intro), which is the level the *background*
 * mix sits at to stay behind the UI - a confirmation cue must not be ducked by it.
 */
export function playOpeningAccent() {
  try {
    if (readStoredValue(MUSIC_PREF_KEY, "true") === "false") return;
    // The start button is the page's first gesture now, and on a slow device it
    // is clickable seconds before AdaptiveMusic's mount effect builds the shared
    // runtime. Building it here rather than bailing keeps the cold open's one
    // confirmation cue on exactly the devices where the burst runs longest. The
    // mute check above still runs first, so a muted player creates no context.
    const context = audioRuntime.context ?? ensureAudioRuntime(0.0001);
    if (!context) return;
    Promise.resolve(context.resume?.()).catch(() => {});

    const multiplier = volumePresets[normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal"))].multiplier;
    const peak = ACCENT_PEAK_GAIN * multiplier;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(110, now);
    oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.21);
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}

export function playTargetLockCue() {
  try {
    if (readStoredValue(MUSIC_PREF_KEY, "true") === "false") return;
    const context = audioRuntime.context;
    if (!context) return;
    Promise.resolve(context.resume?.()).catch(() => {});

    const multiplier = volumePresets[normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal"))].multiplier;
    const peak = ACCENT_PEAK_GAIN * 0.72 * multiplier;
    const now = context.currentTime;
    const destination = audioRuntime.bus ?? audioRuntime.master ?? context.destination;
    const notes = [196, 246.94, 293.66];

    notes.forEach((frequency, index) => {
      const start = now + index * 0.045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.06, start + 0.09);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
      oscillator.connect(gain);
      gain.connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.13);
    });
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}

export function playChoicePreviewCue() {
  try {
    if (readStoredValue(MUSIC_PREF_KEY, "true") === "false") return;
    const context = audioRuntime.context;
    if (!context) return;
    Promise.resolve(context.resume?.()).catch(() => {});

    const multiplier = volumePresets[normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal"))].multiplier;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(330, now);
    oscillator.frequency.exponentialRampToValueAtTime(392, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(PREVIEW_PEAK_GAIN * multiplier, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(gain);
    gain.connect(audioRuntime.bus ?? audioRuntime.master ?? context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}

export function playDecisionRevealCue(tone = "decision-locked") {
  try {
    if (readStoredValue(MUSIC_PREF_KEY, "true") === "false") return;
    const context = audioRuntime.context;
    if (!context) return;
    Promise.resolve(context.resume?.()).catch(() => {});

    const multiplier = volumePresets[normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal"))].multiplier;
    const peak = REVEAL_PEAK_GAIN * multiplier;
    const now = context.currentTime;
    const destination = audioRuntime.bus ?? audioRuntime.master ?? context.destination;
    const patterns = {
      "clue-found": [293.66, 369.99, 440],
      "system-alert": [220, 185, 146.83],
      "chain-reaction": [164.81, 220, 277.18, 329.63],
      "streak-break": [246.94, 196],
      "decision-locked": [196, 261.63, 329.63],
    };
    const notes = patterns[tone] ?? patterns["decision-locked"];

    notes.forEach((frequency, index) => {
      const start = now + index * 0.055;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = tone === "system-alert" || tone === "chain-reaction" ? "sawtooth" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * (tone === "system-alert" || tone === "streak-break" ? 0.92 : 1.08),
        start + 0.12,
      );
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak / Math.max(1, index + 1), start + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
      oscillator.connect(gain);
      gain.connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.22);
    });
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}

/**
 * The last ten seconds of the decision window, as a heartbeat.
 *
 * `remaining` is the seconds left, so the pitch rises as the window closes and
 * the closing beat is a lower, longer thud. It is the smallest cue in the game
 * on purpose: it repeats up to eleven times per scene, forty-two scenes a run,
 * so it sits under the score rather than on top of it.
 */
export function playDecisionTick(remaining) {
  try {
    if (readStoredValue(MUSIC_PREF_KEY, "true") === "false") return;
    const context = audioRuntime.context;
    if (!context) return;

    const multiplier = volumePresets[normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal"))].multiplier;
    const overtime = remaining === "overtime";
    const seconds = overtime ? 0 : Math.max(0, Math.min(10, Number(remaining) || 0));
    const peak = TICK_PEAK_GAIN * multiplier * (overtime ? 1.4 : 1 + (10 - seconds) / 14);
    const now = context.currentTime;
    const destination = audioRuntime.bus ?? audioRuntime.master ?? context.destination;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = overtime ? "sine" : "triangle";
    const base = overtime ? 58 : 96 + (10 - seconds) * 7;
    oscillator.frequency.setValueAtTime(base, now);
    oscillator.frequency.exponentialRampToValueAtTime(base * (overtime ? 0.7 : 0.86), now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (overtime ? 0.34 : 0.14));
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(now);
    oscillator.stop(now + (overtime ? 0.36 : 0.16));
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
  }
}

export function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => readStoredValue(MUSIC_PREF_KEY, "true") !== "false");
  const [volumePreset, setVolumePreset] = useState(() =>
    normalizeVolumePreset(readStoredValue(MUSIC_VOLUME_KEY, "normal")),
  );
  const [audioState, setAudioState] = useState(() =>
    readStoredValue(MUSIC_PREF_KEY, "true") !== "false" ? "starting" : "off",
  );
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const pulseRef = useRef(null);
  const resumeRef = useRef(null);
  const modeRef = useRef(createSceneMode(modeKey));
  const mode = useMemo(() => createSceneMode(modeKey), [modeKey]);
  const effectiveVolume = mode.volume * volumePresets[volumePreset].multiplier;
  /* The running loop reads the volume through a ref: a preset change has to ramp
     the master gain without tearing the timer down mid-bar. */
  const volumeRef = useRef(effectiveVolume);

  useEffect(() => {
    modeRef.current = mode;
    volumeRef.current = effectiveVolume;
    if (audioRuntime.master && audioRuntime.context) {
      audioRuntime.master.gain.setTargetAtTime(effectiveVolume, audioRuntime.context.currentTime, 0.5);
    }
    if (audioRuntime.drive) {
      audioRuntime.drive.curve = makeDriveCurve(mode.drive);
    }
  }, [effectiveVolume, mode]);

  useEffect(() => {
    writeStoredValue(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      audioRuntime.master?.gain.setTargetAtTime(0.0001, audioRuntime.context?.currentTime ?? 0, 0.08);
      return undefined;
    }

    const context = ensureAudioRuntime(volumeRef.current);
    if (!context) {
      queueMicrotask(() => setAudioState("unsupported"));
      return undefined;
    }

    function pulse() {
      if (context.state === "suspended") return;
      const currentMode = modeRef.current;
      const step = stepRef.current % STEPS_PER_BAR;
      const destination = audioRuntime.bus ?? audioRuntime.master;
      const stepSeconds = currentMode.interval / 1000;
      const impact = currentMode.impact;

      if (currentMode.kick[step]) {
        playKick(context, destination, KICK_GAIN * impact, impact);
      }
      if (currentMode.snare[step]) {
        playSnare(context, destination, SNARE_GAIN * impact, 1900 + currentMode.filterLift);
      }
      if (currentMode.hat[step]) {
        playHat(context, destination, HAT_GAIN * impact, step % 8 === 6);
      }

      const bass = currentMode.bass[step];
      if (bass) {
        playTone(context, destination, bass, stepSeconds * 1.15, BASS_GAIN * impact, "triangle", {
          attack: 0.008,
          release: 0.09,
          filterFrequency: 560 + currentMode.filterLift * 0.42,
          q: 2.4,
        });
      }

      const lead = currentMode.lead[step];
      if (lead) {
        playTone(context, destination, lead, stepSeconds * 1.8, LEAD_GAIN, currentMode.wave, {
          attack: 0.02,
          release: 0.24,
          filterFrequency: 1500 + currentMode.filterLift,
          detune: step % 2 === 0 ? -currentMode.detuneSpread : currentMode.detuneSpread,
        });
      }

      const pad = currentMode.pad[step];
      if (pad) {
        playChord(context, destination, pad, stepSeconds * 6, PAD_GAIN, "sine");
      }

      if (currentMode.noiseEvery > 0 && stepRef.current % currentMode.noiseEvery === 0) {
        playNoiseSweep(context, destination, 0.55, currentMode.volume * 0.12 * impact, 760 + currentMode.filterLift);
      }

      stepRef.current += 1;
    }

    pulseRef.current = pulse;
    async function resumeAudio() {
      try {
        await context.resume?.();
        setAudioState(context.state === "running" ? "running" : "blocked");
        if (context.state === "running") pulse();
      } catch (error) {
        console.warn("Audio resume blocked", error);
        setAudioState("blocked");
      }
    }

    resumeRef.current = resumeAudio;
    context.onstatechange = () => {
      setAudioState(context.state === "running" ? "running" : context.state === "closed" ? "off" : "blocked");
    };

    function resumeAfterAutoplayBlock() {
      resumeAudio();
    }

    window.addEventListener("pointerdown", resumeAfterAutoplayBlock, { passive: true });
    window.addEventListener("keydown", resumeAfterAutoplayBlock);
    window.addEventListener("touchstart", resumeAfterAutoplayBlock, { passive: true });

    audioRuntime.master.gain.setTargetAtTime(volumeRef.current, context.currentTime, 0.2);
    pulse();
    resumeAudio();
    timerRef.current = window.setInterval(pulse, modeRef.current.interval);
    return () => {
      window.clearInterval(timerRef.current);
      window.removeEventListener("pointerdown", resumeAfterAutoplayBlock);
      window.removeEventListener("keydown", resumeAfterAutoplayBlock);
      window.removeEventListener("touchstart", resumeAfterAutoplayBlock);
      if (pulseRef.current === pulse) pulseRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !timerRef.current || !pulseRef.current) return;
    window.clearInterval(timerRef.current);
    // Restart on a bar line so a mode change lands as a musical edit, not a stumble.
    stepRef.current = 0;
    pulseRef.current();
    timerRef.current = window.setInterval(pulseRef.current, modeRef.current.interval);
  }, [enabled, modeKey]);

  useEffect(
    () => () => {
      // The shared context outlives this mount on purpose; only the timer is ours.
      window.clearInterval(timerRef.current);
    },
    [],
  );

  function startAudioFromGesture() {
    if (!ensureAudioRuntime(volumeRef.current)) {
      setAudioState("unsupported");
      return;
    }
    resumeRef.current?.();
  }

  function cycleVolumePreset() {
    const currentIndex = volumePresetOrder.indexOf(volumePreset);
    const nextPreset = volumePresetOrder[(currentIndex + 1) % volumePresetOrder.length];
    setVolumePreset(nextPreset);
    writeStoredValue(MUSIC_VOLUME_KEY, nextPreset);
  }

  const toggleLabel =
    audioState === "unsupported"
      ? "이 브라우저는 배경음을 지원하지 않습니다"
      : !enabled
        ? "배경음 켜기"
        : audioState === "running"
          ? "배경음 끄기"
          : "배경음 재생하기";

  return (
    <div className="music-controls">
      <button
        type="button"
        className={enabled ? "music-toggle active" : "music-toggle"}
        onClick={() => {
          if (!enabled) {
            setEnabled(true);
            startAudioFromGesture();
            return;
          }
          if (enabled && audioState !== "running" && audioState !== "unsupported") {
            resumeRef.current?.();
            return;
          }
          setAudioState("off");
          setEnabled(false);
        }}
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        {enabled && audioState === "running" ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span>{enabled && audioState === "running" ? mode.label : toggleLabel}</span>
      </button>
      {enabled && audioState !== "unsupported" && (
        <button
          type="button"
          className="music-volume-toggle"
          onClick={cycleVolumePreset}
          aria-label={`배경음악 볼륨 ${volumePresets[volumePreset].label}`}
          title="배경음악 볼륨"
        >
          <Volume1 size={16} />
          <span>{volumePresets[volumePreset].label}</span>
        </button>
      )}
    </div>
  );
}
