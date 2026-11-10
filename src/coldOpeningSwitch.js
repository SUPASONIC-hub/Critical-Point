/**
 * B-3(1) 냉정한 오프닝의 스위치, the one line the funnel decision flips (state/coldOpening.js
 * says what it turns on). A file with no imports, because the bundler reads it
 * too: vite.config.js writes it into the build as `__CP_COLD_OPENING__`, so a
 * build with the switch off folds IntroScreen's branch away -- the page's chunk,
 * its words and the code that loads them are not in it.
 */
export const COLD_OPENING_ENABLED = false;
