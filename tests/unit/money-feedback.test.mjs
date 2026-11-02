import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * The money, where the eye goes (money-feedback): the season's won and lost
 * columns and the last hand's change, as the engine keeps them, and the purse
 * and the slam's amount as the stage reads them (moneyFeedback.js). The flight
 * itself is drawn in the browser; here is what it flies with.
 */
globalThis.localStorage = createStorage();

const { normalizeRunState, openCaseRun, RUN_INITIAL_STATE, resolveWindow } = await import("../../src/gauntlet/gauntletEngine.js");
const { countAudit } = await import("../../src/gauntlet/auditRisk.js");
const { AUDIT_HEAT, AUDIT_LIMIT } = await import("../../src/gauntlet/weeklyRules.js");
const { formatChange, readBurst, readPurse, readSettledChange } = await import("../../src/gauntlet/moneyFeedback.js");

const card = { id: "a", label: "a", effect: { capital: 9 }, next: "x" };
const cash = (gauge, pushes = 2) => ({ status: "cashed", cause: "cash", gauge, wall: 95, pushes, seed: `money:${gauge}:${pushes}` });
const bust = (gauge) => ({ status: "bust", cause: "push", gauge, wall: gauge - 1, pushes: 4, seed: `money-bust:${gauge}` });
const held = (run) => run.runPot + run.vault;

/** Plays windows through the engine as the runtime does, closing the case on the last one. */
function playCase(run, windows, { close = true, open = true } = {}) {
  let current = open ? openCaseRun(run) : run;
  const log = [];
  const verdicts = [];
  windows.forEach((window, index) => {
    const caseClosed = close && index === windows.length - 1;
    const settled = resolveWindow({ run: current, window, card, caseClosed, audit: countAudit(log) });
    verdicts.push({ ...settled.verdict, before: current, after: settled.nextRun });
    current = settled.nextRun;
    log.push({ threshold: { busted: settled.verdict.outcome === "bust", gauge: settled.verdict.gauge, pushes: settled.verdict.pushes } });
  });
  return { run: current, verdicts };
}

test("a new season has counted nothing; a save from before the columns has won what it holds", () => {
  assert.deepEqual([RUN_INITIAL_STATE.lastChange, RUN_INITIAL_STATE.seasonGained, RUN_INITIAL_STATE.seasonLost], [0, 0, 0]);
  const fresh = normalizeRunState({});
  assert.deepEqual([fresh.lastChange, fresh.seasonGained, fresh.seasonLost], [0, 0, 0]);
  const older = normalizeRunState({ runPot: 300, vault: 4200 });
  assert.deepEqual([older.seasonGained, older.seasonLost], [4500, 0], "won at least what it holds, lost nothing anyone counted");
  const counted = normalizeRunState({ runPot: 300, vault: 4200, seasonGained: 9000, seasonLost: 4500, lastChange: -812.4 });
  assert.deepEqual([counted.seasonGained, counted.seasonLost, counted.lastChange], [9000, 4500, -812], "a counted save keeps its columns, the change signed");
  assert.deepEqual([normalizeRunState({ seasonGained: -5, seasonLost: -1 }).seasonGained, normalizeRunState({ seasonLost: -1 }).seasonLost], [0, 0]);
});

test("a cash counts its pot won; a bust counts the pot the wall took lost; the change is the hand's, signed", () => {
  const { run, verdicts } = playCase(RUN_INITIAL_STATE, [cash(40), cash(55), bust(70), cash(30)], { close: false });
  const [first, second, wall, after] = verdicts;
  assert.ok(first.pot > 0 && second.pot > 0);
  assert.equal(first.after.lastChange, first.pot);
  assert.equal(second.after.lastChange, second.pot);
  assert.equal(wall.after.lastChange, -(first.pot + second.pot), "the whole case pot, with no INSURANCE");
  assert.equal(after.after.lastChange, after.pot);
  assert.equal(run.seasonGained, first.pot + second.pot + after.pot);
  assert.equal(run.seasonLost, first.pot + second.pot);
  // What the season won less what it lost is what the run holds.
  for (const { after: state } of verdicts) assert.equal(state.seasonGained - state.seasonLost, held(state));
});

test("a close moves the pot to the vault and changes neither column; an audit that catches it counts what it took lost", () => {
  const plain = playCase(RUN_INITIAL_STATE, [cash(40), cash(50)]);
  assert.equal(plain.run.runPot, 0);
  assert.equal(plain.run.seasonGained, plain.run.vault);
  assert.equal(plain.run.seasonLost, 0);

  const cold = Array.from({ length: AUDIT_LIMIT }, () => cash(AUDIT_HEAT - 5));
  const caught = playCase(normalizeRunState({ weekRule: "audit" }), cold);
  const close = caught.verdicts.at(-1);
  assert.equal(close.audit.caught, true);
  assert.ok(close.audit.lost > 0);
  assert.equal(caught.run.seasonLost, close.audit.lost);
  assert.equal(close.after.lastChange, close.pot - close.audit.lost, "the hand's change is what reached the vault");
  assert.equal(caught.run.seasonGained - caught.run.seasonLost, held(caught.run));
});

test("a real case left with a pot counts it lost as the next one opens; a replay moves neither column", () => {
  const left = playCase(RUN_INITIAL_STATE, [cash(40), cash(50)], { close: false }).run;
  assert.ok(left.runPot > 0);
  const opened = openCaseRun(left);
  assert.equal(opened.runPot, 0);
  assert.equal(opened.seasonLost, left.runPot);
  assert.equal(opened.lastChange, 0, "a new case opens on no hand");
  assert.equal(opened.seasonGained - opened.seasonLost, held(opened));

  const closed = playCase(RUN_INITIAL_STATE, [cash(40)]).run;
  const replay = openCaseRun(closed, { replayOf: { pushRecord: null } });
  assert.ok(replay.practice);
  const played = playCase(replay, [cash(60), bust(80), cash(45)], { close: false, open: false });
  assert.deepEqual([played.run.seasonGained, played.run.seasonLost], [closed.seasonGained, closed.seasonLost]);
  assert.ok(played.verdicts.every((verdict) => verdict.after.lastChange !== 0), "a replay's hands are still shown");
  const back = openCaseRun(played.run);
  assert.deepEqual([back.seasonGained, back.seasonLost, back.vault], [closed.seasonGained, closed.seasonLost, closed.vault], "nor does leaving it");
});

test("a change is printed with its sign; a minus is the minus sign", () => {
  assert.equal(formatChange(12400), "+12,400");
  assert.equal(formatChange(-12400), "−12,400");
  assert.equal(formatChange(0), "0");
  assert.equal(formatChange(undefined), "0");
});

test("the purse: what the run holds, the last hand's change, and the season's columns", () => {
  const run = normalizeRunState({ runPot: 2400, vault: 10000, seasonGained: 15000, seasonLost: 2600, lastChange: -800 });
  const live = readPurse({ run, win: { status: "live" } });
  assert.equal(live.total, 12400);
  assert.equal(live.totalText, "12,400");
  assert.deepEqual([live.change.amount, live.change.dir, live.change.arrow, live.change.text], [-800, "down", "▼", "−800"]);
  assert.equal(live.change.spoken, "방금 판 −800", "the sign is read; the arrow is not");
  assert.equal(live.season.text, "시즌 누적 획득 +15,000 · 손실 −2,600");
  assert.equal(live.landing, null, "a live window lands nothing");
  assert.equal(readPurse({ run: normalizeRunState({}), win: { status: "live" } }).change, null, "no hand yet, no change");
  assert.equal(readPurse({ run: normalizeRunState({}), win: { status: "live" } }).season.text, "시즌 누적 획득 0 · 손실 0");
});

test("a closed window's purse is the run as the settle will leave it, counted once", () => {
  const run = normalizeRunState({ runPot: 2400, vault: 10000, seasonGained: 15000, seasonLost: 2600, lastChange: -800 });
  const cashed = readPurse({ run, win: { status: "cashed" }, settling: true, livePot: 3100, bustKeeps: 0 });
  assert.deepEqual([cashed.total, cashed.change.text, cashed.change.dir, cashed.landing], [15500, "+3,100", "up", "up"]);
  assert.deepEqual([cashed.season.gained, cashed.season.lost], [18100, 2600]);
  const busted = readPurse({ run, win: { status: "bust" }, settling: true, livePot: 0, bustKeeps: 800 });
  assert.deepEqual([busted.total, busted.change.text, busted.landing], [10800, "−1,600", "down"], "INSURANCE's third stays");
  assert.deepEqual([busted.season.gained, busted.season.lost], [15000, 4200]);
  // A window another tab settles, or a run the settle has already written, is not counted again.
  const notMine = readPurse({ run, win: { status: "cashed" }, settling: false, livePot: 3100 });
  assert.deepEqual([notMine.total, notMine.change.amount, notMine.landing], [12400, -800, null]);
  // A replay's hand is shown and kept out of the season.
  const replay = readPurse({ run: { ...run, practice: { vault: 10000 } }, win: { status: "cashed" }, settling: true, livePot: 3100 });
  assert.deepEqual([replay.change.amount, replay.season.gained], [3100, 15000]);
  // An empty pot that busts moves nothing.
  const empty = readPurse({ run: normalizeRunState({ vault: 500 }), win: { status: "bust" }, settling: true, bustKeeps: 0 });
  assert.deepEqual([empty.change, empty.landing], [null, null]);
});

test("the slam's amount: the cash's +N, the bust's −N, nothing for a hand that moved nothing", () => {
  assert.deepEqual(readBurst({ win: { status: "cashed" }, livePot: 12400 }), { amount: 12400, text: "+12,400", dir: "up" });
  assert.deepEqual(readBurst({ win: { status: "bust" }, runPot: 12400, bustKeeps: 0 }), { amount: -12400, text: "−12,400", dir: "down" });
  assert.equal(readBurst({ win: { status: "bust" }, runPot: 0, bustKeeps: 0 }), null);
  assert.equal(readBurst({ win: { status: "live" }, livePot: 500 }), null);
  assert.equal(readSettledChange({ win: { status: "bust" }, settling: true, runPot: 900, bustKeeps: 300 }), -600);
});

test("the purse is plain text, and the verdict is still said once, by the slam", () => {
  const stage = readFileSync(new URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  const notices = readFileSync(new URL("../../src/gauntlet/TableNotices.jsx", import.meta.url), "utf8");
  const burst = readFileSync(new URL("../../src/gauntlet/MoneyBurst.jsx", import.meta.url), "utf8");
  // The purse's markup is BankPurse's, beside the slam's amount; the screen only places it.
  assert.match(stage, /<BankPurse purseRef=\{purseRef\} /);
  const purse = burst.slice(burst.indexOf('className={`gx-purse'), burst.indexOf('data-testid="gauntlet-purse-season"'));
  assert.ok(purse.length > 0);
  assert.doesNotMatch(purse, /aria-live|role="(?:status|alert|log)"/, "no second voice in the rail");
  assert.match(purse, /<span aria-hidden="true">\{purse\.change\.arrow\} \{purse\.change\.text\}<\/span>\s*<span className="sr-only">\{purse\.change\.spoken\}<\/span>/);
  // The bust's −N is out of the alert, whose sentence says the pot; the cash's +N is in it, where the pill was.
  assert.match(notices, /<strong lang="en">BUST<\/strong>\s*<MoneyBurst burst=\{burst\} target=\{target\} spoken=\{false\} \/>/);
  assert.match(notices, /\{burst \? <MoneyBurst burst=\{burst\} target=\{target\} \/> : <span>\+\{formatNumber\(livePot\)\}<\/span>\}/);
  assert.doesNotMatch(burst, /aria-live|role=/);
  assert.match(notices, /const burst = target \? readBurst\(/, "the amount flies only where there is a purse");
});

test("the flight is still under reduced motion and the calm setting, and both colours carry a sign", () => {
  const css = readFileSync(new URL("../../src/styles/app/money.css", import.meta.url), "utf8");
  const still = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(still, /\.gx-burst,\s*\.gx-purse\.is-landing > strong \{\s*animation: none;/);
  const comfort = readFileSync(new URL("../../src/styles/app/comfort.css", import.meta.url), "utf8");
  assert.match(comfort, /:root\[data-calm-effects\] \.gauntlet-stage :not\(/, "the calm setting stops every animation on the stage, the slam's among them");
  const order = readFileSync(new URL("../../src/styles/app.css", import.meta.url), "utf8");
  assert.ok(order.indexOf("./app/money.css") < order.indexOf("./app/comfort.css"), "and comes after this file");
});
