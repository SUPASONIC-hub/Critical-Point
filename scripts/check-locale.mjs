import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildRuntimeData, loadSeasonTables } from "./season-split.mjs";
import { caseSource, compareWords, readCopySource, TRANSLATION_SCOPE } from "./locale-words.mjs";
import { SOURCE_LOCALE, SUPPORTED_LOCALES } from "../src/locale.js";

/**
 * `npm run check:locale [-- --lang=<code>]`: how much of a language is still
 * Korean (다국어 틀; 영어판 1단계, 2026-10-26). Without `--lang`, every
 * language in `SUPPORTED_LOCALES` but Korean.
 *
 * For each case in scope (`TRANSLATION_SCOPE`, and any other case the
 * language has a file for) and for the screen copy, it reads the Korean the
 * app is shipped (scripts/locale-words.mjs) and the language's file beside
 * it (src/locales/<lang>/nodes/<caseId>.js, src/locales/<lang>/index.js), and
 * counts:
 *
 *   missing  a Korean string with no translation -- the page shows the Korean
 *            (the fallback), so this is a gap, not a break;
 *   stale    a translation whose Korean path is gone -- a scene or card
 *            renamed or removed; the page never shows it;
 *   numbers  a translation missing a digit its Korean has (G-1 2: canon
 *            numbers are never changed). Money is compared in English units
 *            (310억 -> 31 billion), and months as words.
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
const languages = asked ? [asked] : SUPPORTED_LOCALES.filter((code) => code !== SOURCE_LOCALE);

if (asked && (!SUPPORTED_LOCALES.includes(asked) || asked === SOURCE_LOCALE)) {
  console.error(`check:locale: "${asked}" is not a language to check. SUPPORTED_LOCALES (src/locale.js) is ${SUPPORTED_LOCALES.join(", ")}, and ${SOURCE_LOCALE} is the source.`);
  process.exit(1);
}

const runtimeData = buildRuntimeData(await loadSeasonTables());
const copySource = await readCopySource(pathToFileURL(root).href);

async function wordsOf(file, name) {
  const full = path.join(root, file);
  if (!existsSync(full)) return null;
  const module = await import(pathToFileURL(full).href);
  return module[name] ?? null;
}

let failed = false;
for (const lang of languages) {
  const nodesDir = path.join(root, "src/locales", lang, "nodes");
  const extra = existsSync(nodesDir) ? readdirSync(nodesDir).map((file) => file.replace(/\.js$/, "")).filter((caseId) => !TRANSLATION_SCOPE.includes(caseId)) : [];
  const rows = [];
  for (const caseId of [...TRANSLATION_SCOPE, ...extra]) {
    const file = `src/locales/${lang}/nodes/${caseId}.js`;
    if (!runtimeData.cases[caseId]) {
      rows.push({ unit: caseId, total: 0, missing: [], stale: [`${file}: no such case`], numbers: [] });
      continue;
    }
    rows.push({ unit: caseId, ...compareWords(caseSource(runtimeData, caseId), await wordsOf(file, "default")) });
  }
  rows.push({ unit: "screen copy", ...compareWords(copySource, await wordsOf(`src/locales/${lang}/index.js`, "copy")) });

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
  if (strict && (missing || stale)) failed = true;
}
if (failed) {
  console.error("check:locale --strict: every string in scope needs a translation and none may outlive its Korean.");
  process.exitCode = 1;
}
