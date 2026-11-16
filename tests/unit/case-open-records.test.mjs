import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { CASE_SEQUENCE, SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "../../src/gameCases.js";
import {
  createCaseClose,
  createRunSummary,
  createWindow,
  normalizeCaseOpen,
  normalizeFocusCarry,
  normalizeOpeningRoute,
  normalizeRunState,
  openCaseRun,
  OPENING_ROUTE_ID_MAX,
  resolveWindow,
  RUN_INITIAL_STATE,
  serializeRunState,
  STANCE_CARRY_MUTATIONS,
} from "../../src/gauntlet/gauntletEngine.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { describeCaseOpening } from "../../src/state/caseRoutes.js";
import { fitCaseDynamics, validateCaseDynamics, validateTelemetryItem } from "../../src/state/payloadSchemas.js";
import { initialRunState, runTransition } from "../../src/state/runState.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { jsonbText } from "../helpers/caseRows.js";

/**
 * F1 step 2 (설계-남은-우선항목-20261111, F1-2 (1)): the case-open snapshot's
 * two records, LOCK's carry onto the board a case opened on (`focusCarry`)
 * and the route it opened on (`openingRoute`), stamped as a case opens, kept
 * through a save, sent on the case's row, and typed by the server's
 * `playtest_sessions_dynamics_shape` (20261113000000, a draft).
 */

const HAND = { time: 61, capital: 88, trust: 47, legitimacy: 52, humanCost: 9, fatigue: 23 };
const ROUTE = { after: "p5_after_hold", rank: "A", nodeId: "c03_open" };
const rowDynamics = (run) => fitCaseDynamics({ ...createRunSummary(run), ...createCaseClose(run), responseTimeSec: 12.4 });

/** A run after `count` cashed windows of a case, the last one closing it when `close`. */
function playWindows(run, count, { close = false, focus = 0, focusHits = 0, focusMode = "strike" } = {}) {
  let next = run;
  for (let index = 0; index < count; index += 1) {
    const window = { ...createWindow({ schema: next.schema, seed: `f1s2:${index}` }), status: "cashed", cause: "cash", gauge: 30, pushes: 2, elapsed: 5, focus, focusHits, focusMode };
    next = resolveWindow({ run: next, window, card: { id: "c", effect: { capital: 4 } }, forced: false, offered: [], caseClosed: close && index === count - 1 }).nextRun;
  }
  return next;
}

test("focusCarry: the REBOOT board a close dealt, or a fresh board and the stance it dropped", () => {
  assert.deepEqual(STANCE_CARRY_MUTATIONS, ["strikeWake", "steadyLine", "exposedHand"]);
  // The season's first table: nothing kept, nothing dropped.
  assert.deepEqual(openCaseRun(RUN_INITIAL_STATE, { caseId: "case01", resources: HAND }).open.focusCarry, { rebooted: false, stance: null });
  // A case closed: the next opens on its REBOOT board, and LOCK carries nothing across a close.
  const closed = playWindows(openCaseRun(RUN_INITIAL_STATE, { caseId: "case01", resources: HAND }), 3, { close: true, focus: 90, focusHits: 2 });
  assert.ok(closed.schema.mutations.includes("reboot"));
  assert.deepEqual(openCaseRun(closed, { caseId: "case02", resources: HAND }).open.focusCarry, { rebooted: true, stance: null });
  // A case left half way on a STRIKE carry: the next is laid fresh, and the snapshot says what it dropped.
  const charged = playWindows(openCaseRun(RUN_INITIAL_STATE, { caseId: "case01", resources: HAND }), 1, { focus: 90, focusHits: 2 });
  assert.ok(charged.schema.mutations.includes("strikeWake"), "a charged STRIKE cash carries onto the next board");
  const reopened = openCaseRun(charged, { caseId: "case01", resources: HAND });
  assert.deepEqual(reopened.open.focusCarry, { rebooted: false, stance: "strikeWake" });
  assert.equal(reopened.schema.mutations.includes("strikeWake"), false, "the fresh board does not keep it");
  for (const mode of ["steady", "expose"]) {
    const run = playWindows(openCaseRun(RUN_INITIAL_STATE, { caseId: "case01", resources: HAND }), 1, { focus: 90, focusHits: 2, focusMode: mode });
    const stance = STANCE_CARRY_MUTATIONS.find((id) => run.schema.mutations.includes(id));
    assert.ok(stance, `${mode} carries a stance`);
    assert.equal(openCaseRun(run, { caseId: "case01", resources: HAND }).open.focusCarry.stance, stance);
  }
});

test("openingRoute: describeCaseOpening's route, handed to openCaseRun, and the season's start", () => {
  const first = describeCaseOpening(SEASON_ENTRY_CASE, { caseResults: {}, operatorOrigin: "lab" });
  assert.deepEqual(first.route, { after: null, rank: null, nodeId: first.nodeId });
  const index = CASE_SEQUENCE.indexOf("case03");
  const before = CASE_SEQUENCE[index - 1];
  const opening = describeCaseOpening("case03", { caseResults: { [before]: { rank: "B", outcomeChoiceId: "some_close" } }, operatorOrigin: "lab" });
  assert.deepEqual(opening.route, { after: "some_close", rank: "B", nodeId: opening.nodeId });
  assert.deepEqual(openCaseRun(RUN_INITIAL_STATE, { caseId: "case03", resources: opening.resources, route: opening.route }).open.openingRoute, opening.route);
  assert.equal(openCaseRun(RUN_INITIAL_STATE, { caseId: "case03", resources: HAND }).open.openingRoute, null, "a caller that names no route records none");

  const start = initialRunState(null, { runId: "r0", operatorOrigin: "lab", sessionId: "s0", now: 1, openRecovery: false });
  const fresh = runTransition(start, { type: "newGame", runId: "r1", playerName: "분석관", now: 2 });
  assert.deepEqual(fresh.gauntletRun.open.openingRoute, { after: null, rank: null, nodeId: SEASON_ENTRY_NODE });
  assert.deepEqual(fresh.gauntletRun.open.focusCarry, { rebooted: false, stance: null });
  const jumped = runTransition(start, { type: "jumpToNode", runId: "r3", caseId: "case04", nodeId: "c04_x", completedCases: [], echo: "", now: 2 });
  assert.deepEqual(jumped.gauntletRun.open.openingRoute, { after: null, rank: null, nodeId: "c04_x" });
  const shell = initialRunState({ dynamics: null, currentCase: SEASON_ENTRY_CASE, nodeId: SEASON_ENTRY_NODE, resources: HAND }, { runId: "r4", operatorOrigin: "lab", sessionId: "s4", now: 1, openRecovery: false });
  assert.deepEqual(shell.gauntletRun.open.openingRoute, { after: null, rank: null, nodeId: SEASON_ENTRY_NODE });
});

test("both survive a save and read back the same; a snapshot from before them reads as null", () => {
  const run = playWindows(openCaseRun(RUN_INITIAL_STATE, { caseId: "case03", resources: HAND, route: ROUTE }), 2);
  const saved = JSON.parse(JSON.stringify(serializeRunState(run)));
  const restored = normalizeRunState(saved);
  assert.deepEqual(restored.open.openingRoute, ROUTE);
  assert.deepEqual(restored.open.focusCarry, { rebooted: false, stance: null });
  assert.deepEqual(normalizeCaseOpen(normalizeCaseOpen(saved.open)), restored.open, "reading it again changes nothing");
  const { focusCarry: _carry, openingRoute: _route, ...older } = saved.open;
  const old = normalizeCaseOpen(older);
  assert.equal(old.focusCarry, null);
  assert.equal(old.openingRoute, null);
  // Junk reads as none; long ids are cut to what the server takes.
  for (const junk of [null, [], "x", 3]) {
    assert.equal(normalizeFocusCarry(junk), null);
    assert.equal(normalizeOpeningRoute(junk), null);
  }
  assert.deepEqual(normalizeFocusCarry({ rebooted: "yes", stance: "overclock" }), { rebooted: false, stance: null });
  assert.equal(normalizeOpeningRoute({ after: "a" }), null, "a route with no scene is not one");
  const long = normalizeOpeningRoute({ after: "a".repeat(200), rank: "r".repeat(20), nodeId: "n".repeat(200) });
  assert.deepEqual([long.after.length, long.rank.length, long.nodeId.length], [OPENING_ROUTE_ID_MAX, 8, OPENING_ROUTE_ID_MAX]);
});

test("the row carries them, and the page holds back a shape the server would refuse", () => {
  const run = openCaseRun(RUN_INITIAL_STATE, { caseId: "case06", resources: HAND, route: ROUTE });
  const dynamics = rowDynamics(run);
  assert.deepEqual(dynamics.open.openingRoute, ROUTE);
  assert.deepEqual(dynamics.open.focusCarry, { rebooted: false, stance: null });
  assert.deepEqual(validateCaseDynamics(dynamics), []);
  assert.deepEqual(validateTelemetryItem({ id: "case-1", type: "case", label: "x", payload: { event_id: "e", dynamics } }), []);
  const withOpen = (patch) => validateCaseDynamics({ ...dynamics, open: { ...dynamics.open, ...patch } });
  assert.deepEqual(withOpen({ focusCarry: null, openingRoute: null }), []);
  assert.deepEqual(withOpen({ focusCarry: { rebooted: true } }), [], "a stance left out reads as none");
  for (const focusCarry of [[], { stance: null }, { rebooted: "true", stance: null }, { rebooted: false, stance: 3 }, { rebooted: false, stance: "s".repeat(33) }]) {
    assert.deepEqual(withOpen({ focusCarry }), ["invalid dynamics.open.focusCarry"], JSON.stringify(focusCarry));
  }
  for (const openingRoute of ["c06", { after: null, rank: null }, { nodeId: "n".repeat(65) }, { nodeId: "n", after: 4 }, { nodeId: "n", rank: "r".repeat(9) }]) {
    assert.deepEqual(withOpen({ openingRoute }), ["invalid dynamics.open.openingRoute"], JSON.stringify(openingRoute));
  }
});

test("row size: an honest season's rows carry both, and they add little", () => {
  const season = createSeasonBot({ seed: 20261112, staged: STAGED }).playSeason(0, "balanced");
  let added = 0;
  for (const [index, caseId] of CASE_SEQUENCE.entries()) {
    const open = season.caseDynamics[caseId].open;
    assert.equal(typeof open.focusCarry?.rebooted, "boolean", `${caseId} carries LOCK's carry`);
    assert.equal(typeof open.openingRoute?.nodeId, "string", `${caseId} carries its route`);
    if (index === 0) assert.equal(open.openingRoute.after, null, "the season's first case has no case before it");
    assert.deepEqual(validateCaseDynamics(season.caseDynamics[caseId]), []);
    added = Math.max(added, Buffer.byteLength(jsonbText({ focusCarry: open.focusCarry, openingRoute: open.openingRoute }), "utf8"));
  }
  console.log(`case-open records: at most ${added} bytes of jsonb text a row`);
  assert.ok(added <= 160, `the two records add ${added} bytes to a row`);
});

test("the draft migration: #466's constraint line for line, plus the two records at the page's limits", () => {
  const dir = new URL("../../supabase/migrations/", import.meta.url);
  const writers = readdirSync(dir)
    .filter((file) => /\.sql(\.draft)?$/.test(file) && readFileSync(new URL(file, dir), "utf8").includes("add constraint playtest_sessions_dynamics_shape"))
    .sort();
  const ours = writers.at(-1);
  assert.match(ours, /^20261113000000_case_open_focus_carry_route\.sql(\.draft)?$/, "the newest writer of the shape is this one, after #466's 20261112000000");
  const constraintOf = (file) => {
    const text = readFileSync(new URL(file, dir), "utf8");
    const from = text.indexOf("add constraint playtest_sessions_dynamics_shape");
    return text.slice(from, text.indexOf(") not valid;", from)).split("\n").map((line) => line.trimEnd());
  };
  const theirs = constraintOf(writers.at(-2));
  const mine = constraintOf(ours);
  // Every line before, in order, then only F1 step 2's lines.
  let at = 0;
  for (const line of theirs) {
    const found = mine.indexOf(line, at);
    assert.ok(found >= at, `${ours} keeps "${line.trim()}" from ${writers.at(-2)}`);
    at = found + 1;
  }
  const added = mine.filter((line) => !theirs.includes(line)).join("\n");
  assert.match(added, /'focusCarry'/);
  assert.match(added, /'openingRoute'/);
  assert.match(added, /'stance', ''\)\) <= 32/);
  assert.match(added, /'nodeId'\) <= 64/);
  assert.match(added, /'after', ''\)\) <= 64/);
  assert.match(added, /'rank', ''\)\) <= 8/);
  assert.equal(OPENING_ROUTE_ID_MAX, 64);
  assert.ok(STANCE_CARRY_MUTATIONS.every((id) => id.length <= 32));
  const text = readFileSync(new URL(ours, dir), "utf8");
  assert.doesNotMatch(text, /\b(grant|revoke|create table|create or replace function|create view)\b/i, "it creates nothing a grant would have to cover");
  assert.match(text, /\) not valid;/, "stored rows are not read again");
});
