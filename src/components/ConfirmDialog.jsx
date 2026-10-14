import { useEffect, useRef, useState } from "react";
import { useDialogFocus } from "../gauntlet/useDialogFocus.js";
import { answerConfirm, mountConfirmHost } from "../state/confirmAction.js";

/**
 * The question `confirmAction` asks, as a dialog in the game.
 *
 * Focus starts on 취소: Enter held a moment too long on the button that asked
 * lands on the answer that changes nothing, as Escape does. Tab stays inside
 * and focus goes back to the button that asked (useDialogFocus).
 *
 * The page's own keys -- R and N on the report, P, the table's, Escape for the
 * panel behind -- are listeners on `window`. The browser's dialog stopped the
 * page, so none of them could fire under a question; this one stops the key
 * on its way there instead.
 *
 * It borrows the error screen's panel and button row: the same surface, text
 * and button colours, with only the layer in front of the page its own.
 */
function Question({ message }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef, cancelRef);
  const onKeyDown = (event) => {
    event.stopPropagation();
    if (event.key !== "Escape") return trapTab(event);
    event.preventDefault();
    return answerConfirm(false);
  };
  return (
    // A press on the layer is not an answer, and must not take focus out of the dialog.
    <div className="confirm-layer" onMouseDown={(event) => event.target === event.currentTarget && event.preventDefault()}>
      <div
        ref={dialogRef}
        className="error-panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-message"
        data-testid="confirm-dialog"
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <p id="confirm-message" data-testid="confirm-message">{message}</p>
        <div className="error-actions">
          <button type="button" className="ghost" data-testid="confirm-yes" onClick={() => answerConfirm(true)}>
            확인
          </button>
          <button ref={cancelRef} type="button" data-testid="confirm-no" onClick={() => answerConfirm(false)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

/** Mounted once, outside the error boundary: the error screen asks a question too. */
export function ConfirmDialog() {
  const [message, setMessage] = useState(null);
  useEffect(() => mountConfirmHost(setMessage), []);
  return message === null ? null : <Question message={message} />;
}
