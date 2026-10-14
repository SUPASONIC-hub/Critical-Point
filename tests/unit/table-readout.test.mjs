import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { resourceMeta } from "../../src/appCopy.js";
import {
  BASE_SCHEMA, buildNextSchema, FRACTURE_MIN_BURN, HOT_CASH_MULTIPLIER, RUN_INITIAL_STATE,
} from "../../src/gauntlet/gauntletEngine.js";
import { describeCaseChange, describeEffect, describeStanding, formatMultiplier, joinRules, useTableForecast } from "../../src/gauntlet/tableReadout.js";
import { getAuthorityGate } from "../../src/gameLogic.js";
import { initialResources } from "../../src/gameConstants.js";
import { easyResourceLabels } from "../../src/playerLanguage.js";
import { HEAT_DEBT_GAUGE, INSURANCE_SHARE } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";

/**
 * What the table prints beside the cards: the multiplier, a card's effect as a
 * list, and the forecast of the rules the next table would be dealt under.
 *
 * The streak's lines, the clock's calls, the two tab notices and the reveal's
 * cause are held where their rules are (logic-streak, table-controls,
 * table-verdict). This file holds what was left: the forecast is a hook, so it
 * is read through one render of a component that does nothing else.
 */

/** A case the whole table is open in, and two of the ladder's earlier steps. */
const FULL_TABLE = "final";
const NO_RULES_YET = "prologue01";
const BEFORE_OVERCLOCK = "prologue03";

const QUIET_WINDOW = { gauge: 10, pushes: 0, focus: 0, focusHits: 0, focusMode: null };

function forecast(props = {}) {
  let read;
  const Probe = () => {
    read = useTableForecast({
      schema: BASE_SCHEMA, run: RUN_INITIAL_STATE, win: QUIET_WINDOW, selectedCard: null, multiplier: 1, caseId: FULL_TABLE, offered: [], ...props,
    });
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  return read;
}

const ids = (mutations) => mutations.map((mutation) => mutation.id);
const run = (extra) => ({ ...RUN_INITIAL_STATE, ...extra });
/** The board the engine deals after a bust, or after the cash that closed a case. */
const nextSchema = (extra) => buildNextSchema({ outcome: "bust", cause: "push", gauge: BASE_SCHEMA.wallMin, pushes: 1, streak: 0, burnAxis: null, caseClosed: false, relics: [], windowIndex: 1, rules: ALL_RULES, ...extra });

test("a multiplier of ten or more prints whole and still rounds down", () => {
  assert.equal(formatMultiplier(9.99), "×9.9", "the last tenth under ten is not rounded up into two digits");
  assert.equal(formatMultiplier(10), "×10");
  assert.equal(formatMultiplier(10.9), "×10");
  assert.equal(formatMultiplier(63.99), "×63", "HIGH ROLLER's feat asks for x64, and a x63.99 has not reached it");
  assert.equal(formatMultiplier(64), "×64");
  for (let tenths = 10; tenths < 100; tenths += 1) {
    assert.equal(formatMultiplier(tenths / 10), `×${(tenths / 10).toFixed(1)}`, `x${tenths / 10} is printed as itself, not a tenth lower`);
  }
});

test("a multiplier that is not a number prints as zero rather than NaN", () => {
  for (const value of [undefined, null, "", "abc", Number.NaN]) {
    assert.equal(formatMultiplier(value), "×0.0", `${String(value)} prints as zero`);
  }
  assert.equal(formatMultiplier("3.95"), "×3.9", "a multiplier read back as text is still rounded down");
});

test("a card's effect is listed largest first, without the resources it does not move", () => {
  const rows = describeEffect({ trust: 3, capital: -12, legitimacy: 0, time: "-5" }, resourceMeta);
  assert.deepEqual(rows.map((row) => row.key), ["capital", "time", "trust"], "by size, whatever order the author typed them in");
  assert.deepEqual(rows.map((row) => row.value), [-12, -5, 3], "and a value written as text is a number in the list");
  assert.deepEqual(rows.map((row) => row.label), [resourceMeta.capital.label, resourceMeta.time.label, resourceMeta.trust.label]);
});

test("an effect is marked by whether it was good for the run, never by its sign", () => {
  const byKey = Object.fromEntries(describeEffect({ humanCost: -4, fatigue: 3, capital: -2, trust: 1 }, resourceMeta).map((row) => [row.key, row.gain]));
  assert.deepEqual(byKey, { humanCost: true, fatigue: false, capital: false, trust: true }, "a cost that falls is a gain, a cost that rises is not");
});

test("an effect on a resource the table has no name for is listed under its key", () => {
  assert.deepEqual(describeEffect({ rumour: 2 }, resourceMeta), [{ key: "rumour", value: 2, label: "rumour", gain: true }]);
  assert.deepEqual(describeEffect({ trust: 2 }), [{ key: "trust", value: 2, label: "trust", gain: true }], "and so is every one of them with no names handed over");
  assert.deepEqual(describeEffect(), [], "a card with no effect lists nothing");
});

test("the folded briefing's line names all six resources and the clues held, in the table's own order", () => {
  const line = describeStanding(initialResources, resourceMeta, 2);
  assert.equal(line, "남은 시간 72시간 · 현금 100 · 믿음 50 · 공정함 50 · 사람 피해 0 · 지침 10 · 단서 2개");
  assert.deepEqual(
    line.split(" · ").slice(0, -1).map((part) => part.replace(/ -?\d+\D*$/, "")),
    Object.values(resourceMeta).map((meta) => meta.label),
    "one part a resource, under the name every other screen gives it",
  );
});

test("the line prints the numbers a locked card's sentence quotes", () => {
  const resources = { ...initialResources, trust: 41, legitimacy: 63 };
  const line = describeStanding(resources, resourceMeta, 1);
  const field = getAuthorityGate({ requiredAuthority: "FIELD ACCESS" }, { clueCount: 1, trust: 41, legitimacy: 63 });
  const oversight = getAuthorityGate({ requiredAuthority: "OVERSIGHT" }, { clueCount: 1, trust: 41, legitimacy: 63 });
  assert.equal(field.unlocked, false, "the card is locked, so its reason is the sentence with the numbers");
  assert.match(field.reason, /지금 믿음 41, 단서 1개\./);
  assert.match(oversight.reason, /지금 단서 1개, 공정함 63\./);
  for (const part of ["믿음 41", "공정함 63", "단서 1개"]) assert.ok(line.split(" · ").includes(part), `the line holds "${part}"`);
});

test("a run with a number missing prints 0 for it rather than a gap", () => {
  assert.equal(describeStanding({ trust: 12 }, { trust: { label: "믿음", suffix: "" }, time: { label: "남은 시간", suffix: "시간" } }), "믿음 12 · 남은 시간 0시간 · 단서 0개");
  assert.equal(describeStanding(undefined, { trust: { label: "믿음" } }, undefined), "믿음 0 · 단서 0개", "a name with no suffix prints none");
  assert.equal(describeStanding(), "단서 0개", "with no names handed over only the clues are counted");
});

test("the case's change reads the first decision's start and the last decision's end", () => {
  const log = [
    { resourcesBefore: { ...initialResources }, resourcesAfter: { ...initialResources, trust: 58, humanCost: 6 } },
    { resourcesBefore: { ...initialResources, trust: 58, humanCost: 6 }, resourcesAfter: { ...initialResources, trust: 44, humanCost: 11, fatigue: 4 } },
  ];
  const rows = describeCaseChange(log, easyResourceLabels);
  assert.deepEqual(rows.map((row) => row.key), Object.keys(easyResourceLabels), "all six, in the order the labels are written");
  assert.deepEqual(rows.map((row) => row.text), ["남은 시간 72 → 72", "현금 100 → 100", "믿음 50 → 44", "공정함 50 → 50", "사람 피해 0 → 11", "지침 10 → 4"]);
});

test("a change is marked by whether it was good for the run, and a value that did not move by neither", () => {
  const log = [{ resourcesBefore: { ...initialResources }, resourcesAfter: { ...initialResources, trust: 44, capital: 120, humanCost: 11, fatigue: 4 } }];
  const gain = Object.fromEntries(describeCaseChange(log, easyResourceLabels).map((row) => [row.key, row.gain]));
  assert.deepEqual(gain, { time: null, capital: true, trust: false, legitimacy: null, humanCost: false, fatigue: true }, "사람 피해 rising is a loss, 지침 falling is a gain");
});

test("an entry that holds no numbers is passed over for the nearest one that does", () => {
  const log = [
    { isSystemEvent: true, resourcesBefore: {}, resourcesAfter: {} },
    { resourcesBefore: { trust: 50 }, resourcesAfter: { trust: 55 } },
    { resourcesBefore: { trust: 55 }, resourcesAfter: { trust: 61 } },
    { resourcesBefore: {}, resourcesAfter: {} },
    null,
  ];
  assert.deepEqual(describeCaseChange(log, easyResourceLabels), [{ key: "trust", text: "믿음 50 → 61", gain: true }], "and a resource neither end names is left out, not printed as 0");
});

test("a log with no numbers lists no change at all", () => {
  assert.deepEqual(describeCaseChange([], easyResourceLabels), []);
  assert.deepEqual(describeCaseChange(undefined, easyResourceLabels), []);
  assert.deepEqual(describeCaseChange([{ resourcesBefore: {}, resourcesAfter: {} }], easyResourceLabels), [], "a replayed link's entries carry none");
  assert.deepEqual(describeCaseChange([{ resourcesBefore: { trust: 50 } }], easyResourceLabels), [], "one end alone is not a change");
  assert.deepEqual(describeCaseChange([{ resourcesBefore: { trust: 50 }, resourcesAfter: { trust: "61" } }], easyResourceLabels), [], "a value that is not a number is not printed");
  assert.deepEqual(describeCaseChange([{ resourcesBefore: { trust: 50 }, resourcesAfter: { trust: 61 } }]), [], "and with no names handed over nothing is listed");
});

test("a list of rules is read by its labels, and an empty one says the table is on its base rules", () => {
  assert.equal(joinRules([]), "기본 규칙");
  assert.equal(joinRules([{ id: "blackout", label: "BLACKOUT" }, { id: "aftershock", label: "AFTERSHOCK" }]), "BLACKOUT / AFTERSHOCK");
});

test("a table on its base rules reports no heat, no rule to lift and a dormant chain", () => {
  const read = forecast();
  assert.deepEqual(read.mutations, []);
  assert.deepEqual(read.tableRules, []);
  assert.equal(read.ruleHeat, 0);
  assert.equal(read.currentRules, "규칙 안정");
  assert.match(read.ruleObjective, /^규칙 안정/);
  assert.equal(read.overdrive.label, "DORMANT");
  assert.equal(read.fractureAxis, null);
  assert.equal(read.bustKeeps, 0, "a bust leaves nothing of the case pot without INSURANCE");
  assert.equal(read.runTension, 0);
});

test("the forecast is dealt under the rules of the case on the table", () => {
  const first = forecast({ caseId: NO_RULES_YET });
  assert.equal(first.rules.size, 0, "the first step plays under no rule");
  assert.equal(first.logic, null, "so it has no streak to show");
  assert.deepEqual([first.cashMutations, first.bustMutations], [[], []], "and neither a cash nor a bust there is told a rule is coming");

  const full = forecast();
  assert.deepEqual([...full.rules].sort(), [...ALL_RULES].sort());
  assert.ok(full.logic, "the streak is read once the case has the rule");
  assert.ok(full.cashMutations.length > 0 && full.bustMutations.length > 0, "and both forecasts name what the next table would carry");
});

test("a case that has the streak rule still shows none for a run that holds no streak", () => {
  assert.equal(forecast({ run: run({ logic: undefined }) }).logic, null);
  assert.equal(forecast({ run: null }).logic, null, "nor for no run at all");
});

test("the streak in the forecast is the one with the staked card played", () => {
  const inference = { id: "a", label: "a", effect: { capital: 2 }, cognition: { inference: 2 }, next: "x" };
  const bare = forecast({ offered: ["inference"] });
  const staked = forecast({ offered: ["inference"], selectedCard: inference });
  assert.deepEqual([bare.logic.move, bare.logic.type], [null, null], "nothing staked, nothing moved");
  assert.deepEqual([staked.logic.move, staked.logic.type, staked.logic.held], ["build", "inference", "1/3"]);
});

test("the rules a bust left on the table are named, counted as heat and given a way out", () => {
  const schema = nextSchema();
  const read = forecast({ schema });
  assert.deepEqual(ids(read.mutations), schema.mutations, "the forecast describes the rules the engine dealt");
  assert.ok(read.mutations.length >= 2, "a bust under every rule leaves more than one");
  const labels = read.mutations.map((mutation) => mutation.label).join(" / ");
  assert.equal(read.currentRules, `${labels} 적용 중`);
  assert.ok(read.ruleObjective.startsWith(`${labels} 해제 조건`), "the objective names the rules it would lift");
  assert.ok(read.ruleHeat > 0 && read.ruleHeat <= 100);
  assert.ok(read.ruleHeat > forecast({ schema: { ...schema, mutations: schema.mutations.slice(0, 1) } }).ruleHeat, "each rule on the table adds to the heat");
});

test("REBOOT is on the list of rules but is not a rule bending the board", () => {
  const schema = nextSchema({ outcome: "cash", cause: "cash", gauge: 0, caseClosed: true });
  assert.deepEqual(schema.mutations, ["reboot"], "the engine marks a closed case with REBOOT alone");
  const read = forecast({ schema });
  assert.deepEqual(ids(read.mutations), ["reboot"]);
  assert.deepEqual(read.tableRules, [], "the panel that lists the bent rules has nothing to list");
  assert.equal(read.ruleHeat, 0, "and no heat to draw, so the stage does not render it");
  assert.match(read.ruleObjective, /^규칙 안정/);
});

test("a board bent with no rule named says a hidden rule is in force", () => {
  for (const flag of [{ faceDown: true }, { sedated: true }, { sealHighest: true }, { fracturedAxis: "capital" }]) {
    const read = forecast({ schema: { ...BASE_SCHEMA, ...flag } });
    assert.equal(read.currentRules, "숨은 규칙 적용 중", `${Object.keys(flag)[0]} is not called a stable table`);
    assert.ok(read.ruleHeat > 0, `${Object.keys(flag)[0]} draws heat`);
  }
});

test("the heat of the rules never passes the end of its bar", () => {
  const everything = { ...BASE_SCHEMA, mutations: ["blackout", "aftershock", "coldFeet", "heatDebt", "fracture"], faceDown: true, sedated: true, sealHighest: true, fracturedAxis: "capital", stepMin: BASE_SCHEMA.stepMin + 4 };
  assert.equal(forecast({ schema: everything }).ruleHeat, 100);
});

test("the chain climbs from dormant to ready as the cashes stay hot", () => {
  const hot = HOT_CASH_MULTIPLIER;
  const cold = HOT_CASH_MULTIPLIER - 0.1;
  const ladder = [
    forecast({ multiplier: cold }),
    forecast({ multiplier: hot }),
    forecast({ multiplier: cold, run: run({ streak: 1 }) }),
    forecast({ multiplier: hot, run: run({ streak: 1 }), caseId: BEFORE_OVERCLOCK }),
    forecast({ multiplier: hot, run: run({ streak: 1 }) }),
  ].map((read) => read.overdrive);
  assert.deepEqual(ladder.map((step) => step.label), ["DORMANT", "IGNITION", "CHAIN HELD", "CHAIN LIVE", "OVERCLOCK READY"]);
  const progress = ladder.map((step) => step.progress);
  assert.deepEqual(progress, [...progress].sort((a, b) => a - b), "each step fills more of the bar than the one before");
  assert.equal(new Set(progress).size, progress.length);
  assert.equal(progress.at(-1), 100);
});

test("OVERCLOCK is promised only where the cash forecast really carries it", () => {
  const ready = forecast({ multiplier: HOT_CASH_MULTIPLIER, run: run({ streak: 1 }) });
  assert.ok(ids(ready.cashMutations).includes("overclock"));
  const early = forecast({ multiplier: HOT_CASH_MULTIPLIER, run: run({ streak: 1 }), caseId: BEFORE_OVERCLOCK });
  assert.ok(!early.rules.has("overclock"), `${BEFORE_OVERCLOCK} has no OVERCLOCK yet`);
  assert.ok(!ids(early.cashMutations).includes("overclock"), "so its cash forecast names none");
  assert.notEqual(early.overdrive.label, "OVERCLOCK READY", "and the chain does not say it is ready");
  const under = forecast({ multiplier: HOT_CASH_MULTIPLIER - 0.1, run: run({ streak: 1 }) });
  assert.ok(!ids(under.cashMutations).includes("overclock"), "a cash under the hot line breaks the chain instead");
});

test("a staked card that burns enough of one resource is forecast to fracture it", () => {
  const card = (burn) => ({ id: "a", label: "a", effect: { capital: -burn, trust: 3 }, cognition: { inference: 2 }, next: "x" });
  const deep = forecast({ selectedCard: card(FRACTURE_MIN_BURN) });
  assert.equal(deep.fractureAxis, "capital");
  assert.ok(ids(deep.cashMutations).includes("fracture") && ids(deep.bustMutations).includes("fracture"), "cashed or bust, the next table is fractured");
  const shallow = forecast({ selectedCard: card(FRACTURE_MIN_BURN - 1) });
  assert.equal(shallow.fractureAxis, null, "one under the line fractures nothing");
  assert.ok(!ids(shallow.cashMutations).includes("fracture") && !ids(shallow.bustMutations).includes("fracture"));
  assert.equal(forecast({ selectedCard: { ...card(0), effect: { trust: 20 } } }).fractureAxis, null, "a card that only gains burns nothing");
});

test("the cash forecast reads the heat as the debt line and the pushes as pushed or not", () => {
  const cashIds = (win) => ids(forecast({ win: { ...QUIET_WINDOW, ...win } }).cashMutations);
  assert.ok(!cashIds({ gauge: HEAT_DEBT_GAUGE - 1, pushes: 1 }).includes("heatDebt"));
  assert.ok(cashIds({ gauge: HEAT_DEBT_GAUGE, pushes: 1 }).includes("heatDebt"), "a cash at the debt line carries the debt");
  assert.deepEqual(cashIds({ gauge: HEAT_DEBT_GAUGE, pushes: 1 }), cashIds({ gauge: 99, pushes: 7 }), "how far past the line, and how many pushes, changes nothing");
  assert.ok(cashIds({ gauge: 5, pushes: 0 }).includes("coldFeet"), "a cash with no push is forecast COLD FEET");
  assert.ok(!cashIds({ gauge: 5, pushes: 1 }).includes("coldFeet"));
});

test("a bust keeps a share of the case pot only while INSURANCE is unspent", () => {
  const keeps = (extra) => forecast({ run: run({ runPot: 1000, ...extra }) }).bustKeeps;
  assert.equal(keeps({ relics: ["insurance"] }), Math.floor(1000 / INSURANCE_SHARE), "rounded down, as the settlement pays it");
  assert.equal(keeps({ relics: ["insurance"], insuranceSpent: true }), 0);
  assert.equal(keeps({ relics: [] }), 0);
  assert.equal(forecast({ run: run({ relics: ["insurance"] }) }).bustKeeps, 0, "and a share of an empty pot is nothing");
});

test("the run's tension rises with busts, the chain and the pot, and stops at the end of its bar", () => {
  const tension = (extra) => forecast({ run: run(extra) }).runTension;
  assert.equal(tension({}), 0);
  assert.ok(tension({ busts: 1 }) > 0);
  assert.ok(tension({ busts: 2 }) > tension({ busts: 1 }));
  assert.ok(tension({ streak: 1 }) > 0);
  assert.ok(tension({ runPot: 100000 }) > tension({ runPot: 100 }));
  assert.equal(tension({ busts: 9, streak: 9, runPot: 1e9 }), 100);
  assert.equal(forecast({ run: null }).runTension, 0, "a table with no run yet draws an empty bar");
});
