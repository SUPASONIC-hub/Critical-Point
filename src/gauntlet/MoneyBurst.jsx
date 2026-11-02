import { useLayoutEffect, useRef } from "react";

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
