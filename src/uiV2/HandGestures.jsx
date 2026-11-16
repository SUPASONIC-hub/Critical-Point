import { useEffect } from "react";
import { buzz } from "./motion.js";

/** How far up a card is dragged before letting go plays it. */
export const PLAY_DISTANCE = 56;
/** A pointer that moved less than this was a tap: the button's own click plays it. */
const TAP_SLOP = 8;
/** The click a browser sends after a drag is swallowed for this long. */
const SWALLOW_MS = 400;

/**
 * Drag a card up out of the hand to play it, and a short buzz when one is
 * played. Nothing renders: the hand's own buttons stay the controls, so a tap,
 * a key and a screen reader play a card exactly as before, and a drag that
 * crosses the line ends in that same button's click (GuardedButton refuses a
 * locked one as it does a tap). The card follows the finger through two CSS
 * variables (uiV2.css); `.is-armed` says letting go now plays it.
 */
export function HandGestures({ handRef }) {
  useEffect(() => {
    const hand = handRef.current;
    if (!hand) return undefined;
    let drag = null;
    let swallowUntil = 0;

    const reset = (card) => {
      card.classList.remove("is-dragging", "is-armed");
      card.style.removeProperty("--drag-x");
      card.style.removeProperty("--drag-y");
    };
    const onDown = (event) => {
      const card = event.target.closest?.("button");
      if (!card || !hand.contains(card) || event.button > 0 || drag) return;
      drag = { card, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    };
    const onMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < TAP_SLOP) return;
      if (!drag.moved) {
        drag.moved = true;
        try {
          drag.card.setPointerCapture?.(event.pointerId);
        } catch {
          // A pointer the browser already let go of: the drag still follows it.
        }
        drag.card.classList.add("is-dragging");
      }
      drag.card.style.setProperty("--drag-x", `${Math.round(dx * 0.35)}px`);
      drag.card.style.setProperty("--drag-y", `${Math.round(Math.min(dy, 16))}px`);
      drag.card.classList.toggle("is-armed", dy <= -PLAY_DISTANCE);
    };
    const onUp = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const { card, moved } = drag;
      const played = moved && event.type === "pointerup" && event.clientY - drag.y <= -PLAY_DISTANCE;
      drag = null;
      reset(card);
      if (!moved) return;
      if (played) card.click();
      swallowUntil = Date.now() + SWALLOW_MS;
    };
    const onClick = (event) => {
      if (Date.now() < swallowUntil && event.isTrusted) {
        event.stopPropagation();
        event.preventDefault();
        swallowUntil = 0;
        return;
      }
      const card = event.target.closest?.("button");
      if (card && card.getAttribute("aria-disabled") !== "true") buzz();
    };

    hand.addEventListener("pointerdown", onDown);
    hand.addEventListener("pointermove", onMove);
    hand.addEventListener("pointerup", onUp);
    hand.addEventListener("pointercancel", onUp);
    hand.addEventListener("click", onClick, true);
    return () => {
      if (drag) reset(drag.card);
      hand.removeEventListener("pointerdown", onDown);
      hand.removeEventListener("pointermove", onMove);
      hand.removeEventListener("pointerup", onUp);
      hand.removeEventListener("pointercancel", onUp);
      hand.removeEventListener("click", onClick, true);
    };
  }, [handRef]);
  return null;
}
