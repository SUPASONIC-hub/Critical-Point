import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import observerKo from "../../src/copy/observer.js";
import observerEn from "../../src/locales/en/screens/observer.js";
import observerJa from "../../src/locales/ja/screens/observer.js";
import endingKo from "../../src/copy/ending.js";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";
import { koreanDate, NOTE_AUTHOR, noteDay, NOTES, NOTES_INDEX_PATH as INDEX_PATH, publishedNotes, recentNotes, seoulDay } from "../../src/notes/noteIndex.js";
import { NOTES_INDEX_PATH, READING_KINDS, readingMenu, readingPath } from "../../src/homeReading.js";
import { bylineOf, markdownToHtml, noteKinds, noteLastmod, notesDay, noteSource, renderNotePages } from "../../scripts/content-pages/notes.mjs";
import { mainOf, renderStaticPages, sitemapEntries, sitemapLastmods } from "../../scripts/site-pages.mjs";
import { readStructuredData } from "../../scripts/structured-data.mjs";

/**
 * The notes (scripts/content-pages/notes.mjs, src/notes/noteIndex.js) and the
 * start screen's reading section (src/homeReading.js): AdSense 2차 분석 and the
 * owner's decision of 2026-11-20 (Q1 to Q3 「1」). A note goes out on its own
 * day, in Korean, signed and dated, two to four thousand characters long, and
 * tells no ending.
 */

const LAST = NOTES.map((note) => note.published).sort().at(-1);
const all = renderNotePages({ day: LAST });
const text = (html) => mainOf(html).replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

test("every note has its words on disk, a day of its own, a title and a summary", () => {
  assert.ok(NOTES.length >= 4);
  assert.equal(new Set(NOTES.map((note) => note.slug)).size, NOTES.length);
  for (const note of NOTES) {
    assert.match(note.slug, /^[a-z0-9-]+$/);
    assert.match(note.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(existsSync(`scripts/content-pages/notes/${note.slug}.md`), `${note.slug}.md`);
    assert.ok(note.title.length >= 8 && note.summary.length >= 30, note.slug);
  }
  // The notes were first spread out a few a week, never two on one day (AdSense 2차 분석, 4-2). Since 2026-11-25
  // (the owner's 「2」) a ready note goes out at once, with no schedule, so several share a day. What still holds:
  // nothing dated before the first note, and one fixed order among notes of one day (later in NOTES = newer).
  assert.ok(NOTES.every((note) => note.published >= "2026-11-21"));
  const sameDay = publishedNotes("2026-11-25").filter((note) => note.published === "2026-11-25");
  assert.ok(sameDay.length >= 2, "several notes went out on 2026-11-25");
  assert.deepEqual(sameDay.map((note) => note.slug), NOTES.filter((note) => note.published === "2026-11-25").map((note) => note.slug).reverse());
});

test("a build writes the notes whose day has come, newest first, by the day in Seoul", () => {
  assert.deepEqual(publishedNotes("2026-11-20"), []);
  assert.deepEqual(publishedNotes("2026-11-21").map((note) => note.slug), ["debt-ratio-covenant"]);
  assert.deepEqual(publishedNotes("2026-11-24").map((note) => note.published), ["2026-11-23", "2026-11-21"]);
  assert.throws(() => publishedNotes("11-21"), /YYYY-MM-DD/);
  // 15:00 UTC is midnight in Seoul.
  assert.equal(seoulDay(new Date("2026-11-20T14:59:59Z")), "2026-11-20");
  assert.equal(seoulDay(new Date("2026-11-20T15:00:00Z")), "2026-11-21");
  assert.equal(notesDay({ CP_NOTES_DAY: "2026-11-27" }), "2026-11-27");
  assert.equal(notesDay({}), seoulDay());
  assert.throws(() => notesDay({ CP_NOTES_DAY: "tomorrow" }), /YYYY-MM-DD/);
  assert.deepEqual(noteKinds("2026-11-20"), ["notes/index"]);
  assert.deepEqual(Object.keys(renderNotePages({ day: "2026-11-20" })), ["notes/index.html"]);
  assert.ok(renderNotePages({ day: "2026-11-20" })["notes/index.html"].includes("첫 글을 준비하고 있습니다."));
  assert.equal(Object.keys(all).length, NOTES.length + 1);
  assert.equal(koreanDate("2026-11-05"), "2026년 11월 5일");
});

test("the Markdown a note is written in becomes plain HTML, escaped", () => {
  assert.equal(markdownToHtml("## 제목\n\n본문 **굵게** <b>\n둘째 줄"), "<h2>제목</h2>\n<p>본문 <strong>굵게</strong> &lt;b&gt; 둘째 줄</p>");
  assert.equal(markdownToHtml("### 작은 제목"), "<h3>작은 제목</h3>");
  assert.equal(markdownToHtml("- 하나\n- 둘"), "<ul>\n<li>하나</li>\n<li>둘</li>\n</ul>");
  assert.equal(markdownToHtml("1. 하나\n2. 둘"), "<ol>\n<li>하나</li>\n<li>둘</li>\n</ol>");
  assert.equal(markdownToHtml("> 인용\n> 둘째"), "<blockquote>인용 둘째</blockquote>");
  assert.equal(
    markdownToHtml("| 항목 | 2024 |\n|---|---|\n| 매출 | 200 |"),
    '<div class="table-wrap"><table>\n<thead><tr><th scope="col">항목</th><th scope="col">2024</th></tr></thead>\n<tbody>\n<tr><th scope="row">매출</th><td>200</td></tr>\n</tbody>\n</table></div>',
  );
  for (const note of NOTES) assert.doesNotMatch(markdownToHtml(noteSource(note.slug)), /\*\*|^#|\n#/, `${note.slug}: no Markdown left`);
});

test("each note is Korean, dated, signed and 2,000 to 4,000 characters, as an Article under the notes list", () => {
  for (const note of NOTES) {
    const html = all[`notes/${note.slug}.html`];
    assert.match(html, /<html lang="ko">/);
    assert.ok(html.includes(`<link rel="canonical" href="/notes/${note.slug}.html" />`));
    // Korean only: itself and x-default, and no other language to switch to.
    assert.deepEqual([...html.matchAll(/hreflang="([^"]+)" href=/g)].map((match) => match[1]), ["ko", "x-default"]);
    assert.doesNotMatch(html, /lang="en">English<|lang="ja">日本語</);
    assert.ok(html.includes(bylineOf(note)) && bylineOf(note).includes(`<time datetime="${note.published}">`) && bylineOf(note).includes(`글: ${NOTE_AUTHOR.replace("&", "&amp;")}`), note.slug);
    const words = text(html);
    assert.ok(words.replace(/\s/g, "").length >= 2000, `${note.slug}: ${words.replace(/\s/g, "").length} characters without spaces`);
    assert.ok(words.trim().length <= 4000, `${note.slug}: ${words.trim().length} characters`);
    const [article, trail] = readStructuredData(html);
    assert.equal(article["@type"], "Article");
    assert.equal(article.headline, note.title);
    assert.equal(article.datePublished, note.published);
    assert.equal(article.dateModified, noteDay(note));
    assert.deepEqual(article.author.map((person) => person.name), ["SUPASONIC", "ALICE"]);
    assert.deepEqual(trail.itemListElement.map((item) => item.item), [NOTES_INDEX_PATH, `/notes/${note.slug}.html`]);
  }
  const list = all["notes/index.html"];
  for (const note of NOTES) assert.ok(list.includes(`<a href="/notes/${note.slug}.html">`), note.slug);
});

test("no note tells an ending or speaks as one person: we write them together", () => {
  const titles = [observerKo, observerEn, observerJa].flatMap((copy) => Object.values(copy.endings).map((ending) => ending.title));
  const verdicts = [...Object.values(endingKo.verdicts).map((verdict) => verdict.title), endingKo.collapse.title];
  const forbidden = [...Object.keys(observerKo.endings).filter((id) => id.includes("-")), ...titles, ...verdicts].filter((phrase) => phrase && phrase.length >= 6);
  assert.ok(forbidden.length >= 20);
  for (const note of NOTES) {
    const words = text(all[`notes/${note.slug}.html`]);
    for (const phrase of forbidden) assert.ok(!words.includes(phrase), `${note.slug} names an ending: ${phrase}`);
    assert.doesNotMatch(words, /(^|[^가-힣])(나는|내가|나의|저는|제가|저의)/, `${note.slug} speaks as one person`);
    assert.match(words, /우리/, `${note.slug} is in our voice`);
  }
});

test("the sitemap lists the notes out by its day, each dated by itself, in Korean only", () => {
  const entries = sitemapEntries("2026-11-24").filter(({ loc }) => loc.startsWith("/notes/"));
  assert.deepEqual(entries, [
    { loc: "/notes/index.html", alternates: { ko: "/notes/index.html" } },
    { loc: "/notes/revenue-pulled-forward.html", alternates: { ko: "/notes/revenue-pulled-forward.html" } },
    { loc: "/notes/debt-ratio-covenant.html", alternates: { ko: "/notes/debt-ratio-covenant.html" } },
  ]);
  const days = sitemapLastmods({ date: "2026-11-24", dates: {}, prints: {} });
  assert.deepEqual(days, { "/notes/index.html": "2026-11-23", "/notes/revenue-pulled-forward.html": "2026-11-23", "/notes/debt-ratio-covenant.html": "2026-11-21" });
  assert.equal(noteLastmod("notes/index", "2026-11-20"), null);
  assert.ok(Object.keys(renderStaticPages("", { day: LAST })).includes("notes/debt-ratio-covenant.html"));
});

test("the start screen's reading section lists the nine kinds of page in each language and the three newest notes", () => {
  const written = new Set(Object.keys(renderStaticPages("", { day: LAST })).map((file) => `/${file}`));
  for (const [language, copy] of Object.entries({ ko: introCopy, en: enIntro, ja: jaIntro })) {
    const menu = readingMenu(copy.reading, copy.legal, language);
    assert.deepEqual(menu.map((row) => row.kind), READING_KINDS);
    assert.equal(READING_KINDS.length, 9);
    for (const row of menu) for (const link of row.links) assert.ok(written.has(link.href), `${language}: ${link.href}`);
    assert.deepEqual(menu.at(-1).links.map((link) => link.label), [copy.legal.privacy, copy.legal.terms], `${language}: 방침·약관 is the two policies`);
    assert.equal(menu.find((row) => row.kind === "notes/index").links[0].hreflang, language === "ko" ? null : "ko");
    // 300 to 500 characters of what the game is (Korean; the others say the same).
    if (language === "ko") assert.ok(copy.reading.intro.join(" ").length >= 300 && copy.reading.intro.join(" ").length <= 500);
  }
  assert.equal(NOTES_INDEX_PATH, INDEX_PATH, "one address for the list");
  assert.equal(readingPath("guide", "en"), "/en/guide.html");
  assert.equal(readingPath("notes/index", "ja"), "/notes/index.html");
  assert.deepEqual(recentNotes("2026-11-20"), []);
  assert.deepEqual(
    recentNotes(LAST).map((note) => note.href),
    publishedNotes(LAST).slice(0, 3).map((note) => `/notes/${note.slug}.html`),
  );
  assert.equal(recentNotes(LAST, 1)[0].date, koreanDate(LAST));
});
