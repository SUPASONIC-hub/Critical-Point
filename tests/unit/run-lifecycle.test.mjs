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

test("the fixture holds nothing this file no longer checks", () => {
  if (updating) return;
  assert.deepEqual(Object.keys(pinned).sort(), Object.keys(recorded).sort());
});
