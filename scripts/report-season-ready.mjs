import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSeasonReadyRows, formatSeasonReady, sideFileId } from "./season-ready.mjs";

/**
 * `npm run report:season-ready`: the Season 준비표 (N47, owner's answer Q12
 * (1), 2026-11-18). Read-only -- it writes nothing and its exit code is 0
 * whatever it finds. The rules and the table are scripts/season-ready.mjs;
 * this gathers the facts:
 *
 *   - every side case file in src/nodes/ (side00, the placeholder, left out)
 *     and whether a release lists it (SIDE_CASES, src/nodes/sidePacks.js);
 *   - check:case's warnings for each (`check-case.mjs --json`): portraits,
 *     en/ja keys and names, `$`, long text, TODO, canon;
 *   - whether an e2e spec under tests/ names it;
 *   - a season case file (caseNN, prologueNN) that CASE_SEQUENCE does not
 *     list yet, which would be new season content rather than a side case.
 */
const root = process.cwd();
const nodesDir = path.join(root, "src/nodes");
const files = readdirSync(nodesDir);
const ids = files.map(sideFileId).filter(Boolean);

const { SIDE_CASES } = await import(pathToFileURL(path.join(nodesDir, "sidePacks.js")).href);
// A side case a release carries ahead of its Season (`opensAt`, NEXT_SEASON in
// sidePacks.js) is not open yet, so it counts as 대기 until that moment on the
// device clock: the table is the reason for that day, not a record of what
// shipped. `--at=<ISO time>` reads another moment.
const atArg = process.argv.find((arg) => arg.startsWith("--at="));
const now = atArg ? Date.parse(atArg.slice(5)) : Date.now();
const listed = SIDE_CASES.filter((entry) => !entry.fixture && !(Number.isFinite(entry.opensAt) && entry.opensAt > now)).map((entry) => entry.id);
const titles = {};
for (const id of ids) {
  const fromList = SIDE_CASES.find((entry) => entry.id === id)?.title;
  if (fromList) {
    titles[id] = fromList;
    continue;
  }
  try {
    const pack = (await import(pathToFileURL(path.join(nodesDir, `${id}.js`)).href))[id];
    titles[id] = pack?.title ?? "";
  } catch {
    titles[id] = "";
  }
}

const checked = spawnSync(process.execPath, ["scripts/check-case.mjs", "--json", ...ids], { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
let warnings = [];
try {
  warnings = JSON.parse(checked.stdout).warnings;
} catch {
  console.log(`check:case를 읽지 못했습니다: ${(checked.stderr || checked.stdout || "").split("\n")[0]}`);
}

function specFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return specFiles(full);
    return entry.name.endsWith(".spec.js") ? [full] : [];
  });
}
const specText = specFiles(path.join(root, "tests")).map((file) => readFileSync(file, "utf8")).join("\n");
const specs = ids.filter((id) => new RegExp(`\\b${id}\\b`).test(specText));

const rows = buildSeasonReadyRows({ ids, titles, listed, warnings, specs });
const docWarnings = warnings.filter((entry) => !ids.includes(entry.unit)).length;
console.log(formatSeasonReady(rows, { docWarnings }));

const { CASE_SEQUENCE } = await import(pathToFileURL(path.join(root, "src/gameCases.js")).href);
const unlisted = files
  .map((file) => /^((?:case|prologue)\d{2})\.js$/.exec(file)?.[1])
  .filter((id) => id && !CASE_SEQUENCE.includes(id));
console.log(unlisted.length ? `시즌 목록(CASE_SEQUENCE) 밖 사건 파일: ${unlisted.join(", ")}` : "시즌 목록(CASE_SEQUENCE) 밖 사건 파일: 없음");
process.exitCode = 0;
