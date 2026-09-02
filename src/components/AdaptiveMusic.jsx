import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";

const MUSIC_PREF_KEY = "critical-point-music-enabled";
const STEPS_PER_BAR = 16;

/**
 * Procedural score.
 *
 * Every mode is a one-bar, sixteen-step pattern driven by a single timer: a
 * drum layer (kick / snare / hat), a bass line, a lead and a pad. `step` walks
 * the bar, so intensity is a property of the pattern rather than of the tempo
 * alone -- a critical scene lands harder because the kick doubles and the bass
 * plays sixteenths, not just because it is faster.
 *
 * `x` marks a hit, `.` a rest. Frequencies are Hz; null is a rest.
 */
function pattern(text) {
  return text.split("").map((character) => character === "x");
}

const musicModes = {
  intro: {
    label: "INTRO",
    stepMs: 168,
    volume: 0.1,
    wave: "triangle",
    drive: 0,
    kick: pattern("x.......x......."),
    snare: pattern("................"),
    hat: pattern("..x...x...x...x."),
    bass: [55, null, null, null, 55, null, 65.41, null, 49, null, null, null, 49, null, 55, null],
    lead: [220, null, null, 277.18, null, null, 196, null, null, 246.94, null, null, 220, null, null, null],
    pad: [[110, 164.81, 220], null, null, null, null, null, null, null, [98, 146.83, 196], null, null, null, null, null, null, null],
    noiseEvery: 32,
  },
  controlled: {
    label: "CONTROLLED",
    stepMs: 152,
    volume: 0.115,
    wave: "triangle",
    drive: 0.12,
    kick: pattern("x.......x...x..."),
    snare: pattern("....x.......x..."),
    hat: pattern("..x.x.x...x.x.x."),
    bass: [65.41, null, 65.41, null, 82.41, null, 65.41, null, 73.42, null, 73.42, null, 98, null, 73.42, null],
    lead: [261.63, null, 329.63, null, null, 392, null, null, 293.66, null, 349.23, null, null, 329.63, null, null],
    pad: [[130.81, 196, 261.63], null, null, null, null, null, null, null, [146.83, 220, 293.66], null, null, null, null, null, null, null],
    noiseEvery: 24,
  },
  unstable: {
    label: "UNSTABLE",
    stepMs: 134,
    volume: 0.128,
    wave: "sawtooth",
    drive: 0.34,
    kick: pattern("x...x...x..x.x.."),
    snare: pattern("....x.......x..."),
    hat: pattern("x.xxx.x.x.xxx.xx"),
    bass: [73.42, 73.42, null, 69.3, 73.42, null, 82.41, 82.41, 65.41, 65.41, null, 69.3, 73.42, null, 87.31, null],
    lead: [293.66, null, 311.13, null, 392, null, null, 349.23, null, 329.63, null, 311.13, null, 415.3, null, null],
    pad: [[146.83, 220, 311.13], null, null, null, null, null, null, null, [138.59, 207.65, 277.18], null, null, null, null, null, null, null],
    noiseEvery: 16,
  },
  critical: {
    label: "CRITICAL",
    stepMs: 118,
    volume: 0.14,
    wave: "sawtooth",
    drive: 0.62,
    kick: pattern("x.x.x.x.x.x.xxx."),
    snare: pattern("....x.......x.x."),
    hat: pattern("xxxxxxxxxxxxxxxx"),
    bass: [49, 49, 51.91, 49, 55, 55, 46.25, 49, 49, 49, 58.27, 55, 51.91, 51.91, 49, 46.25],
    lead: [196, null, 207.65, 233.08, null, 246.94, null, 220, 196, null, 233.08, null, 261.63, null, 246.94, null],
    pad: [[98, 146.83, 207.65], null, null, null, [92.5, 138.59, 196], null, null, null, [103.83, 155.56, 220], null, null, null, [98, 146.83, 207.65], null, null, null],
    noiseEvery: 8,
  },
  result: {
    label: "RESULT",
    stepMs: 180,
    volume: 0.105,
    wave: "sine",
    drive: 0,
    kick: pattern("x.......x......."),
    snare: pattern("............x..."),
    hat: pattern("....x.......x..."),
    bass: [65.41, null, null, null, 82.41, null, null, null, 98, null, null, null, 73.42, null, null, null],
    lead: [261.63, null, null, 392, null, null, 329.63, null, null, 440, null, null, 392, null, null, null],
    pad: [[130.81, 196, 261.63], null, null, null, [164.81, 246.94, 329.63], null, null, null, null, null, null, null, [146.83, 220, 293.66], null, null, null],
    noiseEvery: 32,
  },
  final: {
    label: "FINAL",
    stepMs: 142,
    volume: 0.148,
    wave: "sawtooth",
    drive: 0.44,
    kick: pattern("x..x..x.x..x..x."),
    snare: pattern("....x.......x..."),
    hat: pattern("..x...x...x...x."),
    bass: [43.65, null, 43.65, 49, 55, null, 49, null, 41.2, null, 41.2, 46.25, 51.91, null, 58.27, null],
    lead: [349.23, null, 415.3, null, 466.16, null, 392, null, 349.23, null, 311.13, null, 349.23, 415.3, null, null],
    pad: [[87.31, 130.81, 174.61], null, null, null, null, null, null, null, [82.41, 123.47, 164.81], null, null, null, null, null, null, null],
    noiseEvery: 12,
  },
};

const chapterMotifs = {
  case01: { wave: "sine", lift: 80, impact: 0.94 },
  case02: { wave: "triangle", lift: 360, impact: 1.04 },
  case03: { wave: "sawtooth", lift: 620, impact: 1.12 },
  case04: { wave: "square", lift: 220, impact: 1.18 },
  case05: { wave: "triangle", lift: 480, impact: 1.24 },
  final: { wave: "sawtooth", lift: 760, impact: 1.32 },
};

const speakerMotifs = {
  "한서윤": { wave: "sine", semitones: 0, pulse: 0.94 },
  "반재욱": { wave: "triangle", semitones: -2, pulse: 1.04 },
  "도윤하": { wave: "sine", semitones: 3, pulse: 1.08 },
  "오진우": { wave: "sawtooth", semitones: -5, pulse: 1.14 },
  "에코": { wave: "square", semitones: 7, pulse: 0.9 },
  "반재현": { wave: "sawtooth", semitones: -7, pulse: 1.18 },
  "윤서": { wave: "triangle", semitones: 5, pulse: 0.96 },
};

const originMotifs = {
  courier: { semitones: -2, pulse: 0.98 },
  lab: { semitones: 2, pulse: 1.04 },
  public: { semitones: 5, pulse: 1.08 },
};

/** Swaps a few steps around so repeated scenes in one mode never loop identically. */
const groovePresets = [
  { kickShift: 0, hatDrop: 0, leadShift: 0 },
  { kickShift: 2, hatDrop: 3, leadShift: 0 },
  { kickShift: 0, hatDrop: 2, leadShift: 4 },
  { kickShift: 4, hatDrop: 0, leadShift: 2 },
];

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
    volume: Math.min(0.19, base.volume * (0.86 + intensity * 0.22 + scenePulse * 0.02)),
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
  lowpass.frequency.value = 3200;
  lowpass.Q.value = 0.7;
  delay.delayTime.value = 0.28;
  feedback.gain.value = 0.22;
  wet.gain.value = 0.2;
  compressor.threshold.value = -22;
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
  const decay = 0.19 + impact * 0.05;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(132 * impact, now);
  oscillator.frequency.exponentialRampToValueAtTime(38, now + decay);
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

export function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => readStoredValue(MUSIC_PREF_KEY, "true") !== "false");
  const [audioState, setAudioState] = useState("starting");
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const pulseRef = useRef(null);
  const resumeRef = useRef(null);
  const modeRef = useRef(createSceneMode(modeKey));
  const mode = useMemo(() => createSceneMode(modeKey), [modeKey]);

  useEffect(() => {
    modeRef.current = mode;
    if (audioRuntime.master && audioRuntime.context) {
      audioRuntime.master.gain.setTargetAtTime(mode.volume, audioRuntime.context.currentTime, 0.5);
    }
    if (audioRuntime.drive) {
      audioRuntime.drive.curve = makeDriveCurve(mode.drive);
    }
  }, [mode]);

  useEffect(() => {
    writeStoredValue(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setAudioState("off");
      audioRuntime.master?.gain.setTargetAtTime(0.0001, audioRuntime.context?.currentTime ?? 0, 0.08);
      return undefined;
    }

    const context = ensureAudioRuntime(modeRef.current.volume);
    if (!context) {
      setAudioState("unsupported");
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
        playKick(context, destination, 0.34 * impact, impact);
      }
      if (currentMode.snare[step]) {
        playSnare(context, destination, 0.12 * impact, 1600 + currentMode.filterLift);
      }
      if (currentMode.hat[step]) {
        playHat(context, destination, 0.05 * impact, step % 8 === 6);
      }

      const bass = currentMode.bass[step];
      if (bass) {
        playTone(context, destination, bass, stepSeconds * 1.6, 0.13 * impact, "square", {
          attack: 0.008,
          release: 0.12,
          filterFrequency: 320 + currentMode.filterLift * 0.5,
          q: 6,
        });
      }

      const lead = currentMode.lead[step];
      if (lead) {
        playTone(context, destination, lead, stepSeconds * 2.2, 0.055, currentMode.wave, {
          attack: 0.02,
          release: 0.32,
          filterFrequency: 1500 + currentMode.filterLift,
          detune: step % 2 === 0 ? -currentMode.detuneSpread : currentMode.detuneSpread,
        });
      }

      const pad = currentMode.pad[step];
      if (pad) {
        playChord(context, destination, pad, stepSeconds * 10, 0.1, "sine");
      }

      if (currentMode.noiseEvery > 0 && stepRef.current % currentMode.noiseEvery === 0) {
        playNoiseSweep(context, destination, 0.8, currentMode.volume * 0.22 * impact, 520 + currentMode.filterLift);
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

    audioRuntime.master.gain.setTargetAtTime(modeRef.current.volume, context.currentTime, 0.2);
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
    if (!ensureAudioRuntime(modeRef.current.volume)) {
      setAudioState("unsupported");
      return;
    }
    resumeRef.current?.();
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
        setEnabled((value) => !value);
      }}
      aria-label={toggleLabel}
      title={toggleLabel}
    >
      {enabled && audioState === "running" ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{enabled && audioState === "running" ? mode.label : toggleLabel}</span>
    </button>
  );
}
