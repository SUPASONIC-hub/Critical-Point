import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const { THRESHOLDS, LOST_LINE, countsQuery, readCounts, readSheet, describeSheet, sheetFrom, fetchSheet, defaultOut } = await import("../../scripts/report-decision-t.mjs");

const WAIT = /판단 보류/;
const counts = (over = {}) => readCounts([{ finished_seasons: 0, week_finished_seasons: 0, case_rows: 86, week_case_rows: 12, cash_cases: 80, lost_cases: 8, windows: 700, scout_recorded: 700, scouts: 70, busts: 60, timeouts: 6, pushes: 40, creeps: 14, drafts: 20, paid_drafts: 2, ...over }]);
const row = (sheet, t) => sheet.rows.find((r) => r.t === t);

test("the counts are one read-only SELECT that never takes a run, a session or a name", () => {
  const sql = countsQuery("2026-W47", "audit-cascade");
  assert.equal(sql.trim().split(";").filter((part) => part.trim()).length, 1);
  assert.match(sql.trim(), /^with /);
  assert.doesNotMatch(sql, /\b(insert|update|delete|drop|alter|grant|truncate)\b/i);
  assert.doesNotMatch(sql, /select[^;]*\b(s|c)\.(run_id|session_id|session_code)\b\s*(,|as|from)/i);
  assert.match(sql, /assistStory/, "story-mode runs are left out");
  assert.match(sql, /'audit-cascade'/);
  assert.match(sql, new RegExp(`< ${LOST_LINE}\\)`));
  assert.doesNotMatch(countsQuery("2026-W47", "all"), /weekRule' = /);
  assert.throws(() => countsQuery("2026-W47'; drop", "all"), /not a week key/);
  assert.throws(() => countsQuery("2026-W47", "x'; drop"), /not a rule/);
});

test("N5's units and thresholds: seasons 30, case records 150, busts 100, the week's case records 80", () => {
  assert.deepEqual({ ...THRESHOLDS }, { finishedSeasons: 30, caseRows: 150, bustWindows: 100, weekCaseRows: 80 });
  const sheet = readSheet({ counts: counts() });
  assert.deepEqual(Object.values(sheet.gates).map((g) => g.met), [false, false, false, false]);
  for (const t of ["T1", "T2", "T3", "T6", "T7", "T8", "T9", "T11"]) assert.match(row(sheet, t).verdict, WAIT, t);
  assert.match(row(sheet, "T5").verdict, /11-26/);
  assert.match(row(sheet, "T12").verdict, /#556/);
  assert.equal(sheet.rows.length, 12);
  const text = describeSheet(sheet, { week: "2026-W47", board: "audit-cascade", readAt: new Date("2026-11-23T00:00:00Z") });
  assert.match(text, /\| 끝난 시즌 \| 0 \/ 30 미달 \|/);
  assert.match(text, /\| 사건 기록 \| 86 \/ 150 미달 \|/);
  assert.match(text, /T6 \| B1 조회.*사건 10\.0% \(70\/700\)/);
});

test("a case unit past its threshold judges its rules while the endings still wait", () => {
  const sheet = readSheet({ counts: counts({ case_rows: 200, busts: 120, timeouts: 30, scouts: 600, lost_cases: 2, paid_drafts: 15 }) });
  assert.match(row(sheet, "T1").verdict, WAIT, "endings wait for seasons");
  assert.match(row(sheet, "T9").verdict, /초를 늘림/, "timeout 25% of busts");
  assert.match(row(sheet, "T6").verdict, /믿음 2/, "looks on 85.7% of boards");
  assert.match(row(sheet, "T3").verdict, /→ 70 \(사건 단위/, "2.5% of cases under the line");
  assert.match(row(sheet, "T11").verdict, /올림 후보.*\(사건 단위/, "75% of drafts paid");
  const calm = readSheet({ counts: counts({ case_rows: 200, busts: 120, timeouts: 3, scouts: 100 }) });
  assert.equal(row(calm, "T9").verdict, "그대로");
  assert.match(row(calm, "T6").verdict, /그대로\(믿음 1\)/);
});

test("the seasons judge the endings by the draft's rules", () => {
  const judgment = { seasons: 40, endings: { collapse: 16, "profitable-silence": 0, "field-pact": 12 }, scores: { p10: 40, p50: 60, p90: 80 }, current: { S: 1, A: 5, B: 20, C: 14 } };
  const gaps = { seasons: 40, cash: { n: 40, under: 1 }, scout: null, spend: { seasonsSpending: 2 } };
  const sheet = readSheet({ counts: counts({ finished_seasons: 40 }), judgment, gaps });
  assert.match(row(sheet, "T1").verdict, /profitable-silence 문턱 완화 · field-pact 문턱 조임/);
  assert.match(row(sheet, "T2").verdict, /문턱 완화/, "collapse 40%");
  assert.match(row(sheet, "T3").verdict, /→ 70$/, "2.5% of seasons under the line");
  assert.equal(row(sheet, "T11").verdict, "값 내림");
  assert.match(row(sheet, "T10").number, /1\/5\/20\/14/);
});

test("the test week's warnings decide T7 and T8 once its case records are in", () => {
  const warned = { seasons: 10, boards: 100, cascadeBoards: 60, cascadeBusts: 10, caught: 8, judged: 10, finished: 0, ranked: 0, caseRows: 90 };
  const sheet = readSheet({ counts: counts({ week_case_rows: 90 }), testWeek: warned });
  assert.match(row(sheet, "T7").verdict, /경고 있음/);
  assert.match(row(sheet, "T8").verdict, /40 → 30/);
  const quiet = readSheet({ counts: counts({ week_case_rows: 90 }), testWeek: { ...warned, cascadeBoards: 20, caught: 0 } });
  assert.match(row(quiet, "T7").verdict, /상설 후보/);
  assert.match(row(quiet, "T8").verdict, /B4/);
});

test("the sheet reads the workflow's files, with report-judgment's report under it", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "decision-t-"));
  writeFileSync(path.join(dir, "counts.json"), JSON.stringify({ rows: [{ case_rows: 86, finished_seasons: 0 }] }));
  writeFileSync(path.join(dir, "seasons.json"), "[]");
  writeFileSync(path.join(dir, "gaps.json"), "[]");
  const { markdown, counts: read } = sheetFrom(dir, { week: "2026-W47", board: "audit-cascade", readAt: new Date("2026-11-23T00:00:00Z") });
  assert.equal(read.caseRows, 86);
  assert.match(markdown, /^# 결정 T 확인표 — 2026-W47/);
  assert.match(markdown, /# 2026-W47 판정 보고/);
  const bare = mkdtempSync(path.join(tmpdir(), "decision-t-"));
  writeFileSync(path.join(bare, "counts.json"), "[]");
  assert.doesNotMatch(sheetFrom(bare, { week: "2026-W47", board: "all" }).markdown, /판정 보고/);
});

test("--fetch dispatches, finds its run, waits for it and downloads the sheet", async () => {
  const calls = [];
  const out = mkdtempSync(path.join(tmpdir(), "decision-t-out-"));
  const run = (cmd, args) => {
    calls.push(args.slice(0, 2).join(" "));
    if (args[1] === "list") return JSON.stringify(calls.filter((c) => c === "run list").length < 2 ? [] : [{ databaseId: 42, createdAt: new Date(1_000_000).toISOString() }]);
    if (args[1] === "download") writeFileSync(path.join(out, "decision-t.md"), "# sheet");
    return "";
  };
  const result = await fetchSheet({ week: "2026-W47", board: "audit-cascade", out, run, wait: async () => {}, now: () => 1_000_000 });
  assert.equal(result.id, 42);
  assert.deepEqual(calls, ["workflow run", "run list", "run list", "run watch", "run download"]);
  assert.equal(readFileSync(result.file, "utf8"), "# sheet");
  await assert.rejects(fetchSheet({ week: "2026-W47", board: "all", out, run: (c, a) => (a[1] === "list" ? "[]" : ""), wait: async () => {}, now: () => 0 }), /did not show up/);
});

test("--fetch saves beside the repository's archive folder when there is one", () => {
  const root = mkdtempSync(path.join(tmpdir(), "decision-t-root-"));
  assert.match(defaultOut(path.join(root, "repo"), new Date("2026-11-23T01:00:00Z")), /decision-t-20261123$/);
});
