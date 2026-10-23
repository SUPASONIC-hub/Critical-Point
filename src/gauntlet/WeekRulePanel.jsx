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
 *
 * `echo` is the line a NEW GAME+ season opens on (newGamePlusCarry.js), given
 * only on that season's first page (useRunReadout): a panel of its own above
 * the week's, under a `NEW GAME+` kicker, counted on the same clock. It is
 * here rather than in SceneBriefing for the same reason the week's rule is:
 * the PlayScreen chunk had 4 bytes left (scripts/check-bundle-size.mjs).
 */
export function useWeekRulePanel(id, echo = null) {
  return useMemo(() => {
    const rule = getWeekRule(id);
    if (!rule && !echo) return NO_PANEL;
    // The clock reads the rule's line in the story too (E-9 (b)), as the panel prints it.
    const read = rule?.world ? { ...rule, text: `${rule.world} ${rule.text}` } : rule;
    return [
      [...(echo ? [{ text: echo }] : []), ...(rule ? [read] : [])],
      <>
        {echo && <SeasonEchoPanel key="season-echo" echo={echo} />}
        {rule && <WeekRulePanel key="week-rule" rules={[rule]} />}
      </>,
    ];
  }, [id, echo]);
}

/** The NEW GAME+ line, in the introduction's form (SceneBriefing's unlock panel), so it needs no CSS of its own. */
function SeasonEchoPanel({ echo }) {
  return (
    <div className="gx-panel gx-panel-breach gx-carry" data-testid="season-echo" style={{ gridArea: "auto" }}>
      <p className="gx-breach-kicker" lang="en">NEW GAME+</p>
      <ul>
        <li className="gx-mutation">
          <strong style={{ gridColumn: "1 / -1" }}>{echo}</strong>
        </li>
      </ul>
    </div>
  );
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
