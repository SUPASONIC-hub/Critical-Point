/**
 * Server checks, phase 3, piece S4 (F1, 서버검증-설계안.md, "10-21 저녁 3단계
 * 점검"): the chain checker's frame. Phase 2 (rankingRecheck.js, #216) shows
 * that each window comes out of its record; it trusts what the record stands
 * on. This reads one run's case rows in CASE_SEQUENCE order and checks that
 * they chain: what a case closed on is what the next case opened on, and inside
 * a case what one decision left is what the next one started from.
 *
 * The answer is a mark, never a refusal (decision 2 (1)), and one mark,
 * `chain-off-log` (question 3 (1)); where the chain broke, and on what, goes in
 * the report the Actions summary prints.
 *
 * What a row carries today is checked; what it does not is counted as not
 * checked ("검증 안 함"), never passed:
 *
 *   inside a case   each entry's `caseId` is its row's case, and its
 *                   `resourcesBefore` is the entry before's `resourcesAfter`.
 *                   The board, the next scene, `resourcesAfter` itself, the
 *                   audit and the CASCADE need the settlement run again (S2).
 *   between cases   the run counters in `dynamics` (createRunSummary) only
 *                   move forward and by no more than the windows between:
 *                   `windowIndex` by at least the next case's decisions (more
 *                   is practice windows, which leave no row), `busts` by at
 *                   least the busts that case logged and at most those plus the
 *                   practice windows, `cashes` by at most its windows, `vault`
 *                   and `handVault` never down (a practice run restores them,
 *                   the audit takes from what is being secured, not from the
 *                   vault), and the table mark and the week stamp the same.
 *   the opening     the snapshot each case row carries as `dynamics.open`
 *                   (S3, question 8 (1); gauntletEngine's `createCaseOpen`)
 *                   against the close before it, "닫힘 = 다음 열림": the vault
 *                   and its hand share the same, the window count not behind
 *                   the close and at least the case's decisions behind its
 *                   own close, every tool one the close held or was offering
 *                   (`relicOffer`), NEW GAME+ the same as the case before's;
 *                   when no window but practice lay between (a replay hands
 *                   all of it back), the stance mastery, the logic streak and
 *                   the links (`linksIn` = the close's `linksOut`, none in
 *                   story mode) the same as well. The season's first case
 *                   opens empty: no vault, tools or links, and with no window
 *                   played no busts, cashes, mastery or streak. The opening
 *                   resources are its first decision's `resourcesBefore`.
 *                   Still not checked: the board it opened on (LOCK's carry,
 *                   `focusCarry`, needs the settlement, S2) and the opening
 *                   route's resources against the case before's result
 *                   (`openingRoute`, describeCaseOpening). A row from a build
 *                   before the snapshot counts all of the opening as not
 *                   checked (UNCHECKED.open).
 *
 * A gap in the rows (a case not delivered, or past retention) breaks no link:
 * the two sides of it are counted as not checked.
 */
import { CASE_SEQUENCE } from "./gameCases.js";
import { RULES_MARK_KEY } from "./gauntlet/gauntletEngine.js";

/**
 * The one mark the chain adds to a ranking row (question 3 (1)); its only
 * home (rankingRecheck.js points here, check:grants imports it). It goes to
 * ranking_set_recheck_marks with the phase 2 marks in the same call (S6).
 */
export const CHAIN_MARK = "chain-off-log";

/** The six resources a decision moves (resourcesBefore / resourcesAfter). */
const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];

/** The `dynamics` counters the chain between two cases reads. */
const COUNTERS = ["windowIndex", "busts", "cashes", "vault", "handVault"];

/**
 * What this frame cannot check yet, by where it waits. Each is counted once
 * per case (inside) or per link (between) in `unchecked`.
 */
export const UNCHECKED = Object.freeze({
  // TODO(S2): with settleChoice(state, input) out of useChoiceCommit, play the
  // settlement entry by entry and compare: the board each window was dealt
  // (buildNextSchema, with isLinkDue/carryLinksOut for CASCADE), the next
  // scene (card `next`, reframeTarget, the detour, BLACKOUT's skip),
  // `resourcesAfter` (card effect + applyGauntletEffect), and the audit
  // (countAudit/settleAudit) on the vault. Import the engine's functions, never
  // copies, so the 11-02 verdict's rules follow (question 6 (1)).
  inside: Object.freeze(["board", "scene", "resourcesAfter", "audit", "cascade"]),
  // What the opening snapshot (S3) still cannot answer, on every link.
  between: Object.freeze(["focusCarry", "openingRoute"]),
  // What a row without the snapshot (a build before S3) leaves unchecked.
  open: Object.freeze(["open", "relics", "stanceMastery", "links", "logic", "openingResources", "newGamePlusStart"]),
});

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const numberOf = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);

function sameResources(left, right) {
  if (!isObject(left) || !isObject(right)) return false;
  return RESOURCE_KEYS.every((key) => numberOf(left[key]) !== null && left[key] === right[key]);
}

/**
 * One case's decisions, chained. A row with no readable log is not checked;
 * a log entry without both resource sets leaves its link not checked.
 */
export function recheckCaseLinks(row) {
  const log = Array.isArray(row?.decision_log) ? row.decision_log : null;
  if (!log) return { status: "unchecked", breaks: [], unchecked: ["log"] };
  const breaks = [];
  const unchecked = [...UNCHECKED.inside];
  // The case opened on the hand its first decision started from (S3).
  const opening = row?.dynamics?.open?.resources;
  if (isObject(opening) && isObject(log[0]?.resourcesBefore) && !sameResources(opening, log[0].resourcesBefore)) {
    breaks.push({ entry: 0, field: "resourcesBefore", expected: opening, found: log[0].resourcesBefore });
  }
  log.forEach((entry, index) => {
    if (!isObject(entry)) {
      breaks.push({ entry: index, field: "entry" });
      return;
    }
    if (entry.caseId !== undefined && entry.caseId !== row.case_id) breaks.push({ entry: index, field: "caseId", expected: row.case_id, found: entry.caseId });
    if (index === 0) return;
    const before = log[index - 1]?.resourcesAfter;
    if (!isObject(before) || !isObject(entry.resourcesBefore)) {
      if (!unchecked.includes("resources")) unchecked.push("resources");
      return;
    }
    if (!sameResources(before, entry.resourcesBefore)) breaks.push({ entry: index, field: "resourcesBefore", expected: before, found: entry.resourcesBefore });
  });
  return { status: breaks.length ? "broken" : "linked", breaks, unchecked };
}

const loggedBusts = (log) => log.filter((entry) => entry?.threshold?.busted === true).length;

const sameList = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const STANCES = ["strike", "steady", "expose"];

/**
 * The opening snapshot of `after` (S3) against the close of `before`, or
 * against an empty start when `before` is null. Pushes onto `breaks` and
 * `unchecked`; a field the close does not carry (a build before it) leaves
 * its comparison not checked rather than broken.
 */
function recheckOpening(before, after, snapshot, breaks, unchecked) {
  const log = after.decision_log;
  const caseClose = numberOf(after.dynamics.windowIndex);
  if (snapshot.caseId !== after.case_id) breaks.push({ field: "open.caseId", expected: after.case_id, found: snapshot.caseId });
  if (caseClose !== null && numberOf(snapshot.windowIndex) !== null && caseClose - snapshot.windowIndex < log.length) {
    breaks.push({ field: "open.windowIndex", expected: `${caseClose - log.length} or less`, found: snapshot.windowIndex });
  }
  // A first close sent from a replay is the replay's table: not read as the season's.
  if (snapshot.practice === true) {
    unchecked.push("practice");
    return;
  }
  const relics = Array.isArray(snapshot.relics) ? snapshot.relics : null;
  const links = Array.isArray(snapshot.linksIn) ? snapshot.linksIn : null;
  if (!before) {
    for (const key of ["vault", "handVault"]) {
      if (snapshot[key] !== 0) breaks.push({ field: `open.${key}`, expected: 0, found: snapshot[key] ?? null });
    }
    if (!relics || relics.length) breaks.push({ field: "open.relics", expected: [], found: snapshot.relics ?? null });
    if (!links || links.length) breaks.push({ field: "open.linksIn", expected: [], found: snapshot.linksIn ?? null });
    // Left half way and opened again: the windows of the first try moved these.
    if (snapshot.windowIndex !== 0) {
      unchecked.push("reopened");
      return;
    }
    for (const key of ["busts", "cashes"]) {
      if (snapshot[key] !== 0) breaks.push({ field: `open.${key}`, expected: 0, found: snapshot[key] ?? null });
    }
    if (!STANCES.every((mode) => snapshot.stanceMastery?.[mode] === 0)) breaks.push({ field: "open.stanceMastery", expected: "none", found: snapshot.stanceMastery ?? null });
    if (snapshot.logic?.streak !== 0 || snapshot.logic?.best !== 0) breaks.push({ field: "open.logic", expected: "none", found: snapshot.logic ?? null });
    return;
  }
  const close = before.dynamics;
  for (const key of ["vault", "handVault"]) {
    if (numberOf(close[key]) !== null && snapshot[key] !== close[key]) breaks.push({ field: `open.${key}`, expected: close[key], found: snapshot[key] ?? null });
  }
  const between = numberOf(close.windowIndex) === null || numberOf(snapshot.windowIndex) === null ? null : snapshot.windowIndex - close.windowIndex;
  if (between !== null && between < 0) breaks.push({ field: "open.windowIndex", expected: `${close.windowIndex} or more`, found: snapshot.windowIndex });
  const held = new Set([...(Array.isArray(close.relics) ? close.relics : []), ...(Array.isArray(close.relicOffer) ? close.relicOffer : [])]);
  if (!relics) breaks.push({ field: "open.relics", expected: "a list", found: snapshot.relics ?? null });
  else if (relics.some((id) => !held.has(id))) {
    // A close from a build before `relicOffer` cannot say what was offered.
    if (Array.isArray(close.relicOffer)) breaks.push({ field: "open.relics", expected: [...held], found: relics });
    else unchecked.push("relics");
  }
  const veteran = close.open?.veteran;
  if (typeof veteran === "boolean" && snapshot.veteran !== veteran) breaks.push({ field: "open.veteran", expected: veteran, found: snapshot.veteran ?? null });
  // Only practice between the two (a replay hands its table back), or nothing.
  const practiceBetween = numberOf(close.practiceWindows) === null || numberOf(snapshot.practiceWindows) === null ? null : snapshot.practiceWindows - close.practiceWindows;
  if (between === null || (between !== 0 && practiceBetween !== between)) {
    unchecked.push("reopened");
    return;
  }
  if (!STANCES.every((mode) => snapshot.stanceMastery?.[mode] === close.stanceMastery?.[mode])) breaks.push({ field: "open.stanceMastery", expected: close.stanceMastery ?? null, found: snapshot.stanceMastery ?? null });
  if (numberOf(close.logicStreak) !== null && (snapshot.logic?.streak !== close.logicStreak || snapshot.logic?.best !== close.bestLogic)) {
    breaks.push({ field: "open.logic", expected: { streak: close.logicStreak, best: close.bestLogic }, found: snapshot.logic ?? null });
  }
  if (!Array.isArray(close.linksOut)) unchecked.push("links");
  else {
    const expected = snapshot.story === true ? [] : close.linksOut;
    if (!links || !sameList(links, expected)) breaks.push({ field: "open.linksIn", expected, found: snapshot.linksIn ?? null });
  }
}

/**
 * The link from the case `before` closed on to the case `after`, both rows as
 * stored. `before` null is the run's start: every counter from zero.
 */
export function recheckCaseGap(before, after) {
  const close = before ? before.dynamics : {};
  const open = after?.dynamics;
  const log = Array.isArray(after?.decision_log) ? after.decision_log : null;
  if ((before && !isObject(close)) || !isObject(open) || !log) return { status: "unchecked", breaks: [], unchecked: ["dynamics"] };
  const read = (state, key) => (before || state === open ? numberOf(state[key]) : 0);
  const values = Object.fromEntries(COUNTERS.map((key) => [key, { from: read(close, key), to: numberOf(open[key]) }]));
  const unchecked = [...UNCHECKED.between];
  const breaks = [];
  const missing = COUNTERS.filter((key) => values[key].from === null || values[key].to === null);
  if (missing.length) unchecked.push(...missing);
  const delta = (key) => (missing.includes(key) ? null : values[key].to - values[key].from);
  const windows = delta("windowIndex");
  const busts = delta("busts");
  const cashes = delta("cashes");
  const own = loggedBusts(log);
  if (windows !== null && windows < log.length) breaks.push({ field: "windowIndex", expected: `+${log.length} or more`, found: windows });
  if (busts !== null && busts < own) breaks.push({ field: "busts", expected: `+${own} or more`, found: busts });
  if (busts !== null && windows !== null && busts > own + Math.max(0, windows - log.length)) breaks.push({ field: "busts", expected: `+${own + Math.max(0, windows - log.length)} or less`, found: busts });
  if (cashes !== null && windows !== null && (cashes < 0 || cashes > Math.max(0, windows - own))) breaks.push({ field: "cashes", expected: `0 to +${Math.max(0, windows - own)}`, found: cashes });
  for (const key of ["vault", "handVault"]) {
    if (delta(key) !== null && delta(key) < 0) breaks.push({ field: key, expected: "+0 or more", found: delta(key) });
  }
  if (before) {
    for (const key of [RULES_MARK_KEY, "weekRule"]) {
      if ((close[key] ?? null) !== (open[key] ?? null)) breaks.push({ field: key, expected: close[key] ?? null, found: open[key] ?? null });
    }
  }
  if (isObject(open.open)) recheckOpening(before, after, open.open, breaks, unchecked);
  else unchecked.push(...UNCHECKED.open);
  return { status: breaks.length ? "broken" : "linked", breaks, unchecked };
}

/**
 * One run's case rows, in any order, chained. The rows are ordered by
 * CASE_SEQUENCE; the season row (`season-final`) and any other row not a case
 * are left out. A case delivered twice is a break (the server keeps one row per
 * close). Returns the mark, the breaks with where they are, and how many
 * links and fields were not checked.
 */
export function recheckChain(rows = []) {
  const byCase = new Map();
  const breaks = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    const caseId = row?.case_id;
    if (!CASE_SEQUENCE.includes(caseId)) continue;
    if (byCase.has(caseId)) breaks.push({ case: caseId, field: "case", found: "twice" });
    else byCase.set(caseId, row);
  }
  const cases = [];
  const unchecked = { cases: 0, links: 0, fields: {} };
  const count = (fields) => {
    for (const field of fields) unchecked.fields[field] = (unchecked.fields[field] ?? 0) + 1;
  };
  let before = null;
  let gap = false;
  for (const caseId of CASE_SEQUENCE) {
    const row = byCase.get(caseId);
    if (!row) {
      if (before || cases.length) gap = true;
      continue;
    }
    const inside = recheckCaseLinks(row);
    // The run's start is read only when prologue01 is the first row; after a
    // gap the link is not checked.
    const link = gap || (!before && caseId !== CASE_SEQUENCE[0]) ? { status: "unchecked", breaks: [], unchecked: ["gap"] } : recheckCaseGap(before, row);
    if (inside.status === "unchecked") unchecked.cases += 1;
    if (link.status === "unchecked") unchecked.links += 1;
    count(inside.unchecked);
    count(link.unchecked);
    for (const found of inside.breaks) breaks.push({ case: caseId, where: "inside", ...found });
    for (const found of link.breaks) breaks.push({ case: caseId, where: "between", after: before?.case_id ?? null, ...found });
    cases.push({ caseId, inside: inside.status, link: link.status });
    before = row;
    gap = false;
  }
  // TODO(S2): once settleChoice is out, the inside check plays each case again
  // here (with the rules getRowRules reads off the row, as rankingRecheck.js
  // does) and adds its breaks; until then UNCHECKED.inside is counted.
  return { status: cases.length ? (breaks.length ? "broken" : "linked") : "unchecked", marks: breaks.length ? [CHAIN_MARK] : [], breaks, cases, unchecked };
}
