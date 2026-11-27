/**
 * 결정 T 확인표 (11-23), filled in from the live data in one step: the table
 * of the 2026-11-12 decision T draft (T1-T12), each rule's number, the unit it
 * is judged in and whether that unit has reached its threshold, and what the
 * draft's rule says to do with it. The questions are still asked by a person;
 * this only fills the blanks the draft left as 「(11-23 측정)」.
 *
 * N5 (방향 질의 Q6 (1), 2026-11-12): a rule the case rows can answer is judged
 * on 「사건 기록 N개」, not on 「끝난 시즌 30개」. The sheet prints both units
 * side by side, so the slower one is still in view; only the endings wait for
 * finished seasons.
 *
 * Read only and aggregates only, like report-judgment.mjs: the workflow
 * (.github/workflows/decision-t.yml) runs the SELECTs below and this script's
 * summary is all that leaves the runner.
 *
 *   node scripts/report-decision-t.mjs --sql-counts [--week W] [--board B]   the case-row counts SELECT
 *   node scripts/report-decision-t.mjs --from <dir> [--week W] [--board B] [--json]
 *        the sheet; <dir> holds counts.json, and when they were read seasons.json,
 *        gaps.json, funnel.json (report-judgment's three) and test-week.json (report-test-week's rows)
 *   node scripts/report-decision-t.mjs --fetch [--week W] [--board B] [--out <dir>]
 *        one command on 11-23: dispatch the workflow, wait for it, download the sheet, print it
 *
 * --week defaults to 2026-W47, --board to audit-cascade (report-judgment's).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { initialResources } from "../src/gameConstants.js";
import { HELD_LINE_CAPITAL_SHARE } from "../src/viewModels/reportViewModels.js";
import { BOT_ENDINGS, checkArgs, describeJudgment, readGaps, readJudgment } from "./report-judgment.mjs";
import { bugSignals, readTestWeek } from "./report-test-week.mjs";

/** The thresholds of the draft's section 0 (N5). Each is one of the numbered questions of the pull request. */
export const THRESHOLDS = Object.freeze({
  finishedSeasons: 30,
  caseRows: 150,
  bustWindows: 100,
  weekCaseRows: 80,
});

export const LOST_LINE = initialResources.capital * HELD_LINE_CAPITAL_SHARE;

const STORY = `exists (select 1 from public.playtest_sessions st where st.run_id = s.run_id and st.decision_log @> '[{"assistStory": true}]'::jsonb)`;

/**
 * One read-only statement, one row: the human rows decision T counts in its
 * two units. A row of a run with any story-mode case is left out (as the
 * ranking and report-judgment leave it), and so are rows with no run.
 * `windows`/`busts`/`timeouts` are the decision log's settled boards
 * (`threshold`, useChoiceCommit.js), `scouts` B1's looks, `drafts`/`spent`
 * C9's account money, `lost_cases` case rows that closed under the 「잃음」 line.
 */
export function countsQuery(week, board) {
  checkArgs(week, board);
  const onBoard = board === "all" ? "true" : `c.dynamics->>'weekRule' = '${board}'`;
  return `with human as (
  select s.case_id, s.completed_at, s.dynamics, s.resources, s.decision_log
    from public.playtest_sessions s
   where s.run_id is not null
     and not ${STORY}
), cases as (
  select * from human where case_id <> 'season-final'
), entries as (
  select e
    from cases c
    cross join lateral jsonb_array_elements(case when jsonb_typeof(c.decision_log) = 'array' then c.decision_log else '[]'::jsonb end) e
)
select (select count(*) from human where case_id = 'season-final') as finished_seasons,
       (select count(*) from human h where h.case_id = 'season-final' and public.kst_iso_week(h.completed_at) = '${week}') as week_finished_seasons,
       (select count(*) from cases) as case_rows,
       (select count(*) from cases c where ${onBoard} and public.kst_iso_week(c.completed_at) = '${week}') as week_case_rows,
       (select count(*) from cases c where (c.resources->>'capital') ~ '^-?[0-9.]+$') as cash_cases,
       (select count(*) from cases c where (case when (c.resources->>'capital') ~ '^-?[0-9.]+$' then (c.resources->>'capital')::numeric end) < ${LOST_LINE}) as lost_cases,
       count(*) filter (where e ? 'threshold') as windows,
       count(*) filter (where e->'threshold' ? 'scouted') as scout_recorded,
       count(*) filter (where e->'threshold'->>'scouted' = 'true') as scouts,
       count(*) filter (where e->'threshold'->>'state' = 'bust' or e->'threshold'->>'busted' = 'true') as busts,
       count(*) filter (where e->'threshold'->>'cause' = 'timeout' and (e->'threshold'->>'state' = 'bust' or e->'threshold'->>'busted' = 'true')) as timeouts,
       count(*) filter (where e->'threshold'->>'cause' = 'push' and (e->'threshold'->>'state' = 'bust' or e->'threshold'->>'busted' = 'true')) as pushes,
       count(*) filter (where e->'threshold'->>'cause' = 'creep' and (e->'threshold'->>'state' = 'bust' or e->'threshold'->>'busted' = 'true')) as creeps,
       count(*) filter (where jsonb_typeof(e->'relicDraft') = 'object') as drafts,
       count(*) filter (where coalesce((e->'relicDraft'->>'cost')::numeric, 0) > 0) as paid_drafts
  from entries`;
}

const n = (value) => (value === null || value === undefined || value === "" ? 0 : Number(value) || 0);
const share = (part, whole) => (whole > 0 ? (part / whole) * 100 : null);
const pct = (value) => (value === null ? "—" : `${value.toFixed(1)}%`);

/** counts.json's one row as numbers. */
export function readCounts(rows) {
  const row = (Array.isArray(rows) ? rows : rows?.rows ?? [])[0] ?? {};
  const keys = ["finished_seasons", "week_finished_seasons", "case_rows", "week_case_rows", "cash_cases", "lost_cases", "windows", "scout_recorded", "scouts", "busts", "timeouts", "pushes", "creeps", "drafts", "paid_drafts"];
  return Object.fromEntries(keys.map((key) => [key.replace(/_(\w)/g, (_, c) => c.toUpperCase()), n(row[key])]));
}

/** Whether a unit has reached its threshold: "넘음" / "미달". */
const gate = (count, min) => ({ count, min, met: count >= min });
const gateText = (g) => `${g.count} / ${g.min} ${g.met ? "넘음" : "미달"}`;
const WAIT = "판단 보류(문턱 미달 → 한 주 더, 숫자 그대로)";

/**
 * Each rule of the draft's table, read off the numbers. `verdict` is what the
 * draft's rule says; a unit short of its threshold says WAIT instead.
 */
export function readSheet({ counts, judgment = null, gaps = null, testWeek = null }) {
  const c = counts;
  const seasonGate = gate(c.finishedSeasons, THRESHOLDS.finishedSeasons);
  const caseGate = gate(c.caseRows, THRESHOLDS.caseRows);
  const bustGate = gate(c.busts, THRESHOLDS.bustWindows);
  const weekGate = gate(c.weekCaseRows, THRESHOLDS.weekCaseRows);
  const judged = judgment?.seasons ?? 0;
  const endingShare = (id) => (judged > 0 ? share(judgment.endings[id] ?? 0, judged) : null);
  const rows = [];

  // T1: the thin endings against the bot.
  {
    const parts = ["profitable-silence", "field-pact"].map((id) => {
      const human = endingShare(id);
      const bot = BOT_ENDINGS[id];
      let rule = "그대로";
      if (human !== null && (human < bot / 2 || human < bot - 3)) rule = "문턱 완화";
      else if (human !== null && human > 25) rule = "문턱 조임";
      return { id, human, bot, rule };
    });
    rows.push({
      t: "T1", name: "C2 얇은·두꺼운 결말 문턱",
      number: parts.map((p) => `${p.id} 사람 ${pct(p.human)} / 봇 ${p.bot}%`).join(" · "),
      units: `끝난 시즌 ${gateText(seasonGate)} (결말은 시즌 끝에만 나옴, 사건 단위 없음)`,
      verdict: seasonGate.met ? parts.map((p) => `${p.id} ${p.rule}`).join(" · ") : WAIT,
    });
  }
  // T2: collapse.
  {
    const human = endingShare("collapse");
    const rule = human === null ? "—" : human > 35 ? "문턱 완화" : human < 10 ? "문턱 조임" : "그대로";
    rows.push({
      t: "T2", name: "C2 붕괴 문턱", number: `붕괴 사람 ${pct(human)} / 봇 ${BOT_ENDINGS.collapse}%`,
      units: `끝난 시즌 ${gateText(seasonGate)}`, verdict: seasonGate.met ? rule : WAIT,
    });
  }
  // T3: the 「lost」 line, by season (gaps) and by case row.
  {
    const seasonUnder = gaps?.cash ? share(gaps.cash.under, gaps.cash.n) : null;
    const caseUnder = share(c.lostCases, c.cashCases);
    const ruleOf = (value) => (value === null ? "—" : value < 5 ? `선 ${LOST_LINE} → 70` : value > 50 ? `선 ${LOST_LINE} → 90` : `선 ${LOST_LINE} 그대로`);
    rows.push({
      t: "T3", name: `C3 「잃음」 선 ${LOST_LINE}`,
      number: `선 밑: 시즌 ${pct(seasonUnder)}${gaps?.cash ? ` (${gaps.cash.under}/${gaps.cash.n})` : ""} · 사건 ${pct(caseUnder)} (${c.lostCases}/${c.cashCases})`,
      units: `끝난 시즌 ${gateText(seasonGate)} · 사건 기록 ${gateText(caseGate)}`,
      verdict: seasonGate.met ? ruleOf(seasonUnder) : caseGate.met ? `${ruleOf(caseUnder)} (사건 단위, 시즌 확인은 30개 뒤)` : WAIT,
    });
  }
  rows.push({ t: "T4", name: "C3 피해를 점수에", number: judgment ? `점수 p10/p50/p90 = ${[judgment.scores.p10, judgment.scores.p50, judgment.scores.p90].map((v) => v ?? "—").join(" / ")}` : "—", units: `끝난 시즌 ${gateText(seasonGate)}`, verdict: "권장: 넣지 않음(퍼짐이 아주 좁을 때만 다시)" });
  rows.push({ t: "T5", name: "F1 숨김 스위치", number: "Verify Ranking 밤 요약 'would hide N of M'", units: "14일 관찰(11-13 시작)", verdict: "이 표 밖: ~11-26 따로" });
  // T6: looks, case unit first.
  {
    const caseUse = c.scoutRecorded > 0 ? share(c.scouts, c.windows) : null;
    const seasonUse = gaps?.scout ? share(gaps.scout.scouts, gaps.scout.windows) : null;
    const ruleOf = (value) => (value === null ? "기록 없음" : value > 80 ? "믿음 2 (BUST가 줄지 않았는지 near-miss·T9와 함께 확인)" : value < 30 ? "그대로(믿음 1)" : "그대로(믿음 1, 다음 개편에 다시)");
    rows.push({
      t: "T6", name: "B1 조회(믿음) 사용",
      number: `판당 조회: 사건 ${pct(caseUse)} (${c.scouts}/${c.windows}) · 시즌 ${pct(seasonUse)}`,
      units: `사건 기록 ${gateText(caseGate)} · 끝난 시즌 ${gateText(seasonGate)}`,
      verdict: caseGate.met ? ruleOf(caseUse) : WAIT,
    });
  }
  // T7 / T8: the test week's own lines.
  {
    const t = testWeek;
    const signals = t ? bugSignals(t) : [];
    const cascadeWarn = signals.some((s) => s.startsWith("연1") || s.startsWith("연2"));
    const auditWarn = signals.some((s) => s.startsWith("감1"));
    const weekUnits = `W 사건 기록 ${gateText(weekGate)} · W 끝난 시즌 ${c.weekFinishedSeasons}`;
    rows.push({
      t: "T7", name: "B2 CASCADE (W47)",
      number: t ? `CASCADE 판 ${pct(share(t.cascadeBoards, t.boards))} · 그 판 BUST ${pct(share(t.cascadeBusts, t.cascadeBoards))}` : "시험 주 행 없음",
      units: weekUnits,
      verdict: !weekGate.met ? WAIT : cascadeWarn ? "경고 있음 → 값 낮춤 또는 상설 안 함" : "경고 없음 → 상설 후보(묶음 R)",
    });
    rows.push({
      t: "T8", name: "B3 AUDIT (W47) + B4",
      number: t ? `적발 ${pct(share(t.caught, t.judged))} (${t.caught}/${t.judged}) · 시즌당 ${t.seasons > 0 ? (t.caught / t.seasons).toFixed(2) : "—"}` : "시험 주 행 없음",
      units: weekUnits,
      verdict: !weekGate.met ? WAIT : auditWarn ? "감1 경고 → 문턱 40 → 30" : t && t.caught === 0 ? "적발 0 → B3 약함, B4(IDLE MONEY 주간 규칙)를 다시 봄" : "정상 → B3 상설 후보, B4는 주간 규칙으로만",
    });
  }
  // T9: the stake clock, from the human busts.
  {
    const timeout = share(c.timeouts, c.busts);
    rows.push({
      t: "T9", name: "B5 판돈 시계 초",
      number: `사람 BUST ${c.busts}: timeout ${pct(timeout)} · push ${pct(share(c.pushes, c.busts))} · creep ${pct(share(c.creeps, c.busts))}`,
      units: `사건 기록 ${gateText(caseGate)} · BUST 판 ${gateText(bustGate)}`,
      verdict: !(caseGate.met && bustGate.met) ? WAIT : timeout > 20 ? "초를 늘림(+check:pressure)" : "그대로",
    });
  }
  rows.push({ t: "T10", name: "C1 직급 한도", number: judgment ? `S/A/B/C(현재 기준) = ${["S", "A", "B", "C"].map((r) => judgment.current[r]).join("/")}` : "—", units: `끝난 시즌 ${gateText(seasonGate)}`, verdict: "권장: 넣지 않음" });
  // T11: the account money.
  {
    const caseSpend = c.drafts > 0 ? share(c.paidDrafts, c.drafts) : null;
    const seasonSpend = gaps?.spend ? share(gaps.spend.seasonsSpending, gaps.seasons) : null;
    const ruleOf = (value) => (value === null ? "기록 없음" : value < 10 ? "값 내림" : value > 60 ? "올림 후보(check:pressure 금고 차이 ±5% 확인)" : "그대로");
    rows.push({
      t: "T11", name: "C9 계좌 돈 쓰기 값",
      number: `돈 쓴 드래프트: 사건 ${pct(caseSpend)} (${c.paidDrafts}/${c.drafts}) · 쓴 시즌 ${pct(seasonSpend)}`,
      units: `사건 기록 ${gateText(caseGate)} · 끝난 시즌 ${gateText(seasonGate)}`,
      verdict: seasonGate.met ? ruleOf(seasonSpend) : caseGate.met ? `${ruleOf(caseSpend)} (사건 단위: 드래프트 중 비율)` : WAIT,
    });
  }
  rows.push({ t: "T12", name: "D2 명예 문턱", number: "Verify Ranking 밤 요약의 문턱 줄(#556)", units: "—", verdict: "이 표 밖: #556 줄로" });
  return { gates: { seasonGate, caseGate, bustGate, weekGate }, rows };
}

const cell = (text) => String(text).replace(/\|/g, "\\|");

export function describeSheet(sheet, { week, board, readAt = new Date() } = {}) {
  const { seasonGate, caseGate, bustGate, weekGate } = sheet.gates;
  return [
    `# 결정 T 확인표 — ${week} (보드: ${board})`,
    "",
    `${readAt.toISOString().slice(0, 16).replace("T", " ")} UTC에 운영 DB를 읽기만 하고 집계했습니다. 사람 행만(이야기 모드 런 제외), 개별 런·기기·이름 없음.`,
    "",
    "## 0. 판단 단위 (N5: 사건으로 볼 수 있는 규칙은 사건 기록으로)",
    "",
    "| 단위 | 지금 / 문턱 | 쓰는 규칙 |",
    "|---|---|---|",
    `| 끝난 시즌 | ${gateText(seasonGate)} | T1 T2 (T3 T11 시즌 확인) |`,
    `| 사건 기록 | ${gateText(caseGate)} | T3 T6 T9 T11 |`,
    `| BUST 판 | ${gateText(bustGate)} | T9 |`,
    `| ${week} 사건 기록(${board}) | ${gateText(weekGate)} | T7 T8 |`,
    "",
    "## 1. 항목",
    "",
    "| T | 항목 | 숫자 | 단위 · 문턱 | 규칙대로 |",
    "|---|---|---|---|---|",
    ...sheet.rows.map((r) => `| ${r.t} | ${cell(r.name)} | ${cell(r.number)} | ${cell(r.units)} | ${cell(r.verdict)} |`),
    "",
    "다음: 이 표를 결정 T 초안 3절 질문(T-1~T-12)에 붙여 「전부 1?」로 묻습니다. 판단 보류인 줄은 T-12 (1)대로 한 주 미룹니다.",
  ].join("\n");
}

function readJson(dir, name) {
  const file = path.join(dir, name);
  if (!existsSync(file)) return null;
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  return Array.isArray(parsed) ? parsed : Array.isArray(parsed?.rows) ? parsed.rows : parsed;
}

/** The sheet (and report-judgment's own report under it) from the files the workflow wrote. */
export function sheetFrom(dir, { week, board, readAt = new Date() }) {
  const counts = readCounts(readJson(dir, "counts.json") ?? []);
  const seasons = readJson(dir, "seasons.json");
  const funnel = readJson(dir, "funnel.json");
  const gapRows = readJson(dir, "gaps.json");
  const testRows = readJson(dir, "test-week.json");
  const judgment = seasons ? readJudgment(seasons, funnel, week) : null;
  const gaps = gapRows ? readGaps(gapRows) : null;
  const testWeek = testRows ? readTestWeek(testRows) : null;
  const sheet = readSheet({ counts, judgment, gaps, testWeek });
  const markdown = [describeSheet(sheet, { week, board, readAt }), ...(judgment ? ["", "---", "", describeJudgment(judgment, { week, board }, gaps ?? undefined)] : [])].join("\n");
  return { sheet, counts, markdown };
}

/** 11-23 in one command: dispatch, wait, download, print. `run` runs a command and returns its stdout. */
export async function fetchSheet({ week, board, out, run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }), wait = (ms) => new Promise((r) => setTimeout(r, ms)), now = () => Date.now() }) {
  const started = now();
  run("gh", ["workflow", "run", "decision-t.yml", "-f", `week=${week}`, "-f", `board=${board}`]);
  let id = null;
  for (let tries = 0; tries < 30 && id === null; tries += 1) {
    await wait(5000);
    const runs = JSON.parse(run("gh", ["run", "list", "--workflow", "decision-t.yml", "--event", "workflow_dispatch", "--limit", "5", "--json", "databaseId,createdAt"]));
    id = runs.find((r) => Date.parse(r.createdAt) >= started - 60000)?.databaseId ?? null;
  }
  if (id === null) throw new Error("the dispatched Decision T run did not show up in 150 seconds; see `gh run list --workflow decision-t.yml`");
  run("gh", ["run", "watch", String(id), "--exit-status"]);
  mkdirSync(out, { recursive: true });
  run("gh", ["run", "download", String(id), "-n", "decision-t", "-D", out]);
  return { id, file: path.join(out, "decision-t.md") };
}

/** Where --fetch saves by default: the owner's archive folder beside the repository when there is one, else the temp folder. */
export function defaultOut(root = process.cwd(), today = new Date()) {
  const day = new Date(today.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10).replaceAll("-", "");
  const archive = path.join(root, "..", "cp-archive");
  return existsSync(archive) ? path.join(archive, `메모-${day}`, "decision-t") : path.join(tmpdir(), `decision-t-${day}`);
}

async function main(argv) {
  const opt = (name) => {
    const at = argv.indexOf(name);
    return at >= 0 ? argv[at + 1] : undefined;
  };
  const week = opt("--week") || "2026-W47";
  const board = opt("--board") || "audit-cascade";
  checkArgs(week, board);
  if (argv.includes("--sql-counts")) return void process.stdout.write(`${countsQuery(week, board)}\n`);
  if (argv.includes("--fetch")) {
    const { id, file } = await fetchSheet({ week, board, out: opt("--out") || defaultOut() });
    process.stdout.write(`${readFileSync(file, "utf8")}\n\n(run ${id}, saved to ${file})\n`);
    return;
  }
  const dir = opt("--from");
  if (!dir) throw new Error("usage: report-decision-t.mjs --sql-counts | --from <dir> [--json] | --fetch [--out <dir>]  [--week W] [--board B]");
  const { sheet, counts, markdown } = sheetFrom(dir, { week, board });
  process.stdout.write(argv.includes("--json") ? `${JSON.stringify({ week, board, counts, thresholds: THRESHOLDS, rows: sheet.rows }, null, 2)}\n` : `${markdown}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main(process.argv.slice(2));
