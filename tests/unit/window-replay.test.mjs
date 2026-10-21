import assert from "node:assert/strict";
import test from "node:test";

import { CASE_SEQUENCE } from "../../src/gameData.js";
import { BASE_SCHEMA, createWindow, normalizeSchema, reduceWindow, seededUnit } from "../../src/gauntlet/gauntletEngine.js";
import { ALL_RULES, getTableRules } from "../../src/gauntlet/tableUnlocks.js";
import {
  appendWindowEvent,
  compactSchema,
  compareReplay,
  readRecordProblem,
  recheckWindow,
  replayWindow,
  WINDOW_RECORD_VERSION,
} from "../../src/gauntlet/windowReplay.js";
import { getRowRules, recheckCaseScore, recheckCaseWindows, WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { createCaseBot, createSeasonBot, POPULATION } from "../../scripts/sim/season-bot.mjs";
import { createWindowRecorder, thresholdOf, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/** A window played by hand: ticks of `delta`, a push every `every` ticks until `pushes`, then a cash. */
function playByHand({ seed = "hand:1", schema = BASE_SCHEMA, delta = 0.13, every = 9, pushes = 3, rules = ALL_RULES, digits = null, cash = true } = {}) {
  const recorder = createWindowRecorder({ digits });
  let window = recorder.reduce(createWindow({ schema, seed }), { type: "SELECT", id: "card-a" }, rules);
  for (let tick = 1; tick < 2000 && window.status === "live"; tick += 1) {
    window = recorder.reduce(window, { type: "TICK", delta }, rules);
    if (window.status !== "live") break;
    if (tick % every === 0 && window.pushes < pushes) window = recorder.reduce(window, { type: "PUSH" }, rules);
    else if (cash && window.pushes >= pushes) window = recorder.reduce(window, { type: "CASH" }, rules);
  }
  return { ...recorder.closed[0], recorder };
}

test("a window played by hand replays to the gauge, wall, pushes and cause it closed on", () => {
  const { record, window } = playByHand();
  assert.equal(window.status, "cashed");
  const { window: replayed, problem } = replayWindow(record, ALL_RULES);
  assert.equal(problem, null);
  assert.equal(replayed.status, "cashed");
  assert.equal(replayed.pushes, window.pushes);
  assert.equal(replayed.wall, window.wall);
  assert.ok(Math.abs(replayed.gauge - window.gauge) < 1e-9);
  assert.deepEqual(compareReplay(thresholdOf(window), replayed), []);
});

test("the trail writes presses with their clock, and no ticks", () => {
  const { record } = playByHand({ delta: 0.25, every: 4, pushes: 2 });
  assert.equal(record.v, WINDOW_RECORD_VERSION);
  assert.deepEqual(record.events.map(([, code]) => code), ["S", "P", "P", "C"]);
  assert.deepEqual(record.events.map(([at]) => at), [0, 1, 2, 2.25]);
  assert.deepEqual(record.events[0], [0, "S", "card-a"]);
  assert.deepEqual(record.schema, {});
});

test("a window the clock closed -- into the wall or out of time -- replays to the same close", () => {
  for (const [schema, cause] of [[{ ...BASE_SCHEMA, creep: 3 }, "creep"], [{ ...BASE_SCHEMA, creep: 0, seconds: 12 }, "timeout"]]) {
    const { record, window } = playByHand({ schema, pushes: 0, cash: false, delta: 0.17 });
    assert.equal(window.cause, cause);
    const result = recheckWindow(record, thresholdOf(window), ALL_RULES);
    assert.equal(result.status, "match", `${cause}: ${result.differs} ${result.problem}`);
  }
});

test("the clock rounded to the thousandth replays every window ticked as the page ticks", () => {
  // The page ticks a tenth to a third of a second, slower under the table-time
  // setting (useGauntletWindow). The size of the sample is the design note's.
  const recorder = createWindowRecorder({ digits: 3 });
  for (let index = 0; index < 400; index += 1) {
    const unit = (key) => seededUnit(`replay:${index}:${key}`);
    const scale = [1, 1.5, 2][Math.floor(unit("scale") * 3)];
    const schema = { ...BASE_SCHEMA, creep: 0.3 + unit("creep") * 1.2, startGauge: Math.floor(unit("start") * 20) };
    const target = 40 + unit("target") * 55;
    const locks = unit("locks") < 0.3;
    let window = recorder.reduce(createWindow({ schema, seed: `replay:${index}` }), { type: "SELECT", id: "a" }, ALL_RULES);
    if (locks) window = recorder.reduce(window, { type: "SET_FOCUS_MODE", mode: "steady" }, ALL_RULES);
    for (let step = 0; step < 400 && window.status === "live"; step += 1) {
      window = recorder.reduce(window, { type: "TICK", delta: (0.1 + unit(`tick:${step}`) * 0.25) / scale, scale }, ALL_RULES);
      if (window.status !== "live") break;
      const roll = unit(`roll:${step}`);
      if (roll < 0.12 && window.gauge < target) window = recorder.reduce(window, { type: "PUSH" }, ALL_RULES);
      else if (locks && roll < 0.16) window = recorder.reduce(window, { type: "FOCUS" }, ALL_RULES);
      else if (roll > 0.995 || window.gauge >= target) window = recorder.reduce(window, { type: "CASH" }, ALL_RULES);
    }
  }
  assert.equal(recorder.closed.length, 400);
  const failed = recorder.closed.filter(({ record, window, rules }) => recheckWindow(record, thresholdOf(window), rules).status !== "match");
  assert.equal(failed.length, 0);
  const longest = Math.max(...recorder.closed.map(({ record }) => JSON.stringify(record).length));
  assert.ok(longest < 600, `the longest record is ${longest} bytes`);
});

test("presses the reducer ignores are not written", () => {
  const window = createWindow({ seed: "ignored" });
  const selected = reduceWindow(window, { type: "SELECT", id: "x" });
  // CASH on a sealed card, LOCK without its rule, a tick: the window is the same object or a tick.
  assert.deepEqual(appendWindowEvent([], selected, { type: "CASH", locked: true }, reduceWindow(selected, { type: "CASH", locked: true })), []);
  const noLock = new Set();
  noLock.has = () => false;
  assert.deepEqual(appendWindowEvent([], selected, { type: "FOCUS" }, reduceWindow(selected, { type: "FOCUS" }, noLock)), []);
  assert.deepEqual(appendWindowEvent([], selected, { type: "TICK", delta: 0.5 }, reduceWindow(selected, { type: "TICK", delta: 0.5 })), []);
  const cashed = reduceWindow(selected, { type: "CASH" });
  assert.deepEqual(appendWindowEvent([], cashed, { type: "PUSH" }, { ...cashed }), []);
});

test("an edited log or record does not pass", () => {
  const { record, window } = playByHand({ pushes: 3 });
  assert.equal(window.status, "cashed");
  const threshold = thresholdOf(window);
  // The log says fewer pushes, a cooler gauge, a further wall, a cash for a bust.
  assert.deepEqual(recheckWindow(record, { ...threshold, pushes: 2 }, ALL_RULES).differs, ["pushes"]);
  assert.deepEqual(recheckWindow(record, { ...threshold, gauge: threshold.gauge - 5 }, ALL_RULES).differs, ["gauge"]);
  assert.deepEqual(recheckWindow(record, { ...threshold, wall: threshold.wall + 1 }, ALL_RULES).differs, ["wall"]);
  assert.deepEqual(recheckWindow(record, { ...threshold, busted: true, cause: "push" }, ALL_RULES).differs, ["outcome", "cause"]);
  // The record with a push taken out, or its presses written earlier than the clock that ran.
  const lessPushed = { ...record, events: record.events.filter((event, index) => !(event[1] === "P" && index === 1)) };
  assert.equal(recheckWindow(lessPushed, threshold, ALL_RULES).status, "mismatch");
  const rewound = { ...record, events: record.events.map(([at, ...rest], index) => [index === record.events.length - 2 ? 0.5 : at, ...rest]) };
  assert.equal(recheckWindow(rewound, threshold, ALL_RULES).problem, "rewound");
  // A record whose cash comes after the clock has already closed the window.
  const late = { ...record, events: record.events.map(([at, ...rest], index) => [index === record.events.length - 1 ? 59 : at, ...rest]) };
  assert.equal(recheckWindow(late, threshold, ALL_RULES).problem, "closed-early");
  // Another seed deals another wall.
  assert.equal(recheckWindow({ ...record, seed: `${record.seed}~1` }, threshold, ALL_RULES).status, "mismatch");
});

test("a record that does not hold together is named before anything is dealt", () => {
  const { record } = playByHand();
  assert.equal(readRecordProblem(null), "no-record");
  assert.equal(readRecordProblem({ ...record, v: 99 }), "unknown-version");
  assert.equal(readRecordProblem({ ...record, seed: "" }), "no-seed");
  assert.equal(readRecordProblem({ ...record, schema: [] }), "no-board");
  assert.equal(readRecordProblem({ ...record, events: [[1, "Z"]] }), "bad-events");
  assert.equal(readRecordProblem({ ...record, events: Array.from({ length: 201 }, () => [0, "P"]) }), "bad-events");
  assert.equal(readRecordProblem({ ...record, end: -1 }), "bad-end");
  assert.equal(readRecordProblem(record), null);
  const open = { ...record, events: record.events.slice(0, -1), end: 0.5 };
  assert.equal(replayWindow(open, ALL_RULES).problem, "never-closed");
  assert.equal(recheckWindow(record, { cause: "abandon" }, ALL_RULES).status, "abandoned");
  assert.deepEqual(compareReplay(null, null), ["missing"]);
});

test("the board is written as it differs from the plain one, and read back whole", () => {
  assert.deepEqual(compactSchema(BASE_SCHEMA), {});
  const board = normalizeSchema({ ...BASE_SCHEMA, wallMin: 60, creep: 0.7, mutations: ["blackout"], faceDown: true });
  const compact = compactSchema(board);
  assert.deepEqual(compact, { wallMin: 60, creep: 0.7, faceDown: true, mutations: ["blackout"] });
  assert.deepEqual(normalizeSchema(compact), board);
});

test("a LOCK window replays only under the rules it was played under", () => {
  // Why the case summary has to say NEW GAME+: a veteran plays the prologues
  // under every rule, and the same record read under the step's rules loses its LOCK.
  const recorder = createWindowRecorder();
  let window = recorder.reduce(createWindow({ seed: "lock:1" }), { type: "SELECT", id: "a" }, ALL_RULES);
  window = recorder.reduce(window, { type: "TICK", delta: 0.5 }, ALL_RULES);
  for (let press = 0; press < 3; press += 1) window = recorder.reduce(window, { type: "PUSH" }, ALL_RULES);
  window = recorder.reduce(window, { type: "FOCUS" }, ALL_RULES);
  window = recorder.reduce(window, { type: "CASH" }, ALL_RULES);
  const [{ record }] = recorder.closed;
  assert.equal(recheckWindow(record, thresholdOf(window), ALL_RULES).status, "match");
  const withoutLock = new Set([...ALL_RULES].filter((rule) => rule !== "lock"));
  assert.notEqual(recheckWindow(record, thresholdOf(window), withoutLock).status, "match");
});

test("the season player's windows all replay, as do the case players' with LOCK, stances and SCOUT", () => {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const bot = createSeasonBot({ seed: 20261021, reduce: recorder.reduce });
  for (const [index, archetype] of POPULATION.slice(0, 3).entries()) bot.playSeason(index, archetype, false, ({ verdict }) => verdicts.push(verdict));
  const seasonWindows = recorder.closed.length;
  // Each window the season player settled is one the recorder saw close, in order.
  assert.equal(seasonWindows, verdicts.length);
  // The verdict is what useChoiceCommit logs, and the rules are the case's
  // (the season player plays each case under the rules tableUnlocks deals it).
  recorder.closed.forEach(({ record, rules }, index) => {
    const result = recheckWindow(record, thresholdOfVerdict(verdicts[index]), rules);
    assert.equal(result.status, "match", `season window ${index}: ${result.differs} ${result.problem}`);
  });
  const cases = createCaseBot({ windowsPerCase: 9, card: { id: "sim", label: "sim", effect: { capital: 12 } }, sceneFor: () => null, reduce: recorder.reduce });
  const decide = (window) => window.gauge < 55;
  decide.scout = true;
  for (let caseIndex = 0; caseIndex < 6; caseIndex += 1) {
    cases.playCase(caseIndex, decide, undefined, [], { mode: ["strike", "steady", "expose"][caseIndex % 3], idle: caseIndex === 5 });
    cases.playHandCase(caseIndex, (window) => window.gauge < 60, []);
  }
  const caseWindows = recorder.closed.slice(seasonWindows);
  assert.ok(caseWindows.length > 60);
  assert.ok(caseWindows.some(({ record }) => record.events.some(([, code]) => code === "F")));
  assert.ok(caseWindows.some(({ record }) => record.events.some(([, code]) => code === "L")));
  for (const { record, window, rules } of caseWindows) assert.equal(recheckWindow(record, thresholdOf(window), rules).status, "match");
});

test("a case row's score is worked out again from its log, and an edited one is caught", () => {
  // The season player logs what the score reads as the runtime does, and
  // summarises the case with the runtime's createCaseSummary.
  const { caseResults, final } = createSeasonBot({ seed: 7 }).playSeason(0, "balanced");
  const summary = caseResults.final;
  const row = { case_id: "final", summary, decision_log: final.log, resources: final.resources };
  assert.equal(recheckCaseScore(row).status, "match");
  const raised = recheckCaseScore({ ...row, summary: { ...summary, burstScore: (summary.burstScore + 7) % 101 } });
  assert.equal(raised.status, "mismatch");
  assert.deepEqual(raised.differs, ["burstScore"]);
  // A log with a decision taken out no longer adds up to the summary it came with.
  assert.equal(recheckCaseScore({ ...row, decision_log: final.log.slice(1) }).status, "mismatch");
  assert.equal(recheckCaseScore({ summary }).status, "unreadable");
});

test("a case row's windows are replayed from the record on each entry", () => {
  const { record, window } = playByHand({ digits: 3 });
  const entry = { threshold: thresholdOf(window), [WINDOW_RECORD_KEY]: record };
  const row = { case_id: CASE_SEQUENCE.at(-1), summary: {}, decision_log: [entry, { threshold: thresholdOf(window) }, { threshold: { cause: "abandon" } }, { threshold: { ...thresholdOf(window), pushes: 9 }, [WINDOW_RECORD_KEY]: record }, {}] };
  const { counts, findings } = recheckCaseWindows(row);
  assert.deepEqual(counts, { match: 1, mismatch: 1, unreplayable: 0, abandoned: 1, unrecorded: 1 });
  assert.deepEqual(findings, [{ index: 3, status: "mismatch", differs: ["pushes"], problem: null }]);
  assert.deepEqual(recheckCaseWindows({}).counts, { match: 0, mismatch: 0, unreplayable: 0, abandoned: 0, unrecorded: 0 });
});

test("the rules of a stored case come from its summary: NEW GAME+ and story mode", () => {
  // A case the table still teaches in a plain run plays under every rule for a veteran.
  const taught = CASE_SEQUENCE.find((caseId) => getTableRules(caseId, {}) !== ALL_RULES && getTableRules(caseId, { veteran: true }) === ALL_RULES);
  assert.ok(taught, "a case whose rules a NEW GAME+ run changes");
  assert.equal(getRowRules(taught, {}), getTableRules(taught, {}));
  assert.equal(getRowRules(taught, { newGamePlus: true }), ALL_RULES);
  assert.equal(getRowRules(taught, { newGamePlus: "yes" }), getTableRules(taught, {}));
  assert.equal(getRowRules("final", { assistStory: true }), getTableRules("final", { story: true }));
});
