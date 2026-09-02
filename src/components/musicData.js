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

export const musicModes = {
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

export const chapterMotifs = {
  case01: { wave: "sine", lift: 80, impact: 0.94 },
  case02: { wave: "triangle", lift: 360, impact: 1.04 },
  case03: { wave: "sawtooth", lift: 620, impact: 1.12 },
  case04: { wave: "square", lift: 220, impact: 1.18 },
  case05: { wave: "triangle", lift: 480, impact: 1.24 },
  final: { wave: "sawtooth", lift: 760, impact: 1.32 },
};

export const speakerMotifs = {
  "한서윤": { wave: "sine", semitones: 0, pulse: 0.94 },
  "반재욱": { wave: "triangle", semitones: -2, pulse: 1.04 },
  "도윤하": { wave: "sine", semitones: 3, pulse: 1.08 },
  "오진우": { wave: "sawtooth", semitones: -5, pulse: 1.14 },
  "에코": { wave: "square", semitones: 7, pulse: 0.9 },
  "반재현": { wave: "sawtooth", semitones: -7, pulse: 1.18 },
  "윤서": { wave: "triangle", semitones: 5, pulse: 0.96 },
};

export const originMotifs = {
  courier: { semitones: -2, pulse: 0.98 },
  lab: { semitones: 2, pulse: 1.04 },
  public: { semitones: 5, pulse: 1.08 },
};

/** Swaps a few steps around so repeated scenes in one mode never loop identically. */
export const groovePresets = [
  { kickShift: 0, hatDrop: 0, leadShift: 0 },
  { kickShift: 2, hatDrop: 3, leadShift: 0 },
  { kickShift: 0, hatDrop: 2, leadShift: 4 },
  { kickShift: 4, hatDrop: 0, leadShift: 2 },
];
