import { localizeTables } from "../locale.js";

/**
 * The briefing's asides (gauntlet/WeekRulePanel.jsx, ReadingClockAsk.jsx; components/ComfortDialog.jsx): the
 * words they print, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screens' own, moved here
 * unchanged.
 */
const edgeCopy = {
  // WeekRulePanel.jsx
  weekRule: "이번 주의 규칙 · 이 시즌이 끝날 때까지",
  unfold: "지난 시즌에 읽은 장면 · 펼치기",
  pastPick: {
    // The wild card's burn line in the hand: picked the season before, and not.
    wildPicked: "지난 시즌에도 다시 짰다",
    wild: "이 판을 다시 연다",
    // The wild card in the briefing, to a screen reader only.
    wildSr: " 지난 시즌의 당신이 고른 카드",
    // A card's tag, in three parts: what a phone shows, what is clipped there, what only a screen reader hears.
    shown: "지난 시즌",
    clipped: "의 당신",
    heard: "이 고른 카드",
  },
  // ReadingClockAsk.jsx
  ask: {
    kicker: "읽는 시간이 끝났다",
    question: "다 읽고 직접 열기로 바꿀까요?",
    note: "바꾸면 장면이 저절로 넘어가지 않고, 판 열기를 눌러야 판이 열린다. 편의 설정에서 되돌릴 수 있다.",
    hold: "직접 열기로 바꾼다",
    keep: "시계에 맡긴다",
  },
  // ComfortDialog.jsx
  comfort: {
    title: "편의 설정",
    close: "닫기",
    note: "이 창이 열려 있는 동안 테이블 시계는 멈춥니다.",
  },
};
export default edgeCopy;

localizeTables("screens", { edge: edgeCopy });
