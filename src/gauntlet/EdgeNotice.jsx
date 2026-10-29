import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAccessibility } from "../state/accessibilitySettings.js";
import edgeNoticesCopy from "../copy/edgeNotices.js";

/**
 * The office's noise at the table's edge (개선 포인트 A5, the form it kept).
 *
 * The note asked for a screen that fills with spam, a boss's messenger and
 * blinking lamps as the stake grows, and kept only this: one or two notices at
 * the edge that never cover a number, and a switch that turns them off
 * (편의 설정, `edgeNotices`). So a hand pushed a third time gets a message,
 * and a sixth a mail, from someone the case is about; each stays a few seconds
 * and goes.
 *
 * It does not say what the table already says. The heat, the wall's band and
 * the tier are the meter's, the tab's (TAB_TITLES) and the voice's
 * (tableVoice.js); a notice carries no number and no reading of the board,
 * only that someone is waiting on the decision. It is counted in presses, the
 * stake the player chose, not in heat, so it never doubles the tension's own
 * steps.
 *
 * Silent to a screen reader (`aria-hidden`): it is noise, and the table's one
 * polite region is kept for what a decision turns on. It takes no pointer, so
 * a press meant for the table below lands there. Under reduced motion, or with
 * 번쩍임·흔들림 줄이기 on, it appears and goes without sliding.
 *
 * A file of its own (EDGE_NOTICE in vite.config.js), the way the week's panel
 * is, with its style inline: the PlayScreen chunk and play.css have no room
 * for it (scripts/check-bundle-size.mjs, scripts/check-css-structure.mjs).
 */

/** The presses that bring a notice: the third a message, the sixth a mail. A window shows each once. */
export const EDGE_AT = Object.freeze([3, 6]);

/**
 * Who writes, case by case (B-15, per case since 2026-10-24, user's decision):
 * for each case in CASE_SEQUENCE a message from someone the player has met by
 * then and a mail from an office that case's own scenes name, about what is
 * already happening in it, never a later case's news and never a number. Each
 * entry is [name, line, line] for the message and [office, line, line] for the
 * mail; the "메신저 · " and "메일 · " labels are put on when it is read. A per-act
 * table (nine pairs) showed 프롤로그 01-05 the sales check that only begins in 04.
 * The words are copy/edgeNotices.js's (`notices`, `kinds`), where another language
 * lays its own over them (2026-10-26).
 */
export const EDGE_NOTICES = edgeNoticesCopy.notices;

const EDGE_NOTICE_MS = 4000;

/** The notice a window's press count brings in a case, or null. `n` picks its line, so windows differ; a case not in the table reads as 프롤로그 01. */
export function pickEdgeNotice(pushes, n = 0, caseId) {
  const kind = EDGE_AT.indexOf(pushes);
  if (kind < 0) return null;
  const [from, ...lines] = (EDGE_NOTICES[caseId] || EDGE_NOTICES.prologue01)[kind];
  return { from: edgeNoticesCopy.kinds[kind] + from, line: lines[n % lines.length] };
}

const STILL = "(prefers-reduced-motion: reduce)";
let shown = 0;

/** `voice` is the table voice's facts (TableNotices): its presses, and whether the table is running; `caseId` picks the case's lines. */
export function EdgeNotice({ voice, caseId }) {
  const pushes = voice.win.pushes;
  const live = voice.speaking;
  const { edgeNotices } = useAccessibility();
  const [notice, setNotice] = useState(null);
  const [seen, setSeen] = useState(pushes);
  const ref = useRef(null);

  // A press that brings a notice puts it up; any other leaves the one up be,
  // and a new window (no presses yet) takes the last one's down.
  if (seen !== pushes) {
    setSeen(pushes);
    const next = pickEdgeNotice(pushes, shown, caseId);
    if (next || pushes === 0) setNotice(next);
  }

  // Over the action bar as it stands: its buttons wrap with the font and the
  // width, and a press can rewrap them while the notice is up, so its top is
  // read now and again whenever it moves (STYLE's bottom is the fallback).
  useLayoutEffect(() => {
    const bar = document.querySelector(".gx-actions");
    if (!bar || !notice) return;
    const place = () => {
      const top = bar.getBoundingClientRect().top;
      if (ref.current && top) ref.current.style.bottom = `${Math.max(8, window.innerHeight - top + 8)}px`;
    };
    place();
    const watch = globalThis.ResizeObserver && new ResizeObserver(place);
    watch?.observe(bar);
    return () => watch?.disconnect();
  }, [notice, live, edgeNotices]);

  // Each notice keeps its own few seconds, whatever is pressed meanwhile.
  useEffect(() => {
    if (!notice) return;
    shown += 1;
    const still = globalThis.matchMedia?.(STILL).matches || document.documentElement.hasAttribute("data-calm-effects");
    if (!still) ref.current?.animate?.([{ transform: "translateX(-110%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 240, easing: "ease-out" });
    const timer = setTimeout(() => setNotice(null), EDGE_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!notice || !live || !edgeNotices) return null;
  return (
    <div ref={ref} className="gx-edge-notice" data-testid="edge-notice" aria-hidden="true" style={STYLE}>
      <b style={{ color: "var(--ui-text-2)", fontSize: "0.6875rem" }}>{notice.from}</b> {notice.line}
    </div>
  );
}

// One line at the bottom left, 8px above the action bar (.gx-actions, fixed
// at the bottom; its top is measured when the notice is drawn): the space between the
// last card and the bar on a phone, under the left column on a laptop. It sat
// over the scene's title at the top left until 2026-10-23 and covered it for
// four seconds (운영화면 문제 5-1, user's choice 1).
const STYLE = {
  position: "fixed",
  zIndex: 30,
  left: "max(8px, env(safe-area-inset-left))",
  bottom: "calc(96px + env(safe-area-inset-bottom))",
  maxWidth: "min(22rem, 100vw - 16px)",
  padding: "5px 10px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  background: "var(--ui-surface-2)",
  border: "1px solid var(--ui-line)",
  borderLeftWidth: 3,
  borderRadius: "var(--ui-radius-sm)",
  color: "var(--ui-text)",
  fontSize: "0.8125rem",
  lineHeight: 1.4,
  pointerEvents: "none",
};
