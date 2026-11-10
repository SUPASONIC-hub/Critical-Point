/**
 * The gauge under a held 확정 (useHoldConfirm.js): a line that fills in the
 * 0.6s the hold takes, shows a short stub after a press that let go too
 * soon (the hint), and sits at a stub while a screen reader's first tap waits
 * for its second. The phase does the drawing (play.css, `.gx-hold`); the
 * line is decoration and the button's text and description say the rule.
 */
export function HoldGauge({ phase }) {
  return <i className="gx-hold" data-phase={phase} aria-hidden="true" />;
}
