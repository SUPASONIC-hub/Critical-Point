/**
 * Server checks, phase 2 (F1, 서버검증-설계안.md): a window played again
 * from what the player did, off the page.
 *
 * The table is seeded (gauntletEngine.js): the wall and every push's step are
 * drawn from the window's seed, and between two presses the clock heats the
 * gauge in a straight line, at a rate set by the pushes made so far. So a
 * window is the same window again given its seed, its board, and each press
 * with the window clock it landed on. The ticks need not be written: replaying
 * them in other slices of time lands on the same gauge, give or take the last
 * bits of a float.
 *
 * The page writes the trail and the record (windowTrail.js, re-exported here);
 * this is the other half, pure and free of the page, for the unit tests and
 * the checker (scripts/verify-ranking-rows.mjs). The app does not import it.
 *
 *   replayWindow        the record played again under a case's rules, and
 *   compareReplay       what it closed on, set beside what the decision log
 *                       says it closed on (`threshold`).
 *
 * What a replay proves is that the log could have come out of the rules. It
 * does not prove the player could not see the wall (the seed is on the page):
 * the design's 4th and 5th ways in stay outside any replay.
 */
import { createWindow, getClockHeatRate, reduceWindow } from "./gauntletEngine.js";
import { EVENT_CODES, MAX_TRAIL, WINDOW_RECORD_VERSION } from "./windowTrail.js";

export { appendWindowEvent, compactSchema, createWindowRecord, WINDOW_RECORD_VERSION } from "./windowTrail.js";

const EVENT_TYPES = Object.freeze(Object.fromEntries(Object.entries(EVENT_CODES).map(([type, code]) => [code, type])));

/**
 * How far the replayed gauge may sit from the logged one. A clock rounded to
 * `digits` places moves the heat it adds by at most half a unit of the last
 * place times the creep times the clock-heat rate. Measured 2026-10-21 on
 * 20,000 windows ticked as the page ticks them (a tenth to a third of a second,
 * at clock scales 1 to 2): to the thousandth every one replays, to the
 * hundredth 5 do not (a push or the creep landing within that rounding of the
 * wall), to the tenth 3,487 do not. window-replay.test.mjs replays 400 of
 * them at the thousandth.
 */
const REPLAY_GAUGE_TOLERANCE = 0.05;
/** How far back a press's clock may sit from the replay's, before the record is read as rewound. */
const CLOCK_SLACK = 0.01;
/** Why a record cannot be replayed, or null. Read before anything is dealt from it. */
export function readRecordProblem(record) {
  if (!record || typeof record !== "object") return "no-record";
  if (record.v !== WINDOW_RECORD_VERSION) return "unknown-version";
  if (typeof record.seed !== "string" || !record.seed) return "no-seed";
  if (!record.schema || typeof record.schema !== "object" || Array.isArray(record.schema)) return "no-board";
  if (!Array.isArray(record.events) || record.events.length > MAX_TRAIL) return "bad-events";
  if (!Number.isFinite(record.end) || record.end < 0) return "bad-end";
  for (const event of record.events) {
    if (!Array.isArray(event) || !Number.isFinite(event[0]) || event[0] < 0 || !EVENT_TYPES[event[1]]) return "bad-events";
  }
  return null;
}

function toEvent(code, value) {
  const type = EVENT_TYPES[code];
  if (type === "SELECT") return { type, id: value };
  if (type === "SET_FOCUS_MODE") return { type, mode: value };
  return { type };
}

/** Runs the clock up to `at`, a second at a time at most, as the reducer takes it. */
function advanceTo(window, at, rules) {
  let advanced = window;
  // 60 seconds is the longest board; the guard only stops a malformed float.
  for (let step = 0; advanced.status === "live" && at - advanced.elapsed > 1e-9 && step < 400; step += 1) {
    advanced = reduceWindow(advanced, { type: "TICK", delta: Math.min(1, at - advanced.elapsed) }, rules);
  }
  return advanced;
}

/**
 * The window played again from its record under `rules` (the case's,
 * `getTableRules`). Returns the window it closed on and, when the record does
 * not hold together, why:
 *
 *   rewound        a press is written at a clock earlier than the one before it
 *                  had already reached (a LOCK or a SCOUT spends clock).
 *   closed-early   the replayed window closed before a written press -- the
 *                  clock ran into the wall or out of time first.
 *   never-closed   nothing closed the window: no CASH, and the clock at `end`
 *                  neither hit the wall nor ran out.
 */
export function replayWindow(record, rules) {
  const problem = readRecordProblem(record);
  if (problem) return { window: null, problem };
  let window = createWindow({ schema: record.schema, seed: record.seed });
  for (const [at, code, value] of record.events) {
    if (at < window.elapsed - CLOCK_SLACK) return { window, problem: "rewound" };
    window = advanceTo(window, at, rules);
    if (window.status !== "live") return { window, problem: "closed-early" };
    window = reduceWindow(window, toEvent(code, value), rules);
  }
  if (window.status === "live") window = advanceTo(window, record.end, rules);
  return { window, problem: window.status === "live" ? "never-closed" : null };
}

/**
 * What a replayed window closed on, beside what the log says: the list of
 * fields that differ, empty when they agree. `threshold` is a decision log
 * entry's (useChoiceCommit): `busted`, `cause`, `gauge`, `wall`, `pushes`,
 * and `focus` (`charge`, `mode`, `hits`) when it has one. `window` is replayed
 * under the case's rules, which is what resolveWindow read the closed window
 * under too: without LOCK the charge is 0, without stances it is STRIKE.
 * A window the player walked away from (`abandon`) is settled at the gauge it
 * opened on and is never replayed; it is reported as such, not as a mismatch.
 */
export function compareReplay(threshold, window, { tolerance = REPLAY_GAUGE_TOLERANCE } = {}) {
  if (!threshold || !window) return ["missing"];
  const differs = [];
  const busted = window.status !== "cashed";
  if (Boolean(threshold.busted) !== busted) differs.push("outcome");
  if (threshold.cause !== window.cause) differs.push("cause");
  if (Number(threshold.wall) !== window.wall) differs.push("wall");
  if (Number(threshold.pushes) !== window.pushes) differs.push("pushes");
  // The log writes the gauge rounded to a whole point (resolveWindow), so it
  // may sit half a point either side. A window that ran out of time took the
  // heat of the whole last tick, the part past the bell too (advanceClock),
  // and a tick is a second at most: up to a second's creep more above.
  const overshoot = window.cause === "timeout" ? window.schema.creep * getClockHeatRate(window.pushes) : 0;
  const gap = Number(threshold.gauge) - window.gauge;
  if (!(gap >= -0.5 - tolerance && gap <= 0.5 + tolerance + overshoot)) differs.push("gauge");
  // LOCK as the verdict read it: the charge rounded, the stance, the presses.
  const focus = threshold.focus;
  if (focus && typeof focus === "object") {
    if (Number(focus.charge) !== Math.round(Number(window.focus) || 0)) differs.push("focus");
    if (focus.mode !== undefined && focus.mode !== window.focusMode) differs.push("stance");
    if (focus.hits !== undefined && Number(focus.hits) !== Math.trunc(Number(window.focusHits) || 0)) differs.push("lockPresses");
  }
  return differs;
}

/**
 * One logged window checked end to end: replayed from `record` under `rules`
 * and compared with `threshold`. `status` is "match", "mismatch",
 * "unreplayable" (the record does not hold together, `problem` says why) or
 * "abandoned" (nothing to replay).
 */
export function recheckWindow(record, threshold, rules, options) {
  if (threshold?.cause === "abandon") return { status: "abandoned", differs: [], problem: null };
  const { window, problem } = replayWindow(record, rules);
  if (problem) return { status: "unreplayable", differs: [], problem, window };
  const differs = compareReplay(threshold, window, options);
  return { status: differs.length ? "mismatch" : "match", differs, problem: null, window };
}
