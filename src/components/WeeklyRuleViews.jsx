import { useState } from "react";
import { weeklyRuleLine } from "../gauntlet/weeklyRuleLine.js";
import { weekBoardsAt } from "../gauntlet/weeklyRules.js";
import { selectLeaderboardWeek, useLeaderboardWeek } from "../state/useLeaderboard.js";
import { weeklyRuleNow } from "../state/weeklyClock.js";
import { fill } from "../locale.js";
import weekRuleCopy from "../copy/weekRule.js";

/**
 * 이번 주의 규칙 on the start screen and the ranking screen: a chunk of its
 * own, fetched only in a week with something to say (WeeklyRuleNotice.jsx),
 * so the catalogue's words are not in the entry chunk every visit downloads.
 */

/**
 * The start screen's line (gauntlet/weeklyRuleLine.js): this week's
 * rule, with the next week's after it when both have one, or the next week's
 * as notice, or nothing. Read off the weekly clock, which every test build
 * holds on a week without either (state/weeklyClock.js), so the intro the baselines
 * recorded has no such line.
 *
 * A season started this week keeps the rule to its end, and its
 * ranking is the week's own (설계안 2-2, 2-3).
 */
function getWeeklyRuleLine(now = weeklyRuleNow(), { first = false } = {}) {
  return weeklyRuleLine(now, undefined, { first });
}

/**
 * The line, and in a week with a rule the box that turns it down (결정 27 (1)),
 * or on a device's first season the box that takes it up (`first`, E-8):
 * one device key each, which both starts read (state/weeklyRuleChoice.js, handed in by
 * WeeklyRuleNotice.jsx so the key stays in the entry chunk with the shell's
 * start). Without the rule the season is an ordinary one and goes to the
 * ordinary ranking.
 */
export function WeeklyRuleLine({ now, first = false, ticked, tick }) {
  const line = getWeeklyRuleLine(now, { first });
  const [on, setOn] = useState(ticked);
  if (!line) return null;
  return (
    <section className={`weekly-rule-notice is-${line.tone}`} data-testid="weekly-rule-line" aria-label={line.kicker}>
      <p>
        <strong>{line.kicker}</strong> <span lang="en">{line.label}</span> {line.text}
      </p>
      {line.tone === "current" && (
        <label className="cloud-save-toggle">
          <input
            type="checkbox"
            checked={on}
            data-testid={first ? "weekly-rule-on" : "weekly-rule-off"}
            onChange={(event) => {
              tick(event.target.checked);
              setOn(event.target.checked);
            }}
          />
          {line.testWeek ? (first ? weekRuleCopy.testWeekTakeUp : weekRuleCopy.testWeekTurnDown) : first ? weekRuleCopy.takeUp : weekRuleCopy.turnDown}
        </label>
      )}
    </section>
  );
}

/**
 * The ranking's boards in a week that has a rule, or the week after one: the
 * ordinary one and the week's, this week's first and last week's after it
 * (weekBoardsAt), so a season finished after the rule week ended is still on
 * a board the screen can open. A week with neither shows the one board and
 * no switch. The two-a-day limit is shared; the percentiles read the ordinary
 * board only (결정 30, on the server).
 */
export function WeekBoards({ now }) {
  const board = useLeaderboardWeek();
  const weeks = weekBoardsAt(now ?? weeklyRuleNow());
  if (weeks.length === 0) return null;
  const boards = [
    { week: null, rule: null, label: weekRuleCopy.ordinaryBoard },
    ...weeks.map((item) => ({ week: item.week, rule: item.rule, label: fill(item.last ? weekRuleCopy.lastWeekBoard : weekRuleCopy.weekBoard, { label: item.label }) })),
  ];
  return (
    <div className="ranking-week-tabs" role="group" aria-label={weekRuleCopy.boardsLabel} data-testid="ranking-week-tabs">
      {boards.map((item) => (
        <button type="button" key={item.week ?? "ordinary"} aria-pressed={board.week === item.week} onClick={() => selectLeaderboardWeek(item.week, item.rule)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
