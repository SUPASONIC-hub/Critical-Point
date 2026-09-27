import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";
import { CHARSET_OUTPUT, FONT_OUTPUT, FONT_SOURCE, collectCharset } from "./font-charset.mjs";

/**
 * Cut the app's one font file: Pretendard Variable (OFL-1.1), kept variable
 * across its whole weight axis (45-920), holding only the characters the
 * source can print. See `font-charset.mjs` for what that set is and why.
 *
 * The character set is written next to the font so `npm run check:fonts` can
 * tell, without opening the font, when the source has gained a character the
 * committed file does not carry. Both files are committed: the deploy runs no
 * font toolchain.
 */

const charset = collectCharset();
const source = readFileSync(FONT_SOURCE);
const woff2 = await subsetFont(source, charset, { targetFormat: "woff2" });

mkdirSync(path.dirname(FONT_OUTPUT), { recursive: true });
writeFileSync(FONT_OUTPUT, woff2);
// One code point per line keeps the diff of a regeneration readable.
writeFileSync(CHARSET_OUTPUT, `${[...charset].map((c) => `${c.codePointAt(0).toString(16).padStart(4, "0")} ${c}`).join("\n")}\n`, "utf8");

const hangul = [...charset].filter((c) => c >= "가" && c <= "힣").length;
console.log(
  `Wrote ${FONT_OUTPUT}: ${(woff2.length / 1024).toFixed(1)}KB, ${[...charset].length} characters (${hangul} Hangul syllables).`,
);
