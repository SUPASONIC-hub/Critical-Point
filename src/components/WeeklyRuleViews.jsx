import { useState } from "react";
import { nextWeekRuleAt, weekRuleAt } from "../gauntlet/weeklyRules.js";
import { selectLeaderboardWeek, useLeaderboardWeek } from "../state/useLeaderboard.js";
import { weeklyRuleNow } from "../state/weeklyClock.js";

/**
 * 이번 주의 규칙 on the start screen and the ranking screen: a chunk of its
 * own, fetched only in a week with something to say (WeeklyRuleNotice.jsx),
 * so the catalogue's words are not in the entry chunk every visit downloads.
 */

/**
 * The start screen's line: this week's rule, or the next week's as notice,
 * or nothing. Read off the weekly clock, which every test build holds on a
 * week without either (state/weeklyClock.js), so the intro the baselines
 * recorded has no such line.
 *
 * A season started this week keeps the rule to its end, and its
 * ranking is the week's own (설계안 2-2, 2-3).
 */
export function getWeeklyRuleLine(now = weeklyRuleNow()) {
  const current = weekRuleAt(now);
  if (current) {
    return {
      tone: "current",
      kicker: "이번 주의 규칙",
      label: current.label,
      text: `${current.text} 이번 주에 시작한 시즌은 끝까지 이 규칙으로 하고, 순위는 따로 쌓인다.`,
    };
  }
  const next = nextWeekRuleAt(now);
  if (next) {
    return { tone: "next", kicker: "다음 주의 규칙", label: next.label, text: `${next.title}. 월요일 0시부터.` };
  }
  return null;
}

/**
 * The line, and in a week with a rule the box that turns it down (결정 27 (1)):
 * one device key both starts read (state/weeklyRuleChoice.js, handed in by
 * WeeklyRuleNotice.jsx so the key stays in the entry chunk with the shell's
 * start). Without the rule the season is an ordinary one and goes to the
 * ordinary ranking.
 */
export function WeeklyRuleLine({ now, turnedDown, turnDown }) {
  const line = getWeeklyRuleLine(now);
  const [off, setOff] = useState(turnedDown);
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
            checked={off}
            data-testid="weekly-rule-off"
            onChange={(event) => {
              turnDown(event.target.checked);
              setOff(event.target.checked);
            }}
          />
          이번 주의 규칙 없이 시작(평소 순위로)
        </label>
      )}
    </section>
  );
}

/**
 * The ranking's two boards in a week that has a rule: the ordinary one and
 * the week's. A week without one shows the one board and no switch. The
 * two-a-day limit is shared; the percentiles read the ordinary board only
 * (결정 30, on the server).
 */
export function WeekBoards({ now }) {
  const board = useLeaderboardWeek();
  const current = weekRuleAt(now ?? weeklyRuleNow());
  if (!current) return null;
  const boards = [
    { week: null, rule: null, label: "평소 순위" },
    { week: current.week, rule: current.id, label: `이번 주의 규칙 · ${current.label}` },
  ];
  return (
    <div className="ranking-week-tabs" role="group" aria-label="순위 고르기" data-testid="ranking-week-tabs">
      {boards.map((item) => (
        <button type="button" key={item.label} aria-pressed={board.week === item.week} onClick={() => selectLeaderboardWeek(item.week, item.rule)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
