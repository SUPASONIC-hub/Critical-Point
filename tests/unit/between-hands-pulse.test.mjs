import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const {
  createPulseItem, markPulseAsked, PULSE_ANSWERS, PULSE_CASES, PULSE_MIN_HANDS, PULSE_STORAGE_KEY,
  pulseSceneNo, sendPulseAnswer, shouldAskPulse,
} = await import("../../src/state/betweenHandsPulse.js");
const { authoredNodeOrders } = await import("../../src/gameCases.js");
const { validateTelemetryItem } = await import("../../src/state/payloadSchemas.js");
const { default: revealKo } = await import("../../src/copy/reveal.js");
const { default: revealEn } = await import("../../src/locales/en/screens/reveal.js");
const { default: revealJa } = await import("../../src/locales/ja/screens/reveal.js");

/**
 * N22 (2026-11-16): one question between two hands of 프롤로그 01·02, once a
 * season, three buttons and nothing to type, sent as a playtest_feedback row.
 */

const ask = (patch = {}) => ({
  caseId: "prologue01", caseClosed: false, consent: true, telemetryOn: true,
  veteran: false, replay: false, hands: PULSE_MIN_HANDS, runId: "run-a", askedRunId: "", ...patch,
});

test("asked between two hands of 프롤로그 01 or 02, from the second hand, with consent and a backend", () => {
  assert.deepEqual(PULSE_CASES, ["prologue01", "prologue02"]);
  assert.equal(shouldAskPulse(ask()), true);
  assert.equal(shouldAskPulse(ask({ caseId: "prologue02", hands: 9 })), true);
  for (const [why, patch] of [
    ["another case", { caseId: "prologue03" }],
    ["the main season", { caseId: "case01" }],
    ["the sheet that closes the case goes to the report, which has its form", { caseClosed: true }],
    ["기록 보내기 off", { consent: false }],
    ["consent unknown", { consent: undefined }],
    ["no backend in this build", { telemetryOn: false }],
    ["NEW GAME+", { veteran: true }],
    ["a prologue played again", { replay: true }],
    ["the season's first hand", { hands: PULSE_MIN_HANDS - 1 }],
    ["no run id", { runId: "" }],
    ["already asked this season", { askedRunId: "run-a" }],
  ]) {
    assert.equal(shouldAskPulse(ask(patch)), false, why);
  }
  assert.equal(shouldAskPulse(ask({ askedRunId: "run-old" })), true, "the last season's question does not hold this one");
});

test("the season is marked as asked on the device, and read back from it", () => {
  globalThis.localStorage.clear();
  const { askedRunId, ...rest } = ask();
  assert.equal(askedRunId, "");
  assert.equal(shouldAskPulse(rest), true, "nothing stored: ask");
  assert.equal(markPulseAsked("run-a"), true);
  assert.equal(globalThis.localStorage.getItem(PULSE_STORAGE_KEY), "run-a");
  assert.equal(shouldAskPulse(rest), false, "once a season");
  assert.equal(shouldAskPulse({ ...rest, runId: "run-b" }), true);
});

test("the scene number is the written scene's place, 0 for one the graph adds", () => {
  authoredNodeOrders.prologue02.forEach((nodeId, index) => assert.equal(pulseSceneNo("prologue02", nodeId), index + 1));
  assert.equal(pulseSceneNo("prologue01", "p1_ledger_reaction"), 0);
  assert.equal(pulseSceneNo("nowhere", "p1_start"), 0);
});

test("the row is the feedback form's shape with a word of three and a scene number, and passes the send check", () => {
  const now = new Date("2026-11-17T01:02:03.000Z");
  const item = createPulseItem({ sessionId: "s-1", sessionCode: "ABCD", caseId: "prologue01", caseLabel: "프롤로그 01", sceneNo: 2, answer: "hard", now });
  assert.equal(item.type, "feedback");
  assert.equal(item.label, "프롤로그 01 피드백");
  assert.match(item.payload.event_id, /\S/);
  assert.deepEqual({ ...item.payload, event_id: "x" }, {
    event_id: "x", session_id: "s-1", session_code: "ABCD", case_id: "prologue01",
    feedback: { kind: "between-hands", answer: "hard", sceneNo: 2, submittedAt: "2026-11-17T01:02:03.000Z", clarity: null, difficulty: null, comment: null },
  });
  assert.deepEqual(validateTelemetryItem(item), []);
  assert.equal(createPulseItem({ caseId: "prologue01", sceneNo: 0, answer: "fun", now }).payload.feedback.sceneNo, null);
  assert.equal(createPulseItem({ caseId: "prologue01", sceneNo: 1, answer: "free text", now }), null, "only the three words");
  assert.equal(createPulseItem({ caseId: "case01", sceneNo: 1, answer: "fun", now }), null);
  assert.equal(createPulseItem({ caseId: "prologue02", answer: "long" }).payload.feedback.answer, "long", "the clock defaults to now");
});

test("an answer is sent, or queued when the send fails, and a stray one is dropped", async () => {
  const sent = [];
  const queued = [];
  const fields = { sessionId: "s", sessionCode: "C", caseId: "prologue02", sceneNo: 3, answer: "fun" };
  assert.equal(await sendPulseAnswer(fields, { send: async (item) => sent.push(item), queueTelemetry: (item) => queued.push(item) }), "sent");
  assert.equal(await sendPulseAnswer(fields, { send: async () => { throw new Error("offline"); }, queueTelemetry: (item) => queued.push(item) }), "queued");
  assert.equal(await sendPulseAnswer({ ...fields, answer: "?" }, { send: async (item) => sent.push(item) }), "dropped");
  assert.equal(await sendPulseAnswer(fields, { send: async () => { throw new Error("offline"); } }), "queued", "no queue given: still settled");
  assert.equal(sent.length, 1);
  assert.equal(queued.length, 1);
  assert.equal(queued[0].payload.feedback.answer, "fun");
});

test("the question and its three buttons are written in Korean, English and Japanese", () => {
  for (const copy of [revealKo, revealEn, revealJa]) {
    assert.equal(typeof copy.pulse.question, "string");
    assert.ok(copy.pulse.question.length > 0 && copy.pulse.thanks.length > 0);
    assert.deepEqual(Object.keys(copy.pulse.answers), [...PULSE_ANSWERS]);
    assert.ok(Object.values(copy.pulse.answers).every((word) => word.length > 0 && word.length <= 10));
  }
  assert.deepEqual(revealKo.pulse.answers, { fun: "재밌음", hard: "어려움", long: "길다" });
});
