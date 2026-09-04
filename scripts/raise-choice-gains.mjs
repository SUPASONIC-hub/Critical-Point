import { readFileSync, writeFileSync } from "node:fs";
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
 * Run with --dry to list what would change.
 */

const FILES = [
  "src/nodes/case01.js",
  "src/nodes/case02.js",
  "src/nodes/case03.js",
  "src/nodes/case04.js",
  "src/nodes/case05.js",
  "src/nodes/finalCase.js",
  "src/gameData.js",
];

const RESOURCE_KEYS = new Set(["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"]);
const RATE = Number(process.argv.find((arg) => arg.startsWith("--rate="))?.split("=")[1] ?? "0.1");
const dryRun = process.argv.includes("--dry");

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

let totalRaised = 0;
let totalEffects = 0;

for (const file of FILES) {
  const source = readFileSync(file, "utf8");
  const program = parse(source, { ecmaVersion: "latest", sourceType: "module", range: true, loc: true });

  const edits = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isEffectObject(node)) {
      totalEffects += 1;
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
  writeFileSync(file, next, "utf8");
  console.log(`${file}: raised ${edits.length} gains`);
  totalRaised += edits.length;
}

console.log(`${dryRun ? "Would raise" : "Raised"} ${totalRaised} gains across ${totalEffects} effects at ${RATE * 100}% (floor 1).`);
