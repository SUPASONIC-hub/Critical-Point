import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ADMIN_PAGE_SIZE, boardAdmin } from "../boardAdmin.js";
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
};

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

/** The board screen's admin bar: nothing at all unless the server said admin. */
export function BoardAdminBar({ onChanged = () => {} }) {
  const [admin, state] = useBoardAdmin();
  const [query, setQuery] = useState("");
  const [includeHidden, setIncludeHidden] = useState(true);
  const [posts, setPosts] = useState([]);
  const [writerOf, setWriterOf] = useState(null);
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

  // The first list, once the server has said admin.
  const loadedOnce = useRef(false);
  useEffect(() => {
    if (!isAdmin || loadedOnce.current) return;
    loadedOnce.current = true;
    load();
  }, [isAdmin, load]);

  if (!isAdmin) return null;

  async function act(post, run, done) {
    setBusy(true);
    try {
      const ok = await run();
      setMessage(say(ok ? done : W.missing, { id: post.id }));
      onChanged();
      if (writerOf) await showWriter(writerOf, { keepMessage: true });
      else await refresh();
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

  return (
    <section className="board-admin-bar" aria-label={W.barLabel} aria-busy={busy} data-testid="board-admin-bar">
      <div className="board-admin-bar-head">
        <strong>{W.barTitle}</strong>
        <span>{state.email}</span>
        <button type="button" className="ghost" onClick={() => admin.signOut()}>
          {W.signOut}
        </button>
      </div>
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
      <p className="board-admin-status" role="status" aria-live="polite" data-testid="board-admin-message">
        {message}
      </p>
      <ul className="board-admin-list">
        {posts.map((post) => (
          <li key={post.id} className={post.hidden ? "is-hidden" : undefined} data-testid="board-admin-post" data-post-id={post.id}>
            <div className="board-admin-post-head">
              <b>#{post.id}</b>
              <b>{post.nickname}</b>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleString("ko-KR") : ""}</span>
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
    </section>
  );
}
