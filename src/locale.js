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
  { code: "en", name: "English", preview: true },
];
const CODES = SUPPORTED_LOCALES.map((locale) => locale.code);

function readLanguage() {
  try {
    const stored = readStoredValue(LOCALE_KEY, "");
    if (CODES.includes(stored)) return stored;
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
 * copied address opens in it too. Korean takes the query away.
 */
export function chooseLanguage(code) {
  if (!CODES.includes(code) || code === LANG) return;
  writeStoredValue(LOCALE_KEY, code);
  const url = new URL(globalThis.location.href);
  if (code === SOURCE_LOCALE) url.searchParams.delete("lang");
  else url.searchParams.set("lang", code);
  globalThis.location.assign(url.toString());
}

// The overlay module, once a page in another language has it.
let overlay = null;

/** Before the first paint of a page in another language: its dictionary, laid over the screen copy it covers. Nothing on a Korean page. */
export function loadLocale() {
  if (LANG === SOURCE_LOCALE) return null;
  document.documentElement.lang = LANG;
  return import("./locales/overlay.js")
    .then((module) => module.loadDictionary(LANG))
    .then((module) => {
      overlay = module;
    });
}

/** A speaker's name as the page prints it, for a name with no scene in hand (a scene carries `speakerName`). The Korean name stays the key. */
export function speakerName(name) {
  return overlay ? overlay.speakerName(name) : name;
}

/** A line of the language's own screens (its dictionary's `preview`, F-3 and F-4), or "" on a Korean page. */
export function previewText(key) {
  return overlay ? overlay.previewText(key) : "";
}

/** Tables of screen copy a module owns, laid over in the page's language as the module loads (caseCopy.js). */
export function localizeTables(module, tables) {
  if (overlay) overlay.localizeTables(module, tables);
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
