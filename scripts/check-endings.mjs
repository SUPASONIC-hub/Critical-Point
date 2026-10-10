import assert from "node:assert/strict";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  cognitionLabels,
  getBranchDetourBypass,
  getContinuityMemoryChoice,
  initialResources,
  nodes,
  reframeRouteNodes,
  getCaseBranchNodes,
  triggerLabels,
} from "../src/gameData.js";
import {
  applyEffect,
  createCaseSummary,
  getAuthorityGate,
  getCaseOutcome,
  getCasesOpened,
  getContinuityChallenge,
  getEndingVariant,
  getGameplayStats,
  getOutcomeCarryover,
  getRiskPressure,
  getSeasonLogic,
  getSeasonStrain,
  getSeasonWear,
  getUnattendedNext,
  makeEmptyScores,
  REFRAME_COGNITION,
  REFRAME_EFFECT,
} from "../src/gameLogic.js";
import {
  applyGauntletEffect,
  BUST_EFFECT,
  createRunSummary,
  createWindow,
  equipRelic,
  getHeartbeatBpm,
  getTableSchema,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
} from "../src/gauntlet/gauntletEngine.js";
import { getLogicType } from "../src/gauntlet/logicStreak.js";
import { getTableRules, STAGED } from "../src/gauntlet/tableUnlocks.js";
import { runsInto } from "../src/seasonRules.js";
import { getOriginStartEffects } from "../src/advancedSystems.js";
import { legacyProfiles } from "../src/caseCopy.js";
import { createInheritedChallenge, createSceneChallenge } from "../src/viewModels/sceneViewModels.js";
import { createChoiceReaders } from "../src/state/useDecision.js";

/**
 * Every written ending has to be reachable, and no one of them may be the
 * season's default.
 *
 * This used to walk the scene graph with random choices and then draw the rest
 * of the ending's inputs out of the air: a clue count of `floor(random * 7)`
 * against a season that hides 55 records, 0-16 busts against a season of about
 * 490 windows, no gauntlet multiplier on a single gain, no BUST_EFFECT, no
 * skipped scene, no carryover or legacy between cases, and nothing for the
 * vault or the beat. Every threshold in `getEndingVariant` was tuned against
 * that, and none of them against a season anybody could play.
 *
 * It replays whole seasons now, through the functions the runtime calls in the
 * order it calls them: the opening route and the carryover a closed case
 * leaves, the scene challenge and the clue it can reveal (`createChoiceReaders`
 * is the runtime's own reader), a seeded window on the live board
 * (`createWindow` / `reduceWindow` / `resolveWindow`), the effect a cash or a
 * bust actually applies (`applyGauntletEffect`, `BUST_EFFECT`), the blackout
 * skip, the case summary and the relic draft. The player is a policy: what it
 * values in a card, how hot it cashes, how often it takes 판을 다시 짠다.
 * Two of those policies are named archetypes whose ending the season has to
 * get right -- a player who puts people first does not end in SYSTEM COLLAPSE,
 * and one who spends people for position mostly does.
 *
 * What it does not model: the adaptive and relationship bridge choices (they
 * are runtime-local and rare), stances (FOCUS), and the continuation of a run
 * across a reload.
 *
 * Story mode (the comfort setting) is replayed after all of that, as seasons
 * of its own: see the end of this file.
 */

const SEASONS = Number(process.env.ENDING_SEASONS) || 600;
const reportMode = process.argv.includes("--report");
/**
 * The seasons are played under the rules each case has, as the runtime deals
 * them (`tableUnlocks`): the prologues turn them on in steps. `--whole` plays
 * every case under everything, the season as it was before the steps, so the
 * two sets of ending bands can be read side by side.
 */
const staged = STAGED && !process.argv.includes("--whole");
const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const EXPECTED = [
  "collapse",
  "open-oversight",
  "evidence-reform",
  "human-record",
  "profitable-silence",
  "cold-justice",
  "field-pact",
  "quiet-cover",
  "open-question",
];

let seed = 20260927;
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}
const pick = (list) => list[Math.floor(random() * list.length)];

/** How a card reads to a player who values these axes. Costs are negative. */
const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];
const worth = (key, value) => (key === "humanCost" || key === "fatigue" ? -value : value);

/**
 * The players. `values` weighs what a card gains and burns; `heat` is where the
 * table policy cashes; `reframe` is the chance of taking 판을 다시 짠다 when it
 * is on the table and this case has not yet been reframed.
 */
const ARCHETYPES = {
  // Named, and asserted on below.
  "people-first": { values: { trust: 1, humanCost: 1.4 }, noise: 2 },
  "spend-people": { values: { capital: 1, time: 0.6, humanCost: -1.2, trust: -0.4 }, noise: 2 },
  // The rest of the population.
  random: { values: {}, noise: 100 },
  procedure: { values: { legitimacy: 1.2, trust: 0.2 }, noise: 3 },
  money: { values: { capital: 1.2, time: 0.5 }, noise: 3 },
  balanced: { values: { trust: 0.5, legitimacy: 0.5, capital: 0.5, humanCost: 0.5, fatigue: 0.3, time: 0.3 }, noise: 4 },
  "min-risk": { minRisk: true, noise: 1 },
};
const POPULATION = ["random", "random", "procedure", "money", "balanced", "min-risk", "people-first", "spend-people"];

function makePolicy(archetype) {
  const base = ARCHETYPES[archetype];
  return {
    archetype,
    ...base,
    // Heat the table cashes at. A player who reads the heartbeat is modelled
    // separately, with the tell the stage shows.
    heat: pick([35, 42, 48, 52, 56, 60]),
    listens: random() < 0.4,
    bpm: pick([95, 100, 105, 110]),
    reframe: pick([0, 0.15, 0.35, 0.6]),
    think: 2 + random() * 10,
    origin: pick(["courier", "lab", "public"]),
  };
}

function scoreCard(policy, choice, resources) {
  const effect = choice.effect ?? {};
  let score;
  if (policy.minRisk) score = -getRiskPressure(applyEffect(resources, effect));
  else score = RESOURCE_KEYS.reduce((sum, key) => sum + (policy.values[key] ?? 0) * worth(key, effect[key] ?? 0), 0);
  return score + (random() - 0.5) * policy.noise * 4;
}

/** What `useChoiceCommit.getBlackoutSkip` does: the room plays the next scene without the player. */
function getBlackoutSkip(fromNodeId, branchContext) {
  const skipped = nodes[fromNodeId];
  if (!skipped || resultNodeIds.has(fromNodeId)) return null;
  const onward = getUnattendedNext(skipped, branchContext);
  if (!onward || !nodes[onward] || resultNodeIds.has(onward)) return null;
  return onward;
}

/** What `GameRuntime.getReframeTarget` does. */
function getReframeTarget(caseId, fromNodeId) {
  const route = reframeRouteNodes[caseId];
  if (route && runsInto(nodes, route, fromNodeId)) return null;
  if (route && fromNodeId !== route && nodes[route]) return route;
  const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
  if (!branch || branch.nodeId === fromNodeId) return null;
  return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
}

function mergeEffects(...effects) {
  return effects.reduce((merged, effect = {}) => {
    for (const [key, value] of Object.entries(effect)) merged[key] = (merged[key] ?? 0) + value;
    return merged;
  }, {});
}

function playWindow(policy, run, windowSeed, rules) {
  // The run's own board, and for a story run the same board with its far wall.
  let win = createWindow({ schema: getTableSchema(run), seed: windowSeed, beatCombo: run.beatCombo });
  win = reduceWindow(win, { type: "SELECT", id: "card" }, rules);
  // Reading the card and the band before the first press. Creep starts after
  // the grace, so a slow hand is already paying heat.
  for (let second = 0; second < Math.floor(policy.think) && win.status === "live"; second += 1) {
    win = reduceWindow(win, { type: "TICK", delta: 1 }, rules);
  }
  const target = policy.heat + (random() - 0.5) * 10;
  for (let press = 0; press < 30 && win.status === "live"; press += 1) {
    const keepGoing = policy.listens
      ? getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < policy.bpm
      : win.gauge < target;
    if (!keepGoing) break;
    win = reduceWindow(win, { type: "PUSH", grade: null }, rules);
    win = reduceWindow(win, { type: "TICK", delta: 0.7 }, rules);
  }
  if (win.status === "live") win = reduceWindow(win, { type: "CASH" }, rules);
  return win;
}

const resourceMeta = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, { label: key }]));

/**
 * `story` is a season played in story mode from its first case to its last:
 * the run carries the mark, which is all the runtime's stamp does to it.
 */
function playSeason(seasonIndex, archetype, story = false) {
  const policy = makePolicy(archetype);
  const caseResults = {};
  let discoveredClues = [];
  let run = normalizeStart(story);
  let final = null;
  const casePeaks = [];
  let windows = 0;
  let skipped = 0;
  for (const caseId of CASE_SEQUENCE) {
    const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
    const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
    const outcomeId = previousResult?.outcomeChoiceId;
    const startNode = caseOpeningRoutes[caseId]?.[outcomeId] ?? CASE_START_NODES[caseId];
    // The continuity table is keyed by the case that opens, as the runtime reads it.
    const continuityChallenge = outcomeId ? getContinuityChallenge({ caseId, choiceId: outcomeId }) : null;
    const carryover = outcomeId ? getOutcomeCarryover({ caseId: previousCaseId, choiceId: outcomeId }) : {};
    const baseLegacy = previousResult ? legacyProfiles[previousResult.rank] ?? legacyProfiles.C : null;
    // The season's wear, which `GameRuntime.startCase` adds to the opening too.
    const openingEffect = mergeEffects(baseLegacy?.effect ?? {}, carryover, getSeasonWear(caseId));
    const openingLegacy = previousResult
      ? { ...baseLegacy, effect: openingEffect, continuity: getCaseOutcome({ caseId: previousCaseId, choiceId: outcomeId }), continuityChallenge }
      : null;
    const originEffect = previousResult ? {} : getOriginStartEffects(policy.origin);
    let resources = applyEffect(previousResult ? applyEffect(initialResources, openingEffect) : initialResources, originEffect);
    const openingNodes = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
    let triggers = makeEmptyScores(triggerLabels);
    let cognition = makeEmptyScores(cognitionLabels);
    let log = [];
    let nodeId = startNode;
    let caseReframes = 0;
    // What `runLifecycle.startCaseNow` and `useChoiceCommit` pass: the case's
    // rules, and on the window that closes it the next case's.
    const rules = getTableRules(caseId, run, staged);
    const nextCaseRules = getTableRules(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) + 1], run, staged);
    run = openCaseRun(run, { rules });
    for (let step = 0; step < 60 && nodeId && !resultNodeIds.has(nodeId); step += 1) {
      const node = nodes[nodeId];
      const riskPressure = getRiskPressure(resources);
      const stats = getGameplayStats(log, riskPressure);
      const reframeChoice = node.choices.find((choice) => choice.type === "reframe");
      const inheritedChallenge = createInheritedChallenge({ isOpeningNode: openingNodes.has(nodeId), openingLegacy });
      const sceneChallenge = createSceneChallenge({ reframeChoice, reframeCombo: stats.reframeCount, inheritedChallenge, node, riskPressure });
      const readers = createChoiceReaders({
        sceneChallenge,
        resources,
        log,
        riskPressure,
        discoveredClues,
        currentCase: caseId,
        currentChallengeStreak: stats.currentChallengeStreak,
        resourceMeta,
      });
      const memoryChoice = getContinuityMemoryChoice({ caseId, nodeId, caseResults });
      const standing = { clueCount: discoveredClues.length, trust: resources.trust, legitimacy: resources.legitimacy, casesOpened: getCasesOpened(caseId) };
      const fixed = [...node.choices.filter((choice) => choice.type !== "reframe"), ...(memoryChoice ? [memoryChoice] : [])]
        .filter((choice) => getAuthorityGate(choice, standing).unlocked);
      const takeReframe = reframeChoice && caseReframes === 0 && random() < policy.reframe;
      // What `useChoiceCommit.getOfferedTypes` hands the settlement: the types on the table.
      const offered = [...new Set([...fixed, ...(reframeChoice ? [reframeChoice] : [])].map(getLogicType).filter(Boolean))];
      const choice = policy.logicHand
        ? pickByType(policy, fixed, run.logic)
        : takeReframe
        ? reframeChoice
        : fixed.reduce((best, candidate) => {
          const score = scoreCard(policy, candidate, resources);
          return !best || score > best.score ? { choice: candidate, score } : best;
        }, null).choice;

      const window = playWindow(policy, run, `season:${seasonIndex}:${run.windowIndex}`, rules);
      windows += 1;
      const responseTimeSec = Math.max(1, Math.round(window.elapsed));
      const reframe = choice.type === "reframe";
      const reframeOpenedRoute = reframe && window.status === "cashed";
      const reframeTarget = reframeOpenedRoute && caseReframes === 0 ? getReframeTarget(caseId, nodeId) : null;
      if (reframe) caseReframes += 1;
      const baseEffect = reframe ? REFRAME_EFFECT : choice.effect;
      const cognitiveEffect = reframe ? REFRAME_COGNITION : choice.cognition;
      const read = readers.getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect);
      const branchContext = { resources, previousOutcomeChoiceId: outcomeId };
      const branchBypass = getBranchDetourBypass(choice, branchContext);
      const plannedNode = reframeTarget ?? branchBypass ?? choice.next;
      // A story run is skipped past nothing (useChoiceCommit).
      const skip = window.status === "bust" && !run.story ? getBlackoutSkip(plannedNode, branchContext) : null;
      if (skip) skipped += 1;
      const nextNode = skip ?? plannedNode;
      const caseClosed = CASE_RESULT_NODES[caseId] === nextNode;
      const { verdict, nextRun } = resolveWindow({ run, window, card: choice, offered, caseClosed, offerRelics: caseId !== "final", rules, nextRules: caseClosed ? nextCaseRules : rules });
      const busted = verdict.outcome === "bust";
      const gauntletEffect = applyGauntletEffect(baseEffect, {
        outcome: verdict.outcome,
        gauge: verdict.gauge,
        fracturedAxis: verdict.fracturedAxis,
        fractureRate: verdict.fractureRate,
        focusMultiplier: verdict.focus?.resourceMultiplier,
      });
      const clue = busted ? null : readers.getClueReveal(read.challengeMatch, read.finalRiskDelta, responseTimeSec, reframeOpenedRoute);
      const finalEffect = mergeEffects(gauntletEffect, clue ? { legitimacy: 2, fatigue: -1 } : {}, busted ? BUST_EFFECT : {});
      const resourcesAfter = applyEffect(resources, finalEffect);
      if (clue) discoveredClues = [...discoveredClues, clue];
      triggers = { ...triggers };
      for (const trigger of node.triggers ?? []) triggers[trigger] = (triggers[trigger] ?? 0) + (reframe ? 10 : 6);
      cognition = { ...cognition };
      for (const [key, value] of Object.entries(cognitiveEffect ?? {})) cognition[key] = (cognition[key] ?? 0) + value;
      log = [...log, {
        nodeId,
        caseId,
        choiceId: choice.id,
        choice: choice.label,
        reframe,
        reframeOpenedRoute,
        reframeBranchId: reframeTarget,
        effect: finalEffect,
        cognition: cognitiveEffect ?? {},
        clue,
        responseTimeSec,
        resourcesBefore: resources,
        resourcesAfter,
        challenge: { matched: read.challengeMatch, riskDelta: read.finalRiskDelta },
        ...(run.story ? { assistStory: true } : {}),
        threshold: {
          busted,
          potMultiplier: verdict.multiplier,
          pot: verdict.pot,
          lostPot: verdict.lostPot,
          pushes: verdict.pushes,
          tempo: verdict.tempo,
          focus: verdict.focus,
          logic: verdict.logic,
        },
      }];
      resources = resourcesAfter;
      run = nextRun;
      if (caseClosed) {
        const summary = {
          ...createCaseSummary(triggers, cognition, log, { resources }),
          gauntlet: createRunSummary(run),
          outcomeChoiceId: choice.id,
          outcomeNodeId: nodeId,
        };
        caseResults[caseId] = summary;
        casePeaks.push(summary.peakRiskPressure);
        if (run.relicOffer.length) run = equipRelic(run, pick(run.relicOffer));
        if (caseId === "final") final = { resources, log };
      }
      nodeId = nextNode;
    }
  }
  const strain = getSeasonStrain(caseResults);
  const ending = getEndingVariant({ resources: final.resources, discoveredClues, log: final.log, ...strain });
  return { ending, policy, strain, clues: discoveredClues.length, windows, skipped, casePeaks, final, caseResults, logic: getSeasonLogic(caseResults) };
}

/**
 * A hand that plays for the logic streak, for the measurement at the end of
 * this file: it holds one type of card, and `switch` leaves it for another
 * only when the pressure rose going into the window (the streak's own rule,
 * gauntlet/logicStreak.js). When its type is not on the table it takes what is.
 */
function pickByType(policy, cards, logic) {
  const held = logic.type ?? policy.holds;
  const leave = policy.logicHand === "switch" && logic.rose;
  const wanted = cards.filter((candidate) => (getLogicType(candidate) === held) !== leave);
  return pick(wanted.length ? wanted : cards);
}

function normalizeStart(story = false) {
  return { ...RUN_INITIAL_STATE, story };
}

const counts = new Map();
const byArchetype = {};
const samples = { busts: [], windows: [], clues: [], skipped: [], legitimacy: [], capital: [], trust: [], seasonLegitimacy: [], seasonCapital: [], seasonTrust: [], sustained: [], peak: [], reframes: [], peopleFirst: [] };
const peopleFirstByArchetype = {};
const perCasePeak = CASE_SEQUENCE.map(() => []);
// The logic streak, counted as a shadow: the longest each season reached and its hold rate, by archetype.
const logicBest = {};
const logicHold = {};
const dump = [];
for (let index = 0; index < SEASONS; index += 1) {
  const archetype = POPULATION[index % POPULATION.length];
  const season = playSeason(index, archetype);
  counts.set(season.ending.id, (counts.get(season.ending.id) ?? 0) + 1);
  byArchetype[archetype] ??= new Map();
  byArchetype[archetype].set(season.ending.id, (byArchetype[archetype].get(season.ending.id) ?? 0) + 1);
  samples.busts.push(season.strain.seasonBusts);
  samples.windows.push(season.windows);
  samples.clues.push(season.clues);
  samples.skipped.push(season.skipped);
  samples.legitimacy.push(season.final.resources.legitimacy);
  samples.capital.push(season.final.resources.capital);
  samples.trust.push(season.final.resources.trust);
  samples.seasonLegitimacy.push(season.strain.seasonResources.legitimacy);
  samples.seasonCapital.push(season.strain.seasonResources.capital);
  samples.seasonTrust.push(season.strain.seasonResources.trust);
  samples.sustained.push(season.strain.sustainedPressure);
  samples.peak.push(season.strain.peakRiskPressure);
  const peopleFirst = Object.values(season.caseResults).reduce((sum, summary) => sum + (summary.peopleFirstCount ?? 0), 0);
  samples.peopleFirst.push(peopleFirst);
  (peopleFirstByArchetype[archetype] ??= []).push(peopleFirst);
  samples.reframes.push(season.strain.seasonReframeRoutes ?? 0);
  (logicBest[archetype] ??= []).push(season.logic.bestLogic ?? 0);
  (logicHold[archetype] ??= []).push(season.logic.logicHold ?? 0);
  season.casePeaks.forEach((peak, caseIndex) => perCasePeak[caseIndex].push(peak));
  if (process.env.ENDING_DUMP) dump.push({ archetype, ending: season.ending.id, clues: season.clues, final: season.final.resources, strain: season.strain, finalOutcome: season.final.log.at(-1)?.choiceId });
}

if (process.env.ENDING_DUMP) (await import("node:fs")).writeFileSync(process.env.ENDING_DUMP, JSON.stringify(dump));

const percentile = (values, share) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(share * sorted.length))];
};
const band = (values) => `${percentile(values, 0.1)}/${percentile(values, 0.5)}/${percentile(values, 0.9)}`;
const share = (map, id, total) => ((map.get(id) ?? 0) / total);
const archetypeTotal = (name) => POPULATION.filter((entry) => entry === name).length * (SEASONS / POPULATION.length);

/**
 * The floors: an ending thins before it vanishes, and the floor is what fails
 * while it is still there to save. Seeded, so the counts are stable.
 */
const FLOOR = Math.max(3, Math.round(SEASONS * 0.01));
/** No ending may be what a season closes on by default. */
const MAX_SHARE = 0.4;

if (!process.env.ENDING_BASELINE) {
  const missing = EXPECTED.filter((id) => !counts.has(id));
  assert.deepEqual(missing, [], `endings never reached in ${SEASONS} replayed seasons: ${missing.join(", ")}`);
  const unexpected = [...counts.keys()].filter((id) => !EXPECTED.includes(id));
  assert.deepEqual(unexpected, [], `unlisted ending ids reached: ${unexpected.join(", ")}`);
  const thin = EXPECTED.filter((id) => (counts.get(id) ?? 0) < FLOOR).map((id) => `${id} reached ${counts.get(id) ?? 0} of ${SEASONS} seasons, under the floor of ${FLOOR}`);
  assert.deepEqual(thin, [], thin.join("\n"));
  const dominant = EXPECTED.filter((id) => share(counts, id, SEASONS) > MAX_SHARE).map((id) => `${id} closes ${(share(counts, id, SEASONS) * 100).toFixed(1)}% of seasons`);
  assert.deepEqual(dominant, [], dominant.join("\n"));
  // Collapse means the season went past what it could carry. A player who put
  // people first every time did not do that; one who spent people did.
  const peopleCollapse = share(byArchetype["people-first"], "collapse", archetypeTotal("people-first"));
  const spendCollapse = share(byArchetype["spend-people"], "collapse", archetypeTotal("spend-people"));
  assert.ok(peopleCollapse <= 0.1, `putting people first collapses ${(peopleCollapse * 100).toFixed(1)}% of seasons`);
  assert.ok(spendCollapse >= 0.5, `spending people for position collapses only ${(spendCollapse * 100).toFixed(1)}% of seasons`);
}

const spread = EXPECTED.map((id) => `${id} ${(share(counts, id, SEASONS) * 100).toFixed(1)}%`).join(", ");
if (reportMode) {
  console.log(JSON.stringify({
    seasons: SEASONS,
    endings: EXPECTED.map((id) => ({ id, count: counts.get(id) ?? 0, percent: Number((share(counts, id, SEASONS) * 100).toFixed(2)) })),
    byArchetype: Object.fromEntries(Object.entries(byArchetype).map(([name, map]) => [
      name,
      Object.fromEntries(EXPECTED.map((id) => [id, Number((share(map, id, archetypeTotal(name)) * 100).toFixed(1))])),
    ])),
    peopleFirstByArchetype: Object.fromEntries(Object.entries(peopleFirstByArchetype).map(([name, values]) => [name, band(values)])),
    p10p50p90: Object.fromEntries(Object.entries(samples).map(([key, values]) => [key, band(values)])),
    perCasePeakMedian: CASE_SEQUENCE.map((caseId, index) => `${caseId}:${percentile(perCasePeak[index], 0.5)}`).join(" "),
  }, null, 2));
}
console.log(`Ending checks passed (${SEASONS} replayed seasons: ${spread})`);
// min / p10 / p50 / p90 / max, for the day the ending's slack door is pointed at the streak.
const fiveNumbers = (values) => `${Math.min(...values)}/${band(values)}/${Math.max(...values)}`;
const byHand = (samplesByHand) => Object.entries(samplesByHand).map(([name, values]) => `${name} ${fiveNumbers(values)}`).join(", ");
console.log(`Logic streak, counted and not paid (season best, min/p10/p50/p90/max: all ${fiveNumbers(Object.values(logicBest).flat())}; ${byHand(logicBest)}; hold rate: all ${fiveNumbers(Object.values(logicHold).flat())}; ${byHand(logicHold)})`);

/**
 * The same season in story mode.
 *
 * Story mode changes what the ending reads of the table and nothing of what it
 * reads of the story: the wall stands at 88 and up, so a season has next to no
 * busts and a vault several times the table's, and no bust plays a scene
 * without the player. The endings are judged by the same function on the same
 * thresholds (a decision: story mode does not get endings of its own), so two
 * things have to stay true under that strain. Every ending a season can close
 * on by choosing is still reachable -- a full vault and a clean record must
 * not fold them into one. And SYSTEM COLLAPSE still answers for the people a
 * season spent: the wall being far away is not what it was ever about.
 *
 * Collapse by overreach (harm together with a bust rate) needs busts a story
 * season does not have. It is counted and printed, not required.
 *
 * Two of the endings are thin here, and that is measured, not asserted away:
 * with no bust to take trust and legitimacy down together, COLD JUSTICE and
 * the open question each close under one story season in a hundred (about five
 * and four of 600, against 31 and 51 at the table). They are asked to be
 * reachable, which is what was decided; the line printed below is where to
 * watch them thin.
 *
 * Played after everything above, on the same seeded stream, so the seasons
 * above are the ones they always were.
 */
const STORY_SEASONS = Number(process.env.ENDING_STORY_SEASONS) || SEASONS;
if (!process.env.ENDING_BASELINE) {
  const storyCounts = new Map();
  const collapseCauses = new Map();
  const storySamples = { busts: [], windows: [], skipped: [], vaultPerCase: [] };
  for (let index = 0; index < STORY_SEASONS; index += 1) {
    const season = playSeason(`story:${index}`, POPULATION[index % POPULATION.length], true);
    storyCounts.set(season.ending.id, (storyCounts.get(season.ending.id) ?? 0) + 1);
    if (season.ending.cause) collapseCauses.set(season.ending.cause.id, (collapseCauses.get(season.ending.cause.id) ?? 0) + 1);
    storySamples.busts.push(season.strain.seasonBusts);
    storySamples.windows.push(season.windows);
    storySamples.skipped.push(season.skipped);
    storySamples.vaultPerCase.push(Math.round(season.strain.seasonVaultPerCase));
    const unmarked = CASE_SEQUENCE.filter((caseId) => season.caseResults[caseId]?.assistStory !== true);
    assert.deepEqual(unmarked, [], `a story season's case summaries all carry assistStory (season ${index})`);
  }
  assert.equal(Math.max(...storySamples.skipped), 0, "a story season skips no scene");
  const storyMissing = EXPECTED.filter((id) => id !== "collapse" && !storyCounts.has(id));
  assert.deepEqual(storyMissing, [], `endings a story season can no longer reach in ${STORY_SEASONS} replayed seasons: ${storyMissing.join(", ")}`);
  const storyUnexpected = [...storyCounts.keys()].filter((id) => !EXPECTED.includes(id));
  assert.deepEqual(storyUnexpected, [], `unlisted ending ids reached in story mode: ${storyUnexpected.join(", ")}`);
  assert.ok((collapseCauses.get("harm") ?? 0) > 0, `no story season collapsed on the people it spent in ${STORY_SEASONS} replayed seasons`);
  const storySpread = EXPECTED.map((id) => `${id} ${(share(storyCounts, id, STORY_SEASONS) * 100).toFixed(1)}%`).join(", ");
  console.log(
    `Story-mode ending checks passed (${STORY_SEASONS} replayed seasons: ${storySpread}; collapse by harm ${collapseCauses.get("harm") ?? 0}, by overreach ${collapseCauses.get("overreach") ?? 0}; busts ${band(storySamples.busts)}, windows ${band(storySamples.windows)}, vault a case ${band(storySamples.vaultPerCase)})`,
  );
}

/**
 * Two hands that play for the logic streak, in report mode only: neither is in
 * the population the endings are judged on, and they are played last, so every
 * season above is the season it always was. They are here to say how long a
 * streak a season can hold when a hand means to hold one.
 */
if (reportMode) {
  const LOGIC_SEASONS = Number(process.env.ENDING_LOGIC_SEASONS) || 40;
  const hands = { "holds one type": { logicHand: "hold", holds: "risk" }, "switches when the pressure rose": { logicHand: "switch", holds: "risk" } };
  const lines = Object.entries(hands).map(([name, hand]) => {
    ARCHETYPES[name] = { values: {}, noise: 0, ...hand };
    const seasons = Array.from({ length: LOGIC_SEASONS }, (_, index) => playSeason(`logic:${name}:${index}`, name).logic);
    return `${name}: best ${fiveNumbers(seasons.map((season) => season.bestLogic ?? 0))}, hold rate ${fiveNumbers(seasons.map((season) => season.logicHold ?? 0))}`;
  });
  console.log(`Logic streak, played for (${LOGIC_SEASONS} seasons a hand, min/p10/p50/p90/max; ${lines.join("; ")})`);
}
