import { fetchBoardNotice } from "./telemetry.js";

/**
 * 게시판 「만든 사람 공지」 (2026-11-26, choice (1)): the makers' one notice,
 * pinned over the posts. Only the two makers write it, through the admin RPCs
 * of 20261202010000_board_notice.sql; anon reads its words and times while it
 * lasts. It is not a post: the board draws it in its own box with its own
 * badge, so no nickname can pass for it.
 *
 * Korean is required, English and Japanese are optional; a page in a language
 * the notice has no words for shows the Korean.
 */

/** Each language's words, at most (the table's own check). */
export const BOARD_NOTICE_MAX_LENGTH = 600;
export const BOARD_NOTICE_LANGS = Object.freeze(["ko", "en", "ja"]);

const words = (value) => (typeof value === "string" ? value.trim().slice(0, BOARD_NOTICE_MAX_LENGTH) : "");

const time = (value) => {
  if (typeof value !== "string" || !value) return null;
  return Number.isFinite(Date.parse(value)) ? value : null;
};

/**
 * One row of `board_notice` as the board reads it, or null: no row, no Korean,
 * or an end already past (the server's policy says the same; the page may have
 * stayed open past it).
 */
export function toBoardNotice(row, now = Date.now()) {
  if (!row || typeof row !== "object") return null;
  const ko = words(row.body_ko);
  if (!ko) return null;
  const expiresAt = time(row.expires_at);
  if (expiresAt && Date.parse(expiresAt) <= now) return null;
  return { ko, en: words(row.body_en), ja: words(row.body_ja), postedAt: time(row.posted_at), expiresAt };
}

/** The language the notice is shown in on a `lang` page: that one when it has words in it, else Korean. */
export function boardNoticeLang(notice, lang) {
  return BOARD_NOTICE_LANGS.includes(lang) && notice?.[lang] ? lang : "ko";
}

/** The notice's words in `lang`, or its Korean. */
export function boardNoticeText(notice, lang) {
  return notice ? notice[boardNoticeLang(notice, lang)] : "";
}

/** The notice now, or null: none posted, ended, no server, or not reached (the board draws nothing then). */
export async function loadBoardNotice(fetchRows = fetchBoardNotice, now = Date.now) {
  try {
    const { rows } = await fetchRows();
    return Array.isArray(rows) ? toBoardNotice(rows[0], now()) : null;
  } catch {
    return null;
  }
}
