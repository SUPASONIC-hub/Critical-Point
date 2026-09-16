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
  // 9 -> 0 on 2026-09-15: the glass pass gave every leftover one home.
  selectorsWithTwoHomes: 0,
  // A selector overridden later in the same file is ordinary CSS and readable in
  // one pass -- unlike the same override hiding in another file -- so this budget
  // is deliberately looser. It should still only go down.
  // 50 -> 23 on 2026-09-15, ratcheted to what the glass pass left.
  repeatedInOneFile: 23,
};

const fileBudgets = {
  // base-intro-ranking.css read 1795 / 38900 until 2026-09-10, when the intro
  // was redesigned into the full-bleed cold open. The file grew because it
  // absorbed the intro's second home: `.intro-shell`, `.intro`, `.intro > p`
  // and `.intro-visual` each had a definition here and an override in the
  // late-overrides block at the foot of the file, and every one of those pairs
  // collapsed into one rule. The line count went up, the number of places you
  // have to read to know what the intro computes to went down.
  // 2000 / 47400 -> 2460 / 58400 on 2026-09-15 for the night-shift glass
  // pass: the full-bleed hero with its stat row, the drawer grid, the roadmap
  // card grid and phone rail, and a ranking screen with its own podium rows.
  // The dossier's "square everything" reset went; rounded surfaces now come
  // from the shared --ui-* tokens rather than per-rule literals.
  "base-intro-ranking.css": { lines: 2460, bytes: 58400 },
  // extensions.css read 2193 / 45440 until the 2026-09-10 pass, which repainted
  // .play-style-unlock for the field it actually sits on, and 2200 / 45900 until
  // 2026-09-11, when 85 selectors naming classes no JSX renders any more came
  // out of four of these files. Nothing changed on screen; the sheets stopped
  // describing surfaces that were deleted, in some cases two refactors ago.
  // 1410 / 29200 -> 1430 / 29900 on 2026-09-15: the ending sequence's frame,
  // beat card and witness cards moved onto the glass surfaces.
  // 1430 / 29900 -> 1370 / 28700 on 2026-09-16 when the chapter dashboard, the
  // choice panel and the decision dock lost the last rules that named them.
  "extensions.css": { lines: 1370, bytes: 28700 },
  // play.css lost the most to the 2026-09-11 prune: the record-room pass removed
  // the identity strip, the repeated scene question and the status board, and
  // their rules stayed behind. It read 3290 / 72600 after that and moved back up
  // for `.commit-push`, the control that raises the pot -- a surface that did not
  // exist before, because until then the only way to push your luck was to sit
  // still and let the clock do it.
  // All of play.css went on 2026-09-14 with the board it styled: 3320 lines
  // became the header, the reveal and the report panels that other screens
  // still render, plus the gauntlet table. Every file below was ratcheted to
  // what the same prune left in it.
  // 1321 / 24541 -> 1515 / 28847 on 2026-09-15 for the beat: the approach ring
  // on the push button, the grade call-outs, the combo badge, fever and the
  // flash layer. Every rule is an overlay -- absolute or fixed, transform and
  // opacity only -- so the phone's one-screen table did not get taller.
  // 1515 / 28847 -> 1739 / 34222 later the same day for the fit pass: the
  // phone header, the compact rules panel and relic icons, the short-phone
  // scene, the odd-card row, the two-pane wide table. A measurement found 42 of
  // 149 scenes hiding a card under the action bar on a phone; these rules are
  // what put all of them back above it.
  // 1739 / 34222 -> 1858 / 36660 for the FOCUS lock: the third verb in the
  // gauntlet action bar, its HUD charge rail, mobile fit, and reduced-motion
  // reticle handling.
  // 1858 / 36660 -> 1916 / 37752 for focus modes: STRIKE / STEADY / EXPOSE
  // segmented controls, active-mode glow, and mobile compaction.
  // 1916 / 37752 -> 1965 / 38879 for stance mastery: the season-level LOCK
  // progress rail in the gauntlet bank, with mode-colored bars and compact text.
  // 1965 / 38879 -> 3045 / 62300 on 2026-09-15 for the glass table: the
  // drained clock ring, the ticked gauge tube, tactile cards with key hints and
  // sealed/fractured/wild states, the mastery rail folded into the segmented
  // stance control, the floating dock, the vertically composed wide table, and
  // the five minified .gx-* lines that used to sit after app.css's imports and
  // silently outrank this file. The phone table still fits all 149 scenes.
  // 3045 / 62300 -> 3080 / 63200 on 2026-09-16 for the scene dateline: place and
  // clock above the speaker, plus the briefing's lead line and the case memo --
  // which every scene had carried since the graph was written and which had
  // never reached the DOM, so the briefing explained the table and not the
  // situation. One 11px row; the phone table still fits all 149 scenes.
  // 3070 / 63000 -> 3210 / 67400 on 2026-09-16 for the scene plate: the
  // `--plate-*` palette, a faded backdrop behind the scene header and a
  // readable copy inside the briefing. The drawing itself is SVG built in
  // `ScenePlate.jsx`, so this is the whole stylesheet cost of giving all 169
  // scenes a picture, and the backdrop is absolutely positioned so the table
  // keeps every pixel of the one screen priority 27 gives it.
  "play.css": { lines: 3210, bytes: 67400 },
  "recovery.css": { lines: 270, bytes: 5754 },
  // relics.css arrived on 2026-09-15 with the relic draft, sized to the file.
  // 460 / 9400 -> 465 / 9510 on 2026-09-15 when the draft became a glass modal.
  "relics.css": { lines: 465, bytes: 9510 },
  "responsive.css": { lines: 200, bytes: 4700 },
  // 1225 / 25700 -> 1750 / 43100 on 2026-09-15: the result screen stopped
  // mixing white report cards into a dark page. The hero card and rank ring, the
  // tool dock, the lead row, the metric tile grid, and dark surfaces for about
  // twenty archive panels that each used to paint their own light ground; the
  // table ledger's rules also moved here from the foot of app.css.
  // 1750 / 43100 -> 1772 / 43650 on 2026-09-16: the next-case panel says which
  // building the season moves to and why, from the `operatorBriefs` table that
  // had been written and never read.
  // 1772 / 43650 -> 1815 / 44800 on 2026-09-16 for the 막간 panel: the beat
  // between two cases, with a mood tint, on the report's only unpressured
  // screen. Six cases in one register was the state this panel exists to break.
  "result.css": { lines: 1815, bytes: 44800 },
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
