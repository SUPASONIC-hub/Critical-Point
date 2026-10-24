import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createRunHarness, HARNESS_NOW, restoreGlobals } from "./helpers/runHarness.mjs";

/**
 * What each way of starting, opening, leaving and resetting a run does to the
 * run in memory and to the save in storage, pinned.
 *
 * The run's fields used to be reset by four hand-kept lists of setters, each
 * with a save payload written out beside it, and the lists had drifted: one
 * reset the echo in memory and saved the old one, another left a lock on. The
 * expectations here were written out of that code, before it was replaced, to
 * `fixtures/run-lifecycle.json` -- every field of the run and every key of the
 * save, for every transition -- and the code that replaced it has to produce
 * the same file. A difference is a behaviour change: either a mistake, or a
 * decision that belongs in its own commit with the line of the fixture it moves.
 *
 * To write the file again from the code as it stands:
 *   UPDATE_RUN_LIFECYCLE=1 node --test tests/unit/run-lifecycle.test.mjs
 */
const FIXTURE = fileURLToPath(new URL("./fixtures/run-lifecycle.json", import.meta.url));
const updating = process.env.UPDATE_RUN_LIFECYCLE === "1";
const pinned = updating ? {} : JSON.parse(readFileSync(FIXTURE, "utf8"));
const recorded = {};

const { SAVE_SCHEMA_VERSION } = await import("../../src/appConfig.js");
const { initialResources, triggerLabels, cognitionLabels, caseOpeningRoutes, nodeOrders } = await import("../../src/gameData.js");
const { makeEmptyScores } = await import("../../src/gameLogic.js");
const { RUN_INITIAL_STATE, serializeRunState } = await import("../../src/gauntlet/gauntletEngine.js");
const { SEASON_ENTRY_CASE } = await import("../../src/gameCases.js");

after(() => {
  restoreGlobals();
  if (updating) writeFileSync(FIXTURE, `${JSON.stringify(recorded, null, 2)}\n`);
});

const plain = (value) => JSON.parse(JSON.stringify(value ?? null));

/** Everything a transition can be seen to have done. */
function observe(harness) {
  return plain({
    run: harness.run,
    saved: harness.saved(),
    slots: harness.slotCount(),
    storageKeys: harness.storageKeys(),
    trace: harness.trace(),
    effects: harness.effects,
    status: harness.status,
    outside: harness.outside,
  });
}

function pin(name, harness) {
  const seen = observe(harness);
  recorded[name] = seen;
  if (!updating) assert.deepEqual(seen, pinned[name], `${name} is not what the fixture holds`);
}

// The outcome that keys an opening route into 프롤로그 02, read from the season
// so the fixture follows a renamed card instead of quietly testing nothing.
const [previousOutcomeChoiceId] = Object.keys(caseOpeningRoutes.prologue02);
assert.ok(previousOutcomeChoiceId, "프롤로그 02 has an opening keyed by how 프롤로그 01 closed");

/** A run in the middle of its second case, with something in every field. */
const midRun = () => ({
  saveSchemaVersion: SAVE_SCHEMA_VERSION,
  runId: "run-mid",
  playerName: "테스터",
  playStyle: "audit",
  openingLegacy: { title: "이어받은 판", effect: { trust: 2 } },
  dataConsent: true,
  started: true,
  currentCase: "prologue02",
  completedCases: ["prologue01"],
  discoveredClues: [{ id: "clue-a", caseId: "prologue01" }],
  caseResults: { prologue01: { rank: "A", outcomeChoiceId: previousOutcomeChoiceId, completedAt: "2026-10-01T00:00:00.000Z" } },
  playtestFeedback: { prologue01: { clarity: 4, comment: "읽기 쉬웠다" } },
  nodeId: nodeOrders.prologue02[1],
  resources: { ...initialResources, trust: 41, fatigue: 17 },
  log: [{ caseId: "prologue02", nodeId: nodeOrders.prologue02[0], choiceId: "p2_first", speaker: "한서윤" }],
  triggers: { ...makeEmptyScores(triggerLabels), [Object.keys(triggerLabels)[0]]: 12 },
  cognition: { ...makeEmptyScores(cognitionLabels), inference: 3 },
  echo: "직전 선택에 돌아온 말.",
  nodeEnteredAt: HARNESS_NOW - 5_000,
  pendingTelemetry: [{ id: "case-kept", type: "case", label: "보관된 로그", payload: {} }],
  dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 3, runPot: 40, vault: 12 }),
  paused: false,
  savedAt: "2026-10-01T00:00:00.000Z",
  lastError: { message: "앞선 오류", at: "2026-10-01T00:00:00.000Z" },
});

/** The same run, left from the table and waiting on the intro. */
const pausedRun = () => ({ ...midRun(), started: false, paused: true });

/** What a tab that has seen an error and another tab's lead looks like. */
const dirtyPanels = { staleSave: true, showRecoveryCenter: true, showErrorLog: true, decisionReveal: { nextNode: "somewhere" } };

test("a new game from an empty intro", async () => {
  const harness = await createRunHarness({ patch: { playerName: "  새 분석관  ", playStyle: "mediate", dataConsent: true } });
  harness.act("startGame");
  pin("newGame/from-empty-intro", harness);
});

test("a new game with no name, from another origin", async () => {
  const harness = await createRunHarness({ operatorOrigin: "lab" });
  harness.act("startGame");
  pin("newGame/unnamed-lab-origin", harness);
});

test("a new game over a run already in progress", async () => {
  const harness = await createRunHarness({ saved: pausedRun(), operatorOrigin: "public", patch: dirtyPanels });
  harness.act("startGame");
  pin("newGame/over-a-run", harness);
});

// NEW GAME+ is the same new game with the run marked, and the mark is the
// run's: the plain start above, over a run on the same device, has none.
test("a new game begun with NEW GAME+", async () => {
  const harness = await createRunHarness({ saved: pausedRun(), operatorOrigin: "public", patch: dirtyPanels });
  harness.act("startGame", { veteran: true });
  pin("newGame/new-game-plus", harness);
  assert.equal(harness.run.gauntletRun.veteran, true);
  assert.equal(harness.saved().dynamics.veteran, true);
  const { veteran: _mark, open: markedOpen, ...unmarked } = harness.saved().dynamics;
  const { veteran: plainMark, open: plainOpen, ...plainStart } = pinned["newGame/over-a-run"]?.saved.dynamics ?? recorded["newGame/over-a-run"].saved.dynamics;
  assert.equal(plainMark, false);
  assert.deepEqual(plain(unmarked), plainStart, "nothing else about the table differs");
  // The opening snapshot (S3) carries the mark too, and nothing else differs in it.
  assert.equal(markedOpen.veteran, true);
  assert.deepEqual(plain({ ...markedOpen, veteran: false }), plainOpen);
});

// What NEW GAME+ carries is the story, not the table (NEWGAMEPLUS 설계안 3절):
// the line the season opens on, chosen from how the last one ended.
const CARRIED_ECHO = "지난 시즌의 기록은 봉인되었지만 실험은 다른 이름으로 돌아왔습니다. 이번에는 무엇을 닫을지 먼저 보겠습니다.";

test("a NEW GAME+ that carries a line opens the season on it", async () => {
  const harness = await createRunHarness({ saved: pausedRun(), operatorOrigin: "public" });
  harness.act("startGame", { veteran: true, echo: CARRIED_ECHO });
  pin("newGame/new-game-plus-echo", harness);
  assert.equal(harness.run.echo, CARRIED_ECHO);
  assert.equal(harness.saved().echo, CARRIED_ECHO, "the line is the run's, so a save moved to another device opens on it too");
});

test("a plain start, and a NEW GAME+ with nothing to carry, open on the opening line", async () => {
  const { OPENING_ECHO } = await import("../../src/state/runState.js");
  for (const options of [{ echo: CARRIED_ECHO }, { veteran: true }, { veteran: true, echo: "   " }, { veteran: true, echo: 7 }]) {
    const harness = await createRunHarness({ saved: pausedRun() });
    harness.act("startGame", options);
    assert.equal(harness.run.echo, OPENING_ECHO, JSON.stringify(options));
  }
});

test("a NEW GAME+ after the finale takes nothing of the last season's table: no links, no audit, no relics, no vault", async () => {
  const finishedTable = serializeRunState({
    ...RUN_INITIAL_STATE,
    windowIndex: 40,
    vault: 300,
    relics: ["metronome"],
    linksIn: [{ from: 0, due: 2 }],
    linksOut: [{ from: -1, due: 1 }, { from: 0, due: 3 }],
  });
  assert.ok(finishedTable.linksOut.length > 0 && finishedTable.linksIn.length > 0, "the season being left has links to carry");
  const harness = await createRunHarness({
    saved: { ...pausedRun(), currentCase: "final", completedCases: ["final"], caseResults: { final: { runId: "run-mid", outcomeChoiceId: "f_after_witness" } }, dynamics: finishedTable },
  });
  harness.act("startGame", { veteran: true, echo: CARRIED_ECHO });
  const table = harness.run.gauntletRun;
  assert.deepEqual(table.linksIn, []);
  assert.deepEqual(table.linksOut, []);
  assert.deepEqual(harness.saved().dynamics.linksIn, []);
  assert.deepEqual(harness.saved().dynamics.linksOut, []);
  assert.deepEqual(table.relics, []);
  assert.equal(table.vault, 0);
  assert.equal(table.veteran, true);
  // The audit is counted from the case's log (countAudit), and a new game's log is empty.
  assert.deepEqual(harness.run.log, []);
  const { veteran: _mark, ...fresh } = plain(serializeRunState(RUN_INITIAL_STATE));
  const { veteran: _carried, weekRule: _week, story: _story, open, ...opened } = plain(harness.saved().dynamics);
  const { weekRule: _w, story: _s, open: _o, ...expected } = fresh;
  assert.deepEqual(opened, expected, "the table is a first season's, but for the NEW GAME+ mark, the week's rule and the opening snapshot");
  // The opening snapshot (F1 phase 3, S3) is the new season's first case, on an empty table.
  assert.equal(open?.caseId, SEASON_ENTRY_CASE);
  assert.deepEqual([open.vault, open.relics, open.linksIn], [0, [], []]);
});

test("the start button's click event is a plain start", async () => {
  const harness = await createRunHarness();
  harness.act("startGame", { type: "click", veteran: "true" });
  assert.equal(harness.run.gauntletRun.veteran, false);
});

test("resuming a paused run", async () => {
  const harness = await createRunHarness({ saved: pausedRun(), patch: { decisionReveal: { nextNode: "somewhere" } } });
  harness.act("resume");
  pin("resume/paused-run", harness);
});

test("pausing from the recovery notice", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("pauseAfterRecovery");
  pin("pause/after-recovery", harness);
});

test("saving in place", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("saveGame");
  pin("save/in-place", harness);
});

test("saving and leaving", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("saveGame", { exit: true });
  pin("save/and-exit", harness);
});

test("saving and leaving with a window held", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  const heldRun = serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 3, runPot: 40, vault: 12, openSeed: "seed-held" });
  harness.act("saveGame", { exit: true, dynamics: heldRun });
  pin("save/and-exit-with-held-window", harness);
});

test("saving when another tab has moved the run on", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("saveGame");
  harness.writeFromAnotherTab({ dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 9 }) });
  harness.act("saveGame", { exit: true });
  pin("save/refused-as-stale", harness);
});

test("dismissing the recovery notice", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("dismissRecoveryNotice");
  pin("recovery/dismiss-notice", harness);
});

test("opening the season's first case", async () => {
  const harness = await createRunHarness({ operatorOrigin: "public", patch: { playerName: "분석관" } });
  harness.act("openCase", "prologue01");
  pin("openCase/season-first", harness);
});

test("opening the next case, with what the last one left", async () => {
  const closed = { ...pausedRun(), log: [], nodeId: "result" };
  const harness = await createRunHarness({ saved: closed, patch: { decisionReveal: { nextNode: "result" } } });
  harness.act("openCase", "prologue02");
  pin("openCase/next-with-legacy", harness);
});

test("opening a case with no result before it", async () => {
  const harness = await createRunHarness({ saved: { ...pausedRun(), caseResults: {} } });
  harness.act("openCase", "prologue03");
  pin("openCase/no-previous-result", harness);
});

test("opening a case that already closed, as practice", async () => {
  const replayed = pausedRun();
  replayed.caseResults.prologue02 = { rank: "C", outcomeChoiceId: "p2_anything", completedAt: "2026-10-02T00:00:00.000Z" };
  replayed.completedCases = ["prologue01", "prologue02"];
  const harness = await createRunHarness({ saved: replayed });
  harness.act("openCase", "prologue02");
  pin("openCase/replay-of-closed-case", harness);
});

test("jumping to a scene as a new run", async () => {
  const harness = await createRunHarness({ saved: midRun(), patch: dirtyPanels });
  harness.act("jumpToNode", "case05", "c5_voice");
  pin("jump/debug-start", harness);
});

test("jumping to a scene for a replay, which is not saved", async () => {
  const harness = await createRunHarness({ saved: midRun(), patch: dirtyPanels });
  harness.act("jumpToNode", "case05", "c5_voice", { echoText: "재현 링크로 연 장면입니다.", persistRun: false });
  pin("jump/replay-unsaved", harness);
});

test("jumping to a case and scene the season does not have", async () => {
  const harness = await createRunHarness();
  harness.act("jumpToNode", "case99", "nowhere");
  pin("jump/unknown-ids", harness);
});

test("leaving for the season map", async () => {
  const harness = await createRunHarness({ saved: midRun() });
  harness.act("leaveToSeasonMap");
  pin("map/leave", harness);
});

const RESET_STORAGE = {
  "critical-point-operator-origin": "lab",
};

test("wiping the run", async () => {
  const harness = await createRunHarness({ saved: midRun(), operatorOrigin: "lab", patch: dirtyPanels, storage: RESET_STORAGE });
  harness.act("saveGame");
  await harness.act("resetEverything");
  pin("reset/confirmed", harness);
});

test("declining to wipe the run", async () => {
  const harness = await createRunHarness({ saved: midRun(), patch: dirtyPanels, confirm: false });
  harness.act("saveGame");
  await harness.act("resetEverything");
  pin("reset/declined", harness);
});

test("the fixture holds nothing this file no longer checks", () => {
  if (updating) return;
  assert.deepEqual(Object.keys(pinned).sort(), Object.keys(recorded).sort());
});
