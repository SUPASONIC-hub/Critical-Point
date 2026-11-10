import { describeAuditLedger } from "./auditRisk.js";
import { createGauntletLedger } from "./gauntletEngine.js";
import { normalizeRelicIds, RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { formatMultiplier, formatNumber } from "./tableReadout.js";
import { objectParticle } from "../playerLanguage.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

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
  const potLost = formatNumber(ledger.potLost);
  const note = ledger.busts > 0
    ? fill(say.lost, { busts: ledger.busts, pot: potLost, particle: objectParticle(potLost) })
    : ledger.cashes > 0
      ? say.clean
      : say.unplayed;
  const audit = describeAuditLedger(log, summary, caseId);
  return (
    <section className="pressure-ledger" aria-label={say.title}>
      <div className="panel-title-row">
        <h2>{say.title}</h2>
        <span>{say.subtitle}</span>
      </div>
      <div className="pressure-ledger-grid">
        <article>
          <span>{say.vault}</span>
          <b className={vault > 0 ? "gain" : ""}>{formatNumber(vault)}</b>
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
          <b className={ledger.grooveBanked > 0 ? "gain" : ""}>{formatNumber(ledger.grooveBanked)}</b>
          <small>{say.comboShare}</small>
        </article>
        <article>
          <span>{say.potLost}</span>
          <b className={ledger.potLost > 0 ? "cost" : ""}>{formatNumber(ledger.potLost)}</b>
          <small>{fill(say.potBanked, { pot: formatNumber(ledger.potBanked) })}</small>
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
