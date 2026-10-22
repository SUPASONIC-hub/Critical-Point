import { useState } from "react";

import { readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

// The ranking starts over each time the season changes length: v1 held the
// five-case season, v2 the eleven-case one, v3 the twelve-case one, v4 the
// thirteen-case one, v5 the twenty-five-case one, v6 the fifty-case one (ten
// cases on 2026-09-18, twelve and then thirteen on 2026-09-21, twenty-five and
// then fifty on 2026-09-22). v7 is the fifty-five-case season: the 프롤로그
// added five cases in front of 사건 01 on 2026-09-23, so a season now starts
// three years earlier and every completed run before it was scored over a
// shorter one. v8 is the same season scored by the logic streak: until
// 2026-10-10 the hand's share of a pot came from timing a push to the
// heartbeat, and a score from that table does not compare with one from this.
// v9 is the same season at the table of 2026-10-20 (the day-ten table: fracture 8,
// the x1.6 streak and x1.5 LOCK caps, five tool slots, SCOUT), whose score does not compare with one from the table before it.
// v10 is the same season at RULES_MARK 3: B3's audit and B2's links are rules of the table from
// 프롤로그 04 (played first as 2026-W44's test week), and a vault the audit took a part of, or a
// board CASCADE pulled the wall of, does not compare with one from the table before.
// A retired key is read once, on first load, for one thing only: the player's best row of that
// table, kept under PERSONAL_BESTS_STORAGE_KEY (migrateRetiredRankingKeys). Then it is removed.
export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v10";
const RETIRED_LOCAL_RANKING_STORAGE_KEYS = [
  "critical-point-local-ranking-v1",
  "critical-point-local-ranking-v2",
  "critical-point-local-ranking-v3",
  "critical-point-local-ranking-v4",
  "critical-point-local-ranking-v5",
  "critical-point-local-ranking-v6",
  "critical-point-local-ranking-v7",
  "critical-point-local-ranking-v8",
  "critical-point-local-ranking-v9",
];

export function parseLocalRankingRows(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((row) => row && typeof row === "object" && row.case_id && row.summary).slice(-100)
      : [];
  } catch {
    return [];
  }
}

/**
 * A run has one row a case, and one for the season. A case played again -- the
 * finale above all, whose close writes the season's ranking row -- used to add
 * a row every time, so the local board could be filled by repeating one case.
 * The new row takes the place of the run's earlier one for that case; rows
 * with no run id (older ones) are left as they are.
 */
export function appendLocalRankingRowToRows(rows, row) {
  const sameRunAndCase = (item) => Boolean(row?.run_id) && item?.run_id === row.run_id && item?.case_id === row.case_id;
  return [...rows.filter((item) => !sameRunAndCase(item)), row]
    .filter((item) => item && typeof item === "object" && item.case_id && item.summary)
    .slice(-100);
}

/**
 * This device's best of each table gone by, one line a ranking key: a key moved
 * to the next and the player came back to an empty board, their best of the
 * table before lost (improvement note E-7). Kept as `{ v9: { score, rank,
 * ending, seasonComplete, completedAt, tableRules } }` and never put in the
 * table: a score of one table does not compare with one of another, so the
 * ranking screen says it on a line of its own (readLatestPersonalBest).
 * The score is the one that table gave, whatever the score means now.
 */
export const PERSONAL_BESTS_STORAGE_KEY = "critical-point-personal-bests";
const CURRENT_RANKING_VERSION = Number(LOCAL_RANKING_STORAGE_KEY.match(/-v(\d+)$/)[1]);
const RANK_WEIGHT = { S: 4, A: 3, B: 2, C: 1 };
const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function toBest(value) {
  if (!isPlainObject(value)) return null;
  const score = Number(value.score);
  if (typeof value.score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) return null;
  const rank = Object.hasOwn(RANK_WEIGHT, value.rank) ? value.rank : "C";
  const ending = typeof value.ending === "string" && value.ending ? value.ending.slice(0, 40) : null;
  const completedAt = typeof value.completedAt === "string" ? value.completedAt.slice(0, 40) : "";
  const tableRules = Number.isInteger(value.tableRules) ? value.tableRules : null;
  return { score, rank, ending, seasonComplete: value.seasonComplete === true, completedAt, tableRules };
}

/** A completed season over a partial one, then the score, then the rank (as buildLeaderboard ranks). */
function isBetterBest(entry, current) {
  if (!current) return true;
  if (entry.seasonComplete !== current.seasonComplete) return entry.seasonComplete;
  return entry.score > current.score || (entry.score === current.score && RANK_WEIGHT[entry.rank] > RANK_WEIGHT[current.rank]);
}

/** The best row of a retired key's stored value, or null; a value that is not rows is no best. */
export function pickPersonalBest(rawValue) {
  return parseLocalRankingRows(rawValue).reduce((best, row) => {
    const summary = isPlainObject(row.summary) ? row.summary : {};
    const ending = summary.endingVariant?.id ?? summary.endingVariant;
    const entry = toBest({
      score: [row.score, summary.burstScore, summary.momentumScore].find((value) => typeof value === "number"),
      rank: summary.rank,
      ending,
      seasonComplete: row.case_id === "season-final" || summary.seasonComplete === true,
      completedAt: row.completed_at,
      tableRules: summary.tableRules ?? summary.gauntlet?.tableRules,
    });
    return entry && isBetterBest(entry, best) ? entry : best;
  }, null);
}

export function parsePersonalBests(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "{}");
    if (!isPlainObject(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([version]) => /^v\d+$/.test(version))
        .map(([version, value]) => [version, toBest(value)])
        .filter(([, best]) => best),
    );
  } catch {
    return {};
  }
}

/**
 * Moves each retired key's best row to PERSONAL_BESTS_STORAGE_KEY and removes
 * the key. Safe to run again: a key that is gone adds nothing, and a best
 * already kept is replaced only by a better one. A key whose best could not be
 * written is left for the next load; a damaged value is dropped unread.
 */
export function migrateRetiredRankingKeys(keys = RETIRED_LOCAL_RANKING_STORAGE_KEYS) {
  const present = keys.map((key) => [key, readStoredValue(key, null)]).filter(([, raw]) => raw !== null);
  if (present.length === 0) return;
  const bests = parsePersonalBests(readStoredValue(PERSONAL_BESTS_STORAGE_KEY, "{}"));
  let changed = false;
  present.forEach(([key, raw]) => {
    const best = pickPersonalBest(raw);
    const version = `v${key.match(/-v(\d+)$/)?.[1]}`;
    if (best && isBetterBest(best, bests[version])) {
      bests[version] = best;
      changed = true;
    }
  });
  const kept = !changed || writeStoredValue(PERSONAL_BESTS_STORAGE_KEY, JSON.stringify(bests));
  if (kept) present.forEach(([key]) => removeStoredValue(key));
}

/** The newest table gone by that has a kept best, as `{ version: 9, score, rank }`, or null. */
export function readLatestPersonalBest() {
  const bests = parsePersonalBests(readStoredValue(PERSONAL_BESTS_STORAGE_KEY, "{}"));
  return Object.entries(bests)
    .map(([version, best]) => ({ ...best, version: Number(version.slice(1)) }))
    .filter((best) => best.version < CURRENT_RANKING_VERSION)
    .sort((a, b) => b.version - a.version)[0] ?? null;
}

function readLocalRankingRows() {
  migrateRetiredRankingKeys();
  return parseLocalRankingRows(readStoredValue(LOCAL_RANKING_STORAGE_KEY, "[]"));
}

function writeLocalRankingRows(rows) {
  return writeStoredValue(LOCAL_RANKING_STORAGE_KEY, JSON.stringify(rows));
}

export function useLocalRanking() {
  const [localRankingRows, setLocalRankingRows] = useState(readLocalRankingRows);

  function appendLocalRankingRow(row) {
    const nextRows = appendLocalRankingRowToRows(readLocalRankingRows(), row);
    const saved = writeLocalRankingRows(nextRows);
    setLocalRankingRows(nextRows);
    return { rows: nextRows, saved };
  }

  function clearLocalRankingRows() {
    setLocalRankingRows([]);
  }

  return {
    localRankingRows,
    appendLocalRankingRow,
    clearLocalRankingRows,
  };
}
