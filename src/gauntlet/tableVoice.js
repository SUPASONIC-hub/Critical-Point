import { useEffect, useRef, useState } from "react";

import { formatNumber } from "../gameConstants.js";
import { getClockCall } from "./tableReadout.js";

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
 * - when the LOCK charge starts to count for the stance, or the stance it
 *   counts for changes: the rule a cash would carry into the next board;
 * - when a cash has banked the hand into the case pot, or a closed case has
 *   moved that pot to the vault: what is at stake now and what is safe, once,
 *   as the next window's table opens (the slam said the cash's own +N);
 * - the clock at ten and at five seconds, and a table the reading clock opened;
 * - that a first press armed 확정 and a second one seals it (useHoldConfirm);
 * - what a look (SCOUT) bought: the narrower band, once, as the button is spent.
 *
 * It does not say the heartbeat (a number that moves every tick is a region
 * that never stops talking), the creep the clock adds to the heat, or the
 * verdict: the slam (`VerdictSlam`, TableNotices.jsx) is an alert that says
 * BUST or the multiplier, and the region falls silent the moment the window
 * closes, so the verdict is read once (bust-read-once).
 *
 * Calls are spaced `VOICE_GAP_MS` apart: a polite region whose text is
 * replaced before the reader has got to it is never read. A call waiting its
 * turn is replaced by a newer one of the same kind, so three quick pushes are
 * heard as the first and the last, and the same sentence is not said twice.
 */
export const VOICE_GAP_MS = 1500;

/** The rules a cash carries into the next board when the stance's charge is held (`applyFocusCarry`). */
const STANCE_CARRY_IDS = new Set(["strikeWake", "steadyLine", "exposedHand"]);

/**
 * The armed 확정 first -- it lapses in three seconds -- then the clock's calls
 * before the push's and the stance's: a listener out of time has the least of
 * it to lose.
 */
const KIND_ORDER = Object.freeze({ hold: 0, clock: 1, bank: 2, stance: 3, scout: 4, push: 5 });

/** What the voice says when a first press has armed 확정 (hold-to-seal). */
export const HOLD_ARMED_CALL = "한 번 더 누르면 확정된다";

export const describePush = ({ gauge, dangerLine }) => `열기 ${Math.round(gauge)} · ${dangerLine}`;

export const describeStanceCarry = ({ focus, carry }) => `충전 ${Math.round(focus)} · 확정하면 다음 판 ${carry.label} · ${carry.title}`;

/** What a look bought (`getWindowBand`): the band it narrowed to, never the wall inside it. */
export const describeScout = ({ wallMin, wallMax }) => `조회했다. 벽은 ${wallMin}에서 ${wallMax} 사이 어딘가`;

export const describeBank = ({ runPot, vault }) => `판돈 ${formatNumber(runPot)} · 금고 ${formatNumber(vault)}`;

/** The rule the staked cash would carry for its stance, or null while the charge does not count. */
export const findStanceCarry = (cashMutations = []) => cashMutations.find((mutation) => STANCE_CARRY_IDS.has(mutation.id)) ?? null;

/**
 * What the table can be heard saying at one render: the facts the calls are
 * built from. `clock` is called as if the table were running, so a pause and
 * a resume do not count as the clock reaching ten seconds again.
 */
export function readTableFacts({ win, live, dangerLine, cashMutations, clock, armed = false, band = null }) {
  const carry = findStanceCarry(cashMutations);
  return {
    live,
    pushes: win.pushes,
    push: describePush({ gauge: win.gauge, dangerLine }),
    carry: carry?.id ?? "",
    stance: carry ? describeStanceCarry({ focus: win.focus, carry }) : "",
    clock: getClockCall({ ...clock, live, paused: false }),
    hold: armed ? HOLD_ARMED_CALL : "",
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
  if (after.hold && after.hold !== before.hold) calls.push({ kind: "hold", text: after.hold });
  if (after.clock && after.clock !== before.clock) calls.push({ kind: "clock", text: after.clock });
  if (after.carry && after.carry !== before.carry) calls.push({ kind: "stance", text: after.stance });
  if (after.scout && after.scout !== before.scout) calls.push({ kind: "scout", text: after.scout });
  if (after.pushes > before.pushes) calls.push({ kind: "push", text: after.push });
  return calls;
}

/** A newer call of a kind replaces the waiting one; the queue stays in `KIND_ORDER`. */
export function queueCalls(queue, calls) {
  const kinds = new Set(calls.map((call) => call.kind));
  return [...queue.filter((call) => !kinds.has(call.kind)), ...calls].sort((left, right) => KIND_ORDER[left.kind] - KIND_ORDER[right.kind]);
}

/**
 * The case pot and the vault, as the last table heard them. The table is
 * mounted afresh for every window (PlayScreen keys it by seed), and a cash is
 * banked in the settle between two of them, so no one table sees either grow.
 * A table remembers what it was dealt; the next window's table, if either grew
 * in between, has a bank to say. Only the very next window counts: a save
 * loaded from somewhere else is not a bank, and a bust -- the pot going down --
 * is the slam's.
 */
let heard = null;

/** The bank between the window `before` was dealt and the one `after` is, or null. */
export function findBank(before, after) {
  if (!before || after.windowIndex !== before.windowIndex + 1) return null;
  if (after.runPot <= before.runPot && after.vault <= before.vault) return null;
  return { windowIndex: after.windowIndex, text: describeBank(after) };
}

/**
 * The one region's text, for `TableNotices`, which draws it: the stage hands
 * over what the facts are read from and imports nothing for it. `speaking` is
 * a running table a listener is on: not under the briefing, a draft, the
 * reveal or a tab notice, all of which hold the clock. Every call is said from
 * a timer, never from the effect itself, and a closed window's region is
 * empty whatever was said last.
 */
export function useTableVoice({ speaking, run, ...table }) {
  const facts = readTableFacts(table);
  const [said, setSaid] = useState("");
  const factsRef = useRef(null);
  const queueRef = useRef([]);
  const lastAtRef = useRef(0);
  const timerRef = useRef(null);
  const bankRef = useRef(null);

  // Once a window: the bank since the last table, kept until it can be said.
  // `??=` because a development mount runs this twice, and the second run
  // finds the pot already heard.
  useEffect(() => {
    const dealt = { windowIndex: run.windowIndex, runPot: run.runPot, vault: run.vault };
    bankRef.current ??= findBank(heard, dealt);
    heard = dealt;
  }, [run.windowIndex, run.runPot, run.vault]);

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
    if (!calls.length) return;
    queueRef.current = queueCalls(queueRef.current, calls);
    if (timerRef.current) return;
    const say = () => {
      const [next, ...rest] = queueRef.current;
      queueRef.current = rest;
      timerRef.current = rest.length ? globalThis.setTimeout(say, VOICE_GAP_MS) : null;
      if (!next) return;
      lastAtRef.current = Date.now();
      setSaid(next.text);
    };
    timerRef.current = globalThis.setTimeout(say, Math.max(0, lastAtRef.current + VOICE_GAP_MS - Date.now()));
  });

  useEffect(() => () => globalThis.clearTimeout(timerRef.current), []);
  return facts.live ? said : "";
}
