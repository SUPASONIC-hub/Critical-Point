import { getRankingLeague } from "./advancedSystems.js";

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

function normalizeEntry(row = {}) {
  const summary = parseSummary(row.summary);
  const rank = normalizeRank(summary.rank);
  const parsedScore = Number(summary.burstScore ?? summary.momentumScore);
  const runId = row.run_id ?? summary.runId ?? "";
  const reflectionScore = Number(summary.reflectionScore) || 0;
  const pressureAdaptScore = Number(summary.pressureAdaptScore) || 0;
  const freeCount = Number(summary.freeCount) || 0;
  const style = freeCount > 0 && reflectionScore >= pressureAdaptScore
    ? "BOARD BREAKER"
    : pressureAdaptScore >= reflectionScore + 12
      ? "RISK CUTTER"
      : reflectionScore >= 55
        ? "SYSTEM THINKER"
        : "FIELD DECIDER";
  return {
    id: `${runId || row.session_code || "local"}-${row.case_id ?? "case"}-${row.completed_at ?? "latest"}`,
    runId,
    runLabel: runId ? `RUN ${String(runId).slice(-8).toUpperCase()}` : "LOCAL RUN",
    sessionCode: row.session_code ?? "LOCAL",
    name: row.local ? String(row.player_name || "현재 분석관").slice(0, 24) : "익명 분석관",
    caseId: row.case_id ?? "case01",
    caseTitle: row.case_title ?? row.case_id ?? "CASE",
    completedAt: row.completed_at ?? "",
    rank,
    score: Number.isFinite(parsedScore) ? parsedScore : null,
    trigger: summary.primary?.[0] ?? "responsibility",
    averageResponseTime: Number(summary.averageResponseTime) || 0,
    freeCount,
    reflectionScore,
    pressureAdaptScore,
    cognitionScore: Number(summary.cognitionScore) || 0,
    style,
    league: getRankingLeague(style),
    seasonComplete: row.case_id === "season-final" || summary.seasonComplete === true,
    summary,
  };
}

export function buildLeaderboard(rows = [], limit = 50) {
  const normalized = rows
    .map(normalizeEntry)
    .filter((entry) => entry.score !== null && entry.score >= 0 && entry.score <= 100);
  const bestByRun = new Map();
  normalized.forEach((entry) => {
    const key = entry.runId || entry.id;
    const current = bestByRun.get(key);
    const shouldReplace = !current ||
      (entry.seasonComplete && !current.seasonComplete) ||
      (!entry.seasonComplete && !current.seasonComplete && (
        entry.score > current.score ||
        (entry.score === current.score && rankWeight[entry.rank] > rankWeight[current.rank])
      ));
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
    title: `${leader.name}이(가) 현재 기준선을 세웠습니다.`,
    text: `${leader.caseTitle}에서 ${leader.score}점과 ${leader.rank} 랭크를 기록했습니다.`,
  };
}
