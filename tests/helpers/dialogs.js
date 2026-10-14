/**
 * Answers every question the page asks before it throws progress away, and
 * keeps what it asked.
 *
 * The product asks through `src/state/confirmAction.js`, which shows a dialog
 * in the game (`src/components/ConfirmDialog.jsx`, `data-testid` confirm-dialog
 * / confirm-message / confirm-yes / confirm-no): restoring or deleting a
 * recovery slot, restoring the kept backup, clearing the error log, starting
 * fresh after a recovery or from the error screen, 프롤로그 시작 / NEW GAME+
 * 시작 over a run that can be resumed, 초기화 (the play header's and the result
 * page's), reopening the case that just closed (이 사건 다시 도전 in both places
 * on the result page, `R` there, a collapse's 다시 도전 for that case), a roadmap
 * card that would drop
 * a record, and the cloud save's overwrite, import and delete. One question is
 * still the browser's own `confirm`: exporting the diagnostic log, a
 * debug-build tool. Both kinds are answered here and land in the same list.
 *
 * Until 2026-10 every one of them was the browser's dialog, which stopped the
 * page: a click that raised one did not return until the listener had
 * answered. The in-game dialog does not stop anything, so it is answered from
 * inside the page, by a watcher that presses the dialog's own button the
 * moment it is drawn -- in the same turn of the page as the click that asked.
 * A spec written as "click, then look" reads the same as it did.
 *
 * `await` it, before the click. The answer can be changed by calling the other
 * one (`acceptConfirms` then `dismissConfirms`, on the same page): there is one
 * watcher and one list per page, and both calls return that list. A spec that
 * wants to look at the dialog itself -- its focus, its keys -- calls neither
 * and uses `confirmDialog(page)` or `answerConfirm(page, yes)`.
 *
 * With nothing answering, the dialog stays up and covers the page: the next
 * click times out on it, where an unanswered browser dialog was dismissed in
 * silence and the test went on having tested nothing.
 */
const ASKED_BINDING = "__cpConfirmAsked";
const watched = new WeakMap();

/** Runs in the page: presses the answer on every confirm dialog as it appears. */
function watchConfirms({ yes, binding }) {
  window.__cpConfirmYes = yes;
  if (window.__cpConfirmWatch) return;
  const answer = () => {
    const dialog = document.querySelector('[data-testid="confirm-dialog"]');
    if (!dialog || dialog.dataset.answered) return;
    dialog.dataset.answered = "1";
    window[binding]?.(dialog.querySelector('[data-testid="confirm-message"]').textContent);
    dialog.querySelector(`[data-testid="${window.__cpConfirmYes ? "confirm-yes" : "confirm-no"}"]`).click();
  };
  window.__cpConfirmWatch = new MutationObserver(answer);
  window.__cpConfirmWatch.observe(document, { childList: true, subtree: true });
  answer();
}

async function answerConfirms(page, yes) {
  let state = watched.get(page);
  if (!state) {
    state = { asked: [], yes };
    watched.set(page, state);
    page.on("dialog", (dialog) => {
      state.asked.push(dialog.message());
      return state.yes ? dialog.accept() : dialog.dismiss();
    });
    await page.exposeFunction(ASKED_BINDING, (message) => {
      state.asked.push(message);
    });
  }
  state.yes = yes;
  const options = { yes, binding: ASKED_BINDING };
  // Every page loaded from here on, and the one that is up now. A later call
  // adds a later script, so the last answer chosen is the one a reload gets.
  await page.addInitScript(watchConfirms, options);
  await page.evaluate(watchConfirms, options);
  return state.asked;
}

/** Says yes to every question from here on. Resolves to the list of what was asked. */
export function acceptConfirms(page) {
  return answerConfirms(page, true);
}

/** Says no to every question from here on. Resolves to the same list. */
export function dismissConfirms(page) {
  return answerConfirms(page, false);
}

/** The question on screen, for a spec that answers it by hand. */
export function confirmDialog(page) {
  return page.getByTestId("confirm-dialog");
}

/** Answers the one question on screen by pressing its button, and resolves to what it asked. */
export async function answerConfirm(page, yes = true) {
  const dialog = confirmDialog(page);
  const message = await dialog.getByTestId("confirm-message").innerText();
  await dialog.getByTestId(yes ? "confirm-yes" : "confirm-no").click();
  await dialog.waitFor({ state: "detached" });
  return message;
}
