import assert from "node:assert/strict";
import { test } from "node:test";

import { checkBoardSubmit, getBoardSubmitBlock } from "../../src/state/useBoard.js";

/**
 * The 글 남기기 button: when it will not act at all, and what a press is told
 * when the post is not sent. It used to be `disabled` with nothing said for a
 * short name, and a hidden field a browser had filled in answered "글을
 * 올렸습니다" for a post that went nowhere.
 */
const post = { nickname: "분석관 김", body: "310억이 아직도 생각납니다.", sinceOpenedMs: 60_000 };

test("the button is blocked only by what a press cannot change", () => {
  assert.equal(getBoardSubmitBlock({ boardStatus: "ready" }), null);
  assert.equal(getBoardSubmitBlock({ boardStatus: "ready", isPosting: true }), "posting");
  assert.equal(getBoardSubmitBlock({ boardStatus: "ready", privacySignalCount: 1 }), "privacy");
  for (const boardStatus of ["idle", "loading", "error", "local"]) {
    assert.equal(getBoardSubmitBlock({ boardStatus, privacySignalCount: 1 }), "offline", boardStatus);
  }
});

test("a short name or post is answered when the button is pressed", () => {
  assert.equal(checkBoardSubmit({ ...post, nickname: "" }).reason, "nickname-characters");
  assert.match(checkBoardSubmit({ ...post, nickname: "김" }).message, /이름은 2자 이상/);
  assert.equal(checkBoardSubmit({ ...post, body: " " }).reason, "body-characters");
  assert.match(checkBoardSubmit({ ...post, body: "a" }).message, /글은 2자 이상/);
});

test("a post that may go is not stopped", () => {
  assert.equal(checkBoardSubmit(post), null);
  assert.equal(checkBoardSubmit({ ...post, sinceLastPostMs: 30_000 }), null);
});

test("a filled hidden field stops the post and says so", () => {
  const stopped = checkBoardSubmit({ ...post, honeypot: "https://example.com" });
  assert.equal(stopped.reason, "honeypot");
  assert.doesNotMatch(stopped.message, /올렸습니다/, "a post that went nowhere is not called a success");
  assert.match(stopped.message, /다시 눌러/);
  // It is checked first, so a script learns nothing else about the form.
  assert.equal(checkBoardSubmit({ honeypot: "x", nickname: "", body: "", sinceOpenedMs: 0 }).reason, "honeypot");
  assert.equal(checkBoardSubmit({ ...post, honeypot: "   " }), null, "whitespace is not a filled field");
});

test("the checks run in the order they always have", () => {
  const all = { nickname: "", body: "", sinceOpenedMs: 100, privacySignalCount: 2, sinceLastPostMs: 1_000 };
  assert.equal(checkBoardSubmit(all).reason, "dwell");
  assert.equal(checkBoardSubmit({ ...all, sinceOpenedMs: 3_000 }).reason, "privacy");
  assert.equal(checkBoardSubmit({ ...all, sinceOpenedMs: 3_000, privacySignalCount: 0 }).reason, "nickname-characters");
  assert.equal(checkBoardSubmit({ ...post, body: "후기는 spam.com으로 오세요" }).reason, "body-link");
  const early = checkBoardSubmit({ ...post, sinceLastPostMs: 12_400 });
  assert.equal(early.reason, "interval");
  assert.match(early.message, /18초 뒤에/);
});
