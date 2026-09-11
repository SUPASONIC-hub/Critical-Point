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
 *
 * The budgets read 8 and 51 until 2026-09-03, when the parser below stopped
 * losing its place at a comment written in front of an at-rule. It had been
 * swallowing everything after such a comment as a single rule, which hid two
 * selectors with two homes and two repeats. Nothing in the stylesheets changed;
 * the count did.
 *
 * base-intro-ranking.css read 1690 lines / 35349 bytes until 2026-09-09, when
 * the intro gained the cold-open drawers.
 *
 * play.css read 3292 lines / 68581 bytes until 2026-09-09, when the commit
 * console gained the target-lock rows, and 3338 / 69629 until later the same
 * day, when the record room, the play rail and the decision clock landed. That
 * pass removed far more markup than it added CSS: the stylesheet grew 5KB and
 * the phone's play screen lost more than half its height. The file budgets are sized to the file
 * as it stands, so a surface that grows has to move its number; the two
 * duplication budgets above are the ones that only go down.
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
  selectorsWithTwoHomes: 9,
  // A selector overridden later in the same file is ordinary CSS and readable in
  // one pass -- unlike the same override hiding in another file -- so this budget
  // is deliberately looser. It should still only go down.
  repeatedInOneFile: 50,
};

const fileBudgets = {
  // base-intro-ranking.css read 1795 / 38900 until 2026-09-10, when the intro
  // was redesigned into the full-bleed cold open. The file grew because it
  // absorbed the intro's second home: `.intro-shell`, `.intro`, `.intro > p`
  // and `.intro-visual` each had a definition here and an override in the
  // late-overrides block at the foot of the file, and every one of those pairs
  // collapsed into one rule. The line count went up, the number of places you
  // have to read to know what the intro computes to went down.
  "base-intro-ranking.css": { lines: 2060, bytes: 48700 },
  // extensions.css read 2193 / 45440 until the 2026-09-10 pass, which repainted
  // .play-style-unlock for the field it actually sits on, and 2200 / 45900 until
  // 2026-09-11, when 85 selectors naming classes no JSX renders any more came
  // out of four of these files. Nothing changed on screen; the sheets stopped
  // describing surfaces that were deleted, in some cases two refactors ago.
  "extensions.css": { lines: 2060, bytes: 44900 },
  // play.css lost the most to the 2026-09-11 prune: the record-room pass removed
  // the identity strip, the repeated scene question and the status board, and
  // their rules stayed behind. It read 3290 / 72600 after that and moved back up
  // for `.commit-push`, the control that raises the pot -- a surface that did not
  // exist before, because until then the only way to push your luck was to sit
  // still and let the clock do it.
  "play.css": { lines: 3325, bytes: 74100 },
  "recovery.css": { lines: 266, bytes: 5754 },
  "responsive.css": { lines: 380, bytes: 8400 },
  "result.css": { lines: 1380, bytes: 30400 },
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
        // The prelude restarts after a comment. Without this a comment sitting
        // in front of an at-rule made the prelude read as "/* ... */ @media",
        // which does not start with "@", so the whole block was consumed as one
        // rule and every rule after it in that file looked top-level.
        preludeStart = index;
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

for (const file of onDisk) {
  const css = readFileSync(`${APP_DIR}/${file}`, "utf8");
  const budget = fileBudgets[file];
  if (!budget) {
    failures.push(`${file} has no CSS size budget.`);
    continue;
  }
  const lines = css.split(/\r?\n/).length;
  if (lines > budget.lines) failures.push(`${file} is ${lines} lines, over the ${budget.lines} budget.`);
  if (css.length > budget.bytes) failures.push(`${file} is ${css.length} bytes, over the ${budget.bytes} budget.`);
}

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
