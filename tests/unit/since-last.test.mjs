import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { LAST_VISIT_KEY } = await import("../../src/appConfig.js");
const visit = await import("../../src/state/sinceLastVisit.js");
const { countPostsSince, newSideCases, sinceLastLines } = await import("../../src/sinceLastItems.js");
const { default: ko } = await import("../../src/copy/sinceLast.js");
const { default: en } = await import("../../src/locales/en/screens/sinceLast.js");
const { default: ja } = await import("../../src/locales/ja/screens/sinceLast.js");

/**
 * N24 「지난번 이후」: the visit stamp (state/sinceLastVisit.js) that decides
 * whether the start screen has the card, and the card's lines
 * (sinceLastItems.js). Local only: the stamp is the one thing written.
 */

const DAY = visit.DAY_MS;
const NOW = Date.parse("2026-11-17T12:00:00+09:00");

test("a stamp is read back only as a time and the side ids it listed", () => {
  assert.deepEqual(visit.readVisitStamp(JSON.stringify({ at: NOW, sides: ["side01", "side08", "case01", 3, "side1"] })), { at: NOW, sides: ["side01", "side08"] });
  assert.deepEqual(visit.readVisitStamp(JSON.stringify({ at: NOW })), { at: NOW, sides: [] });
  for (const raw of [null, "", "{", "null", "5", JSON.stringify({ at: "x" }), JSON.stringify({ at: -1 }), JSON.stringify({ sides: [] })]) {
    assert.equal(visit.readVisitStamp(raw), null, String(raw));
  }
});

test("a return is due after three whole days, not before, and never from a stamp in the future", () => {
  const stamp = { at: NOW, sides: ["side01"] };
  assert.deepEqual(visit.returnAfter(stamp, NOW + 3 * DAY), { due: true, days: 3, since: NOW, sides: ["side01"] });
  assert.equal(visit.returnAfter(stamp, NOW + 3 * DAY - 1).due, false);
  assert.equal(visit.returnAfter(stamp, NOW + 10 * DAY).days, 10);
  assert.equal(visit.returnAfter(stamp, NOW - 1), null, "a clock moved back");
  assert.equal(visit.returnAfter(null, NOW), null);
  assert.equal(visit.returnAfter(stamp, Number.NaN), null);
});

test("the first visit is not a return and leaves a stamp; the answer is the same all page long", () => {
  localStorage.removeItem(LAST_VISIT_KEY);
  visit.resetVisitForTests();
  assert.equal(visit.takeVisit({ now: NOW, sides: ["side01", "side02", "nope"] }), null);
  assert.deepEqual(JSON.parse(localStorage.getItem(LAST_VISIT_KEY)), { at: NOW, sides: ["side01", "side02"] });
  assert.equal(visit.takeVisit({ now: NOW + 9 * DAY }), null, "read once per page");

  visit.resetVisitForTests();
  const back = visit.takeVisit({ now: NOW + 4 * DAY, sides: ["side01", "side02", "side03"] });
  assert.deepEqual(back, { due: true, days: 4, since: NOW, sides: ["side01", "side02"] });
  assert.deepEqual(JSON.parse(localStorage.getItem(LAST_VISIT_KEY)), { at: NOW + 4 * DAY, sides: ["side01", "side02", "side03"] });

  visit.resetVisitForTests();
  assert.equal(visit.takeVisit({ now: NOW + 5 * DAY }).due, false, "the day after a return is not one");
  visit.resetVisitForTests();
  localStorage.removeItem(LAST_VISIT_KEY);
});

test("posts are counted after the last visit only; rows without a readable time are not", () => {
  const rows = [
    { created_at: "2026-11-20T00:00:00Z" },
    { created_at: "2026-11-10T00:00:00Z" },
    { created_at: "not a time" },
    {},
    null,
  ];
  assert.equal(countPostsSince(rows, Date.parse("2026-11-15T00:00:00Z")), 1);
  assert.equal(countPostsSince(rows, 0), 2);
  assert.equal(countPostsSince(undefined, 0), 0);
});

test("new side cases are the slot's cases not listed at the last visit", () => {
  const slot = { cases: [{ id: "side01", label: "번외 1", title: "가" }, { id: "side08", label: "번외 8", title: "정상화" }] };
  assert.deepEqual(newSideCases(slot, ["side01"]).map((side) => side.id), ["side08"]);
  assert.deepEqual(newSideCases(slot, ["side01", "side08"]), []);
  assert.deepEqual(newSideCases(null, []), [], "no slot (no finale closed): nothing");
  assert.deepEqual(newSideCases(slot).length, 2);
});

test("the card's lines say what is there, in order, and leave the rest out", () => {
  const all = sinceLastLines(ko, {
    resume: { label: "사건 03", title: "새벽 결재" },
    rule: { title: "위기 주간" },
    sides: [{ label: "번외 8", title: "정상화" }],
    posts: 3,
  });
  assert.deepEqual(all, [
    { key: "resume", text: "이어할 곳: 사건 03 새벽 결재" },
    { key: "rule", text: "이번 주 규칙: 위기 주간" },
    { key: "sides", text: "새 번외 사건: 번외 8 정상화" },
    { key: "posts", text: "게시판 새 글 3개" },
  ]);
  assert.deepEqual(sinceLastLines(ko, { posts: 50 }), [{ key: "posts", text: "게시판 새 글 50개 이상" }]);
  assert.deepEqual(sinceLastLines(ko, { posts: 0, rule: null, resume: {} }), []);
  assert.deepEqual(sinceLastLines(ko), []);
});

test("the card's words are there in all three languages with the same blanks", () => {
  const blanks = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const table of [en, ja]) {
    assert.deepEqual(Object.keys(table).sort(), Object.keys(ko).sort());
    for (const key of Object.keys(ko)) assert.deepEqual(blanks(table[key]), blanks(ko[key]), key);
  }
});
