import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, RotateCw } from "lucide-react";
import { getLeaderboardStatusCopy } from "../ranking.js";
import { WeeklyRuleNotice } from "../components/WeeklyRuleNotice.jsx";
import { reloadLeaderboard } from "../state/useLeaderboard.js";
import words from "../copy/ranking.js";
import { fill, LANG, SOURCE_LOCALE } from "../locale.js";

// Dates as the page's language writes them; a Korean page as it always has.
const DATE_LOCALE = LANG === SOURCE_LOCALE ? "ko-KR" : LANG;

export function RankingScreen({
  Music,
  gameTitle,
  leaderboardStatus,
  rankingHeadline,
  leaderboardError,
  leaderboard,
  runId,
  sessionCode,
  triggerLabels,
  onClose,
}) {
  // The screen replaces the page under the player's hands, so it takes focus
  // itself: without this a keyboard or screen-reader user was left on <body>,
  // with nothing said about where they now were.
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);
  // This device's best of the table before, kept when the ranking key moved on
  // (src/personalBests.js, fetched here so the entry chunk does not carry it;
  // it moves a retired key's best first). Its own line, never a row: tables
  // are not compared. A fetch that fails leaves the line out.
  const [pastBest, setPastBest] = useState(null);
  useEffect(() => {
    import("../personalBests.js").then((module) => {
      const best = module.takePastBest();
      setPastBest(best && fill(words.pastBest, best));
    }, () => {});
  }, []);
  const statusCopy = getLeaderboardStatusCopy({ status: leaderboardStatus, headline: rankingHeadline, error: leaderboardError });

  return (
      <main className="shell ranking-shell">
        <Music modeKey="intro" />
        <section className="ranking-page">
          <div className="topbar">
            <button className="ghost" type="button" onClick={() => onClose()}>
              <ArrowLeft size={16} />
              {words.back}
            </button>
            <span className="brand-mark">{gameTitle}</span>
          </div>
          <header className="ranking-hero">
            <span lang="en">PUBLIC SIGNAL BOARD</span>
            <h1 ref={headingRef} tabIndex={-1}>{words.title}</h1>
            <p>{words.intro}</p>
          </header>
          <section className="ranking-status-bar" aria-busy={statusCopy.loading}>
            <div>
              <span lang="en">{statusCopy.eyebrow}</span>
              <strong>{statusCopy.title}</strong>
              {statusCopy.text && <p>{statusCopy.text}</p>}
            </div>
            {/* One button, as the card is laid out for one: a table that could
                not be fetched offers the fetch again in place of the way out,
                which the bar above still has. */}
            {statusCopy.canRetry ? (
              <button type="button" data-testid="ranking-retry" onClick={() => reloadLeaderboard()}>
                <RotateCw size={17} aria-hidden="true" />
                {words.retry}
              </button>
            ) : (
              <button type="button" onClick={() => onClose()}>
                <ChevronRight size={17} />
                {words.makeRecord}
              </button>
            )}
          </section>
          <section className="ranking-table-panel" aria-label={words.tableLabel}>
            {/* 이번 주의 규칙: the ordinary board and the week's, in a week with a rule. */}
            <WeeklyRuleNotice view="boards" />
            <div className="ranking-table-heading">
              <div>
                <span lang="en">SEASON 1 / BEST RUN</span>
                <h2>{words.baseline}</h2>
              </div>
              {/* Not a count while there is nothing counted yet: it read
                  "0명의 기록" beside the line that said it was still loading. */}
              <small>{statusCopy.loading ? words.loadingCount : fill(words.count, { count: leaderboard.length })}</small>
            </div>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {statusCopy.loading ? "" : fill(words.loaded, { count: leaderboard.length })}
            </p>
            {statusCopy.loading ? (
              <p className="ranking-empty">{words.loading}</p>
            ) : leaderboard.length === 0 ? (
              <p className="ranking-empty">{words.empty}</p>
            ) : (
              /* A list, so a screen reader says how many rows there are and
                 where it is among them. The rows were bare <article>s, and the
                 place a bare "01". */
              <div className="ranking-list" role="list">
                {leaderboard.map((entry) => {
                  const isCurrentRun = entry.runId ? entry.runId === runId : entry.sessionCode === sessionCode;
                  // 사건당 금고 (C-1 (3)): the season's vault over its cases, shown and never sorted on; tableAfterword.js perCaseVault reads it the same way.
                  const vaultPerCase = Math.round(entry.summary?.gauntlet?.vault / entry.summary?.completedCaseCount);
                  return (
                  <div role="listitem" className={`${isCurrentRun ? "ranking-row current-player" : "ranking-row"}${entry.seasonComplete ? " season-complete" : ""}`} key={entry.id}>
                    <span className="sr-only">{fill(words.position, { position: entry.position })}{isCurrentRun ? words.mine : ""}</span>
                    <strong className="ranking-position" aria-hidden="true">{String(entry.position).padStart(2, "0")}</strong>
                    <div className="ranking-player">
                      <b>{entry.headline}</b>
                      <span className="ranking-league-badge">{entry.league}</span>
                      <span className="ranking-style-badge">{entry.handle}</span>
                      <span className={`ranking-integrity-badge ${entry.integrity?.valid ? "valid" : "invalid"}`}>{entry.integrity?.label}</span>
                      {entry.seasonComplete && <span className="season-complete-badge" aria-label={words.seasonCompleteLabel}>{words.seasonComplete}</span>}
                      {/* `entry.trigger` is always a key of triggerLabels (normalizeEntry in ranking.js). */}
                      <small>{fill(words.meta, { case: entry.caseTitle, run: entry.runLabel, trigger: triggerLabels[entry.trigger] ?? triggerLabels.responsibility })}</small>
                    </div>
                    <div className="ranking-stat">
                      <span lang="en">RANK</span>
                      <b>{entry.rank}</b>
                    </div>
                    <div className="ranking-stat score-stat">
                      <span lang="en">BURST</span>
                      <b>{entry.score}</b>
                    </div>
                    <div className="ranking-detail">
                      <span>{entry.completedAt ? new Date(entry.completedAt).toLocaleDateString(DATE_LOCALE) : words.noTime}</span>
                      <span>{fill(words.average, { seconds: entry.averageResponseTime })}</span>
                      <span>{fill(words.reframes, { count: entry.reframeCount })}</span>
                      {Number.isFinite(vaultPerCase) && <span data-testid="ranking-vault">{fill(words.vault, { value: vaultPerCase.toLocaleString("en-US") })}</span>}
                      {entry.assistTime > 1 && <span className="ranking-assist">{fill(words.tableTime, { value: entry.assistTime })}</span>}
                      {entry.assistStory && <span className="ranking-assist">{words.story}</span>}
                      {entry.newGamePlus && <span className="ranking-assist" lang="en">NEW GAME+</span>}
                      {entry.collapsed && <span className="ranking-assist">{words.collapsed}</span>}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </section>
          {pastBest && (
            <p className="ranking-footnote" data-testid="ranking-past-best">{pastBest}</p>
          )}
          <p className="ranking-footnote">{words.footnote}</p>
        </section>
      </main>
);
}
