import { describeAuditLedger } from "./auditRisk.js";
import { createGauntletLedger } from "./gauntletEngine.js";
import { normalizeRelicIds, RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { formatMultiplier, formatMoney } from "./tableReadout.js";
import { objectParticle } from "../playerLanguage.js";
import { MONEY_READ_AS } from "../gameConstants.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";
import { SIGN_CHIPS } from "./nextTableRules.js";

// The record's words (src/copy/table.js).
const say = tableCopy.ledger;

/**
 * The case's table record: what went into the vault, what the walls took, and
 * the hottest pot cashed. Rebuilt from the log, which is what a resumed save
 * restores. In a case that counts the audit (B3) the sentence under it gains
 * one more, how many marks the case closed with (auditRisk.js).
 */
export function GauntletLedger({ log = [], summary = null, caseId = null }) {
  const ledger = createGauntletLedger(log);
  const vault = Number(summary?.vault) || 0;
  const relics = normalizeRelicIds(summary?.relics);
  const potLost = formatMoney(ledger.potLost);
  const note = ledger.busts > 0
    ? fill(say.lost, { busts: ledger.busts, pot: potLost, particle: objectParticle(MONEY_READ_AS) })
    : ledger.cashes > 0
      ? say.clean
      : say.unplayed;
  const audit = describeAuditLedger(log, summary, caseId);
  // G6: the case's 결재 판, the last board, drawn larger than the rest.
  const sign = log.findLast((entry) => entry?.threshold?.sign === true)?.threshold ?? null;
  return (
    <section className="pressure-ledger" aria-label={say.title}>
      <div className="panel-title-row">
        <h2>{say.title}</h2>
        <span>{say.subtitle}</span>
      </div>
      {sign && (
        <article className={`pressure-ledger-sign${sign.busted ? " is-bust" : ""}`} data-testid="ledger-sign">
          <span>{say.sign}</span>
          <b className={sign.busted ? "cost" : "gain"}>
            {sign.busted ? fill(say.signBust, { pot: formatMoney(Number(sign.lostPot) || 0) }) : fill(say.signCash, { multiplier: formatMultiplier(Number(sign.potMultiplier) || 1), pot: formatMoney(Number(sign.pot) || 0) })}
          </b>
          <small>{fill(say.signNote, { chips: SIGN_CHIPS })}</small>
        </article>
      )}
      <div className="pressure-ledger-grid">
        <article>
          <span>{say.vault}</span>
          <b className={vault > 0 ? "gain" : ""}>{formatMoney(vault)}</b>
          <small>{say.season}</small>
        </article>
        <article>
          <span>{say.best}</span>
          <b>{formatMultiplier(ledger.bestMultiplier)}</b>
          <small>{fill(say.cashes, { count: ledger.cashes })}</small>
        </article>
        <article>
          <span lang="en">BUST</span>
          <b className={ledger.busts > 0 ? "cost" : ""}>{ledger.busts}</b>
          <small>{fill(say.pushes, { count: ledger.pushes })}</small>
        </article>
        <article>
          <span>{say.combo}</span>
          <b className={ledger.bestLogic > 0 ? "gain" : ""}>{ledger.bestLogic}</b>
          <small>{say.caseBest}</small>
        </article>
        <article>
          <span>{say.comboPot}</span>
          <b className={ledger.grooveBanked > 0 ? "gain" : ""}>{formatMoney(ledger.grooveBanked)}</b>
          <small>{say.comboShare}</small>
        </article>
        <article>
          <span>{say.potLost}</span>
          <b className={ledger.potLost > 0 ? "cost" : ""}>{formatMoney(ledger.potLost)}</b>
          <small>{fill(say.potBanked, { pot: formatMoney(ledger.potBanked) })}</small>
        </article>
      </div>
      <p className="pressure-ledger-note">{audit ? `${note} ${audit}` : note}</p>
      {relics.length > 0 && (
        <p className="pressure-ledger-relics" data-testid="ledger-relics">
          <span>{say.relics}</span>
          {relics.map((id) => (
            <b key={id}>
              <RelicIcon id={id} size={12} /> {RELICS[id].name}
              <span className="sr-only">: {RELICS[id].text}</span>
            </b>
          ))}
        </p>
      )}
    </section>
  );
}
