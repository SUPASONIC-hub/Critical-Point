import { CASE_SEQUENCE } from "../src/gameData.js";
import { createWindow, drawStep, getMultiplier, normalizeSchema } from "../src/gauntlet/gauntletEngine.js";
import { STAGED } from "../src/gauntlet/tableUnlocks.js";
import { createSeasonBot, POPULATION } from "./sim/season-bot.mjs";

/**
 * Where the simulated players stop, and how close they were.
 *
 * `report:endings` says how seasons end and `check:pressure` asserts the bet
 * is a bet; neither says where a window ends against its wall. This does, for
 * the same population `check-endings.mjs` plays (`season-bot.mjs`), on seeds of
 * its own, so it moves nothing either script prints. It asserts nothing and is
 * not run in CI: it is a measuring tape for the rule work (improvement note F2,
 * "the point where it almost worked").
 *
 * Every settled window is read twice. A cash asks what one more push would have
 * done: the next step is dealt from the window's own seed (`drawStep`), so the
 * answer is the table's, not a guess -- except that the clock's creep during
 * that push is left out and the gauge is the verdict's rounded one, which can
 * move a window sitting within a point of the line. A push bust asks where the
 * push before it stood: how far from the wall, whether any step could have
 * cleared it (closer than `stepMin` and no push was safe), and what the pot
 * multiplier was at the gauge it gave up.
 *
 * The window seed is rebuilt from the season and a count of its windows, the
 * way `playSeason` names it; a wall dealt from the rebuilt seed is checked
 * against the verdict's, and a window where they differ is counted and left out
 * (the last line says how many).
 */

const SEASONS = Number(process.env.NEAR_MISS_SEASONS) || 240;
const SEED = 20261015;
const bot = createSeasonBot({ seed: SEED, staged: STAGED });
const { pick, playSeason } = bot;

const newTally = () => ({
  windows: 0,
  cashes: 0,
  busts: { push: 0, creep: 0, timeout: 0, other: 0 },
  // A cash, by what one more push would have done.
  nextSafe: 0,
  nextBust: 0,
  leftSum: 0,
  // A push bust, by where the push before it stood.
  prevDoomed: 0,
  prevGapSum: 0,
  forgone: [],
});

function addTally(into, from) {
  for (const [key, value] of Object.entries(from)) {
    if (typeof value === "number") into[key] += value;
    else if (Array.isArray(value)) into[key].push(...value);
    else for (const [inner, amount] of Object.entries(value)) into[key][inner] += amount;
  }
  return into;
}

let mismatched = 0;

function watchSeason(seasonIndex) {
  const byCase = new Map();
  const total = newTally();
  const tools = {
    caseNumber: 0,
    // The draft `playSeason` takes without tools, from the same stream.
    draft: (run) => pick(run.relicOffer),
  };
  let windowIndex = 0;
  const watch = ({ verdict, board }) => {
    const seed = `season:${seasonIndex}:${windowIndex}`;
    windowIndex += 1;
    if (createWindow({ schema: board, seed }).wall !== verdict.wall) {
      mismatched += 1;
      return;
    }
    const caseNumber = tools.caseNumber;
    if (!byCase.has(caseNumber)) byCase.set(caseNumber, newTally());
    for (const tally of [total, byCase.get(caseNumber)]) {
      tally.windows += 1;
      if (verdict.outcome === "cash") {
        tally.cashes += 1;
        const left = verdict.wall - verdict.gauge;
        tally.leftSum += left;
        if (verdict.gauge + drawStep(board, seed, verdict.pushes + 1) >= verdict.wall) tally.nextBust += 1;
        else tally.nextSafe += 1;
        continue;
      }
      const cause = ["push", "creep", "timeout"].includes(verdict.cause) ? verdict.cause : "other";
      tally.busts[cause] += 1;
      if (cause !== "push" || verdict.pushes < 1) continue;
      const before = verdict.gauge - drawStep(board, seed, verdict.pushes);
      const gap = verdict.wall - before;
      tally.prevGapSum += gap;
      if (gap <= normalizeSchema(board).stepMin) tally.prevDoomed += 1;
      tally.forgone.push(getMultiplier(Math.max(0, before)));
    }
  };
  return { watch, tools, byCase, total };
}

const groups = new Map();
const group = (name) => {
  if (!groups.has(name)) groups.set(name, newTally());
  return groups.get(name);
};
const perCase = new Map();

for (let index = 0; index < SEASONS; index += 1) {
  const archetype = POPULATION[index % POPULATION.length];
  const seen = watchSeason(index);
  const season = playSeason(index, archetype, false, seen.watch, seen.tools);
  addTally(group("all"), seen.total);
  addTally(group(archetype), seen.total);
  addTally(group(season.policy.listens ? "listens to heartbeat" : "cashes at a heat"), seen.total);
  for (const [caseNumber, tally] of seen.byCase) {
    if (!perCase.has(caseNumber)) perCase.set(caseNumber, newTally());
    addTally(perCase.get(caseNumber), tally);
  }
}

const pct = (part, whole) => (whole ? `${((part / whole) * 100).toFixed(1)}%` : "-");
const mean = (sum, count) => (count ? (sum / count).toFixed(1) : "-");
const median = (values) => {
  if (!values.length) return "-";
  const sorted = [...values].sort((a, b) => a - b);
  return String(sorted[Math.floor(sorted.length / 2)]);
};
const bustCount = (tally) => Object.values(tally.busts).reduce((sum, value) => sum + value, 0);

function row(name, tally) {
  const busts = bustCount(tally);
  return [
    name.padEnd(22),
    String(tally.windows).padStart(6),
    pct(tally.cashes, tally.windows).padStart(7),
    pct(busts, tally.windows).padStart(7),
    `${pct(tally.busts.push, busts)}/${pct(tally.busts.creep, busts)}/${pct(tally.busts.timeout, busts)}`.padStart(20),
    pct(tally.nextSafe, tally.cashes).padStart(8),
    pct(tally.nextBust, tally.cashes).padStart(8),
    mean(tally.leftSum, tally.cashes).padStart(6),
    pct(tally.prevDoomed, tally.busts.push).padStart(8),
    mean(tally.prevGapSum, tally.busts.push).padStart(6),
    `x${median(tally.forgone)}`.padStart(8),
  ].join(" ");
}

const header = [
  "group".padEnd(22),
  "n".padStart(6),
  "cash".padStart(7),
  "bust".padStart(7),
  "push/creep/timeout".padStart(20),
  "c:safe+1".padStart(8),
  "c:bust+1".padStart(8),
  "c:left".padStart(6),
  "b:doomed".padStart(8),
  "b:gap".padStart(6),
  "b:gaveup".padStart(8),
].join(" ");

console.log(`Near-miss report: ${SEASONS} seasons, seed ${SEED}, ${STAGED ? "staged" : "whole"} rules.`);
console.log("n = settled windows. c: cashes -- one more push safe / would bust, mean heat left under the wall.");
console.log("b: push busts -- the push before stood closer than stepMin (no step was safe), its mean gap to the wall, median multiplier it gave up.");
console.log("");
console.log(header);
for (const name of ["all", "listens to heartbeat", "cashes at a heat", ...new Set(POPULATION)]) {
  if (groups.has(name)) console.log(row(name, groups.get(name)));
}

console.log("");
console.log("By case (season order). The five busiest and the five quietest by bust share are marked.");
const caseRows = [...perCase.entries()].sort(([a], [b]) => a - b);
const byBust = [...caseRows].sort(([, a], [, b]) => bustCount(b) / b.windows - bustCount(a) / a.windows);
const busiest = new Set(byBust.slice(0, 5).map(([caseNumber]) => caseNumber));
const quietest = new Set(byBust.slice(-5).map(([caseNumber]) => caseNumber));
console.log(header.replace("group".padEnd(22), "case".padEnd(22)));
for (const [caseNumber, tally] of caseRows) {
  const mark = busiest.has(caseNumber) ? " ▲" : quietest.has(caseNumber) ? " ▽" : "";
  console.log(row(`${String(caseNumber).padStart(2)} ${CASE_SEQUENCE[caseNumber - 1] ?? "?"}${mark}`, tally));
}

console.log("");
console.log(`Windows left out (rebuilt seed dealt a different wall): ${mismatched}.`);
