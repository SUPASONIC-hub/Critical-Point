import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { BOARD_REPORT_REASONS, createBoardReportPayload, describeBoardReportFailure } from "../../src/boardReport.js";

/**
 * The report button on a board post: the row it sends, the reasons it offers
 * against the table's check constraint, and what a refusal is told.
 * `npm run check:grants` sends the same rows to the replayed schema as anon.
 */
const MIGRATIONS = new globalThis.URL("../../supabase/migrations/", import.meta.url);
const migration = readdirSync(MIGRATIONS).find((file) => file.endsWith("_board_reports.sql"));

test("the row is a post id, a reason and the board writer id, and nothing typed", () => {
  assert.deepEqual(createBoardReportPayload({ postId: 12, reason: "spam", sessionId: "board-abc123" }), {
    post_id: 12,
    session_id: "board-abc123",
    reason: "spam",
  });
  assert.throws(() => createBoardReportPayload({ postId: 12, reason: "boring", sessionId: "board-abc123" }), /unknown board report reason/);
  assert.throws(() => createBoardReportPayload({ postId: "12", reason: "spam", sessionId: "board-abc123" }), /names no post/);
  assert.throws(() => createBoardReportPayload({ postId: 0, reason: "spam", sessionId: "board-abc123" }), /names no post/);
});

test("the reasons offered are the reasons the table takes, in its order", () => {
  assert.ok(migration, "the board_reports migration is among the migrations");
  const sql = readFileSync(new globalThis.URL(migration, MIGRATIONS), "utf8");
  const constraint = sql.match(/constraint board_reports_reason_check check \(reason in \(([^)]*)\)\)/);
  assert.ok(constraint, "the reason check constraint is where this test reads it");
  const taken = [...constraint[1].matchAll(/'([a-z]+)'/g)].map((match) => match[1]);
  assert.deepEqual(BOARD_REPORT_REASONS.map((reason) => reason.id), taken);
  for (const reason of BOARD_REPORT_REASONS) assert.ok(reason.label.length > 0 && reason.label.length <= 12, reason.id);
});

test("each refusal the trigger raises is told in Korean, and anything else falls back", () => {
  const refusal = (serverMessage) => Object.assign(new Error("Board report failed"), { serverMessage });
  assert.match(describeBoardReportFailure(refusal("board report names no visible post"), true), /이미 내려간 글/);
  assert.match(describeBoardReportFailure(refusal("board report rate limit exceeded"), true), /한 시간에/);
  assert.match(describeBoardReportFailure(new Error("network"), false), /오프라인/);
  assert.match(describeBoardReportFailure(new Error("network"), true), /신고를 보내지 못했습니다/);
});
