import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { initialResources } from "../../src/gameConstants.js";
import {
  CASE_OPEN_VERSION,
  createCaseClose,
  createCaseOpen,
  createRunSummary,
  createWindow,
  normalizeCaseOpen,
  normalizeRunState,
  openCaseRun,
  resolveWindow,
  RUN_INITIAL_STATE,
  serializeRunState,
  stampCaseOpen,
} from "../../src/gauntlet/gauntletEngine.js";
import { LINK_CARRY_MAX, LINK_SPAN_MAX } from "../../src/gauntlet/cascadeRisk.js";
import { RELIC_IDS } from "../../src/gauntlet/relics.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { WEEK_RULE_ID_MAX } from "../../src/gauntlet/weeklyRules.js";
import { CASE_DYNAMICS_MAX_BYTES, fitCaseDynamics, validateCaseDynamics, validateSavedStatePayload, validateTelemetryItem } from "../../src/state/payloadSchemas.js";
import { initialRunState, runTransition, toSavePayload } from "../../src/state/runState.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * F1 phase 3, S3 (서버검증-설계안.md, question 8 (1)): the case-open snapshot,
 * stamped on the run when a case opens, kept through a save, and sent on the
 * case's row as `dynamics.open` with the close's `linksOut` and draft.
 */

/** The server's cap on `dynamics`, as jsonb text (20261102030000). */
const SERVER_DYNAMICS_BYTES = 6144;
const bytes = (text) => Buffer.byteLength(text, "utf8");
/** `value` as Postgres prints jsonb: `": "` after a key and `", "` between items. */
function jsonbText(value) {
  if (Array.isArray(value)) return `[${value.map(jsonbText).join(", ")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => `${JSON.stringify(key)}: ${jsonbText(item)}`).join(", ")}}`;
  return JSON.stringify(value);
}
/** The `dynamics` a case row carries at a close (useChoiceCommit). */
const rowDynamics = (run) => fitCaseDynamics({ ...createRunSummary(run), ...createCaseClose(run), responseTimeSec: 12.4 });

const HAND = { time: 61, capital: 88, trust: 47, legitimacy: 52, humanCost: 9, fatigue: 23 };

test("a case opens with a snapshot of the run as it opened, and a caller that names no case leaves none", () => {
  const run = normalizeRunState({ ...RUN_INITIAL_STATE, windowIndex: 9, vault: 320, handVault: 40, busts: 2, cashes: 7, relics: RELIC_IDS.slice(0, 2), stanceMastery: { strike: 3 }, logic: { streak: 4, best: 6 } });
  const opened = openCaseRun(run, { caseId: "case03", resources: HAND });
  assert.equal(opened.open.v, CASE_OPEN_VERSION);
  assert.deepEqual(
    [opened.open.caseId, opened.open.windowIndex, opened.open.vault, opened.open.handVault, opened.open.busts, opened.open.cashes],
    ["case03", 9, 320, 40, 2, 7],
  );
  assert.deepEqual(opened.open.relics, opened.relics);
  assert.deepEqual(opened.open.stanceMastery, opened.stanceMastery);
  assert.deepEqual(opened.open.logic, opened.logic);
  assert.deepEqual(opened.open.linksIn, opened.linksIn);
  assert.deepEqual(opened.open.schema, opened.schema, "the board the case opened on, for the settlement's replay (S2)");
  assert.deepEqual(opened.open.resources, HAND);
  assert.equal(opened.open.practice, false);
  assert.deepEqual(createCaseOpen(opened, { caseId: "case03", resources: HAND }), opened.open, "the snapshot is the opened run's");
  assert.equal(openCaseRun(opened, { caseId: "case02", replayOf: { pushRecord: null } }).open.practice, true, "a replay says so");
  assert.equal(openCaseRun(opened).open, null);
  assert.equal(stampCaseOpen(opened).open, null);
});

test("the snapshot rides every window to the close, survives a save, and is read back the same", () => {
  let run = openCaseRun(RUN_INITIAL_STATE, { caseId: "prologue01", resources: initialResources });
  const open = run.open;
  for (let index = 0; index < 4; index += 1) {
    const window = { ...createWindow({ schema: run.schema, seed: `s3:${index}` }), status: "cashed", cause: "cash", gauge: 30, pushes: 2, elapsed: 5 };
    run = resolveWindow({ run, window, card: { id: "c", effect: { capital: 4 } }, forced: false, offered: [], caseClosed: index === 3 }).nextRun;
  }
  assert.deepEqual(run.open, open, "no window moves it");
  const saved = JSON.parse(JSON.stringify(serializeRunState(run)));
  assert.deepEqual(normalizeRunState(saved).open, open);
  assert.deepEqual(normalizeCaseOpen(normalizeCaseOpen(saved.open)), open, "reading it again changes nothing");
  assert.deepEqual(createCaseClose(run).open, open);
  assert.deepEqual(validateSavedStatePayload({ ...toSavePayload(initialRunState(null, { runId: "r", operatorOrigin: "lab", sessionId: "s", now: 1, openRecovery: false })), dynamics: saved }), []);
  // A save from before the snapshot reads as none, and is still a good save.
  const { open: _open, ...older } = saved;
  assert.equal(normalizeRunState(older).open, null);
  for (const junk of [[], "case01", { caseId: 4 }, { vault: 3 }]) assert.equal(normalizeCaseOpen(junk), null);
});

test("every way a run's case opens stamps it: NEW GAME, NEW GAME+, the shell's 시작, the debug jump", () => {
  const before = initialRunState(null, { runId: "r0", operatorOrigin: "lab", sessionId: "s0", now: 1, openRecovery: false });
  const fresh = runTransition(before, { type: "newGame", runId: "r1", playerName: "분석관", now: 2 });
  assert.equal(fresh.gauntletRun.open.caseId, CASE_SEQUENCE[0]);
  assert.deepEqual(fresh.gauntletRun.open.resources, fresh.resources, "on the hand the season's first scene deals");
  assert.equal(runTransition(before, { type: "newGame", runId: "r2", playerName: "분석관", now: 2, veteran: true }).gauntletRun.open.veteran, true);
  const jumped = runTransition(before, { type: "jumpToNode", runId: "r3", caseId: "case04", nodeId: "n", completedCases: [], echo: "", now: 2 });
  assert.deepEqual([jumped.gauntletRun.open.caseId, jumped.gauntletRun.open.resources], ["case04", initialResources]);
  const shell = initialRunState({ dynamics: null, currentCase: CASE_SEQUENCE[0], resources: HAND }, { runId: "r4", operatorOrigin: "lab", sessionId: "s4", now: 1, openRecovery: false });
  assert.deepEqual([shell.gauntletRun.open.caseId, shell.gauntletRun.open.resources], [CASE_SEQUENCE[0], HAND]);
});

test("a case row's dynamics: the close's links and draft beside the run summary, never in the case summary", () => {
  const run = openCaseRun({ ...RUN_INITIAL_STATE, relicOffer: RELIC_IDS.slice(0, 3), linksOut: [{ from: -1, due: 2 }] }, { caseId: "case06", resources: HAND });
  const dynamics = rowDynamics({ ...run, linksOut: [{ from: 0, due: 3 }] });
  assert.deepEqual(dynamics.linksOut, [{ from: 0, due: 3 }]);
  assert.ok(Array.isArray(dynamics.relicOffer));
  assert.equal(dynamics.practiceWindows, 0);
  assert.equal(dynamics.open.caseId, "case06");
  assert.equal("open" in createRunSummary(run), false, "the case summary (4,096 bytes) does not carry it");
  assert.equal("linksOut" in createRunSummary(run), false);
  assert.deepEqual(validateCaseDynamics(dynamics), []);
  assert.deepEqual(validateTelemetryItem({ id: "case-1", type: "case", label: "x", payload: { event_id: "e", dynamics } }), []);
});

test("a dynamics the server would not take is never sent: the snapshot goes first, then the row is held", () => {
  assert.deepEqual(validateCaseDynamics({ open: [] }), ["invalid dynamics.open"]);
  assert.deepEqual(validateCaseDynamics({ open: { caseId: 3 } }), ["invalid dynamics.open"]);
  assert.deepEqual(validateCaseDynamics({ linksOut: {} }), ["invalid dynamics.linksOut"]);
  assert.deepEqual(validateCaseDynamics(null), []);
  const big = { ...createRunSummary(RUN_INITIAL_STATE), open: { caseId: "case01", note: "x".repeat(CASE_DYNAMICS_MAX_BYTES) } };
  assert.deepEqual(validateCaseDynamics(big), ["dynamics too large"]);
  const fitted = fitCaseDynamics(big);
  assert.equal("open" in fitted, false, "without the snapshot the row still goes, and its chain reads as not checked");
  assert.deepEqual(validateCaseDynamics(fitted), []);
  assert.equal(fitCaseDynamics(fitted), fitted);
  assert.deepEqual(validateSavedStatePayload({ ...toSavePayload(initialRunState(null, { runId: "r", operatorOrigin: "lab", sessionId: "s", now: 1, openRecovery: false })), dynamics: { ...serializeRunState(RUN_INITIAL_STATE), open: "case01" } }), ["invalid dynamics.open"]);
});

test("row size: the snapshot and the whole dynamics, honest seasons and the largest a run can make", () => {
  const sizes = [];
  for (const [seed, archetype] of [[20261021, "balanced"], [20261022, "money"], [20261023, "random"]]) {
    const season = createSeasonBot({ seed, staged: STAGED }).playSeason(0, archetype);
    for (const caseId of CASE_SEQUENCE) {
      const dynamics = season.caseDynamics[caseId];
      assert.ok(dynamics.open, `${seed} ${caseId} carries its snapshot`);
      sizes.push({ open: bytes(jsonbText(dynamics.open)), whole: bytes(jsonbText(dynamics)) });
    }
  }
  // The largest: every tool held, a full draft, the longest week stamp, eight
  // mutations, the links at their cap, numbers far past a season's.
  const relics = [...RELIC_IDS];
  const longest = {
    ...RUN_INITIAL_STATE,
    windowIndex: 99999, practiceWindows: 99999, vault: 9999999, handVault: 9999999, busts: 99999, cashes: 99999, runPot: 999999, bestMultiplier: 511.99,
    relics, weekRule: "w".repeat(WEEK_RULE_ID_MAX), linksIn: Array.from({ length: LINK_CARRY_MAX }, () => ({ from: -99, due: LINK_SPAN_MAX })),
    logic: { streak: 9999, best: 9999, type: "reframing", held: 9999, heat: 3, rose: true, reach: 9 },
    stanceMastery: { strike: 99, steady: 99, expose: 99 },
  };
  const opened = openCaseRun(longest, { caseId: "prologue03", resources: { time: -99999.5, capital: -99999.5, trust: -99999.5, legitimacy: -99999.5, humanCost: -99999.5, fatigue: -99999.5 } });
  const run = {
    ...opened,
    linksOut: longest.linksIn,
    open: { ...opened.open, relicOffer: relics.slice(0, 3), schema: { ...opened.open.schema, mutations: Array.from({ length: 8 }, () => "heatDebtOverclock"), fracturedAxis: "legitimacy" } },
    schema: { ...opened.schema, mutations: Array.from({ length: 8 }, () => "heatDebtOverclock") },
  };
  const worst = { ...createRunSummary(run), ...createCaseClose(run), relicOffer: relics.slice(0, 3), responseTimeSec: 59.999 };
  worst.open = normalizeCaseOpen(run.open);
  const worstOpen = bytes(jsonbText(worst.open));
  const worstWhole = bytes(jsonbText(worst));
  const most = (key) => Math.max(...sizes.map((size) => size[key]));
  const report = { honestOpenMax: most("open"), honestWholeMax: most("whole"), worstOpen, worstWhole, worstJson: bytes(JSON.stringify(worst)) };
  console.log(`case-open sizes (jsonb text bytes): ${JSON.stringify(report)}`);
  assert.ok(report.worstJson <= CASE_DYNAMICS_MAX_BYTES, `the largest dynamics is ${report.worstJson} bytes of JSON; the page sends at most ${CASE_DYNAMICS_MAX_BYTES}`);
  assert.ok(worstWhole <= SERVER_DYNAMICS_BYTES, `the largest dynamics is ${worstWhole} bytes as jsonb; the server takes ${SERVER_DYNAMICS_BYTES}`);
  assert.equal(fitCaseDynamics(worst), worst, "so no honest row loses its snapshot");
  assert.ok(most("whole") <= 2048 * 1.25, "an honest row stays near the old cap");
});
