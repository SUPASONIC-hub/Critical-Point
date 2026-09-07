import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const helperPath = path.join(root, "tests", "helpers", "storage.js");
const helperSource = readFileSync(helperPath, "utf8");
const configSource = readFileSync(path.join(root, "src", "appConfig.js"), "utf8");
const declaredKeys = new Set([
  ...[...helperSource.matchAll(/:\s*"([^"]+)"/g)].map((match) => match[1]),
  ...[...configSource.matchAll(/(?:STORAGE_KEY|ERROR_LOG_STORAGE_KEY|SAVE_SLOT_STORAGE_KEY|RECOVERY_CENTER_STORAGE_KEY)\s*=\s*"([^"]+)"/g)].map((match) => match[1]),
]);
const keyPattern = /localStorage\.(?:getItem|setItem|removeItem)\(\s*"([^"]+)"/g;
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(entryPath);
    else if (entry.name.endsWith(".js")) files.push(entryPath);
  }
}
walk(path.join(root, "tests"));

const unknown = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(keyPattern)) {
    if (!declaredKeys.has(match[1])) unknown.push(`${path.relative(root, file)}: ${match[1]}`);
  }
}
if (unknown.length) {
  console.error(`Test storage key check failed:\n${unknown.join("\n")}`);
  process.exit(1);
}
console.log(`Test storage key check passed (${declaredKeys.size} declared keys).`);
