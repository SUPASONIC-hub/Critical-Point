import assert from "node:assert/strict";
import { test } from "node:test";

import noticesCopy, { offersStorageRetry } from "../../src/copy/notices.js";
import shellNotices from "../../src/shellNotices.js";
import { overlayModule } from "../../src/locales/overlay.js";

/**
 * The shell's storage line (src/shellNotices.js) is the runtime's
 * `notices.save.unavailable`: the same Korean on a Korean page, and on an
 * English or Japanese page the line its dictionary gives the runtime -- which
 * `offersStorageRetry` then knows, so the retry button is offered.
 */
test("the shell's storage line is the runtime's, unchanged on a Korean page", () => {
  assert.equal(shellNotices.save.unavailable, "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
  assert.equal(shellNotices.save.unavailable, noticesCopy.save.unavailable);
  assert.equal(offersStorageRetry(shellNotices.save.unavailable), true);
});

for (const lang of ["en", "ja"]) {
  test(`on a ${lang} page the shell's storage line is in ${lang}, and offers the retry`, async () => {
    const { copy } = await import(`../../src/locales/${lang}/index.js`);
    const shell = structuredClone(shellNotices);
    const runtime = structuredClone(noticesCopy);
    overlayModule(copy, "screens", { notices: shell });
    overlayModule(copy, "screens", { notices: runtime });
    assert.equal(shell.save.unavailable, copy.screens.notices.save.unavailable);
    assert.doesNotMatch(shell.save.unavailable, /[가-힣]/);
    assert.equal(shell.save.unavailable, runtime.save.unavailable);
    // offersStorageRetry reads the runtime's table, laid over the same way on that page.
    const lines = noticesCopy.save;
    const kept = lines.unavailable;
    lines.unavailable = runtime.save.unavailable;
    try {
      assert.equal(offersStorageRetry(shell.save.unavailable), true);
      assert.equal(offersStorageRetry(kept), false);
    } finally {
      lines.unavailable = kept;
    }
  });
}
