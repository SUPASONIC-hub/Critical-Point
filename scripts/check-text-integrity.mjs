import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["src"];
const sourceExtensions = new Set([".js", ".jsx"]);
const files = [];
const failures = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(fullPath);
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
}

for (const sourceRoot of sourceRoots) visit(path.join(root, sourceRoot));

function collectStrings(text) {
  const strings = [];
  const pattern = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let match;
  while ((match = pattern.exec(text))) {
    strings.push({ value: match[2], index: match.index });
  }
  return strings;
}

function lineNumberFor(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function looksLikeMojibake(value) {
  if (value.includes("\uFFFD")) return true;
  const cjkCount = (value.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const hangulCount = (value.match(/[가-힣]/g) ?? []).length;
  const suspectFragments = (value.match(/[?][\u3130-\u318f\uac00-\ud7af]|[\u3130-\u318f][?]|[쨌]/g) ?? []).length;
  return value.length >= 8 && hangulCount > 0 && (cjkCount >= 3 || suspectFragments >= 2);
}

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const candidate of collectStrings(text)) {
    if (!looksLikeMojibake(candidate.value)) continue;
    failures.push(`${path.relative(root, file)}:${lineNumberFor(text, candidate.index)} contains suspicious mojibake text`);
  }
}

/**
 * Rule 10: a particle after an interpolation has to agree with whatever is
 * interpolated, so it is never written into the template. "사람 피해 ${n}를"
 * reads 사람 피해 7를 the day n is 7, and "${label}이(가)" gives up and prints
 * both. The helpers in playerLanguage.js choose one; this catches a template
 * that skipped them. Particles that never change -- 의, 에, 에서, 까지, 만큼 --
 * are fine after anything.
 */
const BAKED_PARTICLE = /\}(을|를|이|가|은|는|으로|로|과|와)(?=[\s.,!?'"”’)]|$)|\S\((을|를|이|가|은|는|으|과|와)\)/u;
// Four files were exempt until 2026-09-27, when the last of them was fixed; the
// rule holds for every source file now, and none goes back on a list.
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const candidate of collectStrings(text)) {
    // One-line templates only: the string collector also pairs backticks across
    // comments, which spans lines and is not a string at all.
    if (candidate.value.includes("\n") ||!/[가-힣]/.test(candidate.value) || !candidate.value.includes("${") || !BAKED_PARTICLE.test(candidate.value)) continue;
    failures.push(`${path.relative(root, file)}:${lineNumberFor(text, candidate.index)} bakes a Korean particle after an interpolation; use playerLanguage.js`);
  }
  // The collector splits a template nested in another at the inner backtick,
  // so ranking.js's "${a ? b : `${c} (${d})`}이(가)" slipped past it. Read the
  // code lines themselves too; comments may quote the pattern.
  text.split("\n").forEach((line, index) => {
    const code = line.trim();
    if (code.startsWith("//") || code.startsWith("*") || !line.includes("${") || !/[가-힣]/.test(line) || !BAKED_PARTICLE.test(line)) return;
    failures.push(`${path.relative(root, file)}:${index + 1} bakes a Korean particle after an interpolation; use playerLanguage.js`);
  });
}

/**
 * The same rule for the names the copy writes out by hand.
 *
 * A particle agrees with the last sound of the name before it, and a rename
 * changes that sound without touching the particle: 진태윤 took over a name
 * that ended on a vowel and kept its 가 and 는 in six places, and nothing here
 * looked, because the check above only reads what follows an interpolation.
 * So every name the season declares -- everyone with a character profile, the
 * people the copy names who never speak, and the organisations -- is read
 * wherever it is written, and the particle after it has to be the one its last
 * syllable takes (로 after a vowel or ㄹ, 으로 after any other consonant).
 */
const { characterProfiles } = await import("../src/gameDialogue.js");
const NAMED_WITHOUT_PROFILE = ["권승우", "서태경", "하윤재", "하윤호", "장현규", "송미란", "윤다온", "한미경", "채윤아"];
const ORGANISATIONS = [
  "KD은행", "KD금융그룹", "KD캐피탈", "KD데이터랩", "KD생명", "KD자산운용", "트리거랩", "플로우온", "넥스트마일", "노바웍스",
  "브릿지은행", "온새", "해온파트너스", "리드라인", "클리어보트", "핏스코어", "끝까지정밀", "가온정밀", "새봄신협", "루프나우",
  "라운드힐", "세온메디칼", "물결스테이", "라온방송", "가을떡방", "금융감독원",
];
const declaredNames = [...new Set([...Object.keys(characterProfiles), ...NAMED_WITHOUT_PROFILE, ...ORGANISATIONS])];
const allSource = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
for (const name of [...NAMED_WITHOUT_PROFILE, ...ORGANISATIONS]) {
  if (!allSource.includes(name)) failures.push(`check-text-integrity lists the name ${name}, which the source no longer writes`);
}

function wrongParticlesAfter(name) {
  const jong = (name.charCodeAt(name.length - 1) - 0xac00) % 28;
  if (jong === 0) return ["이", "은", "을", "과", "으로"];
  return ["가", "는", "를", "와", jong === 8 ? "으로" : "로"];
}
const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const nameRules = declaredNames
  .filter((name) => /[가-힣]$/.test(name))
  .map((name) => ({
    name,
    pattern: new RegExp(`(?<![가-힣])${escapeForRegex(name)}(${wrongParticlesAfter(name).join("|")})(?=[\\s.,!?'"“”‘’)\`…]|$)`, "u"),
  }));

let namesRead = 0;
for (const file of files) {
  fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
    const code = line.trim();
    if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*") || !/[가-힣]/.test(line)) return;
    for (const { name, pattern } of nameRules) {
      if (!line.includes(name)) continue;
      namesRead += 1;
      const found = line.match(pattern);
      if (found) failures.push(`${path.relative(root, file)}:${index + 1} writes "${name}${found[1]}"; ${name} does not take ${found[1]}`);
    }
  });
}
assert.ok(namesRead > 1000, `the name-particle scan read ${namesRead} names, which is too few to be the season`);

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Text integrity check passed for ${files.length} source files (${declaredNames.length} names read ${namesRead} times).`);
