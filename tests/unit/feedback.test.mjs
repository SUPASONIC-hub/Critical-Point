import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser, ok, refusal } from "./helpers/browser.mjs";

/**
 * The feedback form under a case's result (state/useFeedback.js): what typing,
 * rating, anonymizing and sending each write, and to where. The module was
 * loaded for `readFeedbackStatus` alone; the rest ran only in a browser.
 */
const browser = installBrowser();
const { FEEDBACK_COMMENT_MAX_LENGTH } = await import("../../src/appConfig.js");
const { validateTelemetryItem } = await import("../../src/state/payloadSchemas.js");
const { createFeedbackActions, useFeedbackStatus } = await import("../../src/state/useFeedback.js");

/** The form for one case, and a record of what it did. */
function form(overrides = {}) {
  const did = { feedback: [], persisted: [], status: [], submitting: [], queued: [] };
  const actions = createFeedbackActions({
    currentCase: "case01",
    currentFeedback: { clarity: "", difficulty: "", comment: "" },
    playtestFeedback: { prologue01: { clarity: "5", difficulty: "2", comment: "먼저 쓴 글" } },
    setPlaytestFeedback: (value) => did.feedback.push(value),
    persist: (patch) => did.persisted.push(patch),
    activeFeedbackPrivacySignals: [],
    isSubmittingFeedback: false,
    setIsSubmittingFeedback: (value) => did.submitting.push(value),
    setFeedbackStatus: (text) => did.status.push(text),
    dataConsent: true,
    sessionId: "unit-session-1",
    sessionCode: "UNIT01",
    activeCaseMeta: { label: "CASE 01", title: "첫 사건" },
    queueTelemetry: (item) => did.queued.push(item),
    ...overrides,
  });
  return { ...actions, did };
}

test("a rating is one click and is saved at once, with the other cases' answers kept", () => {
  const { updateCurrentFeedback, did } = form();
  updateCurrentFeedback({ clarity: "4" });
  const expected = {
    prologue01: { clarity: "5", difficulty: "2", comment: "먼저 쓴 글" },
    case01: { clarity: "4", difficulty: "", comment: "" },
  };
  assert.deepEqual(did.feedback, [expected]);
  assert.deepEqual(did.persisted, [{ playtestFeedback: expected }]);
  assert.deepEqual(did.status, [""], "an edit clears what was said about the last send");
});

test("typing is state at once and reaches the save once it pauses, through the newest render's persist", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const first = form();
  first.updateCurrentFeedback({ comment: "가" });
  first.updateCurrentFeedback({ comment: "가나" });
  assert.equal(first.did.feedback.length, 2);
  assert.equal(first.did.feedback[1].case01.comment, "가나");
  assert.deepEqual(first.did.persisted, [], "no save per keystroke");

  // The next render arrives while the write is still waiting: the write is that render's.
  const second = form({ currentFeedback: { clarity: "", difficulty: "", comment: "가나" } });
  t.mock.timers.tick(799);
  assert.deepEqual([first.did.persisted.length, second.did.persisted.length], [0, 0]);
  t.mock.timers.tick(1);
  assert.deepEqual(first.did.persisted, [], "an older persist would write that render's run back over what happened since");
  assert.deepEqual(second.did.persisted, [{}], "the save carries the comment the run already holds");

  // A rating before the pause is over writes now, and the waiting write is dropped.
  const third = form();
  third.updateCurrentFeedback({ comment: "다" });
  third.updateCurrentFeedback({ difficulty: "3" });
  assert.equal(third.did.persisted.length, 1);
  t.mock.timers.tick(5_000);
  assert.equal(third.did.persisted.length, 1);
});

test("a comment is held to the length the server takes", () => {
  const { updateCurrentFeedback, did } = form();
  updateCurrentFeedback({ comment: "가".repeat(FEEDBACK_COMMENT_MAX_LENGTH + 50), clarity: "3" });
  assert.equal(did.feedback[0].case01.comment.length, FEEDBACK_COMMENT_MAX_LENGTH);
});

test("익명화 rewrites what looks like a person's details and leaves the rest", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { anonymizeFeedbackComment, did } = form({ currentFeedback: { clarity: "4", difficulty: "", comment: "문의는 tester@example.com 으로 주세요" } });
  anonymizeFeedbackComment();
  const { comment } = did.feedback[0].case01;
  assert.doesNotMatch(comment, /tester@example\.com/);
  assert.match(comment, /문의는 .* 으로 주세요/);
  assert.equal(did.feedback[0].case01.clarity, "4");
});

test("a comment that still reads as identifying is not sent", async () => {
  const { submitCurrentFeedback, did } = form({ activeFeedbackPrivacySignals: ["email"] });
  await submitCurrentFeedback();
  assert.deepEqual(did.status, ["식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요."]);
  assert.deepEqual([did.persisted.length, did.submitting.length, did.queued.length], [0, 0, 0]);
});

test("a send already under way is not started again", async () => {
  const { submitCurrentFeedback, did } = form({ isSubmittingFeedback: true });
  await submitCurrentFeedback();
  assert.deepEqual([did.persisted.length, did.status.length, did.submitting.length], [0, 0, 0]);
});

test("sending writes this device first, then the row the table takes", async () => {
  browser.calls.length = 0;
  browser.respond("/rest/v1/playtest_feedback", () => ok(undefined, 201));
  const { submitCurrentFeedback, did } = form({ currentFeedback: { clarity: "4", difficulty: "x", comment: "  분명했습니다  " } });
  await submitCurrentFeedback();

  const saved = did.persisted[0].playtestFeedback.case01;
  assert.ok(Number.isFinite(Date.parse(saved.savedAt)));
  assert.deepEqual(did.feedback, [did.persisted[0].playtestFeedback]);
  assert.deepEqual(did.submitting, [true, false]);
  assert.deepEqual(did.status, ["피드백을 저장했습니다."]);
  assert.deepEqual(did.queued, []);

  const [call] = browser.callsTo("/rest/v1/playtest_feedback");
  assert.ok(call, "the row went to playtest_feedback");
  assert.deepEqual(
    [call.body.session_id, call.body.session_code, call.body.case_id],
    ["unit-session-1", "UNIT01", "case01"],
  );
  assert.equal(typeof call.body.event_id, "string");
  assert.deepEqual(call.body.feedback, { caseTitle: "첫 사건", submittedAt: saved.savedAt, clarity: 4, difficulty: null, comment: "분명했습니다" });
});

test("a send the network dropped is queued under the same event id, and the comment is not lost", async (t) => {
  t.mock.method(console, "warn", () => {});
  browser.calls.length = 0;
  browser.respond("/rest/v1/playtest_feedback", () => refusal(503, "upstream unavailable", "PGRST000"));
  const { submitCurrentFeedback, did } = form({ currentFeedback: { clarity: "", difficulty: "", comment: "" }, activeCaseMeta: undefined });
  await submitCurrentFeedback();

  assert.equal(did.persisted.length, 1, "this device has it either way");
  assert.deepEqual(did.status, ["로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다."]);
  assert.deepEqual(did.submitting, [true, false]);
  const [item] = did.queued;
  assert.deepEqual(validateTelemetryItem(item), []);
  assert.deepEqual([item.type, item.label, item.payload.feedback.caseTitle], ["feedback", "case01 피드백", "case01"]);
  assert.match(item.id, /^feedback-case01-\d+$/);
  assert.equal(item.payload.event_id, browser.callsTo("/rest/v1/playtest_feedback")[0].body.event_id, "a retry names the row the first attempt named");
  assert.deepEqual(item.payload.feedback.comment, null, "an empty comment is no comment");
});

test("without consent the answers stay on this device, and the form says which", async () => {
  browser.calls.length = 0;
  const { submitCurrentFeedback, did } = form({ dataConsent: false });
  await submitCurrentFeedback();
  assert.equal(did.persisted.length, 1);
  assert.deepEqual(did.status, ["로컬에 저장했습니다. 데이터 제공 동의가 없어 원격 저장은 건너뛰었습니다."]);
  assert.deepEqual(did.submitting, [true, false]);
  assert.equal(browser.calls.length, 0);
  assert.deepEqual(did.queued, []);
});

test("the status line starts empty for whichever case the form is under", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  let seen = null;
  const Probe = () => {
    seen = useFeedbackStatus("case01");
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  assert.deepEqual([seen.feedbackStatus, seen.isSubmittingFeedback], ["", false]);
  assert.equal(typeof seen.setFeedbackStatus, "function");
  assert.doesNotThrow(() => seen.setFeedbackStatus("피드백을 저장했습니다."));
});
