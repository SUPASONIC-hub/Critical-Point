import { GAME_TITLE } from "../src/appCopy.js";
import introCopy from "../src/copy/intro.js";
import enIntro from "../src/locales/en/screens/intro.js";
import jaIntro from "../src/locales/ja/screens/intro.js";
import { style as jaStyle } from "../src/locales/ja/index.js";
import { getArtSources, PHONE_ART_MEDIA } from "../src/responsiveArt.js";
import { NOTES_INDEX_PATH, READING_EYEBROW, readingMenu } from "../src/homeReading.js";
import { recentNotes } from "../src/notes/noteIndex.js";
import { frontPageFor, NEWS_INDEX_PATH, NEWS_PAPER } from "../src/news/newsIndex.js";
import { notesDay } from "./content-pages/notes.mjs";
import { showHanja, wordmarkLogoMarkup } from "../src/components/wordmarkLogo.js";

/**
 * The intro's first viewport as plain HTML, inside `#root`, so the page paints
 * before its script has run (정적 셸, 사용자 결정 11-04 전부 1, 방안 A).
 *
 * Measured on 2026-11-03 (perf-1103), a phone's first visit painted nothing but
 * the background for 7 to 11 seconds: the inlined critical CSS was there, the
 * key visual had been preloaded, but `#root` was empty until the entry chunk
 * and React had run. This puts in the frame those rules already style -- the
 * key visual, the brand mark, the wordmark with its reading, and a start
 * button's place -- with the intro's own classes, so the critical CSS
 * (src/styles/critical.generated.css) paints it as it paints the intro.
 *
 * It shows no sentence in any language. The page cannot tell before its script
 * which language it will be in (a stored choice beats the folder and
 * `?lang=`, src/locale.js, and the policy allows no inline script to read it),
 * so what it shows never puts one language's sentence before another's. What
 * it shows is the game's name as the brand writes it everywhere (GAME_TITLE,
 * the start page's reading of it and the hanja), and a start button with no
 * label.
 *
 * React does not hydrate it: main.jsx renders into `#root` as before, and the
 * first commit replaces the shell whole. So it can never disagree with a saved
 * run, a name or a setting; what it can do is sit somewhere else than the intro
 * that replaces it, which tests/production-build.spec.js measures.
 *
 * `inert` and `aria-hidden`: until it is replaced, nothing in it can be
 * pressed, focused or read out twice beside the intro.
 *
 * Where the intro's words stand (decision 13 (1), 11-06). The first cut of the
 * shell (#459, reverted) had only the name and the button, so its column was
 * 250 to 400px shorter than the intro's: the brand row's `margin-bottom: auto`
 * set the wordmark on the stage's floor, the intro then set it under the brand
 * row, and the art box, which grew with the column, was rescaled by
 * object-fit. The art now takes its height from the viewport alone
 * (`.intro-hero-art`, base-intro-ranking.css), and the shell lays out the
 * column the intro will: the header pills, the tagline, the kicker and the
 * premise are there in the page's language with `visibility: hidden`, so they
 * hold their lines and show nothing, and a hidden floor under the start row
 * makes the column outrun the stage as the intro's does (its consent line,
 * stats and credit), on every phone and desktop measured. What shows is still
 * the name -- in the page's reading -- and an unlabeled button, so a stored
 * choice of another language never shows a sentence in the wrong one; each
 * start page carries its own hidden words (`localizeStaticShell`, written by
 * site-pages.mjs's `localizedStartPage`).
 *
 * Under the shell, outside it and shown: 읽을거리 (src/homeReading.js), the
 * start screen's reading section as plain HTML in the page's language -- what
 * the game is, the site's nine kinds of page, the newest notes. Until 11-20 the
 * site's links stood here inside the shell, hidden (`visibility: hidden`,
 * `tabindex="-1"`, under `inert`): links a crawler could only read as hidden
 * text, and that no reader without a script could see (AdSense 2차 분석, 2-1).
 * It sits under the shell's 100svh floor, so the first screen is the same; a
 * stored choice of another language would show its words only to a reader
 * who scrolled that far before the script ran, and the intro replaces it whole
 * with HomeReading.jsx's, which says the same in the chosen language.
 */

export const STATIC_SHELL_ATTRIBUTE = "data-static-shell";
export const HERO_ART = "/triggerlab-key-visual.webp";
const HANJA = "臨界點";
const ROOT = '<div id="root"></div>';
const SHELL_START = `<main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE}`;
const SHELL_END = "</main>";
const READING_ATTRIBUTE = "data-static-reading";
const READING_END = "</section>";
/** The intro's words per start page: src/copy/intro.js and its two locales, read as IntroScreen.jsx reads them. */
const INTRO_COPY = { ko: introCopy, en: enIntro, ja: jaIntro };
/** GameWordmark.jsx's default tagline, the same English line on every page. */
const TAGLINE = "When does my creativity burst?";
/**
 * A language's own page CSS, which its dictionary chunk puts in <head> before the
 * intro's first render (src/locales/overlay.js `addStyle`): Japanese sets its
 * system face and its line breaks. The shell carries it inside itself, so it
 * goes with the shell when the intro replaces it.
 */
const PAGE_STYLE = { ja: jaStyle };
/** Lays out, paints nothing; the inline style is allowed by the page's style-src. */
const HIDDEN = 'style="visibility:hidden"';

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The wordmark as GameWordmark.jsx writes it, without the tagline sentence under it. */
function wordmark(label, reading) {
  return (
    `<h1 class="game-wordmark"><span class="sr-only">${escape(label)}</span>${wordmarkLogoMarkup()}` +
    `<span class="wordmark-rule"></span>` +
    `<span class="wordmark-reading"><b>${escape(reading)}</b>${showHanja(reading, HANJA) ? `<i>${HANJA}</i>` : ""}</span></h1>`
  );
}

/**
 * 읽을거리 as HomeReading.jsx draws it, in the page's language, with the notes
 * out by `day` and that day's 오늘의 1면 (`frontPageFor`; the screen shows the
 * reader's own day once it runs): the same classes, so the app's sheet styles it the moment it
 * loads. No `<section>` inside it, which is how `localizeStaticShell` finds its end.
 */
export function staticReadingMarkup({ language = "ko", day = notesDay() } = {}) {
  const copy = INTRO_COPY[language];
  if (!copy) throw new Error(`static-shell: no intro copy in ${language}.`);
  const words = copy.reading;
  const korean = language === "ko" ? "" : ' hreflang="ko"';
  const menu = readingMenu(words, copy.legal, language)
    .map((row) => {
      const links = row.links.map((link) => `<a href="${link.href}"${link.hreflang ? ` hreflang="${link.hreflang}"` : ""}>${escape(link.label)}</a>`).join("");
      return `<li data-kind="${row.kind}"><span class="home-reading-links">${links}</span><small>${escape(row.text)}</small></li>`;
    })
    .join("");
  const notes = recentNotes(day);
  const list = notes.length
    ? `<ul lang="ko">${notes.map((note) => `<li><a href="${note.href}">${escape(note.title)}</a><time datetime="${note.day}">${note.date}</time><p>${escape(note.summary)}</p></li>`).join("")}</ul>`
    : `<p>${escape(words.notesEmpty)}</p>`;
  const front = frontPageFor(day);
  const press =
    `<div class="home-reading-front"><h3>${escape(words.frontTitle)}</h3>` +
    `<div class="home-reading-story" lang="ko"><p class="home-reading-paper">${escape(NEWS_PAPER)} · ${escape(front.section)} · <time datetime="${front.day}">${front.date}</time></p>` +
    `<a href="${front.href}">${escape(front.title)}</a><p>${escape(front.summary)}</p></div>` +
    `<p class="home-reading-fiction">${escape(words.frontNote)}</p>` +
    `<a class="home-reading-all" href="${NEWS_INDEX_PATH}"${korean}>${escape(words.frontAll)}</a></div>`;
  return (
    `<section class="home-reading" ${READING_ATTRIBUTE} aria-labelledby="home-reading-title">` +
    `<div class="home-reading-head"><span class="home-reading-eyebrow" lang="en">${READING_EYEBROW}</span><h2 id="home-reading-title">${escape(words.title)}</h2></div>` +
    `<div class="home-reading-about">${words.intro.map((line) => `<p>${escape(line)}</p>`).join("")}</div>` +
    `<nav class="home-reading-menu" aria-label="${escape(words.menuLabel)}"><h3>${escape(words.menuTitle)}</h3><ul>${menu}</ul></nav>` +
    `<div class="home-reading-press">${press}<div class="home-reading-notes"><h3>${escape(words.notesTitle)}</h3>${list}` +
    `<a class="home-reading-all" href="${NOTES_INDEX_PATH}"${korean}>${escape(words.notesAll)}</a></div></div>` +
    READING_END
  );
}

/** The shell's markup, the intro's frame: the name in the page's reading shows, the words lay out unseen. */
export function staticShellMarkup({ language = "ko", title = GAME_TITLE } = {}) {
  const copy = INTRO_COPY[language];
  if (!copy) throw new Error(`static-shell: no intro copy in ${language}.`);
  const art = getArtSources(HERO_ART);
  if (!art) throw new Error(`static-shell: ${HERO_ART} has no responsive variants (src/responsiveArt.js).`);
  // IntroScreen.jsx's header pills: the icon is lucide's 15px svg, the label the page's word.
  const pill = (extra, label) => `<button class="ghost intro-ranking-button${extra}" type="button" tabindex="-1"><svg width="15" height="15"></svg>${escape(label)}</button>`;
  return (
    `<main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE} inert aria-hidden="true">` +
    (PAGE_STYLE[language] ? `<style>${PAGE_STYLE[language]}</style>` : "") +
    `<section class="intro"><div class="intro-hero">` +
    // The picture as IntroScreen.jsx writes it (and index.html preloads it): the browser takes the file it already has.
    `<div class="intro-hero-art"><figure class="intro-visual"><picture>` +
    `<source media="${PHONE_ART_MEDIA}" srcset="${art.phone}" type="image/webp">` +
    `<source srcset="${art.wide}" sizes="${art.wideSizes}" type="image/webp">` +
    `<img src="/triggerlab-key-visual.jpg" alt="" width="1672" height="941" fetchpriority="high">` +
    `</picture></figure></div>` +
    `<div class="intro-hero-copy">` +
    `<div class="brand-row"><span class="brand-mark"><i class="brand-mark-dot"></i>${escape(title)}</span>` +
    // A phone wraps the pills under the brand mark: that line is part of where the wordmark stands.
    `<div class="top-actions" ${HIDDEN}>${pill("", copy.ranking)}${pill(" intro-board-button", copy.board)}</div></div>` +
    wordmark(title, copy.titleReading) +
    `<p class="wordmark-sub" lang="en" ${HIDDEN}>${TAGLINE}</p>` +
    `<strong class="intro-kicker" ${HIDDEN}>${escape(copy.subtitle)}</strong>` +
    `<p ${HIDDEN}>${escape(copy.premise)}</p>` +
    // The start row's own button, with no label: `.intro-launch button` gives it the start button's
    // height (min-height 60px), so the row stands where the intro's will. A device with a save gets
    // the 이어하기 card there instead; that move is measured, not guessed (production-build.spec.js).
    `<div class="start-input-row intro-launch"><button type="button" tabindex="-1"></button></div>` +
    // The intro's column runs on past the stage (the consent line, the stats, the credit), which
    // is what keeps its wordmark under the brand row; this floor does the same for the shell.
    `<div style="height:100svh"></div>` +
    `</div></div></section></main>`
  );
}

/** What `#root` holds before the script: the shell, then 읽을거리 under it. */
export const rootMarkup = ({ language = "ko", day = notesDay() } = {}) => staticShellMarkup({ language }) + staticReadingMarkup({ language, day });

/** A start page's shell and reading section in its own language: the page with its `#root` rewritten, or unchanged when it has no shell. */
export function localizeStaticShell(html, language, day = notesDay()) {
  const at = html.indexOf(SHELL_START);
  if (at === -1) return html;
  const shellEnd = html.indexOf(SHELL_END, at);
  if (shellEnd === -1) throw new Error("static-shell: the shell is not closed.");
  const reading = html.indexOf(READING_ATTRIBUTE, shellEnd);
  const end = reading === -1 ? shellEnd + SHELL_END.length : html.indexOf(READING_END, reading) + READING_END.length;
  return `${html.slice(0, at)}${rootMarkup({ language, day })}${html.slice(end)}`;
}

/** index.html (Korean) with the shell and 읽을거리 inside its `#root`. Throws when the page has no empty `#root` to put it in. */
export function withStaticShell(html, markup = rootMarkup()) {
  const at = html.indexOf(ROOT);
  if (at === -1 || html.indexOf(ROOT, at + 1) !== -1) throw new Error(`static-shell: index.html needs exactly one empty ${ROOT}.`);
  return `${html.slice(0, at)}<div id="root">${markup}</div>${html.slice(at + ROOT.length)}`;
}
