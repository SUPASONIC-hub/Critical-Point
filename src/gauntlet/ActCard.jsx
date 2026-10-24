import { useEffect, useRef } from "react";
import { ACT_CARD_MS, ACT_CARDS, casesLeft } from "./actCardCopy.js";
import { useDialogFocus } from "./useDialogFocus.js";

// Keys that are not a press: a modifier on its own, or Tab, which walks the card.
const NOT_A_PRESS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"]);

/** The act title card (actCardCopy.js says what it shows and how it goes). */
export function ActCard({ caseId, onDone }) {
  const card = ACT_CARDS[caseId];
  const dialogRef = useRef(null);
  const goRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef, goRef);
  useEffect(() => {
    // A case with no card goes straight on.
    const timer = globalThis.setTimeout(onDone, card ? ACT_CARD_MS : 0);
    return () => globalThis.clearTimeout(timer);
    // One card, one clock: the card is mounted once per act.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!card) return null;
  const onKeyDown = (event) => {
    if (event.key === "Tab") return trapTab(event);
    if (NOT_A_PRESS.has(event.key) || event.repeat || event.isComposing) return;
    event.preventDefault();
    event.stopPropagation();
    onDone();
  };
  return (
    <div className="gx-act" data-testid="act-card" data-case={caseId} onClick={onDone}>
      <div
        ref={dialogRef}
        className="gx-act-page"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gx-act-title"
        aria-describedby="gx-act-text"
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <p className="gx-act-kicker">
          {card.act}막 · {card.span}
        </p>
        <h2 id="gx-act-title" className="gx-act-title">
          「{card.name}」
        </h2>
        <p id="gx-act-text" className="gx-act-line">
          {card.line}
          <span className="gx-act-left"> 이 사건부터 마지막 사건까지 {casesLeft(caseId)}개.</span>
        </p>
        <button ref={goRef} type="button" className="gx-act-go" data-testid="act-card-continue" style={{ "--act-wait": `${ACT_CARD_MS}ms` }}>
          계속
        </button>
      </div>
    </div>
  );
}
