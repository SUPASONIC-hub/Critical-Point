import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "espree";

/**
 * Test storage key guardrail.
 *
 * A test that seeds or reads a storage key the app does not use passes while
 * testing nothing: the app never looks at what it wrote. So:
 *
 *  1. every value in `TEST_STORAGE_KEYS` (tests/helpers/storage.js) has to be a
 *     string the app's source actually contains, and
 *  2. every `localStorage` `getItem`, `setItem` and
 *     `removeItem` in tests/ has to name a key that resolves to one of those
 *     values or to an exported `*_KEY` constant of src/appConfig.js.
 *
 * The keys are resolved on the syntax tree rather than matched as text, which
 * is what the first version of this file did: it only saw a double-quoted
 * literal written directly inside the call, so a key passed through a variable,
 * an `evaluate` argument, a destructured parameter or a helper function was
 * never checked at all, and any quoted string anywhere in the helper counted as
 * "declared". Resolution follows those paths; a key it cannot follow is a
 * failure, because an unverifiable key is exactly the case this exists for.
 *
 * Until 2026-10-08 it read the Playwright specs alone (`.js` under tests/).
 * The unit tests are `.mjs`, run against a stand-in for storage
 * (`createStorage` in tests/unit/helpers/browser.mjs, reached as
 * `globalThis.localStorage`, as `browser.storage`, or by the name it was
 * given), and take their keys from the app's own modules, so none of their
 * two hundred calls was looked at. They are now: the `.mjs` files under
 * tests/ and the two test files in scripts/, a call on a stand-in, and the
 * keys a stand-in is created holding.
 */

const root = process.cwd();
const failures = [];
const PARSE = { ecmaVersion: "latest", sourceType: "module", loc: true, ecmaFeatures: { jsx: true } };
const STORAGE_METHODS = new Set(["getItem", "setItem", "removeItem"]);
// sessionStorage is left out: the app keeps nothing there that tests seed, and
// specs use it for their own run-once markers.
// `storage` is the handle `installBrowser` returns for the stand-in.
const STORAGE_OBJECTS = new Set(["localStorage", "storage"]);
// What makes a stand-in, and the helpers that pass an object of keys on to it.
const STAND_IN_FACTORY = "createStorage";
const SEEDING_HELPERS = new Set(["createRunHarness", "installBrowser"]);
// Array methods whose callback is handed the array's own elements.
const ELEMENT_CALLBACKS = new Set(["filter", "map", "forEach", "some", "every", "find", "flatMap"]);
// Page-side callbacks: the function runs in the browser and its parameter is
// the call's second argument.
const PAGE_CALLS = new Set(["evaluate", "evaluateHandle", "addInitScript", "waitForFunction", "evaluateAll"]);

function walkFiles(directory, test) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walkFiles(entryPath, test));
    else if (test(entry.name)) found.push(entryPath);
  }
  return found;
}

function forEachNode(node, visit, parent = null) {
  if (!node || typeof node.type !== "string") return;
  visit(node, parent);
  for (const [key, value] of Object.entries(node)) {
    if (key === "loc" || key === "parent") continue;
    if (Array.isArray(value)) value.forEach((child) => forEachNode(child, visit, node));
    else if (value && typeof value === "object") forEachNode(value, visit, node);
  }
}

const stringOf = (node) =>
  node?.type === "Literal" && typeof node.value === "string"
    ? node.value
    : node?.type === "TemplateLiteral" && node.expressions.length === 0
      ? node.quasis[0].value.cooked
      : null;

// --- What the app uses -------------------------------------------------------

const appConfigPath = path.join(root, "src", "appConfig.js");
const srcRoot = path.join(root, "src") + path.sep;
// Every module under src/: the strings it exports by name, and every string in it.
const sourceExports = new Map();
const appStrings = new Set();
for (const file of walkFiles(path.join(root, "src"), (name) => /\.(?:js|jsx)$/.test(name))) {
  const exported = new Map();
  sourceExports.set(file, exported);
  try {
    forEachNode(parse(readFileSync(file, "utf8"), PARSE), (node) => {
      const value = stringOf(node);
      if (value !== null) appStrings.add(value);
      if (node.type !== "ExportNamedDeclaration" || node.declaration?.type !== "VariableDeclaration") return;
      for (const declarator of node.declaration.declarations) {
        const text = stringOf(declarator.init);
        if (declarator.id.type === "Identifier" && text !== null) exported.set(declarator.id.name, text);
      }
    });
  } catch (error) {
    failures.push(`${path.relative(root, file)} could not be parsed: ${error.message}`);
  }
}
const appConfigKeys = sourceExports.get(appConfigPath) ?? new Map();
/** The exports of the src/ module an import in `fromFile` names, or null when it names something else. */
function sourceModule(fromFile, specifier) {
  if (typeof specifier !== "string" || !specifier.startsWith(".")) return null;
  const target = path.resolve(path.dirname(fromFile), specifier);
  return target.startsWith(srcRoot) ? (sourceExports.get(target) ?? null) : null;
}

// --- TEST_STORAGE_KEYS -------------------------------------------------------

const helperPath = path.join(root, "tests", "helpers", "storage.js");
const helperAst = parse(readFileSync(helperPath, "utf8"), PARSE);
const helperImports = new Map();
const testKeys = new Map();
forEachNode(helperAst, (node) => {
  if (node.type === "ImportDeclaration" && /appConfig\.js$/.test(node.source.value)) {
    for (const specifier of node.specifiers) helperImports.set(specifier.local.name, specifier.imported?.name);
  }
});
forEachNode(helperAst, (node) => {
  if (node.type !== "VariableDeclarator" || node.id.name !== "TEST_STORAGE_KEYS") return;
  const object = node.init?.type === "CallExpression" ? node.init.arguments[0] : node.init;
  for (const property of object?.properties ?? []) {
    const name = property.key.name ?? property.key.value;
    const literal = stringOf(property.value);
    const imported = property.value.type === "Identifier" ? appConfigKeys.get(helperImports.get(property.value.name)) : undefined;
    const value = literal ?? imported;
    if (value === undefined || value === null) {
      failures.push(`tests/helpers/storage.js: TEST_STORAGE_KEYS.${name} is neither a string nor an appConfig key.`);
      continue;
    }
    testKeys.set(name, value);
  }
});
if (testKeys.size === 0) failures.push("tests/helpers/storage.js declares no TEST_STORAGE_KEYS.");
for (const [name, value] of testKeys) {
  if (!appStrings.has(value)) {
    failures.push(`tests/helpers/storage.js: TEST_STORAGE_KEYS.${name} is "${value}", which nothing in src/ reads or writes.`);
  }
}

// A key is declared by the helper's table or by a module of the app that
// exports it under a name ending in KEY. Most are in appConfig.js; the relic
// codex and the local ranking keep theirs beside the code that uses them.
const declared = new Set(testKeys.values());
for (const exported of sourceExports.values()) {
  for (const [name, value] of exported) if (/KEY$/.test(name)) declared.add(value);
}

// --- Resolving a key expression ----------------------------------------------

const KEYS = { kind: "keys" };
// A string the app's own module exports, reached without naming which one
// (`Object.values(appConfig)`): from the source by construction.
const FROM_SOURCE = { kind: "source" };
const unknown = (reason) => ({ kind: "unknown", reason });
const moduleOf = (exported) => ({ kind: "module", exported });
/** `await import("…")` or `import("…")` of a src/ module, as its exports. */
function importedModule(node, fromFile) {
  const call = node?.type === "AwaitExpression" ? node.argument : node;
  if (call?.type !== "ImportExpression") return null;
  return sourceModule(fromFile, stringOf(call.source));
}

/** Bind the names in a parameter pattern to what the matching argument resolves to. */
function bindPattern(pattern, argument, scope, bindings) {
  if (!pattern) return;
  if (pattern.type === "Identifier") bindings.set(pattern.name, () => (argument ? resolve(argument, scope) : unknown("no argument")));
  else if (pattern.type === "AssignmentPattern") bindPattern(pattern.left, argument, scope, bindings);
  else if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties) {
      if (property.type !== "Property") continue;
      const name = property.key.name ?? property.key.value;
      const match = argument?.type === "ObjectExpression"
        ? argument.properties.find((candidate) => (candidate.key?.name ?? candidate.key?.value) === name)
        : null;
      bindPattern(property.value, match?.value ?? null, scope, bindings);
    }
  } else if (pattern.type === "ArrayPattern") {
    pattern.elements.forEach((element, index) =>
      bindPattern(element, argument?.type === "ArrayExpression" ? argument.elements[index] : null, scope, bindings),
    );
  }
}

function lookup(name, scope) {
  for (let current = scope; current; current = current.parent) {
    if (current.bindings.has(name)) return current.bindings.get(name)();
  }
  return unknown(`\`${name}\` is not declared where it is used`);
}

function resolve(node, scope) {
  const literal = stringOf(node);
  if (literal !== null) return { kind: "string", values: [literal] };
  if (!node) return unknown("no key");
  if (node.type === "Identifier") return lookup(node.name, scope);
  if (node.type === "MemberExpression" && !node.computed) {
    const object = resolve(node.object, scope);
    if (object.kind === "keys") {
      const value = testKeys.get(node.property.name);
      return value === undefined
        ? unknown(`TEST_STORAGE_KEYS has no \`${node.property.name}\``)
        : { kind: "string", values: [value] };
    }
    if (object.kind === "module") {
      const value = object.exported.get(node.property.name);
      return value === undefined
        ? unknown(`the module exports no string named \`${node.property.name}\``)
        : { kind: "string", values: [value] };
    }
    return unknown(`\`${node.object.name ?? "an object"}.${node.property.name}\` is not a TEST_STORAGE_KEYS entry`);
  }
  if (node.type === "ArrayExpression") {
    const parts = node.elements.map((element) => resolve(element, scope));
    const bad = parts.find((part) => part.kind !== "string");
    return bad ?? { kind: "string", values: parts.flatMap((part) => part.values) };
  }
  return unknown(`a computed key (${node.type})`);
}

// --- Walking the tests ---------------------------------------------------------

const testFiles = [
  ...walkFiles(path.join(root, "tests"), (name) => /\.m?js$/.test(name)),
  path.join(root, "scripts", "unit-tests.mjs"),
  path.join(root, "scripts", "smoke-test.mjs"),
];
if (!testFiles.some((file) => file.endsWith(".test.mjs"))) failures.push("tests/ holds no .test.mjs file; the unit tests were not read.");
// Helper functions whose parameter is used as a key: name -> parameter indexes.
const forwarders = new Map();
// Helper parameters that at least one call site was found for: "file#name:index".
const followed = new Set();
const uses = [];

for (const file of testFiles) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const ast = parse(readFileSync(file, "utf8"), PARSE);
  const top = { parent: null, bindings: new Map() };
  // Names this file gives a stand-in (`const local = createStorage()`), and
  // objects it keeps to seed one with (`const RESET_STORAGE = { … }`).
  const standIns = new Set();
  const objects = new Map();
  /** The keys of an object a stand-in is created holding. */
  function seed(node, scope, where) {
    const object = node?.type === "Identifier" ? objects.get(node.name) : node;
    if (object?.type !== "ObjectExpression") return;
    for (const property of object.properties) {
      if (property.type !== "Property") continue;
      const key = property.computed
        ? resolve(property.key, scope)
        : { kind: "string", values: [property.key.name ?? String(property.key.value)] };
      uses.push({ where: `${where}:${property.loc.start.line}`, key });
    }
  }
  // Local name -> the tests/ file it is imported from, for helper matching.
  const imports = new Map();
  for (const statement of ast.body) {
    if (statement.type !== "ImportDeclaration" || !statement.source.value.startsWith(".")) continue;
    const from = path.relative(root, path.resolve(path.dirname(file), statement.source.value)).split(path.sep).join("/");
    for (const specifier of statement.specifiers) imports.set(specifier.local.name, from);
  }

  function enter(node, scope) {
    if (!node || typeof node.type !== "string") return;
    let inner = scope;
    if (/Function/.test(node.type)) {
      inner = { parent: scope, bindings: new Map() };
      node.params.forEach((param, index) => {
        const names = new Map();
        bindPattern(param, null, scope, names);
        for (const name of names.keys()) {
          inner.bindings.set(name, () => {
            const page = node.pageCall;
            if (page) {
              const scratch = new Map();
              bindPattern(node.params[index], page.arguments[1] ?? null, page.scope, scratch);
              return scratch.get(name)();
            }
            if (node.elementsOf && index === 0) return node.elementsOf;
            return { kind: "param", fn: node.fnName, file: rel, index };
          });
        }
      });
    }
    if (node.type === "BlockStatement" || node.type === "Program") inner = inner === scope ? { parent: scope, bindings: new Map() } : inner;
    // Hoist declarations of this block so a use before the line still resolves.
    for (const statement of node.body && Array.isArray(node.body) ? node.body : []) {
      const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
      if (declaration?.type === "VariableDeclaration") {
        for (const declarator of declaration.declarations) {
          bindPattern(declarator.id, declarator.init, inner, inner.bindings);
          // `const config = await import("../../src/appConfig.js")`, or its
          // names taken apart in the same statement.
          const exported = importedModule(declarator.init, file);
          if (exported && declarator.id.type === "Identifier") inner.bindings.set(declarator.id.name, () => moduleOf(exported));
          if (exported && declarator.id.type === "ObjectPattern") {
            for (const property of declarator.id.properties) {
              const imported = property.key?.name;
              const local = property.value?.type === "Identifier" ? property.value.name : null;
              if (local && exported.has(imported)) inner.bindings.set(local, () => ({ kind: "string", values: [exported.get(imported)] }));
            }
          }
          if (declarator.id.type !== "Identifier") continue;
          if (declarator.init?.type === "ObjectExpression") objects.set(declarator.id.name, declarator.init);
          const made = declarator.init?.type === "CallExpression" && declarator.init.callee.name === STAND_IN_FACTORY;
          if (made && !/session/i.test(declarator.id.name)) standIns.add(declarator.id.name);
        }
      }
      if (declaration?.type === "FunctionDeclaration" && declaration.id) declaration.fnName = declaration.id.name;
      if (statement.type === "ImportDeclaration") {
        for (const specifier of statement.specifiers) {
          const imported = specifier.imported?.name;
          if (/(?:^|\/)storage\.js$/.test(statement.source.value) && imported === "TEST_STORAGE_KEYS") {
            inner.bindings.set(specifier.local.name, () => KEYS);
          } else {
            const exported = sourceModule(file, statement.source.value);
            if (!exported) continue;
            if (specifier.type === "ImportNamespaceSpecifier") inner.bindings.set(specifier.local.name, () => moduleOf(exported));
            else if (exported.has(imported)) inner.bindings.set(specifier.local.name, () => ({ kind: "string", values: [exported.get(imported)] }));
          }
        }
      }
    }
    if (node.type === "ForOfStatement" && node.left.type === "VariableDeclaration") {
      inner = { parent: scope, bindings: new Map() };
      const pattern = node.left.declarations[0].id;
      const source = node.right;
      bindPattern(pattern, null, scope, inner.bindings);
      if (pattern.type === "Identifier") inner.bindings.set(pattern.name, () => resolve(source, scope));
    }
    if (node.type === "VariableDeclarator" && /Function/.test(node.init?.type ?? "") && node.id.type === "Identifier") {
      node.init.fnName = node.id.name;
    }
    if (node.type === "CallExpression") {
      const callee = node.callee;
      const method = callee.type === "MemberExpression" && !callee.computed ? callee.property.name : null;
      const fn = node.arguments[0];
      if (PAGE_CALLS.has(method) && /Function/.test(fn?.type ?? "")) {
        fn.pageCall = { arguments: node.arguments, scope };
      }
      const target = callee.type === "MemberExpression" ? callee.object : null;
      const targetName = target?.type === "Identifier" ? target.name : target?.type === "MemberExpression" ? target.property.name : null;
      const standIn = target?.type === "Identifier" && standIns.has(target.name);
      if (STORAGE_METHODS.has(method) && (STORAGE_OBJECTS.has(targetName) || standIn)) {
        uses.push({ where: `${rel}:${node.loc.start.line}`, key: resolve(node.arguments[0], scope) });
      }
      // `Object.values(appConfig).filter((value) => localStorage.getItem(value))`:
      // the callback's first parameter is one of the module's own strings.
      const list = ELEMENT_CALLBACKS.has(method) && target?.type === "CallExpression" ? target : null;
      const listed = list?.callee.type === "MemberExpression" && list.callee.object.name === "Object" && list.callee.property.name === "values";
      if (listed && /Function/.test(fn?.type ?? "") && resolve(list.arguments[0], scope).kind === "module") fn.elementsOf = FROM_SOURCE;
      // A stand-in created holding keys, directly or through a helper's `storage` option.
      if (callee.type === "Identifier" && callee.name === STAND_IN_FACTORY) seed(node.arguments[0], scope, rel);
      if (callee.type === "Identifier" && SEEDING_HELPERS.has(callee.name) && node.arguments[0]?.type === "ObjectExpression") {
        const option = node.arguments[0].properties.find((property) => property.type === "Property" && property.key.name === "storage");
        if (option) seed(option.value, scope, rel);
      }
      if (callee.type === "Identifier") {
        uses.push({ where: `${rel}:${node.loc.start.line}`, file: rel, imports, call: callee.name, args: node.arguments, scope });
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "loc" || key === "pageCall" || key === "elementsOf") continue;
      if (Array.isArray(value)) value.forEach((child) => enter(child, inner));
      else if (value && typeof value === "object" && typeof value.type === "string") enter(value, inner);
    }
  }
  enter(ast, top);
}

// A key that is a helper's parameter is checked at that helper's call sites,
// through as many helpers as it is passed along.
// A helper is matched by the file that defines it, so two specs' local helpers
// of the same name are not confused: a call reaches the one in its own file or
// the one it imports.
for (let changed = true; changed; ) {
  changed = false;
  for (const use of uses) {
    if (use.key?.kind !== "param" || !use.key.fn) continue;
    const id = `${use.key.file}#${use.key.fn}`;
    const indexes = forwarders.get(id) ?? new Set();
    if (!indexes.has(use.key.index)) {
      indexes.add(use.key.index);
      forwarders.set(id, indexes);
      changed = true;
    }
  }
  for (const use of [...uses]) {
    if (!use.call) continue;
    const id = use.imports.has(use.call) ? `${use.imports.get(use.call)}#${use.call}` : `${use.file}#${use.call}`;
    use.done ??= new Set();
    for (const index of forwarders.get(id) ?? []) {
      if (use.done.has(index)) continue;
      use.done.add(index);
      followed.add(`${id}:${index}`);
      uses.push({ where: use.where, key: resolve(use.args[index], use.scope) });
      changed = true;
    }
  }
}

let checked = 0;
for (const use of uses) {
  if (!use.key) continue;
  // A key that is a parameter is checked where the function is called, and
  // only a call by the function's own name is followed. A callback with no
  // name, or a helper reached as `helpers.seed(...)` or under an import alias,
  // has no call site here, so its key was skipped without a word; the header
  // has always said such a key fails.
  if (use.key.kind === "param") {
    const id = `${use.key.file}#${use.key.fn}`;
    if (!use.key.fn) {
      failures.push(`${use.where}: cannot tell which storage key this is (a parameter of a function with no name). Name the function, or pass the key from TEST_STORAGE_KEYS inside it.`);
    } else if (!followed.has(`${id}:${use.key.index}`)) {
      failures.push(`${use.where}: cannot tell which storage key this is (parameter ${use.key.index + 1} of ${use.key.fn}, which nothing calls by that name). Call it by name, or use TEST_STORAGE_KEYS inside it.`);
    }
    continue;
  }
  checked += 1;
  if (use.key.kind === "module") {
    failures.push(`${use.where}: a whole module was passed where a storage key belongs.`);
    continue;
  }
  if (use.key.kind === "unknown") {
    failures.push(`${use.where}: cannot tell which storage key this is (${use.key.reason}). Use TEST_STORAGE_KEYS or an appConfig key.`);
    continue;
  }
  if (use.key.kind !== "string") continue;
  for (const value of use.key.values) {
    if (!declared.has(value)) failures.push(`${use.where}: "${value}" is not a declared storage key.`);
  }
}

if (failures.length) {
  console.error(`Test storage key check failed:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`Test storage key check passed (${declared.size} declared keys, ${checked} storage calls and seeded keys resolved in ${testFiles.length} files).`);
