/**
 * E-1 = B-14(3), the second season's reading (개선 포인트 3-5절): which scenes
 * this device has read in a finished season, so a NEW GAME+ season can fold
 * the body of a scene read before and mark a scene never read `NEW`.
 *
 * What is kept is a bit per scene, case by case, in the order the case's
 * graph lists its scenes (gameData's `nodeOrders`): 1,129 scenes come to a
 * about 1,300 characters with every one read. Each case's bits carry a fingerprint of that order,
 * so a case whose scenes were added to or moved since reads as unread rather
 * than as somebody else's scenes.
 *
 * It is written once a season, when its finale closes (useNewGamePlus.unlock),
 * from the season's log, and never while a season is played: what a season
 * reads is what the seasons before it read. The run that wrote it keeps the
 * set as it stood before (`before`), so a case replayed after its own finale
 * still reads the seasons before it and not itself.
 *
 * The scene's fold and its NEW ride on the page the case opens on
 * (secondSeason.getSeasonPage, `read`) and are drawn by SceneBriefing.
 */
import { SEEN_SCENES_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";
import { nodeOrders } from "../gameData.js";

// Spelled in appConfig.js, where the online save (cloudSave.js) reads it without the scene graph.
export { SEEN_SCENES_KEY };

const BITS = 5;

/** FNV-1a over the case's scene ids, in base 36: the order the bits were written in. */
export function orderFingerprint(order) {
  let hash = 0x811c9dc5;
  for (const char of order.join("\n")) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

/** A case's read scenes as `fingerprint:bits`, five scenes to a base-32 digit, or null when none is read. */
export function encodeCase(order, seen) {
  let bits = "";
  for (let at = 0; at < order.length; at += BITS) {
    let digit = 0;
    for (let bit = 0; bit < BITS; bit += 1) if (seen.has(order[at + bit])) digit |= 1 << bit;
    bits += digit.toString(32);
  }
  bits = bits.replace(/0+$/, "");
  return bits ? `${orderFingerprint(order)}:${bits}` : null;
}

/** The scene ids `encodeCase` wrote, or none when the case's order has changed since. */
export function decodeCase(order, value) {
  const [print, bits] = typeof value === "string" ? value.split(":") : [];
  if (!bits || print !== orderFingerprint(order) || !/^[0-9a-v]+$/.test(bits)) return [];
  const ids = [];
  for (let at = 0; at < bits.length; at += 1) {
    const digit = parseInt(bits[at], 32);
    for (let bit = 0; bit < BITS; bit += 1) if (digit & (1 << bit) && order[at * BITS + bit]) ids.push(order[at * BITS + bit]);
  }
  return ids;
}

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Every case's read scenes, from what `encodeSeen` wrote. */
export function decodeSeen(cases, orders = nodeOrders) {
  const seen = new Set();
  if (!isPlainObject(cases)) return seen;
  for (const [caseId, value] of Object.entries(cases)) {
    if (Object.hasOwn(orders, caseId)) for (const id of decodeCase(orders[caseId], value)) seen.add(id);
  }
  return seen;
}

/** The read scenes as `{ caseId: "fingerprint:bits" }`, only the cases with one. */
export function encodeSeen(seen, orders = nodeOrders) {
  const cases = {};
  for (const [caseId, order] of Object.entries(orders)) {
    const value = encodeCase(order, seen);
    if (value) cases[caseId] = value;
  }
  return cases;
}

export function normalizeSeenRecord(value) {
  const record = isPlainObject(value) && value.v === 1 ? value : {};
  return {
    v: 1,
    runId: typeof record.runId === "string" ? record.runId : null,
    scenes: isPlainObject(record.scenes) ? record.scenes : {},
    before: isPlainObject(record.before) ? record.before : {},
  };
}

/**
 * The record with a finished season's log counted in. A run counted again --
 * its finale replayed -- adds to what the seasons before it read, not to
 * what it already wrote over them.
 */
export function recordSeenScenes(value, { runId = null, log = [] } = {}, orders = nodeOrders) {
  const record = normalizeSeenRecord(value);
  const again = typeof runId === "string" && record.runId === runId;
  const before = again ? record.before : record.scenes;
  const seen = decodeSeen(before, orders);
  for (const entry of Array.isArray(log) ? log : []) if (typeof entry?.nodeId === "string") seen.add(entry.nodeId);
  for (const id of decodeSeen(again ? record.scenes : {}, orders)) seen.add(id);
  return { v: 1, runId: typeof runId === "string" ? runId : null, scenes: encodeSeen(seen, orders), before };
}

/** The scenes the seasons before `runId` read: the whole record, or what it held before that run wrote it. */
export function pastSeenScenes(value, runId = null, orders = nodeOrders) {
  const record = normalizeSeenRecord(value);
  return decodeSeen(typeof runId === "string" && record.runId === runId ? record.before : record.scenes, orders);
}

export function readSeenRecord() {
  try {
    return normalizeSeenRecord(JSON.parse(readStoredValue(SEEN_SCENES_KEY, "null")));
  } catch {
    return normalizeSeenRecord(null);
  }
}

/** Counts a finished season's log into the device's record. Returns the record as it now stands. */
export function storeSeenScenes({ runId = null, log = [] } = {}) {
  const before = readSeenRecord();
  const after = recordSeenScenes(before, { runId, log });
  const written = JSON.stringify(after);
  if (written !== JSON.stringify(before)) writeStoredValue(SEEN_SCENES_KEY, written);
  return after;
}

/**
 * The page's `read`: true for a scene a season before this one read, false
 * for one none did -- the NEW mark -- and null when there is nothing to tell
 * it by: not a NEW GAME+ run, or a device that kept no scene of one.
 */
export function getSceneRead(past, nodeId) {
  if (!(past instanceof Set) || past.size === 0 || typeof nodeId !== "string") return null;
  return past.has(nodeId);
}
