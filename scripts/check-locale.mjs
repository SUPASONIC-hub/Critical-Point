import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildRuntimeData, loadSeasonTables } from "./season-split.mjs";
import { caseSource, compareWords, readCopySource, readLanguageCopy, TRANSLATION_SCOPE } from "./locale-words.mjs";
import { SOURCE_LOCALE, SUPPORTED_LOCALES } from "../src/locale.js";
import { CASE_SEQUENCE } from "../src/gameCases.js";

/**
 * `npm run check:locale [-- --lang=<code>]`: how much of a language is still
 * Korean (다국어 틀; 영어판 1단계, 2026-10-26). Without `--lang`, every
 * language in `SUPPORTED_LOCALES` but Korean.
 *
 * For each case in scope (up to the language's `previewThrough` in its
 * dictionary, else `TRANSLATION_SCOPE`, and any other case the language has
 * a file for) and for the screen copy, it reads the Korean the
 * app is shipped (scripts/locale-words.mjs) and the language's file beside
 * it (src/locales/<lang>/nodes/<caseId>.js, src/locales/<lang>/index.js), and
 * counts:
 *
 *   missing  a Korean string with no translation -- the page shows the Korean
 *            (the fallback), so this is a gap, not a break;
 *   stale    a translation whose Korean path is gone -- a scene or card
 *            renamed or removed; the page never shows it;
 *   numbers  a translation missing a digit its Korean has (G-1 2: canon
 *            numbers are never changed). For English, money is compared in
 *            English units (310억 -> 31 billion) and months as words; Japanese
 *            keeps the Korean's figures (310억 -> 310億).
 *
 * A warning, not a failure, while the words are drafts: it prints the counts
 * and exits 0. `--strict` fails on any missing or stale string (for a public
 * release of the language), `--list` prints every path.
 */
const root = process.cwd();
const argv = process.argv.slice(2);
const strict = argv.includes("--strict");
const list = argv.includes("--list");
const asked = argv.find((arg) => arg.startsWith("--lang="))?.slice(7);
const codes = SUPPORTED_LOCALES.map((locale) => locale.code);
const languages = asked ? [asked] : codes.filter((code) => code !== SOURCE_LOCALE);

if (asked && (!codes.includes(asked) || asked === SOURCE_LOCALE)) {
  console.error(`check:locale: "${asked}" is not a language to check. SUPPORTED_LOCALES (src/locale.js) is ${codes.join(", ")}, and ${SOURCE_LOCALE} is the source.`);
  process.exit(1);
}

const runtimeData = buildRuntimeData(await loadSeasonTables());

async function wordsOf(file, name) {
  const full = path.join(root, file);
  if (!existsSync(full)) return null;
  const module = await import(pathToFileURL(full).href);
  return module[name] ?? null;
}

let failed = false;
for (const lang of languages) {
  // The preview's cases (the dictionary's `previewThrough`, the line that widens it), and its screen copy up to there.
  const through = await wordsOf(`src/locales/${lang}/index.js`, "previewThrough");
  const scope = through ? CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(through) + 1) : TRANSLATION_SCOPE;
  const copySource = await readCopySource(pathToFileURL(root).href, scope);
  const nodesDir = path.join(root, "src/locales", lang, "nodes");
  const extra = existsSync(nodesDir) ? readdirSync(nodesDir).map((file) => file.replace(/\.js$/, "")).filter((caseId) => !scope.includes(caseId)) : [];
  const rows = [];
  for (const caseId of [...scope, ...extra]) {
    const file = `src/locales/${lang}/nodes/${caseId}.js`;
    if (!runtimeData.cases[caseId]) {
      rows.push({ unit: caseId, total: 0, missing: [], stale: [`${file}: no such case`], numbers: [] });
      continue;
    }
    rows.push({ unit: caseId, ...compareWords(caseSource(runtimeData, caseId), await wordsOf(file, "default"), lang) });
  }
  // The copy between cases for the cases after the preview waits in
  // src/locales/<lang>/between/ (src/locales/overlay.js fetches a file once
  // `previewThrough` reaches it): held, not stale.
  const copyRow = compareWords(copySource, await readLanguageCopy(pathToFileURL(root).href, lang), lang);
  const heldPath = (entry) => entry.split(/[.[]/).some((part) => CASE_SEQUENCE.includes(part) && !scope.includes(part));
  const held = copyRow.stale.filter(heldPath);
  rows.push({ unit: "screen copy", ...copyRow, stale: copyRow.stale.filter((entry) => !heldPath(entry)) });

  let missing = 0;
  let stale = 0;
  let numbers = 0;
  let total = 0;
  console.log(`[${lang}]`);
  for (const row of rows) {
    total += row.total;
    missing += row.missing.length;
    stale += row.stale.length;
    numbers += row.numbers.length;
    const done = row.total ? Math.round(((row.total - row.missing.length) / row.total) * 1000) / 10 : 100;
    console.log(`  ${row.unit.padEnd(12)} ${String(row.total - row.missing.length).padStart(4)}/${String(row.total).padEnd(4)} ${String(done).padStart(5)}%  missing ${row.missing.length}, stale ${row.stale.length}, numbers ${row.numbers.length}`);
    if (list) {
      for (const [name, paths] of [["missing", row.missing], ["stale", row.stale], ["numbers", row.numbers]]) {
        for (const entry of paths) console.log(`    ${name}: ${entry}`);
      }
    }
  }
  console.log(`[${lang}] ${total - missing}/${total} strings translated; ${missing} fall back to Korean, ${stale} stale, ${numbers} number warnings.`);
  if (held.length) console.log(`[${lang}] ${held.length} strings of copy between cases wait for cases after ${through} (shown once \`previewThrough\` reaches them).`);
  if (strict && (missing || stale)) failed = true;
}
if (failed) {
  console.error("check:locale --strict: every string in scope needs a translation and none may outlive its Korean.");
  process.exitCode = 1;
}
