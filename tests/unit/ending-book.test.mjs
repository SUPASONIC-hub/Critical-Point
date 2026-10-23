import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const { SEASON_RECORD_KEY } = await import("../../src/appConfig.js");
const { getPastRunMemory } = await import("../../src/advancedSystems.js");
const { ENDING_IDS } = await import("../../src/gameLogic.js");
const { BOOK_ENDINGS, BOOK_VERDICTS, getEndingBook } = await import("../../src/state/endingBook.js");
const { normalizeSeasonRecord, recordFinishedSeason, withEndingBook } = await import("../../src/state/newGamePlusCarry.js");
const { normalizeEndingBook } = await import("../../src/state/seasonRecord.js");
const { refreshSeasonRecord } = await import("../../src/state/useNewGamePlus.js");
const { VERDICT_ENDINGS } = await import("../../src/verdictBranch.js");

/**
 * E-3 결말 도감: the start screen counts the endings and rulings this device
 * has seen, names one the next season can reach, and hints at the rest. The
 * lines are written into the season record on the runtime's side; the entry's
 * panel prints them.
 */

const ending = (id) => ({ id, label: id.toUpperCase().replace("-", " "), failure: id === "collapse" });
/** The book's count, the head's first sentence. */
const countOf = (record) => record.endingBook.head.split(".")[0];
const close = (record, runId, id, finalChoiceId = null) =>
  recordFinishedSeason(record, { runId, finalSummary: { endingVariant: ending(id), gauntlet: { tableRules: 2 } }, finalChoiceId });

test("the book counts the nine endings the ruling resolves and the three rulings, and makes none", () => {
  assert.equal(BOOK_ENDINGS.length, 9);
  assert.deepEqual(new Set(BOOK_ENDINGS), new Set([...ENDING_IDS, "open-question"]), "the endings getEndingVariant returns, no more");
  assert.deepEqual(BOOK_VERDICTS, Object.keys(VERDICT_ENDINGS));
  assert.equal(getEndingBook({ seasons: 0, endingsSeen: ["quiet-cover"] }), null, "nothing before a season is counted");
  assert.equal(getEndingBook(), null);
});

test("a counted season adds its ending and ruling, and a replayed finale adds to the lists without counting a season", () => {
  const first = close(null, "run-a", "human-record", "ending_reform");
  assert.deepEqual(first.endingsSeen, ["human-record"]);
  assert.deepEqual(first.verdictsSeen, ["ending_reform"]);
  assert.match(first.endingBook.head, /^결말 1\/9 · 판결 1\/3\. 다음 시즌에 닿을 수 있는 결말은 공개와 개입입니다\. 사건 기록의 90% 이상을 열고 /, "the first ending not seen, in the book's order");
  assert.equal(first.endingBook.hints.length, 7 + 2, "seven more endings and two rulings");
  assert.ok(!first.endingBook.hints.some((hint) => hint.startsWith("공개와 개입")), "the next line is not hinted twice");

  const replayed = close(first, "run-a", "quiet-cover", "ending_seal");
  assert.equal(replayed.seasons, 1);
  assert.deepEqual(replayed.endingsSeen, ["human-record", "quiet-cover"]);
  assert.deepEqual(replayed.verdictsSeen, ["ending_reform", "ending_seal"]);
  assert.equal(countOf(replayed), "결말 2/9 · 판결 2/3");

  const fallen = close(replayed, "run-b", "collapse");
  assert.equal(fallen.seasons, 2);
  assert.deepEqual(fallen.verdictsSeen, ["ending_reform", "ending_seal", "collapse"]);
  assert.equal(countOf(fallen), "결말 3/9 · 판결 2/3", "a collapse is an ending, not a ruling");
  const open = close(fallen, "run-c", "profitable-silence", "ending_expose");
  assert.equal(countOf(open), "결말 4/9 · 판결 2/3", "폭로 beside PROFITABLE SILENCE is the open verdict");
  assert.equal(countOf(close(open, "run-d", "field-pact")), "결말 5/9 · 판결 2/3");
  assert.deepEqual(recordFinishedSeason(open, { runId: "run-e" }), normalizeSeasonRecord(open), "no closed finale, nothing added");
});

test("the next line never aims at the collapse, and turns to a ruling once every other ending is seen", () => {
  const all = BOOK_ENDINGS.filter((id) => id !== "collapse");
  const book = getEndingBook({ seasons: 9, endingsSeen: all, verdictsSeen: ["ending_seal"] });
  assert.match(book.head, /^결말 8\/9 · 판결 1\/3\. 다음 시즌에 내릴 수 있는 판결은 개혁입니다\. 피날레의 마지막 질문에서 그 길을 고르고, 결말이 공개와 개입 · 증거와 개혁 · /);
  assert.equal(book.hints.length, 2, "the collapse and 폭로");
  assert.ok(book.hints.some((hint) => hint.startsWith("압박과 붕괴: 사건마다 남긴 사람 피해가 평균 20 이상")));
  assert.ok(book.hints.some((hint) => hint.startsWith("판결 폭로: ")));
  const done = getEndingBook({ seasons: 12, endingsSeen: BOOK_ENDINGS, verdictsSeen: BOOK_VERDICTS });
  assert.deepEqual(done, { head: "결말 9/9 · 판결 3/3.", hints: [] });
  assert.equal(getEndingBook({ seasons: 1, endingsSeen: ["no-such-ending"], verdictsSeen: ["open"] }).head, "결말 0/9 · 판결 0/3. 다음 시즌에 닿을 수 있는 결말은 공개와 개입입니다. 사건 기록의 90% 이상을 열고 믿음과 공정함을 함께 높게 지킨 시즌이 닿습니다.");
});

test("a record kept before the book reads as having seen its last two endings, and keeps its shape", () => {
  const old = {
    seasons: 2,
    countedRuns: ["run-a", "run-b"],
    last: { runId: "run-b", endingId: "field-pact", endingLabel: "FIELD PACT", verdict: "ending_expose" },
    previous: { endingId: "collapse", verdict: "collapse" },
  };
  const read = normalizeSeasonRecord(JSON.stringify(old));
  assert.deepEqual(read.endingsSeen, ["field-pact", "collapse"]);
  assert.deepEqual(read.verdictsSeen, ["ending_expose", "collapse"]);
  assert.equal(read.endingBook, null, "no lines until the runtime writes them");
  assert.equal(read.seasons, 2);
  assert.equal(read.last.line, null);
  assert.equal(countOf(withEndingBook(old)), "결말 2/9 · 판결 1/3");
  const odd = normalizeSeasonRecord({ seasons: 1, endingsSeen: "x", verdictsSeen: [3, "toString", "ending_seal", "ending_seal"] });
  assert.deepEqual(odd.endingsSeen, []);
  assert.deepEqual(odd.verdictsSeen, ["ending_seal"]);
});

test("the stored lines are read safely", () => {
  assert.equal(normalizeEndingBook(null), null);
  assert.equal(normalizeEndingBook({ head: "" }), null);
  assert.equal(normalizeEndingBook({ count: "결말 1/9", hints: [] }), null, "a shape the book never wrote");
  assert.equal(normalizeEndingBook([]), null);
  assert.deepEqual(normalizeEndingBook({ head: "결말 1/9 · 판결 0/3.", hints: ["a", 2, ""], extra: 1 }), { head: "결말 1/9 · 판결 0/3.", hints: ["a"] });
  assert.deepEqual(normalizeEndingBook({ head: "h", hints: "a" }), { head: "h", hints: [] });
});

test("the runtime writes the lines back over a record kept before them, once", () => {
  globalThis.localStorage.removeItem(SEASON_RECORD_KEY);
  assert.equal(refreshSeasonRecord().seasons, 0);
  assert.equal(globalThis.localStorage.getItem(SEASON_RECORD_KEY), null, "no season, nothing written");
  const old = { seasons: 1, countedRuns: ["run-a"], last: { runId: "run-a", endingId: "quiet-cover", endingLabel: "QUIET COVER", verdict: "ending_seal", line: "지난 시즌: 봉인 · QUIET COVER." } };
  globalThis.localStorage.setItem(SEASON_RECORD_KEY, JSON.stringify(old));
  const refreshed = refreshSeasonRecord();
  assert.equal(countOf(refreshed), "결말 1/9 · 판결 1/3");
  assert.equal(refreshed.last.line, old.last.line, "the rest of the record is kept");
  const stored = globalThis.localStorage.getItem(SEASON_RECORD_KEY);
  assert.deepEqual(JSON.parse(stored).endingBook, refreshed.endingBook);
  assert.deepEqual(refreshSeasonRecord(), refreshed);
  assert.equal(globalThis.localStorage.getItem(SEASON_RECORD_KEY), stored, "a second read writes the same thing");
  globalThis.localStorage.removeItem(SEASON_RECORD_KEY);
});

test("the start screen's panel prints the stored lines as they are, raw or normalized", () => {
  const record = close(null, "run-a", "human-record", "ending_reform");
  const raw = JSON.parse(JSON.stringify(record));
  assert.deepEqual(getPastRunMemory({}, raw, "run-b").book, record.endingBook);
  assert.deepEqual(getPastRunMemory({}, record, "run-b").book, record.endingBook);
  assert.equal(getPastRunMemory({}, { ...raw, endingBook: null }, "run-b").book, null);
  assert.equal(getPastRunMemory({}, { ...raw, endingBook: { head: "h", hints: "x" } }, "run-b").book, null, "hints that are not a list");
  assert.equal(getPastRunMemory({}, { ...raw, endingBook: { count: "c", hints: [] } }, "run-b").book, null);
});
