import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser, missingFunction, ok, refusal } from "./helpers/browser.mjs";

/**
 * Two devices and one continuation code (priority 59), against a scripted
 * server that answers as the database does from 20260929030000 on -- and,
 * since that server has a read limit, once when it cannot be asked what it
 * holds. A database from before that migration is a failure, not a second way
 * of uploading.
 */
const browser = installBrowser();
const config = await import("../../src/appConfig.js");
const { RUN_INITIAL_STATE, serializeRunState } = await import("../../src/gauntlet/gauntletEngine.js");

const CODE = "ABCDEFGH2345";
let copy = 0;
/** A fresh copy of the module, so one test's conflict is not the next one's. */
const loadCloudSave = () => import(`../../src/cloudSave.js?copy=${(copy += 1)}`);

function makeSave(overrides = {}) {
  return {
    saveSchemaVersion: config.SAVE_SCHEMA_VERSION,
    runId: "run-cloud",
    playerName: "이 기기의 이름",
    dataConsent: true,
    started: true,
    paused: false,
    currentCase: "case04",
    nodeId: "c4_offer",
    completedCases: ["case01", "case02", "case03"],
    discoveredClues: [],
    log: [],
    caseResults: {},
    playtestFeedback: { case01: { clarity: 4, difficulty: 3, comment: "플레이어가 쓴 의견" } },
    resources: { time: 60, capital: 70, trust: 55, legitimacy: 52, humanCost: 8, fatigue: 20 },
    triggers: {},
    cognition: {},
    pendingTelemetry: [],
    savedAt: "2026-09-28T09:00:00.000Z",
    ...overrides,
  };
}

function resetDevice({ save = makeSave(), sync = null, enabled = true } = {}) {
  browser.storage.clear();
  browser.storage.setItem("critical-point-telemetry-url", "https://unit.supabase.test");
  browser.storage.setItem("critical-point-telemetry-key", "unit-test-key");
  if (save) browser.storage.setItem(config.STORAGE_KEY, JSON.stringify(save));
  if (sync) browser.storage.setItem(config.CLOUD_SAVE_SYNC_KEY, JSON.stringify(sync));
  browser.storage.setItem(config.CLOUD_SAVE_ENABLED_KEY, enabled ? "1" : "0");
  browser.storage.setItem(config.CLOUD_SAVE_CODE_KEY, CODE);
  browser.calls.length = 0;
  browser.setOnline(true);
  config.setReplaySession(false);
}

const readSync = () => JSON.parse(browser.storage.getItem(config.CLOUD_SAVE_SYNC_KEY) ?? "{}");
const puts = () => browser.callsTo("/rest/v1/rpc/put_cloud_save");

/** The database with `peek_cloud_save` and `p_expected_revision`. */
function newServer({ stored = null } = {}) {
  const server = { stored };
  browser.respond("/rest/v1/rpc/peek_cloud_save", () =>
    ok(server.stored ? { saved_at: server.stored.saved_at, revision: server.stored.revision } : null),
  );
  browser.respond("/rest/v1/rpc/get_cloud_save", () => ok(server.stored));
  browser.respond("/rest/v1/rpc/delete_cloud_save", () => {
    const existed = Boolean(server.stored);
    server.stored = null;
    return ok(existed);
  });
  browser.respond("/rest/v1/rpc/put_cloud_save", ({ body }) => {
    const current = server.stored?.revision ?? 0;
    if (body.p_expected_revision !== undefined && body.p_expected_revision !== current) {
      return ok({ accepted: false, reason: "revision", saved_at: server.stored.saved_at, revision: current });
    }
    server.stored = { saved_at: body.p_saved_at, payload: body.p_payload, revision: current + 1 };
    return ok({ accepted: true, saved_at: body.p_saved_at, revision: current + 1 });
  });
  return server;
}

/**
 * The same database past its read limit: it will not say what it holds, and a
 * put that names no revision is ordered by time, as `put_cloud_save` orders it
 * -- so such a put, were one sent, replaces any copy older than the present.
 * `liftLimit` is the hour turning.
 */
function serverPastItsReadLimit({ stored = null } = {}) {
  const server = newServer({ stored });
  server.liftLimit = () =>
    browser.respond("/rest/v1/rpc/peek_cloud_save", () =>
      ok(server.stored ? { saved_at: server.stored.saved_at, revision: server.stored.revision } : null),
    );
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => refusal(429, "cloud save rate limit exceeded", "PT429"));
  browser.respond("/rest/v1/rpc/put_cloud_save", ({ body }) => {
    const current = server.stored?.revision ?? 0;
    const named = "p_expected_revision" in body;
    const refused = named ? body.p_expected_revision !== current : Date.parse(server.stored?.saved_at) > Date.parse(body.p_saved_at);
    if (server.stored && refused) {
      return ok({ accepted: false, reason: named ? "revision" : "older", saved_at: server.stored.saved_at, revision: current });
    }
    server.stored = { saved_at: body.p_saved_at, payload: body.p_payload, revision: current + 1 };
    return ok({ accepted: true, saved_at: body.p_saved_at, revision: current + 1 });
  });
  return server;
}

test("the first upload starts the code, and the device remembers the revision it was given", async () => {
  resetDevice();
  const server = newServer();
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts().length, 1);
  assert.equal(puts()[0].body.p_expected_revision, 0, "an upload for a code the server has never seen expects nothing there");
  assert.deepEqual(Object.keys(puts()[0].body.p_payload).sort(), ["save", "settledWindows"], "the payload is the shape the server requires");
  assert.equal(server.stored.payload.save.playerName, undefined, "the name stays on the device");
  assert.equal(server.stored.payload.save.playtestFeedback.case01.comment, "");
  assert.equal(readSync().revision, 1);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "synced");
});

test("an upload built on the stored revision is accepted and moves the device's revision on", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T10:00:00.000Z" }), sync: { pending: "2026-09-28T10:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 4 } });
  newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 4 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts()[0].body.p_expected_revision, 4);
  assert.deepEqual({ pending: readSync().pending, revision: readSync().revision, conflict: readSync().conflict }, { pending: "", revision: 5, conflict: null });
});

test("a device that fell behind does not overwrite newer play, however late its clock says it is", async () => {
  // This device last synced revision 1 at nine. Another device has since taken
  // the code to revision 3. This one is opened at noon and makes one decision.
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T12:00:00.000Z" }), sync: { pending: "2026-09-28T12:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 1 } });
  const server = newServer({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: { save: { runId: "evening" } }, revision: 3 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0, "nothing was uploaded");
  assert.equal(server.stored.payload.save.runId, "evening");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");
  assert.equal(cloud.getCloudSaveSnapshot().remoteSavedAt, "2026-09-28T11:00:00.000Z");
  assert.equal(cloud.hasCloudConflict(), true);

  // The conflict stays. The next local write used to re-arm the upload with a
  // fresh timestamp, and the server took it.
  browser.storage.setItem(config.STORAGE_KEY, JSON.stringify(makeSave({ savedAt: "2026-09-28T12:05:00.000Z" })));
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");

  // It also survives a reload: the next page load reads it from storage.
  const reloaded = await loadCloudSave();
  assert.equal(reloaded.hasCloudConflict(), true);
  assert.equal(await reloaded.flushCloudSave(), false);
  assert.equal(puts().length, 0);
});

test("a device that believes it is in step asks the server before saying so", async () => {
  resetDevice({ sync: { pending: "", synced: "2026-09-28T09:00:00.000Z", revision: 1 } });
  newServer({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: {}, revision: 2 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(browser.callsTo("/rest/v1/rpc/peek_cloud_save").length, 1);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict", "it used to print 기기와 온라인 모두 최신입니다 from its own bookkeeping");
});

test("a device that is in step says so, and uploads nothing", async () => {
  resetDevice({ sync: { pending: "", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts().length, 0);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "synced");
  // Asked once a page load, not on every flush.
  await cloud.flushCloudSave();
  assert.equal(browser.callsTo("/rest/v1/rpc/peek_cloud_save").length, 1);
});

test("choosing this device's progress overwrites the stored copy and ends the conflict", async () => {
  resetDevice({
    save: makeSave({ savedAt: "2026-09-28T08:00:00.000Z" }),
    sync: { pending: "2026-09-28T08:00:00.000Z", synced: "", revision: 1, conflict: { savedAt: "2026-09-28T11:00:00.000Z", revision: 3 } },
  });
  const server = newServer({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: {}, revision: 3 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false, "without the player's say-so it stays a conflict");
  assert.equal(await cloud.flushCloudSave({ overwrite: true }), true);
  assert.equal(puts().at(-1).body.p_expected_revision, 3, "an overwrite names the revision it replaces");
  assert.equal(server.stored.revision, 4);
  assert.equal(readSync().conflict, null);
  assert.equal(cloud.hasCloudConflict(), false);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "synced");
});

test("a reset keeps the online copy: the next run is not uploaded over it until the player says so", async () => {
  const uploadedAt = "2026-09-28T09:00:00.000Z";
  resetDevice({ sync: { pending: "", synced: uploadedAt, revision: 4 } });
  const server = newServer({ stored: { saved_at: uploadedAt, payload: { save: { runId: "run-cloud" } }, revision: 4 } });
  const cloud = await loadCloudSave();

  // 초기화: the save goes, the code and the record of what was uploaded stay.
  browser.storage.removeItem(config.STORAGE_KEY);
  assert.equal(cloud.holdCloudCopyThroughReset(), true);
  assert.deepEqual(readSync().conflict, { savedAt: uploadedAt, revision: 4 });

  // The first save of the next run. It used to go up as revision 5.
  browser.storage.setItem(config.STORAGE_KEY, JSON.stringify(makeSave({ runId: "run-after-reset", savedAt: "2026-09-28T10:00:00.000Z" })));
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(server.stored.payload.save.runId, "run-cloud", "the copy the question said is kept is still there");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");
  assert.equal(cloud.hasCloudConflict(), true);
  assert.match(cloud.describeCloudPhase("conflict"), /초기화하기 전의 진행/);

  // The player's own answer ends it, as it ends any conflict.
  assert.equal(await cloud.flushCloudSave({ overwrite: true }), true);
  assert.equal(server.stored.payload.save.runId, "run-after-reset");
  assert.equal(readSync().conflict, null);

  // A device that never uploaded has no copy to keep, and nothing is held.
  resetDevice();
  const fresh = await loadCloudSave();
  assert.equal(fresh.holdCloudCopyThroughReset(), false);
  assert.equal(readSync().conflict ?? null, null);
});

test("uploads are spaced once half the hour's puts are spent, so quick play stays under the server's 240", async () => {
  const { paceUpload } = await loadCloudSave();
  const now = 10_000_000;
  const every = (count, gapMs) => Array.from({ length: count }, (_, index) => now - (count - 1 - index) * gapMs);
  // Ordinary play: the upload follows the save by the usual moment.
  assert.equal(paceUpload(2500, [], now), 2500);
  assert.equal(paceUpload(2500, every(119, 5_000), now), 2500);
  // The 120th put of the hour was just made: the next waits thirty seconds from it.
  assert.equal(paceUpload(2500, every(120, 5_000), now), 30_000);
  assert.equal(paceUpload(2500, every(120, 5_000), now + 29_000), 2500, "a save that comes late waits only the usual moment");
  assert.equal(paceUpload(0, every(120, 5_000), now + 10_000), 20_000, "and the retry tick is held to the same spacing");
  // Puts from more than an hour ago are not this hour's.
  assert.equal(paceUpload(2500, every(120, 5_000), now + 60 * 60_000), 2500);
  // The worst hour: 120 puts at once, then one every thirty seconds, is 240.
  assert.ok(120 + (60 * 60_000) / 30_000 <= 240);
});

test("a put the server refuses is a conflict, with what the server holds", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T10:00:00.000Z" }), sync: { pending: "2026-09-28T10:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  // Another device uploads between this one's check and its put.
  browser.respond("/rest/v1/rpc/put_cloud_save", () => ok({ accepted: false, reason: "revision", saved_at: "2026-09-28T09:59:00.000Z", revision: 3 }));
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.deepEqual(readSync().conflict, { savedAt: "2026-09-28T09:59:00.000Z", revision: 3 });
  assert.equal(readSync().pending, "2026-09-28T10:00:00.000Z", "the local save is still waiting, not forgotten");
});

test("another tab of this device uploading in between is not another device", async () => {
  const save = makeSave({ savedAt: "2026-09-28T10:00:00.000Z" });
  const behind = { pending: "2026-09-28T10:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 2 };
  const otherTabLands = (revision, savedAt) =>
    browser.storage.setItem(config.CLOUD_SAVE_SYNC_KEY, JSON.stringify({ ...readSync(), synced: savedAt, revision }));

  // The other tab's upload lands, and is recorded, while this tab is asking
  // what the server holds.
  resetDevice({ save, sync: behind });
  const checked = newServer({ stored: { saved_at: "2026-09-28T09:30:00.000Z", payload: {}, revision: 3 } });
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => {
    otherTabLands(3, "2026-09-28T09:30:00.000Z");
    return ok({ saved_at: checked.stored.saved_at, revision: checked.stored.revision });
  });
  let cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts()[0].body.p_expected_revision, 3, "built on the other tab's copy");
  assert.equal(cloud.hasCloudConflict(), false);

  // It lands between this tab's check and its put: the put is refused once,
  // and sent again on the revision the other tab was given.
  resetDevice({ save, sync: behind });
  const refusing = newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  let refusedOnce = false;
  browser.respond("/rest/v1/rpc/put_cloud_save", ({ body }) => {
    if (!refusedOnce) {
      refusedOnce = true;
      refusing.stored = { saved_at: "2026-09-28T09:59:00.000Z", payload: {}, revision: 3 };
      otherTabLands(3, "2026-09-28T09:59:00.000Z");
      return ok({ accepted: false, reason: "revision", saved_at: "2026-09-28T09:59:00.000Z", revision: 3 });
    }
    refusing.stored = { saved_at: body.p_saved_at, payload: body.p_payload, revision: body.p_expected_revision + 1 };
    return ok({ accepted: true, saved_at: body.p_saved_at, revision: body.p_expected_revision + 1 });
  });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.deepEqual(puts().map((put) => put.body.p_expected_revision), [2, 3]);
  assert.equal(readSync().revision, 4);
  assert.equal(readSync().conflict, null);

  // The other tab has not recorded its revision yet, but the copy carries the
  // time of the save in this device's storage: it is this device's.
  resetDevice({ save, sync: behind });
  newServer({ stored: { saved_at: save.savedAt, payload: {}, revision: 3 } });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(cloud.hasCloudConflict(), false);
});

test("a server that cannot be asked, and no revision on record: nothing is uploaded until it answers", async () => {
  // This device has no revision on record (it opted in before revisions were
  // sent, or took its online copy back), and another device has since played
  // the code to revision 3. This one is opened at noon, past the read limit.
  const noon = "2026-09-28T12:00:00.000Z";
  resetDevice({ save: makeSave({ savedAt: noon }), sync: { pending: "", synced: "2026-09-28T09:00:00.000Z", revision: null } });
  const server = serverPastItsReadLimit({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: { save: { runId: "evening" } }, revision: 3 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0, "it used to go out naming no revision, and noon is later than eleven");
  assert.equal(server.stored.payload.save.runId, "evening");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "error");
  assert.match(cloud.getCloudSaveSnapshot().message, /너무 잦습니다.*다시 시도합니다/);
  assert.equal(readSync().pending, noon, "the save is noted as waiting, which is what the retry tick reads");
  assert.equal(readSync().conflict ?? null, null, "not knowing is not a conflict");

  // Asked again on the next try, and again refused.
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(browser.callsTo("/rest/v1/rpc/peek_cloud_save").length, 2);
  assert.equal(puts().length, 0);

  // The hour turns: the server answers, and what it holds is another device's.
  server.liftLimit();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(server.stored.payload.save.runId, "evening");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");
  assert.deepEqual(readSync().conflict, { savedAt: "2026-09-28T11:00:00.000Z", revision: 3 });
});

test("a new device whose first question goes unanswered waits, then starts the code", async () => {
  const savedAt = "2026-09-28T10:00:00.000Z";
  resetDevice({ save: makeSave({ savedAt }) });
  const server = serverPastItsReadLimit();
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(readSync().pending, savedAt);
  server.liftLimit();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts().length, 1);
  assert.equal(puts()[0].body.p_expected_revision, 0, "only an answer that the server holds nothing lets the first upload out");
  assert.deepEqual({ pending: readSync().pending, revision: readSync().revision }, { pending: "", revision: 1 });
  assert.equal(cloud.getCloudSaveSnapshot().phase, "synced");
});

test("no connection to ask over, or an answer with no revision in it, is not an answer either", async () => {
  const savedAt = "2026-09-28T10:00:00.000Z";
  const sync = { pending: savedAt, synced: "", revision: null };
  resetDevice({ save: makeSave({ savedAt }), sync });
  newServer({ stored: { saved_at: "2026-09-28T09:30:00.000Z", payload: {}, revision: 2 } });
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => {
    throw new TypeError("fetch failed");
  });
  let cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "error");
  assert.match(cloud.getCloudSaveSnapshot().message, /연결하지 못했습니다/);

  resetDevice({ save: makeSave({ savedAt }), sync });
  newServer({ stored: { saved_at: "2026-09-28T09:30:00.000Z", payload: {}, revision: 2 } });
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => ok({ saved_at: "2026-09-28T09:30:00.000Z" }));
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.match(cloud.getCloudSaveSnapshot().message, /온라인 저장에 실패했습니다/, "the server did answer, so it is not called a connection that failed");
  assert.equal(readSync().pending, savedAt);
});

test("every put names a revision: with one on record, a server that cannot be asked still gets the upload", async () => {
  const savedAt = "2026-09-28T10:00:00.000Z";
  resetDevice({ save: makeSave({ savedAt }), sync: { pending: savedAt, synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  const server = serverPastItsReadLimit({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  let cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts()[0].body.p_expected_revision, 2);
  assert.equal(server.stored.revision, 3);

  // And when that revision is stale the server refuses it: a conflict, not a loss.
  resetDevice({ save: makeSave({ savedAt }), sync: { pending: savedAt, synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  const moved = serverPastItsReadLimit({ stored: { saved_at: "2026-09-28T09:40:00.000Z", payload: { save: { runId: "evening" } }, revision: 5 } });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts()[0].body.p_expected_revision, 2);
  assert.equal(moved.stored.payload.save.runId, "evening");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");
});

test("an overwrite the server cannot be asked about names the copy the player was shown", async () => {
  const savedAt = "2026-09-28T12:00:00.000Z";
  const held = { savedAt: "2026-09-28T11:00:00.000Z", revision: 3 };
  resetDevice({ save: makeSave({ savedAt }), sync: { pending: savedAt, synced: "", revision: 1, conflict: held } });
  const server = serverPastItsReadLimit({ stored: { saved_at: held.savedAt, payload: {}, revision: 3 } });
  let cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave({ overwrite: true }), true);
  assert.equal(puts()[0].body.p_expected_revision, 3);
  assert.equal(server.stored.revision, 4);
  assert.equal(readSync().conflict, null);

  // A third upload since the question was put: that is not the copy the
  // player agreed to replace, so it is a conflict again.
  resetDevice({ save: makeSave({ savedAt }), sync: { pending: savedAt, synced: "", revision: 1, conflict: held } });
  const again = serverPastItsReadLimit({ stored: { saved_at: "2026-09-28T11:30:00.000Z", payload: { save: { runId: "third" } }, revision: 4 } });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave({ overwrite: true }), false);
  assert.equal(again.stored.payload.save.runId, "third");
  assert.deepEqual(readSync().conflict, { savedAt: "2026-09-28T11:30:00.000Z", revision: 4 });

  // A conflict that never learned a revision has nothing to name: nothing is
  // sent, and the conflict is still the player's to settle.
  resetDevice({ save: makeSave({ savedAt }), sync: { pending: savedAt, synced: "", revision: null, conflict: { savedAt: held.savedAt, revision: null } } });
  serverPastItsReadLimit({ stored: { saved_at: held.savedAt, payload: {}, revision: 3 } });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave({ overwrite: true }), false);
  assert.equal(puts().length, 0);
  assert.equal(cloud.hasCloudConflict(), true);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "error");
});

test("a database from before the migration is a failure the player is told, not a second upload", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T10:00:00.000Z" }), sync: { pending: "2026-09-28T10:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => missingFunction("peek_cloud_save(p_code)"));
  browser.respond("/rest/v1/rpc/put_cloud_save", () => missingFunction("put_cloud_save(p_code, p_expected_revision, p_payload, p_saved_at)"));
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 1, "it used to be sent again without the revision");
  assert.equal(puts()[0].body.p_expected_revision, 2);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "error");
  assert.match(cloud.getCloudSaveSnapshot().message, /온라인 저장에 실패했습니다/);
  assert.equal(readSync().pending, "2026-09-28T10:00:00.000Z", "the local save is still waiting");
});

test("a later local write does not slip past a server that still cannot be asked", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T08:00:00.000Z" }), sync: { pending: "2026-09-28T08:00:00.000Z", synced: "", revision: null } });
  const server = serverPastItsReadLimit({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: { save: { runId: "evening" } }, revision: 3 } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  // Stamped later than the server's copy: ordered by time it would be taken.
  browser.storage.setItem(config.STORAGE_KEY, JSON.stringify(makeSave({ savedAt: "2026-09-28T12:00:00.000Z" })));
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0);
  assert.equal(server.stored.payload.save.runId, "evening");
});

test("offline, and switched off, nothing is sent", async () => {
  resetDevice({ sync: { pending: "2026-09-28T09:00:00.000Z", synced: "", revision: null } });
  newServer();
  const cloud = await loadCloudSave();
  browser.setOnline(false);
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "offline");
  browser.setOnline(true);
  browser.storage.setItem(config.CLOUD_SAVE_ENABLED_KEY, "0");
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "disabled");
  assert.equal(browser.calls.length, 0);
});

test("a connection that drops while the server is being asked sends no put", async () => {
  // The first upload of a run, with nothing yet marked pending: the peek is
  // answered, and the device is offline by the time the put would go.
  resetDevice({ sync: { pending: "", synced: "", revision: null } });
  const server = newServer();
  let dropped = false;
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => {
    if (!dropped) browser.setOnline(false);
    dropped = true;
    return ok(null);
  });
  let cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 0, "nothing leaves the device while offline");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "offline");
  assert.equal(readSync().pending, makeSave().savedAt, "the save is waiting for the connection");
  browser.setOnline(true);
  assert.equal(await cloud.flushCloudSave(), true);
  assert.deepEqual(puts().map((put) => put.body.p_expected_revision), [0]);
  assert.equal(server.stored.revision, 1);

  // Refused over another tab's copy, the second put is not sent once the
  // connection has gone in between.
  const save = makeSave({ savedAt: "2026-09-28T10:00:00.000Z" });
  resetDevice({ save, sync: { pending: save.savedAt, synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  browser.respond("/rest/v1/rpc/put_cloud_save", () => {
    browser.storage.setItem(config.CLOUD_SAVE_SYNC_KEY, JSON.stringify({ ...readSync(), synced: "2026-09-28T09:59:00.000Z", revision: 3 }));
    browser.setOnline(false);
    return ok({ accepted: false, reason: "revision", saved_at: "2026-09-28T09:59:00.000Z", revision: 3 });
  });
  cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.deepEqual(puts().map((put) => put.body.p_expected_revision), [2]);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "offline");
  assert.equal(readSync().pending, save.savedAt);
  assert.equal(cloud.hasCloudConflict(), false, "another tab's copy is not held as a conflict");
});

test("a failure is told to the player in Korean, never in the server's words", async () => {
  resetDevice({ sync: { pending: "2026-09-28T09:00:00.000Z", synced: "", revision: null } });
  newServer();
  browser.respond("/rest/v1/rpc/put_cloud_save", () => refusal(429, "cloud save code limit reached", "PT429"));
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  const { phase, message } = cloud.getCloudSaveSnapshot();
  assert.equal(phase, "error");
  assert.match(message, /이어하기 코드/);
  for (const error of [
    Object.assign(new Error("put_cloud_save failed: 400: {\"code\":\"P0001\"}"), { status: 400, serverMessage: "invalid cloud save payload" }),
    Object.assign(new Error("x"), { status: 429, serverMessage: "cloud save rate limit exceeded" }),
    Object.assign(new Error("x"), { status: 500, serverMessage: "internal" }),
    new Error("fetch failed"),
  ]) {
    const sentence = cloud.describeCloudFailure(error);
    assert.match(sentence, /[가-힣]/);
    assert.doesNotMatch(sentence, /[{}]|failed|P0001|cloud save/);
  }
});

test("loading a copy keeps this device's name, consent and queue", async () => {
  const queued = { id: "case-1", type: "case", label: "케이스 로그", payload: { event_id: "e1", session_id: "unit-session-1", case_id: "case01" } };
  resetDevice({ save: makeSave({ runId: "run-local", playerName: "이 기기의 이름", dataConsent: true, pendingTelemetry: [queued] }) });
  const remote = makeSave({ runId: "run-remote", playerName: "", dataConsent: false, currentCase: "case09", nodeId: "c9_start", savedAt: "2026-09-28T11:00:00.000Z" });
  newServer({ stored: { saved_at: remote.savedAt, payload: { save: remote, settledWindows: ["seed-remote"] }, revision: 7 } });
  const cloud = await loadCloudSave();
  const found = await cloud.fetchCloudSave("abcd-efgh-2345");
  assert.equal(found.revision, 7);
  assert.equal(await cloud.applyCloudSave(found), true);
  const local = JSON.parse(browser.storage.getItem(config.STORAGE_KEY));
  assert.equal(local.runId, "run-remote");
  assert.equal(local.currentCase, "case09");
  assert.equal(local.playerName, "이 기기의 이름");
  assert.equal(local.dataConsent, true);
  assert.deepEqual(local.pendingTelemetry.map((item) => item.id), ["case-1"]);
  assert.equal(local.started, false, "이어하기 is still the player's own click");
  assert.equal(local.paused, true);
  assert.deepEqual({ revision: readSync().revision, conflict: readSync().conflict, pending: readSync().pending }, { revision: 7, conflict: null, pending: "" });
  assert.ok(config.readSettledWindowSeeds().includes("seed-remote"));
});

test("a device without consent does not inherit a queue", async () => {
  const queued = { id: "case-1", type: "case", label: "케이스 로그", payload: { event_id: "e1", session_id: "unit-session-1", case_id: "case01" } };
  resetDevice({ save: makeSave({ dataConsent: false, pendingTelemetry: [queued] }) });
  const remote = makeSave({ runId: "run-remote", dataConsent: true });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.applyCloudSave({ code: CODE, save: remote, settledWindows: [], revision: 1 }), true);
  const local = JSON.parse(browser.storage.getItem(config.STORAGE_KEY));
  assert.equal(local.dataConsent, false, "consent is this device's, not the copy's");
  assert.deepEqual(local.pendingTelemetry, []);
});

test("the settled windows of both copies are kept, up to the limit", async () => {
  resetDevice();
  const own = Array.from({ length: 300 }, (_, index) => `own-${index}`);
  browser.storage.setItem(config.SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(own));
  const theirs = Array.from({ length: 300 }, (_, index) => `remote-${index}`);
  const cloud = await loadCloudSave();
  await cloud.applyCloudSave({ code: CODE, save: makeSave({ runId: "run-remote" }), settledWindows: [...theirs, "own-299"], revision: 1 });
  const seeds = config.readSettledWindowSeeds();
  assert.equal(seeds.length, config.SETTLED_WINDOWS_LIMIT);
  assert.equal(new Set(seeds).size, seeds.length, "a seed both copies hold is kept once");
  assert.ok(seeds.includes("remote-299") && seeds.includes("own-299"));
});

test("loading one's own code does not undo a bust", async () => {
  const bustedEntry = { nodeId: "c4_offer", caseId: "case04", choiceId: "c4_offer_push", threshold: { state: "bust", busted: true, gauge: 71, wall: 70, pushes: 4 } };
  const before = makeSave({ dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 12, runPot: 900, busts: 0, cashes: 12 }) });
  const after = makeSave({
    log: [bustedEntry],
    savedAt: "2026-09-28T09:30:00.000Z",
    dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 13, runPot: 0, busts: 1, cashes: 12 }),
  });
  resetDevice({ save: after, enabled: false });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.applyCloudSave({ code: CODE, save: before, settledWindows: [], revision: 2 }), true);
  const local = JSON.parse(browser.storage.getItem(config.STORAGE_KEY));
  assert.equal(local.dynamics.windowIndex, 13, "the window count never goes backwards");
  assert.equal(local.dynamics.busts, 1);
  assert.equal(local.dynamics.runPot, 0, "the pot the bust wiped stays wiped");
  assert.equal(local.log.filter((entry) => entry.threshold?.busted).length, 1, "the bust is still in the log");
  assert.equal(readSync().synced, "", "what was carried across has not been uploaded yet");
});

test("a copy of another run is loaded as it is", async () => {
  resetDevice({ save: makeSave({ runId: "run-local", dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 40, busts: 9 }) }) });
  const remote = makeSave({ runId: "run-remote", dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 3, busts: 0 }) });
  const cloud = await loadCloudSave();
  await cloud.applyCloudSave({ code: CODE, save: remote, settledWindows: [], revision: 1 });
  const local = JSON.parse(browser.storage.getItem(config.STORAGE_KEY));
  assert.equal(local.dynamics.windowIndex, 3);
  assert.equal(local.dynamics.busts, 0);
});

test("a finished season loaded from a code opens NEW GAME+ on this device", async () => {
  resetDevice();
  const cloud = await loadCloudSave();
  await cloud.applyCloudSave({ code: CODE, save: makeSave({ runId: "run-unfinished" }), settledWindows: [], revision: 1 });
  assert.equal(browser.storage.getItem(config.NEW_GAME_PLUS_KEY), null, "a season still being played opens nothing");
  const finished = makeSave({ runId: "run-finished", caseResults: { final: { rank: "A", outcomeChoiceId: "f_seal" } } });
  await cloud.applyCloudSave({ code: CODE, save: finished, settledWindows: [], revision: 2 });
  assert.equal(browser.storage.getItem(config.NEW_GAME_PLUS_KEY), "true", "the intro before the runtime reads only this key");
});

test("a code that is not a code, a server that is not there, and a copy that is not a save", async () => {
  resetDevice();
  newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: { save: { anything: true } }, revision: 1 } });
  const cloud = await loadCloudSave();
  await assert.rejects(cloud.fetchCloudSave("ABCD-EFGH"), /12자리/);
  await assert.rejects(cloud.fetchCloudSave("ABCD-EFGH-IJKL"), /12자리/);
  assert.equal(await cloud.fetchCloudSave(CODE), null, "a payload that is not a save is not loaded");
  browser.respond("/rest/v1/rpc/get_cloud_save", () => ok(null));
  assert.equal(await cloud.fetchCloudSave(CODE), null);
  browser.setOnline(false);
  await assert.rejects(cloud.fetchCloudSave(CODE), /오프라인/);
});

test("the online copy can be taken back, and a server that fails to is an error", async () => {
  resetDevice({ enabled: false, sync: { pending: "", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  const server = newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  const cloud = await loadCloudSave();
  assert.deepEqual(await cloud.deleteCloudSave(), { deleted: true });
  assert.equal(server.stored, null);
  assert.deepEqual({ synced: readSync().synced, revision: readSync().revision }, { synced: "", revision: null });
  assert.deepEqual(await cloud.deleteCloudSave(), { deleted: false });
  // A database from before `delete_cloud_save` used to be answered with "it
  // ages out on its own"; it is a failure like any other now.
  browser.respond("/rest/v1/rpc/delete_cloud_save", () => missingFunction("delete_cloud_save(p_code)"));
  await assert.rejects(cloud.deleteCloudSave(), (error) => /온라인 저장에 실패했습니다/.test(cloud.describeCloudFailure(error)));
});
