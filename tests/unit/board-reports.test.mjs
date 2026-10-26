import assert from "node:assert/strict";
import { test } from "node:test";

const { QUERY, ACTIONS, DEADLINE_HOURS, REASON_NAMES, actionStatement, actionDone, readQueue, describeQueue } = await import("../../scripts/board-reports.mjs");
const { BOARD_REPORT_REASONS } = await import("../../src/boardReport.js");

const HOUR = 3600;

test("the daily read is one SELECT that takes nothing a player typed out of the database", () => {
  assert.match(QUERY, /^select /);
  assert.equal(QUERY.trim().split(";").filter((part) => part.trim()).length, 1, "one statement");
  assert.doesNotMatch(QUERY, /\b(insert|update|delete|drop|alter|grant)\b/i);
  for (const column of ["body", "nickname", "session_id", "event_id"]) {
    assert.doesNotMatch(QUERY, new RegExp(`\\b${column}\\b`), `${column} is not read`);
  }
  assert.equal(QUERY.match(/\bactor_key\b/g).length, 1, "the writer key is only counted");
  assert.match(QUERY, /count\(distinct r\.actor_key\)/);
});

test("every reason the button offers has its name in the summary", () => {
  assert.deepEqual(Object.keys(REASON_NAMES).sort(), BOARD_REPORT_REASONS.map((reason) => reason.id).sort());
});

test("a hand action names one function or one delete, and only for a plain post id", () => {
  assert.equal(actionStatement("hide", "42"), "select public.moderate_board_post(42) as done;");
  assert.equal(actionStatement("restore", 42), "select public.moderate_board_post(42, false) as done;");
  assert.match(actionStatement("dismiss", " 42 "), /delete from public\.board_reports where post_id = 42 returning 1/);
  for (const bad of ["", "0", "-1", "1.5", "1; drop table public.board_posts", "42 or true", "1e3", null, undefined, "1234567890123456789"]) {
    assert.throws(() => actionStatement("hide", bad), /not a post id/, String(bad));
  }
  assert.throws(() => actionStatement("delete", "42"), /not one of/);
  assert.deepEqual(ACTIONS, ["hide", "restore", "dismiss"]);
});

test("whether an action did anything is read from the shapes the CLI returns", () => {
  assert.equal(actionDone([{ done: true }]), true);
  assert.equal(actionDone([{ done: "t" }]), true);
  assert.equal(actionDone([{ done: 3 }]), true);
  assert.equal(actionDone([{ done: null }]), false, "moderate_board_post returns null for a post that is not there");
  assert.equal(actionDone([{ done: 0 }]), false);
  assert.equal(actionDone([]), false);
});

test("posts that wait, posts past the promise, and hidden posts are told apart, and the summary carries ids only", () => {
  const rows = [
    { post_id: 7, hidden: false, posted_on: "2026-10-25", reports: 3, writers: 2, reasons: ["abuse", "spam"], oldest_seconds: 30 * HOUR },
    { post_id: "9", hidden: "f", posted_on: "2026-10-26", reports: "1", writers: "1", reasons: "{privacy}", oldest_seconds: "3600" },
    { post_id: 4, hidden: "t", posted_on: "2026-10-20", reports: 5, writers: 5, reasons: '["other"]', oldest_seconds: 99 * HOUR },
  ];
  const queue = readQueue(rows);
  assert.deepEqual(
    queue.waiting.map((post) => post.postId),
    [7, 9],
  );
  assert.deepEqual(
    queue.overdue.map((post) => post.postId),
    [7],
  );
  assert.deepEqual(
    queue.hidden.map((post) => post.postId),
    [4],
  );
  assert.deepEqual(queue.waiting[1].reasons, ["privacy"]);
  const text = describeQueue(queue);
  assert.match(text, /기다리는 글 \*\*2개\*\*, 그 가운데 \*\*1개는 24시간을 넘김\*\*/);
  assert.match(text, /\| 7 \| 2026-10-25 \| 3 \| 2 \| 욕설·괴롭힘, 광고·도배 \| 30시간 ⚠ \|/);
  assert.match(text, /\| 9 \| 2026-10-26 \| 1 \| 1 \| 개인정보 노출 \| 1시간 \|/);
  assert.match(text, /이미 내린 글 1개\(4\)/);
  assert.equal(DEADLINE_HOURS, 24);
});

test("an empty queue says so", () => {
  assert.equal(readQueue([]).waiting.length, 0);
  assert.match(describeQueue(readQueue([])), /기다리는 신고가 없습니다/);
});
