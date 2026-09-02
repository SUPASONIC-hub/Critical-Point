/**
 * CSS structure check.
 *
 * The five files under src/styles/app are a cascade, so the same selector can
 * legitimately appear in an earlier file and again in a later one that has to
 * outrank it. That freedom is also how a selector ends up with three homes and
 * nobody can say what it computes to without replaying the import order by hand.
 *
 * This keeps the count from growing: a selector defined at the top level of more
 * than one file, or twice in one file under the same media context, has to be
 * one of the known leftovers. Both budgets are ratchets -- lower them as the
 * leftovers are cleaned up, never raise them.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const APP_DIR = "src/styles/app";
const IMPORT_ORDER = readFileSync("src/styles/app.css", "utf8")
  .split(/\r?\n/)
  .map((line) => line.match(/@import "\.\/app\/([^"]+)"/)?.[1])
  .filter(Boolean);

const budgets = {
  // Selectors that still live in two files. Every one of these is a shared
  // prelude whose other selectors belong elsewhere, so splitting it would copy
  // declarations rather than remove them.
  selectorsWithTwoHomes: 8,
  // A selector overridden later in the same file is ordinary CSS and readable in
  // one pass -- unlike the same override hiding in another file -- so this budget
  // is deliberately looser. It should still only go down.
  repeatedInOneFile: 51,
};

/** Every rule, in cascade order, tagged with the at-rules it sits inside. */
function readRules() {
  const rules = [];
  for (const file of IMPORT_ORDER) {
    const css = readFileSync(`${APP_DIR}/${file}`, "utf8");
    const stack = [];
    let index = 0;
    let preludeStart = 0;
    while (index < css.length) {
      if (css[index] === "/" && css[index + 1] === "*") {
        index = css.indexOf("*/", index) + 2;
        continue;
      }
      if (css[index] === "{") {
        const prelude = css.slice(preludeStart, index).trim();
        if (prelude.startsWith("@")) {
          stack.push(prelude);
          index += 1;
        } else {
          const end = css.indexOf("}", index);
          rules.push({ file, context: stack.join(" && "), selector: prelude.replace(/\s+/g, " ") });
          index = end + 1;
        }
        preludeStart = index;
        continue;
      }
      if (css[index] === "}") {
        stack.pop();
        index += 1;
        preludeStart = index;
        continue;
      }
      index += 1;
    }
  }
  return rules;
}

const failures = [];

const onDisk = readdirSync(APP_DIR).filter((entry) => entry.endsWith(".css")).sort();
const imported = [...IMPORT_ORDER].sort();
assert.deepEqual(
  onDisk,
  imported,
  `every file in ${APP_DIR} must be imported by app.css: on disk ${onDisk.join(", ")}, imported ${imported.join(", ")}`,
);

const rules = readRules();

const homes = new Map();
for (const rule of rules) {
  if (rule.context !== "") continue;
  for (const selector of rule.selector.split(",").map((part) => part.trim()).filter(Boolean)) {
    if (!homes.has(selector)) homes.set(selector, new Set());
    homes.get(selector).add(rule.file);
  }
}
const twoHomes = [...homes].filter(([, files]) => files.size > 1);
if (twoHomes.length > budgets.selectorsWithTwoHomes) {
  failures.push(
    `${twoHomes.length} selectors are defined at the top level of more than one file; budget is ${budgets.selectorsWithTwoHomes}.\n` +
      twoHomes.map(([selector, files]) => `    ${selector} -- ${[...files].join(", ")}`).join("\n"),
  );
}

const seen = new Map();
for (const rule of rules) {
  const key = `${rule.file}||${rule.context}||${rule.selector}`;
  seen.set(key, (seen.get(key) ?? 0) + 1);
}
const repeats = [...seen.values()].reduce((sum, count) => sum + count - 1, 0);
if (repeats > budgets.repeatedInOneFile) {
  failures.push(`${repeats} rules repeat a selector inside one file; budget is ${budgets.repeatedInOneFile}.`);
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `CSS structure checks passed (${rules.length} rules, ${twoHomes.length}/${budgets.selectorsWithTwoHomes} selectors with two homes, ${repeats}/${budgets.repeatedInOneFile} repeated in one file).`,
);
