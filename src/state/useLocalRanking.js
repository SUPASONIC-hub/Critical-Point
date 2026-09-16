import { useState } from "react";

import { readStoredValue, removeStoredValue, writeStoredValue } from "../appConfig.js";

// v1 held rows from the five-case season. The ranking started over when the
// season became ten cases, so v1 is never read and is removed on first load.
export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v2";
const RETIRED_LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v1";

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
  removeStoredValue(RETIRED_LOCAL_RANKING_STORAGE_KEY);
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
