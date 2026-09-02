import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const tokenCss = readFileSync("src/styles/tokens.css", "utf8");
function readCssFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      if (statSync(path).isDirectory()) return readCssFiles(path);
      return path.endsWith(".css") ? [path] : [];
    })
    .sort()
    .map((path) => ({ path, css: readFileSync(path, "utf8") }));
}

const styleFiles = [{ path: "src/styles/tokens.css", css: tokenCss }, ...readCssFiles("src/styles/app")];
const allCss = styleFiles.map(({ css }) => css).join("\n");
const failures = [];
const budgets = {
  hardcodedHexColors: 300,
  cssVariableUsages: 900,
};

for (const [lineIndex, line] of tokenCss.split(/\r?\n/).entries()) {
  if (/\bNaN\b|undefined|null/.test(line)) {
    failures.push(`tokens.css:${lineIndex + 1} contains an invalid token literal`);
  }

  const declarations = line.matchAll(/--[\w-]+\s*:\s*([^;]+);/g);
  for (const declaration of declarations) {
    const value = declaration[1];
    const rgb = value.match(/rgba?\(([^)]+)\)/);
    if (!rgb) continue;
    const channels = rgb[1].split(/[\s,/]+/).filter(Boolean);
    const numericChannels = channels
      .map((channel) => Number(channel.replace("%", "")))
      .filter((channel) => Number.isFinite(channel));
    if (numericChannels.length === 0) {
      failures.push(`tokens.css:${lineIndex + 1} has an rgb() value without numeric channels`);
    }
  }
}

const hardcodedHexColors = allCss.match(/#[0-9a-fA-F]{3,8}\b/g)?.length ?? 0;
if (hardcodedHexColors > budgets.hardcodedHexColors) {
  failures.push(`styles use ${hardcodedHexColors} hardcoded hex colors; budget is ${budgets.hardcodedHexColors}`);
}

const cssVariableUsages = allCss.match(/var\(/g)?.length ?? 0;
if (cssVariableUsages < budgets.cssVariableUsages) {
  failures.push(`styles use ${cssVariableUsages} CSS variables; expected at least ${budgets.cssVariableUsages}`);
}

for (const { path, css } of styleFiles) {
  if (path === "src/styles/tokens.css") continue;
  for (const [lineIndex, line] of css.split(/\r?\n/).entries()) {
    if (/(^|[;{])\s*color\s*:\s*rgba?\([^;]*(?:,\s*|\/\s*)0?\.[0-5]\d?[^;]*;/.test(line)) {
      failures.push(`${path}:${lineIndex + 1} uses low-opacity text color; prefer an opaque token with tested contrast`);
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`CSS token checks passed (${cssVariableUsages} var() uses, ${hardcodedHexColors} hex colors)`);
