import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createRunHarness, HARNESS_NOW, restoreGlobals } from "./helpers/runHarness.mjs";

/**
 * The persistence hook's own promises, driven without a browser: a change to
 * the run and the save it writes are one step, the save is told the one thing
 * the run is not, and the recovery centre's controls do what their questions
 * say. What starting and leaving a run do is pinned in run-lifecycle.test.mjs.
 */
const appConfig = await import("../../src/appConfig.js");

after(restoreGlobals);

const stored = (key) => {
  const raw = globalThis.localStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
};

test("a change applied to the run is in memory and in the save at once", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  const written = harness.act("applyRun", { playerName: "바뀐 이름", isPausedSave: true, decisionReveal: { nextNode: "x" } });
  assert.equal(written.storageSaved, true);
  assert.deepEqual([harness.run.playerName, harness.run.isPausedSave], ["바뀐 이름", true]);
  assert.deepEqual([harness.saved().playerName, harness.saved().paused], ["바뀐 이름", true]);
  assert.ok(!("decisionReveal" in harness.saved()), "what the save does not keep is not written");
  assert.equal(harness.run.lastSavedAt, "<savedAt>", "and the run knows when it was last saved, as the intro prints it");
});

test("the save can be told the page is going away without the run being told", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("applyRun", {}, { saveOnly: { paused: true } });
  assert.equal(harness.saved().paused, true);
  assert.equal(harness.run.isPausedSave, false);
});

test("a write another tab is ahead of locks this tab and changes nothing in storage", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.writeFromAnotherTab({ runId: "another-tabs-run" });
  const written = harness.act("persist", { playerName: "늦은 탭" });
  assert.deepEqual([written.stale, written.storageSaved], [true, false]);
  assert.equal(harness.run.staleSave, true);
  assert.equal(harness.saved().runId, "another-tabs-run");
  assert.match(harness.status, /다른 탭/);
});

test("a write with no storage under it says so and goes on", async () => {
  const harness = await createRunHarness();
  globalThis.localStorage.unavailable = true;
  const written = harness.act("applyRun", { playerName: "저장 없이" });
  globalThis.localStorage.unavailable = false;
  assert.equal(written.storageSaved, false);
  assert.equal(harness.run.playerName, "저장 없이");
  assert.equal(harness.run.lastSavedAt, "", "a write that did not land is not a save time");
  assert.match(harness.status, /저장소를 사용할 수 없어/);
});

test("picking a run up again at the same place does not add a slot for it each time", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  assert.equal(harness.slotCount(), 1);
  for (let visit = 0; visit < 5; visit += 1) {
    harness.act("leaveToSeasonMap");
    harness.act("resume");
  }
  assert.equal(harness.slotCount(), 1, "five visits to one scene used to fill all five slots with it");
  // A decision later it is another place, and worth a slot of its own.
  harness.act("applyRun", { log: [{ nodeId: harness.run.nodeId, choiceId: "first" }] });
  harness.act("leaveToSeasonMap");
  harness.act("resume");
  assert.equal(harness.slotCount(), 2);
});

test("closing the recovery centre closes both panels and forgets it was asked for", async () => {
  const harness = await createRunHarness({
    storage: { [appConfig.RECOVERY_CENTER_STORAGE_KEY]: "1" },
    patch: { showRecoveryCenter: true, showErrorLog: true },
  });
  harness.act("closeRecoveryCenter");
  assert.deepEqual([harness.run.showRecoveryCenter, harness.run.showErrorLog], [false, false]);
  assert.equal(globalThis.localStorage.getItem(appConfig.RECOVERY_CENTER_STORAGE_KEY), null);
});

test("the error log is read from storage, and cleared only when the question is answered yes", async () => {
  const declined = await createRunHarness({ confirm: false, patch: { lastRecoveredError: { message: "앞선 오류" } } });
  declined.act("startGame");
  declined.act("applyRun", { lastRecoveredError: { message: "새 오류" } });
  declined.act("clearErrorLog");
  assert.deepEqual(declined.run.lastRecoveredError, { message: "새 오류" });

  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("applyRun", { lastRecoveredError: { message: "새 오류" } });
  assert.deepEqual(harness.saved().lastError, { message: "새 오류" });
  harness.act("refreshErrorLog");
  assert.deepEqual(harness.outside.localErrorEntries, []);
  harness.act("clearErrorLog");
  assert.equal(harness.run.lastRecoveredError, null);
  assert.equal(harness.saved().lastError, null);
  assert.equal(globalThis.localStorage.getItem(appConfig.ERROR_LOG_STORAGE_KEY), null);
});

test("a recovery slot is deleted from storage and from the list on screen", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("refreshErrorLog");
  const [slot] = harness.outside.saveSlots;
  assert.ok(slot?.id, "a new game leaves a slot to go back to");
  harness.act("deleteSlot", slot.id);
  assert.deepEqual(harness.outside.saveSlots, []);
  assert.deepEqual(stored(appConfig.SAVE_SLOT_STORAGE_KEY).slots, []);
});

test("deleting a slot leaves the slots the list on screen had not been told about", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("refreshErrorLog");
  const [listed] = harness.outside.saveSlots;
  // A case opens after the list was read: storage has a second slot, the list one.
  harness.act("applyRun", { currentCase: "prologue02" });
  assert.deepEqual([harness.slotCount(), harness.outside.saveSlots.length], [2, 1]);
  harness.act("deleteSlot", listed.id);
  const left = stored(appConfig.SAVE_SLOT_STORAGE_KEY).slots;
  assert.deepEqual(left.map((slot) => slot.currentCase), ["prologue02"], "the slot nobody asked to delete is still in storage");
  assert.deepEqual(harness.outside.saveSlots.map((slot) => slot.id), left.map((slot) => slot.id), "and the list shows what storage holds");
});

test("starting fresh from the recovery notice removes the save, keeps the slots, and reloads into the centre", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("startFresh");
  assert.equal(harness.saved(), null);
  assert.equal(harness.slotCount(), 1);
  assert.equal(globalThis.localStorage.getItem(appConfig.RECOVERY_CENTER_STORAGE_KEY), "1");
  assert.deepEqual(harness.effects.slice(-2), ["suppress-saves", "reload"]);
});

test("a slot is restored as a paused save on the intro, with the queue the current save holds", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("refreshErrorLog");
  const [slot] = harness.outside.saveSlots;
  harness.act("applyRun", { nodeEnteredAt: HARNESS_NOW + 1, playerName: "슬롯 뒤의 이름" });
  await harness.act("restoreSlot", slot);
  const restored = harness.saved();
  assert.deepEqual([restored.started, restored.paused, restored.runId], [false, true, slot.snapshot.runId]);
  assert.notEqual(restored.playerName, "슬롯 뒤의 이름");
  assert.deepEqual(harness.effects.slice(-2), ["suppress-saves", "reload"]);
});

const queuedRow = { id: "case-queued", type: "case", label: "보관된 로그", payload: {} };

test("restoring a slot or a kept save does not give back a consent the player withdrew", async () => {
  const harness = await createRunHarness({ patch: { dataConsent: true, pendingTelemetry: [queuedRow] } });
  harness.act("startGame");
  harness.act("refreshErrorLog");
  const [slot] = harness.outside.saveSlots;
  assert.equal(slot.snapshot.dataConsent, true, "the slot was taken while the box was ticked");
  const saveWhileTicked = globalThis.localStorage.getItem(appConfig.STORAGE_KEY);
  // The box is unticked: consent off and the queue emptied, in the save.
  harness.act("persist", { dataConsent: false, pendingTelemetry: [] });
  await harness.act("restoreSlot", slot);
  assert.deepEqual([harness.saved().dataConsent, harness.saved().pendingTelemetry], [false, []]);
  // The kept copy of a save this build could not read goes through the same door.
  globalThis.localStorage.setItem(appConfig.SAVE_BACKUP_STORAGE_KEY, saveWhileTicked);
  await harness.act("restoreBackup");
  assert.deepEqual([harness.saved().dataConsent, harness.saved().pendingTelemetry], [false, []]);
  assert.equal(globalThis.localStorage.getItem(appConfig.SAVE_BACKUP_STORAGE_KEY), null, "the kept copy was the one restored");
});

test("restoring a slot keeps a consent given since the slot was taken, and its queue", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  harness.act("refreshErrorLog");
  const [slot] = harness.outside.saveSlots;
  assert.equal(slot.snapshot.dataConsent, false);
  harness.act("persist", { dataConsent: true, pendingTelemetry: [queuedRow] });
  await harness.act("restoreSlot", slot);
  assert.equal(harness.saved().dataConsent, true);
  assert.deepEqual(harness.saved().pendingTelemetry.map((item) => item.id), [queuedRow.id]);
});

test("a kept save restored where there is no save comes back with consent off and nothing queued", async () => {
  const harness = await createRunHarness({ patch: { dataConsent: true, pendingTelemetry: [queuedRow] } });
  harness.act("startGame");
  const saveWhileTicked = globalThis.localStorage.getItem(appConfig.STORAGE_KEY);
  globalThis.localStorage.removeItem(appConfig.STORAGE_KEY);
  globalThis.localStorage.setItem(appConfig.SAVE_BACKUP_STORAGE_KEY, saveWhileTicked);
  await harness.act("restoreBackup");
  assert.deepEqual([harness.saved().dataConsent, harness.saved().pendingTelemetry], [false, []]);
});

test("a slot that cannot be read is refused, and so is a backup that is not there", async () => {
  const harness = await createRunHarness();
  harness.act("startGame");
  const before = harness.saved();
  await harness.act("restoreSlot", { id: "broken", snapshot: null });
  assert.match(harness.status, /손상되어/);
  await harness.act("restoreBackup");
  assert.match(harness.status, /읽을 수 없습니다/);
  assert.deepEqual(harness.saved(), before);
  assert.ok(!harness.effects.includes("reload"));
});
