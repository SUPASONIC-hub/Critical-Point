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

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Text integrity check passed for ${files.length} source files.`);
