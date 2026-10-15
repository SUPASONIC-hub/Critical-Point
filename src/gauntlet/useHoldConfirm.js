import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { HOLD_IDLE, HOLD_MS, SECOND_PRESS_MS, stepHold } from "./holdConfirm.js";

// A timer can land a frame before the clock it is measured on says the time
// is up; the tick is sent a little late so the hold it closes has been held.
const TICK_SLACK_MS = 20;

/**
 * The held 확정 (`holdConfirm.js`), wired to a button and to the table's keys.
 *
 * `enabled` is whether 확정 is held at all (the closing scene) and can be
 * pressed now; `resetKey` names what a press is about -- the staked card --
 * so a press that began on one card is not finished on another. A change of
 * either drops whatever was in progress: the state is filed under the key it
 * began with, and a state under another key reads as idle.
 *
 * Returns the phase to draw (`idle`, `holding`, `armed`), the props the button
 * spreads, and `press` / `release` / `cancel` for the keyboard. `release` says whether it
 * ended a hold, so the key handler knows the key-up was its own. Disabled, the
 * props are empty and the button clicks as it always did.
 */
export function useHoldConfirm({ enabled, resetKey, onConfirm }) {
  const key = enabled ? `on:${resetKey}` : "off";
  const [filed, setFiled] = useState({ key, hold: HOLD_IDLE });
  const filedRef = useRef(filed);
  const keyRef = useRef(key);
  const confirmRef = useRef(onConfirm);
  // Whether the click on its way is the end of a pointer's press.
  const pointedRef = useRef(false);
  useLayoutEffect(() => {
    keyRef.current = key;
    confirmRef.current = onConfirm;
  });

  const send = useCallback((type) => {
    const current = filedRef.current.key === keyRef.current ? filedRef.current.hold : HOLD_IDLE;
    if (keyRef.current === "off") return false;
    const { state, confirmed } = stepHold(current, { type, at: globalThis.performance.now() });
    if (state !== current || filedRef.current.key !== keyRef.current) {
      filedRef.current = { key: keyRef.current, hold: state };
      setFiled(filedRef.current);
    }
    if (confirmed) confirmRef.current();
    return current.phase === "holding";
  }, []);

  const phase = enabled && filed.key === key ? filed.hold.phase : "idle";

  // The only clock the machine needs: one tick when a hold is due to fill and
  // one when an armed first press runs out.
  useEffect(() => {
    if (phase === "idle") return undefined;
    const timer = globalThis.setTimeout(() => send("tick"), (phase === "holding" ? HOLD_MS : SECOND_PRESS_MS) + TICK_SLACK_MS);
    return () => globalThis.clearTimeout(timer);
  }, [phase, filed, send]);

  const buttonProps = enabled
    ? {
        onPointerDown: (event) => {
          if (event.button !== 0) return;
          pointedRef.current = true;
          send("press");
        },
        onPointerUp: () => send("release"),
        // A touch leaves only as it lifts, after its release and before its
        // click, so only a mouse that slid off has no click coming.
        onPointerLeave: (event) => {
          if (event.pointerType === "mouse") pointedRef.current = false;
          send("cancel");
        },
        onPointerCancel: () => {
          pointedRef.current = false;
          send("cancel");
        },
        // A pointer's click was its press and release. A click with no
        // pointer behind it is a screen reader's, a switch's or a script's
        // (the table takes Enter and Space before the button can click).
        onClick: () => {
          if (pointedRef.current) pointedRef.current = false;
          else send("tap");
        },
        // A long press on a phone is the browser's menu otherwise.
        onContextMenu: (event) => event.preventDefault(),
      }
    : {};

  return {
    phase,
    buttonProps,
    press: () => send("press"),
    release: () => send("release"),
    cancel: () => send("cancel"),
  };
}
