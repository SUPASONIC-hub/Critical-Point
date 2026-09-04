import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "espree";
import { viewGroups } from "../src/viewModels/appViewModels.js";

/**
 * Runtime size guardrail.
 *
 * `GameRuntime.jsx` is one component function. Splitting the intro out of
 * AppContent (M-1) moved 90KB off the entry chunk but left everything the play
 * and result screens need in a single body: 25 pieces of state, 26 memos, 18
 * refs and 220 imported names, with nothing marking where one concern ended and
 * the next began. Pulling `useCaseSystems` and `useResultReport` out of it was
 * the first cut. Nothing stopped the next feature from putting its derivations
 * straight back in.
 *
 * These are budgets, not measurements: ratchet them down as work lands, never
 * up. A number that has to rise is a decision worth writing down in
 * `docs/work-status.md`, not a constant worth editing quietly.
 */

const root = process.cwd();

const BUDGETS = {
  "src/gameData.js": {
    lines: 2367,
    importedNames: 12,
    hooks: {},
  },
  "src/gameLogic.js": {
    lines: 1240,
    importedNames: 17,
    hooks: {},
  },
  "src/GameRuntime.jsx": {
    lines: 2267,
    importedNames: 167,
    hooks: { useState: 24, useMemo: 18, useEffect: 12, useRef: 18 },
  },
  "src/screens/PlayScreen.jsx": {
    lines: 749,
    importedNames: 17,
    hooks: {},
  },
  "src/screens/ResultScreen.jsx": {
    lines: 914,
    importedNames: 13,
    hooks: {},
  },
};

// One flat bag per screen is how the runtime hands a screen its data, and each
// field is a value the runtime had to derive. The play screen's is the one that
// grew: 153 fields across six groups.
const VIEW_FIELD_BUDGETS = { intro: 82, play: 153, result: 112 };

function analyze(relative) {
  const source = readFileSync(path.join(root, relative), "utf8");
  const program = parse(source, {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  });

  const hooks = {};
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name.startsWith("use")) {
      hooks[node.callee.name] = (hooks[node.callee.name] ?? 0) + 1;
    }
    for (const key of Object.keys(node)) {
      if (key === "range" || key === "loc") continue;
      walk(node[key]);
    }
  };
  walk(program.body);

  return {
    lines: source.split("\n").length,
    importedNames: program.body
      .filter((node) => node.type === "ImportDeclaration")
      .reduce((total, node) => total + node.specifiers.length, 0),
    hooks,
  };
}

const failures = [];
const reported = [];

for (const [relative, budget] of Object.entries(BUDGETS)) {
  const actual = analyze(relative);
  if (actual.lines > budget.lines) {
    failures.push(`${relative} is ${actual.lines} lines, over the ${budget.lines} budget.`);
  }
  if (actual.importedNames > budget.importedNames) {
    failures.push(`${relative} imports ${actual.importedNames} names, over the ${budget.importedNames} budget.`);
  }
  for (const [hook, limit] of Object.entries(budget.hooks)) {
    const count = actual.hooks[hook] ?? 0;
    if (count > limit) {
      failures.push(`${relative} calls ${hook} ${count} times, over the ${limit} budget. Move the new state into a hook of its own.`);
    }
  }
  reported.push(`${relative}: ${actual.lines} lines, ${actual.importedNames} imports`);
}

for (const [screen, limit] of Object.entries(VIEW_FIELD_BUDGETS)) {
  const groups = viewGroups[screen];
  const count = Object.values(groups).reduce((total, fields) => total + fields.length, 0);
  if (count > limit) {
    failures.push(`the ${screen} view bag has ${count} fields, over the ${limit} budget.`);
  }
  reported.push(`${screen} view: ${count} fields`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Runtime budget checks passed (${reported.join("; ")}).`);
}
