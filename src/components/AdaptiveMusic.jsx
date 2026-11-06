import { useEffect, useMemo, useRef, useState } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { readStoredValue, writeStoredValue } from "../appConfig.js";
import musicCopy from "../copy/music.js";
import { fill } from "../locale.js";
import { currentMood, onMoodChange } from "../mood.js";
import {
  BUS_LOWPASS_HZ,
  createSceneMode as scoreSceneMode,
  DRIVE_CEILING,
  driveMix,
  leadFilterFrequency,
  moodCrossfade,
  moodLeadForBar,
  setMusicMood as setMood,
  shadowNote,
  stakeLayerCount,
  STEPS_PER_BAR,
} from "./musicScore.js";
export { getMusicMood, MUSIC_MOODS } from "./musicScore.js";
import { createMusicLimiter, MUSIC_LIMITER_ON, routeMaster } from "./musicLimiter.js";
const MUSIC_PREF_KEY = "critical-point-music-enabled";
const MUSIC_VOLUME_KEY = "critical-point-music-volume";
const MIX_VOLUME = 0.74;
// The kick is the only percussive voice with weight now; the hats are room
// noise, not a hi-hat line, so they sit well under the pad.
const KICK_GAIN = 0.2;
const SNARE_GAIN = 0.1;
const HAT_GAIN = 0.022;
const BASS_GAIN = 0.08;
const LEAD_GAIN = 0.045;
const PAD_GAIN = 0.045;
// The stake's layers sit under the lead, each quieter than the one before it:
// they thicken the room, the tune stays on top.
const COUNTER_GAIN = 0.026;
const PULSE_GAIN = 0.02;
const SHADOW_GAIN = 0.014;
const createSceneMode = (modeKey) => scoreSceneMode(modeKey, MIX_VOLUME);
const volumePresets = {
  low: { label: "LOW", multiplier: 0.58 },
  normal: { label: "NORMAL", multiplier: 0.82 },
  high: { label: "HIGH", multiplier: 1 },
};
const volumePresetOrder = Object.keys(volumePresets);

function normalizeVolumePreset(value) {
  return Object.hasOwn(volumePresets, value) ? value : "normal";
}

/**
 * The two sound preferences, read where every cue reads them.
 *
 * They live in storage so the choice outlasts the page, and every cue reads
 * them there rather than from the component, which a cue cannot see. But
 * storage can refuse a write -- a full quota, a browser that blocks it -- and
 * the app plays on in that state. The write was never checked, so 배경음 끄기
 * silenced the score and nothing else: the heartbeat, the drone and the cues
 * read "on" back from storage, and the next screen's mount turned the score
 * back on too. A value storage would not take is kept here for the session,
 * and is dropped the moment a write goes through, so two tabs still agree
 * through storage whenever storage works.
 */
const unsavedPrefs = new Map();

function readPref(key, fallback) {
  return unsavedPrefs.get(key) ?? readStoredValue(key, fallback);
}

function writePref(key, value) {
  if (writeStoredValue(key, value)) unsavedPrefs.delete(key);
  else unsavedPrefs.set(key, value);
}

const soundOff = () => readPref(MUSIC_PREF_KEY, "true") === "false";
const presetMultiplier = () => volumePresets[normalizeVolumePreset(readPref(MUSIC_VOLUME_KEY, "normal"))].multiplier;

/** Soft-clip curve; `amount` 0 leaves the signal alone. Built once, at `DRIVE_CEILING` (driveMix, musicScore.js). */
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
  const dry = context.createGain();
  const wet = context.createGain();
  const lowpass = context.createBiquadFilter();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const echo = context.createGain();
  const compressor = context.createDynamicsCompressor();

  // One curve for the life of the bus; a mode's drive is the dry/wet mix.
  shaper.curve = makeDriveCurve(DRIVE_CEILING);
  const mix = driveMix(0);
  dry.gain.value = mix.dry;
  wet.gain.value = mix.wet;
  shaper.oversample = "2x";
  lowpass.type = "lowpass";
  lowpass.frequency.value = BUS_LOWPASS_HZ;
  lowpass.Q.value = 0.7;
  delay.delayTime.value = 0.18;
  feedback.gain.value = 0.1;
  echo.gain.value = 0.08;
  compressor.threshold.value = -20;
  compressor.knee.value = 20;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.24;

  input.connect(dry);
  dry.connect(lowpass);
  input.connect(shaper);
  shaper.connect(wet);
  wet.connect(lowpass);
  lowpass.connect(compressor);
  lowpass.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(echo);
  echo.connect(compressor);
  compressor.connect(output);
  // `clean` is the bus past the drive: the stake's layers enter there, since
  // in the driven modes a standing voice summed into the shaper crackled.
  return { input, drive: { dry, wet }, clean: lowpass };
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
const audioRuntime = { context: null, master: null, limiter: null, limiterOn: MUSIC_LIMITER_ON, bus: null, drive: null, clean: null };

/**
 * A hidden tab is silent. The score's interval and the table's drone kept
 * sounding from a background tab -- the drone is a set of running
 * oscillators, not a scheduled cue, so nothing about the page being hidden
 * stopped it. The one shared context is suspended while the page is hidden,
 * which stops every voice on it at once, and resumed when it is shown again
 * unless the player has muted in the meantime. Installed once, with the
 * context.
 */
function followPageVisibility(context) {
  if (typeof document === "undefined") return;
  let suspendedForHidden = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (context.state !== "running") return;
      suspendedForHidden = true;
      Promise.resolve(context.suspend?.()).catch(() => {});
      return;
    }
    if (!suspendedForHidden) return;
    suspendedForHidden = false;
    if (soundOff()) return;
    Promise.resolve(context.resume?.()).catch(() => {});
  });
}

function ensureAudioRuntime(volume) {
  if (!audioRuntime.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioRuntime.context = new AudioContextClass();
    followPageVisibility(audioRuntime.context);
  }
  const context = audioRuntime.context;
  if (!audioRuntime.master) {
    audioRuntime.master = context.createGain();
    audioRuntime.master.gain.value = volume;
    audioRuntime.limiter = createMusicLimiter(context);
    routeMaster(context, audioRuntime.master, audioRuntime.limiter, audioRuntime.limiterOn);
  }
  if (!audioRuntime.bus) {
    const bus = connectMusicBus(context, audioRuntime.master);
    audioRuntime.bus = bus.input;
    audioRuntime.drive = bus.drive;
    audioRuntime.clean = bus.clean;
  }
  return context;
}

/** The bus's drive to a mode's: ramped, never set, so a scene change moves the mix over about half a second. */
function rampDrive(drive) {
  if (!audioRuntime.drive || !audioRuntime.context) return;
  const { dry, wet } = driveMix(drive);
  const now = audioRuntime.context.currentTime;
  audioRuntime.drive.dry.gain.setTargetAtTime(dry, now, 0.15);
  audioRuntime.drive.wet.gain.setTargetAtTime(wet, now, 0.15);
}

/**
 * One standing voice of the stake's layers: an oscillator that keeps running
 * and is retuned and re-enveloped on each note. The score's own voices build
 * three nodes a note and drop them; the layers would have added up to three
 * more notes a step on top of that, so they reuse what they built instead.
 */
function createLayerVoice(context, destination, type, filterFrequency) {
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  oscillator.type = type;
  filter.type = "lowpass";
  filter.frequency.value = filterFrequency;
  gain.gain.value = 0.0001;
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start();
  return {
    play(frequency, duration, peak) {
      // The last note is usually still ringing, and retuning a sounding
      // oscillator jumps its wave: a click a note. So the old note is pulled
      // down first (setTargetAtTime starts from wherever the gain is, which
      // `gain.value` does not report everywhere), and the new pitch lands once
      // it is all but silent.
      const now = context.currentTime;
      const start = now + 0.012;
      const level = gain.gain;
      level.cancelScheduledValues(now);
      level.setTargetAtTime(0.0001, now, 0.003);
      oscillator.frequency.setValueAtTime(frequency, start);
      level.setValueAtTime(0.0001, start);
      level.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + 0.012);
      level.setTargetAtTime(0.0001, start + duration, duration * 0.35);
    },
    stop() {
      const now = context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0.0001, now, 0.06);
      oscillator.stop(now + 0.4);
    },
  };
}

/**
 * The stake, as the table last reported it (`setMusicStake`), and the layers
 * it has brought in. The voices are built the first time the stake reaches a
 * layer and stopped once it falls back to none -- a window closing, the sound
 * turned off -- so a page between tables runs no idle oscillators.
 */
const stakeRuntime = { gauge: 0, voices: null };

/**
 * What the table tells the score: the gauge it shows, 0 when no window is live.
 * Read on the score's next step; a stake that never arrives leaves the score
 * as it was.
 */
export function setMusicStake(gauge = 0) {
  stakeRuntime.gauge = Math.min(100, Math.max(0, Number(gauge) || 0));
}

/**
 * The scene's mood (musicScore.js `MUSIC_MOODS`; unknown or missing is
 * neutral). Read on the score's next step: for `MOOD_FADE_SECONDS` the old
 * mood's lead and the new one both play, each note at its share of the lead's
 * gain, and the table's drone crosses its voicing over the same way
 * (gauntlet/tensionDrone.js). No sounding oscillator is retuned or jumped.
 * Timed on the audio clock; with no context yet nothing is playing, and the
 * change is immediate.
 */
export function setMusicMood(mood) {
  return setMood(mood, audioRuntime.context?.currentTime ?? -Infinity);
}

// The page's mood (src/mood.js) is the score's: the table applies the shown
// scene's mood there (src/state/sceneMood.js), and this subscription, made once
// as the module loads beside the runtime it feeds, carries every change here.
// The mood a table applied before this module woke is read once, so a late
// entry starts in the scene's mood instead of neutral.
onMoodChange(setMusicMood);
setMusicMood(currentMood());

function releaseStakeVoices() {
  if (!stakeRuntime.voices) return;
  for (const voice of stakeRuntime.voices) voice.stop();
  stakeRuntime.voices = null;
}

function stakeVoices(context, destination) {
  stakeRuntime.voices ??= [
    createLayerVoice(context, destination, "triangle", 2200),
    createLayerVoice(context, destination, "triangle", 900),
    createLayerVoice(context, destination, "sine", 3200),
  ];
  return stakeRuntime.voices;
}

const ACCENT_PEAK_GAIN = 0.045;
const REVEAL_PEAK_GAIN = 0.035;

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
    if (soundOff()) return;
    // The start button is the page's first gesture now, and on a slow device it
    // is clickable seconds before AdaptiveMusic's mount effect builds the shared
    // runtime. Building it here rather than bailing keeps the cold open's one
    // confirmation cue on exactly the devices where the burst runs longest. The
    // mute check above still runs first, so a muted player creates no context.
    const context = audioRuntime.context ?? ensureAudioRuntime(0.0001);
    if (!context) return;
    Promise.resolve(context.resume?.()).catch(() => {});

    const multiplier = presetMultiplier();
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

/**
 * The context a cue of this module plays on, or null when it must stay quiet:
 * sound is off, no runtime has been built, or the page is hidden. A hidden
 * page's context is suspended on purpose (`followPageVisibility`), and these
 * two cues used to resume it without looking: a window that settled a second
 * after the player switched tabs opened the reveal behind them, the reveal's
 * cue woke the context, and the score played on from a tab nobody was looking
 * at.
 */
function wakeForCue() {
  if (soundOff()) return null;
  const context = audioRuntime.context;
  if (!context || globalThis.document?.hidden) return null;
  Promise.resolve(context.resume?.()).catch(() => {});
  return context;
}

/**
 * A card staked, a stance changed. Like the opening accent it connects to
 * `destination`: through the music bus it sat under the master's gain, which
 * is the background score's level and already carries the volume preset, so
 * the preset was applied twice and the cue peaked at a tenth of the kick drum.
 */
export function playTargetLockCue() {
  try {
    const context = wakeForCue();
    if (!context) return;

    const peak = ACCENT_PEAK_GAIN * 0.72 * presetMultiplier();
    const now = context.currentTime;
    const destination = context.destination;
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

/** The reveal's chord. Straight to `destination`, as the target lock is. */
export function playDecisionRevealCue(tone = "decision-locked") {
  try {
    const context = wakeForCue();
    if (!context) return;

    const peak = REVEAL_PEAK_GAIN * presetMultiplier();
    const now = context.currentTime;
    const destination = context.destination;
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
 * The gate every cue outside this module has to pass.
 *
 * The five cues above each open with the same three lines -- read the mute
 * preference, read the volume preset, take the shared context -- and for a long
 * time `juiceAudio` was the one cue source that opened with none of them. It
 * built `new AudioContext()` of its own and an oscillator pool inside it, so
 * `배경음 끄기` silenced the score and left the heartbeat, the hover and the
 * commit thud playing over it, and a muted run still opened a second context:
 * the exact thing this shared runtime was introduced to stop.
 *
 * Returning null rather than a muted node graph is the point. A caller that
 * gets null is meant to do nothing at all -- building nodes and setting their
 * gain to zero still costs a context, and a context is what the muted player
 * asked not to have.
 */
/** Whether the player has sound off. For a voice that outlives the cue that started it. */
/** music-lab's A/B switch: the music path through the limiter or around it. */
export function setMusicLimiter(on) {
  audioRuntime.limiterOn = Boolean(on);
  const { context, master, limiter } = audioRuntime;
  if (context && master) routeMaster(context, master, limiter, audioRuntime.limiterOn);
}

export function isSoundMuted() {
  return soundOff();
}

/** The volume preset as it stands now, for the same kind of voice. */
export function getSoundLevel() {
  return presetMultiplier();
}

export function acquireCueRuntime() {
  try {
    if (soundOff()) return null;
    // Deliberately does not build the runtime. `AdaptiveMusic` builds it on
    // mount when the player has sound on, and `playOpeningAccent` builds it for
    // the one gesture that can precede that. A cue firing before either is a
    // cue with no run behind it yet, and it stays silent instead of racing them.
    const context = audioRuntime.context;
    // A hidden page is suspended on purpose (followPageVisibility); a cue that
    // fires then must not wake the context back up behind the player's back.
    if (!context || globalThis.document?.hidden) return null;
    Promise.resolve(context.resume?.()).catch(() => {});
    return {
      context,
      destination: audioRuntime.bus ?? audioRuntime.master ?? context.destination,
      multiplier: presetMultiplier(),
    };
  } catch {
    // Audio is an enhancement; browsers may reject it during a gesture.
    return null;
  }
}

export function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => !soundOff());
  const [volumePreset, setVolumePreset] = useState(() => normalizeVolumePreset(readPref(MUSIC_VOLUME_KEY, "normal")));
  const [audioState, setAudioState] = useState(() => (soundOff() ? "off" : "starting"));
  const timerRef = useRef(null);
  // Set when the effect below has just started the bar, for the one after it.
  const barStartedRef = useRef(false);
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
    rampDrive(mode.drive);
  }, [effectiveVolume, mode]);

  useEffect(() => {
    writePref(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      releaseStakeVoices();
      audioRuntime.master?.gain.setTargetAtTime(0.0001, audioRuntime.context?.currentTime ?? 0, 0.08);
      return undefined;
    }

    const context = ensureAudioRuntime(volumeRef.current);
    // A bus built just now starts dry; this scene's drive comes in from there.
    if (context) rampDrive(modeRef.current.drive);
    if (!context) {
      queueMicrotask(() => setAudioState("unsupported"));
      return undefined;
    }

    function pulse() {
      // Only a running context has a moving clock. iOS adds "interrupted" -- a
      // call, another app's audio -- and a step struck then is scheduled at a
      // `currentTime` that stands still, so every step of the interruption
      // sounded together when it ended.
      if (context.state !== "running") return;
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

      // The mood's lead, and for a few seconds after a mood change the old
      // mood's too, the two sharing the lead's gain note by note (`moodCrossfade`).
      // The sorrow lead is a slow line: its notes ring on into the next.
      const bar = Math.floor(stepRef.current / STEPS_PER_BAR);
      const { to, from, blend } = moodCrossfade(context.currentTime);
      const leadLine = moodLeadForBar(currentMode, bar, to);
      const oldLine = from ? moodLeadForBar(currentMode, bar, from) : null;
      const crossing = oldLine && oldLine !== leadLine;
      const strikeLead = (line, share) => {
        const lead = line[step];
        if (!lead || share <= 0) return;
        const slow = line === currentMode.sorrowLead;
        playTone(context, destination, lead, stepSeconds * (slow ? 3 : 1.8), LEAD_GAIN * share, currentMode.wave, {
          attack: slow ? 0.05 : 0.02,
          release: slow ? 0.4 : 0.24,
          filterFrequency: leadFilterFrequency(currentMode),
          detune: step % 2 === 0 ? -currentMode.detuneSpread : currentMode.detuneSpread,
        });
      };
      strikeLead(leadLine, crossing ? blend : 1);
      if (crossing) strikeLead(oldLine, 1 - blend);

      const pad = currentMode.pad[step];
      if (pad) {
        playChord(context, destination, pad, stepSeconds * 6, PAD_GAIN, "sine");
      }

      // The stake's layers, one more for each threshold the table's gauge has
      // crossed: the pad's chord broken upward, then the bass running in
      // eighths, then a shadow of the lead an octave over it.
      const layers = stakeLayerCount(stakeRuntime.gauge);
      if (!layers) releaseStakeVoices();
      else {
        const [counterVoice, pulseVoice, shadowVoice] = stakeVoices(context, audioRuntime.clean ?? destination);
        const counter = currentMode.counter[step];
        if (counter) counterVoice.play(counter, stepSeconds * 1.6, COUNTER_GAIN);
        const pulseNote = layers >= 2 && currentMode.pulse[step];
        if (pulseNote) pulseVoice.play(pulseNote, stepSeconds * 0.7, PULSE_GAIN);
        const shadow = layers >= 3 && shadowNote(leadLine, step);
        if (shadow) shadowVoice.play(shadow, stepSeconds * 0.9, SHADOW_GAIN);
      }

      if (currentMode.noiseEvery > 0 && stepRef.current % currentMode.noiseEvery === 0) {
        playNoiseSweep(context, destination, 0.55, currentMode.volume * 0.12 * impact, 760 + currentMode.filterLift);
      }

      stepRef.current += 1;
    }

    pulseRef.current = pulse;

    // Browsers start a context suspended until the page has had a gesture, so
    // the first input anywhere unblocks it. These listeners come off the
    // moment the context runs: left on, every tap called resume() on a running
    // context and struck an extra step off the grid (two per tap, pointerdown
    // and touchstart) and re-rendered the controls.
    const unblockEvents = ["pointerdown", "keydown", "touchstart"];
    function detachUnblockers() {
      for (const type of unblockEvents) window.removeEventListener(type, resumeAfterAutoplayBlock);
    }
    // Set by a call that found the context stopped, cleared by the one that
    // strikes the step. A browser may hold `resume()` open until the page has
    // had a gesture, and the first tap is two events (pointerdown and
    // touchstart): the call made at mount and one for each event all found it
    // stopped, and when it started each struck the step it had been waiting
    // to strike. Every call still asks -- the one inside the gesture is the
    // one a browser honours -- and one of them answers.
    let entering = false;
    async function resumeAudio() {
      if (context.state !== "running") entering = true;
      try {
        await context.resume?.();
      } catch (error) {
        console.warn("Audio resume blocked", error);
        setAudioState("blocked");
        return;
      }
      const running = context.state === "running";
      setAudioState(running ? "running" : "blocked");
      if (!running) return;
      detachUnblockers();
      // A step only for the transition into sound. The interval already
      // carries the bar while the context runs.
      if (!entering) return;
      entering = false;
      pulse();
    }
    function resumeAfterAutoplayBlock() {
      if (document.hidden) return;
      resumeAudio();
    }

    resumeRef.current = resumeAudio;
    context.onstatechange = () => {
      setAudioState(context.state === "running" ? "running" : context.state === "closed" ? "off" : "blocked");
    };

    if (context.state !== "running") {
      window.addEventListener("pointerdown", resumeAfterAutoplayBlock, { passive: true });
      window.addEventListener("keydown", resumeAfterAutoplayBlock);
      window.addEventListener("touchstart", resumeAfterAutoplayBlock, { passive: true });
    }

    audioRuntime.master.gain.setTargetAtTime(volumeRef.current, context.currentTime, 0.2);
    // A context that is already running (the score carried over from the last
    // screen) plays the first step now; a suspended one plays it when it resumes.
    if (context.state === "running") {
      pulse();
      queueMicrotask(() => setAudioState("running"));
    } else if (!document.hidden) {
      resumeAudio();
    }
    timerRef.current = window.setInterval(pulse, modeRef.current.interval);
    barStartedRef.current = true;
    return () => {
      window.clearInterval(timerRef.current);
      detachUnblockers();
      if (pulseRef.current === pulse) pulseRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    // The effect above started the bar in this same commit -- a mount, which is
    // every screen change, or sound turned back on. Restarting it here struck
    // step 0 a second time at the same instant: the kick, the bass and the pad
    // doubled at every seam the shared context exists to make seamless.
    const barJustStarted = barStartedRef.current;
    barStartedRef.current = false;
    if (barJustStarted) return;
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
    writePref(MUSIC_VOLUME_KEY, nextPreset);
  }

  const toggleLabel =
    audioState === "unsupported"
      ? musicCopy.unsupported
      : !enabled
        ? musicCopy.turnOn
        : audioState === "running"
          ? musicCopy.turnOff
          : musicCopy.resume;
  // Playing, the button shows the mode; its name starts with that (WCAG 2.5.3).
  const playing = enabled && audioState === "running";
  const toggleName = playing ? `${mode.label} ${toggleLabel}` : toggleLabel;

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
        aria-label={toggleName}
        title={toggleLabel}
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span>{playing ? mode.label : toggleLabel}</span>
      </button>
      {enabled && audioState !== "unsupported" && (
        <button
          type="button"
          className="music-volume-toggle"
          onClick={cycleVolumePreset}
          aria-label={fill(musicCopy.volumeLevel, { level: volumePresets[volumePreset].label })}
          title={musicCopy.volume}
        >
          <Volume1 size={16} />
          <span>{volumePresets[volumePreset].label}</span>
        </button>
      )}
    </div>
  );
}
