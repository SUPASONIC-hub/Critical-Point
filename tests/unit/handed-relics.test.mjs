import assert from "node:assert/strict";
import test from "node:test";
import { drawRelicOffer, getRerollSeed, normalizeRelicDraft, normalizeRunState, openRelicDraft, rerollRelicOffer, RULES_MARK_KEY } from "../../src/gauntlet/gauntletEngine.js";
import { DEFAULT_RELIC_POOL, HANDED_BY, HANDED_RELICS, handedSideOf, RELIC_IDS } from "../../src/gauntlet/relics.js";
import { recheckRelicDraft } from "../../src/rankingRecheck.js";

// G33 (RULES_MARK 9): one draft card handed over by the side the case closed on.
test("the side: the logic hold's direction, the record when none was held", () => {
  assert.equal(handedSideOf("people"), "people");
  assert.equal(handedSideOf("position"), "position");
  assert.equal(handedSideOf(null), "record");
  assert.equal(handedSideOf("even"), "record");
  for (const side of Object.keys(HANDED_RELICS)) {
    assert.equal(typeof HANDED_BY[side], "string");
    assert.ok(HANDED_RELICS[side].every((id) => RELIC_IDS.includes(id)), side);
  }
});

test("the handed card comes first, the others as the seed drew them", () => {
  for (const seed of ["a", "case01:9", "case12:40", "x"]) {
    const plain = drawRelicOffer(seed);
    assert.deepEqual(drawRelicOffer(seed, DEFAULT_RELIC_POOL, [], null), plain, "no side: as before");
    for (const side of Object.keys(HANDED_RELICS)) {
      const offer = drawRelicOffer(seed, DEFAULT_RELIC_POOL, [], side);
      assert.equal(offer.length, 3);
      assert.ok(HANDED_RELICS[side].includes(offer[0]), `${seed} ${side}: ${offer}`);
      assert.equal(new Set(offer).size, 3);
    }
  }
  // Every tool of the side held: no card is handed over.
  const owned = HANDED_RELICS.people.filter((id) => DEFAULT_RELIC_POOL.includes(id));
  assert.deepEqual(drawRelicOffer("a", DEFAULT_RELIC_POOL, owned, "people"), drawRelicOffer("a", DEFAULT_RELIC_POOL, owned));
});

test("the draft keeps its side, and the reroll draws with it", () => {
  const { relicDraft } = openRelicDraft("seed-1", DEFAULT_RELIC_POOL, [], "position");
  assert.equal(relicDraft.side, "position");
  assert.equal(normalizeRelicDraft({ ...relicDraft, side: "nobody" }).side, undefined);
  const run = normalizeRunState({ vault: 100_000, ...openRelicDraft("seed-1", DEFAULT_RELIC_POOL, [], "position") });
  const rerolled = rerollRelicOffer(run);
  assert.deepEqual(rerolled.relicOffer, drawRelicOffer(getRerollSeed("seed-1"), DEFAULT_RELIC_POOL, [], "position"));
});

test("the server's recheck: a mark 9 row draws with its side, a row of 8 has none", () => {
  const row = (mark, side) => {
    const { relicDraft } = openRelicDraft("seed-2", DEFAULT_RELIC_POOL, [], side);
    return { case_id: "case05", dynamics: { [RULES_MARK_KEY]: mark, open: { relics: [] } }, summary: {}, decision_log: [{ relicDraft: { ...relicDraft, picked: [relicDraft.offer[0]] } }] };
  };
  assert.deepEqual(recheckRelicDraft(row(9, "people")).findings, []);
  assert.deepEqual(recheckRelicDraft(row(8, null)).findings, []);
  assert.deepEqual(recheckRelicDraft(row(8, "people")).findings[0]?.differs, ["side"]);
  assert.ok(recheckRelicDraft(row(9, null)).findings[0]?.differs.includes("side"));
  const forged = row(9, "people");
  forged.decision_log[0].relicDraft.side = "record";
  assert.ok(recheckRelicDraft(forged).findings[0]?.differs.includes("offer"), "the offer is the side's");
});
