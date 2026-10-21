import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "../state/accessibilitySettings.js";

/**
 * The office's noise at the table's edge (개선 포인트 A5, the form it kept).
 *
 * The note asked for a screen that fills with spam, a boss's messenger and
 * blinking lamps as the stake grows, and kept only this: one or two notices at
 * the edge that never cover a number, and a switch that turns them off
 * (편의 설정, `edgeNotices`). So a hand pushed a third time gets a message
 * from upstairs, and a sixth a mail; each stays a few seconds and goes.
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

/** The press that brings each notice, and what it says. A window shows each once. */
export const EDGE_NOTICES = Object.freeze([
  { at: 3, from: "메신저 · 위층", lines: ["결론은 언제 나와요?", "위에서 또 찾습니다.", "오늘 안에만 부탁해요."] },
  { at: 6, from: "메일 · 읽지 않음", lines: ["[회신 요망] 보도 대응 문안", "[긴급] 내일 아침 보고 일정", "[재요청] 아직 답이 없습니다"] },
]);

export const EDGE_NOTICE_MS = 4000;

/** The notice a window's press count brings, or null. `n` picks its line, so windows differ. */
export function pickEdgeNotice(pushes, n = 0) {
  const notice = EDGE_NOTICES.find((item) => item.at === pushes);
  return notice ? { from: notice.from, line: notice.lines[n % notice.lines.length] } : null;
}

const STILL = "(prefers-reduced-motion: reduce)";
let shown = 0;

/** `voice` is the table voice's facts (TableNotices): its presses, and whether the table is running. */
export function EdgeNotice({ voice }) {
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
    const next = pickEdgeNotice(pushes, shown);
    if (next || pushes === 0) setNotice(next);
  }

  // Each notice keeps its own few seconds, whatever is pressed meanwhile.
  useEffect(() => {
    if (!notice) return;
    shown += 1;
    const still = globalThis.matchMedia?.(STILL).matches || document.documentElement.hasAttribute("data-calm-effects");
    if (!still) ref.current?.animate?.([{ transform: "translateY(-150%)" }, { transform: "none" }], { duration: 240, easing: "ease-out" });
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

// One line over the top left of the header, where the scene's title is: the
// header's buttons keep the right (136px on a 360px phone), and the case's
// count under the title starts below the line (checked at 390x664 and
// 1280x800, .claude/shots-20261021/a5).
const STYLE = {
  position: "fixed",
  zIndex: 30,
  left: "max(8px, env(safe-area-inset-left))",
  top: "max(8px, env(safe-area-inset-top))",
  maxWidth: "min(22rem, 100vw - 136px)",
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
