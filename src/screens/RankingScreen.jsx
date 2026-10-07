import { useEffect, useRef } from "react";
import { ArrowLeft, ChevronRight, RotateCw } from "lucide-react";
import { getLeaderboardStatusCopy } from "../ranking.js";
import { reloadLeaderboard } from "../state/useLeaderboard.js";

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
  const statusCopy = getLeaderboardStatusCopy({ status: leaderboardStatus, headline: rankingHeadline, error: leaderboardError });

  return (
      <main className="shell ranking-shell">
        <Music modeKey="intro" />
        <section className="ranking-page">
          <div className="topbar">
            <button className="ghost" type="button" onClick={() => onClose()}>
              <ArrowLeft size={16} />
              브리핑으로 돌아가기
            </button>
            <span className="brand-mark">{gameTitle}</span>
          </div>
          <header className="ranking-hero">
            <span lang="en">PUBLIC SIGNAL BOARD</span>
            <h1 ref={headingRef} tabIndex={-1}>어디서 생각이 가장 크게 확장됐는가</h1>
            <p>
              완료된 사건의 버스트 점수와 랭크를 비교합니다. 점수가 높다는 것은 정답을 맞혔다는 뜻이 아니라,
              압박 속에서 생각 리듬, 관점 전환, 회복 판단, 구조 재설계가 함께 솟았다는 뜻입니다.
            </p>
          </header>
          <section className="ranking-status-bar" aria-busy={statusCopy.loading}>
            <div>
              <span>{statusCopy.eyebrow}</span>
              <strong>{statusCopy.title}</strong>
              {statusCopy.text && <p>{statusCopy.text}</p>}
            </div>
            {/* One button, as the card is laid out for one: a table that could
                not be fetched offers the fetch again in place of the way out,
                which the bar above still has. */}
            {statusCopy.canRetry ? (
              <button type="button" data-testid="ranking-retry" onClick={() => reloadLeaderboard()}>
                <RotateCw size={17} aria-hidden="true" />
                다시 불러오기
              </button>
            ) : (
              <button type="button" onClick={() => onClose()}>
                <ChevronRight size={17} />
                내 기록 만들기
              </button>
            )}
          </section>
          <section className="ranking-table-panel" aria-label="플레이어 랭킹">
            <div className="ranking-table-heading">
              <div>
                <span lang="en">SEASON 1 / BEST RUN</span>
                <h2>현재 기준선</h2>
              </div>
              {/* Not a count while there is nothing counted yet: it read
                  "0명의 기록" beside the line that said it was still loading. */}
              <small>{statusCopy.loading ? "불러오는 중" : `${leaderboard.length}명의 기록`}</small>
            </div>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {statusCopy.loading ? "" : `${leaderboard.length}명의 기록을 불러왔습니다.`}
            </p>
            {statusCopy.loading ? (
              <p className="ranking-empty">기록을 불러오는 중입니다.</p>
            ) : leaderboard.length === 0 ? (
              <p className="ranking-empty">아직 완료된 기록이 없습니다. 첫 시즌을 끝내고 기준선을 세워보세요.</p>
            ) : (
              /* A list, so a screen reader says how many rows there are and
                 where it is among them. The rows were bare <article>s, and the
                 place a bare "01". */
              <div className="ranking-list" role="list">
                {leaderboard.map((entry) => {
                  const isCurrentRun = entry.runId ? entry.runId === runId : entry.sessionCode === sessionCode;
                  return (
                  <div role="listitem" className={`${isCurrentRun ? "ranking-row current-player" : "ranking-row"}${entry.seasonComplete ? " season-complete" : ""}`} key={entry.id}>
                    <span className="sr-only">{entry.position}위{isCurrentRun ? ", 내 기록" : ""}</span>
                    <strong className="ranking-position" aria-hidden="true">{String(entry.position).padStart(2, "0")}</strong>
                    <div className="ranking-player">
                      <b>{entry.headline}</b>
                      <span className="ranking-league-badge">{entry.league}</span>
                      <span className="ranking-style-badge">{entry.handle}</span>
                      <span className={`ranking-integrity-badge ${entry.integrity?.valid ? "valid" : "invalid"}`}>{entry.integrity?.label}</span>
                      {entry.seasonComplete && <span className="season-complete-badge" aria-label="시즌 완료 기록" lang="en">SEASON COMPLETE</span>}
                      {/* `entry.trigger` is always a key of triggerLabels (normalizeEntry in ranking.js). */}
                      <small>{entry.caseTitle} · {entry.runLabel} · 주요 압박 {triggerLabels[entry.trigger] ?? triggerLabels.responsibility}</small>
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
                      <span>{entry.completedAt ? new Date(entry.completedAt).toLocaleDateString("ko-KR") : "기록 시각 없음"}</span>
                      <span>평균 {entry.averageResponseTime}s</span>
                      <span>판 다시 짜기 {entry.reframeCount}</span>
                      {entry.assistTime > 1 && <span className="ranking-assist">테이블 시간 ×{entry.assistTime}</span>}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </section>
          <p className="ranking-footnote">
            다른 참가자는 이름 대신 판단 유형과 실행 번호로 구분됩니다. 이름은 이 브라우저의 기록에만 표시되며, 원격 연결이 없으면 로컬 기록만 집계합니다.
          </p>
        </section>
      </main>
);
}
