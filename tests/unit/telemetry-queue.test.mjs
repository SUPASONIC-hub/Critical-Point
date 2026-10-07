import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser, ok, refusal } from "./helpers/browser.mjs";

/**
 * The outbound queue as the runtime holds it (state/useTelemetryQueue.js): a
 * row is buffered into the save, a pass over the queue rewrites it from what
 * the server said, and the retry clock backs off. `telemetry-delivery.test.mjs`
 * runs the pass itself; the hook around it -- the part that writes the save and
 * tells the player -- was loaded for one exported helper and never run.
 *
 * The hook is rendered once on the server renderer, which runs its body and
 * hands back its functions. Effects do not run there, so consent and
 * connectivity are what the render was given.
 */
const browser = installBrowser();
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { adoptSaveRevision, makeEmptyScores, SAVE_SCHEMA_VERSION, STORAGE_KEY, writeSaveState } = await import("../../src/appConfig.js");
const { cognitionLabels, initialResources, triggerLabels } = await import("../../src/gameConstants.js");
const { telemetryEnabled } = await import("../../src/telemetry.js");
const { useTelemetryQueue } = await import("../../src/state/useTelemetryQueue.js");

// The retry clock is the window's. Held here, and fired by hand.
const timers = [];
globalThis.window = {
  setTimeout: (callback, delayMs) => {
    timers.push({ callback, delayMs });
    return timers.length;
  },
  clearTimeout: () => {},
};

function runSave(overrides = {}) {
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId: "run-1",
    playerName: "분석관",
    dataConsent: true,
    started: true,
    paused: false,
    currentCase: "case03",
    nodeId: "c3_start",
    completedCases: ["case01", "case02"],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    resources: { ...initialResources },
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    log: [],
    pendingTelemetry: [],
    savedAt: "2026-09-28T00:00:00.000Z",
    ...overrides,
  };
}

const caseItem = (caseId, extra = {}) => ({
  id: `case-run-1-${caseId}`,
  type: "case",
  label: `${caseId} 케이스 로그`,
  payload: { event_id: `event-run-1-${caseId}`, session_id: "unit-session-1", run_id: "run-1", case_id: caseId, summary: {}, decision_log: [] },
  ...extra,
});

const savedQueue = () => JSON.parse(browser.storage.getItem(STORAGE_KEY)).pendingTelemetry;

/** One render of the hook over a save in storage, and a record of what it told the runtime. */
function mount({ queue = [], save = runSave(), ...props } = {}) {
  timers.length = 0;
  browser.storage.clear();
  if (save) {
    writeSaveState({ ...save, pendingTelemetry: queue }, { force: true });
    adoptSaveRevision();
  }
  const said = { pending: [], telemetryStatus: [], retrying: [], retryInfo: [], saveStatus: [], savedAt: [] };
  const refs = { pendingTelemetryRef: { current: queue }, telemetryRetryTimerRef: { current: null }, telemetryRetryAttemptRef: { current: 0 } };
  let api = null;
  const Probe = () => {
    api = useTelemetryQueue({
      ...refs,
      setPendingTelemetry: (value) => said.pending.push(value),
      setTelemetryStatus: (value) => said.telemetryStatus.push(value),
      setIsRetryingTelemetry: (value) => said.retrying.push(value),
      setTelemetryRetryInfo: (value) => said.retryInfo.push(value),
      setSaveStatus: (value) => said.saveStatus.push(value),
      setLastSavedAt: (value) => said.savedAt.push(value),
      isOnline: true,
      dataConsent: true,
      telemetryEnabled,
      isRetryingTelemetry: false,
      ...props,
    });
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  return { ...api, said, refs };
}

test("a queued row is in the save before anything is sent", () => {
  const { queueTelemetry, said, refs } = mount();
  assert.equal(queueTelemetry(caseItem("case01")), true);

  assert.equal(refs.pendingTelemetryRef.current.length, 1);
  const [queued] = savedQueue();
  assert.equal(queued.id, "case-run-1-case01");
  assert.equal(queued.payload.event_id, "event-run-1-case01", "a row that named its event keeps the name");
  assert.ok(Number.isFinite(Date.parse(queued.queuedAt)), "and is stamped with when it was queued");
  assert.deepEqual(said.pending.at(-1), refs.pendingTelemetryRef.current);
  assert.equal(said.savedAt.length, 1, "the save's time moves with it");
  assert.deepEqual(said.saveStatus, []);
  assert.equal(browser.calls.length, 0);
});

test("a row queued twice is one row, and a row with no event id is given one to retry under", () => {
  const { queueTelemetry } = mount();
  const { event_id: _dropped, ...payload } = caseItem("case01").payload;
  queueTelemetry(caseItem("case01", { payload }));
  const minted = savedQueue()[0].payload.event_id;
  assert.equal(typeof minted, "string");
  assert.ok(minted.length > 0);

  queueTelemetry(caseItem("case01"));
  queueTelemetry(caseItem("case02"));
  assert.deepEqual(savedQueue().map((item) => item.id), ["case-run-1-case01", "case-run-1-case02"]);
  assert.equal(savedQueue()[0].payload.event_id, "event-run-1-case01", "the later copy replaced the earlier");
});

test("a row the server could never take is not queued", (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const { queueTelemetry, said, refs } = mount();
  // A case row may not carry the name the player typed (payloadSchemas.validateTelemetryItem).
  assert.equal(queueTelemetry(caseItem("case01", { payload: { ...caseItem("case01").payload, playerName: "분석관 김" } })), false);
  assert.equal(warn.mock.callCount(), 1);
  assert.deepEqual(refs.pendingTelemetryRef.current, []);
  assert.deepEqual(said.pending, []);
  assert.deepEqual(savedQueue(), []);
});

test("with no save to write into, the row is held in memory and the player is told", () => {
  const { queueTelemetry, said, refs } = mount({ save: null });
  assert.equal(queueTelemetry(caseItem("case01")), false);
  assert.equal(refs.pendingTelemetryRef.current.length, 1, "it rides along with this tab's next save");
  assert.deepEqual(said.saveStatus, ["원격 저장 대기열을 저장하지 못했습니다. 브라우저 저장본을 확인해 주세요."]);
  assert.deepEqual(said.savedAt, []);
});

test("storage that refuses the write is said; a save another tab moved past is not", () => {
  const full = mount();
  const realSetItem = browser.storage.setItem;
  browser.storage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  try {
    assert.equal(full.queueTelemetry(caseItem("case01")), false);
  } finally {
    browser.storage.setItem = realSetItem;
  }
  assert.deepEqual(full.said.saveStatus, ["브라우저 저장소를 사용할 수 없어 원격 저장 대기열 변경을 반영하지 못했습니다."]);

  // Another tab writes, a revision ahead of what this tab knows: the stale notice is the save's to give.
  const behind = mount();
  const theirs = JSON.parse(browser.storage.getItem(STORAGE_KEY));
  browser.storage.setItem(STORAGE_KEY, JSON.stringify({ ...theirs, nodeId: "c3_other", saveRevision: (theirs.saveRevision ?? 0) + 1 }));
  assert.equal(behind.queueTelemetry(caseItem("case01")), false);
  assert.deepEqual(behind.said.saveStatus, []);
  assert.equal(JSON.parse(browser.storage.getItem(STORAGE_KEY)).nodeId, "c3_other", "the other tab's save is not written over");
  assert.equal(behind.refs.pendingTelemetryRef.current.length, 1);
});

test("a pass that the server takes empties the queue, the save and the retry clock", async () => {
  browser.calls.length = 0;
  browser.respond("/rest/v1/playtest_sessions", () => ok(undefined, 201));
  const queue = [caseItem("case01", { queuedAt: new Date().toISOString() }), caseItem("case02", { queuedAt: new Date().toISOString() })];
  const { retryPendingTelemetry, said, refs } = mount({ queue });
  refs.telemetryRetryAttemptRef.current = 4;

  const result = await retryPendingTelemetry();

  assert.deepEqual(result, { attempted: true, failedCount: 0, queueCommitted: true });
  assert.equal(browser.callsTo("/rest/v1/playtest_sessions").length, 2);
  assert.deepEqual(refs.pendingTelemetryRef.current, []);
  assert.deepEqual(savedQueue(), []);
  assert.deepEqual(said.retrying, [true, false]);
  assert.deepEqual(said.telemetryStatus, [
    { tone: "pending", text: "원격 저장 2건을 전송하는 중입니다." },
    { tone: "success", text: "원격 저장을 모두 완료했습니다." },
  ]);
  assert.equal(refs.telemetryRetryAttemptRef.current, 0);
  assert.deepEqual(said.retryInfo, [{ attempt: 0, nextRetryAt: "" }]);
});

test("a row the server could not take this time waits, and the player is told how many", async (t) => {
  t.mock.method(console, "warn", () => {});
  browser.calls.length = 0;
  browser.respond("/rest/v1/playtest_sessions", () => refusal(503, "upstream unavailable", "PGRST000"));
  const { retryPendingTelemetry, said, refs } = mount({ queue: [caseItem("case01", { queuedAt: new Date().toISOString() })] });
  refs.telemetryRetryAttemptRef.current = 2;

  const result = await retryPendingTelemetry();

  assert.deepEqual(result, { attempted: true, failedCount: 1, queueCommitted: true });
  assert.equal(savedQueue().length, 1, "the row is still in the save");
  assert.deepEqual(said.telemetryStatus.at(-1), { tone: "error", text: "원격 저장 1건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요." });
  assert.equal(refs.telemetryRetryAttemptRef.current, 2, "and the backoff is not reset");
  assert.deepEqual(said.retryInfo, []);
});

test("nothing is sent without consent, without a connection, with an empty queue, or while a pass is running", async () => {
  browser.calls.length = 0;
  const queue = [caseItem("case01", { queuedAt: new Date().toISOString() })];
  for (const props of [{ dataConsent: false }, { isOnline: false }, { telemetryEnabled: false }, { isRetryingTelemetry: true }]) {
    const { retryPendingTelemetry, scheduleTelemetryRetry, said } = mount({ queue, ...props });
    assert.deepEqual(await retryPendingTelemetry(), { attempted: false, failedCount: 1 }, JSON.stringify(props));
    assert.deepEqual(said.telemetryStatus, []);
    if (!props.isRetryingTelemetry) {
      scheduleTelemetryRetry();
      assert.equal(timers.length, 0, `no retry is put on the clock: ${JSON.stringify(props)}`);
    }
  }
  const empty = mount();
  assert.deepEqual(await empty.retryPendingTelemetry(), { attempted: false, failedCount: 0 });
  empty.scheduleTelemetryRetry({ immediate: true });
  assert.equal(timers.length, 0);
  assert.equal(browser.calls.length, 0);
});

test("the retry clock starts at once when asked to, then doubles from two seconds up to five minutes", async (t) => {
  t.mock.method(console, "warn", () => {});
  browser.calls.length = 0;
  browser.respond("/rest/v1/playtest_sessions", () => refusal(503, "upstream unavailable", "PGRST000"));
  const { scheduleTelemetryRetry, said, refs } = mount({ queue: [caseItem("case01", { queuedAt: new Date().toISOString() })] });

  scheduleTelemetryRetry({ immediate: true });
  assert.deepEqual(timers.map((timer) => timer.delayMs), [0]);
  assert.equal(said.retryInfo.at(-1).attempt, 0);
  assert.ok(refs.telemetryRetryTimerRef.current, "the timer is the runtime's to cancel");

  // One timer at a time: a second ask while one is on the clock sets nothing.
  scheduleTelemetryRetry();
  assert.equal(timers.length, 1);

  // The timer fires: the handle is let go and the pass runs.
  await timers[0].callback();
  assert.equal(refs.telemetryRetryTimerRef.current, null);
  assert.equal(browser.callsTo("/rest/v1/playtest_sessions").length, 1);

  const delays = [];
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    refs.telemetryRetryTimerRef.current = null;
    scheduleTelemetryRetry();
    delays.push(timers.at(-1).delayMs);
    assert.equal(refs.telemetryRetryAttemptRef.current, attempt);
    assert.equal(said.retryInfo.at(-1).attempt, attempt);
    assert.ok(Number.isFinite(Date.parse(said.retryInfo.at(-1).nextRetryAt)));
  }
  assert.deepEqual(delays, [2_000, 4_000, 8_000, 16_000, 32_000, 64_000, 128_000, 256_000, 300_000, 300_000]);
});
