import { appliedLocale } from "../locale.js";

/**
 * The ad box's words (src/ads/AdSlot.jsx, web ads, off by default) in the
 * three languages, picked by the language the page was painted in.
 *
 * Kept here and not in src/copy/ with a dictionary entry per language: only a
 * build with ADSENSE_ADS=on and a unit for a placement imports the box, and so
 * this table, while a dictionary entry would ride in every build's English and
 * Japanese dictionary. A build without ads stays byte for byte main's.
 */
export const AD_SLOT_WORDS = {
  ko: { label: "광고", note: "광고 · 점수와 순위에는 영향이 없습니다" },
  en: { label: "Advertisement", note: "Ad · Does not affect your score or ranking" },
  ja: { label: "広告", note: "広告 · スコアと順位には影響しません" },
};

/** The box's words in the page's language, Korean when its dictionary never came. */
export function adSlotWords(locale = appliedLocale()) {
  return AD_SLOT_WORDS[locale] || AD_SLOT_WORDS.ko;
}
