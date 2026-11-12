/**
 * The step marker (A1-1 · E3, 2026-11-12): one low, short thud the moment the
 * 현재 위험 line steps up -- from 「벽까지 N」 to 「밀면 벽 사정권」, or on into
 * 「벽 구간 안」. It reads the line's step (`dangerZoneOf`, tableMeters.js),
 * the one the table's voice reads (tableVoice.js), not `fxTier`: that one is 0
 * under either comfort setting, and a player who judges the table by ear must
 * hear the step whatever the screen is told to do. Only sound on and the
 * volume reach it (`acquireCueRuntime`); a quiet table has none.
 *
 * A step down says nothing. The same step does not sound twice while the line
 * stands on it; a line that cools off a step and climbs back sounds again.
 *
 * The sound (picked on earphones 2026-11-12 over a 110 Hz blip heard as
 * "light, small, no effect"): a sine body that glides 120 -> 42 Hz over
 * 0.22 s with a 1.1 s tail, plus its octave so earbuds that cannot play 42 Hz
 * still carry the drop. For earphones: pitch only glides (exponential, never
 * a step), every gain starts at 0.0001 and only ramps, and it goes to the
 * context's destination, never into the score's drive, like every table cue
 * (gauntletAudio.js).
 */

/** The line's steps, low to high. */
export const ZONE_RANK = Object.freeze({ distance: 0, inReach: 1, inBand: 2 });

/** The body: where the glide starts and lands, and how long it takes. */
export const THUD_FROM_HZ = 120;
export const THUD_TO_HZ = 42;
export const THUD_GLIDE = 0.22;
/** In fast enough to land as a hit, slow enough not to click. */
export const THUD_ATTACK = 0.012;
/** Where the body has settled to 45% before the tail. */
export const THUD_SETTLE = 0.18;
export const THUD_TAIL = 1.1;
export const THUD_LEVEL = 0.55;
/** The octave above, for earbuds; shorter, so the low body is what lingers. */
export const THUD_OCTAVE_LEVEL = 0.22;
export const THUD_OCTAVE_TAIL = 0.45;

const rank = (zone) => ZONE_RANK[zone] ?? -1;

/**
 * Whether a frame that moved the line from `before` to `after` sounds the
 * thud. Nothing before the line is known (the window's first frame takes it
 * as it finds it), nothing on the way down or across, nothing on a quiet
 * table. No comfort setting is asked: neither reaches this.
 */
export function zoneThudDue(before, after, quiet = false) {
  if (quiet) return false;
  const from = rank(before);
  return from >= 0 && rank(after) > from;
}

function voice(context, destination, at, { from, to, level, tail }) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(from, at);
  oscillator.frequency.exponentialRampToValueAtTime(to, at + THUD_GLIDE);
  // A muted preset still ramps to a positive floor: an exponential ramp to 0 throws.
  const peak = Math.max(0.0002, level);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + THUD_ATTACK);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.00015, peak * 0.45), at + THUD_SETTLE);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + tail);
  oscillator.connect(gain).connect(destination);
  oscillator.start(at);
  oscillator.stop(at + tail + 0.05);
  return { oscillator, gain };
}

/** Schedules the thud on a runtime `{ context, destination, multiplier }` (gauntletAudio.js). */
export function scheduleZoneThud({ context, destination, multiplier = 1 }) {
  const now = context.currentTime;
  return [
    voice(context, destination, now, { from: THUD_FROM_HZ, to: THUD_TO_HZ, level: THUD_LEVEL * multiplier, tail: THUD_TAIL }),
    voice(context, destination, now, { from: THUD_FROM_HZ * 2, to: THUD_TO_HZ * 2, level: THUD_OCTAVE_LEVEL * multiplier, tail: THUD_OCTAVE_TAIL }),
  ];
}
