import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const { judgmentQuery, readJudgment, describeJudgment, weekMonday, checkArgs } = await import("../../scripts/report-judgment.mjs");

const T = Date.parse("2026-11-17T10:00:00+09:00") / 1000;
const PROLOGUE = ["prologue01", "prologue02", "prologue03", "prologue04", "prologue05", "case01"];
const run = (device, reached, start = T) => ({ device, marked: false, new_game_plus: false, cases: PROLOGUE.slice(0, reached).map((caseId, index) => [caseId, start + index * 600, "ko"]) });

export const FIXTURE = {
  seasons: [
    ["collapse", 48, "C"], ["field-pact", 58, "B"], ["field-pact", 67, "B"], ["human-record", 73, "A"],
    ["evidence-reform", 55, "B"], ["quiet-cover", 44, "C"], ["open-question", 61, "B"], ["open-oversight", 70, "B"],
  ].map(([ending, score, rank], index) => ({ ending, score: String(score), rank, new_game_plus: index === 0 })),
  // Five runs of W47 and one of the month before, which the report leaves out.
  funnel: [run(1, 1), run(2, 3), run(3, 5), run(4, 6), run(5, 6), run(6, 1, T - 30 * 86400)],
};

test("the fixture on disk is the one this test builds", () => {
  const onDisk = JSON.parse(readFileSync(new URL("./fixtures/report-judgment.json", import.meta.url), "utf8"));
  assert.deepEqual(onDisk, JSON.parse(JSON.stringify(FIXTURE)));
});

test("W47 starts on Monday 11-16", () => {
  assert.equal(weekMonday("2026-W47"), "2026-11-16");
  assert.equal(weekMonday("2026-W01"), "2025-12-29");
});

test("the query is one read-only SELECT of season-final rows, and bad arguments never reach it", () => {
  const sql = judgmentQuery("2026-W47", "audit-cascade");
  assert.match(sql, /^select /);
  assert.doesNotMatch(sql, /;|\b(insert|update|delete|drop|alter|grant)\b/i);
  assert.doesNotMatch(sql, /run_id as|session_id|nickname/);
  assert.match(sql, /'2026-W47'/);
  assert.doesNotMatch(judgmentQuery("2026-W47", "all"), /weekRule/);
  assert.throws(() => checkArgs("2026-W47'; drop", "all"));
  assert.throws(() => checkArgs("2026-W47", "no-such-rule"));
});

test("endings, ranks and the prologue drop-off are counted from the rows", () => {
  const j = readJudgment(FIXTURE.seasons, FIXTURE.funnel, "2026-W47");
  assert.equal(j.seasons, 8);
  assert.equal(j.newGamePlus, 1);
  assert.equal(j.endings["field-pact"], 2);
  assert.deepEqual(j.current, { S: 0, A: 1, B: 5, C: 2 });
  assert.deepEqual(j.recorded, { S: 0, A: 1, B: 5, C: 2 });
  assert.deepEqual(j.proposed, { S: 1, A: 2, B: 2, C: 3 });
  assert.equal(j.scores.p50, 58);
  assert.equal(j.funnel.runs, 5);
  assert.equal(j.funnel.reach[5], 2);
  const md = describeJudgment(j, { week: "2026-W47", board: "audit-cascade" });
  assert.match(md, /\| field-pact \| 2 \| 25\.0% \| 18% \| \+7\.0 \|/);
  assert.match(md, /\| profitable-silence \| 0 \| 0\.0% \| 4\.8% \| -4\.8 \|/);
  assert.match(md, /\| 프롤로그 01 \| 1 \| 20\.0% \|/);
});

test("without funnel rows the report says so", () => {
  const md = describeJudgment(readJudgment([], null, "2026-W47"), { week: "2026-W47", board: "all" });
  assert.match(md, /끝낸 시즌 0개/);
  assert.match(md, /퍼널 행이 없습니다/);
});
