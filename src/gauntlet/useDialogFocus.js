import { useEffect } from "react";

const FOCUSABLE = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Focus for the two modal pages in front of the table, the relic draft and the
 * briefing. Both said `aria-modal` and neither behaved like it: Tab walked out
 * of the page into the table behind it, and when the page closed focus was
 * left on a node that no longer existed.
 *
 * On mount this focuses `initialRef` (or the dialog), remembers what had focus
 * before, and hands focus back to it on unmount if it is still on the page.
 * The returned handler goes on the dialog's `onKeyDown` and keeps Tab inside.
 */
export function useDialogFocus(dialogRef, initialRef = null) {
  useEffect(() => {
    const previous = document.activeElement;
    (initialRef?.current ?? dialogRef.current)?.focus({ preventScroll: true });
    return () => {
      if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
    // Mount and unmount only: the page is one dialog for its whole life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return function trapTab(event) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = document.activeElement;
    // The dialog itself holds focus when it opens; from there Shift+Tab would
    // leave it, so it counts as being on the edge.
    const onChild = active !== dialogRef.current && dialogRef.current.contains(active);
    if (event.shiftKey && (active === first || !onChild)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !onChild)) {
      event.preventDefault();
      first.focus();
    }
  };
}
