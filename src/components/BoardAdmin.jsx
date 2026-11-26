import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ADMIN_PAGE_SIZE, boardAdmin, noticeArgs, toLocalInput } from "../boardAdmin.js";
import { BOARD_NOTICE_MAX_LENGTH } from "../boardNotice.js";
import "./BoardAdmin.css";

/**
 * The board's admin tools on screen: the sign-in sheet `?admin` opens, and
 * the bar the board screen shows its two makers. One lazy chunk for both, with
 * its own stylesheet; no player's page fetches it (src/boardAdminEntry.js).
 *
 * The words are Korean only and live here, not in src/copy: two people read
 * them, both in Korean, and src/copy is the players' screen copy every
 * language has to carry (check:locale:strict).
 */
const W = {
  sheetTitle: "게시판 관리자",
  sheetIntro: "만든 사람 두 명만 들어올 수 있습니다. Google 계정으로 로그인하면 게시판에 관리 도구가 나타납니다.",
  signIn: "Google로 로그인",
  signOut: "로그아웃",
  close: "닫기",
  openBoard: "게시판 열기",
  checking: "확인하는 중입니다…",
  admin: "{email} 관리자 모드가 켜졌습니다. 게시판에서 관리 도구를 쓸 수 있습니다.",
  refused: "{email} 계정은 게시판 관리자가 아닙니다.",
  error: "로그인을 확인하지 못했습니다: {message}",
  barLabel: "게시판 관리",
  barTitle: "관리자 모드",
  search: "검색",
  searchLabel: "글·이름 검색",
  searchPlaceholder: "본문이나 이름의 일부",
  includeHidden: "숨긴 글 포함",
  hide: "숨기기",
  restore: "되살리기",
  remove: "영구 삭제",
  sameWriter: "같은 사람 글 {count}",
  backToAll: "전체 목록으로",
  more: "더 보기",
  reports: "신고 {count}",
  hidden: "숨김",
  autoHidden: "신고로 자동 숨김",
  kept: "확인함",
  none: "찾은 글이 없습니다.",
  loading: "불러오는 중…",
  found: "{count}개를 찾았습니다.",
  writerOf: "#{id}을 쓴 사람의 글 {count}개",
  confirmRemove: "#{id} 글을 영구 삭제합니다. 되돌릴 수 없습니다. 계속할까요?",
  hiddenDone: "#{id}을 숨겼습니다.",
  restoredDone: "#{id}을 되살렸습니다. 이 글의 신고도 지웠습니다.",
  removedDone: "#{id}을 영구 삭제했습니다.",
  missing: "#{id}은 이미 없는 글입니다.",
  failed: "실패했습니다: {message}",
  viewsLabel: "관리 화면",
  viewPosts: "글 검색",
  viewQueue: "신고 대기",
  viewLog: "관리 기록",
  waitingBadge: "신고 대기 {count}건",
  queueIntro: "사람이 볼 차례인 글: 신고가 들어온 글과 신고로 자동 숨김된 글. 오래 기다린 글부터.",
  queueEmpty: "기다리는 글이 없습니다.",
  queueFound: "기다리는 글 {count}개.",
  confirmHide: "숨기기 확정",
  keepHidden: "되살리기",
  keepVisible: "그대로 두기",
  keptDone: "#{id}을 그대로 두었습니다. 이 글의 신고도 지웠습니다.",
  visible: "보이는 중",
  writers: "신고한 사람 {count}",
  firstReport: "첫 신고 {time}",
  logEmpty: "관리 기록이 없습니다.",
  logFound: "최근 관리 기록 {count}건.",
  viewNotice: "만든 사람 공지",
  noticeIntro: "게시판 글 위에 「만든 사람 공지」로 붙는 글 하나. 우리 목소리(우리 / we / 私たち)로 씁니다. 한국어는 꼭, 영어·일본어는 비우면 그 언어 화면에도 한국어가 보입니다.",
  noticeKo: "한국어 (필수)",
  noticeEn: "English (선택)",
  noticeJa: "日本語 (선택)",
  noticeCount: "{count}/{max}자",
  noticeEnds: "끝나는 때 (비우면 직접 내릴 때까지)",
  noticeSave: "공지 올리기",
  noticeClear: "공지 내리기",
  noticeNone: "올린 공지가 없습니다.",
  noticeNow: "지금 공지: {time} 게시 · {email}",
  noticeEnded: "끝난 공지입니다({time}). 플레이어에게는 보이지 않습니다.",
  noticeSaved: "공지를 올렸습니다. 게시판 글 위에 보입니다.",
  noticeCleared: "공지를 내렸습니다.",
  noticeMissing: "내릴 공지가 없습니다.",
  confirmNoticeClear: "「만든 사람 공지」를 내립니다. 계속할까요?",
  noticeProblems: {
    ko: "한국어 공지를 적어 주세요.",
    long: "한 언어에 600자까지 쓸 수 있습니다.",
    ended: "끝나는 때가 이미 지났습니다.",
  },
};

/** The four reasons a report carries (board_reports_reason_check), in the report button's words (src/boardReport.js). */
const REASONS = { spam: "광고·도배", abuse: "욕설·괴롭힘", privacy: "개인정보 노출", other: "그 밖의 문제" };
/** board_admin_log's three actions. */
const ACTIONS = { hide: "숨김", restore: "되살림", delete: "영구 삭제" };

const when = (value) => (value ? new Date(value).toLocaleString("ko-KR") : "");

const say = (text, values = {}) => text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));

function useBoardAdmin() {
  const admin = boardAdmin();
  const state = useSyncExternalStore(admin.subscribe, admin.getState, admin.getState);
  useEffect(() => {
    admin.start();
  }, [admin]);
  return [admin, state];
}

function statusLine(state) {
  if (state.status === "checking" || state.status === "idle") return W.checking;
  if (state.status === "admin") return say(W.admin, state);
  if (state.status === "refused") return say(W.refused, state);
  if (state.status === "error") return say(W.error, state);
  return "";
}

/** The sheet `?admin` opens. `onOpenBoard` is given where the page can open the board. */
export function BoardAdminSheet({ onClose, onOpenBoard = null }) {
  const [admin, state] = useBoardAdmin();
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);
  const signedIn = state.status === "admin" || state.status === "refused";
  return (
    <div className="board-admin-backdrop">
      <section className="board-admin-sheet" role="dialog" aria-modal="true" aria-labelledby="board-admin-title" data-testid="board-admin-sheet">
        <h2 id="board-admin-title" ref={headingRef} tabIndex={-1}>
          {W.sheetTitle}
        </h2>
        <p>{W.sheetIntro}</p>
        <p className="board-admin-status" role="status" aria-live="polite" data-testid="board-admin-status">
          {statusLine(state)}
        </p>
        <div className="board-admin-actions">
          {(state.status === "signed-out" || state.status === "error") && (
            <button type="button" data-testid="board-admin-google" onClick={() => admin.signIn()}>
              {W.signIn}
            </button>
          )}
          {state.status === "admin" && onOpenBoard && (
            <button type="button" onClick={() => onOpenBoard()}>
              {W.openBoard}
            </button>
          )}
          {signedIn && (
            <button type="button" className="ghost" onClick={() => admin.signOut()}>
              {W.signOut}
            </button>
          )}
          <button type="button" className="ghost" onClick={() => onClose()}>
            {W.close}
          </button>
        </div>
      </section>
    </div>
  );
}

/** The 「만든 사람 공지」 view: the notice in three boxes, its end, post and take down. */
function NoticeForm({ admin, busy, setBusy, setMessage, onNoticeChanged }) {
  const [draft, setDraft] = useState({ ko: "", en: "", ja: "", expiresAt: "" });
  const [current, setCurrent] = useState(null);

  // The notice as it stands, into the boxes, once the view opens (the bar said 불러오는 중 already).
  useEffect(() => {
    let live = true;
    admin.notice().then(
      (notice) => {
        if (!live) return;
        setCurrent(notice);
        if (notice) setDraft({ ko: notice.ko, en: notice.en, ja: notice.ja, expiresAt: toLocalInput(notice.expiresAt) });
        setMessage(notice ? "" : W.noticeNone);
      },
      (error) => {
        if (live) setMessage(say(W.failed, { message: error.message }));
      },
    );
    return () => {
      live = false;
    };
  }, [admin, setMessage]);

  async function run(work, done) {
    setBusy(true);
    try {
      const said = await work();
      onNoticeChanged();
      const notice = await admin.notice();
      setCurrent(notice);
      setMessage(said ?? done);
    } catch (error) {
      setMessage(say(W.failed, { message: error.message }));
    } finally {
      setBusy(false);
    }
  }

  function save(event) {
    event.preventDefault();
    const { args, error } = noticeArgs(draft);
    if (error) return setMessage(W.noticeProblems[error]);
    run(() => admin.setNotice(args).then(() => null), W.noticeSaved);
  }

  function clear() {
    if (!globalThis.confirm?.(W.confirmNoticeClear)) return;
    run(async () => ((await admin.clearNotice()) ? null : W.noticeMissing), W.noticeCleared);
  }

  const box = (lang, label) => (
    <label className="board-admin-notice-field">
      <span>{label}</span>
      <textarea
        rows={3}
        lang={lang}
        value={draft[lang]}
        maxLength={BOARD_NOTICE_MAX_LENGTH}
        required={lang === "ko"}
        data-testid={`board-admin-notice-${lang}`}
        onChange={(event) => setDraft((now) => ({ ...now, [lang]: event.target.value }))}
      />
      <small>{say(W.noticeCount, { count: draft[lang].length, max: BOARD_NOTICE_MAX_LENGTH })}</small>
    </label>
  );

  return (
    <form className="board-admin-notice" onSubmit={save} data-testid="board-admin-notice">
      <p className="board-admin-note">{W.noticeIntro}</p>
      {current && (
        <p className="board-admin-note">
          {current.ended ? say(W.noticeEnded, { time: when(current.expiresAt) }) : say(W.noticeNow, { time: when(current.postedAt), email: current.postedBy })}
        </p>
      )}
      {box("ko", W.noticeKo)}
      {box("en", W.noticeEn)}
      {box("ja", W.noticeJa)}
      <label className="board-admin-notice-field">
        <span>{W.noticeEnds}</span>
        <input type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft((now) => ({ ...now, expiresAt: event.target.value }))} />
      </label>
      <div className="board-admin-post-actions">
        <button type="submit" disabled={busy}>
          {W.noticeSave}
        </button>
        <button type="button" className="ghost board-admin-danger" disabled={busy || !current} onClick={() => clear()}>
          {W.noticeClear}
        </button>
      </div>
    </form>
  );
}

/** The board screen's admin bar: nothing at all unless the server said admin. */
export function BoardAdminBar({ onChanged = () => {}, onNoticeChanged = () => {} }) {
  const [admin, state] = useBoardAdmin();
  const [view, setView] = useState("posts");
  const [query, setQuery] = useState("");
  const [includeHidden, setIncludeHidden] = useState(true);
  const [posts, setPosts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [log, setLog] = useState([]);
  const [waiting, setWaiting] = useState(0);
  const [writerOf, setWriterOf] = useState(null);
  // Each opening of the notice view reads the notice afresh.
  const [noticeKey, setNoticeKey] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isAdmin = state.status === "admin";

  const load = useCallback(
    async ({ append = false, beforeId = null } = {}) => {
      setBusy(true);
      setMessage(W.loading);
      try {
        const rows = await admin.search({ query, includeHidden, beforeId });
        setWriterOf(null);
        setPosts((current) => (append ? [...current, ...rows] : rows));
        setHasMore(rows.length >= ADMIN_PAGE_SIZE);
        setMessage(rows.length || append ? say(W.found, { count: (append ? posts.length : 0) + rows.length }) : W.none);
      } catch (error) {
        setMessage(say(W.failed, { message: error.message }));
      } finally {
        setBusy(false);
      }
    },
    [admin, query, includeHidden, posts.length],
  );

  // The badge: how many posts wait. A failure keeps the last number; the views say what failed.
  const countWaiting = useCallback(async () => {
    try {
      setWaiting(await admin.queueCount());
    } catch {
      // Kept as it was.
    }
  }, [admin]);

  // The first list and the badge, once the server has said admin.
  const loadedOnce = useRef(false);
  useEffect(() => {
    if (!isAdmin || loadedOnce.current) return;
    loadedOnce.current = true;
    load();
    countWaiting();
  }, [isAdmin, load, countWaiting]);

  if (!isAdmin) return null;

  async function loadQueue({ keepMessage = false } = {}) {
    const rows = await admin.queue();
    setQueue(rows);
    if (!keepMessage) setMessage(rows.length ? say(W.queueFound, { count: rows.length }) : W.queueEmpty);
  }

  async function loadLog() {
    const rows = await admin.log();
    setLog(rows);
    setMessage(rows.length ? say(W.logFound, { count: rows.length }) : W.logEmpty);
  }

  async function open(next) {
    setView(next);
    if (next === "posts") return load();
    if (next === "notice") {
      setNoticeKey((key) => key + 1);
      return setMessage(W.loading);
    }
    setBusy(true);
    setMessage(W.loading);
    try {
      if (next === "queue") await Promise.all([loadQueue(), countWaiting()]);
      else await loadLog();
    } catch (error) {
      setMessage(say(W.failed, { message: error.message }));
    } finally {
      setBusy(false);
    }
  }

  async function act(post, run, done) {
    setBusy(true);
    try {
      const ok = await run();
      setMessage(say(ok ? done : W.missing, { id: post.id }));
      onChanged();
      if (view === "queue") await loadQueue({ keepMessage: true });
      else if (writerOf) await showWriter(writerOf, { keepMessage: true });
      else await refresh();
      await countWaiting();
    } catch (error) {
      setMessage(say(W.failed, { message: error.message }));
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    const rows = await admin.search({ query, includeHidden });
    setPosts(rows);
    setHasMore(rows.length >= ADMIN_PAGE_SIZE);
  }

  async function showWriter(postId, { keepMessage = false } = {}) {
    setBusy(true);
    try {
      const rows = await admin.sameWriter(postId);
      setWriterOf(postId);
      setPosts(rows);
      setHasMore(false);
      if (!keepMessage) setMessage(say(W.writerOf, { id: postId, count: rows.length }));
    } catch (error) {
      setMessage(say(W.failed, { message: error.message }));
    } finally {
      setBusy(false);
    }
  }

  function remove(post) {
    if (!globalThis.confirm?.(say(W.confirmRemove, { id: post.id }))) return;
    act(post, () => admin.remove(post.id), W.removedDone);
  }

  const tab = (id, label) => (
    <button type="button" role="tab" aria-selected={view === id} className={view === id ? undefined : "ghost"} disabled={busy} onClick={() => open(id)}>
      {label}
    </button>
  );

  return (
    <section className="board-admin-bar" aria-label={W.barLabel} aria-busy={busy} data-testid="board-admin-bar">
      <div className="board-admin-bar-head">
        <strong>{W.barTitle}</strong>
        {waiting > 0 && (
          <em className="board-admin-tag is-warn" data-testid="board-admin-waiting">
            {say(W.waitingBadge, { count: waiting })}
          </em>
        )}
        <span>{state.email}</span>
        <button type="button" className="ghost" onClick={() => admin.signOut()}>
          {W.signOut}
        </button>
      </div>
      <div className="board-admin-views" role="tablist" aria-label={W.viewsLabel}>
        {tab("posts", W.viewPosts)}
        {tab("queue", W.viewQueue)}
        {tab("log", W.viewLog)}
        {tab("notice", W.viewNotice)}
      </div>
      {view === "posts" && (
        <form
          className="board-admin-search"
          onSubmit={(event) => {
            event.preventDefault();
            load();
          }}
        >
          <label>
            <span>{W.searchLabel}</span>
            <input type="search" value={query} placeholder={W.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="board-admin-toggle">
            <input type="checkbox" checked={includeHidden} onChange={(event) => setIncludeHidden(event.target.checked)} />
            <span>{W.includeHidden}</span>
          </label>
          <button type="submit" disabled={busy}>
            {W.search}
          </button>
          {writerOf && (
            <button type="button" className="ghost" onClick={() => load()}>
              {W.backToAll}
            </button>
          )}
        </form>
      )}
      {view === "queue" && <p className="board-admin-note">{W.queueIntro}</p>}
      {view === "notice" && <NoticeForm key={noticeKey} admin={admin} busy={busy} setBusy={setBusy} setMessage={setMessage} onNoticeChanged={onNoticeChanged} />}
      <p className="board-admin-status" role="status" aria-live="polite" data-testid="board-admin-message">
        {message}
      </p>
      {view === "posts" && (
        <>
          <ul className="board-admin-list">
            {posts.map((post) => (
              <li key={post.id} className={post.hidden ? "is-hidden" : undefined} data-testid="board-admin-post" data-post-id={post.id}>
                <div className="board-admin-post-head">
                  <b>#{post.id}</b>
                  <b>{post.nickname}</b>
                  <span>{when(post.createdAt)}</span>
                  {post.hidden && <em className="board-admin-tag">{post.autoHidden ? W.autoHidden : W.hidden}</em>}
                  {post.kept && !post.hidden && <em className="board-admin-tag is-quiet">{W.kept}</em>}
                  {post.reports > 0 && <em className="board-admin-tag is-warn">{say(W.reports, { count: post.reports })}</em>}
                </div>
                <p>{post.body}</p>
                <div className="board-admin-post-actions">
                  {post.hidden ? (
                    <button type="button" disabled={busy} onClick={() => act(post, () => admin.setHidden(post.id, false), W.restoredDone)}>
                      {W.restore}
                    </button>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => act(post, () => admin.setHidden(post.id, true), W.hiddenDone)}>
                      {W.hide}
                    </button>
                  )}
                  <button type="button" className="ghost" disabled={busy || writerOf === post.id} onClick={() => showWriter(post.id)}>
                    {say(W.sameWriter, { count: post.sameWriter })}
                  </button>
                  <button type="button" className="ghost board-admin-danger" disabled={busy} onClick={() => remove(post)}>
                    {W.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && !writerOf && (
            <button type="button" className="ghost" disabled={busy} onClick={() => load({ append: true, beforeId: posts.at(-1)?.id ?? null })}>
              {W.more}
            </button>
          )}
        </>
      )}
      {view === "queue" && (
        <ul className="board-admin-list">
          {queue.map((post) => (
            <li key={post.id} className={post.hidden ? "is-hidden" : undefined} data-testid="board-admin-queue-post" data-post-id={post.id}>
              <div className="board-admin-post-head">
                <b>#{post.id}</b>
                <b>{post.nickname}</b>
                <span>{when(post.createdAt)}</span>
                <em className="board-admin-tag">{post.hidden ? W.autoHidden : W.visible}</em>
                <em className="board-admin-tag is-warn">{say(W.reports, { count: post.reports })}</em>
                {post.writers > 0 && <em className="board-admin-tag is-quiet">{say(W.writers, { count: post.writers })}</em>}
              </div>
              <p>{post.body}</p>
              <div className="board-admin-post-meta">
                {post.reasons.length > 0 && <span>{post.reasons.map((reason) => REASONS[reason] ?? reason).join(" · ")}</span>}
                {post.firstReportAt && <span>{say(W.firstReport, { time: when(post.firstReportAt) })}</span>}
              </div>
              <div className="board-admin-post-actions">
                <button type="button" disabled={busy} onClick={() => act(post, () => admin.setHidden(post.id, true), W.hiddenDone)}>
                  {W.confirmHide}
                </button>
                <button
                  type="button"
                  className="ghost"
                  disabled={busy}
                  onClick={() => act(post, () => admin.setHidden(post.id, false), post.hidden ? W.restoredDone : W.keptDone)}
                >
                  {post.hidden ? W.keepHidden : W.keepVisible}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {view === "log" && (
        <ul className="board-admin-log">
          {log.map((row) => (
            <li key={row.id} data-testid="board-admin-log-row">
              <span>{when(row.at)}</span>
              <b>{ACTIONS[row.action] ?? row.action}</b>
              <b>#{row.postId}</b>
              <span>{row.email}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
