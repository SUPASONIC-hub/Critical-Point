import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * The deploy workflow runs `scripts/check-deploy.mjs` without `npm ci`: it
 * checks out, sets up Node and runs the script. That holds for as long as the
 * script and what it imports need nothing from node_modules, so that is held
 * here rather than remembered.
 */
const ENTRY = "scripts/check-deploy.mjs";

function importsOf(file) {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(/^\s*import\s+(?:[^"']+?\s+from\s+)?["']([^"']+)["']/gm), ...source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)].map(
    (match) => match[1],
  );
}

test("the deploy check imports Node's own modules and its neighbours, nothing installed", () => {
  const seen = new Set();
  const queue = [ENTRY];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const specifiers = importsOf(file);
    assert.ok(file !== ENTRY || specifiers.length > 0, `${ENTRY} has no imports this test can read`);
    for (const specifier of specifiers) {
      if (specifier.startsWith("node:")) continue;
      assert.ok(
        specifier.startsWith("./") || specifier.startsWith("../"),
        `${file} imports "${specifier}". The deploy job runs this script without installing packages (.github/workflows/deploy.yml).`,
      );
      queue.push(new URL(specifier, new URL(file, "file:///repo/")).pathname.replace(/^\/repo\//, ""));
    }
  }
});
