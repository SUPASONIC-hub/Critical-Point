/**
 * What `npm run check:changed` runs for a set of changed files. Pure: the CLI
 * (scripts/check-changed.mjs) reads git and the files, this decides.
 *
 * Two sources pick a check, and both are printed as the reason:
 *
 *   area     the file's place in the tree (CATEGORIES below, first match
 *            wins): a scene's words, a stylesheet, a screen, a workflow...
 *   imports  the check's own script imports the file, directly or through
 *            another module (importClosure). This is what sends a change in
 *            src/gameLogic.js to check:pressure and check:endings, and keeps a
 *            change in a button's JSX away from them.
 *
 * A file no area claims and no check imports runs everything (`full`): an
 * unknown file is not a reason to check less.
 */
import path from "node:path";

// --- the checks, by what they read ------------------------------------------

/** The words: every check that reads a line a player sees. */
export const TEXT_CHECKS = [
  "check:locale:strict",
  "check:canon",
  "check:text",
  "check:dialogue",
  "check:card-labels",
  "check:fonts",
  "check:plain-language",
  "check:encoding",
  // The README quotes card counts and the font's characters.
  "check:doc-numbers",
  // It reads the intro's and the endings' copy for the baselines' scenes.
  "check:visual-baselines",
];

/** A scene file whose data (not only its words) changed: the season's numbers. */
export const SCENE_DATA_CHECKS = ["check:graph", "check:balance", "check:pressure", "check:endings", "check:runtime-budget", "check:constants", "check:mood", "lint", "check:types"];

export const CSS_CHECKS = ["format:check", "check:css", "check:css-structure", "check:encoding"];

export const CODE_CHECKS = [
  "lint",
  "check:types",
  "check:runtime-budget",
  "check:views",
  "check:constants",
  "check:export-schema",
  "check:test-storage",
  "check:text",
  "check:encoding",
  "check:canon",
  "check:locale:strict",
];

/**
 * { id, label, test(file), checks, build?, specs?, actionlint?, tests, textAware? }
 *
 * build    `build:e2e` (through the tree cache) then `check:bundle` and
 *          `check:deploy:offline`. Every file that ships does: a words-only
 *          change still renames the hashed chunks and moves the gzip budgets,
 *          and a stale critical CSS fails the build itself.
 * tests    "full" runs `npm test`; "related" runs the unit test files that
 *          import the changed file or name its path; "none" runs none.
 * textAware  a change that only rewrites strings and comments takes `checks`;
 *          any other change takes SCENE_DATA_CHECKS too.
 */
export const CATEGORIES = [
  {
    id: "toolchain",
    label: "package, Node pin or the check list itself",
    test: (file) =>
      ["package.json", "package-lock.json", ".node-version", ".npmrc", "scripts/verify-static.mjs", "scripts/check-pool.mjs"].includes(file),
    full: true,
  },
  {
    id: "text",
    label: "words (locales, scenes, copy tables)",
    test: (file) => /^src\/(locales|nodes|copy)\/.+\.js$/.test(file) || /^src\/[A-Za-z]+Copy\.js$/.test(file) || file === "src/privacyText.js",
    checks: TEXT_CHECKS,
    textAware: true,
    build: true,
    tests: "related",
  },
  {
    id: "css",
    label: "stylesheet",
    test: (file) => /^src\/styles\/.+\.css$/.test(file),
    checks: CSS_CHECKS,
    build: true,
    tests: "related",
  },
  {
    id: "code",
    label: "app code",
    test: (file) => /^src\/.+\.(js|jsx|mjs|ts)$/.test(file),
    checks: CODE_CHECKS,
    build: true,
    tests: "full",
  },
  {
    id: "assets",
    label: "page, image or font",
    test: (file) => /^(src\/assets|public)\//.test(file) || ["index.html", "music-lab.html"].includes(file),
    checks: ["check:art", "check:fonts", "check:encoding", "check:visual-baselines"],
    build: true,
    tests: "related",
  },
  {
    id: "build-config",
    label: "build or deploy configuration",
    test: (file) =>
      ["vite.config.js", "render.yaml", ".env.e2e"].includes(file) ||
      /^scripts\/(critical-css-rules|service-worker-build|site-pages|legal-pages|adsense-config|search-console|analytics-config|vite-season-data|check-bundle-size|check-deploy|deploy-policy|css-size|build-cache)\.mjs$/.test(file),
    checks: ["lint", "check:encoding"],
    build: true,
    tests: "related",
  },
  {
    id: "unit-tests",
    label: "unit test",
    test: (file) => /^tests\/unit\//.test(file),
    checks: ["lint", "check:test-storage", "check:encoding"],
    tests: "related",
  },
  {
    id: "e2e",
    label: "browser test or its runner",
    test: (file) => /^tests\//.test(file) || ["playwright.config.js", "scripts/run-e2e.mjs"].includes(file),
    checks: ["lint", "check:test-storage", "check:encoding", "check:visual-baselines"],
    specs: true,
    tests: "related",
  },
  {
    id: "workflows",
    label: "GitHub workflow",
    test: (file) => /^\.github\//.test(file),
    checks: ["check:node", "check:encoding", "check:visual-baselines"],
    specs: true,
    actionlint: true,
    tests: "related",
  },
  {
    id: "database",
    label: "database migration",
    test: (file) => /^supabase\//.test(file),
    checks: ["check:grants", "check:encoding"],
    tests: "related",
  },
  {
    id: "canon-doc",
    label: "story facts document",
    test: (file) => file === "docs/canon.md",
    checks: ["check:canon", "check:doc-numbers", "check:visual-baselines"],
    tests: "none",
  },
  {
    id: "docs",
    label: "document",
    // `format:check` covers src/styles only (the README's "개발 메모"), so a
    // document has no formatter to answer to.
    test: (file) => /\.md$/.test(file) || /^docs\//.test(file),
    checks: ["check:doc-numbers", "check:visual-baselines"],
    tests: "none",
  },
  {
    id: "scripts",
    label: "check or tool script",
    test: (file) => /^scripts\//.test(file),
    checks: ["lint", "check:encoding", "check:test-storage"],
    tests: "related",
  },
  {
    id: "config",
    label: "lint, type, format or text settings",
    test: (file) =>
      ["eslint.config.js", "jsconfig.json", ".prettierrc", ".prettierrc.json", ".prettierignore", ".gitattributes", ".editorconfig", ".gitignore", ".env.example"].includes(file),
    checks: ["lint", "check:types", "format:check", "check:encoding"],
    tests: "none",
  },
];

export const categoryOf = (file) => CATEGORIES.find((category) => category.test(file)) ?? null;

/** A unit test change that can move every test: run them all. */
const TEST_INFRA = /^(tests\/unit\/(helpers|fixtures)\/|scripts\/unit-tests\.mjs$|scripts\/smoke-test\.mjs$)/;

// --- words only? -------------------------------------------------------------

// Comments, and string literals that hold a space or a character past ASCII:
// those are words. A string without either (`"reframe"`, `"case03_s2"`) is an
// id or a key, and changing it changes what the scene does, so it stays.
const TOKEN = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
const isWords = (literal) => /[\s\u0080-￿]|\\u/.test(literal.slice(1, -1));

export function maskWords(source) {
  return source
    .replace(TOKEN, (token) => {
      if (token.startsWith("//") || token.startsWith("/*")) return " ";
      return isWords(token) ? `${token[0]}${token[0]}` : token;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when `after` differs from `before` only in comments and in strings that
 * are words. A missing side (an added or deleted file) is not words only.
 */
export function isTextOnlyChange(before, after) {
  if (before == null || after == null) return false;
  return maskWords(before) === maskWords(after);
}

// --- imports -----------------------------------------------------------------

const STATIC_IMPORT = /(?:^|[\s;}])(?:import|export)\s*(?:[\w*{}\s,$]+?\s*from\s*)?["']([^"'\n]+)["']/g;
const DYNAMIC_IMPORT = /\bimport\(\s*["']([^"'\n]+)["']\s*\)/g;
// `import(\`./nodes/${id}.js\`)` and `import.meta.glob("./*/late/*.js")`
// import a folder: everything under the part before the first wildcard.
const TEMPLATE_IMPORT = /\bimport\(\s*`([^`$]*)\$\{/g;
const GLOB_IMPORT = /\bimport\.meta\.glob\(\s*["'`]([^"'`*]*)\*/g;

/** { specifiers, folders }: relative specifiers and folder prefixes `source` imports. */
export function parseImports(source) {
  const specifiers = new Set();
  const folders = new Set();
  for (const pattern of [STATIC_IMPORT, DYNAMIC_IMPORT]) for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  for (const pattern of [TEMPLATE_IMPORT, GLOB_IMPORT]) for (const match of source.matchAll(pattern)) folders.add(match[1]);
  return {
    specifiers: [...specifiers].filter((spec) => spec.startsWith(".")),
    folders: [...folders].filter((spec) => spec.startsWith(".")),
  };
}

const EXTENSIONS = ["", ".js", ".jsx", ".mjs", ".ts", "/index.js", "/index.jsx"];

/**
 * Every repo file `entry` reaches by relative imports, `entry` included, as
 * { files: Set, folders: string[] } (folders end in "/" or are a name prefix).
 * `read(file)` returns the file's text or null; `exists(file)` says whether a
 * path is a file. Paths are repo-relative with "/". `memo` is shared between
 * calls so a module is read once. A file `stopAt` says yes to is included, and
 * its own imports are not followed.
 */
export function importClosure(entry, { read, exists, memo = new Map(), stopAt = () => false }) {
  const files = new Set();
  const folders = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (files.has(file)) continue;
    files.add(file);
    if (!/\.(js|jsx|mjs|ts)$/.test(file) || (file !== entry && stopAt(file))) continue;
    let parsed = memo.get(file);
    if (!parsed) {
      const source = read(file);
      parsed = source == null ? { specifiers: [], folders: [] } : parseImports(source);
      memo.set(file, parsed);
    }
    const dir = path.posix.dirname(file);
    for (const folder of parsed.folders) {
      const joined = path.posix.join(dir, folder);
      folders.add(folder.endsWith("/") && !joined.endsWith("/") ? `${joined}/` : joined);
    }
    for (const spec of parsed.specifiers) {
      const base = path.posix.normalize(path.posix.join(dir, spec.split("?")[0]));
      // Resolved once per path: a test file and the next both import gameData.js.
      const resolvedKey = `resolve:${base}`;
      if (!memo.has(resolvedKey)) memo.set(resolvedKey, EXTENSIONS.map((ext) => base + ext).find((candidate) => exists(candidate)) ?? null);
      const target = memo.get(resolvedKey);
      if (target && !files.has(target)) stack.push(target);
    }
  }
  return { files, folders: [...folders] };
}

export const closureHas = (closure, file) => closure.files.has(file) || closure.folders.some((folder) => file.startsWith(folder));

/**
 * The ways a test can name a file it reads as text: its path with or without
 * src/ and the extension, and the folders above it (a test that reads every
 * sheet in src/styles/app names the folder, `src/styles/app/${name}.css`).
 */
export function mentionsOf(file) {
  const bare = file.replace(/^src\//, "");
  const noExt = bare.replace(/\.[^./]+$/, "");
  const names = new Set([file, bare]);
  if (noExt.includes("/")) names.add(noExt);
  for (let dir = path.posix.dirname(file); dir !== "." && dir !== "src"; dir = path.posix.dirname(dir)) {
    names.add(dir);
    const bareDir = dir.replace(/^src\//, "");
    if (bareDir.includes("/")) names.add(bareDir);
  }
  return [...names];
}

// --- the plan ------------------------------------------------------------------

/**
 * files       repo-relative changed paths
 * textOnly    (file) => boolean, for files a `textAware` area claims
 * checks      the verify:static list (CHECKS)
 * closures    Map(check name -> importClosure of its script)
 * unitTests   [{ file, closure, near, text }] for every file `npm test` runs;
 *             `near` is the closure followed only through tests/ (what the
 *             test imports itself or through its own helpers)
 *
 * Returns { full, fullReasons, checks: Map(name -> Set(reason)), build: [reason],
 * specs: [reason], actionlint: [reason], tests: { mode, files, reasons }, areas }.
 */
export function planChecks({ files, textOnly = () => false, checks, closures = new Map(), unitTests = [] }) {
  const plan = {
    full: false,
    fullReasons: [],
    checks: new Map(),
    build: [],
    specs: [],
    actionlint: [],
    tests: { mode: "none", files: new Set(), reasons: [] },
    areas: [],
  };
  const pick = (name, reason) => {
    // The unit tests are planned below (plan.tests); test:coverage is them
    // again with coverage on, and runs only in a full run.
    if (!checks.includes(name) || (name === "test:coverage" && reason !== "full run")) return;
    if (!plan.checks.has(name)) plan.checks.set(name, new Set());
    plan.checks.get(name).add(reason);
  };
  let fullTests = false;
  const related = new Set();

  for (const file of files) {
    const category = categoryOf(file);
    const importers = [...closures].filter(([, closure]) => closureHas(closure, file)).map(([name]) => name);
    plan.areas.push({ file, area: category?.id ?? null, importers });

    if (category?.full) {
      plan.full = true;
      plan.fullReasons.push(`${file}: ${category.label}`);
      continue;
    }
    if (!category && !importers.length) {
      plan.full = true;
      plan.fullReasons.push(`${file}: no area claims it and no check imports it`);
      continue;
    }
    // Words do not move the simulations: gameData.js imports every scene, so
    // every season check imports every scene file, and a reworded line would
    // otherwise run all of them. Words-only keeps the area's own checks.
    const words = Boolean(category?.textAware && textOnly(file));
    if (!words) for (const name of importers) pick(name, `imports ${file}`);
    if (!category) continue;

    let names = category.checks ?? [];
    let label = category.label;
    if (category.textAware) {
      if (words) label = `${category.label}, words only`;
      else {
        label = `${category.label}, more than words`;
        names = [...names, ...SCENE_DATA_CHECKS];
      }
    }
    for (const name of names) pick(name, `${file} (${label})`);
    if (category.build) plan.build.push(file);
    if (category.specs) plan.specs.push(file);
    if (category.actionlint) plan.actionlint.push(file);

    if (TEST_INFRA.test(file)) {
      fullTests = true;
      plan.tests.reasons.push(`${file}: test harness`);
    } else if (category.tests === "full") {
      fullTests = true;
      plan.tests.reasons.push(`${file}: ${label}`);
    } else if (category.tests !== "none") {
      const mentions = mentionsOf(file);
      for (const test of unitTests) {
        const reaches = closureHas(words ? (test.near ?? test.closure) : test.closure, file);
        if (test.file === file || reaches || mentions.some((name) => test.text.includes(name))) related.add(test.file);
      }
    }
  }

  if (plan.full) {
    for (const name of checks) pick(name, "full run");
    plan.tests = { mode: "covered", files: new Set(), reasons: ["test:coverage runs them in the full run"] };
    plan.build = plan.build.length ? plan.build : ["full run"];
    plan.specs = plan.specs.length ? plan.specs : ["full run"];
    return plan;
  }
  if (fullTests || (unitTests.length && related.size === unitTests.length)) plan.tests.mode = "full";
  else if (related.size) {
    plan.tests.mode = "related";
    plan.tests.files = related;
    plan.tests.reasons.push(`${related.size} of ${unitTests.length} test files import or name a changed file`);
  }
  if (plan.tests.mode === "full") plan.tests.files = new Set();
  return plan;
}
