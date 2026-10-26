/**
 * The test week, read off the live database (.github/workflows/test-week.yml).
 *
 * 2026-W47 (11-16 to 11-22; W44 until 2026-10-22) plays B3's audit and B2's
 * links on one table (`audit-cascade`,
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

import { addAudit, AUDIT_LIMIT, auditStep, countAudit } from "../src/gauntlet/auditRisk.js";
import { walkLinks } from "../src/gauntlet/cascadeRisk.js";
import { getWeekRule } from "../src/gauntlet/weeklyRules.js";

const WEEK = process.env.TEST_WEEK || "2026-W47";
const RULE = process.env.TEST_WEEK_RULE || "audit-cascade";
if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(WEEK)) throw new Error(`TEST_WEEK=${WEEK} is not a week key`);
if (!/^[a-z][a-z0-9-]{0,31}$/.test(RULE) || !getWeekRule(RULE)) throw new Error(`TEST_WEEK_RULE=${RULE} is not a rule of the catalogue`);

/**
 * One read-only statement: the case rows (and the season-final row) of every
 * run that stamped the rule and sent its first case row in the week, with
 * only the decision log's fields this report reads; and one bare row for each
 * season of the week that did not take the rule, story mode left out.
 *
 * A season that turned the rule down (the box on the start screen, #199) is
 * not marked as such: the client stamps no `weekRule` (pickSeasonWeekRule
 * returns null), so its rows look like the ordinary table's. A device's first
 * season is one of them unless its player ticked the box that takes the rule
 * up (E-8: a first season starts without the week's rule), and so is a season
 * of a client older than the rule, or one begun the week before and first
 * sent in this one; all are counted together.
 *
 * A NEW GAME+ season (a device that finished one and began again) is a season
 * of the week like any other when it took the rule. Its case rows carry
 * `summary.newGamePlus` (newGamePlusMark), and it opens its first cases on
 * the full table rather than the first season's staged one (tableUnlocks.js),
 * so the report says how many of the week's seasons were NEW GAME+. Story mode stamps no
 * rule either, and is told apart by the `assistStory` its decision log
 * carries. A season's device is the smallest session id among its case rows,
 * and only its rank among the week's devices leaves the database.
 */
export function testWeekQuery(week = WEEK, rule = RULE) {
  return `with runs as (
  select s.run_id,
         max(s.dynamics->>'weekRule') is not null as rule_on,
         coalesce(bool_or(s.decision_log @> '[{"assistStory": true}]'::jsonb), false) as story,
         min(s.session_id) as session_id
    from public.playtest_sessions s
   where s.run_id is not null
     and s.case_id <> 'season-final'
     and coalesce(s.dynamics->>'weekRule', '') in ('', '${rule}')
   group by s.run_id
  having public.kst_iso_week(min(s.completed_at)) = '${week}'
),
seasons as (
  select r.run_id, r.rule_on, dense_rank() over (order by r.session_id) as device
    from runs r
   where r.rule_on or not r.story
)
select c.run_id, coalesce(s.case_id, 'turned-down') as case_id, c.device,
       s.summary->>'endingVariant' as ending,
       s.summary->'gauntlet'->'vault' as vault,
       s.summary->>'week' as ranked_week,
       s.summary->>'newGamePlus' = 'true' as new_game_plus,
       (select coalesce(jsonb_agg(jsonb_build_object(
                 'nodeId', e->'nodeId', 'choiceId', e->'choiceId', 'threshold', e->'threshold',
                 'environmentMode', e->'environmentMode', 'riskRewardEffect', e->'riskRewardEffect',
                 'assistStory', e->'assistStory')), '[]'::jsonb)
          from jsonb_array_elements(case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end) as e
         where jsonb_typeof(e) = 'object') as log
  from seasons c
  left join public.playtest_sessions s on c.rule_on and s.run_id = c.run_id
 order by c.run_id, s.completed_at, s.id`;
}

export const QUERY = testWeekQuery();

const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");
const per = (part, whole) => (whole > 0 ? (part / whole).toFixed(2) : "—");
const modes = (entry) => String(entry?.environmentMode ?? "").split("+");

/** The week's numbers, from the rows the query returned. */
export function readTestWeek(rows) {
  const runs = new Map();
  const devicesOn = new Set();
  const devicesOff = new Set();
  const newGamePlus = new Set();
  let turnedDown = 0;
  for (const row of rows) {
    if (row.case_id === "turned-down") {
      turnedDown += 1;
      devicesOff.add(row.device);
      continue;
    }
    devicesOn.add(row.device);
    if (row.new_game_plus === true || row.new_game_plus === "true") newGamePlus.add(row.run_id);
    if (!runs.has(row.run_id)) runs.set(row.run_id, []);
    runs.get(row.run_id).push(row);
  }
  const t = {
    seasons: runs.size, newGamePlus: newGamePlus.size, turnedDown, devicesOn: devicesOn.size, devicesOff: devicesOff.size,
    devices: new Set([...devicesOn, ...devicesOff]).size, finished: 0, ranked: 0, caseRows: 0, endings: 0, collapse: 0,
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

/**
 * The bot's reference for the summary's last column: the three lines
 * `check:endings` prints with both rules on (AUDIT_WEEK=1 CASCADE_WEEK=1
 * node scripts/check-endings.mjs --report; values B, the audit's exemption,
 * carry cap 1, chip margin 10, 600 seasons), copied as printed. #223 measured
 * them on 10-21 and main c8841dc0 gave the same lines on 10-25. TEST_WEEK_SIM
 * names a file holding a fresh run's output (11-14~15, on the test week's
 * sha) to read instead.
 */
export const SIMULATION_LINES = [
  "Ending checks passed (600 replayed seasons: collapse 21.0%, open-oversight 14.3%, evidence-reform 5.8%, human-record 16.7%, profitable-silence 5.5%, cold-justice 5.0%, field-pact 17.8%, quiet-cover 7.7%, open-question 6.2%)",
  "CASCADE (measured, CASCADE_WEEK=1, values B (8/2~4/6, carry 1), chip margin 10): per season made 44.15, came back 35.04 (21.81 carried in), carried 22.20, lapsed at the season's end 0.68 and at the cap 8.44 (20.6% of made); at most 2 of a case's first two boards CASCADE; CASCADE boards 21022 in 600 of 600 seasons, bust on them 12.5% (every board 10.7%); final vault 861733 a season",
  "Audit (measured, AUDIT_WEEK=1, values B (40/4/-2/1:4)): 789 closes caught in 62 of 600 seasons (1.31 a season), 0.6% of what the closes moved to the vault",
].join("\n");

/** The figures of the summary's last column, read off check:endings' output. */
export function readSimulation(text) {
  const grab = (pattern, what) => {
    const match = text.match(pattern);
    if (!match) throw new Error(`the bot's output has no ${what} line (check:endings with AUDIT_WEEK=1 CASCADE_WEEK=1)`);
    return match;
  };
  const [, seasons, collapse] = grab(/^Ending checks passed \((\d+) replayed seasons: collapse ([\d.]+%)/m, "ending");
  const [, made, back, cascadeBust, bust] = grab(/^CASCADE \(measured, CASCADE_WEEK=1[^)]*\)[^:]*: per season made ([\d.]+), came back ([\d.]+) .*bust on them ([\d.]+%) \(every board ([\d.]+%)\)/m, "CASCADE");
  const [, caughtSeasons, auditSeasons, caught, vaultLost] = grab(/^Audit \(measured, AUDIT_WEEK=1.*?\): \d+ closes caught in (\d+) of (\d+) seasons \(([\d.]+) a season\), ([\d.]+%) of what/m, "audit");
  const share = `${((Number(caughtSeasons) / Number(auditSeasons)) * 100).toFixed(1)}%`;
  return { seasons: Number(seasons), collapse, made, back, cascadeBust, bust, caught, caughtShare: share, vaultLost };
}

const SIM = readSimulation(process.env.TEST_WEEK_SIM ? readFileSync(process.env.TEST_WEEK_SIM, "utf8") : SIMULATION_LINES);
const SIM_NOTE = `둘 다 켬·면제, ${SIM.seasons}시즌 봇`;

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
    `| 시즌 | 그중 NEW GAME+ 시즌(지난 시즌을 끝낸 기기의 다음 시즌) | ${t.newGamePlus} (${pct(t.newGamePlus, t.seasons)}) | |`,
    `| 시즌 | 같은 주에 시작해 규칙 없이 친 시즌(규칙을 끔·첫 시즌 기본 꺼짐·옛 화면, 이야기 모드 제외) | ${t.turnedDown} (${pct(t.turnedDown, t.seasons + t.turnedDown)}) | |`,
    `| 시즌 | 서로 다른 기기: 규칙 켬 / 규칙 없음 / 모두 | ${t.devicesOn} / ${t.devicesOff} / ${t.devices} | |`,
    `| 시즌 | 끝난 시즌 / 이 주 랭킹에 오른 시즌 | ${t.finished} / ${t.ranked} | |`,
    `| 감사 | 판정한 사건 닫힘 / 적발 | ${t.judged} / ${t.caught} (${pct(t.caught, t.judged)}) | |`,
    `| 감사 | 시즌당 적발 / 적발이 있었던 시즌 | ${per(t.caught, t.seasons)} / ${t.caughtSeasons} (${pct(t.caughtSeasons, t.seasons)}) | ${SIM.caught} / ${SIM.caughtShare} (${SIM_NOTE}) |`,
    `| 감사 | 금고로 갈 몫의 잃은 비율(추정) | ${pct(t.vaultLost, t.vaultMoved)} | ${SIM.vaultLost} |`,
    `| 감사 | 벌 전 알아챔: ${AUDIT_LIMIT - 1}/${AUDIT_LIMIT}에 닿은 사건 중 적발 없이 닫은 비율 | ${pct(t.nearLimitClear, t.nearLimit)} (${t.nearLimitClear}/${t.nearLimit}) | |`,
    `| 연쇄 | 판 / CASCADE 판 비율 | ${t.boards} / ${pct(t.cascadeBoards, t.boards)} | |`,
    `| 연쇄 | CASCADE 판 BUST (모든 판) | ${pct(t.cascadeBusts, t.cascadeBoards)} (${pct(t.busts, t.boards)}) | ${SIM.cascadeBust} (${SIM.bust}) |`,
    `| 연쇄 | 시즌당 만듦 / 돌아옴 | ${per(t.made, t.seasons)} / ${per(t.cascadeBoards, t.seasons)} | ${SIM.made} / ${SIM.back} |`,
    `| 연쇄 | 벌 전 알아챔: 확정한 열기 평균, CASCADE 판 / 다른 판 | ${meanHeat(t.cascadeCashHeat, t.cascadeCashes)} / ${meanHeat(t.plainCashHeat, t.plainCashes)} | |`,
    `| 결말 | 붕괴 결말 | ${pct(t.collapse, t.endings)} (${t.collapse}/${t.endings}) | ${SIM.collapse} |`,
    "",
    `시뮬레이션 값은 감사·연쇄를 함께 켠 시즌 봇입니다(AUDIT_WEEK=1 CASCADE_WEEK=1 check:endings, 값 B·면제·이월 상한 1·칩 마진 10, ${SIM.seasons}시즌${process.env.TEST_WEEK_SIM ? "" : ", 10-21 #223과 10-25 main c8841dc0에서 같은 값"}). 봇은 읽기 시계를 쓰지 않으니 BUST는 차로 봅니다. 사람이 두 장치를 함께 켠 판을 치는 것은 이 주가 처음입니다.`,
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
