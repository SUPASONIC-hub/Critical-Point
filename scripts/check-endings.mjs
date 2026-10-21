import assert from "node:assert/strict";
import { CASE_SEQUENCE, nodes } from "../src/gameData.js";
import { getEndingVariant, LOGIC_SLACK_STREAK } from "../src/gameLogic.js";
import { FRACTURE_MIN_BURN, getCardBurn, HAND_CAP, resolveWindow } from "../src/gauntlet/gauntletEngine.js";
import { DEFAULT_RELIC_POOL, getRelicPool, getRelicUnlocks, RELIC_IDS, RELIC_SLOTS, RELICS } from "../src/gauntlet/relics.js";
import { STAGED } from "../src/gauntlet/tableUnlocks.js";
import { AUDIT_VALUES, AUDIT_WEEK, CASCADE_WEEK, CHIP_MARGIN, createSeasonBot, LINK_VALUES, newLinkTally, POPULATION } from "./sim/season-bot.mjs";

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

/**
 * The season player, its archetypes and the seeded stream it draws from, are
 * `scripts/sim/season-bot.mjs`. One stream for the whole file: every season
 * below, and the tool hand's and the draft's draws, take their turn in it.
 */
const bot = createSeasonBot({ seed: 20260927, staged });
const { random, pick, playSeason, archetypes: ARCHETYPES } = bot;

/**
 * What a season's windows are counted into, for the measurements at the end of
 * this file (`playSeason`'s `watch`). Nothing here is asserted on, and nothing
 * here draws from the seeded stream.
 *
 * `moves` is what each window did to the logic streak (`advanceLogic`'s move),
 * and `wildMoves` the same for the windows that staked 판을 다시 짠다 alone.
 * `bustAt` files every bust under the push it happened on, or under the clock
 * when no push made it ("creep", "timeout"); `pushed` is how many pushes each
 * window made, so the two together say how often push N is the one that busts.
 */
function watchSeason() {
  const seen = { windows: 0, dealtWild: 0, stakedWild: 0, cashed: 0, busts: 0, moves: {}, wildMoves: {}, streakSum: 0, best: 0, bonusSum: 0, capped: 0, pot: 0, logicPot: 0, banked: 0, bustAt: {}, pushed: {}, fractureDealt: 0, fractureBurn: 0, fracturedBoards: 0 };
  const count = (map, key) => {
    map[key] = (map[key] ?? 0) + 1;
  };
  seen.watch = ({ verdict, card, dealtWild, board }) => {
    const wild = card.type === "reframe";
    seen.windows += 1;
    if (dealtWild) seen.dealtWild += 1;
    if (wild) seen.stakedWild += 1;
    count(seen.moves, verdict.logic.move);
    if (wild) count(seen.wildMoves, verdict.logic.move);
    seen.streakSum += verdict.logic.streak;
    seen.best = Math.max(seen.best, verdict.logic.streak);
    seen.banked += verdict.secured;
    count(seen.pushed, verdict.pushes);
    if (verdict.outcome === "cash") {
      seen.cashed += 1;
      seen.bonusSum += verdict.logic.bonus;
      if (verdict.logic.bonus >= HAND_CAP) seen.capped += 1;
      seen.pot += verdict.pot;
      seen.logicPot += verdict.logic.pot;
    } else {
      seen.busts += 1;
      count(seen.bustAt, verdict.cause === "push" ? verdict.pushes : verdict.cause);
    }
    // FRACTURE: the card's largest burn reached the line (whatever the case's
    // rules), the next board was dealt cracked, and this one was played cracked.
    if (Math.abs(getCardBurn(card, board)?.value ?? 0) >= FRACTURE_MIN_BURN) seen.fractureBurn += 1;
    if (verdict.nextMutations.some((mutation) => mutation.id === "fracture")) seen.fractureDealt += 1;
    if (board.fracturedAxis) seen.fracturedBoards += 1;
  };
  return seen;
}
/** The watched seasons' counts, added up. */
function addSeen(list) {
  const total = watchSeason();
  for (const seen of list) {
    for (const [key, value] of Object.entries(seen)) {
      if (typeof value === "number") total[key] = key === "best" ? Math.max(total.best, value) : total[key] + value;
      else if (typeof value === "object") for (const [inner, amount] of Object.entries(value)) total[key][inner] = (total[key][inner] ?? 0) + amount;
    }
  }
  return total;
}

const counts = new Map();
const byArchetype = {};
const samples = { busts: [], windows: [], clues: [], skipped: [], legitimacy: [], capital: [], trust: [], seasonLegitimacy: [], seasonCapital: [], seasonTrust: [], sustained: [], peak: [], reframes: [], peopleFirst: [] };
const peopleFirstByArchetype = {};
const perCasePeak = CASE_SEQUENCE.map(() => []);
// The logic streak: the longest each season reached and its hold rate, by archetype.
const logicBest = {};
const logicHold = {};
let doorOpen = 0;
let doorMoved = 0;
// Measured for the report at the end of this file, and asserted nowhere: what
// every window of the population did, how many seasons the slack door could
// move at all, and the tools each season ended holding.
const populationSeen = [];
const populationBuilds = [];
let doorCouldMove = 0;
// The ending funnel at the very end of the report: each row's seasons, kept in
// report mode only (`funnelRow`). Filled by the population below and by the
// wild-card hands; it reads the seasons and draws nothing.
const funnelRows = [];
const dump = [];
// AUDIT_WEEK=1 only (B3's test week, season-bot.mjs): the closes the audit took its part of, over the population.
const auditTally = { seasons: 0, caught: 0, lost: 0, secured: 0 };
// CASCADE_WEEK=1 only (B2, season-bot.mjs): the population's links, and what its seasons banked and bust.
const linkTally = { ...newLinkTally(), seasons: 0, vault: 0, windows: 0, seasonBusts: 0 };
const addLinks = (tally, season) => {
  for (const key of Object.keys(season.links)) tally[key] = key === "openingBoards" ? Math.max(tally[key], season.links[key]) : tally[key] + season.links[key];
  if (season.links.boards > 0) tally.seasons += 1;
  tally.vault += season.caseResults.final?.gauntlet?.vault ?? 0;
  tally.windows += season.windows;
  tally.seasonBusts += season.strain.seasonBusts;
};
for (let index = 0; index < SEASONS; index += 1) {
  const archetype = POPULATION[index % POPULATION.length];
  const seen = watchSeason();
  const season = playSeason(index, archetype, false, seen.watch);
  populationSeen.push(seen);
  populationBuilds.push(season.relics);
  if (season.audits.caught > 0) auditTally.seasons += 1;
  for (const key of ["caught", "lost", "secured"]) auditTally[key] += season.audits[key];
  addLinks(linkTally, season);
  if (reportMode) funnelRow(archetype).push(funnelSeason(season));
  const closesOn = (seasonBestLogic) => getEndingVariant({ resources: season.final.resources, discoveredClues: season.discoveredClues, log: season.final.log, ...season.strain, seasonBestLogic }).id;
  if (closesOn(0) !== closesOn(LOGIC_SLACK_STREAK)) doorCouldMove += 1;
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
  // The slack door: whether the streak opened it, and whether the ending
  // would be another without it.
  if (season.strain.seasonBestLogic >= LOGIC_SLACK_STREAK) {
    doorOpen += 1;
    const shut = getEndingVariant({ resources: season.final.resources, discoveredClues: season.discoveredClues, log: season.final.log, ...season.strain, seasonBestLogic: 0 });
    if (shut.id !== season.ending.id) doorMoved += 1;
  }
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
/**
 * B2's links, measured (CASCADE_WEEK=1 only; the design's 3-2 and 3-3). The
 * population's line, then the hands that read the card's link mark: each
 * archetype plays the same seasons three times on the same seeds, as itself,
 * keeping clear of a card that makes a link (season-bot.mjs `avoidsLinks`),
 * and keeping clear unless the card's chips are worth the board
 * (`readsChips`, B2 decision 3 (1)). If reading the mark does not lose less
 * to CASCADE, B2 is a tax, not a decision (design 6, risk 1). The links a case
 * closes on go to the next case (decision 6 (2)). Nothing here is asserted.
 */
if (CASCADE_WEEK) {
  const boardBusts = (tally) => `${((tally.busts / Math.max(1, tally.boards)) * 100).toFixed(1)}%`;
  const describe = (tally, seasons) => `per season made ${(tally.made / seasons).toFixed(2)}, came back ${(tally.landed / seasons).toFixed(2)} (${(tally.landedIn / seasons).toFixed(2)} carried in), carried ${(tally.carriedOut / seasons).toFixed(2)}, lapsed at the season's end ${(tally.lapsed / seasons).toFixed(2)} and at the cap ${(tally.capped / seasons).toFixed(2)} (${(((tally.lapsed + tally.capped) / Math.max(1, tally.made)) * 100).toFixed(1)}% of made); at most ${tally.openingBoards} of a case's first two boards CASCADE; CASCADE boards ${tally.boards} in ${tally.seasons} of ${seasons} seasons, bust on them ${boardBusts(tally)} (every board ${((tally.seasonBusts / Math.max(1, tally.windows)) * 100).toFixed(1)}%); final vault ${Math.round(tally.vault / seasons)} a season`;
  console.log(`CASCADE (measured, CASCADE_WEEK=1, values ${LINK_VALUES}, chip margin ${CHIP_MARGIN}): ${describe(linkTally, SEASONS)}`);
  const PAIRED = Number(process.env.ENDING_LINK_SEASONS) || 40;
  const reads = createSeasonBot({ seed: 20261020, staged, archetypes: Object.fromEntries(Object.entries(ARCHETYPES).flatMap(([name, base]) => [[name, base], [`${name}+reads`, { ...base, avoidsLinks: true }], [`${name}+chips`, { ...base, avoidsLinks: true, readsChips: true }]])) });
  for (const archetype of [...new Set(POPULATION)]) {
    const side = () => ({ ...newLinkTally(), seasons: 0, vault: 0, windows: 0, seasonBusts: 0 });
    const sides = { plays: side(), reads: side(), chips: side() };
    let moved = 0;
    let movedChips = 0;
    for (let index = 0; index < PAIRED; index += 1) {
      const endings = [];
      for (const [side, name] of [["plays", archetype], ["reads", `${archetype}+reads`], ["chips", `${archetype}+chips`]]) {
        reads.reseed((20261020 + Math.imul(index + 1, 2654435761)) >>> 0);
        const season = reads.playSeason(`links:${index}`, name);
        addLinks(sides[side], season);
        endings.push(season.ending.id);
      }
      if (endings[0] !== endings[1]) moved += 1;
      if (endings[0] !== endings[2]) movedChips += 1;
    }
    console.log(`CASCADE (measured) ${archetype.padEnd(13)} plays: ${describe(sides.plays, PAIRED)}`);
    console.log(`CASCADE (measured) ${archetype.padEnd(13)} reads the mark: ${describe(sides.reads, PAIRED)}; ending differs in ${moved} of ${PAIRED}`);
    console.log(`CASCADE (measured) ${archetype.padEnd(13)} reads the chips: ${describe(sides.chips, PAIRED)}; ending differs in ${movedChips} of ${PAIRED}`);
  }
}

// min / p10 / p50 / p90 / max. The ending's slack door reads the season's best
// streak (`LOGIC_SLACK_STREAK`), so the line after says how many seasons it
// opened for and how many of those it gave a different ending.
const fiveNumbers = (values) => `${Math.min(...values)}/${band(values)}/${Math.max(...values)}`;
const byHand = (samplesByHand) => Object.entries(samplesByHand).map(([name, values]) => `${name} ${fiveNumbers(values)}`).join(", ");
console.log(`Logic streak (season best, min/p10/p50/p90/max: all ${fiveNumbers(Object.values(logicBest).flat())}; ${byHand(logicBest)}; hold rate: all ${fiveNumbers(Object.values(logicHold).flat())}; ${byHand(logicHold)})`);
console.log(`Slack door (a season's best streak of ${LOGIC_SLACK_STREAK} or more): open in ${doorOpen} of ${SEASONS} seasons (${((doorOpen / SEASONS) * 100).toFixed(1)}%); ${doorMoved} of them close on a different ending than they would with the door shut`);
if (AUDIT_WEEK) console.log(`Audit (measured, AUDIT_WEEK=1, values ${AUDIT_VALUES}): ${auditTally.caught} closes caught in ${auditTally.seasons} of ${SEASONS} seasons (${(auditTally.caught / SEASONS).toFixed(2)} a season), ${((auditTally.lost / Math.max(1, auditTally.secured)) * 100).toFixed(1)}% of what the closes moved to the vault`);

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
 * with no bust to take trust and legitimacy down together, COLD JUSTICE closes
 * one or two story seasons in a hundred (14 of 600 and 59 of 4,800, against 34
 * of 600 at the table) and is asked to be reachable, which is what was decided.
 *
 * The open question is counted and printed, not required. It is the fallback,
 * and a story season that finds its clues rarely falls through to it: 6 of
 * 4,800 replayed seasons, so none in 600 is the usual count. It read as four of
 * 600 while this script handed the clue roll a field the reader does not
 * return (`finalRiskDelta`), which left every card's risk change at zero and
 * the twelve-second rule as the only way to a clue.
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
  const storyMissing = EXPECTED.filter((id) => id !== "collapse" && id !== "open-question" && !storyCounts.has(id));
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

/**
 * Measured, not judged (2026-10-13, the plan's "규칙 측정"): report mode only,
 * after everything above, so every season above is the season it always was
 * and no number, floor or exit code moves. Nothing below is asserted.
 *
 * The first part is a hand that stakes 판을 다시 짠다 on every scene that deals
 * it and otherwise picks as the `balanced` archetype does, beside that
 * archetype on the same seasons: the seeded stream is set again before each
 * season, the same for both hands, so the two are the same player (heat, tell,
 * origin) at the same walls and differ in the one habit. The question it is
 * here for is whether the wild card is a way never to lose the logic streak.
 * It is not a free one: the card has a type of its own (`getLogicType`: 판
 * 바꾸기), so staking it after another type is a change of type like any other.
 *
 * The second part reads the population above for the plan's other suspicions:
 * what the streak pays and whether its door moves an ending, which push a bust
 * happens on, how many different sets of tools seasons end with, and how often
 * a card burns enough to crack the next board.
 */
if (reportMode) {
  const WILD_SEASONS = Number(process.env.ENDING_WILD_SEASONS) || 80;
  const per = (part, whole, digits = 1) => ((100 * part) / Math.max(1, whole)).toFixed(digits);
  ARCHETYPES["stakes the wild card"] = { ...ARCHETYPES.balanced, wildOnly: true };
  const hands = { "ordinary (balanced)": "balanced", "stakes the wild card": "stakes the wild card" };
  console.log(`Wild card only (measured, not asserted; ${WILD_SEASONS} seasons a hand, the same players at the same walls; streaks are min/p10/p50/p90/max of a season's longest)`);
  for (const [name, archetype] of Object.entries(hands)) {
    const played = Array.from({ length: WILD_SEASONS }, (_, index) => {
      bot.reseed((20260927 + Math.imul(index + 1, 2654435761)) >>> 0);
      const seen = watchSeason();
      const season = playSeason(`wild:${index}`, archetype, false, seen.watch);
      return { seen, season };
    });
    const total = addSeen(played.map((entry) => entry.seen));
    const endings = new Map();
    for (const { season } of played) endings.set(season.ending.id, (endings.get(season.ending.id) ?? 0) + 1);
    funnelRow(`${name}, the wild-card seasons`).push(...played.map((entry) => funnelSeason(entry.season)));
    const moves = (map) => ["build", "grow", "switch", "keep", "break", "bust", "none"].map((move) => `${move} ${map[move] ?? 0}`).join(", ");
    console.log(
      `  ${name}: windows a season ${(total.windows / WILD_SEASONS).toFixed(0)}, wild card dealt on ${per(total.dealtWild, total.windows)}% and staked on ${per(total.stakedWild, total.windows)}%; longest streak ${fiveNumbers(played.map((entry) => entry.seen.best))}, mean streak over every window ${(total.streakSum / total.windows).toFixed(2)}; streak ended by a change of type on ${per(total.moves.break ?? 0, total.windows)}% of windows (${((total.moves.break ?? 0) / WILD_SEASONS).toFixed(1)} a season) and by a bust on ${per(total.moves.bust ?? 0, total.windows)}% (${((total.moves.bust ?? 0) / WILD_SEASONS).toFixed(1)} a season); hold rate ${fiveNumbers(played.map((entry) => entry.season.logic.logicHold ?? 0))}; pot bonus x${(total.bonusSum / Math.max(1, total.cashed)).toFixed(3)} over cashed windows, at the cap on ${per(total.capped, total.cashed)}%; banked a season ${fiveNumbers(played.map((entry) => entry.seen.banked))} (mean ${Math.round(total.banked / WILD_SEASONS)}), the streak's share of the pots ${per(total.logicPot, total.pot)}%; slack door open in ${played.filter((entry) => entry.season.strain.seasonBestLogic >= LOGIC_SLACK_STREAK).length} seasons`,
    );
    console.log(`    moves: ${moves(total.moves)}${total.stakedWild ? `; on the wild card alone: ${moves(total.wildMoves)}` : ""}`);
    console.log(`    endings: ${EXPECTED.map((id) => `${id} ${endings.get(id) ?? 0}`).join(", ")}`);
  }

  const all = addSeen(populationSeen);
  const meanBonus = all.bonusSum / Math.max(1, all.cashed);
  // The pot doubles every 11 points of heat (`getMultiplier`), so a bonus is worth this much heat.
  const asHeat = (bonus) => (Math.log2(bonus) * 11).toFixed(1);
  console.log(
    `Streak's weight (measured, the ${SEASONS} seasons above): pot bonus x${meanBonus.toFixed(3)} over cashed windows (the heat of ${asHeat(meanBonus)} points; the cap x${HAND_CAP} is ${asHeat(HAND_CAP)} points and the smallest push is 7), at the cap on ${per(all.capped, all.cashed)}% of them; the streak's share of every pot cashed ${per(all.logicPot, all.pot)}%; the slack door would give ${doorCouldMove} of ${SEASONS} seasons a different ending if it were open for all of them (open in ${doorOpen}, moved ${doorMoved})`,
  );
  const pushedAtLeast = (push) => Object.entries(all.pushed).reduce((sum, [pushes, windows]) => sum + (Number(pushes) >= push ? windows : 0), 0);
  const early = [1, 2, 3].reduce((sum, push) => sum + (all.bustAt[push] ?? 0), 0);
  const byClock = (all.bustAt.creep ?? 0) + (all.bustAt.timeout ?? 0);
  console.log(
    `Busts by push (measured, the ${SEASONS} seasons above): ${all.busts} busts in ${all.windows} windows; on push 1-3: ${early} (${per(early, all.busts)}% of busts); ${[1, 2, 3, 4, 5, 6, 7, 8].map((push) => `push ${push}: ${all.bustAt[push] ?? 0} of ${pushedAtLeast(push)} (${per(all.bustAt[push] ?? 0, pushedAtLeast(push))}%)`).join(", ")}; by the clock ${byClock} (creep ${all.bustAt.creep ?? 0}, timeout ${all.bustAt.timeout ?? 0})`,
  );
  const builds = new Map();
  for (const relics of populationBuilds) {
    const key = [...relics].sort().join("+") || "(none)";
    builds.set(key, (builds.get(key) ?? 0) + 1);
  }
  const commonest = [...builds.entries()].sort((a, b) => b[1] - a[1])[0];
  const wholePool = populationBuilds.filter((relics) => DEFAULT_RELIC_POOL.every((id) => relics.includes(id))).length;
  console.log(
    `Tools at the season's end (measured, the ${SEASONS} seasons above; ${RELIC_IDS.length} tools, ${DEFAULT_RELIC_POOL.length} in the draft from the start, one taken at random from each draft, ${RELIC_SLOTS} slots): held ${fiveNumbers(populationBuilds.map((relics) => relics.length))}; ${builds.size} different sets; the commonest set closes ${commonest[1]} seasons (${commonest[0].split("+").length} tools); ${wholePool} seasons hold every tool the draft starts with`,
  );
  const cards = Object.values(nodes).flatMap((node) => (node.choices ?? []).filter((choice) => choice.type !== "reframe"));
  const burns = cards.map((choice) => Math.abs(getCardBurn(choice)?.value ?? 0));
  console.log(
    `FRACTURE (measured): ${burns.filter((burn) => burn >= FRACTURE_MIN_BURN).length} of ${cards.length} cards burn ${FRACTURE_MIN_BURN} or more on one axis as written (${[9, 8, 7, 6, 5].map((line) => `${line} or more: ${burns.filter((burn) => burn >= line).length}`).join(", ")}; no burn at all: ${burns.filter((burn) => burn === 0).length}); in the ${SEASONS} seasons above a staked card reached the line on ${all.fractureBurn} of ${all.windows} windows (${per(all.fractureBurn, all.windows, 2)}%), a cracked board was dealt after ${all.fractureDealt} (${per(all.fractureDealt, all.windows, 2)}%) and played on ${all.fracturedBoards}; seasons that never saw one: ${populationSeen.filter((seen) => seen.fractureDealt === 0).length}`,
  );
}

/**
 * Tools the codex unlocks (measured, not judged, 2026-10-13: the plan's
 * question of a cap on tools). Report mode only, after everything above, on a
 * stream set again before each season, so nothing above moves. Nothing below
 * is asserted, and no rule is changed: a cap is tried here by a hand that
 * passes on the draft once it holds that many, which the table already allows.
 *
 * The seasons above draft from the five tools that need no unlock, so every
 * one of them ends with those five. The other seven come from the codex, which
 * outlives a season (`useRelicTable`): a feat proved on a window puts its tool
 * in the pool of every later draft. `toolTable` settles a window the way
 * `settleAgainstCodex` does (it is those lines without the hook's storage),
 * and the brackets are a codex that never learns (the seasons above), one
 * that starts empty and learns, the season after it on what the first left,
 * and a codex that holds everything (a veteran).
 *
 * The hand. The seasons above lock no stance and never run a clock out, so
 * that hand cannot prove four of the seven feats (three charged cashes in a
 * stance, three times; one SILENCE) and holds those four tools for nothing.
 * The tool hand is the same player with two habits added, those of the relic
 * hand in `report-gauntlet-loop.mjs`: one window in two it charges a stance,
 * in a stance that rotates by case, and one window in twenty-five it leaves
 * the clock to run out. It is a different player from the one the ending
 * bands are tuned on, so its rows are read against each other, not against
 * the bands.
 *
 * The draft. `random` takes one of the offered tools at random and never
 * passes, as the seasons above do. Since day 11 the hand holds `RELIC_SLOTS`
 * (5): a full hand swaps, putting down the weakest of what it holds and what
 * it took (`takeIntoSlots`, `RELIC_DROP_ORDER` in the season bot) -- a pass
 * when the taken tool is the weakest. The paragraph below is the uncapped
 * table, the one the cap was decided on. A season offers 51 drafts and has 12 tools,
 * so any hand that never passes ends with every tool in its pool: under no cap
 * the sets a season ends with say nothing about the policy, and "taken of
 * offered" is one in the size of the offer. `need` takes the offered tool the
 * season has had most use for so far (the rule a tool softens, counted as it
 * is dealt; INSURANCE a lost pot, ENCORE a streak a bust ended, METRONOME a
 * streak a change of type ended; HIGH ROLLER, a trade, last). Under a cap the
 * two bracket a player: `random` is the widest the builds can spread, `need`
 * the narrowest a hand that reads its own play would leave them.
 */
function toolTable({ codex = [], learns = false, hand = false, slots = Infinity, policy = "random", drop = "order" } = {}) {
  const count = (map, key) => {
    map[key] = (map[key] ?? 0) + 1;
  };
  const table = { codex: [...codex], hand, caseNumber: 0, featAt: {}, offered: {}, picked: {}, dropped: {}, drafts: 0, passes: 0, swaps: 0, lastTakeAt: 0, need: {} };
  table.dealHand = () => ({ mode: ["strike", "steady", "strike", "steady", "expose"][table.caseNumber % 5], locks: random() < 0.5, walks: random() < 0.04 });
  table.settle = (settlement) => {
    const settled = resolveWindow(settlement);
    const fresh = settlement.rules.has("relics") ? getRelicUnlocks(settled, Object.keys(table.featAt)) : [];
    for (const id of fresh) table.featAt[id] = table.caseNumber;
    if (learns) table.codex = [...new Set([...table.codex, ...fresh])];
    return settlement.caseClosed && settlement.offerRelics ? resolveWindow({ ...settlement, relicPool: getRelicPool(table.codex) }) : settled;
  };
  table.see = (verdict) => {
    for (const mutation of verdict.nextMutations) count(table.need, mutation.id);
    if (verdict.outcome === "bust" && verdict.lostPot + (verdict.insuredPot ?? 0) > 0) count(table.need, "tool:insurance");
    if (verdict.logic.move === "bust") count(table.need, "tool:encore");
    if (verdict.logic.move === "break") count(table.need, "tool:metronome");
  };
  const needOf = (id) => table.need[RELICS[id].softens?.mutation ?? `tool:${id}`] ?? 0;
  table.draft = (run) => {
    table.drafts += 1;
    for (const id of run.relicOffer) count(table.offered, id);
    if (run.relics.length >= slots) {
      table.passes += 1;
      return null;
    }
    const taken = policy === "need" ? run.relicOffer.reduce((best, id) => (needOf(id) > needOf(best) ? id : best)) : pick(run.relicOffer);
    count(table.picked, taken);
    table.lastTakeAt = table.caseNumber;
    return taken;
  };
  // A full hand's swap: by the bot's fixed order (`RELIC_DROP_ORDER`), or `need`, the tool this season has had least use for.
  if (drop === "need") table.weakest = (ids) => ids.reduce((low, id) => (needOf(id) < needOf(low) ? id : low));
  // The slots were full (`takeIntoSlots`): the taken tool went in for `dropped`, or was itself put back.
  table.swapped = (taken, dropped) => {
    if (dropped === taken) {
      table.picked[taken] -= 1;
      table.passes += 1;
      return;
    }
    table.swaps += 1;
    count(table.dropped, dropped);
  };
  return table;
}

if (reportMode) {
  const TOOL_SEASONS = Number(process.env.ENDING_TOOL_SEASONS) || 80;
  const per = (part, whole, digits = 1) => ((100 * part) / Math.max(1, whole)).toFixed(digits);
  const UNLOCKABLE = RELIC_IDS.filter((id) => RELICS[id].unlock);
  const startSet = [...DEFAULT_RELIC_POOL].sort().join("+");
  const nameSet = (ids) => (ids.length === 0 ? "(none)" : ids.length === RELIC_IDS.length ? `all ${RELIC_IDS.length}` : ids.join("+") === startSet ? `the ${DEFAULT_RELIC_POOL.length} from the start` : ids.join("+"));
  const playTools = (name, options, codexOf = () => options.codex ?? []) => {
    const played = Array.from({ length: TOOL_SEASONS }, (_, index) => {
      bot.reseed((20261013 + Math.imul(index + 1, 2654435761)) >>> 0);
      const seen = watchSeason();
      const table = toolTable({ ...options, codex: codexOf(index) });
      const watch = (settled) => {
        seen.watch(settled);
        table.see(settled.verdict);
      };
      const season = playSeason(`tools:${index}`, POPULATION[index % POPULATION.length], false, watch, table);
      return { seen, table, season };
    });
    const total = addSeen(played.map((entry) => entry.seen));
    const sum = (read) => played.reduce((all, entry) => all + read(entry), 0);
    const tally = (read) => {
      const map = new Map();
      for (const entry of played) map.set(read(entry), (map.get(read(entry)) ?? 0) + 1);
      return map;
    };
    const sets = [...tally((entry) => nameSet([...entry.season.relics].sort())).entries()].sort((a, b) => b[1] - a[1]);
    const held = [...tally((entry) => entry.season.relics.length).entries()].sort((a, b) => a[0] - b[0]);
    const endings = tally((entry) => entry.season.ending.id);
    const whole = played.filter((entry) => getRelicPool(entry.table.codex).every((id) => entry.season.relics.includes(id))).length;
    console.log(
      `  ${name}: ${sets.length} different sets in ${TOOL_SEASONS} seasons; tools held at the end ${held.map(([size, seasons]) => `${size}: ${seasons}`).join(", ")}; every tool of its pool held in ${whole} seasons; the last tool is taken as case ${fiveNumbers(played.map((entry) => entry.table.lastTakeAt))} of ${CASE_SEQUENCE.length} closes; drafts with a tool on offer ${(sum((entry) => entry.table.drafts) / TOOL_SEASONS).toFixed(1)} a season, passed ${(sum((entry) => entry.table.passes) / TOOL_SEASONS).toFixed(1)}, swapped ${(sum((entry) => entry.table.swaps) / TOOL_SEASONS).toFixed(1)}; banked a season ${fiveNumbers(played.map((entry) => entry.seen.banked))} (mean ${Math.round(total.banked / TOOL_SEASONS)}); windows a season ${(total.windows / TOOL_SEASONS).toFixed(0)}, bust on ${per(total.busts, total.windows)}%`,
    );
    console.log(`    sets: ${sets.slice(0, 5).map(([key, seasons]) => `${key} ${per(seasons, TOOL_SEASONS)}%`).join("; ")}`);
    console.log(`    endings: ${EXPECTED.map((id) => `${id} ${endings.get(id) ?? 0}`).join(", ")}`);
    const offeredOf = (id) => sum((entry) => entry.table.offered[id] ?? 0);
    console.log(`    taken of offered: ${RELIC_IDS.filter((id) => offeredOf(id) > 0).map((id) => `${id} ${sum((entry) => entry.table.picked[id] ?? 0)}/${offeredOf(id)}`).join(", ")}`);
    const droppedOf = (id) => sum((entry) => entry.table.dropped[id] ?? 0);
    if (RELIC_IDS.some((id) => droppedOf(id) > 0)) console.log(`    put down in a swap: ${RELIC_IDS.filter((id) => droppedOf(id) > 0).map((id) => `${id} ${droppedOf(id)}`).join(", ")}`);
    const feats = UNLOCKABLE.map((id) => {
      const cases = played.map((entry) => entry.table.featAt[id]).filter(Boolean);
      return `${id} ${cases.length}${cases.length ? ` (${fiveNumbers(cases)})` : ""}`;
    });
    console.log(`    feats proved (seasons, and the case each is first proved in, min/p10/p50/p90/max): ${feats.join(", ")}`);
    return played;
  };
  console.log(
    `Tools the codex unlocks (measured, not asserted; ${TOOL_SEASONS} seasons a row, the population's players in turn and the same players in every row; ${RELIC_IDS.length} tools, ${UNLOCKABLE.length} of them unlocked by a feat; a draft as each case from ${CASE_SEQUENCE[3]} to the one before ${CASE_SEQUENCE[CASE_SEQUENCE.length - 1]} closes, ${CASE_SEQUENCE.length - 4} a season)`,
  );
  console.log(" the hand of the seasons above (no stance, no clock run out), random draft:");
  playTools("nothing unlocked, and nothing learned", {});
  playTools("everything unlocked", { codex: UNLOCKABLE });
  console.log(" the tool hand (a stance charged one window in two, one window in twenty-five run out), random draft:");
  playTools("nothing unlocked, and nothing learned", { hand: true });
  const first = playTools("a new codex, first season", { hand: true, learns: true });
  playTools("the same codex, second season", { hand: true, learns: true }, (index) => first[index].table.codex);
  playTools("everything unlocked", { hand: true, codex: UNLOCKABLE });
  console.log(` the swap at ${RELIC_SLOTS} slots read another way (the tool hand, everything unlocked; the rows above put down by the bot's fixed order):`);
  for (const policy of ["random", "need"]) playTools(`${policy} draft, the least-needed put down`, { hand: true, codex: UNLOCKABLE, policy, drop: "need" });
  console.log(` a cap tried by passing (the tool hand, everything unlocked; no swap: the first tools taken are the ones kept; the table swaps at ${RELIC_SLOTS}, so a cap above it is not tried):`);
  for (const slots of [3, 5]) {
    for (const policy of ["random", "need"]) playTools(`${slots} slots, ${policy} draft`, { hand: true, codex: UNLOCKABLE, slots, policy });
  }
}

/**
 * The ending funnel (measured, not asserted, 2026-10-14: improvement notes C2,
 * for day 10): for each archetype of the population above, and for the two
 * wild-card hands, how its seasons spread over the endings, which answer the
 * finale took, and -- where `src/judgementHabit.js` exists -- which of the
 * judgement habits the result card would name the season. It is the last thing
 * the report prints and it plays no season and draws nothing from the stream,
 * so every line above is the line it was and a before/after diff of a rule
 * change only grows at the bottom.
 *
 * The finale's answer is read as `getEndingVariant` reads it (the last
 * `f_after_*` card of the final case): witness keeps every record and goes
 * outside (폭로), control changes the consent rules from inside (개혁), burn
 * seals everything away (봉인). "none" is a final case closed without one of
 * the three, which the wild card's route can do.
 *
 * The habits are what the card would print for a bot, so `marathon` and
 * `lightning` read the bot's seconds (its think time and pushes), not a
 * person's. Without the module the line says so once and is skipped.
 */
function funnelRow(name) {
  let row = funnelRows.find((entry) => entry.name === name);
  if (!row) funnelRows.push((row = { name, seasons: [] }));
  return row.seasons;
}
function funnelSeason(season) {
  const answer = [...(season.final?.log ?? [])].reverse().find((entry) => /^f_after_(witness|control|burn)$/.test(entry?.choiceId ?? ""));
  return { ending: season.ending.id, finale: answer ? answer.choiceId.slice("f_after_".length) : "none", caseResults: season.caseResults };
}
if (reportMode) {
  const per = (part, whole) => ((100 * part) / Math.max(1, whole)).toFixed(1);
  const tally = (seasons, read) => {
    const map = new Map();
    for (const season of seasons) map.set(read(season), (map.get(read(season)) ?? 0) + 1);
    return map;
  };
  const spreadOf = (map, ids, total) => ids.map((id) => `${id} ${map.get(id) ?? 0} (${per(map.get(id) ?? 0, total)}%)`).join(", ");
  const FINALE = [["witness", "폭로"], ["control", "개혁"], ["burn", "봉인"], ["none", "none"]];
  let habits = null;
  try {
    habits = await import("../src/judgementHabit.js");
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND" || !String(error.message).includes("judgementHabit")) throw error;
  }
  console.log(`Ending funnel by player (measured, not asserted; each archetype's seasons of the ${SEASONS} above, then the wild-card hands' ${Number(process.env.ENDING_WILD_SEASONS) || 80} seasons each; counts, and the share of that row's seasons)`);
  if (!habits) console.log("  judgement habits: skipped, src/judgementHabit.js is not on this branch");
  for (const { name, seasons } of funnelRows) {
    const total = seasons.length;
    console.log(`  ${name} (${total} seasons): ${spreadOf(tally(seasons, (season) => season.ending), EXPECTED, total)}`);
    const finale = tally(seasons, (season) => season.finale);
    console.log(`    finale: ${FINALE.map(([id, word]) => `${id === "none" ? id : `${id}/${word}`} ${finale.get(id) ?? 0} (${per(finale.get(id) ?? 0, total)}%)`).join(", ")}`);
    if (habits) {
      const named = tally(seasons, (season) => habits.getJudgementHabit(season.caseResults)?.id ?? "(too few windows)");
      console.log(`    habits: ${spreadOf(named, [...habits.JUDGEMENT_HABITS.map((habit) => habit.id), "(too few windows)"], total)}`);
    }
  }
}
