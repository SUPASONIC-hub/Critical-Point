import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * 첫 30분 자동 기록 (2026-11-27 결정), read from GitHub Actions
 * (.github/workflows/funnel.yml, 22:10 KST every day). The records of
 * first-visit devices that left 「기록 보내기」 on (src/firstHourLog.js,
 * supabase/migrations/20261202020000_first_hour_runs.sql), as counts, shares
 * and medians only. Reading what they say is the owner's, on a day the owner
 * names; this only keeps the table up to date.
 *
 * This repository is public, and so is every summary: the one SELECT reads
 * the records' fields and nothing that names one -- no record id, no time a
 * row was written -- and the summary prints aggregates only. A scene id is
 * printed only where at least FLOOR records share it.
 *
 *   node scripts/report-first-hour.mjs --sql          the one SELECT the run sends
 *   node scripts/report-first-hour.mjs <rows.json>    the summary, from what it got back
 */

export const QUERY = "select record from public.first_hour_runs where record ->> 'first' = 'true'";

/** A scene or screen is named only when this many records share it. */
export const FLOOR = 3;

const LABELS = {
  btn: { prologue: "프롤로그 시작", story: "이야기로 시작", briefing: "브리핑 먼저 보기", language: "언어" },
  cold: { skip: "건너뜀", done: "끝까지 봄" },
  lost: { stake: "판돈", next: "다음 장면", unknown: "모르겠다", skip: "건너뜀", shown: "답 없음" },
};

const asRecord = (row) => {
  const value = row?.record ?? row;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" ? value : null;
};

const isCount = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;

export function median(values) {
  const sorted = values.filter(isCount).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function tally(records, field) {
  const counts = new Map();
  for (const record of records) {
    const value = record[field];
    if (value === undefined || value === null) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

/** The aggregates, from the rows the SELECT returned. */
export function readFirstHour(rows) {
  const records = (Array.isArray(rows) ? rows : []).map(asRecord).filter((record) => record?.first === true);
  const count = (predicate) => records.filter(predicate).length;
  const tables = records.filter((record) => typeof record.t1 === "string");
  const busts = records.filter((record) => isCount(record.bustS));
  const scenes = (field, pool) => tally(pool, field).filter(([, n]) => n >= FLOOR);
  const againScores = records.map((record) => record.again).filter((value) => Number.isInteger(value) && value >= 0 && value <= 10);
  return {
    records: records.length,
    devices: { phone: count((record) => record.dev === "phone"), pc: count((record) => record.dev === "pc") },
    languages: tally(records, "lang"),
    firstButton: tally(records, "btn"),
    firstButtonSec: median(records.map((record) => record.btnS)),
    started: count((record) => isCount(record.startS)),
    startSec: median(records.map((record) => record.startS)),
    cold: tally(records, "cold"),
    coldPages: median(records.filter((record) => record.cold).map((record) => record.coldPages ?? 0)),
    firstTable: {
      opened: tables.length,
      pushes: median(tables.map((record) => record.t1Push)),
      hinted: tables.filter((record) => record.t1Hint > 0).length,
      hints: median(tables.filter((record) => record.t1Hint > 0).map((record) => record.t1Hint)),
      timedOut: tables.filter((record) => record.t1Timeout > 0).length,
    },
    bust: { devices: busts.length, sec: median(busts.map((record) => record.bustS)), scenes: scenes("bustNode", busts) },
    caseFile: count((record) => record.file === true),
    scout: count((record) => record.scout === true),
    narrow: count((record) => record.narrow === true),
    past30: count((record) => record.past30 === true),
    leftAt: scenes("lastAt", records.filter((record) => record.past30 !== true && typeof record.lastAt === "string")),
    furthestCase: tally(records, "farCase").sort((a, b) => a[0] - b[0]),
    lost: tally(records, "lost"),
    again: {
      answered: againScores.length,
      median: median(againScores),
      mean: againScores.length ? againScores.reduce((sum, value) => sum + value, 0) / againScores.length : null,
      spread: Array.from({ length: 11 }, (_, score) => againScores.filter((value) => value === score).length),
      skipped: count((record) => record.again === "skip"),
      unanswered: count((record) => record.again === "shown"),
    },
  };
}

const share = (n, of) => (of ? `${n} (${Math.round((n / of) * 100)}%)` : "0");
const sec = (value) => (value === null ? "—" : `${Math.round(value)}초`);
const num = (value) => (value === null ? "—" : String(Math.round(value * 10) / 10));
const listOf = (entries, labels = {}) => (entries.length ? entries.map(([key, n]) => `${labels[key] ?? key} ${n}`).join(" · ") : "—");

/** The Job Summary's section, in Korean like the rest. */
export function describeFirstHour(report) {
  const lines = ["### 첫 30분 자동 기록 (첫 방문 기기)", ""];
  if (!report.records) {
    lines.push("아직 기록이 없습니다. 기록은 저장 데이터가 하나도 없던 기기가 처음 연 30분이고, 「기록 보내기」를 켜 둔 기기만 보냅니다.");
    return lines.join("\n");
  }
  const { records: n, firstTable: t, bust, again } = report;
  lines.push(
    `기록 ${n}개 — 휴대폰 ${report.devices.phone} · PC ${report.devices.pc} · 언어 ${listOf(report.languages)}. 「기록 보내기」를 켠 첫 방문 기기만 들어 있고, 묶음 수치만 적습니다(장면은 ${FLOOR}개 이상 겹칠 때만).`,
    "",
    "| 항목 | 값 |",
    "|---|---|",
    `| 첫 버튼 | ${listOf(report.firstButton, LABELS.btn)} (중앙값 ${sec(report.firstButtonSec)}) |`,
    `| 시작을 누른 기기 · 시작까지 | ${share(report.started, n)} · 중앙값 ${sec(report.startSec)} |`,
    `| 냉정한 오프닝 | ${listOf(report.cold, LABELS.cold)} · 넘긴 장 중앙값 ${num(report.coldPages)} |`,
    `| 첫 판: 연 기기 · 밀기 중앙값 | ${share(t.opened, n)} · ${num(t.pushes)} |`,
    `| 첫 판: 길게 누르기 안내를 본 기기 · 횟수 중앙값 | ${share(t.hinted, t.opened)} · ${num(t.hints)} |`,
    `| 첫 판: 시간 초과가 난 기기 | ${share(t.timedOut, t.opened)} |`,
    `| 첫 BUST: 기기 · 시각 중앙값 | ${share(bust.devices, n)} · ${sec(bust.sec)} |`,
    `| 첫 BUST 장면 | ${listOf(bust.scenes)} |`,
    `| 사건 파일을 연 기기 | ${share(report.caseFile, n)} |`,
    `| 정찰 · 좁히기 | ${share(report.scout, n)} · ${share(report.narrow, n)} |`,
    `| 30분을 넘겨 계속한 기기 | ${share(report.past30, n)} |`,
    `| 30분까지 간 가장 먼 사건(시즌 순번) | ${listOf(report.furthestCase.map(([place, count]) => [`${place}번째`, count]))} |`,
    `| 떠난 곳(30분 안에 떠난 기기) | ${listOf(report.leftAt)} |`,
    `| 「무엇을 잃었나요?」 | ${listOf(report.lost, LABELS.lost)} |`,
    `| 「다음에 또 켤 것 같나요?」 | 답 ${again.answered} · 중앙값 ${num(again.median)} · 평균 ${num(again.mean)} · 건너뜀 ${again.skipped} · 답 없음 ${again.unanswered} |`,
    `| 0~10 분포 | ${again.spread.join(" / ")} |`,
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
} else if (args[0]) {
  process.stdout.write(`${describeFirstHour(readFirstHour(readRows(args[0])))}\n`);
}
