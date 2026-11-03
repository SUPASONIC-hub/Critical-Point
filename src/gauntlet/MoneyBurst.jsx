import { useLayoutEffect, useRef } from "react";
import { readPurse } from "./moneyFeedback.js";
import tableCopy from "../copy/table.js";

/**
 * The hand's amount, thrown at the middle of the screen by the slam: it swells,
 * holds, and flies into the bank rail's purse (`readBurst`, moneyFeedback.js).
 * The flight is measured, not guessed: the purse moves with the width and with
 * the rail's wrapping, so the distance from here to it is read before the first
 * paint and handed to the keyframes as two custom properties. With no purse on
 * the page, or none drawn, the amount fades where it stands.
 *
 * With reduced motion, or the calm-effects setting, the animation is off
 * (money.css, comfort.css) and the amount simply stands there, large.
 *
 * `spoken` false hides it from the alert it sits in: a bust's sentence already
 * says the pot before and after, and the −N would say it twice.
 */
export function MoneyBurst({ burst, target, spoken = true }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const node = ref.current;
    const goal = target?.current;
    if (!node || !goal) return;
    const from = node.getBoundingClientRect();
    const to = goal.getBoundingClientRect();
    // A rail that is not drawn (a phone on its side under 340px) has no place to fly to.
    if (!to.width) return;
    node.style.setProperty("--gx-fly-x", `${Math.round(to.left + to.width / 2 - (from.left + from.width / 2))}px`);
    node.style.setProperty("--gx-fly-y", `${Math.round(to.top + to.height / 2 - (from.top + from.height / 2))}px`);
  }, [burst, target]);
  if (!burst) return null;
  return (
    <b ref={ref} className={`gx-burst is-${burst.dir}`} data-testid="gauntlet-burst" aria-hidden={spoken ? undefined : "true"}>
      {burst.text}
    </b>
  );
}

/**
 * The bank rail's head, where that amount lands: what the run holds, the last
 * hand's change -- its sign is read, its arrow is not -- and the season's won
 * and lost (`readPurse`). On a closed window (`settling`) it already shows the
 * values the settle will leave. No live region: the slam says the verdict
 * once, and this is here when looked for.
 */
export function BankPurse({ purseRef, ...read }) {
  const purse = readPurse(read);
  return (
    <div ref={purseRef} className={`gx-purse${purse.landing ? ` is-landing is-${purse.landing}` : ""}`} data-testid="gauntlet-purse">
      <small>{tableCopy.stage.purse}</small>
      <strong data-testid="gauntlet-purse-total">{purse.totalText}</strong>
      {purse.change && (
        <span className={`gx-purse-change is-${purse.change.dir}`} data-testid="gauntlet-purse-change">
          <span aria-hidden="true">{purse.change.arrow} {purse.change.text}</span>
          <span className="sr-only">{purse.change.spoken}</span>
        </span>
      )}
      <small className="gx-purse-season" data-testid="gauntlet-purse-season">{purse.season.text}</small>
    </div>
  );
}
