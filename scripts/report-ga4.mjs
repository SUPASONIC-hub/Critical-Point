/**
 * The first hour as Google Analytics counts it, for the Funnel run's Job
 * Summary (.github/workflows/funnel.yml, N17 of the 2026-11-16
 * next-improvements note). The database sees a case only when it closes, so a
 * player who leaves inside 프롤로그 01 or 02 is never in the funnel's rows;
 * Google Analytics has the start-screen press, the first table and the end of
 * 프롤로그 01 (#540, src/gameEvents.js) and each scene of 프롤로그 01 to
 * 사건 07 (`cp_scene`, two whole numbers; N16 for 프롤로그 01·02, N39 the rest).
 *
 * This reads them through the GA4 Data API with a service account:
 *
 *   - by ISO week, the last 8: users who pressed start, opened the first
 *     table and closed 프롤로그 01, and each step's share of the one before;
 *   - over the last 28 days: users per scene of 프롤로그 01 to 사건 07
 *     (`customEvent:case_no`, `customEvent:scene_no`), each scene's share
 *     of the case's first, and one line naming the scene most players left
 *     after (N39: the smallest share kept by the scene that follows). Until the two custom dimensions are registered in
 *     GA4 (docs/analytics.md) the table says so instead.
 *
 * Totals and shares only, as the rest of the summary: GA4 reports no person,
 * and nothing here asks it for a device, a page address or a place. This
 * repository and its run summaries are public.
 *
 *   GA4_SA_KEY        the service account's JSON key (a GitHub secret)
 *   GA4_PROPERTY_ID   the GA4 property's number (a GitHub secret)
 *
 *   node scripts/report-ga4.mjs          the summary, or one line saying why not
 *
 * Without either secret it prints that it skipped and exits 0: the funnel's
 * own tables do not wait for this one. A failed request prints what failed
 * (the API's message, never the key) and exits 0 too, with a warning line for
 * the workflow.
 */
import { createSign } from "node:crypto";
import { pathToFileURL } from "node:url";

import { GAME_EVENTS, SCENE_EVENT_CASES } from "../src/gameEvents.js";

export const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const API = "https://analyticsdata.googleapis.com/v1beta";
export const WEEKS = 8;
export const SCENE_DAYS = 28;
/** N16's event (#577): until it is on main, its name is written here. */
export const SCENE_EVENT = GAME_EVENTS.scene ?? "cp_scene";
/** The first hour's three steps, in order (src/gameEvents.js, #540). */
export const STEPS = Object.freeze([
  { event: GAME_EVENTS.start, label: "시작 누름" },
  { event: GAME_EVENTS.firstTable, label: "첫 판" },
  { event: GAME_EVENTS.prologueDone, label: "프롤로그 01 끝" },
]);

const base64url = (value) => Buffer.from(value).toString("base64url");

/** The secrets, read and checked: `{ key, propertyId }`, or `{ skip }` saying what is missing or wrong. */
export function readSecrets(env = process.env) {
  const raw = String(env.GA4_SA_KEY ?? "").trim();
  const propertyId = String(env.GA4_PROPERTY_ID ?? "").trim();
  const missing = [!raw && "GA4_SA_KEY", !propertyId && "GA4_PROPERTY_ID"].filter(Boolean);
  if (missing.length) return { skip: `${missing.join("·")} 비밀이 없어 GA4를 읽지 않았습니다.` };
  if (!/^\d{4,15}$/.test(propertyId)) return { skip: "GA4_PROPERTY_ID는 GA4 속성 번호(숫자)여야 합니다(측정 ID G-…가 아님)." };
  let key;
  try {
    key = JSON.parse(raw);
  } catch {
    return { skip: "GA4_SA_KEY가 JSON이 아닙니다(서비스 계정 키 파일 내용 전체를 넣습니다)." };
  }
  if (!key?.client_email || !key?.private_key) return { skip: "GA4_SA_KEY에 client_email·private_key가 없습니다." };
  return { key, propertyId };
}

/** The signed assertion a service account trades for an access token (RFC 7523). */
export function serviceAccountJwt(key, now = Date.now()) {
  const iat = Math.floor(now / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT", ...(key.private_key_id ? { kid: key.private_key_id } : {}) }));
  const claims = base64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 }));
  const signature = createSign("RSA-SHA256").update(`${header}.${claims}`).sign(key.private_key).toString("base64url");
  return `${header}.${claims}.${signature}`;
}

/** The weekly report: users and events of the three steps, by ISO week. */
export function weeklyRequest() {
  return {
    dateRanges: [{ startDate: `${WEEKS * 7}daysAgo`, endDate: "yesterday" }],
    dimensions: [{ name: "isoYearIsoWeek" }, { name: "eventName" }],
    metrics: [{ name: "totalUsers" }, { name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: STEPS.map((step) => step.event) } } },
    limit: 1000,
  };
}

/** The scene report: users and events of each scene of 프롤로그 01 to 사건 07. */
export function sceneRequest() {
  return {
    dateRanges: [{ startDate: `${SCENE_DAYS}daysAgo`, endDate: "yesterday" }],
    dimensions: [{ name: "customEvent:case_no" }, { name: "customEvent:scene_no" }],
    metrics: [{ name: "totalUsers" }, { name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: SCENE_EVENT } } },
    limit: 1000,
  };
}

/** A report's rows as plain objects: `{ dims: [...], users, events }`. */
export function readRows(report) {
  return (report?.rows ?? []).map((row) => ({
    dims: (row.dimensionValues ?? []).map((value) => value.value),
    users: Number(row.metricValues?.[0]?.value ?? 0),
    events: Number(row.metricValues?.[1]?.value ?? 0),
  }));
}

const share = (part, whole) => (whole > 0 ? `${Math.round((100 * part) / whole)}%` : "—");

/** The weekly table: one line a week, newest first, the users at each step and each step's share of the one before. */
export function describeWeeks(rows) {
  const weeks = new Map();
  for (const { dims: [week, event], users } of rows) {
    if (!weeks.has(week)) weeks.set(week, {});
    weeks.get(week)[event] = users;
  }
  const lines = [
    `### 첫 시간, 주별 (GA4 사용자 수, 최근 ${WEEKS}주)`,
    "",
    `| 주 | ${STEPS.map((step) => step.label).join(" | ")} | 첫 판/시작 | 끝/첫 판 |`,
    `|---|${STEPS.map(() => "--:").join("|")}|--:|--:|`,
  ];
  const order = [...weeks.keys()].sort().reverse();
  if (!order.length) lines.push(`| (아직 없음) |${STEPS.map(() => " |").join("")} | |`);
  for (const week of order) {
    const counts = STEPS.map((step) => weeks.get(week)[step.event] ?? 0);
    lines.push(`| ${week.slice(0, 4)}-W${week.slice(4)} | ${counts.join(" | ")} | ${share(counts[1], counts[0])} | ${share(counts[2], counts[1])} |`);
  }
  lines.push("", "주는 ISO 주(월요일 시작). 같은 사람이 여러 주에 있으면 주마다 셉니다. GA4 사용자 수는 쿠키 기준이라 기기 수와 다를 수 있습니다.");
  return lines;
}

/** `case_no` back to the case's name: 1 to 5 are 프롤로그 01 to 05, 6 to 12 사건 01 to 07 (SCENE_EVENT_CASES). */
export function caseLabel(caseNo) {
  const caseId = Object.keys(SCENE_EVENT_CASES).find((id) => SCENE_EVENT_CASES[id] === caseNo);
  const match = /^(prologue|case)(\d{2})$/.exec(caseId ?? "");
  if (!match) return `case_no ${caseNo}`;
  return `${match[1] === "prologue" ? "프롤로그" : "사건"} ${match[2]}`;
}

/**
 * N39: the scene most players left after -- of every two scenes in a row
 * (across a case's end too, as the season is played), the one whose next
 * scene kept the smallest share of its users. Null when no step lost anyone.
 */
export function mostLeftScene(scenes) {
  let worst = null;
  for (let index = 1; index < scenes.length; index += 1) {
    const before = scenes[index - 1];
    const after = scenes[index];
    if (before.users <= 0 || after.users >= before.users) continue;
    const kept = after.users / before.users;
    if (!worst || kept < worst.kept || (kept === worst.kept && before.users - after.users > worst.before.users - worst.after.users)) worst = { before, after, kept };
  }
  return worst;
}

/** The scene table: each case's scenes in order, users and share of the case's first scene, then the scene most left after. */
export function describeScenes(rows) {
  const lines = [`### 프롤로그 01 ~ 사건 07 장면별 (GA4 사용자 수, 최근 ${SCENE_DAYS}일)`, ""];
  const scenes = rows
    .map(({ dims: [caseNo, sceneNo], users }) => ({ caseNo: Number(caseNo), sceneNo: Number(sceneNo), users }))
    .filter((row) => Number.isInteger(row.caseNo) && Number.isInteger(row.sceneNo) && row.caseNo > 0 && row.sceneNo > 0)
    .sort((a, b) => a.caseNo - b.caseNo || a.sceneNo - b.sceneNo);
  if (!scenes.length) return [...lines, `아직 \`${SCENE_EVENT}\` 이벤트가 없습니다(N16 배포 전이거나 맞춤 측정기준 등록 전).`];
  lines.push("| 사건 | 장면 | 사용자 | 그 사건 첫 장면 대비 |", "|---|--:|--:|--:|");
  const first = new Map();
  for (const row of scenes) {
    if (!first.has(row.caseNo)) first.set(row.caseNo, row.users);
    lines.push(`| ${caseLabel(row.caseNo)} | ${row.sceneNo} | ${row.users} | ${share(row.users, first.get(row.caseNo))} |`);
  }
  const worst = mostLeftScene(scenes);
  const name = (row) => `${caseLabel(row.caseNo)} 장면 ${row.sceneNo}`;
  lines.push(
    "",
    worst
      ? `**가장 많이 떠난 장면**: ${name(worst.before)} — 다음 장면(${name(worst.after)})까지 온 사용자가 직전 장면 대비 ${share(worst.after.users, worst.before.users)} (${worst.before.users} → ${worst.after.users}명)`
      : "**가장 많이 떠난 장면**: 없음(어느 장면 다음에도 사용자가 줄지 않았습니다)",
  );
  return lines;
}

async function postJson(fetchImpl, url, body, headers = {}) {
  const response = await fetchImpl(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${String(data?.error?.message ?? data?.error_description ?? data?.error ?? "").slice(0, 200)}`);
  return data;
}

/** An access token for the key (the OAuth token endpoint). */
export async function accessToken(key, fetchImpl = fetch, now = Date.now()) {
  const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: serviceAccountJwt(key, now) });
  const response = await fetchImpl(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(`token ${response.status} ${String(data?.error_description ?? data?.error ?? "").slice(0, 200)}`);
  return data.access_token;
}

/**
 * The whole section as Markdown lines, and the warnings for the workflow.
 * Never throws: a missing secret or a failed request is a line of its own.
 */
export async function reportGa4(env = process.env, fetchImpl = fetch, now = Date.now()) {
  const heading = ["## 첫 시간 (GA4)", ""];
  const secrets = readSecrets(env);
  if (secrets.skip) return { lines: [...heading, secrets.skip], warnings: [] };
  const warnings = [];
  let token;
  try {
    token = await accessToken(secrets.key, fetchImpl, now);
  } catch (error) {
    return { lines: [...heading, `GA4 인증 실패: ${error.message}`], warnings: [`GA4 sign-in failed: ${error.message}`] };
  }
  const run = (body) => postJson(fetchImpl, `${API}/properties/${secrets.propertyId}:runReport`, body, { Authorization: `Bearer ${token}` });
  const lines = [...heading];
  try {
    lines.push(...describeWeeks(readRows(await run(weeklyRequest()))));
  } catch (error) {
    lines.push(`주별 표를 읽지 못했습니다: ${error.message}`);
    warnings.push(`GA4 weekly report failed: ${error.message}`);
  }
  lines.push("");
  try {
    lines.push(...describeScenes(readRows(await run(sceneRequest()))));
  } catch (error) {
    // An unregistered custom dimension is a 400 that names it: the table waits for the owner's five minutes in GA4.
    const unregistered = /customEvent:(case_no|scene_no)/.test(error.message);
    lines.push(unregistered ? "장면별 표: GA4 맞춤 측정기준 `case_no`·`scene_no`가 아직 등록되지 않았습니다(docs/analytics.md)." : `장면별 표를 읽지 못했습니다: ${error.message}`);
    if (!unregistered) warnings.push(`GA4 scene report failed: ${error.message}`);
  }
  return { lines, warnings };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { lines, warnings } = await reportGa4();
  console.log(lines.join("\n"));
  for (const warning of warnings) console.error(`::warning title=GA4::${warning}`);
}
