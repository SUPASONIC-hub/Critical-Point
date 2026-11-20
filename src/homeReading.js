/**
 * The reading section under the start screen (읽을거리): what the game is,
 * the site's nine kinds of page, and the newest notes. HomeReading.jsx draws
 * it after the intro; scripts/static-shell.mjs writes the same section, as
 * plain HTML, into the start page before any script runs, so a reader or a
 * crawler that runs no script finds it at the address too. Its notes are
 * the build's (`recentNotes`, src/notes/noteIndex.js), handed to the screen as
 * __CP_RECENT_NOTES__ (vite.config.js): the start screen's bundle carries the
 * three it lists, not every note's title and summary.
 *
 * Why: AdSense turned the site down a second time on 2026-11-19 for low-value
 * content, and the start page -- the address a reviewer opens first -- showed
 * a game screen and five policy links, its site menu hidden
 * (cp-archive/메모-20261120/adsense-2차-분석.md, 2-1; owner's decision 11-20 Q1 「1」).
 */

/** The nine kinds, in the order the section lists them: the pages about the game, the notes, then the pages about the site. */
export const READING_KINDS = ["guide", "cases/index", "characters", "making", "notes/index", "about", "faq", "contact", "policies"];

/** The small English word over the section's heading, the same on every page (as the wordmark's tagline is). */
export const READING_EYEBROW = "READING";

/** The notes' list, Korean only (src/notes/noteIndex.js `NOTES_INDEX_PATH`, the same address). */
export const NOTES_INDEX_PATH = "/notes/index.html";

/** A page in a language: Korean at the root, the others in a folder of their code; the notes are Korean only. */
export function readingPath(kind, language) {
  if (kind.startsWith("notes/")) return `/${kind}.html`;
  return language === "en" || language === "ja" ? `/${language}/${kind}.html` : `/${kind}.html`;
}

/**
 * The menu's rows in `language`: each `{ kind, label, text, links }`, a link
 * being `{ href, label, hreflang }`. 방침·약관 is one row of two links (the
 * privacy policy and the terms, named as the intro's `legal` names them);
 * every other row is one link named by its label. `copy` is the intro's
 * `reading`, `legal` its `legal`.
 */
export function readingMenu(copy, legal, language) {
  return READING_KINDS.map((kind) => {
    const item = copy.items[kind];
    const links =
      kind === "policies"
        ? ["privacy", "terms"].map((page) => ({ href: readingPath(page, language), label: legal[page], hreflang: null }))
        : [{ href: readingPath(kind, language), label: item.label, hreflang: kind.startsWith("notes/") && language !== "ko" ? "ko" : null }];
    return { kind, label: item.label, text: item.text, links };
  });
}

