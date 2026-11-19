import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { FRIEND_TARGET_KEY } = await import("../../src/appConfig.js");
const { readSharedScore, withSharedScore } = await import("../../src/shareLink.js");
const friend = await import("../../src/friendTarget.js");
const { buildResultCardModel, buildShareText } = await import("../../src/resultCardModel.js");
const { fill } = await import("../../src/locale.js");
const { default: habitsKo } = await import("../../src/copy/habits.js");
const { default: habitsEn } = await import("../../src/locales/en/screens/habits.js");
const { default: habitsJa } = await import("../../src/locales/ja/screens/habits.js");
const { default: cardKo } = await import("../../src/copy/resultCard.js");
const { default: cardEn } = await import("../../src/locales/en/screens/resultCard.js");
const { default: cardJa } = await import("../../src/locales/ja/screens/resultCard.js");

/**
 * N32 「친구 기록 넘기기」: the shared address carries the season's best burst
 * (`&s=`), the start page keeps it on this device as a goal, and the ending
 * says whether this season beat it. Display only: these are every reader.
 */

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-11-17T12:00:00+09:00");

test("the address takes a whole score from 1 to 100 after the mark, and nothing else", () => {
  assert.equal(withSharedScore("https://a.example/?from=card&h=moth", 87), "https://a.example/?from=card&h=moth&s=87");
  assert.equal(withSharedScore("https://a.example/?from=card", 100), "https://a.example/?from=card&s=100");
  for (const bad of [0, -3, 101, 12.5, Number.NaN, "x", null, undefined]) {
    assert.equal(withSharedScore("https://a.example/?from=card", bad), "https://a.example/?from=card", String(bad));
  }
  assert.equal(withSharedScore("", 50), "", "no address, nothing to add to");
});

test("the start page reads back only a score written the way the card writes it", () => {
  assert.equal(readSharedScore("?from=card&h=moth&s=87"), 87);
  assert.equal(readSharedScore("?s=7&from=card"), 7);
  assert.equal(readSharedScore("?from=card&s=100"), 100);
  for (const bad of ["0", "101", "087", "8.5", "-1", "1e2", "%3Cb%3E", "", "99&s=3"]) {
    assert.equal(readSharedScore(`?from=card&s=${bad}`), bad === "99&s=3" ? 99 : 0, bad);
  }
  assert.equal(readSharedScore("?s=87"), 0, "without the card's mark");
  assert.equal(readSharedScore(undefined), 0);
});

test("the copied line ends on the habit and the season's best burst; a season on 0 carries no score", () => {
  const model = buildResultCardModel({
    fingerprint: { modeTitle: "DNA", habit: { id: "shield", title: "사람 먼저 방패형", card: "문장." } },
    endingName: "결말",
    caseResults: { case03: { burstScore: 87, rank: "A" } },
  });
  assert.ok(buildShareText(model, "https://a.example").endsWith(" 문장. https://a.example/?from=card&h=shield&s=87"));
  const zero = buildResultCardModel({ fingerprint: { modeTitle: "DNA" }, endingName: "결말", caseResults: {} });
  assert.ok(buildShareText(zero, "https://a.example").endsWith(" https://a.example/?from=card"));
});

test("a visit with a score keeps the target on this device; one without keeps nothing new", () => {
  localStorage.removeItem(FRIEND_TARGET_KEY);
  assert.equal(friend.takeFriendTarget("?from=card&h=moth", NOW), null, "a habit alone is nothing to beat");
  assert.equal(localStorage.getItem(FRIEND_TARGET_KEY), null);
  assert.deepEqual(friend.takeFriendTarget("?from=card&h=moth&s=64", NOW), { habit: "moth", score: 64, at: NOW });
  assert.deepEqual(JSON.parse(localStorage.getItem(FRIEND_TARGET_KEY)), { habit: "moth", score: 64, at: NOW });
  // A later plain visit reads it back; a newer card replaces it.
  assert.deepEqual(friend.takeFriendTarget("", NOW + DAY), { habit: "moth", score: 64, at: NOW });
  assert.deepEqual(friend.takeFriendTarget("?from=card&s=90", NOW + 2 * DAY), { habit: "", score: 90, at: NOW + 2 * DAY });
  assert.deepEqual(friend.keptFriendTarget(NOW + 3 * DAY), { habit: "", score: 90, at: NOW + 2 * DAY });
});

test("a kept target runs out after its days and is removed; a broken one is never read", () => {
  localStorage.setItem(FRIEND_TARGET_KEY, JSON.stringify({ habit: "moth", score: 64, at: NOW }));
  assert.ok(friend.keptFriendTarget(NOW + friend.FRIEND_TARGET_DAYS * DAY));
  assert.equal(friend.keptFriendTarget(NOW + friend.FRIEND_TARGET_DAYS * DAY + 1), null);
  assert.equal(friend.takeFriendTarget("", NOW + 31 * DAY), null);
  assert.equal(localStorage.getItem(FRIEND_TARGET_KEY), null, "removed once it ran out");
  for (const raw of ["{", "null", "3", JSON.stringify({ score: 500, at: NOW }), JSON.stringify({ score: 50 }), JSON.stringify({ score: 50, at: NOW + DAY }), JSON.stringify({ score: 50, at: NOW, habit: "<b>" })]) {
    const read = friend.readFriendTarget(raw, NOW);
    if (raw.includes("<b>")) assert.deepEqual(read, { habit: "", score: 50, at: NOW }, "a habit that is not an id is dropped");
    else assert.equal(read, null, raw);
  }
  assert.equal(friend.readFriendTarget(null, NOW), null);
  localStorage.removeItem(FRIEND_TARGET_KEY);
  assert.equal(friend.keptFriendTarget(NOW), null);
});

test("the ending's standing: higher beats it, a tie does not, and the gap is what beating it takes", () => {
  const target = { habit: "moth", score: 64, at: NOW };
  assert.deepEqual(friend.friendTargetStanding(target, 70), { score: 64, mine: 70, beaten: true, gap: 0 });
  assert.deepEqual(friend.friendTargetStanding(target, 64), { score: 64, mine: 64, beaten: false, gap: 1 });
  assert.deepEqual(friend.friendTargetStanding(target, 40), { score: 64, mine: 40, beaten: false, gap: 25 });
  assert.deepEqual(friend.friendTargetStanding(target, Number.NaN), { score: 64, mine: 0, beaten: false, gap: 65 });
  assert.equal(friend.friendTargetStanding(null, 70), null);
});

test("the goal and the ending's lines say the numbers in all three languages", () => {
  assert.equal(fill(habitsKo.friendTarget, { score: 64 }), "친구 기록 넘기기: 최고 버스트 64점을 넘어 보세요.");
  for (const habits of [habitsEn, habitsJa]) assert.match(fill(habits.friendTarget, { score: 64 }), /64/);
  const beaten = { score: 64, mine: 70, gap: 0 };
  const short = { score: 64, mine: 40, gap: 25 };
  assert.equal(fill(cardKo.friendBeaten, beaten), "친구 기록 64점을 넘었습니다. 이번 시즌 최고 버스트 70점.");
  assert.equal(fill(cardKo.friendShort, short), "친구 기록 64점을 넘기까지 25점 모자랐습니다. 이번 시즌 최고 버스트 40점.");
  for (const card of [cardEn, cardJa]) {
    assert.match(fill(card.friendBeaten, beaten), /64.*70/);
    assert.match(fill(card.friendShort, short), /25/);
    assert.doesNotMatch(fill(card.friendShort, short), /[{}]/);
  }
});
