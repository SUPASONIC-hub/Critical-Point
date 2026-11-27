import { pathToFileURL } from "node:url";

import { decisionWindowSeconds, GAUGE_MAX, getCardChips, getHeartbeatBpm, getWindowBand, reduceWindow } from "../../src/gauntlet/gauntletEngine.js";
import { SCOUT_NARROW_REACH, SCOUT_NARROW_TRUST, SCOUT_TRUST } from "../../src/gauntlet/tableRules.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, nodes } from "../../src/gameData.js";
import { ARCHETYPES, createCaseBot, createSeasonBot, narrowDue, newSeen, POPULATION, scoutDue } from "./season-bot.mjs";

/**
 * N43 (2026-11-18): B1's second look and B5's clock warning, measured. Not a
 * check -- it asserts nothing and no CI step runs it; the numbers go to the
 * owner, who decides whether bundle R (#582, RULES_MARK 5) changes any.
 *
 *   node scripts/sim/scout-narrow-report.mjs                 the case table, the seasons, B5
 *   node scripts/sim/scout-narrow-report.mjs --cases-only    the case table alone (the cap sweep)
 *   SCOUT_NARROW_REACH=6 node --import ./scripts/sim/scout-values.mjs scripts/sim/scout-narrow-report.mjs --cases-only
 *
 * The case table plays check:pressure's case player (`createCaseBot`, the
 * same card, the same seeds, the same heartbeat and margin sweeps) for each
 * way of looking: never, once before push 1, once and narrowing when the
 * next push gets within `edge` of the first band (the "narrow" timing, edge 3
 * there), and narrowing before push 1 on every board. The seasons play
 * check:endings's scout seasons (`createSeasonBot`, board "listens") once
 * per timing on one seed. B5 counts, on every push, whether the push's
 * description would say 「시계 최대 −N초」 (describeNextClock: the next push
 * at its top can cross a stake tier) and whether the push did take seconds.
 */

const CASES = Number(process.env.N43_CASES) || 1500;
const SEASONS = Number(process.env.N43_SEASONS) || POPULATION.length * 20;
/** N43_PACE: every tick of the case player this many times as long (1: 0.6 s a push, as check:pressure plays it). */
const PACE = Number(process.env.N43_PACE) || 1;
/** A window closed with this many seconds or fewer left on its clock (`lowClock`). */
export const LOW_CLOCK = 5;
const card = { id: "sim", label: "sim", effect: { capital: 7, trust: 11, humanCost: 4 } };

/** Windows per case as check:pressure measures them (report-gauntlet-loop.mjs's measureWindowsPerCase). */
export function measureWindowsPerCase(walksPerCase = 40) {
  let seed = 20260927;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const results = new Set(Object.values(CASE_RESULT_NODES));
  let scenes = 0;
  let walks = 0;
  for (const caseId of CASE_SEQUENCE) {
    for (let walk = 0; walk < walksPerCase; walk += 1) {
      let nodeId = CASE_START_NODES[caseId];
      for (let step = 0; step < 60 && nodeId && !results.has(nodeId); step += 1) {
        const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "reframe");
        if (!choices.length) break;
        scenes += 1;
        nodeId = choices[Math.floor(random() * choices.length)].next;
      }
      walks += 1;
    }
  }
  return Math.round(scenes / walks);
}

/** B5's counts: pushes, those the push description warned on, those that took seconds, and the windows. */
export const newClockTally = () => ({ pushes: 0, warned: 0, warnedCut: 0, unwarnedCut: 0, creepCut: 0, windows: 0, warnedWindows: 0, cutWindows: 0, closedShort: 0, lowClock: 0, timeouts: 0, cutSeconds: 0 });

/**
 * A reducer that plays `reduce` and files B5's counts in `tally()`'s object.
 * A PUSH is warned when the stake clock at the push's top (gauge + stepMax,
 * cut at GAUGE_MAX: tableMeters.js's nextHigh) is shorter than now, as
 * describeNextClock says it; it cut when the clock after the push is shorter
 * than before it. A TICK that takes seconds is the creep crossing a tier. A
 * CASH or a bust closes the window: on a clock shorter than its board's whole
 * one (`closedShort`), or by the clock running out (`timeouts`).
 */
export function clockTallyReducer(tally, reduce = reduceWindow, pace = 1) {
  const close = (before, after) => {
    if (before.status !== "live" || after.status === "live") return;
    const counts = tally();
    const marks = after.clockMarks ?? before.clockMarks ?? {};
    counts.windows += 1;
    if (marks.warned) counts.warnedWindows += 1;
    if (marks.cut) counts.cutWindows += 1;
    if (decisionWindowSeconds(after.gauge, after.schema) < decisionWindowSeconds(0, after.schema)) counts.closedShort += 1;
    if (after.cause === "timeout") counts.timeouts += 1;
    else if (decisionWindowSeconds(after.gauge, after.schema) - after.elapsed <= LOW_CLOCK) counts.lowClock += 1;
  };
  return (win, event, rules) => {
    const counts = tally();
    const seconds = (gauge) => decisionWindowSeconds(gauge, win.schema);
    if (event?.type === "PUSH" && win.status === "live" && win.schema?.stakeClock === true) {
      const warned = seconds(win.gauge) - seconds(Math.min(GAUGE_MAX, win.gauge + win.schema.stepMax)) > 0;
      let after = reduce(win, event, rules);
      const cut = seconds(win.gauge) - seconds(after.gauge);
      counts.pushes += 1;
      if (warned) counts.warned += 1;
      if (cut > 0) {
        counts.cutSeconds += cut;
        if (warned) counts.warnedCut += 1;
        else counts.unwarnedCut += 1;
      }
      const marks = { ...(win.clockMarks ?? {}), ...(warned ? { warned: true } : {}), ...(cut > 0 ? { cut: true } : {}) };
      after = { ...after, clockMarks: marks };
      close(win, after);
      return after;
    }
    const after = reduce(win, event?.type === "TICK" && pace !== 1 ? { ...event, delta: event.delta * pace } : event, rules);
    if (after === win) return win;
    if (event?.type === "TICK" && win.status === "live" && after.status === "live" && seconds(after.gauge) < seconds(win.gauge)) counts.creepCut += 1;
    const kept = win.clockMarks && after.clockMarks === undefined ? { ...after, clockMarks: win.clockMarks } : after;
    close(win, kept);
    return kept;
  };
}

/** The share of windows that bust at push `k`, of those that made it to push `k` (newSeen's bustAt and pushed). */
export function bustByPush(seen, upTo = 8) {
  const pushed = Object.entries(seen.pushed ?? {}).map(([pushes, windows]) => [Number(pushes), windows]);
  return Array.from({ length: upTo }, (_, index) => {
    const push = index + 1;
    const reached = pushed.filter(([pushes]) => pushes >= push).reduce((sum, [, windows]) => sum + windows, 0);
    const busts = seen.bustAt?.[push] ?? 0;
    return { push, reached, busts, rate: reached ? busts / reached : 0 };
  });
}

/**
 * The policies the case table plays: `margin` is the best first-look margin,
 * `listening` the best heartbeat; `edge` when a risky hand narrows, `inner`
 * how far past the narrowed band's near end its next push may reach.
 */
export function narrowPolicy({ margin, listening, edge, inner, first = false }) {
  const timing = first ? "narrowFirst" : "narrow";
  const scoutOrListen = (win) => (win.scouted ? win.gauge + win.schema.stepMax - margin < getWindowBand(win).wallMin : listening(win));
  return Object.assign((win) => (win.narrowed ? win.gauge + win.schema.stepMax - inner < getWindowBand(win).wallMin : scoutOrListen(win)), {
    scout: (win) => scoutDue(timing, win),
    narrow: (win) => narrowDue(timing, win, edge),
  });
}

function main() {
  const casesOnly = process.argv.includes("--cases-only");
  const windowsPerCase = measureWindowsPerCase();
  let clock = newClockTally();
  const tally = () => clock;
  const { playCase } = createCaseBot({ windowsPerCase, card, sceneFor: () => null, reduce: clockTallyReducer(tally, reduceWindow, PACE) });
  const measure = (label, decide) => {
    clock = newClockTally();
    const seen = newSeen();
    let vault = 0;
    let busts = 0;
    let played = 0;
    for (let caseIndex = 0; caseIndex < CASES; caseIndex += 1) {
      const result = playCase(caseIndex, decide);
      vault += result.vault;
      busts += result.busts;
      played += result.played;
      for (const [key, value] of Object.entries(result.seen)) {
        if (typeof value === "number") seen[key] += value;
        else for (const [inner, amount] of Object.entries(value)) seen[key][inner] = (seen[key][inner] ?? 0) + amount;
      }
    }
    return { label, meanVault: Math.round(vault / CASES), bustRate: busts / Math.max(1, played), played, seen, clock };
  };
  const best = (rows) => rows.reduce((top, row) => (row.meanVault > top.meanVault ? row : top));
  const pct = (part, whole) => `${((100 * part) / Math.max(1, whole)).toFixed(1)}%`;

  console.log(`N43 scout narrow report: SCOUT_NARROW_REACH ${SCOUT_NARROW_REACH} (${SCOUT_NARROW_REACH * 2} cells), SCOUT_NARROW_TRUST ${SCOUT_NARROW_TRUST}, SCOUT_TRUST ${SCOUT_TRUST}; ${CASES} cases of ${windowsPerCase} windows; card chips ${getCardChips(card)}`);
  const heartbeat = [80, 90, 100, 110, 120, 130, 140, 150, 160].map((threshold) => measure(`heartbeat < ${threshold}`, Object.assign((win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold, { threshold })));
  const bestHeartbeat = best(heartbeat);
  const threshold = Number(bestHeartbeat.label.split("< ")[1]);
  const listening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold;
  const oracle = measure("sees the wall", (win) => win.gauge + win.schema.stepMax < win.wall);
  const margins = [0, 3, 6, 9].map((margin) => measure(`scout, margin ${margin}`, Object.assign((win) => win.gauge + win.schema.stepMax - margin < getWindowBand(win).wallMin, { scout: true })));
  const margin = Number(best(margins).label.split("margin ")[1]);
  const once = measure(`once, margin ${margin}`, Object.assign((win) => (win.scouted ? win.gauge + win.schema.stepMax - margin < getWindowBand(win).wallMin : listening(win)), { scout: (win) => scoutDue("always", win) }));
  const inners = [2, 3, 4];
  const risky = [0, 3, 6, 9].map((edge) => best(inners.map((inner) => measure(`narrow when risky, edge ${edge}, then ${inner}`, Object.assign(narrowPolicy({ margin, listening, edge, inner }), { edge })))));
  const first = best(inners.map((inner) => measure(`narrow before push 1, then ${inner}`, narrowPolicy({ margin, listening, edge: 0, inner, first: true }))));
  const rows = [
    { name: "never (heartbeat)", row: bestHeartbeat },
    { name: "once", row: once },
    ...risky.map((row) => ({ name: `risky e${row.label.split("edge ")[1].split(",")[0]}`, row })),
    { name: "always narrow", row: first },
  ];
  console.log(`best heartbeat < ${threshold}, best margin ${margin}; sees the wall ${oracle.meanVault} (bust ${pct(oracle.bustRate, 1)})`);
  console.log("policy             | vault  | vs once | /sees | bust  | narrowed windows | 믿음/case | label");
  for (const { name, row } of rows) {
    const windows = row.played;
    const trust = (row.seen.scouts * SCOUT_TRUST + row.seen.narrows * SCOUT_NARROW_TRUST) / CASES;
    console.log(`${name.padEnd(18)} | ${String(row.meanVault).padStart(6)} | ${`${((row.meanVault / once.meanVault - 1) * 100).toFixed(1)}%`.padStart(7)} | ${(row.meanVault / oracle.meanVault).toFixed(3)} | ${pct(row.bustRate, 1).padStart(5)} | ${pct(row.seen.narrows, windows).padStart(16)} | ${(-trust).toFixed(2).padStart(9)} | ${row.label}`);
  }
  console.log("bust at push k, of windows that reached push k (k = 1..8):");
  for (const { name, row } of rows) console.log(`  ${name.padEnd(18)} ${bustByPush(row.seen).map(({ rate }) => `${(rate * 100).toFixed(1)}`.padStart(5)).join(" ")}`);
  console.log(`B5 on the case player (${(0.6 * PACE).toFixed(1)} s a push): pushes warned 「시계 최대 −N초」, warned pushes that took seconds, unwarned pushes that did, creep cuts, windows warned / cut / closed on a short clock / closed with ${LOW_CLOCK} s or less / timed out:`);
  for (const { name, row } of rows) {
    const c = row.clock;
    console.log(`  ${name.padEnd(18)} warned ${pct(c.warned, c.pushes)} of ${c.pushes} pushes; of those cut ${pct(c.warnedCut, c.warned)}; unwarned cut ${c.unwarnedCut}; creep ${c.creepCut}; windows warned ${pct(c.warnedWindows, c.windows)} cut ${pct(c.cutWindows, c.windows)} closed short ${pct(c.closedShort, c.windows)} low ${pct(c.lowClock, c.windows)} timeouts ${c.timeouts}`);
  }
  if (casesOnly) return;

  // The seasons: check:endings's scout seasons, once per timing, one seed, with B5 counted on the same reducer.
  const staged = STAGED;
  const timings = ["never", "always", "narrow", "narrowFirst"];
  const bots = Object.fromEntries(timings.map((scout) => [scout, createSeasonBot({ seed: 20261105, staged, reduce: clockTallyReducer(tally), archetypes: Object.fromEntries(Object.entries(ARCHETYPES).map(([name, base]) => [name, { ...base, board: "listens", scout }])) })]));
  const seasonRows = Object.fromEntries(timings.map((scout) => [scout, { endings: new Map(), looks: 0, narrows: 0, trust: 0, busts: 0, vault: 0, moved: 0, clock: newClockTally() }]));
  for (let index = 0; index < SEASONS; index += 1) {
    const archetype = POPULATION[index % POPULATION.length];
    const seasons = Object.fromEntries(timings.map((scout) => {
      clock = seasonRows[scout].clock;
      bots[scout].reseed((20261105 + Math.imul(index + 1, 2654435761)) >>> 0);
      let looks = 0;
      let narrows = 0;
      const season = bots[scout].playSeason(`scout:${index}`, archetype, false, ({ verdict }) => {
        if (verdict.scouted) looks += 1;
        if (verdict.narrowed) narrows += 1;
      });
      return [scout, { season, looks, narrows }];
    }));
    for (const scout of timings) {
      const { season, looks, narrows } = seasons[scout];
      const row = seasonRows[scout];
      row.endings.set(season.ending.id, (row.endings.get(season.ending.id) ?? 0) + 1);
      row.looks += looks;
      row.narrows += narrows;
      row.trust += season.final.resources.trust;
      row.busts += season.strain.seasonBusts;
      row.vault += Math.max(0, ...Object.values(season.caseDynamics).map((dynamics) => Number(dynamics.vault) || 0));
      if (season.ending.id !== seasons.never.season.ending.id) row.moved += 1;
    }
  }
  const endings = [...new Set(Object.values(seasonRows).flatMap((row) => [...row.endings.keys()]))].sort();
  console.log(`Seasons: ${SEASONS} population slots (${SEASONS / POPULATION.length} per archetype slot), board "listens", one seed per slot`);
  console.log(`timing       | looks | narrows | busts/season | 믿음 at close | vault at close | ending ≠ never | ${endings.join(" | ")}`);
  for (const scout of timings) {
    const row = seasonRows[scout];
    const per = (value) => (value / SEASONS).toFixed(1);
    console.log(`${scout.padEnd(12)} | ${per(row.looks).padStart(5)} | ${per(row.narrows).padStart(7)} | ${per(row.busts).padStart(12)} | ${per(row.trust).padStart(13)} | ${String(Math.round(row.vault / SEASONS)).padStart(14)} | ${pct(row.moved, SEASONS).padStart(14)} | ${endings.map((id) => pct(row.endings.get(id) ?? 0, SEASONS)).join(" | ")}`);
  }
  console.log("B5 on the seasons (the season bot's own pace):");
  for (const scout of timings) {
    const c = seasonRows[scout].clock;
    console.log(`  ${scout.padEnd(12)} warned ${pct(c.warned, c.pushes)} of ${c.pushes} pushes; of those cut ${pct(c.warnedCut, c.warned)}; unwarned cut ${c.unwarnedCut}; creep ${c.creepCut}; windows warned ${pct(c.warnedWindows, c.windows)} cut ${pct(c.cutWindows, c.windows)} closed short ${pct(c.closedShort, c.windows)} low ${pct(c.lowClock, c.windows)} timeouts ${c.timeouts}; seconds cut ${(c.cutSeconds / Math.max(1, c.windows)).toFixed(2)}/window`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
