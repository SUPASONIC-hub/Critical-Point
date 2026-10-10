import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createStorage } from "./helpers/browser.mjs";
import { createRunHarness, restoreGlobals } from "./helpers/runHarness.mjs";

globalThis.localStorage = createStorage();

const { ACCESSIBILITY_SETTINGS_KEY, parseCurrentSavedState, SAVE_SCHEMA_VERSION } = await import("../../src/appConfig.js");
const { CASE_SEQUENCE, CASE_START_NODES } = await import("../../src/gameCases.js");
const { nodes } = await import("../../src/gameData.js");
const { createCaseSummary } = await import("../../src/gameLogic.js");
const {
  applyRelics,
  BASE_SCHEMA,
  buildNextSchema,
  createWindow,
  equipRelic,
  getTableClockScale,
  getTableSchema,
  normalizeRunState,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  serializeRunState,
  STORY_CLOCK_SCALE,
  STORY_WALL_MAX,
  STORY_WALL_MIN,
} = await import("../../src/gauntlet/gauntletEngine.js");
const { getBriefingIntro } = await import("../../src/gauntlet/tableStaging.js");
const {
  ALL_RULES,
  getTableRules,
  getUnlockIntro,
  getUnlockKicker,
  introFor,
  MUTATION_RULES,
  rulesFor,
  STORY_OFF_RULES,
  STORY_RULES,
  TABLE_RULES,
  UNLOCK_LADDER,
} = await import("../../src/gauntlet/tableUnlocks.js");
const { buildLeaderboard } = await import("../../src/ranking.js");
const settings = await import("../../src/state/accessibilitySettings.js");
const { RUN_FIELDS } = await import("../../src/state/runState.js");
const { repairSavedState } = await import("../../src/state/savedState.js");
const { createStartSave } = await import("../../src/state/shellStartSave.js");
const { getSettlementRules } = await import("../../src/state/useChoiceCommit.js");

after(restoreGlobals);

/**
 * Story mode (스토리 모드): the table steps back so the story can be read. A
 * run marked `story` is dealt a far wall, plays without the seven next-table
 * rules, runs its clock at least twice as slow, and says so on everything it
 * records. The mark is stamped from the device's setting when a run starts and
 * when a case opens, and nothing on screen sets the setting yet.
 *
 * What a commit does with the mark -- no skipped scene, the entry, the season,
 * the ranking row that is not sent -- is in choice-commit.test.mjs, beside the
 * commits it is compared with.
 */

const PROLOGUES = UNLOCK_LADDER.map((step) => step.caseId);
const SEVEN = ["aftershock", "blackout", "coldFeet", "fracture", "heatDebt", "overclock", "silence"];
const sorted = (values) => [...values].sort();
const lessSeven = (rules) => sorted([...rules].filter((rule) => !SEVEN.includes(rule)));
const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
const story = normalizeRunState({ story: true });

test("the rules a story run plays without are the seven next-table rules, and no other", () => {
  assert.deepEqual(sorted(STORY_OFF_RULES), SEVEN);
  assert.deepEqual(sorted(STORY_RULES), ["beat", "lock", "relics", "stance"]);
  assert.deepEqual(sorted([...STORY_RULES, ...STORY_OFF_RULES]), sorted(TABLE_RULES), "what is kept and what is taken are the whole table");
  // Every mutation the seven own is one a story board must not carry; the stances' are kept.
  for (const [mutation, rule] of Object.entries(MUTATION_RULES)) {
    assert.equal(STORY_RULES.has(rule), rule === "stance", `${mutation} -> ${rule}`);
  }
});

test("a story run's rules are its case's own, less the seven: on every step, under NEW GAME+ and with the steps off", () => {
  const expected = {
    prologue01: [],
    prologue02: ["beat"],
    prologue03: ["beat"],
    prologue04: ["beat", "lock"],
    prologue05: ["beat", "lock", "relics", "stance"],
  };
  for (const caseId of PROLOGUES) {
    const base = rulesFor(caseId, { staged: true });
    const rules = rulesFor(caseId, { staged: true, story: true });
    assert.deepEqual(sorted(rules), lessSeven(base), `${caseId} is its step less the seven`);
    assert.deepEqual(sorted(rules), expected[caseId], caseId);
    assert.equal(getTableRules(caseId, { story: true }, true), rules, "the run's mark asks the same question");
    assert.equal(getTableRules(caseId, story, true), rules);
    // NEW GAME+ and the switch being off both mean everything, and a story run takes the seven out of that.
    assert.equal(rulesFor(caseId, { staged: true, veteran: true, story: true }), STORY_RULES);
    assert.equal(getTableRules(caseId, { veteran: true, story: true }, true), STORY_RULES);
    assert.equal(rulesFor(caseId, { staged: false, story: true }), STORY_RULES);
    assert.equal(getTableRules(caseId, { story: true }, false), STORY_RULES);
    // Only the mark itself.
    assert.equal(getTableRules(caseId, { story: "yes" }, true), base);
    assert.equal(getTableRules(caseId, { story: false }, true), base);
  }
  for (const caseId of [...CASE_SEQUENCE.slice(PROLOGUES.length), "no-such-case", undefined, null]) {
    assert.equal(rulesFor(caseId, { staged: true, story: true }), STORY_RULES, `${caseId}`);
    assert.equal(rulesFor(caseId, { staged: false, story: true }), STORY_RULES);
    assert.equal(rulesFor(caseId, { staged: true }), ALL_RULES, "and without the mark nothing has moved");
  }
  assert.equal(rulesFor("prologue05", { staged: true, story: true }).size, STORY_RULES.size);
});

test("a story rule set is the same object every time it is asked for, and nothing can change it", () => {
  const asked = [...PROLOGUES, "case01", "final"].flatMap((caseId) => [
    [caseId, { story: true }, true],
    [caseId, { story: true }, false],
    [caseId, { story: true, veteran: true }, true],
  ]);
  for (const [caseId, run, staged] of asked) {
    const rules = getTableRules(caseId, run, staged);
    assert.equal(getTableRules(caseId, { ...run }, staged), rules, `${caseId}: so it can key a memo`);
    assert.throws(() => rules.add("blackout"), TypeError);
    assert.throws(() => rules.delete("beat"), TypeError);
    assert.throws(() => rules.clear(), TypeError);
    assert.ok(Object.isFrozen(rules));
  }
  assert.ok(UNLOCK_LADDER.every((step) => Object.isFrozen(step.storyIntro) && Object.isFrozen(step.storyRules)));
  // A step that has none of the seven still has a set of its own to hand out.
  assert.notEqual(UNLOCK_LADDER[0].storyRules, undefined);
  assert.equal(UNLOCK_LADDER[0].storyRules.size, 0);
});

test("a story run is introduced only to the rules it plays under", () => {
  const [one, two, three, four, five] = UNLOCK_LADDER;
  const told = (caseId) => introFor(caseId, { staged: true, story: true });
  assert.deepEqual(told("prologue01"), [...one.intro], "the table itself is explained as ever");
  assert.deepEqual(told("prologue02"), [two.intro[0]], "the beat, and not the wall's three rules");
  assert.match(told("prologue02")[0], /심박에 맞춰 밀면/);
  assert.deepEqual(told("prologue03"), [], "COLD FEET and HEAT DEBT are both off, so there is nothing to say");
  assert.deepEqual(told("prologue04"), [four.intro[2]], "LOCK, and neither FRACTURE nor OVERCLOCK");
  assert.match(told("prologue04")[0], /LOCK/);
  assert.deepEqual(told("prologue05"), [...five.intro], "the stances are kept");
  // No line a story run is told is new: each is one the step already says.
  for (const step of UNLOCK_LADDER) {
    for (const line of step.storyIntro) assert.ok(step.intro.includes(line), `${step.caseId}: "${line}"`);
    assert.doesNotMatch(step.storyIntro.join(" "), /다음 판/, `${step.caseId} promises a story run nothing about the next board`);
    assert.equal(getUnlockIntro(step.caseId, { story: true }, true), step.storyIntro, "the same array each time");
    assert.equal(getUnlockIntro(step.caseId, {}, true), step.intro, "a plain run is told what it always was");
    assert.deepEqual(getUnlockIntro(step.caseId, { story: true, veteran: true }, true), [], "NEW GAME+ is told nothing, story or not");
    assert.deepEqual(getUnlockIntro(step.caseId, { story: true }, false), []);
    // The line over the introduction is the step's, whatever the run.
    assert.equal(getUnlockKicker(step.caseId), step.kicker);
  }
  assert.deepEqual(introFor("case01", { staged: true, story: true }), []);
  assert.deepEqual(three.storyIntro, []);
  // The briefing asks through the same door, on the scene the case opens on.
  for (const step of UNLOCK_LADDER) {
    const first = CASE_START_NODES[step.caseId];
    assert.equal(getBriefingIntro(nodes[first], first, { story: true }, true), step.storyIntro, step.caseId);
  }
});

test("under story rules no decision breaks the next board: not a bust, a cold cash, a hot one or a chain", () => {
  const dealt = (rules, what) => buildNextSchema({ outcome: "cash", cause: "cash", gauge: 0, pushes: 1, streak: 0, burnAxis: null, caseClosed: false, ...what, rules });
  const everything = [
    { outcome: "bust", cause: "push", gauge: 80, pushes: 6 },
    { outcome: "bust", cause: "timeout", gauge: 20, pushes: 0 },
    { outcome: "bust", cause: "creep", gauge: 60, pushes: 2 },
    { outcome: "cash", cause: "cash", gauge: 90, pushes: 8, streak: 5, burnAxis: "trust" },
    { outcome: "cash", cause: "cash", gauge: 0, pushes: 0 },
  ];
  for (const what of everything) {
    const label = JSON.stringify(what);
    assert.ok(dealt(ALL_RULES, what).mutations.length > 0, `${label} breaks a board at the table, so the case is a real one`);
    for (const rules of [STORY_RULES, ...UNLOCK_LADDER.map((step) => step.storyRules)]) {
      const board = dealt(rules, what);
      assert.deepEqual(board.mutations, [], label);
      assert.deepEqual(board, { ...BASE_SCHEMA, mutations: [], relics: [] }, "the next board is the plain one");
    }
  }
  // Through a whole settlement, and for as many busts as the hand likes.
  let run = normalizeRunState({ story: true, runPot: 900, streak: 3 });
  for (let index = 0; index < 4; index += 1) {
    const rules = getSettlementRules({ caseId: "case07", run, caseClosed: false }, true);
    assert.equal(rules.rules, STORY_RULES);
    const { verdict, nextRun } = resolveWindow({ run, window: { status: "bust", cause: "push", gauge: 91, wall: 91, pushes: 7, seed: `bust-${index}` }, card, ...rules });
    assert.deepEqual(verdict.nextMutations, []);
    assert.deepEqual(nextRun.schema.mutations, []);
    assert.equal(nextRun.runPot, 0, "the bust still takes the pot");
    assert.equal(nextRun.busts, index + 1);
    run = nextRun;
  }
  // The stances are the hand's own, and still carry: a charged STEADY cash lays its line.
  const steady = resolveWindow({ run: story, window: { status: "cashed", cause: "cash", gauge: 40, wall: 90, pushes: 3, seed: "steady", focus: 100, focusMode: "steady", focusHits: 3 }, card, rules: STORY_RULES });
  assert.ok(steady.nextRun.schema.mutations.length > 0, "a stance still shapes the next board");
  for (const id of steady.nextRun.schema.mutations) assert.equal(MUTATION_RULES[id], "stance");
});

test("the board a window is dealt from is the run's own, and for a story run the same board with a far wall", () => {
  assert.equal(getTableSchema(null), BASE_SCHEMA);
  assert.equal(getTableSchema(undefined), BASE_SCHEMA);
  assert.equal(getTableSchema({}), BASE_SCHEMA);
  const plain = normalizeRunState({ schema: { wallMin: 44, wallMax: 80, startGauge: 12, mutations: ["blackout"] } });
  assert.equal(getTableSchema(plain), plain.schema, "without the mark it is the very object, so nothing downstream can tell");
  assert.equal(getTableSchema({ ...plain, story: "yes" }), plain.schema, "only the mark itself");

  const marked = { ...plain, story: true };
  const before = structuredClone(plain.schema);
  const board = getTableSchema(marked);
  assert.deepEqual([board.wallMin, board.wallMax], [STORY_WALL_MIN, STORY_WALL_MAX]);
  assert.deepEqual([STORY_WALL_MIN, STORY_WALL_MAX], [88, 98]);
  const { wallMin: _min, wallMax: _max, ...rest } = board;
  const { wallMin: _savedMin, wallMax: _savedMax, ...savedRest } = plain.schema;
  assert.deepEqual(rest, savedRest, "nothing but the wall is laid over the board");
  assert.deepEqual(marked.schema, before, "and the board the run holds is not written to");
  assert.equal(marked.schema, plain.schema);
  assert.equal(getTableSchema(marked), board, "the same object for the same board, so the stage's memos hold");
  assert.equal(getTableSchema({ ...marked }), board);
  assert.notEqual(getTableSchema({ ...marked, schema: { ...plain.schema } }), board, "and a new one for a new board");

  // A wall a rule had already put past 88 stays where it was; one below is lifted.
  assert.equal(getTableSchema({ story: true, schema: { ...BASE_SCHEMA, wallMin: 93, wallMax: 96 } }).wallMin, 93);
  assert.equal(getTableSchema({ story: true, schema: { ...BASE_SCHEMA, wallMin: 93, wallMax: 96 } }).wallMax, 98);
  // HIGH ROLLER brings the wall in; a story run's stays far, with the relic's chips kept.
  const roller = { story: true, schema: applyRelics(BASE_SCHEMA, ["highRoller"]) };
  assert.ok(roller.schema.wallMin < BASE_SCHEMA.wallMin);
  assert.equal(getTableSchema(roller).wallMin, 88);
  assert.equal(getTableSchema(roller).chipsScale, roller.schema.chipsScale);
});

test("every window of a story run draws its wall at 88 or past it, and settles against the wall it drew", () => {
  const boards = [
    BASE_SCHEMA,
    applyRelics(BASE_SCHEMA, ["highRoller"]),
    { ...BASE_SCHEMA, wallMin: 40, wallMax: 60, startGauge: 30, mutations: ["blackout", "aftershock"] },
    openCaseRun({ windowIndex: 450 }).schema,
  ];
  for (const schema of boards) {
    const run = normalizeRunState({ story: true, schema });
    const walls = new Set();
    for (let seed = 0; seed < 300; seed += 1) {
      const window = createWindow({ schema: getTableSchema(run), seed: `story-${seed}` });
      assert.ok(window.wall >= 88 && window.wall <= 98, `wall ${window.wall}`);
      assert.ok(window.gauge < window.wall);
      walls.add(window.wall);
      // The same window from the board the run holds would have drawn a nearer one.
      assert.ok(createWindow({ schema: run.schema, seed: `story-${seed}` }).wall <= window.wall);
    }
    assert.equal(walls.size, 11, "every wall from 88 to 98 is dealt");
  }
  // A push to heat 70 cannot reach it: the widest push of the plain board stops short of 88.
  assert.ok(69 + BASE_SCHEMA.stepMax < STORY_WALL_MIN);
  // The verdict reads the window's wall, so what the stage showed is what is settled.
  const window = reduceWindow({ ...createWindow({ schema: getTableSchema(story), seed: "settle" }), selectedId: "a", gauge: 80 }, { type: "CASH" });
  const { verdict } = resolveWindow({ run: story, window, card, rules: STORY_RULES });
  assert.equal(verdict.wall, window.wall);
  assert.equal(verdict.outcome, "cash");
});

test("the mark is the run's: it is carried through every settlement, a draft, a case opened by the engine, and a save", () => {
  assert.equal(RUN_INITIAL_STATE.story, false);
  assert.equal(normalizeRunState({}).story, false);
  assert.equal(normalizeRunState(null).story, false);
  assert.equal(normalizeRunState({ story: 1 }).story, false, "only true is the mark");
  assert.equal(story.story, true);

  const cashed = { status: "cashed", cause: "cash", gauge: 30, wall: 90, pushes: 2, seed: "carry" };
  for (const caseClosed of [false, true]) {
    assert.equal(resolveWindow({ run: story, window: cashed, card, caseClosed, offerRelics: true, rules: STORY_RULES }).nextRun.story, true);
    assert.equal(resolveWindow({ run: story, window: { ...cashed, status: "bust", cause: "push" }, card, caseClosed, rules: STORY_RULES }).nextRun.story, true);
    assert.equal(resolveWindow({ run: RUN_INITIAL_STATE, window: cashed, card, caseClosed }).nextRun.story, false);
  }
  const closed = resolveWindow({ run: story, window: cashed, card, caseClosed: true, offerRelics: true, rules: STORY_RULES }).nextRun;
  assert.equal(closed.relicOffer.length, 3, "a story run still drafts");
  assert.equal(equipRelic(closed, closed.relicOffer[0]).story, true);
  assert.equal(equipRelic(closed, null).story, true);
  // The engine opens a case with the mark it was handed; the stamp is the lifecycle's.
  assert.equal(openCaseRun(story).story, true);
  assert.equal(openCaseRun(closed, { rules: STORY_RULES }).story, true);
  const replay = openCaseRun(story, { replayOf: { pushRecord: null } });
  assert.equal(replay.story, true);
  assert.equal(resolveWindow({ run: replay, window: cashed, card, caseClosed: true }).nextRun.story, true, "and a replay closing hands it back with the rest");
  assert.equal(openCaseRun(RUN_INITIAL_STATE).story, false);

  // Save and load.
  const saved = JSON.parse(JSON.stringify(serializeRunState(closed)));
  assert.equal(saved.story, true);
  assert.deepEqual(serializeRunState(normalizeRunState(saved)), saved);
  assert.equal(JSON.parse(JSON.stringify(serializeRunState(RUN_INITIAL_STATE))).story, false);
});

/** `useRuntimeSavedState`'s pipeline: parse and migrate, then repair. */
function load(save) {
  return repairSavedState(parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION));
}

test("a save from before the mark loads as a run at the table with no recovery notice, and a story save keeps its mark", () => {
  const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("./fixtures/saves/v2-pre-unlocks.json", import.meta.url)), "utf8"));
  assert.ok(!("story" in fixture.save.dynamics), "the fixture was written before there was a mark");
  const old = load(fixture.save);
  assert.equal(old.repaired, false, "filling in the mark is not a repair");
  assert.equal(old.state.lastError, undefined);
  assert.equal(old.state.dynamics.story, false);
  assert.equal(RUN_FIELDS.gauntletRun.load(old.state).story, false);

  const marked = load({ ...fixture.save, dynamics: { ...fixture.save.dynamics, story: true } });
  assert.equal(marked.repaired, false);
  assert.equal(marked.state.dynamics.story, true);
  assert.equal(RUN_FIELDS.gauntletRun.load(marked.state).story, true);
  // Loaded a second time, the save the first load wrote is already in shape.
  const again = load(marked.state);
  assert.equal(again.repaired, false);
  assert.deepEqual(again.state.dynamics, marked.state.dynamics);
});

test("the table clock of a story run is never faster than twice as slow, and a slower setting is not multiplied", () => {
  assert.equal(STORY_CLOCK_SCALE, 2);
  const scales = (run) => settings.TABLE_TIME_SCALES.map((tableTime) => getTableClockScale(run, tableTime));
  assert.deepEqual(settings.TABLE_TIME_SCALES, [1, 1.5, 2]);
  assert.deepEqual(scales(RUN_INITIAL_STATE), [1, 1.5, 2], "a run at the table has the setting, as before");
  assert.deepEqual(scales(null), [1, 1.5, 2]);
  assert.deepEqual(scales({ story: "yes" }), [1, 1.5, 2]);
  assert.deepEqual(scales(story), [2, 2, 2], "forced, not multiplied");
  assert.equal(getTableClockScale(story), 2);
  assert.equal(getTableClockScale(RUN_INITIAL_STATE), 1);
  assert.equal(getTableClockScale(RUN_INITIAL_STATE, undefined), 1);

  // What the hook does with it: the seconds that reach the reducer are divided, and the window remembers the scale.
  const tick = (run, tableTime) => {
    const scale = getTableClockScale(run, tableTime);
    return reduceWindow(createWindow({ seed: "clock" }), { type: "TICK", delta: 0.5 / scale, scale });
  };
  assert.deepEqual([tick(RUN_INITIAL_STATE, 1).elapsed, tick(RUN_INITIAL_STATE, 1).timeScale], [0.5, 1]);
  assert.deepEqual([tick(story, 1).elapsed, tick(story, 1).timeScale], [0.25, 2]);
  assert.deepEqual([tick(story, 1.5).elapsed, tick(story, 1.5).timeScale], [0.25, 2]);
  const hook = readFileSync("src/gauntlet/useGauntletWindow.js", "utf8");
  assert.match(hook, /const scale = getTableClockScale\(\{ story \}, getAccessibility\(\)\.tableTime\);/);
  assert.match(hook, /dispatch\(\{ type: "TICK", delta: pending \/ scale, scale \}\);/);
});

test("a case's summary says it was played in story mode when any of its decisions was, and a ranking row carries that", () => {
  const entry = (extra = {}) => ({ caseId: "case02", nodeId: "c2_start", choiceId: "x", responseTimeSec: 10, effect: {}, ...extra });
  assert.equal("assistStory" in createCaseSummary({}, {}, [entry(), entry()]), false, "absent on a case played at the table");
  assert.equal(createCaseSummary({}, {}, [entry(), entry({ assistStory: true })]).assistStory, true);
  assert.equal("assistStory" in createCaseSummary({}, {}, [entry({ assistStory: "true" }), entry({ assistStory: 1 })]), false, "only the mark itself");
  assert.equal("assistStory" in createCaseSummary({}, {}, []), false);

  const row = (summary, extra = {}) => ({ case_id: "season-final", run_id: `run-${JSON.stringify(summary.assistStory)}`, completed_at: "2026-10-09T00:00:00Z", summary: { rank: "A", burstScore: 10, ...summary }, ...extra });
  assert.equal(buildLeaderboard([row({ assistStory: true }, { local: true })])[0].assistStory, true);
  assert.equal(buildLeaderboard([row({})])[0].assistStory, false);
  assert.equal(buildLeaderboard([row({ assistStory: "true" })])[0].assistStory, false);
  // Beside the slowed clock, which a story case also has.
  const [both] = buildLeaderboard([row({ assistStory: true, assistTime: 2 }, { local: true })]);
  assert.deepEqual([both.assistStory, both.assistTime, both.isLocal, both.seasonComplete], [true, 2, true, true]);
});

/* ---------------------------------------------------------------- the stamp */

const storySetting = (on) => ({ [ACCESSIBILITY_SETTINGS_KEY]: JSON.stringify({ storyMode: on }) });
/** A harness whose device has the setting as given; the cache is forgotten so the first read is this storage's. */
async function harnessWith(on, options = {}) {
  settings.resetAccessibilityCache();
  return createRunHarness({ ...options, storage: { ...storySetting(on), ...(options.storage ?? {}) } });
}

test("the setting is off unless the device has stored it on, and nothing else turns it on", () => {
  settings.resetAccessibilityCache();
  globalThis.localStorage = createStorage();
  assert.equal(settings.DEFAULT_ACCESSIBILITY.storyMode, false);
  assert.equal(settings.getAccessibility().storyMode, false, "a device that has never set anything");
  for (const stored of [{ storyMode: "true" }, { storyMode: 1 }, { story: true }, { tableTime: 2 }]) {
    globalThis.localStorage = createStorage({ [ACCESSIBILITY_SETTINGS_KEY]: JSON.stringify(stored) });
    settings.resetAccessibilityCache();
    assert.equal(settings.getAccessibility().storyMode, false, JSON.stringify(stored));
  }
  globalThis.localStorage = createStorage(storySetting(true));
  settings.resetAccessibilityCache();
  assert.equal(settings.getAccessibility().storyMode, true);
  settings.resetAccessibilityCache();
});

test("a new game takes the setting as it stands, with or without NEW GAME+", async () => {
  const off = await harnessWith(false);
  off.act("startGame");
  assert.equal(off.run.gauntletRun.story, false);
  assert.equal(off.saved().dynamics.story, false);
  assert.deepEqual(off.run.gauntletRun, structuredClone(RUN_INITIAL_STATE), "the opening table, as it always was");

  const on = await harnessWith(true);
  on.act("startGame");
  assert.equal(on.run.currentCase, CASE_SEQUENCE[0], "the season's first case is on the table straight from the start, with no case opened");
  assert.equal(on.run.gauntletRun.story, true);
  assert.equal(on.saved().dynamics.story, true);
  assert.deepEqual({ ...on.run.gauntletRun, story: false }, structuredClone(RUN_INITIAL_STATE), "nothing else about the table differs");

  const plus = await harnessWith(true);
  plus.act("startGame", { veteran: true });
  assert.deepEqual([plus.run.gauntletRun.veteran, plus.run.gauntletRun.story], [true, true]);
  assert.equal(getTableRules(plus.run.currentCase, plus.run.gauntletRun), STORY_RULES);
});

test("a run started from the pre-start shell has no table yet, and its opening table takes the setting when it is made", async () => {
  const shell = createStartSave({ playerName: "한서윤", playStyle: "instinct", dataConsent: true, operatorOrigin: "courier" }, { now: 5_000, runId: "run-shell" });
  assert.equal(shell.dynamics, null, "the shell cannot write a table: the engine is not in its chunk");

  const off = await harnessWith(false, { saved: shell });
  assert.deepEqual(off.run.gauntletRun, structuredClone(RUN_INITIAL_STATE));

  const on = await harnessWith(true, { saved: shell });
  assert.equal(on.run.currentCase, CASE_SEQUENCE[0]);
  assert.equal(on.run.gauntletRun.story, true);
  assert.deepEqual({ ...on.run.gauntletRun, story: false }, structuredClone(RUN_INITIAL_STATE));

  // A save that holds a table keeps the mark that table has, whatever the device says now.
  const held = { ...shell, dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 2 }) };
  assert.equal((await harnessWith(true, { saved: held })).run.gauntletRun.story, false);
  const heldStory = { ...shell, dynamics: serializeRunState({ ...RUN_INITIAL_STATE, windowIndex: 2, story: true }) };
  assert.equal((await harnessWith(false, { saved: heldStory })).run.gauntletRun.story, true);
  // And no save at all is the intro, which has no run to mark.
  assert.equal((await harnessWith(true)).run.gauntletRun.story, false);
});

test("a setting changed in the middle of a case applies from the next case, and the case on the table keeps the wall it was dealt", async () => {
  const harness = await harnessWith(false);
  harness.act("startGame");
  assert.equal(harness.run.gauntletRun.story, false);
  const seed = "held-window";
  const wallOf = () => createWindow({ schema: getTableSchema(harness.run.gauntletRun), seed }).wall;
  const dealt = wallOf();

  // Turned on while 프롤로그 01 is on the table: nothing about that case moves.
  settings.setAccessibility({ storyMode: true });
  harness.act("saveGame");
  assert.equal(harness.run.gauntletRun.story, false);
  assert.equal(harness.saved().dynamics.story, false);
  assert.equal(wallOf(), dealt, "a window put down and picked up again is dealt the same wall");
  assert.equal(getTableRules("prologue02", harness.run.gauntletRun, true), rulesFor("prologue02", { staged: true }));

  // The next case opens under it.
  harness.act("openCase", "prologue02");
  assert.equal(harness.run.currentCase, "prologue02");
  assert.equal(harness.run.gauntletRun.story, true);
  assert.equal(harness.saved().dynamics.story, true);
  assert.deepEqual(sorted(getTableRules("prologue02", harness.run.gauntletRun, true)), ["beat"]);
  const far = wallOf();
  assert.ok(far >= 88);
  assert.deepEqual(harness.run.gauntletRun.schema, harness.saved().dynamics.schema);
  assert.ok(harness.saved().dynamics.schema.wallMin < 88, "the far wall is not in the saved board");

  // Turned off again mid-case: the case stays a story case to its end.
  settings.setAccessibility({ storyMode: false });
  harness.act("saveGame");
  assert.equal(harness.run.gauntletRun.story, true);
  assert.equal(wallOf(), far);
  harness.act("openCase", "prologue03");
  assert.equal(harness.run.gauntletRun.story, false);
  assert.equal(harness.saved().dynamics.story, false);
  assert.ok(wallOf() <= BASE_SCHEMA.wallMax);
});

test("a case played again takes the setting like any case, and a scene opened from a replay link takes none", async () => {
  const again = await harnessWith(false);
  again.act("startGame");
  again.act("applyRun", { caseResults: { prologue01: { rank: "B", outcomeChoiceId: "p1_anything", completedAt: "2026-10-09T00:00:00.000Z" } }, completedCases: ["prologue01"] });
  settings.setAccessibility({ storyMode: true });
  again.act("openCase", "prologue01");
  assert.ok(again.run.gauntletRun.practice, "a closed case opens as practice");
  assert.equal(again.run.gauntletRun.story, true);

  const jump = await harnessWith(true);
  jump.act("jumpToNode", "case05", "c5_voice");
  assert.equal(jump.run.gauntletRun.story, true, "a run of this device's own");
  const replay = await harnessWith(true);
  replay.act("jumpToNode", "case05", "c5_voice", { persistRun: false });
  assert.equal(replay.run.gauntletRun.story, false, "somebody else's run, laid out to be looked at");
});
