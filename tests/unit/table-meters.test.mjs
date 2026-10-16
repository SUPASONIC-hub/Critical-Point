import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BASE_SCHEMA, GAUGE_MAX, getCardChips, getFocusBonus, getForcedCard, getHeartbeatBpm, getMultiplier, getRemainingSeconds,
  getSealedCardId, readRoomCards,
} from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";

/**
 * The table's HUD numbers and the two cards the room picks moved out of
 * GauntletStage into one readout each (2026-10-16), so the stage imports two
 * names where it imported seven. These hold the readouts to the engine calls
 * the stage used to make inline: same inputs, same numbers.
 */

const card = (id, effect) => ({ id, type: "analysis", effect });
const HAND = [card("small", { trust: 1 }), card("big", { trust: 4, legitimacy: -3 }), card("brutal", { legitimacy: -9 })];

function windowAt(extra = {}) {
  return {
    gauge: 30, wall: 70, tellOffset: 4, focus: 40, focusMode: "steady", elapsed: 12,
    schema: { ...BASE_SCHEMA, seconds: 45 }, ...extra,
  };
}

test("the HUD's numbers are the engine's, read the way the stage read them", () => {
  const schema = { ...BASE_SCHEMA, seconds: 45 };
  const win = windowAt();
  const meters = readTableMeters({ win, schema, selectedCard: HAND[1] });
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  assert.equal(meters.selectedChips, getCardChips(HAND[1], schema));
  assert.equal(meters.multiplier, getMultiplier(win.gauge));
  assert.deepEqual(meters.focusBonus, getFocusBonus(win.focus, win.focusMode));
  assert.equal(meters.remaining, getRemainingSeconds(win));
  assert.equal(meters.bpm, getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, schema.sedated, win.elapsed / schema.seconds));
  assert.equal(meters.nextLow, nextLow);
  assert.equal(meters.nextHigh, nextHigh);
  assert.equal(meters.nextMultiplierLow, getMultiplier(nextLow));
  assert.equal(meters.nextMultiplierHigh, getMultiplier(nextHigh));
});

test("no staked card reads zero chips, and the next push's range stops at the top of the gauge", () => {
  const meters = readTableMeters({ win: windowAt({ gauge: GAUGE_MAX - 2 }), schema: BASE_SCHEMA, selectedCard: null });
  assert.equal(meters.selectedChips, 0);
  assert.equal(meters.nextLow, GAUGE_MAX);
  assert.equal(meters.nextHigh, GAUGE_MAX);
});

test("the heartbeat hears the tell wall, and a window saved without a tell hears the wall", () => {
  const schema = BASE_SCHEMA;
  const withTell = readTableMeters({ win: windowAt({ gauge: 60 }), schema, selectedCard: null });
  const noTell = readTableMeters({ win: windowAt({ gauge: 60, tellOffset: undefined }), schema, selectedCard: null });
  assert.equal(withTell.bpm, getHeartbeatBpm(60, 74, schema.sedated, 12 / schema.seconds));
  assert.equal(noTell.bpm, getHeartbeatBpm(60, 70, schema.sedated, 12 / schema.seconds));
});

test("the room's two cards are the sealed one and the forced one, read once", () => {
  const sealed = { ...BASE_SCHEMA, sealHighest: true };
  for (const schema of [BASE_SCHEMA, sealed]) {
    const read = readRoomCards(HAND, schema);
    assert.equal(read.sealedId, getSealedCardId(HAND, schema));
    assert.equal(read.forcedCard, getForcedCard(HAND, schema));
  }
  assert.deepEqual(readRoomCards([], BASE_SCHEMA), { sealedId: null, forcedCard: null }, "an empty hand has neither");
});
