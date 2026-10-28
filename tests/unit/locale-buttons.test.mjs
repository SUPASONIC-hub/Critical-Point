import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { fill } from "../../src/locale.js";
import { overlayWords } from "../../src/locales/overlay.js";
import introCopy, { newGamePlusLabel } from "../../src/copy/intro.js";
import noticesCopy, { offersStorageRetry } from "../../src/copy/notices.js";
import englishScreens from "../../src/locales/en/screens/index.js";

/**
 * Two buttons the English page drew wrong until 10-26 (코드 리뷰 10-26, 낮음):
 * NEW GAME+ read its label when the shell module was read, before the
 * dictionary was laid over it, and the storage-cleanup retry looked for
 * "저장소" in the line. The Korean page draws both as it did; this file's
 * tables are laid over in English at the end, in this process only.
 */
const source = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), "utf8");
const blanks = { keys: "a, b", logFailed: "", time: "12:00" };
// The save line's keys; `storage.retry` is the button, not a line.
const lines = () => Object.entries({ ...noticesCopy.save, ...noticesCopy.storage }).filter(([key]) => key !== "retry").map(([key, line]) => [key, fill(line, blanks)]);

test("on the Korean page the NEW GAME+ label and the retry button are what they were", () => {
  assert.deepEqual(newGamePlusLabel(), ["", " 시작"]);
  assert.equal(noticesCopy.storage.retry, "저장소 정리 재시도");
  // The button came for a line with "저장소" in it, and comes for the same lines now.
  for (const [key, line] of lines()) assert.equal(offersStorageRetry(line), line.includes("저장소"), key);
  for (const other of ["", "저장됨 12:00", ...Object.values(noticesCopy.run), "Local ranking save failed: browser storage is unavailable."]) {
    assert.equal(offersStorageRetry(other), other.includes("저장소"), other);
  }
  assert.equal(offersStorageRetry(undefined), false);
});

test("the shell reads the NEW GAME+ label while rendering, and the retry button by key", () => {
  const intro = source("screens/IntroScreen.jsx");
  assert.doesNotMatch(intro, /NEW_GAME_PLUS_LABEL/);
  assert.match(intro, /\{newGamePlusLabel\(\)\[0\]\}<span lang="en">NEW GAME\+<\/span>\{newGamePlusLabel\(\)\[1\]\}/);
  // No string of introCopy is copied out at module level (a destructured object is written into in place).
  assert.doesNotMatch(intro, /^const \w+ = introCopy\.[\w.]+/m);
  const status = source("components/SaveStatus.jsx");
  assert.doesNotMatch(status, /includes\("저장소"\)/);
  assert.match(status, /offersStorageRetry\(saveStatus\)/);
  assert.match(status, /\{noticesCopy\.storage\.retry\}/);
});

test("on the English page the NEW GAME+ button reads Start NEW GAME+ and the retry button shows, in English", () => {
  overlayWords(introCopy, englishScreens.intro);
  overlayWords(noticesCopy, englishScreens.notices);
  assert.deepEqual(newGamePlusLabel(), ["Start ", ""]);
  assert.equal(noticesCopy.storage.retry, "Retry storage cleanup");
  const offered = ["unavailable", "queueUnavailable", "errorLogClearFailed", "slotDeleteFailed", "slotRestoreFailed", "backupRestoreFailed", "cleaned", "retryFailed", "resetFailed"];
  for (const [key, line] of lines()) {
    assert.doesNotMatch(line, /[가-힣]/, `${key} is in English`);
    assert.equal(offersStorageRetry(line), offered.includes(key), key);
  }
  assert.equal(offersStorageRetry(fill(noticesCopy.storage.resetFailed, { keys: "cp-save", logFailed: noticesCopy.storage.logFailed })), true);
});
