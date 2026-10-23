import { nextWeekRuleAt, WEEKLY_RULES, weekRuleAt } from "./weeklyRules.js";

/**
 * The start screen's line at `ms` (WeeklyRuleViews.jsx, whose chunk it goes in: the
 * weeklyRules chunk every season loads stays as it was): this week's rule,
 * with the next week's after it when both have one, or the next week's as
 * notice, or null.
 *
 * `first` (E-8): a device's first season starts without the rule, and the
 * line says whom it is for.
 */
export function weeklyRuleLine(now, calendar = WEEKLY_RULES, { first = false } = {}) {
  const current = weekRuleAt(now, calendar);
  const next = nextWeekRuleAt(now, calendar);
  if (current) {
    // Two rules in a row (W46, then W47): the notice rides on this week's line,
    // so the next week is still told a week ahead.
    const after = next ? ` 다음 주의 규칙은 ${next.label}(${next.title}), 다음 월요일 0시부터.` : "";
    const world = current.world ? `${current.world} ` : "";
    return {
      tone: "current",
      kicker: first ? "돌아온 분석관을 위한 이번 주의 규칙" : "이번 주의 규칙",
      label: current.label,
      text: `${world}${current.text} 이번 주에 시작한 시즌은 끝까지 이 규칙으로 하고, 순위는 따로 쌓인다.${first ? " 첫 시즌은 평소 규칙으로 시작한다." : ""}${after}`,
    };
  }
  if (next) {
    return { tone: "next", kicker: "다음 주의 규칙", label: next.label, text: `${next.title}. 월요일 0시부터.` };
  }
  return null;
}
