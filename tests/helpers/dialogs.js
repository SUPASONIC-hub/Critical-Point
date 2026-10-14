/**
 * Says yes to every `window.confirm` the page raises, and keeps what it asked.
 *
 * The product asks before it throws progress away (`src/state/confirmAction.js`
 * and the few direct `confirm` calls): restoring or deleting a recovery slot,
 * restoring the kept backup, clearing the error log, starting fresh after a
 * recovery or from the error screen, 프롤로그 시작 / NEW GAME+ 시작 over a run
 * that can be resumed, 초기화 (the play header's and the result page's), reopening
 * the case that just closed (이 사건 다시 도전 in both places on the result page,
 * `R` there, 복구 루트 시작), exporting the diagnostic log, and the cloud save's
 * overwrite, import and delete. With no listener Playwright dismisses a dialog,
 * so an unanswered question turns the click into a no-op and the test fails
 * somewhere further on, or passes having tested nothing.
 *
 * Register it before the click. A test that needs to answer no, or to answer
 * dialogs differently, registers its own handler instead -- two listeners both
 * answering one dialog throws.
 */
export function acceptConfirms(page) {
  const asked = [];
  page.on("dialog", (dialog) => {
    asked.push(dialog.message());
    return dialog.accept();
  });
  return asked;
}
