import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { studioName } from "../../src/credits.js";
import observerKo from "../../src/copy/observer.js";
import observerEn from "../../src/locales/en/screens/observer.js";
import observerJa from "../../src/locales/ja/screens/observer.js";
import endingKo from "../../src/copy/ending.js";
import endingEn from "../../src/locales/en/screens/ending.js";
import endingJa from "../../src/locales/ja/screens/ending.js";
import { CASE_PAGES, CASE_TEXT } from "../../scripts/content-pages/cases.mjs";
import { CHARACTER_GROUPS } from "../../scripts/content-pages/characters-text.mjs";
import { MAKING_BODY } from "../../scripts/content-pages/making-text.mjs";
import { CONTENT_KINDS, renderContentPages } from "../../scripts/content-pages/pages.mjs";
import { MENU_KINDS } from "../../scripts/content-pages/site-nav.mjs";
import { renderStaticPages } from "../../scripts/site-pages.mjs";

/**
 * The content pages (scripts/content-pages): the guide, the case files and a
 * page per case, the cast and how we made it, in three languages, under the
 * site's menu. What these hold is what AdSense asked for on 2026-11-08 --
 * pages of the site's own words that a reader can move between -- and what
 * they must never hold is the story's turns or its endings.
 */

const content = renderContentPages();
const all = renderStaticPages();
const FOLDER = { ko: "", en: "en/", ja: "ja/" };
const LANGUAGES = Object.keys(FOLDER);
const decode = (html) => html.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
/** What a reader reads: the body without the sheet and the tags. */
const readable = (html) => decode(html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
const languageOf = (file) => /^(en|ja)\//.exec(file)?.[1] ?? "ko";

test("every content page is written in Korean, English and Japanese, and every case of the season has one", () => {
  assert.deepEqual(CASE_PAGES, CASE_SEQUENCE, "a page for each of the season's cases, in its order");
  assert.equal(CONTENT_KINDS.length, CASE_SEQUENCE.length + 4);
  for (const kind of CONTENT_KINDS) {
    for (const language of LANGUAGES) {
      const file = `${FOLDER[language]}${kind}.html`;
      assert.ok(content[file], `${file} is written`);
      assert.match(content[file], new RegExp(`<html lang="${language}">`), file);
    }
  }
  assert.equal(Object.keys(content).length, CONTENT_KINDS.length * 3);
  for (const [file, html] of Object.entries(content)) {
    assert.doesNotMatch(html.replace(/<style>[\s\S]*?<\/style>/, ""), /\$\{|undefined|NaN|\[object /, `${file}: no placeholder left`);
    assert.doesNotMatch(html, /<script\b/i, `${file}: a plain page needs no script`);
  }
});

test("every plain page carries the site menu at its head and its foot, and every link lands on something the build writes", () => {
  const written = new Set(Object.keys(all).map((file) => `/${file}`));
  for (const [file, html] of Object.entries(all)) {
    const language = languageOf(file);
    const navs = [...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)].map((match) => match[1]);
    assert.equal(navs.length, 2, `${file}: a menu at the head and one at the foot`);
    for (const links of navs) {
      for (const kind of MENU_KINDS) assert.ok(links.includes(`href="/${FOLDER[language]}${kind}.html"`), `${file} links ${kind} in ${language}`);
    }
    for (const [, href] of decode(html).matchAll(/<(?:a|img)\b[^>]*?(?:href|src)="([^"]+)"/g)) {
      if (href.startsWith("mailto:") || /^https:\/\//.test(href)) continue;
      if (/^\/((en|ja)\/)?$/.test(href)) continue;
      assert.ok(written.has(href) || existsSync(`public${href}`), `${file} links ${href}, which is neither written nor shipped`);
    }
  }
});

test("each case page has its sections, a page's worth of its own words, and the English and Japanese are whole", () => {
  for (const caseId of CASE_PAGES) {
    for (const language of LANGUAGES) {
      const text = CASE_TEXT[caseId][language];
      assert.ok(text, `${caseId} has ${language}`);
      assert.ok(text.setting && text.question, `${caseId}/${language}: setting and question`);
      assert.ok(text.premise.length >= 2, `${caseId}/${language}: the premise in paragraphs`);
      assert.ok(text.cast.length >= 1 && text.cast.every((person) => person.name && person.note), `${caseId}/${language}: who is in the room`);
    }
    const words = readable(content[`en/cases/${caseId}.html`]).split(" ").length;
    assert.ok(words >= 300, `en/cases/${caseId}.html has ${words} words`);
    const ko = readable(content[`cases/${caseId}.html`]).replace(/\s/g, "").length;
    assert.ok(ko >= 900, `cases/${caseId}.html has ${ko} characters`);
    assert.ok(readable(content[`ja/cases/${caseId}.html`]).replace(/\s/g, "").length >= ko * 0.8, `ja/cases/${caseId}.html is whole`);
  }
  for (const [file, html] of Object.entries(content)) {
    if (languageOf(file) === "ko") continue;
    const left = html.replace(/ lang="ko">한국어<\/a>/g, "");
    assert.doesNotMatch(left, /[가-힣]/, `${file}: no Korean left untranslated`);
  }
});

test("no page tells an ending: no ending's id, label or title in any language", () => {
  const ids = Object.keys(observerKo.endings).filter((id) => id.includes("-"));
  const labels = Object.keys(observerKo.endings).map((id) => id.toUpperCase().replace(/-/g, " "));
  const titles = [observerKo, observerEn, observerJa].flatMap((copy) => Object.values(copy.endings).map((ending) => ending.title));
  const verdicts = [endingKo, endingEn, endingJa].flatMap((copy) => [...Object.values(copy.verdicts).map((verdict) => verdict.title), copy.collapse.title]);
  const forbidden = [...ids, ...labels, "SYSTEM COLLAPSE", "OPEN QUESTION", ...titles, ...verdicts].filter((phrase) => phrase && phrase.length >= 6);
  assert.ok(forbidden.length >= 30, "the endings' words are read from the game");
  for (const [file, html] of Object.entries(content)) {
    const text = readable(html);
    for (const phrase of forbidden) assert.ok(!text.includes(phrase), `${file} names an ending: ${phrase}`);
  }
});

test("how we made it is told by the two of us: never a singular first person, and the studio by its name in each language", () => {
  const singular = {
    ko: /(^|[^가-힣])(나는|내가|나의|나도|저는|제가|저의|저도|내 )/,
    en: /\b(I|I'm|I've|I'd|I'll|my|me|mine|myself)\b/,
    ja: /(私(?!たち)|僕|俺|わたし(?!たち))/,
  };
  for (const language of LANGUAGES) {
    const body = readable(MAKING_BODY[language]);
    assert.doesNotMatch(body, singular[language], `making (${language}) speaks as one person`);
    const page = content[`${FOLDER[language]}making.html`];
    assert.ok(page.includes(studioName(language)), `making (${language}) names the studio as credits.js does`);
    assert.doesNotMatch(readable(page).replace(/SUPASONIC & ALICE/g, ""), singular[language], `making.html (${language})`);
  }
  assert.match(readable(MAKING_BODY.ko), /우리/);
  assert.match(readable(MAKING_BODY.en), /\bwe\b/i);
  assert.match(readable(MAKING_BODY.ja), /私たち/);
});

test("the cast's portraits are pictures the game already ships", () => {
  const people = CHARACTER_GROUPS.flatMap((group) => group.people);
  assert.ok(people.length >= 10, "the recurring cast");
  for (const person of people) {
    if (person.portrait) assert.ok(existsSync(`public${person.portrait}`), `${person.key}: ${person.portrait} is in public/`);
    for (const language of LANGUAGES) assert.ok(person[language]?.name && person[language].text.length, `${person.key} has ${language}`);
  }
});

test("the guide, the cast and the making-of are pages of substance", () => {
  for (const kind of ["guide", "characters", "making", "cases/index"]) {
    const en = readable(content[`en/${kind}.html`]).split(" ").length;
    assert.ok(en >= 800, `en/${kind}.html has ${en} words`);
    const ko = readable(content[`${kind}.html`]).replace(/\s/g, "").length;
    assert.ok(ko >= 2000, `${kind}.html has ${ko} characters`);
  }
});

test("from 사건 10 on, a case's page says it tells how the earlier cases went, and the index keeps its lines folded", () => {
  const NOTICE = { ko: "앞 사건의 전개가 나옵니다", en: "This page shows how the earlier cases unfolded", ja: "前の事件の展開が出てきます" };
  const late = CASE_SEQUENCE.slice(CASE_SEQUENCE.indexOf("case10"));
  assert.deepEqual(late.slice(0, 2), ["case10", "case11"]);
  assert.ok(late.includes("final"));
  for (const caseId of CASE_SEQUENCE) {
    for (const language of LANGUAGES) {
      const html = content[`${FOLDER[language]}cases/${caseId}.html`];
      const body = html.slice(html.indexOf("</h1>"));
      if (late.includes(caseId)) {
        // At the top, before the premise, with the way back to the index.
        assert.ok(body.indexOf(NOTICE[language]) > 0 && body.indexOf(NOTICE[language]) < body.indexOf("<h2>"), `${caseId}/${language}: the notice at the top`);
        assert.match(body, new RegExp(`class="spoiler-note">[^\n]*href="/${FOLDER[language]}cases/index.html"`), `${caseId}/${language}: links the index`);
      } else {
        assert.ok(!html.includes(NOTICE[language]) && !html.includes("spoiler-note\">"), `${caseId}/${language}: no notice before 사건 10`);
      }
    }
  }
  for (const language of LANGUAGES) {
    const index = content[`${FOLDER[language]}cases/index.html`];
    const items = [...index.matchAll(/<li><a href="[^"]*cases\/([a-z0-9]+)\.html">[\s\S]*?<\/li>/g)];
    assert.equal(items.length, CASE_SEQUENCE.length, `${language}: every case in the index`);
    for (const [item, caseId] of items) {
      const folded = /<details><summary>[^<]+<\/summary>[\s\S]*<\/details>/.test(item);
      assert.equal(folded, late.includes(caseId), `${language}: ${caseId} ${late.includes(caseId) ? "folded" : "open"}`);
      assert.ok(item.includes(escapeText(CASE_TEXT[caseId][language].question)), `${language}: ${caseId}'s question stays in the HTML`);
      if (folded) assert.doesNotMatch(item, /<details open/, `${language}: ${caseId} closed by default`);
    }
  }
});

function escapeText(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
