import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { PAGE_KINDS } from "../../scripts/legal-pages.mjs";
import { CONTENT_KINDS } from "../../scripts/content-pages/pages.mjs";
import {
  crawlerFiles,
  readableCharacters,
  renderSitePages,
  renderStaticPages,
  robotsTxt,
  siteOrigin,
  sitemapEntries,
  sitemapXml,
  withAbsoluteSiteLinks,
} from "../../scripts/site-pages.mjs";
import { SUPPORT_CONTACT } from "../../src/appConfig.js";
import { CASE_SEQUENCE, TYPICAL_CASE_MINUTES } from "../../src/gameCases.js";
import { DATA_RETENTION_DAYS, legalPagePath, SITE_PAGES } from "../../src/privacyText.js";
import { DOCUMENT_PAGE } from "../../src/serviceWorker/worker.js";

/**
 * The about, FAQ and contact pages (scripts/site-pages.mjs), the policy's six
 * beside them, and the crawler's two files: the site's text for a search
 * engine and an AdSense review, readable with no script.
 */
const ORIGIN = "https://critical-point-wn6p.onrender.com";
const site = renderSitePages();
const all = renderStaticPages();
const FOLDER = { ko: "", en: "en/", ja: "ja/" };
const decode = (html) => html.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const nav = (html) => /<nav\b[^>]*>([\s\S]*?)<\/nav>/.exec(html)?.[1] ?? "";

test("the build writes nine pages about the game: three kinds in three languages", () => {
  assert.deepEqual(Object.keys(site).sort(), [
    "about.html",
    "contact.html",
    "en/about.html",
    "en/contact.html",
    "en/faq.html",
    "ja/about.html",
    "ja/contact.html",
    "ja/faq.html",
    "faq.html",
  ].sort());
  assert.equal(Object.keys(all).length, 15 + CONTENT_KINDS.length * 3, "with the policy's six and the content pages (scripts/content-pages)");
  assert.deepEqual(PAGE_KINDS, SITE_PAGES, "the pages' headers and the start screen's foot list the same pages");
});

test("each page has its own title and description, a canonical link and every language as an alternate", () => {
  const descriptions = new Set();
  const titles = new Set();
  for (const [file, html] of Object.entries(all)) {
    const language = /^(en|ja)\//.exec(file)?.[1] ?? "ko";
    const page = file.slice(FOLDER[language].length);
    assert.match(html, /^<!doctype html>/, file);
    assert.match(html, new RegExp(`<html lang="${language}">`), file);
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
    assert.ok(title && !titles.has(title), `${file} has a title of its own`);
    titles.add(title);
    const description = /<meta name="description" content="([^"]+)" \/>/.exec(html)?.[1];
    assert.ok(description, `${file} has a description`);
    if (site[file]) {
      assert.ok(!descriptions.has(description), `${file}'s description is its own`);
      assert.ok(description.length >= 40, `${file}'s description says what is on the page`);
      descriptions.add(description);
    }
    assert.ok(html.includes(`<link rel="canonical" href="/${FOLDER[language]}${page}" />`), `${file} names itself`);
    for (const [other, folder] of Object.entries(FOLDER)) {
      assert.ok(html.includes(`<link rel="alternate" hreflang="${other}" href="/${folder}${page}" />`), `${file} names its ${other} version`);
      if (other !== language) {
        assert.ok(nav(html).includes(`<a href="/${folder}${page}" hreflang="${other}" lang="${other}">`), `${file} links its ${other} version`);
      }
    }
    assert.ok(html.includes(`<link rel="alternate" hreflang="x-default" href="/${page}" />`), `${file}: x-default is the Korean`);
    assert.doesNotMatch(html, /<script\b/i, `${file}: the CSP gives scripts 'self' only, and a plain page needs none`);
    assert.ok(html.includes(`mailto:${SUPPORT_CONTACT}`), `${file} gives the contact address`);
  }
});

test("every page links the game and the other four pages in its own language, and every link lands on a page that is written", () => {
  const written = new Set(Object.keys(all).map((file) => `/${file}`));
  const game = { ko: "/", en: "/en/", ja: "/ja/" };
  for (const [file, html] of Object.entries(all)) {
    const language = /^(en|ja)\//.exec(file)?.[1] ?? "ko";
    const links = nav(html);
    assert.ok(links.includes(`<a href="${game[language]}">`), `${file} leads back to the game in its language`);
    for (const kind of PAGE_KINDS) {
      assert.ok(links.includes(`href="/${FOLDER[language]}${kind}.html"`), `${file} links ${kind} in ${language}`);
    }
    // A page marks itself; a case's page marks the case files, the section it is in.
    assert.equal((links.match(/aria-current="(?:page|true)"/g) ?? []).length, 1, `${file} marks itself`);
    for (const [, href] of decode(html).matchAll(/<a href="([^"]+)"/g)) {
      if (href.startsWith("mailto:")) continue;
      if (/^\/((en|ja)\/)?$/.test(href)) continue;
      assert.ok(written.has(href), `${file} links ${href}, which the build does not write`);
    }
  }
});

test("each Korean page is at least 1,500 characters without spaces, and the translations are whole", () => {
  for (const kind of ["about", "faq", "contact"]) {
    const ko = readableCharacters(site[`${kind}.html`]);
    assert.ok(ko >= 1500, `${kind}.html has ${ko} characters without spaces`);
    // English spells out what Korean packs in a syllable; Japanese runs close to Korean.
    assert.ok(readableCharacters(site[`en/${kind}.html`]) > ko * 1.5, `en/${kind}.html is the whole page`);
    assert.ok(readableCharacters(site[`ja/${kind}.html`]) > ko * 0.9, `ja/${kind}.html is the whole page`);
    // The same sections in each language.
    const sections = (html) => (html.match(/<h[23]>/g) ?? []).length;
    assert.equal(sections(site[`en/${kind}.html`]), sections(site[`${kind}.html`]), `en/${kind}.html has every section`);
    assert.equal(sections(site[`ja/${kind}.html`]), sections(site[`${kind}.html`]), `ja/${kind}.html has every section`);
  }
  for (const [file, html] of Object.entries(site)) {
    assert.doesNotMatch(html.replace(/<style>[\s\S]*?<\/style>/, ""), /[{}]|\$\{|undefined|NaN/, `${file}: no placeholder left`);
    if (!file.startsWith("ja/") && !file.startsWith("en/")) continue;
    // Korean only where a page names the Korean page, or quotes the language choice as the screen shows it.
    const left = html.replace(' lang="ko">한국어</a>', "").replace("한국어 · English · 日本語", "");
    assert.doesNotMatch(left, /[가-힣]/, `${file}: no Korean left untranslated`);
  }
  assert.ok(site["ja/faq.html"].includes("body{word-break:normal}"), "Japanese wraps between characters");
});

test("the pages say what the code holds: the season's length, a case's minutes, the retention and the address", () => {
  const cases = String(CASE_SEQUENCE.length);
  for (const language of ["ko", "en", "ja"]) {
    const about = decode(site[`${FOLDER[language]}about.html`]);
    const faq = decode(site[`${FOLDER[language]}faq.html`]);
    const contact = decode(site[`${FOLDER[language]}contact.html`]);
    assert.ok(about.includes(cases) && faq.includes(cases), `${language}: ${cases} cases`);
    assert.ok(about.includes(String(CASE_SEQUENCE.length - 5)), `${language}: five of them are the prologue`);
    assert.ok(faq.includes(String(TYPICAL_CASE_MINUTES)), `${language}: a case's minutes`);
    assert.ok(faq.includes(String(DATA_RETENTION_DAYS)) && contact.includes(String(DATA_RETENTION_DAYS)), `${language}: the retention`);
    assert.ok(faq.includes("45"), `${language}: the table's 45 seconds`);
    assert.ok(faq.includes("XXXX-XXXX-XXXX"), `${language}: the continue code's shape`);
    assert.ok(faq.includes('<a href="/en/">/en/</a>') && faq.includes('<a href="/ja/">/ja/</a>'), `${language}: the address of each language`);
  }
  assert.equal(CASE_SEQUENCE[0], "prologue01", "the season opens with the prologue");
  assert.match(decode(site["about.html"]), /허구이며 실제와 관계가 없습니다/);
  assert.match(decode(site["faq.html"]), /지금은 광고와 유료 결제가 없습니다/);
  assert.match(decode(site["contact.html"]), /10일 안에 결과를 알려 드립니다/);
});

test("the start screen's foot links the five pages in the screen's language", () => {
  const intro = readFileSync("src/screens/IntroScreen.jsx", "utf8");
  assert.match(intro, /SITE_PAGES\.map\(\(page\) => \(\s*<a key=\{page\} href=\{legalPagePath\(`\/\$\{page\}\.html`, LANG\)\}>\{introCopy\.legal\[page\]\}<\/a>/);
  for (const page of SITE_PAGES) {
    for (const language of ["ko", "en", "ja"]) assert.ok(all[legalPagePath(`/${page}.html`, language).slice(1)], `${page} in ${language} is written`);
  }
  // Each language names the five links.
  const copies = [readFileSync("src/copy/intro.js", "utf8"), readFileSync("src/locales/en/screens/intro.js", "utf8"), readFileSync("src/locales/ja/screens/intro.js", "utf8")];
  for (const source of copies) {
    const legal = /legal: \{([\s\S]*?)\}/.exec(source)?.[1] ?? "";
    for (const page of SITE_PAGES) assert.match(legal, new RegExp(`\\b${page}: "`), `${page} is named`);
  }
});

test("the service worker keeps every page for offline reading, and leaves the crawler's files alone", () => {
  for (const file of Object.keys(all)) assert.match(`/${file}`, DOCUMENT_PAGE, file);
  assert.doesNotMatch("/robots.txt", DOCUMENT_PAGE);
  assert.doesNotMatch("/sitemap.xml", DOCUMENT_PAGE);
});

test("the sitemap names the start page in three languages and every plain page, by absolute address, with each one's languages", () => {
  const entries = sitemapEntries();
  const count = 3 + Object.keys(all).length;
  assert.equal(entries.length, count);
  const start = { ko: "/", en: "/en/", ja: "/ja/" };
  assert.deepEqual(entries.slice(0, 3), Object.values(start).map((loc) => ({ loc, alternates: start })));
  assert.deepEqual(entries.slice(3).map((entry) => entry.loc.slice(1)).sort(), Object.keys(all).sort());
  const xml = sitemapXml({ origin: ORIGIN, date: "2026-10-29" });
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9" xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml">/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(locs.length, count);
  assert.ok(locs.every((loc) => loc.startsWith(`${ORIGIN}/`)), "every address is absolute");
  for (const file of Object.keys(all)) assert.ok(locs.includes(`${ORIGIN}/${file}`), `${file} is in the sitemap`);
  assert.equal((xml.match(/<lastmod>2026-10-29<\/lastmod>/g) ?? []).length, count);
  for (const path of ["/", "/en/", "/ja/"]) assert.ok(locs.includes(`${ORIGIN}${path}`), `${path} is in the sitemap`);
  assert.ok(xml.includes(`<xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/"/>`));
  assert.doesNotMatch(xml, /\?lang=/, "the start page by its folders, not the query a crawler reads as the Korean page");
  assert.ok(xml.includes(`<xhtml:link rel="alternate" hreflang="ja" href="${ORIGIN}/ja/faq.html"/>`));
  assert.ok(!/href="\//.test(xml), "no relative alternate");
  assert.throws(() => sitemapXml({ origin: ORIGIN, date: "29.10.2026" }), /YYYY-MM-DD/);
  // A build with no origin (local, CI) keeps the addresses relative, as every other address of it is.
  assert.match(sitemapXml({ date: "2026-10-29" }), /<loc>\/about\.html<\/loc>/);
});

test("robots.txt lets everything be crawled and names the sitemap when the build has an origin", () => {
  assert.equal(robotsTxt(ORIGIN), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  assert.equal(robotsTxt(""), "User-agent: *\nAllow: /\n");
  assert.deepEqual(Object.keys(crawlerFiles({ origin: ORIGIN, date: "2026-10-29" })).sort(), ["robots.txt", "sitemap.xml"]);
});

test("the origin is SITE_URL, else RENDER_EXTERNAL_URL, and only an https one; the pages' links are made absolute on it", () => {
  assert.equal(siteOrigin({}), "");
  assert.equal(siteOrigin({ RENDER_EXTERNAL_URL: `${ORIGIN}/` }), ORIGIN);
  assert.equal(siteOrigin({ SITE_URL: "https://example.com", RENDER_EXTERNAL_URL: ORIGIN }), "https://example.com");
  assert.throws(() => siteOrigin({ SITE_URL: "http://example.com" }), /https origin/);
  const absolute = renderStaticPages(ORIGIN)["en/faq.html"];
  assert.ok(absolute.includes(`<link rel="canonical" href="${ORIGIN}/en/faq.html" />`));
  assert.ok(absolute.includes(`<link rel="alternate" hreflang="ja" href="${ORIGIN}/ja/faq.html" />`));
  assert.ok(absolute.includes('<a href="/en/about.html">'), "the links a reader clicks stay relative");
  assert.equal(withAbsoluteSiteLinks("<link rel=\"canonical\" href=\"/\" />", ""), "<link rel=\"canonical\" href=\"/\" />");
});

test("the about page says the rules as the code holds them: the combo's two sides, SILENCE, the rules the main story adds, and every axis of the score", async () => {
  const { SILENCE_SECONDS } = await import("../../src/gauntlet/tableRules.js");
  const { LOGIC_DIRECTIONS } = await import("../../src/gauntlet/logicStreak.js");
  const report = {
    ko: (await import("../../src/copy/reportLines.js")).default.score,
    en: (await import("../../src/locales/en/screens/reportLines.js")).default.score,
    ja: (await import("../../src/locales/ja/screens/reportLines.js")).default.score,
  };
  assert.deepEqual([...LOGIC_DIRECTIONS], ["people", "position"], "the combo is held on a side, people or position");
  const SIDES = { ko: ["사람 쪽", "자리 쪽"], en: ["toward the people", "toward the position"], ja: ["人の側", "立場の側"] };
  const SECONDS = { ko: `${SILENCE_SECONDS}초`, en: `${SILENCE_SECONDS} seconds`, ja: `${SILENCE_SECONDS}秒` };
  const MAIN_RULES = { ko: ["사건 01에 OVERCLOCK", "사건 02에 감사(AUDIT)", "사건 03에 연결(CASCADE)"], en: ["OVERCLOCK in Case 01", "AUDIT in Case 02", "CASCADE in Case 03"], ja: ["事件01でOVERCLOCK", "事件02で監査(AUDIT)", "事件03で連結(CASCADE)"] };
  for (const language of ["ko", "en", "ja"]) {
    const about = decode(site[`${FOLDER[language]}about.html`]);
    for (const side of SIDES[language]) assert.ok(about.includes(side), `${language}: the combo's side, ${side}`);
    assert.ok(about.includes("(SILENCE)") && about.includes(SECONDS[language]), `${language}: SILENCE and its ${SILENCE_SECONDS} seconds`);
    for (const rule of MAIN_RULES[language]) assert.ok(about.includes(rule), `${language}: ${rule}`);
    assert.doesNotMatch(about, /사건 01부터 모두 켜집니다|from Case 01 on they are all in play|事件01からはすべてオンになります/, `${language}: not every rule from Case 01`);
    for (const axis of ["consistency", "reading", "cognition", "reflection", "pressureAdapt", "rhythm"]) {
      assert.ok(about.includes(`(${report[language][axis].label}`), `${language}: the score's ${axis} axis by the report's own label, ${report[language][axis].label}`);
    }
  }
});
