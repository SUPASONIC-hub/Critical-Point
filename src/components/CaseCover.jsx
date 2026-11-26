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
 */
export function CaseCover({ caseId, caseResults, run, log = [], onApply, locked = false }) {
  const covered = caseResults?.[caseId]?.covered;
  const say = resultCopy.cover;
  if (covered) {
    return <p className="case-cover" data-testid="case-cover">{fill(say.paid, { cost: formatMoney(covered.cost), harm: covered.harm, covers: countCovers(caseResults) })}</p>;
  }
  const offer = readPayOffer({ caseId, caseResults, vault: run?.vault, story: run?.story === true, practice: Boolean(run?.practice) || log.some((entry) => entry?.threshold?.firstRecord) });
  if (!offer) return null;
  const pay = () => {
    if (locked || !offer.afford) return;
    onApply({ caseResults: { ...caseResults, [caseId]: coverCase(caseResults[caseId], offer) }, gauntletRun: payCaseHarm(run, offer) });
  };
  return (
    <p className="case-cover" data-testid="case-cover">
      <span>{fill(say.offer, { cost: formatMoney(offer.cost), harm: offer.harm })}</span>{" "}
      <button type="button" className="ghost" data-testid="case-cover-pay" aria-disabled={offer.afford ? undefined : "true"} onClick={pay}>
        {offer.afford ? say.pay : say.short}
      </button>{" "}
      <small>{say.record}</small>
    </p>
  );
}
