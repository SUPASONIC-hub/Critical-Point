/**
 * Asks before an action that throws progress away. One definition, so every
 * destructive control asks the same way `초기화` does; where the host has no
 * dialog to show (a test runner, an embedded frame) the action goes ahead, as
 * it did before there was a question.
 */
export function confirmAction(message) {
  return typeof globalThis.confirm !== "function" || globalThis.confirm(message);
}
