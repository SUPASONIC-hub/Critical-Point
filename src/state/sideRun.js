/**
 * E-11 번외 사건: a side case played, outside the season (E11-번외사건-설계안).
 *
 * A side run is its own small state -- the scene it is at, its resources, its
 * log, its table -- kept in `SIDE_CASES_KEY` and nowhere else. It is settled
 * by the season's own arithmetic (`settleChoice`, the engine's verdict and
 * `applyGauntletEffect`), under the standing rules with no week's rule: the
 * table plays as it does in the season, and no engine constant changes.
 *
 * What it never does, by construction rather than by a check at each step:
 * read or write the season save, NEW GAME+, the season record, the past picks,
 * the local ranking or the settled-window log; queue a telemetry row. Nothing
 * here imports the modules that write those, and
 * tests/unit/side-cases.test.mjs holds every other key of storage to the byte
 * across a whole side run. The online save carries the completion mark
 * (cloudSave.js reads it from `SIDE_CASES_KEY`); a close only tells it so.
 *
 * In the runtime's chunk (GameRuntime.jsx re-exports it): the table's modules
 * are there already, and the side screen (screens/SideCaseScreen.jsx) loads
 * that chunk rather than pull them into a chunk of its own.
 */
import { DEVICE_RECORD_WRITTEN_EVENT, SIDE_CASES_KEY, writeStoredValue } from "../appConfig.js";
import { caseNodePrefix } from "../gameCases.js";
import { initialResources } from "../gameConstants.js";
import { applyEffect } from "../riskLogic.js";
import { BUST_EFFECT, normalizeRunState, openCaseRun, RUN_INITIAL_STATE, serializeRunState } from "../gauntlet/gauntletEngine.js";
import { isSideCaseId, readSideRecord } from "../sideCases.js";
import { settleChoice } from "./settleChoice.js";

/** The node id a side case's last cards lead to: the case is closed there, and the ending is drawn. */
export const sideResultNodeId = (caseId) => `${caseNodePrefix(caseId)}_result`;

export const RESOURCE_KEYS = Object.keys(initialResources);
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** The pack as the table reads it: every scene knows its case (the briefing's clock and traces read `node.caseId`). */
export function prepareSidePack(pack) {
  return {
    ...pack,
    nodes: Object.fromEntries(Object.entries(pack.nodes).map(([nodeId, scene]) => [nodeId, { triggers: [], memo: [], ...scene, caseId: pack.id }])),
  };
}

const readResources = (value, fallback) =>
  Object.fromEntries(RESOURCE_KEYS.map((key) => [key, Number.isFinite(value?.[key]) ? value[key] : fallback[key]]));

/** A side run at its first scene, on the pack's own resources and a table of its own. */
export function createSideRun(pack, { runId = `side-${Date.now().toString(36)}` } = {}) {
  return {
    caseId: pack.id,
    runId,
    nodeId: pack.startNode,
    resources: readResources(pack.startState?.resources, initialResources),
    log: [],
    run: serializeRunState(openCaseRun(RUN_INITIAL_STATE)),
    outcomeChoiceId: null,
  };
}

/** The run the record kept, or null when it is not one this pack can resume. */
export function resumeSideRun(pack, inProgress) {
  if (!isRecord(inProgress) || !pack.nodes[inProgress.nodeId] || !Array.isArray(inProgress.log)) return null;
  const fresh = createSideRun(pack);
  return {
    ...fresh,
    runId: typeof inProgress.runId === "string" && inProgress.runId ? inProgress.runId : fresh.runId,
    nodeId: inProgress.nodeId,
    resources: readResources(inProgress.resources, fresh.resources),
    log: inProgress.log.filter(isRecord),
    run: serializeRunState(inProgress.run ?? fresh.run),
  };
}

/** The table's seed for the window the run is at: its own, never one a season run deals. */
export const sideWindowSeed = (state) => `side:${state.runId}:${state.run.windowIndex}:${state.nodeId}`;

/** The first touch on a window, kept so a reload settles it as a bust (as the season's `markWindowTouched`). */
export function touchSideRun(state, openSeed, cardId = null) {
  return { ...state, run: serializeRunState({ ...state.run, openSeed, openCardId: cardId, suspended: null }) };
}

const sumEffects = (...effects) =>
  effects.reduce((sum, effect = {}) => {
    for (const [key, value] of Object.entries(effect)) sum[key] = (sum[key] ?? 0) + value;
    return sum;
  }, {});

/**
 * One decision: the closed window settled by the season's rules, the card's
 * priced effect (and a bust's cost) on the run's resources, and the run moved
 * to the card's next scene -- or closed, when the card leads to the result.
 * A card the scene does not deal changes nothing.
 */
export function advanceSideRun(pack, state, { choice, window = null, forced = false }) {
  const node = pack.nodes[state.nodeId];
  const card = node?.choices?.find((item) => item.id === choice?.id);
  if (!card || state.outcomeChoiceId) return state;
  const settled = settleChoice(
    { caseId: state.caseId, nodeId: state.nodeId, node, resources: state.resources, log: state.log, caseResults: {}, run: state.run, runId: state.runId },
    { choice: card, window, forced },
  );
  const effect = sumEffects(settled.gauntletEffect, settled.busted ? BUST_EFFECT : {});
  const closed = card.next === sideResultNodeId(state.caseId);
  return {
    ...state,
    nodeId: closed ? state.nodeId : card.next,
    resources: applyEffect(state.resources, effect),
    log: [...state.log, { nodeId: state.nodeId, choiceId: card.id, busted: settled.busted, gauge: settled.verdict.gauge, effect }],
    // The settled board, without the draft a close would offer (a side case has none) or the touch.
    run: serializeRunState({ ...normalizeRunState(settled.settledRun), relicOffer: [], openSeed: null, openCardId: null }),
    outcomeChoiceId: closed ? card.id : null,
  };
}

function writeEntry(caseId, entry) {
  if (!isSideCaseId(caseId)) return false;
  const record = readSideRecord();
  const previous = record[caseId] ?? { closedAt: null, outcomeChoiceId: null, inProgress: null };
  return writeStoredValue(SIDE_CASES_KEY, JSON.stringify({ ...record, [caseId]: { ...previous, ...entry } }));
}

/** The run under way, kept so the case resumes where it was left. */
export function saveSideProgress(state) {
  const { nodeId, resources, log, run, runId } = state;
  return writeEntry(state.caseId, { inProgress: { nodeId, resources, log, run, runId } });
}

/**
 * The completion mark (설계안 질문 4 (1)): when, and which ending. The run
 * under way is dropped. The mark is one the online save carries, and no save
 * is written to say a newer copy exists, so the close says it itself.
 */
export function closeSideCase(state, { now = new Date() } = {}) {
  if (!state.outcomeChoiceId) return false;
  const written = writeEntry(state.caseId, { closedAt: now.toISOString(), outcomeChoiceId: state.outcomeChoiceId, inProgress: null });
  if (written && typeof globalThis.dispatchEvent === "function" && typeof globalThis.CustomEvent === "function") {
    globalThis.dispatchEvent(new CustomEvent(DEVICE_RECORD_WRITTEN_EVENT, { detail: { key: SIDE_CASES_KEY } }));
  }
  return written;
}

/** A run put down for good: the next opening starts at the first scene. The mark, if any, stays. */
export function dropSideProgress(caseId) {
  return writeEntry(caseId, { inProgress: null });
}
