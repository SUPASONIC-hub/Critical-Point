import { useEffect, useRef, useState } from "react";

import { formatMoney } from "../gameConstants.js";
import { getClockCall } from "./tableReadout.js";
import { dangerZoneOf } from "./tableMeters.js";
import { findAudit } from "./auditRisk.js";
import { formatChange } from "./moneyFeedback.js";
import { ACT_START_CASES } from "./actCardGate.js";
import { SCOUT_TRUST } from "./tableRules.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

/**
 * What the table says aloud, in one polite region (E3, table-voice).
 *
 * The table could be seen and not heard: a push moved the heat and the
 * situation board and said nothing, so a listener had to walk back to the
 * meter after every press to learn where the hand stood. The region says the
 * few changes a decision turns on, short, and nothing else:
 *
 * - after each push, the heat and the board's own danger line -- the shown
 *   band's nearest edge, never the wall this window drew;
 * - when the heat crosses one of the danger line's three steps (벽까지 최소 N,
 *   밀면 벽 사정권, 벽 구간 안) with no push -- the clock's creep, a cooling
 *   press -- the heat and the line, once per crossing (E3 첫 단계, 11-05);
 * - when the LOCK charge starts to count for the stance, or the stance it
 *   counts for changes: the rule a cash would carry into the next board;
 * - what the last hand's settlement did to the money -- 이번 판 ±N, the case
 *   pot and the vault -- once, as the next window's table opens: the first
 *   moment after the reveal closes that the table has a voice (E3 2단계 (a),
 *   11-05; before that the line came only when the pot or the vault grew);
 * - that an act has begun (「N막 시작 · 사건 K」), once, as the first table of
 *   the case that opens it is dealt (E3 2단계 (c)); the act card is a dialog
 *   read on its own when it is shown;
 * - on a week that counts the audit (B3), where it stands when the table opens
 *   on a count the last window moved: once, never per push (the cash button
 *   carries what a cash now would do, in its description);
 * - on a table that counts B2's links, the line its reading carries for the
 *   board that opens (`said`, cascadeRisk.js: a new link, or one due next);
 * - the clock at ten and at five seconds, and a table the reading clock opened;
 * - that a press let the held 확정 go too soon (길게 눌러야 확정된다), or that a
 *   screen reader's tap armed it and a second one seals it (useHoldConfirm);
 * - what a look (SCOUT) bought: the narrower band, once, as the button is spent;
 * - when asked (key I or the 지금 상황 듣기 button, E3): the heat, the
 *   danger line, the case pot, the seconds left and the heartbeat, in one line
 *   at the front of the queue -- the numbers the screen shows, never the wall.
 *
 * It does not say the heartbeat unasked (a number that moves every tick is a
 * region that never stops talking), the creep the clock adds to the heat, or the
 * verdict: the slam (`VerdictSlam`, TableNotices.jsx) is an alert that says
 * BUST or the multiplier, and the region falls silent the moment the window
 * closes, so the verdict is read once (bust-read-once). A case's close is not
 * its either: the result screen has no table, and its own polite line
 * (GameRuntime's `screenReaderStatus`, ResultScreen.jsx) says the rank and,
 * since E3 2단계 (b), the standing against the collapse line.
 *
 * Calls are spaced `VOICE_GAP_MS` apart: a polite region whose text is
 * replaced before the reader has got to it is never read. A call waiting its
 * turn is replaced by a newer one of the same kind, so three quick pushes are
 * heard as the first and the last, and the same sentence is not said twice.
 */
const VOICE_GAP_MS = 1500;

/** The rules a cash carries into the next board when the stance's charge is held (`applyFocusCarry`). */
const STANCE_CARRY_IDS = new Set(["strikeWake", "steadyLine", "exposedHand"]);

/**
 * A line the listener asked for (`status`) is said before anything waiting:
 * it answers a key just pressed. Then the held 확정's hint or arm -- they
 * lapse in seconds -- then the clock's calls before the push's and the
 * stance's: a listener out of time has the least of it to lose.
 */
const KIND_ORDER = Object.freeze({ status: -1, hold: 0, clock: 1, bank: 2, act: 3, audit: 4, links: 5, stance: 6, scout: 7, push: 8, wall: 9 });

// The voice's words are src/copy/table.js's `voice` (영어판 4단계), read as
// each call is made, so another language laid over them is the one said.
const voice = () => tableCopy.voice;

/** What the voice says when a screen reader's tap has armed 확정 (hold-to-seal). Read when the call is made. */
export const getHoldArmedCall = () => voice().holdArmed;

/** What the voice says of the held 확정's phase: the hint after a short press, the arm after a tap, else nothing. */
export const getHoldCall = (phase) => (phase === "armed" ? getHoldArmedCall() : phase === "hinted" ? voice().holdHint : "");

export const describePush = ({ gauge, dangerLine }) => fill(voice().push, { gauge: Math.round(gauge), danger: dangerLine });

/** The heat and the danger line as the clock or a cooling press has moved them across a step of the line (`dangerZoneOf`). */
export const describeWall = ({ gauge, dangerLine }) => fill(voice().wall, { gauge: Math.round(gauge), danger: dangerLine });

export const describeStanceCarry = ({ focus, carry }) => fill(voice().stance, { focus: Math.round(focus), label: carry.label, title: carry.title });

/** What a look bought (`getWindowBand`) and cost (B1): the band it narrowed to, never the wall inside it, and the 믿음 it took. */
export const describeScout = ({ wallMin, wallMax }) => fill(voice().scout, { min: wallMin, max: wallMax, trust: SCOUT_TRUST });

/**
 * The table as it stands, when asked (E3, 「지금 상황 듣기」): the heat,
 * the board's danger line, the case pot, the seconds the clock shows and the
 * heartbeat (a number, or the sedated board's word). Only what the screen
 * shows: the wall this window drew is not handed in and cannot be said.
 */
export const describeStatus = ({ gauge, dangerLine, runPot = 0, remaining = 0, pulse = "" }) =>
  fill(voice().status, { gauge: Math.round(gauge), danger: dangerLine, pot: formatMoney(runPot), seconds: Math.max(0, Math.ceil(remaining)), bpm: pulse });

/** The last hand's settlement: what it did to the money (signed, formatChange), the case pot and the vault it left. */
export const describeBank = ({ hand = 0, runPot, vault }) => fill(voice().bank, { hand: formatChange(hand), pot: formatMoney(runPot), vault: formatMoney(vault) });

/** An act beginning, by the case that opens it (actCardGate's ACT_START_CASES, in order): 「2막 시작 · 사건 08」. */
export const describeAct = ({ act, caseId }) => fill(voice().act, { act, case: String(caseId).replace(/^case/, "") });

/** The rule the staked cash would carry for its stance, or null while the charge does not count. */
export const findStanceCarry = (cashMutations = []) => cashMutations.find((mutation) => STANCE_CARRY_IDS.has(mutation.id)) ?? null;

/**
 * What the table can be heard saying at one render: the facts the calls are
 * built from. `clock` is called as if the table were running, so a pause and
 * a resume do not count as the clock reaching ten seconds again.
 */
export function readTableFacts({ win, live, dangerLine, cashMutations, clock, hold = "idle", band = null, asked = 0, runPot = 0, pulse = "" }) {
  const carry = findStanceCarry(cashMutations);
  return {
    asked,
    status: describeStatus({ gauge: win.gauge, dangerLine, runPot, remaining: clock.remaining, pulse }),
    live,
    pushes: win.pushes,
    push: describePush({ gauge: win.gauge, dangerLine }),
    zone: dangerZoneOf(dangerLine),
    wall: describeWall({ gauge: win.gauge, dangerLine }),
    carry: carry?.id ?? "",
    stance: carry ? describeStanceCarry({ focus: win.focus, carry }) : "",
    clock: getClockCall({ ...clock, live, paused: false }),
    hold: getHoldCall(hold),
    scout: band?.scouted ? describeScout(band) : "",
  };
}

/**
 * The calls one change of facts makes, in the order they are to be said. A
 * closed window makes none: the slam has it.
 */
export function listTableCalls(before, after) {
  if (!after.live || !before) return [];
  const calls = [];
  if (after.asked > before.asked) calls.push({ kind: "status", text: after.status });
  if (after.hold && after.hold !== before.hold) calls.push({ kind: "hold", text: after.hold });
  if (after.clock && after.clock !== before.clock) calls.push({ kind: "clock", text: after.clock });
  if (after.carry && after.carry !== before.carry) calls.push({ kind: "stance", text: after.stance });
  if (after.scout && after.scout !== before.scout) calls.push({ kind: "scout", text: after.scout });
  if (after.pushes > before.pushes) calls.push({ kind: "push", text: after.push });
  // A push said the line it landed on; a crossing with no push is the clock's or a cooling press's.
  else if (after.zone && before.zone && after.zone !== before.zone) calls.push({ kind: "wall", text: after.wall });
  return calls;
}

/** A newer call of a kind replaces the waiting one; the queue stays in `KIND_ORDER`. */
export function queueCalls(queue, calls) {
  const kinds = new Set(calls.map((call) => call.kind));
  return [...queue.filter((call) => !kinds.has(call.kind)), ...calls].sort((left, right) => KIND_ORDER[left.kind] - KIND_ORDER[right.kind]);
}

/**
 * The case pot, the vault and the case, as the last table heard them. The
 * table is mounted afresh for every window (PlayScreen keys it by seed), and a
 * hand is settled between two of them, so no one table sees the money move. A
 * table remembers what it was dealt; the next window's table says what the
 * settlement in between did to it. Only the very next window counts: a save
 * loaded from somewhere else, or a debug jump, has no last hand to speak of.
 */
let heard = null;

/** The next window after `before` was dealt: the one `after` is, and no other. */
const follows = (before, after) => Boolean(before) && after.windowIndex === before.windowIndex + 1;

/**
 * The settlement between the window `before` was dealt and the one `after` is,
 * or null. The hand's ±N is what the money as a whole did -- the pot and the
 * vault together, so a closed case's pot moving to the vault is not a loss --
 * and a bust's −N is said here as well as in the slam: the slam says the pot it
 * took, once, under its alert; this is the settlement's one line after it.
 */
export function findBank(before, after) {
  if (!follows(before, after)) return null;
  const hand = after.runPot + after.vault - (before.runPot + before.vault);
  return { windowIndex: after.windowIndex, text: describeBank({ hand, runPot: after.runPot, vault: after.vault }) };
}

/** The act the window `after` opens, if it is the first table of a case that begins one, or null. */
export function findActStart(before, after) {
  if (!follows(before, after) || after.caseId === before.caseId) return null;
  const index = ACT_START_CASES.indexOf(after.caseId);
  return index < 0 ? null : { windowIndex: after.windowIndex, text: describeAct({ act: index + 1, caseId: after.caseId }) };
}

const SILENT = Object.freeze({ text: "", n: 0 });

/**
 * The one region's line and its count, for `TableNotices`, which draws it: the
 * stage hands over what the facts are read from and imports nothing for it. `speaking` is
 * a running table a listener is on: not under the briefing, a draft, the
 * reveal or a tab notice, all of which hold the clock. Every call is said from
 * a timer, never from the effect itself, and a closed window's region is
 * empty whatever was said last.
 */
export function useTableVoice({ speaking, run, audit = null, links, caseId = null, ...table }) {
  const facts = readTableFacts({ ...table, runPot: run.runPot });
  // Each line is a fresh node in the region (`n` keys it, TableNotices): a line
  // the same as the last -- 상황 듣기 asked twice on a table whose clock has not
  // started -- is still a change the reader announces.
  const [said, setSaid] = useState(SILENT);
  const factsRef = useRef(null);
  const queueRef = useRef([]);
  const lastAtRef = useRef(0);
  const timerRef = useRef(null);
  const bankRef = useRef(null);
  const actRef = useRef(null);
  const auditRef = useRef(null);
  const linksRef = useRef(null);
  const linkLine = links?.said;

  // Once a window: the settlement, the act, the audit and the links' line
  // since the last table, kept until they can be said. `??=` because a
  // development mount runs this twice, and the second run finds the pot
  // already heard.
  // The audit's reading is a fresh object every render; its count is what is heard.
  const auditCount = audit?.count ?? null;
  const auditLimit = audit?.limit ?? null;
  useEffect(() => {
    const dealt = { windowIndex: run.windowIndex, runPot: run.runPot, vault: run.vault, caseId, audit: auditCount === null ? null : { count: auditCount, limit: auditLimit } };
    bankRef.current ??= findBank(heard, dealt);
    actRef.current ??= findActStart(heard, dealt);
    auditRef.current ??= findAudit(heard, dealt);
    linksRef.current ??= linkLine && heard?.windowIndex + 1 === dealt.windowIndex ? linkLine : null;
    heard = dealt;
  }, [run.windowIndex, run.runPot, run.vault, caseId, auditCount, auditLimit, linkLine]);

  useEffect(() => {
    const before = factsRef.current;
    factsRef.current = facts;
    if (!facts.live) {
      // The slam says the verdict; nothing waiting is said over it or after it.
      queueRef.current = [];
      globalThis.clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (!speaking) return;
    const calls = listTableCalls(before, facts);
    if (bankRef.current) {
      calls.push({ kind: "bank", text: bankRef.current.text });
      bankRef.current = null;
    }
    if (actRef.current) {
      calls.push({ kind: "act", text: actRef.current.text });
      actRef.current = null;
    }
    if (auditRef.current) {
      calls.push({ kind: "audit", text: auditRef.current.text });
      auditRef.current = null;
    }
    if (linksRef.current) {
      calls.push({ kind: "links", text: linksRef.current });
      linksRef.current = null;
    }
    if (!calls.length) return;
    queueRef.current = queueCalls(queueRef.current, calls);
    if (timerRef.current) return;
    const say = () => {
      const [next, ...rest] = queueRef.current;
      queueRef.current = rest;
      timerRef.current = rest.length ? globalThis.setTimeout(say, VOICE_GAP_MS) : null;
      if (!next) return;
      lastAtRef.current = Date.now();
      setSaid((last) => ({ text: next.text, n: last.n + 1 }));
    };
    timerRef.current = globalThis.setTimeout(say, Math.max(0, lastAtRef.current + VOICE_GAP_MS - Date.now()));
  });

  useEffect(() => () => globalThis.clearTimeout(timerRef.current), []);
  return facts.live ? said : SILENT;
}
