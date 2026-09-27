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

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Text integrity check passed for ${files.length} source files.`);
