import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sideSource } from "./locale-words.mjs";
import {
  addCanonSection,
  addLocaleSideTitle,
  addPortraitCreditRow,
  addSideListing,
  localeStubSource,
  needsCoverageFloor,
  nextSideId,
  sideNumber,
  sidePackSource,
} from "./case-kit.mjs";

/**
 * `npm run new:case -- [sideNN] "제목" [--en=Title] [--ja=タイトル] [--dry-run]`:
 * a new side case's skeleton (N29, scripts/case-kit.mjs). Without an id it
 * takes the next number after the side files on this branch -- an open side
 * case PR's number is not seen, so name it when one is open.
 *
 * Writes src/nodes/sideNN.js, src/locales/{en,ja}/nodes/sideNN.js, and adds
 * a line to src/nodes/sidePacks.js, the label and title to both
 * dictionaries, a canon section and a portrait-credits row. Every string it
 * writes is TODO; `npm run check:case -- sideNN` lists what is left.
 * Refuses an id whose file exists. A season case (caseNN) is writing-a-case.md
 * 6장, not a skeleton.
 */
const root = process.cwd();
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const option = (name) => argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const plain = argv.filter((arg) => !arg.startsWith("--"));
const sideFiles = readdirSync(path.join(root, "src/nodes")).map((file) => file.replace(/\.js$/, "")).filter((name) => sideNumber(name) !== null);
const id = sideNumber(plain[0]) !== null ? plain.shift() : nextSideId(sideFiles);
const title = plain.join(" ").trim();

if (/^(case|prologue)\d{2}$/.test(id) || /^(case|prologue)\d{2}$/.test(plain[0] ?? "")) {
  console.error("new:case makes side cases only. A season case goes on the season by docs/writing-a-case.md 6장 (gameCases.js, the server's case list).");
  process.exit(1);
}
if (!title) {
  console.error('Usage: npm run new:case -- [sideNN] "제목" [--en=Title] [--ja=タイトル] [--dry-run]');
  process.exit(1);
}
if (existsSync(path.join(root, `src/nodes/${id}.js`))) {
  console.error(`src/nodes/${id}.js exists already. Name another id.`);
  process.exit(1);
}

const n = sideNumber(id);
const pack = sidePackSource({ id, title });
// The words of the pack just written, the shape the en/ja files answer: the
// pack has no imports, so it is read from a data URL, never from disk.
const words = sideSource((await import(`data:text/javascript;base64,${Buffer.from(pack).toString("base64")}`))[id]);

const edits = [
  [`src/nodes/${id}.js`, () => pack],
  [`src/locales/en/nodes/${id}.js`, () => localeStubSource({ id, lang: "en", words })],
  [`src/locales/ja/nodes/${id}.js`, () => localeStubSource({ id, lang: "ja", words })],
  ["src/nodes/sidePacks.js", (source) => addSideListing(source, { id, title })],
  ["src/locales/en/index.js", (source) => addLocaleSideTitle(source, { id, label: `Side case ${n}`, title: option("en") ?? "TODO(en)" })],
  ["src/locales/ja/index.js", (source) => addLocaleSideTitle(source, { id, label: `番外${n}`, title: option("ja") ?? "TODO(ja)" })],
  ["docs/canon.md", (source) => addCanonSection(source, { id, title })],
  ["docs/portrait-credits.md", (source) => addPortraitCreditRow(source, { id })],
];

const results = edits.map(([file, make]) => {
  const full = path.join(root, file);
  const before = existsSync(full) ? readFileSync(full, "utf8") : null;
  return [file, before, make(before ?? "")];
});
for (const [file, before, after] of results) {
  console.log(`${dryRun ? "would " : ""}${before === null ? "write " : "edit  "} ${file}`);
  if (!dryRun) writeFileSync(path.join(root, file), after);
}
const floors = results.map(([file]) => file).filter(needsCoverageFloor);
console.log(floors.length ? `coverage floor needed: ${floors.join(", ")} (scripts/coverage-floors.json)` : "coverage floor: none needed (scenes and words are data modules, scripts/check-coverage.mjs).");
console.log(`\nNext: write the scenes (8 to 12, docs/writing-a-case.md 6-1), a portrait for each new speaker (13장), then \`npm run check:case -- ${id}\`.`);
