import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { addAudit, AUDIT_RELIEF_HEAT, auditStep, countAudit, describeAuditLedger, findAudit, isAuditOn, judgeAudit, readAudit } from "../../src/gauntlet/auditRisk.js";
import { normalizeRunState, openCaseRun, resolveWindow } from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { HEAT_DEBT_GAUGE } from "../../src/gauntlet/tableRules.js";
import { DEV_WEEK_RULE, devWeekEntry } from "../../src/gauntlet/weeklyCalendar.js";
import { AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE, getWeekRule, isoWeekKey, pickSeasonWeekRule, WEEKLY_RULES, weekRuleHasDevice, weekRuleOverlay } from "../../src/gauntlet/weeklyRules.js";

const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
const cash = (gauge, pushes = 2) => ({ status: "cashed", cause: "cash", gauge, wall: 95, pushes, seed: `audit:${gauge}:${pushes}` });
const bust = (gauge) => ({ status: "bust", cause: "push", gauge, wall: gauge - 1, pushes: 4, seed: `audit-bust:${gauge}` });
const auditRun = (extra = {}) => normalizeRunState({ weekRule: "audit", ...extra });

/** Plays windows through the engine as the runtime does: the count off the log, the log gaining each verdict. */
function playCase(run, windows) {
  let current = openCaseRun(run);
  const log = [];
  let verdict = null;
  windows.forEach((window, index) => {
    const caseClosed = index === windows.length - 1;
    ({ verdict, nextRun: current } = resolveWindow({ run: current, window, card, caseClosed, audit: countAudit(log) }));
    log.push({ threshold: { busted: verdict.outcome === "bust", gauge: verdict.gauge, pushes: verdict.pushes } });
  });
  return { run: current, verdict, log };
}

test("the week's catalogue switches the audit on by name, from an allowlist of two", () => {
  assert.equal(weekRuleHasDevice("audit", "audit"), true);
  assert.equal(weekRuleHasDevice("audit", "cascade"), false, "cascade is allowed, but this rule does not name it");
  assert.equal(weekRuleHasDevice("near-wall", "audit"), false);
  assert.equal(weekRuleHasDevice(null, "audit"), false);
  assert.equal(weekRuleHasDevice("audit", "made-up"), false, "a device off the list is never on");
  assert.equal(weekRuleOverlay("audit", { wallMin: 60, wallMax: 80 }), null, "a device moves no number on the board");
  for (const value of [AUDIT_HEAT, AUDIT_LIMIT, AUDIT_SHARE]) assert.ok(getWeekRule("audit").text.includes(String(value)), `the line quotes ${value}`);
});

test("a cash pushed and closed cold adds one; a cash at HEAT DEBT takes two off; nothing else moves it", () => {
  assert.equal(auditStep({ gauge: AUDIT_HEAT - 1, pushes: 1 }), 1);
  assert.equal(auditStep({ gauge: AUDIT_HEAT, pushes: 1 }), 0);
  assert.equal(auditStep({ gauge: AUDIT_HEAT - 0.4, pushes: 1 }), 0, "rounded as the verdict rounds it");
  assert.equal(auditStep({ gauge: 12, pushes: 0 }), 0, "a cash with no push is COLD FEET's, not the audit's");
  assert.equal(auditStep({ gauge: HEAT_DEBT_GAUGE, pushes: 3 }), -AUDIT_RELIEF);
  assert.equal(auditStep({ gauge: 20, pushes: 3, busted: true }), 0, "a bust does not clear the audit");
  assert.equal(auditStep({ gauge: 90, pushes: 3, busted: true }), 0);
  assert.equal(addAudit(1, -AUDIT_RELIEF), 0, "never below zero");
  const log = [
    { threshold: { busted: false, gauge: 30, pushes: 1 } },
    { nodeId: "no window" },
    { threshold: { state: "bust", gauge: 20, pushes: 2 } },
    { threshold: { busted: false, gauge: 35, pushes: 2 } },
    { threshold: { busted: false, gauge: 64, pushes: 5 } },
    { threshold: { busted: false, gauge: 33, pushes: 1 } },
  ];
  assert.equal(countAudit(log), 1);
  assert.equal(countAudit([]), 0);
});

test("on only for a season stamped with the audit week, and never in story mode or practice", () => {
  assert.equal(isAuditOn(auditRun()), true);
  assert.equal(isAuditOn(normalizeRunState({})), false);
  assert.equal(isAuditOn(normalizeRunState({ weekRule: "near-wall" })), false);
  assert.equal(isAuditOn(normalizeRunState({ weekRule: "audit", story: true })), false);
  assert.equal(isAuditOn(openCaseRun(auditRun(), { replayOf: {} })), false, "a replayed case is practice");
  assert.equal(pickSeasonWeekRule(Date.now(), { story: true, calendar: [{ week: "x", id: "audit" }] }), null);
});

test("a case closed with the audit full loses one part in AUDIT_SHARE of what it moves, the hand's share too", () => {
  const cold = Array.from({ length: AUDIT_LIMIT }, () => cash(AUDIT_HEAT - 5));
  const caught = playCase(auditRun({ vault: 1000, handVault: 100 }), cold);
  const plain = playCase(normalizeRunState({ vault: 1000, handVault: 100 }), cold);
  assert.equal(caught.verdict.audit.count, AUDIT_LIMIT);
  assert.equal(caught.verdict.audit.caught, true);
  const moved = plain.verdict.secured;
  assert.ok(moved > 0);
  assert.equal(caught.verdict.audit.lost, Math.floor(moved / AUDIT_SHARE));
  assert.equal(caught.verdict.secured, moved - caught.verdict.audit.lost);
  assert.equal(caught.run.vault, 1000 + caught.verdict.secured, "only this case's share; the vault before it is untouched");
  assert.ok(caught.run.handVault <= caught.run.vault);
  assert.ok(caught.run.handVault <= plain.run.handVault);
  assert.equal(plain.verdict.audit, undefined, "a table without the audit says nothing of it");

  // One short of the limit, or relieved by a hot cash, is not caught.
  const short = playCase(auditRun(), cold.slice(1));
  assert.equal(short.verdict.audit.caught, false);
  assert.equal(short.verdict.audit.lost, 0);
  const relieved = playCase(auditRun(), [...cold.slice(1), cash(HEAT_DEBT_GAUGE + 2, 5)]);
  assert.equal(relieved.verdict.audit.count, AUDIT_LIMIT - 1 - AUDIT_RELIEF);
  assert.equal(relieved.verdict.audit.caught, false);
});

test("the audit is judged once, at the close, and the next case starts at zero", () => {
  const cold = Array.from({ length: AUDIT_LIMIT + 1 }, () => cash(AUDIT_HEAT - 5));
  let run = auditRun();
  let current = openCaseRun(run);
  const log = [];
  cold.slice(0, -1).forEach((window) => {
    const settled = resolveWindow({ run: current, window, card, audit: countAudit(log) });
    assert.equal(settled.verdict.audit.caught, false, "nothing is taken before the case closes");
    log.push({ threshold: { busted: false, gauge: settled.verdict.gauge, pushes: settled.verdict.pushes } });
    current = settled.nextRun;
  });
  run = playCase(auditRun(), cold).run;
  const next = playCase(run, [cash(AUDIT_HEAT - 5)]);
  assert.equal(next.verdict.audit.count, 1, "a fresh log, a fresh audit");
  assert.equal(next.verdict.audit.caught, false);
});

test("a bust closing the case keeps the audit as it stood and judges what the case still moves", () => {
  const windows = [...Array.from({ length: AUDIT_LIMIT }, () => cash(AUDIT_HEAT - 5)), bust(70)];
  const { verdict } = playCase(auditRun(), windows);
  assert.equal(verdict.audit.count, AUDIT_LIMIT);
  assert.equal(verdict.audit.caught, true);
  assert.equal(verdict.audit.lost, 0, "a bust moved nothing to lose a part of");
});

test("SCOUT, LOCK and the heartbeat are not read: the same heat and pushes, the same audit", () => {
  const base = cash(AUDIT_HEAT - 5);
  const looked = { ...base, scouted: true, focus: 80, focusMode: "steady", focusHits: 4, tellOffset: 12 };
  const plain = resolveWindow({ run: auditRun(), window: base, card, audit: 2 }).verdict.audit;
  const busy = resolveWindow({ run: auditRun(), window: looked, card, audit: 2 }).verdict.audit;
  assert.deepEqual(busy, plain);
});

test("the table reads where the audit stands and what a cash now would make it, never the wall", () => {
  const schema = auditRun().schema;
  const win = { gauge: 31, pushes: 1, focus: 0, focusMode: "strike", elapsed: 0, schema, wall: 33, tellOffset: 0, status: "live" };
  const reading = readTableMeters({ win, schema, selectedCard: null, run: auditRun(), audit: AUDIT_LIMIT - 1 }).audit;
  assert.equal(reading.count, AUDIT_LIMIT - 1);
  assert.equal(reading.ifCash, 1);
  assert.equal(reading.afterCash, AUDIT_LIMIT);
  assert.equal(reading.atRisk, true);
  assert.match(reading.spoken, /감사 \+1/);
  assert.deepEqual(readAudit(auditRun(), 2, { ...win, wall: 99 }), readAudit(auditRun(), 2, win), "the wall moves nothing");
  assert.equal(readTableMeters({ win, schema, selectedCard: null }).audit, null, "no run, no audit");
  assert.equal(readTableMeters({ win, schema, selectedCard: null, run: normalizeRunState({}), audit: 3 }).audit, null);
  assert.equal(readAudit(auditRun(), 0, { ...win, gauge: 70 }).afterCash, 0);
});

test("the voice says the audit once, as the next table opens on a count that moved", () => {
  const before = { windowIndex: 4, runPot: 10, vault: 0, audit: { count: 1, limit: AUDIT_LIMIT } };
  const moved = { windowIndex: 5, runPot: 20, vault: 0, audit: { count: 2, limit: AUDIT_LIMIT } };
  assert.match(findAudit(before, moved).text, new RegExp(`^감사 위험 2/${AUDIT_LIMIT}`));
  assert.equal(findAudit(before, { ...moved, audit: before.audit }), null, "the same count is not news");
  assert.equal(findAudit(before, { ...moved, windowIndex: 9 }), null, "a save loaded from elsewhere is not a move");
  assert.equal(findAudit(before, { ...moved, audit: null }), null, "a table without the audit says nothing");
  assert.equal(findAudit(null, moved), null);
});

test("judgeAudit cuts the vault's share and the hand's by the same part", () => {
  assert.deepEqual(judgeAudit({ count: AUDIT_LIMIT, secured: 1003, hand: 401 }), { caught: true, lost: Math.floor(1003 / AUDIT_SHARE), handLost: Math.floor(401 / AUDIT_SHARE) });
  assert.deepEqual(judgeAudit({ count: AUDIT_LIMIT - 1, secured: 1003, hand: 401 }), { caught: false, lost: 0, handLost: 0 });
});

test("the audit's own chunk imports nothing from the engine's: its relief heat is HEAT DEBT's, written twice and held equal", () => {
  assert.equal(AUDIT_RELIEF_HEAT, HEAT_DEBT_GAUGE);
  const source = readFileSync("src/gauntlet/auditRisk.js", "utf8");
  const imports = [...source.matchAll(/from "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["./weeklyRules.js"], "auditRisk.js imports only the week's numbers");
  assert.match(readFileSync("vite.config.js", "utf8"), /const AUDIT_RISK = "src\/gauntlet\/auditRisk\.js"/);
});

test("a development build plays an audit week on ?week=audit; a release and node never do", () => {
  const now = Date.parse("2026-10-20T12:00:00+09:00");
  const forced = devWeekEntry({ debugBuild: true, search: "?debug=1&week=audit", now });
  assert.deepEqual(forced, { week: isoWeekKey(now), id: "audit", added: "dev" });
  const calendar = [forced, ...WEEKLY_RULES];
  const stamp = pickSeasonWeekRule(now, { calendar });
  assert.equal(stamp, "audit");
  assert.equal(isAuditOn(normalizeRunState({ weekRule: stamp })), true, "the season it starts counts the audit");
  assert.equal(pickSeasonWeekRule(now, { calendar, declined: true }), null, "the start screen's box still turns it down");
  assert.equal(pickSeasonWeekRule(now, { calendar, story: true }), null, "and story mode never has it");
  assert.equal(pickSeasonWeekRule(now + 7 * 24 * 60 * 60 * 1000, { calendar }), null, "only this week");

  assert.equal(devWeekEntry({ debugBuild: false, search: "?week=audit", now }), null, "a release build has no switch");
  assert.equal(devWeekEntry({ debugBuild: true, search: "?debug=1", now }), null);
  assert.equal(devWeekEntry({ debugBuild: true, search: "?week=%3Cscript%3E", now }), null);
  assert.equal(pickSeasonWeekRule(now, { calendar: [devWeekEntry({ debugBuild: true, search: "?week=no-such-rule", now }), ...WEEKLY_RULES] }), null, "an id the catalogue lacks is no rule");

  assert.equal(DEV_WEEK_RULE, null, "node has no build constant and no switch");
  assert.ok(WEEKLY_RULES.every((entry) => entry.added !== "dev"));
  const calendarSource = readFileSync("src/gauntlet/weeklyCalendar.js", "utf8");
  assert.match(calendarSource, /DEV_WEEK_RULE =\s+typeof __CP_DEBUG_BUILD__ !== "undefined" && __CP_DEBUG_BUILD__\s+\?/, "the switch is behind the constant the bundler folds to false in a release");
  assert.match(readFileSync("src/telemetry.js", "utf8"), /telemetryEnabled = Boolean\(SUPABASE_URL && SUPABASE_ANON_KEY\) && !DEV_WEEK_RULE;/, "a forced week sends nothing to the server");
  assert.match(readFileSync("scripts/check-bundle-size.mjs", "utf8"), /'added:"dev"'\]/, "check:bundle fails a release that carries it");
});

test("the audit's numbers are set B, decided on 2026-10-20: 40 / 4 / -2 / one in four", () => {
  assert.deepEqual([AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE], [40, 4, 2, 4]);
});

test("the table record says, in one line under its sentence, how many marks the case closed with", () => {
  const caught = playCase(auditRun(), [cash(20), cash(25), cash(30), cash(35)]);
  assert.equal(caught.verdict.audit.caught, true);
  assert.equal(describeAuditLedger(caught.log, "audit"), `감사 ${AUDIT_LIMIT}/${AUDIT_LIMIT}칸으로 닫혔다. 적발.`);
  const clear = playCase(auditRun(), [cash(20), cash(70), cash(30)]);
  assert.equal(clear.verdict.audit.count, 1);
  assert.equal(describeAuditLedger(clear.log, "audit"), `감사 1/${AUDIT_LIMIT}칸으로 닫혔다.`, "the count the close judged, read off the same log");

  assert.equal(describeAuditLedger(caught.log, null), null, "a week without the audit has no line");
  assert.equal(describeAuditLedger(caught.log, "near-wall"), null);
  assert.equal(describeAuditLedger([], "audit"), null, "nor a case with no window");
  assert.equal(describeAuditLedger([{ nodeId: "intro" }], "audit"), null);
  const story = caught.log.map((entry) => ({ ...entry, assistStory: true }));
  assert.equal(describeAuditLedger(story, "audit"), null, "story mode counts nothing");
  const replay = caught.log.map((entry, index) => (index === caught.log.length - 1 ? { threshold: { ...entry.threshold, firstRecord: { busts: 0 } } } : entry));
  assert.equal(describeAuditLedger(replay, "audit"), null, "nor does a replayed case");

  const ledger = readFileSync("src/gauntlet/GauntletLedger.jsx", "utf8");
  assert.match(ledger, /describeAuditLedger\(log, summary\?\.weekRule\)/, "the record reads the case summary's week");
  assert.match(ledger, /<p className="pressure-ledger-note">\{audit \? `\$\{note\} \$\{audit\}` : note\}<\/p>/, "inside the sentence's paragraph, not a seventh cell");
  assert.equal((ledger.match(/<article>/g) ?? []).length, 6, "the grid keeps its six cells");
});
