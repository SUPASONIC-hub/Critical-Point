/**
 * N47 Season 준비표 (owner's answer Q12 (1), 2026-11-18): what
 * `npm run report:season-ready` reads and prints. New content is released as
 * a "Season" on a date the owner chooses (docs/work-status.md), so the table
 * is the reason for that date at a glance: every side case file in
 * src/nodes/, whether a release already lists it, check:case's warnings for
 * it by kind (초상, en/ja 키·이름, $, 길이, TODO, canon), and whether an e2e
 * spec names it. A file a release does not list yet, with no warning and an
 * e2e spec, is ready; when every such file is, the verdict is 「공개 가능」.
 *
 * Pure: the script (report-season-ready.mjs) gathers the facts, this file
 * only weighs and prints them, so tests/unit/season-ready.test.mjs can hold
 * the rules without the case files.
 */

/** The warning kinds the table gives a column of their own; the rest go under 기타. */
export const READY_COLUMNS = Object.freeze([
  { key: "portrait", label: "초상", kinds: ["초상"] },
  { key: "locale", label: "en/ja", kinds: ["en 키", "ja 키", "en 이름", "ja 이름"] },
  { key: "other", label: "기타", kinds: null },
]);

/** `side01.js` -> `side01`; anything else -> null. side00 is the framework's placeholder, never content. */
export function sideFileId(file) {
  const match = /^(side\d{2})\.js$/.exec(file);
  return match && match[1] !== "side00" ? match[1] : null;
}

/**
 * One row per side case file: `{ id, title, listed, warnings, counts, e2e, ready }`.
 * `warnings` is check:case's list (`{ unit, kind, item }`), `listed` the ids a
 * release lists (SIDE_CASES), `specs` the ids an e2e spec names.
 */
export function buildSeasonReadyRows({ ids, titles = {}, listed = [], warnings = [], specs = [] }) {
  return [...ids].sort().map((id) => {
    const mine = warnings.filter((entry) => entry.unit === id);
    const counts = Object.fromEntries(READY_COLUMNS.map((column) => [column.key, 0]));
    for (const entry of mine) {
      const column = READY_COLUMNS.find((candidate) => candidate.kinds?.includes(entry.kind)) ?? READY_COLUMNS.at(-1);
      counts[column.key] += 1;
    }
    const e2e = specs.includes(id);
    return { id, title: titles[id] ?? "", listed: listed.includes(id), warnings: mine.length, counts, e2e, ready: mine.length === 0 && e2e };
  });
}

/**
 * The one line under the table: 「공개 가능」 when every side case a release
 * does not list yet is ready, 「아직」 with the ids that are not, and
 * 「새로 준비된 번외 없음」 when a release lists every file already.
 */
export function seasonVerdict(rows) {
  const waiting = rows.filter((row) => !row.listed);
  if (!waiting.length) return { ready: false, line: "새로 준비된 번외 없음 — 모든 번외 파일이 이미 공개 목록(SIDE_CASES)에 있습니다." };
  const blocked = waiting.filter((row) => !row.ready);
  if (!blocked.length) return { ready: true, line: `공개 가능 — ${waiting.map((row) => row.id).join(", ")} 준비됨.` };
  return { ready: false, line: `아직 — ${blocked.map((row) => row.id).join(", ")}에 경고나 e2e 빠짐.` };
}

const mark = (ok) => (ok ? "초록" : "빨강");

/** The table, as markdown (it reads the same in a terminal and in a job summary). */
export function formatSeasonReady(rows, { docWarnings = 0 } = {}) {
  const head = ["사건", "제목", "공개", "check:case 경고", ...READY_COLUMNS.map((column) => column.label), "e2e", "준비"];
  const lines = [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`];
  for (const row of rows) {
    const cells = [row.id, row.title, row.listed ? "공개됨" : "대기", row.warnings, ...READY_COLUMNS.map((column) => row.counts[column.key]), row.e2e ? "있음" : "없음", mark(row.ready)];
    lines.push(`| ${cells.join(" | ")} |`);
  }
  const verdict = seasonVerdict(rows);
  return [
    "## Season 준비표 (report:season-ready, 읽기만)",
    "",
    ...lines,
    "",
    `문서 경고 ${docWarnings}개 (writing-a-case.md, canon.md, portrait-credits.md — 자세히는 npm run check:case).`,
    `**${verdict.line}**`,
  ].join("\n");
}

/**
 * The summary line a pull request that touched side case files gets
 * (check:case --summary, .github/workflows/case-check.yml): one line per
 * case, the warning count by kind, never the items -- a long list on every
 * PR would be skimmed past (N47 risk note).
 */
export function summaryLines(ids, warnings) {
  return ids.map((id) => {
    const mine = warnings.filter((entry) => entry.unit === id);
    if (!mine.length) return `${id}: 경고 없음`;
    const kinds = [...new Set(mine.map((entry) => entry.kind))].map((kind) => `${kind} ${mine.filter((entry) => entry.kind === kind).length}`);
    return `${id}: 경고 ${mine.length}개 (${kinds.join(", ")})`;
  });
}
