import { useEffect, useRef, useState } from "react";

import { formatMoney } from "../gameConstants.js";
import { getClockCall } from "./tableReadout.js";
import { CLOCK_CUT_MS, dangerZoneOf, describeClockCut } from "./tableMeters.js";
import { findAudit } from "./auditRisk.js";
import { formatChange } from "./moneyFeedback.js";
import { ACT_START_CASES } from "./actCardGate.js";
import { SCOUT_NARROW_TRUST, SCOUT_TRUST } from "./tableRules.js";
import { decisionWindowSeconds } from "./stakeClock.js";
import { getBoardMark, getBreathWall, LOCK_CAP } from "./gauntletEngine.js";
import { BREATH_GAUGE, SIGN_CHIPS, SIGN_MARK } from "./nextTableRules.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

/** G15·G22: the line beside 숨 고르기: where the last BUST went, and on a hot one how far the wall moves. */
export const readBreathBust = (board) => fill(tableCopy.stage.breathBust, { heat: board.bustHeat }) + (board.breathHot ? fill(tableCopy.stage.breathHotWall, { wall: getBreathWall(board) }) : "");

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
 * - the stake clock (B5, honest form): when the heat crosses a stake tier and
 *   the window's clock is cut by its seconds -- or a cooling gives them back --
 *   the heat, the seconds it moved and the seconds left, once per crossing,
 *   so a listener hears what a sighted player sees the clock do;
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
// G1~G7 (the next rules): `lock` is LOCK refused with its reason, `breath` what 숨 고르기 did, `sign` the 결재 판's
// opening line, `exposure` 눈에 띔 building or clearing with the staked card.
const KIND_ORDER = Object.freeze({ status: -1, hold: 0, lock: 0.5, clock: 1, breath: 1.2, stakeClock: 1.5, bank: 2, act: 3, sign: 3.5, audit: 4, links: 5, stance: 6, exposure: 6.5, scout: 7, push: 8, wall: 9 });

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

/** What a look bought (`getWindowBand`) and cost (B1): the band it narrowed to, never the wall inside it, and the 믿음 it took (`trust`: the first look's price, G13). */
export const describeScout = ({ wallMin, wallMax, narrowed }, trust = SCOUT_TRUST) =>
  fill(narrowed ? voice().scoutNarrow : voice().scout, { min: wallMin, max: wallMax, trust: narrowed ? SCOUT_NARROW_TRUST : trust });

/**
 * The stake clock's move (B5): the heat that moved it, the seconds the
 * window's clock lost (`cut` > 0) or got back (`cut` < 0), and the seconds it
 * now shows. Only what the HUD's clock already shows, in words.
 */
const describeStakeClock = ({ gauge, cut, remaining }) =>
  fill(cut > 0 ? voice().stakeClockCut : voice().stakeClockBack, { gauge: Math.round(gauge), cut: Math.abs(cut), seconds: Math.max(0, Math.ceil(remaining)) });

/**
 * The window's whole clock at its heat, on a board that has the stake clock
 * (`stakeClock: true`, every board dealt since 2026-11-05), else null: an
 * older board's flat clock never moves, so it has nothing to say.
 */
export const readWindowSeconds = (win) => (win?.schema?.stakeClock === true ? decisionWindowSeconds(win.gauge, win.schema) : null);

/**
 * B5 seen (N43 step 3, 11-18 「전부 1」): what the mark beside the HUD's clock
 * shows, { text, key } for CLOCK_CUT_MS after the stake clock shortened, else
 * null. Read off the same whole clock as the voice's stake-clock line, so a
 * push across a tier and the clock's own creep across one -- which no push
 * line had told -- are shown alike. This window only (a new seed starts over)
 * and only while it is live (a bust's heat is not a cut). Shown, not heard:
 * the voice says it already, and nothing is played.
 */
export function useClockCut(win, seed) {
  const live = win.status === "live";
  const seconds = readWindowSeconds(win);
  const seenRef = useRef({ seed, seconds });
  const timerRef = useRef(null);
  const [cut, setCut] = useState(null);
  useEffect(() => {
    const seen = seenRef.current;
    seenRef.current = { seed, seconds };
    const text = seen.seed === seed && live ? describeClockCut(seen.seconds, seconds) : "";
    if (!text) return;
    setCut((last) => ({ text, key: (last?.key ?? 0) + 1 }));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCut(null), CLOCK_CUT_MS);
  }, [live, seed, seconds]);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return cut;
}

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
export function readTableFacts({ win, live, dangerLine, cashMutations, clock, hold = "idle", band = null, scoutTrust = SCOUT_TRUST, asked = 0, runPot = 0, pulse = "", exposure = "", lockRefused = 0, lockReason = "", breathLine = "", leakLine = "" }) {
  const carry = findStanceCarry(cashMutations);
  return {
    asked,
    // G1: 눈에 띔, said with the status when asked and once whenever the staked card builds or clears it.
    status: `${describeStatus({ gauge: win.gauge, dangerLine, runPot, remaining: clock.remaining, pulse })}${exposure ? ` ${exposure}` : ""}`,
    exposure,
    lockRefused,
    lockReason,
    breathed: win.breathed === true,
    breathLine,
    // G27 (trial only): said once when a full charge starts to leak.
    leakLine,
    live,
    pushes: win.pushes,
    push: describePush({ gauge: win.gauge, dangerLine }),
    zone: dangerZoneOf(dangerLine),
    wall: describeWall({ gauge: win.gauge, dangerLine }),
    carry: carry?.id ?? "",
    stance: carry ? describeStanceCarry({ focus: win.focus, carry }) : "",
    clock: getClockCall({ ...clock, live, paused: false }),
    hold: getHoldCall(hold),
    scout: band?.scouted ? describeScout(band, scoutTrust) : "",
    gauge: win.gauge,
    remaining: clock.remaining,
    windowSeconds: readWindowSeconds(win),
  };
}

/**
 * G1~G7 (the next rules): what the voice says of them. 눈에 띔 as the staked
 * card leaves it, LOCK's reason when a shut LOCK is pressed (`lockRefused`
 * counts the presses), and what 숨 고르기 did once pressed.
 */
function readNextLines({ win, logic = null, lockRefused = 0 }) {
  const stage = tableCopy.stage;
  return {
    exposure: logic?.exposure?.spoken ?? "",
    lockRefused,
    lockReason: fill(stage.lockShutReason, { cap: LOCK_CAP }),
    breathLine: win?.breathed ? fill(stage.breathDone, { gauge: BREATH_GAUGE, to: Math.round(win.gauge), wall: getBreathWall(win.schema) }) : "",
    leakLine: win?.schema?.chargeLeak === true && win.leakFocus < win.chargedFocus ? stage.chargeLeak : "",
  };
}

/** G6: the 결재 판's line, said once as its table opens: the stake and the cell it shows. */
function readSignOpening(win, band) {
  return getBoardMark(win?.schema) === SIGN_MARK && band?.shown !== undefined ? fill(tableCopy.stage.signOpen, { chips: SIGN_CHIPS, cell: band.shown }) : "";
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
  // G3: a LOCK refused says why, every time it is pressed; G7: 숨 고르기 says what it did; G1: 눈에 띔 moving.
  if (after.lockRefused > (before.lockRefused ?? 0) && after.lockReason) calls.push({ kind: "lock", text: after.lockReason });
  if (after.breathed && !before.breathed && after.breathLine) calls.push({ kind: "breath", text: after.breathLine });
  if (after.leakLine && !before.leakLine) calls.push({ kind: "leak", text: after.leakLine });
  if (after.exposure && after.exposure !== before.exposure) calls.push({ kind: "exposure", text: after.exposure });
  if (after.clock && after.clock !== before.clock) calls.push({ kind: "clock", text: after.clock });
  if (after.carry && after.carry !== before.carry) calls.push({ kind: "stance", text: after.stance });
  if (after.scout && after.scout !== before.scout) calls.push({ kind: "scout", text: after.scout });
  if (after.windowSeconds !== null && before.windowSeconds !== null && before.windowSeconds !== undefined && after.windowSeconds !== before.windowSeconds) {
    calls.push({ kind: "stakeClock", text: describeStakeClock({ gauge: after.gauge, cut: before.windowSeconds - after.windowSeconds, remaining: after.remaining }) });
  }
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
export function useTableVoice({ speaking, run, audit = null, links, caseId = null, logic = null, lockRefused = 0, ...table }) {
  const facts = readTableFacts({ ...table, runPot: run.runPot, ...readNextLines({ win: table.win, logic, lockRefused }) });
  const opening = readSignOpening(table.win, table.band);
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
  // G6: the 결재 판's line, said once when the table first speaks (the table is mounted afresh for every window).
  const openingRef = useRef(undefined);
  if (openingRef.current === undefined) openingRef.current = opening || null;

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
    if (openingRef.current) {
      calls.push({ kind: "sign", text: openingRef.current });
      openingRef.current = null;
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
