/**
 * C-1(1), the 판 읽기 axis of the season score (사용자 2026-10-25 「전부 1」):
 * how the ranking moves when each case's burst score gives 0.2 to the C-12
 * index (the vault its bare hand kept against a hand that sees the wall, on
 * the same boards) and the six axes before it keep their ratios at 0.8.
 *
 * The season player (scripts/sim/season-bot.mjs) plays the same seasons --
 * same seeds, same archetypes, same cards -- on four ways of reading the
 * table, the ladder check:pressure measures in vault: blind (cashes at a heat
 * it picked), heartbeat (listens, never buys SCOUT), scout (listens and takes
 * the look the table sells from the case that deals it), and sees (pushes
 * while the largest step stays under the wall). Each season is scored twice:
 * as the ranking scores it now (getSeasonScore over createCaseSummary, the
 * axis in) and on the six weights before the axis, worked out again from the
 * same case logs. Nothing is asserted: it prints the two side by side.
 *
 *   node scripts/report-reading-axis.mjs            40 seasons per archetype and board
 *   READING_SEASONS=80 node scripts/report-reading-axis.mjs
 */
import { CASE_SEQUENCE } from "../src/gameCases.js";
import { getGameplayStats } from "../src/gameLogic.js";
import { STAGED } from "../src/gauntlet/tableUnlocks.js";
import { getCognitionSpread, scoreMarks } from "../src/seasonScore.js";
import { ARCHETYPES, createSeasonBot, POPULATION } from "./sim/season-bot.mjs";

const SEASONS = Number(process.env.READING_SEASONS) || 40;
const BOARDS = ["blind", "heartbeat", "listens", "sees"];
const BOARD_LABEL = { blind: "blind", heartbeat: "heartbeat", listens: "scout", sees: "sees the wall" };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** A case's burst score on the six weights before the axis, from its log. */
function scoreBefore(log) {
  const stats = getGameplayStats(log);
  const challenge = Math.min(100, stats.challengeClearCount * 18 + stats.currentChallengeStreak * 8);
  return {
    score: Math.round(clamp(stats.consistencyScore * 0.28 + stats.cognitionScore * 0.2 + stats.reflectionScore * 0.2 + stats.pressureAdaptScore * 0.16 + stats.rhythmScore * 0.08 + challenge * 0.08 - stats.exploitPenalty, 0, 100)),
    spread: stats.cognitionScore,
  };
}

/** The season's score on those weights: the case mean with 관점 전환 swapped at 0.2 (20261102020000). */
function seasonBefore(season) {
  const cases = CASE_SEQUENCE.map((caseId) => ({ ...scoreBefore(season.caseLogs[caseId]), mix: season.caseResults[caseId].cognitionMix }));
  const mix = {};
  for (const entry of cases) for (const [kind, count] of Object.entries(entry.mix)) mix[kind] = (mix[kind] ?? 0) + count;
  const total = 5 * cases.reduce((sum, entry) => sum + entry.score, 0) + cases.length * getCognitionSpread(mix) - cases.reduce((sum, entry) => sum + entry.spread, 0);
  return Math.round(clamp(total / (5 * cases.length), 0, 100));
}

const archetypes = Object.fromEntries(Object.entries(ARCHETYPES).flatMap(([name, base]) => BOARDS.map((board) => [`${name}+${board}`, { ...base, board }])));
const bot = createSeasonBot({ seed: 20261025, staged: STAGED, archetypes });
const rows = Object.fromEntries(BOARDS.map((board) => [board, { before: [], after: [], reading: [], byArchetype: {} }]));
for (let index = 0; index < SEASONS * POPULATION.length; index += 1) {
  const archetype = POPULATION[index % POPULATION.length];
  for (const board of BOARDS) {
    // The same draws for each board: only how the table is read differs.
    bot.reseed(20261025 + index * 7919);
    const season = bot.playSeason(index, `${archetype}+${board}`);
    const row = rows[board];
    row.before.push(seasonBefore(season));
    row.after.push(season.score.burstScore);
    row.reading.push(CASE_SEQUENCE.reduce((sum, caseId) => sum + season.caseResults[caseId].readingScore, 0) / CASE_SEQUENCE.length);
    (row.byArchetype[archetype] ??= []).push(season.score.burstScore - row.before.at(-1));
  }
}

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const sd = (values) => Math.sqrt(mean(values.map((value) => (value - mean(values)) ** 2)));
const letters = (values) => ["S", "A", "B", "C"].map((letter) => `${letter} ${((values.filter((value) => scoreMarks(value).rank === letter).length / values.length) * 100).toFixed(0)}%`).join(" ");
const fixed = (value, digits = 1) => value.toFixed(digits);

console.log(`판 읽기 axis (C-1(1)): ${SEASONS * POPULATION.length} seasons a board (${SEASONS} per archetype, ${POPULATION.length} population slots), the same seeds on each board.`);
console.log("board          판읽기   before (mean ± sd, letters)                after (mean ± sd, letters)                 shift");
for (const board of BOARDS) {
  const { before, after, reading } = rows[board];
  console.log(
    `${BOARD_LABEL[board].padEnd(14)} ${fixed(mean(reading)).padStart(5)}   ${fixed(mean(before))} ± ${fixed(sd(before))}  ${letters(before).padEnd(26)}  ${fixed(mean(after))} ± ${fixed(sd(after))}  ${letters(after).padEnd(26)}  ${fixed(mean(after) - mean(before), 1)}`,
  );
}
const gap = (key) => mean(rows.sees[key]) - mean(rows.blind[key]);
console.log(`sees the wall - blind: before ${fixed(gap("before"))}, after ${fixed(gap("after"))} points`);
// Paired: how often a season played on a better reading outscores the same season played blind.
for (const board of BOARDS.slice(1)) {
  const pairs = (key) => rows[board][key].filter((value, index) => value > rows.blind[key][index]).length / rows[board][key].length;
  console.log(`${BOARD_LABEL[board].padEnd(14)} outscores the same season played blind: before ${fixed(pairs("before") * 100, 0)}%, after ${fixed(pairs("after") * 100, 0)}%`);
}
console.log("shift by archetype (after - before, mean):");
for (const archetype of [...new Set(POPULATION)]) {
  console.log(`  ${archetype.padEnd(13)} ${BOARDS.map((board) => `${BOARD_LABEL[board]} ${fixed(mean(rows[board].byArchetype[archetype]))}`).join(", ")}`);
}
