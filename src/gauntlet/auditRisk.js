import auditCopy from "../copy/audit.js";
import { fill } from "../locale.js";

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
 *   nothing (B3 decision 2; B4, B6 and B7 stay out);
 * - a cash on a board B2's CASCADE dealt adds nothing: the link already pulled
 *   that wall closer, and closing low is the right call there, so one close is
 *   not punished twice (B2 decision 10, user 2026-10-19). Its relief stays,
 *   since relief is no penalty.
 *
 * It reads only the heat the meter shows and the pushes, never the wall, so
 * the table can say before a cash what that cash will do to it.
 *
 * Judged once, on the window that closes a case: with `AUDIT_LIMIT` or more,
 * one part in `AUDIT_SHARE` of what the case moves to the vault is lost, and
 * the hand's share by the same part (decisions 3 and 4). No draw. Decision 12
 * said no tool softens it either; C-7 (user, 2026-10-25, the draft's choice 1)
 * gave the draft one that does: AUDIT CONTACT (「감사실 연줄」) moves the limit
 * `AUDIT_CONTACT_SLACK` further for the run that holds it (`getAuditLimit`).
 *
 * Where it lives (decision 6): nowhere new. The case's own decision log holds
 * every window's `threshold` (state/useChoiceCommit.js), and the log is fresh
 * when a case opens, so `countAudit(log)` is the audit and the save keeps its
 * shape and its version. The engine is handed the count and judges.
 *
 * A rule of the table since RULES_MARK 3 (B3 and B2 together, one ranking
 * reset): on in a case whose rules have `audit` (tableUnlocks.js: from
 * 사건 02 since RULES_MARK 4 -- 프롤로그 04 at RULES_MARK 3 -- and from the
 * first case under NEW GAME+), never in story mode
 * or a practice case (decision 9). Before that it was 2026-W47's test week, a
 * device that week's rule switched on; its numbers, below, are the ones that
 * week played.
 *
 * The file is a chunk of its own (AUDIT_RISK in vite.config.js), with the
 * table's words for it: the engine's chunk, the table's and the runtime's
 * each import it.
 */

/**
 * Set B of the design's three (40 / 4 / -2 / one in four), decided by the
 * user on 2026-10-20 after the A/B/C measurement of PR #201 (A never caught a
 * season bot, C broke a check:pressure assertion and caught the hand that
 * watches the wall) and played as 2026-W47's test week. Here and not in
 * tableRules.js, which the engine's chunk holds: imported from there, the
 * build gave tableRules.js a chunk of its own (check:bundle, 2026-10-21).
 * scripts/sim/audit-values.mjs rewrites the four for the other sets.
 */
export const AUDIT_HEAT = 40;
export const AUDIT_LIMIT = 4;
export const AUDIT_RELIEF = 2;
export const AUDIT_SHARE = 4;
/** How much further AUDIT CONTACT moves the limit (C-7). */
export const AUDIT_CONTACT_SLACK = 1;

/**
 * G35 너무 매끈한 장부 (RULES_MARK 9, the user's 「전부 1」 of 2026-11-25): the
 * audit no longer counts cold cashes, which only heat 20 and 30 hands ever
 * met (600 seasons: 10 catches). It counts the case's cashes -- pushed at
 * least once, not on a CASCADE board, not a charged EXPOSE -- that closed
 * within `SMOOTH_SPAN` of one another, both ways: `SMOOTH_LIMIT` of them in
 * one band of 2 x SMOOTH_SPAN heat and the books look made up. The skilled
 * habit of cutting at the same place every time is what it reads. The case's
 * audit is then a tally, the heats it counted (`countAudit`), and its level
 * the most of them in one band (`getSmoothness`); the judgement and the
 * share it takes are the same. Before 9 the tally is the count, as it was.
 * The chunk still imports nothing but its words: the callers, who read the
 * case's rules (nextTableRules.js `isMarkNineOn`), say `smooth`.
 */
export const SMOOTH_SPAN = 2;
// 4, not the notes' 5: 80 bot seasons caught 0.10 a season at ±2/5, 0.33 at ±2/4 (target 0.3~1), 0.25 at ±3/5 (게임성 4차 G35).
export const SMOOTH_LIMIT = 4;

/** The most heats of `tally` within one band of 2 x SMOOTH_SPAN (0 for none). */
export function getSmoothness(tally) {
  const heats = (Array.isArray(tally) ? tally : []).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  let most = 0;
  for (let low = 0, high = 0; high < heats.length; high += 1) {
    while (heats[high] - heats[low] > SMOOTH_SPAN * 2) low += 1;
    most = Math.max(most, high - low + 1);
  }
  return most;
}

/** The audit's level: the count before RULES_MARK 9, the tally's smoothness from it. */
export const getAuditLevel = (count) => (Array.isArray(count) ? getSmoothness(count) : Math.max(0, Math.trunc(Number(count) || 0)));

/** The audit's limit for a run: `AUDIT_LIMIT` (`SMOOTH_LIMIT` under RULES_MARK 9), `AUDIT_CONTACT_SLACK` more with AUDIT CONTACT among its relics. */
export function getAuditLimit(relics, smooth = false) {
  return (smooth ? SMOOTH_LIMIT : AUDIT_LIMIT) + (Array.isArray(relics) && relics.includes("auditContact") ? AUDIT_CONTACT_SLACK : 0);
}
/**
 * HEAT DEBT's heat (`HEAT_DEBT_GAUGE`, tableRules.js), where a cash takes the
 * audit down. Written here and not imported, for the same reason. A unit
 * test holds the two equal.
 */
export const AUDIT_RELIEF_HEAT = 60;

/** Whether this table counts the audit: the case's `rules` (the set the engine is handed) have it. */
export function isAuditOn(run, rules) {
  return Boolean(run) && run.story !== true && !run.practice && Boolean(rules?.has?.("audit"));
}

/**
 * What one settled window does to the audit: +1, −AUDIT_RELIEF or 0. The heat
 * is rounded as the verdict and the log round it, so the log, the engine and
 * the table's preview agree on a cash at 39.6.
 */
export function auditStep({ busted = false, gauge = 0, pushes = 0, cascade = false } = {}) {
  if (busted) return 0;
  const heat = Math.round(Number(gauge) || 0);
  if (heat >= AUDIT_RELIEF_HEAT) return -AUDIT_RELIEF;
  return !cascade && (Number(pushes) || 0) > 0 && heat < AUDIT_HEAT ? 1 : 0;
}

/** Whether a board (a run's `schema`) was dealt CASCADE, whose cash the audit does not count. */
const isCascadeBoard = (schema) => Boolean(schema?.mutations?.includes("cascade"));

export const addAudit = (count, step) => Math.max(0, (Number(count) || 0) + step);
/** G3 (the next rules): a charged EXPOSE cash adds no mark; it still takes the relief of a hot one. */
const shieldStep = (step, shield) => (shield && step > 0 ? 0 : step);

/**
 * The audit a case's decision log stands at. An entry with no window (no
 * `threshold`) counts nothing. As cascadeRisk.js's `walkLinks` reads it, a
 * window's board was dealt by the window before it (its `environmentMode`);
 * the case's first board has none before it and is REBOOT's, which never
 * carries CASCADE (a carried link is due from board 1), so it always counts.
 */
export function countAudit(log = [], smooth = false) {
  // G35 (RULES_MARK 9, `smooth`): the heats the case's counted cashes closed at (`smoothStep`).
  let count = smooth ? [] : 0;
  let cascade = false;
  for (const entry of log) {
    const threshold = entry?.threshold;
    if (!threshold) continue;
    const busted = threshold.busted === true || threshold.state === "bust";
    if (smooth) count = smoothStep(count, { busted, gauge: threshold.gauge, pushes: threshold.pushes, cascade, shield: threshold.auditShield === true });
    else count = addAudit(count, shieldStep(auditStep({ busted, gauge: threshold.gauge, pushes: threshold.pushes, cascade }), threshold.auditShield === true));
    // No other board rule's id has "cascade" in it.
    cascade = String(entry.environmentMode).includes("cascade");
  }
  return count;
}

/** G35: the tally after one settled window: its heat added when it is a cash pushed at least once, off CASCADE, not shielded. */
export function smoothStep(tally, { busted = false, gauge = 0, pushes = 0, cascade = false, shield = false } = {}) {
  const before = Array.isArray(tally) ? tally : [];
  return busted || cascade || shield || !((Number(pushes) || 0) > 0) ? before : [...before, Math.round(Number(gauge) || 0)];
}

/**
 * The case close's judgement, for `resolveWindow`: `count` is the audit after
 * the closing window. What is lost is cut from what the case moves to the
 * vault and from the hand's share of it, by the same part, so the hand's
 * vault stays inside the vault.
 */
export function judgeAudit({ count, secured, hand, limit = AUDIT_LIMIT, base = AUDIT_LIMIT }) {
  const caught = count >= limit;
  return {
    caught,
    // AUDIT CONTACT's slack was what kept it from catching (`relicProcs`).
    ...(!caught && count >= base ? { spared: true } : {}),
    lost: caught ? Math.floor(Math.max(0, secured) / AUDIT_SHARE) : 0,
    handLost: caught ? Math.floor(Math.max(0, hand) / AUDIT_SHARE) : 0,
  };
}

/**
 * One window's settling, for `resolveWindow`: null on a table without the
 * audit; else the count after this window (`count` is the case's before it)
 * and, when the window closes a case that pays (`closed`), the judgement.
 */
export function settleAudit({ run, rules, count, busted, gauge, pushes, closed, secured, hand, shield = false, smooth = false }) {
  if (!isAuditOn(run, rules)) return null;
  // G35 (RULES_MARK 9): the tally takes the cash's heat, and its smoothness is judged (`count` stays the tally, `level` the number).
  if (smooth) {
    const tally = smoothStep(count, { busted, gauge, pushes, cascade: isCascadeBoard(run.schema), shield });
    const level = getSmoothness(tally);
    return { count: tally, level, ...(closed ? judgeAudit({ count: level, secured, hand, limit: getAuditLimit(run.relics, true), base: SMOOTH_LIMIT }) : { caught: false, lost: 0, handLost: 0 }) };
  }
  const after = addAudit(count, shieldStep(auditStep({ busted, gauge, pushes, cascade: isCascadeBoard(run.schema) }), shield));
  return { count: after, ...(closed ? judgeAudit({ count: after, secured, hand, limit: getAuditLimit(run.relics) }) : { caught: false, lost: 0, handLost: 0 }) };
}

/**
 * The audit between the window `before` was dealt and the one `after` is, or
 * null, for the table's voice (tableVoice.js): as `findBank`, only the very
 * next window, and only on a table that counts it (`after.audit`, the
 * meters' reading) when the count moved.
 */
export function findAudit(before, after) {
  if (!before || !after.audit || after.windowIndex !== before.windowIndex + 1) return null;
  if (after.audit.count === before.audit?.count && after.audit.smooth === before.audit?.smooth) return null;
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
  if (!run || count == null) return null;
  if (Array.isArray(count)) return readSmooth(run, count, win);
  const now = Math.max(0, Math.trunc(Number(count) || 0));
  const ifCash = auditStep({ gauge: win?.gauge, pushes: win?.pushes, cascade: isCascadeBoard(run.schema) });
  const limit = getAuditLimit(run.relics);
  const reading = { count: now, limit, ifCash, afterCash: addAudit(now, ifCash), atRisk: now >= limit - 1 };
  return { ...reading, spoken: describeAuditIfCash(reading) };
}

/**
 * G35's reading (RULES_MARK 9): the tally's smoothness, what a cash now makes
 * it, and `band`, the heats where a cash would raise it (the first such run,
 * drawn on the gauge instead of the cold line), or null while none would.
 */
function readSmooth(run, tally, win) {
  const now = getSmoothness(tally);
  const cash = smoothStep(tally, { gauge: win?.gauge, pushes: win?.pushes, cascade: isCascadeBoard(run.schema) });
  const afterCash = getSmoothness(cash);
  const limit = getAuditLimit(run.relics, true);
  let band = null;
  for (let heat = 0; heat <= 100; heat += 1) {
    if (getSmoothness([...tally, heat]) <= now) {
      if (band) break;
    } else band = [band?.[0] ?? heat, heat + 1];
  }
  const reading = { count: now, limit, ifCash: afterCash - now, afterCash, atRisk: now >= limit - 1, smooth: tally.join(), band: now > 0 ? band : null, warn: auditCopy.smoothWarn };
  return { ...reading, spoken: fill(afterCash > now ? auditCopy.smoothUp : auditCopy.smoothSame, { after: afterCash, limit, span: SMOOTH_SPAN }) };
}

/**
 * The cash button's description: what this cash does to the audit (on a
 * CASCADE board a cold cash leaves it as it is; the line that opened the audit in 프롤로그 04 at RULES_MARK 3 said why). 초안.
 */
const describeAuditIfCash = ({ ifCash, afterCash, limit }) =>
  fill(ifCash > 0 ? auditCopy.ifCashUp : ifCash < 0 ? auditCopy.ifCashDown : auditCopy.ifCashSame, { relief: -ifCash, after: afterCash, limit });

/** What the voice says when a table opens on an audit that moved (B3). 초안. */
const describeAudit = ({ count, limit, smooth }) =>
  fill(smooth === undefined ? auditCopy.spoken : auditCopy.smoothSpoken, { count, limit, share: AUDIT_SHARE, span: SMOOTH_SPAN });

/**
 * The cases whose step of the ladder does not have the audit yet (tableUnlocks.js
 * opens it at 사건 02 since RULES_MARK 4, C-4). Written out so the table
 * record's chunk does not take the ladder; a unit test holds it to `rulesFor`.
 * `CASES_BEFORE_AUDIT_MARK3` is the ladder of RULES_MARK 3, which opened it at
 * 프롤로그 04: a case closed then is read by the ladder it was played on.
 */
export const CASES_BEFORE_AUDIT = Object.freeze(["prologue01", "prologue02", "prologue03", "prologue04", "prologue05", "case01"]);
export const CASES_BEFORE_AUDIT_MARK3 = Object.freeze(["prologue01", "prologue02", "prologue03"]);

/**
 * The table record's audit sentence (GauntletLedger.jsx), or null: one more
 * sentence after the record's, never a seventh cell, so the grid and its CSS
 * stay as they are (user, 2026-10-20, the PR's first question, choice 1).
 * Rebuilt from what the record has, as the rest of it is: the count off the
 * case's log (what the close judged), the case and the case summary
 * (`summary`, createRunSummary). A case closed at RULES_MARK 4 or later counts
 * from 사건 02 on, one closed at RULES_MARK 3 from 프롤로그 04 on (the summary
 * does not say NEW GAME+, so its cases before those say nothing); one closed
 * before RULES_MARK 3 says nothing (2026-W47's
 * cases were the only ones that counted, and the record is only ever the case
 * on the table). A story case and a replayed one count nothing, as
 * `isAuditOn` says; the log tells which by an entry's `assistStory` or the
 * replay's closing `firstRecord`.
 * A full audit adds 적발; what it took is the result window's vault line.
 * The system's words, no 반재욱 line (user, 2026-10-20, second question, 3).
 * Here and not in the result screen's chunk, which has no room and whose
 * budget does not go up (check-bundle-size.mjs).
 */
export function describeAuditLedger(log, summary, caseId) {
  if (!log.some((entry) => entry?.threshold) || log.some((entry) => entry?.assistStory || entry?.threshold?.firstRecord)) return null;
  const mark = Number(summary?.tableRules);
  if (!(mark >= 3) || (mark >= 4 ? CASES_BEFORE_AUDIT : CASES_BEFORE_AUDIT_MARK3).includes(caseId)) return null;
  // G35: a case closed at RULES_MARK 9 or later was judged on its smoothness; one before it on the count (`before9`).
  const smooth = mark >= 9;
  const count = getAuditLevel(countAudit(log, smooth));
  const limit = getAuditLimit(summary?.relics, smooth);
  return `${fill(auditCopy.ledger, { count, limit })}${count < limit ? "" : auditCopy.caught}`;
}
