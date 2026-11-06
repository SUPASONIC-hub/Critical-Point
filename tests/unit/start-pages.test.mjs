import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createStorage } from "./helpers/browser.mjs";

import { analyticsFor, withAnalyticsTags } from "../../scripts/analytics-config.mjs";
import { inlineScriptProblems } from "../../scripts/deploy-policy.mjs";
import { GAME_NAME, PAGE_KINDS, SHARE_IMAGE_ALT } from "../../scripts/legal-pages.mjs";
import { localizedStartPage, renderSitePages, renderStartPages, renderStaticPages, START_PAGE, withAbsoluteSiteLinks } from "../../scripts/site-pages.mjs";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";
import { chooseLanguage, folderLanguage, setPageTitle } from "../../src/locale.js";
import { strategyFor } from "../../src/serviceWorker/worker.js";

/**
 * The start page in three languages (SEO 점검 11-03, 높음 1·중간 1~4): `/` from
 * index.html, `/en/` and `/ja/` the built page with their words
 * (`localizedStartPage`, startPages() in vite.config.js). Read here as a
 * crawler reads them -- the head's tags and the no-script text, no script run.
 */
const ORIGIN = "https://critical-point-wn6p.onrender.com";
const INDEX = readFileSync("index.html", "utf8");
// What the build makes of index.html before it writes the two: its own links made absolute.
const built = withAbsoluteSiteLinks(INDEX, ORIGIN);
const pages = { ko: built, ...Object.fromEntries(Object.entries(renderStartPages(built, ORIGIN)).map(([file, html]) => [file.slice(0, 2), html])) };
const START = { ko: "/", en: "/en/", ja: "/ja/" };
const OG = { ko: "ko_KR", en: "en_US", ja: "ja_JP" };

const head = (html) => html.slice(0, html.indexOf("</head>"));
const metas = (html, key, name) =>
  [...head(html).matchAll(new RegExp(`<meta\\s+${key}="${name}"\\s+content="([^"]*)"`, "g"))].map((match) => match[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
const one = (html, key, name) => {
  const found = metas(html, key, name);
  assert.equal(found.length, 1, `one ${name}`);
  return found[0];
};
const noscript = (html) => /<body>[\s\S]*?(<noscript>\s*<div[\s\S]*?<\/noscript>)/.exec(html)?.[1] ?? "";

test("the build writes the start page in English and Japanese, and index.html is the Korean as the same function writes it", () => {
  assert.deepEqual(Object.keys(renderStartPages(built, ORIGIN)), ["en/index.html", "ja/index.html"]);
  assert.equal(localizedStartPage(INDEX, "ko"), INDEX, "index.html holds START_PAGE.ko and startNoscript('ko') byte for byte");
});

test("each start page has its language, title, description, cards and its own canonical", () => {
  for (const [language, html] of Object.entries(pages)) {
    const copy = START_PAGE[language];
    const url = `${ORIGIN}${START[language]}`;
    assert.match(html, new RegExp(`^<!doctype html>\\n<html lang="${language}">`), language);
    assert.equal(/<title>([^<]*)<\/title>/.exec(html)?.[1], copy.title, `${language} title`);
    assert.ok(copy.title.startsWith(GAME_NAME[language]), `${language}: the title starts with the game's name as the plain pages write it`);
    assert.equal(one(html, "name", "description"), copy.description, `${language} description`);
    assert.equal(one(html, "property", "og:description"), copy.description, `${language} og:description`);
    assert.equal(one(html, "name", "twitter:description"), copy.description, `${language} twitter:description`);
    assert.equal(one(html, "property", "og:title"), copy.title);
    assert.equal(one(html, "name", "twitter:title"), copy.title);
    assert.equal(one(html, "property", "og:site_name"), GAME_NAME[language]);
    assert.equal(one(html, "property", "og:locale"), OG[language]);
    assert.deepEqual(metas(html, "property", "og:locale:alternate"), Object.keys(OG).filter((code) => code !== language).map((code) => OG[code]));
    assert.equal(one(html, "property", "og:url"), url);
    assert.equal(one(html, "property", "og:image"), `${ORIGIN}/triggerlab-key-visual.jpg`);
    assert.equal(one(html, "name", "twitter:image"), `${ORIGIN}/triggerlab-key-visual.jpg`);
    assert.equal(one(html, "property", "og:image:alt"), SHARE_IMAGE_ALT[language]);
    assert.equal(one(html, "name", "twitter:image:alt"), SHARE_IMAGE_ALT[language]);
    assert.equal(one(html, "name", "twitter:card"), "summary_large_image");
    const canonical = [...head(html).matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(canonical, [url], `${language} names itself`);
    for (const [other, path] of Object.entries(START)) {
      assert.ok(head(html).includes(`<link rel="alternate" hreflang="${other}" href="${ORIGIN}${path}"`), `${language} names its ${other} page`);
    }
    assert.ok(head(html).includes(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/"`), `${language}: x-default is the Korean`);
    assert.doesNotMatch(html, /\?lang=/, `${language}: the folders, not the query`);
    assert.doesNotMatch(head(html), /프로토타입|prototype|プロトタイプ/i, `${language}: no "prototype"`);
    assert.deepEqual(inlineScriptProblems(html), [], language);
  }
  // Everything but the words is the Korean page's: the same scripts in the same order.
  const scripts = (html) => [...html.matchAll(/<script\b[^>]*>/g)].map((match) => match[0]);
  assert.deepEqual(scripts(pages.en), scripts(pages.ko));
  assert.deepEqual(scripts(pages.ja), scripts(pages.ko));
});

test("the Japanese start page alone drops the font preload; the Korean and the English keep it (11-05 measurement)", () => {
  // Measured 2026-11-05 (cp-archive 메모-20261105/ja-fcp): /ja/ first paints at 13.8 s with the
  // preload and 10.3 s without it on a throttled phone, so withoutFontPreload (site-pages.mjs)
  // takes the one tag out of /ja/ only. The @font-face and the service worker are untouched.
  const FONT_PRELOAD = /[ \t]*<link\s+rel="preload"\s+as="font"[^>]*>\r?\n?/;
  const fontPreloads = (html) => [...head(html).matchAll(new RegExp(FONT_PRELOAD.source, "g"))].map((match) => match[0]);
  assert.equal(fontPreloads(pages.ko).length, 1, "/ preloads the font");
  assert.equal(fontPreloads(pages.en).length, 1, "/en/ preloads the font");
  assert.deepEqual(fontPreloads(pages.ja), [], "/ja/ does not");
  assert.doesNotMatch(pages.ja, /pretendard-cp[^"]*\.woff2/, "/ja/ names the woff2 nowhere: the stylesheet fetches it");
  assert.match(pages.ja, /<!-- The one font file/, "the rest of the Korean head stays as it is");
  // The built page names the hashed file and keeps index.html's line breaks inside the tag.
  const builtForm = INDEX.replace("/src/assets/fonts/pretendard-cp.woff2", "/assets/pretendard-cp-CmzYrx-E.woff2");
  assert.ok(builtForm.includes("pretendard-cp-CmzYrx-E.woff2"), "the source names the font once");
  assert.deepEqual(fontPreloads(localizedStartPage(builtForm, "ja")), []);
  assert.equal(fontPreloads(localizedStartPage(builtForm, "en")).length, 1);
  // The tag gone from index.html fails the Japanese page instead of passing silently; the English page does not look for it.
  assert.throws(() => localizedStartPage(INDEX.replace(FONT_PRELOAD, ""), "ja"), /0 font preload tags/);
  assert.doesNotThrow(() => localizedStartPage(INDEX.replace(FONT_PRELOAD, ""), "en"));
  // Everything else is the Korean page's: the Japanese page is the English one with its words, less that one tag.
  assert.equal(pages.ja.split("\n").length, pages.en.replace(FONT_PRELOAD, "").split("\n").length, "the same lines once the tag is gone from both");
});

test("the description is the about page's own sentences, and the no-script intro its first two", () => {
  const about = renderSitePages();
  const folder = { ko: "", en: "en/", ja: "ja/" };
  const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ");
  for (const [language, copy] of Object.entries(START_PAGE)) {
    const page = about[`${folder[language]}about.html`];
    const description = metas(page, "name", "description")[0];
    const [first, second] = copy.description.split(/(?<=[.。]|니다\.)\s*/).filter(Boolean);
    assert.ok(description.startsWith(first), `${language}: the about page's description begins with the start page's first sentence`);
    assert.ok(text(page).includes(second), `${language}: the second sentence is the about page's`);
    for (const sentence of copy.intro) assert.ok(text(page).includes(sentence), `${language}: "${sentence}" is the about page's`);
  }
  assert.equal(SHARE_IMAGE_ALT.en, enIntro.heroAlt);
  assert.equal(SHARE_IMAGE_ALT.ja, jaIntro.heroAlt);
  assert.match(readFileSync("src/copy/intro.js", "utf8"), new RegExp(`heroAlt: "${SHARE_IMAGE_ALT.ko}"`));
});

test("with no script, each start page says what the game is and links the five plain pages in its language", () => {
  for (const [language, html] of Object.entries(pages)) {
    const block = noscript(html);
    assert.ok(block, `${language} has its no-script block`);
    assert.ok(block.includes(`>${GAME_NAME[language]}</h1>`), `${language}: a heading with the game's name`);
    for (const sentence of START_PAGE[language].intro) assert.ok(block.replace(/&quot;/g, '"').includes(sentence), `${language}: ${sentence}`);
    const links = [...block.matchAll(/<a href="(\/[^"]*)"/g)].map((match) => match[1]);
    const folder = language === "ko" ? "" : `/${language}`;
    assert.deepEqual(links, PAGE_KINDS.map((kind) => `${folder}/${kind}.html`), `${language}: the five pages, in the header's order`);
    for (const link of links) assert.ok(renderStaticPages()[link.slice(1)], `${link} is written`);
    assert.equal((html.match(/<noscript>\s*<div\b/g) ?? []).length, 1, `${language}: one block`);
  }
  assert.match(noscript(pages.en), /Turn JavaScript on/);
  assert.match(noscript(pages.ja), /JavaScriptをオンに/);
});

test("with Google Analytics on (11-12), the two pages carry its tag once, as the Korean does", () => {
  const on = analyticsFor({ id: "G-CN8M5TQ77N", command: "build", mode: "production", debug: false });
  const tagged = withAbsoluteSiteLinks(withAnalyticsTags(INDEX, on), ORIGIN);
  for (const [file, html] of Object.entries({ "index.html": tagged, ...renderStartPages(tagged, ORIGIN) })) {
    assert.equal((html.match(/googletagmanager\.com\/gtag\/js\?id=G-CN8M5TQ77N/g) ?? []).length, 1, file);
    assert.equal((html.match(new RegExp(`<script src="${on.path}" defer></script>`, "g")) ?? []).length, 1, file);
    assert.deepEqual(inlineScriptProblems(html), [], file);
  }
  for (const html of Object.values(renderStartPages(built, ORIGIN))) assert.doesNotMatch(html, /googletagmanager|gtag/, "off, none");
});

test("the plain pages carry a card too: title, description, own address and the key visual", () => {
  for (const [file, html] of Object.entries(renderStaticPages(ORIGIN))) {
    const language = /^(en|ja)\//.exec(file)?.[1] ?? "ko";
    const title = /<title>([^<]*)<\/title>/.exec(html)[1].replace(/&amp;/g, "&");
    const description = metas(html, "name", "description")[0];
    assert.ok(description.length >= 40, `${file}: a description that says what is on the page`);
    assert.equal(one(html, "property", "og:title"), title, file);
    assert.equal(one(html, "name", "twitter:title"), title, file);
    assert.equal(one(html, "property", "og:description"), description, file);
    assert.equal(one(html, "name", "twitter:description"), description, file);
    assert.equal(one(html, "property", "og:url"), `${ORIGIN}/${file}`, file);
    assert.equal(one(html, "property", "og:image"), `${ORIGIN}/triggerlab-key-visual.jpg`, file);
    assert.equal(one(html, "name", "twitter:image"), `${ORIGIN}/triggerlab-key-visual.jpg`, file);
    assert.equal(one(html, "property", "og:locale"), OG[language], file);
    assert.equal(one(html, "property", "og:site_name"), GAME_NAME[language], file);
    assert.equal(one(html, "name", "twitter:card"), "summary_large_image", file);
  }
});

test("the game opens in a start page's folder language, and the service worker answers the folders as the page", () => {
  assert.equal(folderLanguage("/en/"), "en");
  assert.equal(folderLanguage("/ja/index.html"), "ja");
  for (const other of ["/", "/index.html", "/ko/", "/fr/", "/en", "/en/about.html", "/en/x/"]) assert.equal(folderLanguage(other), null, other);
  const origin = "https://example.test";
  for (const path of ["/", "/index.html", "/en/", "/ja/", "/en/index.html", "/ja/index.html"]) {
    assert.equal(strategyFor({ method: "GET", url: `${origin}${path}?x=1`, mode: "navigate" }, origin), "shell", path);
  }
  assert.equal(strategyFor({ method: "GET", url: `${origin}/fr/`, mode: "navigate" }, origin), "none");
  const locale = readFileSync("src/locale.js", "utf8");
  assert.match(locale, /if \(CODES\.includes\(stored\)\) return stored;\s*const folder = folderLanguage\(globalThis\.location\?\.pathname\);\s*if \(folder\) return folder;/, "a choice kept on the device first, then the folder, then ?lang=");
});

test("a language chosen on a start page's folder opens that language's own start page, and the address drops ?lang=", () => {
  const before = { location: globalThis.location, localStorage: globalThis.localStorage };
  globalThis.localStorage = createStorage();
  const opened = [];
  const at = (href) => ({ href, assign: (to) => opened.push(to) });
  try {
    for (const [from, code, to] of [
      ["https://example.test/en/?lang=ja", "ja", "https://example.test/ja/"],
      ["https://example.test/ja/index.html", "en", "https://example.test/en/"],
      ["https://example.test/en/", "ko", null], // the page is Korean already (LANG), so nothing to open
      ["https://example.test/?x=1", "ja", "https://example.test/?x=1&lang=ja"],
    ]) {
      opened.length = 0;
      globalThis.location = at(from);
      chooseLanguage(code);
      assert.deepEqual(opened, to ? [to] : [], `${from} -> ${code}`);
    }
    opened.length = 0;
    globalThis.location = at("https://example.test/en/");
    chooseLanguage("fr");
    assert.deepEqual(opened, [], "a language the game does not have changes nothing");
  } finally {
    globalThis.location = before.location;
    globalThis.localStorage = before.localStorage;
  }
});

test("the tab's title in each language is the start screen's pageTitle, one string for the page and the game", () => {
  // The start pages' <title> is read from the intro copy, so the two cannot drift apart (2026-11-04: /?lang=en kept index.html's Korean title on the tab).
  const titles = { ko: introCopy.pageTitle, en: enIntro.pageTitle, ja: jaIntro.pageTitle };
  for (const [language, title] of Object.entries(titles)) {
    assert.equal(START_PAGE[language].title, title, `${language}: START_PAGE reads the intro's pageTitle`);
    assert.equal(/<title>([^<]*)<\/title>/.exec(language === "ko" ? INDEX : renderStartPages(INDEX)[`${language}/index.html`])?.[1], title, `${language}: the page's <title>`);
  }
  for (const language of ["en", "ja"]) assert.doesNotMatch(titles[language], /[\uAC00-\uD7A3\u3131-\u318E]/, `${language}: no Hangul on the tab`);
  // The overlay hands the title to src/locale.js from the dictionary's intro.
  const overlay = readFileSync("src/locales/overlay.js", "utf8");
  assert.match(overlay, /dictionary\?\.copy\?\.screens\?\.intro\?\.pageTitle/);
  assert.match(readFileSync("src/locale.js", "utf8"), /setPageTitle\(module\);/);
});

test("setPageTitle puts the dictionary's title on the tab, and leaves the tab alone without one", () => {
  const doc = { title: introCopy.pageTitle };
  assert.equal(setPageTitle({ pageTitle: () => enIntro.pageTitle }, doc), enIntro.pageTitle);
  assert.equal(doc.title, enIntro.pageTitle);
  assert.equal(setPageTitle(null, doc), null, "no dictionary");
  assert.equal(setPageTitle({ pageTitle: () => null }, doc), null, "a dictionary with no title");
  assert.equal(doc.title, enIntro.pageTitle, "the title stays as it was");
});
