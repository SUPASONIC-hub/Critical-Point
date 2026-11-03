/**
 * How close today comes to the limits that hold for everyone together, read
 * from GitHub Actions (.github/workflows/funnel.yml at 22:10 KST and
 * .github/workflows/board-reports.yml at 09:10 KST). Security review of
 * 2026-11-03, M3.
 *
 * Two limits fail closed for every player at once: new cloud-save codes in a
 * day (`global:cloud-new`, `cloud_daily_new_codes`, 3,000 by default since
 * 20261103000000) and telemetry bytes in a day (`global:telemetry-bytes`,
 * `telemetry_daily_bytes`, 200 MB). Each address has a smaller limit of its
 * own, so these are reached only by many addresses together -- a busy day, or
 * one actor with many addresses. When either is used up, every player's new
 * code or telemetry row is refused until its day is over, and nothing told
 * the owner. This reads both counters and the limit in force, writes them to
 * the Job Summary, and a scheduled run fails at 80% so GitHub's failed-run
 * mail is the alarm.
 *
 * A counter's day starts with the first request after the last one ended
 * (`bump_rate_limit`), so a counter older than a day is the whole of the day
 * that ended: it is shown as such and still counts toward the alarm. The size
 * of the database is shown beside them, for the limit no setting holds
 * (Supabase's free plan stops at 500 MB).
 *
 * This repository is public, and so is every summary: the read takes counts,
 * limits and ages only, never a key of an address, a code or a row.
 *
 *   node scripts/report-budgets.mjs --sql            the one SELECT the runs send
 *   node scripts/report-budgets.mjs <rows.json>      the summary, from what the SELECT got back
 *   node scripts/report-budgets.mjs --near <rows.json>  how many limits are at 80% or more, for the run's exit code
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** The share of a limit that fails a scheduled run. */
export const NEAR = 0.8;
/** The defaults the server uses when `private_settings` names none (put_cloud_save, the telemetry validator). */
export const DEFAULTS = { cloud: 3000, telemetryBytes: 209715200 };
/** Supabase's free plan. Shown, not enforced: no setting holds it. */
export const DATABASE_PLAN_BYTES = 524288000;

export const LABELS = {
  "global:cloud-new": "온라인 저장 새 코드(하루)",
  "global:telemetry-bytes": "텔레메트리 바이트(하루)",
  database: "데이터베이스 크기",
};

/** The two counters and their limits, and the database's size. Counts only. */
export const QUERY = `select k.name,
       coalesce(t.request_count, 0)::bigint as used,
       k.ceiling,
       extract(epoch from (now() - t.window_started_at))::bigint as age_seconds
  from (values
          ('global:cloud-new', public.private_setting_int('cloud_daily_new_codes', ${DEFAULTS.cloud})),
          ('global:telemetry-bytes', public.private_setting_int('telemetry_daily_bytes', ${DEFAULTS.telemetryBytes}))
       ) as k(name, ceiling)
  left join public.telemetry_rate_limits t on t.actor_key = k.name
union all
select 'database', pg_database_size(current_database())::bigint, ${DATABASE_PLAN_BYTES}::bigint, null::bigint;`;

const DAY = 86400;

/** The rows the query returned, each read the same way whatever JSON shape the CLI gave. */
export function readBudgets(rows) {
  return rows.map((row) => {
    const name = String(row.name ?? "");
    const used = Number(row.used) || 0;
    const ceiling = Number(row.ceiling) || 0;
    const age = row.age_seconds === null || row.age_seconds === undefined || row.age_seconds === "" ? null : Number(row.age_seconds);
    const ratio = ceiling > 0 ? used / ceiling : 0;
    return {
      name,
      label: LABELS[name] ?? name,
      used,
      ceiling,
      ratio,
      // A counter nobody has touched since its day ended is that day's total.
      ended: age !== null && age >= DAY,
      ageHours: age === null ? null : Math.floor(age / 3600),
      // The database's size is shown and not alarmed on: the plan is the owner's.
      alarms: name !== "database",
    };
  });
}

/** The limits at 80% or more of their ceiling. */
export const nearLimits = (budgets) => budgets.filter((budget) => budget.alarms && budget.ratio >= NEAR);

const bytes = (value) => (value >= 1048576 ? `${(value / 1048576).toFixed(1)} MB` : `${Math.round(value / 1024)} KB`);
const amount = (budget, value) => (budget.name === "global:cloud-new" ? value.toLocaleString("en-US") : bytes(value));

/** The Job Summary: one row per limit. */
export function describeBudgets(budgets) {
  const near = nearLimits(budgets);
  const lines = ["## 전체 한도", ""];
  lines.push(
    near.length
      ? `**${near.length}개 한도가 ${Math.round(NEAR * 100)}%를 넘었습니다.** 다 쓰면 그날 모든 플레이어의 요청이 거절됩니다. \`private_settings\`에서 값을 올릴 수 있습니다(README 6절).`
      : `${Math.round(NEAR * 100)}%를 넘은 한도는 없습니다.`,
    "",
    "| 한도 | 쓴 양 | 한도 | 비율 | 창 |",
    "|---|---:|---:|---:|---|",
    ...budgets.map((budget) => {
      const window = budget.ageHours === null ? (budget.name === "database" ? "지금" : "아직 없음") : budget.ended ? `끝난 하루(${budget.ageHours}시간 전 시작)` : `${budget.ageHours}시간째`;
      return `| ${budget.label} | ${amount(budget, budget.used)} | ${amount(budget, budget.ceiling)} | ${(budget.ratio * 100).toFixed(1)}%${budget.alarms && budget.ratio >= NEAR ? " ⚠" : ""} | ${window} |`;
    }),
    "",
    "하루는 그 한도의 첫 요청부터 24시간입니다. 끝난 하루는 다음 요청이 올 때까지 그날의 합계로 남습니다. 데이터베이스 크기는 Supabase 무료 플랜의 500MB에 견준 값이고 경보에는 넣지 않습니다.",
  );
  return lines.join("\n");
}

function readRows(path) {
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.rows) ? parsed.rows : null;
  if (!rows) throw new Error(`${path} holds no rows`);
  return rows;
}

const args = import.meta.url === pathToFileURL(process.argv[1] ?? "").href ? process.argv.slice(2) : [];
if (args[0] === "--sql") {
  process.stdout.write(`${QUERY}\n`);
} else if (args[0] === "--near") {
  process.stdout.write(`${nearLimits(readBudgets(readRows(args[1]))).length}\n`);
} else if (args[0]) {
  process.stdout.write(`${describeBudgets(readBudgets(readRows(args[0])))}\n`);
}
