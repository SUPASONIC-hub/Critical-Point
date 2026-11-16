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
  assert.match(md, /\| field-pact \| 2 \| 25\.0% \| 17\.7% \| \+7\.3 \|/);
  assert.match(md, /\| profitable-silence \| 0 \| 0\.0% \| 4\.2% \| -4\.2 \|/);
  assert.match(md, /\| 프롤로그 01 \| 1 \| 20\.0% \|/);
});

test("without funnel rows the report says so", () => {
  const md = describeJudgment(readJudgment([], null, "2026-W47"), { week: "2026-W47", board: "all" });
  assert.match(md, /끝낸 시즌 0개/);
  assert.match(md, /퍼널 행이 없습니다/);
});

test("the bot's endings are the test-week summary's own reference line", async () => {
  const { BOT_ENDINGS, botEndings } = await import("../../scripts/report-judgment.mjs");
  const { SIMULATION_LINES } = await import("../../scripts/report-test-week.mjs");
  assert.deepEqual(BOT_ENDINGS, botEndings(SIMULATION_LINES));
  assert.equal(BOT_ENDINGS.collapse, Number(/collapse ([\d.]+)%/.exec(SIMULATION_LINES)[1]));
  assert.equal(Object.keys(BOT_ENDINGS).length, 9);
  const total = Object.values(BOT_ENDINGS).reduce((sum, value) => sum + value, 0);
  assert.ok(Math.abs(total - 100) < 0.5, `endings add to ${total}`);
  assert.deepEqual(botEndings("Ending checks passed (600 replayed seasons: collapse 20.0%, field-pact 80.0%)"), { collapse: 20, "field-pact": 80 });
  assert.throws(() => botEndings("no endings here"));
});

const { gapsQuery, readGaps, describeGaps } = await import("../../scripts/report-judgment.mjs");

// (d) decision T's three gaps: one row per season, as gapsQuery returns it.
const GAP_ROWS = [
  { ending: "field-pact", cases: 5, mean_capital: "92.0", mean_human_cost: "10", windows: 20, scout_recorded: 20, scouts: 6, drafts: 4, spent: 16000, rerolls: 1, extras: 1 },
  { ending: "quiet-cover", cases: 5, mean_capital: "71.5", mean_human_cost: "22", windows: 18, scout_recorded: 18, scouts: 0, drafts: 4, spent: 0, rerolls: 0, extras: 0 },
  { ending: "collapse", cases: 5, mean_capital: "40", mean_human_cost: "60", windows: 22, scout_recorded: 22, scouts: 2, drafts: 3, spent: "4000", rerolls: "1", extras: "0" },
];

test("(d) the gaps query is one read-only statement over the judged seasons, and lets no run id out", () => {
  const sql = gapsQuery("2026-W47", "audit-cascade");
  assert.match(sql, /^with seasons as \(\nselect f\.run_id/);
  assert.match(sql, /'threshold' \? 'scouted'/);
  assert.match(sql, /'relicDraft'->>'cost'/);
  assert.match(sql, /resources->>'capital'/);
  assert.match(sql, /^select s\.ending,/m);
  assert.doesNotMatch(sql, /^select s\.run_id|insert|update |delete/im);
  assert.throws(() => gapsQuery("2026-W47", "x'; drop"));
});

test("(d) T3, T6 and T11 are counted from the rows", () => {
  const g = readGaps(GAP_ROWS);
  assert.equal(g.line, 80);
  assert.deepEqual([g.cash.under, g.cash.underNotCollapse, g.cash.n], [2, 1, 3]);
  assert.deepEqual([g.scout.windows, g.scout.scouts, g.scout.seasonsUsing], [60, 8, 2]);
  assert.deepEqual([g.spend.spent, g.spend.seasonsSpending, g.spend.rerolls, g.spend.extras, g.spend.drafts], [20000, 2, 2, 1, 11]);
  const text = describeGaps(g).join("\n");
  assert.match(text, /80 밑 2\/3 \(66\.7%\), 그중 붕괴 결말 아님 1/);
  assert.match(text, /판 60개 중 8 \(13\.3%\)/);
  assert.match(text, /쓴 시즌 2\/3 \(66\.7%\); 합계 20000/);
  assert.doesNotMatch(text, /기록 없음/);
});

test("(d) a number no row carries reads 「기록 없음」, not zero", () => {
  const old = GAP_ROWS.map((row) => ({ ...row, mean_capital: null, mean_human_cost: null, scout_recorded: 0, scouts: 0, drafts: 0, spent: 0 }));
  const text = describeGaps(readGaps(old)).join("\n");
  assert.equal(text.match(/기록 없음/g).length, 4);
  assert.match(describeGaps(null).join("\n"), /빈칸 행이 없습니다/);
  assert.match(describeJudgment(readJudgment(FIXTURE.seasons, null, "2026-W47"), { week: "2026-W47", board: "all" }, readGaps(GAP_ROWS)), /## \(d\) 결정 T/);
});

test("(d) T3 held is read off the season row's own standing where it has one, and approximated for older rows", () => {
  assert.match(gapsQuery("2026-W47", "all"), /f\.summary->>'seasonStanding' as standing/);
  assert.match(gapsQuery("2026-W47", "all"), /group by s\.run_id, s\.ending, s\.standing/);
  // No row carries it: the approximation alone, said to be one.
  const before = readGaps(GAP_ROWS);
  assert.deepEqual([before.held.held, before.held.heldRecorded, before.held.heldApprox, before.held.recorded], [1, 0, 1, 0]);
  assert.match(describeGaps(before).join("\n"), /T3 held: standing을 실은 행이 아직 없음 — 위 「붕괴 결말 아님」 근사 1/);
  // The quiet-cover season ended under the line without collapse, but its row says near: it did not hold.
  // A field-pact season over 80 that the row calls held counts, as the report printed it.
  const rows = [
    { ...GAP_ROWS[0], standing: "held" },
    { ...GAP_ROWS[1], standing: "near" },
    { ...GAP_ROWS[2], standing: "over" },
    { ...GAP_ROWS[1], standing: null },
  ];
  const g = readGaps(rows);
  assert.deepEqual([g.held.held, g.held.heldRecorded, g.held.heldApprox, g.held.recorded, g.held.unrecorded], [2, 1, 1, 3, 1]);
  assert.deepEqual(g.held.standings, { held: 1, clear: 0, near: 1, over: 1 });
  const text = describeGaps(g).join("\n");
  assert.match(text, /T3 held\(돈 잃고 사람 지킴\): 2\/4 \(50\.0%\) = 행 기록 1\/3 \+ 기록 전 행 근사 1\/1; 기록된 standing held 1 · clear 0 · near 1 · over 1/);
  // Every row recorded: no approximation in the line.
  assert.doesNotMatch(describeGaps(readGaps(rows.slice(0, 3))).join("\n"), /기록 전 행 근사/);
});
