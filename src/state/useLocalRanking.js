import { useState } from "react";

import { readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

// v1 held rows from the five-case season and v2 from the eleven-case one. The
// ranking starts over each time the season changes length (ten cases on
// 2026-09-18, twelve on 2026-09-21), so retired keys are never read and are
// removed on first load.
export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v3";
const RETIRED_LOCAL_RANKING_STORAGE_KEYS = ["critical-point-local-ranking-v1", "critical-point-local-ranking-v2"];

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
