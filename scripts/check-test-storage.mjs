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
 */

const root = process.cwd();
const failures = [];
const PARSE = { ecmaVersion: "latest", sourceType: "module", loc: true, ecmaFeatures: { jsx: true } };
const STORAGE_METHODS = new Set(["getItem", "setItem", "removeItem"]);
// sessionStorage is left out: the app keeps nothing there that tests seed, and
// specs use it for their own run-once markers.
const STORAGE_OBJECTS = new Set(["localStorage"]);
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
const appConfigKeys = new Map();
forEachNode(parse(readFileSync(appConfigPath, "utf8"), PARSE), (node) => {
  if (node.type !== "ExportNamedDeclaration" || node.declaration?.type !== "VariableDeclaration") return;
  for (const declarator of node.declaration.declarations) {
    const value = stringOf(declarator.init);
    if (declarator.id.type === "Identifier" && value !== null) appConfigKeys.set(declarator.id.name, value);
  }
});

const appStrings = new Set();
for (const file of walkFiles(path.join(root, "src"), (name) => /\.(?:js|jsx)$/.test(name))) {
  try {
    forEachNode(parse(readFileSync(file, "utf8"), PARSE), (node) => {
      const value = stringOf(node);
      if (value !== null) appStrings.add(value);
    });
  } catch (error) {
    failures.push(`${path.relative(root, file)} could not be parsed: ${error.message}`);
  }
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

const declared = new Set([...testKeys.values(), ...[...appConfigKeys].filter(([name]) => /KEY$/.test(name)).map(([, value]) => value)]);

// --- Resolving a key expression ----------------------------------------------

const KEYS = { kind: "keys" };
const unknown = (reason) => ({ kind: "unknown", reason });

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

const testFiles = walkFiles(path.join(root, "tests"), (name) => name.endsWith(".js"));
// Helper functions whose parameter is used as a key: name -> parameter indexes.
const forwarders = new Map();
// Helper parameters that at least one call site was found for: "file#name:index".
const followed = new Set();
const uses = [];

for (const file of testFiles) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const ast = parse(readFileSync(file, "utf8"), PARSE);
  const top = { parent: null, bindings: new Map() };
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
        for (const declarator of declaration.declarations) bindPattern(declarator.id, declarator.init, inner, inner.bindings);
      }
      if (declaration?.type === "FunctionDeclaration" && declaration.id) declaration.fnName = declaration.id.name;
      if (statement.type === "ImportDeclaration") {
        for (const specifier of statement.specifiers) {
          const imported = specifier.imported?.name;
          if (/(?:^|\/)storage\.js$/.test(statement.source.value) && imported === "TEST_STORAGE_KEYS") {
            inner.bindings.set(specifier.local.name, () => KEYS);
          } else if (/appConfig\.js$/.test(statement.source.value) && appConfigKeys.has(imported)) {
            inner.bindings.set(specifier.local.name, () => ({ kind: "string", values: [appConfigKeys.get(imported)] }));
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
      if (STORAGE_METHODS.has(method) && STORAGE_OBJECTS.has(targetName)) {
        uses.push({ where: `${rel}:${node.loc.start.line}`, key: resolve(node.arguments[0], scope) });
      }
      if (callee.type === "Identifier") {
        uses.push({ where: `${rel}:${node.loc.start.line}`, file: rel, imports, call: callee.name, args: node.arguments, scope });
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "loc" || key === "pageCall") continue;
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
console.log(`Test storage key check passed (${declared.size} declared keys, ${checked} storage calls resolved).`);
