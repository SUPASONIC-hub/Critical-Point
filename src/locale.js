/**
 * Which language the page plays in (다국어 틀; 영어판 1단계, 2026-10-26; the
 * plan is 앱출시-F, the structure 조사 4-2).
 *
 * Korean is the game and the source: every other language is words laid over
 * it, and whatever a language leaves out falls back to the Korean (<lang> ->
 * ko). `SUPPORTED_LOCALES` is the one list of languages, in the order the
 * language choice shows them, each with its name in its own language.
 *
 * The page's language is, in order: the one the player chose (kept in this
 * device's storage), the one the address asks for (`?lang=<code>`), Korean.
 * The browser's own language is not followed. On a Korean page every
 * function below hands back what it was given, so the Korean page runs the
 * code it ran before, to the byte of what it draws.
 *
 * A language's words are chunks of their own under src/locales/, fetched only
 * by a page in that language: src/locales/overlay.js, which lays words over
 * the Korean, and through it the language's dictionary (<lang>/index.js)
 * before the first paint and each case's scenes (<lang>/nodes/<caseId>.js)
 * beside the Korean case chunk they cover. `npm run check:locale --
 * --lang=<code>` counts what is still Korean.
 */
import { LOCALE_KEY, readStoredValue, writeStoredValue } from "./appConfig.js";

export const SOURCE_LOCALE = "ko";
export const SUPPORTED_LOCALES = [
  { code: "ko", name: "한국어" },
  // Open to the end of the season (10-28, the owner): a language may still
  // carry `preview: true` (a line under the buttons) or `hidden: true` (offered
  // only on its own pages), and neither does now.
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
];
const CODES = SUPPORTED_LOCALES.map((locale) => locale.code);

/**
 * The language a start page's own folder names: `/en/` and `/ja/` (and their
 * `index.html`) are the start page in English and Japanese
 * (scripts/site-pages.mjs `localizedStartPage`, since 11-03). Null anywhere
 * else, `/` included.
 */
export function folderLanguage(pathname = "") {
  const code = /^\/([a-z]{2})\/(?:index\.html)?$/.exec(String(pathname))?.[1];
  return code && code !== SOURCE_LOCALE && CODES.includes(code) ? code : null;
}

function readLanguage() {
  try {
    const stored = readStoredValue(LOCALE_KEY, "");
    if (CODES.includes(stored)) return stored;
    const folder = folderLanguage(globalThis.location?.pathname);
    if (folder) return folder;
    const asked = new URLSearchParams(globalThis.location?.search ?? "").get("lang");
    return CODES.includes(asked) ? asked : SOURCE_LOCALE;
  } catch {
    return SOURCE_LOCALE;
  }
}

export const LANG = readLanguage();

/**
 * The player's choice (src/components/LanguagePicker.jsx): kept on this
 * device, and the page opened again in it, with `?lang=` saying the same so a
 * copied address opens in it too. Korean takes the query away. On a
 * language's own start page (`/en/`, `/ja/`) the address becomes the chosen
 * language's (`/`, `/en/`, `/ja/`) instead, so it never names one language
 * while the page plays another.
 */
export function chooseLanguage(code) {
  if (!CODES.includes(code) || code === LANG) return;
  writeStoredValue(LOCALE_KEY, code);
  const url = new URL(globalThis.location.href);
  if (folderLanguage(url.pathname)) {
    url.pathname = code === SOURCE_LOCALE ? "/" : `/${code}/`;
    url.searchParams.delete("lang");
  } else if (code === SOURCE_LOCALE) url.searchParams.delete("lang");
  else url.searchParams.set("lang", code);
  globalThis.location.assign(url.toString());
}

/**
 * A page opened in another language at `/?lang=<code>` (or by a stored
 * choice) is the Korean page as the host sends it, canonical `/`. Its
 * canonical is moved to the language's own start page, so a crawler that
 * runs the script reads `/?lang=en` as `/en/` and not as the Korean `/`.
 */
function pointCanonical() {
  const link = globalThis.document?.querySelector?.('link[rel="canonical"]');
  if (!link || folderLanguage(globalThis.location?.pathname)) return;
  const href = link.getAttribute("href") ?? "";
  const origin = /^https?:\/\/[^/]+/.exec(href)?.[0] ?? "";
  link.setAttribute("href", `${origin}/${LANG}/`);
}

// The overlay module, once a page in another language has it.
let overlay = null;
// Tables handed over before it arrived (src/copy/*.js in the shell), laid over when it does.
const waiting = [];

/**
 * The tab's title from a dictionary (overlay.js pageTitle()): index.html's
 * <title> is the Korean one, and the tab falls back to whatever the page had
 * when it first painted (state/tabTitle.js). Called before the first paint,
 * so that is this one. Returns the title, or null when there is none.
 */
export function setPageTitle(module, doc = globalThis.document) {
  const title = module?.pageTitle?.() ?? null;
  if (title && doc) doc.title = title;
  return title;
}

/** Before the first paint of a page in another language: its dictionary, laid over the screen copy it covers. Nothing on a Korean page. */
export function loadLocale() {
  if (LANG === SOURCE_LOCALE) return null;
  document.documentElement.lang = LANG;
  pointCanonical();
  return import("./locales/overlay.js")
    .then((module) => module.loadDictionary(LANG))
    .then((module) => {
      overlay = module;
      for (const [name, tables] of waiting.splice(0)) module?.localizeTables(name, tables);
      setPageTitle(module);
    });
}

/**
 * The language the page was really painted in: `LANG` once its dictionary
 * has arrived, and Korean when it could not be fetched (main.jsx paints Korean
 * then), so a run played in Korean is never counted as another language's.
 */
export function appliedLocale() {
  return overlay ? LANG : SOURCE_LOCALE;
}

/** A speaker's name as the page prints it, for a name with no scene in hand (a scene carries `speakerName`). The Korean name stays the key. */
export function speakerName(name) {
  return overlay ? overlay.speakerName(name) : name;
}

/** A speaker's role in the page's language (its dictionary's `roles`), or the Korean role as it came. */
export function roleName(role) {
  return overlay ? overlay.roleName(role) : role;
}

/** A line of the language's own screens (its dictionary's `preview`, F-3 and F-4), or "" on a Korean page. */
export function previewText(key) {
  return overlay ? overlay.previewText(key) : "";
}

/**
 * Tables of screen copy a module owns (caseCopy.js, src/copy/*.js), laid over
 * in the page's language: now if its dictionary is in, or as soon as it is (a
 * module of the shell is read before the dictionary arrives). Nothing on a
 * Korean page.
 */
export function localizeTables(module, tables) {
  if (overlay) overlay.localizeTables(module, tables);
  else if (LANG !== SOURCE_LOCALE) waiting.push([module, tables]);
}

/**
 * A line of screen copy with its blanks filled: `fill("{count}건", { count: 3 })`
 * is "3건". The Korean line reads as the template literal it replaced; another
 * language's line may order, or leave out, the blanks (a particle, say).
 */
export function fill(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (blank, name) => (name in values ? String(values[name]) : blank));
}

/**
 * One case's data as it arrives (virtual:season, scripts/vite-season-data.mjs),
 * with the page's language laid over it. `index` is the season's index, whose
 * case packs carry the case's result copy. A case the language has no file
 * for, or whose file cannot be fetched, stays Korean.
 */
export function localizeCaseData(caseId, data, index) {
  return overlay ? overlay.localizeCaseData(caseId, data, index) : data;
}

/**
 * E-11 번외 사건: a side pack as it arrives (src/nodes/sidePacks.js), with the
 * page's language laid over its scenes and endings
 * (src/locales/<lang>/nodes/sideNN.js). Korean as it is on a Korean page.
 */
export function localizeSidePack(pack) {
  return overlay ? overlay.localizeSidePack(pack) : pack;
}
