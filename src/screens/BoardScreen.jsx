import { useEffect, useRef } from "react";
import { ArrowLeft, RotateCw, Send, ShieldAlert } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";

// What the list says in place of posts, by what the board is doing. "Nothing
// here yet" is only true of a board that answered: it used to be printed
// under BOARD OFFLINE as well, inviting a first post nobody could send.
const BOARD_LIST_COPY = {
  idle: "글을 불러오는 중입니다.",
  loading: "글을 불러오는 중입니다.",
  error: "글을 불러오지 못했습니다.",
  local: "지금은 게시판에 연결되어 있지 않습니다.",
  ready: "아직 남겨진 글이 없습니다. 첫 글을 남겨보세요.",
};

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
  canWriteBoardPost,
  boardSubmitBlock,
  activeBoardPrivacySignals,
  anonymizeBoardBody,
  submitBoardPost,
  reloadBoard,
  nicknameMaxLength,
  bodyMaxLength,
  onClose,
}) {
  // The screen replaces the page under the player's hands, so it takes focus
  // itself (see RankingScreen).
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);
  const isBoardBusy = boardStatus === "loading" || boardStatus === "idle";

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
            <span lang="en">PARTICIPANT BOARD</span>
            <h1 ref={headingRef} tabIndex={-1}>남겨두고 가는 말</h1>
            <p>
              이름 하나와 짧은 글이면 충분합니다. 여기 적은 이름과 글은 다른 참가자에게 그대로 보입니다.
              점수도 순위도 붙지 않습니다. 사건을 지나온 사람이 다음 사람에게 남기는 자리입니다.
            </p>
          </header>
          <section className="board-status-bar" aria-busy={isBoardBusy}>
            <div role="status">
              <span>{boardStatus === "ready" ? "REMOTE BOARD" : isBoardBusy ? "CONNECTING" : "BOARD OFFLINE"}</span>
              <strong>
                {boardStatus === "ready" ? `${boardPosts.length}개의 글` : isBoardBusy ? "게시판에 연결하는 중입니다" : "글을 주고받을 수 없습니다"}
              </strong>
              <p>
                {boardError ||
                  "이름과 글은 공개됩니다. 연락처나 소속처럼 본인을 특정할 수 있는 내용은 적지 말아 주세요."}
              </p>
            </div>
            {(boardStatus === "error" || boardStatus === "local") && (
              <button type="button" className="ghost" data-testid="board-retry" onClick={() => reloadBoard()}>
                <RotateCw size={16} aria-hidden="true" />
                다시 불러오기
              </button>
            )}
          </section>
          <section className="board-composer" aria-label="글 남기기">
            {/* The counter is the field's description, not part of its name:
                inside the label it made the name "이름 0/24자 · 이 이름은
                공개됩니다". Hidden from the name, it is still read as the
                description it is referenced as. */}
            <label className="board-field">
              <span>이름</span>
              <input
                type="text"
                value={boardNickname}
                maxLength={nicknameMaxLength}
                placeholder="게시판에 보일 이름"
                disabled={!canWriteBoardPost}
                aria-describedby="board-nickname-count"
                onChange={(event) => setBoardNickname(event.target.value)}
              />
              <small id="board-nickname-count" aria-hidden="true">{boardNickname.trim().length}/{nicknameMaxLength}자 · 이 이름은 공개됩니다</small>
            </label>
            <label className="board-field">
              <span>남길 말</span>
              <textarea
                rows={4}
                value={boardBody}
                maxLength={bodyMaxLength}
                placeholder="사건을 지나며 남은 생각을 적어 주세요. 링크는 올릴 수 없습니다."
                disabled={!canWriteBoardPost}
                aria-describedby="board-body-count"
                onChange={(event) => setBoardBody(event.target.value)}
              />
              <small id="board-body-count" aria-hidden="true">{boardBody.length}/{bodyMaxLength}자</small>
            </label>
            {/* The honeypot. Hidden from sight, from the tab order and from the
                accessibility tree, so only something reading the markup finds
                it. A browser's autofill reads the markup too: the data-
                attributes are the ones the common password managers honour,
                and a post stopped here is told so (checkBoardSubmit). */}
            <label className="board-honeypot" aria-hidden="true">
              <span>홈페이지</span>
              <input
                type="text"
                name="homepage"
                value={boardHoneypot}
                tabIndex={-1}
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                data-bwignore="true"
                data-form-type="other"
                onChange={(event) => setBoardHoneypot(event.target.value)}
              />
            </label>
            {activeBoardPrivacySignals.length > 0 && (
              <div className="board-privacy-notice" id="board-privacy-notice" role="alert">
                <p>
                  <ShieldAlert size={15} />
                  개인 정보로 보이는 표현이 있습니다: {activeBoardPrivacySignals.map((signal) => signal.label).join(", ")}.
                  익명화한 뒤에 올릴 수 있습니다.
                </p>
                <button type="button" className="ghost" onClick={() => anonymizeBoardBody()}>
                  익명화
                </button>
              </div>
            )}
            <div className="board-composer-actions">
              {/* Blocked, not disabled, as the feedback form's button is: it
                  stays in the tab order and is described by the words that
                  say why -- the privacy notice above, or the status beside it.
                  It was `disabled` with nothing said, for a short name too;
                  a short name or post is now answered when it is pressed. */}
              <GuardedButton
                type="button"
                blocked={Boolean(boardSubmitBlock)}
                aria-busy={isPostingToBoard}
                aria-describedby={boardSubmitBlock === "privacy" ? "board-privacy-notice" : "board-post-status"}
                onClick={() => submitBoardPost()}
              >
                <Send size={16} />
                {isPostingToBoard ? "올리는 중" : "글 남기기"}
              </GuardedButton>
              {/* Always in the page, so what it comes to say is announced: a
                  live region that mounts with its text already in it is not. */}
              <p className="board-post-status" id="board-post-status" role="status" aria-live="polite" data-testid="board-post-status">
                {canWriteBoardPost || isBoardBusy ? boardPostStatus : "게시판에 연결된 뒤에 글을 남길 수 있습니다."}
              </p>
            </div>
          </section>
          <section className="board-list-panel" aria-label="참가자 글">
            <div className="board-list-heading">
              <div>
                <span lang="en">PARTICIPANT VOICES</span>
                <h2>먼저 지나간 사람들</h2>
              </div>
              {boardStatus === "ready" && <small>{boardPosts.length}개의 글</small>}
            </div>
            {/* Posts already fetched stay up while the board is read again or
                cannot be reached; the status card says which. */}
            {boardPosts.length === 0 ? (
              <p className="board-empty" data-testid="board-list-state">{BOARD_LIST_COPY[boardStatus] ?? BOARD_LIST_COPY.local}</p>
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
            게시판의 이름은 이 게시판에만 쓰입니다. 랭킹과 기록은 지금까지처럼 익명으로 남고, 게시판은 플레이
            기록과 다른 식별 번호를 씁니다. 글은 180일 동안 보관한 뒤 지우며, 접속 주소는 도배를 막는 데만
            씁니다. 여기 적은 글은 언제든 운영자가 내릴 수 있습니다.
          </p>
        </section>
      </main>
);
}
