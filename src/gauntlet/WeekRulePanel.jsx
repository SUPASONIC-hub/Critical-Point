import { useMemo, useState } from "react";
import { getWeekRule } from "./weeklyRules.js";
import { getAccessibility } from "../state/accessibilitySettings.js";

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
 * `page` is what a NEW GAME+ season's case opens on (useRunReadout,
 * secondSeason.js), or null: `echo`, the line under a `NEW GAME+` kicker --
 * the season's on 프롤로그 01, the last ruling's on four cases -- and
 * `recall`, a grey line on how the last season closed this case. Both are
 * above the week's panel and on the same clock. They are here rather than in
 * SceneBriefing for the same reason the week's rule is: the PlayScreen chunk
 * had 4 bytes left (scripts/check-bundle-size.mjs).
 */
export function useWeekRulePanel(id, page = null) {
  const echo = page?.echo ?? null;
  const recall = page?.recall ?? null;
  return useMemo(() => {
    const rule = getWeekRule(id);
    if (!rule && !echo && !recall) return NO_PANEL;
    // The clock reads the rule's line in the story too (E-9 (b)), as the panel prints it.
    const read = rule?.world ? { ...rule, text: `${rule.world} ${rule.text}` } : rule;
    return [
      [...[echo, recall].filter(Boolean).map((text) => ({ text })), ...(rule ? [read] : [])],
      <>
        {recall && (
          // The case file's grey lead (play.css), so it needs no CSS of its own.
          <p className="gx-brief-lead" data-testid="season-recall" style={{ margin: 0 }}>
            {recall}
          </p>
        )}
        {echo && <SeasonEchoPanel key="season-echo" echo={echo} />}
        {rule && <WeekRulePanel key="week-rule" rules={[rule]} />}
      </>,
    ];
  }, [id, echo, recall]);
}

/**
 * E-1 (state/seenScenes.js): on a NEW GAME+ season, `page.read` is true for a
 * scene a season before read and false for one none did. A read scene opens
 * with its story and file folded -- the speaker and the question stay --
 * unless the player turned 읽은 장면 접기 off (accessibilitySettings.js); the
 * briefing's clock counts what is shown, and unfolding starts it again on
 * the whole page. Returns the scene as told, the button that unfolds it (or
 * null) and the kicker's NEW mark (or null). Here rather than in
 * SceneBriefing, which is the PlayScreen chunk's, as the lines above are.
 */
export function useSceneFold(node, page = null) {
  const [folded, setFolded] = useState(() => page?.read === true && getAccessibility().foldReadScenes);
  const told = useMemo(() => (folded ? { ...node, lead: null, text: "", memo: [] } : node), [folded, node]);
  return [
    told,
    folded ? (
      <button type="button" className="ghost" data-testid="scene-unfold" onClick={() => setFolded(false)}>
        지난 시즌에 읽은 장면 · 펼치기
      </button>
    ) : null,
    page?.read === false ? <b data-testid="scene-new"> · NEW</b> : null,
  ];
}

/**
 * B-14(1) 「지난 시즌의 당신」 (state/pastPicks.js): `picked` is the id of the
 * card the season before picked in this scene (the page's `picked`), `id` a
 * card's. The tag sits on the card's top edge opposite its type, in the wild
 * card's name's place (play.css), so it costs a card no height; on a phone
 * the `i` is clipped to 「지난 시즌」 and a screen reader reads the whole
 * 「지난 시즌의 당신이 고른 카드」, which starts with what is shown (WCAG 2.5.3).
 * Its last words are an `i` of no size rather than .sr-only, which is a box of
 * its own and was read with a space before it (「당신 이 고른」).
 * The wild card has its name there: in the briefing (`wild` 1) it gets only
 * the words for a screen reader, and in the hand (`wild` 2) this is its burn
 * line, 「지난 시즌에도 다시 짰다」 in place of 「이 판을 다시 연다」. A mark
 * only: nothing the commit, the clock or the ranking reads. Here rather than
 * in the briefing and the hand for the reason the lines above are.
 */
export function pastPick(picked, id, wild = 0) {
  const hit = !!picked && picked === id;
  if (wild === 2) return hit ? "지난 시즌에도 다시 짰다" : "이 판을 다시 연다";
  if (!hit) return null;
  return wild ? (
    <span className="sr-only" data-testid="past-pick-wild"> 지난 시즌의 당신이 고른 카드</span>
  ) : (
    <span className="gx-card-type gx-card-name" data-testid="past-pick">
      <span className="sr-only"> </span>지난 시즌<i>의 당신</i><i style={{ fontSize: 0 }}>이 고른 카드</i>
    </span>
  );
}

/**
 * The NEW GAME+ line, in the introduction's form (SceneBriefing's unlock panel), so it needs no CSS of its own.
 * Drawn after the page's grid, it is raised to just under the title strip (`order: -1`, as .gx-comic-top is in
 * briefing.css): under the case file, a phone had to scroll to it (운영화면 문제 5-2).
 */
function SeasonEchoPanel({ echo }) {
  return (
    <div className="gx-panel gx-panel-breach gx-carry" data-testid="season-echo" style={{ gridArea: "auto", order: -1 }}>
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
