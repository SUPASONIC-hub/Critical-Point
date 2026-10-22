import { useMemo } from "react";
import { getWeekRule } from "./weeklyRules.js";

/**
 * 이번 주의 규칙 on a case's opening page: a panel of its own under the page's
 * grid (결정 28 (1)), and the list the briefing's reading clock counts it in.
 *
 * A file of its own (WEEK_RULE_PANEL in vite.config.js), for the same reason
 * as the table's sound: left in SceneBriefing it is written into the
 * PlayScreen chunk, which had no room for it (scripts/check-bundle-size.mjs).
 * The table's chunk imports it statically, so it is fetched with the table
 * and the page draws it no later. Which page carries it is tableStaging's
 * `getBriefingWeekRuleId`; this reads the rule of the id that answered, and
 * nothing for an id the catalogue does not have.
 */

const NO_PANEL = Object.freeze([Object.freeze([]), null]);

/**
 * The rule as a list of one for the reading clock, and the panel that prints
 * it (null without a rule), both kept while the id is the same.
 */
export function useWeekRulePanel(id) {
  return useMemo(() => {
    const rule = getWeekRule(id);
    // The clock reads the rule's line in the story too (E-9 (b)), as the panel prints it.
    const read = rule?.world ? { ...rule, text: `${rule.world} ${rule.text}` } : rule;
    return rule ? [[read], <WeekRulePanel key="week-rule" rules={[rule]} />] : NO_PANEL;
  }, [id]);
}

/**
 * The rows are SceneBriefing's RuleRows for a rule with no axis and no tool
 * that softens it, which a week's rule never has. `gridArea` undoes the
 * breach panel's named area, which the page has not.
 */
function WeekRulePanel({ rules }) {
  return (
    <div className="gx-panel gx-panel-breach gx-carry" data-testid="week-rule-panel" style={{ gridArea: "auto" }}>
      <p className="gx-breach-kicker">이번 주의 규칙 · 이 시즌이 끝날 때까지</p>
      <ul>
        {rules.map((rule) => (
          <li key={rule.id} className={`gx-mutation mut-${rule.id}`}>
            <b lang="en">{rule.label}</b>
            <strong>{rule.title}</strong>
            {rule.world && <small>{rule.world}</small>}
            <small>{rule.text}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
