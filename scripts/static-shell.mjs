import { GAME_TITLE } from "../src/appCopy.js";
import introCopy from "../src/copy/intro.js";
import enIntro from "../src/locales/en/screens/intro.js";
import jaIntro from "../src/locales/ja/screens/intro.js";
import { style as jaStyle } from "../src/locales/ja/index.js";
import { getArtSources, PHONE_ART_MEDIA } from "../src/responsiveArt.js";

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
 */

export const STATIC_SHELL_ATTRIBUTE = "data-static-shell";
export const HERO_ART = "/triggerlab-key-visual.webp";
const HANJA = "臨界點";
const ROOT = '<div id="root"></div>';
const SHELL_START = `<main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE}`;
const SHELL_END = "</main>";
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
  const [first, ...rest] = label.split(" ");
  const second = rest.join(" ");
  const line = (text, accent) =>
    `<span class="wordmark-line${accent ? " wordmark-line-accent" : ""}" data-text="${escape(text)}">${escape(text)}</span>`;
  return (
    `<h1 class="game-wordmark">${line(first, false)}${second ? line(second, true) : ""}` +
    `<span class="wordmark-rule"></span>` +
    `<span class="wordmark-reading"><b>${escape(reading)}</b><i>${HANJA}</i></span></h1>`
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

/** A start page's shell in its own language: the page with its `#root` shell rewritten, or unchanged when it has none. */
export function localizeStaticShell(html, language) {
  const at = html.indexOf(SHELL_START);
  if (at === -1) return html;
  const end = html.indexOf(SHELL_END, at);
  if (end === -1) throw new Error("static-shell: the shell is not closed.");
  return `${html.slice(0, at)}${staticShellMarkup({ language })}${html.slice(end + SHELL_END.length)}`;
}

/** index.html (Korean) with the shell inside its `#root`. Throws when the page has no empty `#root` to put it in. */
export function withStaticShell(html, markup = staticShellMarkup()) {
  const at = html.indexOf(ROOT);
  if (at === -1 || html.indexOf(ROOT, at + 1) !== -1) throw new Error(`static-shell: index.html needs exactly one empty ${ROOT}.`);
  return `${html.slice(0, at)}<div id="root">${markup}</div>${html.slice(at + ROOT.length)}`;
}
