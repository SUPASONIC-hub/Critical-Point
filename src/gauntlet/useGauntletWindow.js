import { useCallback, useEffect, useReducer } from "react";
import { getAccessibility } from "../state/accessibilitySettings.js";
import { createWindow, getTableClockScale, reduceWindow } from "./gauntletEngine.js";
import { getTableRules } from "./tableUnlocks.js";

/** Ticks are batched to ten a second: the reducer is exact, the screen does not need sixty renders. */
const TICK_BATCH_SECONDS = 0.1;

/**
 * One live decision window. The stage is keyed by the window's seed, so a new
 * scene is a new mount and this hook never has to reset itself.
 *
 * The clock stops while the tab is hidden and while `paused` -- the protocol
 * breach is on screen, or the runtime is already advancing. With the table-time
 * setting on, it runs that many times slower: the window, its schema and the
 * save are untouched, only the seconds that reach the reducer are fewer. A
 * story run's clock is never faster than twice as slow (`getTableClockScale`).
 *
 * `caseId` and `run` say which rules the window is played under
 * (`tableUnlocks`), and the reducer is handed them: a press for a rule the
 * case does not have yet is ignored there, whether or not the stage drew it.
 * Left out, the window has every rule.
 */
export function useGauntletWindow({ schema, seed, paused, abandoned = false, closedAs = null, beatCombo = 0, resume = null, caseId, run }) {
  const rules = getTableRules(caseId, run);
  // One function per set of rules, and the sets are constants: its identity
  // changes only if the window's rules do.
  const reduce = useCallback((window_, event) => reduceWindow(window_, event, rules), [rules]);
  const [window_, dispatch] = useReducer(reduce, { schema, seed, abandoned, closedAs, beatCombo, resume }, createWindow);
  const live = window_.status === "live";
  // The run's story mark is set when its case opens, so it is one value for as
  // long as this window is on the table.
  const story = run?.story === true;

  useEffect(() => {
    if (paused || !live) return undefined;
    let frame = 0;
    let last = 0;
    let pending = 0;
    const loop = (time) => {
      if (last && !document.hidden) pending += Math.min(0.25, (time - last) / 1000);
      last = time;
      if (pending >= TICK_BATCH_SECONDS) {
        const scale = getTableClockScale({ story }, getAccessibility().tableTime);
        // The scale rides along so the window remembers the slowest it was run.
        dispatch({ type: "TICK", delta: pending / scale, scale });
        pending = 0;
      }
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [paused, live, story]);

  return [window_, dispatch];
}
