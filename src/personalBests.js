// The ranking keys a season left behind (src/state/useLocalRanking.js says
// why each one moved on). Each is read once, for its best row, then removed.
// This module is fetched by the ranking screen when it opens, as a chunk of its
// own: the entry chunk, which loads before the intro paints, does not carry it.
// It imports nothing, so the screen's fetch carries no list of files to
// preload beside it; the storage reads and the row filter are written here
// again for that (appConfig.js, parseLocalRankingRows), and the current
// ranking version is the one after the last retired key (a unit test holds
// it to LOCAL_RANKING_STORAGE_KEY).
export const RETIRED_LOCAL_RANKING_STORAGE_KEYS = [
  "critical-point-local-ranking-v1",
  "critical-point-local-ranking-v2",
  "critical-point-local-ranking-v3",
  "critical-point-local-ranking-v4",
  "critical-point-local-ranking-v5",
  "critical-point-local-ranking-v6",
  "critical-point-local-ranking-v7",
  "critical-point-local-ranking-v8",
  "critical-point-local-ranking-v9",
];

/**
 * This device's best of each table gone by, one line a ranking key: a key moved
 * to the next and the player came back to an empty board, their best of the
 * table before lost (improvement note E-7). Kept as `{ v9: { score, rank,
 * ending, seasonComplete, completedAt, tableRules } }` and never put in the
 * table: a score of one table does not compare with one of another, so the
 * ranking screen says it on a line of its own (readLatestPersonalBest).
 * The score is the one that table gave, whatever the score means now.
 */
export const PERSONAL_BESTS_STORAGE_KEY = "critical-point-personal-bests";
const CURRENT_RANKING_VERSION = RETIRED_LOCAL_RANKING_STORAGE_KEYS.length + 1;
const RANK_WEIGHT = { S: 4, A: 3, B: 2, C: 1 };
const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function readStoredValue(key, fallback) {
  try {
    return globalThis.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Whether the value was written; a full or refused storage is false. */
function writeStoredValue(key, value) {
  try {
    globalThis.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStoredValue(key) {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // Left for the next open, which reads it again and keeps nothing worse.
  }
}

/** A ranking key's rows, as parseLocalRankingRows reads them. */
function parseRankingRows(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    return Array.isArray(parsed) ? parsed.filter((row) => row && typeof row === "object" && row.case_id && row.summary).slice(-100) : [];
  } catch {
    return [];
  }
}

function toBest(value) {
  if (!isPlainObject(value)) return null;
  const score = Number(value.score);
  if (typeof value.score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) return null;
  const rank = Object.hasOwn(RANK_WEIGHT, value.rank) ? value.rank : "C";
  const ending = typeof value.ending === "string" && value.ending ? value.ending.slice(0, 40) : null;
  const completedAt = typeof value.completedAt === "string" ? value.completedAt.slice(0, 40) : "";
  const tableRules = Number.isInteger(value.tableRules) ? value.tableRules : null;
  return { score, rank, ending, seasonComplete: value.seasonComplete === true, completedAt, tableRules };
}

/** A completed season over a partial one, then the score, then the rank (as buildLeaderboard ranks). */
function isBetterBest(entry, current) {
  if (!current) return true;
  if (entry.seasonComplete !== current.seasonComplete) return entry.seasonComplete;
  return entry.score > current.score || (entry.score === current.score && RANK_WEIGHT[entry.rank] > RANK_WEIGHT[current.rank]);
}

/** The best row of a retired key's stored value, or null; a value that is not rows is no best. */
export function pickPersonalBest(rawValue) {
  return parseRankingRows(rawValue).reduce((best, row) => {
    const summary = isPlainObject(row.summary) ? row.summary : {};
    const ending = summary.endingVariant?.id ?? summary.endingVariant;
    const entry = toBest({
      score: [row.score, summary.burstScore, summary.momentumScore].find((value) => typeof value === "number"),
      rank: summary.rank,
      ending,
      seasonComplete: row.case_id === "season-final" || summary.seasonComplete === true,
      completedAt: row.completed_at,
      tableRules: summary.tableRules ?? summary.gauntlet?.tableRules,
    });
    return entry && isBetterBest(entry, best) ? entry : best;
  }, null);
}

export function parsePersonalBests(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "{}");
    if (!isPlainObject(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([version]) => /^v\d+$/.test(version))
        .map(([version, value]) => [version, toBest(value)])
        .filter(([, best]) => best),
    );
  } catch {
    return {};
  }
}

/**
 * Moves each retired key's best row to PERSONAL_BESTS_STORAGE_KEY and removes
 * the key. Safe to run again: a key that is gone adds nothing, and a best
 * already kept is replaced only by a better one. A key whose best could not be
 * written is left for the next load; a damaged value is dropped unread.
 */
export function migrateRetiredRankingKeys(keys = RETIRED_LOCAL_RANKING_STORAGE_KEYS) {
  const present = keys.map((key) => [key, readStoredValue(key, null)]).filter(([, raw]) => raw !== null);
  if (present.length === 0) return;
  const bests = parsePersonalBests(readStoredValue(PERSONAL_BESTS_STORAGE_KEY, "{}"));
  let changed = false;
  present.forEach(([key, raw]) => {
    const best = pickPersonalBest(raw);
    const version = `v${key.match(/-v(\d+)$/)?.[1]}`;
    if (best && isBetterBest(best, bests[version])) {
      bests[version] = best;
      changed = true;
    }
  });
  const kept = !changed || writeStoredValue(PERSONAL_BESTS_STORAGE_KEY, JSON.stringify(bests));
  if (kept) present.forEach(([key]) => removeStoredValue(key));
}

/** The newest table gone by that has a kept best, as `{ version: 9, score, rank }`, or null. */
export function readLatestPersonalBest() {
  const bests = parsePersonalBests(readStoredValue(PERSONAL_BESTS_STORAGE_KEY, "{}"));
  return Object.entries(bests)
    .map(([version, best]) => ({ ...best, version: Number(version.slice(1)) }))
    .filter((best) => best.version < CURRENT_RANKING_VERSION)
    .sort((a, b) => b.version - a.version)[0] ?? null;
}

/**
 * What the ranking screen asks for when it opens: the retired keys moved
 * first, then the newest past best as its line, or null. The words are here
 * and not in the screen's chunk, which has no room for them.
 */
export function takePastBestLine() {
  migrateRetiredRankingKeys();
  const best = readLatestPersonalBest();
  return best && `지난 판(v${best.version})의 내 최고 ${best.score}점 · ${best.rank}`;
}
