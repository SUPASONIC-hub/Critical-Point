import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CASE_PAGES } from "../../scripts/content-pages/cases.mjs";
import { CONTENT_KINDS, CONTENT_PUBLISHED, dateLineOptions, pageDateLine, renderContentPages, SITE_PUBLISHED, WEEKLY_PUBLISHED } from "../../scripts/content-pages/pages.mjs";
import { PAGE_LANGUAGES, pagePath, renderLegalPages } from "../../scripts/legal-pages.mjs";
import { mainOf, pageFingerprints, renderSitePages, renderStaticPages, wordsOf } from "../../scripts/site-pages.mjs";
import { refreshDates } from "../../scripts/sitemap-dates.mjs";
import { CREATORS, STUDIO_NAMES } from "../../src/credits.js";

/**
 * Every content page shows when it went up, when it last changed and who
 * wrote it. That date comes from scripts/sitemap-dates.json, which is keyed by
 * a hash of the page's words: if the line counted as words, dating a page
 * would change its hash, and every page would be re-dated to one day.
 */

const recorded = () => JSON.parse(readFileSync("scripts/sitemap-dates.json", "utf8")).pages;
const locs = CONTENT_KINDS.flatMap((kind) => PAGE_LANGUAGES.map((language) => ({ kind, language, loc: pagePath(kind, language) })));
const lineOf = (kind, language, date) => pageDateLine(language, date, dateLineOptions(kind));

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
  for (const { kind, loc, language } of locs) {
    const file = loc.slice(1);
    const line = lineOf(kind, language, "2031-02-03");
    assert.ok(pages[file].includes(line), loc);
    assert.equal(pages[file].replace(line, ""), bare[file], loc);
  }
  assert.deepEqual(pageFingerprints(), prints);
});

test("each page shows the day it went up and the day the sitemap says it changed, in its language", () => {
  const file = recorded();
  const pages = renderContentPages();
  for (const { kind, loc, language } of locs) {
    const main = mainOf(pages[loc.slice(1)]);
    const { published } = dateLineOptions(kind);
    assert.ok(file[loc], `${loc} has a recorded date`);
    assert.ok(main.includes(lineOf(kind, language, file[loc].date)), loc);
    assert.ok(main.includes(`<time datetime="${published}">`), loc);
    assert.ok(file[loc].date >= published, `${loc} did not change before it went up`);
  }
  assert.equal(pageDateLine("ko", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">2026년 11월 9일</time> · 고친 날 <time datetime="2026-11-20">2026년 11월 20일</time> · 글: 찹쌀떡</p>\n');
  assert.equal(pageDateLine("en", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">November 9, 2026</time> · Updated <time datetime="2026-11-20">November 20, 2026</time> · Written by Mochi Verse</p>\n');
  assert.equal(pageDateLine("ja", "2026-11-20"), '<p class="effective"><time datetime="2026-11-09">2026年11月9日</time> · 更新日 <time datetime="2026-11-20">2026年11月20日</time> · 文: もちぷよ</p>\n');
  assert.doesNotMatch(pageDateLine("ko", CONTENT_PUBLISHED), /고친 날/, "a page unchanged since it went up shows one date");
});

test("the weekly calendar is dated from its own first day in git, and shows one date while unchanged", () => {
  assert.equal(WEEKLY_PUBLISHED, "2026-11-16");
  const first = execFileSync("git", ["log", "--diff-filter=A", "--format=%cd", "--date=format-local:%Y-%m-%d", "--", "scripts/content-pages/weekly-text.mjs"], { encoding: "utf8", env: { ...process.env, TZ: "Asia/Seoul" } }).trim().split("\n").at(-1);
  // A shallow clone sees only its own tip, whose day says nothing about the file's first.
  if (execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "false") assert.equal(first, WEEKLY_PUBLISHED);
  assert.doesNotMatch(pageDateLine("ko", WEEKLY_PUBLISHED, dateLineOptions("weekly")), /고친 날/);
});

test("the byline is the studio's name in each language: no word studio, no person, no address", () => {
  for (const kind of CONTENT_KINDS) {
    for (const language of PAGE_LANGUAGES) {
      const line = lineOf(kind, language, "2026-11-20");
      assert.doesNotMatch(line, /studio|스튜디오|スタジオ/i, `${kind} ${language}`);
      for (const { name, email } of CREATORS) assert.ok(!line.includes(name) && !line.includes(email), `${kind} ${language}`);
      assert.equal(line.includes(STUDIO_NAMES[language]), kind !== "making", `${kind} ${language}: the making-of is signed at its foot`);
    }
  }
});

const SITE_KINDS = ["about", "faq", "contact"];
const siteLocs = SITE_KINDS.flatMap((kind) => PAGE_LANGUAGES.map((language) => ({ kind, language, loc: pagePath(kind, language) })));

test("the about, FAQ and contact pages show their dates, and the line stays out of their hash", () => {
  const file = recorded();
  const dated = renderSitePages();
  const bare = renderSitePages({ pageDates: null });
  const moved = renderSitePages({ pageDates: Object.fromEntries(siteLocs.map(({ loc }) => [loc, { date: "2031-02-03" }])) });
  const prints = pageFingerprints();
  for (const { kind, language, loc } of siteLocs) {
    const page = loc.slice(1);
    assert.ok(file[loc].date >= SITE_PUBLISHED, `${loc} did not change before it went up`);
    assert.ok(mainOf(dated[page]).includes(lineOf(kind, language, file[loc].date)), loc);
    assert.equal(moved[page].replace(lineOf(kind, language, "2031-02-03"), ""), bare[page], loc);
    assert.equal(prints[loc], file[loc].hash, `${loc} keeps its recorded hash`);
  }
});

test("the about page is not signed twice; the FAQ and contact pages carry the studio's name alone", () => {
  for (const { kind, language } of siteLocs) {
    const line = lineOf(kind, language, "2026-11-20");
    assert.equal(line.includes(STUDIO_NAMES[language]), kind !== "about", `${kind} ${language}`);
    for (const { name, email } of CREATORS) assert.ok(!line.includes(name) && !line.includes(email), `${kind} ${language}`);
  }
});

test("the about page's line heads its text, under the showcase", () => {
  for (const language of PAGE_LANGUAGES) {
    const main = mainOf(renderSitePages()[pagePath("about", language).slice(1)]);
    assert.ok(main.indexOf('class="sc-more"') < main.indexOf('<p class="effective">'), language);
  }
});

test("the privacy policy and the terms keep their effective date and gain no date line", () => {
  for (const [file, html] of Object.entries(renderLegalPages())) {
    assert.doesNotMatch(html, /<time /, file);
    assert.match(html, /<p class="effective">[^<]+<\/p>/, file);
  }
});

test("every dated page went up on its recorded day: a new case needs a day of its own", () => {
  assert.equal(CASE_PAGES.length, 55, "A case page was added after #478 (2026-11-09). Give it its own published day in scripts/content-pages/pages.mjs, then update this count.");
});
