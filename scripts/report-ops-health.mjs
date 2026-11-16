/**
 * Yesterday's errors and feedback, and how long the repository has been quiet,
 * for the Funnel run's Job Summary (.github/workflows/funnel.yml, N4 and N7 of
 * the 2026-11-12 next-improvements note).
 *
 * N4: the same read path as the funnel (one SELECT through `supabase db query
 * --linked`) counts yesterday's (KST) rows of `app_error_logs` and
 * `playtest_feedback`, and names the three most frequent error messages, cut
 * to their first 40 characters. This repository and its summaries are public:
 * the query never selects a session, a stack, a snapshot or a feedback body,
 * and what is left of a message is masked again here (addresses, long digit
 * runs, codes) before it is printed.
 *
 * N7: GitHub turns off the scheduled workflows of a public repository after 60
 * days without activity. The summary warns from 45 days after the last commit
 * on main; `Workflow Keepalive` (monthly) turns back on what was turned off.
 *
 *   node scripts/report-ops-health.mjs --sql                       the one SELECT
 *   node scripts/report-ops-health.mjs <rows.json> [lastCommitIso]  the summary
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const MESSAGE_CHARS = 40;
export const TOP = 3;
export const INACTIVITY_DISABLE_DAYS = 60;
export const INACTIVITY_WARN_DAYS = 45;

/** Yesterday in KST: counts, and the top messages already cut to 40 characters. */
export const QUERY = `with bounds as (
  select (date_trunc('day', now() at time zone 'Asia/Seoul') - interval '1 day') at time zone 'Asia/Seoul' as since,
         date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul' as until
), errs as (
  select left(coalesce(nullif(btrim(e.error_message), ''), nullif(btrim(e.error_name), ''), '(메시지 없음)'), ${MESSAGE_CHARS}) as message
    from public.app_error_logs e, bounds b
   where e.created_at >= b.since and e.created_at < b.until
)
select 'errors' as kind, null::text as message, count(*)::bigint as n from errs
union all
select 'feedback', null::text, count(*)::bigint
  from public.playtest_feedback f, bounds b
 where f.created_at >= b.since and f.created_at < b.until
union all
(select 'top', message, count(*)::bigint from errs group by message order by count(*) desc, message limit ${TOP});`;

/** What may remain of a message after the cut: no address, number run, code or URL. */
export function maskMessage(message) {
  return String(message ?? "")
    .slice(0, MESSAGE_CHARS)
    .replace(/[\r\n\t|`<>]/g, " ")
    .replace(/https?:\/\/\S+/gi, "<url>")
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "<email>")
    .replace(/\b[0-9a-f]{8,}\b/gi, "<id>")
    .replace(/\d{4,}/g, "<n>")
    .replace(/\s+/g, " ")
    .trim();
}

export function readOpsHealth(rows) {
  const health = { errors: 0, feedback: 0, top: [] };
  for (const row of rows) {
    const n = Number(row.n) || 0;
    if (row.kind === "errors") health.errors = n;
    else if (row.kind === "feedback") health.feedback = n;
    else if (row.kind === "top" && health.top.length < TOP) health.top.push({ message: maskMessage(row.message), count: n });
  }
  return health;
}

/** Whole days since the last commit on main, or null when unknown. */
export function quietDays(lastCommitIso, now = new Date()) {
  const at = Date.parse(lastCommitIso ?? "");
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.floor((now.getTime() - at) / 86400000));
}

export function describeInactivity(days) {
  if (days === null) return "";
  if (days < INACTIVITY_WARN_DAYS) return `main의 마지막 커밋은 ${days}일 전입니다(${INACTIVITY_DISABLE_DAYS}일이 지나면 GitHub이 예약 실행을 끕니다).`;
  return `> ⚠ **main의 마지막 커밋이 ${days}일 전입니다.** ${INACTIVITY_DISABLE_DAYS}일이 지나면 GitHub이 이 저장소의 예약 워크플로를 끕니다. \`Workflow Keepalive\`가 매달 다시 켜지만, 그것도 꺼질 수 있으니 Actions 탭에서 확인하십시오.`;
}

export function describeOpsHealth(health, days = null) {
  const top = health.top.length ? `(상위 ${health.top.length}: ${health.top.map((t) => `「${t.message}」 ${t.count}`).join(", ")})` : "";
  const lines = ["## 어제 오류와 의견", "", `- 어제 오류 ${health.errors}건${top}`, `- 의견 ${health.feedback}건`, "", "어제는 KST 기준 하루입니다. 오류 메시지는 앞 40자만, 의견은 수만 적습니다."];
  const inactivity = describeInactivity(days);
  if (inactivity) lines.push("", inactivity);
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
} else if (args[0] === "--inactivity") {
  process.stdout.write(`${describeInactivity(quietDays(args[1]))}\n`);
} else if (args[0]) {
  process.stdout.write(`${describeOpsHealth(readOpsHealth(readRows(args[0])), quietDays(args[1]))}\n`);
}
