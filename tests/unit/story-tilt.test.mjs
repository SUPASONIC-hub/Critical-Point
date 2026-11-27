import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createWindow, getTableSchema, openCaseRun, TELL_ERROR } from "../../src/gauntlet/gauntletEngine.js";
import { readAudit, settleAudit } from "../../src/gauntlet/auditRisk.js";
import { withMarkNine } from "../../src/gauntlet/nextTableRules.js";
import { getStoryTilt, listStoryTilt, readStoryTilt, TILT_AUDIT, TILT_CLOCK, TILT_TELL, TILT_THIRDS } from "../../src/gauntlet/storyTilt.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";

// G31 (RULES_MARK 9): what a case opens on tilts its boards.
const NEUTRAL = { fatigue: 18, time: 68, legitimacy: 52 };
const open = (resources, extra = {}) => openCaseRun(extra, { caseId: "case05", resources });

test("the thirds: each end moves the table, the middle does not", () => {
  assert.equal(readStoryTilt(NEUTRAL), null);
  assert.equal(readStoryTilt(null), null);
  assert.equal(readStoryTilt({ fatigue: "", time: null }), null);
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, fatigue: TILT_THIRDS.fatigue.high }), { fatigue: "high", tellError: TILT_TELL.high });
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, fatigue: TILT_THIRDS.fatigue.low }), { fatigue: "low", tellError: TILT_TELL.low });
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, time: TILT_THIRDS.time.low }), { time: "low", clock: -TILT_CLOCK });
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, time: TILT_THIRDS.time.high }), { time: "high", clock: TILT_CLOCK });
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, legitimacy: TILT_THIRDS.legitimacy.low }), { legitimacy: "low", audit: -TILT_AUDIT });
  assert.deepEqual(readStoryTilt({ ...NEUTRAL, legitimacy: TILT_THIRDS.legitimacy.high }), { legitimacy: "high", audit: TILT_AUDIT });
});

test("the board: the heartbeat's error and the clock, from the case's opening only", () => {
  const plain = getTableSchema(open(NEUTRAL));
  const tired = getTableSchema(open({ ...NEUTRAL, fatigue: 30, time: 60 }));
  assert.equal(plain.tellError, undefined);
  assert.equal(tired.tellError, TILT_TELL.high);
  assert.equal(tired.seconds, plain.seconds - TILT_CLOCK);
  const tiredRun = open({ ...NEUTRAL, fatigue: 30 });
  assert.equal(getTableSchema(tiredRun), getTableSchema(tiredRun), "one board object per tilt");
  // The window's lie is drawn on the same seed, scaled to the board's error.
  for (const seed of ["a", "b", "c", "d"]) {
    const base = createWindow({ schema: plain, seed }).tellOffset;
    const far = createWindow({ schema: tired, seed }).tellOffset;
    assert.ok(Math.abs(far) <= TILT_TELL.high && Math.abs(base) <= TELL_ERROR);
    assert.ok(Math.sign(far) === Math.sign(base) || far === 0 || base === 0, seed);
  }
  // A record replayed keeps its board's error (normalizeSchema).
  assert.equal(createWindow({ schema: JSON.parse(JSON.stringify(tired)), seed: "a" }).tellOffset, createWindow({ schema: tired, seed: "a" }).tellOffset);
  assert.equal(getTableSchema(open({ ...NEUTRAL, fatigue: 30 }, { story: true })).tellError, undefined, "never in story mode");
});

test("the audit's limit moves with 정당성, under RULES_MARK 9 only", () => {
  const low = open({ ...NEUTRAL, legitimacy: 40 });
  const high = open({ ...NEUTRAL, legitimacy: 60 });
  const nine = withMarkNine(ALL_RULES, true);
  const eight = withMarkNine(ALL_RULES, false);
  assert.equal(getStoryTilt(low, nine).audit, -TILT_AUDIT);
  assert.equal(getStoryTilt(high, nine).audit, TILT_AUDIT);
  assert.equal(getStoryTilt(low, eight), null, "a row of 8 is judged at the old limit");
  const win = { gauge: 50, pushes: 1 };
  assert.equal(readAudit(low, 0, win, -TILT_AUDIT).limit, readAudit(low, 0, win).limit - TILT_AUDIT);
  const settle = (tilt) => settleAudit({ run: low, rules: nine, count: 2, busted: false, gauge: 30, pushes: 1, closed: true, secured: 1000, hand: 0, tilt });
  assert.equal(settle(-TILT_AUDIT).caught, true, "a limit of 3 catches a count of 3");
  assert.equal(settle(0).caught, false);
  // The engine hands the case's tilt to the audit it settles (resolveWindow).
  const engine = readFileSync(new URL("../../src/gauntlet/gauntletEngine.js", import.meta.url), "utf8");
  assert.ok(engine.includes("tilt: getStoryTilt(current, rules)?.audit ?? 0, smooth: isMarkNineOn(rules) })"));
  // G35's smooth ledger (RULES_MARK 9) takes the same tilt on its limit, read and judged.
  const smooth = (tilt) => settleAudit({ run: low, rules: nine, count: [50, 50, 50, 50], busted: false, gauge: 50, pushes: 1, closed: true, secured: 1000, hand: 0, smooth: true, tilt });
  assert.equal(smooth(0).caught, smooth(0).level >= readAudit(low, [50, 50, 50, 50], win).limit);
  assert.equal(readAudit(low, [50, 50], win, -TILT_AUDIT).limit, readAudit(low, [50, 50], win).limit - TILT_AUDIT);
  assert.ok(smooth(-TILT_AUDIT).caught || !smooth(0).caught);
});

test("the briefing's line: one entry a tilt, on the case's first page only", () => {
  const run = open({ fatigue: 30, time: 72, legitimacy: 40 });
  assert.deepEqual(listStoryTilt(run).map(([key]) => key), ["fatigueHigh", "timeHigh", "legitimacyLow"]);
  assert.deepEqual(listStoryTilt(run)[0][1], { value: 30, error: TILT_TELL.high });
  assert.deepEqual(listStoryTilt({ ...run, windowIndex: run.windowIndex + 1 }), []);
  assert.deepEqual(listStoryTilt(open(NEUTRAL)), []);
  // On the scene the case opened on only (the route the open stamped).
  const routed = openCaseRun({}, { caseId: "case05", resources: { fatigue: 30, time: 68, legitimacy: 52 }, route: { nodeId: "c5_start" } });
  assert.equal(listStoryTilt(routed, "c5_start").length, 1);
  assert.deepEqual(listStoryTilt(routed, "c5_other"), []);
  assert.deepEqual(listStoryTilt(run, "c5_start"), [], "a debug jump stamps no route");
});
