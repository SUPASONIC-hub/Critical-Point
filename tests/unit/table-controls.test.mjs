import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * The table's controls, as far as they can be held without a browser: which
 * keys the table takes and what a held key does, when a press on a timed
 * button counts as made, which of the two other-tab notices is up, and what
 * the clock says aloud. Each of these was found wrong by reading (the
 * 2026-10-07 audit); none had a test that could have said so.
 */
globalThis.localStorage = createStorage();

/** A stand-in for the element a key lands on: a tag, and the classes it sits inside. */
class FakeElement {
  constructor(tag, within = []) {
    this.tag = tag;
    this.within = within;
  }

  matches(selector) {
    return selector.split(",").some((part) => {
      const tokens = part.trim().split(/\s+/);
      const own = tokens.pop();
      return own === this.tag && tokens.every((ancestor) => this.within.includes(ancestor));
    });
  }

  closest(selector) {
    return this.matches(selector) ? this : null;
  }
}
globalThis.HTMLElement = FakeElement;
let revealOpen = false;
globalThis.document = { querySelector: (selector) => (revealOpen && selector === ".decision-reveal-backdrop" ? {} : null) };

const { CLOCK_OPENED_CALL, getClockCall, getTabNotices } = await import("../../src/gauntlet/tableReadout.js");
const { handleTableKey } = await import("../../src/gauntlet/useTableKeys.js");
const settings = await import("../../src/state/accessibilitySettings.js");

const CARDS = [{ id: "a" }, { id: "b" }, { id: "c" }];

/** A table and a record of what was done to it. */
function table(state = {}) {
  const calls = [];
  const note = (name) => (...args) => calls.push([name, ...args.filter((arg) => typeof arg !== "object" || arg === null)]);
  return {
    calls,
    current: {
      cards: CARDS,
      reframeChoice: null,
      relicOffer: [],
      draftOpen: false,
      briefingOpen: false,
      tableOpen: true,
      select: note("select"),
      focus: note("focus"),
      push: note("push"),
      cash: note("cash"),
      cycleFocusMode: note("stance"),
      pickRelic: note("relic"),
      openTable: note("open"),
      ...state,
    },
  };
}

function keydown(init = {}) {
  const event = { type: "keydown", key: " ", code: "Space", repeat: false, target: new FakeElement("body"), defaultPrevented: false, ...init };
  event.preventDefault = () => {
    event.defaultPrevented = true;
  };
  return event;
}

test("a held key is still the table's key, and is pressed once", () => {
  const pushButton = new FakeElement("button", [".gx-actions"]);
  for (const [init, action] of [
    [{ key: " ", code: "Space" }, "push"],
    [{ key: "w", code: "KeyW" }, "push"],
    [{ key: "e", code: "KeyE" }, "focus"],
    [{ key: "q", code: "KeyQ" }, "stance"],
    [{ key: "Enter", code: "Enter" }, "cash"],
    [{ key: "2", code: "Digit2" }, "select"],
  ]) {
    const { current, calls } = table();
    const first = keydown({ ...init, target: pushButton });
    handleTableKey(first, current);
    assert.equal(first.defaultPrevented, true, `${init.code} is taken from the page`);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], action);

    // The repeat does nothing -- and does not go on to the focused button,
    // where Space would be a second push when the key comes up.
    const repeat = keydown({ ...init, repeat: true, target: pushButton });
    handleTableKey(repeat, current);
    assert.equal(repeat.defaultPrevented, true, `a repeat of ${init.code} is taken too`);
    assert.equal(calls.length, 1, `a repeat of ${init.code} is not a second press`);
  }
});

test("E and Q are not the table's keys before the case turns LOCK and the stances on", () => {
  // The stage hands over no `focus` without "lock" and no `cycleFocusMode`
  // without "stance" (tableUnlocks): the key does nothing and stays the page's.
  for (const [init, missing] of [
    [{ key: "e", code: "KeyE" }, { focus: null }],
    [{ key: "ㄷ", code: "KeyE" }, { focus: null }],
    [{ key: "q", code: "KeyQ" }, { cycleFocusMode: null }],
  ]) {
    const { current, calls } = table(missing);
    for (const repeat of [false, true]) {
      const event = keydown({ ...init, repeat });
      handleTableKey(event, current);
      assert.equal(event.defaultPrevented, false, `${init.code} is left to the page`);
    }
    assert.equal(calls.length, 0);
    // The other key, and the keys every step has, answer as before.
    handleTableKey(keydown({ key: "w", code: "KeyW" }), current);
    handleTableKey(keydown(missing.focus === null ? { key: "q", code: "KeyQ" } : { key: "e", code: "KeyE" }), current);
    assert.deepEqual(calls.map(([name]) => name), ["push", missing.focus === null ? "stance" : "focus"]);
  }
});

test("a repeat of a key the table does not own is left to the page", () => {
  const { current, calls } = table();
  for (const init of [{ key: "x", code: "KeyX" }, { key: "9", code: "Digit9" }, { key: "Tab", code: "Tab" }, { key: " ", code: "Space", ctrlKey: true }]) {
    const repeat = keydown({ ...init, repeat: true });
    handleTableKey(repeat, current);
    assert.equal(repeat.defaultPrevented, false, `${init.code} is not the table's`);
  }
  assert.equal(calls.length, 0);
});

test("Space and Enter stay with a control the keyboard walked to, held or not", () => {
  const card = new FakeElement("button", [".choices"]);
  for (const repeat of [false, true]) {
    const { current, calls } = table();
    for (const key of [" ", "Enter"]) {
      const event = keydown({ key, code: key === " " ? "Space" : "Enter", repeat, target: card });
      handleTableKey(event, current, true);
      assert.equal(event.defaultPrevented, false, "the control answers its own key");
    }
    assert.equal(calls.length, 0);
    // A letter is not an activation key: the table keeps it wherever focus is.
    const letter = keydown({ key: "w", code: "KeyW", repeat, target: card });
    handleTableKey(letter, current, true);
    assert.equal(letter.defaultPrevented, true);
    assert.equal(calls.length, repeat ? 0 : 1);
  }
});

test("the briefing and the draft take their keys once, and leave their own buttons alone", () => {
  const briefing = table({ briefingOpen: true, tableOpen: false });
  handleTableKey(keydown({ key: "2", code: "Digit2" }), briefing.current);
  handleTableKey(keydown({ key: " ", repeat: true }), briefing.current);
  assert.deepEqual(briefing.calls, [["open", "b"]], "a held Space does not open the table a second time");
  const timer = keydown({ key: "Enter", code: "Enter", target: new FakeElement("button", [".gx-comic"]) });
  handleTableKey(timer, briefing.current);
  assert.equal(timer.defaultPrevented, false);

  const draft = table({ draftOpen: true, tableOpen: false, relicOffer: ["metronome", "splint"] });
  handleTableKey(keydown({ key: "2", code: "Digit2" }), draft.current);
  const heldEscape = keydown({ key: "Escape", code: "Escape", repeat: true });
  handleTableKey(heldEscape, draft.current);
  assert.equal(heldEscape.defaultPrevented, true);
  assert.deepEqual(draft.calls, [["relic", "splint"]], "a held Escape does not pass on the draft by itself");
  // Space on the table behind the draft is swallowed; on the draft's own
  // button or its folded note it is theirs.
  const stray = keydown({ key: " " });
  handleTableKey(stray, draft.current);
  assert.equal(stray.defaultPrevented, true);
  for (const tag of ["button", "summary"]) {
    const own = keydown({ key: " ", target: new FakeElement(tag, [".gx-draft"]) });
    handleTableKey(own, draft.current);
    assert.equal(own.defaultPrevented, false, `the draft's ${tag} answers Space`);
  }
  assert.equal(draft.calls.length, 1);
});

test("no key reaches a table that is closed, covered or typed over", () => {
  const closed = table({ tableOpen: false });
  handleTableKey(keydown(), closed.current);
  const typing = table();
  handleTableKey(keydown({ target: new FakeElement("input") }), typing.current);
  const covered = table();
  revealOpen = true;
  try {
    handleTableKey(keydown(), covered.current);
  } finally {
    revealOpen = false;
  }
  const taken = table();
  handleTableKey(keydown({ defaultPrevented: true }), taken.current);
  assert.deepEqual([closed.calls, typing.calls, covered.calls, taken.calls], [[], [], [], []]);

  // Single-key shortcuts off: letters and digits are the page's, Space is not.
  settings.setAccessibility({ letterKeys: false });
  try {
    const quiet = table();
    for (const init of [{ key: "w", code: "KeyW" }, { key: "1", code: "Digit1" }, { key: "ㅈ", code: "KeyW" }]) {
      const event = keydown(init);
      handleTableKey(event, quiet.current);
      assert.equal(event.defaultPrevented, false);
    }
    handleTableKey(keydown(), quiet.current);
    assert.deepEqual(quiet.calls, [["push"]]);
  } finally {
    settings.setAccessibility({ letterKeys: true });
  }
});

test("그 탭에 두기 takes the question down as the notice goes up", () => {
  // A second tab opens on a bet another tab holds: the question, alone.
  assert.deepEqual(getTabNotices({ locked: false, awaitingClaim: true, live: false }), { lost: false, held: true });
  // 그 탭에 두기: this table stops. The notice replaces the question.
  assert.deepEqual(getTabNotices({ locked: true, awaitingClaim: true, live: false }), { lost: true, held: false });
  // 여기서 이어가기: the claim is made, neither is up, the slam follows.
  assert.deepEqual(getTabNotices({ locked: false, awaitingClaim: false, live: false }), { lost: false, held: false });
  // A live table another tab took, and one already on its verdict.
  assert.deepEqual(getTabNotices({ locked: true, awaitingClaim: false, live: true }), { lost: true, held: false });
  assert.deepEqual(getTabNotices({ locked: true, awaitingClaim: false, live: false }), { lost: false, held: false });
  for (const locked of [false, true]) {
    for (const awaitingClaim of [false, true]) {
      for (const live of [false, true]) {
        const { lost, held } = getTabNotices({ locked, awaitingClaim, live });
        assert.ok(!(lost && held), "the two are never up together: they are drawn in the same place");
      }
    }
  }
});

test("the clock is called when it opens the table by itself, then at ten and five", () => {
  const live = { live: true, paused: false };
  assert.equal(getClockCall({ ...live, remaining: 45, elapsed: 0, openedByClock: true }), CLOCK_OPENED_CALL);
  assert.equal(getClockCall({ ...live, remaining: 41, elapsed: 4, openedByClock: true }), CLOCK_OPENED_CALL, "the call stands long enough to be read out");
  assert.equal(getClockCall({ ...live, remaining: 39, elapsed: 6, openedByClock: true }), "");
  assert.equal(getClockCall({ ...live, remaining: 45, elapsed: 0, openedByClock: false }), "", "a table the player opened needs no telling");
  assert.equal(getClockCall({ ...live, remaining: 45 }), "");
  assert.equal(getClockCall({ ...live, remaining: 10, elapsed: 35, openedByClock: true }), "10초 남았다");
  assert.equal(getClockCall({ ...live, remaining: 5, elapsed: 40 }), "5초 남았다");
  // A short board opened by the clock: the count wins over the opening.
  assert.equal(getClockCall({ ...live, remaining: 9, elapsed: 3, openedByClock: true }), "10초 남았다");
  assert.equal(getClockCall({ live: false, paused: false, remaining: 3, openedByClock: true }), "");
  assert.equal(getClockCall({ live: true, paused: true, remaining: 3, openedByClock: true }), "");
});
