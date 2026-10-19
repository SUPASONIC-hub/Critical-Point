import { useEffect, useState, useSyncExternalStore } from "react";

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
 * Which board the screen shows: the ordinary ranking (no week, no rule), or a
 * week's rule's own (이번 주의 규칙, two tabs), named by its week for the
 * server and by its rule for this browser's rows. Kept here for the same
 * reason as the reload: the screen picks it, the hook its two callers run
 * fetches it, and neither caller passes it.
 */
const ORDINARY_BOARD = Object.freeze({ week: null, rule: null });
let leaderboardWeek = ORDINARY_BOARD;
const weekListeners = new Set();

export function selectLeaderboardWeek(week = null, rule = null) {
  const next = typeof week === "string" && week && typeof rule === "string" && rule ? { week, rule } : ORDINARY_BOARD;
  if (next.week === leaderboardWeek.week && next.rule === leaderboardWeek.rule) return;
  leaderboardWeek = next;
  weekListeners.forEach((listener) => listener());
}

function subscribeWeek(listener) {
  weekListeners.add(listener);
  return () => weekListeners.delete(listener);
}

const readWeek = () => leaderboardWeek;

export function useLeaderboardWeek() {
  return useSyncExternalStore(subscribeWeek, readWeek, readWeek);
}

/**
 * The rule a row of this browser's own was played under, or null: its board.
 * The device cannot know the week the server will write, so its rows are
 * told apart by the rule (a rule run in two weeks shares one local board).
 */
export function localRowRule(row) {
  const rule = row?.summary?.gauntlet?.weekRule;
  return typeof rule === "string" && rule ? rule : null;
}

/**
 * Owns the ranking table shown by the ranking screen: remote rows merged with
 * this browser's own completed runs, plus the status/error copy that explains
 * which of the two the player is looking at. The remote rows are the server's
 * best-scored completed seasons (`fetchLeaderboard`), identified by run tag
 * only; `buildLeaderboard` matches this browser's copy of a run to its remote
 * row by that tag. Both are of the board picked (`useLeaderboardWeek`).
 *
 * Extracted from AppContent() unchanged; it only ever reads local rows and
 * never writes game state.
 */
export function useLeaderboard({ showRanking, isOnline, localLeaderboardRows, localSeasonLeaderboardRow }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const board = useLeaderboardWeek();

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
    const localRows = [...localLeaderboardRows, ...(localSeasonLeaderboardRow ? [localSeasonLeaderboardRow] : [])]
      .filter((row) => localRowRule(row) === board.rule);
    queueMicrotask(() => {
      if (cancelled) return;
      setLeaderboardStatus("loading");
      setLeaderboardError("");
    });
    fetchLeaderboard(100, board.week)
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
  }, [isOnline, localLeaderboardRows, localSeasonLeaderboardRow, reloadToken, showRanking, board]);

  return { leaderboard, leaderboardStatus, leaderboardError };
}
