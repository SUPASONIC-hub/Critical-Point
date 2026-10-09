import { useEffect, useRef, useState } from "react";

import { copyText } from "../appConfig.js";
import { buildResultCardModel, buildShareText, renderResultCardFile, shareOrSave } from "../resultCard.js";
import { RESULT_CARD_COPY, RESULT_CARD_STATUS } from "../resultCardCopy.js";

const IDLE_TIMEOUT_MS = 1500;

/**
 * Whether this platform's share sheet takes a PNG. Asked with an empty file
 * before the card exists, so the row of buttons is whole from the start and
 * does not change under a thumb.
 */
function canShareImages() {
  try {
    return Boolean(navigator.canShare?.({ files: [new File([], "card.png", { type: "image/png" })] }));
  } catch {
    return false;
  }
}

/**
 * The season's result card, offered where the record opens: 결과 카드 공유 where
 * the platform can share a picture, 결과 카드 저장 everywhere.
 *
 * The card is made as soon as this is on the page, in idle time and before any
 * press, because iOS only opens a share sheet -- or starts a download -- from
 * inside the press itself: a press that first had to draw the card would have
 * spent its permission by the time the picture existed. Until the file is held
 * the buttons say they are not ready (`aria-disabled`, still in the tab order).
 *
 * This file and everything that draws the card are one chunk, fetched when the
 * ending opens (`EndingSequence.jsx`) and not with the report: the report's
 * chunk had no room for them, and a player who never reaches the ending does
 * not download them.
 *
 * `card` is the four things a card is made from and nothing else: the 판단
 * DNA, the ending, what a sentence calls that ending, and the case summaries.
 * The report screen picks them out of its view (`ResultScreen.jsx`), so who
 * played and what they wrote never reach this chunk. It was the whole view for
 * a day, while the report's chunk had no bytes left to pick with.
 *
 * @param {{ card: { fingerprint?: object, endingVariant?: object, endingName?: string, caseResults?: object } }} props
 */
export default function ResultCardShare({ card }) {
  const [shareable] = useState(canShareImages);
  // null while the card is being made, `{ file, text }` once it is held, false
  // when it could not be made.
  const [held, setHeld] = useState(null);
  const [said, setSaid] = useState("");
  // The first render's, kept: the screen builds the object anew each render.
  const input = useRef(card);
  const run = useRef(0);

  /** Makes the card, and resolves to it only if this is still the latest attempt on a mounted screen. */
  async function make() {
    const attempt = (run.current += 1);
    setHeld(null);
    const model = buildResultCardModel({ ...input.current, host: window.location.host });
    const file = await renderResultCardFile(model, { document });
    if (attempt !== run.current) return null;
    const made = file ? { file, text: buildShareText(model, window.location.origin) } : false;
    setHeld(made);
    setSaid(made ? "" : RESULT_CARD_COPY.failed);
    return made;
  }

  /** Hands the held file to the share sheet or the download, inside the press. */
  function send(ready, navigatorRef) {
    const attempt = run.current;
    shareOrSave({ ...ready, navigator: navigatorRef, document, copyText }).then((outcome) => {
      if (attempt !== run.current) return;
      setSaid(RESULT_CARD_STATUS[outcome]);
      // A file that would not leave is drawn again on the next press.
      if (outcome === "failed") setHeld(false);
    });
  }

  function press(navigatorRef) {
    if (held) send(held, navigatorRef);
    // After a failure the press makes the card again, and then does what it was pressed for.
    else if (held === false) make().then((ready) => ready && send(ready, navigatorRef));
  }

  useEffect(() => {
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle ? window.requestIdleCallback(make, { timeout: IDLE_TIMEOUT_MS }) : window.setTimeout(make, 200);
    return () => {
      // Whatever is still under way finds a newer attempt number and stops.
      run.current += 1;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
    // Once, when the record opens: the season is over and the card cannot change.
  }, []);

  const waiting = held === null || undefined;
  return (
    <>
      {/* `.feedback-actions` is the report's row of buttons: it lays these two
          side by side and dims a button that is not ready. */}
      <div className="feedback-actions">
        {shareable && (
          <button type="button" aria-disabled={waiting} onClick={() => press(navigator)}>
            {RESULT_CARD_COPY.shareLabel}
          </button>
        )}
        <button type="button" aria-disabled={waiting} onClick={() => press(null)}>
          {RESULT_CARD_COPY.saveLabel}
        </button>
      </div>
      <small>
        {RESULT_CARD_COPY.note}{" "}
        {/* On the page with the buttons, so what it comes to say is news. */}
        <span role="status" aria-live="polite" aria-atomic="true">
          {waiting ? RESULT_CARD_COPY.making : said}
        </span>
      </small>
    </>
  );
}
