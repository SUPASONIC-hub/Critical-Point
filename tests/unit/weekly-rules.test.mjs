import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createStorage } from "./helpers/browser.mjs";
import { createRunHarness } from "./helpers/runHarness.mjs";

globalThis.localStorage = createStorage();
globalThis.sessionStorage = createStorage();

const {
  getWeekRule,
  isoWeekKey,
  nextWeekRuleAt,
  normalizeWeekRuleId,
  NEAR_WALL_SHIFT,
  pickSeasonWeekRule,
  WEEK_RULE_CATALOGUE,
  WEEK_RULE_DEVICES,
  WEEK_RULE_ID_MAX,
  weekRuleAt,
  weekRuleHasDevice,
  weekRuleOverlay,
  WEEKLY_NOTICE_DAYS,
  WEEKLY_RULES,
  weekStartMs,
} = await import("../../src/gauntlet/weeklyRules.js");
const {
  finishedSeasons,
  isFirstSeason,
  SEASON_RECORD_STORAGE_KEY,
  setWeekRuleTakenUp,
  setWeekRuleTurnedDown,
  WEEK_RULE_OFF_STORAGE_KEY,
  WEEK_RULE_ON_STORAGE_KEY,
  weekRuleChoice,
  weekRuleTakenUp,
  weekRuleTurnedDown,
} = await import("../../src/state/weeklyRuleChoice.js");
const { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY } = await import("../../src/appConfig.js");
const { getBriefingIntro, getBriefingWeekRuleId } = await import("../../src/gauntlet/tableStaging.js");
const { localRowRule } = await import("../../src/state/useLeaderboard.js");
const { weekHasNews } = await import("../../src/gauntlet/weeklyCalendar.js");
const { weeklyRuleLine } = await import("../../src/gauntlet/weeklyRuleLine.js");
const { CASE_START_NODES } = await import("../../src/gameCases.js");
const { E2E_WEEKLY_RULE_CLOCK, pinnedWeeklyClock, weeklyRuleNow } = await import("../../src/state/weeklyClock.js");
const {
  BASE_SCHEMA,
  createRunSummary,
  getTableSchema,
  normalizeRunState,
  normalizeSchema,
  resolveWindow,
  RUN_INITIAL_STATE,
  serializeRunState,
} = await import("../../src/gauntlet/gauntletEngine.js");
const { initialRunState, RUN_FIELDS, runTransition } = await import("../../src/state/runState.js");

const kst = (text) => Date.parse(`${text}+09:00`);
const DAY = 24 * 60 * 60 * 1000;
const read = (path) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), "utf8");
const EVENT = WEEKLY_RULES[0];

/** A device that has finished a season: the week's rule is on by default there (E-8). */
const RETURNING = Object.freeze({ [NEW_GAME_PLUS_KEY]: "true" });

afterEach(() => {
  delete globalThis.__weeklyRuleClock;
  setWeekRuleTurnedDown(false);
  setWeekRuleTakenUp(false);
});

test("a week turns at Monday 00:00 in Korea, which is Sunday 15:00 UTC", () => {
  assert.equal(isoWeekKey(kst("2026-11-08T23:59:59.999")), "2026-W45");
  assert.equal(isoWeekKey(kst("2026-11-09T00:00:00")), "2026-W46");
  assert.equal(isoWeekKey(Date.parse("2026-11-08T14:59:59.999Z")), "2026-W45");
  assert.equal(isoWeekKey(Date.parse("2026-11-08T15:00:00Z")), "2026-W46", "UTC still reads Sunday; Korea is on Monday");
  assert.equal(isoWeekKey(Number.NaN), null);
  assert.equal(isoWeekKey("not a time"), null);
});

test("2026 has a 53rd week, and the years either side are counted by their Thursday", () => {
  assert.equal(isoWeekKey(kst("2026-12-27T23:59:59")), "2026-W52");
  assert.equal(isoWeekKey(kst("2026-12-28T00:00:00")), "2026-W53");
  assert.equal(isoWeekKey(kst("2027-01-03T23:59:59")), "2026-W53", "the first days of 2027 are 2026's last week");
  assert.equal(isoWeekKey(kst("2027-01-04T00:00:00")), "2027-W01");
  assert.equal(isoWeekKey(kst("2026-01-01T00:00:00")), "2026-W01", "1 January 2026 is a Thursday");
  assert.equal(isoWeekKey(kst("2025-12-29T00:00:00")), "2026-W01");
  assert.equal(isoWeekKey(kst("2021-01-03T12:00:00")), "2020-W53");
  assert.equal(weekStartMs("2027-W53"), null, "2027 has 52");
  assert.equal(weekStartMs("2026-W00"), null);
  assert.equal(weekStartMs("W46"), null);
});

test("every week of 2026 and 2027 starts on a Monday at midnight in Korea, a week after the last", () => {
  for (const [year, weeks] of [[2026, 53], [2027, 52]]) {
    let previous = null;
    for (let week = 1; week <= weeks; week += 1) {
      const key = `${year}-W${String(week).padStart(2, "0")}`;
      const start = weekStartMs(key);
      assert.equal(isoWeekKey(start), key);
      assert.equal(isoWeekKey(start - 1), previous ?? (year === 2026 ? "2025-W52" : "2026-W53"));
      const local = new Date(start + 9 * 60 * 60 * 1000);
      assert.equal(local.getUTCDay(), 1, `${key} starts on a Monday`);
      assert.equal(local.getUTCHours() + local.getUTCMinutes(), 0);
      if (previous) assert.equal(start - weekStartMs(previous), 7 * DAY);
      previous = key;
    }
  }
});

test("the calendar names known rules, one per week, announced a week ahead", () => {
  const weeks = new Set();
  for (const entry of WEEKLY_RULES) {
    assert.ok(getWeekRule(entry.id), `${entry.week} names a rule in the catalogue`);
    assert.ok(weekStartMs(entry.week) !== null, `${entry.week} is a week`);
    assert.ok(!weeks.has(entry.week), `${entry.week} has one rule`);
    weeks.add(entry.week);
    const announced = kst(`${entry.added}T00:00:00`);
    // A shorter notice would be the entry's own and said there. W44's five days went with it to W47 (user, 2026-10-22).
    const notice = entry.notice ?? WEEKLY_NOTICE_DAYS;
    assert.equal(entry.notice, undefined, `${entry.week}'s notice of ${notice} days is not one the user chose`);
    assert.ok(weekStartMs(entry.week) - announced >= notice * DAY, `${entry.week} was added ${notice} days before it starts`);
  }
  for (const [id, rule] of Object.entries(WEEK_RULE_CATALOGUE)) {
    assert.ok(id.length <= WEEK_RULE_ID_MAX, id);
    assert.match(id, /^[a-z][a-z0-9-]*$/);
    for (const key of ["label", "title", "text"]) assert.ok(typeof rule[key] === "string" && rule[key].length > 0, `${id}.${key}`);
    for (const key of Object.keys(rule.schema ?? {})) {
      assert.ok(["wallShift", "seconds", "chipsScale", "fractureRate", "sealBreak"].includes(key), `${id} moves only a number normalizeSchema clamps (D4): ${key}`);
    }
    // Or switches on a device, by name, from the allowlist (B3 decision 8, B2 decision 11).
    for (const device of rule.rules ?? []) assert.ok(WEEK_RULE_DEVICES.includes(device), `${id} switches on only an allowed device: ${device}`);
    assert.ok(rule.schema || rule.rules?.length, `${id} moves a number or switches on a device`);
  }
});

test("the week's rule is found by the week, and the week after it is the notice", () => {
  const start = weekStartMs(EVENT.week);
  assert.equal(weekRuleAt(start)?.id, EVENT.id);
  assert.equal(weekRuleAt(start)?.week, EVENT.week);
  assert.equal(weekRuleAt(start + 7 * DAY - 1)?.id, EVENT.id);
  assert.equal(weekRuleAt(start - 1), null);
  // The test week follows W46 (2026-W47): asked of the event alone.
  assert.equal(weekRuleAt(start + 7 * DAY, [EVENT]), null);
  assert.equal(nextWeekRuleAt(start - 1)?.id, EVENT.id);
  assert.equal(nextWeekRuleAt(start, [EVENT]), null);
  assert.equal(weekRuleAt(start, []), null);
});

test("a season takes the week's rule unless it was turned down or is played in story mode", () => {
  const during = weekStartMs(EVENT.week) + DAY;
  assert.equal(pickSeasonWeekRule(during), EVENT.id);
  assert.equal(pickSeasonWeekRule(during, { declined: true }), null);
  assert.equal(pickSeasonWeekRule(during, { story: true }), null);
  assert.equal(pickSeasonWeekRule(during - 7 * DAY), null);
  assert.equal(normalizeWeekRuleId(EVENT.id), EVENT.id);
  for (const value of [undefined, null, "", "made-up", 4, {}]) assert.equal(normalizeWeekRuleId(value), null);
});

test("the test builds hold the weekly clock on a week without a rule, in both places the pin is written", () => {
  const pinned = Date.parse(E2E_WEEKLY_RULE_CLOCK);
  assert.equal(weekRuleAt(pinned), null, "the pin's week must never get a rule: every baseline was recorded under it");
  assert.equal(nextWeekRuleAt(pinned), null, "nor the week after, which the notice reads");
  assert.ok(pinned < Math.min(...WEEKLY_RULES.map((entry) => weekStartMs(entry.week))), "the pin is before the first event, so a new entry cannot land on it");
  assert.match(read(".env.e2e"), new RegExp(`^VITE_WEEKLY_RULE_CLOCK=${E2E_WEEKLY_RULE_CLOCK.replace(/[+.]/g, "\\$&")}$`, "m"), "build:e2e");
  assert.ok(read("scripts/run-e2e.mjs").includes(`VITE_WEEKLY_RULE_CLOCK: "${E2E_WEEKLY_RULE_CLOCK}"`), "the dev server run-e2e starts");
  assert.ok(!/VITE_WEEKLY_RULE_CLOCK/.test(read(".env.example")), "the deployed build reads the device clock");
});

test("the weekly clock: the device's in a deployed build, the pin in a test build, an override only under a pin", () => {
  const now = () => 123;
  assert.equal(weeklyRuleNow({ env: {}, now, scope: { __weeklyRuleClock: E2E_WEEKLY_RULE_CLOCK } }), 123, "an unpinned build never reads the override");
  assert.equal(pinnedWeeklyClock({}), null);
  const env = { VITE_WEEKLY_RULE_CLOCK: E2E_WEEKLY_RULE_CLOCK };
  assert.equal(weeklyRuleNow({ env, now, scope: {} }), Date.parse(E2E_WEEKLY_RULE_CLOCK));
  assert.equal(weeklyRuleNow({ env, now, scope: { __weeklyRuleClock: "2026-11-10T09:00:00+09:00" } }), kst("2026-11-10T09:00:00"));
  assert.equal(weeklyRuleNow({ env, now, scope: { __weeklyRuleClock: 5_000 } }), 5_000);
  assert.equal(weeklyRuleNow({ env, now, scope: { __weeklyRuleClock: "garbage" } }), Date.parse(E2E_WEEKLY_RULE_CLOCK));
  assert.equal(weeklyRuleNow(), Date.parse(E2E_WEEKLY_RULE_CLOCK), "node (npm test) is held on the pin, so no unit test changes on an event week");
});

test("the rule is laid over the board at the deal, clamped, and never written into it", () => {
  const run = normalizeRunState({ weekRule: "near-wall" });
  const board = getTableSchema(run);
  assert.equal(board.wallMin, BASE_SCHEMA.wallMin - NEAR_WALL_SHIFT);
  assert.equal(board.wallMax, BASE_SCHEMA.wallMax - NEAR_WALL_SHIFT);
  assert.equal(run.schema.wallMin, BASE_SCHEMA.wallMin, "the run's own board is untouched");
  assert.equal(getTableSchema(run), board, "one board per saved board, for the stage's memos");
  assert.deepEqual(board.mutations, run.schema.mutations);
  assert.deepEqual(board.relics, run.schema.relics);
  const plain = normalizeRunState({});
  assert.equal(getTableSchema(plain), plain.schema, "no rule, the board itself");

  // At the ends of the ranges, the clamp holds.
  for (const schema of [normalizeSchema({ wallMin: 38, wallMax: 40 }), normalizeSchema({ wallMin: 96, wallMax: 98, stepMax: 40 }), normalizeSchema({ fractureRate: 2 })]) {
    for (const id of Object.keys(WEEK_RULE_CATALOGUE)) {
      const dealt = getTableSchema({ ...RUN_INITIAL_STATE, weekRule: id, schema });
      const clamped = normalizeSchema(dealt);
      for (const key of ["seconds", "wallMin", "wallMax", "startGauge", "chipsScale", "fractureRate", "sealBreak"]) assert.equal(dealt[key], clamped[key], `${id} ${key}`);
    }
  }
  assert.deepEqual(weekRuleOverlay("heavy-fracture", BASE_SCHEMA), { fractureRate: WEEK_RULE_CATALOGUE["heavy-fracture"].schema.fractureRate });
  assert.equal(weekRuleOverlay("made-up", BASE_SCHEMA), null);
});

test("a story case deals the story wall and no week's rule", () => {
  const story = getTableSchema(normalizeRunState({ story: true, weekRule: "near-wall" }));
  const plainStory = getTableSchema(normalizeRunState({ story: true }));
  assert.equal(story.wallMin, plainStory.wallMin);
  assert.equal(story.wallMax, plainStory.wallMax);
});

test("the stamp survives the save, a settled window and a closed case, and goes into the summary", () => {
  const run = normalizeRunState({ weekRule: "near-wall" });
  assert.equal(RUN_INITIAL_STATE.weekRule, null);
  assert.equal(normalizeRunState(serializeRunState(run)).weekRule, "near-wall");
  assert.equal(normalizeRunState({ weekRule: "made-up" }).weekRule, null);
  const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
  const cashed = { status: "cashed", cause: "cash", gauge: 30, wall: 90, pushes: 2, seed: "carry" };
  for (const caseClosed of [false, true]) {
    assert.equal(resolveWindow({ run, window: cashed, card, caseClosed }).nextRun.weekRule, "near-wall");
    assert.equal(resolveWindow({ run, window: { ...cashed, status: "bust", cause: "push" }, card, caseClosed }).nextRun.weekRule, "near-wall");
  }
  assert.equal(createRunSummary(run).weekRule, "near-wall");
  assert.ok(Object.hasOwn(createRunSummary(RUN_INITIAL_STATE), "weekRule"), "the server reads the key on every case row");
  assert.equal(createRunSummary(RUN_INITIAL_STATE).weekRule, null);
});

test("newGame stamps the rule the caller read; story mode and a direct jump stamp none", () => {
  const base = { runId: "r", playerName: "분석관", now: 2_000 };
  const before = initialRunState(null, { runId: "run-ctx", operatorOrigin: "lab", sessionId: "session-ctx", now: 1_000, openRecovery: false });
  assert.equal(runTransition(before, { type: "newGame", ...base, weekRule: "near-wall" }).gauntletRun.weekRule, "near-wall");
  assert.equal(runTransition(before, { type: "newGame", ...base, weekRule: "near-wall", story: true }).gauntletRun.weekRule, null);
  assert.equal(runTransition(before, { type: "newGame", ...base, weekRule: "made-up" }).gauntletRun, RUN_INITIAL_STATE);
  assert.equal(runTransition(before, { type: "newGame", ...base }).gauntletRun, RUN_INITIAL_STATE, "no rule, the opening table as it always was");
  assert.equal(runTransition(before, { type: "jumpToNode", ...base, caseId: "case01", nodeId: "n", completedCases: [], echo: "" }).gauntletRun.weekRule, null);
});

test("시작 reads the weekly clock once; turning it down or a later week changes nothing about that season", async () => {
  globalThis.__weeklyRuleClock = weekStartMs(EVENT.week) + 60_000;
  const during = await createRunHarness({ storage: RETURNING });
  during.act("startGame");
  assert.equal(during.run.gauntletRun.weekRule, EVENT.id);
  assert.equal(during.saved().dynamics.weekRule, EVENT.id);

  // A week later the season keeps the rule it started with (D3).
  globalThis.__weeklyRuleClock = weekStartMs(EVENT.week) + 8 * DAY;
  during.act("saveGame");
  assert.equal(during.saved().dynamics.weekRule, EVENT.id);

  globalThis.__weeklyRuleClock = weekStartMs(EVENT.week) + 60_000;
  const declined = await createRunHarness({ storage: RETURNING });
  declined.act("startGame", { declineWeekRule: true });
  assert.equal(declined.run.gauntletRun.weekRule, null);

  delete globalThis.__weeklyRuleClock;
  const plain = await createRunHarness({ storage: RETURNING });
  plain.act("startGame");
  assert.deepEqual(plain.run.gauntletRun, structuredClone(RUN_INITIAL_STATE));
});

test("a device's first season starts without the week's rule unless it is taken up; the second starts with it (E-8)", async () => {
  const during = weekStartMs(EVENT.week) + DAY;
  assert.equal(pickSeasonWeekRule(during, { firstSeason: true }), null, "the first season, off by default");
  assert.equal(pickSeasonWeekRule(during, { firstSeason: true, takenUp: true }), EVENT.id, "taken up on the start screen");
  assert.equal(pickSeasonWeekRule(during, { firstSeason: true, declined: true, takenUp: true }), EVENT.id, "the returning box does not reach a first season");
  assert.equal(pickSeasonWeekRule(during, { firstSeason: true, takenUp: true, story: true }), null);
  assert.equal(pickSeasonWeekRule(during, { firstSeason: false, takenUp: false }), EVENT.id, "a later season, on as before");
  assert.equal(pickSeasonWeekRule(during - 7 * DAY, { firstSeason: true, takenUp: true }), null, "no week, no rule");

  globalThis.__weeklyRuleClock = during;
  const fresh = await createRunHarness();
  assert.equal(isFirstSeason(), true);
  fresh.act("startGame");
  assert.equal(fresh.run.gauntletRun.weekRule ?? null, null, "a fresh device's 시작");
  assert.equal(RUN_FIELDS.gauntletRun.load({ dynamics: null }).weekRule ?? null, null, "and the shell's");

  const takenUp = await createRunHarness({ storage: { [WEEK_RULE_ON_STORAGE_KEY]: "1" } });
  assert.equal(weekRuleTakenUp(), true);
  takenUp.act("startGame");
  assert.equal(takenUp.run.gauntletRun.weekRule, EVENT.id);
  assert.equal(RUN_FIELDS.gauntletRun.load({ dynamics: null }).weekRule, EVENT.id);

  // NEW GAME+ is never a first season, whatever the storage says.
  const veteran = await createRunHarness();
  veteran.act("startGame", { veteran: true });
  assert.equal(veteran.run.gauntletRun.weekRule, EVENT.id);

  for (const storage of [RETURNING, { [NEW_GAME_PLUS_MEMORY_KEY]: JSON.stringify({ final: { runId: "r" } }) }, { [SEASON_RECORD_STORAGE_KEY]: JSON.stringify({ seasons: 2 }) }]) {
    const back = await createRunHarness({ storage });
    assert.equal(isFirstSeason(), false, JSON.stringify(storage));
    back.act("startGame");
    assert.equal(back.run.gauntletRun.weekRule, EVENT.id, `a device that finished a season: ${JSON.stringify(storage)}`);
  }
});

test("the season count reads the NEW GAME+ record, and before it the unlock or the finale's memory", async () => {
  await createRunHarness();
  assert.equal(finishedSeasons(), 0);
  assert.deepEqual(weekRuleChoice(), { declined: false, firstSeason: true, takenUp: false });
  for (const [storage, seasons] of [
    [{ [SEASON_RECORD_STORAGE_KEY]: JSON.stringify({ seasons: 3 }) }, 3],
    [{ [SEASON_RECORD_STORAGE_KEY]: JSON.stringify({ seasons: 0 }) }, 0],
    [{ [SEASON_RECORD_STORAGE_KEY]: "not json" }, 0],
    [{ [SEASON_RECORD_STORAGE_KEY]: JSON.stringify({ seasons: 1.5 }) }, 0],
    [{ [NEW_GAME_PLUS_KEY]: "false" }, 0],
    [{ [NEW_GAME_PLUS_KEY]: "true" }, 1],
    [{ [NEW_GAME_PLUS_MEMORY_KEY]: JSON.stringify({ case01: {} }) }, 0],
    [{ [NEW_GAME_PLUS_MEMORY_KEY]: JSON.stringify({ final: {} }) }, 1],
    [{ [SEASON_RECORD_STORAGE_KEY]: JSON.stringify({ seasons: 4 }), [NEW_GAME_PLUS_KEY]: "true" }, 4],
  ]) {
    await createRunHarness({ storage });
    assert.equal(finishedSeasons(), seasons, JSON.stringify(storage));
  }
  // The start screen says whom the week is for, and its box takes it up (the e2e plays both).
  const views = read("src/components/WeeklyRuleViews.jsx");
  assert.match(views, /돌아온 분석관을 위한 이번 주의 규칙/);
  assert.match(views, /이번 주의 규칙으로 시작/);
  assert.match(read("src/components/WeeklyRuleNotice.jsx"), /first \? setWeekRuleTakenUp : setWeekRuleTurnedDown/);
  assert.equal(setWeekRuleTakenUp(true), true);
  assert.equal(localStorage.getItem(WEEK_RULE_ON_STORAGE_KEY), "1");
  setWeekRuleTakenUp(false);
  assert.equal(localStorage.getItem(WEEK_RULE_ON_STORAGE_KEY), null);
});

test("the server's week table says what the calendar says", () => {
  // The migrations list the weeks as `('2026-W46', 'near-wall')`, one file
  // after another (W44, the test week, came in a file of its own, and the
  // next one moved it to W47 with a delete); replayed in order here, and
  // check:grants holds the table PGlite builds from them to the same.
  const byWeek = (a, b) => a.week.localeCompare(b.week);
  const table = new Map();
  for (const name of ["20261021000000_weekly_rule_event.sql", "20261021010000_weekly_rule_w44_test_week.sql", "20261022010000_test_week_to_w47.sql"]) {
    const sql = read(`supabase/migrations/${name}`).replace(/^--.*$/gm, "");
    for (const [, week] of sql.matchAll(/delete from public\.weekly_rules where week = '(\d{4}-W\d{2})'/g)) table.delete(week);
    for (const [, week, id] of sql.matchAll(/\('(\d{4}-W\d{2})',\s*'([a-z0-9-]+)'\)/g)) table.set(week, id);
  }
  const listed = [...table].map(([week, id]) => ({ week, id }));
  assert.deepEqual(listed.sort(byWeek), WEEKLY_RULES.map(({ week, id }) => ({ week, id })).sort(byWeek));
});

test("the start screen's box turns the rule down on this device, for both starts (결정 27)", async () => {
  globalThis.__weeklyRuleClock = weekStartMs(EVENT.week) + 60_000;
  await createRunHarness({ storage: RETURNING });
  assert.equal(weekRuleTurnedDown(), false);
  assert.equal(RUN_FIELDS.gauntletRun.load({ dynamics: null }).weekRule, EVENT.id, "the shell's 시작, on by default");

  assert.equal(setWeekRuleTurnedDown(true), true);
  assert.equal(localStorage.getItem(WEEK_RULE_OFF_STORAGE_KEY), "1");
  assert.equal(RUN_FIELDS.gauntletRun.load({ dynamics: null }).weekRule ?? null, null, "the shell's 시작 reads the key");
  // The harness starts on a storage of its own: the key is put in it.
  const runtime = await createRunHarness({ storage: { ...RETURNING, [WEEK_RULE_OFF_STORAGE_KEY]: "1" } });
  runtime.act("startGame");
  assert.equal(runtime.run.gauntletRun.weekRule, null, "and so does the runtime's");
  assert.equal(RUN_FIELDS.gauntletRun.load({ dynamics: { weekRule: EVENT.id } }).weekRule, EVENT.id, "a season already started keeps its rule");

  setWeekRuleTurnedDown(false);
  assert.equal(localStorage.getItem(WEEK_RULE_OFF_STORAGE_KEY), null);
  const again = await createRunHarness({ storage: RETURNING });
  again.act("startGame");
  assert.equal(again.run.gauntletRun.weekRule, EVENT.id);
});

test("the briefing gives the rule a panel of its own on a case's opening page, not a line among the unlocks (결정 28)", () => {
  const caseId = Object.keys(CASE_START_NODES)[0];
  const nodeId = CASE_START_NODES[caseId];
  const node = { caseId };
  const run = { weekRule: EVENT.id };
  assert.equal(getBriefingWeekRuleId(node, nodeId, run), EVENT.id);
  assert.equal(getBriefingWeekRuleId(node, `${nodeId}-later`, run), null, "a case's later pages");
  assert.equal(getBriefingWeekRuleId(node, nodeId, { ...run, story: true }), null, "a story case deals none");
  assert.equal(getBriefingWeekRuleId(node, nodeId, {}), null);
  // The panel's chunk reads the rule; the PlayScreen chunk's staging file does not import the catalogue.
  assert.doesNotMatch(read("src/gauntlet/tableStaging.js"), /weeklyRules/);
  const panel = read("src/gauntlet/WeekRulePanel.jsx");
  assert.match(panel, /getWeekRule\(id\)/);
  assert.match(read("vite.config.js"), /WEEK_RULE_PANEL = "src\/gauntlet\/WeekRulePanel\.jsx"/);
  assert.deepEqual(getBriefingIntro(node, nodeId, run, true), getBriefingIntro(node, nodeId, {}, true), "the unlock lines are the same with or without a rule");
});

test("this device's records are split by the rule they were played under", () => {
  const row = (weekRule) => ({ case_id: "season-final", summary: { gauntlet: { weekRule } } });
  assert.equal(localRowRule(row(EVENT.id)), EVENT.id);
  assert.equal(localRowRule(row(null)), null);
  assert.equal(localRowRule({ case_id: "case01", summary: {} }), null, "an older row is the ordinary board's");
});

test("the start screen fetches the rule's words only in a week with something to say", () => {
  // Asked of the first event alone: the test week, W47, is the week after it.
  const start = weekStartMs(EVENT.week);
  assert.equal(weekHasNews(start - 7 * DAY + 60_000, [EVENT]), true, "the week before: the notice");
  assert.equal(weekHasNews(start + DAY, [EVENT]), true, "the week itself");
  assert.equal(weekHasNews(start - 8 * DAY, [EVENT]), false, "two weeks before");
  assert.equal(weekHasNews(start + 7 * DAY, [EVENT]), false, "the week after");
  assert.equal(weekHasNews(Date.parse(E2E_WEEKLY_RULE_CLOCK)), false, "never in a test build");
  // The entry chunk asks the calendar, not the catalogue.
  const stub = read("src/components/WeeklyRuleNotice.jsx");
  assert.ok(stub.includes(`from "../gauntlet/weeklyCalendar.js"`));
  assert.ok(!stub.includes("weeklyRules.js"));
  assert.doesNotMatch(read("src/gauntlet/weeklyCalendar.js"), /^import /m, "a leaf");
});

test("2026-W47, the test week, switches on the audit and the links together, and is told from W46 on", () => {
  const entry = WEEKLY_RULES.find((item) => item.week === "2026-W47");
  assert.equal(entry?.id, "audit-cascade");
  assert.deepEqual([...getWeekRule(entry.id).rules], ["audit", "cascade"]);
  for (const device of ["audit", "cascade"]) assert.equal(weekRuleHasDevice(entry.id, device), true, device);
  assert.equal(getWeekRule(entry.id).schema, undefined, "no number on the board moves");
  assert.equal(weekStartMs("2026-W47"), kst("2026-11-16T00:00:00"), "Monday 2026-11-16, Korean time");
  // Moved on 2026-10-22 (user): W44 is an ordinary week again.
  assert.equal(WEEKLY_RULES.find((item) => item.week === "2026-W44"), undefined);
  assert.equal(pickSeasonWeekRule(weekStartMs("2026-W47") + DAY), "audit-cascade");
  assert.equal(pickSeasonWeekRule(weekStartMs("2026-W47") + DAY, { story: true }), null, "story mode is outside every ranking");
  assert.equal(weekRuleAt(weekStartMs("2026-W48")), null, "the week after has none");
  // Told from W46's Monday, the ordinary week's notice, on W46's own line.
  assert.equal(nextWeekRuleAt(weekStartMs("2026-W46"))?.id, "audit-cascade");
  assert.equal(nextWeekRuleAt(weekStartMs("2026-W46") - 1)?.id, "near-wall", "W45 tells of W46");
  const line = weeklyRuleLine(weekStartMs("2026-W46") + DAY);
  assert.equal(line.tone, "current");
  assert.equal(line.label, "NEAR WALL");
  assert.match(line.text, /다음 주의 규칙은 AUDIT & CASCADE\(감사와 연쇄\), 다음 월요일 0시부터\.$/);
  assert.match(weeklyRuleLine(weekStartMs("2026-W47") + DAY).text, /순위는 따로 쌓인다\.$/, "W47's own line tells of nothing after it");
});

test("10-22 to 11-01 (W43, W44): no rule this week and no notice of the next, until W45 tells of W46", () => {
  for (let at = kst("2026-10-22T17:00:00"); at < weekStartMs("2026-W45"); at += 6 * 60 * 60 * 1000) {
    assert.equal(weekRuleAt(at), null, new Date(at).toISOString());
    assert.equal(nextWeekRuleAt(at), null, new Date(at).toISOString());
    assert.equal(weekHasNews(at), false, new Date(at).toISOString());
    assert.equal(weeklyRuleLine(at), null, new Date(at).toISOString());
    assert.equal(pickSeasonWeekRule(at), null, new Date(at).toISOString());
  }
  assert.equal(weeklyRuleLine(weekStartMs("2026-W45")).tone, "next", "W45's Monday: W46's notice");
});
