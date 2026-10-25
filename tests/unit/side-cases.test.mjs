import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * E-11 번외 사건 (E11-번외사건-설계안, all (1)): the side-case framework.
 *
 * A side case is outside the season: not in CASE_SEQUENCE, no server row, no
 * ranking row, no settled-window log, nothing in the season save, NEW GAME+,
 * the season record or the past picks -- a completion mark on this device and
 * nothing else. These tests hold it to that (설계안 6절, tests 1-8).
 */

const {
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  PAST_PICKS_KEY,
  SEASON_RECORD_KEY,
  SEEN_SCENES_KEY,
  SETTLED_WINDOWS_STORAGE_KEY,
  SIDE_CASES_KEY,
  STORAGE_KEY,
} = await import("../../src/appConfig.js");
const config = await import("../../src/appConfig.js");
const { LOCAL_RANKING_STORAGE_KEY, appendLocalRankingRowToRows, parseLocalRankingRows } = await import("../../src/state/useLocalRanking.js");

// The season's numbers, read before a side case is so much as imported.
const gameCases = await import("../../src/gameCases.js");
const { getAchievementProgress } = await import("../../src/featurePack.js");
const { ANALYST_TITLE_STEPS } = await import("../../src/analystTitle.js");
const engine = await import("../../src/gauntlet/gauntletEngine.js");
const fingerprint = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const ENGINE_CONSTANTS = () =>
  fingerprint({
    base: engine.BASE_SCHEMA,
    bust: engine.BUST_EFFECT,
    gauge: engine.GAUGE_MAX,
    rules: [engine.RULES_MARK_KEY, engine.RULES_MARK],
    initial: engine.RUN_INITIAL_STATE,
    mutations: Object.keys(engine.MUTATIONS),
    focus: [engine.FOCUS_MAX, engine.HAND_CAP, engine.LOCK_CAP, engine.STANCE_CHARGE, engine.STANCE_MASTERY_GOAL],
  });
// The season's ranking row and its telemetry row, as one fixed season makes them.
const seasonViews = await import("../../src/viewModels/seasonViewModels.js");
const SEASON_INPUT = {
  caseSummary: { score: 812, rank: "A", endingVariant: "open-question", completedAt: "2026-11-30T09:00:00.000Z" },
  title: "기록 분석관",
  completedCaseCount: 55,
  playerName: "테스터",
  runId: "season-1",
  sessionCode: "AB12",
  sessionId: "session-1",
  cognition: { inference: 3 },
  decisionLog: [],
  resources: { time: 40, capital: 60, trust: 55, legitimacy: 58, humanCost: 12, fatigue: 30 },
  triggers: { trust: 6 },
};
// The telemetry row's event id is new each time it is made; everything else is compared.
const seasonRows = () => {
  const { event_id: _eventId, ...telemetryRow } = seasonViews.createSeasonTelemetryPayload(SEASON_INPUT);
  return JSON.stringify([seasonViews.createSeasonLeaderboardRow(SEASON_INPUT), telemetryRow]);
};
const seasonNumbersBefore = {
  rows: seasonRows(),
  sequence: [...gameCases.CASE_SEQUENCE],
  goals: getAchievementProgress({}).map(({ id, goal }) => [id, goal]),
  titles: JSON.stringify(ANALYST_TITLE_STEPS),
  engine: ENGINE_CONSTANTS(),
};

const { side00 } = await import("../../src/nodes/side00.js");
const { side01 } = await import("../../src/nodes/side01.js");
const { side02 } = await import("../../src/nodes/side02.js");
const { SIDE_CASES } = await import("../../src/nodes/sidePacks.js");
const sideCases = await import("../../src/sideCases.js");
const sideMarks = await import("../../src/state/sideMarks.js");
const sideRun = await import("../../src/state/sideRun.js");
const { checkSidePack } = await import("../../src/state/sidePackCheck.js");
const { nodes } = await import("../../src/gameData.js");

const CASHED = { status: "cashed", cause: "cash", gauge: 42, wall: 90, pushes: 3, elapsed: 6 };
const BUST = { status: "bust", cause: "wall", gauge: 92, wall: 90, pushes: 5, elapsed: 9 };

/** Every scene to the end, first card, cashed (or bust on every second window). */
function playThrough(pack, { pick = 0, window = () => CASHED, save = false } = {}) {
  let state = sideRun.createSideRun(pack, { runId: "side-test" });
  let index = 0;
  while (!state.outcomeChoiceId) {
    const card = pack.nodes[state.nodeId].choices[pick];
    if (save) sideRun.saveSideProgress(sideRun.touchSideRun(state, `${sideRun.sideWindowSeed(state)}|tab`, card.id));
    state = sideRun.advanceSideRun(pack, state, { choice: card, window: window(index) });
    if (save && !state.outcomeChoiceId) sideRun.saveSideProgress(state);
    index += 1;
    assert.ok(index < 50, "the side run never closed");
  }
  return state;
}

test("1: no side case is in the season: CASE_SEQUENCE is the 55 it was, and no case id is sideNN", () => {
  assert.equal(gameCases.CASE_SEQUENCE.length, 55);
  assert.deepEqual(gameCases.CASE_SEQUENCE, seasonNumbersBefore.sequence);
  assert.equal(gameCases.CASE_SEQUENCE.some(sideCases.isSideCaseId), false);
  assert.equal(gameCases.seasonCasesBase.some(({ id }) => sideCases.isSideCaseId(id)), false);
  assert.equal(Object.keys(nodes).some((nodeId) => /^s\d+_/.test(nodeId)), false, "a season scene uses a side prefix");
});

test("ids: sideNN, never caseNN -- the server's season pattern refuses it", () => {
  assert.equal(sideCases.isSideCaseId("side01"), true);
  assert.equal(sideCases.isSideCaseId("side00"), true);
  for (const id of ["case01", "final", "prologue01", "side1", "side001", "season-final", null]) assert.equal(sideCases.isSideCaseId(id), false, id);
  // is_season_case_id (supabase/migrations/20260928000000_trusted_telemetry_writes.sql).
  const seasonCaseId = /^case[0-9]{2}$/;
  assert.equal(seasonCaseId.test("side01"), false);
  assert.equal(seasonCaseId.test(side00.id), false);
});

test("2: the case helpers name a side case's scenes, code and aftershock", () => {
  assert.equal(gameCases.caseNodePrefix("side01"), "s1");
  assert.equal(gameCases.caseDisplayCode("side01"), "번외 1");
  assert.equal(gameCases.caseAftermathNodeId("side01"), "s1_aftershock");
  assert.equal(gameCases.caseNodePrefix("side12"), "s12");
  assert.equal(sideRun.sideResultNodeId("side01"), "s1_result");
  // The season's own are as they were.
  assert.equal(gameCases.caseNodePrefix("case07"), "c7");
  assert.equal(gameCases.caseDisplayCode("case07"), "07");
  assert.equal(gameCases.caseDisplayCode("prologue02"), "P2");
});

test("3: the slot opens on a closed finale (NEW GAME+ or caseResults.final) and shows only written cases", () => {
  const cases = [{ id: "side00", label: "번외 0", title: side00.title }];
  assert.equal(sideCases.isSideSlotOpen({}), false);
  assert.equal(sideCases.isSideSlotOpen({ newGamePlusUnlocked: false, caseResults: { case49: {} } }), false);
  assert.equal(sideCases.isSideSlotOpen({ newGamePlusUnlocked: true }), true);
  assert.equal(sideCases.isSideSlotOpen({ caseResults: { final: { endingVariant: "open-question" } } }), true);
  assert.equal(sideCases.getSideSlot({ cases, record: {} }), null);
  assert.equal(sideCases.getSideSlot({ newGamePlusUnlocked: true, cases: [], record: {} }), null);
  assert.deepEqual(sideCases.getSideSlot({ newGamePlusUnlocked: true, cases, record: {} }), {
    cases: [{ id: "side00", label: "번외 0", title: side00.title, closed: false, resumable: false }],
    book: "번외 0/1",
  });
  const closed = sideCases.getSideSlot({ caseResults: { final: {} }, cases, record: { side00: { closedAt: "2026-12-01T00:00:00.000Z", outcomeChoiceId: "s0_after_warm", inProgress: null } } });
  assert.equal(closed.book, "번외 1/1");
  assert.equal(closed.cases[0].closed, true);
});

test("the registry lists 번외 1 and 번외 2 in a release; the placeholder stays behind the debug build", async () => {
  // Node has no __CP_DEBUG_BUILD__, as a release has it false.
  assert.deepEqual(
    SIDE_CASES.map(({ id, label, title }) => ({ id, label, title })),
    [
      { id: "side01", label: "번외 1", title: "아직 찾아가지 못한 일곱 명" },
      { id: "side02", label: "번외 2", title: "돌려줄 것" },
    ],
  );
  assert.equal(side00.fixture, true);
  // Each entry loads the case file it names, and says what the file says.
  for (const [entry, pack] of [[SIDE_CASES[0], side01], [SIDE_CASES[1], side02]]) {
    const loaded = await entry.load();
    assert.equal(loaded, pack);
    assert.equal(loaded.label, entry.label);
    assert.equal(loaded.title, entry.title);
    assert.equal(pack.fixture, undefined, `${entry.label} is a case, not the placeholder`);
  }
});

test("번외 1 is a sound side pack: 8 to 12 scenes, no season scene, every speaker profiled and painted", async () => {
  assert.deepEqual(checkSidePack(side01, { seasonNodeIds: Object.keys(nodes) }), []);
  const sceneIds = Object.keys(side01.nodes);
  assert.ok(sceneIds.length >= 8 && sceneIds.length <= 12, `${sceneIds.length} scenes`);
  assert.deepEqual(Object.keys(side01.outcomes).sort(), side01.nodes.s1_aftershock.choices.map(({ id }) => id).sort());
  const { getCharacterProfile } = await import("../../src/gameDialogue.js");
  const { getSpeakerPortrait } = await import("../../src/speakerPortraits.js");
  for (const [nodeId, scene] of Object.entries(side01.nodes)) {
    assert.ok(getCharacterProfile(scene.speaker, null), `${nodeId}: ${scene.speaker} has no profile`);
    assert.ok(getSpeakerPortrait(scene.speaker), `${nodeId}: ${scene.speaker} has no portrait (never a silhouette)`);
  }
});

test("번외 1's copy keeps the season's lengths: labels 30, scenes 420, a cognition on every card", () => {
  for (const [nodeId, scene] of Object.entries(side01.nodes)) {
    assert.ok([...scene.text].length <= 420, `${nodeId}: ${[...scene.text].length} characters`);
    assert.ok(Array.isArray(scene.memo) && scene.memo.length > 0, `${nodeId}: no memo`);
    assert.ok(scene.place && scene.clock, `${nodeId}: no place or clock`);
    for (const choice of scene.choices) {
      assert.ok([...choice.label].length <= 30, `${choice.id}: ${[...choice.label].length} characters`);
      assert.ok(Object.keys(choice.cognition ?? {}).length > 0, `${choice.id}: no cognition`);
    }
  }
  for (const [id, { text }] of Object.entries(side01.outcomes)) assert.ok([...text].length <= 420, `${id}: ${[...text].length} characters`);
});

test("번외 1 is the Saturday between 사건 17's committee and the 송년회, and it never says what became of the notebook", () => {
  // 2025-12-19 (금) committee, 12-21 (일) 송년회 (docs/canon.md): the 20th is a Saturday.
  assert.equal(new Date(Date.UTC(2025, 11, 20)).getUTCDay(), 6);
  assert.match(side01.nodes.s1_start.clock, /^12월 20일 \(토\)/);
  const copy = JSON.stringify(side01);
  // 사건 17 ends on court, owners, fire or its hidden route; a side case read after any of them holds.
  for (const fate of ["법원에 냈", "태웠", "태운 ", "뜯어", "돌려준 수첩"]) assert.equal(copy.includes(fate), false, fate);
  // 47명, of whom 7 not yet visited (case17.js c17_unreached).
  assert.match(side01.nodes.s1_start.text, /아직 찾아가지 못한 사람 7명/);
});

test("번외 1 plays to each of its three endings, on every route through its branches, without touching the engine", () => {
  const pack = sideRun.prepareSidePack(side01);
  const endings = new Set();
  const routes = new Set();
  // Every card of every scene, walked: each path through the case. The
  // shortest asks seven decisions (it skips the folding, the lunch and the
  // phone), the longest ten.
  const walk = (state, path) => {
    if (state.outcomeChoiceId) {
      endings.add(state.outcomeChoiceId);
      routes.add(path.join(">"));
      assert.ok(state.log.length >= 7 && state.log.length <= 10, `${path.join(">")}: ${state.log.length} decisions`);
      for (const value of Object.values(state.resources)) assert.ok(Number.isFinite(value));
      return;
    }
    const scene = pack.nodes[state.nodeId];
    for (const choice of scene.choices) walk(sideRun.advanceSideRun(pack, state, { choice, window: CASHED }), [...path, state.nodeId]);
  };
  walk(sideRun.createSideRun(pack, { runId: "side01-walk" }), []);
  assert.deepEqual([...endings].sort(), ["s1_after_blank", "s1_after_hers", "s1_after_order"]);
  // Every scene is on some route.
  const visited = new Set([...routes].flatMap((route) => route.split(">")));
  assert.deepEqual([...visited].sort(), Object.keys(side01.nodes).sort());
  // A bust on every second window still closes it.
  assert.ok(playThrough(pack, { pick: 2, window: (index) => (index % 2 ? BUST : CASHED) }).outcomeChoiceId);
  assert.equal(ENGINE_CONSTANTS(), seasonNumbersBefore.engine, "the engine's constants moved");
});

test("번외 2 is a sound side pack: 8 to 12 scenes, no season scene, every speaker profiled and painted", async () => {
  assert.deepEqual(checkSidePack(side02, { seasonNodeIds: Object.keys(nodes) }), []);
  const sceneIds = Object.keys(side02.nodes);
  assert.ok(sceneIds.length >= 8 && sceneIds.length <= 12, `${sceneIds.length} scenes`);
  assert.deepEqual(Object.keys(side02.outcomes).sort(), side02.nodes.s2_aftershock.choices.map(({ id }) => id).sort());
  const { getCharacterProfile } = await import("../../src/gameDialogue.js");
  const { getSpeakerPortrait } = await import("../../src/speakerPortraits.js");
  for (const [nodeId, scene] of Object.entries(side02.nodes)) {
    assert.ok(getCharacterProfile(scene.speaker, null), `${nodeId}: ${scene.speaker} has no profile`);
    assert.ok(getSpeakerPortrait(scene.speaker), `${nodeId}: ${scene.speaker} has no portrait (never a silhouette)`);
  }
  // No scene id or card id of 번외 1 is reused.
  const first = new Set([...Object.keys(side01.nodes), ...Object.values(side01.nodes).flatMap((scene) => scene.choices.map(({ id }) => id))]);
  for (const id of [...sceneIds, ...Object.values(side02.nodes).flatMap((scene) => scene.choices.map((choice) => choice.id))]) assert.equal(first.has(id), false, id);
});

test("번외 2's copy keeps the season's lengths: labels 30, scenes 420, a cognition on every card", () => {
  for (const [nodeId, scene] of Object.entries(side02.nodes)) {
    assert.ok([...scene.text].length <= 420, `${nodeId}: ${[...scene.text].length} characters`);
    assert.ok(Array.isArray(scene.memo) && scene.memo.length > 0, `${nodeId}: no memo`);
    assert.ok(scene.place && scene.clock, `${nodeId}: no place or clock`);
    for (const choice of scene.choices) {
      assert.ok([...choice.label].length <= 30, `${choice.id}: ${[...choice.label].length} characters`);
      assert.ok(Object.keys(choice.cognition ?? {}).length > 0, `${choice.id}: no cognition`);
    }
  }
  for (const [id, { text }] of Object.entries(side02.outcomes)) assert.ok([...text].length <= 420, `${id}: ${[...text].length} characters`);
});

test("번외 2 is the Friday ten days before 사건 19, and leaves 사건 19's night and 사건 45 alone", () => {
  // 2026-01-09 is a Friday; 사건 19's change notice is 1월 16일 (금) and it opens 1월 19일 (docs/canon.md).
  assert.equal(new Date(Date.UTC(2026, 0, 9)).getUTCDay(), 5);
  assert.match(side02.nodes.s2_start.clock, /^1월 9일 \(금\)/);
  // The notice on the shutter still says April: the 72 hours have not begun.
  assert.match(side02.nodes.s2_start.text, /4월 14일/);
  const copy = JSON.stringify(side02);
  for (const later of ["1월 22일", "72시간", "312상자", "굴착기", "KD리얼티"]) assert.equal(copy.includes(later), false, later);
  // 임소율 reads the margins of the boxes only in 사건 19 (c19_labels); her birthday is in a book, not a box.
  for (const margin of ["여백", "사람을 적어"]) assert.equal(copy.includes(margin), false, margin);
  assert.match(side02.nodes.s2_shelf.text, /그건 상자에 없어/);
  // Whether 임경수 ever went himself is not said: 사건 45.
  for (const fate of ["돌아가셨", "장례", "발인", "퇴원했"]) assert.equal(copy.includes(fate), false, fate);
});

test("번외 2 plays to each of its three endings, on every route through its branches, without touching the engine", () => {
  const pack = sideRun.prepareSidePack(side02);
  const endings = new Set();
  const routes = new Set();
  // The shortest asks eight decisions (it skips 1998's story, the drawing and
  // tonight's notebook), the longest eleven.
  const walk = (state, path) => {
    if (state.outcomeChoiceId) {
      endings.add(state.outcomeChoiceId);
      routes.add(path.join(">"));
      assert.ok(state.log.length >= 8 && state.log.length <= 11, `${path.join(">")}: ${state.log.length} decisions`);
      for (const value of Object.values(state.resources)) assert.ok(Number.isFinite(value));
      return;
    }
    const scene = pack.nodes[state.nodeId];
    for (const choice of scene.choices) walk(sideRun.advanceSideRun(pack, state, { choice, window: CASHED }), [...path, state.nodeId]);
  };
  walk(sideRun.createSideRun(pack, { runId: "side02-walk" }), []);
  assert.deepEqual([...endings].sort(), ["s2_after_hand", "s2_after_himself", "s2_after_opinion"]);
  const visited = new Set([...routes].flatMap((route) => route.split(">")));
  assert.deepEqual([...visited].sort(), Object.keys(side02.nodes).sort());
  assert.ok(playThrough(pack, { pick: 2, window: (index) => (index % 2 ? BUST : CASHED) }).outcomeChoiceId);
  assert.equal(ENGINE_CONSTANTS(), seasonNumbersBefore.engine, "the engine's constants moved");
});

test("7: the placeholder is a sound side pack, and the check finds what a broken one gets wrong", () => {
  assert.deepEqual(checkSidePack(side00, { seasonNodeIds: Object.keys(nodes) }), []);
  const broken = structuredClone(side00);
  broken.id = "case50";
  assert.match(checkSidePack(broken)[0], /never caseNN/);
  const noEnding = structuredClone(side00);
  delete noEnding.outcomes.s0_after_leave;
  assert.ok(checkSidePack(noEnding).some((problem) => /no ending/.test(problem)));
  const stray = structuredClone(side00);
  stray.nodes.s0_lost = { ...stray.nodes.s0_desk };
  assert.ok(checkSidePack(stray).some((problem) => /s0_lost: no card leads here/.test(problem)));
  const real = { ...structuredClone(side00), fixture: false };
  assert.ok(checkSidePack(real).some((problem) => /8 to 12/.test(problem)), "a real side case has 8 to 12 scenes");
  const clash = structuredClone(side00);
  assert.ok(checkSidePack(clash, { seasonNodeIds: ["s0_desk"] }).some((problem) => /season already has/.test(problem)));
});

test("8: a side run opens on its own resources and the standing table, with no week's rule", () => {
  const pack = sideRun.prepareSidePack(side00);
  const state = sideRun.createSideRun(pack, { runId: "r" });
  assert.deepEqual(state.resources, side00.startState.resources);
  assert.equal(state.run.weekRule, null);
  assert.equal(state.run.windowIndex, 0);
  assert.deepEqual(state.run.relics, []);
  assert.equal(pack.nodes.s0_start.caseId, "side00");
  assert.match(sideRun.sideWindowSeed(state), /^side:r:0:s0_start$/);
  const closed = playThrough(pack, { window: (index) => (index % 2 ? BUST : CASHED) });
  assert.equal(closed.outcomeChoiceId, "s0_after_warm");
  assert.equal(closed.log.length, 3);
  assert.equal(closed.log[1].busted, true);
  assert.equal(ENGINE_CONSTANTS(), seasonNumbersBefore.engine, "the engine's constants moved");
});

test("a card the scene does not deal, or one after the close, changes nothing", () => {
  const pack = sideRun.prepareSidePack(side00);
  const state = sideRun.createSideRun(pack, { runId: "r" });
  assert.equal(sideRun.advanceSideRun(pack, state, { choice: { id: "s0_desk_note" }, window: CASHED }), state);
  const closed = playThrough(pack);
  assert.equal(sideRun.advanceSideRun(pack, closed, { choice: pack.nodes[closed.nodeId].choices[1], window: CASHED }), closed);
});

test("4: a whole side run leaves every season key as it was, to the byte, and writes only its own", () => {
  // A plain map behind the storage the app reads, so every write can be listed.
  const values = new Map([
    [STORAGE_KEY, JSON.stringify({ currentCase: "case12", nodeId: "c12_market", started: false, caseResults: { final: { endingVariant: "open-question" } } })],
    [NEW_GAME_PLUS_KEY, "true"],
    [NEW_GAME_PLUS_MEMORY_KEY, JSON.stringify({ final: { endingVariant: "open-question" } })],
    [SEASON_RECORD_KEY, JSON.stringify({ seasons: 1, endingsSeen: ["open-question"] })],
    [PAST_PICKS_KEY, JSON.stringify({ runId: "season-1" })],
    [SEEN_SCENES_KEY, JSON.stringify({ runId: "season-1" })],
    [SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(["season-1:0:p1_start"])],
    [LOCAL_RANKING_STORAGE_KEY, JSON.stringify([{ run_id: "season-1", case_id: "final", summary: { score: 1 } }])],
  ]);
  const before = new Map(values);
  const written = [];
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => {
      written.push(name);
      values.set(name, String(value));
    },
    removeItem: (name) => {
      written.push(name);
      values.delete(name);
    },
  };
  try {
    const pack = sideRun.prepareSidePack(side00);
    const closed = playThrough(pack, { pick: 1, save: true });
    assert.equal(sideRun.closeSideCase(closed, { now: new Date("2026-12-05T10:00:00.000Z") }), true);
    assert.deepEqual([...new Set(written)], [SIDE_CASES_KEY]);
    for (const [name, value] of before) assert.equal(values.get(name), value, `${name} changed`);
    assert.deepEqual(sideCases.readSideRecord(), {
      side00: { closedAt: "2026-12-05T10:00:00.000Z", outcomeChoiceId: "s0_after_record", inProgress: null },
    });
    // What the start screen reads back.
    assert.equal(sideCases.getSideSlot({ newGamePlusUnlocked: true, cases: [{ id: "side00", label: "번외 0", title: side00.title }] }).book, "번외 1/1");
  } finally {
    globalThis.localStorage = previous;
  }
});

test("a run put down resumes where it was; one the pack cannot place starts over", () => {
  globalThis.localStorage = createStorage();
  const pack = sideRun.prepareSidePack(side00);
  let state = sideRun.createSideRun(pack, { runId: "kept" });
  state = sideRun.advanceSideRun(pack, state, { choice: pack.nodes.s0_start.choices[2], window: CASHED });
  sideRun.saveSideProgress(state);
  const kept = sideCases.readSideRecord().side00.inProgress;
  const resumed = sideRun.resumeSideRun(pack, kept);
  assert.equal(resumed.nodeId, "s0_desk");
  assert.equal(resumed.runId, "kept");
  assert.deepEqual(resumed.resources, state.resources);
  assert.equal(resumed.run.windowIndex, state.run.windowIndex);
  assert.equal(sideRun.resumeSideRun(pack, { ...kept, nodeId: "c12_market" }), null);
  sideRun.dropSideProgress("side00");
  assert.equal(sideCases.readSideRecord().side00.inProgress, null);
  // Not a side id: nothing is written.
  assert.equal(sideRun.saveSideProgress({ ...state, caseId: "case01" }), false);
  assert.deepEqual(Object.keys(sideCases.readSideRecord()), ["side00"]);
});

test("the record reads side ids only, each with its three fields", () => {
  assert.deepEqual(sideCases.normalizeSideRecord(null), {});
  assert.deepEqual(sideCases.normalizeSideRecord([1]), {});
  assert.deepEqual(
    sideCases.normalizeSideRecord({ case01: { closedAt: "x" }, side01: { closedAt: "", outcomeChoiceId: 3, inProgress: [] }, side02: "no" }),
    { side01: { closedAt: null, outcomeChoiceId: null, inProgress: null } },
  );
});

test("5: the telemetry pass drops a side case row unsent and keeps the season's", async () => {
  const { isSideCaseRow, sendTelemetryBatch } = await import("../../src/state/telemetryBatch.js");
  const sideRow = { id: "case-side", type: "case", payload: { case_id: "side01", run_id: "r" } };
  const caseRow = { id: "case-12", type: "case", payload: { case_id: "case12", run_id: "r" } };
  assert.equal(isSideCaseRow(sideRow), true);
  assert.equal(isSideCaseRow(caseRow), false);
  const sent = [];
  const result = await sendTelemetryBatch([sideRow, caseRow], { send: async (item) => sent.push(item.payload.case_id) });
  assert.deepEqual(sent, ["case12"]);
  assert.deepEqual(result.kept, []);
});

test("the local ranking takes no side case row, and reads none back", () => {
  const rows = [{ run_id: "a", case_id: "case01", summary: {} }];
  assert.equal(appendLocalRankingRowToRows(rows, { run_id: "a", case_id: "side01", summary: {} }), rows);
  assert.deepEqual(parseLocalRankingRows(JSON.stringify([...rows, { run_id: "a", case_id: "side01", summary: {} }])), rows);
});

test("the settled-window log takes no side window", () => {
  globalThis.localStorage = createStorage();
  assert.equal(config.recordSettledWindowSeed("side:r:0:s0_start"), false);
  assert.deepEqual(config.readSettledWindowSeeds(), []);
  assert.equal(config.recordSettledWindowSeed("run:0:p1_start"), true);
});

test("the online save carries the side cases' completion marks beside the run, and no run in progress", async () => {
  const inProgress = { nodeId: "s1_shop", resources: {}, log: [], run: {}, runId: "side-x" };
  globalThis.localStorage = createStorage({
    [SIDE_CASES_KEY]: JSON.stringify({
      side01: { closedAt: "2026-12-01T00:00:00.000Z", outcomeChoiceId: "s1_after_hers", inProgress },
      side02: { closedAt: null, outcomeChoiceId: null, inProgress },
    }),
  });
  const cloud = await import("../../src/cloudSave.js");
  const records = cloud.readDeviceRecords();
  assert.deepEqual(records.sideCases, { side01: { closedAt: "2026-12-01T00:00:00.000Z", outcomeChoiceId: "s1_after_hers" } });
  const payload = cloud.createCloudSavePayload({ currentCase: "case01", log: [] }, records);
  assert.equal(JSON.stringify(payload).includes("s1_shop"), false, "a run in progress stays on its device");
  // The run is the season's: the side mark rides only in deviceRecords.
  const { deviceRecords, ...run } = payload;
  assert.equal(JSON.stringify(run).includes("side"), false);
  assert.deepEqual(Object.keys(deviceRecords), ["sideCases"]);
  // Nothing closed yet: nothing goes up.
  globalThis.localStorage = createStorage({ [SIDE_CASES_KEY]: JSON.stringify({ side01: { closedAt: null, outcomeChoiceId: null, inProgress } }) });
  assert.equal("sideCases" in cloud.readDeviceRecords(), false);
});

test("closing a side case tells the online save a record changed; a decision saved mid-run does not", async () => {
  globalThis.localStorage = createStorage();
  const fired = [];
  const previous = globalThis.dispatchEvent;
  globalThis.dispatchEvent = (event) => fired.push([event.type, event.detail]);
  try {
    const pack = sideRun.prepareSidePack(side00);
    const closed = playThrough(pack, { pick: 0, save: true });
    assert.deepEqual(fired, [], "a decision saved mid-run is not an upload");
    assert.equal(sideRun.closeSideCase(closed), true);
    assert.deepEqual(fired, [[config.DEVICE_RECORD_WRITTEN_EVENT, { key: SIDE_CASES_KEY }]]);
  } finally {
    globalThis.dispatchEvent = previous;
  }
});

test("marks merge: a case closed on either device stays closed, the later close keeps its ending, and this device's run stays", () => {
  const run = { nodeId: "s1_shop", resources: {}, log: [], run: {}, runId: "here" };
  const local = {
    side01: { closedAt: "2026-12-01T00:00:00.000Z", outcomeChoiceId: "s1_after_blank", inProgress: run },
    side02: { closedAt: null, outcomeChoiceId: null, inProgress: run },
  };
  const remote = {
    side01: { closedAt: "2026-12-03T00:00:00.000Z", outcomeChoiceId: "s1_after_hers", inProgress: { nodeId: "s1_letter" } },
    side02: { closedAt: "2026-12-02T00:00:00.000Z", outcomeChoiceId: "s2_after_x" },
    side03: { closedAt: null, outcomeChoiceId: null },
    case12: { closedAt: "2026-12-02T00:00:00.000Z" },
  };
  assert.deepEqual(sideMarks.mergeSideMarks(local, remote), {
    side01: { closedAt: "2026-12-03T00:00:00.000Z", outcomeChoiceId: "s1_after_hers", inProgress: run },
    side02: { closedAt: "2026-12-02T00:00:00.000Z", outcomeChoiceId: "s2_after_x", inProgress: run },
  });
  // An older close from the copy does not replace this device's later one; a tie is the copy's.
  const older = { side01: { closedAt: "2026-11-30T00:00:00.000Z", outcomeChoiceId: "s1_after_order" } };
  assert.equal(sideMarks.mergeSideMarks(local, older).side01.outcomeChoiceId, "s1_after_blank");
  const tie = { side01: { closedAt: "2026-12-01T00:00:00.000Z", outcomeChoiceId: "s1_after_order" } };
  assert.equal(sideMarks.mergeSideMarks(local, tie).side01.outcomeChoiceId, "s1_after_order");
  assert.deepEqual(sideMarks.mergeSideMarks(null, "not a record"), {});
  assert.equal(sideMarks.sideCaseMarks(null), null);
});

test("the season case's reading tally is put back after a side case is read", async () => {
  const { keepReadingTally, noteBriefing, takeReadingTally } = await import("../../src/state/readingTally.js");
  globalThis.sessionStorage = createStorage();
  noteBriefing({ caseId: "case12", seconds: 20 });
  const restore = keepReadingTally();
  noteBriefing({ caseId: "side00", seconds: 5 });
  noteBriefing({ caseId: "side00", seconds: 6 });
  restore();
  assert.equal(takeReadingTally().readBriefings, 1);
  // A tally kept while there was none is put back as none.
  const restoreNone = keepReadingTally();
  noteBriefing({ caseId: "side00", seconds: 4 });
  restoreNone();
  assert.equal(takeReadingTally().readBriefings, 0);
  // With no storage there is nothing to keep, and putting it back throws nothing.
  const refusing = createStorage();
  refusing.unavailable = true;
  globalThis.sessionStorage = refusing;
  assert.doesNotThrow(() => keepReadingTally()());
  delete globalThis.sessionStorage;
});

test("6: the goals, the titles and the season's length read the same after side cases are loaded and played", () => {
  playThrough(sideRun.prepareSidePack(side00));
  playThrough(sideRun.prepareSidePack(side01));
  playThrough(sideRun.prepareSidePack(side02));
  assert.deepEqual(getAchievementProgress({}).map(({ id, goal }) => [id, goal]), seasonNumbersBefore.goals);
  assert.deepEqual(seasonNumbersBefore.goals.find(([id]) => id === "full-audit"), ["full-audit", 55]);
  assert.equal(JSON.stringify(ANALYST_TITLE_STEPS), seasonNumbersBefore.titles);
  assert.deepEqual(gameCases.CASE_SEQUENCE, seasonNumbersBefore.sequence);
  assert.equal(seasonRows(), seasonNumbersBefore.rows, "the season's ranking or telemetry row changed");
});

test("the pack check names each thing a side pack can get wrong", () => {
  assert.deepEqual(checkSidePack(null), ["not a pack"]);
  const pack = structuredClone(side00);
  pack.label = "번외";
  pack.title = "";
  pack.startNode = "s0_nowhere";
  delete pack.startState;
  pack.nodes.s0_desk.speaker = "";
  pack.nodes.s0_start.choices = [pack.nodes.s0_start.choices[0]];
  pack.nodes.s0_desk.choices[1] = { ...pack.nodes.s0_desk.choices[0] };
  pack.nodes.s0_desk.choices[2] = { id: "s0_desk_reframe", type: "reframe", next: "s0_missing" };
  pack.nodes.s0_aftershock.choices[0].next = "s0_desk";
  pack.outcomes.s0_elsewhere = { title: "x", text: "y" };
  pack.nodes.c1_borrowed = { ...side00.nodes.s0_desk, choices: [{ id: "x1", effect: {}, next: "s0_aftershock" }, { id: "x2", effect: {}, next: "s0_aftershock" }] };
  const problems = checkSidePack(pack).join("\n");
  for (const expected of [
    /label should be 「번외 0」/,
    /no title/,
    /startNode s0_nowhere is not a scene/,
    /startState\.resources names every resource/,
    /s0_desk: no speaker/,
    /s0_start: fewer than two cards/,
    /card s0_desk_note is written twice/,
    /s0_desk_reframe: a side case has no 판을 다시 짠다 card/,
    /s0_desk_reframe: no effect/,
    /s0_desk_reframe: next s0_missing is not a scene ahead/,
    /s0_after_warm: an aftershock card leads to s0_result/,
    /4 endings, a side case has three/,
    /s0_elsewhere: no aftershock card reaches this ending/,
    /c1_borrowed: a side00 scene starts with s0_/,
    /c1_borrowed: card x1 starts with s0_/,
  ]) assert.match(problems, expected);
});

test("a side run made without a run id gets one of its own, and an unreadable record reads as none", () => {
  const state = sideRun.createSideRun(sideRun.prepareSidePack(side00));
  assert.match(state.runId, /^side-/);
  globalThis.localStorage = createStorage({ [SIDE_CASES_KEY]: "{not json" });
  assert.deepEqual(sideCases.readSideRecord(), {});
  assert.equal(sideRun.closeSideCase(state), false, "an open run is not closed");
});

test("the runtime hands the side screen the side run and the scene readers", async () => {
  const { sideCaseKit } = await import("../../src/state/sideCaseKit.js");
  for (const name of ["prepareSidePack", "createSideRun", "resumeSideRun", "advanceSideRun", "touchSideRun", "sideWindowSeed", "saveSideProgress", "closeSideCase", "keepReadingTally"]) {
    assert.equal(typeof sideCaseKit[name], "function", name);
  }
  assert.equal(sideCaseKit.getSpeakerPortrait(side00.nodes.s0_start.speaker), "/portrait-ban-jaeuk.webp");
  assert.equal(typeof sideCaseKit.getSpeakerRole(side00.nodes.s0_start), "string");
});
