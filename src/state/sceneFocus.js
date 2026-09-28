const MODAL_PAGE = "[role='dialog'][aria-modal='true']";

/**
 * Puts focus on the scene's title, unless a modal page is in front of it.
 *
 * A window opens on the briefing page, and a case on the relic draft; both take
 * focus when they mount. The runtime focused the title a frame later, which
 * pulled focus out of the page that had just taken it: Tab then walked the
 * covered table, and Enter on the draft no longer took the focused relic. So
 * the title waits. When the page in front closes and leaves focus nowhere, the
 * title takes it then; when another page takes its place (the draft, then the
 * briefing), it waits for that one too.
 */
export function focusSceneTitle(titleRef) {
  const modal = document.querySelector(MODAL_PAGE);
  if (!modal) {
    titleRef.current?.focus({ preventScroll: true });
    return;
  }
  if (typeof MutationObserver !== "function" || !modal.parentNode) return;
  const observer = new MutationObserver(() => {
    if (modal.isConnected) return;
    observer.disconnect();
    const focusLost = !document.activeElement || document.activeElement === document.body;
    if (focusLost || document.querySelector(MODAL_PAGE)) focusSceneTitle(titleRef);
  });
  observer.observe(modal.parentNode, { childList: true });
}
