/**
 * The report queue of the 참가자 게시판, read and acted on from GitHub Actions
 * (.github/workflows/board-reports.yml).
 *
 * The promise behind the report button (20261027000000_board_reports.sql,
 * 앱출시-H): the queue is read once a day and a report is acted on within 24
 * hours. Nothing hides a post by itself; a person reads the post and decides.
 *
 * This repository is public, and so is every Job Summary and log it writes. So
 * nothing a player typed leaves the database here: no body, no nickname, no
 * writer key. A row of the summary is a post id, the day it went up, how many
 * reports from how many writers, the reasons picked and how long the oldest
 * report has waited. The operator reads the post itself in the Supabase
 * dashboard (Table Editor, `board_posts`, filter `id`), where only the project's
 * members can look, and then runs the workflow by hand with one of:
 *
 *   hide     moderate_board_post(id)         the post leaves the board
 *   restore  moderate_board_post(id, false)  a post hidden by mistake comes back
 *   dismiss  delete its reports              the post stays, the queue is clear
 *
 * A report waits until its post is hidden or its reports are dismissed. A
 * report on a hidden post is done (a writer can only report a post they see).
 *
 *   node scripts/board-reports.mjs --sql                      the one SELECT the daily run sends
 *   node scripts/board-reports.mjs --act <action> <post id>   the statement a hand run sends
 *   node scripts/board-reports.mjs <rows.json>                the summary, from what the SELECT got back
 *   node scripts/board-reports.mjs --waiting <rows.json>      how many posts wait, for the run's exit code
 *   node scripts/board-reports.mjs --done <rows.json>         yes or no: whether a hand action changed anything
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { BOARD_REPORT_REASONS } from "../src/boardReport.js";

/** The promise: acted on within this long. */
export const DEADLINE_HOURS = 24;
/** The reasons a report can carry (board_reports_reason_check), in the words the button uses. */
export const REASON_NAMES = Object.fromEntries(BOARD_REPORT_REASONS.map((reason) => [reason.id, reason.label]));
export const ACTIONS = ["hide", "restore", "dismiss"];

/**
 * Posts with a report, newest wait first among the visible ones. Ids, counts
 * and times only: the columns a player typed are not selected.
 */
export const QUERY = `select p.id as post_id,
       p.hidden,
       to_char(p.created_at at time zone 'Asia/Seoul', 'YYYY-MM-DD') as posted_on,
       count(*)::int as reports,
       count(distinct r.actor_key)::int as writers,
       array_agg(distinct r.reason order by r.reason) as reasons,
       extract(epoch from (now() - min(r.created_at)))::bigint as oldest_seconds
  from public.board_reports r
  join public.board_posts p on p.id = r.post_id
 group by p.id, p.hidden, p.created_at
 order by p.hidden, oldest_seconds desc
 limit 200;`;

/** The statement for one hand action. The id is checked here, before it is written into SQL. */
export function actionStatement(action, postId) {
  if (!ACTIONS.includes(action)) throw new Error(`${action} is not one of ${ACTIONS.join(", ")}`);
  const id = String(postId ?? "").trim();
  if (!/^[1-9]\d{0,17}$/.test(id)) throw new Error(`${postId} is not a post id`);
  if (action === "hide") return `select public.moderate_board_post(${id}) as done;`;
  if (action === "restore") return `select public.moderate_board_post(${id}, false) as done;`;
  return `with gone as (delete from public.board_reports where post_id = ${id} returning 1) select count(*)::int as done from gone;`;
}

/** Whether a hand action did anything, from what its statement returned. */
export function actionDone(rows) {
  const value = rows?.[0]?.done;
  return value === true || value === "true" || value === "t" || Number(value) > 0;
}

const asBool = (value) => value === true || value === "true" || value === "t";
const asList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  const text = value.trim();
  if (text.startsWith("[")) return JSON.parse(text);
  return text.replace(/^\{|\}$/g, "").split(",").filter(Boolean);
};

/** The rows the query returned, each read the same way whatever JSON shape the CLI gave. */
export function readQueue(rows) {
  const posts = rows.map((row) => ({
    postId: Number(row.post_id),
    hidden: asBool(row.hidden),
    postedOn: row.posted_on ?? "",
    reports: Number(row.reports) || 0,
    writers: Number(row.writers) || 0,
    reasons: asList(row.reasons),
    waitedHours: Math.floor((Number(row.oldest_seconds) || 0) / 3600),
  }));
  const waiting = posts.filter((post) => !post.hidden);
  return { waiting, overdue: waiting.filter((post) => post.waitedHours >= DEADLINE_HOURS), hidden: posts.filter((post) => post.hidden) };
}

const reasonText = (reasons) => reasons.map((reason) => REASON_NAMES[reason] ?? reason).join(", ");

/** The Job Summary: a table of the posts that wait, and a line for the ones already hidden. */
export function describeQueue(queue) {
  const lines = ["## 게시판 신고 대기열", ""];
  if (queue.waiting.length === 0) {
    lines.push("기다리는 신고가 없습니다.");
  } else {
    lines.push(
      `기다리는 글 **${queue.waiting.length}개**${queue.overdue.length ? `, 그 가운데 **${queue.overdue.length}개는 ${DEADLINE_HOURS}시간을 넘김**` : ""}.`,
      "",
      "| 글 번호 | 올린 날 | 신고 | 신고한 사람 | 사유 | 가장 오래 기다린 신고 |",
      "|---|---|---|---|---|---|",
      ...queue.waiting.map(
        (post) =>
          `| ${post.postId} | ${post.postedOn} | ${post.reports} | ${post.writers} | ${reasonText(post.reasons)} | ${post.waitedHours}시간${post.waitedHours >= DEADLINE_HOURS ? " ⚠" : ""} |`,
      ),
      "",
      "본문은 Supabase 대시보드의 Table Editor → `board_posts`에서 `id`로 찾아 읽습니다(이 저장소는 공개라 여기에는 싣지 않습니다).",
      "그다음 이 워크플로를 Run workflow로 돌립니다: `action` = hide(내림) / dismiss(그대로 두고 신고를 지움) / restore(내린 글을 되돌림), `post_id` = 글 번호.",
    );
  }
  if (queue.hidden.length) lines.push("", `이미 내린 글 ${queue.hidden.length}개(${queue.hidden.map((post) => post.postId).join(", ")})의 신고는 끝난 것으로 셉니다. 글과 함께 180일 뒤 지워집니다.`);
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
} else if (args[0] === "--act") {
  process.stdout.write(`${actionStatement(args[1], args[2])}\n`);
} else if (args[0] === "--done") {
  process.stdout.write(actionDone(readRows(args[1])) ? "yes\n" : "no\n");
} else if (args[0] === "--waiting") {
  process.stdout.write(`${readQueue(readRows(args[1])).waiting.length}\n`);
} else if (args[0]) {
  process.stdout.write(`${describeQueue(readQueue(readRows(args[0])))}\n`);
}
