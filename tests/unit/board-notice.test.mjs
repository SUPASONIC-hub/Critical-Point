import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { BOARD_NOTICE_LANGS, BOARD_NOTICE_MAX_LENGTH, boardNoticeLang, boardNoticeText, loadBoardNotice, toBoardNotice } from "../../src/boardNotice.js";
import { fetchBoardNotice } from "../../src/telemetry.js";
import boardCopy from "../../src/copy/board.js";
import enBoard from "../../src/locales/en/screens/board.js";
import jaBoard from "../../src/locales/ja/screens/board.js";

/**
 * 게시판 「만든 사람 공지」 (src/boardNotice.js): how the board reads the
 * makers' one notice -- what counts as none, the fallback to Korean, and that
 * a notice that cannot be read draws nothing. Who may write it is the
 * server's (check:grants).
 */

const NOW = Date.parse("2026-11-26T12:00:00+09:00");
const row = (fields = {}) => ({
  body_ko: "우리가 알립니다.",
  body_en: "A word from us.",
  body_ja: "私たちからのお知らせです。",
  posted_at: "2026-11-26T01:00:00Z",
  expires_at: null,
  ...fields,
});

test("a notice reads its three languages and its times", () => {
  assert.deepEqual(toBoardNotice(row(), NOW), {
    ko: "우리가 알립니다.",
    en: "A word from us.",
    ja: "私たちからのお知らせです。",
    postedAt: "2026-11-26T01:00:00Z",
    expiresAt: null,
  });
  assert.equal(toBoardNotice(row({ expires_at: "2026-11-27T00:00:00Z" }), NOW).expiresAt, "2026-11-27T00:00:00Z");
});

test("no row, no Korean, or an end already past is no notice", () => {
  assert.equal(toBoardNotice(null, NOW), null);
  assert.equal(toBoardNotice(undefined, NOW), null);
  assert.equal(toBoardNotice("notice", NOW), null);
  assert.equal(toBoardNotice(row({ body_ko: "   " }), NOW), null);
  assert.equal(toBoardNotice(row({ body_ko: null }), NOW), null);
  assert.equal(toBoardNotice(row({ body_ko: { forged: true } }), NOW), null);
  assert.equal(toBoardNotice(row({ expires_at: "2026-11-26T03:00:00Z" }), NOW), null);
  assert.equal(toBoardNotice(row({ expires_at: new Date(NOW).toISOString() }), NOW), null);
});

test("what is not text or a time is dropped, and words are trimmed and held to the limit", () => {
  const notice = toBoardNotice(row({ body_ko: `  ${"가".repeat(700)}  `, body_en: 42, body_ja: ["x"], posted_at: "not a time", expires_at: { a: 1 } }), NOW);
  assert.equal(notice.ko.length, BOARD_NOTICE_MAX_LENGTH);
  assert.equal(notice.en, "");
  assert.equal(notice.ja, "");
  assert.equal(notice.postedAt, null);
  assert.equal(notice.expiresAt, null);
});

test("each page shows its language, and Korean where the notice has none", () => {
  const all = toBoardNotice(row(), NOW);
  assert.equal(boardNoticeText(all, "ko"), "우리가 알립니다.");
  assert.equal(boardNoticeText(all, "en"), "A word from us.");
  assert.equal(boardNoticeText(all, "ja"), "私たちからのお知らせです。");
  const koOnly = toBoardNotice(row({ body_en: "", body_ja: null }), NOW);
  assert.equal(boardNoticeText(koOnly, "en"), "우리가 알립니다.");
  assert.equal(boardNoticeLang(koOnly, "en"), "ko");
  assert.equal(boardNoticeText(koOnly, "ja"), "우리가 알립니다.");
  assert.equal(boardNoticeLang(all, "ja"), "ja");
  assert.equal(boardNoticeText(all, "fr"), "우리가 알립니다.");
  assert.equal(boardNoticeLang(all, "ko"), "ko");
  assert.equal(boardNoticeText(null, "en"), "");
  assert.equal(boardNoticeLang(null, "en"), "ko");
  assert.deepEqual([...BOARD_NOTICE_LANGS], ["ko", "en", "ja"]);
});

test("the board loads the first row, and anything else is no notice", async () => {
  const now = () => NOW;
  assert.deepEqual(await loadBoardNotice(async () => ({ rows: [row()] }), now), toBoardNotice(row(), NOW));
  assert.equal(await loadBoardNotice(async () => ({ rows: [] }), now), null);
  assert.equal(await loadBoardNotice(async () => ({ skipped: true, rows: [] }), now), null);
  assert.equal(await loadBoardNotice(async () => ({ rows: { body_ko: "x" } }), now), null);
  assert.equal(await loadBoardNotice(async () => ({ rows: [row({ expires_at: "2026-11-01T00:00:00Z" })] }), now), null);
  assert.equal(
    await loadBoardNotice(async () => {
      throw new Error("Network unavailable");
    }, now),
    null,
  );
});

test("with no server the fetch is skipped, and the default loader says none", async () => {
  assert.deepEqual(await fetchBoardNotice(), { skipped: true, rows: [] });
  assert.equal(await loadBoardNotice(), null);
});

test("the limit is the table's, and the badge has words in every language in our voice", () => {
  const migrations = new globalThis.URL("../../supabase/migrations/", import.meta.url);
  const file = readdirSync(migrations).find((name) => name.endsWith("_board_notice.sql"));
  const sql = readFileSync(new globalThis.URL(file, migrations), "utf8");
  for (const lang of BOARD_NOTICE_LANGS) assert.match(sql, new RegExp(`char_length\\(btrim\\(body_${lang}\\)\\) between 1 and ${BOARD_NOTICE_MAX_LENGTH}`));
  assert.match(sql, /grant select \(body_ko, body_en, body_ja, posted_at, expires_at\) on table public\.board_notice to anon;/);
  assert.doesNotMatch(sql, /grant select[^;]*posted_by[^;]*to anon/);

  assert.equal(boardCopy.makersNotice.label, "만든 사람 공지");
  assert.equal(enBoard.makersNotice.label, "From the makers");
  assert.equal(jaBoard.makersNotice.label, "制作者からのお知らせ");
  for (const copy of [boardCopy, enBoard, jaBoard]) {
    assert.deepEqual(Object.keys(copy.makersNotice).sort(), ["label", "note", "posted"]);
    assert.match(copy.makersNotice.posted, /\{date\}/);
  }
  assert.match(boardCopy.makersNotice.note, /우리/);
  assert.match(enBoard.makersNotice.note, /\bwe\b/);
  assert.match(jaBoard.makersNotice.note, /私たち/);
});

test("the first-hour record is skipped with no server, as every other send", async () => {
  const { saveFirstHourRecord } = await import("../../src/telemetry.js");
  assert.deepEqual(await saveFirstHourRecord("00000000-0000-4000-8000-000000000000", { v: 1, first: true }), { skipped: true });
  assert.deepEqual(await saveFirstHourRecord("00000000-0000-4000-8000-000000000000", { v: 1, first: true }, { keepalive: true }), { skipped: true });
});
