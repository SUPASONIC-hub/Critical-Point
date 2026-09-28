import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Where the control that opened a screen can be found again. The screen it
 * opens replaces `<main>`, so the button itself is gone by the time the screen
 * closes and a new one stands in its place: what survives is how to find it.
 */
function describeOpener(element) {
  if (!(element instanceof HTMLElement) || element === document.body) return null;
  if (element.id) return { selector: `#${CSS.escape(element.id)}`, index: 0 };
  const classes = [...element.classList].map((name) => `.${CSS.escape(name)}`).join("");
  const selector = `${element.tagName.toLowerCase()}${classes}`;
  return { selector, index: [...document.querySelectorAll(selector)].indexOf(element) };
}

function restoreFocus(opener) {
  const found = opener ? document.querySelectorAll(opener.selector)[opener.index] : null;
  // Opened from a screen that is not the one returned to (the result page's
  // ranking button closes onto the intro): the page's heading is where a
  // reader starts.
  const target = found instanceof HTMLElement ? found : document.querySelector("main h1");
  if (!(target instanceof HTMLElement)) return;
  if (target !== found && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/**
 * 랭킹 and 게시판: two screens that stand in for the whole page. The pre-start
 * shell and the runtime each kept a pair of booleans for them, Escape closed
 * the ranking in the runtime's copy only and the board in neither, and closing
 * either one dropped focus on `<body>`. One hook, used by both, so a key or a
 * focus rule cannot be true in one and missing in the other.
 */
export function useOverlayScreens() {
  const [screen, setScreen] = useState(null);
  const openerRef = useRef(null);
  const wasOpenRef = useRef(false);

  const show = useCallback((name, open) => {
    if (open) openerRef.current = describeOpener(document.activeElement);
    setScreen((current) => (open ? name : current === name ? null : current));
  }, []);
  const setShowRanking = useCallback((open) => show("ranking", open), [show]);
  const setShowBoard = useCallback((open) => show("board", open), [show]);

  useEffect(() => {
    if (!screen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !event.defaultPrevented) setScreen(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [screen]);

  useEffect(() => {
    if (screen) {
      wasOpenRef.current = true;
      return undefined;
    }
    if (!wasOpenRef.current) return undefined;
    wasOpenRef.current = false;
    // A frame later: the screen underneath is mounted by then.
    const frame = window.requestAnimationFrame(() => restoreFocus(openerRef.current));
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);

  return { showRanking: screen === "ranking", showBoard: screen === "board", setShowRanking, setShowBoard };
}
