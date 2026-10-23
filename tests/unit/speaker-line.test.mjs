import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { nodes } from "../../src/gameData.js";
import { markLines, markProse } from "../../src/components/proseMarks.js";
import { captionSentences, getSpeakerLine, speechSpans } from "../../src/gauntlet/speakerLine.js";
import { SPEAKER_NAMES } from "../../src/speakerPortraits.js";

/**
 * The briefing's balloon is the speaker's own speech and the question is a box
 * of its own, 「당신의 판단」 (A-2 = D-2). The reveal's voice is a decision,
 * not a quote (A-10).
 */

const source = (file) => readFileSync(new URL(`../../src/${file}`, import.meta.url), "utf8");
const scene = (speaker, text, lead) => ({ speaker, text, lead });

test("a speech goes to the speaker the narration last named, not to the first after the name", () => {
  const node = scene("한서윤", "한서윤 과장이 일어섭니다. 진세라가 안경을 올립니다. '첨부 7이 반대 의견으로 돼 있던데요.' 한서윤이 고개를 숙입니다. '안건에 영향 없습니다.'");
  assert.deepEqual(getSpeakerLine(node, ["한서윤", "진세라"]), { line: "안건에 영향 없습니다.", fromLead: false, whoAt: [3] });
});

test("a phrase cited in quotes is not said; with nothing said the lead is told, and with no lead nothing", () => {
  const node = scene("강태민", "강태민은 문가을에게 '힘만 세다'는 평을 듣습니다. 강태민이 웃습니다.", "떡집입니다.");
  assert.deepEqual(getSpeakerLine(node, ["강태민", "문가을"]), { line: "떡집입니다.", fromLead: true, whoAt: [] });
  assert.equal(getSpeakerLine({ ...node, lead: undefined }, ["강태민"]).line, "");
});

test("a long speech gives its first whole sentences, and a name in a speech names no one", () => {
  const long = "가".repeat(50);
  const node = scene("오진우", `오진우가 말합니다. '${long}. ${long}. 한서윤 씨는 압니다.' 그가 웁니다. '두 번째 말입니다.'`);
  const { line, whoAt } = getSpeakerLine(node, ["오진우", "한서윤"]);
  assert.equal(line, `${long}.`);
  assert.deepEqual(whoAt, [1, 4]);
});

test("every scene's balloon is words of its own text or its lead", () => {
  for (const [id, node] of Object.entries(nodes)) {
    if (!node.speaker || !node.text) continue;
    const { line, fromLead } = getSpeakerLine(node, SPEAKER_NAMES);
    if (!line) continue;
    assert.ok(fromLead ? line === node.lead : node.text.includes(line), `${id}: "${line}" is not the scene's`);
    assert.ok(fromLead || line.length <= 80 || !line.includes(". "), `${id}: the balloon is one line, not a speech`);
  }
});

test("its speech and its boxes are the speech marks' and the caption boxes' own, in every scene", () => {
  for (const [id, node] of Object.entries(nodes)) {
    const text = node.text ?? "";
    const said = markProse(text).filter((segment) => segment.marks.includes("say"));
    const marked = said.map((segment) => segment.text).join("");
    assert.equal(speechSpans(text).map(({ start, end }) => text.slice(start, end)).join(""), marked, `${id}: the speech is the marks' speech`);
    const sentences = captionSentences(text);
    assert.equal(markLines(sentences).length, sentences.length, id);
  }
  assert.ok(source("components/Prose.jsx").includes(String.raw`.split(/(?<=[.!?])\s+/)`), "ProseCaptions cuts at the same place");
});

test("the briefing prints the question as 당신의 판단 and the reveal prints the voice without quotes", () => {
  assert.match(source("gauntlet/SceneBriefing.jsx"), /<b>당신의 판단<\/b>\s+<p><Prose text=\{question\} \/><\/p>/);
  const reveal = source("components/DecisionReveal.jsx");
  assert.doesNotMatch(reveal, /"\{decisionReveal\.spokenChoice\}"/);
  assert.match(reveal, /"당신의 판단"/);
  const result = source("screens/ResultScreen.jsx");
  for (const label of ["처음 내린 판단", "가장 오래 붙잡은 판단", "판을 흔든 판단"]) assert.match(result, new RegExp(`label: "${label}"`));
});
