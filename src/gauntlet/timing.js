import { judgeBeat } from "./gauntletEngine.js";

/**
 * The clock the table's hands are read on.
 *
 * The frame loop stamps each beat with `performance.now()` and an input event's
 * `timeStamp` is on the same clock, so a press is compared with the beat it was
 * made against rather than with whenever its handler ran.
 */
export const monotonicNow = () => globalThis.performance?.now?.() ?? Date.now();

/** How long after the press went down a click can still be that press. */
const PRESS_TO_CLICK_MS = 1500;

/**
 * When the player pressed, not when the handler got to it -- and not when the
 * finger came back up. A `click` fires on release, so on a touch screen every
 * tap was graded late by however long the finger stayed down, against a PERFECT
 * window of 35ms either side. The button notes the press going down
 * (`downAt`) and the click is graded there.
 *
 * Space on a focused button is the same shape: the click comes at keyup. A
 * player who walked to the button with Tab -- which is every player with the
 * single-key shortcuts off -- was graded on the release, so the button notes
 * the key going down too. A click with nothing noted behind it is its own
 * press.
 */
export function pressedAt(event, downAt = 0) {
  const now = monotonicNow();
  const stamp = Number(event?.timeStamp);
  const pressed = Number.isFinite(stamp) && stamp > 0 && stamp <= now ? stamp : now;
  const down = Number(downAt) || 0;
  const fromDown = event?.type === "click" && down > 0 && down <= pressed && pressed - down < PRESS_TO_CLICK_MS;
  return fromDown ? down : pressed;
}

/**
 * Whether an event on a timed button is a press going down: the pointer, or
 * the first keydown of a key that will click it. A held key's repeats are the
 * same press still down.
 */
export function isPressDown(event) {
  if (event?.type !== "keydown") return event?.type === "pointerdown";
  return !event.repeat && (event.key === " " || event.key === "Enter");
}

const GRADE_RANK = { miss: 0, good: 1, perfect: 2 };

/**
 * One timed press against the beat the frame loop last stamped. `widened` is
 * METRONOME earning its keep: the wider window is what made the grade.
 */
export function gradePress(event, pressDown, clock, wide = false) {
  const since = pressedAt(event, pressDown.current) - clock.at;
  pressDown.current = 0;
  const grade = judgeBeat(since, clock.period, wide);
  return { grade, widened: Boolean(wide && grade && GRADE_RANK[grade] > GRADE_RANK[judgeBeat(since, clock.period) ?? "miss"]) };
}

/**
 * A light that may come on no more often than once every `minMs`.
 *
 * Asked every frame whether the light's condition holds, and answers whether
 * the light is on. A turn that would start too soon after the last one is
 * skipped whole -- the light stays off until the condition has let go and come
 * back -- so what the player sees is the same light on fewer turns, never a
 * shortened one. Three flashes a second is the line (WCAG 2.3.1), and the
 * table's own pulse is held under it by the same number.
 */
export function createLightGate(minMs) {
  let litAt = -Infinity;
  let asked = false;
  let lit = false;
  return (wanted, now) => {
    if (wanted && !asked) {
      lit = now - litAt >= minMs;
      if (lit) litAt = now;
    }
    asked = Boolean(wanted);
    return asked && lit;
  };
}

// The two halves of a timed press, under one name for the stage: when it went
// down, and how it is graded.
export const press = { down: isPressDown, grade: gradePress };
