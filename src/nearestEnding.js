import { ENDING_THRESHOLDS as GATE, getFinaleOutcome } from "./gameLogic.js";
import { readCollapseGate } from "./seasonStanding.js";

/**
 * The ending a season came closest to and did not reach, for the finale's one
 * line (개선 포인트 C2-1 (1), 2026-11-11): display only. It reads the same
 * season `getEndingVariant` rules on and the same gates (`ENDING_THRESHOLDS`),
 * and it never changes which ending the season reached.
 *
 * Each ending that is not the season's own is asked what it lacked, gate by
 * gate, in whole steps a player can count: resource points on the season's
 * mean closing values (믿음, 공정함, 현금), and records or reframed routes as a
 * number of them. The nearest is the one whose lacks are the smallest share
 * of their scales -- a point of 100, a record of the season's cases -- and an
 * ending listed earlier wins a tie. An ending that lacked nothing and still
 * was not reached was taken by one ruled before it, so it is not "near".
 *
 * SYSTEM COLLAPSE is never a target, and a collapsed season has no line (its
 * toll says what closed it). OPEN QUESTION and QUIET COVER are what is left
 * when nothing else holds, so neither is aimed at. A season whose finale was
 * 봉인 (burn) closed the record endings: it gets `{ burn: true }` instead.
 */
const CANDIDATES = ["human-record", "evidence-reform", "open-oversight", "cold-justice", "profitable-silence", "field-pact"];

/** The ending as the panel labels it: "evidence-reform" is EVIDENCE REFORM. */
export const endingLabelOf = (id) => String(id).replace(/-/g, " ").toUpperCase();

// How far a value is from a gate, in whole steps. `atLeast` asks have >= need;
// `under` asks have < limit; `share` asks count / cases >= rate, and answers
// in records, found by stepping so the count agrees with the ruling's division.
const atLeast = (have, need) => (have >= need ? 0 : Math.max(1, Math.ceil(need - have)));
const under = (have, limit) => (have < limit ? 0 : Math.floor(have - limit) + 1);
function share(count, cases, rate) {
  let need = Math.max(0, Math.floor(rate * cases) - 1);
  while (need / cases < rate) need += 1;
  return Math.max(0, need - count);
}

/**
 * @param {Record<string, any>} [input] What `getEndingVariant` is handed, plus `endingId`, the id of the ending it returned.
 * @returns {{ id: string, label: string, gaps: Array<{ key: string, value: number }> } | { burn: true } | null}
 */
export function nearestEnding(input = {}) {
  const {
    endingId = "", resources = {}, discoveredClues = [], log = [], seasonHumanCost = 0, casesPlayed = 0, seasonBusts = 0, seasonWindows = 0,
    seasonBestMultiplier = 1, seasonVaultPerCase = 0, seasonBestLogic = 0, seasonReframeRoutes, seasonResources = null,
  } = input ?? {};
  if (!endingId || endingId === "collapse") return null;
  if (getFinaleOutcome(log) === "burn") return { burn: true };
  const { cases } = readCollapseGate({ seasonHumanCost, resources, casesPlayed, seasonBusts, seasonWindows });
  const standing = seasonResources ?? resources ?? {};
  const trust = Number(standing.trust) || 0;
  const legitimacy = Number(standing.legitimacy) || 0;
  const capital = Number(standing.capital) || 0;
  const clues = (discoveredClues ?? []).length;
  const reframes = Number.isFinite(seasonReframeRoutes) ? seasonReframeRoutes : (log ?? []).filter((entry) => entry?.reframeOpenedRoute).length;
  const slack = (seasonBusts === 0 && seasonBestMultiplier >= GATE.heldLineMultiplier)
    || seasonBestLogic >= GATE.logicSlackStreak || seasonVaultPerCase >= GATE.vaultSlackPerCase;
  const recordClues = share(clues, cases, slack ? GATE.clueRateSlack : GATE.clueRate);

  const lacks = {
    "human-record": { reframes: share(reframes, cases, GATE.recordReframeRate), clues: share(clues, cases, GATE.recordClueRate), trust: atLeast(trust, GATE.recordTrust) },
    "evidence-reform": { clues: recordClues, legitimacy: atLeast(legitimacy, GATE.reformLegitimacy) },
    "open-oversight": { clues: recordClues, legitimacy: atLeast(legitimacy, GATE.oversightLegitimacy), trust: atLeast(trust, GATE.oversightTrust) },
    "cold-justice": { legitimacy: atLeast(legitimacy, GATE.coldLegitimacy), coldGap: atLeast(legitimacy - trust, GATE.coldGap) },
    "profitable-silence": { capital: atLeast(capital, GATE.silenceCapital), trustOver: under(trust, GATE.silenceTrust) },
    "field-pact": { pactGap: atLeast(trust - legitimacy, GATE.pactGap) },
  };
  const counted = new Set(["clues", "reframes"]);
  let best = null;
  for (const id of CANDIDATES) {
    if (id === endingId) continue;
    const gaps = Object.entries(lacks[id]).filter(([, value]) => value > 0).map(([key, value]) => ({ key, value }));
    if (!gaps.length) continue;
    const distance = gaps.reduce((sum, { key, value }) => sum + (counted.has(key) ? value / cases : value / 100), 0);
    if (!best || distance < best.distance) best = { id, gaps, distance };
  }
  return best ? { id: best.id, label: endingLabelOf(best.id), gaps: best.gaps } : null;
}
