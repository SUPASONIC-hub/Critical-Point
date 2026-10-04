import assert from "node:assert/strict";
import { test } from "node:test";

import { getClueHypotheses, getObserverPattern, getObserverTag } from "../../src/gameLogic.js";
import { CASE_PACKS } from "../../src/nodes/casePacks.js";

/**
 * How the observer files a decision (the tag on each log entry, and what the
 * run's tags add up to on the report), and which hypotheses a set of clues
 * opens. Both are read off the run's log and held clues alone.
 */
const calm = { responseTimeSec: 10, challenge: { riskDelta: 0 } };

test("a decision is filed by the first thing that is true of it", () => {
  // Leaving the prepared choices outranks what the sentence says.
  assert.equal(getObserverTag({ ...calm, reframe: true, choice: "침묵한다" }).label, "거부 표본");
  assert.equal(getObserverTag({ ...calm, choice: "공개를 미루고 기다린다" }).id, "opacity");
  assert.equal(getObserverTag({ ...calm, choiceId: "c1_after_silence", choice: "넘어간다" }).id, "opacity");
  assert.equal(getObserverTag({ ...calm, choice: "사람을 줄인다", resourcesBefore: { humanCost: 3 }, resourcesAfter: { humanCost: 9 } }).id, "sacrifice");
  assert.equal(getObserverTag({ responseTimeSec: 2, challenge: { riskDelta: 0 }, choice: "승인한다" }).id, "compliance");
  // A fast answer that raised the pressure is not the safe one.
  assert.equal(getObserverTag({ responseTimeSec: 2, challenge: { riskDelta: 7 }, choice: "승인한다" }).label, "고압 표본");
  assert.equal(getObserverTag({ responseTimeSec: 10, challenge: { riskDelta: 6 }, choice: "승인한다" }).id, "pattern");
  assert.equal(getObserverTag({ ...calm, choice: "승인한다" }).id, "pattern");
});

test("the pressure a decision added is read off the resources when the entry has them", () => {
  const before = { time: 72, capital: 100, humanCost: 0, fatigue: 0 };
  const spent = { ...before, capital: 60 };
  assert.equal(getObserverTag({ responseTimeSec: 10, choice: "승인한다", resourcesBefore: before, resourcesAfter: spent, challenge: { riskDelta: 0 } }).label, "고압 표본");
  assert.equal(getObserverTag({ responseTimeSec: 10, choice: "승인한다", resourcesBefore: before, resourcesAfter: before, challenge: { riskDelta: 20 } }).id, "pattern");
});

test("a run's tags are counted over what the player decided, and nothing else", () => {
  const pattern = getObserverPattern([
    null,
    { isSystemEvent: true, choice: "침묵" },
    { ...calm, choice: "승인한다" },
    { ...calm, choice: "비공개로 둔다" },
    { ...calm, choice: "기록을 봉인한다" },
    // A tag the entry already carries is kept as it was filed.
    { ...calm, choice: "침묵한다", observerTag: { id: "sacrifice", label: "희생 표본" } },
  ]);
  assert.deepEqual(pattern.counts, { pattern: 1, opacity: 2, sacrifice: 1 });
  assert.equal(pattern.dominant, "opacity");
  assert.equal(pattern.latest.id, "sacrifice");
  assert.equal(pattern.repeatedTail, false);
  assert.equal(pattern.endingRecord.label, "은폐 표본");
  assert.match(pattern.endingRecord.title, /가장 많이 남긴 표본/);
  assert.match(pattern.endingRecord.text, /희생 표본이 최근 기록으로 남아/);
  assert.equal(pattern.arc.title, "말하지 않은 판단이 사건의 어두운 조건으로 축적됩니다.");
});

test("three of the same in a row is a standard the observer is sure of", () => {
  const pattern = getObserverPattern([
    { ...calm, reframe: true, choice: "다시 짠다" },
    { ...calm, choice: "비공개로 둔다" },
    { ...calm, choice: "기록을 봉인한다" },
    { ...calm, choice: "침묵한다" },
  ]);
  assert.equal(pattern.repeatedTail, true);
  assert.match(pattern.endingRecord.title, /반복한 기준/);
  assert.match(pattern.endingRecord.text, /같은 표본이 연속으로 닫혀/);
});

test("the turning point is the first decision that breaks a pattern already set", () => {
  const entries = [
    { ...calm, choice: "승인한다" },
    { ...calm, choice: "검토한다" },
    { ...calm, choice: "비공개로 둔다", spokenChoice: "이건 비공개로 두겠습니다." },
    { ...calm, choice: "승인한다" },
  ];
  const pattern = getObserverPattern(entries);
  assert.equal(pattern.dominant, "pattern");
  assert.equal(pattern.turningPoint.title, "은폐 표본이 익숙한 패턴을 끊었습니다.");
  assert.match(pattern.turningPoint.text, /“이건 비공개로 두겠습니다.”/);
  assert.ok(pattern.endingRecord.text.endsWith(pattern.turningPoint.title));
  // Two decisions are not yet a pattern to break.
  assert.equal(getObserverPattern(entries.slice(1, 3)).turningPoint, null);
});

test("a hypothesis opens on the clues it names", () => {
  assert.deepEqual(getClueHypotheses([]), []);
  assert.deepEqual(
    getClueHypotheses([{ id: "c1-hidden-ledger" }, { id: "c2-false-timestamp" }, null]).map((hypothesis) => hypothesis.id),
    ["ledger-timestamp"],
  );
  assert.deepEqual(getClueHypotheses([{ id: "c1-hidden-ledger" }, { id: "c4-exception-file" }]), []);
});

test("an act's hypothesis opens at two thirds of its clues, and is surer with more", () => {
  const prologue = CASE_PACKS.filter((pack) => pack.id.startsWith("prologue")).map((pack) => ({ id: pack.clue.id }));
  assert.equal(prologue.length, 5);
  assert.deepEqual(getClueHypotheses(prologue.slice(0, 3)), []);
  const four = getClueHypotheses(prologue.slice(0, 4));
  assert.deepEqual(four.map(({ id, confidence }) => [id, confidence]), [["act-0", 82]]);
  assert.equal(getClueHypotheses(prologue)[0].confidence, 90);
});
