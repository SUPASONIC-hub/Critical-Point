import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { readFileSync } from "node:fs";

import {
  migrateRetiredRankingKeys,
  parsePersonalBests,
  PERSONAL_BESTS_STORAGE_KEY,
  pickPersonalBest,
  readLatestPersonalBest,
  RETIRED_LOCAL_RANKING_STORAGE_KEYS,
  takePastBestLine,
} from "../../src/personalBests.js";
import { LOCAL_RANKING_STORAGE_KEY } from "../../src/state/useLocalRanking.js";

/**
 * A ranking key moved on (v9 to v10) and a returning player found an empty
 * board: the retired key was removed unread (improvement note E-7). Its best
 * row is now kept under the personal-bests key first, and the key removed.
 */
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
beforeEach(() => store.clear());

const V9 = "critical-point-local-ranking-v9";
const V8 = "critical-point-local-ranking-v8";
const row = (case_id, summary, extra = {}) => ({ local: true, run_id: "run-a", case_id, completed_at: "2026-10-21T09:00:00.000Z", summary, ...extra });
const v9Rows = [
  row("case03", { burstScore: 91, rank: "S", gauntlet: { tableRules: 2 } }),
  row("season-final", { burstScore: 82, rank: "A", seasonComplete: true, endingVariant: { id: "collapse" }, gauntlet: { tableRules: 2 } }),
  row("season-final", { burstScore: 82, rank: "B", seasonComplete: true }),
];

test("the best of a retired key moves to personal-bests and the key goes", () => {
  store.set(V9, JSON.stringify(v9Rows));
  migrateRetiredRankingKeys();
  assert.equal(store.has(V9), false, "the retired key is removed");
  assert.deepEqual(parsePersonalBests(store.get(PERSONAL_BESTS_STORAGE_KEY)), {
    v9: { score: 82, rank: "A", ending: "collapse", seasonComplete: true, completedAt: "2026-10-21T09:00:00.000Z", tableRules: 2 },
  }, "a completed season beats a higher partial one, and a tie goes to the better rank");
  assert.deepEqual(readLatestPersonalBest(), { ...parsePersonalBests(store.get(PERSONAL_BESTS_STORAGE_KEY)).v9, version: 9 });
});

test("running it again changes nothing, and a better best already kept stays", () => {
  store.set(V9, JSON.stringify(v9Rows));
  migrateRetiredRankingKeys();
  const kept = store.get(PERSONAL_BESTS_STORAGE_KEY);
  migrateRetiredRankingKeys();
  assert.equal(store.get(PERSONAL_BESTS_STORAGE_KEY), kept);
  store.set(V9, JSON.stringify([row("season-final", { burstScore: 40, rank: "C", seasonComplete: true })]));
  migrateRetiredRankingKeys();
  assert.equal(parsePersonalBests(store.get(PERSONAL_BESTS_STORAGE_KEY)).v9.score, 82, "a worse row does not replace the kept best");
  assert.equal(store.has(V9), false);
});

test("an empty or damaged retired value is dropped without a best", () => {
  store.set(V9, "not json");
  store.set(V8, "[]");
  migrateRetiredRankingKeys();
  assert.equal(store.has(V9) || store.has(V8), false, "both keys are removed");
  assert.equal(store.has(PERSONAL_BESTS_STORAGE_KEY), false, "nothing is written");
  assert.equal(readLatestPersonalBest(), null);
  assert.equal(pickPersonalBest(JSON.stringify([row("case01", { burstScore: 140 }), row("case02", { burstScore: "88" })])), null, "scores off the scale or not numbers are no best");
});

test("an older key keeps its own line, and the screen reads the newest", () => {
  store.set(V8, JSON.stringify([row("season-final", { momentumScore: 95, rank: "S", seasonComplete: true })]));
  store.set(V9, JSON.stringify(v9Rows));
  migrateRetiredRankingKeys();
  const bests = parsePersonalBests(store.get(PERSONAL_BESTS_STORAGE_KEY));
  assert.deepEqual(Object.keys(bests).sort(), ["v8", "v9"]);
  assert.equal(readLatestPersonalBest().version, 9, "v9 is shown, not v8's higher score");
});

test("a damaged personal-bests value reads as none, and the current key is never a past best", () => {
  store.set(PERSONAL_BESTS_STORAGE_KEY, "{broken");
  assert.equal(readLatestPersonalBest(), null);
  const current = LOCAL_RANKING_STORAGE_KEY.match(/-v(\d+)$/)[1];
  store.set(PERSONAL_BESTS_STORAGE_KEY, JSON.stringify({ [`v${current}`]: { score: 99, rank: "S" }, v9: { score: "x" }, junk: { score: 1 } }));
  assert.equal(readLatestPersonalBest(), null);
});

test("a best that could not be written leaves the retired key for the next load", () => {
  store.set(V9, JSON.stringify(v9Rows));
  const setItem = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => { throw new Error("quota"); };
  try {
    migrateRetiredRankingKeys();
  } finally {
    globalThis.localStorage.setItem = setItem;
  }
  assert.equal(store.has(V9), true);
});

test("with no past best the screen gets no line", () => {
  assert.equal(takePastBestLine(), null);
});

test("the ranking screen's call moves the retired keys once, then only reads", () => {
  store.set(V9, JSON.stringify(v9Rows));
  store.set(LOCAL_RANKING_STORAGE_KEY, JSON.stringify([row("case01", { burstScore: 99, rank: "S" })]));
  const first = takePastBestLine();
  assert.equal(first, "지난 판(v9)의 내 최고 82점 · A");
  assert.equal(store.has(V9), false, "the retired key is removed");
  assert.equal(store.has(LOCAL_RANKING_STORAGE_KEY), true, "the current key is never touched");
  const kept = store.get(PERSONAL_BESTS_STORAGE_KEY);
  assert.equal(takePastBestLine(), first, "a second open reads the same best");
  assert.equal(store.get(PERSONAL_BESTS_STORAGE_KEY), kept, "and writes nothing");
});

test("the current key is not a retired one, and every retired key is older", () => {
  const current = Number(LOCAL_RANKING_STORAGE_KEY.match(/-v(\d+)$/)[1]);
  assert.equal(RETIRED_LOCAL_RANKING_STORAGE_KEYS.includes(LOCAL_RANKING_STORAGE_KEY), false);
  for (const key of RETIRED_LOCAL_RANKING_STORAGE_KEYS) assert.ok(Number(key.match(/-v(\d+)$/)[1]) < current, key);
  assert.deepEqual(RETIRED_LOCAL_RANKING_STORAGE_KEYS, Array.from({ length: current - 1 }, (_, i) => `critical-point-local-ranking-v${i + 1}`), "every key before the current one is retired, so the module's current version is the ranking's");
});

test("the entry's modules do not carry the move: the ranking screen fetches it", () => {
  const source = (file) => readFileSync(new URL(`../../src/${file}`, import.meta.url), "utf8");
  assert.doesNotMatch(source("state/useLocalRanking.js"), /^import .*personalBests|RETIRED_LOCAL_RANKING_STORAGE_KEYS = |removeStoredValue/m);
  assert.match(source("screens/RankingScreen.jsx"), /import\("\.\.\/personalBests\.js"\)/);
  assert.doesNotMatch(source("personalBests.js"), /^import /m, "it imports nothing, so its fetch has no files to preload");
  assert.doesNotMatch(source("screens/RankingScreen.jsx"), /^import .*personalBests/m);
});
