import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import reminderKo from "../src/copy/reminder.js";
import weekRulesKo from "../src/copy/weekRules.js";
import { weekRuleAt, weekStartMs } from "../src/gauntlet/weeklyRules.js";
import { fill } from "../src/locale.js";
import reminderEn from "../src/locales/en/screens/reminder.js";
import weekRulesEn from "../src/locales/en/screens/weekRules.js";
import reminderJa from "../src/locales/ja/screens/reminder.js";
import weekRulesJa from "../src/locales/ja/screens/weekRules.js";

/**
 * 주 1회 알림's weekly sender (N25; .github/workflows/weekly-push.yml).
 *
 * On the Monday morning (KST) of a week the calendar gives a rule
 * (src/gauntlet/weeklyCalendar.js, the same calendar the game reads), one Web
 * Push notification to every subscription in `public.push_subscriptions`
 * (supabase/migrations/20261129000000_push_subscriptions.sql), written in the
 * subscriber's language: 「이번 주의 규칙: CRISIS WEEK」 and the rule's title and
 * its line in the story. A week without a rule sends nothing.
 *
 * The workflow reads and writes the table with `supabase db query --linked`
 * (the access token Funnel and Board Reports already use), so this script
 * never holds a database key:
 *   --due                 "yes" when this week has a rule, else "no"
 *   --sql                 the SELECT of the rows not yet sent this week
 *   --send rows.json --out after.sql [--dry-run]
 *                         sends (with `web-push` and VAPID_PUBLIC_KEY,
 *                         VAPID_PRIVATE_KEY, VAPID_SUBJECT from the
 *                         environment), prints a summary of counts, and
 *                         writes the SQL that marks the sent rows and deletes
 *                         the ones the push service answered 404 or 410 for.
 *                         A dry run sends nothing and writes no SQL.
 *
 * The repository is public and so is the run's log: it carries counts, never
 * an endpoint or a key.
 */

export const LANGUAGES = ["ko", "en", "ja"];
const COPY = {
  ko: { reminder: reminderKo, rules: weekRulesKo.rules },
  en: { reminder: reminderEn, rules: weekRulesEn.rules },
  ja: { reminder: reminderJa, rules: weekRulesJa.rules },
};
const START_PAGES = { ko: "/", en: "/en/", ja: "/ja/" };
/** How long a push service keeps an undelivered message: one day, then it is stale. */
export const PUSH_TTL_SECONDS = 24 * 60 * 60;

/** This week's rule at `now`, or null in a week without one. */
export const ruleOfWeek = (now = Date.now(), calendar) => weekRuleAt(now, calendar);

/** The notification for a rule in a language: what the worker's `push` handler shows (serviceWorker/worker.js `pushNotice`). */
export function notificationFor(rule, language) {
  const lang = LANGUAGES.includes(language) ? language : "ko";
  const words = COPY[lang].rules[rule.id] ?? COPY.ko.rules[rule.id] ?? {};
  const title = fill(COPY[lang].reminder.title, { label: rule.label });
  const ruleTitle = words.title ?? rule.title;
  const body = words.world ? `${ruleTitle}\n${words.world}` : ruleTitle;
  return { title, body, url: START_PAGES[lang] };
}

/** The rows to send to at `now`: every subscription not yet sent to since this week's Monday 00:00 KST. */
export function subscriptionsQuery(now = Date.now()) {
  const week = ruleOfWeek(now)?.week;
  const start = new Date(weekStartMs(week) ?? Number(now)).toISOString();
  return `select id, endpoint, p256dh, auth, language
from public.push_subscriptions
where last_sent_at is null or last_sent_at < '${start}'::timestamptz
order by id;`;
}

/** The rows the CLI returned, each read the same way whatever JSON shape it gave; rows that are not one are left out. */
export function readSubscriptions(parsed) {
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.rows) ? parsed.rows : [];
  return rows
    .map((row) => ({ id: Number(row?.id), endpoint: row?.endpoint, p256dh: row?.p256dh, auth: row?.auth, language: row?.language }))
    .filter((row) => Number.isSafeInteger(row.id) && typeof row.endpoint === "string" && row.endpoint.startsWith("https://") && typeof row.p256dh === "string" && typeof row.auth === "string");
}

/**
 * Sends the rule's notification to every row with `send(subscription,
 * payload, options)` (web-push's `sendNotification`). Resolves to the ids
 * sent, the ids gone (404/410: the browser dropped the subscription) and the
 * number that failed otherwise (kept, tried again next run of the week).
 */
export async function sendAll(rows, rule, send, { concurrency = 8 } = {}) {
  const sent = [];
  const gone = [];
  let failed = 0;
  const queue = [...rows];
  async function next() {
    for (let row = queue.shift(); row; row = queue.shift()) {
      const payload = JSON.stringify(notificationFor(rule, row.language));
      try {
        await send({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload, { TTL: PUSH_TTL_SECONDS, urgency: "normal" });
        sent.push(row.id);
      } catch (error) {
        if (error?.statusCode === 404 || error?.statusCode === 410) gone.push(row.id);
        else failed += 1;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, next));
  return { sent: sent.sort((a, b) => a - b), gone: gone.sort((a, b) => a - b), failed };
}

/** The SQL that records a run: the sent rows marked with `now`, the gone rows deleted. Ids only, checked to be integers. */
export function afterSql({ sent, gone }, now = Date.now()) {
  const ids = (list) => list.filter((id) => Number.isSafeInteger(id)).join(", ");
  const at = new Date(Number(now)).toISOString();
  const lines = [];
  if (ids(sent)) lines.push(`update public.push_subscriptions set last_sent_at = '${at}'::timestamptz where id in (${ids(sent)});`);
  if (ids(gone)) lines.push(`delete from public.push_subscriptions where id in (${ids(gone)});`);
  lines.push("select 1 as done;");
  return `${lines.join("\n")}\n`;
}

/** A run's summary for the Job Summary: counts only. */
export function describeRun(rule, rows, result, dryRun) {
  const byLanguage = LANGUAGES.map((lang) => `${lang} ${rows.filter((row) => (LANGUAGES.includes(row.language) ? row.language : "ko") === lang).length}`).join(", ");
  return [
    `### 주 1회 알림 · ${rule.week} ${rule.label}${dryRun ? " (dry run: 보내지 않음)" : ""}`,
    "",
    `- 대상 구독: ${rows.length} (${byLanguage})`,
    dryRun ? "- 보낸 것: 0 (dry run)" : `- 보냄: ${result.sent.length} · 사라진 구독 삭제: ${result.gone.length} · 실패(다음 실행에 다시): ${result.failed}`,
    "",
  ].join("\n");
}

/** web-push, set up with the three VAPID values; throws when one is missing. */
export async function vapidSender(env = process.env) {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) throw new Error("VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT are needed to send.");
  const { default: webpush } = await import("web-push");
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return (subscription, payload, options) => webpush.sendNotification(subscription, payload, options);
}

async function main(args) {
  const now = Date.now();
  if (args[0] === "--due") {
    process.stdout.write(ruleOfWeek(now) ? "yes\n" : "no\n");
  } else if (args[0] === "--sql") {
    process.stdout.write(`${subscriptionsQuery(now)}\n`);
  } else if (args[0] === "--send") {
    const rule = ruleOfWeek(now);
    if (!rule) {
      process.stdout.write("이번 주는 규칙이 없어 보내지 않습니다.\n");
      return;
    }
    const out = args[args.indexOf("--out") + 1];
    const dryRun = args.includes("--dry-run");
    const rows = readSubscriptions(JSON.parse(readFileSync(args[1], "utf8")));
    const result = dryRun ? { sent: [], gone: [], failed: 0 } : await sendAll(rows, rule, await vapidSender());
    if (!dryRun && out && args.includes("--out")) writeFileSync(out, afterSql(result, now));
    process.stdout.write(`${describeRun(rule, rows, result, dryRun)}\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main(process.argv.slice(2));
