import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  carryLinks,
  carryLinksOut,
  describeRange,
  getEffectBurn,
  isCascadeOn,
  isDueNext,
  isLinkDue,
  LINK_BURN,
  LINK_CARRY_MAX,
  LINK_SPAN_MAX,
  LINK_SPAN_MIN,
  LINK_WALL,
  linkDelay,
  normalizeLinks,
  readLinks,
  readWalk,
  walkLinks,
} from "../../src/gauntlet/cascadeRisk.js";
import { BASE_SCHEMA, buildNextSchema, describeMutations, FRACTURE_MIN_BURN, isPenaltyMutation, MUTATIONS, normalizeRunState, normalizeSchema, openCaseRun, resolveWindow, seededUnit } from "../../src/gauntlet/gauntletEngine.js";
import { BLACKOUT_WALL_SHIFT } from "../../src/gauntlet/tableRules.js";
import { DEV_WEEK_RULE, devWeekEntry } from "../../src/gauntlet/weeklyCalendar.js";
import { getWeekRule, pickSeasonWeekRule, WEEK_RULE_DEVICES, WEEKLY_RULES, weekRuleHasDevice, weekRuleOverlay } from "../../src/gauntlet/weeklyRules.js";

const heavy = { id: "heavy", label: "heavy", effect: { capital: 9, legitimacy: -12 }, next: "x" };
const light = { id: "light", label: "light", effect: { capital: 12, trust: -4 }, next: "x" };
const cash = (seed) => ({ status: "cashed", cause: "cash", gauge: 30, wall: 95, pushes: 2, seed });
const bust = (seed) => ({ status: "bust", cause: "push", gauge: 70, wall: 69, pushes: 4, seed });

/**
 * Plays a case through the engine as the runtime does (useChoiceCommit):
 * the link due off the log, the log gaining each window's entry, and the
 * closing commit writing what the case hands on. `on` is a season of the
 * `cascade` week; `from` is the run the case opens from (the last case's).
 */
const WEEK = { weekRule: "cascade" };
function playCase(windows, { runId = "run-1", on = true, from = null, last = false, replayOf = null } = {}) {
  let run = openCaseRun(normalizeRunState(from ?? (on ? WEEK : {})), { replayOf });
  const opened = run;
  const log = [];
  const boards = [];
  windows.forEach(([card, window], index) => {
    const caseClosed = index === windows.length - 1;
    const cascade = isLinkDue(run, log, runId);
    const { verdict, nextRun } = resolveWindow({ run, window, card, caseClosed, cascade });
    log.push({
      nodeId: `n${index}`,
      choiceId: card.id,
      threshold: { state: verdict.outcome, busted: verdict.outcome === "bust" },
      riskRewardEffect: verdict.outcome === "cash" ? card.effect : {},
      environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable",
    });
    boards.push(nextRun.schema);
    run = normalizeRunState(carryLinksOut(nextRun, { run, log, runId, caseClosed, last }));
  });
  return { run, opened, log, boards };
}

test("no table counts links outside a cascade week's season, and the engine deals none unasked", () => {
  assert.equal(isCascadeOn(normalizeRunState({})), false);
  assert.equal(isCascadeOn(normalizeRunState(WEEK)), true);
  assert.equal(isCascadeOn(normalizeRunState({ weekRule: "near-wall" })), false);
  assert.equal(isCascadeOn(normalizeRunState({ ...WEEK, story: true })), false, "never in story mode");
  assert.equal(isCascadeOn(openCaseRun(normalizeRunState(WEEK), { replayOf: {} })), false, "never in a case played again");
  assert.ok(WEEKLY_RULES.every((entry) => !weekRuleHasDevice(entry.id, "cascade")), "no week of the calendar has it");
  const { log } = playCase([[heavy, cash("a")], [light, cash("b")], [light, cash("c")], [light, cash("d")], [light, cash("e")], [light, cash("f")]], { on: false });
  assert.equal(readLinks(normalizeRunState({}), log, "run-1"), null);
  assert.equal(isLinkDue(normalizeRunState({}), log, "run-1"), false);
  assert.ok(log.every((entry) => !entry.environmentMode.includes("cascade")));
  const { verdict } = resolveWindow({ run: openCaseRun(normalizeRunState({})), window: cash("z"), card: heavy });
  assert.equal(verdict.link, null, "no reveal line for a link");
});

test("B's numbers: the burn FRACTURE reads, two to four boards, BLACKOUT's wall", () => {
  assert.equal(LINK_BURN, FRACTURE_MIN_BURN);
  assert.equal(LINK_WALL, BLACKOUT_WALL_SHIFT);
  assert.deepEqual([LINK_SPAN_MIN, LINK_SPAN_MAX], [2, 4]);
  assert.ok(MUTATIONS.cascade.text.includes(String(LINK_WALL)), "the line quotes the wall");
  assert.equal(isPenaltyMutation("cascade"), true);
});

test("the draw is seededUnit written out, and reads the run, the scene and the card only", () => {
  for (const seed of ["link:a:b:c", "", "x".repeat(40), "링크:사건:카드"]) {
    const delay = linkDelay(...seed.split(":").slice(1));
    assert.ok(delay >= LINK_SPAN_MIN && delay <= LINK_SPAN_MAX);
  }
  const source = readFileSync(new URL("../../src/gauntlet/cascadeRisk.js", import.meta.url), "utf8");
  assert.ok(!/from "\.\/gauntletEngine\.js"/.test(source), "the chunk does not import the engine's");
  for (const seed of ["link:run:n0:heavy", "a", "링크"]) {
    const [runId, nodeId, choiceId] = seed.split(":").slice(1);
    if (runId === undefined) continue;
    assert.equal(linkDelay(runId, nodeId, choiceId), LINK_SPAN_MIN + Math.floor(seededUnit(seed) * (LINK_SPAN_MAX - LINK_SPAN_MIN + 1)));
  }
  const spread = new Set(Array.from({ length: 60 }, (_, index) => linkDelay(`run-${index}`, "n0", "heavy")));
  assert.deepEqual([...spread].sort(), [2, 3, 4], "every board of the span is drawn");
});

test("a heavy cash makes a link; a light one, a bust and a BLACKOUT board make none", () => {
  assert.equal(getEffectBurn(heavy.effect), 12);
  assert.equal(getEffectBurn({ fatigue: 9, capital: 3 }), 9, "fatigue rising is a cost");
  assert.equal(getEffectBurn({ capital: 20 }), 0);
  const made = (entries) => walkLinks(entries, "r").made;
  const entry = (effect, extra = {}) => ({ nodeId: "n", choiceId: "c", threshold: { state: "cash" }, riskRewardEffect: effect, environmentMode: "stable", ...extra });
  assert.equal(made([entry(heavy.effect)]), 1);
  assert.equal(made([entry(light.effect)]), 0);
  assert.equal(made([entry(heavy.effect, { threshold: { state: "bust", busted: true } })]), 0);
  assert.equal(made([entry(light.effect, { environmentMode: "blackout+aftershock" }), entry(heavy.effect)]), 0, "made on a board BLACKOUT dealt");
  assert.equal(made([{ nodeId: "no window" }, entry(heavy.effect)]), 1, "an entry with no window is no board");
});

test("the link lands once, two to four boards on, with the wall closer and said before the board opens", () => {
  const windows = [[heavy, cash("a")], ...Array.from({ length: 6 }, (_, index) => [light, cash(`b${index}`)])];
  const { log, boards } = playCase(windows);
  const delay = linkDelay("run-1", "n0", "heavy");
  const landedOn = log.findIndex((entry) => entry.environmentMode.includes("cascade")) + 1;
  assert.equal(landedOn, delay, "the board the draw named");
  assert.equal(log.filter((entry) => entry.environmentMode.includes("cascade")).length, 1);
  const board = boards[landedOn - 1];
  const base = normalizeSchema(BASE_SCHEMA);
  assert.equal(board.wallMin, base.wallMin - LINK_WALL);
  assert.ok(describeMutations(board).some((mutation) => mutation.id === "cascade" && mutation.label === "CASCADE"));
  const walked = walkLinks(log, "run-1");
  assert.deepEqual([walked.made, walked.landed, walked.landedIn, walked.pending.length, walked.carried.length], [1, 1, 0, 0, 0]);
});

test("the range is told and narrows: 1~3 boards after the next table, then the next board", () => {
  const entry = { nodeId: "n0", choiceId: "heavy", threshold: { state: "cash" }, riskRewardEffect: heavy.effect, environmentMode: "stable" };
  const plain = { ...entry, choiceId: "light", riskRewardEffect: light.effect };
  const first = readWalk(walkLinks([entry], "r"));
  assert.deepEqual([first.live, first.nearest], [1, [1, 3]]);
  assert.equal(describeRange(first.nearest), "1~3판 안");
  assert.ok(first.said.includes(String(LINK_WALL)));
  // The link drawn for the farthest board: two plain boards later it is due next.
  const runId = Array.from({ length: 50 }, (_, index) => `r${index}`).find((id) => linkDelay(id, "n0", "heavy") === LINK_SPAN_MAX);
  const later = readWalk(walkLinks([entry, plain, plain, plain], runId));
  assert.deepEqual(later.nearest, [1, 1]);
  assert.equal(later.atRisk, true);
  assert.equal(describeRange(later.nearest), "다음 판");
  assert.equal(readWalk(walkLinks([], "r")).live, 0);
});

test("a link due on a BLACKOUT board waits one; two due together land a board apart", () => {
  const runId = Array.from({ length: 80 }, (_, index) => `r${index}`).find((id) => linkDelay(id, "n0", "heavy") === LINK_SPAN_MIN);
  const { log, boards } = playCase([[heavy, cash("a")], [light, bust("b")], [light, cash("c")], [light, cash("d")], [light, cash("e")]], { runId });
  assert.ok(log[1].environmentMode.includes("blackout"));
  assert.ok(!log[1].environmentMode.includes("cascade"), "not on the BLACKOUT board");
  assert.ok(log[2].environmentMode.includes("cascade"), "the board after it");
  assert.ok(boards[1].wallMin >= normalizeSchema(BASE_SCHEMA).wallMin - BLACKOUT_WALL_SHIFT, "the walls never stack");
  // Two heavy cards in a row whose links fall due on the same board.
  const twin = Array.from({ length: 400 }, (_, index) => `t${index}`).find((id) => linkDelay(id, "n0", "heavy") === linkDelay(id, "n1", "heavy") + 1);
  const pair = playCase([[heavy, cash("a")], [heavy, cash("b")], ...Array.from({ length: 6 }, (_, index) => [light, cash(`c${index}`)])], { runId: twin });
  const landed = pair.log.map((entry, index) => (entry.environmentMode.includes("cascade") ? index : -1)).filter((index) => index >= 0);
  assert.equal(landed.length, 2);
  assert.equal(landed[1] - landed[0], 1, "one a board");
});

test("REBOOT carries no CASCADE", () => {
  const { boards } = playCase([[light, cash("a")], [heavy, cash("b")], [light, cash("c")]]);
  assert.ok(boards.at(-1).mutations.includes("reboot"));
  assert.ok(!boards.at(-1).mutations.includes("cascade"));
  const schema = buildNextSchema({ outcome: "cash", gauge: 30, pushes: 2, caseClosed: true, cascade: true });
  assert.ok(!schema.mutations.includes("cascade"));
});

test("the most a cash can carry still fits the board's eight rules with CASCADE among them", () => {
  const schema = buildNextSchema({
    outcome: "cash", gauge: 64, pushes: 3, streak: 3, burnAxis: "trust", caseClosed: false, focusMode: "steady", focusCharge: 100, focusHits: 3,
    stanceMastery: { strike: 9, steady: 9, expose: 9 }, windowIndex: 40, cascade: true,
  });
  assert.ok(schema.mutations.length <= 8, schema.mutations.join("+"));
  assert.ok(normalizeSchema(schema).mutations.includes("cascade"));
});

test("SCOUT, LOCK, the heartbeat and the clock move no link (B7)", () => {
  const entry = (extra) => ({ nodeId: "n0", choiceId: "heavy", threshold: { state: "cash", gauge: 30, ...extra }, riskRewardEffect: heavy.effect, environmentMode: "stable" });
  const plain = walkLinks([entry({})], "r");
  for (const looked of [{ scouted: true }, { focus: { charge: 100 } }, { elapsed: 40 }, { gauge: 80, pushes: 9 }]) {
    assert.deepEqual(walkLinks([entry(looked)], "r"), plain);
  }
});

test("the voice's line is there on the board after a link is made, and when one is due next, else empty", () => {
  const entry = { nodeId: "n0", choiceId: "heavy", threshold: { state: "cash" }, riskRewardEffect: heavy.effect, environmentMode: "stable" };
  const plain = { ...entry, choiceId: "light", riskRewardEffect: light.effect };
  const runId = Array.from({ length: 50 }, (_, index) => `r${index}`).find((id) => linkDelay(id, "n0", "heavy") === LINK_SPAN_MAX);
  const said = (log) => readWalk(walkLinks(log, runId)).said;
  assert.match(said([entry]), /^연결 1\. 가장 이른 것은 1~3판 안/);
  assert.equal(said([entry, plain]), "");
  assert.match(said([entry, plain, plain, plain]), /다음 판/);
  assert.equal(said([]), "");
});

/* ---------------------------------------------- decision 6 (2): carried over */

const lights = (count, prefix = "l") => Array.from({ length: count }, (_, index) => [light, cash(`${prefix}${index}`)]);
/** A run id whose closing heavy card (scene n2) draws `delay`. */
const runWithDelay = (delay) => Array.from({ length: 200 }, (_, index) => `c${index}`).find((id) => linkDelay(id, "n2", "heavy") === delay);

test("a link the case closes on is carried to the next case with the boards it had left, never onto REBOOT", () => {
  for (let delay = LINK_SPAN_MIN; delay <= LINK_SPAN_MAX; delay += 1) {
    const runId = runWithDelay(delay);
    const first = playCase([...lights(2), [heavy, cash("close")]], { runId });
    // Made on board 2, due on board 2 + delay; the case closed at board 3.
    assert.deepEqual(first.run.linksOut, [{ from: -1, due: Math.max(1, delay - 1) }]);
    const second = playCase(lights(6, "m"), { runId, from: first.run });
    assert.deepEqual(second.opened.linksIn, first.run.linksOut, "the next case opens on them");
    assert.deepEqual(second.opened.linksOut, []);
    assert.equal(readLinks(second.opened, [], runId).live, 1, "and the table reads them from its first board");
    const landed = second.log.findIndex((entry) => entry.environmentMode.includes("cascade"));
    assert.equal(landed + 1, Math.max(1, delay - 1), "on the board it was owed, counted from REBOOT's");
    assert.ok(landed >= 0 && !second.opened.schema.mutations.includes("cascade"), "the REBOOT board itself carries none");
    const walked = walkLinks(second.log, runId, second.opened.linksIn);
    assert.deepEqual([walked.made, walked.landed, walked.landedIn], [0, 1, 1]);
  }
});

test("the range a carried link is told with goes on from the last case's", () => {
  const reading = readWalk(walkLinks([], "r", [{ from: -1, due: 3 }]));
  assert.deepEqual([reading.live, reading.nearest], [1, [1, 3]]);
  assert.deepEqual(readWalk(walkLinks([], "r", [{ from: -3, due: 1 }])).nearest, [1, 1], "due on the first board after REBOOT");
});

test("at most LINK_CARRY_MAX are carried, the newest; the older lapse", () => {
  assert.equal(LINK_CARRY_MAX, 3);
  const carried = [{ from: -5, due: 1 }, { from: -1, due: 3 }, { from: -4, due: 1 }, { from: -2, due: 2 }, { from: -3, due: 1 }];
  const { links, capped } = carryLinks({ carried });
  assert.deepEqual(links, [{ from: -3, due: 1 }, { from: -2, due: 2 }, { from: -1, due: 3 }]);
  assert.equal(capped, 2);
  assert.deepEqual(carryLinks({ carried: [] }), { links: [], capped: 0 });
});

test("the season's last case, a story case and a case left unfinished let them lapse", () => {
  const runId = runWithDelay(LINK_SPAN_MAX);
  const final = playCase([...lights(2), [heavy, cash("close")]], { runId, last: true });
  assert.deepEqual(final.run.linksOut, [], "nothing after the final");
  const first = playCase([...lights(2), [heavy, cash("close")]], { runId });
  assert.equal(first.run.linksOut.length, 1);
  const story = playCase(lights(6, "s"), { runId, from: { ...first.run, story: true } });
  assert.deepEqual(story.opened.linksIn, [], "a story case receives none");
  assert.ok(story.log.every((entry) => !entry.environmentMode.includes("cascade")));
  const after = openCaseRun({ ...story.run, story: false });
  assert.deepEqual(after.linksIn, [], "and the next ordinary case none either");
  // Opened on the link, left after one window, another case opened: it is gone (decision 4 (1)).
  const second = openCaseRun(first.run);
  const { nextRun } = resolveWindow({ run: second, window: cash("x"), card: light });
  assert.deepEqual(openCaseRun(nextRun).linksIn, [], "an abandoned case hands nothing on");
});

test("a case played again holds the links owed and hands them back", () => {
  const runId = runWithDelay(LINK_SPAN_MAX);
  const first = playCase([...lights(2), [heavy, cash("close")]], { runId });
  const owed = first.run.linksOut;
  const replay = playCase(lights(3, "r"), { runId, from: first.run, replayOf: {} });
  assert.deepEqual(replay.opened.linksIn, [], "the replay plays without them");
  assert.deepEqual(replay.opened.practice.linksOut, owed, "and holds them");
  assert.ok(replay.log.every((entry) => !entry.environmentMode.includes("cascade")));
  assert.deepEqual(replay.run.linksOut, owed, "its close hands them back");
  assert.deepEqual(openCaseRun(replay.run).linksIn, owed, "to the next real case");
  // Left half way, the same.
  const left = resolveWindow({ run: replay.opened, window: cash("x"), card: heavy }).nextRun;
  assert.deepEqual(openCaseRun(left).linksIn, owed);
});

test("the same log and the same links in give the same CASCADE, and SCOUT, LOCK, the heartbeat and the clock move none (B7)", () => {
  const linksIn = [{ from: -1, due: 2 }];
  const entry = (extra) => ({ nodeId: "n0", choiceId: "heavy", threshold: { state: "cash", gauge: 30, ...extra }, riskRewardEffect: heavy.effect, environmentMode: "stable" });
  const plain = walkLinks([entry({})], "r", linksIn);
  assert.deepEqual(walkLinks([entry({})], "r", linksIn), plain);
  assert.equal(isDueNext(plain), true, "the carried link is due on board 2");
  for (const looked of [{ scouted: true }, { focus: { charge: 100 } }, { elapsed: 40 }, { gauge: 80, pushes: 9 }]) {
    assert.deepEqual(walkLinks([entry(looked)], "r", linksIn), plain);
  }
});

test("a saved list of links keeps only what a table can hold", () => {
  assert.deepEqual(normalizeLinks(null), []);
  assert.deepEqual(normalizeLinks([{ from: -1, due: 2 }, { from: 1, due: 2 }, { from: -1, due: 0 }, { from: -1, due: LINK_SPAN_MAX + 1 }, { from: "x", due: 1 }, null, { from: -2.5, due: 1 }]), [{ from: -1, due: 2 }]);
  assert.equal(normalizeLinks(Array.from({ length: 5 }, (_, index) => ({ from: -index - 1, due: 1 }))).length, LINK_CARRY_MAX);
  assert.deepEqual(normalizeRunState({ linksIn: "junk", linksOut: [{ from: 0, due: 1 }] }).linksOut, [{ from: 0, due: 1 }]);
  assert.deepEqual(normalizeRunState({}).linksIn, []);
});

/* ------------------------------------------------------ the week's device */

test("the cascade week is a device, not a number, and says B's numbers", () => {
  assert.ok(WEEK_RULE_DEVICES.includes("cascade"));
  assert.equal(weekRuleHasDevice("cascade", "cascade"), true);
  assert.equal(weekRuleHasDevice("cascade", "audit"), false, "audit is allowed, but this rule does not name it");
  assert.equal(weekRuleHasDevice("near-wall", "cascade"), false);
  assert.equal(weekRuleHasDevice(null, "cascade"), false);
  assert.equal(weekRuleOverlay("cascade", BASE_SCHEMA), null, "a device moves no number on the board");
  const { text } = getWeekRule("cascade");
  for (const quoted of [`${LINK_BURN} 이상`, `${LINK_SPAN_MIN}~${LINK_SPAN_MAX}판`, `벽이 ${LINK_WALL} 가까워진다`]) assert.ok(text.includes(quoted), quoted);
});

test("a development build plays a cascade week on ?week=cascade; a release and node never do", () => {
  const now = Date.parse("2026-10-21T12:00:00+09:00");
  const forced = devWeekEntry({ debugBuild: true, search: "?debug=1&week=cascade", now });
  assert.deepEqual(forced, { week: "2026-W43", id: "cascade", added: "dev" });
  const calendar = [forced, ...WEEKLY_RULES];
  const stamp = pickSeasonWeekRule(now, { calendar });
  assert.equal(stamp, "cascade");
  assert.equal(isCascadeOn(normalizeRunState({ weekRule: stamp })), true, "the season it starts counts links");
  assert.equal(pickSeasonWeekRule(now, { calendar, declined: true }), null, "the start screen's box still turns it down");
  assert.equal(pickSeasonWeekRule(now, { calendar, story: true }), null, "and story mode never has it");
  assert.equal(pickSeasonWeekRule(now + 7 * 24 * 60 * 60 * 1000, { calendar }), null, "only this week");
  assert.equal(devWeekEntry({ debugBuild: false, search: "?week=cascade", now }), null, "a release build has no switch");
  assert.equal(devWeekEntry({ debugBuild: true, search: "?debug=1", now }), null);
  assert.equal(devWeekEntry({ debugBuild: true, search: "?week=%3Cscript%3E", now }), null);
  assert.equal(pickSeasonWeekRule(now, { calendar: [devWeekEntry({ debugBuild: true, search: "?week=no-such-rule", now }), ...WEEKLY_RULES] }), null, "an id the catalogue lacks is no rule");
  assert.equal(DEV_WEEK_RULE, null, "node has no build constant and no switch");
  assert.ok(WEEKLY_RULES.every((entry) => entry.added !== "dev"));
  assert.match(readFileSync("src/gauntlet/weeklyCalendar.js", "utf8"), /DEV_WEEK_RULE =\s+typeof __CP_DEBUG_BUILD__ !== "undefined" && __CP_DEBUG_BUILD__\s+\?/, "the switch is behind the constant the bundler folds to false in a release");
  assert.match(readFileSync("src/telemetry.js", "utf8"), /telemetryEnabled = Boolean\(SUPABASE_URL && SUPABASE_ANON_KEY\) && !DEV_WEEK_RULE;/, "a forced week sends nothing to the server");
  assert.match(readFileSync("scripts/check-bundle-size.mjs", "utf8"), /'added:"dev"'\]/, "check:bundle fails a release that carries it");
});
