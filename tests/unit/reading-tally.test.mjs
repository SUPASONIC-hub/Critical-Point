import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
globalThis.sessionStorage = createStorage();

const { clearReadingTally, median, noteBriefing, noteRevealDetails, READING_TALLY_KEY, takeReadingTally } = await import("../../src/state/readingTally.js");
const { validateTelemetryItem } = await import("../../src/state/payloadSchemas.js");
const { createRunSummary, RUN_INITIAL_STATE } = await import("../../src/gauntlet/gauntletEngine.js");
const { RELIC_IDS } = await import("../../src/gauntlet/relics.js");
const { clearRunStorage } = await import("../../src/state/runStorageReset.js");

const KEYS = ["readBriefings", "readAutoOpened", "readHeld", "readSecMedian", "revealDetailsOpened"];
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

beforeEach(() => {
  globalThis.sessionStorage = createStorage();
});

test("a case's reading: pages, the ones the clock opened, the held ones, the median seconds, 자세히 (D-11 + E-4(b))", () => {
  noteBriefing({ caseId: "case01", seconds: 12.34, byClock: false, held: false });
  noteBriefing({ caseId: "case01", seconds: 30, byClock: true, held: false });
  noteBriefing({ caseId: "case01", seconds: 8, byClock: false, held: true });
  noteRevealDetails();
  noteRevealDetails();
  assert.deepEqual(takeReadingTally(), { readBriefings: 3, readAutoOpened: 1, readHeld: 1, readSecMedian: 12.3, revealDetailsOpened: 2 });
  assert.equal(globalThis.sessionStorage.getItem(READING_TALLY_KEY), null, "taken, the tally is emptied for the next case");
  assert.deepEqual(takeReadingTally(), { readBriefings: 0, readAutoOpened: 0, readHeld: 0, readSecMedian: null, revealDetailsOpened: 0 });
});

test("the median of an even count is the mean of the middle two; none of nothing", () => {
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([7]), 7);
  assert.equal(median([]), null);
  assert.equal(median([0.1, 0.2]), 0.2, "rounded to a tenth");
});

test("a page of another case starts over: what was left is a case that never closed", () => {
  noteBriefing({ caseId: "case01", seconds: 50, byClock: true, held: true });
  noteRevealDetails();
  noteBriefing({ caseId: "case02", seconds: 5 });
  assert.deepEqual(takeReadingTally(), { readBriefings: 1, readAutoOpened: 0, readHeld: 0, readSecMedian: 5, revealDetailsOpened: 0 });
});

test("a reload keeps what the case read; a stored tally that is not one reads as empty; no storage counts nothing and throws nothing", () => {
  noteBriefing({ caseId: "case03", seconds: 9 });
  const stored = globalThis.sessionStorage.getItem(READING_TALLY_KEY);
  globalThis.sessionStorage = createStorage({ [READING_TALLY_KEY]: stored });
  noteBriefing({ caseId: "case03", seconds: 11 });
  assert.equal(takeReadingTally().readBriefings, 2);

  for (const junk of ["not json", "[]", JSON.stringify({ seconds: ["x", -1, 4], auto: -3, held: 1.5, details: "2" })]) {
    globalThis.sessionStorage = createStorage({ [READING_TALLY_KEY]: junk });
    const tally = takeReadingTally();
    assert.ok(KEYS.every((key) => key in tally), junk);
    assert.equal(tally.readAutoOpened, 0);
  }
  globalThis.sessionStorage = createStorage({ [READING_TALLY_KEY]: JSON.stringify({ seconds: ["x", -1, 4] }) });
  assert.equal(takeReadingTally().readSecMedian, 4, "only the seconds that are seconds");

  const refusing = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); }, removeItem: () => { throw new Error("denied"); } };
  globalThis.sessionStorage = refusing;
  assert.doesNotThrow(() => noteBriefing({ caseId: "case03", seconds: 4 }));
  assert.doesNotThrow(() => noteRevealDetails());
  assert.doesNotThrow(() => clearReadingTally());
  assert.equal(takeReadingTally().readBriefings, 0);
  delete globalThis.sessionStorage;
  assert.equal(takeReadingTally().readBriefings, 0, "no sessionStorage at all");
});

test("the pages kept for the median are bounded, so the row stays inside the server's 2,048 bytes of dynamics", () => {
  for (let page = 0; page < 200; page += 1) noteBriefing({ caseId: "case09", seconds: 999.9, byClock: true, held: true });
  for (let open = 0; open < 9999; open += 1) noteRevealDetails();
  const reading = takeReadingTally();
  assert.equal(reading.readBriefings, 64);
  assert.equal(reading.readAutoOpened, 200);
  const dynamics = { ...createRunSummary({ ...RUN_INITIAL_STATE, relics: [...RELIC_IDS] }), responseTimeSec: 7.4, ...reading };
  const bytes = Buffer.byteLength(JSON.stringify(dynamics));
  assert.ok(bytes <= 2048, `dynamics is ${bytes} bytes`);
  // The case row's other caps are untouched: the tally adds nothing to the decision log (8,192 bytes an entry) or the summary.
  const item = { type: "case", payload: { event_id: "e", case_id: "case09", summary: {}, decision_log: [], dynamics } };
  assert.deepEqual(validateTelemetryItem(item), [], "numbers only: the privacy check passes the row");
});

test("the case row carries the tally in dynamics, the stage and the reveal add to it, a new season and a reset clear it", () => {
  const commit = read("src/state/useChoiceCommit.js");
  assert.match(commit, /dynamics: \{ \.\.\.createRunSummary\(nextRun\), responseTimeSec, \.\.\.reading \}/);
  assert.match(commit, /const reading = takeReadingTally\(\);/);
  assert.match(read("src/gauntlet/GauntletStage.jsx"), /noteBriefing\(\{ caseId: scene\.node\.caseId, byClock, \.\.\.readingRef\.current \}\)/);
  assert.match(read("src/gauntlet/SceneBriefing.jsx"), /if \(heldRef\.current\) readingRef\.current\?\.\(0, true\);/);
  assert.match(read("src/components/DecisionReveal.jsx"), /if \(detailsOpen\) noteRevealDetails\(\);/);
  assert.match(read("src/state/runLifecycle.js"), /clearReadingTally\(\);/);

  noteBriefing({ caseId: "case04", seconds: 3 });
  clearRunStorage();
  assert.equal(globalThis.sessionStorage.getItem(READING_TALLY_KEY), null, "초기화 clears it");
});
