import { AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_SHARE, weekRuleHasDevice } from "./weeklyRules.js";

/**
 * AUDIT (B3): the ledger that is too quiet.
 *
 * The table already prices two habits: a cash with no push (COLD FEET) and a
 * cash at 60 or more (HEAT DEBT). Between them a hand could push once and
 * close cold, case after case, and pay nothing. The audit counts that hand:
 *
 * - a cash pushed at least once and closed below `AUDIT_HEAT` adds one;
 * - a cash at `AUDIT_RELIEF_HEAT` (HEAT DEBT's 60) or more takes `AUDIT_RELIEF` off, never below 0;
 * - a bust, a window left, the clock, SCOUT, LOCK and the heartbeat move
 *   nothing (B3 decision 2; B4, B6 and B7 stay out).
 *
 * It reads only the heat the meter shows and the pushes, never the wall, so
 * the table can say before a cash what that cash will do to it.
 *
 * Judged once, on the window that closes a case: with `AUDIT_LIMIT` or more,
 * one part in `AUDIT_SHARE` of what the case moves to the vault is lost, and
 * the hand's share by the same part (decisions 3 and 4). No draw, no tool to
 * soften it (decision 12).
 *
 * Where it lives (decision 6): nowhere new. The case's own decision log holds
 * every window's `threshold` (state/useChoiceCommit.js), and the log is fresh
 * when a case opens, so `countAudit(log)` is the audit and the save keeps its
 * shape and its version. The engine is handed the count and judges.
 *
 * On only in a season whose week's rule switches it on (`weekRuleHasDevice`),
 * never in story mode or a practice case (decision 9). The engine's default
 * rules are "everything", so a `rules.has("audit")` would have switched it on
 * in every measurement at once; the week's stamp keeps those lines still.
 *
 * The file is a chunk of its own (AUDIT_RISK in vite.config.js), with the
 * table's words for it: the engine's chunk, the table's and the runtime's
 * each import it, and it imports nothing from any of them, so none of their
 * budgets carries it.
 */

/**
 * HEAT DEBT's heat (`HEAT_DEBT_GAUGE`, tableRules.js), where a cash takes the
 * audit down. Written here and not imported: tableRules.js is in the engine's
 * chunk, which imports this one. A unit test holds the two equal.
 */
export const AUDIT_RELIEF_HEAT = 60;

/** Whether this table counts the audit. */
export function isAuditOn(run) {
  return Boolean(run) && run.story !== true && !run.practice && weekRuleHasDevice(run.weekRule, "audit");
}

/**
 * What one settled window does to the audit: +1, −AUDIT_RELIEF or 0. The heat
 * is rounded as the verdict and the log round it, so the log, the engine and
 * the table's preview agree on a cash at 39.6.
 */
export function auditStep({ busted = false, gauge = 0, pushes = 0 } = {}) {
  if (busted) return 0;
  const heat = Math.round(Number(gauge) || 0);
  if (heat >= AUDIT_RELIEF_HEAT) return -AUDIT_RELIEF;
  return (Number(pushes) || 0) > 0 && heat < AUDIT_HEAT ? 1 : 0;
}

export const addAudit = (count, step) => Math.max(0, (Number(count) || 0) + step);

/** The audit a case's decision log stands at. An entry with no window (no `threshold`) counts nothing. */
export function countAudit(log = []) {
  let count = 0;
  for (const entry of log) {
    const threshold = entry?.threshold;
    if (!threshold) continue;
    count = addAudit(count, auditStep({ busted: threshold.busted === true || threshold.state === "bust", gauge: threshold.gauge, pushes: threshold.pushes }));
  }
  return count;
}

/**
 * The case close's judgement, for `resolveWindow`: `count` is the audit after
 * the closing window. What is lost is cut from what the case moves to the
 * vault and from the hand's share of it, by the same part, so the hand's
 * vault stays inside the vault.
 */
export function judgeAudit({ count, secured, hand }) {
  const caught = count >= AUDIT_LIMIT;
  return {
    caught,
    lost: caught ? Math.floor(Math.max(0, secured) / AUDIT_SHARE) : 0,
    handLost: caught ? Math.floor(Math.max(0, hand) / AUDIT_SHARE) : 0,
  };
}

/**
 * One window's settling, for `resolveWindow`: null on a table without the
 * audit; else the count after this window (`count` is the case's before it)
 * and, when the window closes a case that pays (`closed`), the judgement.
 */
export function settleAudit({ run, count, busted, gauge, pushes, closed, secured, hand }) {
  if (!isAuditOn(run)) return null;
  const after = addAudit(count, auditStep({ busted, gauge, pushes }));
  return { count: after, ...(closed ? judgeAudit({ count: after, secured, hand }) : { caught: false, lost: 0, handLost: 0 }) };
}

/**
 * The audit between the window `before` was dealt and the one `after` is, or
 * null, for the table's voice (tableVoice.js): as `findBank`, only the very
 * next window, and only on a table that counts it (`after.audit`, the
 * meters' reading) when the count moved.
 */
export function findAudit(before, after) {
  if (!before || !after.audit || after.windowIndex !== before.windowIndex + 1) return null;
  if (after.audit.count === before.audit?.count) return null;
  return { windowIndex: after.windowIndex, text: describeAudit(after.audit) };
}

/**
 * The HUD's reading, or null on a table without the audit: where it stands,
 * what a cash right now would make it, and whether the next +1 fills it.
 * The stage draws it as one token on the run signal line, in the bank's ember
 * (`gx-at-risk`) one short of the limit; `spoken` is the reading for the 확정
 * button's description.
 */
export function readAudit(run, count, win) {
  if (!isAuditOn(run)) return null;
  const now = Math.max(0, Math.trunc(Number(count) || 0));
  const ifCash = auditStep({ gauge: win?.gauge, pushes: win?.pushes });
  const reading = { count: now, limit: AUDIT_LIMIT, ifCash, afterCash: addAudit(now, ifCash), atRisk: now >= AUDIT_LIMIT - 1 };
  return { ...reading, spoken: describeAuditIfCash(reading) };
}

/** The cash button's description: what this cash does to the audit. 초안. */
export const describeAuditIfCash = ({ ifCash, afterCash, limit }) =>
  ifCash > 0 ? `지금 확정하면 감사 +1, ${afterCash}/${limit}` : ifCash < 0 ? `지금 확정하면 감사 −${-ifCash}, ${afterCash}/${limit}` : `지금 확정해도 감사 ${afterCash}/${limit} 그대로`;

/** What the voice says when a table opens on an audit that moved (B3). 초안. */
export const describeAudit = ({ count, limit }) =>
  `감사 위험 ${count}/${limit}. ${limit}칸이 차면 사건이 닫힐 때 금고로 갈 몫의 ${AUDIT_SHARE}분의 1을 잃는다`;
