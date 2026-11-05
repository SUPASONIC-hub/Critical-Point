import { normalizeMood } from "../components/musicScore.js";

/**
 * The room tone under a live window, as the scene's mood voices it. Pure
 * Web Audio over whatever context it is given, so tests/unit/mood-music.test.mjs
 * can drive it with a fake; gauntletAudio.js hands it the cue runtime and the
 * preference readers.
 *
 * Every voicing is a few sawtooths into its own lowpass and its own gain,
 * summed into one master that the table's closeness drives as before. A
 * mood change builds the new voicing at its pitches and crosses the gains
 * over (`DRONE_FADE_SECONDS`, earphones: no oscillator is retuned and no gain
 * is set, only setTargetAtTime from wherever each gain stands); the old
 * voices stop once they are silent. The drone goes to the context's
 * destination, never through the music bus's drive (#388).
 */
export const DRONE_FADE_SECONDS = 5;
/** The crossfade's time constant: half-way in a second, 97% over in `DRONE_FADE_SECONDS`. */
export const DRONE_FADE_TAU = DRONE_FADE_SECONDS / 3.5;

/**
 * voices: the sawtooths' Hz (the last one takes the closeness detune);
 * level: the voicing's share of the drone's level (tense is 1, today's);
 * floor: its lowpass at rest, which closeness opens by 1400 Hz on top.
 */
export const DRONE_VOICINGS = {
  // Today's drone: A1 twice, a hair apart, and E2.
  tense: { voices: [55, 55 * 1.007, 82.4], level: 1, floor: 120 },
  // The same voices, a little under and a little duller.
  neutral: { voices: [55, 55 * 1.007, 82.4], level: 0.85, floor: 140 },
  // Thinner: no beating twin, less of it, the filter a little higher.
  bright: { voices: [55, 82.4], level: 0.6, floor: 180 },
  // The low end leaned on: E1 under the three, more of it, the filter lower.
  dread: { voices: [41.2, 55, 55 * 1.007, 82.4], level: 1.2, floor: 90 },
  // A1 and the minor third over it, nothing else.
  sorrow: { voices: [55, 65.41], level: 0.7, floor: 110 },
};

export function droneVoicing(mood) {
  return DRONE_VOICINGS[normalizeMood(mood)];
}

export function createTensionDrone({ context, destination, multiplier }, readers) {
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.connect(destination);
  const live = [];

  function voice(moodKey, now, gainAt) {
    const key = normalizeMood(moodKey);
    const voicing = DRONE_VOICINGS[key];
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(voicing.floor, now);
    filter.Q.setValueAtTime(6, now);
    const gain = context.createGain();
    // Set only here, before the voices start: a sounding voicing is only ever ramped.
    gain.gain.setValueAtTime(gainAt, now);
    filter.connect(gain).connect(master);
    const voices = voicing.voices.map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.connect(filter);
      oscillator.start();
      return oscillator;
    });
    const entry = { mood: key, voicing, filter, gain, voices, until: Infinity };
    live.push(entry);
    return entry;
  }

  let current = voice(readers.mood(), context.currentTime, droneVoicing(readers.mood()).level);
  let stopped = false;
  let muted = false;
  let mutedAt = -Infinity;

  return {
    set(closeness = 0, sedated = false) {
      if (stopped) return;
      const now = context.currentTime;
      const read = sedated ? 0.35 : closeness;
      // The drone runs for the whole window, so it is the one voice that can
      // outlive a mute pressed after it started -- or a volume changed. The
      // preferences are in storage, and the stage drives this ten times a
      // second: they are read once a second.
      if (now - mutedAt >= 1) {
        muted = readers.isMuted();
        multiplier = readers.level();
        mutedAt = now;
      }
      const mood = normalizeMood(readers.mood());
      if (mood !== current.mood) {
        const previous = current;
        previous.gain.gain.setTargetAtTime(0.0001, now, DRONE_FADE_TAU);
        previous.until = now + DRONE_FADE_SECONDS + 1;
        for (const oscillator of previous.voices) oscillator.stop(previous.until);
        current = voice(mood, now, 0.0001);
        current.gain.gain.setTargetAtTime(current.voicing.level, now, DRONE_FADE_TAU);
      }
      for (let index = live.length - 1; index >= 0; index -= 1) {
        if (live[index].until <= now) live.splice(index, 1);
      }
      const level = muted ? 0.0001 : (0.012 + read * read * 0.07) * multiplier;
      master.gain.setTargetAtTime(level, now, 0.25);
      for (const entry of live) entry.filter.frequency.setTargetAtTime(entry.voicing.floor + read * 1400, now, 0.3);
      current.voices.at(-1).detune.setTargetAtTime(read * 60, now, 0.4);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0.0001, now, 0.08);
      // A voicing already on its way out has its stop scheduled; stopping it again would throw.
      for (const entry of live) if (entry.until === Infinity) for (const oscillator of entry.voices) oscillator.stop(now + 0.5);
      live.length = 0;
    },
    /** For the dev page and tests: the voicing sounding now. */
    get mood() {
      return current.mood;
    },
  };
}
