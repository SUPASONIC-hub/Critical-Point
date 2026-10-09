import { getRankingIntegrity, getRankingLeague } from "./advancedSystems.js";
import { triggerLabels } from "./gameConstants.js";
import { subjectParticle } from "./playerLanguage.js";

const rankWeight = { S: 4, A: 3, B: 2, C: 1 };

function normalizeRank(value) {
  return typeof value === "string" && Object.hasOwn(rankWeight, value) ? value : "C";
}

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function parseSummary(summary) {
  if (typeof summary !== "string") return isPlainObject(summary) ? summary : {};
  try {
    const parsed = JSON.parse(summary);
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * A remote row is whatever someone posted: the server types what it publishes
 * from 20260929010000 on, and rows from before that are as they were sent.
 * Every field the ranking screen prints is brought to its type here, so no row
 * can put an object where React expects text -- one such row in the top
 * hundred took the screen down for every visitor.
 */
const toText = (value, fallback = "") => (typeof value === "string" ? value : typeof value === "number" ? String(value) : fallback);
const toCount = (value) => {
  const number = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) && number > 0 ? number : 0;
};
const toTrigger = (value) => (typeof value === "string" && Object.hasOwn(triggerLabels, value) ? value : "responsibility");

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
  const toScore = (value) => (typeof value === "number" || (typeof value === "string" && value.trim() !== "") ? Number(value) : NaN);
  const serverScore = toScore(row.score);
  if (Number.isFinite(serverScore)) return serverScore;
  const burst = toScore(summary.burstScore);
  return Number.isFinite(burst) ? burst : toScore(summary.momentumScore);
}

function normalizeEntry(input = {}) {
  const row = isPlainObject(input) ? input : {};
  const summary = parseSummary(row.summary);
  const rank = normalizeRank(summary.rank);
  const parsedScore = readScore(row, summary);
  const runId = toText(row.run_id) || toText(summary.runId);
  const runTag = toText(row.run_tag) || getRunTag(runId);
  const reflectionScore = toCount(summary.reflectionScore);
  const pressureAdaptScore = toCount(summary.pressureAdaptScore);
  const reframeCount = toCount(summary.reframeCount);
  const style = reframeCount > 0 && reflectionScore >= pressureAdaptScore
    ? "BOARD BREAKER"
    : pressureAdaptScore >= reflectionScore + 12
      ? "RISK CUTTER"
      : reflectionScore >= 55
        ? "SYSTEM THINKER"
        : "FIELD DECIDER";
  const isLocal = row.local === true;
  const runLabel = runTag ? `RUN ${runTag}` : "LOCAL RUN";
  const caseId = toText(row.case_id);
  const completedAt = toText(row.completed_at);
  const localName = (toText(row.player_name) || "현재 분석관").slice(0, 24);
  return {
    id: `${runTag || toText(row.session_code) || "local"}-${caseId || "case"}-${completedAt || "latest"}`,
    runId,
    runTag,
    runLabel,
    sessionCode: toText(row.session_code) || "LOCAL",
    isLocal,
    name: isLocal ? localName : "익명 분석관",
    // Every remote row carries the same anonymous name, so the row is headed by
    // what the run did and identified by its own run label instead.
    headline: isLocal ? localName : style,
    handle: isLocal ? runLabel : `${runLabel} · 익명`,
    caseId: caseId || "case01",
    caseTitle: (toText(row.case_title) || caseId || "CASE").slice(0, 80),
    completedAt,
    rank,
    score: Number.isFinite(parsedScore) ? parsedScore : null,
    trigger: toTrigger(Array.isArray(summary.primary) ? summary.primary[0] : undefined),
    averageResponseTime: toCount(summary.averageResponseTime),
    reframeCount,
    // The table clock ran this many times slower for this run (the comfort
    // setting). 1 when the run did not use it, or the server has not been told
    // to publish the key yet.
    assistTime: [1.5, 2].includes(Number(summary.assistTime)) ? Number(summary.assistTime) : 1,
    // The run played a case in story mode. Such a season is never posted, so
    // this is true only on this device's own rows.
    assistStory: summary.assistStory === true,
    reflectionScore,
    pressureAdaptScore,
    cognitionScore: toCount(summary.cognitionScore),
    style,
    league: getRankingLeague(style),
    integrity: getRankingIntegrity({ runId: runId || runTag, completedAt, summary: { rank: toText(summary.rank) } }),
    seasonComplete: caseId === "season-final" || summary.seasonComplete === true,
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

/**
 * The ranking's status card, by what the table is doing. A headline is a
 * statement about the rows, so there is none until there are rows to read:
 * the card said "아직 공개된 기록이 없습니다" while the request was still out.
 * `canRetry` is a request that failed with the browser online; offline, the
 * table is fetched again when the connection returns.
 */
export function getLeaderboardStatusCopy({ status, headline, error = "" }) {
  if (status === "idle" || status === "loading") {
    return { loading: true, canRetry: false, eyebrow: "CONNECTING", title: "기록을 불러오는 중입니다.", text: "" };
  }
  return {
    loading: false,
    canRetry: status === "error",
    eyebrow: status === "ready" ? "REMOTE LEADERBOARD" : "LOCAL PLAYTEST BOARD",
    title: headline.title,
    text: error || headline.text,
  };
}

export function getLeaderboardHeadline(entries = []) {
  if (entries.length === 0) {
    return {
      title: "아직 공개된 기록이 없습니다.",
      text: "첫 번째 완주 기록이 이 테이블의 기준선을 만듭니다.",
    };
  }
  const leader = entries[0];
  // The particle follows the name; a parenthesised style is not read aloud.
  const leaderLabel = leader.isLocal ? leader.name : `${leader.name} (${leader.style})`;
  return {
    title: `${leaderLabel}${subjectParticle(leader.name)} 현재 기준선을 세웠습니다.`,
    text: `${leader.caseTitle}에서 ${leader.score}점과 ${leader.rank} 랭크를 기록했습니다.`,
  };
}
