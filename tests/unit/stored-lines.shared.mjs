import assert from "node:assert/strict";

import { getPastRunMemory, isStaleBook } from "../../src/advancedSystems.js";
import { getEndingBook } from "../../src/state/endingBook.js";
import { normalizeEndingBook } from "../../src/state/seasonRecord.js";
import { pendingRowLabel } from "../../src/state/pendingRowLabel.js";

/**
 * #496 질문 1-2: what a Korean page stored -- the season record's memory line
 * and 결말 도감, the remote-save queue's row labels -- read on a page in
 * another language. The record keeps the line in the language the season was
 * finished in; the panel draws it again from the record's ending and verdict.
 * A queued row is named again from its payload. Each language runs in a test
 * file of its own (the overlay writes over the tables in place).
 */
const HANGUL = /[가-힣]/;
// NEW GAME+ is held together by a no-break space in some lines; the tests read it as a space.
const text = (record) => getPastRunMemory({}, record).text.replace(/\u00a0/g, " ");

/** A record a Korean page wrote when its season closed on QUIET COVER under 봉인. */
export const koreanRecord = (verdict = "ending_seal", line = "지난 시즌: 봉인 · QUIET COVER. NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다.") => ({
  seasons: 1,
  countedRuns: ["run-a"],
  last: { runId: "run-a", endingId: "quiet-cover", endingLabel: "QUIET COVER", verdict, verdictName: "봉인", tableRules: 1, line },
  previous: null,
  endingBook: { head: "결말 1/9 · 판결 1/3. 다음 시즌에 노려 볼 결말은 공개와 개입입니다.", hints: [] },
});

/** Rows a Korean page queued before #496 read their labels from the copy. */
export const koreanRows = {
  case: { id: "case-1", type: "case", label: "프롤로그 01 사건 로그", payload: { case_id: "prologue01" } },
  feedback: { id: "feedback-1", type: "feedback", label: "프롤로그 01 피드백", payload: { case_id: "prologue01" } },
  error: { id: "error-1", type: "error", label: "prologue01 / p1_start 에러 로그", payload: { current_case: "prologue01", node_id: "p1_start" } },
  errorWithoutScene: { id: "error-2", type: "error", label: "알 수 없는 에러 로그", payload: {} },
  season: { id: "season-final-run-a", type: "case", label: "SEASON 01 COMPLETE", payload: { case_id: "season-final" } },
  unknownCase: { id: "case-2", type: "case", label: "옛 사건 사건 로그", payload: { case_id: "case-gone" } },
  other: { id: "x", type: "ranking", label: "다른 줄", payload: { case_id: "prologue01" } },
};

/** The Korean page: the line it drew before, the stored labels' words, and a Korean book left alone. */
export function assertKoreanPage() {
  const memory = getPastRunMemory({}, koreanRecord());
  assert.ok(memory.text.startsWith(koreanRecord().last.line), "the Korean line is drawn as it was stored");
  assert.ok(getPastRunMemory({}, koreanRecord("collapse")).text.startsWith("지난 시즌: QUIET COVER. NEW\u00a0GAME+로"), "a collapse names no verdict and promises the line");
  assert.ok(getPastRunMemory({}, koreanRecord("open")).text.startsWith("지난 시즌: QUIET COVER. NEW\u00a0GAME+는"), "an open verdict promises nothing");
  assert.ok(getPastRunMemory({}, koreanRecord(null)).text.startsWith("지난 시즌: QUIET COVER. NEW\u00a0GAME+는"));
  assert.equal(pendingRowLabel(koreanRows.case), "프롤로그 01 사건 로그");
  assert.equal(pendingRowLabel(koreanRows.feedback), "프롤로그 01 피드백");
  assert.equal(pendingRowLabel(koreanRows.error), "prologue01 / p1_start 에러 로그");
  assert.equal(isStaleBook(koreanRecord(), "ko"), false, "a Korean book on a Korean page is kept");
  assert.equal(getEndingBook({ seasons: 1 }).lang, "ko", "the book says which language it was written in");
}

/** The page in `lang`, with its dictionary laid over: nothing the Korean page stored reads in Korean. */
export function assertTranslated(lang, { line, collapse, open, rows }) {
  const record = koreanRecord();
  const drawn = text(record);
  assert.ok(drawn.startsWith(line), `${lang}: ${drawn}`);
  assert.ok(!HANGUL.test(drawn), `${lang}: no Hangul in "${drawn}"`);
  assert.ok(text(koreanRecord("collapse")).startsWith(collapse), text(koreanRecord("collapse")));
  assert.ok(text(koreanRecord("open")).startsWith(open), text(koreanRecord("open")));
  assert.equal(record.last.line.startsWith("지난 시즌"), true, "the record itself is not rewritten");

  // A record with no ending to draw from keeps its stored line, the one fallback.
  const bare = { seasons: 1, last: { line: "지난 시즌: 봉인 · QUIET COVER." } };
  assert.ok(getPastRunMemory({}, bare).text.startsWith("지난 시즌: 봉인 · QUIET COVER."));
  assert.equal(getPastRunMemory({}, { seasons: 1, last: { endingId: "quiet-cover" } }), null, "no label and no line: nothing to say");

  // The 결말 도감 is the runtime's to write again: the shell sees it is in another language.
  assert.equal(isStaleBook(record, lang), true, `${lang}: a Korean book is stale`);
  assert.equal(isStaleBook({ endingBook: { head: "Endings 1/9", hints: [] } }, lang), false, "a book with no Hangul and no lang is kept");
  assert.equal(isStaleBook({ endingBook: { head: "Endings 1/9", hints: [] } }, "ko"), true, "an English book on a Korean page is stale");
  assert.equal(isStaleBook({ endingBook: { head: "x", hints: [], lang } }, lang), false);
  assert.equal(isStaleBook({ endingBook: { head: "x", hints: [], lang: "ko" } }, lang), true);
  assert.equal(isStaleBook({ endingBook: null }, lang), false);
  assert.equal(isStaleBook(null, lang), false);
  assert.deepEqual(normalizeEndingBook({ head: "x", hints: [], lang }), { head: "x", hints: [], lang }, "the book's lang is kept");
  assert.deepEqual(normalizeEndingBook({ head: "x", hints: [], lang: "" }), { head: "x", hints: [] });

  // The queue's rows, named again from their payloads.
  assert.equal(pendingRowLabel(koreanRows.case), rows.case);
  assert.equal(pendingRowLabel(koreanRows.feedback), rows.feedback);
  assert.equal(pendingRowLabel(koreanRows.error), rows.error);
  assert.equal(pendingRowLabel(koreanRows.errorWithoutScene), koreanRows.errorWithoutScene.label, "an error row with no scene keeps its label");
  assert.equal(pendingRowLabel(koreanRows.season), "SEASON 01 COMPLETE", "the season's row keeps its English title");
  assert.equal(pendingRowLabel(koreanRows.unknownCase), koreanRows.unknownCase.label, "a case the season no longer has keeps its label");
  assert.equal(pendingRowLabel(koreanRows.other), koreanRows.other.label);
  assert.equal(pendingRowLabel(undefined), undefined);
}
