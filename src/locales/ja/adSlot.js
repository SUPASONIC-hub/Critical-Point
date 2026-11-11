/**
 * The words of the ad box in Japanese (src/ads/adSlotWords.js, web ads, off by
 * default). Not in the dictionary (src/locales/ja/screens/index.js): only a
 * build with ADSENSE_ADS=on imports the box. Here and not beside the Korean so
 * the font is not cut from it: a Japanese page is drawn in the system face
 * (scripts/font-charset.mjs).
 */
export default {
  label: "広告",
  note: "広告 · スコアと順位には影響しません",
};
