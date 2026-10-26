import { localizeTables } from "../locale.js";

/**
 * 이번 주의 규칙 on the start screen and the ranking screen
 * (WeeklyRuleViews.jsx, a chunk of its own): the words it prints, read by
 * key so another language can be laid over them (src/locale.js, 다국어 틀).
 * The Korean is the views' own, moved here unchanged. The line itself is
 * gauntlet/weeklyRuleLine.js's.
 */
const weekRuleCopy = {
  takeUp: "이번 주의 규칙으로 시작(이번 주 순위로)",
  turnDown: "이번 주의 규칙 없이 시작(평소 순위로)",
  boardsLabel: "순위 고르기",
  ordinaryBoard: "평소 순위",
  weekBoard: "이번 주의 규칙 · {label}",
};
export default weekRuleCopy;

localizeTables("screens", { weekRule: weekRuleCopy });
