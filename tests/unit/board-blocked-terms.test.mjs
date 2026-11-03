import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { BOARD_BLOCKED_TERMS, findBlockedTerm, foldBoardText } from "../../src/boardBlockedTerms.js";
import { findBoardBlockedRefusal, getBoardBlockedRefusal } from "../../src/state/useBoard.js";

/**
 * The 참가자 게시판's blocked words (src/boardBlockedTerms.js). The server's
 * copy is the table a migration fills; scripts/check-grants.mjs holds the
 * server's folding to `foldBoardText`, and this holds the table's rows to the
 * list.
 */

const MIGRATIONS = new globalThis.URL("../../supabase/migrations/", import.meta.url);

/** Every term the migrations insert into board_blocked_terms, in order. */
function migratedTerms() {
  const terms = [];
  for (const file of readdirSync(MIGRATIONS).filter((name) => name.endsWith(".sql")).sort()) {
    const sql = readFileSync(new globalThis.URL(file, MIGRATIONS), "utf8");
    for (const block of sql.matchAll(/insert into public\.board_blocked_terms \(term\) values\s*([\s\S]*?)\s*on conflict/g)) {
      for (const match of block[1].matchAll(/\('((?:[^']|'')*)'\)/g)) terms.push(match[1].replaceAll("''", "'"));
    }
  }
  return terms;
}

test("the table the migrations fill is the browser's list", () => {
  assert.deepEqual([...new Set(migratedTerms())].sort(), [...BOARD_BLOCKED_TERMS].sort());
});

test("every term is written folded, once, and is short", () => {
  assert.equal(new Set(BOARD_BLOCKED_TERMS).size, BOARD_BLOCKED_TERMS.length, "no term twice");
  for (const term of BOARD_BLOCKED_TERMS) {
    assert.equal(foldBoardText(term), term, term);
    assert.ok(term.length >= 1 && term.length <= 40, term);
  }
});

test("folding: width, case, spaces and symbols, katakana, jamo typed apart", () => {
  assert.equal(foldBoardText("ＦＵＣＫ"), "fuck");
  assert.equal(foldBoardText("F.u-c k!"), "fuck");
  assert.equal(foldBoardText("sh1t"), "sht", "a digit is dropped, not read as a letter");
  assert.equal(foldBoardText("ｷﾁｶﾞｲ"), "きちがい", "half-width katakana, then hiragana");
  assert.equal(foldBoardText("キチガイ"), "きちがい");
  assert.equal(foldBoardText("ㅅㅣㅂㅏㄹ"), "시발", "initial and vowel joined, the lone final closes the syllable");
  assert.equal(foldBoardText("시바ㄹ"), "시발");
  assert.equal(foldBoardText("씨 . 발"), "씨발");
  assert.equal(foldBoardText("ㅆㅂ"), "ㅆㅂ", "an abbreviation stays as typed");
  assert.equal(foldBoardText("ㅄ"), "ㅂㅅ");
  assert.equal(foldBoardText("가ㄴㅏ"), "가나", "an initial before a vowel starts the next syllable");
  assert.equal(foldBoardText(""), "");
  assert.equal(foldBoardText(null), "");
});

test("words that hold part of a blocked word are not refused", () => {
  for (const text of ["껌을 씹다", "새끼 고양이", "미친 연출", "シネマ", "ガイジンさん", "Dickens", "shiitake", "좋아요ㅋㅋㅋ", "시바견 귀엽다", "assistant"]) {
    assert.equal(findBlockedTerm(text), null, text);
  }
  assert.equal(findBlockedTerm("병 신"), "병신");
  assert.equal(findBlockedTerm("作者死ね"), "死ね");
});

test("the name is checked before the post, as the trigger checks them", () => {
  assert.equal(getBoardBlockedRefusal("병신", "씨발", findBlockedTerm), "nickname-blocked");
  assert.equal(getBoardBlockedRefusal("점검", "씨발", findBlockedTerm), "body-blocked");
  assert.equal(getBoardBlockedRefusal("점검", "평범한 글", findBlockedTerm), null);
});

test("the list is loaded when a post is about to go", async () => {
  assert.equal(await findBoardBlockedRefusal("점검", "ＦＵＣＫ"), "body-blocked");
  assert.equal(await findBoardBlockedRefusal("점검", "평범한 글"), null);
});
