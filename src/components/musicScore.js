import { chapterMotifs, groovePresets, musicModes, originMotifs, speakerMotifs } from "./musicData.js";

/**
 * What the score plays, without the audio graph: a scene's mode, which lead a
 * bar takes, and which of the stake's layers are in. AdaptiveMusic.jsx strikes
 * what these return; nothing here touches Web Audio, so the arrangement can be
 * held without a browser (tests/unit/music-score.test.mjs).
 */
export const STEPS_PER_BAR = 16;
/** How long one lead holds before the next takes the bar: long enough to be heard as a tune. */
export const BARS_PER_PHRASE = 4;

/**
 * The stake's layers, as the gauge the table shows (0-100). The pot doubles
 * every 11 points (`getMultiplier`), so these are x4.8, x17 and x60: a pot
 * worth looking at, a pot worth losing, and a pot inside the band. The wall
 * never moves them -- only what is drawn does -- so the score tells the ear
 * nothing the eye has not been told.
 */
export const STAKE_LAYER_GAUGES = [25, 45, 65];

export function hashMusicKey(value = "") {
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

/** The latest entry at or before `step`, wrapping into the bar before. */
function heldAt(line, step) {
  for (let back = 0; back < line.length; back += 1) {
    const item = line[(step - back + line.length) % line.length];
    if (item) return item;
  }
  return null;
}

/**
 * The first layer: the pad's chord broken upward, an octave over the pad, on
 * the off-beat eighths. Built from the chord sounding on that step, so it
 * follows every mode's harmony without a line of its own.
 */
export function counterLine(pad) {
  return pad.map((_, step) => {
    if (step % 4 !== 2) return null;
    const chord = heldAt(pad, step);
    return chord ? chord[Math.floor(step / 4) % chord.length] * 2 : null;
  });
}

/** The second layer: the bass an octave up, every eighth -- the floor starting to run. */
export function pulseLine(bass) {
  return bass.map((_, step) => {
    if (step % 2 !== 0) return null;
    const note = heldAt(bass, step);
    return note ? note * 2 : null;
  });
}

/** The third layer: the bar's lead a step late and an octave up, a shadow behind the tune. */
export function shadowNote(lead, step) {
  const note = lead[(step - 1 + lead.length) % lead.length];
  return note ? note * 2 : null;
}

/** How many of the stake's layers are in at this gauge: 0 to 3. */
export function stakeLayerCount(gauge) {
  const value = Number(gauge) || 0;
  return STAKE_LAYER_GAUGES.filter((threshold) => value >= threshold).length;
}

/**
 * The lead a bar plays. Each scene starts on a lead of its own (`leadOffset`,
 * from the scene's key) and the leads take turns every `BARS_PER_PHRASE`
 * bars, in order, so the same scene at the same bar always plays the same
 * tune.
 */
export function leadForBar(mode, bar) {
  const { leads } = mode;
  const phrase = Math.floor(Math.max(0, bar) / BARS_PER_PHRASE);
  return leads[(phrase + mode.leadOffset) % leads.length];
}

export function createSceneMode(modeKey, mixVolume = 1) {
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
  const bass = shiftPattern(base.bass, transpose);
  const pad = shiftPattern(base.pad, transpose);

  return {
    label: base.label,
    interval: Math.max(96, Math.round(base.stepMs * tempo)),
    volume: Math.min(0.14, base.volume * mixVolume * (0.82 + intensity * 0.16 + scenePulse * 0.012)),
    wave: speakerMotif.wave ?? base.wave,
    drive: Math.min(0.9, base.drive * intensity),
    kick: rotate(base.kick, groove.kickShift),
    snare: base.snare,
    hat: thinOut(base.hat, groove.hatDrop),
    bass,
    leads: base.leads.map((lead) => rotate(shiftPattern(lead, transpose), groove.leadShift)),
    // Not the hash's low digits: those already pick the tempo, and the
    // key would start most scenes of one tempo on the same lead.
    leadOffset: Math.floor(hash / 42) % base.leads.length,
    pad,
    counter: counterLine(pad),
    pulse: pulseLine(bass),
    noiseEvery: base.noiseEvery,
    detuneSpread: 3 + (hash % 11),
    impact: intensity,
    filterLift: motif.lift + (hash % 5) * 140,
  };
}
