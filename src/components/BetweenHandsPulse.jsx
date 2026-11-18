import { useState } from "react";
import revealCopy from "../copy/reveal.js";

/**
 * N22: 「여기까지 어땠나요?」 and three buttons, on one sheet between two hands
 * of 프롤로그 01·02, once a season (state/betweenHandsPulse.js decides when).
 * One press sends and the buttons give way to one line; not pressing is an
 * answer too -- the sheet's own 「다음 판」 goes on as always.
 */
export function BetweenHandsPulse({ pulse, onAnswer }) {
  const [state, setState] = useState("ask");
  if (!pulse || typeof onAnswer !== "function") return null;
  const words = revealCopy.pulse;
  const answer = (value) => {
    if (state !== "ask") return;
    setState("sending");
    Promise.resolve(onAnswer(pulse, value))
      .then((result) => setState(result === "dropped" ? "ask" : "done"))
      .catch(() => setState("done"));
  };
  return (
    <div className="gx-pulse" data-testid="between-hands-pulse" role="group" aria-label={words.question}>
      {state === "done" ? (
        <p className="gx-pulse-thanks" role="status">{words.thanks}</p>
      ) : (
        <>
          <span>{words.question}</span>
          <div className="gx-pulse-answers">
            {["fun", "hard", "long"].map((value) => (
              <button key={value} type="button" data-testid={`pulse-${value}`} disabled={state !== "ask"} onClick={() => answer(value)}>
                {words.answers[value]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
