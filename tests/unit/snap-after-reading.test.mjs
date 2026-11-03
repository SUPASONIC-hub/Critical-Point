import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
globalThis.sessionStorage = createStorage();

const { getGameplayStats, getObservationLedger, getObserverTag, READ_THROUGH_SHARE, readThrough } = await import("../../src/gameLogic.js");
const { noteBriefing, takeBriefingRead, takeReadingTally } = await import("../../src/state/readingTally.js");
const { getReadingSeconds } = await import("../../src/gauntlet/gauntletEngine.js");
const { nodes } = await import("../../src/gameData.js");
const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { recheckCaseScore } = await import("../../src/rankingRecheck.js");
const { normalizeSavedNestedState } = await import("../../src/state/savedState.js");
const { createSeasonBot } = await import("../../scripts/sim/season-bot.mjs");

/**
 * 2026-11-03, the user's answer 1: a pick inside two seconds of a table opened
 * after its briefing was read through (70% of the reading clock or more) is
 * not a snap, and 생각 리듬 reads it as the bottom of its steady band. A
 * table opened early and picked at once is a snap as before.
 */
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

beforeEach(() => {
  globalThis.sessionStorage = createStorage();
});

const FIRST_NODE = Object.keys(nodes).find((id) => nodes[id]?.choices?.length);
const pick = (overrides = {}) => ({ nodeId: FIRST_NODE, choiceId: "a", responseTimeSec: 1, ...overrides });
const statsOf = (entries) => getGameplayStats(entries, 0);

// The score before 2026-11-03, written out, for the rows it scored.
function oldPenalty(entries) {
  const scored = entries.filter((entry) => !entry.isSystemEvent);
  const list = scored.length > 0 ? scored : entries;
  return Math.min(18, list.filter((entry) => (entry.responseTimeSec ?? 0) <= 2 && !entry.reframe).length * 5);
}
function oldRhythm(entries) {
  const scored = entries.filter((entry) => !entry.isSystemEvent);
  const list = scored.length > 0 ? scored : entries;
  const times = list.map((entry) => Number(entry.responseTimeSec)).filter((value) => Number.isFinite(value) && value > 0);
  const samples = times.length > 0 ? times : [0];
  return Math.round(samples.reduce((sum, seconds) => {
    if (seconds >= 8 && seconds <= 28) return sum + 100;
    if (seconds >= 4 && seconds < 8) return sum + 70;
    if (seconds > 28 && seconds <= 45) return sum + 78 - (seconds - 28) * 1.8;
    if (seconds > 45) return sum + 38;
    return sum + 24;
  }, 0) / samples.length);
}

test("a page read to the end, then a pick in one second: no penalty, and the rhythm of a steady pick", () => {
  const entries = [pick({ readSec: 41, readClock: 41 }), pick({ readSec: 52.3, readClock: 41 })];
  const stats = statsOf(entries);
  assert.equal(stats.exploitPenalty, 0);
  assert.equal(stats.rhythmScore, 100, "read through, a one-second pick counts as eight seconds");
});

test("a table opened early and picked in one second is a snap, as it always was", () => {
  const entries = [pick({ readSec: 3, readClock: 41 }), pick({ readSec: 28.6, readClock: 41 }), pick()];
  const stats = statsOf(entries);
  assert.equal(stats.exploitPenalty, 15);
  assert.equal(stats.rhythmScore, 24);
});

test("the line is 70% of the page's clock, and a slower pick keeps its own table time", () => {
  assert.equal(READ_THROUGH_SHARE, 0.7);
  assert.equal(readThrough({ readSec: 28.7, readClock: 41 }), true);
  assert.equal(readThrough({ readSec: 28.6, readClock: 41 }), false);
  assert.equal(readThrough({ readSec: 41 }), false, "half of the record is no record");
  assert.equal(readThrough({ readClock: 41 }), false);
  assert.equal(readThrough({ readSec: 41, readClock: 0 }), false);
  // A 20-second pick after a full read is 20 seconds, not lifted or lowered.
  assert.equal(statsOf([pick({ responseTimeSec: 20, readSec: 41, readClock: 41 })]).rhythmScore, 100);
  assert.equal(statsOf([pick({ responseTimeSec: 40, readSec: 41, readClock: 41 })]).rhythmScore, statsOf([pick({ responseTimeSec: 40 })]).rhythmScore);
  // 판을 다시 짠다 was never a snap and still is not.
  assert.equal(statsOf([pick({ reframe: true })]).exploitPenalty, 0);
});

test("a held page counts the time it was up: held to wait, then opened and picked at once is not a snap", () => {
  // The stage adds every visible frame, held or not (GauntletStage's trackReading),
  // and the page reports its clock on each one.
  noteBriefing({ caseId: "case01", seconds: 35, byClock: false, held: true, clock: 41 });
  const briefing = takeBriefingRead();
  assert.deepEqual(briefing, { readSec: 35, readClock: 41 });
  assert.equal(statsOf([pick(briefing)]).exploitPenalty, 0);
  assert.equal(takeBriefingRead(), null, "taken once: a later decision without a page of its own carries nothing");
  // The case row's tally still counts the page as before.
  assert.equal(takeReadingTally().readHeld, 1);
  const stage = read("src/gauntlet/GauntletStage.jsx");
  const briefingPage = read("src/gauntlet/SceneBriefing.jsx");
  assert.match(briefingPage, /readingRef\.current\?\.\(step, heldRef\.current, readSeconds\)/, "every frame reports, held or not, with the page's clock");
  assert.match(stage, /page\.seconds \+= seconds;/);
  assert.match(stage, /noteBriefing\(\{ caseId: scene\.node\.caseId, byClock, \.\.\.readingRef\.current \}\)/);
});

test("a page that reports no clock keeps no record, and the decision is read as before", () => {
  noteBriefing({ caseId: "case01", seconds: 60 });
  assert.equal(takeBriefingRead(), null);
});

test("every scene of the season, prologue to final, is held to the same line", () => {
  // The rule reads the entry alone: no case, scene, week rule, NEW GAME+,
  // folded scene or story mode is named in it. The page's clock is the one
  // the briefing prints (told, week rules and all), so each of them only moves
  // the clock, never the line.
  const logic = read("src/gameLogic.js");
  const body = logic.slice(logic.indexOf("export function readThrough"), logic.indexOf("export function getGameplayStats"));
  for (const word of ["caseId", "nodeId", "weekRule", "newGamePlus", "veteran", "story", "told", "held"]) {
    assert.doesNotMatch(body, new RegExp(word), `readThrough does not read ${word}`);
  }
  const commit = read("src/state/useChoiceCommit.js");
  assert.match(commit, /const briefingRead = closedWindow \? takeBriefingRead\(\) : null;/, "every table decision takes its page, whatever the case");
  const cases = new Set();
  let scenes = 0;
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (!node?.choices?.length) continue;
    cases.add(node.caseId);
    scenes += 1;
    for (const breach of [[], [{ label: "WEEK", title: "주간 규칙", text: "이번 주의 규칙이 판 아래에 붙는다." }]]) {
      const clock = getReadingSeconds(node, breach);
      const at = Math.ceil(clock * READ_THROUGH_SHARE * 10) / 10;
      const short = Math.floor(clock * READ_THROUGH_SHARE * 10 - 1) / 10;
      assert.equal(statsOf([pick({ nodeId, readSec: clock, readClock: clock })]).exploitPenalty, 0, `${nodeId} read to the end`);
      assert.equal(statsOf([pick({ nodeId, readSec: at, readClock: clock })]).exploitPenalty, 0, `${nodeId} at 70%`);
      assert.equal(statsOf([pick({ nodeId, readSec: short, readClock: clock })]).exploitPenalty, 5, `${nodeId} under 70%`);
    }
  }
  assert.ok(scenes > 1000, `${scenes} scenes`);
  for (const caseId of CASE_SEQUENCE) assert.ok(cases.has(caseId), `${caseId} has scenes`);
});

test("a save keeps both numbers, and drops a half or a broken record", () => {
  const log = [
    pick({ readSec: 30, readClock: 41 }),
    pick({ readSec: 30 }),
    pick({ readSec: "30", readClock: 41 }),
    pick({ readSec: 30, readClock: -1 }),
  ];
  const state = normalizeSavedNestedState({ log });
  const kept = state.log.map(({ readSec, readClock }) => ({ readSec, readClock }));
  assert.deepEqual(kept, [
    { readSec: 30, readClock: 41 },
    { readSec: undefined, readClock: undefined },
    { readSec: undefined, readClock: undefined },
    { readSec: undefined, readClock: undefined },
  ]);
});

test("a row from before the change is scored again exactly as it was", () => {
  // Bot seasons log no briefing, as every row before 2026-11-03 did.
  for (const [seed, archetype] of [[7, "balanced"], [11, "random"], [23, "money"]]) {
    const season = createSeasonBot({ seed }).playSeason(0, archetype);
    for (const caseId of CASE_SEQUENCE) {
      const log = season.caseLogs[caseId];
      if (!log) continue;
      const stats = statsOf(log);
      assert.equal(stats.exploitPenalty, oldPenalty(log), `${seed} ${caseId} penalty`);
      assert.equal(stats.rhythmScore, oldRhythm(log), `${seed} ${caseId} rhythm`);
    }
    const row = { case_id: "final", summary: season.caseResults.final, decision_log: season.final.log, resources: season.final.resources };
    assert.equal(recheckCaseScore(row).status, "match");
  }
});

test("the observer's 순응 표본 holds the same line: read through, a quick safe pick is not one; opened early, it is", () => {
  // 2026-11-03, the user's answer 1 B. A safe pick: no risk moved, no person paid, no reframe.
  const readFirst = pick({ readSec: 41, readClock: 41 });
  const early = pick({ readSec: 5, readClock: 41 });
  assert.notEqual(getObserverTag(readFirst).id, "compliance");
  assert.equal(getObserverTag(early).id, "compliance");
  assert.equal(getObserverTag(pick()).id, "compliance", "a decision logged before the change reads as it did");
  assert.equal(getObservationLedger([readFirst, early, pick()]).compliance, 2);
  assert.equal(getObservationLedger([readFirst, readFirst]).compliance, 0);
});
