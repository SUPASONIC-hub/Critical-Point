import { useLayoutEffect, useRef, useState } from "react";
import { readPurse } from "./moneyFeedback.js";
import tableCopy from "../copy/table.js";

/**
 * The hand's amount, thrown at the middle of the screen by the slam: it swells,
 * holds, and flies into the KD은행 계좌 (`BankPurse`; `readBurst`, moneyFeedback.js).
 * The flight is measured, not guessed: the account is a band on a phone and a
 * corner box on a wide screen, so the distance from here to it is read before the first
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
    // An account that is not drawn has no place to fly to.
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
 * The KD은행 계좌: what the run holds, pinned to the screen through every
 * part of a window -- the briefing page, the table, the slam and the reveal
 * after it, the relic draft -- so the balance is never something to look for.
 * A one-line band across the top of a phone, a box in the top-right corner
 * of a wide screen (money.css). The bust or cash amount flies into it.
 *
 * It holds the balance, the last hand's change ("방금", its sign is read, its
 * arrow is not) and, a tap away, the season's won and lost (`readPurse`). On a
 * closed window (`settling`) it already shows the values the settle will
 * leave. No live region: the slam says the verdict once, and this is here
 * when looked for. Built so a later spend of the balance (the relic draft's
 * reroll, after W47) lands its change here the same way.
 */
// The season's columns stay as the player left them from one window to the next.
let seasonShown = false;

export function BankPurse({ purseRef, ...read }) {
  const purse = readPurse(read);
  const [open, setOpen] = useState(seasonShown);
  const toggle = () => {
    seasonShown = !open;
    setOpen(seasonShown);
  };
  return (
    <div className={`gx-purse kd-account${purse.landing ? ` is-landing is-${purse.landing}` : ""}${open ? " is-open" : ""}`} data-testid="gauntlet-purse">
      <button type="button" className="kd-account-head" aria-expanded={open} aria-controls="kd-account-season" onClick={toggle}>
        <small className="kd-account-name">{tableCopy.stage.purse}</small>
        <strong ref={purseRef} data-testid="gauntlet-purse-total">{purse.totalText}</strong>
        {purse.change && (
          <>
            <small className="kd-account-just" aria-hidden="true">{tableCopy.stage.purseJust}</small>
            <span className={`gx-purse-change is-${purse.change.dir}`} data-testid="gauntlet-purse-change">
              <span aria-hidden="true">{purse.change.arrow} {purse.change.text}</span>
              <span className="sr-only">{purse.change.spoken}</span>
            </span>
          </>
        )}
        <i className="kd-account-more" aria-hidden="true" />
      </button>
      <small id="kd-account-season" className="gx-purse-season" data-testid="gauntlet-purse-season" hidden={!open}>{purse.season.text}</small>
    </div>
  );
}
