import { useEffect, useRef } from "react";

import { normalizeRunState, suspendWindow } from "../gauntlet/gauntletEngine.js";
import { useStableEvent } from "./useStableEvent.js";

/**
 * Putting a live table down without losing it, and the page going away.
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
 *
 * The one way this could hand back a wall is a snapshot outliving the moment it
 * was taken: hide the tab, come back, push into the wall, reload. So a snapshot
 * taken because the page was hidden is cleared the instant the page is visible
 * again, before any input can reach the table, and the stage clears whatever
 * suspension it resumed from as soon as it writes its own hold.
 *
 * This is also the only page-lifecycle listener the runtime has. The runtime
 * used to keep its own `visibilitychange` handler beside this one, for the
 * scene clock, and it persisted a `dynamics` read from its last render -- which
 * could still hold the suspension this handler had just cleared. Each event now
 * makes one `commit` carrying everything it changed: the run, the time the page
 * was away, and whether the save is paused.
 *
 * A window that has closed but not yet been handed to the runtime (the slam
 * before a verdict is committed) is `settling`: it cannot be suspended, and the
 * runtime refuses to leave the table until it has settled.
 */
export function useWindowSuspension({ started, active, getRun, commit, onPageShow }) {
  const suspendRef = useRef(null);
  const suspendedByHide = useRef(false);
  const hiddenAt = useRef(null);
  const readRun = useStableEvent(getRun);
  const writePage = useStableEvent(commit);
  const pageShown = useStableEvent(onPageShow);

  function suspendNow() {
    const snapshot = suspendRef.current;
    if (!snapshot?.window) return null;
    const run = readRun();
    const suspended = suspendWindow(snapshot.window, run.windowIndex);
    return suspended ? normalizeRunState({ ...run, suspended }) : null;
  }
  const suspendNowEvent = useStableEvent(suspendNow);

  useEffect(() => {
    if (!started) return undefined;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (!active) return;
        hiddenAt.current ??= Date.now();
        const run = suspendNowEvent();
        if (!run) return;
        suspendedByHide.current = true;
        writePage({ run });
        return;
      }
      const pausedForMs = hiddenAt.current === null ? 0 : Date.now() - hiddenAt.current;
      hiddenAt.current = null;
      const run = suspendedByHide.current ? normalizeRunState({ ...readRun(), suspended: null }) : null;
      suspendedByHide.current = false;
      if (run || pausedForMs > 0) writePage({ run, pausedForMs });
    };
    const onPageHide = () => writePage({ run: active ? suspendNowEvent() : null, paused: true });
    const onPageShowEvent = (event) => {
      if (event.persisted) pageShown();
    };
    document.addEventListener("visibilitychange", onVisibility);
    globalThis.addEventListener("pagehide", onPageHide);
    globalThis.addEventListener("pageshow", onPageShowEvent);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      globalThis.removeEventListener("pagehide", onPageHide);
      globalThis.removeEventListener("pageshow", onPageShowEvent);
    };
  }, [active, pageShown, readRun, started, suspendNowEvent, writePage]);

  // The stage reports the window it would hand over; written to a ref, because
  // it changes ten times a second and nothing renders from it.
  const recordSuspendable = useStableEvent((snapshot) => {
    suspendRef.current = snapshot;
  });
  const isSettling = useStableEvent(() => Boolean(suspendRef.current?.settling));

  return { recordSuspendable, suspendNow: suspendNowEvent, isSettling };
}
