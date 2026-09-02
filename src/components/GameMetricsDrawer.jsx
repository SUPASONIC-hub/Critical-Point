
import { Check, Shield } from "lucide-react";
import { GuardedButton } from "./GuardedButton.jsx";

export function GameMetricsDrawer({
  riskTier,
  easyRiskLabels,
  riskPressure,
  activeBonus,
  freeTextCombo,
  currentAverageResponseTime,
  progress,
  log,
  clueCount,
  discoveredClues,
  currentChallengeStreak,
  momentumTier,
  streakGoal,
  streakRemaining,
  momentumScore,
  decisionSeconds,
  protocolUsed,
  isAdvancing,
  activateCrisisProtocol,
  decisionFingerprint,
  decisionLedger,
  resourceMeta,
  sceneChallenge,
  triggerLabSignals,
  currentCase,
  node,
  triggerLabels,
  narrativeSpine,
  suspenseState,
  questSteps,
  simplifyPlayerText,
}) {
  return (
        <>
        <section className="game-hud">
          <article className={`risk-card ${riskTier.toLowerCase()}`}>
            <span>위험</span>
            <strong>{easyRiskLabels[riskTier] ?? riskTier}</strong>
            <p>{riskPressure} 압박</p>
          </article>
          <article>
            <span>지금 받는 보너스</span>
            <strong>{simplifyPlayerText(activeBonus)}</strong>
            <p>자유입력 {freeTextCombo}회 · 평균 {currentAverageResponseTime}s</p>
          </article>
          <article>
            <span>진행 목표</span>
            <strong>{progress}%</strong>
            <p>{log.length}개 판단 기록</p>
          </article>
          <article className={clueCount > 0 ? "clue-hud discovered" : "clue-hud"}>
            <span>숨은 단서</span>
            <strong>{clueCount}/6</strong>
            <p>{clueCount > 0 ? "다음 비밀이 열림" : "장면 목표를 노려보세요"}</p>
          </article>
          <article className={currentChallengeStreak >= 5 ? "streak-hud perfect" : "streak-hud"}>
            <span>플레이 흐름</span>
            <strong>{simplifyPlayerText(momentumTier)}</strong>
            <div className="streak-meter" aria-label={`장면 목표 ${currentChallengeStreak}연속. 다음 보상까지 ${streakRemaining}회`}>
              {Array.from({ length: streakGoal }, (_, step) => (
                <i className={currentChallengeStreak > step ? "filled" : ""} key={step} />
              ))}
              <small>{currentChallengeStreak >= 5 ? "PERFECT RUN" : `${Math.min(streakGoal, currentChallengeStreak)}/${streakGoal}`}</small>
            </div>
            <p>{momentumScore}점 · 다음 보상까지 {streakRemaining}회</p>
          </article>
          <article className={decisionSeconds <= 10 ? "timer-card urgent" : "timer-card"}>
            <span>남은 결정 시간</span>
            <strong>{decisionSeconds}s</strong>
            <div
              className="timer-meter"
              role="progressbar"
              aria-label="남은 결정 시간"
              aria-valuemin="0"
              aria-valuemax="45"
              aria-valuenow={decisionSeconds}
              aria-valuetext={`${decisionSeconds}초`}
            >
              <div style={{ width: `${Math.min(100, Math.max(0, (decisionSeconds / 45) * 100))}%` }} />
            </div>
            <p>
              {decisionSeconds === 0
                ? "시간·피로 비용 적용됨"
                : decisionSeconds <= 10
                  ? "다음 판단이 닫히기 전"
                  : "빠른 챌린지 적중 보너스 가능"}
            </p>
          </article>
        </section>

        <section className="live-ledger" aria-label="누적 판단 원장">
          <div>
            <span>선택 기록</span>
            <strong>{simplifyPlayerText(decisionFingerprint.modeTitle)}</strong>
          </div>
          <div className="live-ledger-stats">
            <span>압박 변화 <b>{decisionLedger.netRiskDelta > 0 ? "+" : ""}{decisionLedger.netRiskDelta}</b></span>
            <span>회복 선택 <b>{decisionLedger.riskDrops}</b></span>
            <span>누적 비용 <b>{decisionLedger.strongestCost ? `${resourceMeta[decisionLedger.strongestCost[0]]?.label ?? decisionLedger.strongestCost[0]} ${decisionLedger.strongestCost[1]}` : "없음"}</b></span>
          </div>
        </section>

        <section className="scene-challenge">
          <div>
            <span>이번 장면 목표</span>
          <strong>{sceneChallenge.title}</strong>
          </div>
        <p>{sceneChallenge.text}</p>
        </section>

        {riskPressure >= 60 && (
          <section className={protocolUsed ? "protocol-panel used" : "protocol-panel"}>
            <div>
              <span>EMERGENCY OPTION</span>
              <strong>{protocolUsed ? "위기 프로토콜 사용 완료" : "위기 프로토콜"}</strong>
              <p>
                {protocolUsed
                  ? "이번 케이스에서는 더 이상 구조 개입을 요청할 수 없습니다. 이제 남은 비용을 감당해야 합니다."
                  : "시간과 현금을 더 내어놓고 판단 기준을 공개 절차로 묶습니다. 케이스당 한 번만 사용할 수 있습니다."}
              </p>
            </div>
            {!protocolUsed && (
              <GuardedButton type="button" onClick={activateCrisisProtocol} disabled={isAdvancing}>
                <Shield size={16} />
                프로토콜 발동
              </GuardedButton>
            )}
          </section>
        )}

        <details className="insight-drawer quest-drawer">
          <summary>
            <span>QUESTS</span>
            <b>{questSteps.filter((quest) => quest.complete).length}/{questSteps.length} 완료</b>
          </summary>
          <div className="quest-panel" aria-label="현재 플레이 퀘스트">
            {questSteps.map((quest) => (
              <article className={quest.complete ? "quest-step complete" : "quest-step"} key={quest.title}>
                <span>
                  <Check size={15} />
                  {quest.title}
                </span>
                <strong>{quest.value}</strong>
                <p>{quest.text}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="insight-drawer trace-drawer">
          <summary>
            <span>트리거랩 관찰 기록</span>
            <b>관찰 항목 보기</b>
          </summary>
          <div className="lab-trace">
            <div>
              <span>현재 관찰 중</span>
              <strong>{simplifyPlayerText(triggerLabSignals[currentCase] ?? triggerLabSignals.case01)}</strong>
            </div>
            <p>
              현재 {log.length}개 선택이 기록됐고, {simplifyPlayerText(node.triggers.map((trigger) => triggerLabels[trigger]).join(" / "))}
              압박이 다음 장면 조정값으로 남습니다.
            </p>
          </div>
        </details>

        <details className="insight-drawer clue-drawer" open={clueCount > 0}>
          <summary>
            <span>숨은 단서 보관함</span>
            <b>{clueCount}/6 발견</b>
          </summary>
          {clueCount > 0 ? (
            <div className="clue-grid">
              {discoveredClues.map((clue) => (
                <article key={clue.id}>
                  <span>FOUND</span>
                  <strong>{clue.title}</strong>
                  <p>{clue.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-note">위험을 감수하면서도 이번 장면의 목표를 맞히면 숨은 단서가 나타납니다.</p>
          )}
        </details>

        <section className={`narrative-spine ${suspenseState.tier.toLowerCase()}`} aria-label="이야기 흐름">
          <div className="narrative-spine-heading">
            <span>이야기 흐름 / {String(narrativeSpine.turn).padStart(2, "0")}</span>
            <strong>이번 장면을 읽는 순서</strong>
          </div>
          <div className="narrative-spine-grid">
            <article>
              <span>01 · 지금까지</span>
              <p>{narrativeSpine.previous}</p>
            </article>
            <article>
              <span>02 · 현재 충돌</span>
              <p>{narrativeSpine.conflict}</p>
            </article>
            <article>
              <span>03 · 이번 질문</span>
              <p>{narrativeSpine.question}</p>
            </article>
            <article>
              <span>04 · 다음 파장</span>
              <p>{narrativeSpine.consequence}</p>
            </article>
          </div>
        </section>
        </>
  );
}
