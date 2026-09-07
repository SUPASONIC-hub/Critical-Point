import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const assetsDir = path.join(root, "dist", "assets");
const budgets = [
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 450_000 },
  { pattern: /^index-.*\.js$/, maxBytes: 120_000 },
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 75_000 },
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 60_000 },
  { pattern: /^index-.*\.css$/, maxBytes: 200_000 },
];

let files;
try {
  files = readdirSync(assetsDir);
} catch {
  console.error("Bundle size check could not find dist/assets. Run npm run build first.");
  process.exit(1);
}

const failures = [];
const reported = [];
for (const budget of budgets) {
  const file = files.find((name) => budget.pattern.test(name));
  if (!file) {
    failures.push(`no bundle matched ${budget.pattern}`);
    continue;
  }
  const assetPath = path.join(assetsDir, file);
  const bytes = statSync(assetPath).size;
  const gzipBytes = gzipSync(readFileSync(assetPath)).length;
  const gzipBudget = Math.ceil(budget.maxBytes * 0.4);
  reported.push(`${file}: ${bytes} bytes raw / ${gzipBytes} bytes gzip`);
  if (bytes > budget.maxBytes) failures.push(`${file} is ${bytes} bytes, over the ${budget.maxBytes} byte budget.`);
  if (gzipBytes > gzipBudget) failures.push(`${file} is ${gzipBytes} gzip bytes, over the ${gzipBudget} gzip budget.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Bundle size checks passed (${reported.join("; ")}).`);
}
