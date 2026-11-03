/**
 * The store apps' ad and Remove Ads lines in the page's language: the Korean
 * table (src/copy/appStore.js) with the English or Japanese words of
 * src/locales/<lang>/app/appStore.js laid over it, a line the language leaves
 * out falling back to the Korean, as the rest of the game's copy does. Only
 * the app build carries them: nothing on the web imports this
 * (src/platform/ads.js is behind `__CP_APP__`). The web sells nothing and says
 * nothing about the app's purchase (memo C-3).
 *
 * `{price}` is the store's own price string (3,300원 / US$2.99, memo C-1).
 */
import ko from "../copy/appStore.js";
import en from "../locales/en/app/appStore.js";
import ja from "../locales/ja/app/appStore.js";

const over = (source, words) => {
  if (Array.isArray(source)) return source.map((line, at) => (typeof words?.[at] === "string" ? words[at] : line));
  if (source && typeof source === "object") return Object.fromEntries(Object.entries(source).map(([key, value]) => [key, over(value, words?.[key])]));
  return typeof words === "string" ? words : source;
};

const COPY = { ko, en: over(ko, en), ja: over(ko, ja) };

/** "en" or "ja" when the page is in that language (src/locale.js sets `<html lang>`), Korean otherwise (the game's own language). */
export function adLanguage(scope = globalThis) {
  try {
    const lang = String(scope?.document?.documentElement?.lang ?? "").toLowerCase();
    return lang.startsWith("en") ? "en" : lang.startsWith("ja") ? "ja" : "ko";
  } catch {
    return "ko";
  }
}

/** The lines in one language. */
export function adCopy(language = "ko") {
  return COPY[language] ?? COPY.ko;
}

/** The buy button with the store's price in it. */
export function buyButtonText(copy, price) {
  return copy.buyButton.replace("{price}", price);
}
