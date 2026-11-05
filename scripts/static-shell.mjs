import { GAME_TITLE, GAME_TITLE_READING } from "../src/appCopy.js";
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
 * It holds no sentence in any language. The page cannot tell before its script
 * which language it will be in (a stored choice beats the folder and
 * `?lang=`, src/locale.js, and the policy allows no inline script to read it),
 * so the same shell is right on `/`, `/en/` and `/ja/` and never shows one
 * language before another. What it keeps is the game's name as the brand writes
 * it everywhere (GAME_TITLE, its reading GAME_TITLE_READING and the hanja), and
 * a start button with no label.
 *
 * React does not hydrate it: main.jsx renders into `#root` as before, and the
 * first commit replaces the shell whole. So it can never disagree with a saved
 * run, a name or a setting; what it can do is sit somewhere else than the intro
 * that replaces it, which tests/production-build.spec.js measures.
 *
 * `inert` and `aria-hidden`: until it is replaced, nothing in it can be
 * pressed, focused or read out twice beside the intro.
 */

export const STATIC_SHELL_ATTRIBUTE = "data-static-shell";
export const HERO_ART = "/triggerlab-key-visual.webp";
const HANJA = "臨界點";
const ROOT = '<div id="root"></div>';

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

/** The shell's markup, the intro's frame with no words of any one language in it. */
export function staticShellMarkup({ title = GAME_TITLE, reading = GAME_TITLE_READING } = {}) {
  const art = getArtSources(HERO_ART);
  if (!art) throw new Error(`static-shell: ${HERO_ART} has no responsive variants (src/responsiveArt.js).`);
  return (
    `<main class="shell intro-shell" ${STATIC_SHELL_ATTRIBUTE} inert aria-hidden="true">` +
    `<section class="intro"><div class="intro-hero">` +
    // The picture as IntroScreen.jsx writes it (and index.html preloads it): the browser takes the file it already has.
    `<div class="intro-hero-art"><figure class="intro-visual"><picture>` +
    `<source media="${PHONE_ART_MEDIA}" srcset="${art.phone}" type="image/webp">` +
    `<source srcset="${art.wide}" sizes="${art.wideSizes}" type="image/webp">` +
    `<img src="/triggerlab-key-visual.jpg" alt="" width="1672" height="941" fetchpriority="high">` +
    `</picture></figure></div>` +
    `<div class="intro-hero-copy">` +
    `<div class="brand-row"><span class="brand-mark"><i class="brand-mark-dot"></i>${escape(title)}</span></div>` +
    wordmark(title, reading) +
    // The start row's own button, with no label: `.intro-launch button` gives it the start button's
    // height (min-height 60px), so the row stands where the intro's will. A device with a save gets
    // the 이어하기 card there instead; that move is measured, not guessed (production-build.spec.js).
    `<div class="start-input-row intro-launch"><button type="button" tabindex="-1"></button></div>` +
    `</div></div></section></main>`
  );
}

/** index.html with the shell inside its `#root`. Throws when the page has no empty `#root` to put it in. */
export function withStaticShell(html, markup = staticShellMarkup()) {
  const at = html.indexOf(ROOT);
  if (at === -1 || html.indexOf(ROOT, at + 1) !== -1) throw new Error(`static-shell: index.html needs exactly one empty ${ROOT}.`);
  return `${html.slice(0, at)}<div id="root">${markup}</div>${html.slice(at + ROOT.length)}`;
}
