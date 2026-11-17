import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { caseSource, compareWords, sideSource } from "./locale-words.mjs";
import {
  CASE_DOCS,
  allStrings,
  canonProblems,
  duplicateHeadings,
  findDollar,
  findDuplicateBlocks,
  findLongText,
  findTodo,
  portraitProblems,
  sideNumber,
  speakersOf,
  unnamedSpeakers,
} from "./case-kit.mjs";

/**
 * `npm run check:case -- [ids...] [--docs-only]`: writing-a-case.md's
 * checklist for one case, as warnings (N29, scripts/case-kit.mjs). Without
 * ids it reads every side case the release lists. It never fails: the exit
 * code is 0 whatever it finds, and check:changed runs it after its checks
 * for the case files a branch touched, outside the pass/fail count.
 */
const root = process.cwd();
const argv = process.argv.slice(2);
const docsOnly = argv.includes("--docs-only");
const LANGS = ["en", "ja"];

const read = (file) => {
  try {
    return readFileSync(path.join(root, file), "utf8");
  } catch {
    return null;
  }
};
const load = async (file) => (existsSync(path.join(root, file)) ? import(pathToFileURL(path.join(root, file)).href) : null);

const warnings = [];
const warn = (unit, kind, items) => {
  for (const item of items) warnings.push({ unit, kind, item });
};

async function checkCase(id, runtime) {
  const side = sideNumber(id) !== null;
  let nodes;
  let words;
  let strings;
  let pack = null;
  if (side) {
    pack = (await load(`src/nodes/${id}.js`))?.[id];
    if (!pack) return warn(id, "파일", [`src/nodes/${id}.js 없음 또는 export const ${id} 없음`]);
    nodes = pack.nodes;
    words = sideSource(pack);
    strings = allStrings({ nodes: pack.nodes, outcomes: pack.outcomes });
  } else {
    const data = (await runtime())?.cases?.[id];
    if (!data) return warn(id, "파일", [`시즌에 ${id} 없음`]);
    nodes = data.nodes;
    words = caseSource(await runtime(), id);
    strings = allStrings(words);
  }
  const speakers = speakersOf(nodes);
  const { getSpeakerPortrait } = await import(pathToFileURL(path.join(root, "src/speakerPortraits.js")).href);
  warn(id, "초상", portraitProblems(speakers, { portraitOf: getSpeakerPortrait, fileExists: (src) => existsSync(path.join(root, "public", src)) }));
  warn(id, "$", findDollar(strings).map((entry) => `한국어 ${entry}`));
  warn(id, "길이", findLongText(nodes));
  warn(id, "TODO", findTodo(strings).map((entry) => `한국어 ${entry}`));
  for (const lang of LANGS) {
    const file = `src/locales/${lang}/nodes/${id}.js`;
    const answer = (await load(file))?.default;
    if (!answer) {
      warn(id, `${lang} 키`, [`${file} 없음`]);
      continue;
    }
    const compared = compareWords(words, answer, lang);
    warn(id, `${lang} 키`, compared.missing.map((entry) => `빠짐 ${entry}`));
    warn(id, `${lang} 키`, compared.stale.map((entry) => `원문에 없음 ${entry}`));
    const answered = allStrings(answer);
    warn(id, "$", findDollar(answered).map((entry) => `${lang} ${entry}`));
    warn(id, "TODO", findTodo(answered).map((entry) => `${lang} ${entry}`));
    const dictionary = await load(`src/locales/${lang}/index.js`);
    warn(id, `${lang} 이름`, unnamedSpeakers(speakers, dictionary?.speakers).map((name) => `speakers에 「${name}」 없음`));
  }
  if (side) warn(id, "canon", canonProblems({ id, pack, canon: read("docs/canon.md") ?? "" }));
}

let runtimeData = null;
const runtime = async () => {
  if (!runtimeData) {
    const { buildRuntimeData, loadSeasonTables } = await import("./season-split.mjs");
    runtimeData = buildRuntimeData(await loadSeasonTables());
  }
  return runtimeData;
};

let ids = argv.filter((arg) => !arg.startsWith("--"));
if (!ids.length && !docsOnly) {
  const { SIDE_CASES } = await import(pathToFileURL(path.join(root, "src/nodes/sidePacks.js")).href);
  ids = SIDE_CASES.map((entry) => entry.id);
}
if (!docsOnly) {
  for (const id of ids) {
    try {
      await checkCase(id, runtime);
    } catch (error) {
      warn(id, "읽기", [String(error?.message ?? error).split("\n")[0]]);
    }
  }
}
for (const doc of CASE_DOCS) {
  const text = read(doc);
  if (text === null) continue;
  const blocks = findDuplicateBlocks(text);
  warn(doc, "중복", blocks.map(({ from, to, firstAt, lines }) => `줄 ${from}~${to}(${lines}줄)이 줄 ${firstAt}부터와 같음`));
  // A heading inside a block already reported is that block, not a second finding.
  const inBlock = (line) => blocks.some(({ from, to }) => line >= from && line <= to);
  const headings = duplicateHeadings(text).filter(({ at }) => !at.slice(1).every(inBlock));
  warn(doc, "중복", headings.map(({ heading, at }) => `같은 제목 ${heading} (줄 ${at.join(", ")})`));
}
const credits = read("docs/portrait-credits.md") ?? "";
warn("docs/portrait-credits.md", "TODO", credits.split(/\r?\n/).filter((line) => line.startsWith("|") && /\bTODO\b/.test(line)).map((line) => line.slice(0, 60)));

const units = [...new Set(warnings.map((entry) => entry.unit))];
console.log(`check:case (경고만, 실패하지 않음): ${ids.length ? ids.join(", ") : "문서만"} — 경고 ${warnings.length}개`);
for (const unit of units) {
  const mine = warnings.filter((entry) => entry.unit === unit);
  console.log(`  ${unit} (${mine.length})`);
  const kinds = [...new Set(mine.map((entry) => entry.kind))];
  for (const kind of kinds) {
    const items = mine.filter((entry) => entry.kind === kind).map((entry) => entry.item);
    const shown = items.slice(0, 8);
    console.log(`    [${kind}] ${shown.join(" / ")}${items.length > shown.length ? ` / … +${items.length - shown.length}` : ""}`);
  }
}
process.exitCode = 0;
