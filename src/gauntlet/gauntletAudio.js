import { acquireCueRuntime } from "../components/AdaptiveMusic.jsx";

/**
 * The gauntlet's sound. Every cue goes through `acquireCueRuntime`, so a muted
 * player never touches the audio graph, and nothing here opens a context of its
 * own.
 *
 * The cues connect to the context's destination, not to the music bus the
 * runtime hands out. That bus runs into the music master, whose gain is the
 * background score's level -- at most 0.14 -- behind a compressor, so a
 * heartbeat routed through it peaked near 0.02: present on a meter, absent in
 * a room. `playOpeningAccent` bypasses the master for the same reason. The
 * volume preset still applies through `multiplier`.
 *
 * The heartbeat is not decoration. Its tempo is read off the distance to the
 * real wall, so a player who listens knows more than a player who reads.
 */

function cueRuntime() {
  const runtime = acquireCueRuntime();
  return runtime ? { ...runtime, destination: runtime.context.destination } : null;
}

function withRuntime(play) {
  const runtime = cueRuntime();
  if (!runtime) return;
  try {
    play(runtime);
  } catch {
    // Audio is an enhancement; a browser may refuse it mid-gesture.
  }
}

function envelope(gain, start, peak, attack, release) {
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
}

let noiseBuffer = null;
function getNoise(context) {
  if (noiseBuffer?.sampleRate === context.sampleRate) return noiseBuffer;
  const length = Math.floor(context.sampleRate * 1.2);
  noiseBuffer = context.createBuffer(1, length, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
  return noiseBuffer;
}

/** Lub-dub. Louder and brighter as the wall closes in. */
export function playHeartbeat(closeness = 0) {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    // 0.19 at rest is 0.156 on the default preset: audible under the score.
    const level = (0.19 + closeness * 0.13) * multiplier;
    for (const [offset, share, pitch] of [
      [0, 1, 1],
      [0.17 - closeness * 0.05, 0.7, 0.86],
    ]) {
      const start = now + offset;
      const oscillator = context.createOscillator();
      const body = context.createBiquadFilter();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(110 * pitch, start);
      oscillator.frequency.exponentialRampToValueAtTime(34 * pitch, start + 0.11);
      body.type = "lowpass";
      body.frequency.setValueAtTime(180 + closeness * 260, start);
      envelope(gain, start, level * share, 0.008, 0.2);
      oscillator.connect(body).connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.24);
    }
  });
}

/**
 * The room tone under a live window. Returns a controller the stage drives every
 * frame; `stop()` releases it. A missing runtime returns a no-op controller so
 * the caller never branches.
 */
export function startTensionDrone() {
  const runtime = cueRuntime();
  if (!runtime) return { set() {}, stop() {} };
  try {
    const { context, destination, multiplier } = runtime;
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, context.currentTime);
    filter.Q.setValueAtTime(6, context.currentTime);
    const voices = [55, 55 * 1.007, 82.4].map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.connect(filter);
      oscillator.start();
      return oscillator;
    });
    filter.connect(master).connect(destination);
    let stopped = false;
    return {
      set(closeness = 0, sedated = false) {
        if (stopped) return;
        const now = context.currentTime;
        const read = sedated ? 0.35 : closeness;
        master.gain.setTargetAtTime((0.012 + read * read * 0.07) * multiplier, now, 0.25);
        filter.frequency.setTargetAtTime(120 + read * 1400, now, 0.3);
        voices[2].detune.setTargetAtTime(read * 60, now, 0.4);
      },
      stop() {
        if (stopped) return;
        stopped = true;
        const now = context.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(0.0001, now, 0.08);
        for (const oscillator of voices) oscillator.stop(now + 0.5);
      },
    };
  } catch {
    return { set() {}, stop() {} };
  }
}

/** A chip slammed on felt. Each push in a window lands a semitone higher. */
export function playPushCue(pushIndex = 1, closeness = 0) {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const semitone = Math.pow(2, Math.min(18, pushIndex) / 12);
    const click = context.createBufferSource();
    click.buffer = getNoise(context);
    const clickFilter = context.createBiquadFilter();
    clickFilter.type = "bandpass";
    clickFilter.frequency.setValueAtTime(2400 * semitone, now);
    clickFilter.Q.setValueAtTime(4, now);
    const clickGain = context.createGain();
    envelope(clickGain, now, 0.2 * multiplier, 0.002, 0.06);
    click.connect(clickFilter).connect(clickGain).connect(destination);
    click.start(now, Math.random() * 0.5, 0.09);

    const tone = context.createOscillator();
    const toneGain = context.createGain();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(220 * semitone, now);
    tone.frequency.exponentialRampToValueAtTime(330 * semitone * (1 + closeness * 0.5), now + 0.12);
    envelope(toneGain, now, (0.07 + closeness * 0.06) * multiplier, 0.004, 0.18);
    tone.connect(toneGain).connect(destination);
    tone.start(now);
    tone.stop(now + 0.24);
  });
}

const CASH_NOTES = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
const GROOVE_SPARKLE = [2093, 2349.32, 2637.02, 3135.96, 3520, 4186.01];

/**
 * The register. More notes the hotter the pot, and a sparkle run over the top
 * for the groove the beat added to it.
 */
export function playCashCue(multiplier = 1, grooveBonus = 1) {
  withRuntime(({ context, destination, multiplier: volume }) => {
    const now = context.currentTime;
    const count = Math.min(CASH_NOTES.length, 2 + Math.floor(Math.log2(Math.max(1, multiplier))));
    for (let index = 0; index < count; index += 1) {
      const start = now + index * 0.065;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(CASH_NOTES[index], start);
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3200, start);
      envelope(gain, start, 0.06 * volume, 0.004, 0.22);
      oscillator.connect(filter).connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    }
    const sparkles = Math.min(GROOVE_SPARKLE.length, Math.round((Math.max(1, grooveBonus) - 1) * GROOVE_SPARKLE.length));
    for (let index = 0; index < sparkles; index += 1) {
      const start = now + count * 0.065 + index * 0.045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(GROOVE_SPARKLE[index], start);
      envelope(gain, start, 0.045 * volume, 0.002, 0.3);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.34);
    }
  });
}

/* The beat --------------------------------------------------------------- */

const PENTATONIC = [0, 2, 4, 7, 9];
const PERFECT_PARTIALS = [
  [1, 1],
  [2.01, 0.42],
  [3.02, 0.18],
];
const GOOD_PARTIALS = [
  [1, 1],
  [2, 0.22],
];

/**
 * A push graded against the heartbeat. On the beat it is a struck bell one
 * pentatonic step higher for every link in the combo, so a long combo is a
 * melody the player hears themselves building; a PERFECT adds a snap and more
 * overtones. A slip is a dull thud and a scrape: the grip went.
 */
export function playBeatCue(grade, combo = 0) {
  if (grade !== "perfect" && grade !== "good" && grade !== "miss") return;
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    if (grade === "miss") {
      const thud = context.createOscillator();
      const thudFilter = context.createBiquadFilter();
      const thudGain = context.createGain();
      thud.type = "square";
      thud.frequency.setValueAtTime(96, now);
      thud.frequency.exponentialRampToValueAtTime(42, now + 0.16);
      thudFilter.type = "lowpass";
      thudFilter.frequency.setValueAtTime(420, now);
      envelope(thudGain, now, 0.13 * multiplier, 0.004, 0.2);
      thud.connect(thudFilter).connect(thudGain).connect(destination);
      thud.start(now);
      thud.stop(now + 0.26);

      const scrape = context.createBufferSource();
      scrape.buffer = getNoise(context);
      const scrapeFilter = context.createBiquadFilter();
      scrapeFilter.type = "bandpass";
      scrapeFilter.frequency.setValueAtTime(900, now);
      scrapeFilter.frequency.exponentialRampToValueAtTime(380, now + 0.14);
      scrapeFilter.Q.setValueAtTime(1.4, now);
      const scrapeGain = context.createGain();
      envelope(scrapeGain, now, 0.08 * multiplier, 0.003, 0.14);
      scrape.connect(scrapeFilter).connect(scrapeGain).connect(destination);
      scrape.start(now, Math.random() * 0.8, 0.2);
      return;
    }
    const step = Math.max(0, Math.trunc(combo) - 1);
    const octave = Math.min(1, Math.floor(step / PENTATONIC.length));
    const semitones = PENTATONIC[step % PENTATONIC.length] + 12 * octave;
    const root = 523.25 * Math.pow(2, semitones / 12);
    const perfect = grade === "perfect";
    const partials = perfect ? PERFECT_PARTIALS : GOOD_PARTIALS;
    const release = perfect ? 0.52 : 0.28;
    const level = (perfect ? 0.13 : 0.09) * multiplier;
    for (let index = 0; index < partials.length; index += 1) {
      const [ratio, share] = partials[index];
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(root * ratio, now);
      envelope(gain, now, level * share, 0.003, release);
      oscillator.connect(gain).connect(destination);
      oscillator.start(now);
      oscillator.stop(now + release + 0.05);
    }
    if (perfect) {
      const snap = context.createBufferSource();
      snap.buffer = getNoise(context);
      const snapFilter = context.createBiquadFilter();
      snapFilter.type = "highpass";
      snapFilter.frequency.setValueAtTime(5200, now);
      const snapGain = context.createGain();
      envelope(snapGain, now, 0.07 * multiplier, 0.001, 0.035);
      snap.connect(snapFilter).connect(snapGain).connect(destination);
      snap.start(now, Math.random() * 0.8, 0.06);
    }
  });
}

export function playFocusCue(grade, charge = 0) {
  if (grade !== "perfect" && grade !== "good" && grade !== "miss") return;
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const level = Math.min(1, Math.max(0, Number(charge) || 0));
    if (grade === "miss") {
      const noise = context.createBufferSource();
      noise.buffer = getNoise(context);
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.exponentialRampToValueAtTime(190, now + 0.18);
      filter.Q.setValueAtTime(6, now);
      const gain = context.createGain();
      envelope(gain, now, 0.11 * multiplier, 0.002, 0.16);
      noise.connect(filter).connect(gain).connect(destination);
      noise.start(now, Math.random() * 0.8, 0.22);
      return;
    }
    const perfect = grade === "perfect";
    const base = perfect ? 1760 : 1318.51;
    for (let index = 0; index < (perfect ? 3 : 2); index += 1) {
      const start = now + index * 0.045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = perfect ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(base * Math.pow(2, index / 12), start);
      oscillator.frequency.exponentialRampToValueAtTime(base * (1.15 + level * 0.35), start + 0.18);
      envelope(gain, start, (perfect ? 0.075 : 0.055) * multiplier, 0.003, 0.26);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.32);
    }
  });
}

const FEVER_CHORD = [659.25, 830.61, 987.77, 1318.51];

/** FEVER: a filter sweep opening under a bright major chord. */
export function playFeverCue() {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const sweep = context.createOscillator();
    const sweepFilter = context.createBiquadFilter();
    const sweepGain = context.createGain();
    sweep.type = "sawtooth";
    sweep.frequency.setValueAtTime(220, now);
    sweep.frequency.exponentialRampToValueAtTime(880, now + 0.45);
    sweepFilter.type = "lowpass";
    sweepFilter.frequency.setValueAtTime(380, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(5200, now + 0.45);
    sweepFilter.Q.setValueAtTime(7, now);
    envelope(sweepGain, now, 0.07 * multiplier, 0.05, 0.5);
    sweep.connect(sweepFilter).connect(sweepGain).connect(destination);
    sweep.start(now);
    sweep.stop(now + 0.6);
    for (let index = 0; index < FEVER_CHORD.length; index += 1) {
      const start = now + 0.12 + index * 0.04;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(FEVER_CHORD[index], start);
      envelope(gain, start, 0.045 * multiplier, 0.006, 0.62);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.7);
    }
  });
}

/** Glass, then the floor dropping out, then nothing. */
export function playBustCue() {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const shatter = context.createBufferSource();
    shatter.buffer = getNoise(context);
    const high = context.createBiquadFilter();
    high.type = "highpass";
    high.frequency.setValueAtTime(1800, now);
    high.frequency.exponentialRampToValueAtTime(5200, now + 0.5);
    const shatterGain = context.createGain();
    envelope(shatterGain, now, 0.34 * multiplier, 0.003, 0.7);
    shatter.connect(high).connect(shatterGain).connect(destination);
    shatter.start(now);
    shatter.stop(now + 0.9);

    const drop = context.createOscillator();
    const dropGain = context.createGain();
    drop.type = "sawtooth";
    drop.frequency.setValueAtTime(140, now);
    drop.frequency.exponentialRampToValueAtTime(24, now + 1.1);
    const dropFilter = context.createBiquadFilter();
    dropFilter.type = "lowpass";
    dropFilter.frequency.setValueAtTime(600, now);
    dropFilter.frequency.exponentialRampToValueAtTime(60, now + 1.1);
    envelope(dropGain, now, 0.3 * multiplier, 0.01, 1.2);
    drop.connect(dropFilter).connect(dropGain).connect(destination);
    drop.start(now);
    drop.stop(now + 1.3);
  });
}

/** A rule breaking: stuttered square bursts at unrelated pitches. */
export function playMutationCue(count = 1) {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const bursts = 3 + Math.min(6, count * 2);
    for (let index = 0; index < bursts; index += 1) {
      const start = now + index * 0.045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(180 + ((index * 7919) % 11) * 140, start);
      envelope(gain, start, 0.045 * multiplier, 0.002, 0.035);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.05);
    }
  });
}

/** One tick per second in the last five. */
export function playClockTick(remaining = 5) {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(remaining <= 2 ? 1760 : 1320, now);
    envelope(gain, now, 0.05 * multiplier, 0.002, 0.04);
    oscillator.connect(gain).connect(destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  });
}

/* Relics ---------------------------------------------------------------- */

/** A draft being dealt: three cards flicked onto felt, a beat apart. */
export function playRelicDealCue(count = 3) {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    for (let index = 0; index < count; index += 1) {
      const start = now + index * 0.09;
      const flick = context.createBufferSource();
      flick.buffer = getNoise(context);
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1600 + index * 420, start);
      filter.Q.setValueAtTime(2.2, start);
      const gain = context.createGain();
      envelope(gain, start, 0.12 * multiplier, 0.002, 0.07);
      flick.connect(filter).connect(gain).connect(destination);
      flick.start(start, 0.1 + index * 0.2, 0.1);
    }
  });
}

const EQUIP_SHIMMER = [880, 1108.73, 1318.51, 1760];

/** A relic locked into the run: a heavy latch, then a shimmer climbing out of it. */
export function playRelicEquipCue() {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    const latch = context.createOscillator();
    const latchFilter = context.createBiquadFilter();
    const latchGain = context.createGain();
    latch.type = "square";
    latch.frequency.setValueAtTime(130, now);
    latch.frequency.exponentialRampToValueAtTime(52, now + 0.12);
    latchFilter.type = "lowpass";
    latchFilter.frequency.setValueAtTime(700, now);
    envelope(latchGain, now, 0.16 * multiplier, 0.002, 0.16);
    latch.connect(latchFilter).connect(latchGain).connect(destination);
    latch.start(now);
    latch.stop(now + 0.22);
    for (let index = 0; index < EQUIP_SHIMMER.length; index += 1) {
      const start = now + 0.08 + index * 0.05;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(EQUIP_SHIMMER[index], start);
      envelope(gain, start, 0.055 * multiplier, 0.003, 0.42);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.46);
    }
  });
}

/** A relic doing its job mid-window: a quick bright ping, a fourth apart. */
export function playRelicProcCue() {
  withRuntime(({ context, destination, multiplier }) => {
    const now = context.currentTime;
    for (const [offset, frequency] of [
      [0, 1318.51],
      [0.07, 1760],
    ]) {
      const start = now + offset;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope(gain, start, 0.07 * multiplier, 0.002, 0.18);
      oscillator.connect(gain).connect(destination);
      oscillator.start(start);
      oscillator.stop(start + 0.22);
    }
  });
}
