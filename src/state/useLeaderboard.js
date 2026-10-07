import { useEffect, useState } from "react";

import { buildLeaderboard } from "../ranking.js";
import { fetchLeaderboard } from "../telemetry.js";

/**
 * The ranking screen's 다시 불러오기. The screen is handed plain props by two
 * callers, and the request lives in this hook, so the press reaches it here
 * rather than through a prop both callers would have to pass down.
 */
const reloadListeners = new Set();

export function reloadLeaderboard() {
  reloadListeners.forEach((listener) => listener());
}

/**
 * Owns the ranking table shown by the ranking screen: remote rows merged with
 * this browser's own completed runs, plus the status/error copy that explains
 * which of the two the player is looking at. The remote rows are the server's
 * best-scored completed seasons (`fetchLeaderboard`), identified by run tag
 * only; `buildLeaderboard` matches this browser's copy of a run to its remote
 * row by that tag.
 *
 * Extracted from AppContent() unchanged; it only ever reads local rows and
 * never writes game state.
 */
export function useLeaderboard({ showRanking, isOnline, localLeaderboardRows, localSeasonLeaderboardRow }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const listener = () => setReloadToken((token) => token + 1);
    reloadListeners.add(listener);
    return () => {
      reloadListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!showRanking) return undefined;
    let cancelled = false;
    const localRows = [...localLeaderboardRows, ...(localSeasonLeaderboardRow ? [localSeasonLeaderboardRow] : [])];
    queueMicrotask(() => {
      if (cancelled) return;
      setLeaderboardStatus("loading");
      setLeaderboardError("");
    });
    fetchLeaderboard()
      .then(({ rows = [], skipped = false }) => {
        if (cancelled) return;
        setLeaderboard(buildLeaderboard([...rows, ...localRows]));
        setLeaderboardStatus(skipped ? "local" : "ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn(error);
        setLeaderboard(buildLeaderboard(localRows));
        setLeaderboardStatus(isOnline ? "error" : "local");
        setLeaderboardError(
          isOnline
            ? "원격 기록을 불러오지 못해 이 브라우저의 완료 기록만 표시합니다."
            : "오프라인이라 이 브라우저의 완료 기록만 표시합니다.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [isOnline, localLeaderboardRows, localSeasonLeaderboardRow, reloadToken, showRanking]);

  return { leaderboard, leaderboardStatus, leaderboardError };
}
