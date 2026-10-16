import { useEffect, useRef, useSyncExternalStore } from "react";
import { useDialogFocus } from "../gauntlet/useDialogFocus.js";
import { AccessibilityPanel } from "./AccessibilityPanel.jsx";

/**
 * The comfort settings, in front of the table.
 *
 * They opened from the intro alone, so a player who found the clock too fast
 * in the middle of a case had to save, leave the table, change it and come
 * back. The play header opens the same panel here (GameHeader.jsx), and the
 * table draws it with its other pages (GauntletStage.jsx).
 *
 * Whether it is open is kept outside React, in this file, because two
 * components that share no parent state have to agree on it: the header that
 * opens it and the table whose clock it holds (the stage reads
 * `useComfortDialogOpen` into its `paused`, beside the briefing and the relic
 * draft). PlayScreen and GameRuntime are at their budgets and carry none of it.
 *
 * What a change does to the table that is already open:
 *   테이블 시간, 번쩍임·흔들림, 한 글자 단축키  at once -- each is read when it
 *                                              is used (accessibilitySettings.js).
 *   읽기 시계 자동 넘김 끄기                    from the next briefing page, which
 *                                              reads it when it opens.
 *   스토리 모드                                 from the next case, as it says.
 */
let open = false;
const listeners = new Set();
const isOpen = () => open;
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function setComfortDialogOpen(next) {
  if (open === next) return;
  open = next;
  for (const listener of listeners) listener();
}

export function useComfortDialogOpen() {
  return useSyncExternalStore(subscribe, isOpen, isOpen);
}

const close = () => setComfortDialogOpen(false);

/**
 * Mounted only while open, so `useDialogFocus` takes focus when it opens and
 * hands it back to the header's button when it closes.
 *
 * A key pressed in here is the dialog's and goes no further: the table's keys
 * (useTableKeys) and the runtime's P and Escape (useRuntimeShortcuts) listen
 * on the window, and Space on 닫기 would otherwise push. The backdrop carries
 * the reveal's class as well, which the table's key handler already stands
 * down for. Escape and a click on the backdrop close it; nothing in it needs
 * confirming, since every switch is stored the moment it changes.
 */
function ComfortDialogBody() {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef, closeRef);
  // Leaving the table by any road closes it, so the next table is not held.
  useEffect(() => close, []);
  const onKeyDown = (event) => {
    event.stopPropagation();
    if (event.key !== "Escape") return trapTab(event);
    event.preventDefault();
    return close();
  };
  return (
    <div
      className="decision-reveal-backdrop comfort-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className="comfort-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comfort-dialog-title"
        aria-describedby="comfort-dialog-note"
        data-testid="comfort-dialog"
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="comfort-dialog-head">
          <h2 id="comfort-dialog-title">편의 설정</h2>
          <button ref={closeRef} type="button" className="ghost" data-testid="comfort-dialog-close" onClick={close}>
            닫기
          </button>
        </div>
        <p id="comfort-dialog-note" className="comfort-dialog-note">이 창이 열려 있는 동안 테이블 시계는 멈춥니다.</p>
        <AccessibilityPanel />
      </div>
    </div>
  );
}

/**
 * `live` is the table's window: a closed window is on its way to the reveal,
 * which is a dialog of its own, so the settings do not stay open over it. The
 * close is here rather than in the stage, which is at its import budget
 * (scripts/check-runtime-budget.mjs).
 */
export function ComfortDialog({ live }) {
  const open = useComfortDialogOpen();
  useEffect(() => {
    if (!live) setComfortDialogOpen(false);
  }, [live, open]);
  return open ? <ComfortDialogBody /> : null;
}
