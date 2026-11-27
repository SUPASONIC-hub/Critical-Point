import { useEffect, useRef } from "react";
import { formatMoney } from "../gameConstants.js";
import { payCaseHarm } from "../gauntlet/gauntletEngine.js";
import { countCovers, coverCase, readPayOffer } from "../gauntlet/settlementPay.js";
import resultCopy from "../copy/result.js";
import { fill } from "../locale.js";

/**
 * G34 보상금 (RULES_MARK 9, settlementPay.js) on a case's result page: the
 * case closed on people hurt, and the KD은행 계좌 can pay it off before the
 * next case opens -- the harm wiped from the season's tally, a cover kept.
 * Once paid, the line says what was paid. Nothing on a case that cannot be.
 * A replay hands its lent run back as it closes, so on its report the run is
 * no longer practice: the closing entry's `firstRecord` says it was, as the
 * audit ledger reads it (auditRisk.js describeAuditLedger).
 *
 * The status span is the line's first child either way, so React keeps the
 * one node from the offer to the paid line and a screen reader hears the
 * payment once, as it lands (a polite live region that was there before).
 *
 * The press takes its button away, so focus would drop to <body>. It goes on
 * to the page's next step instead -- the next case's button, or the case's
 * title (tabIndex -1, the scene-focus target) on a report with no next case --
 * never to the paid line itself, which would read the payment a second time
 * over the live region.
 */
export function CaseCover({ caseId, caseResults, run, log = [], onApply, locked = false }) {
  const covered = caseResults?.[caseId]?.covered;
  const say = resultCopy.cover;
  const lineRef = useRef(null);
  const justPaid = useRef(false);
  useEffect(() => {
    if (!covered || !justPaid.current) return;
    justPaid.current = false;
    const page = lineRef.current?.closest(".result-page");
    const next = page?.querySelector("[data-testid='next-case-button']") ?? lineRef.current?.closest(".outcome-panel")?.querySelector("h2[tabindex='-1']");
    next?.focus({ preventScroll: true });
  }, [covered]);
  if (covered) {
    return <p ref={lineRef} className="case-cover" data-testid="case-cover"><span role="status" aria-live="polite" aria-atomic="true" data-testid="case-cover-status">{fill(say.paid, { cost: formatMoney(covered.cost), harm: covered.harm, covers: countCovers(caseResults) })}</span></p>;
  }
  const offer = readPayOffer({ caseId, caseResults, vault: run?.vault, story: run?.story === true, practice: Boolean(run?.practice) || log.some((entry) => entry?.threshold?.firstRecord) });
  if (!offer) return null;
  const pay = () => {
    if (locked || !offer.afford) return;
    justPaid.current = true;
    onApply({ caseResults: { ...caseResults, [caseId]: coverCase(caseResults[caseId], offer) }, gauntletRun: payCaseHarm(run, offer) });
  };
  return (
    <p ref={lineRef} className="case-cover" data-testid="case-cover">
      <span role="status" aria-live="polite" aria-atomic="true" data-testid="case-cover-status" />
      <span>{fill(say.offer, { cost: formatMoney(offer.cost), harm: offer.harm })}</span>{" "}
      <button type="button" className="ghost" data-testid="case-cover-pay" aria-disabled={offer.afford ? undefined : "true"} onClick={pay}>
        {offer.afford ? say.pay : say.short}
      </button>{" "}
      <small>{say.record}</small>
    </p>
  );
}
