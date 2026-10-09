import { useEffect, useLayoutEffect, useRef } from "react";

import { REFRAME_CARD_ID } from "./gauntletEngine.js";
import { getAccessibility, useShortcutHints } from "../state/accessibilitySettings.js";

const isTextField = (target) =>
  target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']");

// A focused button inside a dialog answers Space and Enter itself. Taking
// those keys from it made the draft's relic buttons, and any control on the
// briefing page, unreachable from the keyboard. A folded note's summary is
// such a control too.
const isDialogButton = (target, selector) => target instanceof HTMLElement && target.matches(`${selector} button, ${selector} summary`);

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
 * E and Q are the table's only while the case has LOCK and the stances on
 * (`tableUnlocks`): the stage hands over no `focus` or `cycleFocusMode` before
 * then, and the key is left alone like any letter the table has no use for.
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
 * A held key repeats, and a repeat is not a second press -- but it is still
 * the table's key. The handler used to leave a repeat alone before it had
 * claimed it, so the repeat went on to whatever held focus as a key of its own:
 * with the pointer's focus left on 밀어붙인다, holding Space pushed once from
 * here and once more from the button when the key came up, and a second push
 * can be the wall. A repeat of a key the table would have taken is claimed and
 * does nothing.
 *
 * The handler is installed once and reads the stage's current actions through
 * a ref, so it never sees a stale window.
 *
 * Returns what the table's controls may say about these keys (see
 * `useShortcutHints`): with the single-key shortcuts off, the digits and
 * letters are neither announced nor drawn.
 */
export function useTableKeys(actions) {
  const hints = useShortcutHints();
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
      handleTableKey(event, actionsRef.current, walked);
    };
    globalThis.addEventListener("keydown", onKey);
    globalThis.addEventListener("pointerdown", onPointer, true);
    return () => {
      globalThis.removeEventListener("keydown", onKey);
      globalThis.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);

  return hints;
}

/**
 * One keydown against the table as it stands. `current` is the stage's
 * actions and state; `walked` is whether focus got where it is by Tab.
 * Exported for the unit tests, which press keys no browser has to be open for.
 */
export function handleTableKey(event, current, walked = false) {
  if (event.defaultPrevented) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (isTextField(event.target)) return;
  if (document.querySelector(".decision-reveal-backdrop")) return;
  const key = event.key;
  // Single-character keys off (the comfort setting, WCAG 2.1.4): a letter,
  // a digit or a jamo does nothing. Space, Enter and Escape are not
  // character keys and stay.
  if (!getAccessibility().letterKeys && key.length === 1 && key !== " ") return;
  const letter = letterOf(event);
  const activation = key === " " || key === "Enter";
  // The key is the table's: the page does not get it, and the action runs
  // once however long the key is held.
  const take = (action) => {
    event.preventDefault();
    if (!event.repeat) action();
  };

  if (current.draftOpen) {
    // The draft is the decision on screen: nothing reaches the table behind it.
    if (activation && isDialogButton(event.target, ".gx-draft")) return;
    const pick = key === "Escape" ? null : current.relicOffer[Number(key) - 1];
    if (key === "Escape" || pick) take(() => current.pickRelic(pick ?? null));
    else if (activation) event.preventDefault();
    return;
  }

  // The briefing opens the table on the key that pushes -- whatever the
  // player's hand is already resting on -- and a card key opens it with
  // that card staked.
  if (current.briefingOpen) {
    if (activation && isDialogButton(event.target, ".gx-comic")) return;
    const cardId = cardIdForKey(key, current.cards, current.reframeChoice);
    if (activation || letter === "w" || cardId) take(() => current.openTable(cardId));
    return;
  }

  if (!current.tableOpen) return;
  if (activation && walked && isControl(event.target)) return;
  if (letter === "e" && current.focus) take(() => current.focus(event));
  else if (letter === "q" && current.cycleFocusMode) take(() => current.cycleFocusMode());
  else if (key === " " || letter === "w") take(() => current.push(event));
  else if (key === "Enter") take(() => current.cash());
  else {
    const cardId = cardIdForKey(key, current.cards, current.reframeChoice);
    if (cardId) take(() => current.select(cardId));
  }
}
