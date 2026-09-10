import { createPressureLedger, REBOOT_PERMANENT_BONUS, usePressure } from "../state/decisionDynamics.js";

/**
 * What pushing the window has actually earned, and what surviving a bust left
 * behind.
 *
 * The reducer has been banking three run-level numbers since the gauntlet loop
 * landed -- reboots, the permanent multiplier they buy, and the resources the
 * push multiplier added -- and the player has never seen one of them. A run that
 * busts and reboots reads as pure loss at the moment it happens, which is the
 * one moment a roguelike cannot afford to look like pure loss.
 *
 * The ledger is rebuilt from the decision log rather than read off the reducer.
 * The log is what survives a reload; the reducer's own state does not, so a
 * ledger read from it would quietly zero itself the first time someone resumed
 * a saved run. Both the derivation and the reboot bonus live in
 * decisionDynamics, so the reducer and this panel cannot disagree about what a
 * reboot was worth.
 */

function ledgerNote(ledger) {
  if (ledger.reboots > 0) {
    return `임계점을 ${ledger.busts}번 넘겨 시스템이 ${ledger.reboots}번 리부트됐습니다. 그 대가로 남은 영구 배율 ×${ledger.permanentMultiplier}는 회수되지 않습니다.`;
  }
  if (ledger.pushedDecisions > 0) {
    return `아직 한 번도 터지지 않았습니다. 게이지를 더 쥐고 있을수록 확정 이득이 커지지만, 넘기면 점수의 절반과 콤보를 잃습니다.`;
  }
  return `아직 임계 보너스를 받은 결정이 없습니다. 판단을 늦게 확정할수록 이득에 배율이 붙고, 리부트마다 영구 배율 +${REBOOT_PERMANENT_BONUS}가 남습니다.`;
}

export function PressureLedger({ log = [], showLive = false }) {
  const pressure = usePressure();
  const ledger = createPressureLedger(log);

  return (
    <section className="pressure-ledger" aria-label="임계점 장부">
      <div className="panel-title-row">
        <h2>임계점 장부</h2>
        <span>밀어붙여서 번 것과, 터져서 남은 것</span>
      </div>
      <div className="pressure-ledger-grid">
        <article>
          <span>영구 배율</span>
          <b className={ledger.permanentMultiplier > 1 ? "gain" : ""}>×{ledger.permanentMultiplier}</b>
          <small>리부트 {ledger.reboots}회</small>
        </article>
        <article>
          <span>임계 보너스</span>
          <b className={ledger.bonusPoints > 0 ? "gain" : ""}>+{ledger.bonusPoints}</b>
          <small>결정 {ledger.pushedDecisions}건에 적용</small>
        </article>
        <article>
          <span>최고 배율</span>
          <b>×{ledger.bestMultiplier}</b>
          <small>이번 런 최고점</small>
        </article>
        <article>
          <span>임계 초과</span>
          <b className={ledger.busts > 0 ? "cost" : ""}>{ledger.busts}</b>
          <small>점수 절반 소각</small>
        </article>
      </div>
      {showLive && (
        <p className="pressure-ledger-live">
          현재 창 <b>{pressure.stressLevel}%</b> · 지금 지르면 <b>×{pressure.rewardMultiplier.toFixed(2)}</b>
        </p>
      )}
      <p className="pressure-ledger-note">{ledgerNote(ledger)}</p>
    </section>
  );
}
