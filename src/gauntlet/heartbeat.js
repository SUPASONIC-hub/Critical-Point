/**
 * The heartbeat's voice, and the hesitation swell (A1-2, 2026-11-12).
 *
 * `scheduleHeartbeat` is one lub-dub on a runtime `{ context, destination,
 * multiplier }` (gauntletAudio.js `playHeartbeat` hands it one). Louder and
 * brighter as the wall closes in. `tier` is the step the table shows
 * (`fxTier`: 0, 1 hot, 2 critical, and 0 under either comfort setting). Each
 * step lifts the beat 6% -- 110 to 123Hz at the top of the thump, still under
 * the lowpass, nothing bright -- and brings the second beat 10ms sooner. The
 * tempo stays the engine's.
 *
 * The swell: a card staked and nothing else pressed for more than
 * `HESITATE_AFTER_MS`, and the beat grows -- in volume only -- over
 * `HESITATE_RAMP_MS` to `HESITATE_MAX` of itself. How many beats, how fast,
 * and every number on the screen stay the engine's: the tempo carries the
 * wall's tell, and a hesitation folded into it would blur the tell and move
 * the ranking. Any press -- another card, a push, a lock, a look, a stance, a
 * hold on 확정 -- starts the count again (`hesitationKey`). It is read off the
 * window and the hold, never off a pointer resting on a button, so a finger,
 * a key and a screen reader all count the same way; a phone has no hover.
 *
 * For earphones: the swell is a level each beat is born with, never a jump on
 * a voice already sounding. Every beat starts at 0.0001 and ramps, and the
 * beat after is at most 0.2 x (beat gap / 8 s) louder -- under 1% at the
 * fastest pulse. Nothing reaches the score's drive.
 */

/** How long a staked card waits before the beat starts to swell. */
export const HESITATE_AFTER_MS = 3000;
/** How long the swell takes, from nothing to the most. */
export const HESITATE_RAMP_MS = 8000;
/** The most the beat swells: +20%. */
export const HESITATE_MAX = 1.2;

/** The clock before anything is held. */
export const HESITATION_IDLE = Object.freeze({ key: "", since: 0 });

/**
 * What the player has pressed so far in a window: a change in any part is a
 * press. "" when no card is staked -- nothing to hesitate over.
 */
export function hesitationKey(win, hold = "") {
  if (!win?.selectedId) return "";
  return [win.selectedId, win.pushes, Number(win.focusHits) || 0, win.scouted === true ? 1 : 0, win.focusMode ?? "", hold || "idle"].join("|");
}

/**
 * One frame of the hesitation clock. A new key -- a press, a new stake, the
 * window going live again -- restarts it at `now`; off a live window there is
 * nothing held.
 */
export function stepHesitation(clock, key, live, now) {
  const held = live ? key : "";
  return held === clock.key ? clock : { key: held, since: now };
}

/** The beat's level for a clock at `now`: 1 until 3 s have passed, then up to `HESITATE_MAX` over 8 s. */
export function hesitationSwell(clock, now) {
  if (!clock?.key) return 1;
  const over = (now - clock.since - HESITATE_AFTER_MS) / HESITATE_RAMP_MS;
  if (!(over > 0)) return 1;
  return 1 + (HESITATE_MAX - 1) * Math.min(1, over);
}

function envelope(gain, start, peak, attack, release) {
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
}

/** One lub-dub. `swell` is held to 1..`HESITATE_MAX` whatever the caller passes. */
export function scheduleHeartbeat({ context, destination, multiplier = 1 }, closeness = 0, tier = 0, swell = 1) {
  const now = context.currentTime;
  const grown = Math.min(HESITATE_MAX, Math.max(1, Number(swell) || 1));
  // 0.19 at rest is 0.156 on the default preset: audible under the score.
  const level = (0.19 + closeness * 0.13) * multiplier * grown;
  for (const [offset, share, pitch] of [
    [0, 1, 1],
    [0.17 - closeness * 0.05 - tier * 0.01, 0.7, 0.86],
  ]) {
    const start = now + offset;
    const lift = pitch * (1 + tier * 0.06);
    const oscillator = context.createOscillator();
    const body = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(110 * lift, start);
    oscillator.frequency.exponentialRampToValueAtTime(34 * lift, start + 0.11);
    body.type = "lowpass";
    body.frequency.setValueAtTime(180 + closeness * 260, start);
    envelope(gain, start, level * share, 0.008, 0.2);
    oscillator.connect(body).connect(gain).connect(destination);
    oscillator.start(start);
    oscillator.stop(start + 0.24);
  }
}
