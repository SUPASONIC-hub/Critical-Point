import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { GAME_TITLE } from "../../src/appCopy.js";
import { wordmarkLogoMarkup } from "../../src/components/wordmarkLogo.js";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";
import { getArtSources, PHONE_ART_MEDIA } from "../../src/responsiveArt.js";
import { renderStartPages } from "../../scripts/site-pages.mjs";
import { renderStaticPages } from "../../scripts/site-pages.mjs";
import { READING_KINDS } from "../../src/homeReading.js";
import { HERO_ART, localizeStaticShell, rootMarkup, STATIC_SHELL_ATTRIBUTE, staticReadingMarkup, staticShellMarkup, withStaticShell } from "../../scripts/static-shell.mjs";
import { frontPageFor } from "../../src/news/newsIndex.js";
import { notesDay } from "../../scripts/content-pages/notes.mjs";
import { NOTES, notePath } from "../../src/notes/noteIndex.js";

// One day for the whole file: a run crossing midnight in Seoul on a note's day would otherwise compare two different sets of pages.
process.env.CP_NOTES_DAY ||= notesDay();

const INDEX = readFileSync("index.html", "utf8");
const shelled = withStaticShell(INDEX);
const pages = { "index.html": shelled, ...renderStartPages(shelled) };
const shellCount = (html) => html.split(STATIC_SHELL_ATTRIBUTE).length - 1;
/** What a reader would see: the text between the tags, and the attribute values a browser shows (alt, title, data-text). */
const textOf = (markup) => markup.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean);
const COPY = { ko: introCopy, en: enIntro, ja: jaIntro };
const LANGUAGE_OF = { "index.html": "ko", "en/index.html": "en", "ja/index.html": "ja" };
const HIDDEN_ELEMENT = /<(\w+)\b[^>]*style="visibility:hidden"[^>]*>[\s\S]*?<\/\1>/g;
/** The markup a reader sees: every `visibility: hidden` element and the page style taken out. */
const shown = (markup) => markup.replace(HIDDEN_ELEMENT, "").replace(/<style>[^<]*<\/style>/, "");
const shellOf = (html) => html.slice(html.indexOf('<div id="root">') + '<div id="root">'.length, html.indexOf("</main>") + "</main>".length);
/** What #root holds before the script: the shell and 읽을거리 under it. */
const rootOf = (html) => html.slice(html.indexOf('<div id="root">') + '<div id="root">'.length, html.indexOf("</section></div>") + "</section>".length);
const shownAttributes = (markup) => [...markup.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/g)].map((match) => match[1]);

test("the build puts one shell inside #root on /, /en/ and /ja/, and nothing else moves", () => {
  assert.deepEqual(Object.keys(pages).sort(), ["en/index.html", "index.html", "ja/index.html"]);
  for (const [file, html] of Object.entries(pages)) {
    assert.equal(shellCount(html), 1, file);
    assert.match(html, new RegExp(`<div id="root"><main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE} inert aria-hidden="true">`), file);
    assert.ok(html.indexOf(STATIC_SHELL_ATTRIBUTE) < html.indexOf("<noscript>"), `${file}: the shell stands before the no-script text`);
  }
  // Each start page carries its own language's shell; Korean is the default.
  for (const [file, html] of Object.entries(pages)) {
    assert.equal(shellOf(html), staticShellMarkup({ language: LANGUAGE_OF[file] }), file);
    assert.equal(rootOf(html), rootMarkup({ language: LANGUAGE_OF[file] }), file);
  }
  assert.equal(staticShellMarkup(), staticShellMarkup({ language: "ko" }));
  // Everything around #root is the page as it was.
  assert.equal(shelled.replace(rootMarkup(), ""), INDEX);
  assert.equal(localizeStaticShell(INDEX, "en"), INDEX, "a page without a shell is left as it is");
});

test("the shell lays out the intro's words in the page's language and shows none of them", () => {
  for (const [language, copy] of Object.entries(COPY)) {
    const markup = staticShellMarkup({ language });
    const hidden = [...markup.matchAll(HIDDEN_ELEMENT)].map((match) => match[0]);
    // The header pills, the tagline, the kicker and the premise, in the order IntroScreen.jsx renders them.
    assert.equal(hidden.length, 4, language);
    assert.ok(hidden[0].includes(`>${copy.ranking}</button>`) && hidden[0].includes(`>${copy.board}</button>`), `${language}: the pills`);
    assert.ok(hidden[1].startsWith('<p class="wordmark-sub" lang="en"'), `${language}: the tagline`);
    // The title is the drawn logo GameWordmark.jsx draws, its words in the heading as text.
    assert.ok(markup.includes(`<h1 class="game-wordmark"><span class="sr-only">${GAME_TITLE}</span>${wordmarkLogoMarkup()}`), `${language}: the logo`);
    assert.ok(hidden[2].includes(copy.subtitle.replace(/&/g, "&amp;")), `${language}: the kicker`);
    assert.ok(hidden[3].includes(copy.premise.replace(/&/g, "&amp;")), `${language}: the premise`);
    // The floor that keeps the column longer than the stage, as the intro's is.
    assert.match(markup, /<div style="height:100svh"><\/div><\/div><\/div><\/section><\/main>$/, language);
    // No link hides in it any more: the site's pages are in 읽을거리, shown, under it.
    assert.doesNotMatch(markup, /<a\b|<nav\b/, language);
  }
  // Japanese carries its dictionary's face and line breaks, as the intro it stands for has them.
  assert.ok(staticShellMarkup({ language: "ja" }).includes('<style>:root:lang(ja){--font-sans:"Hiragino Sans"'));
  assert.ok(!staticShellMarkup({ language: "en" }).includes("<style>") && !staticShellMarkup().includes("<style>"));
  // What shows is the same frame in every language but the reading under the name
  // (and its hanja, which a reading already in Han characters goes without).
  const frames = Object.entries(COPY).map(([language, copy]) => shown(staticShellMarkup({ language })).replace(copy.titleReading, "READING").replace("<i>臨界點</i>", ""));
  assert.equal(new Set(frames).size, 1);
});

test("the shell shows no sentence: only the game's name, its reading and hanja, and an unlabeled start button", () => {
  for (const [language, copy] of Object.entries(COPY)) {
    const markup = shown(staticShellMarkup({ language }));
    const words = textOf(markup);
    const allowed = new Set([...GAME_TITLE.split(" "), ...copy.titleReading.split(" "), "臨界點"]);
    for (const word of words) assert.ok(allowed.has(word), `${language}: "${word}" is not the game's name`);
    // Hangul only in the Korean reading; the Japanese reading is the title in kanji, 臨界点, with no 臨界點 beside it.
    assert.deepEqual(words.filter((word) => /[가-힣]/.test(word)), language === "ko" ? [copy.titleReading] : [], language);
    assert.deepEqual(words.filter((word) => /\p{Script=Han}/u.test(word)), language === "ja" ? [copy.titleReading] : ["臨界點"], language);
    assert.deepEqual(shownAttributes(markup), [""], "the picture's alt is empty: the shell is hidden from assistive tech");
    assert.match(markup, /<div class="start-input-row intro-launch"><button type="button" tabindex="-1"><\/button><\/div>/, "the start button has no label");
  }
});

test("the shell's picture is the intro's, so the browser paints the file index.html preloaded", () => {
  const art = getArtSources(HERO_ART);
  const markup = staticShellMarkup();
  assert.ok(markup.includes(`<source media="${PHONE_ART_MEDIA}" srcset="${art.phone}" type="image/webp">`));
  assert.ok(markup.includes(`<source srcset="${art.wide}" sizes="${art.wideSizes}" type="image/webp">`));
  const intro = readFileSync("src/screens/IntroScreen.jsx", "utf8");
  assert.match(intro, /getArtSources\("\/triggerlab-key-visual\.webp"\)/, "IntroScreen draws the same art");
  assert.match(intro, /src="\/triggerlab-key-visual\.jpg"[\s\S]{0,80}width="1672"[\s\S]{0,40}height="941"/, "with the same fallback and size");
  for (const [media, srcset] of [[PHONE_ART_MEDIA, art.phone], [`not all and ${PHONE_ART_MEDIA}`, art.wide]]) {
    assert.ok(INDEX.includes(`imagesrcset="${srcset}"`) && INDEX.includes(`media="${media}"`), `index.html preloads ${srcset}`);
  }
});

test("the shell uses the intro's own classes, the ones the critical CSS carries", () => {
  const critical = readFileSync("src/styles/critical.generated.css", "utf8");
  const classes = new Set([...staticShellMarkup().matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(" ")));
  // IntroScreen.jsx's own hook for its header pills: no rule styles it, `.intro .top-actions .ghost` does.
  classes.delete("intro-ranking-button");
  for (const name of classes) assert.ok(critical.includes(`.${name}`), `.${name} is in the critical CSS`);
  assert.ok(critical.includes(".intro-launch button{"), "the unlabeled button takes the start button's height");
});

test("a page without exactly one empty #root is refused, not shelled twice or nowhere", () => {
  assert.throws(() => withStaticShell("<body></body>"), /exactly one empty/);
  assert.throws(() => withStaticShell(shelled), /exactly one empty/);
});

test("under the shell, 읽을거리 shows what the game is and every kind of page, in the page's language, with nothing hidden", () => {
  const written = new Set(Object.keys(renderStaticPages("", { day: "2026-11-27" })).map((file) => `/${file}`));
  for (const [language, copy] of Object.entries(COPY)) {
    const markup = staticReadingMarkup({ language, day: "2026-11-27" });
    assert.ok(markup.startsWith('<section class="home-reading" data-static-reading'), language);
    assert.equal(markup.match(/<section\b/g).length, 1, `${language}: no section inside it, which is how localizeStaticShell finds its end`);
    assert.doesNotMatch(markup, /visibility|hidden|tabindex|inert|aria-hidden|undefined/, `${language}: shown, and reachable by keyboard`);
    for (const line of copy.reading.intro) assert.ok(markup.includes(line.replace(/&/g, "&amp;")), `${language}: ${line.slice(0, 20)}`);
    assert.equal(markup.match(/<li data-kind=/g).length, READING_KINDS.length, `${language}: nine kinds of page`);
    for (const [, href] of markup.matchAll(/href="([^"]+)"/g)) assert.ok(written.has(href), `${language}: ${href} is a page the build writes`);
    // 오늘의 1면 of 11-27 (its date inside the world), then the three newest notes out by 11-27, newest first. Since
    // 2026-11-25 (the owner's 「2」) ready notes go out at once, so several share a day: among them the later in NOTES
    // shows first, the same order on every build.
    const front = frontPageFor("2026-11-27");
    const out = NOTES.map((note, at) => ({ ...note, at })).filter((note) => note.published <= "2026-11-27");
    const newest = out.sort((a, b) => b.published.localeCompare(a.published) || b.at - a.at).slice(0, 3);
    assert.deepEqual([...markup.matchAll(/<time datetime="([^"]+)">/g)].map((match) => match[1]), [front.day, ...newest.map((note) => note.published)], language);
    const notesHtml = markup.slice(markup.indexOf('class="home-reading-notes"'));
    assert.deepEqual([...notesHtml.matchAll(/<li><a href="([^"]+)">/g)].map((match) => match[1]), newest.map((note) => notePath(note.slug)), language);
    assert.ok(markup.includes(`<a href="${front.href}">`) && markup.includes(`<p class="home-reading-fiction">${copy.reading.frontNote}</p>`), `${language}: the day's article, said to be made up`);
  }
  // Before the first note, the section says one is coming and still links the list.
  const early = staticReadingMarkup({ day: "2026-11-20" });
  assert.ok(early.includes(`<p>${introCopy.reading.notesEmpty}</p>`) && early.includes('href="/notes/index.html"'));
  // The start pages carry it in their own language, once.
  for (const [file, html] of Object.entries(pages)) {
    assert.equal(html.split("data-static-reading").length - 1, 1, file);
    assert.ok(html.includes(`<h2 id="home-reading-title">${COPY[LANGUAGE_OF[file]].reading.title}</h2>`), file);
  }
});
