import { useEffect, useState } from "react";
import { MessagesSquare, X } from "lucide-react";
import { weekRuleAt } from "../gauntlet/weeklyRules.js";
import { weeklyRuleNow } from "../state/weeklyClock.js";
import { getSideSlot } from "../sideCases.js";
import { fetchBoardPosts } from "../telemetry.js";
import { countPostsSince, newSideCases, sinceLastLines } from "../sinceLastItems.js";
import { fill } from "../locale.js";
import words from "../copy/sinceLast.js";

// One read of the newest posts; a full page is said as 「… 이상」.
const POST_LIMIT = 50;

/**
 * 「지난번 이후」 (N24): a chunk of its own, fetched by SinceLastSlot.jsx only
 * on a return after three days or more. It borrows the resume card's look
 * (`.resume-panel`), so no style is added, and says only what is there: the
 * case a save is in, this week's rule, the side cases listed since the last
 * visit (on a device that has them open) and the board's posts since then.
 * With none of them it draws nothing. The board is read the way the board
 * screen reads it; a board that cannot be reached just leaves its line out.
 */
export function SinceLastCard({ visit, view, onClose }) {
  const { start, season, common } = view;
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    let live = true;
    fetchBoardPosts(POST_LIMIT)
      .then(({ rows }) => live && setPosts(countPostsSince(rows, visit.since)))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [visit.since]);

  const slot = getSideSlot({ newGamePlusUnlocked: start.newGamePlusUnlocked, caseResults: season.caseResults });
  const lines = sinceLastLines(words, {
    resume: start.hasResumableSave ? common.activeCaseMeta : null,
    rule: weekRuleAt(weeklyRuleNow()),
    sides: newSideCases(slot, visit.sides),
    posts,
    postLimit: POST_LIMIT,
  });
  if (!lines.length) return null;
  return (
    <section className="resume-panel" data-testid="since-last-card" aria-label={words.label}>
      <div>
        <span>{fill(words.heading, { days: visit.days })}</span>
        {lines.map((line) => (
          <small key={line.key} data-testid={`since-last-${line.key}`}>
            {line.text}
          </small>
        ))}
      </div>
      <div>
        {posts > 0 && (
          <button type="button" onClick={() => common.setShowBoard(true)}>
            <MessagesSquare size={16} aria-hidden="true" />
            {words.board}
          </button>
        )}
        <button type="button" data-testid="since-last-close" onClick={onClose}>
          <X size={16} aria-hidden="true" />
          {words.close}
        </button>
      </div>
    </section>
  );
}
