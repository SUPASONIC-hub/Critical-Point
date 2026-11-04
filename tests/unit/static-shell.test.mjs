import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { GAME_TITLE, GAME_TITLE_READING } from "../../src/appCopy.js";
import { getArtSources, PHONE_ART_MEDIA } from "../../src/responsiveArt.js";
import { renderStartPages } from "../../scripts/site-pages.mjs";
import { HERO_ART, STATIC_SHELL_ATTRIBUTE, staticShellMarkup, withStaticShell } from "../../scripts/static-shell.mjs";

const INDEX = readFileSync("index.html", "utf8");
const shelled = withStaticShell(INDEX);
const pages = { "index.html": shelled, ...renderStartPages(shelled) };
const shellCount = (html) => html.split(STATIC_SHELL_ATTRIBUTE).length - 1;
/** What a reader would see: the text between the tags, and the attribute values a browser shows (alt, title, data-text). */
const textOf = (markup) => markup.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean);
const shownAttributes = (markup) => [...markup.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/g)].map((match) => match[1]);

test("the build puts one shell inside #root on /, /en/ and /ja/, and nothing else moves", () => {
  assert.deepEqual(Object.keys(pages).sort(), ["en/index.html", "index.html", "ja/index.html"]);
  for (const [file, html] of Object.entries(pages)) {
    assert.equal(shellCount(html), 1, file);
    assert.match(html, new RegExp(`<div id="root"><main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE} inert aria-hidden="true">`), file);
    assert.ok(html.indexOf(STATIC_SHELL_ATTRIBUTE) < html.indexOf("<noscript>"), `${file}: the shell stands before the no-script text`);
  }
  // The same shell on all three: no language of its own.
  const shells = Object.values(pages).map((html) => html.slice(html.indexOf('<div id="root">'), html.indexOf("</main></div>")));
  assert.equal(new Set(shells).size, 1);
  // Everything around #root is the page as it was.
  assert.equal(shelled.replace(staticShellMarkup(), ""), INDEX);
});

test("the shell holds no sentence: only the game's name, its reading and hanja, and an unlabeled start button", () => {
  const markup = staticShellMarkup();
  const words = textOf(markup);
  const allowed = new Set([...GAME_TITLE.split(" "), GAME_TITLE_READING, "臨界點"]);
  for (const word of words) assert.ok(allowed.has(word), `"${word}" is not the game's name`);
  // Hangul only in the reading, no English beyond the title, no kana at all.
  assert.deepEqual(words.filter((word) => /[가-힣]/.test(word)), [GAME_TITLE_READING]);
  assert.ok(!/[぀-ヿ]/.test(markup), "no Japanese kana");
  assert.deepEqual(shownAttributes(markup), [""], "the picture's alt is empty: the shell is hidden from assistive tech");
  assert.match(markup, /<div class="start-input-row intro-launch"><button type="button" tabindex="-1"><\/button><\/div>/, "the start button has no label");
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
  for (const name of classes) assert.ok(critical.includes(`.${name}`), `.${name} is in the critical CSS`);
  assert.ok(critical.includes(".intro-launch button{"), "the unlabeled button takes the start button's height");
});

test("a page without exactly one empty #root is refused, not shelled twice or nowhere", () => {
  assert.throws(() => withStaticShell("<body></body>"), /exactly one empty/);
  assert.throws(() => withStaticShell(shelled), /exactly one empty/);
});
