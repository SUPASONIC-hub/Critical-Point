import assert from "node:assert/strict";
import test from "node:test";

import CASE_BACKGROUND from "../../scripts/content-pages/cases/background-ko.mjs";
import { CASE_PAGES } from "../../scripts/content-pages/cases.mjs";
import { backgroundBox, renderContentPages } from "../../scripts/content-pages/pages.mjs";
import { mainOf, wordsOf } from "../../scripts/site-pages.mjs";
import { NOTES, notePath } from "../../src/notes/noteIndex.js";

/**
 * 「배경 지식」 (scripts/content-pages/cases/background-ko.mjs): every Korean
 * case page carries an essay of its own on the idea the case stands on, so a
 * case page is no longer a teaser that ends in 「게임에서 확인하세요」
 * (cp-archive/메모-20261120/adsense-2차-분석.md, cause 2). A note it names is
 * linked only once that note is out.
 */

const BEFORE_ANY_NOTE = "2026-11-20";
const AFTER_EVERY_NOTE = "2099-01-01";

test("every case has a 배경 지식 of 300 to 600 characters, each its own, in our voice", () => {
  assert.deepEqual(Object.keys(CASE_BACKGROUND).sort(), [...CASE_PAGES].sort());
  const seen = new Set();
  for (const [caseId, box] of Object.entries(CASE_BACKGROUND)) {
    const text = box.text.join(" ");
    assert.ok(box.title && box.text.length >= 2, `${caseId}: a title and paragraphs`);
    assert.ok(text.length <= 600 && text.replace(/\s/g, "").length >= 300, `${caseId}: ${text.length} characters`);
    assert.match(text, /우리/, `${caseId}: told by the two of us`);
    for (const line of box.text) {
      assert.ok(!seen.has(line), `${caseId}: a paragraph copied from another case`);
      seen.add(line);
    }
  }
  assert.equal(new Set(Object.values(CASE_BACKGROUND).map((box) => box.title)).size, CASE_PAGES.length, "no two cases share a title");
});

test("a 배경 지식 links a note only once the note is out, and the page's words do not move when it does", () => {
  const slugs = new Set(NOTES.map((note) => note.slug));
  const before = renderContentPages({ day: BEFORE_ANY_NOTE });
  const after = renderContentPages({ day: AFTER_EVERY_NOTE });
  for (const [caseId, box] of Object.entries(CASE_BACKGROUND)) {
    const file = `cases/${caseId}.html`;
    if (box.note) {
      const [slug, term] = box.note;
      assert.ok(slugs.has(slug), `${caseId}: ${slug} is a note`);
      assert.ok(box.text.join(" ").includes(term), `${caseId}: the text says ${term}`);
      const note = NOTES.find((entry) => entry.slug === slug);
      assert.equal(backgroundBox(caseId, "ko", note.published).includes(`href="${notePath(slug)}"`), true, `${caseId}: linked on ${note.published}`);
    }
    const section = /<section class="background"[\s\S]*?<\/section>/.exec(before[file])?.[0];
    assert.ok(section, `${file}: the box is on the page`);
    assert.doesNotMatch(section, /href="\/notes\//, `${file}: no note linked before its day`);
    assert.equal(wordsOf(mainOf(before[file])), wordsOf(mainOf(after[file])), `${file}: the same words either side of a note's day`);
    for (const language of ["en", "ja"]) assert.doesNotMatch(before[`${language}/${file}`], /class="background"/, `${language}/${file}: Korean first`);
  }
});
