import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  boardBodyMark,
  boardTextHasContact,
  boardTextHasLink,
  getBoardPostRefusal,
  isOwnRecentPost,
  readOwnBoardPosts,
  rememberOwnBoardPost,
} from "../../src/state/useBoard.js";
import { BOARD_OWN_POSTS_KEY } from "../../src/appConfig.js";

/**
 * The browser's copy of the board's rules against the list the server's copy is
 * held to (`scripts/check-grants.mjs` posts the same cases to the trigger). The
 * two used to keep a list each, and agreed only on the cases someone had
 * thought to write down twice.
 */
const cases = JSON.parse(readFileSync(new globalThis.URL("../fixtures/board-filter-cases.json", import.meta.url), "utf8"));

const REASON_OF = {
  "nickname-characters": "characters",
  "body-characters": "characters",
  "nickname-link": "link",
  "body-link": "link",
  contact: "contact",
};

test("the fixture holds enough cases to mean something", () => {
  assert.ok(cases.refused.length >= 10, "refused cases");
  assert.ok(cases.accepted.length >= 3, "accepted cases");
  assert.ok(cases.refused.some((entry) => /[가-힣]/.test(entry.body.split(".").at(-1)?.slice(0, 4) ?? "")), "an attached particle");
});

for (const { label, nickname, body, reason } of cases.refused) {
  test(`the browser refuses ${label}, for the reason the server gives`, () => {
    assert.equal(REASON_OF[getBoardPostRefusal(nickname, body)], reason, `${JSON.stringify(nickname)} / ${JSON.stringify(body)}`);
  });
}

for (const { label, nickname, body } of cases.accepted) {
  test(`the browser accepts ${label}`, () => {
    assert.equal(getBoardPostRefusal(nickname, body), null, body);
  });
}

test("a domain is a link whatever is written straight after it", () => {
  for (const tail of ["으로", "에서", "입니다", "!", ")", "", " 로"]) {
    assert.equal(boardTextHasLink(`spam.com${tail}`), true, `spam.com${tail}`);
  }
  // More of the name is not the end of the name.
  assert.equal(boardTextHasLink("3.communication"), false);
  assert.equal(boardTextHasLink("v1.internal-note"), false);
});

test("a phone number is contact details whatever is written straight after it", () => {
  assert.equal(boardTextHasContact("010-1234-5678로 주세요"), true);
  assert.equal(boardTextHasContact("2023-0412 대출"), false);
});

test("words this page already posted are not sent again to be dropped in silence", () => {
  const now = 1_760_000_000_000;
  const posted = new Map([[boardBodyMark("같은 한 줄"), now - 60 * 60_000]]);
  assert.equal(isOwnRecentPost(posted, "같은 한 줄", now), true, "an hour later the server would take it and store nothing");
  assert.equal(isOwnRecentPost(posted, "다른 한 줄", now), false);
  assert.equal(isOwnRecentPost(posted, "같은 한 줄", now + 6 * 60 * 60_000), false, "past the server's six hours it is a new post");
  assert.equal(isOwnRecentPost(new Map(), "같은 한 줄", now), false);
});

test("a post is remembered past a reload, as a mark of its words, for the server's six hours", () => {
  const store = new Map();
  const before = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  try {
    const now = 1_760_000_000_000;
    // Another page of this device posted these two; this page has posted nothing.
    store.set(BOARD_OWN_POSTS_KEY, JSON.stringify({ [boardBodyMark("오전에 쓴 글")]: now - 60 * 60_000, [boardBodyMark("어제 쓴 글")]: now - 7 * 60 * 60_000 }));
    assert.equal(isOwnRecentPost(readOwnBoardPosts(now), "오전에 쓴 글", now), true, "what a reload forgot is read back");
    assert.equal(isOwnRecentPost(readOwnBoardPosts(now), "어제 쓴 글", now), false, "past six hours it is a new post");

    rememberOwnBoardPost("방금 쓴 글", now);
    const kept = JSON.parse(store.get(BOARD_OWN_POSTS_KEY));
    assert.deepEqual(Object.keys(kept).sort(), [boardBodyMark("방금 쓴 글"), boardBodyMark("오전에 쓴 글")].sort(), "the expired entry is dropped on the next write");
    assert.doesNotMatch(store.get(BOARD_OWN_POSTS_KEY), /[가-힣]/, "the words themselves are not left in storage");

    // A list that cannot be read is an empty list, and memory still answers.
    store.set(BOARD_OWN_POSTS_KEY, "not json");
    assert.equal(isOwnRecentPost(readOwnBoardPosts(now), "방금 쓴 글", now), true);
    assert.equal(isOwnRecentPost(readOwnBoardPosts(now), "오전에 쓴 글", now), false);
    store.set(BOARD_OWN_POSTS_KEY, "[1,2]");
    assert.equal(isOwnRecentPost(readOwnBoardPosts(now), "오전에 쓴 글", now), false);
  } finally {
    globalThis.localStorage = before;
  }
});
