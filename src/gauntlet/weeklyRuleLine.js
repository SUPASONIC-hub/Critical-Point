import { nextWeekRuleAt, WEEKLY_RULES, weekRuleAt } from "./weeklyRules.js";
import weekRuleCopy from "../copy/weekRule.js";
import { fill } from "../locale.js";

/** The test week's rule id (2026-W47): told as a board, not a rule. */
const TEST_WEEK_RULE = "audit-cascade";

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
  const words = weekRuleCopy.line;
  if (current) {
    // Two rules in a row (W46, then W47): the notice rides on this week's line,
    // so the next week is still told a week ahead. The test week (W47) turns
    // nothing new on since #461 (감사·연쇄 are rules of the table), so it is
    // told as what it is: a week whose runs go to a board of their own.
    const testWeekNext = next?.id === TEST_WEEK_RULE;
    const after = !next ? "" : testWeekNext ? words.testWeek.after : fill(words.after, { label: next.label, title: next.title });
    if (current.id === TEST_WEEK_RULE) {
      return {
        tone: "current",
        testWeek: true,
        kicker: first ? words.kickerFirst : words.kicker,
        label: current.label,
        text: `${words.testWeek.text}${first ? words.testWeek.first : ""}${after}`,
      };
    }
    const world = current.world ? `${current.world} ` : "";
    return {
      tone: "current",
      kicker: first ? words.kickerFirst : words.kicker,
      label: current.label,
      // A first season is not played under the rule, so it is not told it keeps it to the end.
      text: `${world}${current.text}${first ? words.first : words.keeps}${after}`,
    };
  }
  if (next) {
    return { tone: "next", kicker: words.nextKicker, label: next.label, text: fill(words.next, { title: next.title }) };
  }
  return null;
}
