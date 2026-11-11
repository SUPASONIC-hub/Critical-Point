import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";
import {
  CHARSET_OUTPUT,
  FIRST_CHARSET_OUTPUT,
  FONT_CSS,
  FONT_OUTPUT,
  FONT_SOURCE,
  REST_FONT_OUTPUT,
  collectCharset,
  collectFirstPaintCharset,
  unicodeRange,
} from "./font-charset.mjs";

/**
 * Cut the app's two font files: Pretendard Variable (OFL-1.1), kept variable
 * from weight 400 to 920, holding only the characters the source can print.
 * See `font-charset.mjs` for what that set is and why.
 *
 * The axis ran the whole face, 45-920, until 2026-10-26 (첫 화면 전송량 줄이기,
 * the user's choice 1). Nothing asks for a weight under 400 -- the stylesheets
 * set 500 to 900, the result card 500 and 800, the speaker portrait's SVG 900,
 * and text that sets none is 400 -- and the thin half of the axis was 73,092
 * bytes of the first paint (270,828 -> 197,736). Cut at 400 the weights in use
 * draw as they did; a weight under 400 asked for later would clamp to 400.
 * `WEIGHT_AXIS` and the `font-weight` range of both @font-face rules in
 * src/styles/tokens.css are the same two numbers.
 *
 * One file became two on 2026-11-03 (font-split, the user's choice 1): the
 * first holds what the start screen draws and is preloaded; the second holds
 * the rest of the list and is fetched when a page needs one of its characters.
 * Both are cut from the same face with the same axis, so a syllable looks and
 * measures the same whichever file drew it. The second @font-face's
 * `unicode-range` is written into tokens.css here, between its markers.
 *
 * The character lists are written next to the fonts so `npm run check:fonts`
 * can tell, without opening a font, when the source has gained a character the
 * committed files do not carry. All are committed: the deploy runs no font
 * toolchain.
 */

const WEIGHT_AXIS = { min: 400, max: 920 };
const RANGE_MARKERS = /(\/\* FONT_REST_RANGE start \*\/\s*unicode-range:\s*)[^;]*(;\s*\/\* FONT_REST_RANGE end \*\/)/;

const charset = await collectCharset();
const first = await collectFirstPaintCharset();
const firstSet = new Set(first);
const rest = [...charset].filter((character) => !firstSet.has(character)).join("");
const source = readFileSync(FONT_SOURCE);
const cut = (characters) => subsetFont(source, characters, { targetFormat: "woff2", variationAxes: { wght: WEIGHT_AXIS } });
const firstFont = await cut(first);
const restFont = await cut(rest);

mkdirSync(path.dirname(FONT_OUTPUT), { recursive: true });
writeFileSync(FONT_OUTPUT, firstFont);
writeFileSync(REST_FONT_OUTPUT, restFont);
// One code point per line keeps the diff of a regeneration readable.
const list = (characters) => `${[...characters].map((c) => `${c.codePointAt(0).toString(16).padStart(4, "0")} ${c}`).join("\n")}\n`;
writeFileSync(CHARSET_OUTPUT, list(charset), "utf8");
writeFileSync(FIRST_CHARSET_OUTPUT, list(first), "utf8");

const css = readFileSync(FONT_CSS, "utf8");
if (!RANGE_MARKERS.test(css)) throw new Error(`${FONT_CSS} has no FONT_REST_RANGE markers around the second @font-face's unicode-range.`);
// Through Prettier, so `npm run format:check` passes on the file as written.
const prettier = await import("prettier");
const options = (await prettier.resolveConfig(FONT_CSS)) ?? {};
writeFileSync(FONT_CSS, await prettier.format(css.replace(RANGE_MARKERS, `$1${unicodeRange(rest)}$2`), { ...options, filepath: FONT_CSS }), "utf8");

const hangul = (characters) => [...characters].filter((c) => c >= "가" && c <= "힣").length;
console.log(
  `Wrote ${FONT_OUTPUT}: ${(firstFont.length / 1024).toFixed(1)}KB, ${[...first].length} characters (${hangul(first)} Hangul syllables); ` +
    `${REST_FONT_OUTPUT}: ${(restFont.length / 1024).toFixed(1)}KB, ${[...rest].length} characters (${hangul(rest)} Hangul syllables); weight ${WEIGHT_AXIS.min}-${WEIGHT_AXIS.max}.`,
);
