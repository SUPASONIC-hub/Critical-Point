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
 *
 * Three moved on 2026-09-09 with the one-decision-one-screen pass. PlayScreen
 * dropped 749 -> 340 and 17 -> 14 imports: everything that is not the scene,
 * the clock, the three standing resources or the choices moved into
 * `RecordRoom`. ResultScreen rose 914 -> 975 and gameData 2367 -> 2375, both
 * for copy the player reads -- the report's second act ("왜 이렇게 됐나", the
 * three cards and the named doors) and the phase rename that stopped shipping
 * "CONNECTIVE SCENE" as a scene name. Maintenance priority 27 records the rule
 * those two numbers now stand for.
 *
 * ResultScreen read 975 / 13 until 2026-09-10, when the pressure ledger landed
 * in `.report-archive`. Maintenance priority 32 records why that number moved:
 * the reducer had been banking reboots and the permanent multiplier they buy
 * since the gauntlet loop, and the player could not see either one.
 */

const root = process.cwd();

const BUDGETS = {
  // 2382 / 12 -> 2384 / 13 on 2026-09-16: the composed graph is handed to
  // `applySceneContext`, so every scene -- authored or generated -- carries the
  // room it happens in, the clock it runs against, and its own question.
  // 2384 / 13 -> 2520 / 14 on 2026-09-16: 사건 06 is a seventh case, and its
  // aftermath, connective, reaction, side-door, hidden-route, evidence-turn and
  // opening tables all live in this file alongside the other six.
  // 2520 / 14 -> 2740 / 15 on 2026-09-16: 사건 07 is an eighth, with the same
  // seven tables again. This file is the season's data, so it grows once per
  // case by roughly the same amount; the ratchet is here to catch logic moving
  // in, not to cap the number of cases the season is allowed to have.
  // 2740 / 15 -> 3120 / 17 on 2026-09-16: 사건 08 and 09, a ninth and tenth case,
  // each with the same seven tables and one node file import.
  "src/gameData.js": {
    lines: 3120,
    importedNames: 17,
    hooks: {},
  },
  // gameLogic read 1240 / 17 until 2026-09-11, when `getEndingVariant` started
  // reading the run's push record. The bet had been invisible to the ending for
  // six cycles: paired seasons at x1.00 and x3.50 flipped 0 of 1000 endings.
  // 1300 -> 1310 when the ending started reading the vault (VAULT_SLACK).
  // 1310 -> 1312 on 2026-09-16: `buildNarrativeSpine` prefers the scene's own
  // question over the template that had been running for all 149 scenes.
  // 1312 -> 1355 on 2026-09-16 for 사건 06's clue, outcomes, carryover and
  // continuity challenge, for re-keying the finale's tables onto it, and for
  // the two collapse gates that now read per case instead of per season.
  // 1355 -> 1370 on 2026-09-16 for 사건 08 and 09's clues, outcomes, carryovers
  // and continuity challenges, the finale's challenges re-keyed onto 사건 09, and
  // `getThinkingMotive`, which names the feeling that woke the run's thinking.
  "src/gameLogic.js": {
    lines: 1395,
    importedNames: 18,
    hooks: {},
  },
  // GameRuntime read 2280 / 167 and PlayScreen 340 / 14 until 2026-09-14, when
  // the gauntlet replaced the decision board. The commit console, the record
  // room, the forecasts, the overtime bill and the reducer they all read went
  // out together, and the play view went from 153 fields to 40.
  // It moved back up 1800 -> 1830 in the second gauntlet cycle for the two
  // handlers a critic's playtest proved missing: saving a touched window so a
  // reload cannot undo a bust, and the blackout skip that lets a bust change
  // the route instead of only the score.
  // 1830 -> 1850 in the fourth cycle: the stale-save lock and the settled-window
  // redeal, which close the last way a second tab could undo a bust.
  // 1850 / 148 -> 1800 / 149 on 2026-09-16: the case intro lines left the body
  // as the `caseIntroEchoes` table (a ternary chain that had stopped at 사건 06),
  // and the unreachable second save-suppression flag went with them.
  "src/GameRuntime.jsx": {
    lines: 1800,
    importedNames: 149,
    hooks: { useState: 24, useMemo: 18, useEffect: 12, useRef: 18 },
  },
  "src/screens/PlayScreen.jsx": {
    lines: 105,
    importedNames: 3,
    hooks: {},
  },
  "src/screens/ResultScreen.jsx": {
    lines: 977,
    importedNames: 14,
    hooks: {},
  },
};

// One flat bag per screen is how the runtime hands a screen its data, and each
// field is a value the runtime had to derive. The play screen's is the one that
// grew, to 153 fields across six groups, before the gauntlet cut it to 40.
const VIEW_FIELD_BUDGETS = { intro: 82, play: 44, result: 112 };

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
