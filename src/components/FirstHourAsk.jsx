import { useEffect, useRef, useState } from "react";
import revealCopy from "../copy/reveal.js";
import { fill } from "../locale.js";
import { AGAIN_SCALE, answer, canAsk, LOST_ANSWERS, markAsked } from "../firstHourLog.js";
import { FIRST_CASE } from "../gameEvents.js";

/**
 * 첫 30분 자동 기록's two questions (firstHourLog.js decides who is asked):
 * `lost`, 「무엇을 잃었나요?」 on the verdict sheet of the first BUST, and
 * `again`, 「다음에 또 켤 것 같나요?」 0 to 10 on 프롤로그 01's report. Taps only,
 * each with 건너뛰기, asked once per device. It never takes the focus when it
 * appears -- the sheet's 「다음 판」 and the report's next case keep it -- and
 * the way on works whether it is answered or not. Drawn in the between-hands
 * question's quiet row (pulse.css).
 */
export function FirstHourAsk({ kind }) {
  const [asking] = useState(() => canAsk(kind));
  const [done, setDone] = useState(false);
  const thanksRef = useRef(null);
  useEffect(() => {
    if (asking) markAsked(kind);
  }, [asking, kind]);
  // The pressed button is gone: the focus goes to the line that took its place.
  useEffect(() => {
    if (done) thanksRef.current?.focus({ preventScroll: true });
  }, [done]);
  if (!asking) return null;
  const words = revealCopy.firstHour;
  const question = kind === "lost" ? words.lost : words.again;
  const choose = (value) => {
    answer(kind, value);
    setDone(true);
  };
  if (done) {
    return (
      <div className="gx-pulse" data-testid={`first-hour-${kind}`}>
        <p ref={thanksRef} tabIndex={-1} className="gx-pulse-thanks" role="status">{words.thanks}</p>
      </div>
    );
  }
  return (
    <div className="gx-pulse" data-testid={`first-hour-${kind}`} role="group" aria-label={question}>
      <span>{question}{kind === "again" && <small> {words.againEnds}</small>}</span>
      <div className="gx-pulse-answers">
        {kind === "lost"
          ? LOST_ANSWERS.map((value) => (
              <button key={value} type="button" data-testid={`first-hour-lost-${value}`} onClick={() => choose(value)}>
                {words.lostAnswers[value]}
              </button>
            ))
          : AGAIN_SCALE.map((value) => (
              <button key={value} type="button" data-testid={`first-hour-again-${value}`} aria-label={fill(words.againScore, { n: value })} style={{ flex: "1 0 44px", minWidth: 44, padding: 0 }} onClick={() => choose(value)}>
                {value}
              </button>
            ))}
        <button type="button" data-testid={`first-hour-${kind}-skip`} onClick={() => choose("skip")}>
          {words.skip}
        </button>
      </div>
    </div>
  );
}

/** The report's place for `again`: 프롤로그 01's report only (runtimeRenderers.jsx, under the act line). */
export function FirstHourResult({ caseId }) {
  return caseId === FIRST_CASE ? <FirstHourAsk kind="again" /> : null;
}
