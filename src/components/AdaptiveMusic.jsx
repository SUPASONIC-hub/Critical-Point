import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";

const MUSIC_PREF_KEY = "critical-point-music-enabled";

const musicModes = {
  intro: {
    label: "대기",
    interval: 860,
    volume: 0.12,
    wave: "sine",
    bass: [55, 55, 65.4, 49],
    notes: [220, null, 277.18, null, 196, 246.94, null, 164.81],
    chords: [[110, 164.81, 220], null, [98, 146.83, 196], null],
    hitEvery: 0,
    noiseEvery: 12,
  },
  controlled: {
    label: "안정",
    interval: 720,
    volume: 0.14,
    wave: "triangle",
    bass: [65.4, 73.42, 82.41, 73.42],
    notes: [261.63, null, 329.63, 392, null, 293.66, 349.23, null],
    chords: [[130.81, 196, 261.63], null, [146.83, 220, 293.66], null],
    hitEvery: 8,
    noiseEvery: 16,
  },
  unstable: {
    label: "불안정",
    interval: 520,
    volume: 0.16,
    wave: "triangle",
    bass: [73.42, 69.3, 82.41, 65.4],
    notes: [293.66, 311.13, null, 392, 349.23, null, 329.63, 277.18],
    chords: [[146.83, 220, 311.13], null, [138.59, 207.65, 277.18], null],
    hitEvery: 6,
    noiseEvery: 10,
  },
  critical: {
    label: "위기",
    interval: 360,
    volume: 0.19,
    wave: "sawtooth",
    bass: [49, 51.91, 55, 46.25],
    notes: [196, 207.65, null, 233.08, 246.94, null, 220, 207.65],
    chords: [[98, 146.83, 207.65], [92.5, 138.59, 196], null, [103.83, 155.56, 220]],
    hitEvery: 4,
    noiseEvery: 6,
  },
  result: {
    label: "결과",
    interval: 940,
    volume: 0.13,
    wave: "sine",
    bass: [65.4, 82.41, 98, 73.42],
    notes: [261.63, null, 392, 329.63, null, 440, 392, null],
    chords: [[130.81, 196, 261.63], [164.81, 246.94, 329.63], null, [146.83, 220, 293.66]],
    hitEvery: 0,
    noiseEvery: 18,
  },
};

function playTone(context, destination, frequency, duration, gainValue, type = "sine") {
  if (!frequency) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

function playChord(context, destination, frequencies = [], duration = 1, gainValue = 0.06, type = "sine") {
  frequencies.filter(Boolean).forEach((frequency, index) => {
    playTone(context, destination, frequency, duration + index * 0.04, gainValue / Math.max(1, frequencies.length), type);
  });
}

function playNoiseHit(context, destination, duration = 0.18, gainValue = 0.08, filterFrequency = 900) {
  const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / sampleCount);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFrequency, now);
  filter.Q.setValueAtTime(4, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + duration + 0.02);
}

export function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => readStoredValue(MUSIC_PREF_KEY, "true") !== "false");
  const [audioState, setAudioState] = useState("starting");
  const contextRef = useRef(null);
  const masterGainRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const pulseRef = useRef(null);
  const resumeRef = useRef(null);
  const modeRef = useRef(musicModes[modeKey] ?? musicModes.intro);
  const mode = musicModes[modeKey] ?? musicModes.intro;

  useEffect(() => {
    modeRef.current = mode;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(mode.volume, contextRef.current.currentTime, 0.35);
    }
  }, [mode]);

  useEffect(() => {
    writeStoredValue(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setAudioState("off");
      masterGainRef.current?.gain.setTargetAtTime(0.0001, contextRef.current?.currentTime ?? 0, 0.08);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setAudioState("unsupported");
      return;
    }
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = modeRef.current.volume;
      masterGainRef.current.connect(context.destination);
    }

    function pulse() {
      if (context.state === "suspended") return;
      const currentMode = modeRef.current;
      const step = stepRef.current;
      const note = currentMode.notes[step % currentMode.notes.length];
      const bass = currentMode.bass[Math.floor(step / 4) % currentMode.bass.length];
      const chord = currentMode.chords[Math.floor(step / 4) % currentMode.chords.length];
      playTone(context, masterGainRef.current, note, currentMode.interval / 1200, 0.3, currentMode.wave);
      if (step % 4 === 0) {
        playTone(context, masterGainRef.current, bass, currentMode.interval / 650, 0.2, "sine");
        playChord(context, masterGainRef.current, chord ?? [], currentMode.interval / 420, 0.16, "triangle");
      }
      if (currentMode.hitEvery > 0 && step % currentMode.hitEvery === 0) {
        playTone(context, masterGainRef.current, bass * 2, 0.08, 0.08, "square");
      }
      if (currentMode.noiseEvery > 0 && step % currentMode.noiseEvery === 0) {
        playNoiseHit(context, masterGainRef.current, 0.12, currentMode.volume * 0.45, 700 + step % 5 * 180);
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
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setAudioState("unsupported");
      return;
    }
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = modeRef.current.volume;
      masterGainRef.current.connect(context.destination);
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
