import { chooseLanguage, LANG, previewText, SUPPORTED_LOCALES } from "../locale.js";

/**
 * The language choice on the intro (다국어 틀, 2026-10-26): one button per
 * language in SUPPORTED_LOCALES, each named in its own language and marked
 * with it (`lang`), so a screen reader reads 「English」 in English. Pressing
 * one keeps the choice on this device and opens the page again in it
 * (src/locale.js). A language still in preview says so in one line under the
 * buttons, on its own pages only. A hidden one (a draft opened by its address)
 * has a button on its own pages only, named by its dictionary.
 *
 * It sits among the intro's header pills on a wide screen and in the hero's
 * empty top-left corner on a phone, so the first screen grows no taller.
 */
export function LanguagePicker() {
  const preview = SUPPORTED_LOCALES.find((locale) => locale.code === LANG)?.preview ? previewText("previewNote") : "";
  return (
    <nav className="language-picker" aria-label="언어 · Language" data-testid="language-picker">
      {SUPPORTED_LOCALES.filter(({ code, hidden }) => !hidden || code === LANG).map(({ code, name }) => (
        <button key={code} type="button" lang={code} aria-pressed={code === LANG} onClick={() => chooseLanguage(code)}>
          {name ?? previewText("languageName")}
        </button>
      ))}
      {preview && <small data-testid="language-preview-note">{preview}</small>}
    </nav>
  );
}
