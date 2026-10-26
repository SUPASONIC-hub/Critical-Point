import { nextWeekRuleAt, WEEKLY_RULES, weekRuleAt } from "./weeklyRules.js";
import weekRuleCopy from "../copy/weekRule.js";
import { fill } from "../locale.js";

/** A rule with its words in the page's language (src/copy/weekRule.js `rules`), or null. */
const inWords = (rule) => (rule ? { ...rule, ...weekRuleCopy.rules[rule.id] } : null);

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
  const current = inWords(weekRuleAt(now, calendar));
  const next = inWords(nextWeekRuleAt(now, calendar));
  const words = weekRuleCopy.line;
  if (current) {
    // Two rules in a row (W46, then W47): the notice rides on this week's line,
    // so the next week is still told a week ahead.
    const after = next ? fill(words.after, { label: next.label, title: next.title }) : "";
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
