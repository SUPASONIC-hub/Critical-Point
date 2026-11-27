import { readStoredValue, STORAGE_KEY, writeStoredValue } from "./appConfig.js";
import { CASE_SEQUENCE } from "./gameCases.js";
import { hadSavedDataOnLoad } from "./firstVisitProbe.js";
import { createTelemetryEventId } from "./state/telemetryEventId.js";
import { saveFirstHourRecord, telemetryEnabled } from "./telemetry.js";

/**
 * 첫 30분 자동 기록 (2026-11-27, 사용자 「전부 1」; cp-archive 메모-20261127).
 *
 * The three-person observation of a first half hour (관찰지 1126 §2·§3·§5),
 * written by the game itself. Only a device that had none of the game's data
 * when the page first loaded (firstVisitProbe.js) keeps a record, and only
 * what happens in the first 30 minutes of wall-clock time from that load goes
 * into it; the first thing done after that marks `past30` and closes it. One
 * small flat record per device, kept in storage and sent whole at a few
 * natural points -- a case closed, the first BUST, an answer, the page hidden
 * or closed -- to `first_hour_record` (*_first_hour_runs.sql), which keeps
 * the latest. Nothing leaves a device that did not leave 「기록 보내기」 on, or
 * a build with no backend, and with no backend nothing is kept either. No
 * address, no session id, no name, no free text: the record's id is its own,
 * minted here, and joins it to nothing else.
 *
 * The fields as sent (FIRST_HOUR_FIELDS; the server allows these and no other):
 *   v, first        format 1; always true (only a first visit sends)
 *   dev, lang       "phone" under 768px wide at the first load, else "pc"; the page's language
 *   btn, btnS       the first of 프롤로그 시작 / 이야기로 시작 / 브리핑 먼저 보기 / a language, and its second
 *   startS          seconds to the start press (프롤로그 or 이야기)
 *   cold, coldPages the cold opening "skip" or "done", and the pages turned
 *   t1, t1Push, t1Hint, t1Timeout   the first table's scene, its pushes, the held-confirm hint shown, timed-out hands
 *   bustS, bustNode the first BUST's second and scene
 *   file, scout, narrow             사건 파일 opened; scout used; scout narrowed (B1)
 *   lastAt, lastS   the screen when the page was last hidden or closed, and its second
 *   past30          play went on past 30 minutes
 *   far, farCase    the furthest scene by 30 minutes, and its case's place in the season
 *   lost, again     the two questions: "stake" | "next" | "unknown" | "skip" | "shown"; 0..10 | "skip" | "shown"
 */
export const FIRST_HOUR_KEY = "critical-point-first-hour-v1";
export const FIRST_HOUR_WINDOW_MS = 30 * 60 * 1000;
export const PHONE_MAX_WIDTH = 767;
export const LOST_ANSWERS = Object.freeze(["stake", "next", "unknown"]);
export const AGAIN_SCALE = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
export const FIRST_HOUR_FIELDS = Object.freeze([
  "v", "first", "dev", "lang", "btn", "btnS", "startS", "cold", "coldPages",
  "t1", "t1Push", "t1Hint", "t1Timeout", "bustS", "bustNode", "file", "scout", "narrow",
  "lastAt", "lastS", "past30", "far", "farCase", "lost", "again",
]);

// The start screen's and the cold opening's controls, read off the click.
const CLICKS = [
  ['[data-testid="start-first-case"]', "prologue"],
  ['[data-testid="start-story-mode"]', "story"],
  [".intro-briefing-link", "briefing"],
  ['[data-testid="language-picker"] button', "language"],
  ['[data-testid="cold-opening-next"]', "cold-next"],
  ['[data-testid="cold-opening-skip"]', "cold-skip"],
  ['[data-testid="cold-opening-start"]', "cold-done"],
  [".gx-brief > summary", "file"],
];

const defaults = () => ({
  telemetryOn: telemetryEnabled,
  hadSavedData: hadSavedDataOnLoad,
  read: () => readStoredValue(FIRST_HOUR_KEY, ""),
  write: (text) => writeStoredValue(FIRST_HOUR_KEY, text),
  consent: () => {
    try {
      return JSON.parse(readStoredValue(STORAGE_KEY, "null"))?.dataConsent === true;
    } catch {
      return false;
    }
  },
  send: saveFirstHourRecord,
  now: () => Date.now(),
  scope: globalThis,
});

let deps = defaults();
let record = null;
let lastSent = "";
let listening = null;

const seconds = () => Math.max(0, Math.round((deps.now() - record.t0) / 1000));
const save = () => deps.write(JSON.stringify(record));

/** Whether a note may still be taken: a record, not closed, inside the half hour. The first note after it closes the record. */
function open() {
  if (!record || record.done) return false;
  if (deps.now() - record.t0 < FIRST_HOUR_WINDOW_MS) return true;
  record.past30 = true;
  record.done = true;
  save();
  flush();
  return false;
}

/** The record as sent: the listed fields that have a value. */
export function firstHourPayload(source = record) {
  const payload = {};
  for (const field of FIRST_HOUR_FIELDS) {
    if (source?.[field] !== undefined && source[field] !== null) payload[field] = source[field];
  }
  return payload;
}

/** Sends the record when the device agreed and it changed since the last send; a failed send is retried by the next. */
export function flush({ keepalive = false } = {}) {
  if (!record || !deps.consent()) return false;
  const payload = firstHourPayload();
  const text = JSON.stringify(payload);
  if (text === lastSent) return false;
  lastSent = text;
  Promise.resolve()
    .then(() => deps.send(record.id, payload, { keepalive }))
    .catch(() => {
      if (lastSent === text) lastSent = "";
    });
  return true;
}

function onClick(event) {
  const target = event.target;
  if (!target || typeof target.closest !== "function") return;
  const hit = CLICKS.find(([selector]) => target.closest(selector));
  if (hit) noteControl(hit[1]);
}

function onHidden(event) {
  if (event.type === "visibilitychange" && deps.scope.document?.visibilityState !== "hidden") return;
  if (!record) return;
  if (open()) {
    record.lastS = seconds();
    save();
  }
  flush({ keepalive: true });
}

/**
 * Called once as the page starts (main.jsx). Takes up this device's record,
 * or starts one on a first visit; with no backend, or on a device that had the
 * game's data, does nothing at all.
 */
export function startFirstHour(overrides = {}) {
  deps = { ...defaults(), ...overrides };
  record = null;
  lastSent = "";
  if (!deps.telemetryOn) return null;
  try {
    const stored = JSON.parse(deps.read() || "null");
    if (stored && typeof stored.id === "string" && Number.isFinite(stored.t0)) record = stored;
  } catch {
    record = null;
  }
  if (!record && !deps.hadSavedData) {
    const width = Number(deps.scope.innerWidth) || 0;
    const candidate = {
      id: createTelemetryEventId(),
      t0: deps.now(),
      v: 1,
      first: true,
      dev: width > 0 && width <= PHONE_MAX_WIDTH ? "phone" : "pc",
      lang: String(deps.scope.document?.documentElement?.lang || "ko").slice(0, 8),
      lastAt: "intro",
    };
    record = deps.write(JSON.stringify(candidate)) ? candidate : null;
  }
  if (record && listening !== deps.scope && typeof deps.scope.addEventListener === "function") {
    listening = deps.scope;
    deps.scope.document?.addEventListener?.("click", onClick, true);
    deps.scope.document?.addEventListener?.("visibilitychange", onHidden);
    deps.scope.addEventListener("pagehide", onHidden);
  }
  return record;
}

/** A press the start screen or the cold opening counts (CLICKS). */
export function noteControl(kind) {
  if (!open()) return;
  if (kind === "file") {
    record.file = true;
  } else if (kind === "cold-next") {
    record.coldPages = (record.coldPages ?? 0) + 1;
    record.lastAt = "cold";
  } else if (kind === "cold-skip" || kind === "cold-done") {
    record.cold ??= kind === "cold-skip" ? "skip" : "done";
  } else {
    if (!record.btn) {
      record.btn = kind;
      record.btnS = seconds();
    }
    if ((kind === "prologue" || kind === "story") && record.startS == null) record.startS = seconds();
  }
  save();
}

/** A scene came on screen (GauntletStage, by way of gameEvents.js): where the player is, and how far by now. */
export function noteScene(caseId, nodeId) {
  if (!open() || typeof nodeId !== "string") return;
  record.lastAt = nodeId.slice(0, 64);
  if (record.t1 && record.t1 !== nodeId) record.t1Done = true;
  const place = CASE_SEQUENCE.indexOf(caseId) + 1;
  if (place > 0 && place >= (record.farCase ?? 0)) {
    record.farCase = place;
    record.far = record.lastAt;
  }
  save();
}

/** A table opened: the first one is the first table, counted until another scene comes. */
export function noteTable(nodeId) {
  if (!open() || record.t1) return;
  record.t1 = String(nodeId).slice(0, 64);
  record.t1Push = 0;
  record.t1Hint = 0;
  record.t1Timeout = 0;
  save();
}

/** The held-confirm hint (길게 눌러야 확정) shown once more, counted on the first table (useHoldConfirm.js). */
export function noteHoldHint() {
  if (!open() || !record.t1 || record.t1Done) return;
  record.t1Hint += 1;
  save();
}

/**
 * A hand closed (useChoiceCommit's choose, with the window as it closed): on
 * the first table its pushes and a timeout; anywhere, scouting used and
 * narrowed (B1); and the season's first BUST -- not a hand left behind --
 * which is sent.
 */
export function noteHandClosed(nodeId, { status, cause, pushes = 0, scouted, narrowed } = {}) {
  if (!open()) return;
  if (record.t1 === nodeId && !record.t1Done) {
    record.t1Push += Number.isInteger(pushes) && pushes > 0 ? pushes : 0;
    if (cause === "timeout") record.t1Timeout += 1;
  }
  if (scouted === true) record.scout = true;
  if (narrowed === true) record.narrow = true;
  const firstBust = status === "bust" && cause !== "abandon" && record.bustS == null;
  if (firstBust) {
    record.bustS = seconds();
    record.bustNode = String(nodeId).slice(0, 64);
  }
  save();
  if (firstBust) flush();
}

/** A case closed: its report is where the player now is, and a natural point to send. */
export function noteCaseDone(caseId) {
  if (open()) {
    record.lastAt = `result:${caseId}`.slice(0, 64);
    save();
  }
  if (record) flush();
}

/**
 * Whether one of the two questions is asked now. Only where the answer can be
 * sent, only on a first-visit device, once: `lost` after the first BUST (on the
 * verdict sheet), `again` on 프롤로그 01's report. A question on screen is
 * marked "shown" at once (markAsked), so it never comes back.
 */
export function canAsk(kind) {
  if (!record || !deps.telemetryOn || !deps.consent() || record[kind] != null) return false;
  return kind === "again" || (kind === "lost" && record.bustS != null);
}

export function markAsked(kind) {
  if (!record || record[kind] != null) return;
  record[kind] = "shown";
  save();
}

/** An answer, or "skip"; anything else is left behind. Sent at once. */
export function answer(kind, value) {
  if (!record) return false;
  const valid = value === "skip" || (kind === "lost" ? LOST_ANSWERS.includes(value) : kind === "again" && AGAIN_SCALE.includes(value));
  if (!valid) return false;
  record[kind] = value;
  save();
  flush();
  return true;
}

/** Test seam: the record as kept. */
export function readFirstHourForTest() {
  return record;
}
