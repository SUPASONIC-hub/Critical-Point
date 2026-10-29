import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";
import { CHARSET_OUTPUT, FONT_OUTPUT, FONT_SOURCE, collectCharset } from "./font-charset.mjs";

/**
 * Cut the app's one font file: Pretendard Variable (OFL-1.1), kept variable
 * from weight 400 to 920, holding only the characters the source can print.
 * See `font-charset.mjs` for what that set is and why.
 *
 * The axis ran the whole face, 45-920, until 2026-10-26 (첫 화면 전송량 줄이기,
 * the user's choice 1). Nothing asks for a weight under 400 -- the stylesheets
 * set 500 to 900, the result card 500 and 800, the speaker portrait's SVG 900,
 * and text that sets none is 400 -- and the thin half of the axis was 73,092
 * bytes of the first paint (270,828 -> 197,736). Cut at 400 the weights in use
 * draw as they did; a weight under 400 asked for later would clamp to 400.
 * `WEIGHT_AXIS` and the `font-weight` range of the @font-face in
 * src/styles/tokens.css are the same two numbers.
 *
 * The character set is written next to the font so `npm run check:fonts` can
 * tell, without opening the font, when the source has gained a character the
 * committed file does not carry. Both files are committed: the deploy runs no
 * font toolchain.
 */

const WEIGHT_AXIS = { min: 400, max: 920 };

const charset = await collectCharset();
const source = readFileSync(FONT_SOURCE);
const woff2 = await subsetFont(source, charset, { targetFormat: "woff2", variationAxes: { wght: WEIGHT_AXIS } });

mkdirSync(path.dirname(FONT_OUTPUT), { recursive: true });
writeFileSync(FONT_OUTPUT, woff2);
// One code point per line keeps the diff of a regeneration readable.
writeFileSync(CHARSET_OUTPUT, `${[...charset].map((c) => `${c.codePointAt(0).toString(16).padStart(4, "0")} ${c}`).join("\n")}\n`, "utf8");

const hangul = [...charset].filter((c) => c >= "가" && c <= "힣").length;
console.log(
  `Wrote ${FONT_OUTPUT}: ${(woff2.length / 1024).toFixed(1)}KB, ${[...charset].length} characters (${hangul} Hangul syllables), weight ${WEIGHT_AXIS.min}-${WEIGHT_AXIS.max}.`,
);
