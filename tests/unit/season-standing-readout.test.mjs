import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE, seasonCasesBase } from "../../src/gameCases.js";
import { ENDING_GATES, initialResources } from "../../src/gameConstants.js";
import { ENDING_IDS } from "../../src/gameLogic.js";
import reportLinesCopy from "../../src/copy/reportLines.js";
import enScreens from "../../src/locales/en/screens/index.js";
import jaScreens from "../../src/locales/ja/screens/index.js";
import { getSeasonStanding } from "../../src/seasonStanding.js";
import { isMarkThirteenOn, writeSoft } from "../../src/gauntlet/nextTableRules.js";
import { HELD_LINE_CAPITAL_SHARE, createSeasonStandingReadout, readHeldLine } from "../../src/viewModels/reportViewModels.js";

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

// G47 (RULES_MARK 13) moves the harm gate 20 -> 13 a case: the seasons below are set against the gate the page plays.
// `H` is a season's harm sum over ten cases (a tenth of it a case), `cut` what the line prints for it.
const H = HARM_GATE === 20
  ? { clear: 140, near: 160, over: 200, under: 199, underText: "19.9", thirds: 59, thirdsText: "19.6", side: 120, sideText: "12" }
  : { clear: 90, near: 110, over: 130, under: 129, underText: "12.9", thirds: 38, thirdsText: "12.6", side: 100, sideText: "10" };
const perCase = (sum) => String(sum / 10);

test("the line prints the season's mean harm against the gate, with a shape and a word for the level", () => {
  assert.deepEqual(shown(season(H.clear, 12)), { level: "clear", route: "harm", mark: "○", label: "붕괴선 아래", text: `시즌 평균 사람 피해 ${perCase(H.clear)} / ${HARM_GATE} · 터진 판 12%` });
  assert.deepEqual(shown(season(H.near)), { level: "near", route: "harm", mark: "▲", label: "붕괴선 가까움", text: `시즌 평균 사람 피해 ${perCase(H.near)} / ${HARM_GATE} · 터진 판 0%` });
  assert.deepEqual(shown(season(H.over)), { level: "over", route: "harm", mark: "■", label: "붕괴선 넘음", text: `시즌 평균 사람 피해 ${perCase(H.over)} / ${HARM_GATE} · 터진 판 0%` });
});

test("the three levels are told apart without colour: three marks and three words", () => {
  const rows = [season(0), season(H.near), season(H.over)].map(shown);
  assert.deepEqual(rows.map((row) => row.level), ["clear", "near", "over"]);
  assert.equal(new Set(rows.map((row) => row.mark)).size, 3);
  assert.equal(new Set(rows.map((row) => row.label)).size, 3);
});

test("the numbers are cut, not rounded: the line never prints a gate the season has not reached", () => {
  assert.equal(shown(season(H.under)).text, `시즌 평균 사람 피해 ${H.underText} / ${HARM_GATE} · 터진 판 0%`);
  // A third of `H.thirds` a case (19.67 at 20, 12.67 at 13), and one bust in six windows is 16.7%.
  const [a, b, c] = CASE_SEQUENCE;
  const thirds = shown({ [a]: summary(H.thirds), [b]: summary(0, 1, 5), [c]: summary(0) });
  assert.deepEqual([thirds.level, thirds.route, thirds.text], ["near", "harm", `시즌 평균 사람 피해 ${H.thirdsText} / ${HARM_GATE} · 터진 판 16%`]);
  // 199 busts in 1000 windows is 19.9%: under the fifth, and printed under it.
  const almost = shown(season(H.side, 199, 1000));
  assert.deepEqual([almost.level, almost.text], ["near", `시즌 평균 사람 피해 ${H.sideText} / ${OVERREACH_HARM_GATE} · 터진 판 19% / 20%`]);
});

test("a season brought near by its busts prints the gate it is near: harm against ten beside the bust share", () => {
  // Harm at `H.side` a case is not near the harm gate, so the level here is the bust route's.
  assert.deepEqual(shown(season(H.side, 5)), { level: "clear", route: "harm", mark: "○", label: "붕괴선 아래", text: `시즌 평균 사람 피해 ${H.sideText} / ${HARM_GATE} · 터진 판 5%` });
  assert.deepEqual(shown(season(H.side, 18)), { level: "near", route: "overreach", mark: "▲", label: "붕괴선 가까움", text: `시즌 평균 사람 피해 ${H.sideText} / ${OVERREACH_HARM_GATE} · 터진 판 18% / 20%` });
  assert.deepEqual(shown(season(H.side, 20)), { level: "over", route: "overreach", mark: "■", label: "붕괴선 넘음", text: `시즌 평균 사람 피해 ${H.sideText} / ${OVERREACH_HARM_GATE} · 터진 판 20% / 20%` });
  // Both doors open: the line names harm, as the ending's cause does.
  assert.equal(shown(season(H.over, 20)).route, "harm");
  assert.equal(shown(season(H.over, 20)).text, `시즌 평균 사람 피해 ${perCase(H.over)} / ${HARM_GATE} · 터진 판 20%`);
});

test("a season with nothing closed still has a line, and the harm on the table counts as the ending counts it", () => {
  for (const input of [undefined, {}, { caseResults: null, cases: seasonCasesBase }]) {
    const empty = createSeasonStandingReadout(input);
    assert.deepEqual([empty.level, empty.route, empty.text], ["clear", "harm", `시즌 평균 사람 피해 0 / ${HARM_GATE} · 터진 판 0%`]);
    assert.deepEqual(empty.harmCases, []);
  }
  const table = readout({}, { resources: { humanCost: HARM_GATE * CASE_SEQUENCE.length } });
  assert.deepEqual([table.level, table.text, table.harmCases], ["over", `시즌 평균 사람 피해 ${HARM_GATE} / ${HARM_GATE} · 터진 판 0%`, []]);
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

/**
 * 개선 포인트 C3 (2026-11-05 draft): a season that lost money and kept people
 * says so after the line (`held`), and after the ending's own line on the
 * finale (`endingHeld`), from the mean cash its cases closed on against
 * `HELD_LINE_CAPITAL_SHARE` of the start. Neither says anything for a
 * season near or over the line, one that kept its cash, or one with no
 * closed case to read a mean from.
 */
test("the held line prints when harm is clear and the season's mean cash closed under the share of the start", () => {
  // G44 (RULES_MARK 13): the mean read back through the softer gains (74 reads as 78; 79 as 88, over the share).
  const lost = isMarkThirteenOn() ? 74 : initialResources.capital * HELD_LINE_CAPITAL_SHARE - 1;
  const line = readout(season(H.clear), { closing: { capital: lost }, endingId: "quiet-cover" });
  assert.equal(line.held, `현금은 평균 ${lost}까지 내려갔지만 사람 피해는 붕괴선 아래입니다.`);
  assert.equal(line.endingHeld, "현금을 잃었지만 진 것이 아니라, 사람 피해를 선 아래에 두고 조용히 닫은 시즌입니다.");
  assert.deepEqual(readHeldLine({ level: "clear", closing: { capital: lost } }), { capital: lost });
});

test("the held line stays out when the season kept its cash, is near or over the line, or has no closed mean", () => {
  const lost = { capital: 40 };
  const kept = { capital: isMarkThirteenOn() ? writeSoft(initialResources.capital * HELD_LINE_CAPITAL_SHARE) : initialResources.capital * HELD_LINE_CAPITAL_SHARE };
  assert.equal(readout(season(H.clear), { closing: kept, endingId: "quiet-cover" }).held, null, "at the share is not under it");
  assert.equal(readout(season(H.clear), { closing: { capital: 100 } }).held, null);
  assert.equal(readout(season(H.near), { closing: lost, endingId: "quiet-cover" }).held, null, "near");
  assert.equal(readout(season(H.over), { closing: lost, endingId: "quiet-cover" }).held, null, "over");
  assert.equal(readout(season(H.side, 18), { closing: lost }).held, null, "near by its busts");
  assert.equal(readout(season(H.clear), { closing: null }).held, null, "no closed case");
  assert.equal(readout(season(H.clear), { closing: { capital: "x" } }).held, null);
  assert.equal(readout(season(H.clear)).held, null);
  for (const line of [readout(season(H.near), { closing: lost, endingId: "quiet-cover" }), readout(season(H.clear), { closing: kept, endingId: "quiet-cover" })]) {
    assert.equal(line.endingHeld, null);
  }
});

test("every ending that can be reached on lost cash has its sentence, and the collapse and PROFITABLE SILENCE have none", () => {
  const lost = { capital: 40 };
  const withOne = ENDING_IDS.filter((id) => id !== "collapse" && id !== "profitable-silence");
  for (const id of [...withOne, "open-question"]) {
    const line = readout(season(H.clear), { closing: lost, endingId: id });
    assert.equal(typeof line.endingHeld, "string", id);
    assert.match(line.endingHeld, /^현금을 잃었지만 진 것이 아니라, /, id);
  }
  for (const id of ["collapse", "profitable-silence", "", "toString", undefined]) {
    assert.equal(readout(season(H.clear), { closing: lost, endingId: id }).endingHeld, null, String(id));
  }
  // The table holds exactly those endings, in the three languages.
  const expected = [...withOne, "open-question"].sort();
  for (const [lang, table] of Object.entries({ ko: reportLinesCopy.heldEndings, en: enScreens.reportLines.heldEndings, ja: jaScreens.reportLines.heldEndings })) {
    assert.deepEqual(Object.keys(table).sort(), expected, lang);
    for (const [id, sentence] of Object.entries(table)) assert.ok(typeof sentence === "string" && sentence.length > 0, `${lang} ${id}`);
  }
  // 감수 질문 1·9 (C3-1): Korean reads 「진 것이 아니라」, English has no "lost … did not lose" pun.
  for (const sentence of Object.values(reportLinesCopy.heldEndings)) assert.doesNotMatch(sentence, /진 것은 아니라/);
  for (const sentence of Object.values(enScreens.reportLines.heldEndings)) {
    assert.match(sentence, /^Cash fell, but the season was not lost: it kept /);
    assert.doesNotMatch(sentence, /did not lose/);
  }
  assert.equal(typeof enScreens.reportLines.standing.held, "string");
  assert.equal(typeof jaScreens.reportLines.standing.held, "string");
});
