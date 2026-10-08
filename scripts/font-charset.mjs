import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * The characters the app's own text can put on screen, shared by
 * `build-fonts.mjs` (which cuts the font from them) and `check-fonts.mjs`
 * (which fails when the source has gained one the font does not carry).
 *
 * The app used to import Pretendard's dynamic subset: 92 woff2 files, 3.1MB,
 * split by Unicode block rather than by what the game says. A season touched 66
 * of them (~2.1MB) and the intro alone ~537KB, while the whole game's copy uses
 * about 1,200 distinct Hangul syllables. One file cut from exactly those is a
 * fraction of the weight and one request.
 *
 * Text a player types (a nickname, a board post) can hold syllables the copy
 * never uses. Those fall through to the next family in `--font-sans`, the
 * system's Hangul face, which is the same fallback the dynamic subset had while
 * a subset was still downloading.
 */

export const FONT_SOURCE = "node_modules/pretendard/dist/public/variable/PretendardVariable.ttf";
export const FONT_OUTPUT = "src/assets/fonts/pretendard-cp.woff2";
export const CHARSET_OUTPUT = "src/assets/fonts/pretendard-cp.charset.txt";

const SOURCE_ROOTS = ["src"];
const SOURCE_FILES = ["index.html"];
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".css", ".html"]);

function range(from, to) {
  let text = "";
  for (let code = from; code <= to; code += 1) text += String.fromCodePoint(code);
  return text;
}

/**
 * Always carried, whatever the source says today: printable ASCII (a nickname
 * or a number can use any of it), the Latin-1 punctuation, the general
 * punctuation block, arrows, and the Hangul compatibility jamo an IME shows
 * while a syllable is still being composed in the name field.
 */
export const BASELINE_CHARACTERS =
  range(0x20, 0x7e) +
  range(0xa0, 0xbf) +
  "×÷" +
  range(0x2010, 0x2027) +
  range(0x2030, 0x205e) +
  range(0x2190, 0x21ff) +
  range(0x3131, 0x318e) +
  "·…–—‘’“”「」『』《》〈〉【】〔〕※○●◎◇◆□■△▲▽▼→←↑↓☆★♥✓✔✕✗";

function visit(directory, files) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(fullPath, files);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && !entry.name.endsWith(".generated.css")) {
      files.push(fullPath);
    }
  }
}

/** Characters written as escapes (`"·"` in JS, `"\2192"` in CSS) count too. */
function decodeEscapes(text) {
  const out = [];
  for (const match of text.matchAll(/\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})/g)) {
    out.push(String.fromCodePoint(parseInt(match[1] ?? match[2], 16)));
  }
  return out.join("");
}

function decodeCssEscapes(text) {
  const out = [];
  for (const match of text.matchAll(/content\s*:\s*(["'])((?:\\.|(?!\1).)*)\1/g)) {
    for (const escape of match[2].matchAll(/\\([0-9a-fA-F]{1,6})\s?/g)) {
      out.push(String.fromCodePoint(parseInt(escape[1], 16)));
    }
  }
  return out.join("");
}

/**
 * The characters the source itself writes, without the always-carried ranges:
 * what `check-fonts.mjs` asks about when it wants to know which of them the
 * face cannot draw.
 */
export function collectSourceCharacters(root = process.cwd()) {
  const files = SOURCE_FILES.map((file) => path.join(root, file));
  for (const directory of SOURCE_ROOTS) visit(path.join(root, directory), files);

  const characters = new Set();
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const decoded = text + decodeEscapes(text) + (file.endsWith(".css") ? decodeCssEscapes(text) : "");
    for (const character of decoded) {
      const code = character.codePointAt(0);
      // Controls, whitespace other than the space, and private-use code points
      // are never drawn from the font.
      if (code < 0x20 || (code >= 0x7f && code < 0xa0) || (code >= 0xe000 && code <= 0xf8ff)) continue;
      if (code === 0xfeff || (code >= 0xfe00 && code <= 0xfe0f)) continue;
      characters.add(character);
    }
  }
  return characters;
}

/**
 * The characters the app makes rather than writes. A card's label is said back
 * in the first person (`speechifyChoice`), and for a label ending on a vowel
 * stem that takes the ㄴ off its last syllable by arithmetic: 미룬다 is spoken
 * as 미루겠습니다, and 루 need not be written anywhere in the source. Reading the
 * files alone, such a syllable was outside the list and outside this check.
 * Every label the season has is spoken here and what comes out is counted.
 */
export async function collectComputedCharacters() {
  const { speechifyChoice } = await import("../src/gameLogic.js");
  const { nodes } = await import("../src/gameData.js");
  const characters = new Set();
  let labels = 0;
  for (const node of Object.values(nodes)) {
    for (const choice of node.choices ?? []) {
      labels += 1;
      for (const character of speechifyChoice(choice)) characters.add(character);
    }
  }
  if (labels === 0) throw new Error("The scene graph has no card to speak; the computed characters were not measured.");
  return { characters, labels };
}

/** A sorted string of every code point the font should carry. */
export async function collectCharset(root = process.cwd()) {
  const { characters: computed } = await collectComputedCharacters();
  const characters = new Set([...BASELINE_CHARACTERS, ...collectSourceCharacters(root), ...computed]);
  return [...characters].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");
}
