import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/tokens.css", "utf8");
const failures = [];

for (const [lineIndex, line] of css.split(/\r?\n/).entries()) {
  if (/\bNaN\b|undefined|null/.test(line)) {
    failures.push(`tokens.css:${lineIndex + 1} contains an invalid token literal`);
  }

  const declarations = line.matchAll(/--[\w-]+\s*:\s*([^;]+);/g);
  for (const declaration of declarations) {
    const value = declaration[1];
    const rgb = value.match(/rgba?\(([^)]+)\)/);
    if (!rgb) continue;
    const channels = rgb[1].split(/[\s,\/]+/).filter(Boolean);
    const numericChannels = channels
      .map((channel) => Number(channel.replace("%", "")))
      .filter((channel) => Number.isFinite(channel));
    if (numericChannels.length === 0) {
      failures.push(`tokens.css:${lineIndex + 1} has an rgb() value without numeric channels`);
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log("CSS token checks passed");
