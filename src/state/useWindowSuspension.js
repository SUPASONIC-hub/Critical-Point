import { useEffect, useRef } from "react";

import { normalizeRunState, suspendWindow } from "../gauntlet/gauntletEngine.js";
import { useStableEvent } from "./useStableEvent.js";

/**
 * Putting a live table down without losing it.
 *
 * A window the player has touched used to settle as a bust the moment the run
 * came back without it -- a reload, a closed tab, a phone that killed the
 * browser on the subway. That rule exists so F5 cannot undo a wall, and it made
 * a ten-case season unplayable in the pieces a commute is made of.
 *
 * So there are now two ways to leave a table, and they are told apart by
 * whether the player chose to. Saving and leaving, or the page going to the
 * background, writes the window's progress into the run as `suspended`; the
 * stage deals the same seed on return and restores that progress on top of it.
 * A reload in the middle of play writes nothing and still settles as a bust.
 *
 * The one way this could hand back a wall is a snapshot outliving the moment it
 * was taken: hide the tab, come back, push into the wall, reload. So a snapshot
 * taken because the page was hidden is cleared the instant the page is visible
 * again, before any input can reach the table, and the stage clears whatever
 * suspension it resumed from as soon as it writes its own hold.
 */
export function useWindowSuspension({ active, getRun, commitRun }) {
  const suspendRef = useRef(null);
  const suspendedByHide = useRef(false);
  const readRun = useStableEvent(getRun);
  const writeRun = useStableEvent(commitRun);

  function suspendNow() {
    const snapshot = suspendRef.current;
    if (!snapshot) return null;
    const run = readRun();
    const suspended = suspendWindow(snapshot.window, run.windowIndex);
    return suspended ? normalizeRunState({ ...run, suspended }) : null;
  }
  const suspendNowEvent = useStableEvent(suspendNow);

  useEffect(() => {
    if (!active) return undefined;
    const hide = () => {
      const run = suspendNowEvent();
      if (!run) return;
      suspendedByHide.current = true;
      writeRun(run);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hide();
        return;
      }
      if (!suspendedByHide.current) return;
      suspendedByHide.current = false;
      writeRun(normalizeRunState({ ...readRun(), suspended: null }));
    };
    document.addEventListener("visibilitychange", onVisibility);
    globalThis.addEventListener("pagehide", hide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      globalThis.removeEventListener("pagehide", hide);
    };
  }, [active, readRun, suspendNowEvent, writeRun]);

  // The stage reports the window it would hand over; written to a ref, because
  // it changes ten times a second and nothing renders from it.
  const recordSuspendable = useStableEvent((snapshot) => {
    suspendRef.current = snapshot;
  });

  return { recordSuspendable, suspendNow: suspendNowEvent };
}
