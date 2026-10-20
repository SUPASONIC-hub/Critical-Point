import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  CASCADE_ON,
  describeRange,
  getEffectBurn,
  isCascadeOn,
  isDueNext,
  isLinkDue,
  LINK_BURN,
  LINK_SPAN_MAX,
  LINK_SPAN_MIN,
  LINK_WALL,
  linkDelay,
  readLinks,
  readWalk,
  walkLinks,
} from "../../src/gauntlet/cascadeRisk.js";
import { BASE_SCHEMA, buildNextSchema, describeMutations, FRACTURE_MIN_BURN, isPenaltyMutation, MUTATIONS, normalizeRunState, normalizeSchema, openCaseRun, resolveWindow, seededUnit } from "../../src/gauntlet/gauntletEngine.js";
import { BLACKOUT_WALL_SHIFT } from "../../src/gauntlet/tableRules.js";

const heavy = { id: "heavy", label: "heavy", effect: { capital: 9, legitimacy: -12 }, next: "x" };
const light = { id: "light", label: "light", effect: { capital: 12, trust: -4 }, next: "x" };
const cash = (seed) => ({ status: "cashed", cause: "cash", gauge: 30, wall: 95, pushes: 2, seed });
const bust = (seed) => ({ status: "bust", cause: "push", gauge: 70, wall: 69, pushes: 4, seed });

/**
 * Plays a case through the engine as the runtime does (useChoiceCommit):
 * the link due off the log, the log gaining each window's entry. `on` stands
 * for the switch, which the game ships off.
 */
function playCase(windows, { runId = "run-1", on = true } = {}) {
  let run = openCaseRun(normalizeRunState({}));
  const log = [];
  const boards = [];
  windows.forEach(([card, window], index) => {
    const caseClosed = index === windows.length - 1;
    const cascade = on && isDueNext(walkLinks(log, runId));
    const { verdict, nextRun } = resolveWindow({ run, window, card, caseClosed, cascade });
    log.push({
      nodeId: `n${index}`,
      choiceId: card.id,
      threshold: { state: verdict.outcome, busted: verdict.outcome === "bust" },
      riskRewardEffect: verdict.outcome === "cash" ? card.effect : {},
      environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable",
    });
    boards.push(nextRun.schema);
    run = nextRun;
  });
  return { run, log, boards };
}

test("the switch ships off: no table counts links, and the engine deals none unasked", () => {
  assert.equal(CASCADE_ON, false);
  assert.equal(isCascadeOn(normalizeRunState({})), false);
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
  assert.deepEqual([walked.made, walked.landed, walked.lapsed, walked.pending.length], [1, 1, 0, 0]);
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

test("links the case closes on lapse, and REBOOT carries no CASCADE", () => {
  const { log, boards } = playCase([[light, cash("a")], [heavy, cash("b")], [light, cash("c")]]);
  assert.ok(boards.at(-1).mutations.includes("reboot"));
  assert.ok(!boards.at(-1).mutations.includes("cascade"));
  assert.deepEqual(walkLinks(log, "run-1").lapsed, 1);
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
