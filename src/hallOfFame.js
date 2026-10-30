/**
 * D2, 명예 보상: the hall of fame (D2-명예의전당-설계안-20261021.md, every
 * question answered (1), question 9 (1)). Pure functions; the daily check
 * (scripts/verify-ranking-rows.mjs, verify-ranking.yml) calls them on the
 * results it has just written as marks, so a season is posted from the very
 * check that cleared it and the check is never run twice.
 *
 * Which seasons may stand in it (설계안 1절 "들어가는 기록", all of them):
 *
 *   - a public ranking row: `season-final`, `seasonComplete`, a score;
 *   - the day's check read it whole: recheckRun's status `checked` (not
 *     `unverified`, other table rules; not `unrecorded`, a build before the
 *     replay record);
 *   - no mark: none from today's check (phase 2 and the chain), and none from
 *     the insert trigger (`suspicion` read off the ranking row, the checker's
 *     own marks aside since today's replace them). A row the trigger never
 *     judged (`suspicion` null) is not clean;
 *   - nothing left unread: no window without a record, none unreplayable, and
 *     the chain read over every case of the season with each case's opening
 *     snapshot (fact 3 of the design: a request that leaves the records out
 *     must not look clean);
 *   - not a story season (never on the public board anyway).
 *
 * Boards (설계안 1절 "판 나누기"): the table's own, `table-<RULES_MARK>`, for
 * the ordinary ranking (`week` null), and one per week's rule board
 * (`summary.week`, the server's). Each keeps its first three, best first in
 * the ranking's own order (buildLeaderboard), and only once ten seasons on it
 * passed (question 6 (1)); below that it is kept empty, 「표본 부족」.
 *
 * Each board is read on its own (assumption 4 of the draft, resolved): the
 * ten are counted over the whole board, not over the rows the day's check
 * replayed. A season counts when it is a complete public season on that board
 * with no mark at all (`suspicion` an empty array: the insert trigger judged
 * it and found nothing, and no daily check marked it), whether or not the
 * replay ever reached it. The server counts it, `hall_of_fame_counts()`
 * (20261102040000_hall_of_fame.sql), after the day's marks are written; the
 * CI job reads that count (HALL_OF_FAME_COUNTS_SQL) and hall_of_fame_settle
 * counts again itself, so a place below ten is refused whatever the call says.
 * The replay, which a place still needs, reads only each open board's first
 * HALL_OF_FAME_CANDIDATES seasons that could stand (verify-ranking-rows
 * --runs-sql), beside the ranking's top `limit` it always read for the marks.
 *
 * Tags are the ranking screen's own words (RankingScreen): NEW GAME+,
 * 테이블 시간 ×1.5 / ×2, 붕괴한 시즌. Table time and collapse stay as tags
 * (question 3 (1)), NEW GAME+ runs share the board (question 4 (1)).
 *
 * Nothing here names a player: run_tag, style, score and grade are what the
 * public board already shows (question 7 (1)).
 */
import { CHAIN_MARK, UNCHECKED } from "./chainRecheck.js";
import { CASE_SEQUENCE } from "./gameCases.js";
import { HALL_OF_FAME_MIN_SEASONS, HALL_OF_FAME_PLACES, WEEK_SETTLE_DAYS, hallOfFameBoardLabel } from "./hallOfFameBadges.js";
import { buildLeaderboard } from "./ranking.js";
import { RECHECK_MARKS } from "./rankingRecheck.js";

export { HALL_OF_FAME_MIN_SEASONS, HALL_OF_FAME_PLACES, WEEK_SETTLE_DAYS, hallOfFameBoardLabel };

/** The marks the daily check states whole each day; the trigger's are the rest. */
export const CHECKER_MARK_LIST = Object.freeze([...RECHECK_MARKS, CHAIN_MARK]);
const CHECKER_MARKS = new Set(CHECKER_MARK_LIST);

/**
 * Seasons the replay reads on each open board, best first, among those that
 * could stand (complete, no mark but the checker's own): enough for three
 * places with room for seven refused.
 */
export const HALL_OF_FAME_CANDIDATES = 10;

/** The one read-only SELECT of each board's count (hall_of_fame_counts, service role only). */
export const HALL_OF_FAME_COUNTS_SQL = "select board, checked from public.hall_of_fame_counts() order by board;";

/** That SELECT's answer as board -> count; anything else is left out. */
export function readHallOfFameCounts(rows = []) {
  const counts = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const checked = Number(row?.checked);
    if (typeof row?.board === "string" && Number.isInteger(checked) && checked >= 0) counts.set(row.board, checked);
  }
  return counts;
}

const WEEK_KEY = /^([0-9]{4})-W(0[1-9]|[1-4][0-9]|5[0-3])$/;

/** The table's own board: one per table rules mark (설계안 1절 본 판). */
export const tableBoard = (rulesMark) => `table-${rulesMark}`;

/**
 * Why a checked run may not stand in the hall of fame, or null when it may.
 * `result` is one of verifyRows' results; `rows` that run's rows as read.
 */
export function hallOfFameRefusal(result, rows) {
  const ranking = rows.find((row) => row?.case_id === "season-final");
  if (!ranking) return "no ranking row";
  if (ranking.summary?.seasonComplete !== true || typeof ranking.summary?.burstScore !== "number") return "not a complete season with a score";
  if (rows.some((row) => row?.summary?.assistStory === true)) return "story mode";
  if (result?.status !== "checked") return `not checked (${result?.status ?? "no result"})`;
  if (result.marks.length) return `marked: ${result.marks.join(", ")}`;
  if (!Array.isArray(ranking.suspicion)) return "never judged by the insert trigger";
  const trigger = ranking.suspicion.filter((mark) => !CHECKER_MARKS.has(mark));
  if (trigger.length) return `marked by the trigger: ${trigger.join(", ")}`;
  let unrecorded = 0;
  let unreplayable = 0;
  for (const entry of result.cases) {
    unrecorded += entry.windows.counts.unrecorded;
    unreplayable += entry.windows.counts.unreplayable;
  }
  if (unrecorded || unreplayable) return `${unrecorded} windows without a record, ${unreplayable} unreplayable`;
  const chain = result.chain;
  if (!chain || chain.status !== "linked" || chain.marks.length) return `chain ${chain?.status ?? "not read"}`;
  if (chain.cases.length !== CASE_SEQUENCE.length || chain.unchecked.cases || chain.unchecked.links) return "chain not read over the whole season";
  if (chain.unchecked.fields[UNCHECKED.open[0]]) return "cases without an opening snapshot";
  return null;
}

/** The board a ranking row stands on: its week's, or the table's. */
export function boardOf(ranking, rulesMark) {
  const week = ranking?.summary?.week;
  return typeof week === "string" && WEEK_KEY.test(week) ? week : tableBoard(rulesMark);
}

/** A season's tags, from its ranking row and its final case row (NEW GAME+ and table time are not published). */
export function hallOfFameTags(rows) {
  const ranking = rows.find((row) => row?.case_id === "season-final")?.summary ?? {};
  const final = rows.find((row) => row?.case_id === "final")?.summary ?? {};
  const tags = [];
  if (final.newGamePlus === true || ranking.newGamePlus === true) tags.push("NEW GAME+");
  const time = Number(final.assistTime ?? ranking.assistTime);
  if (time === 1.5 || time === 2) tags.push(`테이블 시간 ×${time}`);
  const ending = ranking.endingVariant ?? final.endingVariant;
  if ((ending?.id ?? ending) === "collapse") tags.push("붕괴한 시즌");
  return tags;
}

/**
 * The day's boards from the day's check: `results` from verifyRows, `rows`
 * every row read, `rulesMark` the table's, `counts` each board's count of
 * seasons with no mark (readHallOfFameCounts; the whole board, not the rows
 * read). The boards are the table's, always, so the day after a reset settles
 * the board before (hall_of_fame_settle), and each board a run read today
 * stands on; a board none was read for (settled, or nothing to replay) is not
 * written. Returns [{ board, checked, places: [{ run_tag, score, rank, style,
 * tags }] }], and beside it why each run left out was left out (by run tag,
 * for the log).
 */
export function pickHallOfFame({ results, rows, rulesMark, counts = new Map() }) {
  const byRun = new Map();
  for (const row of rows) {
    if (typeof row?.run_id !== "string" || !row.run_id) continue;
    if (!byRun.has(row.run_id)) byRun.set(row.run_id, []);
    byRun.get(row.run_id).push(row);
  }
  const countOf = (board) => (counts instanceof Map ? counts.get(board) : counts?.[board]) ?? 0;
  const boards = new Map([[tableBoard(rulesMark), []]]);
  const left = [];
  for (const result of results) {
    const runRows = byRun.get(result.runId) ?? [];
    const ranking = runRows.find((row) => row.case_id === "season-final");
    const board = boardOf(ranking, rulesMark);
    if (!boards.has(board)) boards.set(board, []);
    const refusal = hallOfFameRefusal(result, runRows);
    if (refusal) {
      left.push({ runTag: ranking?.run_tag ?? null, refusal });
      continue;
    }
    boards.get(board).push({ ranking, tags: hallOfFameTags(runRows) });
  }
  const picked = [...boards].map(([board, seasons]) => {
    const tagsOf = new Map(seasons.map(({ ranking, tags }) => [ranking.run_tag, tags]));
    // The server's order first (score, then the earlier season), then the
    // ranking screen's own tie-breaks; buildLeaderboard keeps a run once.
    const ordered = seasons
      .map(({ ranking }) => ({ run_tag: ranking.run_tag, case_id: "season-final", summary: ranking.summary, score: ranking.summary.burstScore, completed_at: ranking.completed_at ?? "" }))
      .sort((a, b) => b.score - a.score || String(a.completed_at).localeCompare(String(b.completed_at)));
    const entries = buildLeaderboard(ordered, HALL_OF_FAME_PLACES);
    const checked = countOf(board);
    const places = checked < HALL_OF_FAME_MIN_SEASONS
      ? []
      : entries.map((entry) => ({ run_tag: entry.runTag, score: entry.score, rank: entry.rank, style: entry.style, tags: tagsOf.get(entry.runTag) ?? [] }));
    return { board, checked, places };
  });
  return { boards: picked, left };
}

/**
 * The one statement that writes the day's boards (hall_of_fame_settle). Names
 * run tags only. The count is not sent: the function counts each board itself.
 */
export function hallOfFameSql(boards) {
  const json = JSON.stringify(boards.map(({ board, places }) => ({ board, places }))).replace(/'/g, "''");
  return `select public.hall_of_fame_settle('${json}'::jsonb) as settled;`;
}

/** The one read-only SELECT of the public view, for the page. */
export const HALL_OF_FAME_READ_SQL = [
  "select board, kind, checked_seasons, settled_on, updated_on, place, run_tag, score, rank, style, tags",
  "  from public.public_hall_of_fame",
  " order by board, place;",
].join("\n");

/** Monday 00:00 KST of a week key, + `days`, as the KST date (YYYY-MM-DD). */
export function weekSettlesOn(week, days = WEEK_SETTLE_DAYS) {
  const match = WEEK_KEY.exec(week ?? "");
  if (!match) return null;
  const year = Number(match[1]);
  const weekNo = Number(match[2]);
  // ISO week 1 holds 4 January.
  const jan4 = Date.UTC(year, 0, 4);
  const jan4Day = (new Date(jan4).getUTCDay() + 6) % 7;
  const monday = jan4 - jan4Day * 86400000 + (weekNo - 1) * 7 * 86400000;
  return new Date(monday + days * 86400000).toISOString().slice(0, 10);
}

/** The view's rows as boards: tables newest first, then weeks newest first. */
export function readHallOfFame(viewRows = []) {
  const boards = new Map();
  for (const row of viewRows) {
    if (!row || typeof row.board !== "string") continue;
    if (!boards.has(row.board)) {
      boards.set(row.board, {
        board: row.board,
        kind: row.kind === "week" ? "week" : "table",
        checked: Number(row.checked_seasons) || 0,
        settledOn: row.settled_on ? String(row.settled_on).slice(0, 10) : null,
        updatedOn: row.updated_on ? String(row.updated_on).slice(0, 10) : null,
        places: [],
      });
    }
    if (row.place != null && row.run_tag) {
      boards.get(row.board).places.push({ place: Number(row.place), runTag: row.run_tag, score: Number(row.score), rank: row.rank, style: row.style, tags: Array.isArray(row.tags) ? row.tags : [] });
    }
  }
  const order = (board) => (board.kind === "table" ? [0, Number(board.board.slice(6))] : [1, board.board]);
  return [...boards.values()]
    .map((board) => ({ ...board, places: board.places.sort((a, b) => a.place - b.place) }))
    .sort((a, b) => {
      const [ka, va] = order(a);
      const [kb, vb] = order(b);
      return ka - kb || (ka === 0 ? vb - va : String(vb).localeCompare(String(va)));
    });
}

/**
 * The page pushed to the `hall-of-fame` branch (설계안 2절 3): one table a
 * board. No name, no full run id, no time of play.
 */
export function formatHallOfFameMarkdown(boards) {
  const lines = [
    "# 명예의 전당",
    "",
    "매일 23:55(한국 시간) 랭킹 검사를 통과한 시즌 가운데 판마다 1~3위를 남깁니다. 랭킹을 비워도 이 표는 남습니다.",
    "",
    "- **들어가는 기록**: 공개 랭킹의 완주 시즌 가운데, 그날 검사가 처음부터 끝까지 다시 계산했고(다시 하기 기록이 빠진 판 없음) 표시가 하나도 없는 시즌만.",
    `- **문턱**: 그 판의 표시 없는 완주 시즌(저장 때 검사에서도, 매일 검사에서도 표시를 받지 않은 시즌, 판 전체에서 셈)이 ${HALL_OF_FAME_MIN_SEASONS}건이 안 되면 칸을 비워 두고 「표본 부족」으로 적습니다.`,
    `- **확정**: 본 판은 랭킹을 비울 때 마지막 날의 표가 최종입니다. 주간 판은 그 주 월요일 + ${WEEK_SETTLE_DAYS / 7}주 뒤 첫 검사에서 확정하고, 그때까지 「잠정」입니다.`,
    "- **보이는 것**: 실행 번호(`RUN` 뒤 여덟 글자), 판단 유형, 점수, 랭크, 꼬리표뿐입니다. 이름, 전체 실행 ID, 플레이 시각, 기기 정보는 담지 않습니다.",
    "- **검사가 못 잡는 것**: 검사는 기록이 규칙대로 나올 수 있었는지를 다시 해 볼 뿐이라, 기록과 결정을 서로 맞게 지어낸 봇은 잡지 못합니다. 「조작할 수 없음」이 아니라 「검사를 통과한 기록」입니다.",
    "",
  ];
  if (!boards.length) lines.push("아직 기록된 판이 없습니다.", "");
  for (const board of boards) {
    const status = board.settledOn ? `확정 ${board.settledOn}` : board.kind === "week" ? `잠정 · ${weekSettlesOn(board.board)} 뒤 확정` : "잠정 · 랭킹을 비울 때 확정";
    lines.push(`## ${hallOfFameBoardLabel(board.board)}`, "", `${status} · 표시 없는 완주 ${board.checked}건${board.updatedOn ? ` · 갱신 ${board.updatedOn}` : ""}`, "");
    if (!board.places.length) {
      lines.push("표본 부족", "");
      continue;
    }
    lines.push("| 순위 | 기록 | 판단 유형 | 점수 | 랭크 | 꼬리표 |", "|---|---|---|---|---|---|");
    for (const place of board.places) {
      lines.push(`| ${place.place} | RUN ${place.runTag} | ${place.style} | ${place.score} | ${place.rank} | ${place.tags.join(", ") || "—"} |`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
