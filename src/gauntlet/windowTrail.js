/**
 * The window's replay trail, as the page writes it (server checks, phase 2:
 * 서버검증-설계안.md, the 10-21 answers). Every press the reducer applies is
 * written with the window clock it landed on, to the thousandth of a second;
 * when the window closes, the trail, its seed and its board become the
 * decision log entry's `replay` record, which scripts/verify-ranking-rows.mjs
 * plays again off the page (windowReplay.js).
 *
 * Not written: TICK (the time between presses is the next press's clock),
 * REDEAL (the board a window closes on is the one recorded), and any press the
 * reducer ignored -- a LOCK without the rule, a CASH on a sealed card, a press
 * after the window closed.
 *
 * Its own chunk (WINDOW_TRAIL in vite.config.js): the table's chunk and the
 * runtime's both import it, and the table's had no room for it.
 */
import { BASE_SCHEMA, createWindow, normalizeSchema, reduceWindow } from "./gauntletEngine.js";

/** The record's own version, for a replay of a record written by an older build. */
export const WINDOW_RECORD_VERSION = 1;

/** The clock's places: to the thousandth every window replays (measured 2026-10-21, answer 1). */
export const TRAIL_DIGITS = 3;

/** One letter a press. */
export const EVENT_CODES = Object.freeze({
  SELECT: "S",
  PUSH: "P",
  FOCUS: "F",
  SET_FOCUS_MODE: "M",
  SCOUT: "L",
  CASH: "C",
});

/** A window is 60 seconds at the most (normalizeSchema): a trail longer than this is not one. */
export const MAX_TRAIL = 200;

function roundTo(value, digits, round = Math.round) {
  if (digits === null || digits === undefined) return value;
  const scale = 10 ** digits;
  return round(value * scale) / scale;
}

/**
 * The trail after one event. `before` and `after` are the window either side
 * of the reducer; the trail is returned as it was when the event changed
 * nothing or is not written. A trail that is not an array (a window resumed
 * from a save that kept none, or one let go below) stays as it is: it can no
 * longer be whole, and the window leaves no record.
 */
export function appendWindowEvent(trail, before, event, after, { digits = TRAIL_DIGITS } = {}) {
  if (!Array.isArray(trail) || !before || before === after || before.status !== "live") return trail;
  const code = EVENT_CODES[event?.type];
  if (!code) return trail;
  // A trail past any real window's length (a card picked and put back two
  // hundred times) is let go rather than cut: a cut trail would not replay.
  if (trail.length >= MAX_TRAIL) return null;
  const at = roundTo(before.elapsed, digits);
  if (event.type === "SELECT") return [...trail, [at, code, typeof event.id === "string" ? event.id : null]];
  if (event.type === "SET_FOCUS_MODE") return [...trail, [at, code, String(event.mode)]];
  return [...trail, [at, code]];
}

/** The board as it differs from BASE_SCHEMA: a plain board is `{}`. */
export function compactSchema(schema) {
  const normalized = normalizeSchema(schema);
  const compact = {};
  for (const [key, value] of Object.entries(normalized)) {
    if (JSON.stringify(value) !== JSON.stringify(BASE_SCHEMA[key])) compact[key] = value;
  }
  return compact;
}

/** A closed window and the trail that closed it, as the decision log carries them. */
export function createWindowRecord(window, trail, { digits = TRAIL_DIGITS } = {}) {
  return {
    v: WINDOW_RECORD_VERSION,
    seed: String(window.seed),
    schema: compactSchema(window.schema),
    events: trail,
    // Rounded up: the clock a window closed on by heat or time has passed the
    // moment it closed, and a clock rounded down could stop the replay short of it.
    end: roundTo(window.elapsed, digits, Math.ceil),
  };
}

/**
 * The record a closed window leaves on its decision log entry, or null: the
 * table hands it over with its trail (`window.trail`). None for a window the
 * player walked away from (settled at the gauge it opened on, answer 4), one
 * resumed from a save that kept no trail, or no window at all.
 */
export function recordClosedWindow(window) {
  if (!window || !Array.isArray(window.trail) || window.cause === "abandon" || typeof window.seed !== "string" || !window.schema) return null;
  return createWindowRecord(window, window.trail);
}

/**
 * The table's reducer, with the trail carried on the window itself
 * (`window.trail`), here so the table's chunk carries one call instead of the
 * bookkeeping. The window travels as it always has -- to the save when it is
 * put down, to the runtime when it closes -- and the trail goes with it. A
 * re-deal starts the trail again.
 */
export function reduceTraced(window, event, rules) {
  const next = reduceWindow(window, event, rules);
  if (next === window) return window;
  const trail = event.type === "REDEAL" ? [] : appendWindowEvent(window.trail, window, event, next);
  return trail === next.trail ? next : { ...next, trail };
}

/** The window dealt, with the trail a resumed window's save kept (none from an older save). */
export function openTraced(init) {
  return { ...createWindow(init), trail: init.resume ? init.resume.trail ?? null : [] };
}
