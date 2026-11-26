import { isMarkNineOn } from "./nextTableRules.js";

/**
 * G34 보상금 (게임성 개선점 4차, the user's 「전부 1」 of 2026-11-25; RULES_MARK 9).
 *
 * A case that closed on people hurt can be paid off from the KD은행 계좌 as
 * it closes: the case's harm is wiped from the season's tally (the collapse
 * gate reads what is left, seasonStanding.js `caseHarm`), and the payment is
 * kept as a cover (덮은 기록) -- 공정함 down and the ruling leaning to the
 * endings made of silence. The price starts at PAY_BASE (about a quarter of
 * what a case banks, check:endings' vault a case) and rises PAY_RISE times
 * with every cover of the season, PAY_MOST at most: the ladder below is every
 * price a payment can have, and the server takes no other
 * (*_settlement_pay_g34.sql).
 *
 * The payment is answered between cases: the run carries it (`paid`) to the
 * next case's open snapshot, where the chain recheck reads it against the
 * vault the case before closed on.
 */
export const PAY_BASE = 9000;
export const PAY_RISE = 1.5;
export const PAY_MOST = 10;
/** The most harm one payment can wipe: what the server takes (a case's human cost is far under it). */
export const PAY_HARM_MOST = 200;
export const PAY_LADDER = Object.freeze(Array.from({ length: PAY_MOST }, (_, n) => Math.round((PAY_BASE * PAY_RISE ** n) / 100) * 100));

/** The price of the season's next cover, after `covers` of them; null once the ladder is spent. */
export const payPriceAt = (covers) => PAY_LADDER[Math.max(0, Math.trunc(Number(covers) || 0))] ?? null;

/** How many of the season's cases were paid off. */
export const countCovers = (caseResults) => Object.values(caseResults ?? {}).filter((summary) => summary?.covered).length;

/**
 * What paying off `caseId` would be, or null when it cannot be: under
 * RULES_MARK 9, a case closed with harm and not paid yet, not the finale, not
 * in story mode or a replay, and a vault that holds the price.
 */
export function readPayOffer({ caseId, caseResults = {}, vault = 0, story = false, practice = false, rules = undefined } = {}) {
  const summary = caseResults?.[caseId];
  if (!summary || caseId === "final" || story || practice || summary.assistStory === true || summary.covered || !isMarkNineOn(rules)) return null;
  const harm = Math.max(0, Math.round(Number(summary.finalHumanCost) || 0));
  const cost = payPriceAt(countCovers(caseResults));
  if (harm <= 0 || cost === null) return null;
  return { caseId, harm, cost, covers: countCovers(caseResults), afford: (Number(vault) || 0) >= cost };
}

/** The case summary paid off: its harm kept as it closed, the cover beside it (what the tally takes off). */
export const coverCase = (summary, { cost, harm }) => ({ ...summary, covered: { cost, harm } });

/** A payment as the run carries it to the next case's open snapshot (`open.paid`), or null for anything else. */
export function normalizePaid(value) {
  if (!value || typeof value !== "object") return null;
  const cost = Math.round(Number(value.cost));
  const harm = Math.round(Number(value.harm));
  if (!PAY_LADDER.includes(cost) || !Number.isFinite(harm) || harm <= 0 || harm > PAY_HARM_MOST || typeof value.caseId !== "string") return null;
  return { caseId: value.caseId.slice(0, 32), cost, harm };
}
