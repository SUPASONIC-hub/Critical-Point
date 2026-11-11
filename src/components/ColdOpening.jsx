import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { fill, LANG } from "../locale.js";
import { markColdOpeningSeen } from "../state/coldOpening.js";
import { coldOpeningCopy } from "./coldOpeningCopy.js";
import "./ColdOpening.css";

/**
 * B-3(1) 냉정한 오프닝 (draft, behind COLD_OPENING_ENABLED): four panels with
 * no table and no clock, read at the player's own pace, then 「3년 전」 and the
 * prologue. It is drawn in the opening burst's own frame (`.opening-burst`),
 * plus ColdOpening.css, which ships only in this page's lazy chunk. `onDone` is the start button's own press
 * (IntroScreen: the burst, then `startGame`), called from the last panel's
 * button or from 건너뛰기 -- both inside a press, so the burst's sound still
 * starts on a user gesture.
 */
export default function ColdOpening({ startLabel, onDone }) {
  const words = coldOpeningCopy(LANG);
  const [at, setAt] = useState(0);
  const buttonRef = useRef(null);
  const panel = words.panels[at];
  const last = at === words.panels.length - 1;
  useEffect(() => {
    buttonRef.current?.focus();
  }, [at]);
  const finish = () => {
    markColdOpeningSeen();
    onDone();
  };
  return (
    <div className="opening-burst cold-opening" data-testid="cold-opening" data-panel={at} role="dialog" aria-modal="true" aria-labelledby="cold-opening-caption">
      <div className="opening-burst-grid" />
      <div className="opening-burst-panel">
        <span lang="en">
          {words.label} · {fill(words.step, { at: at + 1, total: words.panels.length })}
        </span>
        <strong id="cold-opening-caption">{panel.caption}</strong>
        <p data-testid="cold-opening-text">{panel.text}</p>
        <i />
        <div className="cold-opening-actions">
          <button
            ref={buttonRef}
            type="button"
            className="cold-opening-go"
            data-testid={last ? "cold-opening-start" : "cold-opening-next"}
            onClick={last ? finish : () => setAt(at + 1)}
          >
            <ChevronRight size={18} />
            {last ? startLabel : words.next}
          </button>
          {!last && (
            <button type="button" className="ghost" data-testid="cold-opening-skip" onClick={finish}>
              {words.skip}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
