import React from "react";
import { Check, Info, LockKeyhole, MessageSquareText, Send, Sparkles } from "lucide-react";
import { DecisionRail } from "../components/DecisionRail.jsx";
import { DecisionDock } from "../components/DecisionDock.jsx";
import { MemoPanel } from "../components/MemoPanel.jsx";
import { StatusBoard } from "../components/StatusBoard.jsx";
import { GameMetricsDrawer } from "../components/GameMetricsDrawer.jsx";
import { GameHeader } from "../components/GameHeader.jsx";
import { CASE_SEQUENCE } from "../gameData.js";

export function PlayScreen({ view }) {
  const { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, clueCount, discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, decisionSeconds, protocolUsed, isAdvancing, activateCrisisProtocol, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, pressureLensForecast, tradeoffLensForecast, previewChoice, describeForecast, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, formatForecastRisk, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextSignals, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace } = view;
  const formatEffectChip = ([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "상승" : "소모"}`;
  const observerWhisper =
    suspenseState.tier === "REDLINE"
      ? "관찰 기록이 사건 보고보다 먼저 갱신되고 있습니다."
      : suspenseState.tier === "UNSTABLE"
        ? "에코의 질문이 조언보다 검증 절차에 가깝게 변했습니다."
        : currentChallengeStreak > 0
          ? "방금 맞힌 목표가 다음 장면의 기준선으로 남았습니다."
          : "아직 관찰자는 침묵하지만, 선택의 순서는 저장되고 있습니다.";
  const describeChoiceDilemma = (choice) => {
    const entries = Object.entries(choice.effect ?? {}).filter(([, value]) => value !== 0);
    const gains = entries.filter(([, value]) => value > 0).map(([key]) => resourceMeta[key]?.label ?? key);
    const costs = entries.filter(([, value]) => value < 0).map(([key]) => resourceMeta[key]?.label ?? key);
    if (gains.length > 0 && costs.length > 0) return `${gains[0]}을 얻는 대신 ${costs[0]}을 닫습니다.`;
    if (gains.length > 0) return `${gains[0]}은 열리지만, 관찰자는 그 이유를 기록합니다.`;
    if (costs.length > 0) return `${costs[0]}을 먼저 소모해 다음 장면의 문을 엽니다.`;
    return "숫자는 조용하지만, 이 말은 판단 순서를 남깁니다.";
  };
  return (
    <main className={`shell game-shell suspense-${suspenseState.tier.toLowerCase()}`}>
      <AdaptiveMusic modeKey={musicModeKey} />
      {renderDecisionReveal()}
      {renderRecoveryNotice()}
      {renderErrorLogPanel()}
      <a className="skip-link" href="#choice-panel">
        선택지로 건너뛰기
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </p>
      <section className="game-board">
        <details className="game-context-drawer insight-drawer">
          <summary>
            <span>현재 상황판</span>
            <b>목표·압박·위험·자원·기록·장면 목표 한 번에 보기</b>
          </summary>
        <section className="mission-strip">
          <div>
            <span>현재 목표</span>
            <strong>{simplifyPlayerText(caseObjectives[currentCase] ?? caseObjectives.case01)}</strong>
          </div>
          <div>
            <span>이번 장면</span>
            <strong>{simplifyPlayerText(node.phase)}</strong>
          </div>
          <div>
            <span>핵심 압박</span>
            <strong>{simplifyPlayerText(node.triggers.map((trigger) => triggerLabels[trigger]).join(" / "))}</strong>
          </div>
        </section>
        {openingLegacy && (
          <section className="legacy-panel">
            <div>
              <span>{openingLegacy.label}</span>
              <strong>{openingLegacy.title}</strong>
            </div>
            <p>{openingLegacy.text}</p>
            {openingLegacy.continuity && (
              <div className="continuity-bridge">
                <span>직전 사건의 결과</span>
                <strong>{openingLegacy.continuity.title}</strong>
                <p>{openingLegacy.continuity.text}</p>
              </div>
            )}
            <div className="legacy-effect">
              {Object.entries(openingLegacy.effect).map(([key, value]) => (
                <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                </small>
              ))}
            </div>
          </section>
        )}
        <section className={`pressure-cascade ${pressureCascade.tone}`}>
          <div className="pressure-cascade-mark">
            <span>{pressureCascade.label}</span>
            <strong>{riskPressure}</strong>
          </div>
          <div>
            <h2>{pressureCascade.title}</h2>
            <p>{pressureCascade.text}</p>
          </div>
          <small>{pressureCascade.cue}</small>
        </section>
        <section className={`suspense-console ${suspenseState.tier.toLowerCase()}`} aria-label="서스펜스 신호">
          <div className="suspense-console-mark">
            <span>{suspenseState.label}</span>
            <strong>{String(suspenseState.score).padStart(2, "0")}</strong>
          </div>
          <div className="suspense-console-copy">
            <h2>{suspenseState.title}</h2>
            <p>{suspenseState.text}</p>
          </div>
          <div className="suspense-meter" aria-label={`서스펜스 ${suspenseState.score}퍼센트`}>
            <div style={{ width: `${suspenseState.score}%` }} />
            <small>{suspenseState.cue} · 사건 {suspenseState.caseCode}</small>
          </div>
        </section>
        <details className="play-help">
          <summary>
            <span>
              <Info size={16} />
              플레이 규칙
            </span>
            <b>에코, 구조 재설계, 자원 변화를 다시 확인합니다.</b>
          </summary>
          <div className="guide-grid compact-guide">
            {playGuideItems.map((item) => (
              <article key={item.title}>
              <b>{item.title}</b>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </details>
        <GameMetricsDrawer
          riskTier={riskTier}
          easyRiskLabels={easyRiskLabels}
          riskPressure={riskPressure}
          activeBonus={activeBonus}
          freeTextCombo={freeTextCombo}
          currentAverageResponseTime={currentAverageResponseTime}
          progress={progress}
          log={log}
          clueCount={clueCount}
          discoveredClues={discoveredClues}
          currentChallengeStreak={currentChallengeStreak}
          momentumTier={momentumTier}
          streakGoal={streakGoal}
          streakRemaining={streakRemaining}
          momentumScore={momentumScore}
          decisionSeconds={decisionSeconds}
          protocolUsed={protocolUsed}
          isAdvancing={isAdvancing}
          activateCrisisProtocol={activateCrisisProtocol}
          decisionFingerprint={decisionFingerprint}
          decisionLedger={decisionLedger}
          resourceMeta={resourceMeta}
          sceneChallenge={sceneChallenge}
          triggerLabSignals={triggerLabSignals}
          currentCase={currentCase}
          node={node}
          triggerLabels={triggerLabels}
          narrativeSpine={narrativeSpine}
          suspenseState={suspenseState}
          questSteps={questSteps}
          simplifyPlayerText={simplifyPlayerText}
        />
        <MemoPanel
          memo={node.memo}
          onOpen={(event) => event.currentTarget.open && setMemoOpened(true)}
        />

        <details className="echo-panel insight-drawer">
          <summary>
            <span>에코의 검증 질문</span>
            <b>반론 열기</b>
          </summary>
          <p>{echo}</p>
          <div className="echo-probe">
            <div>
              <strong>{probeUsed ? "힌트 사용 완료" : "막혔다면 에코에게 한 번 더 묻기"}</strong>
              <span>{probeUsed ? "이번 장면의 방향성 힌트가 대화에 남았습니다." : `${echoProbeCost}을 지불하고 방향성만 확인합니다.`}</span>
            </div>
            <button type="button" onClick={requestEchoProbe} disabled={probeUsed || isAdvancing}>
              {probeUsed ? "확인됨" : "힌트 요청"}
            </button>
          </div>
          <details className="echo-checks">
            <summary>다시 확인할 것</summary>
            <ul>
              {getEchoChecks(node).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </details>
        </details>
        <GameHeader
          node={node}
          simplify={simplifyPlayerText}
          sceneTitleRef={sceneTitleRef}
          onSave={() => saveCurrentGame()}
          onSaveAndExit={() => saveCurrentGame({ exit: true })}
          onReset={reset}
          caseNumber={Math.max(1, CASE_SEQUENCE.indexOf(currentCase) + 1)}
          caseTotal={CASE_SEQUENCE.length}
          progress={progress}
          decisionSeconds={decisionSeconds}
        />
        {renderSaveStatus()}

        <div className="scene">
          <div className="scene-visual" aria-hidden="true">
            <img
              src={sceneVisuals[currentCase] ?? "/triggerlab-key-visual.png"}
              alt=""
              width="1792"
              height="1024"
              loading="lazy"
            />
          </div>
          <div className="speaker">
            <div>{node.speaker.slice(0, 1)}</div>
            <span>
              <b>{node.speaker}</b>
              <small>{speakerProfile.role} · {speakerProfile.stance}</small>
            </span>
          </div>
          <div className="scene-story">
            <p className="scene-narration"><span className="story-label">상황</span>{speakerProfile.appearance} {speakerProfile.gesture}</p>
            <p className="scene-thought"><span className="story-label">속마음</span>'{speakerProfile.thought}'</p>
            <p className="scene-narration scene-direction"><span className="story-label">지금의 압박</span>{sceneDirection}</p>
            <p className="scene-body"><span className="story-label">사건 보고</span>{node.text}</p>
            {latestFreeTextSuccess && latestFreeTextSuccess.nodeId !== resolvedNodeId && (
              <p className="scene-continuity-quote">
                <span className="story-label">이어진 기록</span>
                이전 문장이 다음 장면의 기준으로 남아 있다: “{latestFreeTextSuccess.freeText}”
              </p>
            )}
            <p className="scene-dialogue"><span className="story-label">중요한 말</span>"{speakerProfile.line}" <span className="story-voice">({speakerProfile.voice})</span></p>
            <p className="observer-whisper"><span className="story-label">관찰자 메모</span>{observerWhisper}</p>
            <div className="scene-stakes" aria-label="이번 장면의 긴장">
              <article>
                <span>걸림돌</span>
                <b>{sceneChallenge.title}</b>
                <small>{sceneChallenge.text}</small>
              </article>
              <article>
                <span>가장 크게 새는 압박</span>
                <b>{pressureLeader?.label ?? "현재 압박"}</b>
                <small>{pressureLeader ? "이 축이 다음 선택의 대가를 가장 크게 흔듭니다." : "아직 뚜렷한 압박은 없습니다."}</small>
              </article>
              <article>
                <span>다음 질문</span>
                <b>{narrativeSpine.consequence}</b>
                <small>{triggerLabSignals[currentCase]}</small>
              </article>
            </div>
          </div>
        </div>

        {latestBeat && (
          <section className="scene-beat">
            <div className="panel-title-row">
              <h2>
                <MessageSquareText size={17} />
                직전 선택의 여운
              </h2>
              <span>선택이 회의실의 대화와 침묵을 어떻게 바꿨는지 기록합니다.</span>
            </div>
            <div className="scene-beat-preview">
              {renderSceneLines(latestBeat.split("\n").slice(0, 2).join("\n"))}
            </div>
            <details className="scene-beat-more">
              <summary>전체 장면 보기</summary>
              <div>{renderSceneLines(latestBeat)}</div>
            </details>
          </section>
        )}

        <section className="choice-panel" id="choice-panel" tabIndex={-1}>
          <DecisionRail pendingChoice={pendingChoice} />
          <div className="choice-heading">
            <h2>어떻게 말할까</h2>
            <p>
              어떤 선택도 무료가 아닙니다. 지금 고르는 말은 한 자원을 올리는 대신 다른
              부담을 다음 장면으로 넘깁니다.
            </p>
            <div className="turn-tactic">
              <span>이번 턴 공략</span>
              <strong>{sceneChallenge.title}</strong>
              <p>
                {showTacticalDetails
                  ? "챌린지 달성 가능성, 위험 압력 변화, 사고 가속 보상을 계산한 전술 정보입니다."
                  : "먼저 장면과 대화만 보고 판단해 보세요. 필요한 경우 전술 정보를 열 수 있습니다."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="tactical-toggle"
            onClick={() => setShowTacticalDetails((value) => !value)}
            aria-expanded={showTacticalDetails}
          >
            <Info size={15} />
            {showTacticalDetails ? "전술 정보 닫기" : "전술 정보 열기"}
          </button>
          {showTacticalDetails && (
            <section className="tactical-brief" aria-label="판단 힌트">
              <div className="forecast-header">
                <div className="forecast-options" aria-label="Choice pressure comparison">
                  {decisionForecasts.map(({ choice, forecast }) => (
                    <article key={choice.id} className={`forecast-option ${forecast.forecastPrecision}`}>
                      <strong>{choice.label}</strong>
                      <span>
                        {forecast.forecastPrecision === "precise"
                          ? `Risk ${formatRiskDelta(forecast.riskDelta)}`
                          : `Risk ${formatRiskDelta(forecast.riskDeltaMin)} ~ ${formatRiskDelta(forecast.riskDeltaMax)}`}
                      </span>
                      <small>{forecast.forecastPrecision === "precise" ? "Precise forecast" : "Gather evidence to narrow this range"}</small>
                    </article>
                  ))}
                </div>
                <span>판단 힌트</span>
                <strong>{pressureLeader ? pressureLeader.label : "현재 압박"}을 먼저 확인하세요</strong>
                <p>
                  이 보기는 정답을 계산하지 않고, 각 선택이 어느 방향의 부담을 만들 수 있는지만 보여줍니다.
                  정확한 수치와 등급은 선택 후 결과 로그에서 확인합니다.
                </p>
              </div>
            </section>
          )}
          {pendingChoice && pendingChoiceRead && pendingChoiceForecast && (
            <section
              ref={commitConsoleRef}
              className={`commit-console ${suspenseState.tier.toLowerCase()}`}
              aria-label="선택 확정 콘솔"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="commit-console-heading">
                <span>선택 확인</span>
                <strong>이 말을 실제로 남기겠습니까?</strong>
              </div>
              <p className="commit-console-choice">“{speechifyChoice(pendingChoice)}”</p>
              <div className="commit-console-readout">
                <span>예상 위험 <b>{formatForecastRisk(pendingChoiceForecast)}</b></span>
                <span>압력 <b>{pendingChoiceForecast.afterRisk}</b></span>
              </div>
              <div className={`commit-console-effects${evidenceCount < 3 ? " is-hidden" : ""}`} aria-label="예상 자원 변화">
                <span>예상 자원</span>
                {evidenceCount >= 3 && Object.entries(pendingChoiceRead.finalEffect)
                  .filter(([, value]) => value !== 0)
                  .map(([key, value]) => (
                    <b key={key} className={value > 0 ? "positive" : "negative"}>
                      {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                    </b>
                  ))}
              </div>
              <div className="commit-console-actions">
                <button type="button" className="commit-cancel" onClick={() => setPendingChoice(null)}>
                  다시 고르기
                </button>
                <button ref={commitConfirmRef} type="button" data-testid="commit-confirm" className="commit-confirm" onClick={() => choose(pendingChoice)}>
                  <LockKeyhole size={16} />
                  이 선택을 기록한다
                </button>
              </div>
            </section>
          )}
          <div className="choices">
            {fixedChoices.map((choice, choiceIndex) => {
              const choiceRead = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
              const projectedRisk = getRiskPressure(choiceRead.finalResources);
              const riskDelta = choiceRead.finalRiskDelta;
              const riskClass =
                riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
              const riskLabel =
                riskDelta > 0
                  ? `위험 +${riskDelta}`
                  : riskDelta < 0
                    ? `위험 ${riskDelta}`
                    : "위험 유지";
              const challengeMatch = getChallengeMatch(choice, choiceRead.baseRiskDelta);
              const pressureHint =
                riskDelta > 0
                  ? "압박이 커질 수 있습니다."
                  : riskDelta < 0
                    ? "압박을 낮출 수 있습니다."
                    : "압박은 크게 움직이지 않습니다.";
              return (
                <button
                  type="button"
                  key={choice.id}
                  ref={(button) => {
                    if (button) choiceButtonsRef.current.set(choice.id, button);
                    else choiceButtonsRef.current.delete(choice.id);
                  }}
                  className={pendingChoice?.id === choice.id ? "choice selected" : "choice"}
                  data-adaptive={choice.adaptive ? "true" : undefined}
                  onClick={() => handleChoiceClick(choice)}
                  onPointerDown={() => beginChoiceHold(choice)}
                  onPointerUp={endChoiceHold}
                  onPointerCancel={endChoiceHold}
                  onPointerLeave={endChoiceHold}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && pendingChoice?.id === choice.id) {
                      event.preventDefault();
                      choose(choice);
                    }
                  }}
                  disabled={isAdvancing}
                  aria-pressed={pendingChoice?.id === choice.id}
                  aria-keyshortcuts={`${choiceIndex + 1} Enter Space`}
                  title={`${choiceIndex + 1}번 키로 선택 미리보기`}
                  aria-label={`${speechifyChoice(choice)} ${riskLabel}. ${getChoiceSubtext(choice)}`}
                >
                  <span className="choice-main">
                    <Check size={16} />
                    <small>{pendingChoice?.id === choice.id ? "검토 중" : "선택"}</small>
                  </span>
                  {choice.branchId && <span className="choice-branch-tag">ROUTE SPLIT</span>}
                  <span className="choice-speech">"{speechifyChoice(choice)}"</span>
                  <span className="choice-dilemma">{describeChoiceDilemma(choice)}</span>
                  <span className="choice-stakes">
                    {Object.entries(choice.effect ?? {})
                      .filter(([, value]) => value !== 0)
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .slice(0, 3)
                      .map((entry) => (
                        <b key={entry[0]} className={entry[1] > 0 ? "positive" : "negative"}>
                          {formatEffectChip(entry)}
                        </b>
                      ))}
                  </span>
                  <span className="choice-action">{getDramaticChoiceLabel(choice)}</span>
                  {!showTacticalDetails && <span className="choice-effect choice-effect-compact">{getChoiceSubtext(choice)}</span>}
                  {challengeMatch && <span className="challenge-match">{simplifyPlayerText(challengeMatch)}</span>}
                  {showTacticalDetails && (
                    <>
                      <span className="choice-tactical">
                        <span>
                          <strong>방향 힌트</strong>
                          <small>{pressureHint}</small>
                        </span>
                      </span>
                      {choiceRead.flowSurge && (
                        <span className="choice-surge">
                          {simplifyPlayerText(choiceRead.flowSurge.label)} · 추가 보정이 붙습니다. 정확한 폭은 선택 후 기록에서 확인합니다.
                        </span>
                      )}
                      <span className="choice-subtext">{getChoiceSubtext(choice)}</span>
                    </>
                  )}
                  {!showTacticalDetails && (
                    <span className="choice-intuition-hint">
                      바로 선택 · 장면 목표를 맞히면 직감 보너스
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {freeChoice && (
            <div className="reframe-box">
              <div className="panel-title-row">
                <h2>
                  <Sparkles size={17} />
                  구조 재설계
                </h2>
                <span>기존 선택지 대신 이해관계자, 조건, 순서를 새로 짠다</span>
              </div>
              <div className="prompt-chips">
                {boardChangePrompts.map((prompt) => (
                  <button type="button" key={prompt} onClick={() => updateFreeText(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <textarea
                value={freeText}
                onChange={(event) => updateFreeText(event.target.value)}
                maxLength={FREE_TEXT_MAX_LENGTH}
                placeholder="예: 누구를 새로 협상장에 부를지, 어떤 조건을 교환할지, 어떤 정보를 먼저 확인할지 적는다."
                aria-label="구조 재설계 자유입력"
                aria-describedby={
                  freeTextBlockedByPrivacy
                    ? "reframe-input-note reframe-privacy-warning"
                    : "reframe-input-note"
                }
              />
              <p className="input-note" id="reframe-input-note">
                자유입력은 로그에 남을 수 있습니다. 실제 개인정보나 식별 가능한 회사명은 쓰지 마세요.{" "}
                {freeText.length}/{FREE_TEXT_MAX_LENGTH}
              </p>
              {activePrivacySignals.length > 0 && (
                <div className="privacy-warning" id="reframe-privacy-warning" role="alert">
                  <strong>식별 정보로 보일 수 있는 표현이 있습니다.</strong>
                  <p>
                    감지 항목: {activePrivacySignals.map((signal) => signal.label).join(" / ")}.
                    제출하려면 실제 이름, 연락처, 회사명을 가상의 역할명이나 익명 표현으로 바꿔주세요.
                  </p>
                  <button type="button" onClick={anonymizeFreeText}>
                    감지 표현 익명화
                  </button>
                </div>
              )}
              {freeText.trim() && (
                <div className="reframe-speech">
                  <span>발화 예고</span>
                  <p>"{freeText.trim()}"</p>
                  <small>
                    준비된 선택지 밖으로 나가면, 이 문장이 그대로 장면 로그와 에코의 반론에 남습니다.
                  </small>
                </div>
              )}
              <div className="reframe-signals">
                <div>
                  <span>반영 기준</span>
                  <b>{activeFreeTextSignalCount}/4</b>
                </div>
                {sceneChallenge.id === "use-reframe" && activeFreeTextSignalCount >= 2 && (
                  <strong className="reframe-challenge-hit">챌린지 달성 가능</strong>
                )}
                <ul>
                  {freeTextSignals.map((signal) => (
                    <li className={signal.active ? "active" : ""} key={signal.id}>
                      <Check size={14} />
                      <span>
                        <b>{signal.label}</b>
                        <small>{signal.hint}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p>
                  두 개 이상 채워지면 선택지 밖의 제안이 단순 의견이 아니라 판을 바꾸는
                  계획으로 기록됩니다.
                </p>
              </div>
              {freeTextPreview && (
                <div className="reframe-preview">
                  <span>예상 반영</span>
                  <p>{explainResourceTradeoff(freeTextPreview.effect)}</p>
                  {(() => {
                    const projectedRisk = getRiskPressure(applyEffect(resources, freeTextPreview.effect));
                    const riskDelta = projectedRisk - riskPressure;
                    const riskClass =
                      riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
                    const riskLabel =
                      riskDelta > 0
                        ? `위험 +${riskDelta}`
                        : riskDelta < 0
                          ? `위험 ${riskDelta}`
                          : "위험 유지";
                    return (
                      <div>
                        <small className={`preview-risk ${riskClass}`}>
                          {riskLabel} · 예상 압력 {projectedRisk}
                        </small>
                      </div>
                    );
                  })()}
                  <div>
                    {Object.entries(freeTextPreview.effect).map(([key, value]) => (
                      <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                        {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                        {value}
                      </small>
                    ))}
                  </div>
                  <div>
                    {Object.entries(freeTextPreview.cognition)
                      .filter(([, value]) => value > 0)
                      .map(([key, value]) => (
                        <small key={key} className="cognition-preview">
                          {easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +{value}
                        </small>
                      ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                className="choice free-choice submit-reframe"
                onClick={() => choose(freeChoice)}
                disabled={!freeText.trim() || freeTextBlockedByPrivacy || isAdvancing}
                aria-label={
                  freeTextBlockedByPrivacy
                    ? "식별 정보로 보일 수 있는 표현을 익명화해야 구조 재설계를 제출할 수 있습니다."
                    : freeText.trim()
                      ? `구조 재설계 제출. ${freeText.trim()}`
                      : "구조 재설계 내용을 입력해야 제출할 수 있습니다."
                }
              >
                <span className="choice-main">
                  <Send size={16} />
                  {freeChoice.label}
                </span>
              </button>
            </div>
          )}
        </section>
        {pendingChoiceRead && (
          <DecisionDock
            pendingChoice={pendingChoice}
            pendingChoiceForecast={pendingChoiceForecast}
            suspenseTier={suspenseState.tier}
            onCancel={() => setPendingChoice(null)}
            onConfirm={() => choose(pendingChoice)}
            isAdvancing={isAdvancing}
            speechify={speechifyChoice}
            formatRiskDelta={formatRiskDelta}
            formatForecastRisk={formatForecastRisk}
          />
        )}
      </section>
      <StatusBoard
        playerName={playerName}
        activePlayStyle={activePlayStyle}
        turnBriefItems={turnBriefItems}
        sceneChallenge={sceneChallenge}
        resourceMeta={resourceMeta}
        resources={resources}
        node={node}
        speakerProfile={speakerProfile}
        triggerLabels={triggerLabels}
        progress={progress}
        log={log}
        completedCases={completedCases}
        activeCaseMeta={activeCaseMeta}
      />
      {debugToolsEnabled && (
        <aside className="debug-overlay" data-testid="debug-overlay" aria-label="개발자 진행 추적">
          <div className="debug-overlay-heading">
            <span>DEBUG</span>
            <b>{fallbackCaseId} / {resolvedNodeId}</b>
          </div>
          <dl>
            <div><dt>path</dt><dd>{Math.max(0, routeIndex) + 1}/{routeLength}</dd></div>
            <div><dt>risk</dt><dd>{riskPressure} · {riskTier}</dd></div>
            <div><dt>resources</dt><dd>{Object.entries(resources).map(([key, value]) => `${key}:${value}`).join(" ")}</dd></div>
            <div><dt>silent</dt><dd>{silentFailureCount}</dd></div>
          </dl>
          <button type="button" className="ghost" data-testid="copy-replay-link" onClick={copyReplayLink}>Copy replay link</button>
          <button type="button" className="ghost" onClick={copyDiagnosticTrace}>Copy trace</button>
        </aside>
      )}
    </main>
);
}
