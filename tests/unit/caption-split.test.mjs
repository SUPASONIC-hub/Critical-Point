import assert from "node:assert/strict";
import test from "node:test";

import { captionBoxes, captionGroups, markProse } from "../../src/components/proseMarks.js";
import { proseSentences, sentenceTexts } from "../../src/components/proseSentences.js";
import { captionSentences, getSpeakerLine, speechSpans } from "../../src/gauntlet/speakerLine.js";
import { nodes } from "../../src/gameData.js";

/**
 * One sentence cut for the briefing's boxes and the balloon's box numbers
 * (caption-split, 2026-11-03): a speech closed after its stop ends a sentence,
 * the narration after it opens a new box, and 「。」「！」「？」 end Japanese ones.
 */

test("a speech closed right after its stop ends the sentence, and the narration after it is a new box", () => {
  const text = "한서윤이 말합니다. '오진우도 안을 내요. 오진우 쪽 조건은 저한테도 안 왔어요.' 봉투 맨 뒤에는 익명 제보가 있습니다.";
  assert.deepEqual(captionSentences(text), [
    "한서윤이 말합니다.",
    "'오진우도 안을 내요.",
    "오진우 쪽 조건은 저한테도 안 왔어요.'",
    "봉투 맨 뒤에는 익명 제보가 있습니다.",
  ]);
  assert.deepEqual(captionGroups(text), ["한서윤이 말합니다.", "'오진우도 안을 내요. 오진우 쪽 조건은 저한테도 안 왔어요.'", "봉투 맨 뒤에는 익명 제보가 있습니다."]);
});

test("Japanese sentences end at 。！？ with no space after, and a quote after 。 closes or opens by its pair", () => {
  const text = "ト・ユナが言う。'書類のない212人が、まだ待っています。本当です！' ソアが筆箱を出す。次の文？";
  assert.deepEqual(sentenceTexts(text), ["ト・ユナが言う。", "'書類のない212人が、まだ待っています。", "本当です！'", "ソアが筆箱を出す。", "次の文？"]);
  // No space is put between Japanese sentences that share a box.
  assert.deepEqual(captionGroups(text), ["ト・ユナが言う。", "'書類のない212人が、まだ待っています。本当です！'", "ソアが筆箱を出す。次の文？"]);
});

test("speech opened mid-sentence (says, '…' / '…'라고) stays in its sentence, and a cited phrase is not speech", () => {
  assert.deepEqual(captionGroups("Lee Minseo asks, 'Why do I fail if I don't sign?' Nobody answers. Then more."), [
    "Lee Minseo asks, 'Why do I fail if I don't sign?'",
    "Nobody answers. Then more.",
  ]);
  assert.deepEqual(captionGroups("엿새 전 전화로 '여권 있죠?'라고 묻던 서하린입니다. 끝."), ["엿새 전 전화로 '여권 있죠?'라고 묻던 서하린입니다. 끝."]);
  assert.deepEqual(captionGroups("실적판에 '이달의 판매왕' 스티커가 있습니다. 그가 웃습니다."), ["실적판에 '이달의 판매왕' 스티커가 있습니다. 그가 웃습니다."]);
  // An apostrophe between Latin letters is not a quote, and an unmatched quote opens nothing.
  assert.deepEqual(sentenceTexts("The analyst's desk. It's late."), ["The analyst's desk.", "It's late."]);
  assert.deepEqual(sentenceTexts("안 왔어요.' 봉투가 있습니다."), ["안 왔어요.' 봉투가 있습니다."]);
});

test("a plural possessive (analysts' room) is not a quote, and the pairs after it keep their places", () => {
  const text = "The analysts' room is cold. Kim says, 'Sit.' She waits.";
  assert.deepEqual(sentenceTexts(text), ["The analysts' room is cold.", "Kim says, 'Sit.'", "She waits."]);
  // The box breaks after 'Sit.' (before the fix it ran on into "She waits.").
  assert.deepEqual(captionGroups(text), ["The analysts' room is cold. Kim says, 'Sit.'", "She waits."]);
  assert.deepEqual(speechSpans(text).map(({ start, end }) => text.slice(start, end)), ["'Sit.'"]);
  assert.deepEqual(
    markProse(text).filter((segment) => segment.marks.includes("say")).map((segment) => segment.text),
    ["'Sit.'"],
  );
  // Two in a row, and one after a speech has closed.
  const more = "The employees' catches and the lenders' files sit apart. 'Read them.' The clerks' desks are bare.";
  assert.deepEqual(sentenceTexts(more), ["The employees' catches and the lenders' files sit apart.", "'Read them.'", "The clerks' desks are bare."]);
  assert.deepEqual(speechSpans(more).map(({ start, end }) => more.slice(start, end)), ["'Read them.'"]);
  // Inside an open quote the same shape closes it: a cited phrase that ends in "s".
  const cited = "Reading the clause, the phrase 'their officers and employees' catches your eye. 'Go on.' He nods.";
  assert.deepEqual(speechSpans(cited).map(({ start, end }) => cited.slice(start, end)), ["'their officers and employees'", "'Go on.'"]);
  assert.deepEqual(sentenceTexts(cited), ["Reading the clause, the phrase 'their officers and employees' catches your eye.", "'Go on.'", "He nods."]);
});

test("in every scene the boxes are the paragraph's words in order, and each box's sentences are the balloon's", () => {
  for (const [id, node] of Object.entries(nodes)) {
    const text = node.text ?? "";
    const boxes = captionBoxes(text);
    const sentences = captionSentences(text);
    assert.equal(boxes.reduce((sum, box) => sum + box.count, 0), sentences.length, id);
    const ranges = proseSentences(text);
    for (const box of boxes) assert.equal(box.text, text.slice(ranges[box.first].start, ranges[box.first + box.count - 1].end), id);
    assert.equal(boxes.map((box) => box.text).join("").replace(/\s+/g, ""), text.replace(/\s+/g, ""), id);
    assert.deepEqual(ranges.map(({ start, end }) => text.slice(start, end)), sentences, id);
    // A name chip sits on a box that holds the speaker's speech.
    const { whoAt, fromLead } = getSpeakerLine(node, node.speaker ? [node.speaker] : []);
    if (fromLead) continue;
    for (const at of whoAt) assert.ok(boxes.some((box) => at >= box.first && at < box.first + box.count && box.text.includes("'")), `${id}: chip box ${at}`);
  }
});
