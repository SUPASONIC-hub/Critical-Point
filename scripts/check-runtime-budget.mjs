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

// `longestLine` is a cap on one line's length in characters, set on
// 2026-10-15 at what each file measured, rounded up to the next ten. A line
// budget alone can be met by joining lines: GameRuntime held 980 while two of
// its lines ran to 1,448 and 589 characters, each a view bag every branch
// appended a name to, so every two such branches conflicted on one line.

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
  // 3120 / 17 -> 3320 / 18 on 2026-09-18: 사건 10 is an eleventh case, with the
  // same seven tables and one node file import. It is the smallest per-case step
  // yet (~190 lines) because the case has no four-way route split -- one
  // handover, so `dramaticRoutePlans.case10.choices` is empty.
  // 3320 / 18 -> 3500 / 19 on 2026-09-21: 사건 11 is a twelfth case, the same
  // shape as 사건 10 -- one line to the hearing, no route split -- plus a third
  // re-key of the finale's openings.
  // 3500 / 19 -> 3700 / 20 later the same day: 사건 12, a thirteenth case of the
  // same shape, and a fourth re-key.
  // 3700 / 20 -> 3600 / 21 on 2026-09-22: cases arrive as packs
  // (`src/nodes/casePacks.js`), so 사건 12 moved out and 13-24 never came in;
  // the file shrank and lost the case12 import but took the pack list and
  // `characterProfiles`, which the packs merge into.
  // 3600 / 21 -> 560 / 7 on 2026-10-06: ratcheted to what it measures (534 / 7).
  // Every case is a pack now, the finale included, and the file is the graph
  // build and nothing a case wrote; the old number had 3,000 lines of room.
  "src/gameData.js": {
    lines: 560,
    longestLine: 200,
    importedNames: 7,
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
  // 1395 -> 1420 on 2026-09-18: 사건 10's hidden clue, its three outcomes, their
  // carryover and its continuity challenge. Four table rows per case, as before.
  // 1420 -> 1460 on 2026-09-21 for 사건 11 and 12, the same four rows each.
  // 1460 -> 1260 on 2026-10-06: ratcheted to what it measures (1229). The
  // case rows above live on the packs, and the rules that read the season's
  // tables are `seasonRules.js`.
  "src/gameLogic.js": {
    lines: 1260,
    longestLine: 190,
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
  // 1800 / 149 -> 1815 / 150 the same day for leaving a table on purpose: the
  // exit save hands the suspended window to the persistence hook, and the
  // visibility and pagehide handling lives in `useWindowSuspension`, not here.
  // 1815 / 150 -> 1830 / 151 on 2026-09-21 for the free-input LLM reading. The
  // request, its abort and the entry patch live in `useFreeTextEnrichment`, so
  // what stayed here is only what the submit handler alone knows: which entry
  // was just written, whether consent and the privacy signals allow the
  // sentence off the device, and the effect the regex scorer had already
  // applied. Fifteen lines is that call and the three aborts on run reset.
  // 1830 / 151 -> 1832 / 154 on 2026-09-23 for the 프롤로그. Three of the
  // runtime's fallbacks were the literal "case01" and one built the aftermath
  // node id by swapping "case" for "c" -- both true only while 사건 01 was the
  // first case and every case was `caseNN`. They now read `SEASON_ENTRY_CASE`,
  // `SEASON_ENTRY_NODE` and `caseAftermathNodeId` from `gameCases.js`, which is
  // three imported names bought by deleting four assumptions.
  // 1832 / 154 -> 1300 / 120 on 2026-09-27, and every hook budget down with
  // it. choose() -- 340 lines with its ranking row and telemetry -- is
  // `useChoiceCommit`; the log-derived readouts are memoised in `useRunReadout`
  // instead of recomputed on each render; the report's copy is in
  // `useResultReport`; the reset's key list is `runStorageReset`; and the page
  // lifecycle is one handler in `useWindowSuspension`. Measured 1281 / 116 and
  // 23 / 9 / 6 / 6.
  // 1300 / 120 -> 980 / 104 on 2026-10-06, and useState 23 -> 10. The run is
  // one piece of state with one definition (`state/runState.js`), not nineteen
  // `useState` calls in a hook and ten more here; starting, opening, jumping
  // and wiping it are events in `state/runLifecycle.js`, not four lists of
  // setters with a save payload typed out beside each. Measured 964 / 104 and
  // 10 / 7 / 5 / 7.
  // 980 / 104 -> 960 / 96 on 2026-10-15, with a longest line of 190. It had
  // met 980 partly by writing the result view as two lines of 1,448 and 589
  // characters and the play screen's props as one of 418. The result bag is
  // `viewModels/resultViewModel.js` now, which imports the constants and the
  // ending helpers itself and takes the report hook's return value whole, so
  // nine imported names and the report's 29-name unpacking went with it.
  // Measured 950 / 95 and a longest line of 175 (183 once confirm-in-game's
  // awaited confirm lands, which is why the cap is 190 rather than 180).
  "src/GameRuntime.jsx": {
    lines: 960,
    longestLine: 190,
    importedNames: 96,
    hooks: { useState: 10, useMemo: 7, useEffect: 5, useRef: 7 },
  },
  // 105 / 3 -> 111 / 4 on 2026-09-23: the header stamp reads the case's own
  // label rather than its position, because the 프롤로그 sits in front of
  // 사건 01 and a position counter printed "사건 6" over 사건 01.
  // 111 -> 100 on 2026-09-27: ratcheted to what it measures (98).
  // 100 -> 101 on 2026-10-25 (E-11 framework, draft), measured: the stage
  // re-exported for the side screen, which plays its table from this chunk.
  "src/screens/PlayScreen.jsx": {
    lines: 101,
    longestLine: 170,
    importedNames: 4,
    hooks: {},
  },
  // 977 / 14 -> 400 / 10 on 2026-09-27: the third act of the report,
  // `.report-archive`, is `ReportArchive.jsx`. Measured 379 / 9.
  // 400 -> 340 on 2026-09-29: the verdicts, afterglows and axis copy are
  // `src/endingCopy.js`, read through one namespace import. Measured 324 / 10.
  // 340 / 10 -> 342 / 11 on 2026-10-25 (E-11 framework, draft), measured: the
  // finale's one line that the side slot opened, shown once a side case is
  // written (`SIDE_CASES`, src/sideCases.js), and its import.
  "src/screens/ResultScreen.jsx": {
    lines: 342,
    longestLine: 280,
    importedNames: 11,
    hooks: {},
  },
  "src/screens/ReportArchive.jsx": {
    lines: 640,
    longestLine: 260,
    importedNames: 7,
    hooks: {},
  },
  // The table. 1068 lines until 2026-09-27, when its keyboard handler moved to
  // `useTableKeys` and its forecast derivations to `tableReadout`. Measured 917.
  // 930 -> 830 on 2026-10-06: ratcheted to what it measures (809); the hand,
  // the notices and the timing had moved out since.
  // 830 -> 833 on 2026-10-20, measured: B3's audit token on the run signal,
  // its prop and the 확정 button's description (830 before; the token's
  // comment went to auditRisk.js's readAudit).
  // 68 -> 69 imported names on 2026-10-22 (ops-measure draft), measured: D-11's
  // noteBriefing, which openTable calls so a page opened by key, button or clock
  // is counted in one place.
  // 833 -> 834 on 2026-10-23 (batch B), measured: the briefing's three lines
  // from before the scene -- bridge (D-7), reaction (C-13), opening (Q8 (1)) --
  // handed on, one line, with the table readouts' rows.
  // 834 -> 847 on 2026-10-23, batch B on batch A, measured: batch A's edge
  // notices and reading tally beside batch B's readouts, each budgeted on its
  // own base until the two met.
  "src/gauntlet/GauntletStage.jsx": {
    lines: 847,
    longestLine: 250,
    importedNames: 69,
    hooks: {},
  },
};

// One flat bag per screen is how the runtime hands a screen its data, and each
// field is a value the runtime had to derive. The play screen's is the one that
// grew, to 153 fields across six groups, before the gauntlet cut it to 40.
// 82 / 44 / 112 -> 80 / 28 / 110 on 2026-10-06: ratcheted to what they measure
// (79 / 27 / 108). The play view lost the seventeen callbacks and renderers it
// carried as a second copy of `actions` and `renderers`.
const VIEW_FIELD_BUDGETS = { intro: 80, play: 28, result: 110 };

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

  const lengths = source.split("\n").map((line) => line.replace(/\r$/, "").length);
  const longest = Math.max(...lengths);
  return {
    lines: lengths.length,
    longestLine: { length: longest, line: lengths.indexOf(longest) + 1 },
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
  if (actual.longestLine.length > budget.longestLine) {
    failures.push(
      `${relative}:${actual.longestLine.line} is ${actual.longestLine.length} characters, over the ${budget.longestLine} cap. ` +
        "Break it up; if it is a bag of names, it belongs in a view model.",
    );
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
  reported.push(`${relative}: ${actual.lines} lines, ${actual.importedNames} imports, longest line ${actual.longestLine.length}`);
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
