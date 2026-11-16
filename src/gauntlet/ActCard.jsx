import { useEffect, useRef, useState } from "react";
import { ACT_CARD_MS, ACT_CARDS, ACT_TALLY_CASES, casesLeft } from "./actCardCopy.js";
import { quietImport } from "../state/chunkReload.js";
import { useDialogFocus } from "./useDialogFocus.js";
import actCardCopy from "../copy/actCard.js";
import { fill } from "../locale.js";

// Keys that are not a press: a modifier on its own, or Tab, which walks the card.
const NOT_A_PRESS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"]);

/** The act title card (actCardCopy.js says what it shows and how it goes). */
export function ActCard({ caseId, onDone }) {
  const card = ACT_CARDS[caseId];
  const dialogRef = useRef(null);
  const goRef = useRef(null);
  const trapTab = useDialogFocus(dialogRef, goRef);
  // N1: the three cards after 프롤로그, 사건 18 and 사건 36 carry the 중간 결산,
  // a chunk of its own. A chunk that does not come leaves the plain card.
  const tallied = Boolean(card) && ACT_TALLY_CASES.includes(caseId);
  const [Tally, setTally] = useState(null);
  useEffect(() => {
    if (tallied) quietImport(() => import("./ActTally.jsx")).then((module) => setTally(() => module.default), () => {});
    // A case with no card goes straight on; a tallied one waits for 계속.
    const timer = tallied ? null : globalThis.setTimeout(onDone, card ? ACT_CARD_MS : 0);
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
    <div className={tallied ? "gx-act gx-act-tallied" : "gx-act"} data-testid="act-card" data-case={caseId} onClick={onDone}>
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
          {fill(actCardCopy.kicker, { act: card.act, span: card.span })}
        </p>
        <h2 id="gx-act-title" className="gx-act-title">
          {fill(actCardCopy.title, { name: card.name })}
        </h2>
        <p id="gx-act-text" className="gx-act-line">
          {card.line}
          <span className="gx-act-left">{fill(actCardCopy.left, { count: casesLeft(caseId) })}</span>
        </p>
        {Tally && <Tally caseId={caseId} />}
        <button ref={goRef} type="button" className="gx-act-go" data-testid="act-card-continue" style={tallied ? undefined : { "--act-wait": `${ACT_CARD_MS}ms` }}>
          {actCardCopy.go}
        </button>
      </div>
    </div>
  );
}
