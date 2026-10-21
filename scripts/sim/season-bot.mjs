/**
 * The simulated players, in one place: the season player of
 * `check-endings.mjs` (`playWindow` and `playSeason`, with the archetypes and
 * the seeded stream they draw from) and the case players of
 * `report-gauntlet-loop.mjs` (`playCase` and `playHandCase`). Both scripts
 * import them from here; what each one measures and asserts stays in the script.
 *
 * Nothing here changes what a script prints. The season player draws from one
 * stream per `createSeasonBot`, in the order it always drew, and the case
 * players draw from nothing but their seeds (`handUnit`).
 */
import { AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE } from "../../src/gauntlet/weeklyRules.js";
import { AUDIT_VALUE_SETS } from "./audit-values.mjs";
import { carryLinks, getEffectBurn, isLinkDue, LINK_BURN, LINK_CARRY_MAX, LINK_SPAN_MAX, LINK_SPAN_MIN, LINK_WALL, walkLinks } from "../../src/gauntlet/cascadeRisk.js";
import { LINK_VALUE_SETS } from "./cascade-values.mjs";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  cognitionLabels,
  getBranchDetourBypass,
  getContinuityMemoryChoice,
  nodes,
  triggerLabels,
} from "../../src/gameData.js";
import {
  applyEffect,
  createCaseSummary,
  getAuthorityGate,
  getCasesOpened,
  getEndingVariant,
  getGameplayStats,
  getRiskPressure,
  getSeasonLogic,
  getSeasonStrain,
  makeEmptyScores,
  REFRAME_COGNITION,
  REFRAME_EFFECT,
} from "../../src/gameLogic.js";
import {
  applyGauntletEffect,
  BUST_EFFECT,
  createRunSummary,
  createWindow,
  equipRelic,
  FOCUS_MAX,
  getCardChips,
  getHeartbeatBpm,
  getSealedCardId,
  getTableSchema,
  getWindowBand,
  HAND_CAP,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  STANCE_CHARGE,
} from "../../src/gauntlet/gauntletEngine.js";
import { getLogicType } from "../../src/gauntlet/logicStreak.js";
import { RELIC_SLOTS } from "../../src/gauntlet/relics.js";
import { LOCK_PRESS_SECONDS } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, getTableRules, MUTATION_RULES, STORY_OFF_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { createInheritedChallenge, createSceneChallenge } from "../../src/viewModels/sceneViewModels.js";
import { describeCaseOpening, getBlackoutSkip, getReframeTarget } from "../../src/state/caseRoutes.js";
import { createChoiceReaders } from "../../src/state/useDecision.js";

// ---------------------------------------------------------------------------
// The season player (check-endings.mjs).
// ---------------------------------------------------------------------------

/**
 * The tools a full hand puts down first, weakest first (day 11, item 6). The
 * first three are the ones `check:pressure` measured adding nothing alone
 * (SPLINT, LOCKPICK, GLASS LENS, in the order the day-10 plan named them);
 * the rest follow that report's "measured tools one at a time" from the
 * least lift to the most, so INSURANCE is the last to go (measured
 * 2026-10-16 at the day-ten table, the streak to x1.6: HIGH ROLLER -1.8%,
 * STEADY ANCHOR +0.1, COLD BLOOD +1.4, ENCORE +1.7, METRONOME +2.8, HEAT SINK
 * +3.4, STETHOSCOPE +4.0, KINETIC GRIP +5.4, INSURANCE +8.7). HIGH ROLLER
 * measures below the first three; it follows them because the plan named
 * those three. ENCORE now measures above COLD BLOOD (it was +1.3 under the
 * x1.5 cap) and is still put down first: the order is the one measured at
 * x1.5, kept so the swap's measures stay comparable.
 */
export const RELIC_DROP_ORDER = Object.freeze([
  "splint",
  "lockpick",
  "glassLens",
  "highRoller",
  "steadyAnchor",
  "encore",
  "coldBlood",
  "metronome",
  "heatSink",
  "stethoscope",
  "kineticGrip",
  "insurance",
]);

/**
 * A draft answered against the slots. Under `RELIC_SLOTS` the taken tool goes
 * in; with them full the weakest of the held tools and the taken one is put
 * down -- the taken one itself means a pass (`tools.weakest`, when the tool
 * table has its own reading of weak, picks instead). `tools.swapped` hears which, so
 * the tool table counts what was kept, not what was reached for.
 */
export function takeIntoSlots(run, taken, tools = null) {
  if (!taken || run.relics.length < RELIC_SLOTS) return equipRelic(run, taken);
  const rank = (id) => RELIC_DROP_ORDER.indexOf(id);
  const weakest = tools?.weakest?.([...run.relics, taken]) ?? [...run.relics, taken].reduce((low, id) => (rank(id) < rank(low) ? id : low));
  tools?.swapped?.(taken, weakest);
  return weakest === taken ? equipRelic(run, null) : equipRelic(run, taken, weakest);
}

/** How a card reads to a player who values these axes. Costs are negative. */
export const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];
const worth = (key, value) => (key === "humanCost" || key === "fatigue" ? -value : value);

/**
 * The players. `values` weighs what a card gains and burns; `heat` is where the
 * table policy cashes; `reframe` is the chance of taking 판을 다시 짠다 when it
 * is on the table and this case has not yet been reframed.
 */
export const ARCHETYPES = {
  // Named, and asserted on in check-endings.mjs.
  "people-first": { values: { trust: 1, humanCost: 1.4 }, noise: 2 },
  "spend-people": { values: { capital: 1, time: 0.6, humanCost: -1.2, trust: -0.4 }, noise: 2 },
  // The rest of the population.
  random: { values: {}, noise: 100 },
  procedure: { values: { legitimacy: 1.2, trust: 0.2 }, noise: 3 },
  money: { values: { capital: 1.2, time: 0.5 }, noise: 3 },
  balanced: { values: { trust: 0.5, legitimacy: 0.5, capital: 0.5, humanCost: 0.5, fatigue: 0.3, time: 0.3 }, noise: 4 },
  "min-risk": { minRisk: true, noise: 1 },
};
export const POPULATION = ["random", "random", "procedure", "money", "balanced", "min-risk", "people-first", "spend-people"];

/** How far past the scouted band's near end a scouting hand lets the next step reach. */
const SCOUT_EDGE = 3;

/**
 * CASCADE_WEEK=1 plays every season and case that is not a story one under
 * B2's test week (the run carries `weekRule: "cascade"`, cascadeRisk.js), and
 * LINK_VALUES=A|B|C picks the design's value set (B when left out; A and C
 * need cascade-values.mjs loaded first with `node --import`). The numbers
 * played are checked, not assumed. Left out, no run carries the week and
 * every line these players print stays where it was.
 */
export const CASCADE_WEEK = process.env.CASCADE_WEEK === "1";
export const LINK_VALUES = (() => {
  const played = { LINK_BURN, LINK_SPAN_MIN, LINK_SPAN_MAX, LINK_WALL };
  const asked = process.env.LINK_VALUES || "B";
  if (CASCADE_WEEK && Object.entries(LINK_VALUE_SETS[asked] ?? {}).some(([name, value]) => played[name] !== value)) {
    throw new Error(`CASCADE_WEEK=1 LINK_VALUES=${asked} needs the numbers rewritten as cascadeRisk.js loads: node --import ./scripts/sim/cascade-values.mjs ...`);
  }
  for (const [name, value] of [["LINK_CARRY_MAX", LINK_CARRY_MAX]]) {
    if (process.env[name] && Number(process.env[name]) !== value) throw new Error(`${name}=${process.env[name]} needs cascade-values.mjs loaded first: node --import ./scripts/sim/cascade-values.mjs ...`);
  }
  return `${asked} (${LINK_BURN}/${LINK_SPAN_MIN}~${LINK_SPAN_MAX}/${LINK_WALL}, carry ${LINK_CARRY_MAX})`;
})();
/**
 * The week's stamp a season or a case of the measurements opens with: AUDIT_WEEK
 * and CASCADE_WEEK together play the test week that has both (`audit-cascade`,
 * 2026-W47), either alone its own week. `cascade` false leaves the links out
 * (a case player that does not carry them).
 */
const weekStamp = (story, cascade = true) => {
  const both = AUDIT_WEEK && CASCADE_WEEK && cascade;
  const id = story ? null : both ? "audit-cascade" : AUDIT_WEEK ? "audit" : CASCADE_WEEK && cascade ? "cascade" : null;
  return id ? { weekRule: id } : {};
};
/** How much less a hand that reads the card's link mark likes a card that makes one (B2 design 3-3). */
const LINK_AVOID = 40;
/**
 * The hand that reads the chips too (B2 decision 3 (1), `readsChips`): it
 * keeps clear of a card that makes a link unless that card's chips are more
 * than this over the best card in the hand that makes none -- the pot it
 * would give up by keeping clear is worth the board CASCADE costs. About what
 * one CASCADE board took off the heavy card at heat 50 on 2026-10-20, in
 * chips before the multiplier (check:pressure).
 */
// CHIP_MARGIN=<n> in the environment plays the hand on another margin (5, 10 and 15 measured on 2026-10-21).
export const CHIP_MARGIN = Number(process.env.CHIP_MARGIN) || 10;
/** A case's links off a log of settled windows, as `useChoiceCommit` logs them. */
const linkEntry = (nodeId, choice, verdict, effect) => ({
  nodeId,
  choiceId: choice.id,
  threshold: { state: verdict.outcome },
  riskRewardEffect: verdict.outcome === "cash" ? effect : {},
  environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable",
});
/** What a season's or a case's links did: made, came back, lapsed, the boards CASCADE dealt and those that bust. */
export const newLinkTally = () => ({ made: 0, landed: 0, landedIn: 0, carriedOut: 0, capped: 0, lapsed: 0, boards: 0, busts: 0, openingBoards: 0, cases: 0 });
/**
 * A closed case's links into the tally, and the table it hands on: carried to
 * the next case (at most LINK_CARRY_MAX), or lapsed on the season's last case.
 * `opening` is how many of the case's first two boards after REBOOT carried CASCADE.
 */
function closeCaseLinks(tally, run, log, runId, last) {
  const walked = walkLinks(log, runId, run.linksIn);
  const { links, capped } = carryLinks(walked);
  for (const key of ["made", "landed", "landedIn"]) tally[key] += walked[key];
  tally.capped += capped;
  tally.cases += 1;
  if (last) tally.lapsed += links.length;
  else tally.carriedOut += links.length;
  const opening = log.slice(0, 2).filter((entry) => String(entry.environmentMode).split("+").includes("cascade")).length;
  tally.openingBoards = Math.max(tally.openingBoards, opening);
  return last ? [] : links;
}

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const resourceMeta = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, { label: key }]));

/**
 * AUDIT_WEEK=1 plays every season and case that is not a story one under B3's
 * test week (the run carries `weekRule: "audit"`, auditRisk.js), and counts
 * the audit as the runtime does, a case at a time. Left out, no run carries
 * the stamp and every line these players print stays where it was.
 */
export const AUDIT_WEEK = process.env.AUDIT_WEEK === "1";
/**
 * AUDIT_VALUES=A|B|C plays the audit week on one of the design's three value
 * sets (audit-values.mjs, which must be loaded first with `node --import`);
 * left out, the numbers weeklyRules.js ships (B). The set played is checked,
 * not assumed.
 */
export const AUDIT_VALUES = (() => {
  const played = { AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE };
  const asked = process.env.AUDIT_VALUES;
  if (asked && Object.entries(AUDIT_VALUE_SETS[asked] ?? {}).some(([name, value]) => played[name] !== value)) {
    throw new Error(`AUDIT_VALUES=${asked} needs the numbers rewritten as weeklyRules.js loads: node --import ./scripts/sim/audit-values.mjs ...`);
  }
  const name = Object.entries(AUDIT_VALUE_SETS).find(([, set]) => Object.entries(set).every(([key, value]) => played[key] === value))?.[0] ?? "?";
  return `${name} (${AUDIT_HEAT}/${AUDIT_LIMIT}/-${AUDIT_RELIEF}/1:${AUDIT_SHARE})`;
})();

/**
 * One season player and the seeded stream it draws from. `seed` starts the
 * stream and `reseed` sets it again (the report's paired seasons); `random`
 * and `pick` are the same stream, for the script's own draws (the tool hand
 * and the relic draft), so every draw keeps its place in it. `staged` plays
 * each case under the rules `tableUnlocks` deals it. `archetypes` is this
 * bot's own table of players, a copy of ARCHETYPES the script may add hands to.
 * `reduce` is the window reducer the player presses through: the engine's,
 * or one that also writes each window's replay trail (the server-check tests,
 * tests/unit/helpers/windowRecorder.mjs). It draws nothing either way.
 */
export function createSeasonBot({ seed: start, staged, archetypes = { ...ARCHETYPES }, reduce = reduceWindow }) {
  let seed = start;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const pick = (list) => list[Math.floor(random() * list.length)];
  const reseed = (next) => {
    seed = next;
  };

  function makePolicy(archetype) {
    const base = archetypes[archetype];
    return {
      archetype,
      ...base,
      // Heat the table cashes at. A player who reads the heartbeat is modelled
      // separately, with the tell the stage shows.
      heat: pick([35, 42, 48, 52, 56, 60]),
      // `board` on the archetype fixes how it plays the table ("blind" or
      // "listens", check-endings.mjs's paired seasons); the draw is still made,
      // so every draw after it keeps its place in the stream.
      listens: ((drawn) => (base.board ? base.board === "listens" : drawn))(random() < 0.4),
      bpm: pick([95, 100, 105, 110]),
      reframe: pick([0, 0.15, 0.35, 0.6]),
      think: 2 + random() * 10,
      origin: pick(["courier", "lab", "public"]),
    };
  }

  /**
   * `hand` is the cards on the table and the board, for a hand that reads the
   * chips (`readsChips`); no other hand reads it.
   */
  function scoreCard(policy, choice, resources, hand = null) {
    const effect = choice.effect ?? {};
    let score;
    if (policy.minRisk) score = -getRiskPressure(applyEffect(resources, effect));
    else score = RESOURCE_KEYS.reduce((sum, key) => sum + (policy.values[key] ?? 0) * worth(key, effect[key] ?? 0), 0);
    // B2: a hand that reads the card's link mark (" · 연결") and keeps clear of
    // it -- unless it reads the chips as well and this card's are worth the board.
    if (policy.avoidsLinks && CASCADE_WEEK && getEffectBurn(effect) >= LINK_BURN && !(policy.readsChips && hand && worthItsLink(choice, hand))) score -= LINK_AVOID;
    return score + (random() - 0.5) * policy.noise * 4;
  }

  /** Whether a card that makes a link has chips more than CHIP_MARGIN over the best one in the hand that makes none. */
  function worthItsLink(choice, { cards, schema }) {
    const plain = cards.filter((card) => getEffectBurn(card.effect) < LINK_BURN).map((card) => getCardChips(card, schema));
    return getCardChips(choice, schema) - Math.max(0, ...plain) > CHIP_MARGIN;
  }

  function mergeEffects(...effects) {
    return effects.reduce((merged, effect = {}) => {
      for (const [key, value] of Object.entries(effect)) merged[key] = (merged[key] ?? 0) + value;
      return merged;
    }, {});
  }

  function playWindow(policy, run, windowSeed, rules, hand = null) {
    // The run's own board, and for a story run the same board with its far wall.
    let win = createWindow({ schema: getTableSchema(run), seed: windowSeed });
    win = reduce(win, { type: "SELECT", id: "card" }, rules);
    // Reading the card and the band before the first press. Creep starts after
    // the grace, so a slow hand is already paying heat.
    for (let second = 0; second < Math.floor(policy.think) && win.status === "live"; second += 1) {
      win = reduce(win, { type: "TICK", delta: 1 }, rules);
    }
    // `hand` is the tool hand measured at the end of check-endings.mjs, and null for
    // every season before it: a stance, charged or not, and a window now and
    // then left to run out its clock.
    if (hand) {
      win = reduce(win, { type: "SET_FOCUS_MODE", mode: hand.mode }, rules);
      for (let lock = 0; hand.locks && lock < 5 && win.status === "live" && win.focus < STANCE_CHARGE; lock += 1) win = reduce(win, { type: "FOCUS" }, rules);
      while (hand.walks && win.status === "live") win = reduce(win, { type: "TICK", delta: 1 }, rules);
    }
    const target = policy.heat + (random() - 0.5) * 10;
    // SCOUT (B1): the player who reads the heartbeat also takes the one look
    // the table sells, and pushes while the next step stays under the band it
    // drew -- past that, on the heartbeat, never past the band's far end. No
    // draw from the stream: without the rule the season is the season before it.
    const scouts = policy.listens && rules.has("scout");
    if (scouts) win = scoutWindow(win, true, rules, reduce);
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      const band = scouts ? getWindowBand(win) : null;
      const hears = getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < policy.bpm;
      const keepGoing = band
        ? win.gauge + win.schema.stepMax - SCOUT_EDGE < band.wallMin || (hears && win.gauge + win.schema.stepMax < band.wallMax)
        : policy.listens
          ? hears
          : win.gauge < target;
      if (!keepGoing) break;
      win = reduce(win, { type: "PUSH" }, rules);
      win = reduce(win, { type: "TICK", delta: 0.7 }, rules);
    }
    if (win.status === "live") win = reduce(win, { type: "CASH" }, rules);
    return win;
  }

  /**
   * `story` is a season played in story mode from its first case to its last:
   * the run carries the mark, which is all the runtime's stamp does to it.
   *
   * `watch` is handed every settled window (the measurements at the end of
   * check-endings.mjs). It reads and draws nothing, so a season played with one is the season
   * played without.
   *
   * `tools` is the tool table of the same measurements (`toolTable`), and null
   * for every season before them: it settles a window against a codex as the
   * runtime does, takes the draft its own way and may play the tool hand. Left
   * out, the draft is the five tools that need no unlock, one taken at random.
   * Either way a full hand swaps (`takeIntoSlots`); five tools from a pool of
   * five never fill past the slots, so the seasons before the tool table never do.
   */
  function playSeason(seasonIndex, archetype, story = false, watch = null, tools = null) {
    const policy = makePolicy(archetype);
    const caseResults = {};
    // Each closed case's decision log, as its case row carries it (the chain checker's tests).
    const caseLogs = {};
    let discoveredClues = [];
    let run = normalizeStart(story);
    let final = null;
    const casePeaks = [];
    let windows = 0;
    let skipped = 0;
    // AUDIT_WEEK only: the season's closes the audit took its part of, and what its closes moved.
    const audits = { caught: 0, lost: 0, secured: 0 };
    const links = newLinkTally();
    for (const caseId of CASE_SEQUENCE) {
      // The opening route, the legacy and the hand, as `runLifecycle.startCaseNow` opens the case.
      const opening = describeCaseOpening(caseId, { caseResults, operatorOrigin: policy.origin });
      const { openingLegacy } = opening;
      const outcomeId = caseResults[CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1]]?.outcomeChoiceId;
      let resources = opening.resources;
      const openingNodes = new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})]);
      let triggers = makeEmptyScores(triggerLabels);
      let cognition = makeEmptyScores(cognitionLabels);
      let log = [];
      let nodeId = opening.nodeId;
      let caseReframes = 0;
      // What `runLifecycle.startCaseNow` and `useChoiceCommit` pass: the case's
      // rules, and on the window that closes it the next case's.
      const rules = getTableRules(caseId, run, staged);
      const nextCaseRules = getTableRules(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) + 1], run, staged);
      run = openCaseRun(run, { rules });
      let audit = 0;
      // B2, CASCADE_WEEK only: the case's links off its own log (cascadeRisk.js).
      let linkLog = [];
      const linkRun = `season:${seasonIndex}`;
      if (tools) tools.caseNumber = CASE_SEQUENCE.indexOf(caseId) + 1;
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
        // `wildOnly` is the hand measured at the end of check-endings.mjs: it stakes the
        // wild card on every scene that deals one, which the table allows (only
        // the route a reframe opens is once a case). It draws nothing here.
        const takeReframe = reframeChoice && (policy.wildOnly || (caseReframes === 0 && random() < policy.reframe));
        // What `useChoiceCommit.getOfferedTypes` hands the settlement: the types on the table.
        const offered = [...new Set([...fixed, ...(reframeChoice ? [reframeChoice] : [])].map(getLogicType).filter(Boolean))];
        const choice = policy.logicHand
          ? pickByType(policy, fixed, run.logic)
          : takeReframe
          ? reframeChoice
          : fixed.reduce((best, candidate) => {
            const score = scoreCard(policy, candidate, resources, { cards: fixed, schema: run.schema });
            return !best || score > best.score ? { choice: candidate, score } : best;
          }, null).choice;

        const window = playWindow(policy, run, `season:${seasonIndex}:${run.windowIndex}`, rules, tools?.hand ? tools.dealHand() : null);
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
        const nextNode = skip?.nodeId ?? plannedNode;
        const caseClosed = CASE_RESULT_NODES[caseId] === nextNode;
        const { verdict, nextRun } = (tools?.settle ?? resolveWindow)({ run, window, card: choice, offered, caseClosed, offerRelics: caseId !== "final", rules, nextRules: caseClosed ? nextCaseRules : rules, audit, cascade: isLinkDue(run, linkLog, linkRun) });
        audit = verdict.audit?.count ?? 0;
        if (verdict.audit?.caught) {
          audits.caught += 1;
          audits.lost += verdict.audit.lost;
        }
        if (verdict.audit) audits.secured += verdict.secured + verdict.audit.lost;
        const busted = verdict.outcome === "bust";
        if (run.schema.mutations.includes("cascade")) {
          links.boards += 1;
          if (busted) links.busts += 1;
        }
        watch?.({ verdict, card: choice, dealtWild: Boolean(reframeChoice), board: run.schema });
        const gauntletEffect = applyGauntletEffect(baseEffect, {
          outcome: verdict.outcome,
          gauge: verdict.gauge,
          fracturedAxis: verdict.fracturedAxis,
          fractureRate: verdict.fractureRate,
          focusMultiplier: verdict.focus?.resourceMultiplier,
        });
        const clue = busted ? null : readers.getClueReveal(read.challengeMatch, read.riskDelta, responseTimeSec, reframeOpenedRoute);
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
          challenge: { matched: read.challengeMatch, riskDelta: read.riskDelta },
          ...(run.story ? { assistStory: true } : {}),
          threshold: {
            busted,
            potMultiplier: verdict.multiplier,
            pot: verdict.pot,
            lostPot: verdict.lostPot,
            pushes: verdict.pushes,
            focus: verdict.focus,
            logic: verdict.logic,
          },
        }];
        resources = resourcesAfter;
        if (CASCADE_WEEK) linkLog = [...linkLog, linkEntry(nodeId, choice, verdict, gauntletEffect)];
        // What the closing commit writes (cascadeRisk.js `carryLinksOut`): the links this case hands on.
        run = caseClosed && CASCADE_WEEK && !run.story ? { ...nextRun, linksOut: closeCaseLinks(links, run, linkLog, linkRun, caseId === "final") } : nextRun;
        if (caseClosed) {
          const summary = {
            ...createCaseSummary(triggers, cognition, log, { resources }),
            gauntlet: createRunSummary(run),
            outcomeChoiceId: choice.id,
            outcomeNodeId: nodeId,
          };
          caseResults[caseId] = summary;
          caseLogs[caseId] = log;
          casePeaks.push(summary.peakRiskPressure);
          if (run.relicOffer.length) run = takeIntoSlots(run, tools ? tools.draft(run) : pick(run.relicOffer), tools);
          if (caseId === "final") final = { resources, log };
        }
        nodeId = nextNode;
      }
    }
    const strain = getSeasonStrain(caseResults);
    const ending = getEndingVariant({ resources: final.resources, discoveredClues, log: final.log, ...strain });
    return { ending, policy, strain, discoveredClues, clues: discoveredClues.length, windows, skipped, casePeaks, final, caseResults, caseLogs, logic: getSeasonLogic(caseResults), relics: run.relics, audits, links };
  }

  /**
   * A hand that plays for the logic streak, for the measurement at the end of
   * check-endings.mjs: it holds one type of card, and `switch` leaves it for another
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
    return { ...RUN_INITIAL_STATE, story, ...weekStamp(story) };
  }

  return { random, pick, reseed, archetypes, makePolicy, scoreCard, playWindow, playSeason, pickByType };
}

// ---------------------------------------------------------------------------
// The case players (report-gauntlet-loop.mjs).
// ---------------------------------------------------------------------------

export function handUnit(seed) {
  let value = 2166136261;
  for (const character of seed) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  value = (Math.imul(value >>> 0, 1664525) + 1013904223) >>> 0;
  value ^= value >>> 15;
  return (Math.imul(value, 2246822519) >>> 0) / 4294967296;
}

/**
 * What the measurements at the end of report-gauntlet-loop.mjs count, a window
 * at a time (`playCase` returns one, `measure` adds them up). Nothing here is
 * asserted on or printed by that script's other rows. `moves` is what each window did to the logic
 * streak (`advanceLogic`'s move); `bustAt` files each bust under the push it
 * happened on, or under the clock ("creep", "timeout"), and `pushed` is how
 * many pushes each window made; the `lock` numbers are the cashes that held a
 * charge, how many of them LOCK added nothing to, and the pots told apart.
 */
export const newSeen = () => ({ windows: 0, streakSum: 0, moves: {}, bustAt: {}, pushed: {}, lockCashed: 0, lockUnpaid: 0, pot: 0, logicPot: 0, focusPot: 0, linksMade: 0, linksLanded: 0, linksLandedIn: 0, linksCarried: 0, linksLapsed: 0, cascadeBoards: 0, cascadeBusts: 0, audits: 0, auditLost: 0, auditSecured: 0, ...newChainSeen() });
/**
 * The bust chain (improvement notes C-14, 2026-10-22): boards played right
 * after a bust in the same case, against the rest. `afterBust*` is every such
 * board, `afterShock*` those of them dealt BLACKOUT and AFTERSHOCK together,
 * `afterCascade*` the CASCADE boards among them, and `cascadeFresh*` the
 * CASCADE boards that followed no bust. `fresh*` is every board that followed
 * no bust (a case's first board included).
 */
const newChainSeen = () => ({ afterBustBoards: 0, afterBustBusts: 0, afterShockBoards: 0, afterShockBusts: 0, afterCascadeBoards: 0, afterCascadeBusts: 0, cascadeFreshBoards: 0, cascadeFreshBusts: 0, freshBoards: 0, freshBusts: 0 });
function see(seen, verdict) {
  const count = (map, key) => {
    map[key] = (map[key] ?? 0) + 1;
  };
  seen.windows += 1;
  seen.streakSum += verdict.logic.streak;
  count(seen.moves, verdict.logic.move);
  count(seen.pushed, verdict.pushes);
  // AUDIT_WEEK only: the closes the audit took its part of, that part, and what those closes moved before it.
  if (verdict.audit?.caught) {
    seen.audits += 1;
    seen.auditLost += verdict.audit.lost;
  }
  if (verdict.audit) seen.auditSecured += verdict.secured + verdict.audit.lost;
  if (verdict.outcome === "bust") count(seen.bustAt, verdict.cause === "push" ? verdict.pushes : verdict.cause);
  else {
    seen.pot += verdict.pot;
    seen.logicPot += verdict.logic.pot;
    seen.focusPot += verdict.focus.pot;
    if (verdict.focus.charge > 0) {
      seen.lockCashed += 1;
      if (verdict.focus.pot === 0) seen.lockUnpaid += 1;
    }
  }
}

export const HAND = [
  { id: "people", label: "people", cognition: { persistence: 1 }, effect: { trust: 10, humanCost: -4, time: -6, capital: -3, fatigue: 5 } },
  { id: "record", label: "record", cognition: { inference: 1 }, effect: { legitimacy: 10, time: -5, trust: -3, humanCost: 3, fatigue: 3 } },
  { id: "fast", label: "fast", cognition: { risk: 1 }, effect: { capital: 8, time: 5, legitimacy: -12, trust: -3, humanCost: 3 } },
];
/** How often the hand leaves the type it is holding for the next card along. */
const HAND_WANDER = 0.2;
/** How often it charges a stance before it pushes. */
const HAND_LOCKS = 0.5;
// Most hands lean on one or two stances; EXPOSE, which clears seals for good
// once mastered, is the one they reach for least.
const STANCES = ["strike", "steady", "strike", "steady", "expose"];

/**
 * SCOUT as a hand plays it (B1): the look, before the first push. `scout` is
 * the decide function's own mark (`decide.scout`): `true` presses SCOUT as the
 * table does, and `{ seconds }` is a sweep's candidate price, paid on the clock
 * the same way (the band's reach is the decide function's to read, through
 * `getWindowBand`). A case without the rule looks at nothing.
 */
export function scoutWindow(win, scout, rules = ALL_RULES, reduce = reduceWindow) {
  if (!scout || win.status !== "live") return win;
  if (scout === true || !Number.isFinite(scout.seconds)) return reduce(win, { type: "SCOUT" }, rules);
  if (!rules.has("scout") || win.scouted) return win;
  let spent = { ...win, scouted: true };
  for (let left = scout.seconds; left > 0 && spent.status === "live"; left -= 1) spent = reduce(spent, { type: "TICK", delta: Math.min(1, left) }, rules);
  return spent;
}

/**
 * The two case players, for a case `windowsPerCase` windows long. `card` is
 * the one simulated card `playCase` stakes, and `sceneFor(caseIndex,
 * windowIndex)` the scene whose types a typed hand picks from. `reduce` is
 * the window reducer, as for `createSeasonBot` (and `scoutWindow` takes it too).
 */
export function createCaseBot({ windowsPerCase: WINDOWS_PER_CASE, card, sceneFor, links = true, carry = 0, reduce = reduceWindow }) {
  // B2 decision 6 (2), on a bot made with `carry` (a season's length in
  // cases): a case hands its links to the next case index of the same
  // season, and the season's last lets them lapse.
  let carried = { caseIndex: -1, links: [] };
  /**
   * `pickType` gives the simulated card a type for the window (`LOGIC_HANDS`
   * in report-gauntlet-loop.mjs), which puts the logic streak in play; `logic` is the streak the case
   * opens with, carried from the case before as a run carries it. `lock` charges
   * a stance to the full before the first push, a press at a time: the press
   * itself is what costs the clock (`lock.idle`: the same clock, and no press).
   *
   * `story` plays the case as a story run: the run carries the mark, so its
   * windows are dealt from the far wall (`getTableSchema`), and a bust skips no
   * scene (useChoiceCommit). It is `true`, or the run the case opens from -- a
   * season far along, say. The rules a story run plays under are the caller's to
   * pass, as everywhere here.
   */
  function playCase(caseIndex, decide, { pickType = null, logic = undefined } = {}, relics = [], lock = null, rules = ALL_RULES, story = false) {
    const linksOut = carry && carried.caseIndex === caseIndex - 1 && caseIndex % carry !== 0 ? carried.links : [];
    let run = openCaseRun(story ? { relics, ...(story === true ? {} : story), story: true } : { relics, ...(logic ? { logic } : {}), ...weekStamp(false, Boolean(links)), linksOut }, { rules });
    let audit = 0;
    const paid = { cashed: 0, bonus: 0, capped: 0 };
    let busts = 0;
    let midCaseBusts = 0;
    let mutatedAfterBust = 0;
    let nextTableRules = 0;
    let played = 0;
    const seen = newSeen();
    // B2, CASCADE_WEEK only and on a bot made with `links`: the case's links off its own log.
    const linkLog = [];
    const linkRun = `case:${caseIndex}`;
    const opened = run;
    // Whether the window played before this one, in this case, bust (the bust chain, `newChainSeen`).
    let afterBust = false;
    for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
      played += 1;
      // The run's own board for every run but a story one, whose wall stands far.
      const seed = `sim:${caseIndex}:${windowIndex}`;
      const offers = pickType ? sceneFor(caseIndex, windowIndex) : null;
      const staked = pickType ? { ...card, cognition: { [pickType(offers, run.logic, seed)]: 1 } } : card;
      let win = createWindow({ schema: getTableSchema(run), seed });
      win = reduce(win, { type: "SELECT", id: card.id }, rules);
      if (lock) {
        win = reduce(win, { type: "SET_FOCUS_MODE", mode: lock.mode }, rules);
        let charge = win;
        for (let press = 0; press < 8 && win.status === "live" && charge.focus < FOCUS_MAX; press += 1) {
          const pressed = reduce(charge, { type: "FOCUS" }, rules);
          // `idle` is the hand a LOCK is compared with like for like: it lets
          // the same clock run and does not press (a tick carries a second at most).
          if (lock.idle && pressed !== charge) for (const delta of [1, LOCK_PRESS_SECONDS - 1]) win = reduce(win, { type: "TICK", delta }, rules);
          charge = pressed;
          if (!lock.idle) win = pressed;
        }
      }
      win = scoutWindow(win, decide.scout, rules, reduce);
      for (let press = 0; press < 30 && win.status === "live"; press += 1) {
        // `audit` is the case's audit so far, for a hand that reads it (AUDIT_WEEK).
        if (!decide(win, run, audit)) break;
        win = reduce(win, { type: "PUSH" }, rules);
        win = reduce(win, { type: "TICK", delta: 0.6 }, rules);
      }
      if (lock?.cashAs && win.status === "live") win = reduce(win, { type: "SET_FOCUS_MODE", mode: lock.cashAs }, rules);
      if (win.status === "live") win = reduce(win, { type: "CASH" }, rules);
      const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
      const { verdict, nextRun } = resolveWindow({ run, window: win, card: staked, offered: offers ? [...new Set(offers.map((offer) => offer.type))] : undefined, caseClosed, rules, audit, cascade: links && isLinkDue(run, linkLog, linkRun) });
      audit = verdict.audit?.count ?? 0;
      see(seen, verdict);
      if (run.schema.mutations.includes("cascade")) {
        seen.cascadeBoards += 1;
        if (verdict.outcome === "bust") seen.cascadeBusts += 1;
      }
      {
        const bust = verdict.outcome === "bust" ? 1 : 0;
        const dealt = run.schema.mutations;
        const cascade = dealt.includes("cascade");
        if (afterBust) {
          seen.afterBustBoards += 1;
          seen.afterBustBusts += bust;
          if (dealt.includes("blackout") && dealt.includes("aftershock")) {
            seen.afterShockBoards += 1;
            seen.afterShockBusts += bust;
          }
          if (cascade) {
            seen.afterCascadeBoards += 1;
            seen.afterCascadeBusts += bust;
          }
        } else {
          seen.freshBoards += 1;
          seen.freshBusts += bust;
          if (cascade) {
            seen.cascadeFreshBoards += 1;
            seen.cascadeFreshBusts += bust;
          }
        }
        afterBust = bust === 1;
      }
      if (links && CASCADE_WEEK) linkLog.push(linkEntry(`n${windowIndex}`, staked, verdict, staked.effect));
      if (verdict.outcome === "cash") {
        // What the streak paid this pot, before LOCK and under the cap.
        paid.cashed += 1;
        paid.bonus += verdict.logic.bonus;
        if (verdict.logic.bonus >= HAND_CAP) paid.capped += 1;
      }
      if (verdict.outcome === "bust") {
        busts += 1;
        if (!caseClosed) midCaseBusts += 1;
        // Broken is the blackout the bust files on the next board. A bare hand
        // also has to find it face down and already hot; a mastered lock may turn
        // the board back over (`applyStanceMastery`), which is the lock working.
        const broken = nextRun.schema.mutations.includes("blackout") && (lock ? true : nextRun.schema.faceDown && nextRun.schema.startGauge > 0);
        if (!caseClosed && broken) mutatedAfterBust += 1;
        // The blackout skip: the room plays the next scene without the player. It
        // never skips onto the result, so the case's last window is always played.
        // A story run is skipped past nothing.
        if (!story && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
      }
      // A board that carries one of the seven next-table rules, whatever dealt it.
      if (nextRun.schema.mutations.some((id) => STORY_OFF_RULES.includes(MUTATION_RULES[id]))) nextTableRules += 1;
      run = nextRun;
    }
    if (links && CASCADE_WEEK) {
      const walked = walkLinks(linkLog, linkRun, opened.linksIn);
      const handed = carryLinks(walked);
      const last = !carry || (caseIndex + 1) % carry === 0;
      seen.linksMade += walked.made;
      seen.linksLanded += walked.landed;
      seen.linksLandedIn += walked.landedIn;
      seen.linksCarried += last ? 0 : handed.links.length;
      seen.linksLapsed += handed.capped + (last ? handed.links.length : 0);
      carried = { caseIndex, links: last ? [] : handed.links };
    }
    return { vault: run.vault, busts, midCaseBusts, mutatedAfterBust, nextTableRules, played, ...paid, logic: run.logic, seen };
  }

  function playHandCase(caseIndex, decide, relics, { stanceMastery, logic } = {}, rules = ALL_RULES) {
    let run = openCaseRun({ relics, stanceMastery, ...(logic ? { logic } : {}) }, { rules });
    let played = 0;
    for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
      played += 1;
      const seed = `hand:${caseIndex}:${windowIndex}`;
      let win = createWindow({ schema: run.schema, seed });
      // The richest card is the one a COLD FEET board seals, and the one a hand
      // wants most; otherwise the hand holds its type, and now and then leaves it.
      const sealedId = getSealedCardId(HAND, run.schema);
      const held = HAND.findIndex((candidate) => getLogicType(candidate) === run.logic.type);
      const wanted = HAND[(Math.max(0, held) + (handUnit(`${seed}:card`) < HAND_WANDER ? 1 : 0)) % HAND.length];
      const card = HAND.find((candidate) => candidate.id === sealedId) ?? wanted;
      win = reduce(win, { type: "SET_FOCUS_MODE", mode: STANCES[caseIndex % STANCES.length] }, rules);
      win = reduce(win, { type: "SELECT", id: card.id }, rules);
      // Four or five presses charge a stance; three, when a press was graded, used
      // to. A charged stance fills the hand's cap by itself, so a hand that locked
      // every window would be paid nothing by its streak and the two relics that
      // bend the streak could not move a number: it locks one window in two.
      const locks = handUnit(`${seed}:lock`) < HAND_LOCKS;
      for (let lock = 0; locks && lock < 5 && win.status === "live" && win.focus < STANCE_CHARGE; lock += 1) {
        win = reduce(win, { type: "FOCUS" }, rules);
      }
      const mood = handUnit(`${seed}:mood`);
      if (mood < 0.04) {
        // Walked away from the table: the clock runs out.
        while (win.status === "live") win = reduce(win, { type: "TICK", delta: 1 }, rules);
      }
      const sealed = card.id === sealedId;
      // One window in eight is cashed cold, as early as the table allows: COLD
      // FEET seals the next hand's richest card, and a sealed card has to be
      // pushed to the seal before it cashes -- which is what LOCKPICK and GLASS
      // LENS bend.
      const cold = mood >= 0.04 && mood < 0.165;
      for (let press = 0; press < 30 && win.status === "live"; press += 1) {
        const mustOpen = sealed && win.gauge < win.schema.sealBreak;
        if (!mustOpen && (cold || !decide(win, run))) break;
        win = reduce(win, { type: "PUSH" }, rules);
        win = reduce(win, { type: "TICK", delta: 0.6 }, rules);
      }
      if (win.status === "live") win = reduce(win, { type: "CASH" }, rules);
      const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
      const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed, rules });
      if (verdict.outcome === "bust" && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
      run = nextRun;
    }
    return { vault: run.vault, played, stanceMastery: run.stanceMastery, logic: run.logic };
  }

  return { playCase, playHandCase };
}
