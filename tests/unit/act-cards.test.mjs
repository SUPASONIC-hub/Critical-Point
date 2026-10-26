import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { ACT_CARD_KEY, ACT_START_CASES, getActCard, markActCardShown, runOfSeed } = await import("../../src/gauntlet/actCardGate.js");
const { ACT_CARDS, casesLeft } = await import("../../src/gauntlet/actCardCopy.js");
const { CASE_SEQUENCE, CASE_START_NODES } = await import("../../src/gameCases.js");
const { nodes } = await import("../../src/gameData.js");
const { STORAGE_KEY } = await import("../../src/appConfig.js");
const { createCaseSummary } = await import("../../src/gameLogic.js");
const { RESET_STORAGE_KEYS } = await import("../../src/state/runStorageReset.js");

// The act title cards (improvement notes B-11(1), 2026-10-24).
const opening = (caseId) => ({ node: nodes[CASE_START_NODES[caseId]], nodeId: CASE_START_NODES[caseId] });

test("eight cards, one on each act's first case, with the act's cases and the count to the season's end", () => {
  assert.deepEqual(Object.keys(ACT_CARDS), [...ACT_START_CASES]);
  assert.deepEqual(ACT_START_CASES, ["case01", "case08", "case13", "case19", "case25", "case31", "case37", "case43"]);
  ACT_START_CASES.forEach((caseId, index) => {
    const card = ACT_CARDS[caseId];
    assert.equal(card.act, index + 1, caseId);
    // The span runs to the case before the next act, the last act to the season's end.
    const from = CASE_SEQUENCE.indexOf(caseId);
    const next = ACT_START_CASES[index + 1];
    const last = next ? CASE_SEQUENCE[CASE_SEQUENCE.indexOf(next) - 1] : CASE_SEQUENCE.at(-2);
    assert.ok(card.span.startsWith(`사건 ${caseId.slice(4)}~${last.slice(4)}`), `${caseId}: ${card.span}`);
    assert.ok(from > 0, `${caseId} is in the season`);
    assert.ok(card.name.length > 0 && card.name.length <= 8, `${caseId}: a short name`);
    // One sentence, short enough to read in the card's seven seconds.
    assert.equal(card.line.match(/[.?!]/g)?.length, 1, `${caseId}: one sentence`);
    assert.ok(card.line.length <= 60, `${caseId}: ${card.line.length} characters`);
  });
  assert.equal(ACT_CARDS.case43.span, "사건 43~49 · 마지막 사건");
  assert.deepEqual(ACT_START_CASES.map(casesLeft), [50, 43, 38, 32, 26, 20, 14, 8]);
});

test("a played run is shown an act's card once; a jump, a resumed bet and the other cases are not", () => {
  localStorage.clear();
  const runId = "run-a";
  const at = (caseId, extra = {}) => getActCard({ ...opening(caseId), windowIndex: 12, runId, ...extra });
  assert.equal(at("case08"), "case08");
  assert.equal(at("case08", { windowIndex: 0 }), null, "a debug jump or a replay link opens a fresh table");
  assert.equal(at("case08", { resumed: true }), null, "a table put down mid-bet comes back as it stood");
  assert.equal(at("case09"), null, "not an act's first case");
  const later = Object.keys(nodes).find((id) => nodes[id].caseId === "case08" && id !== CASE_START_NODES.case08 && nodes[id].kind !== "opening");
  assert.equal(getActCard({ node: nodes[later], nodeId: later, windowIndex: 12, runId }), null, "only the page the case opens on");
  const routed = Object.keys(nodes).find((id) => nodes[id].caseId === "case13" && nodes[id].kind === "opening");
  assert.equal(getActCard({ node: nodes[routed], nodeId: routed, windowIndex: 30, runId }), "case13", "the opening the case before routed to");

  markActCardShown(runId, "case08");
  assert.equal(at("case08"), null, "shown once in a run: a reload or a resume does not show it again");
  assert.equal(at("case13"), "case13");
  markActCardShown(runId, "case13");
  assert.deepEqual(JSON.parse(localStorage.getItem(ACT_CARD_KEY)), { run: runId, acts: ["case08", "case13"] });
  // A new season, or a run after 초기화, is a new run id: its acts are shown again.
  assert.equal(at("case08", { runId: "run-b" }), "case08");
  markActCardShown("run-b", "case01");
  assert.deepEqual(JSON.parse(localStorage.getItem(ACT_CARD_KEY)), { run: "run-b", acts: ["case01"] });
  localStorage.setItem(ACT_CARD_KEY, "{broken");
  assert.equal(at("case08"), "case08", "an unreadable record shows the card");
  assert.ok(!RESET_STORAGE_KEYS.includes(ACT_CARD_KEY), "a reset need not clear it: the next run has a new id");
  assert.equal(runOfSeed("3f2c-uuid:41:c8_start~1"), "3f2c-uuid");
});

test("display only: the save, the log and the case summary are the same bytes with the card shown", () => {
  localStorage.clear();
  const save = JSON.stringify({ runId: "run-a", currentCase: "case08", nodeId: CASE_START_NODES.case08, log: [] });
  localStorage.setItem(STORAGE_KEY, save);
  const log = Array.from({ length: 4 }, (_, index) => ({ caseId: "case07", nodeId: `n${index}`, choiceId: `c${index}`, responseTime: 9 + index, riskDelta: 1 }));
  const summary = () => JSON.stringify(createCaseSummary({ responsibility: 5 }, { persistence: 4 }, log, { resources: { trust: 50 } }));
  const before = summary();
  const written = [];
  const setItem = localStorage.setItem;
  localStorage.setItem = function spy(key, value) {
    written.push(key);
    return setItem.call(this, key, value);
  };
  assert.equal(getActCard({ ...opening("case08"), windowIndex: 40, runId: "run-a" }), "case08");
  markActCardShown("run-a", "case08");
  assert.equal(summary(), before);
  assert.equal(localStorage.getItem(STORAGE_KEY), save, "the save is not written");
  localStorage.setItem = setItem;
  assert.deepEqual(written, [ACT_CARD_KEY], "the card writes its own key and nothing else");
  // Storage that refuses: the card is shown, and marking it throws nothing.
  localStorage.unavailable = true;
  assert.equal(getActCard({ ...opening("case08"), windowIndex: 40, runId: "run-a" }), "case08");
  assert.doesNotThrow(() => markActCardShown("run-a", "case08"));
  localStorage.unavailable = false;
});

test("the card is its own chunk, in front of the draft and the briefing, and holds nothing", () => {
  const read = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), "utf8");
  const stage = read("gauntlet/GauntletStage.jsx");
  assert.match(stage, /const draftOpen = draftPending && !hidden && !act\.open;/);
  assert.match(stage, /const briefingOpen = !tableOpen && !hidden && !draftOpen && !act\.open && /);
  const fold = read("gauntlet/ActCardFold.jsx");
  assert.match(fold, /import\("\.\/ActCard\.jsx"\)/);
  for (const file of ["gauntlet/GauntletStage.jsx", "gauntlet/ActCardFold.jsx", "gauntlet/actCardGate.js"]) {
    assert.doesNotMatch(read(file), /^import .*(ActCard\.jsx|actCardCopy\.js)/m, `${file}: never a static import of the card or its copy`);
  }
  const card = read("gauntlet/ActCard.jsx");
  assert.match(card, /role="dialog"/);
  assert.match(card, /aria-describedby="gx-act-text"/);
  const css = read("styles/app/briefing.css");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.gx-act,\s*\.gx-act-page,\s*\.gx-act-go::after \{\s*animation: none;/);
});
