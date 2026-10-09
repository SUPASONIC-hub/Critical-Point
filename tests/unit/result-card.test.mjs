import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getEndingPreview, getRankingLeague } from "../../src/advancedSystems.js";
import { ENDING_IDS, getDecisionFingerprint, getEndingVariant, getThinkingMotive } from "../../src/gameLogic.js";
import { buildLeaderboard } from "../../src/ranking.js";
import {
  RESULT_CARD_FILE_NAME,
  RESULT_CARD_HEIGHT,
  RESULT_CARD_MARGIN,
  RESULT_CARD_WIDTH,
  drawResultCard,
  readResultCardTheme,
  renderResultCardFile,
  shareOrSave,
} from "../../src/resultCard.js";
import { RESULT_CARD_COPY, RESULT_CARD_STATUS } from "../../src/resultCardCopy.js";
import { RESULT_CARD_LABELS, buildResultCardModel, buildShareText, wrapLines } from "../../src/resultCardModel.js";

/**
 * The season's result card: what it says, what it leaves out, and what a
 * press on its buttons does. The card is a picture people post, so two things
 * are held here that no screenshot test would hold: every character it can
 * print has a glyph in the game's font, and nothing that says who played can
 * reach it.
 *
 * The strings come from the game's own modules. A new ending line or a
 * reworded 판단 DNA is checked the day it is written.
 */

const ORIGIN = "https://critical-point-wn6p.onrender.com";
const HOST = "critical-point-wn6p.onrender.com";
const RANKS = ["S", "A", "B", "C"];
const LEAGUES = ["RISK CUTTER", "BOARD BREAKER", "SYSTEM THINKER", "FIELD DECIDER"].map((style) => getRankingLeague(style));

/** Every ending the game can reach, found by asking it: the eight named ones and the three ways the open question reads. */
function reachableEndings() {
  const found = new Map();
  const levels = [20, 50, 70, 80, 90, 100];
  const casesPlayed = 10;
  for (const trust of levels) for (const legitimacy of levels) for (const capital of levels) {
    for (const clues of [0, 6, 12]) for (const harm of [0, 9999]) for (const reframes of [0, 10]) for (const burn of [false, true]) for (const pressure of [0, 30]) {
      const ending = getEndingVariant({
        resources: { trust, legitimacy, capital },
        seasonResources: { trust, legitimacy, capital },
        discoveredClues: Array.from({ length: clues }, (_, index) => ({ id: `clue${index}` })),
        log: burn ? [{ choiceId: "f_after_burn" }] : [],
        seasonHumanCost: harm,
        casesPlayed,
        seasonReframeRoutes: reframes,
        sustainedPressure: pressure,
      });
      found.set(`${ending.id}|${ending.title}`, { ...ending, name: getEndingPreview(ending).label });
    }
  }
  return [...found.values()];
}

const ENDINGS = reachableEndings();
const FINGERPRINTS = [
  getDecisionFingerprint({}),
  getDecisionFingerprint({ entries: [{ reframe: true }] }),
  getDecisionFingerprint({ entries: [{ effect: { fatigue: -1 } }] }),
];
const MOTIVES = [{ affection: 1 }, { revenge: 1 }, { responsibility: 1 }, { curiosity: 1 }, {}].map((scores) => getThinkingMotive(scores));

const THEME = { ground: "ground", panel: "panel", text: "text", dim: "dim", accent: "accent", heat: "heat", fontFamily: '"Critical Point Sans", sans-serif' };

/**
 * A stand-in for the 2D context. Widths are a model of the face, not the face:
 * a Hangul syllable is `hangul` em wide, anything else 0.62 em, a space a
 * quarter. What matters is that a width follows the font size that was set.
 */
function fakeContext({ hangul = 0.92 } = {}) {
  const texts = [];
  const rects = [];
  const ctx = {
    font: "",
    fillStyle: "",
    strokeStyle: "",
    textAlign: "left",
    textBaseline: "",
    lineWidth: 1,
    texts,
    rects,
    measureText(text) {
      const size = Number(/(\d+)px/.exec(ctx.font)?.[1]) || 10;
      let width = 0;
      for (const character of String(text)) width += size * (character === " " ? 0.25 : /[가-힣]/.test(character) ? hangul : 0.62);
      return { width };
    },
    fillText(text, x, y, maxWidth) {
      const size = Number(/(\d+)px/.exec(ctx.font)?.[1]);
      texts.push({ text, x, y, maxWidth, size, font: ctx.font, align: ctx.textAlign, color: ctx.fillStyle, width: Math.min(ctx.measureText(text).width, maxWidth ?? Infinity) });
    },
    fillRect(x, y, width, height) {
      rects.push({ x, y, width, height, color: ctx.fillStyle });
    },
    strokeRect(x, y, width, height) {
      rects.push({ x, y, width, height, color: ctx.strokeStyle, stroke: true });
    },
  };
  return ctx;
}

function modelOf({ ending = ENDINGS[0], fingerprint = FINGERPRINTS[0], caseResults = { final: { burstScore: 71, rank: "B" } }, host = HOST } = {}) {
  return buildResultCardModel({ fingerprint, endingVariant: ending, endingName: ending.name, caseResults, host });
}

function draw(model, options) {
  const ctx = fakeContext(options);
  drawResultCard(ctx, model, THEME);
  return ctx;
}

// ---------------------------------------------------------------- wrapLines

const perCharacter = (text) => [...text].length;

test("wrapLines ends a line at a space and keeps a word whole", () => {
  assert.deepEqual(wrapLines(perCharacter, "판 자체를 다시 짜는 사람", 7), ["판 자체를", "다시 짜는", "사람"]);
  assert.deepEqual(wrapLines(perCharacter, "한 줄에 다 들어간다", 40), ["한 줄에 다 들어간다"]);
  assert.deepEqual(wrapLines(perCharacter, "  앞뒤   공백은   접는다  ", 40), ["앞뒤 공백은 접는다"]);
});

test("wrapLines cuts a word between syllables only when it is wider than a line", () => {
  assert.deepEqual(wrapLines(perCharacter, "가나다라마바사아자차 끝", 4), ["가나다라", "마바사아", "자차 끝"]);
  // The word before the long one closes its own line first.
  assert.deepEqual(wrapLines(perCharacter, "앞 가나다라마바", 4), ["앞", "가나다라", "마바"]);
});

test("wrapLines loses no character and respects the width, for every line the card wraps", () => {
  const samples = [...ENDINGS.map((ending) => ending.title), ...FINGERPRINTS.map((fingerprint) => fingerprint.modeTitle), "띄어쓰기없이아주길게이어지는한단어짜리문장입니다"];
  for (const sample of samples) {
    for (const width of [1, 3, 8, 13, 21, 60]) {
      const lines = wrapLines(perCharacter, sample, width);
      assert.equal(lines.join("").replace(/\s/g, ""), sample.replace(/\s/g, ""), `"${sample}" at ${width}`);
      for (const line of lines) {
        assert.ok(perCharacter(line) <= width, `"${line}" is wider than ${width}`);
        assert.equal(line, line.trim());
      }
    }
  }
});

test("wrapLines answers nothing for nothing", () => {
  assert.deepEqual(wrapLines(perCharacter, "", 10), []);
  assert.deepEqual(wrapLines(perCharacter, undefined, 10), []);
  assert.deepEqual(wrapLines(perCharacter, "   ", 10), []);
});

// -------------------------------------------------------------------- model

test("the game can reach nine endings, the open question in three wordings", () => {
  assert.deepEqual([...new Set(ENDINGS.map((ending) => ending.id))].sort(), [...ENDING_IDS, "open-question"].sort());
  assert.equal(ENDINGS.filter((ending) => ending.id === "open-question").length, 3);
  assert.equal(new Set(ENDINGS.map((ending) => ending.name)).size, 9);
  assert.deepEqual(FINGERPRINTS.map((fingerprint) => fingerprint.mode).sort(), ["GUARDIAN", "PRESSURE PILOT", "RE-FRAMER"]);
  assert.equal(new Set(MOTIVES.map((motive) => motive.label)).size, 5);
  assert.equal(new Set(LEAGUES).size, 4);
});

test("the card shows the best burst score of the season and the rank of that case", () => {
  const model = modelOf({
    caseResults: {
      prologue01: { burstScore: 40, rank: "C" },
      case07: { burstScore: 93.4, rank: "S" },
      case20: { burstScore: 88, rank: "A" },
      final: { burstScore: 61, rank: "B" },
    },
  });
  assert.equal(model.bestBurst, 93);
  assert.equal(model.bestRank, "S");
  // The same score twice: the better rank is the one shown.
  const tied = modelOf({ caseResults: { case01: { burstScore: 80, rank: "B" }, case02: { burstScore: 80, rank: "A" }, case03: { burstScore: 80, rank: "C" } } });
  assert.deepEqual([tied.bestBurst, tied.bestRank], [80, "A"]);
  // A save from before the burst score was stored carries the old field.
  assert.equal(modelOf({ caseResults: { case01: { momentumScore: 55, rank: "B" } } }).bestBurst, 55);
  // Whatever a stored summary holds, the cell prints a score from 0 to 100 and one of four letters.
  const odd = modelOf({ caseResults: { a: { burstScore: 250, rank: "Z" }, b: { burstScore: "x", rank: { S: 1 } }, c: null, d: "text", e: { burstScore: -4 } } });
  assert.deepEqual([odd.bestBurst, odd.bestRank], [100, "C"]);
});

test("the league is the one the ranking files the season row under", () => {
  const finals = [
    { burstScore: 70, rank: "B", reframeCount: 3, reflectionScore: 60, pressureAdaptScore: 40 },
    { burstScore: 70, rank: "B", reframeCount: 0, reflectionScore: 30, pressureAdaptScore: 50 },
    { burstScore: 70, rank: "B", reframeCount: 0, reflectionScore: 60, pressureAdaptScore: 50 },
    { burstScore: 70, rank: "B", reframeCount: 0, reflectionScore: 10, pressureAdaptScore: 12 },
    // A final case that scored nothing still has a league.
    { burstScore: 0, rank: "C", reframeCount: 2, reflectionScore: 20, pressureAdaptScore: 5 },
  ];
  const seen = new Set();
  for (const final of finals) {
    // The row GameRuntime hands the ranking for a finished season.
    const [row] = buildLeaderboard([{ local: true, case_id: "season-final", summary: { ...final, seasonComplete: true } }], 1);
    const model = modelOf({ caseResults: { case01: { burstScore: 99, rank: "S", reframeCount: 9, reflectionScore: 99 }, final } });
    assert.equal(model.league, row.league);
    seen.add(model.league);
  }
  assert.deepEqual([...seen].sort(), [...LEAGUES].sort());
});

test("a card with pieces missing is still a whole card", () => {
  for (const input of [undefined, null, {}, { caseResults: [] }, { caseResults: "x", fingerprint: 3, endingVariant: [], endingName: 7, host: {} }, { fingerprint: { modeTitle: "  ", motive: null } }]) {
    const model = buildResultCardModel(input);
    assert.deepEqual([model.bestBurst, model.bestRank, model.story, model.failure], [0, "C", false, false]);
    assert.equal(model.league, getRankingLeague());
    assert.ok(model.modeTitle.length > 0 && model.endingName.length > 0);
    for (const value of Object.values(model)) assert.ok(["string", "number", "boolean"].includes(typeof value));
    const drawn = [...draw(model).texts.map((entry) => entry.text), buildShareText(model, ORIGIN), buildShareText(model)];
    for (const text of drawn) {
      assert.equal(typeof text, "string");
      assert.doesNotMatch(text, /undefined|NaN|null|\[object/);
    }
  }
  // No model at all reads as the empty one.
  assert.equal(buildShareText(undefined, ORIGIN), buildShareText(buildResultCardModel(), ORIGIN));
});

test("a season with any case in story mode is marked, and no other season is", () => {
  const plain = modelOf({ caseResults: { case01: { burstScore: 50 }, final: { burstScore: 60, assistTime: 2 } } });
  const story = modelOf({ caseResults: { case01: { burstScore: 50, assistStory: true }, final: { burstScore: 60 } } });
  assert.equal(plain.story, false);
  assert.equal(story.story, true);
  const marked = (model) => draw(model).texts.some((entry) => entry.text === RESULT_CARD_LABELS.story);
  assert.equal(marked(plain), false);
  assert.equal(marked(story), true);
});

// --------------------------------------------------------------- share text

test("the copied line has one shape for every ending and every 판단 DNA", () => {
  let count = 0;
  for (const ending of ENDINGS) {
    for (const fingerprint of FINGERPRINTS) {
      const model = modelOf({ ending, fingerprint, caseResults: { case03: { burstScore: 87, rank: "A" }, final: { burstScore: 64, rank: "B" } } });
      const text = buildShareText(model, ORIGIN);
      assert.equal(
        text,
        `트리거랩에서 한 시즌을 끝냈습니다. 판단 DNA는 '${fingerprint.modeTitle}', 결말은 '${ending.name}'. 최고 버스트 87점, A 랭크. ${ORIGIN}/`,
      );
      assert.doesNotMatch(text, /undefined|NaN|null/);
      count += 1;
    }
  }
  assert.equal(count, 33);
  // An address that already ends in a slash is not given two.
  assert.ok(buildShareText(modelOf(), `${ORIGIN}/`).endsWith(` ${ORIGIN}/`));
  // Without an address the line ends at the rank.
  assert.ok(buildShareText(modelOf()).endsWith("B 랭크."));
});

test("the copy the screen prints around the card is the agreed copy", () => {
  assert.deepEqual({ ...RESULT_CARD_COPY }, {
    shareLabel: "결과 카드 공유",
    saveLabel: "결과 카드 저장",
    making: "카드를 만드는 중입니다.",
    saved: "결과 카드를 저장하고 소개 문구를 복사했습니다.",
    savedUncopied: "결과 카드를 저장했습니다. 문구는 복사하지 못했습니다.",
    shared: "결과 카드를 공유했습니다.",
    failed: "카드를 만들지 못했습니다. 다시 눌러 주세요.",
    note: "카드에는 이름이 들어가지 않습니다.",
  });
  assert.deepEqual(Object.keys(RESULT_CARD_STATUS).sort(), ["cancelled", "failed", "saved", "saved-uncopied", "shared"]);
  assert.equal(RESULT_CARD_STATUS.cancelled, "");
  assert.equal(RESULT_CARD_LABELS.byline, "익명 분석관의 기록");
  assert.equal(RESULT_CARD_LABELS.story, "스토리 모드");
});

// ------------------------------------------------------------------ charset

test("every character the card can draw or copy has a glyph in the game's font", () => {
  const charset = new Set(
    readFileSync(new URL("../../src/assets/fonts/pretendard-cp.charset.txt", import.meta.url), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => String.fromCodePoint(parseInt(line.slice(0, line.indexOf(" ")), 16))),
  );
  assert.ok(charset.size > 1000, "the charset file was read");

  const strings = new Set([
    ...Object.values(RESULT_CARD_LABELS),
    ...Object.values(RESULT_CARD_COPY),
    ...Object.values(RESULT_CARD_STATUS),
    ...ENDINGS.flatMap((ending) => [ending.name, ending.label, ending.title]),
    ...FINGERPRINTS.flatMap((fingerprint) => [fingerprint.mode, fingerprint.modeTitle]),
    ...MOTIVES.map((motive) => motive.label),
    ...LEAGUES,
    ...RANKS,
    HOST,
    "0123456789",
    // The card with nothing to show, for the words it falls back to.
    ...draw(buildResultCardModel()).texts.map((entry) => entry.text),
  ]);
  // And every card as it is drawn and copied, so a string put together at
  // draw time (the score with its unit) is read too.
  for (const ending of ENDINGS) {
    for (const fingerprint of FINGERPRINTS) {
      for (const motive of MOTIVES) {
        const model = modelOf({ ending, fingerprint: { ...fingerprint, motive }, caseResults: { case01: { burstScore: 100, rank: "S", assistStory: true } } });
        for (const entry of draw(model).texts) strings.add(entry.text);
        strings.add(buildShareText(model, ORIGIN));
      }
    }
  }
  assert.ok(strings.size > 60);
  for (const text of strings) {
    const missing = [...text].filter((character) => !charset.has(character));
    assert.deepEqual(missing, [], `"${text}" has characters the font was not cut with`);
    // In the list and without a glyph: the wordmark's three (scripts/check-fonts.mjs).
    assert.doesNotMatch(text, /[臨界點]/);
  }
});

// ------------------------------------------------------------------ privacy

const FORBIDDEN = ["playerName", "sessionCode", "runId", "runTag", "nextParticipantMessage", "name", "nickname", "writerId", "cloudCode", "witnessRecords", "endingQuietLine"];

test("nothing that says who played reaches the card or the copied line", () => {
  const sentinels = Object.fromEntries(FORBIDDEN.map((key) => [key, `SENTINEL-${key}`]));
  const stuffed = { ...sentinels, witnessRecords: ["SENTINEL-witnessRecords"], player_name: "SENTINEL-player_name", run_id: "SENTINEL-run_id", session_code: "SENTINEL-session_code" };
  const ending = ENDINGS[0];
  const fingerprint = FINGERPRINTS[1];
  const model = buildResultCardModel({
    ...stuffed,
    fingerprint: { ...fingerprint, ...stuffed, motive: { ...fingerprint.motive, ...stuffed } },
    endingVariant: { ...ending, ...stuffed },
    endingName: ending.name,
    host: HOST,
    caseResults: {
      case01: { burstScore: 90, rank: "A", assistStory: true, ...stuffed },
      final: { burstScore: 70, rank: "B", reframeCount: 2, reflectionScore: 60, pressureAdaptScore: 20, ...stuffed },
    },
  });
  const out = [JSON.stringify(model), buildShareText(model, ORIGIN), ...draw(model).texts.map((entry) => entry.text)];
  assert.ok(out.length > 12);
  for (const text of out) assert.doesNotMatch(text, /SENTINEL/);
  // The card is the same card with or without them.
  assert.deepEqual(
    model,
    buildResultCardModel({ fingerprint, endingVariant: ending, endingName: ending.name, host: HOST, caseResults: { case01: { burstScore: 90, rank: "A", assistStory: true }, final: { burstScore: 70, rank: "B", reframeCount: 2, reflectionScore: 60, pressureAdaptScore: 20 } } }),
  );
  for (const key of FORBIDDEN) assert.equal(Object.hasOwn(model, key), false, `the model has no ${key}`);
});

test("the card's modules never mention a field that says who played", () => {
  const pattern = new RegExp(`\\b(${[...FORBIDDEN, "player_name", "run_id", "run_tag", "session_code"].join("|")})\\b`);
  // The one `.name` there is: how a rejected share says the player cancelled it.
  const ABORT_CHECK = 'error?.name === "AbortError"';
  // The buttons' file is in the list because it is handed the report screen's
  // whole view, and is where the card's four inputs are taken out of it.
  for (const file of ["resultCard.js", "resultCardModel.js", "resultCardCopy.js", "components/ResultCardShare.jsx"]) {
    const source = readFileSync(new URL(`../../src/${file}`, import.meta.url), "utf8");
    const read = file === "resultCard.js" ? source.replace(ABORT_CHECK, "") : source;
    if (file === "resultCard.js") assert.equal(source.split(ABORT_CHECK).length, 2, "the abort check is written once");
    const hit = read.split("\n").find((line) => pattern.test(line));
    assert.equal(hit, undefined, `${file}: ${hit}`);
  }
});

// ------------------------------------------------------------------ drawing

const longestOf = (values) => values.reduce((longest, value) => (value.length > longest.length ? value : longest), "");
const descent = (entry) => entry.size * 0.25;

function assertInsideCard(ctx, label) {
  const right = RESULT_CARD_WIDTH - RESULT_CARD_MARGIN;
  for (const entry of ctx.texts) {
    const where = `${label}: "${entry.text}"`;
    assert.ok(typeof entry.text === "string" && entry.text.length > 0, where);
    assert.ok(Number.isFinite(entry.maxWidth) && entry.maxWidth > 0, `${where} is drawn with a width limit`);
    assert.ok(Number.isFinite(entry.size) && entry.size >= 24, `${where} has a font size`);
    const [from, to] = entry.align === "right" ? [entry.x - entry.width, entry.x] : [entry.x, entry.x + entry.width];
    assert.ok(from >= RESULT_CARD_MARGIN - 0.01 && to <= right + 0.01, `${where} runs ${from}..${to}`);
    // The limit itself stays inside the margins too, whatever the face measures.
    const [limitFrom, limitTo] = entry.align === "right" ? [entry.x - entry.maxWidth, entry.x] : [entry.x, entry.x + entry.maxWidth];
    assert.ok(limitFrom >= RESULT_CARD_MARGIN - 0.01 && limitTo <= right + 0.01, `${where} may run ${limitFrom}..${limitTo}`);
    assert.ok(entry.y - entry.size >= RESULT_CARD_MARGIN, `${where} starts above the top margin`);
    assert.ok(entry.y <= RESULT_CARD_HEIGHT - RESULT_CARD_MARGIN, `${where} sits under the bottom margin`);
  }
  for (const rect of ctx.rects.slice(1)) {
    assert.ok(rect.x >= RESULT_CARD_MARGIN && rect.x + rect.width <= right + 0.01, `${label}: a rule or panel leaves the margins`);
    assert.ok(rect.y >= RESULT_CARD_MARGIN && rect.y + rect.height <= RESULT_CARD_HEIGHT - RESULT_CARD_MARGIN);
  }
}

/** The card's regions, read off what was drawn: the three panels and the rule over the footer. */
function regions(ctx) {
  const panels = ctx.rects.filter((rect) => rect.color === "panel" && rect.height > 2);
  const footerRule = ctx.rects.find((rect) => rect.color === "panel" && rect.height === 2);
  return { panels, cellsTop: panels[0].y, cellsBottom: panels[0].y + panels[0].height, footerRule };
}

test("the card is 1080 by 1350 and paints its ground first", () => {
  assert.deepEqual([RESULT_CARD_WIDTH, RESULT_CARD_HEIGHT, RESULT_CARD_MARGIN], [1080, 1350, 80]);
  const ctx = draw(modelOf());
  assert.deepEqual(ctx.rects[0], { x: 0, y: 0, width: 1080, height: 1350, color: "ground" });
  assert.equal(regions(ctx).panels.length, 3);
});

test("every line of every card is inside the margins, and nothing runs into the cells or the footer", () => {
  const caseResults = { case01: { burstScore: 100, rank: "S", assistStory: true }, final: { burstScore: 100, rank: "S", reframeCount: 5, reflectionScore: 90, pressureAdaptScore: 10 } };
  const longestMotive = longestOf(MOTIVES.map((motive) => motive.label));
  let cards = 0;
  // The second pass is a face a fifth wider than the game's, as a system
  // Hangul face can be when the font did not load.
  for (const options of [{}, { hangul: 1.1 }]) {
    for (const ending of ENDINGS) {
      for (const fingerprint of FINGERPRINTS) {
        const model = modelOf({ ending, fingerprint: { ...fingerprint, motive: { label: longestMotive } }, caseResults, host: HOST });
        const ctx = draw(model, options);
        const label = `${ending.id} / ${fingerprint.mode}`;
        assertInsideCard(ctx, label);
        const { panels, cellsTop, cellsBottom, footerRule } = regions(ctx);
        assert.equal(model.league, "REFRAME LEAGUE");
        const footer = ctx.texts.filter((entry) => entry.y > footerRule.y);
        assert.deepEqual(footer.map((entry) => entry.text), [HOST, RESULT_CARD_LABELS.byline]);
        assert.ok(footer[0].x + footer[0].width < footer[1].x - footer[1].width, `${label}: the host and the byline do not meet`);
        for (const entry of ctx.texts) {
          if (footer.includes(entry)) {
            assert.ok(entry.y - entry.size > footerRule.y, `${label}: the footer is under its rule`);
          } else if (entry.y > cellsTop) {
            const panel = panels.find((rect) => entry.x >= rect.x && entry.x <= rect.x + rect.width);
            assert.ok(panel, `${label}: "${entry.text}" is in a cell`);
            assert.ok(entry.x + entry.width <= panel.x + panel.width, `${label}: "${entry.text}" stays in its cell`);
            assert.ok(entry.y - entry.size >= cellsTop && entry.y + descent(entry) <= cellsBottom, `${label}: "${entry.text}" is inside the cell's height`);
          } else {
            assert.ok(entry.y + descent(entry) < cellsTop, `${label}: "${entry.text}" ends above the cells`);
          }
        }
        assert.ok(cellsBottom < footerRule.y);
        // No two lines share a place: within a column, baselines are a font size apart.
        const flow = ctx.texts.filter((entry) => entry.y < cellsTop && entry.align === "left" && entry.x === RESULT_CARD_MARGIN);
        flow.slice(1).forEach((entry, index) => assert.ok(entry.y - entry.size >= flow[index].y - 1 || entry.y === flow[index].y, `${label}: "${entry.text}" overlaps the line above`));
        cards += 1;
      }
    }
  }
  assert.equal(cards, 66);
});

test("the longest ending line is set on at most three lines, and the longest 판단 DNA on two", () => {
  const longestTitle = longestOf(ENDINGS.map((ending) => ending.title));
  const longestMode = longestOf(FINGERPRINTS.map((fingerprint) => fingerprint.modeTitle));
  const ending = ENDINGS.find((candidate) => candidate.title === longestTitle);
  const fingerprint = FINGERPRINTS.find((candidate) => candidate.modeTitle === longestMode);
  for (const options of [{}, { hangul: 1.1 }, { hangul: 1.6 }]) {
    const ctx = draw(modelOf({ ending, fingerprint }), options);
    const linesOf = (text) => {
      const words = text.split(" ");
      return ctx.texts.filter((entry) => entry.text.split(" ").every((word) => words.includes(word)) && entry.size >= 28 && entry.text !== ending.name);
    };
    const titleLines = linesOf(longestTitle);
    assert.ok(titleLines.length >= 1 && titleLines.length <= 3, `${titleLines.length} lines`);
    assert.equal(titleLines.map((entry) => entry.text).join(" "), longestTitle);
    const modeLines = linesOf(longestMode);
    assert.ok(modeLines.length >= 1 && modeLines.length <= 2, `${modeLines.length} lines`);
    assert.equal(modeLines.map((entry) => entry.text).join(" "), longestMode);
    assertInsideCard(ctx, `hangul ${options.hangul ?? 0.92}`);
  }
  // In the game's own face both are set at full size.
  const plain = draw(modelOf({ ending, fingerprint }));
  assert.equal(plain.texts.find((entry) => longestMode.startsWith(entry.text)).size, 76);
  assert.equal(plain.texts.find((entry) => longestTitle.startsWith(entry.text)).size, 40);
});

test("the collapse is drawn in the wall's colour and every other ending in the accent", () => {
  for (const ending of ENDINGS) {
    const ctx = draw(modelOf({ ending }));
    const colors = new Set([...ctx.texts.map((entry) => entry.color), ...ctx.rects.map((rect) => rect.color)]);
    assert.equal(colors.has("heat"), ending.id === "collapse", ending.id);
    assert.equal(colors.has("accent"), ending.id !== "collapse", ending.id);
    assert.equal(ctx.texts.find((entry) => entry.text === ending.label).color, ending.id === "collapse" ? "heat" : "accent");
  }
});

test("the card prints what was decided and nothing else", () => {
  const ending = ENDINGS.find((candidate) => candidate.id === "human-record");
  const fingerprint = { ...FINGERPRINTS[1], motive: MOTIVES[0] };
  const ctx = draw(modelOf({ ending, fingerprint, caseResults: { case09: { burstScore: 87, rank: "A" }, final: { burstScore: 60, rank: "B" } } }));
  const texts = ctx.texts.map((entry) => entry.text);
  for (const expected of [
    RESULT_CARD_LABELS.game, RESULT_CARD_LABELS.season, RESULT_CARD_LABELS.dna, "RE-FRAMER", MOTIVES[0].label, RESULT_CARD_LABELS.ending,
    ending.name, "HUMAN RECORD", RESULT_CARD_LABELS.burst, "87점", RESULT_CARD_LABELS.rank, "A", RESULT_CARD_LABELS.league, "FIELD", "LEAGUE", HOST, RESULT_CARD_LABELS.byline,
  ]) {
    assert.ok(texts.includes(expected), `"${expected}" is on the card`);
  }
  assert.equal(texts.filter((text) => fingerprint.modeTitle.includes(text)).join(" "), fingerprint.modeTitle);
  for (const entry of ctx.texts) assert.ok(entry.font.endsWith(THEME.fontFamily), "every line is set in the theme's family");
});

// -------------------------------------------------------------------- theme

function fakeStyleDocument(values) {
  const documentElement = {};
  return {
    documentElement,
    defaultView: {
      getComputedStyle(element) {
        assert.equal(element, documentElement);
        return { getPropertyValue: (token) => values[token] ?? "" };
      },
    },
  };
}

test("the theme is read off the page's tokens when the card is drawn", () => {
  const theme = readResultCardTheme(
    fakeStyleDocument({
      "--c-gx-felt": " rgb(8 14 13)",
      "--c-gx-felt-raised": "rgb(17 28 25)",
      "--c-paper": "rgb(255 255 255)",
      "--c-gx-text-dim": "rgb(163 180 174)",
      "--c-acid": "rgb(217 255 98)",
      "--c-gx-heat": "rgb(255 56 56)",
      "--font-sans": '\n    "Critical Point Sans", -apple-system,\n    "Malgun Gothic", sans-serif',
    }),
  );
  assert.deepEqual(theme, {
    ground: "rgb(8 14 13)",
    panel: "rgb(17 28 25)",
    text: "rgb(255 255 255)",
    dim: "rgb(163 180 174)",
    accent: "rgb(217 255 98)",
    heat: "rgb(255 56 56)",
    fontFamily: '"Critical Point Sans", -apple-system, "Malgun Gothic", sans-serif',
  });
  // The tokens the theme reads are tokens the stylesheet defines.
  const tokens = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8");
  for (const token of ["--c-gx-felt", "--c-gx-felt-raised", "--c-paper", "--c-gx-text-dim", "--c-acid", "--c-gx-heat", "--font-sans"]) {
    assert.match(tokens, new RegExp(`^\\s*${token}:`, "m"), token);
  }
  // A page that answers nothing still gives a legible card.
  for (const silent of [fakeStyleDocument({}), {}, undefined]) {
    assert.deepEqual(readResultCardTheme(silent), { ground: "black", panel: "black", text: "white", dim: "white", accent: "white", heat: "white", fontFamily: "sans-serif" });
  }
});

// --------------------------------------------------------------- the file

function fakeCanvasDocument({ fonts, blob = new Blob(["png"], { type: "image/png" }), context = fakeContext(), throwOnBlob = false } = {}) {
  const canvases = [];
  const documentRef = {
    ...fakeStyleDocument({ "--font-sans": '"Critical Point Sans", sans-serif', "--c-gx-felt": "rgb(8 14 13)" }),
    canvases,
    createElement(tag) {
      assert.equal(tag, "canvas");
      const canvas = {
        width: 300,
        height: 150,
        sizeAtDraw: null,
        getContext(kind) {
          assert.equal(kind, "2d");
          canvas.sizeAtDraw = [canvas.width, canvas.height];
          return context;
        },
        toBlob(callback, type) {
          assert.equal(type, "image/png");
          if (throwOnBlob) throw new Error("tainted");
          canvas.sizeAtBlob = [canvas.width, canvas.height];
          callback(blob);
        },
      };
      canvases.push(canvas);
      return canvas;
    },
  };
  if (fonts) documentRef.fonts = fonts;
  return documentRef;
}

test("the card comes out as a PNG file, drawn after the font was asked for, with the canvas let go", async () => {
  const asked = [];
  const context = fakeContext();
  const documentRef = fakeCanvasDocument({
    context,
    fonts: {
      load(font, text) {
        asked.push({ font, text, drawn: context.texts.length });
        return Promise.resolve([{}]);
      },
    },
  });
  const model = modelOf();
  const file = await renderResultCardFile(model, { document: documentRef });
  assert.ok(file instanceof File);
  assert.equal(file.name, "critical-point-result.png");
  assert.equal(file.name, RESULT_CARD_FILE_NAME);
  assert.equal(file.type, "image/png");
  assert.equal(await file.text(), "png");
  // Both weights, in the page's family, with the card's own characters, before a line was drawn.
  assert.deepEqual(asked.map((entry) => entry.font), ['500 40px "Critical Point Sans", sans-serif', '800 40px "Critical Point Sans", sans-serif']);
  for (const entry of asked) {
    assert.equal(entry.drawn, 0);
    for (const text of context.texts) for (const character of text.text) assert.ok(entry.text.includes(character), `the font was asked for "${character}"`);
  }
  assert.ok(context.texts.length > 12);
  assert.equal(context.rects[0].color, "rgb(8 14 13)");
  const [canvas] = documentRef.canvases;
  assert.deepEqual(canvas.sizeAtDraw, [1080, 1350]);
  assert.deepEqual(canvas.sizeAtBlob, [1080, 1350]);
  assert.equal(canvas.width, 0);
});

test("a font that will not load does not stop the card", async () => {
  const cases = {
    rejects: { load: () => Promise.reject(new Error("offline")) },
    "loads nothing": { load: () => Promise.resolve([]) },
    throws: { load: () => { throw new Error("no loader"); } },
    "never answers": { load: () => new Promise(() => {}) },
    "is not a loader": {},
    missing: undefined,
  };
  for (const [label, fonts] of Object.entries(cases)) {
    const context = fakeContext();
    const documentRef = fakeCanvasDocument({ fonts, context });
    const file = await renderResultCardFile(modelOf(), { document: documentRef, theme: THEME, fontWaitMs: 5 });
    assert.ok(file instanceof File, label);
    assert.ok(context.texts.length > 12, label);
    assert.ok(context.texts.every((entry) => entry.font.endsWith(THEME.fontFamily)), label);
    assert.equal(documentRef.canvases[0].width, 0, label);
  }
});

test("a browser that makes no picture gives no file, and the canvas is still let go", async () => {
  const noBlob = fakeCanvasDocument({ blob: null });
  assert.equal(await renderResultCardFile(modelOf(), { document: noBlob, theme: THEME }), null);
  assert.equal(noBlob.canvases[0].width, 0);

  const noContext = fakeCanvasDocument({ context: null });
  assert.equal(await renderResultCardFile(modelOf(), { document: noContext, theme: THEME }), null);
  assert.equal(noContext.canvases[0].width, 0);

  const thrown = fakeCanvasDocument({ throwOnBlob: true });
  assert.equal(await renderResultCardFile(modelOf(), { document: thrown, theme: THEME }), null);
  assert.equal(thrown.canvases[0].width, 0);

  const noCanvas = { createElement: () => { throw new Error("no canvas"); } };
  assert.equal(await renderResultCardFile(modelOf(), { document: noCanvas, theme: THEME }), null);
});

// ------------------------------------------------------------ share or save

const FILE = new File([new Blob(["png"])], RESULT_CARD_FILE_NAME, { type: "image/png" });
const TEXT = buildShareText(modelOf(), ORIGIN);

function fakePage({ canShare, share, copy = async () => true, createObjectURL } = {}) {
  const page = {
    shared: [],
    asked: [],
    copied: [],
    anchors: [],
    urls: { made: [], revoked: [] },
  };
  const navigatorRef = {};
  if (canShare !== undefined) {
    navigatorRef.canShare = (data) => {
      page.asked.push(data);
      return typeof canShare === "function" ? canShare(data) : canShare;
    };
  }
  if (share !== null) {
    navigatorRef.share = async (data) => {
      page.shared.push(data);
      return share?.(data);
    };
  }
  const body = { children: [], appendChild: (node) => body.children.push(node) };
  page.request = {
    file: FILE,
    text: TEXT,
    navigator: navigatorRef,
    document: {
      body,
      createElement(tag) {
        assert.equal(tag, "a");
        const anchor = {
          style: {},
          clicks: 0,
          removed: false,
          click() {
            // The link is in the page, pointing at the file, when it is pressed.
            assert.ok(body.children.includes(anchor));
            anchor.clicks += 1;
          },
          remove() {
            anchor.removed = true;
          },
        };
        page.anchors.push(anchor);
        return anchor;
      },
    },
    copyText: async (value) => {
      page.copied.push(value);
      return copy(value);
    },
    urls: {
      createObjectURL(file) {
        if (createObjectURL) return createObjectURL(file);
        page.urls.made.push(file);
        return "blob:card";
      },
      revokeObjectURL: (url) => page.urls.revoked.push(url),
    },
  };
  return page;
}

const abortError = () => Object.assign(new Error("Share canceled"), { name: "AbortError" });

function assertSaved(page) {
  assert.equal(page.anchors.length, 1);
  const [anchor] = page.anchors;
  assert.equal(anchor.clicks, 1);
  assert.equal(anchor.href, "blob:card");
  assert.equal(anchor.download, "critical-point-result.png");
  assert.equal(anchor.type, "image/png");
  assert.equal(anchor.style.display, "none");
  assert.deepEqual(page.urls.made, [FILE]);
  assert.deepEqual(page.copied, [TEXT]);
}

test("where the platform can share the file, the file and the line go to its sheet", async () => {
  const page = fakePage({ canShare: true });
  assert.equal(await shareOrSave(page.request), "shared");
  assert.deepEqual(page.asked, [{ files: [FILE] }]);
  assert.deepEqual(page.shared, [{ files: [FILE], text: TEXT }]);
  assert.equal(page.anchors.length, 0);
  assert.deepEqual(page.copied, []);
});

test("a sheet the player closed is cancelled, and nothing is saved behind their back", async () => {
  const page = fakePage({ canShare: true, share: () => { throw abortError(); } });
  assert.equal(await shareOrSave(page.request), "cancelled");
  assert.equal(page.shared.length, 1);
  assert.equal(page.anchors.length, 0);
  assert.deepEqual(page.copied, []);
  assert.deepEqual(page.urls.made, []);
});

test("a share that fails for another reason falls through to the download", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const reason of [new Error("NotAllowedError"), Object.assign(new Error("x"), { name: "DataError" }), undefined, "text"]) {
    const page = fakePage({ canShare: true, share: () => { throw reason; } });
    assert.equal(await shareOrSave(page.request), "saved");
    assert.equal(page.shared.length, 1);
    assertSaved(page);
  }
});

test("where the platform cannot share the file, it is downloaded and the line copied", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const cannot = {
    "no canShare": fakePage({}),
    "canShare says no": fakePage({ canShare: false }),
    "canShare throws": fakePage({ canShare: () => { throw new TypeError("files"); } }),
    "canShare without share": fakePage({ canShare: true, share: null }),
  };
  for (const [label, page] of Object.entries(cannot)) {
    assert.equal(await shareOrSave(page.request), "saved", label);
    assert.deepEqual(page.shared, [], label);
    assertSaved(page);
  }
  // The save button hands over no navigator at all.
  for (const navigatorRef of [undefined, null]) {
    const page = fakePage({ canShare: true });
    assert.equal(await shareOrSave({ ...page.request, navigator: navigatorRef }), "saved");
    assert.deepEqual(page.asked, []);
    assertSaved(page);
  }
});

test("the link is taken out and its address released a second after the press", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const page = fakePage({});
  assert.equal(await shareOrSave(page.request), "saved");
  assert.equal(page.anchors[0].removed, false);
  assert.deepEqual(page.urls.revoked, []);
  t.mock.timers.tick(1000);
  assert.equal(page.anchors[0].removed, true);
  assert.deepEqual(page.urls.revoked, ["blob:card"]);
});

test("a copy that was refused is said, and the file is still saved", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const copy of [async () => false, async () => { throw new Error("denied"); }, () => { throw new Error("sync"); }]) {
    const page = fakePage({ copy });
    assert.equal(await shareOrSave(page.request), "saved-uncopied");
    assertSaved(page);
  }
});

test("no file, or a download that cannot start, is a failure and nothing is copied", async () => {
  for (const file of [null, undefined]) {
    const page = fakePage({ canShare: true });
    assert.equal(await shareOrSave({ ...page.request, file }), "failed");
    assert.deepEqual([page.asked.length, page.shared.length, page.anchors.length, page.copied.length], [0, 0, 0, 0]);
  }
  const blocked = fakePage({ createObjectURL: () => { throw new Error("blocked"); } });
  assert.equal(await shareOrSave(blocked.request), "failed");
  assert.deepEqual(blocked.copied, []);
  // Every answer has something to announce, or deliberately nothing.
  for (const outcome of ["shared", "saved", "saved-uncopied", "cancelled", "failed"]) assert.equal(typeof RESULT_CARD_STATUS[outcome], "string");
});
