import { useState } from "react";

import { readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

// The ranking starts over each time the season changes length: v1 held the
// five-case season, v2 the eleven-case one, v3 the twelve-case one, v4 the
// thirteen-case one, v5 the twenty-five-case one, v6 the fifty-case one (ten
// cases on 2026-09-18, twelve and then thirteen on 2026-09-21, twenty-five and
// then fifty on 2026-09-22). v7 is the fifty-five-case season: the 프롤로그
// added five cases in front of 사건 01 on 2026-09-23, so a season now starts
// three years earlier and every completed run before it was scored over a
// shorter one. Retired keys are never read and are removed on first load.
export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v7";
const RETIRED_LOCAL_RANKING_STORAGE_KEYS = [
  "critical-point-local-ranking-v1",
  "critical-point-local-ranking-v2",
  "critical-point-local-ranking-v3",
  "critical-point-local-ranking-v4",
  "critical-point-local-ranking-v5",
  "critical-point-local-ranking-v6",
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

export function appendLocalRankingRowToRows(rows, row) {
  return [...rows, row].filter((item) => item && typeof item === "object" && item.case_id && item.summary).slice(-100);
}

function readLocalRankingRows() {
  RETIRED_LOCAL_RANKING_STORAGE_KEYS.forEach((key) => removeStoredValue(key));
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
