import { readFileSync, statSync } from "node:fs";
import { CHARSET_OUTPUT, FONT_OUTPUT, collectCharset } from "./font-charset.mjs";

/**
 * Fail when the source can print a character the shipped font does not carry.
 *
 * The font is cut from the characters the source uses (`npm run build:fonts`),
 * so a new line of copy with a syllable nothing else used would render that one
 * syllable in the system face. The set the font was cut from is committed next
 * to it; comparing against that is enough, and needs no font parser.
 */

// Past this the one-file subset has stopped paying for itself against the
// dynamic subset it replaced (~537KB for the intro alone). Ratchet down, never up.
const MAX_FONT_BYTES = 300_000;

let built;
try {
  built = new Set(
    readFileSync(CHARSET_OUTPUT, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => String.fromCodePoint(parseInt(line.slice(0, line.indexOf(" ")), 16))),
  );
} catch {
  console.error(`${CHARSET_OUTPUT} is missing. Run \`npm run build:fonts\`.`);
  process.exit(1);
}

const missing = [...collectCharset()].filter((character) => !built.has(character));
const failures = [];
if (missing.length) {
  const shown = missing
    .slice(0, 40)
    .map((c) => `${c} (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`)
    .join(", ");
  failures.push(
    `${missing.length} characters in the source are not in ${FONT_OUTPUT}: ${shown}${missing.length > 40 ? ", ..." : ""}\n` +
      "Run `npm run build:fonts` and commit the result.",
  );
}

const bytes = statSync(FONT_OUTPUT).size;
if (bytes > MAX_FONT_BYTES) failures.push(`${FONT_OUTPUT} is ${bytes} bytes, over the ${MAX_FONT_BYTES} byte budget.`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Font check passed: ${built.size} characters in ${(bytes / 1024).toFixed(1)}KB, none missing.`);
}
