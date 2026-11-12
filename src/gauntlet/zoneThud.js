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
 * For earphones: a sine at one pitch, set once and never moved, and a gain
 * that starts at 0.0001 and only ramps -- in over `THUD_ATTACK` (no click),
 * out well inside 0.3 s. It goes to the context's destination, never into the
 * score's drive, like every table cue (gauntletAudio.js).
 */

/** The line's steps, low to high. */
export const ZONE_RANK = Object.freeze({ distance: 0, inReach: 1, inBand: 2 });

/** A2 -- the drone's 55Hz an octave up: low, and in tune with the room tone under it. */
export const THUD_HZ = 110;
export const THUD_ATTACK = 0.025;
export const THUD_RELEASE = 0.22;
/** When the oscillator stops: the release is done by then, and it is under 0.3 s. */
export const THUD_LENGTH = 0.28;
/** At the default preset about the heartbeat's resting beat: heard, not a jolt. */
export const THUD_LEVEL = 0.2;

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

/** Schedules the thud on a runtime `{ context, destination, multiplier }` (gauntletAudio.js). */
export function scheduleZoneThud({ context, destination, multiplier = 1 }) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(THUD_HZ, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, THUD_LEVEL * multiplier), now + THUD_ATTACK);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + THUD_ATTACK + THUD_RELEASE);
  oscillator.connect(gain).connect(destination);
  oscillator.start(now);
  oscillator.stop(now + THUD_LENGTH);
  return { oscillator, gain };
}
