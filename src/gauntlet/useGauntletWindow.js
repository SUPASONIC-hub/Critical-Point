import { useEffect, useReducer } from "react";
import { getAccessibility } from "../state/accessibilitySettings.js";
import { createWindow, reduceWindow } from "./gauntletEngine.js";

/** Ticks are batched to ten a second: the reducer is exact, the screen does not need sixty renders. */
const TICK_BATCH_SECONDS = 0.1;

/**
 * One live decision window. The stage is keyed by the window's seed, so a new
 * scene is a new mount and this hook never has to reset itself.
 *
 * The clock stops while the tab is hidden and while `paused` -- the protocol
 * breach is on screen, or the runtime is already advancing. With the table-time
 * setting on, it runs that many times slower: the window, its schema and the
 * save are untouched, only the seconds that reach the reducer are fewer.
 */
export function useGauntletWindow({ schema, seed, paused, abandoned = false, closedAs = null, beatCombo = 0, resume = null }) {
  const [window_, dispatch] = useReducer(reduceWindow, { schema, seed, abandoned, closedAs, beatCombo, resume }, createWindow);
  const live = window_.status === "live";

  useEffect(() => {
    if (paused || !live) return undefined;
    let frame = 0;
    let last = 0;
    let pending = 0;
    const loop = (time) => {
      if (last && !document.hidden) pending += Math.min(0.25, (time - last) / 1000);
      last = time;
      if (pending >= TICK_BATCH_SECONDS) {
        dispatch({ type: "TICK", delta: pending / getAccessibility().tableTime });
        pending = 0;
      }
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [paused, live]);

  return [window_, dispatch];
}
