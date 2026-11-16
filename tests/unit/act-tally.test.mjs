import assert from "node:assert/strict";
import { test } from "node:test";

import { ACT_TALLY_CASES, buildActTallyModel, buildActTallyShareText, describeNearLine, readLargestStake, tallyCaseLabel, toResultCardModel } from "../../src/actTally.js";
import { ACT_START_CASES } from "../../src/gauntlet/actCardGate.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { getEndingVariant, getSeasonStrain } from "../../src/gameLogic.js";
import { getJudgementHabit } from "../../src/judgementHabit.js";
import { nearestEnding } from "../../src/nearestEnding.js";
import { drawResultCard } from "../../src/resultCard.js";
import { RESULT_CARD_LABELS } from "../../src/resultCardModel.js";
import actTallyCopy from "../../src/copy/actTally.js";
import seasonEndCopy from "../../src/copy/seasonEnd.js";
import enScreens from "../../src/locales/en/screens/index.js";
import jaScreens from "../../src/locales/ja/screens/index.js";

/**
 * N1 막 끝 중간 결산 (owner's answer Q2 (1), 2026-11-12). Display only: what is
 * held here is where it appears, that it says what the finale's own functions
 * say of the same season, and that it changes nothing it is handed.
 */
const ORIGIN = "https://critical-point-wn6p.onrender.com";
const HOST = "critical-point-wn6p.onrender.com";

/** A closed case: its table record, the standing it closed on and its harm. */
function summary({ banked = 0, lost = 0, cashes = 2, busts = 0, pushes = 4, trust = 60, legitimacy = 60, capital = 80, harm = 0, burst = 40, rank = "B" } = {}) {
  return {
    burstScore: burst,
    rank,
    finalHumanCost: harm,
    finalResources: { time: 0, capital, trust, legitimacy, humanCost: harm, fatigue: 0 },
    pushRecord: { busts, cashes, bestMultiplier: 1.5, potBanked: banked, potLost: lost, pushes, bestLogic: 0, grooveBanked: 0 },
    logicRecord: { windows: cashes + busts, keeps: 0, breaks: 0, busts, best: 2 },
  };
}

function season(caseIds, make = () => summary()) {
  return {
    caseResults: Object.fromEntries(caseIds.map((caseId, index) => [caseId, make(caseId, index)])),
    discoveredClues: ["clue-1", "clue-2"],
    log: [],
    resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
  };
}
const upTo = (caseId) => CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(caseId));

test("the tally rides on the act cards after 프롤로그, 사건 18 and 사건 36, and on no other", () => {
  assert.deepEqual([...ACT_TALLY_CASES], ["case01", "case19", "case37"]);
  for (const caseId of ACT_TALLY_CASES) assert.ok(ACT_START_CASES.includes(caseId), `${caseId} opens an act`);
  assert.deepEqual(ACT_TALLY_CASES.map((caseId) => CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1]), ["prologue05", "case18", "case36"]);
  const played = season(upTo("case08"));
  for (const caseId of ACT_START_CASES.filter((id) => !ACT_TALLY_CASES.includes(id))) assert.equal(buildActTallyModel(caseId, played), null, caseId);
  assert.deepEqual(Object.keys(actTallyCopy.ends), [...ACT_TALLY_CASES]);
  assert.deepEqual(Object.keys(actTallyCopy.corners), [...ACT_TALLY_CASES]);
});

test("a season with no closed case, or a save that does not read, draws no tally", () => {
  assert.equal(buildActTallyModel("case19", {}), null);
  assert.equal(buildActTallyModel("case19", null), null);
  assert.equal(buildActTallyModel("case19", { caseResults: "broken" }), null);
  assert.equal(buildActTallyModel("case19", { caseResults: { case01: null } }), null);
  assert.equal(buildActTallyShareText(null, ORIGIN), "");
});

test("the nearest ending is the one the ruling gives the season so far, and the next is nearestEnding's", () => {
  const seasons = [
    season(upTo("case01")),
    season(upTo("case19"), (caseId, index) => summary({ trust: 80 + (index % 3), legitimacy: 55 })),
    season(upTo("case37"), () => summary({ legitimacy: 90, trust: 70 })),
    season(upTo("case37"), () => summary({ harm: 60, busts: 3, cashes: 0 })),
  ];
  const caseIds = ["case01", "case19", "case37", "case37"];
  seasons.forEach((played, index) => {
    const model = buildActTallyModel(caseIds[index], played);
    const input = { resources: played.resources, discoveredClues: played.discoveredClues, log: played.log, ...getSeasonStrain(played.caseResults) };
    const ruled = getEndingVariant(input);
    assert.equal(model.endingId, ruled.id);
    assert.equal(model.endingLabel, ruled.label);
    assert.equal(model.endingName, seasonEndCopy.names[ruled.id]);
    assert.equal(model.failure, ruled.failure === true);
    assert.equal(model.nearLine, describeNearLine(nearestEnding({ ...input, endingId: ruled.id })));
  });
  // A collapsing season says so in the wall's colour and names no next ending.
  const collapsed = buildActTallyModel("case37", seasons[3]);
  assert.equal(collapsed.endingId, "collapse");
  assert.equal(collapsed.failure, true);
  assert.equal(collapsed.nearLine, "");
});

test("the next ending's line uses the report's words for each gap", () => {
  assert.equal(describeNearLine(null), "");
  assert.equal(describeNearLine({ burn: true }), "");
  assert.equal(
    describeNearLine({ label: "OPEN OVERSIGHT", gaps: [{ key: "clues", value: 2 }, { key: "trust", value: 3 }] }),
    "한 걸음 옆: OPEN OVERSIGHT까지 단서 2개 모자람 · 믿음 3 모자람",
  );
  assert.equal(
    describeNearLine({ label: "FIELD PACT", gaps: [{ key: "pactGap", value: 4 }, { key: "trustOver", value: 1 }, { key: "unknown", value: 1 }] }),
    "한 걸음 옆: FIELD PACT까지 믿음이 공정함보다 4 더 높아야 함 · 믿음 1 넘침",
  );
});

test("the biggest pot is the case that banked or lost the most, kept winning a tie", () => {
  const caseResults = {
    prologue02: summary({ banked: 900 }),
    case04: summary({ banked: 4800, lost: 1200 }),
    case07: summary({ lost: 4800 }),
    case09: summary({ banked: 300, lost: 5200 }),
    final: summary({ banked: 99999 }),
  };
  assert.deepEqual(readLargestStake(caseResults), { caseId: "case09", pot: 5200, kept: false });
  delete caseResults.case09;
  assert.deepEqual(readLargestStake(caseResults), { caseId: "case04", pot: 4800, kept: true });
  assert.equal(readLargestStake({ case01: summary(), case02: "broken" }), null);
  assert.equal(readLargestStake(undefined), null);

  const model = buildActTallyModel("case19", { caseResults: { case04: summary({ banked: 4800 }), case09: summary({ lost: 5200 }) } });
  assert.equal(model.stakeLine, "5,200 · 사건 09에서 벽에 잃음");
  assert.equal(buildActTallyModel("case19", { caseResults: { case04: summary({ banked: 4800 }) } }).stakeLine, "4,800 · 사건 04에서 금고로");
  assert.equal(buildActTallyModel("case01", { caseResults: { prologue01: summary() } }).stakeLine, actTallyCopy.stakeNone);
  assert.equal(tallyCaseLabel("prologue03"), "프롤로그 3");
  assert.equal(tallyCaseLabel("case18"), "사건 18");
});

test("the judging type is the season's 판단 습관, and a season too short for one says it is not named yet", () => {
  const short = buildActTallyModel("case01", { caseResults: { prologue01: summary({ cashes: 1 }) } });
  assert.equal(short.habitTitle, actTallyCopy.habitPending);
  assert.equal(short.habitLine, "");
  const played = season(upTo("case19"));
  const habit = getJudgementHabit(played.caseResults);
  assert.ok(habit, "eighteen cases name a habit");
  const model = buildActTallyModel("case19", played);
  assert.equal(model.habitTitle, habit.title);
  assert.equal(model.habitLine, habit.line);
  assert.match(model.habitCard, new RegExp(habit.title));
});

test("it changes nothing it is handed", () => {
  const played = season(upTo("case37"), (caseId, index) => summary({ banked: index * 10, trust: 70 }));
  const before = structuredClone(played);
  buildActTallyModel("case37", played);
  toResultCardModel(buildActTallyModel("case37", played), HOST);
  assert.deepEqual(played, before);
});

test("the picture is the finale's card with 가까운 결말, the act in its corner and the biggest pot beside the 논리 유지력", () => {
  const played = season(upTo("case19"), (caseId, index) => summary({ banked: 100 * index, burst: 30 + index, rank: index === 5 ? "A" : "B" }));
  const model = buildActTallyModel("case19", { ...played, playerName: "SENTINEL-PLAYER" });
  const card = toResultCardModel(model, HOST);
  assert.equal(card.endingHeading, "가까운 결말");
  assert.equal(card.season, "ACT 3 · MIDSEASON");
  assert.equal(card.vaultLine, "가장 큰 판돈 2,200");
  assert.equal(card.modeTitle, model.habitTitle);
  assert.equal(card.endingName, model.endingName);
  assert.equal(card.endingTitle, model.nearLine);
  assert.equal(card.host, HOST);
  assert.equal(card.bestBurst, 52);
  assert.ok(!JSON.stringify(card).includes("SENTINEL"), "nothing that says who played");
  const texts = [];
  const ctx = {
    font: "", fillStyle: "", strokeStyle: "", textAlign: "left", textBaseline: "", lineWidth: 1,
    measureText: (text) => ({ width: String(text).length * 20 }),
    fillText: (text) => texts.push(text),
    fillRect() {},
    strokeRect() {},
  };
  drawResultCard(ctx, card, { ground: "g", panel: "p", text: "t", dim: "d", accent: "a", heat: "h", fontFamily: "sans-serif" });
  assert.ok(texts.includes("가까운 결말"));
  assert.ok(!texts.includes(RESULT_CARD_LABELS.ending));
  assert.ok(texts.includes("ACT 3 · MIDSEASON"));
  assert.ok(texts.includes("가장 큰 판돈 2,200"));
  // No pot moved: no line beside the 논리 유지력.
  assert.equal(toResultCardModel(buildActTallyModel("case19", season(upTo("case19"))), HOST).vaultLine, "");
});

test("the copied line names the act, the type and the ending, and ends at the site", () => {
  const model = buildActTallyModel("case37", season(upTo("case37")));
  const text = buildActTallyShareText(model, `${ORIGIN}/`);
  assert.equal(text, `트리거랩 시즌을 6막 끝 · 사건 36까지 왔습니다. 판단 유형은 '${model.habitTitle}', 가까운 결말은 '${model.endingName}'. ${ORIGIN}/`);
  assert.ok(!buildActTallyShareText(model).includes("http"));
});

test("English and Japanese say every line the Korean does, with the same blanks", () => {
  const blanks = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  const walk = (ko, other, path) => {
    for (const [key, value] of Object.entries(ko)) {
      // A line with no Korean in it (the picture's corner) is the same in every language, and is not laid over.
      if (!/[가-힣]/.test(JSON.stringify(value))) continue;
      assert.ok(Object.hasOwn(other, key), `${path}.${key}`);
      if (typeof value === "object") walk(value, other[key], `${path}.${key}`);
      else assert.deepEqual(blanks(other[key]), blanks(value), `${path}.${key}`);
    }
  };
  walk(actTallyCopy, enScreens.actTally, "en");
  walk(actTallyCopy, jaScreens.actTally, "ja");
  // The makers speak as 우리 (we).
  assert.match(actTallyCopy.note, /우리/);
  assert.match(enScreens.actTally.note, /\bwe\b/);
  assert.match(jaScreens.actTally.note, /私たち/);
});
