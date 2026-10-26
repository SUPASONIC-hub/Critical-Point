/**
 * Players over time and where seasons stop, read off the live database
 * (.github/workflows/funnel.yml, every day).
 *
 * E-4(a) of the 2026-10-22 review (재미·몰입 분석 3-6): the drop-off points
 * every other item there is judged by were guesses. This reads the case rows of
 * `playtest_sessions` once a day and prints, as Markdown tables for the run's
 * Job Summary:
 *
 *   - players over time (readTraffic): for the last 14 KST days and 8 weeks,
 *     devices new and active, runs begun, runs past 프롤로그 05, seasons
 *     finished -- the web-first roadmap's traffic signal (2026-10-26);
 *   - the last case each run sent (프롤로그 01-05, 사건 01·08·18·36, 피날레),
 *     as a funnel and as where runs stopped;
 *   - the gaps between a run's rows, and the breaks among them (how long a
 *     player stays away before coming back), median and P90;
 *   - how many days a finished season took (its season-final row less its
 *     first case row);
 *   - how many finished seasons were followed by a new run on the same device;
 *   - the funnel of runs a row marks as NEW GAME+ (`summary.newGamePlus`, the
 *     mark NEWGAMEPLUS-이어받기-설계안 3절 5 plans), or 「아직 없음」 while no
 *     row carries it.
 *
 * Aggregates only: no run id, session, nickname or row leaves this script. The
 * query itself sends neither id out of the database, only a device's rank, and
 * the workflow writes what it fetched to a file it never prints.
 *
 *   node scripts/report-funnel.mjs --sql            the one SELECT the workflow sends
 *   node scripts/report-funnel.mjs <rows.json>      the summary, from what it got back
 *
 * FUNNEL_SINCE (YYYY-MM-DD, KST midnight) keeps the runs whose first row came
 * on or after that day; unset, every run with a run id is read.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { CASE_SEQUENCE } from "../src/gameCases.js";

const SINCE = process.env.FUNNEL_SINCE || "";
if (SINCE && !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(SINCE)) throw new Error(`FUNNEL_SINCE=${SINCE} is not a date`);

/** A gap between two rows of a run this long or longer is a break: the player left and came back. */
const BREAK_SECONDS = 60 * 60;
/** A run whose last row is older than this, and that has not finished, has stopped. */
const STALE_SECONDS = 7 * 24 * 60 * 60;
/** The cases the funnel names. */
export const MILESTONES = ["prologue01", "prologue02", "prologue03", "prologue04", "prologue05", "case01", "case08", "case18", "case36", "final"];
/** Where a run stopped, by the last case it sent: each prologue, then stretches of the season. */
export const STOPS = [
  ["프롤로그 01", "prologue01", "prologue01"],
  ["프롤로그 02", "prologue02", "prologue02"],
  ["프롤로그 03", "prologue03", "prologue03"],
  ["프롤로그 04", "prologue04", "prologue04"],
  ["프롤로그 05", "prologue05", "prologue05"],
  ["사건 01–07", "case01", "case07"],
  ["사건 08–17", "case08", "case17"],
  ["사건 18–35", "case18", "case35"],
  ["사건 36–49", "case36", "case49"],
  ["피날레", "final", "final"],
];

const FINAL_INDEX = CASE_SEQUENCE.indexOf("final");
const indexOf = (caseId) => CASE_SEQUENCE.indexOf(caseId);

/**
 * One read-only statement: a row per run, with its device's rank among the
 * runs read, whether any of its rows names NEW GAME+ (and as what), and its
 * case ids and arrival times in order. Neither the run id nor the session id
 * is selected out; a device is the smallest session id among a run's rows.
 */
export function funnelQuery(since = SINCE) {
  const window = since ? `\n  having min(s.completed_at) >= '${since}T00:00:00+09:00'::timestamptz` : "";
  return `with runs as (
  select s.run_id,
         min(s.session_id) as session_id,
         min(s.completed_at) as began,
         coalesce(bool_or(s.summary->'newGamePlus' is not null), false) as marked,
         coalesce(bool_or(s.summary->>'newGamePlus' = 'true'), false) as new_game_plus,
         jsonb_agg(jsonb_build_array(s.case_id, extract(epoch from s.completed_at)) order by s.completed_at, s.id) as cases
    from public.playtest_sessions s
   where s.run_id is not null
   group by s.run_id${window}
)
select dense_rank() over (order by r.session_id) as device, r.marked, r.new_game_plus, r.cases
  from runs r
 order by device, r.began`;
}

export const QUERY = funnelQuery();

/** The q-quantile of numbers (nearest rank), or null for none. */
export function quantile(values, q) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1))];
}

// The CLI's JSON may give a boolean column as a boolean or as Postgres's text.
const yes = (value) => value === true || value === "true" || value === "t";

/** One run, from a query row: its cases in order, the last it reached and when it finished. */
export function readRun(row) {
  const listed = typeof row.cases === "string" ? JSON.parse(row.cases) : row.cases;
  const cases = (Array.isArray(listed) ? listed : [])
    .filter((entry) => Array.isArray(entry) && typeof entry[0] === "string" && Number.isFinite(Number(entry[1])))
    .map(([caseId, at]) => ({ caseId, at: Number(at) }))
    .sort((a, b) => a.at - b.at);
  const plays = cases.filter((entry) => indexOf(entry.caseId) >= 0);
  const finalRow = cases.find((entry) => entry.caseId === "season-final");
  const reached = plays.reduce((most, entry) => Math.max(most, indexOf(entry.caseId)), -1);
  const gaps = plays.slice(1).map((entry, index) => entry.at - plays[index].at);
  return {
    device: row.device,
    marked: yes(row.marked),
    newGamePlus: yes(row.new_game_plus),
    reached,
    firstAt: plays[0]?.at ?? null,
    lastAt: plays.at(-1)?.at ?? null,
    finishedAt: finalRow?.at ?? null,
    times: plays.map((entry) => entry.at),
    gaps,
  };
}

const funnelOf = (runs) => {
  const counted = runs.filter((run) => run.reached >= 0);
  return {
    runs: counted.length,
    reach: MILESTONES.map((caseId) => counted.filter((run) => run.reached >= indexOf(caseId)).length),
    stops: STOPS.map(([, from, to]) => {
      const inStretch = counted.filter((run) => run.reached >= indexOf(from) && run.reached <= indexOf(to));
      return { all: inStretch.length, stale: inStretch.filter((run) => run.stale).length };
    }),
  };
};

/** The funnel's numbers, from the rows the query returned. `now` is seconds since the epoch. */
export function readFunnel(rows, now = Date.now() / 1000) {
  const runs = rows.map(readRun).filter((run) => run.firstAt !== null || run.finishedAt !== null);
  for (const run of runs) run.stale = run.reached !== FINAL_INDEX && run.lastAt !== null && now - run.lastAt > STALE_SECONDS;
  const gaps = runs.flatMap((run) => run.gaps);
  const breaks = gaps.filter((gap) => gap >= BREAK_SECONDS);
  const finished = runs.filter((run) => run.finishedAt !== null);
  const seasonDays = finished.filter((run) => run.firstAt !== null).map((run) => (run.finishedAt - run.firstAt) / 86400);
  const byDevice = new Map();
  for (const run of runs) {
    if (!byDevice.has(run.device)) byDevice.set(run.device, []);
    byDevice.get(run.device).push(run);
  }
  const restarted = finished.filter((run) =>
    byDevice.get(run.device).some((other) => other !== run && other.firstAt !== null && other.firstAt > run.finishedAt)).length;
  const marked = runs.filter((run) => run.marked);
  return {
    ...funnelOf(runs),
    devices: byDevice.size,
    gaps: gaps.length,
    gapMedian: quantile(gaps, 0.5),
    gapP90: quantile(gaps, 0.9),
    breaks: breaks.length,
    breakMedian: quantile(breaks, 0.5),
    breakP90: quantile(breaks, 0.9),
    runsWithBreak: runs.filter((run) => run.gaps.some((gap) => gap >= BREAK_SECONDS)).length,
    finished: finished.length,
    seasonDaysMedian: quantile(seasonDays, 0.5),
    seasonDaysP90: quantile(seasonDays, 0.9),
    restarted,
    markedRuns: marked.length,
    newGamePlus: funnelOf(marked.filter((run) => run.newGamePlus)),
  };
}

/** Days and weeks the traffic tables show, newest first. */
export const TRAFFIC_DAYS = 14;
export const TRAFFIC_WEEKS = 8;

const KST = 9 * 3600;
/** The KST calendar day of a time in seconds, as YYYY-MM-DD. */
export const kstDay = (seconds) => new Date((seconds + KST) * 1000).toISOString().slice(0, 10);
/** The KST Monday that starts the week of a time in seconds, as YYYY-MM-DD. */
export function kstWeek(seconds) {
  const day = new Date((seconds + KST) * 1000);
  const back = (day.getUTCDay() + 6) % 7;
  return new Date(day.getTime() - back * 86400 * 1000).toISOString().slice(0, 10);
}

/**
 * Players over time, from the same rows: for each of the last TRAFFIC_DAYS KST
 * days and TRAFFIC_WEEKS weeks, the devices seen for the first time, the
 * devices that played at all, the runs begun, those of them that got past
 * 프롤로그 05, and the seasons finished. Counts only.
 */
export function readTraffic(rows, now = Date.now() / 1000) {
  const runs = rows.map(readRun).filter((run) => run.firstAt !== null || run.finishedAt !== null);
  const firstSeen = new Map();
  for (const run of runs) {
    const at = run.firstAt ?? run.finishedAt;
    if (!firstSeen.has(run.device) || at < firstSeen.get(run.device)) firstSeen.set(run.device, at);
  }
  const lastPrologue = indexOf("prologue05");
  const table = (keyOf, keys) => {
    const by = new Map(keys.map((key) => [key, { newDevices: 0, active: new Set(), began: 0, pastPrologue: 0, finished: 0 }]));
    const cell = (seconds) => by.get(keyOf(seconds));
    for (const seen of firstSeen.values()) if (cell(seen)) cell(seen).newDevices += 1;
    for (const run of runs) {
      for (const time of run.times) cell(time)?.active.add(run.device);
      if (run.firstAt !== null && cell(run.firstAt)) {
        cell(run.firstAt).began += 1;
        if (run.reached > lastPrologue) cell(run.firstAt).pastPrologue += 1;
      }
      if (run.finishedAt !== null && cell(run.finishedAt)) {
        cell(run.finishedAt).active.add(run.device);
        cell(run.finishedAt).finished += 1;
      }
    }
    return keys.map((key) => ({ key, ...by.get(key), active: by.get(key).active.size }));
  };
  const dayKeys = Array.from({ length: TRAFFIC_DAYS }, (_, index) => kstDay(now - index * 86400));
  const weekKeys = Array.from({ length: TRAFFIC_WEEKS }, (_, index) => kstWeek(now - index * 7 * 86400));
  return { days: table(kstDay, dayKeys), weeks: table(kstWeek, weekKeys), devices: firstSeen.size };
}

/** The traffic tables for the Job Summary. */
export function describeTraffic(t) {
  const head = (when) => [`| ${when} | 새 기기 | 플레이한 기기 | 시작한 런 | 그중 프롤로그를 넘긴 런 | 끝낸 시즌 |`, "|---|---|---|---|---|---|"];
  const row = (r) => `| ${r.key} | ${r.newDevices} | ${r.active} | ${r.began} | ${r.pastPrologue} | ${r.finished} |`;
  return [
    "## 플레이어 추이",
    "",
    `게임을 시작한 기기만 셉니다(첫 화면만 보고 떠난 방문은 서버에 오지 않고, 데이터 수집을 끈 기기도 빠집니다). 날짜는 KST, 주는 월요일 시작. 지금까지 서로 다른 기기 ${t.devices}대.`,
    "",
    `### 최근 ${TRAFFIC_DAYS}일`,
    "",
    ...head("날짜"),
    ...t.days.map(row),
    "",
    `### 최근 ${TRAFFIC_WEEKS}주`,
    "",
    ...head("주(월요일)"),
    ...t.weeks.map(row),
  ].join("\n");
}

const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");

/** A length of time in the unit a reader takes in at a glance. */
export function duration(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 3600) return `${Math.round(seconds / 60)}분`;
  if (seconds < 48 * 3600) return `${(seconds / 3600).toFixed(1)}시간`;
  return `${(seconds / 86400).toFixed(1)}일`;
}

const days = (value) => (value === null ? "—" : `${value.toFixed(1)}일`);
const label = (caseId) => (caseId === "final" ? "피날레" : caseId.replace(/^prologue/, "프롤로그 ").replace(/^case/, "사건 "));

export function describeFunnel(f, { since = SINCE, at = new Date() } = {}) {
  const lines = [
    "## 이탈 지점",
    "",
    `${at.toISOString().slice(0, 16).replace("T", " ")} UTC에 운영 DB를 읽기만 하고 집계했습니다. 개별 런·기기·이름은 싣지 않습니다.`,
    `대상: ${since ? `${since}(KST) 이후 첫 행을 보낸` : "run id가 있는"} 런 ${f.runs}개, 서로 다른 기기 ${f.devices}대.`,
    "",
    "**한계.** 데이터 수집에 동의한 기기의 행만 서버에 옵니다. 동의하지 않은 플레이어의 이탈은 여기 없고, 동의를 도중에 끈 런은 그 자리에서 멈춘 것처럼 보입니다. 기기는 세션 id로 셉니다(저장을 지우거나 다른 브라우저로 오면 새 기기).",
    "",
    "### 어디까지 왔나",
    "",
    "| 사건 | 도달한 런 | 비율 |",
    "|---|---|---|",
    ...MILESTONES.map((caseId, index) => `| ${label(caseId)} | ${f.reach[index]} | ${pct(f.reach[index], f.runs)} |`),
    "",
    `### 어디서 멈췄나 (마지막으로 보낸 사건, 피날레 전 런 중 마지막 행이 ${STALE_SECONDS / 86400}일 넘은 런은 멈춘 런)`,
    "",
    "| 마지막 사건 | 런 | 비율 | 그중 멈춘 런 |",
    "|---|---|---|---|",
    ...STOPS.map(([name], index) => `| ${name} | ${f.stops[index].all} | ${pct(f.stops[index].all, f.runs)} | ${name === "피날레" ? "—" : f.stops[index].stale} |`),
    "",
    "### 쉬고 돌아오기",
    "",
    "| 지표 | 값 |",
    "|---|---|",
    `| 같은 런의 행 사이 간격: 개수 / 중앙값 / P90 | ${f.gaps} / ${duration(f.gapMedian)} / ${duration(f.gapP90)} |`,
    `| 쉼(${BREAK_SECONDS / 3600}시간 넘는 간격): 개수 / 중앙값 / P90 | ${f.breaks} / ${duration(f.breakMedian)} / ${duration(f.breakP90)} |`,
    `| 쉼이 한 번이라도 있었던 런 | ${f.runsWithBreak} (${pct(f.runsWithBreak, f.runs)}) |`,
    "",
    "### 완주와 그 뒤",
    "",
    "| 지표 | 값 |",
    "|---|---|",
    `| 시즌을 끝낸 런(season-final) | ${f.finished} (${pct(f.finished, f.runs)}) |`,
    `| 완주에 걸린 날(첫 사건 행 → season-final): 중앙값 / P90 | ${days(f.seasonDaysMedian)} / ${days(f.seasonDaysP90)} |`,
    `| 끝낸 뒤 같은 기기에서 새 런을 연 비율 | ${pct(f.restarted, f.finished)} (${f.restarted}/${f.finished}) |`,
    "",
    "### NEW GAME+",
    "",
  ];
  if (f.markedRuns === 0) {
    lines.push("아직 없음: 사건 행 `summary`에 `newGamePlus` 표시가 실린 행이 없습니다(NEW GAME+ 이어받기 설계안 3절 5의 표시가 들어가면 여기 퍼널이 나옵니다).");
  } else {
    const n = f.newGamePlus;
    lines.push(
      `표시가 실린 런 ${f.markedRuns}개, 그중 \`newGamePlus: true\` 런 ${n.runs}개.`,
      "",
      "| 사건 | 도달한 런 | 비율 |",
      "|---|---|---|",
      ...MILESTONES.map((caseId, index) => `| ${label(caseId)} | ${n.reach[index]} | ${pct(n.reach[index], n.runs)} |`),
    );
  }
  return lines.join("\n");
}

const [arg] = import.meta.url === pathToFileURL(process.argv[1] ?? "").href ? process.argv.slice(2) : [];
if (arg === "--sql") {
  process.stdout.write(`${QUERY}\n`);
} else if (arg) {
  const parsed = JSON.parse(readFileSync(arg, "utf8"));
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.rows) ? parsed.rows : null;
  if (!rows) throw new Error(`${arg} holds no rows`);
  process.stdout.write(`${describeTraffic(readTraffic(rows))}\n\n${describeFunnel(readFunnel(rows))}\n`);
}
