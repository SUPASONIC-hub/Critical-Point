import { useState } from "react";

import { readStoredValue, writeStoredValue } from "../appConfig.js";

export const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v1";

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

export function readLocalRankingRows() {
  return parseLocalRankingRows(readStoredValue(LOCAL_RANKING_STORAGE_KEY, "[]"));
}

export function writeLocalRankingRows(rows) {
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
