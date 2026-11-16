/**
 * Server checks, phase 3, F1 step 1 (설계-남은-우선항목-20261111 F1-1 (1)):
 * the settlement inside a case, played again off the page. The chain checker
 * (chainRecheck.js) checks that each decision started from what the one before
 * left; this checks that what each decision left is what the rules make of it,
 * with the engine's own functions (question 6 (1)), never copies:
 *
 *   resourcesAfter  the logged `effect` applied to `resourcesBefore`
 *                   (applyEffect) is `resourcesAfter`; the effect is the
 *                   table's price of the card (`riskRewardEffect`) with the
 *                   clue's reward and a bust's cost on it, as the commit
 *                   merges them; and the price is applyGauntletEffect of the
 *                   card's own effect (or the reframe's) at the logged verdict
 *                   -- the outcome, the heat, the LOCK multiplier, the look --
 *                   on the board the window's replay record was dealt.
 *   scene           the card routed again (settleChoice.js `routeChoice`: the
 *                   reframe's hidden route, a branch bypassed, BLACKOUT's
 *                   skip) leads to the next entry's scene, and the last entry
 *                   to the case's result.
 *
 * Still not checked, and counted (chainRecheck.js UNCHECKED.inside): the board
 * each window was dealt, the audit on the vault and the CASCADE link. Each
 * needs run state the opening snapshot does not carry (LOCK's carry, the hot
 * streak, the logic streak's hold, the links in flight); F1 step 2 adds those.
 *
 * What a row does not say is not checked, never passed: an entry without both
 * resource sets, a card that is not the scene's own (a memory or an adaptive
 * card the page adds), a price without its replay record, a route whose branch
 * reads a case before that is not among the rows. A found difference is a
 * break of the chain (`chain-off-log`), a mark someone reads, never a refusal
 * (decision 2 (1)).
 *
 * Between cases, `recheckOpeningRoute` (F1 step 2) plays the opening again:
 * the route a case opened on (`dynamics.open.openingRoute`) is the one
 * describeCaseOpening picks from the case before's outcome and rank -- its
 * scene, the first decision's scene -- and the hand it opened with
 * (`dynamics.open.resources`) is the one that result deals. The checker hands
 * it to recheckChain as `opening`.
 *
 * Kept out of chainRecheck.js on purpose: that file is read by the hall of
 * fame's badges on the page, and this one imports the scenes (gameData.js).
 * The checker (scripts/verify-ranking-rows.mjs) hands it to recheckChain.
 */
import { CASE_SEQUENCE } from "./gameCases.js";
import { nodes } from "./gameData.js";
import { applyEffect, REFRAME_EFFECT } from "./gameLogic.js";
import { applyGauntletEffect, BUST_EFFECT, normalizeSchema } from "./gauntlet/gauntletEngine.js";
import { describeCaseOpening } from "./state/caseRoutes.js";
import { routeChoice } from "./state/settleChoice.js";
import { WINDOW_RECORD_KEY } from "./rankingRecheck.js";

/** The six resources a decision moves (resourcesBefore / resourcesAfter). */
const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];

/** What the commit's clue adds when the entry does not log the reward itself (useChoiceCommit `clueReward`). */
const CLUE_EFFECT = Object.freeze({ legitimacy: 2, fatigue: -1 });

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

/** Effects summed key by key, as the commit's mergeEffects does. */
function mergeEffects(...effects) {
  const merged = {};
  for (const effect of effects) {
    for (const [key, value] of Object.entries(effect ?? {})) merged[key] = (merged[key] ?? 0) + value;
  }
  return merged;
}

/** Two effects the same, a key one leaves out read as 0. */
function sameEffect(left, right) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...keys].every((key) => (left[key] ?? 0) === (right[key] ?? 0));
}

/** The card a logged decision played, when it is the scene's own; null for one the page added. */
function findCard(entry) {
  const choices = nodes[entry?.nodeId]?.choices;
  if (!Array.isArray(choices) || entry?.continuityMemory === true) return null;
  return choices.find((choice) => choice.id === entry.choiceId) ?? null;
}

/**
 * `resourcesAfter` of one entry: the effect applied, the effect merged, the
 * price worked out. Pushes onto `breaks` and `unchecked`.
 */
function recheckResources(entry, index, card, breaks, unchecked) {
  const { resourcesBefore: before, resourcesAfter: after, effect } = entry;
  if (!isObject(before) || !isObject(after) || !isObject(effect) || !RESOURCE_KEYS.every((key) => isNumber(before[key]) && isNumber(after[key]))) {
    unchecked.add("resourcesAfter");
    return;
  }
  const expected = applyEffect(before, effect);
  if (!RESOURCE_KEYS.every((key) => expected[key] === after[key])) {
    breaks.push({ entry: index, field: "resourcesAfter", expected: Object.fromEntries(RESOURCE_KEYS.map((key) => [key, expected[key]])), found: after });
    return;
  }
  const priced = entry.riskRewardEffect;
  // A log from a build before the price was logged: the effect is read as given.
  if (!isObject(priced)) return;
  const busted = entry.threshold?.busted === true;
  const clue = isObject(entry.clueReward?.effect) ? entry.clueReward.effect : entry.clue ? CLUE_EFFECT : {};
  const merged = mergeEffects(priced, busted ? {} : clue, busted ? BUST_EFFECT : {});
  if (!sameEffect(merged, effect)) {
    breaks.push({ entry: index, field: "effect", expected: merged, found: effect });
    return;
  }
  const record = entry[WINDOW_RECORD_KEY];
  const threshold = entry.threshold;
  const base = entry.reframe === true ? REFRAME_EFFECT : card?.effect;
  if (!isObject(base) || !isObject(record?.schema) || !isObject(threshold) || !isNumber(threshold.gauge)) {
    unchecked.add("price");
    return;
  }
  const schema = normalizeSchema(record.schema);
  const price = applyGauntletEffect(base, {
    outcome: busted ? "bust" : "cash",
    gauge: threshold.gauge,
    fracturedAxis: schema.fracturedAxis,
    fractureRate: schema.fractureRate,
    focusMultiplier: threshold.focus?.resourceMultiplier,
    scouted: threshold.scouted === true,
  });
  if (!sameEffect(price, priced)) breaks.push({ entry: index, field: "riskRewardEffect", expected: price, found: priced });
}

/**
 * One case row's settlement, entry by entry. `before` is the row of the case
 * before in the season, when it is here: a branch that reads that case's
 * outcome (`getBranchDetourBypass`) is routed with it, and without it a route
 * that does not come out is not checked rather than broken. Returns the
 * breaks, by entry, and what was not checked (each name once).
 */
export function recheckCaseSettlement(row, before = null) {
  const log = Array.isArray(row?.decision_log) ? row.decision_log : null;
  if (!log || !log.length) return { breaks: [], unchecked: ["resourcesAfter", "scene"] };
  const caseId = row.case_id;
  const breaks = [];
  const unchecked = new Set();
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const previousKnown = !previousCaseId || (before?.case_id === previousCaseId && typeof before?.summary?.outcomeChoiceId === "string");
  const caseResults = previousKnown && previousCaseId ? { [previousCaseId]: { outcomeChoiceId: before.summary.outcomeChoiceId } } : {};
  const open = row?.dynamics?.open;
  let reframeCount = 0;
  log.forEach((entry, index) => {
    if (!isObject(entry)) return;
    const card = findCard(entry);
    recheckResources(entry, index, card, breaks, unchecked);
    const choice = entry.reframe === true ? nodes[entry.nodeId]?.choices?.find((item) => item.type === "reframe") ?? null : card;
    if (!choice || !isObject(entry.resourcesBefore)) unchecked.add("scene");
    else {
      const story = open?.story === true || entry.assistStory === true;
      const route = routeChoice(
        { caseId, nodeId: entry.nodeId, resources: entry.resourcesBefore, caseResults, run: { story }, reframeCount },
        { choice, window: { status: entry.threshold?.busted === true ? "bust" : "cashed" } },
      );
      const last = index === log.length - 1;
      const next = last ? null : log[index + 1]?.nodeId;
      const off = last ? !route.caseClosed : route.nextNode !== next;
      if (off && previousKnown) breaks.push({ entry: index, field: "scene", expected: route.nextNode, found: last ? "the case's close" : next ?? null });
      else if (off) unchecked.add("scene");
    }
    if (entry.reframeOpenedRoute === true) reframeCount += 1;
  });
  return { breaks, unchecked: [...unchecked] };
}

/**
 * F1 step 2: the route a case opened on, played again from the case before.
 * `row` is the case's row, `before` the row of the case before it in the
 * season when it is the row before here (recheckChain hands it so). The
 * snapshot's `openingRoute` must name the case before's outcome and rank, and
 * the scene describeCaseOpening opens on for them; that scene is where the
 * first decision was made, and the snapshot's hand (`resources`) is the hand
 * that result deals. The season's first case has no case before: its route
 * names none, and its scene is the first decision's (the hand there is the
 * analyst's origin, which the row does not say).
 *
 * Not checked, and counted as `openingRoute`: a route that is null (a build
 * before it), a replay's opening, a case whose case before is not the row
 * before here or names no outcome (a gap, a row past retention), a case
 * before sent from a replay (its result may be the replay's, after this case
 * opened), and a route that names no case before on a case that has one (a
 * table stamped from a save without one, runState's `seasonRoute`).
 */
export function recheckOpeningRoute(row, before = null) {
  const open = row?.dynamics?.open;
  const route = open?.openingRoute;
  if (!isObject(open) || !isObject(route) || typeof route.nodeId !== "string" || open.practice === true) return { breaks: [], unchecked: ["openingRoute"] };
  const caseId = row.case_id;
  const breaks = [];
  const log = Array.isArray(row.decision_log) ? row.decision_log : [];
  const firstScene = typeof log[0]?.nodeId === "string" ? log[0].nodeId : null;
  const found = { after: route.after ?? null, rank: route.rank ?? null, nodeId: route.nodeId };
  if (firstScene && firstScene !== route.nodeId) breaks.push({ field: "open.openingRoute", expected: { nodeId: firstScene }, found });
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  if (!previousCaseId) {
    if (found.after !== null || found.rank !== null) breaks.push({ field: "open.openingRoute", expected: { after: null, rank: null }, found });
    return { breaks, unchecked: [] };
  }
  const result = before?.summary;
  const readable = before?.case_id === previousCaseId && typeof result?.outcomeChoiceId === "string" && before?.dynamics?.open?.practice !== true;
  if (!readable || found.after === null) return { breaks, unchecked: ["openingRoute"] };
  const rank = typeof result.rank === "string" ? result.rank : null;
  const expected = describeCaseOpening(caseId, { caseResults: { [previousCaseId]: { outcomeChoiceId: result.outcomeChoiceId, rank } }, operatorOrigin: null });
  if (found.after !== expected.route.after || found.rank !== expected.route.rank || found.nodeId !== expected.route.nodeId) {
    breaks.push({ field: "open.openingRoute", expected: expected.route, found });
  }
  const hand = open.resources;
  if (isObject(hand) && !RESOURCE_KEYS.every((key) => hand[key] === expected.resources[key])) {
    breaks.push({ field: "open.resources", expected: Object.fromEntries(RESOURCE_KEYS.map((key) => [key, expected.resources[key]])), found: hand });
  }
  return { breaks, unchecked: [] };
}
