import { FOCUS_MODES, getCardBurn, getCardChips, getHeartbeatBpm, getWindowBand } from "../../src/gauntlet/gauntletEngine.js";
import { getLogicDirection, LOGIC_DIRECTIONS } from "../../src/gauntlet/logicStreak.js";
import { nodes } from "../../src/gameData.js";
import { createCaseBot, handUnit, narrowDue, newSeen, scoutDue } from "./season-bot.mjs";

/**
 * A quick look at G1~G7 (the next rules) for tuning: the same case bot and
 * card as check:pressure, fewer cases. `node scripts/sim/rules-next-quick.mjs`
 * (RULES_NEXT=0 for the old rules). Not a check; check:pressure asserts.
 */
const CASES = Number(process.env.QUICK_CASES) || 600;
const card = { id: "sim", label: "sim", effect: { capital: 7, trust: 11, humanCost: 4 } };
const SCENES = Object.values(nodes)
  .map((node) => (node.choices ?? []).map((choice) => ({ type: getLogicDirection(choice), chips: choice.type === "reframe" ? 0 : getCardChips(choice) })).filter((offer) => offer.type))
  .filter((offers) => offers.some((offer) => offer.chips > 0));
const sceneFor = (caseIndex, windowIndex) => SCENES[Math.floor(handUnit(`scene:${caseIndex}:${windowIndex}`) * SCENES.length)];
const { playCase } = createCaseBot({ windowsPerCase: 9, card, sceneFor });
void getCardBurn;

export function measure(label, decide, hand = null, lock = null, cases = CASES) {
  let vault = 0;
  let busts = 0;
  let played = 0;
  let logic;
  let trust = 0;
  const seen = newSeen();
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    if (caseIndex % 50 === 0) logic = undefined;
    const result = playCase(caseIndex, decide, hand ? { pickType: hand, logic } : undefined, [], lock);
    if (hand) logic = result.logic;
    vault += result.vault;
    busts += result.busts;
    played += result.played;
    trust += result.trustSpent;
    for (const [key, value] of Object.entries(result.seen)) {
      if (typeof value === "number") seen[key] += value;
      else for (const [inner, amount] of Object.entries(value)) seen[key][inner] = (seen[key][inner] ?? 0) + amount;
    }
  }
  return { label, meanVault: Math.round(vault / cases), bustRate: busts / played, seen, trust: trust / cases };
}
const line = (row, extra = "") => console.log(`${row.label.padEnd(36)} vault ${String(row.meanVault).padStart(7)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  ${extra}`);
const best = (rows) => rows.reduce((a, b) => (b.meanVault > a.meanVault ? b : a));

const heartbeat = [90, 100, 110, 120].map((t) => measure(`heartbeat < ${t}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < t));
heartbeat.forEach((row) => line(row));
const bestBeat = best(heartbeat);
const threshold = Number(bestBeat.label.split("< ")[1]);
const listening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold;
const oracle = measure("sees", (win) => win.gauge + win.schema.stepMax < win.wall);
line(oracle);

if (!process.env.QUICK || process.env.QUICK.includes("g1")) {
  const holds = (direction) => (offers) => (offers.some((offer) => offer.type === direction) ? direction : offers[0].type);
  const other = (direction) => (direction === "people" ? "position" : "people");
  const switchEvery = (k) => (offers, logic) => {
    const held = logic.type ?? "people";
    const want = logic.held >= k ? other(held) : held;
    return offers.some((offer) => offer.type === want) ? want : offers.some((offer) => offer.type === held) ? held : offers[0].type;
  };
  const hands = {
    "holds people": holds("people"),
    "holds, follows table": (offers, logic) => (offers.some((offer) => offer.type === (logic.type ?? "people")) ? logic.type ?? "people" : offers[0].type),
    ...Object.fromEntries([4, 5, 6, 7, 8, 10].map((k) => [`switches after ${k}`, switchEvery(k)])),
    "switches on a rise": (offers, logic) => {
      const held = logic.type ?? "people";
      const o = offers.find((offer) => LOGIC_DIRECTIONS.includes(offer.type) && offer.type !== held)?.type;
      if (logic.rose && o) return o;
      return offers.some((offer) => offer.type === held) ? held : offers[0].type;
    },
    "random card": (offers, _logic, seed) => offers[Math.floor(handUnit(`${seed}:type`) * offers.length)].type,
  };
  // Exposure-aware hold: pushes to 40 when exposed.
  for (const [name, pick] of Object.entries(hands)) {
    const row = measure(name, listening, pick);
    line(row, `caught ${row.seen.caught}/${row.seen.exposedCashes} exposed cashes, moves ${JSON.stringify(row.seen.moves)}`);
  }
}
if (!process.env.QUICK || process.env.QUICK.includes("g3")) {
  const situations = {
    listening: [listening, null],
    "heat 60": [(win) => win.gauge < 60, null],
    "heat 70": [(win) => win.gauge < 70, null],
    "heat 40": [(win) => win.gauge < 40, null],
    "heat 30": [(win) => win.gauge < 30, null],
    "holds people": [listening, (offers) => (offers.some((offer) => offer.type === "people") ? "people" : offers[0].type)],
    "holds people, heat 40": [(win) => win.gauge < 40, (offers) => (offers.some((offer) => offer.type === "people") ? "people" : offers[0].type)],
    "holds people, heat 35": [(win) => win.gauge < 35, (offers) => (offers.some((offer) => offer.type === "people") ? "people" : offers[0].type)],
  };
  for (const [name, [decide, hand]] of Object.entries(situations)) {
    const rows = FOCUS_MODES.map((mode) => measure(`${mode} lock, ${name}`, decide, hand, { mode }));
    rows.forEach((row) => line(row, `LOCK added nothing ${row.seen.lockUnpaid}/${row.seen.lockCashed}`));
  }
}
if (!process.env.QUICK || process.env.QUICK.includes("g2")) {
  const margin = 6;
  const scoutOrListen = (win) => (win.scouted ? win.gauge + win.schema.stepMax - margin < getWindowBand(win).wallMin : listening(win));
  for (const budget of [Infinity, 30, 26, 22, 18, 14, 9]) {
    const row = measure(`narrow, budget ${budget}`, Object.assign((win) => (win.narrowed ? win.gauge + win.schema.stepMax - 3 < getWindowBand(win).wallMin : scoutOrListen(win)), {
      scout: (win) => scoutDue("narrow", win), narrow: (win) => narrowDue("narrow", win, 3), trustBudget: budget,
    }));
    line(row, `narrowed ${(row.seen.narrows / Math.max(1, row.seen.pushedBoards) * 100).toFixed(1)}% of pushed boards, 믿음 ${row.trust.toFixed(1)}/case, /sees ${(row.meanVault / oracle.meanVault).toFixed(3)}`);
  }
}
if (!process.env.QUICK || process.env.QUICK.includes("g7")) {
  for (const [name, decide] of [["heat 50", (win) => win.gauge < 50], ["heat 60", (win) => win.gauge < 60], ["heartbeat", listening]]) {
    for (const breathe of [false, true]) {
      const row = measure(`${name}${breathe ? " + breath" : ""}`, Object.assign((win) => decide(win), { breathe }));
      const s = row.seen;
      line(row, `bust after a bust ${(s.afterBustBusts / Math.max(1, s.afterBustBoards) * 100).toFixed(1)}% vs fresh ${(s.freshBusts / Math.max(1, s.freshBoards) * 100).toFixed(1)}%  breaths ${s.breaths}`);
    }
  }
}
