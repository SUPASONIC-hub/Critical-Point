import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser, missingFunction, ok, refusal } from "./helpers/browser.mjs";

/**
 * What happens to a telemetry row the server did not take (priority 61), run
 * against a scripted server. None of it had a test: the only answers the suite
 * ever gave were 201 and one 500.
 */
const browser = installBrowser();
const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
const telemetry = await import("../../src/telemetry.js");
const policy = { ...(await import("../../src/state/telemetryQueuePolicy.js")), ...(await import("../../src/state/telemetryBatch.js")) };

const caseItem = (runId, caseId, extra = {}) => ({
  id: `case-${runId}-${caseId}`,
  type: "case",
  label: `${caseId} 케이스 로그`,
  queuedAt: new Date().toISOString(),
  payload: { event_id: `event-${runId}-${caseId}`, session_id: "unit-session-1", run_id: runId, case_id: caseId, summary: {}, decision_log: [] },
  ...extra,
});
const feedbackItem = (n) => ({
  id: `feedback-${n}`,
  type: "feedback",
  label: "피드백",
  queuedAt: new Date().toISOString(),
  payload: { event_id: `feedback-event-${n}`, session_id: "unit-session-1", case_id: "case01", feedback: { clarity: 4, comment: "분명했습니다" } },
});
const errorItem = (n) => ({
  id: `error-${n}`,
  type: "error",
  label: "error",
  queuedAt: new Date().toISOString(),
  payload: { event_id: `error-event-${n}`, session_id: "unit-session-1", error_message: "x" },
});
const failure = (fields) => Object.assign(new Error("send failed"), fields);

test("the build under test has a server", () => {
  assert.equal(telemetry.telemetryEnabled, true);
});

test("a row that already landed is delivered, not failed", async () => {
  browser.respond("/rest/v1/playtest_sessions", () => refusal(409, "duplicate key value violates unique constraint", "23505"));
  const result = await policy.sendTelemetryItem(caseItem("run-a", "case01"));
  assert.deepEqual(result, { saved: true, duplicate: true });
});

test("a conflict that is not a duplicate is a refusal, not a delivery", async () => {
  browser.respond("/rest/v1/playtest_sessions", () => refusal(409, "insert or update violates foreign key constraint", "23503"));
  await assert.rejects(policy.sendTelemetryItem(caseItem("run-a", "case01")), (error) => {
    assert.equal(error.status, 409);
    assert.equal(error.code, "23503");
    assert.equal(policy.classifyTelemetryFailure(error), "permanent", "and the queue lets it go as refused");
    return true;
  });
});

test("an answer whose body never finishes is ended by the same deadline", async () => {
  const realSetTimeout = globalThis.setTimeout;
  let deadline = null;
  // The request's own timer is the only one set here: hold it, and fire it by hand.
  globalThis.setTimeout = (callback) => {
    deadline = callback;
    return 0;
  };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => ({
    ok: true,
    status: 200,
    text: () => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })))),
  });
  try {
    const pending = telemetry.fetchLeaderboard();
    await new Promise((resolve) => realSetTimeout(resolve, 0));
    assert.equal(typeof deadline, "function", "the deadline is still set while the body is read");
    deadline();
    await assert.rejects(pending, /aborted/);
  } finally {
    globalThis.setTimeout = realSetTimeout;
    globalThis.fetch = realFetch;
  }
});

test("a refusal carries its status, its code and what the server said", async () => {
  browser.respond("/rest/v1/playtest_sessions", () => refusal(429, "telemetry rate limit exceeded", "PT429"));
  await assert.rejects(policy.sendTelemetryItem(caseItem("run-a", "case02")), (error) => {
    assert.equal(error.status, 429);
    assert.equal(error.code, "PT429");
    assert.equal(error.serverMessage, "telemetry rate limit exceeded");
    return true;
  });
});

test("a row that may not leave the device is refused before it is sent", async () => {
  const before = browser.calls.length;
  const typed = caseItem("run-a", "case03");
  typed.payload.decision_log = [{ comment: "플레이어가 쓴 문장" }];
  await assert.rejects(policy.sendTelemetryItem(typed), (error) => error.invalid === true);
  assert.equal(browser.calls.length, before, "nothing reached the network");
  assert.equal(policy.classifyTelemetryFailure(failure({ invalid: true })), "permanent");
});

test("a refusal is permanent, later, pace or unreachable", () => {
  const classify = policy.classifyTelemetryFailure;
  // The database from 20260929010000 on.
  assert.equal(classify(failure({ status: 429, serverMessage: "telemetry rate limit exceeded" })), "pace");
  assert.equal(classify(failure({ status: 425, serverMessage: "season ranking requires every case of the run" })), "later");
  assert.equal(classify(failure({ status: 408 })), "later");
  // Today's database raises the same refusals as plain exceptions: 400.
  assert.equal(classify(failure({ status: 400, serverMessage: "telemetry rate limit exceeded" })), "pace");
  assert.equal(classify(failure({ status: 400, serverMessage: "season ranking requires every case of the run" })), "later");
  assert.equal(classify(failure({ status: 400, serverMessage: "season ranking run is implausibly short" })), "later");
  assert.equal(classify(failure({ status: 400, serverMessage: "season ranking limit reached" })), "pace");
  // The row itself is what the server will not take.
  assert.equal(classify(failure({ status: 400, serverMessage: "telemetry payload too large" })), "permanent");
  assert.equal(classify(failure({ status: 400, serverMessage: "invalid playtest session payload" })), "permanent");
  assert.equal(classify(failure({ status: 400, serverMessage: "season ranking run was not played where the server could watch it" })), "permanent");
  assert.equal(classify(failure({ status: 401 })), "permanent");
  assert.equal(classify(failure({ status: 403 })), "permanent");
  assert.equal(classify(failure({ status: 404 })), "permanent");
  // No answer, or a server that is failing.
  assert.equal(classify(new Error("Network unavailable")), "unreachable");
  assert.equal(classify(failure({ name: "AbortError" })), "unreachable");
  assert.equal(classify(failure({ status: 500 })), "unreachable");
  assert.equal(classify(failure({ status: 503 })), "unreachable");
  assert.equal(policy.isPermanentRefusal(failure({ status: 400, serverMessage: "telemetry rate limit exceeded" })), false);
});

test("the batch stops at the first send nobody answered", async () => {
  const items = ["case01", "case02", "case03", "case04", "case05"].map((caseId) => caseItem("run-b", caseId));
  const sent = [];
  const { kept, aborted } = await policy.sendTelemetryBatch(items, {
    send: async (item) => {
      sent.push(item.id);
      throw new Error("Network unavailable");
    },
  });
  assert.equal(aborted, false);
  assert.deepEqual(sent, [items[0].id], "one attempt, not five timeouts in a row");
  assert.deepEqual(kept.map((item) => item.id), items.map((item) => item.id), "every row is kept, in the order it was queued");
});

test("the batch stops when the server says it is being sent too much", async () => {
  const items = [caseItem("run-b", "case01"), caseItem("run-b", "case02"), feedbackItem(1)];
  const sent = [];
  const { kept } = await policy.sendTelemetryBatch(items, {
    send: async (item) => {
      sent.push(item.id);
      if (sent.length === 2) throw failure({ status: 429, serverMessage: "telemetry rate limit exceeded" });
    },
  });
  assert.equal(sent.length, 2);
  assert.deepEqual(kept.map((item) => item.id), [items[1].id, items[2].id]);
});

test("a row the server will never take is dropped, and the rest go on", async () => {
  const items = [caseItem("run-c", "case01"), caseItem("run-c", "case02"), caseItem("run-c", "case03")];
  const sent = [];
  const { kept } = await policy.sendTelemetryBatch(items, {
    send: async (item) => {
      sent.push(item.id);
      if (item === items[1]) throw failure({ status: 400, serverMessage: "telemetry payload too large" });
    },
  });
  assert.equal(sent.length, 3);
  assert.deepEqual(kept, []);
});

test("a ranking row goes after its run's case rows, and waits while one of them is waiting", async () => {
  const season = caseItem("run-d", "season-final");
  const final = caseItem("run-d", "final");
  const other = caseItem("run-e", "case01");
  // Queued ranking row first, which is how a failed first send leaves it.
  const sent = [];
  const delivered = await policy.sendTelemetryBatch([season, final, other], { send: async (item) => void sent.push(item.id) });
  assert.deepEqual(sent, [final.id, other.id, season.id]);
  assert.deepEqual(delivered.kept, []);

  // The run's last case row fails for a moment: the ranking row is not sent,
  // and it is not dropped. It used to be sent, refused with a 400, and deleted.
  const attempted = [];
  const held = await policy.sendTelemetryBatch([season, final, other], {
    send: async (item) => {
      attempted.push(item.id);
      if (item === final) throw failure({ status: 425, serverMessage: "try again" });
    },
  });
  assert.deepEqual(attempted, [final.id, other.id]);
  assert.deepEqual(held.kept.map((item) => item.id), [season.id, final.id]);

  // A ranking row ahead of its time is kept and the batch goes on.
  const early = await policy.sendTelemetryBatch([season, other], {
    send: async (item) => {
      if (item === season) throw failure({ status: 400, serverMessage: "season ranking run is implausibly short" });
    },
  });
  assert.deepEqual(early.kept.map((item) => item.id), [season.id]);
  // Another run's waiting case row does not hold this run's ranking row.
  assert.equal(policy.isHeldBehindCaseRow(season, [other]), false);
  assert.equal(policy.isHeldBehindCaseRow(season, [final]), true);
});

test("consent unticked while a send is in flight stops the batch and leaves the queue alone", async () => {
  const items = [caseItem("run-f", "case01"), caseItem("run-f", "case02"), caseItem("run-f", "case03")];
  let consent = true;
  const sent = [];
  const { kept, aborted } = await policy.sendTelemetryBatch(items, {
    canSend: () => consent,
    send: async (item) => {
      sent.push(item.id);
      consent = false;
    },
  });
  assert.equal(aborted, true);
  assert.deepEqual(sent, [items[0].id], "nothing was sent after consent was withdrawn");
  assert.equal(kept.length, items.length);
});

test("consent unticked during a send that fails is still an aborted batch", async () => {
  const items = [caseItem("run-g", "case01"), caseItem("run-g", "case02")];
  let consent = true;
  const { aborted } = await policy.sendTelemetryBatch(items, {
    canSend: () => consent,
    send: async () => {
      consent = false;
      throw new Error("Network unavailable");
    },
  });
  assert.equal(aborted, true, "the stopped pass asked nobody on the rows after the failure");
});

test("a queue cleared while its batch was out is not written back", () => {
  const [first, second, third] = [caseItem("run-h", "case01"), caseItem("run-h", "case02"), caseItem("run-h", "case03")];
  const late = feedbackItem(7);
  // An ordinary pass: the first row landed, the second waits, one was queued meanwhile.
  assert.deepEqual(
    policy.reconcileTelemetryQueue([first, second, late], [first, second], [second]).map((item) => item.id),
    [second.id, late.id],
  );
  // The player cleared the queue (consent off, or a reset) while the batch was out.
  assert.deepEqual(policy.reconcileTelemetryQueue([], [first, second, third], [first, second, third]), []);
  // A reset that then queued a row of the new run keeps that row only.
  assert.deepEqual(policy.reconcileTelemetryQueue([late], [first, second], [first, second]), [late]);
});

test("the batch says how many rows the server refused for good", async () => {
  const items = [caseItem("run-i", "case01"), caseItem("run-i", "case02")];
  const { kept, refused } = await policy.sendTelemetryBatch(items, {
    send: async (item) => {
      if (item === items[0]) throw failure({ status: 400, serverMessage: "telemetry payload too large" });
    },
  });
  assert.deepEqual(kept, []);
  assert.equal(refused, 1);
});

test("the queue holds a season played with no server in reach", () => {
  const seasonRows = [...CASE_SEQUENCE.map((caseId) => caseItem("run-g", caseId)), caseItem("run-g", "season-final")];
  assert.ok(policy.TELEMETRY_QUEUE_MAX_ITEMS > seasonRows.length, `cap ${policy.TELEMETRY_QUEUE_MAX_ITEMS} against ${seasonRows.length} rows`);
  const feedback = CASE_SEQUENCE.map((_, index) => feedbackItem(index));
  const kept = policy.pruneTelemetryQueue([...seasonRows, ...feedback]);
  assert.deepEqual(
    kept.filter((item) => item.type === "case").map((item) => item.id),
    seasonRows.map((item) => item.id),
    "no case row of the run fell off the front",
  );
});

test("over its cap the queue gives up error reports first and case rows last", () => {
  const cap = policy.TELEMETRY_QUEUE_MAX_ITEMS;
  const cases = Array.from({ length: cap }, (_, index) => caseItem("run-h", `case${String(index).padStart(2, "0")}`));
  const kept = policy.pruneTelemetryQueue([errorItem(1), feedbackItem(1), ...cases, errorItem(2)]);
  assert.equal(kept.length, cap);
  assert.ok(kept.every((item) => item.type === "case"));
  const overfull = policy.pruneTelemetryQueue([...cases, caseItem("run-h", "final")]);
  assert.equal(overfull.length, cap);
  assert.equal(overfull.at(-1).payload.case_id, "final", "with nothing else to give up, the oldest row goes");
  const expired = { ...caseItem("run-h", "old"), queuedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() };
  assert.deepEqual(policy.pruneTelemetryQueue([expired]), []);
});

test("a missing function is told apart from a function that refused", async () => {
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => missingFunction("peek_cloud_save(p_code)"));
  await assert.rejects(telemetry.callSupabaseRpc("peek_cloud_save", { p_code: "x" }), (error) => telemetry.isMissingRpc(error));
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => refusal(400, "invalid cloud save code"));
  await assert.rejects(telemetry.callSupabaseRpc("peek_cloud_save", { p_code: "x" }), (error) => !telemetry.isMissingRpc(error));
  browser.respond("/rest/v1/rpc/peek_cloud_save", () => ok({ saved_at: "2026-09-28T00:00:00Z", revision: 3 }));
  assert.deepEqual((await telemetry.callSupabaseRpc("peek_cloud_save", { p_code: "x" })).data, { saved_at: "2026-09-28T00:00:00Z", revision: 3 });
});

test("a device that cannot store an id still has one id, and the board has its own", () => {
  browser.storage.unavailable = true;
  try {
    const first = telemetry.getSessionId();
    assert.equal(telemetry.getSessionId(), first, "each call used to mint a new session id");
    const board = telemetry.getBoardWriterId();
    assert.equal(telemetry.getBoardWriterId(), board);
    assert.notEqual(board, first);
  } finally {
    browser.storage.unavailable = false;
  }
  const stored = telemetry.getSessionId();
  assert.equal(telemetry.getSessionId(), stored);
  assert.equal(browser.storage.getItem("critical-point-session-id"), stored);
  assert.notEqual(telemetry.getBoardWriterId(), stored, "a board post must not carry the telemetry session id");
});
