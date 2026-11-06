import { isResourceGain } from "../gameConstants.js";
import { chapterMotifs, groovePresets, musicModes, originMotifs, revealTracks, speakerMotifs } from "./musicData.js";

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
 * The stake's layers, as the gauge the table shows (0-100): x4.8, x17 and x60,
 * a pot worth looking at, worth losing, inside the band. They live in
 * gauntlet/stakeLayers.js since 2026-11-05, when the clock began to read the
 * same three (gauntlet/stakeClock.js): the ear and the eye are told the same
 * stake at the same heat.
 */
export { STAKE_LAYER_GAUGES, stakeLayerCount } from "../gauntlet/stakeLayers.js";

/**
 * The bus's tone (11-02 playtest, earphones: "the sound feels torn, like an
 * old radio"). The most drive any scene gets, after the chapter's and the
 * speaker's push, and the cutoff of the lowpass every voice passes. The
 * cutoff was 4200 Hz, which with the drive at 0.62 was the old radio itself:
 * clipped, then muffled. The waves are unchanged, so the 8-bit colour is.
 */
export const DRIVE_CEILING = 0.15;
export const BUS_LOWPASS_HZ = 7000;

/**
 * The scene's mood (design-mood, 2026-11-05): one of five, `neutral` when a
 * scene names none or names one the score does not know. A mood picks which
 * of the mode's leads take the bar (`moodLeads`) and how the table's drone is
 * voiced (gauntlet/tensionDrone.js), and since 2026-11-06 how loud each part
 * plays and where the lead sits (`MOOD_TEXTURES`); the key, the tempo and the
 * drive are the scene's as before. `tense` is the score exactly as it was.
 */
export const MUSIC_MOODS = ["neutral", "bright", "tense", "dread", "sorrow"];
export const DEFAULT_MOOD = "neutral";
/** A mood change crosses over this long: the old lead's notes fade as the new lead's rise, note by note. */
export const MOOD_FADE_SECONDS = 5;

export function normalizeMood(value) {
  return MUSIC_MOODS.includes(value) ? value : DEFAULT_MOOD;
}

/**
 * The mood the table last set (`setMusicMood`) and the one before it, with
 * the clock time of the change, so the score can play both leads for
 * `MOOD_FADE_SECONDS` and weigh each note by how far the change has come.
 * Nothing that is already sounding is touched: a note is a fresh oscillator
 * with its own envelope, so the crossfade is a choice of gain per note.
 */
const moodRuntime = { mood: DEFAULT_MOOD, previous: null, changedAt: -Infinity };

export function setMusicMood(mood, now = -Infinity) {
  const next = normalizeMood(mood);
  if (next === moodRuntime.mood) return next;
  moodRuntime.previous = moodRuntime.mood;
  moodRuntime.mood = next;
  moodRuntime.changedAt = now;
  return next;
}

export function getMusicMood() {
  return moodRuntime.mood;
}

/** The leads to play at `now`: the mood coming in, the one going out while `blend` is under 1. */
export function moodCrossfade(now) {
  const blend = Math.min(1, Math.max(0, (now - moodRuntime.changedAt) / MOOD_FADE_SECONDS));
  return { to: moodRuntime.mood, from: blend < 1 ? moodRuntime.previous : null, blend };
}

/**
 * What a mood does to the whole bar, not only to which lead plays (mood-boost,
 * 2026-11-06: the leads alone could not be heard as a change). Each part's
 * share of its own gain, never above 1, so a mood only ever takes away from
 * what reaches the bus and its drive (#388); `octave` is the lead's register
 * (each note is struck there, nothing sounding is retuned) and `every` plays
 * one lead step in that many.
 *
 * - tense: the score as it was.
 * - neutral: sparse and low -- no snare, hats and kick down, the lead an
 *   octave under on every other step.
 * - bright: light on its feet -- hats whole, snare and kick soft, the lead an
 *   octave up (only where it stays under LEAD_OCTAVE_CEILING_HZ).
 * - sorrow: no drums but a breath of hat; the slow minor lead over the pad.
 * - dread: the kick and the noise sweep whole, the hats nearly gone, the lead
 *   an octave down.
 */
export const MOOD_TEXTURES = {
  tense: { kick: 1, snare: 1, hat: 1, bass: 1, lead: 1, pad: 1, noise: 1, octave: 1, every: 1 },
  neutral: { kick: 0.5, snare: 0, hat: 0.35, bass: 0.8, lead: 0.8, pad: 1, noise: 0, octave: 0.5, every: 2 },
  bright: { kick: 0.55, snare: 0.35, hat: 1, bass: 0.75, lead: 0.9, pad: 0.8, noise: 0.3, octave: 2, every: 1 },
  sorrow: { kick: 0, snare: 0, hat: 0.2, bass: 0.7, lead: 1, pad: 1, noise: 0, octave: 1, every: 1 },
  dread: { kick: 1, snare: 0.2, hat: 0.15, bass: 1, lead: 0.8, pad: 0.6, noise: 1, octave: 0.5, every: 1 },
};
/** A lead note doubled for bright stays at or under this, so the octave up never turns shrill in earphones. */
export const LEAD_OCTAVE_CEILING_HZ = 1400;

export function moodTexture(mood) {
  return MOOD_TEXTURES[normalizeMood(mood)];
}

/**
 * The drums', bass's, pad's and noise's shares at a point in a crossfade: the
 * two moods' textures weighed by `blend`, so a change walks each share over
 * `MOOD_FADE_SECONDS` instead of stepping it.
 */
export function blendedTexture({ to, from, blend }) {
  const next = moodTexture(to);
  if (!from || blend >= 1) return next;
  const prev = moodTexture(from);
  const mixed = {};
  for (const key of ["kick", "snare", "hat", "bass", "pad", "noise"]) mixed[key] = prev[key] + (next[key] - prev[key]) * blend;
  return mixed;
}

/** The lead note a mood strikes on a step: null on a step it rests, else the note in its register. */
export function moodLeadNote(line, step, mood) {
  const note = line[step];
  if (!note) return null;
  const { octave, every } = moodTexture(mood);
  if (every > 1 && step % every !== 0) return null;
  if (octave > 1 && note * octave > LEAD_OCTAVE_CEILING_HZ) return note;
  return note * octave;
}

/**
 * How a mode's drive is mixed in. The bus keeps one soft-clip curve, built
 * once at `DRIVE_CEILING`, and crossfades between the dry signal and the
 * clipped one: swapping the WaveShaper's curve on a scene change jumped the
 * wave mid-note. The wet path is trimmed by the curve's small-signal gain
 * (1 + 60 x ceiling), so dry and wet sit at one level and only the peaks
 * round off -- the old curve also pushed the whole signal up to 38 times
 * into the compressor.
 */
export function driveMix(drive) {
  const wet = Math.min(1, Math.max(0, (Number(drive) || 0) / DRIVE_CEILING));
  return { dry: Number((1 - wet).toFixed(4)), wet: Number((wet / (1 + DRIVE_CEILING * 60)).toFixed(4)) };
}

/**
 * The lead's per-note lowpass. A sawtooth or a square carries every harmonic,
 * so with the bus opened to 7 kHz they are held lower than a triangle or a
 * sine, which have little up there to lose.
 */
export function leadFilterFrequency(mode) {
  const lift = mode.filterLift ?? 0;
  if (mode.wave === "sawtooth") return Math.min(2200, 1200 + lift * 0.6);
  if (mode.wave === "square") return Math.min(2400, 1300 + lift * 0.7);
  return 1500 + lift;
}

/**
 * Which of the reveal's three tracks a choice gets (`revealTracks`,
 * musicData.js), from the numbers the sheet prints under 받은 것 and 치른
 * 것: the effect's gains and its costs, each summed by size.
 *
 * - BUST: 많이 치름 (`cost`), whatever the card was -- a bust keeps every
 *   cost and none of the gains.
 * - received at least twice what was paid, and 5 or more over it: 많이 받음 (`gain`).
 * - paid at least twice what was received, and 5 or more over it: 많이 치름 (`cost`).
 * - anything else: 비슷함 (`even`).
 *
 * Twice and 5 points: of the season's cards as written (before the heat
 * multiplies the gains) about one in seven is received-much and one in fifty
 * paid-much (the busts add the rest), and a single +3 or a +4 / -3 trade
 * stays even, so the bright track is for a choice that clearly paid.
 */
export const REVEAL_OUTCOME_RATIO = 2;
export const REVEAL_OUTCOME_MARGIN = 5;

export function revealOutcome(effect, { busted = false } = {}) {
  if (busted) return "cost";
  let received = 0;
  let paid = 0;
  for (const [key, value] of Object.entries(effect ?? {})) {
    const amount = Number(value);
    if (!amount) continue;
    if (isResourceGain(key, amount)) received += Math.abs(amount);
    else paid += Math.abs(amount);
  }
  if (received >= paid * REVEAL_OUTCOME_RATIO && received - paid >= REVEAL_OUTCOME_MARGIN) return "gain";
  if (paid >= received * REVEAL_OUTCOME_RATIO && paid - received >= REVEAL_OUTCOME_MARGIN) return "cost";
  return "even";
}

/** A reveal track as a mode: as written, with nothing taken from a scene -- the mood included. */
function revealMode(track, mixVolume) {
  return {
    label: track.label,
    interval: track.stepMs,
    volume: Math.min(0.14, track.volume * mixVolume),
    wave: track.wave,
    drive: Math.min(DRIVE_CEILING, track.drive),
    kick: track.kick,
    snare: track.snare,
    hat: track.hat,
    bass: track.bass,
    leads: track.leads,
    sorrowLead: track.leads[0],
    leadOffset: 0,
    pad: track.pad,
    counter: counterLine(track.pad),
    pulse: pulseLine(track.bass),
    noiseEvery: track.noiseEvery,
    detuneSpread: 4,
    impact: 1,
    filterLift: 200,
  };
}

export function hashMusicKey(value = "") {
  return String(value).split("").reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0);
}

/** The pitch class of a frequency, 0-11 with A as 0. */
function pitchClass(frequency) {
  return ((Math.round(12 * Math.log2(frequency / 440)) % 12) + 12) % 12;
}

/**
 * The semitones that carry the reveal's 많이 치름 lead (A minor, falling;
 * `revealTracks.cost`) into a mode's minor: the mode's own root when its
 * third is minor or not sounded, the relative minor when it is major -- so
 * the sorrow lead's notes are the mode's scale, never a key of its own.
 * Folded into -7..4, so the line sits at or under the mode's own leads --
 * a fourth down for unstable's D rather than a fourth up.
 */
function sorrowShift(base) {
  const root = pitchClass(base.pad.find(Boolean)[0]);
  const sounded = new Set([...base.bass, ...base.leads.flat()].filter(Boolean).map(pitchClass));
  const major = sounded.has((root + 4) % 12) && !sounded.has((root + 3) % 12);
  const minorRoot = major ? (root + 9) % 12 : root;
  return minorRoot > 4 ? minorRoot - 12 : minorRoot;
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

/**
 * The lead a bar plays. Each scene starts on a lead of its own (`leadOffset`,
 * from the scene's key) and the leads take turns every `BARS_PER_PHRASE`
 * bars, in order, so the same scene at the same bar always plays the same
 * tune.
 */
export function leadForBar(mode, bar, leads = mode.leads) {
  const phrase = Math.floor(Math.max(0, bar) / BARS_PER_PHRASE);
  return leads[(phrase + mode.leadOffset) % leads.length];
}

const noteCount = (lead) => lead.filter(Boolean).length;
/** The mean of the notes' log-pitch: where the lead sits. */
function register(lead) {
  let sum = 0;
  let notes = 0;
  for (const frequency of lead) {
    if (!frequency) continue;
    sum += Math.log2(frequency);
    notes += 1;
  }
  return notes ? sum / notes : 0;
}

/**
 * The leads a mood lets take turns, from the mode's own four (musicData.js):
 *
 * - tense: all of them, in the mode's order -- the score as it was.
 * - bright: the two lightest -- fewest notes, then the higher.
 * - dread: the two lowest in register.
 * - neutral: the two in the middle of the register, in the mode's order.
 * - sorrow: one lead, the reveal's 많이 치름 line carried into the mode's
 *   minor (`sorrowShift`); it holds, as the reveal's does.
 *
 * A reveal track has one lead and every mood plays it. The arrays are the
 * mode's own, so a caller can tell two moods' choices apart by identity.
 */
export function moodLeads(mode, mood) {
  const key = normalizeMood(mood);
  const { leads } = mode;
  if (key === "sorrow") return [mode.sorrowLead ?? leads[0]];
  if (key === "tense" || leads.length < 3) return leads;
  const byRegister = [...leads].sort((a, b) => register(a) - register(b) || noteCount(b) - noteCount(a));
  if (key === "dread") return byRegister.slice(0, 2);
  if (key === "bright") return [...leads].sort((a, b) => noteCount(a) - noteCount(b) || register(b) - register(a)).slice(0, 2);
  const middle = byRegister.slice(1, -1);
  return leads.filter((lead) => middle.includes(lead));
}

/** The lead a bar plays under a mood: `leadForBar` over `moodLeads`, so tense is bar for bar what it was. */
export function moodLeadForBar(mode, bar, mood) {
  return leadForBar(mode, bar, moodLeads(mode, mood));
}

export function createSceneMode(modeKey, mixVolume = 1) {
  const parts = String(modeKey || "intro").split(":");
  // `reveal:gain` / `reveal:even` / `reveal:cost`: fixed, whatever scene is behind the sheet.
  if (parts[0] === "reveal") return revealMode(revealTracks[parts[1]] ?? revealTracks.even, mixVolume);
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
    drive: Math.min(DRIVE_CEILING, base.drive * intensity),
    kick: rotate(base.kick, groove.kickShift),
    snare: base.snare,
    hat: thinOut(base.hat, groove.hatDrop),
    bass,
    leads: base.leads.map((lead) => rotate(shiftPattern(lead, transpose), groove.leadShift)),
    sorrowLead: shiftPattern(revealTracks.cost.leads[0], sorrowShift(base) + transpose),
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
