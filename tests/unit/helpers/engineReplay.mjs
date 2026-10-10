import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * A seeded batch of windows played through the engine's public functions, and
 * a digest of everything each one produced: the window as the reducer left it,
 * the verdict, and the run the next window is dealt from.
 *
 * It is how `logic-streak.test.mjs` holds that the table plays as it did with
 * the streak's switch off. The digests in `fixtures/engine-before-logic.json`
 * were written by this file on the commit before the streak existed (main at
 * 4849a63), with the fields the streak adds left out of what is hashed; the
 * test replays the same batch on the engine as it stands and compares. Every
 * call passes the switch as off, so the comparison does not move when the
 * shipped constant does -- the old engine ignores the argument.
 *
 * To write the fixture again, on a commit whose table is the one to pin:
 *   node tests/unit/helpers/engineReplay.mjs --write
 */
const ENGINE = new URL("../../../src/gauntlet/gauntletEngine.js", import.meta.url);
const UNLOCKS = new URL("../../../src/gauntlet/tableUnlocks.js", import.meta.url);
export const PIN = new URL("../fixtures/engine-before-logic.json", import.meta.url);

/** What the streak added, wherever it sits: `run.logic`, `practice.logic`, `verdict.logic`. */
const withoutLogic = (key, value) => (key === "logic" ? undefined : value);

const digest = (value) => createHash("sha256").update(JSON.stringify(value, withoutLogic)).digest("hex").slice(0, 16);

function createRandom(seed) {
  let state = seed >>> 0;
  const unit = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return { unit, below: (count) => Math.floor(unit() * count), pick: (list) => list[Math.floor(unit() * list.length)] };
}

const TYPES = ["persistence", "inference", "reframing", "risk"];
const AXES = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];
const GRADES = ["perfect", "perfect", "good", "good", "miss", null];

export async function replayEngine({ seed = 20261010, cases = 90 } = {}) {
  const engine = await import(ENGINE.href);
  const { ALL_RULES, STORY_RULES, UNLOCK_LADDER } = await import(UNLOCKS.href);
  const { createWindow, reduceWindow, resolveWindow, openCaseRun, equipRelic, getTableSchema, suspendWindow, carryTableRecordIntoRestore, serializeRunState } = engine;
  const random = createRandom(seed);
  const ruleSets = [ALL_RULES, ALL_RULES, ALL_RULES, STORY_RULES, ...UNLOCK_LADDER.map((step) => step.rules)];
  const reduce = (window, event, rules) => reduceWindow(window, event, rules, false);
  const digests = [];
  let run = {};
  let lastSummary = null;
  let slot = null;

  const dealCard = (index) => {
    if (random.unit() < 0.08) return { id: `card-${index}`, type: "reframe" };
    const effect = Object.fromEntries(AXES.filter(() => random.unit() < 0.6).map((axis) => [axis, random.below(31) - 15]));
    const cognition = Object.fromEntries(TYPES.filter(() => random.unit() < 0.6).map((type) => [type, 1 + random.below(3)]));
    return { id: `card-${index}`, label: `card ${index}`, effect, ...(random.unit() < 0.9 ? { cognition } : {}) };
  };

  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    // A new season now and then, so a run is also played from its first window.
    if (caseIndex % 12 === 0) run = { veteran: random.unit() < 0.2 };
    const rules = random.pick(ruleSets);
    const story = rules === STORY_RULES;
    const replayOf = lastSummary && random.unit() < 0.2 ? lastSummary : null;
    run = openCaseRun({ ...run, story }, { rules, replayOf });
    const windows = 2 + random.below(7);
    for (let index = 0; index < windows; index += 1) {
      const windowSeed = `replay:${caseIndex}:${index}`;
      const card = dealCard(index);
      let window = createWindow({ schema: getTableSchema(run), seed: windowSeed, beatCombo: run.beatCombo });
      const forced = random.unit() < 0.06;
      if (!forced) window = reduce(window, { type: "SELECT", id: card.id }, rules);
      const presses = random.below(16);
      for (let press = 0; press < presses && window.status === "live"; press += 1) {
        const roll = random.unit();
        if (roll < 0.45) window = reduce(window, { type: "PUSH", grade: random.pick(GRADES) }, rules);
        else if (roll < 0.7) window = reduce(window, { type: "FOCUS", grade: random.pick(GRADES) }, rules);
        else if (roll < 0.8) window = reduce(window, { type: "SET_FOCUS_MODE", mode: random.pick(["strike", "steady", "expose"]) }, rules);
        else if (roll < 0.86 && window.status === "live") {
          // Put down and picked up again, as a save and a reload would.
          const held = suspendWindow(window, run.windowIndex);
          window = createWindow({ schema: getTableSchema(run), seed: windowSeed, beatCombo: run.beatCombo, resume: held.window });
        } else window = reduce(window, { type: "TICK", delta: random.unit(), scale: random.pick([1, 1, 1.5, 2]) }, rules);
      }
      // The clock runs out on a hand that staked nothing, and now and then on one that did.
      if (forced || random.unit() < 0.05) {
        while (window.status === "live") window = reduce(window, { type: "TICK", delta: 1 }, rules);
      }
      if (window.status === "live") window = reduce(window, { type: "CASH" }, rules);
      const caseClosed = index === windows - 1;
      const settled = resolveWindow({
        run,
        window,
        card,
        forced,
        offered: TYPES.filter(() => random.unit() < 0.7),
        caseClosed,
        offerRelics: random.unit() < 0.8,
        rules,
        nextRules: caseClosed ? random.pick(ruleSets) : rules,
        logic: false,
      });
      digests.push(digest({ window, verdict: settled.verdict, nextRun: settled.nextRun }));
      run = settled.nextRun;
      if (run.relicOffer.length && random.unit() < 0.7) run = equipRelic(run, random.unit() < 0.8 ? random.pick(run.relicOffer) : null);
      // A recovery slot taken now and then, and a rollback to it later.
      if (random.unit() < 0.05) slot = { runId: "replay", currentCase: `case-${caseIndex}`, log: [], resources: {}, dynamics: serializeRunState(run) };
      else if (slot && random.unit() < 0.04) {
        const restored = carryTableRecordIntoRestore(slot, { runId: "replay", currentCase: `case-${caseIndex}`, log: [], dynamics: serializeRunState(run) });
        digests.push(digest(restored.dynamics));
        run = restored.dynamics;
        slot = null;
      }
    }
    lastSummary = { pushRecord: { busts: random.below(3), cashes: 4, bestMultiplier: 8, potBanked: 300, potLost: 40, pushes: 11, bestCombo: 5, beatHits: 9, perfects: 3, slips: 1, grooveBanked: 25 } };
  }
  return digests;
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--write")) {
  const digests = await replayEngine();
  writeFileSync(PIN, `${JSON.stringify({ windows: digests.length, digests }, null, 0).replaceAll('","', '",\n"')}\n`);
  console.log(`wrote ${digests.length} digests to ${fileURLToPath(PIN)}`);
}
