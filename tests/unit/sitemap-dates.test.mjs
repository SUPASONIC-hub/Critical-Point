import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { localizedStartPage, mainOf, pageFingerprints, sitemapEntries, sitemapLastmods, sitemapXml, withoutHtmlComments, wordsOf } from "../../scripts/site-pages.mjs";
import { refreshDates } from "../../scripts/sitemap-dates.mjs";
import { TITLE_TAIL } from "../../scripts/legal-pages.mjs";
import enIntro from "../../src/locales/en/screens/intro.js";

/**
 * Discovery leftovers (11-16): the sitemap's lastmod is the day a page last
 * changed, not the build's; the start page ships without index.html's notes
 * to developers; English titles say what the game is, and that it is free.
 */

test("every sitemap address has a fingerprint, and the same content hashes the same", () => {
  const prints = pageFingerprints();
  // A note is dated by its own day (src/notes/noteIndex.js), not by a hash.
  assert.deepEqual(Object.keys(prints), sitemapEntries().map(({ loc }) => loc).filter((loc) => !loc.startsWith("/notes/")));
  assert.ok(Object.values(prints).every((hash) => /^[0-9a-f]{16}$/.test(hash)));
  assert.deepEqual(pageFingerprints(), prints);
  assert.equal(new Set(Object.values(prints)).size, Object.keys(prints).length, "no two pages hash alike");
});

test("lastmod keeps a page's day while its hash holds, and moves to the build's day once it changes", () => {
  const prints = { "/": "aaaa", "/about.html": "bbbb", "/faq.html": "cccc" };
  const dates = { "/": { hash: "aaaa", date: "2026-11-01" }, "/about.html": { hash: "old0", date: "2026-11-02" } };
  assert.deepEqual(sitemapLastmods({ date: "2026-11-16", dates, prints, notes: [] }), { "/": "2026-11-01", "/about.html": "2026-11-16", "/faq.html": "2026-11-16" });
  // The file the build reads: written for these pages, it dates none of them by the build.
  const file = JSON.parse(readFileSync("scripts/sitemap-dates.json", "utf8")).pages;
  const xml = sitemapXml({ date: "2099-01-01", dates: Object.fromEntries(Object.entries(pageFingerprints()).map(([loc, hash]) => [loc, { hash, date: file[loc]?.date ?? "2026-11-16" }])) });
  assert.doesNotMatch(xml, /<lastmod>2099-01-01<\/lastmod>/);
  // Without the file every entry is the build's day, as before.
  assert.equal((sitemapXml({ date: "2099-01-01" }).match(/<lastmod>2099-01-01<\/lastmod>/g) ?? []).length, sitemapEntries("2099-01-01").length);
});

test("scripts/sitemap-dates.json is written for the pages as they are: a page whose words changed fails here, not quietly on the site", () => {
  // Until 11-20 nothing held the file to the pages, and by 11-19 every one of
  // the 198 hashes was stale, so every lastmod was the build's day.
  const file = JSON.parse(readFileSync("scripts/sitemap-dates.json", "utf8")).pages;
  const { stale } = refreshDates(file, pageFingerprints(), "2000-01-01");
  assert.deepEqual(stale, [], `${stale.length} pages' words changed since scripts/sitemap-dates.json was written. Run \`npm run sitemap:dates -- --write\` and commit the file.`);
  assert.ok(Object.values(file).every(({ date }) => /^\d{4}-\d{2}-\d{2}$/.test(date)));
});

test("a page is dated by its words: the menu, the sheet and the markup around them do not move it", () => {
  assert.equal(wordsOf('<div class="hero">\n<h1>제목</h1>  <a class="cta" href="/">지금</a></div>'), "제목 지금");
  assert.equal(wordsOf("<p>같은 말</p>"), wordsOf('<p class="lede">같은\n말</p>'));
  assert.equal(mainOf('<header>메뉴</header><main id="main" tabindex="-1">본문</main><footer>발</footer>'), "본문");
  assert.throws(() => mainOf("<body>본문</body>"), /without <main/);
});

test("sitemap:dates dates changed and new pages, keeps the rest and drops what the sitemap lost", () => {
  const pages = { "/": { hash: "aaaa", date: "2026-11-01" }, "/about.html": { hash: "old0", date: "2026-11-02" }, "/gone.html": { hash: "dddd", date: "2026-11-03" } };
  const { stale, next } = refreshDates(pages, { "/": "aaaa", "/about.html": "bbbb", "/faq.html": "cccc" }, "2026-11-16");
  assert.deepEqual(stale.sort(), ["/about.html", "/faq.html", "/gone.html"]);
  assert.deepEqual(next, { "/": { hash: "aaaa", date: "2026-11-01" }, "/about.html": { hash: "bbbb", date: "2026-11-16" }, "/faq.html": { hash: "cccc", date: "2026-11-16" } });
});

test("the built start page carries no HTML comments, and its scripts and styles are untouched", () => {
  const index = readFileSync("index.html", "utf8");
  assert.match(index, /<!--/, "the source keeps its notes");
  const shipped = withoutHtmlComments(index);
  assert.doesNotMatch(shipped, /<!--|-->/);
  const blocks = (html) => [...html.matchAll(/<(script|style)\b[\s\S]*?<\/\1>/g)].map((match) => match[0]);
  assert.deepEqual(blocks(shipped), blocks(index));
  assert.equal(withoutHtmlComments('<p>a</p>\n    <!-- note\n     two lines -->\n<script>var s = "<!-- kept -->";</script>'), '<p>a</p>\n<script>var s = "<!-- kept -->";</script>');
  for (const language of ["en", "ja"]) assert.doesNotMatch(localizedStartPage(shipped, language), /<!--/, language);
});

test("English titles lead with the genre and that it is free; Korean and Japanese keep the game's name", () => {
  assert.equal(enIntro.pageTitle, "Critical Point — Free Browser Mystery Game");
  assert.ok(enIntro.pageTitle.length <= 60);
  assert.equal(TITLE_TAIL.en, " — Critical Point, free browser mystery game");
  assert.equal(TITLE_TAIL.ko, " · 임계점: CRITICAL POINT");
  assert.equal(TITLE_TAIL.ja, " · 臨界点: CRITICAL POINT");
});
