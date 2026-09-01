import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const decoder = new TextDecoder("utf-8", { fatal: true });
const extensions = new Set([".js", ".jsx", ".mjs", ".sql", ".json", ".css"]);
const files = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(fullPath);
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
}

for (const relativeRoot of ["src", "scripts", "supabase"]) visit(path.join(root, relativeRoot));
const failures = [];
for (const file of files) {
  try {
    const text = decoder.decode(fs.readFileSync(file));
    if (text.includes("\uFFFD")) failures.push(`${path.relative(root, file)} contains U+FFFD`);
  } catch (error) {
    failures.push(`${path.relative(root, file)} is not valid UTF-8: ${error.message}`);
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`UTF-8 check passed for ${files.length} source files.`);
}
