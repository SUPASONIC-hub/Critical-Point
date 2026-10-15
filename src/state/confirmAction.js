import { useSyncExternalStore } from "react";

/**
 * Asks before an action that throws progress away. One definition, so every
 * destructive control asks the same way `초기화` does.
 *
 * The question is a dialog in the game (components/ConfirmDialog.jsx), mounted
 * once beside the app, and the answer is a promise: `if (!(await
 * confirmAction(...))) return;`. It was the browser's `confirm()`, which cannot
 * be styled, is not shown at all by some in-app browsers and installed copies
 * -- every question answered no, unseen -- and stops the page while it is up.
 *
 * Where the dialog is not on the page the browser's is asked, and where the
 * host has neither (a test runner, an embedded frame) the action goes ahead,
 * as it did before there was a question.
 */
let show = null;
let settle = null;
const watchers = new Set();
const tell = () => watchers.forEach((watcher) => watcher());

/** Whether a question is up, and who is told when that changes. */
export const isConfirmOpen = () => settle !== null;
export function watchConfirm(watcher) {
  watchers.add(watcher);
  return () => watchers.delete(watcher);
}

/**
 * Whether a question is up. The table holds its clock under one, as under the
 * draft and the briefing (GauntletStage.jsx): the browser's dialog stopped the
 * page, clock and all, and this one is drawn in front of a live table.
 */
export function useConfirmOpen() {
  return useSyncExternalStore(watchConfirm, isConfirmOpen, isConfirmOpen);
}

/** The dialog says it is on the page, and how it is told what to ask. Returns what takes it off again. */
export function mountConfirmHost(setQuestion) {
  show = setQuestion;
  return () => {
    if (show !== setQuestion) return;
    // A question nobody can answer any more is answered no.
    answerConfirm(false);
    show = null;
  };
}

/** The answer to the question on screen. With no question up it does nothing. */
export function answerConfirm(yes) {
  const done = settle;
  if (!done) return;
  settle = null;
  show(null);
  tell();
  done(yes);
}

export function confirmAction(message) {
  if (!show) return Promise.resolve(typeof globalThis.confirm !== "function" || globalThis.confirm(message));
  // One question at a time: a second one answers the first no.
  answerConfirm(false);
  return new Promise((resolve) => {
    settle = resolve;
    show(message);
    tell();
  });
}
