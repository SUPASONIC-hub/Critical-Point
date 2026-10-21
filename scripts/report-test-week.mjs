/**
 * The test week, read off the live database (.github/workflows/test-week.yml).
 *
 * 2026-W44 plays B3's audit and B2's links on one table (`audit-cascade`,
 * src/gauntlet/weeklyCalendar.js). This prints what that week's seasons did,
 * in the names the measurements used (B3-측정, B2-측정: 시즌당 적발, 금고로 갈
 * 몫, CASCADE 판 BUST, 붕괴 결말), as a Markdown table for the run's Job
 * Summary. Aggregates only: no run id, session, nickname or row leaves this
 * script, and the workflow writes the rows it fetched to a file it never
 * prints.
 *
 *   node scripts/report-test-week.mjs --sql            the one SELECT the workflow sends
 *   node scripts/report-test-week.mjs <rows.json>      the summary, from what it got back
 *
 * TEST_WEEK and TEST_WEEK_RULE pick another week of the calendar (default the
 * one above); both are checked against the shape the server allows before they
 * go into the query.
 *
 * The rows are read through the same functions the game settles with:
 * `countAudit` (auditRisk.js) over a case's decision log is the audit its close
 * judged, and a board carried CASCADE when the entry before it dealt one
 * (`environmentMode`, as cascadeRisk.js's walk reads it). What the server does
 * not keep is estimated and said so: the share of the vault an audit took is
 * worked back from the vault the case's row reports (a caught case moved
 * three parts of four).
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { addAudit, auditStep, countAudit } from "../src/gauntlet/auditRisk.js";
import { walkLinks } from "../src/gauntlet/cascadeRisk.js";
import { AUDIT_LIMIT, getWeekRule } from "../src/gauntlet/weeklyRules.js";

const WEEK = process.env.TEST_WEEK || "2026-W44";
const RULE = process.env.TEST_WEEK_RULE || "audit-cascade";
if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(WEEK)) throw new Error(`TEST_WEEK=${WEEK} is not a week key`);
if (!/^[a-z][a-z0-9-]{0,31}$/.test(RULE) || !getWeekRule(RULE)) throw new Error(`TEST_WEEK_RULE=${RULE} is not a rule of the catalogue`);

/**
 * One read-only statement: the case rows (and the season-final row) of every
 * run that stamped the rule and sent its first case row in the week, with
 * only the decision log's fields this report reads.
 */
export const QUERY = `with runs as (
  select s.run_id
    from public.playtest_sessions s
   where s.run_id is not null
     and s.case_id <> 'season-final'
     and s.dynamics->>'weekRule' = '${RULE}'
   group by s.run_id
  having public.kst_iso_week(min(s.completed_at)) = '${WEEK}'
)
select s.run_id, s.case_id,
       s.summary->>'endingVariant' as ending,
       s.summary->'gauntlet'->'vault' as vault,
       s.summary->>'week' as ranked_week,
       (select coalesce(jsonb_agg(jsonb_build_object(
                 'nodeId', e->'nodeId', 'choiceId', e->'choiceId', 'threshold', e->'threshold',
                 'environmentMode', e->'environmentMode', 'riskRewardEffect', e->'riskRewardEffect',
                 'assistStory', e->'assistStory')), '[]'::jsonb)
          from jsonb_array_elements(case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end) as e
         where jsonb_typeof(e) = 'object') as log
  from public.playtest_sessions s
  join runs using (run_id)
 order by s.run_id, s.completed_at, s.id`;

const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");
const per = (part, whole) => (whole > 0 ? (part / whole).toFixed(2) : "—");
const modes = (entry) => String(entry?.environmentMode ?? "").split("+");

/** The week's numbers, from the rows the query returned. */
export function readTestWeek(rows) {
  const runs = new Map();
  for (const row of rows) {
    if (!runs.has(row.run_id)) runs.set(row.run_id, []);
    runs.get(row.run_id).push(row);
  }
  const t = {
    seasons: runs.size, finished: 0, ranked: 0, caseRows: 0, endings: 0, collapse: 0,
    judged: 0, caught: 0, caughtSeasons: 0, nearLimit: 0, nearLimitClear: 0, vaultMoved: 0, vaultLost: 0,
    boards: 0, busts: 0, cascadeBoards: 0, cascadeBusts: 0, made: 0, cascadeCashHeat: 0, cascadeCashes: 0, plainCashHeat: 0, plainCashes: 0,
  };
  for (const [runId, cases] of runs) {
    let vaultBefore = 0;
    let caughtHere = 0;
    for (const row of cases) {
      if (row.case_id === "season-final") {
        t.finished += 1;
        if (row.ranked_week === WEEK) t.ranked += 1;
        continue;
      }
      t.caseRows += 1;
      const log = Array.isArray(row.log) ? row.log : [];
      const vault = Number(row.vault) || 0;
      const moved = Math.max(0, vault - vaultBefore);
      vaultBefore = Math.max(vaultBefore, vault);
      if (row.case_id === "final" && typeof row.ending === "string") {
        t.endings += 1;
        if (row.ending === "collapse") t.collapse += 1;
      }
      const story = log.some((entry) => entry?.assistStory === true);
      const replay = log.some((entry) => entry?.threshold?.firstRecord);
      // Boards: entry p's board was dealt by entry p - 1 (a case's first is REBOOT's).
      let dealtBy = [];
      let running = 0;
      let reached = false;
      for (const entry of log) {
        const threshold = entry?.threshold;
        if (!threshold) continue;
        const bust = threshold.state === "bust" || threshold.busted === true;
        const cascade = dealtBy.includes("cascade");
        t.boards += 1;
        if (bust) t.busts += 1;
        if (cascade) {
          t.cascadeBoards += 1;
          if (bust) t.cascadeBusts += 1;
        }
        if (!bust) {
          const heat = Math.round(Number(threshold.gauge) || 0);
          if (cascade) { t.cascadeCashHeat += heat; t.cascadeCashes += 1; } else { t.plainCashHeat += heat; t.plainCashes += 1; }
        }
        running = addAudit(running, auditStep({ busted: bust, gauge: threshold.gauge, pushes: threshold.pushes, cascade }));
        if (running >= AUDIT_LIMIT - 1 && running < AUDIT_LIMIT) reached = true;
        dealtBy = modes(entry);
      }
      t.made += walkLinks(log, runId).made;
      if (story || replay || !log.some((entry) => entry?.threshold)) continue;
      const count = countAudit(log);
      t.judged += 1;
      if (reached) {
        t.nearLimit += 1;
        if (count < AUDIT_LIMIT) t.nearLimitClear += 1;
      }
      if (count >= AUDIT_LIMIT) {
        t.caught += 1;
        caughtHere += 1;
        // A caught close moved three parts of four of what it secured.
        const lost = Math.round(moved / 3);
        t.vaultLost += lost;
        t.vaultMoved += moved + lost;
      } else {
        t.vaultMoved += moved;
      }
    }
    if (caughtHere > 0) t.caughtSeasons += 1;
  }
  return t;
}

export function describeTestWeek(t) {
  const meanHeat = (sum, n) => (n > 0 ? (sum / n).toFixed(1) : "—");
  return [
    `## 시험 주 ${WEEK} · ${getWeekRule(RULE).label}`,
    "",
    `${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC에 운영 DB를 읽기만 하고 집계했습니다. 개별 시즌·기기·이름은 싣지 않습니다.`,
    "",
    "| 구분 | 지표 | 이번 주 | 시뮬레이션(참고) |",
    "|---|---|---|---|",
    `| 시즌 | 시작한 시즌 / 사건 행 | ${t.seasons} / ${t.caseRows} | |`,
    `| 시즌 | 끝난 시즌 / 이 주 랭킹에 오른 시즌 | ${t.finished} / ${t.ranked} | |`,
    `| 감사 | 판정한 사건 닫힘 / 적발 | ${t.judged} / ${t.caught} (${pct(t.caught, t.judged)}) | |`,
    `| 감사 | 시즌당 적발 / 적발이 있었던 시즌 | ${per(t.caught, t.seasons)} / ${t.caughtSeasons} (${pct(t.caughtSeasons, t.seasons)}) | 1.75 / 13% (B, 감사만, 시즌 봇) |`,
    `| 감사 | 금고로 갈 몫의 잃은 비율(추정) | ${pct(t.vaultLost, t.vaultMoved)} | 0.7% (B, 감사만) |`,
    `| 감사 | 벌 전 알아챔: ${AUDIT_LIMIT - 1}/${AUDIT_LIMIT}에 닿은 사건 중 적발 없이 닫은 비율 | ${pct(t.nearLimitClear, t.nearLimit)} (${t.nearLimitClear}/${t.nearLimit}) | |`,
    `| 연쇄 | 판 / CASCADE 판 비율 | ${t.boards} / ${pct(t.cascadeBoards, t.boards)} | |`,
    `| 연쇄 | CASCADE 판 BUST (모든 판) | ${pct(t.cascadeBusts, t.cascadeBoards)} (${pct(t.busts, t.boards)}) | |`,
    `| 연쇄 | 시즌당 만듦 / 돌아옴 | ${per(t.made, t.seasons)} / ${per(t.cascadeBoards, t.seasons)} | |`,
    `| 연쇄 | 벌 전 알아챔: 확정한 열기 평균, CASCADE 판 / 다른 판 | ${meanHeat(t.cascadeCashHeat, t.cascadeCashes)} / ${meanHeat(t.plainCashHeat, t.plainCashes)} | |`,
    `| 결말 | 붕괴 결말 | ${pct(t.collapse, t.endings)} (${t.collapse}/${t.endings}) | 21.0% (연쇄 이월 1, 끔 20.7%) |`,
    "",
    "시뮬레이션 값은 감사·연쇄를 따로 켠 측정입니다(PR #201, #208). 두 장치를 함께 켠 판은 이 주가 처음입니다.",
  ].join("\n");
}

const [arg] = import.meta.url === pathToFileURL(process.argv[1] ?? "").href ? process.argv.slice(2) : [];
if (arg === "--sql") {
  process.stdout.write(`${QUERY}\n`);
} else if (arg) {
  const parsed = JSON.parse(readFileSync(arg, "utf8"));
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.rows) ? parsed.rows : null;
  if (!rows) throw new Error(`${arg} holds no rows`);
  process.stdout.write(`${describeTestWeek(readTestWeek(rows))}\n`);
}
