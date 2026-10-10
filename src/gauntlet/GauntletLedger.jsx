import { createGauntletLedger } from "./gauntletEngine.js";
import { normalizeRelicIds, RELICS } from "./relics.js";
import { RelicIcon } from "./RelicDraft.jsx";
import { formatNumber } from "../gameConstants.js";
import { objectParticle } from "../playerLanguage.js";

/**
 * The case's table record: what went into the vault, what the walls took, and
 * the hottest pot cashed. Rebuilt from the log, which is what a resumed save
 * restores.
 */
export function GauntletLedger({ log = [], summary = null }) {
  const ledger = createGauntletLedger(log);
  const vault = Number(summary?.vault) || 0;
  const relics = normalizeRelicIds(summary?.relics);
  const potLost = formatNumber(ledger.potLost);
  const note = ledger.busts > 0
    ? `벽에 ${ledger.busts}번 부딪혀 판돈 ${potLost}${objectParticle(potLost)} 잃었다. 금고에 들어간 것만 남는다.`
    : ledger.cashes > 0
      ? "한 번도 터지지 않았다. 더 밀 수 있었는지는 벽만 안다."
      : "아직 테이블에 앉지 않았다.";
  return (
    <section className="pressure-ledger" aria-label="테이블 장부">
      <div className="panel-title-row">
        <h2>테이블 장부</h2>
        <span>금고로 들어간 것과, 벽이 가져간 것</span>
      </div>
      <div className="pressure-ledger-grid">
        <article>
          <span>금고</span>
          <b className={vault > 0 ? "gain" : ""}>{formatNumber(vault)}</b>
          <small>시즌 누적</small>
        </article>
        <article>
          <span>최고 배율</span>
          <b>×{formatNumber(ledger.bestMultiplier)}</b>
          <small>확정 {ledger.cashes}회</small>
        </article>
        <article>
          <span lang="en">BUST</span>
          <b className={ledger.busts > 0 ? "cost" : ""}>{ledger.busts}</b>
          <small>밀어붙임 {ledger.pushes}회</small>
        </article>
        <article>
          <span>논리 콤보</span>
          <b className={ledger.bestLogic > 0 ? "gain" : ""}>{ledger.bestLogic}</b>
          <small>이 사건 최고</small>
        </article>
        <article>
          <span>콤보 판돈</span>
          <b className={ledger.grooveBanked > 0 ? "gain" : ""}>{formatNumber(ledger.grooveBanked)}</b>
          <small>콤보가 얹은 몫</small>
        </article>
        <article>
          <span>잃은 판돈</span>
          <b className={ledger.potLost > 0 ? "cost" : ""}>{formatNumber(ledger.potLost)}</b>
          <small>번 판돈 {formatNumber(ledger.potBanked)}</small>
        </article>
      </div>
      <p className="pressure-ledger-note">{note}</p>
      {relics.length > 0 && (
        <p className="pressure-ledger-relics" data-testid="ledger-relics">
          <span>장착한 도구</span>
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
