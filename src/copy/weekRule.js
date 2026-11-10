import { localizeTables } from "../locale.js";

/**
 * 이번 주의 규칙 on the start screen and the ranking screen
 * (WeeklyRuleViews.jsx, a chunk of its own): the words it prints, read by
 * key so another language can be laid over them (src/locale.js, 다국어 틀).
 * The Korean is the views' own, moved here unchanged, with the start
 * screen's line (gauntlet/weeklyRuleLine.js). A rule's own words are
 * src/copy/weekRules.js, which the catalogue reads.
 */
const weekRuleCopy = {
  takeUp: "이번 주의 규칙으로 시작(이번 주 순위로)",
  turnDown: "이번 주의 규칙 없이 시작(평소 순위로)",
  testWeekTakeUp: "이번 주 기록을 시험 주 순위에 따로 쌓기",
  testWeekTurnDown: "이번 주 기록을 시험 주 순위에 쌓지 않기(평소 순위로)",
  boardsLabel: "순위 고르기",
  ordinaryBoard: "평소 순위",
  weekBoard: "이번 주의 규칙 · {label}",
  lastWeekBoard: "지난주의 규칙 · {label}",
  line: {
    kicker: "이번 주의 규칙",
    kickerFirst: "돌아온 분석관을 위한 이번 주의 규칙",
    nextKicker: "다음 주의 규칙",
    first: " 첫 시즌은 평소 규칙으로 시작한다.",
    keeps: " 이번 주에 시작한 시즌은 끝까지 이 규칙으로 하고, 순위는 따로 쌓인다.",
    after: " 다음 주의 규칙은 {label}({title}), 다음 월요일 0시부터.",
    next: "{title}. 월요일 0시부터.",
    testWeek: {
      text: "감사·연쇄는 이제 상시 규칙이다. 이번 주(시험 주) 기록은 시험 주 순위에 따로 쌓인다.",
      first: " 첫 시즌은 평소 순위에 쌓인다.",
      after: " 다음 주는 시험 주: 감사·연쇄는 이제 상시 규칙이고, 다음 월요일 0시부터 그 주 기록은 시험 주 순위에 따로 쌓인다.",
    },
  },
};
export default weekRuleCopy;

localizeTables("screens", { weekRule: weekRuleCopy });
