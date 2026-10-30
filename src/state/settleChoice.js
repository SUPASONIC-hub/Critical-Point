import { CASE_RESULT_NODES, CASE_SEQUENCE } from "../gameCases.js";
import { getAuthorityGate, REFRAME_COGNITION, REFRAME_EFFECT } from "../gameLogic.js";
import { getBranchDetourBypass } from "../gameData.js";
import { applyGauntletEffect, resolveWindow } from "../gauntlet/gauntletEngine.js";
import { countAudit } from "../gauntlet/auditRisk.js";
import { carryLinksOut, isLinkDue } from "../gauntlet/cascadeRisk.js";
import { listOfferedTypes } from "../gauntlet/logicStreak.js";
import { getRelicPool, getRelicUnlocks } from "../gauntlet/relics.js";
import { getTableRules, STAGED } from "../gauntlet/tableUnlocks.js";
import { getBlackoutSkip, getReframeTarget } from "./caseRoutes.js";

/**
 * The settlement of one decision, outside React (F1 phase 3, S2 in
 * 서버검증-설계안.md): where the card leads, what the table pays for the
 * window it closed, and what a closing case hands the next one. The commit
 * (useChoiceCommit.js) calls these and only these for that arithmetic, so a
 * server check that imports this file runs the settlement the app ran: the
 * relic draft, the rules a window is settled under, the audit (auditRisk.js)
 * and the links (cascadeRisk.js), each read through the engine's own
 * functions rather than a copy of their numbers.
 *
 * Nothing here reads the clock, storage, the page or a setting: the same state
 * and the same input give the same result in a browser and in node.
 */

/** A decision made with no window behind it (the commit's default): cashed, at nothing. */
const NO_WINDOW = { status: "cashed", cause: "cash", gauge: 0, wall: 0, pushes: 0, elapsed: 0 };

/**
 * A closed window settled against the run, with the relic codex this device
 * holds (`unlocked`): the verdict, the run after it, the feats it proved
 * (`unlockedRelics`), and at a closing case the relic draft. Settling writes
 * nothing; `useRelicTable` keeps the feats once the save has taken the decision.
 *
 * `settlement.rules` is what the case plays under (`tableUnlocks`; every rule
 * when it is left out). A feat is only counted in a case that has `relics`:
 * before that the table has not said there is such a thing, and the reveal
 * would announce a tool for a draft the player has never seen. The feat can
 * be proved again later.
 */
export function settleAgainstCodex({ offerRelics = false, ...settlement }, unlocked = []) {
  const settled = resolveWindow(settlement);
  const unlockedRelics = settlement.rules?.has("relics") === false ? [] : getRelicUnlocks(settled, unlocked);
  const drafted = settlement.caseClosed && offerRelics
    ? resolveWindow({ ...settlement, offerRelics: true, relicPool: getRelicPool([...unlocked, ...unlockedRelics]) })
    : settled;
  return { ...drafted, unlockedRelics };
}

/**
 * The rules a window is settled under (gauntlet/tableUnlocks.js): the ones its
 * case plays under, and the ones the board it deals will be played under.
 * Those are the same until the window that closes the case. The board dealt
 * there, and the relic draft offered with it, are the next case's opening, so
 * they follow the next case's rules: 프롤로그 05 has the draft, which makes the
 * offer at the close of 프롤로그 04 the first one.
 *
 * A replay closes onto whichever case the player opens next, which is not
 * known here, and it hands back what the run held before it -- so its closing
 * board is dealt under everything.
 */
export function getSettlementRules({ caseId, run, caseClosed }, staged = STAGED) {
  const rules = getTableRules(caseId, run, staged);
  if (!caseClosed) return { rules, nextRules: rules };
  const nextCaseId = run?.practice ? null : CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) + 1];
  return { rules, nextRules: getTableRules(nextCaseId, run, staged) };
}

/**
 * The types of card a scene has on the table, for the logic streak: a hand
 * that leaves its type because no card of that type was there keeps its streak
 * (`advanceLogic` in gauntlet/logicStreak.js). The scene's own cards, the wild one among
 * them, less any the player's standing has not opened -- a card that cannot be
 * played is not an offer.
 */
export function getOfferedTypes(node, standing) {
  return listOfferedTypes(node?.choices, (card) => getAuthorityGate(card, standing).unlocked);
}

/**
 * Where a card leads: a reframe that cashed opens the case's hidden route once,
 * a branch may be bypassed (`getBranchDetourBypass`), and a bust off the story
 * table skips the scene the room plays without the analyst (`getBlackoutSkip`).
 * `caseClosed` is whether that scene is the case's result.
 */
function routeChoice({ caseId, nodeId, resources, caseResults = {}, run, reframeCount = 0 }, { choice, window }) {
  const reframe = choice.type === "reframe";
  // A reframe that busts is still a reframe the player paid for, but it does
  // not open a door: the wall took the window before the new board was laid.
  const reframeOpenedRoute = reframe && window.status === "cashed";
  const reframeTarget = reframeOpenedRoute && reframeCount === 0 ? getReframeTarget(caseId, nodeId) : null;
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const branchContext = {
    resources,
    previousOutcomeChoiceId: previousCaseId ? caseResults[previousCaseId]?.outcomeChoiceId : undefined,
  };
  const branchBypass = getBranchDetourBypass(choice, branchContext);
  const plannedNode = reframeTarget ?? branchBypass ?? choice.next;
  const blackoutSkip = window.status === "bust" && run?.story !== true ? getBlackoutSkip(plannedNode, branchContext) : null;
  const nextNode = blackoutSkip?.nodeId ?? plannedNode;
  return {
    reframe,
    reframeOpenedRoute,
    reframeTarget,
    blackoutSkip,
    nextNode,
    caseClosed: CASE_RESULT_NODES[caseId] === nextNode,
  };
}

/**
 * One decision settled: the route (`routeChoice`), the table's verdict on the
 * window under the case's rules with its audit and its due link
 * (`settleAgainstCodex`), and the card's effect as the verdict prices it
 * (`applyGauntletEffect`). What the clue, the bust's own cost and the log
 * entry add is the commit's (useChoiceCommit.js), and so is the hand-off of
 * links at the close (`carryChoiceLinks`), which reads the log with this
 * decision's entry on it.
 *
 * `state`: `caseId`, `nodeId`, `node`, `resources`, `log` (the case's so far),
 * `caseResults`, `run` (the gauntlet run), `runId`, `reframeCount` (reframes
 * already played in the case), `clueCount`, `casesOpened`, `unlocked` (the
 * relic codex). `input`: `choice`, `window` (the closed window, or none),
 * `forced`, and optionally `settle`, the codex-bound settle the runtime holds
 * (`useRelicTable`); without it the window settles against `state.unlocked`.
 */
export function settleChoice(state, { choice, window = null, forced = false, settle = null }) {
  const { caseId, node, resources, log = [], run, runId, clueCount = 0, casesOpened = 0, unlocked = [] } = state;
  const windowState = window ?? NO_WINDOW;
  const route = routeChoice(state, { choice, window: windowState });
  const baseEffect = route.reframe ? REFRAME_EFFECT : choice.effect;
  const cognitiveEffect = route.reframe ? REFRAME_COGNITION : choice.cognition;
  const settlementRules = getSettlementRules({ caseId, run, caseClosed: route.caseClosed });
  const settlement = {
    run,
    window: windowState,
    card: choice,
    // For the logic streak: whether the room played this card, and what the
    // scene had on the table.
    forced,
    offered: getOfferedTypes(node, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy, casesOpened }),
    caseClosed: route.caseClosed,
    offerRelics: caseId !== "final",
    // The case's audit so far, read off its log (auditRisk.js); the engine reads it only in a case whose rules have it.
    audit: countAudit(log),
    ...settlementRules,
    // B2: whether a link made boards ago comes back on the next board, off the case's log (cascadeRisk.js).
    cascade: isLinkDue(run, log, runId, settlementRules.rules),
  };
  const { verdict, nextRun: settledRun, unlockedRelics } = settle ? settle(settlement) : settleAgainstCodex(settlement, unlocked);
  const gauntletEffect = applyGauntletEffect(baseEffect, {
    outcome: verdict.outcome,
    gauge: verdict.gauge,
    fracturedAxis: verdict.fracturedAxis,
    fractureRate: verdict.fractureRate,
    focusMultiplier: verdict.focus?.resourceMultiplier,
  });
  return {
    ...route,
    window: windowState,
    // The rules the case plays under (`getSettlementRules`), for the hand-off at the close.
    rules: settlementRules.rules,
    baseEffect,
    cognitiveEffect,
    verdict,
    busted: verdict.outcome === "bust",
    settledRun,
    unlockedRelics,
    gauntletEffect,
  };
}

/**
 * B2: the run after a decision, with what a closing case hands the next one
 * off its whole log (`carryLinksOut`, cascadeRisk.js), under the rules the
 * case played under (`settled.rules`). `nextLog` is the case's log with this
 * decision's entry on it.
 */
export function carryChoiceLinks(settled, { run, nextLog, runId, caseId }) {
  return carryLinksOut(settled.settledRun, { run, rules: settled.rules, log: nextLog, runId, caseClosed: settled.caseClosed, last: caseId === "final" });
}
