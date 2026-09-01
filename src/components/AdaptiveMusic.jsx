import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";

const MUSIC_PREF_KEY = "critical-point-music-enabled";

const musicModes = {
  intro: {
    label: "대기",
    interval: 1200,
    volume: 0.09,
    wave: "sine",
    bass: [55, 55, 65.4, 49],
    notes: [220, null, null, 277.18, 196, null, 246.94, null],
    chords: [[110, 164.81, 220], null, [98, 146.83, 196], null],
    hitEvery: 0,
    noiseEvery: 16,
  },
  controlled: {
    label: "안정",
    interval: 980,
    volume: 0.1,
    wave: "triangle",
    bass: [65.4, 73.42, 82.41, 73.42],
    notes: [261.63, null, 329.63, null, 392, null, 293.66, null],
    chords: [[130.81, 196, 261.63], null, [146.83, 220, 293.66], null],
    hitEvery: 12,
    noiseEvery: 20,
  },
  unstable: {
    label: "불안정",
    interval: 760,
    volume: 0.115,
    wave: "triangle",
    bass: [73.42, 69.3, 82.41, 65.4],
    notes: [293.66, null, 311.13, 392, null, 349.23, 329.63, null],
    chords: [[146.83, 220, 311.13], null, [138.59, 207.65, 277.18], null],
    hitEvery: 10,
    noiseEvery: 14,
  },
  critical: {
    label: "위기",
    interval: 560,
    volume: 0.125,
    wave: "triangle",
    bass: [49, 51.91, 55, 46.25],
    notes: [196, null, 207.65, 233.08, null, 246.94, 220, null],
    chords: [[98, 146.83, 207.65], [92.5, 138.59, 196], null, [103.83, 155.56, 220]],
    hitEvery: 8,
    noiseEvery: 10,
  },
  result: {
    label: "결과",
    interval: 1280,
    volume: 0.095,
    wave: "sine",
    bass: [65.4, 82.41, 98, 73.42],
    notes: [261.63, null, null, 392, 329.63, null, 440, null],
    chords: [[130.81, 196, 261.63], [164.81, 246.94, 329.63], null, [146.83, 220, 293.66]],
    hitEvery: 0,
    noiseEvery: 24,
  },
};

function connectMusicBus(context, output) {
  const lowpass = context.createBiquadFilter();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const wet = context.createGain();
  const compressor = context.createDynamicsCompressor();

  lowpass.type = "lowpass";
  lowpass.frequency.value = 2600;
  lowpass.Q.value = 0.7;
  delay.delayTime.value = 0.31;
  feedback.gain.value = 0.18;
  wet.gain.value = 0.18;
  compressor.threshold.value = -24;
  compressor.knee.value = 24;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.28;

  lowpass.connect(compressor);
  lowpass.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(compressor);
  compressor.connect(output);
  return lowpass;
}

function playTone(context, destination, frequency, duration, gainValue, type = "sine", options = {}) {
  if (!frequency) return;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;
  const attack = options.attack ?? 0.08;
  const release = options.release ?? 0.22;
  const sustainUntil = now + Math.max(attack + 0.04, duration);

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
      attack: 0.28,
      release: 0.65,
      detune: (index - 1) * 4,
      filterFrequency: 1200 + index * 260,
    });
  });
}

function playNoiseHit(context, destination, duration = 0.7, gainValue = 0.02, filterFrequency = 520) {
  const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    const envelope = Math.sin((index / sampleCount) * Math.PI);
    data[index] = (Math.random() * 2 - 1) * envelope * 0.55;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFrequency, now);
  filter.Q.setValueAtTime(1.3, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.setTargetAtTime(0.0001, now + duration * 0.35, duration * 0.25);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

export function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => readStoredValue(MUSIC_PREF_KEY, "true") !== "false");
  const [audioState, setAudioState] = useState("starting");
  const contextRef = useRef(null);
  const masterGainRef = useRef(null);
  const musicBusRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const pulseRef = useRef(null);
  const resumeRef = useRef(null);
  const modeRef = useRef(musicModes[modeKey] ?? musicModes.intro);
  const mode = musicModes[modeKey] ?? musicModes.intro;

  function ensureAudioGraph() {
    const context = contextRef.current ?? getAudioContext();
    if (!context) return null;
    contextRef.current = context;
    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = modeRef.current.volume;
      masterGainRef.current.connect(context.destination);
    }
    if (!musicBusRef.current) {
      musicBusRef.current = connectMusicBus(context, masterGainRef.current);
    }
    return context;
  }

  useEffect(() => {
    modeRef.current = mode;
    if (masterGainRef.current && contextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(mode.volume, contextRef.current.currentTime, 0.5);
    }
  }, [mode]);

  useEffect(() => {
    writeStoredValue(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setAudioState("off");
      masterGainRef.current?.gain.setTargetAtTime(0.0001, contextRef.current?.currentTime ?? 0, 0.08);
      return undefined;
    }

    const context = ensureAudioGraph();
    if (!context) {
      setAudioState("unsupported");
      return undefined;
    }

    function pulse() {
      if (context.state === "suspended") return;
      const currentMode = modeRef.current;
      const step = stepRef.current;
      const note = currentMode.notes[step % currentMode.notes.length];
      const bass = currentMode.bass[Math.floor(step / 4) % currentMode.bass.length];
      const chord = currentMode.chords[Math.floor(step / 4) % currentMode.chords.length];
      const destination = musicBusRef.current ?? masterGainRef.current;

      playTone(context, destination, note, currentMode.interval / 900, 0.06, currentMode.wave, {
        attack: 0.12,
        release: 0.45,
        filterFrequency: 1500,
        detune: step % 2 === 0 ? -3 : 3,
      });

      if (step % 4 === 0) {
        playTone(context, destination, bass, currentMode.interval / 360, 0.08, "sine", {
          attack: 0.18,
          release: 0.8,
          filterFrequency: 520,
        });
        playChord(context, destination, chord ?? [], currentMode.interval / 210, 0.12, "sine");
      }

      if (currentMode.hitEvery > 0 && step % currentMode.hitEvery === 0) {
        playTone(context, destination, bass * 2, 0.16, 0.035, "triangle", {
          attack: 0.01,
          release: 0.18,
          filterFrequency: 900,
        });
      }

      if (currentMode.noiseEvery > 0 && step % currentMode.noiseEvery === 0) {
        playNoiseHit(context, destination, 0.7, currentMode.volume * 0.18, 420 + (step % 5) * 120);
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
    pulseRef.current();
    timerRef.current = window.setInterval(pulseRef.current, modeRef.current.interval);
  }, [enabled, modeKey]);

  function startAudioFromGesture() {
    const context = ensureAudioGraph();
    if (!context) {
      setAudioState("unsupported");
      return;
    }
    context.resume().then(() => {
      setAudioState(context.state === "running" ? "running" : "blocked");
      if (context.state === "running") pulseRef.current?.();
    }).catch(() => setAudioState("blocked"));
  }

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
      aria-label={enabled ? (audioState === "running" ? "배경음악 끄기" : "배경음악 재생 시작") : "배경음악 켜기"}
      title={enabled ? (audioState === "running" ? "배경음악 끄기" : "배경음악 재생 시작") : "배경음악 켜기"}
    >
      {enabled && audioState === "running" ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{enabled ? (audioState === "running" ? mode.label : audioState === "unsupported" ? "미지원" : "소리 시작") : "꺼짐"}</span>
    </button>
  );
}
