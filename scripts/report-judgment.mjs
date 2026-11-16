/**
 * The 11-23 verdict on the W47 test week (2026-W47, 11-16 to 11-22), in one
 * Markdown report: the three questions the analysis docs leave to W47 data.
 *
 *   (a) C2  the players' endings next to the bot's (the test-week summary's reference, SIMULATION_LINES);
 *   (b) Q23 the season score's spread and the ranks the current letters
 *           (scoreMarks, seasonScore.js) give it, beside the 2026-10-22
 *           proposal's season bands for reference;
 *   (c) B-3(1) where runs that began in the week stopped in the prologue, read
 *           through report-funnel.mjs's own `readFunnel` (cold-opening switch).
 *
 * Read only and aggregates only, like report-test-week.mjs and
 * report-funnel.mjs: no run id, session or name leaves this script.
 *
 *   node scripts/report-judgment.mjs --sql                 the seasons SELECT
 *   node scripts/report-judgment.mjs --sql-funnel          the funnel SELECT (report-funnel's, from the week's Monday)
 *   node scripts/report-judgment.mjs --from <file.json>    the report; the file is
 *        { "seasons": [rows of --sql], "funnel": [rows of --sql-funnel] } or the seasons rows alone
 *   node scripts/report-judgment.mjs --from <seasons.json> --funnel <funnel.json>
 *   node scripts/report-judgment.mjs --sql-gaps            the decision-T SELECT (d): one row per season
 *        with its case rows' mean closing cash/harm, looks (B1) and draft spend (C9); the file's `gaps`
 *        or --gaps <file.json>
 *
 * --week <YYYY-Www> (or TEST_WEEK, default 2026-W47) and --board <rule|all>
 * (or TEST_WEEK_RULE, default audit-cascade: the seasons that took the week's
 * rule; `all` reads every season of the week but story mode).
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { COLD_OPENING_ENABLED } from "../src/coldOpeningSwitch.js";
import { getWeekRule } from "../src/gauntlet/weeklyRules.js";
import { initialResources } from "../src/gameConstants.js";
import { scoreMarks } from "../src/seasonScore.js";
import { SEASON_STANDING_MARKS } from "../src/seasonStanding.js";
import { HELD_LINE_CAPITAL_SHARE } from "../src/viewModels/reportViewModels.js";
import { funnelQuery, quantile, readFunnel, readRun, STOPS } from "./report-funnel.mjs";
import { SIMULATION_LINES } from "./report-test-week.mjs";

/**
 * The bot's endings (percent) from the ending line of the test-week summary's
 * own reference (SIMULATION_LINES, report-test-week.mjs), so the two reports
 * never disagree: 2026-11-09 this still held the #464 numbers (collapse 20)
 * while #473 had moved the summary to the 11-06 measurement (collapse 23.0).
 */
export function botEndings(lines = SIMULATION_LINES) {
  const list = /replayed seasons: ([^)]*)\)/.exec(String(lines))?.[1];
  if (!list) throw new Error("the bot's ending line has no endings (check:endings --report)");
  return Object.fromEntries(list.split(", ").map((part) => {
    const [, id, percent] = /^([a-z-]+) ([\d.]+)%$/.exec(part.trim()) ?? [];
    if (!id) throw new Error(`unreadable ending in the bot's line: ${part}`);
    return [id, Number(percent)];
  }));
}
export const BOT_ENDINGS = botEndings();
/** The season bands the 2026-10-22 proposal (랭크기준-제안) measured on the bot: S 72+, A 66+, B 56+. Reference only. */
export const PROPOSED_BANDS = { S: 72, A: 66, B: 56 };
const RANKS = ["S", "A", "B", "C"];

export function checkArgs(week, board) {
  if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(week)) throw new Error(`week ${week} is not a week key`);
  if (board !== "all" && (!/^[a-z][a-z0-9-]{0,31}$/.test(board) || !getWeekRule(board))) throw new Error(`board ${board} is not a rule of the catalogue or "all"`);
}

/** The Monday (KST) an ISO week key starts on, as YYYY-MM-DD. */
export function weekMonday(week) {
  const [year, num] = week.split("-W").map(Number);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000 + (num - 1) * 7 * 86400000);
  return monday.toISOString().slice(0, 10);
}

/** One read-only statement: each finished season of the week on the board, its ending, score and rank. */
export function judgmentQuery(week, board) {
  checkArgs(week, board);
  const rule = board === "all" ? "" : `\n   and exists (select 1 from public.playtest_sessions r where r.run_id = f.run_id and r.dynamics->>'weekRule' = '${board}')`;
  return `select coalesce(f.summary->'endingVariant'->>'id', f.summary->>'endingVariant') as ending,
       coalesce(f.summary->>'burstScore', f.summary->>'momentumScore') as score,
       f.summary->>'rank' as rank,
       f.summary->>'newGamePlus' = 'true' as new_game_plus
  from public.playtest_sessions f
 where f.case_id = 'season-final'
   and f.run_id is not null
   and public.kst_iso_week(f.completed_at) = '${week}'
   and not exists (select 1 from public.playtest_sessions st where st.run_id = f.run_id and st.decision_log @> '[{"assistStory": true}]'::jsonb)${rule}`;
}

/**
 * (d) The three 11-23 numbers decision T's draft (2026-11-12) found no report
 * for, from what the case rows already carry: T3 the season's mean closing
 * cash and harm (`resources.capital` / `resources.humanCost` of its case rows,
 * the held line's own reading, HELD_LINE_CAPITAL_SHARE), T6 the looks spent
 * (`decision_log[].threshold.scouted`, B1) per window, T11 the KD account money
 * paid at drafts (`decision_log[].relicDraft.cost`, as chainRecheck.js's
 * draftSpend sums it, with its reroll / extra). One row per season of
 * judgmentQuery, no run id. `*_recorded` counts entries that carry the key, so
 * older rows without it read 「기록 없음」, not zero. `standing` is the season
 * row's own `seasonStanding` (seasonStanding.js's readSeasonStandingMark:
 * held / clear / near / over), null on a row from before it.
 */
export function gapsQuery(week, board) {
  const seasons = judgmentQuery(week, board).replace(/^select [\s\S]*?\n {2}from public\.playtest_sessions f/, "select f.run_id, coalesce(f.summary->'endingVariant'->>'id', f.summary->>'endingVariant') as ending,\n       f.summary->>'seasonStanding' as standing\n  from public.playtest_sessions f");
  return `with seasons as (
${seasons}
)
select s.ending,
       s.standing,
       count(c.*) as cases,
       avg((c.resources->>'capital')::numeric) as mean_capital,
       avg((c.resources->>'humanCost')::numeric) as mean_human_cost,
       coalesce(sum(x.windows), 0) as windows,
       coalesce(sum(x.scout_recorded), 0) as scout_recorded,
       coalesce(sum(x.scouts), 0) as scouts,
       coalesce(sum(x.drafts), 0) as drafts,
       coalesce(sum(x.spent), 0) as spent,
       coalesce(sum(x.rerolls), 0) as rerolls,
       coalesce(sum(x.extras), 0) as extras
  from seasons s
  join public.playtest_sessions c on c.run_id = s.run_id and c.case_id <> 'season-final'
  cross join lateral (
    select count(*) filter (where e ? 'threshold') as windows,
           count(*) filter (where e->'threshold' ? 'scouted') as scout_recorded,
           count(*) filter (where e->'threshold'->>'scouted' = 'true') as scouts,
           count(*) filter (where jsonb_typeof(e->'relicDraft') = 'object') as drafts,
           coalesce(sum(greatest(0, coalesce((e->'relicDraft'->>'cost')::numeric, 0))), 0) as spent,
           count(*) filter (where jsonb_typeof(e->'relicDraft'->'reroll') = 'object') as rerolls,
           count(*) filter (where e->'relicDraft'->>'extra' = 'true') as extras
      from jsonb_array_elements(case when jsonb_typeof(c.decision_log) = 'array' then c.decision_log else '[]'::jsonb end) e
  ) x
 group by s.run_id, s.ending, s.standing`;
}

const num = (value) => (value === null || value === undefined || value === "" ? NaN : Number(value));

const STANDINGS = new Set(SEASON_STANDING_MARKS);

/**
 * (d)'s numbers from gapsQuery's rows. A count is null (「기록 없음」) when no row carried its key.
 *
 * T3's held seasons (cash lost, people kept: the held sentence) are counted
 * from the row's `standing` where it has one (`heldRecorded`), and for an older
 * row approximated as before -- under the line and not ending in collapse
 * (`heldApprox`, of `unrecorded` rows). `held` is the two together.
 */
export function readGaps(rows) {
  const line = initialResources.capital * HELD_LINE_CAPITAL_SHARE;
  const withCash = rows.filter((row) => Number.isFinite(num(row.mean_capital)));
  const capitals = withCash.map((row) => num(row.mean_capital));
  const harms = rows.map((row) => num(row.mean_human_cost)).filter(Number.isFinite);
  const under = withCash.filter((row) => num(row.mean_capital) < line);
  const recorded = rows.filter((row) => STANDINGS.has(row.standing));
  const heldRecorded = recorded.filter((row) => row.standing === "held").length;
  const heldApprox = under.filter((row) => !STANDINGS.has(row.standing) && row.ending !== "collapse").length;
  const standings = Object.fromEntries(SEASON_STANDING_MARKS.map((mark) => [mark, recorded.filter((row) => row.standing === mark).length]));
  const sum = (key) => rows.reduce((total, row) => total + (num(row[key]) || 0), 0);
  const scoutRecorded = sum("scout_recorded") > 0;
  const draftRecorded = sum("drafts") > 0;
  const quartiles = (values) => (values.length ? { p10: quantile(values, 0.1), p50: quantile(values, 0.5), p90: quantile(values, 0.9) } : null);
  return {
    seasons: rows.length,
    line,
    cash: withCash.length ? { n: withCash.length, ...quartiles(capitals), under: under.length, underNotCollapse: under.filter((row) => row.ending !== "collapse").length } : null,
    held: { held: heldRecorded + heldApprox, heldRecorded, heldApprox, recorded: recorded.length, unrecorded: rows.length - recorded.length, standings },
    harm: harms.length ? { n: harms.length, ...quartiles(harms) } : null,
    scout: scoutRecorded
      ? { windows: sum("windows"), scouts: sum("scouts"), seasonsUsing: rows.filter((row) => num(row.scouts) > 0).length, perSeason: quartiles(rows.map((row) => num(row.scouts) || 0)) }
      : null,
    spend: draftRecorded
      ? { drafts: sum("drafts"), spent: sum("spent"), rerolls: sum("rerolls"), extras: sum("extras"), seasonsSpending: rows.filter((row) => num(row.spent) > 0).length }
      : null,
  };
}

const NONE = "기록 없음";

export function describeGaps(g) {
  if (!g) return ["## (d) 결정 T 보고서 빈칸 (T3 · T6 · T11)", "", "빈칸 행이 없습니다(--gaps 또는 파일의 `gaps`, `--sql-gaps`)."];
  const fmt = (q) => [q.p10, q.p50, q.p90].map((v) => (v === null ? "—" : Number(v).toFixed(1))).join(" / ");
  return [
    "## (d) 결정 T 보고서 빈칸 (T3 · T6 · T11)",
    "",
    `시즌 ${g.seasons}개. 사건 행의 마감 자원과 decision_log에서 셉니다.`,
    "",
    g.cash
      ? `- T3 「돈을 잃음」 선 ${g.line}: 시즌 평균 마감 돈 p10 / p50 / p90 = ${fmt(g.cash)}; ${g.line} 밑 ${g.cash.under}/${g.cash.n} (${pct(g.cash.under, g.cash.n)}), 그중 붕괴 결말 아님 ${g.cash.underNotCollapse}`
      : `- T3 「돈을 잃음」 선 ${g.line}: ${NONE}`,
    g.held.recorded > 0
      ? `- T3 held(돈 잃고 사람 지킴): ${g.held.held}/${g.seasons} (${pct(g.held.held, g.seasons)}) = 행 기록 ${g.held.heldRecorded}/${g.held.recorded}${g.held.unrecorded > 0 ? ` + 기록 전 행 근사 ${g.held.heldApprox}/${g.held.unrecorded}` : ""}; 기록된 standing ${SEASON_STANDING_MARKS.map((mark) => `${mark} ${g.held.standings[mark]}`).join(" · ")}`
      : `- T3 held: standing을 실은 행이 아직 없음 — 위 「붕괴 결말 아님」 근사 ${g.held.heldApprox}`,
    g.harm ? `- T3 사람 피해(humanCost) 시즌 평균 p10 / p50 / p90 = ${fmt(g.harm)}` : `- T3 사람 피해: ${NONE}`,
    g.scout
      ? `- T6 조회(믿음) 사용: 판 ${g.scout.windows}개 중 ${g.scout.scouts} (${pct(g.scout.scouts, g.scout.windows)}); 한 번이라도 쓴 시즌 ${g.scout.seasonsUsing}/${g.seasons} (${pct(g.scout.seasonsUsing, g.seasons)}); 시즌당 p10 / p50 / p90 = ${fmt(g.scout.perSeason)}`
      : `- T6 조회(믿음) 사용: ${NONE}`,
    g.spend
      ? `- T11 KD 계좌 돈 쓰기: 쓴 시즌 ${g.spend.seasonsSpending}/${g.seasons} (${pct(g.spend.seasonsSpending, g.seasons)}); 합계 ${g.spend.spent}; 드래프트 ${g.spend.drafts}개 중 다시 뽑기 ${g.spend.rerolls} · 하나 더 ${g.spend.extras}`
      : `- T11 KD 계좌 돈 쓰기: ${NONE}`,
  ];
}

const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");
const yes = (value) => value === true || value === "true" || value === "t";
const proposedRank = (s) => (s >= PROPOSED_BANDS.S ? "S" : s >= PROPOSED_BANDS.A ? "A" : s >= PROPOSED_BANDS.B ? "B" : "C");

/** The numbers of the report, from the rows. Funnel rows count only runs whose first case row came in the week. */
export function readJudgment(seasons, funnelRows, week) {
  const endings = {};
  for (const row of seasons) {
    const id = typeof row.ending === "string" && row.ending ? row.ending : "(없음)";
    endings[id] = (endings[id] ?? 0) + 1;
  }
  const scores = seasons.map((row) => (row.score === null || row.score === "" ? NaN : Number(row.score))).filter(Number.isFinite);
  const count = (letterOf) => Object.fromEntries(RANKS.map((r) => [r, scores.filter((s) => letterOf(s) === r).length]));
  const histogram = {};
  for (const s of scores) {
    const bin = Math.floor(s / 10) * 10;
    histogram[bin] = (histogram[bin] ?? 0) + 1;
  }
  let funnel = null;
  if (funnelRows) {
    const from = Date.parse(`${weekMonday(week)}T00:00:00+09:00`) / 1000;
    const to = from + 7 * 86400;
    const inWeek = funnelRows.filter((row) => {
      const at = readRun(row).firstAt;
      return at !== null && at >= from && at < to;
    });
    funnel = readFunnel(inWeek, to + 7 * 86400);
  }
  return {
    seasons: seasons.length,
    newGamePlus: seasons.filter((row) => yes(row.new_game_plus)).length,
    endings,
    scores: { n: scores.length, p10: quantile(scores, 0.1), p50: quantile(scores, 0.5), p90: quantile(scores, 0.9), max: scores.length ? Math.max(...scores) : null },
    histogram,
    current: count((s) => scoreMarks(s).rank),
    recorded: Object.fromEntries(RANKS.map((r) => [r, seasons.filter((row) => row.rank === r).length])),
    proposed: count(proposedRank),
    funnel,
  };
}

export function describeJudgment(j, { week, board }, gaps) {
  const ids = [...new Set([...Object.keys(BOT_ENDINGS), ...Object.keys(j.endings)])];
  const lines = [
    `# ${week} 판정 보고 (보드: ${board})`,
    "",
    `끝낸 시즌 ${j.seasons}개(그중 NEW GAME+ ${j.newGamePlus}개, 이야기 모드 제외). 집계만 싣습니다.`,
    "",
    "## (a) C2 결말 분포: 사람 대 봇",
    "",
    "| 결말 | 시즌 | 사람 % | 봇 % (시험 주 요약과 같은 기준) | 차이 %p |",
    "|---|---|---|---|---|",
    ...ids.map((id) => {
      const n = j.endings[id] ?? 0;
      const bot = BOT_ENDINGS[id];
      const diff = !j.seasons || bot === undefined ? "—" : (((n / j.seasons) * 100 - bot) >= 0 ? "+" : "") + ((n / j.seasons) * 100 - bot).toFixed(1);
      return `| ${id} | ${n} | ${pct(n, j.seasons)} | ${bot === undefined ? "—" : `${bot}%`} | ${diff} |`;
    }),
    "",
    "## (b) Q23 시즌 점수와 랭크",
    "",
    `점수 ${j.scores.n}개: p10 / p50 / p90 / 최대 = ${[j.scores.p10, j.scores.p50, j.scores.p90, j.scores.max].map((v) => v ?? "—").join(" / ")}`,
    "",
    "| 점수대 | 시즌 |",
    "|---|---|",
    ...Object.keys(j.histogram).map(Number).sort((a, b) => a - b).map((bin) => `| ${bin}–${bin + 9} | ${j.histogram[bin]} |`),
    "",
    "| 랭크 | 현재 기준(88/72/52) | 행에 기록된 랭크 | 제안 기준(72/66/56, 참고) |",
    "|---|---|---|---|",
    ...RANKS.map((r) => `| ${r} | ${j.current[r]} (${pct(j.current[r], j.scores.n)}) | ${j.recorded[r]} (${pct(j.recorded[r], j.seasons)}) | ${j.proposed[r]} (${pct(j.proposed[r], j.scores.n)}) |`),
    "",
    "## (c) B-3(1) 프롤로그 이탈 (콜드 오프닝 스위치)",
    "",
    `스위치 지금: \`COLD_OPENING_ENABLED = ${COLD_OPENING_ENABLED}\` (src/coldOpeningSwitch.js, 2026-11-10부터 켬). 켜져 있으면 첫 기기의 런은 네 장을 지난 뒤에 시작하므로, 네 장에서 떠난 사람은 이 런 수에 없습니다.`,
    "",
  ];
  const f = j.funnel;
  if (!f) {
    lines.push("퍼널 행이 없습니다(--funnel 또는 파일의 `funnel`).");
  } else {
    lines.push(
      `이 주에 시작한 런 ${f.runs}개(report-funnel.mjs의 readFunnel). 프롤로그 05를 넘긴 런 ${f.reach[5]} (${pct(f.reach[5], f.runs)}).`,
      "",
      "| 마지막 사건 | 런 | 비율 |",
      "|---|---|---|",
      ...STOPS.slice(0, 6).map(([name], index) => `| ${name} | ${f.stops[index].all} | ${pct(f.stops[index].all, f.runs)} |`),
    );
  }
  if (gaps !== undefined) lines.push("", ...describeGaps(gaps));
  return lines.join("\n");
}

function main(argv) {
  const opt = (name) => {
    const at = argv.indexOf(name);
    return at >= 0 ? argv[at + 1] : undefined;
  };
  const week = opt("--week") || process.env.TEST_WEEK || "2026-W47";
  const board = opt("--board") || process.env.TEST_WEEK_RULE || "audit-cascade";
  checkArgs(week, board);
  if (argv.includes("--sql")) return void process.stdout.write(`${judgmentQuery(week, board)}\n`);
  if (argv.includes("--sql-gaps")) return void process.stdout.write(`${gapsQuery(week, board)}
`);
  if (argv.includes("--sql-funnel")) return void process.stdout.write(`${funnelQuery(weekMonday(week))}\n`);
  const file = opt("--from");
  if (!file) throw new Error("usage: report-judgment.mjs --sql | --sql-funnel | --sql-gaps | --from <file.json> [--funnel <file.json>] [--gaps <file.json>] [--week W] [--board B]");
  const rowsOf = (value) => (Array.isArray(value) ? value : Array.isArray(value?.rows) ? value.rows : null);
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  const seasons = rowsOf(parsed) ?? rowsOf(parsed?.seasons);
  if (!seasons) throw new Error(`${file} holds no season rows`);
  const funnelFile = opt("--funnel");
  const funnel = funnelFile ? rowsOf(JSON.parse(readFileSync(funnelFile, "utf8"))) : rowsOf(parsed?.funnel);
  process.stdout.write(`${describeJudgment(readJudgment(seasons, funnel, week), { week, board })}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main(process.argv.slice(2));
