import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "espree";
import { costWhenRising } from "../src/gameConstants.js";

/**
 * Raise what a choice gives, leaving what it charges alone.
 *
 * The gain side of every authored effect goes up by a tenth, never by less than
 * one point. The cost side is untouched, which is what keeps `check:balance`
 * meaningful: every choice still charges something, every resource still moves
 * both ways, `humanCost` is still on the same choices, and the fatigue
 * recoveries are still the same set.
 *
 * The map is strictly increasing, so it cannot create a domination that was not
 * already there. On any one resource the order between two siblings is decided
 * by comparing their values, and applying an increasing function to the gains
 * while fixing the costs preserves every one of those comparisons: a gain still
 * beats a cost, a larger gain still beats a smaller one, and equal stays equal.
 * Being injective, it also cannot collapse two distinct effect vectors into one,
 * so the uniqueness floor is unaffected.
 *
 * What it can move is the season: resources cap at 100, so bigger gains reach
 * the cap sooner and the endings written against thresholds shift underneath.
 * `npm run check:endings` is what has to be read after running this.
 *
 *   (no arguments)   list what would change, and write nothing
 *   --write          change the files. Refused unless the working tree is
 *                    clean, so that `git diff` afterwards is this run and
 *                    nothing else, and `git restore .` takes it back
 *   --rate=0.1       the fraction a gain goes up by
 *   --dry            the default, by its old name
 *
 * It used to be the other way round: it wrote unless it was given exactly
 * `--dry`, so `--dry-run`, `--help`, a typo and no arguments at all each
 * rewrote every effect number in the season -- and a second run did it again
 * on top of the first, since a raise of a raise is not undone by taking one
 * back. An argument it does not know now stops it before it reads a file.
 */

/**
 * Where the authored effects are: every case file, the tables in gameData.js
 * and the memory cards in seasonRules.js. The case files are read from the folder. They used to be a list
 * of eleven names written here when the season was ten cases long; by the time
 * it was fifty-five the list still said eleven, so a run would have raised the
 * first nine cases and the finale by a tenth, left forty-six cases where they
 * were, and printed a success line.
 */
const CASE_DIR = "src/nodes";
const AUTHORED = [
  ...readdirSync(CASE_DIR)
    .filter((entry) => entry.endsWith(".js"))
    .sort()
    .map((entry) => `${CASE_DIR}/${entry}`),
  "src/gameData.js",
  // What a memory card gives. It was written in gameData.js until the rules
  // that read the season's tables moved out of it.
  "src/seasonRules.js",
];

/**
 * Files that hold an object shaped like an effect and are not raised, each with
 * the reason. Anything else under src/ that holds one stops the run: a new home
 * for authored effects has to be added above, or named here, by someone who
 * looked.
 */
const NOT_AUTHORED = {
  "src/advancedSystems.js": "what an operator's origin starts a run with, applied once",
  "src/gauntlet/gauntletEngine.js": "what the table itself bills on a bust, tuned by check:pressure",
  "src/caseCopy.js": "what a NEW GAME+ rank carries into the next run, not what a choice gives",
  "src/gameConstants.js": "the resources a run starts with",
  "src/gameLogic.js": "season wear and the reframe card's price: rules, read by check:endings",
  "src/riskLogic.js": "defaults for a pressure reading, not an effect",
  "src/state/useChoiceCommit.js": "the clue bonus, one rule for every scene",
};

/**
 * A carryover is what a case's close does to the next case's opening, not what
 * a choice gives. A pack keeps its own beside its scenes, and they are left
 * alone here.
 */
const NOT_RAISED_TABLES = new Set(["carryovers"]);

const RESOURCE_KEYS = new Set(["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"]);
const USAGE = "Usage: node scripts/raise-choice-gains.mjs [--write] [--rate=0.1]   (without --write it only lists what would change)";
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const unknown = args.filter((arg) => !["--write", "--dry"].includes(arg) && !/^--rate=/.test(arg));
if (unknown.length) {
  console.error(`Unknown argument${unknown.length === 1 ? "" : "s"}: ${unknown.join(" ")}. Nothing was read or written.\n${USAGE}`);
  process.exit(2);
}
const RATE = Number(args.find((arg) => arg.startsWith("--rate="))?.split("=")[1] ?? "0.1");
if (!Number.isFinite(RATE) || RATE <= 0 || RATE > 1) {
  console.error(`--rate has to be a fraction above 0 and at most 1; got "${args.find((arg) => arg.startsWith("--rate="))}". Nothing was read or written.`);
  process.exit(2);
}
// Writing is asked for by name, and `--dry` beside it still wins.
const dryRun = !args.includes("--write") || args.includes("--dry");

/**
 * A write lands on top of whatever the working tree holds. On a clean tree the
 * diff afterwards is exactly this run; on a dirty one it is this run mixed
 * into someone's unfinished edit, with no way to take one back without the
 * other. A tree git cannot describe is treated as dirty.
 */
if (!dryRun) {
  let status;
  try {
    status = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" });
  } catch (error) {
    console.error(`--write needs a git working tree to check, and \`git status\` failed: ${String(error.message).split("\n")[0]}. Nothing was written.`);
    process.exit(1);
  }
  if (status.trim()) {
    console.error(
      "--write changes about sixty files, and the working tree already has changes in it:\n" +
        status.split(/\r?\n/).filter(Boolean).slice(0, 8).map((line) => `  ${line}`).join("\n") +
        "\nCommit or set them aside first. Nothing was written.",
    );
    process.exit(1);
  }
}

/** Strictly increasing in the magnitude, so sibling orderings survive it. */
function raised(magnitude) {
  return magnitude + Math.max(1, Math.round(magnitude * RATE));
}

function numericLiteral(node) {
  if (node.type === "Literal" && typeof node.value === "number") return { value: node.value, negated: false };
  if (node.type === "UnaryExpression" && node.operator === "-" && node.argument.type === "Literal") {
    return { value: -node.argument.value, negated: true };
  }
  return null;
}

function propertyName(property) {
  if (property.key.type === "Identifier") return property.key.name;
  if (property.key.type === "Literal") return String(property.key.value);
  return null;
}

/** An object whose every key is a resource is an effect, wherever it is written. */
function isEffectObject(node) {
  if (node.type !== "ObjectExpression" || node.properties.length === 0) return false;
  return node.properties.every((property) => {
    if (property.type !== "Property" || property.computed) return false;
    const name = propertyName(property);
    return name !== null && RESOURCE_KEYS.has(name) && numericLiteral(property.value) !== null;
  });
}

/** Every effect object in a file, with the gains it holds. */
function readEffects(file) {
  const source = readFileSync(file, "utf8");
  const program = parse(source, { ecmaVersion: "latest", sourceType: "module", range: true, loc: true });
  const edits = [];
  let effects = 0;
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node.type === "Property" && !node.computed && NOT_RAISED_TABLES.has(propertyName(node))) return;
    if (isEffectObject(node)) {
      effects += 1;
      for (const property of node.properties) {
        const key = propertyName(property);
        const { value } = numericLiteral(property.value);
        const isGain = costWhenRising.has(key) ? value < 0 : value > 0;
        if (!isGain || value === 0) continue;
        const next = value < 0 ? -raised(-value) : raised(value);
        edits.push({ range: property.value.range, text: String(next), line: property.loc.start.line, key, value, next });
      }
      // An effect object holds no nested effects.
      return;
    }
    for (const key of Object.keys(node)) {
      if (key === "range" || key === "loc") continue;
      walk(node[key]);
    }
  };
  walk(program.body);
  return { source, edits, effects };
}

function sourceFiles(directory = "src") {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) found.push(...sourceFiles(relative));
    else if (entry.name.endsWith(".js")) found.push(relative);
  }
  return found;
}

// Before anything is written: is every file that holds effects accounted for?
const authored = new Set(AUTHORED);
const unaccounted = [];
for (const file of sourceFiles()) {
  if (authored.has(file) || file in NOT_AUTHORED) continue;
  const { effects } = readEffects(file);
  if (effects > 0) unaccounted.push(`${file} (${effects} effect objects)`);
}
const gone = Object.keys(NOT_AUTHORED).filter((file) => {
  try {
    return readEffects(file).effects === 0;
  } catch {
    return true;
  }
});
if (unaccounted.length || gone.length) {
  if (unaccounted.length) {
    console.error(
      `These files hold effect objects and this script would have left them out:\n  ${unaccounted.join("\n  ")}\n` +
        `Add each to AUTHORED, or to NOT_AUTHORED with the reason it is not raised.`,
    );
  }
  if (gone.length) console.error(`NOT_AUTHORED names files that hold no effect object any more: ${gone.join(", ")}. Remove them.`);
  process.exit(1);
}

let totalRaised = 0;
let totalEffects = 0;
let filesWithEffects = 0;

for (const file of AUTHORED) {
  const { source, edits, effects } = readEffects(file);
  totalEffects += effects;
  if (effects > 0) filesWithEffects += 1;

  if (dryRun) {
    console.log(`${file}: ${edits.length} gains would rise`);
    for (const edit of edits.slice(0, 4)) {
      console.log(`  ${edit.line}: ${edit.key} ${edit.value} -> ${edit.next}`);
    }
    totalRaised += edits.length;
    continue;
  }

  let next = source;
  for (const edit of edits.sort((a, b) => b.range[0] - a.range[0])) {
    next = next.slice(0, edit.range[0]) + edit.text + next.slice(edit.range[1]);
  }
  if (next !== source) writeFileSync(file, next, "utf8");
  console.log(`${file}: raised ${edits.length} gains`);
  totalRaised += edits.length;
}

console.log(
  `${dryRun ? "Would raise" : "Raised"} ${totalRaised} gains across ${totalEffects} effects in ${filesWithEffects} of ${AUTHORED.length} files ` +
    `at ${RATE * 100}% (floor 1).`,
);
if (dryRun) console.log("Nothing was written. Run again with --write, on a clean working tree, to change the files.");
else console.log("Read `npm run check:endings` and `npm run check:balance` before committing. `git restore src` takes this run back.");
