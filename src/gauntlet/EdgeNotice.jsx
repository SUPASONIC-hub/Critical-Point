import { useEffect, useRef, useState } from "react";
import { CASE_SEQUENCE } from "../gameCases.js";
import { useAccessibility } from "../state/accessibilitySettings.js";

/**
 * The office's noise at the table's edge (개선 포인트 A5, the form it kept).
 *
 * The note asked for a screen that fills with spam, a boss's messenger and
 * blinking lamps as the stake grows, and kept only this: one or two notices at
 * the edge that never cover a number, and a switch that turns them off
 * (편의 설정, `edgeNotices`). So a hand pushed a third time gets a message,
 * and a sixth a mail, from someone the act is about; each stays a few seconds
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
 * The case each act opens with, in CASE_SEQUENCE's order: 0막 is the 프롤로그,
 * then 사건 01, 08, 13, 19, 25, 31, 37 and 43, the last running to the finale.
 */
export const EDGE_ACTS = Object.freeze(["prologue01", "case01", "case08", "case13", "case19", "case25", "case31", "case37", "case43"]);

/**
 * Who writes, act by act (B-15): someone the act is about, in words the act's
 * cases say or could, never a number. Each act has a message and a mail.
 */
export const EDGE_NOTICES = Object.freeze([
  [{ from: "메신저 · 오진우", lines: ["사유 칸은 채웠어요?", "팀장님이 결론만 보재요."] }, { from: "메일 · 심사팀", lines: ["[회신] 심사팀장 검토 의견", "[안내] 판매 적정성 사후 점검"] }],
  [{ from: "메신저 · 한서윤", lines: ["기타 무형자산, 다시 봐요.", "결론은 오늘 안에 부탁해요."] }, { from: "메일 · 감사팀", lines: ["[면담] 플로우온 대출 서류", "[확인] 강서지점 판매 목표표"] }],
  [{ from: "메신저 · 문가을", lines: ["말로 하지 말고 와서 떡이나 쪄요.", "설명회, 오늘 저녁이죠?"] }, { from: "메일 · 의원실", lines: ["[요청] 참고인 답변 자료", "[긴급] 익명의 A씨 확인"] }],
  [{ from: "메신저 · 강태민", lines: ["컵라면 사 줘요.", "야간조는 새벽에 끝나요."] }, { from: "메일 · 그룹전략실", lines: ["[혁신위] 과거는 정리되었습니다", "[검토] 상생 발표 대본"] }],
  [{ from: "메신저 · 이민서", lines: ["노아가 벌써 답을 냈어요.", "마지막 출근은 금요일이래요."] }, { from: "메일 · 인사팀", lines: ["[안내] 조직 개편", "[제출] 개인별 인수인계서"] }],
  [{ from: "메신저 · 나준혁", lines: ["군산에 줄이 섰어요.", "오늘 내려갑니다. 도장 챙겨서요."] }, { from: "메일 · 위험관리부", lines: ["[심사] 르하임 고덕 의견서", "[재요청] 작성자 칸 서명"] }],
  [{ from: "메신저 · 백아린", lines: ["가요, 이번엔 제가 괜찮아요.", "회사 답이 사흘 만에 왔어요."] }, { from: "메일 · 법무팀", lines: ["[공지] 사내 자료 반출 금지", "[요청] 수첩 제출"] }],
  [{ from: "메신저 · 서하린", lines: ["파일이 다 풀렸어요.", "이번에는 온대요, 증인석에."] }, { from: "메일 · 변호인단", lines: ["[변론] 원고 명단 확인", "[요청] 반응 기록 원본 보존"] }],
  [{ from: "메신저 · 윤상혁", lines: ["이제 빈 서명란 이야기를 하지.", "이야기는 거기서 하지."] }, { from: "메일 · 심사위원회", lines: ["[소집] 추석 다음 날 임시 심사", "[확인] 파쇄 목록"] }],
]);

export const EDGE_NOTICE_MS = 4000;

/** The act a case is in (0-8); a case outside the season's order reads as 0막. */
export function edgeActOf(caseId) {
  const position = CASE_SEQUENCE.indexOf(caseId);
  return Math.max(0, EDGE_ACTS.findLastIndex((first) => CASE_SEQUENCE.indexOf(first) <= position));
}

/** The notice a window's press count brings in a case, or null. `n` picks its line, so windows differ. */
export function pickEdgeNotice(pushes, n = 0, caseId) {
  const notice = EDGE_NOTICES[edgeActOf(caseId)][EDGE_AT.indexOf(pushes)];
  return notice ? { from: notice.from, line: notice.lines[n % notice.lines.length] } : null;
}

const STILL = "(prefers-reduced-motion: reduce)";
let shown = 0;

/** `voice` is the table voice's facts (TableNotices): its presses, its case, and whether the table is running. */
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
    const next = pickEdgeNotice(pushes, shown, voice.caseId);
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
