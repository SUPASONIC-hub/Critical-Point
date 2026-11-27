import assert from "node:assert/strict";
import test from "node:test";
import { BASE_SCHEMA, buildNextSchema, createWindow, getCardChips, MUTATIONS, normalizeRunState, resolveWindow, RULES_MARK } from "../../src/gauntlet/gauntletEngine.js";
import { BEFORE_NINE_RULE, COIN_GAIN_KEYS, COIN_GAIN_WEIGHT, EDGE_CASH_BONUS, EDGE_CASH_REACH, isMarkNineOn, NINE_RULE, readEdgeCash, RULES_NINE_MARK, wantsMarkNine, withEdgeBonus, withMarkEight, withMarkNine, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { AUDIT_SHARE, countAudit, describeAuditLedger, getAuditLevel, getAuditLimit, getSmoothness, readAudit, settleAudit, SMOOTH_LIMIT, SMOOTH_SPAN, smoothStep } from "../../src/gauntlet/auditRisk.js";
import { CASCADE_MUTATION, getLinkShift, LINK_TOP_WALL, LINK_WALL } from "../../src/gauntlet/cascadeRisk.js";
import { getTwistShuffle, TWIST_SHUFFLE_GROUPS } from "../../src/gauntlet/actTwists.js";
import { caseRuleFor, isTwistMoved } from "../../src/gauntlet/caseRules.js";
import { RELIC_BOOST_CAP } from "../../src/gauntlet/relicsNext.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";

const NINE = withMarkNine(ALL_RULES, true);
const EIGHT = withMarkNine(ALL_RULES, false);

test("RULES_MARK 9: the engine's mark, on by default, and a row of 5 to 8 played without it", () => {
  assert.ok(RULES_MARK >= 9, "RULES_MARK 12 keeps 9's rules");
  assert.equal(RULES_NINE_MARK, 9);
  assert.equal(wantsMarkNine({}), true);
  assert.equal(wantsMarkNine({ process: { env: { RULES_MARK9: "0" } } }), false);
  assert.equal(isMarkNineOn(ALL_RULES), true);
  assert.equal(isMarkNineOn(NINE), true);
  assert.equal(isMarkNineOn(EIGHT), false);
  assert.equal(EIGHT.has(BEFORE_NINE_RULE), true);
  assert.equal(isMarkNineOn(withMarkEight(ALL_RULES, false)), false, "a set without 8's rules has none of 9's");
  assert.equal(isMarkNineOn(withNextRules(ALL_RULES, false)), false);
  assert.equal(withMarkNine(withMarkEight(ALL_RULES, false), true).has(NINE_RULE), false, "9 does not ride on a set without 8");
  for (const mark of [5, 6, 7, 8]) assert.equal(isMarkNineOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkNineOn(getRowRules("case20", {}, 9)), true);
  assert.equal(withMarkNine(NINE, true), NINE, "the same set back when it already plays them");
});

/* ------------------------------------------------------------- G29 */

test("G29: a card's 자본 and 시간 gains weigh COIN_GAIN_WEIGHT in its chips, every other gain ×2; 8's table ×2 for all", () => {
  const coin = { id: "coin", effect: { capital: 10, time: 4, humanCost: 6 } };
  const people = { id: "people", effect: { trust: 10, humanCost: -4, capital: -6 } };
  assert.equal(COIN_GAIN_WEIGHT, 2.75);
  assert.deepEqual(COIN_GAIN_KEYS, ["capital", "time"]);
  assert.equal(getCardChips(coin, BASE_SCHEMA, NINE), Math.round(10 + 14 * COIN_GAIN_WEIGHT));
  assert.equal(getCardChips(coin, BASE_SCHEMA, EIGHT), 10 + 14 * 2);
  assert.equal(getCardChips(people, BASE_SCHEMA, NINE), 10 + 14 * 2, "사람 쪽 gains keep ×2");
  assert.equal(getCardChips(people, BASE_SCHEMA, EIGHT), getCardChips(people, BASE_SCHEMA, NINE));
  // The settlement pays the weight the case's rules carry.
  const win = { ...createWindow({ seed: "g29" }), status: "cashed", gauge: 30, wall: 80, pushes: 2 };
  const pot = (rules) => resolveWindow({ run: normalizeRunState({}), window: win, card: coin, rules }).verdict.pot;
  assert.ok(pot(NINE) > pot(EIGHT), `the money card pays more under 9: ${pot(NINE)} against ${pot(EIGHT)}`);
});

/* ------------------------------------------------------------- G30 */

test("G30: a cash EDGE_CASH_REACH or less under the real wall pays EDGE_CASH_BONUS more, on top of what the tools paid", () => {
  assert.equal(EDGE_CASH_REACH, 3);
  assert.equal(EDGE_CASH_BONUS, 1.25);
  assert.equal(readEdgeCash({ status: "cashed", wall: 60, gauge: 57 }), 3);
  assert.equal(readEdgeCash({ status: "cashed", wall: 60, gauge: 58.6 }), 1);
  assert.equal(readEdgeCash({ status: "cashed", wall: 60, gauge: 56.9 }), null);
  assert.equal(readEdgeCash({ status: "bust", wall: 60, gauge: 60 }), null);
  assert.equal(withEdgeBonus({ fired: [], factor: 1 }, true), EDGE_CASH_BONUS);
  assert.equal(withEdgeBonus({ fired: [], factor: 1 }, false), 1);
  assert.equal(withEdgeBonus({ fired: ["frontPage"], factor: 1.2 }, true), 1.2 * EDGE_CASH_BONUS, "on top of the tools");
  assert.equal(withEdgeBonus({ fired: ["heatSink", "frontPage"], factor: RELIC_BOOST_CAP, capped: true }, true), RELIC_BOOST_CAP * EDGE_CASH_BONUS, "the cap is the tools' own");
  const card = { id: "c", effect: { trust: 10 } };
  const settle = (gauge, rules) => resolveWindow({ run: normalizeRunState({}), window: { ...createWindow({ seed: "g30" }), status: "cashed", gauge, wall: 62, pushes: 4 }, card, rules }).verdict;
  const near = settle(59, NINE);
  assert.equal(near.edge, true);
  assert.equal(near.pot, Math.round(settle(59, EIGHT).pot * EDGE_CASH_BONUS));
  assert.equal(settle(59, EIGHT).edge, undefined, "8's table pays no edge");
  assert.equal(settle(58, NINE).edge, undefined, "4 under the wall is not the edge");
});

/* ------------------------------------------------------------- G32 */

test("G32: CASCADE pulls only the band's far end, LINK_TOP_WALL; 8's table the whole band LINK_WALL", () => {
  const board = (rules, cascade) => buildNextSchema({ outcome: "cash", cause: "cash", gauge: 40, pushes: 2, streak: 0, rules, cascade });
  const plain = board(NINE, false);
  const top = board(NINE, true);
  assert.equal(top.wallMin, plain.wallMin, "the near end stays");
  assert.equal(top.wallMax, plain.wallMax - LINK_TOP_WALL);
  assert.ok(top.mutations.includes("cascade"));
  const old = board(EIGHT, true);
  assert.deepEqual([old.wallMin, old.wallMax], [plain.wallMin - LINK_WALL, plain.wallMax - LINK_WALL]);
  assert.deepEqual(getLinkShift(true), [0, LINK_TOP_WALL]);
  assert.deepEqual(getLinkShift(false), [LINK_WALL, LINK_WALL]);
  assert.match(MUTATIONS.cascade.text, new RegExp(`먼 끝이 ${LINK_TOP_WALL} 가까워진다`), "this page plays 9, so its line is the far end's");
  assert.match(CASCADE_MUTATION.text, new RegExp(`벽이 ${LINK_WALL} 가까워진다`));
});

/* ------------------------------------------------------------- G35 */

test("G35: the audit counts a case's pushed cashes within ±SMOOTH_SPAN of one another, SMOOTH_LIMIT of them catch", () => {
  assert.deepEqual([SMOOTH_SPAN, SMOOTH_LIMIT], [1, 5]);
  assert.equal(getSmoothness([]), 0);
  assert.equal(getSmoothness([40, 42, 41, 42, 40]), 5);
  assert.equal(getSmoothness([40, 43, 46, 49]), 1);
  assert.equal(getSmoothness([40, 42, 43]), 2);
  assert.equal(getAuditLevel([40, 41]), 2);
  assert.equal(getAuditLevel(3), 3, "8's count reads as it was");
  // The tally takes pushed, unbusted cashes off CASCADE.
  assert.deepEqual(smoothStep([40], { gauge: 41.4, pushes: 2 }), [40, 41]);
  assert.deepEqual(smoothStep([40], { gauge: 41, pushes: 0 }), [40]);
  assert.deepEqual(smoothStep([40], { gauge: 41, pushes: 2, busted: true }), [40]);
  assert.deepEqual(smoothStep([40], { gauge: 41, pushes: 2, cascade: true }), [40]);
  assert.deepEqual(smoothStep([40], { gauge: 41, pushes: 2, shield: true }), [40, 41], "a charged EXPOSE cash is counted: G3 shielded the cold line only");
  const log = [40, 42, 41, 70, 43].map((gauge) => ({ threshold: { gauge, pushes: 2 } }));
  assert.deepEqual(countAudit(log, true), [40, 42, 41, 70, 43]);
  assert.equal(countAudit(log, false), 0, "8's audit: no cash under 40, one at 60 or more takes off");
  // The close judges the smoothness; AUDIT CONTACT moves the limit one further.
  const run = normalizeRunState({ windowIndex: 3 });
  const close = (tally, relics = []) => settleAudit({ run: { ...run, relics }, rules: ALL_RULES, count: tally, busted: false, gauge: 42, pushes: 3, closed: true, secured: 4000, hand: 800, smooth: true });
  assert.deepEqual(close([41, 42, 43, 41]), { count: [41, 42, 43, 41, 42], level: 5, caught: true, lost: 4000 / AUDIT_SHARE, handLost: 800 / AUDIT_SHARE });
  assert.equal(close([41, 42, 43]).caught, false);
  assert.deepEqual(close([41, 42, 43, 41], ["auditContact"]), { count: [41, 42, 43, 41, 42], level: 5, caught: false, spared: true, lost: 0, handLost: 0 });
  assert.equal(getAuditLimit(["auditContact"], true), SMOOTH_LIMIT + 1);
  // The engine judges the smoothness under 9 and the count under 8.
  const card = { id: "c", effect: { trust: 4 } };
  const closing = (rules, audit) => resolveWindow({ run, window: { ...createWindow({ seed: "g35" }), status: "cashed", gauge: 42, wall: 80, pushes: 2 }, card, rules, audit, caseClosed: true }).verdict.audit;
  assert.equal(closing(NINE, [41, 42, 43, 41]).caught, true);
  assert.equal(closing(NINE, [41, 42, 43, 41]).level, 5);
  assert.equal(closing(EIGHT, 3).caught, false, "8's count: a cash at 42 adds nothing to 3 of 4");
});

test("G35: the table reads the smoothness, what a cash now makes it, and the band where it would rise", () => {
  const run = normalizeRunState({});
  const reading = readAudit(run, [41, 42, 43, 41], { gauge: 42, pushes: 2 });
  assert.equal(reading.count, 4);
  assert.equal(reading.limit, SMOOTH_LIMIT);
  assert.equal(reading.afterCash, 5);
  assert.equal(reading.ifCash, 1);
  assert.equal(reading.atRisk, true);
  assert.deepEqual(reading.band, [41, 44], "a cash at 41 to 43 joins the four");
  assert.match(reading.spoken, /같은 자리 확정 5\/5/);
  assert.equal(reading.warn, "같은 자리면 감사");
  assert.equal(readAudit(run, [41, 42, 43, 41], { gauge: 50, pushes: 2 }).ifCash, 0);
  assert.equal(readAudit(run, [], { gauge: 50, pushes: 2 }).band, null, "nothing to join yet");
  // The table record: a case closed at 9 says its smoothness, one closed at 8 its count.
  const log = [41, 42, 43, 41, 42].map((gauge) => ({ threshold: { gauge, pushes: 2 } }));
  assert.equal(describeAuditLedger(log, { tableRules: 9 }, "case10"), `감사 5/${SMOOTH_LIMIT}칸으로 닫혔다. 적발.`);
  assert.equal(describeAuditLedger(log, { tableRules: 8 }, "case10"), "감사 0/4칸으로 닫혔다.");
});

/* ------------------------------------------------------------- G36 */

test("G36: a NEW GAME+ season's act twists trade places inside their groups, by its seed; 8막 stays", () => {
  for (const seed of ["run-1", "run-2", "a", "b", "ng:veteran:7"]) {
    const shuffle = getTwistShuffle(seed);
    assert.ok(Object.keys(shuffle).length >= 2, `${seed}: at least one group moves`);
    assert.deepEqual(getTwistShuffle(seed), shuffle, "the same seed, the same places");
    for (const [slot, twist] of Object.entries(shuffle)) assert.ok(TWIST_SHUFFLE_GROUPS.some((group) => group.includes(slot) && group.includes(twist)), `${slot} -> ${twist} stays in its group`);
    assert.ok(!Object.hasOwn(shuffle, "signedByName"));
  }
  const seeds = Array.from({ length: 60 }, (_, index) => `run-${index}`);
  assert.ok(new Set(seeds.map((seed) => JSON.stringify(getTwistShuffle(seed)))).size >= 6, "seasons differ");
  const veteran = { veteran: true, twistSeed: "run-1" };
  const moved = Object.keys(getTwistShuffle("run-1"));
  const cases = { merger: "case15", scattered: "case27", hearing: "case40", passedDown: "case05", lateBill: "case10", trainedWall: "case22", onRecord: "case33" };
  for (const [slot, caseId] of Object.entries(cases)) {
    assert.equal(caseRuleFor(caseId, veteran), getTwistShuffle("run-1")[slot] ?? slot, caseId);
    assert.equal(caseRuleFor(caseId, { twistSeed: "run-1" }), slot, "a first season keeps the places");
    assert.equal(caseRuleFor(caseId, veteran, true, true, false), slot, "8's table keeps the places");
    assert.equal(isTwistMoved(caseId, veteran), moved.includes(slot));
  }
  assert.equal(caseRuleFor("case48", veteran), "signedByName");
  assert.equal(caseRuleFor("case09", veteran), "short-clock", "a case's own rule stays");
  assert.equal(caseRuleFor("case15", { ...veteran, weekRule: "near-wall" }), null, "a week's season has none");
  // The run keeps the seed only when it is NEW GAME+'s.
  assert.equal(normalizeRunState({ veteran: true, twistSeed: "run-9" }).twistSeed, "run-9");
  assert.equal(normalizeRunState({ twistSeed: "run-9" }).twistSeed, undefined);
});
