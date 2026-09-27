import { getRankingIntegrity, getRankingLeague } from "./advancedSystems.js";

const rankWeight = { S: 4, A: 3, B: 2, C: 1 };

function normalizeRank(value) {
  return typeof value === "string" && Object.hasOwn(rankWeight, value) ? value : "C";
}

function parseSummary(summary) {
  if (!summary) return {};
  if (typeof summary === "string") {
    try {
      return JSON.parse(summary);
    } catch {
      return {};
    }
  }
  return summary;
}

/**
 * The short run label, computed the way the `run_tag` column is
 * (20260928000000): the last eight letters and digits, upper-cased. Remote rows
 * carry only this -- the full run id is not public -- so it is also what a
 * local row and its own remote copy are matched on.
 */
function getRunTag(runId) {
  return String(runId ?? "").replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
}

function readScore(row, summary) {
  const serverScore = row.score === null || row.score === undefined || row.score === "" ? NaN : Number(row.score);
  return Number.isFinite(serverScore) ? serverScore : Number(summary.burstScore ?? summary.momentumScore);
}

function normalizeEntry(row = {}) {
  const summary = parseSummary(row.summary);
  const rank = normalizeRank(summary.rank);
  const parsedScore = readScore(row, summary);
  const runId = row.run_id ?? summary.runId ?? "";
  const runTag = row.run_tag || getRunTag(runId);
  const reflectionScore = Number(summary.reflectionScore) || 0;
  const pressureAdaptScore = Number(summary.pressureAdaptScore) || 0;
  const reframeCount = Number(summary.reframeCount) || 0;
  const style = reframeCount > 0 && reflectionScore >= pressureAdaptScore
    ? "BOARD BREAKER"
    : pressureAdaptScore >= reflectionScore + 12
      ? "RISK CUTTER"
      : reflectionScore >= 55
        ? "SYSTEM THINKER"
        : "FIELD DECIDER";
  const isLocal = Boolean(row.local);
  const runLabel = runTag ? `RUN ${runTag}` : "LOCAL RUN";
  return {
    id: `${runTag || row.session_code || "local"}-${row.case_id ?? "case"}-${row.completed_at ?? "latest"}`,
    runId,
    runTag,
    runLabel,
    sessionCode: row.session_code ?? "LOCAL",
    isLocal,
    name: isLocal ? String(row.player_name || "현재 분석관").slice(0, 24) : "익명 분석관",
    // Every remote row carries the same anonymous name, so the row is headed by
    // what the run did and identified by its own run label instead.
    headline: isLocal ? String(row.player_name || "현재 분석관").slice(0, 24) : style,
    handle: isLocal ? runLabel : `${runLabel} · 익명`,
    caseId: row.case_id ?? "case01",
    caseTitle: row.case_title ?? row.case_id ?? "CASE",
    completedAt: row.completed_at ?? "",
    rank,
    score: Number.isFinite(parsedScore) ? parsedScore : null,
    trigger: summary.primary?.[0] ?? "responsibility",
    averageResponseTime: Number(summary.averageResponseTime) || 0,
    reframeCount,
    reflectionScore,
    pressureAdaptScore,
    cognitionScore: Number(summary.cognitionScore) || 0,
    style,
    league: getRankingLeague(style),
    integrity: getRankingIntegrity({ runId: runId || runTag, completedAt: row.completed_at, summary }),
    seasonComplete: row.case_id === "season-final" || summary.seasonComplete === true,
    summary,
  };
}

export function buildLeaderboard(rows = [], limit = 50) {
  const normalized = rows
    .map(normalizeEntry)
    .filter((entry) => entry.score !== null && entry.score >= 0 && entry.score <= 100);
  const bestByRun = new Map();
  const outranks = (entry, current) =>
    entry.score > current.score ||
    (entry.score === current.score && rankWeight[entry.rank] > rankWeight[current.rank]);
  normalized.forEach((entry) => {
    const key = entry.runTag || entry.id;
    const current = bestByRun.get(key);
    // A completed season always beats a partial one; within the same tier the
    // better score wins, so duplicate submissions of one run cannot pin the
    // leaderboard to whichever row happened to arrive first. On a tie this
    // browser's own copy wins: it is the one that knows the full run id, which
    // is how the ranking screen marks the player's current run.
    const shouldReplace = !current ||
      (entry.seasonComplete && !current.seasonComplete) ||
      (entry.seasonComplete === current.seasonComplete &&
        (outranks(entry, current) || (entry.isLocal && !current.isLocal && !outranks(current, entry))));
    if (shouldReplace) {
      bestByRun.set(key, entry);
    }
  });

  return [...bestByRun.values()]
    .sort(
      (a, b) =>
        b.score - a.score ||
        rankWeight[b.rank] - rankWeight[a.rank] ||
        b.reflectionScore - a.reflectionScore ||
        b.pressureAdaptScore - a.pressureAdaptScore ||
        b.cognitionScore - a.cognitionScore ||
        a.averageResponseTime - b.averageResponseTime,
    )
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}

export function getLeaderboardHeadline(entries = []) {
  if (entries.length === 0) {
    return {
      title: "아직 공개된 기록이 없습니다.",
      text: "첫 번째 완주 기록이 이 테이블의 기준선을 만듭니다.",
    };
  }
  const leader = entries[0];
  return {
    title: `${leader.isLocal ? leader.name : `${leader.name} (${leader.style})`}이(가) 현재 기준선을 세웠습니다.`,
    text: `${leader.caseTitle}에서 ${leader.score}점과 ${leader.rank} 랭크를 기록했습니다.`,
  };
}
