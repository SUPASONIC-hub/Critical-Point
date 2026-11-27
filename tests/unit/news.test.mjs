import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import observerKo from "../../src/copy/observer.js";
import endingKo from "../../src/copy/ending.js";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";
import {
  ARTICLES,
  dayNumber,
  FRONT_ORDER,
  frontPageFor,
  NEWS_DISCLAIMER,
  NEWS_INDEX_PATH,
  NEWS_PAPER,
  newsPath,
  seoulToday,
  todayFrontPage,
  worldDate,
} from "../../src/news/newsIndex.js";
import { articleMeta, articleSource, LIST_ORDER, NEWS_KINDS, renderNewsPages } from "../../scripts/content-pages/news.mjs";
import { markdownToHtml } from "../../scripts/content-pages/notes.mjs";
import { CASE_PAGES } from "../../scripts/content-pages/cases.mjs";
import { MENU_KINDS, menuPath, siteHeaderNav } from "../../scripts/content-pages/site-nav.mjs";
import { mainOf, renderStaticPages, sitemapEntries } from "../../scripts/site-pages.mjs";
import { readStructuredData } from "../../scripts/structured-data.mjs";
import { findBannedWords } from "../../scripts/plain-language-rules.mjs";

/**
 * 석간 원장, the world's newspaper (scripts/content-pages/news.mjs,
 * src/news/newsIndex.js), owner's decision 2026-11-20 「1」: thirty made-up
 * articles in Korean, each saying above and below its words that it is
 * fiction, dated inside the world, linked to the case files it touches, and
 * telling no ending; and the start screen's 오늘의 1면, fixed by the day.
 * Sixty since the second thirty (same day), so the front page turns over every
 * two months rather than every month.
 */

const pages = renderNewsPages();
const textOf = (html) => html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const body = (article) => textOf(markdownToHtml(articleSource(article.slug)));

test("sixty articles, each with its words on disk, a date inside the world, a page of the paper and case files that exist", () => {
  assert.equal(ARTICLES.length, 60);
  assert.equal(new Set(ARTICLES.map((article) => article.slug)).size, 60);
  assert.equal(new Set(ARTICLES.map((article) => article.title)).size, 60);
  const cases = new Set(CASE_PAGES);
  for (const article of ARTICLES) {
    assert.match(article.slug, /^[a-z0-9-]+$/);
    assert.match(article.day, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(existsSync(`scripts/content-pages/news/${article.slug}.md`), article.slug);
    assert.ok(article.title.length >= 10 && article.summary.length >= 30, article.slug);
    assert.ok(article.cases.length >= 1, article.slug);
    for (const caseId of article.cases) assert.ok(cases.has(caseId), `${article.slug}: ${caseId} has a case file page`);
  }
  // Many pages of a paper, not thirty of one kind: news, editorial, column, interview, briefs, letters and more.
  assert.ok(new Set(ARTICLES.map((article) => article.section)).size >= 10);
  assert.deepEqual(
    LIST_ORDER.map((article) => article.day),
    ARTICLES.map((article) => article.day).sort().reverse(),
  );
});

test("each article is 800 to 1,500 characters without spaces, in our Markdown, with no bank word the season dropped", () => {
  for (const article of ARTICLES) {
    const length = body(article).replace(/\s/g, "").length;
    assert.ok(length >= 800 && length <= 1500, `${article.slug}: ${length}`);
    assert.doesNotMatch(markdownToHtml(articleSource(article.slug)), /\*\*|^#|\n#/, `${article.slug}: no Markdown left`);
    assert.deepEqual(findBannedWords(articleSource(article.slug)), [], article.slug);
  }
});

test("every article page is Korean, says twice that it is made up, dates itself inside the world and links its case files", () => {
  assert.deepEqual(Object.keys(pages), NEWS_KINDS.map((kind) => `${kind}.html`));
  for (const article of ARTICLES) {
    const html = pages[`news/${article.slug}.html`];
    const main = mainOf(html);
    assert.match(html, /<html lang="ko">/);
    assert.ok(html.includes(`<link rel="canonical" href="${newsPath(article.slug)}" />`));
    assert.deepEqual([...html.matchAll(/hreflang="([^"]+)" href=/g)].map((match) => match[1]), ["ko", "x-default"]);
    // Above and below the words.
    assert.equal(main.split(NEWS_DISCLAIMER).length - 1, 2, article.slug);
    const words = articleSource(article.slug)
      .split("\n")
      .find((line) => line && !line.startsWith("#"))
      .slice(0, 20);
    assert.ok(main.indexOf(NEWS_DISCLAIMER) < main.indexOf(words) && main.lastIndexOf(NEWS_DISCLAIMER) > main.indexOf(words), `${article.slug}: one before, one after`);
    assert.ok(main.includes(articleMeta(article)) && articleMeta(article).includes(`<time datetime="${article.day}">${worldDate(article.day)}</time> (게임 속 날짜)`));
    for (const caseId of article.cases) assert.ok(main.includes(`<a href="/cases/${caseId}.html">`), `${article.slug}: ${caseId}`);
    // Fiction in the data too: a CreativeWork part of the game, never a NewsArticle.
    assert.doesNotMatch(html, /NewsArticle|"@type":"Article"/);
    const [work, trail] = readStructuredData(html);
    assert.equal(work["@type"], "CreativeWork");
    assert.match(work.genre, /픽션/);
    assert.equal(work.name, article.title);
    assert.equal(work.temporalCoverage, article.day);
    assert.equal(work.isPartOf["@type"], "VideoGame");
    assert.deepEqual(trail.itemListElement.map((item) => item.item), [NEWS_INDEX_PATH, newsPath(article.slug)]);
    assert.match(html, /<meta name="description" content="\[게임 속 가상 기사\]/);
  }
  const list = mainOf(pages["news/index.html"]);
  assert.equal(list.split(NEWS_DISCLAIMER).length - 1, 2);
  for (const article of ARTICLES) assert.ok(list.includes(`<a href="${newsPath(article.slug)}">`), article.slug);
});

test("no article tells an ending or names a real newspaper", () => {
  const titles = Object.values(observerKo.endings).map((ending) => ending.title);
  const verdicts = [...Object.values(endingKo.verdicts).map((verdict) => verdict.title), endingKo.collapse.title];
  const forbidden = [...Object.keys(observerKo.endings).filter((id) => id.includes("-")), ...titles, ...verdicts].filter((phrase) => phrase && phrase.length >= 6);
  assert.ok(forbidden.length >= 10);
  for (const article of ARTICLES) {
    const words = `${article.title} ${article.summary} ${body(article)}`;
    for (const phrase of forbidden) assert.ok(!words.includes(phrase), `${article.slug} names an ending: ${phrase}`);
    // The paper's own name and the world's outlets only: no 「…일보」, wire service or broadcaster of our world.
    assert.doesNotMatch(words, /일보(?!다)|통신사|뉴스1|타임스|헤럴드|데일리/, article.slug);
  }
});

test("오늘의 1면 is fixed by the day in Seoul: the same all day, the next one the next day, all sixty in sixty days", () => {
  assert.equal(dayNumber("1970-01-02"), 1);
  assert.throws(() => dayNumber("11-20"), /YYYY-MM-DD/);
  assert.deepEqual(frontPageFor("2026-11-20"), frontPageFor("2026-11-20"));
  assert.notEqual(frontPageFor("2026-11-20").href, frontPageFor("2026-11-21").href);
  const days = Array.from({ length: 60 }, (_, at) => frontPageFor(new Date(Date.UTC(2026, 10, 1 + at)).toISOString().slice(0, 10)).href);
  assert.equal(new Set(days).size, 60);
  assert.equal(frontPageFor("2026-11-20", []), null);
  const front = frontPageFor("2026-11-20");
  const article = FRONT_ORDER.find((item) => newsPath(item.slug) === front.href);
  assert.deepEqual(front, { href: front.href, title: article.title, summary: article.summary, section: article.section, day: article.day, date: worldDate(article.day) });
  // 15:00 UTC is midnight in Seoul: the page turns there, not at the reader's own midnight.
  assert.equal(seoulToday(new Date("2026-11-20T14:59:59Z")), "2026-11-20");
  assert.equal(seoulToday(new Date("2026-11-20T15:00:00Z")), "2026-11-21");
  assert.deepEqual(todayFrontPage(new Date("2026-11-20T15:00:00Z")), frontPageFor("2026-11-21"));
  assert.deepEqual(todayFrontPage(new Date("2026-11-21T14:00:00Z")), frontPageFor("2026-11-21"));
  assert.ok(todayFrontPage().href.startsWith("/news/"));
  assert.equal(worldDate("2025-06-02"), "2025년 6월 2일");
});

test("the start screen says, in its language, that the day's article is made up, and links the paper", () => {
  assert.equal(introCopy.reading.frontNote, NEWS_DISCLAIMER);
  for (const copy of [introCopy, enIntro, jaIntro]) {
    for (const key of ["frontTitle", "frontNote", "frontAll"]) assert.ok(copy.reading[key]?.length > 3, key);
  }
  assert.equal(NEWS_PAPER, "석간 원장");
});

test("the site menu, the sitemap and the build carry the paper, in Korean only", () => {
  assert.ok(MENU_KINDS.includes("news/index"));
  assert.equal(menuPath("news/index", "en"), "/news/index.html");
  assert.match(siteHeaderNav({ kind: "about", language: "ja" }), /<a href="\/news\/index.html" hreflang="ko">/);
  // An article's own menu names no other language and marks the paper as where it is.
  const head = siteHeaderNav({ kind: `news/${ARTICLES[0].slug}`, language: "ko" });
  assert.doesNotMatch(head, /hreflang="en"/);
  assert.match(head, /<a href="\/news\/index.html" aria-current="true">/);
  const entries = sitemapEntries("2026-11-20").filter(({ loc }) => loc.startsWith("/news/"));
  assert.equal(entries.length, ARTICLES.length + 1);
  for (const entry of entries) assert.deepEqual(entry.alternates, { ko: entry.loc });
  const built = Object.keys(renderStaticPages("", { day: "2026-11-20" }));
  for (const kind of NEWS_KINDS) assert.ok(built.includes(`${kind}.html`), kind);
});

test("the start screen's bundle carries the paper's name and link, and loads the articles as a chunk of their own", async () => {
  const { readFileSync } = await import("node:fs");
  const reading = readFileSync("src/components/HomeReading.jsx", "utf8");
  assert.match(reading, /from "\.\.\/news\/newsPaper\.js"/);
  assert.match(reading, /import\("\.\.\/news\/newsIndex\.js"\)/);
  assert.doesNotMatch(reading, /from "\.\.\/news\/newsIndex\.js"/);
  assert.doesNotMatch(readFileSync("src/screens/IntroScreen.jsx", "utf8"), /news\/newsIndex/);
});
