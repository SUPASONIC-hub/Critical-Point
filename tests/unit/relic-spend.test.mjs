import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { recheckChain } from "../../src/chainRecheck.js";
import {
  BREATHER_MARK,
  buyExtraRelic,
  createCaseClose,
  drawRelicOffer,
  equipRelic,
  getRelicDraftCost,
  getRerollSeed,
  normalizeRelicDraft,
  normalizeRunState,
  openCaseRun,
  openRelicDraft,
  rerollRelicOffer,
  resolveWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { DEFAULT_RELIC_POOL, RELIC_EXTRA_COST, RELIC_IDS, RELIC_REROLL_COST, RELIC_SLOTS } from "../../src/gauntlet/relics.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { getRowDraftCost, recheckRelicDraft, recheckRun, RELIC_DRAFT_MARK } from "../../src/rankingRecheck.js";
import { DB_MARKS, marksSql } from "../../scripts/verify-ranking-rows.mjs";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * C9 (design-kd-spend-relic.md, the user's answers of 2026-11-04, all 1): the
 * KD은행 계좌 pays at a closed case's draft -- RELIC_REROLL_COST for the three
 * drawn again, RELIC_EXTRA_COST for one more relic out of them, each once a
 * draft, out of the vault at the press. Neither touches the pot, the wall or
 * the gauge. The draft's record goes on the next decision's log entry, and the
 * server draws it again (rankingRecheck.js) and lets the chain's vault go down
 * by what it cost (chainRecheck.js).
 */

const SEED = "run-x:41:p4_result";
/** A run at a closed case's draft: the vault it holds, the relics it carries. */
function atDraft({ vault = 30000, relics = [], pool = DEFAULT_RELIC_POOL, seed = SEED, ...rest } = {}) {
  const drafted = openRelicDraft(seed, pool, relics);
  return normalizeRunState({ vault, handVault: Math.min(5000, vault), runPot: 0, relics, ...drafted, schema: { mutations: ["reboot"] }, ...rest });
}

test("prices: a reroll is about a quarter of a case's vault, one more about two thirds", () => {
  assert.deepEqual([RELIC_REROLL_COST, RELIC_EXTRA_COST], [4000, 12000]);
  assert.equal(getRelicDraftCost(null), 0);
  assert.equal(getRelicDraftCost({ reroll: { offer: [] }, extra: true }), RELIC_REROLL_COST + RELIC_EXTRA_COST);
});

test("a draft is drawn from its seed, and its reroll from the reroll seed: the same three every time", () => {
  const first = openRelicDraft(SEED, DEFAULT_RELIC_POOL, ["insurance"]);
  assert.deepEqual(first, openRelicDraft(SEED, DEFAULT_RELIC_POOL, ["insurance"]));
  assert.deepEqual(first.relicOffer, drawRelicOffer(SEED, DEFAULT_RELIC_POOL, ["insurance"]));
  assert.ok(!first.relicOffer.includes("insurance"), "a held relic is never offered");
  assert.deepEqual(first.relicDraft, { seed: SEED, pool: [...DEFAULT_RELIC_POOL], owned: ["insurance"], offer: first.relicOffer, reroll: null, extra: false, picked: [], cost: 0 });
  const rerolled = rerollRelicOffer(atDraft({ relics: ["insurance"] }));
  assert.deepEqual(rerolled.relicOffer, drawRelicOffer(getRerollSeed(SEED), DEFAULT_RELIC_POOL, ["insurance"]));
  assert.deepEqual(rerolled, rerollRelicOffer(atDraft({ relics: ["insurance"] })), "a reload rerolls to the same three");
  assert.deepEqual(rerolled.relicDraft.reroll, { offer: rerolled.relicOffer });
  // Nothing left to offer: no draft.
  assert.deepEqual(openRelicDraft(SEED, ["insurance"], ["insurance"]), { relicOffer: [], relicDraft: null });
});

test("a reroll is paid out of the vault and moves nothing else", () => {
  const before = atDraft({ vault: 9000, handVault: 7000, runPot: 0 });
  const after = rerollRelicOffer(before);
  assert.equal(after.vault, 9000 - RELIC_REROLL_COST);
  assert.equal(after.handVault, 9000 - RELIC_REROLL_COST, "the hand's share is never more than the vault");
  assert.equal(after.seasonSpent, RELIC_REROLL_COST);
  assert.equal(after.lastChange, -RELIC_REROLL_COST, "the bank rail's 방금 shows it");
  assert.equal(after.relicDraft.cost, RELIC_REROLL_COST);
  // The pot, the board, the relics held, the season's won and lost columns: as they were.
  for (const key of ["runPot", "schema", "relics", "seasonGained", "seasonLost", "windowIndex", "busts", "cashes"]) assert.deepEqual(after[key], before[key], key);
});

test("a reroll is once a draft, before a pick, with the money in the vault", () => {
  const once = rerollRelicOffer(atDraft());
  assert.deepEqual(rerollRelicOffer(once), once, "a second reroll changes nothing");
  const short = atDraft({ vault: RELIC_REROLL_COST - 1 });
  assert.deepEqual(rerollRelicOffer(short), short, "a vault short of the price pays nothing");
  const taken = equipRelic(atDraft(), atDraft().relicOffer[0]);
  assert.deepEqual(rerollRelicOffer(taken), taken, "nothing to reroll once the draft is answered");
  // A save from before the record has no draft to price: it picks as it always did.
  const old = normalizeRunState({ ...atDraft(), relicDraft: null });
  assert.deepEqual(rerollRelicOffer(old), old);
  assert.deepEqual(buyExtraRelic(old), old);
});

test("one more relic: paid once, then two picks out of the three", () => {
  const start = atDraft({ vault: 20000 });
  const bought = buyExtraRelic(start);
  assert.equal(bought.vault, 20000 - RELIC_EXTRA_COST);
  assert.equal(bought.relicDraft.extra, true);
  assert.deepEqual(buyExtraRelic(bought), bought, "once a draft");
  const [first, second] = start.relicOffer;
  const one = equipRelic(bought, first);
  assert.deepEqual(one.relics, [first]);
  assert.deepEqual(one.relicOffer, start.relicOffer.filter((id) => id !== first), "the other two stay for the second pick");
  assert.deepEqual(rerollRelicOffer(one), one, "no reroll between the two picks");
  const two = equipRelic(one, second);
  assert.deepEqual(two.relics, [first, second]);
  assert.deepEqual(two.relicOffer, []);
  assert.deepEqual(two.relicDraft.picked, [first, second]);
  assert.equal(two.relicDraft.cost, RELIC_EXTRA_COST);
  // A pass after paying ends the draft; the money stays spent.
  const passed = equipRelic(bought, null);
  assert.deepEqual([passed.relicOffer, passed.vault], [[], 20000 - RELIC_EXTRA_COST]);
  // ... and is a choice, not 「숨 고르기」 (2026-11-05 decision): only a pass on a draft nothing was bought at is dealt the breather (C-7).
  assert.ok(!passed.schema.mutations.includes(BREATHER_MARK));
  assert.ok(!equipRelic(one, null).schema.mutations.includes(BREATHER_MARK));
  assert.ok(equipRelic(atDraft({ vault: 20000 }), null).schema.mutations.includes(BREATHER_MARK));
  // Short of the price, or with one relic left to offer, there is nothing to buy.
  assert.deepEqual(buyExtraRelic(atDraft({ vault: RELIC_EXTRA_COST - 1 })), atDraft({ vault: RELIC_EXTRA_COST - 1 }));
  const lone = atDraft({ pool: ["insurance"] });
  assert.equal(lone.relicOffer.length, 1);
  assert.deepEqual(buyExtraRelic(lone), lone);
});

test("one more keeps to the five slots: with them full each pick is a swap", () => {
  // The relics outside the default pool (four since the rules bundle's catalogue), filled out of the pool to the five slots; the draft draws from the rest.
  const held = [...RELIC_IDS.filter((id) => !DEFAULT_RELIC_POOL.includes(id)), ...DEFAULT_RELIC_POOL].slice(0, RELIC_SLOTS);
  assert.equal(held.length, RELIC_SLOTS);
  const bought = buyExtraRelic(atDraft({ relics: held, vault: 40000 }));
  const [first, second] = bought.relicOffer;
  assert.deepEqual(equipRelic(bought, first), bought, "a take with the slots full and nothing put down takes nothing");
  const one = equipRelic(bought, first, held[0]);
  const two = equipRelic(one, second, held[1]);
  assert.equal(two.relics.length, RELIC_SLOTS);
  assert.deepEqual(two.relics, [first, second, ...held.slice(2)]);
});

test("both, the reroll first: 16,000 and two picks out of the new three", () => {
  const run = buyExtraRelic(rerollRelicOffer(atDraft({ vault: 16000 })));
  assert.equal(run.vault, 0);
  assert.equal(run.relicDraft.cost, RELIC_REROLL_COST + RELIC_EXTRA_COST);
  assert.equal(run.seasonSpent, RELIC_REROLL_COST + RELIC_EXTRA_COST);
  assert.equal(getRelicDraftCost(run.relicDraft), run.relicDraft.cost);
});

test("a replay and a story case cannot pay; a week's rule and NEW GAME+ can", () => {
  const story = atDraft({ story: true });
  assert.deepEqual(rerollRelicOffer(story), story);
  assert.deepEqual(buyExtraRelic(story), story);
  for (const extra of [{ weekRule: "audit" }, { veteran: true }]) {
    const run = atDraft(extra);
    assert.equal(rerollRelicOffer(run).vault, run.vault - RELIC_REROLL_COST, JSON.stringify(extra));
  }
  // A replay opens with the season's draft put away, so there is nothing on its table to pay for.
  const replay = openCaseRun(atDraft(), { replayOf: { pushRecord: null } });
  assert.deepEqual([replay.relicOffer, replay.relicDraft], [[], null]);
  assert.ok(replay.practice.relicDraft, "the draft waits with the rest of the season");
  assert.deepEqual(rerollRelicOffer(replay), normalizeRunState(replay));
});

test("the close deals the draft, the next window settles it away, and a save keeps it whole", () => {
  const window = { status: "cashed", cause: "cash", gauge: 40, wall: 95, pushes: 2, seed: SEED };
  const card = { id: "a", label: "a", effect: { capital: 5 }, next: "x" };
  const closed = resolveWindow({ run: openCaseRun({}), window, card, caseClosed: true, offerRelics: true }).nextRun;
  assert.deepEqual(closed.relicDraft, openRelicDraft(SEED, DEFAULT_RELIC_POOL, []).relicDraft);
  assert.deepEqual(createCaseClose(closed).seasonSpent, 0);
  const opened = openCaseRun(closed);
  assert.deepEqual(opened.relicDraft, closed.relicDraft, "the next case opens with it, where the page answers it");
  const answered = equipRelic(rerollRelicOffer(opened), rerollRelicOffer(opened).relicOffer[0]);
  assert.deepEqual(normalizeRunState(JSON.parse(JSON.stringify(answered))), answered, "a save reads back the same");
  const next = resolveWindow({ run: answered, window: { ...window, seed: "next" }, card }).nextRun;
  assert.equal(next.relicDraft, null);
  assert.equal(next.seasonSpent, answered.seasonSpent, "the spent column carries on");
  // A record that is not one reads as none; numbers out of range as nothing paid.
  assert.equal(normalizeRelicDraft({ offer: ["insurance"] }), null);
  assert.equal(normalizeRunState({ seasonSpent: -5 }).seasonSpent, 0);
  assert.deepEqual(normalizeRelicDraft({ seed: 7, offer: ["nope", "insurance"], cost: -3 }), { seed: "7", pool: [], owned: [], offer: ["insurance"], reroll: null, extra: false, picked: [], cost: 0 });
});

/** One season's case rows, as the server stores them, from a bot that pays at every draft. */
function spendingRows(seed, spend) {
  const season = createSeasonBot({ seed, staged: STAGED, spend }).playSeason(0, "money");
  return CASE_SEQUENCE.map((caseId) => ({ run_id: `spend-${seed}`, case_id: caseId, dynamics: season.caseDynamics[caseId], decision_log: season.caseLogs[caseId] }));
}

const spent = spendingRows(20261104, "always");
const draftsOf = (rows) => rows.flatMap((row) => row.decision_log.filter((entry) => entry.relicDraft).map((entry) => entry.relicDraft));

test("an honest season that pays at its drafts chains and draws again with no mark", () => {
  const drafts = draftsOf(spent);
  assert.ok(drafts.some((draft) => draft.reroll) && drafts.some((draft) => draft.extra), "the season paid for both");
  assert.ok(drafts.every((draft) => draft.cost === getRelicDraftCost(draft)));
  const chain = recheckChain(spent);
  assert.deepEqual(chain.breaks, [], JSON.stringify(chain.breaks.slice(0, 3)));
  spent.forEach((row, at) => assert.deepEqual(recheckRelicDraft(row, spent[at - 1] ?? null).findings, [], row.case_id));
  // A bot that never pays writes the same drafts at no cost.
  assert.ok(draftsOf(spendingRows(20261104, "never")).every((draft) => draft.cost === 0));
});

test("a draft edited in the log is marked relic-draft, and a vault taken down past it breaks the chain", () => {
  const at = spent.findIndex((row) => row.decision_log.some((entry) => entry.relicDraft?.cost > 0));
  const edits = {
    offer: (draft) => { draft.offer = [...draft.offer].reverse(); },
    reroll: (draft) => { draft.reroll = { offer: draft.offer }; draft.cost = getRelicDraftCost(draft); },
    cost: (draft) => { draft.cost -= 1000; },
    picked: (draft) => { draft.picked = [RELIC_IDS.find((id) => !(draft.reroll?.offer ?? draft.offer).includes(id))]; },
    ids: (draft) => { draft.pool = [...draft.pool, "goldenTicket"]; },
    owned: (draft) => { draft.owned = draft.owned.length ? [] : ["insurance"]; },
  };
  for (const [name, change] of Object.entries(edits)) {
    const rows = structuredClone(spent);
    change(rows[at].decision_log.find((entry) => entry.relicDraft).relicDraft);
    const found = recheckRelicDraft(rows[at], rows[at - 1]).findings;
    assert.ok(found.length && found[0].differs.includes(name), `${name}: ${JSON.stringify(found)}`);
  }
  // A seed edited draws other three: the offer no longer comes out of it. (With
  // the case before's closing window recorded, the seed itself is read
  // against that window's: verify-ranking-rows.test.mjs's rows carry records.)
  const reseeded = structuredClone(spent);
  const moved = reseeded[at].decision_log.find((entry) => entry.relicDraft).relicDraft;
  moved.seed = `${moved.seed}~1`;
  assert.ok(recheckRelicDraft(reseeded[at], reseeded[at - 1]).findings.length > 0);
  const recorded = structuredClone(spent);
  recorded[at - 1].decision_log.at(-1).replay = { seed: "another window" };
  assert.ok(recheckRelicDraft(recorded[at], recorded[at - 1]).findings[0].differs.includes("seed"));
  // Paid on a story case.
  const story = structuredClone(spent);
  story[at].dynamics.open.story = true;
  assert.ok(recheckRelicDraft(story[at], story[at - 1]).findings[0].differs.includes("spent"));
  // The chain lets the vault go down by what the drafts cost, and no further.
  const cost = getRowDraftCost(spent[at]);
  assert.ok(cost > 0);
  const deeper = structuredClone(spent);
  deeper[at].dynamics.vault = deeper[at - 1].dynamics.vault - cost - 1;
  deeper[at].dynamics.handVault = Math.min(deeper[at].dynamics.handVault, deeper[at].dynamics.vault);
  assert.ok(recheckChain(deeper).breaks.some((found) => found.case === spent[at].case_id && found.field === "vault"));
  const free = structuredClone(spent);
  for (const entry of free[at].decision_log) if (entry.relicDraft) entry.relicDraft.cost = 0;
  if (free[at].dynamics.vault < free[at - 1].dynamics.vault) assert.ok(recheckChain(free).breaks.length > 0, "a spend the log does not admit to");
});

test("the mark is shown, and left out of the database write until the 11-30 migration takes it", () => {
  assert.equal(RELIC_DRAFT_MARK, "relic-draft");
  assert.ok(!DB_MARKS.includes(RELIC_DRAFT_MARK));
  const rows = structuredClone(spent);
  const at = rows.findIndex((row) => row.decision_log.some((entry) => entry.relicDraft));
  rows[at].decision_log.find((entry) => entry.relicDraft).relicDraft.cost += 1;
  const result = recheckRun(rows);
  if (result.status !== "unverified") assert.ok(result.marks.includes(RELIC_DRAFT_MARK));
  const sql = marksSql([{ status: "checked", runId: "run-z", marks: ["score-off-log", RELIC_DRAFT_MARK] }]);
  assert.match(sql, /array\['score-off-log'\]::text\[\]/);
  assert.doesNotMatch(sql, /relic-draft/);
});
