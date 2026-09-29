import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser, missingFunction, ok, refusal } from "./helpers/browser.mjs";

/**
 * Two devices and one continuation code (priority 59), against a scripted
 * server -- once as the database answers from 20260929030000 on, once as it
 * answers today, because the client is deployed before the migration is.
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

/** The database as it is before that migration: three arguments, ordered by time. */
function oldServer({ stored = null } = {}) {
  const server = { stored };
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => missingFunction("peek_cloud_save(p_code)"));
  browser.respond("/rest/v1/rpc/delete_cloud_save", () => missingFunction("delete_cloud_save(p_code)"));
  browser.respond("/rest/v1/rpc/put_cloud_save", ({ body }) => {
    if ("p_expected_revision" in body) return missingFunction("put_cloud_save(p_code, p_expected_revision, p_payload, p_saved_at)");
    if (server.stored && Date.parse(server.stored.saved_at) > Date.parse(body.p_saved_at)) {
      return ok({ accepted: false, saved_at: server.stored.saved_at });
    }
    server.stored = { saved_at: body.p_saved_at, payload: body.p_payload };
    return ok({ accepted: true, saved_at: body.p_saved_at });
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

test("against today's database the upload is sent the way that database takes it", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T10:00:00.000Z" }), sync: { pending: "2026-09-28T10:00:00.000Z", synced: "", revision: null } });
  const server = oldServer();
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts().length, 1);
  assert.equal("p_expected_revision" in puts()[0].body, false);
  assert.equal(server.stored.saved_at, "2026-09-28T10:00:00.000Z");
  assert.equal(cloud.getCloudSaveSnapshot().phase, "synced");
  assert.equal(readSync().revision, null);
});

test("a revision on record and a database that does not take one: the old call is made", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T10:00:00.000Z" }), sync: { pending: "2026-09-28T10:00:00.000Z", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  const server = oldServer();
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), true);
  assert.equal(puts().length, 2, "the new call, then the one the database knows");
  assert.equal(puts()[0].body.p_expected_revision, 2);
  assert.equal("p_expected_revision" in puts()[1].body, false);
  assert.equal(server.stored.saved_at, "2026-09-28T10:00:00.000Z");
});

test("today's database refusing an older save is a conflict too, and it stays one", async () => {
  resetDevice({ save: makeSave({ savedAt: "2026-09-28T08:00:00.000Z" }), sync: { pending: "2026-09-28T08:00:00.000Z", synced: "", revision: null } });
  oldServer({ stored: { saved_at: "2026-09-28T11:00:00.000Z", payload: {} } });
  const cloud = await loadCloudSave();
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(cloud.getCloudSaveSnapshot().phase, "conflict");
  browser.storage.setItem(config.STORAGE_KEY, JSON.stringify(makeSave({ savedAt: "2026-09-28T12:00:00.000Z" })));
  assert.equal(await cloud.flushCloudSave(), false);
  assert.equal(puts().length, 1, "the later local write did not slip past the conflict");
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

test("the online copy can be taken back, where the database allows it", async () => {
  resetDevice({ enabled: false, sync: { pending: "", synced: "2026-09-28T09:00:00.000Z", revision: 2 } });
  const server = newServer({ stored: { saved_at: "2026-09-28T09:00:00.000Z", payload: {}, revision: 2 } });
  const cloud = await loadCloudSave();
  assert.deepEqual(await cloud.deleteCloudSave(), { deleted: true });
  assert.equal(server.stored, null);
  assert.deepEqual({ synced: readSync().synced, revision: readSync().revision }, { synced: "", revision: null });
  assert.deepEqual(await cloud.deleteCloudSave(), { deleted: false });
  oldServer();
  assert.deepEqual(await cloud.deleteCloudSave(), { deleted: false, unsupported: true });
});
