import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "espree";

/**
 * Shared constant guardrail.
 *
 * The intro split gave the storage keys, the debug flag and the case list one
 * home each, and `appConfig.js` says so in a comment: "One definition so the two
 * agree." Nothing enforced it. `App.jsx` was outside the files that split touched
 * and kept its own `debugToolsEnabled` -- which, missing the `?? {}` guard the
 * shared one has, did not even evaluate to the same thing -- its own
 * `DEBUG_RENDER_CRASH_KEY` literal, and a hardcoded `caseSequence` that nothing
 * imported and that could drift from `CASE_SEQUENCE` without failing anything.
 *
 * Two rules, both about module scope only:
 *   1. No file redeclares a name that one of the home modules exports.
 *   2. No storage-key literal is written down in more than one file.
 */

const root = process.cwd();

// The modules that own shared values. A name exported from one of these is that
// name's only definition; everywhere else imports it.
const HOME_MODULES = ["src/appConfig.js", "src/gameConstants.js", "src/gameCases.js"];

// Every browser-storage key in the app carries one of these prefixes, so a
// second copy of one is findable by shape rather than by a list to maintain.
const STORAGE_KEY_PREFIXES = ["critical-point-", "trigger-prototype-"];

// Names that legitimately live in more than one place: short local aliases of an
// imported value, kept for readability at the call site.
const ALLOWED_LOCAL_ALIASES = new Set(["caseSequence"]);

function sourceFiles() {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
    }
  };
  visit(path.join(root, "src"));
  return files;
}

function parseFile(file) {
  return parse(readFileSync(file, "utf8"), {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  });
}

/** Top-level `const NAME = ...` declarations, and whether each is exported. */
function moduleScopeConstants(program) {
  const found = [];
  for (const node of program.body) {
    const declaration = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (declaration?.type !== "VariableDeclaration") continue;
    for (const declarator of declaration.declarations) {
      if (declarator.id.type !== "Identifier") continue;
      found.push({
        name: declarator.id.name,
        exported: node.type === "ExportNamedDeclaration",
        init: declarator.init,
      });
    }
  }
  return found;
}

/** Every string literal in the file, wherever it sits. */
function stringLiterals(node, seen = new Set()) {
  if (!node || typeof node !== "object") return seen;
  if (Array.isArray(node)) {
    for (const child of node) stringLiterals(child, seen);
    return seen;
  }
  if (node.type === "Literal" && typeof node.value === "string") seen.add(node.value);
  for (const key of Object.keys(node)) {
    if (key === "parent" || key === "loc" || key === "range") continue;
    stringLiterals(node[key], seen);
  }
  return seen;
}

const failures = [];
const homeExports = new Map();

for (const relative of HOME_MODULES) {
  const program = parseFile(path.join(root, relative));
  for (const entry of moduleScopeConstants(program)) {
    if (entry.exported) homeExports.set(entry.name, relative);
  }
}

const keyOwners = new Map();

for (const file of sourceFiles()) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const program = parseFile(file);

  if (!HOME_MODULES.includes(relative)) {
    for (const entry of moduleScopeConstants(program)) {
      if (ALLOWED_LOCAL_ALIASES.has(entry.name)) continue;
      const home = homeExports.get(entry.name);
      if (home) {
        failures.push(`${relative} declares \`${entry.name}\`, which ${home} already exports. Import it instead.`);
      }
    }
  }

  for (const literal of stringLiterals(program)) {
    if (!STORAGE_KEY_PREFIXES.some((prefix) => literal.startsWith(prefix))) continue;
    if (!keyOwners.has(literal)) keyOwners.set(literal, new Set());
    keyOwners.get(literal).add(relative);
  }
}

for (const [key, owners] of keyOwners) {
  if (owners.size > 1) {
    failures.push(
      `The storage key "${key}" is written out in ${[...owners].sort().join(" and ")}. ` +
        `Export it from one of ${HOME_MODULES.join(", ")} and import it.`,
    );
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Shared constant checks passed (${homeExports.size} names owned by ${HOME_MODULES.length} modules, ${keyOwners.size} storage keys with one home each).`,
  );
}
