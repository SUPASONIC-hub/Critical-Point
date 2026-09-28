import { useEffect, useLayoutEffect, useRef } from "react";

import { REFRAME_CARD_ID } from "./gauntletEngine.js";

const isTextField = (target) =>
  target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']");

// A focused button inside a dialog answers Space and Enter itself. Taking
// those keys from it made the draft's relic buttons, and any control on the
// briefing page, unreachable from the keyboard.
const isDialogButton = (target, selector) => target instanceof HTMLElement && target.matches(`${selector} button`);

// Anything that answers Space or Enter on its own once it has focus.
const isControl = (target) => target instanceof HTMLElement && Boolean(target.closest("button, summary, a[href], [role='button']"));

function cardIdForKey(key, cards, reframeChoice) {
  const index = Number(key) - 1;
  if (!Number.isInteger(index) || index < 0) return null;
  if (cards[index]) return cards[index].id;
  return index === cards.length && reframeChoice ? REFRAME_CARD_ID : null;
}

/**
 * The letter a key stands for, read off where the key is rather than what it
 * types. `event.key` follows the layout: with a Hangul layout on, W, E and Q
 * arrive as ㅈ, ㄷ and ㅂ, and push, lock and stance did nothing for a player
 * typing in the language the game is written in. `event.code` is the key
 * itself. A keyboard that reports no code falls back to the character.
 */
function letterOf(event) {
  const code = String(event.code ?? "");
  return /^Key[A-Z]$/.test(code) ? code.slice(3).toLowerCase() : String(event.key ?? "").toLowerCase();
}

/**
 * The table's keys: 1-9 stake a card, Space or W pushes, E locks focus, Q
 * cycles the stance, Enter cashes. On the draft, 1-3 take a relic and Escape
 * passes; on the briefing page, Space, Enter, W or a card key opens the table.
 *
 * A modified key is never the table's: Ctrl/Cmd+R, Ctrl+P and Alt+number are
 * the browser's. Bare Shift used to lock focus too, which meant Shift+P --
 * save and leave -- first fired a lock, and a lock off the beat is a JAM.
 *
 * Space and Enter belong to whatever the keyboard walked to. The table used to
 * take them from every focused control: a player who tabbed to 저장, the music
 * toggle or a card and pressed Space pushed instead -- which can bust -- and
 * Enter cashed the staked card, so a card could not be staked with Tab at all.
 * When focus got where it is by Tab, the control answers and the table stays
 * out of it. When a pointer left it there -- a card was clicked, and the hand
 * is back on the keys -- Space still pushes and Enter still cashes.
 * `:focus-visible` cannot tell the two apart: Chromium turns it on for a
 * pointer-focused button at the first key press, so the walk is tracked here.
 *
 * The handler is installed once and reads the stage's current actions through
 * a ref, so it never sees a stale window.
 */
export function useTableKeys(actions) {
  const actionsRef = useRef(actions);
  useLayoutEffect(() => {
    actionsRef.current = actions;
  });

  useEffect(() => {
    let walked = false;
    const onPointer = () => {
      walked = false;
    };
    const onKey = (event) => {
      if (event.key === "Tab") walked = true;
      if (event.repeat || event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTextField(event.target)) return;
      if (document.querySelector(".decision-reveal-backdrop")) return;
      const current = actionsRef.current;
      const key = event.key;
      const letter = letterOf(event);
      const activation = key === " " || key === "Enter";

      if (current.draftOpen) {
        // The draft is the decision on screen: nothing reaches the table behind it.
        if (activation && isDialogButton(event.target, ".gx-draft")) return;
        const pick = key === "Escape" ? null : current.relicOffer[Number(key) - 1];
        if (key === "Escape" || pick) {
          event.preventDefault();
          current.pickRelic(pick ?? null);
        } else if (activation) {
          event.preventDefault();
        }
        return;
      }

      // The briefing opens the table on the key that pushes -- whatever the
      // player's hand is already resting on -- and a card key opens it with
      // that card staked.
      if (current.briefingOpen) {
        if (activation && isDialogButton(event.target, ".gx-comic")) return;
        const cardId = cardIdForKey(key, current.cards, current.reframeChoice);
        if (activation || letter === "w" || cardId) {
          event.preventDefault();
          current.openTable(cardId);
        }
        return;
      }

      if (!current.tableOpen) return;
      if (activation && walked && isControl(event.target)) return;
      if (letter === "e") {
        event.preventDefault();
        current.focus(event);
      } else if (letter === "q") {
        event.preventDefault();
        current.cycleFocusMode();
      } else if (key === " " || letter === "w") {
        event.preventDefault();
        current.push(event);
      } else if (key === "Enter") {
        event.preventDefault();
        current.cash();
      } else {
        const cardId = cardIdForKey(key, current.cards, current.reframeChoice);
        if (!cardId) return;
        event.preventDefault();
        current.select(cardId);
      }
    };
    globalThis.addEventListener("keydown", onKey);
    globalThis.addEventListener("pointerdown", onPointer, true);
    return () => {
      globalThis.removeEventListener("keydown", onKey);
      globalThis.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);
}
