import { useEffect, useRef } from "react";
import { ArrowLeft, Flag, RotateCw, Send, ShieldAlert } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { BOARD_REPORT_REASONS } from "../boardReport.js";
import { useBoardReport } from "../state/useBoardReport.js";
import words from "../copy/board.js";
import { fill, LANG, SOURCE_LOCALE } from "../locale.js";

// Dates as the page's language writes them; a Korean page as it always has.
const DATE_LOCALE = LANG === SOURCE_LOCALE ? "ko-KR" : LANG;

// What the list says in place of posts, by what the board is doing. "Nothing
// here yet" is only true of a board that answered: it used to be printed
// under BOARD OFFLINE as well, inviting a first post nobody could send.
const BOARD_LIST_COPY = words.list;

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
  const report = useBoardReport();

  return (
      <main className="shell board-shell">
        <Music modeKey="intro" />
        <section className="board-page">
          <div className="topbar">
            <button className="ghost" type="button" onClick={() => onClose()}>
              <ArrowLeft size={16} />
              {words.back}
            </button>
            <span className="brand-mark">{gameTitle}</span>
          </div>
          <header className="board-hero">
            <span lang="en">PARTICIPANT BOARD</span>
            <h1 ref={headingRef} tabIndex={-1}>{words.title}</h1>
            <p>{words.intro}</p>
          </header>
          <section className="board-status-bar" aria-busy={isBoardBusy}>
            <div role="status">
              <span>{boardStatus === "ready" ? "REMOTE BOARD" : isBoardBusy ? "CONNECTING" : "BOARD OFFLINE"}</span>
              <strong>
                {boardStatus === "ready" ? fill(words.posts, { count: boardPosts.length }) : isBoardBusy ? words.connecting : words.offline}
              </strong>
              <p>
                {boardError || words.publicNote}
              </p>
            </div>
            {(boardStatus === "error" || boardStatus === "local") && (
              <button type="button" className="ghost" data-testid="board-retry" onClick={() => reloadBoard()}>
                <RotateCw size={16} aria-hidden="true" />
                {words.retry}
              </button>
            )}
          </section>
          <section className="board-composer" aria-label={words.composer}>
            {/* The counter is the field's description, not part of its name:
                inside the label it made the name "이름 0/24자 · 이 이름은
                공개됩니다". Hidden from the name, it is still read as the
                description it is referenced as. */}
            <label className="board-field">
              <span>{words.name}</span>
              <input
                type="text"
                value={boardNickname}
                maxLength={nicknameMaxLength}
                placeholder={words.namePlaceholder}
                disabled={!canWriteBoardPost}
                aria-describedby="board-nickname-count"
                onChange={(event) => setBoardNickname(event.target.value)}
              />
              <small id="board-nickname-count" aria-hidden="true">{fill(words.nameCount, { count: boardNickname.trim().length, max: nicknameMaxLength })}</small>
            </label>
            <label className="board-field">
              <span>{words.body}</span>
              <textarea
                rows={4}
                value={boardBody}
                maxLength={bodyMaxLength}
                placeholder={words.bodyPlaceholder}
                disabled={!canWriteBoardPost}
                aria-describedby="board-body-count"
                onChange={(event) => setBoardBody(event.target.value)}
              />
              <small id="board-body-count" aria-hidden="true">{fill(words.bodyCount, { count: boardBody.length, max: bodyMaxLength })}</small>
            </label>
            {/* The honeypot. Hidden from sight, from the tab order and from the
                accessibility tree, so only something reading the markup finds
                it. A browser's autofill reads the markup too: the data-
                attributes are the ones the common password managers honour,
                and a post stopped here is told so (checkBoardSubmit). */}
            <label className="board-honeypot" aria-hidden="true">
              <span>{words.honeypot}</span>
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
                  {fill(words.privacy, { signals: activeBoardPrivacySignals.map((signal) => signal.label).join(", ") })}
                </p>
                <button type="button" className="ghost" onClick={() => anonymizeBoardBody()}>
                  {words.anonymize}
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
                {isPostingToBoard ? words.posting : words.post}
              </GuardedButton>
              {/* Always in the page, so what it comes to say is announced: a
                  live region that mounts with its text already in it is not. */}
              <p className="board-post-status" id="board-post-status" role="status" aria-live="polite" data-testid="board-post-status">
                {canWriteBoardPost || isBoardBusy ? boardPostStatus : words.notConnected}
              </p>
            </div>
          </section>
          <section className="board-list-panel" aria-label={words.listLabel}>
            <div className="board-list-heading">
              <div>
                <span lang="en">PARTICIPANT VOICES</span>
                <h2>{words.listTitle}</h2>
              </div>
              {boardStatus === "ready" && <small>{fill(words.posts, { count: boardPosts.length })}</small>}
            </div>
            {/* Posts already fetched stay up while the board is read again or
                cannot be reached; the status card says which. */}
            {boardPosts.length === 0 ? (
              <p className="board-empty" data-testid="board-list-state">{BOARD_LIST_COPY[boardStatus] ?? BOARD_LIST_COPY.local}</p>
            ) : (
              <div className="board-list">
                {boardPosts.map((post) => {
                  const reported = report.reportedIds.has(post.id);
                  const reportOpen = report.openPostId === post.id;
                  const reportFormId = `board-report-${post.id}`;
                  return (
                    <article className="board-post" key={post.id}>
                      <div className="board-post-head">
                        <b>{post.nickname}</b>
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(DATE_LOCALE) : words.noTime}</span>
                      </div>
                      <p>{post.body}</p>
                      {/* Every post can be reported (store UGC rules: Apple 1.2,
                          Google Play). The button names the post it is about, and
                          once the report is in it stays reachable, saying so. */}
                      <div className="board-post-actions">
                        <GuardedButton
                          type="button"
                          className="ghost board-report-toggle"
                          blocked={reported}
                          aria-expanded={reported ? undefined : reportOpen}
                          aria-controls={reportOpen ? reportFormId : undefined}
                          aria-label={fill(reported ? words.reportedLabel : words.reportLabel, { name: post.nickname })}
                          data-testid="board-report-toggle"
                          onClick={() => report.toggleReport(post.id)}
                        >
                          <Flag size={14} aria-hidden="true" />
                          {reported ? words.reported : words.report}
                        </GuardedButton>
                      </div>
                      {reportOpen && (
                        <fieldset className="board-report" id={reportFormId} data-testid="board-report-form">
                          <legend>{words.reportLegend}</legend>
                          <div className="board-report-reasons">
                            {BOARD_REPORT_REASONS.map((reason) => (
                              <label key={reason.id}>
                                <input
                                  type="radio"
                                  name={`board-report-reason-${post.id}`}
                                  value={reason.id}
                                  checked={report.reason === reason.id}
                                  onChange={() => report.pickReason(reason.id)}
                                />
                                <span>{reason.label}</span>
                              </label>
                            ))}
                          </div>
                          <small>{words.reportNote}</small>
                          <div className="board-report-actions">
                            <GuardedButton
                              type="button"
                              blocked={report.isSending}
                              aria-busy={report.isSending}
                              aria-describedby="board-report-status"
                              onClick={() => report.submitReport()}
                            >
                              {report.isSending ? words.reportSending : words.reportSend}
                            </GuardedButton>
                            <button type="button" className="ghost" onClick={() => report.cancelReport()}>
                              {words.cancel}
                            </button>
                          </div>
                        </fieldset>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
            {/* Always in the page, so a report's answer is announced. */}
            <p className="board-report-status" id="board-report-status" role="status" aria-live="polite" data-testid="board-report-status">
              {report.reportStatus}
            </p>
          </section>
          <p className="board-footnote">{words.footnote}</p>
        </section>
      </main>
);
}
