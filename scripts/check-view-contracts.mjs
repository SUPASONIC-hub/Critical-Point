/**
 * Screen view contract check.
 *
 * AppContent hands each screen one flat bag of fields; appViewModels groups that
 * bag by concern. Two things can silently break: a field the screen reads that
 * nobody wired, and a field wired into a group the screen does not read it from.
 * Both surface as `undefined` at render time rather than as an error, so this
 * check compares the three sides -- what AppContent provides, how the view model
 * groups it, and what each screen reads -- before the app ever runs.
 */
import { readFileSync } from "node:fs";
import { parse } from "espree";
import { INTRO_FIELDS_WITHOUT_RUNTIME, viewGroups } from "../src/viewModels/appViewModels.js";

const VIEW_FACTORIES = {
  createIntroView: "intro",
  createResultView: "result",
  createPlayView: "play",
};
const SCREEN_FILES = {
  intro: "src/screens/IntroScreen.jsx",
  result: "src/screens/ResultScreen.jsx",
  play: "src/screens/PlayScreen.jsx",
};

function parseFile(file) {
  return parse(readFileSync(file, "utf8"), {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  });
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  if (typeof node.type === "string") visit(node);
  for (const key of Object.keys(node)) walk(node[key], visit);
}

function propertyName(property) {
  return property.key.type === "Identifier" ? property.key.name : property.key.value;
}

const VIEW_PROVIDER_FILES = [
  "src/AppContent.jsx",
  "src/GameRuntime.jsx",
  "src/viewModels/introViewModel.js",
];
/**
 * A screen's bag is assembled in one place. The intro used to be assembled twice
 * -- once by the pre-start shell and once by the runtime -- and the two copies
 * drifted into printing different sentences, so this is a rule now rather than a
 * convention.
 */
const ASSEMBLED_IN = {
  intro: "src/viewModels/introViewModel.js",
  play: "src/GameRuntime.jsx",
  result: "src/GameRuntime.jsx",
};

/** Field names passed into each create*View call, and the file that passes them. */
function readProvidedFields(problems) {
  const provided = {};
  const assembledBy = {};
  for (const file of VIEW_PROVIDER_FILES) {
    walk(parseFile(file), (node) => {
      if (node.type !== "CallExpression") return;
      if (node.callee.type !== "Identifier") return;
      const screen = VIEW_FACTORIES[node.callee.name];
      if (!screen) return;
      const fields = [];
      for (const argument of node.arguments) {
        if (argument.type !== "ObjectExpression") continue;
        for (const property of argument.properties) {
          if (property.type !== "Property") {
            throw new Error(`${node.callee.name} spreads into its view bag; the contract cannot be read statically.`);
          }
          fields.push(propertyName(property));
        }
      }
      if (assembledBy[screen] && assembledBy[screen] !== file) {
        problems.push(
          `${screen}: assembled in both ${assembledBy[screen]} and ${file}. One file builds a screen's bag; ` +
            "give the second caller the arguments it needs instead of a second copy of the bag.",
        );
        return;
      }
      assembledBy[screen] = file;
      provided[screen] = fields;
    });
  }
  for (const [screen, file] of Object.entries(ASSEMBLED_IN)) {
    if (assembledBy[screen] && assembledBy[screen] !== file) {
      problems.push(`${screen}: expected ${file} to assemble this view, found ${assembledBy[screen]}.`);
    }
  }
  return provided;
}

/** Names a screen reads, as { flat: Set, grouped: Map<group, Set> }. */
function readScreenReads(file, groupNames) {
  const flat = new Set();
  const grouped = new Map();
  const addGrouped = (group, field) => {
    if (!grouped.has(group)) grouped.set(group, new Set());
    grouped.get(group).add(field);
  };
  walk(parseFile(file), (node) => {
    // const { a, group: { b } } = view;
    if (
      node.type === "VariableDeclarator" &&
      node.init?.type === "Identifier" &&
      node.init.name === "view" &&
      node.id.type === "ObjectPattern"
    ) {
      for (const property of node.id.properties) {
        if (property.type === "RestElement") continue;
        const name = propertyName(property);
        const value = property.value;
        if (value.type === "ObjectPattern") {
          for (const inner of value.properties) {
            if (inner.type === "RestElement") continue;
            addGrouped(name, propertyName(inner));
          }
        } else {
          flat.add(name);
        }
      }
    }
    // view.x and view.group.y
    if (node.type === "MemberExpression" && !node.computed) {
      if (node.object.type === "Identifier" && node.object.name === "view") {
        flat.add(node.property.name);
      } else if (
        node.object.type === "MemberExpression" &&
        !node.object.computed &&
        node.object.object.type === "Identifier" &&
        node.object.object.name === "view" &&
        // Only a known group name means view.group.field; anything else is a
        // plain field whose value happens to be an object.
        groupNames.includes(node.object.property.name)
      ) {
        addGrouped(node.object.property.name, node.property.name);
      }
    }
  });
  return { flat, grouped };
}

const problems = [];
const provided = readProvidedFields(problems);

// The fields the pre-start shell cannot supply carry one agreed empty value, kept
// in the contract module rather than at either call site. Every name listed there
// has to be a field of the intro, so an emptied field cannot quietly leave the
// schema and stop being checked.
const introSchemaFields = Object.values(viewGroups.intro).flat();
for (const field of Object.keys(INTRO_FIELDS_WITHOUT_RUNTIME)) {
  if (!introSchemaFields.includes(field)) {
    problems.push(`intro: INTRO_FIELDS_WITHOUT_RUNTIME names ${field}, which the intro view does not have.`);
  }
}

for (const [screen, groups] of Object.entries(viewGroups)) {
  const groupNames = Object.keys(groups);
  const schemaFields = Object.values(groups).flat();
  const providedFields = provided[screen];
  if (!providedFields) {
    problems.push(`${screen}: nothing builds this view. ${ASSEMBLED_IN[screen] ?? "A provider file"} should.`);
    continue;
  }
  const providedSet = new Set(providedFields);

  const duplicated = schemaFields.filter((field, index) => schemaFields.indexOf(field) !== index);
  if (duplicated.length > 0) problems.push(`${screen}: field(s) in more than one group -- ${[...new Set(duplicated)].join(", ")}`);

  const collisions = groupNames.filter((name) => providedSet.has(name));
  if (collisions.length > 0) problems.push(`${screen}: group name(s) shadow a field -- ${collisions.join(", ")}`);

  const grouped = new Set(schemaFields);
  const ungrouped = providedFields.filter((field) => !grouped.has(field));
  if (ungrouped.length > 0) problems.push(`${screen}: provided but in no group -- ${ungrouped.join(", ")}`);

  const unwired = schemaFields.filter((field) => !providedSet.has(field));
  if (unwired.length > 0) problems.push(`${screen}: grouped but never provided -- ${unwired.join(", ")}`);

  const reads = readScreenReads(SCREEN_FILES[screen], groupNames);
  for (const field of reads.flat) {
    if (!grouped.has(field) && !groupNames.includes(field)) {
      problems.push(`${SCREEN_FILES[screen]}: reads view.${field}, which no group provides`);
    }
  }
  for (const [group, fields] of reads.grouped) {
    if (!groups[group]) {
      problems.push(`${SCREEN_FILES[screen]}: reads group "${group}", which the ${screen} view does not define`);
      continue;
    }
    for (const field of fields) {
      if (!groups[group].includes(field)) {
        const actual = groupNames.find((name) => groups[name].includes(field));
        problems.push(
          `${SCREEN_FILES[screen]}: reads ${group}.${field}, but ${field} ${actual ? `lives in "${actual}"` : "is not in the view"}`,
        );
      }
    }
  }
}

if (problems.length > 0) {
  console.error("View contract check failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const total = Object.values(viewGroups).reduce((sum, groups) => sum + Object.values(groups).flat().length, 0);
console.log(`View contract check passed for ${Object.keys(viewGroups).length} screens (${total} fields).`);
