import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * The small helpers the pre-start shell and the table share: storage keys and
 * the tab token (appConfig.js), the missing-chunk reload, the frame variables,
 * and the clock a timed press is graded on. They moved or arrived in the
 * 2026-09-28 fix pass without a test of their own.
 *
 * Each file runs in its own process, so the module-level memos these keep (the
 * tab-token claim, the registered variables) start empty here.
 */
const session = createStorage();
const local = createStorage();
globalThis.sessionStorage = session;
globalThis.localStorage = local;

const appConfig = await import("../../src/appConfig.js");
const { clamp, formatNumber } = await import("../../src/gameConstants.js");
const { applyEffect, getSuspenseEvent } = await import("../../src/riskLogic.js");
const { SEASON_ENTRY_CASE } = await import("../../src/gameCases.js");
const chunkReload = await import("../../src/state/chunkReload.js");
const { FX_READERS, FX_VARIABLES, registerFxVariables } = await import("../../src/gauntlet/fxVariables.js");
const { gradePress, monotonicNow, pressedAt } = await import("../../src/gauntlet/timing.js");

// Node's performance.now() counts from process start, a few hundred ms in, so a
// press "400ms ago" would be a negative stamp. The table's clock is fixed here.
const TABLE_NOW = 100_000;
function withTableClock(run) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "performance");
  Object.defineProperty(globalThis, "performance", { value: { now: () => TABLE_NOW }, configurable: true, writable: true });
  try {
    run();
  } finally {
    Object.defineProperty(globalThis, "performance", descriptor);
  }
}

test("formatNumber rounds and groups by thousands, and reads junk as zero", () => {
  assert.equal(formatNumber(1234567.6), "1,234,568");
  assert.equal(formatNumber("-2500"), "-2,500");
  assert.equal(formatNumber(undefined), "0");
  assert.equal(formatNumber("abc"), "0");
  assert.equal(clamp(140), 100);
  assert.equal(clamp(-3, 0, 10), 0);
});

test("an effect moves only the six resources, within their bounds", () => {
  const start = { time: 70, capital: 50, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 };
  const next = applyEffect(start, { time: 10, trust: -80, capitol: 5, fatigue: "3", legitimacy: Number.NaN });
  assert.deepEqual(next, { ...start, time: 72, trust: 0 });
  assert.deepEqual(applyEffect(start, null), start);
});

test("pattern lock fires after the season's first case, never inside it", () => {
  const later = getSuspenseEvent({ riskBefore: 45, riskAfter: 46, logLength: 3, currentCase: "case02" });
  assert.equal(later?.id, "pattern-lock");
  assert.equal(getSuspenseEvent({ riskBefore: 45, riskAfter: 46, logLength: 3, currentCase: SEASON_ENTRY_CASE }), null);
  assert.equal(getSuspenseEvent({ riskBefore: 45, riskAfter: 46, logLength: 2, currentCase: "case02" }), null);
});

test("getInvalidSavedStateKeys names every field of the wrong shape", () => {
  assert.deepEqual(appConfig.getInvalidSavedStateKeys(null), ["<not-an-object>"]);
  assert.deepEqual(appConfig.getInvalidSavedStateKeys([]), ["<not-an-object>"]);
  const invalid = appConfig.getInvalidSavedStateKeys({ log: {}, resources: [], currentCase: 1, runId: 7 });
  for (const key of ["completedCases", "log", "resources", "caseResults", "currentCase", "nodeId", "runId"]) {
    assert.ok(invalid.includes(key), `${key} was not reported`);
  }
  const valid = {
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
    currentCase: "case01",
    nodeId: "c1_start",
  };
  assert.deepEqual(appConfig.getInvalidSavedStateKeys(valid), []);
});

test("the replay flag is what was last set", () => {
  appConfig.setReplaySession(1);
  assert.equal(appConfig.isReplaySession(), true);
  appConfig.setReplaySession(0);
  assert.equal(appConfig.isReplaySession(), false);
});

test("a tab keeps its token in session storage and falls back to memory without it", () => {
  session.removeItem(appConfig.TAB_TOKEN_SESSION_KEY);
  const first = appConfig.getTabToken();
  assert.ok(first);
  assert.equal(appConfig.getTabToken(), first);
  assert.equal(session.getItem(appConfig.TAB_TOKEN_SESSION_KEY), first);

  session.unavailable = true;
  const fallback = appConfig.getTabToken();
  assert.ok(fallback);
  assert.equal(appConfig.getTabToken(), fallback);
  session.unavailable = false;
});

test("a copied tab that finds its token held by a live tab takes a new one", async () => {
  // Two tabs on one bus: the original answers a claim for the token it holds.
  const listeners = new Set();
  class FakeChannel {
    constructor() {
      this.onmessage = null;
      listeners.add(this);
    }
    postMessage(data) {
      for (const other of listeners) if (other !== this) queueMicrotask(() => other.onmessage?.({ data }));
    }
  }
  const inherited = "token-from-the-original";
  session.setItem(appConfig.TAB_TOKEN_SESSION_KEY, inherited);
  const original = new FakeChannel();
  original.onmessage = ({ data }) => {
    if (data.type === "claim" && data.token === inherited) original.postMessage({ type: "held", token: inherited });
  };
  globalThis.BroadcastChannel = FakeChannel;
  try {
    const claim = appConfig.claimTabToken();
    assert.equal(appConfig.claimTabToken(), claim, "the claim is made once a page");
    assert.equal(await claim, true);
    const replaced = session.getItem(appConfig.TAB_TOKEN_SESSION_KEY);
    assert.ok(replaced && replaced !== inherited);
  } finally {
    delete globalThis.BroadcastChannel;
  }
});

test("settled window seeds keep strings only and survive a bad record", () => {
  local.setItem(appConfig.SETTLED_WINDOWS_STORAGE_KEY, "{not json");
  assert.deepEqual(appConfig.readSettledWindowSeeds(), []);
  local.setItem(appConfig.SETTLED_WINDOWS_STORAGE_KEY, JSON.stringify(["a", 3, "b"]));
  assert.deepEqual(appConfig.readSettledWindowSeeds(), ["a", "b"]);
  assert.equal(appConfig.recordSettledWindowSeed(""), false);
  assert.equal(appConfig.recordSettledWindowSeed("a"), true);
  assert.deepEqual(appConfig.readSettledWindowSeeds(), ["b", "a"]);
});

test("removeStoredValue reports storage it could not reach", () => {
  local.setItem(appConfig.STORAGE_KEY, "v");
  assert.equal(appConfig.removeStoredValue(appConfig.STORAGE_KEY), true);
  assert.equal(local.getItem(appConfig.STORAGE_KEY), null);
  local.unavailable = true;
  assert.equal(appConfig.removeStoredValue(appConfig.STORAGE_KEY), false);
  local.unavailable = false;
});

test("small shared helpers: text limit, empty scores, run id, save time", () => {
  assert.equal(appConfig.limitText("abcdef", 3), "abc");
  assert.equal(appConfig.limitText("abc", 0), "");
  assert.equal(appConfig.limitText("abc", Number.NaN), "");
  // An emoji is two UTF-16 units. A cut between them left half a character,
  // which the database refuses for as long as the row is retried.
  assert.equal(appConfig.limitText("ab😀cd", 3), "ab");
  assert.equal(appConfig.limitText("ab😀cd", 4), "ab😀");
  assert.equal(appConfig.limitText("ab😀", 4), "ab😀", "nothing was cut, so nothing is dropped");
  assert.equal(appConfig.limitText("가나다라", 3), "가나다", "Korean text is one unit a syllable and is cut where it always was");
  assert.equal(appConfig.normalizePlayerName(`${"가".repeat(23)}😀`), "가".repeat(23));
  assert.equal(appConfig.normalizeSavedText("a😀", 2), "a");
  for (const cut of [appConfig.limitText("😀😀😀", 5), appConfig.normalizePlayerName(`${"x".repeat(23)}😀`)]) {
    assert.equal(cut.isWellFormed?.() ?? !/[\ud800-\udbff]$/.test(cut), true);
  }
  assert.deepEqual(appConfig.makeEmptyScores({ a: "A", b: "B" }), { a: 0, b: 0 });
  const id = appConfig.createRunId();
  assert.equal(typeof id, "string");
  assert.notEqual(appConfig.createRunId(), id);
  assert.equal(appConfig.formatSaveTime(""), "");
  assert.match(appConfig.formatSaveTime("2026-09-28T09:05:00Z"), /\d{2}/);
  assert.equal(appConfig.formatSaveTime("not a date"), "");
});

test("copyText uses the clipboard, then the legacy copy, and says when neither worked", async () => {
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const setNavigator = (value) => Object.defineProperty(globalThis, "navigator", { value, configurable: true, writable: true });
  try {
    const written = [];
    setNavigator({ clipboard: { writeText: async (text) => written.push(text) } });
    assert.equal(await appConfig.copyText("one"), true);
    assert.deepEqual(written, ["one"]);

    // A rejected Clipboard API call falls through to execCommand.
    setNavigator({ clipboard: { writeText: async () => Promise.reject(new Error("denied")) } });
    assert.equal(await appConfig.copyText("two"), false, "no document to fall back to");
    let removed = false;
    const textarea = { style: {}, setAttribute() {}, select() {}, remove: () => (removed = true) };
    globalThis.document = { body: { appendChild() {} }, createElement: () => textarea, execCommand: () => true };
    assert.equal(await appConfig.copyText("three"), true);
    assert.equal(textarea.value, "three");
    assert.ok(removed);

    globalThis.document = { body: { appendChild() {} }, createElement: () => { throw new Error("no DOM"); } };
    assert.equal(await appConfig.copyText("four"), false);
  } finally {
    delete globalThis.document;
    if (navigatorDescriptor) Object.defineProperty(globalThis, "navigator", navigatorDescriptor);
    else delete globalThis.navigator;
  }
});

test("a missing chunk is told apart from other errors", () => {
  assert.equal(chunkReload.isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/x.js")), true);
  const named = new Error("gone");
  named.name = "ChunkLoadError";
  assert.equal(chunkReload.isChunkLoadError(named), true);
  assert.equal(chunkReload.isChunkLoadError(new Error("Cannot read properties of undefined")), false);
  assert.equal(chunkReload.isChunkLoadError("dynamically imported module"), false);
});

test("an import that resolved to nothing is a missing chunk, not a fault in the run", () => {
  const module = { Screen: () => null };
  assert.equal(chunkReload.loadedChunk(module), module);
  assert.throws(() => chunkReload.loadedChunk(undefined), (error) => chunkReload.isChunkLoadError(error));
});

test("the tab reloads once for a missing chunk, then leaves it to the panel", () => {
  session.removeItem(appConfig.CHUNK_RELOAD_SESSION_KEY);
  let reloads = 0;
  const reload = () => reloads++;
  assert.equal(chunkReload.reloadForMissingChunk({ now: 1_000_000, reload }), true);
  assert.equal(chunkReload.reloadForMissingChunk({ now: 1_030_000, reload }), false, "inside the guard");
  assert.equal(chunkReload.reloadForMissingChunk({ now: 1_070_000, reload }), true, "after the guard");
  assert.equal(reloads, 2);

  // No storage for the marker: nothing would stop a loop, so it does not reload.
  session.unavailable = true;
  assert.equal(chunkReload.reloadForMissingChunk({ now: 9_000_000, reload }), false);
  session.unavailable = false;
  assert.equal(reloads, 2);
});

test("the preload error handler reloads and swallows the error", () => {
  session.removeItem(appConfig.CHUNK_RELOAD_SESSION_KEY);
  const handlers = {};
  const locationDescriptor = Object.getOwnPropertyDescriptor(globalThis, "location");
  let reloaded = 0;
  globalThis.addEventListener = (type, handler) => (handlers[type] = handler);
  Object.defineProperty(globalThis, "location", { value: { reload: () => reloaded++ }, configurable: true, writable: true });
  try {
    chunkReload.installChunkReload();
    let prevented = false;
    handlers["vite:preloadError"]({ preventDefault: () => (prevented = true) });
    assert.equal(reloaded, 1);
    assert.ok(prevented);
  } finally {
    delete globalThis.addEventListener;
    if (locationDescriptor) Object.defineProperty(globalThis, "location", locationDescriptor);
    else delete globalThis.location;
  }
});

test("the frame variables are registered once, not inherited, with a closed ring at rest", () => {
  assert.deepEqual(FX_VARIABLES, Object.keys(FX_READERS));
  registerFxVariables(); // No CSS API: nothing to do, and nothing remembered.
  const registered = [];
  globalThis.CSS = {
    registerProperty(definition) {
      if (definition.name === "--gx-flash") throw new Error("already registered");
      registered.push(definition);
    },
  };
  try {
    registerFxVariables();
    registerFxVariables();
    assert.equal(registered.length, FX_VARIABLES.length - 1);
    assert.ok(registered.every((definition) => definition.inherits === false));
    const byName = Object.fromEntries(registered.map((definition) => [definition.name, definition]));
    assert.equal(byName["--gx-shake-x"].syntax, "<length>");
    assert.equal(byName["--gx-shake-x"].initialValue, "0px");
    assert.equal(byName["--gx-beat-phase"].initialValue, "1");
    assert.equal(byName["--gx-heat"].initialValue, "0");
  } finally {
    delete globalThis.CSS;
  }
});

test("a press is graded when the pointer went down, not when the click landed", () => withTableClock(() => {
  const now = monotonicNow();
  assert.ok(Number.isFinite(now));
  const stamp = now - 400;
  // A click from a pointer: the press is the pointer going down.
  assert.equal(pressedAt({ type: "click", detail: 1, timeStamp: stamp }, stamp - 120), stamp - 120);
  // Enter or Space on the button: detail 0, and with no key noted going down
  // it is its own press. (With one noted it is graded there: table-controls.)
  assert.equal(pressedAt({ type: "click", detail: 0, timeStamp: stamp }, 0), stamp);
  // A pointer that went down too long ago is not this press.
  assert.equal(pressedAt({ type: "click", detail: 1, timeStamp: stamp }, stamp - 5000), stamp);
  // No usable stamp, or one from the future: now.
  assert.equal(pressedAt({ type: "keydown" }), now);
  assert.equal(pressedAt({ timeStamp: now + 60_000 }), now);
}));

test("gradePress spends the pointer and says when the wide window made the grade", () => withTableClock(() => {
  const period = 500;
  const at = monotonicNow() - 10_000;
  const onBeat = { type: "keydown", timeStamp: at + period * 4 };
  const pointer = { current: 123 };
  const exact = gradePress(onBeat, pointer, { at, period });
  assert.equal(exact.grade, "perfect");
  assert.equal(exact.widened, false);
  assert.equal(pointer.current, 0);

  // Find an offset the narrow window misses and the wide one does not.
  let widenedSeen = false;
  for (let offset = 10; offset < period / 2; offset += 5) {
    const result = gradePress({ type: "keydown", timeStamp: at + period * 4 + offset }, { current: 0 }, { at, period }, true);
    if (result.widened) {
      widenedSeen = true;
      break;
    }
  }
  assert.ok(widenedSeen, "the wider window never changed a grade");
}));

const { confirmAction } = await import("../../src/state/confirmAction.js");
const { focusSceneTitle } = await import("../../src/state/sceneFocus.js");

test("a destructive action asks first, and goes ahead where there is no dialog", () => {
  assert.equal(confirmAction("reset?"), true, "no confirm() in the host");
  const asked = [];
  globalThis.confirm = (message) => (asked.push(message), false);
  try {
    assert.equal(confirmAction("reset?"), false);
    assert.deepEqual(asked, ["reset?"]);
  } finally {
    delete globalThis.confirm;
  }
});

test("the scene title waits for the modal page in front of it", () => {
  const focused = [];
  const titleRef = { current: { focus: (options) => focused.push(options) } };
  const observers = [];
  let modal = null;
  globalThis.document = {
    activeElement: null,
    body: {},
    querySelector: () => modal,
  };
  globalThis.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe(target, options) {
      this.target = target;
      this.options = options;
    }
    disconnect() {
      this.disconnected = true;
    }
  };
  try {
    focusSceneTitle(titleRef);
    assert.deepEqual(focused, [{ preventScroll: true }], "nothing in front: focus now");

    modal = { isConnected: true, parentNode: {} };
    focusSceneTitle(titleRef);
    assert.equal(focused.length, 1, "a modal page is in front: wait");
    const [observer] = observers;
    // The page, not the modal's parent: the reveal leaves with its backdrop,
    // and a watcher on the dialog's own parent never saw it go.
    assert.equal(observer.target, globalThis.document.body);
    assert.deepEqual(observer.options, { childList: true, subtree: true });

    observer.callback();
    assert.equal(focused.length, 1, "still connected");

    // The page closes and leaves focus nowhere: the title takes it.
    const closed = modal;
    modal = null;
    closed.isConnected = false;
    observer.callback();
    assert.ok(observer.disconnected);
    assert.equal(focused.length, 2);

    // The page closes but focus went somewhere on purpose: leave it.
    const second = { isConnected: true, parentNode: {} };
    modal = second;
    focusSceneTitle(titleRef);
    modal = null;
    second.isConnected = false;
    globalThis.document.activeElement = { id: "elsewhere" };
    observers.at(-1).callback();
    assert.equal(focused.length, 2);

    // A modal that leaves inside something else is seen leaving all the same.
    const wrapped = { isConnected: true, parentNode: null };
    modal = wrapped;
    globalThis.document.activeElement = globalThis.document.body;
    focusSceneTitle(titleRef);
    assert.equal(observers.length, 3);
    modal = null;
    wrapped.isConnected = false;
    observers.at(-1).callback();
    assert.equal(focused.length, 3);
  } finally {
    delete globalThis.document;
    delete globalThis.MutationObserver;
  }
});

test("a page with no scene title is entered at its heading, and 시즌 로드맵 at the roadmap", () => {
  class FakeElement {
    constructor(rect = {}) {
      this.attributes = {};
      this.focused = 0;
      this.scrolledIntoView = null;
      this.rect = rect;
    }
    hasAttribute(name) {
      return name in this.attributes;
    }
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
    focus() {
      this.focused += 1;
    }
    scrollIntoView(options) {
      this.scrolledIntoView = options;
    }
    getBoundingClientRect() {
      return this.rect;
    }
  }
  const heading = new FakeElement();
  const roadmap = new FakeElement();
  const rail = new FakeElement({ left: 16 });
  Object.assign(rail, { scrollWidth: 4000, clientWidth: 358, scrollLeft: 0 });
  const card = new FakeElement({ left: 2016 });
  card.parentElement = rail;
  globalThis.HTMLElement = FakeElement;
  globalThis.document = {
    activeElement: null,
    body: {},
    querySelector: (selector) => (selector === "main h1" ? heading : selector === ".case-roadmap .active-case" ? card : null),
    getElementById: (id) => (id === "season-roadmap" ? roadmap : null),
  };
  try {
    // 저장 후 나가기: the intro has no scene title, so its own heading takes focus.
    focusSceneTitle({ current: null });
    assert.equal(heading.focused, 1);
    assert.equal(heading.attributes.tabindex, "-1", "a heading has to be made focusable first");

    focusSceneTitle({ current: null }, { roadmap: true, behavior: "smooth" });
    assert.equal(roadmap.focused, 1);
    assert.deepEqual(roadmap.scrolledIntoView, { block: "start", behavior: "smooth" });
    assert.equal(rail.scrollLeft, 2000, "the rail is scrolled to the case the season has reached");
    assert.equal(heading.focused, 1, "the roadmap is where this lands, not the top");
  } finally {
    delete globalThis.document;
    delete globalThis.HTMLElement;
  }
});

const endingCopy = await import("../../src/endingCopy.js");

test("the ending's verdict: a collapse first, then the final choice, then the open verdict", () => {
  const failure = endingCopy.getFinalVerdict({ endingVariant: { failure: true }, finalChoiceId: "ending_seal" });
  assert.equal(failure.title, "트리거랩의 운영은 붕괴합니다.");
  // The ending and its scene's action are always given (report-copy.test.mjs
  // holds that), so the open verdict is written from them and nothing else.
  const variant = { title: "T", text: "X" };
  for (const id of ["ending_seal", "ending_reform", "ending_expose"]) {
    const verdict = endingCopy.getFinalVerdict({ endingVariant: variant, finalChoiceId: id });
    for (const field of ["title", "ruling", "execution", "cost"]) assert.ok(verdict[field], `${id}.${field}`);
    assert.notEqual(verdict.title, "T", `${id} has a verdict of its own`);
  }
  const open = endingCopy.getFinalVerdict({ endingVariant: variant, finalChoiceId: "other", endingSceneChoice: "기록을 넘긴다" });
  assert.equal(open.title, "T");
  assert.equal(open.ruling, "X");
  assert.equal(open.execution, "즉시 적용: 기록을 넘긴다.");
  assert.ok(open.cost);
});

test("every observed reaction has a label and an afterglow of its own", () => {
  const titles = new Set();
  for (const observation of Object.keys(endingCopy.observationLabels)) {
    const afterglow = endingCopy.getEndingAfterglow(observation);
    assert.ok(afterglow.title && afterglow.text, observation);
    titles.add(afterglow.title);
  }
  assert.equal(titles.size, 4);
  assert.deepEqual(endingCopy.endingAxisCopy.map((axis) => axis.label), ["PROTECT", "EXPOSE", "HANDOFF"]);
});

test("a heading still on its way in is waited for, a frame at a time, and then given up on", () => {
  class FakeElement {
    constructor() {
      this.focused = 0;
    }
    hasAttribute() {
      return true;
    }
    focus() {
      this.focused += 1;
    }
  }
  const frames = [];
  let heading = null;
  globalThis.HTMLElement = FakeElement;
  globalThis.requestAnimationFrame = (callback) => frames.push(callback);
  globalThis.document = { activeElement: null, body: {}, querySelector: (selector) => (selector === "main h1" ? heading : null) };
  try {
    focusSceneTitle({ current: null });
    assert.equal(frames.length, 1, "nothing to focus yet: look again next frame");
    frames.shift()();
    assert.equal(frames.length, 1);
    heading = new FakeElement();
    frames.shift()();
    assert.equal(heading.focused, 1);
    assert.equal(frames.length, 0, "found: no more frames");

    // A page that never draws a heading does not keep a frame loop alive.
    heading = null;
    focusSceneTitle({ current: null });
    let ran = 0;
    while (frames.length) {
      frames.shift()();
      ran += 1;
    }
    assert.equal(ran, 30);
  } finally {
    delete globalThis.document;
    delete globalThis.HTMLElement;
    delete globalThis.requestAnimationFrame;
  }
});

test("the feedback form's status line is said about one case, and only on that case's page", async () => {
  const { readFeedbackStatus } = await import("../../src/state/useFeedback.js");
  const saved = { caseId: "case01", text: "피드백을 저장했습니다." };
  assert.equal(readFeedbackStatus(saved, "case01"), "피드백을 저장했습니다.");
  assert.equal(readFeedbackStatus(saved, "case02"), "", "it used to stand under the next case's empty form");
  assert.equal(readFeedbackStatus({ caseId: null, text: "" }, "case01"), "");
});

const { createConsentChange } = await import("../../src/state/useConsentToggle.js");

test("consent is only real once the save holds it, and the box says why it snapped back", () => {
  const calls = [];
  const record = (name) => (value) => calls.push([name, value]);
  const make = (storageSaved, pendingTelemetry = [{ id: "row" }]) =>
    createConsentChange({
      pendingTelemetry,
      persist: (patch) => (calls.push(["persist", patch]), { storageSaved }),
      setDataConsent: record("consent"),
      setPendingTelemetry: record("queue"),
      setTelemetryStatus: record("status"),
      setNote: record("note"),
    });
  const box = (checked) => ({ target: { checked } });

  // A tick the browser kept.
  let event = box(true);
  make(true)(event);
  assert.deepEqual(calls.slice(0, 3), [["persist", { dataConsent: true }], ["consent", true], ["note", null]]);
  // The report's line is corrected only if it still says consent was withdrawn.
  const [, correct] = calls[3];
  const withdrawn = { tone: "local", text: "데이터 제공 동의를 해제했습니다. 미전송 원격 대기열도 삭제했습니다." };
  assert.equal(correct(withdrawn).tone, "ready");
  assert.match(correct(withdrawn).text, /동의했습니다/);
  const offline = { tone: "local", text: "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다." };
  assert.equal(correct(offline), offline, "a line about something else is left as it is");

  // A tick it refused: the box snaps back and says so beside itself.
  calls.length = 0;
  event = box(true);
  make(false)(event);
  assert.equal(event.target.checked, false);
  assert.equal(calls.find(([name]) => name === "consent"), undefined);
  assert.equal(calls.find(([name]) => name === "note")[1].tone, "error");
  assert.match(calls.find(([name]) => name === "note")[1].text, /동의를 브라우저 저장본에 반영하지 못했습니다/);

  // An untick it kept empties the queue with it.
  calls.length = 0;
  make(true)(box(false));
  assert.deepEqual(calls[0], ["persist", { dataConsent: false, pendingTelemetry: [] }]);
  assert.deepEqual(calls.slice(1, 3), [["consent", false], ["queue", []]]);
  assert.equal(calls.find(([name]) => name === "note")[1].tone, "local");

  // An untick it refused leaves the queue alone: nothing emptied it, and
  // setting it back to this render's copy dropped rows folded in since.
  calls.length = 0;
  event = box(false);
  make(false, [{ id: "kept" }])(event);
  assert.equal(event.target.checked, true);
  assert.equal(calls.find(([name]) => name === "queue"), undefined);
  assert.deepEqual(calls.find(([name]) => name === "consent"), ["consent", true]);
  const note = calls.find(([name]) => name === "note")[1];
  assert.equal(note.tone, "error");
  assert.deepEqual(calls.find(([name]) => name === "status")[1], note, "the report's status line is told the same thing");
});
