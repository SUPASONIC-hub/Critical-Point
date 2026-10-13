import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { ENDING_GATES } from "../../src/gameConstants.js";
import { getEndingVariant, getSeasonStrain } from "../../src/gameLogic.js";
import { getSeasonStanding, readClosedCases, readCollapseGate, readCollapseTally, SEASON_STANDING_NEAR } from "../../src/seasonStanding.js";

/**
 * Where the season stands against SYSTEM COLLAPSE (src/seasonStanding.js),
 * held to the ending: every season here is ruled by `getEndingVariant` the way
 * the runtime rules it -- `getSeasonStrain` of the same case summaries, spread
 * beside the resources on the table -- and the standing has to say the same.
 */
const { collapseHarmPerCase: HARM_GATE, collapseBustRate: BUST_GATE, collapseOverreachHarm: OVERREACH_HARM_GATE } = ENDING_GATES;

const summary = (finalHumanCost, busts = 0, cashes = 0, extra = {}) => ({ finalHumanCost, pushRecord: { busts, cashes }, ...extra });

/** Ten closed cases whose harm sums to `harmTotal`, with `busts` of `windows` windows busted. */
function season(harmTotal, busts = 0, windows = 100) {
  const cases = CASE_SEQUENCE.slice(0, 10);
  return Object.fromEntries(cases.map((caseId, index) => [caseId, summary(index === 0 ? harmTotal : 0, index === 1 ? busts : 0, index === 1 ? windows - busts : 0)]));
}

const rule = ({ caseResults = {}, pending = null, resources = {} } = {}) =>
  getEndingVariant({ resources, discoveredClues: [], log: [], ...getSeasonStrain(caseResults, pending) });

function assertAgrees(input, message) {
  const ending = rule(input);
  const standing = getSeasonStanding(input);
  assert.equal(standing.level === "over", ending.id === "collapse", message);
  assert.equal(standing.cause, ending.cause?.id ?? null, message);
  if (ending.cause) {
    assert.equal(Math.round(standing.harm.perCase), ending.cause.harmPerCase, message);
    assert.equal(Math.round(standing.overreach.bustRate * 100) / 100, ending.cause.bustRate, message);
  }
  return { ending, standing };
}

test("the harm route is over exactly where the ending collapses on harm", () => {
  const under = assertAgrees({ caseResults: season(199) }, "19.9 a case");
  assert.equal(under.standing.harm.perCase, 19.9);
  assert.equal(under.standing.harm.level, "near");
  assert.equal(under.standing.level, "near");
  assert.notEqual(under.ending.id, "collapse");

  const at = assertAgrees({ caseResults: season(200) }, "20 a case");
  assert.equal(at.standing.harm.perCase, HARM_GATE);
  assert.equal(at.standing.harm.level, "over");
  assert.equal(at.standing.cause, "harm");
  assert.equal(at.ending.id, "collapse");

  const past = assertAgrees({ caseResults: season(201) }, "20.1 a case");
  assert.equal(past.standing.harm.perCase, 20.1);
  assert.equal(past.standing.level, "over");
});

test("the overreach route is over exactly where the ending collapses on busts people paid for", () => {
  const grid = [
    { harm: 99, busts: 19, collapse: false },
    { harm: 99, busts: 20, collapse: false },
    { harm: 100, busts: 19, collapse: false },
    { harm: 100, busts: 20, collapse: true },
  ];
  for (const { harm, busts, collapse } of grid) {
    const { ending, standing } = assertAgrees({ caseResults: season(harm, busts) }, `harm ${harm / 10}, bust rate ${busts / 100}`);
    assert.equal(ending.id === "collapse", collapse);
    assert.equal(standing.overreach.level === "over", collapse);
    assert.equal(standing.cause, collapse ? "overreach" : null);
    assert.equal(standing.overreach.bustRate, busts / 100);
    assert.equal(standing.overreach.bustLevel, busts >= 20 ? "over" : "near");
    assert.equal(standing.overreach.harmLevel, harm >= 100 ? "over" : "near");
    assert.equal(standing.harm.level, "clear", "half the harm gate is nowhere near it");
  }
  // Harm names the collapse when both doors are open, as the ending's cause does.
  assert.equal(assertAgrees({ caseResults: season(200, 20) }).standing.cause, "harm");
});

test("near is one constant's share of each gate, and overreach needs both of its halves near", () => {
  const near = HARM_GATE * SEASON_STANDING_NEAR * 10;
  assert.equal(getSeasonStanding({ caseResults: season(near) }).harm.level, "near");
  assert.equal(getSeasonStanding({ caseResults: season(near - 1) }).harm.level, "clear");

  // 16 busts in 100 windows is at 0.8 of 0.2, whatever floating point makes of 0.8 * 0.2.
  const nearBusts = Math.round(BUST_GATE * SEASON_STANDING_NEAR * 100);
  const nearHarm = OVERREACH_HARM_GATE * SEASON_STANDING_NEAR * 10;
  const both = getSeasonStanding({ caseResults: season(nearHarm, nearBusts) });
  assert.deepEqual([both.overreach.bustLevel, both.overreach.harmLevel, both.overreach.level, both.level], ["near", "near", "near", "near"]);
  assert.equal(getSeasonStanding({ caseResults: season(nearHarm, nearBusts - 1) }).overreach.level, "clear");
  assert.equal(getSeasonStanding({ caseResults: season(nearHarm - 1, nearBusts) }).overreach.level, "clear");

  // A table that busts half its windows and hurts nobody is not on the way to collapse.
  const reckless = getSeasonStanding({ caseResults: season(0, 50) });
  assert.deepEqual([reckless.overreach.bustLevel, reckless.overreach.harmLevel, reckless.overreach.level, reckless.level], ["over", "clear", "clear", "clear"]);
  assert.equal(reckless.nearShare, SEASON_STANDING_NEAR);
});

test("overreach is near only when harm and bust rate are both at the near share of their own gates", () => {
  // Each half as a share of its own gate: 10 harm a case, a fifth of the windows.
  // Harm stays under 1.6 of its overreach gate, which is where the harm route's
  // own near begins (0.8 of 20), so the season's level here is overreach's.
  const grid = [
    { harm: 0.8, busts: 0.8, level: "near", why: "both exactly at the share" },
    { harm: 0.99, busts: 0.95, level: "near", why: "both between the share and the gate" },
    { harm: 1.2, busts: 0.85, level: "near", why: "harm over, bust rate between the share and its gate" },
    { harm: 1, busts: 0.95, level: "near", why: "harm at its gate, one bust short" },
    { harm: 0.9, busts: 1.25, level: "near", why: "bust rate over, harm between the share and its gate" },
    { harm: 0.99, busts: 1, level: "near", why: "bust rate at its gate, harm just short" },
    { harm: 1.2, busts: 0.75, level: "clear", why: "harm over, bust rate under the share" },
    { harm: 1.5, busts: 0, level: "clear", why: "harm over, no bust at all" },
    { harm: 0.79, busts: 1.25, level: "clear", why: "bust rate over, harm under the share" },
    { harm: 0.79, busts: 0.8, level: "clear", why: "bust rate near, harm under the share" },
    { harm: 0.8, busts: 0.75, level: "clear", why: "harm near, bust rate under the share" },
    { harm: 0.5, busts: 0.5, level: "clear", why: "neither near" },
    { harm: 1, busts: 1, level: "over", why: "both at their gates" },
    { harm: 1.2, busts: 1.25, level: "over", why: "both over" },
  ];
  const halfLevel = (share) => (share >= 1 ? "over" : share >= SEASON_STANDING_NEAR ? "near" : "clear");
  for (const { harm, busts, level, why } of grid) {
    const input = { caseResults: season(Math.round(harm * OVERREACH_HARM_GATE * 10), Math.round(busts * BUST_GATE * 100)) };
    const { standing } = assertAgrees(input, why);
    assert.equal(standing.overreach.harmLevel, halfLevel(harm), why);
    assert.equal(standing.overreach.bustLevel, halfLevel(busts), why);
    assert.equal(standing.overreach.level, level, why);
    assert.equal(standing.harm.level, "clear", why);
    assert.equal(standing.level, level, `${why}: the season's level is the overreach route's`);
    assert.equal(standing.cause, level === "over" ? "overreach" : null, why);
  }
});

test("a season with no case closed is read over the whole season, as the ending reads it", () => {
  for (const input of [undefined, {}, { caseResults: null }, { caseResults: {}, pending: null, resources: {} }]) {
    const standing = getSeasonStanding(input);
    assert.equal(standing.casesClosed, 0);
    assert.equal(standing.casesCounted, CASE_SEQUENCE.length);
    assert.deepEqual([standing.level, standing.cause, standing.harm.perCase, standing.harm.total, standing.overreach.bustRate, standing.overreach.windows], ["clear", null, 0, 0, 0, 0]);
    assert.deepEqual(standing.harmCases, []);
  }
  // The harm on the table counts before any case has closed, over every case of the season.
  const live = assertAgrees({ resources: { humanCost: 55 } }, "the first case, still open");
  assert.equal(live.standing.harm.perCase, 55 / CASE_SEQUENCE.length);
  assert.equal(live.standing.harm.total, 55);
  assert.deepEqual(live.standing.harmCases, [], "an open case is not a closed one");
  assert.deepEqual([live.standing.harm.closed, live.standing.harm.source], [0, "table"]);
});

test("the harm total says whether it is the closed cases' or the open table's, and the list accounts for the closed", () => {
  const [a, b] = CASE_SEQUENCE;
  const listed = (standing) => standing.harmCases.reduce((sum, entry) => sum + entry.harm, 0);

  // Over, with no case closed: the list is empty and the standing says why.
  const open = assertAgrees({ resources: { humanCost: HARM_GATE * CASE_SEQUENCE.length } }, "collapsed on the first table");
  assert.deepEqual([open.standing.level, open.standing.cause, open.standing.harmCases.length], ["over", "harm", 0]);
  assert.deepEqual([open.standing.harm.total, open.standing.harm.closed, open.standing.harm.source], [HARM_GATE * CASE_SEQUENCE.length, 0, "table"]);

  // Over on the open table with two mild cases closed: the list is those two, and does not add up to the total.
  const caseResults = { [a]: summary(4), [b]: summary(6) };
  const worse = assertAgrees({ caseResults, resources: { humanCost: 40 } }).standing;
  assert.deepEqual([worse.level, worse.harm.total, worse.harm.closed, worse.harm.source], ["over", 40, 10, "table"]);
  assert.equal(listed(worse), worse.harm.closed);

  // The table at or under what has closed: the total is the closed cases', and the list adds up to it.
  for (const humanCost of [undefined, 0, 9, 10]) {
    const settled = getSeasonStanding({ caseResults, resources: { humanCost } });
    assert.deepEqual([settled.harm.total, settled.harm.closed, settled.harm.source], [10, 10, "closed"], `table at ${humanCost}`);
    assert.equal(listed(settled), settled.harm.total);
  }
  // Nothing anywhere is the closed cases' nothing.
  assert.deepEqual([getSeasonStanding().harm.closed, getSeasonStanding().harm.source], [0, "closed"]);
});

test("a case closing without an id is counted as the ending counts it, and listed under null rather than undefined", () => {
  const [a] = CASE_SEQUENCE;
  const { standing } = assertAgrees({ caseResults: { [a]: summary(5, 1, 9) }, pending: summary(30, 2, 8) }, "a pending summary with no caseId");
  assert.deepEqual([standing.casesClosed, standing.harm.closed, standing.overreach.busts, standing.overreach.windows], [2, 35, 3, 20]);
  assert.deepEqual(standing.harmCases, [{ caseId: null, harm: 30 }, { caseId: a, harm: 5 }]);
  assert.deepEqual(JSON.parse(JSON.stringify(standing.harmCases)), standing.harmCases, "every entry keeps its caseId when the standing is saved");
  // At equal harm the named case comes first.
  assert.deepEqual(getSeasonStanding({ caseResults: { [a]: summary(5) }, pending: summary(5) }).harmCases, [{ caseId: a, harm: 5 }, { caseId: null, harm: 5 }]);
  // One that closed on no harm is no more listed than any other.
  assert.deepEqual(getSeasonStanding({ caseResults: { [a]: summary(5) }, pending: summary(0, 1, 1) }).harmCases, [{ caseId: a, harm: 5 }]);
});

test("the harm on the table stands in only when it is more than the season has closed on", () => {
  const caseResults = { [CASE_SEQUENCE[0]]: summary(4), [CASE_SEQUENCE[1]]: summary(6) };
  assert.equal(assertAgrees({ caseResults, resources: { humanCost: 6 } }).standing.harm.perCase, 5);
  const worse = assertAgrees({ caseResults, resources: { humanCost: 40 } }, "a third case, open and going badly");
  assert.equal(worse.standing.harm.perCase, 20);
  assert.equal(worse.standing.level, "over");
  assert.equal(worse.standing.casesClosed, 2);
});

test("a replayed case counts once, as the play that is closing now", () => {
  const [first, second] = CASE_SEQUENCE;
  const caseResults = { [first]: summary(60, 4, 6), [second]: summary(2, 0, 10) };
  const before = assertAgrees({ caseResults });
  assert.equal(before.standing.level, "over");
  assert.deepEqual(before.standing.harmCases, [{ caseId: first, harm: 60 }, { caseId: second, harm: 2 }]);

  const pending = { caseId: first, ...summary(4, 0, 10) };
  const replayed = assertAgrees({ caseResults, pending }, "the replay replaces the first play's summary");
  assert.equal(replayed.standing.casesClosed, 2);
  assert.equal(replayed.standing.harm.total, 6);
  assert.deepEqual([replayed.standing.overreach.busts, replayed.standing.overreach.windows], [0, 20]);
  assert.equal(replayed.standing.level, "clear");
  assert.deepEqual(replayed.standing.harmCases, [{ caseId: first, harm: 4 }, { caseId: second, harm: 2 }]);

  // Once the runtime has written the replay into the results, the same reading with nothing pending.
  assert.deepEqual(getSeasonStanding({ caseResults: { ...caseResults, [first]: pending } }), replayed.standing);
  // A case closing for the first time is one more case.
  const third = assertAgrees({ caseResults, pending: { caseId: CASE_SEQUENCE[2], ...summary(1) } });
  assert.equal(third.standing.casesClosed, 3);
  assert.equal(third.standing.harm.perCase, 21);
});

test("a story-mode case is read as any other: the ending does not excuse it", () => {
  const table = season(200, 20);
  const story = Object.fromEntries(Object.entries(table).map(([caseId, closed]) => [caseId, { ...closed, assistStory: true }]));
  assert.deepEqual(assertAgrees({ caseResults: story }).standing, getSeasonStanding({ caseResults: table }));
  assert.equal(rule({ caseResults: story }).id, "collapse");
});

test("the cases that cost the most are listed most first, ties in season order, three at most", () => {
  const [a, b, c, d, e] = CASE_SEQUENCE;
  // Written out of season order, as a replayed season's results are.
  const caseResults = { [e]: summary(9), [d]: summary(30), [b]: summary(30), [c]: summary(0), [a]: summary(9), stray: summary(30) };
  assert.deepEqual(getSeasonStanding({ caseResults }).harmCases, [{ caseId: b, harm: 30 }, { caseId: d, harm: 30 }, { caseId: "stray", harm: 30 }]);
  delete caseResults.stray;
  assert.deepEqual(getSeasonStanding({ caseResults }).harmCases, [{ caseId: b, harm: 30 }, { caseId: d, harm: 30 }, { caseId: a, harm: 9 }]);
  // A case that closed on no harm is not one that contributed any.
  assert.deepEqual(getSeasonStanding({ caseResults: { [a]: summary(0), [b]: summary(3), [c]: {} } }).harmCases, [{ caseId: b, harm: 3 }]);
});

test("summaries from before a field existed, and holes, add nothing", () => {
  const caseResults = { [CASE_SEQUENCE[0]]: { finalHumanCost: 12 }, [CASE_SEQUENCE[1]]: null, [CASE_SEQUENCE[2]]: { pushRecord: { busts: 2 } }, [CASE_SEQUENCE[3]]: { finalHumanCost: "8", pushRecord: { cashes: 3 } } };
  assert.equal(readClosedCases(caseResults).length, 3);
  assert.equal(readClosedCases().length, 0);
  assert.deepEqual(readCollapseTally(), { casesPlayed: 0, seasonWindows: 0, seasonHumanCost: 0, seasonBusts: 0 });
  const { standing } = assertAgrees({ caseResults });
  assert.deepEqual([standing.casesClosed, standing.harm.total, standing.overreach.busts, standing.overreach.windows], [3, 20, 2, 5]);
  assert.deepEqual(readCollapseGate(), { cases: CASE_SEQUENCE.length, harmTotal: 0, harm: 0, bustRate: 0, over: { harm: false, overreachHarm: false, bustRate: false }, cause: null });
});

test("on seasons of every shape the standing and the ending never disagree", () => {
  let seed = 20261012;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const upTo = (limit) => Math.floor(random() * (limit + 1));
  const seen = { harm: 0, overreach: 0, standing: 0 };
  for (let round = 0; round < 4000; round += 1) {
    const cases = CASE_SEQUENCE.slice(0, upTo(CASE_SEQUENCE.length));
    const heavy = random() < 0.5;
    const caseResults = Object.fromEntries(cases.map((caseId) => [caseId, summary(upTo(heavy ? 40 : 22), upTo(heavy ? 4 : 2), upTo(9))]));
    const pending = random() < 0.3 ? { caseId: random() < 0.1 ? undefined : CASE_SEQUENCE[upTo(CASE_SEQUENCE.length - 1)], ...summary(upTo(100), upTo(5), upTo(9)) } : null;
    const resources = random() < 0.5 ? {} : { humanCost: upTo(100) };
    const { standing } = assertAgrees({ caseResults, pending, resources }, `round ${round}`);
    seen[standing.cause ?? "standing"] += 1;
    assert.ok(standing.harmCases.length <= 3);
    // The object agrees with itself: the total is the larger source and names it,
    // and the list is closed cases only, each under a name or null.
    const table = Number(resources.humanCost) || 0;
    const listed = standing.harmCases.reduce((sum, entry) => sum + entry.harm, 0);
    assert.equal(standing.harm.total, Math.max(standing.harm.closed, table), `round ${round}`);
    assert.equal(standing.harm.source, table > standing.harm.closed ? "table" : "closed", `round ${round}`);
    assert.ok(standing.harmCases.length < 3 ? listed === standing.harm.closed : listed <= standing.harm.closed, `round ${round}: the list accounts for the closed cases' harm`);
    assert.ok(standing.harmCases.every((entry) => entry.harm > 0 && (entry.caseId === null || typeof entry.caseId === "string")), `round ${round}`);
    if (standing.level === "over" && listed === 0) assert.equal(standing.harm.source, "table", `round ${round}: over with nothing listed is the open table's doing`);
    seen[standing.harm.source] = (seen[standing.harm.source] ?? 0) + 1;
  }
  assert.ok(seen.table > 100 && seen.closed > 100, `the sweep read the total from both sources (${JSON.stringify(seen)})`);
  assert.ok(seen.harm > 100 && seen.overreach > 100 && seen.standing > 100, `the sweep reached all three rulings (${JSON.stringify(seen)})`);
});
