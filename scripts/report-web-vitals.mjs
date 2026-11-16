import { pathToFileURL } from "node:url";
import { accessToken, readGa4Env, rowsOf, runReport } from "./ga4-data-api.mjs";

/**
 * N28 (2차 개선점, 2026-11-16 「전부 1」): the weekly 「폰 속도」 line in the
 * Funnel summary. N12 (#547) sends the start page's LCP and INP from one page
 * load in twenty (`cp_lcp`, `cp_inp`, `value` = whole ms; src/webVitals.js);
 * nothing read them. This reads the last seven days and the seven before
 * from GA's Data API (scripts/ga4-data-api.mjs, the two secrets N17 uses)
 * and prints p75 per device category, with ⚠ past Google's "good" lines:
 * LCP 2.5 s, INP 200 ms. A warning, never a failure.
 *
 * p75 needs each event's value, which GA keeps only as a custom dimension:
 * 관리 > 맞춤 정의 > 맞춤 측정기준 만들기, 범위 「이벤트」, 이벤트 매개변수
 * `value` (docs/analytics.md). Until that is registered the API refuses
 * `customEvent:value`, and the line falls back to the mean (eventValue /
 * eventCount) and says so. Registered, GA fills it only from that day on.
 *
 *   node scripts/report-web-vitals.mjs            # markdown, for the Job Summary
 *   node scripts/report-web-vitals.mjs --json     # the numbers
 *
 * No secrets: one line saying the read was skipped, exit 0. An API error:
 * the status and Google's reason, exit 0 -- the funnel's other tables stand.
 */
export const LCP_GOOD_MS = 2500;
export const INP_GOOD_MS = 200;
/** Fewer samples than this in a cell and its p75 is marked thin: a baseline, not a verdict (4주 뒤 판단). */
export const THIN_SAMPLE = 20;
export const EVENTS = { lcp: "cp_lcp", inp: "cp_inp" };
export const DEVICES = ["mobile", "tablet", "desktop"];
const DEVICE_LABEL = { mobile: "폰", tablet: "태블릿", desktop: "PC", all: "전체" };
export const WEEKS = [
  { id: "this", label: "지난 7일", startDate: "7daysAgo", endDate: "yesterday" },
  { id: "last", label: "그 전 7일", startDate: "14daysAgo", endDate: "8daysAgo" },
];

const eventFilter = { filter: { fieldName: "eventName", inListFilter: { values: Object.values(EVENTS) } } };

/** The histogram request: each value with how often it came, per event and device. */
export function histogramRequest(week) {
  return {
    dateRanges: [{ startDate: week.startDate, endDate: week.endDate }],
    dimensions: [{ name: "eventName" }, { name: "deviceCategory" }, { name: "customEvent:value" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: eventFilter,
    limit: 100000,
  };
}

/** The fallback: counts and sums only, for a property without the `value` dimension. */
export function meanRequest(week) {
  return {
    dateRanges: [{ startDate: week.startDate, endDate: week.endDate }],
    dimensions: [{ name: "eventName" }, { name: "deviceCategory" }],
    metrics: [{ name: "eventCount" }, { name: "eventValue" }],
    dimensionFilter: eventFilter,
    limit: 1000,
  };
}

/** Whether an API error is the custom dimension not being registered (400 naming customEvent:value). */
export const missingValueDimension = (error) => error?.status === 400 && /customEvent:value|dimension/i.test(String(error?.reason ?? error?.message ?? ""));

/** p75 by nearest rank over [value, count] pairs; null with none. */
export function weightedQuantile(pairs, q = 0.75) {
  const list = pairs.filter(([value, count]) => Number.isFinite(value) && value >= 0 && count > 0).sort((a, b) => a[0] - b[0]);
  const total = list.reduce((sum, [, count]) => sum + count, 0);
  if (!total) return null;
  const rank = Math.ceil(q * total);
  let seen = 0;
  for (const [value, count] of list) {
    seen += count;
    if (seen >= rank) return value;
  }
  return list.at(-1)[0];
}

const metricOf = (eventName) => Object.keys(EVENTS).find((key) => EVENTS[key] === eventName) ?? null;
const deviceOf = (category) => (DEVICES.includes(category) ? category : "desktop");

/** Histogram rows -> { lcp: { mobile: { p75, n }, ..., all }, inp: {...}, method: "p75" }. */
export function readHistogram(rows) {
  const cells = {};
  for (const row of rows) {
    const metric = metricOf(row.eventName);
    const value = Number(row["customEvent:value"]);
    const count = Number(row.eventCount) || 0;
    if (!metric || !Number.isFinite(value)) continue;
    for (const device of [deviceOf(row.deviceCategory), "all"]) {
      ((cells[metric] ??= {})[device] ??= []).push([value, count]);
    }
  }
  const out = { method: "p75" };
  for (const metric of Object.keys(EVENTS)) {
    out[metric] = {};
    for (const device of [...DEVICES, "all"]) {
      const pairs = cells[metric]?.[device] ?? [];
      out[metric][device] = { value: weightedQuantile(pairs), n: pairs.reduce((sum, [, count]) => sum + count, 0) };
    }
  }
  return out;
}

/** Fallback rows -> the same shape, with the mean in `value` and method "mean". */
export function readMeans(rows) {
  const sums = {};
  for (const row of rows) {
    const metric = metricOf(row.eventName);
    if (!metric) continue;
    for (const device of [deviceOf(row.deviceCategory), "all"]) {
      const cell = ((sums[metric] ??= {})[device] ??= { total: 0, n: 0 });
      cell.total += Number(row.eventValue) || 0;
      cell.n += Number(row.eventCount) || 0;
    }
  }
  const out = { method: "mean" };
  for (const metric of Object.keys(EVENTS)) {
    out[metric] = {};
    for (const device of [...DEVICES, "all"]) {
      const cell = sums[metric]?.[device];
      out[metric][device] = { value: cell?.n ? Math.round(cell.total / cell.n) : null, n: cell?.n ?? 0 };
    }
  }
  return out;
}

const LIMITS = { lcp: LCP_GOOD_MS, inp: INP_GOOD_MS };
/** Whether a cell is past its "good" line. */
export const overLine = (metric, cell) => cell?.value !== null && cell?.value !== undefined && cell.value > LIMITS[metric];

const ms = (metric, value) => (value === null || value === undefined ? "—" : metric === "lcp" ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`);
const cellText = (metric, cell) => (cell.n ? `${ms(metric, cell.value)}${overLine(metric, cell) ? " ⚠" : ""} (${cell.n}${cell.n < THIN_SAMPLE ? ", 적음" : ""})` : "—");

/** The one line the summary opens with: the phone row of the last seven days. */
export function headline(week) {
  const phone = { lcp: week.lcp.mobile, inp: week.inp.mobile };
  if (!phone.lcp.n && !phone.inp.n) return "폰 속도: 지난 7일 폰 표본 없음";
  const word = week.method === "p75" ? "p75" : "평균";
  const over = Object.keys(phone).filter((metric) => overLine(metric, phone[metric]));
  const verdict = over.length ? `⚠ 기준 넘음(${over.map((metric) => metric.toUpperCase()).join("·")})` : "기준 안";
  return `폰 속도: LCP ${word} ${ms("lcp", phone.lcp.value)} · INP ${word} ${ms("inp", phone.inp.value)} — ${verdict} (지난 7일, 표본 ${phone.lcp.n}·${phone.inp.n})`;
}

/** The markdown section: the headline, then a row per week and device. */
export function describeVitals(weeks) {
  const [current] = weeks;
  const method = current.method === "p75" ? "p75" : "평균(p75는 GA 맞춤 측정기준 `value` 등록 뒤)";
  const lines = [
    "## 폰 속도 (N28)",
    "",
    `**${headline(current)}**`,
    "",
    `시작 화면, 페이지 20개 중 1개 표본(N12). 값은 ${method}, 괄호는 표본 수. 기준: LCP ${LCP_GOOD_MS / 1000}s, INP ${INP_GOOD_MS}ms(넘으면 ⚠). 표본 ${THIN_SAMPLE}개 미만은 「적음」 — 4주 모인 뒤 판단.`,
    "",
    "| 기간 | 기기 | LCP | INP |",
    "| --- | --- | --- | --- |",
  ];
  for (const week of weeks) {
    for (const device of ["mobile", "tablet", "desktop", "all"]) {
      if (device !== "all" && device !== "mobile" && !week.lcp[device].n && !week.inp[device].n) continue;
      lines.push(`| ${week.label} | ${DEVICE_LABEL[device]} | ${cellText("lcp", week.lcp[device])} | ${cellText("inp", week.inp[device])} |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

/** Both weeks, histogram first and the mean when GA has no `value` dimension. */
export async function readVitals({ propertyId, token }, { fetch = globalThis.fetch } = {}) {
  const weeks = [];
  let useMean = false;
  for (const week of WEEKS) {
    let read = null;
    if (!useMean) {
      try {
        read = readHistogram(rowsOf(await runReport({ propertyId, token, request: histogramRequest(week) }, { fetch })));
      } catch (error) {
        if (!missingValueDimension(error)) throw error;
        useMean = true;
      }
    }
    if (!read) read = readMeans(rowsOf(await runReport({ propertyId, token, request: meanRequest(week) }, { fetch })));
    weeks.push({ ...week, ...read });
  }
  return weeks;
}

/** The whole run, for the CLI and its test: { text, json, warn }. Never throws. */
export async function report(env, { fetch = globalThis.fetch, now } = {}) {
  let ga;
  try {
    ga = readGa4Env(env);
  } catch (error) {
    return { text: `## 폰 속도 (N28)\n\n읽지 않음: ${error.message}\n`, json: { skipped: error.message }, warn: null };
  }
  if (ga.missing) {
    const why = `${ga.missing.join("·")} 없음 — GA를 읽지 않음(N17 서비스 계정 키를 Secrets에 넣으면 다음 실행부터)`;
    return { text: `## 폰 속도 (N28)\n\n${why}\n`, json: { skipped: why }, warn: null };
  }
  try {
    const token = await accessToken(ga.key, { fetch, now });
    const weeks = await readVitals({ propertyId: ga.propertyId, token }, { fetch });
    const phone = weeks[0];
    const over = ["lcp", "inp"].filter((metric) => overLine(metric, phone[metric].mobile));
    return {
      text: describeVitals(weeks),
      json: { weeks: weeks.map(({ id, label, method, lcp, inp }) => ({ id, label, method, lcp, inp })) },
      warn: over.length ? headline(phone) : null,
    };
  } catch (error) {
    return { text: `## 폰 속도 (N28)\n\nGA 읽기 실패: ${String(error?.message ?? error).slice(0, 200)}\n`, json: { error: String(error?.message ?? error).slice(0, 200) }, warn: null };
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const result = await report(process.env);
  const asJson = process.argv.includes("--json");
  process.stdout.write(asJson ? `${JSON.stringify(result.json, null, 2)}\n` : result.text);
  // The workflow turns this into an annotation; a line past the limit is a warning, not a failure.
  if (result.warn && process.env.GITHUB_ACTIONS === "true" && !asJson) console.error(`::warning title=폰 속도 기준 넘음::${result.warn}`);
}
