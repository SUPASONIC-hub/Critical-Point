import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { ENDING_GATES } from "../../src/gameConstants.js";
import { getDecisionFingerprint } from "../../src/gameLogic.js";
import { HABIT_MIN_WINDOWS, JUDGEMENT_HABITS, getJudgementHabit, readHabitSeason } from "../../src/judgementHabit.js";
import { drawResultCard } from "../../src/resultCard.js";
import { buildResultCardModel, buildShareText } from "../../src/resultCardModel.js";

/**
 * The season's 판단 습관 (src/judgementHabit.js): which name each kind of
 * season gets, that the same summaries always get the same name, and that the
 * card prints the two strings it is handed and nothing else of them.
 */

/**
 * One case summary as `createCaseSummary` stores it, with only the fields the
 * habits read. The defaults are a quiet case: 10 windows, 4 pushes a window,
 * one BUST, harm 5, no wild card, 3 decisions for people, 10 seconds a
 * decision, and a logic record that held half its open windows.
 */
function summary({ windows = 10, busts = 1, pushes = 40, harm = 5, reframes = 0, peopleFirst = 3, seconds = 10, logic = { windows: 10, keeps: 0, breaks: 5, busts: 0 } } = {}) {
  return {
    pushRecord: { busts, cashes: windows - busts, pushes },
    finalHumanCost: harm,
    reframeCount: reframes,
    peopleFirstCount: peopleFirst,
    averageResponseTime: seconds,
    ...(logic ? { logicRecord: { best: 2, ...logic } } : {}),
  };
}

/** A season of `cases` cases, every one closed like `shape`. */
function season(shape = {}, cases = 6) {
  return Object.fromEntries(Array.from({ length: cases }, (_, index) => [`case${String(index + 1).padStart(2, "0")}`, summary(shape)]));
}

const habitOf = (shape, cases) => getJudgementHabit(season(shape, cases))?.id;

test("there are eleven habits, each with an id, a name and one line, and the last holds for anything", () => {
  assert.equal(JUDGEMENT_HABITS.length, 11);
  assert.equal(new Set(JUDGEMENT_HABITS.map((habit) => habit.id)).size, 11);
  assert.equal(new Set(JUDGEMENT_HABITS.map((habit) => habit.title)).size, 11);
  for (const habit of JUDGEMENT_HABITS) {
    assert.match(habit.title, /형$/, `${habit.id} is named like a test result`);
    assert.ok([...habit.title].length <= 11, `${habit.id}: the name fits one line of the card's large type`);
    assert.ok([...habit.line].length <= 28, `${habit.id}: the line fits one line of the card`);
    assert.match(habit.line, /다\.$/, `${habit.id}: the line is one sentence`);
  }
  assert.equal(JUDGEMENT_HABITS.at(-1).holds({}), true);
});

test("each habit names the season it is written for", () => {
  const cases = [
    ["bulldozer", { harm: 25 }],
    ["moth", { busts: 3 }],
    ["tightrope", { pushes: 40, busts: 0 }],
    ["reframer", { reframes: 1 }],
    ["shield", { peopleFirst: 8, harm: 2 }],
    ["one-track", { logic: { windows: 10, keeps: 0, breaks: 1, busts: 0 } }],
    ["card-shopper", { logic: { windows: 10, keeps: 0, breaks: 8, busts: 0 } }],
    ["stepping-stone", { pushes: 30, busts: 0 }],
    ["marathon", { seconds: 24 }],
    ["lightning", { seconds: 4 }],
    ["steady", {}],
  ];
  assert.deepEqual(cases.map(([id]) => id), JUDGEMENT_HABITS.map((habit) => habit.id), "every habit is reached");
  for (const [id, shape] of cases) assert.equal(habitOf(shape), id, id);
});

test("the habits are tried in order: the harm a season did comes before how it pushed", () => {
  assert.equal(habitOf({ harm: 25, busts: 4, reframes: 1 }), "bulldozer");
  assert.equal(habitOf({ busts: 4, reframes: 1, seconds: 30 }), "moth");
  assert.equal(habitOf({ reframes: 1, peopleFirst: 8, harm: 0 }), "reframer");
  // Putting people first is read before holding one logic.
  assert.equal(habitOf({ peopleFirst: 8, harm: 2, logic: { windows: 10, keeps: 0, breaks: 1, busts: 0 } }), "shield");
  // A season that only just crossed the collapse gate is named for how it played, not for its harm.
  assert.equal(habitOf({ harm: ENDING_GATES.collapseHarmPerCase, busts: 3 }), "moth");
  // Putting people first is not a shield while the harm is near the overreach gate.
  assert.equal(habitOf({ peopleFirst: 8, harm: ENDING_GATES.collapseOverreachHarm }), "steady");
  // A careful hand that is also slow is named for its hand.
  assert.equal(habitOf({ pushes: 30, busts: 0, seconds: 30 }), "stepping-stone");
});

test("the thresholds sit where they are written", () => {
  // 25 harm a case is a bulldozer, 24 is not.
  assert.equal(habitOf({ harm: 25 }), "bulldozer");
  assert.equal(habitOf({ harm: 24 }), "steady");
  // 0.28 of the windows BUST is a moth, one fewer is not.
  assert.equal(habitOf({ windows: 25, busts: 7, pushes: 100 }), "moth");
  assert.equal(habitOf({ windows: 25, busts: 6, pushes: 100 }), "steady");
  // 3.6 pushes a window under 0.09 BUSTs is a tightrope; 3.5 is not, nor is 0.1 BUSTs.
  assert.equal(habitOf({ pushes: 36, busts: 0 }), "tightrope");
  assert.equal(habitOf({ pushes: 35, busts: 0 }), "steady");
  assert.equal(habitOf({ pushes: 36, busts: 1 }), "steady");
  // One wild card a case: 10 of 10 cases is a reframer, 9 is not.
  const wild = (count) => Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`case${index}`, summary({ reframes: index < count ? 1 : 0 })]));
  assert.equal(getJudgementHabit(wild(10)).id, "reframer");
  assert.equal(getJudgementHabit(wild(9)).id, "steady");
  // 0.7 of the decisions for people is a shield, 0.6 is not.
  assert.equal(habitOf({ peopleFirst: 7, harm: 2 }), "shield");
  assert.equal(habitOf({ peopleFirst: 6, harm: 2 }), "steady");
  // A 논리 유지력 of 75 is 외길, 74 is not; under 45 is card shopping, 45 is not.
  const hold = (breaks) => ({ logic: { windows: 100, keeps: 0, breaks, busts: 0 } });
  assert.equal(habitOf(hold(25)), "one-track");
  assert.equal(habitOf(hold(26)), "steady");
  assert.equal(habitOf(hold(56)), "card-shopper");
  assert.equal(habitOf(hold(55)), "steady");
  // 3.3 pushes a window with at most 0.04 BUSTs is a stepping stone.
  assert.equal(habitOf({ pushes: 33, busts: 0 }), "stepping-stone");
  // 12 seconds is a marathon, 11 is not; 6 is lightning, 7 is not.
  assert.equal(habitOf({ seconds: 12 }), "marathon");
  assert.equal(habitOf({ seconds: 11 }), "steady");
  assert.equal(habitOf({ seconds: 6 }), "lightning");
  assert.equal(habitOf({ seconds: 7 }), "steady");
});

test("the logic habits need enough windows to read a 논리 유지력", () => {
  assert.equal(habitOf({ logic: { windows: 1, keeps: 0, breaks: 0, busts: 0 } }, 6), "steady", "6 logic windows is too few for 외길");
  assert.equal(habitOf({ logic: { windows: 2, keeps: 0, breaks: 0, busts: 0 } }, 6), "one-track", "12 is enough");
  // A season whose every logic window kept the streak by default has no hold, and neither logic habit names it.
  assert.equal(habitOf({ logic: { windows: 10, keeps: 10, breaks: 0, busts: 0 } }), "steady");
  assert.equal(habitOf({ logic: null }), "steady");
});

test("the same summaries always get the same habit, whatever order they are stored in", () => {
  const stored = { case01: summary({ busts: 4 }), case02: summary(), final: summary({ reframes: 1 }) };
  const reversed = Object.fromEntries(Object.entries(stored).reverse());
  const first = getJudgementHabit(stored);
  for (let index = 0; index < 5; index += 1) assert.deepEqual(getJudgementHabit(stored), first);
  assert.deepEqual(getJudgementHabit(reversed), first);
  assert.deepEqual(Object.keys(first).sort(), ["id", "line", "title"], "only the finished strings leave the module");
});

test("a season with too few settled windows, or no record at all, has no habit", () => {
  assert.equal(getJudgementHabit({ case01: summary({ windows: HABIT_MIN_WINDOWS - 1, busts: 0, pushes: 4 }) }), null);
  assert.ok(getJudgementHabit({ case01: summary({ windows: HABIT_MIN_WINDOWS, busts: 0, pushes: 20 }) }));
  for (const input of [undefined, null, {}, [], "x", 7, { case01: null, case02: "x" }, { case01: {} }]) {
    assert.equal(getJudgementHabit(input), null, JSON.stringify(input));
  }
});

test("an older summary missing fields counts them as nothing", () => {
  const read = readHabitSeason({ case01: { pushRecord: { busts: 2, cashes: 8 } }, case02: { pushRecord: { cashes: 10, pushes: "x" }, reframeCount: -3, averageResponseTime: null } });
  assert.deepEqual(read, {
    cases: 2,
    windows: 20,
    bustRate: 0.1,
    pushesPerWindow: 0,
    harmPerCase: 0,
    wildPerCase: 0,
    peopleFirstShare: 0,
    logicWindows: 0,
    logicHold: 50,
    averageSeconds: 0,
  });
  // No pushes recorded and no BUST to speak of reads as the careful hand.
  assert.equal(getJudgementHabit({ case01: { pushRecord: { cashes: 10 } } }).id, "stepping-stone");
});

test("every habit's name and line has a glyph in the game's font", () => {
  const charset = new Set(
    readFileSync(new URL("../../src/assets/fonts/pretendard-cp.charset.txt", import.meta.url), "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => String.fromCodePoint(Number.parseInt(line.split(/\s/)[0], 16))),
  );
  assert.ok(charset.size > 1000, "the charset file was read");
  const missing = JUDGEMENT_HABITS.flatMap((habit) => [...`${habit.title}${habit.line}`]).filter((character) => !charset.has(character));
  assert.deepEqual([...new Set(missing)], []);
});

// ------------------------------------------------------------- on the card

const THEME = { ground: "ground", panel: "panel", text: "text", dim: "dim", accent: "accent", heat: "heat", fontFamily: "sans-serif" };

function drawnTexts(model) {
  const texts = [];
  const ctx = {
    font: "",
    fillStyle: "",
    strokeStyle: "",
    textAlign: "left",
    textBaseline: "",
    lineWidth: 1,
    measureText: (text) => ({ width: [...String(text)].length * (Number(/(\d+)px/.exec(ctx.font)?.[1]) || 10) * 0.92 }),
    fillText: (text, x, y) => texts.push({ text, x, y, color: ctx.fillStyle }),
    fillRect() {},
    strokeRect() {},
  };
  drawResultCard(ctx, model, THEME);
  return texts;
}

test("the card prints the habit's name in the large line, and the copied line names it", () => {
  const habit = getJudgementHabit(season({ busts: 3 }));
  const fingerprint = { ...getDecisionFingerprint({}), habit };
  const model = buildResultCardModel({ fingerprint, endingName: "결말", caseResults: {} });
  assert.equal(model.modeTitle, habit.title);
  const texts = drawnTexts(model);
  assert.ok(texts.some((entry) => entry.text === habit.title), "the name is drawn");
  assert.ok(!texts.some((entry) => entry.text === habit.line), "the line is not drawn: the card's chunk had no room");
  assert.match(buildShareText(model), new RegExp(`'${habit.title}'`));
});

test("a fingerprint without a habit prints the card it always printed", () => {
  const fingerprint = getDecisionFingerprint({});
  const without = buildResultCardModel({ fingerprint, endingName: "결말", caseResults: {} });
  assert.equal(without.modeTitle, fingerprint.modeTitle);
  assert.deepEqual(drawnTexts(without), drawnTexts(buildResultCardModel({ fingerprint: { ...fingerprint, habit: null }, endingName: "결말", caseResults: {} })));
  for (const junk of [{ title: "  ", line: 3 }, "x", 7]) {
    const model = buildResultCardModel({ fingerprint: { ...fingerprint, habit: junk }, endingName: "결말", caseResults: {} });
    assert.equal(model.modeTitle, fingerprint.modeTitle);
  }
});

test("the report's 당신이 반복한 방식 box names the habit and draws the line the card left out", () => {
  const screen = readFileSync(new URL("../../src/screens/ResultScreen.jsx", import.meta.url), "utf8");
  const box = screen.slice(screen.indexOf("<span>당신이 반복한 방식</span>"), screen.indexOf("</article>", screen.indexOf("<span>당신이 반복한 방식</span>")));
  assert.match(box, /<strong>\{decisionFingerprint\.habit\?\.title \|\| decisionFingerprint\.modeTitle\}<\/strong>/, "the habit's name, or the 판단 DNA title without one");
  assert.match(box, /\{decisionFingerprint\.habit \? <p>\{decisionFingerprint\.habit\.line\}<\/p> : null\}/, "the habit's line under it");
  const card = readFileSync(new URL("../../src/components/ResultCardShare.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(card, /\.line\b/, "the share card's chunk still does not carry the line");
});
