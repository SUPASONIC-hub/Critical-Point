import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CASE_PAGES } from "../../scripts/content-pages/cases.mjs";
import { CONTENT_KINDS, CONTENT_PUBLISHED, pageDateLine, renderContentPages } from "../../scripts/content-pages/pages.mjs";
import { PAGE_LANGUAGES, pagePath } from "../../scripts/legal-pages.mjs";
import { mainOf, pageFingerprints, renderStaticPages, wordsOf } from "../../scripts/site-pages.mjs";
import { refreshDates } from "../../scripts/sitemap-dates.mjs";

/**
 * The guide and the case files show when they went up and last changed. That
 * date comes from scripts/sitemap-dates.json, which is keyed by a hash of the
 * page's words: if the line counted as words, dating a page would change its
 * hash, and every page would be re-dated to one day.
 */

const recorded = () => JSON.parse(readFileSync("scripts/sitemap-dates.json", "utf8")).pages;
const DATED = CONTENT_KINDS.filter((kind) => kind === "guide" || kind.startsWith("cases/"));
const locs = DATED.flatMap((kind) => PAGE_LANGUAGES.map((language) => ({ kind, language, loc: pagePath(kind, language) })));

test("the date line is not in a page's hash: every recorded date holds with the lines on", () => {
  const file = recorded();
  const { stale, next } = refreshDates(file, pageFingerprints(), "2099-01-01");
  assert.deepEqual(stale, []);
  assert.deepEqual(next, file);
  const dated = renderStaticPages("");
  const bare = renderStaticPages("", { pageDates: null });
  for (const { loc } of locs) assert.notEqual(wordsOf(mainOf(dated[loc.slice(1)])), wordsOf(mainOf(bare[loc.slice(1)])), `${loc} shows a date`);
});

test("a different recorded date changes the line and nothing else, so it cannot move a hash", () => {
  const prints = pageFingerprints();
  const moved = Object.fromEntries(locs.map(({ loc }) => [loc, { date: "2031-02-03" }]));
  const pages = renderContentPages({ pageDates: moved });
  const bare = renderContentPages({ pageDates: null });
  for (const { loc, language } of locs) {
    const file = loc.slice(1);
    assert.ok(pages[file].includes(pageDateLine(language, "2031-02-03")), loc);
    assert.equal(pages[file].replace(pageDateLine(language, "2031-02-03"), ""), bare[file], loc);
  }
  assert.deepEqual(pageFingerprints(), prints);
});

test("each page shows the day it went up and the day the sitemap says it changed, in its language", () => {
  const file = recorded();
  const pages = renderContentPages();
  for (const { loc, language } of locs) {
    const main = mainOf(pages[loc.slice(1)]);
    assert.ok(file[loc], `${loc} has a recorded date`);
    assert.ok(main.includes(pageDateLine(language, file[loc].date)), loc);
    assert.ok(main.includes(`<time datetime="${CONTENT_PUBLISHED}">`), loc);
    assert.ok(file[loc].date >= CONTENT_PUBLISHED, `${loc} did not change before it went up`);
  }
  assert.equal(pageDateLine("ko", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">2026년 11월 9일</time> · 고친 날 <time datetime="2026-11-20">2026년 11월 20일</time></p>\n');
  assert.equal(pageDateLine("en", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">November 9, 2026</time> · Updated <time datetime="2026-11-20">November 20, 2026</time></p>\n');
  assert.equal(pageDateLine("ja", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">2026年11月9日</time> · 更新日 <time datetime="2026-11-20">2026年11月20日</time></p>\n');
  assert.doesNotMatch(pageDateLine("ko", CONTENT_PUBLISHED), /고친 날/, "a page unchanged since it went up shows one date");
});

test("only the guide and the case files carry the line", () => {
  const pages = renderContentPages();
  for (const kind of CONTENT_KINDS.filter((name) => !DATED.includes(name))) {
    for (const language of PAGE_LANGUAGES) assert.doesNotMatch(mainOf(pages[pagePath(kind, language).slice(1)]), /<time /, `${kind} ${language}`);
  }
});

test("every dated page went up on CONTENT_PUBLISHED: a new case needs a day of its own", () => {
  assert.equal(CASE_PAGES.length, 55, "A case page was added after #478 (2026-11-09). Give it its own published day in scripts/content-pages/pages.mjs, then update this count.");
});
