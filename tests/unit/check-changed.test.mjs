import assert from "node:assert/strict";
import test from "node:test";
import { CHECKS } from "../../scripts/verify-static.mjs";
import { categoryOf, importClosure, isTextOnlyChange, maskWords, parseImports, planChecks } from "../../scripts/check-changed-rules.mjs";

/**
 * `npm run check:changed` picks checks from the changed files
 * (scripts/check-changed-rules.mjs). These hold its areas, the words-only test
 * and the full run it falls back to.
 */

const plan = (files, options = {}) => planChecks({ files, checks: CHECKS, ...options });
const picked = (result) => [...result.checks.keys()].sort();

test("every check an area names is one verify:static runs", async () => {
  const { CATEGORIES } = await import("../../scripts/check-changed-rules.mjs");
  for (const category of CATEGORIES) for (const name of category.checks ?? []) assert.ok(CHECKS.includes(name), `${category.id}: ${name}`);
});

test("files land in the area their path says", () => {
  const cases = {
    "src/nodes/case03.js": "text",
    "src/locales/en/nodes/case03.js": "text",
    "src/copy/briefing.js": "text",
    "src/caseCopy.js": "text",
    "src/styles/app/play.css": "css",
    "src/gameLogic.js": "code",
    "src/screens/PlayScreen.jsx": "code",
    "public/icons/icon-192.png": "assets",
    "index.html": "assets",
    "vite.config.js": "build-config",
    "scripts/check-bundle-size.mjs": "build-config",
    "tests/unit/canon.test.mjs": "unit-tests",
    "tests/offline.spec.js": "e2e",
    ".github/workflows/verify.yml": "workflows",
    "supabase/migrations/20261101_x.sql": "database",
    "docs/canon.md": "canon-doc",
    "README.md": "docs",
    "docs/work-status.md": "docs",
    "scripts/check-canon.mjs": "scripts",
    "eslint.config.js": "config",
    "package.json": "toolchain",
    "scripts/verify-static.mjs": "toolchain",
  };
  for (const [file, area] of Object.entries(cases)) assert.equal(categoryOf(file)?.id, area, file);
  assert.equal(categoryOf("LICENSE"), null);
});

test("a reworded line is words only; a changed id, number or added key is not", () => {
  const before = `export const scene = { id: "case03_s2", text: "문을 연다.", gain: 3, next: "case03_s3" }; // 메모`;
  assert.ok(isTextOnlyChange(before, `export const scene = { id: "case03_s2", text: "문을 천천히 연다.", gain: 3, next: "case03_s3" }; // 다른 메모`));
  assert.ok(isTextOnlyChange(`const a = { en: "Open the door" };`, `const a = { en: "Open the door slowly" };`));
  assert.ok(!isTextOnlyChange(before, before.replace("gain: 3", "gain: 4")));
  assert.ok(!isTextOnlyChange(before, before.replace(`next: "case03_s3"`, `next: "case03_s4"`)));
  assert.ok(!isTextOnlyChange(before, before.replace(" };", `, risk: "high" };`)));
  assert.ok(!isTextOnlyChange(null, before), "an added file");
  assert.ok(!isTextOnlyChange(before, null), "a deleted file");
  // A quote inside a comment does not open a string.
  assert.equal(maskWords(`// it's "fine"\nconst x = 1;`), "const x = 1;");
});

test("words in scenes run the word checks and a build, not the season simulations", () => {
  const result = plan(["src/nodes/case03.js"], { textOnly: () => true });
  assert.equal(result.full, false);
  for (const name of ["check:locale:strict", "check:canon", "check:text", "check:dialogue", "check:card-labels", "check:fonts", "check:plain-language"]) {
    assert.ok(result.checks.has(name), name);
  }
  for (const name of ["check:pressure", "check:endings", "check:balance", "test:coverage"]) assert.ok(!result.checks.has(name), name);
  assert.deepEqual(result.build, ["src/nodes/case03.js"]);
});

test("a scene whose numbers changed runs the season checks too", () => {
  const result = plan(["src/nodes/case03.js"], { textOnly: () => false });
  for (const name of ["check:graph", "check:balance", "check:pressure", "check:endings", "lint", "check:types"]) assert.ok(result.checks.has(name), name);
});

test("a stylesheet runs the CSS checks and the build, nothing of the season", () => {
  const result = plan(["src/styles/app/play.css"]);
  assert.deepEqual(picked(result), ["check:css", "check:css-structure", "check:encoding", "format:check"]);
  assert.deepEqual(result.build, ["src/styles/app/play.css"]);
  assert.equal(result.tests.mode, "none");
});

test("app code runs every unit test, lint and types", () => {
  const result = plan(["src/gameLogic.js"]);
  assert.equal(result.tests.mode, "full");
  for (const name of ["lint", "check:types", "check:runtime-budget"]) assert.ok(result.checks.has(name), name);
});

test("a check whose script imports the file runs, with that as the reason", () => {
  const closures = new Map([["check:pressure", { files: new Set(["scripts/report-gauntlet-loop.mjs", "src/gameLogic.js"]), folders: [] }]]);
  const result = plan(["src/gameLogic.js"], { closures });
  assert.ok([...result.checks.get("check:pressure")].some((reason) => reason === "imports src/gameLogic.js"));
  // ...but not for a words-only change to a scene it reaches through gameData.js.
  const scene = new Map([["check:pressure", { files: new Set(["src/nodes/case03.js"]), folders: [] }]]);
  assert.ok(!plan(["src/nodes/case03.js"], { closures: scene, textOnly: () => true }).checks.has("check:pressure"));
});

test("workflows run check:specs and actionlint; documents run the doc numbers", () => {
  const workflow = plan([".github/workflows/verify.yml"]);
  assert.deepEqual(workflow.specs, [".github/workflows/verify.yml"]);
  assert.deepEqual(workflow.actionlint, [".github/workflows/verify.yml"]);
  assert.ok(workflow.checks.has("check:node"));
  const docs = plan(["README.md"]);
  assert.deepEqual(picked(docs), ["check:doc-numbers", "check:visual-baselines"]);
  assert.deepEqual(docs.build, []);
});

test("an unknown file, the package or the check list itself runs everything", () => {
  for (const file of ["LICENSE", "package.json", "package-lock.json", "scripts/verify-static.mjs"]) {
    const result = plan(["README.md", file]);
    assert.equal(result.full, true, file);
    assert.deepEqual(picked(result), [...CHECKS].sort(), file);
  }
});

test("related unit tests: those that import or name the file; the harness runs them all", () => {
  const unitTests = [
    { file: "tests/unit/a.test.mjs", closure: { files: new Set(["src/copy/briefing.js"]), folders: [] }, near: { files: new Set(["src/copy/briefing.js"]), folders: [] }, text: "" },
    { file: "tests/unit/b.test.mjs", closure: { files: new Set(["src/gameData.js", "src/nodes/case03.js"]), folders: [] }, near: { files: new Set(["src/gameData.js"]), folders: [] }, text: "" },
    { file: "tests/unit/c.test.mjs", closure: { files: new Set(), folders: [] }, text: `readFileSync("src/styles/app/play.css")` },
  ];
  const copy = plan(["src/copy/briefing.js"], { textOnly: () => true, unitTests });
  assert.equal(copy.tests.mode, "related");
  assert.deepEqual([...copy.tests.files], ["tests/unit/a.test.mjs"]);
  // Words reach b only through gameData.js; numbers reach it.
  assert.deepEqual([...plan(["src/nodes/case03.js"], { textOnly: () => true, unitTests }).tests.files], []);
  assert.deepEqual([...plan(["src/nodes/case03.js"], { textOnly: () => false, unitTests }).tests.files], ["tests/unit/b.test.mjs"]);
  assert.deepEqual([...plan(["src/styles/app/play.css"], { unitTests }).tests.files], ["tests/unit/c.test.mjs"]);
  assert.equal(plan(["tests/unit/helpers/storage.js"], { unitTests }).tests.mode, "full");
});

test("a test names a file by its path or a folder above it", async () => {
  const { mentionsOf } = await import("../../scripts/check-changed-rules.mjs");
  assert.deepEqual(mentionsOf("src/styles/app/play.css").sort(), ["src/styles", "src/styles/app", "src/styles/app/play.css", "styles/app", "styles/app/play", "styles/app/play.css"]);
  assert.ok(!mentionsOf("src/gameLogic.js").includes("src"));
});

test("imports: static, re-exported, dynamic, template and glob, resolved to files", () => {
  const parsed = parseImports(
    [
      `import { a } from "./a.js";`,
      `export { b } from "../b";`,
      `import "./side.css";`,
      `const c = await import("./c.jsx");`,
      "const d = import(`./nodes/${id}.js`);",
      `const e = import.meta.glob("./*/late/*.js");`,
      `import React from "react";`,
    ].join("\n"),
  );
  assert.deepEqual(parsed.specifiers.sort(), ["../b", "./a.js", "./c.jsx", "./side.css"]);
  assert.deepEqual(parsed.folders.sort(), ["./", "./nodes/"]);

  const sources = {
    "src/main.js": `import "./x.js"; import { y } from "./lib";`,
    "src/x.js": `export const x = 1;`,
    "src/lib/index.js": `import { z } from "../z.js"; export const y = 2;`,
    "src/z.js": ``,
  };
  const closure = importClosure("src/main.js", { read: (file) => sources[file] ?? null, exists: (file) => file in sources });
  assert.deepEqual([...closure.files].sort(), ["src/lib/index.js", "src/main.js", "src/x.js", "src/z.js"]);
  const near = importClosure("src/main.js", { read: (file) => sources[file] ?? null, exists: (file) => file in sources, stopAt: (file) => file === "src/lib/index.js" });
  assert.ok(!near.files.has("src/z.js"));
});
