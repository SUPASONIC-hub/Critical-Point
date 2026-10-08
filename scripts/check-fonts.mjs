import { readFileSync, statSync } from "node:fs";
import { convert } from "fontverter";
import { CHARSET_OUTPUT, FONT_OUTPUT, FONT_SOURCE, collectCharset, collectComputedCharacters, collectSourceCharacters } from "./font-charset.mjs";

/**
 * Fail when the source can print a character the shipped font does not carry.
 *
 * The font is cut from the characters the source uses (`npm run build:fonts`),
 * so a new line of copy with a syllable nothing else used would render that one
 * syllable in the system face. The set the font was cut from is committed next
 * to it, and the source is compared against that.
 *
 * The list is then compared against the font. It used not to be: the check
 * trusted the text file, so a charset regenerated without its font -- or a font
 * restored from an older commit -- passed with every new syllable missing from
 * the file players download. The font's own character map is read instead
 * (`readFontCharacters`), and every character the list claims has to be in it
 * -- every one the face draws at all, that is. The list is the characters the
 * font was asked for, and the always-carried ranges in it (the arrows block,
 * the bidirectional marks) reach past what Pretendard has a glyph for, so the
 * face the subset was cut from is read the same way and decides which of them
 * could have been carried.
 */

// Past this the one-file subset has stopped paying for itself against the
// dynamic subset it replaced (~537KB for the intro alone). Ratchet down, never up.
const MAX_FONT_BYTES = 283_500;

/**
 * Characters the source writes that Pretendard has no glyph for. `drawn` ones
 * reach the screen in the system's face; the others are only ever read by a
 * pattern. A new one fails the check until it is named here, and a name that
 * no longer applies fails it too.
 */
const SYSTEM_FACE_CHARACTERS = {
  "臨": { drawn: true, where: "GameWordmark.jsx: the wordmark's 臨界點" },
  "界": { drawn: true, where: "GameWordmark.jsx: the wordmark's 臨界點" },
  "點": { drawn: true, where: "GameWordmark.jsx: the wordmark's 臨界點" },
  "故": { drawn: true, where: "case17.js: 고(故) 하윤재" },
  "▒": { drawn: true, where: "GauntletHand.jsx: a sealed card's hidden numbers (aria-hidden)" },
  "｡": { drawn: false, where: "useBoard.js: a full stop the board's link filter reads" },
  "‏": { drawn: false, where: "useBoard.js: BOARD_INVISIBLE_PATTERN, the end of a range" },
  "‪": { drawn: false, where: "useBoard.js: BOARD_INVISIBLE_PATTERN, the start of a range" },
  "‮": { drawn: false, where: "useBoard.js: BOARD_INVISIBLE_PATTERN, the end of a range" },
  "⁤": { drawn: false, where: "useBoard.js: BOARD_INVISIBLE_PATTERN, the end of a range" },
};

/**
 * The code points a font maps to a glyph, from its `cmap` table. Formats 4 and
 * 12 are the two a Unicode font carries: 4 for the basic plane, 12 for all of
 * it. The woff2 container is unwrapped to plain sfnt first.
 */
async function readFontCharacters(file) {
  const sfnt = Buffer.from(await convert(readFileSync(file), "truetype"));
  const tableCount = sfnt.readUInt16BE(4);
  let cmap = -1;
  for (let index = 0; index < tableCount; index += 1) {
    const record = 12 + index * 16;
    if (sfnt.toString("latin1", record, record + 4) === "cmap") cmap = sfnt.readUInt32BE(record + 8);
  }
  if (cmap < 0) throw new Error(`${file} has no cmap table`);

  const mapped = new Set();
  const subtableCount = sfnt.readUInt16BE(cmap + 2);
  for (let index = 0; index < subtableCount; index += 1) {
    const record = cmap + 4 + index * 8;
    const platform = sfnt.readUInt16BE(record);
    // Unicode, or Windows with a Unicode encoding.
    if (platform !== 0 && !(platform === 3 && [1, 10].includes(sfnt.readUInt16BE(record + 2)))) continue;
    const table = cmap + sfnt.readUInt32BE(record + 4);
    const format = sfnt.readUInt16BE(table);
    if (format === 12) {
      const groups = sfnt.readUInt32BE(table + 12);
      for (let group = 0; group < groups; group += 1) {
        const at = table + 16 + group * 12;
        const start = sfnt.readUInt32BE(at);
        const end = sfnt.readUInt32BE(at + 4);
        const glyph = sfnt.readUInt32BE(at + 8);
        for (let code = start; code <= end; code += 1) if (glyph + (code - start) !== 0) mapped.add(code);
      }
    } else if (format === 4) {
      const segments = sfnt.readUInt16BE(table + 6) / 2;
      const ends = table + 14;
      const starts = ends + segments * 2 + 2;
      const deltas = starts + segments * 2;
      const offsets = deltas + segments * 2;
      for (let segment = 0; segment < segments; segment += 1) {
        const end = sfnt.readUInt16BE(ends + segment * 2);
        const start = sfnt.readUInt16BE(starts + segment * 2);
        const delta = sfnt.readUInt16BE(deltas + segment * 2);
        const offset = sfnt.readUInt16BE(offsets + segment * 2);
        for (let code = start; code <= end && code !== 0xffff; code += 1) {
          let glyph;
          if (offset === 0) {
            glyph = (code + delta) & 0xffff;
          } else {
            const at = offsets + segment * 2 + offset + (code - start) * 2;
            glyph = sfnt.readUInt16BE(at);
            if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
          }
          if (glyph !== 0) mapped.add(code);
        }
      }
    }
  }
  if (mapped.size === 0) throw new Error(`${file} maps no character this check can read`);
  return mapped;
}

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

const describe = (characters) =>
  characters
    .slice(0, 40)
    .map((c) => `${c} (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`)
    .join(", ") + (characters.length > 40 ? ", ..." : "");

const missing = [...(await collectCharset())].filter((character) => !built.has(character));
const failures = [];
if (missing.length) {
  failures.push(
    `${missing.length} characters the app can print are not in ${FONT_OUTPUT}: ${describe(missing)}\n` +
      "Run `npm run build:fonts` and commit the result.",
  );
}
const computed = await collectComputedCharacters();

let carried = null;
let drawable = null;
try {
  carried = await readFontCharacters(FONT_OUTPUT);
  drawable = await readFontCharacters(FONT_SOURCE);
} catch (error) {
  failures.push(`The font could not be read: ${error instanceof Error ? error.message : String(error)}`);
}
if (carried && drawable) {
  const absent = [...built].filter((character) => drawable.has(character.codePointAt(0)) && !carried.has(character.codePointAt(0)));
  if (absent.length) {
    failures.push(
      `${CHARSET_OUTPUT} lists ${absent.length} characters that ${FONT_OUTPUT} has no glyph for: ${describe(absent)}\n` +
        "The list and the font were not written by the same build. Run `npm run build:fonts` and commit both files.",
    );
  }
}

// What the source writes and the face has no glyph for is drawn by whatever
// the system has. The comparison above lets those through (it has to: nothing
// could have carried them), and until 2026-10-08 it let them through without
// a word, under "none missing". Each one is named here with where it is.
let systemDrawn = [];
if (drawable) {
  const undrawable = [...collectSourceCharacters()].filter((character) => !drawable.has(character.codePointAt(0)));
  const unnamed = undrawable.filter((character) => !(character in SYSTEM_FACE_CHARACTERS));
  if (unnamed.length) {
    failures.push(
      `${unnamed.length} characters in the source have no glyph in Pretendard and will be drawn in the system face: ${describe(unnamed)}\n` +
        "Change the copy, or name each one in SYSTEM_FACE_CHARACTERS (scripts/check-fonts.mjs) with where it is printed.",
    );
  }
  const stale = Object.keys(SYSTEM_FACE_CHARACTERS).filter((character) => !undrawable.includes(character));
  if (stale.length) {
    failures.push(`SYSTEM_FACE_CHARACTERS names characters the source no longer writes, or the face now draws: ${describe(stale)}. Take them off the list.`);
  }
  systemDrawn = undrawable.filter((character) => SYSTEM_FACE_CHARACTERS[character]?.drawn);
}

const bytes = statSync(FONT_OUTPUT).size;
if (bytes > MAX_FONT_BYTES) failures.push(`${FONT_OUTPUT} is ${bytes} bytes, over the ${MAX_FONT_BYTES} byte budget.`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Font check passed: ${built.size} characters in ${(bytes / 1024).toFixed(1)}KB, none missing from the list ` +
      `(${computed.labels} card labels spoken, ${computed.characters.size} characters between them), ` +
      `and the font carries every one Pretendard draws (${carried.size} mapped). ` +
      `${systemDrawn.length} printed characters are the system face's, as listed: ${systemDrawn.join(" ")}.`,
  );
}
