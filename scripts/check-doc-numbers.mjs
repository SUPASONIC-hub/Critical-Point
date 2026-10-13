import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { CASE_SEQUENCE, nodes } from "../src/gameData.js";
import { CASE_PACKS } from "../src/nodes/casePacks.js";
import { FONT_OUTPUT, collectComputedCharacters, readCharsetList } from "./font-charset.mjs";
import { GLOSSARY } from "./plain-language-rules.mjs";

/**
 * Fail when a document quotes a number about the game that the game no longer
 * has.
 *
 * README.md and docs/work-status.md say how many scenes are written, how many
 * cards they deal, how many characters the font carries, how many checks
 * `verify:static` runs and where the coverage floors stand. Every one of those
 * was typed in by hand from a check's output on the day it was written, and no
 * check read it back. On 2026-10-12 the README said the font file held 1,695
 * characters, 1,243 of them Hangul, while the list it was cut from had 1,701
 * and 1,249; it said 90 cards name their own way of thinking while the packs
 * held 95; and the full-coverage workflow budgeted its hours for 4,206
 * scene-choice pairs while the season dealt 4,205. The day before, the README
 * had been brought up to date by reading it against the checks by eye.
 *
 * DOC_NUMBERS is the list. A row is a file, a pattern that finds the sentence
 * and captures the number in it, and a function that computes the number from
 * the source the checks themselves read. A new number is a new row. A pattern
 * is run over the whole file, so a sentence may wrap, and every place it
 * matches has to agree. A pattern that matches nowhere fails too: the sentence
 * was reworded, and the row has to follow it or go.
 *
 * Three counts in these documents are easy to take for each other:
 *   scenes       every scene the season writes (`nodes`)
 *   card labels  every card those scenes deal, 판을 다시 짠다 included -- what
 *                `check:fonts` reports as "card labels spoken"
 *   choices      the same cards without 판을 다시 짠다 -- what `check:balance`
 *                reports, and what no row here quotes
 *
 * Not read: the scenes one play passes ("약 521"), which only the season
 * replay can count, and timings, which are a measurement of one machine on one
 * day.
 */

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");

// --- what the game has ------------------------------------------------------

const charset = [...readCharsetList(root)];
const isHangulSyllable = (character) => character >= "가" && character <= "힣";
const fontBytes = statSync(path.join(root, FONT_OUTPUT)).size;

const scenes = Object.values(nodes);
const { labels: cardLabels } = await collectComputedCharacters();
// The card is `type: "reframe"` wherever the graph, balance and ending checks
// tell it from a written one.
const scenesWithReframe = scenes.filter((scene) => (scene.choices ?? []).some((choice) => choice.type === "reframe")).length;

// The cards `check:graph` holds to one way of thinking at one weight: those of
// the connective and reaction scenes that write `cognition` themselves.
const cardsNamingCognition = CASE_PACKS.flatMap((pack) => [...(pack.connectiveScenes ?? []), ...(pack.reactionScenes ?? [])])
  .flatMap((scene) => scene.choices ?? [])
  .filter((choice) => choice.cognition !== undefined).length;

const floors = JSON.parse(read("scripts/coverage-floors.json")).total;

/**
 * `verify-static.mjs` runs its checks when it is imported, so its list is read
 * as text: the names between the brackets, comments aside. Each has to be a
 * script package.json defines, which is what says the reading found the list.
 */
function staticChecks() {
  const list = read("scripts/verify-static.mjs").match(/export const CHECKS = \[([\s\S]*?)\n\];/)?.[1];
  if (!list) throw new Error("scripts/verify-static.mjs no longer writes `export const CHECKS = [ ... ];`");
  const names = [...list.replace(/^\s*\/\/.*$/gm, "").matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const defined = JSON.parse(read("package.json")).scripts ?? {};
  const unknown = names.filter((name) => !defined[name]);
  if (!names.length || unknown.length) throw new Error(`CHECKS in scripts/verify-static.mjs was read as [${names.join(", ")}], and package.json does not define: ${unknown.join(", ") || "any of it"}`);
  return names.length;
}

const game = {
  fontBytes,
  fontKilobytes: Math.round(fontBytes / 1024),
  fontCharacters: charset.length,
  fontHangul: charset.filter(isHangulSyllable).length,
  scenes: scenes.length,
  cardLabels,
  cases: CASE_SEQUENCE.length,
  glossary: GLOSSARY.length,
  staticChecks: staticChecks(),
  cardsNamingCognition,
};

// --- what the documents say -------------------------------------------------

const N = "(\\d[\\d,]*)";
const said = (source, flags = "") => new RegExp(source.replaceAll("#", N), `gd${flags}`);

/**
 * { file, what, pattern, compute }. `#` in a pattern is a captured number, with
 * or without thousands separators. `compute` returns the number, or one number
 * a capture when the sentence quotes several.
 *
 * A row with `claim` instead of captures is a sentence that is true or not:
 * `compute` returns what was counted and `holds` says whether the sentence
 * stands. With `warning: true` a row is printed and does not fail the check --
 * for a sentence whose rewording is the author's to choose.
 */
export const DOC_NUMBERS = [
  // README.md
  { file: "README.md", what: "static checks", pattern: said("검사 #개(?:를 병렬로|, 병렬)"), compute: () => game.staticChecks },
  { file: "README.md", what: "static checks", pattern: said("\\(`check:doc-numbers`\\) #개 검사"), compute: () => game.staticChecks },
  {
    file: "README.md",
    what: "coverage floors (lines, functions, branches)",
    pattern: said("줄 #%·함수 #%·분기 #%"),
    compute: () => [floors.lines, floors.functions, floors.branches],
  },
  { file: "README.md", what: "glossary terms", pattern: said("용어집 #개"), compute: () => game.glossary },
  { file: "README.md", what: "cases", pattern: said("사건(?: 파일)?(?:\\(`src/nodes/\\*\\.js`)? #개"), compute: () => game.cases },
  { file: "README.md", what: "cases", pattern: said("사건은 6개에서 #개"), compute: () => game.cases },
  { file: "README.md", what: "font file, KB", pattern: said("약 #KB, 글꼴 이름"), compute: () => game.fontKilobytes },
  {
    file: "README.md",
    what: "font file (bytes, characters in its list, Hangul syllables among them)",
    pattern: said("지금 파일은 #바이트\\s+\\(#자, 한글 #자\\)"),
    compute: () => [game.fontBytes, game.fontCharacters, game.fontHangul],
  },
  {
    file: "README.md",
    what: "connective and reaction cards that write their own cognition",
    pattern: said("`cognition`을 직접 적습니다\\(지금 #장\\)"),
    compute: () => game.cardsNamingCognition,
  },
  {
    file: "README.md",
    what: "scenes written, card labels",
    pattern: said("쓰인 장면은 모두 #개, 카드\\s+#장"),
    compute: () => [game.scenes, game.cardLabels],
  },
  {
    file: "README.md",
    what: "scenes written, scenes that deal 판을 다시 짠다",
    pattern: said("쓰인 장면\\s+#개 가운데 #개"),
    compute: () => [game.scenes, scenesWithReframe],
  },

  // docs/work-status.md
  { file: "docs/work-status.md", what: "static checks", pattern: said("# checks(?:, in parallel| run side)"), compute: () => game.staticChecks },
  {
    file: "docs/work-status.md",
    what: "coverage floors (lines, functions, branches)",
    pattern: said("#% of lines, #% of functions and\\s+#% of branches"),
    compute: () => [floors.lines, floors.functions, floors.branches],
  },
  { file: "docs/work-status.md", what: "glossary terms", pattern: said("glossary term \\(#\\)"), compute: () => game.glossary },
  { file: "docs/work-status.md", what: "cases", pattern: said("(?:season is|all|\\d+ of) # cases"), compute: () => game.cases },
  { file: "docs/work-status.md", what: "scenes written", pattern: said("of # written|over all # scenes"), compute: () => game.scenes },

  // .github/workflows/full-coverage.yml: the arithmetic behind its shard count.
  {
    file: ".github/workflows/full-coverage.yml",
    what: "scenes written, card labels",
    // \x23 is the comment mark the sentence wraps over; written bare it would be read as a number.
    pattern: said("season is # scenes and #[\\s\\x23]+scene-choice pairs"),
    compute: () => [game.scenes, game.cardLabels],
  },
  { file: ".github/workflows/full-coverage.yml", what: "card labels", pattern: said("pairs +# x"), compute: () => game.cardLabels },
  { file: ".github/workflows/full-coverage.yml", what: "scenes written", pattern: said("sweep +# x"), compute: () => game.scenes },
  { file: ".github/workflows/full-coverage.yml", what: "cases", pattern: said("# cases x"), compute: () => game.cases },
];

// --- the comparison ---------------------------------------------------------

const texts = new Map();
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const show = (value) => (typeof value === "number" ? value.toLocaleString("en-US") : String(value));

const failures = [];
const warnings = [];
let quoted = 0;

for (const row of DOC_NUMBERS) {
  if (!texts.has(row.file)) texts.set(row.file, read(row.file));
  const text = texts.get(row.file);
  const matches = [...text.matchAll(row.pattern)];
  if (!matches.length) {
    failures.push(`${row.file}: no sentence matches ${row.pattern} (${row.what}). It was reworded or removed: change the row in scripts/check-doc-numbers.mjs to follow it, or take the row out.`);
    continue;
  }
  const report = row.warning ? warnings : failures;

  if (row.claim) {
    quoted += matches.length;
    if (row.holds()) continue;
    for (const match of matches) {
      report.push(`${row.file}:${lineOf(text, match.index)}: says "${match[0]}", computed ${row.compute()} (${row.what})`);
    }
    continue;
  }

  const computed = [row.compute()].flat();
  for (const match of matches) {
    // An alternation leaves the captures of the branch not taken undefined.
    const captures = match.slice(1).map((value, index) => ({ value, at: match.indices[index + 1]?.[0] })).filter((capture) => capture.value !== undefined);
    if (captures.length !== computed.length) {
      failures.push(`${row.file}:${lineOf(text, match.index)}: the pattern for ${row.what} captured ${captures.length} numbers and the row computes ${computed.length}`);
      continue;
    }
    captures.forEach((capture, index) => {
      quoted += 1;
      if (Number(capture.value.replaceAll(",", "")) === computed[index]) return;
      const which = computed.length > 1 ? `, number ${index + 1} of ${row.what}` : `, ${row.what}`;
      report.push(`${row.file}:${lineOf(text, capture.at)}: says ${capture.value}, computed ${show(computed[index])} (${which.slice(2)})`);
    });
  }
}

for (const warning of warnings) console.log(`warning: ${warning}`);
if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} quoted numbers do not match the game. Correct the document, not the row, unless the row counts the wrong thing.`);
  process.exitCode = 1;
} else {
  // A warning is a quoted value that does not match: it is counted apart.
  const matching = quoted - warnings.length;
  console.log(
    `Doc numbers check passed: ${matching} quoted value${matching === 1 ? "" : "s"} in ${texts.size} files match${matching === 1 ? "es" : ""} ` +
      `(${show(game.scenes)} scenes, ${show(game.cardLabels)} card labels, ${game.cases} cases, ${game.glossary} glossary terms, ${game.staticChecks} static checks, ` +
      `floors ${floors.lines}/${floors.functions}/${floors.branches}, font ${show(game.fontBytes)} bytes with ${show(game.fontCharacters)} characters, ${show(game.fontHangul)} of them Hangul, ` +
      `${game.cardsNamingCognition} cards naming their cognition)${warnings.length ? `; ${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : ""}.`,
  );
}
