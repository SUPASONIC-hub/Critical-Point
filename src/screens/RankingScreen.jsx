import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

export function RankingScreen({
  Music,
  gameTitle,
  leaderboardStatus,
  rankingHeadline,
  leaderboardError,
  leaderboard,
  sessionCode,
  triggerLabels,
  onClose,
}) {
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
            <span>PUBLIC SIGNAL BOARD</span>
            <h1>어디서 사고가 터졌는가</h1>
            <p>
              완료된 사건의 버스트 점수와 랭크를 비교합니다. 점수가 높다는 것은 정답을 맞혔다는 뜻이 아니라,
              압박 속에서 사고 리듬, 관점 전환, 회복 판단, 구조 재설계가 함께 솟았다는 뜻입니다.
            </p>
          </header>
          <section className="ranking-status-bar">
            <div>
              <span>{leaderboardStatus === "ready" ? "REMOTE LEADERBOARD" : "LOCAL PLAYTEST BOARD"}</span>
              <strong>{rankingHeadline.title}</strong>
              <p>{leaderboardError || rankingHeadline.text}</p>
            </div>
            <button type="button" onClick={() => onClose()}>
              <ChevronRight size={17} />
              내 기록 만들기
            </button>
          </section>
          <section className="ranking-table-panel" aria-label="플레이어 랭킹">
            <div className="ranking-table-heading">
              <div>
                <span>SEASON 1 / BEST RUN</span>
                <h2>현재 기준선</h2>
              </div>
              <small>{leaderboard.length}명의 기록</small>
            </div>
            {leaderboardStatus === "loading" ? (
              <p className="ranking-empty">기록을 불러오는 중입니다.</p>
            ) : leaderboard.length === 0 ? (
              <p className="ranking-empty">아직 완료된 기록이 없습니다. 첫 시즌을 끝내고 기준선을 세워보세요.</p>
            ) : (
              <div className="ranking-list">
                {leaderboard.map((entry) => (
                  <article className={entry.sessionCode === sessionCode ? "ranking-row current-player" : "ranking-row"} key={entry.id}>
                    <strong className="ranking-position">{String(entry.position).padStart(2, "0")}</strong>
                    <div className="ranking-player">
                      <b>{entry.name}</b>
                      <small>{entry.caseTitle} · 주요 압박 {triggerLabels[entry.trigger] ?? entry.trigger}</small>
                    </div>
                    <div className="ranking-stat">
                      <span>RANK</span>
                      <b>{entry.rank}</b>
                    </div>
                    <div className="ranking-stat score-stat">
                      <span>BURST</span>
                      <b>{entry.score}</b>
                    </div>
                    <div className="ranking-detail">
                      <span>평균 {entry.averageResponseTime}s</span>
                      <span>자유입력 {entry.freeCount}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <p className="ranking-footnote">
            이름은 데이터 제공 동의가 있는 완료 기록에만 표시되며, 원격 연결이 없으면 이 브라우저의 로컬 기록만 집계합니다.
          </p>
        </section>
      </main>
);
}
