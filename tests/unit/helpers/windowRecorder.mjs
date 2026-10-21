/**
 * A reducer that writes each window's replay trail as it goes
 * (gauntlet/windowReplay.js), for the simulated players of
 * scripts/sim/season-bot.mjs: they take it as `reduce`. A window is followed
 * by the objects the reducer hands back, so two branches of one window (the
 * case player's idle LOCK) keep two trails. Each window that closes is kept
 * with its record and the rules it was played under, in the order it closed.
 */
import { reduceWindow } from "../../../src/gauntlet/gauntletEngine.js";
import { appendWindowEvent, createWindowRecord } from "../../../src/gauntlet/windowReplay.js";

export function createWindowRecorder({ digits = null } = {}) {
  const trails = new WeakMap();
  const closed = [];
  function reduce(before, event, rules) {
    const after = reduceWindow(before, event, rules);
    if (after === before) return after;
    // A re-dealt board starts its trail again: it is the board the window closes on.
    const trail = event?.type === "REDEAL" ? [] : appendWindowEvent(trails.get(before) ?? [], before, event, after, { digits });
    trails.set(after, trail);
    if (before.status === "live" && after.status !== "live") closed.push({ record: createWindowRecord(after, trail, { digits }), window: after, rules });
    return after;
  }
  return { reduce, closed };
}

/**
 * What a decision log entry's `threshold` says of a closed window, rounded as
 * resolveWindow rounds it. The window is the one played, so under rules
 * without LOCK or stances it already holds no charge and STRIKE.
 */
export function thresholdOf(window) {
  return {
    busted: window.status !== "cashed",
    cause: window.cause,
    gauge: Math.round(window.gauge),
    wall: window.wall,
    pushes: window.pushes,
    focus: { charge: Math.round(window.focus), mode: window.focusMode, hits: window.focusHits },
  };
}

/** The same, from a verdict (resolveWindow), as useChoiceCommit writes it. */
export function thresholdOfVerdict(verdict) {
  return { busted: verdict.outcome === "bust", cause: verdict.cause, gauge: verdict.gauge, wall: verdict.wall, pushes: verdict.pushes, focus: verdict.focus };
}
