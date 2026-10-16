import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE, seasonCasesBase } from "../../src/gameCases.js";
import { ENDING_GATES } from "../../src/gameConstants.js";
import { getSeasonStanding } from "../../src/seasonStanding.js";
import { createSeasonStandingReadout } from "../../src/viewModels/reportViewModels.js";

/**
 * The line each case's report prints about SYSTEM COLLAPSE, and the cases a
 * collapse offers to play again (createSeasonStandingReadout). The numbers and
 * the level are `getSeasonStanding`'s, which tests/unit/season-standing.test.mjs
 * holds to the ending; what is held here is what the line prints for them.
 */
const { collapseHarmPerCase: HARM_GATE, collapseOverreachHarm: OVERREACH_HARM_GATE } = ENDING_GATES;

const summary = (finalHumanCost, busts = 0, cashes = 0) => ({ finalHumanCost, pushRecord: { busts, cashes } });

/** Ten closed cases whose harm sums to `harmTotal`, with `busts` of `windows` windows busted. */
function season(harmTotal, busts = 0, windows = 100) {
  const cases = CASE_SEQUENCE.slice(0, 10);
  return Object.fromEntries(cases.map((caseId, index) => [caseId, summary(index === 0 ? harmTotal : 0, index === 1 ? busts : 0, index === 1 ? windows - busts : 0)]));
}
const readout = (caseResults, extra = {}) => createSeasonStandingReadout({ caseResults, cases: seasonCasesBase, ...extra });
const shown = (caseResults) => {
  const { level, route, mark, label, text } = readout(caseResults);
  return { level, route, mark, label, text };
};

test("the line prints the season's mean harm against the gate, with a shape and a word for the level", () => {
  assert.deepEqual(shown(season(140, 12)), { level: "clear", route: "harm", mark: "○", label: "붕괴선 아래", text: `시즌 평균 사람 피해 14 / ${HARM_GATE} · 터진 판 12%` });
  assert.deepEqual(shown(season(160)), { level: "near", route: "harm", mark: "▲", label: "붕괴선 가까움", text: `시즌 평균 사람 피해 16 / ${HARM_GATE} · 터진 판 0%` });
  assert.deepEqual(shown(season(200)), { level: "over", route: "harm", mark: "■", label: "붕괴선 넘음", text: `시즌 평균 사람 피해 20 / ${HARM_GATE} · 터진 판 0%` });
});

test("the three levels are told apart without colour: three marks and three words", () => {
  const rows = [season(0), season(160), season(200)].map(shown);
  assert.deepEqual(rows.map((row) => row.level), ["clear", "near", "over"]);
  assert.equal(new Set(rows.map((row) => row.mark)).size, 3);
  assert.equal(new Set(rows.map((row) => row.label)).size, 3);
});

test("the numbers are cut, not rounded: the line never prints a gate the season has not reached", () => {
  assert.equal(shown(season(199)).text, `시즌 평균 사람 피해 19.9 / ${HARM_GATE} · 터진 판 0%`);
  // 59 over three cases is 19.67 a case, and one bust in six windows is 16.7%.
  const [a, b, c] = CASE_SEQUENCE;
  const thirds = shown({ [a]: summary(59), [b]: summary(0, 1, 5), [c]: summary(0) });
  assert.deepEqual([thirds.level, thirds.route, thirds.text], ["near", "harm", `시즌 평균 사람 피해 19.6 / ${HARM_GATE} · 터진 판 16%`]);
  // 199 busts in 1000 windows is 19.9%: under the fifth, and printed under it.
  const almost = shown(season(120, 199, 1000));
  assert.deepEqual([almost.level, almost.text], ["near", `시즌 평균 사람 피해 12 / ${OVERREACH_HARM_GATE} · 터진 판 19% / 20%`]);
});

test("a season brought near by its busts prints the gate it is near: harm against ten beside the bust share", () => {
  // Harm at 12 a case is nowhere near 20, so the level here is the bust route's.
  assert.deepEqual(shown(season(120, 5)), { level: "clear", route: "harm", mark: "○", label: "붕괴선 아래", text: `시즌 평균 사람 피해 12 / ${HARM_GATE} · 터진 판 5%` });
  assert.deepEqual(shown(season(120, 18)), { level: "near", route: "overreach", mark: "▲", label: "붕괴선 가까움", text: `시즌 평균 사람 피해 12 / ${OVERREACH_HARM_GATE} · 터진 판 18% / 20%` });
  assert.deepEqual(shown(season(120, 20)), { level: "over", route: "overreach", mark: "■", label: "붕괴선 넘음", text: `시즌 평균 사람 피해 12 / ${OVERREACH_HARM_GATE} · 터진 판 20% / 20%` });
  // Both doors open: the line names harm, as the ending's cause does.
  assert.equal(shown(season(200, 20)).route, "harm");
  assert.equal(shown(season(200, 20)).text, `시즌 평균 사람 피해 20 / ${HARM_GATE} · 터진 판 20%`);
});

test("a season with nothing closed still has a line, and the harm on the table counts as the ending counts it", () => {
  for (const input of [undefined, {}, { caseResults: null, cases: seasonCasesBase }]) {
    const empty = createSeasonStandingReadout(input);
    assert.deepEqual([empty.level, empty.route, empty.text], ["clear", "harm", `시즌 평균 사람 피해 0 / ${HARM_GATE} · 터진 판 0%`]);
    assert.deepEqual(empty.harmCases, []);
  }
  const table = readout({}, { resources: { humanCost: HARM_GATE * CASE_SEQUENCE.length } });
  assert.deepEqual([table.level, table.text, table.harmCases], ["over", `시즌 평균 사람 피해 20 / ${HARM_GATE} · 터진 판 0%`, []]);
});

test("a collapse offers the cases that did the most harm, each by the roadmap's name and the harm it closed on", () => {
  const [a, b, c, d, e] = CASE_SEQUENCE;
  const label = (caseId) => seasonCasesBase.find((caseItem) => caseItem.id === caseId).label;
  assert.deepEqual(readout({ [a]: summary(9) }).harmCases, [{ caseId: "prologue01", harm: 9, text: "프롤로그 01 다시 도전 · 사람 피해 9" }]);

  const caseResults = { [e]: summary(9), [d]: summary(30), [b]: summary(41), [c]: summary(0), [a]: summary(12) };
  const listed = readout(caseResults).harmCases;
  assert.deepEqual(listed.map((item) => item.caseId), [b, d, a], "most harm first, three at most, none that closed on no harm");
  assert.deepEqual(listed.map((item) => item.text), [`${label(b)} 다시 도전 · 사람 피해 41`, `${label(d)} 다시 도전 · 사람 피해 30`, `${label(a)} 다시 도전 · 사람 피해 12`]);
  assert.deepEqual(listed.map(({ caseId, harm }) => ({ caseId, harm })), getSeasonStanding({ caseResults }).harmCases);
});

test("a case the season cannot open is not offered", () => {
  const [a, b] = CASE_SEQUENCE;
  // A summary under an id the season no longer has, and a case closing with no id.
  const stray = readout({ [a]: summary(9), [b]: summary(30), retired: summary(40) }, { resources: {} });
  assert.deepEqual(stray.harmCases.map((item) => item.caseId), [b, a]);
  assert.deepEqual(createSeasonStandingReadout({ caseResults: { [a]: summary(9) }, cases: [] }).harmCases, []);
  assert.deepEqual(createSeasonStandingReadout({ caseResults: { [a]: summary(9) } }).harmCases, [], "with no list of cases there is nothing to open");
});

test("on seasons of every shape the line's level is the standing's, and it lists only what the standing lists", () => {
  let seed = 20261013;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const upTo = (limit) => Math.floor(random() * (limit + 1));
  const seen = { harm: 0, overreach: 0 };
  for (let round = 0; round < 2000; round += 1) {
    const cases = CASE_SEQUENCE.slice(0, upTo(CASE_SEQUENCE.length));
    const heavy = random() < 0.5;
    const caseResults = Object.fromEntries(cases.map((caseId) => [caseId, summary(upTo(heavy ? 40 : 22), upTo(heavy ? 4 : 2), upTo(9))]));
    const resources = random() < 0.5 ? {} : { humanCost: upTo(100) };
    const standing = getSeasonStanding({ caseResults, resources });
    const line = readout(caseResults, { resources });
    assert.equal(line.level, standing.level, `round ${round}`);
    assert.equal(line.route === "overreach", standing.overreach.level !== "clear" && standing.harm.level !== standing.level, `round ${round}`);
    assert.deepEqual(line.harmCases.map(({ caseId, harm }) => ({ caseId, harm })), standing.harmCases, `round ${round}`);
    // What is printed never reaches a gate the season is still under.
    const [printedHarm, printedGate] = line.text.match(/피해 ([\d.]+) \/ (\d+)/).slice(1).map(Number);
    if (line.route === "harm") assert.equal(printedHarm >= printedGate, standing.harm.level === "over", `round ${round}: ${line.text}`);
    seen[line.route] += 1;
  }
  assert.ok(seen.harm > 100 && seen.overreach > 20, `the sweep read both routes (${JSON.stringify(seen)})`);
});
