import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { addAudit, AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_RELIEF_HEAT, AUDIT_SHARE, auditStep, CASES_BEFORE_AUDIT, countAudit, describeAuditLedger, findAudit, isAuditOn, judgeAudit, readAudit } from "../../src/gauntlet/auditRisk.js";
import { isLinkDue } from "../../src/gauntlet/cascadeRisk.js";
import { normalizeRunState, openCaseRun, resolveWindow } from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { HEAT_DEBT_GAUGE } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, introFor, rulesFor, STORY_RULES, UNLOCK_LADDER } from "../../src/gauntlet/tableUnlocks.js";
import { DEV_WEEK_RULE, devWeekEntry } from "../../src/gauntlet/weeklyCalendar.js";
import { getWeekRule, isoWeekKey, pickSeasonWeekRule, WEEK_RULE_DEVICES, WEEKLY_RULES, weekRuleHasDevice } from "../../src/gauntlet/weeklyRules.js";

const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
const cash = (gauge, pushes = 2) => ({ status: "cashed", cause: "cash", gauge, wall: 95, pushes, seed: `audit:${gauge}:${pushes}` });
const bust = (gauge) => ({ status: "bust", cause: "push", gauge, wall: gauge - 1, pushes: 4, seed: `audit-bust:${gauge}` });
const auditRun = (extra = {}) => normalizeRunState({ ...extra });
/** Every rule of the table, and the same less the audit or less the links. */
const without = (rule) => new Set([...ALL_RULES].filter((id) => id !== rule));
const NO_AUDIT = without("audit");
const NO_LINKS = without("cascade");

/** Plays windows through the engine as the runtime does: the count off the log, the log gaining each verdict. */
function playCase(run, windows, rules = ALL_RULES) {
  let current = openCaseRun(run, { rules });
  const log = [];
  let verdict = null;
  windows.forEach((window, index) => {
    const caseClosed = index === windows.length - 1;
    ({ verdict, nextRun: current } = resolveWindow({ run: current, window, card, caseClosed, rules, audit: countAudit(log) }));
    log.push({ threshold: { busted: verdict.outcome === "bust", gauge: verdict.gauge, pushes: verdict.pushes } });
  });
  return { run: current, verdict, log };
}

test("the audit is a rule of the table from 프롤로그 04 (RULES_MARK 3), and no week switches it any more", () => {
  assert.deepEqual(WEEK_RULE_DEVICES, [], "the week's devices are empty; the frame stays");
  assert.equal(weekRuleHasDevice("audit-cascade", "audit"), false, "W44's stamp switches nothing now");
  assert.equal(getWeekRule("audit"), null, "the audit week is gone from the catalogue");
  const opens = UNLOCK_LADDER.find((step) => step.adds.includes("audit"));
  assert.equal(opens.caseId, "prologue04", "it opens with FRACTURE");
  for (const step of UNLOCK_LADDER) assert.equal(step.rules.has("audit"), !CASES_BEFORE_AUDIT.includes(step.caseId), `${step.caseId}: the record's list is the ladder's`);
  assert.ok(rulesFor("case01").has("audit"));
  assert.ok(rulesFor("prologue01", { veteran: true }).has("audit"), "NEW GAME+ has it from the first case");
  assert.equal(STORY_RULES.has("audit"), false, "story mode never has it");
  assert.equal(rulesFor("prologue04", { story: true }).has("audit"), false);
  assert.ok(introFor("prologue04").some((text) => text.includes("감사")), "프롤로그 04 says it opens");
  assert.equal(introFor("prologue04", { story: true }).some((text) => text.includes("감사")), false, "a story run is not told it");
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

test("on in a case whose rules have it, and never in story mode or practice", () => {
  assert.equal(isAuditOn(auditRun(), ALL_RULES), true);
  assert.equal(isAuditOn(auditRun(), NO_AUDIT), false);
  assert.equal(isAuditOn(auditRun(), rulesFor("prologue03")), false);
  assert.equal(isAuditOn(auditRun(), undefined), false, "no rules, no audit");
  assert.equal(isAuditOn(normalizeRunState({ weekRule: "audit-cascade" }), NO_AUDIT), false, "W44's stamp does not switch it on");
  assert.equal(isAuditOn(normalizeRunState({ story: true }), ALL_RULES), false);
  assert.equal(isAuditOn(openCaseRun(auditRun(), { replayOf: {} }), ALL_RULES), false, "a replayed case is practice");
});

test("a case closed with the audit full loses one part in AUDIT_SHARE of what it moves, the hand's share too", () => {
  const cold = Array.from({ length: AUDIT_LIMIT }, () => cash(AUDIT_HEAT - 5));
  const caught = playCase(auditRun({ vault: 1000, handVault: 100 }), cold);
  const plain = playCase(normalizeRunState({ vault: 1000, handVault: 100 }), cold, NO_AUDIT);
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
  assert.equal(readTableMeters({ win, schema, selectedCard: null, audit: 2 }).audit, null, "no run, no audit");
  // A case whose rules do not count it is handed no count (useRunReadout asks isAuditOn).
  assert.equal(readTableMeters({ win, schema, selectedCard: null, run: normalizeRunState({}) }).audit, null, "no count, no audit");
  assert.equal(readAudit(auditRun(), 0, { ...win, gauge: 70 }).afterCash, 0);
  const runtime = readFileSync("src/state/useRunReadout.js", "utf8");
  assert.match(runtime, /isAuditOn\(gauntletRun, caseRules\) \? countAudit\(log\) : null/, "the runtime counts it only in a case whose rules have it");
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
  assert.deepEqual(imports, [], "auditRisk.js imports nothing: tableRules.js became a chunk of its own when it did (2026-10-21)");
  assert.match(readFileSync("vite.config.js", "utf8"), /const AUDIT_RISK = "src\/gauntlet\/auditRisk\.js"/);
});

test("a development build's ?week= plays a week of the catalogue; ?week=audit is no rule now; a release and node never switch", () => {
  const now = Date.parse("2026-10-20T12:00:00+09:00");
  const forced = devWeekEntry({ debugBuild: true, search: "?debug=1&week=near-wall", now });
  assert.deepEqual(forced, { week: isoWeekKey(now), id: "near-wall", added: "dev" });
  const calendar = [forced, ...WEEKLY_RULES];
  assert.equal(pickSeasonWeekRule(now, { calendar }), "near-wall");
  assert.equal(pickSeasonWeekRule(now, { calendar, declined: true }), null, "the start screen's box still turns it down");
  assert.equal(pickSeasonWeekRule(now, { calendar, story: true }), null, "and story mode never has it");
  assert.equal(pickSeasonWeekRule(now + 7 * 24 * 60 * 60 * 1000, { calendar: [forced] }), null, "only this week");
  const gone = devWeekEntry({ debugBuild: true, search: "?debug=1&week=audit", now });
  assert.equal(pickSeasonWeekRule(now, { calendar: [gone, ...WEEKLY_RULES] }), null, "the audit week left the catalogue with RULES_MARK 3");

  assert.equal(devWeekEntry({ debugBuild: false, search: "?week=near-wall", now }), null, "a release build has no switch");
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

test("the audit's numbers are set B, decided on 2026-10-20 and played in 2026-W44: 40 / 4 / -2 / one in four", () => {
  assert.deepEqual([AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE], [40, 4, 2, 4]);
});

test("the table record says, in one line under its sentence, how many marks the case closed with", () => {
  const caught = playCase(auditRun(), [cash(20), cash(25), cash(30), cash(35)]);
  assert.equal(caught.verdict.audit.caught, true);
  const marked = { tableRules: 3, weekRule: null };
  assert.equal(describeAuditLedger(caught.log, marked, "case01"), `감사 ${AUDIT_LIMIT}/${AUDIT_LIMIT}칸으로 닫혔다. 적발.`);
  const clear = playCase(auditRun(), [cash(20), cash(70), cash(30)]);
  assert.equal(clear.verdict.audit.count, 1);
  assert.equal(describeAuditLedger(clear.log, marked, "prologue04"), `감사 1/${AUDIT_LIMIT}칸으로 닫혔다.`, "the count the close judged, read off the same log");

  assert.equal(describeAuditLedger(caught.log, marked, "prologue03"), null, "a case before the audit's step has no line");
  assert.equal(describeAuditLedger(caught.log, marked, null), `감사 ${AUDIT_LIMIT}/${AUDIT_LIMIT}칸으로 닫혔다. 적발.`, "a case the ladder does not name is a whole table's");
  // A case closed before RULES_MARK 3 says nothing, W44's too: the record is the case on the table.
  assert.equal(describeAuditLedger(caught.log, { tableRules: 2, weekRule: "audit-cascade" }, "case01"), null, "a case of the table before");
  assert.equal(describeAuditLedger(caught.log, { tableRules: "3" }, "case01"), `감사 ${AUDIT_LIMIT}/${AUDIT_LIMIT}칸으로 닫혔다. 적발.`, "read as the server reads it, a number");
  assert.equal(describeAuditLedger(caught.log, null, "case01"), null, "no summary, no mark");
  assert.equal(describeAuditLedger([], marked, "case01"), null, "nor a case with no window");
  assert.equal(describeAuditLedger([{ nodeId: "intro" }], marked, "case01"), null);
  const story = caught.log.map((entry) => ({ ...entry, assistStory: true }));
  assert.equal(describeAuditLedger(story, marked, "case01"), null, "story mode counts nothing");
  const replay = caught.log.map((entry, index) => (index === caught.log.length - 1 ? { threshold: { ...entry.threshold, firstRecord: { busts: 0 } } } : entry));
  assert.equal(describeAuditLedger(replay, marked, "case01"), null, "nor does a replayed case");

  const ledger = readFileSync("src/gauntlet/GauntletLedger.jsx", "utf8");
  assert.match(ledger, /describeAuditLedger\(log, summary, caseId\)/, "the record reads the case summary's mark and week, and the case");
  assert.match(ledger, /<p className="pressure-ledger-note">\{audit \? `\$\{note\} \$\{audit\}` : note\}<\/p>/, "inside the sentence's paragraph, not a seventh cell");
  assert.equal((ledger.match(/<article>/g) ?? []).length, 6, "the grid keeps its six cells");
});

// B2 decision 10 (user, 2026-10-19): a cash on a CASCADE board is not counted.
// The log's way: a window's board was dealt by the window before it.
const bothRun = (extra = {}) => normalizeRunState({ ...extra });
const onCascade = (run) => normalizeRunState({ ...run, schema: { ...run.schema, mutations: [...run.schema.mutations, "cascade"] } });

/** Plays windows as the runtime does, `cascadeAt` the indexes whose board CASCADE deals; the log keeps each `environmentMode`. */
function playLinked(run, windows, cascadeAt = [], rules = ALL_RULES) {
  let current = openCaseRun(run, { rules });
  const log = [];
  let verdict = null;
  windows.forEach((window, index) => {
    const caseClosed = index === windows.length - 1;
    const audit = countAudit(log);
    ({ verdict, nextRun: current } = resolveWindow({ run: current, window, card, caseClosed, rules, audit, cascade: cascadeAt.includes(index + 1) }));
    log.push({ threshold: { busted: verdict.outcome === "bust", gauge: verdict.gauge, pushes: verdict.pushes }, environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable" });
    assert.equal(countAudit(log), verdict.audit?.count ?? 0, `the log and the engine agree after window ${index}`);
  });
  return { run: current, verdict, log };
}

test("a cash on a CASCADE board adds nothing to the audit; its relief stays", () => {
  assert.equal(auditStep({ gauge: AUDIT_HEAT - 10, pushes: 2, cascade: true }), 0);
  assert.equal(auditStep({ gauge: HEAT_DEBT_GAUGE, pushes: 2, cascade: true }), -AUDIT_RELIEF, "relief is no penalty");
  assert.equal(auditStep({ gauge: 20, pushes: 2, busted: true, cascade: true }), 0);

  // The engine reads the board on the table.
  const cold = cash(AUDIT_HEAT - 10);
  assert.equal(resolveWindow({ run: bothRun(), window: cold, card, audit: 2 }).verdict.audit.count, 3, "a plain board counts it");
  assert.equal(resolveWindow({ run: onCascade(bothRun()), window: cold, card, audit: 2 }).verdict.audit.count, 2, "a CASCADE board does not");
  assert.equal(resolveWindow({ run: onCascade(bothRun()), window: cash(HEAT_DEBT_GAUGE + 2, 4), card, audit: 3 }).verdict.audit.count, 3 - AUDIT_RELIEF);
  const closing = resolveWindow({ run: onCascade(openCaseRun(bothRun())), window: cold, card, caseClosed: true, audit: AUDIT_LIMIT - 1 }).verdict.audit;
  assert.equal(closing.caught, false, "a CASCADE close one short of the limit is not caught");

  // The 확정 button's preview says 0 there.
  const win = { gauge: 31, pushes: 1 };
  const reading = readAudit(onCascade(bothRun()), 2, win);
  assert.equal(reading.ifCash, 0);
  assert.equal(reading.afterCash, 2);
  assert.equal(reading.spoken, `지금 확정해도 감사 2/${AUDIT_LIMIT} 그대로`);
  assert.equal(readAudit(bothRun(), 2, win).ifCash, 1);
  assert.equal(reading.spoken, `지금 확정해도 감사 2/${AUDIT_LIMIT} 그대로`, "the 확정 button says it there");
  assert.match(getWeekRule("audit-cascade").text, /CASCADE 판의 확정은 감사에 세지 않는다\.$/, "as 2026-W44's did");
});

test("the log counts a window by the board the window before it dealt: the engine, the HUD and the ledger agree", () => {
  const cold = (gauge) => cash(gauge);
  // Board 0 is REBOOT's, boards 2 and 3 are CASCADE's: four cold cashes, two counted.
  const linked = playLinked(bothRun(), [cold(20), cold(25), cold(30), cold(35)], [2, 3]);
  assert.equal(linked.verdict.audit.count, 2);
  assert.equal(linked.verdict.audit.caught, false, "without the exemption this close was caught");
  assert.equal(describeAuditLedger(linked.log, { tableRules: 3 }, "case01"), `감사 2/${AUDIT_LIMIT}칸으로 닫혔다.`);
  const plain = playLinked(bothRun(), [cold(20), cold(25), cold(30), cold(35)]);
  assert.equal(plain.verdict.audit.count, AUDIT_LIMIT, "a plain board still counts");
  assert.equal(plain.verdict.audit.caught, true);

  // Board 0 always counts: nothing before it in the log, and REBOOT carries no CASCADE.
  assert.equal(countAudit([{ threshold: { gauge: 30, pushes: 1 }, environmentMode: "cascade" }]), 1);
  // A link carried in is due from board 1: the REBOOT board's window deals it.
  assert.equal(countAudit([
    { threshold: { gauge: 30, pushes: 1 }, environmentMode: "cascade" },
    { nodeId: "no window" },
    { threshold: { gauge: 30, pushes: 1 }, environmentMode: "fracture" },
    { threshold: { gauge: 30, pushes: 1 }, environmentMode: "stable" },
  ]), 2, "board 1 is exempt, the entry with no window passes nothing on, board 2 counts");
  // What dealt the CASCADE board decides, not the window's own entry.
  assert.equal(countAudit([
    { threshold: { gauge: 70, pushes: 3 }, environmentMode: "blackout+cascade" },
    { threshold: { gauge: 30, pushes: 1 }, environmentMode: "cascade" },
  ]), 0);
});

test("a table with the audit and without the links deals no CASCADE, so it counts every cash", () => {
  const heavy = { id: "h", label: "h", effect: { capital: 9, trust: -12 }, next: "x" };
  const entry = (index) => ({ nodeId: `n${index}`, choiceId: "h", riskRewardEffect: heavy.effect, threshold: { gauge: 30, pushes: 1 }, environmentMode: "stable" });
  const log = Array.from({ length: 6 }, (_, index) => entry(index));
  const dues = (rules) => log.map((_, index) => isLinkDue(normalizeRunState({}), log.slice(0, index + 1), "run-x", rules));
  assert.ok(dues(ALL_RULES).includes(true), "with both, a heavy card's link comes due");
  assert.ok(dues(NO_LINKS).every((due) => due === false), "with the audit alone, never");
  const alone = playLinked(auditRun(), [cash(20), cash(25), cash(30), cash(35)], [], NO_LINKS);
  assert.equal(alone.verdict.audit.count, AUDIT_LIMIT);
  assert.equal(alone.verdict.audit.caught, true);
});
