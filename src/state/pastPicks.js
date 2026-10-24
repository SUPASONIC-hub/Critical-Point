/**
 * B-14(1) 「지난 시즌의 당신」: the card this device picked in each scene of
 * the season before, so a NEW GAME+ season can mark that card. The finale's
 * last question says "당신의 선택은 다음 참가자의 보기로 복사된다"; this is the
 * board showing it.
 *
 * What is kept is one base-36 character per scene, case by case, in the order
 * the case's graph lists its scenes (gameData's `nodeOrders`): `0` for a
 * scene not picked in, `1..n` for the card's place in that scene's
 * `node.choices`. Trailing zeros are dropped. Each case carries a fingerprint
 * of its scene ids and their card ids, so a case whose scenes or cards were
 * added, moved or renamed since reads as picked in nowhere rather than putting
 * the mark on somebody else's card. A card's wording alone changing keeps it.
 *
 * Kept from the season's log: the last entry for a scene (a case played again
 * keeps what was picked last), never a system entry, never a card the clock
 * forced (`threshold.forced`: not the player's pick), and never a card the
 * scene does not author (the dynamic cards -- adaptive reframe, relationship
 * bridge, memory -- have no place in `node.choices` to write).
 *
 * Unlike seenScenes.js it does not add up: it is the season before, one
 * season, and a new finale writes over the last. It is written once, when a
 * finale closes (useNewGamePlus.unlock), never while a season is played. The
 * run that wrote it keeps what stood before (`before`), so a case replayed
 * after its own finale still reads the season before and not itself.
 *
 * A device key outside the run's save: a reset keeps it, and a device that
 * finished a season before this key existed has nothing to show. The online
 * save carries it beside the run, never in it (E-12, cloudDeviceRecords.js). Nothing here reaches the log, the cognition, the seed
 * or a ranking row; it is a mark on the board and no more.
 */
import { PAST_PICKS_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";
import { nodeOrders, nodes } from "../gameData.js";
import { orderFingerprint } from "./seenScenes.js";

// Spelled in appConfig.js, where the online save (cloudSave.js) reads it without the scene graph.
export { PAST_PICKS_KEY };

const choicesOf = (scenes, id) => (Array.isArray(scenes[id]?.choices) ? scenes[id].choices : []);

/** The case's scene ids, each followed by its card ids: what the places were written against. */
export function picksFingerprint(order, scenes = nodes) {
  return orderFingerprint(order.flatMap((id) => [id, ...choicesOf(scenes, id).map((choice) => choice?.id)]));
}

/** A case's picks as `fingerprint:places`, one base-36 character a scene, or null when none is picked. */
export function encodeCasePicks(order, picks, scenes = nodes) {
  let places = "";
  for (const id of order) {
    const at = picks.has(id) ? choicesOf(scenes, id).findIndex((choice) => choice?.id === picks.get(id)) + 1 : 0;
    places += at > 0 && at < 36 ? at.toString(36) : "0";
  }
  places = places.replace(/0+$/, "");
  return places ? `${picksFingerprint(order, scenes)}:${places}` : null;
}

/** The `[sceneId, cardId]` pairs `encodeCasePicks` wrote, or none when the case or its cards changed since. */
export function decodeCasePicks(order, value, scenes = nodes) {
  const [print, places] = typeof value === "string" ? value.split(":") : [];
  if (!places || places.length > order.length || !/^[0-9a-z]+$/.test(places) || print !== picksFingerprint(order, scenes)) return [];
  const pairs = [];
  for (let at = 0; at < places.length; at += 1) {
    const place = parseInt(places[at], 36);
    if (place === 0) continue;
    const choice = choicesOf(scenes, order[at])[place - 1];
    // A place past the scene's cards: the value was not written for this graph.
    if (typeof choice?.id !== "string") return [];
    pairs.push([order[at], choice.id]);
  }
  return pairs;
}

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Every case's picks, from what `encodePicks` wrote, as a Map of scene id to card id. */
export function decodePicks(cases, orders = nodeOrders, scenes = nodes) {
  const picks = new Map();
  if (!isPlainObject(cases)) return picks;
  for (const [caseId, value] of Object.entries(cases)) {
    if (Object.hasOwn(orders, caseId)) for (const [id, choiceId] of decodeCasePicks(orders[caseId], value, scenes)) picks.set(id, choiceId);
  }
  return picks;
}

/** The picks as `{ caseId: "fingerprint:places" }`, only the cases with one. */
export function encodePicks(picks, orders = nodeOrders, scenes = nodes) {
  const cases = {};
  for (const [caseId, order] of Object.entries(orders)) {
    const value = encodeCasePicks(order, picks, scenes);
    if (value) cases[caseId] = value;
  }
  return cases;
}

/** The card picked last in each scene of a season's log, leaving out system entries, forced cards and cards the scene does not author. */
export function picksFromLog(log, scenes = nodes) {
  const picks = new Map();
  for (const entry of Array.isArray(log) ? log : []) {
    if (!isPlainObject(entry) || entry.isSystemEvent === true || entry.threshold?.forced === true) continue;
    const { nodeId, choiceId } = entry;
    if (typeof nodeId !== "string" || typeof choiceId !== "string") continue;
    if (!choicesOf(scenes, nodeId).some((choice) => choice?.id === choiceId)) continue;
    picks.delete(nodeId);
    picks.set(nodeId, choiceId);
  }
  return picks;
}

export function normalizePastPicksRecord(value) {
  const record = isPlainObject(value) && value.v === 1 ? value : {};
  return {
    v: 1,
    runId: typeof record.runId === "string" ? record.runId : null,
    picks: isPlainObject(record.picks) ? record.picks : {},
    before: isPlainObject(record.before) ? record.before : {},
  };
}

/**
 * The record with a finished season's picks written over the last season's.
 * The same run written again -- its finale replayed -- writes over its own
 * picks and keeps the season before it as it was.
 */
export function recordPastPicks(value, { runId = null, log = [] } = {}, orders = nodeOrders, scenes = nodes) {
  const record = normalizePastPicksRecord(value);
  const again = typeof runId === "string" && record.runId === runId;
  return {
    v: 1,
    runId: typeof runId === "string" ? runId : null,
    picks: encodePicks(picksFromLog(log, scenes), orders, scenes),
    before: again ? record.before : record.picks,
  };
}

/** The season before `runId`'s picks: the record's, or what it held before that run wrote it. */
export function pastPicks(value, runId = null, orders = nodeOrders, scenes = nodes) {
  const record = normalizePastPicksRecord(value);
  return decodePicks(typeof runId === "string" && record.runId === runId ? record.before : record.picks, orders, scenes);
}

export function readPastPicksRecord() {
  try {
    return normalizePastPicksRecord(JSON.parse(readStoredValue(PAST_PICKS_KEY, "null")));
  } catch {
    return normalizePastPicksRecord(null);
  }
}

/** Writes a finished season's picks to the device over the last season's. Returns the record as it now stands. */
export function storePastPicks({ runId = null, log = [] } = {}) {
  const before = readPastPicksRecord();
  const after = recordPastPicks(before, { runId, log });
  const written = JSON.stringify(after);
  if (written !== JSON.stringify(before)) writeStoredValue(PAST_PICKS_KEY, written);
  return after;
}

/** The card the season before picked in this scene, or null: no pick, not a NEW GAME+ run, or nothing kept. */
export function getPastPick(past, nodeId) {
  if (!(past instanceof Map) || past.size === 0 || typeof nodeId !== "string") return null;
  return past.get(nodeId) ?? null;
}
