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

/**
 * Every module a source names: `import` and `export ... from`, the dynamic
 * `import()`, and `require()`. The re-export and `require` were not read, so
 * a package brought in either way would have passed here and failed in the
 * one job that has no packages.
 */
function importsIn(source) {
  return [
    ...source.matchAll(/^\s*(?:import|export)\s+(?:[^"';]+?\s+from\s+)?["']([^"']+)["']/gm),
    ...source.matchAll(/\b(?:import|require)\(\s*["']([^"']+)["']\s*\)/g),
  ].map((match) => match[1]);
}

test("every way of naming a module is read", () => {
  assert.deepEqual(importsIn('import a from "node:fs";\nimport "./side.mjs";\nimport {\n  b,\n  c,\n} from "./many.mjs";'), ["node:fs", "./side.mjs", "./many.mjs"]);
  assert.deepEqual(importsIn('export { parse } from "yaml";\nexport * from "./all.mjs";\nexport {\n  d,\n} from "./lines.mjs";'), ["yaml", "./all.mjs", "./lines.mjs"]);
  assert.deepEqual(importsIn('const x = await import("./later.mjs");\nconst y = require("pkg");'), ["./later.mjs", "pkg"]);
  assert.deepEqual(importsIn('export const from = "not a module";\nexport function load() {}\n'), []);
});

test("the deploy check imports Node's own modules and its neighbours, nothing installed", () => {
  const seen = new Set();
  const queue = [ENTRY];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readFileSync(file, "utf8");
    const specifiers = importsIn(source);
    assert.ok(file !== ENTRY || specifiers.length > 0, `${ENTRY} has no imports this test can read`);
    // `createRequire` loads by a name worked out at run time, which nothing
    // here could follow.
    assert.ok(!/\bcreateRequire\b/.test(source), `${file} uses createRequire, so what it loads cannot be read from its text.`);
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
