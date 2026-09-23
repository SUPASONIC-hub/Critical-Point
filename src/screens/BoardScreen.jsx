import { ArrowLeft, Send, ShieldAlert } from "lucide-react";

/**
 * 참가자 게시판.
 *
 * Plain props rather than a view bag, like RankingScreen: this screen is outside
 * the intro/result/play contract that scripts/check-view-contracts.mjs enforces,
 * and it stays that way on purpose -- it reads one hook and nothing the runtime
 * derives.
 *
 * Every player string here is a JSX child, never markup. The nickname and the
 * body are the only text in the app that one player writes and another reads, so
 * this is the one screen where that would matter, and there is no
 * dangerouslySetInnerHTML anywhere in this repo.
 */
export function BoardScreen({
  Music,
  gameTitle,
  boardStatus,
  boardError,
  boardPosts,
  boardNickname,
  setBoardNickname,
  boardBody,
  setBoardBody,
  boardHoneypot,
  setBoardHoneypot,
  boardPostStatus,
  isPostingToBoard,
  canSubmitBoardPost,
  activeBoardPrivacySignals,
  anonymizeBoardBody,
  submitBoardPost,
  nicknameMaxLength,
  bodyMaxLength,
  onClose,
}) {
  return (
      <main className="shell board-shell">
        <Music modeKey="intro" />
        <section className="board-page">
          <div className="topbar">
            <button className="ghost" type="button" onClick={() => onClose()}>
              <ArrowLeft size={16} />
              브리핑으로 돌아가기
            </button>
            <span className="brand-mark">{gameTitle}</span>
          </div>
          <header className="board-hero">
            <span>PARTICIPANT BOARD</span>
            <h1>남겨두고 가는 말</h1>
            <p>
              이름 하나와 짧은 글이면 충분합니다. 여기 적은 이름과 글은 다른 참가자에게 그대로 보입니다.
              점수도 순위도 붙지 않습니다. 사건을 지나온 사람이 다음 사람에게 남기는 자리입니다.
            </p>
          </header>
          <section className="board-status-bar">
            <div>
              <span>{boardStatus === "ready" ? "REMOTE BOARD" : "BOARD OFFLINE"}</span>
              <strong>{boardStatus === "ready" ? `${boardPosts.length}개의 글` : "글을 주고받을 수 없습니다"}</strong>
              <p>
                {boardError ||
                  "이름과 글은 공개됩니다. 연락처나 소속처럼 본인을 특정할 수 있는 내용은 적지 말아 주세요."}
              </p>
            </div>
          </section>
          <section className="board-composer" aria-label="글 남기기">
            <label className="board-field">
              <span>이름</span>
              <input
                type="text"
                value={boardNickname}
                maxLength={nicknameMaxLength}
                placeholder="게시판에 보일 이름"
                onChange={(event) => setBoardNickname(event.target.value)}
              />
              <small>{boardNickname.trim().length}/{nicknameMaxLength}자 · 이 이름은 공개됩니다</small>
            </label>
            <label className="board-field">
              <span>남길 말</span>
              <textarea
                rows={4}
                value={boardBody}
                maxLength={bodyMaxLength}
                placeholder="사건을 지나며 남은 생각을 적어 주세요. 링크는 올릴 수 없습니다."
                onChange={(event) => setBoardBody(event.target.value)}
              />
              <small>{boardBody.length}/{bodyMaxLength}자</small>
            </label>
            {/* The honeypot. Hidden from sight, from the tab order and from the
                accessibility tree, so only something reading the markup finds
                it. A post that fills it is answered with a success and written
                nowhere. */}
            <label className="board-honeypot" aria-hidden="true">
              <span>홈페이지</span>
              <input
                type="text"
                name="homepage"
                value={boardHoneypot}
                tabIndex={-1}
                autoComplete="off"
                onChange={(event) => setBoardHoneypot(event.target.value)}
              />
            </label>
            {activeBoardPrivacySignals.length > 0 && (
              <div className="board-privacy-notice">
                <p>
                  <ShieldAlert size={15} />
                  {activeBoardPrivacySignals.map((signal) => signal.label).join(", ")}로 보이는 표현이 있습니다.
                  익명화한 뒤에 올릴 수 있습니다.
                </p>
                <button type="button" className="ghost" onClick={() => anonymizeBoardBody()}>
                  익명화
                </button>
              </div>
            )}
            <div className="board-composer-actions">
              <button type="button" disabled={!canSubmitBoardPost} onClick={() => submitBoardPost()}>
                <Send size={16} />
                {isPostingToBoard ? "올리는 중" : "글 남기기"}
              </button>
              {boardPostStatus && <p className="board-post-status">{boardPostStatus}</p>}
            </div>
          </section>
          <section className="board-list-panel" aria-label="참가자 글">
            <div className="board-list-heading">
              <div>
                <span>PARTICIPANT VOICES</span>
                <h2>먼저 지나간 사람들</h2>
              </div>
              <small>{boardPosts.length}개의 글</small>
            </div>
            {boardStatus === "loading" ? (
              <p className="board-empty">글을 불러오는 중입니다.</p>
            ) : boardPosts.length === 0 ? (
              <p className="board-empty">아직 남겨진 글이 없습니다. 첫 글을 남겨보세요.</p>
            ) : (
              <div className="board-list">
                {boardPosts.map((post) => (
                  <article className="board-post" key={post.id}>
                    <div className="board-post-head">
                      <b>{post.nickname}</b>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "기록 시각 없음"}</span>
                    </div>
                    <p>{post.body}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          <p className="board-footnote">
            게시판의 이름은 이 게시판에만 쓰입니다. 랭킹과 기록은 지금까지처럼 익명으로 남으며, 여기 적은 글은
            언제든 운영자가 내릴 수 있습니다.
          </p>
        </section>
      </main>
);
}
