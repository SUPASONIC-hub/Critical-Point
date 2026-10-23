import { useState } from "react";

import { readStoredValue, writeStoredValue } from "../appConfig.js";

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
// A retired key is read once, when the ranking screen first opens, for one thing only: the
// player's best row of that table, kept under the personal-bests key (src/personalBests.js,
// a chunk of its own, so the entry chunk does not carry it). Then it is removed. When this key
// moves on, the old one joins RETIRED_LOCAL_RANKING_STORAGE_KEYS there.
export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v10";

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

function readLocalRankingRows() {
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
