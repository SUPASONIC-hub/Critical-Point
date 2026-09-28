import { judgeBeat } from "./gauntletEngine.js";

/**
 * The clock the table's hands are read on.
 *
 * The frame loop stamps each beat with `performance.now()` and an input event's
 * `timeStamp` is on the same clock, so a press is compared with the beat it was
 * made against rather than with whenever its handler ran.
 */
export const monotonicNow = () => globalThis.performance?.now?.() ?? Date.now();

/** How long after the pointer went down a click can still be that press. */
const PRESS_TO_CLICK_MS = 1500;

/**
 * When the player pressed, not when the handler got to it -- and not when the
 * finger came back up. A `click` fires on release, so on a touch screen every
 * tap was graded late by however long the finger stayed down, against a PERFECT
 * window of 35ms either side. The button notes the pointer going down
 * (`pointerDownAt`) and the click is graded there. A click with no pointer
 * behind it -- Enter or Space on the focused button -- is its own press.
 */
export function pressedAt(event, pointerDownAt = 0) {
  const now = monotonicNow();
  const stamp = Number(event?.timeStamp);
  const pressed = Number.isFinite(stamp) && stamp > 0 && stamp <= now ? stamp : now;
  const down = Number(pointerDownAt) || 0;
  const fromPointer = event?.type === "click" && event.detail !== 0 && down > 0 && down <= pressed && pressed - down < PRESS_TO_CLICK_MS;
  return fromPointer ? down : pressed;
}

const GRADE_RANK = { miss: 0, good: 1, perfect: 2 };

/**
 * One timed press against the beat the frame loop last stamped. `widened` is
 * METRONOME earning its keep: the wider window is what made the grade.
 */
export function gradePress(event, pointerDown, clock, wide = false) {
  const since = pressedAt(event, pointerDown.current) - clock.at;
  pointerDown.current = 0;
  const grade = judgeBeat(since, clock.period, wide);
  return { grade, widened: Boolean(wide && grade && GRADE_RANK[grade] > GRADE_RANK[judgeBeat(since, clock.period) ?? "miss"]) };
}
